// Source-linked original questions. Page numbers are physical PDF pages.
const P={};
const pool=(key,rows)=>P[key]=rows;
pool('period',[['Incubation period','감염에서 증상 발현까지의 잠복기.'],['Latent period','감염에서 전염 가능 시점까지의 잠재기.'],['Infectious period','다른 숙주에게 전파할 수 있는 기간.'],['Prodrome','특이 증상 전에 나타나는 전구 증상 시기.'],['Convalescence','질환 뒤 회복기.']]);
pool('host',[['C5–C9 결핍','말단 보체 결핍과 침습성 Neisseria 감염.'],['B세포·항체 결핍','협막 세균에 대한 항체 방어 저하.'],['T세포 결핍','세포 내 병원체·기회감염 위험.'],['식세포 기능 결함','만성육아종병 등에서 S. aureus·Aspergillus 감염.'],['IL-12 경로 이상','Mycobacterium 감염 감수성.']]);
pool('damage',[['면역복합체 침착','사슬알균 감염 후 사구체신염의 대표 기전.'],['세포매개 면역반응','결핵 육아종 등 숙주 T세포 반응.'],['외독소 작용','균이 분비하는 독소에 의한 조직 손상.'],['LPS 내독소 작용','그람음성균의 lipid A와 전신 염증.'],['직접 세포용해','바이러스 등의 직접적인 세포 손상.']]);
pool('gene',[['stx','Shiga toxin 유전자, EHEC 분자진단.'],['mecA','PBP2a와 MRSA 내성.'],['vanA','Vancomycin 내성과 연관.'],['rpoB','RNA polymerase β 소단위, rifampicin 내성 평가와 연관.'],['kpc','KPC carbapenemase와 연관.']]);
pool('test',[['Gram 염색','Gram 성질·모양·배열 및 염증세포를 빠르게 관찰.'],['배양·감수성검사','분리균 동정과 항균제 감수성을 확인.'],['병원체 PCR','검체의 특정 핵산 표적 검출.'],['숙주 항체검사','감염에 대한 숙주 항체반응 측정.'],['항원검사','병원체 항원 성분 검출.']]);
pool('sample',[['객담','하기도 유래 분비물, 침 오염 정도를 평가.'],['청결 중간뇨','요도·피부 상재균 오염을 줄이는 요배양 검체.'],['BAL','기관지폐포세척액, 하기도 검체.'],['코인두 면봉','급성 호흡기 바이러스 검출의 대표 상기도 검체.'],['뇌척수액','중추신경계 감염에서 사용하는 검체.']]);
pool('diagnosis',[['해부학적 진단','원발·전이 감염 부위 및 감염원 조절 필요성.'],['미생물학적 진단','원인 병원체와 항균제 감수성.'],['숙주 인자','면역·임신·기저질환·장기 기능.'],['약물동태 평가','흡수·분포·대사·배설과 노출 농도.'],['치료반응 평가','발열·증상·검사 변화로 경과 판단.']]);
pool('management',[['감염원 조절','농양 배액·괴사조직 및 감염 이물 제거.'],['경험적 치료','원인균 확정 전 부위·숙주·역학으로 시작.'],['표적 치료','동정·감수성 결과를 반영한 선택.'],['정주→경구 전환','상태·흡수·약물 생체이용률을 평가.'],['대증 치료','수분·통증·발열 등 증상에 대한 관리.']]);
pool('mic',[['MIC','육안적 증식을 억제하는 최소 농도.'],['MBC','세균을 사멸시키는 최소 농도.'],['Breakpoint','S/I/R 범주 판정에 쓰는 기준값.'],['혈중 최고농도','투여 후 혈중에서 도달하는 최대 농도.'],['생체이용률','투여량 중 전신 순환에 도달하는 비율.']]);
pool('target',[['세포벽 합성','β-lactam·vancomycin의 주요 작용 경로.'],['30S ribosome','Aminoglycoside·tetracycline의 결합 부위.'],['50S ribosome','Macrolide·clindamycin·linezolid 등의 결합 부위.'],['세포막','Polymyxin·colistin의 주요 작용 부위.'],['엽산 대사','Trimethoprim·sulfonamide의 억제 경로.']]);
pool('nucleic',[['DNA gyrase·topoisomerase','Quinolone의 표적.'],['RNA polymerase','Rifamycin의 표적.'],['Dihydrofolate reductase','Trimethoprim의 표적.'],['Dihydropteroate synthase','Sulfonamide의 표적.'],['PBP','β-lactam이 결합하는 세포벽 합성 단백질.']]);
pool('resistance',[['표적 변화','PBP2a·표적 전구체 변화 등 약물 결합 감소.'],['약물 분해·불활성화','β-lactamase 등에 의한 약물 파괴·변형.'],['유입 감소','Porin 감소·변화 등 투과성 저하.'],['유출 증가','Efflux에 의한 세포 내 약물 농도 감소.'],['일시적 지속 생존','Persistence: 일부 세포의 가역적 생존 상태.']]);
pool('amrDrugs',[['Nafcillin','감수성 MSSA에서 검토하며 강의에서 CSF 이행을 비교.'],['Cefazolin','MSSA에 유용하나 강의 표에서 CSF 이행은 낮게 분류.'],['Vancomycin','MRSA 등에 사용하는 glycopeptide.'],['Linezolid','VRE·MRSA에 사용, 높은 경구 생체이용률·혈소판 감소 주의.'],['Meropenem','중증 ESBL 감염 등에서 사용하는 carbapenem.']]);
pool('newDrugs',[['Ceftazidime/avibactam','KPC 등에 활성, NDM 등 class B에는 비활성.'],['Ceftolozane/tazobactam','다제내성 녹농균·일부 ESBL과 연결, KPC 억제와 구별.'],['Cefiderocol','철 운반계를 이용하는 siderophore cephalosporin.'],['Linezolid','VRE·MRSA 등 그람양성균 표적.'],['Ertapenem','Pseudomonas·Acinetobacter에 대한 항균력이 부족한 carbapenem.']]);
pool('isolation',[['접촉주의','VRE 등 다제내성균: 손위생·가운·장갑·환경관리.'],['비말주의','인플루엔자·백일해 등에서 적용.'],['공기주의','결핵·홍역·수두 등에서 적용.'],['표준주의','모든 환자 진료의 기본 예방 원칙.'],['항생제 스튜어드십','약제·용량·기간·경로의 적정 사용 관리.']]);
export const EXTENSION_PARTS={};
const Q=[],R=[];
function part(doc,key,title,what,how,why){EXTENSION_PARTS[`${doc}:${key}`]={id:`${doc}:${key}`,lecture:doc,title,what,how,why};}
function f(doc,section,key,pages,prompt,clinical,answer,options,explanation,exam=[]){
 const rows=typeof options==='string'?P[options]:options,choices=rows.map(x=>x[0]);
 if(choices.length!==5||new Set(choices).size!==5||!choices.includes(answer))throw Error(doc+key);
 const shared={lecture:doc,format:'mcq',choices,answer:choices.indexOf(answer),explanation,keyClue:explanation,choiceNotes:rows.map(x=>x[1]),sourceRefs:[{doc:doc==='261102_05'?'antibiotics':doc,pages}],examRefs:exam.map(p=>`1차 족보 PDF ${p}쪽 (유형 참고)`),recallSection:`${doc}:${section}`};
 Q.push({...shared,id:`lecture-${doc}-ext-${key}`,topic:doc,kind:clinical?'case':'basic',stem:clinical||prompt});
 R.push({...shared,id:`table-ext-${doc}-${key}`,topic:`table-ext-${doc}-${section}`,kind:'table',stem:prompt});
}

part('261102_02','period','잠복기·잠재기','감염·증상·전염 가능 시점의 세 시간축을 외웁니다.','한 시간축을 그리고 증상 시작점과 전염 시작점을 번갈아 가립니다.','증상 전 전파가 가능한 감염과 격리·역학 증례를 구분하는 기준입니다.');
part('261102_02','host','숙주 방어 결함','보체·항체·T세포·식세포 결함과 취약 병원체를 연결합니다.','면역 결함을 보고 병원체를, 병원체를 보고 결함을 역으로 떠올립니다.','같은 노출에서도 다른 감염이 발생하는 위험군 증례를 해석합니다.');
part('261102_02','damage','손상 기전·유전 감수성','직접 독소 손상·면역복합체·세포면역 및 유전적 방어를 비교합니다.','감염 후 발생한 병변을 보고 직접 손상인지 면역 손상인지 먼저 나눕니다.','감염 부위의 균 수와 임상 손상이 비례하지 않는 이유를 구분합니다.');
f('261102_02','period','incubation',[10,12],'감염 → 증상 발현까지의 기간은?','접촉 후 감염된 사람이 나흘 뒤 처음 증상을 보였다. 감염에서 증상 발생까지를 가리키는 용어는?','Incubation period','period','Incubation은 증상 발현, latent는 전염력 발생을 종점으로 한다.',[4]);
f('261102_02','period','latent',[10,12],'감염 → 전염 가능 시점까지의 기간은?','감염은 성립했지만 아직 다른 사람에게 전파하지 않는 시기이다. 감염부터 전염력이 생기기 전까지의 기간은?','Latent period','period','잠재기 latent period의 종점은 전염 가능 시점이다.',[4]);
f('261102_02','period','infectious',[8,10],'타인에게 전파할 수 있는 기간은?','증상 발생 전부터 호흡기 분비물로 다른 사람을 감염시킬 수 있었다. 전파 가능한 전체 기간을 가리키는 말은?','Infectious period','period','전염 가능 기간과 임상 증상 기간은 일치하지 않을 수 있다.');
f('261102_02','period','presymptomatic',[10,11],'증상 전 전파가 가능할 때 두 기간의 관계는?',null,'Latent < incubation',[
 ['Latent < incubation','전염력이 증상보다 먼저 시작.'],['Latent > incubation','증상이 전염력보다 먼저 시작.'],['Latent = 회복기','잠재기를 회복기로 바꾼 보기.'],['Incubation = 전염기간','서로 다른 시작·종점의 기간.'],['Latent = 증상기간','잠재기는 증상 기간이 아니다.']],
 '증상 전에 전염력이 생기면 latent period가 incubation period보다 짧다.');
f('261102_02','host','complement',[32],'반복 침습성 Neisseria 감염 → 의심할 면역 결함','반복적인 수막염균 침습성 감염이 있는 환자다. 강의의 선천면역 결함 표에서 우선 연결되는 것은?','C5–C9 결핍','host','말단 보체 C5–C9 결핍은 침습성 수막염균 감염과 연결한다.');
f('261102_02','host','bcell',[32],'협막 세균 반복 감염 → 취약 방어축','폐렴구균·H. influenzae 감염이 반복되며 면역글로불린이 현저히 낮다. 관련 방어 결함은?','B세포·항체 결핍','host','항체 결핍은 협막 세균에 대한 opsonization 방어를 떨어뜨린다.');
f('261102_02','host','phagocyte',[32],'만성육아종병 → 대표 방어 결함','S. aureus와 Aspergillus 감염을 반복하는 만성육아종병 환자다. 주된 결함은?','식세포 기능 결함','host','만성육아종병은 식세포의 살균 기능 결함과 연결한다.');
f('261102_02','host','il12',[32],'Mycobacterium 감수성 → 연관 cytokine 경로',null,'IL-12 경로 이상','host','강의 표는 IL-12 결함과 Mycobacterium 감염을 연결한다.');
f('261102_02','host','tcell',[31,32],'세포 내 병원체 기회감염 → 중요한 면역축',null,'T세포 결핍','host','T세포 기능 저하에서는 세포 내 병원체·기회감염과 재활성화를 함께 고려한다.');
f('261102_02','damage','complex',[24],'사슬알균 후 사구체신염 → 손상 기전','피부감염이 호전된 뒤 혈뇨·부종이 생겼다. 감염 후 사구체신염의 면역 손상은?','면역복합체 침착','damage','사슬알균 후 사구체신염의 면역복합체 손상을 균의 직접 신장 침습과 구분한다.');
f('261102_02','damage','granuloma',[24],'결핵 육아종 → 대표 숙주 손상 반응',null,'세포매개 면역반응','damage','결핵 육아종은 숙주의 세포매개 면역반응과 연결된다.');
f('261102_02','damage','duffy',[46],'Duffy 음성 적혈구 → 감수성이 낮아지는 말라리아',null,'P. vivax',[
 ['P. vivax','적혈구 Duffy 수용체와 연결.'],['P. falciparum','HbS 이형접합의 중증도 보호와 비교.'],['P. malariae','Duffy 결여의 대표 연관 균종과 다름.'],['P. ovale','Duffy 연관성을 치환한 보기.'],['P. knowlesi','Duffy 결여의 대표 강의 조합과 다름.']],
 'Duffy 항원 결여의 보호 효과는 강의에서 P. vivax와 연결한다.');

