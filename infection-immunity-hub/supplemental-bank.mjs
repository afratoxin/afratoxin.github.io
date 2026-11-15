// Original practice questions adapted to short-recall style; physical PDF page citations.
const pools={
 cocci:[['S. aureus','Catalase 양성·coagulase 양성인 포도알균.'],['S. epidermidis','Coagulase 음성 포도알균, 인공물 관련 감염.'],['S. saprophyticus','Coagulase 음성 포도알균, 젊은 여성 요로감염.'],['S. pneumoniae','Catalase 음성·α용혈·optochin 감수성·담즙 용해.'],['S. pyogenes','Catalase 음성·A군 β용혈 사슬알균.']],
 strep:[['S. pneumoniae','α용혈, optochin 감수성, 담즙 용해.'],['Viridans streptococci','구강 상재균군, 치아우식·아급성 심내막염.'],['S. pyogenes','A군 β용혈, 인두염·피부감염 및 면역 합병증.'],['S. agalactiae','B군 사슬알균, 신생아 패혈증·수막염.'],['Enterococcus','PYR 양성, 담즙 및 optochin 저항성.']],
 enzymes:[['Catalase','H₂O₂를 물과 산소로 분해.'],['Coagulase','Fibrinogen을 fibrin으로 전환하는 응고 반응.'],['Hyaluronidase','결합조직의 hyaluronic acid 분해.'],['DNase','DNA 분해.'],['β-lactamase','β-lactam 고리 분해.']],
 staphVir:[['Protein A','IgG의 Fc 부분에 결합하여 opsonization을 방해.'],['Coagulase','Fibrin 형성과 연결되는 응고효소.'],['Clumping factor','Fibrinogen 결합에 관여하는 표면 단백질.'],['Teichoic acid','세포벽 성분으로 부착 등에 관여.'],['Hyaluronidase','조직의 hyaluronic acid를 분해하는 효소.']],
 stain:[['Gram stain','세포벽의 염색 성질·모양·배열을 관찰.'],['Acid-fast stain','Mycolic acid가 풍부한 항산균 검출.'],['GMS stain','진균 및 Pneumocystis의 벽을 검게 강조.'],['Mucicarmine','Cryptococcus의 다당류 협막을 강조.'],['Immunohistochemistry','특정 항원에 대한 항체로 조직 내 항원을 확인.']],
 gram:[['그람양성 알균','포도알균·사슬알균의 기본 형태.'],['그람음성 알균','Neisseria의 기본 형태.'],['그람양성 막대균','Corynebacterium·Listeria·Bacillus 등의 형태.'],['그람음성 막대균','장내세균·Pseudomonas 등의 형태.'],['그람음성 짧은막대균','H. influenzae의 대표적인 다형성 형태.']],
 enteric:[['E. coli','Lactose 발효, IMViC ++--.'],['K. pneumoniae','Lactose 발효, 두꺼운 협막·비운동성.'],['Salmonella','Lactose 비발효, 대표적으로 운동성·H₂S 생성.'],['Shigella','비운동성, 대표적으로 H₂S·가스 비생성.'],['Proteus','Urease·유주현상·요로결석의 조합.']],
 antigens:[['O 항원','LPS의 반복 다당류로 구성되는 체성 항원.'],['H 항원','편모 단백질 항원.'],['K 항원','협막·표면 항원 범주.'],['Lipid A','LPS의 내독소 활성 부위.'],['Core polysaccharide','LPS에서 O 다당류와 lipid A 사이의 중심 다당류.']],
 structures:[['Fimbriae','숙주 수용체 부착에 관여.'],['Sex pilus','접합에 의한 유전물질 전달을 매개.'],['Flagellum','운동성에 관여.'],['Capsule','식균작용 회피에 관여.'],['Endospore','불리한 환경에서 생존하는 휴면 구조.']],
 imvic:[['++--','E. coli의 대표 IMViC.'],['--++','K. pneumoniae·E. cloacae의 대표 IMViC.'],['-+--','S. Typhi의 강의 표 IMViC.'],['-+-+','P. mirabilis·C. freundii의 강의 표 IMViC.'],['+-+-','위 네 대표 조합과 구분할 치환 보기.']],
 imvicTests:[['Indole','Tryptophan 분해와 indole 생성.'],['Methyl red','Glucose의 혼합산 발효.'],['Voges–Proskauer','Acetoin 및 2,3-butanediol 발효 경로.'],['Citrate','Citrate를 탄소원으로 이용하는 성질.'],['Urease','Urea를 분해하여 암모니아를 생성.']],
 media:[['MacConkey agar','장내 그람음성균 선택 및 lactose 발효 감별.'],['TCBS agar','Vibrio와 연결되는 선택·감별 배지.'],['Chocolate agar','H. influenzae의 X·V 성장인자 요구성과 연결.'],['Thayer–Martin agar','병원성 Neisseria의 선택배지.'],['Campy-BAP','Campylobacter 동정에서 강의에 제시된 배지.']],
 curved:[['V. cholerae','TCBS에서 sucrose 발효에 따른 황색, 콜레라.'],['V. parahaemolyticus','해산물 관련 장염, 호염성 Vibrio.'],['C. jejuni','굽은 막대균, 미호기성·장염 및 GBS 연관.'],['H. pylori','Urease 양성, 위 점막 정착·소화성 궤양.'],['P. aeruginosa','Oxidase 양성·lactose 비발효, 특징적 색소.']],
 pigments:[['Pyocyanin','청색 색소, 산화환원 반응과 조직 손상.'],['Pyoverdine','황록색 형광 색소, 철 획득 siderophore.'],['Prodigiosin','Serratia의 적색 색소와 연관.'],['Mycolic acid','항산균 세포벽의 긴 사슬 지방산.'],['Melanin','Cryptococcus 등의 색소와 연관.']],
 atypical:[['Mycoplasma','세포벽이 없고 세포막 sterol을 이용.'],['Chlamydia','EB·RB 생활환, 세포 내 inclusion.'],['Mycobacterium','Mycolic acid가 풍부한 세포벽과 항산성.'],['Rickettsia','숙주 세포질에서 증식하는 절대세포내 세균.'],['Anaplasma','과립구의 phagosome 안에 morula 형성.']],
 chlamStages:[['EB · 감염성 · 비분열형','Elementary body의 대표적 역할.'],['EB · 비감염성 · 분열형','EB와 RB의 감염성·분열성을 바꾼 보기.'],['RB · 감염성 · 비분열형','EB의 역할을 RB에 치환한 보기.'],['RB · 비감염성 · 분열형','Reticulate body의 대표적 역할.'],['EB · 감염성 · 분열형','EB에 RB의 분열성을 붙인 보기.']],
 cellular:[['세포질','Rickettsia·Orientia의 증식 장소, Listeria 탈출 후 위치.'],['포식소체','Anaplasma·Ehrlichia의 세포 내 위치.'],['핵','HSV·CMV 등에서 특징적 바이러스 봉입체를 관찰.'],['세포 외 기질','결합조직 성분이 분포하는 세포 밖 공간.'],['세포막 외측','숙주세포의 표면 수용체와 부착 인자가 만나는 위치.']],
 targets:[['EF-2','Diphtheria toxin·Pseudomonas exotoxin A의 표적.'],['Gsα','Cholera toxin·ETEC LT의 ADP-ribosylation 표적.'],['Giα','Pertussis toxin의 ADP-ribosylation 표적.'],['Rho·Rac','C. difficile TcdA·TcdB에 의한 불활성화 표적.'],['Actin','C. difficile CDT의 ADP-ribosylation 표적.']],
 anaerobes:[['B. fragilis','복강 내 농양과 관련된 그람음성 무산소 막대균.'],['F. nucleatum','구강 및 대장암 미세환경과 관련.'],['C. difficile','아포를 형성하는 그람양성 무산소 막대균.'],['C. perfringens','α독소 lecithinase, 가스괴저.'],['Actinomyces','분지형 그람양성균, 만성 화농·sulfur granule.']],
 factor:[['X = hemin','X인자의 화학적 본체.'],['V = NAD','V인자의 화학적 본체.'],['X = NAD','X와 V의 본체를 치환한 보기.'],['V = hemin','V와 X의 본체를 치환한 보기.'],['X = PRP','성장인자와 Hib 협막 항원을 치환한 보기.']],
 neisseria:[['임균 · glucose','N. gonorrhoeae의 대표 당 이용.'],['임균 · glucose+maltose','수막염균의 당 이용을 임균에 치환.'],['수막염균 · glucose','임균의 대표 당 이용을 수막염균에 치환.'],['수막염균 · glucose+maltose','N. meningitidis의 대표 당 이용.'],['임균 · maltose','임균의 glucose 이용을 maltose로 치환.']],
 listeriaFactors:[['Internalin','숙주세포 진입에 관여.'],['Listeriolysin O','포식소체 막을 손상시켜 세포질 탈출.'],['ActA','숙주 actin 중합을 통한 운동·세포 간 전파.'],['Phospholipase C','막 인지질 분해로 탈출 등에 기여.'],['Catalase','H₂O₂를 분해하는 효소.']],
 spiro:[['T. pallidum','매독의 원인균.'],['B. burgdorferi','Lyme disease, Ixodes 매개.'],['B. recurrentis','이매개 재귀열의 대표 원인균.'],['Leptospira','동물 소변에 오염된 환경, 결막 충혈·Weil병.'],['B. hermsii','진드기매개 재귀열의 대표 원인균.']],
 syphTests:[['RPR','비트레포네마 검사, 정량 역가로 치료 반응 추적.'],['VDRL','비트레포네마 검사, CSF 검사에도 이용.'],['FTA-ABS','트레포네마 항원에 대한 특이 항체 검사.'],['TPPA','트레포네마 특이 입자응집 검사.'],['Treponemal EIA','트레포네마 특이 효소면역검사.']],
 rickettsia:[['R. prowazekii','Epidemic typhus, 몸니 매개.'],['R. typhi','Murine typhus, 벼룩 매개.'],['R. rickettsii','Rocky Mountain spotted fever, 진드기 매개.'],['R. akari','Rickettsialpox, 응애 매개.'],['O. tsutsugamushi','쯔쯔가무시병, 털진드기 유충 매개.']],
 vectors:[['Louse','R. prowazekii의 매개체.'],['Flea','R. typhi의 매개체.'],['Tick','RMSF·Lyme disease·Anaplasma 등의 매개체.'],['Mite','쯔쯔가무시병·rickettsialpox와 연결.'],['Trematode','강의 표의 N. sennetsu와 연결.']],
 hostCells:[['혈관내피세포','Rickettsia의 혈관염 병리와 연결.'],['단핵구','E. chaffeensis의 대표 표적.'],['과립구','A. phagocytophilum의 대표 표적.'],['적혈구','위 세 세균의 대표 표적과 구분.'],['말초신경 Schwann 세포','M. leprae의 신경 침범과 연결.']],
 fungi:[['Candida','출아 효모·가성균사·점막 칸디다증.'],['Cryptococcus','협막을 가진 효모, 수막염.'],['Aspergillus','격벽이 있고 예각 분지하는 균사.'],['Mucorales','넓고 리본 같은 균사, 격벽이 드물고 넓은 각도 분지.'],['Pneumocystis','세포면역 저하 환자의 폐렴, GMS로 낭벽 확인.']],
 virus:[['HSV','다핵세포·핵 molding·핵 내 봉입체.'],['CMV','거대세포·owl’s eye 핵 내 봉입체.'],['HPV','Koilocytosis.'],['EBV','EBER in situ hybridization으로 확인.'],['Molluscum contagiosum','세포질의 Henderson–Patterson body.']]
};
const supplements=[];
function add(doc,pages,key,stem,pool,answer,explanation,kind='basic',extra=[]){
 const pairs=typeof pool==='string'?pools[pool]:pool;
 const index=pairs.findIndex(([term])=>term===answer);
 if(index<0||pairs.length!==5)throw Error(key);
 supplements.push({id:`lecture-${doc}-basic-${key}`,lecture:doc,topic:doc,format:'mcq',kind,stem,choices:pairs.map(x=>x[0]),answer:index,keyClue:explanation,explanation,choiceNotes:pairs.map(x=>x[1]),sourceRefs:[{doc,pages},...extra],examRefs:[]});
}

