// Recommendation signals are derived from the supplied records, never question IDs.
const clean=value=>String(value??'').normalize('NFKC').replace(/\s+/g,' ').trim();
const normalized=value=>clean(value).toLocaleLowerCase('ko');
const compact=value=>normalized(value).replace(/\s/g,'');
const sourceFields=q=>[q.text,q.sourceText,q.sourceStem,q.rawText,q.sourceOptions].filter(value=>typeof value==='string'&&value.trim()).filter((value,index,all)=>all.indexOf(value)===index);
const sourceOf=q=>String(q.text||q.sourceText||q.sourceStem||q.rawText||'');
const labelsOf=q=>[...(q.domains||[]),...(q.fields||[]),...(q.subjects||[]),...(q.types||[]),...(q.logic||[])];
const values=object=>Object.values(object||{}).filter(value=>typeof value==='string');
const recordText=value=>Array.isArray(value)?value.map(recordText).join(' '):value&&typeof value==='object'?Object.values(value).map(recordText).join(' '):typeof value==='string'?value:'';
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
const negativeAfter=/^(?:은|는|을|를|이|가|의|도|이야기|문항|문제|소재|에관한|에대한|이)?(?:아닌|아니라|말고|제외|빼고|없이|없는|없고|않는|아니고)/;

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
  const source=sourceOf(q),sources=sourceFields(q),searchSource=sources.join(' '),labels=labelsOf(q),speaker=speakersOf(source);
  const title=clean(q.title);
  const analysis=clean([q.summary,q.steps,q.statements,q.options,q.pitfalls,q.reviewNotes,q.classificationReasons,q.fieldReasons,q.tagReasons,q.answerBasis,q.answerIssue,q.answerWarning,q.derivedConclusion].map(recordText).join(' '));
  const labelText=normalized(labels.join(' ')),metadata=normalized([q.id,q.examLabel,q.examKey,q.year,q.year?`${q.year}학년도`:'',title,labelText,analysis].join(' '));
  const text=normalized(`${searchSource} ${analysis}`),all=metadata+' '+text;
  const visualText=normalized(`${searchSource} ${analysis} ${labels.join(' ')}`),compactVisual=compact(visualText);
  const blankMention=/(?:빈(?:칸|상자|박스|네모)|공란)/.test(compactVisual);
  const fillMarker=/(?:㉠|㉡|㉢|㉣|㉤|ⓐ|ⓑ|ⓒ|ⓓ|ⓔ|□|▢).{0,18}(?:에)?(?:들어갈|채울|채우는|기입할|작성할|넣을)|(?:들어갈|채울|채우는|기입할|작성할|넣을).{0,18}(?:㉠|㉡|㉢|㉣|㉤|ⓐ|ⓑ|ⓒ|ⓓ|ⓔ|□|▢)/.test(compactVisual);
  const answerMarker=/(?:㉠|㉡|㉢|㉣|㉤|ⓐ|ⓑ|ⓒ|ⓓ|ⓔ|□|▢|\[[A-Z가-힣ㄱ-ㅎ]\])/i.test(visualText);
  const answerSlot=answerMarker&&/(?:들어갈|채울|채우는|기입할|작성할|넣을|빈칸|빈\s*칸)/.test(visualText);
  const visual={
    blankSlot:blankMention||fillMarker||answerSlot,
    blankKind:blankMention?'빈칸·빈 상자 표기':fillMarker||answerSlot?'답안이 들어갈 자리':'',
    table:/(?:도표|기계표|점수표|시간표|조건표|주기율표|(?:^|[\s<(])표\s*(?:에서|에|로|의|를|가|는|와|과|로부터|에따라|에따른))/.test(visualText),
    diagram:/(?:그림|그래프|도식|순서도|흐름도|배치도|관계도)/.test(visualText),
    container:/(?:상자|박스)/.test(visualText),
    arrangement:/(?:일렬|배열|배치|배정|자리배정|위치관계)/.test(visualText)
  };
  const choiceCount=Math.max(...[q.options,q.sourceOptions].map(options=>Array.isArray(options)?options.length:0));
  const hasRItem=/(?:^|[\s<])ㄹ(?=[.．)〉:])/m.test(visualText);
  const puzzle=(q.types||[]).some(type=>/퍼즐|거짓말 찾기/.test(type));
  // A fictional character inside a speech is not a participant in the discourse.
  const explicitDebate=/논쟁|논박|반박/.test(title+' '+source.slice(0,150));
  const dialogue=speaker.turns>=3&&!puzzle;
  const debate=!puzzle&&speaker.names.length>=2&&(explicitDebate||dialogue&&/반례|하지만|그렇지만|그런데|아니|왜|근거|반대|모순/.test(source));
  // A philosophical example of violence alone is not evidence of bodily conflict.
  const physicalTitle=/몸싸움|폭행|상해|주먹|구타|멱살|정당방위/.test(title);
  const physical=physicalTitle||!debate&&/때렸|때려|때리|폭행(?:하|을|한|당|으로)|구타|멱살|주먹|몸싸움/.test(source)&&/형사|형법|상해|정당방위/.test(metadata+' '+text);
  const feature={source,searchSource,title,labels,labelText,analysis,metadata,text,all,speaker,puzzle,debate,dialogue,physical,visual,choiceCount,hasRItem};
  featureCache.set(q,feature);
  return feature;
}

