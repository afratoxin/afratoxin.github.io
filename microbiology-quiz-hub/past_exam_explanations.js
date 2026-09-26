(() => {
  'use strict';

  const explanations = {};
  const add = (ids, why, contrast = '', caution = '', options = {}) => {
    ids.trim().split(/\s+/).forEach((id) => { explanations[id] = { why, contrast, caution, options }; });
  };

  // 1강 · 미생물학의 역사
  add('1-2025-1', 'Koch의 가설은 원인균을 순수배양하고 동물에 접종해 같은 질병을 재현한다는 전제를 둔다. 무증상 보균, 하나의 증상을 만드는 여러 병원체, 사람에게만 생기는 감염, 배양 불가능한 병원체는 이 전제를 깨므로 1·2·3·4가 모두 한계다.', 'Toxoid는 독소를 불활성화한 백신 항원이지 원인균을 판정하는 방법이 아니다.');
  add('1-2025-2', '미생물은 크기를 중심으로 묶은 집단이라 세균·진균·원충뿐 아니라 독립 대사능이 없는 바이러스도 함께 다룬다. 따라서 모든 미생물이 독립적인 기관과 대사능을 가진다는 3번은 성립하지 않는다.', '세포성 미생물과 비세포성 감염체를 한 문장으로 일반화하면 틀리기 쉽다.');
  add('1-2025-3', 'Animalcules는 Leeuwenhoek가 현미경으로 관찰한 작은 생물을 부른 표현이다. Pasteur의 업적은 자연발생설 부정, 발효의 미생물설, 저온살균법, 탄저·광견병 백신이므로 5번이 틀렸다.', '사람 이름과 업적을 외울 때 Pasteur와 Leeuwenhoek를 분리해야 한다.');
  add('1-2025-4', '미토콘드리아는 산소호흡을 하던 그람음성 세균 계통, 특히 α-proteobacteria가 원시 진핵세포 안에 공생하면서 생긴 것으로 설명한다. 이중막과 독자 DNA·리보솜이 근거다.', 'Archaea는 진핵세포의 숙주 계통과 연관되지만 미토콘드리아 자체의 기원은 아니다.');
  add('1-2023-1', 'Waksman 연구진은 토양 방선균 Streptomyces griseus에서 streptomycin을 발견했고 결핵 치료에 기여해 노벨상을 받았다.', 'von Behring은 디프테리아 항독소, Gajdusek은 kuru, Rice는 HCV, Prusiner는 prion 연구와 연결된다.');
  add('1-2023-2', '1번은 사람의 콜레라 백신과 닭 콜레라 백신을 혼동한 문장이다. Pasteur가 개발한 것은 chicken cholera 약독화 백신이다. 3번도 틀렸는데 산욕열 예방을 위한 손 씻기는 Semmelweis, 수술 소독법은 Lister의 업적이다.', 'Bassi는 누에병의 진균 원인을 밝혔고 Koch는 결핵균을 규명했다.');
  add('1-2023-3', '조류·진균·고세균은 세포벽을 가지지만 원충은 일반적으로 세포벽이 없는 진핵 단세포 생물이다. 따라서 가·나·라가 맞다.', '세포벽 조성은 서로 다르다. 조류와 진균은 진핵생물이고 고세균은 원핵생물이지만 모두 세포막 바깥의 벽 구조를 가질 수 있다.');
  add('1-2023-4 1-2021-24', '재출현 감염병은 과거에 감소했다가 다시 증가하는 질환이다. 결핵·콜레라·백일해는 약제내성, 예방접종률 변화, 공중보건 여건 변화 등으로 다시 문제가 되어 이 범주에 들어간다.', '완전히 새로 발견되거나 새 지역·숙주에서 나타난 질환은 emerging disease로 구분한다.');
  add('1-2022-1', 'Influenza는 오래전부터 사람에서 반복 유행해 온 감염병이므로 그 자체를 신종감염병으로 분류하지 않는다. 다만 새로운 아형이 출현하면 신종 또는 대유행 상황이 될 수 있다.', '질병명 자체와 새로운 strain의 출현을 구분해야 한다.');
  add('1-2022-2', 'John Snow는 1854년 런던 Broad Street 콜레라 유행을 지도화하고 오염된 펌프 물을 원인으로 추적했다. 강의록의 범유행 구분에서는 제3차 콜레라 대유행 시기에 해당한다.', 'Snow의 핵심 공헌은 병원체 배양이 아니라 역학적 분포와 공통 노출원을 이용한 감염원 추적이다.');
  add('1-2022-3 1-2021-27', 'Marshall과 Warren은 Helicobacter pylori와 소화성 궤양의 연관성을 밝힌 세균학 연구자이므로 바이러스 연구 노벨상 수상자에 해당하지 않는다.', '이 문항은 연도별로 Marshall 또는 Warren을 오답 선지로 사용했지만 두 사람은 같은 H. pylori 연구로 공동 수상했다.');
  add('1-2022-4', 'Bassi는 누에의 muscardine disease가 곰팡이 Beauveria bassiana에 의해 생긴다는 것을 보여 감염병의 미생물 원인설에 기여했다.', 'Pasteur도 누에병을 연구했지만 Bassi의 핵심 업적은 누에병 원인 진균의 규명이다.');
  add('1-2021-25', 'Woese는 16S rRNA 염기서열 비교를 통해 고세균이 세균과 구별되는 계통임을 제시하고 Bacteria·Archaea·Eukarya의 three-domain 체계를 확립했다.', '형태나 염색만으로는 고세균과 세균의 깊은 계통 차이를 밝히기 어렵다.');
  add('1-2021-26', 'Pasteur의 백조목 플라스크 실험은 공기 자체가 생명을 만드는 것이 아니라 공기 중 미생물이 배지에 들어와 증식한다는 것을 보여 자연발생설을 부정했다.', '순수배양법과 Koch의 가설은 Koch, 최초 현미경 관찰은 Leeuwenhoek의 업적이다.');
  add('1-2021-28', 'Nicolle은 발진티푸스가 이를 통해 전파된다는 사실과 감염병 연구로 노벨상을 받았다. 항생제 발견·개발 연구의 수상자와는 구분된다.', '항생제 관련 대표 연결은 Fleming·Chain·Florey-penicillin, Waksman-streptomycin이다.');
  add('1-2020-27', '강의록 분류에서 dengue는 발생 지역과 환자 규모가 확대된 emerging infectious disease의 예로 제시된다.', '신종감염병은 병원체가 완전히 새것이라는 뜻만이 아니라 기존 질환의 지리적·역학적 확장도 포함할 수 있다.');
  add('1-2020-28', '수록 답안은 Koch를 선택하지만 Koch는 탄저·결핵의 원인균을 분리하고 Koch의 가설을 세운 germ theory의 핵심 인물이다. 문항 또는 답안 복원에 오류가 있을 가능성이 높다.', 'Bassi·Semmelweis·Pasteur·Lister도 각각 감염의 미생물 원인, 손 위생, 자연발생설 부정, 소독법을 통해 germ theory 형성에 기여했다.', '이 문항은 답안 그대로 암기하지 말고 복원 오류 문항으로 보는 것이 안전하다.');
  add('1-2020-29', 'Koch는 Bacillus anthracis를 분리하고 배양·동물 재감염을 통해 탄저병의 원인임을 입증했다. 이 과정이 Koch의 가설의 토대가 되었다.', '자연발생설 부정과 백신 개발은 Pasteur의 대표 업적이다.');
  add('1-2020-30', 'Harald zur Hausen은 HPV와 자궁경부암의 연관성을 밝힌 연구자다. HIV 발견은 Barré-Sinoussi와 Montagnier의 업적이므로 Hausen-HIV 연결은 틀렸다.', '바이러스 이름만 맞아 보여도 연구 대상 질환과 수상 업적을 함께 확인해야 한다.');

  // 2강 · 세균의 분류 및 동정
  add('2-2025-5 2-2023-9', '진핵세포는 감수분열과 crossing over를 통해 부모 유래 염색체를 재조합하므로 ㄴ·ㄹ이 원핵세포와 비교되는 대표적 다양성 증가 기전이다.', 'Mutation은 원핵·진핵 모두에서 일어나며 lateral gene transfer는 세균에서 특히 중요한 다양성 획득 기전이다.');
  add('2-2025-6 2-2023-7 2-2022-5 2-2021-29 2-2020-32', '시계분자는 여러 생물에 널리 존재하고 기능이 보존되어 있으며 변화 속도가 너무 빠르지 않아야 한다. 16S rRNA와 전사·번역에 관여하는 보존 유전자/RNA polymerase는 계통 비교에 적합하다.', '항생제 내성·PBP·플라스미드·용원성 파지 유전자는 선택압과 수평전달의 영향을 크게 받아 장기 계통을 재는 시계로 부적절하다.');
  add('2-2025-7 2-2021-31 2-2020-34', 'Strain은 한 분리주에서 유래해 같은 특성을 공유하는 세균 집단으로, 실제 배양·실험에서 사용하는 최소 개체 단위다.', 'Subspecies는 명명학적 지위를 갖는 최소 분류단위이고 strain은 그보다 아래의 실험·역학적 단위다.');
  add('2-2025-8 2-2022-7 2-2020-31', '이명법은 속명을 대문자, 종명을 소문자로 시작하고 둘 다 이탤릭체로 쓴다. 처음 전체 이름을 쓴 뒤에는 Mycobacterium tuberculosis를 M. tuberculosis처럼 줄일 수 있다.', '종명만 단독으로 쓰거나 속명과 종명을 모두 대문자로 쓰는 표기는 틀리다.');
  add('2-2023-5 2-2020-33', '공식 명명학적 지위를 갖는 최소 단위는 subspecies다. 같은 species 안에서 안정된 차이를 보이는 집단에 삼명법을 적용한다.', 'Strain은 실제 분리주 단위지만 정식 분류계급은 아니다.');
  add('2-2023-6', 'Three-domain 분류는 작은소단위체 rRNA, 즉 세균·고세균의 16S와 진핵생물의 18S rRNA 서열 비교에 근거한다. 이 자료가 Archaea를 Bacteria와 분리했다.', '세포막 지질도 고세균을 구별하는 특징이지만 three-domain 계통수를 만든 직접 기준은 rRNA다.');
  add('2-2023-8', 'Bergey’s Manual의 전통적 큰 분류에서는 세포벽 유무와 Gram 양성·음성 등 세포벽 구조가 중요한 출발 기준이었다.', '현대 계통분류에서는 rRNA와 유전체 자료도 사용하지만 이 문항은 해당 manual의 전통적 구분 기준을 묻는다.');
  add('2-2023-10', '지방산 조성, LPS, 유기산 같은 세포의 화학 성분을 직접 분석하는 것은 analytical classification에 해당한다.', '당 이용 양상처럼 배양 후 나타나는 대사·생리 반응을 보는 것은 전통적 phenotypic test와 구분한다.');
  add('2-2022-6', 'DNA-DNA hybridization은 두 균주의 전체 DNA가 얼마나 상보적으로 결합하는지를 측정해 종 수준의 유전적 유사성을 판단하던 고전적 기준이다.', '16S rRNA는 넓은 계통관계 파악에 강하지만 매우 가까운 종을 가르는 해상도는 부족할 수 있다.');

  // 3강 · 세균의 형태와 미세구조 및 합성
  add('3-2025-9', 'Endospore는 대표적으로 그람양성 Bacillus와 Clostridium이 불리한 환경에서 만드는 휴면 구조다. 일부 그람음성균에서 나타난다는 1번은 틀렸다.', '아포는 번식체가 아니라 열·건조·화학물질에 견디기 위한 생존 구조다.');
  add('3-2025-10 3-2023-11 3-2022-12', 'LPS의 core polysaccharide는 같은 균종 안에서 비교적 보존되어 비슷한 구조를 보인다. 반대로 바깥쪽 O antigen은 반복 당 조성이 달라 혈청형을 구분한다.', '내독소 활성을 내는 부분은 O antigen이 아니라 lipid A다.');
  add('3-2023-12', 'NAG-NAM 이당류를 막 밖으로 운반한 뒤 glycosyltransferase가 glycan 사슬을 중합하는 단계는 세포막에 결합된 효소계에서 진행된다.', '전구체 합성은 세포질, peptide cross-linking은 세포막 바깥쪽에서 일어나므로 합성 단계를 나누어 외워야 한다.');
  add('3-2023-13 3-2021-32', 'Teichoic acid와 lipoteichoic acid는 그람양성균의 두꺼운 peptidoglycan 층에 특징적인 성분이다. 그람음성균 외막에는 LPS와 porin이 있으므로 해당 선지는 존재하지 않는 구조다.', '그람음성균의 periplasm과 outer membrane을 그람양성균의 teichoic acid와 섞지 않아야 한다.');
  add('3-2023-14', 'Transpeptidation에서 NAM에 붙은 pentapeptide 말단의 D-Ala-D-Ala 중 마지막 D-alanine이 떨어져 나오며 그 에너지로 peptide cross-link가 형성된다.', 'β-lactam은 이 transpeptidase, 즉 PBP의 작용을 막는다.');
  add('3-2022-8', '원핵세포에는 핵막으로 둘러싸인 핵이 없고 DNA가 nucleoid에 존재한다. 이것이 진핵세포와 구별되는 가장 직접적인 특징이다.', '세포막·리보솜·DNA 자체는 진핵세포에도 존재한다.');
  add('3-2022-9 3-2021-35 3-2020-36', 'Porin은 그람음성균 outer membrane의 통로 단백질이다. 그람양성균은 outer membrane이 없으므로 porin을 그람양성 구조로 볼 수 없다.', '그람양성균에는 두꺼운 peptidoglycan과 teichoic acid가 특징적으로 존재한다.');
  add('3-2022-10 3-2021-34', 'Peptide cross-linking은 막을 통과한 peptidoglycan 전구체 사이에서 일어나므로 세포막 바깥쪽에서 진행된다. PBP/transpeptidase가 이 반응을 담당한다.', '세포질에서는 UDP-NAG·UDP-NAM 전구체를 만들고, 막 단계에서는 bactoprenol이 이를 운반한다.');
  add('3-2022-11 3-2021-43 3-2020-37', 'Biofilm은 세균이 표면에 부착해 extracellular matrix 안에서 군집을 이루는 상태다. matrix가 항균제 침투와 면역세포 접근을 방해하고 느린 대사 세포를 포함해 치료 저항성을 높인다.', 'Capsule도 항포식에 관여하지만 집단 형성과 quorum sensing을 함께 묻는 핵심 구조는 biofilm이다.');
  add('3-2022-86 3-2021-36 3-2020-38', '협막은 대부분 다당질로 이루어지고 세균 표면을 덮어 식세포의 인식과 포식을 방해한다. 숙주 성분과 비슷하거나 반복 다당질인 경우 면역원성이 낮을 수 있다.', '예외적으로 Bacillus anthracis의 협막은 poly-D-glutamate 단백질성 협막이다.');
  add('3-2021-30', '수직적 유전자 전달은 부모 세포의 DNA가 딸세포로 전달되는 보편적 증식 과정이므로 원핵세포만의 다양성 획득 특징이 아니다. 세균의 특징적 다양성 증가는 transformation·transduction·conjugation 같은 수평 전달이다.', '원핵세포의 핵막 부재나 막에서의 에너지 생성은 진핵세포와 구별되는 실제 특징이다.');
  add('3-2021-33', '그람양성균은 outer membrane이 없어 β-lactam이 두꺼운 peptidoglycan의 PBP에 비교적 쉽게 접근한다. 따라서 일반적으로 그람음성균보다 penicillin 감수성이 낮다는 3번이 틀렸다.', '실제 감수성은 β-lactamase와 PBP 변화 등 종별 내성기전에 따라 달라질 수 있다.');
  add('3-2020-35', '세균에는 미토콘드리아가 없으므로 전자전달계와 ATP synthase가 세포막에 자리해 에너지를 생산한다.', '진핵세포는 같은 기능을 주로 미토콘드리아 내막에서 수행한다.');
  add('3-2020-39', 'Peptidoglycan의 NAG·NAM과 NAM-pentapeptide 전구체는 먼저 세포질에서 합성된다. 이후 bactoprenol에 실려 세포막을 건너가 중합·교차결합된다.', '문항이 묻는 단계가 전구체 합성인지 막 밖 중합인지 구분해야 한다.');
  add('3-2020-40', 'Lipid A는 glucosamine 이당류 골격에 여러 지방산 사슬이 붙은 LPS의 막 고정 부위이며 내독소 활성을 나타낸다.', 'Core polysaccharide와 O antigen은 당 부분이고, 독성의 핵심은 lipid A다.');

  // 4강 · 세균의 증식과 배양
  add('4-2025-11 4-2023-16', 'MacConkey agar는 bile salt와 crystal violet로 그람양성균을 억제해 그람음성 장내세균을 선택하고, lactose 발효 여부도 구별한다. 따라서 분리·선택배지에 해당한다.', '선택배지는 특정 집단의 성장을 허용하고 다른 집단은 억제한다.');
  add('4-2025-12 4-2023-17 4-2021-39', 'Obligate anaerobe는 산소 유래 활성산소를 제거하는 catalase와 SOD가 부족하거나 없어 산소에 노출되면 손상된다. 따라서 두 효소가 모두 없는 군으로 분류된다.', 'Aerobe와 facultative anaerobe는 산소를 견디기 위해 SOD와 catalase를 갖는다.');
  add('4-2025-13', '혼탁도는 배양액을 통과하는 빛의 감소를 재어 세포량을 추정한다. 세포를 하나씩 세지 않으므로 간접계수법이다.', '현미경 직접계수나 colony count는 세포 또는 집락을 실제로 세는 방법이다.');
  add('4-2025-14 4-2023-15 4-2021-38', '사멸기에는 영양 고갈과 독성 대사산물 축적으로 살아 있는 세포 수가 stationary phase보다 감소한다.', 'Stationary phase에서는 증식하는 수와 죽는 수가 대체로 균형을 이루어 총 생균수가 비교적 일정하다.');
  add('4-2022-13', 'Legionella pneumophila는 iron과 L-cysteine을 요구하므로 charcoal yeast extract를 포함한 BCYE 계열 배지에서 증균한다.', '일반 혈액한천에서는 필요한 영양 조건이 충분하지 않아 잘 자라지 않는다.');
  add('4-2022-14 4-2020-41', '대수증식기 세균은 세포벽·단백질·핵산을 활발히 합성하므로 이 과정을 표적으로 하는 소독제와 항균제에 stationary phase 세균보다 민감하다.', 'Stationary phase의 느린 대사 세포는 성장 의존적 약물의 효과를 덜 받는다.');
  add('4-2021-40', 'Mycobacterium은 산소가 충분한 환경을 필요로 하는 obligate aerobe다. 결핵균이 산소분압이 높은 폐첨부를 선호하는 현상과 연결된다.', 'Facultative anaerobe처럼 산소 없이 발효로 증식하는 군이 아니다.');
  add('4-2020-42', 'Mannitol-salt agar는 높은 NaCl 농도로 Staphylococcus를 선택하고 mannitol 발효 여부도 구별한다. 따라서 선택성과 감별성을 함께 가진다.', '일반 영양배지는 여러 세균이 자라도록 할 뿐 특정 집단을 선택하지 않는다.');

  // 5강 · 세균의 유전학
  add('5-2025-15 5-2021-42', '폐렴사슬알균은 주변의 naked DNA를 받아들이는 transformation으로 협막 형질을 획득한다. Griffith의 형질전환과 Avery-MacLeod-McCarty 실험이 DNA가 유전물질임을 보여준 근거가 되었다.', 'Phage가 DNA를 옮기면 transduction, 성선모를 통한 세포 접촉이면 conjugation이다.');
  add('5-2023-21', '폐렴사슬알균이 외부 협막 유전자를 받아들이는 단계는 transformation이고, 들어온 DNA가 염색체에 안정적으로 자리 잡는 단계는 homologous recombination이다. 수록 답안의 recombination은 후반 통합 과정을 가리킨다.', '전이 방식만 묻는다면 transformation이 더 직접적인 답이므로 발문과 답안의 초점 차이를 주의해야 한다.');
  add('5-2025-16', '자가전달성 plasmid는 tra 유전자와 transfer origin을 가져 성선모를 형성하고 conjugation으로 다른 세균에 복제본을 전달할 수 있다.', '모든 plasmid가 자가전달성인 것은 아니며 mobilizable plasmid는 helper plasmid의 전달기구가 필요하다.');
  add('5-2025-17 5-2023-19', 'Hfr cell은 F plasmid가 세균 염색체에 통합된 상태다. 이 세포가 수용체와 conjugation하면 F origin부터 인접 염색체 유전자가 높은 빈도로 전달된다.', 'Transformation이나 transduction이 Hfr을 만드는 것이 아니라 F factor와 접합계가 핵심이다.');
  add('5-2025-18 5-2023-20 5-2022-16 5-2021-72', 'Bacteriophage가 세균 DNA를 함께 포장해 다음 세균에 전달하는 현상이 transduction이다. 내성 유전자를 실어 나르면 감수성균이 내성균으로 바뀔 수 있다.', 'Naked DNA 흡수는 transformation, 세포 간 직접 접촉은 conjugation이다.');
  add('5-2023-18', 'Glucose가 낮으면 cAMP가 증가해 CAP-cAMP가 promoter 상류에 결합하고 RNA polymerase의 결합을 도와 lac operon 전사를 촉진한다. 동시에 lactose가 있어 repressor가 떨어져 있어야 강한 전사가 가능하다.', 'Lactose만 있다고 충분한 것이 아니라 glucose에 따른 catabolite repression도 함께 봐야 한다.');
  add('5-2022-15 5-2020-43', '세균 rRNA 유전자는 세균 DNA에 있고 DNA-dependent RNA polymerase가 이를 RNA로 전사한다. rRNA는 번역 산물이 아니라 전사 산물이다.', 'DNA polymerase가 rRNA를 만들거나 reverse transcriptase가 관여한다는 설명은 틀리다.');
  add('5-2022-24 5-2020-64', '장내세균의 내성 유전자는 R plasmid에 실려 성선모를 통한 conjugation으로 퍼지는 경우가 많다. 세포끼리 직접 접촉해 plasmid DNA가 전달된다.', 'Phage가 관여하는 transduction과 세포 밖 DNA를 흡수하는 transformation을 구분해야 한다.');
  add('5-2021-41', '강의록 기준으로 그람음성균은 conjugative plasmid와 R plasmid가 흔해 그람양성균보다 높은 빈도로 plasmid를 갖는다고 정리한다.', 'Plasmid는 생존에 필수인 염색체와 달리 내성·독성 등 선택적 이점을 주는 부가 유전요소다.');
  add('5-2020-44', 'Sigma factor는 RNA polymerase core enzyme이 특정 promoter를 인식하게 한다. 환경에 따라 다른 sigma factor를 사용하면 다수 유전자의 전사를 한꺼번에 바꾸어 열충격·기아 등에 적응한다.', 'Repressor 하나가 특정 operon을 끄는 조절보다 범위가 넓다.');

  // 6-7강 · 항균제와 항균요법
  add('6-7-2025-19', '가: penicillin은 β-lactamase에 의해 β-lactam 고리가 분해될 수 있다. 다: polymyxin B는 LPS·세포막 표적의 변화로 결합이 감소할 수 있다. 라: sulfonamide는 엽산 경로의 표적 변화나 대체 경로로 우회할 수 있어 가·다·라가 맞다.', '나의 “효과 범위 변화”는 강의록의 내성 대분류가 아니다. Tetracycline의 대표 내성은 유출펌프·투과성 감소 또는 표적 보호다.');
  add('6-7-2023-23', 'Chloramphenicol은 acetyltransferase에 의한 약물 변형, tetracycline은 투과성 감소·efflux, polymyxin B는 결합 표적 변화, sulfonamide는 엽산 대사 우회로 내성을 얻을 수 있어 네 연결이 모두 맞다.', '내성 기전은 크게 약물 불활성화, 투과성·유출 변화, 표적 변화, 대사 우회로 정리하면 된다.');
  add('6-7-2022-19 6-7-2021-67', 'Penicillin-β-lactamase, streptomycin-리보솜 표적 변화, sulfonamide-엽산 경로 우회가 옳다. Chloramphenicol의 대표 강의록 연결은 acetyltransferase에 의한 약물 변형이므로 해당 문항의 투과도 연결은 제외된다.', '같은 약물에 여러 내성기전이 가능하더라도 이 문제는 강의록에서 강조한 대표 연결을 고르는 문항이다.');
  add('6-7-2020-59', 'Penicillin은 분해효소, tetracycline은 투과도 감소·efflux, streptomycin은 결합 표적 변화, sulfonamide는 대사 우회로 내성을 획득하므로 가·나·다·라가 모두 맞다.', '약물 이름을 외우기보다 분해·투과·표적·우회의 네 범주에 배치하면 된다.');
  add('6-7-2025-20', 'L-form은 항균제 투여 등으로 세포벽을 일시적으로 잃은 상태다. 세포벽 합성 억제제의 표적 자체가 없어져 내성을 보이지만 반드시 유전자 변이가 생긴 것은 아니다.', '약물이 사라지면 다시 세포벽을 형성할 수 있어 안정적으로 유전되는 내성과 구별한다.');
  add('6-7-2023-25 6-7-2022-22 6-7-2021-70 6-7-2020-62', '세포 안에서 대사가 매우 느리거나 비활성인 세균은 성장·합성 과정을 표적으로 하는 항균제의 효과를 피할 수 있다. 이는 DNA 변화 없이 생리상태 때문에 나타나는 phenotypic tolerance다.', '유전성 resistance와 달리 자손에게 안정적으로 전달되는 표적 변이·내성 유전자가 없어도 나타날 수 있다.');
  add('6-7-2025-21 6-7-2023-22 6-7-2022-18 6-7-2021-74 6-7-2020-65', '광범위 항균제는 원인균뿐 아니라 여러 정상균무리도 함께 억제한다. 그 결과 colonization resistance가 약해지고 C. difficile 같은 균의 과증식이나 진균성 superinfection 위험이 커진다.', '작용 범위가 넓다는 것이 항상 우월하다는 뜻은 아니며 원인균이 확인되면 가능한 좁은 범위를 선택한다.');
  add('6-7-2025-22', 'β-lactamase가 penicillin을 분해하면 처음 있던 효과가 사라질 수 있다. 또한 S. aureus가 세포벽이 없는 L-form 상태가 되면 세포벽 합성 억제제의 표적이 없어져 유전변이 없이도 일시적 내성을 보일 수 있다.', '두 기전은 각각 약물 불활성화와 표적 구조의 일시적 소실로 서로 다른 원리다.');
  add('6-7-2025-23 6-7-2022-85 6-7-2020-63', 'MIC 2 mg/L는 혼탁이 처음 사라지는 농도이고 MBC 8 mg/L는 재배양했을 때 colony가 처음 사라지는 농도다. MBC/MIC=4이므로 강의록 기준 2-4배 범위의 bactericidal drug로 판정한다.', 'MIC 미만에서는 액체배지에 혼탁이 남고 MBC 미만 농도의 배양액을 약물 없는 배지에 옮기면 살아남은 균이 colony를 만든다.');
  add('6-7-2021-71', 'MIC 0.5 mg/L에 비해 MBC가 16 mg/L로 32배 높다. 증식은 낮은 농도에서 억제되지만 실제 사멸에는 훨씬 높은 농도가 필요하므로 bacteriostatic drug로 판정한다.', 'MBC가 MIC와 2-4배 정도로 가까우면 살균제, 16배를 넘게 벌어지면 정균제로 정리한다.');
  add('6-7-2025-24 6-7-2022-20 6-7-2021-68 6-7-2020-60', 'Clindamycin과 chloramphenicol은 모두 50S 리보솜의 겹치는 부위에 결합해 서로 경쟁하므로 대표적 synergy 조합이 아니다. 따라서 시너지 결과를 설명하는 조합으로는 틀리다.', '대표 synergy는 sulbactam+cephalosporin, sulfonamide+trimethoprim, penicillin+aminoglycoside, polymyxin B+rifampicin이다.');
  add('6-7-2023-24', 'Penicillin과 cephalosporin은 같은 β-lactam 계열로 유사한 표적을 막아 서로 보완성이 작고, clindamycin과 chloramphenicol은 50S의 겹치는 결합부위에서 경쟁한다. 그래서 두 조합 모두 제시된 synergy를 만들기 어렵다.', '서로 다른 단계나 투과·분해 기전을 보완하는 조합이 진정한 상승작용을 만든다.');
  add('6-7-2022-21', 'Disk 사이의 억제환이 서로를 향해 잘려 좁아지는 다 형태는 한 약물이 다른 약물의 효과를 줄이는 antagonism이다. 이런 조합은 병용에 적절하지 않다.', '두 억제환 사이가 바깥으로 확장되는 keyhole 모양이면 synergism, 단순히 겹치기만 하면 indifference로 본다.');
  add('6-7-2021-69 6-7-2020-61', '두 disk 사이까지 억제영역이 넓어지는 그림은 두 약물이 함께 있을 때 효과가 커진 synergism이므로 병용에 유리하다. 수록 그림의 가·다 또는 가·나가 그 모양에 해당한다.', '억제환이 만나는 쪽에서 오히려 찌그러지면 antagonism이므로 병용을 피한다.');
  add('6-7-2023-26', '강의록은 반감기가 지나치게 길면 정상균무리까지 오래 억제하고, 너무 짧으면 치료효과가 부족하므로 “복용 주기를 늘리기 위해 무조건 반감기를 늘린다”는 5번을 틀린 설명으로 처리한다.', '반감기는 투여 편의만이 아니라 유효농도 유지, 독성, 정상균무리 손상을 함께 고려해 적절하게 설계해야 한다.');
  add('6-7-2023-27 6-7-2022-23 6-7-2020-66', '여러 병원체가 동시에 존재할 때 병용치료를 하는 것은 항균제 남용의 결과가 아니다. 남용의 실제 문제는 정상균무리 변화, 독성, 중증 감염의 masking, 내성 선택이다.', '“교대 감염”이라는 표현이 superinfection과 혼동되기 쉽지만 수록 답안은 두 병원체의 동시·교대 감염 자체를 남용의 결과에서 제외한다.');
  add('6-7-2022-17', 'Penicillin은 PBP/transpeptidase를 억제해 peptidoglycan 교차결합을 막는 세포벽 합성 억제제다. 단백질 합성 억제제라는 2번은 틀렸다.', '단백질 합성 억제제는 aminoglycoside·tetracycline·macrolide·chloramphenicol 등 리보솜 표적 약물이다.');
  add('6-7-2020-81', 'MIC는 눈에 보이는 세균 증식을 억제하는 항균제의 최소농도다. 액체배지에서 혼탁이 처음 보이지 않는 가장 낮은 농도로 읽는다.', '균을 실제로 죽이는 최소농도인 MBC와 구분한다.');
  add('6-7-2023-74', '액체배지에서 혼탁이 처음 없어지는 최저 농도가 MIC이고, 그 배양액을 약물 없는 고체배지에 옮겼을 때 colony가 처음 생기지 않는 최저 농도가 MBC다. MBC가 MIC의 2-4배면 살균제, 16배보다 크면 정균제로 판정한다.', '문항 수치와 시험관 표지가 복원되지 않아 특정 label 정답은 확정할 수 없지만 그래프 판독 원리는 이 순서다.', '원본 그림과 수치가 미복원된 문항이다.');

  // 8강 · 전파 및 침입경로
  add('8-2025-25', 'A의 증상과 역학은 섭취한 V. cholerae에 의한 장관감염에 맞고, 위산 억제제는 산 장벽을 약화해 감염량을 낮춘다. 콜레라균은 장세포 안으로 침입하기보다 표면에 정착해 cholera toxin으로 물·전해질 분비를 유발한다.', '수록 5번의 “cytolytic toxin”은 생물학적으로 cholera toxin의 cytotonic enterotoxin 작용을 잘못 복원한 표현으로 보인다. 세포를 용해시키는 독소가 아니다.', '1번도 “가능성이 없다”는 절대 표현은 임상적으로 과하지만, 문항은 제시된 콜레라 장관감염 경로를 기준으로 채점한다.');
  add('8-2025-26', '흡연과 만성 기관지염은 점액섬모 청소 기능을 손상시켜 B. pertussis 정착을 돕는다. Pertussis의 tracheal cytotoxin도 섬모세포를 손상시켜 기침과 배출 장애를 일으키며, 이 감염은 호흡기 전파 질환이다.', '위산·장관 방어기전은 B의 백일해 감염과 직접 관련이 없다.');
  add('8-2025-27 8-2023-30', '성접촉 전파는 밀접하고 특정한 접촉이 필요하므로 오염된 음식·물로 다수에게 빠르게 퍼질 수 있는 소화기 전파보다 일반적으로 속도와 효율이 낮다.', '전파 효율은 병원체의 독성만이 아니라 접촉 빈도와 배출량, 환경 생존성에도 좌우된다.');
  add('8-2025-28', '기침·가래·설사는 병원체를 호흡기 분비물이나 분변으로 대량 배출하게 해 shedding과 전파 기회를 늘린다.', '증상이 심하면 항상 전파력이 큰 것은 아니지만 병원체 배출을 증가시키는 증상은 중요한 전파 요인이다.');
  add('8-2023-28', '장관은 산소가 적고 위산·담즙·점액·연동운동이 존재하므로 장 감염균에는 산 저항성, 점액 통과, 부착, 혐기성 환경 적응이 유리하다. 섬모운동 억제는 호흡기 감염 전략이고 장이 호기성이라는 설명도 틀리다.', '기관지 cilia와 장관 microvilli를 혼동하지 않아야 한다.');
  add('8-2023-29 8-2022-25', '항생제로 정상균무리가 바뀌는 것은 구강인두의 선천적 물리 장벽이 아니라 치료에 의해 생기는 생태 변화다. 따라서 “구강인두-항생제로 인한 상재균 변화”는 침입 방어기전의 직접 연결로 부적절하다.', '구강인두의 실제 방어에는 침, 점액, 섬모, IgA, 정상균무리의 경쟁 등이 있다.');
  add('8-2023-31', '병원체가 숙주에서 증식하지만 임상 증상이 없는 상태가 inapparent infection, 즉 불현성·무증상 감염이다. 증상이 없어도 병원체를 배출해 전파원이 될 수 있다.', '잠복기는 아직 증상이 나타나기 전의 시간 개념이고, 불현성 감염은 감염 내내 증상이 없을 수 있는 상태다.');
  add('8-2022-26', 'HIV, HTLV-1, CMV는 모유를 통해 산모에서 영아로 전달될 수 있으므로 수직감염의 모유감염 예다.', '수직전파에는 태반, 분만 중 산도 노출, 모유수유가 포함된다.');
  add('8-2022-27 8-2020-49', '비말과 호흡기 분비물로 퍼지고 밀집·환기 불량 환경에서 위험이 커지는 전파는 respiratory transmission이다.', '오염된 음식·물은 소화기, 모기·진드기는 vector-borne transmission으로 구분한다.');
  add('8-2021-47', '오염된 바늘·의료사고는 직접 혈액 노출, 흡혈 절지동물은 혈액을 통한 매개, 태반감염은 모체 혈류에서 태아로 이동하므로 공통 축은 혈행성 전파다.', '각각의 세부 경로는 다르지만 병원체가 혈액을 매개로 숙주 사이 또는 조직 사이를 이동한다.');
  add('8-2021-48 8-2020-50', '섬모운동과 점액·IgA 분비 증가는 호흡기의 방어기전이라 병원체의 효과적 침입을 막는다. 따라서 이것이 증가하면 침입이 쉬워진다는 연결은 틀렸다.', '흡연, 섬모 손상, 점액 청소 저하는 반대로 호흡기 감염 위험을 높인다.');
  add('8-2021-49', '부모에서 자식으로는 vertical transmission, 같은 세대의 비말·분변 전파는 horizontal transmission, 척추동물에서 사람으로 넘어오는 감염은 zoonosis다. Rubella-수직, influenza-수평, MERS-인수공통 연결이 맞다.', '수직·수평은 세대 관계를, zoonosis는 동물 저장소와 종간 전파를 기준으로 한 분류다.');
  add('8-2021-50', '흡혈곤충은 단순한 passive carrier만이 아니다. 병원체가 곤충 내부에서 증식하거나 발육하는 biological vector가 될 수 있으므로 3번이 틀렸다.', '파리처럼 표면에 묻혀 옮기는 mechanical vector와 모기·진드기 같은 biological vector를 구분한다.');
  add('8-2020-51', '흡혈곤충과 오염된 주사침은 피부 장벽을 우회해 병원체를 혈액으로 직접 전달하므로 대표적인 혈행성 전파 방식이다.', '호흡기 비말이나 분변-경구 전파는 점막을 통해 들어오는 별도 경로다.');

  // 9강 · 세균 병인론
  add('9-2025-29', 'Mycobacteria와 Legionella는 phagosome-lysosome fusion을 막고, Listeria·Shigella·Rickettsia는 vacuole에서 빠져나와 세포질에서 증식할 수 있다. Ehrlichia와 Coxiella는 lysosomal 환경 또는 효소에 견디는 전략을 사용하므로 제시된 1·2·3 조합이 성립한다.', '세포 내 생존균은 모두 같은 전략을 쓰는 것이 아니라 융합 차단, vacuole 탈출, lysosome 저항으로 나누어 외워야 한다.');
  add('9-2025-30', 'S. aureus adhesin은 우선 숙주 표면 부착과 면역회피를 돕지만 adhesin 자체로 세포 안에 직접 침투한다고 일반화할 수 없다. 또한 IgA를 절단하는 대표 효소는 Neisseria·Haemophilus 등의 IgA protease이지 S. aureus protease의 대표 연결이 아니다.', 'S. aureus의 주요 인자는 capsule, protein A, coagulase, cytolysin, superantigen, 여러 효소·adhesin이다.');
  add('9-2023-32 9-2022-28', 'Endotoxin은 그람음성균 outer membrane의 LPS, 특히 lipid A 성분이다. 세균이 분비하는 단백질 독소인 exotoxin과 달리 열에 비교적 안정하고 toxoid로 만들기 어렵다.', 'Exotoxin은 그람양성·음성 모두 만들 수 있으며 특정 표적에 강한 효소성 작용을 하는 경우가 많다.');
  add('9-2023-33', 'Biofilm 안의 세균은 autoinducer 농도로 세포 밀도를 감지하는 quorum sensing을 사용해 matrix와 virulence gene 발현을 집단적으로 조절한다.', 'Quorum sensing은 하나의 소기관이 아니라 신호물질·수용체·유전자 조절로 이루어진 체계이며 biofilm과 밀접하게 연결된다.');
  add('9-2023-34', '1·2·4는 모두 virulence factor의 올바른 특징이다. 면역회피를 돕고, 한 균이 여러 인자를 가질 수 있으며, 부착·침입을 촉진한다. 실제로 틀린 설명은 외부 구조와 무관하다는 3번과 생존에 필수이고 항생제 표적이라는 5번이다.', '수록 답안은 1·2·4로 되어 있어 발문의 “옳지 않은 것”과 정반대다.', '발문이 “옳은 것을 모두 고르시오”로 복원되어야 답안과 맞는 오류 문항이다.');
  add('9-2023-35', 'Biofilm matrix는 항체와 complement, 식세포, 항균제의 접근을 막아 면역반응을 약화시킨다. 보체와 항체 반응을 강화한다는 2번은 반대다.', 'Biofilm은 느린 대사 상태와 persister cell도 포함해 만성·재발성 감염을 만든다.');
  add('9-2023-36', 'S. pneumoniae의 smooth colony는 항포식성 capsule을 가진 독성형이고, capsule을 잃으면 표면이 rough해지고 독성이 약해진다.', 'R/S 형질전환 실험에서도 죽은 S균의 capsule 유전자가 R균을 S형으로 바꾼다.');
  add('9-2022-29', 'Rickettsia는 숙주세포의 ATP와 대사환경에 의존해 세포 밖 인공배지에서 독립 증식하지 못하는 obligate intracellular bacterium이다.', 'Mycobacterium·Legionella·Listeria는 세포 내에서도 살 수 있지만 세포 밖 배양이 가능한 facultative intracellular pathogen이다.');
  add('9-2022-30 9-2020-45', 'Corynebacterium diphtheriae가 β-phage에 감염되어 tox gene을 얻어야 diphtheria toxin을 만든다. 파지가 독소 유전자를 전달하는 lysogenic conversion은 transduction의 한 형태다.', '세균 자체 염색체만으로 모든 균주가 독소를 만드는 것이 아니다.');
  add('9-2021-37', '요로병원성 세균의 pili/fimbriae는 요로 상피의 특정 수용체에 결합해 소변 흐름에도 씻겨 나가지 않도록 부착시킨다.', 'Flagellum은 주로 운동, capsule은 항포식에 더 직접적으로 관여한다.');
  add('9-2021-44 9-2020-47', 'Staphylococcal enterotoxin은 MHC II와 T-cell receptor의 Vβ 부위를 비특이적으로 연결하는 superantigen이다. 많은 T cell을 polyclonal하게 활성화해 대량 cytokine 방출을 일으킨다.', '일반 항원처럼 특정 clone만 활성화하는 방식이 아니다.');
  add('9-2021-45 9-2020-46', 'Legionella는 오염된 물에서 생긴 aerosol을 흡입해 호흡기로 들어오고 폐포 macrophage 안에서 증식한다. ingestion을 주 침입경로로 연결한 선지는 틀렸다.', '장관 섭취 감염과 물방울 aerosol 흡입을 구별해야 한다.');
  add('9-2021-46 9-2020-48', 'Coxiella burnetii는 phagosome-lysosome 융합을 막기보다 산성 phagolysosome 환경에 적응해 증식한다. 따라서 융합 차단 설명은 틀렸다.', 'Neisseria gonorrhoeae는 flagellum이 아니라 pili와 Opa 등 표면항원의 antigenic/phase variation으로 항체를 피한다.');
  add('9-2020-38', '협막은 식세포가 세균 표면을 인식하고 삼키는 것을 방해하며, 일부는 숙주 성분과 비슷하거나 반복 다당질로 이루어져 항원성이 낮다. 그래서 항포식성 virulence factor로 작용한다.', '모든 협막이 완전히 비항원성인 것은 아니며 폐렴사슬알균 협막처럼 혈청형 구분과 백신 표적이 되는 경우도 있다.');

  // 10-11강 · 바이러스 구조와 분류
  add('10-11-2025-31 10-11-2023-40', 'HIV gp120은 먼저 CD4에 결합한 뒤 chemokine coreceptor인 CCR5 또는 CXCR4를 이용한다. 이어 gp41이 막융합을 일으킨다.', 'CCR5는 주로 초기 macrophage-tropic strain, CXCR4는 T-cell-tropic strain과 연결해 외운다.');
  add('10-11-2025-32', 'Polyomavirus는 원형 이중가닥 DNA를 가진 비외피 DNA 바이러스다. 따라서 RNA virus가 아닌 것을 묻는 정답이다.', 'Picorna·Toga·Flavi·Corona 등은 RNA virus family다.');
  add('10-11-2025-33', 'Human papillomavirus는 Papillomaviridae에 속하는 비외피 dsDNA 바이러스이지 Herpesviridae가 아니다.', 'Herpes family에는 HSV-1·2, VZV, EBV, CMV, HHV-6·7·8이 포함된다.');
  add('10-11-2025-34', '외피 바이러스는 nucleocapsid 바깥에 숙주 유래 지질막과 바이러스 당단백질 spike를 가진다. 그래서 nucleocapsid+막+당단백질이라는 설명이 맞다.', '지질막 때문에 detergent·건조·산에 상대적으로 약하고 주로 budding으로 방출된다.');
  add('10-11-2025-35', 'Orthomyxovirus는 분절된 음성가닥 ssRNA genome을 가진 외피 RNA 바이러스다. 따라서 DNA 바이러스가 아닌 정답이다.', 'Pox·Herpes·Adeno·Papilloma/Polyoma·Parvo 등은 DNA 바이러스다.');
  add('10-11-2023-38', '사람 herpesvirus 8종은 HSV-1, HSV-2, VZV, EBV, CMV, HHV-6, HHV-7, HHV-8이다. 모두 외피 dsDNA 바이러스이며 잠복감염을 만든다.', '번호와 이름을 일대일로 연결해 외우는 문항이다.');
  add('10-11-2023-37', '강의록 분류표에서 10개 이상을 쓰려면 DNA virus의 Pox·Herpes·Adeno·Papilloma/Polyoma·Parvo와 RNA virus의 Picorna·Toga·Flavi·Corona·Reo·Orthomyxo·Paramyxo·Rhabdo·Bunya·Arena·Retro 중에서 골라 쓰면 된다.', 'Family 이름과 대표 virus 이름을 섞지 말고 같은 수준의 분류명을 나열해야 한다.', '원문에 모범답안이 없어 강의록 분류표를 기준으로 학습 답안을 제시했다.');
  add('10-11-2023-39', 'Arbovirus는 arthropod-borne virus의 약자로 절지동물 매개 방식에 따라 붙은 묶음 이름이다. 발생 조직으로 명명했다는 2번은 틀렸다.', '바이러스 이름은 질병, 발견 장소, 숙주·매개체, 형태 등 여러 기준에서 유래할 수 있다.');
  add('10-11-2022-31 10-11-2021-3 10-11-2020-5', 'Adenovirus는 외피가 없는 naked virus라 숙주 세포막을 얻어 budding할 수 없고, 주로 세포 용해로 방출된다.', '외피 바이러스는 보통 세포막을 통과하며 budding하지만 naked virus는 lysis와 연결된다.');
  add('10-11-2022-32', 'Bunyavirus는 음성가닥 RNA genome을 갖기 때문에 들어온 RNA만으로 mRNA를 만들 수 없다. 따라서 virion 안에 RNA-dependent RNA polymerase를 포장해 들어온다.', '양성가닥 RNA 바이러스는 genome 자체를 즉시 번역할 수 있어 일반적으로 virion RdRp가 필요하지 않다.');
  add('10-11-2022-33 10-11-2020-1', '완전한 virion은 DNA와 RNA 중 한 종류의 핵산만 genome으로 가진다. 세균처럼 DNA genome과 여러 종류의 RNA를 독립적인 세포 성분으로 함께 갖는 구조가 아니다.', '바이러스는 ribosome과 ATP 생성계가 없어 숙주세포에 의존한다.');
  add('10-11-2022-34', 'Poxvirus는 DNA 바이러스 중 예외적으로 세포질에서 복제한다. 핵의 전사효소를 이용할 수 없으므로 자체 DNA-dependent RNA polymerase와 복제 효소를 virion에 갖춘다.', '대부분의 다른 DNA 바이러스는 핵에서 복제한다.');
  add('10-11-2022-35', 'Influenza·mumps·parainfluenza 등은 표면단백질이 적혈구 수용체를 교차결합해 hemagglutination을 일으킬 수 있지만 강의록 분류에서 coronavirus는 해당 목록에 포함되지 않는다.', '적혈구응집 자체와 이를 항체가 막는 hemagglutination-inhibition test를 구분한다.');
  add('10-11-2022-36', 'Marburg virus는 Filoviridae의 외피 음성가닥 ssRNA 바이러스다. 음성가닥 genome은 mRNA와 상보적이므로 virion RdRp가 먼저 양성가닥 mRNA를 만들어야 한다.', '“음극성 mRNA”는 정확히는 negative-sense RNA genome이라는 뜻이다.');
  add('10-11-2022-37', 'SARS는 2002년 말 출현해 2003년에 세계적으로 유행했다. 2009-2010은 신종 H1N1 influenza pandemic 시기이므로 SARS와 연결한 5번이 틀렸다.', 'SARS, MERS, COVID-19의 발생 연도를 구분해야 한다.');
  add('10-11-2022-38', 'Bunyavirus는 분절된 negative-sense ssRNA genome을 가진다. genome이 mRNA로 바로 번역되지 않으므로 virion polymerase가 필요하다.', '양성가닥 Picorna·Flavi·Toga·Corona와 극성을 반대로 분류한다.');
  add('10-11-2022-39 10-11-2021-5 10-11-2020-6', 'Coxsackievirus가 속한 Picornavirus는 외피가 없는 naked virus라 산·건조·detergent에 비교적 강하다. 따라서 위산을 견디고 장관에서 감염을 일으킬 수 있다.', '외피 바이러스는 지질막이 산과 detergent에 손상되기 쉬워 일반적으로 위장관 전파에 불리하다.');
  add('10-11-2021-1', '1-4번은 바이러스의 세포 의존성을 나타내는 특징이다. 5번은 “바이러스가 인터페론에 감수성”이라는 표현이 부정확해 오답으로 처리된다. Interferon은 숙주세포에 항바이러스 상태를 유도해 복제를 억제한다.', 'Interferon이 세균보다 바이러스 감염에 주로 작용한다는 사실과 바이러스 자체가 약물처럼 직접 감수성 검사를 받는다는 표현을 구분한다.');
  add('10-11-2021-8 10-11-2020-10', 'MOI는 감염성 virus particle 수를 표적세포 수로 나눈 비율이다. MOI 2 또는 5는 세포 하나당 평균 2개 또는 5개의 감염성 입자를 넣었다는 뜻이다.', '모든 세포가 정확히 같은 수를 받는다는 뜻은 아니며 실제 분포는 Poisson 분포를 따른다.');
  add('10-11-2021-9 10-11-2020-11', 'Paramyxovirus의 fusion protein은 감염세포막에 발현된 뒤 인접 세포막까지 융합시켜 다핵성 syncytium을 만든다.', '바이러스가 세포 밖으로 나오지 않고도 세포 간에 직접 퍼질 수 있는 CPE다.');
  add('10-11-2021-10', 'Influenza HA는 적혈구의 sialic acid에 결합해 응집을 일으킨다. 환자 항체가 HA를 막으면 응집이 억제되므로 hemagglutination-inhibition으로 항체 역가를 잴 수 있다.', '단순 hemagglutination은 바이러스 양을, inhibition은 항-HA 항체의 양을 반영한다.');
  add('10-11-2020-7', 'Influenza 같은 orthomyxovirus 감염의 조직손상은 바이러스의 직접 세포독성뿐 아니라 염증성 cytokine과 면역세포 반응이 크게 기여할 수 있어 면역병리와 연결된다.', '문항은 강의록의 대표 연결을 묻는 것으로, 다른 바이러스도 상황에 따라 면역병리를 일으킬 수 있다.');
  add('10-11-2020-9', 'Retrovirus proviral DNA에서 바이러스를 만들려면 LTR을 포함한 완전한 유전체와 숙주 염색체로의 적절한 통합·전사 조건이 필요하다. 단순히 정제한 일부 유전자를 세포에 넣는 것만으로는 완전한 자손 바이러스가 생산되지 않는다.', '바이러스 단백질 일부가 발현되는 것과 감염성 virion 전체가 조립되는 것은 다르다.');
  add('10-11-2020-12', '중화항체측정은 influenza가 세포에 감염하는 것을 혈청 항체가 막는 정도를 재어 항체 역가를 구한다. 따라서 항체 기능을 직접 평가할 수 있다.', '혈구응집측정만 하면 항체가 아니라 바이러스의 적혈구 응집능을 재므로, 항체 역가에는 혈구응집저지 또는 중화시험이 필요하다.');

  // 12강 · 정상균무리와 감염
  add('12-2025-36', '피부·구강·장·질처럼 장기마다 산소, pH, 영양분, 수분과 방어기전이 달라 서로 다른 미생물 군집이 선택된다. 따라서 정상균무리 조성은 장기별로 다르다.', '한 사람 안에서도 부위와 연령, 식이, 약물에 따라 microbiota가 달라질 수 있다.');
  add('12-2025-37', '정상균무리도 피부·점막 손상이나 면역저하가 있으면 감염을 일으킬 수 있고, 장내세균이 요도로 이동하면 요로감염을 만들 수 있다. 따라서 1번과 4번이 틀렸다.', '기회감염은 균 자체가 항상 무해하다는 뜻이 아니라 위치와 숙주 상태가 바뀔 때 병원성을 나타낸다는 뜻이다.');
  add('12-2025-38', '정상균무리는 영양분과 부착 부위를 선점해 외부 병원체가 자리 잡지 못하게 한다. 이 경쟁이 colonization resistance의 핵심이다.', '산 생성, bacteriocin, 면역계 자극도 추가적인 방어기전이다.');
  add('12-2025-39', 'FMT가 성공하면 환자의 장내 군집이 건강한 분변 기증자의 다양하고 안정된 군집과 비슷해진다. 이는 C. difficile의 빈 생태적 자리를 다시 채워 재발을 막는다.', 'Vancomycin은 C. difficile을 억제하지만 정상군집 자체를 기증자형으로 복원하는 치료는 아니다.');
  add('12-2023-41', '광범위 항생제는 감수성 정상균을 함께 제거하므로 정상균무리의 수·분포·다양성을 바꿀 수 있다.', '이 변화가 colonization resistance를 약화해 C. difficile이나 Candida 과증식을 허용할 수 있다.');
  add('12-2023-42 12-2022-40 12-2021-55 12-2020-69', '의식저하나 삽관에서 문제가 되는 것은 구강·상부기도 정상균이 아래쪽 폐로 흡인되어 생기는 하부호흡기 감염이다. 상부호흡기도에서 감염이 생긴다는 선지는 위치가 틀렸다.', '정상균이 원래 있던 부위가 아니라 sterile site나 다른 해부학적 부위로 이동할 때 기회감염이 된다.');
  add('12-2023-43', 'C. difficile spore는 산소가 있는 환경에서 생존·전파하지만 장의 혐기성 환경과 적절한 담즙산 신호에서 germination한다. 산소 환경에서 발아한다는 2번은 틀렸다.', 'Spore의 환경 저항성과 vegetative cell의 혐기성 증식을 구분해야 한다.');
  add('12-2023-44', '장 microbiota와 점막면역은 tight junction, mucus, antimicrobial peptide, secretory IgA를 함께 이용해 병원체의 접근과 침투를 막는다. 따라서 ㄱ-ㄹ이 모두 맞다.', '이 장벽들은 물리적·화학적·면역학적 방어를 동시에 이룬다.');
  add('12-2022-41', 'M. tuberculosis는 건강한 사람에서도 질병을 일으킬 수 있는 strict pathogen에 가깝고 정상균무리의 균형 붕괴를 틈타 생기는 전형적 원내 기회감염균은 아니다.', '원내 기회감염은 Pseudomonas, Acinetobacter, Candida, C. difficile 등과 더 직접적으로 연결된다.');
  add('12-2022-42 12-2021-57', '질 Lactobacillus는 glycogen 유래 당을 젖산으로 바꾸어 낮은 pH를 유지하고 다른 병원체의 증식을 억제한다.', '항생제로 Lactobacillus가 줄면 pH가 올라가 질 미생물 생태가 흔들릴 수 있다.');
  add('12-2022-43 12-2021-58', 'Metagenomics의 장점은 배양하지 않고 표본에서 전체 DNA를 직접 추출·분석해 배양 불가능한 미생물까지 보는 것이다. 배양을 거친 미생물만 분석한다는 설명은 반대다.', '16S amplicon은 주로 분류 조성을, shotgun sequencing은 군집의 전체 유전자와 기능을 더 넓게 본다.');
  add('12-2020-67', 'NGS 기반 metagenomics는 환경이나 인체 시료에서 미생물 군집의 DNA를 직접 뽑아 동시에 분석한다. 개별 균을 먼저 순수배양할 필요가 없다.', '전통 배양법으로 놓치는 저농도·난배양 미생물도 탐지할 수 있다.');
  add('12-2020-68', 'FMT의 확립된 대표 적응증은 재발성 C. difficile infection이다. “슈퍼박테리아 감염” 전반을 직접 치료하는 표준요법은 아니므로 가장 치료하기 어렵다.', 'FMT는 항균제를 대신해 모든 내성균을 제거하는 치료가 아니라 장내 생태를 복원하는 치료다.');
  add('12-2021-56', 'Corynebacterium xerosis는 피부·점막에서 발견될 수 있는 정상균무리 구성원으로 기회감염을 일으킬 수 있으므로 strict pathogen이 아니다.', 'Strict pathogen은 정상 숙주에서도 침입하면 질병을 일으키는 병원체를 뜻한다.');
  add('12-2020-70', 'C. difficile의 영양형은 obligate anaerobe라 장에서 증식하는 데 산소가 필요하지 않다. 일정 수준의 산소가 필요하다는 2번은 틀렸다.', '산소가 있는 외부에서는 주로 내성이 강한 spore 형태로 살아남는다.');

  // 13강 · 바이러스 증식 및 배양
  add('13-2025-40', 'HIV gp120이 CD4에 먼저 결합하면 구조가 변해 CCR5 또는 CXCR4 coreceptor와 결합한다. 이어 gp41이 숙주막에 삽입되어 바이러스 외피와 세포막을 융합시키고 nucleocapsid가 세포질로 들어간다.', 'gp120은 receptor 결합, gp41은 실제 membrane fusion을 담당한다.');
  add('13-2025-41 13-2023-45', 'Poxvirus는 DNA 바이러스지만 세포질에서 복제하므로 숙주 핵의 RNA polymerase를 이용할 수 없다. 그래서 전사·복제에 필요한 자체 polymerase와 효소를 virion에 갖고 들어온다.', '대부분 DNA 바이러스는 핵을 이용하지만 Pox가 대표적 예외다.');
  add('13-2025-42', 'Flavivirus는 양성가닥 ssRNA genome이 바로 mRNA로 번역되어 먼저 RdRp를 만들 수 있다. 따라서 virion 안에 RNA polymerase를 미리 포장할 필요가 없다.', '음성가닥 RNA와 dsRNA 바이러스는 들어오자마자 mRNA를 만들기 위해 virion-associated RdRp가 필요하다.');
  add('13-2025-43', 'Rhinovirus의 capsid VP1·VP2·VP3가 attachment complex를 이루고 주 수용체 ICAM-1에 결합한다.', 'Rhinovirus는 Picornaviridae의 naked positive-sense RNA virus다.');
  add('13-2023-46 13-2022-44 13-2021-4 13-2020-19', 'Flavi·Picorna·Toga·Corona는 positive-sense ssRNA 바이러스라 genome이 숙주 ribosome에서 바로 mRNA처럼 번역된다. 각 연도 정답은 이 같은 분류에 속한다.', 'Negative-sense RNA나 dsRNA는 genome을 직접 번역할 수 없어 먼저 RdRp로 mRNA를 만들어야 한다.');
  add('13-2023-47 13-2020-3', 'Influenza HA glycoprotein은 호흡기 상피세포의 sialic acid에 결합해 attachment를 시작한다.', 'NA는 새 virion 방출 때 sialic acid를 절단하는 단백질이지 초기 부착의 주단백질이 아니다.');
  add('13-2022-45', 'HIV의 gp120이 helper T cell 등의 CD4에 결합하고 CCR5/CXCR4를 coreceptor로 사용한다.', '막융합을 수행하는 단백질은 gp41이므로 attachment와 fusion 역할을 구분한다.');
  add('13-2022-46 13-2021-11 13-2020-13', 'DNA virus의 early gene은 genome 복제 전에 발현되어 DNA polymerase, DNA-binding protein, 전사조절인자 같은 비구조 단백질을 만든다.', 'Capsid와 envelope 단백질 같은 구조 단백질은 genome 복제 뒤 late gene에서 주로 만들어진다.');
  add('13-2021-2', 'EBV의 gp350/220이 B cell 표면의 CR2, 즉 CD21에 결합해 부착한다.', 'CD4는 HIV, sialic acid는 influenza의 대표 수용체다.');
  add('13-2021-6 13-2020-8', 'Parvovirus는 매우 작은 ssDNA genome을 가져 자체적으로 S phase를 유도할 능력이 부족하다. 숙주의 DNA 합성효소가 활성화된 분열 중 세포에서만 효율적으로 복제한다.', '그래서 골수 전구세포처럼 빠르게 분열하는 세포가 중요한 표적이 된다.');


  // 강의록 대조로 확정한 복원·정답 교정
  add('1-2020-28', 'Bassi·Koch·Semmelweis·Pasteur·Lister는 모두 감염 원인과 전파·예방에 관한 germ theory의 발전과 연결된다. 따라서 이 복원문에는 단일 정답이 없다.', '특히 Koch를 “가장 관련 없다”고 처리한 기존 수록 답안은 강의록의 Koch postulates와 정면으로 충돌한다.', '정답 미확정으로 채점하지 않는다.', {1:'Bassi는 누에병의 감염성 원인을 제시해 germ theory 초기 발전에 연결된다.',2:'Koch는 병원체와 질병의 인과를 검증하는 가설을 확립한 핵심 인물이다.',3:'Semmelweis는 손 위생으로 산욕열 전파를 줄여 감염 전파 개념을 뒷받침했다.',4:'Pasteur는 자연발생설을 반박하고 미생물설을 확립했다.',5:'Lister는 소독법으로 germ theory를 수술에 적용했다.'});
  add('3-2020-40', 'LPS의 Lipid A는 긴 지방산이 결합한 인산화 이당류 부분으로, 내독소 활성의 중심이다.', '“인지질”은 지방산·글리세롤·인산으로 된 별도 지질 분류이므로 Lipid A의 결합 성분을 인지질이라고 쓰면 부정확하다.', '', {1:'Lipid A의 구조를 지방산과 인산화 이당류로 바로잡은 정답 선지다.'});
  add('5-2023-21', '폐렴사슬알균의 협막 형질 획득은 환경의 naked DNA를 받아들이는 transformation의 대표 사례다.', 'Recombination은 들어온 DNA가 염색체에 통합되는 후속 분자 과정일 수 있지만, 세포 간 유전자 전달 기전의 이름은 transformation이다.', '', {1:'Transformation은 S. pneumoniae 협막 전달의 대표 기전이다.',2:'Conjugation은 세포 간 접촉과 plasmid 전달이 핵심이다.',3:'Transduction은 bacteriophage가 DNA를 옮긴다.',4:'Transposition은 이동성 유전요소의 자리 이동이다.',5:'Recombination은 DNA 통합 과정이지 이 사례의 전달 기전명은 아니다.'});
  add('8-2025-25', '콜레라는 장상피에 부착한 뒤 enterotoxin으로 이온 이동과 수분 분비를 교란한다. 위산 억제는 감염 취약성을 높일 수 있다.', '콜레라균은 장 상피 안으로 침입해 사는 세균이 아니며, mucinase는 점액층 통과를 돕는 인자다.', '', {1:'이 증례에서 콜레라의 주 전파·감염 경로는 장관이므로 호흡기 감염으로 설명하지 않는다.',2:'콜레라균은 장상피에 부착하지만 세포 내부에 서식하는 침입성 세균으로 보지 않는다.',3:'Mucinase는 점액을 통과해 표적세포에 닿는 데 기여하며 장상피 내부 존재와는 다르다.',4:'위산을 줄이는 약물은 위장관 병원체의 생존 장벽을 낮춰 감염 취약성을 높일 수 있다.',5:'콜레라 독소는 enterotoxin으로 이온·수분 분비를 교란한다.'});
  add('9-2023-34', 'Virulence factor는 부착·침입·면역회피를 돕는 인자이며, 균이 여러 개를 가질 수 있다. 틀린 선지는 3·5번이다.', '기존 수록 답안 1·2·4는 발문이 “옳지 않은 것”인 경우 정반대여서 정답 매칭을 바로잡았다.', '', {1:'면역회피는 대표적인 virulence factor 기능이므로 옳다.',2:'한 병원체는 여러 virulence factor를 함께 가질 수 있으므로 옳다.',3:'Virulence factor에는 협막·pili·독소 등 세포 외부 또는 표면 구조도 포함되므로 틀리다.',4:'부착과 침입 촉진은 대표 기능이므로 옳다.',5:'Virulence factor는 생존에 필수인 기본 대사인자가 아니며, 항생제 표적이라고 일반화할 수 없어 틀리다.'});
  add('9-2020-48', 'S. pneumoniae의 capsule은 식균작용을 저해하는 대표적인 면역회피 인자다.', '문항의 C. pneumoniae 표기는 S. pneumoniae의 협막을 가리키는 복원 오기로 정정했다.', '', {1:'S. pneumoniae 협막은 opsonization과 식균을 방해하므로 옳다.'});
  add('10-11-2021-1', '바이러스는 DNA 또는 RNA 중 하나의 genome을 가지며, ribosome·ATP 생성계가 없고 이분법으로 증식하지 않는다. 인터페론은 숙주세포에 항바이러스 상태를 유도한다.', '따라서 복원된 1~5번에서 단일 “옳지 않은 것”을 확정할 수 없다.', '정답 미확정으로 채점하지 않는다.', {1:'완전한 virion의 genome은 DNA 또는 RNA 중 하나다.',2:'바이러스는 자체 ATP 생성 효소계를 갖지 않는다.',3:'바이러스는 ribosome을 갖지 않는다.',4:'바이러스 증식은 숙주세포 안에서의 조립 과정이지 이분법이 아니다.',5:'인터페론은 숙주세포의 항바이러스 반응과 연결되는 표현으로 이 복원문만으로 오답 처리할 수 없다.'});
  add('12-2025-38', '정상균무리는 부착 부위와 영양분을 선점해 colonization resistance를 만들고, 먹이 경쟁으로 병원체를 억제한다. 따라서 1·5번이 모두 맞다.', '기존 단일 정답은 정상균무리의 두 대표 방어기전을 함께 묻는 발문과 맞지 않아 복수정답으로 수정했다.', '', {1:'정상균은 병원체의 상피세포 부착을 막아 colonization resistance에 기여한다.',2:'정상균이 숙주 상피세포 안으로 침투해 방어한다는 설명은 아니다.',3:'정상균이 모든 병원체를 억제하는 것은 아니다.',4:'억제 기전은 경쟁·산성화·bacteriocin·면역자극 등 다양하다.',5:'영양분 경쟁은 정상균무리의 대표 방어기전이다.'});
  add('13-2023-47', 'Influenza HA–sialic acid, HIV gp120–CD4, rabies G–NCAM은 모두 올바른 부착 단백질–수용체 연결이다.', '단일 정답으로 복원된 문항이지만 실제로 1·4·5번이 모두 맞으므로 복수정답으로 교정했다.', '', {1:'Influenza HA가 sialic acid에 결합하는 연결은 옳다.',2:'잘못된 바이러스 단백질 또는 수용체 연결이다.',3:'잘못된 바이러스 단백질 또는 수용체 연결이다.',4:'HIV gp120이 CD4에 결합하는 연결은 옳다.',5:'Rabies virus G가 NCAM과 결합하는 연결은 옳다.'});
  add('14-2023-51', '고농도 인플루엔자 감염에서 DIP가 축적되는 von Magnus phenomenon은 interference와 관련된다.', 'DIP는 정상 바이러스의 복제·포장 자원을 경쟁해 infectivity를 낮추지만, 이를 일반적인 “virus의 competitive inhibition”이라고 부르는 것은 강의록의 기전명과 맞지 않는다.', '', {1:'Interference와 관련된 설명이므로 옳다.',2:'이 현상은 von Magnus phenomenon으로 불린다.',3:'DIP 형성은 이 현상의 핵심 설명이므로 옳다.',4:'일반적인 competitive inhibition이라는 명명은 강의록의 설명과 맞지 않아 오답이다.'});
  add('16-2020-77', 'Acyclovir는 viral thymidine kinase에 의해 인산화되어 활성형이 되고, 이후 viral DNA polymerase를 억제해 사슬종결을 일으킨다.', 'Thymidine kinase를 억제하는 약이라고 쓰면 기전의 방향이 반대다.', '', {3:'Acyclovir는 viral thymidine kinase가 활성화에 관여하는 대표 약물이다.'});
  add('21-2023-80', '강의록은 박쥐에서 coronavirus 계통이 가장 많고, 높은 interferon·낮은 염증반응, Robovirus의 설치류-호흡기 전파, 쥐·박쥐의 reservoir 역할을 함께 설명한다.', '따라서 복원된 1~5번은 모두 강의록과 부합해 단일 오답을 정할 수 없다.', '정답 미확정으로 채점하지 않는다.', {1:'강의록은 박쥐 virome에서 coronavirus 계통이 가장 많다고 설명한다.',2:'박쥐는 coronavirus·henipavirus·filovirus 등 여러 바이러스와 연결된다.',3:'높은 interferon과 억제된 염증반응은 박쥐가 많은 바이러스와 공존하는 설명이다.',4:'Robovirus는 설치류에서 주로 호흡기로 전파되는 것으로 강의록에 제시된다.',5:'쥐와 박쥐는 대표적인 viral reservoir로 제시된다.'});

  window.PAST_EXAM_EXPLANATIONS = explanations;
})();
