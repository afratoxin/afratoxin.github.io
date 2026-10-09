// 2026 13강 아드레날린성 약리학 (2), 슬라이드 11–23쪽.
const q=(id,group,stem,answer,distractors,note,page)=>({id,group,stem,answer,options:[answer,...distractors],note,page});
export const ADR13_QUESTIONS=[
  q('pheo-long','clinical','갈색세포종에서 카테콜아민에 의한 혈압 상승을 억제할 비가역적 α 차단제는?','Phenoxybenzamine',['Phentolamine','Prazosin','Propranolol','Clonidine'],'Phenoxybenzamine은 비가역적 α 차단제다. Phentolamine은 가역적 α 차단제이며 prazosin은 선택적 α1 차단제다.',13),
  q('pheo-short','mechanism','α1·α2 수용체에 가역적으로 작용하는 차단제는?','Phentolamine',['Phenoxybenzamine','Prazosin','Yohimbine','Propranolol'],'Phentolamine은 가역적 비선택성 α 차단제다. Phenoxybenzamine은 비가역적이고 prazosin은 α1 선택적이다.',13),
  q('bph-alpha1','clinical','양성 전립선비대증에서 전립선 평활근의 α1 수용체를 차단할 약물은?','Prazosin',['Clonidine','Phenylephrine','Propranolol','Dobutamine'],'Prazosin은 α1 차단제다. Phenylephrine은 α1 효현제이며 clonidine은 α2 효현제다.',13),
  q('bph-alpha1a','clinical','전립선의 α1A 수용체에 대한 선택성이 강조된 약물은?','Tamsulosin',['Phentolamine','Yohimbine','Propranolol','Clonidine'],'Tamsulosin은 α1A 선택성이 강하다. Phentolamine은 α1·α2에 작용하고 yohimbine은 α2 차단제다.',18),
  q('a2-block','mechanism','시냅스전 α2 자가수용체를 차단해 NE 유리를 늘릴 수 있는 약물은?','Yohimbine',['Clonidine','Prazosin','Timolol','Metoprolol'],'Yohimbine은 α2 길항제다. Clonidine은 α2 효현제로 NE 유리를 줄인다.',13),
  q('epi-reversal','effects','α 차단제 투여 뒤 epinephrine에 의한 혈압 반응이 역전되는 주요 수용체는?','β2 수용체',['α1 수용체','α2 수용체','β1 수용체','β3 수용체'],'α 혈관수축이 차단되면 epinephrine의 β2 혈관 이완이 드러나 혈압이 낮아진다.',15),
  q('alpha-first-dose','effects','α1 차단제를 처음 투여한 뒤 어지러움·실신을 설명하는 약리 효과는?','기립성 저혈압',['기관지 평활근 수축','심장 β1 직접 자극','방광 배뇨근 수축','눈물샘 분비 증가'],'α1 차단으로 혈관이 이완하면 기립 시 혈압이 떨어질 수 있다.',18),
  q('reflex','effects','비선택적 α 차단과 비교한 선택적 α1 차단의 특징으로 옳은 것은?','반사성 빈맥이 덜하다',['반사성 빈맥이 더하다','β2 차단 효과가 강하다','기관지 수축이 더하다','저혈당 회복이 느리다'],'선택적 α1 차단은 α2 자가수용체를 보존하여 NE 유리 증가와 반사성 빈맥이 상대적으로 적다.',18),
  q('beta-nonselect','mechanism','β1과 β2 수용체를 모두 차단하는 약물은?','Propranolol',['Metoprolol','Atenolol','Bisoprolol','Esmolol'],'Propranolol은 비선택성 β 차단제다. 나머지는 강의록의 β1 선택성 목록이다.',20),
  q('beta1-htn','clinical','고혈압 환자에게 β1 선택성 차단제를 고른다면?','Bisoprolol',['Propranolol','Nadolol','Timolol','Sotalol'],'Bisoprolol은 β1 선택적이다. Propranolol·nadolol·timolol·sotalol은 강의록에서 비선택성으로 묶는다.',20),
  q('beta1-short','mechanism','β1 선택적 차단제 중 작용 시간이 짧은 약물은?','Esmolol',['Propranolol','Nadolol','Timolol','Carvedilol'],'Esmolol은 β1 선택성 단시간 작용 약물이다. 다른 보기의 약물은 β1만 선택적으로 차단하지 않는다.',20),
  q('mixed-carvedilol','mechanism','비선택적 β 차단과 α1 차단을 함께 가지며 항산화 효과가 제시된 약물은?','Carvedilol',['Labetalol','Propranolol','Atenolol','Timolol'],'Carvedilol에는 β·α1 차단과 항산화 작용이 함께 표기된다. Labetalol도 α·β 차단제지만 이 표의 항산화 조건은 다르다.',20),
  q('mixed-labetalol','mechanism','α1 차단과 비선택적 β 차단 작용을 함께 가진 약물은?','Labetalol',['Metoprolol','Propranolol','Prazosin','Timolol'],'Labetalol은 α1과 β 차단 작용을 가진다. Carvedilol도 같은 기본 작용이 있으므로 이 보기에서는 제외했다.',20),
  q('glaucoma-beta','clinical','섬모체의 방수 생성을 감소시켜 녹내장에 쓰이는 β 차단제는?','Timolol',['Propranolol','Metoprolol','Prazosin','Tamsulosin'],'Timolol 점안은 방수 생성을 줄인다. Carbachol 등 콜린성 약물의 방수 배출 촉진과 기전을 구별한다.',20),
  q('asthma-risk','clinical','천식 환자에서 β2 차단에 따른 기관지 수축에 특히 주의할 약물은?','Propranolol',['Metoprolol','Atenolol','Bisoprolol','Esmolol'],'Propranolol은 β1·β2를 차단한다. 비교한 나머지 약물은 β1 선택성이다.',20),
  q('diabetes-risk','clinical','저혈당 환자에서 β2 작용까지 차단해 회복 지연·경고 징후 은폐에 주의할 약물은?','Nadolol',['Atenolol','Bisoprolol','Metoprolol','Esmolol'],'Nadolol은 비선택성 β 차단제다. β1 선택적 약물도 주의가 필요하나 강의록의 비교에서는 β2 차단 여부가 핵심이다.',20),
  q('beta1-effect','effects','심장 β1 수용체를 차단했을 때 나타나는 변화는?','심박수와 수축력 감소',['심박수와 수축력 증가','기관지와 혈관 수축','신장 레닌 유리 증가','방광 배뇨근 수축'],'β1 차단은 심박수·수축력과 신장의 레닌 유리를 감소시킨다.',20),
  q('beta2-effect','effects','비선택적 β 차단제 투여 시 β2 차단과 관련된 기도 반응은?','기관지 수축 위험 증가',['기관지 확장 효과 증가','기관지 분비 지속 증가','폐포 표면장력 감소','호흡근 수축력 증가'],'기관지 평활근 β2 자극은 이완을 유도하므로 β2 차단은 기관지 수축 위험을 높인다.',20),
  q('bph-side','effects','Tamsulosin과 연관되어 강의록 표에 표시된 이상반응은?','사정 장애가 생길 수 있다',['고칼륨혈증이 생길 수 있다','기관지 경련이 생길 수 있다','침 분비가 늘어날 수 있다','혈당이 급격히 떨어진다'],'Tamsulosin 항목에는 역행성 사정 등 사정 장애가 제시된다.',18),
  q('alpha-ne','mechanism','α2 길항제를 투여하면 자가수용체 차단으로 NE 유리가 어떻게 변하는가?','NE 유리가 증가한다',['NE 유리가 감소한다','NE 합성이 정지한다','NE 재흡수가 중단된다','NE 분해가 촉진된다'],'α2 자가수용체가 주던 유리 억제가 사라지므로 NE 유리가 증가할 수 있다.',13),
  q('pheo-tyrosine','clinical','갈색세포종에서 카테콜아민의 합성 자체를 줄이는 약물은?','Metyrosine',['Phenoxybenzamine','Phentolamine','Prazosin','Propranolol'],'Metyrosine은 tyrosine hydroxylase를 억제한다. 나머지 약물은 수용체 차단제다.',16),
  q('beta-nonselect-list','mechanism','다음 중 강의록 표에서 비선택성 β 차단제로 분류되는 약물은?','Timolol',['Metoprolol','Atenolol','Bisoprolol','Esmolol'],'Timolol은 β1·β2 비선택성으로 분류된다. 나머지 네 약물은 β1 선택성이다.',20),
  q('alpha1-list','mechanism','다음 중 강의록에서 선택적 α1 차단제로 묶인 약물은?','Doxazosin',['Phenoxybenzamine','Phentolamine','Yohimbine','Propranolol'],'Doxazosin은 선택적 α1 차단제다. Phenoxybenzamine·phentolamine은 비선택성 α 차단, yohimbine은 α2 차단이다.',18),
  q('eye-mechanism','clinical','녹내장에 쓰이는 timolol 점안액의 안압 감소 기전은?','방수 생성량을 감소시킨다',['방수 생성량을 증가시킨다','동공확대근을 강하게 수축한다','AChE 활성을 지속적으로 차단한다','β3 수용체를 선택적으로 자극한다'],'Timolol의 β 차단은 방수 생성을 낮춘다. 직접 콜린 효현제의 방수 배출 촉진과 구별한다.',21)
];

export const ADR13_MATCH=[
  ['phenoxybenzamine','비가역성 α 차단'],['phentolamine','가역성 α 차단'],
  ['prazosin','선택적 α1 차단'],['terazosin','선택적 α1 차단'],['doxazosin','선택적 α1 차단'],['alfuzosin','선택적 α1 차단'],
  ['tamsulosin','전립선 α1A 차단'],['silodosin','전립선 α1A 차단'],['yohimbine','선택적 α2 차단'],
  ['propranolol','비선택성 β 차단'],['nadolol','비선택성 β 차단'],['sotalol','비선택성 β 차단'],['pindolol','비선택성 β 차단'],['timolol','비선택성 β 차단'],
  ['metoprolol','선택적 β1 차단'],['atenolol','선택적 β1 차단'],['bisoprolol','선택적 β1 차단'],['esmolol','선택적 β1 차단'],['acebutolol','선택적 β1 차단'],
  ['labetalol','α1·비선택성 β 차단'],['carvedilol','α1·비선택성 β 차단'],
  ['metyrosine','카테콜아민 합성 억제'],['reserpine','VMAT 소포 저장 억제'],['guanethidine','NE 소포 유리 억제']
].map(([drug,category])=>({drug,category}));