part('261109_03','mic','MIC·MBC·정균/살균','증식 억제와 사멸의 정의 및 resistance/persistence를 구분합니다.','같은 배양 결과의 서술에서 억제와 사멸이라는 동사만 바꿔 판단합니다.','검사 농도 수치를 임상 감수성과 같은 뜻으로 읽지 않게 하는 기본입니다.');
part('261109_03','target','항생제의 작용 표적','세포벽·세포막·30S·50S·핵산·엽산 표적을 약제와 연결합니다.','약제명→표적, 표적→약제 순서를 번갈아 회상합니다.','같은 계열 이름보다 어떤 합성 단계를 막는지 묻는 선지를 대비합니다.');
part('261109_03','mechanism','내성 기전 네 가지','유입 감소·표적 변화·약물 불활성화·유출을 비교합니다.','세포 안 약물 농도 감소와 약물 결합 저하를 먼저 나누어 외웁니다.','MRSA·VRE·β-lactamase를 같은 내성 방식으로 뭉뚱그리지 않습니다.');
f('261109_03','mic','mic',[4],'육안적 증식을 억제하는 최소 농도는?','분리균을 사멸시키는지와 별개로 육안적 성장을 막는 최소 농도를 보고하려 한다. 용어는?','MIC','mic','MIC는 최소억제농도, MBC는 최소살균농도이다.',[33]);
f('261109_03','mic','mbc',[4],'세균을 사멸시키는 최소 농도는?',null,'MBC','mic','MBC의 C는 cidal이며 MIC의 inhibition과 구분한다.');
f('261109_03','mic','breakpoint',[4,5],'MIC를 S/I/R로 판정할 때 비교하는 기준은?',null,'Breakpoint','mic','MIC 측정치와 임상 감수성 판정 기준은 서로 다른 개념이다.');
f('261109_03','mic','persistence',[15,16],'MIC 상승보다 가역적 일부 세포 생존에 맞는 것은?',null,'일시적 지속 생존','resistance','Persistence는 유전적 내성과 구별되는 가역적 생존 상태이다.');
f('261109_03','target','betalactam',[7],'β-lactam → 주요 억제 경로',null,'세포벽 합성','target','β-lactam은 PBP에 결합해 세포벽 합성을 방해한다.',[33]);
f('261109_03','target','aminoglycoside',[9],'Aminoglycoside → ribosome 결합 부위',null,'30S ribosome','target','Aminoglycoside·tetracycline은 30S, macrolide·linezolid 등은 50S이다.');
f('261109_03','target','tetracycline',[9],'Tetracycline → ribosome 결합 부위',null,'30S ribosome','target','Tetracycline의 30S 결합을 macrolide의 50S 결합과 비교한다.');
f('261109_03','target','macrolide',[9],'Macrolide·clindamycin·linezolid → 결합 부위',null,'50S ribosome','target','이 약제들은 강의에서 50S 단백합성 억제제로 분류한다.');
f('261109_03','target','colistin',[8],'Colistin → 주요 작용 부위',null,'세포막','target','Colistin·polymyxin의 세포막 작용을 β-lactam의 세포벽 작용과 구분한다.');
f('261109_03','target','rifampicin',[10],'Rifampicin → 직접 표적',null,'RNA polymerase','nucleic','Rifamycin은 RNA polymerase, quinolone은 gyrase·topoisomerase를 표적으로 한다.');
f('261109_03','target','quinolone',[10],'Quinolone → 직접 표적',null,'DNA gyrase·topoisomerase','nucleic','Quinolone의 DNA 복제 표적을 rifampicin의 RNA 전사 표적과 비교한다.');
f('261109_03','target','tmp',[10],'Trimethoprim → 직접 표적',null,'Dihydrofolate reductase','nucleic','엽산 경로에서 trimethoprim은 DHFR, sulfonamide는 DHPS를 억제한다.');
f('261109_03','mechanism','mrsa',[18],'mecA–PBP2a → 내성 기전','S. aureus에서 mecA가 검출되고 PBP2a가 발현된다. β-lactam 내성의 직접 기전은?','표적 변화','resistance','PBP2a에 의한 약물 결합 감소는 약물 분해와 다르다.',[34]);
f('261109_03','mechanism','vre',[18],'Van 유전자–전구체 변화 → 내성 기전',null,'표적 변화','resistance','VRE는 vancomycin이 결합할 세포벽 전구체의 변화와 연결한다.');
f('261109_03','mechanism','lactamase',[20,21],'β-lactamase → 내성 기전',null,'약물 분해·불활성화','resistance','β-lactamase는 약물 고리를 가수분해하므로 표적 PBP 변화와 구분한다.');
f('261109_03','mechanism','porin',[17],'Porin 감소 → 내성 기전',null,'유입 감소','resistance','Porin 감소는 약물의 세포 내 유입을 줄인다.');
f('261109_03','mechanism','efflux',[23],'Efflux 활성 증가 → 내성 기전',null,'유출 증가','resistance','Efflux는 들어온 약물의 유출 증가이며 porin의 유입 감소와 방향이 다르다.');

part('261109_05','selection','MSSA·MRSA와 감염 부위','Nafcillin·cefazolin·vancomycin을 균의 감수성·CSF 이행과 비교합니다.','같은 감수성 표에 뇌농양/일반 균혈증 조건을 바꿔 약제를 고릅니다.','Anki 증례처럼 감수성 양성만으로 정답이 결정되지 않는 문제를 대비합니다.');
part('261109_05','gramnegative','ESBL·KPC·새 치료제','ESBL·AmpC·KPC·NDM과 약제 조합의 범위를 비교합니다.','효소 이름을 먼저 확인하고 억제제와 계열을 한 단계씩 연결합니다.','비슷한 β-lactam/억제제 복합제 사이의 결정적 차이를 외웁니다.');
part('261109_05','vre','VRE·linezolid','VRE의 균명과 linezolid의 표적·경구 전환·혈소판 이상을 묶습니다.','균→약제→특징 세 칸을 번갈아 가리고 회상합니다.','균종과 내성 약제, 치료 약제 이름을 바꿔 낸 선지를 구분합니다.');
part('261109_05','control','전파 차단·적정 사용','접촉·비말·공기주의와 stewardship의 목적을 구분합니다.','전파 경로와 보호구를 대응시키고 약물 사용 관리와 나눠 외웁니다.','내성균 검출·집락·감염을 혼동하거나 전파 예방을 약제 변경으로 대체하지 않습니다.');
f('261109_05','selection','mssa-cns',[92],'감수성 MSSA 중추신경 감염에서 강의 표의 CSF 이행 비교 약제는?','MSSA 균혈증에 뇌농양이 동반됐다. Nafcillin·cefazolin·vancomycin 감수성이다. 강의의 살균력·CSF 이행 비교에서 우선 선택한 약제는?','Nafcillin','amrDrugs','강의 표는 MSSA에서 nafcillin의 살균력과 CSF 이행을 cefazolin·vancomycin과 비교한다.',[34]);
f('261109_05','selection','mrsa',[7,92],'MRSA 감수성이 확인되었을 때 대표 glycopeptide는?',null,'Vancomycin','amrDrugs','MRSA와 MSSA의 약제 선택을 분리하고 감염 부위와 감수성을 함께 본다.');
f('261109_05','selection','host-risk',[45],'반복 입원·광범위 항생제·과거 MDRO 집락 → 어떤 위험?','최근 입원과 광범위 항생제 사용이 반복된 환자다. 과거 CRE 집락 기록이 현재 경험적 치료에 주는 정보는?', '내성균 감염 위험 증가',[
 ['내성균 감염 위험 증가','과거 집락·항생제·의료노출은 위험인자.'],['침습성 감염 확정','집락만으로 현재 감염을 확정하지 않는다.'],['항균제 감수성 확정','과거 집락은 현재 감수성 결과가 아니다.'],['현재 균혈증 확정','혈액 분리 등 별도 근거가 필요.'],['해부학적 감염 부위 확정','위험인자만으로 부위가 정해지지 않는다.']],
 '과거 집락은 위험도 정보이며 현재의 감염·감수성·부위를 확정하는 검사는 아니다.');
f('261109_05','gramnegative','esbl-severe',[50,51],'중증 ESBL 감염 → 강의에서 선택하는 carbapenem',null,'Meropenem','amrDrugs','중증 ESBL 감염은 meropenem 등 carbapenem과 연결한다. 실제 선택은 감수성과 감염 부위를 함께 본다.');
f('261109_05','gramnegative','kpc',[53,58,59],'KPC 생성 CRE → 활성 복합제','혈액에서 KPC 생성 K. pneumoniae가 분리되었고 해당 복합제 감수성이 확인됐다. 강의에서 KPC 억제와 연결한 조합은?','Ceftazidime/avibactam','newDrugs','Avibactam의 KPC 억제와 NDM 등 class B의 비억제를 구분한다.',[35]);
f('261109_05','gramnegative','siderophore',[61],'철 운반계를 이용하는 cephalosporin은?',null,'Cefiderocol','newDrugs','Cefiderocol의 siderophore 성질은 철 운반계를 이용한 유입과 연결된다.');
f('261109_05','gramnegative','ertapenem',[51],'Pseudomonas 항균력이 부족한 carbapenem은?',null,'Ertapenem','newDrugs','강의에서 ertapenem은 Pseudomonas·Acinetobacter에 효과가 부족한 약제로 구분한다.');
f('261109_05','gramnegative','ndm',[59],'Avibactam이 억제하지 않는 대표 효소군은?',null,'Class B · NDM',[
 ['Class B · NDM','Metallo-β-lactamase, avibactam 비억제.'],['Class A · KPC','Avibactam이 억제하는 대표 효소.'],['Class C · AmpC','Avibactam 억제 범위와 연결.'],['Class A · ESBL','Avibactam 억제 범위와 연결.'],['일부 Class D','강의의 억제 범위와 연결.']],
 'NDM 등 class B와 KPC 등 serine β-lactamase를 구분한다.');
f('261109_05','vre','linezolid',[64,65],'VRE 감수성이 확인된 경구 생체이용률 높은 약제는?','E. faecium 균혈증에서 vancomycin 내성·linezolid 감수성이 확인됐다. 강의에서 높은 경구 흡수와 연결한 약제는?','Linezolid','amrDrugs','Linezolid는 VRE 치료와 높은 경구 생체이용률을 함께 연결한다.');
f('261109_05','vre','adverse',[65],'Linezolid → 주의할 혈액 이상',null,'혈소판 감소',[
 ['혈소판 감소','Linezolid의 대표 모니터링 이상.'],['저칼륨혈증','다른 약제의 전해질 이상과 비교.'],['고칼륨혈증','TMP 계열 등과 비교할 약물 이상.'],['크레아티닌 상승','다른 신독성 약제와 비교.'],['QT 연장','Macrolide·quinolone 등과 비교.']],
 'Linezolid는 혈소판 감소를 포함한 혈액 이상을 확인한다.');
