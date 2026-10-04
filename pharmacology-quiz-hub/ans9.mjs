// 2026년 9강 자율신경계 약리 기초. 강의록 10·12–20·24–25쪽.
// Each incorrect statement changes one transporter, receptor, substrate, direction, or location.
const f=(id,group,stage,correct,incorrect,note,page)=>({id,group,stage,correct,incorrect,note,page});
export const ANS_FACTS=[
  f('somatic','circuit','회로','체성 운동신경의 ACh는 골격근의 Nm 수용체에 결합한다.','체성 운동신경의 ACh는 골격근의 Nn 수용체에 결합한다.','골격근 신경근 접합부는 Nm이다.',10),
  f('ganglion-sym','circuit','회로','교감신경 절전섬유의 ACh는 신경절 Nn 수용체에 결합한다.','교감신경 절전섬유의 ACh는 신경절 Nm 수용체에 결합한다.','자율신경절의 니코틴 수용체는 Nn이다.',10),
  f('ganglion-para','circuit','회로','부교감신경 절전섬유의 ACh는 신경절 Nn 수용체에 결합한다.','부교감신경 절전섬유의 ACh는 신경절 Nm 수용체에 결합한다.','교감·부교감의 절전 전달은 모두 ACh → Nn이다.',10),
  f('post-sym','circuit','회로','대부분의 교감신경 절후섬유는 NE를 분비해 α·β 수용체에 작용한다.','대부분의 교감신경 절후섬유는 ACh를 분비해 α·β 수용체에 작용한다.','교감 절후의 원칙은 NE → 아드레날린 수용체이다.',10),
  f('post-para','circuit','회로','부교감신경 절후섬유는 ACh를 분비해 무스카린 수용체에 작용한다.','부교감신경 절후섬유는 ACh를 분비해 니코틴 수용체에 작용한다.','부교감 절후의 작동기관 수용체는 무스카린 수용체이다.',10),
  f('sweat','circuit','회로','일부 땀샘의 교감신경 절후섬유는 ACh를 분비해 무스카린 수용체에 작용한다.','일부 땀샘의 교감신경 절후섬유는 NE를 분비해 무스카린 수용체에 작용한다.','땀샘은 교감 절후섬유의 콜린성 예외이다.',10),
  f('medulla','circuit','회로','부신수질에는 절전섬유의 ACh가 들어와 Nn 수용체를 활성화한다.','부신수질에는 절전섬유의 ACh가 들어와 Nm 수용체를 활성화한다.','부신수질은 신경절 이후 뉴런 대신 호르몬 분비가 이어지는 예외이다.',10),
  f('sym-fiber','circuit','회로','교감신경은 절전섬유가 짧고 절후섬유가 길다.','교감신경은 절전섬유가 길고 절후섬유가 짧다.','교감신경절은 척수 가까이에 있다.',10),
  f('para-fiber','circuit','회로','부교감신경은 절전섬유가 길고 절후섬유가 짧다.','부교감신경은 절전섬유가 짧고 절후섬유가 길다.','부교감신경절은 작동기관 가까이에 있다.',10),
  f('nm-channel','circuit','수용체 유형','골격근 Nm 수용체는 ACh가 여는 이온통로이다.','골격근 Nm 수용체는 ACh가 활성화하는 GPCR이다.','Nm·Nn은 ligand-gated ion channel이다.',25),
  f('nn-channel','circuit','수용체 유형','신경절 Nn 수용체는 ACh가 여는 이온통로이다.','신경절 Nn 수용체는 ACh가 활성화하는 GPCR이다.','Nn도 니코틴 수용체이므로 이온통로이다.',25),
  f('muscarinic-type','circuit','수용체 유형','무스카린 수용체 M1–M5는 GPCR에 속한다.','무스카린 수용체 M1–M5는 리간드 개폐 이온통로에 속한다.','무스카린 수용체는 metabotropic GPCR이다.',25),
  f('adrenergic-type','circuit','수용체 유형','NE가 작용하는 α·β 아드레날린 수용체는 GPCR이다.','NE가 작용하는 α·β 아드레날린 수용체는 리간드 개폐 이온통로이다.','강의록의 α·β 아드레날린 수용체는 모두 GPCR이다.',25),

  f('cht','steps','합성','ChT는 시냅스전 뉴런 안으로 choline을 유입시킨다.','ChT는 시냅스전 뉴런 밖으로 choline을 유출시킨다.','ChT를 거친 choline이 ACh 합성에 이용된다.',12),
  f('hemicholinium','steps','합성','Hemicholinium은 ChT를 통한 choline 유입을 억제한다.','Hemicholinium은 ChT를 통한 choline 유입을 촉진한다.','ChT 억제로 ACh 합성에 필요한 choline 유입이 줄어든다.',12),
  f('chat','steps','합성','ChAT는 choline과 acetyl-CoA로부터 ACh를 합성한다.','ChAT는 choline과 acetyl-CoA로부터 NE를 합성한다.','ChAT의 생성물은 ACh이다.',12),
  f('vacht','steps','저장','VAChT(VAT)는 ACh를 소포 안으로 운반한다.','VAChT(VAT)는 choline을 소포 안으로 운반한다.','VAChT의 화물은 합성된 ACh이다.',12),
  f('vesamicol','steps','저장','Vesamicol은 ACh의 소포 유입을 담당하는 VAChT를 억제한다.','Vesamicol은 ACh의 소포 유입을 담당하는 VAChT를 촉진한다.','Vesamicol은 소포 저장 단계의 VAChT 억제제이다.',12),
  f('snare','steps','유리','SNARE 복합체에는 synaptobrevin·syntaxin·SNAP-25가 포함된다.','SNARE 복합체에는 synaptobrevin·syntaxin·synaptotagmin이 포함된다.','Synaptotagmin은 Ca²⁺ 감지 단백질이지 SNARE 구성원이 아니다.',14),
  f('calcium','steps','유리','시냅스전 말단으로 Ca²⁺가 유입되면 ACh 소포의 융합이 촉진된다.','시냅스전 말단으로 Ca²⁺가 유입되면 ACh 소포의 융합이 억제된다.','전압개폐 Ca²⁺ 통로와 synaptotagmin이 소포 유리에 연결된다.',13),
  f('botox','steps','유리','Botulinum toxin은 SNARE 단백질을 절단해 ACh 유리를 억제한다.','Botulinum toxin은 synaptotagmin을 절단해 ACh 유리를 억제한다.','독소가 절단하는 표적은 SNARE이며 synaptotagmin이 아니다.',14),
  f('ach-postsynaptic','steps','수용체 활성화','유리된 ACh는 시냅스후 콜린 수용체에 결합한다.','유리된 ACh는 시냅스후 아드레날린 수용체에 결합한다.','콜린성 신경전달의 작동기관 수용체는 ACh를 인식한다.',16),
  f('ne-postsynaptic','steps','수용체 활성화','유리된 NE는 시냅스후 아드레날린 수용체에 결합한다.','유리된 NE는 시냅스후 콜린 수용체에 결합한다.','아드레날린성 신경전달의 작동기관 수용체는 catecholamine을 인식한다.',19),
  f('ache','steps','작용 종결','Acetylcholinesterase는 틈의 ACh를 acetate와 choline으로 분해한다.','Acetylcholinesterase는 틈의 NE를 acetate와 choline으로 분해한다.','AChE는 ACh의 작용 종결에 관여한다.',16),
  f('tyr-hydroxylase','steps','합성','Tyrosine hydroxylase는 tyrosine을 L-DOPA로 바꾼다.','Tyrosine hydroxylase는 L-DOPA를 dopamine으로 바꾼다.','L-DOPA → dopamine은 별도의 DOPA decarboxylase 단계이다.',16),
  f('metyrosine','steps','합성','Metyrosine은 tyrosine hydroxylase를 억제한다.','Metyrosine은 tyrosine hydroxylase를 촉진한다.','Metyrosine은 카테콜아민 합성의 초기 단계를 억제한다.',16),
  f('dbh','steps','합성','Dopamine β-hydroxylase는 소포에서 dopamine을 NE로 바꾼다.','Dopamine β-hydroxylase는 소포에서 NE를 dopamine으로 바꾼다.','Dopamine → NE 전환이 소포 안에서 일어난다.',18),
  f('pnmt','steps','합성','PNMT는 세포질에서 NE를 epinephrine으로 바꾼다.','PNMT는 소포 안에서 NE를 epinephrine으로 바꾼다.','PNMT의 NE → E 전환은 소포 밖에서 일어난다.',18),
  f('vmat','steps','저장','VMAT는 catecholamine을 소포 안으로 운반한다.','VMAT는 catecholamine을 소포 밖으로 운반한다.','VMAT는 monoamine의 소포 저장을 맡는다.',17),
  f('reserpine','steps','저장','Reserpine은 catecholamine의 소포 유입을 담당하는 VMAT를 억제한다.','Reserpine은 catecholamine의 소포 유입을 담당하는 VAChT를 억제한다.','Reserpine → VMAT, vesamicol → VAChT로 구별한다.',17),
  f('epinephrine-vesicle','steps','저장','세포질에서 만들어진 epinephrine은 VMAT를 거쳐 소포에 다시 들어간다.','세포질에서 만들어진 epinephrine은 VAChT를 거쳐 소포에 다시 들어간다.','E의 소포 재유입도 VMAT가 담당한다.',18),
  f('bretylium','steps','유리','Bretylium은 카테콜아민의 소포 유리를 억제한다.','Bretylium은 카테콜아민의 소포 유리를 촉진한다.','강의록에서 아드레날린성 유리 억제제로 분류한다.',19),
  f('guanethidine','steps','유리','Guanethidine은 카테콜아민의 소포 유리를 억제한다.','Guanethidine은 ACh의 소포 유리를 억제한다.','Guanethidine의 연결은 카테콜아민 유리 억제이다.',19),
  f('net','steps','작용 종결','NET는 시냅스 틈의 NE를 시냅스전 뉴런으로 재흡수한다.','NET는 시냅스 틈의 NE를 시냅스후 세포로 재흡수한다.','NET의 재흡수 방향은 시냅스전 뉴런이다.',19),
  f('cocaine','steps','작용 종결','Cocaine은 NET를 통한 NE 재흡수를 억제한다.','Cocaine은 NET를 통한 ACh 재흡수를 억제한다.','NET는 NE 등 monoamine 재흡수에 관여하며 ACh 재흡수 통로가 아니다.',19),
  f('tca','steps','작용 종결','삼환계 항우울제는 NET를 통한 NE 재흡수를 억제한다.','삼환계 항우울제는 VAChT를 통한 NE 재흡수를 억제한다.','VAChT는 ACh의 소포 저장이며 NET는 NE의 재흡수이다.',19),
  f('autoreceptor','steps','작용 종결','높은 시냅스 NE를 감지한 자가수용체는 추가 유리를 억제한다.','높은 시냅스 NE를 감지한 자가수용체는 추가 유리를 촉진한다.','자가수용체는 분비를 낮추는 음성 피드백이다.',19),

  f('m1','gpcr','G 단백질','M1 수용체는 Gq에 연결된다.','M1 수용체는 Gi에 연결된다.','M1 → Gq → PLC 활성화.',25),
  f('m2','gpcr','G 단백질','M2 수용체는 Gi에 연결된다.','M2 수용체는 Gq에 연결된다.','M2 → Gi → adenylyl cyclase 억제.',25),
  f('m3','gpcr','G 단백질','M3 수용체는 Gq에 연결된다.','M3 수용체는 Gi에 연결된다.','M3 → Gq → PLC 활성화.',25),
  f('m4','gpcr','G 단백질','M4 수용체는 Gi에 연결된다.','M4 수용체는 Gq에 연결된다.','M4 → Gi → adenylyl cyclase 억제.',25),
  f('m5','gpcr','G 단백질','M5 수용체는 Gq에 연결된다.','M5 수용체는 Gi에 연결된다.','M5 → Gq → PLC 활성화.',25),
  f('alpha1','gpcr','G 단백질','α1 수용체는 Gq에 연결된다.','α1 수용체는 Gi에 연결된다.','α1 → Gq → PLC 활성화.',25),
  f('alpha2','gpcr','G 단백질','α2 수용체는 Gi에 연결된다.','α2 수용체는 Gq에 연결된다.','α2 → Gi → adenylyl cyclase 억제.',25),
  f('beta','gpcr','G 단백질','β 수용체는 Gs에 연결된다.','β 수용체는 Gi에 연결된다.','β → Gs → adenylyl cyclase 활성화.',25),
  f('gs','gpcr','신호 방향','Gs는 adenylyl cyclase를 활성화해 cAMP를 늘린다.','Gs는 adenylyl cyclase를 억제해 cAMP를 줄인다.','Gs는 stimulatory 단백질이다.',24),
  f('gi','gpcr','신호 방향','Gi는 adenylyl cyclase를 억제해 cAMP를 줄인다.','Gi는 adenylyl cyclase를 활성화해 cAMP를 늘린다.','Gi는 inhibitory 단백질이다.',24),
  f('gq','gpcr','신호 방향','Gq는 PLC를 활성화해 IP₃·DAG 신호를 늘린다.','Gq는 PLC를 억제해 IP₃·DAG 신호를 줄인다.','Gq → PLC → IP₃·DAG와 Ca²⁺ 신호.',24)
];

