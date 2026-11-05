const NS='http://www.w3.org/2000/svg';
let graphSerial=0;
const COLORS=['#2b68ae','#bd5144','#53843b','#9162a7'];
const node=(tag,attrs={},...children)=>{const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));e.append(...children);return e};
const html=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
const value=(f,x)=>{
  if(f.type==='poly')return f.c.reduce((a,b)=>a*x+b,0);
  if(f.type==='abs')return Math.abs(value(f.of,x));
  if(f.type==='exp')return (f.amp??1)*f.base**((f.k??1)*(x-(f.h??0)))+(f.v??0);
  if(f.type==='log')return Math.log((f.inputK??1)*x-(f.h??0))/Math.log(f.base)*(f.k??1)+(f.v??0);
  if(f.type==='sum')return f.terms.reduce((a,t)=>a+(t.a??1)*value(t.fn,x),0);
  if(f.type==='max')return Math.max(...f.items.map(t=>value(t,x)));
  if(f.type==='sin'||f.type==='cos')return (f.amp??1)*Math[f.type]((f.k??1)*x+(f.phase??0))+(f.v??0);
  if(f.type==='normal')return Math.exp(-.5*((x-(f.mu??0))/(f.sigma??1))**2)/((f.sigma??1)*Math.sqrt(2*Math.PI));
  if(f.type==='branch')return (f.sign??1)*Math.sqrt((x*x-x+1)/3);
  throw Error('Unknown graph function '+f.type);
};
const unique=a=>a.sort((a,b)=>a-b).filter((x,i,a)=>!i||Math.abs(x-a[i-1])>1e-6);
function polynomialRoots(c,lo,hi){
  while(c.length>1&&Math.abs(c[0])<1e-13)c=c.slice(1);
  const f=x=>c.reduce((a,b)=>a*x+b,0);
  if(c.length===1)return [];
  if(c.length===2){const x=-c[1]/c[0];return x>=lo-1e-8&&x<=hi+1e-8?[x]:[]}
  const d=c.slice(0,-1).map((v,i)=>v*(c.length-1-i));
  const breaks=unique([lo,...polynomialRoots(d,lo,hi),hi]),out=[];
  for(const x of breaks)if(Math.abs(f(x))<1e-8)out.push(x);
  for(let i=1;i<breaks.length;i++){
    let a=breaks[i-1],b=breaks[i],fa=f(a),fb=f(b);
    if(fa*fb>=0)continue;
    for(let n=0;n<55;n++){const m=(a+b)/2,fm=f(m);if(fa*fm<=0){b=m;fb=fm}else{a=m;fa=fm}}
    out.push((a+b)/2);
  }return unique(out);
}
function roots(f,y,lo,hi){
  if(f.type==='poly'){const c=[...f.c];c[c.length-1]-=y;return polynomialRoots(c,lo,hi)}
  if(f.type==='abs')return y<0?[]:unique([...roots(f.of,y,lo,hi),...roots(f.of,-y,lo,hi)]);
  if(f.type==='exp'){const z=(y-(f.v??0))/(f.amp??1);if(z<=0)return [];const x=Math.log(z)/Math.log(f.base)/(f.k??1)+(f.h??0);return x>=lo&&x<=hi?[x]:[]}
  if(f.type==='log'){const x=(f.base**((y-(f.v??0))/(f.k??1))+(f.h??0))/(f.inputK??1);return x>=lo&&x<=hi?[x]:[]}
  if(f.type==='sin'||f.type==='cos'){
    const z=(y-(f.v??0))/(f.amp??1);if(Math.abs(z)>1+1e-9)return [];
    const k=f.k??1,p=f.phase??0,t=f.type==='sin'?Math.asin(Math.max(-1,Math.min(1,z))):Math.acos(Math.max(-1,Math.min(1,z)));
    const phases=f.type==='sin'?[t,Math.PI-t]:[t,-t],out=[];
    for(const phase of phases){const n0=Math.floor((k*lo+p-phase)/(2*Math.PI))-1,n1=Math.ceil((k*hi+p-phase)/(2*Math.PI))+1;for(let n=n0;n<=n1;n++){const x=(phase+2*Math.PI*n-p)/k;if(x>=lo-1e-8&&x<=hi+1e-8)out.push(x)}}return unique(out);
  }return [];
}
function ticks(lo,hi){
  const target=(hi-lo)/6,p=10**Math.floor(Math.log10(target)),factor=[1,2,5,10].find(x=>x*p>=target),step=factor*p,out=[];
  for(let x=Math.ceil(lo/step)*step;x<=hi+step*1e-7;x+=step)out.push(Math.abs(x)<step*1e-7?0:x);
  return out;
}
function plot(spec){
  const W=660,H=360,pad={l:45,r:28,t:27,b:33};
  let [xl,xr]=spec.x,[yl,yr]=spec.y;
  if(spec.equalAspect){const ratio=(W-pad.l-pad.r)/(H-pad.t-pad.b);if((xr-xl)/(yr-yl)<ratio){const middle=(xl+xr)/2,half=(yr-yl)*ratio/2;xl=middle-half;xr=middle+half}else{const middle=(yl+yr)/2,half=(xr-xl)/ratio/2;yl=middle-half;yr=middle+half}}
  const X=x=>pad.l+(x-xl)/(xr-xl)*(W-pad.l-pad.r),Y=y=>H-pad.b-(y-yl)/(yr-yl)*(H-pad.t-pad.b);
  const svg=node('svg',{viewBox:'0 0 '+W+' '+H,role:'img','aria-label':spec.title||'풀이 그래프',class:'math-plot'});
  const uid='math-graph-'+(++graphSerial),clip=node('clipPath',{id:uid},node('rect',{x:pad.l,y:pad.t,width:W-pad.l-pad.r,height:H-pad.t-pad.b}));
  svg.append(node('title',{},spec.title||'풀이 그래프'),node('defs',{},clip));
  const group=node('g',{'clip-path':'url(#'+uid+')'});svg.append(group);
  for(const x of ticks(xl,xr))group.append(node('line',{x1:X(x),x2:X(x),y1:pad.t,y2:H-pad.b,stroke:'#e7edf4','stroke-width':1}));
  for(const y of ticks(yl,yr))group.append(node('line',{x1:pad.l,x2:W-pad.r,y1:Y(y),y2:Y(y),stroke:'#e7edf4','stroke-width':1}));
  const axisY=Y(Math.min(yr,Math.max(yl,0))),axisX=X(Math.min(xr,Math.max(xl,0)));
  group.append(node('line',{x1:pad.l,x2:W-pad.r,y1:axisY,y2:axisY,stroke:'#8798ad','stroke-width':1.2}),node('line',{x1:axisX,x2:axisX,y1:pad.t,y2:H-pad.b,stroke:'#8798ad','stroke-width':1.2}));
  if(spec.ticks!==false){
    for(const x of ticks(xl,xr))svg.append(node('text',{x:X(x),y:H-12,'text-anchor':'middle',class:'graph-tick'},String(Number(x.toPrecision(5)))));
    for(const y of ticks(yl,yr))svg.append(node('text',{x:pad.l-8,y:Y(y)+4,'text-anchor':'end',class:'graph-tick'},String(Number(y.toPrecision(5)))));
  }
  const curves=spec.curves||[];
  const zero={type:'poly',c:[0]};
  for(const c of spec.circles||[])group.append(node('ellipse',{cx:X(c.x),cy:Y(c.y),rx:Math.abs(X(c.x+c.r)-X(c.x)),ry:Math.abs(Y(c.y+c.r)-Y(c.y)),fill:c.fill??'none',stroke:c.color??'#859b77','stroke-width':1.8}));
  for(const p of spec.polygons||[])group.append(node('polygon',{points:p.points.map(([x,y])=>[X(x),Y(y)].join(',')).join(' '),fill:p.color??'#9fc3e5','fill-opacity':.22,stroke:p.color??'#427ba9','stroke-width':1.8}));
  for(const fill of spec.fills||[]){
    const lo=Math.max(xl,fill.x[0]),hi=Math.min(xr,fill.x[1]);if(hi<=lo)continue;
    const top=fill.top??zero,bottom=fill.bottom??zero,a=[],b=[];
    for(let i=0;i<=160;i++){const x=lo+(hi-lo)*i/160,yt=value(top,x),yb=value(bottom,x);if(Number.isFinite(yt)&&Number.isFinite(yb)){a.push([X(x),Y(yt)]);b.push([X(x),Y(yb)])}}
    if(a.length)group.append(node('polygon',{points:a.concat(b.reverse()).map(v=>v.join(',')).join(' '),fill:fill.color??'#93bee5',opacity:.28}));
  }
  for(const [i,c] of curves.entries()){
    const lo=Math.max(xl,c.range?.[0]??xl),hi=Math.min(xr,c.range?.[1]??xr);let path='',live=false;
    for(let j=0;j<=650;j++){const x=lo+(hi-lo)*j/650,y=value(c.fn,x);if(!Number.isFinite(y)||Math.abs(y)>Math.max(Math.abs(yl),Math.abs(yr),1)*500){live=false;continue}path+=(live?' L':' M')+X(x).toFixed(2)+','+Y(y).toFixed(2);live=true}
    group.append(node('path',{d:path,fill:'none',stroke:c.color??COLORS[i%COLORS.length],'stroke-width':c.width??2.5,...(c.dash?{'stroke-dasharray':'7 5'}:{})}));
  }
  for(const x of spec.verticals||[])group.append(node('line',{x1:X(x),x2:X(x),y1:pad.t,y2:H-pad.b,stroke:'#b7a060','stroke-width':1.2,'stroke-dasharray':'4 5'}));
  for(const pt of spec.points||[]){
    group.append(node('circle',{cx:X(pt.x),cy:Y(pt.y),r:4.4,fill:pt.open?'#fff':pt.color??'#c17a13',stroke:pt.open?(pt.color??'#c17a13'):'#fff','stroke-width':1.6}));
    if(pt.label)svg.append(node('text',{x:X(pt.x)+(pt.dx??9),y:Y(pt.y)+(pt.dy??-10),class:'graph-point-label',fill:pt.color??'#80520d'},pt.label));
  }
  svg.append(node('text',{x:W-pad.r,y:H-11,'text-anchor':'end',class:'graph-axis-label'},spec.xlabel??'x'),node('text',{x:pad.l+7,y:17,class:'graph-axis-label'},spec.ylabel??'y'));
  return svg;
}
function graphLegend(spec){
  const legend=html('div','graph-legend');
  for(const [i,c] of (spec.curves||[]).entries())if(c.label){const item=html('span','graph-legend-item');const swatch=html('i','graph-swatch');swatch.style.background=c.color??COLORS[i%COLORS.length];item.append(swatch,document.createTextNode(c.label));legend.append(item)}
  return legend;
}
function slider(label,min,max,initial,step,callback,showNumber=true){
  const row=html('label','graph-slider-row'),text=html('span','graph-slider-label',label),input=html('input'),output=html('output','graph-slider-value');
  input.type='range';input.min=min;input.max=max;input.value=initial;input.step=step;input.setAttribute('aria-label',label);
  const display=n=>{output.textContent=showNumber?(Math.abs(n-Number(n.toFixed(2)))>1e-8?'≈ ':'')+n.toFixed(2):''};
  const update=()=>{display(Number(input.value));callback(Number(input.value))};input.addEventListener('input',update);display(initial);
  // A range input rounds assigned values to its step grid. Presets must retain
  // exact extremum heights, otherwise a tangent becomes zero or two crossings.
  const setExact=n=>{input.value=n;display(n);callback(n)};
  row.append(text,input,output);return {row,input,update,setExact};
}
function secantFigure(mode){
  const host=html('div','slope-figure'),canvas=html('div','graph-canvas'),extra=html('div','graph-canvas'),status=html('p','graph-live-note');
  let p=1.5;const f={type:'poly',c:[1,0,0,0]},derivative={type:'poly',c:[3,0,0]};
  function draw(){
    const h=p*p-p+1,z=Math.sqrt(h/3),a={x:-1,y:-1,label:'A'},t={x:.5,y:.125,label:'T'};
    if(mode==='branches'){
      canvas.replaceChildren(plot({title:'두 접점의 위치를 입력에 따라 이어 그린 그림',x:[-2,3],y:[-2,2],ticks:false,xlabel:'P의 가로 위치',ylabel:'접점의 가로 위치',curves:[{fn:{type:'branch',sign:1},label:'오른쪽 접점의 가지'},{fn:{type:'branch',sign:-1},color:'#bd5144',label:'왼쪽 접점의 가지'}],points:[{x:p,y:z,label:'R'},{x:p,y:-z,label:'L',color:'#bd5144'},{x:.5,y:.5,label:'최소 위치',dx:10,dy:19}],verticals:[.5]}));
      extra.replaceChildren();status.textContent='두 접점의 위치가 계속 떨어져 있죠. 연속인 g는 중간에 반대쪽으로 뛰어갈 수 없어서 한쪽을 계속 따라가야 해요.';
    }else{
      const curves=[{fn:f,label:'삼차곡선'},{fn:{type:'poly',c:[h,h-1]},color:'#b17c14',label:'할선 AP'},{fn:{type:'poly',c:[h,-2*z**3]},color:'#2f8a7a',dash:true,label:'오른쪽 접선'},{fn:{type:'poly',c:[h,2*z**3]},color:'#bd5144',dash:true,label:'왼쪽 접선'}];
      const atT=Math.abs(p-.5)<1e-6;
      const points=[a,{x:p,y:p**3,label:atT?'P=T':'P',color:'#b17c14',dy:24},...(!atT?[{x:z,y:z**3,label:'R',color:'#2f8a7a'}]:[]),{x:-z,y:-(z**3),label:'L',color:'#bd5144'}];
      if(mode==='minimum'){curves.push({fn:{type:'poly',c:[.75,-.25]},color:'#8c63a8',dash:true,label:'최소 기울기 AT'});if(!atT)points.push(t)}
      if(mode==='inflection'){points.push({x:0,y:0,label:'M',color:'#785b98',dy:24});if(!atT)points.push(t)}
      const spec={title:'할선과 평행한 두 접선',x:[-2.1,2.25],y:[Math.min(-2.5,p**3-.6),Math.max(5,p**3+.6)],ticks:false,curves,points};
      canvas.replaceChildren(plot(spec),graphLegend(spec));
      if(mode==='contacts'){
        const spec2={title:'도함수 그래프와 할선 기울기 높이',x:[-2,2.3],y:[-.5,7],ticks:false,xlabel:'접점의 가로 위치',ylabel:'접선 기울기',curves:[{fn:derivative,label:'도함수 그래프'},{fn:{type:'poly',c:[h]},color:'#b17c14',label:'할선 기울기의 높이'}],points:[{x:z,y:h,label:'R',color:'#2f8a7a'},{x:-z,y:h,label:'L',color:'#bd5144'}]};
        extra.replaceChildren(plot(spec2),graphLegend(spec2));
      }else extra.replaceChildren();
      status.textContent=atT?'P=T가 되면 할선 AP가 접선 AT와 겹쳐요. 이때 할선의 기울기가 가장 작아요.':Math.abs(p+1)<1e-6?'P가 A에 가까워지면 할선의 기울기는 A에서의 접선 기울기로 가까워져요.':'P가 움직이면 접점도 함께 움직여요. 할선과 두 접선은 계속 평행해요.';
    }
  }
  const control=slider('P를 움직여 보세요',-1.8,2.1,p,.01,n=>{p=n;draw()},false);
  const reset=html('button','secondary graph-preset','P를 T에 놓기');reset.type='button';reset.addEventListener('click',()=>{p=.5;control.input.value=p;draw()});
  host.append(canvas,extra,control.row,reset,status,html('p','graph-structure-note','지금은 A와 P, 접선들의 위치 관계를 보는 그림이에요. A의 실제 가로 좌표는 1이에요. 나머지 좌표는 풀이를 따라가며 구할게요.'));
  draw();return host;
}
export function createMathGraph(spec){
  const figure=html('figure','math-graph-figure');figure.append(html('figcaption','math-graph-title',spec.title??'그래프로 확인하기'));
  if(spec.kind==='cubic-slopes'){figure.append(secantFigure(spec.mode??'secant'));return figure}
  if(['window','area-join','shift-sum','reflection'].includes(spec.kind)){figure.append(controlledFigure(spec));return figure}
  const canvas=html('div','graph-canvas'),legend=html('div'),status=html('p','graph-live-note');figure.append(canvas,legend);
  let level=spec.level?.value;
  function draw(){
    const copy={...spec,curves:[...(spec.curves||[])],points:[...(spec.points||[])]};
    if(spec.level){
      copy.curves.push({fn:{type:'poly',c:[level]},color:'#b17c14',label:spec.level.lineLabel??'움직이는 수평선',dash:true});
      const all=[];
      for(const c of (spec.curves||[]).filter(c=>c.count!==false)){
        const range=c.range??spec.x;
        const xs=roots(c.fn,level,Math.max(spec.x[0],range[0]),Math.min(spec.x[1],range[1])).filter(x=>!((c.openLeft&&Math.abs(x-range[0])<1e-6)||(c.openRight&&Math.abs(x-range[1])<1e-6)));
        all.push(...xs);
      }
      const xs=unique(all);copy.points.push(...xs.map((x,i)=>({x,y:level,color:spec.level.rightmost&&i===xs.length-1?'#be581c':'#996d13',label:spec.level.rightmost&&i===xs.length-1?'가장 오른쪽':''})));
      status.textContent='표시한 입력 범위의 교점 '+xs.length+'개'+(spec.level.rightmost&&xs.length?' · 가장 오른쪽 입력 ≈ '+xs.at(-1).toFixed(3):'');
    }
    canvas.replaceChildren(plot(copy));
    if(!legend.hasChildNodes())legend.append(graphLegend(copy));
  }
  if(spec.level){
    const l=spec.level,control=slider(l.label??'수평선 높이',l.min,l.max,l.value,l.step??.1,n=>{level=n;draw()});figure.append(control.row);
    if(l.presets){const buttons=html('div','graph-presets');for(const p of l.presets){const button=html('button','secondary graph-preset',p.label);button.type='button';button.addEventListener('click',()=>control.setExact(p.value));buttons.append(button)}figure.append(buttons)}
    figure.append(status);
  }
  if(spec.caption)figure.append(html('p','graph-caption',spec.caption));
  draw();return figure;
}
function integrate(fn,a,b){
  const n=600,h=(b-a)/n;let total=value(fn,a)+value(fn,b);
  for(let i=1;i<n;i++)total+=(i%2?4:2)*value(fn,a+i*h);
  return total*h/3;
}
function controlledFigure(spec){
  const host=html('div','controlled-graph'),canvas=html('div','graph-canvas'),legend=html('div'),status=html('p','graph-live-note'),c=spec.control;let parameter=c.value;
  function draw(){
    let copy={...spec,curves:[...(spec.curves||[])],fills:[...(spec.fills||[])],points:[...(spec.points||[])]};
    if(spec.kind==='window'){
      const a=parameter+(spec.centered?-(spec.width??1)/2:0),b=a+(spec.width??1),fn=spec.curves[0].fn;
      copy.verticals=[a,b];
      copy.fills.push({top:spec.shadeFunction?fn:{type:'poly',c:[spec.y[1]]},bottom:spec.shadeFunction?{type:'poly',c:[0]}:{type:'poly',c:[spec.y[0]]},x:[a,b],color:'#8eb8df'});
      if(spec.roots){const included=spec.roots.filter(x=>spec.openWindow?x>a+1e-8&&x<b-1e-8:x>=a-1e-8&&x<=b+1e-8);status.textContent='구간 '+(spec.openWindow?'(':'[')+a.toFixed(2)+', '+b.toFixed(2)+(spec.openWindow?')':']')+' · '+(spec.countLabel??'포함된 근')+' '+included.length+'개'}
      else if(spec.shadeFunction)status.textContent='왼쪽 끝 높이 '+value(fn,a).toFixed(3)+' · 오른쪽 끝 높이 '+value(fn,b).toFixed(3)+' · 구간 넓이 ≈ '+integrate(fn,a,b).toFixed(3);
    }else if(spec.kind==='area-join'){
      const f=spec.fn,h=value(f,parameter),line={type:'poly',c:[-1,parameter+h]};
      copy.curves=[{fn:f,label:'원래 곡선',dash:true,color:'#a6b8cb'},{fn:f,range:[0,parameter],label:'접합점까지의 곡선'},{fn:line,range:[parameter,parameter+h],label:'기울기 -1인 직선',color:'#bd5144'}];
      copy.fills=[{top:f,x:[0,parameter],color:'#75aadb'},{top:line,x:[parameter,parameter+h],color:'#e1a17e'}];
      copy.points=[{x:parameter,y:h,label:'접합점'},{x:parameter+h,y:0,label:'가로축 교점',dx:-80,dy:22}];
      status.textContent='곡선 아래 넓이 + 삼각형 넓이 ≈ '+(integrate(f,0,parameter)+h*h/2).toFixed(3);
    }else if(spec.kind==='shift-sum'){
      const t=parameter,fn={type:'poly',c:[2,5-2*t,t*t-2.5*t+2]};
      const xs=roots(fn,0,spec.x[0],spec.x[1]);copy.curves=[{fn,label:'분모가 만드는 이차곡선'}];copy.points=xs.map(x=>({x,y:0,label:'영점'}));
      status.textContent='분모의 서로 다른 실근 '+xs.length+'개'+(Math.abs(t-1.5)<1e-8?' · 한 점에서 접하는 중근':'');
    }else if(spec.kind==='reflection'){
      const f=spec.fn,h=value(f,parameter),reflected={type:'poly',c:f.c.map((v,i)=>i===f.c.length-1?2*h-v:-v)};
      copy.curves=[{fn:reflected,range:[spec.x[0],parameter],openRight:true,label:'경계 왼쪽: 반사한 곡선',color:'#8a63a5'},{fn:f,range:[parameter,spec.x[1]],label:'경계 오른쪽: 원래 곡선'}];
      const xs=unique([...roots(reflected,0,spec.x[0],parameter).filter(x=>x<parameter-1e-7),...roots(f,0,parameter,spec.x[1])]);
      copy.verticals=[parameter];copy.points=xs.map(x=>({x,y:0,label:''}));status.textContent='서로 다른 영점 '+xs.length+'개 · 경계 t = '+parameter.toFixed(2);
    }
    canvas.replaceChildren(plot(copy));
    if(!legend.hasChildNodes())legend.append(graphLegend(copy));
  }
  const control=slider(c.label??'위치',c.min,c.max,c.value,c.step??.05,n=>{parameter=n;draw()});host.append(canvas,legend,control.row);
  if(c.presets){const buttons=html('div','graph-presets');for(const p of c.presets){const button=html('button','secondary graph-preset',p.label);button.type='button';button.addEventListener('click',()=>control.setExact(p.value));buttons.append(button)}host.append(buttons)}
  host.append(status);if(spec.caption)host.append(html('p','graph-caption',spec.caption));draw();return host;
}

// Shared by the plot renderer and independent boundary checks.
export {value as graphValue, roots as graphRoots, integrate as graphIntegral};

