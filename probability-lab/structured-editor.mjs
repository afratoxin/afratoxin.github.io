const LETTERS = 'abcdefgh';
const RELATIONS = [['eq', '='], ['ne', '≠'], ['lt', '<'], ['le', '≤'], ['gt', '>'], ['ge', '≥']];
const DOMAINS = [
  ['inherit', '공통 범위 따름'], ['natural', '자연수 (1, 2, 3, …)'], ['nonnegative', '0 이상의 정수'],
  ['integer', '정수 (음수·0 포함)'], ['positive-even', '양의 짝수'], ['positive-odd', '양의 홀수'],
  ['integer-even', '짝수인 정수'], ['integer-odd', '홀수인 정수'],
];
const PARITIES = [['any', '추가 제한 없음'], ['even', '짝수'], ['odd', '홀수']];
const GROUPS = [['distinct', '서로 다른 값'], ['nondecreasing', '표시된 변수 순서로 ≤'], ['increasing', '표시된 변수 순서로 <']];
const MAX_CONDITIONS = 12;
const MAX_EXPRESSION = 160;
const plain = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
  && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const allowed = (options, value) => options.some(([key]) => key === value);
const variableCount = (params) => Number.isInteger(params?.k) ? Math.max(2, Math.min(8, params.k)) : 4;
const blankVariable = () => ({ domain: 'inherit', parity: 'any', lower: null, upper: null });
const boundedInteger = (value) => typeof value === 'number' && Number.isSafeInteger(value) && Math.abs(value) <= 10000;
const normalizeExpression = (value) => value.replace(/[×·]/g, '*').replace(/[−–]/g, '-').replace(/²/g, '^2');

function cleanExpression(value, fallback) {
  if (typeof value !== 'string' || value.length > MAX_EXPRESSION) return fallback;
  const text = normalizeExpression(value);
  return text.trim().length && /^[a-h0-9+*^().\s-]+$/.test(text) ? text : fallback;
}

export function defaultStructure(params = {}) {
  return {
    enabled: true,
    left: LETTERS.slice(0, variableCount(params)).split('').join('+'),
    relation: allowed(RELATIONS, params.relation) ? params.relation : 'eq',
    right: Number.isFinite(params.total) ? String(params.total) : '7',
    variables: Array.from({ length: variableCount(params) }, blankVariable),
    conditions: [],
  };
}

// Copy only explicitly supported fields. Input objects are never merged into state.
export function sanitizeStructure(value, params = {}) {
  const result = defaultStructure(params);
  if (!plain(value)) return result;
  if (typeof value.enabled === 'boolean') result.enabled = value.enabled;
  result.left = cleanExpression(value.left, result.left);
  result.right = cleanExpression(value.right, result.right);
  if (allowed(RELATIONS, value.relation)) result.relation = value.relation;
  if (Array.isArray(value.variables)) result.variables = result.variables.map((fallback, index) => {
    const entry = value.variables[index];
    if (!plain(entry)) return fallback;
    return {
      domain: allowed(DOMAINS, entry.domain) ? entry.domain : 'inherit',
      parity: allowed(PARITIES, entry.parity) ? entry.parity : 'any',
      lower: boundedInteger(entry.lower) ? entry.lower : null,
      upper: boundedInteger(entry.upper) ? entry.upper : null,
    };
  });
  if (Array.isArray(value.conditions)) for (const condition of value.conditions.slice(0, MAX_CONDITIONS)) {
    if (!plain(condition)) continue;
    if (condition.kind === 'expression') {
      const left = cleanExpression(condition.left, null);
      const right = cleanExpression(condition.right, null);
      if (left !== null && right !== null && allowed(RELATIONS, condition.relation)) {
        result.conditions.push({ kind: 'expression', left, relation: condition.relation, right });
      }
    } else if (allowed(GROUPS, condition.kind) && Array.isArray(condition.variables)) {
      const variables = [...new Set(condition.variables.filter((index) => Number.isInteger(index) && index >= 0 && index < result.variables.length))];
      if (variables.length >= 2) result.conditions.push({ kind: condition.kind, variables });
    }
  }
  return result;
}

export function isSimpleMain(structure, params = {}) {
  if (!plain(structure)) return true;
  const simple = defaultStructure(params);
  const compact = (text) => String(text).replace(/\s+/g, '');
  return compact(structure.left) === simple.left && compact(structure.right) === simple.right && structure.relation === simple.relation;
}

export function synchronizeStructure(structure, params, synchronizeMain = false) {
  const result = sanitizeStructure(structure, params);
  if (synchronizeMain) {
    const simple = defaultStructure(params);
    result.left = simple.left; result.relation = simple.relation; result.right = simple.right;
  }
  return result;
}

const relationLabel = (value) => RELATIONS.find(([key]) => key === value)?.[1] ?? '=';
const prettyExpression = (value) => String(value).replace(/\*/g, ' × ').replace(/\^2/g, '²').replace(/\+/g, ' + ').replace(/-/g, ' − ').replace(/\s+/g, ' ').trim();

