"""Question-level review against the 2015 syllabus and EBS 2027 reference."""
from __future__ import annotations
import json,re
from pathlib import Path
from build_archive import ROOT, UNIT_KEYS

BOOK = {
 1:('여러 가지 순열',4,15),2:('중복조합과 이항정리',16,29),
 3:('확률의 뜻과 활용',30,43),4:('조건부확률',44,57),
 5:('이산확률변수의 확률분포',58,73),6:('연속확률변수의 확률분포',74,87),
 7:('통계적 추정',88,None),
}
TOPICS = {
 'r':('C',1,'원순열','회전으로 일치하는 배열을 같은 것으로 본다.'),
 'm':('C',1,'같은 것이 있는 순열','같은 종류의 원소를 구별하지 않고 배열한다.'),
 'p':('C',1,'순열과 위치 배치','배치 순서와 자리를 구분하여 경우를 센다.'),
 'u':('C',1,'중복순열·함수의 개수','정의역 원소별로 가능한 함숫값을 정하고 조건에 따라 경우를 나눈다.'),
 'k':('C',1,'조합과 곱의 법칙','순서와 무관한 선택을 세고, 나누어진 경우를 합하거나 곱한다.'),
 'h':('C',2,'중복조합','조건에 맞는 배분 또는 순서가 정해진 중복 선택의 수를 센다.'),
 'b':('C',2,'이항정리','지수의 합이 요구한 차수가 되도록 항을 골라 계수를 계산한다.'),
 'c':('P',3,'수학적 확률','표본공간을 정하고 사건을 만족하는 경우를 센다.'),
 'a':('P',3,'확률의 덧셈정리','합사건을 계산할 때 교집합의 중복을 처리한다.'),
 'w':('P',3,'여사건의 확률','사건과 여사건을 분리해 전체 확률에서 구한다.'),
 'd':('P',4,'조건부확률·확률의 곱셈정리','주어진 사건 안에서 표본공간을 좁혀 교집합의 확률과 비교한다.'),
 'i':('P',4,'사건의 독립과 종속','독립인 사건의 교집합 확률을 각각의 확률의 곱으로 다룬다.'),
 't':('P',4,'독립시행과 경우 분류','시행을 반복했을 때 사건이 성립하는 순서와 횟수를 나누어 센다.'),
 'x':('V',5,'이산확률변수의 확률분포','각 값에 대응하는 확률을 구하고 분포를 구성한다.'),
 'e':('V',5,'기댓값·분산·표준편차','확률변수의 값과 확률을 이용하여 기댓값이나 분산을 계산한다.'),
 'j':('V',5,'이항분포','독립적으로 반복되는 시행의 성공 횟수를 이항분포로 나타낸다.'),
 'f':('V',6,'확률밀도함수와 넓이','확률을 밀도함수의 그래프 아래 넓이로 해석한다.'),
 'n':('V',6,'정규분포와 표준화','평균과 표준편차로 표준화하여 정규분포의 대칭성과 표를 이용한다.'),
 'z':('V',6,'이항분포의 정규근사','충분히 큰 시행 횟수에 대해 이항분포의 평균·분산으로 정규근사한다.'),
 's':('V',7,'표본평균의 분포','표본평균의 기댓값과 분산이 모집단 및 표본의 크기와 어떻게 연결되는지 사용한다.'),
 'g':('V',7,'모평균의 추정과 신뢰구간','표본평균과 표준오차를 이용해 신뢰구간의 중심이나 폭을 구한다.'),
}

