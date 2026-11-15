import {buildSession,VERSION} from './logic.mjs?v=20261115h';

const attempted=record=>typeof record?.correct==='boolean';
const unanswered=(q,progress)=>!attempted(progress[q.id]);
const wrong=(q,progress)=>progress[q.id]?.correct===false;

function normalizedFilters(filters={}){
 const value=filters&&typeof filters==='object'&&!Array.isArray(filters)?filters:{};
 return {...value,count:0,mode:value.mode||'all',...(Array.isArray(value.questionIds)?{questionIds:[...new Set(value.questionIds.filter(id=>typeof id==='string'))]}:{})};
}
function selectedBank(bank,filters,bookmarks){
 const ids=Array.isArray(filters.questionIds)?new Set(filters.questionIds):null,stars=new Set(bookmarks||[]);
 return bank.filter(q=>(!ids||ids.has(q.id))&&(!filters.topic||filters.topic==='all'||q.topic===filters.topic)&&(!filters.format||filters.format==='all'||q.format===filters.format)&&(!filters.sourceScope||q.sourceScope===filters.sourceScope)&&(filters.mode!=='bookmarks'||stars.has(q.id)));
}
function counts(bank,progress){
 const correct=bank.filter(q=>progress[q.id]?.correct===true).length,missed=bank.filter(q=>wrong(q,progress)).length;
 return {total:bank.length,correct,wrong:missed,unanswered:bank.length-correct-missed};
}
export function continuousProgress(bank,filters={},progress={},bookmarks=[]){
 return counts(selectedBank(bank,normalizedFilters(filters),bookmarks),progress);
}
function parseSaved(raw){
 try{
  const value=typeof raw==='string'?JSON.parse(raw):raw;
  if(!value||value.version!==VERSION||!Array.isArray(value.items)||!Number.isInteger(value.position)||value.position<0||value.position>value.items.length)return null;
  if(value.filters!==undefined&&(!value.filters||typeof value.filters!=='object'||Array.isArray(value.filters)))return null;
  const ids=new Set();
  for(const item of value.items){
   if(!item||typeof item.id!=='string'||ids.has(item.id)||!Array.isArray(item.choices)||!item.choices.length||!Number.isInteger(item.answer)||item.answer<0||item.answer>=item.choices.length||(item.selected!==null&&(!Number.isInteger(item.selected)||item.selected<0||item.selected>=item.choices.length)))return null;
   ids.add(item.id);
  }
  return value;
 }catch{return null;}
}
function reusableItem(item,q){
 return item&&Array.isArray(item.choices)&&item.choices.length===q.choices.length&&new Set(item.choices).size===q.choices.length&&item.choices.every(choice=>q.choices.includes(choice))&&Number.isInteger(item.answer)&&item.choices[item.answer]===q.choices[q.answer];
}
function orderedCandidates(candidates,saved){
 const available=new Set(candidates.map(q=>q.id)),seen=new Set(),ids=[];
 const existing=saved?[...saved.items.slice(saved.position),...saved.items.slice(0,saved.position)]:[];
 for(const item of existing){if(available.has(item?.id)&&!seen.has(item.id)){ids.push(item.id);seen.add(item.id);}}
 for(const q of candidates)if(!seen.has(q.id)){ids.push(q.id);seen.add(q.id);}
 return ids;
}
function complete(filters,scope,progress,saved=null){
 const items=saved?.items||[];
 return {version:VERSION,queueVersion:1,filters,phase:'complete',scopeSize:scope.length,queueCounts:counts(scope,progress),position:items.length,items};
}

/** The selected scope is durable; count is deliberately ignored. */
export function startContinuousSession(bank,filters={},progress={},rng=Math.random,bookmarks=[],saved=null){
 const f=normalizedFilters(filters),scope=selectedBank(bank,f,bookmarks),prior=parseSaved(saved);
 const pending=scope.filter(q=>unanswered(q,progress)),missed=scope.filter(q=>wrong(q,progress));
 let phase,candidates;
 if(f.mode==='review'){
  phase='review';
  const completed=new Set(prior?.resumingContinuous&&prior.queueVersion===1&&prior.filters?.mode==='review'?prior.items.filter(item=>item.selected!==null&&item.selected!==undefined).map(item=>item.id):[]);
  candidates=scope.filter(q=>!completed.has(q.id));
 }else if(f.mode==='wrong'){phase='wrong';candidates=missed;}
 else if(pending.length){phase='unanswered';candidates=pending;}
 else{phase='wrong';candidates=missed;}
 if(!candidates.length)return complete(f,scope,progress,prior);
 const generated=buildSession(candidates,{count:0},progress,rng),fresh=new Map(generated.items.map(item=>[item.id,item]));
 const oldItems=new Map((prior?.items||[]).map(item=>[item.id,item])),questions=new Map(candidates.map(q=>[q.id,q]));
 const order=f.topic==='all'?generated.items.map(item=>questions.get(item.id)):candidates;
 const items=orderedCandidates(order,prior).map(id=>{
  const old=oldItems.get(id),q=questions.get(id);
  return reusableItem(old,q)?{id,choices:[...old.choices],answer:old.answer,selected:null}:fresh.get(id);
 });
 return {version:VERSION,queueVersion:1,filters:f,phase,scopeSize:scope.length,queueCounts:counts(scope,progress),position:0,items};
}

/** Advance within the current phase, then rebuild from the latest saved results. */
export function advanceContinuousSession(session,progress,bank,rng=Math.random,bookmarks=[]){
 const current=parseSaved(session);
 if(!current)return startContinuousSession(bank,{},progress,rng,bookmarks);
 const f=normalizedFilters(current.filters),scope=selectedBank(bank,f,bookmarks);
 if(current.phase==='complete')return f.mode==='review'?complete(f,scope,progress,current):startContinuousSession(bank,f,progress,rng,bookmarks,current);
 const inScope=new Map(scope.map(q=>[q.id,q]));
 let position=current.position+1;
 while(position<current.items.length){
  const q=inScope.get(current.items[position].id);
  if(q&&(current.phase==='review'||(current.phase==='unanswered'?unanswered(q,progress):wrong(q,progress))))break;
  position++;
 }
 if(position<current.items.length)return {...current,filters:f,position,scopeSize:scope.length,queueCounts:counts(scope,progress)};
 if(f.mode==='review')return complete(f,scope,progress,current);
 const next=startContinuousSession(bank,f,progress,rng,bookmarks);
 return next.phase==='complete'?complete(f,scope,progress,current):next;
}

/** Old bounded sessions migrate by restoring their scope, never their item limit. */
export function resumeContinuousSession(raw,bank,progress={},rng=Math.random,bookmarks=[]){
 const saved=parseSaved(raw);
 return saved?startContinuousSession(bank,saved.filters||{},progress,rng,bookmarks,{...saved,resumingContinuous:true}):null;
}
