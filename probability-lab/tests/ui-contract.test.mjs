import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Each process imports the actual app and actual engines with an isolated DOM.
// Input, change, click and hashchange events exercise the same handlers as users.
const runner = fileURLToPath(new URL('./helpers/ui-runner.mjs', import.meta.url));
for (const [scenario, name] of [
  ['limits-normal', 'normal sliders map standardized ±3 values to actual bounds and reject direct bypasses'],
  ['limits-bypass', 'input, bulk, expression, negative-bound and shared-link paths enforce the same public limits'],
  ['ball-rule-ranges', 'rule sliders track current extraction and distribution quantities'],
  ['colored-balls', 'colors, subsets, distribution rules and sharing update the live problem'],
  ['structured-subset', 'selected variables alone receive parity and lower or upper bounds'],
  ['structured-custom', 'custom equations survive base sliders and reset back into default sum synchronization'],
  ['structured-hash', 'local groups and shared structures round trip while malicious structures recover safely'],
  ['normal-table', 'normal table stays directly beneath the question while the solution is hidden'],
  ['slider', 'drag sliders preserve mathematical meanings and synchronize typed companions, presets and links'],
  ['basic', 'inputs, presets, resetting, hidden answers, copying, filters and keyboard tabs work'],
  ['catalog', 'all 14 engines, every preset, seeded random conditions and 253 catalog records render'],
  ['network', 'catalog network failure leaves the experiment engines usable'],
  ['hash', 'shared links restore decimal numbers, select strings and boolean checkboxes'],
  ['malformed', 'malformed links and prototype keys cannot stop app initialization'],
]) {
  test(name, () => {
    const result = spawnSync(process.execPath, [runner, scenario], {
      // The full catalog visits every preset and 140 random conditions.
      encoding: 'utf8', timeout: scenario === 'catalog' ? 60000 : 20000, maxBuffer: 1024 * 1024,
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, `${scenario}: ${result.stderr || result.stdout}`);
    assert.match(result.stdout, /PASS/);
  });
}