# In each row the eight groups correspond to questions 23–30; first letter is the primary concept.
SELECTIONS = {
 '2022-example':'je b aw n uk dc h tc',
 '2022-06':'b d cu h ct muk r wta',
 '2022-09':'je c b d sn uk ex h',
 '2022-11':'b je h awc gs uk f dt',
 '2023-06':'m c tw b u ap hu dc',
 '2023-09':'b da n acr ex ck tmh uk',
 '2023-11':'b u wc ac g f dt hu',
 '2024-06':'m aw ck b d uk km ck',
 '2024-09':'je m aw n cp d tj h',
 '2024-11':'m iw cp xje gs dt k n',
 '2025-06':'m aw b au r dt ck hu',
 '2025-09':'m ia wc sn ex du zjt h',
 '2025-11':'b dia gs wc se hu n tc',
 '2026-06':'m aw b cpw rk dt ac uk',
 '2026-09':'u aw ck gs xe h zjt ci',
 '2026-11':'u da ac gs xe dt zjte km',
 '2027-06':'m aw b wc u tc dm mh',
 '2027-09':'m dw b a n dt h se',
}
LEGACY_STATS = {
 '2021-06-a':{4:'m',8:'rp',13:'ac',17:'cp',19:'au',22:'b',27:'dk',29:'h'},
 '2021-06-b':{6:'aw',8:'b',12:'rp',16:'ac',20:'dk',27:'h',29:'cu'},
 '2021-09-a':{3:'da',5:'f',9:'rk',14:'sn',17:'acp',19:'ckp',22:'b',26:'ex',29:'h'},
 '2021-09-b':{5:'da',8:'c',12:'sn',14:'rk',19:'ctk',22:'b',27:'ex',29:'h'},
 '2021-11-a':{4:'d',6:'se',9:'cp',12:'n',17:'je',19:'ctm',22:'b',26:'rp',29:'h'},
 '2021-11-b':{5:'id',8:'ctm',11:'se',13:'hu',15:'rp',19:'n',22:'b',29:'ctm'},
}
UNITS = {
 '2021-06-b':'E D S L T P L C E D E C I S I P I S D P E T I D S D C S P D',
 '2021-09-b':'E D T L P L S P T D S V I C E S E D P I S C I E T D V I C D',
 '2021-11-b':'E S L T P D E P D S V S C I C T D E V I S C I E D L I T P D',
 '2022-example':'E I E L T I L T D E D I S L D E T L I S T D',
 '2022-06':'E I T L D I S L S E I T S D T E D S I I E D',
 '2022-09':'E D S L D T S L I T I T S I S E I S D D E D',
 '2022-11':'E D S L S D T I E D T L E D T E I S D I S L',
 '2023-06':'E D T L S L T D D T I S E I S E I S D I E L',
 '2023-09':'E D T L S D S D T I E L T I S E I S D I E L',
 '2023-11':'E L S D T D S D T I T I E L S E I S D I E D',
 '2024-06':'E D S L D T E D S I L S T I S E I D T I E D',
 '2024-09':'E D T L S D E I T D I S D E L E S D I T S I',
 '2024-11':'E D T L I S D I E I S I T L S E D S T D E D',
 '2025-06':'E D S L D T D S L T D E I E I E I S I T D S',
 '2025-09':'E D S L D T L E I T D S I E I E I S D T D S',
 '2025-11':'E D S L D T I E I T D S I T D E I S D E L S',
 '2026-06':'E D S L I T D T I E D S I T D E I S D S L E',
 '2026-09':'E D S L D T D E I S I E L T I S I S D T D E',
 '2026-11':'E D S L D E I T D E I S D T I S I T D S L E',
 '2027-06':'E D S L D T D T I E L S I T I E I S D E D S',
 '2027-09':'E D S L I T D S D E I T I S L E I S D T D E',
}

def review():
 p=ROOT/'data'/'questions.json';doc=json.loads(p.read_text());topicmap={}
 for eid,codes in SELECTIONS.items():
  assert len(codes.split())==8
  topicmap.update({f'{eid}-{n}':c for n,c in enumerate(codes.split(),23)})
 for eid,qs in LEGACY_STATS.items():topicmap.update({f'{eid}-{n:02}':c for n,c in qs.items()})
 doc['probability_reference']={'title':'EBS 2027학년도 수능특강 수학영역 확률과 통계','url':'https://www.ebsi.co.kr/ebs/pot/potg/retrieveCourseDetailNw.ebs?bookId=LB00000005914','chapters':BOOK}
 for q in doc['items']:
  s=q['statement_latex'];eid=q['exam_id'];n=q['number'];key=q['id']
  if key in topicmap:
   topics=[TOPICS[c] for c in dict.fromkeys(topicmap[key])];major=topics[0];q['subject'],q['unit'],_=UNIT_KEYS[major[0]]
   q['concepts']=[x[2] for x in topics];q['concept_note']=major[3];q['classification_status']='검수 완료';q['concept_evidence']=[]
   q['textbook_chapters']=[{'number':c,'title':BOOK[c][0],'page':BOOK[c][1],'end_page':BOOK[c][2]} for c in dict.fromkeys(x[1] for x in topics)]
   q['scope_judgement']='2015 개정 확률과 통계 범위에서 풀이 가능'
  elif eid in UNITS and n<=len(UNITS[eid].split()):
   subj,unit,fallback=UNIT_KEYS[UNITS[eid].split()[n-1]]
   q.update(subject=subj,unit=unit,classification_status='단원 검수')
   q['concepts']=math_concepts(s,unit,fallback)
   q['scope_judgement']=f'2015 개정 {subj} 범위에서 풀이 가능'
   q['concept_evidence']=[]
  # Normalize typesetting-only spaces without changing words or punctuation.
  q['statement_latex']=re.sub(r' +',' ',s).replace('$ 의','$의').replace('$ 을','$을').replace('$ 를','$를').replace('$ 가','$가').replace('$ 이 ','$이 ')
  q['formulas']=[m for m in q['formulas'] if m['latex']]
 assert {x['id'] for x in doc['items']}.issuperset(topicmap)
 assert all(q['id'] in topicmap for q in doc['items'] if q['subject']=='확률과 통계')
 p.write_text(json.dumps(doc,ensure_ascii=False,separators=(',',':')))

