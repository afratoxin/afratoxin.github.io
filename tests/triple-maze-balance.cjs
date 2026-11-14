const assert = require('node:assert/strict');
const E = require('../university-strategy-assets/engine.js');
let seed = 84271;
const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
const signatures = new Set(), distances = [], shared = [];
// Independently traverse the rendered cell-wall representation, not the engine route helper.
function pathsFrom(walls, start) {
  const paths = new Map([[start, [start]]]), queue = [start];
  for (let i = 0; i < queue.length; i++) {
    const p = queue[i], y = Math.floor(p / 9), x = p % 9;
    [[-1, 0], [0, 1], [1, 0], [0, -1]].forEach(([dy, dx], d) => {
      const row = y + dy, col = x + dx;
      if (row < 0 || row > 8 || col < 0 || col > 8) { assert.equal(walls[p][d], -1); return; }
      const q = row * 9 + col;
      assert.equal(walls[p][d], walls[q][(d + 2) % 4]);
      if (!walls[p][d] && !paths.has(q)) { paths.set(q, [...paths.get(p), q]); queue.push(q); }
    });
  }
  return paths;
}
for (let board = 0; board < 500; board++) {
  const m = E.tripleMaze(random), paths = pathsFrom(m.walls, m.start);
  assert.equal(paths.size, 81);
  assert.equal(m.walls.flat().filter(v => v === 0).length / 2, 80);
  assert.equal(m.walls[m.start].filter(v => v === 0).length, 3);
  assert.equal(m.goals.length, 5);
  assert(m.goals.some(g => g.p % 9 <= 2));
  assert(m.goals.some(g => g.p % 9 >= 6));
  assert(m.goals.some(g => g.p < 36));
  const routes = m.goals.map(g => {
    assert(g.p >= 9 && g.p < 72 && g.p % 9 > 0 && g.p % 9 < 8);
    assert.equal(m.walls[g.p].filter(v => v === 0).length, 1);
    assert.deepEqual(g.pattern.filter(v => v > 0).sort(), [1, 2, 3]);
    assert.deepEqual(m.walls[g.p], g.pattern);
    assert.equal(m.walls.filter(w => w.join() === g.pattern.join()).length, 1);
    const route = paths.get(g.p), moves = route.length - 1;
    assert(moves >= 6 && moves <= 16, `route has ${moves} moves`);
    const steps = route.slice(1).map((p, i) => p - route[i]);
    assert(steps.slice(1).filter((step, i) => step !== steps[i]).length <= 6);
    assert.deepEqual(E.route(m.walls, m.start, g.p), route);
    distances.push(moves);
    return route;
  });
  assert.equal(new Set(routes.map(route => route[1])).size, 3);
  for (let i = 0; i < 5; i++) for (let j = 0; j < i; j++) {
    const overlap = routes[i].filter(p => p !== m.start && routes[j].includes(p)).length;
    assert(overlap <= 3, `two routes share ${overlap} moves`);
    shared.push(overlap);
    assert(Math.abs(m.goals[i].p % 9 - m.goals[j].p % 9) + Math.abs(Math.floor(m.goals[i].p / 9) - Math.floor(m.goals[j].p / 9)) > 1);
  }
  signatures.add(JSON.stringify([m.walls, m.goals]));
}
assert.equal(signatures.size, 500);
console.log(`PASS: 500 distinct connected mazes; five unique destinations; routes 6–16 moves (mean ${(distances.reduce((a,b)=>a+b)/distances.length).toFixed(2)}); at most 6 turns and 3 shared moves; all three entrance branches and left/right/upper destinations.`);
