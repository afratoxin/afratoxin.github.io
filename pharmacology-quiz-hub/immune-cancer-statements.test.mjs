import test from 'node:test';
import assert from 'node:assert/strict';
import * as immune from './immune-data.mjs';
import * as cancer from './anticancer-data.mjs';
import * as signal from './signal31-data.mjs';

// Independent lecture-fact oracle. Shared targets stay true even when an option
// originally came from another drug's row.
const facts = groups => Object.fromEntries(groups.flatMap(([ids, labels]) => ids.split(' ').map(id => [id, labels])));
const immuneFacts = facts([
  ['cyclosporine tacrolimus',['Calcineurin']], ['sirolimus everolimus',['mTOR']], ['tofacitinib',['JAK1·JAK3']],
  ['methylprednisolone prednisolone prednisone',['Glucocorticoid receptor (GR)']],
  ['aza',['6-MP 전환 → purine de novo 합성 억제']], ['mmf',['MPA 전환 → IMPDH 억제']], ['mtx',['DHFR 억제 · 핵산 합성 감소']],
  ['atg',['다수 T세포 표면항원 · 다클론 항체']], ['okt3',['CD3']], ['basiliximab daclizumab',['CD25 (IL-2Rα)']],
  ['alemtuzumab',['CD52']], ['rituximab',['CD20 (B세포)']], ['abatacept',['B7 (CD80·CD86)']], ['alefacept',['CD2']],
  ['efalizumab',['CD11a (LFA-1)']], ['natalizumab',['α4 integrin']],
  ['etanercept infliximab adalimumab certolizumab golimumab',['TNF 차단']], ['tocilizumab',['IL-6 receptor']],
  ['anakinra',['IL-1 receptor']], ['secukinumab ixekizumab',['IL-17A']], ['epo',['Erythropoietin → 적혈구 생성']],
  ['filgrastim',['G-CSF → 호중구 생성']], ['sargramostim',['GM-CSF → 호중구·호산구 등 조혈세포 증가']],
  ['mcsf',['M-CSF → 단핵구·대식세포 계열 생성']], ['betaseron',['Interferon β-1b']], ['avonex',['Interferon β-1a']],
  ['cervarix',['예방대상 HPV 유형 전체 목록: HPV 16·18']],
  ['gardasil9',['예방대상 HPV 유형 전체 목록: HPV 6·11·16·18·31·33·45·52·58']],
]);
const cancerFacts = facts([
  ['vincristine vinblastine',['미세소관 중합 억제']], ['paclitaxel docetaxel',['미세소관 안정화 · 탈중합 억제']],
  ['etoposide',['Topoisomerase II 절단 복합체 안정화']], ['irinotecan topotecan',['Topoisomerase I 절단 복합체 안정화']],
  ['doxorubicin daunorubicin',['DNA 삽입 · Topo II 억제 · ROS 생성','Topoisomerase II 절단 복합체 안정화','ROS 생성 · DNA 가닥 절단','DNA 삽입 · 전사 억제']],
  ['bleomycin',['ROS 생성 · DNA 가닥 절단']], ['mitomycin',['환원 활성화 · DNA 가닥 간 교차결합']],
  ['dactinomycin',['DNA 삽입 · 전사 억제']], ['asparaginase',['혈중 asparagine 분해·고갈']],
  ['prednisone dexamethasone',['Glucocorticoid receptor · 유전자 발현 조절']], ['dexrazoxane',['Anthracycline 심장독성 완화 보조']],
  ['anastrozole letrozole exemestane',['Aromatase 억제 · estrogen 생성 감소']], ['tamoxifen',['ER 조직선택적 조절 (SERM)']],
  ['fulvestrant',['ER 분해·수용체 감소 (SERD)']], ['leuprolide goserelin',['GnRH 수용체 지속 자극 → 탈감작']],
  ['degarelix relugolix',['GnRH 수용체 직접 차단']], ['enzalutamide bicalutamide',['Androgen receptor 신호 차단']],
  ['abiraterone',['CYP17 억제 · androgen 합성 감소']],
]);
const signalFacts = facts([
  ['tretinoin',['RARα']], ['cetuximab panitumumab gefitinib erlotinib',['EGFR']], ['lapatinib',['EGFR','HER2']],
  ['afatinib',['EGFR','HER2','HER4']], ['trastuzumab enhertu',['HER2']], ['rituximab ibritumomab',['CD20']],
  ['alemtuzumab',['CD52']], ['denileukin',['IL-2R']], ['gemtuzumab',['CD33']], ['brentuximab',['CD30']],
  ['pembrolizumab nivolumab',['PD-1']], ['durvalumab atezolizumab',['PD-L1']],
  ['imatinib nilotinib',['BCR-ABL','KIT','PDGFR']], ['dasatinib',['BCR-ABL','SRC','KIT','PDGFR']],
  ['bevacizumab',['VEGF-A']], ['sorafenib',['RAF','VEGFR','PDGFR','KIT']], ['sunitinib',['VEGFR','PDGFR','KIT']],
  ['bortezomib',['26S proteasome']], ['crizotinib',['ALK','c-MET']], ['vorinostat',['HDAC']],
]);
const banks = [
  ['immune',immune.IMM_DRUGS,immune.IMM_QUESTIONS,immune.pickImmQuestion,immuneFacts],
  ['anticancer',cancer.ANTI_DRUGS,cancer.ANTI_QUESTIONS,cancer.pickAntiQuestion,cancerFacts],
  ['signal31',signal.SIGNAL_DRUGS,signal.SIGNAL_QUESTIONS,signal.pickSignalQuestion,signalFacts],
];