f('261109_05','control','vre-contact',[79,80,86],'VRE 환자 진료 → 추가 전파 차단 주의',null,'접촉주의','isolation','내성균의 흔한 전파는 의료진 손·환경을 통한 접촉이다.');
f('261109_05','control','airborne',[80],'결핵·홍역·수두 → 전파 경로별 주의',null,'공기주의','isolation','세 질환을 공기주의 묶음으로 회상하고 비말주의와 구분한다.');
f('261109_05','control','droplet',[80],'인플루엔자·백일해 → 강의 표의 주의',null,'비말주의','isolation','강의 표의 비말주의 대표 질환이다.');
f('261109_05','control','stewardship',[74,89],'약제·용량·기간·경로의 적정 사용 관리는?',null,'항생제 스튜어드십','isolation','Stewardship과 감염관리는 내성 대응의 서로 보완적인 두 축이다.');

part('261102_03','ehec','EHEC·HUS와 stx','혈변·미세혈관병 용혈·혈소판 감소·신손상과 검사 표적을 연결합니다.','증후군을 먼저 정하고 stx·mecA·vanA 등 비슷한 유전자를 구분합니다.','배양의 색 반응만으로 EHEC를 배제하는 오류를 피합니다.');
part('261102_03','quality','객담의 질·Gram 판독','편평상피세포·백혈구·균의 형태를 따로 읽습니다.','구강 오염 지표와 염증 지표를 서로 바꾼 조합을 반복합니다.','객담에서 균이 보인다는 사실과 원인균이라는 판단을 구분합니다.');
part('261102_03','specimen','검체·검사 원리','중간뇨·BAL·코인두 검체와 항원·항체·핵산 검출을 대응합니다.','감염 부위→검체→검출 대상 순서로 세 칸을 채웁니다.','시기와 부위가 맞지 않는 검체나 항체검사 선택지를 걸러냅니다.');
f('261102_03','ehec','stx',[9,11,15],'EHEC 분자진단 → 표적 유전자','혈변 후 혈소판 감소·용혈빈혈·급성 신손상이 생긴 소아다. 원인 E. coli의 독소 유전자를 검출하려 한다. 표적은?','stx','gene','HUS–EHEC–Shiga toxin–stx를 연결한다.',[5,6]);
f('261102_03','ehec','sorbitol',[14,15],'전형적 E. coli O157 → sorbitol 반응',null,'Sorbitol 비발효',[
 ['Sorbitol 비발효','전형적인 O157 성상.'],['Sorbitol 발효','비전형 균주가 있어 전체 EHEC의 배제 기준으로 쓰지 않는다.'],['Oxidase 양성','장내세균의 대표 성상과 다름.'],['Urease 양성','E. coli O157의 대표 감별 성상이 아님.'],['H₂S 양성','대표 Salmonella·Proteus와 구분.']],
 '전형적 O157은 sorbitol 비발효이나 non-O157·예외 균주 때문에 stx 검사가 중요하다.');
f('261102_03','ehec','pcr-first',[11,15],'균 수가 적거나 non-O157을 의심할 때 독소 표적 확인법은?',null,'병원체 PCR','test','균 수·혈청형·sorbitol 발효 예외 때문에 배양 성상과 독소 유전자 검출을 구분한다.');
f('261102_03','quality','gram',[20,21,26],'객담에서 Gram 성질·모양을 빠르게 확인하는 검사는?',null,'Gram 염색','test','Gram 염색은 균 형태와 염증세포를 함께 볼 수 있으나 감수성을 확정하는 검사는 아니다.');
const sputum=[['상피세포 적음 · WBC 많음','하기도 염증성 검체를 지지.'],['상피세포 많음 · WBC 적음','구강·침 오염을 시사.'],['상피세포 많음 · WBC 없음','구강 오염을 시사.'],['상피세포 적음 · WBC 없음','대표적인 양질 염증성 객담 조합과 다름.'],['편평상피세포 우세','구강 오염 지표를 염증 지표와 혼동한 보기.']];
f('261102_03','quality','sputum-good',[23,24,25,27],'염증성 하기도 객담을 지지하는 세포 조합은?','폐렴 환자의 검체가 진짜 객담인지 침인지 평가한다. 적절한 객담을 지지하는 대표 조합은?','상피세포 적음 · WBC 많음',sputum,'편평상피세포는 구강 오염, WBC는 염증 지표로 해석한다.',[5,6]);
f('261102_03','quality','saliva',[23,24],'침·구강 오염을 시사하는 대표 조합은?',null,'상피세포 많음 · WBC 적음',sputum,'편평상피세포가 많고 WBC가 적은 검체는 질이 낮아 재채취를 고려한다.');
f('261102_03','quality','ast',[20,26],'균의 모양 관찰 뒤 약물 감수성을 확인하는 검사는?',null,'배양·감수성검사','test','그람양성 쌍알균의 형태를 보고 항생제 감수성까지 확정하지 않는다.');
f('261102_03','specimen','midstream',[29,31,32],'요도·피부 오염을 줄이는 요배양 검체는?',null,'청결 중간뇨','sample','중간뇨는 채취 과정의 상재균 오염을 줄이기 위해 사용한다.');
f('261102_03','specimen','bal',[33,39,43,59],'기관지폐포세척으로 얻는 하기도 검체는?',null,'BAL','sample','BAL은 하기도 검체이며 코인두 면봉·객담과 검체 성격이 다르다.');
f('261102_03','specimen','resp-virus',[49,50,52],'급성 호흡기 바이러스 검출의 대표 상기도 검체는?',null,'코인두 면봉','sample','코인두 검체와 하기도 BAL을 서로 바꾸지 않는다.');
f('261102_03','specimen','antigen',[34,35,52],'면역크로마토그래피의 병원체 성분 검출법은?',null,'항원검사','test','항원검사는 병원체 성분, 항체검사는 숙주의 면역반응을 측정한다.');
f('261102_03','specimen','antibody',[52],'감염에 대한 숙주 면역반응을 혈청에서 측정하는 검사는?',null,'숙주 항체검사','test','급성 감염에서 항체 형성 전 시기에는 해석에 제한이 있다.');

part('261102_05','reasoning','진단의 세 축·감염원 조절','해부학적 부위·병원체·숙주 및 농양·이물 제거의 의미를 외웁니다.','감염 부위를 먼저 찾고 약제 선택과 배액 필요성을 별도로 판단합니다.','감수성 약제를 써도 호전되지 않는 증례에서 다음 평가를 결정합니다.');
part('261102_05','strategy','경험적→표적 치료·전환','원인균 확정 전후의 약제 선택과 정주·경구 전환 조건을 구분합니다.','배양 전/후, 구토 유무, 감염원 조절 유무만 바꿔 답을 비교합니다.','약 이름만 맞추는 대신 치료 단계를 묻는 증례를 대비합니다.');
f('261102_05','reasoning','anatomic',[5,12],'원발·전이 감염 부위 및 배액 필요성 → 진단 축',null,'해부학적 진단','diagnosis','해부학적 진단은 감염원 조절·조직 농도·치료 기간 결정과 연결된다.');
f('261102_05','reasoning','microbio',[5,18],'원인균과 감수성 확인 → 진단 축',null,'미생물학적 진단','diagnosis','균이 검출되었다는 사실과 현재 감염의 원인이라는 판단은 구분한다.');
f('261102_05','reasoning','host',[5,42,43],'임신·면역·신기능 → 약제 선택의 축',null,'숙주 인자','diagnosis','동일 균·부위라도 임신과 장기 기능에 따라 약제의 적합성이 달라진다.');
f('261102_05','reasoning','drainage',[8,12,46],'농양 배액·감염 이물 제거 → 치료 원칙','적절한 항균제에 감수성인 균이 확인됐지만 큰 농양이 남아 발열이 지속된다. 배액술의 치료 원칙은?','감염원 조절','management','감염원 조절은 약제 교체와 다른 치료 축이다.');
f('261102_05','strategy','empiric',[5,11,18],'원인균 확정 전 부위·숙주·역학에 따라 시작하는 치료는?',null,'경험적 치료','management','중증 감염에서는 적절한 검체를 확보하면서 원인균 결과 전 치료를 시작할 수 있다.');
f('261102_05','strategy','targeted',[18,39],'균 동정·감수성 결과를 반영해 좁히는 치료는?',null,'표적 치료','management','가능한 좁은 항균 범위의 효과적 약제로 조정한다.');
f('261102_05','strategy','oral-switch',[38,40,41],'호전·경구 섭취 가능·높은 생체이용률 → 치료 전환',null,'정주→경구 전환','management','먹는 약의 전신 노출과 환자의 흡수 상태를 함께 판단한다.');
f('261102_05','reasoning','concentration',[26,27],'혈중 감수성과 별개로 감염부위 농도를 평가하는 것은?',null,'약물동태 평가','diagnosis','BBB·혈관 분포·세포 내 위치에 따라 감염 부위 도달 농도가 달라진다.');
f('261102_05','strategy','response',[44,45,46],'증상·체온·진찰·염증수치의 호전 → 평가 축',null,'치료반응 평가','diagnosis','치료 반응은 발열 한 항목만이 아니라 임상·검사 경과를 함께 본다.');

pool('pedsbugs',[['S. agalactiae','신생아 패혈증·수막염, 그람양성 사슬알균.'],['E. coli','신생아 패혈증·수막염, 그람음성 막대균.'],['RSV','영아 세기관지염·천명.'],['B. pertussis','어린 영아에서 whoop 없이 무호흡·청색증 가능.'],['M. pneumoniae','학령기 소아의 폐렴과 연결.']]);
pool('exanthem',[['B19','뺨 홍반·그물 모양 발진, 적혈구 전구세포 표적.'],['HHV-6B','고열이 내릴 무렵 몸통 발진, 돌발발진.'],['Measles','기침·콧물·결막염·Koplik 반점 후 발진.'],['Rubella','귀뒤 림프절·발진, 선천 감염의 백내장·난청·심장기형.'],['VZV','수두의 다양한 단계 수포 또는 대상포진의 피부분절 병변.']]);
part('261113_02','young','신생아·어린 영아','GBS·E. coli·SBI·요로감염과 영아의 비전형 백일해를 묶습니다.','연령·Gram 모양·무호흡 여부 세 단서를 바꿔 원인체를 고릅니다.','열 이외 국소 증상이 없어도 신생아의 중증 세균감염을 고려합니다.');
part('261113_02','respiratory','연령별 호흡기 감별','영아 RSV·학령기 Mycoplasma·GAS와 바이러스 인두염 단서를 비교합니다.','연령과 호흡음·인두·결막 소견을 짝지어 외웁니다.','소아 폐렴·세기관지염·인두염에서 비슷한 원인체 선지를 구분합니다.');
part('261113_02','rash','발진의 모양·시간 순서','수포·점상출혈·해열 후 발진을 나누어 회상합니다.','발열이 지속되는지 먼저 묻고 발진의 시작 위치와 모양을 붙입니다.','양성 바이러스 발진과 전신 상태가 나쁜 응급 감염을 섞지 않습니다.');
f('261113_02','young','gbs',[12,14,36],'신생아 수막염 + 그람양성 사슬알균 → 원인균','생후 2주 신생아가 열과 처짐을 보인다. 혈액·CSF에서 그람양성 사슬알균이 확인되었다. 원인균은?','S. agalactiae','pedsbugs','신생아라는 연령과 사슬알균 형태를 결합해 GBS를 고른다.',[49,50]);
f('261113_02','young','ecoli',[12,14],'신생아 수막염 + 그람음성 막대균 → 원인균',null,'E. coli','pedsbugs','GBS와 E. coli의 Gram·모양을 바꾸어 낸 신생아 증례를 구분한다.',[50,51]);
f('261113_02','young','pertussis',[20,21],'어린 영아의 발작 후 무호흡·청색증, whoop 미약 → 원인균','생후 7주 영아가 기침 후 청색증과 무호흡을 보이지만 whoop는 없다. 보호자도 수주간 기침 중이다. 원인은?','B. pertussis','pedsbugs','어린 영아는 전형적인 백일해 단계와 whoop가 뚜렷하지 않을 수 있다.');
f('261113_02','young','uti',[6,12,23],'발열 영아의 SBI 중 비중이 큰 감염 부위는?',null,'요로감염',[
 ['요로감염','발열 영아에서 중요한 SBI.'],['균혈증','가능한 SBI이나 강의의 가장 큰 비중은 UTI.'],['세균성 수막염','위험도가 높지만 가장 흔한 SBI와 구분.'],['화농성 관절염','국소 관절 증상을 함께 평가.'],['골수염','국소 골 통증·운동 제한 등으로 평가.']],
 '젊은 영아의 SBI 평가에서 요로감염이 큰 비중을 차지한다.');
