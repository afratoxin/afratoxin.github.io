import {ADR13_MATCH} from './adr13.mjs?v=20261017-clinical1';
const beta={
  propranolol:[1,'Propranolol','β1·β2',[],'비선택적 β 차단의 대표 약물 · 기관지 수축·저혈당 회복 지연을 구별'],
  timolol:[1,'Timolol','β1·β2',[],'녹내장: 방수 생성 감소 · 콜린 효현제의 방수 배출 촉진과 구별'],
  penbutolol:[1,'Penbutolol','β1·β2',[],'첨부 표와 강의록의 1세대 비선택성 목록'],
  pindolol:[1,'Pindolol','β1·β2',[],'첨부 표와 강의록의 1세대 비선택성 목록'],
  nadolol:[1,'Nadolol','β1·β2',[],'강의록에 추가로 제시된 1세대 비선택성 약물'],
  sotalol:[1,'Sotalol','β1·β2',[],'강의록에 추가로 제시된 1세대 비선택성 약물'],
  metoprolol:[2,'Metoprolol','β1',[],'2세대 β1 선택성 · 비선택적 약물과 구별'],
  atenolol:[2,'Atenolol','β1',[],'2세대 β1 선택성 · 비선택적 약물과 구별'],
  esmolol:[2,'Esmolol','β1',[],'β1 선택성 · 짧은 작용 시간'],
  bisoprolol:[2,'Bisoprolol','β1',[],'2세대 β1 선택성 · 비선택적 약물과 구별'],
  acebutolol:[2,'Acebutolol','β1',[],'강의록에 추가로 제시된 2세대 β1 선택성 약물'],
  labetalol:[3,'Labetalol','β1·β2',['alpha1'],'비선택성 β 차단 + α1 차단'],
  carvedilol:[3,'Carvedilol','β1·β2',['alpha1','calcium','antioxidant'],'족보 반복: 비선택성 β 차단 + α1 차단 + 항산화'],
  carteolol:[3,'Carteolol','β1·β2',['no','beta2'],'강의표의 NO 생성·β2 효현을 함께 연결'],
  betaxolol:[3,'Betaxolol','β1',['calcium'],'강의표의 Ca²⁺ 유입 봉쇄를 연결'],
  nebivolol:[3,'Nebivolol','β1',['no','antioxidant'],'강의표의 NO 생성·항산화를 연결'],
  celiprolol:[3,'Celiprolol','β1',['no','beta2','alpha1','antioxidant'],'강의표의 NO·β2 효현·α1 봉쇄·항산화를 연결']
};
const extraNotes={phenoxybenzamine:'비가역성 α 차단 · 갈색세포종',phentolamine:'가역성 α1·α2 차단',prazosin:'선택적 α1 차단 · 혈관·전립선 평활근 이완',terazosin:'선택적 α1 차단',doxazosin:'선택적 α1 차단',alfuzosin:'전립선 평활근 α1 차단',tamsulosin:'α1A 선택성 · 사정 장애 단서',silodosin:'α1A 선택성 · 전립선 평활근 이완',yohimbine:'α2 자가수용체 차단 → NE 유리 증가',metyrosine:'Tyrosine hydroxylase 억제 → 카테콜아민 합성 감소',reserpine:'VMAT 억제 → 소포 저장 감소',guanethidine:'NE 소포 유리 억제'};
export const ADR13_EXTRA_COLUMNS=[['no','NO 생성'],['beta2','β2 효현'],['alpha1','α1 봉쇄'],['calcium','Ca²⁺ 유입 봉쇄'],['antioxidant','항산화']];
export const ADR13_DRUG_TABLE=[...ADR13_MATCH,...['penbutolol','carteolol','betaxolol','nebivolol','celiprolol'].map(drug=>({drug}))].map(d=>{
  const b=beta[d.drug];return b?{id:d.drug,name:b[1],family:'beta',generation:b[0],selectivity:b[2],extras:b[3],role:b[4],source:'13강 PDF 20쪽 · 첨부 β 차단제 표'}:{id:d.drug,name:d.drug[0].toUpperCase()+d.drug.slice(1),family:d.drug in extraNotes&&['metyrosine','reserpine','guanethidine'].includes(d.drug)?'extra':'alpha',generation:null,selectivity:d.category,extras:[],role:extraNotes[d.drug],source:['metyrosine','reserpine','guanethidine'].includes(d.drug)?'13강 PDF 16쪽 · 9강 합성·저장·유리 복습':'13강 PDF 13·18쪽'};
}).sort((a,b)=>({alpha:0,beta:1,extra:2}[a.family]-{alpha:0,beta:1,extra:2}[b.family])||(a.generation||0)-(b.generation||0));
export function initAdr13Table(){
  const $=id=>document.getElementById(id),node=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};let ready=false;
  function render(){
    const filter=$('adr13TableFilter').value,search=$('adr13TableSearch').value.trim().toLocaleLowerCase();
    const rows=ADR13_DRUG_TABLE.filter(d=>(filter==='all'||d.family===filter)&&[d.name,d.selectivity,d.role,...d.extras.map(key=>ADR13_EXTRA_COLUMNS.find(x=>x[0]===key)[1])].join(' ').toLocaleLowerCase().includes(search));
    const body=$('adr13TableBody');body.replaceChildren();for(const d of rows){const tr=node('tr'),name=node('td');name.append(node('strong',d.name));
      const family=d.family==='beta'?`${d.generation}세대 · ${d.selectivity==='β1'?'β1 선택성':'비선택성 β'}`:d.family==='alpha'?'α 차단제':'합성·저장·유리';
      for(const cell of [name,node('td',family),node('td',d.selectivity),node('td',d.extras.length?d.extras.map(key=>ADR13_EXTRA_COLUMNS.find(x=>x[0]===key)[1]).join(' · '):'—'),node('td',d.role),node('td',d.source)])tr.append(cell);body.append(tr);}
    $('adr13TableCount').textContent=`${rows.length}/${ADR13_DRUG_TABLE.length}개 약물`;$('adr13TableEmpty').hidden=Boolean(rows.length);
  }
  function extras(){const body=$('adr13ExtraBody');body.replaceChildren();for(const id of ['labetalol','carvedilol','carteolol','betaxolol','nebivolol','celiprolol']){const d=ADR13_DRUG_TABLE.find(d=>d.id===id),tr=node('tr');tr.append(node('th',d.name),node('td',d.selectivity==='β1'?'β1 선택성':'비선택성 β'));tr.children[0].setAttribute('scope','row');for(const [key]of ADR13_EXTRA_COLUMNS){const on=d.extras.includes(key),cell=node('td',on?'●':'—');if(on)cell.className='adr13-extra-yes';tr.append(cell);}body.append(tr);}}
  $('adr13TableFilter').addEventListener('change',render);$('adr13TableSearch').addEventListener('input',render);
  return {open(){if(!ready){extras();ready=true;}render();}};
}
