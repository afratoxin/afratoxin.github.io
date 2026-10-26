import { BOOKMARK_COLORS, bookmarkColors, normalizeReviews, toggleBookmarkColor, tagFilterGroups, filterQuestions, keywordSearchScore, paginateQuestions, parseRoute, buildRoute, createImageBundleStore } from './core.mjs?v=20261026-year-analysis1';
import { groupTags } from './tag-groups.mjs?v=20261026-strengthen-release1';
import { renderSidebar } from './sidebar.mjs?v=20261026-strengthen-release1';
import { parseLocalSourcePack, loadLocalSources, saveLocalSources } from './local-sources.mjs?v=20261026-year-analysis1';
import { loadLocalTexts, parseLocalTextPack, saveLocalTexts } from './local-text.mjs?v=20261026-year-analysis1';
import { rankReferences } from './reference-search.mjs?v=20261026-year-analysis1';
import { createSemanticSearch } from './semantic-search.mjs?v=20261026-year-analysis1';
import { analyzeArchive, renderYearAnalysis, validateYearContent } from './year-analysis.mjs?v=20261026-year-plane1';

const STORAGE_KEY = 'leet-atlas:2027:reviews:v1';
const SIZE_KEY = 'leet-atlas:reading-size';
const VIEW_KEY = 'leet-atlas:list-mode';
const CACHE_VERSION = '20261026-strengthen-release1';
const imageBundles = createImageBundleStore(path => fetch(path), { version: CACHE_VERSION });
let imageHydrationVersion = 0;
let visibleImageQuestions = [];
let dialogQuestionId = null;
const AXES = [
  { id: 'domain', label: '대범주', field: 'domains' },
  { id: 'field', label: '분야', field: 'fields' },
  { id: 'subject', label: '소재', field: 'subjects' },
  { id: 'type', label: '문항 유형', field: 'types' },
  { id: 'logic', label: '풀이 논리', field: 'logic' },
  { id: 'year', label: '연도', field: 'year' },
];
const CIRCLED = ['', '①', '②', '③', '④', '⑤'];
const state = { data: null, taxonomy: new Map(), tagCounts: new Map(), questions: new Map(), reviews: {}, route: parseRoute(location.hash), query: '', review: 'all', sourceMode: 'image', textSize: 16, filtersOpen: false, storageFailed: false, modePreference: 'paged', hasRendered: false, tagQuery: '', tagAxis: 'all', paletteQuestionId: null, returnRoute: null, localTexts: new Map(), neighborhoods: new Map(), filterOpen: new Set(), localSources: new Map(), sourceLoadFailed: false };
const main = document.querySelector('#main');
const tooltip = document.querySelector('#tag-tooltip');
const imageDialog = document.querySelector('#image-dialog');
const bookmarkDialog = document.querySelector('#bookmark-dialog');
let tooltipTarget = null;
let tooltipTimer;
let toastTimer;
let nextFocus = null;
let keyboardQuestionId = null;
let lastView = null;
let yearContentPromise = null;
let yearContent = null;
let yearStatistics = null;
let yearContentError = false;
let yearComparison = 'all';
let semanticSearchClient;
let semanticSequence = 0;
let semanticStatusSequence = 0;
let semanticTimer;
Object.assign(state, {searchMode:'recommend', searchSort:state.route.sort === 'accuracy' ? 'accuracy' : 'relevance', searchMatches:new Map(), semanticQuery:'', semanticScores:new Map(), semanticStatus:{state:'idle'}});

