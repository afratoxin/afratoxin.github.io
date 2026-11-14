'use strict';
(function(root){
function create(kind,random=Math.random){
 const pools=root.UniversityLevelPools[kind],used=pools.map(()=>new Set());
 return {kind,level:1,total:pools.length,cleared:false,puzzle:null,
  reset(){this.level=1;this.cleared=false;this.puzzle=null;used.forEach(s=>s.clear());},
  draw(){let choices=pools[this.level-1].filter(p=>!used[this.level-1].has(p.id));if(!choices.length){used[this.level-1].clear();choices=pools[this.level-1].filter(p=>p.id!==this.puzzle?.id);}const p=choices[Math.floor(random()*choices.length)];used[this.level-1].add(p.id);this.puzzle=JSON.parse(JSON.stringify(p));return this.puzzle;},
  clear(){this.cleared=true;},
  next(){if(this.cleared){if(this.level===this.total)return null;this.level++;}this.cleared=false;return this.draw();},
  get complete(){return this.cleared&&this.level===this.total;},
  get nextLabel(){return this.complete?'전체 단계 완료':this.cleared?(this.level+1)+'단계 도전 →':'같은 단계 · 다른 문제 →';},
  render(element){if(!element)return;const p=this.puzzle;let detail='단계마다 서로 다른 문제 12개 · 클리어하면 다음 단계';if(p&&kind==='maze')detail='목적지 5곳의 평균 경로 '+p.meanPath.toFixed(1)+'칸 · 문제 풀 12개';if(p&&kind==='rainbow')detail=(p.hardCount?'복합 규칙 '+p.hardCount+'색 · ':'')+(p.mediumCount?'변화 규칙 '+p.mediumCount+'색 · ':'')+'7색 수열 · 문제 풀 12개';if(p&&kind==='ladder')detail=p.size+'줄 · 가로 가지 '+p.edges.length+'개'+(p.tilt?' · 기울어진 배치':'')+' · 문제 풀 12개';element.innerHTML='<div class="level-heading"><b>'+this.level+'단계'+(this.cleared?' · 클리어':'')+'</b><span>'+this.total+'단계 도전</span></div><div class="level-steps">'+pools.map((_,i)=>'<span class="'+(i+1<this.level||i+1===this.level&&this.cleared?'done':i+1===this.level?'active':'')+'">'+(i+1)+'</span>').join('')+'</div><p>'+detail+'</p>';}
 };
}
root.UniversityLevels={create};
})(typeof window==='undefined'?globalThis:window);
