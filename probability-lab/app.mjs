import { ballConditionAxes } from './data/ball-condition-axes.mjs?v=20261026-balls';
import { createBallEditor } from './ball-editor.mjs?v=20261026-balls';
import { specs } from './engines.mjs?v=20261026-balls';
import { renderExamQuestion } from './exam-paper.mjs?v=20261026-exam';
import { sanitizeStructure, isSimpleMain, synchronizeStructure, createStructuredEditor, validateStructureLimits } from './structured-editor.mjs?v=20261026-limits';

const $ = (id) => document.getElementById(id);
const engineList = Array.isArray(specs) ? specs : Object.values(specs ?? {});
const engines = new Map(engineList.map((spec) => [spec.id, spec]));
const familyDefaults = [
  ['integer-sum', '정수해와 분배', 'SUM'], ['arrangement', '순열과 배열', 'ORDER'],
  ['selection', '여러 색 공 뽑기', 'CHOOSE'], ['distribution', '색 공의 상자 분배', 'BOX'], ['function', '함수의 개수', 'MAP'],
  ['coefficient', '이항정리와 계수', 'EXPAND'], ['probability-count', '경우의 수와 확률', 'COUNT'],
  ['conditional', '조건부확률', 'GIVEN'], ['event-algebra', '사건과 독립', 'EVENT'],
  ['binomial', '이항분포', 'REPEAT'], ['discrete', '이산확률변수', 'EXPECT'],
  ['continuous', '연속확률변수', 'DENSITY'], ['normal', '정규분포', 'NORMAL'],
  ['estimation', '통계적 추정', 'ESTIMATE'],
];
const defaultFamilyMap = new Map(familyDefaults.map(([id, title, code]) => [id, { id, title, code }]));
const state = {
  family: engines.has('integer-sum') ? 'integer-sum' : engineList[0]?.id ?? 'integer-sum',
  view: 'lab', params: {}, result: null, answerVisible: true,
  catalog: null, catalogError: false, mapFamily: 'all', source: 'recent', year: 'all', search: '', page: 1,
  adjustTab: 'basic', basicPage: 1, mobilePane: 'adjust', questionTab: 'problem', solutionTab: 'explanation',
};
const PAGE_SIZE = 12;
const BASIC_PAGE_SIZE = 4;
const METHOD_LABELS = new Map([
  ['stars-bars', '하한·홀짝 치환과 중복조합'], ['gap-substitution', '차이 변수로 치환'],
  ['inclusion-exclusion', '포함배제'], ['prime-exponents', '소인수의 지수 분배'],
  ['contradiction', '조건의 모순 확인'], ['unbounded', '무한히 많은 해의 판정'],
  ['core-cases', '핵심 변수를 분류한 뒤 조합 계산'], ['complement', '여사건으로 계산'],
  ['factor-pairs', '약수쌍 분류'], ['symmetry', '대칭과 차이로 분류'],
]);
let controls = new Map();
let calculationTimer;
let dragCalculationTimer;
let toastTimer;
let searchTimer;
let structuredEditor;
let ballEditor;
const coloredFamily = id => ['selection','distribution'].includes(id);
const blockedDraftKeys = new Set();

function node(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content !== undefined && content !== null) element.textContent = String(content);
  return element;
}

function replace(target, children = []) {
  target.replaceChildren(...children.filter(Boolean));
}

function list(values, className = 'condition-list') {
  const result = node('ul', className);
  for (const value of values ?? []) result.append(node('li', '', value));
  return result;
}

function familyInfo(id = state.family) {
  if (coloredFamily(id)) return { ...(state.catalog?.families?.find(f=>f.id===id)??{}), ...defaultFamilyMap.get(id), ...(ballConditionAxes[id]?.observedConditions?{observedConditions:ballConditionAxes[id].observedConditions}:{}) };
  return state.catalog?.families?.find((family) => family.id === id)
    ?? defaultFamilyMap.get(id)
    ?? { id, title: engines.get(id)?.title ?? id, code: 'TYPE' };
}

function allFamilies() {
  const families = new Map(familyDefaults.map(([id]) => [id, familyInfo(id)]));
  for (const spec of engineList) if (!families.has(spec.id)) families.set(spec.id, familyInfo(spec.id));
  for (const family of state.catalog?.families ?? []) families.set(family.id, family);
  return [...families.values()];
}

function familyItems(id = state.family) {
  return (state.catalog?.items ?? []).filter((item) => item.family === id || ballConditionAxes[id]?.sourceIds.includes(item.id));
}

function cloneDefaults(spec) {
  const params = { ...(spec?.defaults ?? {}) };
  if (spec?.id === 'integer-sum') params.structure = sanitizeStructure(spec.defaults?.structure, params);
  if (coloredFamily(spec?.id)) params.ballRules = JSON.parse(JSON.stringify(spec.defaults.ballRules));
  return params;
}

function safeParams(spec, given = {}) {
  if (given === null || typeof given !== 'object' || Array.isArray(given)) given = {};
  const params = cloneDefaults(spec);
  for (const control of spec?.inputControls ?? spec?.controls ?? []) {
    if (!Object.hasOwn(given, control.key)) continue;
    const value = given[control.key];
    if (control.type === 'number' && typeof value === 'number' && Number.isFinite(value)) params[control.key] = value;
    if (control.type === 'checkbox' && typeof value === 'boolean') params[control.key] = value;
    if (control.type === 'select' && (control.options ?? []).some((option) => option.value === value)) params[control.key] = value;
  }
  if (coloredFamily(spec?.id) && Object.hasOwn(given,'ballRules')) params.ballRules = given.ballRules;
  if (spec?.id === 'integer-sum') {
    const limitError = validateStructureLimits(given.structure);
    params.structure = sanitizeStructure(given.structure, params);
    if (limitError) showToast(`${limitError} 구조 조건을 기본값으로 복구했습니다.`);
  }
  return params;
}

function showToast(message) {
  clearTimeout(toastTimer);
  $('toast').textContent = message;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => { $('toast').hidden = true; }, 3500);
}

function renderFamilies() {
  const buttons = allFamilies().map((family, index) => {
    const button = node('button', 'family-button');
    button.type = 'button';
    button.dataset.family = family.id;
    button.setAttribute('aria-current', family.id === state.family ? 'true' : 'false');
    const text = node('span', 'family-name-block');
    text.append(node('span', 'family-code', String(index + 1).padStart(2, '0')),
      node('span', 'family-title', family.title));
    button.append(text);
    if (state.catalog) {
      const count = familyItems(family.id).filter((item) => item.source === 'recent').length;
      const countNode = node('span', 'family-count', count);
      countNode.title = '최근 기출의 주 유형 분류 문항 수';
      button.append(countNode);
    }
    button.addEventListener('click', () => selectFamily(family.id));
    return button;
  });
  replace($('family-list'), buttons);
  $('family-count').textContent = String(buttons.length);
  for (const id of ['family-select', 'compare-family-select']) {
    const select = $(id);
    replace(select, allFamilies().map((family) => new Option(family.title, family.id)));
    select.value = state.family;
  }
}

