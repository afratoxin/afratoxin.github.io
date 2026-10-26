import test from 'node:test';
import assert from 'node:assert/strict';

// Missing engines are reported as a failed public contract until implemented.
const module = await import('../engines/counting.mjs').catch(error => {
  if (error.code === 'ERR_MODULE_NOT_FOUND') return { countingSpecs: [] };
  throw error;
});
const specs = module.countingSpecs;
const run = (id, params = {}) => {
  const spec = specs.find(item => item.id === id);
  assert.ok(spec, `${id} engine must exist`);
  return spec.solve(params);
};
const gcd = (a,b) => b ? gcd(b,a%b) : a;
const fraction = (a,b) => { const g=gcd(a,b); return b/g === 1 ? `${a/g}` : `${a/g}/${b/g}`; };
const words = (alphabet, length) => {
  if (!length) return [[]];
  return words(alphabet,length-1).flatMap(prefix=>alphabet.map(x=>[...prefix,x]));
};
function subsets(n,r,start=1,prefix=[]) {
  if (!r) return [prefix];
  return Array.from({length:Math.max(0,n-start-r+2)},(_,i)=>start+i)
    .flatMap(x=>subsets(n,r-1,x+1,[...prefix,x]));
}
function multisetWords(a,b,c,prefix='') {
  if (!a&&!b&&!c) return [prefix];
  return [['A',a,b,c],['B',b,a,c],['C',c,a,b]].flatMap(([letter,count]) => {
    if (!count) return [];
    return multisetWords(a-(letter==='A'),b-(letter==='B'),c-(letter==='C'),prefix+letter);
  });
}
function validArrangement(word, condition, circular) {
  if (condition==='none') return true;
  if (condition==='apart') {
    if (word.includes('AA')) return false;
    return !(circular&&word.length>1&&word[0]==='A'&&word.at(-1)==='A');
  }
  if (!word.includes('A') || /^A+$/.test(word)) return true;
  const runs=(word.match(/A+/g)||[]).length;
  return runs-(circular&&word[0]==='A'&&word.at(-1)==='A'?1:0)===1;
}
function arrangementCount(a,b,c,condition,circular) {
  const accepted=multisetWords(a,b,c).filter(s=>validArrangement(s,condition,circular));
  if (!circular) return accepted.length;
  return new Set(accepted.map(s=>s ? Array.from({length:s.length},(_,i)=>s.slice(i)+s.slice(0,i)).sort()[0] : '')).size;
}

test('six counting engines expose controls, defaults and three explanation steps',()=>{
  assert.deepEqual(specs.map(x=>x.id), ['arrangement','selection','function','coefficient','probability-count','conditional']);
  for (const spec of specs) {
    assert.ok(spec.title&&spec.description&&spec.category);
    assert.ok(spec.controls.length&&spec.presets.length);
    const result=spec.solve({});
    assert.equal(result.status,'ok',spec.id);
    assert.ok(result.steps.length>=3,spec.id);
    assert.ok(result.question&&result.answer&&result.insight,spec.id);
    assert.equal(spec.solve({...spec.defaults, [spec.controls[0].key]: NaN}).status,'invalid');
    assert.equal(spec.solve({...spec.defaults, [spec.controls[0].key]: '3'}).status,'invalid');
    for (const preset of spec.presets) assert.notEqual(spec.solve(preset.params).status,'invalid',`${spec.id} preset ${preset.name}`);
  }
});

test('arrangements agree with distinct-word and rotation enumeration',()=>{
  for(let a=0;a<=3;a++) for(let b=0;b<=2;b++) for(let c=0;c<=2;c++) {
    if(!a&&!b&&!c) continue;
    for(const condition of ['none','apart','together']) for(const circular of [false,true]) {
      const actual=run('arrangement',{a,b,c,condition,circular});
      assert.equal(actual.exact,`${arrangementCount(a,b,c,condition,circular)}`,JSON.stringify({a,b,c,condition,circular}));
    }
  }
  assert.equal(run('arrangement',{a:0,b:0,c:0}).exact,'1');
  assert.equal(run('arrangement',{a:10,b:10,c:10}).status,'invalid');
});

