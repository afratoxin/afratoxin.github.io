import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CBL_PAST_QUESTIONS as BANK,CBL_PAST_TOPICS} from './cbl-past-bank.mjs';
import {DOCUMENTS} from './study-bank.mjs';
import {startContinuousSession,resumeContinuousSession} from './continuous-queue.mjs';
import {grade,tabFromHash} from './logic.mjs';
import {sourcePages} from './practice-layout.mjs';

const expected={1:{2025:[40,63,68,84,90],2023:[42,66,99],2022:[56,60,62,87],2021:[68,72,73],2020:[46,47,95]},2:{2025:[29,65],2023:[5],2022:[37],2020:[64]},3:{2025:[23],2023:[14],2020:[67]},4:{2025:[39,64,66,88,93],2023:[19,90],2022:[2,22,46,53],2021:[6,7,75,76],2020:[13,70,72]},5:{2025:[36,82],2023:[100],2022:[28,73],2021:[78,80],2020:[65,76,77,78]}};
test('archive includes every available canonical CBL1–5 question and separately labels the handout TBL extra',()=>{
 assert.equal(Object.keys(CBL_PAST_TOPICS).length,6);
 const canonical=BANK.filter(q=>!String(q.examPaper).includes('TBL'));
 assert.equal(canonical.length,55);assert.equal(BANK.length,56);
 for(const [part,years] of Object.entries(expected))for(const [year,numbers] of Object.entries(years)){
  const actual=canonical.filter(q=>q.topic===`cbl-past-${part}`&&q.year===Number(year)).map(q=>q.number).sort((a,b)=>a-b);
  assert.deepEqual(actual,numbers,`CBL${part} ${year}`);
 }
 const extra=BANK.filter(q=>String(q.examPaper).includes('TBL'));
 assert.equal(extra.length,1);assert.match(extra[0].examPaper,/TBL\s*2/);assert.equal(extra[0].year,2021);assert.equal(extra[0].number,6);
 assert.ok(CBL_PAST_TOPICS['cbl-past-6'].emptyEvidence);assert.equal(BANK.filter(q=>q.topic==='cbl-past-6').length,0);
});
test('every original has a checked OCR, question-level captures, detailed choices and real lecture evidence',()=>{
 assert.equal(new Set(BANK.map(q=>q.id)).size,BANK.length);
 for(const q of BANK){
  assert.equal(q.preserveChoiceOrder,true,q.id);assert.equal(q.choices.length,5,q.id);assert.equal(new Set(q.choices).size,5,q.id);
  assert.equal(q.original.ocrChecked,true,q.id);assert.ok(q.original.ocrText.length>50,q.id);assert.ok(q.original.ocrRaw.trim(),q.id);
  assert.ok(q.original.captures.length,q.id);assert.ok(q.explanation.length>60,q.id);assert.equal(q.choiceNotes.length,5,q.id);
  assert.ok(q.choiceNotes.every(n=>n.length>=20),q.id);assert.ok(q.takeaways.length>=2,q.id);
  for(const c of [...q.original.captures,...(q.choiceImages||[])]){
   assert.match(c.src,/^assets\/cbl-past\/[a-z0-9._-]+\.(webp|png)$/);assert.ok(c.width>0&&c.height>0,q.id);
   assert.ok(fs.existsSync(new URL(c.src,import.meta.url)),c.src);
  }
  assert.ok(q.sourceRefs.length,q.id);for(const r of q.sourceRefs){assert.ok(DOCUMENTS[r.doc],q.id);assert.ok(r.pages.every(p=>p>=1&&p<=DOCUMENTS[r.doc].pages),q.id);}
  const sourceCount=new Set(q.sourceRefs.flatMap(r=>r.pages.map(p=>r.doc+':'+p))).size;
  assert.equal(sourcePages(q).length,sourceCount,q.id+' missing lecture capture');
 }
});
test('all-credit ruling and image-only original choices retain the original meaning',()=>{
 const all=BANK.find(q=>q.topic==='cbl-past-4'&&q.year===2025&&q.number===64);
 assert.equal(all.answerPolicy,'all-credit');assert.deepEqual(all.acceptedAnswers,[0,1,2,3,4]);
 const s=startContinuousSession([all],{topic:all.topic},{},()=>0.2);
 assert.equal(grade(s,{},0,4,[all]).correct,true);
 const image=BANK.find(q=>q.topic==='cbl-past-4'&&q.year===2020&&q.number===70);
 assert.equal(image.choiceImages.length,5);
});
test('original quiz has a hub entry, protected common keyboard handler and a durable whole-range queue',()=>{
 assert.equal(tabFromHash('#cblpast'),'cblpast');
 const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
 assert.match(html,/id="homeOriginalUnits"/);assert.match(html,/id="panel-cblpast"/);
 const nav=html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/)[0];assert.doesNotMatch(nav,/cblpast/);
 const keyboard=fs.readFileSync(new URL('./quiz-keyboard.mjs',import.meta.url),'utf8');assert.match(keyboard,/#cblpast-question/);
 const chosen=BANK.filter(q=>q.topic==='cbl-past-1'),progress={[chosen[0].id]:{correct:false}};
 const s=startContinuousSession(chosen,{topic:'cbl-past-1',count:10},progress,()=>0.2);
 assert.equal(s.scopeSize,18);assert.equal(s.items.length,17);assert.equal(s.phase,'unanswered');
 const restored=resumeContinuousSession(JSON.stringify(s),chosen,progress,()=>0.9);assert.deepEqual(restored.items[0].choices,chosen.find(q=>q.id===restored.items[0].id).choices);
});
