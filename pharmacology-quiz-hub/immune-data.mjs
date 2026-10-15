// Source: 2026 lecture 28, supplied summary images, and past exams (PDF 67–68).
// Each target key describes the relationship actually tested, not every action of a drug.
const rows=[];
function drug(id,name,section,key,target,binding,note,clinical,risk,pages,exam='',weight=1){rows.push({id,name,section,key,target,binding,note,clinical,risk,source:`28강 강의록 PDF ${pages}쪽`,exam,core:Boolean(exam),weight});}
drug('cyclosporine','Cyclosporine','CNI·mTOR·JAK','calcineurin','Calcineurin','Cyclophilin','Cyclophilin과 결합한 복합체가 calcineurin의 phosphatase 활성을 억제합니다. NFAT 탈인산화와 IL-2 전사가 감소합니다.','이식·자가면역질환','신독성 · 다모증 · 치은비대증','21·26–30','족보 2025·2020·2019',4);
drug('tacrolimus','Tacrolimus','CNI·mTOR·JAK','calcineurin','Calcineurin','FKBP12','FKBP12와 결합한 복합체가 calcineurin을 억제합니다. 같은 FKBP12에 결합하는 sirolimus와 효과 표적이 다릅니다.','이식·자가면역질환','신독성 · 고혈당·당뇨','21·26–30','족보 2023·2020',3);
drug('sirolimus','Sirolimus (Rapamycin)','CNI·mTOR·JAK','mtor','mTOR','FKBP12','FKBP12–sirolimus 복합체가 mTOR를 억제하여 IL-2 신호에 따른 세포주기 진행·증식을 억제합니다. Calcineurin 억제제가 아닙니다.','이식 관련 면역억제','상처 치유 지연','21·27–30','족보·강의 강조',3);
drug('everolimus','Everolimus','CNI·mTOR·JAK','mtor','mTOR','FKBP12','Sirolimus와 함께 FKBP 복합체를 통한 mTOR 억제제로 제시됩니다. IL-2 생성 억제와 증식 신호 억제를 구별합니다.','이식 관련 면역억제','강의록의 기전 중심으로 복습','20–21·28');
drug('tofacitinib','Tofacitinib','CNI·mTOR·JAK','jak','JAK1·JAK3','—','강의에서 대표 JAK 억제제로 강조했습니다. JAK/STAT 신호를 억제하며 CNI·mTOR 억제제와 구별합니다.','자가면역질환','강의록의 표적 중심으로 복습','29–30','올해 강의 강조');
for(const [id,name] of [['methylprednisolone','Methylprednisolone'],['prednisolone','Prednisolone'],['prednisone','Prednisone']])drug(id,name,'Steroid·항대사','gr','Glucocorticoid receptor (GR)','—','GR을 통한 염증성 유전자·MHC II 발현 억제와 PLA₂ 경로 억제를 연결합니다. CNI와 AZA 또는 MMF를 더한 3제 요법에 포함됩니다.','면역억제 3제 요법','고혈당 등 steroid 관련 부작용','24–25',id==='prednisolone'?'올해 강의 강조':'');
drug('aza','Azathioprine (AZA)','Steroid·항대사','purine','6-MP 전환 → purine de novo 합성 억제','—','6-MP로 전환되는 전구약물입니다. HGPRT는 대사 활성화에 관여하므로 HGPRT 자체를 억제한다고 외우지 않습니다.','이식 3제 요법','효소명 단순 암기보다 전환·합성 억제 관계','31·34','족보 2023',2);
drug('mmf','Mycophenolate mofetil (MMF)','Steroid·항대사','impdh','MPA 전환 → IMPDH 억제','—','활성체 MPA(mycophenolic acid)가 IMPDH를 억제하여 guanine nucleotide의 de novo 합성을 줄입니다. MMF 자체를 guanine analog로 분류하지 않습니다.','이식 3제 요법','사진의 IMPDH와 강의록의 철자 오기 구별','32·34','족보 2023',2);
drug('mtx','Methotrexate (MTX)','Steroid·항대사','dhfr','DHFR 억제 · 핵산 합성 감소','—','엽산 대사·핵산 합성 억제를 연결합니다. 항염증 작용에서는 adenosine 증가, 염증성 cytokine 감소·항염증성 cytokine 증가 방향을 구별합니다.','자가면역질환·항암','v3에서 cytokine 증감 방향이 수정됨','33–34');
drug('atg','ATG','세포·표면항원','polyt','다수 T세포 표면항원 · 다클론 항체','—','Antithymocyte globulin은 여러 표면항원에 반응하는 polyclonal antibody로 T세포를 고갈시킵니다. OKT3와 다클론·단클론을 바꾸지 않습니다.','이식 관련 면역억제','강한 면역억제와 부작용','35·44','족보 2022·2020',3);
drug('okt3','Muromonab-CD3 (OKT3)','세포·표면항원','cd3','CD3','—','CD3 표적 단클론 항체입니다. TCR 신호 조절·T세포 고갈과 급성 거부반응 억제를 연결합니다.','강의·족보의 급성 거부반응 분류','Cytokine release syndrome · 감염 위험','36·44','족보 2022·2020',3);
drug('basiliximab','Basiliximab','세포·표면항원','cd25','CD25 (IL-2Rα)','—','IL-2 자체가 아니라 IL-2 수용체의 α 사슬인 CD25에 결합합니다. IL-2에 의한 T세포 활성화를 억제합니다.','이식 관련 IL-2R 차단','CD2 표적 약물과 구별','21·37·44','족보 2020·강의 강조',3);
drug('daclizumab','Daclizumab','세포·표면항원','cd25','CD25 (IL-2Rα)','—','강의·과거 족보의 CD25 표적 항체입니다. 본 연습은 표적 분류를 다루며 현재 처방 여부를 묻지 않습니다.','강의·과거 족보의 표적 분류','IL-2와 IL-2 수용체를 구별','37·44','족보·강의 강조',2);
drug('alemtuzumab','Alemtuzumab','세포·표면항원','cd52','CD52','—','CD52는 T세포 외 B세포·NK세포 등에도 존재합니다. 자료의 CLL은 치료 용도이며 백혈병 발생 부작용으로 옮겨 외우지 않습니다.','강의록의 CLL·MS 및 면역세포 고갈 분류','여러 면역세포에 영향을 줌','38·44','족보 2023·2022·2021·2020',3);
drug('rituximab','Rituximab','세포·표면항원','cd20','CD20 (B세포)','—','B세포의 CD20을 표적으로 하는 항체입니다. Alefacept의 CD2, alemtuzumab의 CD52와 구별합니다.','강의록의 RA 표','B세포 표적을 T세포 CD 항원과 구별','46·49');
drug('abatacept','Abatacept (CTLA-4-Ig)','융합·부착','b7','B7 (CD80·CD86)','—','CTLA-4–Ig 융합단백질로 APC의 B7에 결합하여 CD28 공동자극을 차단합니다. CD28에 직접 결합한다고 바꾸지 않습니다.','강의록의 RA 분류','단클론 항체와 융합단백질 구별','19·40·44·46','족보 2025·2021·2019',4);
drug('alefacept','Alefacept (LFA-3-Ig)','융합·부착','cd2','CD2','—','LFA-3–Ig 융합단백질로 CD2에 결합하여 CD2–LFA-3 상호작용을 막습니다. 사진 본문의 CD20 표기는 CD2로 바로잡습니다.','강의·족보의 표적 분류','Efalizumab의 CD11a와 구별','41·44','족보 2023·2021·2020',3);
drug('efalizumab','Efalizumab','융합·부착','cd11a','CD11a (LFA-1)','—','CD11a에 결합하여 LFA-1–ICAM-1 상호작용과 T세포 이동을 억제합니다. LFA-3–Ig는 alefacept입니다.','강의·과거 족보의 표적 분류','CD2·CD11a·α4 integrin 구별','42·44','족보 2023·2021·2020',3);
drug('natalizumab','Natalizumab','융합·부착','a4','α4 integrin','—','α4 integrin에 결합하여 VCAM-1과의 결합·침윤을 억제합니다. VCAM-1 자체가 약물의 직접 결합 표적은 아닙니다.','강의록의 MS·Crohn 분류','혈관 부착·침윤 억제','43–44','족보 2022·2021',2);
drug('etanercept','Etanercept (Enbrel)','Cytokine 표적','tnf','TNF 차단','—','TNF 수용체–IgG Fc 융합단백질로 TNF를 포획합니다. Anti-TNF 단클론 항체·IFN-β 제제와 구조를 구별합니다.','RA','융합단백질이라는 점에 주의','9·12·46','족보 2022·2021·2020',3);
for(const [id,name] of [['infliximab','Infliximab (Remicade)'],['adalimumab','Adalimumab (Humira)'],['certolizumab','Certolizumab'],['golimumab','Golimumab']])drug(id,name,'Cytokine 표적','tnf','TNF 차단','—','TNF-α를 표적으로 하는 항체 계열입니다. Etanercept와 TNF 억제 그룹은 같지만 수용체–Fc 융합단백질 구조와 구별합니다.','RA; infliximab·adalimumab은 자료의 Crohn 분류에도 등장','상품명과 일반명 연결','9·12·46','족보 2021·TNF 군 반복',id==='adalimumab'?3:2);
drug('tocilizumab','Tocilizumab','Cytokine 표적','il6r','IL-6 receptor','—','IL-6 수용체를 차단합니다. TNF, IL-1R, IL-17A 표적과 구별하고 IL-6R 아래의 JAK/STAT 신호 감소를 연결합니다.','자가면역·염증성 질환','IL-6 ligand와 IL-6R 구별','39·44·46','올해 강의 강조');
drug('anakinra','Anakinra','Cytokine 표적','il1r','IL-1 receptor','—','재조합 IL-1 수용체 길항제입니다. Anti-TNF 항체나 IL-6R 항체로 바꾸지 않습니다.','강의록의 RA 분류','수용체 길항제와 항체 구별','44·46','족보 2022',2);
for(const [id,name] of [['secukinumab','Secukinumab'],['ixekizumab','Ixekizumab']])drug(id,name,'Cytokine 표적','il17','IL-17A','—','IL-17A 표적 항체입니다. 강의록 자체가 RA 적응증 표기의 불일치를 지적하므로 이 퀴즈는 표적 매칭만 확인합니다.','표적 매칭 중심','RA 치료제로 단정하는 문항은 제외','44·46·49');
drug('epo','EPO','조혈·IFN·백신','rbc','Erythropoietin → 적혈구 생성','—','적혈구 생성을 촉진하여 빈혈 치료와 연결됩니다. 백혈구·호산구 증가 약물과 구별합니다.','빈혈','혈전성 질환 · 뇌졸중·심근경색 위험; 조절되지 않는 고혈압 주의','7·10·12','족보 2019',2);
drug('filgrastim','Filgrastim (rhG-CSF)','조혈·IFN·백신','neutrophil','G-CSF → 호중구 생성','—','G-CSF 제제로 호중구 감소증과 연결합니다. 호산구까지 증가하는 GM-CSF 제제 sargramostim과 구별합니다.','호중구 감소증','뼈 통증; AML 관련 경고는 치료 상황에 따라 해석','11–12','족보 2023·2022·2020',2);
drug('sargramostim','Sargramostim (rhGM-CSF)','조혈·IFN·백신','gmcsf','GM-CSF → 호중구·호산구 등 조혈세포 증가','—','GM-CSF 제제로 호중구 외 호산구 증가도 구별점입니다. 사진의 수지상세포 성숙·활성화와 대식세포 계열도 연결합니다.','호중구·호산구 감소증 관련 분류','뼈 통증 · 호산구 증가','11–12','족보 2023·2022·2020',3);
drug('mcsf','M-CSF','조혈·IFN·백신','macrophage','M-CSF → 단핵구·대식세포 계열 생성','—','단핵구·대식세포 계열과 파골세포 생성을 연결합니다. G-CSF·GM-CSF와 생성 세포를 구별합니다.','강의의 조혈성 cytokine 분류','성장인자별 생성 세포 구별','7–8·사진 1');
drug('betaseron','Betaseron','조혈·IFN·백신','ifnb1b','Interferon β-1b','—','IFN-β1b 제제로 MS와 연결합니다. TNF 억제제들을 interferon 제제로 묶지 않습니다.','MS','Avonex의 β-1a와 구별','9·12');
drug('avonex','Avonex','조혈·IFN·백신','ifnb1a','Interferon β-1a','—','IFN-β1a 제제로 MS와 연결합니다. Betaseron은 IFN-β1b입니다.','MS','IFN-β와 anti-TNF를 구별','9·12');
drug('cervarix','Cervarix','조혈·IFN·백신','hpv2','HPV 16·18','—','자료의 HPV 2가 백신 예방대상 유형입니다. Gardasil 9의 9개 유형과 비교합니다.','HPV 예방 유형 비교','100% 예방처럼 절대적인 효과 문구는 출제하지 않음','13–14·사진 1');
drug('gardasil9','Gardasil 9','조혈·IFN·백신','hpv9','HPV 6·11·16·18·31·33·45·52·58','—','자료에 제시된 9개 HPV 유형을 예방대상으로 연결합니다. 16·18형은 Cervarix와 공통입니다.','HPV 예방 유형 비교','예방대상 유형과 감염 치료를 구별','13–14·사진 1');
export const IMM_DRUGS=rows;
export const IMM_SECTIONS=[...new Set(rows.map(d=>d.section))];
export const IMM_CORRECTIONS=[
  {title:'Alefacept: CD2',text:'사진의 특징 칸에 있는 CD20 표기는 CD2로 바로잡았습니다. CD20 표적은 rituximab입니다.',url:'https://www.accessdata.fda.gov/drugsatfda_docs/label/2012/125036s0144lbl.pdf'},
  {title:'Basiliximab: CD25 = IL-2Rα',text:'IL-2 자체와 IL-2 수용체를 구별합니다. 결합 표적은 CD25입니다.',url:'https://www.accessdata.fda.gov/drugsatfda_docs/label/2003/basnov010203lb.htm'},
  {title:'AZA·MMF: 대사와 표적',text:'AZA → 6-MP, MMF → MPA → IMPDH 억제로 정리했습니다. HGPRT는 6-MP 활성화에 관여하며, MMF 자체를 guanine analog로 외우지 않습니다.',url:'https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/016324s039lbl.pdf'},
  {title:'Alemtuzumab: CLL은 치료 용도',text:'사진에서 부작용으로 옮겨진 림프구성 백혈병 표현은 강의록의 치료 용도(CLL)와 구별합니다.',url:'https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/103948s5188lbl.pdf'},
  {title:'Etanercept와 IFN-β 제제',text:'Etanercept는 TNF 수용체–Fc 융합단백질입니다. Anti-TNF 약물을 interferon 제제로 분류하지 않습니다.',url:'https://www.accessdata.fda.gov/drugsatfda_docs/label/2003/etanimm060503LB.pdf'},
  {title:'IL-17A 표적과 RA 표기',text:'Secukinumab·ixekizumab은 IL-17A 표적 매칭을 출제합니다. 강의록 46쪽이 지적한 RA 적응증 불일치는 정답의 근거로 사용하지 않습니다.',url:'https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/125504s098lbl.pdf'},
  {title:'Filgrastim과 AML 경고',text:'무조건 AML을 일으킨다/일으키지 않는다는 양자택일은 출제하지 않습니다. 공식 경고는 유방암·폐암에서 항암·방사선 치료와 함께 쓰는 상황 등의 MDS/AML 감시를 명시합니다.',url:'https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/103353s5202lbl.pdf'}
];

