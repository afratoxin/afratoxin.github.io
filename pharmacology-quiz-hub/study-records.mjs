// Common latest-result ledger. Register a complete finite bank before recording answers.
export const STUDY_KEY='pharmacology-study-results-v1';
const copy=value=>JSON.parse(JSON.stringify(value));
export function normalizeStudyQuestion(raw,extra={}){
  const q={...raw,...extra},entries=q.choices||q.options||q.answers||[];
  const choices=entries.map(x=>typeof x==='string'?x:x.text);
  let answers;
  if(Number.isInteger(q.answerIndex))answers=[q.answerIndex];
  else if(q.choices&&Array.isArray(q.answers)&&q.answers.every(Number.isInteger))answers=q.answers;
  else if(Array.isArray(q.answer))answers=q.answer.map(i=>i-1);
  else answers=[choices.indexOf(q.answer)];
  if(!choices.length||!answers.length||answers.some(i=>i<0||i>=choices.length))throw Error('Invalid study answer: '+(q.id||q.fact?.id));
  const details=q.details||entries.filter(x=>x?.fact?.note||x?.reason).map(x=>x.reason?`${x.text}: ${x.reason}`:`${x.text}: ${x.fact.note}${x.fact.correct&&x.text!==x.fact.correct?' 바른 설명: '+x.fact.correct:''}`);
  return copy({id:q.id||q.fact?.id,stem:q.stem,choices,answers,note:q.note||q.fact?.note||'',source:q.source||(q.fact?.page?`강의록 ${q.fact.page}쪽`:''),details,steps:q.steps||[],formula:q.formula||'',plot:q.plot||null,table:q.table||null,figure:q.figure||null,answerNote:q.answerNote||''});
}
export function gradeStudyAnswer(q,selected){return q.answers.length===selected.length&&q.answers.every(i=>selected.includes(i));}
export function shuffleStudyQuestion(q,random=Math.random){
  const order=q.choices.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
  return {...q,choices:order.map(i=>q.choices[i]),answers:q.answers.map(i=>order.indexOf(i))};
}
export function createStudyStore(storage){
  let loaded=false,records={};const definitions=new Map(),listeners=new Set();
  const disk=()=>storage||globalThis.localStorage;
  function load(){if(loaded)return;loaded=true;try{const saved=JSON.parse(disk()?.getItem(STUDY_KEY)||'null');if(saved?.version===1&&saved.records&&typeof saved.records==='object')records=saved.records;}catch{}}
  const save=()=>{try{disk()?.setItem(STUDY_KEY,JSON.stringify({version:1,records}));}catch{}};
  const notify=()=>{for(const fn of listeners)fn();};
  function register(def){
    load();const previous=definitions.get(def.id)||{};
    const items=new Map(def.items.map(x=>[String(typeof x==='string'?x:x.id),typeof x==='string'?{id:x}:x]));
    const full={type:'quiz',...previous,...def,items};definitions.set(def.id,full);
    const rows=records[def.id]??={};const legacy=def.legacy||{};
    for(const id of items.keys()){
      if(rows[id])continue;
      const last=legacy.lastResult?.[id];let status=null;
      if(last===true||last==='correct')status='correct';else if(last===false||last==='wrong')status='wrong';
      else if(def.unknownLegacy){if(legacy.attemptedVariants?.[id]>0)status='unknown';}
      else if(legacy.missed?.[id]>0)status='wrong';else if(legacy.seen?.[id]>0)status='correct';
      if(status){rows[id]={status};if(status==='wrong'&&full.build)rows[id].question=normalizeStudyQuestion(full.build(id),{id});}
    }
    save();notify();return full;
  }
  function record(scope,raw,good){
    load();const def=definitions.get(scope),id=String(raw.id||raw.fact?.id||'');if(!def?.items.has(id))return false;
    const row={status:good?'correct':'wrong'};if(!good&&def.type!=='match')row.question=normalizeStudyQuestion(raw,{id});
    (records[scope]??={})[id]=row;save();notify();return true;
  }
  function recordMatch(scope,results,keyOf){
    load();const def=definitions.get(scope);if(def?.type!=='match')return;let changed=false;
    for(const r of results){const id=String(keyOf(r.item));if(!r.chosen||!def.items.has(id))continue;(records[scope]??={})[id]={status:r.correct?'correct':'wrong'};changed=true;}
    if(changed){save();notify();}
  }
  const selected=scopes=>scopes==null||scopes==='all'?[...definitions.keys()]:Array.isArray(scopes)?scopes:[scopes];
  function counts(scopes){
    load();const n={total:0,solved:0,correct:0,wrong:0,unknown:0,unanswered:0};
    for(const scope of selected(scopes)){const def=definitions.get(scope);if(!def)continue;for(const id of def.items.keys()){n.total++;const status=records[scope]?.[id]?.status;if(['correct','wrong','unknown'].includes(status)){n.solved++;n[status]++;}else n.unanswered++;}}
    return n;
  }
  function wrong(scopes){
    load();const out=[];for(const scope of selected(scopes)){const def=definitions.get(scope);if(!def)continue;for(const [id,item]of def.items){const row=records[scope]?.[id];if(row?.status!=='wrong')continue;const question=def.type==='match'?null:row.question||(def.build?normalizeStudyQuestion(def.build(id),{id}):null);out.push({scope,id,item,question,definition:def});}}
    return out;
  }
  return {register,record,recordMatch,counts,wrong,definitions,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},status(scope,id){load();return records[scope]?.[id]?.status||'unanswered';},boardScope(cardsId){return [...definitions.values()].find(d=>d.boardIds?.includes(cardsId))?.id;}};
}
export const studyStore=createStudyStore();
export function recordStudyResult(scope,raw,good,extra={}){return studyStore.record(scope,{...raw,...extra},good);}
export function studyCountLabel(n){return `풀이 ${n.solved}/${n.total} · 정답 ${n.correct} · 오답 ${n.wrong} · 미풀이 ${n.unanswered}${n.unknown?' · 이전 결과 미상 '+n.unknown:''}`;}
export function paintStudyProgress(element,n){
  const percent=value=>n.total?100*value/n.total:0;
  element.classList.add('study-progress-fill');element.style.setProperty('--study-correct-end',percent(n.correct)+'%');element.style.setProperty('--study-wrong-end',percent(n.correct+n.wrong)+'%');element.style.setProperty('--study-known-end',percent(n.solved)+'%');
  element.setAttribute('aria-label',studyCountLabel(n));element.title=studyCountLabel(n);
}
