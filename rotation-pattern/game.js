(() => {
  'use strict';
  const E = window.RotationPattern, $ = id => document.getElementById(id);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const RECORD_KEY = 'rotation-pattern-record-v2-small', SOUND_KEY = 'rotation-pattern-sound';
  let phase = 'idle', mode = 'challenge', runMode = 'challenge', round = 1, passed = 0;
  let puzzle = null, selected = new Set(), runId = 0, deadline = 0, duration = 0;
  let answerStarted = 0, answerTotal = 0, practiceOptions = null, marker = 0;
  let pausedAt = null, pausedDuration = 0, animation = null, lastPuzzle = null;
  let soundOn = false, audioContext = null, record = null;
  try { soundOn = localStorage.getItem(SOUND_KEY) === 'on'; record = JSON.parse(localStorage.getItem(RECORD_KEY) || 'null'); } catch {}
  if (!record || !Number.isFinite(record.passed) || !Number.isFinite(record.time)) record = null;
  function now() { return (pausedAt === null ? performance.now() : pausedAt) - pausedDuration; }
  function active() { return !['idle', 'ended'].includes(phase); }
  function live(id) { return id === runId && active(); }
  function say(text, kind = '') { $('status').textContent = text; $('status').className = 'message ' + kind; }
  function timeText(ms) { return (ms / 1000).toFixed(1) + '초'; }
  function bestText() { $('best').textContent = record ? '최고 기록 · ' + record.passed + '단계 통과 / ' + timeText(record.time) : '첫 기록에 도전해 보세요.'; }
  function sound(frequencies, length = .12) {
    if (!soundOn) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      audioContext = audioContext || new Audio();
      if (audioContext.state === 'suspended') audioContext.resume();
      frequencies.forEach((freq, i) => {
        const osc = audioContext.createOscillator(), gain = audioContext.createGain();
        const start = audioContext.currentTime + i * length;
        osc.type = 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(.045, start + .014);
        gain.gain.exponentialRampToValueAtTime(.001, start + length + .08);
        osc.connect(gain); gain.connect(audioContext.destination); osc.start(start); osc.stop(start + length + .1);
      });
    } catch {}
  }
  async function wait(ms, id) {
    const until = now() + ms;
    while (live(id) && (pausedAt !== null || now() < until)) await new Promise(resolve => setTimeout(resolve, 30));
    return live(id);
  }
  function setPhase(value, title) {
    phase = value;
    $('phaseTitle').textContent = title;
    $('phaseDot').className = 'phase-dot ' + value;
    $('timeBar').className = value;
    $('motionBoard').dataset.phase = value;
    for (const cell of $('grid').children) cell.disabled = value !== 'answer';
    $('answerActions').hidden = value !== 'answer';
    if (!['memory', 'answer'].includes(value)) { $('phaseCount').textContent = ''; $('timeBar').style.transform = 'scaleX(1)'; }
  }
  function setTimer(ms) { duration = ms; deadline = ms ? now() + ms : Infinity; tick(); }
  function tick() {
    if (!puzzle || !active()) return;
    if (['memory', 'answer'].includes(phase)) {
      const remaining = Math.max(0, deadline - now());
      $('clockLabel').textContent = phase === 'memory' ? '암기 남은 시간' : '정답 남은 시간';
      $('clock').textContent = Number.isFinite(remaining) ? (remaining / 1000).toFixed(1) + '초' : '제한 없음';
      $('phaseCount').textContent = Number.isFinite(remaining) ? (remaining / 1000).toFixed(1) + 's' : '';
      $('timeBar').style.transform = 'scaleX(' + (duration ? Math.max(0, Math.min(1, remaining / duration)) : 1) + ')';
      $('timeBar').className = phase + (phase === 'answer' && remaining < 5000 ? ' urgent' : '');
      if (phase === 'answer') {
        $('totalTime').textContent = timeText(answerTotal + Math.max(0, now() - answerStarted));
        if (remaining <= 0 && pausedAt === null) finish(false, '정답 시간이 끝났습니다');
      }
    }
  }
  function specs() {
    $('roundLabel').textContent = runMode === 'challenge' ? 'STAGE ' + String(round).padStart(2, '0') + ' / 20' : 'PRACTICE · ' + String(round).padStart(2, '0');
    $('boardSize').textContent = puzzle.size + ' × ' + puzzle.size;
    $('passed').innerHTML = passed + '<span>' + (runMode === 'challenge' ? ' / 20' : ' 판') + '</span>';
    $('roundInfo').textContent = runMode === 'challenge' ? round + '단계' : '자유 연습 ' + round + '번째 판';
    $('specLights').textContent = puzzle.count + '개'; $('specMemory').textContent = puzzle.memory + '초';
    $('specTransforms').textContent = puzzle.transforms + '회'; $('specAnswer').textContent = puzzle.answer ? puzzle.answer + '초' : '제한 없음';
    $('boardHint').textContent = '불빛 ' + puzzle.count + '개 · 암기 ' + puzzle.memory + '초 · 변형 ' + puzzle.transforms + '회';
    $('selectedCount').textContent = '0 / ' + puzzle.count;
    for (const step of document.querySelectorAll('.journey-step')) {
      const from = Number(step.dataset.from), to = Number(step.dataset.to);
      step.classList.toggle('active', runMode === 'challenge' && round >= from && round <= to);
    }
  }
  function positionMarker() {
    $('boardMarker').style.left = marker % 2 ? 'calc(100% - var(--edge, 6px))' : 'var(--edge, 6px)';
    $('boardMarker').style.top = marker > 1 ? 'calc(100% - var(--edge, 6px))' : 'var(--edge, 6px)';
  }
  function buildBoard(n) {
    $('motionBoard').classList.remove('failing');
    $('grid').style.setProperty('--n', n);
    $('grid').setAttribute('aria-label', n + '행 ' + n + '열 게임판');
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < n * n; i++) {
      const cell = document.createElement('button');
      cell.type = 'button'; cell.className = 'cell'; cell.dataset.index = i; cell.disabled = true;
      cell.setAttribute('aria-label', Math.floor(i / n) + 1 + '행 ' + (i % n + 1) + '열');
      cell.setAttribute('aria-pressed', 'false');
      cell.addEventListener('click', () => choose(i));
      cell.addEventListener('keydown', event => {
        const shifts = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -n, ArrowDown: n };
        if (!(event.key in shifts) || phase !== 'answer') return;
        event.preventDefault();
        const next = i + shifts[event.key];
        if (next >= 0 && next < n * n && (Math.abs(shifts[event.key]) !== 1 || Math.floor(next / n) === Math.floor(i / n))) $('grid').children[next].focus();
      });
      fragment.appendChild(cell);
    }
    $('grid').replaceChildren(fragment); marker = 0; positionMarker();
  }
  function lights(on) {
    const wanted = new Set(puzzle.source);
    for (let i = 0; i < $('grid').children.length; i++) {
      const cell = $('grid').children[i];
      cell.classList.toggle('lit', on && wanted.has(i));
      cell.setAttribute('aria-label', Math.floor(i / puzzle.size) + 1 + '행 ' + (i % puzzle.size + 1) + '열' + (on && wanted.has(i) ? ', 불빛 켜짐' : ''));
    }
  }
  function choose(index) {
    if (phase !== 'answer' || pausedAt !== null) return;
    if (now() >= deadline) { finish(false, '정답 시간이 끝났습니다'); return; }
    if (selected.has(index)) selected.delete(index);
    else if (selected.size < puzzle.count) selected.add(index);
    else { say(puzzle.count + '개를 모두 골랐습니다. 다른 칸을 고르려면 먼저 선택을 취소하세요.'); return; }
    paintSelection(); sound([selected.has(index) ? 420 : 300], .035);
  }
  function paintSelection() {
    for (let i = 0; i < $('grid').children.length; i++) {
      const on = selected.has(i), cell = $('grid').children[i];
      cell.classList.toggle('selected', on); cell.setAttribute('aria-pressed', String(on));
    }
    $('selectedCount').textContent = selected.size + ' / ' + puzzle.count;
    $('submit').disabled = selected.size !== puzzle.count;
    say(selected.size === puzzle.count ? '모두 골랐습니다. 선택 완료 또는 Enter 키로 제출하세요.' : '불빛이 도착한 ' + puzzle.count + '칸을 골라 주세요.');
  }
  function strip(step = -1) {
    $('transformStrip').innerHTML = puzzle.operations.map((op, i) => (i ? '<span class="chip-arrow" aria-hidden="true">→</span>' : '') + '<span class="transform-chip ' + (i === step ? 'current' : i < step ? 'done' : '') + '"><b aria-hidden="true">' + E.OPS[op].symbol + '</b>' + E.OPS[op].label + '</span>').join('');
  }
  async function move(op, id) {
    const info = E.OPS[op], board = $('motionBoard');
    if (!reduced.matches && board.animate) {
      const rotate = 'rotate' + info.axis;
      animation = board.animate([
        { transform: rotate + '(0deg) scale(1)', offset: 0 },
        { transform: rotate + '(' + info.angle * .5 + 'deg) scale(.84)', offset: .5 },
        { transform: rotate + '(' + info.angle + 'deg) scale(1)', offset: 1 }
      ], { duration: info.axis === 'Z' ? 1080 : 1230, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' });
      if (pausedAt !== null) animation.pause();
      const ownAnimation = animation;
      try { await ownAnimation.finished; } catch { return false; }
      if (!live(id)) return false;
      marker = E.transform(marker, 2, op); positionMarker();
      ownAnimation.cancel(); if (animation === ownAnimation) animation = null;
    } else {
      if (!await wait(400, id)) return false;
      marker = E.transform(marker, 2, op); positionMarker();
    }
    return live(id);
  }
  async function playRound(existing = null, countdown = true) {
    const id = ++runId;
    puzzle = existing || E.make(runMode === 'challenge' ? E.config(round) : practiceOptions);
    lastPuzzle = puzzle; selected = new Set();
    $('resultPanel').hidden = true; $('reviewLegend').hidden = true; $('successBurst').hidden = true;
    $('readyOverlay').hidden = true; $('endActions').hidden = true; $('setup').hidden = true; $('playingInfo').hidden = false;
    $('clock').textContent = '준비'; $('clockLabel').textContent = '다음 단계';
    $('transformStrip').innerHTML = '<span class="strip-placeholder">빛의 위치와 모양을 기억하세요</span>';
    buildBoard(puzzle.size); specs(); $('submit').disabled = true;
    setPhase('countdown', '곧 불빛이 켜집니다');
    if (countdown) {
      $('countdownOverlay').hidden = false;
      for (let i = 3; i > 0; i--) {
        $('countdown').textContent = i;
        $('countdown').classList.remove('pop'); void $('countdown').offsetWidth; $('countdown').classList.add('pop');
        if (!await wait(650, id)) return;
      }
    } else if (!await wait(650, id)) return;
    $('countdownOverlay').hidden = true;
    setPhase('lighting', '불빛의 위치를 기억하세요');
    say(puzzle.count + '개의 불빛을 기억하세요. 잠시 뒤 모두 꺼집니다.');
    // Commit the unlit board before fading the lamps in, including on a quick restart.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (!live(id)) return;
    lights(true); sound([380, 570], .07);
    if (!await wait(reduced.matches ? 50 : 550, id)) return;
    setPhase('memory', '불빛의 위치를 기억하세요'); setTimer(puzzle.memory * 1000);
    if (!await wait(puzzle.memory * 1000, id)) return;
    setPhase('fading', '불빛이 사라집니다'); lights(false);
    $('clock').textContent = '변형 중';
    if (!await wait(reduced.matches ? 120 : 650, id)) return;
    strip();
    for (let i = 0; i < puzzle.operations.length; i++) {
      const op = puzzle.operations[i];
      setPhase('transform', E.OPS[op].label + ' · ' + (i + 1) + '/' + puzzle.operations.length);
      say(E.OPS[op].label + '. 불빛이 어디로 옮겨가는지 따라가세요.'); strip(i);
      if (!await wait(250, id) || !await move(op, id) || !await wait(230, id)) return;
    }
    strip(puzzle.operations.length);
    setPhase('answer', '기억한 패턴을 다시 켜세요');
    answerStarted = now(); setTimer(puzzle.answer * 1000); paintSelection();
  }
  function practiceConfig() {
    return { size: +$('practiceSize').value, count: +$('practiceCount').value, memory: +$('practiceMemory').value, transforms: +$('practiceTransforms').value, answer: +$('practiceAnswer').value };
  }
  function clearPause() {
    if (pausedAt !== null) { pausedDuration += performance.now() - pausedAt; pausedAt = null; }
    $('privacyCover').hidden = true;
  }
  function cancel() {
    runId++; if (animation) { animation.cancel(); animation = null; }
    clearPause(); $('countdownOverlay').hidden = true; $('successBurst').hidden = true;
  }
  function start() {
    cancel(); round = 1; passed = 0; answerTotal = 0; runMode = mode;
    practiceOptions = practiceConfig(); $('totalTime').textContent = '0.0초';
    sound([440], .05); playRound();
  }
  function paintResult(result, win) {
    const target = new Set(puzzle.target);
    for (let i = 0; i < $('grid').children.length; i++) {
      const cell = $('grid').children[i], hit = target.has(i) && selected.has(i);
      cell.classList.remove('lit', 'selected'); cell.classList.toggle('hit', hit);
      cell.classList.toggle('miss', result.missing.includes(i)); cell.classList.toggle('extra', result.extra.includes(i));
      cell.classList.toggle('win', win && hit); cell.style.setProperty('--delay', (Math.floor(i / puzzle.size) + i % puzzle.size) * 28 + 'ms');
      const state = hit ? '맞힌 위치' : result.missing.includes(i) ? '놓친 위치' : result.extra.includes(i) ? '잘못 고른 위치' : '빈칸';
      cell.setAttribute('aria-label', Math.floor(i / puzzle.size) + 1 + '행 ' + (i % puzzle.size + 1) + '열, ' + state);
      if (result.extra.includes(i)) { const cross = document.createElement('span'); cross.className = 'cross'; cross.textContent = '×'; cross.setAttribute('aria-hidden', 'true'); cell.appendChild(cross); }
    }
  }
  async function submit() {
    if (phase !== 'answer' || pausedAt !== null || selected.size !== puzzle.count) return;
    if (now() >= deadline) { finish(false, '정답 시간이 끝났습니다'); return; }
    const result = E.judge(puzzle.target, [...selected]);
    if (!result.correct) { finish(false, '패턴이 조금 달랐습니다'); return; }
    answerTotal += now() - answerStarted; passed++;
    setPhase('success', '정확합니다!'); paintResult(result, true);
    $('clockLabel').textContent = '이번 정답 시간'; $('clock').textContent = timeText(now() - answerStarted);
    $('totalTime').textContent = timeText(answerTotal); specs(); $('selectedCount').textContent = puzzle.count + ' / ' + puzzle.count;
    const nextConfig = runMode === 'challenge' && round < 20 ? E.config(round + 1) : null;
    const expands = nextConfig && nextConfig.size > puzzle.size;
    $('successText').textContent = expands ? '6연속 성공 · 다음은 ' + nextConfig.size + '×' + nextConfig.size : nextConfig ? '다음은 불빛 ' + nextConfig.count + '개' : '패턴을 완벽히 기억했습니다';
    $('successBurst').hidden = false; sound([523, 659, 784, 1047], .09);
    say(expands ? puzzle.size + '×' + puzzle.size + '판 6연속 성공! 다음은 ' + nextConfig.size + '×' + nextConfig.size + '판입니다. 암기는 10초로 늘리고 변형 횟수는 유지합니다.' : nextConfig ? '정답! 다음 단계는 불빛이 하나 늘어납니다.' : '모든 위치가 정확히 일치합니다.', 'good');
    const id = runId;
    if (!await wait(1800, id)) return;
    if (runMode === 'challenge' && round === 20) { finish(true, '20단계 완주!'); return; }
    round++; playRound(null, !!expands);
  }
  function saveRecord() {
    if (runMode !== 'challenge' || !passed) return false;
    if (!record || passed > record.passed || passed === record.passed && answerTotal < record.time) {
      record = { passed, time: Math.round(answerTotal) };
      try { localStorage.setItem(RECORD_KEY, JSON.stringify(record)); } catch {}
      bestText(); return true;
    }
    return false;
  }
  function finish(win, title, reveal = true) {
    if (!active()) return;
    const wasAnswer = phase === 'answer', previous = phase;
    // Only successful answer time ranks a run; a failed attempt is shown separately.
    const failedTime = wasAnswer ? now() - answerStarted : 0;
    cancel(); setPhase('ended', title); $('playingInfo').hidden = true; $('endActions').hidden = false;
    $('clockLabel').textContent = '이번 도전'; $('clock').textContent = win ? '완주' : '종료';
    $('totalTime').textContent = timeText(answerTotal);
    const improved = saveRecord();
    if (reveal) {
      if (previous !== 'answer' && previous !== 'success') marker = E.apply([0], 2, puzzle.operations)[0];
      positionMarker(); strip(puzzle.operations.length);
      const result = E.judge(puzzle.target, [...selected]); paintResult(result, win); $('reviewLegend').hidden = false;
      if (!win) { $('motionBoard').classList.add('failing'); sound([240, 170], .13); }
    } else lights(false);
    $('resultPanel').hidden = false; $('resultEyebrow').textContent = improved ? 'NEW PERSONAL BEST' : runMode === 'challenge' ? 'CHALLENGE RESULT' : 'PRACTICE RESULT';
    $('resultTitle').textContent = title;
    const hits = E.judge(puzzle.target, [...selected]).hits.length;
    $('resultText').textContent = (runMode === 'challenge' ? passed + ' / 20단계 통과' : passed + '판 성공') + ' · 성공한 답을 고른 시간 ' + timeText(answerTotal) + (wasAnswer ? ' · 마지막 판 ' + hits + '/' + puzzle.count + '개 일치 (' + timeText(failedTime) + ')' : '') + (improved ? ' · 최고 기록을 새로 썼습니다.' : '');
    say(win ? '완벽한 기억과 공간 감각입니다. 20단계를 모두 통과했습니다.' : title + '. 정답 위치와 내가 고른 칸을 비교해 보세요.', win ? 'good' : 'bad');
    $('again').textContent = runMode === 'challenge' ? '처음부터 재도전' : '새 패턴으로 연습';
  }
  function chooseMode(value) {
    mode = value;
    $('challengeMode').classList.toggle('active', value === 'challenge'); $('challengeMode').setAttribute('aria-pressed', String(value === 'challenge'));
    $('practiceMode').classList.toggle('active', value === 'practice'); $('practiceMode').setAttribute('aria-pressed', String(value === 'practice'));
    $('practiceSettings').hidden = value !== 'practice';
    $('modeDescription').innerHTML = value === 'challenge' ? '5×5에서 시작해 정답마다 불빛 +1.<br>6연속 성공하면 6×6, 다시 6번 성공하면 7×7.' : '판 크기와 시간을 직접 정하세요.<br>같은 설정으로 새 패턴이 이어집니다.';
    $('start').textContent = value === 'challenge' ? '도전 시작' : '연습 시작';
    $('boardStart').textContent = $('start').textContent;
  }
  $('start').onclick = start; $('boardStart').onclick = start; $('submit').onclick = submit;
  $('challengeMode').onclick = () => chooseMode('challenge'); $('practiceMode').onclick = () => chooseMode('practice');
  $('clear').onclick = () => { if (phase === 'answer' && pausedAt === null) { selected.clear(); paintSelection(); } };
  $('again').onclick = () => { mode = runMode; chooseMode(mode); start(); };
  $('replay').onclick = () => {
    const old = lastPuzzle; if (!old) return;
    cancel(); runMode = 'practice'; mode = 'practice'; round = 1; passed = 0; answerTotal = 0;
    practiceOptions = { ...old, answer: 0 }; $('totalTime').textContent = '0.0초';
    playRound({ ...old, answer: 0 });
  };
  $('settings').onclick = () => {
    cancel(); setPhase('idle', '빛을 기억하고, 방향을 바꾸세요'); puzzle = null;
    $('setup').hidden = false; $('endActions').hidden = true; $('playingInfo').hidden = true; $('readyOverlay').hidden = false;
    $('resultPanel').hidden = true; $('reviewLegend').hidden = true; $('roundLabel').textContent = 'SPATIAL MEMORY';
    buildBoard(5); $('boardSize').textContent = '5 × 5'; $('boardHint').textContent = '불빛 5개 · 암기 10초 · 변형 1회';
    $('selectedCount').textContent = '0 / 5'; $('transformStrip').innerHTML = '<span class="strip-placeholder">기억 → 회전·뒤집기 → 패턴 복원</span>';
    $('clockLabel').textContent = '다음 단계'; $('clock').textContent = '준비'; chooseMode(mode);
    say('플레이 방식을 정하고 시작하세요.');
  };
  $('endRun').onclick = () => finish(false, '여기까지 도전했습니다');
  $('sound').onclick = () => {
    soundOn = !soundOn; $('sound').setAttribute('aria-pressed', String(soundOn)); $('sound').textContent = '효과음 ' + (soundOn ? '켜짐' : '꺼짐');
    try { localStorage.setItem(SOUND_KEY, soundOn ? 'on' : 'off'); } catch {} sound([523, 784], .06);
  };
  document.addEventListener('keydown', event => {
    if (event.key === 'Enter' && phase === 'answer' && (document.activeElement?.classList.contains('cell') || !['SELECT', 'INPUT', 'BUTTON', 'SUMMARY', 'A'].includes(document.activeElement?.tagName))) { event.preventDefault(); submit(); }
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden || !active() || pausedAt !== null) return;
    pausedAt = performance.now(); if (animation) animation.pause(); $('privacyCover').hidden = false;
  });
  $('resume').onclick = () => {
    if (document.hidden) return;
    clearPause(); if (animation) animation.play(); tick();
  };
  $('sound').setAttribute('aria-pressed', String(soundOn)); $('sound').textContent = '효과음 ' + (soundOn ? '켜짐' : '꺼짐');
  buildBoard(5); bestText(); setInterval(tick, 50);
})();
