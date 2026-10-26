import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const runtime = await import('../semantic-search.mjs').catch(() => ({}));
const indexModule = await import('../semantic-index.mjs').catch(() => ({}));

function fakeWorker() {
  const worker = {messages: [], terminated: false, listeners: {},
    addEventListener(type, callback) { this.listeners[type] = callback; },
    postMessage(message) { this.messages.push(message); },
    terminate() { this.terminated = true; },
    emit(data) { this.listeners.message?.({data}); },
    fail() { this.listeners.error?.({message: 'network unavailable', preventDefault() {}}); }
  };
  return worker;
}
function create(options) {
  assert.equal(typeof runtime.createSemanticSearch, 'function', 'semantic runtime must be implemented');
  return runtime.createSemanticSearch(options);
}

test('semantic loading is lazy and empty queries do not start downloads', async () => {
  let creations = 0;
  const worker = fakeWorker();
  const service = create({workerFactory() { creations++; return worker; }});
  assert.equal(creations, 0);
  assert.deepEqual(await service.search('  '), new Map());
  assert.equal(creations, 0);
  const result = service.search('서로 논박하는 두 사람');
  assert.equal(creations, 1);
  worker.emit({type: 'result', requestId: worker.messages[0].requestId, scores: [['1321', 0.82]]});
  assert.deepEqual(await result, new Map([['1321', 0.82]]));
  service.dispose();
});

test('older requests resolve empty and cannot overwrite the newest status or scores', async () => {
  const worker = fakeWorker(), statuses = [];
  const service = create({workerFactory: () => worker, onStatus: status => statuses.push(status)});
  const first = service.search('처음'), second = service.search('나중');
  const [a, b] = worker.messages;
  assert.deepEqual(await first, new Map());
  worker.emit({type: 'result', requestId: b.requestId, scores: [['2318', 0.9]]});
  assert.deepEqual(await second, new Map([['2318', 0.9]]));
  const statusCount = statuses.length;
  worker.emit({type: 'status', requestId: a.requestId, state: 'loading', progress: 12});
  worker.emit({type: 'result', requestId: a.requestId, scores: [['1321', 0.8]]});
  assert.equal(statuses.length, statusCount);
  assert.equal(statuses.at(-1).state, 'ready');
  service.dispose();
});

test('empty query cancels an outstanding request without accepting its late answer', async () => {
  const worker = fakeWorker(), statuses = [];
  const service = create({workerFactory: () => worker, onStatus: status => statuses.push(status)});
  const pending = service.search('앞선 문장');
  const requestId = worker.messages[0].requestId;
  assert.deepEqual(await service.search(''), new Map());
  assert.deepEqual(await pending, new Map());
  const count = statuses.length;
  worker.emit({type: 'result', requestId, scores: [['1321', 0.8]]});
  assert.equal(statuses.length, count);
  service.dispose();
});

test('worker failures fall back without rejecting or repeatedly starting downloads', async () => {
  const worker = fakeWorker(), statuses = [];
  let creations = 0;
  const service = create({workerFactory() { creations++; return worker; }, onStatus: status => statuses.push(status)});
  const pending = service.search('논쟁');
  worker.fail();
  assert.deepEqual(await pending, new Map());
  assert.equal(statuses.at(-1).state, 'fallback');
  assert.equal(worker.terminated, true);
  assert.deepEqual(await service.search('다음 문장'), new Map());
  assert.equal(creations, 1);
  service.dispose();
});

test('missing Worker gracefully returns lexical fallback', async () => {
  const statuses = [];
  assert.equal(typeof globalThis.Worker, 'undefined');
  const service = create({onStatus: status => statuses.push(status)});
  assert.deepEqual(await service.search('논쟁'), new Map());
  assert.equal(statuses.at(-1).state, 'fallback');
  service.dispose();
});

test('timeout settles an unresponsive worker and disposal settles pending work', async () => {
  const worker = fakeWorker(), statuses = [];
  const service = create({workerFactory: () => worker, timeoutMs: 8, onStatus: status => statuses.push(status)});
  assert.deepEqual(await service.search('대답 없는 검색'), new Map());
  assert.equal(statuses.at(-1).state, 'fallback');
  assert.equal(worker.terminated, true);
  const otherWorker = fakeWorker();
  const other = create({workerFactory: () => otherWorker});
  const pending = other.search('종료할 검색');
  other.dispose();
  assert.deepEqual(await pending, new Map());
  assert.deepEqual(await other.search('종료 뒤'), new Map());
  assert.equal(otherWorker.terminated, true);
});

