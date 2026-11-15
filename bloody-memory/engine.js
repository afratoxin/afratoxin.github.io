'use strict';
(function(root){
const int=(a,b,r=Math.random)=>a+Math.floor(r()*(b-a+1));
function shuffle(a,r=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=int(0,i,r);[a[i],a[j]]=[a[j],a[i]];}return a;}
const DIRS=[[1,0],[0,1],[-1,0],[0,-1]];
// Original vector line patterns; directions are meaningful and fixed to the map.
const PATTERNS=[
 {name:'오른쪽 위 곡선',d:'M0 0A100 100 0 0 1 100 100'},
 {name:'오른쪽 아래 곡선',d:'M100 0A100 100 0 0 1 0 100'},
 {name:'왼쪽 아래 곡선',d:'M0 0A100 100 0 0 0 100 100'},
 {name:'왼쪽 위 곡선',d:'M100 0A100 100 0 0 0 0 100'},
 {name:'왼쪽 위 꺾임',d:'M0 50H50V0'},
 {name:'오른쪽 위 꺾임',d:'M50 0V50H100'},
 {name:'오른쪽 아래 꺾임',d:'M100 50H50V100'},
 {name:'왼쪽 아래 꺾임',d:'M50 100V50H0'},
 {name:'왼쪽 화살선',d:'M100 0L50 50 100 100'},
 {name:'위쪽 화살선',d:'M0 100L50 50 100 100'},
 {name:'오른쪽 화살선',d:'M0 0L50 50 0 100'},
 {name:'아래쪽 화살선',d:'M0 0L50 50 100 0'},
 {name:'세로선',d:'M50 0V100'},
 {name:'가로선',d:'M0 50H100'},
 {name:'오른쪽 내려가는 대각선',d:'M0 0L100 100'},
 {name:'오른쪽 올라가는 대각선',d:'M0 100L100 0'},
 {name:'왼쪽 반원',d:'M50 0A50 50 0 0 0 50 100'},
 {name:'위쪽 반원',d:'M0 50A50 50 0 0 1 100 50'},
 {name:'오른쪽 반원',d:'M50 0A50 50 0 0 1 50 100'},
 {name:'아래쪽 반원',d:'M0 50A50 50 0 0 0 100 50'},
 {name:'큰 원',circle:43},{name:'작은 원',circle:12},
 {name:'이중 원',circle:43,inner:12},
 {name:'마름모',d:'M50 3L97 50 50 97 3 50Z'},
 {name:'물결선',d:'M50 0C95 25 5 25 50 50S5 75 50 100'}
];
function patternSVG(id,label='패턴'){
 const p=PATTERNS[id];if(!p)throw Error('Unknown pattern');
 return '<svg class="line-pattern" viewBox="0 0 100 100" role="img" aria-label="'+label+'"><g fill="none" stroke="currentColor" stroke-width="5.5" stroke-linecap="square" stroke-linejoin="miter">'+(p.d?'<path d="'+p.d+'"/>':'<circle cx="50" cy="50" r="'+p.circle+'"/>')+(p.inner?'<circle cx="50" cy="50" r="'+p.inner+'"/>':'')+'</g></svg>';
}
const cellKey=([x,y])=>x+','+y;
function footprint(r=Math.random,rectangle=false){
 if(rectangle)return Array.from({length:10},(_,i)=>[i%5,Math.floor(i/5)]);
 const cells=[[2,2]],used=new Set(['2,2']);
 while(cells.length<10){const options=[];for(const [x,y]of cells)for(const [dx,dy]of DIRS){const c=[x+dx,y+dy];if(c[0]>=0&&c[0]<5&&c[1]>=0&&c[1]<5&&!used.has(cellKey(c)))options.push(c);}const c=options[int(0,options.length-1,r)];cells.push(c);used.add(cellKey(c));}
 const minX=Math.min(...cells.map(c=>c[0])),minY=Math.min(...cells.map(c=>c[1]));return cells.map(([x,y])=>[x-minX,y-minY]);
}
function blockQuestion(map,r=Math.random,rectangle=false){
 const values=shuffle(Array.from({length:25},(_,i)=>i+1),r).slice(0,7);while(values.length<10)values.push(int(1,25,r));
 const cells=footprint(r,rectangle).map(([x,y],i)=>({x,y,value:values[i],pattern:map[values[i]-1]}));
 return{width:1+Math.max(...cells.map(c=>c.x)),height:1+Math.max(...cells.map(c=>c.y)),cells};
}
function validCells(q,placements){
 const target=new Map(q.cells.map(c=>[cellKey([c.x,c.y]),c.value]));
 return placements.length===target.size&&new Set(placements.map(c=>cellKey([c.x,c.y]))).size===target.size&&placements.every(c=>Number.isInteger(c.value)&&c.value>=1&&c.value<=25&&target.get(cellKey([c.x,c.y]))===c.value);
}
function editCells(q,placements,action){
 const inside=p=>p&&Number.isInteger(p.x)&&Number.isInteger(p.y)&&q.cells.some(c=>c.x===p.x&&c.y===p.y),at=(a,p)=>a.find(c=>c.x===p.x&&c.y===p.y),without=(a,p)=>a.filter(c=>c.x!==p.x||c.y!==p.y);
 if(!inside(action))return placements;
 if(action.type==='place'){
  if(action.value!==null&&(!Number.isInteger(action.value)||action.value<1||action.value>25))return placements;
  const next=without(placements,action);return action.value===null?next:[...next,{x:action.x,y:action.y,value:action.value}];
 }
 if(action.type==='move'&&inside(action.from)){
  if(action.x===action.from.x&&action.y===action.from.y)return placements;const source=at(placements,action.from),target=at(placements,action);if(!source)return placements;
  const next=without(without(placements,action.from),action);next.push({x:action.x,y:action.y,value:source.value});if(target)next.push({x:action.from.x,y:action.from.y,value:target.value});return next;
 }return placements;
}
function patternRun(r=Math.random){
 const maps=[shuffle(Array.from({length:25},(_,i)=>i),r),shuffle(Array.from({length:25},(_,i)=>i),r)];
 return{maps,questions:maps.flatMap(map=>Array.from({length:3},(_,i)=>blockQuestion(map,r,i===0)))};
}
// A board uses exactly one vocabulary, with deliberately similar symbols within it.
const HIDDEN_THEMES={hanja:{label:'한자판',hint:'비슷한 한자의 획과 위치를 구분하세요.'},letters:{label:'글자판',hint:'닮은 자음과 쌍자음을 구분하세요.'},picture:{label:'그림판',hint:'같은 도형의 회전 방향과 작은 점의 위치를 구분하세요.'}};
const HIDDEN_SYMBOLS=[
 ...Array.from('日曰目自白百田由甲申旦早旧旭月用甩冊皿且具直真首').map(glyph=>({group:'hanja',family:'hanja',glyph})),
 ...Array.from('ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ').map(glyph=>({group:'letters',family:'consonants',glyph})),
 ...['frame','ring','arrow'].flatMap(family=>Array.from({length:6},(_,variant)=>Array.from({length:4},(_,rotation)=>({group:'picture',family,variant,rotation}))).flat())
];
function hiddenSymbolSVG(id,label='그림'){
 const p=HIDDEN_SYMBOLS[id];if(!p)throw Error('Unknown hidden symbol');
 let body;if(p.glyph)body='<text x="50" y="53" dominant-baseline="central" text-anchor="middle" fill="currentColor" font-family="Noto Sans CJK KR, Malgun Gothic, sans-serif" font-size="65" font-weight="650">'+p.glyph+'</text>';
 else{
  const paths={frame:'M38 15H15V85H85V15H57',ring:'M38 17A35 35 0 1 0 62 17',arrow:'M50 12L84 46H64V86H36V46H16Z'},points=p.family==='arrow'?[[43,48],[57,48],[43,62],[57,62],[43,76],[57,76]]:[[30,32],[50,32],[70,32],[30,64],[50,64],[70,64]],[x,y]=points[p.variant];
  body='<g transform="rotate('+p.rotation*90+' 50 50)"><path d="'+paths[p.family]+'" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="miter"/><circle cx="'+x+'" cy="'+y+'" r="4" fill="currentColor"/></g>';
 }
 return '<svg class="line-pattern" viewBox="0 0 100 100" role="img" aria-label="'+label+'">'+body+'</svg>';
}
const MISSIONS=[
 [
  "지구에서 가장 가까우며 밤하늘에서 볼 수 있는 자연위성의 이름은?",
  [
   "달"
  ]
 ],
 [
  "아시아와 아메리카 대륙 사이에 있는 전 세계의 가장 넓은 바다는?",
  [
   "태평양"
  ]
 ],
 [
  "태양계의 여섯 번째 행성이며 커다란 고리로 유명한 행성의 이름은?",
  [
   "토성"
  ]
 ],
 [
  "식물이 햇빛과 물과 이산화탄소를 이용해 영양분을 만드는 작용이란?",
  [
   "광합성"
  ]
 ],
 [
  "호랑나비와 배추흰나비처럼 큰 날개로 꽃 사이를 나는 곤충 이름은?",
  [
   "나비"
  ]
 ],
 [
  "다리가 여덟 개이며 영어로 옥토퍼스라 부르는 바다 동물의 이름은?",
  [
   "문어"
  ]
 ],
 [
  "등에 나선형의 집을 지고 정말로 느리게 기어다니는 동물의 이름은?",
  [
   "달팽이"
  ]
 ],
 [
  "흑백 털로 덮인 몸을 지녔으며 주로 대나무를 먹는 동물의 이름은?",
  [
   "판다",
   "자이언트판다"
  ]
 ],
 [
  "바다에 살며 지구에 사는 동물 중 몸집이 가장 큰 포유류 이름은?",
  [
   "대왕고래",
   "흰긴수염고래"
  ]
 ],
 [
  "액체 상태인 물을 충분히 차갑게 식히면 만들어지는 고체의 이름은?",
  [
   "얼음"
  ]
 ],
 [
  "지구상의 물체를 지구 중심 방향으로 끌어당기는 힘을 일컫는 말은?",
  [
   "중력",
   "만유인력"
  ]
 ],
 [
  "자석의 두 극 중 나침반에서 북쪽을 가리키는 극을 무엇이라 하나?",
  [
   "N극",
   "엔극",
   "북극"
  ]
 ],
 [
  "원에서 중심부터 원 위의 어느 점까지 이은 선분의 길이의 명칭은?",
  [
   "반지름",
   "반경"
  ]
 ],
 [
  "평면상에 그린 삼각형의 세 내각의 크기를 모두 더하면 몇 도인가?",
  [
   "180",
   "180도",
   "백팔십도"
  ]
 ],
 [
  "넓이가 사십구인 정사각형에서 한 변의 길이를 자연수로 나타낸다면?",
  [
   "7",
   "칠"
  ]
 ],
 [
  "일에서 십까지의 각 자연수를 하나씩 빠짐없이 더한 값은 얼마인가?",
  [
   "55",
   "오십오"
  ]
 ],
 [
  "이와 삼으로 모두 나누어떨어지는 가장 작은 양의 정수는 얼마인가?",
  [
   "6",
   "육"
  ]
 ],
 [
  "일보다 큰 자연수인 소수들 중에서 유일한 짝수는 어떠한 숫자인가?",
  [
   "2",
   "이"
  ]
 ],
 [
  "월요일부터 다음 일요일까지 일주일을 이루는 날은 모두 몇 날인가?",
  [
   "7",
   "7일",
   "칠일"
  ]
 ],
 [
  "자정부터 다음날 자정까지 하루를 이루는 시간은 모두 몇 시간인가?",
  [
   "24",
   "24시간",
   "스물네시간",
   "이십사시간"
  ]
 ],
 [
  "백성들이 쉽게 글을 읽도록 훈민정음을 창제한 조선 시대의 임금은?",
  [
   "세종",
   "세종대왕"
  ]
 ],
 [
  "임진왜란에서 거북선과 수군을 이끌고 왜군을 물리친 조선의 장군은?",
  [
   "이순신",
   "이순신장군"
  ]
 ],
 [
  "한강물이 도시 한가운데를 흐르며 대한민국의 수도인 도시의 이름은?",
  [
   "서울",
   "서울특별시"
  ]
 ],
 [
  "네 모서리에 건곤감리가 있고 가운데 태극이 그려진 국기의 이름은?",
  [
   "태극기"
  ]
 ],
 [
  "우리나라의 국화이며 여름에 피고 아침에 피었다 지는 꽃의 이름은?",
  [
   "무궁화"
  ]
 ],
 [
  "지구의 자전으로 밤과 번갈아 찾아오는 하루 중 밝은 때의 이름은?",
  [
   "낮"
  ]
 ],
 [
  "비가 그친 뒤 하늘에 일곱 가지 빛깔의 둥근 띠로 나타나는 것은?",
  [
   "무지개"
  ]
 ],
 [
  "액체 상태인 물이 가열되어 기체인 수증기로 변하는 현상의 이름은?",
  [
   "기화",
   "증발"
  ]
 ],
 [
  "기체인 수증기가 더 차가워지며 액체인 물로 변하는 현상의 이름은?",
  [
   "액화",
   "응결"
  ]
 ],
 [
  "사람의 머리에서 주변의 소리를 받아들이고 듣는 일을 하는 기관은?",
  [
   "귀"
  ]
 ],
 [
  "입안에서 단맛과 짠맛 등 여러 가지 맛을 느끼는 주 기관 이름은?",
  [
   "혀"
  ]
 ],
 [
  "가슴 안에서 규칙적으로 뛰며 온몸으로 피를 보내는 기관의 이름은?",
  [
   "심장"
  ]
 ],
 [
  "일월부터 차례차례로 셀 때 한 해의 가장 마지막 달은 몇 월인가?",
  [
   "12월",
   "십이월"
  ]
 ],
 [
  "자연수를 크기순으로 셀 때 두 자리인 수 중 가장 작은 자연수는?",
  [
   "10",
   "십"
  ]
 ],
 [
  "평면 도형 중에 세 변의 길이가 서로 모두 같은 삼각형의 이름은?",
  [
   "정삼각형"
  ]
 ],
 [
  "네 각이 다 직각이고 네 변의 길이가 서로 같은 사각형의 이름은?",
  [
   "정사각형"
  ]
 ],
 [
  "바둑에서 두 사람이 번갈아 가며 놓는 돌의 두 가지 색의 이름은?",
  [
   "흑백",
   "검정흰색",
   "검은색흰색",
   "흰색검은색",
   "백흑",
   "흑과백",
   "백과흑",
   "검정과흰색",
   "검은색과흰색",
   "흰색과검은색"
  ]
 ],
 [
  "같은 수 두 개를 서로 곱해 구하는 값을 그 수의 무엇이라 하나?",
  [
   "제곱"
  ]
 ],
 [
  "세계지도에서 바닷물과 육지가 서로 맞닿아 이루는 경계선의 이름은?",
  [
   "해안선"
  ]
 ],
 [
  "피부를 통해 물체가 차갑거나 거친 성질까지 느끼는 감각의 이름은?",
  [
   "촉각",
   "촉감"
  ]
 ]
].map(([question,answers],id)=>({id,question,answers}));
const normalize=value=>String(value).normalize('NFKC').toLowerCase().replace(/[\s.,?!·:;，。？！]/g,'');
function missionRound(mission,r=Math.random,theme=shuffle(Object.keys(HIDDEN_THEMES),r)[0]){
 if([...mission.question].length!==36||mission.question!==mission.question.trim())throw Error('Mission text must fill all 36 cells');
 if(!HIDDEN_THEMES[theme])throw Error('Unknown hidden board theme');
 const family=theme==='picture'?shuffle(['frame','ring','arrow'],r)[0]:theme==='letters'?'consonants':'hanja';
 const pool=HIDDEN_SYMBOLS.map((p,i)=>p.group===theme&&p.family===family?i:null).filter(i=>i!==null),symbols=shuffle(pool,r).slice(0,18),faces=shuffle([...symbols,...symbols],r),letters=Array.from(mission.question);
 return{mission,faces,letters,theme,family};
}
function hiddenRun(r=Math.random){const themes=shuffle(Object.keys(HIDDEN_THEMES),r);return shuffle(MISSIONS,r).slice(0,3).map((m,i)=>missionRound(m,r,themes[i]));}
const correctMission=(p,value)=>p.mission.answers.some(a=>normalize(a)===normalize(value));
const isPair=(p,indices,removed=[])=>indices.length===2&&indices.every(i=>Number.isInteger(i)&&i>=0&&i<36&&!removed.includes(i))&&indices[0]!==indices[1]&&p.faces[indices[0]]===p.faces[indices[1]];
const api={int,shuffle,DIRS,PATTERNS,patternSVG,footprint,blockQuestion,validCells,editCells,patternRun,HIDDEN_THEMES,HIDDEN_SYMBOLS,hiddenSymbolSVG,MISSIONS,normalize,missionRound,hiddenRun,correctMission,isPair};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.BloodyMemory=api;
})(typeof window!=='undefined'?window:globalThis);
