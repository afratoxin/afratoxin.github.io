import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const api=await import('../authoring.mjs').catch(()=>({}));
export const taxonomy=[{axis:'domain',label:'법률'},{axis:'type',label:'규칙·사례 적용'},{axis:'logic',label:'수식 계산'}];
export const draft=()=>({schemaVersion:1,title:'신고 시점과 지원금 산정',passage:'어떤 시는 사업 참여자에게 기본 지원금 100만 원을 지급한다. 안전교육을 이수하면 20만 원을 더하고, 신청일에 미납금이 있으면 교육 가산 후 금액에서 25%를 뺀다. 그 뒤 기한 내 신청자에게 10만 원을 더한다. 세 규칙은 이 순서대로 한 번씩 적용하며 그 밖의 가감은 없다. 갑은 안전교육을 이수했고 신청일에 미납금이 있었으며 기한 내 신청했다.',question:'위 규칙에 따라 갑에게 지급할 지원금은?',choices:['80만 원','85만 원','90만 원','100만 원','110만 원'],answer:4,solution:'교육 가산 후120만 원, 미납 감액 후90만 원, 기한 가산 후100만 원이다.',steps:['100+20=120','120×0.75=90','90+10=100'],optionAnalyses:[1,2,3,4,5].map(number=>({number,isAnswer:number===4,reason:['교육 가산을 누락한 계산과도 일치하지 않는다.','기한 가산 뒤 감액하면97.5가 되므로 이 값도 아니다.','미납 감액 후 기한 가산10만 원을 누락했다.','120만 원에서25% 감액한90만 원에10만 원을 더한다.','미납 감액을 실제보다 적게 적용한 값이며 규칙에 맞지 않는다.'][number-1]})),classifications:[{axis:'domain',label:'법률',reason:'명시된 지원 규칙을 사례에 적용한다.'},{axis:'type',label:'규칙·사례 적용',reason:'갑의 조건을 세 규칙에 대입한다.'},{axis:'logic',label:'수식 계산',reason:'가산·비율 감액의 순서를 계산한다.'}],review:api.REVIEW_CRITERIA?.map(({id})=>({criterion:id,status:'pass',evidence:'각 조건과 계산을 지문·선택지와 대조했다.'}))||['answerUniqueness','sufficiency','optionValidity','originality','classification'].map(criterion=>({criterion,status:'pass',evidence:'검토 근거'}))});