add('261104_01',[3,14],'catalase','포도알균과 사슬알균을 나누는 기본 효소 반응은?','enzymes','Catalase','포도알균은 catalase 양성, 사슬알균은 음성이다.');
add('261104_01',[2,14,23],'coagulase','S. aureus와 S. epidermidis를 구분하는 대표 효소는?','enzymes','Coagulase','S. aureus는 coagulase 양성, S. epidermidis는 음성이다.');
add('261104_01',[11],'protein-a','S. aureus가 IgG의 Fc 부위에 결합하는 데 사용하는 인자는?','staphVir','Protein A','Protein A가 IgG Fc에 결합하여 opsonization을 방해한다.');
add('261104_01',[14,15],'h2o2','H₂O₂가 물과 산소로 분해되는 반응을 보는 검사의 표적 효소는?','enzymes','Catalase','Catalase가 H₂O₂를 분해하며, superoxide를 H₂O₂로 바꾸는 SOD와 구분한다.');
add('261104_01',[14,15],'fibrin','Fibrinogen에서 fibrin이 형성되는 반응과 연결되는 효소는?','enzymes','Coagulase','Coagulase의 응고 반응을 catalase·DNase와 구분한다.');
add('261104_01',[3],'shape','포도송이 모양으로 배열된 알균이 Gram 염색에서 보라색으로 보인다. 기본 분류는?','gram','그람양성 알균','포도알균은 그람양성 알균이며 아포와 운동성이 없다.');
add('261104_01',[23,34],'identification','포도송이 배열·catalase 양성·coagulase 양성인 균은?','cocci','S. aureus','세 검사 소견을 결합하면 S. aureus에 맞는다.');
const staphToxins=[['ETA','염색체 유래, 상대적으로 내열성인 exfoliative toxin.'],['ETB','플라스미드 유래, 상대적으로 열불안정한 exfoliative toxin.'],['TSST-1','Superantigen으로 작용하는 독성쇼크 관련 독소.'],['α-toxin','막 손상과 pore 형성에 관여하는 독소.'],['Enterotoxin','식중독의 구토와 관련된 장독소.']];
add('261104_01',[13],'eta','Exfoliative toxin 중 염색체 유래·내열성과 연결되는 것은?',staphToxins,'ETA','ETA는 염색체 유래·내열성, ETB는 플라스미드 유래·열불안정성으로 비교한다.');
add('261104_01',[13],'etb','플라스미드에 암호화되는 열불안정성 exfoliative toxin은?',staphToxins,'ETB','ETA와 ETB의 유전자 위치·열안정성을 바꾸지 않도록 구분한다.');

add('261105_01',[3],'catalase','사슬 모양의 그람양성 알균에서 H₂O₂ 분해 반응이 음성이다. 이때 본 효소는?','enzymes','Catalase','사슬알균은 catalase 음성이며 포도알균과 구분된다.');
add('261105_01',[26,27],'optochin','α용혈 알균 중 optochin 감수성·담즙 용해 양성에 맞는 균은?','strep','S. pneumoniae','폐렴구균은 optochin 감수성이고 담즙에 용해된다.');
add('261105_01',[34],'pyr','PYR 양성인 알균이 담즙과 optochin에 저항성을 보였다. 맞는 분류는?','strep','Enterococcus','Enterococcus의 PYR 양성·담즙 저항성을 폐렴구균의 담즙 용해와 구분한다.');
add('261105_01',[6,37],'gbs','B군 β용혈 사슬알균으로 신생아 패혈증·수막염과 연결되는 균은?','strep','S. agalactiae','B군 사슬알균은 S. agalactiae이며 산모 집락과 신생아 감염을 연결한다.');
add('261105_01',[6,10,11],'gas','A군 β용혈 사슬알균으로 인두염 후 류마티스열과 연결되는 균은?','strep','S. pyogenes','GAS는 S. pyogenes이며 GBS·viridans군과 구분한다.');
add('261105_01',[26,27,34],'bile','폐렴구균과 장알균의 담즙 반응 조합으로 옳은 것은?',[
 ['폐렴구균 용해 · 장알균 저항','담즙 용해성과 담즙 저항성의 올바른 짝.'],['폐렴구균 저항 · 장알균 용해','두 균의 반응을 서로 바꾼 보기.'],['두 균 모두 용해','장알균의 담즙 저항성을 바꾼 보기.'],['두 균 모두 저항','폐렴구균의 담즙 용해성을 바꾼 보기.'],['폐렴구균 용해 · 장알균 PYR 음성','장알균은 PYR 양성이다.']],
 '폐렴구균 용해 · 장알균 저항','폐렴구균의 담즙 용해와 장알균의 담즙 저항·PYR 양성을 함께 기억한다.');
