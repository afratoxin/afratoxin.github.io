// Deterministic, inspectable query compilation. Unrecognized prose is kept for
// full-document retrieval; only recognized clauses become eligibility rules.
export const normalizeSearchText=value=>String(value??'').normalize('NFKC').toLocaleLowerCase('ko').replace(/\s+/g,' ').trim();
const compact=value=>normalizeSearchText(value).replace(/[\s·ㆍ,–−-]/g,'');
const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const aliasPattern=value=>[...normalizeSearchText(value).replace(/[\s·ㆍ–−-]/g,'')].map(escape).join('[\\s·ㆍ–−-]*');
const tag=(key,label,aliases,terms=[label])=>({key,kind:'tag',label,aliases,terms});
const feature=(key,label,aliases)=>({key,kind:'feature',label,aliases});
const catalog=[
 tag('law','법률',['법률','법학','형법','형사','민법','법적'],['법률','법','형사·증거','법일반·해석','사법·민사절차','민사','공법','국제법','형법','민법','헌법','행정법']),
 tag('humanities','인문',['인문학','인문'],['인문']),
 tag('philosophy','철학',['철학'],['철학']),
 tag('logic','논리학',['논리학'],['논리학']),
 tag('science','과학',['과학기술','과학·기술','자연과학','과학 소재','과학'],['과학','과학·기술','물리','물리학','생물','생물학','화학','지구과학','정보과학','기타 과학']),
 tag('social','사회',['사회 소재','사회 분야','사회'],['사회','일반사회','경제학','정치학','심리학','언론학']),
 tag('physics','물리학',['물리학','물리'],['물리','물리학','역학','천체물리학','원자물리학']),
 tag('biology','생물학',['생물학','생물','생명과학'],['생물','생물학','생화학','미생물학','유전학']),
 tag('economics','경제학',['경제학','경제 소재','경제 분야','경제'],['경제학','미시경제학','거시경제학','게임이론']),
 tag('strength','강화·약화',['강화·약화','강화약화','강화 및 약화','강화와 약화','강화','약화'],['강화·약화']),
 tag('probability','확률·조건부 판단',['조건부확률','조건부 확률','확률·조건부 판단','베이즈','확률 판단'],['확률·조건부 판단','조건부확률','조건부 확률']),
 feature('calculation','수식 계산',['수식계산','계산하기','계산','산출','산정']),
 feature('independent','독립 선택지형',['독립선택지형','독립선택지','독립선지','단일정답','단순선택형']),
 feature('combination','보기 조합형',['합답형','조합형','보기조합','ㄱㄴㄷ조합']),
 feature('completion','빈칸 완성',['빈칸','공란','채워넣','끼워넣']),
 feature('table','표·도표',['도표','표 형식','표가 있는','표 있는','표를 포함','표 포함','표 없는','표 없이','행렬','시간표','조건표','점수표']),
 feature('diagram','그림·도식',['그림','그래프','도식','순서도','흐름도','배치도','관계도','지도']),
 feature('arrangement','배열·배치',['배열','자리배정','순서배정','위치관계']),
 feature('container','상자·용기',['상자','박스']),
 feature('fiveChoice','5지선다',['5지선다','오지선다','다섯지선다','5개선택지','5개선지','선택지5개','선지5개']),
 feature('rItem','ㄹ 항목 포함',['ㄱㄴㄷㄹ','ㄹ 항목','ㄹ 선지','ㄹ 보기']),
 feature('physical','몸싸움',['몸싸움','주먹질','주먹','폭행','구타','멱살']),
];
const extraTags=['정보과학','수학','기타 과학','정치학','역사학','심리학','화학','언론학','언어학','일반사회','지구과학','국제법','미학','문학','공법','법일반·해석','사법·민사절차','형사·증거','논리 퍼즐','거짓말 찾기','논증 평가','논증 구조','모형·수리 추론','실험 분석','관점 비교','규칙·사례 적용','내용 추론','조건 추론','조건문 연결','숨은 전제','경우 분류','대응·배치','순서·우선순위','비율·절대량','규범·가치 판단','차이 비교','논증구조','경쟁가설 판별','변수 통제','인과·상관 구별','비례·반비례','방향·증감 추론','개념·기준 적용','관련성·중립','변화량 비교','전제·추론 비판','모순·양립가능성','필요·충분 구별','필요충분조건','표현·범위 해석','개입·경로 추적','대우','선언·소거','경우의 수','반례 구성','원칙·예외 적용','집합·포함관계','반사실 조건 비교','보편 원칙 적용','귀류법','기댓값 계산','비둘기집 원리','최솟값·최댓값'];
extraTags.push('배열하기','대응·분류','경로·관계','술어논리','논증 구조도','자연과학 실험','사회과학 실험','실험 방법론','주장 귀속 혼동','수단–목적 평가','대소·성분별 비교','근거의 신뢰성 변화','근거–결론 연결 변화','대안 설명 평가','논점 무관','예측·반례 대조','평가 방향 역전','경쟁 주장 관계 오인','정보 부족·방향 미정','수단·목적 분석','논점·범위 바꿔치기','관련되지만 중립','결론과 근거 혼동');
for(const label of extraTags)catalog.push(tag(`tag:${compact(label)}`,label,[label]));
const negative=/^(?:\s*(?:은|는|을|를|이|가|의|도|소재|문항|문제|풀이|형식|에\s*관한|에\s*대한))*\s*(?:(?:거의|별로|전혀|굳이|크게|많이)\s*)?(?:필요(?:가)?\s*없\S*|(?:필요하지|포함되지|포함하지|들어가지|쓰지|사용하지|요구하지|요구되지|하지)\s*않\S*|안\s*(?:하|쓰|사용|요구)\S*|아닌|아니라|아니고|아니어야|말고|제외(?:하고|한|하는|해줘)?|빼고|빼줘|배제|없이|없(?:는|고|어야|다|어|음)\S*|않는)/;
const required=/^(?:\s*(?:은|는|을|를|이|가|의|도))*\s*(?:필수|반드시\s*포함|꼭\s*포함|포함(?:하는|된|할|해줘)?)/;
const join=(op,children)=>children.length===1?children[0]:{op,children};

