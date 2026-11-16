const A = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm');
const source = fs.readFileSync('brain-arena/interface.js', 'utf8');
function runtime(id = 'hidden-mission') {
  const root = { dataset: { arena: 'game', arenaId: id } }, nodes = [], callbacks = new Map(), pending = [];
  const node = (text, visible = true, status = true) => {
    const element = { textContent: text, dataset: {}, getClientRects: () => visible ? [1] : [], matches: () => status };
    nodes.push(element); return element;
  };
  const status = node('준비되면 시작하세요.'), hidden = node('정답!', false), title = node('결과', true, false);
  vm.runInNewContext(source, { document: { documentElement: root, querySelectorAll: () => nodes }, MutationObserver: class { constructor(fn) { this.fn = fn; } observe(element) { callbacks.set(element, this.fn); } }, clearTimeout() {}, setTimeout(fn) { pending.push(fn); return pending.length; }, requestAnimationFrame: fn => fn() });
  return { root, status, hidden, title, callbacks, pending, set(el, text) { el.textContent = text; callbacks.get(el)?.(); } };
}
const r = runtime();
for (const text of ['정답 버튼을 눌러 칸과 계산을 확인하세요.', '정답은 라운드 종료 후 공개합니다.', '오답 시 10초 동안 기다립니다.', '시간이 초과되면 정답을 공개합니다.']) {
  r.set(r.status, text); A.equal(r.root.dataset.arenaFeedback, undefined, text);
}
r.set(r.hidden, '정답! +3점'); A.equal(r.root.dataset.arenaFeedback, undefined);
r.set(r.status, '정답! 한 칸 전진했습니다.'); A.equal(r.root.dataset.arenaFeedback, 'success'); A.equal(r.status.dataset.arenaTone, 'success');
r.pending.at(-1)(); A.equal(r.root.dataset.arenaFeedback, undefined);
r.set(r.status, '다음 칸을 골라 주세요.'); A.equal(r.status.dataset.arenaTone, undefined);
r.set(r.status, '오답입니다. 10초 뒤 다시 답할 수 있습니다.'); A.equal(r.root.dataset.arenaFeedback, 'error');
A.equal(r.status.textContent, '오답입니다. 10초 뒤 다시 답할 수 있습니다.');
const own = runtime('rotation-pattern'); A.equal(own.callbacks.size, 0);
console.log('PASS: visual feedback follows explicit visible outcomes, ignores instructions and hidden answers, preserves original text, and leaves Rotation Pattern’s own effects intact.');
