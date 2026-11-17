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
  const interfaceScripts = [...html.matchAll(/<script[^>]*src="[^"\n]*brain-arena\/interface\.js[^"\n]*"[^>]*>/g)];
  A.equal(interfaceScripts.length, 1, game.id + ': one shared presentation controller');
  A(interfaceScripts[0][0].includes('defer'), game.id + ': visual feedback waits for the page');
  const visualScripts = [...html.matchAll(/<script[^>]*src="[^"\n]*brain-arena\/visuals\.js[^"\n]*"[^>]*>/g)];
  A.equal(visualScripts.length, 1, game.id + ': one decorative artwork source');
  A(visualScripts[0][0].includes('defer'), game.id + ': artwork waits for the page');
  A(visualScripts[0].index < interfaceScripts[0].index, game.id + ': artwork available before presentation');
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
vm.runInContext(fs.readFileSync('brain-arena/visuals.js', 'utf8'), context);
for (const game of catalog.games) {
  A(context.window.ArenaVisuals.families[game.id], game.id + ': registered decorative cover');
  const svg = context.window.ArenaVisuals.game(game.id);
  A(svg.includes('aria-hidden="true"'), game.id + ': decorative only');
  A(!/<(?:script|foreignObject)|(?:href|src)=/i.test(svg), game.id + ': self-contained artwork');
}
A.equal((hub.match(/class="collection-cover"/g)||[]).length, 5, 'all static folders have illustrated fallback covers');
A(hub.indexOf('./visuals.js?') < hub.indexOf('./hub.js?'), 'artwork available before hub render');
A(fs.readFileSync('AGENTS.md', 'utf8').includes('including future additions'));
console.log('PASS: hub and all ' + catalog.games.length + ' games share the final stylesheet, theme identity, consistent navigation and correct folder links; future-game requirements documented.');
