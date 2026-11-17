/* Presentation only: keep the original controls, clocks, answers and storage game-owned. */
(() => {
  'use strict';
  const root = document.documentElement;
  if (root.dataset.arena !== 'game') return;
  const visuals = typeof window === 'object' && window.ArenaVisuals;
  if (visuals) {
    root.dataset.arenaSkin = 'gallery';
    const id = root.dataset.arenaId;
    const layout = document.querySelector('.layout,.arithmetic-layout,.death-layout') || (id === 'formula-maze' ? document.querySelector('.shell > main') : null);
    if (layout && id !== 'rotation-pattern') {
      layout.classList.add('arena-play-layout');
      const side = layout.querySelector(':scope > aside');
      const score = side && ([...side.children].find(panel => panel.matches('.panel,.card,.stats-bar') && panel.querySelector('.stats,#clock,#timer,.stat') && !panel.querySelector('button,input,select,form')) || side.querySelector(':scope > div > .stats-bar'));
      if (score) {
        score.classList.add('arena-score-ribbon');
        for (const label of [...score.children].filter(node => node.matches('.label'))) {
          const value = label.nextElementSibling;
          if (!value || !value.matches('.value,.time-value,#clock,#timer')) continue;
          const metric = document.createElement('div'); metric.className = 'arena-metric';
          score.insertBefore(metric, label); metric.append(label, value);
        }
        for (const metric of score.querySelectorAll('.stats > div')) metric.classList.add('arena-metric');
        for (const child of [...score.children]) {
          if (!child.matches('.stats,.arena-metric,.stat')) child.classList.add('arena-hud-note');
        }
        const identity = document.createElement('div'); identity.className = 'arena-session-identity';
        identity.innerHTML = '<span>YOUR SESSION</span><strong>플레이 현황</strong>';
        score.prepend(identity); layout.prepend(score);
      }
      if (side) side.classList.add('arena-control-stack');
    }
    for (const bar of document.querySelectorAll('.shell > .stats-bar,.shell > .status')) bar.classList.add('arena-score-ribbon','arena-native-ribbon');

    const start = document.getElementById('start');
    function decorateReady() {
      if (id === 'rotation-pattern') return;
      for (const board of document.querySelectorAll('div.board:empty')) {
        if (!start || start.disabled) continue;
        const ready = document.createElement('div'); ready.className = 'ready arena-created-ready';
        const title = document.querySelector('h1')?.textContent || '새로운 도전';
        const heading = document.createElement('strong'); heading.textContent = title;
        const description = document.createElement('p'); description.textContent = '준비되면 새로운 문제에 도전하세요.';
        ready.append(heading,description); board.append(ready);
      }
      for (const ready of document.querySelectorAll('.ready')) {
        if (ready.dataset.arenaPreview) continue;
        ready.dataset.arenaPreview = id;
        const art = document.createElement('div'); art.className = 'arena-ready-art'; art.setAttribute('aria-hidden','true'); art.innerHTML = visuals.game(id);
        ready.prepend(art);
        if (start && !ready.contains(start) && !ready.querySelector('button')) {
          const launch = document.createElement('button'); launch.type = 'button'; launch.className = 'primary arena-launch';
          launch.textContent = start.textContent.trim(); launch.disabled = start.disabled;
          launch.addEventListener('click', () => { if (!start.disabled) start.click(); });
          ready.append(launch);
        }
      }
    }
    decorateReady();
    let queued = false;
    const refresh = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; decorateReady(); }); };
    for (const board of document.querySelectorAll('#board,#display')) new MutationObserver(refresh).observe(board,{childList:true,subtree:true});
    if (start) new MutationObserver(() => {
      for (const launch of document.querySelectorAll('.arena-launch')) { launch.textContent = start.textContent.trim(); launch.disabled = start.disabled; }
    }).observe(start,{attributes:true,attributeFilter:['disabled'],childList:true,subtree:true});
  }
  if (root.dataset.arenaId === 'rotation-pattern') return;
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
