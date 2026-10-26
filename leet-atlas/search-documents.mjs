// Search evidence is derived from records, never from a query or a result-ID list.
import {visualEvidence} from './search-visual-evidence.mjs?v=20261026-general-search2';
import {profileData} from './search-profile-data.mjs?v=20261026-general-search2';
import {profileSections} from './search-profile-format.mjs?v=20261026-general-search2';
const clean=value=>String(value??'').replace(/\s+/g,' ').trim();
const strings=value=>Array.isArray(value)?value.flatMap(strings):value&&typeof value==='object'?Object.values(value).flatMap(strings):typeof value==='string'?[value]:[];
const original=q=>String(q.text||q.sourceText||q.sourceStem||q.rawText||'');
const circled=['','①','②','③','④','⑤'];

export function questionSpeakers(q){
  const turns=[...original(q).normalize('NFKC').matchAll(/^[ \t]*(?:\([가-힣]\)\s*)?([가-힣A-Za-z][가-힣A-Za-z·]{0,13})[ \t]*:/gm)].map(m=>m[1]).filter(name=>!/^(?:원리|규칙|법칙|조건|명제|사례|예시|정의|자료|보기)/.test(name));
  const names=[...new Set(turns)];
  return [...new Set(names.map(name=>{const full=names.filter(other=>other.length>1&&other.startsWith(name));return name.length===1&&full.length===1?full[0]:name;}))];
}

export function questionForm(q){
  const options=(q.sourceOptions||[]).map(o=>String(o.text||'').trim());
  const prompt=String(q.sourceStem||original(q)).split(/\n\s*\n/)[0];
  const completion=/들어갈|채워|채우|완성할|빈칸.{0,35}(?:적절|알맞|옳)/s.test(prompt);
  const marker=/(?:ㄱ|ㄴ|ㄷ|ㄹ|ㅁ|ㅂ|㉠|㉡|㉢|㉣|㉤|㉥|갑|을|병|정|무|기|\([가나다라마바]\))/g;
  const combinations=options.length===5&&options.every(value=>value&&value.match(marker)&&!value.replace(marker,'').replace(/[\s,·ㆍ와과및또는\-–→]+/g,''));
  let choice='unknown';
  if(options.length===5&&options.every(value=>!value))choice='image';
  else if(combinations)choice=options.every(value=>/[-→]/.test(value))?'ordering':'combination';
  else if(options.length===5&&options.every(value=>/^[A-Z]\s{2,}[A-Z]$/.test(value)||/\([^)]*\).{2,}(?:필요|충분)/.test(value)||value.split('/').length>=3))choice='paired';
  else if(options.length===5&&options.every(value=>value.length>=6&&/[가-힣]{2}/.test(value)&&/(?:[다까요]|경우)[.!?。]?$/.test(value.replace(/\s+/g,''))))choice='statements';
  else if(options.length===5&&options.every(value=>value&&/^[\s\d.,%＋+−\-×÷=()원만억천명개대배분초일년월시시간점:가나다a-zA-Z\/]+$/.test(value)))choice='values';
  return {choice,completion,prompt};
}

function featureDescription(q){
  const form=questionForm(q),parts=[];
  const descriptions={
    statements:'독립 선택지형. ①~⑤가 각각 완결된 진술이며 하나를 고르는 단일 정답 문항이다.',
    combination:'합답형. 여러 보기나 인물 중 옳은 것을 조합해 선택하는 형식이다.',
    ordering:'순서 배열형. 보기나 사례의 순서를 정해 나열한 선택지를 고른다.',
    paired:'대응 선택형. 두 개 이상의 값이나 방법을 짝지어 고르는 선택지이다.',
    values:'수치·수식 선택형. 서로 독립된 값이나 식 중 하나를 고르는 단일 정답 형식이다.',
    image:'이미지에 제시된 선택지로 텍스트만으로 선택지 형식을 확인할 수 없다.'
  };
  if(descriptions[form.choice])parts.push(descriptions[form.choice]);
  if(form.completion)parts.push('빈칸 완성형. 기호로 표시된 비어 있는 부분에 들어갈 적절한 진술·내용·값을 채우는 과제이다.',`질문: ${clean(form.prompt)}`);
  if((q.logic||[]).includes('수식 계산'))parts.push('수량·금액·비율 등 수식 계산이 필요한 풀이로 분류된 문항이다.',clean(q.tagReasons?.['수식 계산']||q.classificationReasons?.logicReason));
  const names=questionSpeakers(q);
  if(names.length)parts.push(`원문 화자 ${names.length}명: ${names.join(', ')}.`);
  return parts.filter(Boolean).join(' ');
}

export function questionSearchSections(q){
  const result=[];
  const add=(kind,label,text)=>{text=clean(text);if(text)result.push({kind,label,text});};
  add('metadata','문항 분류',[q.id,q.examLabel,q.year?`${q.year}학년도`:'',q.title,...(q.domains||[]),...(q.fields||[]),...(q.subjects||[]),...(q.types||[]),...(q.logic||[])].filter(Boolean).join(' · '));
  add('features','출제 형식과 풀이',featureDescription(q));
  result.push(...profileSections(q,profileData.profiles[String(q.id)]));
  const visual=visualEvidence[String(q.id)];
  if(visual?.sourceText===original(q))add('visual','원문 이미지에서 확인한 빈칸',visual.text);
  add('summary','핵심 해설',q.summary);
  for(const [index,step] of (q.steps||[]).entries())add('step',`풀이 ${index+1}단계`,step);
  add('classification','분류 근거',[...new Set(strings(q.classificationReasons).concat(strings(q.tagReasons)))].join(' '));
  add('source','원문',original(q));
  const options=new Map((q.options||[]).map(o=>[Number(o.number),o]));
  for(const option of q.sourceOptions||[]){
    const number=Number(option.number),analysis=options.get(number);
    add('option',`${number}번 ${circled[number]||''} 선택지${analysis?.explanation?'와 해설':''}`,[option.text,analysis?.explanation?`선택지 해설: ${analysis.explanation}`:''].filter(Boolean).join('\n'));
    if(analysis?.explanation)add('explanation',`${number}번 ${circled[number]||''} 선택지 해설`,analysis.explanation);
    options.delete(number);
  }
  for(const [number,option] of options)add('explanation',`${number}번 ${circled[number]||''} 선택지 해설`,option.explanation);
  for(const statement of q.statements||[])add('statement',`${statement.label||''} 보기 판단`,statement.explanation);
  for(const pitfall of q.pitfalls||[])add('pitfall','놓치기 쉬운 지점',typeof pitfall==='string'?pitfall:strings(pitfall).join(' '));
  return result;
}

export function questionSearchText(q){return questionSearchSections(q).map(s=>`${s.label}: ${s.text}`).join('\n');}

export function buildSearchDocuments(questions){
  return questions.flatMap(q=>{
    const prefix=clean([q.title,...(q.fields||[])].join(' · ')).slice(0,110),documents=[];
    for(const section of questionSearchSections(q)){
      // Overlap preserves sentences and evidence crossing chunk boundaries.
      for(let start=0;start<section.text.length;start+=380){
        const text=section.text.slice(start,start+500);
        // Abstract explanation/shape evidence must not be drowned out by its
        // incidental topic. Its question ID and source label travel separately.
        const direct=['metadata','features','visual','explanation','statement','pitfall','profile'].includes(section.kind);
        documents.push({id:String(q.id),kind:section.kind,label:section.label,text:direct?text:`${prefix}\n${section.label}: ${text}`,...(section.support?{support:section.support}:{})});
        if(start+500>=section.text.length)break;
      }
    }
    return documents;
  });
}