test('creation prompt preserves unseen brief and complete source evidence, not only correct explanation',()=>{
 const q={id:'1022',title:'기출',sourceText:'원문 끝까지 보존',sourceOptions:[1,2,3,4,5].map(number=>({number,text:'선택지'+number})),options:[1,2,3,4,5].map(number=>({number,explanation:'해설 꼬리'+number})),steps:['등급 가감 적용'],pitfalls:['반수 경계 오류'],domains:['법률'],types:['규칙·사례 적용'],logic:['수식 계산'],summary:'사례에서 규칙 도출',answer:4};
 const prompt=api.buildCreationPrompt({brief:'기한의 경계와 반사실적 규칙을 결합하고 싶다',designNotes:'경계 조건을 바꾸고 순서를 비교',questions:[q],taxonomy});
 for(const s of ['기한의 경계와 반사실적','원문 끝까지 보존','해설 꼬리1','해설 꼬리5','반수 경계 오류','answerUniqueness','classifications','독립적으로','경계 조건을 바꾸고 순서를 비교'])assert.ok(prompt.includes(s),s);
 assert.throws(()=>api.buildCreationPrompt({brief:'의도',questions:[],taxonomy}),/기출/);
 assert.throws(()=>api.buildCreationPrompt({brief:'의도',questions:Array(6).fill(q),taxonomy}),/5/);
});
test('draft roundtrip accepts one fenced JSON response and does not execute markup',()=>{
 const value=draft(); value.title='<img src=x onerror=alert(1)>';
 const parsed=api.parseDraft('```json\n'+JSON.stringify(value)+'\n```',taxonomy);
 assert.equal(parsed.title,value.title);assert.equal(parsed.answer,4);assert.equal(api.inspectDraft(parsed).every(x=>x.ok),true);
 assert.match(api.draftMarkdown(parsed),/④/);
});
test('numbered ChatGPT choices display only one choice marker without altering inner references',()=>{
 const value=draft();value.choices=value.choices.map((v,i)=>`${['①','②','③','④','⑤'][i]} ${v}`);value.choices[0]+=' (②와 비교)';const parsed=api.parseDraft(JSON.stringify(value),taxonomy);assert.equal(parsed.choices[0],'80만 원 (②와 비교)');
});
test('draft rejects incomplete, duplicate or contradictory choices and answer explanations',()=>{
 for(const mutate of [v=>v.choices.pop(),v=>v.choices[1]=v.choices[0],v=>v.answer=6,v=>v.optionAnalyses[0].isAnswer=true,v=>v.optionAnalyses[1].number=1,v=>v.optionAnalyses[4].reason='',v=>v.passage='']){
  const value=draft();mutate(value);assert.throws(()=>api.parseDraft(JSON.stringify(value),taxonomy));
 }
});
test('draft needs supported classifications and all five honest review records',()=>{
 const value=draft();value.classifications[0].label='미등록 대범주';assert.throws(()=>api.parseDraft(JSON.stringify(value),taxonomy),/분류/);
 value.classifications=draft().classifications;value.review.pop();assert.throws(()=>api.parseDraft(JSON.stringify(value),taxonomy),/검토/);
 value.review=draft().review;value.review[0].status='verified';assert.throws(()=>api.parseDraft(JSON.stringify(value),taxonomy),/검토/);
 value.review=draft().review;value.review[0].status='uncertain';assert.equal(api.parseDraft(JSON.stringify(value),taxonomy).review[0].status,'uncertain');
});
test('project import roundtrips work and rejects unknown references or malformed project before mutation',()=>{
 const project={schemaVersion:1,kind:'leet-authoring-project',brief:'새 문항 의도',designNotes:'참고할 논리',referenceIds:['1022'],draft:draft(),humanReview:{answerUniqueness:true}};
 const restored=api.parseProject(JSON.stringify(project),taxonomy,new Set(['1022']));
 assert.equal(restored.humanReview.answerUniqueness,true);assert.equal(restored.draft.title,project.draft.title);
 project.referenceIds=['9999'];assert.throws(()=>api.parseProject(JSON.stringify(project),taxonomy,new Set(['1022'])),/기출/);
 assert.throws(()=>api.parseProject('{',taxonomy,new Set()));
});
test('a changed draft invalidates every manual review confirmation',()=>{
 const project={draft:draft(),humanReview:{answerUniqueness:true,sufficiency:true}};
 const next=draft();next.passage+=' 추가 조건.';
 const changed=api.withDraft(project,next);assert.deepEqual(changed.humanReview,{});assert.notEqual(changed.draft,project.draft);
});
test('accepted Korean draft size leaves room for an exportable project under the file limit',()=>{
 const large=draft();for(const key of ['title','passage','question','solution'])large[key]='가'.repeat(50000);
 assert.throws(()=>api.parseDraft(JSON.stringify(large),taxonomy),/500KB/);
});
test('real archive source packets preserve all selected options and tail evidence',async()=>{
 const archive=JSON.parse(await readFile(new URL('../data/archive.json',import.meta.url),'utf8'));
 const questions=archive.questions.filter(q=>['1022','1807'].includes(q.id));
 const prompt=api.buildCreationPrompt({brief:'지원금과 기간 경계를 결합한 새 규칙 문항',questions,taxonomy:archive.taxonomy});
 for(const q of questions)for(const o of q.options)assert.ok(prompt.includes(o.explanation),q.id+':'+o.number);
 assert.ok(prompt.includes(questions[0].sourceText.trim()));
});
