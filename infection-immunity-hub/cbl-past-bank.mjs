import {QUESTIONS as FIRST} from './cbl-past1-bank.mjs?v=20261116c';
import {QUESTIONS as REST,EMPTY_SECTIONS} from './cbl-past2356-bank.mjs?v=20261116c';
import * as FOURTH from './cbl-past4-bank.mjs?v=20261116c';

export const CBL_PAST_QUESTIONS=[...FIRST,...REST,...FOURTH.QUESTIONS].map(q=>q.id==='lecture-cbl-past-1-2023-99'?{...q,original:{...q.original,figureNote:'제공된 족보에는 지문이 언급한 그람염색 사진이 누락되어 있습니다. 원문 그대로 표시합니다.'}}:q).sort((a,b)=>a.topic.localeCompare(b.topic)||b.year-a.year||a.number-b.number);
export const CBL_PAST_EMPTY=EMPTY_SECTIONS||[];
const titles=['세균감염','감염성 발진','바이러스감염','인수공통·침습성 진균감염','방어기전 손상 환자의 감염','의학미생물학'];
export const CBL_PAST_TOPICS=Object.fromEntries(titles.map((title,i)=>{
 const code=`cbl-past-${i+1}`,empty=CBL_PAST_EMPTY.find(s=>s.topic===code);
 return [code,{title:`CBL ${i+1} · ${title}`,short:`CBL ${i+1}`,order:i+1,group:'cbl',...(empty?{emptyEvidence:empty}:{})}];
}));
