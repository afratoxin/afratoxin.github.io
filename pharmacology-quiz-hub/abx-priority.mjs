// Scope reviewed against the separately supplied 7-page '# 약리학(1).pdf'.
// Page numbers are physical PDF pages. Past-exam references select emphasis;
// mechanisms remain those verified in the individual 23–27 lecture PDFs.
// The summary's inaccurate clinical/target statements are not copied as facts.
const groups=[
 [1,['bacitracin','cycloserine','metronidazole']],
 [2,['penicillin-g','penicillin-v','oxacillin','ampicillin','amoxicillin','piperacillin','ticarcillin','clavulanic-acid','sulbactam']],
 [3,['aztreonam','meropenem','gentamicin']],
 [4,['sulfamethoxazole','trimethoprim','ciprofloxacin','levofloxacin','moxifloxacin']],
 [5,['tetracycline','doxycycline','minocycline','demeclocycline','erythromycin','clarithromycin','azithromycin','clindamycin','chloramphenicol']],
 [6,['vancomycin','polymyxin-b','isoniazid','rifampin','ethambutol','pyrazinamide']],
 [7,['amphotericin-b','nystatin','ketoconazole','itraconazole','fluconazole','voriconazole','posaconazole','acyclovir','tenofovir','lamivudine','ribavirin','oseltamivir']]
];
const exam={
 'metronidazole':'2019년 26강 R4',
 'piperacillin':'2022년 24강 55번 · 2021년 63번',
 'ticarcillin':'2022년 24강 55번 · 2021년 63번',
 'gentamicin':'2025년 25강 79번 · 2019년 73·74번',
 'sulfamethoxazole':'2025년 25강 81번 · 2022년 34번(설파계)',
 'trimethoprim':'2025년 25강 81번 · 2022년 34번',
 'ciprofloxacin':'2021년 25강 68번',
 'levofloxacin':'2021년 25강 68번 · 2019년 70번',
 'moxifloxacin':'2020년 25강 70번',
 'tetracycline':'2020년 26강 71번',
 'erythromycin':'2023년 26강 54번 · 2021년 70번',
 'chloramphenicol':'2023년 26강 53번 · 2020년 R4',
 'vancomycin':'2019년 26강 R3',
 'polymyxin-b':'2025년 23강 70번 · 2023년 26강 52번',
 'isoniazid':'2025년 27강 97번 · 2023년 55번',
 'rifampin':'2025년 27강 97번 · 2023년 55번',
 'amphotericin-b':'2025년 27강 98번 · 2022년 8번',
 'nystatin':'2025년 27강 98번',
 'itraconazole':'2025년 27강 98번',
 'voriconazole':'2025년 27강 98번 · 2022년 8번',
 'tenofovir':'2023년 27강 56번 · 2022년 35번',
 'ribavirin':'2025년 27강 99번',
 'oseltamivir':'2025년 27강 99번 · 2023년 56번'
};
export const ABX_PRIORITY=Object.fromEntries(groups.flatMap(([page,ids])=>ids.map(id=>[id,{
 weight:exam[id]?3:2,
 sources:[`별도 정리 PDF ${page}쪽`,...(exam[id]?[`족보 ${exam[id]}`]:[])]
}])));
export const ABX_PRIORITY_SCOPE='족보·별도 PDF 핵심';

