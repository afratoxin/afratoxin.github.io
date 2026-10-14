import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('./app.mjs',import.meta.url),'utf8');
test('약동학 계산 메뉴와 탭, 직접 주소, 기존 단원 메뉴 연결',()=>{
  for(const id of ['pkView','pkQuizTab','pkFormulaTab','pkQuizPanel','pkFormulaPanel','pkTopic','pkProgress','pkStem','pkChoices','pkVisual','pkFeedback','pkNext','pkHintButton','pkHint','pkStats','pkSource','pkFormulaRows'])assert.ok(html.includes(`id="${id}"`),id);
  assert.ok(html.includes('data-open="pk"'));
  assert.match(app,/import \{initPkQuiz\} from/);
  assert.match(app,/if\(view==='pk'\)pk.open\(\)/);
  assert.match(app,/\[[^\]]*'pk'[^\]]*\]\.includes\(location\.hash\.slice\(1\)\)/);
  for(const name of ['cyp','tx','ans','chol','chol11','adr12','adr13','mixed'])assert.ok(html.includes(`data-open="${name}"`),name);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(new Set(ids).size,ids.length,'DOM ID 중복');
});
