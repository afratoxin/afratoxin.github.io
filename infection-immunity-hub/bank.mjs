export const TOPICS = {
  oral: { title:'경구 투여', sub:'먹는 약으로 바꿀 수 있을까?', short:'경구', icon:'PO', pages:'36–40' },
  bbb: { title:'BBB 통과', sub:'감염 부위까지 도달할까?', short:'BBB', icon:'BBB', pages:'23–29' },
  pregnancy: { title:'임신 중 선택', sub:'숙주가 바뀌면 선택도 바뀐다', short:'임신', icon:'P', pages:'42–43' },
  cases: { title:'증례별 선택', sub:'미생물 × 감염 부위 × 숙주', short:'증례', icon:'Dx', pages:'6–49' }
};
export const SOURCES = {
  cipro:{title:'DailyMed · Ciprofloxacin 경구 생체이용률',url:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4af3894a-8945-4b2d-bdf6-a83bbd415b89'},
  vanco:{title:'DailyMed · 경구 Vancomycin의 적응증',url:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a078d9c2-f89c-4f9f-8ded-60ffb2983c3f'},
  cefixime:{title:'DailyMed · 경구 Cefixime 제형',url:'https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=068e6edd-a5fe-40d8-8dcf-ac82b78dced4'},
  metro:{title:'CDC · Metronidazole과 임신',url:'https://www.cdc.gov/std/treatment-guidelines/BV.htm'},
  pregnancy:{title:'ACOG · 임신 중 요로감염·신우신염',url:'https://www.acog.org/clinical/clinical-guidance/clinical-consensus/articles/2023/08/urinary-tract-infections-in-pregnant-individuals'},
  meningitis:{title:'Canadian Paediatric Society · 폐렴구균 수막염 감수성 기준',url:'https://cps.ca/en/documents/position/management-of-bacterial-meningitis'},
  typhi:{title:'CDC Yellow Book · 감수성 확인된 장티푸스',url:'https://www.cdc.gov/yellow-book/hcp/travel-associated-infections-diseases/typhoid-and-paratyphoid-fever.html'}
};
const items=[];
function mc(topic,id,stem,choices,answer,explanation,pages,note='',refs=[]) {items.push({id:`${topic}-${id}`,topic,format:'mcq',stem,choices,answer:choices.indexOf(answer),explanation,pages,note,refs});}
function ox(topic,id,stem,truth,explanation,pages,note='',refs=[]) {items.push({id:`${topic}-drug-${id}`,topic,format:'ox',stem,choices:['O · 그렇다','X · 아니다'],answer:truth?0:1,explanation,pages,note,refs});}

mc('oral','01','다음 중 경구 투여로 전신 감염 치료에 사용할 수 있는 항생제는?',
 ['Amoxicillin','Gentamicin','Vancomycin','Ceftriaxone','Imipenem'],'Amoxicillin',
 'Amoxicillin은 강의의 경구 흡수가 좋은 항생제 목록에 포함됩니다. 나머지는 전신 감염 치료 시 경구 제제로 그대로 대체할 수 없는 약물들입니다.',[40]);
mc('oral','02','비임신 성인에서 감수성과 경구 섭취가 확인되었다. 강의 증례 5에서 정주 치료 후 같은 성분의 경구 제제로 전환할 수 있는 약은?',
 ['Ciprofloxacin','Cefotaxime','Amikacin','Imipenem','Ceftriaxone'],'Ciprofloxacin',
 '강의는 ciprofloxacin 정주로 시작한 신우신염에서 임상 호전과 경구 섭취가 확보되면 먹는 약으로 바꾸는 과정을 설명합니다.',[34,38,39,40]);
mc('oral','03','강의의 경구 흡수가 좋은 항생제 목록에 포함되는 nitroimidazole계 약물은?',
 ['Metronidazole','Vancomycin','Amikacin','Cefotaxime','Meropenem'],'Metronidazole',
 'Metronidazole은 경구 흡수가 좋아 경구 투여가 가능한 약물로 제시됩니다. 경구 흡수 가능 여부와 특정 감염에 적합한지는 별도로 판단합니다.',[40]);
mc('oral','04','다음 중 강의에서 경구 생체이용률이 높은 lincosamide계 약물로 제시된 것은?',
 ['Clindamycin','Gentamicin','Ceftriaxone','Imipenem','Vancomycin'],'Clindamycin',
 'Clindamycin은 강의의 경구 투여 가능 목록에 있습니다. Gentamicin·vancomycin은 전신 치료 목적의 경구 흡수가 매우 낮습니다.',[40]);
mc('oral','05','강의에서 먹는 약으로 사용할 수 있는 복합 항균제는?',
 ['Trimethoprim/sulfamethoxazole (TMP/SMX)','Cefotaxime','Amikacin','Meropenem','Vancomycin'],'Trimethoprim/sulfamethoxazole (TMP/SMX)',
 '강의의 TMP/SXT는 trimethoprim/sulfamethoxazole을 뜻합니다. 경구 흡수는 좋지만, 해당 균의 감수성과 숙주 조건을 따로 확인해야 합니다.',[23,40]);
mc('oral','06','다음 중 경구 흡수가 좋은 tetracycline계 약물은?',
 ['Doxycycline','Gentamicin','Ceftriaxone','Imipenem','Vancomycin'],'Doxycycline',
 'Doxycycline은 경구 투여 가능 약물입니다. 경구 투여 가능하다는 사실이 임신 중에도 적합하다는 뜻은 아닙니다.',[40,43]);
mc('oral','07','경구 흡수가 매우 낮아 균혈증 치료를 위한 먹는 약으로 선택하면 부적절한 것은?',
 ['Vancomycin','Amoxicillin','Doxycycline','Clindamycin','TMP/SMX'],'Vancomycin',
 'Vancomycin은 경구 투여 시 전신 치료에 필요한 혈중 농도를 기대하기 어렵습니다. 장 안에서 작용시키려는 C. difficile 감염 치료는 별개의 사용 목적입니다.',[40],'경구 투여 자체가 불가능하다는 뜻이 아닙니다. 전신 치료와 장내 치료를 구분하세요.',['vanco']);
mc('oral','08','다음 중 강의 증례에서 주사로 사용하며, 같은 약을 먹는 제형으로 단순 교체할 수 없는 것은?',
 ['Imipenem','Amoxicillin','Ciprofloxacin','Metronidazole','Doxycycline'],'Imipenem',
 '증례의 imipenem은 정주 carbapenem입니다. 경구 전환은 해당 약물의 실제 제형·흡수와 원인균의 감수성을 함께 확인해야 합니다.',[34,40]);
ox('oral','09','Gentamicin — 전신 감염 치료를 위한 경구 투여가 가능한가?',false,
 'Gentamicin은 aminoglycoside로 경구 흡수가 매우 낮습니다. 전신 감염 치료용 경구 약으로 사용할 수 없습니다.',[40]);
ox('oral','10','Vancomycin — 경구 투여로 전신 감염을 치료할 수 있는가?',false,
 'Vancomycin은 경구 투여 시 전신 치료에 필요한 혈중 농도를 기대하기 어렵습니다. C. difficile 대장염에 장내 작용을 목적으로 경구 투여하는 것은 가능합니다.',[40],'전신 감염 치료를 묻는 문항입니다.',['vanco']);
ox('oral','11','Ceftriaxone — 같은 성분의 먹는 약으로 투여할 수 있는가?',false,
 'Ceftriaxone은 주사제로 사용하며 경구 ceftriaxone으로 전환할 수 없습니다. 경구 전환 시에는 감수성과 감염 부위에 맞는 다른 성분을 선택합니다.',[37,40]);
ox('oral','12','Amoxicillin — 전신 감염 치료에 경구 투여할 수 있는가?',true,
 'Amoxicillin은 강의의 경구 흡수가 좋은 약물 목록에 있습니다. 해당 균의 감수성과 감염 부위에 적합하다는 조건에서 경구 치료에 사용할 수 있습니다.',[40]);
ox('oral','13','Doxycycline — 경구 투여가 가능한 항생제인가?',true,
 'Doxycycline은 경구 흡수가 좋아 먹는 약으로 투여할 수 있습니다. 경구 투여 가능 여부와 임신 중 안전성은 구분합니다.',[40,43]);
ox('oral','14','Ciprofloxacin — 경구 투여가 가능한 항생제인가?',true,
 'Ciprofloxacin은 경구 제형을 사용할 수 있습니다. 강의 증례에서도 정주 치료 후 임상적으로 안정되고 식사가 가능해지면 경구 전환을 검토합니다.',[38,39,40],'강의 표의 >80%를 정확한 절대 생체이용률로 암기하지 않습니다. 허가사항의 수치는 약 70%입니다.',['cipro']);
ox('oral','15','Metronidazole — 경구 투여가 가능한 항생제인가?',true,
 'Metronidazole은 강의의 경구 흡수가 좋은 약물 목록에 포함됩니다. 감염 부위와 원인균에 적합한 경우 먹는 약으로 사용할 수 있습니다.',[40]);
ox('oral','16','Imipenem — 같은 성분의 먹는 약으로 투여할 수 있는가?',false,
 '강의 증례의 imipenem은 정주 carbapenem입니다. 경구 imipenem으로 단순 전환할 수 없습니다.',[34,40]);

mc('bbb','01','강의에서 MSSA 치료 약물 중 BBB 통과가 가능한 쪽으로 분류한 약은?',
 ['Nafcillin','Cefazolin','Gentamicin','Amikacin','Cephalexin'],'Nafcillin',
 '27쪽은 nafcillin을 BBB 통과가 좋은 쪽, cefazolin 같은 1세대 cephalosporin을 좋지 않은 쪽으로 구분합니다.',[27],'β-lactam의 CSF 도달은 수막 염증, 용량 등에 영향을 받습니다. 목록만으로 모든 CNS 감염의 약을 결정하지 않습니다.');
mc('bbb','02','다음 중 강의의 BBB 통과가 좋은 항생제 목록에 포함된 penicillin계 약물은?',
 ['Ampicillin','Gentamicin','Amikacin','Cefazolin','Cephalexin'],'Ampicillin',
 '강의 목록에는 nafcillin, penicillin, ampicillin이 포함됩니다. 다만 실제 치료에는 병원체의 감수성과 수막염 용량이 함께 중요합니다.',[26,27]);
mc('bbb','03','폐렴구균 수막염 증례에서 강의가 정답으로 제시한 약은?',
 ['Ceftriaxone','Ciprofloxacin','Erythromycin','Cefazolin','Gentamicin'],'Ceftriaxone',
 'Ceftriaxone은 3세대 cephalosporin으로, 감수성 있는 폐렴구균에 대한 살균 작용과 CSF 내 유효 농도를 고려한 강의의 선택입니다.',[24,26,27,29]);
mc('bbb','04','다음 중 강의에서 BBB 통과가 좋은 쪽으로 제시한 4세대 cephalosporin에 해당하는 것은?',
 ['Cefepime','Cefazolin','Cephalexin','Gentamicin','Amikacin'],'Cefepime',
 '강의는 3·4세대 cephalosporin을 BBB 통과가 좋은 범주에 둡니다. Cefepime은 4세대 약물이며, 1세대 cefazolin과 구분합니다.',[27]);
mc('bbb','05','다음 중 강의가 BBB 통과가 좋은 범주로 제시한 계열은?',
 ['Carbapenem','Aminoglycoside','1세대 cephalosporin','경구 흡수만 좋은 모든 항생제','모든 macrolide'],'Carbapenem',
 '강의는 carbapenem을 BBB 통과가 좋은 범주에 포함합니다. 계열 분류만으로 개별 약물의 수막염 적응증과 안전성까지 같다고 판단하지 않습니다.',[27]);
mc('bbb','06','다음 중 강의의 BBB 통과가 좋은 목록에 포함되는 것은?',
 ['Chloramphenicol','Cefazolin','Cephalexin','Gentamicin','Amikacin'],'Chloramphenicol',
 'Chloramphenicol은 27쪽의 BBB 통과가 좋은 목록에 있습니다. 투과가 좋다는 성질과 현재 특정 질환에서 우선 선택하는지는 다른 문제입니다.',[27]);
mc('bbb','07','다음 중 강의에서 BBB 통과가 좋지 않은 항생제로 분류한 것은?',
 ['Cefazolin','Nafcillin','Ampicillin','Ceftriaxone','Chloramphenicol'],'Cefazolin',
 'Cefazolin은 1세대 cephalosporin입니다. 강의는 1세대 cephalosporin을 BBB 통과가 좋지 않은 범주로 구분합니다.',[27]);
mc('bbb','08','CSF 도달이 충분하지 않아 강의의 BBB 통과가 좋지 않은 쪽에 속하는 약물은?',
 ['Gentamicin','Penicillin','Ampicillin','Cefotaxime','Chloramphenicol'],'Gentamicin',
 'Gentamicin은 aminoglycoside입니다. 강의는 aminoglycoside의 BBB 통과가 좋지 않다는 점을 강조합니다.',[27]);
ox('bbb','09','Cefazolin — BBB 통과가 좋은 항생제인가? (강의 분류)',false,
 'Cefazolin은 1세대 cephalosporin으로, 강의에서는 BBB 통과가 좋지 않은 쪽으로 분류합니다. Nafcillin과 구분해 기억합니다.',[27]);
ox('bbb','10','Gentamicin — BBB 통과가 좋은 항생제인가? (강의 분류)',false,
 'Gentamicin은 aminoglycoside로, 일반적인 전신 투여 시 CSF 도달이 좋지 않은 범주입니다.',[27]);
ox('bbb','11','Nafcillin — BBB 통과가 좋은 항생제인가? (강의 분류)',true,
 'Nafcillin은 강의의 BBB 통과가 좋은 목록에 직접 제시됩니다. 같은 MSSA 치료 약물이어도 cefazolin의 강의 분류와 다릅니다.',[27],'특히 β-lactam의 CSF 도달은 수막 염증과 용량 등에 영향을 받습니다.');
ox('bbb','12','Ampicillin — BBB 통과가 좋은 항생제인가? (강의 분류)',true,
 'Ampicillin은 nafcillin·penicillin과 함께 BBB 통과가 좋은 목록에 포함됩니다. 실제 CNS 감염 치료에는 수막염 용량과 감수성도 확인합니다.',[26,27]);
ox('bbb','13','Ceftriaxone — BBB 통과가 좋은 항생제인가? (강의 분류)',true,
 'Ceftriaxone은 3세대 cephalosporin으로 BBB 통과가 좋은 범주이며, 강의의 폐렴구균 수막염 증례에서 선택한 약물입니다.',[24,26,27]);
ox('bbb','14','Chloramphenicol — BBB 통과가 좋은 항생제인가? (강의 분류)',true,
 'Chloramphenicol은 강의의 BBB 통과가 좋은 목록에 직접 제시됩니다. 이 성질이 모든 CNS 감염에서의 우선 선택을 뜻하지는 않습니다.',[27]);
ox('bbb','15','Amikacin — BBB 통과가 좋은 항생제인가? (강의 분류)',false,
 'Amikacin은 aminoglycoside입니다. Gentamicin과 마찬가지로 강의의 BBB 통과가 좋지 않은 범주에 해당합니다.',[27]);
ox('bbb','16','Cephalexin — BBB 통과가 좋은 항생제인가? (강의 분류)',false,
 'Cephalexin은 1세대 cephalosporin으로 강의의 BBB 통과가 좋지 않은 범주입니다. 경구 투여 가능 여부와 BBB 통과 여부는 다릅니다.',[27]);

mc('pregnancy','01','강의 43쪽에서 임신 중 “비교적 안전”으로 분류한 계열은?',
 ['Penicillin','Aminoglycoside','Quinolone','Tetracycline','Tigecycline'],'Penicillin',
 '강의는 penicillin과 cephalosporin을 비교적 안전한 범주로 제시합니다. 감염 부위·감수성·알레르기 등은 별도로 확인합니다.',[43]);
mc('pregnancy','02','다음 중 임신부 신우신염에서 숙주 안전성을 고려해 검토할 수 있는 β-lactam계 선택지는?',
 ['Cefotaxime','Ciprofloxacin','Doxycycline','Tigecycline','Clarithromycin'],'Cefotaxime',
 'Cefotaxime은 cephalosporin계로 강의의 비교적 안전한 범주에 해당합니다. 실제 처방은 배양 감수성, 알레르기, 중증도 등을 확인합니다.',[34,42,43]);
mc('pregnancy','03','강의 43쪽의 분류에서 aminoglycoside가 속하는 범주는?',
 ['주의하여 이득과 위험을 평가','모든 상황에서 비교적 안전','태아 영향을 고려하지 않아도 됨','경구 흡수만 확인하면 됨','강의의 금기 목록과 완전히 같은 범주'],'주의하여 이득과 위험을 평가',
 'Aminoglycoside는 “주의”에 제시됩니다. 필요한 상황에서의 이득·위험 평가를 뜻하며, 강의의 금기 목록과 구분합니다.',[43]);
mc('pregnancy','04','강의 43쪽의 표기만을 묻는다. Metronidazole의 분류는?',
 ['주의','비교적 안전 목록에 명시','금기 목록에 명시','임신 중 사용 여부와 무관','항진균제이므로 표에 없음'],'주의',
 '강의 원문은 metronidazole을 주의에 넣었습니다. 이를 임신 중 절대금기로 바꾸어 암기하면 안 됩니다.',[43],'임상 보충: CDC는 임신 중 metronidazole의 태아 위험이 낮다고 설명합니다. 이 문항은 강의 표기를 구별하는 문제입니다.',['metro']);
mc('pregnancy','05','강의에서 quinolone계의 임신 중 분류는?',
 ['주의','모든 임신부의 우선 선택','임신 여부를 무시하고 선택','세팔로스포린과 같은 비교적 안전 목록','알레르기가 없으면 무조건 사용'],'주의',
 'Quinolone은 강의의 주의 범주에 포함됩니다. 비임신 성인에서 적합한 약이 임신부에서도 같은 우선순위를 갖는 것은 아닙니다.',[42,43]);
mc('pregnancy','06','강의 43쪽에서 sulfonamide계가 속하는 범주는?',
 ['주의','비교적 안전','항생제가 아니므로 제외','모든 상황의 절대금기라고 명시','임신 주수와 무관한 무조건 우선 선택'],'주의',
 'Sulfonamide는 강의의 주의 범주입니다. 주의 약물은 임신 시기, 적응증, 대체약, 이득과 위험을 함께 판단하는 대상으로 이해합니다.',[43]);
mc('pregnancy','07','다음 중 강의의 “금기” 목록에 이름이 직접 제시된 macrolide는?',
 ['Clarithromycin','Amoxicillin','Cefotaxime','Ampicillin','Ceftriaxone'],'Clarithromycin',
 'Clarithromycin은 강의가 임신 중 회피하도록 묶은 금기 목록에 있습니다. 이 문제는 강의의 분류를 묻습니다.',[43],'강의의 “금기”는 학습 분류입니다. 모든 임상 상황의 허가상 절대금기로 일반화하지 않습니다.');
mc('pregnancy','08','강의에서 임신 중 회피하는 약물로 제시한 erythromycin의 특정 제형은?',
 ['Erythromycin estolate','Amoxicillin','Cefotaxime','Ampicillin','Ceftriaxone'],'Erythromycin estolate',
 '강의는 erythromycin 전체가 아니라 erythromycin estolate를 명시합니다. 약물 계열 전체와 특정 제형을 구별합니다.',[43]);
ox('pregnancy','09','Amoxicillin — 임신부에게 비교적 안전하게 투여 가능한 항생제인가? (강의 분류)',true,
 'Amoxicillin은 penicillin계로 강의의 임신 중 비교적 안전 범주에 해당합니다. 감수성·감염 부위·알레르기는 별도로 확인합니다.',[43]);
ox('pregnancy','10','Cefotaxime — 임신부에게 비교적 안전하게 투여 가능한 항생제인가? (강의 분류)',true,
 'Cefotaxime은 cephalosporin계로 강의의 비교적 안전 범주입니다. 강의의 임신부 신우신염 증례와 연결해 기억합니다.',[34,42,43]);
ox('pregnancy','11','Doxycycline — 임신부에게 비교적 안전하게 투여 가능한 항생제인가? (강의 분류)',false,
 'Doxycycline은 tetracycline계입니다. 강의에서는 tetracycline을 임신 중 회피하는 금기 목록에 둡니다.',[40,43],'이 문항의 X는 강의의 비교적 안전 범주가 아니라는 뜻입니다.');
ox('pregnancy','12','Tigecycline — 임신부에게 비교적 안전하게 투여 가능한 항생제인가? (강의 분류)',false,
 'Tigecycline은 강의에서 tetracycline과 함께 임신 중 회피하는 금기 목록에 제시됩니다.',[43]);
ox('pregnancy','13','Clarithromycin — 임신부에게 비교적 안전하게 투여 가능한 항생제인가? (강의 분류)',false,
 'Clarithromycin은 강의의 임신 중 회피 목록에 직접 제시됩니다. Macrolide 전체를 같은 분류로 일반화하지 않습니다.',[43],'강의 분류를 묻습니다. 모든 임상 상황에서의 허가상 절대금기를 뜻하지 않습니다.');
ox('pregnancy','14','Erythromycin estolate — 임신부에게 비교적 안전하게 투여 가능한 항생제인가? (강의 분류)',false,
 '강의에서 회피 목록에 명시한 제형은 erythromycin estolate입니다. Erythromycin 전체와 특정 제형을 구분합니다.',[43]);
ox('pregnancy','15','Ampicillin — 임신부에게 비교적 안전하게 투여 가능한 항생제인가? (강의 분류)',true,
 'Ampicillin은 penicillin계로 강의의 임신 중 비교적 안전 범주에 해당합니다.',[43]);
ox('pregnancy','16','Ceftriaxone — 임신부에게 비교적 안전하게 투여 가능한 항생제인가? (강의 분류)',true,
 'Ceftriaxone은 cephalosporin계로 강의의 임신 중 비교적 안전 범주에 해당합니다. 투여 경로와 감염 부위 적합성은 별도로 판단합니다.',[43]);

mc('cases','01','증례 1: 50세 여성이 인후통·콧물·코막힘을 보인다. 체온 37.8℃, 인두 삼출물과 경부 림프절 압통은 없다. 강의에서 의도한 치료 원칙은?',
 ['바이러스성 상기도 감염을 고려하여 대증 치료·경과 관찰','Ceftriaxone을 모든 경우에 즉시 투여','Vancomycin 경구로 전신 치료','Imipenem을 반드시 2주 정주','Doxycycline을 반드시 사용'],'바이러스성 상기도 감염을 고려하여 대증 치료·경과 관찰',
 '이 증례는 감기에서 불필요한 항생제를 사용하지 않는 원칙을 보여 줍니다. 모든 감염 증상에 항생제가 필요한 것은 아닙니다.',[6,8]);
mc('cases','02','증례 2를 바탕으로, 종아리 피부 병변이 배농 가능한 농양으로 확인되었다. 항생제 선택과 함께 우선 고려할 처치는?',
 ['절개 및 배농 (I&D)','경구 vancomycin 단독','배농 없이 항생제만 계속 확대','BBB 투과가 가장 좋은 약만 선택','증상과 관계없이 항생제 1회 후 종료'],'절개 및 배농 (I&D)',
 '농양은 감염 부위 제거가 중요합니다. 강의는 경과 관찰, 배농·수술, 항생제를 각각 치료 수단으로 제시합니다. 항생제 병용 필요성은 중증도 등으로 판단합니다.',[7,8,12]);
mc('cases','03','증례 3: 폐렴구균 수막염이며 penicillin MIC가 0.12 μg/mL이다. 강의의 다섯 선택지 중 의도한 적절한 약물은?',
 ['Ceftriaxone','Ciprofloxacin','Erythromycin','Penicillin','Vancomycin'],'Ceftriaxone',
 '강의의 정답은 ceftriaxone입니다. CSF 유효 농도와 살균 작용을 고려하며, penicillin MIC 0.12는 수막염 기준의 감수성을 따로 해석해야 합니다.',[23,24,26,27,29],'강의는 ceftriaxone MIC를 별도로 제시하지 않았습니다. 실제로는 수막염 기준의 cephalosporin 감수성을 확인하고, 미확인 시 경험적 병용 여부를 판단합니다.',['meningitis']);
mc('cases','04','증례 4: 성인 장티푸스 환자에서 S. Typhi가 분리되었다. Cefazolin·cefuroxime·ciprofloxacin·gentamicin 모두 S로 주어졌다. 강의의 선택은?',
 ['Ciprofloxacin','Cefazolin','Cefuroxime','Gentamicin','경구 vancomycin'],'Ciprofloxacin',
 '세포 내에 존재하는 Salmonella까지 도달하는 약동학적 특성을 고려하여 강의는 ciprofloxacin을 선택합니다. S라는 표기만으로 모든 약이 동등하지는 않습니다.',[30,31,32],'문제는 ciprofloxacin 감수성이 확인된 성인이라는 조건입니다. 감수성을 모르는 실제 장티푸스에 무조건 적용하지 않습니다.',['typhi']);
mc('cases','05','증례 5: 비임신 45세 여성의 E. coli 신우신염이다. 구토가 있고 ciprofloxacin S가 확인되었다. 강의가 다음 장면에서 시작했다고 명시한 치료는?',
 ['Ciprofloxacin IV','Cefazolin PO','Vancomycin PO','항생제 없이 퇴원','Ciprofloxacin PO만 즉시 투여'],'Ciprofloxacin IV',
 '38쪽은 ciprofloxacin 정주로 치료를 시작했다고 명시합니다. 경구 섭취가 어렵거나 중증인 초기에는 주사 치료를 고려합니다.',[33,34,37,38],'이는 강의에서 진행한 선택을 묻는 문제입니다. 감수성 있는 다른 정주 약물이 모두 부적절하다는 뜻은 아닙니다.');
mc('cases','06','증례 5에서 ciprofloxacin IV 치료 후 의식·활력징후·검사 추세가 좋아지고 식사가 가능하다. 감수성도 유지된다. 다음 단계로 가장 적절한 것은?',
 ['Ciprofloxacin 경구 제제로의 전환 검토','치료 종료까지 모든 환자를 정주로만 유지','경구 vancomycin으로 대체','흡수 여부를 확인하지 않고 imipenem 경구로 대체','체온 한 번만 보고 즉시 모든 치료 종료'],'Ciprofloxacin 경구 제제로의 전환 검토',
 '정주에서 경구 전환은 환자의 임상 안정과 적절한 경구 약물의 확보를 기준으로 판단합니다. 정주 치료 기간만으로 퇴원일을 고정하지 않습니다.',[38,39,40]);
mc('cases','07','증례 6: 신우신염 환자가 30세 임신부다. 아래 약물 모두의 감수성이 확인되고 β-lactam 중증 알레르기는 없다고 할 때, 강의의 숙주 안전성 분류상 우선 검토할 것은?',
 ['Cefotaxime IV','Ciprofloxacin PO','Doxycycline PO','Tigecycline IV','Clarithromycin PO'],'Cefotaxime IV',
 '임신부에서는 비교적 안전한 cephalosporin을 검토할 수 있습니다. 발열·구토·CVA 압통이 있는 신우신염은 초기 정주 치료와 숙주 조건을 함께 고려합니다.',[34,37,42,43],'임신 중 신우신염은 초기 입원 치료를 권고하는 ACOG 자료도 참고했습니다.',['pregnancy']);
mc('cases','08','증례 7: 감수성 있는 ciprofloxacin으로 신우신염 치료를 시작했지만 5일째 발열과 전신증상이 지속된다. 가장 적절한 다음 판단은?',
 ['신농양·신장주위농양·요로폐쇄와 약제 문제 등을 재평가','내성으로 단정하고 배양 없이 항생제만 확대','체온과 무관하게 경구로 바꾸어 퇴원','감수성 S이므로 추가 평가 불필요','경구 vancomycin을 전신 감염 치료로 추가'],'신농양·신장주위농양·요로폐쇄와 약제 문제 등을 재평가',
 '강의는 치료 72시간 이후에도 호전이 없으면 농양과 해부학적 이상을 생각하도록 합니다. 감수성만으로 치료 실패의 모든 원인을 설명할 수 없습니다.',[45,46,47]);
mc('cases','09','증례 7의 추가 검사에서 배농이 필요한 신농양이 확인되었다. 강의에서 제시한 치료 조합은?',
 ['배농과 항균제 치료','배농 없이 경구 항생제 1회만','항생제를 모두 중단하고 무조건 관찰','BBB 투과가 좋은 약만 추가','모든 농양에서 항생제만 확대하면 충분'],'배농과 항균제 치료',
 '신농양은 source control이 중요합니다. 47쪽은 배농과 장기간 항균제 투여를 제시합니다. 실제 기간은 감염 경과와 배농 상태 등에 따라 정합니다.',[47]);
mc('cases','10','증례 8: 최근 항생제를 사용한 77세 여성이 하루 10회 이상 설사, 발열, 복통과 저혈압을 보인다. 강의가 강조하는 항생제 관련 합병증은?',
 ['Clostridioides difficile 감염','단순 감기','비감염성 비염으로 확정','증상이 없는 집락화만 존재','약물 흡수가 좋다는 정상 반응'],'Clostridioides difficile 감염',
 '최근 항생제 노출 후 심한 설사와 대장염 소견은 C. difficile 감염을 의심하게 합니다. 저혈압과 복막 자극 소견은 중증 상태의 평가가 필요함을 뜻합니다.',[48,49]);
mc('cases','11','증례 8과 연결한 투여 경로 문제다. C. difficile 대장염에서 경구 vancomycin을 사용할 수 있는 이유는?',
 ['장내에 약물을 전달하여 국소적으로 작용시키기 때문','경구 투여가 균혈증에 가장 높은 혈중 농도를 만들기 때문','BBB를 통과하기 때문','모든 설사에 항생제가 필요하기 때문','정주 vancomycin과 장내 전달이 완전히 같기 때문'],'장내에 약물을 전달하여 국소적으로 작용시키기 때문',
 '낮은 전신 흡수는 장내 치료 목적과 양립합니다. 이 문항은 경구 vancomycin의 작용 부위만 묻습니다.',[40,48,49],'증례 8의 쇼크 환자에 대한 전체 처방을 경구 약 하나로 단순화하는 문제는 아닙니다.',['vanco']);
mc('cases','12','증례 3의 폐렴구균 수막염에서 검사표의 “penicillin S” 표기만으로 penicillin을 고르면 안 되는 핵심 이유는?',
 ['수막염 기준의 감수성과 CSF 유효 농도를 따로 확인해야 해서','Penicillin은 항균 작용이 전혀 없어서','모든 penicillin은 BBB를 절대 통과하지 못해서','수막염은 항생제로 치료하지 않아서','경구 흡수만 좋으면 충분해서'],'수막염 기준의 감수성과 CSF 유효 농도를 따로 확인해야 해서',
 '동일 병원체라도 감염 부위에 맞는 breakpoint가 중요합니다. 이 증례의 penicillin MIC 0.12 μg/mL는 수막염 기준으로 충분한 감수성이라고 볼 수 없습니다.',[23,24,27,29],'Penicillin 자체를 수막염에 절대 사용할 수 없는 약으로 외우지 않습니다.',['meningitis']);

ox('cases','13','Ceftriaxone — 강의의 폐렴구균 수막염 증례에서 선택할 약물인가? (Penicillin MIC 0.12 μg/mL)',true,
 '강의가 선택한 약물은 ceftriaxone입니다. 수막염에서는 감수성뿐 아니라 CSF 내 유효 농도와 살균 작용을 고려합니다.',[23,24,26,27,29],'강의 선택을 묻습니다. 실제로는 수막염 기준의 cephalosporin 감수성을 확인하며, 감수성 미확인 시 경험적 병용 여부를 판단합니다.',['meningitis']);
ox('cases','14','Penicillin — 폐렴구균 수막염에서 MIC가 0.12 μg/mL일 때 단독 표적 치료제로 선택할 수 있는가?',false,
 '이 MIC는 폐렴구균 수막염 기준에서 penicillin 감수성 범위를 넘습니다. Penicillin 자체의 BBB 통과 가능 여부와 감수성 기준을 구분합니다.',[23,24,27,29],'BBB를 통과하는 약이라고 이 균주에도 사용할 수 있는 것은 아닙니다.',['meningitis']);
ox('cases','15','Erythromycin — 강의의 폐렴구균 수막염 증례에서 적합한 약물인가? (검사 결과 S)',false,
 '강의 증례에서는 S로 제시되어도 CSF 내 유효 농도 등의 조건을 충족하는 치료제로 선택하지 않습니다. 강의의 선택은 ceftriaxone입니다.',[23,24,26,29]);
ox('cases','16','Ciprofloxacin — 감수성이 확인된 비임신 성인의 장티푸스에서 선택 가능한가?',true,
 '강의에서는 S. Typhi의 세포 내 위치와 ciprofloxacin의 세포 내 도달을 고려해 선택합니다.',[30,31,32],'감수성이 확인된 조건입니다. 감수성을 모르는 실제 장티푸스에 대한 일괄적인 경험적 선택은 아닙니다.',['typhi']);
ox('cases','17','Gentamicin — 강의의 장티푸스 증례에서 적합한 치료 약물인가? (검사 결과 S)',false,
 'Gentamicin은 aminoglycoside로 세포 내 도달이 좋지 않습니다. 세포 내에 존재하는 Salmonella를 치료할 때 검사상 S만으로 선택하지 않으며, 강의는 ciprofloxacin을 선택합니다.',[30,31,32]);
ox('cases','18','Cefuroxime — 강의의 장티푸스 증례에서 적합한 치료 약물인가? (검사 결과 S)',false,
 'Cefuroxime은 2세대 cephalosporin입니다. 강의는 1·2세대 cephalosporin의 세포 내 도달 한계를 비교하며 ciprofloxacin을 선택합니다.',[30,31,32]);
ox('cases','19','Ciprofloxacin IV — 구토가 있는 비임신 성인의 E. coli 신우신염에서 초기 치료로 선택 가능한가? (Ciprofloxacin S)',true,
 '강의 증례 5는 ciprofloxacin 정주로 치료를 시작합니다. 구토로 경구 섭취가 어려운 초기에는 정주 경로를 고려합니다.',[33,34,37,38]);
ox('cases','20','Ciprofloxacin PO — 정주 치료 후 안정되고 식사가 가능한 비임신 신우신염 환자의 경구 전환 약으로 선택 가능한가? (Ciprofloxacin S)',true,
 'Ciprofloxacin은 경구 제형이 있고 흡수가 좋습니다. 강의에서는 임상적으로 안정되고 경구 섭취가 가능해지면 경구 전환을 검토합니다.',[38,39,40]);
ox('cases','21','Amikacin — 강의의 E. coli 신우신염 증례에서 경구 전환 약물로 사용할 수 있는가? (Amikacin S)',false,
 'Amikacin은 aminoglycoside로 경구 흡수가 매우 낮습니다. 검사상 S여도 먹는 amikacin으로 전환할 수 없으며, 경구 전환에는 실제로 흡수되는 약물이 필요합니다.',[34,39,40]);
ox('cases','22','Cefotaxime IV — 임신부의 E. coli 신우신염에서 선택 가능한가? (Cefotaxime S, 중증 β-lactam 알레르기 없음)',true,
 'Cefotaxime은 cephalosporin계로 강의의 임신 중 비교적 안전 범주입니다. 발열·구토가 있는 임신부 신우신염의 초기 정주 치료에 검토할 수 있습니다.',[34,37,42,43],'임신 중 신우신염의 초기 입원·정주 치료는 ACOG 자료도 참고했습니다.',['pregnancy']);
ox('cases','23','Doxycycline — 강의의 임신부 신우신염에서 숙주 안전성상 우선 선택할 약물인가?',false,
 'Doxycycline은 tetracycline계로 강의의 임신 중 회피 목록에 해당합니다. 임신부 증례에서는 감수성과 알레르기를 확인한 cephalosporin계 등을 검토합니다.',[42,43]);
ox('cases','24','Vancomycin PO — C. difficile 대장염에서 장내 치료 목적으로 투여 가능한가?',true,
 '경구 vancomycin은 장내에 약물을 전달해 작용시킬 수 있습니다. 전신 감염 치료를 위한 경구 투여 가능 여부를 묻는 문항과 답이 다릅니다.',[40,48,49],'이 문항은 경구 경로의 사용 가능성을 묻습니다. 쇼크를 동반한 증례 8의 전체 치료를 경구 약 하나로 한정하지 않습니다.',['vanco']);

export const QUESTIONS=Object.freeze(items.map(q=>Object.freeze(q)));