function cancelSemanticSearch() {
  clearTimeout(semanticTimer);
  semanticSequence++;
  semanticStatusSequence = 0;
  // An empty request cancels the client's pending result and its status ownership.
  void semanticSearchClient?.search('');
  state.semanticQuery = '';
  state.semanticScores = new Map();
  state.semanticStatus = {state:'idle'};
}
function scheduleSemanticSearch() {
  cancelSemanticSearch();
  if (state.searchMode !== 'recommend' || !state.query.trim()) return;
  state.semanticStatus = {state:'waiting'};
  semanticTimer = setTimeout(() => { void refreshSemanticSearch(); }, 400);
}
async function refreshSemanticSearch() {
  clearTimeout(semanticTimer);
  const sequence = ++semanticSequence;
  semanticStatusSequence = 0;
  const query = state.query.trim();
  if (state.searchMode !== 'recommend' || !query) return;
  if (/^(?:p\d{3}|\d{4})$/i.test(query)) {
    void semanticSearchClient?.search('');
    state.semanticStatus = {state:'exact'};
    updateSearchStatus();
    return;
  }
  state.semanticStatus = {state:'loading'};
  semanticStatusSequence = sequence;
  updateSearchStatus();
  try {
    semanticSearchClient ||= createSemanticSearch({onStatus(status) {
      // Even a failure while typing must discard the failed client before a retry.
      if (status.state === 'fallback') {
        const failedClient = semanticSearchClient;
        semanticSearchClient = undefined;
        failedClient?.dispose();
      }
      if (semanticStatusSequence === semanticSequence && state.searchMode === 'recommend' && state.query.trim()) {
        state.semanticStatus = status;
        updateSearchStatus();
      }
    }});
    const scores = await semanticSearchClient.search(query);
    if (sequence !== semanticSequence || state.query.trim() !== query || state.searchMode !== 'recommend') return;
    if (state.semanticStatus.state === 'fallback') {
      semanticSearchClient?.dispose();
      semanticSearchClient = undefined;
    } else {
      state.semanticQuery = query;
      state.semanticScores = scores;
      state.semanticStatus = {state:'ready'};
    }
  } catch {
    if (sequence !== semanticSequence || state.query.trim() !== query || state.searchMode !== 'recommend') return;
    state.semanticStatus = {state:'fallback'};
    semanticSearchClient?.dispose();
    semanticSearchClient = undefined;
  }
  if (['list','bookmarks','tag'].includes(state.route.view)) updateListResults();
}
function updateSearchStatus() {
  const status = document.querySelector('#search-status');
  if (!status) return;
  const query = state.query.trim();
  let message;
  if (state.searchMode === 'keyword') message = '공백으로 나눈 모든 단어가 제목·본문·분류·태그 근거에 포함된 문항을 찾습니다.';
  else if (!query) message = '만들고 싶은 문항을 문장으로 설명해 보세요. 첫 의미 검색에는 모델 약118MB와 실행 자료를 내려받습니다. 검색 문장은 이 기기에서 처리합니다.';
  else if (state.semanticStatus.state === 'ready') message = '문장 의미·관련 표현·분류·구조를 함께 비교했습니다. 각 문항의 추천 근거를 확인하세요.';
  else if (state.semanticStatus.state === 'exact') message = '문항 번호가 일치하는 자료를 먼저 찾았습니다.';
  else if (state.semanticStatus.state === 'fallback') message = '이 기기에서 의미 비교를 준비하지 못해 관련 표현·분류로 검색했습니다. 키워드 검색도 사용할 수 있습니다.';
  else if (state.semanticStatus.state === 'searching') message = '문장의 뜻을 비교하고 있습니다. 관련 표현·분류로 찾은 결과를 먼저 보여드립니다.';
  else if (state.semanticStatus.state === 'loading') message = `처음 한 번 의미 검색 자료를 준비하고 있습니다${Number.isFinite(state.semanticStatus.progress) ? ` · ${Math.round(state.semanticStatus.progress)}%` : ''}. 지금은 관련 표현·분류로 찾은 결과입니다.`;
  else message = '관련 표현·분류로 찾은 후보입니다. 문장의 뜻도 함께 비교합니다.';
  if (state.searchMode === 'recommend' && query && state.localTexts.size) message += ' 개인 교정본은 표현 검색에 반영하며 의미 비교 자료는 공개 원문 기준입니다.';
  status.textContent = message;
}

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
  return /^(?:assets|data)\/[a-zA-Z0-9_.\/-]+$/.test(value) && !value.includes('..') ? `${value}?v=${CACHE_VERSION}` : '';
}
function sourceStorage() {
  try { return typeof indexedDB === 'undefined' ? undefined : indexedDB; } catch { return undefined; }
}
async function ensureSourceSnapshot() {
  if (!state.sourceLoadFailed) return;
  const saved = await loadLocalSources(sourceStorage(), state.data.questions, {strict:true});
  state.localSources = new Map([...saved, ...state.localSources]);
  state.localSources.forEach(({image, ...record}) => state.localTexts.set(record.id, record));
  state.sourceLoadFailed = false;
}
function usesImageBundle(question) {
  return question.sourceAccess !== 'local-only' && Boolean(question.imageBundle || question.sourceAccess === 'bundled');
}
function imageFor(question, thumbnail = false) {
  const local = state.localSources.get(question.id);
  if (local) return local.image;
  if (question.sourceAccess === 'local-only') return '';
  return usesImageBundle(question) ? imageBundles.get(question).url : safeAsset(thumbnail ? question.thumbnail || question.image : question.image);
}
function imagePlaceholder(question, thumbnail = false) {
  const failed = imageBundles.get(question).status === 'error';
  if (thumbnail) return `<span class="thumbnail-placeholder image-loading" aria-hidden="true"><small>원본 이미지</small><strong>${esc(String(question.number).padStart(2, '0'))}</strong><span>${failed ? '상세에서 다시 불러오기' : '불러오는 중'}</span></span>`;
  return `<div class="image-loading-state" role="status"><p>${failed ? '원본 이미지를 불러오지 못했습니다.' : '원본 이미지를 불러오는 중입니다.'}</p>${failed ? `<button type="button" class="button button-quiet" data-retry-image="${esc(question.id)}">다시 불러오기</button>` : '<span class="image-loading-dot" aria-hidden="true"></span>'}</div>`;
}
function thumbnailMarkup(question) {
  const url = imageFor(question, true);
  return url ? `<img src="${esc(url)}" alt="" loading="lazy" decoding="async">` : usesImageBundle(question) ? imagePlaceholder(question, true) : `<span class="thumbnail-placeholder" aria-hidden="true"><small>문항</small><strong>${esc(String(question.number).padStart(2, '0'))}</strong><span>${esc(question.fields?.[0] || questionTags(question, 'field')[0]?.label || '추리논증')}</span></span>`;
}
function sourceImageMarkup(question) {
  const url = imageFor(question);
  return url ? `<button type="button" class="source-image-button" data-enlarge="${esc(question.id)}" aria-label="${esc(question.id)}번 원본 확대"><img class="source-image" src="${esc(url)}" alt="${esc(question.id)}번 원본 문항. 원문은 추출 텍스트 보기에서도 읽을 수 있습니다." decoding="async"></button>` : imagePlaceholder(question);
}
function updateImageHolders() {
  document.querySelectorAll('[data-image-question]').forEach(holder => {
    const question = state.questions.get(holder.dataset.imageQuestion);
    if (!question || !usesImageBundle(question)) return;
    const thumbnail = holder.dataset.imageKind === 'thumbnail';
    holder.innerHTML = thumbnail ? thumbnailMarkup(question) : sourceImageMarkup(question);
    holder.classList.toggle('is-placeholder', thumbnail && !imageFor(question, true));
    holder.setAttribute('aria-busy', String(['idle', 'pending'].includes(imageBundles.get(question).status)));
  });
}
async function hydrateImages(questions) {
  const generation = ++imageHydrationVersion;
  visibleImageQuestions = questions;
  const pending = questions.filter(question => usesImageBundle(question) && ['idle', 'pending'].includes(imageBundles.get(question).status));
  if (!pending.length) { updateImageHolders(); return; }
  await Promise.allSettled(pending.map(question => imageBundles.load(question)));
  if (generation === imageHydrationVersion) updateImageHolders();
}
function updateImageDialog(question) {
  if (dialogQuestionId !== question.id || !imageDialog.open) return;
  const image = document.querySelector('#enlarged-image');
  const url = imageFor(question);
  image.hidden = !url;
  if (url) image.src = url; else image.removeAttribute('src');
  image.alt = `${question.id}번 문항의 원본 이미지.`;
  const status = document.querySelector('#image-dialog-status');
  status.hidden = Boolean(url);
  status.innerHTML = url ? '' : imagePlaceholder(question);
}
async function retryImage(id) {
  const question = state.questions.get(id);
  if (!question || !usesImageBundle(question)) return;
  const request = imageBundles.load(question, { retry: true });
  updateImageHolders();
  updateImageDialog(question);
  await Promise.allSettled([request, hydrateImages(visibleImageQuestions)]);
  updateImageDialog(question);
}
function examLabel(question) {
  return question.examLabel || `${question.year}학년도`;
}
function archiveScope() {
  const count = state.data.exam?.examCount || state.data.exams?.length || new Set(state.data.questions.map(question => question.examKey || question.year)).size;
  return count > 1 ? `${count}회분` : examLabel(state.data.questions[0] || { year: '' });
}
function emptyTaxonomyLabel() {
  return state.data.exams || state.data.exam?.examCount ? '현재 아카이브 자료 없음' : `현재 ${state.data.questions[0]?.year || ''} 자료 없음`;
}
function canonicalTagId(id) {
  return state.data?.tagAliases?.[id] || id;
}
function tagParent(tag) {
  if (tag.parentTagId) return `${AXES.find(axis => axis.id === tag.axis)?.label || '분류'} · ${state.taxonomy.get(tag.parentTagId)?.label || tag.parentLabel || ''}${tag.refinementGroup ? ` · ${tag.refinementGroup}` : ''}`;
  const fields = tag.parentFields?.length ? tag.parentFields : tag.parentField ? [tag.parentField] : [];
  return fields.length ? `분야 · ${fields.join(' · ')}` : tag.parentDomain ? `대범주 · ${tag.parentDomain}` : '';
}
function loadReviews() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const previous = stored.reviews && typeof stored.reviews === 'object' ? stored.reviews : {};
    state.reviews = normalizeReviews(previous);
    if (JSON.stringify(previous) !== JSON.stringify(state.reviews)) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 2, reviews: state.reviews })); } catch { /* Records remain available in this tab. */ }
    }
    state.modePreference = localStorage.getItem(VIEW_KEY) === 'scroll' ? 'scroll' : 'paged';
    const size = Number(localStorage.getItem(SIZE_KEY));
    if (size >= 13 && size <= 24) state.textSize = size;
  } catch { state.reviews = {}; }
}
function saveReview(id, change) {
  const old = state.reviews[id] || {};
  state.reviews[id] = { ...old, ...change, updatedAt: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 2, reviews: state.reviews }));
    state.storageFailed = false;
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
  value = canonicalTagId(value);
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
  return `${tag.label} · ${AXES.find(axis => axis.id === tag.axis)?.label || '분류'}${tagParent(tag) ? `\n${tagParent(tag)}` : ''}\n${tag.description || '이 분류에 해당하는 문항을 모아 봅니다.'}${reason ? `\n\n이 문항에 붙인 이유\n${asText(reason)}` : ''}\n\n클릭하면 이 태그의 문항 목록으로 이동합니다.`;
}
function effectiveTags() {
  return [...new Set([...(state.route.tags || []), ...(state.route.view === 'tag' && state.route.id ? [state.route.id] : [])])];
}
function tagButton(tag, question, filter = false, groupLabel = '') {
  const active = effectiveTags().includes(tag.id);
  const body = `${filter ? '' : '<span class="tag-dot" aria-hidden="true"></span>'}${esc(tag.label)}`;
  const shared = `data-axis="${esc(tag.axis)}" data-tooltip="${esc(tagDescription(tag, question))}" aria-describedby="tag-tooltip"`;
  return filter ? `<button type="button" class="filter-choice${active ? ' is-active' : ''}" ${shared} data-tag-search="${esc([tag.label, tag.description, tagParent(tag), groupLabel].filter(Boolean).join(' '))}" data-filter-tag="${esc(tag.id)}" aria-pressed="${active}">${body}</button>` : `<a class="tag-chip${active ? ' is-active' : ''}" ${shared} href="${esc(buildRoute({ view: 'tag', id: tag.id, mode: state.route.mode || state.modePreference, sort: state.route.sort }))}">${body}</a>`;
}
function reviewBadge(id) {
  const status = state.reviews[id]?.status;
  return status === 'done' ? '<span class="review-status done"><i class="review-dot"></i>검수 완료</span>' : status === 'check' ? '<span class="review-status check"><i class="review-dot"></i>재검토</span>' : '';
}
function colorDots(colors) {
  return colors.map(id => { const color = BOOKMARK_COLORS.find(item => item.id === id); return color ? `<i class="bookmark-dot" style="--bookmark-color:${esc(color.hex)}" title="${esc(color.label)}"></i>` : ''; }).join('');
}
function bookmarkButton(id, compact = false) {
  const colors = bookmarkColors(state.reviews[id]);
  const labels = colors.map(id => BOOKMARK_COLORS.find(color => color.id === id)?.label).filter(Boolean).join(', ');
  return `<button type="button" class="${compact ? 'bookmark-trigger compact' : 'button button-quiet bookmark-trigger'}${colors.length ? ' is-active' : ''}" data-bookmark="${esc(id)}" aria-haspopup="dialog" aria-label="${esc(id)} 북마크 색 선택${labels ? ` · ${esc(labels)}` : ''}">${icon('bookmark', colors.length > 0)}${colors.length ? `<span class="bookmark-dots" aria-hidden="true">${colorDots(colors)}</span>` : ''}${compact ? '' : `<span>${colors.length ? '북마크 색' : '북마크'}</span>`}</button>`;
}
function navigate(route, focus) {
  hideTooltip();
  nextFocus = focus || null;
  const hash = buildRoute({ mode: state.route.mode || state.modePreference, sort: state.route.sort, ...route });
  if (hash === location.hash) render();
  else location.hash = hash;
}
function moveQuestionByArrow(direction) {
  if (state.route.view !== 'question' || !state.data) return false;
  const ordered = state.route.sort === 'accuracy' || state.searchMode === 'recommend' && state.query.trim()
    ? filteredQuestions()
    : filterQuestions(state.data.questions, { sort: state.route.sort });
  const currentId = keyboardQuestionId || state.route.id;
  const index = ordered.findIndex(question => question.id === currentId);
  const target = ordered[index + direction];
  if (!target) return false;
  keyboardQuestionId = target.id;
  navigate({ ...state.route, view: 'question', id: target.id });
  return true;
}
function listRoute(change = {}) {
  const view = ['list', 'bookmarks', 'tag'].includes(state.route.view) ? state.route.view : 'list';
  return { ...state.route, view, page: 1, ...change };
}
function toggleTag(id) {
  if (state.route.view === 'question' || state.route.view === 'tags') {
    navigate({ view: 'tag', id, page: 1 }, { main: true });
    return;
  }
  if (state.route.view === 'tag' && state.route.id === id) {
    navigate({ ...listRoute(), view: 'list', id: null, tags: state.route.tags.filter(tag => tag !== id) }, { tag: id });
    return;
  }
  const tags = new Set(state.route.tags);
  if (tags.has(id)) tags.delete(id); else tags.add(id);
  navigate(listRoute({ tags: [...tags] }), { tag: id });
}
function resetFilters() {
  state.query = '';
  cancelSemanticSearch();
  state.review = 'all';
  navigate(listRoute({ tags: [], bookmark: state.route.view === 'bookmarks' ? 'any' : 'all' }), { search: true });
}
function filteredQuestions() {
  const questions = state.data.questions.map(question => state.localTexts.has(question.id) ? { ...question, text: state.localTexts.get(question.id).text } : question);
  const recommend = state.searchMode === 'recommend' && Boolean(state.query.trim());
  const candidates = filterQuestions(questions, { query: recommend ? '' : state.query, tags: effectiveTags(), taxonomy: state.taxonomy, review: state.review, sort: state.route.sort, bookmark: state.route.bookmark || (state.route.view === 'bookmarks' ? 'any' : 'all') }, state.reviews);
  state.searchMatches = new Map();
  if (!recommend) return candidates;
  const matches = rankReferences(candidates, state.query, {semanticScores:state.semanticQuery === state.query.trim() ? state.semanticScores : new Map()});
  state.searchMatches = new Map(matches.map(match => [match.id, match]));
  if (state.searchSort === 'relevance') {
    const byId = new Map(candidates.map(question => [question.id, question]));
    return matches.map(match => byId.get(match.id)).filter(Boolean);
  }
  const available = candidates.filter(question => state.searchMatches.has(question.id));
  if (state.searchSort === 'accuracy') {
    const scores = new Map(available.map(question => [question.id, keywordSearchScore(question, state.query)]));
    available.sort((a,b) => scores.get(b.id) - scores.get(a.id));
  }
  return available;
}
function tagCount(id) { return state.tagCounts.get(id) || 0; }
function filterPanel() {
  return `<aside class="filter-panel${state.filtersOpen ? ' is-open' : ''}" aria-label="문항 분류 필터">
    <button class="filter-toggle" type="button" data-toggle-filters aria-expanded="${state.filtersOpen}" aria-controls="filter-content"><span>${icon('filter')} 분류로 좁혀 보기${effectiveTags().length ? ` · ${effectiveTags().length}개 선택` : ''}</span>${icon('down')}</button>
    <div class="filter-heading"><h2>분류로 좁혀 보기</h2><button class="button-text" type="button" data-reset>초기화</button></div>
    <div id="filter-content" class="filter-content"><p class="filter-help">연도끼리는 OR, 나머지 태그는 AND로 적용합니다.<br>대범주를 펼치면 분야와 소재를 고를 수 있습니다.</p>${renderSidebar({taxonomy: state.taxonomy, selectedTags: effectiveTags(), openKeys: state.filterOpen}, (tag, path) => tagButton(tag, null, true, path))}<p class="filter-help">검색·북마크·검수 상태도 모두 함께 적용합니다. <a href="${esc(buildRoute({ view: 'tags', sort: state.route.sort, mode: state.route.mode }))}">태그 전체 보기 ↗</a></p></div>
  </aside>`;
}

