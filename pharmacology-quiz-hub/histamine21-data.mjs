import {buildUnderstandingBank} from './systems-builder.mjs?v=20261017-systems1';
const S=(pages)=>`21강 히스타민 약리 v2 ${pages}쪽 · #약리학 정리본 26–27쪽`;
const claim=(right,wrong,why)=>({right,wrong,why});
const topic=(id,group,context,goal,pages,exam,claims,clinical=false)=>({id,group,context,goal,source:S(pages),exam,claims,clinical});
export const HIST_CASES=[
 topic('synthesis','합성·대사·유리','Histidine에서 histamine이 생성되는 단계와 이후 분해 단계를 비교하였다.','합성 효소와 분해 효소를 구별한다.','8','족보 2020 #39 · 2019 #88: 합성 효소',[
  claim('L-histidine decarboxylase는 histidine을 histamine으로 전환한다.','L-histidine decarboxylase는 histamine을 histidine으로 분해한다.','탈카복실화에 의한 합성 단계이며 histamine 분해 단계가 아니다.'),
  claim('Histamine 합성에서는 histidine의 카복실기가 제거된다.','Histamine 합성에서는 histidine에 메틸기가 첨가된다.','Histidine → histamine은 탈카복실화이다. 메틸화는 HNMT가 관여하는 대사 경로이다.'),
  claim('HNMT는 histamine의 N-메틸화 대사에 관여한다.','HNMT는 histidine을 탈카복실화하여 histamine을 합성한다.','Histamine N-methyltransferase와 histidine decarboxylase는 서로 다른 단계를 담당한다.'),
  claim('Diamine oxidase는 histamine의 분해 경로에 관여한다.','Diamine oxidase는 histidine으로부터 histamine을 합성한다.','DAO는 대사 효소이며 histamine 합성 효소가 아니다.'),
  claim('MAO-B는 메틸화된 histamine 대사산물의 후속 대사에 관여한다.','MAO-B는 histidine에서 histamine을 생성하는 첫 단계에 관여한다.','강의 그림에서 N-methylhistamine의 다음 단계가 MAO-B이다.')
 ]),
 topic('metabolism','합성·대사·유리','히스타민 대사 그림에서 N-methylhistamine 경로와 diamine oxidase 경로를 따라가 보았다.','메틸화 경로의 앞뒤 효소를 연결한다.','8','족보 2023 #23 · 2022 #75: 대사 그림의 MAO-B',[
  claim('Histamine은 HNMT에 의해 N-methylhistamine으로 전환될 수 있다.','Histamine은 MAO-B에 의해 N-methylhistamine으로 메틸화된다.','HNMT가 메틸화를 담당하고 MAO-B는 후속 산화 대사에 관여한다.'),
  claim('N-methylhistamine 이후의 대사 단계에는 MAO-B가 관여한다.','N-methylhistamine 이후의 대사 단계에는 L-histidine decarboxylase가 관여한다.','합성 효소를 메틸화 대사산물의 분해 단계에 넣지 않는다.'),
  claim('DAO 경로는 HNMT 메틸화 경로와 구별되는 histamine 대사 경로이다.','DAO 경로는 HNMT 메틸화가 선행해야만 진행되는 단일 직렬 경로이다.','강의 도식은 histamine에서 두 갈래로 분기한다.'),
  claim('중추에서 histamine 대사는 주로 HNMT 메틸화 경로와 연결된다.','중추에서 histamine 대사는 주로 histidine decarboxylase 경로와 연결된다.','정리본도 뇌의 주 경로를 HNMT → MAO로 정리한다. Decarboxylase는 합성이다.'),
  claim('Histamine의 생성량과 분해량은 서로 다른 효소 단계로 조절된다.','Histamine의 생성과 분해는 모두 L-histidine decarboxylase가 담당한다.','합성은 decarboxylase, 대사는 HNMT·DAO 등의 경로로 구별한다.')
 ]),
 topic('storage','합성·대사·유리','조직별 histamine 저장량과 교체 속도를 비교하였다.','비만세포 과립 저장과 ECL 세포의 빠른 교체를 구별한다.','8','족보 2025 #55: 조직 분포와 위 ECL 세포',[
  claim('비만세포와 호염기구는 histamine을 과립에 저장한다.','비만세포와 호염기구는 histamine을 혈장에 고농도로 상시 방출한다.','과립에 heparin 등과 결합해 저장하며 혈장 농도는 매우 낮다.'),
  claim('위 ECL 세포는 histamine을 분비하여 위산 분비를 조절한다.','위 벽세포는 histamine을 분비하고 ECL 세포가 위산을 분비한다.','Histamine의 공급원은 ECL 세포, H2 수용체를 통해 산을 분비하는 세포는 벽세포이다.'),
  claim('피부·기관지·장 점막에는 histamine이 풍부하다.','혈장은 피부·기관지·장 점막보다 histamine을 고농도로 저장한다.','혈장에서는 낮고 조직에 저장되는 분포가 강의의 핵심이다.'),
  claim('비만세포의 과립 저장 histamine은 교체가 비교적 느리다.','비만세포의 과립 저장 histamine은 ECL 세포보다 교체가 빠르다.','강의는 과립 저장을 느린 교체, ECL·신경세포를 빠른 교체로 구별한다.'),
  claim('Histamine은 가까운 세포에 작용하는 autacoid에 해당한다.','Histamine은 먼 장기에만 작용하며 국소 매개체로 작용하지 않는다.','Autacoid는 국소에서 작용하는 내인성 매개체이다.')
 ]),
 topic('release','합성·대사·유리','알레르기 감작 후의 탈과립과 사전 감작 없이 일어나는 직접 histamine 유리를 비교하였다.','IgE 의존 반응과 직접 유리를 구별한다.','9–10','족보 2025 #57: IgE 반응 그림의 mast cell을 응용',[
  claim('항원이 비만세포 표면의 IgE–FcεRI를 교차결합하면 탈과립이 유발된다.','항원이 비만세포 표면의 H2 수용체를 교차결합하면 IgE 의존 탈과립이 유발된다.','IgE 고친화성 수용체는 FcεRI이다. H2는 IgE 결합 수용체가 아니다.'),
  claim('비만세포 탈과립으로 histamine과 tryptase가 빠르게 유리된다.','비만세포 탈과립으로 histamine이 유리되려면 수일간의 신생 합성이 필수이다.','과립에 저장된 매개체는 수 초 내 빠르게 유리될 수 있다.'),
  claim('약물에 의한 직접 비만세포 활성화는 사전 IgE 감작 없이도 가능하다.','약물에 의한 직접 비만세포 활성화는 사전 IgE 감작이 반드시 필요하다.','일부 약물의 MRGPRX2 매개 직접 유리는 IgE 의존 경로와 구별한다.'),
  claim('탈과립 후 PLA₂ 활성화로 leukotriene과 prostaglandin 생성이 이어질 수 있다.','탈과립 후 생성되는 모든 leukotriene과 prostaglandin은 histamine과 동일한 물질이다.','알레르기 반응에는 여러 매개체가 관여하므로 H1 차단만으로 전부 억제되지 않는다.'),
  claim('Cromolyn은 비만세포 안정화를 통해 매개체 유리를 억제한다.','Cromolyn은 벽세포 H2 수용체를 차단하여 비만세포 탈과립을 억제한다.','유리 억제와 수용체 차단은 서로 다른 접근이다.')
 ]),
 topic('allergy-cells','합성·대사·유리','알레르기 반응에서 Th2–B 세포–비만세포–호산구의 역할을 연결하였다.','Histamine을 빠르게 방출하는 세포를 찾는다.','10','족보 2025 #57: 그림 속 histamine·tryptase 방출 세포',[
  claim('항원 제시를 받은 Th2 세포의 IL-4·IL-13은 B 세포의 IgE 생성과 연결된다.','Th2 세포의 IL-4·IL-13은 벽세포가 IgE를 생성하도록 유도한다.','IgE 생성은 B 세포 계열의 기능이며 벽세포의 위산 분비와 구별한다.'),
  claim('IgE는 비만세포의 FcεRI에 결합하여 감작 상태를 형성한다.','IgE는 비만세포의 양성자펌프에 결합하여 감작 상태를 형성한다.','IgE–FcεRI 결합이 감작과 연결된다.'),
  claim('Histamine과 tryptase를 급성으로 방출하는 핵심 세포는 비만세포이다.','Histamine과 tryptase를 급성으로 방출하는 핵심 세포는 위 벽세포이다.','족보 그림의 mast cell을 위산 분비 세포와 혼동하지 않는다.'),
  claim('Th2의 IL-5는 호산구 반응과 연결된다.','Th2의 IL-5는 벽세포의 H⁺/K⁺-ATPase를 직접 활성화하는 주 신호이다.','강의 필기에서 후기 호산구 반응은 IL-5로 보완되어 있다.'),
  claim('H1 차단으로 histamine 증상을 줄여도 다른 매개체의 염증이 남을 수 있다.','H1 차단으로 histamine 증상을 줄이면 모든 매개체의 염증이 함께 완전히 사라진다.','Leukotriene·prostaglandin·사이토카인 반응을 H1 반응과 동일시하지 않는다.')
 ]),
 topic('receptor-signals','수용체·조직 작용','H1–H4 수용체의 G 단백과 세포 내 신호를 비교하였다.','H1–Gq, H2–Gs, H3·H4–Gi/o를 연결한다.','11–12','족보 2025 #56: 약물이 작용하는 histamine 수용체 구분',[
  claim('H1은 Gq/11과 연결되어 IP₃·Ca²⁺ 신호를 증가시킨다.','H1은 Gs와 연결되어 위 벽세포의 주된 위산 분비 신호를 만든다.','H1의 Gq 경로와 H2의 Gs–cAMP 경로를 구별한다.'),
  claim('H2는 Gs와 연결되어 cAMP를 증가시킨다.','H2는 Gi/o와 연결되어 cAMP를 감소시킨다.','위 벽세포의 H2–Gs–cAMP 증가가 산 분비와 연결된다.'),
  claim('H3는 Gi/o와 연결되는 신경계 조절 수용체이다.','H3는 위 벽세포에서 Gs로 위산 분비를 촉진하는 주 수용체이다.','H3는 신경전달물질 유리를 억제하며 위산 분비의 중심은 H2이다.'),
  claim('H4는 면역세포에 분포하며 Gi/o 신호와 연결된다.','H4는 위 벽세포의 H⁺/K⁺-ATPase 자체를 가리키는 이름이다.','H4는 GPCR이고 양성자펌프와 다르다.'),
  claim('H1–H4는 모두 G 단백 연결 수용체로 분류한다.','H1–H4는 모두 histamine이 여는 ligand-gated 이온통로이다.','수용체의 하위 신호와 이온통로 자체를 구분한다.')
 ]),
 topic('tissue-effects','수용체·조직 작용','Histamine의 혈관·심장·기관지·중추 작용을 수용체와 연결하였다.','Histamine은 빈맥·투과성 증가·기관지 수축을 유발할 수 있다.','11–13','족보 2025 #55 · 2021 #36: histamine의 장기별 작용',[
  claim('혈관내피 H1 활성은 NO를 통한 빠른 혈관확장과 연결된다.','혈관내피 H1 활성은 NO 감소를 통한 지속적 혈관수축과 연결된다.','H1–내피 NO는 빠르고 짧은 확장이다.'),
  claim('H1 활성은 혈관 투과성을 높여 팽진·부종을 유발할 수 있다.','H1 활성은 혈관 투과성을 낮춰 팽진·부종을 방지한다.','내피 간극 증가로 혈장이 조직으로 이동한다.'),
  claim('심장 H2 활성은 심박수와 수축력 증가에 연결된다.','심장 H2 활성은 심박수와 수축력 감소에 연결된다.','H1의 방실전도 지연과 H2의 심박 증가를 구별하며 정맥투여 시 반사성 빈맥도 우세하다.'),
  claim('기관지 H1 활성은 평활근 수축을 유발한다.','기관지 H1 활성은 β2 작용제처럼 평활근 이완을 유발한다.','Histamine은 천식 환자에서 기관지 수축을 악화시킬 수 있다.'),
  claim('중추 H1 활성은 각성을 높이고 식욕을 낮추는 방향이다.','중추 H1 활성은 졸림을 높이고 식욕을 증가시키는 방향이다.','H1을 차단했을 때의 진정·식욕 증가와 활성화 효과를 뒤바꾸지 않는다.')
 ]),
 topic('h3-pitolisant','수용체·조직 작용','기면증 치료에 쓰이는 pitolisant가 histamine 유리를 증가시키는 이유를 검토하였다.','억제성 자가수용체 차단은 유리 증가로 이어진다.','11–12, 20','올해 강의·정리본 보충: H3 자가수용체와 pitolisant',[
  claim('H3 자가수용체 활성은 histamine 유리를 억제한다.','H3 자가수용체 활성은 histamine 유리를 촉진한다.','시냅스전 H3는 음성 되먹임을 제공한다.'),
  claim('Pitolisant는 H3 역작용제·길항제로 작용한다.','Pitolisant는 위 벽세포 H2 작용제로 작용한다.','Pitolisant의 표적은 H3이며 산 분비 촉진제가 아니다.'),
  claim('Pitolisant는 H3에 의한 억제를 풀어 histamine 유리를 증가시킨다.','Pitolisant는 H3에 의한 억제를 강화하여 histamine 유리를 감소시킨다.','억제 수용체의 활성을 낮추면 histamine 유리가 증가한다.'),
  claim('Pitolisant의 각성 효과는 기면증 치료와 연결된다.','Pitolisant의 각성 효과는 수면 유도를 위한 불면증 치료와 연결된다.','각성 증가를 진정 효과와 혼동하지 않는다.'),
  claim('H4는 호산구·비만세포 등 면역세포의 주화성·가려움과 연결된다.','H4는 pitolisant의 기면증 치료 효과를 매개하는 주 표적이다.','기면증 약물 표적 H3와 면역세포의 H4를 구별한다.')
 ]),
 topic('inverse-strategies','H1 항히스타민제','Histamine 작용을 줄이는 약물을 수용체 차단·유리 억제·생리적 길항으로 분류하였다.','역작용제는 수용체의 항상성 활성까지 낮춘다.','14–15','족보 2025 #56의 수용체 분류를 기전 비교로 확장',[
  claim('H1 역작용제는 수용체의 항상성 활성을 낮춘다.','H1 역작용제는 수용체의 항상성 활성을 높인다.','단순한 리간드 결합 경쟁과 달리 기본 활성도 감소시킨다.'),
  claim('Chlorpheniramine은 H1 차단 작용으로 가려움·팽진을 줄인다.','Chlorpheniramine은 H3 차단 작용으로 가려움·팽진을 줄인다.','족보의 H3 연결은 잘못된 선지이며 chlorpheniramine은 H1 약물이다.'),
  claim('Cromolyn은 비만세포 매개체 유리를 억제하는 전략에 해당한다.','Cromolyn은 양성자펌프의 K⁺ 부위 경쟁으로 histamine 유리를 억제한다.','비만세포 안정화와 P-CAB의 작용점을 구별한다.'),
  claim('Epinephrine은 혈관수축·기관지 확장으로 histamine 효과에 생리적으로 길항한다.','Epinephrine은 H1 수용체에 직접 결합하는 역작용제이다.','Epinephrine은 아드레날린성 수용체를 통해 반대 방향의 효과를 낸다.'),
  claim('H1 차단제만으로 아나필락시스의 저혈압·기도 문제를 충분히 해결할 수 없다.','H1 차단제만으로 아나필락시스의 저혈압·기도 문제를 충분히 해결할 수 있다.','H1 차단제는 보조이고 epinephrine을 대체하지 못한다.')
 ]),
 topic('generation-properties','H1 항히스타민제','1세대와 2세대 H1 항히스타민제의 뇌 이행과 부작용을 비교하였다.','BBB 통과와 항무스카린 작용은 1세대에서 더 두드러진다.','16','족보 2025 #56 · 2021 #35 · 2020 #37 · 2019 #89: 졸림',[
  claim('1세대는 BBB를 통과하여 진정과 인지 저하를 일으키기 쉽다.','1세대는 BBB를 거의 통과하지 않아 진정과 인지 저하가 드물다.','지용성이 높고 중추 H1을 차단하여 졸림을 유발한다.'),
  claim('2세대는 낮은 뇌 이행과 P-gp 배출로 진정 작용이 대체로 적다.','2세대는 높은 뇌 이행과 P-gp 억제로 1세대보다 진정 작용이 강하다.','강의는 낮은 지용성·P-gp 기질 특성을 뇌 배출과 연결한다.'),
  claim('Cetirizine은 2세대지만 약간의 졸림이 생길 수 있다.','Cetirizine은 2세대이므로 졸림이 생길 가능성이 없다.','2세대 전체를 완전 비진정성으로 단정하지 않는다.'),
  claim('1세대는 항무스카린 작용으로 입마름·요저류·변비를 유발할 수 있다.','2세대는 1세대보다 강한 항무스카린 작용으로 입마름·요저류·변비를 유발한다.','2세대의 항콜린 작용은 거의 없고 1세대에서 두드러진다.'),
  claim('2세대는 대체로 작용시간이 길어 1일 1회 복용이 가능하다.','2세대는 대체로 작용시간이 짧아 1세대보다 자주 복용한다.','강의상 대체로 12–24시간이다. 모든 약물의 지속시간을 동일하게 단정하지 않는다.')
 ]),
 topic('sedation-case','H1 항히스타민제','알레르기 비염으로 chlorpheniramine을 복용한 환자가 주간 졸림과 업무 집중 저하를 호소하였다.','약물이 BBB를 통과하는지 비교한다.','15–16','족보 2025 #56 · 2020 #37 · 2019 #89: chlorpheniramine 사례',[
  claim('Chlorpheniramine의 중추 H1 차단은 졸림을 설명할 수 있다.','Chlorpheniramine의 중추 H3 활성화만이 졸림을 설명하는 기전이다.','1세대 H1 차단제의 BBB 통과가 이 사례의 핵심이다.'),
  claim('Diphenhydramine으로 바꾸어도 진정 부작용이 나타날 수 있다.','Diphenhydramine으로 바꾸면 2세대이므로 진정 부작용을 피할 수 있다.','Diphenhydramine도 1세대 H1 차단제이다.'),
  claim('Fexofenadine은 진정이 적은 2세대 H1 차단제이다.','Fexofenadine은 진정이 강한 1세대 H1 차단제이다.','족보에서 졸림 감소와 연결되는 대표 약물이다.'),
  claim('이 환자의 졸림을 벽세포 H2 차단의 주된 효과로 설명하지 않는다.','이 환자의 졸림은 벽세포 H2 차단의 주된 효과이다.','위산 분비 억제와 중추 진정을 분리한다.'),
  claim('Loratadine은 chlorpheniramine과 세대가 다른 H1 차단제이다.','Loratadine은 chlorpheniramine과 같은 1세대 H1 차단제이다.','Loratadine은 2세대이며 구조가 다르더라도 H1 표적은 공통이다.')
 ],true),
 topic('antimuscarinic-case','H1 항히스타민제','전립선비대가 있는 고령자가 diphenhydramine 복용 후 입마름과 배뇨 곤란을 호소하였다.','진정 외의 항무스카린 부작용도 확인한다.','15–16','족보 2023 #22: H1 차단제 부작용을 사례로 확장',[
  claim('입마름과 요저류는 1세대 약물의 항무스카린 작용으로 설명할 수 있다.','입마름과 요저류는 벽세포 H2 수용체 활성화의 전형적 효과이다.','H1 선택성 외에 동반되는 항무스카린 작용이 원인이다.'),
  claim('이 약물은 변비를 유발할 수도 있다.','이 약물의 항무스카린 작용은 장운동을 촉진하여 변비를 예방한다.','무스카린 차단은 장운동을 줄여 변비에 기여할 수 있다.'),
  claim('고령자에서는 진정·인지 저하와 항콜린 부작용을 함께 고려한다.','고령자에서는 1세대의 항콜린 부작용을 고려할 필요가 없다.','강의는 고령자에서 1세대의 부담을 강조한다.'),
  claim('2세대 H1 차단제는 항무스카린 작용이 대체로 적다.','2세대 H1 차단제는 항무스카린 작용이 대체로 더 강하다.','세대 구분은 중추 및 항콜린 부작용의 차이와 연결한다.'),
  claim('Cyproheptadine은 5-HT2A 차단을 동반하며 식욕 증가와 연결된다.','Cyproheptadine은 5-HT2A 자극을 동반하며 식욕 감소와 연결된다.','강의는 cyproheptadine의 세로토닌 길항과 식욕 증가를 함께 제시한다.')
 ],true),
 topic('urticaria-case','H1 항히스타민제','음식 섭취 후 가려운 팽진이 생겼지만 호흡곤란·인후두부종·저혈압은 없는 환자가 내원하였다.','단순 두드러기와 아나필락시스를 구별한다.','5, 17–18','족보 2023 #22 · 2021 #35: 음식 후 팽진·가려움 사례',[
  claim('2세대 H1 차단제는 이와 같은 두드러기 증상 완화에 사용된다.','H2 작용제는 이와 같은 두드러기 증상 완화의 우선 약물이다.','강의 증례의 초점은 H1 매개 가려움·팽진에 대한 2세대 H1 차단이다.'),
  claim('Fexofenadine은 진정 부담이 적은 H1 차단제 선택지이다.','Fexofenadine은 H2 수용체를 자극하여 팽진을 없애는 약물이다.','Fexofenadine은 2세대 H1 차단제이다.'),
  claim('팽진은 피부 혈관의 투과성 증가로 액체가 조직으로 이동한 결과이다.','팽진은 피부 혈관의 투과성 감소로 액체가 혈관 안에만 머문 결과이다.','Histamine–H1과 혈관 투과성 증가를 연결한다.'),
  claim('만성두드러기에서 H1 차단 반응이 부족하면 강의의 다음 단계에 omalizumab이 제시된다.','만성두드러기에서 H1 차단 반응이 부족하면 강의의 다음 단계에 H2 작용제가 제시된다.','강의 단계는 2세대 표준용량 → 증량 → 항IgE 항체 omalizumab → cyclosporine이다.'),
  claim('Omalizumab의 표적은 IgE이다.','Omalizumab의 표적은 양성자펌프의 K⁺ 결합 부위이다.','항IgE 항체와 위산 억제 약물을 구별한다.')
 ],true),
 topic('anaphylaxis-case','H1 항히스타민제','음식 섭취 후 전신 팽진에 더해 저혈압과 호흡곤란이 동반된 환자의 약물 선택을 검토하였다.','Epinephrine의 역할과 H1 차단제의 한계를 구별한다.','14, 17','족보의 팽진 사례를 강의의 아나필락시스 감별로 확장',[
  claim('강의에서 이 상황의 1차 약물은 근주 epinephrine이다.','강의에서 이 상황의 1차 약물은 경구 H1 차단제 단독이다.','저혈압·기도 문제가 동반된 아나필락시스에서 항히스타민제는 보조이다.'),
  claim('Epinephrine의 혈관수축은 저혈압 교정에 기여한다.','Epinephrine의 혈관확장은 저혈압 교정에 기여한다.','α 아드레날린성 혈관수축을 histamine의 혈관확장과 대비한다.'),
  claim('Epinephrine은 기관지 확장에도 기여한다.','Epinephrine은 기관지 수축을 일으켜 호흡곤란을 완화한다.','기관지 확장은 β2 작용과 연결된다.'),
  claim('H1 차단제는 가려움·팽진을 줄이는 보조 약물이다.','H1 차단제는 epinephrine보다 신속하게 쇼크의 모든 원인을 해결한다.','피부 증상 호전이 저혈압·기도 문제의 충분한 치료를 의미하지 않는다.'),
  claim('Histamine 대량 유리는 혈관확장과 투과성 증가로 혈압을 떨어뜨릴 수 있다.','Histamine 대량 유리는 혈관수축과 투과성 감소로 혈압을 떨어뜨린다.','혈관확장과 혈장 유출이 유효 순환혈액량을 감소시킨다.')
 ],true),
 topic('rhinitis-case','H1 항히스타민제','알레르기 비염 환자에게 2세대 H1 차단제를 투여한 뒤 콧물·가려움은 줄었으나 코막힘이 남았다.','증상마다 관여하는 매개체가 다를 수 있다.','6, 14, 17','족보 2025 #56: 비염의 H1 약물 사례를 증상별 기전으로 확장',[
  claim('H1 차단은 콧물·가려움에 효과적일 수 있다.','H1 차단은 콧물·가려움을 악화시키는 것이 주된 약효이다.','Histamine 매개 증상의 감소가 H1 차단 효과이다.'),
  claim('코막힘에는 여러 염증매개체와 점막 염증이 관여한다.','코막힘에는 histamine만 관여하므로 다른 염증 기전은 고려하지 않는다.','강의 증례는 H1 차단만으로 부족한 코막힘과 비강 스테로이드를 연결한다.'),
  claim('강의는 남은 코막힘에 비강 스테로이드의 역할을 제시한다.','강의는 남은 코막힘에 H2 작용제의 역할을 제시한다.','점막 염증 조절과 위산 분비 자극을 구별한다.'),
  claim('2세대 H1 차단제는 1세대보다 주간 진정 부담이 대체로 적다.','2세대 H1 차단제는 1세대보다 주간 진정 부담이 대체로 크다.','낮은 뇌 이행이 약물 선택의 근거이다.'),
  claim('알레르기 증상 완화를 감기 자체의 치료 효과와 동일시하지 않는다.','알레르기 증상 완화는 감기 원인 자체를 제거한다는 뜻이다.','강의는 항히스타민제의 알레르기 적응증과 감기 자체에 대한 효과를 구별한다.')
 ],true),
 topic('h1-other-uses','H1 항히스타민제','H1 차단제의 알레르기 이외 용도를 약물 이름과 연결하였다.','진정·항구토 효과가 용도와 부작용을 함께 만든다.','15–17','족보 2023 #22의 부작용 유형을 강의 적응증과 연결',[
  claim('Diphenhydramine과 doxylamine의 진정 효과는 일반의약품 불면 용도와 연결된다.','Fexofenadine의 강한 진정 효과는 일반의약품 불면 용도와 연결된다.','강의는 불면 용도에 1세대 약물을 제시하며 내성·숙취와 고령자 회피를 함께 다룬다.'),
  claim('Doxylamine과 pyridoxine 병용은 입덧 치료와 연결된다.','Doxylamine과 pyridoxine 병용은 위산 분비 촉진과 연결된다.','강의의 입덧 조합을 H2·위산 경로와 혼동하지 않는다.'),
  claim('Promethazine은 멀미·어지럼에 쓰이는 약물로 제시된다.','Promethazine은 양성자펌프를 비가역적으로 차단하는 약물로 제시된다.','Promethazine은 1세대 H1 약물이며 PPI가 아니다.'),
  claim('Olopatadine 점안은 알레르기 결막염과 연결된다.','Olopatadine 점안은 기면증의 각성 치료와 연결된다.','기면증의 H3 약물은 pitolisant이다.'),
  claim('1세대의 진정 효과를 이용하더라도 다음날 숙취·인지 저하가 문제가 될 수 있다.','1세대의 진정 효과를 이용하면 다음날 인지 저하는 고려할 필요가 없다.','약효로 이용하는 효과가 동시에 불편한 부작용일 수 있다.')
 ]),
 topic('gastric-pathway','위산 분비·억제제','Gastrin 자극 이후 ECL 세포와 벽세포 사이의 histamine 신호를 추적하였다.','분비 세포와 수용체가 있는 세포를 구별한다.','21','족보 2023 #21 · 2022 #74 · 2021 #37 · 2020 #38: ECL–벽세포',[
  claim('Gastrin은 ECL 세포를 자극하여 histamine 유리를 촉진한다.','Gastrin은 ECL 세포의 histamine 유리를 억제하여 위산을 증가시킨다.','Gastrin → ECL → histamine의 방향을 연결한다.'),
  claim('ECL 세포에서 나온 histamine은 벽세포의 H2 수용체를 자극한다.','ECL 세포에서 나온 histamine은 벽세포의 H3 수용체를 자극한다.','위산 분비의 histamine 수용체는 H2이다.'),
  claim('벽세포 H2 수용체는 Gs–cAMP 신호와 연결된다.','벽세포 H2 수용체는 Gi–cAMP 감소 신호와 연결된다.','수용체 신호와 산 분비 방향을 함께 묻는다.'),
  claim('벽세포의 H⁺/K⁺-ATPase는 위산 분비의 최종 공통 경로이다.','ECL 세포의 FcεRI는 위산 분비의 최종 공통 경로이다.','FcεRI는 IgE 반응의 수용체이며 양성자펌프와 다르다.'),
  claim('H2 차단은 histamine을 거치는 gastrin·미주신경 자극성 산 분비도 줄일 수 있다.','H2 차단은 gastrin·미주신경 자극성 산 분비를 전혀 줄일 수 없다.','강의는 gastrin·ACh 자극의 상당 부분이 ECL histamine을 거친다고 설명한다.')
 ]),
 topic('h2-blockers','위산 분비·억제제','Cimetidine과 famotidine 등의 위산 분비 억제 기전을 비교하였다.','H2 차단제의 표적은 벽세포 수용체이다.','21–22','족보 2021 #37 · 2020 #38 · 2019 #90: H2 차단제 선택',[
  claim('Cimetidine은 벽세포 H2 수용체 차단으로 위산 분비를 억제한다.','Cimetidine은 ECL 세포 H1 수용체 자극으로 위산 분비를 억제한다.','수용체와 세포 위치를 함께 연결한다.'),
  claim('Famotidine은 H2 차단제로 분류한다.','Famotidine은 P-CAB으로 분류한다.','-tidine 계열 H2 차단제와 -prazan 계열 P-CAB을 구별한다.'),
  claim('Nizatidine과 lafutidine도 H2 차단제이다.','Nizatidine과 lafutidine은 H2 작용제로 산 분비를 촉진한다.','족보에서 nizatidine은 ECL–벽세포 histamine 작용을 억제하는 약물이다.'),
  claim('H2 차단제는 야간 산 분비 억제에 유리하다.','H2 차단제는 산성 환경에서만 활성화되는 공유결합 전구약이다.','산 활성화 전구약 특징은 PPI에 해당한다.'),
  claim('H2 차단제는 수일 내 내성 현상이 나타날 수 있다.','H2 차단제는 수일 내 내성 현상이 나타나지 않는 것이 특징이다.','강의 표는 H2RA의 tachyphylaxis를 PPI·P-CAB과 구별한다.')
 ]),
 topic('cimetidine-safety','위산 분비·억제제','위산 억제제의 상호작용과 부작용을 구분하였다.','Cimetidine의 CYP 억제와 항안드로겐 작용을 기억한다.','22','족보의 반복 약물 cimetidine을 올해 강의 세부 특징과 연결',[
  claim('Cimetidine은 CYP 억제로 약물 상호작용을 일으킬 수 있다.','Cimetidine은 CYP 유도가 대표적이므로 병용약 대사를 촉진한다.','강의 표에서 cimetidine의 특징은 CYP 억제이다.'),
  claim('Cimetidine의 항안드로겐 작용은 여성형유방과 연결된다.','Cimetidine의 안드로겐 작용 증가는 여성형유방과 연결된다.','항안드로겐 작용의 방향을 뒤집지 않는다.'),
  claim('Ranitidine은 강의에서 NDMA 검출로 철수한 과거 H2 차단제로 다룬다.','Ranitidine은 강의에서 NDMA 검출과 무관한 PPI로 다룬다.','첨부 이미지에도 과거 약물로 표시되어 있다. 분류 학습과 현재 처방 판단은 구별한다.'),
  claim('H2 차단제는 분비된 산을 직접 중화하는 제산제와 작용점이 다르다.','H2 차단제는 위 내강에서 분비된 산을 직접 중화하는 약물이다.','H2RA는 산 분비 신호를 억제하고 제산제는 이미 나온 산을 중화한다.'),
  claim('H2 차단제는 양성자펌프의 K⁺ 부위를 직접 경쟁하는 약물과 구별한다.','H2 차단제는 양성자펌프의 K⁺ 부위를 직접 경쟁하는 약물이다.','K⁺ 부위 경쟁은 P-CAB, H2 수용체 차단은 H2RA이다.')
 ]),
 topic('ppi','위산 분비·억제제','Omeprazole 계열의 활성화·결합·복용 시점을 위산 억제 기전과 연결하였다.','PPI는 산 활성화 후 펌프에 비가역적 공유결합한다.','21–22','족보 위산 분비 억제 유형을 첨부 PPI 표로 확장',[
  claim('Omeprazole은 PPI로 분류한다.','Omeprazole은 H2 수용체 차단제로 분류한다.','PPI는 양성자펌프를 표적으로 하며 항히스타민제가 아니다.'),
  claim('PPI는 양성자펌프에 비가역적 공유결합을 형성한다.','PPI는 양성자펌프의 K⁺ 부위에서 가역적으로 경쟁한다.','가역적 K⁺ 경쟁은 P-CAB의 특징이다.'),
  claim('PPI는 산성 환경에서 활성화되는 전구약이다.','PPI는 산성 환경에서의 활성화가 필요 없는 것이 특징이다.','강의는 산 활성화 필요 여부로 PPI와 P-CAB을 구별한다.'),
  claim('강의 표에서 PPI는 식전 30–60분 복용과 연결된다.','강의 표에서 PPI는 식사와 무관하게 복용하는 것이 핵심 특징이다.','식사와 무관·빠른 작용은 P-CAB 쪽에 제시되어 있다.'),
  claim('Esomeprazole·lansoprazole·pantoprazole은 PPI이다.','Esomeprazole·lansoprazole·pantoprazole은 P-CAB이다.','첨부 표의 -prazole 약물을 -prazan 계열과 구별한다.')
 ]),
 topic('pcab','위산 분비·억제제','Tegoprazan·fexuprazan·vonoprazan의 위산 억제 방식을 PPI와 비교하였다.','P-CAB의 K⁺ 경쟁은 가역적이다.','21–22','족보 위산 억제 유형 + 첨부 P-CAB 표의 기전 비교',[
  claim('P-CAB은 양성자펌프의 K⁺ 부위에서 가역적으로 경쟁한다.','P-CAB은 양성자펌프에 비가역적 공유결합을 형성한다.','비가역적 공유결합은 PPI의 특징이다.'),
  claim('Tegoprazan은 P-CAB으로 분류한다.','Tegoprazan은 H2 수용체 차단제로 분류한다.','산 분비의 최종 펌프를 표적으로 하며 항히스타민제가 아니다.'),
  claim('Fexuprazan과 vonoprazan도 P-CAB이다.','Fexuprazan과 vonoprazan은 PPI이다.','첨부 표에서 세 -prazan 약물은 같은 분류이다.'),
  claim('P-CAB은 산성 환경에서의 활성화가 필요 없다.','P-CAB은 산성 환경에서 전구약 활성화가 필수이다.','산 활성화 전구약은 PPI와 연결한다.'),
  claim('강의는 P-CAB을 식사와 무관하고 작용이 빠른 약물로 설명한다.','강의는 P-CAB을 식전 30–60분의 산 활성화가 필수인 약물로 설명한다.','강의의 PPI와 P-CAB 비교 표에 따른 구별이다.')
 ]),
 topic('acid-comparison','위산 분비·억제제','Histamine 신호를 차단하는 약물과 양성자펌프를 차단하는 약물을 구분하였다.','같은 산 분비 감소라도 표적과 결합 방식은 다르다.','21–22','족보 2019 #90의 억제 약물 구분 + 첨부 위산 억제제 표',[
  claim('Famotidine은 수용체 단계에서 histamine의 산 분비 신호를 차단한다.','Famotidine은 펌프 단계에서 비가역적 공유결합을 형성한다.','H2RA와 PPI는 모두 산을 줄이지만 표적이 다르다.'),
  claim('Omeprazole은 histamine 수용체가 아니라 양성자펌프에 작용한다.','Omeprazole은 양성자펌프가 아니라 histamine 수용체에 작용한다.','첨부 이미지의 PPI는 antihistamine이 아니라는 메모와 연결한다.'),
  claim('Tegoprazan은 펌프의 K⁺ 부위 경쟁으로 산 분비를 억제한다.','Tegoprazan은 ECL 세포에서 histamine 합성을 억제하여 산 분비를 억제한다.','P-CAB의 직접 표적은 벽세포의 양성자펌프이다.'),
  claim('제산제는 이미 분비된 위산을 중화하는 방식이다.','제산제는 벽세포 H2 수용체에 경쟁적으로 결합하는 방식이다.','분비 억제와 분비 후 중화를 구별한다.'),
  claim('PPI와 P-CAB은 위산 분비의 최종 공통 경로를 억제한다.','PPI와 P-CAB은 위산 분비의 최종 공통 경로를 자극한다.','H⁺/K⁺-ATPase를 막아 산 분비를 줄인다.')
 ]),
 topic('ace-bradykinin-case','브라디키닌·혈관부종','ACE 억제제 복용 후 마른기침과 혈관부종이 생길 수 있는 이유를 검토하였다.','Bradykinin 분해 감소와 histamine 유리를 구별한다.','23–24','올해 강의·정리본 보충: ACE와 bradykinin 분해',[
  claim('ACE는 bradykinin 분해에 관여한다.','ACE는 bradykinin을 kininogen에서 생성하는 주 효소이다.','생성 쪽은 kallikrein, 분해 쪽은 ACE와 연결한다.'),
  claim('ACE 억제는 bradykinin 분해를 줄여 농도를 높일 수 있다.','ACE 억제는 bradykinin 분해를 늘려 농도를 낮춘다.','분해 효소의 억제는 기질 축적과 연결된다.'),
  claim('Bradykinin 증가는 마른기침·혈관부종과 연결된다.','Bradykinin 증가는 위산 분비 억제로만 나타나며 기침과 무관하다.','강의는 ACE 억제제 부작용을 bradykinin으로 연결한다.'),
  claim('Bradykinin은 혈관확장과 투과성 증가를 유발할 수 있다.','Bradykinin은 혈관수축과 투과성 감소로 부종을 유발한다.','Histamine과 비슷한 부종 양상을 보이더라도 매개체는 다르다.'),
  claim('Plasma kallikrein은 kininogen에서 bradykinin을 생성하는 경로에 관여한다.','Plasma kallikrein은 bradykinin을 분해하여 불활성화하는 주 효소이다.','Kallikrein–kinin 생성 경로와 ACE 분해 경로의 방향을 구별한다.')
 ],true),
 topic('hae-case','브라디키닌·혈관부종','C1-INH 결핍에 의한 유전성혈관부종 환자에서 표적 치료 약물을 검토하였다.','Histamine 비의존 부종은 다른 표적을 필요로 한다.','23–24','올해 강의·정리본 보충: C1-INH와 유전성혈관부종',[
  claim('C1-INH 결핍은 kallikrein 과활성과 bradykinin 과다를 유발한다.','C1-INH 결핍은 H1 수용체의 histamine 결합만 선택적으로 증가시킨다.','C1-INH가 억제하는 접촉계의 과활성이 bradykinin 증가로 이어진다.'),
  claim('이 형태의 부종은 histamine 비의존성이므로 H1 차단제의 효과를 기대하기 어렵다.','이 형태의 부종은 histamine 의존성이므로 H1 차단제 단독이 표적 치료이다.','겉으로 부어 보인다는 이유만으로 모든 부종을 histamine으로 묶지 않는다.'),
  claim('C1-INH 보충은 결핍된 억제 인자를 제공하는 치료이다.','C1-INH 보충은 H2 수용체를 자극하여 부종을 줄이는 치료이다.','정리본의 C1-INH 보충과 강의 표의 보충 요법이 일치한다.'),
  claim('Icatibant는 bradykinin B2 수용체를 차단한다.','Icatibant는 histamine H1 수용체를 차단한다.','B2 수용체 차단과 항히스타민제의 표적을 구별한다.'),
  claim('Ecallantide는 plasma kallikrein을 억제한다.','Ecallantide는 bradykinin 분해 효소 ACE를 억제한다.','생성 억제와 분해 억제는 bradykinin 양에 반대 영향을 줄 수 있다.')
 ],true),
 topic('drug-generations','H1 항히스타민제','첨부 표에 나온 H1 차단제의 성분명과 세대 분류를 대응시켰다.','제품명 대신 성분명으로 1·2세대를 구분한다.','15–16','족보 2025 #56 · 2021 #35 · 2019 #89: 대표 H1 약물 분류',[
  claim('Diphenhydramine·chlorpheniramine은 1세대 H1 차단제이다.','Diphenhydramine·chlorpheniramine은 2세대 H1 차단제이다.','족보에서 반복되는 진정성 약물 두 가지이다.'),
  claim('Hydroxyzine·promethazine·doxylamine은 1세대 H1 차단제이다.','Hydroxyzine·promethazine·doxylamine은 2세대 H1 차단제이다.','첨부 1세대 표의 세 약물이다.'),
  claim('Cetirizine·levocetirizine은 2세대 H1 차단제이다.','Cetirizine·levocetirizine은 1세대 H1 차단제이다.','Cetirizine의 졸림 가능성이 세대 분류를 바꾸지는 않는다.'),
  claim('Loratadine·desloratadine은 2세대 H1 차단제이다.','Loratadine·desloratadine은 1세대 H1 차단제이다.','첨부 2세대 표와 정리본에 제시된 성분명이다.'),
  claim('Fexofenadine·rupatadine은 2세대 H1 차단제이다.','Fexofenadine·rupatadine은 H2 차단제이다.','H1 2세대 분류를 위산 분비 억제 H2 차단제와 구별한다.')
 ])
];
export const HIST_QUESTIONS=buildUnderstandingBank('histamine',HIST_CASES);
const cards=(names,category,note,source)=>names.map(name=>({id:name.toLowerCase(),name,categories:[category],note,source}));
export const HIST_H1_CARDS=[
 ...cards(['Diphenhydramine','Chlorpheniramine','Hydroxyzine','Promethazine','Doxylamine'],'1세대 H1 차단제','1세대 H1 차단제: BBB 통과에 따른 진정과 항무스카린 부작용에 주의한다.','첨부 1·2세대 표 · 21강 v2 16쪽'),
 ...cards(['Cetirizine','Levocetirizine','Loratadine','Desloratadine','Fexofenadine','Rupatadine'],'2세대 H1 차단제','2세대 H1 차단제: 뇌 이행·진정과 항무스카린 작용이 대체로 적다. Cetirizine은 졸림이 가능하다.','첨부 1·2세대 표 · 21강 v2 16쪽')
];
export const HIST_ACID_CARDS=[
 ...cards(['Ranitidine','Famotidine','Cimetidine','Nizatidine','Lafutidine'],'H2 차단제','벽세포 H2 수용체를 경쟁적으로 차단한다. Ranitidine은 강의에서 다룬 과거 약물이며 NDMA 관련 철수 이력이 표시되어 있다.','첨부 위산 억제제 표 · 21강 v2 22쪽'),
 ...cards(['Omeprazole','Esomeprazole','Lansoprazole','Pantoprazole'],'PPI','양성자펌프에 비가역적 공유결합을 형성한다. 산성 환경에서 활성화되는 전구약이며 항히스타민제가 아니다.','첨부 위산 억제제 표 · 21강 v2 22쪽'),
 ...cards(['Tegoprazan','Fexuprazan','Vonoprazan'],'P-CAB','양성자펌프의 K⁺ 부위에서 가역적으로 경쟁한다. 산 활성화가 불필요하며 항히스타민제가 아니다.','첨부 위산 억제제 표 · 21강 v2 22쪽')
];
export function pickHistamineQuestion(state={},polarity='all',area='all',random=Math.random){
 const subjects=new Set(HIST_CASES.filter(c=>area==='all'||(area==='clinical'?c.clinical:c.group===area)).map(c=>c.id));
 let bank=HIST_QUESTIONS.filter(q=>subjects.has(q.subject));
 if(polarity!=='all')bank=bank.filter(q=>q.polarity===polarity);
 else{const next=state.lastPolarity==='correct'?'incorrect':'correct',subset=bank.filter(q=>q.polarity===next);if(subset.length)bank=subset;}
 if(!bank.length)return null;
 let pool=bank.filter(q=>!(state.recent||[]).includes(q.id)&&!(state.subjects||[]).includes(q.subject));
 if(!pool.length)pool=bank.filter(q=>!(state.recent||[]).includes(q.id));if(!pool.length)pool=bank;
 const count=q=>Number(state.seen?.[q.id])||0,min=Math.min(...pool.map(count)),least=pool.filter(q=>count(q)===min),q=least[Math.floor(random()*least.length)];
 const choices=q.options.map(text=>({text}));for(let i=4;i>0;i--){const j=Math.floor(random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
 return {...q,choices,answerIndex:choices.findIndex(c=>c.text===q.answer)};
}
