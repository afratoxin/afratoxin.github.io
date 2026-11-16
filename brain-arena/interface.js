/* Visual feedback only. Game rules, answers, clocks and storage remain game-owned. */
(() => {
  'use strict';
  const root = document.documentElement;
  if (root.dataset.arena !== 'game' || root.dataset.arenaId === 'rotation-pattern') return;
  const previous = new WeakMap();
  let reset;
  function update(element) {
    if (!element.getClientRects().length) return;
    const text = element.textContent.trim();
    if (previous.get(element) === text) return;
    previous.set(element, text);
    // Match explicit published outcomes; instructions mentioning answers are neutral.
    const tone = /^(?:정답[!！]|합[!！]|결[!！]|완벽[!！])|(?:전체 단계 클리어[!！]|모든 연결 완성[!！])/.test(text) ? 'success'
      : /^(?:오답[.!！·]|오답입니다|틀렸습니다|시간이 초과되었습니다|시간 초과[.!！·])/.test(text) ? 'error' : '';
    if (element.matches('[role="status"]')) {
      if (tone) element.dataset.arenaTone = tone;
      else delete element.dataset.arenaTone;
    }
    if (!tone) return;
    clearTimeout(reset);
    delete root.dataset.arenaFeedback;
    requestAnimationFrame(() => {
      root.dataset.arenaFeedback = tone;
      reset = setTimeout(() => { delete root.dataset.arenaFeedback; }, 1000);
    });
  }
  for (const element of document.querySelectorAll('[role="status"],#resultTitle')) {
    previous.set(element, element.textContent.trim());
    new MutationObserver(() => update(element)).observe(element, { childList: true, characterData: true, subtree: true });
  }
})();
