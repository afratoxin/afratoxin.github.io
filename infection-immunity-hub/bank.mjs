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
function ox(topic,id,stem,truth,explanation,pages,note='',refs=[]) {items.push({id:`${topic}-${id}`,topic,format:'ox',stem,choices:['O · 맞다','X · 틀리다'],answer:truth?0:1,explanation,pages,note,refs});}

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
ox('oral','09','Gentamicin 같은 aminoglycoside는 경구 흡수가 좋아 전신 감염의 정주 치료를 먹는 약으로 그대로 대체하기 좋다.',false,
 'Aminoglycoside는 장에서 잘 흡수되지 않습니다. 전신 감염 치료에서 경구 제제로 정주 제제를 그대로 대체할 수 없습니다.',[40]);
ox('oral','10','Vancomycin은 경구 흡수가 낮으므로 어떤 감염에서도 경구로 사용하지 않는다.',false,
 '전신 감염의 치료와 장내 치료를 혼동한 설명입니다. 경구 vancomycin은 C. difficile 관련 장염 등에서 장내 작용을 위해 사용합니다.',[40],'혈중 농도를 올리려는 목적과 장 안에 약물을 전달하려는 목적이 다릅니다.',['vanco']);
ox('oral','11','주사용 ceftriaxone은 3세대 세팔로스포린이므로 경구 ceftriaxone으로 그대로 전환할 수 있다.',false,
 '주사용 ceftriaxone을 먹는 ceftriaxone으로 단순 전환할 수 없습니다. 다른 경구 항생제로 전환하려면 감수성과 감염 부위에 맞는 약제를 다시 선택해야 합니다.',[37,40]);
ox('oral','12','강의 40쪽의 표를 근거로 모든 2·3세대 세팔로스포린에는 경구 제형이 없다고 일반화할 수 있다.',false,
 '세대 전체로 일반화하면 안 됩니다. 예를 들어 cefixime은 경구 제형이 있는 3세대 약물입니다. 개별 약물과 제형을 구별합니다.',[40],'강의의 단순화된 표에 대한 보충 문항입니다.',['cefixime']);
ox('oral','13','Doxycycline이 경구 투여 가능하더라도, 임신부에게 적합한 약인지 별도로 검토해야 한다.',true,
 '투여 경로와 숙주 안전성은 서로 다른 판단 축입니다. 강의는 tetracycline계 약물을 임신 중 회피하는 범주로 분류합니다.',[40,43]);
ox('oral','14','강의에서는 의식과 활력징후가 안정되고 검사 결과가 호전되며 경구 섭취가 가능하면 정주에서 경구로의 전환을 검토한다.',true,
 '39쪽은 의식, 활력징후, 검사 추세, 정주 치료 경과, 경구 섭취를 함께 확인하도록 제시합니다. 약물 자체의 경구 흡수와 감수성도 필요합니다.',[39,40]);
ox('oral','15','강의 표의 “>80%”를 그대로 적용하여 ciprofloxacin의 절대 경구 생체이용률은 반드시 80%를 넘는다고 외워도 된다.',false,
 '경구 투여 가능하다는 핵심을 기억하되 수치는 구별합니다. 허가사항의 ciprofloxacin 절대 경구 생체이용률은 약 70%입니다.',[40],'강의 표의 수치를 모든 열거 약물에 일괄 적용하지 않도록 보충했습니다.',['cipro']);
ox('oral','16','환자가 음식을 삼킬 수 있다는 사실 하나만 확인하면 감염 부위·혈역학적 상태와 관계없이 즉시 경구 항생제로 바꿀 수 있다.',false,
 '먹을 수 있는지는 한 조건일 뿐입니다. 쇼크·흡수 장애·높은 조직 농도가 필요한 감염 등을 확인하고, 임상적 안정과 적절한 경구 약제 확보를 함께 판단합니다.',[37,39]);

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
ox('bbb','09','강의의 분류에서 1세대 cephalosporin은 BBB 통과가 좋지 않은 쪽이다.',true,
 '1세대 cephalosporin과 aminoglycoside가 좋지 않은 쪽에 제시됩니다. 대표적으로 cefazolin과 gentamicin을 연결합니다.',[27]);
ox('bbb','10','Aminoglycoside는 혈중 농도만 높이면 보통의 전신 투여로 CSF에도 충분히 도달한다고 간주할 수 있다.',false,
 '혈청 농도와 감염 부위 농도는 같지 않습니다. Aminoglycoside의 CSF 침투는 좋지 않아, 혈중 감수성만으로 수막염 약제로 선택할 수 없습니다.',[27,31]);
ox('bbb','11','Penicillin은 BBB를 전혀 통과하지 못하므로 감수성이 충분히 확인된 경우에도 수막염에 사용할 수 없는 약이다.',false,
 'Penicillin 자체를 BBB 통과 불가로 외우면 틀립니다. 강의는 통과 가능한 쪽으로 분류하며 실제 사용은 수막염 기준의 감수성과 용량을 확인합니다.',[23,24,27],'강의 증례의 MIC 0.12 μg/mL와 penicillin 일반의 성질을 구별하세요.',['meningitis']);
