import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
const bank=JSON.parse(await readFile(new URL('./bank.json',import.meta.url),'utf8'));
assert.equal(bank.lectures.length,9);
const ids=new Set,lectures=new Set(bank.lectures.map(l=>l.id)),stems=new Set,images=new Set;
for(const q of bank.questions){
 assert(!ids.has(q.id),`중복 ID: ${q.id}`);ids.add(q.id);
 assert(!stems.has(q.stem),`중복 발문: ${q.id}`);stems.add(q.stem);
 assert(lectures.has(q.lecture),q.id);
 assert.equal(q.choices.length,5,q.id);assert.equal(new Set(q.choices).size,5,q.id);
 assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<5,q.id);
 assert.equal(q.choiceNotes.length,5,q.id);assert(q.choiceNotes.every(x=>typeof x==='string'&&x.length>3),q.id);
 assert(['기본','중상','고난도'].includes(q.difficulty),q.id);
 assert(['족보 변형','강조점 응용'].includes(q.type),q.id);
 assert(q.stem&&q.explanation&&q.tags.length&&q.sourcePages.length,q.id);
 assert(q.lectureBasis&&typeof q.lectureBasis.summary==='string'&&q.lectureBasis.summary.length>=12,`강의록의 결정적 명시 근거 누락: ${q.id}`);
 assert(Array.isArray(q.lectureBasis.pages)&&q.lectureBasis.pages.length>0,`강의록 근거쪽수 누락: ${q.id}`);
 assert(q.lectureBasis.pages.every(p=>q.sourcePages.includes(p)),`판단 근거가 인용한 강의 페이지에 연결되지 않음: ${q.id}`);
 for(const p of q.sourcePages){assert(Number.isInteger(p)&&p>0&&p<=bank.documents[q.lecture].pages,q.id);images.add(`${q.lecture}/p${String(p).padStart(3,'0')}.webp`)}
 for(const r of q.examRefs){assert(Number.isInteger(r.page)&&r.page>0&&r.page<=bank.documents.exam.pages,q.id);assert(r.year&&r.number,q.id);images.add(`exam/p${String(r.page).padStart(3,'0')}.webp`)}
}
for(const l of bank.lectures){const qs=bank.questions.filter(q=>q.lecture===l.id);assert(qs.length>=20,l.title);assert(l.style&&l.professor&&l.focus.length,l.title);console.log(`${l.title}: ${qs.length}문항 · 족보 연결 ${qs.filter(q=>q.examRefs.length).length} · 고난도 ${qs.filter(q=>q.difficulty==='고난도').length}`)}
for(const path of images)assert((await stat(new URL(`./assets/sources/${path}`,import.meta.url))).size>1000,path);
assert.equal(bank.sourcePolicy?.id,'lecture-only-v1');
const review=JSON.parse(await readFile(new URL('./source-review.json',import.meta.url),'utf8'));
assert.equal(review.version,bank.version);
assert.equal(review.previousQuestionCount,225);
assert.equal(review.items.length,225);
assert.equal(new Set(review.items.map(x=>x.oldId)).size,225);
for(const item of review.items){
 assert(['keep','revise','replace','remove'].includes(item.action),item.oldId);
 assert(typeof item.reason==='string'&&item.reason.length>0,item.oldId);
 if(item.action!=='remove')assert(item.evidence?.length>0,item.oldId);
 if(item.action==='remove')assert(!ids.has(item.oldId),`제외 문항이 활성 은행에 남음: ${item.oldId}`);
}
console.log(`검증 완료: ${ids.size}문항, ${images.size}개 근거 이미지, 9개 강의`);
