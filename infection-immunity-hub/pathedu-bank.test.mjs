import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('the library adds one sourced in-scope question for each of the 26 selected slides',async()=>{
 assert.ok(fs.existsSync(new URL('./pathedu-bank.mjs',import.meta.url)),'library bank missing');
 const {PATHEDU_QUESTIONS:questions,PATHEDU_PHOTOS:photos}=await import('./pathedu-bank.mjs');
 assert.equal(questions.length,26);assert.equal(new Set(questions.map(q=>q.id)).size,26);
 assert.equal(Object.keys(photos).length,26);
 assert.deepEqual([...new Set(questions.flatMap(q=>q.photos).filter(id=>id.startsWith('edu-')))].toSorted(),Object.keys(photos).toSorted());
 const excluded=/원충|기생충|절지|Entamoeba|Trichomonas|Paragonimus|Taenia|Demodex|Sarcoptes|낭미충|옴진드기|아메바|classFileKey/i;
 assert.ok(!excluded.test(JSON.stringify({questions,photos})),'excluded content or private access key');
 for(const q of questions){
  assert.equal(q.topic,'path-image');assert.equal(q.format,'mcq');assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5);
  assert.ok(q.choices.every(c=>c.length<=60));assert.ok(q.answer>=0&&q.answer<5);assert.equal(q.choiceNotes.length,5);assert.ok(q.choiceNotes.every(Boolean));
  assert.ok(q.explanation&&q.keyClue);assert.ok(q.sourceRefs.length);
  for(const ref of q.sourceRefs)assert.ok(['path1','path2','lab'].includes(ref.doc)&&ref.pages.every(p=>Number.isInteger(p)&&p>=1&&p<={path1:37,path2:66,lab:71}[ref.doc]));
  assert.ok(q.externalRefs.some(r=>r.url==='https://pathedu.snu.ac.kr/library'));
  if(q.ask==='correct'){
   assert.equal(q.choiceEvidence.length,5);assert.equal(q.choiceEvidence.filter(e=>e.shownIsTrue).length,1);
   for(const [i,e] of q.choiceEvidence.entries()){assert.equal(q.choices[i],e.shownIsTrue?e.trueStatement:e.falseStatement);assert.equal(q.choiceNotes[i],e.trueStatement);}
  }else assert.equal(q.ask,'organism');
  const photo=photos[q.photos[0]];assert.match(photo.src,/^assets\/pathology\/edu-\d{2}\.webp$/);assert.equal(photo.sourceUrl,'https://pathedu.snu.ac.kr/library');
  assert.ok(!photo.alt.includes(q.choices[q.answer]),q.id+' alt answer leak');
 }
 assert.ok(questions.find(q=>q.id==='path-edu-26').externalRefs.some(r=>r.url.startsWith('https://wwwn.cdc.gov/phil/')));
});


test('library statement distractors stay within the same tissue, stain or fungal comparison',async()=>{
 const {PATHEDU_QUESTIONS:questions}=await import('./pathedu-bank.mjs');
 const choices=questions.filter(q=>q.ask==='correct').flatMap(q=>q.choiceEvidence.map(e=>e.falseStatement));
 const unrelated=/대조표본 크기|항균 감수성으로 해석|바이러스 혈청형|바이러스 유전형|결핵성 건락괴사를 형성|표피 컵 모양|표피 각질층|푸른 효모|호산구 안에 다수 효모|신경절 잠복과 재활성화/;
 for(const choice of choices)assert.doesNotMatch(choice,unrelated);
 const byId=Object.fromEntries(questions.map(q=>[q.id,q]));
 for(const id of ['path-edu-17','path-edu-25'])assert.ok(byId[id].choiceEvidence.every(e=>!e.falseStatement.includes('항산성 세균으로 분류')));
 assert.equal(byId['path-edu-25'].choiceEvidence.find(e=>e.trueStatement==='거품성 물질은 폐포 공간에 모인다.').falseStatement,'거품성 물질은 폐포 중격에 모인다.');
});


test('CMV compartment foil names the classic owl-eye inclusion and NTM excludes leprosy',async()=>{
 const {PATHEDU_QUESTIONS:questions}=await import('./pathedu-bank.mjs');
 const cmv=questions.find(q=>q.id==='path-edu-04');
 const pair=cmv.choiceEvidence.find(e=>e.trueStatement.includes('owl'));
 assert.ok(pair,'generic CMV cytoplasmic inclusions must not be marked false');
 assert.match(pair.trueStatement,/핵 내/);assert.match(pair.falseStatement,/세포질/);
 assert.match(pair.falseStatement,/owl/);assert.equal(cmv.answer,1);
 const ntm=questions.find(q=>q.id==='path-edu-08');
 assert.match(ntm.stem,/M\. leprae/);assert.match(ntm.stem,/제외|속하지/);
 assert.match(ntm.explanation,/M\. leprae/);
 assert.ok(ntm.externalRefs.some(r=>r.url==='https://www.cdc.gov/nontuberculous-mycobacteria/about/index.html'));
});