f('261113_02','respiratory','rsv',[17],'영아의 천명·세기관지염 → 대표 원인체','생후 5개월 영아가 콧물 뒤 빈호흡과 호기성 천명을 보인다. 세기관지염의 대표 원인체는?','RSV','pedsbugs','영아 RSV와 학령기 Mycoplasma 폐렴의 연령·임상 단서를 구분한다.',[49,50]);
f('261113_02','respiratory','mycoplasma',[34,35],'학령기 소아 폐렴 → 강의의 대표 비정형균',null,'M. pneumoniae','pedsbugs','Mycoplasma 하기도 질환은 어린 영아보다 학령기에 중요하다.');
f('261113_02','respiratory','viral-pharyngitis',[38,39],'인두염에서 바이러스성을 지지하는 동반 소견은?',null,'기침·콧물·결막염',[
 ['기침·콧물·결막염','바이러스 인두염을 지지.'],['압통성 앞목 림프절','GAS의 대표 소견.'],['구개 점상출혈','GAS에서 고려하는 소견.'],['성홍열양 발진','GAS 발열외독소와 연결.'],['갑작스러운 삼출성 인두통','GAS와 연관되지만 원인 확정에는 별도 평가 필요.']],
 '기침·콧물·결막염은 GAS보다 바이러스 원인을 지지한다.',[49]);
f('261113_02','rash','roseola',[31,32],'고열이 내리며 몸통 발진 → 다른 강의와 함께 감별할 바이러스',null,'HHV-6B','exanthem','돌발발진의 해열 후 발진을 B19의 뺨 홍반과 구분한다.');
f('261113_02','rash','varicella',[32],'얼굴·두피 포함, 여러 단계 수포가 혼재 → 원인체',null,'VZV','exanthem','수두의 병변 분포와 단계 혼재를 손·발·입에 집중되는 수족구병과 구분한다.');
f('261113_02','rash','purpura',[32],'고열·독성 외양·급속한 자반 → 우선 고려할 원인균',null,'N. meningitidis',[
 ['N. meningitidis','수막염균혈증·DIC·쇼크.'],['Parvovirus B19','뺨 홍반·그물 발진.'],['HHV-6B','해열 후 발진.'],['Coxsackievirus A','수족구·포진성구협염.'],['M. pneumoniae','폐렴·일부 다형홍반과 연결.']],
 '전신 상태가 나쁜 고열·급속 자반을 단순 바이러스 발진으로 해석하지 않는다.');

pool('dnaViruses',[['Adenovirus','비외피 선형 dsDNA, 핵 내 복제·봉입체.'],['Parvovirus B19','비외피 선형 ssDNA, 적혈구 전구세포 표적.'],['Herpesvirus','외피 선형 dsDNA, 핵 내 복제와 잠복.'],['Poxvirus','큰 dsDNA 바이러스, 세포질 복제·봉입체.'],['HBV','외피·부분 이중가닥 DNA, 역전사와 cccDNA.']]);
pool('genome',[['비외피 · ssDNA','Parvovirus의 대표 구조.'],['비외피 · dsDNA','Adenovirus의 대표 구조.'],['외피 · 선형 dsDNA','Herpesvirus의 대표 구조.'],['외피 · (-)ssRNA','Orthomyxo·paramyxo 계열의 대표 구조.'],['비외피 · (+)ssRNA','Picornavirus의 대표 구조.']]);
pool('compartment',[['핵','Adenovirus·herpesvirus의 DNA 복제·조립 장소.'],['세포질','Poxvirus의 DNA 복제 및 대다수 RNA 바이러스의 복제 장소.'],['세포막','일부 바이러스의 조립·방출과 연결되며 핵 내 복제와 구별.'],['골지체','일부 단백질 처리·막 이동 경로.'],['미토콘드리아','강의의 대표 바이러스 유전체 복제 장소와 다름.']]);
pool('cpe',[['Adenovirus','핵 내 호염기성 봉입체, smudge 양상.'],['HSV','다핵화·핵 molding·핵 내 봉입체.'],['CMV','거대세포·owl’s-eye 핵 내 봉입체.'],['Poxvirus','세포질 봉입체, Guarnieri·molluscum body.'],['HPV','Koilocytosis와 연결.']]);
pool('adenoProteins',[['Fiber','세포 수용체 결합.'],['Penton base','Integrin 상호작용·내재화.'],['Hexon','캡시드 주요 면 구성 성분·항원 표적.'],['Terminal protein','유전체 5′ 말단에 결합.'],['DNA polymerase','바이러스 DNA 복제 효소.']]);
pool('poxSkin',[['Variola','역사적으로 박멸된 두창.'],['Mpox','림프절종대·깊은 피부/점막 병변 등, 병변 PCR.'],['Molluscum contagiosum','중앙 함몰 구진·세포질 molluscum body.'],['Orf','양·염소 접촉 뒤 손의 국소 결절.'],['VZV','다양한 단계 수두 병변·신경절 잠복.']]);
part('261110_02','structure','Adeno↔Pox 구조·봉입체','비외피 dsDNA·핵 내 봉입체와 큰 DNA 바이러스의 세포질 봉입체를 비교합니다.','Adeno/Pox 이름을 가리고 복제 장소·봉입체 위치만 서로 바꿉니다.','DNA 바이러스의 복제 장소 예외와 조직 사진 감별을 함께 외웁니다.');
part('261110_02','adeno','아데노의 구조·임상형','Fiber·penton·hexon 및 인두결막열·각결막염·40/41형 장염을 연결합니다.','구조 단백질의 역할과 임상형의 장기를 서로 다른 표로 회상합니다.','같은 adenovirus라도 노출·연령·침범 장기에 따라 달라지는 문항을 대비합니다.');
part('261110_02','pox','두창·엠폭스·물렁종·Orf','박멸된 두창과 현재 피부병변 감별 및 진단 검체를 나눕니다.','접촉력·중앙 함몰·림프절·병변 분포를 단서 하나씩 교체합니다.','비슷한 수포·구진 증례에서 원인체와 확인 검체를 고릅니다.');
f('261110_02','structure','adeno-genome',[5,6],'Adenovirus → 외피·유전체 조합',null,'비외피 · dsDNA','genome','Adenovirus는 비외피 선형 dsDNA 바이러스이다.');
f('261110_02','structure','adeno-location',[6,10],'Adenovirus DNA 복제·조립 → 장소',null,'핵','compartment','Adenovirus의 핵 내 복제를 poxvirus의 세포질 복제와 비교한다.');
f('261110_02','structure','pox-location',[25,37],'Poxvirus DNA 복제·전사 → 주요 장소',null,'세포질','compartment','Poxvirus는 DNA 바이러스 가운데 대표적인 세포질 복제 예외이다.');
f('261110_02','structure','inclusion',[10,25,37],'세포질 Guarnieri body → 바이러스군',null,'Poxvirus','cpe','Adenovirus는 핵 내 봉입체, poxvirus는 세포질 봉입체이다.');
f('261110_02','adeno','fiber',[6,7],'Adenovirus 수용체 결합 → 구조 단백질',null,'Fiber','adenoProteins','Fiber의 수용체 결합과 penton base의 integrin 상호작용을 구분한다.');
f('261110_02','adeno','penton',[6,7],'Adenovirus integrin 상호작용·내재화 → 구조',null,'Penton base','adenoProteins','Penton base는 꼭짓점 구조로 세포 내재화와 연결된다.');
f('261110_02','adeno','hexon',[6],'Adenovirus 캡시드의 주요 면·항원 → 구조',null,'Hexon','adenoProteins','Hexon·penton·fiber의 이름과 위치·기능을 대응시킨다.');
f('261110_02','adeno','pcf',[3,14],'수영장 노출 + 인두염·결막염·발열 → 원인체','캠프의 수영장 이용 뒤 여러 학생에게 발열·인두통·결막염이 생겼다. 대표 원인체는?','Adenovirus','cpe','수영장 공통 노출과 인두결막열을 연결한다.',[48,49]);
f('261110_02','adeno','enteric',[4,16],'장관형 adenovirus → 대표 형 조합',null,'40·41형',[
 ['40·41형','영유아 장염과 연결.'],['4·7형','군용 호흡기 백신과 연결.'],['6·11형','HPV 저위험형과 혼동하지 않는다.'],['16·18형','고위험 HPV 형과 구분.'],['1·2형','HSV 유형 이름과 구분.']],
 '장관형 40·41과 군용 호흡기 백신 4·7을 바꾸지 않는다.');
f('261110_02','adeno','ekc',[13,15],'유행성각결막염 + 안과기구 공통 노출 → 원인체',null,'Adenovirus','cpe','안과기구·손·수건 접촉과 adenovirus 각결막염을 연결한다.');
f('261110_02','pox','eradication',[24,30,37],'박멸된 두창의 원인체는?',null,'Variola','poxSkin','Variola와 mpox·vaccinia를 같은 바이러스로 혼동하지 않는다.',[48]);
f('261110_02','pox','molluscum',[35],'중앙 함몰 구진 + 세포질 봉입체 → 진단','소아의 진주빛 구진 중앙이 함몰되어 있다. 표피 세포질에 큰 봉입체가 보인다. 원인은?','Molluscum contagiosum','poxSkin','물렁종의 중앙 함몰 구진과 세포질 molluscum body를 연결한다.');
f('261110_02','pox','orf',[35],'양·염소 접촉 뒤 손의 국소 결절 → 원인체',null,'Orf','poxSkin','Orf의 동물 접촉력을 물렁종의 접촉·자가접종과 구분한다.');
f('261110_02','pox','mpox',[32],'림프절종대·피부/점막 병변과 연관된 poxvirus 감염은?',null,'Mpox','poxSkin','노출력과 병변 분포를 함께 평가하며 피부병변 PCR로 확인한다.');
f('261110_02','pox','specimen',[32],'Mpox 확진을 위한 대표 PCR 검체는?',null,'피부병변 검체',[
 ['피부병변 검체','병변 면봉·삼출물·가피 등에서 PCR.'],['혈청 항체','급성 병변 확인용 우선 검체와 다름.'],['청결 중간뇨','요로감염 검사 검체.'],['객담','하기도 검사 검체.'],['대변','장염 검사 검체.']],
 'Mpox 의심 병변에서는 피부병변 검체 PCR을 연결한다.',[49]);

