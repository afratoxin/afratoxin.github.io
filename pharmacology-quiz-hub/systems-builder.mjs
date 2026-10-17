// A case is a causal comparison, not a drug-name matching exercise.
// Two fixed forms per case keep progress finite; presentation order is shuffled.
export function buildUnderstandingBank(scope,cases){
 return cases.flatMap((c,index)=>{
  if(c.claims.length!==5||c.claims.some(x=>!x.right||!x.wrong||!x.why||x.right===x.wrong))throw Error('Invalid claim set: '+c.id);
  return ['correct','incorrect'].map(polarity=>{
   const anchor=(index+(polarity==='incorrect'?2:0))%5;
   const statements=c.claims.map((claim,i)=>{
    const valid=i===anchor?polarity==='correct':polarity==='incorrect';
    return {text:valid?claim.right:claim.wrong,valid,trueText:claim.right,why:claim.why};
   });
   return {id:scope+'-understanding:'+c.id+':'+polarity,subject:c.id,group:c.group,format:'judgment',polarity,
    context:c.context,stem:c.context+'\n\n다음 설명 중 '+(polarity==='correct'?'옳은 것은?':'옳지 않은 것은?'),
    options:statements.map(x=>x.text),answer:statements[anchor].text,statements,
    note:c.goal+' '+(polarity==='incorrect'?'틀린 선지를 고르는 문항입니다. 바른 설명: '+c.claims[anchor].right+' ':'')+c.claims[anchor].why,
    source:c.source,exam:c.exam,
    details:statements.map(x=>x.text+': '+(x.valid?'옳은 설명. ':'옳지 않은 설명. 바른 설명: '+x.trueText+' ')+x.why)};
  });
 });
}
