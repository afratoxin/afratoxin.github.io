/* Decorative, fixed previews. These never contain the current puzzle or its answer. */
(function (root) {
  'use strict';
  const families = {
    'memory-poker':'poker','expression-archery':'target','rectangle-count':'rectangles','formula-death-note':'equation',
    'rotation-pattern':'rotation','echo-maze':'maze','mix-and-match':'layers','mix-and-match-2':'hangul','memory-30':'clues',
    'formula-maze':'numbermaze','maze-code':'maze3d','same-picture':'symbols','same-number':'numbers','gyul-hap':'sets',
    'hexagon':'hex','equation-pyramid':'pyramid','match-and-mix':'numbers','pixel-number':'pixels','pixel-number-2':'pixels',
    'area-ranking':'areas','either-or':'equation','merge-ladder':'ladder','trisection':'hangul','hidden-algorithm':'numbermaze',
    'weekday-equation':'calendar','triple-maze':'maze','exit-strategy-2':'exit','sum-difference-gomoku':'gomoku',
    'rainbow-sequence':'rainbow','rotating-rps':'cube','formula-territory':'numbermaze','zero-sum':'numbers','ace-circuit':'target',
    'scale-balance':'balance','same-pattern':'arrows','time-shift':'clock','pixel-art':'pixels','block-count':'blocks',
    'mystery-sign':'symbols','pattern-block':'pattern','hidden-mission':'symbols'
  };
  const colours = { mint:'#9bf0d5',ink:'#142b3b',blue:'#8eb8e7',paper:'#eef3ea',gold:'#ead4a5',line:'#55778a',panel:'#214157' };
  const r = (x,y,w,h,fill=colours.panel,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w,h)*.12}" fill="${fill}" ${extra}/>`;
  const line = (x1,y1,x2,y2,stroke=colours.line,width=2,extra='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" ${extra}/>`;
  const txt = (x,y,t,size=22,fill=colours.paper,extra='') => `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" fill="${fill}" font-size="${size}" font-weight="650" ${extra}>${t}</text>`;
  const dot = (x,y,radius,fill) => `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}"/>`;
  function grid(n, cell, x, y, draw) {
    let out=''; for(let row=0;row<n;row++)for(let col=0;col<n;col++)out+=draw(x+col*cell,y+row*cell,cell-5,row*n+col,row,col); return out;
  }
  function artwork(type, seed) {
    const C=colours;
    if(type==='poker') return `<g transform="rotate(-13 145 140)">${r(87,52,94,143,C.paper)}${txt(107,78,'K',26,C.ink)}${txt(134,125,'♠',47,C.ink)}${txt(160,173,'K',26,C.ink)}</g><g transform="rotate(13 242 140)">${r(184,58,94,143,C.paper)}${txt(205,85,'A',26,'#a94c64')}${txt(232,128,'♥',47,'#a94c64')}</g><g transform="rotate(-2 190 142)">${r(137,44,94,143,C.mint)}${txt(157,71,'9',26,C.ink)}${txt(184,111,'♣',44,C.ink)}${txt(211,159,'9',26,C.ink)}</g>${dot(286,192,5,C.mint)}${dot(74,195,3,C.blue)}`;
    if(type==='target') {
      let out='';const fills=['#385870','#a4c4d5','#cbdde3','#ebd6a8','#a7edce'];
      for(let i=0;i<5;i++)out+=`<circle cx="189" cy="127" r="${100-i*20}" fill="${fills[i]}" stroke="#112c3d" stroke-width="3"/>`;
      for(let i=0;i<12;i++){const a=i*Math.PI/6;out+=line(189+61*Math.cos(a),127+61*Math.sin(a),189+98*Math.cos(a),127+98*Math.sin(a),'#193c50',1.5);}
      return out+`<path d="M248 64 195 121" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><path d="m248 64 8-19 9 9-17 10" fill="${C.paper}"/>${dot(189,127,6,C.ink)}${r(50,180,45,50,C.paper)}${txt(72,205,'6',27,C.ink)}${r(105,196,45,50,C.mint)}${txt(127,221,'4',27,C.ink)}`;
    }
    if(type==='hex') {
      let out='';const rows=[3,4,5,4,3];let k=0;
      rows.forEach((n,row)=>{for(let col=0;col<n;col++){const x=190+(col-(n-1)/2)*39,y=51+row*35;const points=Array.from({length:6},(_,i)=>{const a=(i*60-30)*Math.PI/180;return `${x+22*Math.cos(a)},${y+22*Math.sin(a)}`;}).join(' ');const fill=k%5===seed%5?C.mint:k%3===0?C.paper:C.panel;out+=`<polygon points="${points}" fill="${fill}" stroke="#102b3d" stroke-width="3"/>`+txt(x,y,(k*7+seed)%17+1,18,fill===C.panel?'#c8e3ed':C.ink);k++;}}); return out;
    }
    if(type==='pyramid') {let out='',k=0;for(let row=0;row<4;row++)for(let c=0;c<=row;c++){const x=190+(c-row/2)*55,y=27+row*53;out+=r(x-24,y,48,46,k%3===0?C.mint:C.paper)+txt(x,y+23,[7,'×',3,'+',6,'−',4,9,'÷',2][k++],24,C.ink);}return out;}
    if(['numbers','rotation','exit','gomoku','rainbow','symbols','sets','arrows','pattern','numbermaze'].includes(type)) {
      const n=type==='rainbow'?7:type==='symbols'&&seed%2?6:type==='gomoku'?7:type==='arrows'?5:4, size=type==='rainbow'?25:n===7?27:n===6?31:n===5?37:46;
      const x=190-n*size/2,y=128-n*size/2;
      let out=r(x-14,y-14,n*size+23,n*size+23,'#19364b','stroke="#52778a" stroke-width="1.5"');
      const rainbow=['#db9aa8','#dfb087','#ded28d','#9ecb9d','#8ec7cb','#9baedc','#bda0cd'];
      out+=grid(n,size,x,y,(a,b,w,i,row,col)=>{
        let fill=C.panel,content='';
        if(type==='rainbow'){fill=rainbow[col];content=txt(a+w/2,b+w/2,(row*3+col*2+seed)%19+1,11,C.ink);}
        if(type==='numbers'||type==='numbermaze'){fill=[0,1,5,9,10].includes(i)?C.mint:C.paper;content=txt(a+w/2,b+w/2,type==='numbermaze'?String.fromCharCode(65+i):(i*5+seed)%16+1,21,C.ink);}
        if(type==='rotation'){fill=[1,4,6,10,15].includes(i)?C.mint:'#294b62';content=dot(a+w/2,b+w/2,2,fill===C.mint?'#e8fff1':'#7897ad55');}
        if(type==='symbols'||type==='sets'){fill=i%5===0?C.mint:C.paper;const symbol=['△','○','□','木','日','◇'][(i+seed)%6];content=txt(a+w/2,b+w/2,symbol,Math.max(16,w*.6),C.ink);}
        if(type==='arrows'){fill=C.paper;const d=(i*3+seed)%4;content=`<path d="M-5 11V-1h-7L0-13 12-1H5v12Z" fill="${C.ink}" transform="translate(${a+w/2} ${b+w/2}) rotate(${d*90}) scale(.74)"/>`;}
        if(type==='pattern'){fill=C.paper;content=`<path d="M${a+6} ${b+w-7}V${b+7}H${a+w-7}V${b+w-7}" fill="none" stroke="${C.ink}" stroke-width="4" transform="rotate(${i%4*90} ${a+w/2} ${b+w/2})"/>`;}
        if(type==='exit'){fill=i===5?C.mint:'#345b72';if([1,3,12].includes(i))fill='#102638';if([4,11].includes(i))content=dot(a+w/2,b+w/2,w*.3,i===4?C.paper:C.gold);}
        if(type==='gomoku'){fill='#c3d4d6';content=line(a,b+w/2,a+w,b+w/2,'#6e8c97',1)+line(a+w/2,b,a+w/2,b+w,'#6e8c97',1);if([16,17,18,24,25,32].includes(i))content+=dot(a+w/2,b+w/2,w*.42,i%2?'#f4f6ed':'#162f42')+txt(a+w/2,b+w/2,i%5+1,12,i%2?C.ink:C.paper);}
        return r(a,b,w,w,fill)+content;
      });
      if(type==='rotation')out+=`<path d="M306 167a114 114 0 0 0-50-147" fill="none" stroke="${C.mint}" stroke-width="4" stroke-linecap="round"/><path d="m255 9-1 19 18-8" fill="none" stroke="${C.mint}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
      if(type==='numbermaze')out+=`<path d="M${x+20} ${y+20}v${size}h${size}v${size}h${size}" fill="none" stroke="#157962" stroke-width="5" opacity=".7"/>`;
      return out;
    }
    if(type==='equation') return `${r(62,53,255,63,'#1e3e53','stroke="#56798a"')}${txt(190,85,seed%2?'46,080':'12,645',38,C.mint)}${[3,5,2,6].map((n,i)=>`<g transform="rotate(${(i-1.5)*5} ${99+i*61} 180)">${r(74+i*61,142,49,66,i===2?C.mint:C.paper)}${txt(98+i*61,174,n,30,C.ink)}</g>`).join('')}${txt(150,128,'×',18,'#6c94a6')}${txt(226,128,'!',18,'#6c94a6')}`;
    if(type==='rectangles'||type==='areas') {let out=r(80,38,220,180,C.paper);for(let i=1;i<5;i++)out+=line(80+i*44,38,80+i*44,218,'#819cab',1)+line(80,38+i*36,300,38+i*36,'#819cab',1);out+=`<rect x="124" y="74" width="132" height="108" fill="${C.mint}" fill-opacity=".5" stroke="#26775f" stroke-width="4"/>`;if(type==='areas')out+=`<path d="M80 38H300L212 146H80Z" fill="#99b9de"/><path d="M80 218V146H212L256 218Z" fill="#dfb194"/><path d="m212 146 88-108v180h-44Z" fill="#a1cdb0"/>`;else [3,7,2,6,4,9].forEach((v,i)=>out+=txt(102+i%3*66,92+Math.floor(i/3)*64,v,23,C.ink));return out;}
    if(type==='maze'||type==='maze3d') {let out=r(83,30,214,199,'#152f45','stroke="#638a9a" stroke-width="2"');const walls=[[114,31,114,94],[145,62,239,62],[239,62,239,126],[114,126,208,126],[145,94,145,126],[176,156,269,156],[114,156,114,198],[145,198,239,198],[207,93,207,125],[269,93,269,126],[83,94,114,94],[83,156,114,156]];out+=walls.map(p=>line(...p,'#a6c6ce',4)).join('');out+=`<path d="M97 47V111H129V143H160V174H253V212" fill="none" stroke="${C.mint}" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 9"/>`+dot(97,47,7,C.mint)+dot(253,212,8,C.gold);if(type==='maze3d')out+=`<path d="M272 66 334 40V177l-62 30Z" fill="#adc5d2"/><path d="M297 80 319 70v99l-22 11Z" fill="#264f67"/>`;return out;}
    if(type==='layers'||type==='pixels'||type==='hangul') {
      const bits=['1111010','0001010','0001010','0001111','1111010','1000010','1000010','1000010','1111010','0000010','0000010'];
      let out='';for(let layer=0;layer<3;layer++){const ox=85+layer*43,oy=34+layer*15;out+=`<g class="visual-layer" style="--visual-delay:${layer*-.8}s">${r(ox,oy,130,174,['#526c9c','#447f84','#9bcbb9'][layer],`fill-opacity=".6" stroke="${['#9eb4ef','#8ad5d1','#c8ffe5'][layer]}" stroke-opacity=".6"`)} `;for(let row=0;row<11;row++)for(let col=0;col<7;col++){if(bits[row][col]==='1'&&(row+col)%3===layer)out+=r(ox+10+col*16,oy+8+row*14,13,11,layer===2?C.paper:C.mint);}out+='</g>';}
      return out;
    }
    if(type==='clues') return [0,1,2].map((i)=>{const x=65+i*25,y=32+i*62;return `<g transform="rotate(${i%2?3:-3} 190 130)">${r(x,y,229,58,i===2?C.mint:'#315169','stroke="#63869a"')}${dot(x+30,y+29,15,i===2?'#1c6256':'#8fb8d0')}${txt(x+30,y+29,['A','B','C'][i],14,C.paper)}${line(x+61,y+20,x+175,y+20,i===2?'#397568':'#9dbccc',5)}${line(x+61,y+36,x+130,y+36,i===2?'#397568':'#648ca5',4)}</g>`;}).join('');
    if(type==='calendar'||type==='clock') {let out=r(83,36,215,190,C.paper)+r(83,36,215,38,C.mint);out+=dot(125,40,5,C.ink)+dot(255,40,5,C.ink);for(let i=0;i<28;i++){const x=108+i%7*27,y=98+Math.floor(i/7)*32;if(i===11||i===19)out+=r(x-10,y-11,21,23,'#438c79');out+=txt(x,y,i+1,14,[11,19].includes(i)?C.paper:C.ink);}if(type==='clock')out+=`<circle cx="281" cy="190" r="44" fill="#204457" stroke="${C.mint}" stroke-width="4"/>${line(281,190,281,163,C.paper,4)}${line(281,190,303,203,C.paper,4)}`;return out;}
    if(type==='balance') return `${line(190,54,190,210,C.blue,9)}${line(150,216,230,216,C.blue,10)}${line(92,83,288,83,C.mint,6)}${dot(190,83,10,C.gold)}${line(104,85,78,149,C.blue,2)}${line(104,85,130,149,C.blue,2)}${line(276,85,250,149,C.blue,2)}${line(276,85,302,149,C.blue,2)}<path d="M68 149h72q-7 28-36 28t-36-28M240 149h72q-7 28-36 28t-36-28" fill="#496e82" stroke="#9ac2d0" stroke-width="2"/>${r(83,126,19,21,C.paper)}${r(106,126,19,21,C.mint)}${r(255,126,19,21,C.paper)}${r(278,126,19,21,C.mint)}`;
    if(type==='ladder') {let out='';for(let i=0;i<5;i++)out+=line(86+i*51,46,86+i*51,216,C.paper,3);[[0,70],[2,90],[1,120],[3,145],[0,170],[2,193]].forEach(([c,y])=>out+=line(86+c*51,y,137+c*51,y,C.blue,4));out+=`<path d="M137 47v73h51v73h51v23" fill="none" stroke="${C.mint}" stroke-width="6"/>`;return out;}
    if(type==='cube'||type==='blocks') {let out='';const cube=(x,y,s,a,b,c)=>`<path d="m${x} ${y} ${s} ${-s/2} ${s} ${s/2}-${s} ${s/2}Z" fill="${a}"/><path d="m${x} ${y} ${s} ${s/2}v${s}l-${s}-${s/2}Z" fill="${b}"/><path d="m${x+s} ${y+s/2} ${s}-${s/2}v${s}l-${s} ${s/2}Z" fill="${c}"/>`;
      if(type==='cube')return cube(115,91,74,C.mint,'#528b8e','#a9c9de')+txt(189,90,'✌',35,C.ink)+txt(150,151,'○',34,C.paper)+txt(227,150,'△',30,C.ink);
      [[130,143],[179,167],[228,143],[179,119],[179,70]].forEach(([x,y],i)=>out+=cube(x-25,y,48,i%2?C.blue:C.mint,'#487588','#83afbc'));return out;
    }
    return artwork('rotation',seed);
  }
  function svg(id, type, className='') {
    const seed=[...id].reduce((n,c)=>n+c.charCodeAt(0),0);
    return `<svg class="arena-art ${className}" viewBox="0 0 380 260" fill="none" aria-hidden="true" focusable="false"><ellipse cx="190" cy="224" rx="130" ry="14" fill="#020c17" opacity=".35"/><circle cx="190" cy="130" r="113" stroke="#a5dfd2" stroke-opacity=".08"/><circle cx="190" cy="130" r="132" stroke="#a5dfd2" stroke-opacity=".04"/><g class="visual-object">${artwork(type,seed)}</g></svg>`;
  }
  const collectionTypes={'genius':'sets','devils-plan':'hex','bloody-game':'layers','university-war':'target','original':'rotation'};
  root.ArenaVisuals={ game:id=>svg(id,families[id]||'rotation'),collection:id=>svg(id,collectionTypes[id]||'rotation'),families };
})(typeof window==='object'?window:this);