add('261105_01',[26,27],'microscopy','항생제 투여 전 객담에서 창끝 모양 그람양성 쌍알균이 보였다. α용혈·optochin 감수성과 연결되는 균은?','strep','S. pneumoniae','형태만이 아니라 optochin·담즙 반응을 결합하여 감별한다.');

add('261105_02',[4],'shape','장내세균의 기본 형태 분류는?','gram','그람음성 막대균','장내세균은 그람음성 막대균이며 아포를 형성하지 않는다.');
const oxidase=[['장내세균 − · Pseudomonas +','장내세균과 Pseudomonas의 대표 oxidase 반응.'],['장내세균 + · Pseudomonas −','두 반응을 바꾼 보기.'],['장내세균 + · Pseudomonas +','장내세균의 반응을 바꾼 보기.'],['장내세균 − · Pseudomonas −','Pseudomonas의 반응을 바꾼 보기.'],['장내세균 + · Vibrio −','장내세균과 Vibrio의 대표 반응을 모두 바꾼 보기.']];
add('261105_02',[4],'oxidase','Oxidase 반응의 대표 조합으로 옳은 것은?',oxidase,'장내세균 − · Pseudomonas +','장내세균은 oxidase 음성, P. aeruginosa는 양성이다.','basic',[{doc:'261105_05',pages:[33]}]);
add('261105_02',[5],'macconkey','Bile salts·crystal violet의 선택성과 lactose 발효를 함께 보는 배지는?','media','MacConkey agar','MacConkey는 그람양성균을 억제하고 lactose 발효를 감별한다.');
add('261105_02',[5],'indicator','MacConkey에서 lactose 발효에 따른 산성화를 나타내는 지시약은?',[
 ['Neutral red','MacConkey의 pH 지시약.'],['Crystal violet','그람양성균 억제에 기여하는 선택 성분.'],['Bile salts','그람양성균 억제에 기여하는 선택 성분.'],['Lactose','발효 여부를 보는 기질.'],['Peptone','영양원으로 쓰이는 단백질 분해물.']],
 'Neutral red','기질은 lactose, 색 변화를 읽는 지시약은 neutral red이다.');
add('261105_02',[6],'kia-black','KIA 결과에서 검은색 침전으로 판단하는 성질은?',[
 ['H₂S 생성','황화수소가 철과 반응하여 검은 침전 형성.'],['Lactose 비발효','당 발효 판정과 H₂S 침전은 구분한다.'],['가스 생성','균열·한천 들림과 연결된다.'],['Urease 활성','요소 분해와 알칼리화의 검사.'],['Indole 생성','Tryptophan 분해 산물에 대한 검사.']],
 'H₂S 생성','검은 침전은 H₂S 생성, 균열·들림은 가스 생성을 시사한다.');
add('261105_02',[6],'kia-gas','KIA 한천의 균열·들림으로 판단하는 성질은?',[
 ['가스 생성','당 대사로 생긴 가스가 균열·들림을 유발.'],['H₂S 생성','검은색 침전과 연결.'],['편모 형성','운동성과 연결되며 균열 판정과 구분.'],['협막 생성','표면의 항식균 구조.'],['Urease 생성','요소 분해효소의 활성.']],
 '가스 생성','가스는 균열·들림, H₂S는 검은 침전으로 구분한다.');
add('261105_02',[9],'h','장내세균의 편모 단백질과 연결되는 항원은?','antigens','H 항원','H는 편모, O는 LPS 체성 항원, K는 협막·표면 항원 범주이다.');
add('261105_02',[9],'o','장내세균 LPS에서 균주의 혈청학적 분류에 중요한 반복 다당류는?','antigens','O 항원','O 항원은 LPS 말단의 반복 다당류이며 내독소 활성 부위 lipid A와 다르다.');
add('261105_02',[9],'lipida','LPS의 내독소 활성과 직접 연결되는 구조는?','antigens','Lipid A','Lipid A가 내독소 활성을 담당하며 O 항원의 혈청형 분류 기능과 구분한다.');
add('261105_02',[10],'conjugation','세균 사이 접합성 플라스미드 전달을 매개하는 구조는?','structures','Sex pilus','숙주 부착 fimbriae와 유전물질 전달 sex pilus를 구분한다.');
add('261105_02',[10],'adhesion','장내세균이 숙주 수용체에 부착하는 기능과 대표적으로 연결되는 것은?','structures','Fimbriae','Fimbriae는 부착, 편모는 운동성, sex pilus는 접합을 담당한다.');
add('261105_02',[10],'nonmotile','장내세균 중 대표적 비운동성 조합은?',[
 ['Shigella · Klebsiella','두 균속은 대표적으로 편모가 없는 비운동성.'],['Shigella · Salmonella','Salmonella는 대표적으로 운동성.'],['Klebsiella · Proteus','Proteus는 활발한 운동성·유주현상.'],['Salmonella · Proteus','두 균속은 대표적으로 운동성.'],['E. coli · Proteus','두 균은 대표적으로 운동성.']],
 'Shigella · Klebsiella','Shigella·Klebsiella의 비운동성을 Salmonella·Proteus와 비교한다.');

add('261105_03',[3,4],'ecoli-imvic','E. coli의 대표 IMViC 결과는?','imvic','++--','Indole·MR 양성, VP·citrate 음성으로 ++--이다.');
add('261105_03',[4],'kp-imvic','K. pneumoniae의 대표 IMViC 결과는?','imvic','--++','K. pneumoniae는 indole·MR 음성, VP·citrate 양성이다.');
add('261105_03',[4],'indole','IMViC 중 tryptophan 분해 산물의 생성을 판단하는 검사는?','imvicTests','Indole','Indole 검사는 tryptophanase에 의한 tryptophan 분해와 연결된다.');
add('261105_03',[4],'mr','IMViC 중 glucose의 혼합산 발효를 판단하는 검사는?','imvicTests','Methyl red','MR은 산 생성, VP는 acetoin을 거치는 발효 경로와 연결된다.');
add('261105_03',[4],'vp','IMViC 중 acetoin 및 2,3-butanediol 발효 경로와 연결되는 검사는?','imvicTests','Voges–Proskauer','VP와 MR의 대사 산물을 구분한다.');
add('261105_03',[4],'citrate','Citrate를 탄소원으로 이용하는 성질을 보는 검사는?','imvicTests','Citrate','IMViC의 C는 citrate 이용 여부이다.');
add('261105_03',[12,20],'h2s','Lactose 비발효 장내세균 중 운동성·H₂S 생성의 대표 조합은?','enteric','Salmonella','Salmonella의 대표 소견을 비운동성·H₂S 음성 Shigella와 비교한다.');
add('261105_03',[20],'shigella','비운동성·H₂S 비생성·가스 비생성인 대표 이질균은?','enteric','Shigella','강의의 Shigella 대표 특성이다. 일부 균주 예외를 일반 원칙과 구분한다.');
add('261105_03',[11,26],'capsule','Lactose 발효균 중 두꺼운 협막·점액성 집락·비운동성에 맞는 것은?','enteric','K. pneumoniae','Klebsiella의 협막·비운동성이 E. coli와의 감별점이다.');
add('261105_03',[29],'swarming','요로감염균에서 활발한 유주현상과 urease 활성이 확인되었다. 원인균속은?','enteric','Proteus','Proteus는 유주현상과 urease에 의한 요로결석을 함께 연결한다.');
add('261105_03',[29],'proteus-indole','Proteus 두 종의 indole 반응으로 옳은 조합은?',[
 ['P. vulgaris + · P. mirabilis −','강의에 제시된 두 종의 반응.'],['P. vulgaris − · P. mirabilis +','두 종의 반응을 교환.'],['P. vulgaris + · P. mirabilis +','P. mirabilis의 반응을 치환.'],['P. vulgaris − · P. mirabilis −','P. vulgaris의 반응을 치환.'],['P. vulgaris urease − · P. mirabilis +','두 Proteus 종 모두 urease 양성이다.']],
 'P. vulgaris + · P. mirabilis −','Urease는 두 종 모두 양성, indole은 vulgaris 양성·mirabilis 음성이다.');
add('261105_03',[29],'ph','Proteus의 urease가 요로결석을 촉진하는 방향은?',[
 ['소변 pH 상승','Urea 분해에 의한 알칼리화로 염 침전 촉진.'],['소변 pH 하강','알칼리화 방향을 반대로 치환.'],['혈액 pH 상승','변화가 강조되는 위치는 소변.'],['위 내 pH 하강','H. pylori의 위 정착 기전과도 방향이 다르다.'],['세포 내 cAMP 상승','장독소의 신호전달과 구분.']],
 '소변 pH 상승','Urease에 의한 암모니아 생성→소변 알칼리화→칼슘·마그네슘 염 침전이다.');

