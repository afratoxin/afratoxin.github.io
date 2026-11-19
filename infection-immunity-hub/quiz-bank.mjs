import {LECTURE_QUESTIONS as EXISTING_LECTURES,TABLE_QUESTIONS as LEGACY_RECALL,LECTURES as BASE_LECTURES,DOCUMENTS as BASE_DOCUMENTS,STUDY_TOPICS as BASE_TOPICS} from './study-bank.mjs?v=20261119e';
import {NOV19_QUESTIONS,NOV19_LECTURES} from './nov19-bank.mjs?v=20261119e';
import {RECALL_CONSOLIDATION} from './recall-consolidation.mjs?v=20261119e';
export const LECTURES=Object.fromEntries(Object.entries({...BASE_LECTURES,...NOV19_LECTURES}).sort(([a],[b])=>a.localeCompare(b)).map(([code,m],i)=>[code,{...m,short:m.short||m.title,order:i+1}]));
export const DOCUMENTS={...BASE_DOCUMENTS,...NOV19_LECTURES};
export const STUDY_TOPICS={...BASE_TOPICS,...Object.fromEntries(Object.keys(NOV19_LECTURES).map(code=>[code,LECTURES[code]]))};

// Historical source banks remain available for migration and source audits. Only this bank is playable.
export const PROMOTED_QUESTIONS=LEGACY_RECALL.filter(q=>RECALL_CONSOLIDATION[q.id]?.action==='move').map(q=>{
 const decision=RECALL_CONSOLIDATION[q.id];
 const notes=decision.choiceNotes?q.choices.map(c=>decision.choiceNotes[c]):q.choiceNotes;
 return {...q,lecture:decision.lecture,topic:decision.lecture,kind:'basic',stem:decision.stem||q.stem,
  keyClue:decision.keyClue||q.keyClue||q.explanation,choiceNotes:notes,
  tags:(q.tags||[]).filter(tag=>!['핵심회상','표 암기','11월18일'].includes(tag)),legacyRecallId:q.id};
});
export const LECTURE_QUESTIONS=[...EXISTING_LECTURES,...PROMOTED_QUESTIONS,...NOV19_QUESTIONS];
// Compatibility exports are empty: a retired recall bank must never re-enter active totals or queues.
export const TABLE_QUESTIONS=[];
export const TABLE_TOPICS={};
