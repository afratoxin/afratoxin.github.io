import { filterQuestions, parseRoute, buildRoute } from './core.mjs';

const STORAGE_KEY = 'leet-atlas:2027:reviews:v1';
const SIZE_KEY = 'leet-atlas:reading-size';
const AXES = [
  { id: 'year', label: '연도', field: 'year' },
  { id: 'domain', label: '대범주', field: 'domains' },
  { id: 'subject', label: '세부 소재', field: 'subjects' },
  { id: 'type', label: '문항 유형', field: 'types' },
  { id: 'logic', label: '풀이 논리', field: 'logic' },
];
const CIRCLED = ['', '①', '②', '③', '④', '⑤'];
const state = { data: null, taxonomy: new Map(), questions: new Map(), reviews: {}, route: parseRoute(location.hash), query: '', review: 'all', sourceMode: 'image', textSize: 16, filtersOpen: false, storageFailed: false };
const main = document.querySelector('#main');
const tooltip = document.querySelector('#tag-tooltip');
const imageDialog = document.querySelector('#image-dialog');
let tooltipTarget = null;
let tooltipTimer;
let toastTimer;
let nextFocus = null;
let lastView = null;

const paths = {
  search: '<circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  bookmark: '<path d="M6.5 3.5h11v17l-5.5-3.8-5.5 3.8z"/>',
  left: '<path d="m14 5-7 7 7 7"/>',
  right: '<path d="m10 5 7 7-7 7"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
  grid: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/>',
  link: '<path d="m10 13 4-4m-5 7-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2-1 2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 0)"/>',
  filter: '<path d="M3 6h18M6 12h12m-9 6h6"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none"/>',
};
function icon(name, filled = false) {
  return `<svg viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.info}</svg>`;
}
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function asText(value) {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (!value) return '';
  return value.text || value.explanation || value.description || value.reason || value.detail || JSON.stringify(value);
}
function safeAsset(path) {
  const value = String(path || '');
  return /^(?:assets|data)\/[a-zA-Z0-9_.\/-]+$/.test(value) && !value.includes('..') ? value : '';
}
function loadReviews() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    state.reviews = stored.reviews && typeof stored.reviews === 'object' ? stored.reviews : {};
    const size = Number(localStorage.getItem(SIZE_KEY));
    if (size >= 13 && size <= 24) state.textSize = size;
  } catch { state.reviews = {}; }
}
function saveReview(id, change) {
  const old = state.reviews[id] || {};
  state.reviews[id] = { ...old, ...change, updatedAt: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 1, reviews: state.reviews }));
    return true;
  } catch {
    state.storageFailed = true;
    showToast('브라우저에 저장하지 못했습니다. 검수 기록을 내보내 주세요.');
    return false;
  }
}
function showToast(message) {
  clearTimeout(toastTimer);
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3600);
}
function findTag(value, axis) {
  if (state.taxonomy.has(value)) return state.taxonomy.get(value);
  return [...state.taxonomy.values()].find(tag => tag.label === value && (!axis || tag.axis === axis));
}
function questionTags(question, axis) {
  const tags = (question.tags || []).map(id => findTag(id)).filter(Boolean);
  if (tags.some(tag => tag.axis === axis)) return tags.filter(tag => tag.axis === axis);
  const field = AXES.find(item => item.id === axis)?.field;
  const values = axis === 'year' ? [String(question.year)] : (question[field] || []);
  return values.map(value => findTag(value, axis)).filter(Boolean);
}
function tagDescription(tag, question) {
  const reason = question?.tagReasons?.[tag.label] || question?.tagReasons?.[tag.id];
  return `${tag.label} · ${AXES.find(axis => axis.id === tag.axis)?.label || '분류'}\n${tag.description || '이 분류에 해당하는 문항을 모아 봅니다.'}${reason ? `\n\n이 문항에 붙인 이유\n${asText(reason)}` : ''}\n\n클릭하면 이 태그의 문항 목록으로 이동합니다.`;
}
function tagButton(tag, question, filter = false) {
  const active = state.route.tags.includes(tag.id);
  return `<button type="button" class="${filter ? 'filter-choice' : 'tag-chip'}${active ? ' is-active' : ''}" data-axis="${esc(tag.axis)}" data-filter-tag="${esc(tag.id)}" data-tooltip="${esc(tagDescription(tag, question))}" aria-describedby="tag-tooltip" aria-pressed="${active}">${filter ? '' : '<span class="tag-dot" aria-hidden="true"></span>'}${esc(tag.label)}</button>`;
}
function reviewBadge(id) {
  const status = state.reviews[id]?.status;
  return status === 'done' ? '<span class="review-status done"><i class="review-dot"></i>검수 완료</span>' : status === 'check' ? '<span class="review-status check"><i class="review-dot"></i>재검토</span>' : '';
}
function bookmarkButton(id, compact = false) {
  const active = !!state.reviews[id]?.bookmark;
  return `<button type="button" class="${compact ? 'icon-button' : 'button button-quiet'}${active ? ' is-active' : ''}" data-bookmark="${esc(id)}" aria-pressed="${active}" aria-label="${esc(id)} 북마크 ${active ? '해제' : '추가'}">${icon('bookmark', active)}${compact ? '' : `<span>${active ? '북마크됨' : '북마크'}</span>`}</button>`;
}
function navigate(route, focus) {
  hideTooltip();
  nextFocus = focus || null;
  const hash = buildRoute(route);
  if (hash === location.hash) render();
  else location.hash = hash;
}
function toggleTag(id) {
  const tags = new Set(state.route.view === 'question' ? [] : state.route.tags);
  if (tags.has(id)) tags.delete(id); else tags.add(id);
  navigate({ view: 'list', tags: [...tags] }, state.route.view === 'question' ? { main: true } : { tag: id });
}
function resetFilters() {
  state.query = '';
  state.review = 'all';
  navigate({ view: 'list', tags: [] }, { search: true });
}
function filteredQuestions() {
  return filterQuestions(state.data.questions, { query: state.query, tags: state.route.tags, review: state.review }, state.reviews);
}
function filterPanel() {
  return `<aside class="filter-panel${state.filtersOpen ? ' is-open' : ''}" aria-label="문항 분류 필터">
    <button class="filter-toggle" type="button" data-toggle-filters aria-expanded="${state.filtersOpen}" aria-controls="filter-content"><span>${icon('filter')} 분류로 좁혀 보기${state.route.tags.length ? ` · ${state.route.tags.length}개 선택` : ''}</span>${icon('down')}</button>
    <div class="filter-heading"><h2>분류로 좁혀 보기</h2><button class="button-text" type="button" data-reset>초기화</button></div>
    <div id="filter-content" class="filter-content">${AXES.map(axis => {
      const tags = [...state.taxonomy.values()].filter(tag => tag.axis === axis.id);
      const needsPicker = tags.length > 15;
      const selectedCount = tags.filter(tag => state.route.tags.includes(tag.id)).length;
      const choices = `<div class="filter-tags${needsPicker ? ' filter-tags-scroll' : ''}" data-tag-choices="${axis.id}">${tags.map(tag => tagButton(tag, null, true)).join('')}</div>`;
      return tags.length ? `<section class="filter-section"><h3>${axis.label}<span>${selectedCount ? `${selectedCount}개 선택 / ` : ''}${tags.length}</span></h3>${needsPicker ? `<details class="filter-expander"${selectedCount ? ' open' : ''}><summary>${tags.length}개 태그에서 선택 ${icon('down')}</summary><label class="taxonomy-search-label"><span class="sr-only">${axis.label} 태그 검색</span><input class="taxonomy-search" type="search" data-taxonomy-search="${axis.id}" placeholder="${axis.label} 태그 찾기" autocomplete="off"></label>${choices}<p class="tag-search-empty" data-tag-empty="${axis.id}" hidden>일치하는 태그가 없습니다.</p></details>` : choices}</section>` : '';
    }).join('')}<p class="filter-help">선택한 태그를 모두 포함하는 문항을 찾습니다. 태그 위에 머물면 분류 기준을 볼 수 있습니다.</p></div>
  </aside>`;
}
function renderList() {
  document.title = '문항 탐색 · LEET Atlas 2027';
  main.innerHTML = `<div class="page-heading"><div><div class="eyebrow">QUESTION LIBRARY</div><h1>문항 탐색</h1><p>원문을 읽고, 논증의 구조와 해설을 검토하세요.</p></div><div class="page-count"><strong>${state.data.questions.length}</strong>문항 <span aria-hidden="true">/</span> 2027학년도</div></div>
  <div class="list-layout">${filterPanel()}<section class="list-main" aria-label="문항 목록"><div class="search-row"><label class="search-box">${icon('search')}<input id="question-search" type="search" value="${esc(state.query)}" placeholder="문항번호, 소재, 본문으로 검색" aria-label="문항 검색" autocomplete="off"></label><select id="review-filter" class="review-select" aria-label="검수 상태 필터"><option value="all">모든 검수 상태</option><option value="bookmarked">북마크한 문항</option><option value="unreviewed">미검수</option><option value="check">재검토</option><option value="done">검수 완료</option></select></div>
    <div id="selected-filters" class="selected-filters"${state.route.tags.length ? '' : ' hidden'}>${state.route.tags.map(id => { const tag = state.taxonomy.get(id); return `<button type="button" class="selected-filter" data-remove-tag="${esc(id)}" aria-label="${esc(tag?.label || id)} 필터 해제">${esc(tag?.label || id)}${icon('close')}</button>`; }).join('')}<button class="button-text" type="button" data-reset>전체 초기화</button></div>
    <div class="list-toolbar"><span id="result-count" role="status" aria-live="polite"></span><span class="sort-note">${icon('down')} 연도 · 문항번호 순</span></div><div id="question-list" class="question-list"></div>
    <p class="list-bottom-note">${icon('info')} 원본 회색 강조는 답안 표시입니다. 해설과 분류는 검수용 초안입니다.</p>
  </section></div>`;
  document.querySelector('#review-filter').value = state.review;
  updateListResults();
}
function updateListResults() {
  const questions = filteredQuestions();
  const count = document.querySelector('#result-count');
  if (!count) return;
  count.innerHTML = `<strong>${questions.length}</strong>개 문항${state.query || state.route.tags.length || state.review !== 'all' ? ` <span> / 전체 ${state.data.questions.length}개</span>` : ''}`;
  document.querySelector('#question-list').innerHTML = questions.length ? questions.map(question => {
    const rowTags = ['domain', 'type', 'logic'].flatMap(axis => questionTags(question, axis)).slice(0, 4);
    const href = buildRoute({ view: 'question', id: question.id, tags: state.route.tags });
    return `<article class="question-row"><a class="row-index" href="${esc(href)}" aria-label="${esc(question.id)}번 문항 열기">${esc(question.id)}<small>${esc(question.year)} · ${String(question.number).padStart(2, '0')}</small></a><div class="row-content"><a class="row-title-link" href="${esc(href)}">${esc(question.title || `${question.number}번 문항`)}${icon('arrow')}</a><div class="row-meta"><span>${esc(question.year)}학년도 추리논증</span><span>문제지 ${esc(question.examPage)}쪽</span>${question.answerStatus === 'source-conflict' ? '<span class="conflict-badge">원본 문항·답안 불일치</span>' : ''}${reviewBadge(question.id)}</div><div class="row-tags">${rowTags.map(tag => tagButton(tag, question)).join('')}</div></div><div class="row-controls">${bookmarkButton(question.id, true)}<a class="row-thumb" href="${esc(href)}" aria-label="${esc(question.id)}번 원본과 해설 보기"><img src="${esc(safeAsset(question.thumbnail || question.image))}" alt="" loading="lazy" decoding="async"></a></div></article>`;
  }).join('') : '<div class="empty-state"><strong>조건에 맞는 문항이 없습니다.</strong><p>검색어나 태그를 줄여 다시 찾아보세요.</p><button class="button button-sage" type="button" data-reset>필터 초기화</button></div>';
}
function renderRibbon(question) {
  return `<div class="taxonomy-ribbon" aria-label="문항 분류 태그">${AXES.map(axis => {
    const tags = questionTags(question, axis.id);
    return tags.length ? `<div class="taxonomy-group"><span class="taxonomy-label">${axis.label}</span>${tags.map(tag => tagButton(tag, question)).join('')}</div>` : '';
  }).join('')}</div>`;
}
function renderAnswer(question) {
  if (question.answerStatus === 'source-conflict') {
    return `<div class="conflict-alert" role="note"><strong>원본 문항·답안 불일치</strong><p>원본에는 ${esc(CIRCLED[question.answer] || question.answer)}이 강조되어 있습니다. 독립 풀이에서는 ㄴ만 성립하지만, 이에 맞는 선택지가 없습니다. 원본과 표시 답안을 그대로 보존했으며 공식 답안을 확정하지 않았습니다.</p><div class="conflict-source"><span>보존한 원본 표시 답안</span><b>${esc(CIRCLED[question.answer] || question.answer)} · 검토 필요</b></div></div>`;
  }
  return `<div class="answer-strip"><div><span class="answer-caption">원본 표시 + 독립 풀이 대조</span><strong>정답 ${esc(CIRCLED[question.answer] || '확인 중')}</strong></div><p class="answer-basis">${esc(question.answerBasis || '원본 회색 강조와 독립 풀이를 대조했습니다.')}<br>공식정답 외부 대조 미완료</p></div>`;
}
function explanationSections(question) {
  const steps = question.steps || [];
  const statements = question.statements || [];
  const options = question.options || [];
  const pitfalls = question.pitfalls || [];
  const reviewNotes = question.reviewNotes || [];
  return `${renderAnswer(question)}<section class="explanation-section"><h3 class="section-title"><span class="section-marker">01</span>핵심 해설</h3><p class="summary-text">${esc(question.summary || '이 문항의 해설은 준비 중입니다.')}</p></section>
  ${steps.length ? `<section class="explanation-section"><h3 class="section-title"><span class="section-marker">02</span>풀이의 흐름</h3><ol class="steps-list">${steps.map((step, i) => `<li><span class="step-number">${i + 1}</span><div>${typeof step === 'object' && step.title ? `<strong>${esc(step.title)}</strong>` : ''}${esc(asText(step))}</div></li>`).join('')}</ol></section>` : ''}
  ${statements.length ? `<section class="explanation-section"><h3 class="section-title"><span class="section-marker">03</span>보기 판단</h3><div class="verdict-list">${statements.map(statement => `<div class="verdict-item${statement.verdict === false ? ' is-false' : ''}"><div class="verdict-heading"><span class="verdict-label">${esc(statement.label)}</span><span class="verdict-token">${statement.verdict === true ? '옳음' : statement.verdict === false ? '옳지 않음' : '검토 필요'}</span></div><p>${esc(statement.explanation)}</p></div>`).join('')}</div></section>` : ''}
  ${options.length ? `<section class="explanation-section"><h3 class="section-title"><span class="section-marker">${statements.length ? '04' : '03'}</span>선택지별 해설</h3><div class="option-list">${options.map(option => {
    const conflict = question.answerStatus === 'source-conflict';
    return `<div class="option-row${option.correct && !conflict ? ' is-correct' : ''}${conflict && Number(option.number) === Number(question.answer) ? ' source-conflict' : ''}"><span class="option-number">${esc(CIRCLED[option.number] || option.number)}</span><div>${option.correct && !conflict ? '<span class="option-correct-label">정답</span>' : ''}${conflict && Number(option.number) === Number(question.answer) ? '<span class="conflict-badge">원본 표시 · 불일치</span> ' : ''}${esc(option.explanation)}</div></div>`;
  }).join('')}</div></section>` : ''}
  ${pitfalls.length ? `<section class="explanation-section pitfall-box"><h3 class="section-title">놓치기 쉬운 지점</h3><ul>${pitfalls.map(pitfall => `<li>${esc(asText(pitfall))}</li>`).join('')}</ul></section>` : ''}
  ${reviewNotes.length ? `<section class="review-notes"><h3 class="section-title">검수 참고${question.confidence ? ` · 해설 확신도 ${esc(question.confidence)}` : ''}</h3><ul class="review-notes-list">${reviewNotes.map(note => `<li>${esc(asText(note))}</li>`).join('')}</ul></section>` : ''}`;
}
function readerSource(question) {
  const image = safeAsset(question.image);
  const corrections = question.textCorrections || [];
  const correctionNotice = corrections.length ? `<details class="text-corrections"><summary>원본 대조로 복원한 추출 오류 ${corrections.length}곳</summary><ul>${corrections.map(item => `<li><strong>${esc(item.to)}</strong><span>${esc(item.reason)}</span></li>`).join('')}</ul><p>원본 이미지와 복원 전 추출 텍스트는 보존되어 있습니다. 전체 내역은 문항 데이터 JSON에서 확인할 수 있습니다.</p></details>` : '';
  return `<section class="reader-panel source-panel" aria-label="문항 원문"><div class="panel-heading"><h2>문항 원문 <span>ORIGINAL</span></h2><div class="source-actions"><div class="segmented" role="group" aria-label="원문 보기 방식"><button type="button" data-source-mode="image" class="${state.sourceMode === 'image' ? 'is-active' : ''}" aria-pressed="${state.sourceMode === 'image'}">원본 이미지</button><button type="button" data-source-mode="text" class="${state.sourceMode === 'text' ? 'is-active' : ''}" aria-pressed="${state.sourceMode === 'text'}">추출 텍스트</button></div><button class="icon-button" type="button" data-enlarge="${esc(question.id)}" aria-label="원본 이미지 확대">${icon('expand')}</button></div></div><div class="source-note">${icon('info')} 원본의 회색 정답 강조를 유지했습니다. 문제지 ${esc(question.examPage)}쪽 · 제공 PDF ${esc(question.sourcePage)}쪽</div>
  <div id="source-image-view"${state.sourceMode === 'image' ? '' : ' hidden'}><button type="button" class="source-image-button" data-enlarge="${esc(question.id)}" aria-label="${esc(question.id)}번 원본 확대"><img class="source-image" src="${esc(image)}" alt="${esc(question.id)}번 원본 문항. 원문은 추출 텍스트 보기에서도 읽을 수 있습니다." decoding="async"></button></div>
  <div id="source-text-view"${state.sourceMode === 'text' ? '' : ' hidden'}><div class="text-controls"><span>글자 크기</span><button type="button" class="icon-button" data-text-size="-1" aria-label="원문 글자 작게">가−</button><span id="text-size-label">${state.textSize}px</span><button type="button" class="icon-button" data-text-size="1" aria-label="원문 글자 크게">가+</button></div><pre class="source-text" style="--reading-size:${state.textSize}px">${esc(question.text || question.rawText || '추출 텍스트가 없습니다. 원본 이미지를 확인해 주세요.')}</pre><p class="text-warning">PDF 문자층에서 추출한 텍스트입니다. 공백·줄바꿈·표·수식은 원본과 다를 수 있으므로 원본 이미지를 함께 확인해 주세요.</p>${correctionNotice}</div></section>`;
}
function reviewWorkspace(question) {
  const review = state.reviews[question.id] || {};
  return `<section class="review-workspace" aria-labelledby="review-title"><div class="review-workspace-heading"><h2 id="review-title">나의 검수 기록</h2><span id="save-hint" class="save-hint">이 브라우저에 자동 저장</span></div><div class="review-workspace-controls" role="group" aria-label="검수 상태">${[{ value: '', label: '미검수' }, { value: 'check', label: '재검토' }, { value: 'done', label: '검수 완료' }].map(item => `<button type="button" class="status-choice${(review.status || '') === item.value ? ' is-active' : ''}" data-review-status="${item.value}" aria-pressed="${(review.status || '') === item.value}">${item.label}</button>`).join('')}</div><label class="sr-only" for="review-note">${esc(question.id)}번 검수 메모</label><textarea id="review-note" data-note-for="${esc(question.id)}" placeholder="원문, 분류, 해설에서 확인할 내용을 적어 두세요.">${esc(review.note || '')}</textarea></section>`;
}
function questionNav(question, prev, next) {
  return `<nav class="question-bottom-nav" aria-label="인접 문항">${prev ? `<a class="question-nav-card" href="${esc(buildRoute({ view: 'question', id: prev.id, tags: state.route.tags }))}">${icon('left')}<div><small>이전 문항 · ${esc(prev.id)}</small><strong>${esc(prev.title)}</strong></div></a>` : ''}${next ? `<a class="question-nav-card next" href="${esc(buildRoute({ view: 'question', id: next.id, tags: state.route.tags }))}"><div><small>다음 문항 · ${esc(next.id)}</small><strong>${esc(next.title)}</strong></div>${icon('right')}</a>` : ''}</nav>`;
}
function renderQuestion() {
  const question = state.questions.get(state.route.id);
  if (!question) {
    main.innerHTML = '<div class="error-state"><h1>문항을 찾을 수 없습니다.</h1><p>2027학년도 문항번호는 2701부터 2740까지입니다.</p><a class="button" href="#/questions">문항 목록으로</a></div>';
    return;
  }
  document.title = `${question.id} ${question.title} · LEET Atlas`;
  const sorted = filterQuestions(state.data.questions);
  const index = sorted.findIndex(item => item.id === question.id);
  const prev = sorted[index - 1];
  const next = sorted[index + 1];
  const listHref = buildRoute({ view: 'list', tags: state.route.tags });
  main.innerHTML = `<div class="question-breadcrumb"><a class="breadcrumb-link" href="${esc(listHref)}">${icon('left')} 문항 목록 <span aria-hidden="true">/</span> ${esc(question.year)}학년도</a><nav class="question-pagination" aria-label="문항 이동"><button class="icon-button" type="button" ${prev ? `data-question-nav="${esc(prev.id)}"` : 'disabled'} aria-label="이전 문항">${icon('left')}</button><span>${index + 1} <span aria-hidden="true">/</span> ${sorted.length}</span><button class="icon-button" type="button" ${next ? `data-question-nav="${esc(next.id)}"` : 'disabled'} aria-label="다음 문항">${icon('right')}</button></nav></div>
  <div class="question-heading"><div class="question-heading-main"><div class="question-number">${esc(question.id)}</div><div><h1>${esc(question.title || `${question.number}번 문항`)}</h1><div class="question-subtitle">${esc(question.year)}학년도 법학적성시험 · 추리논증 ${esc(question.number)}번 <span aria-hidden="true">·</span> 검수용 초안</div></div></div><div class="question-heading-actions">${bookmarkButton(question.id)}<button class="button button-quiet" type="button" data-copy-link aria-label="문항 주소 복사">${icon('link')}<span>주소 복사</span></button></div></div>
  ${renderRibbon(question)}<div class="reader-grid">${readerSource(question)}<div><section class="reader-panel analysis-panel" aria-label="문항 해설"><div class="panel-heading"><h2>해설과 논증 구조 <span>ANALYSIS</span></h2><span class="draft-label"><i></i>검수용 초안</span></div><div class="analysis-body">${explanationSections(question)}</div></section>${reviewWorkspace(question)}</div></div>${questionNav(question, prev, next)}
  <p class="document-links"><a href="data/2027-original.pdf" target="_blank" rel="noopener">2027 원본 PDF</a><span aria-hidden="true">·</span><a href="data/2027.json" target="_blank" rel="noopener">문항 데이터 JSON</a><span aria-hidden="true">·</span><a href="docs/2026-10-25-design.md" target="_blank" rel="noopener">검수판 안내</a></p>`;
}
function render() {
  if (!state.data) return;
  hideTooltip();
  const previousRoute = state.route;
  state.route = parseRoute(location.hash);
  state.route.tags = state.route.tags.filter(id => state.taxonomy.has(id));
  if (state.route.view === 'question') renderQuestion(); else renderList();
  const focus = nextFocus;
  nextFocus = null;
  if (focus?.main) { window.scrollTo({ top: 0, behavior: 'instant' }); main.focus({ preventScroll: true }); }
  else if (focus?.search) document.querySelector('#question-search')?.focus();
  else if (focus?.tag) {
    const button = [...document.querySelectorAll('[data-filter-tag]')].find(item => item.dataset.filterTag === focus.tag);
    const details = button?.closest('details');
    if (details) details.open = true;
    if (button?.getClientRects().length) button.focus({ preventScroll: true });
    else (document.querySelector('.filter-toggle') || main).focus({ preventScroll: true });
  } else if (lastView !== null && (lastView !== state.route.view || previousRoute.id !== state.route.id)) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.focus({ preventScroll: true });
  }
  lastView = state.route.view;
}
function changeSourceMode(mode) {
  state.sourceMode = mode;
  document.querySelector('#source-image-view').hidden = mode !== 'image';
  document.querySelector('#source-text-view').hidden = mode !== 'text';
  document.querySelectorAll('[data-source-mode]').forEach(button => {
    const active = button.dataset.sourceMode === mode;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}
function changeTextSize(delta) {
  state.textSize = Math.min(24, Math.max(13, state.textSize + delta));
  document.querySelector('.source-text')?.style.setProperty('--reading-size', `${state.textSize}px`);
  const label = document.querySelector('#text-size-label');
  if (label) label.textContent = `${state.textSize}px`;
  try { localStorage.setItem(SIZE_KEY, state.textSize); } catch { /* Reading remains available without storage. */ }
}
function showImage(id) {
  const question = state.questions.get(id);
  if (!question) return;
  document.querySelector('#image-dialog-title').textContent = `${question.id} · ${question.title} · 원본 확대`;
  const image = document.querySelector('#enlarged-image');
  image.src = safeAsset(question.image);
  image.alt = `${question.id}번 문항의 원본 이미지. 회색 답안 강조를 포함합니다.`;
  imageDialog.showModal();
  document.querySelector('#close-image').focus();
}
async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href);
    showToast('문항 주소를 복사했습니다.');
  } catch {
    const input = document.createElement('textarea');
    input.value = location.href;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.append(input);
    input.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Clipboard access may be unavailable. */ }
    input.remove();
    showToast(copied ? '문항 주소를 복사했습니다.' : '주소창의 문항 주소를 복사해 주세요.');
  }
}
function exportReviews() {
  const payload = { schemaVersion: 1, app: 'LEET Atlas', examYear: 2027, exportedAt: new Date().toISOString(), reviews: state.reviews };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `leet-atlas-2027-review-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('북마크·검수 상태·메모를 JSON으로 내보냈습니다.');
}
function showTooltip(target) {
  clearTimeout(tooltipTimer);
  tooltipTarget = target;
  tooltip.textContent = target.dataset.tooltip;
  tooltip.hidden = false;
  const rect = target.getBoundingClientRect();
  const box = tooltip.getBoundingClientRect();
  const left = Math.min(window.innerWidth - box.width - 12, Math.max(12, rect.left));
  const top = rect.bottom + box.height + 16 <= window.innerHeight ? rect.bottom + 7 : Math.max(12, rect.top - box.height - 7);
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}
function hideTooltip() {
  clearTimeout(tooltipTimer);
  tooltip.hidden = true;
  tooltipTarget = null;
}

document.querySelector('#export-reviews').innerHTML = `${icon('download')}<span>검수 기록 내보내기</span>`;
document.querySelector('#export-reviews').addEventListener('click', exportReviews);
document.querySelector('#close-image').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', event => { if (event.target === imageDialog) imageDialog.close(); });
window.addEventListener('hashchange', render);
window.addEventListener('resize', hideTooltip);
document.addEventListener('scroll', hideTooltip, { passive: true, capture: true });
window.addEventListener('storage', event => {
  if (event.key === STORAGE_KEY) { loadReviews(); render(); }
});
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.hasAttribute('data-filter-tag')) toggleTag(button.dataset.filterTag);
  else if (button.hasAttribute('data-remove-tag')) navigate({ view: 'list', tags: state.route.tags.filter(tag => tag !== button.dataset.removeTag) });
  else if (button.hasAttribute('data-reset')) resetFilters();
  else if (button.hasAttribute('data-toggle-filters')) {
    state.filtersOpen = !state.filtersOpen;
    document.querySelector('.filter-panel')?.classList.toggle('is-open', state.filtersOpen);
    button.setAttribute('aria-expanded', String(state.filtersOpen));
  } else if (button.hasAttribute('data-question-nav')) navigate({ view: 'question', id: button.dataset.questionNav, tags: state.route.tags });
  else if (button.hasAttribute('data-bookmark')) {
    const id = button.dataset.bookmark;
    const bookmark = !state.reviews[id]?.bookmark;
    saveReview(id, { bookmark });
    if (state.route.view === 'list') {
      updateListResults();
      if (event.detail === 0) {
        const replacement = [...document.querySelectorAll('[data-bookmark]')].find(item => item.dataset.bookmark === id);
        (replacement || document.querySelector('#question-search'))?.focus({ preventScroll: true });
      }
    }
    else {
      button.classList.toggle('is-active', bookmark);
      button.setAttribute('aria-pressed', String(bookmark));
      button.setAttribute('aria-label', `${id} 북마크 ${bookmark ? '해제' : '추가'}`);
      button.innerHTML = `${icon('bookmark', bookmark)}<span>${bookmark ? '북마크됨' : '북마크'}</span>`;
    }
    if (!state.storageFailed) showToast(bookmark ? '북마크에 추가했습니다.' : '북마크를 해제했습니다.');
  } else if (button.hasAttribute('data-source-mode')) changeSourceMode(button.dataset.sourceMode);
  else if (button.hasAttribute('data-text-size')) changeTextSize(Number(button.dataset.textSize));
  else if (button.hasAttribute('data-enlarge')) showImage(button.dataset.enlarge);
  else if (button.hasAttribute('data-copy-link')) copyLink();
  else if (button.hasAttribute('data-review-status')) {
    saveReview(state.route.id, { status: button.dataset.reviewStatus });
    document.querySelectorAll('[data-review-status]').forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    const hint = document.querySelector('#save-hint');
    if (hint) hint.textContent = state.storageFailed ? '저장 실패 · 기록을 내보내 주세요' : '저장됨 · 이 브라우저에 보관';
  }
});
document.addEventListener('input', event => {
  if (event.target.hasAttribute('data-taxonomy-search')) {
    const axis = event.target.dataset.taxonomySearch;
    const term = event.target.value.normalize('NFKC').trim().toLocaleLowerCase('ko');
    let visible = 0;
    document.querySelectorAll(`[data-tag-choices="${axis}"] [data-filter-tag]`).forEach(button => {
      const match = button.textContent.normalize('NFKC').toLocaleLowerCase('ko').includes(term);
      button.hidden = !match;
      if (match) visible++;
    });
    document.querySelector(`[data-tag-empty="${axis}"]`).hidden = visible > 0;
    hideTooltip();
  } else if (event.target.id === 'question-search') { state.query = event.target.value; updateListResults(); }
  else if (event.target.hasAttribute('data-note-for')) {
    const saved = saveReview(event.target.dataset.noteFor, { note: event.target.value });
    const hint = document.querySelector('#save-hint');
    if (hint) hint.textContent = saved ? '저장됨 · 이 브라우저에 보관' : '저장 실패 · 기록을 내보내 주세요';
  }
});
document.addEventListener('change', event => {
  if (event.target.id === 'review-filter') { state.review = event.target.value; updateListResults(); }
});
document.addEventListener('pointerover', event => {
  const target = event.target.closest('[data-tooltip]');
  if (target) { clearTimeout(tooltipTimer); if (target !== tooltipTarget) showTooltip(target); }
  if (event.target.closest('#tag-tooltip')) clearTimeout(tooltipTimer);
});
document.addEventListener('pointerout', event => {
  if (event.target.closest('[data-tooltip]') || event.target.closest('#tag-tooltip')) {
    if (event.relatedTarget?.closest?.('#tag-tooltip')) return;
    if (event.relatedTarget?.closest?.('[data-tooltip]') === event.target.closest('[data-tooltip]')) return;
    tooltipTimer = setTimeout(hideTooltip, 150);
  }
});
document.addEventListener('focusin', event => {
  const target = event.target.closest('[data-tooltip]');
  if (target) showTooltip(target); else hideTooltip();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') hideTooltip(); });
document.addEventListener('error', event => {
  if (event.target.matches?.('.source-image')) {
    const button = event.target.closest('.source-image-button');
    button.classList.add('image-failure');
    button.disabled = true;
    button.textContent = '원본 이미지를 불러오지 못했습니다. 추출 텍스트를 선택하거나 원본 PDF를 확인해 주세요.';
  }
}, true);

loadReviews();
try {
  const response = await fetch('data/2027.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  state.data = await response.json();
  if (!Array.isArray(state.data.questions) || !Array.isArray(state.data.taxonomy)) throw new Error('문항 데이터 형식이 올바르지 않습니다.');
  state.data.taxonomy.forEach(tag => state.taxonomy.set(tag.id, tag));
  state.data.questions.forEach(question => state.questions.set(String(question.id), question));
  if (!location.hash) history.replaceState(null, '', buildRoute({ view: 'list' }));
  render();
} catch (error) {
  main.innerHTML = `<div class="error-state"><h1>문항 데이터를 불러오지 못했습니다.</h1><p>잠시 후 새로고침해 주세요. 파일을 직접 열었다면 배포된 웹 주소에서 접속해 주세요.</p><p><code>${esc(error.message)}</code></p><button class="button" type="button" id="reload-data">다시 불러오기</button></div>`;
  document.querySelector('#reload-data').addEventListener('click', () => location.reload());
}