test('selections count physical balls, including ordered replacement draws',()=>{
  for(const replacement of [false,true]) for(const relation of ['eq','ge','le']) {
    for(let r=0;r<=4;r++) for(let target=0;target<=r+1;target++) {
      const R=2,B=2, samples=replacement?words([0,1,2,3],r):subsets(4,r).map(xs=>xs.map(x=>x-1));
      const expected=samples.filter(xs=>{const k=xs.filter(x=>x<2).length;return relation==='eq'?k===target:relation==='ge'?k>=target:k<=target;}).length;
      assert.equal(run('selection',{red:R,blue:B,draw:r,redTarget:target,relation,replacement}).exact,`${expected}`);
    }
  }
  assert.equal(run('selection',{red:1,blue:1,draw:3,replacement:false}).exact,'0');
});

test('function constraints agree with complete mapping enumeration',()=>{
  for(let n=0;n<=4;n++) for(let m=0;m<=3;m++) for(let fixed=0;fixed<=n;fixed++) {
    for(const constraint of ['none','onto','injective']) {
      const expected=words(Array.from({length:m},(_,i)=>i),n).filter(xs=>{
        if(xs.slice(0,fixed).some(x=>x!==0)) return false;
        const image=new Set(xs);
        return constraint==='none'||(constraint==='onto'?image.size===m:image.size===n);
      }).length;
      assert.equal(run('function',{domain:n,codomain:m,fixed,constraint}).exact,`${expected}`,JSON.stringify({n,m,fixed,constraint}));
    }
  }
  assert.equal(run('function',{domain:2,fixed:3}).status,'invalid');
});

test('coefficient agrees with repeated polynomial multiplication, including equal exponents and signs',()=>{
  for(let n=0;n<=5;n++) for(const [a,b,p,q] of [[2,3,1,2],[-2,1,0,2],[1,-1,2,2],[0,0,0,0]]) {
    let polynomial=new Map([[0,1n]]);
    for(let j=0;j<n;j++) {
      const next=new Map();
      for(const [power,coefficient] of polynomial) for(const [factor,exponent] of [[a,p],[b,q]]) {
        next.set(power+exponent,(next.get(power+exponent)||0n)+coefficient*BigInt(factor));
      }
      polynomial=next;
    }
    for(let target=0;target<=2*n+1;target++) assert.equal(run('coefficient',{a,b,p,q,n,target}).exact,`${polynomial.get(target)||0n}`);
  }
});

test('fair-die event probability agrees with independent outcome enumeration',()=>{
  for(const statistic of ['sum','product','max']) for(const relation of ['eq','ge','le']) {
    for(let sides=2;sides<=4;sides++) for(let rolls=1;rolls<=3;rolls++) for(const target of [0,2,4,6,9]) {
      const outcomes=words(Array.from({length:sides},(_,i)=>i+1),rolls);
      const successful=outcomes.filter(xs=>{
        const value=statistic==='sum'?xs.reduce((a,b)=>a+b,0):statistic==='product'?xs.reduce((a,b)=>a*b,1):Math.max(...xs);
        return relation==='eq'?value===target:relation==='ge'?value>=target:value<=target;
      }).length;
      assert.equal(run('probability-count',{sides,rolls,statistic,relation,target}).exact,fraction(successful,outcomes.length));
    }
  }
});