part('261111_01','identity','Parvo의 구조·B19 표적','비외피 ssDNA와 적혈구 전구세포 감염을 한 쌍으로 외웁니다.','성숙 적혈구와 분열 중인 전구세포를 바꿔 제시하면 구분합니다.','작은 DNA 바이러스의 예외와 빈혈 발생 기전을 연결합니다.');
part('261111_01','clinical','제5병↔돌발발진·위험군','뺨 홍반·적혈구 생성 억제·태아수종·면역저하 빈혈을 연결합니다.','건강 소아·용혈성 빈혈·임신·면역저하 조건을 번갈아 붙입니다.','같은 B19라도 숙주에 따라 달라지는 임상 결과를 외웁니다.');
f('261111_01','identity','genome',[4,13],'Parvovirus B19 → 외피·유전체',null,'비외피 · ssDNA','genome','B19는 비외피 선형 단일가닥 DNA 바이러스이다.',[42,43]);
f('261111_01','identity','precursor',[11,13],'B19의 대표 표적세포는?',null,'적혈구 전구세포',[
 ['적혈구 전구세포','분열 중인 골수 erythroid precursor.'],['성숙 적혈구','핵이 없는 성숙 적혈구와 구분.'],['B 림프구','EBV의 대표 표적.'],['T 림프구','HHV-6B·7의 대표 표적.'],['혈관내피세포','다른 감염의 혈관염 표적과 구분.']],
 'B19는 성숙 적혈구가 아니라 적혈구 전구세포를 감염시켜 적혈구 생성을 억제한다.',[42,43]);
f('261111_01','identity','aav',[4,5],'Dependoparvovirus의 대표 바이러스 이름은?',null,'AAV',[
 ['AAV','Adeno-associated virus, 보조 바이러스 의존성과 연결.'],['B19','전염성 홍반·적혈구 전구세포 표적.'],['Adenovirus','별개의 비외피 dsDNA 바이러스.'],['Papillomavirus','HPV, 상피 감염 바이러스.'],['Polyomavirus','BK·JC 등이 속하는 DNA 바이러스군.']],
 'Adeno-associated virus와 adenovirus 자체를 구별한다.',[42]);
f('261111_01','clinical','fifth',[11,12,13],'뺨을 맞은 듯한 홍반·그물 발진 → 원인체','감기 같은 전구 증상 뒤 양쪽 뺨이 붉어지고 팔다리에 그물 모양 발진이 생긴 소아다. 원인은?','B19','exanthem','제5병은 전염성 홍반 B19이며 해열 후 돌발발진과 다르다.',[42]);
f('261111_01','clinical','roseola',[12,13],'해열 무렵 몸통 발진 → B19와 감별할 원인체',null,'HHV-6B','exanthem','돌발발진은 주로 HHV-6B이고 제5병 B19와 구분한다.',[42]);
const b19risks=[['일과성 무형성 위기','만성 용혈성 빈혈에서 적혈구 생성 억제가 임상적으로 크게 나타남.'],['태아 빈혈·수종','임신 중 태반 감염의 중요한 결과.'],['만성 빈혈','면역저하 환자에서 지속 감염과 연결.'],['전염성 홍반','건강한 소아의 대표 임상형.'],['돌발발진','HHV-6B와 연결되는 별개의 발진 질환.']];
f('261111_01','clinical','aplastic',[13],'용혈성 빈혈 환자의 B19 감염 → 주요 합병증',null,'일과성 무형성 위기',b19risks,'기저 적혈구 수명이 짧은 환자에서는 일시적인 생성 억제도 심한 빈혈을 유발한다.');
f('261111_01','clinical','fetal',[11,13],'임신 중 B19 감염 → 태아 위험',null,'태아 빈혈·수종',b19risks,'태반 전파가 가능하며 태아의 적혈구 생성 억제로 빈혈·수종이 생길 수 있다.');
f('261111_01','clinical','immunodeficient',[13],'면역저하자의 지속 B19 감염 → 결과',null,'만성 빈혈',b19risks,'건강 소아의 발진과 면역저하자의 지속 빈혈을 숙주별로 구분한다.');

pool('herpes',[['HSV-1','구순포진·각막염·뇌염, 감각신경절 잠복.'],['VZV','수두·대상포진, 감각신경절 잠복.'],['EBV','B세포 잠복·단핵구증·관련 종양.'],['CMV','골수계 전구세포·단핵구 잠복, 선천 감염·기회감염.'],['HHV-6B','돌발발진, 주로 T세포 계열.']]);
pool('latency',[['감각신경절','HSV·VZV 잠복.'],['기억 B세포','EBV 잠복.'],['골수계 전구세포·단핵구','CMV 잠복.'],['T세포 계열','HHV-6·7의 주요 표적·잠복과 연관.'],['적혈구 전구세포','B19의 증식 표적으로 신경절 잠복과 구별.']]);
pool('herpesDrugs',[['Acyclovir','HSV TK에 의한 첫 인산화 뒤 DNA polymerase 억제·사슬종결.'],['Ganciclovir','CMV 장기 질환 등에서 사용.'],['Valacyclovir','Acyclovir 전구약물, 경구 노출 개선.'],['Famciclovir','Penciclovir의 전구약물.'],['Oseltamivir','Influenza neuraminidase 억제제.']]);
part('261113_01','family','분류·잠복 부위·발현 단계','α/β/γ 아과와 신경절·B세포·골수계 잠복을 구분합니다.','바이러스→잠복 부위와 아과→바이러스를 서로 반대 방향으로 외웁니다.','아과 α/β/γ와 유전자 발현 단계 α/β/γ가 다른 분류임을 기억합니다.');
part('261113_01','hsvvzv','HSV↔VZV·약제','군집 수포·피부분절·수두 병변과 acyclovir 표적을 연결합니다.','같은 수포 증례에서 분포·재활성화 여부·PCR 검체를 바꿔 판단합니다.','Tzanck만으로 HSV와 VZV를 구분하거나 잠복 제거로 오해하지 않습니다.');
part('261113_01','ebv','EBV 세포·항체 조합','감염 B세포와 반응성 CD8 T세포, VCA·EBNA를 나눕니다.','감염 표적과 늘어난 세포를 구분한 뒤 급성/과거 항체 조합을 채웁니다.','단핵구증 증례와 항체 표의 대상 바꿔치기 선지를 대비합니다.');
part('261113_01','cmvhhv','CMV·HHV-6B·HHV-8','선천 CMV·면역저하 장기 질환·돌발발진·카포시육종을 연결합니다.','연령·면역 상태·대표 장기와 검사 시점을 먼저 떠올립니다.','PCR 양성 자체와 장기 질환을 혼동하지 않고 소아 발진을 감별합니다.');
f('261113_01','family','genome',[4],'Herpesvirus → 외피·유전체',null,'외피 · 선형 dsDNA','genome','헤르페스바이러스는 외피·선형 dsDNA이며 핵에서 복제한다.');
f('261113_01','family','hsv-latent',[3,6],'HSV·VZV → 대표 잠복 부위',null,'감각신경절','latency','HSV·VZV의 신경절 잠복과 EBV의 B세포 잠복을 비교한다.');
f('261113_01','family','ebv-latent',[3,17],'EBV → 대표 잠복 세포',null,'기억 B세포','latency','EBV 감염 표적 B세포와 말초혈액의 반응성 CD8 T세포는 다르다.');
f('261113_01','family','cmv-latent',[3,19],'CMV → 대표 잠복 세포',null,'골수계 전구세포·단핵구','latency','CMV의 골수계 잠복을 HHV-6B의 T세포와 구분한다.');
f('261113_01','family','early',[5],'Herpes DNA polymerase → 발현 단계',null,'초기 β',[
 ['초기 β','DNA 복제에 필요한 효소 합성.'],['즉시초기 α','전사 조절 단백질.'],['후기 γ','캡시드·외피 등 구조 단백질.'],['β 아과','CMV 등이 속하는 바이러스 아과로 발현 단계와 다름.'],['γ 아과','EBV 등이 속하는 아과로 발현 단계와 다름.']],
 '유전자 발현 단계의 초기 β와 바이러스 분류의 β 아과를 구분한다.');
f('261113_01','hsvvzv','hsv',[6,7],'반복 구순 군집 수포 → 대표 원인체','피곤할 때 같은 입술 부위에 통증성 군집 수포가 재발한다. 감각신경절 잠복과 연결되는 대표 원인은?','HSV-1','herpes','구순포진은 HSV-1이 흔하지만 바이러스 유형과 부위가 완전히 배타적인 것은 아니다.',[39,40]);
f('261113_01','hsvvzv','zoster',[11,13],'편측 피부분절 통증·수포 → 원인체','고령 환자에게 옆구리의 한쪽 피부분절을 따라 통증과 군집 수포가 나타났다. 원인은?','VZV','herpes','대상포진은 감각신경절에 잠복한 VZV의 재활성화이다.',[39,40]);
f('261113_01','hsvvzv','acyclovir',[9],'HSV TK 활성화 후 DNA 사슬종결 → 약물',null,'Acyclovir','herpesDrugs','Acyclovir는 바이러스 TK의 첫 인산화 후 활성화되어 DNA polymerase 억제·사슬종결을 일으킨다.');
f('261113_01','hsvvzv','valacyclovir',[10],'Acyclovir의 경구 노출 개선 전구약물은?',null,'Valacyclovir','herpesDrugs','Valacyclovir→acyclovir, famciclovir→penciclovir의 짝을 구분한다.');
f('261113_01','hsvvzv','tzanck',[8,24],'Tzanck 도말의 HSV/VZV 감별 한계는?',null,'두 바이러스 유형 감별 불가',[
 ['두 바이러스 유형 감별 불가','다핵세포 등 공통 CPE만으로 HSV/VZV를 구분하기 어렵다.'],['HSV-1과 HSV-2 유형 확정','유형별 NAAT와 혼동한 보기.'],['VZV 잠복 부위 확정','도말로 신경절 잠복을 확인하지 않는다.'],['바이러스 감수성 확정','세포 형태와 약물 감수성은 다른 검사.'],['혈중 바이러스량 정량','정량 핵산 검사와 구분.']],
 '형태학적 단서와 유형별 PCR의 역할을 구분한다.');
f('261113_01','ebv','mono',[16,17],'인두염·뒤목 림프절·비장비대 → 원인체','청소년이 발열·삼출성 인두염·뒤목 림프절종대·비장비대를 보인다. 단핵구증의 대표 원인은?','EBV','herpes','EBV 단핵구증은 감염 B세포에 대한 CD8 T세포 반응과 연결된다.',[39,40]);
f('261113_01','ebv','atypical-cell',[16],'단핵구증의 비정형 림프구 → 주된 세포',null,'반응성 CD8 T세포',[
 ['반응성 CD8 T세포','늘어난 비정형 림프구.'],['EBV 감염 B세포','감염 표적 세포와 관찰되는 반응성 세포를 구분.'],['CD4 T세포','비정형 림프구의 대표 계통과 다름.'],['형질세포','말초혈액 비정형 림프구의 대표 계통과 다름.'],['호중구','급성 화농성 반응의 대표 세포.']],
 'EBV의 감염 표적은 B세포, 비정형 림프구의 주 계통은 반응성 CD8 T세포이다.');
