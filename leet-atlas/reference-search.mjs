// Recommendation signals are derived from the supplied records, never question IDs.
import {questionSearchSections,questionForm} from './search-documents.mjs?v=20261026-general-search2';
export {buildSearchDocuments} from './search-documents.mjs?v=20261026-general-search2';
import {compileSearchIntent,describeSearchIntent,normalizeSearchText} from './search-intent.mjs?v=20261031-author-db';
export {compileSearchIntent,describeSearchIntent} from './search-intent.mjs?v=20261031-author-db';
const clean=value=>String(value??'').normalize('NFKC').replace(/\s+/g,' ').trim();
const normalized=value=>clean(value).toLocaleLowerCase('ko');
const compact=value=>normalized(value).replace(/\s/g,'');
const sourceFields=q=>[q.text,q.sourceText,q.sourceStem,q.rawText,q.sourceOptions].filter(value=>typeof value==='string'&&value.trim()).filter((value,index,all)=>all.indexOf(value)===index);
const sourceOf=q=>String(q.text||q.sourceText||q.sourceStem||q.rawText||'');
const labelsOf=q=>[...(q.domains||[]),...(q.fields||[]),...(q.subjects||[]),...(q.types||[]),...(q.logic||[])];
const values=object=>Object.values(object||{}).filter(value=>typeof value==='string');
const concepts=[
  {key:'humanities',query:['인문','철학','인문학'],evidence:['인문','철학','미학','언어학'],weight:12,classification:true},
  {key:'logic',query:['논리학','논리적','논리'],evidence:['논리학','논증'],weight:12,classification:true},
  {key:'physics',query:['물리학','물리'],evidence:['물리학'],weight:12,classification:true},
  {key:'law',query:['법학','법률','형법','형사','법적'],evidence:['형사·증거','법일반·해석','민사','공법','법'],weight:12,classification:true},
  {key:'puzzle',query:['논리퍼즐','참거짓퍼즐','거짓말퍼즐','거짓말찾기'],evidence:['논리 퍼즐','거짓말 찾기'],weight:12,classification:true},
  {key:'mother',query:['엄마','어머니','모친'],evidence:['어머니','엄마','모친'],weight:17},
  {key:'child',query:['자식','자녀','아들','딸아이'],evidence:['자녀','자식','아들','얘야','딸아이'],weight:13},
  {key:'study',query:['공부','시험공부','학습'],evidence:['공부','시험공부','학습'],weight:12},
  {key:'inaction',query:['아무것도안','하지않','안하는','안해도','부작위'],evidence:['부작위','하지 않는','하지 않','아무것도 안'],weight:12},
  {key:'cause',query:['원인','인과','때문'],evidence:['원인','인과'],weight:12},
  {key:'fiction',query:['소설','허구','이야기속','작품속'],evidence:['소설','허구'],weight:12},
  {key:'nostril',query:['콧구멍','코구멍'],evidence:['콧구멍','코 구멍'],weight:20},
  {key:'sequel',query:['속편','후속작'],evidence:['속편','후속작'],weight:15},
  {key:'truth',query:['참인','진실','참거짓','진리'],evidence:['참인','참이','참거짓','진리'],weight:8},
  {key:'definition',query:['정의','개념','무엇인가'],evidence:['정의','개념','무엇인가'],weight:10},
  {key:'proposition',query:['명제'],evidence:['명제'],weight:14},
  {key:'counterexample',query:['반례'],evidence:['반례'],weight:12},
];
const debateAliases=['논쟁','논박','반박','논란','설전','의견대립','의견이다른','서로싸우','싸우는','다투는','따지는'];
const physicalAliases=['몸싸움','주먹','주먹질','때리','때려','폭행','구타','멱살','신체적','물리적충돌'];
const negativeAfter=/^(?:은|는|을|를|이|가|의|도|이야기|문항|문제|소재|에관한|에대한|이)?(?:거의|별로|전혀|굳이|크게|많이)?(?:필요(?:가)?없|필요하지않|존재하지않|포함되지않|들어가지않|아닌|아니라|말고|제외|빼고|없이|없는|없고|않는|아니고)/;
const formConcepts=[
  {key:'independent',aliases:['단일정답','독립선택지','독립선지','단순선택형'],label:'독립 선택지형'},
  {key:'combination',aliases:['합답형','조합형','보기조합','ㄱㄴㄷ조합'],label:'보기 조합형'},
  {key:'completion',aliases:['빈칸','공란','채워넣','끼워넣'],label:'빈칸 완성'},
  {key:'calculation',aliases:['계산','산출','산정'],label:'수식 계산'}
];

