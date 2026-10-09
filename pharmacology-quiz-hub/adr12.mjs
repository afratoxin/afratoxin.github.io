// 2026 12강 아드레날린성 약리학 (1), 슬라이드 7–26쪽.
// Case options deliberately mix receptor classes without adding a second defensible answer.
const q=(id,group,stem,answer,distractors,note,page)=>({id,group,stem,answer,options:[answer,...distractors],note,page});
export const ADR12_QUESTIONS=[
  q('a1-eye','clinical','안과 검사에서 동공확대근의 α1 수용체를 직접 자극해 산동시키려 한다. 약물은?','Phenylephrine',['Clonidine','Dobutamine','Albuterol','Mirabegron'],'Phenylephrine은 α1 효현제로 동공확대근을 수축시킨다. Clonidine은 α2, dobutamine은 β1, albuterol은 β2, mirabegron은 β3 효현제다.',22),
  q('a1-hypotension','clinical','저혈압에서 혈관 평활근의 α1 수용체를 자극해 말초 저항을 높이는 약물은?','Midodrine',['Clonidine','Dobutamine','Salmeterol','Mirabegron'],'Midodrine은 α1 효현제다. Clonidine은 중추 α2 효현으로 교감신경 출력을 낮춘다.',22),
  q('a2-central','clinical','중추의 α2 수용체를 활성화해 교감신경 출력을 줄이는 고혈압 치료제는?','Clonidine',['Phenylephrine','Dobutamine','Albuterol','Mirabegron'],'Clonidine은 α2 효현제다. 시냅스전 α2 활성은 NE 유리를 억제한다.',22),
  q('b1-shock','clinical','심장성 쇼크에서 β1 수용체 자극으로 심근 수축력을 높일 약물은?','Dobutamine',['Phenylephrine','Clonidine','Albuterol','Mirabegron'],'Dobutamine은 β1 작용이 두드러진다. Phenylephrine은 주로 α1, albuterol은 β2, mirabegron은 β3를 자극한다.',23),
  q('b2-short','clinical','급성 기관지경련에서 비교적 짧게 작용하는 β2 효현제를 고르면?','Albuterol',['Salmeterol','Clonidine','Dobutamine','Mirabegron'],'Albuterol은 강의록에서 3–4시간 작용하는 β2 효현제로 제시된다. Salmeterol은 장시간 작용하므로 급성 완화용으로 구분하지 않는다.',23),
  q('b2-long','clinical','오랫동안 기도 확장을 유지하려는 COPD 환자에게 제시된 장시간 작용 β2 효현제는?','Salmeterol',['Albuterol','Dobutamine','Clonidine','Phenylephrine'],'Salmeterol은 강의록상 약 12시간 이상 작용한다. Albuterol은 상대적으로 짧은 작용성 약물이다.',23),
  q('b2-daily','clinical','강의록의 β2 효현제 비교에서 약 24시간 지속되는 약물은?','Indacaterol',['Albuterol','Salmeterol','Ritodrine','Isoproterenol'],'강의록에서 indacaterol은 약 24시간, salmeterol은 12시간 이상, albuterol은 3–4시간으로 대비한다.',23),
  q('b2-uterus','clinical','자궁 평활근의 β2 수용체를 자극해 이완시키는 약물로 강의록에 나온 것은?','Ritodrine',['Clonidine','Dobutamine','Mirabegron','Phenylephrine'],'Ritodrine은 β2 효현제로 자궁 이완에 연결된다. 현재 사용 빈도와 출제용 약리 기전은 구별한다.',23),
  q('b3-oab','clinical','요절박이 있는 과민성 방광에서 β3 수용체를 자극해 배뇨근을 이완시킬 약물은?','Mirabegron',['Oxybutynin','Bethanechol','Albuterol','Prazosin'],'Mirabegron은 β3 효현제다. Oxybutynin도 배뇨근 이완에 쓰이지만 항무스카린제이므로 β3 조건에 맞지 않는다.',23),
  q('b12-only','receptor','α 수용체를 자극하지 않고 β1·β2에 작용하는 직접 효현제는?','Isoproterenol',['Epinephrine','Norepinephrine','Phenylephrine','Clonidine'],'Isoproterenol은 비선택적 β 효현제다. Epinephrine은 α와 β에 함께 작용하고 norepinephrine은 β2 작용이 미미하다.',19),
  q('ne-no-b2','receptor','α1·α2·β1에 작용하지만 β2 작용은 미미한 내인성 카테콜아민은?','Norepinephrine',['Epinephrine','Isoproterenol','Dobutamine','Phenylephrine'],'Norepinephrine은 epinephrine과 달리 β2 작용이 거의 없다는 강의 핵심 구분이다.',15),
  q('e-all','receptor','α1·α2·β1·β2에 모두 작용하는 내인성 카테콜아민은?','Epinephrine',['Norepinephrine','Isoproterenol','Dobutamine','Phenylephrine'],'Epinephrine은 α·β 모두에 작용한다. Norepinephrine은 β2 작용이 미미하고 isoproterenol은 β 작용에 치우친다.',15),
  q('net-block','mechanism','NET를 막아 시냅스 틈의 NE 재흡수를 억제하는 약물은?','Cocaine',['Reserpine','Metyrosine','Guanethidine','Vesamicol'],'Cocaine은 NE 재흡수 억제제다. Reserpine은 VMAT, metyrosine은 tyrosine hydroxylase, guanethidine은 NE 유리에 작용한다.',20),
  q('release','mechanism','NE 유리를 촉진하는 간접작용 교감신경 효현제로 강의록에 제시된 것은?','Amphetamine',['Cocaine','Reserpine','Clonidine','Metyrosine'],'Amphetamine은 신경말단에서 NE 유리 증가와 연결된다. Cocaine은 재흡수 억제, clonidine은 α2 효현에 의한 유리 억제다.',25),
  q('mixed','mechanism','수용체 직접 작용과 NE 유리 촉진을 함께 갖는 교감신경 효현제는?','Ephedrine',['Amphetamine','Cocaine','Clonidine','Reserpine'],'Ephedrine은 혼합형 작용으로 분류된다. Amphetamine은 간접 유리 촉진이 중심이고 clonidine은 직접 α2 효현제다.',25),
  q('tyr-block','mechanism','Tyrosine을 L-DOPA로 바꾸는 효소를 억제해 카테콜아민 합성을 낮추는 약물은?','Metyrosine',['Reserpine','Cocaine','Ephedrine','Albuterol'],'Metyrosine은 tyrosine hydroxylase 억제제다. Reserpine은 VMAT 억제제다.',8),
  q('vmat-block','mechanism','카테콜아민의 소포 내 저장을 담당하는 VMAT를 억제하는 약물은?','Reserpine',['Metyrosine','Cocaine','Clonidine','Albuterol'],'Reserpine은 VMAT를 막아 소포 저장을 감소시킨다. Metyrosine은 합성, cocaine은 재흡수에 작용한다.',7),
  q('a2-ne','mechanism','시냅스전 α2 자가수용체가 활성화되면 NE 추가 유리에 나타나는 변화는?','NE 유리가 감소한다',['NE 유리가 증가한다','NE 합성이 증가한다','NE 합성이 중단된다','NE 재흡수가 차단된다'],'α2 자가수용체는 음성 되먹임으로 NE 유리를 억제한다. NET 억제에 따른 재흡수 차단과 구별한다.',20),
  q('a1-vessel','effects','혈관 평활근의 α1 수용체 자극 효과는?','말초혈관이 수축한다',['말초혈관이 이완한다','심장박동이 느려진다','기관지가 확장된다','배뇨근이 이완한다'],'α1–Gq 신호는 혈관 평활근 수축을 촉진한다. 기관지 이완은 β2, 배뇨근 이완은 β3와 연결된다.',12),
  q('b2-vessel','effects','혈관 평활근의 β2 수용체 자극 효과는?','말초혈관이 이완한다',['말초혈관이 수축한다','심장박동이 느려진다','기관지가 수축한다','배뇨근이 수축한다'],'β2–Gs 신호는 혈관 평활근 이완에 연결된다. α1 자극에 의한 수축과 반대다.',12),
  q('b1-heart','effects','심장의 β1 수용체가 활성화되면 나타나는 변화는?','심박수와 수축력이 증가한다',['심박수와 수축력이 감소한다','심박수만 선택적으로 감소한다','수축력만 선택적으로 감소한다','심박수와 수축력이 유지된다'],'심장 β1 자극은 심박수와 수축력을 함께 높이며, β1 차단제는 이를 낮춘다.',13),
  q('beta-gs','receptor','아드레날린 수용체 중 Gs와 결합하는 계열은?','β1·β2·β3',['α1·α2·β1','α1·α2·β2','α1·β1·β3','α2·β2·β3'],'β 수용체는 Gs, α1은 Gq, α2는 Gi에 연결된다.',6),
  q('a1-gq','receptor','아드레날린 수용체 가운데 Gq 경로에 연결되는 것은?','α1 수용체',['α2 수용체','β1 수용체','β2 수용체','β3 수용체'],'α1은 Gq, α2는 Gi, β1·β2·β3는 Gs이다.',6),
  q('a2-gi','receptor','아드레날린 수용체 가운데 Gi 경로에 연결되는 것은?','α2 수용체',['α1 수용체','β1 수용체','β2 수용체','β3 수용체'],'α2는 Gi를 통해 adenylyl cyclase 활성을 낮춘다.',6),
  q('mao-block','mechanism','강의록의 간접작용 약물 표에서 MAO-B 억제제로 제시된 것은?','Selegiline',['Entacapone','Methylphenidate','Amphetamine','Cocaine'],'Selegiline은 MAO-B 억제제이며 entacapone은 COMT 억제제다. Methylphenidate·amphetamine·cocaine은 각각 유리·재흡수 단계에 작용한다.',25),
  q('comt-block','mechanism','강의록의 간접작용 약물 표에서 COMT 억제제로 제시된 것은?','Entacapone',['Selegiline','Methylphenidate','Amphetamine','Cocaine'],'Entacapone은 COMT 억제제이며 selegiline은 MAO-B 억제제다.',25)
];