function selectFamily(id, params, keepMapFilter = false) {
  if (!allFamilies().some((family) => family.id === id)) return;
  clearTimeout(calculationTimer);
  state.family = id;
  state.adjustTab = 'basic'; state.basicPage = 1;
  state.params = safeParams(engines.get(id), params);
  if (state.view === 'map' && !keepMapFilter) { state.mapFamily = id; state.page = 1; }
  renderFamilies();
  renderControls();
  calculate();
  renderRelated();
  renderComparison();
  if (state.view === 'map') {
    $('filter-family').value = state.mapFamily;
    renderCatalog();
  }
}

function getSpecControls(spec, params) {
  return typeof spec?.getControls === 'function' ? spec.getControls(params) : spec?.controls ?? [];
}

function allowedFor(spec, key, params) {
  const values = typeof spec?.allowedValues === 'function' ? spec.allowedValues(key, params) : null;
  return Array.isArray(values) ? values.filter((value) => typeof value === 'number' && Number.isFinite(value)) : null;
}

function roundBound(value) { return Number(Number(value).toFixed(8)); }
function formatBound(value) { return Number.isFinite(Number(value)) ? String(roundBound(Number(value))) : String(value ?? ''); }

function numberError(control, value, text, allowed) {
  const tolerance = control.normalBound ? 1e-7 : 1e-9;
  if (text.trim() === '' || !Number.isFinite(value)) return `${control.label}에 수를 입력해 주세요.`;
  if (Math.abs(value) > 999 + tolerance) return `${control.label}: 수치와 계산 결과는 999 이하인 조건만 사용할 수 있습니다.`;
  if (control.min !== undefined && value < Number(control.min) - tolerance) return `${control.label}: 현재 허용 범위 ${formatBound(control.min)}~${formatBound(control.max)} 안에서 입력해 주세요.`;
  if (control.max !== undefined && value > Number(control.max) + tolerance) return `${control.label}: 현재 허용 범위 ${formatBound(control.min)}~${formatBound(control.max)} 안에서 입력해 주세요.`;
  if (allowed && !allowed.some((candidate) => Math.abs(candidate - value) <= tolerance)) return `${control.label}: 경우의 수·분자·분모가 999 이하인 허용값을 선택해 주세요.`;
  if (control.step !== 'any' && control.type === 'number') {
    const step = Number(control.step ?? 1);
    const units = (value - Number(control.min ?? 0)) / step;
    if (!Number.isFinite(units) || Math.abs(units - Math.round(units)) > 1e-7) return `${control.label}: ${step} 단위의 수를 입력해 주세요.`;
  }
  return '';
}

function refreshControlEntries(params, writeValues = false, changedKey) {
  const spec = engines.get(state.family);
  for (const metadata of getSpecControls(spec, params)) {
    const control = { ...metadata };
    const entry = controls.get(control.key);
    if (!entry) continue;
    const previousControl = entry.control;
    entry.allowed = control.type === 'number' && !control.normalBound ? allowedFor(spec, control.key, params) : null;
    if (entry.allowed?.length) { control.min = Math.min(...entry.allowed); control.max = Math.max(...entry.allowed); }
    entry.control = control;
    const { input, slider, minLabel, maxLabel, boundNotice } = entry;
    slider.setAttribute('data-allowed-values', entry.allowed ? JSON.stringify(entry.allowed) : '');
    slider.dataset.valueMode = control.normalBound ? 'zscore' : entry.allowed ? 'allowed' : 'value';
    if (control.type === 'select') {
      const actual = writeValues ? params[control.key] : previousControl.options?.[Number(input.value)]?.value;
      replace(input, (control.options ?? []).map((option, index) => { const item = new Option(option.label, String(index)); item.selected = option.value === actual; return item; }));
      slider.min = '0'; slider.max = String(Math.max(0, (control.options?.length ?? 1) - 1)); slider.step = '1';
      slider.value = input.value; slider.setAttribute('aria-valuetext', control.options?.[Number(input.value)]?.label ?? '');
    } else if (control.type === 'checkbox') {
      if (writeValues) input.checked = Boolean(params[control.key]);
      slider.min = '0'; slider.max = '1'; slider.step = '1'; slider.value = input.checked ? '1' : '0';
      minLabel.textContent = '미적용'; maxLabel.textContent = '적용'; slider.setAttribute('aria-valuetext', input.checked ? '적용' : '미적용');
    } else {
      input.min = String(control.min ?? -999); input.max = String(control.max ?? 999); input.step = String(control.step ?? 1);
      input.inputMode = control.step === 'any' || !Number.isInteger(Number(control.step ?? 1)) ? 'decimal' : 'numeric';
      if (writeValues && (changedKey !== control.key || Number(input.value) !== params[control.key])) input.value = String(params[control.key] ?? '');
      const value = Number(input.value);
      minLabel.textContent = formatBound(control.min); maxLabel.textContent = formatBound(control.max);
      boundNotice.hidden = !control.normalBound;
      if (control.normalBound && control.zscore) {
        const z = control.zscore;
        slider.min = String(z.min ?? -3); slider.max = String(z.max ?? 3); slider.step = String(z.step ?? 0.1);
        if (!numberError(control, value, input.value, null)) slider.value = String(Math.max(-3, Math.min(3, (value - z.mu) / z.se)));
        slider.setAttribute('aria-valuetext', `${formatBound(value)} (z=${formatBound((value - z.mu) / z.se)})`);
        boundNotice.textContent = `${Number(params.n) > 1 ? '표본평균: μ ± 3σ/√n' : 'μ ± 3σ'} · ${formatBound(control.min)}~${formatBound(control.max)}`;
      } else if (entry.allowed) {
        slider.min = '0'; slider.max = String(Math.max(0, entry.allowed.length - 1)); slider.step = '1';
        const index = entry.allowed.findIndex((candidate) => Math.abs(candidate - value) < 1e-9);
        if (index >= 0) slider.value = String(index);
        slider.setAttribute('aria-valuetext', `${input.value} · 999 이하 조건의 허용값`);
        if (entry.allowed.length === 0) { boundNotice.hidden = false; boundNotice.textContent = '다른 조건을 줄이면 계산 가능한 값이 나타납니다.'; }
      } else {
        slider.min = String(control.min ?? -999); slider.max = String(control.max ?? 999); slider.step = String(control.step ?? 1);
        if (!numberError(control, value, input.value, null)) slider.value = input.value;
        slider.setAttribute('aria-valuetext', input.value);
      }
    }
    const span = Number(slider.max) - Number(slider.min);
    slider.style.setProperty('--range-progress', `${span ? Math.max(0, Math.min(100, (Number(slider.value) - Number(slider.min)) / span * 100)) : 0}%`);
  }
}

function readControlDrafts(loose = false) {
  const params = coloredFamily(state.family) ? { ...cloneDefaults(engines.get(state.family)), ...state.params } : cloneDefaults(engines.get(state.family));
  let error = '';
  for (const { control, input, allowed } of controls.values()) {
    let value; let message = '';
    if (control.type === 'checkbox') value = input.checked;
    else if (control.type === 'select') {
      const option = control.options?.[Number(input.value)];
      if (option) value = option.value; else message = `${control.label}의 값을 선택해 주세요.`;
    } else {
      value = Number(input.value);
      message = loose
        ? input.value.trim() === '' || !Number.isFinite(value) ? `${control.label}에 수를 입력해 주세요.` : Math.abs(value) > 999 ? `${control.label}: 수치는 999 이하로 입력해 주세요.` : ''
        : numberError(control, value, input.value, allowed);
    }
    if (input.disabled && message) { value = state.params[control.key] ?? params[control.key]; message = ''; }
    input.setAttribute('aria-invalid', String(Boolean(message)));
    if (message && !error) error = message;
    params[control.key] = value;
  }
  return { params, error };
}

