// Expected exam drills constrained to the 2026 lectures, not patient dosing advice.
export const PK_TOPICS=[
  {id:'ke',title:'소실속도상수',formula:'kₑ = (ln C₁ − ln C₂) / (t₂ − t₁)',unit:'h⁻¹',note:'로그 소실기의 기울기는 −kₑ입니다.'},
  {id:'half',title:'반감기·도달 시간',formula:'t½ = 0.693 / kₑ = 0.693 × V / CL',unit:'h',note:'주입만 할 때 항정상태에 거의 도달하려면 약 4~5반감기가 필요합니다.'},
  {id:'volume',title:'분포용적',formula:'V = Dose / C₀ = CL / kₑ',unit:'L',note:'Dose/C₀는 정맥 일시주사·1구획 모델에서 적용합니다.'},
  {id:'clearance',title:'청소율·AUC',formula:'IV: CL = Dose / AUC₀–∞ · 경구: CL/F = Dose / AUC₀–∞',unit:'L/h',note:'경구투여에서 F를 알면 CL = F × Dose / AUC₀–∞입니다.'},
  {id:'bio',title:'생체이용률',formula:'F = (AUC경구 / Dose경구) / (AUCIV / DoseIV)',unit:'분율 또는 %',note:'같은 약물의 CL이 같고 선형일 때 투여량을 보정합니다. 같은 용량이면 AUC 비만 사용합니다.'},
  {id:'auc',title:'AUC·무한대 외삽',formula:'관측 구간: AUCᵢ = (Cᵢ + Cᵢ₊₁)/2 × Δt · AUC_last–∞ = C_last/kₑ · AUC₀–∞ = AUC₀–last + C_last/kₑ',unit:'mg·h/L',note:'C_last는 마지막 측정 농도입니다. 이후 1차 소실을 가정하여 무한대까지 남은 면적을 외삽합니다. 관측 AUC에 이 면적을 더하면 전체 AUC입니다.'},
  {id:'infusion',title:'정맥주입 속도',formula:'Cₛₛ = R₀ / CL · R₀ = Cₛₛ × CL',unit:'mg/L · mg/h',note:'항정상태 농도는 CL과 주입속도로 결정됩니다. V는 도달 속도에 영향을 줍니다.'},
  {id:'loading',title:'정맥 부하용량',formula:'LDIV = C목표 × V',unit:'mg',note:'1구획 모델에서 처음 목표 농도를 만드는 양입니다. 유지 주입속도와 구별합니다.'},
  {id:'accumulation',title:'반복 투여·축적',formula:'R = 1 / (1 − r) · Cmax,ss = C₀ × R',unit:'배 · mg/L',note:'r은 다음 투여 직전까지 남은 분율입니다. 이 유형은 필요한 식과 r을 문제에 제공합니다.'},
  {id:'renal',title:'신장애·용량 조정',formula:'CL새 = CL기존 × [(1 − fₑ) + fₑ × 신기능비]',unit:'L/h',note:'신장 CL만 신기능에 비례한다고 가정합니다. 동일 용량·F에서 AUC 비는 CL기존/CL새입니다.'}
];
export const PK_VARIANTS={ke:['slope'],half:['halfLife','steady'],volume:['volume','ratio'],clearance:['iv','oral','apparent'],bio:['sameDose','differentDose'],auc:['trapezoids','tail','total'],infusion:['rate','concentration'],loading:['iv'],accumulation:['ratio','peak'],renal:['clearance','auc','rate']};
const pick=(values,random)=>values[Math.floor(random()*values.length)];
const numeric=(v,d=2)=>Number(v.toFixed(d));
const n=v=>String(numeric(v,3));
export function shuffle(values,random=Math.random){const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
const candidate=(value,reason)=>({value,reason});
const source=(pdf,slide)=>`약동학(2) PDF ${pdf}쪽 · 슬라이드 ${slide}쪽`;

function finish(q,distractors,random){
  const text=value=>`${value.toFixed(q.digits)} ${q.unit}`;
  const answer=numeric(q.answer,q.digits);
  const entries=[{value:answer,text:text(answer),correct:true,reason:q.steps.join(' → ')}];
  const used=new Set([text(answer)]);
  const fallbacks=[.5,2,.25,4,1.5,.75,3].map(f=>candidate(q.answer*f,`필요한 식에 없는 ${n(f)}배 계수를 적용한 값입니다. ${q.formula}에 주어진 값을 대입하면 ${text(answer)}입니다.`));
  for(const wrong of [...distractors,...fallbacks]){
    const value=numeric(wrong.value,q.digits);
    if(!Number.isFinite(value)||value===0||used.has(text(value)))continue;
    entries.push({...wrong,value,text:text(value),correct:false});used.add(text(value));
    if(entries.length===5)break;
  }
  if(entries.length!==5)throw Error('선지 생성 실패: '+q.id);
  const choices=shuffle(entries,random);
  return {...q,choices,answerIndex:choices.findIndex(x=>x.correct)};
}

export function makePkQuestion(topic,random=Math.random,selectedVariant){
  const definition=PK_TOPICS.find(x=>x.id===topic);
  if(!definition)throw Error('알 수 없는 계산 주제: '+topic);
  const variant=selectedVariant||pick(PK_VARIANTS[topic],random);
  if(!PK_VARIANTS[topic].includes(variant))throw Error('알 수 없는 변형: '+variant);
  let q={id:`${topic}:${variant}`,topic,variant,title:definition.title,formula:definition.formula,digits:2,parameters:{},steps:[]},wrong=[];
  if(topic==='ke'){
    const halfLife=pick([2,4,6,8],random),halves=pick([2,3],random),c1=pick([16,32,64],random),c2=c1/2**halves,t1=pick([1,2,3],random),t2=t1+halfLife*halves;
    const delta=t2-t1,logRatio=.693*halves;
    q={...q,parameters:{c1,c2,t1,t2},stem:`1차 소실을 따르는 약물의 소실기에서 ${t1}시간의 혈장 농도는 ${c1} mg/L, ${t2}시간에는 ${c2} mg/L였다. 소실속도상수 kₑ는?\nln(C₁/C₂) = ${n(logRatio)}로 계산한다.`,answer:logRatio/delta,unit:'h⁻¹',digits:3,source:source(9,34),plot:{points:[{t:t1,c:c1},{t:t2,c:c2}]},steps:[`로그 기울기의 부호를 바꾸면 kₑ = ln(C₁/C₂)/Δt`,`Δt = ${t2} − ${t1} = ${delta} h`,`kₑ = ${n(logRatio)}/${delta} = ${(logRatio/delta).toFixed(3)} h⁻¹`]};
    wrong=[candidate(-q.answer,'소실기 직선의 기울기는 음수지만, 소실속도상수 kₑ는 그 기울기의 부호를 바꾼 양수입니다.'),candidate(.693/delta,'두 농도 사이에 여러 반감기가 지났는데 시간 차이를 한 반감기로 처리했습니다.'),candidate(delta/logRatio,'로그 농도 차이를 시간 차이로 나눠야 합니다. 분자와 분모를 뒤집으면 kₑ의 역수가 됩니다.'),candidate((c1-c2)/delta,'농도의 단순 차이는 일반 축의 감소 기울기입니다. kₑ는 ln 농도의 차이로 구합니다.')];
  }else if(topic==='half'){
    if(variant==='steady'){
      const halfLife=pick([2,4,6,8],random),halfLives=pick([4,5],random),fraction=(1-2**(-halfLives))*100;
      q={...q,parameters:{halfLife,halfLives},stem:`부하용량 없이 일정 속도로 정맥주입한다. 약물의 반감기는 ${halfLife}시간이다. 항정상태 농도의 약 ${fraction.toFixed(2)}%에 도달하는 데 걸리는 시간은?\n이 비율에 도달하려면 ${halfLives}반감기가 필요하다고 주어진다.`,answer:halfLife*halfLives,unit:'h',digits:1,source:source(19,44),formula:'도달 시간 = 반감기 × 필요한 반감기 횟수',steps:[`주어진 비율은 ${halfLives}반감기에 해당`,`t½ = ${halfLife} h`,`시간 = ${halfLife} × ${halfLives} = ${halfLife*halfLives} h`]};
      wrong=[candidate(halfLife,'반감기 1회에 해당하는 시간입니다. 주어진 비율까지는 여러 반감기가 필요합니다.'),candidate(halfLives,'필요한 반감기 횟수를 시간 자체로 해석했습니다.'),candidate(halfLife*(halfLives-1),'필요한 반감기를 한 회 적게 계산했습니다.'),candidate(halfLife*(halfLives+1),'주어진 도달 비율에 필요한 반감기를 한 회 많게 계산했습니다.')];
    }else{
      const volume=pick([20,40,60,80],random),clearance=pick([2,4,5,8],random),ke=clearance/volume;
      q={...q,parameters:{volume,clearance},stem:`1구획·1차 소실 약물의 분포용적은 ${volume} L, 청소율은 ${clearance} L/h이다. 반감기는?\nln 2 = 0.693으로 계산한다.`,answer:.693/ke,unit:'h',source:source(9,34),steps:[`kₑ = CL/V = ${clearance}/${volume} = ${n(ke)} h⁻¹`,`t½ = 0.693/kₑ`,`t½ = 0.693 × ${volume}/${clearance} = ${(.693/ke).toFixed(2)} h`]};
      wrong=[candidate(volume/clearance,'V/CL은 kₑ의 역수입니다. 반감기를 구하려면 ln 2 = 0.693을 곱해야 합니다.'),candidate(.693*clearance/volume,'t½는 V에 비례하고 CL에 반비례합니다. CL/V를 그대로 곱하면 관계가 뒤집힙니다.'),candidate(.693/clearance,'반감기 계산에서 분포용적 V를 빠뜨렸습니다.'),candidate(clearance/volume,'CL/V는 소실속도상수이며, 반감기가 아닙니다.')];
    }
  }else if(topic==='volume'){
    const weight=pick([40,50,60,80],random),mgPerKg=pick([5,10],random),dose=weight*mgPerKg,c0=pick([4,5,8,10],random),volume=dose/c0;
    q={...q,parameters:{weight,mgPerKg,c0},stem:`체중 ${weight} kg인 환자에게 ${mgPerKg} mg/kg을 정맥 일시주사하였다. 1구획 모델에서 시간 0으로 외삽한 혈장 농도 C₀는 ${c0} mg/L이다. ${variant==='ratio'?'CL/kₑ의 값':'분포용적 V'}은?`,answer:volume,unit:'L',digits:1,source:'약동학(1) PDF 21쪽 · 약동학(2) PDF 8·15쪽 · 족보 PDF 5쪽 발문 참고',steps:[`실제 투여량 = ${weight} × ${mgPerKg} = ${dose} mg`,`V = Dose/C₀ = ${dose}/${c0} = ${n(volume)} L`,variant==='ratio'?'kₑ = CL/V이므로 CL/kₑ = V':'가상 분포용적이며 해부학적 체액량과 같을 필요는 없습니다.']};
    wrong=[candidate(mgPerKg/c0,'체중당 용량 mg/kg을 실제 투여량 mg으로 바꾸지 않았습니다.'),candidate(weight/c0,'체중에 mg/kg 용량을 곱하는 단계를 빠뜨렸습니다.'),candidate(dose*c0,'V는 투여량을 초기 농도로 나눈 값입니다. 두 값을 곱하면 단위도 L가 되지 않습니다.'),candidate(c0/dose,'투여량과 농도의 나눗셈 순서를 뒤집었습니다.')];
  }else if(topic==='clearance'){
    const dose=pick([200,300,400,600],random),auc=pick([20,40,50,60],random),f=pick([.4,.5,.8],random),oral=variant!=='iv',answer=(variant==='oral'?f:1)*dose/auc;
    q={...q,parameters:{dose,auc,f},stem:`선형 약동학 약물 ${dose} mg을 ${oral?'경구투여':'정맥 일시주사'}했을 때 AUC₀–∞는 ${auc} mg·h/L였다. ${variant==='oral'?`생체이용률 F가 ${f}일 때 실제 청소율 CL은?`:variant==='apparent'?'생체이용률 F를 모를 때 겉보기 청소율 CL/F는?':'청소율 CL은?'}`,answer,unit:'L/h',source:source(7,32)+' · '+source(15,40),steps:[oral?'경구 AUC = F × Dose/CL':'IV는 F = 1이므로 AUC = Dose/CL',variant==='oral'?`CL = F × Dose/AUC = ${f} × ${dose}/${auc}`:variant==='apparent'?`CL/F = Dose/AUC = ${dose}/${auc}`:`CL = Dose/AUC = ${dose}/${auc}`,`결과 = ${answer.toFixed(2)} L/h${variant==='apparent'?' · F를 모르면 실제 CL을 따로 확정할 수 없습니다.':''}`]};
    wrong=[candidate(auc/dose,'Dose/AUC의 순서를 뒤집었습니다. CL 또는 CL/F의 단위는 L/h입니다.'),candidate(dose*auc,'청소율은 투여량과 AUC를 곱하는 값이 아니라 나누는 값입니다.'),candidate(variant==='oral'?dose/auc:f*dose/auc,variant==='oral'?'F 보정을 생략하여 실제 CL 대신 CL/F를 구했습니다.':variant==='apparent'?'주어지지 않은 F를 임의로 넣으면 실제 CL과 CL/F를 혼동합니다.':'정맥투여에서는 F = 1입니다. 경구 생체이용률을 임의로 적용하지 않습니다.'),candidate(dose/(auc*f),'F를 곱해야 하는 관계에서 분모에 두거나, 주어지지 않은 F를 임의로 사용했습니다.')];
  }else if(topic==='bio'){
    const doseIv=pick([100,200],random),doseOral=doseIv*(variant==='sameDose'?1:pick([2,3],random)),aucIv=doseIv/5,f=pick([.4,.5,.6,.8],random),aucOral=f*doseOral/5;
    q={...q,parameters:{doseIv,doseOral,aucIv,aucOral},stem:`같은 약물을 정맥으로 ${doseIv} mg 투여했을 때 AUC₀–∞는 ${aucIv} mg·h/L, 경구로 ${doseOral} mg 투여했을 때는 ${n(aucOral)} mg·h/L였다. 두 투여에서 CL은 같고 선형 약동학을 따른다. 경구 생체이용률 F는?`,answer:f*100,unit:'%',digits:1,source:source(6,31)+' · '+source(7,32),steps:['투여량이 다르면 각 AUC를 투여량으로 나눕니다.',`F = (AUC경구/Dose경구)/(AUCIV/DoseIV)`,`F = (${n(aucOral)}/${doseOral})/(${aucIv}/${doseIv}) = ${f} = ${f*100}%`]};
    wrong=[candidate(aucOral/aucIv*100,'AUC 비만 사용한 값입니다. 투여량이 다르면 용량 보정이 필요합니다.'),candidate(aucIv/aucOral*doseOral/doseIv*100,'생체이용률 비의 분자와 분모를 뒤집었습니다.'),candidate(aucOral/aucIv*doseOral/doseIv*100,'용량 보정비를 DoseIV/Dose경구 대신 반대로 적용했습니다.'),candidate(f,'생체이용률의 분율과 백분율을 혼동했습니다. 분율 0.5는 0.5%가 아니라 50%입니다.'),candidate(doseIv/doseOral*100,'용량 비만으로는 F를 구할 수 없습니다. 같은 용량의 약도 AUC가 달라질 수 있습니다.'),candidate((1-f)*100,'전신에 도달한 분율 F 대신 도달하지 않은 분율 1−F를 구했습니다.'),candidate(f*100/.693,'생체이용률에는 반감기 계수 0.693을 사용하지 않습니다.')];
  }else if(topic==='auc'){
    if(variant==='tail'||variant==='total'){
      const clast=pick([1,2,4],random),ke=pick([.05,.1,.2],random),aucObserved=pick([40,80,120],random),tail=clast/ke,total=aucObserved+tail,isTotal=variant==='total';
      q={...q,parameters:{clast,ke,aucObserved},stem:`관측 구간 AUC₀–last는 ${aucObserved} mg·h/L, 마지막 측정 농도 C_last는 ${clast} mg/L, 소실속도상수 kₑ는 ${ke} h⁻¹이다. 마지막 채혈 이후에도 1차 소실이 이어진다. ${isTotal?'전체 AUC₀–∞':'마지막 채혈 이후 무한대까지의 AUC_last–∞'}는?\n필요한 식: AUC_last–∞ = C_last/kₑ.`,answer:isTotal?total:tail,unit:'mg·h/L',digits:1,source:source(14,39),formula:isTotal?'AUC₀–∞ = AUC₀–last + C_last/kₑ':'AUC_last–∞ = C_last/kₑ',steps:['마지막 채혈 이후 농도가 지수적으로 줄어든다고 가정합니다.',`남은 면적 = C_last/kₑ = ${clast}/${ke} = ${n(tail)} mg·h/L`,isTotal?`전체 AUC = ${aucObserved} + ${n(tail)} = ${n(total)} mg·h/L`:`관측 면적 ${aucObserved} mg·h/L는 이미 측정한 앞부분이므로, 남은 면적만 묻는 이 문항에는 더하지 않습니다.`]};
      wrong=isTotal?[candidate(aucObserved,'관측 구간의 면적만 사용하고 마지막 측정 이후 남은 면적 C_last/kₑ를 빠뜨렸습니다.'),candidate(tail,'마지막 채혈 이후 면적만 계산했습니다. 전체 AUC에는 관측 면적도 더합니다.'),candidate(aucObserved+clast,'마지막 농도 C_last를 면적처럼 더했습니다. 농도를 kₑ로 나누어 시간 단위까지 포함한 면적으로 바꿔야 합니다.'),candidate(aucObserved+clast*ke,'남은 면적은 C_last와 kₑ를 곱하는 값이 아니라 C_last/kₑ입니다.'),candidate(aucObserved+tail*.693,'AUC 외삽에는 반감기 계수 0.693을 추가로 곱하지 않습니다.')]:[candidate(total,'관측 면적까지 더한 전체 AUC입니다. 이 문항은 마지막 채혈 이후의 면적만 묻습니다.'),candidate(clast*ke,'남은 면적은 C_last를 kₑ로 나눕니다. 곱하면 mg·h/L의 단위가 나오지 않습니다.'),candidate(clast,'마지막 측정 농도 mg/L 자체를 면적 mg·h/L로 해석했습니다.'),candidate(tail*.693,'반감기 계수 0.693을 불필요하게 곱했습니다. 지수 소실의 적분 면적은 C_last/kₑ입니다.'),candidate(aucObserved,'AUC₀–last는 이미 관측한 앞부분의 면적이며, 무한대까지 남은 면적과 다릅니다.')];
      return finish(q,wrong,random);
    }
    const scale=pick([1,2,3],random),dt=pick([1,2],random),times=[0,1,3,5].map(x=>x*dt),concentrations=[12,8,4,2].map(x=>x*scale);
    const areas=times.slice(1).map((t,i)=>(concentrations[i]+concentrations[i+1])/2*(t-times[i]));
    const answer=areas.reduce((a,b)=>a+b,0),left=times.slice(1).reduce((sum,t,i)=>sum+concentrations[i]*(t-times[i]),0),right=times.slice(1).reduce((sum,t,i)=>sum+concentrations[i+1]*(t-times[i]),0);
    q={...q,parameters:{times,concentrations},stem:`정맥 일시주사 후 다음 농도–시간 자료를 얻었다. 구간 사이를 직선으로 연결하여 계산한 AUC₀–${times.at(-1)}는?\n마지막 관측 이후의 면적은 포함하지 않는다.`,answer,unit:'mg·h/L',digits:1,table:{headers:['시간 (h)','농도 (mg/L)'],rows:times.map((t,i)=>[t,concentrations[i]])},source:source(13,38)+' · '+source(14,39),formula:'관측 AUC = Σ [(Cᵢ+Cᵢ₊₁)/2 × Δt]',steps:['각 구간의 평균 농도에 그 구간의 시간 간격을 곱합니다.',...areas.map((a,i)=>`${times[i]}–${times[i+1]} h: (${concentrations[i]}+${concentrations[i+1]})/2 × ${times[i+1]-times[i]} = ${a}`),`구간 면적 합 = ${areas.join(' + ')} = ${answer} mg·h/L`,'전체 AUC₀–∞를 구할 때는 이 관측 면적에 C_last/kₑ를 더합니다. 이 문항은 관측 구간만 묻습니다.']};
    wrong=[candidate(left,'각 구간의 시작 농도만 사용한 왼쪽 직사각형 합입니다. 사다리꼴은 시작·끝 농도의 평균을 사용합니다.'),candidate(right,'각 구간의 끝 농도만 사용한 오른쪽 직사각형 합입니다.'),candidate(concentrations.reduce((a,b)=>a+b,0),'농도만 더했습니다. AUC는 농도에 시간 간격을 곱한 면적입니다.'),candidate(answer-areas[0],'0시간부터 첫 관측 구간의 면적을 빠뜨렸습니다.'),candidate(answer-areas.at(-1),'마지막 두 관측점 사이의 면적도 관측 AUC에 포함됩니다.')];
  }else if(topic==='infusion'){
    const clearance=pick([5,10,20,25],random),volume=pick([30,40,50],random),target=pick([4,8,10,12],random),rate=clearance*target,concentration=variant==='concentration';
    q={...q,parameters:{clearance,volume,target,rate},stem:concentration?`청소율 ${clearance} L/h인 약물을 ${rate} mg/h로 일정하게 정맥주입한다. 항정상태 혈장 농도 Cₛₛ는?`:`분포용적 ${volume} L, 청소율 ${clearance} L/h인 약물의 혈장 농도를 항정상태에서 ${target} mg/L로 유지하려 한다. 필요한 정맥주입 속도는?`,answer:concentration?target:rate,unit:concentration?'mg/L':'mg/h',digits:1,source:source(19,44)+' · 족보 PDF 7쪽 발문 참고',steps:['항정상태에서는 투여 속도와 소실 속도가 같습니다.',concentration?`Cₛₛ = R₀/CL = ${rate}/${clearance}`:`R₀ = Cₛₛ × CL = ${target} × ${clearance}`,`결과 = ${concentration?target:rate} ${concentration?'mg/L':'mg/h'}${concentration?'':' · V는 부하용량 계산에 사용하며 유지 주입속도에는 넣지 않습니다.'}`]};
    wrong=concentration?[candidate(rate*clearance,'Cₛₛ는 R₀를 CL로 나누어 구합니다. 곱하면 CL이 커질수록 농도가 커진다는 잘못된 관계가 됩니다.'),candidate(clearance/rate,'R₀/CL의 순서를 뒤집었습니다.'),candidate(rate/volume,'유지 농도 계산에서 청소율 CL 대신 분포용적 V를 사용했습니다.'),candidate(rate,'주입속도 mg/h를 농도 mg/L로 그대로 읽었습니다.')]:[candidate(target*volume,'목표 농도 × V는 부하용량 mg입니다. 유지 주입속도 mg/h는 목표 농도 × CL입니다.'),candidate(target/clearance,'R₀ = Cₛₛ × CL에서 나눗셈을 사용했습니다.'),candidate(clearance/target,'CL을 목표 농도로 나눈 값입니다. 목표 농도를 높이면 필요한 속도도 증가해야 합니다.'),candidate(target,'목표 농도 자체를 주입속도로 해석했습니다.')];
  }else if(topic==='loading'){
    const target=pick([4,8,10,12],random),volume=pick([20,30,40,60],random),clearance=pick([2,4,5,8],random);
    q={...q,parameters:{target,volume,clearance},stem:`1구획 모델에서 분포용적 ${volume} L, 청소율 ${clearance} L/h인 약물이 있다. 초기 혈장 농도를 즉시 ${target} mg/L로 만들기 위한 정맥 부하용량은?`,answer:target*volume,unit:'mg',digits:1,source:source(20,45),steps:['정맥 부하용량은 목표 농도와 분포용적으로 정합니다.',`LD = C목표 × V = ${target} × ${volume}`,`LD = ${target*volume} mg · CL은 유지 투여속도에 사용합니다.`]};
    wrong=[candidate(target*clearance,'목표 농도 × CL은 유지 주입속도 mg/h입니다. 부하용량 mg은 목표 농도 × V입니다.'),candidate(volume/target,'분포용적을 목표 농도로 나누었습니다. 목표 농도가 높으면 필요한 부하용량은 증가합니다.'),candidate(target/volume,'부하용량 관계에서 V를 분모에 두었습니다.'),candidate(target*volume*.693,'부하용량 계산에는 ln 2 = 0.693이 필요하지 않습니다. 이 계수는 반감기 계산에 사용합니다.')];
  }else if(topic==='accumulation'){
    const r=pick([.25,.5,.75],random),c0=pick([4,8,12],random),peak=variant==='peak',answer=(peak?c0:1)/(1-r);
    q={...q,parameters:{r,c0},stem:`동일 용량을 일정 간격으로 정맥 일시주사한다. 한 투여분은 다음 투여 직전까지 ${r*100}%가 남는다. ${peak?`1회 투여 직후 농도 증가분이 ${c0} mg/L일 때 항정상태 최고 농도 Cmax,ss는?`:'항정상태 축적비 R은?'}\n필요한 식: R = 1/(1−r), Cmax,ss = C₀ × R.`,answer,unit:peak?'mg/L':'배',source:source(22,47),steps:[`다음 투여까지 남은 분율 r = ${r}`,`축적비는 무한등비급수 1+r+r²+…의 합 = 1/(1−${r})`,peak?`Cmax,ss = ${c0}/(1−${r}) = ${answer.toFixed(2)} mg/L`:`R = 1/(1−${r}) = ${answer.toFixed(2)}배`]};
    const base=peak?c0:1;
    wrong=[candidate(base*(1+r),'현재 투여분과 직전 투여분만 더한 2회 투여 결과입니다. 항정상태에서는 더 오래된 투여분도 합해야 합니다.'),candidate(base/r,'남은 분율 r로 나누었습니다. 무한등비급수의 분모는 1−r입니다.'),candidate(base*(1-r),'투여 후 남은 양을 제거된 분율과 혼동했습니다. 반복 투여의 축적은 나눗셈 1/(1−r)로 구합니다.'),candidate(base*r,'직전 투여분의 잔여 농도만 계산하고 새 투여분과 더 오래된 잔여분을 빠뜨렸습니다.'),candidate(base,'축적을 무시하고 1회 투여 직후 농도만 사용했습니다.'),candidate(base*(1+r+r*r),'3회 투여까지의 유한한 합입니다. 항정상태에서는 무한등비급수의 합을 사용합니다.')];
  }else if(topic==='renal'){
    const fe=pick([.5,.8,1],random),functionFraction=pick([.25,.5],random),oldClearance=pick([10,20,40],random),oldRate=pick([100,200,400],random),fraction=1-fe+fe*functionFraction,newCL=oldClearance*fraction;
    const query=variant==='auc'?'같은 용량과 F를 유지하면 AUC는 기존의 몇 배가 되는가?':variant==='rate'?`목표 Cₛₛ를 유지하려면 기존 주입속도 ${oldRate} mg/h를 얼마로 바꾸어야 하는가?`:'새 전신 청소율은?';
    const answer=variant==='auc'?1/fraction:variant==='rate'?oldRate*fraction:newCL;
    q={...q,parameters:{fe,functionFraction,oldClearance,oldRate},stem:`기존 전신 청소율은 ${oldClearance} L/h이며 이 중 신장 청소율이 ${fe*100}%를 차지한다. 신기능이 기존의 ${functionFraction*100}%로 감소했다. ${query}\n신장 CL은 신기능에 비례하고 비신장 CL과 F는 변하지 않는다고 가정한다.`,answer,unit:variant==='auc'?'배':variant==='rate'?'mg/h':'L/h',source:'약동학(3) PDF 15쪽 · 슬라이드 61쪽',formula:variant==='auc'?'AUC새/AUC기존 = CL기존/CL새':variant==='rate'?'R₀새/R₀기존 = CL새/CL기존':definition.formula,steps:[`CL의 잔존 비율 = 비신장 몫 + 변한 신장 몫`,`(1−${fe}) + ${fe} × ${functionFraction} = ${n(fraction)}`,`새 CL = ${oldClearance} × ${n(fraction)} = ${n(newCL)} L/h`,variant==='auc'?`AUC 비 = ${oldClearance}/${n(newCL)} = ${answer.toFixed(2)}배`:variant==='rate'?`같은 목표 농도: R₀새 = ${oldRate} × ${n(fraction)} = ${n(answer)} mg/h`:`새 전신 청소율 = ${answer.toFixed(2)} L/h`]};
    wrong=variant==='auc'?[candidate(fraction,'AUC는 CL과 반비례합니다. CL 잔존 비율을 AUC 비로 그대로 사용했습니다.'),candidate(1/functionFraction,'전신 CL 전체가 신기능과 같은 비율로 감소한다고 처리했습니다. 비신장 몫을 따로 보존해야 합니다.'),candidate(functionFraction,'신기능 비율 자체를 AUC 비로 해석했습니다.'),candidate(1/(fe*functionFraction),'남아 있는 비신장 CL을 빠뜨리고 신장 몫만으로 AUC 변화를 계산했습니다.')]:variant==='rate'?[candidate(oldRate/functionFraction,'신기능 감소에 따라 속도를 오히려 증가시켰고 비신장 몫도 빠뜨렸습니다.'),candidate(oldRate*functionFraction,'전신 CL 전체를 신기능 감소 비율만큼 줄였습니다. 비신장 몫은 보존합니다.'),candidate(oldRate/fraction,'AUC 변화와 유지 주입속도 변화를 혼동했습니다. 목표 농도를 유지할 속도는 CL에 비례합니다.'),candidate(oldRate,'CL이 감소했는데 주입속도를 유지하면 목표 Cₛₛ보다 농도가 높아집니다.')]:[candidate(oldClearance*functionFraction,'전신 CL 전체에 신기능 감소율을 적용했습니다. 비신장 CL은 유지해야 합니다.'),candidate(oldClearance*fe*functionFraction,'신장 CL만 계산하여 남아 있는 비신장 CL을 빠뜨렸습니다.'),candidate(oldClearance/fraction,'CL 변화율을 역수로 적용했습니다. 신기능 감소로 CL이 커지지는 않습니다.'),candidate(oldClearance,'신장 CL 감소를 반영하지 않았습니다.')];
  }
  return finish(q,wrong,random);
}

export function pickPkTopic(state,filter='all',random=Math.random){
  if(filter!=='all'&&PK_TOPICS.some(x=>x.id===filter))return filter;
  const pool=PK_TOPICS.filter(x=>x.id!==state.lastTopic);
  const score=x=>(state.seenTopics?.[x.id]||0)-.25*(state.missedTopics?.[x.id]||0);
  const low=Math.min(...pool.map(score));
  return pick(pool.filter(x=>score(x)===low),random).id;
}
