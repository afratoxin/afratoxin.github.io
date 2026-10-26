/**
 * Reproducible build (packages and the model cache are outside the published site):
 * npm install --prefix ../.search-work/semantic-runtime @huggingface/transformers@3.8.1
 * node scripts/build-search-index.mjs --runtime ../.search-work/semantic-runtime/node_modules/@huggingface/transformers/dist/transformers.node.mjs --evaluate
 * Add --evaluate-only to repeat genuine query evaluation against an existing index.
 */
import {readFile, writeFile, mkdir, appendFile, truncate} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {resolve, dirname, join} from 'node:path';
import {SEMANTIC_MODEL, SEMANTIC_RUNTIME, validateSemanticIndex, scoreSemanticIndex} from '../semantic-index.mjs';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const work = resolve(site, '../.search-work');
const options = process.argv.slice(2);
const option = (name, fallback) => options.includes(name) ? options[options.indexOf(name) + 1] : fallback;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const runtimePath = resolve(option('--runtime', join(work, 'semantic-runtime/node_modules/@huggingface/transformers/dist/transformers.node.mjs')));
const cacheDir = resolve(option('--cache', join(work, 'semantic-runtime/model-cache')));
const batchSize = Number(option('--batch-size', '8'));
if (!Number.isSafeInteger(batchSize) || batchSize < 1 || batchSize > 64) throw new Error('Batch size must be between1 and64');
const started = Date.now();
await mkdir(work, {recursive: true});
const {pipeline, env} = await import(pathToFileURL(runtimePath).href);
if (env.version !== SEMANTIC_RUNTIME.version) throw new Error(`Expected Transformers.js${SEMANTIC_RUNTIME.version}, got${env.version}`);
env.cacheDir = cacheDir;
const embed = await pipeline('feature-extraction', SEMANTIC_MODEL.id, {
  revision: SEMANTIC_MODEL.revision, dtype: SEMANTIC_MODEL.dtype, device: 'cpu',
  session_options: {intra_op_num_threads: 4, inter_op_num_threads: 1},
  progress_callback: event => { if (event.status === 'ready') console.log(`Model ready: ${event.model}`); }
});

