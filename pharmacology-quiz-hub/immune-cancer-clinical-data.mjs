// Clinical teaching cases derived only from the retained lecture provenance in
// immune-data (28), anticancer-data (30), and signal31-data (31). These are
// lecture applications, without dose, treatment-line, or current guideline claims.
// Keep this module dependency-free: each source bank imports its own cases.
function cases(unit,metadata,rows){
 return rows.map(([subject,stem,choices,note])=>{
  const d=metadata[subject];
  return {id:`clinical-${unit}-${subject}`,format:'clinical',kind:'target',direction:'clinical',group:'clinical',subject,core:true,weight:d[3]||1,stem,options:choices.map(id=>metadata[id][0]),answer:d[0],note,source:unit==='anticancer'?`30강 강의록 PDF ${d[2]}쪽 · 78–79 요약표`:`${unit==='immune'?28:31}강 강의록 PDF ${d[2]}쪽`,exam:'강의 임상응용',details:choices.map(id=>`${metadata[id][0]}: ${metadata[id][1]}`)};
 });
}

const immune={
 filgrastim:['Filgrastim','G-CSF 제제로 호중구 생성을 촉진합니다. 호산구 증가까지 연결하는 GM-CSF 제제와 구별합니다.','11–12',2],
 sargramostim:['Sargramostim','GM-CSF 제제로 호중구 외 호산구 등 조혈세포 증가와도 연결됩니다. G-CSF인 filgrastim과 구별합니다.','11–12',3],
 epo:['EPO','적혈구 생성을 촉진하여 빈혈 치료에 연결됩니다. 호중구·호산구를 늘리는 성장인자와 구별합니다.','7·10·12',2],
 cyclosporine:['Cyclosporine','Cyclophilin과 결합한 복합체가 calcineurin을 억제하여 NFAT 활성화·IL-2 전사를 줄입니다. 이식 관련 면역억제제로 분류합니다.','21·26–30',4],
 tacrolimus:['Tacrolimus','FKBP12와 결합한 복합체가 calcineurin을 억제합니다. 이식 관련 면역억제에서 FKBP12 결합과 효과 표적을 함께 확인합니다.','21·26–30',3],
 mmf:['Mycophenolate mofetil (MMF)','활성체 MPA로 전환되어 IMPDH를 억제하고 guanine nucleotide의 de novo 합성을 줄입니다. 이식 3제 요법에 연결됩니다.','32·34',2],
 aza:['Azathioprine (AZA)','6-MP로 전환되는 전구약물로 purine de novo 합성을 억제합니다. HGPRT는 대사 활성화 효소이며 직접 억제 표적이 아닙니다.','31·34',2],
 atg:['ATG','여러 T세포 표면항원에 반응하는 다클론 항체로 T세포를 고갈시킵니다. 이식 관련 면역억제와 연결됩니다.','35·44',3],
 abatacept:['Abatacept','CTLA-4–Ig 융합단백질이 APC의 B7(CD80·CD86)에 결합하여 CD28 공동자극을 막습니다. 강의록의 RA 분류에 포함됩니다.','19·40·44·46',4],
 natalizumab:['Natalizumab','α4 integrin에 결합하여 VCAM-1과의 상호작용과 면역세포 침윤을 억제합니다. 강의록에서는 MS·Crohn 질환과 연결합니다.','43–44',2]
};
export const IMM_CLINICAL=cases('immune',immune,[
 ['filgrastim','호중구 감소증 환자에게 호중구 생성을 촉진하는 G-CSF 제제를 쓰려 한다. 적혈구 생성인자나 GM-CSF와 구별하여 선택할 약물은?',['filgrastim','sargramostim','epo','atg','abatacept'],'호중구 감소증과 G-CSF의 연결은 filgrastim입니다. Sargramostim은 GM-CSF로 호산구 증가도 연결되고 EPO는 적혈구 생성을 촉진합니다.'],
 ['sargramostim','호중구와 호산구가 함께 감소한 환자에서, 강의의 조혈성 성장인자 중 두 계열의 증가와 연결되는 GM-CSF 제제를 검토한다. 해당 약물은?',['sargramostim','filgrastim','epo','tacrolimus','natalizumab'],'강의의 GM-CSF 제제는 sargramostim입니다. 호중구 외 호산구 증가도 연결되므로 G-CSF 제제 filgrastim과 구별합니다.'],
 ['epo','빈혈 환자에게 적혈구 생성을 촉진하는 조혈성 제제를 선택하려 한다. 호중구·호산구 생성 촉진제와 구별되는 약물은?',['epo','filgrastim','sargramostim','mmf','atg'],'EPO는 erythropoietin으로 적혈구 생성을 촉진합니다. 빈혈이라는 임상 상황에서 백혈구 계열 성장인자와 생성 세포를 구별합니다.'],
 ['cyclosporine','장기 이식 환자의 면역억제 요법에서 Cyclophilin에 결합한 복합체로 calcineurin을 억제하는 약물을 고르려 한다. 해당 약물은?',['cyclosporine','tacrolimus','mmf','aza','atg'],'Cyclosporine–cyclophilin 복합체는 calcineurin을 억제합니다. Tacrolimus도 calcineurin 억제제이지만 결합 단백질은 FKBP12입니다.'],
 ['tacrolimus','장기 이식 환자의 약물 기록에 “FKBP12 결합 후 calcineurin 억제”라고 적혀 있다. 이 기전으로 면역억제에 쓰는 약물은?',['tacrolimus','cyclosporine','aza','mmf','abatacept'],'Tacrolimus는 FKBP12에 결합하고 그 복합체가 calcineurin을 억제합니다. 결합 단백질과 최종 억제 효소를 함께 확인합니다.'],
 ['mmf','장기 이식 환자의 3제 면역억제 요법에 guanine nucleotide 합성을 줄이는 전구약물을 포함하려 한다. 활성체 MPA가 IMPDH를 억제하는 약물은?',['mmf','aza','cyclosporine','tacrolimus','atg'],'MMF는 MPA로 전환되어 IMPDH를 억제합니다. 같은 이식 요법에 등장하는 AZA는 6-MP 전환·purine 합성 억제 경로입니다.'],
 ['aza','장기 이식 환자의 3제 요법 중 항대사약을 검토한다. 6-MP로 전환된 뒤 purine de novo 합성을 억제하는 약물은?',['aza','mmf','tacrolimus','cyclosporine','abatacept'],'AZA는 6-MP 전구약물입니다. HGPRT를 직접 억제하는 약물로 외우지 않고 활성화와 purine 합성 억제 경로를 연결합니다.'],
 ['atg','장기 이식 환자의 면역억제 약물 교육에서, 여러 T세포 표면항원에 반응하는 다클론 항체를 통한 T세포 고갈을 설명한다. 해당 제제는?',['atg','abatacept','natalizumab','cyclosporine','mmf'],'ATG는 여러 표면항원을 인식하는 다클론 항체입니다. 특정 공동자극·부착 분자 하나를 겨냥하는 약물과 구별합니다.'],
 ['abatacept','류마티스관절염 환자에서 APC가 T세포에 제공하는 공동자극을 차단하는 융합단백질을 검토한다. B7에 결합하여 CD28 신호를 줄이는 약물은?',['abatacept','atg','natalizumab','tacrolimus','sargramostim'],'Abatacept는 강의록의 RA 분류에 포함되는 CTLA-4–Ig 융합단백질입니다. APC의 B7에 결합하여 CD28 공동자극을 차단합니다.'],
 ['natalizumab','다발성경화증 환자에서 면역세포의 혈관 부착·침윤을 줄이는 약물을 검토한다. α4 integrin에 결합하여 VCAM-1과의 상호작용을 막는 약물은?',['natalizumab','abatacept','atg','epo','filgrastim'],'Natalizumab은 강의록의 MS 분류와 연결되는 α4 integrin 표적 항체입니다. 약물의 직접 결합 대상은 VCAM-1이 아니라 α4 integrin입니다.']
]);

