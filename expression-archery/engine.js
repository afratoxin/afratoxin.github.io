(function (root) {
  'use strict';

  const RINGS = [
    { points: 1, values: [1.25, -2, 1, 37, 19, 45, -7, 108, 216, 15, 66, 31, 90, -0.5, 54] },
    { points: 2, values: [15625, 52, 78, 1.2, 701, 7777, -1.5, 47, 2.25, 732] },
    { points: 3, values: [716, 244, 601, 5184, 4090, -351] },
    { points: 4, values: [175, 373, 777] },
    { points: 5, values: [8388610] }
  ];

  function calculate(expression, cards) {
    if (typeof expression !== 'string' || !expression.trim() || expression.length > 120) {
      throw new Error('수식을 입력해 주세요 (최대 120자).');
    }
    const source = expression.replace(/sqrt/gi,'√').replace(/\s/g, '').replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-');
    const tokens = source.match(/(?:[1-9]|[()+\-*/^!√])/g);
    if (!tokens || tokens.join('') !== source) throw new Error('한 자리 숫자와 + − × ÷ ^ √ ! 괄호만 사용할 수 있습니다.');
    const allowed = new Set(cards.map(Number));
    let i = 0;
    const check = value => {
      if (!Number.isFinite(value) || Math.abs(value) > 1e13) throw new Error('계산할 수 있는 범위를 넘었습니다.');
      return value;
    };
    function primary() {
      const t = tokens[i++];
      if (t === '(') {
        const v = sum();
        if (tokens[i++] !== ')') throw new Error('괄호가 맞지 않습니다.');
        return v;
      }
      if (t && /^[1-9]$/.test(t)) {
        if (!allowed.has(Number(t))) throw new Error(`${t}은(는) 이번 숫자 카드에 없습니다.`);
        return Number(t);
      }
      throw new Error('숫자 또는 괄호가 필요한 위치입니다.');
    }
    function postfix() {
      let v = primary();
      while (tokens[i] === '!') {
        i++;
        if (!Number.isInteger(v) || v < 0 || v > 12) throw new Error('팩토리얼은 0~12의 정수에만 쓸 수 있습니다.');
        let result = 1;
        for (let k = 2; k <= v; k++) result *= k;
        v = result;
      }
      return v;
    }
    function power() {
      const v = postfix();
      if (tokens[i] === '^') {
        i++;
        return check(Math.pow(v, unary()));
      }
      return v;
    }
    function unary() {
      if (tokens[i] === '+') { i++; return unary(); }
      if (tokens[i] === '-') { i++; return -unary(); }
      if (tokens[i] === '√') {
        i++;
        const v = unary();
        if (v < 0) throw new Error('음수의 제곱근은 사용할 수 없습니다.');
        return check(Math.sqrt(v));
      }
      return power();
    }
    function product() {
      let v = unary();
      while (tokens[i] === '*' || tokens[i] === '/') {
        const op = tokens[i++], right = unary();
        if (op === '/' && right === 0) throw new Error('0으로 나눌 수 없습니다.');
        v = check(op === '*' ? v * right : v / right);
      }
      return v;
    }
    function sum() {
      let v = product();
      while (tokens[i] === '+' || tokens[i] === '-') {
        const op = tokens[i++], right = product();
        v = check(op === '+' ? v + right : v - right);
      }
      return v;
    }
    const value = sum();
    if (i !== tokens.length) throw new Error('수식 끝에 처리하지 못한 기호가 있습니다.');
    return check(value);
  }

  function matches(value, target) { return Math.abs(value - target) <= 1e-7; }

  function scoreClaim(claimed, ringIndex, targetIndex, rings=RINGS) {
    const key = `${ringIndex}:${targetIndex}`;
    if (claimed.has(key)) throw new Error('이미 맞힌 목표입니다.');
    const next = new Set(claimed);
    next.add(key);
    const ring = rings[ringIndex];
    let bonus = 0;
    if (ring.values.length >= 3) {
      const seenTriples = new Set();
      for (let start = 0; start < ring.values.length; start++) {
        const triple = [0, 1, 2].map(offset => `${ringIndex}:${(start + offset) % ring.values.length}`);
        const identity = [...triple].sort().join('|');
        if (seenTriples.has(identity)) continue;
        seenTriples.add(identity);
        if (triple.every(item => next.has(item)) && !triple.every(item => claimed.has(item))) bonus += 2;
      }
    }
    return { next, points: ring.points + bonus, bonus };
  }

  const BROADCAST_SOLUTIONS=[['5/4','2-4','1','6^2+1','5*4-1','6^2+3^2','-(6+1)','6^3/2','6^3','5*3','6*(6+5)','6^2-5','5!-5*6','-1/2','6*(6+3)'],['5^6','6^2+4^2','6!/(6+4)+6','6/5','6!-(6+6+6+1)','6!*(6+4)+6!-6!/5+1','-6/4','6^2+6+5','(3/2)^2','6!+6+6'],['6!-4','4^4-(6+6)','5!*5+1','(6!/5)*6^2','2^(6+6)-6','-(6^3+5!+5+5+5)'],['5^3+5^2+5^2','6^3+5!+6^2+1','6!+6^2+5^2-4'],['2^(6+6+6+5)+2']];
  function broadcastBoard(){return {name:'방송 첫 과녁',kind:'broadcast',rings:RINGS.map(r=>({points:r.points,values:[...r.values]})),solutions:BROADCAST_SOLUTIONS.map(a=>[...a])};}
  function randomBoard(rng=Math.random){const int=(a,b)=>a+Math.floor(rng()*(b-a+1)),used=new Set(),solutions=[],rings=RINGS.map((ring,r)=>{const expressions=[];for(let tries=0;expressions.length<ring.values.length&&tries<4000;tries++){const a=int(1,6),b=int(1,6),c=int(1,6),d=int(1,6);let exp;if(r===0)exp=['('+a+'*'+b+')+'+c,a+'*'+b+'-'+c,a+'/'+[2,4,5][int(0,2)],'-('+a+'+'+b+')'][int(0,3)];if(r===1)exp=[a+'!+'+b+'^'+c,a+'^'+b+'+'+c+'^'+d,a+'!*'+b+'-'+c][int(0,2)];if(r===2)exp=a+'!*('+b+'+'+c+')+'+d+'^'+int(3,6);if(r===3)exp='('+a+'!+'+b+'^'+c+')*('+d+'+'+int(1,6)+')';if(r===4)exp='2^(6+6+6+'+int(3,5)+')+'+int(1,6);try{const value=calculate(exp,[1,2,3,4,5,6]),key=String(value);if(!Number.isFinite(value)||value===0||Math.abs(value)>9999999||used.has(key)||r>0&&!Number.isInteger(value)||r===2&&value<100||r===3&&value<200)continue;used.add(key);expressions.push({value,exp});}catch{}}if(expressions.length!==ring.values.length)throw Error('과녁 생성 실패');solutions.push(expressions.map(a=>a.exp));return {points:ring.points,values:expressions.map(a=>a.value)};});return {name:'새로운 변형 과녁',kind:'random',rings,solutions};}
  function targetSVG(board,claimed=new Set(),selected=null){const radius=[[307,380],[232,307],[150,232],[63,150],[0,63]],fills=['#eee9dc','#25343b','#427fbd','#c24d59','#ead081'],inks=['#183338','#f2f0e7','#fff','#fff','#2d3025'],point=(r,a)=>[400+r*Math.cos(a*Math.PI/180),400+r*Math.sin(a*Math.PI/180)],path=(lo,hi,a,b)=>{const p=point(hi,a),q=point(hi,b),u=point(lo,b),v=point(lo,a);return 'M'+p.join(' ')+'A'+hi+' '+hi+' 0 0 1 '+q.join(' ')+'L'+u.join(' ')+'A'+lo+' '+lo+' 0 0 0 '+v.join(' ')+'Z';};let svg='<svg class="target-svg" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" aria-label="35개 표적의 수식 양궁 과녁">';board.rings.forEach((ring,r)=>ring.values.forEach((value,i)=>{const key=r+':'+i,count=ring.values.length,angle=(r===2?-60:-90)+i*360/count,lo=radius[r][0],hi=radius[r][1],p=point((lo+hi)/2,angle),active=selected?.r===r&&selected?.i===i;svg+='<g role="button" tabindex="0" data-shot="'+key+'" data-r="'+r+'" data-i="'+i+'" aria-label="'+value+', '+ring.points+'점 목표'+(claimed.has(key)?', 적중':'')+'" class="target-cell'+(claimed.has(key)?' claimed':'')+(active?' selected':'')+'">'+(r===4?'<circle class="sector" cx="400" cy="400" r="63"':'<path class="sector" d="'+path(lo,hi,angle-180/count,angle+180/count)+'"')+' fill="'+fills[r]+'" stroke="#192d33" stroke-width="2"/><text x="'+(r===4?400:p[0])+'" y="'+(r===4?400:p[1])+'" fill="'+inks[r]+'" font-size="'+(r===4?19:String(value).length>=5?23:27)+'">'+String(value).replace('-','−')+'</text></g>';}));return svg+'</svg>';}
  const api = { RINGS, BROADCAST_SOLUTIONS, broadcastBoard,randomBoard,targetSVG,calculate,matches,scoreClaim };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.ArcheryEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
