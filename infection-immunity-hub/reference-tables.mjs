import {emphasizeFeedback,emphasizePrompt} from './emphasis.mjs?v=20261114b';
export const ANTIBIOTIC_TABLES=[
 {title:'경구 투여와 전신 치료',intro:'경구 제형의 존재, 전신 흡수, 감염 부위의 적합성을 나누어 판단합니다.',headers:['구분','대표 약물','기억할 조건','강의 근거'],rows:[
 ['전신 치료에 경구 사용 가능','Amoxicillin · Ciprofloxacin · Metronidazole · Clindamycin · TMP/SMX · Doxycycline','원인균 감수성·흡수·임상적 안정 확인','40쪽'],
 ['전신 치료를 경구로 그대로 대체하기 부적절','Aminoglycoside · Vancomycin · 주사용 ceftriaxone/cefotaxime · Imipenem','개별 약물과 실제 제형 기준','37·40쪽'],
 ['장내 작용을 위한 예외','경구 vancomycin','C. difficile 장염 등: 혈중 농도보다 장내 전달이 목적','40쪽'],
 ['계열 전체로 일반화 금지','경구 cefixime 등','2·3세대 cephalosporin 전체를 경구 불가로 묶지 않음','40쪽 보충'],
 ['정주 → 경구 전환','임상 안정 + 먹고 흡수할 수 있음 + 적절한 경구 약제','퇴원일을 고정된 정주 치료 일수만으로 결정하지 않음','38–39쪽']
 ]},
 {title:'BBB와 수막염',intro:'강의의 투과 분류입니다. 수막 염증·용량·감수성과 실제 적응증을 함께 봅니다.',headers:['강의 분류','대표 항생제','판단 포인트','강의 근거'],rows:[
 ['통과가 좋은 쪽','Nafcillin · Penicillin · Ampicillin','Penicillin 자체가 CNS에서 절대 사용 불가인 것은 아님','27쪽'],
 ['통과가 좋은 쪽','3·4세대 cephalosporin · Carbapenem · Chloramphenicol','계열 목록이 모든 약물의 수막염 적응증을 보장하지 않음','26–27쪽'],
 ['통과가 좋지 않은 쪽','1세대 cephalosporin · Aminoglycoside','Cefazolin·Gentamicin을 대표로 연결','27쪽'],
 ['수막염 선택 원칙','살균 작용 + CSF 유효 농도 + 해당 감염의 감수성 기준','혈청 농도 ≠ 뇌척수액 농도','23–29쪽']
 ]},
 {title:'임신 중 선택 · 강의 분류',intro:'“비교적 안전·주의·금기/회피”는 강의의 학습 분류입니다. 주의와 허가상 절대금기를 같게 외우지 않습니다.',headers:['분류','약물·계열','구분해서 기억하기','강의 근거'],rows:[
 ['비교적 안전','Penicillin · Cephalosporin','감수성·알레르기·감염 부위는 별도 확인','43쪽'],
 ['주의','Aminoglycoside · Metronidazole · Quinolone · Sulfonamide','주수·적응증·대체약·이득과 위험을 평가','43쪽'],
 ['금기/회피 목록','Clarithromycin · Erythromycin estolate · Tetracycline · Tigecycline','특정 약물/제형을 계열 전체의 절대금기로 확대하지 않음','43쪽'],
 ['Metronidazole 보충','강의는 주의로 표기','CDC는 임신 중 태아 위험이 낮다고 설명함','43쪽 + 보충 링크']
 ]},
 {title:'증례별 판단',headers:['강의 증례','선택·조치','핵심 조건'],rows:[
 ['1 · 바이러스성 상기도 감염','대증 치료·경과 관찰','모든 감염 증상에 항생제가 필요한 것은 아님'],
 ['2 · 배농 가능한 피부 농양','I&D 등 source control','항생제 외 치료도 필요'],
 ['3 · 폐렴구균 수막염','강의 선택: Ceftriaxone','수막염 기준 감수성과 CSF 농도 확인'],
 ['4 · 장티푸스','강의 선택: Ciprofloxacin','성인·감수성 확인 조건, 세포 내 분포 고려'],
 ['5 · 비임신 신우신염','강의 진행: Ciprofloxacin IV → 호전 후 PO 검토','임상 안정과 경구 섭취 가능성'],
 ['6 · 임신부 신우신염','감수성 있는 β-lactam계 검토','숙주 안전성과 초기 입원·정주 필요성'],
 ['7 · 발열 지속','농양·폐쇄·약제 문제·다른 원인 재평가','내성 하나로 단정하지 않음'],
 ['8 · 항생제 후 심한 설사','C. difficile 감염 고려','새로 생긴 합병증을 별도로 평가']
 ]}
];
export const PATHOLOGY_TABLES=[
 {title:'감염에 대한 조직반응',headers:['양상','주요 단서','예·감별점','출처'],rows:[
 ['화농성','호중구·삼출물·농양','화농성 세균 감염; 균종 확정과는 별개','병리1 7·10쪽'],
 ['육아종성','Epithelioid histiocyte 집합 ± 거대세포·괴사','결핵 외 sarcoidosis·Crohn병·이물·일부 진균 등','병리1 11·14쪽 / 실습17–18쪽'],
 ['세포병변성/증식성','봉입체·융합·다핵화·상피 증식','HSV·HPV 등; 모든 바이러스가 특이 소견을 보이는 것은 아님','병리1 12·25·28쪽'],
 ['만성 염증/반흔','반복 손상과 섬유화','HBV/HCV 관련 간경변 등','병리1 13쪽'],
 ['약한 반응/무반응','많은 병원체에 비해 약한 숙주 반응','심한 면역저하의 MAC 등; 약한 염증이 감염 부재를 뜻하지 않음','병리1 8쪽 / 실습19–20쪽']
 ]},
 {title:'바이러스 사진 감별',headers:['병원체','조직·세포 변화','임상 연결','출처'],rows:[
 ['HSV','다핵화·핵 molding·ground-glass 핵 변화','구순/생식기 수포, 신경세포 잠복','병리1 27·29·32쪽 / 실습13–15쪽'],
 ['CMV','세포 비대·큰 핵 내 봉입체·clear halo','신생아·면역저하, 전신 감염','병리1 30쪽 / 실습7–8쪽'],
 ['Molluscum contagiosum virus','컵 모양 표피 증식·세포질 molluscum body','중심 함몰 구진','실습10–12쪽'],
 ['HPV','Koilocytosis·사마귀성 상피 증식','P16 IHC는 고위험 HPV 연관성의 보조 지표','병리2 6·9–10쪽 / 실습5–6쪽'],
 ['Adenovirus','Smudge cell·핵 내 봉입체','호흡기 등 감염','병리1 25·31쪽'],
 ['BK polyomavirus','Decoy cell','신장이식·면역억제 환자의 소변','병리1 33쪽 / 실습16쪽'],
 ['EBV','비정형 림프구·EBER ISH','감염 표적 B세포와 반응성 CD8 T세포를 구별','병리2 3–5쪽']
 ]},
 {title:'진균 형태의 비교',intro:'대표적 형태를 조합해 원인군을 추정합니다. 사진 하나나 분지각만으로 종을 확정하지 않습니다.',headers:['원인군','형태','연결할 맥락','출처'],rows:[
 ['Aspergillus','비교적 가는 격막성 균사·예각 분지','ABPA / 기존 공동의 fungus ball / 침습성 혈관 침범','병리2 41쪽 / 실습29·33–34쪽'],
 ['Mucorales','넓고 불규칙한 리본형 균사·격막 드묾·둔각 분지','당뇨·면역저하, 비부비동·뇌·폐, 혈관 침범·혈전·괴사','병리2 42쪽 / 실습35–38쪽'],
 ['Candida','출아 효모 + pseudohyphae/균사','구강·식도·외음질 점막 병변','병리2 43쪽 / 실습39–40쪽'],
 ['Cryptococcus','피막성 효모·좁은 기저부 출아','폐·수막, mucicarmine으로 피막 확인 도움','병리1 15쪽 / 실습41–45쪽'],
 ['Pneumocystis jirovecii','폐포 내 거품성 삼출물·GMS 낭 형태','면역저하 환자 폐렴, 현재 진균으로 분류','병리2 45쪽 / 실습46–49쪽']
 ]},
 {title:'항산균·특수 병원체',headers:['병원체','감별 단서','혼동할 점','출처'],rows:[
 ['M. tuberculosis','건락괴사성 육아종·Langhans형 거대세포·AFB','육아종 자체는 결핵 특이 소견이 아님','병리2 19–22쪽 / 실습18쪽'],
 ['MAC','면역저하·포말성 조직구·다수 AFB','AFB만으로 균종 확정 불가','병리2 23쪽 / 실습19–20쪽'],
 ['M. leprae','피부·말초신경, 결핵양형 vs 나종형','강한 T세포 면역/육아종 vs 약한 면역/foamy macrophage','병리2 24–25쪽 / 실습21–25쪽'],
 ['Actinomyces','Sulfur granule·분지성 그람양성 세균','실처럼 보여도 진균이 아님','병리2 29–30쪽 / 실습26–27쪽'],
 ['T. pallidum','나선균·형질세포·폐쇄성 동맥염','이차 발진과 삼차 gumma 구별, 태아 전파 가능','병리2 31·34–35쪽'],
 ['C. difficile','항생제 후 장내 균무리 변화·위막성 대장염','반드시 면역결핍 질환이 선행해야 하는 것은 아님','병리2 16–17쪽']
 ]},
 {title:'원충·연충·외부기생충',headers:['원인 생물','사진과 위치','핵심 구분','출처'],rows:[
 ['E. histolytica','대장 궤양·영양형·적혈구 포식','PAS 양성은 진균만의 소견이 아님','병리2 49–50쪽 / 실습51–53쪽'],
 ['T. vaginalis','서양배 모양 영양형·질/요도','성매개 편모성 원충','병리2 52쪽 / 실습54–55쪽'],
 ['P. westermani','난개를 가진 황갈색 두꺼운 충란','폐흡충; 흡충 분류','실습56–58쪽'],
 ['T. solium 유충','조직 내 낭미충·두절','충란 섭취 → 낭미충증; 장내 조충증과 구별','실습59–62쪽'],
 ['Demodex','모낭·피지샘 내부','길쭉한 진드기','실습63–64쪽'],
 ['Sarcoptes scabiei','각질층 내 굴과 진드기','집단 생활·가려움증','실습65–66쪽']
 ]},
 {title:'염색·검사와 해석',headers:['방법','대표 용도','한계·혼동 방지','출처'],rows:[
 ['H&E','조직반응·병원체 형태 관찰','모든 원인균을 확정할 수는 없음','병리1 3·15쪽'],
 ['AFB','항산균 확인','붉은 간균과 청색 대조염색 배경 구별; 균종은 추가 판단','병리1 15쪽 / 실습25쪽'],
 ['GMS','진균 구조·Pneumocystis 낭 형태 등','검은 구조를 숙주 핵으로 오인하지 않음','병리1 15쪽 / 실습49쪽'],
 ['PAS','진균·아메바 등','양성 = 특정 진균 또는 원충 확진 아님','병리1 15쪽 / 실습53쪽'],
 ['Mucicarmine','Cryptococcus 피막 확인 도움','다른 형태와 검사 결과를 함께 봄','병리1 15쪽'],
 ['P16 IHC','고위험 HPV 연관성을 평가하는 보조 단서','균체 특수염색이나 바이러스 유전형 확정 검사가 아님','병리2 10쪽'],
 ['EBER ISH','EBV 관련 핵산을 조직에서 확인','진균 특수염색·단백질 IHC와 구별','병리2 5쪽']
 ]}
];
export function renderTables(tables){
 const e=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return tables.map(t=>`<article class="reference-table-card"><h2>${e(t.title)}</h2>${t.intro?`<p class="muted">${e(t.intro)}</p>`:''}<div class="table-scroll" tabindex="0" role="region" aria-label="${e(t.title)} 표 · 가로 스크롤 가능"><table><caption class="sr-only">${e(t.title)}</caption><thead><tr>${t.headers.map(h=>`<th scope="col">${e(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(row=>`<tr class="${/(주의|금기|회피|부적절|불가|좋지 않은)/.test(row[0])?'row-caution':/(가능|좋은|비교적 안전)/.test(row[0])?'row-positive':''}">${row.map((cell,i)=>i===0?`<th scope="row">${emphasizeFeedback(cell)}</th>`:`<td>${emphasizeFeedback(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></article>`).join('');
}
