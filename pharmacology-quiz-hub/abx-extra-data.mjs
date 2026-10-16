// Lecture 27: only named drugs taught in the supplied lecture PDF.
// Mechanism keys describe antimicrobial targets, not human CYP drug interactions.
const source = page => `27강 강의록 PDF ${page}쪽`;
const drug = (id, name, family, targets, note, page, core = true, weight = 2) =>
  ({id, name, lecture:27, family, targets, note, source:source(page), core, weight});
const TB = '항마이코박테리아', FUNGUS = '항진균', VIRUS = '항바이러스';
const azole = '진균 lanosterol 14α-demethylase 억제 → ergosterol 합성 감소';

export const DRUGS = [
  drug('isoniazid','Isoniazid',TB,['mycolic'],'Mycolic acid 합성 억제. NAT에 의해 불활성화되며 pyridoxine(B6) 결핍·말초신경염 및 간독성과 연결한다.',8,true,3),
  drug('rifampin','Rifampin',TB,['rnap'],'세균 RNA polymerase 억제. 간 미세소체 효소 유도에 따른 병용약 상호작용과 붉은색 소변·눈물을 연결한다.',9,true,3),
  drug('ethambutol','Ethambutol',TB,['arabinosyl'],'Arabinosyl transferase 억제로 세포벽을 약화하는 정균성 약물. 특징적 유해반응은 시신경염이다.',10,true,3),
  drug('pyrazinamide','Pyrazinamide',TB,['pza'],'Pyrazinoic acid로 전환되는 전구약물. 강의에서는 막전위·에너지 생산 교란을 제시하며 정확한 작용기전은 완전히 규명되지 않았다고 설명한다. 간독성·관절통에 주의한다.',11,true,3),
  drug('bedaquiline','Bedaquiline',TB,['atpsynthase'],'결핵균 ATP synthase를 억제하여 ATP 합성을 방해한다. 강의의 2차 약물 확장 범위.',12,false,1),
  drug('delamanid','Delamanid',TB,['mycolic'],'Mycolic acid 합성을 억제하는 2차 항결핵제. Isoniazid와 공유하는 세포벽 합성 기전을 연결한다.',12,false,1),
  drug('amphotericin-b','Amphotericin B',FUNGUS,['ergosterol'],'Ergosterol에 결합해 막 통로를 형성하고 이온을 누출시킨다. 위장관 흡수가 낮고 치료역이 좁다.',17,true,3),
  drug('nystatin','Nystatin',FUNGUS,['ergosterol'],'Ergosterol 결합·막 구멍 형성. Candida 국소 치료에 사용하며 경구 현탁액도 존재한다. 위장관 흡수는 거의 없어 주로 국소 효과를 낸다.',19,true,3),
  drug('ketoconazole','Ketoconazole',FUNGUS,['demethylase'],`${azole}. Imidazole 계열이며 사람 CYP3A 억제에 따른 상호작용은 항진균 표적과 구별한다.`,21,true,3),
  drug('itraconazole','Itraconazole',FUNGUS,['demethylase'],`${azole}. Triazole 계열이며 사람 CYP3A를 강하게 억제하여 병용약 노출에 영향을 줄 수 있다.`,21,true,3),
  drug('fluconazole','Fluconazole',FUNGUS,['demethylase'],`${azole}. 강의의 triazole 약물 목록에 제시된다.`,21,true,2),
  drug('voriconazole','Voriconazole',FUNGUS,['demethylase'],`${azole}. Triazole 계열로 CYP2C19에 따른 약동학적 변이가 강의의 구별점이다.`,21,true,3),
  drug('posaconazole','Posaconazole',FUNGUS,['demethylase'],`${azole}. 강의의 triazole 약물 목록에 제시된다.`,21,true,2),
  drug('acyclovir','Acyclovir',VIRUS,['dna_pol'],'Guanosine 유사체. 활성형 acyclovir triphosphate가 바이러스 DNA polymerase를 억제하여 DNA 합성을 방해한다. HSV·VZV와 연결한다.',28,true,3),
  drug('tenofovir','Tenofovir',VIRUS,['dna_pol','rt'],'활성형 tenofovir diphosphate가 DNA 사슬 종결을 유도한다. HBV DNA polymerase와 HIV 역전사효소 양쪽 표적을 인정한다.',30,true,3),
  drug('lamivudine','Lamivudine',VIRUS,['dna_pol','rt'],'활성형 lamivudine triphosphate가 HBV DNA polymerase와 HIV 역전사효소를 억제한다. HBV·HIV 두 감염과 연결한다.',31,true,3),
  drug('glecaprevir','Glecaprevir',VIRUS,['hcv_protease'],'HCV NS3/4A protease 억제제. 바이러스 polyprotein 절단·성숙을 방해하며 pibrentasvir와의 병합이 강의에 제시된다.',33,true,2),
  drug('pibrentasvir','Pibrentasvir',VIRUS,['ns5a'],'HCV NS5A 억제제. HCV 복제 복합체의 기능을 방해하며 glecaprevir와의 병합이 강의에 제시된다.',33,true,2),
  drug('sofosbuvir','Sofosbuvir',VIRUS,['ns5b'],'HCV NS5B RNA polymerase 억제제. Velpatasvir와의 병합이 강의에 제시된다.',33,true,2),
  drug('velpatasvir','Velpatasvir',VIRUS,['ns5a'],'HCV NS5A 억제제. Sofosbuvir의 NS5B 표적과 구별한다.',33,true,2),
  drug('ribavirin','Ribavirin',VIRUS,['viral_rnap'],'Guanosine 유사체. 강의는 triphosphate 활성형과 RNA-dependent RNA polymerase 억제를 제시하며 HCV 치료와 연결한다.',34,true,2),
  drug('amantadine','Amantadine',VIRUS,['m2'],'Influenza M2 이온통로 차단제. 강의에서는 내성 때문에 사용이 제한된다고 설명한다.',36,false,1),
  drug('rimantadine','Rimantadine',VIRUS,['m2'],'Amantadine과 같은 M2 이온통로 차단제. 강의의 내성에 따른 사용 제한을 함께 연결한다.',36,false,1),
  drug('oseltamivir','Oseltamivir',VIRUS,['neuraminidase'],'경구 neuraminidase 억제제. Influenza A·B의 방출을 방해하며 간 esterase에 의해 활성화된다.',37,true,3),
  drug('zanamivir','Zanamivir',VIRUS,['neuraminidase'],'흡입 투여하는 influenza neuraminidase 억제제. Oseltamivir(경구), peramivir(정맥)와 경로를 구별한다.',36,true,2),
  drug('peramivir','Peramivir',VIRUS,['neuraminidase'],'정맥 투여하는 influenza neuraminidase 억제제. 바이러스 DNA polymerase 억제제와 구별한다.',36,true,2),
  drug('baloxavir','Baloxavir',VIRUS,['endonuclease'],'Influenza endonuclease 억제제. Neuraminidase 억제제 및 M2 이온통로 차단제와 구별한다.',36,true,2),
  drug('zidovudine','Zidovudine',VIRUS,['rt'],'NRTI. 세포 내 인산화로 활성화되어 HIV 역전사효소를 억제한다. HIV 약물 확장 범위.',40,false,1),
  drug('abacavir','Abacavir',VIRUS,['rt'],'NRTI. 세포 내 활성화 과정을 거쳐 HIV 역전사효소를 억제한다. HIV 약물 확장 범위.',40,false,1),
  drug('emtricitabine','Emtricitabine',VIRUS,['rt'],'NRTI. 세포 내 인산화로 활성화되어 HIV 역전사효소를 억제한다. HIV 약물 확장 범위.',40,false,1),
  drug('efavirenz','Efavirenz',VIRUS,['rt'],'NNRTI. HIV 역전사효소에 직접 결합하며 활성화를 위한 인산화가 필요 없다.',41,false,1),
  drug('rilpivirine','Rilpivirine',VIRUS,['rt'],'NNRTI. 인산화 활성화 없이 HIV 역전사효소를 억제한다.',41,false,1),
  drug('nevirapine','Nevirapine',VIRUS,['rt'],'NNRTI. 인산화 활성화 없이 HIV 역전사효소를 억제한다.',41,false,1),
  drug('delavirdine','Delavirdine',VIRUS,['rt'],'NNRTI. 강의에 제시된 역전사효소 억제제이며 활성화를 위한 인산화가 필요 없다.',41,false,1),
  drug('ritonavir','Ritonavir',VIRUS,['hiv_protease'],'HIV protease 억제로 polyprotein 전구체의 절단·성숙을 방해한다. 역전사효소 억제제와 구별한다.',43,false,1),
  drug('atazanavir','Atazanavir',VIRUS,['hiv_protease'],'HIV protease 억제로 바이러스 단백질 전구체의 절단·성숙을 방해한다.',43,false,1),
  drug('darunavir','Darunavir',VIRUS,['hiv_protease'],'HIV protease 억제로 바이러스 단백질 전구체의 절단·성숙을 방해한다.',43,false,1),
  drug('lopinavir','Lopinavir',VIRUS,['hiv_protease'],'HIV protease 억제제. DNA 합성 효소를 직접 억제하는 약물과 구별한다.',43,false,1),
  drug('amprenavir','Amprenavir',VIRUS,['hiv_protease'],'강의의 HIV protease 억제제 목록. 단백질 전구체 절단을 방해한다.',43,false,1),
  drug('maraviroc','Maraviroc',VIRUS,['ccr5'],'숙주 CCR5 보조수용체 길항으로 HIV 진입을 억제한다. Enfuvirtide의 gp41 표적과 구별한다.',44,false,1),
  drug('enfuvirtide','Enfuvirtide',VIRUS,['fusion'],'바이러스 gp41에 결합하여 HIV 막과 숙주 세포막의 융합을 억제한다. 강의 본문의 co-receptor 표현은 공식 허가문서에 따라 교정했다.',45,false,1),
  drug('raltegravir','Raltegravir',VIRUS,['integrase'],'HIV integrase 억제로 바이러스 DNA가 숙주 염색체에 통합되는 단계를 방해한다.',46,false,1),
  drug('dolutegravir','Dolutegravir',VIRUS,['integrase'],'HIV integrase 억제제. 역전사 이후의 숙주 염색체 통합 단계와 연결한다.',46,false,1),
  drug('elvitegravir','Elvitegravir',VIRUS,['integrase'],'HIV integrase 억제제. Protease에 의한 단백질 성숙 단계와 구별한다.',46,false,1)
];