function editControl(changedKey, mode) {
  const spec = engines.get(state.family);
  const editedEntry = controls.get(changedKey);
  if (editedEntry?.control.type === 'number') {
    const message = numberError(editedEntry.control, Number(editedEntry.input.value), editedEntry.input.value, editedEntry.allowed);
    if (message) { blockedDraftKeys.add(changedKey); calculate(); return; }
  }
  blockedDraftKeys.delete(changedKey);
  const draft = readControlDrafts(true);
  if (draft.error) { calculate(); return; }
  if (structuredEditor) {
    const edited = structuredEditor.read(draft.params);
    if (edited.error) { calculate(); return; }
    draft.params.structure = edited.structure;
  }
  if (ballEditor) draft.params.ballRules = ballEditor.read();
  const normalized = typeof spec.normalizeParams === 'function' ? spec.normalizeParams(draft.params, changedKey) : draft.params;
  for (const key of blockedDraftKeys) if (key !== changedKey) normalized[key] = draft.params[key];
  const corrected = [...controls.keys()].filter((key) => key !== changedKey && normalized[key] !== draft.params[key]);
  state.params = normalized;
  if (ballEditor) ballEditor.updateParams(normalized);
  if (coloredFamily(state.family) && ['colorKinds','boxes'].includes(changedKey)) { renderControls(); calculate(); return; }
  refreshControlEntries(normalized, true, changedKey);
  if (corrected.length) showToast(`허용 범위에 맞춰 조정했습니다: ${corrected.map((key) => `${controls.get(key).control.label} ${formatBound(normalized[key])}`).join(', ')}`);
  if (mode === 'immediate') calculate();
  else if (mode === 'drag') {
    document.querySelector('.problem-panel').setAttribute('aria-busy', 'true');
    if (!dragCalculationTimer) dragCalculationTimer = setTimeout(calculate, 45);
  } else scheduleCalculation();
}

function renderControls() {
  const family = familyInfo();
  const spec = engines.get(state.family);
  structuredEditor = undefined; ballEditor = undefined;
  blockedDraftKeys.clear();
  $('lab-title').textContent = family.title;
  $('lab-description').textContent = spec?.description ?? family.description ?? '기출에 쓰인 조건과 풀이 구조를 살펴보세요.';
  $('result-category').textContent = spec?.category ?? '기출 구조';
  controls = new Map();
  $('controls').replaceChildren();
  $('preset-row').replaceChildren();
  $('form-error').hidden = true;
  for (const preset of spec?.presets ?? []) {
    try { if (spec.solve(safeParams(spec, preset.params)).status !== 'ok') continue; } catch { continue; }
    const button = node('button', 'preset-button', preset.name);
    button.type = 'button';
    button.addEventListener('click', () => {
      state.params = safeParams(spec, preset.params);
      renderControls(); calculate();
    });
    $('preset-row').append(button);
  }
  for (const control of getSpecControls(spec, state.params)) {
    const field = node('div', `control-field${control.type === 'checkbox' ? ' checkbox-field' : ''}${control.normalBound ? ' normal-bound-field' : ''}`);
    field.dataset.control = control.key;
    const id = `control-${control.key}`;
    const label = node('label', 'control-label', control.label); label.htmlFor = `slider-${control.key}`;
    const input = node(control.type === 'select' ? 'select' : 'input', control.type === 'checkbox' ? 'control-checkbox' : 'control-input');
    if (control.type !== 'select') input.type = control.type === 'checkbox' ? 'checkbox' : 'number';
    input.id = id; input.name = control.key; input.autocomplete = 'off';
    input.setAttribute('aria-label', `${control.label} ${control.type === 'number' ? '직접 입력' : '선택'}`);
    if (control.type === 'number') { input.required = true; input.className += ' control-value-input'; }
    const slider = node('input', 'control-range'); slider.type = 'range'; slider.id = `slider-${control.key}`;
    slider.setAttribute('aria-label', `${control.label} 드래그로 조절`);
    const meta = node('div', `drag-meta drag-meta-${control.type}`);
    const minLabel = node('span', 'range-bound'); const maxLabel = node('span', 'range-bound');
    if (control.type === 'number' || control.type === 'checkbox') meta.append(minLabel, input, maxLabel);
    else meta.append(input);
    field.append(label, slider, meta);
    const boundNotice = node('p', 'dynamic-bound-notice'); boundNotice.id = `${id}-range`; boundNotice.hidden = true;
    field.append(boundNotice);
    if (control.help) {
      const help = node('p', 'control-hint', control.help); help.id = `${id}-help`;
      input.setAttribute('aria-describedby', help.id); slider.setAttribute('aria-describedby', help.id);
      const details = node('details', 'control-help-details'); details.append(node('summary', '', '설명'), help); field.append(details);
    }
    controls.set(control.key, { control, input, slider, field, minLabel, maxLabel, boundNotice, allowed: null });
    input.addEventListener(control.type === 'number' ? 'input' : 'change', () => editControl(control.key, 'typed'));
    slider.addEventListener('input', () => {
      const entry = controls.get(control.key);
      const current = entry.control;
      if (current.type === 'checkbox') input.checked = Number(slider.value) === 1;
      else if (current.type === 'select') input.value = slider.value;
      else if (current.normalBound && current.zscore) input.value = String(roundBound(current.zscore.mu + Number(slider.value) * current.zscore.se));
      else if (entry.allowed) input.value = String(entry.allowed[Math.round(Number(slider.value))] ?? input.value);
      else input.value = slider.value;
      editControl(control.key, 'drag');
    });
    slider.addEventListener('change', () => editControl(control.key, 'immediate'));
    $('controls').append(field);
  }
  refreshControlEntries(state.params, true);
  const available = Boolean(spec);
  $('reset-button').disabled = !available;
  $('random-button').disabled = !available;
  $('link-button').disabled = !available;
  $('copy-button').disabled = !available;
  $('answer-button').disabled = !available;
  if (!available) $('controls').append(node('p', 'empty-state', '이 유형은 기출 분류를 제공합니다. 연결된 기출과 조건 비교를 확인해 주세요.'));
  const usesStructure = state.family === 'integer-sum';
  $('structure-panel').hidden = true;
  $('structure-editor-jump').hidden = true;
  $('structure-shared-host').hidden = !usesStructure;
  for (const id of ['structure-shared-host', 'adjust-expression-host', 'adjust-variables-host', 'adjust-conditions-host', 'adjust-examples-host']) $(id).replaceChildren();
  $('structure-editor').replaceChildren();
  if (usesStructure) {
    state.params.structure = sanitizeStructure(state.params.structure, state.params);
    structuredEditor = createStructuredEditor($('structure-editor'), state.params, (change) => {
      if (change?.presetParams) {
        const candidate = safeParams(spec, change.presetParams);
        if (spec.solve(candidate).status !== 'ok') { showToast('이 예제는 999 이하 계산 조건을 만족하지 않습니다. 조건을 줄여 주세요.'); return; }
        state.params = safeParams(spec, change.presetParams);
        renderControls(); calculate();
      } else if (change?.immediate) calculate();
      else if (change?.drag) {
        const { error } = readAndValidate();
        if (error) calculate();
        else {
          document.querySelector('.problem-panel').setAttribute('aria-busy', 'true');
          if (!dragCalculationTimer) dragCalculationTimer = setTimeout(calculate, 45);
        }
      } else scheduleCalculation();
    });
    const panels = structuredEditor.panels();
    $('structure-shared-host').append(panels.shared);
    for (const name of ['expression', 'variables', 'conditions', 'examples']) $(`adjust-${name}-host`).append(panels[name]);
  }
  if (coloredFamily(state.family)) {
    ballEditor = createBallEditor(state.params, state.family === 'distribution', (change) => {
      if(change?.drag) { if(!dragCalculationTimer) dragCalculationTimer=setTimeout(calculate,45); }
      else scheduleCalculation();
    }, [...controls.values()]);
    for(const name of ['expression','variables','conditions']) $(`adjust-${name}-host`).append(ballEditor.panels[name]);
  }
  for (const name of ['expression', 'variables', 'conditions']) $(`adjust-tab-${name}`).disabled = !usesStructure && !coloredFamily(state.family);
  if (!usesStructure && !coloredFamily(state.family) && !['basic', 'examples'].includes(state.adjustTab)) state.adjustTab = 'basic';
  renderBasicPage(); setAdjustTab(state.adjustTab);
}

