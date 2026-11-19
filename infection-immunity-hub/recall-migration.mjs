import {RECALL_CONSOLIDATION} from './recall-consolidation.mjs?v=20261120a';

export const RECALL_MIGRATION_KEY='infection-immunity.recall-consolidation.v1';
const LEGACY_PROGRESS='infection-immunity.drill.progress.v1';
const LEGACY_STARS='infection-immunity.drill.bookmarks.v1';
const object=raw=>{try{const value=typeof raw==='string'?JSON.parse(raw):raw;return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{return {};}};
const stars=raw=>{try{const value=typeof raw==='string'?JSON.parse(raw):raw;return Array.isArray(value)?[...new Set(value.filter(id=>typeof id==='string'))]:[];}catch{return [];}};
const timestamp=record=>Number.isFinite(record?.updated)?record.updated:0;
const valid=record=>record&&typeof record.correct==='boolean';
const prefix=store=>store==='antibiotics'?'infection-immunity':`infection-immunity.${store}`;

/** Migration checkpoints must only observe durable values, never a failed write's memory fallback. */
export function createRecallStorage(readRaw,writeRaw,onFailure=()=>{}){
 return {
  read(key){try{return readRaw(key);}catch{onFailure();return null;}},
  write(key,value){try{writeRaw(key,JSON.stringify(value));return true;}catch{onFailure();return false;}}
 };
}

/** Import unchanged questions' results; paraphrased duplicates transfer stars without inventing a completed attempt. */
export function migrateRecallRecords(read,write,plan=RECALL_CONSOLIDATION){
 const checkpoint=object(read(RECALL_MIGRATION_KEY));
 const seenProgress={...object(checkpoint.progress)},seenStars=new Set(stars(checkpoint.stars));
 const originalProgress=read(LEGACY_PROGRESS),originalStars=read(LEGACY_STARS);
 const legacy=object(originalProgress),bookmarks=stars(originalStars),updates=new Map();
 let migrated=0,starred=0,changed=false;
 const target=(key,parse)=>{if(!updates.has(key))updates.set(key,{value:parse(read(key)),dirty:false,progress:[],stars:[]});return updates.get(key);};
 for(const [source,record] of Object.entries(legacy)){
  const rule=plan[source];if(!rule?.copyProgress||!valid(record))continue;
  const signature=JSON.stringify([record.correct,record.selected,timestamp(record)]);
  if(seenProgress[source]===signature)continue;
  const state=target(prefix(rule.store)+'.progress.v1',object),previous=state.value[rule.destination];
  if(!valid(previous)||timestamp(record)>timestamp(previous)){
   const next={correct:record.correct,updated:timestamp(record)};
   if(Number.isInteger(record.selected)&&record.selected>=0&&record.selected<rule.choiceCount)next.selected=record.selected;
   state.value[rule.destination]=next;state.dirty=true;migrated++;
  }
  state.progress.push([source,signature]);
 }
 for(const source of bookmarks){
  const rule=plan[source];if(!rule||seenStars.has(source))continue;
  const state=target(prefix(rule.store)+'.bookmarks.v1',stars);
  if(!state.value.includes(rule.destination)){state.value.push(rule.destination);state.dirty=true;starred++;}
  state.stars.push(source);
 }
 const changedKeys=[];let complete=true;
 for(const [key,state] of updates){
  if(state.dirty&&write(key,state.value)===false){complete=false;continue;}
  if(state.dirty)changedKeys.push(key);
  for(const [source,signature] of state.progress){seenProgress[source]=signature;changed=true;}
  for(const source of state.stars){seenStars.add(source);changed=true;}
 }
 // Checkpoint each successful destination independently; only failed writes remain retryable.
 // Legacy progress, stars and sessions are never changed.
 if(changed){
  if(write(RECALL_MIGRATION_KEY,{version:1,progress:seenProgress,stars:[...seenStars]})===false)complete=false;
 }
 return {migrated,starred,complete,changedKeys};
}