const question = (id, group, subject, stem, answer, wrong, note, page, core = true, weight = 2) =>
  ({id:`extra-${id}`, lecture:27, group, subject, stem, answer, options:[answer,...wrong], note, source:source(page), core, weight});

export const QUESTIONS = [
  question('isoniazid-wall','mechanism','isoniazid','Isoniazid가 결핵균의 세포벽 합성을 억제하는 기전은?','Mycolic acid 합성 억제',['Arabinosyl transferase 억제','RNA polymerase 억제','ATP synthase 억제','DNA gyrase 억제'],'Isoniazid는 세포벽 성분인 mycolic acid의 합성을 억제한다. Ethambutol의 arabinosyl transferase, rifampin의 RNA polymerase와 구별한다.',8,true,3),
  question('isoniazid-nat','pkpd','isoniazid','Isoniazid의 불활성화와 관련된 효소는?','N-acetyltransferase',['Neuraminidase','HIV integrase','Arabinosyl transferase','HCV NS3/4A protease'],'Isoniazid는 NAT에 의해 불활성화된다. 약물 대사 효소와 미생물의 약물 표적을 구별한다.',8,true,3),
  question('isoniazid-b6','clinical','isoniazid','Isoniazid 사용 중 말초신경염과 연결해 학습할 비타민 결핍은?','Pyridoxine(B6) 결핍',['Thiamine(B1) 결핍','Niacin(B3) 결핍','Cobalamin(B12) 결핍','Ascorbic acid(C) 결핍'],'Isoniazid는 pyridoxal과 hydrazone을 형성하여 B6 결핍을 유발할 수 있다. 강의는 이를 말초신경염과 연결한다.',8,true,3),
  question('rifampin-rna','mechanism','rifampin','Rifampin이 결핵균의 전사를 방해하는 표적은?','RNA polymerase',['DNA polymerase','Arabinosyl transferase','ATP synthase','DNA gyrase'],'Rifampin은 RNA polymerase를 억제한다. DNA polymerase 억제제로 바꾸어 외우지 않는다.',9,true,3),
  question('rifampin-induction','pkpd','rifampin','Rifampin 병용으로 간 대사효소가 유도되었다. 그 효소로 대사되는 병용약에서 예상할 변화는?','대사 증가·노출 감소 가능',['대사 감소·노출 증가 가능','흡수 증가·노출 증가 가능','배설 억제·노출 증가 가능','단백결합 증가·대사 소실'],'Rifampin은 간 미세소체 효소를 유도한다. 해당 효소의 기질인 병용약은 대사가 빨라져 노출과 효과가 감소할 수 있다.',9,true,3),
  question('rifampin-fluid','clinical','rifampin','결핵 치료 중 소변과 눈물이 붉은색으로 변했다. 강의에서 이 현상과 연결한 약물은?','Rifampin',['Isoniazid','Ethambutol','Pyrazinamide','Delamanid'],'강의는 rifampin의 특징으로 붉은색 소변·눈물을 제시한다. 같은 약물의 효소 유도와 상호작용도 함께 기억한다.',9,true,3),
  question('ethambutol-wall','mechanism','ethambutol','Ethambutol의 직접적인 약물 표적은?','Arabinosyl transferase',['RNA polymerase','DNA polymerase','ATP synthase','Lanosterol demethylase'],'Ethambutol은 arabinosyl transferase를 억제하여 결핵균 세포벽을 약화한다. 강의에서는 정균성 효과로 설명한다.',10,true,3),
  question('ethambutol-vision','clinical','ethambutol','항결핵제와 특징적 유해반응의 연결이 옳은 것은?','Ethambutol - 시신경염',['Isoniazid - 청색 눈물','Rifampin - B6 결핍','Pyrazinamide - 회색치아','Delamanid - 적색 눈물'],'강의에서 ethambutol의 특징적 유해반응은 시신경염이다. B6 결핍은 isoniazid, 붉은색 소변·눈물은 rifampin과 연결한다.',10,true,3),
  question('pyrazinamide-active','pkpd','pyrazinamide','Pyrazinamide가 전환되어 작용하는 활성형은?','Pyrazinoic acid',['Pyridoxal phosphate','Mycolic acid','Tenofovir diphosphate','Acyclovir triphosphate'],'Pyrazinamide는 pyrazinoic acid로 전환되는 전구약물이다. 정확한 기전이 완전히 밝혀졌다고 단정하지 않는다.',11,true,3),
  question('pyrazinamide-energy','mechanism','pyrazinamide','강의에서 pyrazinamide의 작용으로 제시한 것은?','막전위·에너지 생산 교란',['RNA 전사 직접 차단','Arabinosyl 전이 억제','Ribosome 30S 결합','ATP synthase 선택 억제'],'강의는 pyrazinamide의 정확한 기전은 완전히 규명되지 않았다고 밝히면서 막전위와 에너지 생산 교란을 제시한다. ATP synthase 억제는 bedaquiline과 연결한다.',11,true,3),
  question('tb-combination','resistance','tb-combination','결핵 치료에서 여러 기전의 약물을 병용하는 근거로 적절한 것은?','내성균의 선택·증식 억제',['균 분열속도의 강제 증가','약물 과민반응의 소멸','병용약 상호작용의 소멸','결핵균 잠복기의 단축'],'강의는 일부 균이 특정 약물에 내성을 가질 수 있으므로 병용요법이 필요하다고 설명한다. 단일 약물에 내성인 균의 선택·증식을 줄이는 원리다.',5,true,3),
  question('bedaquiline-atp','mechanism','bedaquiline','강의에 제시된 Bedaquiline의 기전은?','ATP synthase 억제',['RNA polymerase 억제','Arabinosyl transferase 억제','DNA gyrase 억제','Ribosome 50S 억제'],'Bedaquiline은 ATP 합성을 방해하는 항결핵제다. 강의의 2차 약물 확장 범위로 분류한다.',12,false,1),
  question('delamanid-wall','mechanism','delamanid','강의에서 Delamanid와 Isoniazid가 공유하는 기전은?','Mycolic acid 합성 억제',['RNA polymerase 억제','ATP synthase 억제','DNA gyrase 억제','Arabinosyl transferase 억제'],'Delamanid와 isoniazid는 강의에서 mycolic acid 합성 억제로 설명된다. Delamanid는 2차 항결핵제 확장 범위다.',12,false,1),
  question('tb-slow-growth','pkpd','tb-slow-growth','강의가 결핵의 장기간 치료를 설명하며 강조한 균의 특징은?','성장·분열 속도가 느림',['간 CYP 효소를 직접 생성','신장으로만 균이 분포','바이러스처럼 숙주 DNA에 통합','사람 세포막 sterol을 합성'],'결핵균은 상대적으로 성장·분열이 느리기 때문에 장기간 치료가 필요하다는 것이 강의의 설명이다.',5,true,2),
  question('amphotericin-pore','mechanism','amphotericin-b','Amphotericin B가 진균을 손상시키는 기전은?','Ergosterol 결합·막 통로 형성',['Lanosterol demethylase 억제','진균 RNA polymerase 억제','진균 DNA gyrase 억제','진균 arabinosyl 전이 억제'],'Amphotericin B는 기존 막의 ergosterol에 결합해 이온이 누출되는 통로를 형성한다. Azole의 ergosterol 합성 억제와 구별한다.',17,true,3),
  question('amphotericin-kidney','clinical','amphotericin-b','Amphotericin B 사용과 강의에서 중요하게 연결한 유해반응은?','신독성·질소혈증',['시신경염·시력 변화','B6 결핍·말초신경염','붉은색 눈물·소변','치아 착색·뼈 성장 장애'],'Amphotericin B는 치료역이 좁고 신독성이 중요하다. 강의는 질소혈증과 erythropoietin 감소에 따른 빈혈도 제시한다.',18,true,3),
  question('amphotericin-absorption','pkpd','amphotericin-b','Amphotericin B의 강의상 약동학적 특징은?','위장관 흡수가 낮음',['경구 흡수가 거의 완전함','CYP2C19로만 제거됨','NAT에 의해 불활성화됨','간 esterase로 활성화됨'],'강의는 amphotericin B의 낮은 위장관 흡수와 좁은 치료역을 강조한다. NAT 불활성화는 isoniazid, 간 esterase 활성화는 oseltamivir와 연결한다.',17,true,2),
  question('nystatin-local','clinical','nystatin','구강 Candida 감염에 쓰는 Nystatin 경구 현탁액의 특징은?','흡수가 거의 없어 국소 작용',['흡수가 높아 전신 작용','NAT 활성화로 전신 작용','간 CYP 유도로 국소 작용','NS5A 억제로 국소 작용'],'Nystatin은 국소 치료제이며 경구 현탁액도 존재한다. 위장관 흡수가 거의 없으므로 경구 투여를 전신 항진균 효과로 해석하지 않는다. 공식 허가문서로 크림만 있다는 요약의 표현을 교정했다.',19,true,3),
  question('azole-demethylase','mechanism','azole-target','Azole이 진균의 sterol 합성을 직접 억제하는 표적은?','Lanosterol 14α-demethylase',['사람의 CYP3A 대사효소','진균의 RNA polymerase','진균의 ATP synthase','바이러스의 neuraminidase'],'Azole의 항진균 표적은 진균 lanosterol 14α-demethylase다. 사람 CYP3A 억제에 따른 병용약 상호작용과 별개의 내용이다. 강의 그림의 demethylase와 공식 허가문서를 대조했다.',20,true,3),
  question('itraconazole-interaction','pkpd','itraconazole','Itraconazole과 CYP3A로 대사되는 약물을 병용할 때 연결할 변화는?','대사 억제·노출 증가 가능',['대사 유도·노출 감소 가능','신장 배설 증가·노출 감소','흡수 차단·노출 소실','효소 분해·표적 단백질 소실'],'강의는 itraconazole의 강한 CYP3A 억제를 제시한다. 해당 효소로 대사되는 병용약은 노출이 증가할 수 있다. Rifampin의 효소 유도와 방향을 구별한다.',21,true,3),
  question('ketoconazole-subclass','mechanism','ketoconazole','강의의 Azole 분류에서 Imidazole에 속하는 약물은?','Ketoconazole',['Itraconazole','Fluconazole','Voriconazole','Posaconazole'],'강의는 ketoconazole을 imidazole로, 나머지 네 약물을 triazole로 분류한다. Ketoconazole의 사람 CYP3A 억제도 별도로 제시한다.',21,true,2),
  question('voriconazole-cyp','pkpd','voriconazole','Voriconazole의 약동학적 개인차와 강의에서 연결한 효소는?','CYP2C19',['CYP2D6','N-acetyltransferase','Neuraminidase','Arabinosyl transferase'],'강의는 voriconazole의 약동학적 변이가 CYP2C19와 관련된다고 설명한다. 복원 기출의 CYP2D6 선지와 구별한다.',21,true,3),
  question('acyclovir-active','pkpd','acyclovir','바이러스 DNA 합성을 억제하는 Acyclovir의 활성 대사형은?','Acyclovir triphosphate',['Acyclovir monophosphate','Tenofovir diphosphate','Pyrazinoic acid','Pyridoxal phosphate'],'강의는 acyclovir가 대사되어 triphosphate 활성형으로 작용한다고 설명한다. 약물명과 활성형의 인산화 상태를 연결한다.',28,true,2),
  question('acyclovir-polymerase','mechanism','acyclovir','HSV·VZV와 연결하여 학습하는 Acyclovir의 표적은?','바이러스 DNA polymerase',['바이러스 neuraminidase','HCV NS3/4A protease','HIV integrase','Influenza M2 통로'],'활성화된 acyclovir는 바이러스 DNA polymerase를 억제하고 바이러스 DNA 합성을 방해한다. Influenza 방출 억제제인 oseltamivir와 구별한다.',28,true,3),
  question('acyclovir-intravenous','clinical','acyclovir','강의가 Acyclovir 정맥 투여와 연결한 유해반응은?','신기능 저하·신경독성',['시신경염·B6 결핍','치아 착색·관절 성장 억제','적색 눈물·적색 소변','CYP 유도·병용약 대사 증가'],'강의는 정맥 acyclovir 투여 시 신기능 저하 또는 신경독성을 제시한다. 이를 약물의 투여 경로와 연결한다.',29,true,2),
  question('tenofovir-dual','mechanism','tenofovir','Tenofovir의 HBV·HIV 작용 표적을 옳게 연결한 것은?','HBV DNA polymerase·HIV 역전사효소',['HBV NS5A·HIV 역전사효소','HBV DNA polymerase·HIV CCR5','HBV NS3/4A·HIV integrase','HBV neuraminidase·HIV protease'],'Tenofovir는 활성형 diphosphate로 DNA 사슬 종결을 유도한다. HBV DNA polymerase와 HIV 역전사효소는 둘 다 유효 표적이므로 어느 하나를 오답으로 취급하지 않는다.',30,true,3),
  question('lamivudine-active','pkpd','lamivudine','Lamivudine의 활성형과 작용 감염을 옳게 연결한 것은?','Triphosphate - HBV·HIV',['Diphosphate - HBV·HIV','Triphosphate - Influenza','Pyrazinoic acid - 결핵','Diphosphate - Candida'],'Lamivudine은 triphosphate로 활성화되어 HBV DNA polymerase와 HIV 역전사효소를 억제한다. Tenofovir의 diphosphate 활성형과 구별한다.',31,true,3),
  question('glecaprevir-protease','mechanism','glecaprevir','Glecaprevir의 HCV 표적은?','NS3/4A protease',['NS5A 단백질','NS5B polymerase','Neuraminidase','HIV integrase'],'Glecaprevir는 HCV NS3/4A protease 억제제다. HCV polyprotein의 절단·성숙을 방해한다. 강의의 약물명을 공식 복합제 허가문서와 대조했다.',33,true,2),
  question('hcv-ns5a-pair','mechanism','hcv-ns5a','HCV의 NS5A 억제제끼리 묶은 것은?','Pibrentasvir·Velpatasvir',['Glecaprevir·Sofosbuvir','Glecaprevir·Velpatasvir','Pibrentasvir·Sofosbuvir','Sofosbuvir·Lamivudine'],'Pibrentasvir와 velpatasvir는 NS5A 억제제다. Glecaprevir는 NS3/4A, sofosbuvir는 NS5B 표적이므로 병합 약물들의 표적을 구별한다.',33,true,2),
  question('sofosbuvir-ns5b','mechanism','sofosbuvir','HCV RNA polymerase인 NS5B를 억제하는 강의 약물은?','Sofosbuvir',['Glecaprevir','Pibrentasvir','Velpatasvir','Oseltamivir'],'Sofosbuvir는 HCV NS5B polymerase 억제제다. 강의의 sofosbuvir/velpatasvir 병합은 NS5B와 NS5A라는 서로 다른 표적을 연결한다.',33,true,2),
  question('ribavirin-polymerase','mechanism','ribavirin','강의에서 Ribavirin의 기전으로 제시한 것은?','RNA 의존성 RNA polymerase 억제',['Influenza neuraminidase 억제','HIV integrase 억제','Influenza M2 이온통로 차단','HCV NS5A 기능 억제'],'강의는 ribavirin을 guanosine 유사체로 소개하고, triphosphate 활성형이 RNA-dependent RNA polymerase를 억제한다고 설명한다.',34,true,2),
  question('influenza-m2-resistance','resistance','m2-blockers','강의가 내성으로 사용이 제한된다고 설명한 Influenza 약물군은?','M2 이온통로 차단제',['Neuraminidase 억제제','Endonuclease 억제제','HCV NS5A 억제제','HIV integrase 억제제'],'Amantadine과 rimantadine은 M2 이온통로 차단제이며 강의에서 내성에 따른 사용 제한을 명시한다.',36,false,1),
  question('oseltamivir-release','mechanism','oseltamivir','Oseltamivir가 Neuraminidase를 억제해 방해하는 단계는?','감염 세포에서 바이러스 방출',['바이러스 RNA의 DNA 역전사','바이러스 DNA의 숙주 통합','바이러스 막과 숙주막 융합','HCV polyprotein의 절단'],'Oseltamivir는 neuraminidase를 억제하여 influenza 바이러스가 감염 세포에서 방출되고 다른 세포로 퍼지는 과정을 방해한다. RNA polymerase 억제제로 분류하지 않는다.',37,true,3),
  question('zanamivir-route','clinical','zanamivir','강의에서 흡입 투여로 제시한 Influenza 약물은?','Zanamivir',['Oseltamivir','Peramivir','Amantadine','Baloxavir'],'강의는 zanamivir를 흡입, oseltamivir를 경구, peramivir를 정맥 투여로 구별한다. 세 약물 모두 neuraminidase 억제제다.',36,true,2),
  question('baloxavir-target','mechanism','baloxavir','Baloxavir와 연결되는 Influenza 표적은?','Endonuclease',['Neuraminidase','M2 이온통로','NS5A 단백질','DNA polymerase'],'Baloxavir는 endonuclease 억제제다. Oseltamivir의 neuraminidase 및 amantadine의 M2 이온통로와 구별한다.',36,true,2),
  question('nrtis-activation','pkpd','nrtis','강의의 NRTI 활성화 과정으로 옳은 것은?','세포 내 kinase에 의한 인산화',['인산화 없이 직접 CCR5 결합','간 NAT에 의한 acetylation','바이러스 protease에 의한 절단','장내에서 pyrazinoic acid 전환'],'강의는 NRTI가 세포 내 kinase에 의한 인산화 과정을 거쳐 활성화된다고 설명한다. NNRTI와 공유하는 최종 표적은 역전사효소지만 활성화 과정이 다르다.',40,false,1),
  question('efavirenz-activation','pkpd','efavirenz','NNRTI인 Efavirenz의 특징은?','인산화 없이 역전사효소 억제',['인산화 후 역전사효소 억제','인산화 없이 HIV protease 억제','인산화 후 HIV integrase 억제','인산화 없이 CCR5 길항'],'NNRTI인 efavirenz는 HIV 역전사효소에 직접 결합하며 활성화를 위한 인산화가 필요 없다. NRTI와 최종 표적은 같으므로 표적명만으로 둘을 나누지 않는다.',41,false,1),
  question('ritonavir-maturation','mechanism','ritonavir','Ritonavir의 HIV protease 억제로 직접 방해받는 과정은?','Polyprotein 전구체의 절단',['RNA 유전체의 역전사','DNA의 숙주 염색체 통합','CCR5 보조수용체 결합','gp41에 의한 세포막 융합'],'Ritonavir는 HIV protease를 억제하여 단백질 전구체의 절단·성숙을 방해한다. 역전사효소 억제제로 분류하지 않는다.',43,false,1),
  question('maraviroc-receptor','mechanism','maraviroc','Maraviroc가 길항하는 HIV 진입 관련 표적은?','숙주 CCR5 보조수용체',['바이러스 gp41','바이러스 integrase','바이러스 역전사효소','바이러스 protease'],'Maraviroc는 CCR5 길항제다. 숙주 보조수용체 표적과 enfuvirtide의 바이러스 gp41 표적을 구별한다.',44,false,1),
  question('enfuvirtide-target','mechanism','enfuvirtide','Enfuvirtide가 HIV 막의 융합을 억제하는 직접 표적은?','바이러스 gp41',['숙주 CCR5','바이러스 integrase','바이러스 역전사효소','바이러스 protease'],'Enfuvirtide는 HIV gp41에 결합하는 융합 억제제다. PDF 본문의 co-receptor 표현은 공식 허가문서에 따라 바로잡았다. CCR5 길항제는 maraviroc다.',45,false,1),
  question('raltegravir-stage','mechanism','raltegravir','Raltegravir의 Integrase 억제로 방해받는 과정은?','바이러스 DNA의 숙주 염색체 통합',['바이러스 RNA의 DNA 역전사','Polyprotein 전구체의 절단','바이러스 입자의 세포 밖 방출','바이러스 막과 숙주막의 융합'],'HIV integrase는 역전사로 생성된 바이러스 DNA를 숙주 염색체에 통합한다. Raltegravir는 이 단계를 억제하며 protease 억제제의 성숙 억제와 구별한다.',46,false,1)
];