test('conditional probability explicitly uses the intersection over condition outcomes',()=>{
  for(const condition of ['sum-even','include','max-eq']) for(const event of ['odd-count','include','sum-ge']) {
    for(let n=2;n<=6;n++) for(let draw=0;draw<=Math.min(n,3);draw++) {
      const conditionValue=2,eventValue=event==='sum-ge'?5:1;
      const list=subsets(n,draw);
      const B=xs=>condition==='sum-even'?xs.reduce((s,x)=>s+x,0)%2===0:condition==='include'?xs.includes(conditionValue):Math.max(...xs)===conditionValue;
      const A=xs=>event==='odd-count'?xs.filter(x=>x%2).length===eventValue:event==='include'?xs.includes(eventValue):xs.reduce((s,x)=>s+x,0)>=eventValue;
      const denominator=list.filter(B).length,numerator=list.filter(xs=>B(xs)&&A(xs)).length;
      const actual=run('conditional',{n,draw,condition,conditionValue,event,eventValue});
      if(!denominator) {assert.equal(actual.status,'invalid');assert.equal(actual.numeric,null);}
      else {assert.equal(actual.exact,fraction(numerator,denominator));assert.equal(actual.cases.find(x=>x.label==='A∩B').count,`${numerator}`);assert.equal(actual.cases.find(x=>x.label==='B').count,`${denominator}`);}
    }
  }
});

test('bounds, fractional values and malformed inputs are rejected without throwing',()=>{
  for(const spec of specs) {
    for(const params of [null,[],7]) assert.equal(spec.solve(params).status,'invalid');
    for(const control of spec.controls) {
      if(control.type==='number') {
        for(const value of [Infinity,control.min-1,control.max+1,control.min+0.5]) assert.equal(spec.solve({[control.key]:value}).status,'invalid',`${spec.id}.${control.key}=${value}`);
      } else if(control.type==='select') assert.equal(spec.solve({[control.key]:'unexpected'}).status,'invalid');
      else assert.equal(spec.solve({[control.key]:'false'}).status,'invalid');
    }
  }
});

// Small independently known answers make the intended conventions explicit.
test('known answers and zero-probability boundaries',()=>{
  assert.equal(run('arrangement',{a:2,b:2,c:0,condition:'none',circular:false}).exact,'6');
  assert.equal(run('arrangement',{a:2,b:2,c:0,condition:'none',circular:true}).exact,'2');
  assert.equal(run('selection',{red:3,blue:4,draw:3,redTarget:2,relation:'eq',replacement:false}).exact,'12');
  assert.equal(run('function',{domain:4,codomain:3,fixed:0,constraint:'onto'}).exact,'36');
  assert.equal(run('function',{domain:0,codomain:0,fixed:0,constraint:'onto'}).exact,'1');
  assert.equal(run('coefficient',{a:2,b:1,p:1,q:2,n:5,target:7}).exact,'80');
  assert.equal(run('probability-count',{sides:6,rolls:2,statistic:'sum',relation:'eq',target:7}).exact,'1/6');
  assert.equal(run('probability-count',{sides:6,rolls:2,statistic:'sum',relation:'eq',target:0}).exact,'0');
  const result=run('conditional',{n:4,draw:2,condition:'include',conditionValue:1,event:'include',eventValue:2});
  assert.equal(result.exact,'1/3');
  assert.equal(result.cases.find(x=>x.label==='B').count,'3');
  assert.equal(run('conditional',{n:3,draw:2,condition:'max-eq',conditionValue:1}).answer,'정의되지 않음');
});

test('curriculum extension and conditional complements are explicit',()=>{
  const circle=run('arrangement',{circular:true});
  assert.ok(circle.warnings.some(text=>text.includes('확장 실험')));
  const cards=run('conditional');
  assert.ok(cards.cases.some(row=>row.label==='A∩(B의 여사건)'));
  assert.ok(cards.cases.some(row=>row.label==='(A의 여사건)∩B'));
  assert.ok(cards.cases.some(row=>row.label==='(A의 여사건)∩(B의 여사건)'));
});