function mentions(query,aliases){
  const text=compact(query);let positive=false,negative=false;
  for(const alias of aliases){
    const word=compact(alias);let start=0,index;
    while((index=text.indexOf(word,start))>=0){
      // A shorter alias inside a longer one shares the longer word's negation.
      const length=Math.max(word.length,...aliases.map(compact).filter(other=>text.startsWith(other,index)).map(other=>other.length));
      if(negativeAfter.test(text.slice(index+length)))negative=true;
      else positive=true;
      start=index+word.length;
    }
  }
  return {positive,negative};
}

function speakersOf(source){
  const turns=[...source.normalize('NFKC').matchAll(/^[ \t]*(?:\([가-힣]\)\s*)?([가-힣A-Za-z][가-힣A-Za-z·]{0,13})[ \t]*:/gm)].map(match=>match[1]).filter(name=>!/^(?:원리|규칙|법칙|조건|명제|사례|예시|정의|자료|보기)/.test(name));
  const names=[...new Set(turns)];
  const canonical=name=>{
    if(name.length!==1)return name;
    const full=names.filter(other=>other.length>1&&other.startsWith(name));
    return full.length===1?full[0]:name;
  };
  return {names:[...new Set(names.map(canonical))],turns:turns.length};
}

// App records are immutable; personal source overrides create new question objects.
const featureCache=new WeakMap();
function featuresOf(q){
  if(featureCache.has(q))return featureCache.get(q);
  const source=sourceOf(q),searchSource=sourceFields(q).join(' '),labels=labelsOf(q),speaker=speakersOf(source);
  const sections=questionSearchSections(q);
  const title=clean(q.title),analysis=clean(sections.filter(s=>!['source','metadata'].includes(s.kind)).map(s=>s.text).join(' '));
  const labelText=normalized(labels.join(' ')),metadata=normalized([q.id,q.examLabel,q.examKey,q.year,q.year?`${q.year}학년도`:'',title,labelText,analysis].join(' '));
  const text=normalized(`${searchSource} ${analysis}`),all=metadata+' '+text;
  const visualText=normalized(`${searchSource} ${analysis} ${labels.join(' ')}`);
  const form=questionForm(q),verifiedVisualBlank=sections.some(section=>section.kind==='visual');
  const answerSlot=form.completion||verifiedVisualBlank;
  const visual={
    blankSlot:answerSlot,
    blankKind:verifiedVisualBlank?'원문 이미지에서 확인한 빈칸':form.completion?'질문에 답을 채우는 형식':'',
    table:/(?:도표|기계표|점수표|시간표|조건표|주기율표|(?:^|[\s<(])표\s*(?:에서|에|로|의|를|가|는|와|과|로부터|에따라|에따른))/.test(visualText),
    diagram:/(?:그림|그래프|도식|순서도|흐름도|배치도|관계도)/.test(visualText),
    container:/(?:상자|박스)/.test(visualText),
    arrangement:/(?:일렬|배열|배치|배정|자리배정|위치관계)/.test(visualText)
  };
  const choiceCount=Math.max(...[q.options,q.sourceOptions].map(options=>Array.isArray(options)?options.length:0));
  const hasRItem=/(?:^|[\s<])ㄹ(?=[.．)〉:])/m.test(source);
  const puzzle=(q.types||[]).some(type=>/퍼즐|거짓말 찾기/.test(type));
  // A fictional character inside a speech is not a participant in the discourse.
  const explicitDebate=/논쟁|논박|반박/.test(title+' '+source.slice(0,150));
  const dialogue=speaker.turns>=3&&!puzzle;
  const debate=!puzzle&&speaker.names.length>=2&&(explicitDebate||dialogue&&/반례|하지만|그렇지만|그런데|아니|왜|근거|반대|모순/.test(source));
  // A philosophical example of violence alone is not evidence of bodily conflict.
  const physicalTitle=/몸싸움|폭행|상해|주먹|구타|멱살|정당방위/.test(title);
  const physical=physicalTitle||!debate&&/때렸|때려|때리|폭행(?:하|을|한|당|으로)|구타|멱살|주먹|몸싸움/.test(source)&&/형사|형법|상해|정당방위/.test(metadata+' '+text);
  const profileArithmetic=sections.some(section=>section.kind==='profile'&&/계산(?:한다|해|하여|함|한(?:다|뒤))|산출(?:한다|해|하여|함)|단위.{0,5}환산/.test(section.text));
  // Taxonomy can omit the calculation tag. Require both quantitative context
  // and an actual operation, so article numbers, dates and penalty thresholds
  // alone do not turn ordinary legal rule application into arithmetic.
  const quantitativeContext=(q.fields||[]).some(field=>/^(?:수학|통계학)$/.test(field))||(q.types||[]).some(type=>/모형.*수리|계산하기/.test(type));
  const numericQuantities=(searchSource.match(/\d+(?:[.,]\d+)?/g)||[]).length>=2;
  const operationPattern=/(?:\d+(?:[.,]\d+)?\s*[+＋−–×÷*/=]\s*\d)|(?:더한|더하면|더하여|뺀|빼면|빼서|뺄셈|덧셈|곱한|곱하면|곱하여|나눈|나누면|합산|가감|차액|순이익|합계|총액|평균을\s*(?:구|계산)|단위.{0,5}환산)/;
  const calculationEvidence=quantitativeContext&&numericQuantities?sections.find(section=>section.kind!=='metadata'&&operationPattern.test(section.text)):null;
  const feature={source,searchSource,title,labels,labelText,analysis,metadata,text,all,speaker,puzzle,debate,dialogue,physical,sections,visual,choiceCount,hasRItem,form,calculationEvidence,calculation:(q.logic||[]).includes('수식 계산')||(q.types||[]).includes('계산하기')||profileArithmetic||Boolean(calculationEvidence)};
  featureCache.set(q,feature);
  return feature;
}

