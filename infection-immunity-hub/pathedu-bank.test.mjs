import test from 'node:test';
import assert from 'node:assert/strict';
import {PATHEDU_QUESTIONS as questions,PATHEDU_PHOTOS as photos} from './pathedu-bank.mjs';

const slugs=['hpv','hsv','cmv','molluscum','bk','tb','mac','leprae','actinomyces','aspergillus','mucorales','candida','cryptococcus','pneumocystis'];

test('PathEdu becomes fourteen distinct photo-to-organism questions rather than a slide quota',()=>{
 assert.equal(questions.length,14);
 assert.deepEqual(questions.map(q=>q.id),slugs.map(slug=>'path-edu-v2-'+slug));
 assert.equal(new Set(questions.map(q=>q.choices[q.answer])).size,14);
 for(const q of questions){
  assert.equal(q.ask,'organism');assert.equal(q.topic,'path-image');assert.equal(q.format,'mcq');assert.equal(q.kind,'integrated');
  assert.ok(q.stem.length<=115,q.id+': '+q.stem.length);
  assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5);
  assert.ok(q.choices.every(c=>c.length<=45));assert.ok(q.answer>=0&&q.answer<5);
  assert.equal(q.choiceNotes.length,5);assert.ok(q.choiceNotes.every(note=>note.length>=12));
  for(const field of ['imageClue','coreFact','contrast','explanation','keyClue'])assert.ok(q[field]?.trim(),q.id+' '+field);
  assert.ok(q.photos.length>=1);assert.ok(q.photos.every(id=>/^(edu-\d{2}(?:-detail)?|p\d{2})$/.test(id)));
  assert.ok(q.photos.some(id=>id.startsWith('edu-'))||q.id==='path-edu-v2-candida');
  for(const id of q.photos.filter(id=>id.startsWith('edu-')))assert.ok(photos[id],id);
  assert.ok(q.sourceRefs.length);assert.ok(q.externalRefs.some(ref=>ref.url==='https://pathedu.snu.ac.kr/library'));
  for(const ref of q.sourceRefs)assert.ok(['path1','path2','lab'].includes(ref.doc)&&ref.pages.every(p=>Number.isInteger(p)&&p>=1&&p<={path1:37,path2:66,lab:71}[ref.doc]));
 }
});

test('a short clinical prompt leaves the decisive morphology for the actual photo',()=>{
 const answerInPrompt=/보고되었다|기재되어|옳은 것은|옳지 않은|spherule|endospore|owl|koil|molluscum|다핵|봉입체|가성균사|격막|리본형|거품성|포말성|예각|둔각|건락|황과립|sulfur|clear halo|decoy/i;
 for(const q of questions)assert.doesNotMatch(q.stem,answerInPrompt,q.id);
 assert.ok(!questions.some(q=>q.photos.includes('edu-12')||q.photos.includes('edu-26')),'control and unresolved spherule photos are not patient evidence');
 assert.ok(!questions.some(q=>q.choiceEvidence),'generic true/false statements are removed');
});

test('close organism options respect what tissue morphology can and cannot identify',()=>{
 const byId=Object.fromEntries(questions.map(q=>[q.id.replace('path-edu-v2-',''),q]));
 assert.deepEqual(byId.mac.photos,['edu-08','edu-09']);
 assert.equal(byId.mac.choices[byId.mac.answer],'M. avium complex (MAC)');
 assert.match(byId.mac.stem,/HIV/);assert.match(byId.mac.stem,/림프절/);
 assert.match(byId.mac.explanation,/항산|AFB/);
 assert.equal(byId.candida.choices[byId.candida.answer],'Candida spp.');
 assert.equal(byId.aspergillus.choices[byId.aspergillus.answer],'Aspergillus spp.');
 assert.ok(!byId.bk.choices.some(choice=>/JC/.test(choice)),'BK and JC cannot be resolved by decoy-cell shape alone');
 assert.match(byId.mucorales.contrast,/격막|균사/);assert.match(byId.aspergillus.contrast,/Mucor|털곰팡이/);
 assert.match(byId.mucorales.stem,/장|맹장/);assert.doesNotMatch(byId.mucorales.stem,/비강|부비동/);
 assert.match(byId.pneumocystis.imageClue,/낭|컵|반달/);
});

test('the question bank retains only verified exam references and neutral source captions',()=>{
 const byId=Object.fromEntries(questions.map(q=>[q.id.replace('path-edu-v2-',''),q]));
 assert.deepEqual(byId.bk.examRefs,[]);assert.deepEqual(byId.cmv.examRefs,[]);assert.deepEqual(byId.hpv.examRefs,[]);
 assert.ok(byId.mac.examRefs.includes('2023 69번'));
 assert.ok(byId.leprae.examRefs.includes('2020 16번'));
 assert.ok(byId.actinomyces.examRefs.includes('2022 41번'));
 for(const q of questions){
  assert.ok(q.examRefs.every(ref=>/^20\d{2} \d+번$/.test(ref)));
  assert.doesNotMatch(JSON.stringify(q),/classFileKey|기생충|절지|Entamoeba|Trichomonas|Paragonimus|Demodex|Sarcoptes/);
 }
 for(const photo of Object.values(photos)){
  assert.equal(photo.sourceUrl,'https://pathedu.snu.ac.kr/library');
  assert.doesNotMatch(photo.caption,/decoy|Coccidio|Cryptococcus|Aspergillus|Candida|Mucor|Leprosy|HSV|HPV|CMV/i);
 }
});