let index, manifest;
const indexPath = join(site, 'data/reference-embeddings.json');
const manifestPath = join(site, 'data/reference-search-manifest.json');
if (options.includes('--evaluate-only')) {
  const bytes = await readFile(indexPath);
  index = JSON.parse(bytes);
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (hash(bytes) !== manifest.indexSha256) throw new Error('Index checksum mismatch');
} else {
  const {buildSearchDocuments} = await import('../reference-search.mjs');
  const sourceBytes = await readFile(join(site, 'data/archive.json'));
  const questions = JSON.parse(sourceBytes).questions;
  const documents = buildSearchDocuments(questions);
  const byId = new Map();
  for (const document of documents) {
    if (!byId.has(document.id)) byId.set(document.id, []);
    if (typeof document.text !== 'string' || !document.text.trim()) throw new Error(`Empty document ${document.id}`);
    byId.get(document.id).push(document);
  }
  if (questions.length !== 755 || byId.size !== questions.length || questions.some(q => !byId.has(q.id))) throw new Error('Index must cover all755 public questions');
  const grouped = [], records = [];
  for (const [id, passages] of byId) {
    records.push({id, start: grouped.length, count: passages.length});
    grouped.push(...passages);
  }
  const sourceSha256 = hash(sourceBytes), documentSha256 = hash(JSON.stringify(grouped));
  const checkpointBase = join(work, `embeddings-${SEMANTIC_MODEL.revision.slice(0, 12)}-${documentSha256.slice(0, 16)}`);
  let completed = 0;
  try {
    completed = JSON.parse(await readFile(checkpointBase + '.json', 'utf8')).completed;
    const bytes = await readFile(checkpointBase + '.bin');
    if (!Number.isSafeInteger(completed) || completed < 0 || completed > grouped.length || bytes.length < completed * SEMANTIC_MODEL.dimensions) throw new Error('Invalid checkpoint');
    await truncate(checkpointBase + '.bin', completed * SEMANTIC_MODEL.dimensions);
  } catch {
    completed = 0;
    await writeFile(checkpointBase + '.bin', new Uint8Array());
  }
  console.log(`Embedding ${grouped.length} documents / ${questions.length} questions; resume at${completed}; batch${batchSize}`);
  const reusable=new Map();let reused=0;
  try{
    const old=JSON.parse(await readFile(indexPath,'utf8')),oldManifest=JSON.parse(await readFile(manifestPath,'utf8'));
    const checked=validateSemanticIndex(old,oldManifest);
    for(const [row,passage] of (old.passages||[]).entries())reusable.set(passage.text,checked.vectors.subarray(row*SEMANTIC_MODEL.dimensions,(row+1)*SEMANTIC_MODEL.dimensions));
  }catch{/* A missing or incompatible old index is simply not reused. */}
  // Length-bucket a small window to avoid padding short explanations to long
  // source passages. Store vectors in original order so passage provenance stays exact.
  const windowSize=batchSize*8;
  for (let offset = completed; offset < grouped.length; offset += windowSize) {
    const window=grouped.slice(offset,offset+windowSize).map((document,local)=>({...document,local})).sort((a,b)=>a.text.length-b.text.length);
    const quantizedWindow=new Int8Array(window.length*SEMANTIC_MODEL.dimensions);
    const missing=window.filter(document=>{const vector=reusable.get(document.text);if(!vector)return true;quantizedWindow.set(vector,document.local*SEMANTIC_MODEL.dimensions);reused++;return false;});
    for(let within=0;within<missing.length;within+=batchSize){
    const batch = missing.slice(within,within+batchSize);
    const tensor = await embed(batch.map(document => SEMANTIC_MODEL.passagePrefix + document.text), {pooling: SEMANTIC_MODEL.pooling, normalize: SEMANTIC_MODEL.normalize, truncation: true, max_length: 512});
    if (tensor.dims[0] !== batch.length || tensor.dims[1] !== SEMANTIC_MODEL.dimensions) throw new Error('Embedding shape mismatch');
    const quantized = new Int8Array(tensor.data.length);
    for (let row = 0; row < batch.length; row++) {
      const base = row * SEMANTIC_MODEL.dimensions;
      let maximum = 0;
      for (let col = 0; col < SEMANTIC_MODEL.dimensions; col++) {
        const value = tensor.data[base + col];
        if (!Number.isFinite(value)) throw new Error('Nonfinite embedding');
        maximum = Math.max(maximum, Math.abs(value));
      }
      if (maximum === 0) throw new Error('Zero embedding');
      for (let col = 0; col < SEMANTIC_MODEL.dimensions; col++) quantized[base + col] = Math.round(tensor.data[base + col] / maximum * 127);
    }
    for(let row=0;row<batch.length;row++)quantizedWindow.set(quantized.subarray(row*SEMANTIC_MODEL.dimensions,(row+1)*SEMANTIC_MODEL.dimensions),batch[row].local*SEMANTIC_MODEL.dimensions);
    }
    await appendFile(checkpointBase + '.bin', quantizedWindow);
    completed = offset + window.length;
    await writeFile(checkpointBase + '.json', JSON.stringify({completed, documentSha256}));
    if (Math.floor(offset / 100) !== Math.floor(completed / 100) || completed === grouped.length) console.log(`${completed}/${grouped.length} documents; ${((Date.now() - started) / 1000).toFixed(1)}s`);
  }
  const vectors = (await readFile(checkpointBase + '.bin')).toString('base64');
  console.log(`Reused ${reused} unchanged passage vectors`);
  index = {formatVersion: 1, modelRevision: SEMANTIC_MODEL.revision, dimensions: SEMANTIC_MODEL.dimensions, encoding: 'int8-base64', questionCount: questions.length, documentCount: grouped.length, sourceSha256, documentSha256, records, vectors,passages:grouped};
  const indexBytes = JSON.stringify(index);
  manifest = {formatVersion: 1, evidenceVersion:1, runtime: SEMANTIC_RUNTIME, model: SEMANTIC_MODEL, encoding: index.encoding, questionCount: questions.length, documentCount: grouped.length, sourceSha256, documentSha256, indexSha256: hash(indexBytes), indexBytes: Buffer.byteLength(indexBytes), builtAt: new Date().toISOString(), buildSeconds: Number(((Date.now() - started) / 1000).toFixed(1)), buildCommand: 'node scripts/build-search-index.mjs --runtime ../.search-work/semantic-runtime/node_modules/@huggingface/transformers/dist/transformers.node.mjs --evaluate', chunking: {sourceCharacters: 500, strideCharacters: 380, metadataFirst: true}, vectorQuantization: 'Per-vector max-absolute int8; cosine renormalizes stored vectors.'};
  validateSemanticIndex(index, manifest);
  await writeFile(indexPath, indexBytes);
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Wrote ${manifest.indexBytes} bytes; ${manifest.documentCount} vectors; ${manifest.buildSeconds}s`);
}

const decoded = validateSemanticIndex(index, manifest);
if (options.includes('--evaluate') || options.includes('--evaluate-only')) {
  const {rankReferences} = await import('../reference-search.mjs');
  const questions = JSON.parse(await readFile(join(site, 'data/archive.json'), 'utf8')).questions;
  const queries = [
    '인문 논리학 소재의, 2명이 서로 싸우는 문항',
    '엄마랑 자식이 공부 안 하는 것도 원인이 되는지 논쟁',
    '홈즈 콧구멍 가지고 소설에서 참인 게 뭔지 싸우는 문제',
    '서로 주먹으로 때리고 몸싸움하는 두 사람',
    '세 명이 서로 누가 거짓말하는지 추리하는 퍼즐',
    '아무 관련 없는 무지개 고양이 우주케이크',
    'asdfghjklqwerty',
    'ㅁㄴㅇㄹㅋㅌㅊ',
    '젤라토 레시피 마스카포네',
    '멈춰 있는 선택이 누군가의 행복을 바꿀 수 있나'
  ];
  const evaluation = [];
  for (const query of queries) {
    const queryStarted = Date.now();
    const tensor = await embed(SEMANTIC_MODEL.queryPrefix + query, {pooling: SEMANTIC_MODEL.pooling, normalize: SEMANTIC_MODEL.normalize, truncation: true, max_length: 512});
    const scores = scoreSemanticIndex(decoded, tensor.data);
    const topCosines = [...scores].sort((a, b) => b[1] - a[1]).slice(0, 10);
    const combined = rankReferences(questions, query, {semanticScores: scores}).slice(0, 10).map(({id, score}) => ({id, score, cosine: scores.get(id)}));
    evaluation.push({query, milliseconds: Date.now() - queryStarted, topCosines, combined, goldCosines: Object.fromEntries(['1321', '1512', '1717', '2218', '2318', '2523'].map(id => [id, scores.get(id)])), scores: Object.fromEntries(scores)});
    console.log(JSON.stringify({...evaluation.at(-1), scores: undefined}));
  }
  await writeFile(join(work, 'semantic-evaluation.json'), JSON.stringify({model: SEMANTIC_MODEL, evaluatedAt: new Date().toISOString(), evaluation}, null, 2));
}
await embed.dispose();
console.log(`Done in${((Date.now() - started) / 1000).toFixed(1)}s`);