function renderBasicPage() {
  const fields = [...controls.values()].filter(entry => !entry.control.group);
  const pages = Math.max(1, Math.ceil(fields.length / BASIC_PAGE_SIZE));
  state.basicPage = Math.max(1, Math.min(pages, state.basicPage));
  fields.forEach(({ field }, index) => {
    const page = Math.floor(index / BASIC_PAGE_SIZE) + 1;
    field.dataset.basicPage = String(page);
    field.hidden = page !== state.basicPage;
  });
  $('basic-prev').disabled = state.basicPage === 1;
  $('basic-next').disabled = state.basicPage === pages;
  $('basic-page-status').textContent = `${state.basicPage} / ${pages}`;
  $('basic-page-status').setAttribute('aria-label', `기본 조건 ${pages}페이지 중 ${state.basicPage}페이지`);
}

function setAdjustTab(name, focus = false) {
  const names = ['basic', 'expression', 'variables', 'conditions', 'examples'];
  if (!names.includes(name) || $(`adjust-tab-${name}`).disabled) return;
  state.adjustTab = name;
  for (const tab of names) {
    $(`adjust-panel-${tab}`).hidden = name !== tab;
    $(`adjust-tab-${tab}`).setAttribute('aria-selected', String(name === tab));
    $(`adjust-tab-${tab}`).tabIndex = name === tab ? 0 : -1;
  }
  if (focus) $(`adjust-tab-${name}`).focus();
}

function setPane(name, focus = false) {
  if (!['adjust', 'problem', 'solution'].includes(name)) return;
  state.mobilePane = name; $('view-lab').dataset.mobilePane = name;
  for (const pane of ['adjust', 'problem', 'solution']) {
    $(`${pane}-pane`).dataset.active = String(name === pane);
    $(`pane-tab-${pane}`).setAttribute('aria-selected', String(name === pane));
    $(`pane-tab-${pane}`).tabIndex = name === pane ? 0 : -1;
  }
  if (focus) $(`pane-tab-${name}`).focus();
}

function setQuestionTab(name, focus = false) {
  if (!['problem', 'sources'].includes(name)) return;
  state.questionTab = name;
  for (const tab of ['problem', 'sources']) {
    $(`question-panel-${tab}`).hidden = name !== tab;
    $(`question-tab-${tab}`).setAttribute('aria-selected', String(name === tab));
    $(`question-tab-${tab}`).tabIndex = name === tab ? 0 : -1;
  }
  if (focus) $(`question-tab-${name}`).focus();
}

function setSolutionTab(name, focus = false) {
  if (!['explanation', 'cases', 'distribution'].includes(name)) return;
  state.solutionTab = name;
  for (const tab of ['explanation', 'cases', 'distribution']) {
    $(`solution-pane-${tab}`).hidden = name !== tab;
    $(`solution-tab-${tab}`).setAttribute('aria-selected', String(name === tab));
    $(`solution-tab-${tab}`).tabIndex = name === tab ? 0 : -1;
  }
  if (focus) $(`solution-tab-${name}`).focus();
}

function readAndValidate() {
  if (state.family === 'integer-sum' && structuredEditor) updateStructuredScalarAvailability(structuredEditor.mode());
  const draft = readControlDrafts(coloredFamily(state.family));
  if (draft.error) return draft;
  if (state.family === 'integer-sum' && structuredEditor) {
    const edited = structuredEditor.read(draft.params);
    updateStructuredScalarAvailability(edited);
    if (edited.error) return { params: draft.params, error: edited.error };
    draft.params.structure = edited.structure;
  }
  if (ballEditor) { ballEditor.updateParams(draft.params); draft.params.ballRules = ballEditor.read(); }
  refreshControlEntries(draft.params, false);
  const checked = readControlDrafts();
  return { params: draft.params, error: checked.error };
}

function updateStructuredScalarAvailability(edited) {
  const ignored = edited.enabled && !edited.autoMain;
  for (const key of ['total', 'relation']) {
    const field = controls.get(key);
    if (!field) continue;
    field.input.disabled = ignored; field.slider.disabled = ignored;
    field.field.dataset.ignored = String(ignored);
    let note = $(`structure-scalar-note-${key}`);
    if (!note) {
      note = node('p', 'structure-scalar-note', '직접 편집 중 · 식 탭에서 조절하세요.');
      note.id = `structure-scalar-note-${key}`; field.field.append(note);
      const description = [field.input.getAttribute('aria-describedby'), note.id].filter(Boolean).join(' ');
      field.input.setAttribute('aria-describedby', description); field.slider.setAttribute('aria-describedby', description);
    }
    note.hidden = !ignored;
  }
}

function scheduleCalculation() {
  clearTimeout(calculationTimer);
  const { error } = readAndValidate();
  if (error) { calculate(); return; }
  document.querySelector('.problem-panel').setAttribute('aria-busy', 'true');
  calculationTimer = setTimeout(calculate, 80);
}

function calculate() {
  clearTimeout(calculationTimer);
  clearTimeout(dragCalculationTimer);
  dragCalculationTimer = undefined;
  const panel = document.querySelector('.problem-panel');
  panel.setAttribute('aria-busy', 'false');
  const spec = engines.get(state.family);
  if (!spec) {
    state.result = { status: 'invalid', question: '이 유형의 기출 분류와 조건 비교를 살펴보세요.', answer: '대표 구조 실험 준비 중', steps: [], insight: familyInfo().insight ?? '' };
    renderResult(); return;
  }
  const { params, error } = readAndValidate();
  $('form-error').hidden = !error;
  $('form-error').textContent = error;
  if (error) {
    state.result = { status: 'invalid', question: '조건 설정을 확인해 주세요.', answer: '입력 확인 필요', steps: [], insight: error };
    renderResult(); return;
  }
  state.params = params;
  try {
    state.result = spec.solve({ ...params });
    if (!state.result || typeof state.result !== 'object') throw new Error('empty result');
  } catch (error) {
    console.error('문항 계산 오류', state.family, error);
    state.result = { status: 'invalid', question: '이 조건의 계산을 완료하지 못했습니다.', answer: '조건을 바꿔 주세요', steps: [], insight: '초기화하거나 대표 조건을 선택해 다시 시도해 주세요.' };
  }
  renderResult();
}

