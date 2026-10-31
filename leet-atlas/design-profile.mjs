// Observable source features, not a psychometric scale or inference-depth estimate.
export const compactText=value=>String(value??'').normalize('NFKC').replace(/\s/g,'');
const chars=value=>[...String(value??'').replace(/\s/g,'')].length;
const hits=(text,re)=>[...text.matchAll(re)];
const excerpts=(text,re)=>hits(text,re).slice(0,6).map(m=>text.slice(Math.max(0,m.index-18),m.index+m[0].length+32).replace(/\s+/g,' ').trim());
export const PROCESSING_TYPES=['규칙·사례 적용','모형·수리 추론','논리 퍼즐'];
export const ARGUMENT_TYPES=['논증 평가','실험 분석'];

export function extractQuestionPrompt(stem) {
  const candidates=String(stem||'').match(/[^?？]*[?？]/g)||[];
  // The actual interrogative ends at ?, before any parenthetical assumptions.
  // Blank lines mark source paragraphs, not a fixed character window.
  const prompts=candidates.map(s=>s.split(/\n\s*\n/).at(-1).trim().replace(/^\d+\s*[.．]\s*/,'').split(/(?<=[.。!])\s+(?=[가-힣A-Z])/).at(-1));
  const instruction=s=>/^(?:다음|위\s|아래|이\s*(?:글|자료|실험|논쟁|설명))/.test(s)&&/(?:것[은을]?|고르면|무엇인가|누구인가)\s*[?？]$/.test(s);
  return prompts.find(instruction)||prompts.find(s=>/것[은을]?\s*[?？]$|고른\s*것/.test(s))||prompts.at(-1)||'';
}

export function buildDesignProfile(question={}) {
  const raw=String(question.sourceText||question.text||'');
  const stem=String(question.sourceStem||raw.split(/[①②③④⑤]/)[0]||'');
  const options=Array.isArray(question.sourceOptions)&&question.sourceOptions.length
    ?question.sourceOptions.map(o=>String(o.text||''))
    :raw.split(/[①②③④⑤]/).slice(1);
  const optionsKnown=options.length>0&&options.every(s=>s.trim());
  const optionChars=optionsKnown?options.reduce((n,s)=>n+chars(s),0):null;
  const prompt=extractQuestionPrompt(stem),normalizedPrompt=compactText(prompt);
  const negativePrompt=prompt?/(?:않는|않은|않을|수없는|수없을|아닌것|틀린것|거짓인것|성립하지)/.test(normalizedPrompt):null;
  const combination=optionsKnown&&options.every(s=>/^[ㄱㄴㄷㄹㅁ\s,，·ㆍ]+$/.test(s.trim()));
  const statements=hits(stem,/(?:^|\n)\s*([ㄱㄴㄷㄹㅁ])\s*[.．]\s*([\s\S]*?)(?=(?:\n\s*[ㄱㄴㄷㄹㅁ]\s*[.．])|$)/g).map(m=>({label:m[1],text:m[2].trim()}));
  const statementChars=statements.reduce((n,s)=>n+chars(s.text),0);
  const source=[stem,...options].join('\n'),types=question.types||[],logic=question.logic||[];
  const conditionPattern=/다만|단\s*[,，]|만약|경우|조건|적어도|많아야|오직|반드시|이상|이하|미만|초과|[◦○•]/g;
  const conditionCount=hits(source,conditionPattern).length;
  const numericCount=hits(source,/\d+(?:[.,]\d+)?\s*(?:%|명|개|원|배|년)?|[%=<>≤≥＋−×÷]/g).length;
  const quantitativeLabels=logic.filter(s=>/수식|계산|수량|비율|확률|대소|변화량/.test(s));
  const argumentLabels=types.filter(s=>ARGUMENT_TYPES.includes(s));
  const argumentPattern=/강화|약화|반박|반례|가설|증거|실험|비판|쟁점/g;
  const visualReferences=excerpts(source,/그림|그래프|도표|도식|다음\s*표|아래\s*표|<\s*표\s*>/g);
  const missingOptions=!optionsKnown;
  const visual=visualReferences.length>0||missingOptions;
  const qualifiers=hits(options.join('\n'),/반드시|모든|어떤|오직|항상|경우|아니|않|이상|이하|미만|초과/g).length;
  const processingTypes=types.filter(s=>PROCESSING_TYPES.includes(s));
  const task=/강화|약화/.test(prompt)?'강화·약화':/평가|비판|반박|쟁점/.test(prompt)?'논증 평가·쟁점':/규정|원칙|사례|적용/.test(prompt)?'규칙·사례 적용':/추론|알 수|따라/.test(prompt)?'추론·판정':'내용·조건 판단';
  const reviewRecommendations=['조건의 독립성·상호작용, 필수 추론 단계와 우회 풀이를 사람이 확인해야 합니다.'];
  if(visual)reviewRecommendations.push('원본 이미지에서 도표·수식과 선택지의 비교 작업을 확인해야 합니다.');
  if(!prompt)reviewRecommendations.push('물음표가 있는 실제 발문을 분리하지 못해 발문 극성을 미확인으로 두었습니다.');
  const profile={version:1,method:'automatic-source-observation',
    reading:{status:stem?'automatic':'unknown',chars:stem?chars(source):null,stemChars:stem?chars(stem):null,optionChars,coverage:optionsKnown?'stem-and-text-options':'stem-only; options unknown',evidence:['원문 발문·지문·보기 진술과 선택지의 공백 제외 유니코드 글자 수. 해설은 제외.']},
    conditions:{status:'automatic',markerCount:conditionCount,processingTypes,evidence:[...processingTypes.map(s=>`기존 유형: ${s}`),...excerpts(source,conditionPattern)],interactionCount:null,inferenceDepth:null},
    quantitative:{status:'automatic',numericSignals:numericCount,labels:quantitativeLabels,evidence:[...quantitativeLabels.map(s=>`기존 풀이 논리: ${s}`),...excerpts(source,/\d+(?:[.,]\d+)?\s*(?:%|명|개|원|배)|[%=<>≤≥＋−×÷]/g)],requiredOperations:null},
    argument:{status:'automatic',labels:argumentLabels,evidence:[...argumentLabels.map(s=>`기존 유형: ${s}`),...excerpts(source,argumentPattern)],discriminationDepth:null},
    visual:{status:'unmeasured',referenceDetected:visualReferences.length>0,possibleMissingOptions:missingOptions,evidence:visualReferences,workload:null},
    comparison:{status:optionsKnown?'automatic':'unknown',optionCount:options.length||null,optionChars,statementCount:statements.length,statementChars,statements,combination,qualifiers,workload:null},
    reviewRecommendations};
  return {profile,features:{readingChars:profile.reading.chars,conditionMarkers:conditionCount,optionChars,statementCount:statements.length,statementChars,negativePrompt,prompt,promptStatus:prompt?'automatic':'unknown',combination,qualifierChoices:qualifiers>0,numericChoices:optionsKnown?/\d|[%=<>≤≥＋−×÷]/.test(options.join('')):null,visualReference:visualReferences.length>0,optionsUnknown:missingOptions,processing:processingTypes.length>0,argument:argumentLabels.length>0,task}};
}
