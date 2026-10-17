import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createTestDocument} from './test-dom.mjs';
import {createStudyStore} from './study-records.mjs';
import {studyStore} from './study-records.mjs?v=20261015-review1';
import {registerLectureStudies} from './study-catalog.mjs?v=20261017-hist1';
const data=await import('./histamine21-data.mjs?v=20261017-hist1').catch(()=>({}));
const ui=await import('./histamine21-quiz.mjs?v=20261017-hist1').catch(()=>({}));

test('21강: 25개 핵심 주제의 50문항은 5지선다 단일정답과 전 선지 근거를 갖는다',()=>{
 assert.ok(data.HIST_QUESTIONS);assert.equal(data.HIST_QUESTIONS.length,50);
 assert.equal(new Set(data.HIST_QUESTIONS.map(q=>q.id)).size,50);
 for(const q of data.HIST_QUESTIONS){
  assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);
  assert.equal(q.statements.filter(s=>s.valid).length,q.polarity==='correct'?1:4);
  assert.equal(q.statements.find(s=>s.text===q.answer).valid,q.polarity==='correct');
  assert.ok(q.source.includes('21강'));assert.ok(q.source.includes('쪽'));assert.ok(q.exam);
  for(const option of q.options)assert.equal(q.details.filter(d=>d.startsWith(option+':')).length,1);
 }
 assert.equal(data.HIST_QUESTIONS.filter(q=>q.polarity==='incorrect').length,25);
 assert.ok(data.HIST_CASES.filter(c=>c.clinical).length>=5);
 assert.ok(data.HIST_CASES.filter(c=>c.exam.startsWith('족보')).length>=16);
});

test('드래그는 두 이미지의 약물 11개·12개에 한정하고 성분명만 제시한다',()=>{
 assert.ok(data.HIST_H1_CARDS);assert.ok(data.HIST_ACID_CARDS);
 const map=rows=>Object.fromEntries(rows.map(d=>[d.name,d.categories[0]]));
 assert.deepEqual(map(data.HIST_H1_CARDS),{
  Diphenhydramine:'1세대 H1 차단제',Chlorpheniramine:'1세대 H1 차단제',Hydroxyzine:'1세대 H1 차단제',Promethazine:'1세대 H1 차단제',Doxylamine:'1세대 H1 차단제',
  Cetirizine:'2세대 H1 차단제',Levocetirizine:'2세대 H1 차단제',Loratadine:'2세대 H1 차단제',Desloratadine:'2세대 H1 차단제',Fexofenadine:'2세대 H1 차단제',Rupatadine:'2세대 H1 차단제'
 });
 assert.deepEqual(map(data.HIST_ACID_CARDS),{
  Ranitidine:'H2 차단제',Famotidine:'H2 차단제',Cimetidine:'H2 차단제',Nizatidine:'H2 차단제',Lafutidine:'H2 차단제',
  Omeprazole:'PPI',Esomeprazole:'PPI',Lansoprazole:'PPI',Pantoprazole:'PPI',Tegoprazan:'P-CAB',Fexuprazan:'P-CAB',Vonoprazan:'P-CAB'
 });
 assert.match(data.HIST_ACID_CARDS.find(d=>d.name==='Ranitidine').note,/과거|역사|강의/);
 for(const d of [...data.HIST_H1_CARDS,...data.HIST_ACID_CARDS]){assert.ok(d.note.length>10);assert.ok(d.source);assert.ok(!d.name.includes('('));}
});

test('1000회 추출은 전체 문항을 균등하게 순환하고 정답 위치를 섞는다',()=>{
 assert.equal(typeof data.pickHistamineQuestion,'function');
 let seed=21;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
 const state={seen:{},recent:[],subjects:[]},positions=new Set();
 for(let i=0;i<1000;i++){
  const q=data.pickHistamineQuestion(state,'all','all',random);assert.ok(!state.subjects.includes(q.subject));
  if(state.lastPolarity)assert.notEqual(q.polarity,state.lastPolarity);
  assert.equal(q.choices[q.answerIndex].text,q.answer);positions.add(q.answerIndex);
  state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,4);state.subjects=[q.subject,...state.subjects].slice(0,3);state.lastPolarity=q.polarity;
 }
 assert.equal(Object.keys(state.seen).length,50);assert.equal(positions.size,5);
 assert.ok(Math.max(...Object.values(state.seen))-Math.min(...Object.values(state.seen))<=2);
 assert.equal(data.pickHistamineQuestion(state,'incorrect','all',random).polarity,'incorrect');
 const clinical=data.pickHistamineQuestion(state,'all','clinical',random);
 assert.ok(data.HIST_CASES.find(c=>c.id===clinical.subject).clinical);
});

