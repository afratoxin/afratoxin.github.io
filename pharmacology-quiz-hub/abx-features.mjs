import {createPairedQuestion} from './statement-quiz.mjs?v=20261017-exam2';
// Five short comparisons per topic; only three single-answer forms are kept.
// False statements reverse a taught feature, rather than inventing a second valid target.
const row=(id,left,right,wrong,note,page)=>({id,left,right,wrong,note,page,family:id});
const group=(id,title,lecture,summary,exam,rows)=>({id,title,lecture,summary,exam,rows:rows.map(r=>({...r,source:`${lecture}강 강의록 PDF ${r.page}쪽`}))});
export const ABX_FEATURE_GROUPS=[
 group('beta','β-lactam 항균 범위·내성·과민반응',24,'2–3','족보 2025 #74·75 · 2023 #46·47 · 2022 #55',[
  row('oxacillin','Oxacillin','Penicillinase에 안정적인 항포도알균 penicillin이다','Penicillinase에 취약한 천연 penicillin이다','큰 곁사슬로 penicillinase에 안정적이지만 변형 PBP를 가진 MRSA에 효과적이라는 뜻은 아니다.',19),
  row('piperacillin','Piperacillin','녹농균 활성을 갖는 확장범위 penicillin이다','녹농균 활성이 없는 천연 penicillin이다','강의와 족보는 piperacillin·ticarcillin을 항녹농균 penicillin으로 묶는다.',19),
  row('ceph1','1세대 cephalosporin','그람양성균 활성이 중심이고 그람음성균 범위는 제한적이다','그람음성균 활성이 중심이고 그람양성균 범위는 제한적이다','세대별 대표 경향을 묻는다. 개별 약물의 예외를 세대 전체로 확대하지 않는다.',28),
  row('ceph5','5세대 cephalosporin','대표 강의 약물은 MRSA에 작용하지만 녹농균에는 작용하지 않는다','대표 강의 약물은 녹농균에 작용하지만 MRSA에는 작용하지 않는다','강의 표의 5세대 구별점은 MRSA 활성이다. 3·4세대의 녹농균 활성을 그대로 옮기지 않는다.',32),
  row('beta-allergy','β-lactam 과민반응','유사한 곁사슬을 가진 약물 사이에서 교차반응이 가능하다','곁사슬이 유사한지는 약물 사이의 교차반응과 무관하다','Aminopenicillin과 일부 cephalosporin의 곁사슬 유사성을 강의·족보가 강조한다. 모든 과민반응 병력에 동일한 판단을 적용하지 않는다.','33–35')
 ]),
 group('ag','Aminoglycoside 체내 이동·독성',25,'3–4','족보 2025 #79 · 2021 #66 · 2019 #73·74',[
  row('ag-oral','Aminoglycoside · 흡수','강한 양전하·높은 극성으로 경구 흡수가 낮다','높은 지용성·낮은 극성으로 경구 흡수가 높다','Polycation 특성이 낮은 장관 흡수와 세포외액 중심 분포를 함께 설명한다.','12–13'),
  row('ag-entry','Aminoglycoside · 세균 내 진입','산소 의존 수송 때문에 저산소성 농양에서 효과가 떨어진다','산소와 무관하게 진입하여 저산소성 농양에서 효과가 커진다','시험관 감수성과 감염 부위에서의 진입은 다르다. 산성·저산소 환경에서는 유입이 감소한다.',14),
  row('ag-renal','Aminoglycoside · 신장','대부분 미변화체로 신장 배설되며 신기능 저하 시 축적된다','대부분 간에서 대사되므로 신기능 저하 시 축적되지 않는다','CYP 대사는 적고 신기능이 반감기를 좌우한다. 강의는 투여 간격과 농도 모니터링을 연결한다.',17),
  row('ag-tox','Aminoglycoside · 독성','신독성은 대체로 가역적이고 이독성은 비가역적이다','신독성은 대체로 비가역적이고 이독성은 가역적이다','세뇨관 상피는 재생될 수 있지만 내이 유모세포의 손상은 회복되기 어렵다.','16, 19'),
  row('ag-combination','Aminoglycoside · β-lactam 병용','상승작용은 가능하지만 두 약을 같은 용액에 직접 섞지 않는다','상승작용을 얻으려면 두 약을 같은 용액에 직접 섞어야 한다','β-lactam에 의한 세포벽 손상은 유입을 도울 수 있다. 직접 혼합 시 비활성화와 병용 시 상승작용은 별개이다.','13–14')
 ]),
 group('tmp','TMP-SMX 병용·독성·검사 변화',25,'4','족보 2025 #80·81 · 2022 #34 · 2021 #67',[
  row('tmp-sequence','TMP-SMX 병용','엽산 경로의 연속된 두 단계를 막아 상승작용을 낸다','엽산 경로의 같은 단계를 경쟁하여 길항작용을 낸다','SMX는 DHPS, TMP는 DHFR을 억제한다. 표적 이름만이 아니라 연속 차단과 상승작용을 연결한다.','22–23'),
  row('tmp-potassium','Trimethoprim · 칼륨','집합관 Na⁺ 통로 차단으로 고칼륨혈증을 일으킬 수 있다','집합관 Na⁺ 통로 자극으로 저칼륨혈증을 일으킬 수 있다','Amiloride 유사 작용이다. ACE 억제제·ARB·신기능 저하가 함께 있으면 위험이 커질 수 있다.',25),
  row('tmp-creatinine','Trimethoprim · 크레아티닌','세뇨관 분비 억제로 실제 GFR 저하 없이 혈청 수치가 오를 수 있다','세뇨관 분비 촉진으로 실제 GFR 저하 없이 혈청 수치가 오를 수 있다','분비 억제에 의한 겉보기 상승과 결정뇨·간질성신염에 의한 실제 손상을 구별한다.',25),
  row('sulfa-crystals','Sulfonamide · 결정뇨','용해도가 낮은 대사체가 농축 소변에서 석출될 수 있다','용해도가 높은 대사체가 묽은 소변에서 더 잘 석출된다','탈수·고용량은 위험을 높이며 충분한 수분으로 소변량을 유지하는 것이 강의의 예방 원리이다.',24),
  row('sulfa-hemolysis','Sulfonamide · 용혈','G6PD 결핍에서는 산화 스트레스에 의한 용혈 위험이 높다','G6PD 결핍에서는 산화 스트레스 방어가 강해 용혈 위험이 낮다','적혈구의 NADPH·환원 방어가 부족하면 산화 대사체에 취약해진다.',26)
 ]),
 group('quinolone','Quinolone 약물별 범위·배설·주의',25,'4','족보 2022 #58 · 2021 #68 · 2020 #70 · 2019 #70',[
  row('cipro-spectrum','Ciprofloxacin','녹농균 등 그람음성균에 강하지만 폐렴구균 활성은 부족하다','폐렴구균에 강하지만 녹농균 등 그람음성균 활성은 부족하다','폐렴구균을 고려하는 호흡기 quinolone과 항녹농균 범위의 차이를 묻는다.',30),
  row('levo-spectrum','Levofloxacin','폐렴구균·비정형균을 포함하는 호흡기 quinolone이다','폐렴구균 활성이 부족해 호흡기 감염과 연결하지 않는 약물이다','Ciprofloxacin보다 호흡기 범위가 확대된다. 녹농균 활성의 강도까지 모든 약물이 같지는 않다.',30),
  row('moxi-urine','Moxifloxacin','요중 노출이 낮아 감수성만으로 요로감염 약제로 고르지 않는다','요중 노출이 높아 감수성만으로 요로감염 약제로 고른다','간 포합이 주 배설 경로이므로 균 감수성과 감염 부위 농도를 구별해야 한다.','30, 32'),
  row('quinolone-chelate','Quinolone · 흡수','금속 양이온과 킬레이트를 형성하면 경구 흡수가 감소한다','금속 양이온과 킬레이트를 형성하면 경구 흡수가 증가한다','철분·제산제·칼슘과의 상호작용은 경구 흡수 단계의 문제이다.',31),
  row('quinolone-tendon','Quinolone · 독성','힘줄 손상·파열과 말초신경병증이 중요한 주의점이다','힘줄 재생 촉진과 말초신경 보호가 중요한 약물 효과이다','넓은 항균 범위와 좋은 흡수가 안전성을 보장하지 않는다. 고령·스테로이드 병용에서 힘줄 위험에 특히 유의한다.',33)
 ]),
 group('tetracycline','Tetracycline 약물별 차이·독성',26,'5','족보 2020 #71 · 강의의 doxycycline 증례',[
  row('doxy-renal','Doxycycline','주로 비신장 경로로 제거되어 신기능 저하 때 유리하다','대부분 신장으로만 제거되어 신기능 저하 때 특히 축적된다','강의는 doxycycline의 대변 배설을 구세대 tetracycline의 신장 배설과 대비한다.',7),
  row('mino-vestibular','Minocycline','높은 지질용해도와 어지럼·운동실조를 연결한다','낮은 지질용해도 때문에 어지럼·운동실조가 생기지 않는다','중추 이행과 전정계 부작용이 약물별 구별점이다.',7),
  row('demeclo-di','Demeclocycline','신장의 ADH 반응 저하로 신성 요붕증을 유발할 수 있다','신장의 ADH 반응 증가로 수분 저류만 유발한다','ADH 반응을 낮추는 작용이 SIADH와의 역사적 연결도 설명한다.',8),
  row('tetra-calcium','Tetracycline · 칼슘','킬레이트 성질은 흡수 저하와 치아·뼈 침착을 함께 설명한다','킬레이트 성질은 흡수 증가와 치아·뼈 침착 방지를 설명한다','같은 화학적 성질이 음식·금속 상호작용과 성장 중 조직의 독성을 만든다.','6, 8'),
  row('doxy-child','Doxycycline · 소아','리케차 감염의 단기 치료는 연령만으로 배제하지 않는다','리케차 감염의 단기 치료도 소아에서는 항상 배제한다','강의는 치아 독성의 일반 원칙과 소아 리케차 감염의 단기 doxycycline 사용을 구별한다. 모든 감염·모든 약물로 확대하지 않는다.','8, 21')
 ]),
 group('macrolide','Macrolide·clindamycin 상호작용·내성',26,'5','족보 2023 #54 · 2021 #70 · 강의의 ADME·D-test',[
  row('ery-cyp','Erythromycin','CYP3A4를 억제해 해당 기질 약물의 노출을 높일 수 있다','CYP3A4를 유도해 해당 기질 약물의 노출을 낮춘다','Rifampin의 효소 유도와 반대 방향이다. Statin 등 병용약의 대사와 연결한다.',12),
  row('clari-cyp','Clarithromycin','CYP3A4 억제로 병용약 상호작용을 고려해야 한다','CYP3A4 영향이 없어 병용약 상호작용을 고려하지 않는다','같은 계열이라도 azithromycin과 CYP 영향이 같지 않다.',12),
  row('azi-tissue','Azithromycin','조직·세포 내 축적과 긴 반감기로 노출이 오래 지속된다','조직·세포 내 이행이 낮고 짧은 반감기로 노출이 빨리 끝난다','긴 조직 체류가 비교적 짧은 투약 기간에도 효과가 이어지는 이유이다.',12),
  row('clinda-colitis','Clindamycin','장내 정상균총 교란으로 C. difficile 결장염 위험을 높인다','장내 정상균총 보존으로 C. difficile 결장염 위험을 낮춘다','그람양성균·혐기균 범위와 함께 장내 균총 변화라는 대가를 학습한다.',13),
  row('mlsb','유도성 clindamycin 내성','Erythromycin 내성·clindamycin 감수성 결과에서 D-test를 고려한다','Erythromycin 내성·clindamycin 감수성이면 유도성 내성은 배제된다','MLSB 교차내성은 macrolide·lincosamide·streptogramin B이며 chloramphenicol까지 같은 군으로 묶지 않는다.',11)
 ]),
 group('other','Chloramphenicol·vancomycin·polymyxin 특징',26,'5–6','족보 2023 #52·53 · 2019 R3 · 강의의 혈액독성 비교',[
  row('chlor-marrow','Chloramphenicol · 혈액독성','용량 의존적 골수억제와 특이체질성 재생불량성빈혈을 구별한다','골수억제와 재생불량성빈혈은 모두 용량 의존적이고 가역적이다','골수억제는 미토콘드리아 리보솜 억제와 연결되며 재생불량성빈혈과 기전·예측가능성이 다르다.',18),
  row('chlor-baby','Chloramphenicol · 신생아','포합 대사 미성숙과 느린 배설로 회색아기증후군이 생길 수 있다','포합 대사 항진과 빠른 배설로 회색아기증후군이 생긴다','특히 glucuronosyltransferase 미성숙에 의한 축적을 단순히 신장만의 문제로 외우지 않는다.',18),
  row('vanco-route','Vancomycin · 경로','전신감염은 정맥 노출, 결장염은 경구 국소 작용을 이용한다','전신감염은 경구 노출, 결장염은 정맥 국소 작용을 이용한다','경구 흡수가 낮다는 한 성질이 투여 목적에 따라 단점과 장점이 된다.',17),
  row('vanco-resistance','Vancomycin · 내성','D-Ala-D-Ala 말단 변화는 약물 결합을 감소시킨다','PBP2a 생성만으로 D-Ala-D-Ala 말단에 대한 결합이 사라진다','MRSA의 β-lactam 내성은 효소 표적 변화, vancomycin 내성은 결합 기질 말단 변화로 구별한다.',16),
  row('polymyxin','Polymyxin B','그람음성균 막에 작용하며 신독성·신경독성이 문제이다','그람양성균 엽산에 작용하며 치아 착색이 주된 문제이다','세포막 손상과 독성 때문에 사용이 제한되는 약물이라는 강의 범위를 지킨다.',18)
 ]),
 group('tb','항결핵제 약물별 특징·장기 병용',27,'6','족보 2025 #97 · 2023 #55 · 2020 #72',[
  row('inh','Isoniazid','NAT 대사와 B6 결핍·말초신경염을 연결한다','CYP3A4 유도와 붉은 눈물·소변을 연결한다','Acetylation의 개인차와 pyridoxine 결핍이 중요하며 붉은 체액은 rifampin 특징이다.',8),
  row('rif','Rifampin','효소 유도와 붉은 눈물·소변을 연결한다','효소 억제와 B6 결핍·말초신경염을 연결한다','병용약의 대사를 촉진해 노출을 낮출 수 있다. 체액의 색 변화는 혈뇨와 구별한다.',9),
  row('eth','Ethambutol','특징적 유해반응은 시신경염이다','특징적 유해반응은 회색아기증후군이다','결핵 1차 약물 사이에서 독성을 구별한다. 회색아기증후군은 chloramphenicol과 연결한다.',10),
  row('pza','Pyrazinamide','Pyrazinoic acid로 전환되며 간독성·관절통과 연결한다','Pyridoxine으로 전환되며 간독성·관절통을 예방한다','전구약의 활성형과 유해반응을 함께 기억하며 정확한 작용 기전은 완전히 규명되었다고 단정하지 않는다.',11),
  row('tb-course','결핵 치료 원리','느린 증식과 내성균 선택 때문에 장기 병용치료를 한다','빠른 증식과 내성 위험 부재 때문에 단기 단독치료를 한다','여러 기전의 병용은 내성균 선택을 줄이기 위한 원리이다. 모든 환자의 기간·조합이 동일하다는 뜻은 아니다.','5–6')
 ]),
 group('fungal','항진균제 경로·독성·상호작용',27,'7','족보 2025 #98 · 2023 #57 · 2022 #8',[
  row('ampho','Amphotericin B','경구 흡수가 낮고 전신 투여에서 신독성이 중요하다','경구 흡수가 높고 전신 투여에서 치아 착색이 중요하다','Ergosterol 결합과 별도로 좁은 치료 범위·낮은 GI 흡수·신독성을 구별한다.',18),
  row('nystatin','Nystatin','흡수가 낮아 Candida 감염의 국소 작용을 이용한다','흡수가 높아 Candida 혈류감염의 전신 작용을 이용한다','국소 작용은 크림만을 뜻하지 않는다. 비흡수성 경구 현탁액도 구강 Candida에 국소 작용한다.',19),
  row('keto-cyp','Ketoconazole','사람 CYP3A 억제로 병용약의 노출을 높일 수 있다','사람 CYP3A 유도로 병용약의 노출을 낮춘다','진균의 ergosterol 합성 효소 표적과 사람 CYP를 통한 상호작용을 구별한다.',21),
  row('itra-cyp','Itraconazole','CYP3A 기질 병용약의 대사를 억제할 수 있다','CYP3A 기질 병용약의 대사를 촉진한다','족보의 약물 대사 억제를 약효 자체의 억제로 잘못 옮기지 않는다.',21),
  row('vori-cyp','Voriconazole','약동학적 개인차는 CYP2C19와 연결한다','약동학적 개인차는 CYP2D6와 연결한다','강의와 족보의 대표 효소 구별이다. 대사 저하자는 노출·독성이 증가할 수 있다.',21)
 ]),
 group('viral','항바이러스제 감염·활성화·경로',27,'7','족보 2025 #99 · 2023 #56 · 2022 #35',[
  row('acv','Acyclovir','Triphosphate 활성형이 HSV·VZV DNA 합성을 억제한다','Diphosphate 활성형이 influenza 방출을 억제한다','활성화 과정과 치료 감염을 연결한다. Influenza 방출 억제는 oseltamivir이다.',28),
  row('teno','Tenofovir','Diphosphate 활성형과 HBV·HIV를 연결한다','Triphosphate 활성형과 HSV·VZV만을 연결한다','HBV DNA polymerase와 HIV 역전사효소는 모두 유효 표적이다. 둘 중 하나를 오답으로 삼지 않는다.',30),
  row('lami','Lamivudine','Triphosphate 활성형과 HBV·HIV를 연결한다','Diphosphate 활성형과 influenza A·B를 연결한다','Tenofovir의 diphosphate와 lamivudine의 triphosphate를 구별한다.',31),
  row('riba','Ribavirin','Guanosine 유사체로 강의에서 HCV와 연결한다','Cytidine 유사체로 강의에서 Candida와 연결한다','강의는 대사 활성화와 RNA 합성 억제를 제시한다. HCV의 모든 치료를 이 약 단독으로 해결한다는 뜻은 아니다.',34),
  row('oselt','Oseltamivir','경구 투여하며 influenza A·B의 방출을 억제한다','정맥 투여하며 HSV·VZV의 DNA 복제를 억제한다','Neuraminidase 억제·경구 전구약·바이러스 방출을 연결한다.',37)
 ])
];
export const ABX_FEATURE_QUESTIONS=ABX_FEATURE_GROUPS.flatMap((g,gi)=>[0,1,2].map(i=>{
 const anchor=g.rows[(gi+i)%5],polarity=(gi*3+i)%2?'incorrect':'correct';
 return createPairedQuestion({id:`abx-feature:${g.id}:${anchor.id}`,subject:anchor.id,lecture:g.lecture,family:g.title,group:'feature:'+g.id,kind:'feature',featureGroup:g.id,core:true,weight:1,exam:g.exam,prioritySources:[`#약리학(1) 정리 PDF ${g.summary}쪽`,g.exam]},anchor,g.rows,{polarity,index:gi*3+i,topic:g.title});
}));

