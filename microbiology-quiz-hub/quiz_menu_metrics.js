(function(root,factory){
  const api=factory(root.localStorage);
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.QuizMenuMetrics=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(initialStorage){
  const STORAGE_KEY='microbiologyQuizMenuStatsV1';
  let storage=initialStorage;

  function useStorage(nextStorage){storage=nextStorage;return api}
  function safeNumber(value){const n=Number(value);return Number.isFinite(n)&&n>=0?n:0}
  function normalizeEntry(value){
    const attempts=Math.floor(safeNumber(value&&value.attempts));
    const correct=Math.min(attempts,Math.floor(safeNumber(value&&value.correct)));
    return{correct,attempts,updatedAt:Math.floor(safeNumber(value&&value.updatedAt))};
  }
  function readAll(){
    if(!storage)return{};
    try{
      const parsed=JSON.parse(storage.getItem(STORAGE_KEY)||'{}');
      if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return{};
      return Object.fromEntries(Object.entries(parsed).map(([id,value])=>[id,normalizeEntry(value)]));
    }catch(_){return{}}
  }
  function writeAll(stats){if(storage)storage.setItem(STORAGE_KEY,JSON.stringify(stats));return stats}
  function recordBatch(menuId,correct,attempts){
    if(!menuId)return null;
    const count=Math.floor(safeNumber(attempts));
    if(!count)return readAll()[menuId]||null;
    const right=Math.min(count,Math.floor(safeNumber(correct))),stats=readAll(),current=normalizeEntry(stats[menuId]);
    stats[menuId]={correct:current.correct+right,attempts:current.attempts+count,updatedAt:Date.now()};
    writeAll(stats);return stats[menuId]
  }
  function record(menuId,isCorrect){return recordBatch(menuId,isCorrect?1:0,1)}
  function priority(entry){
    const item=normalizeEntry(entry),exposure=Math.max(0,20-item.attempts)/20;
    const accuracy=item.attempts?item.correct/item.attempts:0;
    const accuracyGap=item.attempts?Math.max(0,.8-accuracy)/.8:1;
    return exposure*.55+accuracyGap*.45
  }
  function recommend(menuIds,limit=2){
    const stats=readAll();
    return menuIds.map((id,index)=>{const item=normalizeEntry(stats[id]),accuracy=item.attempts?item.correct/item.attempts:0;return{id,index,item,accuracy,score:priority(item)}})
      .filter(x=>x.score>0)
      .sort((a,b)=>b.score-a.score||a.item.attempts-b.item.attempts||a.accuracy-b.accuracy||a.index-b.index)
      .slice(0,Math.max(0,limit)).map(x=>x.id)
  }
  function readLegacy(key){try{return JSON.parse(storage.getItem(key)||'{}')}catch(_){return{}}}
  function migrateLegacy(){
    if(!storage)return{};
    const stats=readAll();
    const seed=(id,correct,attempts)=>{if(stats[id])return;attempts=Math.floor(safeNumber(attempts));correct=Math.min(attempts,Math.floor(safeNumber(correct)));if(attempts)stats[id]={correct,attempts,updatedAt:Date.now()}};
    const attachment=readLegacy('viralAttachmentQuizV1');seed('viral-attachment',attachment.correct,attachment.total);
    const patterns=readLegacy('viralInfectionPatternsQuizV1');seed('viral-patterns',patterns.correct,patterns.total);
    const past=readLegacy('microbiology_past_exam_review_v1'),questions=past&&past.questions&&typeof past.questions==='object'?Object.values(past.questions):[];
    seed('past-exam',questions.reduce((sum,q)=>sum+safeNumber(q&&q.correct),0),questions.reduce((sum,q)=>sum+safeNumber(q&&q.attempts),0));
    return writeAll(stats)
  }
  const api={STORAGE_KEY,useStorage,readAll,record,recordBatch,priority,recommend,migrateLegacy};
  return api
});
