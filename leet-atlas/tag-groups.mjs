// Display neighborhoods only: registered tag IDs and assignments stay unchanged.
const FIELD_GROUPS = [
  ['law','법률·제도',['공법','사법·민사절차','형사·증거','국제법','법일반·해석']],
  ['humanities','철학·언어·역사·예술',['철학','언어학','역사학','미학','문학']],
  ['society','사회·경제·행동',['경제학','정치학','일반사회','심리학','언론학']],
  ['formal','수학·논리·정보',['논리학','수학','정보과학']],
  ['science','자연·생명과학',['물리','화학','생물','지구과학','기타 과학']],
];
const TYPE_GROUPS = [
  ['arguments','논증·관점 분석',['논증 평가','관점 비교','논증 구조']],
  ['application','규칙·내용 이해',['규칙·사례 적용','내용 추론']],
  ['models','실험·모형·퍼즐',['실험 분석','모형·수리 추론','논리 퍼즐']],
];
const LOGIC_GROUPS = [
  ['arguments','논증 평가·전제',['강화·약화','논증구조','관련성·중립','수단·목적 분석','숨은 전제','전제·추론 비판','규범·가치 판단']],
  ['conditions','조건·명제·모순',['조건문 연결','필요충분조건','필요·충분 구별','대우','선언·소거','모순·양립가능성','귀류법','반례 구성']],
  ['rules','규칙·개념·해석',['개념·기준 적용','표현·범위 해석','원칙·예외 적용','보편 원칙 적용']],
  ['experiments','가설·인과·실험',['경쟁가설 판별','인과·상관 구별','변수 통제','개입·경로 추적','차이 비교','반사실 조건 비교']],
  ['quantities','수식·수량 비교',['수식 계산','대소·성분별 비교','방향·증감 추론','최솟값·최댓값','비례·반비례','비율·절대량','변화량 비교']],
  ['cases','경우·배치·확률',['경우 분류','집합·포함관계','비둘기집 원리','경우의 수','확률·조건부 판단','기댓값 계산','대응·배치','순서·우선순위']],
];
const FIELD_ORDER=FIELD_GROUPS.flatMap(group=>group[2]);
const compareLabels=(a,b)=>String(a.label||'').localeCompare(String(b.label||''),'ko',{numeric:true});

function configuredGroups(tags,axis,definitions,fallbackLabel) {
  const used=new Set();
  const groups=definitions.map(([id,label,labels])=>({
    id:`${axis}-${id}`,label,tags:tags.filter(tag=>labels.includes(tag.label)).sort(compareLabels),
  })).filter(group=>group.tags.length);
  groups.forEach(group=>group.tags.forEach(tag=>used.add(tag.id)));
  const other=tags.filter(tag=>!used.has(tag.id)).sort(compareLabels);
  if(other.length)groups.push({id:`${axis}-other`,label:fallbackLabel,tags:other});
  return groups;
}

function subjectGroups(tags) {
  const groups=new Map();
  for(const tag of tags) {
    const parents=Array.isArray(tag.parentFields)?tag.parentFields.filter(p=>typeof p==='string'&&p):[];
    const parent=parents[0] || tag.parentField || '분야 미지정';
    if(!groups.has(parent))groups.set(parent,{id:`subject:${parent}`,label:parent,tags:[]});
    groups.get(parent).tags.push(tag);
  }
  const fieldRank=label=>FIELD_ORDER.includes(label)?FIELD_ORDER.indexOf(label):FIELD_ORDER.length;
  return [...groups.values()].sort((a,b)=>fieldRank(a.label)-fieldRank(b.label)||compareLabels(a,b))
    .map(group=>({...group,tags:group.tags.sort(compareLabels)}));
}

function yearGroups(tags) {
  const groups=new Map();
  for(const tag of tags) {
    const year=Number(String(tag.label||'').match(/(?:19|20)\d{2}/)?.[0]);
    const decade=Number.isFinite(year)?Math.floor(year/10)*10:0;
    const label=year===2009?'2009학년도·예비시험':decade?`${decade}년대`:'기타 연도';
    const id=year===2009?'year-2009':`year-${decade||'other'}`;
    if(!groups.has(id))groups.set(id,{id,label,rank:year===2009?2009:decade,tags:[]});
    groups.get(id).tags.push(tag);
  }
  const yearOf=tag=>Number(String(tag.label||'').match(/(?:19|20)\d{2}/)?.[0])||0;
  return [...groups.values()].sort((a,b)=>b.rank-a.rank).map(({rank,...group})=>({
    ...group,tags:group.tags.sort((a,b)=>yearOf(b)-yearOf(a)||Number(String(a.label).includes('예비'))-Number(String(b.label).includes('예비'))||compareLabels(a,b)),
  }));
}

export function groupTags(tags,{axis}={}) {
  if(!Array.isArray(tags)||!tags.length)return [];
  const unique=[...new Map(tags.filter(tag=>tag&&typeof tag==='object'&&(!axis||tag.axis===axis)).map(tag=>[tag.id,tag])).values()];
  if(!unique.length)return [];
  const selectedAxis=axis||unique[0].axis;
  if(selectedAxis==='field')return configuredGroups(unique,selectedAxis,FIELD_GROUPS,'기타 분야');
  if(selectedAxis==='type')return configuredGroups(unique,selectedAxis,TYPE_GROUPS,'기타 문항 유형');
  if(selectedAxis==='logic')return configuredGroups(unique,selectedAxis,LOGIC_GROUPS,'기타 풀이 논리');
  if(selectedAxis==='subject')return subjectGroups(unique);
  if(selectedAxis==='year')return yearGroups(unique);
  return [{id:`${selectedAxis||'tag'}-all`,label:selectedAxis==='domain'?'전체 대범주':'기타 태그',tags:unique.sort(compareLabels)}];
}
