export const VERSION=1;
export function tabFromHash(hash) {
  if(hash==='#mainContent')return null;
  const tab=hash.replace(/^#/,'');
  return ['home','quiz','pathology','review','notes'].includes(tab)?tab:'home';
}
export function shuffle(values,rng=Math.random) {
  const result=[...values];
  for(let i=result.length-1;i>0;i--) {const j=Math.floor(rng()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
export function readProgress(raw,bank) {
  try {
    const value=JSON.parse(raw); if(!value || typeof value!=='object' || Array.isArray(value))return {};
    return Object.fromEntries(bank.filter(q=>value[q.id] && typeof value[q.id].correct==='boolean').map(q=>[q.id,{correct:value[q.id].correct,selected:value[q.id].selected,updated:value[q.id].updated}]));
  } catch{return {};}
}
export function readBookmarks(raw,bank) {
  try{const value=JSON.parse(raw);return Array.isArray(value)?[...new Set(value.filter(id=>bank.some(q=>q.id===id)))]:[];}catch{return [];}
}
export function stats(bank,progress) {
  const correct=bank.filter(q=>progress[q.id]?.correct===true).length;
  const wrong=bank.filter(q=>progress[q.id]?.correct===false).length;
  return {total:bank.length,correct,wrong,unanswered:bank.length-correct-wrong,attempted:correct+wrong};
}
export function buildSession(bank,filters={},progress={},rng=Math.random,bookmarks=[]) {
  const eligible=bank.filter(q=>(!filters.topic || filters.topic==='all' || q.topic===filters.topic) && (!filters.format || filters.format==='all' || q.format===filters.format) && (filters.mode!=='wrong' || progress[q.id]?.correct===false) && (filters.mode!=='unanswered' || !progress[q.id]) && (filters.mode!=='bookmarks' || bookmarks.includes(q.id)));
  const limit=Number(filters.count)||eligible.length;
  return {version:VERSION,filters:{...filters},position:0,items:shuffle(eligible,rng).slice(0,limit).map(q=>{
    const order=q.format==='mcq'?shuffle(q.choices.map((_,i)=>i),rng):q.choices.map((_,i)=>i);
    return {id:q.id,choices:order.map(i=>q.choices[i]),answer:order.indexOf(q.answer),selected:null};
  })};
}
export function grade(session,progress,index,selected,bank) {
  const item=session.items[index];
  if(!item || !Number.isInteger(selected) || selected<0 || selected>=item.choices.length)throw new Error('Invalid answer');
  if(item.selected!==null)return {duplicate:true,correct:item.selected===item.answer,progress};
  const q=bank.find(q=>q.id===item.id); if(!q)throw new Error('Unknown question');
  item.selected=selected;
  const correct=selected===item.answer;
  return {duplicate:false,correct,progress:{...progress,[item.id]:{correct,selected:q.choices.indexOf(item.choices[selected]),updated:Date.now()}}};
}
export function restoreSession(raw,bank) {
  try {
    const value=JSON.parse(raw);
    if(value?.version!==VERSION || !Array.isArray(value.items) || !value.items.length || !Number.isInteger(value.position) || value.position<0 || value.position>value.items.length)return null;
    const ids=new Set();
    for(const item of value.items) {
      const q=bank.find(q=>q.id===item.id);
      if(!q || ids.has(item.id) || !Array.isArray(item.choices) || item.choices.length!==q.choices.length || new Set(item.choices).size!==q.choices.length || item.choices.some(c=>!q.choices.includes(c)) || !Number.isInteger(item.answer) || item.choices[item.answer]!==q.choices[q.answer] || (item.selected!==null && (!Number.isInteger(item.selected) || item.selected<0 || item.selected>=item.choices.length)))return null;
      ids.add(item.id);
    }
    return value;
  }catch{return null;}
}
