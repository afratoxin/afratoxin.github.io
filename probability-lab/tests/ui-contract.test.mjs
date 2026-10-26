import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Each process imports the actual app and actual engines with an isolated DOM.
// Input, change, click and hashchange events exercise the same handlers as users.
const runner = fileURLToPath(new URL('./helpers/ui-runner.mjs', import.meta.url));
for (const [scenario, name] of [
  ['slider', 'drag sliders preserve mathematical meanings and synchronize typed companions, presets and links'],
  ['basic', 'inputs, presets, resetting, hidden answers, copying, filters and keyboard tabs work'],
  ['catalog', 'all 13 engines, every preset, seeded random conditions and 253 catalog records render'],
  ['network', 'catalog network failure leaves the experiment engines usable'],
  ['hash', 'shared links restore decimal numbers, select strings and boolean checkboxes'],
  ['malformed', 'malformed links and prototype keys cannot stop app initialization'],
]) {
  test(name, () => {
    const result = spawnSync(process.execPath, [runner, scenario], {
      encoding: 'utf8', timeout: 20000, maxBuffer: 1024 * 1024,
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, `${scenario}: ${result.stderr || result.stdout}`);
    assert.match(result.stdout, /PASS/);
  });
}