test('히스타민 전체 문항과 두 보드가 공통 오답·진도에 등록된다',()=>{
 const s=createStudyStore({getItem(){},setItem(){}});registerLectureStudies(s);
 for(const [id,total,type]of [['histamine',50,'quiz'],['histamine-h1',11,'match'],['histamine-acid',12,'match']]){
  const d=s.definitions.get(id);assert.ok(d,id);assert.equal(d.items.size,total);assert.equal(d.type,type);assert.equal(d.route,'histamine');
 }
 const q=data.HIST_QUESTIONS[0];s.record('histamine',q,false);assert.equal(s.wrong('histamine').length,1);s.record('histamine',q,true);assert.equal(s.wrong('histamine').length,0);assert.equal(s.counts('histamine').total,50);
});

test('실제 화면은 채점·전 선지 해설·탭·키보드와 부분 배치·오답 재분류를 처리한다',async()=>{
 assert.equal(typeof ui.initHistamineQuiz,'function');
 const html=await readFile(new URL('index.html',import.meta.url),'utf8'),doc=createTestDocument(html),disk=new Map();
 globalThis.document=doc;globalThis.CSS={escape:x=>x};globalThis.localStorage={getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)};registerLectureStudies();
 const el=id=>doc.getElementById(id);el('histamineView').hidden=false;const quiz=ui.initHistamineQuiz();quiz.open();
 assert.equal(el('histChoices').children.length,5);assert.equal(studyStore.counts('histamine').solved,0);el('histSkip').click();assert.equal(studyStore.counts('histamine').solved,0);
 const q=data.HIST_QUESTIONS.find(q=>q.stem===el('histStem').textContent),choices=el('histChoices').children.map(b=>b.children[1].textContent);
 el('histChoices').children[choices.findIndex(c=>c!==q.answer)].click();assert.equal(studyStore.counts('histamine').wrong,1);assert.equal(el('histFeedback').querySelectorAll('li').length,5);
 assert.deepEqual(studyStore.wrong('histamine')[0].question.choices,choices);el('histChoices').children[0].click();assert.equal(studyStore.counts('histamine').solved,1);
 assert.ok(!doc.dispatch('keydown',{key:'Enter',target:doc.createElement('button')}).defaultPrevented);
 doc.dispatch('keydown',{key:'Enter',target:doc.createElement('div')});assert.ok(el('histFeedback').hidden);
 for(const [kind,scope,rows]of [['H1','histamine-h1',data.HIST_H1_CARDS],['Acid','histamine-acid',data.HIST_ACID_CARDS]]){
  el('hist'+kind+'Tab').click();const p='hist'+kind;assert.equal(el(p+'Cards').children.length,rows.length);
  const card=el(p+'Cards').children[0],item=rows.find(d=>d.name===card.textContent),bad=el(p+'Zones').children.find(z=>!item.categories.includes(z.dataset.category));
  card.click();bad.click();el(p+'Check').click();assert.equal(studyStore.counts(scope).solved,1);assert.equal(studyStore.counts(scope).wrong,1);
  el(p+'Pool').querySelector('.match-wrong-toggle').click();assert.equal(el(p+'Cards').children.length,1);
  assert.equal(el(p+'Zones').children.length,kind==='H1'?2:3);
  el(p+'Cards').children[0].click();el(p+'Zones').children.find(z=>item.categories.includes(z.dataset.category)).click();el(p+'Check').click();assert.equal(studyStore.counts(scope).wrong,0);
  doc.dispatch('keydown',{key:'1',target:doc.createElement('div')});assert.equal(studyStore.counts('histamine').solved,1);
 }
 el('histQuizTab').click();el('histamineView').hidden=true;doc.dispatch('keydown',{key:'1',target:doc.createElement('div')});assert.equal(studyStore.counts('histamine').solved,1);
 const app=await readFile(new URL('app.mjs',import.meta.url),'utf8');assert.ok(doc.querySelector('.hub-card[data-open="histamine"]'));assert.match(app,/if\(view==='histamine'\)histamine.open\(\)/);
});