function bookmarkCount(color) {
  return state.data.questions.filter(question => { const colors = bookmarkColors(state.reviews[question.id]); return color === 'any' ? colors.length : colors.includes(color); }).length;
}
function colorFilters() {
  const selected = state.route.bookmark || (state.route.view === 'bookmarks' ? 'any' : 'all');
  return `<div class="color-filters" role="group" aria-label="북마크 색 필터">${state.route.view !== 'bookmarks' ? `<button type="button" class="color-filter${selected === 'all' ? ' is-active' : ''}" data-bookmark-filter="all" aria-pressed="${selected === 'all'}">전체 문항</button>` : ''}<button type="button" class="color-filter${selected === 'any' ? ' is-active' : ''}" data-bookmark-filter="any" aria-pressed="${selected === 'any'}">${icon('bookmark')} 모든 북마크 <span>${bookmarkCount('any')}</span></button>${BOOKMARK_COLORS.map(color => `<button type="button" class="color-filter${selected === color.id ? ' is-active' : ''}" data-bookmark-filter="${color.id}" aria-pressed="${selected === color.id}"><i class="bookmark-dot" style="--bookmark-color:${esc(color.hex)}" aria-hidden="true"></i>${esc(color.label)} <span>${bookmarkCount(color.id)}</span></button>`).join('')}</div>`;
}
function selectedFilterChips() {
  const tags = effectiveTags();
  const expression = tagFilterGroups(tags, state.taxonomy).map(group => {
    const labels = group.tags.map(id => state.taxonomy.get(id)?.label || id);
    return group.operator === 'or' && labels.length > 1 ? `(${labels.join(' 또는 ')})` : labels.join(' 그리고 ');
  }).join(' 그리고 ');
  return `<div id="selected-filters" class="selected-filters"${tags.length ? '' : ' hidden'}><p class="filter-expression"><strong>적용 중인 조건</strong><span>${esc(expression)}</span></p>${tags.map(id => { const tag = state.taxonomy.get(id); return `<button type="button" class="selected-filter" data-remove-tag="${esc(id)}" aria-label="${esc(tag?.label || id)} 필터 해제">${esc(tag?.label || id)}${icon('close')}</button>`; }).join('')}<button class="button-text" type="button" data-reset>조건 초기화</button></div>`;
}
function renderList() {
  const isBookmarks = state.route.view === 'bookmarks';
  const isTag = state.route.view === 'tag';
  const tag = isTag ? state.taxonomy.get(state.route.id) : null;
  if (isTag && !tag) {
    document.title = '태그를 찾을 수 없습니다 · LEET Atlas';
    main.innerHTML = '<div class="error-state"><h1>태그를 찾을 수 없습니다.</h1><a class="button" href="#/tags">태그 사전으로</a></div>';
    return;
  }
  const title = isBookmarks ? '모든 북마크' : tag ? tag.label : '문항 탐색';
  document.title = `${title} · LEET Atlas`;
  const headingCopy = isBookmarks ? '붙여 둔 색으로 문항을 모으고, 태그로 다시 좁혀 보세요.' : tag ? tag.description || '이 태그가 부여된 모든 문항과 분류 이유를 확인합니다.' : '만들고 싶은 문항을 설명하고, 참고할 기출문항과 추천 근거를 찾아보세요.';
  main.innerHTML = `${isTag ? `<a class="catalog-back" href="${esc(buildRoute({ view: 'tags', mode: state.route.mode, sort: state.route.sort }))}">${icon('left')} 태그 사전</a>` : ''}<div class="page-heading"><div><div class="eyebrow">${isBookmarks ? 'MY BOOKMARKS' : isTag ? `${esc(AXES.find(axis => axis.id === tag.axis)?.label || 'TAG')} · TAG COLLECTION` : 'QUESTION LIBRARY'}</div><h1>${esc(title)}</h1><p>${esc(headingCopy)}</p>${tag && tagParent(tag) ? `<p class="tag-parent">${esc(tagParent(tag))}</p>` : ''}</div><div class="page-count"><strong id="collection-total">${isBookmarks ? bookmarkCount('any') : tag ? tagCount(tag.id) : state.data.questions.length}</strong>문항 <span aria-hidden="true">/</span> ${esc(archiveScope())}</div></div>
  <div class="list-layout">${filterPanel()}<section class="list-main" aria-label="문항 목록"><div class="search-row"><label class="search-mode-label"><span class="sr-only">검색 방식</span><select id="search-mode" class="review-select" aria-label="검색 방식"><option value="recommend">참고 문항 추천</option><option value="keyword">키워드 검색</option></select></label><label class="search-box">${icon('search')}<input id="question-search" type="search" value="${esc(state.query)}" placeholder="${state.searchMode === 'keyword' ? '문항번호, 분야, 소재, 본문으로 검색' : '예: 인문 논리학 소재의, 두 사람이 서로 논박하는 문항'}" aria-label="문항 검색" autocomplete="off"></label><select id="review-filter" class="review-select" aria-label="검수 상태 필터"><option value="all">모든 검수 상태</option><option value="unreviewed">미검수</option><option value="check">재검토</option><option value="done">검수 완료</option></select></div>
    <p id="search-status" class="search-status" role="status" aria-live="polite"></p><button type="button" class="search-example button-text" data-search-example>예시: 인문 논리학 소재의, 2명이 서로 싸우는 문항</button>
    <div id="color-filter-area">${colorFilters()}</div>${selectedFilterChips()}
    <div class="list-toolbar"><span id="result-count" role="status" aria-live="polite"></span><div class="list-display-controls"><select id="question-sort" class="review-select sort-select" aria-label="문항 정렬"><option value="relevance">관련성순</option><option value="oldest">오래된순</option><option value="newest">최신순</option><option value="accuracy">정확도 순</option></select><div class="segmented" role="group" aria-label="목록 보기 방식"><button type="button" data-list-mode="paged" class="${state.route.mode !== 'scroll' ? 'is-active' : ''}" aria-pressed="${state.route.mode !== 'scroll'}">10개씩</button><button type="button" data-list-mode="scroll" class="${state.route.mode === 'scroll' ? 'is-active' : ''}" aria-pressed="${state.route.mode === 'scroll'}">연속 스크롤</button></div></div></div><div id="question-list" class="question-list question-grid"></div><div id="list-pagination"></div>
      </section></div>`;
  document.querySelector('#review-filter').value = state.review;
  document.querySelector('#search-mode').value = state.searchMode;
  document.querySelector('#question-sort').value = state.searchMode === 'recommend' && state.query.trim() && state.searchSort === 'relevance' ? 'relevance' : state.route.sort;
  updateListResults();
}
function questionRoute(question) {
  return { ...state.route, view: 'question', id: question.id, tags: effectiveTags() };
}
function questionCard(question) {
  const rowTags = ['domain', 'field', 'type'].flatMap(axis => questionTags(question, axis)).slice(0, 3);
  const href = buildRoute(questionRoute(question));
  const activeTag = state.route.view === 'tag' ? state.taxonomy.get(state.route.id) : null;
  const reason = activeTag ? question.tagReasons?.[activeTag.label] || question.tagReasons?.[activeTag.id] : null;
  const thumbnail = imageFor(question, true);
  const match = state.searchMatches.get(question.id);
  const recommendation = match ? `<div class="reference-match"><p class="reference-reasons"><strong>추천 근거</strong> ${esc(match.reasons.length ? match.reasons.slice(0,3).join(' · ') : '문장 의미가 비슷한 후보')}</p>${match.snippet ? `<p class="reference-snippet">${esc(match.snippet)}</p>` : ''}</div>` : '';
  return `<article class="question-row question-card"><div class="row-content"><div class="card-kicker"><a class="row-index" href="${esc(href)}" aria-label="${esc(question.id)}번 문항 열기">${esc(question.id)}</a><span class="card-year">${esc(examLabel(question))} · ${String(question.number).padStart(2, '0')}</span>${bookmarkButton(question.id, true)}</div><a class="row-title-link" href="${esc(href)}">${esc(question.title || `${question.number}번 문항`)}</a><div class="row-meta"><span>문제지 ${esc(question.examPage)}쪽</span>${question.answerStatus === 'source-conflict' ? '<span class="conflict-badge">원본 문항·답안 불일치</span>' : ''}${reviewBadge(question.id)}</div><div class="row-tags">${rowTags.map(tag => tagButton(tag, question)).join('')}</div>${recommendation}${activeTag ? `<p class="tag-reason"><strong>부여 이유</strong> ${esc(reason ? asText(reason) : '문항별 부여 이유가 아직 기록되지 않았습니다.')}</p>` : ''}</div><a class="row-thumb${thumbnail ? '' : ' is-placeholder'}" ${usesImageBundle(question) ? `data-image-question="${esc(question.id)}" data-image-kind="thumbnail"` : ''} href="${esc(href)}" aria-label="${esc(question.id)}번 문항 상세 보기">${thumbnailMarkup(question)}</a></article>`;
}
function paginationMarkup(result) {
  if (!result.total) return '';
  if (state.route.mode === 'scroll') return `<div class="pagination-note">${result.total}개 문항을 모두 표시합니다.</div>`;
  const nearby = Array.from({ length: result.pageCount }, (_, i) => i + 1).filter(page => result.pageCount <= 7 || page === 1 || page === result.pageCount || Math.abs(page - result.page) <= 2);
  const pages = nearby.map((page, i) => `${i && page > nearby[i - 1] + 1 ? '<span class="pagination-gap" aria-hidden="true">…</span>' : ''}<button type="button" class="page-button${page === result.page ? ' is-active' : ''}" data-list-page="${page}" ${page === result.page ? 'aria-current="page"' : ''} aria-label="${page}페이지">${page}</button>`).join('');
  return `<nav class="list-pagination" aria-label="목록 페이지"><button type="button" class="page-button" data-list-page="${result.page - 1}" ${result.page === 1 ? 'disabled' : ''} aria-label="이전 목록 페이지">${icon('left')}<span>이전</span></button>${pages}<button type="button" class="page-button" data-list-page="${result.page + 1}" ${result.page === result.pageCount ? 'disabled' : ''} aria-label="다음 목록 페이지"><span>다음</span>${icon('right')}</button></nav>`;
}
function updateListResults() {
  const questions = filteredQuestions();
  updateSearchStatus();
  const sorting = document.querySelector('#question-sort');
  if (sorting) sorting.value = state.searchMode === 'recommend' && state.query.trim() && state.searchSort === 'relevance' ? 'relevance' : state.route.sort;
  const count = document.querySelector('#result-count');
  if (!count) return;
  const result = paginateQuestions(questions, { page: state.route.page || 1, pageSize: 10, mode: state.route.mode || 'paged' });
  if (state.route.page !== result.page) {
    state.route.page = result.page;
    history.replaceState(null, '', buildRoute(state.route));
  }
  count.innerHTML = `<strong>${result.total}</strong>개 문항${result.total ? `<span> · ${result.from}–${result.to} 표시</span>` : ''}`;
  const zeroBaseTag = state.route.view === 'tag' && tagCount(state.route.id) === 0;
  document.querySelector('#question-list').innerHTML = result.items.length ? result.items.map(questionCard).join('') : `<div class="empty-state"><strong>${zeroBaseTag ? emptyTaxonomyLabel() : state.route.view === 'bookmarks' && !bookmarkCount('any') ? '아직 북마크한 문항이 없습니다.' : '조건에 맞는 문항이 없습니다.'}</strong><p>${zeroBaseTag ? '이 분류에 연결된 문항이 아직 없습니다. 현재 문항을 임의로 연결하지 않았습니다.' : state.route.view === 'bookmarks' && !bookmarkCount('any') ? '문항의 북마크 버튼에서 원하는 색을 골라 주세요.' : '검색어나 태그, 북마크 색을 줄여 다시 찾아보세요.'}</p><button class="button button-sage" type="button" data-reset>조건 초기화</button></div>`;
  document.querySelector('#list-pagination').innerHTML = paginationMarkup(result);
  void hydrateImages(result.items);
}
function catalogTags() {
  const term = state.tagQuery.normalize('NFKC').trim().toLocaleLowerCase('ko');
  return [...state.taxonomy.values()].filter(tag => (state.tagAxis === 'all' || tag.axis === state.tagAxis) && (!term || `${tag.label} ${state.neighborhoods.get(tag.id) || ''} ${tag.description || ''} ${tag.parentDomain || ''} ${(tag.parentFields || [tag.parentField]).filter(Boolean).join(' ')}`.normalize('NFKC').toLocaleLowerCase('ko').includes(term)));
}
function renderTagCatalogResults() {
  const tags = catalogTags();
  document.querySelector('#tag-catalog-count').textContent = `${tags.length}개 태그`;
  document.querySelector('#tag-catalog-results').innerHTML = tags.length ? AXES.map(axis => {
    const groups = groupTags(tags, { axis: axis.id });
    if (!groups.length) return '';
    return `<section class="tag-catalog-section"><h2>${axis.label}<span>${groups.reduce((n, group) => n + group.tags.length, 0)}</span></h2>${groups.map(group => `<section class="tag-neighborhood"><h3>${esc(group.label)}<span>${group.tags.length}개 태그</span></h3><div class="tag-catalog-grid">${group.tags.map(tag => `<a class="tag-catalog-card${tagCount(tag.id) ? '' : ' is-empty'}" href="${esc(buildRoute({ view: 'tag', id: tag.id, mode: state.route.mode || state.modePreference, sort: state.route.sort }))}"><div class="tag-catalog-card-title"><strong>${esc(tag.label)}</strong><span>${tagCount(tag.id)}문항</span></div>${tagParent(tag) ? `<span class="catalog-parent">${esc(tagParent(tag))}</span>` : ''}<p>${esc(tag.description || '분류 정의를 검토 중입니다.')}</p>${!tagCount(tag.id) ? `<small>${esc(emptyTaxonomyLabel())}</small>` : ''}</a>`).join('')}</div></section>`).join('')}</section>`;
  }).join('') : '<div class="empty-state"><strong>일치하는 태그가 없습니다.</strong><p>태그 이름이나 정의, 연관 묶음 이름을 검색해 보세요.</p></div>';
}

