"""Merge reviewed analyses stored in data/analyses with preserved PDF extraction.
Original extraction is never overwritten. Run from any working directory.
"""
from pathlib import Path
import json,sys,hashlib,collections
ROOT=Path(__file__).resolve().parents[1]
ANALYSIS=ROOT/'data/analyses'
read=lambda p:json.loads(Path(p).read_text())
raw=read(ROOT/'data/extracted-2027.json')
research=read(ROOT/'data/logic-research.json')
files=[ANALYSIS/n for n in ['01-10.json','11-20.json','21-30.json','31-40.json']]
analyses={str(q['id']):q for p in files for q in read(p)}
# Labels are consolidated by actual operation; the original detailed labels remain in the data.
aliases={}
def group(target,labels):
 for name in labels.split('|'):aliases[name]=target
for target,labels in {
'조건문 연결':'조건문 연쇄|조건 강화 관계',
'대우':'후건 부정',
'필요·충분 구별':'필요조건과 충분조건|필요조건 점검|필요조건 구별|동의 무효 요건',
'모순·양립가능성':'진술의 양립 가능성',
'선언·소거':'선언지 제거',
'반례 구성':'반례|반증|반례 검토|반례 평가|조건문의 반례',
'집합·포함관계':'집합 포함관계|정의의 포함관계|조건 순서의 교환',
'개념·기준 적용':'정의의 적용 범위|구제 요건|조건 충족 여부|정의의 충족 여부|성립 요건 대조|단계별 조건 필터링|비교 기준 분리|사건 전후 비교|평가기준 비교|성분별 비교|대안 부담 비교|명제 포함 관계',
'원칙·예외 적용':'원칙·예외|적용 제외|원인 한정',
'경우 분류':'국가별 권한 대조|관할별 규칙 구분|제재 요건 구분|열거된 처분 확인|요건의 중첩',
'논증구조':'근거별 대응|결론과 근거 구분|중간결론 연결|전제와 결론 구별',
'숨은 전제':'공통 전제 도출|숨은 전제 점검',
'강화·약화':'부분 반박|제도 효과',
'전제·추론 비판':'반론의 표적 특정|조건부 반론',
'관련성·중립':'사례의 관련성',
'보편 원칙 적용':'원칙의 일반화',
'경쟁가설 판별':'경쟁 가설 비교|유사성에 따른 예측',
'인과·상관 구별':'상관관계 추론 한계',
'변수 통제':'변인 분리',
'개입·경로 추적':'매개변인 판별',
'차이 비교':'길이에 따른 효과 비교|차이의 크기 비교|재현 결과 해석',
'규범·가치 판단':'행위 이유 구분',
'표현·범위 해석':'시점 구분|사전·사후 통제|시간 표현의 범위|평가 시점 구분|판단 단계 구별|가설 부정의 범위|부정과 부재 구별|동일성과 경로 구별|개인과 집단 구분|내적 느낌과 표현 구분|의도와 해석의 일치|합의 여부 판단|태도·행동 구별|비례 대상 확인',
'수식 계산':'단계별 수수료 계산|상·하한 계산|가산·배율 적용 순서',
'방향·증감 추론':'균형 대비 방향 추론',
'최솟값·최댓값':'최솟값에 의한 거래량',
'대소·성분별 비교':'대소 비교|목적함수 비교|비지배 대안 판별|파레토 지배|동일 수량의 수입 비교',
'수단·목적 분석':'수단·목적 관계',
}.items():group(target,labels)
extra={
'방향·증감 추론':'균형점이나 기준 상태에서 한 변수의 증가·감소가 관련 양을 어느 방향으로 바꾸는지 추적한다.',
'수식 계산':'제시된 수식과 수치를 대입하고 연산 순서를 유지하여 값을 계산한다.',
'최솟값·최댓값':'가능한 값의 범위에서 상한·하한과 경계값을 비교한다.',
'대소·성분별 비교':'같은 기준 또는 각 성분을 고정하여 크기와 지배 관계를 비교한다.',
'기댓값 계산':'각 결과의 값에 그 확률을 곱하여 더하고 조건별 값을 비교한다.',
'비례·반비례':'다른 조건을 고정하고 두 양의 곱이나 비가 일정한 관계를 추적한다.',
'변화량 비교':'절대적인 크기와 변화량을 구별하고 두 상태 사이의 차이를 비교한다.',
'비둘기집 원리':'서로 다른 대상이 선택할 수 있는 칸보다 많으면 적어도 한 칸의 중복이 필연임을 이용한다.',
'반사실 조건 비교':'실제로 일어난 상태와 그 사건이 없었을 경우의 상태를 구별하여 비교한다.',
'수단·목적 분석':'어떤 제도나 행동이 주장된 목적을 달성하는지에 맞추어 근거의 관련성과 방향을 평가한다.',
'보편 원칙 적용':'일반적으로 제시된 원칙에 새로운 대상이나 역할을 대입해 같은 기준이 일관되게 적용되는지 판단한다. 관찰 표본에서 모집단으로 확대하는 귀납적 일반화와 구별한다.',
}
# Each discipline is a reusable parent subject; local topics preserve the original specificity.
fields={1:['법학','헌법','민사소송법'],2:['법학','법해석론'],3:['법학','민사법'],4:['철학','윤리학'],5:['법학','헌법'],6:['법학','국제법','인권법'],7:['법학','의료법'],8:['논리학','증거 추론'],9:['법학','헌법','민사소송법'],10:['법학','법해석론'],11:['법학','입법정책'],12:['법학','행정법'],13:['철학','윤리학'],14:['철학','언어철학'],15:['철학','윤리학'],16:['철학','행위철학','형사정책'],17:['철학','심리철학'],18:['철학','문학철학'],19:['철학','윤리학'],20:['철학','행위철학'],21:['철학','행위철학'],22:['철학','인식론'],23:['법학','철학','법철학'],24:['과학철학','증거 추론'],25:['경제학','게임이론'],26:['경제학','사회선택이론'],27:['심리학','인지심리학'],28:['경제학','미시경제학'],29:['심리학','사회심리학'],30:['심리학','인지심리학'],31:['수학','의사결정이론'],32:['논리학'],33:['논리학'],34:['논리학','명제논리'],35:['생물학','생화학'],36:['물리학','원자물리학'],37:['생물학','유전학'],38:['물리학','천체물리학'],39:['생물학','미생물학'],40:['물리학','역학']}
field_defs={
'법학':'법률의 의미·효력·해석·제도와 구체적 사례의 판단을 다룬다.', '헌법':'기본권 보장, 국가권한과 재판제도의 헌법적 기준을 다룬다.', '민사소송법':'민사사건의 심리·공개·당사자 절차와 분쟁 해결을 다룬다.', '법해석론':'동일한 법문에 대한 해석 기준의 차이와 적용 범위를 비교한다.', '민사법':'공증 등 사법 관계에 적용되는 규칙과 절차를 다룬다.', '국제법':'협약의 의무·적용 범위·국가별 수용과 국제적 구제를 다룬다.', '인권법':'인권침해의 방지와 권리구제 요건을 다룬다.', '의료법':'의료행위의 정의, 면허와 예외적 자격의 법적 범위를 다룬다.', '입법정책':'여러 입법대안의 공익·사익과 선택 기준을 비교한다.', '행정법':'행정기관의 규제권한과 제재 수단의 요건을 다룬다.', '철학':'개념·지식·행위·가치에 관한 이론과 논거를 비교한다.', '윤리학':'해악·동의·도덕성·책임과 규범의 정당화 기준을 다룬다.', '언어철학':'의도·해석·합의 등 발화의 의미와 규범적 효과를 다룬다.', '행위철학':'행동의 의도·믿음·동기와 합리적 판단의 관계를 다룬다.', '형사정책':'행위자의 판단능력과 처벌·감경의 정당화 기준을 비교한다.', '심리철학':'감정과 의식의 기준, 개인과 집단에 대한 귀속을 다룬다.', '문학철학':'허구 세계의 진리와 작품 내용·평가시점의 관계를 다룬다.', '인식론':'앎·지각·기억의 성립 조건과 동일성에 관한 논증을 다룬다.', '법철학':'법의 근거와 법관 판단·도덕 원리의 관계를 다룬다.', '과학철학':'가설 검증과 증거 활용의 신뢰성·독립성을 분석한다.', '증거 추론':'관찰과 진술이 어떤 주장을 배제하거나 뒷받침하는지 분석한다.', '경제학':'선택·정보·시장과 보수·효용의 관계를 분석한다.', '게임이론':'전략과 신호 선택을 통해 상대 유형에 관한 정보를 추론한다.', '사회선택이론':'개인의 선호와 효용으로부터 집단 대안의 우월성을 비교한다.', '미시경제학':'수요·공급과 가격규제가 거래량·수입에 미치는 영향을 분석한다.', '심리학':'인지와 행동에 대한 가설을 실험과 관찰로 평가한다.', '인지심리학':'기억·지식 적용·독서 이해 등 정보처리 과정을 분석한다.', '사회심리학':'상호작용 대상과 사회적 정서가 행동에 미치는 영향을 분석한다.', '수학':'수치·확률·함수 관계로 모형의 결과를 계산하고 비교한다.', '의사결정이론':'불확실한 결과와 기댓값 범위에 대한 선택 기준을 다룬다.', '논리학':'명제의 관계와 제약조건이 허용하는 모형을 분석한다.', '대응 퍼즐':'여러 대상·속성 간 일대일 대응을 조건에 따라 확정한다.', '순서 퍼즐':'순서 제약과 진술의 참거짓을 함께 만족하는 배열을 찾는다.', '명제논리':'조건문·선언·부정과 존재 진술을 결합하여 결론을 도출한다.', '생물학':'생명체의 대사·유전·생장에 관한 관계와 실험을 다룬다.', '생화학':'효소·물질대사와 유전형에 따른 생체반응을 분석한다.', '물리학':'원자 에너지 준위·빛의 파장·핵합성·운동량 등 물리적 관계와 수식을 분석한다.', '원자물리학':'원자 에너지 준위의 차이와 방출광의 진동수·파장을 다룬다.', '유전학':'유전자 발현과 형질 전달·후성유전 조절의 관계를 분석한다.', '천체물리학':'우주 초기 핵합성과 입자 수·질량비의 변화를 다룬다.', '미생물학':'세균 균주의 표현형·유전적 변이와 환경 적응을 분석한다.', '역학':'운동량·충격량·힘과 운동 변화의 수량 관계를 분석한다.'}
discipline_labels={label for labels in fields.values() for label in labels}
domain_defs={'법률':'법규·법제도·권리 또는 법적 판단을 중심 소재로 삼는 문항.','인문':'철학·언어·문학·윤리 등 인간의 의미와 규범을 다루는 문항.','사회':'시장·집단 선택·심리·사회적 행동 등 사회과학의 현상을 다루는 문항.','모형·논리':'배치·순서·조건명제 또는 명시된 수리모형이 추론의 중심인 문항.','과학':'자연 현상의 원리·수식·생물학적 과정과 실험을 다루는 문항.'}
type_defs={'규칙·사례 적용':'제시된 정의와 규칙의 요건을 구체적 사례에 대입한다.','관점 비교':'견해별 기준과 공통점·차이점을 고정하여 같은 사례를 비교한다.','논증 평가':'새 정보나 반례가 논거·추론·결론을 강화하거나 약화하는지 판단한다.','논증 구조':'전제·중간결론·최종결론의 연결과 반론의 표적을 분석한다.','내용 추론':'지문에서 주어진 개념과 사실이 함축하는 내용을 도출한다.','실험 분석':'실험 조건·대조·결과로부터 가설이나 인과관계의 지지 여부를 평가한다.','모형·수리 추론':'수치·기댓값·함수·선호 등 명시된 모형을 적용하여 결과를 계산·비교한다.','논리 퍼즐':'여러 제약을 동시에 만족하는 배치·순서·참거짓 모형을 구성한다.'}
logic_defs={t['label']:t for t in research['appTags']}
tax={};questions=[]
def add(axis,label,description,**kw):
 key=(axis,label)
 if key not in tax:
  tid=logic_defs.get(label,{}).get('id') if axis=='logic' else None
  tid=tid or axis+'-'+hashlib.sha1(label.encode()).hexdigest()[:10]
  tax[key]={'id':tid,'axis':axis,'label':label,'description':description,**kw}
 return tax[key]['id']
