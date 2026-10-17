// 13강 PDF 20쪽 β 차단제 표. 후보는 사용자가 지정한 16개로 한정한다.
const categories=[
 ['비선택성 β 봉쇄제',['propranolol','timolol','pindolol','nadolol','penbutolol','carvedilol','carteolol','labetalol']],
 ['β1 선택성 봉쇄제',['metoprolol','atenolol','esmolol','bisoprolol','celiprolol','betaxolol','nebivolol','acebutolol']]
];
export const ADR13_BETA_ITEMS=categories.flatMap(([category,drugs])=>drugs.map(drug=>({drug,category,note:`${drug}: ${category}`})));
export const ADR13_BETA_QUESTIONS=ADR13_BETA_ITEMS.map((item,index)=>{
 const opposite=ADR13_BETA_ITEMS.filter(x=>x.category!==item.category);
 const options=[item.drug,...Array.from({length:4},(_,i)=>opposite[(index+i*2)%opposite.length].drug)];
 return {id:'beta-selectivity:'+item.drug,group:item.category,lecture:13,page:20,
  stem:`다음 중 ${item.category}에 해당하는 약물은?`,answer:item.drug,options,
  source:'13강 · 강의록 20쪽 · 지정 16개 약물',
  note:`${item.drug}은(는) ${item.category}로 분류합니다. 이 문항은 β 수용체 봉쇄의 선택성만 묻습니다.`,
  details:options.map(drug=>`${drug}: ${ADR13_BETA_ITEMS.find(x=>x.drug===drug).category}`)
 };
});