test('malformed worker scores cannot become semantic matches', async () => {
  const worker = fakeWorker(), statuses = [];
  const service = create({workerFactory: () => worker, onStatus: status => statuses.push(status)});
  const pending = service.search('논박');
  worker.emit({type: 'result', requestId: worker.messages[0].requestId, scores: [['1321', NaN], ['bad', 0.8]]});
  assert.deepEqual(await pending, new Map());
  assert.equal(statuses.at(-1).state, 'fallback');
  service.dispose();
});

test('numeric score IDs are rejected instead of leaking Map keys that never match questions', async () => {
  const worker = fakeWorker(), statuses = [];
  const service = create({workerFactory: () => worker, onStatus: status => statuses.push(status)});
  const pending = service.search('논박');
  worker.emit({type: 'result', requestId: worker.messages[0].requestId, scores: [[1321, 0.8]]});
  assert.deepEqual(await pending, new Map());
  assert.equal(statuses.at(-1).state, 'fallback');
  service.dispose();
});

test('worker creation carries the parent release query so deployments do not reuse an old worker', async () => {
  const {createSemanticSearch} = await import('../semantic-search.mjs?v=test-release');
  const worker = fakeWorker();
  let workerUrl;
  let service;
  globalThis.Worker = class { constructor(url) { workerUrl = url; return worker; } };
  try {
    service = createSemanticSearch();
    const pending = service.search('새 배포 검색');
    assert.equal(workerUrl.search, '?v=test-release');
    service.dispose();
    await pending;
  } finally { service?.dispose(); delete globalThis.Worker; }
});

test('worker fetches versioned local search assets and reports initialization failure', async () => {
  const originalFetch = globalThis.fetch, urls = [];
  let receive, report;
  const error = new Promise(resolve => { report = resolve; });
  globalThis.self = {
    addEventListener(type, listener) { if (type === 'message') receive = listener; },
    postMessage(message) { if (message.type === 'error') report(message); }
  };
  globalThis.fetch = async url => {
    urls.push(url);
    return url.pathname.endsWith('manifest.json') ? {ok: true, json: async () => indexFixture().manifest} : {ok: false};
  };
  try {
    await import('../semantic-worker.mjs?v=worker-asset-test');
    receive({data: {type: 'search', requestId: 7, query: '비공개 검색 문장'}});
    assert.deepEqual(await error, {type: 'error', requestId: 7});
    assert.deepEqual(urls.map(url => url.pathname.split('/').at(-1)), ['reference-search-manifest.json', 'reference-embeddings.json']);
    assert.ok(urls.every(url => url.search === '?v=worker-asset-test'));
  } finally { globalThis.fetch = originalFetch; delete globalThis.self; }
});

function indexFixture() {
  const bytes = new Int8Array(384 * 3);
  bytes[0] = 127; bytes[384 + 1] = 127; bytes[768] = 127;
  const model = {id: 'Xenova/multilingual-e5-small', revision: '761b726dd34fb83930e26aab4e9ac3899aa1fa78', dtype: 'q8', pooling: 'mean', normalize: true, dimensions: 384, queryPrefix: 'query: ', passagePrefix: 'passage: '};
  const manifest = {formatVersion: 1, runtime: {library: '@huggingface/transformers', version: '3.8.1'}, model, encoding: 'int8-base64', questionCount: 2, documentCount: 3, sourceSha256: 'a'.repeat(64), documentSha256: 'b'.repeat(64), indexSha256: 'c'.repeat(64)};
  const index = {formatVersion: 1, modelRevision: model.revision, dimensions: 384, encoding: 'int8-base64', questionCount: 2, documentCount: 3, sourceSha256: manifest.sourceSha256, documentSha256: manifest.documentSha256, records: [{id: '1321', start: 0, count: 2}, {id: '2318', start: 2, count: 1}], vectors: Buffer.from(bytes.buffer).toString('base64')};
  return {index, manifest};
}

