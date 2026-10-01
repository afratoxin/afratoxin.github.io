export function shuffleChoices(question, random=Math.random) {
  const indexes=question.choices.map((_,i)=>i);
  for(let i=indexes.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[indexes[i],indexes[j]]=[indexes[j],indexes[i]];}
  return {...question,choices:indexes.map(i=>question.choices[i]),answer:question.answer.map(a=>indexes.indexOf(a-1)+1)};
}
export function gradeSelection(answer,selected) {
  return answer.length===selected.length && answer.every(a=>selected.includes(a));
}
export function chooseQuestion(pool,seen={},recent=[],random=Math.random) {
  if(!pool.length)return null;
  let candidate=pool.filter(q=>!recent.includes(q.id));
  if(!candidate.length)candidate=pool;
  const min=Math.min(...candidate.map(q=>seen[q.id]||0));
  const least=candidate.filter(q=>(seen[q.id]||0)===min);
  return least[Math.floor(random()*least.length)];
}
export function visibleQuestions(pool,section='all',year='all',mode='quiz') {
  return pool.filter(q=>q.status===mode&&(section==='all'||q.section===section)&&(year==='all'||q.year===Number(year)));
}
