const clean=value=>String(value??'').replace(/\s+/g,' ').trim();
export function profileSource(question,pointer){
  if(pointer==='summary')return question.summary||'';
  if(pointer==='sourceStem')return question.sourceStem||question.text||'';
  const split=String(pointer).indexOf(':'),kind=pointer.slice(0,split),key=pointer.slice(split+1);
  if(kind==='options')return question.options?.find(option=>String(option.number)===key)?.explanation||'';
  if(kind==='statements')return question.statements?.find(statement=>statement.label===key)?.explanation||'';
  if(kind==='steps'||kind==='pitfalls')return question[kind]?.[Number(key)]||'';
  return '';
}
export function profileFingerprint(question){
  const text=JSON.stringify([question.id,question.text||question.sourceText||question.sourceStem||'',question.summary,question.steps,question.sourceOptions,question.options,question.statements,question.pitfalls]);
  // Staleness marker, not a security digest; shipped files also carry SHA-256.
  let hash=2166136261;for(let index=0;index<text.length;index++){hash^=text.charCodeAt(index);hash=Math.imul(hash,16777619);}
  return `${text.length}:${(hash>>>0).toString(16)}`;
}
export function validateProfile(question,profile){
  return Boolean(profile&&profile.id===String(question.id)&&profile.fingerprint===profileFingerprint(question)&&typeof profile.brief==='string'&&profile.brief.trim()&&profile.brief.length<=1200&&typeof profile.reasoning==='string'&&profile.reasoning.trim()&&profile.reasoning.length<=1600&&Array.isArray(profile.traps)&&profile.traps.length<=5&&profile.traps.every(text=>typeof text==='string'&&text.length<=900)&&Array.isArray(profile.evidence)&&profile.evidence.length>0&&profile.evidence.length<=8&&profile.evidence.every(item=>typeof item?.source==='string'&&typeof item.quote==='string'&&clean(item.quote).length>=4&&clean(profileSource(question,item.source)).includes(clean(item.quote))));
}
export function profileSections(question,profile){
  if(!validateProfile(question,profile))return [];
  const labelFor=source=>source.startsWith('options:')?`${source.slice(8)}번 선택지 해설`:source.startsWith('statements:')?`${source.slice(11)} 보기 판단`:source==='sourceStem'?'공개 원문':source==='summary'?'핵심 해설':source.startsWith('steps:')?'풀이 단계':'놓치기 쉬운 지점';
  const support=profile.evidence.map(item=>({label:labelFor(item.source),text:clean(item.quote)}));
  return [
    {kind:'profile',label:'문항 특징 분석',text:clean(profile.brief),support},
    {kind:'profile',label:'추론 과정 분석',text:clean(profile.reasoning),support},
    ...profile.traps.map(text=>({kind:'profile',label:'선택지의 함정 분석',text:clean(text),support}))
  ].filter(section=>section.text);
}