const explanation = result => result.steps.map(step => `${step.title} ${step.body} ${step.formula ?? ''}`).join('\n');
test('die sums teach substitution, combinations and upper-bound inclusion exclusion',()=>{
  const exact=run('probability-count',{sides:6,rolls:3,statistic:'sum',relation:'eq',target:10});
  assert.equal(exact.exact,'1/8');
  assert.match(explanation(exact),/중복조합/);
  assert.match(explanation(exact),/포함배제/);
  assert.match(explanation(exact),/치환/);
  const almostAll=run('probability-count',{sides:6,rolls:3,statistic:'sum',relation:'le',target:17});
  assert.equal(almostAll.exact,'215/216');
  assert.match(explanation(almostAll),/여사건/);
  const shortTail=run('probability-count',{sides:6,rolls:3,statistic:'sum',relation:'ge',target:17});
  assert.equal(shortTail.exact,'1/54');
  assert.match(explanation(shortTail),/대칭.*치환|치환.*대칭/);
});

test('maximum uses powers and complements, product groups divisors and last faces',()=>{
  const maximum=run('probability-count',{sides:6,rolls:4,statistic:'max',relation:'eq',target:5});
  assert.equal(maximum.exact,'41/144');
  assert.match(explanation(maximum),/5\^4/);
  assert.match(explanation(maximum),/4\^4/);
  assert.match(explanation(run('probability-count',{statistic:'max',relation:'ge',target:5})),/여사건/);
  const product=run('probability-count',{sides:6,rolls:3,statistic:'product',relation:'eq',target:12});
  assert.equal(product.exact,'5/72');
  assert.match(explanation(product),/약수/);
  assert.match(explanation(product),/마지막/);
  assert.match(explanation(product),/순열/);
  assert.ok(product.cases.some(row=>row.label.includes('앞부분의 곱')));
});

test('conditional card explanations derive parity and fixed-card combination counts',()=>{
  const parity=run('conditional',{n:8,draw:3,condition:'sum-even',event:'include',eventValue:1});
  assert.equal(parity.exact,'3/7');
  assert.match(explanation(parity),/홀수.*짝수|짝수.*홀수/);
  assert.match(explanation(parity),/C\(4,2\)/);
  assert.match(explanation(parity),/C\(3,1\)/);
  const fixed=run('conditional',{n:8,draw:3,condition:'include',conditionValue:1,event:'odd-count',eventValue:2});
  assert.equal(fixed.exact,'4/7');
  assert.match(explanation(fixed),/C\(7,2\)/);
  assert.match(explanation(fixed),/고정/);
  const maximum=run('conditional',{n:8,draw:3,condition:'max-eq',conditionValue:5,event:'include',eventValue:2});
  assert.equal(maximum.exact,'1/2');
  assert.match(explanation(maximum),/C\(4,2\)/);
  assert.match(explanation(maximum),/C\(3,1\)/);
});

test('card sum threshold uses disjoint extremal-card cases and combination shortcuts',()=>{
  const result=run('conditional',{n:8,draw:3,condition:'max-eq',conditionValue:5,event:'sum-ge',eventValue:10});
  assert.equal(result.exact,'2/3');
  assert.match(explanation(result),/최댓값/);
  assert.match(explanation(result),/최소.*합|최대.*합/);
  assert.match(explanation(result),/조합/);
  const terms=result.cases.filter(row=>row.label.startsWith('합 조건:'));
  assert.ok(terms.length>0);
  assert.equal(terms.reduce((sum,row)=>sum+BigInt(row.count),0n),4n);
  assert.ok(!result.samples?.length,'worked solutions should show counted classes, not individual card subsets');
});

test('student solutions do not present dynamic-programming accumulation as the method',()=>{
  for(const statistic of ['sum','product','max'])for(const relation of ['eq','ge','le']) {
    const result=run('probability-count',{statistic,relation,target:12});
    assert.doesNotMatch(explanation(result),/경우의 수 누적|이전 합|이전 곱|도착하는|새 합 =|새 곱 =/);
  }
});