ox('bbb','12','“BBB 통과가 좋다”는 분류는 정상 수막과 염증이 있는 수막에서의 투과가 언제나 동일하다는 뜻이다.',false,
 '수막 염증의 유무는 특히 β-lactam의 CSF 도달에 영향을 줍니다. 강의의 분류는 CNS 감염에서 조직 도달을 고려하라는 학습 틀로 이해합니다.',[26,27,29]);
ox('bbb','13','수막염에서는 항균 작용뿐 아니라 CSF 내 농도가 원인균의 MIC를 충분히 넘는지도 고려한다.',true,
 '26쪽은 살균력과 CSF 투과를 함께, 29쪽은 혈액·CSF 농도와 MIC의 관계를 보여 줍니다.',[26,29]);
ox('bbb','14','경구 흡수가 좋은 항생제라면 BBB 통과도 반드시 좋다고 판단할 수 있다.',false,
 '경구 흡수와 BBB 투과는 별도의 약동학적 특성입니다. 장에서 혈액으로 도달하는 것과 혈액에서 CSF로 도달하는 것을 나누어 판단합니다.',[27,40]);
ox('bbb','15','배양 결과에 S라고 적혀 있으면 감염 부위와 무관하게 그 항생제를 선택하면 된다.',false,
 '감염 부위 농도와 해당 감염에 맞는 감수성 기준을 함께 봅니다. 수막염과 비수막염에서 같은 약·균의 감수성 해석이 달라질 수 있습니다.',[23,24,29,31],'폐렴구균 수막염에 비수막염 기준을 그대로 적용하지 않습니다.',['meningitis']);
ox('bbb','16','강의의 BBB 분류는 CNS 감염 약제 선택에서 중요하지만, BBB 투과가 낮다는 이유만으로 모든 다른 부위 감염에도 부적합한 약이라고 할 수는 없다.',true,
 '항생제는 필요한 감염 부위에 도달하면 됩니다. 예를 들어 CNS 밖의 감염에서는 해당 조직의 농도·감수성·숙주 조건을 판단합니다.',[12,27,31]);

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
ox('pregnancy','09','Penicillin계는 강의에서 비교적 안전한 약물로 분류하므로 모든 임신부에게 감수성·알레르기 확인 없이 사용해도 된다.',false,
 '비교적 안전하다는 분류가 모든 조건에서의 적합성을 보장하지는 않습니다. 감수성, 감염 부위, 알레르기 등을 함께 판단합니다.',[36,43,51]);
ox('pregnancy','10','Cephalosporin계는 강의에서 임신 중 비교적 안전한 항생제 범주에 포함된다.',true,
 '강의의 비교적 안전 범주는 penicillin과 cephalosporin입니다. 숙주가 임신부로 바뀐 증례 6의 핵심입니다.',[42,43]);
ox('pregnancy','11','Tetracycline계는 강의에서 임신 중 회피하는 목록에 포함된다.',true,
 '43쪽은 tetracycline을 금기 목록에 제시합니다. 경구 흡수가 좋은 doxycycline도 임신이라는 숙주 조건을 별도로 확인해야 합니다.',[40,43]);
ox('pregnancy','12','Tigecycline은 강의 43쪽에서 tetracycline과 함께 임신 중 회피하는 목록에 제시된다.',true,
 '강의 원문은 “Tetracycline or Tigecycline”을 금기 목록에 둡니다. 비교적 안전 범주와 구분해 기억합니다.',[43]);
ox('pregnancy','13','강의의 clarithromycin·erythromycin estolate 표기를 근거로 모든 macrolide가 임신 중 절대금기라고 일반화할 수 있다.',false,
 '강의는 특정 약물·제형을 열거합니다. 계열 전체의 절대금기로 확대하면 안 됩니다.',[43]);
ox('pregnancy','14','강의의 “주의”와 “금기”를 모두 같은 뜻의 “임신 중 어떤 상황에서도 투여 불가”로 외우면 된다.',false,
 '강의 자체가 비교적 안전·주의·금기를 나누고 있습니다. 특히 주의는 이득·위험과 대체약을 평가해야 한다는 의미로 구분합니다.',[43]);
ox('pregnancy','15','Metronidazole은 강의의 “주의” 범주이므로 임신 중 모든 적응증에서 절대 사용해서는 안 되는 약이다.',false,
 '주의를 절대금기로 바꾼 설명입니다. 강의 표기와 실제 적응증별 안전성 근거를 구별해야 합니다.',[43],'CDC 임신 관련 설명을 보충 출처에서 확인할 수 있습니다.',['metro']);
