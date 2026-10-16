import {CNS_DRUG_PRIORITY,cnsPriority} from './cns-priority.mjs?v=20261017-exam2';
import {CNS_DETAIL_PAIRS} from './cns-detail-pairs.mjs?v=20261016-cnspairs1';
const labels={ache:'AChE 억제',nmda:'NMDA 수용체 차단',amyloid:'아밀로이드β 표적 항체',precursor:'도파민 전구물질',aadc:'말초 AADC 억제',maob:'MAO-B 억제',comt:'COMT 억제',da:'도파민 수용체 효능',bzd:'Cl⁻ 통로 개방 빈도 증가',flumazenil:'BZD 결합부위 길항',barbiturate:'Cl⁻ 통로 개방 시간 증가',buspirone:'5-HT₁A 부분효능',zolpidem:'Z-drug 수면제',iv:'정맥마취제',inhaled:'흡입마취제',ssri:'SSRI',snri:'SNRI',tca:'TCA',d2:'정형 항정신병제 · D₂ 길항',atypical:'비정형 항정신병제 · D₂ 길항',aripiprazole:'비정형 항정신병제 · D₂ 부분효능',na:'전압개폐 Na⁺ 통로 차단',dual:'Na⁺·T형 Ca²⁺ 통로 차단',hva:'고전압활성 Ca²⁺ 통로 조절',ttype:'T형 Ca²⁺ 통로 차단',sv2a:'SV2A 결합',opioid:'아편수용체 효능',antagonist:'아편수용체 길항'};
const templates={
 structure:['다음 수용체와 신호전달 방식의 연결 중','이온통로형·GPCR 구분에 관한 다음 연결 중','수용체–구조 분류를 비교한 연결 중','수용체의 작용 방식에 관한 다음 연결 중'],
 effect:['14강 요약표의 수용체–흥분·억제 연결 중','강의록 요약표의 신경전달작용 분류와 수용체 연결 중','14강 표에 제시된 수용체와 작용 방향의 연결 중','강의의 흥분성·억제성 분류에 관한 수용체 연결 중'],
 disease:['15강 약물표의 약물–주된 치료 목적 연결 중','강의록의 중추신경계 질환과 약물 분류에 관한 연결 중','15강에 제시된 약물과 주요 용도의 연결 중','강의록 약물표의 치료 목적을 비교한 다음 연결 중'],
 features:['다음 약물과 세부 특징의 연결 중','강의록의 약물–표적·계열 연결을 비교할 때','중추신경계 약물의 특징에 관한 다음 연결 중','강의에 제시된 약물과 작용·특징의 연결 중']
};
function candidates(pool,anchor,index){
 const ordered=[...pool.slice(index%pool.length),...pool.slice(0,index%pool.length)],out=[],used=new Set([anchor.left]),families=new Set([anchor.family]),values=new Set([anchor.right]);
 const take=r=>{out.push(r);used.add(r.left);families.add(r.family);values.add(r.right);};
 for(const r of ordered)if(!used.has(r.left)&&!families.has(r.family)&&!values.has(r.right)){take(r);if(out.length===4)return out;}
 for(const r of ordered)if(!used.has(r.left)&&!families.has(r.family)){take(r);if(out.length===4)return out;}
 for(const r of ordered)if(!used.has(r.left)){take(r);if(out.length===4)return out;}
 throw Error('Not enough distinct paired entities: '+anchor.left);
}