// A tiny arithmetic parser checks the displayed numerical formula independently.
// It accepts only integer arithmetic and C(n,k), never JavaScript or engine code.
function displayedInteger(expression) {
  const binomial=(n,k)=>{
    if(n<0||k<0||k>n)return 0n;
    let upper=1n,lower=1n;
    for(let j=1;j<=k;j++){upper*=BigInt(n-j+1);lower*=BigInt(j);}
    return upper/lower;
  };
  const expanded=expression.replace(/C\((-?\d+),(-?\d+)\)/g,(_,n,k)=>`${binomial(Number(n),Number(k))}`)
    .replaceAll('×','*').replaceAll('−','-').replace(/\s+/g,'');
  assert.match(expanded,/^[\d()+*^\-]+$/,`not a numerical counting formula: ${expression}`);
  const tokens=expanded.match(/\d+|[()+*^\-]/g);let at=0;
  const atom=()=>{
    if(tokens[at]==='-'){at++;return -atom();}
    if(tokens[at]==='('){at++;const value=sum();assert.equal(tokens[at++],')');return value;}
    return BigInt(tokens[at++]);
  };
  const exponent=()=>{const value=atom();if(tokens[at]==='^'){at++;return value**exponent();}return value;};
  const product=()=>{let value=exponent();while(tokens[at]==='*'){at++;value*=exponent();}return value;};
  const sum=()=>{let value=product();while(tokens[at]==='+'||tokens[at]==='-'){const sign=tokens[at++];const next=product();value=sign==='+'?value+next:value-next;}return value;};
  const value=sum();assert.equal(at,tokens.length);return value;
}

test('displayed die formulas and grouped product cases equal the independently counted numerator',()=>{
  for(const sides of [2,4,6])for(const rolls of [1,3,5])for(const relation of ['eq','le','ge']) {
    for(const target of [0,1,sides,sides*rolls,15,999])for(const statistic of ['sum','max','product']) {
      const result=run('probability-count',{sides,rolls,relation,target,statistic});
      const expected=BigInt(result.cases.find(row=>row.label==='사건 A').count);
      const formula=result.steps.at(-2).formula;
      assert.equal(BigInt(formula.match(/= (\d+)$/)[1]),expected,JSON.stringify({sides,rolls,relation,target,statistic}));
      if(statistic!=='product')assert.equal(displayedInteger(formula.split(' = ')[0]),expected);
      else {
        const groups=result.cases.filter(row=>row.label.startsWith('앞부분의 곱')||row.label.startsWith('마지막 눈'));
        assert.equal(groups.reduce((sum,row)=>sum+BigInt(row.count),0n),expected);
      }
    }
  }
});

test('displayed parity/fixed-card formulas and sum case tables reproduce numerator and denominator',()=>{
  for(let n=1;n<=7;n++)for(let draw=0;draw<=Math.min(n,3);draw++)for(const condition of ['sum-even','include','max-eq']) {
    for(const conditionValue of [1,n+1])for(const event of ['odd-count','include','sum-ge'])for(const eventValue of [0,2,n]) {
      const result=run('conditional',{n,draw,condition,conditionValue,event,eventValue});
      for(const [label,index] of [['B',1],['A∩B',2]]) {
        const formula=result.steps[index].formula.split(' = ')[1];
        assert.equal(displayedInteger(formula),BigInt(result.cases.find(row=>row.label===label).count),JSON.stringify({n,draw,condition,conditionValue,event,eventValue,label}));
      }
      if(event==='sum-ge')assert.equal(result.cases.filter(row=>row.label.startsWith('합 조건:')).reduce((sum,row)=>sum+BigInt(row.count),0n),BigInt(result.cases.find(row=>row.label==='A∩B').count));
    }
  }
});

test('impossible card constraints are explained before forming negative selection sizes',()=>{
  for(const params of [
    {n:4,draw:1,condition:'include',conditionValue:1,event:'include',eventValue:2},
    {n:4,draw:2,condition:'include',conditionValue:1,event:'odd-count',eventValue:0},
    {n:4,draw:2,condition:'sum-even',event:'odd-count',eventValue:4},
  ])assert.doesNotMatch(explanation(run('conditional',params)),/홀수는 -\d+장|나머지 -\d+장|짝수 -\d+장|중 -\d+장/);
});
