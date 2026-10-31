export const RESEARCH_KEY='leet-atlas:research:v1';
export function emptyResearch(){return {schemaVersion:1,sets:[],compareIds:[],savedSearches:[],issues:[]};}
const text=(value,max=20000)=>typeof value==='string'?value.slice(0,max):'';
const list=(value,max,name)=>{if(value===undefined)return [];if(!Array.isArray(value)||value.length>max)throw new Error(`${name} 목록을 확인해 주세요.`);return value;};
function cleanDesignReview(value){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('출제 평가 형식을 확인해 주세요.');
 const result={};
 for(const key of ['rules','inference','distractors','visual']){
  const rating=value[key];
  if(rating!==undefined&&rating!==null&&(!Number.isInteger(rating)||rating<1||rating>5))throw new Error('출제 평가 점수는 1~5 정수여야 합니다.');
  if(rating!==undefined)result[key]=rating;
 }
 const minutes=value.expectedMinutes;
 if(minutes!==undefined&&minutes!==null&&(!Number.isFinite(minutes)||minutes<=0||minutes>60))throw new Error('출제 평가 예상 시간은 0분 초과 60분 이하여야 합니다.');
 if(minutes!==undefined)result.expectedMinutes=minutes;
 return {...result,reason:text(value.reason,10000),updatedAt:text(value.updatedAt,100),basis:'writer-review'};
}
function questionList(value,allowed,max=755){
 const result=[...new Set(list(value,max,'문항'))];
 if(result.some(id=>typeof id!=='string'||!allowed.has(id)))throw new Error('DB에 없는 문항이 포함되어 있습니다.');
 return result;
}
function cleanState(input,allowed){
 const data=input||{};
 const result=emptyResearch();
 result.sets=list(data.sets,100,'자료 묶음').map(item=>{
  if(!item||!text(item.id,100)||!text(item.name,120).trim())throw new Error('자료 묶음 이름을 확인해 주세요.');
  return {id:text(item.id,100),name:text(item.name,120).trim(),ids:questionList(item.ids,allowed),notes:text(item.notes),updatedAt:text(item.updatedAt,100)};
 });
 result.compareIds=questionList(data.compareIds,allowed,4);
 result.savedSearches=list(data.savedSearches,100,'저장 검색').map(item=>{
  if(!item||!text(item.id,100)||!text(item.name,120))throw new Error('저장 검색 이름을 확인해 주세요.');
  return {id:text(item.id,100),name:text(item.name,120),query:text(item.query,10000),mode:item.mode==='keyword'?'keyword':'recommend',tags:list(item.tags,245,'태그').filter(v=>typeof v==='string'),excludedTags:list(item.excludedTags,245,'제외 태그').filter(v=>typeof v==='string'),tagMode:item.tagMode==='or'?'or':'auto'};
 });
 result.issues=list(data.issues,2000,'검토 쟁점').map(item=>{
  if(!item||!allowed.has(item.questionId)||!text(item.body).trim())throw new Error('검토 쟁점의 문항과 내용을 확인해 주세요.');
  return {id:text(item.id,100),questionId:item.questionId,type:text(item.type,100)||'검토',body:text(item.body),status:item.status==='resolved'?'resolved':'open',createdAt:text(item.createdAt,100),updatedAt:text(item.updatedAt,100),history:list(item.history,100,'이력').map(v=>({date:text(v.date,100),action:text(v.action,300)}))};
 });
 for(const key of ['sets','savedSearches','issues'])if(new Set(result[key].map(v=>v.id)).size!==result[key].length)throw new Error('중복된 저장 항목 ID가 있습니다.');
 return result;
}
export function parseResearchBackup(input,questionIds){
 let data;
 try{if(typeof input!=='string'||new TextEncoder().encode(input).length>6000000)throw new Error();data=JSON.parse(input);}catch{throw new Error('6MB 이하의 올바른 JSON 파일을 선택해 주세요.');}
 if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('DB 백업 JSON을 확인해 주세요.');
 const legacy=data.app==='LEET Atlas'&&[1,2].includes(data.schemaVersion);
 if(!legacy&&(data.kind!=='leet-writer-backup'||data.schemaVersion!==1))throw new Error('LEET Atlas 출제 자료 백업이 아닙니다.');
 const research=cleanState(legacy?{}:data.research,questionIds),reviews={};
 if(data.reviews!==undefined&&(!data.reviews||typeof data.reviews!=='object'||Array.isArray(data.reviews)))throw new Error('검수 기록 형식을 확인해 주세요.');
 for(const [id,value] of Object.entries(data.reviews||{})){
  if(!questionIds.has(id)||!value||typeof value!=='object'||Array.isArray(value))throw new Error('검수 기록의 문항을 확인해 주세요.');
  reviews[id]={...value,note:text(value.note),status:['done','check','unreviewed'].includes(value.status)?value.status:'unreviewed'};
  if(value.designReview!==undefined)reviews[id].designReview=cleanDesignReview(value.designReview);
 }
 return {research,reviews};
}
export function researchBackup(research,reviews){return JSON.stringify({kind:'leet-writer-backup',schemaVersion:1,exportedAt:new Date().toISOString(),research,reviews},null,2);}
export function mergeResearch(existing,incoming){
 const merge=key=>[...new Map([...existing[key],...incoming[key]].map(value=>[value.id,value])).values()];
 return {...existing,sets:merge('sets'),savedSearches:merge('savedSearches'),issues:merge('issues'),compareIds:incoming.compareIds.length?incoming.compareIds:existing.compareIds};
}
export function createResearchStore(storage,questionIds){
 let current=emptyResearch(),error='',writeBlocked=false,lastRaw=null;
 const readError=()=>{writeBlocked=true;error='기존 출제 자료를 읽지 못해 덮어쓰기를 중단했습니다. 새 작업은 현재 화면에만 보관되므로 백업 파일을 내려받아 주세요.';};
 try{lastRaw=storage?.getItem(RESEARCH_KEY)||null;if(lastRaw)current=cleanState(JSON.parse(lastRaw),questionIds);}catch{readError();}
 function sync(){
  if(writeBlocked||!storage)return false;
  try{const raw=storage.getItem(RESEARCH_KEY)||null;if(raw===lastRaw)return false;current=raw?cleanState(JSON.parse(raw),questionIds):emptyResearch();lastRaw=raw;return true;}catch{readError();return false;}
 }
 return {
  get state(){return structuredClone(current);},get error(){return error;},
  sync,
  update(change){
   sync();
   const candidate=structuredClone(current);change(candidate);const next=cleanState(candidate,questionIds);
   // Validation happens before state or persistence is touched.
   current=next;
   if(writeBlocked)return structuredClone(current);
   try{if(!storage)throw new Error();const raw=JSON.stringify(next);storage.setItem(RESEARCH_KEY,raw);lastRaw=raw;error='';}catch{error='브라우저 저장에 실패했습니다. 현재 자료는 화면에 유지됩니다. 백업 파일을 내려받아 주세요.';}
   return structuredClone(current);
  }
 };
}
export function relatedQuestions(question,questions,mode,{limit=12}={}){
 const overlap=(a=[],b=[])=>a.filter(value=>b.includes(value)).length;
 return questions.filter(q=>q.id!==question.id).map(q=>{
  const logic=overlap(question.logic,q.logic),fields=overlap(question.fields,q.fields),subjects=overlap(question.subjects,q.subjects),types=overlap(question.types,q.types);
  const eligible=mode==='logic'?logic>0&&fields===0:(fields>0||subjects>0)&&types===0;
  return {question:q,score:mode==='logic'?logic*5+types:subjects*5+fields*2,reason:mode==='logic'?`공통 풀이 논리 ${(q.logic||[]).filter(v=>question.logic?.includes(v)).join(' · ')} · 다른 분야`:`공통 소재·분야 ${[...(q.subjects||[]),...(q.fields||[])].filter(v=>[...(question.subjects||[]),...(question.fields||[])].includes(v)).join(' · ')} · 다른 문항 유형`,eligible};
 }).filter(v=>v.eligible).sort((a,b)=>b.score-a.score||b.question.year-a.question.year||a.question.number-b.question.number).slice(0,limit);
}