// The stem and answer are preserved; only unneeded example names are removed.
export const ABX_CORE_REVISIONS={
 'core-mrsa-pbp2a':{note:'mecA가 암호화하는 PBP2a는 대부분의 β-lactam에 대한 친화성이 낮다. MRSA의 표적 변화와 β-lactamase에 의한 약물 분해를 구별한다. 예외 약물이 있으므로 모든 β-lactam이 항상 무효라고 확대하지 않는다.'},
 'core-antipseudomonal-penicillin':{options:['Ticarcillin','Penicillin V','Oxacillin','Ampicillin','Amoxicillin'],note:'Piperacillin과 ticarcillin은 항녹농균 penicillin이다. Penicillin V는 천연군, oxacillin은 항포도알균군, ampicillin·amoxicillin은 aminopenicillin이다.'},
 'core-ceph-first':{subject:'ceph-first',stem:'1세대 cephalosporin의 대표적인 항균범위 경향은?',note:'1세대 cephalosporin은 그람양성균 활성이 중심이고 그람음성균 범위는 제한적이다. MRSA나 녹농균에 대한 활성을 세대 전체의 특징으로 보지 않는다.'},
 'core-ceph-second':{subject:'ceph-second',stem:'1세대와 비교하여 2세대 cephalosporin에서 강조하는 항균범위 변화는?'},
 'core-ceftaroline-spectrum':{subject:'ceph-fifth',stem:'5세대 cephalosporin을 대표적인 3세대 약물과 구별하는 핵심 항균범위 특징은?',note:'강의에서 5세대의 구별점은 MRSA에 대한 활성이다. 모든 세대·모든 약물이 녹농균이나 ESBL 생성균에 작용한다고 일반화하지 않는다.'},
 'core-aztreonam-class':{options:['Aztreonam','Meropenem','Amoxicillin','Gentamicin','Vancomycin'],note:'Aztreonam은 monobactam으로 PBP를 억제한다. Meropenem은 carbapenem, amoxicillin은 penicillin이다. Gentamicin은 30S, vancomycin은 세포벽 전구체에 작용한다.'},
 'bac-sulfa-crystals':{subject:'sulfonamide-crystalluria'},
 'bac-mino-vestibular':{options:['Minocycline','Doxycycline','Demeclocycline','Tetracycline','Erythromycin']},
 'bac-polymyxin-membrane':{stem:'Polymyxin B의 항균 기전으로 가장 적절한 것은?'},
 'extra-rifampin-fluid':{options:['Rifampin','Isoniazid','Ethambutol','Pyrazinamide','Acyclovir']},
 'extra-ethambutol-vision':{options:['Ethambutol - 시신경염','Isoniazid - 청색 눈물','Rifampin - B6 결핍','Pyrazinamide - 회색치아','Acyclovir - 적색 눈물']},
 'extra-pyrazinamide-energy':{note:'강의는 pyrazinamide의 정확한 기전은 완전히 규명되지 않았다고 밝히면서 막전위와 에너지 생산 교란을 제시한다. RNA polymerase나 arabinosyl transferase의 직접 억제와 구별한다.'},
 'clinical-abx-dna-radicals':{options:['Ciprofloxacin','Rifampin','Gentamicin','Metronidazole','Amoxicillin'],details:[
  'Ciprofloxacin: DNA gyrase·topoisomerase IV 억제제로 자유라디칼 생성 기전과 다르다.',
  'Rifampin: 세균 RNA polymerase를 억제하여 전사를 방해한다.',
  'Gentamicin: 30S 리보솜을 통해 단백질 합성을 억제한다.',
  'Metronidazole: 자유라디칼 생성에 의한 DNA 손상이 발문의 기전이다.',
  'Amoxicillin: β-lactam으로 PBP를 억제하여 세포벽 합성을 방해한다.'
 ]},
 'clinical-abx-b6-neuropathy':{options:['Rifampin','Ethambutol','Pyrazinamide','Amphotericin B','Isoniazid'],details:[
  'Rifampin: RNA polymerase 억제제이며 효소 유도와 붉은색 소변·눈물을 연결한다.',
  'Ethambutol: Arabinosyl transferase 억제제이며 대표적인 독성은 시신경염이다.',
  'Pyrazinamide: Pyrazinoic acid로 전환되며 간독성·관절통을 연결한다.',
  'Amphotericin B: Ergosterol에 결합하는 항진균제이며 신독성이 중요하다.',
  'Isoniazid: B6 결핍과 말초신경염이 발문의 단서다.'
 ]}
};