function renderTags() {
  document.title = '태그 사전 · LEET Atlas';
  main.innerHTML = `<div class="page-heading"><div><div class="eyebrow">TAXONOMY INDEX</div><h1>태그 사전</h1><p>분류의 뜻과 문항별 부여 이유를 살펴보세요. 0건인 분류도 함께 보존합니다.</p></div><div class="page-count"><strong>${state.taxonomy.size}</strong>태그</div></div><section class="tag-catalog" aria-label="태그 전체 목록"><div class="catalog-toolbar"><label class="search-box">${icon('search')}<input id="tag-catalog-search" type="search" value="${esc(state.tagQuery)}" placeholder="태그 이름, 정의, 상위 범주 검색" aria-label="태그 사전 검색" autocomplete="off"></label><span id="tag-catalog-count" role="status" aria-live="polite"></span></div><div class="tag-axis-nav" role="group" aria-label="분류 축 선택"><button type="button" data-tag-axis="all" class="${state.tagAxis === 'all' ? 'is-active' : ''}" aria-pressed="${state.tagAxis === 'all'}">전체</button>${AXES.map(axis => `<button type="button" data-tag-axis="${axis.id}" class="${state.tagAxis === axis.id ? 'is-active' : ''}" aria-pressed="${state.tagAxis === axis.id}">${axis.label}</button>`).join('')}</div><div id="tag-catalog-results"></div></section>`;
  renderTagCatalogResults();
}
function updateNavigation() {
  const view = state.route.view === 'question' ? state.returnRoute?.view || 'list' : state.route.view;
  const activeView = ['tag', 'tags'].includes(view) ? 'tags' : view;
  document.querySelectorAll('[data-nav-view]').forEach(link => {
    const active = link.dataset.navView === activeView;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    link.href = buildRoute({ view: link.dataset.navView, id: link.dataset.navView === 'analysis' ? (state.route.view === 'analysis' ? state.route.id : state.returnRoute?.view === 'analysis' ? state.returnRoute.id : null) : null, mode: state.route.mode || state.modePreference, sort: state.route.sort });
  });
  const allBookmarksLink = document.querySelector('#palette-all-link');
  if (allBookmarksLink) allBookmarksLink.href = buildRoute({ view: 'bookmarks', mode: state.route.mode, sort: state.route.sort });
  const total = document.querySelector('#bookmark-total');
  if (total) total.textContent = bookmarkCount('any');
}
function renderRibbon(question) {
  return `<div class="taxonomy-ribbon" aria-label="문항 분류 태그">${AXES.map(axis => {
    const tags = questionTags(question, axis.id);
    return tags.length ? `<div class="taxonomy-group"><span class="taxonomy-label">${axis.label}</span>${tags.map(tag => tagButton(tag, question)).join('')}</div>` : '';
  }).join('')}</div>`;
}
function renderAnswer(question) {
  if (question.answerStatus === 'source-conflict') {
    return `<div class="conflict-alert" role="note"><strong>원본 문항·답안 불일치</strong><p>${esc(asText(question.answerIssue || question.answerWarning || question.answerConflict?.message) || '원본 표시 답안과 독립 풀이가 일치하지 않습니다. 보기 판단과 검수 참고를 함께 확인해 주세요. 원본은 그대로 보존했으며 공식 답안을 확정하지 않았습니다.')}</p><div class="conflict-source"><span>보존한 원본 표시 답안</span><b>${esc(CIRCLED[question.answer] || question.answer)} · 검토 필요</b></div>${question.derivedConclusion ? `<div class="conflict-derived"><strong>문언에 따른 자체 풀이</strong><p>${esc(question.derivedConclusion)}</p></div>` : ''}</div>`;
  }
  return `<div class="answer-strip"><div><span class="answer-caption">원본 표시 + 독립 풀이 대조</span><strong>정답 ${esc(CIRCLED[question.answer] || '확인 중')}</strong></div><p class="answer-basis">${esc(question.answerBasis || '원본 회색 강조와 독립 풀이를 대조했습니다.')}<br>공식정답 외부 대조 미완료</p></div>`;
}
function explanationSections(question) {
  const steps = question.steps || [];
  const statements = question.statements || [];
  const allOptions = question.options || [];
  const correctOptions = allOptions.filter(option => option.correct === true);
  const verifiedSingleAnswer = question.answerStatus !== 'source-conflict' && correctOptions.length === 1;
  const options = verifiedSingleAnswer ? correctOptions : allOptions;
  const pitfalls = question.pitfalls || [];
  const reviewNotes = question.reviewNotes || [];
  return `${renderAnswer(question)}<section class="explanation-section"><h3 class="section-title"><span class="section-marker">01</span>핵심 해설</h3><p class="summary-text">${esc(question.summary || '이 문항의 해설은 준비 중입니다.')}</p></section>
  ${steps.length ? `<section class="explanation-section"><h3 class="section-title"><span class="section-marker">02</span>풀이의 흐름</h3><ol class="steps-list">${steps.map((step, i) => `<li><span class="step-number">${i + 1}</span><div>${typeof step === 'object' && step.title ? `<strong>${esc(step.title)}</strong>` : ''}${esc(asText(step))}</div></li>`).join('')}</ol></section>` : ''}
  ${statements.length ? `<section class="explanation-section"><h3 class="section-title"><span class="section-marker">03</span>보기 판단</h3><div class="verdict-list">${statements.map(statement => `<div class="verdict-item${statement.verdict === true ? ' is-true' : statement.verdict === false ? ' is-false' : ''}"><div class="verdict-heading"><span class="verdict-label">${esc(statement.label)}</span><span class="verdict-token">${statement.verdict === true ? '옳음' : statement.verdict === false ? '옳지 않음' : '검토 필요'}</span></div><p>${esc(statement.explanation)}</p></div>`).join('')}</div></section>` : ''}
  ${options.length ? `<section class="explanation-section"><h3 class="section-title"><span class="section-marker">${statements.length ? '04' : '03'}</span>${verifiedSingleAnswer ? '정답 선택지 해설' : '선택지별 해설'}</h3><div class="option-list">${options.map(option => {
    const conflict = question.answerStatus === 'source-conflict';
    return `<div class="option-row${option.correct && !conflict ? ' is-correct' : ''}${conflict && Number(option.number) === Number(question.answer) ? ' source-conflict' : ''}"><span class="option-number">${esc(CIRCLED[option.number] || option.number)}</span><div>${option.correct && !conflict ? '<span class="option-correct-label">정답</span>' : ''}${conflict && Number(option.number) === Number(question.answer) ? '<span class="conflict-badge">원본 표시 · 불일치</span> ' : ''}${esc(option.explanation)}</div></div>`;
  }).join('')}</div></section>` : ''}
  ${pitfalls.length ? `<section class="explanation-section pitfall-box"><h3 class="section-title">놓치기 쉬운 지점</h3><ul>${pitfalls.map(pitfall => `<li>${esc(asText(pitfall))}</li>`).join('')}</ul></section>` : ''}
  ${reviewNotes.length ? `<section class="review-notes"><h3 class="section-title">검수 참고${question.confidence ? ` · 해설 확신도 ${esc(question.confidence)}` : ''}</h3><ul class="review-notes-list">${reviewNotes.map(note => `<li>${esc(asText(note))}</li>`).join('')}</ul></section>` : ''}`;
}
function classificationSections(question) {
  return `<div class="classification-notice" role="note"><strong>정답·해설 미검토</strong><p>원문을 바탕으로 소재와 태그를 분류했습니다. 정답과 선택지별 해설은 아직 검토하지 않았습니다.</p></div>${AXES.filter(axis => axis.id !== 'year').map(axis => {
    const tags = questionTags(question, axis.id);
    if (!tags.length) return '';
    return `<section class="explanation-section classification-section"><h3 class="section-title">${axis.label}</h3>${tags.map(tag => {
      const reason = question.tagReasons?.[tag.id] || question.tagReasons?.[tag.label];
      return `<div class="classification-item">${tagButton(tag, question)}${tagParent(tag) ? `<span class="classification-parent">${esc(tagParent(tag))}</span>` : ''}<p class="classification-definition">${esc(tag.description || '')}</p><p class="classification-reason"><strong>부여 이유</strong> ${esc(reason ? asText(reason) : '문항별 분류 이유를 검토 중입니다.')}</p></div>`;
    }).join('')}</section>`;
  }).join('')}`;
}
function documentLinks(question) {
  const pdf = question.sourceAccess === 'local-only' ? '' : safeAsset(question.sourcePdf === undefined && question.year === 2027 ? 'data/2027-original.pdf' : question.sourcePdf);
  const page = Number(question.sourcePdfPage || question.sourcePage);
  const data = safeAsset(question.dataPath || 'data/archive.json');
  return `<p class="document-links">${pdf ? `<a href="${esc(pdf)}${Number.isInteger(page) && page > 0 ? `#page=${page}` : ''}" target="_blank" rel="noopener">${esc(examLabel(question))} 원본 PDF</a><span aria-hidden="true">·</span>` : ''}<a href="${esc(data)}" target="_blank" rel="noopener">문항 데이터 JSON</a></p>`;
}
function readerSource(question) {
  const localSource = state.localSources.get(question.id);
  if (question.sourceAccess === 'local-only' && !localSource && state.localTexts.has(question.id)) return localTextPanel(question);
  if (question.sourceAccess === 'local-only' && !localSource) {
    return `<section class="reader-panel source-panel" aria-label="원문 출처"><div class="panel-heading"><h2>원문 출처 <span>SOURCE REFERENCE</span></h2></div><div class="source-reference"><span class="source-reference-icon" aria-hidden="true">${icon('grid')}</span><h3>${esc(examLabel(question))}<br>추리논증 ${esc(question.number)}번</h3><dl><div><dt>문항 ID</dt><dd>${esc(question.id)}</dd></div>${question.examPage ? `<div><dt>회차 문제지</dt><dd>${esc(question.examPage)}쪽</dd></div>` : ''}${question.sourcePage ? `<div><dt>통합 PDF</dt><dd>${esc(question.sourcePage)}쪽</dd></div>` : ''}</dl><p>원문은 제공받은 PDF에서 확인해 주세요. 이 페이지에서 ${question.answerStatus === 'not-reviewed' ? '소재·태그와 문항별 분류 이유' : '자체 해설 초안과 소재·태그'}를 살펴볼 수 있습니다.</p><button type="button" class="button button-sage" data-import-local-text>본문·이미지 파일 불러오기</button><p class="local-text-hint">이미지가 포함된 원문 파일을 선택하면 본문과 그림을 함께 볼 수 있습니다. 텍스트 전용 파일도 사용할 수 있습니다.</p></div></section>`;
  }
  const displayedText = state.localTexts.get(question.id)?.text || question.text || question.rawText || '추출 텍스트가 없습니다. 원본 이미지를 확인해 주세요.';
  const corrections = question.textCorrections || [];
  const correctionNotice = corrections.length ? `<details class="text-corrections"><summary>원본 대조로 복원한 추출 오류 ${corrections.length}곳</summary><ul>${corrections.map(item => `<li><strong>${esc(item.to)}</strong><span>${esc(item.reason)}</span></li>`).join('')}</ul><p>원본 이미지와 복원 전 추출 텍스트는 보존되어 있습니다. 전체 내역은 문항 데이터 JSON에서 확인할 수 있습니다.</p></details>` : '';
  return `<section class="reader-panel source-panel" aria-label="문항 원문"><div class="panel-heading"><h2>문항 원문 <span>ORIGINAL</span></h2><div class="source-actions"><div class="segmented" role="group" aria-label="원문 보기 방식"><button type="button" data-source-mode="image" class="${state.sourceMode === 'image' ? 'is-active' : ''}" aria-pressed="${state.sourceMode === 'image'}">원본 이미지</button><button type="button" data-source-mode="text" class="${state.sourceMode === 'text' ? 'is-active' : ''}" aria-pressed="${state.sourceMode === 'text'}">추출 텍스트</button></div><button class="icon-button" type="button" data-enlarge="${esc(question.id)}" aria-label="원본 이미지 확대">${icon('expand')}</button></div></div><div class="source-note">${icon('info')} ${localSource ? '이 브라우저에 불러온 원문입니다.' : '원본 이미지를 그대로 보존했습니다.'} 문제지 ${esc(question.examPage)}쪽${localSource ? ` · 통합 PDF ${esc(localSource.sourcePage)}쪽` : question.sourcePdfPage || question.sourcePage ? ` · 제공 PDF ${esc(question.sourcePdfPage || question.sourcePage)}쪽` : ''}</div>
  <div id="source-image-view"${state.sourceMode === 'image' ? '' : ' hidden'}><div ${usesImageBundle(question) ? `data-image-question="${esc(question.id)}" data-image-kind="source"` : ''}>${sourceImageMarkup(question)}</div></div>
  <div id="source-text-view"${state.sourceMode === 'text' ? '' : ' hidden'}><div class="text-controls"><span>글자 크기</span><button type="button" class="icon-button" data-text-size="-1" aria-label="원문 글자 작게">가−</button><span id="text-size-label">${state.textSize}px</span><button type="button" class="icon-button" data-text-size="1" aria-label="원문 글자 크게">가+</button></div><pre class="source-text" style="--reading-size:${state.textSize}px">${esc(displayedText)}</pre><p class="text-warning">PDF 문자층에서 추출한 텍스트입니다. 공백·줄바꿈·표·수식은 원본과 다를 수 있으므로 원본 이미지를 함께 확인해 주세요.</p>${correctionNotice}${localSource ? `<button type="button" class="button-text local-text-more" data-clear-local-source="${esc(question.id)}">이 원문 지우기</button>` : state.localTexts.has(question.id) ? `<button type="button" class="button-text local-text-more" data-clear-local-text="${esc(question.id)}">이 본문 지우기</button>` : ''}</div></section>`;
}
function localTextPanel(question) {
  const record = state.localTexts.get(question.id);
  return `<section class="reader-panel source-panel" aria-label="내 기기의 문항 본문"><div class="panel-heading"><h2>문항 본문 <span>MY TEXT</span></h2><button type="button" class="button-text" data-clear-local-text="${esc(question.id)}">이 본문 지우기</button></div><div class="source-note">${icon('info')} 이 브라우저에서 불러온 본문입니다. 통합 PDF ${esc(record.sourcePage)}쪽</div><div class="text-controls"><span>글자 크기</span><button type="button" class="icon-button" data-text-size="-1" aria-label="원문 글자 작게">가−</button><span id="text-size-label">${state.textSize}px</span><button type="button" class="icon-button" data-text-size="1" aria-label="원문 글자 크게">가+</button></div><pre class="source-text" style="--reading-size:${state.textSize}px">${esc(record.text)}</pre><p class="text-warning">도표·도식·수식의 배치는 원본 PDF와 함께 확인해 주세요. 불러온 본문은 서버에 전송되지 않습니다.</p><button type="button" class="button-text local-text-more" data-import-local-text>다른 본문 파일 불러오기</button></section>`;
}
async function importLocalTextFile(file) {
  try {
    if (file.size > 8 * 1024 * 1024) throw new Error('본문 파일은 8MB까지 불러올 수 있습니다.');
    const records = parseLocalTextPack(await file.text(), state.data.questions);
    await ensureSourceSnapshot();
    const merged = new Map([...state.localTexts, ...records.map(record => [record.id, record])]);
    parseLocalTextPack({schemaVersion: 1, kind: 'leet-atlas-local-text', questions: [...merged.values()]}, state.data.questions);
    const updatedSources = new Map(state.localSources);
    for (const record of records) if (updatedSources.has(record.id)) updatedSources.set(record.id, {...updatedSources.get(record.id), text: record.text});
    if (records.some(record => updatedSources.has(record.id))) await saveLocalSources(sourceStorage(), [...updatedSources.values()]);
    let persisted = true;
    try { saveLocalTexts(localStorage, [...merged.values()]); } catch { persisted = false; }
    state.localSources = updatedSources;
    state.localTexts = merged;
    render();
    const coverage = localTextCoverage(state.data.questions, state.localTexts);
    showToast(`${records.length}문항의 본문을 불러왔습니다. 본문 ${coverage.available}/${coverage.total}.${persisted ? ' 이 브라우저에 보관합니다.' : ' 저장 공간이 부족해 현재 탭에서만 표시합니다.'}`);
  } catch (error) {
    showToast(`본문을 불러오지 못했습니다. ${error.message}`);
  }
}
async function importSourceOrTextFile(file) {
  try {
    if (file.size > 64 * 1024 * 1024) throw new Error('원문 파일은 64 MiB까지 불러올 수 있습니다.');
    const serialized = await file.text();
    const kind = JSON.parse(serialized).kind;
    const cached = {size: file.size, text: async () => serialized};
    if (kind === 'leet-atlas-local-sources') await importLocalSourceFile(cached);
    else await importLocalTextFile(cached);
  } catch (error) { showToast(`원문을 불러오지 못했습니다. ${error.message}`); }
}
async function importLocalSourceFile(file) {
  try {
    if (file.size > 64 * 1024 * 1024) throw new Error('원문 파일은 64 MiB까지 불러올 수 있습니다.');
    const records = parseLocalSourcePack(await file.text(), state.data.questions);
    try { await ensureSourceSnapshot(); } catch {
      const complete = records.length === state.data.questions.filter(question => question.examKey !== '2027' && ['local-only', 'bundled'].includes(question.sourceAccess)).length;
      if (!complete) throw new Error('저장된 원문을 읽지 못했습니다. 다시 시도하거나 전체 원문 파일을 선택해 주세요.');
    }
    const sources = new Map([...state.localSources, ...records.map(record => [record.id, record])]);
    const texts = new Map(state.localTexts);
    records.forEach(({image, ...record}) => texts.set(record.id, record));
    let imageSaved = true, textSaved = true;
    try { await saveLocalSources(sourceStorage(), [...sources.values()]); } catch { imageSaved = false; }
    try { saveLocalTexts(localStorage, [...texts.values()]); } catch { textSaved = false; }
    state.localSources = sources;
    if (imageSaved) state.sourceLoadFailed = false;
    state.localTexts = texts;
    render();
    showToast(`${records.length}문항의 본문과 이미지를 불러왔습니다.${imageSaved && textSaved ? ' 이 브라우저에 보관합니다.' : ' 저장하지 못한 원문은 현재 탭에서만 표시합니다.'}`);
  } catch (error) { showToast(`원문을 불러오지 못했습니다. ${error.message}`); }
}
async function clearLocalSource(id) {
  try { await ensureSourceSnapshot(); }
  catch { showToast('원문을 지우지 못했습니다. 저장된 원문을 읽을 수 없습니다.'); return; }
  const sources = new Map(state.localSources), texts = new Map(state.localTexts);
  sources.delete(id);texts.delete(id);
  try { saveLocalTexts(localStorage, [...texts.values()]); }
  catch { showToast('원문을 지우지 못했습니다. 브라우저 저장 공간 접근을 확인해 주세요.'); return; }
  try { await saveLocalSources(sourceStorage(), [...sources.values()]); }
  catch {
    try { saveLocalTexts(localStorage, [...state.localTexts.values()]); } catch { /* The unchanged source database also retains the original body. */ }
    showToast('원문을 지우지 못했습니다. 브라우저 저장 공간 접근을 확인해 주세요.'); return;
  }
  state.localSources = sources;state.localTexts = texts;
  render();showToast('이 문항의 본문과 이미지를 브라우저에서 지웠습니다.');
}

