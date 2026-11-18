import {STATEMENT_FACT_GROUPS as BASE_GROUPS,STATEMENT_LECTURE_TITLES as BASE_TITLES,STATEMENT_SOURCE_REVIEW as BASE_REVIEW} from './statement-facts.mjs?v=20261119c';
import {STATEMENT_FACT_GROUPS as NOV18_GROUPS,LECTURE_TITLES as NOV18_TITLES} from './nov18-bank.mjs?v=20261119c';
export const STATEMENT_FACT_GROUPS={...BASE_GROUPS,...NOV18_GROUPS};
const STATEMENT_LECTURE_TITLES={...BASE_TITLES,...NOV18_TITLES};
export const STATEMENT_SOURCE_REVIEW={...BASE_REVIEW,date:'2026-11-19',lectureCount:40,questionsAdded:Object.values(STATEMENT_FACT_GROUPS).flat().length,byLecture:{...BASE_REVIEW.byLecture,...Object.fromEntries(Object.entries(NOV18_GROUPS).map(([code,facts])=>[code,{count:facts.length,ankiCardsConsidered:{'261118_01':21,'261118_02':50,'261118_05':38}[code]}]))}};

// Comparison notes were authored for each false counterpart; do not call a shown true option a swapped falsehood.
const trueNote=why=>why.replace(/(?:바꿔 넣은|바꿔 놓은|바꾸어 놓은|끼워 넣은|바꾼|옮긴) 선지이다\./g,'구분해 기억한다.');

// Each fact is the sole false anchor once. Independent concepts provide the four true options.
export function buildStatementQuestions(groups,titles){
 return Object.entries(groups).flatMap(([lecture,facts])=>facts.map((anchor,index)=>{
  const rotated=Array.from({length:facts.length-1},(_,n)=>facts[(index+1+n)%facts.length]);
  const selected=[],axes=new Set([anchor.axis]);
  for(const fact of rotated)if(!axes.has(fact.axis)&&selected.length<4){selected.push(fact);axes.add(fact.axis);}
  for(const fact of rotated)if(selected.length<4&&!selected.includes(fact))selected.push(fact);
  if(selected.length!==4)throw new Error(`Insufficient independent statements: ${lecture}`);
  const evidence=selected.map(fact=>({fact,isTrue:true})),answer=index%5;
  evidence.splice(answer,0,{fact:anchor,isTrue:false});
  const choices=evidence.map(({fact,isTrue})=>isTrue?fact.truth:fact.falsehood);
  if(new Set(choices).size!==5)throw new Error(`Duplicate statement choices: ${anchor.id}`);
  return {
   id:anchor.id.replace('statement-fact-','lecture-statement-'),lecture,topic:lecture,format:'mcq',kind:'statement',questionType:'incorrect',
   stem:`${titles[lecture]}에 관한 설명으로 옳지 않은 것은?`,choices,answer,
   correctedStatement:anchor.truth,keyClue:anchor.why,explanation:`${anchor.why} 바른 설명은 “${anchor.truth}”이다.`,
   choiceNotes:evidence.map(({fact,isTrue})=>`${isTrue?'옳은 설명.':'틀린 설명.'} ${isTrue?trueNote(fact.why):fact.why}${isTrue?'':` 정정: ${fact.truth}`}`),
   statementEvidence:evidence.map(({fact,isTrue})=>({factId:fact.id,isTrue,correctedStatement:fact.truth,sourceRefs:fact.sourceRefs})),
   sourceRefs:anchor.sourceRefs,pages:anchor.sourceRefs[0].pages,refs:[],examRefs:anchor.examRefs,noteRefs:anchor.noteRefs,
   tags:['옳지 않은 것',anchor.axis],
  };
 }));
}
export const STATEMENT_QUESTIONS=buildStatementQuestions(STATEMENT_FACT_GROUPS,STATEMENT_LECTURE_TITLES);