add('261105_05',[14,15],'tcbs','Vibrio의 선택·감별과 sucrose 반응을 연결하는 배지는?','media','TCBS agar','TCBS에서 V. cholerae의 sucrose 발효는 황색과 연결된다.');
add('261105_05',[15],'yellow','TCBS에서 sucrose 발효에 따른 황색과 연결되는 대표 균은?','curved','V. cholerae','V. cholerae의 sucrose 발효 소견을 구분한다.');
add('261105_05',[21],'campy-medium','미호기성 굽은 막대균의 장염과 연결되는 Campylobacter 배지는?','media','Campy-BAP','Campy-BAP·Skirrow·Butzler는 강의에서 Campylobacter와 연결된다.');
add('261105_05',[21],'microaerophile','굽은 막대 모양·미호기성·설사 후 Guillain–Barré syndrome의 조합은?','curved','C. jejuni','Campylobacter 장염 후 신경계 합병증을 H. pylori 위염과 구분한다.');
add('261105_05',[24,25],'hpylori','위 생검에서 굽은 막대균이 관찰되고 urease·catalase·oxidase가 양성이다. 맞는 균은?','curved','H. pylori','H. pylori의 urease가 산성 위 환경에서 정착에 기여한다.');
add('261105_05',[33],'pseudo','Oxidase 양성·lactose 비발효이며 청색·황록색 색소를 보이는 균은?','curved','P. aeruginosa','장내세균의 oxidase 음성과 Pseudomonas의 양성을 비교한다.');
add('261105_05',[33,34],'pyocyanin','P. aeruginosa의 청색 색소로 산화환원 반응·조직 손상과 연결되는 것은?','pigments','Pyocyanin','Pyocyanin은 청색, pyoverdine은 황록색 형광·철 획득이다.');
add('261105_05',[33,34],'pyoverdine','P. aeruginosa의 황록색 형광 siderophore는?','pigments','Pyoverdine','Pyoverdine은 철 획득에 관여하며 pyocyanin과 기능을 바꾸지 않는다.');

add('261105_06',[3],'wall','β-lactam의 표적인 세포벽이 없고 세포막 sterol을 이용하는 세균은?','atypical','Mycoplasma','Mycoplasma는 세포벽이 없으므로 β-lactam의 작용 표적이 없다.');
add('261105_06',[13,14],'inclusion','감염성 EB와 증식성 RB가 세포 내 inclusion을 이루는 균은?','atypical','Chlamydia','Chlamydia의 EB·RB 생활환을 Mycoplasma의 세포벽 결여와 구분한다.');
add('261105_06',[14],'eb','Chlamydia의 elementary body를 바르게 묶은 것은?','chlamStages','EB · 감염성 · 비분열형','EB는 감염성·비분열형, RB는 비감염성·분열형이다.');
add('261105_06',[14],'rb','Chlamydia의 세포 내 증식 단계에 맞는 조합은?','chlamStages','RB · 비감염성 · 분열형','세포 내 분열·증식은 RB의 역할이다.');
add('261105_06',[10],'cold-agglutinin','M. pneumoniae 감염의 cold agglutinin 반응에서 교차반응하는 적혈구 항원은?',[
 ['I 항원','M. pneumoniae 감염의 cold agglutinin과 연결.'],['Vi 항원','S. Typhi의 표면 항원.'],['O 항원','장내세균 LPS 체성 항원.'],['H 항원','편모 단백질 항원.'],['PRP 항원','Hib의 협막 다당류.']],
 'I 항원','Cold agglutinin은 적혈구 I 항원과의 교차반응이며 장내세균 O·H 항원과 구분한다.');
add('261105_06',[13],'spore','Chlamydia EB와 세균 아포를 구분한 옳은 설명은?',[
 ['EB는 감염형 · 아포와 구별','EB는 생활환의 감염형이며 진정한 세균 아포와 다르다.'],['EB는 증식형 · RB는 감염형','EB와 RB 역할을 교환.'],['EB는 아포 · RB는 영양형','EB를 진정한 세균 아포로 치환.'],['RB는 감염형 · 비분열형','EB의 역할을 RB에 치환.'],['EB는 비감염형 · 분열형','RB의 역할을 EB에 치환.']],
 'EB는 감염형 · 아포와 구별','EB의 환경 저항성과 감염성을 진정한 endospore 형성으로 혼동하지 않는다.');

add('261106_03',[9,11],'acidfast','Mycobacterium의 기본 동정에서 Gram 염색 대신 강조되는 염색은?','stain','Acid-fast stain','Mycolic acid가 풍부한 세포벽과 항산성을 연결한다.');
add('261106_03',[11],'mycolic','Mycobacterium의 항산성과 연결되는 긴 사슬 지방산은?','pigments','Mycolic acid','Mycolic acid가 풍부한 세포벽을 다른 균의 색소와 구분한다.');
add('261106_03',[3,41],'tissue','피부병변의 감각 저하와 비후된 말초신경이 동반되었다. 대표 원인균은?',[
 ['M. leprae','피부·말초신경을 침범하는 한센병.'],['M. tuberculosis','폐결핵·육아종성 병변.'],['M. avium complex','면역저하 환자의 기회감염·파종.'],['M. abscessus','환경성 NTM, 폐질환 등.'],['M. intracellulare','MAC에 속하는 NTM.']],
 'M. leprae','말초신경 침범과 감각 저하는 M. leprae 감별의 핵심이다.');
const leprosy=[['TT · 세포면역 강 · 균 적음','Tuberculoid pole의 조합.'],['TT · 세포면역 약 · 균 많음','LL의 소견을 TT에 치환.'],['LL · 세포면역 강 · 균 적음','TT의 소견을 LL에 치환.'],['LL · 세포면역 강 · 균 많음','LL에 강한 세포면역을 붙인 보기.'],['TT · 세포면역 강 · 균 많음','TT의 균 수를 반대로 치환.']];
add('261106_03',[45],'tt','한센병 면역 스펙트럼의 올바른 조합은?',leprosy,'TT · 세포면역 강 · 균 적음','TT는 세포면역이 강하고 균이 적으며, LL은 세포면역이 약하고 균이 많다.');
add('261106_03',[3],'tst','BCG 접종에 의한 양성 반응과 감염에 의한 반응의 구분이 제한되는 검사는?',[
 ['TST','PPD에 대한 피부 지연형 과민반응.'],['IGRA','결핵 특이 항원 자극 후 IFN-γ 분비 측정.'],['AFB smear','검체에서 항산균을 직접 관찰.'],['MTB NAAT','검체에서 결핵균 핵산을 검출.'],['조직 생검','육아종·괴사 등 병리 소견 확인.']],
 'TST','TST와 IGRA는 감염에 대한 면역반응 검사이며 활동성 여부를 검사 하나로 확정하지 않는다.');
add('261106_03',[5,29],'ntm','자연수·토양 노출과 연결되며 결핵균·나병균을 제외한 Mycobacterium 집단은?',[
 ['NTM','Non-tuberculous mycobacteria.'],['MTB complex','결핵균 복합체.'],['M. leprae','한센병 원인균.'],['Chlamydiaceae','EB·RB 생활환을 갖는 별개 세균군.'],['Mycoplasmataceae','세포벽이 없는 별개 세균군.']],
 'NTM','NTM은 환경성 마이코박테리아이며 MTB complex·M. leprae와 구분한다.');

add('261106_05',[4],'shape','Corynebacterium의 곤봉 모양·책상문자 배열과 연결되는 기본 분류는?','gram','그람양성 막대균','Corynebacterium은 그람양성 곤봉형 막대균이다.');
add('261106_05',[12,13],'ef2','Diphtheria toxin의 ADP-ribosylation 표적은?','targets','EF-2','EF-2 불활성화로 단백질 합성이 억제된다.');
add('261106_05',[26],'nocardia','면역저하 환자에서 폐감염 후 뇌농양을 일으키며 토양 유래 분지형 세균인 것은?',[
 ['Nocardia','분지형 세균, 폐감염·중추신경계 농양.'],['Actinomyces','만성 화농·sulfur granule, 구강 점막 손상과 연결.'],['Aspergillus','진균, 격벽이 있는 예각 분지 균사.'],['Mucorales','진균, 넓고 격벽이 드문 균사.'],['Corynebacterium','곤봉형 그람양성 막대균.']],
 'Nocardia','Nocardia는 곰팡이처럼 보여도 세균이며 면역저하·폐감염·뇌농양을 연결한다.');