function clearLocalText(id) {
  const remaining = new Map(state.localTexts);
  remaining.delete(id);
  try { saveLocalTexts(localStorage, [...remaining.values()]); }
  catch { showToast('본문을 지우지 못했습니다. 브라우저 저장 공간 접근을 확인해 주세요.'); return; }
  state.localTexts = remaining;
  render();
  showToast('이 문항의 본문을 브라우저에서 지웠습니다.');
}
function reviewWorkspace(question) {
  const review = state.reviews[question.id] || {};
  return `<section class="review-workspace" aria-labelledby="review-title"><div class="review-workspace-heading"><h2 id="review-title">나의 검수 기록</h2><span id="save-hint" class="save-hint">이 브라우저에 자동 저장</span></div><div class="review-workspace-controls" role="group" aria-label="검수 상태">${[{ value: '', label: '미검수' }, { value: 'check', label: '재검토' }, { value: 'done', label: '검수 완료' }].map(item => `<button type="button" class="status-choice${(review.status || '') === item.value ? ' is-active' : ''}" data-review-status="${item.value}" aria-pressed="${(review.status || '') === item.value}">${item.label}</button>`).join('')}</div><label class="sr-only" for="review-note">${esc(question.id)}번 검수 메모</label><textarea id="review-note" data-note-for="${esc(question.id)}" placeholder="원문, 분류, 해설에서 확인할 내용을 적어 두세요.">${esc(review.note || '')}</textarea></section>`;
}
function questionNav(question, prev, next) {
  return `<nav class="question-bottom-nav" aria-label="인접 문항">${prev ? `<a class="question-nav-card" href="${esc(buildRoute({ ...state.route, view: 'question', id: prev.id }))}">${icon('left')}<div><small>이전 문항 · ${esc(prev.id)}</small><strong>${esc(prev.title)}</strong></div></a>` : ''}${next ? `<a class="question-nav-card next" href="${esc(buildRoute({ ...state.route, view: 'question', id: next.id }))}"><div><small>다음 문항 · ${esc(next.id)}</small><strong>${esc(next.title)}</strong></div>${icon('right')}</a>` : ''}</nav>`;
}
function renderQuestion() {
  const question = state.questions.get(state.route.id);
  if (!question) {
    document.title = '문항을 찾을 수 없습니다 · LEET Atlas';
    main.innerHTML = '<div class="error-state"><h1>문항을 찾을 수 없습니다.</h1><p>문항 목록에서 회차와 번호를 확인해 주세요.</p><a class="button" href="#/questions">문항 목록으로</a></div>';
    return;
  }
  document.title = `${question.id} ${question.title} · LEET Atlas`;
  const sorted = state.route.sort === 'accuracy' || state.searchMode === 'recommend' && state.query.trim() ? filteredQuestions() : filterQuestions(state.data.questions, { sort: state.route.sort });
  const index = sorted.findIndex(item => item.id === question.id);
  const prev = sorted[index - 1];
  const next = sorted[index + 1];
  const unreviewed = question.answerStatus === 'not-reviewed';
  const questionLength = String(question.text || question.rawText || '').replace(/\s/g, '').length;
  const questionLayout = questionLength <= 950 ? 'short' : questionLength <= 1350 ? 'medium' : 'long';
  const listHref = buildRoute(state.returnRoute || { ...state.route, view: state.route.bookmark && state.route.bookmark !== 'all' ? 'bookmarks' : 'list', id: null });
  main.innerHTML = `<div class="question-breadcrumb"><a class="breadcrumb-link" href="${esc(listHref)}">${icon('left')} ${state.returnRoute?.view === 'analysis' ? '연도별 분석' : '문항 목록'} <span aria-hidden="true">/</span> ${esc(examLabel(question))}</a><nav class="question-pagination" aria-label="문항 이동"><button class="icon-button" type="button" ${prev ? `data-question-nav="${esc(prev.id)}"` : 'disabled'} aria-label="이전 문항" aria-keyshortcuts="ArrowLeft">${icon('left')}</button><span>${index + 1} <span aria-hidden="true">/</span> ${sorted.length}</span><span class="question-keyboard-hint" title="방향키로 문항 이동" aria-hidden="true">← →</span><button class="icon-button" type="button" ${next ? `data-question-nav="${esc(next.id)}"` : 'disabled'} aria-label="다음 문항" aria-keyshortcuts="ArrowRight">${icon('right')}</button></nav></div>
  <div class="question-heading"><div class="question-heading-main"><div class="question-number">${esc(question.id)}</div><div><h1>${esc(question.title || `${question.number}번 문항`)}</h1><div class="question-subtitle">${esc(examLabel(question))} 법학적성시험 · 추리논증 ${esc(question.number)}번</div></div></div><div class="question-heading-actions">${bookmarkButton(question.id)}<button class="button button-quiet" type="button" data-copy-link aria-label="문항 주소 복사">${icon('link')}<span>주소 복사</span></button></div></div>
  ${renderRibbon(question)}<div class="reader-grid reader-grid--${questionLayout}">${readerSource(question)}<div><section class="reader-panel analysis-panel" aria-label="${unreviewed ? '문항 분류 이유' : '문항 해설'}"><div class="panel-heading"><h2>${unreviewed ? '소재와 태그 분류' : '해설과 논증 구조'} <span>${unreviewed ? 'CLASSIFICATION' : 'ANALYSIS'}</span></h2></div><div class="analysis-body">${unreviewed ? classificationSections(question) : explanationSections(question)}</div></section>${reviewWorkspace(question)}</div></div>${questionNav(question, prev, next)}
  ${documentLinks(question)}`;
  void hydrateImages([question]);
}
function loadYearContent(retry = false) {
  if (yearContent) return Promise.resolve();
  if (yearContentPromise) return yearContentPromise;
  if (yearContentError && !retry) return Promise.resolve();
  yearContentError = false;
  yearContentPromise = (async () => {
    try {
      const response = await fetch(`data/year-analysis.json?v=${CACHE_VERSION}`);
      if (!response.ok) throw new Error('Year analysis unavailable');
      const content = await response.json();
      if (content.schemaVersion !== 1 || !Array.isArray(content.profiles) || !Array.isArray(content.sources) || !Array.isArray(content.questionRates) || validateYearContent(content, state.data.questions).length) throw new Error('Invalid year analysis data');
      yearContent = content;
    } catch { yearContentError = true; }
    finally {
      yearContentPromise = null;
      if (state.route.view === 'analysis') renderAnnualPage();
    }
  })();
  return yearContentPromise;
}
function renderAnnualPage() {
  document.title = '연도별 출제 분석 · LEET Atlas';
  if (!yearContent) {
    main.innerHTML = `<div class="page-heading"><div><div class="eyebrow">EXAM YEAR INSIGHTS</div><h1>연도별 출제 분석</h1></div></div>${yearContentError ? '<div class="error-state" role="alert"><p>연도별 분석 자료를 불러오지 못했습니다.</p><button class="button button-sage" type="button" data-retry-year-analysis>다시 불러오기</button></div>' : '<div class="loading-state" role="status">연도별 분석 자료를 불러오고 있습니다.</div>'}`;
    if (!yearContentError) void loadYearContent();
    return;
  }
  if (!yearStatistics) yearStatistics = analyzeArchive(state.data.questions);
  const selectedExam = yearStatistics.byExam.get(state.route.id) || yearStatistics.exams.at(-1);
  if (selectedExam) document.title = `${selectedExam.label} 연도별 출제 분석 · LEET Atlas`;
  main.innerHTML = renderYearAnalysis({ archive: state.data, analysis: yearStatistics, content: yearContent, examKey: state.route.id, comparisonKey: yearComparison });
}
function render() {
  if (!state.data) return;
  imageHydrationVersion++;
  visibleImageQuestions = [];
  hideTooltip();
  const previousRoute = state.route;
  state.route = parseRoute(location.hash);
  keyboardQuestionId = state.route.view === 'question' ? state.route.id : null;
  if (previousRoute.sort !== state.route.sort) state.searchSort = state.route.sort === 'accuracy' ? 'accuracy' : 'date';
  const originalTagId = state.route.id;
  const originalTags = state.route.tags.join('\n');
  if (state.route.view === 'tag') state.route.id = canonicalTagId(state.route.id);
  state.route.tags = [...new Set(state.route.tags.map(canonicalTagId))];
  const redirectedTag = originalTagId !== state.route.id || originalTags !== state.route.tags.join('\n');
  if (!new URLSearchParams(location.hash.split('?')[1] || '').has('mode')) state.route.mode = state.modePreference;
  state.route.tags = state.route.tags.filter(id => state.taxonomy.has(id));
  const combinedYearCollection = state.route.view === 'tag' && state.taxonomy.get(state.route.id)?.axis === 'year' && state.route.tags.some(id => id !== state.route.id && state.taxonomy.get(id)?.axis === 'year');
  if (combinedYearCollection) {
    state.route.tags = [...new Set([state.route.id, ...state.route.tags])];
    state.route.view = 'list';
    state.route.id = null;
  }
  if (redirectedTag || combinedYearCollection || new URLSearchParams(location.hash.split('?')[1] || '').has('tagMode')) history.replaceState(null, '', buildRoute(state.route));
  const returningToCollection = previousRoute.view === 'question' && state.returnRoute?.view === state.route.view && (state.route.view !== 'tag' || state.returnRoute.id === state.route.id);
  if (['bookmarks', 'tag'].includes(state.route.view) && !returningToCollection && (previousRoute.view !== state.route.view || previousRoute.id !== state.route.id)) {
    state.query = '';
    state.review = 'all';
  }
  if (state.route.view === 'question' && ['list', 'bookmarks', 'tag', 'analysis'].includes(previousRoute.view)) state.returnRoute = { ...previousRoute };
  if (state.route.view === 'question') renderQuestion();
  else if (state.route.view === 'analysis') renderAnnualPage();
  else if (state.route.view === 'tags') renderTags();
  else renderList();
  updateNavigation();
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
  } else if (focus?.color) {
    const button = [...document.querySelectorAll('[data-bookmark-filter]')].find(item => item.dataset.bookmarkFilter === focus.color);
    button?.focus({ preventScroll: true });
  } else if (lastView !== null && (lastView !== state.route.view || previousRoute.id !== state.route.id || previousRoute.page !== state.route.page)) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.focus({ preventScroll: true });
  }
  state.hasRendered = true;
  lastView = state.route.view;
}
function refreshBookmarkUI() {
  updateNavigation();
  if (state.route.view === 'bookmarks') {
    const count = document.querySelector('#collection-total');
    if (count) count.textContent = bookmarkCount('any');
  }
  const area = document.querySelector('#color-filter-area');
  if (area) area.innerHTML = colorFilters();
  if (['list', 'bookmarks', 'tag'].includes(state.route.view)) updateListResults();
  else if (state.route.view === 'question') {
    const button = [...document.querySelectorAll('[data-bookmark]')].find(item => item.dataset.bookmark === state.paletteQuestionId);
    if (button) button.outerHTML = bookmarkButton(state.paletteQuestionId);
  }
}
function renderBookmarkPalette() {
  const question = state.questions.get(state.paletteQuestionId);
  if (!question) return;
  const colors = bookmarkColors(state.reviews[question.id]);
  document.querySelector('#bookmark-dialog-title').textContent = `${question.id} · 북마크 색 선택`;
  document.querySelector('#bookmark-palette').innerHTML = BOOKMARK_COLORS.map(color => `<button type="button" class="palette-color${colors.includes(color.id) ? ' is-active' : ''}" data-bookmark-color="${color.id}" aria-pressed="${colors.includes(color.id)}"><span class="palette-swatch" style="--bookmark-color:${esc(color.hex)}" aria-hidden="true"></span><strong>${esc(color.label)}</strong><span class="palette-check" aria-hidden="true">${colors.includes(color.id) ? '✓' : '+'}</span></button>`).join('');
  document.querySelector('#palette-all-link').href = buildRoute({ view: 'bookmarks', mode: state.route.mode || state.modePreference, sort: state.route.sort });
}
function showBookmarkPalette(id) {
  if (!state.questions.has(id)) return;
  state.paletteQuestionId = id;
  renderBookmarkPalette();
  document.querySelector('#bookmark-palette-status').textContent = '색을 선택하면 바로 저장됩니다.';
  bookmarkDialog.showModal();
}
function closeBookmarkPalette() {
  bookmarkDialog.close();
  const button = [...document.querySelectorAll('[data-bookmark]')].find(item => item.dataset.bookmark === state.paletteQuestionId);
  (button || document.querySelector('#question-search') || main).focus({ preventScroll: true });
}
function selectBookmarkColor(color, clear = false) {
  const id = state.paletteQuestionId;
  if (!id) return;
  const old = state.reviews[id] || {};
  const next = clear ? { ...old, bookmarkColors: [], bookmark: false } : toggleBookmarkColor(old, color);
  saveReview(id, next);
  refreshBookmarkUI();
  renderBookmarkPalette();
  const labels = bookmarkColors(state.reviews[id]).map(id => BOOKMARK_COLORS.find(item => item.id === id)?.label).join(', ');
  document.querySelector('#bookmark-palette-status').textContent = state.storageFailed ? '브라우저 저장 실패 · 검수 기록을 내보내 주세요.' : labels ? `${labels} 북마크를 저장했습니다.` : '이 문항의 북마크 색을 모두 해제했습니다.';
  if (!clear) [...document.querySelectorAll('[data-bookmark-color]')].find(button => button.dataset.bookmarkColor === color)?.focus({ preventScroll: true });
}
function resetListPage() {
  state.route.page = 1;
  history.replaceState(null, '', buildRoute(state.route));
}
function changeListMode(mode) {
  state.modePreference = mode === 'scroll' ? 'scroll' : 'paged';
  try { localStorage.setItem(VIEW_KEY, state.modePreference); } catch { /* URL still records the selected view. */ }
  navigate(listRoute({ mode: state.modePreference, page: 1 }), { main: true });
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
  if (!question || question.sourceAccess === 'local-only' && !state.localSources.has(id)) return;
  dialogQuestionId = id;
  document.querySelector('#image-dialog-title').textContent = `${question.id} · ${question.title} · 원본 확대`;
  if (!imageDialog.open) imageDialog.showModal();
  updateImageDialog(question);
  if (usesImageBundle(question) && ['idle', 'pending'].includes(imageBundles.get(question).status)) {
    void imageBundles.load(question).catch(() => {}).then(() => updateImageDialog(question));
  }
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
  const payload = { schemaVersion: 2, app: 'LEET Atlas', examKeys: state.data.exams?.map(exam => exam.key) || [...new Set(state.data.questions.map(question => question.examKey || String(question.year)))], exportedAt: new Date().toISOString(), reviews: state.reviews };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `leet-atlas-review-${new Date().toISOString().slice(0, 10)}.json`;
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
imageDialog.addEventListener('close', () => { dialogQuestionId = null; });
document.querySelector('#close-bookmarks').addEventListener('click', closeBookmarkPalette);
bookmarkDialog.addEventListener('click', event => { if (event.target === bookmarkDialog) closeBookmarkPalette(); });
bookmarkDialog.addEventListener('cancel', event => { event.preventDefault(); closeBookmarkPalette(); });
document.querySelector('#palette-all-link').addEventListener('click', () => bookmarkDialog.close());
imageDialog.addEventListener('click', event => { if (event.target === imageDialog) imageDialog.close(); });
window.addEventListener('hashchange', render);
window.addEventListener('resize', hideTooltip);
document.addEventListener('scroll', hideTooltip, { passive: true, capture: true });
window.addEventListener('storage', event => {
  if (event.key === STORAGE_KEY) { loadReviews(); render(); }
});
document.addEventListener('click', event => {
  if (event.target.closest('.skip-link')) {
    event.preventDefault();
    main.focus();
    return;
  }
  const button = event.target.closest('button');
  if (!button) return;
  if (button.hasAttribute('data-retry-year-analysis')) { void loadYearContent(true); renderAnnualPage(); }
  else if (button.hasAttribute('data-filter-tag')) toggleTag(button.dataset.filterTag);
  else if (button.hasAttribute('data-remove-tag')) toggleTag(button.dataset.removeTag);
  else if (button.hasAttribute('data-reset')) resetFilters();
  else if (button.hasAttribute('data-toggle-filters')) {
    state.filtersOpen = !state.filtersOpen;
    document.querySelector('.filter-panel')?.classList.toggle('is-open', state.filtersOpen);
    button.setAttribute('aria-expanded', String(state.filtersOpen));
  } else if (button.hasAttribute('data-question-nav')) navigate({ ...state.route, view: 'question', id: button.dataset.questionNav });
  else if (button.hasAttribute('data-bookmark')) showBookmarkPalette(button.dataset.bookmark);
  else if (button.hasAttribute('data-bookmark-color')) selectBookmarkColor(button.dataset.bookmarkColor);
  else if (button.hasAttribute('data-clear-bookmarks')) selectBookmarkColor(null, true);
  else if (button.hasAttribute('data-bookmark-filter')) navigate(listRoute({ bookmark: button.dataset.bookmarkFilter, page: 1 }), { color: button.dataset.bookmarkFilter });
  else if (button.hasAttribute('data-list-page')) navigate(listRoute({ page: Number(button.dataset.listPage) }), { main: true });
  else if (button.hasAttribute('data-list-mode')) changeListMode(button.dataset.listMode);
  else if (button.hasAttribute('data-tag-axis')) {
    state.tagAxis = button.dataset.tagAxis;
    document.querySelectorAll('[data-tag-axis]').forEach(item => {
      const active = item.dataset.tagAxis === state.tagAxis;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    renderTagCatalogResults();
  } else if (button.hasAttribute('data-search-example')) { state.query = '인문 논리학 소재의, 2명이 서로 싸우는 문항'; state.searchMode = 'recommend'; state.searchSort = 'relevance'; scheduleSemanticSearch(); resetListPage(); render(); }
  else if (button.hasAttribute('data-import-local-text')) document.querySelector('#local-text-file')?.click();
  else if (button.hasAttribute('data-clear-local-source')) void clearLocalSource(button.dataset.clearLocalSource);
  else if (button.hasAttribute('data-clear-local-text')) clearLocalText(button.dataset.clearLocalText);
  else if (button.hasAttribute('data-source-mode')) changeSourceMode(button.dataset.sourceMode);
  else if (button.hasAttribute('data-text-size')) changeTextSize(Number(button.dataset.textSize));
  else if (button.hasAttribute('data-enlarge')) showImage(button.dataset.enlarge);
  else if (button.hasAttribute('data-retry-image')) void retryImage(button.dataset.retryImage);
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
document.addEventListener('toggle', event => {
  const key = event.target.dataset?.filterDisclosure;
  if (!key) return;
  if (event.target.open) state.filterOpen.add(key); else state.filterOpen.delete(key);
}, true);
document.addEventListener('input', event => {
  if (event.target.hasAttribute('data-taxonomy-search')) {
    const axis = event.target.dataset.taxonomySearch;
    const term = event.target.value.normalize('NFKC').trim().toLocaleLowerCase('ko');
    let visible = 0;
    document.querySelectorAll(`[data-tag-choices="${axis}"] [data-filter-tag]`).forEach(button => {
      const match = (button.dataset.tagSearch || button.textContent).normalize('NFKC').toLocaleLowerCase('ko').includes(term);
      button.hidden = !match;
      if (match) visible++;
    });
    document.querySelectorAll(`[data-tag-choices="${axis}"] [data-related-group]`).forEach(group => { group.hidden = ![...group.querySelectorAll('[data-filter-tag]')].some(button => !button.hidden); if (term && !group.hidden && group.matches('details')) group.open = true; });
    document.querySelector(`[data-tag-empty="${axis}"]`).hidden = visible > 0;
    hideTooltip();
  } else if (event.target.id === 'question-search') { state.query = event.target.value; state.searchSort = 'relevance'; scheduleSemanticSearch(); resetListPage(); updateListResults(); }
  else if (event.target.id === 'tag-catalog-search') { state.tagQuery = event.target.value; renderTagCatalogResults(); }
  else if (event.target.hasAttribute('data-note-for')) {
    const saved = saveReview(event.target.dataset.noteFor, { note: event.target.value });
    const hint = document.querySelector('#save-hint');
    if (hint) hint.textContent = saved ? '저장됨 · 이 브라우저에 보관' : '저장 실패 · 기록을 내보내 주세요';
  }
});
document.addEventListener('change', event => {
  if (event.target.id === 'analysis-year') { if (yearComparison === event.target.value) yearComparison = 'all'; navigate({ view: 'analysis', id: event.target.value }, { main: true }); }
  if (event.target.id === 'analysis-compare') { yearComparison = event.target.value; renderAnnualPage(); document.querySelector('#analysis-compare')?.focus(); }
  if (event.target.id === 'local-text-file') { const file = event.target.files?.[0]; if (file) void importSourceOrTextFile(file); event.target.value = ''; }
  if (event.target.id === 'search-mode') { state.searchMode = event.target.value === 'keyword' ? 'keyword' : 'recommend'; state.searchSort = 'relevance'; scheduleSemanticSearch(); resetListPage(); render(); }
  if (event.target.id === 'question-sort') {
    state.searchSort = event.target.value === 'relevance' ? 'relevance' : event.target.value === 'accuracy' ? 'accuracy' : 'date';
    if (state.searchSort === 'relevance') { resetListPage(); updateListResults(); }
    else navigate(listRoute({ sort: ['oldest','newest','accuracy'].includes(event.target.value) ? event.target.value : 'newest', page: 1 }), { main: true });
  }
  if (event.target.id === 'review-filter') { state.review = event.target.value; resetListPage(); updateListResults(); }
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
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') hideTooltip();
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing) return;
  if (event.target.closest?.('input, textarea, select, [contenteditable], [role="textbox"]') || document.querySelector('dialog[open]')) return;
  if (moveQuestionByArrow(event.key === 'ArrowLeft' ? -1 : 1)) event.preventDefault();
});
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
  const response = await fetch(`data/archive.json?v=${CACHE_VERSION}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  state.data = await response.json();
  if (!Array.isArray(state.data.questions) || !Array.isArray(state.data.taxonomy)) throw new Error('문항 데이터 형식이 올바르지 않습니다.');
  document.querySelector('#archive-edition').textContent = `${archiveScope()} · 전체 아카이브`;
  document.querySelector('#archive-count').textContent = state.data.questions.length;
  state.data.taxonomy.forEach(tag => state.taxonomy.set(tag.id, tag));
  const catalog = Array.isArray(state.data.fieldCatalog) ? state.data.fieldCatalog : [];
  catalog.forEach(entry => {
    const label = entry.label || entry.name;
    const present = [...state.taxonomy.values()].find(tag => tag.axis === 'field' && tag.label === label);
    if (!present && entry.id && label) state.taxonomy.set(entry.id, { ...entry, axis: 'field', label });
  });
  state.data.questions.forEach(question => (question.tags || []).forEach(id => state.tagCounts.set(id, (state.tagCounts.get(id) || 0) + 1)));
  state.data.questions.forEach(question => state.questions.set(String(question.id), question));
  try { state.localTexts = loadLocalTexts(localStorage, state.data.questions); }
  catch { state.localTexts = new Map(); }
  try { state.localSources = await loadLocalSources(sourceStorage(), state.data.questions, {strict:true}); }
  catch { state.localSources = new Map(); state.sourceLoadFailed = Boolean(sourceStorage()); }
  state.localSources.forEach(({image, ...record}) => state.localTexts.set(record.id, record));
  AXES.forEach(axis => groupTags([...state.taxonomy.values()], { axis: axis.id }).forEach(group => group.tags.forEach(tag => state.neighborhoods.set(tag.id, group.label))));
  if (!location.hash) history.replaceState(null, '', buildRoute({ view: 'list' }));
  render();
  if (state.sourceLoadFailed) showToast('저장된 원문을 읽지 못했습니다. 원문 파일을 다시 선택하면 복구할 수 있습니다.');
} catch (error) {
  main.innerHTML = `<div class="error-state"><h1>문항 데이터를 불러오지 못했습니다.</h1><p>잠시 후 새로고침해 주세요. 파일을 직접 열었다면 배포된 웹 주소에서 접속해 주세요.</p><p><code>${esc(error.message)}</code></p><button class="button" type="button" id="reload-data">다시 불러오기</button></div>`;
  document.querySelector('#reload-data').addEventListener('click', () => location.reload());
}

