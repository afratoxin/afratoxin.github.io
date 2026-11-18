import {LECTURE_QUESTIONS as EXISTING_LECTURES,TABLE_QUESTIONS as LEGACY_RECALL} from './study-bank.mjs?v=20261119d';
import {RECALL_CONSOLIDATION} from './recall-consolidation.mjs?v=20261119d';
export {LECTURES,DOCUMENTS,STUDY_TOPICS} from './study-bank.mjs?v=20261119d';

// Historical source banks remain available for migration and source audits. Only this bank is playable.
export const PROMOTED_QUESTIONS=LEGACY_RECALL.filter(q=>RECALL_CONSOLIDATION[q.id]?.action==='move').map(q=>{
 const decision=RECALL_CONSOLIDATION[q.id];
 const notes=decision.choiceNotes?q.choices.map(c=>decision.choiceNotes[c]):q.choiceNotes;
 return {...q,lecture:decision.lecture,topic:decision.lecture,kind:'basic',stem:decision.stem||q.stem,
  keyClue:decision.keyClue||q.keyClue||q.explanation,choiceNotes:notes,
  tags:(q.tags||[]).filter(tag=>!['핵심회상','표 암기','11월18일'].includes(tag)),legacyRecallId:q.id};
});
export const LECTURE_QUESTIONS=[...EXISTING_LECTURES,...PROMOTED_QUESTIONS];
// Compatibility exports are empty: a retired recall bank must never re-enter active totals or queues.
export const TABLE_QUESTIONS=[];
export const TABLE_TOPICS={};