function taxonomyLabels(taxonomy){
 const result=[];
 const visit=value=>{if(Array.isArray(value)){for(const entry of value)visit(entry);}else if(value&&typeof value==='object'){if(typeof value.label==='string')result.push(value.label);for(const [key,entry] of Object.entries(value))if(key!=='label')visit(entry);}};
 visit(taxonomy);return result;
}

export function compileSearchIntent(query,taxonomy){
 const raw=String(query??'').normalize('NFKC').trim(),text=normalizeSearchText(raw),hits=[],occupied=new Set();
 const add=(start,end,definition,extra={})=>{if([...Array(end-start)].some((_,i)=>occupied.has(start+i)))return;for(let i=start;i<end;i++)occupied.add(i);hits.push({...definition,...extra,start,end,raw:text.slice(start,end)});};
 // Quoted phrases are exact literal requirements, including unfamiliar words.
 for(const m of text.matchAll(/["“「『]([^"”」』]+)["”」』]|'([^']+)'/g))add(m.index,m.index+m[0].length,{key:`literal:${compact(m[1]||m[2])}`,kind:'literal',label:m[1]||m[2],terms:[m[1]||m[2]]});
 const exact=text.match(/^#?(p\d{3}|\d{4})(?:번(?:\s*문항)?)?$/i);
 if(exact)add(0,text.length,{key:`id:${exact[1]}`,kind:'id',label:`내부 ID ${exact[1]}`,value:exact[1]});
 else{
  for(const m of text.matchAll(/(?:\b|#)(p\d{3}|0\d{3})(?=\s|$|[,.!?])/gi))add(m.index,m.index+m[0].length,{key:`id:${m[1]}`,kind:'id',label:`내부 ID ${m[1]}`,value:m[1]});
  for(const m of text.matchAll(/(20\d{2})\s*(?:학년도|년도|년)?\s*(?:~|부터|–|-)\s*(20\d{2})\s*(?:학년도|년도|년)?(?:까지)?/g)){const from=Number(m[1]),to=Number(m[2]);add(m.index,m.index+m[0].length,{key:`year:${from}:${to}`,kind:'yearRange',label:`${from}~${to}학년도`,from,to});}
  for(const m of text.matchAll(/(20\d{2})\s*(?:학년도|년도|년)?\s*(이후|이전|이상|이하)/g)){const year=Number(m[1]),after=/이후|이상/.test(m[2]);add(m.index,m.index+m[0].length,{key:`year:${year}:${m[2]}`,kind:'yearRange',label:`${year}학년도 ${m[2]}`,from:after?year:0,to:after?9999:year});}
  for(const m of text.matchAll(/\b(20\d{2})\s*(?:학년도|년도|년)?/g)){const year=Number(m[1]);add(m.index,m.index+m[0].length,{key:`year:${year}`,kind:'year',label:`${year}학년도`,value:year});}
  for(const m of text.matchAll(/(?:문항|문제)\s*(p\d{3}|\d{4})\s*번/gi))add(m.index,m.index+m[0].length,{key:`id:${m[1]}`,kind:'id',label:`내부 ID ${m[1]}`,value:m[1]});
  for(const m of text.matchAll(/(?:제\s*)?(\d{1,2})\s*번/g))add(m.index,m.index+m[0].length,{key:`number:${m[1]}`,kind:'number',label:`실제 ${Number(m[1])}번`,value:Number(m[1])});
  for(const m of text.matchAll(/예비시험|본시험/g))add(m.index,m.index+m[0].length,{key:`exam:${m[0]}`,kind:'exam',label:m[0],value:m[0]});
 }
 const definitions=[...catalog,...taxonomyLabels(taxonomy).filter(label=>label.length>=2&&!catalog.some(d=>d.aliases.includes(label))).map(label=>tag(`tag:${compact(label)}`,label,[label]))];
 for(const m of text.matchAll(/(?:^|[\s(])표(?=\s|은|는|이|가|을|를|와|과|의|없|제외|포함|있)/g)){
   const start=m.index+m[0].length-1;add(start,start+1,definitions.find(d=>d.key==='table'));
 }
 const occurrences=[];
 for(const d of definitions)for(const alias of d.aliases)for(const m of text.matchAll(new RegExp(aliasPattern(alias),'gu')))occurrences.push({start:m.index,end:m.index+m[0].length,d});
 occurrences.sort((a,b)=>(b.end-b.start)-(a.end-a.start)||a.start-b.start);
 for(const h of occurrences){
  // '표 없는' contains the scope marker; keep it outside the feature span.
  const suffix=h.d.key==='table'?text.slice(h.start,h.end).match(/\s*(?:없는|없이)$/):null;
  add(h.start,h.end-(suffix?.[0].length||0),h.d);
 }
 // A shared comparison is a prose search, not necessarily a two-speaker script.
 if(/논쟁|논박|반박|싸우|대화/.test(text)&&!/몸싸움|주먹|폭행|구타/.test(text)){
  for(const m of text.matchAll(/(?:2|두|둘)\s*(?:명(?:의)?|사람|화자)|둘이/g))add(m.index,m.index+m[0].length,{key:'two',kind:'feature',label:'원문 화자 2명'});
 }
 // Unknown terms explicitly marked required/excluded remain hard literals.
 for(const m of text.matchAll(/([\p{L}\p{N}_-]{2,})(?:은|는|을|를|이|가)?\s*(?:제외|빼고|배제|없이|없는|필수|반드시\s*포함|꼭\s*포함)/gu)){
  if([...Array(m[1].length)].some((_,i)=>occupied.has(m.index+i)))continue;
  const word=m[1].replace(/(?:은|는|을|를|이|가)$/,'');
  if(!/^(?:문항|문제|소재|형식|조건|계산이|필요|거의|반드시|자료|내용|관련|관계|상관|아무|없는)$/.test(word))add(m.index,m.index+word.length,{key:`literal:${compact(word)}`,kind:'literal',label:word,terms:[word]});
 }
 hits.sort((a,b)=>a.start-b.start);
 const masked=[...text];
 for(const [index,h] of hits.entries()){
  const tail=text.slice(h.end,hits[index+1]?.start??text.length),double=tail.match(/^\s*(?:(?:은|는|을|를|이|가)\s*)?(?:(?:제외|배제)하지\s*(?:말고|말아|않는|않고)|아닌\s*(?:것|문항|문제)(?:은|는|을|를)?\s*제외|없지\s*않\S*)/),neg=double?null:tail.match(negative),req=tail.match(required);
  const prefix=text.slice(hits[index-1]?.end??0,h.start).match(/(?:^|\s)(?:제외|배제|without|not)\s*$/i);
  h.negated=Boolean(neg||prefix);h.id=`c${index+1}`;
  h.end+=Math.max(neg?.[0].length||0,req?.[0].length||0,double?.[0].length||0);
  for(let i=h.start;i<h.end;i++)masked[i]=' ';
 }
 // A trailing exclusion on a simple coordinated list applies to that list.
 // '이면서' starts a distinct requirement and deliberately does not propagate.
 for(let i=hits.length-1;i>0;i--)if(hits[i].negated&&/^(?:\s*(?:과|와|및|,))\s*$/.test(text.slice(hits[i-1].end,hits[i].start)))hits[i-1].negated=true;
 // Tokenize parentheses and connectors only between recognized clauses. Implicit
 // adjacency is AND; OR binds more tightly so 'A 또는 B 계산 제외' is (A|B)&!calc.
 const tokens=[];
 let previous=0;
 const gapTokens=gap=>{for(const m of gap.matchAll(/\(|\)\s*(?:제외|빼고|없이|없는)|\)|또는|혹은|이나|\bor\b|\|\||\||그리고|이면서|\band\b|&&/gi)){
   if(m[0].startsWith(')')){tokens.push(')');if(m[0].length>1)tokens.push('negate');}
   else tokens.push(m[0]==='('? '(' :/또는|혹은|이나|\bor\b|\|/i.test(m[0])?'or':'and');
 }};
 for(const h of hits){gapTokens(text.slice(previous,h.start));tokens.push({op:'clause',id:h.id});previous=h.end;}gapTokens(text.slice(previous));
 let pos=0;const syntaxWarnings=[];
 const invert=node=>{if(!node)return node;if(node.op==='clause'){const h=hits.find(h=>h.id===node.id);h.negated=!h.negated;return node;}return {op:node.op==='or'?'and':'or',children:node.children.map(invert)};};
 const parseAtom=()=>{if(tokens[pos]==='('){pos++;let n=parseAnd();if(tokens[pos]===')')pos++;else syntaxWarnings.push('닫는 괄호가 없어 문장 끝까지 같은 범위로 해석');if(tokens[pos]==='negate'){pos++;n=invert(n);}return n;}const t=tokens[pos++];return typeof t==='object'?t:null;};
 const parseOr=()=>{const children=[];let atom=parseAtom();if(atom)children.push(atom);while(tokens[pos]==='or'){pos++;atom=parseAtom();if(atom)children.push(atom);}return children.length?join('or',children):null;};
 const parseAnd=()=>{const children=[];while(pos<tokens.length&&tokens[pos]!==')'){if(tokens[pos]==='and'){pos++;continue;}const n=parseOr();if(n)children.push(n);}return children.length?join('and',children):null;};
 const parts=[parseAnd()].filter(Boolean);
 // Stray punctuation must never silently discard later required clauses.
 while(pos<tokens.length){if(tokens[pos]===')'){pos++;syntaxWarnings.push('짝이 없는 닫는 괄호를 무시하고 뒤의 조건도 적용');}else{const rest=parseAnd();if(rest)parts.push(rest);}}
 const expression=parts.length?join('and',parts):null;
 const clauses=hits.map(({start,end,aliases,...h})=>h);
 const mandatory=node=>!node?[]:node.op==='clause'?[clauses.find(c=>c.id===node.id)]:node.op==='and'?node.children.flatMap(mandatory):[];
 const must=mandatory(expression),contradictions=[];
 for(const clause of must)if(must.some(other=>other.key===clause.key&&other.negated!==clause.negated)&&!contradictions.includes(clause.label))contradictions.push(clause.label);
 for(const kind of ['id','year','number','exam']){const vals=new Set(must.filter(c=>c.kind===kind&&!c.negated).map(c=>c.value));if(vals.size>1)contradictions.push(`${kind} 조건 충돌`);}
 // Check nested alternatives symbolically as well: A&(B|C)&!B&!C is a
 // contradiction even though the conflict is not visible at the top level.
 let budget=2048;
 const merge=(a,b)=>{
   const all=[...a,...b];
   for(const c of all)if(all.some(d=>d.key===c.key&&d.negated!==c.negated))return null;
   for(const kind of ['id','year','number','exam'])if(new Set(all.filter(c=>c.kind===kind&&!c.negated).map(c=>c.value)).size>1)return null;
   if(all.some(c=>c.key==='independent'&&!c.negated)&&all.some(c=>c.key==='combination'&&!c.negated))return null;
   const years=all.filter(c=>!c.negated&&['year','yearRange'].includes(c.kind));
   if(years.length&&Math.max(...years.map(c=>c.from??c.value))>Math.min(...years.map(c=>c.to??c.value)))return null;
   return all;
 };
 const branches=node=>{
   if(--budget<0)return null;if(!node)return [[]];if(node.op==='clause')return [[clauses.find(c=>c.id===node.id)]];
   if(node.op==='or'){const result=[];for(const child of node.children){const b=branches(child);if(!b)return null;result.push(...b);}return result;}
   let result=[[]];for(const child of node.children){const b=branches(child);if(!b)return null;const next=[];for(const a of result)for(const c of b){if(--budget<0)return null;const merged=merge(a,c);if(merged)next.push(merged);}result=next;}return result;
 };
 const satisfiable=branches(expression);if(satisfiable&&satisfiable.length===0&&!contradictions.length)contradictions.push('필수·제외 및 대안 조건이 서로 충돌');
 const unparsed=masked.join('').replace(/\b(?:and|or|not)\b|[()|&]/gi,' ').replace(/또는|혹은|그리고|이면서|필수|제외|빼고|말고|반드시|꼭/g,' ').replace(/(?:^|\s)(?:에서|에|의|문항|문제|소재|풀이|형식|찾아줘|찾아|검색|추천|인|이|가|은|는|을|를|와|과|및|학년도|년도|년)(?=\s|$)/g,' ').replace(/\s+/g,' ').trim();
 return {raw,clauses,expression,required:clauses.filter(c=>!c.negated),excluded:clauses.filter(c=>c.negated),unparsed,uncertain:[...(unparsed?[unparsed]:[]),...new Set(syntaxWarnings)],syntaxWarnings:[...new Set(syntaxWarnings)],contradictions};
}

export function describeSearchIntent(intent){
 const render=node=>!node?'':node.op==='clause'?(()=>{const c=intent.clauses.find(c=>c.id===node.id);return `${c.negated?'제외: ':''}${c.kind==='literal'?`“${c.label}”`:c.label}`;})():node.children.map(child=>child.op!=='clause'&&child.op!==node.op?`(${render(child)})`:render(child)).join(node.op==='or'?' 또는 ':' + ');
 return [render(intent.expression),intent.unparsed?`설명 검색: ${intent.unparsed}`:'',intent.contradictions.length?`조건 충돌: ${intent.contradictions.join(', ')}`:'',...(intent.syntaxWarnings||[])].filter(Boolean).join(' · ');
}