// These references are correction evidence, not additions to the lecture's drug scope.
export const SOURCE_CORRECTIONS = [
  {id:'viral-treatment',source:source(25),note:'요약의 HIV·HBV·HCV에는 항바이러스제가 무의미하다는 문장은 강의 본문과 반대다. 강의는 이 감염들이 심각한 질환을 유발할 수 있어 적극적 치료가 필요하다고 설명한다.',urls:[]},
  {id:'azole-target',source:source(20),note:'20쪽 필기의 fungal CYP3A 표현 대신 진균 lanosterol 14α-demethylase를 표적으로 사용한다. 사람 CYP3A 억제 상호작용과 구별한다.',urls:['https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d2acccda-8068-46c1-8562-950d7f70ee06']},
  {id:'nystatin-route',source:source(19),note:'Topical use는 전신 치료와 구별되는 국소 작용을 뜻한다. 크림 제형만 존재한다는 요약은 틀리며 비흡수성 경구 현탁액도 구강 Candida 감염에 사용한다.',urls:['https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4a670371-d373-1ba6-e063-6394a90a13b6']},
  {id:'enfuvirtide-target',source:source(45),note:'45쪽 본문의 co-receptors 표현은 gp41 융합 억제로 교정한다. CCR5 길항은 44쪽 maraviroc다.',urls:['https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=6935e846-d5a1-49e5-89a2-f8ebe4d5590d']},
  {id:'hcv-targets',source:source(33),note:'강의에서 이름만 제시된 병합 약물의 개별 기전은 공식 허가문서로 대조했다: glecaprevir=NS3/4A, pibrentasvir=NS5A, sofosbuvir=NS5B, velpatasvir=NS5A.',urls:['https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7bf99777-0401-9095-8645-16c6e907fcc0','https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d0c1a945-4440-4b5c-81aa-693ed3db597c']}
];