const anticancer={
 dactinomycin:['Dactinomycin (Actinomycin D)','DNA에 삽입되어 RNA polymerase의 작용·전사를 방해합니다. 강의에서 Wilms 종양·횡문근육종 예시와 연결합니다.','17·22',2],
 asparaginase:['Asparaginase','혈중 asparagine을 분해·고갈시키는 효소입니다. 외부 asparagine에 의존하는 일부 백혈병 세포의 특성을 이용합니다.','23–24',2],
 tamoxifen:['Tamoxifen','경구 SERM으로 유방에서 ER 작용을 억제하며 다른 조직에서는 부분효능이 가능합니다. 자궁내막 증식·혈전 위험과 연결합니다.','28–31',2],
 fulvestrant:['Fulvestrant','ER에 결합하여 수용체 분해·감소를 유도하는 SERD입니다. 강의에서 근육주사 제형과 연결합니다.','29–31',1],
 exemestane:['Exemestane','비가역적 aromatase 억제제로 estrogen 생성을 줄입니다. 폐경 후 말초 estrogen 생성과 골소실 위험을 연결합니다.','28–31',1],
 enzalutamide:['Enzalutamide','Androgen receptor의 결합·핵 이동·전사 신호를 차단합니다. CYP17을 통한 androgen 합성 억제와 구별합니다.','33·35',2],
 abiraterone:['Abiraterone','CYP17 억제로 androgen·cortisol 생성을 줄입니다. ACTH 증가에 따른 mineralocorticoid excess를 줄이는 prednisone 병용과 연결합니다.','33·35',2],
 degarelix:['Degarelix','GnRH 수용체를 직접 차단하여 초기 flare 없이 LH·testosterone을 낮춥니다. 지속 투여 GnRH 작용제와 시작 양상을 구별합니다.','33–34',2],
 vincristine:['Vincristine','β-tubulin에 결합하여 미세소관 중합을 억제합니다. 강의에서는 손발저림·근무력·심한 변비 등 신경독성이 중요한 구별 단서입니다.','7–9',4],
 bleomycin:['Bleomycin','ROS 생성·DNA 가닥 절단과 연결됩니다. 폐·피부의 낮은 hydrolase 활성, 폐섬유화, 상대적으로 적은 골수억제를 구별합니다.','17·20–21',3]
};
export const ANTI_CLINICAL=cases('anticancer',anticancer,[
 ['dactinomycin','Wilms 종양 소아 환자의 항암 요법에서 DNA에 삽입되어 RNA polymerase의 전사 작용을 방해하는 약물을 확인하려 한다. 해당 약물은?',['dactinomycin','asparaginase','vincristine','bleomycin','tamoxifen'],'Dactinomycin은 강의에서 Wilms 종양·횡문근육종 예시와 연결됩니다. DNA 삽입 후 RNA 합성·전사를 억제하는 기전을 확인합니다.'],
 ['asparaginase','일부 백혈병 세포가 외부에서 공급되는 asparagine에 의존하는 환자의 치료 원리를 설명한다. 혈중 asparagine을 분해하여 고갈시키는 효소 제제는?',['asparaginase','dactinomycin','vincristine','bleomycin','exemestane'],'Asparaginase는 혈중 asparagine을 분해합니다. 종양세포의 asparagine 합성효소를 직접 억제하는 약물로 바꾸지 않습니다.'],
 ['tamoxifen','ER 양성 유방암 환자에게 유방에서는 ER 작용을 억제하면서 다른 조직에서는 부분효능을 보일 수 있는 경구약을 검토한다. 해당 약물은?',['tamoxifen','fulvestrant','exemestane','enzalutamide','abiraterone'],'Tamoxifen은 경구 SERM입니다. ER 분해를 유도하는 근육주사 SERD와 estrogen 합성을 줄이는 aromatase 억제제와 구별합니다.'],
 ['fulvestrant','ER 양성 유방암 환자에서 estrogen 생성 감소 대신 ER 자체의 분해를 유도하는 근육주사 약물을 검토한다. 해당 약물은?',['fulvestrant','tamoxifen','exemestane','degarelix','abiraterone'],'Fulvestrant는 ER 분해·수용체 감소를 유도하는 SERD입니다. Tamoxifen의 조직선택적 ER 조절이나 aromatase 억제와 기전이 다릅니다.'],
 ['exemestane','폐경 후 ER 양성 유방암 환자에서 말초 estrogen 생성을 줄이려 한다. 강의의 비가역적 aromatase 억제제로 알맞은 약물은?',['exemestane','tamoxifen','fulvestrant','abiraterone','enzalutamide'],'Exemestane은 비가역적 aromatase 억제제입니다. ER에 직접 작용하는 tamoxifen·fulvestrant와 작용 위치를 구별합니다.'],
 ['enzalutamide','전립선암 환자에서 남아 있는 androgen의 신호를 줄이려 한다. AR 결합·핵 이동·전사 신호를 차단하는 약물은?',['enzalutamide','abiraterone','degarelix','exemestane','tamoxifen'],'Enzalutamide는 AR 신호를 차단합니다. Androgen 합성효소 CYP17을 억제하는 abiraterone이나 뇌하수체 GnRH 수용체를 차단하는 degarelix와 구별합니다.'],
 ['abiraterone','전립선암 환자에게 androgen 합성을 줄이는 약물과 prednisone을 병용하려 한다. CYP17 억제에 따른 ACTH 증가·저칼륨혈증·부종을 함께 고려하는 약물은?',['abiraterone','enzalutamide','degarelix','exemestane','fulvestrant'],'Abiraterone은 CYP17을 억제합니다. Cortisol 감소 후 ACTH가 증가하여 생기는 mineralocorticoid excess를 prednisone 병용으로 줄이는 연결입니다.'],
 ['degarelix','전립선암 환자에서 치료 시작 시 testosterone flare를 피하도록 GnRH 수용체를 직접 차단하는 약물을 검토한다. 보기 중 해당 약물은?',['degarelix','enzalutamide','abiraterone','tamoxifen','exemestane'],'Degarelix는 GnRH 수용체 길항제로 초기 flare 없이 LH·testosterone을 낮춥니다. 보기의 AR 차단·합성효소 억제 약물과 직접 작용 위치가 다릅니다.'],
 ['vincristine','항암 치료 환자에게 손발저림·근무력과 심한 변비가 나타났다. 강의에서 미세소관 중합 억제와 두드러진 신경독성을 연결하는 원인 약물은?',['vincristine','bleomycin','asparaginase','tamoxifen','abiraterone'],'Vincristine은 vinca 계열로 미세소관 중합을 억제합니다. 손발저림·근무력·심한 변비는 강의가 강조한 신경독성 단서입니다.'],
 ['bleomycin','항암 치료 환자에서 폐섬유화가 문제가 되었지만 골수억제는 상대적으로 적었다. 폐·피부의 낮은 hydrolase 활성과 연결하여 의심할 약물은?',['bleomycin','vincristine','asparaginase','dactinomycin','enzalutamide'],'Bleomycin은 폐·피부에서 hydrolase 활성이 낮아 해당 장기 독성과 연결됩니다. 폐섬유화와 상대적으로 적은 골수억제를 함께 확인합니다.']
]);