function renderResult() {
  const result = state.result;
  const status = result.status ?? 'ok';
  $('result-status').textContent = status === 'ok' ? '계산 완료' : status === 'infinite' ? '무한히 많음' : '조건 확인';
  $('result-status').dataset.status = status;
  renderExamQuestion($('problem-text'), result.question ?? '문항을 생성할 조건을 선택해 주세요.', { valid: status === 'ok' });
  $('exam-paper').dataset.status = status;
  renderNormalTable(result.normalTable);
  $('answer-value').textContent = result.answer ?? result.exact ?? '—';
  $('answer-unit').textContent = result.unit ?? '';
  $('copy-button').disabled = status !== 'ok';
  $('insight-text').textContent = result.insight ?? '';
  $('insight-box').hidden = !result.insight;
  const steps = (result.steps ?? []).map((step, index) => {
    const row = node('div', 'step');
    const content = node('div', 'step-content');
    content.append(node('h5', 'step-title', step.title ?? `단계 ${index + 1}`));
    if (step.body) content.append(node('p', 'step-body', step.body));
    if (step.formula) content.append(node('div', 'formula', step.formula));
    row.append(node('span', 'step-number', String(index + 1).padStart(2, '0')), content, document.createTextNode('\n'));
    return row;
  });
  replace($('steps-list'), steps);
  document.querySelector('.solution-section').hidden = !steps.length;
  const method = typeof result.solutionMethod === 'string' ? result.solutionMethod : '';
  $('solution-method').hidden = !method;
  $('solution-method').textContent = method ? `풀이 방법 · ${METHOD_LABELS.get(method) ?? method}` : '';
  const warnings = result.warnings ?? [];
  $('result-warnings').hidden = !warnings.length;
  replace($('result-warnings'), warnings.map((warning) => node('p', 'result-warning', warning)));
  renderCases(result.cases);
  renderChart(result.chart);
  const samples = (result.samples ?? []).slice(0, 16);
  $('result-samples').hidden = !samples.length;
  replace($('result-samples'), samples.length ? [node('h4', 'subsection-title', '작은 예로 확인'), list(samples, 'sample-list')] : []);
  $('cases-empty').hidden = Boolean(result.cases?.length);
  $('distribution-empty').hidden = Boolean(result.chart?.length || samples.length);
  updateAnswerVisibility();
}

function renderNormalTable(data) {
  const target = $('normal-table-container');
  target.hidden = !data || !Array.isArray(data.rows) || !data.rows.length;
  target.replaceChildren();
  if (target.hidden) return;
  const heading = node('div', 'normal-table-heading');
  heading.append(node('h4', '', data.title ?? '표준정규분포표'), node('p', 'normal-table-definition', data.definition ?? 'P(0≤Z≤z)'));
  target.append(heading);
  if (data.source) {
    const source = [data.source.exam, data.source.question !== undefined ? `${data.source.question}번` : '', data.source.pdfPage !== undefined ? `PDF ${data.source.pdfPage}쪽` : ''].filter(Boolean).join(' · ');
    target.append(node('p', 'normal-table-source', `기출 원본 표 · ${source}`));
  }
  function table(rows, captionText, extra = false) {
    const result = node('table', `normal-table${extra ? ' normal-table-extra' : ''}`);
    const caption = node('caption', 'sr-only', captionText);
    const head = node('thead'); const headRow = node('tr');
    for (const label of ['z', data.definition ?? 'P(0≤Z≤z)', ...(extra ? ['구분'] : [])]) {
      const cell = node('th', '', label); cell.scope = 'col'; headRow.append(cell);
    }
    head.append(headRow); const body = node('tbody');
    for (const entry of rows.slice(0, 40)) {
      const row = node('tr');
      row.append(node('td', '', entry.z), node('td', '', entry.probability));
      if (extra) row.append(node('td', '', entry.label ?? '현재 문항 추가 근삿값'));
      body.append(row);
    }
    result.append(caption, head, body); const wrap = node('div', 'normal-table-scroll'); wrap.append(result); return wrap;
  }
  target.append(table(data.rows, '기출에 제시된 표준정규분포표'));
  if (Array.isArray(data.additionalRows) && data.additionalRows.length) {
    const additional = node('section', 'normal-table-additional');
    additional.append(node('h5', '', '현재 문항에 필요한 추가 근삿값'), node('p', '', '아래 값은 위 기출 원본 표에 덧붙인 계산값입니다.'), table(data.additionalRows, '현재 문항의 추가 근삿값', true));
    target.append(additional);
  }
  if (Array.isArray(data.notes) && data.notes.length) target.append(list(data.notes, 'normal-table-notes'));
}

function renderCases(cases = []) {
  $('result-cases').hidden = !cases.length;
  if (!cases.length) { $('result-cases').replaceChildren(); return; }
  const table = node('table', 'case-table');
  const caption = node('caption', 'subsection-title', '경우를 나누어 확인');
  const head = node('thead');
  const row = node('tr');
  for (const label of ['경우', '값 / 경우의 수', '설명']) {
    const th = node('th', '', label); th.scope = 'col'; row.append(th);
  }
  head.append(row);
  const body = node('tbody');
  for (const item of cases.slice(0, 80)) {
    const tr = node('tr');
    tr.append(node('td', '', item.label), document.createTextNode(' '), node('td', 'case-count', item.count), document.createTextNode(' '), node('td', '', item.detail ?? ''), document.createTextNode('\n'));
    body.append(tr);
  }
  table.append(caption, head, body);
  const scroll = node('div', 'table-scroll'); scroll.append(table);
  replace($('result-cases'), [scroll]);
  if (cases.length > 80) $('result-cases').append(node('p', 'control-hint', '표에는 처음 80개 경우를 표시합니다.'));
}

function renderChart(values = []) {
  const data = values.filter((entry) => Number.isFinite(entry.value));
  $('result-chart').hidden = !data.length;
  if (!data.length) { $('result-chart').replaceChildren(); return; }
  const max = Math.max(...data.map((entry) => Math.abs(entry.value)), 0.0000001);
  const chart = node('div', 'chart');
  chart.setAttribute('aria-label', '값의 크기 비교');
  for (const entry of data.slice(0, 40)) {
    const row = node('div', 'chart-row');
    const track = node('div', 'chart-track');
    const bar = node('div', 'chart-bar');
    bar.style.width = `${Math.max(0, Math.min(100, Math.abs(entry.value) / max * 100))}%`;
    track.setAttribute('aria-hidden', 'true'); track.append(bar);
    const value = Number.isInteger(entry.value) ? entry.value.toLocaleString('ko-KR') : entry.value.toLocaleString('ko-KR', { maximumFractionDigits: 5 });
    row.append(node('span', 'chart-label', entry.label), document.createTextNode(' '), track, node('span', 'chart-value', value), document.createTextNode('\n')); chart.append(row);
  }
  replace($('result-chart'), [node('h4', 'subsection-title', '분포와 경우의 수 살펴보기'), chart]);
}

