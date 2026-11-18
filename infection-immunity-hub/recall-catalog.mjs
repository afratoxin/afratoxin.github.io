import {PARTS as NOV18_P} from './nov18-bank.mjs?v=20261119d';
import {PARTS as NOV_VP} from './nov16-virus-bank.mjs?v=20261119d';
import {PARTS as NOV_FP} from './nov16-fungi-bank.mjs?v=20261119d';
import {ENTERIC_MEDIA_PARTS} from './enteric-media-bank.mjs?v=20261119d';
import {CBL_PARTS} from './cbl-bank.mjs?v=20261119d';
import {TABLE_QUESTIONS,LECTURES} from './study-bank.mjs?v=20261119d';
import {EXTENSION_PARTS} from './extension-bank.mjs?v=20261119d';
import {stats} from './logic.mjs?v=20261119d';

const parts={...NOV18_P,...NOV_VP,...NOV_FP,...EXTENSION_PARTS,...ENTERIC_MEDIA_PARTS,...CBL_PARTS};
function p(doc,key,title,what,how,why){parts[`${doc}:${key}`]={id:`${doc}:${key}`,lecture:doc,title,what,how,why};}
p('261102_05','oral','항생제 경구 투여','전신 감염 경구 치료 가능 약과 장내 국소 작용 약을 구분합니다.','약제명을 보고 경구/정주를 나누고 vancomycin의 장내 예외를 붙입니다.','먹을 수 있다는 말과 전신 유효 농도에 도달한다는 말을 구분합니다.');
p('261102_05','bbb','항생제 BBB 통과','수막 염증 때 CSF 이행이 좋은 약과 부족한 약을 비교합니다.','1세대 cephalosporin·aminoglycoside를 3/4세대와 바꿔 봅니다.','혈중 감수성이 있어도 수막염 약제로 적절하지 않을 수 있습니다.');
p('261102_05','pregnancy','임신 중 약제 선택','상대적으로 안전한 계열과 주수·적응증에 따라 주의할 약을 나눕니다.','Penicillin/cephalosporin을 기준으로 비슷한 약제 이름을 비교합니다.','주의와 모든 상황의 절대금기를 같은 뜻으로 외우지 않습니다.');
p('261102_05','cases-cns','수막염·감수성 기준','수막염의 감수성 기준과 CSF 이행을 약제 선택에 연결합니다.','같은 S 결과에서도 penicillin MIC와 감염 부위를 먼저 확인합니다.','검사실 감수성과 실제 중추신경계 치료 적합성을 구분합니다.');
p('261102_05','cases-typhi','장티푸스·감수성과 약제','감수성이 확인된 장티푸스의 약제 선택과 부적절한 대안을 비교합니다.','Ciprofloxacin과 gentamicin·cefuroxime을 감염 부위 맥락에서 비교합니다.','감수성 S라는 글자 하나만으로 치료제를 고르지 않도록 합니다.');
p('261102_05','cases-pyelonephritis','신우신염·경구 전환·임신','신우신염의 투여 경로·임신 중 선택·지속 발열의 평가를 연결합니다.','구토→정주, 호전·식사→경구 전환, 지속 발열→합병증 순서로 비교합니다.','같은 균과 약제라도 숙주와 경과에 따라 달라지는 판단을 연습합니다.');
p('261102_05','cases-management','감염원 관리·C. difficile','항생제가 필요한 상황과 배농·장내 약물 작용을 구분합니다.','바이러스 상기도감염·고름집·항생제 후 설사의 핵심 처치를 비교합니다.','항생제 선택 전 감염원 조절과 실제 약물이 작용할 부위를 확인합니다.');
p('261104_01','identity','Gram·catalase·coagulase','알균 배열과 catalase/coagulase·H₂O₂·응고 반응을 연결합니다.','Staph↔Strep 다음 S. aureus↔CNS 순서로 두 갈래를 나눕니다.','균 이름만 보지 않고 검사 성상 두 개로 동정하는 문제를 풉니다.');
p('261104_01','surface','Protein A·slime·부착','IgG Fc 결합·기구 부착·fibrinogen 결합의 인자를 구분합니다.','숙주 분자/기구 표면을 먼저 쓰고 인자명을 가려 회상합니다.','항식균이라는 공통 기능 안에서 구체적인 결합 대상을 구분합니다.');
p('261104_01','toxin','독소·ETA↔ETB','표피탈락·식중독·독성쇼크와 ETA/ETB 위치·열안정성을 비교합니다.','독소명↔증상 다음 ETA↔ETB 두 행 표를 양방향으로 채웁니다.','구토·표피탈락·쇼크를 서로 바꾼 선지와 비슷한 독소 약어를 구분합니다.');
p('261105_01','groups','A/B/D군·신생아 감염','GAS·GBS·Enterococcus의 군과 질환·PYR을 비교합니다.','군 이름을 가리고 신생아/인두/요로 단서에서 균을 역으로 고릅니다.','A군 인두염과 B군 신생아 감염을 이름이 비슷하다고 섞지 않습니다.');
p('261105_01','optochin','폐렴구균·담즙·optochin','α용혈균의 optochin 감수성과 담즙 용해·장알균 저항성을 비교합니다.','감수성/저항성·용해/비용해 두 열을 번갈아 가립니다.','Gram 양성 알균이라는 공통점에 추가 반응을 더해 감별합니다.');
p('261104_02','viral','바이러스 봉입체·세포 변화','CMV·HSV·물사마귀의 세포 크기·핵/세포질 봉입체를 구분합니다.','바이러스명↔봉입체 위치와 이름을 서로 반대로 떠올립니다.','조직 사진을 봤을 때 명칭 암기와 위치 관찰을 결합합니다.');
p('261104_02','stain','특수염색·협막','GMS와 mucicarmine의 염색 대상 및 항산염색과의 차이를 외웁니다.','진균 벽/다당류 협막/항산균 세 칸에 검사 이름을 맞춥니다.','진균이 보인다는 말과 Cryptococcus 협막 확인을 구분합니다.');
p('261104_03','fungi','진균 형태 감별','Aspergillus·Mucorales·Candida·Cryptococcus·Pneumocystis를 비교합니다.','격벽·분지각·폭·효모/가성균사·협막을 고정 순서로 회상합니다.','혈관침범만으로 Aspergillus와 Mucorales를 고르지 않게 합니다.');
p('261104_03','immune','면역저하·항산균 병리','결핵·MAC·한센병에서 균 수와 육아종·세포면역을 비교합니다.','숙주 세포면역의 강/약을 먼저 정하고 균 수·조직상을 붙입니다.','잘 형성된 육아종과 포말성 조직구를 같은 병리로 외우지 않습니다.');
p('261104_05','viral','실습·HSV↔CMV','핵 molding·다핵화와 거대세포·owl’s eye를 비교합니다.','세포 전체 크기와 핵 변화를 따로 관찰한 뒤 이름을 연결합니다.','같은 핵 내 변화라도 바이러스별 표본 감별점을 찾습니다.');
p('261104_05','fungi','실습·진균 대응','효모·가성균사·낭벽·넓은 균사의 조직 소견을 연결합니다.','현미경 소견의 세 단어만 남겨 원인체를 떠올립니다.','균 이름을 보지 않은 조직 설명에서도 같은 표를 적용합니다.');
p('261105_02','identity','기본 성상·oxidase','장내세균의 Gram·모양·oxidase·아포·운동성을 구분합니다.','장내세균 기준행을 쓰고 Pseudomonas/Vibrio 예외와 비교합니다.','그람음성 막대균이라는 정보 하나로 원인균을 단정하지 않습니다.');
p('261105_02','media','MacConkey·젖당 발효 표','선택 성분·지시약·집락 색과 첨부 강의표의 균별 배치를 비교합니다.','억제/감별 성분을 먼저 나눈 뒤 젖당 발효와 붉은색/투명 집락을 연결합니다.','성분의 이름과 역할, 균속과 강의표의 행·열을 바꾼 선지를 구분합니다.');
p('261105_02','antigen','O/H/K·섬모·편모','체성·편모·협막 항원과 lipid A·접합·부착 구조를 비교합니다.','O/H/K 이름을 가리고 위치·열성질·기능을 왕복 회상합니다.','항원 분류·운동성·내독소 기능을 서로 바꾸는 문제를 대비합니다.');
p('261105_03','imvic','IMViC·효소 판독','Indole/MR/VP/citrate와 E. coli·Klebsiella의 대표 조합을 외웁니다.','I-M-V-C 순서를 고정하고 ++--와 --++를 교대로 채웁니다.','검사 이름은 알지만 대사 경로나 부호 순서를 바꾸는 오류를 줄입니다.');
p('261105_03','enteritis','E. coli 병원형·장염','ETEC/EPEC/EIEC/EHEC/EAEC의 독소·부착·침습과 증상을 비교합니다.','수양성/혈성/지속성 설사를 먼저 나누고 병원형을 넣습니다.','한 단원에서 이름만 보고 답하지 않고 HUS·침습 단서를 구분합니다.');
p('261105_03','identification','Salmonella·Shigella·Proteus','운동성·H₂S·lactose·urease 및 Proteus indole을 비교합니다.','균별 네 칸 표를 채운 뒤 mirabilis/vulgaris indole만 바꿉니다.','같은 lactose 비발효균과 요로감염균을 추가 검사로 구분합니다.');
p('261105_05','vibrio','Vibrio·TCBS','Sucrose·TCBS 및 해산물/간질환·장염/패혈증을 연결합니다.','Cholera·parahaemolyticus·vulnificus를 증상과 위험군으로 나눕니다.','물설사와 생굴 후 출혈성 수포·쇼크를 같은 Vibrio로 뭉뚱그리지 않습니다.');
p('261105_05','curved','Campylobacter↔H. pylori','미호기성 굽은 막대균의 장염/GBS와 위염/urease를 비교합니다.','침범 장기→특이 효소·배지→합병증 순서로 회상합니다.','굽은 모양이라는 공통점에서 감염 부위와 특이 단서를 추가합니다.');
p('261105_05','pseudomonas','녹농균 색소·동정','Oxidase·lactose와 pyocyanin/pyoverdine의 색·기능을 구분합니다.','청색/황록색과 산화환원/철 획득 두 열을 바꿔 떠올립니다.','색소 이름이 비슷해 기능을 뒤집는 선지를 구분합니다.');
p('261105_06','mycoplasma','세포벽 결여·한랭응집','Mycoplasma의 sterol 막·β-lactam 표적 결여·I 항원을 연결합니다.','세포벽 있음/없음과 세포막 sterol을 따로 적고 약제 반응을 붙입니다.','비정형 폐렴이라는 이름에서 구조·검사 성상까지 설명합니다.');
p('261105_06','ebrb','EB↔RB','감염성·분열성·세포 내 inclusion과 진정한 아포의 차이를 비교합니다.','EB=감염형, RB=분열형을 축으로 두 역할만 교체합니다.','Spore-like라는 표현을 실제 endospore로 오해하지 않습니다.');
p('261105_06','clinical','클라미디아별 질환','Trachomatis·pneumoniae·psittaci와 신생아/조류/폐렴을 연결합니다.','숙주·노출력을 먼저 보고 비슷한 종 이름을 역으로 고릅니다.','같은 Chlamydia 이름만으로 모든 증례를 맞추지 않게 합니다.');
p('261106_03','wall','항산성·세포벽','Mycolic acid·항산염색과 일반 Gram 염색의 차이를 외웁니다.','세포벽 성분→염색, 염색 결과→성분으로 왕복 회상합니다.','Mycobacterium을 일반적인 Gram 반응으로만 분류하지 않습니다.');
p('261106_03','immune','TST/IGRA·TT/LL·NTM','면역 검사와 직접 검출, 한센병의 면역 스펙트럼·환경성 NTM을 구분합니다.','면역반응 검사인지 직접 균 검출인지 먼저 묻고 TT/LL 양끝을 비교합니다.','활동성 확진·감염력·면역반응을 한 가지 검사 결과로 단정하지 않습니다.');
p('261106_05','diphtheria','Corynebacterium·EF-2','곤봉형 Gram 양성균·디프테리아 독소 표적·toxoid를 연결합니다.','독소 표적 EF-2와 예방·치료의 항원/항체를 다른 칸으로 외웁니다.','Pseudomonas exotoxin A와 공유하는 표적을 비교합니다.');
p('261106_05','nocardia','Nocardia↔Actinomyces','분지형 세균의 산소·항산성·폐/뇌농양·구강/만성 화농을 비교합니다.','비슷한 분지 모양을 고정하고 항산성·산소 반응만 교체합니다.','진균처럼 보이는 세균과 서로 다른 분지형 세균을 구분합니다.');
p('261106_06','gut','무산소균·ROS 방어','SOD→catalase와 B. fragilis·F. nucleatum·아포를 비교합니다.','효소의 기질/생성물 순서를 쓰고 균별 임상 연관을 붙입니다.','무산소균의 산소 내성을 모두 같게 보거나 SOD와 catalase를 바꾸지 않습니다.');
p('261106_06','toxin','TcdA/B·CDT·BFT','Rho/Rac·actin·E-cadherin 표적과 효소 작용을 비교합니다.','독소명과 표적을 양방향으로 회상하고 glycosylation/ADP를 나눕니다.','같은 장 상피 손상 독소 안에서 표적 하나를 치환한 보기를 구분합니다.');
p('261106_06','neuro','Tetanus↔Botulinum·α독소','GABA/glycine·ACh 방출 억제와 perfringens phospholipase를 구분합니다.','경직/이완을 먼저 고르고 신경전달물질을 역으로 연결합니다.','SNARE 작용 공통점 안에서 작용 위치·임상 마비 양상을 구분합니다.');
p('261109_01','haemophilus','X/V·PRP·NTHi','Hemin/NAD·위성현상·Hib 협막·비피막형을 구분합니다.','성장인자 X/V와 백신 항원 PRP를 다른 행에 적어 외웁니다.','배양 요구성과 협막·점막/침습 감염을 같은 개념으로 섞지 않습니다.');
p('261109_01','neisseria','Neisseria 당·배지','임균/수막염균의 glucose·maltose·선택배지를 비교합니다.','Glucose 공통점에 maltose 차이를 더하고 Thayer–Martin을 연결합니다.','그람음성 쌍알균이라는 공통점에서 종을 나누는 검사 항목입니다.');
p('261109_01','pertussis','백일해 증례·Gi 독소','영아 무호흡·발작기 기침 및 PT/ACT의 cAMP 기전을 비교합니다.','Gi 조절과 직접 adenylate cyclase 작용을 나눠 봅니다.','기침 소견과 독소 표적을 한 증례에서 서로 다른 단계로 묻습니다.');
p('261109_02','legionella','Legionella 검사·임상형','폐포 대식세포·수계 노출·SG1 소변항원·Pontiac fever를 연결합니다.','폐렴 유무와 검사 검출 범위를 각각 한 줄씩 비교합니다.','소변항원 음성만으로 다른 Legionella 감염을 배제하지 않습니다.');
p('261109_02','listeria','Listeria 인자·단계','Internalin 진입·LLO 탈출·ActA 이동과 비아포형성을 연결합니다.','진입→탈출→세포질 운동의 세 칸에 인자 이름을 넣습니다.','같은 세포내감염 기전 안에서 작용 단계를 바꿔 낸 보기를 구분합니다.');
p('261109_02','bacillus','Bacillus 협막·아포','Poly-D-glutamic acid 협막과 Bacillus/Listeria 아포 차이를 외웁니다.','협막의 화학 성분과 아포 형성 여부를 다른 열에 기록합니다.','Gram 양성 막대균 공통점과 탄저균의 협막 예외를 분리합니다.');
p('261110_01','syphilis','매독 검사·endoflagella','나선균 운동 구조 및 RPR/VDRL과 특이 항체 검사를 구분합니다.','치료 반응 추적과 감염 확인의 목적을 나눠 검사 이름을 넣습니다.','검사 양성의 뜻과 정량 역가의 역할을 혼동하지 않습니다.');
p('261110_01','borrelia','Vmp↔VlsE·보유숙주','재귀열과 Lyme disease의 항원변이·매개체·병원소를 비교합니다.','Vmp/VlsE 두 약어와 몸니/진드기·사람/설치류를 따로 짝짓습니다.','재귀열과 라임병에서 대상만 바꾼 짧은 선지를 구분합니다.');
p('261110_01','leptospira','Leptospira 노출·Weil병','동물 소변 오염수·결막 충혈·황달·신손상을 연결합니다.','노출력→증상→중증 임상형 세 칸을 짧게 회상합니다.','야외활동 발열을 진드기매개 질환과 구분할 단서를 확보합니다.');
p('261110_03','vectors','균–질환–매개체','Epidemic/murine typhus·RMSF·pox·scrub과 매개체를 연결합니다.','균/질환/매개체 세 칸 중 하나씩 번갈아 가립니다.','R. prowazekii/typhi와 몸니/벼룩을 뒤집는 전형적 선지를 구분합니다.');
p('261110_03','cells','세포질↔포식소체·혈구','Rickettsia/Orientia와 Anaplasma/Ehrlichia의 위치·표적 혈구를 비교합니다.','세포 내 위치 두 칸 다음 단핵구/과립구 두 칸을 비교합니다.','세포내 세균이라는 공통점에서 증식 장소와 감염 혈구를 구분합니다.');