const signal={
 tretinoin:['Tretinoin (ATRA)','PML–RARα의 RARα 부위에 작용하여 전사 억제를 풀고 미성숙 백혈병 세포의 분화를 촉진합니다. APL과 연결합니다.','2·16',4],
 trastuzumab:['Trastuzumab (Herceptin)','HER2의 세포외 영역에 결합하는 단클론항체입니다. HER2 과발현 유방암에서 신호 억제·ADCC와 연결합니다.','2·22·24',4],
 enhertu:['Enhertu (trastuzumab deruxtecan)','HER2를 인식하는 trastuzumab에 Topo I 억제 payload deruxtecan을 연결한 ADC입니다. 인식 표적과 payload 작용을 구별합니다.','2·23',2],
 rituximab:['Rituximab','CD20을 인식하는 단클론항체로 B세포 비호지킨림프종과 연결됩니다. CD52·CD33·CD30 항체와 항원 번호를 구별합니다.','2·27–28',3],
 gemtuzumab:['Gemtuzumab ozogamicin','CD33 항체에 calicheamicin을 연결한 ADC입니다. CD33 양성 급성 골수성백혈병과 연결합니다.','2·23·27',4],
 brentuximab:['Brentuximab vedotin','CD30을 인식하는 ADC입니다. 강의 예시는 재발·불응 호지킨림프종이며 CD33 표적 gemtuzumab과 구별합니다.','2·27',2],
 imatinib:['Imatinib (Gleevec)','BCR-ABL·KIT·PDGFR를 억제하는 1세대 TKI입니다. Ph+ 백혈병과 KIT 양성 GIST를 연결합니다.','2·39–43',4],
 sunitinib:['Sunitinib','VEGFR·PDGFR·KIT 등을 억제하는 다중 TKI입니다. 강의에서 imatinib 내성 GIST·신세포암·PNET와 연결합니다.','2·47·49',4],
 bevacizumab:['Bevacizumab (Avastin)','VEGF-A 리간드를 인식하는 항체로 VEGFR 자극과 혈관신생을 줄입니다. 강의의 전이성 대장직장암 예시와 연결합니다.','2·46–47',4],
 bortezomib:['Bortezomib','26S proteasome 억제제로 다발성 골수종과 연결됩니다. IκBα 분해를 막아 NF-κB 활성화를 억제하는 방향입니다.','2·50–51',3]
};
export const SIGNAL_CLINICAL=cases('signal',signal,[
 ['tretinoin','급성전골수성백혈병(APL) 환자에서 PML–RARα에 의한 분화 억제를 풀어 미성숙 세포의 분화를 촉진하려 한다. 해당 약물은?',['tretinoin','imatinib','gemtuzumab','rituximab','bortezomib'],'Tretinoin은 RARα에 작용하는 분화 촉진제입니다. APL이라는 임상 상황과 PML–RARα의 전사 억제를 푸는 작용을 연결합니다.'],
 ['trastuzumab','HER2 과발현 유방암 환자에서 세포외 HER2에 결합해 신호 억제·ADCC를 유도하는 항체를 검토한다. 세포독성 payload를 연결하지 않은 약물은?',['trastuzumab','enhertu','rituximab','bevacizumab','gemtuzumab'],'Trastuzumab은 HER2의 세포외 영역에 결합하는 항체입니다. 같은 HER2를 인식해도 deruxtecan을 전달하는 Enhertu와 약물 형식을 구별합니다.'],
 ['enhertu','유방암 환자에서 HER2를 인식한 뒤 Topo I 억제 물질을 전달하는 ADC를 검토한다. 발현 수준·적응증 조건을 확인하며 선택할 해당 제제는?',['enhertu','trastuzumab','gemtuzumab','brentuximab','bevacizumab'],'Enhertu는 trastuzumab으로 HER2를 인식하고 deruxtecan으로 Topo I 억제 작용을 전달합니다. ADC라는 공통점만으로 CD33·CD30 표적 제제와 바꾸지 않습니다.'],
 ['rituximab','CD20 양성 B세포 비호지킨림프종 환자에서 방사성 동위원소를 연결하지 않은 CD20 단클론항체를 검토한다. 해당 약물은?',['rituximab','gemtuzumab','brentuximab','trastuzumab','bevacizumab'],'Rituximab은 CD20 표적 항체로 B세포 비호지킨림프종과 연결됩니다. 보기의 항체·ADC들은 CD33·CD30·HER2·VEGF-A를 인식합니다.'],
 ['gemtuzumab','CD33 양성 급성 골수성백혈병 환자에서 해당 항원으로 calicheamicin을 전달하려 한다. 이 목적에 연결되는 ADC 제제는?',['gemtuzumab','brentuximab','enhertu','rituximab','tretinoin'],'Gemtuzumab ozogamicin은 CD33–calicheamicin ADC입니다. APL의 분화 촉진제나 CD30·HER2를 인식하는 ADC와 구별합니다.'],
 ['brentuximab','재발·불응 호지킨림프종 환자에서 CD30을 인식하는 ADC를 검토한다. 강의의 해당 치료 예시와 연결되는 약물은?',['brentuximab','gemtuzumab','enhertu','rituximab','bortezomib'],'Brentuximab vedotin은 CD30 인식 ADC입니다. 강의의 재발·불응 호지킨림프종 예시를 CD33 양성 AML의 gemtuzumab과 구별합니다.'],
 ['imatinib','KIT 양성 GIST 환자의 표적치료 후보를 복습한다. BCR-ABL·KIT·PDGFR 억제를 함께 갖는 강의의 1세대 TKI로 연결되는 약물은?',['imatinib','tretinoin','rituximab','bevacizumab','bortezomib'],'Imatinib은 1세대 BCR-ABL 억제제이면서 KIT·PDGFR도 억제합니다. KIT 양성 GIST에 연결되며 BCR-ABL과 KIT를 같은 표적 이름으로 보지 않습니다.'],
 ['sunitinib','Imatinib 내성 GIST 환자의 약물 후보에서 VEGFR·PDGFR·KIT를 억제하는 다중 TKI를 검토한다. 강의의 이 임상 예시와 연결되는 약물은?',['sunitinib','imatinib','bevacizumab','trastuzumab','bortezomib'],'Sunitinib은 VEGFR·PDGFR·KIT 억제와 imatinib 내성 GIST를 연결합니다. VEGF-A를 포획하는 항체 bevacizumab과 약물 유형·결합 대상을 구별합니다.'],
 ['bevacizumab','전이성 대장직장암 환자에서 혈관신생을 줄이는 항체를 검토한다. VEGFR 자체 대신 VEGF-A 리간드를 포획하는 약물은?',['bevacizumab','sunitinib','trastuzumab','rituximab','gemtuzumab'],'Bevacizumab은 강의의 전이성 대장직장암 예시와 연결되는 VEGF-A 항체입니다. VEGFR kinase를 억제하는 다중 TKI와 직접 결합 위치가 다릅니다.'],
 ['bortezomib','다발성 골수종 환자에게 26S proteasome을 억제하여 IκBα의 분해를 막는 치료 원리를 설명한다. 이 원리의 약물은?',['bortezomib','imatinib','tretinoin','rituximab','sunitinib'],'Bortezomib은 다발성 골수종에 연결되는 26S proteasome 억제제입니다. IκBα 분해를 억제하여 NF-κB 활성을 낮추는 방향을 확인합니다.']
]);