function updateAnswerVisibility() {
  $('solution-content').hidden = !state.answerVisible;
  $('answer-hidden').hidden = state.answerVisible;
  $('answer-button').textContent = state.answerVisible ? '정답·해설 숨기기' : '정답·해설 보기';
  $('answer-button').setAttribute('aria-expanded', String(state.answerVisible));
}

function randomValue(control, defaults, allowed = null) {
  if (control.type === 'checkbox') return Math.random() < 0.5;
  if (control.type === 'select') return control.options?.[Math.floor(Math.random() * control.options.length)]?.value;
  if (control.normalBound && control.zscore) return roundBound(control.zscore.mu + (Math.floor(Math.random() * 61) / 10 - 3) * control.zscore.se);
  if (allowed?.length) return allowed[Math.floor(Math.random() * allowed.length)];
  const step = control.step === 'any' ? 0.01 : Number(control.step ?? 1);
  const defaultValue = Number(defaults[control.key] ?? control.min ?? 1);
  const min = Number(control.min ?? Math.max(0, defaultValue - 3));
  const max = Number(control.max ?? defaultValue + 5);
  // Stay near the authored default instead of sampling potentially expensive extreme bounds.
  const radius = Math.max(step * 3, Math.abs(defaultValue) * 0.4);
  const low = Math.max(min, defaultValue - radius);
  const high = Math.min(max, defaultValue + radius);
  const first = Math.ceil((low - min) / step);
  const last = Math.floor((high - min) / step);
  const index = first + Math.floor(Math.random() * Math.max(1, last - first + 1));
  return Number((min + index * step).toPrecision(12));
}

function randomize() {
  const spec = engines.get(state.family);
  if (!spec) return;
  const live = readAndValidate();
  const current = safeParams(spec, live.error ? state.params : live.params);
  const structured = spec.id === 'integer-sum';
  const simpleMain = structured && isSimpleMain(current.structure, current);
  let selected;
  for (let attempt = 0; attempt < 15; attempt++) {
    let params = cloneDefaults(spec);
    for (const key of (spec.controls ?? []).map((control) => control.key)) {
      const control = getSpecControls(spec, params).find((item) => item.key === key);
      if (!control) continue;
      params[key] = randomValue(control, spec.defaults, control.type === 'number' ? allowedFor(spec, key, params) : null);
      if (typeof spec.normalizeParams === 'function') params = spec.normalizeParams(params, key);
    }
    if (structured) {
      if (current.structure.conditions.length || !simpleMain) params.k = current.k;
      if (!simpleMain) { params.total = current.total; params.relation = current.relation; }
      params.structure = synchronizeStructure(current.structure, params, simpleMain);
    }
    try {
      const result = spec.solve(params);
      const isZero = result.numeric === 0 || /^(?:0|0\s*개|0\s*가지|0\s*명)$/.test(String(result.exact ?? result.answer ?? '').trim());
      if (result.status === 'ok' && !isZero) { selected = params; break; }
    } catch { /* Retry bounded samples; the fallback is an authored preset. */ }
  }
  if (!selected) selected = structured && spec.solve(current).status === 'ok' ? current : safeParams(spec, spec.presets?.[0]?.params ?? spec.defaults);
  state.params = selected;
  renderControls(); calculate();
  showToast('새 조건을 적용했습니다. 달라진 풀이를 비교해 보세요.');
}

function setView(view, focus = false) {
  if (!['lab', 'map', 'compare'].includes(view)) return;
  state.view = view;
  for (const name of ['lab', 'map', 'compare']) {
    $(`view-${name}`).hidden = view !== name;
    $(`tab-${name}`).setAttribute('aria-selected', String(view === name));
    $(`tab-${name}`).tabIndex = view === name ? 0 : -1;
  }
  if (view === 'map') renderCatalog();
  if (view === 'compare') renderComparison();
  if (focus) $(`tab-${view}`).focus();
}

function academicYear(item) { return item.academicYear ?? item.year ?? ''; }
function session(item) { return item.session ?? item.sitting ?? ''; }
function examShort(item) { return `${academicYear(item)}학년도 ${session(item) || '기출'} · ${item.question}번`; }
function sourceBadge(item) { return node('span', `badge ${item.source === 'recent' ? 'badge-recent' : 'badge-legacy'}`, item.source === 'recent' ? '최근 확통' : '구 나형 참고'); }

function sourceCard(item, expanded = false) {
  const article = node('article', expanded ? 'catalog-card' : 'source-card');
  const meta = node('div', 'source-meta');
  meta.append(sourceBadge(item), node('span', '', `${item.pdfPage ?? item.page ?? '—'}쪽`));
  const title = node('h4', expanded ? 'catalog-card-title' : 'source-title', examShort(item));
  title.title = item.exam ?? '';
  article.append(meta, title, node('p', 'source-summary', item.summary));
  if (expanded) {
    const badges = node('div', 'source-badges');
    badges.append(node('span', 'badge', familyInfo(item.family).title));
    for (const tag of (item.tags ?? []).slice(0, 3)) badges.append(node('span', 'badge badge-muted', defaultFamilyMap.get(tag)?.title ?? tag));
    article.append(badges);
  }
  const details = node('details', 'source-detail');
  const summary = node('summary', '', '기출 조건과 풀이 구조');
  details.append(summary, node('p', 'detail-label observed-label', '실제 기출 조건'), list(item.conditions ?? []));
  if (item.insight) details.append(node('p', 'detail-label', '풀이 구조'), node('p', 'source-insight', item.insight));
  if (item.parameters?.length) details.append(node('p', 'detail-label proposed-label', '추가 변형 축 제안'), list(item.parameters));
  if (engines.has(item.family)) {
    const button = node('button', 'button button-ghost source-link', '이 유형의 대표 구조 실험 →');
    button.type = 'button';
    button.addEventListener('click', () => { selectFamily(item.family, undefined, true); setView('lab'); setPane('problem'); setQuestionTab('problem'); });
    details.append(button, node('p', 'control-hint', '이 기출의 수치·조건을 그대로 복원한 프리셋은 아닙니다.'));
  }
  article.append(details);
  return article;
}

function recentFirst(items) {
  return [...items].sort((a, b) => {
    const sourceOrder = (a.source === 'recent' ? 0 : 1) - (b.source === 'recent' ? 0 : 1);
    return sourceOrder || Number(academicYear(b)) - Number(academicYear(a)) || String(b.id).localeCompare(String(a.id));
  });
}

function renderRelated() {
  const items = recentFirst(familyItems());
  const message = state.catalogError ? '기출 목록을 불러오지 못했습니다. 문항 실험은 계속 사용할 수 있습니다.' : state.catalog ? '이 유형으로 분류된 기출이 없습니다.' : '관련 기출을 불러오고 있습니다.';
  replace($('related-sources'), items.length ? items.slice(0, 4).map((item) => sourceCard(item)) : [node('p', 'empty-state', message)]);
  replace($('compare-sources'), items.length ? items.slice(0, 4).map((item) => sourceCard(item)) : [node('p', 'empty-state', message)]);
  $('all-sources-button').textContent = `유형 지도에서 모두 보기${items.length ? ` (${items.length})` : ''} →`;
}

