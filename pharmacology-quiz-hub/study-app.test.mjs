import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
test('허브의 전체 오답 메뉴와 재풀이 화면이 제공된다',async()=>{
 const [html,app]=await Promise.all(['index.html','app.mjs'].map(f=>readFile(new URL(f,import.meta.url),'utf8')));
 assert.match(html,/id="mistakesView"/);assert.match(html,/data-open="mistakes"/);assert.match(html,/id="studyWrongMatchPanel"/);assert.match(app,/registerLectureStudies\(/);assert.match(app,/registerArchiveStudy\(/);
});

import {createTestDocument} from './test-dom.mjs';
test('실제 앱의 26개 객관식과 17개 드래그를 채점하고 오답 탭·진행률까지 연결한다',async()=>{
 const html=await readFile(new URL('index.html',import.meta.url),'utf8'),data=JSON.parse(await readFile(new URL('questions.json',import.meta.url),'utf8'));
 const doc=createTestDocument(html),disk=new Map();globalThis.document=doc;globalThis.window={scrollTo(){}};globalThis.location={hash:''};globalThis.CSS={escape:x=>x};globalThis.localStorage={getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)};globalThis.fetch=async()=>({ok:true,json:async()=>data});
 await import('./app.mjs');
 const {studyStore}=await import('./study-records.mjs?v=20261015-review1'),el=id=>doc.getElementById(id);
 assert.ok(!el('unitGroups').textContent.includes('불러오지 못했습니다'),el('unitGroups').textContent.slice(0,150));
 assert.equal(studyStore.definitions.size,43);
 const go=route=>{const b=doc.querySelector('.hub-card[data-open="'+route+'"]')||doc.querySelector('[data-open="'+route+'"]');assert.ok(b,route);b.click();};
 for(const [scope,route,prefix,tab]of [['cyp','cyp','cyp','cypProbeTab'],['ddi','cyp','cypDdi','cypDdiTab'],['tx','tx','tx','txQuizTab'],['ans','ans','ans','ansMainTab'],['ans-gpcr','ans','ans','ansGpcrTab'],['chol','chol','chol','cholQuizTab'],['chol11','chol11','chol11','chol11QuizTab'],['adr12','adr12','adr12','adr12QuizTab'],['adr13','adr13','adr13','adr13QuizTab'],['adr13-beta','adr13','adr13Beta','adr13BetaQuizTab'],['mixed','mixed','mixed',null],['pk','pk','pk','pkQuizTab'],['cns','cns','cns','cnsQuizTab'],['immune','immune','imm','immQuizTab'],['anticancer','anticancer','anti','antiQuizTab'],['signal','signal','sig','sigQuizTab'],['checkpoint32','checkpoint32','c32','c32QuizTab'],['immune-simple','immune','immSimple','immSimpleTab'],['anticancer-simple','anticancer','antiSimple','antiSimpleTab'],['signal-simple','signal','sigSimple','sigSimpleTab'],['abx-simple','abx','abxSimple','abxSimpleTab'],['abx','abx','abx','abxQuizTab'],['endocrine','endocrine','endocrine','endocrineQuizTab'],['renal','renal','renal','renalQuizTab'],['cardio','cardio','cardio','cardioQuizTab']]){
  go(route);if(tab)el(tab).click();assert.equal(el(prefix+'Choices').children.length,5,scope);
  // Every rendered answer must reach the shared latest-result ledger.
  for(let n=0;n<12&&!studyStore.wrong(scope).length;n++){el(prefix+'Choices').children[0].click();if(!studyStore.wrong(scope).length)el(prefix+'Next').click();}
  const wrong=studyStore.wrong(scope)[0];assert.ok(wrong,scope+' should have a tracked wrong answer');const stem=wrong.question.stem;
  const view=el(route+'View'),button=view.querySelector('.study-wrong-tab');assert.ok(button,scope);button.click();assert.equal(el('mistakesView').hidden,false);assert.equal(view.hidden,true);
  el('studyReviewScope').value=scope;el('studyReviewScope').dispatch('change');assert.equal(el('studyWrongStem').textContent,stem,scope+' exact retry');
  const correct=wrong.question.answers.map(i=>wrong.question.choices[i]);for(const b of el('studyWrongChoices').children)if(correct.includes(b.children[1].textContent))b.click();el('studyWrongCheck').click();assert.equal(studyStore.status(scope,wrong.id),'correct',scope);
  el('studyWrongNext').click();assert.equal(el('studyWrongCard').hidden,true);assert.ok(view.hidden,scope+' hidden source stays hidden');el('studyReviewBack').click();assert.equal(view.hidden,false);
  const entry=doc.querySelector('.hub-card[data-open="'+route+'"]');assert.ok(entry.classList.contains('study-progress-fill'),route);assert.match(entry.querySelector('.study-counts').textContent,/풀이/);
 }
 // Archive multi-select uses the same ledger and the original wrong menu stays in sync.
 go('menu');el('allUnit').click();const archive=studyStore.definitions.get('archive');
 for(let n=0;n<12&&!studyStore.wrong('archive').length;n++){el('choiceList').children[0].click();el('checkButton').click();if(!studyStore.wrong('archive').length)el('nextButton').click();}
 assert.ok(studyStore.wrong('archive').length);el('backButton').click();assert.equal(el('wrongUnit').disabled,false);
 el('menuView').querySelector('.study-wrong-tab').click();el('studyReviewScope').value='archive';el('studyReviewScope').dispatch('change');
 const a=studyStore.wrong('archive')[0];for(const b of el('studyWrongChoices').children)if(a.question.answers.map(i=>a.question.choices[i]).includes(b.children[1].textContent))b.click();el('studyWrongCheck').click();el('studyReviewBack').click();assert.equal(el('wrongUnit').disabled,true);
 for(const [scope,route,tab,prefix,kind]of [['cyp-match','drag',null,'drag'],['tx-match','tx','txDragTab','tx'],['ans-match','ans','ansDragTab','ans'],['chol-match','chol','cholDragTab','chol'],['chol11-match','chol11','chol11DragTab','chol11'],['adr12-match','adr12','adr12DragTab','adr12'],['adr13-match','adr13','adr13DragTab','adr13'],['adr13-beta-match','adr13','adr13BetaDragTab','adr13Beta'],['cns-structure','cns','cnsStructureTab','cnsStructure'],['cns-effect','cns','cnsEffectTab','cnsEffect'],['cns-disease','cns','cnsDiseaseTab','cnsDisease'],['immune-match','immune','immDragTab','imm'],['anti-target','anticancer','antiDragTab','anti','target'],['anti-toxicity','anticancer','antiDragTab','anti','toxicity'],['signal-target','signal','sigDragTab','sig'],['checkpoint32-target','checkpoint32','c32TargetTab','c32Target'],['checkpoint32-car','checkpoint32','c32CarTab','c32Car']]){
  go(route);if(tab)el(tab).click();if(kind){el('antiMatchKind').value=kind;el('antiMatchKind').dispatch('change');}
  const cards=el(prefix==='drag'?'dragCards':prefix+'Cards'),zones=el(prefix==='drag'?'dropZones':prefix+'Zones'),pool=el(prefix==='drag'?'dragPool':prefix+'Pool'),check=el(prefix==='drag'?'dragCheck':prefix+'Check');
  assert.ok(cards.children.length,scope);const card=cards.children[0],def=studyStore.definitions.get(scope),item=[...def.items.values()].find(x=>x.name===card.textContent);assert.ok(item,scope+' card identity');
  const bad=zones.children.find(z=>!item.categories.includes(z.dataset.category));assert.ok(bad,scope+' wrong category');card.click();bad.click();check.click();assert.equal(studyStore.counts(scope).wrong,1,scope);assert.equal(studyStore.counts(scope).solved,1,scope+' ignores unplaced');if(scope==='cyp-match')assert.match(el('dragView').querySelector('.study-wrong-tab').textContent,/1$/);
  if(scope.startsWith('cns-')||scope==='immune-match'||scope.startsWith('anti-')||scope==='signal-target'||scope.startsWith('checkpoint32-')){
   el(route+'View').querySelector('.study-wrong-tab').click();assert.equal(el('studyWrongMatchPanel').hidden,false,'드래그 오답만 있으면 해당 탭을 연다');
   assert.equal(el('studyMatchScope').value,scope);el('studyCards').children[0].click();el('studyZones').children.find(z=>item.categories.includes(z.dataset.category)).click();el('studyCheck').click();el('studyReviewBack').click();
   assert.match(pool.querySelector('.study-board-summary').textContent,/정답 1/,'원래 보드의 진도 갱신');assert.match(pool.querySelector('.match-wrong-toggle').textContent,/0$/);
  }else{pool.querySelector('.match-wrong-toggle').click();assert.equal(cards.children.length,1);cards.children[0].click();zones.children.find(z=>item.categories.includes(z.dataset.category)).click();check.click();}
  assert.equal(studyStore.counts(scope).wrong,0,scope+' recovered');
 }
 assert.ok(disk.has('pharmacology-study-results-v1'));assert.equal(studyStore.wrong().length,0);
});