for (const [name,drugs,questions,pick,truth] of banks) {
  test(`${name}: every existing drug gains both genuine judgment polarities`, () => {
    const statements=questions.filter(q=>q.format==='judgment');
    assert.equal(statements.length,drugs.length*2);
    for(const d of drugs)for(const polarity of ['correct','incorrect']) {
      const q=statements.find(q=>q.id===`statement-${polarity}-${d.id}`);
      assert.ok(q,d.id+' '+polarity);assert.equal(q.subject,d.id);assert.equal(q.kind,'target');
      assert.equal(q.core,d.core);assert.equal(q.weight,d.weight);assert.equal(q.polarity,polarity);
      assert.match(q.stem,polarity==='correct'?/옳은 것은/:/옳지 않은 것은/);
    }
    for(const d of drugs)for(const direction of ['forward','reverse'])assert.ok(questions.some(q=>q.id===`${direction}-${d.id}`));
  });
  test(`${name}: independently grade five distinct source-backed pairs`, () => {
    const statements=questions.filter(q=>q.format==='judgment');assert.ok(statements.length);
    for(const q of statements) {
      assert.equal(q.options.length,5,q.id);assert.equal(new Set(q.options).size,5,q.id);
      assert.equal(q.pairs.length,5,q.id);assert.equal(new Set(q.pairs.map(p=>p.entity)).size,5,q.id);
      const valid=q.pairs.filter(p=>truth[p.entity]?.includes(p.right));
      assert.equal(valid.length,q.polarity==='correct'?1:4,q.id);
      for(const p of q.pairs) {
        assert.equal(p.valid,truth[p.entity].includes(p.right),q.id+' '+p.left+' '+p.right);
        assert.ok(p.source&&p.explanation,q.id);assert.ok(q.options.includes(`${p.left} — ${p.right}`));
      }
      const answer=q.pairs.find(p=>truth[p.entity].includes(p.right)===(q.polarity==='correct'));
      assert.equal(q.answer,`${answer.left} — ${answer.right}`,q.id);
      for(const option of q.options)assert.equal(q.details.filter(d=>d.startsWith(option+':')).length,1,q.id+' explanation');
    }
  });
  test(`${name}: judgment questions remain frequent beside clinical selection while target coverage stays at 80%`, () => {
    let seed=7901;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
    const state={draws:0,seen:{},recent:[],subjects:[],lastGroup:null};let target=0,judgment=0;
    const positions=new Set(),polarities=new Set();
    for(let i=0;i<1000;i++) {
      const q=pick(state,'core','mixed',random);target+=q.kind==='target';
      if(q.format==='judgment') {judgment++;polarities.add(q.polarity);positions.add(q.answerIndex);}
      assert.equal(q.choices[q.answerIndex].text,q.answer);
      state.draws++;state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.subjects=[q.subject,...state.subjects].slice(0,3);state.lastGroup=q.group;
    }
    assert.equal(target,800);assert.ok(judgment>=240,`${judgment}/1000`);assert.equal(polarities.size,2);assert.equal(positions.size,5);
  });
}

test('overlap counterexamples and stimulatory mechanisms retain their actual meaning', () => {
  for(const [name,,questions,,truth] of banks)for(const q of questions.filter(q=>q.format==='judgment'))for(const p of q.pairs) {
    if(name==='signal31'&&['imatinib','nilotinib','dasatinib'].includes(p.entity)&&['KIT','PDGFR'].includes(p.right))assert.ok(p.valid);
    if(name==='anticancer'&&['doxorubicin','daunorubicin'].includes(p.entity)&&cancerFacts[p.entity].includes(p.right))assert.ok(p.valid);
    assert.equal(p.valid,truth[p.entity].includes(p.right),q.id);
  }
  // Exercise each risk explicitly: do not let these assertions pass merely
  // because a particular overlapping feature was absent from a random draw.
  for(const id of ['doxorubicin','daunorubicin']) {
    const q=cancer.ANTI_QUESTIONS.find(q=>q.id===`statement-incorrect-${id}`);
    const own=q.pairs.find(p=>p.entity===id);assert.equal(own.valid,false);
    assert.ok(!cancerFacts[id].includes(own.right));
    for(const mechanism of ['Topoisomerase II 절단 복합체 안정화','ROS 생성 · DNA 가닥 절단','DNA 삽입 · 전사 억제'])assert.ok(cancerFacts[id].includes(mechanism));
  }
  for(const id of ['imatinib','nilotinib','dasatinib','lapatinib','afatinib','sorafenib','sunitinib','crizotinib']) {
    const q=signal.SIGNAL_QUESTIONS.find(q=>q.id===`statement-incorrect-${id}`);
    const own=q.pairs.find(p=>p.entity===id);assert.equal(own.valid,false);assert.ok(!signalFacts[id].includes(own.right));
    assert.deepEqual(signal.SIGNAL_DRUGS.find(d=>d.id===id).targets,signalFacts[id]);
  }
  for(const id of ['cervarix','gardasil9']) {
    const q=immune.IMM_QUESTIONS.find(q=>q.id===`statement-correct-${id}`);
    assert.match(q.pairs.find(p=>p.entity===id).right,/전체 목록:/);
  }
  for(const id of ['epo','filgrastim','sargramostim','mcsf']) {
    const q=immune.IMM_QUESTIONS.find(q=>q.id===`statement-correct-${id}`);assert.ok(q);
    const own=q.pairs.find(p=>p.entity===id);assert.ok(own.valid);assert.match(own.right,/생성|증가/);
  }
  for(const id of ['leuprolide','goserelin']) {
    const q=cancer.ANTI_QUESTIONS.find(q=>q.id===`statement-correct-${id}`);
    assert.match(q.pairs.find(p=>p.entity===id).right,/지속 자극.*탈감작/);
  }
});