for source in raw:
 q={**source,**analyses[source['id']]};q['id']=source['id'];q['sourceMarkedAnswer']=q['answer']
 q['originalExtractedText']=source['text'];q['text']=source['text']
 for c in q['textCorrections']:
  if c['from'] not in q['text']:raise ValueError((q['id'],'correction not found',c))
  q['text']=q['text'].replace(c['from'],c['to'])
 q['answerStatus']=q.get('answerStatus','source-and-solution-agree')
 q['analysisLogicOriginal']=q['logic'][:]
 original_reasons=q['tagReasons'].copy();new_logic=[];reasons={}
 for tag in q['logic']:
  canon=aliases.get(tag,tag)
  if canon not in new_logic:new_logic.append(canon)
  if tag in original_reasons:reasons[canon]=reasons.get(canon,'')+(' ' if canon in reasons else '')+original_reasons[tag]
 q['logic']=new_logic
 q['disciplines']=fields[q['number']]
 q['subjects']=list(dict.fromkeys(q['disciplines']+q['subjects']))
 # Cognitive psychology is a social science regardless of experimental presentation.
 if q['number'] in [27,30]:q['domains']=['사회']
 if q['number']==19:q['domains']=['인문']
 if q['number']==23:q['domains']=['법률','인문']
 q['tagReasons']={**original_reasons,**reasons}
 for f in q['disciplines']:
  q['tagReasons'].setdefault(f,f'{q["title"]}: {field_defs[f]}')
 q['tags']=[add('year','2027학년도','2026년에 실시된 2027학년도 법학적성시험 추리논증 40문항.')]
 for axis,field in [('domain','domains'),('subject','subjects'),('type','types'),('logic','logic')]:
  for label in q[field]:
   if axis=='domain':desc=domain_defs[label]
   elif axis=='type':desc=type_defs[label]
   elif axis=='subject':desc=field_defs.get(label, q['tagReasons'].get(label,f'{q["title"]}에서 다루는 세부 소재: {label}.'))
   else:
    ld=logic_defs.get(label)
    desc=(ld['definition']+' '+ld['pitfall']) if ld else extra.get(label)
    if desc is None:raise ValueError(('unmapped logic definition',q['id'],label))
   kw={}
   if axis=='logic':kw={'classification':'자체 정의 태그'}
   if axis=='logic' and label in logic_defs:kw={'source':'https://sdss.kr/code/100.html','referenceCodes':logic_defs[label]['sourceCodes'],'classification':'자체 응용 태그'}
   if axis=='subject':kw={'level':'discipline' if label in discipline_labels else 'topic'}
   q['tags'].append(add(axis,label,desc,**kw))
 if q['id']=='2708':
  q['reviewNotes'].append('별도 독립 검토에서도 ㄱ 거짓·ㄴ 참·ㄷ 거짓으로 판단. 제공 PDF의 ③ 강조를 공식 정답으로 확정하지 않는다.')
 if q['id']=='2723':q['hasDiagram']=True
 q['textStatus']='원본 이미지 대조 추출본 · 수식·도식은 원본 확인'
 questions.append(q)
