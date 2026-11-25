export function sourceGroups(question,{basisOnly=false}={}){
 const primary=basisOnly?question.lectureBasis?.pages:question.sourcePages;
 const extra=basisOnly?question.lectureBasis?.extraSources:question.extraSources;
 const groups=new Map();
 for(const entry of [{document:question.lecture,pages:primary||[]},...extra||[]]){
  if(!groups.has(entry.document))groups.set(entry.document,new Set());
  for(const page of entry.pages||[])groups.get(entry.document).add(page);
 }
 return [...groups].filter(([,pages])=>pages.size).map(([document,pages])=>({document,pages:[...pages].sort((a,b)=>a-b)}));
}