const stopWords=new Set(['문항','문제','있는','있다','있고','있어','있으며','있는지','있는가','소재','소재의','사람','사람의','사람이','사람은','사람들','사람들이','서로','두','둘','명이','명','개의','개','것','거','게','수','좀','같은','가지고','관한','대한','에서','하는','되는지','있는','하고','찾아','찾기','추천','내용','이야기','모두','실제로','실제','논쟁','논박','반박','싸우는','대화','말고','제외','없는','않는','아닌','학년도','아무','관련','어떤','누군가','있나','있을까']);
function queryTokens(query){
  const stem=word=>{const stripped=word.replace(/(?:으로부터|에서의|으로|에게|에서|이랑|랑|하고|와|과|의|은|는|을|를|이|가|도)$/u,'');return stripped.length>=2?stripped:word;};
  return [...new Set(normalized(query).split(/[^\p{L}\p{N}]+/u).map(stem).filter(word=>word.length>=2&&!stopWords.has(word)&&!/^\d+$/.test(word)&&!/^(?:(?:2|두|둘)?(?:명|사람|화자)|둘)(?:이|의|가|은|는)?$/.test(word)&&!/^(?:논박|반박|논쟁|대화|싸우|다투|따지)(?:하|하는|하는지|고)?$/.test(word)))];
}