p('261104_02','reaction','조직반응·육아종·Prion','화농·육아종·DAD·해면상 변화를 구성 성분과 연결합니다.','세포·괴사·유리막·단백질이라는 관찰 대상을 먼저 고릅니다.','병원체 이름을 모르는 조직 사진에서도 반응 유형을 구분합니다.');
p('261104_03','viral','EBV·HPV 표지자','반응성 CD8·p16 IHC·EBER ISH를 감염 표적과 검사법에 연결합니다.','B세포/CD8, 단백질 IHC/RNA ISH 두 비교표를 따로 채웁니다.','Anki에서 반복한 세포 계통·핵산과 단백질 검사의 바꿔치기를 구분합니다.');
const aliases={path1:'261104_02',path2:'261104_03',lab:'261104_05',antibiotics:'261102_05'};
export function recallLecture(q){return LECTURES[q.lecture]?q.lecture:aliases[q.sourceRefs?.[0]?.doc]||q.sourceRefs?.[0]?.doc;}
function section(q,doc){
 if(q.recallSection)return q.recallSection;
 const key=q.id.split('-basic-')[1]||'',id=q.id,stem=q.stem;
 let part;
 switch(doc){
 case '261102_05':part=q.topic.slice(10);break;
 case '261104_01':part=/eta|etb/.test(key)||/fact-a-(09|10|11)/.test(id)?'toxin':/protein-a/.test(key)||/fact-a-(07|08)/.test(id)?'surface':'identity';break;
 case '261105_01':part=/optochin|pyr|bile|microscopy/.test(key)||/fact-a-(04|05)/.test(id)?'optochin':'groups';break;
 case '261104_02':part=/gms|capsule/.test(key)?'stain':'viral';break;
 case '261104_03':part=/fact-b-(13|14|15|16)/.test(id)?'immune':'fungi';break;
 case '261104_05':part=/table-lab-morph/.test(id)?'fungi':'viral';break;
 case '261105_02':part=/kia-/.test(key)?'kia':/macconkey|indicator/.test(key)?'media':/^(h|o|lipida|conjugation|adhesion)$/.test(key)||/fact-/.test(id)?'antigen':'identity';break;
 case '261105_03':part=/imvic|indole|^mr$|^vp$|citrate/.test(key)?'imvic':/fact-b-0[1-7]/.test(id)?'enteritis':'identification';break;
 case '261105_05':part=/pseudo|pyocyanin|pyoverdine/.test(key)?'pseudomonas':/campy|microaerophile|hpylori/.test(key)?'curved':'vibrio';break;
 case '261105_06':part=/^wall$|cold-agglutinin/.test(key)?'mycoplasma':key?'ebrb':'clinical';break;
 case '261106_03':part=/acidfast|mycolic/.test(key)?'wall':'immune';break;
 case '261106_05':part=/nocardia|ros/.test(key)?'nocardia':'diphtheria';break;
 case '261106_06':part=/fact-c-0[1-3]/.test(id)?'neuro':/tcda|cdt|bft/.test(key)||/fact-c-0[45]/.test(id)?'toxin':'gut';break;
 case '261109_01':part=/pt/.test(key)||/table-lecture-copy-.*-(03|04|05)$/.test(id)?'pertussis':/thayer|sugar/.test(key)?'neisseria':'haemophilus';break;
 case '261109_02':part=/fact-c-07/.test(id)||/table-lecture-copy-/.test(id)?'legionella':/capsule|spores/.test(key)?'bacillus':'listeria';break;
 case '261110_01':part=/vmp|vlse/.test(key)||/fact-c-(18|19)/.test(id)?'borrelia':/lepto/.test(key)||/fact-c-20/.test(id)?'leptospira':'syphilis';break;
 case '261110_03':part=/cytoplasm|phagosome|anaplasma|ehrlichia/.test(key)||/fact-c-(15|16|17)/.test(id)?'cells':'vectors';break;
 }
 const result=`${doc}:${part}`;if(!parts[result])throw Error(`No focused set: ${q.id} / ${result}`);return result;
}
const groups={};
for(const q of TABLE_QUESTIONS){const doc=recallLecture(q),id=section(q,doc);(groups[id]||=[]).push(q);}
const ankiFocus={
 '261102_02:period':'Anki 중점 · 두 시간축',
 '261102_05:oral':'Anki 중점 · 경구 가능 약', '261102_05:bbb':'Anki 중점 · CSF 이행', '261102_05:pregnancy':'Anki 중점 · 임신·주의 약',
 '261105_02:media':'Anki 중점 · 배지 판독', '261105_02:antigen':'Anki 중점 · O/H/K', '261105_03:imvic':'Anki 중점 · 검사 부호',
 '261105_06:ebrb':'Anki 중점 · 감염/분열형', '261106_05:nocardia':'Anki 중점 · 분지형 감별',
 '261109_03:target':'Anki 중점 · 약제↔표적', '261109_05:gramnegative':'Anki 중점 · 효소↔약제', '261109_05:vre':'Anki 중점 · VRE 약제',
 '261110_03:vectors':'Anki 중점 · 세 칸 대응', '261112_01:protein':'Anki 중점 · 기능↔약제',
 '261112_03:serology':'Anki 중점 · 항원·항체 표', '261113_01:family':'Anki 중점 · 잠복 세포', '261104_03:viral':'Anki 중점 · 세포·검사법'
};
export const RECALL_SETS=Object.fromEntries(Object.entries(groups).map(([id,questions])=>{
 const sourceMap=new Map();
 for(const q of questions)for(const r of q.sourceRefs||[]){const doc=aliases[r.doc]&&r.doc!=='antibiotics'?aliases[r.doc]:r.doc;const pages=sourceMap.get(doc)||new Set();r.pages.forEach(p=>pages.add(p));sourceMap.set(doc,pages);}
 return [id,{...parts[id],questionIds:questions.map(q=>q.id),sourceRefs:[...sourceMap].map(([doc,pages])=>({doc,pages:[...pages].sort((a,b)=>a-b)})),examLinked:questions.some(q=>q.examRefs?.length),focus:ankiFocus[id]||'빈칸·대응 관계·짝 비교'}];
}));
export const RECALL_LECTURES=Object.fromEntries(Object.entries(LECTURES).map(([code,lecture])=>{
 const sets=Object.values(RECALL_SETS).filter(s=>s.lecture===code);
 return [code,{...lecture,sets:sets.map(s=>s.id),questionIds:sets.flatMap(s=>s.questionIds)}];
}));
export function recallProgress(bank,progress,ids){const chosen=new Set(ids),s=stats(bank.filter(q=>chosen.has(q.id)),progress);return {...s,percent:s.total?Math.round(s.attempted/s.total*100):0};}
