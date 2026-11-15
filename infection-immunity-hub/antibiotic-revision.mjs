// Questions must carry every condition needed to answer them.
const stems={
 'oral-01':'다음 중 경구 투여로 전신 감염 치료에 사용할 수 있는 항생제는?',
 'oral-02':'감수성이 확인된 비임신 성인에서 정주 치료 후 같은 성분의 경구 제제로 전환할 수 있는 항생제는?',
 'oral-03':'다음 중 경구 투여로도 전신 유효 농도를 얻을 수 있는 항생제는?',
 'oral-04':'다음 중 정주 치료에서 같은 성분의 경구 치료로 전환할 수 있는 항생제는?',
 'oral-05':'다음 중 경구 흡수를 이용해 전신 감염 치료에 사용할 수 있는 항균제는?',
 'oral-06':'다음 중 경구 흡수가 좋아 전신 감염 치료에 사용할 수 있는 항생제는?',
 'oral-07':'다음 중 경구 흡수가 매우 낮아 균혈증의 경구 치료제로 부적절한 항생제는?',
 'oral-08':'다음 중 동일 성분의 경구 제제가 없어 정주 치료를 먹는 약으로 단순 교체할 수 없는 항생제는?',
 'bbb-01':'MSSA 수막염에서, 수막 염증이 있을 때의 CSF 이행을 고려하여 선택할 수 있는 항생제는?',
 'bbb-02':'수막염으로 수막에 염증이 있을 때, 다음 중 CSF로 이행할 수 있는 항생제는?',
 'bbb-03':'Ceftriaxone 감수성이 확인된 폐렴구균 수막염 환자다. 다음 중 적절한 항생제는?',
 'bbb-04':'수막염으로 수막에 염증이 있을 때, 다음 중 CSF로 이행할 수 있는 항생제는?',
 'bbb-05':'수막염에서 전신 투여해도 CSF 도달이 어려운 항생제는?',
 'bbb-06':'다음 중 BBB를 잘 통과하여 CSF로 이행하는 항생제는?',
 'bbb-07':'수막염에서 다음 중 BBB 통과가 상대적으로 어려운 항생제는?',
 'bbb-08':'수막염에서 전신 투여해도 CSF 도달이 충분하지 않은 항생제는?',
 'pregnancy-01':'다음 중 임신부에서 비교적 안전하게 사용할 수 있는 항생제 계열은?',
 'pregnancy-02':'임신부의 신우신염에서 감수성이 확인되었고 중증 β-lactam 알레르기가 없다. 다음 중 우선 검토할 항생제는?',
 'pregnancy-03':'다음 중 임신부에서 penicillin·cephalosporin보다 신중하게 이득과 위험을 평가해 선택해야 하는 항생제는?',
 'pregnancy-04':'다음 중 임신부에서 통상적인 1차 선택으로 피하는 항생제는?',
 'pregnancy-05':'다음 중 임신 주수와 적응증에 따라 대체 약물을 검토하며 신중하게 선택해야 하는 항균제는?',
 'pregnancy-06':'다음 중 임신부에서 비교적 안전하게 사용할 수 있는 항생제는?',
 'pregnancy-07':'다음 중 임신부에서 일반적인 우선 선택으로 피하는 항생제는?',
 'pregnancy-08':'다음 중 임신부에서 사용을 피하는 erythromycin 제형은?',
 'cases-01':'50세 여성이 인후통·콧물·코막힘으로 내원했다. 체온 37.8℃이며 인두 삼출물과 경부 림프절 압통은 없다. 바이러스성 상기도 감염으로 판단할 때 적절한 처치는?',
 'cases-02':'종아리의 발적·통증성 피부 병변 중심부에 파동성이 만져진다. 초음파에서 국소 고름집이 확인되었다. 감염원을 제거하기 위한 처치는?',
 'cases-03':'폐렴구균 수막염 환자의 penicillin MIC는 0.12 μg/mL이며 ceftriaxone 감수성이 확인되었다. 표적 치료에 선택할 β-lactam 항생제는?',
 'cases-04':'비임신 성인 장티푸스 환자에서 S. Typhi가 분리되었다. Ciprofloxacin 감수성이 확인되었고 경구 섭취가 가능하다. 다음 중 경구 치료로 선택할 수 있는 항생제는?',
 'cases-05':'비임신 45세 여성의 E. coli 신우신염이다. 구토로 경구 약을 유지하기 어렵고 ciprofloxacin 감수성이 확인되었다. 적절한 초기 투여 방법은?',
 'cases-06':'비임신 성인의 E. coli 신우신염에 ciprofloxacin 정주 치료를 시행했다. 활력징후가 안정되고 증상이 호전되어 식사가 가능하다. 같은 성분으로 경구 전환할 약은?',
 'cases-07':'30세 임신부의 E. coli 신우신염이다. 아래 항생제의 감수성이 확인되었고 중증 β-lactam 알레르기는 없다. 숙주 안전성을 고려할 때 우선 검토할 약은?',
 'cases-08':'감수성 있는 ciprofloxacin으로 신우신염을 5일간 치료했으나 발열이 지속된다. 농양·폐쇄 등 해부학적 합병증을 평가할 검사는?',
 'cases-09':'E. coli 신우신염의 감수성 항균제 치료에도 발열이 지속된다. 영상에서 큰 신농양이 확인되었고 배액술이 적응된다고 판단했다. 감염원 조절을 포함한 치료 조합은?',
 'cases-10':'최근 항생제를 사용한 77세 여성이 하루 10회 이상의 설사, 발열, 복통과 저혈압을 보인다. 가장 먼저 의심할 원인 병원체는?',
 'cases-11':'C. difficile 대장염에서 경구 vancomycin이 효과를 낼 수 있는 핵심 이유는?',
 'cases-12':'폐렴구균 수막염의 penicillin MIC가 0.12 μg/mL이다. 비수막염 기준의 감수성 표기만으로 penicillin을 선택하면 안 되는 이유는?'
};
const patches={
 'bbb-05':{choices:['Gentamicin','Meropenem','Cefotaxime','Chloramphenicol','Ampicillin'],explanation:'Aminoglycoside인 gentamicin은 전신 투여 시 CSF로의 이행이 불량하다. 혈중 감수성뿐 아니라 CSF 유효 농도를 함께 평가한다.'},
 'pregnancy-03':{choices:['Gentamicin','Amoxicillin','Ampicillin','Cefotaxime','Ceftriaxone'],explanation:'Aminoglycoside인 gentamicin은 임신 중 이득과 위험을 신중하게 평가하는 약물이다. Penicillin과 cephalosporin은 비교적 안전한 범주로 구분한다.'},
 'pregnancy-04':{choices:['Ciprofloxacin','Amoxicillin','Ampicillin','Cefotaxime','Ceftriaxone'],explanation:'Ciprofloxacin은 fluoroquinolone이다. 임신부의 일반적인 1차 선택에서는 안전성 자료가 더 축적된 penicillin·cephalosporin을 우선 검토한다.',note:'모든 임상 상황의 절대금기라는 뜻은 아니다. 적응증과 대체 약물, 이득·위험을 평가한다.',refs:['pregnancy']},
 'pregnancy-05':{choices:['Trimethoprim/sulfamethoxazole (TMP/SMX)','Amoxicillin','Ampicillin','Cefotaxime','Ceftriaxone'],explanation:'TMP/SMX에는 sulfonamide가 포함된다. 임신 주수·적응증·대체 약물에 따라 이득과 위험을 평가한다.',note:'주의하여 선택하는 약물과 모든 상황에서의 절대금기를 구별한다.',refs:['pregnancy']},
 'pregnancy-06':{choices:['Ceftriaxone','Ciprofloxacin','Doxycycline','Tigecycline','Clarithromycin'],explanation:'Ceftriaxone은 cephalosporin으로 임신 중 비교적 안전하게 사용하는 범주에 속한다. 감염 부위와 균의 감수성도 함께 확인한다.',note:''},
 'cases-01':{choices:['대증 치료·경과 관찰','Amoxicillin','Ceftriaxone','Azithromycin','Doxycycline']},
 'cases-02':{choices:['절개·배농','항생제 단독','일차 봉합','압박 드레싱 단독','경과 관찰 단독']},
 'cases-03':{choices:['Ceftriaxone','Ciprofloxacin','Erythromycin','Penicillin','Vancomycin'],explanation:'수막염에서 penicillin MIC 0.12 μg/mL는 penicillin 내성 기준에 해당한다. Ceftriaxone 감수성이 확인되었다면 제시된 β-lactam 중 ceftriaxone을 선택한다.',refs:['meningitis']},
 'cases-04':{choices:['Ciprofloxacin','Cefazolin','Cefuroxime','Gentamicin','Vancomycin'],explanation:'감수성이 확인된 비임신 성인의 장티푸스에서는 ciprofloxacin을 경구 표적 치료로 선택할 수 있다. 경험적 선택과 감수성 확인 후 선택은 구분한다.',refs:['typhi']},
 'cases-05':{choices:['Ciprofloxacin IV','Ciprofloxacin PO','Amikacin PO','Cefotaxime PO','Vancomycin PO']},
 'cases-06':{choices:['Ciprofloxacin PO','Ciprofloxacin IV','Ceftriaxone IV','Amikacin IV','Vancomycin PO']},
 'cases-08':{choices:['복부 영상검사','혈액배양 재검','소변배양 재검','약물 감수성 재검','신기능 검사'],explanation:'지속 발열에서는 여러 재평가가 가능하지만, 농양·폐쇄라는 해부학적 합병증을 확인하는 검사는 복부 영상검사이다.'},
 'cases-09':{choices:['농양 배액 + 항균제','도관 교체 + 항균제','요로 결석 제거 + 항균제','항진균제 전환 + 수액','항균제 교체 + 수액']},
 'cases-10':{choices:['Clostridioides difficile','Salmonella Typhi','Campylobacter jejuni','Norovirus','Klebsiella pneumoniae']},
 'cases-11':{choices:['장내 국소 작용','혈중 농도 증가','CSF 농도 증가','담즙 배설 촉진','신장 배설 억제']},
 'cases-12':{choices:['수막염 특이 감수성 기준','경구 생체이용률','장내 약물 농도','담즙 배설률','항생제 투여 기간']}
};
const caseOX={
 '13':'Ceftriaxone 감수성이 확인된 폐렴구균 수막염에서 ceftriaxone을 표적 치료제로 선택할 수 있다. (O/X)',
 '14':'폐렴구균 수막염에서 penicillin MIC가 0.12 μg/mL이면 penicillin을 단독 표적 치료제로 선택할 수 있다. (O/X)',
 '15':'검사에서 erythromycin S로 보고되면 폐렴구균 수막염의 치료제로 erythromycin을 선택할 수 있다. (O/X)',
 '16':'Ciprofloxacin 감수성이 확인된 비임신 성인의 장티푸스에서 ciprofloxacin을 선택할 수 있다. (O/X)',
 '17':'장티푸스에서 gentamicin S로 보고되면 gentamicin을 적절한 단독 치료제로 선택할 수 있다. (O/X)',
 '18':'장티푸스에서 cefuroxime S로 보고되면 cefuroxime을 적절한 치료제로 선택할 수 있다. (O/X)',
 '19':'Ciprofloxacin 감수성이 확인된 비임신 성인의 E. coli 신우신염에서 구토로 경구 투여가 어렵다면 ciprofloxacin IV로 치료를 시작할 수 있다. (O/X)',
 '20':'Ciprofloxacin으로 치료 중인 비임신 신우신염 환자가 안정되고 식사가 가능해졌다면 감수성을 확인해 ciprofloxacin PO로 전환할 수 있다. (O/X)',
 '21':'Amikacin 감수성이 확인된 E. coli 신우신염 환자에서 amikacin을 먹는 약으로 전환할 수 있다. (O/X)',
 '22':'Cefotaxime 감수성이 확인되고 중증 β-lactam 알레르기가 없는 임신부의 E. coli 신우신염에 cefotaxime IV를 선택할 수 있다. (O/X)',
 '23':'임신부의 신우신염에서 doxycycline은 숙주 안전성을 고려한 일반적인 우선 선택 약물이다. (O/X)',
 '24':'C. difficile 대장염에서 vancomycin을 경구로 투여해 장내 치료 효과를 낼 수 있다. (O/X)'
};

export function reviseAntibioticQuestions(items){
 return items.map(original=>{
  const patch=patches[original.id],q={...original,...patch};
  if(stems[original.id])q.stem=stems[original.id];
  if(patch){q.legacyId=original.id;q.id=original.id+'-r2';q.answer=0;}
  if(q.format==='mcq'&&(stems[original.id]||patch)){q.id=original.id+'-r3';q.legacyId=original.id;}
  if(original.format==='ox'){
   const drug=original.stem.split(' — ')[0];
   if(original.topic==='oral')q.stem=`${drug}은 경구 투여로 전신 감염을 치료할 수 있다. (O/X)`;
   if(original.topic==='bbb')q.stem=`수막에 염증이 있을 때, ${drug}은 BBB를 잘 통과하여 CSF로 이행한다. (O/X)`;
   if(original.topic==='pregnancy')q.stem=`${drug}은 임신부의 세균감염 치료에서 비교적 안전하게 선택할 수 있다. (O/X)`;
   if(original.topic==='cases')q.stem=caseOX[original.id.slice(-2)];
  }
  return q;
 });
}