function interpret(query){
  const raw=String(query||'').normalize('NFKC').trim(),joined=compact(raw);
  const requestedId=raw.toLowerCase().match(/(?:^|[\s#])((?:p\d{3}|\d{4}))(?=$|[\s번.,])/i)?.[1];
  const physical=mentions(raw,physicalAliases),debate=mentions(raw,debateAliases);
  const two=/(?:2|두|둘)(?:명|사람|화자|인\b)|둘이/.test(joined);
  const topic=concepts.map(concept=>({...concept,...mentions(raw,concept.query)})).filter(concept=>concept.positive||concept.negative);
  const negativeWords=topic.filter(concept=>concept.negative&&!concept.positive).flatMap(concept=>concept.query);
  const visual={
    blank:/(?:빈(?:칸|상자|박스|네모)|공란|(?:박스|상자|칸|네모)(?:안에|에|속에)?(?:들어갈|채우|비어|빈)|(?:㉠|㉡|㉢|ⓐ|ⓑ|ⓒ|ⓓ)(?:에|을|과|와)?(?:들어갈|채울|채우는))/.test(joined),
    table:/(?:도표|행렬|기계표|점수표|시간표|조건표|표(?:있는|에서|에|로|의|를|가|는|문제|문항|로부터))/.test(joined),
    diagram:/(?:그림|그래프|도식|순서도|흐름도|배치도|관계도|지도)/.test(joined),
    container:false,
    arrangement:/(?:배열|배치|일렬|자리배정|순서배정|위치관계)/.test(joined)
  };
  visual.container=!visual.blank&&/(?:상자|박스)/.test(joined);
  const format={
    fiveChoice:/(?:5지선다|오지선다|다섯지선다|5개선택지|5개선지|선택지5개|선지5개|다섯개의선택지)/.test(joined),
    rItem:/(?:ㄱ[,·.]*ㄴ[,·.]*ㄷ[,·.]*ㄹ|ㄹ(?:선지|항목|까지|보기))/.test(joined)
  };
  const formatIntent=Object.values(format).some(Boolean);
  const visualIntent=Object.values(visual).some(Boolean);
  return {raw,requestedId,two,physical:physical.positive,excludePhysical:physical.negative,debate:debate.positive&&!physical.positive,excludeDebate:debate.negative,topic,visual,format,formatIntent,visualIntent,tokens:queryTokens(raw).filter(token=>!negativeWords.some(word=>token.includes(word))&&!(visual.blank&&/^(?:빈|칸|박스|상자|네모|공란|채우기|채우|채울|들어갈)$/.test(token)))};
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

export function rankReferences(questions,query,{semanticScores=new Map()}={}){
  const intent=interpret(query);
  if(!intent.raw||!/[가-힣a-z\d]/i.test(intent.raw))return [];
  if(intent.requestedId)return questions.filter(q=>String(q.id).toLowerCase()===intent.requestedId).map(q=>({id:q.id,score:10000,reasons:[`문항번호: ${q.id}`],snippet:snippetFor(featuresOf(q),[])}));
  const rawScores=questions.map(q=>Number(semanticScores.get(q.id))).filter(Number.isFinite).sort((a,b)=>a-b);
  const maximum=rawScores.at(-1)||0,median=rawScores.length?rawScores[Math.floor(rawScores.length/2)]:0;
  // E5 cosines have a high baseline; relative separation matters as well as the raw score.
  const semanticUseful=maximum>=.77&&(rawScores.length<=2||maximum-median>=.025);
  // A weak model association can reorder evidenced matches, but cannot create a match.
  const semanticConfident=maximum>=.85&&(rawScores.length<=2||maximum-median>=.04);
  const semanticCandidates=new Set(semanticConfident?questions.map(q=>[q.id,Number(semanticScores.get(q.id))]).filter(([,raw])=>Number.isFinite(raw)).sort((a,b)=>b[1]-a[1]).slice(0,20).map(([id])=>id):[]);
  const results=[];
  for(const q of questions){
    const feature=featuresOf(q),reasons=[],terms=[];let score=0,evidence=0;
    for(const concept of intent.topic){
      const hay=concept.classification?feature.labelText:feature.all;
      const found=concept.evidence.find(word=>hay.includes(normalized(word)));
      if(!found)continue;
      if(concept.negative&&!concept.positive){score-=45;continue;}
      score+=concept.weight*(concept.key==='logic'&&found!=='논리학'?.5:1);evidence++;
      terms.push(found);
      if(concept.classification)reasons.push(`분류: ${feature.labels.filter(label=>concept.evidence.some(word=>normalized(label).includes(normalized(word)))).join(' · ')}`);
    }
    const tokenMatches=[];
    for(const token of intent.tokens){
      if(!feature.all.includes(token))continue;
      // Classification has already contributed its bounded topic score.
      if(intent.topic.some(concept=>concept.query.includes(token)))continue;
      const weight=feature.title.includes(token)?15:feature.metadata.includes(token)?9:6;
      score+=weight;evidence++;tokenMatches.push(token);terms.push(token);
    }
    if(tokenMatches.length>=2)score+=Math.min(18,tokenMatches.length*3);
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
    const visualEvidence=[];
    const formatEvidence=[];
    if(intent.format.fiveChoice&&feature.choiceCount===5){score+=32;evidence++;formatEvidence.push('5지선다');}
    if(intent.format.rItem&&feature.hasRItem){score+=32;evidence++;formatEvidence.push('ㄹ 항목 포함');}
    if(formatEvidence.length)reasons.push(`문항 형식: ${formatEvidence.join(' · ')}`);
    if(intent.visual.blank&&feature.visual.blankSlot){score+=34;evidence++;visualEvidence.push(feature.visual.blankKind||'빈칸 형식');terms.push('빈칸');}
    if(intent.visual.table&&feature.visual.table){score+=18;evidence++;visualEvidence.push('표·도표');terms.push('표');}
    if(intent.visual.diagram&&feature.visual.diagram){score+=18;evidence++;visualEvidence.push('그림·도식');terms.push('그림');}
    if(intent.visual.container&&feature.visual.container){score+=20;evidence++;visualEvidence.push('상자·용기');terms.push('상자');}
    if(intent.visual.arrangement&&feature.visual.arrangement){score+=16;evidence++;visualEvidence.push('배열·배치');terms.push('배치');}
    if(visualEvidence.length)reasons.push(`문항 형식: ${[...new Set(visualEvidence)].join(' · ')}`);
    const raw=Number(semanticScores.get(q.id));
    const strongSemantic=semanticConfident&&semanticCandidates.has(q.id)&&Number.isFinite(raw)&&raw>=maximum-.03;
    if(Number.isFinite(raw)&&semanticUseful)score+=Math.max(0,(raw-.68)*220);
    // Weak generic structural signals alone must not turn an unrelated description into all records.
    const topicOrWord=intent.topic.some(concept=>concept.positive)||intent.tokens.some(token=>feature.all.includes(token))||visualEvidence.length>0||formatEvidence.length>0;
    const structureOnly=intent.tokens.length===0&&(intent.two||intent.debate||intent.physical||intent.visualIntent||intent.formatIntent);
    if(intent.tokens.length>=3&&!intent.topic.some(concept=>concept.positive)&&!intent.two&&!intent.debate&&!intent.physical&&tokenMatches.length<2&&!strongSemantic)continue;
    if((evidence===0&&!strongSemantic)||(!topicOrWord&&!structureOnly&&!strongSemantic)||score<=0)continue;
    if(reasons.length===0||tokenMatches.length)reasons.push(`제목: ${feature.title||q.id}`);
    if(feature.speaker.names.length===2&&intent.debate&&!intent.two&&feature.debate)reasons.push(`원문 화자: ${feature.speaker.names.join(' · ')}`);
    results.push({id:q.id,score:Math.round(score*100)/100,reasons:[...new Set(reasons)].slice(0,3),snippet:snippetFor(feature,terms)});
  }
  return results.sort((a,b)=>b.score-a.score||String(a.id).localeCompare(String(b.id),'ko'));
}

function chunks(text,size=500,stride=400){
  const result=[];
  for(let start=0;start<text.length;start+=stride){result.push(text.slice(start,start+size));if(start+size>=text.length)break;}
  return result;
}

export function buildSearchDocuments(questions){
  return questions.flatMap(q=>{
    const feature=featuresOf(q),prefix=clean([feature.title,...(q.fields||[])].join(' · ')).slice(0,110);
    const structure=feature.speaker.names.length?`원문 화자 ${feature.speaker.names.length}명: ${feature.speaker.names.join(', ')}.${feature.debate?' 논박·문답.':''}`:'';
    const metadata=clean([feature.title,...feature.labels,structure].join(' · '));
    const analysis=clean([q.summary,...(q.steps||[])].join(' '));
    const documents=[...chunks(metadata),...chunks(analysis).map(text=>`${prefix}\n해설: ${text}`),...chunks(clean(feature.searchSource)).map(text=>`${prefix}\n원문: ${text}`)];
    return [...new Set(documents.filter(Boolean))].map(text=>({id:q.id,text}));
  });
}
