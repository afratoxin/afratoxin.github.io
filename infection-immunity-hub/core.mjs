export const STORAGE_KEY='infection-immune-exam2-20261125-v1';
export const emptyState=()=>({records:{},bookmarks:[],session:null});
export function stats(questions,state){
 const records=state.records||{},bookmarks=new Set(state.bookmarks||[]);
 const correct=questions.filter(q=>records[q.id]?.correct===true).length;
 const wrong=questions.filter(q=>records[q.id]?.correct===false).length;
 return {total:questions.length,attempted:correct+wrong,correct,wrong,unseen:questions.length-correct-wrong,starred:questions.filter(q=>bookmarks.has(q.id)).length};
}
export function selectQuestions(questions,state,{lecture='all',mode='all',difficulty='all',query=''}={}){
 const words=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
 const marks=new Set(state.bookmarks||[]),records=state.records||{};
 let result=questions.filter(q=>(lecture==='all'||q.lecture===lecture)
  &&(difficulty==='all'||q.difficulty===difficulty)
  &&words.every(w=>[q.stem,...q.choices,...q.tags||[]].join(' ').toLocaleLowerCase().includes(w))
  &&(mode==='wrong'?records[q.id]?.correct===false:mode==='starred'?marks.has(q.id):mode==='unseen'?!records[q.id]:mode==='continue'?records[q.id]?.correct!==true:true));
 if(mode==='continue')result=[...result.filter(q=>!records[q.id]),...result.filter(q=>records[q.id]?.correct===false)];
 return result;
}
export function shuffle(values,rng=Math.random){
 const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;
}
export function makeSession(questions,options={},rng=Math.random){
 const source=options.random?shuffle(questions,rng):questions;
 const selected=source.slice(0,options.limit||source.length);
 return {items:selected.map(q=>({id:q.id,order:options.shuffle?shuffle([0,1,2,3,4],rng):[0,1,2,3,4]})),responses:{},index:0,exam:!!options.exam,finished:false,committed:false,startedAt:Date.now(),title:options.title||'전체 강의'};
}
export function answerQuestion(session,questions,id,displayIndex){
 const item=session.items.find(x=>x.id===id),q=questions.find(x=>x.id===id);
 if(!item||!q||!Number.isInteger(displayIndex)||displayIndex<0||displayIndex>4||session.finished)throw Error('유효하지 않은 답안입니다.');
 const choice=item.order[displayIndex];
 return {...session,responses:{...session.responses,[id]:{choice,correct:choice===q.answer,at:Date.now()}}};
}
export function sessionResult(session,questions){
 const ids=new Set(questions.map(q=>q.id));
 const items=session.items.filter(x=>ids.has(x.id));
 const answers=items.map(x=>session.responses[x.id]).filter(Boolean);
 const correct=answers.filter(x=>x.correct).length;
 return {total:items.length,answered:answers.length,correct,wrong:answers.length-correct,unanswered:items.length-answers.length,score:items.length?Math.round(correct/items.length*100):0};
}
export function recordResponse(state,id,response){
 return {...state,records:{...state.records,[id]:{...response,attempts:(state.records[id]?.attempts||0)+1}}};
}
export function finishSession(state){
 let next={...state,session:{...state.session,finished:true}};
 if(next.session.exam&&!next.session.committed){
  for(const [id,response]of Object.entries(next.session.responses))next=recordResponse(next,id,response);
  next.session={...next.session,committed:true};
 }
 return next;
}
export function normalizeState(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return emptyState();
 const records=Object.fromEntries(Object.entries(value.records||{}).filter(([id,r])=>typeof id==='string'&&r&&typeof r.correct==='boolean'&&Number.isInteger(r.choice)&&r.choice>=0&&r.choice<5));
 const bookmarks=Array.isArray(value.bookmarks)?[...new Set(value.bookmarks.filter(x=>typeof x==='string'))]:[];
 const s=value.session;
 const session=s&&Array.isArray(s.items)&&s.items.every(x=>typeof x.id==='string'&&Array.isArray(x.order)&&x.order.length===5&&new Set(x.order).size===5&&x.order.every(n=>Number.isInteger(n)&&n>=0&&n<5))&&s.responses&&typeof s.responses==='object'&&Number.isInteger(s.index)?s:null;
 return {records,bookmarks,session};
}
export function loadState(storage){try{return normalizeState(JSON.parse(storage.getItem(STORAGE_KEY)))}catch{return emptyState()}}
export function saveState(storage,state){try{storage.setItem(STORAGE_KEY,JSON.stringify(state));return true}catch{return false}}
export function mergeProgress(local,remote,baseline){
 const records={...remote.records};
 for(const [id,r]of Object.entries(local.records||{}))if(!records[id]||(r.at||0)>=(records[id].at||0))records[id]=r;
 const before=new Set(baseline?.bookmarks||[]),current=new Set(local.bookmarks||[]),marks=new Set(remote.bookmarks||[]);
 for(const id of current)if(!before.has(id))marks.add(id);
 for(const id of before)if(!current.has(id))marks.delete(id);
 return {...local,records,bookmarks:[...marks]};
}
