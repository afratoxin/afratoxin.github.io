export function filterQuestions(questions, {query='',tags=[],review='all'}={}, reviews={}) {
  const terms=query.normalize('NFKC').trim().toLocaleLowerCase('ko').split(/\s+/).filter(Boolean);
  return questions.filter(q=>{
    const hay=[q.id,q.year,q.number,q.title,q.text,...(q.domains||[]),...(q.subjects||[]),...(q.types||[]),...(q.logic||[])].join(' ').normalize('NFKC').toLocaleLowerCase('ko');
    const r=reviews[q.id]||{};
    return terms.every(t=>hay.includes(t))&&tags.every(t=>(q.tags||[]).includes(t))&&(review==='all'||(review==='bookmarked'?r.bookmark:review==='unreviewed'?!r.status:r.status===review));
  }).sort((a,b)=>a.year-b.year||a.number-b.number);
}
export function parseRoute(hash='') {
  const [path,query='']=hash.replace(/^#/,'').split('?');
  const tags=new URLSearchParams(query).getAll('tag');
  const m=path.match(/^\/question\/(\d{4})$/);
  return {view:m?'question':'list',id:m?m[1]:null,tags};
}
export function buildRoute({view='list',id=null,tags=[]}={}) {
  const params=new URLSearchParams();tags.forEach(t=>params.append('tag',t));
  return '#'+(view==='question'&&id?'/question/'+id:'/questions')+(params.size?'?'+params:'');
}
