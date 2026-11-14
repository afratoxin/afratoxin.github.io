const A = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({window: {}});
vm.runInContext(fs.readFileSync('brain-arena/catalog.js', 'utf8'), context);
const catalog = context.window.BrainArenaCatalog;
for (const game of catalog.games) {
  const html = fs.readFileSync(game.id + '/index.html', 'utf8');
  A(html.includes('data-arena="game"'), game.id + ': shared theme scope');
  A(html.includes('data-arena-id="' + game.id + '"'), game.id + ': stable identity');
  const theme = [...html.matchAll(/<link[^>]*href="([^"]*theme\.css[^\"]*)"/g)];
  A.equal(theme.length, 1, game.id + ': one shared stylesheet');
  const styles = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)];
  A(styles.at(-1)[0].includes('theme.css'), game.id + ': shared styles load last');
  A(html.lastIndexOf('</style>') < theme[0].index, game.id + ': inline styles cannot override theme');
  const header = html.match(/<header class="arena-header">([\s\S]*?)<\/header>/)?.[1];
  A(header, game.id + ': consistent header');
  A(header.includes('class="brand"'), game.id + ': brand');
  A(header.includes('aria-label="게임 탐색"'), game.id + ': navigation label');
  A(header.includes('게임 보관함'), game.id + ': home link');
  A(header.includes('#' + game.category + (game.group ? '/' + game.group : '')), game.id + ': correct folder');
}
const hub = fs.readFileSync('brain-arena/index.html', 'utf8');
A(hub.includes('data-arena="hub"'));
A(hub.includes('./theme.css?'));
A(fs.readFileSync('AGENTS.md', 'utf8').includes('including future additions'));
console.log('PASS: hub and all ' + catalog.games.length + ' games share the final stylesheet, theme identity, consistent navigation and correct folder links; future-game requirements documented.');