add('261106_05',[27,28],'ros','Nocardia의 oxidative burst 방어와 관련하여 H₂O₂를 해독하는 효소는?','enzymes','Catalase','SOD는 superoxide를 H₂O₂로, catalase는 H₂O₂를 물·산소로 바꾼다.');

add('261106_06',[7],'sod','Superoxide → H₂O₂ → H₂O·O₂ 해독 반응의 올바른 순서는?',[
 ['SOD → catalase','Superoxide dismutase 다음 catalase.'],['Catalase → SOD','두 효소 순서를 교환.'],['SOD → coagulase','H₂O₂ 해독 효소를 응고효소로 치환.'],['Catalase → DNase','ROS 해독을 DNA 분해와 치환.'],['Coagulase → catalase','첫 반응을 응고 반응으로 치환.']],
 'SOD → catalase','두 ROS 해독 효소의 기질·생성물·순서를 구분한다.');
add('261106_06',[26],'spore','항생제 관련 대장염을 일으키는 아포형성 무산소 그람양성 막대균은?','anaerobes','C. difficile','C. difficile의 아포는 환경 잔존·전파 관리에 중요하다.');
add('261106_06',[31],'tcda','C. difficile의 TcdA·TcdB가 불활성화하는 숙주 단백질은?','targets','Rho·Rac','TcdA·TcdB의 Rho·Rac glycosylation과 CDT의 actin ADP-ribosylation을 구분한다.');
add('261106_06',[32],'cdt','C. difficile의 binary toxin CDT가 ADP-ribosylation하는 표적은?','targets','Actin','CDT는 actin 중합을 방해한다. TcdA·TcdB의 표적과 다르다.');
add('261106_06',[18],'fragilis','복강 내 감염·농양과 관련되며 비교적 산소 노출에 잘 견디는 무산소 균은?','anaerobes','B. fragilis','B. fragilis는 무산소균이지만 다른 엄격 무산소균과 산소 내성이 다르다.');
add('261106_06',[19,20],'bft','ETBF의 BFT가 절단하여 장 상피 장벽을 교란하는 표적은?',[
 ['E-cadherin','상피세포 간 접착을 유지하는 단백질.'],['Rho·Rac','C. difficile TcdA·TcdB 표적.'],['Actin','C. difficile CDT 표적.'],['SNARE','Tetanus·botulinum toxin의 단백질분해 표적.'],['EF-2','Diphtheria toxin·exotoxin A 표적.']],
 'E-cadherin','BFT의 E-cadherin 절단을 C. difficile 독소의 세포골격 표적과 비교한다.');
add('261106_06',[22,23],'fusobacterium','구강 유래 무산소균으로 대장암 미세환경과의 관련성이 강조된 것은?','anaerobes','F. nucleatum','F. nucleatum의 구강–장관 연관을 B. fragilis의 BFT와 구분한다.');

add('261109_01',[5],'haemo-shape','H. influenzae의 다형태성 coccobacilli와 연결되는 기본 분류는?','gram','그람음성 짧은막대균','H. influenzae는 작은 그람음성 짧은막대균이다.');
add('261109_01',[6],'x','H. influenzae의 X인자에 대한 옳은 대응은?','factor','X = hemin','X인자는 hemin, V인자는 NAD이다.');
add('261109_01',[6],'v','H. influenzae의 V인자에 대한 옳은 대응은?','factor','V = NAD','성장인자 X·V와 Hib 협막 PRP를 구분한다.');
add('261109_01',[6],'chocolate','X·V 인자 요구성을 갖는 H. influenzae와 연결되는 배지는?','media','Chocolate agar','Chocolate agar에서는 적혈구 유래 성장인자 이용이 가능하다.');
add('261109_01',[7],'satellitism','H. influenzae의 위성현상에서 S. aureus가 이용 가능한 형태로 제공하는 것은?','factor','V = NAD','위성현상은 V인자 공급과 H. influenzae의 성장인자 요구성을 보여준다.');
add('261109_01',[23],'thayer','병원성 Neisseria의 선택배지에 해당하는 것은?','media','Thayer–Martin agar','Neisseria의 선택배지는 Thayer–Martin이다.');
add('261109_01',[23,30],'gono-sugar','임균의 대표 당 이용을 바르게 묶은 것은?','neisseria','임균 · glucose','임균은 glucose, 수막염균은 glucose와 maltose 이용으로 비교한다.');
add('261109_01',[30],'meningo-sugar','Maltose 이용이 감별에 도움이 되는 올바른 조합은?','neisseria','수막염균 · glucose+maltose','N. meningitidis와 N. gonorrhoeae의 당 이용을 바꾸지 않는다.');
add('261109_01',[16],'pt','B. pertussis의 PT가 ADP-ribosylation하는 표적은?','targets','Giα','PT는 Giα, cholera toxin은 Gsα에 작용한다.');
add('261109_01',[4,5],'nthi','H. influenzae의 NTHi를 바르게 해석한 것은?',[
 ['비피막형 · 혈청형 분류 불가','Nontypeable H. influenzae의 의미.'],['협막 보유형 · b형','Hib의 정의를 NTHi에 치환.'],['협막 보유형 · a형','혈청형 보유 균주를 NTHi에 치환.'],['비피막형 · b형','비피막형과 b형 협막 항원을 혼합.'],['협막 보유형 · f형','f형은 typeable 균주이다.']],
 '비피막형 · 혈청형 분류 불가','NTHi의 무증상 집락과 점막 감염을 Hib의 침습성 질환과 구분한다.');

add('261109_02',[55,56,63],'listeria','그람양성 짧은막대균·catalase 양성·약한 β용혈이며 아포가 없는 균은?',[
 ['L. monocytogenes','비아포형성, 약한 β용혈·catalase 양성.'],['B. cereus','아포형성 그람양성 막대균.'],['B. anthracis','아포형성 그람양성 막대균.'],['S. agalactiae','그람양성 알균·catalase 음성.'],['E. coli','그람음성 막대균.']],
 'L. monocytogenes','Listeria의 비아포형성과 짧은막대 모양을 Bacillus·GBS와 비교한다.');
add('261109_02',[58,59],'entry','Listeria가 숙주세포에 진입하는 단계의 대표 인자는?','listeriaFactors','Internalin','진입은 internalin, 포식소체 탈출은 LLO, 세포질 운동은 ActA이다.');
add('261109_02',[58,59],'escape','Listeria가 포식소체 막을 손상시키는 대표 인자는?','listeriaFactors','Listeriolysin O','Listeriolysin O는 탈출, ActA는 탈출 후 actin 기반 운동이다.');
add('261109_02',[59],'acta','Listeria의 세포질 내 actin 중합 운동을 유도하는 인자는?','listeriaFactors','ActA','ActA와 internalin·LLO의 단계별 역할을 구분한다.');
add('261109_02',[38],'anthrax-capsule','탄저균 협막의 성분으로 옳은 것은?',[
 ['Poly-D-glutamic acid','탄저균의 특이한 폴리펩타이드 협막.'],['Hyaluronic acid','S. pyogenes 협막과 연결.'],['Polyribosylribitol phosphate','Hib의 PRP 협막.'],['Sialic acid 함유 다당류','일부 수막염 원인균의 협막과 연결.'],['Lipid A','협막이 아니라 LPS의 내독소 활성 부위.']],
 'Poly-D-glutamic acid','탄저균의 협막은 다당류가 아니라 poly-D-glutamic acid이다.');
add('261109_02',[34,55],'spores','Bacillus와 Listeria의 아포 형성을 바르게 비교한 것은?',[
 ['Bacillus + · Listeria −','Bacillus는 아포형성, Listeria는 비아포형성.'],['Bacillus − · Listeria +','두 균속의 반응을 교환.'],['Bacillus + · Listeria +','Listeria에 아포형성을 붙인 보기.'],['Bacillus − · Listeria −','Bacillus의 아포형성을 없앤 보기.'],['Bacillus − · Clostridium +','Clostridium은 맞지만 Bacillus는 아포형성이다.']],
 'Bacillus + · Listeria −','그람양성 막대균이라는 공통점에서 아포 형성 여부를 더해 감별한다.');

add('261110_01',[4],'endoflagella','Spirochete의 운동과 연결되는 구조는?',[
 ['Endoflagella','Periplasm의 축성 편모.'],['Fimbriae','대표적으로 숙주 부착에 관여.'],['Sex pilus','접합성 유전물질 전달에 관여.'],['Capsule','식균 회피에 관여.'],['Endospore','환경 저항성 휴면 구조.']],
 'Endoflagella','나선균의 endoflagella를 외부 부착 섬모·성섬모와 구분한다.');