test('a first worker message is queued while its scoring module is still loading', async () => {
  const source = (await readFile(new URL('../semantic-worker.mjs', import.meta.url), 'utf8'))
    .replaceAll('import.meta.url', JSON.stringify('https://example.test/semantic-worker.mjs?v=startup'))
    .replace("import(assetUrl('./semantic-index.mjs').href)", 'loadIndexModule()');
  let receive, release;
  const moduleReady = new Promise(resolve => { release = resolve; });
  let complete;
  const error = new Promise(resolve => { complete = resolve; });
  const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
  const startup = new AsyncFunction('self', 'fetch', 'loadIndexModule', source)(
    {addEventListener(_type, listener) { receive = listener; }, postMessage(message) { if(message.type === 'error') complete(message); }},
    async () => ({ok:false}), () => moduleReady);
  try {
    assert.equal(typeof receive, 'function', 'listen before awaiting module downloads');
    receive({data:{type:'search',requestId:22,query:'first query'}});
    release(indexModule);
    await startup;
    assert.deepEqual(await error, {type:'error',requestId:22});
  } finally { release(indexModule); await startup; }
});

test('index validation rejects incompatible models, missing tails, bad IDs and corrupt vectors', () => {
  assert.equal(typeof indexModule.validateSemanticIndex, 'function', 'index validator must be implemented');
  const {index, manifest} = indexFixture();
  assert.doesNotThrow(() => indexModule.validateSemanticIndex(index, manifest));
  for (const mutate of [
    (i, m) => { m.model.revision = '0'.repeat(40); },
    (i, m) => { m.model.pooling = 'cls'; },
    (i, m) => { m.runtime.version = '9.0.0'; },
    i => { i.records[0].count = 1; },
    i => { i.records[1].id = '1321'; },
    i => { i.records[0].id = 1321; },
    i => { i.vectors = i.vectors.slice(4); },
    i => { i.vectors = '%'.repeat(i.vectors.length); },
    i => { i.documentSha256 = 'd'.repeat(64); },
  ]) {
    const i = structuredClone(index), m = structuredClone(manifest);
    mutate(i, m);
    assert.throws(() => indexModule.validateSemanticIndex(i, m));
  }
});

test('cosine aggregation retains matching tail passages and returns per-question raw similarity', () => {
  assert.equal(typeof indexModule.scoreSemanticIndex, 'function', 'semantic scorer must be implemented');
  const {index, manifest} = indexFixture();
  const decoded = indexModule.validateSemanticIndex(index, manifest);
  const query = new Float32Array(384); query[1] = 1;
  const scores = indexModule.scoreSemanticIndex(decoded, query);
  assert.ok(scores.get('1321') > 0.8, 'a matching tail must contribute');
  assert.equal(scores.get('2318'), 0);
  assert.throws(() => indexModule.scoreSemanticIndex(decoded, [1, 0]));
});

test('full archive sized base64 can be validated without regular expression stack overflow', () => {
  const {index, manifest} = indexFixture();
  const count = 6000;
  const bytes = new Int8Array(384 * count);
  for (let row = 0; row < count; row++) bytes[row * 384] = 127;
  manifest.documentCount = index.documentCount = count;
  index.records[0].count = count - 1;
  index.records[1].start = count - 1;
  index.vectors = Buffer.from(bytes.buffer).toString('base64');
  assert.doesNotThrow(() => indexModule.validateSemanticIndex(index, manifest));
});

test('shipped index covers every public question and matches its manifest and source hash', async () => {
  const bytes = await readFile(new URL('../data/reference-embeddings.json', import.meta.url)).catch(() => null);
  assert.ok(bytes, 'genuine precomputed index must be generated');
  const manifest = JSON.parse(await readFile(new URL('../data/reference-search-manifest.json', import.meta.url), 'utf8'));
  const source = await readFile(new URL('../data/archive.json', import.meta.url));
  const questions = JSON.parse(source).questions;
  const {buildSearchDocuments} = await import('../reference-search.mjs');
  const index = JSON.parse(bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.indexSha256);
  assert.equal(createHash('sha256').update(source).digest('hex'), manifest.sourceSha256);
  assert.equal(createHash('sha256').update(JSON.stringify(buildSearchDocuments(questions))).digest('hex'), manifest.documentSha256, 'changes to public search documents require an index rebuild');
  assert.equal(manifest.questionCount, 755);
  assert.ok(manifest.documentCount > 755, 'source passages must be retained alongside metadata');
  assert.deepEqual(new Set(index.records.map(record => record.id)), new Set(questions.map(question => question.id)));
  assert.doesNotThrow(() => indexModule.validateSemanticIndex(index, manifest));
});