ox('pregnancy','16','원인균과 감염 부위가 같아도 임신 여부가 달라지면 항생제 선택을 다시 검토해야 한다.',true,
 '감염병 진단의 세 축은 감염 부위, 미생물, 숙주입니다. 증례 6은 신우신염이라는 상황에 임신이라는 숙주 변화를 추가합니다.',[5,42,43,51]);

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

ox('cases','13','증례 1처럼 바이러스성 상기도 감염이 의심되는 상황에서도 감염 증상만 있으면 항생제가 항상 필요하다.',false,
 '강의 첫 증례는 불필요한 항생제 사용을 피하는 원칙입니다. 감염병 치료에는 경과 관찰과 대증 치료도 있습니다.',[6,8]);
ox('cases','14','배농 가능한 농양에서는 항생제의 시험관 내 감수성만 확인하면 배농의 필요성을 무시해도 된다.',false,
 '농양은 항생제 도달과 source control 문제가 있습니다. 필요 시 배농이나 수술로 감염 부위를 처리해야 합니다.',[7,8,12,31,47]);
ox('cases','15','폐렴구균 수막염에서 erythromycin S가 제시되었다는 이유만으로 CSF 도달을 고려하지 않고 erythromycin을 선택해도 된다.',false,
 '검사상 감수성이 있어도 감염 부위에서 유효 농도가 확보되어야 합니다. 강의 증례는 ceftriaxone을 정답으로 제시합니다.',[23,24,26,29]);
ox('cases','16','장티푸스 증례에서 네 약 모두 S이더라도 세포 내 분포가 다르므로 약제 선택은 달라질 수 있다.',true,
 'Salmonella의 세포 내 위치와 약물의 세포 내 도달을 함께 봅니다. 강의는 1·2세대 cephalosporin 및 aminoglycoside와 fluoroquinolone을 비교합니다.',[30,31,32]);
ox('cases','17','장티푸스는 감수성 결과·지역 내성과 관계없이 언제나 ciprofloxacin을 경험적으로 선택하면 된다.',false,
 '강의 문제는 감수성이 주어진 상황입니다. 실제 경험적 선택은 지역·시대별 내성, 역학 정보, 숙주 조건에 따라 달라집니다.',[21,30],'CDC 역시 감수성에 따른 선택을 강조합니다.',['typhi']);
ox('cases','18','증례 5의 cefazolin은 R로 제시되었으므로 다른 조건이 같을 때 감수성 있는 약을 두고 cefazolin을 선택할 근거가 없다.',true,
 '34쪽은 cefazolin R, cefotaxime·ciprofloxacin·imipenem·amikacin S를 제시합니다. 치료는 감수성과 감염 부위·숙주 조건을 함께 봅니다.',[34,36]);
ox('cases','19','신우신염 환자의 퇴원·경구 전환 시점은 증례에 나온 “14일”을 기준으로 반드시 고정한다.',false,
 '38–39쪽의 학습 포인트는 임상 호전 후 경구 전환입니다. 입원 기간과 총 항생제 기간은 구별하며, 총 치료기간도 약물·감염·숙주에 따라 달라집니다.',[38,39,50]);
ox('cases','20','동일한 E. coli 신우신염이라도 환자가 임신부라면 비임신 성인과 약물 선택을 다시 검토해야 한다.',true,
 '증례 5와 6은 숙주 조건의 중요성을 대비합니다. 임신 시 안전성을 고려해 비교적 안전한 β-lactam계 약물을 검토합니다.',[33,34,42,43]);
ox('cases','21','항생제 투여 후 5일째 발열이 지속되면 내성 하나만 원인으로 생각하면 된다.',false,
 '농양·괴사, 용량, 상호작용, 면역 이상, 비감염성 질환, 약열, C. difficile 등 여러 원인을 감별해야 합니다.',[45,46,47]);
ox('cases','22','신우신염에서 72시간 이후에도 호전이 없으면 신농양이나 요로폐쇄 등 해부학적 문제를 고려한다.',true,
 '강의 47쪽의 핵심입니다. 잘 듣는 항생제를 골랐어도 농양이나 폐쇄가 해결되지 않으면 치료 반응이 좋지 않을 수 있습니다.',[47]);
ox('cases','23','최근 항생제 노출 후 심한 설사·대장염이 생기면 원래 감염의 악화뿐 아니라 C. difficile 감염도 고려해야 한다.',true,
 '증례 8은 항생제 사용의 손해와 이차 합병증을 보여 줍니다. 항생제 사용 후 새로 생긴 문제를 별도로 평가합니다.',[46,48,49]);
ox('cases','24','균이 확인된 뒤에는 감염 부위·숙주에 적합한 범위에서 좁은 항균 범위, 적은 부작용, 투여 편의와 경구 전환 가능성도 고려한다.',true,
 '36쪽은 항균 범위, 부작용, 비용, 투여 편의, 경구 가능성을 제시합니다. 이 원칙은 원인균에 효과적이고 필요한 부위에 도달하는 약을 전제로 합니다.',[36,51]);

export const QUESTIONS=Object.freeze(items.map(q=>Object.freeze(q)));