add('261110_01',[7],'rpr','혈청 정량 역가로 매독 치료 반응을 추적하는 대표 검사군은?',[
 ['비트레포네마 검사','RPR·VDRL의 정량 역가로 반응 추적.'],['트레포네마 EIA','특이 항체 검출, 치료 후 양성이 지속될 수 있다.'],['TPPA','트레포네마 특이 항체 검사.'],['FTA-ABS','트레포네마 특이 항체 검사.'],['매독균 조직 IHC','조직 내 균 항원 검출.']],
 '비트레포네마 검사','RPR·VDRL은 비트레포네마 검사로 정량 역가 추적에 사용하며 특이 항체 검사와 목적을 구분한다.');
add('261110_01',[7],'treponemal','다음 중 트레포네마 특이 항체 검사에 해당하는 것은?',[
 ['TPPA','Treponema pallidum 특이 항체에 대한 입자응집 검사.'],['RPR','비트레포네마 항체 검사.'],['VDRL','비트레포네마 항체 검사.'],['정량 RPR 역가','비트레포네마 검사 결과의 정량.'],['정량 VDRL 역가','비트레포네마 검사 결과의 정량.']],
 'TPPA','TPPA·FTA-ABS·treponemal EIA는 특이 항체 검사, RPR·VDRL은 비트레포네마 검사이다.');
add('261110_01',[11,12],'vmp','재귀열에서 균혈증·발열이 반복되는 항원변이 단백질은?',[
 ['Vmp','재귀열 Borrelia의 variable major protein.'],['VlsE','Lyme Borrelia의 항원변이와 연관.'],['TSA56','Orientia의 type-specific antigen.'],['M protein','GAS의 항식균 인자.'],['Protein A','S. aureus의 IgG Fc 결합 단백질.']],
 'Vmp','재귀열 Vmp와 Lyme disease의 VlsE를 구분한다.');
add('261110_01',[14],'vlse','Lyme Borrelia의 항원변이와 연결되는 것은?',[
 ['VlsE','Lyme Borrelia의 variable major protein-like sequence.'],['Vmp','재귀열 Borrelia의 variable major protein.'],['TSA56','Orientia의 type-specific antigen.'],['PRP','Hib 협막 다당류.'],['Opa','Neisseria의 부착 관련 단백질.']],
 'VlsE','Lyme의 VlsE와 재귀열의 Vmp를 대상만 바꾼 보기에서 구분한다.');
add('261110_01',[19,26],'lepto','동물 소변에 오염된 물 노출 뒤 발열·결막 충혈·황달·신장 손상이 생겼다. 원인균은?','spiro','Leptospira','황달·신부전을 동반한 중증 렙토스피라증을 Weil병으로 연결한다.','case');

add('261110_03',[4],'cytoplasm','Rickettsia와 Orientia의 대표 세포 내 증식 장소는?','cellular','세포질','Anaplasma·Ehrlichia의 phagosome과 구분한다.');
add('261110_03',[4],'phagosome','Anaplasma와 Ehrlichia의 대표 세포 내 위치는?','cellular','포식소체','세포 내 세균이라는 공통점에 증식 장소를 더해 비교한다.');
add('261110_03',[6,8],'prowazekii','Epidemic typhus의 매개체는?','vectors','Louse','R. prowazekii–epidemic typhus–몸니를 연결한다.');
add('261110_03',[6,8],'typhi','Murine typhus의 매개체는?','vectors','Flea','R. typhi–murine typhus–벼룩을 epidemic typhus와 구분한다.');
add('261110_03',[6,9],'rmsf','Rocky Mountain spotted fever의 원인균은?','rickettsia','R. rickettsii','R. rickettsii–RMSF–진드기의 조합이다.');
add('261110_03',[6,9],'pox','응애 매개 rickettsialpox의 원인균은?','rickettsia','R. akari','R. akari와 O. tsutsugamushi는 같은 큰 매개체 분류라도 질환을 구분한다.');
add('261110_03',[6,34],'anaplasma','A. phagocytophilum의 morula를 확인하는 대표 세포는?','hostCells','과립구','Anaplasma는 과립구, E. chaffeensis는 단핵구이다.');
add('261110_03',[6,34],'ehrlichia','E. chaffeensis의 morula를 확인하는 대표 세포는?','hostCells','단핵구','Human monocytic ehrlichiosis와 granulocytic anaplasmosis를 비교한다.');

add('261104_02',[15],'gms','조직에서 진균의 벽을 검게 강조하는 특수염색은?','stain','GMS stain','GMS의 진균 벽 염색과 mucicarmine의 협막 염색을 구분한다.');
add('261104_02',[15],'capsule','효모의 두꺼운 다당류 협막을 강조하는 염색은?','stain','Mucicarmine','Cryptococcus의 협막은 mucicarmine으로 강조된다.');
add('261104_03',[37,43],'candida','출아 효모와 가성균사가 함께 보이는 점막 감염의 대표 진균은?','fungi','Candida','Candida의 가성균사를 Aspergillus·Mucorales의 균사와 구분한다.');
add('261104_03',[45],'pcp','세포면역 저하 환자의 폐포 내 거품성 삼출물, GMS 양성 낭벽에 맞는 것은?','fungi','Pneumocystis','Pneumocystis의 폐포 내 거품성 물질과 낭벽 소견을 연결한다.');
add('261104_05',[13,14,15],'hsv','다핵세포·핵 molding·핵 내 봉입체가 함께 관찰되는 감염은?','virus','HSV','HSV의 핵 변화와 CMV의 거대세포를 비교한다.');
add('261104_05',[7,8],'cmv','거대세포 안에 owl’s eye 형태의 핵 내 봉입체가 보인다. 원인은?','virus','CMV','CMV는 거대세포·핵 내 봉입체가 대표적이다.');

export const SUPPLEMENTAL_QUESTIONS=Object.freeze(supplements);