const drugNotes={
 Azithromycin:'조직 축적·긴 반감기를 가지며 erythromycin·clarithromycin보다 CYP3A4 억제가 적다.',
 Erythromycin:'CYP3A4 억제와 병용약 노출 증가가 중요하다.',Clarithromycin:'CYP3A4 억제와 병용약 상호작용이 중요하다.',
 Rifampin:'효소 유도와 붉은 눈물·소변을 연결하는 항결핵제이다.',Itraconazole:'강한 CYP3A 억제로 병용약 노출을 높일 수 있는 항진균제이다.',
 Moxifloxacin:'간 포합이 주 경로이고 요중 노출이 낮아 요로감염 약제로 고르지 않는다.',Ciprofloxacin:'녹농균 등 그람음성균에 강하고 요중 노출을 얻을 수 있는 quinolone이다.',Levofloxacin:'호흡기 범위를 가지며 신장 배설·요중 노출을 연결한다.',
 Amoxicillin:'감수성 균에서 사용할 수 있는 aminopenicillin이며 신장 배설을 연결한다.',Ampicillin:'감수성 균에서 사용할 수 있는 aminopenicillin이며 신장 배설을 연결한다.',
 Minocycline:'높은 지질용해도와 어지럼·운동실조 같은 전정계 이상반응을 연결한다.',Doxycycline:'비신장 제거와 세포내균 감염을 연결한다.',Tetracycline:'칼슘 킬레이트·치아 침착과 금속 양이온 상호작용을 연결한다.',Demeclocycline:'ADH에 대한 신장 반응을 낮춰 신성 요붕증을 일으킬 수 있다.',
 Isoniazid:'NAT 대사와 B6 결핍·말초신경염을 연결한다.',Ethambutol:'시신경염과 시력·색각 변화를 연결한다.',Pyrazinamide:'Pyrazinoic acid 활성화와 간독성·관절통을 연결한다.',Gentamicin:'신독성·이독성·신경근 차단을 연결하는 aminoglycoside이다.',
 Chloramphenicol:'신생아 포합 대사 미성숙에 따른 축적·회색아기증후군을 연결한다.',Vancomycin:'전신감염에서는 정맥, 결장염에서는 경구 국소 작용을 이용한다.',
 'Amphotericin B':'Ergosterol 결합 항진균제로 신독성과 낮은 경구 흡수를 연결한다.',Nystatin:'흡수가 낮아 Candida 감염의 국소 작용을 이용한다.',Fluconazole:'Azole 항진균제로 amphotericin B의 대표 신독성과 구별한다.',Voriconazole:'CYP2C19에 따른 개인차·간독성과 상호작용을 연결한다.'
};
const clinical=(id,subject,lecture,stem,options,answer,note,page)=>({id:'clinical-abx-feature-'+id,subject,lecture,format:'clinical',group:'clinical',core:true,weight:1,stem,options,answer,note,source:`${lecture}강 강의록 PDF ${page}쪽`,details:options.map(name=>name+': '+drugNotes[name]),prioritySources:['#약리학(1) 정리 PDF '+(lecture===25?'4':lecture===26?'5–6':'6–7')+'쪽']});
export const ABX_FEATURE_CLINICAL=[
 clinical('statin','azithromycin',26,'CYP3A4 기질인 statin을 복용하는 환자다. 다른 조건과 항균 감수성은 적절하다고 할 때, erythromycin·clarithromycin보다 CYP3A4 억제가 적은 macrolide는?',['Azithromycin','Erythromycin','Clarithromycin','Rifampin','Itraconazole'],'Azithromycin','같은 macrolide라도 azithromycin의 CYP3A4 억제는 적다. 상호작용이 전혀 없다는 뜻은 아니다.',12),
 clinical('urine','moxifloxacin',25,'요로감염 원인균이 보기의 다섯 약물 모두에 시험관 감수성을 보였다. 충분한 요중 노출을 얻는 관점에서 강의가 부적절하다고 구별한 약물은?',['Moxifloxacin','Ciprofloxacin','Levofloxacin','Amoxicillin','Ampicillin'],'Moxifloxacin','감수성만으로 감염 부위 노출을 알 수 없다. Moxifloxacin은 간 포합이 주 경로여서 요로감염과 구별한다.','30, 32'),
 clinical('vestibular','minocycline',26,'Tetracycline 계열을 복용한 환자에게 어지럼과 운동실조가 생겼다. 높은 지질용해도와 전정계 부작용이 특히 강조되는 약물은?',['Minocycline','Doxycycline','Tetracycline','Demeclocycline','Erythromycin'],'Minocycline','Minocycline의 뇌 이행·전정계 이상반응을 doxycycline의 비신장 제거와 구별한다.',7),
 clinical('red-fluid','rifampin',27,'결핵 치료 중 눈물과 소변이 붉게 변했다. 혈액이 섞인 것은 아니며, 병용약의 대사가 빨라질 수 있는 약물을 복용 중이다. 해당 약물은?',['Rifampin','Isoniazid','Ethambutol','Pyrazinamide','Gentamicin'],'Rifampin','붉은 체액과 간 미세소체 효소 유도는 rifampin의 두 특징이다.',9),
 clinical('optic','ethambutol',27,'결핵 약물치료 중 시야가 흐려지고 색 구분이 어려워져 약물성 시신경염을 의심하였다. 가장 직접적으로 연결할 약물은?',['Ethambutol','Isoniazid','Rifampin','Pyrazinamide','Gentamicin'],'Ethambutol','Ethambutol의 시신경염을 isoniazid의 말초신경염이나 gentamicin의 이독성과 구별한다.',10),
 clinical('gray-baby','chloramphenicol',26,'신생아에서 약물 축적 후 복부팽만·청색증·순환 허탈이 나타났다. 미성숙한 glucuronide 포합과 연결되는 약물은?',['Chloramphenicol','Vancomycin','Doxycycline','Erythromycin','Gentamicin'],'Chloramphenicol','회색아기증후군은 신생아의 대사·배설 미성숙에 따른 chloramphenicol 축적과 연결한다.',18),
 clinical('fungal-kidney','amphotericin-b',27,'전신 진균 감염 치료 중 신기능 저하가 발생했다. 보기 중 ergosterol에 결합해 막 통로를 만들며 신독성이 특히 강조되는 약물은?',['Amphotericin B','Nystatin','Itraconazole','Fluconazole','Voriconazole'],'Amphotericin B','Nystatin도 ergosterol에 결합하지만 전신 치료에 쓰는 약물이 아니다. 전신 노출·표적·독성을 함께 구별한다.',18)
];
