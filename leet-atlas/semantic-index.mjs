export const SEMANTIC_RUNTIME = Object.freeze({library: '@huggingface/transformers', version: '3.8.1'});
export const SEMANTIC_MODEL = Object.freeze({
  id: 'Xenova/multilingual-e5-small',
  revision: '761b726dd34fb83930e26aab4e9ac3899aa1fa78',
  dtype: 'q8', pooling: 'mean', normalize: true, dimensions: 384,
  queryPrefix: 'query: ', passagePrefix: 'passage: '
});
const sha256 = /^[a-f0-9]{64}$/;
const requireValid = (condition, reason) => { if (!condition) throw new Error(`Invalid semantic index: ${reason}`); };

export function validateSemanticManifest(manifest) {
  requireValid(manifest?.formatVersion === 1 && manifest.encoding === 'int8-base64', 'unsupported format');
  for (const [key, value] of Object.entries(SEMANTIC_RUNTIME)) requireValid(manifest.runtime?.[key] === value, `runtime ${key}`);
  for (const [key, value] of Object.entries(SEMANTIC_MODEL)) requireValid(manifest.model?.[key] === value, `model ${key}`);
  requireValid(Number.isInteger(manifest.questionCount) && manifest.questionCount > 0 && Number.isInteger(manifest.documentCount) && manifest.documentCount >= manifest.questionCount, 'counts');
  for (const key of ['sourceSha256', 'documentSha256', 'indexSha256']) requireValid(sha256.test(manifest[key]), key);
  return manifest;
}

/** Validate both metadata and vector layout before any similarity is exposed. */
export function validateSemanticIndex(index, manifest) {
  validateSemanticManifest(manifest);
  requireValid(index?.formatVersion === 1 && index.encoding === manifest.encoding && index.modelRevision === SEMANTIC_MODEL.revision && index.dimensions === SEMANTIC_MODEL.dimensions, 'index/model mismatch');
  for (const key of ['questionCount', 'documentCount', 'sourceSha256', 'documentSha256']) requireValid(index[key] === manifest[key], key);
  requireValid(Array.isArray(index.records) && index.records.length === manifest.questionCount, 'records');
  const ids = new Set();
  let offset = 0;
  for (const record of index.records) {
    requireValid(typeof record.id === 'string' && /^(?:\d{4}|p\d{3})$/.test(record.id) && !ids.has(record.id), 'record ID');
    requireValid(record.start === offset && Number.isInteger(record.count) && record.count > 0, 'record range');
    ids.add(record.id);
    offset += record.count;
  }
  requireValid(offset === manifest.documentCount, 'missing documents');
  requireValid(typeof index.vectors === 'string' && index.vectors.length % 4 === 0 && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(index.vectors), 'base64');
  const binary = atob(index.vectors);
  requireValid(binary.length === manifest.documentCount * SEMANTIC_MODEL.dimensions, 'vector bytes');
  const vectors = new Int8Array(binary.length);
  for (let i = 0; i < binary.length; i++) vectors[i] = binary.charCodeAt(i);
  const inverseNorms = new Float32Array(manifest.documentCount);
  for (let row = 0; row < inverseNorms.length; row++) {
    let square = 0;
    for (let col = 0; col < index.dimensions; col++) { const v = vectors[row * index.dimensions + col]; square += v * v; }
    requireValid(square > 0, 'zero vector');
    inverseNorms[row] = 1 / Math.sqrt(square);
  }
  return {records: index.records, vectors, inverseNorms, dimensions: index.dimensions};
}

/** E5 raw cosine: retain the best source passage while giving metadata a small vote. */
export function scoreSemanticIndex(index, query) {
  requireValid(query?.length === index.dimensions && Array.from(query).every(Number.isFinite), 'query dimensions');
  const norm = Math.sqrt(Array.from(query).reduce((sum, value) => sum + value * value, 0));
  requireValid(norm > 0, 'zero query');
  const scores = new Map();
  for (const {id, start, count} of index.records) {
    let maximum = -1, metadata = 0;
    for (let row = start; row < start + count; row++) {
      let dot = 0;
      for (let col = 0; col < index.dimensions; col++) dot += query[col] * index.vectors[row * index.dimensions + col];
      const cosine = Math.max(-1, Math.min(1, dot * index.inverseNorms[row] / norm));
      if (row === start) metadata = cosine;
      maximum = Math.max(maximum, cosine);
    }
    scores.set(id, 0.85 * maximum + 0.15 * metadata);
  }
  return scores;
}