for t in tax.values():t['count']=sum(t['id'] in q['tags'] for q in questions)
obj={'schemaVersion':1,'exam':{'year':2027,'label':'2027학년도 추리논증','questionCount':40,'status':'사용자 검수용 초안','answerSource':'제공 PDF 회색 강조 표시와 독립 풀이 대조. 외부 공식 정답표 대조 미완료.','textStatus':'원본 문항 이미지 보존 · PDF 문자층 추출 및 이미지 대조','sourcePages':[337,356],'conflictQuestionIds':['2708'],'reviewNote':'2708은 문면상 ㄴ만 참이나 대응 선택지가 없어 검토가 필요합니다.'},'questions':questions,'taxonomy':list(tax.values()),'references':[{'title':'SDSS 100개의 코드','url':'https://sdss.kr/code/100.html','note':research['appTagsNotice']}],'classificationPolicy':{'content':'번호대가 아니라 실제 지문의 중심 소재에 따라 대범주를 판단한다. 복수 소재를 가진 문항은 복수 태그를 허용한다.','type':'묻는 작업을 소재와 별도로 분류한다.','logic':'해설에서 실제 사용하는 연산과 논증만 부여한다. 같은 연산의 세부 표현은 공통 태그로 통합한다.','psychology':'인지심리학과 사회심리학은 사회과학으로 분류한다. 실험형 여부는 별도 문항 유형 태그다.'}}
(ROOT/'data/2027.json').write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
(ROOT/'data/logic-research.json').write_text(json.dumps(research,ensure_ascii=False,indent=2)+'\n')
print('Built',len(questions),'questions;',len(tax),'tags')
