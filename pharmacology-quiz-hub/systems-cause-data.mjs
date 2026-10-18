// Only outcomes are shown before grading. Names/aliases are kept in options and
// explanations; source headings and topic labels must not reveal the answer.
const profiles={
 'Sulfonylurea계':'췌장 분비세포에서 KATP 통로를 닫아 분비를 촉진하며 저혈당·체중 증가를 일으킬 수 있다.',
 Insulin:'분비세포가 없어도 직접 보충 효과가 있으며 섭취·운동량에 비해 작용이 과하면 저혈당을 일으킨다.',
 Metformin:'간 포도당신생을 줄이며 단독 저혈당 위험은 낮다. 신기능 저하에 따른 축적과 젖산산증을 구별한다.',
 'Thiazolidinedione계':'감수성을 개선하는 유전자 발현 조절 약물이다. 체액 저류·부종·체중 증가와 심부전 악화에 주의한다.',
 'α-Glucosidase 억제제':'장내 탄수화물 소화를 늦춘다. 흡수되지 않은 탄수화물의 발효로 가스·복부 불쾌감이 생길 수 있다.',
 'GLP-1 수용체 작용제':'혈당 의존적 분비 촉진·위 배출 지연·포만감 증가와 연결하며 오심과 체중 감소가 나타날 수 있다.',
 'DPP-4 억제제':'내인성 인크레틴 분해를 늦추는 경구 약물이며 대체로 체중 중립적이다.',
 'SGLT2 억제제':'신장 포도당 재흡수를 줄여 요당·삼투성 이뇨를 늘린다. 체액량 감소와 생식기 감염 위험을 연결한다.',
 Acetazolamide:'중탄산 재흡수 감소로 소변은 알칼리화되고 혈중 HCO₃⁻는 감소한다. 암모니아 포획 감소와 인산칼슘 결석도 연결한다.',
 Furosemide:'TAL의 NKCC2 억제로 강한 이뇨를 일으키며 K⁺·Ca²⁺·Mg²⁺ 손실과 수질 농도 기울기 감소를 연결한다.',
 Thiazide:'초기 DCT에서 NaCl 재흡수를 줄이며 Ca²⁺의 소변 배설은 감소시킨다. Loop 이뇨제와 칼슘 방향이 다르다.',
 Spironolactone:'알도스테론 수용체 길항에 따른 발현 조절로 Na⁺ 재흡수·K⁺ 배설을 줄인다. 성호르몬 수용체 비표적 작용도 있다.',
 Amiloride:'관강측 ENaC를 직접 차단하여 Na⁺ 재흡수와 K⁺·H⁺ 분비를 줄인다. MR 길항과 작용 단계가 다르다.',
 Mannitol:'여과되는 삼투성 용질로 관강에서 물 재흡수를 줄인다. 초기 혈관 내 용적 증가가 폐울혈에 불리할 수 있다.',
 Digoxin:'심근 Na⁺/K⁺ 펌프 억제로 세포 내 Na⁺ 증가·Ca²⁺ 제거 감소·수축력 증가를 만든다. 저K⁺·Ca²⁺ 과부하와 독성이 연결된다.',
 Propranolol:'β 자극을 줄여 심박수·자동능과 신장 renin 분비를 낮출 수 있다. 직접적인 강심배당체 작용과 다르다.',
 Esmolol:'β 차단제로 교감신경 자극에 의한 심박수·자동능 증가를 억제한다. 재분극 연장을 주작용으로 하는 약과 구별한다.',
 Verapamil:'결절 Ca²⁺ 전류와 상승기·전도를 억제한다. 빠른 심실 Na⁺ 상승기를 주로 억제하는 약물과 구별한다.',
 Adenosine:'결절세포 과분극과 자발 탈분극 억제를 연결한다. 직접 심실 수축력을 높이는 약물이 아니다.',
 Procainamide:'Class IA로 중간 정도의 회복 속도와 전도 억제·APD 연장을 함께 연결한다.',
 Lidocaine:'Class IB로 빠른 회복 속도와 비교적 약한 phase 0 억제·APD 단축을 연결한다.',
 Flecainide:'Class IC로 느린 회복 속도·강한 빠른 상승기 억제와 작은 APD 변화를 연결한다.',
 Sotalol:'Class III로 재분극·APD 연장과 연결한다. 전해질 이상이 동반되면 QT 연장·후탈분극 위험을 함께 해석한다.',
 'ACE 억제제':'Angiotensin I에서 II로의 전환을 줄인다. AT1 차단과는 생성되는 호르몬 농도 양상이 다르다.',
 'AT1 수용체 차단제':'Angiotensin II의 수용체 작용을 차단한다. II 생성효소를 직접 억제하는 약물이 아니다.',
 'β차단제':'심장 자극과 신장 renin 분비를 낮추는 방향으로 작용한다.',
 '강심배당체':'심근 이온 변화로 수축력을 높이는 계열이며 angiotensin I→II 전환 억제가 주작용은 아니다.',
 'Loop 이뇨제':'NaCl·체액 배설을 늘리며 renin–angiotensin계의 생성효소를 직접 차단하는 약물이 아니다.'
};
const aliases={
 'Sulfonylurea계':['sulfonylurea','설폰요소','설포닐우레아'],Insulin:['insulin','인슐린'],Metformin:['metformin','메트포르민'],
 'Thiazolidinedione계':['thiazolidinedione','TZD','티아졸리딘','pioglitazone','rosiglitazone'],
 'α-Glucosidase 억제제':['α-glucosidase 억제','alpha-glucosidase 억제','acarbose'],
 'GLP-1 수용체 작용제':['GLP-1 수용체 작용','GLP-1 receptor agonist','semaglutide'],
 'DPP-4 억제제':['DPP-4','DPP4','sitagliptin'],'SGLT2 억제제':['SGLT2','SGLT-2','dapagliflozin','empagliflozin'],
 Acetazolamide:['acetazolamide','아세타졸아미드','Diamox'],Furosemide:['furosemide','푸로세미드','Lasix'],Thiazide:['thiazide','티아지드'],
 Spironolactone:['spironolactone','스피로노락톤','Aldactone'],Amiloride:['amiloride','아밀로라이드'],Mannitol:['mannitol','만니톨'],
 Digoxin:['digoxin','디곡신','digitalis','디기탈리스','강심배당체'],Propranolol:['propranolol','프로프라놀롤','β차단','베타차단'],
 Esmolol:['esmolol','에스몰롤','β차단','베타차단'],Verapamil:['verapamil','베라파밀'],Adenosine:['adenosine','아데노신'],
 Procainamide:['procainamide','프로카인아미드'],Lidocaine:['lidocaine','리도카인'],Flecainide:['flecainide','플레카이니드'],Sotalol:['sotalol','소탈롤'],
 'ACE 억제제':['ACE 억제제','ACE inhibitor','captopril','enalapril']
};
function cause(scope,id,subject,context,options,answer,note,source,exam){
 if(options.length!==5||new Set(options).size!==5||!options.includes(answer))throw Error('Invalid cause choices: '+id);
 const group={endocrine:'혈당·대사 변화',renal:'소변·전해질 변화',cardio:'박동·전도 변화'}[scope];
 const answerAliases=[...new Set([answer,...(aliases[answer]||[])])];
 const visible=[context,group,source,exam].join(' ').toLowerCase();
 if(answerAliases.some(a=>visible.includes(a.toLowerCase())))throw Error('Answer leak: '+id);
 return {id:scope+'-cause:'+id,subject,group,format:'cause',context,stem:context+'\n\n보기 중 이 변화를 일으킨 약물 또는 계열로 가장 적절한 것은?',options,answer,note,source,exam,answerAliases,
  details:options.map(name=>{if(!profiles[name])throw Error('Missing explanation: '+name);return name+': '+(name===answer?'이 문항의 관찰과 일치한다. '+note:profiles[name]);})};
}
const e=(id,subject,context,options,answer,note,pages,exam)=>cause('endocrine',id,subject,context,options,answer,note,'16강 내분비 약리 기초 · 강의록 PDF '+pages+'쪽','족보 16강 · '+exam);
export const ENDOCRINE_CAUSES=[
 e('fasting-hypoglycemia','sulfonylurea','제2형 당뇨병 환자가 새 경구약을 복용한 뒤 식사를 거르면 발한·떨림과 저혈당을 보였다. 체중도 증가하였다. 보기의 다른 약물과 달리 혈당이 낮아도 췌장 분비를 자극할 수 있는 약의 작용이 의심된다.',
  ['Sulfonylurea계','Metformin','Thiazolidinedione계','DPP-4 억제제','α-Glucosidase 억제제'],'Sulfonylurea계','분비세포의 KATP 폐쇄로 분비를 자극한다. 섭취가 줄어도 분비 자극이 남을 수 있어 저혈당·체중 증가와 연결된다. 보기에는 같은 표적의 meglitinide를 함께 넣지 않았다.','20–21','2020·2023 분비 촉진제의 저혈당 비교형'),
 e('insulin-deficient','insulin','분비세포가 거의 소실된 제1형 당뇨병 환자에게도 효과가 있는 주사제를 사용 중이다. 평소 용량을 투여하고 식사를 줄인 채 오래 운동한 뒤 식은땀과 혼돈이 생겼다. 말초 포도당 이용 증가와 간 포도당 공급 억제가 함께 기여하였다.',
  ['Insulin','GLP-1 수용체 작용제','Sulfonylurea계','Metformin','DPP-4 억제제'],'Insulin','외인성 보충 약물은 분비세포가 없어도 작용한다. 공급보다 이용·저장 효과가 커지면 신경저당 증상이 발생한다. 단순한 주사 경로만이 아니라 분비세포 소실과 저혈당을 함께 판단한다.','17–19','제1형의 보충 요법과 저혈당 발생 원인'),
 e('renal-lactate','metformin','경구 혈당강하제를 단독 복용하던 환자의 신기능이 크게 악화된 뒤 젖산 증가와 대사성 산증이 확인되었다. 저혈당은 없었고 약물 축적 가능성이 제기되었다. 쇼크 등 다른 주요 젖산 증가 원인은 확인되지 않았다.',
  ['Metformin','Sulfonylurea계','Thiazolidinedione계','α-Glucosidase 억제제','DPP-4 억제제'],'Metformin','신기능 저하에 의한 축적과 드물지만 중요한 젖산산증을 연결한다. 직접 신독성이 반드시 먼저 생겨야 하는 약이라는 뜻은 아니다.','22–23','2022·2023 신기능과 젖산산증 연결형'),
 e('hepatic-production','metformin','약리작용을 비교하는 가상 실험이다. 혈중 인슐린 농도를 같은 수준으로 유지해도 약물 처리군에서는 공복 간 포도당 생산이 줄었다. 분비 촉진 없이 간에서 혈액으로 공급되는 포도당을 줄이는 작용이 주효과였다.',
  ['Metformin','Sulfonylurea계','Insulin','SGLT2 억제제','α-Glucosidase 억제제'],'Metformin','호르몬 농도를 고정한 조건에서 간의 포도당신생 감소를 해석한다. 소변 배설 증가나 장내 흡수 지연과 간의 직접 작용은 구별한다.','22–23','2025·2021 간 포도당 생성 감소형'),
 e('fluid-weight','tzd','새 당뇨병 약물을 시작한 뒤 혈당은 좋아졌지만 체중이 늘고 발목 부종·숨참이 악화되었다. 저혈당보다는 체액 저류가 문제였으며, 기존 심부전이 악화되었는지 평가하게 되었다.',
  ['Thiazolidinedione계','Metformin','SGLT2 억제제','DPP-4 억제제','α-Glucosidase 억제제'],'Thiazolidinedione계','감수성 개선 효과와 체액 저류는 동시에 나타날 수 있다. 체중 증가의 원인을 지방 저장만으로 단정하지 않고 부종·심부전 악화를 함께 연결한다.','30–31','2022 체중 증가·부종의 원인 계열'),
 e('slow-sensitizing','tzd','약물을 처리한 뒤 즉시 분비가 증가하지는 않았다. 며칠에 걸쳐 표적 조직의 유전자 발현과 호르몬 반응성이 달라졌고, 같은 농도의 인슐린으로도 근육·지방의 포도당 이용이 증가하였다.',
  ['Thiazolidinedione계','Sulfonylurea계','SGLT2 억제제','α-Glucosidase 억제제','DPP-4 억제제'],'Thiazolidinedione계','전사 조절을 통한 감수성 개선은 즉각적인 분비 촉진과 다르다. 이 보기에서는 직접 분비·장·신장 작용을 하는 계열과 비교하여 핵 수용체 작용을 추론한다.','30–31','감수성·작용 발현 속도 비교형'),
 e('intestinal-gas','alpha-glucosidase','식후 혈당을 조절하는 경구약을 시작한 뒤 가스·복통·복부 불쾌감이 두드러졌다. 흡수되지 않고 대장에 도달한 탄수화물이 세균에 의해 발효된 결과로 설명되었다.',
  ['α-Glucosidase 억제제','Sulfonylurea계','Thiazolidinedione계','SGLT2 억제제','DPP-4 억제제'],'α-Glucosidase 억제제','탄수화물 소화 지연으로 식후 포도당 유입은 줄지만 장내 발효는 증가할 수 있다. 모든 약물의 비특이적 위장장애가 같은 기전인 것은 아니다.','30–31','2025·2021 장질환과 약물의 장내 효과'),
 e('starch-challenge','alpha-glucosidase','약리 원리를 비교한 가상 관찰이다. 약물 복용 후 전분 식사의 혈당 상승은 늦어졌지만, 이미 단당류로 준비한 포도당을 섭취했을 때는 같은 소화 지연 효과가 나타나지 않았다. 요당 증가나 분비 촉진은 주된 설명이 아니었다.',
  ['α-Glucosidase 억제제','SGLT2 억제제','Sulfonylurea계','Thiazolidinedione계','DPP-4 억제제'],'α-Glucosidase 억제제','복합 탄수화물을 단당류로 자르는 과정의 억제를 역으로 추론한다. 이미 단당류이면 그 절단 단계가 필요하지 않다.','30–31','탄수화물 소화·흡수 단계의 역추론'),
 e('satiety-nausea','glp1','당뇨병과 비만이 있는 환자에게 약물을 투여한 뒤 소량의 식사에도 포만감이 커지고 체중이 감소하였다. 초기 오심과 위 배출 지연이 동반되었다. 요당 배출 증가보다 위장관·식욕 변화가 두드러졌다.',
  ['GLP-1 수용체 작용제','DPP-4 억제제','SGLT2 억제제','Sulfonylurea계','Thiazolidinedione계'],'GLP-1 수용체 작용제','위 배출 지연·포만감·체중 감소와 초기 오심을 함께 해석한다. 같은 인크레틴 축을 이용해도 DPP-4 억제제의 대체로 체중 중립적인 성질과 다르다.','24–28','인크레틴 관련 포만감·위장관 반응'),
 e('glucosuria-volume','sglt2','혈당강하제를 시작한 뒤 요당과 요량이 늘고, 일어설 때 어지럽고 혈압이 낮아졌다. 심한 고혈당으로만 설명하기 어려운 포도당 배설과 체액량 감소가 함께 관찰되었다.',
  ['SGLT2 억제제','Metformin','Sulfonylurea계','DPP-4 억제제','Thiazolidinedione계'],'SGLT2 억제제','근위세뇨관 포도당 재흡수 감소가 요당·삼투성 이뇨·체액량 감소로 이어진다. 혈당 강하가 반드시 분비 증가를 통해 일어나는 것은 아니다.',29,'2025 다뇨·체액량 감소·기립성 어지럼'),
 e('glucosuria-infection','sglt2','새 약물 투여 후 공복 혈당은 낮아졌는데도 소변의 포도당 배설은 증가하였다. 이후 생식기 진균 감염이 반복되었다. 포도당이 신장을 통해 계속 빠져나가는 작용과 연결하여 원인을 찾고 있다.',
  ['SGLT2 억제제','DPP-4 억제제','α-Glucosidase 억제제','Thiazolidinedione계','Metformin'],'SGLT2 억제제','혈당 감소와 요당 증가는 모순이 아니다. 재흡수 억제로 소변 내 포도당이 증가하며 강의의 생식기 감염 주의점과 연결된다.',29,'요당 증가와 감염·체액 반응의 연결'),
 e('endogenous-incretin','dpp4','경구약 복용 후 식후 내인성 활성 인크레틴의 분해가 느려지고 혈당이 높을 때의 분비 반응이 강화되었다. 직접 수용체를 자극하는 약물을 보충한 것은 아니며, 체중은 대체로 변하지 않았다.',
  ['DPP-4 억제제','GLP-1 수용체 작용제','Sulfonylurea계','Thiazolidinedione계','α-Glucosidase 억제제'],'DPP-4 억제제','내인성 인크레틴을 보존하는 효소 억제와 외인성 직접 수용체 작용을 구별한다. 혈당 의존성과 체중 효과까지 함께 비교한다.','24–28','인크레틴 분해·직접 작용·체중 비교')
];
const r=(id,subject,context,options,answer,note,pages,exam)=>cause('renal',id,subject,context,options,answer,note,'18강 체액·전해질 조절(2) · 강의록 PDF '+pages+'쪽','족보 17–18강 · '+exam);
export const RENAL_CAUSES=[
 r('bicarbonate-loss','acetazolamide','이뇨제 투여 뒤 소변 pH는 높아지고 혈중 HCO₃⁻와 혈액 pH는 낮아졌다. 소변 중 중탄산 배설이 늘어, 소변과 전신의 산염기 변화가 서로 반대 방향으로 나타났다.',
  ['Acetazolamide','Furosemide','Thiazide','Spironolactone','Mannitol'],'Acetazolamide','중탄산 재흡수 감소로 알칼리뇨와 전신 대사성 산증이 함께 나타난다. K⁺ 손실성 이뇨제의 전형적인 수축성 알칼리증과 구별한다.','8–12','소변 알칼리화·혈중 산증 조합형'),
 r('ammonia-retention','acetazolamide','간성혼수에서 회복 중이던 간경변 환자가 이뇨제 복용 후 다시 의식이 나빠졌다. 소변이 알칼리화되어 NH₄⁺ 형태로 포획되는 비율이 줄고 NH₃의 재흡수가 증가한 것이 원인으로 해석되었다.',
  ['Acetazolamide','Spironolactone','Amiloride','Thiazide','Furosemide'],'Acetazolamide','소변 H⁺가 줄면 NH₃가 NH₄⁺로 전환되어 배설되는 과정이 불리해진다. 간경변의 복수에 쓰는 다른 이뇨제와 구별해야 한다.','11–12','간성혼수 악화와 소변 pH의 연결'),
 r('phosphate-stone','acetazolamide','이뇨제 복용 뒤 알칼리뇨가 지속되고 인산칼슘 결석이 발생하였다. 동시에 혈중 HCO₃⁻ 감소가 확인되었다. 단순한 칼슘뇨 증가만으로 설명하기보다 산염기 변화까지 함께 고려하였다.',
  ['Acetazolamide','Thiazide','Spironolactone','Amiloride','Mannitol'],'Acetazolamide','알칼리뇨는 인산칼슘 침전을 촉진할 수 있다. 전신의 HCO₃⁻ 감소를 함께 보면 중탄산 배설 증가 계열을 구별할 수 있다.','10–12','결석·소변 pH·혈중 중탄산의 종합'),
 r('calcium-magnesium-loss','furosemide','부종 치료 뒤 요중 Na⁺·K⁺뿐 아니라 Ca²⁺·Mg²⁺ 배설도 증가하였다. 혈중 K⁺가 감소하고 대사성 알칼리증이 생겼다. 관강의 양전위 감소가 이가 양이온 손실을 설명하였다.',
  ['Furosemide','Thiazide','Acetazolamide','Spironolactone','Amiloride'],'Furosemide','TAL의 NaCl 수송·관강 양전위·Ca²⁺·Mg²⁺ 재흡수를 연결한다. Thiazide와는 칼슘뇨 방향이 반대이다.','14–20','Na⁺·K⁺·Ca²⁺ 배설 방향 조합형'),
 r('tetany-after-diuresis','furosemide','심부전 부종에 이뇨제를 사용한 뒤 손목 경직과 두근거림이 나타나고 QT가 길어졌다. 검사에서 저칼슘혈증이 확인되었고 Ca²⁺ 투여 후 호전되었다. 이전보다 소변으로 빠져나가는 Ca²⁺가 늘었다.',
  ['Furosemide','Thiazide','Spironolactone','Amiloride','Mannitol'],'Furosemide','증상·QT 변화만이 아니라 확인된 저칼슘혈증과 칼슘뇨 증가를 함께 판단한다. 칼슘뇨를 줄이는 계열과 구별하는 것이 족보의 핵심이다.','14–20','2020·2021 경직·QT·Ca²⁺ 반응 증례'),
 r('concentrating-gradient','furosemide','약물 투여 후 ADH에 대한 집합관 반응은 남아 있으나 최대 농축뇨를 만들기 어려워졌다. 수질의 삼투 기울기가 낮아졌고 요중 Ca²⁺·Mg²⁺ 배설이 함께 증가하였다.',
  ['Furosemide','Thiazide','Spironolactone','Amiloride','Acetazolamide'],'Furosemide','용질을 수질 간질로 보내는 과정의 억제는 농도 기울기를 약화시킨다. Ca²⁺·Mg²⁺ 배설 증가까지 연결하면 부위를 구별할 수 있다.','14–17','수질 농도 기울기와 이온 배설 변화'),
 r('low-calcium-urine','thiazide','고혈압 약물 복용 후 요중 NaCl과 K⁺ 배설은 증가했지만 Ca²⁺ 배설은 감소하였다. 혈중 K⁺는 낮아졌으며, 재발성 칼슘 결석 위험과 관련해 소변 칼슘의 방향이 중요한 단서였다.',
  ['Thiazide','Furosemide','Acetazolamide','Spironolactone','Amiloride'],'Thiazide','NaCl 재흡수 억제와 Ca²⁺ 재흡수 증가는 동시에 나타날 수 있다. K⁺ 손실만으로는 loop와 구별되지 않으므로 소변 Ca²⁺ 감소를 함께 본다.','18–20','고혈압·칼슘 결석·전해질 비교형'),
 r('calcium-direction','thiazide','관강의 NaCl 재흡수를 억제하는 약물 두 종류를 비교하였다. 이 약물은 다른 강력한 이뇨제와 달리 요중 Ca²⁺를 감소시켰고, 관강 양전위 소실에 따른 Ca²⁺·Mg²⁺ 대량 손실 양상을 보이지 않았다.',
  ['Thiazide','Furosemide','Mannitol','Acetazolamide','Spironolactone'],'Thiazide','공통인 NaCl 배설 증가만으로 작용 부위를 고르지 않는다. 서로 반대인 Ca²⁺ 배설 방향으로 초기 DCT 계열을 구별한다.','14–20','서로 반대인 칼슘뇨 효과의 역추론'),
 r('steroid-off-target','spironolactone','이뇨제 복용 후 Na⁺ 배설은 늘었지만 K⁺ 배설은 줄어 고칼륨혈증이 발생하였다. 남성 환자에게 성기능 저하와 여성형유방도 나타났다. 직접 통로 차단 약물과 다른 비표적 수용체 작용이 의심되었다.',
  ['Spironolactone','Amiloride','Thiazide','Furosemide','Mannitol'],'Spironolactone','칼륨 보존만으로는 amiloride와 구별되지 않는다. 성호르몬 수용체 비표적 작용을 추가 단서로 사용한다. 알도스테론 자체가 성호르몬이라는 뜻은 아니다.','21–23','고칼륨혈증·내분비 부작용 비교형'),
 r('aldosterone-response','spironolactone','집합관 세포에 약물을 처리하자 호르몬 농도를 높여도 Na⁺ 재흡수 관련 단백질의 발현 증가가 억제되었다. 변화에는 시간이 필요했고 K⁺·H⁺ 분비도 감소하였다. 단순한 관강측 통로의 즉시 폐쇄와 달랐다.',
  ['Spironolactone','Amiloride','Furosemide','Thiazide','Acetazolamide'],'Spironolactone','전사·발현 단계를 거치는 알도스테론 길항과 ENaC 직접 차단을 구별한다. 호르몬 작용 억제는 Na⁺ 보존·K⁺ 분비를 모두 줄인다.','21–23','유전자 발현 단계와 직접 통로 차단 비교'),
 r('rapid-luminal','amiloride','약물을 집합관 관강 쪽에 처리한 직후 Na⁺ 유입 전류가 감소하였다. 이 과정에 새로운 단백질 발현 변화는 필요하지 않았다. 관강 음전위가 줄어 K⁺·H⁺ 분비도 감소하였다.',
  ['Amiloride','Spironolactone','Furosemide','Thiazide','Acetazolamide'],'Amiloride','직접 관강측 Na⁺ 통로를 차단하는 작용이다. 결과가 비슷한 MR 길항제와는 처리 위치·시간 경과·발현 조절 필요 여부로 구별한다.','21–23','칼륨 보존 이뇨제의 직접·간접 작용'),
 r('osmotic-volume','mannitol','뇌압 상승에 정맥 약물을 투여한 뒤 초기에는 혈관 내 용적이 늘어 폐울혈이 악화되었고, 이후 요량이 증가하였다. 조직의 물을 혈관 쪽으로 이동시키는 효과와 여과액에 남은 용질의 효과가 함께 설명되었다.',
  ['Mannitol','Furosemide','Thiazide','Acetazolamide','Amiloride'],'Mannitol','조직–혈관 사이의 삼투 이동과 관강에서의 물 재흡수 감소는 서로 다른 단계이다. 이뇨가 나중에 일어나더라도 초기 용적 증가가 문제가 될 수 있다.','3–6','뇌압·체액 이동·폐울혈의 연결형')
];
const p19=p=>'19강 순환기 약리 기초(1) · 강의록 PDF '+p+'쪽';
const p20=p=>'20강 순환기 약리 기초(2) · 강의록 PDF '+p+'쪽';
const k=(id,subject,context,options,answer,note,source,exam)=>cause('cardio',id,subject,context,options,answer,note,source,'족보 19–20강 · '+exam);
export const CARDIAC_CAUSES=[
 k('ion-coupling','digoxin','약물 처리 후 심근세포 내 Na⁺가 증가하고 Ca²⁺의 세포 밖 제거가 감소하였다. 수축 시 이용할 수 있는 Ca²⁺와 수축력은 증가했지만 cAMP 증가가 주된 출발점은 아니었다.',
  ['Digoxin','Propranolol','Verapamil','Lidocaine','Furosemide'],'Digoxin','Na⁺ 기울기 감소가 NCX의 Ca²⁺ 제거를 줄이는 연결을 역으로 추론한다. β 자극이나 단순 이뇨와는 수축력 증가의 경로가 다르다.',p19('10–12'),'심근 Na⁺·Ca²⁺ 변화와 수축력 조합'),
 k('potassium-sensitivity','digoxin','기존 순환기 약물의 투여량과 혈중 농도는 크게 달라지지 않았다. 그러나 이뇨 후 K⁺가 낮아지자 심실성 이소성 박동이 증가하였다. 표적에서 세포 밖 K⁺와 경쟁하는 강심 작용 약물의 감수성 증가가 의심되었다.',
  ['Digoxin','Propranolol','Verapamil','Lidocaine','Thiazide'],'Digoxin','저칼륨혈증은 혈중 농도 상승 없이도 표적에서 작용·독성 위험을 높일 수 있다. 약동학적 축적과 약력학적 감수성 변화를 구별한다.',p19('11–12, 33–36'),'저K⁺에서 기존 강심 약물의 작용 증가'),
 k('after-repolarization','digoxin','강심 작용 약물을 쓰던 환자에서 심실근 재분극이 완전히 끝난 뒤 작은 탈분극이 발생했다. 자발적 세포 내 Ca²⁺ 방출이 관찰되었으며, QT 연장에 따른 재분극 도중의 사건과는 달랐다.',
  ['Digoxin','Sotalol','Flecainide','Propranolol','Verapamil'],'Digoxin','Ca²⁺ 과부하와 완전 재분극 뒤 DAD를 연결한다. 재분극 지연·QT 연장에서 재분극 완료 전에 생기는 EAD와 구별한다.',p19('11–12')+' / '+p20('9, 19'),'2017 후탈분극의 시점과 Ca²⁺ 변화'),
 k('pulse-renin','beta-blocker','약물 투여 후 심박수가 낮아지는 동시에 신장의 renin 분비도 감소하였다. 교감신경 자극을 주었을 때 두 반응의 증가 폭이 함께 작아졌다. 직접 심근 이온 펌프를 억제하는 강심 반응은 나타나지 않았다.',
  ['Propranolol','Verapamil','Digoxin','Furosemide','Adenosine'],'Propranolol','심장 박동과 JG세포 renin 분비의 공통 β1 신호를 생각한다. 결절 전도만 억제하는 약물과 호르몬 반응까지 구별한다.',p19('14–17')+' / '+p20('16, 26'),'심박수와 renin 감소를 함께 설명하는 약물'),
 k('stress-response','beta-blocker','교감신경 자극으로 결절세포의 자발 탈분극이 빨라지던 실험에서, 약물 투여 후 phase 4 경사와 심박수 증가 반응이 둔화되었다. 심실 재분극의 뚜렷한 연장보다 수용체 자극에 대한 반응 감소가 중심이었다.',
  ['Esmolol','Lidocaine','Flecainide','Procainamide','Digoxin'],'Esmolol','β 자극에 의한 cAMP·자동능 증가를 낮추는 계열이다. 심실 Na⁺ 상승기 억제나 주된 APD 연장으로 설명하지 않는다. β 차단도 하는 sotalol은 중복 정답을 피하기 위해 보기에서 제외하였다.',p20('16–17, 26'),'SA phase 4와 교감신경 반응의 연결'),
 k('nodal-upstroke','verapamil','자율신경 자극을 일정하게 둔 전압고정 실험에서 약물 처리 후 결절세포의 Ca²⁺ 전류와 phase 0 상승 속도가 감소하였다. 빠른 심실근의 Na⁺ 상승기 억제보다 결절 전도 억제가 두드러졌다.',
  ['Verapamil','Lidocaine','Flecainide','Digoxin','Furosemide'],'Verapamil','결절 phase 0과 심실근 phase 0의 주 전류가 다르다. 관찰된 결절 Ca²⁺ 전류 억제를 class IV 작용으로 연결한다.',p20('16–17, 26'),'결절과 심실근 상승기 변화의 비교'),
 k('transient-hyperpolarization','adenosine','분리한 SA 결절세포에 물질을 처리하자 K⁺ 전도 증가와 함께 막전위가 더 음성이 되고 자발 탈분극이 느려졌다. 심근 수축력을 직접 높이는 작용이나 심실 phase 0 억제가 주된 관찰은 아니었다.',
  ['Adenosine','Lidocaine','Flecainide','Digoxin','Furosemide'],'Adenosine','강의의 결절 과분극·자발 탈분극 억제 그림을 거꾸로 읽는 문항이다. 같은 효과를 낼 수 있는 acetylcholine은 이 보기에서 제외하였다.',p20('16–17'),'SA 결절의 막전위·자발 탈분극 변화'),
 k('moderate-recovery','class-ia','심실근에서 약물 처리 후 빠른 상승기의 속도와 전도 속도가 감소하고 활동전위 지속시간은 늘었다. 통로 억제 상태에서 회복하는 시간은 중간 정도로, 강의의 1–10초 범주에 해당하였다.',
  ['Procainamide','Lidocaine','Flecainide','Verapamil','Propranolol'],'Procainamide','중간 회복 속도와 APD 연장을 함께 보아 class IA를 구별한다. Phase 0 변화 하나만으로 모든 Na⁺ 차단제를 동일하게 고르지 않는다.',p20('22–26, 34'),'빠른 상승기·APD·회복 속도 조합'),
 k('short-recovery','class-ib','심실근에서 약물 처리 후 활동전위 지속시간이 짧아졌고 빠른 상승기 억제는 비교적 작았다. 억제 상태에서 회복이 빨라 강의의 1초 미만 범주에 들어갔다.',
  ['Lidocaine','Procainamide','Flecainide','Sotalol','Verapamil'],'Lidocaine','빠른 회복과 APD 단축을 함께 연결해 class IB를 구별한다. IA의 APD 연장, IC의 느린 회복과 대비한다.',p20('22–26, 34'),'활동전위 단축과 빠른 회복의 연결'),
 k('slow-recovery','class-ic','심실근의 빠른 상승기와 전도가 뚜렷하게 억제되어 QRS가 넓어졌다. 반면 활동전위 지속시간 자체의 변화는 작았다. 약물에 의한 억제 상태의 회복은 10초보다 느렸다.',
  ['Flecainide','Procainamide','Lidocaine','Sotalol','Verapamil'],'Flecainide','강한 phase 0·전도 억제와 작은 APD 변화가 class IC의 구별점이다. QRS 변화와 재분극 지속시간을 같은 것으로 취급하지 않는다.',p20('22–26, 34'),'2017 phase 0 지연·APD 불변 조합'),
 k('delayed-repolarization','class-iii','약물 사용 뒤 QT가 길어지고, 심실근 활동전위에서도 재분극 완료가 늦어졌다. 저칼륨혈증이 동반되자 재분극이 끝나기 전에 후탈분극이 나타났다. QRS 증가만으로 길어진 QT는 아니었다.',
  ['Sotalol','Flecainide','Lidocaine','Verapamil','Digoxin'],'Sotalol','재분극 지연·APD 연장과 완료 전 EAD를 함께 해석한다. 이 보기에서 주된 재분극 연장 작용은 class III 약물에 해당한다.',p20('9, 18, 24–26'),'QT 연장·EAD 발생 시점의 연결'),
 k('peptide-profile','ace-inhibitor','순환기 약물 투여 후 angiotensin I은 증가했지만 II와 aldosterone은 감소하였다. 혈관저항이 낮아지고 K⁺ 배설 감소 방향의 변화도 나타났다. 호르몬 생성 단계와 수용체 작용 차이를 비교하고 있다.',
  ['ACE 억제제','AT1 수용체 차단제','β차단제','강심배당체','Loop 이뇨제'],'ACE 억제제','I에서 II로 가는 생성 반응이 막힌 양상이다. AT1 차단은 II의 생성효소 억제가 아니며, renin 분비 감소 약물은 I 증가 양상과 다르다.',p19('16–21'),'RAAS 호르몬 농도·혈관·K⁺ 변화')
];
export const SYSTEMS_CAUSES={endocrine:ENDOCRINE_CAUSES,renal:RENAL_CAUSES,cardio:CARDIAC_CAUSES};
