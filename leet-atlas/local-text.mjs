export const LOCAL_TEXT_STORAGE_KEY = 'leet-atlas:local-texts:v1';
const MAX_PACK_BYTES = 8 * 1024 * 1024;
const MAX_TEXT_LENGTH = 100000;

export function localTextCoverage(questions, localTexts) {
  const coverage = {total: questions.length, available: 0, native: 0, imported: 0, exams: []};
  const exams = new Map();
  for (const question of questions) {
    const examKey = question.examKey || String(question.year);
    if (!exams.has(examKey)) {
      const exam = {examKey, examLabel: question.examLabel || `${question.year || examKey}학년도`, total: 0, available: 0, native: 0, imported: 0};
      exams.set(examKey, exam);
      coverage.exams.push(exam);
    }
    const exam = exams.get(examKey);
    exam.total++;
    const native = typeof question.text === 'string' && Boolean(question.text.trim());
    const record = localTexts?.get(question.id);
    const sourcePage = record?.sourcePage ?? question.sourcePage;
    const imported = !native && question.sourceAccess === 'local-only' && record?.id === question.id &&
      record.examKey === question.examKey && record.number === question.number &&
      Number.isInteger(sourcePage) && sourcePage > 0 && typeof record.text === 'string' &&
      Boolean(record.text.trim()) && record.text.length <= MAX_TEXT_LENGTH;
    if (native || imported) {
      coverage.available++;
      exam.available++;
      const kind = native ? 'native' : 'imported';
      coverage[kind]++;
      exam[kind]++;
    }
  }
  return coverage;
}

export function parseLocalTextPack(input, questions) {
  const serialized = typeof input === 'string' ? input : JSON.stringify(input);
  if (typeof serialized !== 'string' || new TextEncoder().encode(serialized).byteLength > MAX_PACK_BYTES) {
    throw new Error('본문 파일은 8 MiB 이하여야 합니다.');
  }
  const pack = typeof input === 'string' ? JSON.parse(input) : input;
  if (!pack || pack.schemaVersion !== 1 || pack.kind !== 'leet-atlas-local-text' || !Array.isArray(pack.questions)) {
    throw new Error('LEET Atlas 본문 파일 형식이 올바르지 않습니다.');
  }
  const registry = new Map(questions.map(question => [question.id, question]));
  if (pack.questions.length > registry.size) throw new Error('본문 파일의 문항 수를 확인해 주세요.');
  const seen = new Set();
  return pack.questions.map(record => {
    const question = record && registry.get(record.id);
    if (!question || seen.has(record.id) || question.examKey === '2027' || !['local-only', 'bundled'].includes(question.sourceAccess)) {
      throw new Error('중복되었거나 불러올 수 없는 문항이 포함되어 있습니다.');
    }
    if (record.examKey !== question.examKey || record.number !== question.number) {
      throw new Error(`${record.id}번의 회차와 문항번호가 일치하지 않습니다.`);
    }
    const sourcePage = record.sourcePage ?? question.sourcePage;
    if (!Number.isInteger(sourcePage) || sourcePage < 1) {
      throw new Error(`${record.id}번의 원문 쪽수가 올바르지 않습니다.`);
    }
    if (typeof record.text !== 'string' || !record.text.trim() || record.text.length > MAX_TEXT_LENGTH) {
      throw new Error(`${record.id}번의 본문이 비어 있거나 너무 깁니다.`);
    }
    seen.add(record.id);
    return {id:record.id, text:record.text, sourcePage, examKey:record.examKey, number:record.number};
  });
}

export function loadLocalTexts(storage, questions) {
  try {
    const saved = storage.getItem(LOCAL_TEXT_STORAGE_KEY);
    return new Map(saved ? parseLocalTextPack(saved, questions).map(record => [record.id, record]) : []);
  } catch {
    return new Map();
  }
}

export function saveLocalTexts(storage, records) {
  const pack = {schemaVersion:1, kind:'leet-atlas-local-text', questions:records};
  const serialized = JSON.stringify(pack);
  if (new TextEncoder().encode(serialized).byteLength > MAX_PACK_BYTES) {
    throw new Error('브라우저에 보관할 전체 본문은 8 MiB 이하여야 합니다.');
  }
  storage.setItem(LOCAL_TEXT_STORAGE_KEY, serialized);
}