const stopWords=new Set(['문항','문제','문항인데','문제인데','소재','소재의','사람','사람의','사람이','사람은','사람들','사람들이','서로','두','둘','명이','명','개의','개','것','거','게','수','좀','같은','가지고','관한','대한','에서','하는','되는지','있는','하고','찾아','찾기','추천','내용','이야기','모두','모두가','실제로','실제','논쟁','논박','반박','싸우는','대화','말고','제외','없는','않는','아닌','학년도','아무','관련','어떤','누군가','있나','있을까','선택지','선지','문장','하나','하나씩','느낌','정도','어느정도','경우','들어감','있고','있는데']);
for(const word of ['있다','있어','있으며','있는지','있는가'])stopWords.add(word);
function queryTokens(query){
  const stem=word=>{const stripped=word.replace(/(?:으로부터|에서의|으로|에게|에서|이랑|랑|하고|와|과|의|은|는|을|를|이|가|도)$/u,'');return stripped.length>=2?stripped:word;};
  return [...new Set(normalized(query).split(/[^\p{L}\p{N}]+/u).map(stem).filter(word=>word.length>=2&&!stopWords.has(word)&&!/^\d+$/.test(word)&&!/^(?:(?:2|두|둘)?(?:명|사람|화자)|둘)(?:이|의|가|은|는)?$/.test(word)&&!/^(?:논박|반박|논쟁|대화|싸우|다투|따지)(?:하|하는|하는지|고)?$/.test(word)))];
}