export function createStructuredEditor(container, initialParams, onChange) {
  let scalarParams = { ...initialParams };
  let structure = sanitizeStructure(initialParams.structure, initialParams);
  let autoMain = isSimpleMain(structure, initialParams);
  let selected = new Set([0, 1].filter((index) => index < structure.variables.length));
  let currentVariable = 0;
  let variableMode = 'single';
  let conditionPage = 0;
  const CONDITION_PAGE_SIZE = 3;
  let focusedExpression;
  const expressionInputs = [];
  const numericInputs = [];
  const $node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = String(text);
    return element;
  };
  const button = (label, className, handler) => {
    const element = $node('button', className, label); element.type = 'button';
    element.addEventListener('click', handler); return element;
  };
  const select = (options, value, label, id, handler) => {
    const element = $node('select', 'control-input structure-select'); element.id = id;
    element.setAttribute('aria-label', label);
    for (const [key, text] of options) {
      const option = $node('option', '', text); option.value = key; option.selected = key === value; element.append(option);
    }
    element.addEventListener('change', () => handler(element.value)); return element;
  };
  const labelled = (labelText, input, className = '') => {
    const field = $node('div', `structure-field ${className}`);
    const label = $node('label', 'structure-field-label', labelText); label.htmlFor = input.id;
    field.append(label, input); return field;
  };
  const error = $node('p', 'control-error structure-error'); error.id = 'structure-error'; error.hidden = true; error.setAttribute('role', 'status');
  const body = $node('div', 'structure-body'); body.id = 'structure-body';
  const preview = $node('details', 'structure-preview'); preview.id = 'structure-preview';
  const mainPreview = $node('p', 'structure-preview-main');
  const commonPreview = $node('p', 'structure-preview-common'); commonPreview.id = 'structure-common-summary';
  const extraPreview = $node('ul', 'structure-preview-conditions');
  const syncNotice = $node('p', 'structure-sync-notice'); syncNotice.id = 'structure-sync-status';
  const variableChips = $node('div', 'variable-chips'); variableChips.id = 'structure-variable-chips';
  const variableCards = $node('div', 'variable-cards'); variableCards.id = 'structure-variable-rows';
  const conditionRows = $node('div', 'structure-condition-rows'); conditionRows.id = 'structure-conditions';
  const selectionSummary = $node('span', 'selection-summary'); selectionSummary.id = 'structure-selection-summary';
  const groupSelectionSummary = $node('p', 'structure-group-selection'); groupSelectionSummary.id = 'structure-group-selection';
  const setError = (message = '') => { error.textContent = message; error.hidden = !message; };
  const notify = (change) => { setError(); renderPreview(); onChange(change); };
  const expressionField = (value, label, id, handler) => {
    const element = $node('input', 'control-input expression-input');
    element.type = 'text'; element.id = id; element.value = value; element.maxLength = MAX_EXPRESSION; element.autocomplete = 'off'; element.spellcheck = false;
    element.setAttribute('aria-label', label); element.setAttribute('aria-describedby', 'structure-expression-help');
    element.addEventListener('focus', () => { focusedExpression = element; });
    element.addEventListener('click', () => { focusedExpression = element; });
    element.addEventListener('input', () => { handler(normalizeExpression(element.value)); notify(); });
    expressionInputs.push(element);
    return element;
  };
  const insert = (text, wrap = false) => {
    const input = focusedExpression ?? mainLeft;
    const start = typeof input.selectionStart === 'number' ? input.selectionStart : input.value.length;
    const end = typeof input.selectionEnd === 'number' ? input.selectionEnd : start;
    const selection = input.value.slice(start, end);
    const inserted = wrap && selection ? (text === '^2' ? `(${selection})^2` : `2*(${selection})`) : text;
    input.value = input.value.slice(0, start) + inserted + input.value.slice(end);
    if (input.setSelectionRange) input.setSelectionRange(start + inserted.length, start + inserted.length);
    input.focus();
    // Dispatch the same edit as typing, without interpreting the expression.
    if (typeof input.dispatchEvent === 'function') input.dispatchEvent(new Event('input', { bubbles: true }));
    else input.dispatch?.('input');
  };
  const sectionTitle = (title, description) => {
    const header = $node('div', 'structure-subheading'); header.append($node('h4', '', title));
    if (description) header.append($node('p', '', description)); return header;
  };
  const mainSection = $node('section', 'structure-section');
  mainSection.id = 'structure-section-expression';
  mainSection.append(sectionTitle('주된 식', '합·곱·차·상수배·제곱을 조합하세요.'));
  const mainRow = $node('div', 'expression-row main-expression-row');
  const mainLeft = expressionField(structure.left, '주된 식의 왼쪽', 'structure-main-left', (value) => { structure.left = value; autoMain = false; });
  const mainRelation = select(RELATIONS, structure.relation, '주된 식의 관계', 'structure-main-relation', (value) => { structure.relation = value; autoMain = false; notify(); });
  const mainRight = expressionField(structure.right, '주된 식의 오른쪽', 'structure-main-right', (value) => { structure.right = value; autoMain = false; });
  mainRow.append(mainLeft, mainRelation, mainRight);
  const rhsControls = $node('div', 'structure-rhs-controls'); rhsControls.id = 'structure-rhs-controls';
  const rhsLabel = $node('label', 'structure-field-label', '오른쪽 기준값 빠른 조절'); rhsLabel.htmlFor = 'structure-main-right-slider';
  const rhsRange = $node('input', 'control-range'); rhsRange.type = 'range'; rhsRange.id = 'structure-main-right-slider'; rhsRange.min = '-40'; rhsRange.max = '80'; rhsRange.step = '1';
  rhsRange.setAttribute('aria-label', '주된 식 오른쪽 기준값 드래그로 조절');
  const rhsNumber = $node('input', 'control-input'); rhsNumber.type = 'number'; rhsNumber.id = 'structure-main-right-value'; rhsNumber.min = '-10000'; rhsNumber.max = '10000'; rhsNumber.step = '1'; rhsNumber.setAttribute('aria-label', '주된 식 오른쪽 기준값 직접 입력');
  const editRhsConstant = (value, change) => { structure.right = value; mainRight.value = value; autoMain = false; notify(change); };
  rhsRange.addEventListener('input', () => editRhsConstant(rhsRange.value, { drag: true }));
  rhsRange.addEventListener('change', () => editRhsConstant(rhsRange.value, { immediate: true }));
  rhsNumber.addEventListener('input', () => editRhsConstant(rhsNumber.value));
  const rhsFields = $node('div', 'structure-rhs-fields'); rhsFields.append(rhsRange, rhsNumber);
  rhsControls.append(rhsLabel, rhsFields);
  const toolbar = $node('div', 'expression-toolbar'); toolbar.id = 'structure-expression-toolbar'; toolbar.setAttribute('aria-label', '식 입력 도우미');
  const variableTools = $node('div', 'expression-variable-tools');
  const operatorTools = $node('div', 'expression-operator-tools');
  for (const [label, text, wrap] of [['+', '+'], ['−', '-'], ['×', '*'], ['상수배 2×', '2*', true], ['제곱 ²', '^2', true], ['(', '('], [')', ')']]) {
    operatorTools.append(button(label, 'expression-tool', () => insert(text, wrap)));
  }
  toolbar.append(variableTools, operatorTools);
  const mainFooter = $node('div', 'structure-main-footer');
  mainFooter.append(syncNotice, button('기본 합식으로', 'button button-secondary compact-button', () => {
    autoMain = true; structure = synchronizeStructure(structure, scalarParams, true); updateMainInputs(); notify();
  }));
  mainFooter.children[1].id = 'structure-reset-main';
  const expressionHelp = $node('p', 'control-hint', '예: a*b, (a-b)^2, a+b+2*c+d^2 · 입력할 칸을 선택한 뒤 버튼을 누르세요. 최대 4차식과 제곱(^2)을 지원합니다. 자연수는 1부터, 정수는 음수와 0도 포함합니다. 식만으로 유한한 범위를 정할 수 없으면 변수별 하한·상한을 추가하세요.');
  expressionHelp.id = 'structure-expression-help';
  const helpDetails = $node('details', 'structure-help-details');
  helpDetails.append($node('summary', '', '식 입력 도움말'), expressionHelp);
  mainSection.append(mainRow, rhsControls, toolbar, mainFooter, helpDetails);

  const variableSection = $node('section', 'structure-section');
  variableSection.id = 'structure-section-variables';
  variableSection.append(sectionTitle('변수별 범위와 홀짝', '한 변수씩 편집하거나 선택한 변수에 함께 적용하세요.'));
  const variableModes = $node('div', 'structure-variable-modes'); variableModes.setAttribute('role', 'tablist'); variableModes.setAttribute('aria-label', '변수 편집 방식');
  const singlePanel = $node('div', 'structure-variable-mode-panel'); singlePanel.id = 'structure-variable-single'; singlePanel.setAttribute('role', 'tabpanel'); singlePanel.setAttribute('aria-labelledby', 'structure-variable-mode-single');
  const bulkPanel = $node('div', 'structure-variable-mode-panel'); bulkPanel.id = 'structure-variable-bulk'; bulkPanel.setAttribute('role', 'tabpanel'); bulkPanel.setAttribute('aria-labelledby', 'structure-variable-mode-bulk');
  const setVariableMode = (mode, focus = false) => {
    variableMode = mode;
    singlePanel.hidden = mode !== 'single'; bulkPanel.hidden = mode !== 'bulk';
    singleMode.setAttribute('aria-selected', String(mode === 'single')); singleMode.tabIndex = mode === 'single' ? 0 : -1;
    bulkMode.setAttribute('aria-selected', String(mode === 'bulk')); bulkMode.tabIndex = mode === 'bulk' ? 0 : -1;
    if (focus) (mode === 'single' ? singleMode : bulkMode).focus();
  };
  const singleMode = button('한 변수', 'structure-mode-button', () => setVariableMode('single')); singleMode.id = 'structure-variable-mode-single'; singleMode.setAttribute('role', 'tab'); singleMode.setAttribute('aria-controls', singlePanel.id);
  const bulkMode = button('일괄 적용', 'structure-mode-button', () => setVariableMode('bulk')); bulkMode.id = 'structure-variable-mode-bulk'; bulkMode.setAttribute('role', 'tab'); bulkMode.setAttribute('aria-controls', bulkPanel.id);
  for (const modeButton of [singleMode, bulkMode]) modeButton.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault(); setVariableMode(event.key === 'Home' ? 'single' : event.key === 'End' ? 'bulk' : variableMode === 'single' ? 'bulk' : 'single', true);
  });
  variableModes.append(singleMode, bulkMode);
  const currentVariableSelect = select([], '0', '편집할 변수', 'structure-variable-current', (value) => { currentVariable = Number(value); renderVariableCards(); });
  singlePanel.append(labelled('편집할 변수', currentVariableSelect), variableCards);
  const selectionBar = $node('div', 'variable-selection-bar');
  const selectionActions = $node('div', 'selection-actions');
  selectionActions.append(button('전체 선택', 'button button-ghost compact-button', () => { selected = new Set(structure.variables.map((_, i) => i)); renderChips(); }), button('선택 해제', 'button button-ghost compact-button', () => { selected.clear(); renderChips(); }));
  selectionActions.children[0].id = 'structure-select-all'; selectionActions.children[1].id = 'structure-select-none';
  selectionBar.append(variableChips, selectionActions);
  const bulk = $node('div', 'structure-bulk');
  const quick = $node('div', 'structure-quick-actions');
  const applySelected = (change) => {
    if (!selected.size) { setError('조건을 적용할 변수를 먼저 선택해 주세요.'); return false; }
    for (const index of selected) change(structure.variables[index]);
    renderVariableCards(); notify(); return true;
  };
  for (const [label, field, value] of [['짝수로', 'parity', 'even'], ['홀수로', 'parity', 'odd'], ['자연수로', 'domain', 'natural'], ['정수로', 'domain', 'integer']]) {
    const quickButton = button(label, 'preset-button', () => applySelected((entry) => { entry[field] = value; }));
    quickButton.dataset.apply = value; quick.append(quickButton);
  }
  const bulkDomain = select([['keep', '범위 유지'], ...DOMAINS], 'keep', '선택 변수에 적용할 범위', 'structure-bulk-domain', () => {});
  const bulkParity = select([['keep', '홀짝 유지'], ...PARITIES], 'keep', '선택 변수에 적용할 홀짝', 'structure-bulk-parity', () => {});
  const bulkLowerMode = select([['keep', '하한 유지'], ['auto', '자동 / 추가 제한 없음'], ['value', '값 설정']], 'keep', '선택 변수 하한 설정 방식', 'structure-bulk-lower-mode', (value) => { bulkLower.hidden = value !== 'value'; });
  const bulkUpperMode = select([['keep', '상한 유지'], ['auto', '자동 / 추가 제한 없음'], ['value', '값 설정']], 'keep', '선택 변수 상한 설정 방식', 'structure-bulk-upper-mode', (value) => { bulkUpper.hidden = value !== 'value'; });
  const simpleNumber = (id, value, label) => {
    const input = $node('input', 'control-input'); input.type = 'number'; input.id = id; input.value = String(value); input.min = '-10000'; input.max = '10000'; input.step = '1'; input.setAttribute('aria-label', label); return input;
  };
  const bulkLower = simpleNumber('structure-bulk-lower', 1, '선택 변수의 하한 값'); bulkLower.hidden = true;
  const bulkUpper = simpleNumber('structure-bulk-upper', 10, '선택 변수의 상한 값'); bulkUpper.hidden = true;
  const bulkFields = $node('div', 'structure-bulk-fields');
  const lowerField = labelled('하한', bulkLowerMode); lowerField.append(bulkLower);
  const upperField = labelled('상한', bulkUpperMode); upperField.append(bulkUpper);
  bulkFields.append(labelled('변수의 범위', bulkDomain), labelled('홀짝', bulkParity), lowerField, upperField);
  const bulkActions = $node('div', 'structure-bulk-actions');
  const apply = button('선택 변수에 적용', 'button button-primary', () => {
    for (const [mode, input, label] of [[bulkLowerMode, bulkLower, '하한'], [bulkUpperMode, bulkUpper, '상한']]) {
      if (mode.value === 'value' && (input.value.trim() === '' || !boundedInteger(Number(input.value)))) { setError(`${label}에 -10000~10000의 정수를 입력해 주세요.`); return; }
    }
    applySelected((entry) => {
      if (bulkDomain.value !== 'keep') entry.domain = bulkDomain.value;
      if (bulkParity.value !== 'keep') entry.parity = bulkParity.value;
      if (bulkLowerMode.value !== 'keep') entry.lower = bulkLowerMode.value === 'auto' ? null : Number(bulkLower.value);
      if (bulkUpperMode.value !== 'keep') entry.upper = bulkUpperMode.value === 'auto' ? null : Number(bulkUpper.value);
    });
  }); apply.id = 'structure-bulk-apply';
  bulkActions.append(selectionSummary, apply);
  bulk.append(quick, bulkFields, bulkActions);
  bulkPanel.append(selectionBar, bulk);
  variableSection.append(variableModes, singlePanel, bulkPanel);
  setVariableMode('single');

  const conditionsSection = $node('section', 'structure-section');
  conditionsSection.id = 'structure-section-conditions';
  conditionsSection.append(sectionTitle('함께 만족할 조건', '식과 일부 변수의 그룹 조건을 추가하세요.'));
  const addActions = $node('div', 'structure-add-actions');
  const addCondition = (condition) => {
    if (structure.conditions.length >= MAX_CONDITIONS) { setError('추가 조건은 최대 12개까지 사용할 수 있습니다.'); return; }
    structure.conditions.push(condition); conditionPage = Math.floor((structure.conditions.length - 1) / CONDITION_PAGE_SIZE); renderConditions(); notify();
  };
  const addExpression = button('+ 식 조건 추가', 'button button-secondary', () => addCondition({ kind: 'expression', left: 'a*b', relation: 'eq', right: '12' }));
  addExpression.id = 'structure-add-expression'; addActions.append(addExpression);
  for (const [kind, label] of GROUPS) {
    const addGroup = button(`+ ${label}`, 'button button-secondary', () => {
      if (selected.size < 2) { setError('그룹 조건에 사용할 변수를 두 개 이상 선택해 주세요.'); return; }
      addCondition({ kind, variables: [...selected].sort((a, b) => a - b) });
    }); addGroup.id = `structure-add-${kind}`; addActions.append(addGroup);
  }
  const conditionPagination = $node('nav', 'structure-condition-pagination'); conditionPagination.setAttribute('aria-label', '추가 조건 페이지');
  const previousConditionPage = button('← 이전', 'button button-ghost compact-button', () => { conditionPage -= 1; focusedExpression = mainLeft; renderConditions(); }); previousConditionPage.id = 'structure-condition-prev';
  const nextConditionPage = button('다음 →', 'button button-ghost compact-button', () => { conditionPage += 1; focusedExpression = mainLeft; renderConditions(); }); nextConditionPage.id = 'structure-condition-next';
  const conditionPageLabel = $node('span', 'structure-condition-page-label'); conditionPageLabel.id = 'structure-condition-page'; conditionPageLabel.setAttribute('aria-live', 'polite');
  conditionPagination.append(previousConditionPage, conditionPageLabel, nextConditionPage);
  conditionsSection.append(addActions, groupSelectionSummary, conditionRows, conditionPagination);

  const previewBody = $node('div', 'structure-preview-body'); previewBody.append(mainPreview, commonPreview, extraPreview);
  preview.append($node('summary', 'structure-preview-label', '현재 식·조건 모아 보기'), previewBody);
  mainSection.append(preview);
  const presets = $node('div', 'structure-presets');
  presets.id = 'structure-section-examples';
  const presetHeader = $node('p', 'structure-field-label', '복합 구조 바로 실험');
  presets.append(presetHeader);
  const presetDefinitions = [
    { name: '곱 + 일부 홀짝·하한', total: 16, left: 'a+b+c+d', conditions: [{ kind: 'expression', left: 'a*b', relation: 'eq', right: '12' }], variables: [{}, {}, { parity: 'odd' }, { lower: 2 }] },
    { name: '차의 제곱', total: 12, left: 'a+b+c+d', conditions: [{ kind: 'expression', left: '(a-b)^2', relation: 'eq', right: '4' }] },
    { name: '상수배 + 제곱', total: 20, left: 'a+b+2*c+d^2', conditions: [] },
    { name: 'a, b만 짝수', total: 12, left: 'a+b+c+d', variables: [{ parity: 'even' }, { parity: 'even' }], conditions: [] },
  ];
  presetDefinitions.forEach((preset, index) => {
    const presetButton = button(preset.name, 'preset-button', () => {
      const params = { ...scalarParams, k: 4, total: preset.total, relation: 'eq', domain: 'natural', lowerOn: false, upperOn: false, order: 'any', distinct: false };
      params.structure = sanitizeStructure({ ...defaultStructure(params), ...preset, right: String(preset.total) }, params);
      onChange({ presetParams: params });
    }); presetButton.id = `structure-preset-${index + 1}`; presets.append(presetButton);
  });
  const wrapPanel = (section, id) => {
    const content = $node('div', 'structure-panel-content'); content.id = id;
    content.append(...Array.from(section.children)); section.append(content); return content;
  };
  const mainContent = wrapPanel(mainSection, 'structure-expression-body');
  const variableContent = wrapPanel(variableSection, 'structure-variables-body');
  const conditionsContent = wrapPanel(conditionsSection, 'structure-conditions-body');
  body.append(presets, mainSection, variableSection, conditionsSection);
  const shared = $node('div', 'structure-shared'); shared.id = 'structure-shared';
  const toggleRow = $node('div', 'structure-enable-row');
  const enable = $node('input', 'control-checkbox'); enable.type = 'checkbox'; enable.id = 'structure-enabled'; enable.checked = structure.enabled;
  const enableLabel = $node('label', '', '식·일부 변수 조건 사용'); enableLabel.htmlFor = enable.id;
  const disabledNote = $node('p', 'control-hint', '현재 기본 합식과 공통 조건만 사용합니다. 식·변수·추가 조건은 보존됩니다.'); disabledNote.id = 'structure-disabled-note';
  enable.setAttribute('aria-controls', 'structure-expression-body structure-variables-body structure-conditions-body');
  const updateEnabledPresentation = () => {
    for (const content of [mainContent, variableContent, conditionsContent]) content.hidden = !structure.enabled;
    disabledNote.hidden = structure.enabled; enable.setAttribute('aria-expanded', String(structure.enabled));
  };
  enable.addEventListener('change', () => { structure.enabled = enable.checked; updateEnabledPresentation(); notify(); });
  toggleRow.append(enable, enableLabel);
  shared.append(toggleRow, disabledNote, error);
  container.replaceChildren(shared, body);
  updateEnabledPresentation();

  function updateMainInputs() {
    mainLeft.value = structure.left; mainRelation.value = structure.relation; mainRight.value = structure.right;
  }

  function renderPreview() {
    mainPreview.textContent = `${prettyExpression(structure.left)} ${relationLabel(structure.relation)} ${prettyExpression(structure.right)}`;
    const common = [DOMAINS.find(([key]) => key === scalarParams.domain)?.[1] ?? '공통 범위'];
    if (scalarParams.lowerOn) common.push(`공통 하한 ${scalarParams.lower}`);
    if (scalarParams.upperOn) common.push(`공통 상한 ${scalarParams.upper}`);
    if (scalarParams.order === 'nondecreasing') common.push('전체 변수 ≤ 순서');
    if (scalarParams.order === 'increasing') common.push('전체 변수 < 순서');
    if (scalarParams.distinct) common.push('전체 변수 서로 다름');
    commonPreview.textContent = `기본 공통 조건: ${common.join(' · ')}. 변수별 범위를 따로 지정하면 해당 변수에는 지정한 범위를 적용합니다.`;
    extraPreview.replaceChildren();
    for (const [index, entry] of structure.variables.entries()) {
      const parts = [];
      if (entry.domain !== 'inherit') parts.push(DOMAINS.find(([key]) => key === entry.domain)?.[1]);
      if (entry.parity !== 'any') parts.push(entry.parity === 'even' ? '짝수' : '홀수');
      if (entry.lower !== null) parts.push(`${entry.lower} 이상`);
      if (entry.upper !== null) parts.push(`${entry.upper} 이하`);
      if (parts.length) extraPreview.append($node('li', '', `${LETTERS[index]}: ${parts.join(', ')}`));
    }
    for (const condition of structure.conditions) {
      const text = condition.kind === 'expression'
        ? `${prettyExpression(condition.left)} ${relationLabel(condition.relation)} ${prettyExpression(condition.right)}`
        : condition.kind === 'distinct'
          ? `${condition.variables.map((index) => LETTERS[index]).join(', ')}는 서로 다른 값`
          : condition.variables.map((index) => LETTERS[index]).join(condition.kind === 'increasing' ? ' < ' : ' ≤ ');
      extraPreview.append($node('li', '', text));
    }
    syncNotice.textContent = autoMain
      ? '기본 합식과 자동 동기화 중'
      : '직접 편집 중 · 기준값은 여기서 조절하세요.';
    syncNotice.dataset.mode = autoMain ? 'auto' : 'custom';
    const integerRight = /^[+-]?\d+$/.test(structure.right.trim()) && boundedInteger(Number(structure.right));
    rhsControls.hidden = !integerRight && structure.right.trim() !== '';
    if (integerRight) {
      const right = Number(structure.right);
      rhsNumber.value = String(right); rhsRange.min = String(Math.min(-40, right)); rhsRange.max = String(Math.max(80, right)); rhsRange.value = String(right);
      rhsRange.setAttribute('aria-valuetext', String(right));
      rhsRange.style.setProperty('--range-progress', `${(right - Number(rhsRange.min)) / (Number(rhsRange.max) - Number(rhsRange.min)) * 100}%`);
    }
  }

  function renderChips() {
    variableChips.replaceChildren(); variableTools.replaceChildren();
    currentVariable = Math.min(currentVariable, structure.variables.length - 1);
    currentVariableSelect.replaceChildren();
    for (let index = 0; index < structure.variables.length; index++) {
      const option = $node('option', '', `${LETTERS[index]} 변수`); option.value = String(index); option.selected = index === currentVariable; currentVariableSelect.append(option);
      const chip = button(LETTERS[index], 'variable-chip', () => {
        if (selected.has(index)) selected.delete(index); else selected.add(index);
        renderChips();
      });
      chip.id = `structure-chip-${LETTERS[index]}`; chip.dataset.variable = String(index); chip.setAttribute('aria-pressed', String(selected.has(index)));
      chip.setAttribute('aria-label', `${LETTERS[index]} 변수 ${selected.has(index) ? '선택됨' : '선택'}`); variableChips.append(chip);
      variableTools.append(button(LETTERS[index], 'expression-tool expression-variable', () => insert(LETTERS[index])));
    }
    selectionSummary.textContent = selected.size ? `적용 대상: ${[...selected].sort((a, b) => a - b).map((index) => LETTERS[index]).join(', ')}` : '적용 대상을 선택하세요';
    groupSelectionSummary.textContent = selected.size ? `그룹 대상: ${[...selected].sort((a, b) => a - b).map((index) => LETTERS[index]).join(', ')} · 변수의 일괄 적용에서 선택` : '그룹 대상은 변수 → 일괄 적용에서 선택하세요.';
  }

  function renderVariableCards() {
    variableCards.replaceChildren(); numericInputs.length = 0;
    structure.variables.forEach((entry, index) => {
      if (index !== currentVariable) return;
      const letter = LETTERS[index];
      const card = $node('section', 'variable-card'); card.dataset.variable = String(index);
      const header = $node('div', 'variable-card-heading'); header.append($node('h5', 'variable-letter', letter));
      const reset = button('이 변수 초기화', 'button button-ghost compact-button', () => { structure.variables[index] = blankVariable(); renderVariableCards(); notify(); }); header.append(reset);
      const fields = $node('div', 'variable-card-fields');
      const domain = select(DOMAINS, entry.domain, `${letter}의 범위`, `structure-var-${letter}-domain`, (value) => { entry.domain = value; notify(); });
      const parity = select(PARITIES, entry.parity, `${letter}의 홀짝`, `structure-var-${letter}-parity`, (value) => { entry.parity = value; notify(); });
      fields.append(labelled('범위', domain), labelled('홀짝', parity));
      for (const [key, label] of [['lower', '하한'], ['upper', '상한']]) {
        const input = simpleNumber(`structure-var-${letter}-${key}`, entry[key] ?? (key === 'lower' ? 1 : 10), `${letter}의 ${label} 값`);
        input.hidden = entry[key] === null;
        const mode = select([['auto', '자동 / 추가 제한 없음'], ['value', '값 설정']], entry[key] === null ? 'auto' : 'value', `${letter}의 ${label} 설정 방식`, `structure-var-${letter}-${key}-mode`, (value) => {
          input.hidden = value === 'auto'; entry[key] = value === 'auto' ? null : Number(input.value); notify();
        });
        const range = $node('input', 'control-range structure-bound-range'); range.type = 'range'; range.id = `structure-var-${letter}-${key}-slider`; range.min = String(Math.min(-30, Number(input.value))); range.max = String(Math.max(40, Number(input.value))); range.step = '1'; range.value = input.value; range.hidden = input.hidden;
        range.setAttribute('aria-label', `${letter}의 ${label} 드래그로 조절`);
        mode.addEventListener('change', () => { range.hidden = mode.value === 'auto'; });
        range.addEventListener('input', () => { input.value = range.value; entry[key] = Number(range.value); notify({ drag: true }); });
        range.addEventListener('change', () => notify({ immediate: true }));
        input.addEventListener('input', () => {
          entry[key] = input.value.trim() === '' ? NaN : Number(input.value);
          if (Number.isFinite(entry[key])) { range.min = String(Math.min(-30, entry[key])); range.max = String(Math.max(40, entry[key])); range.value = String(entry[key]); }
          notify();
        });
        numericInputs.push({ input, mode, label: `${letter}의 ${label}` });
        const field = labelled(label, mode); field.append(range, input); fields.append(field);
      }
      card.append(header, fields); variableCards.append(card);
    });
  }

  function renderConditions() {
    conditionRows.replaceChildren();
    // Remove references to expression inputs whose rows are being rebuilt.
    expressionInputs.splice(2);
    const pages = Math.max(1, Math.ceil(structure.conditions.length / CONDITION_PAGE_SIZE));
    conditionPage = Math.max(0, Math.min(pages - 1, conditionPage));
    previousConditionPage.disabled = conditionPage === 0;
    nextConditionPage.disabled = conditionPage === pages - 1;
    conditionPageLabel.textContent = `${conditionPage + 1} / ${pages} · 총 ${structure.conditions.length}개`;
    conditionPagination.hidden = structure.conditions.length === 0;
    structure.conditions.forEach((condition, index) => {
      if (Math.floor(index / CONDITION_PAGE_SIZE) !== conditionPage) return;
      const row = $node('div', 'structure-condition-row'); row.dataset.condition = String(index);
      const header = $node('div', 'structure-condition-heading');
      header.append($node('span', 'structure-condition-index', `조건 ${index + 1}`), button('삭제', 'button button-ghost compact-button remove-condition', () => { structure.conditions.splice(index, 1); focusedExpression = mainLeft; renderConditions(); notify(); }));
      if (condition.kind === 'expression') {
        const fields = $node('div', 'expression-row');
        fields.append(expressionField(condition.left, `추가 조건 ${index + 1} 왼쪽 식`, `structure-condition-${index}-left`, (value) => { condition.left = value; }),
          select(RELATIONS, condition.relation, `추가 조건 ${index + 1} 관계`, `structure-condition-${index}-relation`, (value) => { condition.relation = value; notify(); }),
          expressionField(condition.right, `추가 조건 ${index + 1} 오른쪽 식`, `structure-condition-${index}-right`, (value) => { condition.right = value; }));
        row.append(header, fields);
      } else {
        const fields = $node('div', 'group-condition-fields');
        const kind = select(GROUPS, condition.kind, `그룹 조건 ${index + 1} 종류`, `structure-condition-${index}-kind`, (value) => { condition.kind = value; notify(); });
        const targets = $node('span', 'group-targets', condition.variables.map((i) => LETTERS[i]).join(', '));
        const update = button('현재 선택 변수로 바꾸기', 'button button-ghost compact-button', () => {
          if (selected.size < 2) { setError('그룹 조건에 사용할 변수를 두 개 이상 선택해 주세요.'); return; }
          condition.variables = [...selected].sort((a, b) => a - b); renderConditions(); notify();
        });
        fields.append(kind, targets, update); row.append(header, fields);
      }
      conditionRows.append(row);
    });
    if (!structure.conditions.length) conditionRows.append($node('p', 'structure-no-conditions', '추가 조건이 없습니다. 식 또는 그룹 조건을 추가하세요.'));
  }

  renderChips(); renderVariableCards(); renderConditions(); renderPreview();
  return {
    panels() { return { expression: mainSection, variables: variableSection, conditions: conditionsSection, examples: presets, shared }; },
    mode() { return { autoMain, enabled: structure.enabled }; },
    read(params) {
      const oldCount = structure.variables.length;
      scalarParams = { ...params };
      const simple = defaultStructure(params);
      if (autoMain) { structure.left = simple.left; structure.right = simple.right; structure.relation = simple.relation; updateMainInputs(); }
      if (oldCount !== simple.variables.length) {
        structure.variables = simple.variables.map((entry, index) => structure.variables[index] ?? entry);
        structure.conditions = structure.conditions.filter((condition) => condition.kind === 'expression' || condition.variables.every((index) => index < simple.variables.length));
        selected = new Set([...selected].filter((index) => index < simple.variables.length));
        focusedExpression = mainLeft; renderChips(); renderVariableCards(); renderConditions();
      }
      renderPreview();
      if (structure.enabled) {
        for (const [index, variable] of structure.variables.entries()) {
          for (const [key, label] of [['lower', '하한'], ['upper', '상한']]) {
            if (variable[key] !== null && !boundedInteger(variable[key])) {
              const message = `${LETTERS[index]}의 ${label}에 -10000~10000의 정수를 입력해 주세요.`; setError(message); return { structure: null, error: message, autoMain, enabled: structure.enabled };
            }
          }
        }
        const allExpressions = [structure.left, structure.right, ...structure.conditions.filter((condition) => condition.kind === 'expression').flatMap((condition) => [condition.left, condition.right])];
        for (const expression of allExpressions) {
          const value = normalizeExpression(expression);
          let message = '';
          if (!value.trim()) message = '식의 양쪽을 모두 입력해 주세요.';
          else if (value.length > MAX_EXPRESSION || !/^[a-h0-9+*^().\s-]+$/.test(value)) message = '식에는 변수 a~h, 수, + − ×, 제곱(^), 괄호를 사용해 주세요.';
          else if ([...value.matchAll(/[a-h]/g)].some((match) => LETTERS.indexOf(match[0]) >= simple.variables.length)) message = '현재 문자의 수에 포함된 변수만 사용해 주세요.';
          for (const input of expressionInputs) if (normalizeExpression(input.value) === value) input.setAttribute('aria-invalid', String(Boolean(message)));
          if (message) { setError(message); return { structure: null, error: message, autoMain, enabled: structure.enabled }; }
        }
      }
      setError();
      return { structure: sanitizeStructure(structure, params), error: '', autoMain, enabled: structure.enabled };
    },
  };
}