def math_concepts(s,unit,fallback):
 def has(pattern):return re.search(pattern,s) is not None
 if unit=='적분':
  tags=[]
  if has(r'속도|이동|움직|위치의 변화량'):tags+=['속도의 정적분과 위치 변화량','속도의 부호와 이동거리']
  if has('넓이|둘러싸'):tags+=['정적분과 도형의 넓이']
  if has(r"부정적분|f'\(x\)"):tags+=['부정적분과 적분상수']
  if has(r'\\int\s*_\{[^}]+\}\^\{[xt]\}|\\int.*\^\{[xt][+-]'):tags+=['정적분으로 정의된 함수','적분과 미분의 관계']
  if not tags:tags=['다항함수의 정적분']
  return tags
 if unit=='미분':
  tags=[]
  if has(r"\\lim_\{h\\to|\\lim.*f\(x\)-f\("):tags+=['미분계수의 정의']
  if has(r'접선|접할|접하는'):tags+=['접선의 방정식']
  if has('속도|가속도'):tags+=['위치·속도·가속도의 미분 관계']
  if has('미분가능'):tags+=['미분가능성과 연속']
  if has('극대|극소|극댓|극솟|극값|증가|감소'):tags+=['도함수의 부호와 함수의 증감·극값']
  if has('최댓값|최솟값'):tags+=['닫힌구간과 함수의 최대·최소' if has('닫힌구간|[가-힣]구간') else '함수의 최대·최소']
  if has('실근|교점|만나는 점의 개수'):tags+=['도함수와 그래프를 이용한 실근의 개수']
  if not tags:tags=['다항함수의 미분법']
  return tags
 if unit=='함수의 극한과 연속':
  tags=['연속의 정의와 경계에서의 함숫값'] if has('연속') else ['함수의 극한의 성질']
  if has(r'\\lim|\\begin\{cases\}|\\\{'):tags+=['좌극한과 우극한']
  if has('실근|불연속'):tags+=['구간에 따른 함수의 값과 그래프']
  return tags
 if unit=='수열':
  tags=[]
  if has('등차수열'):tags+=['등차수열의 일반항과 합']
  if has('등비수열'):tags+=['등비수열의 일반항과 합']
  if has(r'\\sum|첫째항부터|수열.*합'):tags+=['수열의 합과 시그마']
  if has(r'귀납법'):tags+=['수학적 귀납법']
  elif has(r'모든 자연수|다음 조건'):tags+=['수열의 귀납적 정의와 항 사이의 관계']
  return tags or [fallback]
 if unit=='삼각함수':
  if has('외접원|삼각형|사각형|반원') and not has('주기|그래프.*함수'):return ['사인법칙·코사인법칙','삼각형의 각·변·넓이 관계']
  if has('그래프|주기|방정식|최댓값|최솟값|부등식'):return ['삼각함수의 그래프와 주기','삼각함수의 방정식·부등식 활용']
  return ['삼각함수의 뜻과 기본 관계','사분면에 따른 삼각함수의 부호']
 if unit=='지수함수와 로그함수':
  if has('그래프|곡선|점근선'):return ['지수함수·로그함수의 그래프','그래프의 대칭·이동과 교점']
  if has('log|로그'):return ['로그의 성질과 밑의 변환']+(['로그의 정의역과 방정식·부등식'] if has('방정식|부등식|자연수') else [])
  return ['거듭제곱근과 지수법칙']+(['지수방정식·지수부등식'] if has('방정식|부등식') else [])
 return [fallback]

if __name__=='__main__':review()