function renderComparison() {
  const family = familyInfo();
  $('compare-title').textContent = `${family.title} · 조건 비교`;
  if (!state.catalog) {
    replace($('compare-content'), [node('div', 'panel empty-state', state.catalogError ? '기출 분류 자료를 불러오지 못했습니다. 잠시 후 페이지를 새로고침해 주세요.' : '기출 조건을 불러오고 있습니다.')]);
    return;
  }
  const grid = node('div', 'compare-grid');
  const observed = node('section', 'panel compare-panel observed-panel');
  observed.append(node('p', 'comparison-label observed-label', 'OBSERVED · 실제 출제'), node('h3', 'comparison-title', '기출에서 확인한 조건'), list(family.observedConditions ?? [], 'comparison-list'));
  const proposed = node('section', 'panel compare-panel proposed-panel');
  proposed.append(node('p', 'comparison-label proposed-label', 'PROPOSED · 추가 제안'), node('h3', 'comparison-title', '더 실험해 볼 변형 축'), list(family.proposedConditions ?? [], 'comparison-list'));
  grid.append(observed, proposed);
  const comparison = node('section', 'panel comparison-insight');
  comparison.append(node('h3', 'comparison-title', '조건이 바뀌면 달라지는 점'));
  if (family.differences?.length) comparison.append(list(family.differences, 'difference-list'));
  else comparison.append(node('p', '', '조건의 위치·강도·결합 방식을 바꿔 가능한 경우와 풀이 전략이 어떻게 달라지는지 비교하세요.'));
  if (family.insight) comparison.append(node('div', 'insight-box', family.insight));
  const capabilities = ballConditionAxes[state.family];
  const support = capabilities ? node('section','panel comparison-insight') : null;
  if(support) { support.append(node('h3','comparison-title','지금 생성기에서 조합 가능한 조건'),list(capabilities.supported,'comparison-list'),node('h4','comparison-title','추가 확장 대상'),list(capabilities.future,'comparison-list')); }
  replace($('compare-content'), [support, grid, comparison]);
}

function populateFilters() {
  const familySelect = $('filter-family');
  replace(familySelect, [new Option('모든 유형', 'all'), ...allFamilies().map((family) => new Option(family.title, family.id))]);
  familySelect.value = state.mapFamily;
  populateYears();
}

function populateYears() {
  const items = (state.catalog?.items ?? []).filter((item) => state.source === 'all' || item.source === state.source);
  const years = [...new Set(items.map(academicYear).filter(Boolean))].sort((a, b) => Number(b) - Number(a));
  replace($('filter-year'), [new Option('모든 학년도', 'all'), ...years.map((year) => new Option(`${year}학년도`, String(year)))]);
  if (!years.some((year) => String(year) === state.year)) state.year = 'all';
  $('filter-year').value = state.year;
}

function filteredCatalog() {
  const query = state.search.trim().toLocaleLowerCase('ko-KR');
  return recentFirst(state.catalog?.items ?? []).filter((item) => {
    if (state.source !== 'all' && item.source !== state.source) return false;
    if (state.mapFamily !== 'all' && item.family !== state.mapFamily && !ballConditionAxes[state.mapFamily]?.sourceIds.includes(item.id)) return false;
    if (state.year !== 'all' && String(academicYear(item)) !== state.year) return false;
    if (!query) return true;
    return [item.id, item.exam, examShort(item), item.summary, familyInfo(item.family).title, ...(item.conditions ?? []), ...(item.parameters ?? []), ...(item.tags ?? [])].join(' ').toLocaleLowerCase('ko-KR').includes(query);
  });
}

function renderCatalog() {
  $('legacy-notice').hidden = state.source === 'recent';
  if (!state.catalog) {
    $('catalog-count').textContent = state.catalogError ? '기출 자료를 불러오지 못했습니다.' : '기출 자료를 불러오는 중입니다.';
    replace($('catalog-list'), [node('div', 'panel empty-state', state.catalogError ? '문항 실험은 계속 사용할 수 있습니다. 기출 목록은 잠시 후 페이지를 새로고침해 확인해 주세요.' : '문항별 조건과 풀이 구조를 준비하고 있습니다.')]);
    $('pagination').replaceChildren(); return;
  }
  const items = filteredCatalog();
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  state.page = Math.min(Math.max(1, state.page), pages);
  const start = (state.page - 1) * PAGE_SIZE;
  const display = items.slice(start, start + PAGE_SIZE);
  const scope = state.source === 'recent' ? '최근 확통' : state.source === 'legacy' ? '구 나형 참고' : '전체 자료';
  $('catalog-count').textContent = `${scope} · ${items.length}문항${items.length ? ` 중 ${start + 1}–${start + display.length}` : ''}`;
  replace($('catalog-list'), display.length ? display.map((item) => sourceCard(item, true)) : [node('div', 'panel empty-state', '이 조건에 맞는 문항이 없습니다. 유형·학년도·검색어를 바꿔 보세요.')]);
  const pagination = [];
  function pageButton(label, page, disabled = false) {
    const button = node('button', 'page-button', label);
    button.type = 'button'; button.disabled = disabled;
    if (page === state.page && typeof label === 'number') button.setAttribute('aria-current', 'page');
    button.addEventListener('click', () => { state.page = page; renderCatalog(); $('catalog-count').scrollIntoView({ block: 'start' }); });
    return button;
  }
  if (pages > 1) {
    pagination.push(pageButton('← 이전', state.page - 1, state.page === 1));
    let begin = Math.max(1, state.page - 2);
    const end = Math.min(pages, begin + 4);
    begin = Math.max(1, end - 4);
    for (let page = begin; page <= end; page++) pagination.push(pageButton(page, page));
    pagination.push(pageButton('다음 →', state.page + 1, state.page === pages));
  }
  replace($('pagination'), pagination);
}

function renderCoverage() {
  const recent = state.catalog?.coverage?.recent;
  if (recent) {
    replace($('stat-exams'), [document.createTextNode(String(recent.exams)), node('span', '', '회')]);
    replace($('stat-items'), [document.createTextNode(String(recent.items)), node('span', '', '문항')]);
    $('map-total-badge').textContent = `${recent.items}문항 전체 분류`;
  }
  replace($('stat-families'), [document.createTextNode(String(engineList.length)), node('span', '', '유형')]);
  const documents = state.catalog?.sourceDocuments ?? [];
  const nodes = [];
  for (const source of documents) {
    const label = source.title ?? source.name ?? source.filename ?? '분류 원자료';
    const url = source.url ?? source.href;
    if (url && /^(https?:\/\/|\.\.?\/)/.test(url)) {
      const link = node('a', '', label); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; nodes.push(link);
    } else nodes.push(node('span', '', label));
  }
  replace($('source-documents'), nodes);
}

async function loadCatalog() {
  try {
    const response = await fetch('./data/catalog.json');
    if (!response.ok) throw new Error(`catalog ${response.status}`);
    const catalog = await response.json();
    if (!Array.isArray(catalog.items) || !Array.isArray(catalog.families)) throw new Error('catalog schema');
    state.catalog = catalog;
    state.catalogError = false;
    $('catalog-notice').hidden = true;
  } catch (error) {
    state.catalogError = true;
    $('catalog-notice').hidden = false;
    $('catalog-notice').textContent = '기출 분류 자료를 불러오지 못했습니다. 대표 구조의 문항·정답·해설 실험은 계속 사용할 수 있습니다.';
    console.warn('기출 분류 자료를 불러오지 못했습니다.', error);
  }
  renderFamilies(); renderCoverage(); populateFilters(); renderRelated(); renderComparison(); renderCatalog();
}