const ebvAb=[['VCA IgM + · EBNA −','급성 초감염의 전형.'],['VCA IgM − · EBNA +','과거 감염의 전형.'],['VCA IgM + · EBNA +','전형적 급성 초감염 조합과 달라 추가 해석 필요.'],['VCA IgM − · VCA IgG −','감염력 없는 상태 등과 구분.'],['VCA IgG − · EBNA +','전형적 과거 감염 조합과 다른 불일치 조합.']];
f('261113_01','ebv','acute-antibody',[18],'급성 EBV 초감염 → 전형 항체 조합',null,'VCA IgM + · EBNA −',ebvAb,'EBNA IgG는 급성기 뒤에 나타나므로 급성 초감염에서는 대개 음성이다.');
f('261113_01','ebv','past-antibody',[18],'VCA IgG 양성인 과거 EBV 감염 → 추가 조합',null,'VCA IgM − · EBNA +',ebvAb,'과거 감염에서는 VCA IgG·EBNA IgG가 남고 VCA IgM은 음성이다.');
f('261113_01','cmvhhv','congenital',[19,20],'선천 난청·소두증·점상출혈 → 원인체','신생아에게 감각신경성 난청·소두증·점상출혈이 있다. 선천 감염을 확인하려는 대표 바이러스는?','CMV','herpes','선천 CMV의 감각신경성 난청과 생후 초기 검체 진단을 연결한다.');
f('261113_01','cmvhhv','cmv-timing',[20],'선천 CMV 확인을 위해 타액·소변 검사를 마쳐야 하는 대표 기준 시점은?',null,'생후 21일 이내',[
 ['생후 21일 이내','타액·소변 PCR로 선천 감염 평가.'],['생후 7일이 기한','강의의 3주 기준보다 짧게 치환.'],['생후 14일이 기한','강의의 3주 기준보다 짧게 치환.'],['생후 28일까지','출생 후 감염 구분의 21일 기준을 뒤로 치환.'],['생후 42일까지','3주 이후 첫 양성은 선천/후천 구별에 제한.']],
 '생후 3주 이내 타액 또는 소변 PCR을 통해 선천 감염을 확인한다.');
f('261113_01','cmvhhv','cmv-drug',[21],'CMV 장기 질환 → 강의의 대표 항바이러스제',null,'Ganciclovir','herpesDrugs','CMV 장기 질환은 ganciclovir·valganciclovir와 연결하며 혈구·신기능을 평가한다.');
f('261113_01','cmvhhv','roseola',[22],'해열 무렵 몸통 발진 → 주요 원인체',null,'HHV-6B','herpes','돌발발진의 주 원인은 HHV-6B이며 일부 HHV-7도 가능하다.',[41,42]);
f('261113_01','cmvhhv','kaposi',[23],'카포시육종·원발삼출림프종 → 바이러스',null,'HHV-8',[
 ['HHV-8','KSHV, 카포시육종·원발삼출림프종.'],['HHV-6B','돌발발진의 대표 원인.'],['HHV-4','EBV, 단핵구증·일부 림프종.'],['HHV-5','CMV, 선천·기회감염.'],['HHV-3','VZV, 수두·대상포진.']],
 'HHV 번호와 질환을 서로 바꾼 선지를 비교한다.',[40,41]);

pool('enterovirus',[['Poliovirus','회색질척수염·이완성 마비.'],['Coxsackievirus A','포진성구협염·수족구병.'],['Coxsackievirus B','심근염·심낭염·흉막통.'],['Echovirus','무균성 수막염 등.'],['Enterovirus 70','급성 출혈성 결막염.']]);
pool('picornaProteins',[['VP1','캡시드 표면의 canyon·중화항체 표적과 연결.'],['VP4','캡시드 내부 단백질.'],['VPg','RNA 5′ 말단 결합 단백질.'],['Polyprotein','한 번역산물로 합성된 뒤 단백분해효소로 절단.'],['IRES','5′ UTR의 번역 개시 관련 RNA 구조.']]);
pool('rnaViruses',[['Rhinovirus','감기·산 불안정성, 비외피 (+)RNA.'],['Influenza virus','외피·분절 (-)RNA, 핵 내 전사.'],['RSV','영아 세기관지염·F 단백질, 비분절 (-)RNA.'],['Parainfluenza virus','크룹·개 짖는 기침.'],['Adenovirus','인두결막열·각결막염, 비외피 dsDNA.']]);
part('261111_02','structure','Picorna 구조·단백질','비외피 (+)RNA·polyprotein·VPg·VP1/VP4를 비교합니다.','캡시드 표면·내부·RNA 말단이라는 위치를 먼저 구분합니다.','서로 비슷한 VP 이름과 5′ cap/VPg의 바꿔치기를 구분합니다.');
part('261111_02','clinical','Enterovirus–질환 대응','Polio·Coxsackie A/B·Echo·EV70의 대표 질환을 연결합니다.','바이러스 이름→장기와 증례→바이러스 순서로 번갈아 회상합니다.','Coxsackie A의 구협염과 B의 심근염처럼 가까운 선지를 구분합니다.');
part('261111_02','poliorhino','Polio 백신·Rhinovirus','IPV/OPV와 rhinovirus의 산 불안정성·감기·재감염을 비교합니다.','백신의 생/사·경구/주사·장점/위험을 네 칸 표로 채웁니다.','비외피 바이러스의 공통 성질과 rhinovirus 예외를 분리합니다.');
f('261111_02','structure','genome',[4,5],'Picornavirus → 외피·유전체',null,'비외피 · (+)ssRNA','genome','Picornavirus는 비외피·단일 (+)가닥 RNA 바이러스이다.',[44]);
f('261111_02','structure','polyprotein',[8],'Picorna의 한 번역산물 후 절단 방식은?',null,'Polyprotein','picornaProteins','여러 단백질을 각각 별도 mRNA로 합성하는 방식과 구분한다.',[44]);
f('261111_02','structure','vpg',[5,14],'Picorna RNA 5′ 말단 결합 단백질은?',null,'VPg','picornaProteins','5′ 말단 VPg와 3′ poly(A), IRES를 구분한다.',[46]);
f('261111_02','structure','vp4',[7],'Picorna 캡시드 내부 단백질은?',null,'VP4','picornaProteins','VP4는 내부에 있고 VP1 등은 캡시드 표면을 이룬다.');
f('261111_02','structure','ires',[14],'Picorna 5′ UTR의 번역 개시 RNA 구조는?',null,'IRES','picornaProteins','IRES는 단백질이 아니라 번역 개시 관련 RNA 요소이다.');
f('261111_02','clinical','herpangina',[24,29],'구개·목젖 주위 작은 수포 → 대표 바이러스','소아에게 발열·인후통과 함께 연구개·목젖 주위의 작은 수포가 생겼다. 포진성구협염의 대표 원인은?','Coxsackievirus A','enterovirus','Coxsackie A의 포진성구협염을 B의 심근염·흉막통과 구분한다.',[43,45]);
f('261111_02','clinical','myocarditis',[23,24,29],'심근염·흉막통 → 대표 Coxsackie 유형',null,'Coxsackievirus B','enterovirus','Coxsackie B는 심근염·심낭염·흉막통과 연결한다.',[43,45]);
f('261111_02','clinical','polio',[18,29],'회색질척수염·급성 이완성 마비 → 바이러스',null,'Poliovirus','enterovirus','Polio의 신경 침범과 임상적 마비를 구분하여 회상한다.');
f('261111_02','clinical','ev70',[29],'급성 출혈성 결막염 → Enterovirus 유형',null,'Enterovirus 70','enterovirus','EV70의 결막염과 Coxsackie A의 구협염을 바꾸지 않는다.',[43,45]);
f('261111_02','clinical','hfmd',[24,29],'손·발·입의 수포 → 대표 Coxsackie 유형','손바닥·발바닥과 입 안에 작은 수포가 생긴 소아다. 수족구병의 대표 Coxsackie 유형은?','Coxsackievirus A','enterovirus','Coxsackie A16·A6 등과 EV-A71이 수족구병을 일으킬 수 있다. 제시된 Coxsackie A/B를 구분한다.');
f('261111_02','clinical','protection',[4,17],'Enterovirus 혈행 파종 방어 → 중요한 면역축',null,'중화항체',[
 ['중화항체','혈청·점막 항체가 방어에서 중요.'],['세포독성 T세포','일부 장기 손상에 중요하지만 대표 파종 방어와 구분.'],['IgE','알레르기·기생충 방어와 연결.'],['호산구','대표 항바이러스 파종 방어축과 다름.'],['기억 B세포 감염','EBV의 잠복 세포 개념과 구분.']],
 'Picorna 방어에서 항체의 비중이 크며 HAV·Coxsackie B의 면역 손상은 별도 비교한다.',[46]);
const polioVaccines=[['OPV · 생백신 · 경구','장 점막 면역, 백신 연관 위험과 비교.'],['IPV · 불활화 · 주사','불활화 백신, 주사 투여.'],['OPV · 불활화 · 경구','백신 성격을 바꾼 보기.'],['IPV · 생백신 · 주사','IPV의 생/사 성격을 치환.'],['OPV · 생백신 · 주사','OPV의 투여 경로를 치환.']];
f('261111_02','poliorhino','opv',[19,20],'경구용 polio 백신의 성격·경로 조합은?',null,'OPV · 생백신 · 경구',polioVaccines,'OPV와 IPV의 생/사·경구/주사 조합을 구분한다.');
f('261111_02','poliorhino','ipv',[19,20],'불활화 polio 백신의 성격·경로 조합은?',null,'IPV · 불활화 · 주사',polioVaccines,'불활화 IPV와 약독화 생백신 OPV의 특징을 바꿔 외우지 않는다.');
f('261111_02','poliorhino','acid',[5,27],'산에 불안정한 Picorna의 대표 예외는?',null,'Rhinovirus','rnaViruses','장관형 enterovirus의 산 저항성과 rhinovirus의 산 불안정성을 비교한다.');
f('261111_02','poliorhino','cold',[27,28],'반복되는 콧물감기의 대표 비외피 (+)RNA 바이러스는?',null,'Rhinovirus','rnaViruses','다양한 혈청형·일시적인 점막 면역으로 재감염이 가능하다.');

pool('influenzaProteins',[['HA','수용체 결합·막 융합, 주요 중화항체 표적.'],['NA','Sialic acid 절단·바이러스 방출 촉진.'],['M2','양성자 통로, 탈외피와 연관.'],['NP','Nucleocapsid 성분, 형 특이 항원과 연결.'],['PA','Polymerase 복합체의 cap-dependent endonuclease, baloxavir 표적.']]);
pool('influenzaDrugs',[['Oseltamivir','Neuraminidase 억제.'],['Zanamivir','Neuraminidase 억제.'],['Baloxavir','Cap-dependent endonuclease 억제.'],['Amantadine','M2 통로 표적, 현재 임상 사용은 내성 등 별도 고려.'],['Acyclovir','Herpes DNA polymerase 억제와 연결.']]);
part('261112_01','structure','Ortho↔Paramyxo 기본 표','분절 여부·복제 장소·입자 내 중합효소를 비교합니다.','외피와 (-)RNA 공통점을 고정하고 분절·핵/세포질만 바꿉니다.','비슷한 두 과를 하나의 RNA 바이러스 특성으로 외우지 않습니다.');
part('261112_01','protein','HA·NA·M2·PA와 약제','부착·융합·방출·탈외피·전사 기능과 약물 표적을 대응합니다.','기능→단백질→약제를 세 칸으로 왕복 회상합니다.','Oseltamivir를 탈외피 억제로 바꾼 족보형 선지를 구분합니다.');
part('261112_01','clinical','Drift↔Shift·임상 경과','점변이와 큰 항원 변화·유행, 이차 세균폐렴을 비교합니다.','작은 항원 변화와 새로운 항원 조합을 나누고 증상 호전 후 재악화를 찾습니다.','항원 변화 용어와 치료 표적, 바이러스성과 이차 세균감염을 섞지 않습니다.');
const orthoCompare=[['Ortho · 분절 · 핵','Influenza의 대표 조합.'],['Paramyxo · 비분절 · 세포질','Paramyxo 계열의 대표 조합.'],['Ortho · 비분절 · 핵','분절 여부를 치환.'],['Ortho · 분절 · 세포질','주요 전사·복제 장소를 치환.'],['Paramyxo · 분절 · 핵','두 특징을 서로 바꾼 보기.']];
f('261112_01','structure','segmentation',[5,20],'Influenza의 분절·주요 전사 장소 조합은?',null,'Ortho · 분절 · 핵',orthoCompare,'Influenza는 분절 (-)RNA와 핵 내 전사·복제가 대표적이다.',[44]);
f('261112_01','structure','segments',[5],'Influenza A/B의 유전체 분절 수는?',null,'8개',[
 ['8개','Influenza A·B.'],['7개','Influenza C·D.'],['6개','A/B의 분절 수를 치환.'],['9개','A/B의 분절 수를 치환.'],['비분절','Paramyxo 계열과 비교.']],
 'A/B 8분절과 C/D 7분절을 구분한다.');
