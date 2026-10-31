export function questionLabel(question){
 const year=question.year||question.examKey||'';
 const preliminary=question.examKey==='preliminary'?' 예비시험':'';
 return `${year}학년도${preliminary} ${question.number}번`;
}
