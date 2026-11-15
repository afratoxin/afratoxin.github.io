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
function blockSet(r=Math.random){
 for(let trial=0;trial<100;trial++){
  const pool=shuffle([...Array.from({length:25},(_,i)=>i+1),...Array.from({length:15},()=>int(1,25,r))],r),blocks=Array.from({length:5},(_,id)=>({id,faces:Array.from({length:4},(_,face)=>pool.slice(id*8+face*2,id*8+face*2+2))}));
  if(blocks.every(b=>b.faces.every(a=>a[0]!==a[1])&&new Set(b.faces.map(a=>[...a].sort((a,b)=>a-b).join())).size===4))return blocks;
 }throw Error('Could not prepare numbered blocks');
}
const cellKey=([x,y])=>x+','+y;
function footprint(r=Math.random,rectangle=false){
 if(rectangle)return Array.from({length:5},(_,x)=>[[x,0],[x,1]]);
 for(let trial=0;trial<200;trial++){
  const pieces=[[[2,2],[3,2]]],used=new Set(pieces[0].map(cellKey));
  for(let i=1;i<5;i++){
   const options=[];
   for(const key of used){const [x,y]=key.split(',').map(Number);for(const [dx,dy]of DIRS){const a=[x+dx,y+dy];if(used.has(cellKey(a)))continue;for(const [ex,ey]of DIRS){const b=[a[0]+ex,a[1]+ey];if(used.has(cellKey(b)))continue;const next=[...used].map(k=>k.split(',').map(Number)).concat([a,b]);if(Math.max(...next.map(c=>c[0]))-Math.min(...next.map(c=>c[0]))>=5||Math.max(...next.map(c=>c[1]))-Math.min(...next.map(c=>c[1]))>=5)continue;options.push([a,b]);}}}
   if(!options.length)break;const piece=options[int(0,options.length-1,r)];pieces.push(piece);piece.forEach(c=>used.add(cellKey(c)));
  }
  if(pieces.length!==5)continue;const all=pieces.flat(),minX=Math.min(...all.map(c=>c[0])),minY=Math.min(...all.map(c=>c[1]));return pieces.map(pair=>pair.map(([x,y])=>[x-minX,y-minY]));
 }throw Error('Could not prepare target footprint');
}
function blockQuestion(blocks,map,r=Math.random,rectangle=false){
 const pieces=footprint(r,rectangle),order=shuffle([0,1,2,3,4],r),sample=[],cells=[];
 pieces.forEach((pair,index)=>{const id=order[index],face=int(0,3,r);let [a,b]=r()<.5?pair:[...pair].reverse();const direction=DIRS.findIndex(([dx,dy])=>a[0]+dx===b[0]&&a[1]+dy===b[1]);sample.push({id,face,direction,x:a[0],y:a[1]});[a,b].forEach(([x,y],k)=>cells.push({x,y,value:blocks[id].faces[face][k],pattern:map[blocks[id].faces[face][k]-1]}));});
 const width=1+Math.max(...cells.map(c=>c.x)),height=1+Math.max(...cells.map(c=>c.y));return{width,height,cells,sample};
}
function placementCells(blocks,p){
 if(!p||!Number.isInteger(p.id)||p.id<0||p.id>=blocks.length||!Number.isInteger(p.face)||p.face<0||p.face>=4||!Number.isInteger(p.direction)||p.direction<0||p.direction>=4||!Number.isInteger(p.x)||!Number.isInteger(p.y))return null;
 const [dx,dy]=DIRS[p.direction];return blocks[p.id].faces[p.face].map((value,k)=>({x:p.x+dx*k,y:p.y+dy*k,value}));
}
function canPlace(blocks,q,placements,p){
 const cells=placementCells(blocks,p);if(!cells)return false;const footprint=new Set(q.cells.map(c=>cellKey([c.x,c.y]))),occupied=new Set(placements.filter(a=>a.id!==p.id).flatMap(a=>placementCells(blocks,a)||[]).map(c=>cellKey([c.x,c.y])));
 return cells.every(c=>footprint.has(cellKey([c.x,c.y]))&&!occupied.has(cellKey([c.x,c.y])));
}
function validBlocks(blocks,q,placements){
 if(placements.length!==5||new Set(placements.map(p=>p.id)).size!==5||placements.some(p=>!canPlace(blocks,q,placements,p)))return false;
 const target=new Map(q.cells.map(c=>[cellKey([c.x,c.y]),c.value])),actual=placements.flatMap(p=>placementCells(blocks,p));return actual.length===10&&actual.every(c=>target.get(cellKey([c.x,c.y]))===c.value);
}
function patternRun(r=Math.random){
 const blocks=blockSet(r),maps=[shuffle(Array.from({length:25},(_,i)=>i),r),shuffle(Array.from({length:25},(_,i)=>i),r)];
 return{blocks,maps,questions:maps.flatMap(map=>Array.from({length:3},(_,i)=>blockQuestion(blocks,map,r,i===0)))};
}
const MISSIONS=[
 ['밤하늘에 보이며 지구 둘레를 도는 천체의 이름은?',['달']],
 ['지구의 바다 중 가장 넓은 면적을 차지하는 바다의 이름은?',['태평양']],
 ['태양계에서 커다란 고리로 잘 알려진 행성의 이름은?',['토성']],
 ['식물이 햇빛을 이용해 스스로 양분을 만들어 내는 작용은?',['광합성']],
 ['호랑나비와 배추흰나비를 통틀어 부르는 곤충의 이름은?',['나비']],
 ['다리가 여덟 개이며 영어로 옥토퍼스라 부르는 동물은?',['문어']],
 ['등에 나선형 집을 지고 천천히 기어다니는 동물의 이름은?',['달팽이']],
 ['흑백의 몸을 지녔으며 대나무를 주로 먹는 동물의 이름은?',['판다','자이언트판다']],
 ['바다에 살며 지구에서 몸집이 가장 큰 포유류의 이름은?',['대왕고래','흰긴수염고래']],
 ['물을 차갑게 하여 얼렸을 때 생기는 고체 상태의 물질은?',['얼음']],
 ['물체를 지구 중심 방향으로 끌어당기는 힘의 이름은?',['중력','만유인력']],
 ['자석에서 나침반의 북쪽을 가리키는 극을 무엇이라 하는가?',['N극','엔극','북극']],
 ['원에서 중심부터 원 위의 한 점까지 이은 선분의 길이는?',['반지름','반경']],
 ['삼각형의 세 내각의 크기를 모두 더하면 몇 도가 되는가?',['180','180도','백팔십도']],
 ['넓이가 49인 정사각형에서 한 변의 길이는 얼마인가?',['7','칠']],
 ['1부터 10까지의 모든 자연수를 한 번씩 더한 값은?',['55','오십오']],
 ['2와 3으로 모두 나누어떨어지는 가장 작은 양의 정수는?',['6','육']],
 ['소수들 중에서 유일하게 짝수인 수는 무엇인가?',['2','이']],
 ['월요일부터 일요일까지 한 주를 이루는 날은 모두 며칠인가?',['7','7일','칠일']],
 ['자정부터 다음 자정까지 하루를 이루는 시간은 몇 시간인가?',['24','24시간','스물네시간','이십사시간']],
 ['백성을 위해 한글을 창제한 조선 시대 임금의 이름은?',['세종','세종대왕']],
 ['임진왜란에서 거북선과 수군을 이끈 조선 장군의 이름은?',['이순신','이순신장군']],
 ['한강이 흐르는 도시이며 대한민국의 수도인 곳의 이름은?',['서울','서울특별시']],
 ['네 모서리의 건곤감리와 가운데 태극이 그려진 국기의 이름은?',['태극기']],
 ['우리나라의 국화이며 여름철에 피는 꽃의 이름은 무엇인가?',['무궁화']],
 ['지구의 자전으로 밤과 번갈아 찾아오는 밝은 때를 무엇이라 하나?',['낮']],
 ['비가 그친 하늘에 일곱 가지 빛깔로 나타나는 것은 무엇인가?',['무지개']],
 ['액체 상태인 물이 기체인 수증기로 변하는 현상의 이름은?',['기화','증발']],
 ['기체 상태인 수증기가 액체인 물로 변하는 현상의 이름은?',['액화','응결']],
 ['주위의 소리를 받아들이고 들을 때 사용하는 신체 기관은?',['귀']],
 ['입안에서 단맛과 짠맛 등 여러 맛을 느끼는 주된 기관은?',['혀']],
 ['규칙적으로 뛰면서 온몸에 피를 보내는 신체 기관의 이름은?',['심장']],
 ['1월부터 차례로 셀 때 한 해의 가장 마지막 달은 몇 월인가?',['12월','십이월']],
 ['자연수 중 자릿수가 두 자리인 수에서 가장 작은 수는?',['10','십']],
 ['세 변의 길이가 서로 모두 같은 삼각형을 무엇이라 하는가?',['정삼각형']],
 ['직사각형 중 네 변의 길이가 서로 모두 같은 도형의 이름은?',['정사각형']],
 ['바둑판에서 두 사람이 번갈아 놓는 돌의 두 가지 색은?',['흑백','검정흰색','검은색흰색','흰색검은색','백흑','흑과백','백과흑','검정과흰색','검은색과흰색','흰색과검은색']],
 ['같은 수 두 개를 서로 곱하여 그 수의 무엇을 구하는가?',['제곱']],
 ['바닷물과 육지가 맞닿아 이루는 경계선을 무엇이라 하는가?',['해안선']],
 ['손과 피부로 물체에 닿아 차갑거나 거침을 느끼는 감각은?',['촉각','촉감']]
].map(([question,answers],id)=>({id,question,answers}));
const normalize=value=>String(value).normalize('NFKC').toLowerCase().replace(/[\s.,?!·:;，。？！]/g,'');
function missionRound(mission,r=Math.random){
 if([...mission.question].length>36)throw Error('Mission text exceeds board');
 const symbols=shuffle(Array.from({length:25},(_,i)=>i),r).slice(0,18),faces=shuffle([...symbols,...symbols],r),letters=Array.from(mission.question.padEnd(36,' '));return{mission,faces,letters};
}
function hiddenRun(r=Math.random){return shuffle(MISSIONS,r).slice(0,3).map(m=>missionRound(m,r));}
const correctMission=(p,value)=>p.mission.answers.some(a=>normalize(a)===normalize(value));
const isPair=(p,indices,removed=[])=>indices.length===2&&indices.every(i=>Number.isInteger(i)&&i>=0&&i<36&&!removed.includes(i))&&indices[0]!==indices[1]&&p.faces[indices[0]]===p.faces[indices[1]];
const api={int,shuffle,DIRS,PATTERNS,patternSVG,blockSet,footprint,blockQuestion,placementCells,canPlace,validBlocks,patternRun,MISSIONS,normalize,missionRound,hiddenRun,correctMission,isPair};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.BloodyMemory=api;
})(typeof window!=='undefined'?window:globalThis);