export function shuffle(items,random=Math.random){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
const questions=[];
function spread(items,index){const ordered=[...items.slice(index%items.length),...items.slice(0,index%items.length)],out=[],seen=new Set();for(const item of ordered)if(!seen.has(item.section)){out.push(item);seen.add(item.section);if(out.length===4)return out;}for(const item of ordered)if(!out.includes(item)){out.push(item);if(out.length===4)return out;}return out;}
for(const [i,d] of rows.entries()){
  const targets=[...new Map(rows.filter(x=>x.key!==d.key).map(x=>[x.key,x])).values()];
  const wrong=spread(targets,i);
  const kindLabel=['rbc','neutrophil','gmcsf','macrophage'].includes(d.key)?'성장인자–생성 세포 연결':['ifnb1a','ifnb1b'].includes(d.key)?'주성분':d.key.startsWith('hpv')?'자료에 제시된 예방대상 HPV 유형의 전체 목록':'대표 효과 표적·작용기전';
  const forward={id:'forward-'+d.id,kind:'target',direction:'forward',group:'forward',subject:d.id,core:d.core,weight:d.weight,key:d.key,stem:`${d.name}의 ${kindLabel}으로 알맞은 것은?`,options:[d.target,...wrong.map(x=>x.target)],answer:d.target,note:d.note,source:d.source,exam:d.exam,details:[d,...wrong].map(x=>`${x.target}: ${rows.filter(y=>y.key===x.key).map(y=>y.name).join(' · ')}.`)};
  if(['aza','mmf'].includes(d.id)){
    forward.stem=`${d.name}의 대사 전환·억제 경로 연결로 옳은 것은?`;
    forward.options=['6-MP → purine de novo 합성 억제','MPA → IMPDH 억제','Cyclophilin → calcineurin 억제','FKBP12 → calcineurin 억제','FKBP12 → mTOR 억제'];
    forward.answer=forward.options[d.id==='aza'?0:1];forward.details=undefined;
  }
  questions.push(forward);
  const alternatives=spread(rows.filter(x=>x.key!==d.key),i);
  const reverseStem=d.key.startsWith('hpv')?`자료의 예방대상 HPV 유형 전체 목록이 '${d.target}'인 제제는?`:`다음 중 '${d.target}'과 연결되는 약물·제제는?`;
  questions.push({id:'reverse-'+d.id,kind:'target',direction:'reverse',group:'reverse',subject:d.id,core:d.core,weight:d.weight,key:d.key,stem:reverseStem,options:[d.name,...alternatives.map(x=>x.name)],answer:d.name,note:d.note,source:d.source,exam:d.exam,details:[d,...alternatives].map(x=>`${x.name}: ${x.target}. ${x.note}`)});
}
function add(id,kind,group,subject,stem,answer,wrong,note,pages,exam='족보형·강의 강조',weight=2){questions.push({id,kind,group,subject,core:Boolean(exam),weight,stem,options:[answer,...wrong],answer,note,source:`28강 강의록 PDF ${pages}쪽`,exam});}
const match=(...args)=>add(args[0],'target','comparison',...args.slice(1));
match('bind-csa','cyclosporine','Cyclosporine이 먼저 결합하여 억제 복합체를 만드는 단백질은?','Cyclophilin',['FKBP12','mTOR','CD25','CD52'],'Cyclophilin은 결합 단백질, calcineurin은 그 복합체가 억제하는 효소입니다. Tacrolimus·sirolimus는 FKBP12에 결합합니다.','21·28','족보 2025·2023·2020',4);
match('bind-tac','tacrolimus','Tacrolimus가 먼저 결합하는 단백질은?','FKBP12',['Cyclophilin','mTOR','CD25','CD52'],'Tacrolimus는 FKBP12와 결합하고 복합체가 calcineurin을 억제합니다. mTOR 억제는 sirolimus·everolimus의 경로입니다.','21·28','족보 2023',3);
match('bind-siro','sirolimus','Sirolimus의 결합 단백질–효과 표적 연결로 옳은 것은?','FKBP12 — mTOR',['FKBP12 — Calcineurin','Cyclophilin — mTOR','Cyclophilin — CD25','FKBP12 — CD52'],'Tacrolimus와 sirolimus는 FKBP12 결합은 같지만, 효과 표적이 각각 calcineurin·mTOR로 다릅니다.','21·27–28','족보·강의 강조',3);
match('pair-cni','cyclosporine','결합 단백질이 달라도 calcineurin을 억제하는 두 약물은?','Cyclosporine — Tacrolimus',['Tacrolimus — Sirolimus','Sirolimus — Everolimus','Azathioprine — MMF','Basiliximab — Daclizumab'],'Cyclosporine–cyclophilin과 tacrolimus–FKBP12 복합체는 모두 calcineurin을 억제합니다. Sirolimus·everolimus는 mTOR, basiliximab·daclizumab은 CD25입니다.','21·28', '족보·강의 강조',3);
match('pair-b7','abatacept','CD28과 경쟁하는 abatacept가 직접 결합하는 APC 분자는?','B7 (CD80·CD86)',['CD28','CD2','CD11a','CD25'],'Abatacept는 B7에 결합하여 CD28 공동자극을 차단합니다. 결합 대상과 차단되는 상호작용을 구별하세요.','19·40','족보 2025·2021·2019',4);
match('pair-adhesion','alefacept','약물과 결합 표적의 연결로 옳은 것은?','Alefacept — CD2',['Efalizumab — CD2','Basiliximab — CD52','Alemtuzumab — CD25','Abatacept — CD11a'],'Alefacept는 CD2, efalizumab은 CD11a, basiliximab은 CD25, alemtuzumab은 CD52, abatacept는 B7을 표적으로 합니다.','37–44','족보 2023·2020',3);
match('pair-cd25','basiliximab','CD25(IL-2Rα)를 공통 표적으로 하는 조합은?','Basiliximab — Daclizumab',['Alemtuzumab — Rituximab','Alefacept — Efalizumab','Tocilizumab — Anakinra','Abatacept — Natalizumab'],'Basiliximab·daclizumab은 CD25 표적입니다. CD52·CD20, CD2·CD11a 등은 서로 다른 표적입니다.','37·44','족보·강의 강조',3);
match('tnf-exception','alemtuzumab','다음 중 TNF 억제 그룹에 포함되지 않는 것은?','Alemtuzumab',['Etanercept (Enbrel)','Adalimumab (Humira)','Certolizumab','Infliximab (Remicade)'],'족보의 반복 형태입니다. Alemtuzumab은 CD52 표적 항체이며, 나머지 네 약물은 TNF 억제 그룹입니다. Etanercept의 구조는 융합단백질입니다.',46,'족보 2021',3);
match('tnf-fusion','etanercept','TNF 수용체와 IgG Fc를 연결한 융합단백질은?','Etanercept (Enbrel)',['Infliximab (Remicade)','Adalimumab (Humira)','Certolizumab','Golimumab'],'모두 TNF 억제 그룹이지만 etanercept는 TNF 수용체–Fc 융합단백질입니다. 나머지는 TNF 표적 항체 계열입니다.','9·12·46','족보·강의 강조',3);
match('il6-receptor','tocilizumab','Tocilizumab과 연결되는 표적으로 옳은 것은?','IL-6 receptor',['IL-6 ligand','IL-1 receptor','IL-17A','TNF-α'],'Tocilizumab은 IL-6 자체가 아니라 IL-6 수용체를 차단합니다. Cytokine과 그 수용체를 한 칸씩 바꾸는 오답에 주의합니다.','39·46');
match('a4-vcam','natalizumab','Natalizumab의 직접 결합 표적–차단되는 결합 상대 연결은?','α4 integrin — VCAM-1',['VCAM-1 — α4 integrin','CD11a — VCAM-1','CD2 — ICAM-1','B7 — CD25'],'직접 결합 표적은 α4 integrin이며, 그 결과 VCAM-1과의 결합·침윤이 감소합니다. Efalizumab은 CD11a–ICAM-1 경로입니다.','42–43','족보 2022',3);
match('gcsf-vs-gm','sargramostim','호중구뿐 아니라 호산구 증가까지 연결되는 재조합 GM-CSF 제제는?','Sargramostim (rhGM-CSF)',['Filgrastim (rhG-CSF)','EPO','Betaseron','Avonex'],'Sargramostim은 GM-CSF, filgrastim은 G-CSF입니다. EPO는 적혈구, Betaseron·Avonex는 IFN-β 제제입니다.',12,'족보 2023·2022·2020',3);
const support=(...args)=>add(args[0],'support','mechanism',...args.slice(1));
support('adverse-csa','cyclosporine','Calcineurin 억제제 중 다모증·치은비대증이 특징인 약물은?','Cyclosporine',['Tacrolimus','Sirolimus (Rapamycin)','Azathioprine (AZA)','Mycophenolate mofetil (MMF)'],'Cyclosporine의 반복 족보 단서입니다. Tacrolimus의 고혈당·당뇨, sirolimus의 상처 치유 지연과 대비합니다.','28·30','족보 2025·2020·2019',4);
support('adverse-tac','tacrolimus','Cyclosporine과 비교할 때 tacrolimus의 대표 구별 부작용은?','고혈당·당뇨',['다모증·치은비대증','상처 치유 지연','적혈구 생성 증가','호산구 생성 증가'],'두 CNI는 신독성을 공유합니다. Tacrolimus는 고혈당·당뇨, cyclosporine은 다모증·치은비대증을 구별 단서로 사용합니다.','28·30');
support('adverse-siro','sirolimus','Sirolimus의 강의록상 특징적 부작용은?','상처 치유 지연',['다모증·치은비대증','호산구 증가','적혈구 증가','CD3 항체 주입 반응'],'Sirolimus는 mTOR 억제제이며 상처 치유 지연을 연결합니다. CNI의 결합 단백질·효과 표적과 혼동하지 않습니다.',28);
support('atg-poly','atg','ATG와 OKT3의 항체 유형 연결로 옳은 것은?','ATG — 다클론 / OKT3 — 단클론',['ATG — 단클론 / OKT3 — 다클론','ATG — 융합단백질 / OKT3 — 다클론','ATG — 단클론 / OKT3 — 융합단백질','ATG — 재조합 cytokine / OKT3 — 다클론'],'ATG는 여러 표면항원을 인식하는 다클론 항체, OKT3는 CD3 표적 단클론 항체입니다.','35–36·44','족보 2022·2020',3);
support('okt3-crs','okt3','CD3 표적 항체의 주입 후 부작용과 연결되는 것은?','Cytokine release syndrome',['다모증·치은비대증','상처 치유 지연','호산구 생성 촉진','적혈구 생성 촉진'],'강의록의 muromonab-CD3(OKT3) 항목에 cytokine release syndrome과 감염 위험이 제시됩니다.','36·44','족보·강의 강조');
support('aza-prodrug','aza','Azathioprine이 체내에서 전환되는 물질은?','6-Mercaptopurine (6-MP)',['Mycophenolic acid (MPA)','Methotrexate (MTX)','Adenosine','Interleukin-2 (IL-2)'],'AZA → 6-MP가 핵심 연결입니다. MMF는 MPA로 전환되므로 전구약물–활성체를 바꾸지 않습니다.','31·34','족보 2023',3);
support('mmf-active','mmf','MMF의 활성 대사체–억제 표적 연결로 옳은 것은?','MPA — IMPDH',['6-MP — IMPDH','MPA — Calcineurin','6-MP — CD25','MPA — mTOR'],'MMF는 MPA로 전환되고 IMPDH를 억제합니다. AZA는 6-MP 전환으로 연결합니다.','32·34','족보 2023',3);
support('mtx-direction','mtx','MTX의 항염증 작용에서 cytokine 증감 방향으로 옳은 것은?','염증성 감소 / 항염증성 증가',['염증성 증가 / 항염증성 감소','염증성 증가 / 항염증성 증가','염증성 감소 / 항염증성 감소','염증성 불변 / 항염증성 불변'],'v3 정정 내용입니다. Adenosine 증가와 함께 pro-inflammatory cytokine 감소, anti-inflammatory cytokine 증가로 정리합니다.','33–34','');
support('steroid-triple','prednisolone','강의록의 이식 면역억제 3제 요법 구성으로 옳은 것은?','Steroid + CNI + MMF',['Steroid + CNI + EPO','Steroid + G-CSF + IFN-β','CNI + EPO + HPV 백신','AZA + GM-CSF + HPV 백신'],'서로 다른 작용 단계의 steroid, calcineurin 억제제, AZA 또는 MMF를 병용하는 구성을 제시합니다. 조혈성 cytokine·백신과 구별합니다.','24–25·34');
support('epo-case','epo','빈혈 개선에 사용하며 혈전·심근경색·뇌졸중 위험과 연결되는 제제는?','EPO',['Filgrastim (rhG-CSF)','Sargramostim (rhGM-CSF)','Betaseron','Avonex'],'EPO는 적혈구 생성을 촉진합니다. Filgrastim·sargramostim은 백혈구계, IFN-β 제제는 자료의 MS 용도와 연결됩니다.','10·12','족보 2019',3);
support('growth-pain','filgrastim','Filgrastim과 sargramostim에 공통적으로 제시된 부작용은?','뼈 통증',['치은비대증','다모증','상처 치유 지연','CD3 항체 관련 주입 반응'],'조혈성 성장인자 두 제제에는 뼈 통증이 제시됩니다. 호산구 증가 여부는 G-CSF와 GM-CSF의 차이입니다.',12,'족보·강의 강조');
add('pathway-nfat','support','pathway','calcineurin','Calcineurin 활성화 뒤 NFAT와 IL-2의 변화로 옳은 것은?','NFAT 탈인산화 → 핵 이동 → IL-2 전사 증가',['NFAT 인산화 → 핵 이동 → IL-2 전사 증가','NFAT 탈인산화 → 핵 이동 → IL-2 전사 감소','NFAT 인산화 → 핵 이동 → IL-2 전사 감소','NFAT 탈인산화 → 세포 밖 이동 → IL-2 전사 증가'],'Calcineurin은 phosphatase입니다. CNI는 NFAT 탈인산화·핵 이동을 막아 IL-2 생산을 억제합니다.','17–21');
add('pathway-signal2','support','pathway','abatacept','T세포 공동자극 signal 2의 연결로 옳은 것은?','T세포 CD28 — APC B7',['T세포 CD2 — APC CD25','T세포 CD52 — APC CD3','T세포 CD28 — APC CD20','T세포 CD25 — APC ICAM-1'],'Signal 2는 CD28–B7(CD80/86) 관계입니다. Abatacept는 B7을 점유하여 이 공동자극을 막습니다.','17–19·40','족보 2025·2021·2019',3);
add('pathway-signal1','support','pathway','tcr','항원 인식 signal 1의 연결로 옳은 것은?','TCR — MHC·항원 복합체',['CD28 — B7(CD80·CD86)','CD2 — LFA-3(CD58)','LFA-1 — ICAM-1','α4 integrin — VCAM-1'],'TCR은 APC의 MHC에 제시된 항원을 인식합니다. CD28–B7은 signal 2, 나머지는 부착·세포 간 상호작용 관계입니다.','17–19','올해 강의 강조');
add('pathway-mtor','support','pathway','sirolimus','Sirolimus가 억제하는 단계로 옳은 것은?','IL-2 수용체 신호 이후의 mTOR·세포주기 진행',['TCR 신호 이후의 calcineurin·NFAT 탈인산화','APC 표면 B7과 CD28의 공동자극 결합','혈관 부착에서 α4 integrin과 VCAM-1의 결합','조혈계에서 G-CSF에 따른 호중구 생성'],'mTOR 억제는 IL-2 신호에 따른 증식 반응 감소입니다. CNI의 IL-2 생산 감소, abatacept의 공동자극 차단과 단계를 구별합니다.','20–21·27–28');
add('structure-fusion','support','structure','abatacept','두 약물 모두 융합단백질로 구성된 조합은?','Abatacept — Alefacept',['Abatacept — Alemtuzumab','Alefacept — Efalizumab','Infliximab — Adalimumab','Basiliximab — Daclizumab'],'Abatacept는 CTLA-4–Ig, alefacept는 LFA-3–Ig입니다. Etanercept도 TNF 수용체–Fc 융합단백질입니다.','40–41·44');
add('interferon-ms','support','application','betaseron','Betaseron과 Avonex의 자료상 공통 용도는?','다발성경화증(MS)',['호중구 감소증','적혈구 생성 저하성 빈혈','HPV 감염 예방','장기이식 급성 거부반응 억제'],'두 제품은 각각 IFN-β1b와 IFN-β1a입니다. TNF 억제제와 interferon 제제를 구별합니다.','9·12','');
add('vaccine-common','support','application','cervarix','Cervarix와 Gardasil 9의 공통 예방대상 HPV 유형은?','16형·18형',['6형·11형','31형·33형','45형·52형','52형·58형'],'Cervarix는 16·18형, Gardasil 9는 이를 포함한 9개 유형입니다. 효과를 100%로 단정하는 문항은 출제하지 않습니다.','13–14','');
export const IMM_QUESTIONS=questions;
export function pickImmQuestion(state,scope='core',mode='mixed',random=Math.random){
  const kind=mode==='mixed'?((state.draws||0)%5<4?'target':'support'):mode;
  const bank=questions.filter(q=>(scope!=='core'||q.core)&&q.kind===kind);
  const recent=state.recent||[],subjects=state.subjects||[];
  let pool=bank.filter(q=>!recent.includes(q.id)&&!subjects.includes(q.subject)&&q.group!==state.lastGroup);
  if(!pool.length)pool=bank.filter(q=>!recent.includes(q.id)&&!subjects.includes(q.subject));
  if(!pool.length)pool=bank.filter(q=>!recent.includes(q.id));if(!pool.length)pool=bank;
  const score=q=>(state.seen?.[q.id]||0)/q.weight,min=Math.min(...pool.map(score));
  const eligible=pool.filter(q=>score(q)===min),q=eligible[Math.floor(random()*eligible.length)],choices=shuffle(q.options,random).map(text=>({text}));
  return {...q,choices,answerIndex:choices.findIndex(c=>c.text===q.answer)};
}
