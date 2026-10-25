export const BOOKMARK_COLORS = Object.freeze([
  {id:'red',label:'빨강',hex:'#c44444'},
  {id:'orange',label:'주황',hex:'#c46d19'},
  {id:'yellow',label:'노랑',hex:'#d1b82b'},
  {id:'green',label:'초록',hex:'#38805c'},
  {id:'blue',label:'파랑',hex:'#397fc0'},
  {id:'indigo',label:'남색',hex:'#49529c'},
  {id:'violet',label:'보라',hex:'#8554ad'},
]);
const colorIds = new Set(BOOKMARK_COLORS.map(color=>color.id));
export function bookmarkColors(review={}) {
  if (!review || typeof review !== 'object') return [];
  const selected=Array.isArray(review.bookmarkColors) ? review.bookmarkColors : review.bookmark===true ? ['red'] : colorIds.has(review.bookmark) ? [review.bookmark] : [];
  return BOOKMARK_COLORS.map(color=>color.id).filter(id=>selected.includes(id));
}
export function normalizeReviews(reviews={}) {
  if (!reviews || typeof reviews!=='object' || Array.isArray(reviews)) return {};
  return Object.fromEntries(Object.entries(reviews).filter(([,r])=>r && typeof r==='object' && !Array.isArray(r)).map(([id,review])=>{
    const colors=bookmarkColors(review);
    return [id,{...review,bookmarkColors:colors,bookmark:colors.length>0}];
  }));
}
export function toggleBookmarkColor(review={},color) {
  const current={...(review && typeof review==='object' ? review : {})};
  const selected=new Set(bookmarkColors(current));
  if(colorIds.has(color)) { if(selected.has(color)) selected.delete(color); else selected.add(color); }
  const colors=BOOKMARK_COLORS.map(c=>c.id).filter(id=>selected.has(id));
  return {...current,bookmarkColors:colors,bookmark:colors.length>0};
}
export function filterQuestions(questions, {query='',tags=[],review='all',bookmark='all'}={}, reviews={}) {
  const terms=String(query||'').normalize('NFKC').trim().toLocaleLowerCase('ko').split(/\s+/).filter(Boolean);
  return questions.filter(q=>{
    const reasons=Object.values(q.tagReasons||{}).map(reason=>typeof reason==='string'?reason:JSON.stringify(reason));
    const hay=[q.id,q.year,q.examLabel,q.examKey,q.number,q.title,q.text,...(q.domains||[]),...(q.fields||[]),...(q.subjects||[]),...(q.types||[]),...(q.logic||[]),...reasons].join(' ').normalize('NFKC').toLocaleLowerCase('ko');
    const r=reviews[q.id]||{};const colors=bookmarkColors(r);
    const matchesReview=review==='all'||(review==='bookmarked'?colors.length>0:review==='unreviewed'?!r.status||r.status==='unreviewed':r.status===review);
    const matchesBookmark=bookmark==='all'||(bookmark==='any'?colors.length>0:colors.includes(bookmark));
    return terms.every(t=>hay.includes(t))&&tags.every(t=>(q.tags||[]).includes(t))&&matchesReview&&matchesBookmark;
  }).sort((a,b)=>a.year-b.year||(a.examKey==='preliminary'?0:1)-(b.examKey==='preliminary'?0:1)||a.number-b.number);
}
export function paginateQuestions(questions,{page=1,pageSize=10,mode='paged'}={}) {
  const size=Number.isFinite(Number(pageSize)) ? Math.min(100,Math.max(1,Math.floor(Number(pageSize)))) : 10;
  const total=questions.length;
  const pageCount=mode==='scroll'?1:Math.max(1,Math.ceil(total/size));
  const requested=Number.isFinite(Number(page))?Math.floor(Number(page)):1;
  const current=mode==='scroll'?1:Math.min(pageCount,Math.max(1,requested));
  const from=total ? mode==='scroll'?1:(current-1)*size+1 : 0;
  const to=mode==='scroll'?total:Math.min(current*size,total);
  return {items:mode==='scroll'?questions.slice():questions.slice((current-1)*size,current*size),total,page:current,pageCount,pageSize:size,from,to};
}
export function parseRoute(hash='') {
  const [path,query='']=String(hash).replace(/^#/,'').split('?');
  const params=new URLSearchParams(query);const tags=[...new Set(params.getAll('tag'))];
  let view='list',id=null;const q=path.match(/^\/question\/(\d{4}|p\d{3})\/?$/);const t=path.match(/^\/tags\/([^/]+)\/?$/);
  if(q){view='question';id=q[1];}
  else if(path==='/bookmarks'||path==='/bookmarks/')view='bookmarks';
  else if(path==='/tags'||path==='/tags/')view='tags';
  else if(t){try{id=decodeURIComponent(t[1]);view='tag';}catch{view='tags';}}
  const b=params.get('bookmark')||params.get('color')||(view==='bookmarks'?'any':'all');
  const requestedBookmark=colorIds.has(b)||b==='any'||b==='all'?b:view==='bookmarks'?'any':'all';
  const bookmark=view==='bookmarks'&&requestedBookmark==='all'?'any':requestedBookmark;
  const n=Number(params.get('page')||1);const page=Number.isFinite(n)?Math.max(1,Math.floor(n)):1;
  return {view,id,tags,bookmark,page,mode:params.get('mode')==='scroll'?'scroll':'paged'};
}
export function buildRoute({view='list',id=null,tags=[],bookmark,page=1,mode}={}) {
  const params=new URLSearchParams();[...new Set(tags)].forEach(t=>params.append('tag',t));
  const defaultBookmark=view==='bookmarks'?'any':'all';
  if(bookmark && bookmark!==defaultBookmark)params.set('bookmark',bookmark);
  if(mode)params.set('mode',mode==='scroll'?'scroll':'paged');
  if(Number(page)>1 && mode!=='scroll')params.set('page',Math.floor(Number(page)));
  const path=view==='question'&&id?'/question/'+id:view==='bookmarks'?'/bookmarks':view==='tags'?'/tags':view==='tag'&&id?'/tags/'+encodeURIComponent(id):'/questions';
  return '#'+path+(params.size?'?'+params:'');
}

export function createImageBundleStore(fetcher,{version=''}={}) {
  const bundles=new Map();
  function pathFor(question) {
    const path=String(question.imageBundle||'');
    const match=path.match(/^data\/images\/(preliminary|20\d{2})(?:-[a-z0-9]+)?\.json$/);
    return match && match[1]===question.examKey ? path : '';
  }
  function get(question) {
    const path=pathFor(question);
    if(!path)return {status:'error',url:'',error:new Error('이미지 경로가 올바르지 않습니다.')};
    const entry=bundles.get(path);
    if(!entry)return {status:'idle',url:''};
    if(entry.status==='ready') {
      const image=entry.images[question.id];
      return image ? {status:'ready',url:`data:image/webp;base64,${image}`} : {status:'error',url:'',error:new Error(`${question.id} 원본 이미지가 없습니다.`)};
    }
    return {status:entry.status,url:'',error:entry.error};
  }
  async function load(question,{retry=false}={}) {
    const path=pathFor(question);
    if(!path)throw get(question).error;
    let entry=bundles.get(path);
    if(!entry || (retry && (entry.status==='error' || entry.status==='ready' && !entry.images[question.id]))) {
      entry={status:'pending',images:null,error:null,promise:null};
      bundles.set(path,entry);
      entry.promise=(async()=>{
        try {
          const response=await fetcher(path+(version?`?v=${encodeURIComponent(version)}`:''));
          if(!response.ok)throw new Error(`HTTP ${response.status}`);
          const data=await response.json();
          if(data.schemaVersion!==1 || data.examKey!==question.examKey || data.mimeType!=='image/webp' || !data.images || Array.isArray(data.images) || typeof data.images!=='object')throw new Error('이미지 자료 형식이 올바르지 않습니다.');
          for(const [id,bytes] of Object.entries(data.images)) {
            if(!/^(?:p\d{3}|\d{4})$/.test(id) || typeof bytes!=='string' || !/^UklGR[A-Za-z0-9+/]*={0,2}$/.test(bytes))throw new Error('이미지 자료를 읽을 수 없습니다.');
          }
          entry.images=data.images;
          entry.status='ready';
        } catch(error) { entry.status='error';entry.error=error;throw error; }
      })();
    }
    if(entry.status==='pending')await entry.promise;
    const result=get(question);
    if(result.status!=='ready')throw result.error;
    return result.url;
  }
  return {get,load};
}

