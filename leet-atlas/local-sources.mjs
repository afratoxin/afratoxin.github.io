const MAX_PACK_BYTES = 64 * 1024 * 1024;
const MAX_RECORD_BYTES = 2 * 1024 * 1024;
const MAX_TEXT_LENGTH = 100000;
const IMAGE_PREFIX = 'data:image/webp;base64,';
const DATABASE_NAME = 'leet-atlas:local-sources:v1';
const STORE_NAME = 'questions';
const utf8Bytes = value => new TextEncoder().encode(value).byteLength;

function validateImage(image, id) {
  if (typeof image !== 'string' || !image.startsWith(IMAGE_PREFIX) || image.length > MAX_RECORD_BYTES) {
    throw new Error(`${id}번의 이미지는 2 MiB 이하의 WEBP 데이터여야 합니다.`);
  }
  const encoded = image.slice(IMAGE_PREFIX.length);
  if (!encoded || encoded.length % 4 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)) {
    throw new Error(`${id}번의 이미지 인코딩이 올바르지 않습니다.`);
  }
  const binary = atob(encoded);
  const uint32 = offset => (binary.charCodeAt(offset) | binary.charCodeAt(offset + 1) << 8 |
    binary.charCodeAt(offset + 2) << 16 | binary.charCodeAt(offset + 3) << 24) >>> 0;
  if (binary.length < 20 || binary.slice(0, 4) !== 'RIFF' || binary.slice(8, 12) !== 'WEBP' ||
    uint32(4) + 8 !== binary.length || !['VP8 ', 'VP8L', 'VP8X'].includes(binary.slice(12, 16)) ||
    uint32(16) > binary.length - 20) {
    throw new Error(`${id}번의 WEBP 이미지 헤더가 올바르지 않습니다.`);
  }
}

export function parseLocalSourcePack(input, questions) {
  const serialized = typeof input === 'string' ? input : JSON.stringify(input);
  if (typeof serialized !== 'string' || utf8Bytes(serialized) > MAX_PACK_BYTES) {
    throw new Error('원문 파일은 64 MiB 이하여야 합니다.');
  }
  const pack = JSON.parse(serialized);
  if (!pack || pack.schemaVersion !== 1 || pack.kind !== 'leet-atlas-local-sources' || !Array.isArray(pack.questions)) {
    throw new Error('LEET Atlas 원문 파일 형식이 올바르지 않습니다.');
  }
  const registry = new Map(questions.map(question => [question.id, question]));
  if (pack.questions.length > registry.size) throw new Error('원문 파일의 문항 수를 확인해 주세요.');
  const seen = new Set();
  return pack.questions.map(record => {
    const question = record && registry.get(record.id);
    if (!question || seen.has(record.id) || question.sourceAccess !== 'local-only') {
      throw new Error('중복되었거나 불러올 수 없는 문항이 포함되어 있습니다.');
    }
    if (record.examKey !== question.examKey || record.number !== question.number ||
      !Number.isInteger(record.number) || record.number < 1 ||
      record.sourcePage !== question.sourcePage || !Number.isInteger(record.sourcePage) || record.sourcePage < 1) {
      throw new Error(`${record.id}번의 회차, 문항번호 또는 원문 쪽수가 일치하지 않습니다.`);
    }
    if (typeof record.text !== 'string' || !record.text.trim() || record.text.length > MAX_TEXT_LENGTH) {
      throw new Error(`${record.id}번의 본문이 비어 있거나 너무 깁니다.`);
    }
    validateImage(record.image, record.id);
    const normalized = {id:record.id, examKey:record.examKey, number:record.number,
      sourcePage:record.sourcePage, text:record.text, image:record.image};
    if (utf8Bytes(JSON.stringify(normalized)) > MAX_RECORD_BYTES) {
      throw new Error(`${record.id}번의 본문과 이미지는 합계 2 MiB 이하여야 합니다.`);
    }
    seen.add(record.id);
    return normalized;
  });
}

function openDatabase(indexedDB) {
  return new Promise((resolve, reject) => {
    if (!indexedDB || typeof indexedDB.open !== 'function') {
      reject(new Error('이 브라우저에서 원문 저장소를 사용할 수 없습니다.'));
      return;
    }
    const request = indexedDB.open(DATABASE_NAME, 1);
    let failed = false;
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, {keyPath:'id'});
      }
    };
    request.onerror = () => {failed = true;reject(request.error || new Error('원문 저장소를 열지 못했습니다.'));};
    request.onblocked = () => {failed = true;reject(new Error('다른 탭이 원문 저장소를 사용 중입니다.'));};
    request.onsuccess = () => {
      if (failed) {request.result.close();return;}
      resolve(request.result);
    };
  });
}

export async function loadLocalSources(indexedDB, questions, {strict=false}={}) {
  let database;
  try {
    database = await openDatabase(indexedDB);
    const records = await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readonly');
      let result, failure;
      transaction.oncomplete = () => failure ? reject(failure) : resolve(result);
      transaction.onerror = () => {failure = transaction.error || new Error('원문을 읽지 못했습니다.');};
      transaction.onabort = () => reject(transaction.error || failure || new Error('원문 읽기가 중단되었습니다.'));
      const request = transaction.objectStore(STORE_NAME).getAll();
      request.onsuccess = () => {result = request.result;};
      request.onerror = () => {failure = request.error || new Error('원문을 읽지 못했습니다.');};
    });
    return new Map(parseLocalSourcePack({schemaVersion:1, kind:'leet-atlas-local-sources', questions:records}, questions)
      .map(record => [record.id, record]));
  } catch (error) {
    if (strict) throw error;
    return new Map();
  } finally {
    database?.close();
  }
}

export async function saveLocalSources(indexedDB, records) {
  // Validate a detached snapshot before beginning the replacement transaction.
  // Registry authorization is enforced when importing and again when loading.
  const normalized = parseLocalSourcePack({schemaVersion:1, kind:'leet-atlas-local-sources', questions:records},
    records.map(record => ({...record, sourceAccess:'local-only'})));
  const database = await openDatabase(indexedDB);
  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      let failure;
      transaction.oncomplete = () => failure ? reject(failure) : resolve();
      transaction.onerror = () => {failure ||= transaction.error || new Error('원문을 저장하지 못했습니다.');};
      transaction.onabort = () => reject(failure || transaction.error || new Error('원문 저장이 중단되었습니다.'));
      try {
        const store = transaction.objectStore(STORE_NAME);
        const watch = request => {request.onerror = () => {failure ||= request.error || new Error('원문을 저장하지 못했습니다.');};};
        watch(store.clear());
        for (const record of normalized) watch(store.put(record));
      } catch (error) {
        failure = error;
        transaction.abort();
      }
    });
  } finally {
    database.close();
  }
}