function interpret(query){
  const raw=String(query||'').normalize('NFKC').trim(),joined=compact(raw);
  const lower=raw.toLowerCase();
  const trailingNumber=lower.match(/(?:^|\s)(\d{4})\s*$/)?.[1];
  // Standalone years are also question IDs in this archive. A bare year-like
  // number in a description is therefore ordinary text unless explicitly marked;
  // leading-zero and pre-1900 IDs cannot be calendar-year references.
  const requestedId=lower.match(/^\s*#?(p\d{3}|\d{4})(?:번(?:\s*문항)?)?\s*$/i)?.[1]||lower.match(/(?:^|\s)(p\d{3})(?=\s|$|[,.!?])/i)?.[1]||lower.match(/(?:문항|문제)\s*(p\d{3}|\d{4})\s*번(?![가-힣])/i)?.[1]||(trailingNumber&&(trailingNumber.startsWith('0')||Number(trailingNumber)<1900)?trailingNumber:null);
  const physical=mentions(raw,physicalAliases),debate=mentions(raw,debateAliases);
  const two=/(?:2|두|둘)(?:명|사람|화자|인\b)|둘이/.test(joined);
  const topic=concepts.map(concept=>({...concept,...mentions(raw,concept.query)})).filter(concept=>concept.positive||concept.negative);
  const negativeWords=topic.filter(concept=>concept.negative&&!concept.positive).flatMap(concept=>concept.query);
  const forms=formConcepts.map(concept=>({...concept,...mentions(raw,concept.aliases)})).filter(concept=>concept.positive||concept.negative);
  negativeWords.push(...forms.filter(concept=>concept.negative&&!concept.positive).flatMap(concept=>concept.aliases));
  const visual={
    blank:/(?:빈(?:칸|상자|박스|네모)|공란|(?:박스|상자|칸|네모)(?:안에|에|속에)?(?:들어갈|채우|비어|빈)|(?:㉠|㉡|㉢|ⓐ|ⓑ|ⓒ|ⓓ)(?:에|을|과|와)?(?:들어갈|채울|채우는)|(?:답안|내용)(?:을)?(?:기입|작성|입력|넣))/.test(joined),
    table:/(?:도표|행렬|기계표|점수표|시간표|조건표|(?:^|\s)표\s*(?:있는|에서|에|로|의|를|가|는|문제|문항|로부터))/.test(raw),
    diagram:/(?:그림|그래프|도식|순서도|흐름도|배치도|관계도|지도)/.test(joined),
    container:false,
    arrangement:/(?:배열|배치|일렬|자리배정|순서배정|위치관계)/.test(joined)
  };
  visual.container=!visual.blank&&/(?:상자|박스)/.test(joined);
  const formatJoined=String(query||'').normalize('NFC').toLocaleLowerCase('ko').replace(/\s/g,'');
  const format={fiveChoice:/(?:5지선다|오지선다|다섯지선다|5개선택지|5개선지|선택지5개|선지5개|다섯개의선택지)/.test(formatJoined),rItem:/(?:ㄱ[,·.]*ㄴ[,·.]*ㄷ[,·.]*ㄹ|ㄹ(?:선지|항목|까지|보기))/.test(formatJoined)};
  const formatIntent=Object.values(format).some(Boolean);
  const visualIntent=Object.values(visual).some(Boolean);
  return {raw,requestedId,two,physical:physical.positive,excludePhysical:physical.negative,debate:debate.positive&&!physical.positive,excludeDebate:debate.negative,topic,forms,visual,visualIntent,format,formatIntent,tokens:queryTokens(raw).filter(token=>!negativeWords.some(word=>token.includes(word)))};
}

function snippetFor(feature,terms){
  const original=String(feature.source||feature.analysis||feature.title).replace(/\s+/g,' ').trim();
  if(!original)return '';
  const hay=normalized(original);
  let at=-1,best=0;
  for(const term of terms){const index=hay.indexOf(normalized(term));if(index>=0&&term.length>best){at=index;best=term.length;}}
  const start=at<0?0:Math.max(0,at-55),end=Math.min(original.length,start+230);
  return (start?'…':'')+original.slice(start,end)+(end<original.length?'…':'');
}

function rankByRelevance(questions,query,{semanticScores=new Map()}={}){
  const intent=interpret(query);
  if(!intent.raw||!/[가-힣a-z\d]/i.test(intent.raw))return [];
  if(intent.requestedId)return questions.filter(q=>String(q.id).toLowerCase()===intent.requestedId).map(q=>({id:q.id,score:10000,reasons:[`문항번호: ${q.id}`],snippet:snippetFor(featuresOf(q),[])}));
  const rawScores=questions.map(q=>Number(semanticScores.get(q.id))).filter(Number.isFinite).sort((a,b)=>a-b);
  const maximum=rawScores.at(-1)||0,median=rawScores.length?rawScores[Math.floor(rawScores.length/2)]:0;
  // E5 cosines have a high baseline; relative separation matters as well as the raw score.
  const semanticUseful=maximum>=.77&&(rawScores.length<=2||maximum-median>=.015);
  // A weak model association can reorder evidenced matches, but cannot create a match.
  const semanticConfident=maximum>=.85&&(rawScores.length<=2||maximum-median>=.02);
  const semanticCandidates=new Set(semanticConfident?questions.map(q=>[q.id,Number(semanticScores.get(q.id))]).filter(([,raw])=>Number.isFinite(raw)).sort((a,b)=>b[1]-a[1]).slice(0,150).map(([id])=>id):[]);
  // Common words like "strengthen" appear in many explanations. Their presence
  // must not outrank a better semantic match; new/rare words work without aliases.
  const specificity=new Map(intent.tokens.map(token=>{const frequency=questions.reduce((count,q)=>count+Number(featuresOf(q).all.includes(token)),0);return [token,Math.min(2,Math.log(1+(questions.length+1)/(frequency+1))/2)];}));
  const results=[];
  for(const q of questions){
    const feature=featuresOf(q),reasons=[],terms=[];let score=0,evidence=0,classificationScore=0;
    for(const concept of intent.topic){
      const hay=concept.classification?feature.labelText:feature.all;
      const found=concept.key==='law'?(feature.labels.some(label=>['법률','형사·증거','법일반·해석','사법·민사절차','민사','공법','국제법','형법','민법','헌법','행정법'].includes(label))?'법률':null):concept.evidence.find(word=>hay.includes(normalized(word)));
      if(!found)continue;
      if(concept.negative&&!concept.positive){score-=45;continue;}
      score+=concept.weight*(concept.key==='logic'&&found!=='논리학'?.5:1);evidence++;
      if(concept.classification)classificationScore+=concept.weight*(concept.key==='logic'&&found!=='논리학'?.25:.5);
      terms.push(found);
      if(concept.classification)reasons.push(`분류: ${concept.key==='law'?'법률':feature.labels.filter(label=>concept.evidence.some(word=>normalized(label).includes(normalized(word)))).join(' · ')}`);
    }
    const tokenMatches=[];
    for(const token of intent.tokens){
      if(!feature.all.includes(token))continue;
      // Classification has already contributed its bounded topic score.
      if(intent.topic.some(concept=>concept.query.includes(token)))continue;
      const weight=feature.title.includes(token)?15:feature.metadata.includes(token)?9:6;
      score+=weight*specificity.get(token);evidence++;tokenMatches.push(token);terms.push(token);
    }
    if(tokenMatches.length>=2)score+=Math.min(8,tokenMatches.reduce((sum,token)=>sum+specificity.get(token),0)*2);
    if(intent.two&&!intent.physical){
      if(feature.speaker.names.length===2){score+=19;evidence++;reasons.push(`원문 화자 2명: ${feature.speaker.names.join(' · ')}`);}
      else if(feature.speaker.names.length>2)score-=35;
      else score-=8;
    }
    if(intent.debate){
      if(feature.debate){score+=24;evidence++;if(feature.speaker.names.length===2&&intent.two)score+=17;}
      else if(feature.dialogue){score+=7;evidence++;}
      else score-=12;
      if(feature.puzzle)score-=25;
    }
    if(intent.physical){
      if(feature.physical){score+=38;evidence++;terms.push(...physicalAliases.filter(word=>feature.all.includes(word)));}
      else score-=34;
      if(feature.debate&&!feature.physical)score-=25;
    }
    if(intent.excludePhysical&&feature.physical)score-=50;
    if(intent.excludeDebate&&feature.debate)score-=45;
    for(const form of intent.forms){
      const actual=form.key==='independent'?feature.form.choice==='statements':form.key==='combination'?['combination','ordering'].includes(feature.form.choice):form.key==='completion'?feature.form.completion:feature.calculation;
      const known=!['independent','combination'].includes(form.key)||!['unknown','image'].includes(feature.form.choice);
      if(form.negative&&!form.positive){if(actual)score-=100;else if(known){score+=10;evidence++;}continue;}
      if(actual){score+=35;evidence++;reasons.push(`${form.key==='calculation'?'풀이':'형식'}: ${form.label}`);}
      else if(known)score-=22;
    }
    const formatEvidence=[];
    if(intent.format.fiveChoice&&feature.choiceCount===5){score+=32;evidence++;formatEvidence.push('5지선다');}
    if(intent.format.rItem&&feature.hasRItem){score+=32;evidence++;formatEvidence.push('ㄹ 항목 포함');}
    if(formatEvidence.length)reasons.push(`문항 형식: ${formatEvidence.join(' · ')}`);
    const visualEvidence=[];
    if(intent.visual.blank&&feature.visual.blankSlot){score+=34;evidence++;visualEvidence.push(feature.visual.blankKind||'빈칸 형식');terms.push('빈칸');}
    if(intent.visual.table&&feature.visual.table){score+=18;evidence++;visualEvidence.push('표·도표');terms.push('표');}
    if(intent.visual.diagram&&feature.visual.diagram){score+=18;evidence++;visualEvidence.push('그림·도식');terms.push('그림');}
    if(intent.visual.container&&feature.visual.container){score+=20;evidence++;visualEvidence.push('상자·용기');terms.push('상자');}
    if(intent.visual.arrangement&&feature.visual.arrangement){score+=16;evidence++;visualEvidence.push('배열·배치');terms.push('배치');}
    if(visualEvidence.length)reasons.push(`원문 단서: ${[...new Set(visualEvidence)].join(' · ')}`);
    const raw=Number(semanticScores.get(q.id));
    const strongSemantic=semanticConfident&&semanticCandidates.has(q.id)&&Number.isFinite(raw)&&raw>=maximum-.055;
    if(Number.isFinite(raw)&&semanticUseful)score=Math.max(-30,Math.min(20,score*.35))+Math.max(0,(raw-.72)*420)+Math.min(18,classificationScore);
    // Weak generic structural signals alone must not turn an unrelated description into all records.
    const topicOrWord=intent.topic.some(concept=>concept.positive)||intent.forms.length>0||visualEvidence.length>0||formatEvidence.length>0||intent.tokens.some(token=>feature.all.includes(token));
    const structureOnly=intent.tokens.length===0&&(intent.two||intent.debate||intent.physical||intent.forms.length>0||intent.visualIntent||intent.formatIntent);
    if(intent.tokens.length>=3&&!intent.topic.some(concept=>concept.positive)&&!intent.forms.length&&!intent.visualIntent&&!intent.formatIntent&&!intent.two&&!intent.debate&&!intent.physical&&tokenMatches.length<2&&!strongSemantic)continue;
    if((evidence===0&&!strongSemantic)||(!topicOrWord&&!structureOnly&&!strongSemantic)||score<=0)continue;
    if(reasons.length===0||tokenMatches.length)reasons.push(`제목: ${feature.title||q.id}`);
    if(feature.speaker.names.length===2&&intent.debate&&!intent.two&&feature.debate)reasons.push(`원문 화자: ${feature.speaker.names.join(' · ')}`);
    const passage=semanticUseful?semanticScores.evidence?.get(q.id):null;
    const lexicalSection=!passage?feature.sections.map(section=>({section,count:terms.reduce((sum,term)=>sum+(normalized(section.text).includes(normalized(term))?1:0),0)})).filter(item=>item.count>0).sort((a,b)=>b.count-a.count)[0]?.section:null;
    const evidenceSection=passage||lexicalSection;
    results.push({id:q.id,score:Math.round(score*100)/100,reasons:[...new Set(reasons)].slice(0,3),snippet:evidenceSection?snippetFor({...feature,source:evidenceSection.text},terms):snippetFor(feature,terms),...(evidenceSection?{evidenceLabel:evidenceSection.label,evidenceKind:evidenceSection.kind,evidenceSupport:evidenceSection.support}:{}),evidenceText:evidenceSection?.text});
  }
  return results.sort((a,b)=>b.score-a.score||String(a.id).localeCompare(String(b.id),'ko'));
}

const conditionCompact=value=>normalizeSearchText(value).replace(/[\s·ㆍ,–−-]/g,'');
function conditionSupport(q,feature,clause){
  const exactLabel=terms=>feature.labels.find(label=>terms.some(term=>conditionCompact(label)===conditionCompact(term)));
  const sectionWith=terms=>feature.sections.find(section=>terms.some(term=>conditionCompact(section.text).includes(conditionCompact(term))));
  let actual=false,section=null,text='',label='문항 분류',kind='metadata';
  if(clause.kind==='tag'){
    text=exactLabel(clause.terms)||'';actual=Boolean(text);
    if(!actual&&clause.key==='probability'){section=sectionWith(['조건부 확률','조건부확률']);actual=Boolean(section);}
  }else if(clause.kind==='literal'){
    // Quotes preserve word order; only spacing and compatibility typography are normalized.
    section=feature.sections.find(s=>clause.terms.some(term=>compact(s.text).includes(compact(term))));actual=Boolean(section);
  }else if(clause.kind==='id'){actual=String(q.id).toLowerCase()===clause.value;text=`내부 ID: ${q.id}`;}
  else if(clause.kind==='year'){actual=Number(q.year)===clause.value;text=`${q.year}학년도`;}
  else if(clause.kind==='yearRange'){actual=Number(q.year)>=clause.from&&Number(q.year)<=clause.to;text=`${q.year}학년도`;}
  else if(clause.kind==='number'){actual=Number(q.questionNumber??q.number)===clause.value;text=`실제 문항번호: ${q.questionNumber??q.number??'미상'}`;}
  else if(clause.kind==='exam'){actual=clause.value==='예비시험'?q.examKey==='preliminary'||/예비시험/.test(q.examLabel||''):/본시험/.test(q.examLabel||'')||/^20\d{2}$/.test(q.examKey||'');text=q.examLabel||String(q.examKey||'');}
  else{
    const k=clause.key;
    const featureValues={calculation:feature.calculation,independent:feature.form.choice==='statements',combination:['combination','ordering'].includes(feature.form.choice),completion:feature.visual.blankSlot,table:feature.visual.table,diagram:feature.visual.diagram,arrangement:feature.visual.arrangement,container:feature.visual.container,fiveChoice:feature.choiceCount===5,rItem:feature.hasRItem,physical:feature.physical,two:feature.speaker.names.length===2};
    actual=Boolean(featureValues[k]);
    if(k==='two')text=`원문 화자 ${feature.speaker.names.length}명: ${feature.speaker.names.join(' · ')||'확인되지 않음'}`;
    else if(k==='fiveChoice')text=`선택지 ${feature.choiceCount}개`;
    else if(k==='independent'||k==='combination')text=feature.form.choice==='statements'?'완결된 진술로 이루어진 독립 선택지 5개':['combination','ordering'].includes(feature.form.choice)?'보기 기호를 조합하거나 순서대로 배열한 선택지 5개':`현재 텍스트에서 독립·조합 형식을 확인할 수 없음`;
    else if(k==='completion')text=feature.visual.blankKind;
    if(actual&&!text){
      const evidencePatterns={calculation:/수식\s*계산|계산(?:한다|해|하여)|산출(?:한다|해|하여)/,table:/(?:도표|시간표|조건표|점수표|(?:^|[\s<(])표\s*(?:에서|에|로|의|를|가|는|와|과))/,diagram:/그림|그래프|도식|순서도|흐름도|배치도|관계도/,arrangement:/일렬|배열|배치|배정|위치관계/,container:/상자|박스/,rItem:/ㄹ[.．)〉:]/,physical:/몸싸움|주먹|폭행|구타|멱살|때렸|때려|때리/};
      section=k==='calculation'&&feature.calculationEvidence?feature.calculationEvidence:feature.sections.find(s=>evidencePatterns[k]?.test(s.text));text=clause.label;
    }
    label='출제 형식과 풀이';kind='features';
  }
  if(section){({label,kind}=section);text=section.text;}
  const satisfied=clause.negated?!actual:actual;
  if(clause.negated&&!actual){
    text=`${clause.label}: 현재 분류·추출 텍스트에서 해당 근거 없음${clause.kind==='feature'?' (이미지의 미추출 정보는 미확인)':''}${text?`; ${text}`:''}`;
  }
  return {conditionId:clause.id,condition:clause.label,negated:clause.negated,satisfied,matched:actual,label,kind,text:text||`${clause.label}: 근거 없음`,...(section?.support?{support:section.support}:{})};
}

function eligibleForIntent(q,intent){
 const feature=featuresOf(q),byId=new Map(intent.clauses.map(clause=>[clause.id,conditionSupport(q,feature,clause)]));
 const evaluate=node=>!node?true:node.op==='clause'?byId.get(node.id).satisfied:node.op==='or'?node.children.some(evaluate):node.children.every(evaluate);
 const eligible=evaluate(intent.expression);
 // OR evidence contains only satisfied alternatives; an unused branch is never
 // misrepresented as a satisfied requirement.
 return {eligible,evidence:[...byId.values()].filter(e=>e.satisfied)};
}

function residualEvidence(feature,intent,specificity){
 const tokens=[...specificity.keys()];
 const commonEvidence=/(?:두|둘|양쪽|양자|모두|공통)/.test(intent.unparsed)&&/(?:동의|예측|들어맞|양립|지지|설명)/.test(intent.unparsed)&&/(?:증거|관찰|정보|사실)/.test(intent.unparsed);
 let best={score:0,section:null};
 for(const section of feature.sections){
   const text=compact(section.text);
   let score=tokens.reduce((sum,token)=>sum+(text.includes(compact(token))?specificity.get(token):0),0);
   if(section.kind==='metadata')score*=.25;
   else if(section.kind==='features')score*=.5;
   else if(commonEvidence){
     // A small compositional paraphrase aid supplements full-text retrieval.
     // It is a ranking signal only; actual quoted evidence remains attached.
     for(let start=0;start<text.length;start+=100){
       const window=text.slice(start,start+200);
       if(/모두|양쪽|양자|공통|둘다|두가설|두견해|두주장/.test(window)&&/동의|예측|양립|설명/.test(window)&&/증거|관찰|사실|정보|판별/.test(window)){
         score+=35+(/모두(?:가)?(?:예측|설명|양립)|양쪽.{0,12}(?:예측|설명|양립)/.test(window)?15:0);break;
       }
     }
   }
   if(score>best.score)best={score,section};
 }
 return best;
}

export function rankReferences(questions,query,{semanticScores=new Map()}={}){
 const intent=compileSearchIntent(query),description=describeSearchIntent(intent);
 const finish=(matches,status)=>{
   const message=status==='contradiction'?`서로 충돌하는 검색 조건: ${intent.contradictions.join(', ')}`:status==='no-match'?'모든 필수·제외 조건을 만족하는 관련 문항이 없습니다. 조건은 자동으로 완화하지 않았습니다.':status==='empty'?'검색어를 입력하세요.':`${matches.length}개 문항`;
   // Non-enumerable array metadata preserves existing map/JSON/deep-equality callers.
   Object.defineProperties(matches,{intent:{value:intent},status:{value:status},message:{value:message},description:{value:description}});return matches;
 };
 if(!intent.raw||!/[가-힣a-z\d]/i.test(intent.raw))return finish([],'empty');
 if(intent.contradictions.length)return finish([],'contradiction');
 const constraints=new Map(),eligible=questions.filter(q=>{const result=eligibleForIntent(q,intent);constraints.set(q.id,result.evidence);return result.eligible;});
 if(!eligible.length)return finish([],'no-match');
 const matches=rankByRelevance(eligible,query,{semanticScores});
 if(intent.clauses.length){
   const seen=new Set(matches.map(match=>match.id));
   for(const q of eligible)if(!seen.has(q.id)){
     const feature=featuresOf(q),evidence=constraints.get(q.id);
     const terms=intent.required.flatMap(c=>c.terms||[c.label]);
     const section=feature.sections.map(s=>({section:s,count:queryTokens(intent.unparsed).reduce((sum,token)=>sum+Number(compact(s.text).includes(compact(token))),0)})).sort((a,b)=>b.count-a.count)[0]?.section;
     const raw=Number(semanticScores.get(q.id));
     // Eligibility evidence admits a constrained record even if the old lexical
     // scorer cannot spell the normalized tag. Prose and embeddings still order it.
     const lexical=queryTokens(intent.unparsed).reduce((sum,token)=>sum+(compact(feature.all).includes(compact(token))?6:0),0);
     matches.push({id:q.id,score:10+lexical+(Number.isFinite(raw)?Math.max(0,raw-.72)*100:0),reasons:evidence.map(e=>`${e.negated?'제외 확인':'조건'}: ${e.condition}`).slice(0,3),snippet:snippetFor({...feature,source:section?.text||feature.source},terms),evidenceLabel:section?.label,evidenceKind:section?.kind,evidenceText:section?.text,...(section?.support?{evidenceSupport:section.support}:{})});
   }
 }
 const proseTokens=intent.clauses.length?[...new Set(queryTokens(intent.unparsed).map(token=>token.replace(/(?:하는|되는|있는|한다|된다|하며|하고|이고|이다)$/,'').replace(/하$/,'')).filter(token=>token.length>=2))]:[];
 const specificity=new Map(proseTokens.map(token=>{
   const frequency=eligible.reduce((count,q)=>count+Number(compact(featuresOf(q).all).includes(compact(token))),0);
   return [token,Math.min(12,3*Math.log(1+(eligible.length+1)/(frequency+1)))];
 }));
 const byId=new Map(eligible.map(q=>[q.id,q]));
 for(const match of matches){
   if(intent.clauses.length&&proseTokens.length){
     const feature=featuresOf(byId.get(match.id)),residual=residualEvidence(feature,intent,specificity);
     match.score=Math.round((match.score+residual.score)*100)/100;
     if(residual.section&&residual.score>0&&!semanticScores.evidence?.get(match.id)){
       const section=residual.section;match.snippet=snippetFor({...feature,source:section.text},proseTokens);match.evidenceLabel=section.label;match.evidenceKind=section.kind;match.evidenceText=section.text;
       if(section.support)match.evidenceSupport=section.support;else delete match.evidenceSupport;
     }
   }
   match.conditionEvidence=constraints.get(match.id)||[];
   // Source-backed hard conditions are visible even when semantic evidence wins.
   match.reasons=[...new Set([...match.conditionEvidence.map(e=>`${e.negated?'제외 확인':'조건'}: ${e.condition}${e.condition==='원문 화자 2명'?` (${e.text})`:''}`),...match.reasons])].slice(0,5);
 }
 matches.sort((a,b)=>b.score-a.score||String(a.id).localeCompare(String(b.id),'ko'));
 return finish(matches,matches.length?'ok':'no-match');
}
