(function(root){
  'use strict';
  const WEEK=['일','월','화','수','목','금','토'];
  const ORD=['첫째','둘째','셋째','넷째','다섯째'];
  function dayOf(first,day){return (first+day-1)%7}
  function datesInMonth(length,first){
    const terms=[];
    for(let weekday=0;weekday<7;weekday++){
      let nth=0;
      for(let day=1;day<=length;day++)if(dayOf(first,day)===weekday){
        terms.push({day,weekday,nth,label:`${ORD[nth]} ${WEEK[weekday]}요일`});nth++;
      }
    }
    return terms;
  }
  function generateQuestion(rng=Math.random){
    const length=[28,30,31][Math.floor(rng()*3)],first=Math.floor(rng()*7);
    const reference=3+Math.floor(rng()*(length-5));
    const terms=datesInMonth(length,first);
    let result;
    for(let tries=0;tries<400;tries++){
      const shuffled=[...terms];for(let i=0;i<3;i++){const j=i+Math.floor(rng()*(shuffled.length-i));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]}
      const picked=shuffled.slice(0,3);
      const [a,b,c]=picked;
      const type=Math.floor(rng()*7);
      let expression,answer,used;
      if(type===0){expression=`${a.label} + ${b.label}`;answer=a.day+b.day;used=[a,b]}
      if(type===1){expression=`${a.label} × ${b.label} − ${c.label}`;answer=a.day*b.day-c.day;used=[a,b,c]}
      if(type===2){expression=`(${a.label} + ${b.label}) × ${c.label}`;answer=(a.day+b.day)*c.day;used=[a,b,c]}
      if(type===3){expression=`${a.label} − ${b.label} + ${c.label}`;answer=a.day-b.day+c.day;used=[a,b,c]}
      if(type===4){if((a.day+b.day)%c.day)continue;expression=`(${a.label} + ${b.label}) ÷ ${c.label}`;answer=(a.day+b.day)/c.day;used=[a,b,c]}
      if(type===5){if(a.day*b.day%c.day)continue;expression=`${a.label} × ${b.label} ÷ ${c.label}`;answer=a.day*b.day/c.day;used=[a,b,c]}
      if(type===6){expression=`(${a.label} − ${b.label}) × ${c.label}`;answer=(a.day-b.day)*c.day;used=[a,b,c]}
      if(Number.isInteger(answer)&&Math.abs(answer)<=800&&new Set(used.map(x=>x.day)).size===used.length){result={length,first,reference,referenceDay:WEEK[dayOf(first,reference)],expression,answer,used};break}
    }
    if(!result)throw new Error('문제를 생성하지 못했습니다.');
    return result;
  }
  const api={WEEK,dayOf,datesInMonth,generateQuestion};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.WeekdayEngine=api;
})(typeof window!=='undefined'?window:globalThis);
