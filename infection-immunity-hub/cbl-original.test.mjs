import test from 'node:test';
import assert from 'node:assert/strict';
import {originalPrompt,originalFeedback,originalEmpty,originalChoiceImage} from './cbl-original.mjs';

const q={id:'lecture-cbl-past-fixture',year:2025,number:1,examPaper:'1차',stem:'원문 <문제>',choices:['A','B','C','D','E'],answer:2,explanation:'SECRET detailed rationale',choiceNotes:['A 이유','B 이유','C 이유','D 이유','E 이유'],keyClue:'SECRET clue',takeaways:['SECRET takeaway'],original:{pages:[84],captures:[{src:'assets/cbl-past/cbl3-2025-001-1.webp',width:900,height:1100,page:84}],ocrText:'원문 <문제>\n① A\n② B',ocrRaw:'RAW <OCR>',ocrChecked:true}};
test('original prompt shows the actual capture and proofread OCR without revealing feedback',()=>{
 const html=originalPrompt(q);
 assert.match(html,/assets\/cbl-past\/cbl3-2025-001-1.webp/);assert.match(html,/OCR/);
 assert.match(html,/원문 &lt;문제&gt;/);assert.doesNotMatch(html,/SECRET|정답 · C/);
 assert.match(html,/data-original-open/);assert.match(html,/84/);
});
test('original feedback distinguishes the official key and detailed notes from an all-credit ruling',()=>{
 const html=originalFeedback(q,false);
 for(const note of q.choiceNotes)assert.ok(html.includes(note));
 assert.match(html,/SECRET detailed rationale/);assert.match(html,/SECRET takeaway/);assert.match(html,/3번/);
 const all=originalFeedback({...q,answerPolicy:'all-credit',acceptedAnswers:[0,1,2,3,4],answerNote:'족보 전원정답 처리'},true);
 assert.match(all,/전원정답/);assert.doesNotMatch(all,/정답 · 3번/);
});
test('reading the original solution can use neutral feedback without claiming a graded result',()=>{
 const html=originalFeedback(q,null);
 assert.match(html,/정답·상세 해설/);assert.doesNotMatch(html,/정답입니다|오답/);
});
test('an empty section explains source coverage and shows absence proof without inventing a question',()=>{
 const html=originalEmpty({message:'2019~2023 출제 없음',captures:q.original.captures,ocrText:'해당 강의에서는 문제가 출제되지 않았습니다.'});
 assert.match(html,/출제 없음/);assert.match(html,/data-original-open/);assert.doesNotMatch(html,/data-study-answer/);
});
test('image-only original options keep a neutral figure aligned with the original number',()=>{
 const images={...q,choiceImages:[{src:'assets/cbl-past/cbl4-2020-070-choice-1.webp',width:400,height:300,alt:'SECRET diagnosis'}]};
 assert.match(originalChoiceImage(images,0),/원문 1번 선지 그림/);
 assert.doesNotMatch(originalChoiceImage(images,0),/SECRET/);
 assert.equal(originalChoiceImage(images,1),'');
});