export function shuffleAns(items,random=Math.random){
  const a=[...items];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
export function makeAnsQuestion(fact,isCorrectTarget,random=Math.random){
  const others=shuffleAns(ANS_FACTS.filter(f=>f.group===fact.group&&f.id!==fact.id),random)
    .sort((a,b)=>Math.abs((isCorrectTarget?a.incorrect:a.correct).length-(isCorrectTarget?fact.correct:fact.incorrect).length)
      -Math.abs((isCorrectTarget?b.incorrect:b.correct).length-(isCorrectTarget?fact.correct:fact.incorrect).length))
    .slice(0,4);
  if(others.length!==4)throw new Error('문항별 선지 5개를 만들 수 없습니다.');
  const answers=shuffleAns([{fact,trueAnswer:true,text:isCorrectTarget?fact.correct:fact.incorrect},
    ...others.map(f=>({fact:f,trueAnswer:false,text:isCorrectTarget?f.incorrect:f.correct}))],random);
  const topic=fact.group==='gpcr'?'G 단백질 연결':fact.group==='circuit'?'신경 회로·수용체':'신경전달 단계와 억제약물';
  return {fact,group:fact.group,isCorrectTarget,stem:`다음 중 ${topic}에 관한 설명으로 ${isCorrectTarget?'옳은':'옳지 않은'} 것은?`,answers,answerIndex:answers.findIndex(a=>a.trueAnswer)};
}
export function pickAnsFact(tab,progress={},random=Math.random){
  let pool=ANS_FACTS.filter(f=>tab==='gpcr'?f.group==='gpcr':f.group!=='gpcr');
  if(tab!=='gpcr'&&progress.lastGroup){
    const alternative=pool.filter(f=>f.group!==progress.lastGroup);
    if(alternative.length)pool=alternative;
  }
  const fresh=pool.filter(f=>!(progress.recent||[]).includes(f.id));
  if(fresh.length)pool=fresh;
  const score=f=>(progress.seen?.[f.id]||0)-0.35*(progress.missed?.[f.id]||0);
  const min=Math.min(...pool.map(score));
  const candidates=pool.filter(f=>score(f)===min);
  return candidates[Math.floor(random()*candidates.length)];
}

export function initAnsQuiz(){
  const $=id=>document.getElementById(id),SYMBOLS=['①','②','③','④','⑤'],KEY='pharmacology-autonomic-lecture9-v1';
  const fresh=()=>({seen:{},missed:{},recent:[],lastGroup:null,lastTarget:null,attempted:0,correct:0});
  let state={main:fresh(),gpcr:fresh()};
  try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved?.main&&saved?.gpcr)state=saved;}catch{}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
  let tab='main',current=null,answered=false,session={main:0,gpcr:0};
  function renderStats(){
    const s=state[tab],total=tab==='gpcr'?ANS_FACTS.filter(f=>f.group==='gpcr').length:ANS_FACTS.filter(f=>f.group!=='gpcr').length;
    $('ansStats').textContent=`정답 ${s.correct} / ${s.attempted} · 복기한 연결 ${Object.keys(s.seen).length}/${total}`;
    $('ansTopic').textContent=tab==='gpcr'?'M1–M5 · α1 · α2 · β · Gs/Gq/Gi':'회로·전달 단계·작용 종결';
    for(const [id,active] of [['ansMainTab',tab==='main'],['ansGpcrTab',tab==='gpcr']]){
      $(id).classList.toggle('active',active);$(id).setAttribute('aria-selected',String(active));
    }
  }
  function next(){
    const s=state[tab],fact=pickAnsFact(tab,s);
    const target=s.lastTarget!==true;
    current=makeAnsQuestion(fact,target);
    s.lastTarget=target;s.lastGroup=fact.group;
    s.recent=[fact.id,...(s.recent||[]).filter(id=>id!==fact.id)].slice(0,3);save();
    answered=false;session[tab]++;
    $('ansProgress').textContent=`${tab==='gpcr'?'G 단백질 분류':'신경 회로·전달'} · ${session[tab]}문제`;
    $('ansStem').textContent=current.stem;
    $('ansFeedback').hidden=true;$('ansNext').hidden=true;
    const host=$('ansChoices');host.replaceChildren();
    current.answers.forEach((entry,i)=>{
      const button=document.createElement('button');button.type='button';
      const no=document.createElement('span');no.className='option-no';no.textContent=SYMBOLS[i];
      const label=document.createElement('span');label.textContent=entry.text;
      button.append(no,label);button.addEventListener('click',()=>answer(i));host.append(button);
    });
    renderStats();
  }
  function answer(i){
    if(!current||answered)return;
    answered=true;
    const good=i===current.answerIndex,s=state[tab],f=current.fact;
    s.attempted++;s.correct+=Number(good);
    s.seen[f.id]=(s.seen[f.id]||0)+1;
    if(!good)s.missed[f.id]=(s.missed[f.id]||0)+1;
    save();renderStats();
    [...$('ansChoices').children].forEach((b,j)=>{
      b.disabled=true;
      if(j===current.answerIndex)b.classList.add('correct');
      else if(j===i)b.classList.add('wrong');
    });
    const fb=$('ansFeedback');fb.className=`feedback ${good?'ok':'bad'}`;fb.replaceChildren();
    const strong=document.createElement('strong');strong.textContent=good?'정답입니다.':'정답과 바뀐 부분을 확인하세요.';
    const answer=document.createElement('p');answer.textContent=`정답 ${SYMBOLS[current.answerIndex]} · ${current.answers[current.answerIndex].text}`;
    const list=document.createElement('ol');list.className='ans-explanations';
    current.answers.forEach((item,j)=>{
      const li=document.createElement('li');
      li.textContent=`${SYMBOLS[j]} ${item.text===item.fact.correct?'옳음':'틀림'} · ${item.fact.note} ${item.text!==item.fact.correct?'바른 설명: '+item.fact.correct:''} (강의록 ${item.fact.page}쪽)`;
      list.append(li);
    });
    fb.append(strong,answer,list);fb.hidden=false;$('ansNext').hidden=false;
  }
  for(const [id,choice] of [['ansMainTab','main'],['ansGpcrTab','gpcr']])$(id).addEventListener('click',()=>{
    if(tab===choice)return;tab=choice;current=null;next();
  });
  $('ansNext').addEventListener('click',next);
  document.addEventListener('keydown',event=>{
    if($('ansView').hidden||event.altKey||event.ctrlKey||event.metaKey||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;
    if(/^[1-5]$/.test(event.key)){event.preventDefault();answer(Number(event.key)-1);}
    if(event.key==='Enter'&&answered){event.preventDefault();next();}
  });
  return {open(){if(!current)next();}};
}
