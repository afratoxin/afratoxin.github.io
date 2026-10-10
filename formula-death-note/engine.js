(function(root){
  'use strict';
  const STOCK=[1,2,3,4,5,6,1,2,3,4,5,6];
  function removeCards(stock,used){
    const rest=[...stock];
    for(const number of used){const i=rest.indexOf(Number(number));if(i<0)throw new Error(`${number} 카드가 부족합니다. 숫자 카드는 각각 두 장까지 쓸 수 있습니다.`);rest.splice(i,1)}
    return rest;
  }
  function codes(){const result=[];for(let a=1;a<=6;a++)for(let b=a;b<=6;b++)for(let c=b;c<=6;c++){if(a===b&&b===c)continue;result.push([a,b,c])}return result}
  const ALL_CODES=codes();
  const CHALLENGE_CODES=ALL_CODES.filter(code=>ALL_CODES.filter(other=>other[0]+other[1]+other[2]===code[0]+code[1]+code[2]).length>=3);
  function buildClues(code){
    const [a,b,c]=code;
    const pool=[{label:`세 숫자의 합은 ${a+b+c}`,test:x=>x[0]+x[1]+x[2]===a+b+c},
      {label:`세 숫자의 곱은 ${a*b*c}`,test:x=>x[0]*x[1]*x[2]===a*b*c},
      {label:`가장 큰 숫자와 작은 숫자의 차는 ${c-a}`,test:x=>x[2]-x[0]===c-a},
      {label:`양 끝 숫자의 합은 ${a+c}`,test:x=>x[0]+x[2]===a+c},
      {label:`가장 작은 숫자는 ${a}`,test:x=>x[0]===a}];
    const clues=[],candidates=[...ALL_CODES];
    for(const clue of pool){clues.push(clue.label);for(let i=candidates.length-1;i>=0;i--)if(!clue.test(candidates[i]))candidates.splice(i,1);if(candidates.length===1)break}
    return clues;
  }
  function generatePuzzle(rng=Math.random){
    const factorial=n=>{let result=1;for(let i=2;i<=n;i++)result*=i;return result};
    for(let tries=0;tries<1000;tries++){
      const code=CHALLENGE_CODES[Math.floor(rng()*CHALLENGE_CODES.length)];
      const available=removeCards(STOCK,code),draw=[];
      for(let i=0;i<8;i++)draw.push(available.splice(Math.floor(rng()*available.length),1)[0]);
      const [a,b,c,d,e,f,g,h]=draw,template=Math.floor(rng()*4);
      let solution,target;
      if(template===0){solution=`(${a}!+${b}^${c})×(${d}+${e})+${f}×${g}+${h}`;target=(factorial(a)+b**c)*(d+e)+f*g+h}
      if(template===1){solution=`${a}!×${b}×${c}+${d}^${e}×(${f}+${g})+${h}`;target=factorial(a)*b*c+d**e*(f+g)+h}
      if(template===2){solution=`${a}!^${b}+(${c}+${d})×(${e}×${f}+${g})+${h}`;target=factorial(a)**b+(c+d)*(e*f+g)+h}
      if(template===3){solution=`${a}^${b}×(${c}+${d})+${e}!×${f}×${g}+${h}`;target=a**b*(c+d)+factorial(e)*f*g+h}
      if(target>=10000&&target<=99999&&Number.isSafeInteger(target))return {target,code,clues:buildClues(code),solution,used:draw,pattern:['(! + ^) × (+) + × +','! × × + ^ × (+) +','! ^ + (+) × (× +) +','^ × (+) + ! × × +'][template]};
    }
    throw new Error('문제를 생성하지 못했습니다.');
  }
  function evaluateFormula(expression,calculate){
    const used=(expression.match(/[1-9]/g)||[]).map(Number);
    if(used.length<7||used.length>8)throw new Error('숫자 카드를 7~8장 사용해 수식을 만드세요. 코드를 위해 최소 4장을 남겨야 합니다.');
    const remaining=removeCards(STOCK,used);
    const value=calculate(expression,STOCK);
    return {value,used,remaining};
  }
  function parseCode(raw,remaining){
    if(!/^[1-6]{3}$/.test(raw))throw new Error('1~6으로 된 세 자리 코드를 입력해 주세요.');
    const code=[...raw].map(Number);
    if(code[0]>code[1]||code[1]>code[2])throw new Error('코드는 작은 숫자부터 오름차순으로 입력하세요.');
    removeCards(remaining,code);
    return code;
  }
  const api={STOCK,ALL_CODES,removeCards,buildClues,generatePuzzle,evaluateFormula,parseCode};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.DeathNoteEngine=api;
})(typeof window!=='undefined'?window:globalThis);
