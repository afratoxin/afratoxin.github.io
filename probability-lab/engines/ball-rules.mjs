import { parseExpression, evaluateExpression, polynomial } from './expression-parser.mjs?v=20261026-structure';
import { questionMath } from '../exam-paper.mjs?v=20261026-challenge-grid';
export const COLORS=[['red','빨강'],['blue','파랑'],['yellow','노랑'],['green','초록'],['purple','보라'],['black','검정'],['white','흰']];
export const emptyBallRules=()=>({event:{logic:'and',negate:false,rules:[]},given:{logic:'and',negate:false,rules:[]}});
export const compare=(a,r,b)=>({eq:a===b,ne:a!==b,ge:a>=b,le:a<=b,gt:a>b,lt:a<b})[r];
const relations=new Set(['eq','ne','ge','le','gt','lt']);
const sign={eq:'=',ne:'≠',ge:'≥',le:'≤',gt:'>',lt:'<'};
const relationText=(relation,target)=>relation==='eq'?`정확히 ${target}개`:relation==='ne'?`${target}개가 아닌`:relation==='ge'?`${target}개 이상`:relation==='gt'?`${target}개 초과`:relation==='le'?`${target}개 이하`:`${target}개 미만`;
const sum=a=>a.reduce((s,x)=>s+x,0);
const indices=(v,n,label)=>{if(!Array.isArray(v)||!v.length||v.length>n||new Set(v).size!==v.length||v.some(i=>!Number.isInteger(i)||i<0||i>=n))throw Error(`${label}의 선택을 확인하세요. 삭제한 색이나 상자를 참조할 수 없습니다.`);return v;};
function expression(source,k){
 const ast=parseExpression(source,k);
 for(const n of polynomial(ast).values())if(Math.abs(n)>999)throw Error('식의 계수는 절댓값 999 이하여야 합니다.');
 const visit=t=>{if(t.type==='number'&&t.value>999)throw Error('식의 상수는 999 이하여야 합니다.');if(t.argument)visit(t.argument);if(t.left)visit(t.left);if(t.right)visit(t.right);};visit(ast);return ast;
}
export function compileBallGroup(group,params,distribution=false){
 group=group??{logic:'and',rules:[],negate:false};
 if(!group||typeof group!=='object'||!Array.isArray(group.rules)||group.rules.length>8||!['and','or'].includes(group.logic)||typeof (group.negate??false)!=='boolean')throw Error('사건마다 조건은 최대 8개이며 모두/하나 이상을 선택하세요.');
 const colors=COLORS.slice(0,params.colorKinds).map(x=>x[1]),boxNames=Array.from({length:params.boxes??0},(_,i)=>String.fromCharCode(65+i));
 const compiled=group.rules.map(r=>{
  if(!r||typeof r!=='object')throw Error('조건 형식을 확인하세요.');
  const permitted=distribution?['eachBox','boxKinds','boxParity','occupiedBoxes','emptyBoxes','monoBoxes','mixedBoxes','allColorsBoxes','boxColorCompare','colorOnlyBoxes','expression']:['count','each','kinds','parity','expression'];
  if(!permitted.includes(r.kind))throw Error('제공된 조건 종류를 선택하세요.');
  const selected=r.colors??colors.map((_,i)=>i),scope=indices(selected,colors.length,'색');
  const colorText=scope.map(i=>colors[i]).join('·');
  let boxes=[];
  if(['eachBox','boxKinds','boxParity','boxColorCompare'].includes(r.kind)){
   boxes=indices(r.boxes??boxNames.map((_,i)=>i),params.boxes,'상자');
   if(!params.boxesDistinct&&boxes.length!==params.boxes)throw Error('구별하지 않는 상자에는 모든 상자에 같은 조건을 적용하세요.');
  }
  if(distribution&&r.kind==='boxColorCompare'&&scope.length!==2)throw Error('색의 수를 비교하는 조건에는 두 색을 선택하세요.');
  if(distribution&&r.kind==='boxColorCompare'&&!relations.has(r.relation))throw Error('두 색의 수를 비교할 관계를 선택하세요.');
  if(distribution&&r.kind==='colorOnlyBoxes'&&scope.length!==1)throw Error('한 가지 색만 든 상자를 세려면 색을 하나만 선택하세요.');
  if(r.kind==='expression'){
   if(distribution&&!params.boxesDistinct)throw Error('상자별 문자식을 쓰려면 상자를 구별하세요.');
   const left=expression(r.left,distribution?params.boxes:colors.length),right=expression(r.right,distribution?params.boxes:colors.length);
   if(!relations.has(r.relation))throw Error('식의 관계를 확인하세요.');
   const diff=new Map(polynomial(left));for(const[k,v]of polynomial(right))diff.set(k,(diff.get(k)??0)-v);if([...diff.values()].some(v=>Math.abs(v)>999))throw Error('양변을 정리한 식의 계수는 999 이하여야 합니다.');
   return {text:`${questionMath(r.left)} ${sign[r.relation]} ${questionMath(r.right)}${distribution?` (각 문자는 해당 상자의 ${colorText} 공 수)` : ''}`,test:data=>{
    const values=distribution?Array.from({length:params.boxes},(_,j)=>sum(scope.map(i=>data[i][j]))):data;
    const a=evaluateExpression(left,values),b=evaluateExpression(right,values);
    if(Math.abs(a)>999||Math.abs(b)>999)throw Error('문자식의 값이 999를 넘습니다. 수량이나 식을 줄이세요.');
    return compare(a,r.relation,b);
   }};
  }
  const parity=r.kind==='parity'||r.kind==='boxParity';
  if(!Number.isInteger(r.target)||Math.abs(r.target)>999||parity&&![0,1].includes(r.target)||!parity&&!relations.has(r.relation))throw Error('조건의 기준값과 관계를 확인하세요.');
  if(!distribution){
   const text=parity?`${colorText} 공의 수의 합이 ${r.target?'홀수':'짝수'}`:r.kind==='count'?`${colorText} 공의 수가 ${relationText(r.relation,r.target)}`:r.kind==='each'?`선택한 각 색의 공이 ${relationText(r.relation,r.target)}`:`뽑힌 공의 색 종류가 ${relationText(r.relation,r.target).replace('개','종')}`;
   return {text,test:a=>r.kind==='each'?scope.every(i=>compare(a[i],r.relation,r.target)):parity?sum(scope.map(i=>a[i]))%2===r.target:compare(r.kind==='kinds'?scope.filter(i=>a[i]>0).length:sum(scope.map(i=>a[i])),r.relation,r.target)};
  }
  const boxLabel=boxes.length===params.boxes?'각 상자':boxes.map(i=>boxNames[i]).join('·')+' 상자 각각';
  const labels={eachBox:`${boxLabel}에 들어 있는 ${colorText} 공의 수`,boxKinds:`${boxLabel}에 들어 있는 ${colorText} 색의 종류 수`,boxParity:`${boxLabel}에 들어 있는 ${colorText} 공의 수`,occupiedBoxes:'공이 들어 있는 상자 수',emptyBoxes:'빈 상자 수',monoBoxes:'한 색의 공만 들어 있는 상자 수',mixedBoxes:'두 색 이상의 공이 들어 있는 상자 수',allColorsBoxes:`${colorText} 공이 모두 들어 있는 상자 수`,colorOnlyBoxes:`${colorText} 공만 들어 있는 상자 수`};
  if(r.kind==='boxColorCompare')return {
   text:`${boxLabel}에서 ${colors[scope[0]]} 공의 수 ${sign[r.relation]} ${colors[scope[1]]} 공의 수`,
   test:matrix=>boxes.every(j=>compare(matrix[scope[0]][j],r.relation,matrix[scope[1]][j]))
  };
  const threshold=relationText(r.relation,r.target);
  const thresholdText=r.kind==='boxKinds'?threshold.replace('개','종'):threshold;
  const text=r.kind==='colorOnlyBoxes'&&r.target===0&&r.relation==='eq'?`${colorText} 공만 들어 있는 상자는 없다`:parity?`${labels[r.kind]}가 ${r.target?'홀수':'짝수'}`:`${labels[r.kind]}가 ${thresholdText}`;
  return {text,test:matrix=>{
   const totals=Array.from({length:params.boxes},(_,j)=>sum(matrix.map(row=>row[j]))),kinds=Array.from({length:params.boxes},(_,j)=>scope.filter(i=>matrix[i][j]>0).length);
   if(r.kind==='eachBox'||parity)return boxes.every(j=>{const n=sum(scope.map(i=>matrix[i][j]));return parity?n%2===r.target:compare(n,r.relation,r.target);});
   if(r.kind==='boxKinds')return boxes.every(j=>compare(kinds[j],r.relation,r.target));
   const n=r.kind==='occupiedBoxes'?totals.filter(x=>x>0).length:r.kind==='emptyBoxes'?totals.filter(x=>x===0).length:r.kind==='monoBoxes'?totals.filter((_,j)=>matrix.filter(row=>row[j]>0).length===1).length:r.kind==='mixedBoxes'?totals.filter((_,j)=>matrix.filter(row=>row[j]>0).length>=2).length:r.kind==='colorOnlyBoxes'?totals.filter((_,j)=>matrix[scope[0]][j]>0&&matrix.every((row,i)=>i===scope[0]||row[j]===0)).length:kinds.filter(x=>x===scope.length).length;
   return compare(n,r.relation,r.target);
  }};
 });
 const joined=compiled.map(x=>x.text).join(group.logic==='and'?'이고 ':'또는 ');
 const text=compiled.length?group.negate?group.logic==='and'?`다음 조건을 모두 만족하지는 않는다: ${joined}`:`다음 조건 중 어느 것도 만족하지 않는다: ${joined}`:joined:group.negate?'조건을 만족시키는 경우가 없다':'';
 return {empty:compiled.length===0&&!group.negate,text:compiled.length?text:group.negate?text:'제한 없음',conditions:group.logic==='and'&&!group.negate?compiled.map(rule=>rule.text):[text],test:data=>{
  const matches=compiled.length===0?true:group.logic==='and'?compiled.every(x=>x.test(data)):compiled.some(x=>x.test(data));return group.negate?!matches:matches;
 }};
}