function readHash() {
  if (!location.hash || !location.hash.startsWith('#lab=')) return null;
  try {
    const data = JSON.parse(decodeURIComponent(location.hash.slice(5)));
    if (data && typeof data === 'object' && typeof data.family === 'string') return data;
  } catch { showToast('저장된 조건 링크를 읽지 못했습니다. 기본 조건으로 시작합니다.'); }
  return null;
}

function restoreHash() {
  const data = readHash();
  if (!data) return false;
  if (!engines.has(data.family)) { showToast('이 링크의 유형을 찾지 못했습니다. 기본 유형으로 시작합니다.'); return false; }
  const spec = engines.get(data.family);
  const candidate = safeParams(spec, data.params);
  let valid = false;
  try { valid = spec.solve(candidate).status === 'ok'; } catch { /* Recover unsupported saved conditions to the authored default. */ }
  selectFamily(data.family, valid ? candidate : undefined);
  if (!valid) showToast('이 링크의 조건은 999 이하 계산 범위를 벗어나 기본 조건으로 복구했습니다.');
  setView(data.view ?? 'lab');
  return true;
}

async function copyText(value, successMessage) {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value);
    else {
      const textarea = node('textarea', 'clipboard-fallback'); textarea.value = value;
      textarea.setAttribute('readonly', ''); document.body.append(textarea); textarea.select();
      const copied = document.execCommand('copy'); textarea.remove();
      if (!copied) throw new Error('copy unavailable');
    }
    showToast(successMessage);
  } catch {
    showToast('클립보드에 복사하지 못했습니다. 브라우저의 복사 권한을 확인해 주세요.');
  }
}

function copyLink() {
  const { params, error } = readAndValidate();
  if (error) { showToast('조건의 입력값을 확인한 뒤 링크를 복사해 주세요.'); return; }
  if (engines.get(state.family).solve(params).status !== 'ok') { showToast('999 이하로 계산할 수 있는 조건만 링크로 저장할 수 있습니다.'); return; }
  const hash = `#lab=${encodeURIComponent(JSON.stringify({ family: state.family, params, view: state.view }))}`;
  const url = new URL(location.href); url.hash = hash;
  history.replaceState(null, '', url);
  copyText(url.href, '현재 조건을 담은 링크를 복사했습니다.');
}

function copyResult() {
  const result = state.result;
  if (!result) return;
  const normalTable = result.normalTable;
  const tableText = normalTable ? [
    '', normalTable.title ?? '표준정규분포표', normalTable.definition ?? 'P(0≤Z≤z)',
    ...(normalTable.rows ?? []).map((row) => `${row.z}: ${row.probability}`),
    ...(normalTable.additionalRows?.length ? ['현재 문항의 추가 근삿값', ...normalTable.additionalRows.map((row) => `${row.z}: ${row.probability}`)] : []),
  ] : [];
  const text = [
    `확통 구조 실험실 · ${familyInfo().title}`, '', result.question ?? '', ...tableText, '', `정답: ${result.answer ?? result.exact ?? ''}`,
    ...(typeof result.solutionMethod === 'string' ? [`풀이 방법: ${METHOD_LABELS.get(result.solutionMethod) ?? result.solutionMethod}`] : []),
    ...(result.steps ?? []).flatMap((step, index) => ['', `${index + 1}. ${step.title ?? ''}`, step.body ?? '', step.formula ?? '']),
    '', result.insight ? `핵심: ${result.insight}` : '',
    '', '대표 구조 실험으로 생성한 문항입니다.',
  ].filter((line) => line !== undefined).join('\n');
  copyText(text, '문항·정답·단계별 해설을 복사했습니다.');
}

function openRelatedMap() {
  state.mapFamily = state.family; state.page = 1; state.year = 'all'; state.search = '';
  state.source = familyItems().some((item) => item.source === 'recent') ? 'recent' : 'all';
  $('filter-family').value = state.mapFamily; $('filter-source').value = state.source; $('filter-search').value = '';
  populateYears(); setView('map');
  $('view-map').scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function bindEvents() {
  $('family-select').addEventListener('change', (event) => selectFamily(event.target.value));
  $('compare-family-select').addEventListener('change', (event) => selectFamily(event.target.value, undefined, true));
  $('basic-prev').addEventListener('click', () => { state.basicPage--; renderBasicPage(); });
  $('basic-next').addEventListener('click', () => { state.basicPage++; renderBasicPage(); });
  function bindTabs(selector, dataKey, activate) {
    const buttons = [...document.querySelectorAll(selector)];
    buttons.forEach((button) => {
      button.addEventListener('click', () => activate(button.dataset[dataKey]));
      button.addEventListener('keydown', (event) => {
        const available = buttons.filter((item) => !item.disabled);
        const index = available.indexOf(button);
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % available.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + available.length) % available.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = available.length - 1;
        if (next !== undefined && available[next]) { event.preventDefault(); activate(available[next].dataset[dataKey], true); }
      });
    });
  }
  bindTabs('[data-adjust]', 'adjust', setAdjustTab);
  bindTabs('[data-pane-target]', 'paneTarget', setPane);
  bindTabs('[data-question-tab]', 'questionTab', setQuestionTab);
  bindTabs('[data-solution-tab]', 'solutionTab', setSolutionTab);
  $('controls-form').addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
  $('reset-button').addEventListener('click', () => { state.params = cloneDefaults(engines.get(state.family)); renderControls(); calculate(); showToast('기본 조건으로 돌아왔습니다.'); });
  $('random-button').addEventListener('click', randomize);
  $('link-button').addEventListener('click', copyLink);
  $('copy-button').addEventListener('click', copyResult);
  $('answer-button').addEventListener('click', () => { state.answerVisible = !state.answerVisible; updateAnswerVisibility(); });
  $('all-sources-button').addEventListener('click', openRelatedMap);
  $('compare-sources-button').addEventListener('click', openRelatedMap);
  const tabs = [...document.querySelectorAll('[data-view]')];
  tabs.forEach((button, index) => {
    button.addEventListener('click', () => setView(button.dataset.view));
    button.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); setView(tabs[next].dataset.view, true); }
    });
  });
  $('filter-source').addEventListener('change', (event) => { state.source = event.target.value; state.page = 1; populateYears(); renderCatalog(); });
  $('filter-family').addEventListener('change', (event) => { state.mapFamily = event.target.value; state.page = 1; renderCatalog(); });
  $('filter-year').addEventListener('change', (event) => { state.year = event.target.value; state.page = 1; renderCatalog(); });
  $('filter-search').addEventListener('input', (event) => {
    state.search = event.target.value; state.page = 1; clearTimeout(searchTimer); searchTimer = setTimeout(renderCatalog, 100);
  });
  window.addEventListener('hashchange', restoreHash);
}

bindEvents();
state.params = cloneDefaults(engines.get(state.family));
renderFamilies(); renderCoverage(); populateFilters();
if (!restoreHash()) { renderControls(); calculate(); }
renderRelated(); renderComparison();
loadCatalog();