export function buildCnsPairQuestions({RECEPTORS,DRUGS,hasMechanism,possibleUse}){
 const questions=[];
 function make(id,area,subject,group,anchor,pool,index,target){
  const priority=['structure','effect'].includes(area)?'receptor':cnsPriority(anchor.entity);
  let preferred=pool;
  if(priority==='structure-drug'){
   const structured=pool.filter(r=>CNS_DRUG_PRIORITY[r.entity]?.structures.length);
   if(new Set(structured.map(r=>r.left)).size>=5)preferred=structured;
  }
  if(preferred===pool&&priority!=='background'&&priority!=='receptor'){
   const emphasized=pool.filter(r=>CNS_DRUG_PRIORITY[r.entity]?.emphasized);
   if(new Set(emphasized.map(r=>r.left)).size>=5)preferred=emphasized;
  }
  const polarity=questions.length%2?'incorrect':'correct',others=candidates(preferred,anchor,index);
  const keyed=polarity==='correct'?anchor.right:anchor.wrong,otherText=r=>polarity==='correct'?r.wrong:r.right;
  if(others.every(r=>otherText(r)===keyed)){
   const used=new Set([anchor.left,...others.map(r=>r.left)]),replacement=preferred.find(r=>!used.has(r.left)&&otherText(r)!==keyed);
   if(!replacement)throw Error('No contrasting feature: '+id);others[3]=replacement;
  }
  const rows=[anchor,...others],display=(r,text)=>r.dimension==='mechanism'?'대표 분류: '+text:text,pairs=rows.map((r,i)=>{
   const valid=i===0?polarity==='correct':polarity==='incorrect',right=valid?r.right:r.wrong;
   return {entity:r.entity,left:r.left,right:display(r,right),correctRight:display(r,r.right),valid,dimension:r.dimension,value:valid?r.value:r.wrongValue,source:r.source,explanation:r.note};
  }),answer=pairs[0].left+' — '+pairs[0].right,stem=(anchor.dimension==='mechanism'?['15강 약물표의 대표 작용·계열 분류에 관한 다음 연결 중','15강에서 제시한 대표 기전 분류를 기준으로 할 때, 다음 연결 중','15강의 약물별 대표 표적·계열 분류에 관한 연결 중','15강 약물표에서 대표 작용으로 분류한 다음 연결 중']:templates[area])[Math.floor(index/2)%4]+(polarity==='correct'?' 옳은 것은?':' 옳지 않은 것은?');
  const note=`${polarity==='correct'?'옳은 연결':'옳지 않은 연결'}은 '${answer}'입니다. ${polarity==='incorrect'?`바른 연결은 '${anchor.left} — ${display(anchor,anchor.right)}'입니다. `:''}${anchor.note}`;
  questions.push({id,area,subject,group,target,polarity,priority,prioritySources:CNS_DRUG_PRIORITY[anchor.entity]||null,stem,options:pairs.map(p=>p.left+' — '+p.right),answer,note,source:anchor.source,pairs,details:pairs.map(p=>`${p.left} — ${p.right}: ${p.valid?'옳은 연결':'옳지 않은 연결'}. 바른 연결: ${p.left} — ${p.correctRight}. ${p.explanation} (${p.source})`)});
 }
 for(const area of ['structure','effect']){
  const property=area==='structure'?'type':'effect',pool=RECEPTORS.filter(r=>r[property]).map(r=>{const value=r[property],right=area==='structure'?(value==='ionotropic'?'Ionotropic':'Metabotropic'):(value==='excitatory'?'흥분성':'억제성');return {entity:r.id,left:r.id==='glyr'?'Glycine 수용체':r.name,right,wrong:area==='structure'?(right==='Ionotropic'?'Metabotropic':'Ionotropic'):(right==='흥분성'?'억제성':'흥분성'),value,wrongValue:area==='structure'?(value==='ionotropic'?'metabotropic':'ionotropic'):(value==='excitatory'?'inhibitory':'excitatory'),dimension:area,source:r.source,note:r.why,family:r.family};});
  pool.forEach((r,i)=>make(area+'-'+r.entity,area,r.entity,area+'-'+r.family,r,pool,i,r.value));
 }
 const diseaseWrong=['알츠하이머병','파킨슨병','우울증','조현병','뇌전증'];
 function use(d,category){
  if(possibleUse(d,category))return true;
  if(category==='우울증'&&['na','dual','hva','barbiturate','bzd'].includes(d.mechanism))return true;
  if(category==='파킨슨병'&&['atypical','aripiprazole'].includes(d.mechanism))return true;
  return false;
 }
 const disease=DRUGS.map((d,i)=>{const right=d.categories[0],wrong=diseaseWrong.filter(c=>!use(d,c))[i%diseaseWrong.filter(c=>!use(d,c)).length];return {entity:d.id,left:d.name,right,wrong,value:right,wrongValue:wrong,dimension:'disease',source:d.source,note:d.note,family:d.family};});
 disease.forEach((r,i)=>make('disease-'+r.entity,'disease',r.entity,'disease-'+r.family,r,disease,i));
 const ivIds=new Set(['fentanyl','ketamine','propofol','midazolam','thiopental','methohexital']);
 function mechanism(d,key){
  if(hasMechanism(d,key))return true;
  if(d.id==='zolpidem'&&key==='bzd')return true;
  return false;
 }
 const mechanisms=DRUGS.map((d,i)=>{
  const route=['iv','inhaled'].includes(d.mechanism),right=labels[d.mechanism];
  const wrongKey=route?(d.mechanism==='iv'?'inhaled':'iv'):Object.keys(labels).filter(k=>!['iv','inhaled'].includes(k)&&!mechanism(d,k))[i%Object.keys(labels).filter(k=>!['iv','inhaled'].includes(k)&&!mechanism(d,k)).length];
  return {entity:d.id,left:d.name,right,wrong:labels[wrongKey],value:d.mechanism,wrongValue:wrongKey,dimension:route?'route':'mechanism',source:d.source,note:d.note,family:d.family,route};
 });
 const routePool=DRUGS.filter(d=>ivIds.has(d.id)||d.mechanism==='inhaled').map(d=>({entity:d.id,left:d.name,right:ivIds.has(d.id)?labels.iv:labels.inhaled,wrong:ivIds.has(d.id)?labels.inhaled:labels.iv,value:ivIds.has(d.id)?'iv':'inhaled',wrongValue:ivIds.has(d.id)?'inhaled':'iv',dimension:'route',source:d.source,note:d.note,family:d.family}));
 mechanisms.forEach((r,i)=>make('mechanism-'+r.entity,'features',r.entity,'mechanism-'+r.family,r,r.route?routePool:mechanisms.filter(x=>!x.route),i));
 const details=CNS_DETAIL_PAIRS.map(r=>({...r,entity:r.left.startsWith('TCA')?'amitriptyline':r.subject,dimension:'detail',value:r.right,wrongValue:r.wrong}));
 details.forEach((r,i)=>make(r.id,'features',r.subject,'details-'+r.family,r,details,i));
 return questions;
}