// Each name occurs exactly once: representative pharmacological role in this lecture.
export const ADR12_MATCH=[
  ['phenylephrine','α1 직접 효현'],['midodrine','α1 직접 효현'],['methoxamine','α1 직접 효현'],
  ['clonidine','α2 직접 효현'],
  ['dobutamine','β1 직접 효현'],
  ['albuterol','β2 단시간 효현'],['salmeterol','β2 장시간 효현'],['indacaterol','β2 장시간 효현'],['ritodrine','β2 자궁 이완'],
  ['mirabegron','β3 직접 효현'],['isoproterenol','β1·β2 직접 효현'],
  ['epinephrine','α·β 직접 효현 · β2 포함'],['norepinephrine','α·β 직접 효현 · β2 미미'],
  ['ephedrine','직접·간접 혼합 작용'],
  ['amphetamine','NE 유리 촉진'],['methamphetamine','NE 유리 촉진'],['methylphenidate','NE 유리·재흡수에 작용'],
  ['cocaine','NET 재흡수 억제'],['imipramine','NET 재흡수 억제'],['metyrosine','카테콜아민 합성 억제'],
  ['selegiline','MAO-B 억제'],['entacapone','COMT 억제'],['tolcapone','COMT 억제'],
  ['reserpine','VMAT 소포 저장 억제'],['guanethidine','NE 소포 유리 억제']
].map(([drug,category])=>({drug,category}));