const integrated=[];
function mix(key,stem,pool,answer,refs,explanation,kind='case'){
 const pairs=typeof pool==='string'?pools[pool]:pool;
 integrated.push({id:`lecture-integrated-${key}`,lecture:'integrated',topic:'integrated',format:'mcq',kind,stem,choices:pairs.map(x=>x[0]),answer:pairs.findIndex(x=>x[0]===answer),keyClue:explanation,explanation,choiceNotes:pairs.map(x=>x[1]),sourceRefs:refs.map(([doc,...pages])=>({doc,pages})),examRefs:[]});
}
const pneumonia=[['S. pneumoniae','창끝 모양 그람양성 쌍알균, optochin 감수성·담즙 용해.'],['K. pneumoniae','두꺼운 협막·점액성 집락, lactose 발효 그람음성 막대균.'],['M. pneumoniae','세포벽이 없고 cold agglutinin이 감별에 도움.'],['C. pneumoniae','세포 내 inclusion 및 EB·RB 생활환.'],['L. pneumophila','수계 노출, 폐렴·설사, 일반 Gram 염색에 잘 보이지 않음.']];
mix('pneumococcus','비장절제 환자의 대엽성 폐렴이다. 객담에서 창끝 모양 쌍알균이 관찰되었고 optochin 감수성·담즙 용해 양성이다. 원인균은?',pneumonia,'S. pneumoniae',[['261105_01',26,27],['261105_03',11,26]],'협막 보유라는 공통점보다 알균 형태·optochin·담즙 반응이 결정적이다.');
mix('klebsiella','알코올 사용장애 환자의 폐렴이다. 검체에서 두꺼운 협막을 가진 비운동성 그람음성 막대균이 확인되었고 lactose 발효 양성이다. 원인균은?',pneumonia,'K. pneumoniae',[['261105_03',11,26],['261105_01',26]],'Klebsiella의 협막·비운동성·lactose 발효를 폐렴구균 형태와 비교한다.');
mix('mycoplasma','기숙사에서 마른기침을 동반한 폐렴이 발생했다. 원인체는 세포벽이 없고, 환자 혈청이 낮은 온도에서 적혈구 I 항원과 교차반응한다. 원인균은?',pneumonia,'M. pneumoniae',[['261105_06',3,10],['261109_02',11,14]],'세포벽 결여와 cold agglutinin이 Mycoplasma의 감별 단서이다.');
mix('legionella','이식 환자가 호텔 숙박 뒤 폐렴·고열·설사를 보였다. 일반 Gram 염색에서는 균이 잘 보이지 않았고 소변에서 L. pneumophila SG1 항원이 검출되었다. 원인균은?',pneumonia,'L. pneumophila',[['261109_02',16,19,20],['261105_06',23]],'수계 노출과 SG1 항원이 Legionella를 지지한다.');
mix('chlamydia','인두통 뒤 마른기침과 폐렴이 생겼다. 원인균은 세포 내 inclusion을 형성하며 감염형 EB와 증식형 RB의 생활환을 보인다. 원인균은?',pneumonia,'C. pneumoniae',[['261105_06',14,23],['261109_02',11]],'EB·RB 생활환이 다른 비정형 폐렴균과의 감별점이다.');
const neonatal=[['S. agalactiae','B군 β용혈 그람양성 사슬알균.'],['L. monocytogenes','비아포형성 그람양성 짧은막대균, 임신·신생아 위험군.'],['E. coli','그람음성 막대균, 신생아 수막염·패혈증.'],['N. meningitidis','그람음성 쌍알균, 수막염·자반성 패혈증.'],['H. influenzae','그람음성 짧은막대균, Hib 침습성 감염.']];
mix('neonatal-gbs','생후 20일 신생아에게 발열과 경련이 발생했다. CSF에서 사슬 모양 그람양성 알균이 확인되었고 Lancefield B군이다. 원인균은?',neonatal,'S. agalactiae',[['261105_01',6,37],['261109_02',55,63]],'신생아라는 위험군에 더해 사슬알균·B군이 Listeria와 구분된다.');
mix('neonatal-listeria','임신 말기 발열을 앓은 산모의 신생아에게 수막염이 발생했다. 균은 catalase 양성·약한 β용혈·아포 음성인 그람양성 짧은막대균이다. 원인균은?',neonatal,'L. monocytogenes',[['261109_02',55,56,63],['261105_01',6]],'GBS는 알균·catalase 음성, Listeria는 짧은막대균·catalase 양성이다.');
mix('neonatal-ecoli','신생아 수막염의 원인균은 그람음성 막대균이며 lactose를 발효하고 IMViC가 ++--였다. 원인균은?',neonatal,'E. coli',[['261105_03',3,4],['261109_01',5,23]],'연령만으로 고르지 않고 형태·lactose·IMViC를 결합한다.');
mix('meningococcus','청소년에게 고열·경부강직·빠르게 퍼지는 자반이 생겼다. CSF에서 그람음성 쌍알균이 관찰되고 glucose와 maltose를 이용한다. 원인균은?',neonatal,'N. meningitidis',[['261109_01',30,31],['261105_01',26]],'그람음성 쌍알균과 maltose 이용으로 다른 수막염 원인균을 배제한다.');
mix('hib','예방접종을 받지 않은 유아의 수막염에서 다형성 그람음성 짧은막대균이 확인되었다. 균은 X·V 인자를 요구하며 PRP 협막을 가진다. 원인균은?',neonatal,'H. influenzae',[['261109_01',5,6,8],['261105_03',3]],'Hib의 PRP 협막과 X·V 요구성을 E. coli·수막염균과 구분한다.');
const diarrhea=[['V. cholerae','다량의 수양성 설사, Gsα–cAMP 신호.'],['ETEC','여행자 설사, LT·ST 장독소.'],['EHEC','혈성 설사·HUS, Shiga-like toxin.'],['Shigella','침습성 이질, 비운동성·H₂S 음성.'],['C. difficile','항생제 관련 위막성 대장염, TcdA·TcdB.']];
mix('cholera','대량의 쌀뜨물 같은 설사와 탈수가 있다. 굽은 그람음성 막대균이 oxidase 양성이며 TCBS에서 sucrose 발효 황색을 보였다. 원인균은?',diarrhea,'V. cholerae',[['261105_05',14,15],['261105_03',5]],'ETEC도 분비성 설사를 유발하므로 형태·oxidase·TCBS를 함께 본다.');
mix('ehec','덜 익힌 쇠고기 섭취 후 혈성 설사가 생겼고 빈혈·혈소판 감소·급성 신손상이 뒤따랐다. 원인체는 E. coli O157:H7이다. 병원형은?',diarrhea,'EHEC',[['261105_03',3,8],['261105_05',21]],'HUS와 Shiga-like toxin을 ETEC의 LT·ST와 구분한다.');
mix('shigella','발열·복통·소량씩 잦은 점혈변이 생겼다. 분리균은 oxidase 음성·비운동성·H₂S 음성인 그람음성 막대균이다. 대표 원인균은?',diarrhea,'Shigella',[['261105_03',20,21],['261105_05',21]],'임상적 염증성 설사에 비운동성·H₂S 음성을 더해 감별한다.');
mix('cdiff','광범위 항생제 치료 후 수양성 설사와 대장 위막이 발생했다. 균은 아포를 형성하며 독소가 Rho·Rac을 불활성화한다. 원인균은?',diarrhea,'C. difficile',[['261106_06',26,31],['261104_03',17]],'아포·항생제 노출·위막·TcdA/B 표적을 결합한다.');
mix('etec','여행 후 비혈성 설사가 생겼다. 원인체가 lactose 발효·oxidase 음성인 E. coli로 동정되었고 LT·ST 장독소가 확인되었다. 병원형은?',diarrhea,'ETEC',[['261105_03',3,5],['261105_05',15]],'Cholera와 분비성 설사 기전을 공유하지만 균종·LT/ST 조합이 다르다.');
const toxins=[['Diphtheria toxin','EF-2 ADP-ribosylation.'],['Cholera toxin','Gsα ADP-ribosylation.'],['Pertussis toxin','Giα ADP-ribosylation.'],['TcdA·TcdB','Rho·Rac glycosylation.'],['CDT','Actin ADP-ribosylation.']];
mix('toxin-ef2','인두의 회백색 위막과 심근염이 있는 환자에서 세균 외독소의 EF-2 ADP-ribosylation이 확인되었다. 독소는?',toxins,'Diphtheria toxin',[['261106_05',7,12,13],['261109_01',16]],'효소 반응이 같아 보여도 표적 EF-2·Gs·Gi를 구분한다.','basic');
mix('toxin-gs','분비성 설사 환자의 원인균은 V. cholerae이다. Gsα를 ADP-ribosylation하여 cAMP를 증가시키는 독소는?',toxins,'Cholera toxin',[['261105_05',9,10],['261109_01',16]],'Cholera toxin은 Gs, pertussis toxin은 Gi를 표적으로 한다.','basic');
mix('toxin-gi','발작적 기침·기침 후 구토·림프구 증가가 있는 영아에서 Giα ADP-ribosylation이 확인되었다. 독소는?',toxins,'Pertussis toxin',[['261109_01',16,17],['261105_05',9,10]],'직접 cAMP를 합성하는 ACT와 Gi를 조절하는 PT를 구분한다.','basic');
mix('toxin-rho','항생제 관련 대장염의 세균 독소가 Rho·Rac GTPase를 glycosylation하여 불활성화한다. 독소는?',toxins,'TcdA·TcdB',[['261106_06',31,32],['261106_05',13]],'TcdA/B는 glycosylation, CDT는 actin ADP-ribosylation이다.','basic');
mix('toxin-actin','C. difficile 균주에서 TcdA/B 이외에 binary toxin이 확인되었다. Actin ADP-ribosylation으로 중합을 방해하는 인자는?',toxins,'CDT',[['261106_06',31,32],['261109_02',59]],'같은 actin이라도 CDT는 중합 방해, Listeria ActA는 숙주 actin 중합을 이용한다.','basic');
const paralysis=[['C. tetani','억제성 신경전달물질 방출 감소, 경직성 마비.'],['C. botulinum','말초 ACh 방출 감소, 이완성 마비.'],['C. jejuni','장염 후 Guillain–Barré syndrome.'],['C. diphtheriae','독소성 신경병증·심근염.'],['M. leprae','말초신경 침범·감각 저하.']];
mix('tetanus','외상 뒤 개구장애와 근육 경련이 발생했다. GABA·glycine 방출을 억제하는 독소를 만드는 균은?',paralysis,'C. tetani',[['261106_06',38,41],['261106_05',7]],'억제 신호 소실에 의한 경직을 말초 ACh 감소의 이완성 마비와 구분한다.');
mix('botulism','음식 섭취 후 복시·연하곤란이 시작되어 하행성 이완성 마비로 진행했다. 신경근접합부 ACh 방출을 억제하는 균은?',paralysis,'C. botulinum',[['261106_06',41,44],['261105_05',21]],'보툴리눔은 ACh 방출 억제, 파상풍은 억제성 전달물질 방출 억제이다.');
mix('gbs','설사가 호전된 뒤 상행성 근력 저하와 반사 감소가 발생했다. 선행 장염 원인균으로 가장 적절한 것은?',paralysis,'C. jejuni',[['261105_05',21,22],['261106_06',41,44]],'장염 후 면역성 Guillain–Barré syndrome을 독소의 직접 신경전달 차단과 구분한다.');
const branched=[['Nocardia','분지형 세균, 면역저하 환자의 폐·뇌농양.'],['Actinomyces','분지형 그람양성균, 만성 화농·sulfur granule.'],['Aspergillus','격벽 있는 예각 분지 균사, 혈관침범.'],['Mucorales','넓고 격벽 드문 균사, 넓은 각도 분지.'],['M. tuberculosis','항산성 막대균, 건락성 육아종.']];
mix('nocardia','면역억제 환자에게 폐결절과 뇌농양이 발생했다. 검체에서 곰팡이처럼 분지하지만 세균으로 확인된 토양 유래 원인체는?',branched,'Nocardia',[['261106_05',26,27,32],['261104_03',29,37]],'분지 모양만 보지 않고 세균 여부·숙주·폐와 뇌 침범을 결합한다.');
mix('actinomyces','장기간 자궁내장치를 사용한 환자에게 골반 농양·누공이 생겼다. 노란 과립 안에 방사상 분지 그람양성 세균이 보였다. 원인체는?',branched,'Actinomyces',[['261104_03',29,30],['261106_05',26]],'Sulfur granule·만성 화농·점막 손상 맥락이 Actinomyces를 지지한다.');
mix('aspergillus','호중구감소증 환자의 폐 생검에서 균사가 혈관을 침범했다. 균사 폭이 비교적 균일하고 격벽과 예각 분지가 뚜렷하다. 원인체는?',branched,'Aspergillus',[['261104_03',37,41],['261106_05',26]],'Aspergillus의 격벽·예각을 Mucorales의 넓은 무격벽성 균사와 비교한다.');
mix('mucorales','당뇨병 환자의 괴사성 비부비동 병변이다. 넓고 리본 모양인 균사에 격벽이 드물며 넓은 각도로 불규칙하게 분지한다. 원인체는?',branched,'Mucorales',[['261104_03',37,42],['261104_05',35,36,38]],'혈관침범은 Aspergillus도 가능하므로 폭·격벽·분지각을 함께 본다.');
const fever=[['O. tsutsugamushi','야외활동·가피·발진, 털진드기 유충.'],['Leptospira','동물 소변 오염수·결막 충혈·황달·신손상.'],['R. prowazekii','몸니 매개 epidemic typhus.'],['B. burgdorferi','Ixodes 매개 Lyme disease·이동홍반.'],['B. recurrentis','이매개 재귀열, Vmp 항원변이.']];
mix('scrub','가을 야외활동 뒤 발열·발진·림프절종대가 생겼다. 몸에서 가피가 확인되었고 털진드기 유충 노출이 의심된다. 원인체는?',fever,'O. tsutsugamushi',[['261110_03',6,12,13],['261110_01',21,26]],'쯔쯔가무시의 가피·매개체를 렙토스피라의 오염수 노출과 비교한다.');
mix('weil','홍수 뒤 맨손으로 오염수를 치운 환자에게 발열·결막 충혈·황달·급성 신손상이 발생했다. 원인체는?',fever,'Leptospira',[['261110_01',21,26],['261110_03',6]],'Weil병의 황달·신부전·동물 소변 노출이 결정적이다.');
mix('lyme','진드기에 물린 부위의 붉은 병변이 바깥쪽으로 점차 커졌다. 이후 안면신경마비와 관절 증상이 동반되었다. 원인체는?',fever,'B. burgdorferi',[['261110_01',14,15],['261110_03',6,9]],'Lyme의 이동홍반·신경·관절 병변을 진드기매개 Rickettsia 질환과 구분한다.');
mix('relapsing','몸니 노출 위험이 있는 환자에서 발열과 해열이 반복된다. Vmp 항원변이에 따라 새 균혈증이 생긴다. 원인체는?',fever,'B. recurrentis',[['261110_01',11,12],['261110_03',6,8]],'몸니라는 공통점에 재귀열·Vmp를 더하면 R. prowazekii와 구분된다.');
mix('epidemic','몸니가 유행하는 환경에서 집단 발열·발진이 발생했다. 세균은 혈관내피를 침범하며 강의에서 epidemic typhus로 분류된다. 원인체는?',fever,'R. prowazekii',[['261110_03',6,8],['261110_01',11,12]],'Epidemic typhus는 R. prowazekii, 재귀열은 Borrelia이다.');
const intracellular=[['Listeria','포식소체 탈출 후 ActA 기반 세포질 운동.'],['Rickettsia','대표적으로 혈관내피세포 세포질에서 증식.'],['Chlamydia','EB·RB가 세포 내 inclusion을 형성.'],['Anaplasma','과립구 phagosome의 morula.'],['Ehrlichia','단핵구 phagosome의 morula.']];
mix('acta-location','세포 내로 들어온 그람양성 막대균이 포식소체에서 탈출한 뒤 ActA로 숙주 actin 꼬리를 형성한다. 원인균속은?',intracellular,'Listeria',[['261109_02',58,59],['261110_03',4]],'세포질 위치라는 공통점에 ActA·그람양성 막대균을 더해 감별한다.','basic');
mix('granulocyte','발열·백혈구 감소가 있는 진드기 노출 환자에서 과립구 내 morula가 보였다. 원인균속은?',intracellular,'Anaplasma',[['261110_03',4,6,34],['261105_06',14]],'Anaplasma는 과립구, Ehrlichia는 단핵구, Chlamydia는 EB·RB이다.');
mix('monocyte','발열·혈소판 감소가 있는 진드기 노출 환자에서 단핵구 내 morula가 보였다. 대표 원인균속은?',intracellular,'Ehrlichia',[['261110_03',4,6,34],['261109_02',58,59]],'단핵구–Ehrlichia와 과립구–Anaplasma를 대상만 바꾼 보기에서 구분한다.');
const urinary=[['Proteus','유주현상·urease·알칼리뇨·결석.'],['E. coli','대표 요로감염균, lactose 발효·IMViC ++--.'],['S. saprophyticus','젊은 여성 요로감염, coagulase 음성 알균.'],['N. gonorrhoeae','화농성 요도염, 세포 내 그람음성 쌍알균.'],['C. trachomatis','비임균성 요도염, EB·RB 생활환.']];
mix('urinary-stone','요로감염이 반복되는 환자에서 알칼리뇨와 결석이 확인되었다. 균은 유주현상·urease 양성인 그람음성 막대균이다. 원인균속은?',urinary,'Proteus',[['261105_03',29],['261104_01',22]],'Urease 단독보다 유주현상·알칼리뇨·결석의 조합으로 판단한다.');
mix('urinary-cocci','젊은 여성의 단순 방광염이다. 검체에서 catalase 양성·coagulase 음성인 그람양성 알균이 확인되었다. 가장 전형적인 원인균은?',urinary,'S. saprophyticus',[['261104_01',21,22,23],['261105_03',3]],'여성 요로감염이라는 공통점에서 Gram·모양·coagulase를 더한다.');
mix('urethritis','화농성 요도분비물에서 호중구 내부의 그람음성 쌍알균이 관찰되었다. 원인균은?',urinary,'N. gonorrhoeae',[['261109_01',23,26],['261105_06',18]],'비임균성 요도염과 달리 세포 내 그람음성 쌍알균이 결정적이다.');
mix('media-association','점막 감염 검체의 원인균은 그람음성 쌍알균이며 oxidase 양성이다. 병원성 Neisseria 선택배지로 옳은 것은?','media','Thayer–Martin agar',[['261109_01',23],['261105_02',5],['261105_05',14,21]],'배지 이름을 나란히 놓고 균종·형태·반응을 연결한다.','basic');
mix('oxidase-cross','그람음성 막대균을 비교한다. 장내세균과 구분되는 P. aeruginosa의 대표 반응은?',[
 ['Oxidase + · lactose −','Pseudomonas의 대표 조합.'],['Oxidase − · lactose +','대표 lactose 발효 장내세균과 연결.'],['Oxidase − · lactose −','Salmonella·Shigella 등의 대표 조합.'],['Oxidase + · lactose +','Pseudomonas의 lactose 반응을 치환.'],['Catalase − · lactose −','Pseudomonas의 catalase 반응을 치환.']],
 'Oxidase + · lactose −',[['261105_02',4,5],['261105_05',33]],'Gram 음성·막대 모양만으로 구분할 수 없으므로 oxidase를 더해 판단한다.','basic');
export const INTEGRATED_QUESTIONS=Object.freeze(integrated);