f('261112_01','structure','nucleus',[20],'Influenza RNA 전사·복제의 주요 장소는?',null,'핵','compartment','RNA 바이러스의 대표적 핵 내 전사 예외이다.',[44]);
f('261112_01','protein','ha',[9,10],'Influenza 수용체 결합·막 융합 → 단백질',null,'HA','influenzaProteins','HA의 부착·융합과 NA의 방출을 구분한다.');
f('261112_01','protein','na',[9,12],'Sialic acid 절단·방출 촉진 → 단백질',null,'NA','influenzaProteins','Neuraminidase는 방출을 촉진하며 oseltamivir·zanamivir의 표적이다.',[44]);
f('261112_01','protein','m2',[14],'양성자 통로·탈외피 → 단백질',null,'M2','influenzaProteins','M2 표적과 NA 표적을 바꾸지 않는다.');
f('261112_01','protein','oseltamivir',[12,26,39],'Oseltamivir → 직접 표적',null,'NA','influenzaProteins','Oseltamivir는 NA 억제제이며 M2 탈외피 억제제가 아니다.',[44]);
f('261112_01','protein','baloxavir',[20,26],'Cap-dependent endonuclease 억제 → 약물',null,'Baloxavir','influenzaDrugs','Baloxavir의 전사 관련 표적과 NA 억제제를 비교한다.');
f('261112_01','protein','amantadine',[14],'강의에서 M2 통로 표적과 연결한 약물은?',null,'Amantadine','influenzaDrugs','작용기전 대응이며 임상적 권장 여부는 내성과 지침을 별도로 평가한다.');
const variation=[['Drift · 누적 점변이','작은 항원 변화와 계절 유행.'],['Shift · 큰 항원 변화','Influenza A의 새로운 항원 조합·범유행과 연결.'],['Drift · 분절 교환','Shift의 기전을 drift로 치환.'],['Shift · 단순 점변이','Drift의 기전을 shift로 치환.'],['Drift · 항원 변화 없음','항원 변화 개념을 반대로 바꾼 보기.']];
f('261112_01','clinical','drift',[3,30,40],'작은 항원 변화·계절 유행 → 용어',null,'Drift · 누적 점변이',variation,'Drift는 점변이 축적에 의한 항원 소변이이다.');
f('261112_01','clinical','shift',[3,31],'새로운 큰 항원 변화·범유행 → 용어',null,'Shift · 큰 항원 변화',variation,'Influenza A의 큰 항원 변화와 범유행을 drift와 구분한다.');
f('261112_01','clinical','superinfection',[28,38],'독감 호전 뒤 재발열·화농성 가래·국소 폐경화 → 합병증','독감 증상이 호전되던 환자에게 다시 고열·화농성 객담·국소 폐경화가 발생했다. 우선 고려할 합병증은?','이차 세균성 폐렴',[
 ['이차 세균성 폐렴','호흡기 상피 손상 뒤 세균 중복감염.'],['단순 회복기 피로','재발열·국소 폐경화를 충분히 설명하지 못함.'],['무증상 바이러스 배출','임상 재악화와 구별.'],['항체 형성의 정상 반응','화농성 국소 합병증을 면역 획득으로 해석하지 않음.'],['잠복 감염의 무증상 상태','임상적 폐렴의 악화를 설명하지 못함.']],
 '인플루엔자는 이차 세균감염의 위험을 높이므로 호전 뒤 재악화 양상을 확인한다.');

pool('paramyxo',[['Measles','Koplik·기침·콧물·결막염·두부부터 발진.'],['Mumps','귀밑샘염·고환염·무균성 수막염.'],['RSV','영아 세기관지염·F 매개 융합, H/NA 활성 없음.'],['Parainfluenza','크룹·개 짖는 기침·흡기성 stridor.'],['Rubella','선천 백내장·난청·심장기형, (+)RNA.']]);
pool('surface',[['F protein','세포막 융합·syncytia 형성.'],['H/HN/G','바이러스별 수용체 결합 단백질.'],['M protein','입자 내부 matrix 구조.'],['N protein','RNA nucleocapsid 구성.'],['L protein','중합효소 복합체 성분.']]);
part('261112_02','structure','Ortho와의 차이·F 단백질','외피 (-)RNA의 공통점과 비분절·세포질·융합 기능을 비교합니다.','분절·복제 장소를 먼저 회상한 뒤 H/HN/G와 F의 역할을 나눕니다.','Ortho 표와 Paramyxo 표의 행을 바꾸는 문제를 대비합니다.');
part('261112_02','measles','홍역 전구기·발진·SSPE','Koplik 반점·CCC·발진 순서 및 후기 신경합병증을 연결합니다.','발진 전 전구기부터 시간축을 그려 증상과 전염 가능성을 함께 봅니다.','전구기의 전염력과 발진 원인을 반대로 바꾼 선지를 구분합니다.');
part('261112_02','respiratory','Mumps·RSV·Parainfluenza','귀밑샘/고환·세기관지·후두기관의 침범 차이를 외웁니다.','연령과 장기를 고정하고 원인 바이러스 이름만 교체합니다.','천명과 stridor, 귀밑샘염과 발진성 질환을 혼동하지 않습니다.');
part('261112_02','rubella','풍진·선천 감염','풍진의 (+)RNA·임신 초기 위험·백내장/난청/심장기형을 연결합니다.','산모의 면역 여부와 최근 감염을 IgG/IgM으로 나눠 회상합니다.','홍역과 이름이 비슷해도 구조·증상·태아 위험이 다른 점을 구분합니다.');
f('261112_02','structure','compare',[3,5],'Paramyxo 계열의 분절·주요 복제 장소 조합은?',null,'Paramyxo · 비분절 · 세포질',orthoCompare,'Paramyxo 계열은 비분절 (-)RNA와 세포질 복제를 대표 조합으로 외운다.',[44]);
f('261112_02','structure','fusion',[5,8,10],'세포 융합·syncytia → 주요 단백질',null,'F protein','surface','F는 fusion, H/HN/G는 바이러스별 부착 단백질과 연결한다.');
f('261112_02','structure','attachment',[5,8],'H/HN/G의 공통 역할은?',null,'수용체 결합',[
 ['수용체 결합','Attachment 단백질의 역할.'],['RNA 중합','L·P 등 중합효소 복합체와 연결.'],['Matrix 형성','M 단백질.'],['RNA 감싸기','N·NP 단백질.'],['세포막 융합','주로 F 단백질과 연결.']],
 '부착 H/HN/G와 융합 F의 역할을 서로 바꾸지 않는다.');
f('261112_02','measles','koplik',[15],'CCC + Koplik 반점 → 바이러스','고열·기침·콧물·결막염이 있는 소아의 구강 점막에 Koplik 반점이 보인다. 이후 귀 뒤에서 시작한 발진이 내려온다. 원인은?','Measles','paramyxo','Koplik은 홍역의 발진 전 전구기 단서이다.',[46,47]);
f('261112_02','measles','prodrome',[15,18],'Koplik 반점이 보이는 시기는?',null,'발진 전 전구기',[
 ['발진 전 전구기','전염력이 높은 전구 시기.'],['발진 후 회복기','시간 순서를 뒤집은 보기.'],['해열 후 발진기','돌발발진과 비교.'],['수년 뒤 신경증상기','SSPE와 관련된 후기 시기.'],['태아기 잠복 단계','홍역 전구기와 다름.']],
 '전구기의 Koplik 반점과 높은 전염력을 발진 후 회복기와 구분한다.');
f('261112_02','measles','sspe',[14,16],'홍역 수년 뒤 진행성 신경학적 악화 → 합병증',null,'SSPE',[
 ['SSPE','아급성 경화범뇌염, 후기 합병증.'],['급성 세기관지염','RSV와 연결.'],['무형성 위기','B19·용혈성 빈혈과 연결.'],['선천 백내장','풍진 태아 감염과 연결.'],['고환염','Mumps와 연결.']],
 '급성 홍역 뇌염·감염후 뇌염과 수년 뒤 SSPE를 시간축으로 구분한다.');
f('261112_02','respiratory','mumps',[24,25],'귀밑샘염 + 사춘기 후 고환염 → 원인체',null,'Mumps','paramyxo','Mumps는 귀밑샘염 외에 고환·뇌막·췌장 침범을 연결한다.');
f('261112_02','respiratory','rsv',[29,31],'어린 영아의 하기도 세기관지염 → 원인체',null,'RSV','paramyxo','RSV의 영아 세기관지염과 parainfluenza의 크룹을 비교한다.',[46,49]);
f('261112_02','respiratory','croup',[33,34],'개 짖는 기침·흡기성 stridor → 대표 바이러스','야간에 개 짖는 듯한 기침과 흡기성 stridor가 심해지는 소아다. 후두기관기관지염의 대표 원인은?','Parainfluenza','paramyxo','크룹의 후두기도 증상과 RSV 세기관지염의 호기성 천명을 구분한다.');
f('261112_02','respiratory','rsv-hn',[29],'HA·NA 활성이 없는 대표 호흡기 바이러스는?',null,'RSV','paramyxo','RSV는 H·NA 활성이 없으며 F 매개 융합과 연결한다.');
f('261112_02','rubella','rna',[38],'Rubella virus의 유전체 극성은?',null,'(+)ssRNA',[
 ['(+)ssRNA','Matonaviridae의 풍진바이러스.'],['(-)ssRNA','홍역·볼거리 등과 비교.'],['dsRNA','Reovirus 계열과 비교.'],['선형 ssDNA','Parvovirus와 비교.'],['부분 이중가닥 DNA','HBV와 비교.']],
 '풍진은 Matonaviridae의 (+)ssRNA이며 같은 강의의 홍역 (-)RNA와 다르다.',[44,46]);
f('261112_02','rubella','congenital',[43,44],'백내장·감각신경성 난청·심장기형 → 선천 감염',null,'Rubella','paramyxo','선천성 풍진의 눈·귀·심장 소견을 B19 태아 빈혈·CMV 난청과 비교한다.',[44,45,47]);
f('261112_02','rubella','trimester',[44],'선천성 풍진 기형 위험이 가장 큰 임신 시기는?',null,'임신 첫 3개월',[
 ['임신 첫 3개월','기관 형성기의 선천 기형 위험이 큼.'],['임신 4–6개월','초기와 비교할 중기.'],['임신 7–9개월','초기와 비교할 후기.'],['분만 시 산도 노출','태내 기형 발생 시기와 구분.'],['출생 후 수유기','선천 감염 시기와 다름.']],
 '풍진 태아 기형 위험은 임신 초기 노출에서 특히 크다.',[45,47]);
f('261112_02','rubella','igg',[45],'산모의 풍진 면역 여부 확인 → 항체',null,'Rubella IgG',[
 ['Rubella IgG','과거 감염·예방접종에 의한 면역 평가.'],['Rubella IgM','최근 감염 평가에 쓰되 검사 맥락이 필요.'],['Anti-HBs','HBV 표면항원에 대한 항체.'],['VCA IgM','EBV 급성 감염 표지.'],['Anti-HBc IgM','급성 HBV 감염·window 평가.']],
 '면역 여부를 보는 IgG와 최근 감염을 평가하는 IgM을 구분한다.');

