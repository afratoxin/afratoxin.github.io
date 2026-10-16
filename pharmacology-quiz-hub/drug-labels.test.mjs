import test from 'node:test';import assert from 'node:assert/strict';
import {IMM_DRUGS,IMM_QUESTIONS} from './immune-data.mjs';
const api=await import('./drug-labels.mjs').catch(()=>({}));
test('지정한 면역억제제는 성분명만 표시하고 문항의 약물명에도 힌트 괄호를 남기지 않는다',()=>{
 for(const [id,name]of Object.entries({filgrastim:'Filgrastim',sargramostim:'Sargramostim',etanercept:'Etanercept',infliximab:'Infliximab',adalimumab:'Adalimumab',alefacept:'Alefacept',abatacept:'Abatacept'}))assert.equal(IMM_DRUGS.find(x=>x.id===id).name,name);
 for(const q of IMM_QUESTIONS)for(const text of [q.stem,q.answer,...q.options])assert.doesNotMatch(text,/\(rhG-CSF\)|\(rhGM-CSF\)|Enbrel|Remicade|Humira|Alefacept \(LFA-3-Ig\)|Abatacept \(CTLA-4-Ig\)/);
});
test('이전 오답의 약물명도 정리하되 ID·숫자·정답 순서와 기전 설명은 유지한다',()=>{
 assert.equal(typeof api.cleanStudyDrugLabels,'function');const old={id:'kept',stem:'Filgrastim (rhG-CSF)의 표적은?',choices:['Abatacept (CTLA-4-Ig)','Alefacept (LFA-3-Ig)','Etanercept (Enbrel)','Infliximab (Remicade)','Adalimumab (Humira)'],answers:[2],note:'CTLA-4–Ig 융합단백질 · 100 mg',table:{rows:[[10,20]]}};
 const clean=api.cleanStudyDrugLabels(old);assert.equal(clean.stem,'Filgrastim의 표적은?');assert.deepEqual(clean.choices,['Abatacept','Alefacept','Etanercept','Infliximab','Adalimumab']);assert.deepEqual(clean.answers,[2]);assert.equal(clean.id,old.id);assert.equal(clean.note,old.note);assert.deepEqual(clean.table,old.table);assert.notEqual(clean,old);assert.match(old.choices[0],/CTLA/);
});
