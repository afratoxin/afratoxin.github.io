(function(root){'use strict';
// a top, b upper-right, c lower-right, d bottom, e lower-left, f upper-left, g middle.
const DIGITS=['abcdef','bc','abdeg','abcdg','bcfg','acdfg','acdefg','abc','abcdefg','abcdfg'];
const GEOMETRY={a:[0,0,2,0],b:[2,0,2,2],c:[2,2,2,4],d:[0,4,2,4],e:[0,2,0,4],f:[0,0,0,2],g:[0,2,2,2]};
const shuffle=(list,random=Math.random)=>{const a=list.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function segments(number){if(!Number.isInteger(number)||number<10||number>99)throw Error('Two-digit number required');return String(number).split('').flatMap((d,pos)=>DIGITS[Number(d)].split('').flatMap(letter=>[`${pos}${letter}0`,`${pos}${letter}1`]))}
function split(number,random=Math.random){const parts=[[],[],[]],all=segments(number);for(let digit=0;digit<2;digit++){const a=shuffle(all.filter(s=>Number(s[0])===digit),random),offset=Math.floor(random()*3);a.forEach((s,i)=>parts[(i+offset)%3].push(s))}return parts}
function makeRound(random=Math.random){const a=10+Math.floor(random()*90);const b=10+Math.floor(random()*90);return {a,b,sum:a+b,aParts:split(a,random),bParts:split(b,random)}}
function frame(round,index){const k=((index%6)+6)%6,group=k%2?'B':'A',part=k>>1;return {group,part,label:group+(part+1),segments:(group==='A'?round.aParts:round.bParts)[part]}}
function svg(active,options={}){const color=options.color||'#ffe748',set=new Set(active);let s='<svg viewBox="0 0 420 360" role="img" aria-label="'+(options.label||'디지털 숫자 조각')+'" xmlns="http://www.w3.org/2000/svg"><rect width="420" height="360" fill="#555655"/>';for(let x=0;x<=420;x+=60)s+=`<path d="M${x} 0V360" stroke="#151716" stroke-width="2"/>`;for(let y=0;y<=360;y+=60)s+=`<path d="M0 ${y}H420" stroke="#151716" stroke-width="2"/>`;
for(const id of set){const pos=Number(id[0]),g=GEOMETRY[id[1]],half=Number(id[2]),ox=pos?240:60,oy=60;const x1=ox+(g[0]+(g[2]-g[0])*half/2)*60,y1=oy+(g[1]+(g[3]-g[1])*half/2)*60,x2=ox+(g[0]+(g[2]-g[0])*(half+1)/2)*60,y2=oy+(g[1]+(g[3]-g[1])*(half+1)/2)*60;const horiz=y1===y2,dx=horiz?1:0,dy=horiz?0:1,a=x1+dx*3,b=y1+dy*3,c=x2-dx*3,d=y2-dy*3,w=5;const pts=horiz?`${a},${b} ${a+5},${b-w} ${c-5},${d-w} ${c},${d} ${c-5},${d+w} ${a+5},${b+w}`:`${a},${b} ${a-w},${b+5} ${c-w},${d-5} ${c},${d} ${c+w},${d-5} ${a+w},${b+5}`;s+=`<polygon points="${pts}" fill="${color}"/>`}return s+'</svg>'}
const api={DIGITS,segments,split,makeRound,frame,svg};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MixMatch=api;
})(typeof globalThis==='undefined'?this:globalThis);
