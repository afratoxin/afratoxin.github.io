// Lecture-scoped exam calculations. Numbers are illustrative, not patient dosing advice.
const notes='본인 정리본 PDF 2쪽';
const source=(pages,exam='')=>`${notes} · 약동학(2) PDF ${pages}쪽${exam?' · 족보 PDF '+exam+'쪽 발문 참고':''}`;
export const PK_TOPICS=[
 {id:'ke',title:'소실속도상수',formula:'kₑ = CL/V = −(ln C–시간 직선의 기울기)',unit:'h⁻¹',note:'정리본의 CL/V와 소실기 로그 직선의 기울기를 연결합니다. kₑ는 양수입니다.'},
 {id:'half',title:'반감기',formula:'t½ = 0.693/kₑ = 0.693 × V/CL',unit:'h',note:'정리본의 강조 공식입니다. 문제에 ln 2 = 0.693을 제공합니다.'},
 {id:'volume',title:'분포용적',formula:'IV bolus·1구획: V = Dose/C₀ = CL/kₑ',unit:'L',note:'C₀는 투여 직후로 외삽한 농도입니다. mg/kg은 체중을 곱해 실제 투여량으로 바꿉니다.'},
 {id:'clearance',title:'청소율',formula:'IV: CL = Dose/AUC₀–∞ · 경구: CL = F × Dose/AUC₀–∞',unit:'L/h',note:'정리본의 Dose/AUC는 전량이 전신순환에 들어가는 IV 조건입니다. 경구에서는 F를 반영합니다.'},
 {id:'bio',title:'생체이용률',formula:'F = (AUC경구/Dose경구)/(AUCIV/DoseIV)',unit:'%',note:'같은 약물의 CL이 일정한 선형 조건에서 비교합니다. 같은 용량이면 경구 AUC/IV AUC입니다. 백분율은 분율에 100을 곱합니다.'},
 {id:'auc',title:'관측 구간 AUC',formula:'AUC구간 = (C시작 + C끝)/2 × 시간 간격',unit:'mg·h/L',note:'정리본의 사다리꼴 넓이입니다. 마지막 채혈 이후의 면적은 포함하지 않습니다.'},
 {id:'tail',title:'AUC 꼬리·전체 면적',formula:'AUC_last–∞ = C_last/kₑ · AUC₀–∞ = AUC₀–last + C_last/kₑ',unit:'mg·h/L',note:'정리본에서 강조한 마지막 면적입니다. 마지막 측정 뒤 1차 소실이 이어진다고 가정합니다.'},
 {id:'concentration',title:'항정상태 농도',formula:'Cₛₛ = R₀/CL',unit:'mg/L',note:'지속 정맥주입에서 투여 속도와 소실 속도가 같아질 때의 농도입니다.'},
 {id:'infusion',title:'정맥주입 속도',formula:'R₀ = Cₛₛ × CL',unit:'mg/h',note:'족보의 유지 주입속도 계산 형태입니다. 목표 농도에 V가 아니라 CL을 곱합니다.'},
 {id:'loading',title:'정맥 부하용량',formula:'LDIV = C목표 × V',unit:'mg',note:'정리본의 강조 내용대로 부하용량은 V로 정합니다. 1구획 모델의 정맥투여 조건입니다.'}
];
export const PK_VARIANTS={ke:['clearance','slope'],half:['halfLife','fromKe'],volume:['volume','ratio'],clearance:['iv','oral'],bio:['sameDose','differentDose'],auc:['trapezoids'],tail:['tail','total'],concentration:['concentration'],infusion:['rate'],loading:['iv']};
// Keep existing identities when moving an unchanged relationship into its own selector.
export const pkQuestionId=(topic,variant)=>`${topic==='tail'?'auc':topic==='concentration'?'infusion':topic}:${variant}`;
const pick=(values,random)=>values[Math.floor(random()*values.length)];
const round=(value,digits=3)=>Number(value.toFixed(digits));
const n=value=>String(round(value,3));
const wrong=(value,reason)=>({value,reason});
export function shuffle(values,random=Math.random){const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function finish(q,distractors,random){
 const answer=round(q.answer,q.digits),text=value=>String(value);
 const entries=[{value:answer,text:text(answer),correct:true,reason:q.steps.join(' → ')}],used=new Set([text(answer)]);
 const fallback=[.5,2,.25,4,1.5,.75,3].map(f=>wrong(q.answer*f,`식의 곱셈·나눗셈 또는 계수를 잘못 적용한 값입니다. ${q.formula}에 대입하면 ${answer} ${q.unit}입니다.`));
 for(const candidate of [...distractors,...fallback]){
  const value=round(candidate.value,q.digits);
  if(!Number.isFinite(value)||value===0||used.has(text(value)))continue;
  entries.push({...candidate,value,text:text(value),correct:false});used.add(text(value));
  if(entries.length===5)break;
 }
 if(entries.length!==5)throw Error('선지 생성 실패: '+q.id);
 const choices=shuffle(entries,random);
 return {...q,answer,format:'numeric',choices,answerIndex:choices.findIndex(c=>c.correct)};
}
export function makePkQuestion(topic,random=Math.random,selectedVariant){
 const definition=PK_TOPICS.find(t=>t.id===topic);
 if(!definition)throw Error('알 수 없는 계산 주제: '+topic);
 const variant=selectedVariant||pick(PK_VARIANTS[topic],random);
 if(!PK_VARIANTS[topic].includes(variant))throw Error('알 수 없는 변형: '+variant);
 let q={id:pkQuestionId(topic,variant),topic,variant,title:definition.title,formula:definition.formula,digits:2,unit:definition.unit,parameters:{},source:source('9'),steps:[]},distractors=[];
 if(topic==='ke'){
  if(variant==='clearance'){
   const clearance=pick([2,4,5,10],random),volume=pick([20,40,50,100],random);
   q={...q,parameters:{clearance,volume},stem:`1구획·1차 소실 약물의 청소율은 ${clearance} L/h, 분포용적은 ${volume} L이다. 소실속도상수 kₑ(h⁻¹)는?`,answer:clearance/volume,digits:3,formula:'kₑ = CL/V',steps:['청소율을 분포용적으로 나눕니다.',`kₑ = ${clearance}/${volume}`,`kₑ = ${n(clearance/volume)} h⁻¹`]};
   distractors=[wrong(volume/clearance,'CL/V의 분자와 분모를 뒤집었습니다.'),wrong(clearance*volume,'청소율과 분포용적을 곱했습니다. kₑ는 CL을 V로 나눕니다.'),wrong(.693*clearance/volume,'kₑ 계산에 반감기의 계수 0.693을 불필요하게 곱했습니다.'),wrong(clearance/(2*volume),'분포용적을 두 배로 잘못 적용했습니다.')];
  }else{
   const t1=pick([1,2],random),delta=pick([2,4,5],random),t2=t1+delta,logC1=pick([3,4],random),logC2=logC1-1;
   q={...q,parameters:{t1,t2,logC1,logC2},stem:`약물 소실기의 ln C–시간 그래프에서 ${t1} h의 ln C는 ${logC1}, ${t2} h의 ln C는 ${logC2}였다. 소실속도상수 kₑ(h⁻¹)는?`,answer:(logC1-logC2)/delta,digits:3,formula:'kₑ = (ln C₁ − ln C₂)/(t₂ − t₁)',steps:['정리본처럼 로그 소실기 직선의 기울기에 음수를 붙입니다.',`kₑ = (${logC1}−${logC2})/(${t2}−${t1})`,`kₑ = ${n(1/delta)} h⁻¹`]};
   distractors=[wrong(-1/delta,'로그 직선의 기울기 −kₑ를 그대로 골랐습니다. kₑ 자체는 양수입니다.'),wrong(delta,'시간 차이를 로그 농도 차이로 나누었습니다.'),wrong(1/t2,'두 관측 시점의 시간 차이 대신 두 번째 시각만 사용했습니다.'),wrong(.693/delta,'ln C 차이가 1인데 0.693으로 바꾸었습니다. 반감기 공식을 그대로 적용하지 않습니다.')];
  }
 }else if(topic==='half'){
  const fromKe=variant==='fromKe';
  const volume=pick([20,40,60],random),clearance=volume/pick([10,20],random),ke=fromKe?pick([.0693,.1386,.3465],random):clearance/volume;
  const answer=.693/ke;
  q={...q,parameters:fromKe?{ke}:{volume,clearance},stem:fromKe?`1차 소실 약물의 소실속도상수 kₑ는 ${ke} h⁻¹이다. 반감기(h)는? (ln 2 = 0.693)`:`1구획·1차 소실 약물의 분포용적은 ${volume} L, 청소율은 ${clearance} L/h이다. 반감기(h)는? (ln 2 = 0.693)`,answer,formula:fromKe?'t½ = 0.693/kₑ':'t½ = 0.693 × V/CL',steps:['반감기는 0.693을 kₑ로 나눈 값입니다.',fromKe?`t½ = 0.693/${ke}`:`t½ = 0.693 × ${volume}/${clearance}`,`t½ = ${n(answer)} h`]};
  distractors=[wrong(1/ke,'V/CL 또는 1/kₑ만 구하고 0.693을 곱하지 않았습니다.'),wrong(.693*ke,'0.693을 kₑ로 나누어야 하는데 곱했습니다.'),wrong(answer*2,'반감기를 두 번 합산한 값입니다. 한 반감기만 묻습니다.'),wrong(answer/2,'주어진 조건의 반감기를 다시 절반으로 줄였습니다.')];
 }else if(topic==='volume'){
  const ratio=variant==='ratio';
  const volume=pick([20,40,50,80],random),c0=pick([2,4,5,10],random),dose=volume*c0,weight=pick([40,60,80],random),mgPerKg=pick([5,10],random),actual=ratio?weight*mgPerKg:dose,answer=actual/c0;
  q={...q,parameters:ratio?{weight,mgPerKg,c0}:{dose,c0},stem:ratio?`체중 ${weight} kg인 환자에게 ${mgPerKg} mg/kg을 정맥 일시주사했다. 1구획 모델에서 투여 직후 외삽 농도 C₀는 ${c0} mg/L였다. CL/kₑ의 값(L)은?`:`약물 ${dose} mg을 정맥 일시주사했다. 1구획 모델에서 투여 직후 외삽 농도 C₀는 ${c0} mg/L였다. 분포용적 V(L)는?`,answer,source:source('8·15',ratio?'5':'')+' · 약동학(1) PDF 21쪽',formula:ratio?'CL/kₑ = V = Dose/C₀':'V = Dose/C₀',steps:[ratio?`실제 투여량 = ${weight} × ${mgPerKg} = ${actual} mg`:`정맥투여량 = ${dose} mg`,ratio?`CL/kₑ = V = ${actual}/${c0}`:`V = ${dose}/${c0}`,`V = ${n(answer)} L`]};
  distractors=[wrong(actual*c0,'투여량을 농도로 나누어야 하는데 곱했습니다.'),wrong(c0/actual,'Dose/C₀의 분자와 분모를 뒤집었습니다.'),wrong(ratio?mgPerKg/c0:answer/2,ratio?'mg/kg에 체중을 곱하지 않고 농도로 나누었습니다.':'투여량을 절반으로 잘못 적용했습니다.'),wrong(ratio?weight/c0:answer*2,ratio?'체중에 mg/kg 용량을 곱하지 않았습니다.':'분포용적을 두 배로 잘못 계산했습니다.')];
 }else if(topic==='clearance'){
  const oral=variant==='oral',clearance=pick([2,4,5,10],random),dose=pick([100,200,400],random),f=oral?pick([.5,.8],random):1,auc=f*dose/clearance;
  q={...q,parameters:{dose,auc,f},stem:oral?`약물 ${dose} mg을 경구투여한 뒤 AUC₀–∞가 ${n(auc)} mg·h/L였다. 생체이용률 F가 ${f}일 때 청소율 CL(L/h)은?`:`약물 ${dose} mg을 정맥투여한 뒤 AUC₀–∞가 ${n(auc)} mg·h/L였다. 청소율 CL(L/h)은?`,answer:clearance,source:source('7·15'),formula:oral?'CL = F × Dose/AUC₀–∞':'CL = Dose/AUC₀–∞',steps:[oral?'경구투여량 중 F만큼 전신순환에 도달합니다.':'정맥투여의 생체이용률은 1입니다.',oral?`CL = ${f} × ${dose}/${n(auc)}`:`CL = ${dose}/${n(auc)}`,`CL = ${clearance} L/h`]};
  distractors=[wrong(oral?dose/auc:auc/dose,oral?'경구 생체이용률 F를 빠뜨렸습니다. Dose/AUC는 CL/F입니다.':'Dose/AUC의 분자와 분모를 뒤집었습니다.'),wrong(oral?dose/(f*auc):clearance*2,oral?'F를 분자에 곱하지 않고 분모에 곱했습니다.':'투여량을 두 배로 잘못 적용했습니다.'),wrong(clearance/2,'주어진 투여량을 절반만 반영했습니다.'),wrong(oral?f*clearance:clearance*1.5,oral?'이미 반영한 F를 한 번 더 곱했습니다.':'주어진 값에 없는 1.5배 계수를 적용했습니다.')];
 }else if(topic==='bio'){
  const different=variant==='differentDose',doseIv=pick([100,200],random),doseOral=different?doseIv*2:doseIv,aucIv=pick([20,40,80],random),f=pick([.25,.5,.75],random),aucOral=aucIv*f*doseOral/doseIv;
  q={...q,parameters:{doseIv,doseOral,aucIv,aucOral},stem:`같은 약물을 정맥으로 ${doseIv} mg 투여했을 때 AUC는 ${aucIv} mg·h/L, 경구로 ${doseOral} mg 투여했을 때는 ${n(aucOral)} mg·h/L였다. CL이 같은 선형 조건에서 경구 생체이용률(%)은?`,answer:f*100,source:source('6·7'),formula:definition.formula+' × 100%',steps:[different?'정맥·경구 투여량이 다르므로 각각의 AUC를 용량으로 보정합니다.':'정맥·경구 투여량이 같으므로 AUC의 비를 구합니다.',`F = (${n(aucOral)}/${doseOral})/(${aucIv}/${doseIv}) = ${f}`,`백분율 = ${f} × 100 = ${f*100}%`]};
  distractors=[wrong(different?aucOral/aucIv*100:1/f*100,different?'경구투여량이 두 배인데 용량 보정을 빠뜨렸습니다.':'경구/정맥 AUC 비를 정맥/경구로 뒤집었습니다.'),wrong(f,'분율을 백분율로 바꾸지 않았습니다.'),wrong(different?aucOral/aucIv*doseOral/doseIv*100:(1-f)*100,different?'용량 보정의 정맥/경구 비를 뒤집었습니다.':'전신에 도달한 비율 대신 도달하지 못한 비율을 골랐습니다.'),wrong(f*50,'분율에 100을 곱해야 하는데 50을 곱했습니다.')];
 }else if(topic==='auc'){
  const dt=pick([2,4],random),concentrations=[pick([12,16,20],random),pick([4,8],random)],times=[0,dt],answer=(concentrations[0]+concentrations[1])/2*dt;
  q={...q,parameters:{times,concentrations},stem:`정맥 일시주사 직후 농도는 ${concentrations[0]} mg/L, ${dt} h 후에는 ${concentrations[1]} mg/L였다. 두 점을 직선으로 연결할 때 이 구간의 AUC(mg·h/L)는?`,answer,source:source('13'),formula:definition.formula,steps:['구간 양 끝 농도의 평균에 시간 간격을 곱합니다.',`AUC = (${concentrations[0]}+${concentrations[1]})/2 × ${dt}`,`AUC = ${answer} mg·h/L`]};
  distractors=[wrong(concentrations[0]*dt,'처음 농도만 사용한 직사각형 넓이입니다.'),wrong(concentrations[1]*dt,'마지막 농도만 사용한 직사각형 넓이입니다.'),wrong(answer*2,'두 농도의 합을 평균으로 바꾸는 나눗셈 2를 빠뜨렸습니다.'),wrong((concentrations[0]+concentrations[1])/2,'평균 농도에 시간 간격을 곱하지 않았습니다.')];
 }else if(topic==='tail'){
  const clast=pick([1,2,4],random),ke=pick([.1,.2,.5],random),aucObserved=pick([20,40,60],random),tail=clast/ke,total=variant==='total',answer=tail+(total?aucObserved:0);
  q={...q,parameters:{clast,ke,aucObserved},stem:total?`관측 AUC₀–last는 ${aucObserved} mg·h/L, 마지막 농도는 ${clast} mg/L, kₑ는 ${ke} h⁻¹이다. 이후 1차 소실을 가정할 때 전체 AUC₀–∞(mg·h/L)는?`:`마지막 측정 농도는 ${clast} mg/L, kₑ는 ${ke} h⁻¹이다. 이후 1차 소실을 가정할 때 마지막 측정부터 무한대까지의 AUC(mg·h/L)는?`,answer,source:source('13·14'),formula:total?'AUC₀–∞ = AUC₀–last + C_last/kₑ':'AUC_last–∞ = C_last/kₑ',steps:['정리본의 마지막 면적은 C_last/kₑ입니다.',`꼬리 면적 = ${clast}/${ke} = ${n(tail)} mg·h/L`,total?`전체 AUC = ${aucObserved} + ${n(tail)} = ${n(answer)} mg·h/L`:`마지막 측정 이후 AUC = ${n(answer)} mg·h/L`]};
  distractors=total?[wrong(aucObserved,'관측 면적만 골라 마지막 측정 이후의 면적을 빠뜨렸습니다.'),wrong(tail,'마지막 측정 이후의 면적만 구하고 관측 면적을 더하지 않았습니다.'),wrong(aucObserved+clast*ke,'꼬리 면적을 구할 때 C_last를 kₑ로 나누지 않고 곱했습니다.'),wrong(aucObserved+tail*.693,'꼬리 면적에 반감기의 0.693을 불필요하게 곱했습니다.')]:[wrong(clast*ke,'C_last를 kₑ로 나누지 않고 곱했습니다.'),wrong(ke/clast,'C_last/kₑ의 분자와 분모를 뒤집었습니다.'),wrong(tail*.693,'반감기의 계수 0.693은 꼬리 면적 계산에 넣지 않습니다.'),wrong(clast,'마지막 농도 자체는 면적이 아닙니다. kₑ로 나누어야 합니다.')];
 }else if(topic==='concentration'){
  const clearance=pick([2,4,5,10],random),target=pick([2,4,5,10],random),rate=clearance*target;
  q={...q,parameters:{clearance,rate},stem:`청소율이 ${clearance} L/h인 약물을 ${rate} mg/h로 일정하게 정맥주입한다. 항정상태 혈장 농도 Cₛₛ(mg/L)는?`,answer:target,source:source('19·20'),steps:['항정상태에서는 투여 속도와 소실 속도가 같습니다.',`Cₛₛ = ${rate}/${clearance}`,`Cₛₛ = ${target} mg/L`]};
  distractors=[wrong(rate*clearance,'주입속도를 CL로 나누어야 하는데 곱했습니다.'),wrong(clearance/rate,'R₀/CL의 분자와 분모를 뒤집었습니다.'),wrong(rate,'주입속도 자체를 혈장 농도로 골랐습니다.'),wrong(target/2,'주어진 주입속도를 절반으로 잘못 적용했습니다.')];
 }else if(topic==='infusion'){
  const clearance=pick([5,10,20,25],random),target=pick([2,4,8,10],random),answer=clearance*target;
  q={...q,parameters:{clearance,target},stem:`청소율이 ${clearance} L/h인 약물의 혈장 농도를 항정상태에서 ${target} mg/L로 유지하려 한다. 필요한 지속 정맥주입 속도(mg/h)는?`,answer,source:source('19·20','7'),steps:['목표 항정상태 농도에 청소율을 곱합니다.',`R₀ = ${target} × ${clearance}`,`R₀ = ${answer} mg/h`]};
  distractors=[wrong(target/clearance,'목표 농도에 CL을 곱해야 하는데 나누었습니다.'),wrong(clearance/target,'CL을 목표 농도로 나누었습니다.'),wrong(target,'목표 농도 자체를 주입속도로 골랐습니다.'),wrong(answer/2,'필요한 유지 주입속도를 절반으로 계산했습니다.')];
 }else if(topic==='loading'){
  const target=pick([2,4,5,10],random),volume=pick([20,40,50,80],random),answer=target*volume;
  q={...q,parameters:{target,volume},stem:`1구획 모델에서 약물의 분포용적은 ${volume} L이다. 투여 직후 혈장 농도를 ${target} mg/L로 만들기 위한 정맥 부하용량(mg)은?`,answer,source:source('20'),steps:['정리본처럼 목표 농도에 분포용적을 곱합니다.',`LD = ${target} × ${volume}`,`LD = ${answer} mg`]};
  distractors=[wrong(volume/target,'목표 농도와 분포용적을 곱하지 않고 나누었습니다.'),wrong(target/volume,'목표 농도를 분포용적으로 나누었습니다.'),wrong(answer*.693,'부하용량에 반감기의 계수 0.693은 필요하지 않습니다.'),wrong(answer/2,'주어진 목표 농도를 절반으로 잘못 적용했습니다.')];
 }
 return finish(q,distractors,random);
}
export function pickPkTopic(state,filter='all',random=Math.random){
 if(filter!=='all'&&PK_TOPICS.some(t=>t.id===filter))return filter;
 const pool=PK_TOPICS.filter(t=>t.id!==state.lastTopic),score=t=>(state.seenTopics?.[t.id]||0)-.25*(state.missedTopics?.[t.id]||0),low=Math.min(...pool.map(score));
 return pick(pool.filter(t=>score(t)===low),random).id;
}
