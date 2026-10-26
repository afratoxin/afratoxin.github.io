function assetUrl(path) {
  const url = new URL(path, import.meta.url);
  url.search = new URL(import.meta.url).search;
  return url;
}
// Register the message listener synchronously. Top-level await would lose the
// first postMessage while the module worker is waiting for this network import.
const scoringModule = import(assetUrl('./semantic-index.mjs').href);

let resources, pending, running = false, latestRequestId = 0;
const status = (state, extra = {}) => self.postMessage({type: 'status', requestId: latestRequestId, state, ...extra});

async function initialize() {
  if (!resources) resources = (async () => {
    const {SEMANTIC_MODEL, SEMANTIC_RUNTIME, validateSemanticManifest, validateSemanticIndex, scoreSemanticEvidence} = await scoringModule;
    status('loading', {message: '처음 한 번 약118MB 모델과 실행 자료를 내려받습니다. 다음에는 브라우저 캐시를 사용합니다.'});
    const manifestResponse = await fetch(assetUrl('./data/reference-search-manifest.json'));
    if (!manifestResponse.ok) throw new Error('Search manifest unavailable');
    const manifest = validateSemanticManifest(await manifestResponse.json());
    const [indexResponse, transformers] = await Promise.all([
      fetch(assetUrl('./data/reference-embeddings.json')),
      import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1')
    ]);
    if (!indexResponse.ok || transformers.env.version !== SEMANTIC_RUNTIME.version) throw new Error('Search runtime unavailable');
    const indexBytes = await indexResponse.arrayBuffer();
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', indexBytes)), byte => byte.toString(16).padStart(2, '0')).join('');
    if (digest !== manifest.indexSha256) throw new Error('Search index integrity mismatch');
    const index = validateSemanticIndex(JSON.parse(new TextDecoder().decode(indexBytes)), manifest);
    const {pipeline, env} = transformers;
    env.allowLocalModels = false;
    env.useBrowserCache = true;
    // Single-threaded WASM also works on Pages without cross-origin isolation.
    env.backends.onnx.wasm.numThreads = 1;
    env.backends.onnx.wasm.proxy = false;
    const embed = await pipeline('feature-extraction', SEMANTIC_MODEL.id, {
      revision: SEMANTIC_MODEL.revision, dtype: SEMANTIC_MODEL.dtype, device: 'wasm',
      progress_callback(event) {
        if (event.status === 'progress' && event.file?.endsWith('.onnx')) status('loading', {progress: event.progress});
      }
    });
    return {index, embed, model:SEMANTIC_MODEL, score:scoreSemanticEvidence};
  })();
  return resources;
}

async function drain() {
  if (running) return;
  running = true;
  try {
    const {index, embed, model, score} = await initialize();
    while (pending) {
      const request = pending;
      pending = null;
      if (request.requestId !== latestRequestId) continue;
      status('searching');
      const result = await embed(model.queryPrefix + request.query, {pooling: model.pooling, normalize: model.normalize, truncation: true, max_length: 512});
      if (request.requestId !== latestRequestId) continue;
      const {scores,evidence} = score(index, result.data);
      self.postMessage({type: 'result', requestId: request.requestId, scores: [...scores],evidence:[...evidence]});
    }
  } catch {
    self.postMessage({type: 'error', requestId: latestRequestId});
    pending = null;
  } finally {
    running = false;
  }
}

self.addEventListener('message', ({data}) => {
  if (data?.type !== 'search' || !Number.isSafeInteger(data.requestId) || typeof data.query !== 'string') return;
  latestRequestId = data.requestId;
  pending = {requestId: data.requestId, query: data.query};
  void drain();
});