pool('hepatitis',[['HAV','비외피 (+)RNA, 분변–경구·급성 간염.'],['HBV','외피·부분 이중가닥 DNA, 혈액·체액 및 수직감염.'],['HCV','외피 (+)RNA·Flaviviridae, 만성 감염·DAA.'],['HDV','HBsAg 외피가 필요한 delta RNA virus.'],['HEV','분변–경구 전파, 임신부 중증 간염 위험.']]);
pool('hbvMarkers',[['HBsAg','바이러스 표면항원, 감염 표지·백신 항원.'],['Anti-HBs','표면항원에 대한 항체, 회복·백신 면역과 연결.'],['HBcAg','Core·capsid 항원.'],['Anti-HBc IgM','급성·최근 감염 및 window 평가.'],['HBeAg','분비성 e 항원, 복제 활성을 평가하는 단서.']]);
pool('hbvStates',[['급성 감염','HBsAg·anti-HBc IgM 양성의 전형.'],['Window period','HBsAg 소실 뒤 anti-HBs 출현 전, anti-HBc IgM 양성.'],['과거 감염 후 회복','HBsAg 음성, anti-HBs·total anti-HBc 양성.'],['백신 면역','HBsAg·anti-HBc 음성, anti-HBs 양성.'],['감염 감수성 상태','세 표지가 모두 음성인 전형적 상태.']]);
part('261112_03','overview','A–E 전파·만성화·위험군','분변–경구 A/E와 혈액·체액 B/C/D, DNA 예외와 임신 위험을 비교합니다.','바이러스 이름을 가리고 유전체·외피·전파·만성화 네 칸을 채웁니다.','간염이라는 같은 임상명으로 구조·경과를 한데 외우지 않습니다.');
part('261112_03','hbv','HBV 항원·구조·지속 감염','HBs/HBc/HBe, 부분 이중가닥 DNA·cccDNA와 감염 연령을 구분합니다.','s는 surface, c는 core를 먼저 고정하고 항원과 항체를 분리합니다.','바이러스 입자와 비감염성 표면입자, 임상적 억제와 제거를 혼동하지 않습니다.');
part('261112_03','serology','HBV 항원·항체 조합','급성·window·회복·백신 면역의 검사 조합을 따로 외웁니다.','HBsAg→anti-HBs→anti-HBc 순서로 체크한 뒤 IgM 여부를 확인합니다.','Anki와 족보의 항체 표에서 부호 하나를 바꾼 문제를 대비합니다.');
part('261112_03','hcvhdv','HCV 진단·DAA / HDV','Anti-HCV와 RNA의 역할, DAA 및 HDV의 HBsAg 의존성을 연결합니다.','항체 양성 후 현재 바이러스 존재 확인이라는 검사 순서를 회상합니다.','과거 노출과 현재 감염, HBV 표면단백과 X단백을 혼동하지 않습니다.');
f('261112_03','overview','dna',[6,14],'A–E 간염 바이러스 중 DNA 바이러스는?',null,'HBV','hepatitis','대표 간염 바이러스 중 HBV만 DNA이며 나머지는 RNA이다.',[47,48]);
f('261112_03','overview','hav',[9],'비외피·분변–경구·급성 간염 → 바이러스',null,'HAV','hepatitis','HAV와 HEV는 분변–경구 전파이나 구조·고위험군을 추가로 비교한다.');
f('261112_03','overview','hev',[6],'분변–경구 간염 중 임신부 중증 위험 → 바이러스',null,'HEV','hepatitis','임신부 중증 간염 위험과 HEV를 연결한다.',[47]);
f('261112_03','overview','hcv-family',[31],'Flaviviridae·(+)RNA·만성 간염 → 바이러스',null,'HCV','hepatitis','HCV의 RNA·외피·만성화와 HBV의 DNA 예외를 비교한다.',[47,48]);
f('261112_03','hbv','surface',[16,17,18],'HBV 표면·백신 항원은?',null,'HBsAg','hbvMarkers','HBsAg는 표면항원, HBcAg는 core 항원이다.');
f('261112_03','hbv','core',[16,17],'HBV capsid 항원은?',null,'HBcAg','hbvMarkers','HBcAg와 분비성 HBeAg를 구분한다.');
f('261112_03','hbv','e',[16,17],'HBV의 분비성 e 항원은?',null,'HBeAg','hbvMarkers','HBeAg는 복제 활성 평가의 단서이며 표면항원 HBsAg와 다르다.');
f('261112_03','hbv','dna-shape',[14],'HBV 비리온 유전체의 대표 형태는?',null,'부분 이중가닥 DNA',[
 ['부분 이중가닥 DNA','비리온 HBV DNA의 형태.'],['완전한 선형 dsDNA','Herpes·adeno 등의 대표 유전체와 비교.'],['선형 ssDNA','Parvovirus와 비교.'],['분절 (-)RNA','Influenza와 비교.'],['원형 RNA','HDV와 비교.']],
 '비리온의 부분 이중가닥 DNA와 핵 내 cccDNA를 구분한다.',[47,48]);
f('261112_03','hbv','ccc',[19,20],'HBV 치료 후 지속 감염과 연결되는 핵 내 형태는?',null,'cccDNA',[
 ['cccDNA','핵 내 안정한 HBV DNA 형태.'],['HBsAg','표면항원 단백질.'],['HBeAg','분비성 항원 단백질.'],['Anti-HBs','숙주 항체.'],['Anti-HBc IgM','급성 감염 관련 숙주 항체.']],
 '핵 내 cccDNA의 잔존은 혈중 바이러스 억제와 완전 제거의 차이를 설명한다.');
f('261112_03','hbv','age',[25,27,28],'HBV 만성화 위험이 더 높은 감염 시기는?',null,'주산기·영아기',[
 ['주산기·영아기','미숙한 면역반응으로 만성화 위험이 큼.'],['학령기','영아기보다 낮은 만성화 위험과 비교.'],['청소년기','영아기보다 낮은 만성화 위험과 비교.'],['건강한 성인기','영아기보다 낮은 만성화 위험과 비교.'],['면역정상 장년기','주산기 감염과 비교할 감염 연령.']],
 'HBV 감염 때 나이가 어릴수록 만성화 위험이 높다는 방향을 외운다.',[48]);
f('261112_03','serology','acute',[41],'HBsAg + / anti-HBc IgM + / anti-HBs − → 전형적 상태','황달이 생긴 환자의 HBsAg와 anti-HBc IgM이 양성이고 anti-HBs는 음성이다. 전형적 해석은?','급성 감염','hbvStates','급성 감염의 전형적 조합이며 임상·과거 검사와 함께 해석한다.',[47]);
f('261112_03','serology','window',[41],'HBsAg − / anti-HBs − / anti-HBc IgM + → 전형적 전환기','이전에 HBsAg 양성이던 급성 간염 환자가 호전 중이다. HBsAg는 사라졌고 anti-HBs는 아직 없으며 anti-HBc IgM이 양성이다. 시기는?','Window period','hbvStates','HBsAg 소실과 anti-HBs 출현 사이의 window를 anti-HBc IgM으로 구분한다.',[47]);
f('261112_03','serology','vaccine',[16,18,41],'HBsAg − / anti-HBs + / total anti-HBc − → 전형적 상태',null,'백신 면역','hbvStates','백신 면역은 anti-HBs 양성·anti-HBc 음성이 전형적이며 자연 감염 후 회복과 다르다.');
f('261112_03','serology','resolved',[41],'HBsAg − / anti-HBs + / total anti-HBc + → 전형적 상태',null,'과거 감염 후 회복','hbvStates','자연 감염 후에는 core 항체가 남아 백신 면역과 구분된다.');
f('261112_03','serology','susceptible',[41],'HBsAg·anti-HBs·total anti-HBc 모두 음성 → 전형적 상태',null,'감염 감수성 상태','hbvStates','감염력·백신력·최근 노출 맥락을 함께 보되 전형적 삼중 음성은 감수성 상태이다.');
f('261112_03','serology','window-marker',[41],'Window에서 급성 감염 판단에 중요한 항체는?',null,'Anti-HBc IgM','hbvMarkers','Total anti-HBc 단독과 IgM 양성을 동일하게 해석하지 않는다.');
f('261112_03','hcvhdv','hdv-helper',[30],'HDV 감염성 입자에 필요한 HBV 성분은?',null,'HBsAg','hbvMarkers','HDV는 HBV의 표면항원 HBsAg에 의존하며 X단백이 필요한 것으로 바꾸지 않는다.',[47,48]);
f('261112_03','hcvhdv','hdv',[30],'HBsAg 외피 의존 delta agent → 바이러스',null,'HDV','hepatitis','HDV와 HBV의 동시감염·중복감염은 구분해 해석한다.');
f('261112_03','hcvhdv','rna-confirm',[40],'Anti-HCV 양성 뒤 현재 감염 확인 검사는?',null,'HCV RNA',[
 ['HCV RNA','현재 바이러스 존재 확인.'],['Anti-HCV 재측정','항체 지속만으로 현재 감염을 확정하지 않음.'],['HBsAg','HBV 표면항원.'],['Anti-HBc IgM','급성 HBV 관련 항체.'],['HBeAg','HBV의 e 항원.']],
 'Anti-HCV는 노출의 표지이며 RNA 검출로 현재 감염을 확인한다.',[48]);
f('261112_03','hcvhdv','daa',[38,40],'현재 HCV 감염의 표적 치료 범주는?',null,'직접작용 항바이러스제',[
 ['직접작용 항바이러스제','DAA, HCV 치료의 중심.'],['Lamivudine','HBV와 연결되는 핵산 유사체.'],['Acyclovir','HSV·VZV와 연결.'],['Oseltamivir','Influenza NA 억제.'],['Linezolid','세균 50S 표적.']],
 'HCV의 DAA와 HBV·herpes·influenza 약제를 구분한다. 구체적 치료 조합은 상태에 따라 결정한다.',[47,48]);

// Correct source aliases and provide external confirmation for serologic edge cases.
for(const q of [...Q,...R]){
 if(q.lecture==='261109_03'&&/breakpoint/.test(q.id)&&!q.sourceRefs.some(r=>r.doc==='antibiotics'))q.sourceRefs.push({doc:'antibiotics',pages:[23,24]});
 if(q.lecture==='261109_03'&&/-mic$/.test(q.id))q.examRefs=[];
 if(q.lecture==='261109_03'&&/-mrsa$/.test(q.id))q.examRefs=['1차 족보 PDF 33쪽 (유형 참고)'];
 if(q.lecture==='261109_05'&&/-mssa-cns$/.test(q.id))q.examRefs=['1차 족보 PDF 7·8·9쪽 (유형 참고)'];
 if(q.lecture==='261109_05'&&/-kpc$/.test(q.id))q.examRefs=['1차 족보 PDF 34쪽 (유형 참고)'];
 if(q.lecture==='261112_03'&&q.recallSection.endsWith(':serology'))q.externalRefs=[{title:'CDC HBV 항원·항체 해석표',url:'https://www.cdc.gov/hepatitis-b/hcp/diagnosis-testing/'}];
 if(q.lecture==='261112_03'&&/rna-confirm/.test(q.id))q.externalRefs=[{title:'CDC HCV 검사 해석',url:'https://www.cdc.gov/hepatitis-c/hcp/diagnosis-testing/index.html'}];
 if(q.lecture==='261113_02'&&/roseola/.test(q.id)&&!q.sourceRefs.some(r=>r.doc==='261113_01'))q.sourceRefs.push({doc:'261113_01',pages:[22]});
}
export const EXTENSION_QUESTIONS=Object.freeze(Q);
export const EXTENSION_RECALL_QUESTIONS=Object.freeze(R);
export const EXTENSION_TABLE_TOPICS=Object.fromEntries(Object.values(EXTENSION_PARTS).map(s=>[`table-ext-${s.lecture}-${s.id.split(':')[1]}`,{title:s.title,short:s.title}]));
