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
        ['Ribavirin','Guanosine 유사체로 일부 RNA 바이러스의 핵산 합성을 방해한다.']
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
        ['Mucorales','넓고 격벽이 드문 균사가 특징인 털곰팡이목 진균이다.'],
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

  const SUPPLEMENTAL={"u01":[{"label":"고전 미생물학의 전환점","pairs":[["John Snow","콜레라 환자의 분포와 오염된 우물의 관계를 추적해 역학 조사에 기여했다."],["Ignaz Semmelweis","산과 진료에서 손 씻기를 권고해 산욕열 감소를 관찰했다."],["Joseph Lister","석탄산을 활용한 수술 소독법을 도입했다."],["미생물의 자연발생설","생명이 무생물에서 저절로 발생한다는 가설로 파스퇴르의 실험이 반박했다."],["Agostino Bassi","누에병이 곰팡이 때문에 생긴다는 근거를 제시했다."]]},{"label":"생물 계통과 세포 구조","pairs":[["Carl Woese","리보솜 RNA 서열 비교를 바탕으로 세 영역 체계를 제안했다."],["Archaea","원핵세포이지만 진정세균의 펩티도글리칸 세포벽을 갖지 않는다."],["알파프로테오박테리아","진핵세포의 미토콘드리아가 유래했을 것으로 추정되는 계통이다."],["시아노박테리아","진핵세포의 엽록체가 유래했을 것으로 추정되는 계통이다."],["LUCA","세균·고세균·진핵생물 계통의 마지막 공통 조상을 가리킨다."]]},{"label":"미생물학과 질병의 발견","pairs":[["Élie Metchnikoff","식세포작용을 연구해 선천면역 이해에 기여했다."],["Paul Ehrlich","매독 치료에 쓰인 비소 화합물의 개발과 화학요법 개념에 기여했다."],["Barry Marshall·Robin Warren","Helicobacter pylori가 위염과 소화성 궤양에 관여한다는 근거를 제시했다."],["Stanley Prusiner","감염성 단백질인 프리온 개념을 제시했다."],["Emil von Behring","디프테리아 항독소 혈청요법에 기여했다."]]}],"u02":[{"label":"명명과 분류 계층","pairs":[["표준균주(type strain)","종명을 정할 때 기준으로 삼는 한 균주이다."],["아종(subspecies)","세균에서 명명학적 지위를 갖는 종 아래의 분류 단위이다."],["혈청형(serotype)","항원성 차이에 따라 같은 종 안의 균을 구별하는 분류 방식이다."],["이명법","속명은 대문자로, 종소명은 소문자로 시작해 두 이름을 함께 쓴다."],["-aceae","세균 분류에서 과(family)의 이름에 붙는 접미사이다."]]},{"label":"계통 분류의 근거","pairs":[["16S rRNA","원핵생물에 널리 존재하고 기능이 보존되어 계통 비교에 쓰인다."],["DNA-DNA hybridization","두 균주의 전체 DNA 관련성을 비교하던 전통적 종 경계 평가법이다."],["Average nucleotide identity","두 유전체의 상동 영역에서 평균 염기서열 일치도를 계산한다."],["GC 함량","염기 조성의 차이를 알려 주지만 이것만으로 종을 동정하기는 어렵다."],["수평 유전자 전달","특정 유전자 하나의 계통도가 전체 생물 계통과 다를 수 있는 이유다."]]},{"label":"실제 동정의 한계","pairs":[["순수배양","혼합 집락을 분리해야 한 균주의 표현형을 해석할 수 있다."],["생화학적 동정","당 분해나 효소 활성처럼 발현된 대사 형질을 비교한다."],["분자 동정","핵산 서열을 비교해 표현형이 비슷한 균도 구별할 수 있다."],["표현형 가변성","같은 유전형이라도 배양 환경에 따라 관찰 형질이 달라질 수 있다."],["균주 수준 분석","같은 종에 속하는 분리주 사이의 역학적 연관성을 평가한다."]]}],"u03":[{"label":"그람염색과 외막","pairs":[["Crystal violet-iodine 복합체","그람염색 탈색 단계에서 세포벽에 남는 정도가 색 차이에 관여한다."],["Safranin","탈색된 그람음성 세균을 붉게 보이도록 하는 대조염료다."],["Porin","그람음성균 외막에서 작은 친수성 분자의 통로가 된다."],["LPS 핵심 다당류","Lipid A와 O 항원 사이에 놓인 당 성분이다."],["O 항원","LPS의 바깥쪽 다당류로 균주 간 항원성 차이를 만든다."]]},{"label":"펩티도글리칸과 표적","pairs":[["NAM과 NAG","교대로 배열되어 펩티도글리칸의 당 사슬 골격을 이룬다."],["Transpeptidase(PBP)","펩티도글리칸 곁사슬의 교차결합을 형성한다."],["Lysozyme","펩티도글리칸 당 사슬의 결합을 절단한다."],["Bactoprenol","세포벽 전구체를 세포막 바깥쪽으로 운반하는 지질 운반체다."],["당 사슬 연장","NAM-NAG 이당류를 기존 펩티도글리칸 사슬에 연결하는 합성 단계다."]]},{"label":"세균의 특수 표면 구조","pairs":[["주모성 편모","세균의 한쪽 끝에 편모가 하나 존재하는 배열이다."],["주위편모","세균 표면의 여러 방향에 편모가 분포하는 배열이다."],["성섬모","접합 과정에서 세균 사이의 접촉에 관여한다."],["협막","일부 세균의 식세포작용 회피에 기여하는 표면 다당류층이다."],["내생포자","증식을 위한 포자가 아니라 불리한 환경에서 생존하는 휴면 구조다."]]}],"u04":[{"label":"영양과 물리 조건","pairs":[["생장인자","자체 합성이 부족해 외부에서 공급받아야 하는 유기 성분이다."],["최적 증식 온도","증식 속도가 가장 높은 온도로 최저·최고 생장 온도와 구별된다."],["수분 활성","용질이 많아 이용 가능한 물이 줄면 미생물 증식이 제한된다."],["삼투성 스트레스","고염 환경에서 세포 밖으로 물이 빠져나가 생장이 저해될 수 있다."],["호중성 세균","대체로 중성에 가까운 pH에서 잘 증식한다."]]},{"label":"배지 선택과 순수분리","pairs":[["정의배지","구성 성분과 농도를 화학적으로 정확히 알 수 있는 배지다."],["복합배지","추출물 등으로 영양을 공급해 모든 성분의 정확한 화학 조성이 알려지지 않는다."],["선택배지","특정 미생물의 증식을 억제하거나 촉진해 원하는 군을 분리한다."],["감별배지","배지에서 보이는 대사 반응 차이로 집락을 구별한다."],["획선도말","연속 구역에 세균을 희석해 공간적으로 분리된 집락을 얻는다."]]},{"label":"성장 측정과 해석","pairs":[["세대시간","한 세균 집단의 수가 두 배로 늘어나는 데 걸리는 시간이다."],["집락형성단위(CFU)","배양 가능한 세포나 세포 덩어리가 만든 집락을 단위로 센다."],["광학밀도","배양액의 탁도를 재지만 살아 있는 세포만 따로 세지는 못한다."],["정지기","영양 고갈과 노폐물 축적으로 새로 생기는 세포와 죽는 세포가 비슷해진다."],["치사기","배양 가능한 세포 수가 시간에 따라 감소하는 단계다."]]}],"u05":[{"label":"호흡과 발효의 구별","pairs":[["최종 전자수용체","호기성 호흡에서는 산소가, 다른 호흡에서는 무기물 등이 될 수 있다."],["발효","전자전달계 대신 유기 분자에 전자를 넘겨 NAD+를 재생한다."],["기질수준 인산화","대사 중간체의 인산기를 ADP로 직접 옮겨 ATP를 만든다."],["산화적 인산화","전자전달계가 만든 양성자 구배를 ATP 합성에 이용한다."],["광합성 세균","빛의 에너지를 이용하되 탄소원 선택은 균종마다 다를 수 있다."]]},{"label":"유전자 발현의 조절","pairs":[["시그마 인자","RNA 중합효소가 특정 프로모터를 인식하도록 돕는다."],["오페론","여러 기능 관련 유전자가 하나의 전사 조절 아래 놓인 배열이다."],["전사·번역의 결합","세균에는 핵막이 없어 mRNA가 만들어지는 중에 번역이 시작될 수 있다."],["Formylmethionine","많은 세균에서 단백질 합성을 시작하는 개시 아미노산이다."],["상동 재조합","상동 서열을 이용해 들어온 DNA를 염색체에 통합할 수 있다."]]},{"label":"전달 요소와 내성 확산","pairs":[["형질전환","환경에 존재하는 유리 DNA를 받아 유전형질을 획득한다."],["접합","세포 간 접촉을 통해 플라스미드 등의 DNA가 이동한다."],["형질도입","세균을 감염하는 파지가 유전자를 다른 세균으로 옮긴다."],["전위인자","같은 세포 안에서 유전체 위치를 옮길 수 있는 DNA 요소다."],["VRSA","반코마이신 내성 관련 유전자가 다른 세균에서 전달될 수 있는 사례다."]]}],"u06":[{"label":"선택독성과 내성의 개념","pairs":[["치료지수","약물 독성과 치료 효과를 비교하는 지표로 선택독성과 관련된다."],["광범위 항균제","여러 균종에 작용하지만 정상균무리 교란 범위도 넓을 수 있다."],["내인성 내성","균종 본래의 구조나 생리 때문에 항균제에 반응하지 않는 특성이다."],["획득 내성","돌연변이나 외부 유전자 획득으로 감수성 균이 내성을 갖게 된다."],["Persister","유전적 내성 없이 일시적으로 대사를 낮춰 약물 노출을 견딜 수 있다."]]},{"label":"항균제와 분자 표적","pairs":[["β-lactam","PBP에 결합해 펩티도글리칸 교차결합 형성을 억제한다."],["Bacitracin","세포벽 전구체를 이동시키는 지질 운반체의 재활용을 방해한다."],["Isoniazid","항산균의 미콜산 합성을 방해하는 결핵 치료제다."],["Trimethoprim","세균의 dihydrofolate reductase를 억제한다."],["β-lactamase 억제제","일부 β-lactamase의 작용을 막아 동반 항생제를 보호한다."]]},{"label":"내성 기전의 구분","pairs":[["β-lactamase","β-lactam 고리를 가수분해해 일부 약물을 불활성화한다."],["표적 변형","약물이 결합할 표적의 구조가 바뀌어 결합력이 낮아진다."],["유출 펌프","세포 안으로 들어온 항균제를 세포 밖으로 내보낸다."],["투과성 감소","외막 통로의 변화 등으로 약물이 세포 안에 덜 도달한다."],["대체 대사 경로","약물이 억제한 경로를 우회해 필요한 물질을 얻는다."]]}],"u07":[{"label":"DNA·RNA·막 표적 약물","pairs":[["Fluoroquinolone","세균 DNA gyrase 또는 topoisomerase IV를 억제한다."],["Rifampin","세균 RNA 중합효소를 억제해 전사를 방해한다."],["Nalidixic acid","초기 quinolone 계열 약제로 DNA gyrase 억제와 관련된다."],["Metronidazole","혐기성 환경에서 활성화되어 DNA에 손상을 준다."],["Polymyxin B와 Rifampin 병용","막 손상이 rifampin의 세균 내부 유입을 돕는 상승작용의 예다."]]},{"label":"감수성 검사 해석","pairs":[["MIC","눈에 보이는 증식을 억제하는 최소 약물 농도다."],["MBC","정해진 조건에서 접종 세균의 대부분을 사멸시키는 최소 농도다."],["원반확산 억제대","균종·약제별 기준을 적용해야 감수성 범주를 판단할 수 있다."],["평판 희석법","고체배지에 약제 농도를 달리해 균의 증식 여부를 비교한다."],["시험관 희석법","액체배지에서 약제 농도별 육안 증식 여부를 비교한다."]]},{"label":"병용요법과 부작용","pairs":[["상승작용","두 약제를 함께 썼을 때 각각의 예상 효과보다 큰 항균 효과가 나타난다."],["길항작용","한 약제가 다른 약제의 항균 효과를 감소시킬 수 있다."],["광범위 약제의 영향","정상균무리가 교란되면 기회감염 위험이 증가할 수 있다."],["경험적 치료","원인균 확정 전에 감염 부위와 예상 병원체를 근거로 시작한다."],["표적 치료","검사 결과와 환자 상태를 바탕으로 항균 범위를 좁혀 선택한다."]]}],"u08":[{"label":"감염의 성립과 숙주 상태","pairs":[["감염","병원체가 숙주에 들어와 증식해도 반드시 증상이 생기는 것은 아니다."],["감염병","미생물과 숙주의 상호작용으로 임상 징후나 증상이 나타난 상태다."],["불현성 감염","증상은 없지만 병원체 전파에 관여할 수 있다."],["감염량","숙주 방어와 병원체 특성에 따라 감염 성립에 필요한 양이 달라진다."],["숙주 감수성","면역 상태와 수용체 유무 등이 감염 가능성을 좌우한다."]]},{"label":"출입 경로와 장벽","pairs":[["점액섬모 청소","호흡기 상피에서 흡입된 입자를 밖으로 이동시킨다."],["위산","많은 경구 유입 병원체에 대한 화학적 방어 장벽이다."],["피부의 각질층","온전한 피부가 병원체 침입을 막는 물리적 장벽이다."],["매개체의 흡혈","피부 장벽을 넘어 병원체가 전달될 수 있는 경로다."],["수직 전파","임신·출산 또는 수유와 관련해 모체에서 아이로 전달될 수 있다."]]},{"label":"전파 고리의 구분","pairs":[["저장소","병원체가 지속되며 증식하거나 유지되는 자연적 서식처다."],["무생물 매개물","오염된 물·음식·물체 등이 병원체 전파에 관여한다."],["생물학적 매개체","매개체 안에서 병원체가 증식하거나 발달한 뒤 전파된다."],["기계적 매개체","매개체가 병원체를 운반하지만 그 안에서 필수 발달은 일어나지 않는다."],["호흡기 에어로졸","작은 입자가 공기 중에 떠서 흡입에 의해 전파될 수 있다."]]}],"u09":[{"label":"정착과 침습의 기전","pairs":[["부착소","숙주 표면의 수용체에 결합해 병원체의 정착을 돕는다."],["침습소","상피세포나 조직 안으로 들어가는 과정을 촉진한다."],["철 획득","숙주 안의 제한된 철을 이용하기 위해 siderophore 등이 동원된다."],["생물막","숙주 표면이나 의료기기에 붙은 세균 집단을 보호한다."],["협막","식세포작용을 방해해 숙주 내 생존에 기여한다."]]},{"label":"독소의 분자 기전","pairs":[["A-B 독소","B 부분이 표적세포 결합을, A 부분이 효소적 작용을 맡는다."],["초항원","일반 항원 제시보다 훨씬 많은 T세포를 비특이적으로 활성화할 수 있다."],["LPS 내독소","그람음성균 외막의 lipid A가 염증성 반응을 유발한다."],["용혈소","세포막을 손상시켜 적혈구 등 숙주 세포를 파괴할 수 있다."],["외독소","세균이 분비하는 단백질 독소로 기능과 표적이 다양하다."]]},{"label":"면역 회피와 확산","pairs":[["S. aureus Protein A","IgG의 Fc 부분과 결합해 옵소닌 작용을 방해한다."],["S. pyogenes M 단백","식세포작용 회피와 관련된 표면 병원성 인자다."],["Quorum sensing","세균 밀도에 따라 신호가 축적되어 집단의 유전자 발현을 조절한다."],["파지 암호화 독소","일부 디프테리아·보툴리눔 독소 유전자는 용원성 파지와 연관된다."],["항원 변이","표면 항원의 변화로 기존 항체의 인식을 피할 수 있다."]]}],"u10":[{"label":"게놈과 외피의 구별","pairs":[["핵산 종류","일반적인 바이러스 입자는 DNA 또는 RNA 중 한 종류의 유전체를 가진다."],["분절 유전체","여러 개의 핵산 조각에 유전정보가 나뉘어 있다."],["외피","숙주 세포막에서 유래한 지질막을 포함한다."],["비외피 바이러스","지질막이 없어 일부 외피 바이러스보다 건조·세제에 강한 경향이 있다."],["캡시드 대칭","정이십면체·나선형 등 단백질 외피의 배열로 구별한다."]]},{"label":"DNA 바이러스의 예외","pairs":[["Parvovirus","주요 DNA 바이러스 중 작은 단일가닥 DNA 게놈을 가진다."],["Poxvirus","DNA 바이러스지만 주로 세포질에서 복제한다."],["Hepadnavirus","DNA 바이러스지만 역전사 단계를 거쳐 증식한다."],["Papillomavirus","비외피 이중가닥 DNA 바이러스로 상피세포와 연관된다."],["Herpesvirus","외피를 가진 이중가닥 DNA 바이러스로 잠복감염을 일으킬 수 있다."]]},{"label":"RNA 바이러스 분류의 단서","pairs":[["Picornavirus","비외피 양성가닥 RNA 바이러스에 속한다."],["Reovirus","분절된 이중가닥 RNA 유전체를 가진다."],["Orthomyxovirus","분절된 음성가닥 RNA 유전체와 외피를 가진다."],["Retrovirus","RNA를 DNA로 역전사해 숙주 유전체에 통합할 수 있다."],["Coronavirus","외피를 가진 양성가닥 RNA 바이러스다."]]}],"u11":[{"label":"Baltimore 분류의 논리","pairs":[["양성가닥 RNA","유전체 RNA가 번역을 위한 mRNA로 직접 기능할 수 있다."],["음성가닥 RNA","mRNA를 만들기 위해 바이러스 RNA 의존성 RNA 중합효소가 필요하다."],["이중가닥 RNA","바이러스 입자가 mRNA 전사에 필요한 효소를 지녀야 한다."],["역전사 RNA","RNA를 DNA로 바꾸는 역전사효소가 복제 주기에 필요하다."],["역전사 DNA","DNA 게놈을 가지지만 RNA 중간체에서 역전사가 일어난다."]]},{"label":"바이러스 부착 단백질","pairs":[["Rhinovirus VP1-VP2-VP3","Rhinovirus의 캡시드 단백 복합체가 숙주 세포 부착에 관여한다."],["Adenovirus fiber","Adenovirus 캡시드의 돌출된 단백질이 세포 표면 결합에 관여한다."],["Measles virus H protein","홍역 바이러스의 외피 단백질로 숙주 세포 부착에 관여한다."],["Rabies virus G protein","광견병 바이러스 외피 당단백으로 세포 부착에 관여한다."],["Epstein-Barr virus gp350/gp220","EBV가 B세포 표면에 결합할 때 쓰는 외피 당단백이다."]]},{"label":"바이러스의 숙주 수용체","pairs":[["EBV–CD21","EBV는 B세포의 보체 수용체 CD21에 결합할 수 있다."],["Rhinovirus–ICAM-1","Rhinovirus의 일부 혈청형이 상피세포 ICAM-1을 수용체로 쓴다."],["Influenza A–sialic acid","Influenza A는 상피세포 표면의 시알산을 인식한다."],["Parvovirus B19–P antigen","Parvovirus B19는 적혈구 전구세포의 P 항원에 결합한다."],["Rabies–acetylcholine receptor","광견병 바이러스가 신경세포의 아세틸콜린 수용체 등을 이용할 수 있다."]]}],"u12":[{"label":"부위별 군집의 성질","pairs":[["피부 정상균무리","건조와 피지 환경에 적응한 미생물이 부위에 따라 다르게 존재한다."],["장내 정상균무리","식이 성분 대사와 숙주 면역 조절에 기여할 수 있다."],["질의 Lactobacillus","젖산 생성으로 낮은 pH 유지에 기여한다."],["구강 생물막","치아 표면에 미생물이 부착해 군집을 형성한다."],["무균 부위 검체","정상균무리의 존재를 전제로 하지 않고 오염 가능성을 함께 평가한다."]]},{"label":"정착 저항과 불균형","pairs":[["영양분 경쟁","정상균무리가 외부 균의 정착에 필요한 자원을 선점한다."],["박테리오신","일부 세균이 다른 세균의 증식을 억제하는 물질이다."],["항생제 노출","군집 균형을 무너뜨려 Clostridioides difficile 증식을 허용할 수 있다."],["기회감염","평소 공존하던 균이 다른 부위나 면역저하 숙주에서 병을 일으킨다."],["군집 다양성","미생물의 종류와 분포가 건강 상태·환경에 따라 달라진다."]]},{"label":"감염 판독의 주의점","pairs":[["오염","검체 채취 과정에서 피부·환경의 미생물이 섞일 수 있다."],["보균","균이 존재하더라도 증상이나 조직 침습이 반드시 동반되는 것은 아니다."],["집락화","표면에 미생물이 자리 잡았으나 그 자체로 감염병은 아니다."],["항균제 선택 압력","감수성 균이 줄면 내성 균이 상대적으로 늘어날 수 있다."],["임상 맥락","같은 균의 검출도 검체 부위와 증상에 따라 의미가 달라진다."]]}],"u13":[{"label":"흡착과 침투의 조건","pairs":[["수용체","세포 표면의 결합 대상이 있어야 특정 바이러스가 흡착할 수 있다."],["보조수용체","첫 결합 이후 세포 진입을 추가로 돕는 숙주 분자다."],["막 융합","외피와 숙주 막이 합쳐져 입자 내용물이 세포로 들어온다."],["수용체 매개 내포작용","세포가 결합된 입자를 소포로 둘러싸 받아들인다."],["탈외피","유전체가 캡시드에서 풀려 복제에 접근할 수 있게 된다."]]},{"label":"증식곡선과 방출","pairs":[["Eclipse period","세포 내부에서 감염성 완성 입자가 검출되지 않는 초기 구간이다."],["Latent period","감염 이후 세포 밖에서 새 감염성 입자가 검출되기 전까지다."],["Burst size","감염 세포 한 개에서 방출되는 평균 감염성 입자 수를 가리킨다."],["Plaque","주변 세포로 전파된 감염이 국소적인 세포 손상 영역을 만든 것이다."],["PFU","주어진 세포·조건에서 plaque를 만들 수 있는 감염성 단위다."]]},{"label":"바이러스 배양과 검출","pairs":[["일차세포","조직에서 직접 얻어 제한된 횟수만 증식하는 배양 세포다."],["연속세포주","시험관에서 장기간 계대가 가능한 세포 집단이다."],["발육계란","일부 바이러스의 증식과 백신 생산에 이용되는 생물학적 배양계다."],["세포병변효과","감염 후 세포의 둥글어짐·융합·탈락 등 형태 변화다."],["Hemadsorption","감염 세포 표면의 바이러스 단백에 적혈구가 붙는 현상이다."]]}],"u14":[{"label":"돌연변이 발생과 선택","pairs":[["RNA 중합효소 오류","교정 기능이 제한된 RNA 바이러스에서 변이가 빨리 축적될 수 있다."],["침묵 돌연변이","염기서열은 바뀌지만 번역되는 아미노산은 그대로다."],["틀이동 돌연변이","삽입·결실로 코돈 읽는 틀이 변해 뒤쪽 단백질 서열에 영향을 준다."],["조건부 치사 변이","허용 조건에서는 증식하지만 비허용 조건에서는 증식하지 못한다."],["선택 압력","면역이나 약물 노출이 이미 생긴 변이의 상대적 증식을 바꾼다."]]},{"label":"유전 물질의 교환","pairs":[["재조합","두 유전체의 서열 일부가 교환되어 새 조합을 만든다."],["재편성","분절 유전체를 지닌 바이러스의 완전한 분절끼리 섞인다."],["동시감염","한 세포에 서로 다른 바이러스가 들어와 교환의 기회를 만든다."],["상보작용","한 바이러스의 결함을 다른 바이러스의 산물이 일시적으로 보완한다."],["표현형 혼합","유전체는 유지된 채 다른 바이러스의 외피 단백 등을 입자에 일시적으로 담는다."]]},{"label":"인플루엔자 변이의 해석","pairs":[["항원 소변이","점 돌연변이의 축적으로 표면 항원성이 점차 변한다."],["항원 대변이","새 HA 또는 NA 조합이 분절 재편성으로 나타날 수 있다."],["분절 RNA","서로 다른 주가 같은 세포에 감염되면 재편성의 재료가 된다."],["숙주 범위 변화","수용체 결합과 복제 적합성에 영향을 주는 변이가 함께 작용한다."],["약제 내성 변이","표적 단백의 변화가 약물 효과를 떨어뜨릴 수 있다."]]}],"u15":[{"label":"바이러스의 체내 이동","pairs":[["일차 증식","침입 부위의 감수성 세포에서 최초로 바이러스가 늘어난다."],["일차 바이러스혈증","초기 증식 이후 혈액을 통한 전신 이동이 시작된다."],["이차 바이러스혈증","다른 조직에서 증식한 후 혈액 내 바이러스량이 다시 증가할 수 있다."],["신경성 전파","말초 신경을 따라 중추신경계나 다른 조직으로 이동한다."],["조직 친화성","수용체·세포내 증식 가능성·숙주 방어가 함께 결정한다."]]},{"label":"세포와 숙주의 반응","pairs":[["용해성 감염","바이러스 증식과 함께 숙주 세포가 손상되어 파괴된다."],["지속감염","감염이 완전히 제거되지 않고 오래 유지된다."],["잠복감염","유전체가 남아 있다가 조건에 따라 다시 증식할 수 있다."],["변형감염","감염으로 세포 성장 조절이 바뀌어 종양화에 관여할 수 있다."],["면역병리","바이러스 자체뿐 아니라 과한 숙주 면역반응도 조직 손상을 낳는다."]]},{"label":"초기 항바이러스 방어","pairs":[["제1형 인터페론","주변 세포에 항바이러스 상태를 유도한다."],["NK 세포","MHC I 발현 저하 등 비정상 신호를 보이는 세포를 제거할 수 있다."],["CD8 T세포","MHC I에 제시된 바이러스 펩타이드를 인식해 감염 세포를 공격한다."],["중화항체","바이러스의 숙주 세포 부착이나 진입을 막는다."],["점막 IgA","점막 표면에서 바이러스의 부착을 제한하는 데 기여한다."]]}],"u16":[{"label":"인터페론의 분자 작용","pairs":[["PKR","바이러스 RNA를 감지해 번역 개시 인자를 인산화하고 단백질 합성을 줄인다."],["OAS-RNase L","인터페론 유도 경로가 바이러스 RNA 분해를 촉진한다."],["Mx 단백","일부 바이러스의 복제 단계에 간섭하는 인터페론 유도 단백질이다."],["IFN-α/β 수용체","감염 세포와 주변 세포에 항바이러스 유전자의 발현을 유도한다."],["MHC I 발현","인터페론에 의해 증가하면 감염 세포의 항원 제시에 도움을 줄 수 있다."]]},{"label":"바이러스 단계별 약제","pairs":[["Acyclovir 활성화","HSV의 바이러스 thymidine kinase에 의존해 첫 인산화가 일어난다."],["Acyclovir 내성","바이러스 thymidine kinase 변이나 결손으로 약물 활성화가 감소할 수 있다."],["Neuraminidase 억제","인플루엔자 새 입자의 방출 단계를 표적으로 삼는 치료 전략이다."],["역전사효소 억제","RNA 바이러스 중 레트로바이러스의 DNA 중간체 생성에 개입한다."],["HIV integrase 억제제","바이러스 DNA의 숙주 염색체 통합을 방해한다."]]},{"label":"치료 한계와 내성","pairs":[["숙주 대사 의존성","바이러스가 숙주 기능을 이용해 선택적인 약물 표적이 제한된다."],["초기 투여의 의미","바이러스 복제가 활발한 단계에서 억제 효과가 더 클 수 있다."],["잠복 유전체","증식하지 않는 상태의 바이러스는 복제 억제제만으로 제거하기 어렵다."],["표적 변이","바이러스 단백이 변하면 해당 약물의 결합이나 활성화가 감소할 수 있다."],["복합요법","서로 다른 복제 단계를 함께 억제해 내성 출현을 늦출 수 있다."]]}],"u17":[{"label":"진균의 생물학적 구조","pairs":[["β-glucan","키틴과 함께 진균 세포벽의 구조를 지탱하는 다당류다."],["진균 핵막","진균이 세균과 달리 진핵생물임을 보여 주는 막성 세포 구조다."],["균사(hypha)","사상진균이 자라는 실 모양의 구조다."],["균사체(mycelium)","여러 균사가 모여 형성하는 집합체다."],["효모(yeast)","대개 단세포 형태로 출아 등으로 증식한다."]]},{"label":"포자와 형태 변화","pairs":[["분생포자","균사가 무성적으로 만들어 퍼뜨리는 포자다."],["포자낭포자","포자낭 안에 형성되는 무성포자다."],["유성포자","유전 물질의 결합과 감수분열에 따른 생식과 연관된다."],["이형성 진균","환경 온도와 숙주 조건에 따라 효모·균사 형태가 달라질 수 있다."],["Pseudohypha","길게 늘어난 효모 세포가 연결되어 균사처럼 보이는 형태다."]]},{"label":"숙주 방어와 감염","pairs":[["호중구","침습성 사상진균에 대한 중요한 선천면역 방어 세포다."],["세포매개 면역","일부 진균의 체내 확산을 제한하는 데 중요하다."],["기회진균증","면역저하나 정상균무리 교란 상태에서 발생 위험이 커진다."],["표재성 진균증","피부 표면이나 모발의 가장 바깥층에 제한되는 감염이다."],["전신성 진균증","내부 장기까지 침범하는 진균 감염이다."]]}],"u18":[{"label":"처리 목표와 적용 부위","pairs":[["멸균","내생포자를 포함한 모든 형태의 미생물을 제거하거나 불활성화한다."],["고수준 소독","대부분의 미생물을 제거하지만 많은 수의 포자까지 완전히 제거한다고 보장하지 않는다."],["방부","살아 있는 조직에 사용해 미생물의 수를 줄인다."],["정균","세균 증식만 억제하며 억제 조건이 없어지면 다시 자랄 수 있다."],["살균","세균을 실제로 죽이는 작용을 가리킨다."]]},{"label":"물리적 처리의 적합성","pairs":[["고압증기","압력 자체보다 포화 수증기의 열 전달로 내열성 기구를 멸균한다."],["건열","수분에 손상될 수 있는 내열 물품을 높은 온도에서 처리한다."],["여과","열에 약한 용액을 미생물의 크기에 따른 물리적 분리로 처리한다."],["자외선","투과력이 낮아 주로 노출된 표면과 공기 처리에 쓰인다."],["감마선","투과력이 큰 이온화 방사선으로 포장된 물품 처리에도 쓰인다."]]},{"label":"소독 효율의 변수","pairs":[["유기물","혈액·고름이 남으면 일부 소독제의 작용을 방해한다."],["접촉 시간","권장 시간보다 짧게 노출되면 기대하는 소독 수준에 못 미칠 수 있다."],["농도","소독제의 유효 농도가 달라지면 효과와 조직 독성이 달라진다."],["세균 포자","영양세포보다 많은 소독 조건에 잘 견딘다."],["기구의 용도","무균 조직·점막·온전한 피부 중 어디에 닿는지에 따라 요구 처리 수준이 달라진다."]]}],"u19":[{"label":"검체의 질과 운송","pairs":[["항생제 투여 전 채취","원인균의 회수 가능성을 높일 수 있다."],["채혈 부위 피부소독","혈액배양에서 피부 상재균이 섞이는 일을 줄이는 핵심 조치다."],["검체량","너무 적으면 배양이나 후속 검사에 필요한 시료가 부족할 수 있다."],["혐기성 검체 운송","산소 노출을 최소화해야 혐기성 원인균의 회수에 유리하다."],["검체 부위 표기","같은 미생물 검출도 소변·혈액·객담 중 어디서 나왔는지에 따라 의미가 달라진다."]]},{"label":"현미경과 배지 판독","pairs":[["그람염색","균 형태와 그람반응을 빠르게 보지만 균종 확정은 어렵다."],["항산성 염색","세포벽의 미콜산 때문에 일반 염색과 다른 성질을 보이는 균을 확인한다."],["선택배지","원치 않는 균의 증식을 억제해 목표 균의 분리를 돕는다."],["감별배지","대사 산물의 색 변화 등으로 집락 사이의 차이를 드러낸다."],["순수집락","한 집락을 분리해 후속 동정·감수성 검사에 사용한다."]]},{"label":"동정과 감수성 판단","pairs":[["MALDI-TOF MS","미생물의 단백질 질량 패턴을 비교해 균을 동정한다."],["16S rRNA 분석","세균의 보존된 유전자 서열을 비교해 계통적 동정에 활용한다."],["혈액배양","혈액 속 균 검출에서 채혈 부위 소독과 오염 판별이 중요하다."],["원반확산법","억제대 직경을 균종·약제별 기준과 비교해야 감수성을 판단한다."],["MIC","육안으로 보이는 세균 증식을 억제하는 최저 농도다."]]}],"u20":[{"label":"바이러스 배양의 징후","pairs":[["세포병변효과","감염 세포의 형태가 변하거나 융합·탈락하는 소견이다."],["다핵 거대세포","바이러스 유도 세포융합으로 여러 핵이 하나의 세포질에 존재한다."],["봉입체","감염 세포의 핵 또는 세포질에서 보이는 특징적 구조다."],["적혈구흡착","감염 세포 표면에 발현된 단백질에 적혈구가 결합한다."],["바이러스 간섭","한 바이러스가 감염된 세포에서 다른 바이러스의 증식이 억제될 수 있다."]]},{"label":"핵산검사의 선택","pairs":[["PCR 변성 단계","고온에서 이중가닥 DNA를 분리해 프라이머 결합을 준비한다."],["역전사효소","RNA 표적을 PCR로 증폭하기 전 상보 DNA로 바꾼다."],["실시간 PCR","증폭 과정의 형광 신호를 따라 표적 핵산을 검출하거나 정량한다."],["내부 대조군","추출·증폭 실패나 억제물질에 의한 위음성을 감지하는 데 도움을 준다."],["오염에 의한 위양성","증폭산물이 새 검체에 섞이면 표적이 없어도 양성 신호가 날 수 있다."]]},{"label":"항원·항체 검사의 의미","pairs":[["항원검사","검체 속 병원체 성분을 직접 찾는다."],["IgM","최근 면역반응의 단서지만 비특이 반응과 지속성을 고려해야 한다."],["IgG","과거 노출 또는 예방접종의 흔적일 수 있어 단독으로 현재 감염을 확정하지 않는다."],["짝지은 혈청","급성기·회복기 항체 역가 변화를 비교한다."],["적혈구응집억제","항체가 바이러스의 적혈구 응집 기능을 막는 정도를 평가한다."]]}],"u21":[{"label":"사람·동물·환경의 연결","pairs":[["저장소 동물","병원체가 자연에서 유지되는 숙주로 사람 감염원의 일부다."],["우발 숙주","병원체 생활사에서 필수는 아니지만 감염될 수 있는 숙주다."],["매개체","동물과 사람 사이에 병원체를 옮기는 절지동물 등이 해당한다."],["환경 단계","일부 인수공통감염은 토양·물 같은 비생물 단계가 생활사에 필요하다."],["One Health","사람·동물·환경의 건강 문제를 함께 살펴 감염병을 관리하는 접근이다."]]},{"label":"생활사에 따른 분류","pairs":[["광견병","감염 포유류의 물림을 통해 사람에게 전파될 수 있다."],["브루셀라증","감염 가축과의 접촉이나 살균하지 않은 유제품으로 전파될 수 있다."],["렙토스피라증","감염 동물의 소변으로 오염된 물이나 토양에 노출되어 전파될 수 있다."],["Q fever","감염 가축과 관련된 에어로졸을 흡입해 전파될 수 있다."],["한타바이러스 감염","감염 설치류의 배설물에서 생긴 입자를 흡입해 전파될 수 있다."]]},{"label":"출현 위험을 바꾸는 요인","pairs":[["기후 변화","매개체의 분포와 활동 기간을 바꿀 수 있다."],["토지 이용 변화","사람과 야생동물의 접촉 기회를 변화시킨다."],["국제 이동","사람·동물·물자의 이동으로 병원체가 새 지역에 들어올 수 있다."],["병원체 적응","변이가 종간 전파와 숙주 내 복제 적합성에 영향을 줄 수 있다."],["이식과 혈액제제","의료 행위가 동물 유래 병원체의 새로운 노출 경로가 될 수 있다."]]}],"u22":[{"label":"능동·수동 면역의 차이","pairs":[["능동 면역","항원 노출 뒤 자신의 면역계가 기억세포와 항체를 만든다."],["수동 면역","외부에서 완성된 항체를 받아 빠르게 보호받지만 지속 기간은 제한된다."],["모체 IgG","태반을 통해 태아에게 전달되는 수동 면역의 예다."],["모유 IgA","모유를 통해 영아 점막에 전달될 수 있는 수동 면역 성분이다."],["추가 접종","기억 면역 반응을 다시 활성화해 항체의 양과 질을 높일 수 있다."]]},{"label":"항원 제시와 면역 반응","pairs":[["MHC I","세포 내부에서 생성된 항원을 주로 CD8 T세포에 제시한다."],["MHC II","항원제시세포가 받아들인 외부 항원을 주로 CD4 T세포에 제시한다."],["보조자극","항원 인식만으로 부족한 T세포 활성화 신호를 제공한다."],["기억 B세포","재노출 시 빠르게 항체 반응을 만드는 데 기여한다."],["면역증강제","선천면역 반응을 자극해 항원에 대한 면역원성을 높인다."]]},{"label":"백신 설계와 평가","pairs":[["질병 부담","예방 대상 질환의 발생 빈도와 중증도를 평가한다."],["면역원성","접종 뒤 항체·T세포 반응을 유도하는 능력이다."],["효능(efficacy)","통제된 임상시험에서 접종군과 대조군의 질병 위험을 비교한다."],["실제 효과(effectiveness)","일상 접종 환경에서 질병 위험 감소를 평가한다."],["집단 면역","전파가 줄어 감수성 개인의 노출 위험도 낮아지는 효과다."]]}],"u23":[{"label":"백신 유형의 적용","pairs":[["약독화 생백신","병원체가 제한적으로 증식해 강한 면역을 유도할 수 있다."],["불활화 백신","병원체를 증식 불능 상태로 만들어 투여한다."],["단백질 아단위 백신","선정된 병원체 단백질 성분만 항원으로 사용한다."],["접합 백신","다당 항원에 운반 단백을 붙여 T세포 도움을 유도한다."],["톡소이드","독성은 제거하고 항원성을 남긴 독소를 사용한다."]]},{"label":"위험군과 수동면역","pairs":[["면역저하 상태","일부 생백신의 접종에서 증식성 병원체의 위험을 고려한다."],["직업적 노출","업무 중 특정 병원체에 노출될 가능성을 접종 우선순위에 반영한다."],["유행 대응","집단 발생 상황에서 예방 가능한 감염의 전파를 줄이기 위해 접종한다."],["면역글로불린","미리 만들어진 항체를 투여하는 수동면역 방법이다."],["노출 후 예방","병원체와 접촉한 뒤 백신이나 면역글로불린을 상황에 맞게 사용한다."]]},{"label":"개발과 허가의 단계","pairs":[["표적 항원 선정","보호 면역을 유도할 병원체 성분을 고른다."],["비임상 평가","사람 대상 시험 전 안전성과 면역 반응 등을 조사한다."],["임상 1상","주로 초기 안전성과 투여량·면역 반응을 탐색한다."],["임상 3상","대규모 집단에서 예방 효과와 안전성을 비교 평가한다."],["시판 후 감시","허가 뒤 드물거나 늦게 나타나는 이상반응과 실제 효과를 관찰한다."]]}]};

  function rotate(items, n){
    const p=((n%items.length)+items.length)%items.length;
    return items.slice(p).concat(items.slice(0,p));
  }
  function place(correct, alternatives, target, seed){
    const options=rotate(alternatives,seed);
    options.splice(target,0,correct);
    return options;
  }
  function buildUnit(unit){
    const categories=unit.categories.concat(SUPPLEMENTAL[unit.id]);
    const questions=[];
    categories.forEach((category,ci)=>{
      const pairs=category.pairs;
      pairs.forEach(([subject,value],pi)=>{
        const index=questions.length, answerIndex=(index*7+ci*3+unit.no*11)%5;
        const id=`${unit.id}-v2-${ci+1}-${pi+1}`;
        let prompt,options,optionRationales,kind;
        if(pi===2){
          // Four accurate matches and one deliberately mismatched match.
          kind='incorrect-pair';
          prompt='다음 중 옳지 않게 연결된 것은?';
          const wrongValue=pairs[(pi+1)%5][1];
          options=pairs.map(([term,meaning],i)=>`${term} — ${i===pi?wrongValue:meaning}`);
          optionRationales=pairs.map(([term,meaning],i)=>i===pi
            ?`잘못된 연결(정답): ${term}의 올바른 설명은 “${meaning}”이다.`
            :`바르게 연결됨: ${term} — “${meaning}”`);
          // Move the mismatched row so its position varies between units.
          const wrong=options.splice(pi,1)[0], rationale=optionRationales.splice(pi,1)[0];
          options.splice(answerIndex,0,wrong);
          optionRationales.splice(answerIndex,0,rationale);
        }else if(pi===1||pi===4){
          kind='definition';
          prompt=pi===1?`다음 설명에 해당하는 것은?\n“${value}”`:
            `다음과 같은 특징을 가진 대상은?\n“${value}”`;
          const others=pairs.filter((_,i)=>i!==pi).map(x=>x[0]);
          options=place(subject,others,answerIndex,ci+pi);
          optionRationales=options.map(term=>{
            const meaning=pairs.find(x=>x[0]===term)[1];
            return term===subject?`정답: ${term}의 설명과 일치한다.`:
              `오답: ${term}는 “${meaning}”에 해당한다.`;
          });
        }else{
          kind='correct-description';
          prompt=pi===0?`다음 중 ‘${subject}’에 대한 설명으로 가장 적절한 것은?`:
            `다음 중 ‘${subject}’에 해당하는 설명은?`;
          const others=pairs.filter((_,i)=>i!==pi).map(x=>x[1]);
          options=place(value,others,answerIndex,ci+pi);
          optionRationales=options.map(choice=>{
            const owner=pairs.find(x=>x[1]===choice)[0];
            return choice===value?`정답: ${subject}에 해당한다.`:
              `오답: 이 설명은 ‘${owner}’에 해당한다.`;
          });
        }
        questions.push({id,unitId:unit.id,group:category.label,kind,prompt,
          options,answerIndex,
          explanation:kind==='incorrect-pair'
            ?`제시된 연결은 잘못되었다. ‘${subject}’에 해당하는 설명은 “${value}”이다.`
            :`‘${subject}’에 해당하는 설명은 “${value}”이다.`,
          optionRationales,
          source:`${unit.no}강 ${unit.title} 강의록 · 미생물학 정리본`,
          sourceSet:ci<3?'기존 예상문제의 검토·개정':'강의록·정리본 보강'
        });
      });
    });
    return{id:unit.id,no:unit.no,title:unit.title,questions};
  }
  const units=BLUEPRINTS.map(buildUnit);
  return{version:'2026-09-28-review',units};
});
