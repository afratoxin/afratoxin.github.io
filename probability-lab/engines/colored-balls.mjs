import { COLORS, emptyBallRules, compileBallGroup, compare } from './ball-rules.mjs?v=20261026-prompt-style-fix';
const N=(key,label,min,max,extra={})=>({key,label,type:'number',min,max,step:1,...extra});
const S=(key,label,options,extra={})=>({key,label,type:'select',options:options.map(([value,label])=>({value,label})),...extra});
const C=(key,label,extra={})=>({key,label,type:'checkbox',...extra});
const sum=a=>a.reduce((s,n)=>s+n,0);
const factorial=n=>{let a=1n;for(let i=2;i<=n;i++)a*=BigInt(i);return a;};
const choose=(n,k)=>{if(k<0||k>n)return 0n;let a=1n;for(let j=1;j<=Math.min(k,n-k);j++)a=a*BigInt(n-j+1)/BigInt(j);return a;};
const falling=(n,k)=>choose(n,k)*factorial(k);
const gcd=(a,b)=>b?gcd(b,a%b):a;
const fraction=(a,b)=>{const g=gcd(a,b);return b/g===1n?String(a/g):`${a/g}/${b/g}`;};
const bounded=n=>{if(n>999n)throw Error('표본공간·경우의 수·분자·분모가 999를 넘습니다. 공 수, 추출 수 또는 상자 수를 줄이세요.');return n;};
const group=rules=>({logic:'and',negate:false,rules});
const event=rules=>({event:group(rules),given:group([])});
const counts=p=>COLORS.slice(0,p.colorKinds).map(([key])=>p[key]);
const COLOR_WORDS=['빨간','파란','노란','초록색','보라색','검은'];
const colorsControls=COLORS.map(([key,label])=>N(key,`${label} 공 수`,0,20,{group:'colors'}));
const colorDefaults={colorKinds:2,red:4,blue:5,yellow:1,green:1,purple:1,black:1};
const sequenceOptions=[['any','순서 조건 없음'],['apart','같은 색끼리 이웃하지 않음'],['repeat','같은 색 이웃이 한 번 이상'],['sameEnds','처음과 마지막 색이 같음'],['differentEnds','처음과 마지막 색이 다름']];
export const ballDrawSpec={
 id:'selection',title:'여러 색 공 뽑기',category:'경우의 수·확률',description:'색별 수량·추출 순서와 일부 색의 조건을 조합하고 조건부확률도 비교합니다.',
 defaults:{...colorDefaults,draw:4,redTarget:2,relation:'eq',replacement:false,ordered:false,query:'count',sequence:'any',firstColor:-1,lastColor:-1,ballRules:emptyBallRules()},
 controls:[N('colorKinds','공의 색 종류',1,6),N('draw','뽑는 횟수·개수',0,20),C('replacement','복원 추출',{help:'각 공은 서로 구별합니다. 복원 추출은 순서 있는 시행으로 셉니다.'}),C('ordered','뽑힌 순서 구별'),S('query','구하는 값',[['count','경우의 수'],['probability','확률']]),N('redTarget','빨간 공 기준 수',0,20),S('relation','빨간 공 기본 조건',[['none','제한 없음'],['eq','정확히'],['ge','이상'],['le','이하']]),...colorsControls,S('sequence','색의 순서 조건',sequenceOptions,{group:'sequence'}),S('firstColor','첫 공의 색',[[-1,'제한 없음'],...COLORS.map((x,i)=>[i,x[1]])],{group:'sequence'}),S('lastColor','마지막 공의 색',[[-1,'제한 없음'],...COLORS.map((x,i)=>[i,x[1]])],{group:'sequence'})],
 presets:[
 {name:'두 색 · 빨강 2개',params:{red:4,blue:5,draw:4,redTarget:2}},
 {name:'세 색 · 모두 다른 색',params:{colorKinds:3,red:2,blue:2,yellow:1,draw:2,relation:'none',query:'probability',ballRules:event([{kind:'kinds',colors:[0,1,2],target:2,relation:'eq'}])}},
 {name:'네 색 · 일부 색의 홀짝',params:{colorKinds:4,red:2,blue:2,yellow:1,green:1,draw:3,relation:'none',query:'probability',ballRules:event([{kind:'parity',colors:[0,2],target:0}])}},
 {name:'복원 · 같은 색 이웃 금지',params:{colorKinds:3,red:1,blue:1,yellow:1,draw:4,relation:'none',replacement:true,ordered:true,sequence:'apart',query:'probability'}},
 {name:'조건부 · 색 수의 곱',params:{colorKinds:3,red:2,blue:2,yellow:1,draw:2,relation:'none',query:'probability',ballRules:{event:group([{kind:'expression',left:'a*b+c^2',right:'1',relation:'ge'}]),given:group([{kind:'parity',colors:[0,2],target:0}])}}}
 ],solve:p=>solveDraw(p)
};
export const distributionSpec={
 id:'distribution',title:'색 공을 상자에 분배',category:'경우의 수',description:'공과 상자의 구별 여부, 일부 상자의 수량·색 가짓수와 복합 조건을 조합합니다.',
 defaults:{...colorDefaults,red:2,blue:1,boxes:3,ballsDistinct:false,boxesDistinct:true,ballRules:emptyBallRules()},
 controls:[N('colorKinds','공의 색 종류',1,6),N('boxes','상자 수',1,5),C('ballsDistinct','같은 색 공도 서로 구별'),C('boxesDistinct','상자를 서로 구별'),...colorsControls],
 presets:[
 {name:'두 색 · 상자 총량 제한',params:{ballRules:event([{kind:'eachBox',boxes:[0],colors:[0,1],target:1,relation:'le'},{kind:'eachBox',boxes:[1],colors:[0,1],target:1,relation:'ge'}])}},
 {name:'세 색 · 모두 받는 상자',params:{colorKinds:3,red:2,blue:1,yellow:1,ballRules:event([{kind:'allColorsBoxes',colors:[0,1,2],target:1,relation:'ge'}])}},
 {name:'일부 상자만 색 제한',params:{colorKinds:3,red:2,blue:1,yellow:1,ballRules:event([{kind:'boxKinds',boxes:[0,1],colors:[0,1,2],target:2,relation:'le'}])}},
 {name:'서로 같은 상자',params:{colorKinds:1,red:6,boxes:3,boxesDistinct:false}},
 {name:'상자 수량의 제곱·차',params:{ballRules:event([{kind:'expression',colors:[0,1],left:'a^2-b',right:'0',relation:'eq'}])}},
 {name:'구별하는 공 · 빈 상자 없음',params:{red:2,blue:2,ballsDistinct:true,ballRules:event([{kind:'emptyBoxes',target:0,relation:'eq'}])}}
 ],solve:p=>solveDistribution(p)
};
function validateBase(p,distribution){
 if(!Number.isInteger(p.colorKinds)||p.colorKinds<1||p.colorKinds>6)throw Error('색 종류는 1~6으로 설정하세요.');
 const a=counts(p);if(a.some(n=>!Number.isInteger(n)||n<0||n>20))throw Error('색별 공 수는 0~20의 정수로 설정하세요.');
 if(sum(a)>40)throw Error('전체 공 수를 40 이하로 줄이세요.');
 if(p.ballRules!=null&&(!p.ballRules||typeof p.ballRules!=='object'||Array.isArray(p.ballRules)))throw Error('조건 묶음의 형식을 확인하세요.');
 if(distribution&&(!Number.isInteger(p.boxes)||p.boxes<1||p.boxes>5))throw Error('상자는 1~5개로 설정하세요.');
 return a;
}
function* compositions(n,k,limits=Array(k).fill(n),prefix=[]){
 if(k===1){if(n<=limits[0])yield [...prefix,n];return;}
 for(let i=0;i<=Math.min(n,limits[0]);i++)yield* compositions(n-i,k-1,limits.slice(1),[...prefix,i]);
}
function seqWays(vector,p){
 const total=sum(vector),memo=new Map();
 function visit(left,last,first,repeat){
  const remaining=sum(left),position=total-remaining;
  if(!remaining){if(total===0)return p.firstColor<0&&p.lastColor<0&&p.sequence!=='repeat'&&p.sequence!=='differentEnds'?1n:0n;
   if(p.lastColor>=0&&last!==p.lastColor||p.sequence==='sameEnds'&&first!==last||p.sequence==='differentEnds'&&first===last||p.sequence==='repeat'&&!repeat)return 0n;return 1n;}
  const key=`${left}:${last}:${first}:${repeat}`;if(memo.has(key))return memo.get(key);
  let n=0n;for(let color=0;color<left.length;color++)if(left[color]&&(!position&&p.firstColor>=0?color===p.firstColor:true)&&!(p.sequence==='apart'&&last===color)){
   left[color]--;n+=visit(left,color,position?first:color,repeat||last===color);left[color]++;
  }memo.set(key,n);return n;
 }
 return visit(vector.slice(),-1,-1,false);
}
function solveDraw(p){
 const a=validateBase(p,false),total=sum(a),ordered=p.ordered||p.replacement;
 if(!Number.isInteger(p.draw)||p.draw<0||p.draw>20||!p.replacement&&p.draw>total||p.replacement&&!total&&p.draw>0)throw Error('추출 개수와 전체 공 수를 확인하세요.');
 if(!ordered&&(p.sequence!=='any'||p.firstColor!==-1||p.lastColor!==-1))throw Error('순서 조건을 쓰려면 뽑힌 순서를 구별하세요.');
 if(!sequenceOptions.some(x=>x[0]===p.sequence)||![p.firstColor,p.lastColor].every(i=>Number.isInteger(i)&&i>=-1&&i<p.colorKinds))throw Error('순서 조건의 색을 확인하세요.');
 const space=bounded(p.replacement?BigInt(total)**BigInt(p.draw):ordered?falling(total,p.draw):choose(total,p.draw));
 const A=compileBallGroup(p.ballRules?.event,p),B=compileBallGroup(p.ballRules?.given,p),rows=[];
 let numerator=0n,denominator=0n;
 const redOK=v=>p.relation==='none'||compare(v[0],p.relation,p.redTarget);
 for(const vector of compositions(p.draw,p.colorKinds,p.replacement?a.map(n=>n>0?p.draw:0):a)){
  let base=1n;for(let i=0;i<a.length;i++)base*=p.replacement?BigInt(a[i])**BigInt(vector[i]):ordered?falling(a[i],vector[i]):choose(a[i],vector[i]);
  if(!base)continue;
  const orderCount=ordered?factorial(p.draw)/vector.reduce((v,n)=>v*factorial(n),1n):1n;
  const weight=base*orderCount;
  if(!B.test(vector))continue;denominator+=weight;
  const ways=redOK(vector)&&A.test(vector)?ordered?base*seqWays(vector,p):base:0n;
  if(ways){numerator+=ways;rows.push({vector,weight:ways});}
 }
 if(!denominator)throw Error('조건 사건의 경우의 수가 0이므로 조건부확률을 정의할 수 없습니다.');
 bounded(numerator);bounded(denominator);
 const given=!B.empty;
 const quantities=a.map((n,i)=>`${COLOR_WORDS[i]} 공 ${n}개`).join(', ');
 const baseCondition=p.relation==='none'?'':`빨간 공이 ${p.relation==='eq'?`정확히 ${p.redTarget}개`:p.relation==='ge'?`${p.redTarget}개 이상`:`${p.redTarget}개 이하`}`;
 const sequenceText={any:'',apart:'같은 색의 공이 서로 이웃하지 않는다',repeat:'같은 색의 공이 이웃하는 경우가 있다',sameEnds:'처음과 마지막에 꺼낸 공의 색이 같다',differentEnds:'처음과 마지막에 꺼낸 공의 색이 다르다'}[p.sequence];
 const seqText=[sequenceText,p.firstColor>=0?`첫 번째로 꺼낸 공은 ${COLORS[p.firstColor][1]}색이다`:'',p.lastColor>=0?`마지막으로 꺼낸 공은 ${COLORS[p.lastColor][1]}색이다`:''].filter(Boolean).join('이고 ');
 const eventText=[baseCondition,!A.empty?A.text:'',seqText].filter(Boolean).join('이고 ')||'제한 없음';
 const generic=ordered?(p.replacement?'(r!/∏xᵢ!)∏nᵢ^xᵢ':'r!∏C(nᵢ,xᵢ)'):'∏C(nᵢ,xᵢ)';
 const hasSeq=p.sequence!=='any'||p.firstColor>=0||p.lastColor>=0;
 const answer=p.query==='probability'?fraction(numerator,denominator):String(numerator);
 const terms=rows.slice(0,6).map(row=>String(row.weight));
 const eventRules=p.ballRules?.event?.rules??[];
 const simple=!given&&!hasSeq&&!p.ballRules?.event?.negate?(A.empty&&p.relation!=='none'?{colors:[0],target:p.redTarget,relation:p.relation}:p.relation==='none'&&eventRules.length===1&&eventRules[0].kind==='count'?eventRules[0]:null):null;
 const complement=simple?.relation==='ge'&&simple.target===1;
 const other=simple?total-sum((simple.colors??a.map((_,i)=>i)).map(i=>a[i])):0;
 const missed=complement?(p.replacement?BigInt(other)**BigInt(p.draw):ordered?falling(other,p.draw):choose(other,p.draw)):0n;
 const missedFormula=p.replacement?`${other}^${p.draw}`:ordered?`P(${other},${p.draw})`:`C(${other},${p.draw})`;
 const vectorFormula=vector=>hasSeq?`${seqWays(vector,p)} × `+vector.map((n,i)=>p.replacement?`${a[i]}^${n}`:`P(${a[i]},${n})`).join(' × '):ordered?p.replacement?`${p.draw}! / (${vector.map(n=>`${n}!`).join('·')}) × ${vector.map((n,i)=>`${a[i]}^${n}`).join(' × ')}`:`${p.draw}! × ${vector.map((n,i)=>`C(${a[i]},${n})`).join(' × ')}`:vector.map((n,i)=>`C(${a[i]},${n})`).join(' × ');

 const drawText=p.replacement?`임의로 한 개의 공을 꺼내어 색을 확인한 후 다시 넣는 시행을 ${p.draw}회 반복한다.`:ordered?`임의로 한 개씩 공을 ${p.draw}개 꺼낸다.`:`임의로 공 ${p.draw}개를 동시에 꺼낸다.`;
 const eventConditions=[baseCondition,!A.empty?A.text:'',seqText].filter(Boolean);
 const eventPrompt=eventConditions.length?`다음 조건을 만족시키는 경우의 수를 구하시오.\n${eventConditions.map((condition,i)=>`(${String.fromCharCode(44032+i)}) ${condition}`).join('\n')}`:'가능한 결과의 수를 구하시오.';
 const probabilityPrompt=given?`${B.text}일 때, ${eventText}일 확률은?`:eventConditions.length?`${eventText}일 확률은?`:'모든 가능한 추출 결과를 포함하는 사건의 확률은?';
 const usesExpression=[...(p.ballRules?.event?.rules??[]),...(p.ballRules?.given?.rules??[])].some(rule=>rule.kind==='expression');
 const question=`주머니에 ${quantities}가 들어 있다. ${drawText}${p.query==='probability'?`\n${probabilityPrompt}`:`\n${given?`${B.text}인 경우 중, `:''}${eventPrompt}`}\n(단, 공은 각각 서로 구별${ordered?', 공을 꺼낸 순서를 구별':''}한다.)${usesExpression?'\n(a, b, …는 색의 순서대로 꺼낸 각 색 공의 개수를 나타낸다.)':''}`;
 return {status:'ok',question,answer,exact:answer,numeric:p.query==='probability'?Number(numerator)/Number(denominator):Number(numerator),unit:p.query==='probability'?'확률':'가지',steps:[
 {title:given?'조건 사건을 새 표본공간으로':'전체 경우의 수',body:given?`주어진 조건을 만족하는 경우만 분모로 사용한다. 전체 ${space}가지 중 조건 사건은 ${denominator}가지이다.`:`${ordered?'순서 있는':'순서 없는'} 등확률인 결과를 기준으로 센다. 색의 구성 자체는 등확률이 아니다.`,formula:given?`n(B)=${denominator}`:`n(Ω)=${p.replacement?`${total}^${p.draw}`:ordered?`P(${total},${p.draw})`:`C(${total},${p.draw})`}=${space}`},
 {title:complement?'여사건으로 간단히 계산':hasSeq?'색 구성과 순서 조건을 분리':'색 구성에 조합의 곱 적용',body:complement?'선택한 색이 적어도 하나 나오는 사건의 여사건은 선택한 색이 하나도 나오지 않는 사건이다. 나머지 색의 공만으로 뽑는 경우를 전체에서 뺀다.':hasSeq?'가능한 색별 개수부터 정한다. 같은 색 이웃 금지나 처음·마지막 조건을 만족하는 색 순서 수에 실제 공을 배정하는 경우의 수를 곱한다.':'색별 개수 xᵢ의 합은 추출 수와 같다. 조건을 만족하는 색 구성마다 조합의 곱을 계산하고 서로 겹치지 않는 경우를 더한다.',formula:complement?`n(Aᶜ)=${missedFormula}=${missed}`:hasSeq?`색 순서 수 × ${p.replacement?'∏nᵢ^xᵢ':'∏P(nᵢ,xᵢ)'}`:`한 구성의 경우의 수 = ${generic}`},
 {title:given?'교집합의 경우의 수':'조건을 만족하는 경우의 수',body:complement?'여사건과 구하는 사건은 겹치지 않으며 전체를 이룬다.':A.empty&&p.relation==='none'&&!hasSeq?'추가 제한이 없으므로 모든 경우가 포함된다.':`조건을 만족하는 색 구성 ${rows.length}개를 묶어 센다. 각 항은 개별 공을 직접 나열한 것이 아니라 한 색 구성 전체의 경우의 수이다.`,formula:complement?`n(A)=${space}−${missed}=${numerator}`:`n(${given?'A∩B':'A'})=${terms.join(' + ')||'0'}${rows.length>6?' + …':''}=${numerator}`},
 {title:p.query==='probability'?'확률을 계산':'경우의 수 확정',body:p.query==='probability'?'유리한 경우의 수를 조건 사건의 경우의 수로 나누고 약분한다.':'선택한 조건을 모두 반영한 경우의 수이다.',formula:p.query==='probability'?`${given?'P(A|B)':'P(A)'}=${numerator}/${denominator}=${answer}`:`답=${answer}`}
 ],cases:rows.slice(0,24).map(row=>({label:row.vector.map((n,i)=>`${COLORS[i][1]} ${n}`).join(' · '),count:String(row.weight),detail:`${vectorFormula(row.vector)} = ${row.weight}`})),insight:'같은 색의 공도 개별 공으로 구별하여 추출한다. 색 구성마다 조합의 곱으로 가중치를 주고, 조건부확률에서는 주어진 사건으로 표본공간을 줄인다.',solutionMethod:complement?'complement':given?'조건부확률과 조합의 곱':hasSeq?'색 순서와 공 배정':'조합의 곱과 합',_space:String(space)};
}
const matrixCache=new Map();
function matrixOutcomes(p,a){
 const key=JSON.stringify([a,p.boxes,p.ballsDistinct,p.boxesDistinct]);if(matrixCache.has(key))return matrixCache.get(key);
 const n=sum(a),k=p.boxes;let space;
 if(p.boxesDistinct)space=bounded(p.ballsDistinct?BigInt(k)**BigInt(n):a.reduce((v,c)=>v*choose(c+k-1,k-1),1n));
 else if(p.ballsDistinct){let row=[1n];for(let i=1;i<=n;i++)row=Array.from({length:Math.min(k,i)+1},(_,j)=>j?(row[j-1]??0n)+BigInt(j)*(row[j]??0n):0n);space=bounded(row.reduce((v,c)=>v+c,0n));}
 const rawSize=a.reduce((v,c)=>v*choose(c+k-1,k-1),1n);if(rawSize>150000n)throw Error('색과 상자를 함께 늘린 구성은 계산 범위를 넘습니다. 수량을 줄이세요.');
 const rows=[],seen=new Set(),parts=a.map(c=>[...compositions(c,k)]),numerator=a.reduce((v,c)=>v*factorial(c),1n);
 function visit(matrix,i){
  if(i<a.length){for(const row of parts[i])visit([...matrix,row],i+1);return;}
  let weight=1n;
  if(!p.boxesDistinct){const cols=Array.from({length:k},(_,j)=>matrix.map(row=>row[j]));cols.sort((x,y)=>{for(let i=0;i<x.length;i++)if(x[i]!==y[i])return x[i]-y[i];return 0;});const id=JSON.stringify(cols);if(seen.has(id))return;seen.add(id);matrix=a.map((_,i)=>cols.map(col=>col[i]));
   if(p.ballsDistinct){let denominator=matrix.flat().reduce((v,c)=>v*factorial(c),1n),copies=new Map();for(const col of cols)if(sum(col)){const id=col.join(',');copies.set(id,(copies.get(id)??0)+1);}for(const m of copies.values())denominator*=factorial(m);weight=numerator/denominator;}
  }else if(p.ballsDistinct)weight=numerator/matrix.flat().reduce((v,c)=>v*factorial(c),1n);
  rows.push({matrix,weight});if(rows.length>999)throw Error('분배의 전체 경우의 수가 999를 넘습니다. 공이나 상자 수를 줄이세요.');
 }
 visit([],0);space=bounded(rows.reduce((v,r)=>v+r.weight,0n));const result={rows,space};if(matrixCache.size>=12)matrixCache.delete(matrixCache.keys().next().value);matrixCache.set(key,result);return result;
}
function solveDistribution(p){
 const a=validateBase(p,true),A=compileBallGroup(p.ballRules?.event,p,true);
 if(p.ballRules?.given?.rules?.length||p.ballRules?.given?.negate)throw Error('상자 분배에서는 조건 사건 대신 분배 조건에 추가하세요.');
 const {rows,space}=matrixOutcomes(p,a),valid=rows.filter(row=>A.test(row.matrix)),answer=bounded(valid.reduce((v,r)=>v+r.weight,0n));
 const grouped=new Map();for(const row of valid){const vector=row.matrix.map(r=>r[0]),key=vector.join(',');grouped.set(key,(grouped.get(key)??0n)+row.weight);}
 const quantities=a.map((n,i)=>`${COLOR_WORDS[i]} 공 ${n}개`).join(', '),unrestricted=A.empty;
 const formula=p.boxesDistinct?p.ballsDistinct?`${p.boxes}^${sum(a)}`:a.map(n=>`C(${n+p.boxes-1},${p.boxes-1})`).join(' × '):p.ballsDistinct?'Σ S(n,j) (1≤j≤상자 수)':'색별 분배표에서 상자 순서의 중복을 제거';
 const distributionConditions=A.empty?[]:[A.text];
 const usesExpression=(p.ballRules?.event?.rules??[]).some(rule=>rule.kind==='expression');
 const question=`주머니에 ${quantities}가 들어 있다. 이 공을 ${p.boxes}개의 ${p.boxesDistinct?'서로 다른':'서로 구별되지 않는'} 상자에 남김없이 나누어 넣을 때, ${distributionConditions.length?'다음 조건을 만족시키는 분배 방법의 수를 구하시오.':'분배 방법의 수는?'}${distributionConditions.length?`\n(가) ${distributionConditions[0]}`:''}\n(단, ${p.ballsDistinct?'공은 각각 서로 구별하고':'같은 색의 공끼리는 서로 구별하지 않고'}, 빈 상자를 허용한다.)${usesExpression?'\n(a, b, …는 상자 A, B, …에 들어 있는 선택한 색의 공 수를 나타낸다.)':''}`;
 return {status:'ok',question,answer:String(answer),exact:String(answer),numeric:Number(answer),unit:'가지',steps:[
 {title:'공과 상자의 구별 확인',body:p.ballsDistinct?'각 공은 서로 다르므로 한 색을 각 상자에 정해진 수만큼 배정하는 방법은 다항계수로 센다.':'같은 색 공은 서로 바꾸어도 같으므로 색별로 중복조합을 적용한다. 색이 다른 공의 분배는 별도로 정한다.',formula:p.ballsDistinct?'한 색의 배정 수 = n! / (x₁!x₂!⋯)':'x₁+⋯+xₖ=n, xᵢ≥0 ⇒ C(n+k−1,k−1)'},
 {title:p.boxesDistinct?'색별 분배와 곱의 법칙':'같은 상자의 중복 제거',body:p.boxesDistinct?'각 색의 분배를 독립적으로 정하고 경우의 수를 곱한다.':'상자 안의 색별 개수가 같은 분배를 한 묶음으로 본다. 빈 상자는 공의 배정을 추가하지 않는다. 서로 다른 공을 쓰면 같은 구성을 가진 비어 있지 않은 상자들의 교환 중복도 나눈다. S(n,j)는 서로 다른 n개 공을 비어 있지 않은 j묶음으로 나누는 경우의 수를 뜻한다.',formula:unrestricted?`${formula} = ${space}`:p.boxesDistinct?`전체 분배 = ${formula} = ${space}`:p.ballsDistinct?'각 구성의 수 = ∏nᵢ! / (∏xᵢⱼ! · ∏mᵥ!)':'상자의 색별 구성 열을 정렬하여 일치하면 같은 분배'},
 {title:unrestricted?'전체 경우의 수 확정':'상자별 조건을 반영하여 묶기',body:unrestricted?'추가 조건이 없어 전체 경우의 수가 답이다.':'상자 하나의 색별 구성부터 정한 다음, 남은 공의 분배를 조합으로 묶어 더한다. 상자별 총량·색 가짓수와 공통 조건은 같은 분배표에 함께 적용한다.',formula:unrestricted?`답 = ${answer}`:`조건을 만족하는 구성들의 가중치 합 = ${answer}`}
 ],cases:unrestricted?[]:[...grouped].slice(0,24).map(([vector,weight])=>({label:`${p.boxesDistinct?'A 상자':'첫 구성 상자'}: ${vector.split(',').map((n,i)=>`${COLORS[i][1]} ${n}`).join(' · ')}`,count:String(weight),detail:'이 구성을 정한 뒤 나머지 상자에 분배하는 경우를 합한 값'})),insight:p.boxesDistinct?'서로 다른 색의 중복조합을 곱하되, 상자의 총수량이나 색 가짓수 조건이 있으면 색별 분배들을 같은 상자 기준으로 결합한다.':'상자를 구별하지 않을 때 전체를 상자 수의 팩토리얼로 무조건 나누면 빈 상자와 반복 구성이 잘못 처리된다.',solutionMethod:p.boxesDistinct?p.ballsDistinct?'다항계수와 곱의 법칙':'중복조합과 조건별 분류':'분배의 대칭과 중복 제거',_space:String(space)};
}
ballDrawSpec.inputControls=ballDrawSpec.controls;
distributionSpec.inputControls=distributionSpec.controls;
function controlsFor(p,base,distribution){
 const kind=Math.min(6,Math.max(1,p.colorKinds||2)),a=counts({...p,colorKinds:kind}),total=sum(a),ordered=p.ordered||p.replacement;
 return base.filter(c=>!COLORS.some(([key],i)=>c.key===key&&i>=kind)).map(c=>({...c,...(c.key==='draw'?{max:p.replacement?Math.max(0,Math.min(20,total>1?Math.floor(Math.log(999)/Math.log(total)):20)):total}:{}),...(c.key==='redTarget'?{max:p.draw}:{}),...(['firstColor','lastColor'].includes(c.key)?{options:c.options.filter(x=>x.value===-1||ordered&&x.value<kind)}:{}),...(c.key==='sequence'?{options:ordered?c.options:c.options.filter(x=>x.value==='any')}:{}),...(c.key==='boxes'?{max:sum(a)===0?5:5}:{})}));
}
export const coloredBallProfiles={
 selection:{controls:(p,b)=>controlsFor(p,b,false),facts:(p,r)=>({counts:[BigInt(r._space)],values:[],denominators:[]})},
 distribution:{controls:(p,b)=>controlsFor(p,b,true),facts:(p,r)=>({counts:[BigInt(r._space)],values:[],denominators:[]})}
};
