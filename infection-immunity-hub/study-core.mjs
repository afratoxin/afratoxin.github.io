import {buildSession} from './logic.mjs?v=20261114b';

export function factQuestion(fact){
 const pool=[...new Set(fact.pool)];
 if(!pool.includes(fact.answer)||pool.length<5)throw new Error(`Invalid table pool: ${fact.id}`);
 const choices=[fact.answer,...pool.filter(x=>x!==fact.answer).slice(0,4)];
 return {...fact,id:`table-${fact.id}`,topic:`table-${fact.category}`,format:'mcq',kind:'table',stem:fact.prompt,choices,answer:0,pages:fact.sourceRefs[0].pages,refs:[],examRefs:[],choiceNotes:[]};
}
export function nextRound(bank,filters={},progress={},rng=Math.random,bookmarks=[],previousId=null){
 const s=buildSession(bank,{...filters,count:0},progress,rng,bookmarks);
 if(s.items.length>1&&s.items[0].id===previousId){const n=1+Math.floor(rng()*(s.items.length-1));[s.items[0],s.items[n]]=[s.items[n],s.items[0]];}
 s.items=s.items.slice(0,Number(filters.count)||s.items.length);s.filters={...filters};
 return s;
}
export function sourceText(q,documents){
 return (q.sourceRefs||[]).map(s=>`${documents[s.doc]?.title||s.doc} ${s.pages.join('·')}쪽`).join(' / ');
}
