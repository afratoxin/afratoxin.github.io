(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.PredictedQuestionBank=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const BLUEPRINTS=[
    {id:'u01',no:1,title:'미생물학의 역사',categories:[
      {label:'초기 미생물학자와 업적',pairs:[
        ['Robert Hooke','코르크 절편을 관찰하고 cell이라는 용어를 사용했다.'],
        ['Antonie van Leeuwenhoek','현미경으로 살아 있는 미생물을 처음 관찰했다.'],
        ['Edward Jenner','우두를 이용해 천연두 예방접종을 시행했다.'],
        ['Louis Pasteur','자연발생설을 부정하고 발효의 미생물 원인을 밝혔다.'],
        ['Robert Koch','순수배양법과 감염병 원인 규명 원칙을 확립했다.']
      ]},
      {label:'미생물군의 핵심 특징',pairs:[
        ['세균','펩티도글리칸 세포벽을 지닌 단세포 원핵생물이다.'],
        ['바이러스','DNA 또는 RNA 중 하나를 가지며 세포 밖에서는 증식하지 못한다.'],
        ['진균','키틴 세포벽을 지니고 영양분을 흡수하는 진핵생물이다.'],
        ['원충','세포벽이 없는 단세포 진핵생물로 운동성을 보일 수 있다.'],
        ['연충','다세포성 기생동물로 원충과 구별되는 기생충이다.']
      ]},
      {label:'노벨상과 주요 성과',pairs:[
        ['Fleming·Chain·Florey','penicillin의 발견과 치료 효과 확립에 기여했다.'],
        ['Selman Waksman','streptomycin을 발견해 결핵 치료에 기여했다.'],
        ['Marshall·Warren','Helicobacter pylori와 위염·소화성 궤양의 관계를 밝혔다.'],
        ['Harald zur Hausen','HPV가 자궁경부암의 원인임을 규명했다.'],
        ['Karikó·Weissman','mRNA 백신에 쓰이는 변형 뉴클레오사이드 기반을 마련했다.']
      ]}
    ]},
    {id:'u02',no:2,title:'세균의 분류 및 동정',categories:[
      {label:'분류학 용어',pairs:[
        ['Classification','공통 특성에 따라 생물을 여러 집단으로 배열하는 과정이다.'],
        ['Nomenclature','정해진 규칙에 따라 생물의 이름을 부여하는 과정이다.'],
        ['Identification','미지의 균이 어느 분류군에 속하는지 판정하는 과정이다.'],
        ['Species','여러 특성을 공유하는 기본적인 세균 분류 단위이다.'],
        ['Strain','한 종 안에서 특정 분리주를 구별하는 세부 단위이다.']
      ]},
      {label:'원핵세포와 진핵세포 비교',pairs:[
        ['핵 구조','원핵세포에는 핵막이 없고 진핵세포에는 핵막이 있다.'],
        ['리보솜','원핵세포는 70S, 진핵세포 세포질은 80S 리보솜을 가진다.'],
        ['염색체','원핵세포는 주로 원형, 진핵세포는 주로 선형 염색체를 가진다.'],
        ['세포 분열','원핵세포는 이분법, 진핵세포는 유사분열을 주로 이용한다.'],
        ['막성 소기관','원핵세포에는 없고 진핵세포에는 다양한 종류가 존재한다.']
      ]},
      {label:'세균 분류 방법',pairs:[
        ['표현형적 분류','형태·염색·생화학적 특성처럼 관찰 가능한 형질을 이용한다.'],
        ['수치 분류학','많은 형질에 같은 가중치를 주어 전체 유사도를 계산한다.'],
        ['유전적 분류','핵산의 염기서열과 유전적 유사성을 비교한다.'],
        ['분석적 분류','혈청형·파지형 등으로 종보다 더 세부적으로 구분한다.'],
        ['시계 분자','진화 속도가 비교적 일정한 보존 서열로 계통을 비교한다.']
      ]}
    ]},
    {id:'u03',no:3,title:'세균의 형태·미세구조·합성',categories:[
      {label:'세포질 내부 구조',pairs:[
        ['세균 염색체','주로 하나의 원형 이중가닥 DNA로 핵양체에 존재한다.'],
        ['Plasmid','염색체와 독립적으로 복제되는 부가 유전 요소이다.'],
        ['Ribosome','70S 크기로 단백질 합성이 일어나는 장소이다.'],
        ['Cytoplasmic membrane','선택적 투과와 호흡·에너지 생성에 관여한다.'],
        ['Inclusion body','영양분이나 무기 물질을 세포질에 저장하는 구조이다.']
      ]},
      {label:'세포 외부 구조',pairs:[
        ['Capsule','식균작용을 방해하고 부착을 돕는 glycocalyx 구조이다.'],
        ['Biofilm','세균 집단을 둘러싸 항균제와 숙주 방어로부터 보호한다.'],
        ['Flagellum','세균의 운동성과 주화성에 관여하는 긴 부속기관이다.'],
        ['Fimbria','표면이나 숙주 세포에 부착하는 짧고 많은 돌기이다.'],
        ['Endospore','Ca-dipicolinate를 포함해 열과 건조에 강한 휴면 구조이다.']
      ]},
      {label:'세포벽 구성 요소',pairs:[
        ['두꺼운 peptidoglycan','그람양성균에서 여러 층으로 발달한 세포벽 골격이다.'],
        ['Teichoic acid','그람양성균 세포벽에 존재하는 음전하성 중합체이다.'],
        ['Outer membrane','그람음성균에서 porin과 LPS를 포함하는 바깥막이다.'],
        ['Lipid A','LPS에서 endotoxin 작용을 담당하는 지질 부분이다.'],
        ['Periplasm','그람음성균의 두 막 사이에 효소 등이 존재하는 공간이다.']
      ]}
    ]},
    {id:'u04',no:4,title:'세균의 증식과 배양',categories:[
      {label:'탄소원·에너지원에 따른 분류',pairs:[
        ['Photoautotroph','빛을 에너지원으로, CO₂를 주된 탄소원으로 이용한다.'],
        ['Chemoautotroph','무기물 산화를 에너지원으로, CO₂를 탄소원으로 이용한다.'],
        ['Photoheterotroph','빛을 에너지원으로, 유기물을 탄소원으로 이용한다.'],
        ['Chemoheterotroph','유기물 산화를 에너지원과 탄소원으로 함께 이용한다.'],
        ['Fastidious bacterium','성장에 여러 유기 영양소나 특수 성장인자를 요구한다.']
      ]},
      {label:'산소 요구도',pairs:[
        ['Obligate aerobe','산소가 있어야 증식하며 catalase와 SOD를 가진다.'],
        ['Facultative anaerobe','산소가 있으면 호흡하고 없어도 발효 등으로 증식한다.'],
        ['Obligate anaerobe','산소에 노출되면 손상되어 산소 없는 곳에서 증식한다.'],
        ['Microaerophile','대기보다 낮은 농도의 산소에서 가장 잘 증식한다.'],
        ['Aerotolerant anaerobe','산소를 이용하지 않지만 산소 존재를 견딜 수 있다.']
      ]},
      {label:'세균 성장 단계',pairs:[
        ['Lag phase','세포 수 증가는 적지만 새 환경에 적응하며 효소를 합성한다.'],
        ['Log phase','일정한 세대시간으로 빠르게 분열해 세포 수가 증가한다.'],
        ['Stationary phase','증식 세포 수와 사멸 세포 수가 대체로 균형을 이룬다.'],
        ['Death phase','생존 세포 수가 감소하며 로그 형태의 사멸을 보인다.'],
        ['Binary fission','DNA 복제 뒤 격막을 형성해 두 딸세포로 나뉜다.']
      ]}
    ]},
    {id:'u05',no:5,title:'세균의 대사와 유전학',categories:[
      {label:'대사와 에너지 생성',pairs:[
        ['Catabolism','복잡한 물질을 분해하면서 에너지와 전구체를 얻는 과정이다.'],
        ['Anabolism','에너지를 사용해 작은 전구체로 세포 성분을 합성하는 과정이다.'],
        ['Aerobic respiration','산소를 최종 전자수용체로 사용해 ATP를 생성한다.'],
        ['Fermentation','외부 전자수용체 없이 유기물을 환원해 NAD⁺를 재생한다.'],
        ['Substrate-level phosphorylation','고에너지 기질에서 ADP로 인산기를 직접 전달한다.']
      ]},
      {label:'세균 유전 요소',pairs:[
        ['Chromosome','생존과 증식에 필요한 핵심 유전자를 주로 담고 있다.'],
        ['Plasmid','내성·독성 등 선택적 이점을 주는 유전자를 가질 수 있다.'],
        ['Operon','관련 유전자들이 하나의 조절 단위로 함께 전사된다.'],
        ['Sigma factor','RNA polymerase가 특정 promoter를 인식하도록 돕는다.'],
        ['Transposon','한 세포 안에서 위치를 옮길 수 있는 이동성 DNA 요소이다.']
      ]},
      {label:'유전자 이동 기전',pairs:[
        ['Transformation','주변 환경에 존재하는 유리 DNA를 세균이 받아들인다.'],
        ['Conjugation','세균 간 직접 접촉과 sex pilus를 통해 DNA가 이동한다.'],
        ['Transduction','bacteriophage가 세균 유전물질을 다른 세균으로 운반한다.'],
        ['Transposition','transposon이 동일 세포 내 DNA 위치 사이를 이동한다.'],
        ['Homologous recombination','서열이 유사한 DNA 사이에서 교환이 일어난다.']
      ]}
    ]},
    {id:'u06',no:6,title:'항균제와 항균요법 1',categories:[
      {label:'항균제의 주요 표적',pairs:[
        ['Penicillin','PBP에 결합하여 peptidoglycan 가교 형성을 억제한다.'],
        ['Streptomycin','30S ribosome에 결합해 단백질 번역의 정확성을 떨어뜨린다.'],
        ['Rifampin','세균 DNA-dependent RNA polymerase를 억제한다.'],
        ['Polymyxin B','그람음성균 세포막과 결합해 막 투과성을 손상시킨다.'],
        ['Sulfonamide','PABA 이용을 경쟁적으로 막아 엽산 합성을 억제한다.']
      ]},
      {label:'세포벽 합성 억제제',pairs:[
        ['Penicillins','β-lactam ring을 가지며 PBP의 transpeptidase를 억제한다.'],
        ['Cephalosporins','세대에 따라 그람음성균 범위와 β-lactamase 안정성이 달라진다.'],
        ['Carbapenems','매우 넓은 항균 범위를 지닌 β-lactam 계열 약물이다.'],
        ['Monobactams','단일 β-lactam 고리를 가지며 주로 호기성 그람음성균에 작용한다.'],
        ['Vancomycin','D-Ala-D-Ala 말단에 결합하여 세포벽 합성을 막는다.']
      ]},
      {label:'항균력 평가 개념',pairs:[
        ['Selective toxicity','숙주보다 미생물에 더 큰 독성을 나타내는 성질이다.'],
        ['MIC','눈에 보이는 세균 증식을 억제하는 최소 항균제 농도이다.'],
        ['MBC','배양 가능한 세균을 사멸시키는 최소 항균제 농도이다.'],
        ['Bacteriostatic effect','세균의 증식을 멈추게 하지만 즉시 사멸시키지는 않는다.'],
        ['Bactericidal effect','세균의 생존 능력을 잃게 하여 직접 사멸시킨다.']
      ]}
    ]},
    {id:'u07',no:7,title:'항균제와 항균요법 2',categories:[
      {label:'단백질 합성 억제제',pairs:[
        ['Aminoglycosides','30S에 비가역적으로 결합해 mRNA 오독을 유발한다.'],
        ['Tetracyclines','aminoacyl-tRNA가 30S A site에 결합하는 것을 막는다.'],
        ['Macrolides','50S에 결합해 peptide의 translocation을 억제한다.'],
        ['Chloramphenicol','50S의 peptidyl transferase 활성을 억제한다.'],
        ['Linezolid','50S와 결합해 번역 개시 복합체 형성을 억제한다.']
      ]},
      {label:'유전적 항균제 내성',pairs:[
        ['표적 변형','수용체나 효소 구조가 변해 항균제 결합이 감소한다.'],
        ['약물 불활성화','β-lactamase 같은 효소가 항균제를 분해하거나 변형한다.'],
        ['투과성 감소','porin 감소 등으로 세포 안으로 들어오는 약물량이 줄어든다.'],
        ['Efflux pump 증가','세포 안으로 들어온 항균제를 능동적으로 배출한다.'],
        ['대체 경로 사용','억제된 대사 단계를 우회하는 효소나 경로를 이용한다.']
      ]},
      {label:'비유전적 생존 상태',pairs:[
        ['Persistence','일부 휴면 세균이 약물에 살아남지만 MIC 자체는 변하지 않는다.'],
        ['Tolerance','집단 전체의 사멸 속도가 느려져 약물 노출을 오래 견딘다.'],
        ['Heteroresistance','내성 소집단이 일시적으로 증가했다가 약물 제거 후 줄어든다.'],
        ['Biofilm survival','세포외 기질과 느린 성장으로 항균제 침투와 작용이 감소한다.'],
        ['Intracellular survival','숙주 세포 안에 숨어 약물과 면역 반응의 접근을 피한다.']
      ]}
    ]},
    {id:'u08',no:8,title:'병인론 1: 전파 및 침입경로',categories:[
      {label:'숙주 침입 경로',pairs:[
        ['Respiratory tract','비말이나 공기 중 입자가 호흡기 점막에 도달한다.'],
        ['Gastrointestinal tract','오염된 음식·물을 통해 소화관 점막으로 들어온다.'],
        ['Urogenital tract','성접촉이나 상행성 경로로 비뇨생식기에 침입한다.'],
        ['Broken skin','상처·절지동물 물림·동물 교상으로 장벽을 통과한다.'],
        ['Transplacental route','임신 중 병원체가 태반을 넘어 태아에 전달된다.']
      ]},
      {label:'전파 방식',pairs:[
        ['Direct contact','감염자와의 피부·점막 접촉으로 직접 전달된다.'],
        ['Droplet transmission','큰 호흡기 비말이 짧은 거리에서 점막에 도달한다.'],
        ['Airborne transmission','작은 비말핵이나 먼지가 공기 중에 오래 떠서 전달된다.'],
        ['Vehicle transmission','음식·물·혈액 같은 공통 매개물을 통해 전달된다.'],
        ['Vector transmission','절지동물이 병원체를 사람에게 운반하거나 증식시킨다.']
      ]},
      {label:'숙주 방어 회피',pairs:[
        ['Capsule formation','식세포의 인식과 포식 작용을 방해한다.'],
        ['Antigenic variation','표면 항원을 바꾸어 기존 항체의 인식을 피한다.'],
        ['IgA protease','점막의 분비형 IgA를 절단해 부착과 침입을 돕는다.'],
        ['Intracellular escape','phagosome 또는 lysosome의 살균 작용을 회피한다.'],
        ['Molecular mimicry','숙주 분자와 유사한 표면을 이용해 면역 인식을 줄인다.']
      ]}
    ]},
    {id:'u09',no:9,title:'병인론 2: 세균',categories:[
      {label:'세균성 병원성 인자',pairs:[
        ['Adhesin','숙주 세포의 특정 수용체에 결합해 집락화를 시작한다.'],
        ['Invasin','숙주 세포나 조직 장벽을 통과하는 침입을 촉진한다.'],
        ['Exotoxin','세균이 분비하는 단백질로 특정 세포 기능을 교란한다.'],
        ['Endotoxin','그람음성균 LPS의 lipid A가 전신 염증을 유발한다.'],
        ['Superantigen','TCR과 MHC II를 비특이적으로 연결해 T세포를 과활성화한다.']
      ]},
      {label:'Staphylococcus aureus 병원성',pairs:[
        ['Protein A','IgG의 Fc 부위에 결합해 opsonization을 방해한다.'],
        ['Coagulase','fibrin 형성을 유도해 세균 주변에 보호막을 만든다.'],
        ['Leukocidin','백혈구의 세포막을 손상시켜 면역세포를 죽인다.'],
        ['Exfoliative toxin','표피 세포 사이 결합을 끊어 피부 박리를 일으킨다.'],
        ['Enterotoxin','열에 안정한 독소로 짧은 잠복기의 식중독을 일으킨다.']
      ]},
      {label:'Streptococcus pyogenes 병원성',pairs:[
        ['M protein','식균작용을 방해하며 균주의 항원형을 결정한다.'],
        ['Streptolysin O','산소에 불안정한 용혈소로 ASO 항체 검사의 표적이 된다.'],
        ['Streptokinase','plasminogen을 plasmin으로 바꾸어 혈전을 용해한다.'],
        ['Hyaluronidase','결합조직의 hyaluronic acid를 분해해 확산을 돕는다.'],
        ['Pyrogenic exotoxin','superantigen으로 작용해 성홍열과 독성쇼크에 관여한다.']
      ]}
    ]},
    {id:'u10',no:10,title:'바이러스의 구조와 분류 1',categories:[
      {label:'바이러스 입자 구조',pairs:[
        ['Capsid','바이러스 핵산을 둘러싸 보호하는 단백질 껍질이다.'],
        ['Capsomere','capsid를 이루는 반복적인 형태학적 단위이다.'],
        ['Envelope','숙주 세포막에서 유래한 지질 이중층 구조이다.'],
        ['Matrix protein','capsid와 envelope 사이를 연결하고 조립을 돕는다.'],
        ['Attachment protein','숙주 수용체를 인식해 세포 tropism을 결정한다.']
      ]},
      {label:'대표 DNA 바이러스',pairs:[
        ['Parvoviridae','작은 선형 ssDNA를 가진 naked capsid 바이러스이다.'],
        ['Papillomaviridae','원형 dsDNA를 가진 naked capsid 바이러스이다.'],
        ['Adenoviridae','선형 dsDNA를 가진 naked capsid 바이러스이다.'],
        ['Herpesviridae','선형 dsDNA와 envelope를 가진 바이러스이다.'],
        ['Poxviridae','선형 dsDNA와 복잡한 envelope 구조를 가진 바이러스이다.']
      ]},
      {label:'Naked RNA 바이러스군',pairs:[
        ['Picornaviridae','비분절 +ssRNA를 가지며 poliovirus가 포함된다.'],
        ['Caliciviridae','비분절 +ssRNA를 가지며 norovirus가 포함된다.'],
        ['Hepeviridae','비분절 +ssRNA를 가지며 hepatitis E virus가 포함된다.'],
        ['Astroviridae','비분절 +ssRNA를 가지며 소아 위장염을 일으킬 수 있다.'],
        ['Reoviridae','분절된 dsRNA를 가지며 rotavirus가 포함된다.']
      ]}
    ]},
    {id:'u11',no:11,title:'바이러스의 구조와 분류 2',categories:[
      {label:'주요 enveloped RNA 바이러스군',pairs:[
        ['Orthomyxoviridae','분절된 -ssRNA를 가지며 influenza virus가 포함된다.'],
        ['Paramyxoviridae','비분절 -ssRNA를 가지며 measles virus와 RSV가 포함된다.'],
        ['Rhabdoviridae','총알 모양의 비분절 -ssRNA를 가지며 rabies virus가 포함된다.'],
        ['Retroviridae','두 벌의 +ssRNA와 reverse transcriptase를 가진다.'],
        ['Coronaviridae','큰 비분절 +ssRNA와 돌기 모양 spike를 가진다.']
      ]},
      {label:'바이러스 복제 예외',pairs:[
        ['Poxvirus','DNA 바이러스이지만 세포질에서 복제하며 자체 RNA polymerase를 지닌다.'],
        ['Influenza virus','RNA 바이러스이지만 전사와 genome 복제 일부가 핵에서 일어난다.'],
        ['Retrovirus','+ssRNA를 DNA로 역전사한 뒤 숙주 genome에 통합한다.'],
        ['Hepadnavirus','부분 이중가닥 DNA를 RNA 중간체를 거쳐 역전사한다.'],
        ['Parvovirus','숙주 DNA 합성 기능이 필요해 주로 분열 중인 세포에서 복제한다.']
      ]},
      {label:'바이러스 방출 방식',pairs:[
        ['Influenza A virus','숙주 세포막에서 budding하여 envelope를 얻는다.'],
        ['HIV','plasma membrane에서 budding하면서 envelope를 획득한다.'],
        ['Herpes simplex virus','핵막과 세포 내 막계를 거쳐 enveloped virion으로 방출된다.'],
        ['Poliovirus','naked capsid 입자로 조립된 뒤 주로 세포 lysis로 방출된다.'],
        ['Adenovirus','naked capsid 입자로 축적된 뒤 주로 세포 lysis로 방출된다.']
      ]}
    ]},
    {id:'u12',no:12,title:'정상균무리와 감염',categories:[
      {label:'정상균무리의 기능',pairs:[
        ['Colonization resistance','영양분과 부착 부위를 경쟁해 병원체 정착을 막는다.'],
        ['Metabolic function','소화되지 않은 성분을 대사하고 유용한 대사산물을 만든다.'],
        ['Vitamin production','일부 장내 세균이 vitamin K와 특정 vitamin B를 합성한다.'],
        ['Immune homeostasis','면역계 성숙과 조절성 면역 반응의 균형을 돕는다.'],
        ['Barrier maintenance','상피 장벽과 점액층의 정상 기능을 유지하도록 돕는다.']
      ]},
      {label:'신체 부위별 대표 정상균',pairs:[
        ['피부','Staphylococcus epidermidis가 대표적인 상재균이다.'],
        ['비강','Staphylococcus aureus가 보균될 수 있는 주요 부위이다.'],
        ['구강','viridans streptococci가 흔히 존재하는 정상균무리이다.'],
        ['대장','Bacteroides를 포함한 혐기성 세균이 매우 풍부하다.'],
        ['질','Lactobacillus가 산성 환경 유지에 중요한 역할을 한다.']
      ]},
      {label:'Dysbiosis와 질환',pairs:[
        ['Clostridioides difficile infection','항생제 사용 후 정상 장내균총 붕괴와 연관된다.'],
        ['Bacterial vaginosis','Lactobacillus 감소와 다양한 혐기성 세균 증가가 특징이다.'],
        ['Dental caries','Streptococcus mutans의 산 생성과 biofilm이 관여한다.'],
        ['Inflammatory bowel disease','장내 미생물 불균형과 비정상 면역 반응이 연관된다.'],
        ['Opportunistic infection','면역 저하나 장벽 손상 때 상재균이 질병을 일으킬 수 있다.']
      ]}
    ]},
    {id:'u13',no:13,title:'바이러스의 증식 및 배양',categories:[
      {label:'바이러스 증식 단계',pairs:[
        ['Attachment','바이러스 단백질이 숙주 세포의 특정 receptor에 결합한다.'],
        ['Penetration','바이러스 입자 또는 genome이 세포 안으로 들어간다.'],
        ['Uncoating','capsid가 제거되어 바이러스 genome이 노출된다.'],
        ['Biosynthesis','바이러스 핵산과 단백질이 숙주 세포 안에서 합성된다.'],
        ['Release','완성된 virion이 lysis 또는 budding으로 세포에서 나온다.']
      ]},
      {label:'바이러스 침투 기전',pairs:[
        ['HIV','gp120-CD4·coreceptor 결합 뒤 gp41이 막 융합을 일으킨다.'],
        ['Influenza virus','receptor-mediated endocytosis 뒤 낮은 pH에서 막 융합한다.'],
        ['Poliovirus','receptor 결합 뒤 capsid 변화로 RNA를 세포질에 전달한다.'],
        ['Adenovirus','endocytosis 후 endosome을 탈출해 capsid가 핵공으로 이동한다.'],
        ['Herpes simplex virus','envelope와 세포막이 융합해 nucleocapsid가 유입된다.']
      ]},
      {label:'바이러스 배양계',pairs:[
        ['Experimental animal','면역반응과 병인론을 생체 수준에서 관찰할 수 있다.'],
        ['Embryonated egg','막과 강을 이용해 일부 바이러스를 증식·분리할 수 있다.'],
        ['Primary cell culture','실제 조직과 유사하지만 passage 횟수가 제한적이다.'],
        ['Diploid cell strain','정상 염색체 수를 유지하며 약 50~100회 계대할 수 있다.'],
        ['Continuous cell line','종양 유래가 많고 장기간 지속적으로 계대할 수 있다.']
      ]}
    ]},
    {id:'u14',no:14,title:'바이러스의 유전학',categories:[
      {label:'바이러스 돌연변이',pairs:[
        ['Silent mutation','염기서열은 변하지만 아미노산 서열은 변하지 않는다.'],
        ['Missense mutation','코돈 변화로 단백질의 한 아미노산이 바뀐다.'],
        ['Nonsense mutation','종결 코돈이 생겨 짧아진 단백질이 만들어진다.'],
        ['Deletion mutation','일부 염기서열이 소실되어 유전자 기능이 변할 수 있다.'],
        ['Temperature-sensitive mutation','특정 온도에서만 증식 가능한 조건부 표현형을 만든다.']
      ]},
      {label:'바이러스 genetic exchange',pairs:[
        ['Recombination','두 genome의 핵산 가닥이 끊기고 다시 연결되어 서열이 섞인다.'],
        ['Reassortment','분절 genome을 가진 두 바이러스 사이에서 분절이 재배열된다.'],
        ['Complementation','한 바이러스의 단백질이 다른 바이러스의 결함을 보완한다.'],
        ['Phenotypic mixing','한 바이러스 genome이 다른 바이러스 유래 외피·capsid에 싸인다.'],
        ['Multiplicity reactivation','손상된 여러 genome이 한 세포에서 서로 기능을 보완한다.']
      ]},
      {label:'Influenza 유전 변화',pairs:[
        ['Antigenic drift','점돌연변이가 축적되어 HA·NA 항원이 점진적으로 변한다.'],
        ['Antigenic shift','서로 다른 influenza A의 분절 재배열로 큰 항원 변화가 생긴다.'],
        ['Segmented genome','여덟 RNA 분절이 reassortment가 가능한 구조적 기반을 제공한다.'],
        ['Animal mixing host','서로 다른 숙주 유래 바이러스의 동시 감염 기회를 제공한다.'],
        ['Cold-adapted mutant','낮은 온도에서 증식하도록 선별되어 생백신에 활용될 수 있다.']
      ]}
    ]},
    {id:'u15',no:15,title:'병인론 3: 바이러스',categories:[
      {label:'바이러스 감염 양상',pairs:[
        ['Acute infection','짧은 기간 급격히 증식한 뒤 제거되거나 숙주가 사망한다.'],
        ['Latent infection','genome이 남아 있다가 재활성화되어 감염성 입자를 만든다.'],
        ['Chronic infection','바이러스가 지속적으로 생성되며 장기간 검출된다.'],
        ['Slow infection','긴 잠복기 뒤 점진적인 증상 악화가 나타난다.'],
        ['Transforming infection','세포 성장 조절을 변화시켜 종양 발생에 기여한다.']
      ]},
      {label:'체내 확산 경로',pairs:[
        ['Local spread','초기 감염 부위 주변의 인접 세포와 조직으로 퍼진다.'],
        ['Primary viremia','초기 증식 뒤 바이러스가 처음 혈액으로 들어간 상태이다.'],
        ['Secondary viremia','표적 장기에서 재증식한 바이러스가 다시 혈액에 나타난다.'],
        ['Neural spread','말초신경을 따라 역행성 또는 순행성으로 이동한다.'],
        ['Transplacental spread','모체의 바이러스가 태반을 통과해 태아에 도달한다.']
      ]},
      {label:'항바이러스 면역',pairs:[
        ['Type I interferon','감염 세포와 주변 세포에 항바이러스 상태를 유도한다.'],
        ['NK cell','MHC I 발현이 감소한 감염 세포를 초기에 제거한다.'],
        ['Cytotoxic T cell','바이러스 peptide-MHC I를 인식해 감염 세포를 사멸한다.'],
        ['Neutralizing antibody','세포 부착이나 침투를 막아 새로운 감염을 차단한다.'],
        ['Mx protein','interferon으로 유도되어 일부 바이러스의 virion assembly를 억제한다.']
      ]}
    ]},
    {id:'u16',no:16,title:'항바이러스제',categories:[
      {label:'Herpesvirus 치료제',pairs:[
        ['Acyclovir','viral thymidine kinase로 활성화되어 viral DNA polymerase를 억제한다.'],
        ['Ganciclovir','주로 CMV 감염에 사용하며 DNA polymerase를 억제한다.'],
        ['Foscarnet','활성화 인산화 없이 pyrophosphate 결합 부위에 직접 작용한다.'],
        ['Cidofovir','nucleotide analog로 viral thymidine kinase 없이 활성화될 수 있다.'],
        ['Letermovir','CMV terminase complex를 억제해 genome 절단·포장을 방해한다.']
      ]},
      {label:'호흡기 바이러스 치료제',pairs:[
        ['Oseltamivir','influenza neuraminidase를 억제해 새 virion의 방출을 막는다.'],
        ['Zanamivir','흡입 투여하는 neuraminidase inhibitor로 influenza에 사용한다.'],
        ['Baloxavir','influenza cap-dependent endonuclease를 억제해 전사를 막는다.'],
        ['Remdesivir','adenosine nucleotide analog로 viral RdRp를 억제한다.'],
        ['Baricitinib','JAK1/2를 억제해 COVID-19의 과도한 염증 반응을 낮춘다.']
      ]},
      {label:'HIV 치료 표적',pairs:[
        ['NRTI','기질 유사체로 작용해 reverse transcription 중 사슬 연장을 끝낸다.'],
        ['NNRTI','reverse transcriptase의 비활성 부위에 결합해 효소 기능을 바꾼다.'],
        ['Protease inhibitor','viral polyprotein 절단을 막아 성숙한 virion 형성을 방해한다.'],
        ['Integrase inhibitor','proviral DNA가 숙주 염색체에 통합되는 단계를 막는다.'],
        ['Entry inhibitor','coreceptor 결합이나 membrane fusion을 막아 세포 진입을 차단한다.']
      ]}
    ]},
    {id:'u17',no:17,title:'진균의 일반적 특성',categories:[
      {label:'진균의 구조와 생장',pairs:[
        ['Ergosterol','진균 세포막의 대표 sterol로 여러 항진균제의 표적이 된다.'],
        ['Chitin','진균 세포벽을 구성하는 N-acetylglucosamine 중합체이다.'],
        ['Hypha','길게 뻗는 관 모양 구조로 모여 mycelium을 형성한다.'],
        ['Yeast','주로 단세포 형태이며 budding 또는 fission으로 증식한다.'],
        ['Dimorphism','환경 조건에 따라 yeast와 mold 형태를 바꾸는 성질이다.']
      ]},
      {label:'진균 분류와 특징',pairs:[
        ['Glomeromycota (Mucormycetes)','넓고 격벽이 드문 hypha와 zygospore 형성이 특징이다.'],
        ['Ascomycota','주머니 모양 ascus 안에 ascospore를 형성한다.'],
        ['Basidiomycota','basidium에서 basidiospore를 만들고 dolipore를 가질 수 있다.'],
        ['Deuteromycota','유성 생식 단계가 알려지지 않아 불완전균으로 분류되었다.'],
        ['Woronin body','Ascomycota의 격벽 구멍을 막을 수 있는 형태학적 표지이다.']
      ]},
      {label:'감염 부위에 따른 진균증',pairs:[
        ['Superficial mycosis','각질층이나 모발 가장 바깥 부분에 국한된다.'],
        ['Cutaneous mycosis','피부·모발·손발톱의 keratinized tissue를 침범한다.'],
        ['Subcutaneous mycosis','외상으로 진균이 피하조직에 주입되어 발생한다.'],
        ['Systemic mycosis','주로 흡입 후 폐에서 시작해 다른 장기로 퍼질 수 있다.'],
        ['Opportunistic mycosis','면역 저하나 정상 장벽 손상에서 침습적으로 발생한다.']
      ]}
    ]},
    {id:'u18',no:18,title:'소독과 멸균',categories:[
      {label:'감염관리 용어',pairs:[
        ['Sterilization','세균 아포를 포함한 모든 형태의 미생물을 제거하거나 사멸한다.'],
        ['Disinfection','무생물 표면의 병원성 미생물을 줄이지만 아포 제거는 보장하지 않는다.'],
        ['Antisepsis','살아 있는 피부·조직에서 미생물 수를 안전한 수준으로 줄인다.'],
        ['Asepsis','미생물 오염이 없는 상태를 만들고 유지하는 개념이다.'],
        ['Sanitization','공중보건 기준에 맞게 미생물 수를 낮추는 세척 과정이다.']
      ]},
      {label:'물리적 멸균·소독법',pairs:[
        ['Autoclave','고압 포화증기로 아포를 포함한 미생물을 멸균한다.'],
        ['Dry heat','고온의 건조 공기로 산화와 탈수를 일으켜 멸균한다.'],
        ['Filtration','열에 약한 액체나 공기에서 미생물을 물리적으로 제거한다.'],
        ['Ultraviolet light','pyrimidine dimer를 유발하며 투과력이 낮아 표면 소독에 적합하다.'],
        ['Ionizing radiation','DNA 절단과 radical 생성을 통해 포장 물품도 멸균할 수 있다.']
      ]},
      {label:'화학적 살균제',pairs:[
        ['70% ethanol','단백질 변성과 막 손상으로 작용하지만 아포에는 효과가 낮다.'],
        ['Chlorine compounds','산화 작용이 강하며 유기물이 많으면 효과가 감소한다.'],
        ['Glutaraldehyde','내시경 등에 쓰이는 고수준 소독제로 충분한 노출 시 아포에도 작용한다.'],
        ['Ethylene oxide','열과 습기에 약한 의료기구를 저온에서 멸균한다.'],
        ['Quaternary ammonium','세포막을 손상하지만 결핵균·아포·일부 naked virus에는 약하다.']
      ]}
    ]},
    {id:'u19',no:19,title:'감염의 진단 1',categories:[
      {label:'검체 채취 원칙',pairs:[
        ['채취 시점','가능하면 항균제 투여 전에 감염 부위에서 검체를 얻는다.'],
        ['검체 용량','병원체 회수와 반복 검사에 충분한 양을 확보한다.'],
        ['오염 방지','정상균무리가 섞이지 않도록 무균적으로 채취한다.'],
        ['신속 수송','병원체 생존과 구성 변화를 막도록 적절한 조건에서 보낸다.'],
        ['임상 정보','의심 진단·채취 부위·시간·투약 정보를 검사실에 제공한다.']
      ]},
      {label:'세균 염색법',pairs:[
        ['Positive stain','basic dye가 세포 성분에 결합해 세포 자체를 염색한다.'],
        ['Negative stain','India ink나 nigrosin으로 배경을 염색해 윤곽을 본다.'],
        ['Gram stain','세포벽 구조 차이에 따라 보라색과 분홍색으로 구분한다.'],
        ['Acid-fast stain','mycolic acid가 많은 균이 산-알코올 탈색에 저항하는지를 본다.'],
        ['Immunofluorescence','형광 표지 항체로 검체 속 특정 항원을 직접 확인한다.']
      ]},
      {label:'배지의 기능',pairs:[
        ['Enriched medium','혈액 등 영양 성분을 더해 까다로운 균의 증식을 돕는다.'],
        ['Selective medium','억제 물질로 특정 세균군만 선택적으로 자라게 한다.'],
        ['Differential medium','대사 반응에 따른 색 변화 등으로 자란 균을 구별한다.'],
        ['Transport medium','증식을 최소화하면서 검체 속 병원체 생존을 유지한다.'],
        ['Thioglycollate broth','산소를 제거해 혐기성 세균의 검출과 배양을 돕는다.']
      ]}
    ]},
    {id:'u20',no:20,title:'감염의 진단 2',categories:[
      {label:'세포배양과 CPE',pairs:[
        ['Giant cell formation','measles virus·RSV·HSV 등에서 다핵세포로 관찰될 수 있다.'],
        ['Rapid crenation','poliovirus 감염 세포에서 잎 모양 수축으로 관찰될 수 있다.'],
        ['Inclusion body','핵 또는 세포질에 바이러스 성분이 모인 구조로 보일 수 있다.'],
        ['Hemadsorption','감염 세포막의 viral protein에 적혈구가 부착하는 현상이다.'],
        ['Plaque assay','세포 단층의 용해 반점을 세어 감염성 바이러스 양을 구한다.']
      ]},
      {label:'분자생물학적 진단',pairs:[
        ['PCR','특정 DNA 구간을 primer와 DNA polymerase로 증폭한다.'],
        ['RT-PCR','RNA를 cDNA로 바꾼 뒤 표적 염기서열을 증폭한다.'],
        ['Real-time PCR','형광 신호를 매 cycle 측정해 핵산 양을 정량한다.'],
        ['In situ hybridization','표지 probe로 조직 속 특정 핵산의 위치를 확인한다.'],
        ['RFLP','제한효소 절편 길이 pattern 차이로 유전적 변이를 비교한다.']
      ]},
      {label:'면역·혈청학적 진단',pairs:[
        ['ELISA','plate에서 antigen-antibody 반응을 효소 신호로 검출한다.'],
        ['Western blot','분리된 단백질을 특정 antibody로 확인한다.'],
        ['Flow cytometry','형광 항체와 gating으로 세포별 표지 발현을 분석한다.'],
        ['Complement fixation','항체가 있으면 complement가 소모되어 지시 적혈구 용혈이 억제된다.'],
        ['Hemagglutination inhibition','항체가 바이러스의 적혈구 응집을 막는 정도를 측정한다.']
      ]}
    ]},
    {id:'u21',no:21,title:'인수공통감염',categories:[
      {label:'인수공통감염병과 병원체',pairs:[
        ['Brucellosis','Brucella spp.에 의해 발생하는 세균성 인수공통감염병이다.'],
        ['Rabies','Lyssavirus에 의해 발생하는 치명적 신경계 감염병이다.'],
        ['Plague','Yersinia pestis에 의해 발생하며 벼룩이 전파할 수 있다.'],
        ['West Nile fever','Flavivirus가 원인이며 모기가 주요 vector이다.'],
        ['Hantavirus disease','설치류 배설물의 aerosol 노출로 감염될 수 있다.']
      ]},
      {label:'동물 저장소와 연관 바이러스',pairs:[
        ['Bat','rabies·Nipah·여러 coronavirus의 자연 저장소가 될 수 있다.'],
        ['Rodent','hantavirus와 일부 arenavirus를 사람에게 전파할 수 있다.'],
        ['Bird','influenza A와 West Nile virus의 생태에 중요한 숙주이다.'],
        ['Pig','서로 다른 influenza virus가 섞이는 숙주 역할을 할 수 있다.'],
        ['Camel','MERS coronavirus의 사람 감염과 연관된 중간 숙주이다.']
      ]},
      {label:'인수공통감염 전파 유형',pairs:[
        ['Direct zoonosis','한 척추동물 종에서 사람으로 직접 전파되어 생활사가 완성된다.'],
        ['Cyclozoonosis','생활사 완성에 둘 이상의 척추동물 숙주가 필요하다.'],
        ['Metazoonosis','척추동물과 무척추동물 vector가 생활사에 함께 필요하다.'],
        ['Saprozoonosis','척추동물 숙주와 토양·물 같은 비동물성 환경이 필요하다.'],
        ['Xenozoonosis','동물 세포·조직·장기 이식으로 병원체가 전달될 수 있다.']
      ]}
    ]},
    {id:'u22',no:22,title:'감염의 예방: 백신 1',categories:[
      {label:'백신의 제조 유형',pairs:[
        ['Live attenuated vaccine','증식 가능한 약독화 병원체로 강한 장기 면역을 유도한다.'],
        ['Inactivated vaccine','증식하지 못하게 처리한 병원체 전체를 항원으로 사용한다.'],
        ['Subunit vaccine','병원체의 보호 면역에 필요한 특정 성분만 사용한다.'],
        ['Toxoid vaccine','독소의 항원성은 유지하고 독성은 제거해 사용한다.'],
        ['Conjugate vaccine','다당류를 단백질에 결합해 T세포 의존성 반응을 높인다.']
      ]},
      {label:'백신 구성 성분',pairs:[
        ['Antigen','적응면역이 인식해 기억반응을 형성하도록 하는 핵심 성분이다.'],
        ['Adjuvant','선천면역 자극을 높여 항원에 대한 면역반응을 강화한다.'],
        ['Stabilizer','보관·운송 중 항원의 구조와 효능이 유지되도록 돕는다.'],
        ['Preservative','다회용 용기에서 미생물 오염과 증식을 억제한다.'],
        ['Diluent','동결건조 백신 등을 투여 농도로 재구성할 때 사용한다.']
      ]},
      {label:'생백신과 사백신 비교',pairs:[
        ['면역반응의 범위','생백신은 체액성 면역과 세포성 면역을 모두 강하게 유도한다.'],
        ['추가 접종 필요성','사백신은 생백신보다 여러 차례 접종이 필요한 경우가 많다.'],
        ['Adjuvant 필요성','사백신과 subunit 백신은 면역증강제를 쓰는 경우가 많다.'],
        ['면역저하자 사용','생백신은 면역저하자에서 감염 위험 때문에 피하는 경우가 많다.'],
        ['보관 안정성','사백신은 일반적으로 생백신보다 환경 변화에 안정적이다.']
      ]}
    ]},
    {id:'u23',no:23,title:'감염의 예방: 백신 2',categories:[
      {label:'mRNA 백신의 작동',pairs:[
        ['Lipid nanoparticle','mRNA를 분해로부터 보호하고 세포 내 전달을 돕는다.'],
        ['Endosomal escape','흡수된 mRNA가 endosome에서 세포질로 빠져나오게 한다.'],
        ['Cytosolic translation','숙주 ribosome이 세포질에서 mRNA를 항원 단백질로 번역한다.'],
        ['MHC class I presentation','세포 내 생성 항원이 CD8 T세포 반응을 유도할 수 있다.'],
        ['Innate sensing','TLR 등 핵산 감지계가 활성화되어 면역반응에 영향을 준다.']
      ]},
      {label:'백신 평가 지표',pairs:[
        ['Immunogenicity','백신이 항체·T세포 같은 면역반응을 유도하는 능력이다.'],
        ['Efficacy','통제된 임상시험에서 미접종군보다 질병 위험을 줄인 정도이다.'],
        ['Effectiveness','실제 접종 환경에서 질병 부담을 줄이는 정도이다.'],
        ['Herd immunity','면역 인구가 늘어 감염 전파가 감소해 미접종자도 보호받는 현상이다.'],
        ['Safety','접종 이득과 비교해 이상반응의 종류·빈도·중증도를 평가한 결과이다.']
      ]},
      {label:'접종 안전성과 적용',pairs:[
        ['Severe anaphylaxis history','이전 접종이나 구성 성분에 대한 중증 알레르기는 금기이다.'],
        ['Acute mild illness','가벼운 상기도 감염만으로는 대개 접종 금기가 되지 않는다.'],
        ['Adverse event reporting','인과성이 확정되지 않아도 기준에 맞는 접종 후 사건을 신고한다.'],
        ['Pregnancy and live vaccine','태아 감염 가능성 때문에 일부 생백신은 임신 중 피한다.'],
        ['HIV vaccine status','현재 임상적으로 승인되어 사용하는 예방 백신이 없다.']
      ]}
    ]}
  ];

  function rotate(items,amount){
    const n=((amount%items.length)+items.length)%items.length;
    return items.slice(n).concat(items.slice(0,n));
  }

  function placeAnswer(correct,distractors,position,seed){
    const options=rotate(distractors,seed);
    options.splice(position,0,correct);
    return options;
  }

  function buildUnit(unit,unitIndex){
    let questionIndex=0;
    const questions=[];
    unit.categories.forEach((category,categoryIndex)=>{
      category.pairs.forEach((pair,pairIndex)=>{
        const [subject,value]=pair;
        const otherPairs=category.pairs.filter((_,i)=>i!==pairIndex);

        const forwardPosition=questionIndex%5;
        const forwardOptions=placeAnswer(value,otherPairs.map(x=>x[1]),forwardPosition,pairIndex+categoryIndex);
        questions.push({
          id:`${unit.id}-f${categoryIndex+1}-${pairIndex+1}`,
          unitId:unit.id,
          group:category.label,
          kind:'forward',
          prompt:`다음 중 ‘${subject}’와 가장 알맞게 연결된 설명은?`,
          options:forwardOptions,
          answerIndex:forwardPosition,
          explanation:`${subject}는 “${value}”와 연결된다. 같은 범주의 다른 선지는 각각 다른 개념의 설명이므로 구분해야 한다.`,
          optionRationales:forwardOptions.map(option=>{
            const owner=category.pairs.find(x=>x[1]===option)[0];
            return option===value?`정답: ${subject}의 핵심 특징을 정확히 설명한다.`:`오답: 이 설명은 ${owner}에 해당하며 ${subject}의 설명이 아니다.`;
          }),
          source:`${unit.no}강 강의록 · 정리본 · 족보 미출제 보완/유형 변형`
        });
        questionIndex++;

        const reversePosition=questionIndex%5;
        const reverseOptions=placeAnswer(subject,otherPairs.map(x=>x[0]),reversePosition,pairIndex+categoryIndex+1);
        questions.push({
          id:`${unit.id}-r${categoryIndex+1}-${pairIndex+1}`,
          unitId:unit.id,
          group:category.label,
          kind:'reverse',
          prompt:`다음 설명에 해당하는 것은?\n“${value}”`,
          options:reverseOptions,
          answerIndex:reversePosition,
          explanation:`제시된 설명은 ${subject}의 특징이다. 비슷한 범주의 용어가 선지에 함께 제시되므로 대상과 핵심 술어를 함께 기억해야 한다.`,
          optionRationales:reverseOptions.map(option=>{
            const mapped=category.pairs.find(x=>x[0]===option)[1];
            return option===subject?`정답: 제시된 설명과 정확히 일치하는 대상은 ${subject}이다.`:`오답: ${option}은 “${mapped}”와 연결되는 개념이다.`;
          }),
          source:`${unit.no}강 강의록 · 정리본 · 족보 미출제 보완/유형 변형`
        });
        questionIndex++;
      });
    });
    return{id:unit.id,no:unit.no,title:unit.title,questions};
  }

  const units=BLUEPRINTS.map(buildUnit);
  return{version:'2026-09-26',units};
});
