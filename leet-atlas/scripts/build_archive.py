"""Build the complete, classified archive without changing reviewed 2027 data.

Run from any directory; --source-dir points at the source-audit input bundle.
No PDF parsing, answer generation, network access, or source-file mutation occurs.
"""
from __future__ import annotations

import argparse
import collections
import copy
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_SHA256 = 'bb29cd32be2ce5aab44d8991061c451dd00c82ea426666a1763e8ab4c7f1a73a'
CLASSIFICATION_FILES = (
    'classifications-a.json', 'classifications-b.json',
    'classifications-c.json', 'classifications-d.json',
    'classifications-2027.json', 'classifications-ui-2022.json',
)
EXPECTED_EXAMS = {'preliminary': 40, **{
    str(year): 35 if 2010 <= year <= 2018 else 40 for year in range(2009, 2028)
}}
PRESERVED_KEYS = (
    'text', 'rawText', 'image', 'thumbnail', 'answer', 'sourceMarkedAnswer',
    'answerStatus', 'summary', 'steps', 'statements', 'options',
    'textCorrections', 'reviewNotes', 'types', 'logic',
)

# Definitions describe reusable topics; item-specific evidence remains on each item.
SUBJECT_DESCRIPTIONS = {}
_DEFINITIONS = '''
헌법=국가의 기본질서와 권력 구조, 헌법 규범의 효력과 적용을 다룬다.
기본권=자유와 평등 등 개인의 기본적 권리 및 그 제한과 보장을 다룬다.
행정법=행정기관의 권한, 처분, 규제와 권리구제 절차를 다룬다.
조세=과세 요건과 세 부담의 배분 및 조세제도의 효과를 다룬다.
공공정책=공공의 목적을 달성하기 위한 제도의 선택과 효과를 평가한다.
경제규제=경제활동에 대한 공적 제한과 규제 수단의 요건 및 효과를 다룬다.
민법=사인 사이의 법률행위와 권리관계에 관한 일반 규칙을 다룬다.
계약=계약의 체결과 효력, 의무의 이행 및 위반에 따른 관계를 다룬다.
소유권=물건에 대한 소유와 점유 및 권리의 귀속·변동을 다룬다.
손해배상=손해의 발생과 책임 성립 및 배상 범위를 다룬다.
가족·상속=혼인과 가족관계 및 재산의 상속에 관한 규칙을 다룬다.
민사소송=사인 간 분쟁을 해결하는 법원의 심리와 당사자 절차를 다룬다.
노동법=근로관계에서의 권리와 의무 및 노동조건의 규율을 다룬다.
지식재산권=발명과 저작물 등 지적 성과의 보호와 이용을 다룬다.
상법=회사와 상거래의 조직 및 법적 관계를 다룬다.
형법=범죄의 구성요건과 위법성 및 처벌의 성립 조건을 다룬다.
형사책임=행위자의 고의·능력·관여와 범죄에 대한 책임 귀속을 다룬다.
형사절차=수사와 강제처분 및 형사재판의 절차적 요건을 다룬다.
증거·사실인정=진술과 관찰 등 증거의 신뢰성 및 사실 판단의 근거를 평가한다.
형벌=처벌의 종류와 정도 및 제재의 목적과 정당화를 다룬다.
국제조약=국가 간 협약의 가입과 의무, 적용 범위와 효력을 다룬다.
국제분쟁=국가 간 분쟁의 관할과 해결 및 국제적 책임을 다룬다.
국제인권=국제 규범에 따른 인권의 보호와 권리구제 요건을 다룬다.
법해석=법문과 규칙의 의미 및 적용 범위를 정하는 기준을 비교한다.
법적 효력=규범과 법률행위가 구속력을 가지는 요건 및 효력 범위를 다룬다.
법과 도덕=법적 판단과 규범의 근거를 도덕 원리와 관련지어 분석한다.
입법=법률의 제정과 개정에서 고려하는 목적 및 대안 선택 기준을 다룬다.
법적 추론=법 규범과 사실을 연결하여 법적 결론을 도출하는 방식을 다룬다.
법조윤리=법률가의 역할과 직업적 의무 및 행위의 윤리적 기준을 다룬다.
인식론=앎과 믿음 및 지각의 성립과 정당화 조건을 다룬다.
도덕=행위와 태도의 옳고 그름 및 도덕적 정당화 기준을 다룬다.
권리=권리의 근거와 범위 및 동의·간섭에 관한 규범적 관계를 다룬다.
정의=공정한 대우와 분배 및 정당한 사회적 기준을 다룬다.
자유=자유로운 선택과 행위의 조건 및 간섭의 정당성을 다룬다.
책임=행위와 결과의 귀속 및 비난과 책임의 정당화 조건을 다룬다.
행위이론=의도와 믿음, 동기와 이유가 행위에 맺는 관계를 다룬다.
심리철학=의식과 느낌 및 심적 상태의 성립과 귀속을 다룬다.
존재론=사물과 속성의 존재 및 동일성과 관계의 성격을 다룬다.
과학철학=과학적 설명과 가설 검증 및 증거의 정당화 방식을 다룬다.
언어철학=언어적 표현의 의미와 지시 및 발화의 철학적 조건을 다룬다.
의미론=단어와 문장의 의미 및 지시와 참의 조건을 다룬다.
화용론=발화 상황과 화자의 의도 및 청자의 해석에 따른 효과를 다룬다.
언어와 사고=언어적 표현과 개념 및 사고 과정 사이의 관계를 다룬다.
예술철학=예술의 성립과 가치 및 작품의 존재 조건을 다룬다.
예술과 해석=작품의 내용과 창작·수정 및 감상자의 해석 기준을 다룬다.
문학이론=문학의 표현 방식과 작품 해석 및 비평의 원리를 다룬다.
서사=이야기의 사건과 설정 및 시간에 따른 내용 구성 방식을 다룬다.
문학과 사회=문학의 표현과 수용을 사회적 조건 및 가치와 관련지어 다룬다.
역사해석=과거의 사건과 변화에 대한 설명 및 해석의 근거를 다룬다.
사료=과거에 관한 기록과 자료의 신뢰성 및 증거 가치를 평가한다.
사회변동=사회적 제도와 집단 및 생활 질서의 변화 과정을 다룬다.
게임이론=상대의 행동과 정보에 의존하는 전략적 상호작용을 분석한다.
시장과 가격=수요와 공급 및 가격 변동과 규제가 거래에 미치는 영향을 다룬다.
정보경제=정보의 비대칭과 신호 및 정보 획득이 경제적 선택에 미치는 영향을 다룬다.
경제적 선택=선호와 효용 및 제약에 따른 개인과 집단의 대안 선택을 다룬다.
공공경제=공공재와 외부효과 및 정부 개입의 경제적 효과를 다룬다.
분배=소득과 자원 및 이익의 배분 기준과 결과를 다룬다.
거시경제=국민경제 전체의 생산과 소득 및 경기·물가 등의 관계를 다룬다.
노동경제=노동 공급과 수요 및 임금과 고용의 결정 요인을 다룬다.
민주주의=시민의 참여와 대표 및 민주적 의사결정의 정당성을 다룬다.
선거=투표 규칙과 대표 선출 및 선거 결과의 성질을 다룬다.
권력=정치적 지배와 영향력 및 권한의 정당성과 통제를 다룬다.
정치제도=국가와 정치 조직의 구성 및 권한 배분과 운영 규칙을 다룬다.
국제관계=국가 간 협력과 갈등 및 국제 정치의 상호작용을 다룬다.
매체=정보를 전달하는 수단의 특성과 수용 및 사회적 효과를 다룬다.
여론=사회적 의견의 형성과 분포 및 공론장의 판단을 다룬다.
정보전달=정보의 생산과 전달 및 수용 과정의 조건을 다룬다.
사회규범=사회가 기대하는 행위 기준과 규범의 형성 및 준수를 다룬다.
사회제도=사회적 역할과 권한 및 조직을 지속시키는 규칙을 다룬다.
사회집단=집단의 구성과 관계 및 집단에 따른 행위와 판단을 다룬다.
교육=학습과 교육의 목적 및 제도와 기회의 관계를 다룬다.
문화=공유된 관습과 상징 및 생활양식의 의미와 차이를 다룬다.
범죄·일탈=사회규범을 벗어나는 행위의 원인과 분포 및 사회적 대응을 다룬다.
범죄=범죄 발생의 사회적 조건과 원인 및 예방과 대응을 다룬다.
인지=주의와 정보처리 및 지각·이해·판단의 심리적 기제를 다룬다.
판단과 의사결정=선택과 추정 과정에서의 심리적 기준 및 편향을 다룬다.
학습과 기억=정보의 학습과 저장 및 기억의 인출과 적용을 다룬다.
감정=정서의 발생과 경험 및 판단과 행동에 미치는 영향을 다룬다.
사회심리=사회적 상호작용과 타인 및 집단이 개인의 심리와 행동에 미치는 영향을 다룬다.
심리실험=심리적 가설을 실험 조건과 집단별 측정 결과로 평가한다.
운동법칙=힘과 운동량 및 속도 변화 사이의 역학적 관계를 다룬다.
천문=천체와 우주의 구성 및 생성과 변화 과정을 다룬다.
광학=빛의 성질과 파장 및 빛의 발생과 관측을 다룬다.
전자기=전하와 전류 및 전기장·자기장의 상호작용을 다룬다.
열역학=온도와 열 및 에너지와 물질 상태의 관계를 다룬다.
파동=진동과 전파 및 파동의 중첩과 주기적 성질을 다룬다.
현대물리=원자와 입자 및 양자적 상태와 핵반응의 원리를 다룬다.
화학반응=반응물과 생성물 및 반응 조건과 물질 변화의 관계를 다룬다.
분자구조=원자 결합과 분자의 배치 및 구조에 따른 성질을 다룬다.
산화환원=전자 이동과 산화 상태 변화 및 관련 반응을 다룬다.
물질의 성질=물질의 구성과 상태 및 물리·화학적 특성을 다룬다.
유전=유전정보와 형질의 전달 및 세대 간 차이를 다룬다.
진화=생물 집단의 변이와 선택 및 세대에 따른 변화를 다룬다.
생태=생물과 환경 및 개체와 집단 사이의 상호작용을 다룬다.
신경계=신경 신호와 감각 및 신경계의 기능을 다룬다.
생리=생명체와 기관의 기능 및 체내 조절과 대사 과정을 다룬다.
면역=병원체에 대한 방어와 면역 반응 및 기억을 다룬다.
세포=세포의 구조와 기능 및 물질 이동과 생장 과정을 다룬다.
분자생물=유전자 발현과 효소 및 생체분자의 작용 경로를 다룬다.
알고리즘=문제를 해결하는 절차와 탐색 및 계산 단계의 성질을 다룬다.
정보와 부호=정보의 표현과 부호화 및 오류와 전달의 관계를 다룬다.
인공지능=기계의 학습과 추론 및 지능적 판단의 모형을 다룬다.
계산이론=계산의 가능성과 복잡도 및 형식적 계산 모형을 다룬다.
네트워크=연결 구조와 경로 및 정보와 흐름의 전달을 다룬다.
지질=지층과 암석 및 지구 내부와 지표의 형성 과정을 다룬다.
기후=대기와 기후의 변화 및 관련 요인의 상호작용을 다룬다.
해양=해수의 성질과 순환 및 바다의 환경 변화를 다룬다.
지구와 우주=지구의 운동과 우주 환경 및 천체와의 관계를 다룬다.
의학=질환과 진단 및 예방과 치료의 원리와 효과를 다룬다.
환경=환경 변화와 오염 및 생태적 영향과 대응을 다룬다.
과학방법론=가설과 관찰 및 실험 설계와 과학적 검증 방식을 다룬다.
기술과 사회=기술의 도입과 이용이 사회적 제도와 가치에 미치는 영향을 다룬다.
조건논리=조건문과 부정 및 선언의 관계를 연결하여 결론을 도출한다.
양화논리=모든 대상과 일부 대상에 대한 명제를 구별하고 결합한다.
인과관계=원인과 결과의 관계 및 인과 주장에 대한 근거를 분석한다.
원인=관찰된 현상을 설명하는 원인과 경쟁 설명을 비교한다.
논증=전제와 결론의 관계 및 추론의 타당성과 설득력을 분석한다.
역설=그럴듯한 전제와 추론이 만드는 모순 또는 반직관적 결론을 분석한다.
참과 거짓=여러 진술의 참거짓 및 동시에 성립할 수 있는 조건을 분석한다.
모순=주어진 명제나 규칙이 동시에 참일 수 없는 관계를 분석한다.
배치=여러 대상과 위치를 제약조건에 맞게 배열한다.
순서=선후와 인접 및 우선순위 조건을 만족하는 순서를 찾는다.
대응=서로 다른 대상과 속성을 제약조건에 맞게 연결한다.
선택과 조합=여러 대상의 선택과 결합에 관한 제약 및 가능한 경우를 분석한다.
확률=사건의 발생 가능성과 조건부 관계를 수량적으로 다룬다.
통계=자료의 분포와 요약 및 표본에서 얻는 추론을 다룬다.
수와 연산=수량 사이의 관계와 계산 및 산술적 규칙을 다룬다.
최적화=제약을 만족하는 대안의 최댓값과 최솟값 및 우월성을 비교한다.
기하=공간과 도형의 위치 및 거리와 크기 관계를 다룬다.
집합=대상의 포함과 교차 및 집합 간 관계를 다룬다.
조합=대상의 선택과 배정에 따른 가능한 경우의 수를 다룬다.
'''
for _line in _DEFINITIONS.strip().splitlines():
    _label, _description = _line.split('=', 1)
    SUBJECT_DESCRIPTIONS[_label] = _description

# These aliases are grounded in the actual 2027 item using the previous topic.
# Broad discipline labels map to fields (or the legal domain); specific labels
# map to the intermediate topic relevant to that item's original discussion.
LEGACY_TARGETS = {}
_ALIAS_GROUPS = {
    'domain:법률': '법학',
    'field:사법·민사절차': '민사소송법|민사법',
    'field:법일반·해석': '법해석론|입법정책|법철학',
    'field:국제법': '국제법|인권법',
    'field:공법': '헌법|의료법|행정법',
    'field:철학': '철학|윤리학|행위철학|언어철학',
    'field:형사·증거': '형사정책|증거 추론',
    'field:미학': '문학철학',
    'field:경제학': '경제학|사회선택이론|미시경제학',
    'field:심리학': '심리학|인지심리학|사회심리학',
    'field:수학': '수학|의사결정이론',
    'field:논리학': '논리학|명제논리',
    'field:생물': '생물학|생화학|유전학|미생물학',
    'field:물리': '물리학|원자물리학|천체물리학|역학',
    'subject:민사소송': '민사소송 심리절차|화해와 자기결정권|가명 민사소송|재판공개 원칙',
    'subject:기본권': '재판받을 권리|사생활과 시민 감시',
    'subject:법해석': '학칙상 징계|공동부정행위|IT기기 소지부정행위|국립묘지 합장|재혼과 기여 인정',
    'subject:수와 연산': '공증 수수료',
    'subject:민법': '인증과 증서작성',
    'subject:도덕': '도덕적 태도|도덕적 유능함|해악의 정의|효용 비교 기준|도덕적 선택|행동의 도덕성',
    'subject:헌법': '연방·주 헌법',
    'subject:형사절차': '강제조치 허가|긴급조치 사후통제',
    'subject:국제조약': 'AI인권협약|적용 제외',
    'subject:국제인권': '국제적 권리구제',
    'subject:행정법': '시각장애인 안마사|안마의 정의|자동차 규제|형사·행정 제재',
    'subject:형사책임': '무면허 의료행위|처벌 감경',
    'subject:참과 거짓': '폭행사건 증거|진술의 정합성|시간대별 사실관계|한 명의 거짓말',
    'subject:공공정책': '배우자 예우',
    'subject:입법': '법률 개정안 선택|공익·사익 비교',
    'subject:화용론': '언어행위|의도·해석·합의',
    'subject:권리': '동의와 강압',
    'subject:책임': '불안과 합리적 판단|도덕적 책임|자유의지와 비난',
    'subject:심리철학': '집단감정|의식과 감정 표현',
    'subject:예술과 해석': '허구의 진리',
    'subject:서사': '사후 설정 변경',
    'subject:행위이론': '믿음과 동기|행위 의도|믿음과 시도',
    'subject:인식론': '지각과 앎|기억',
    'subject:법과 도덕': '법관의 판단 불일치',
    'subject:증거·사실인정': '과학수사|증거 독립성',
    'subject:과학철학': '가설 검증',
    'subject:게임이론': '신호발송게임|전략별 신호 배정',
    'subject:정보경제': '정보 비대칭',
    'subject:경제적 선택': '집단 의사결정|파레토 우월',
    'subject:인지': '인지심리|부분 일치 가설|독서 인지|공간적 고정성|인지적 부하',
    'subject:학습과 기억': '지식 간과',
    'subject:시장과 가격': '가격상한제|가격하한제|수요와 공급',
    'subject:심리실험': '사회심리 실험',
    'subject:사회심리': '도덕적 행동',
    'subject:감정': '죄책감의 매개효과',
    'subject:확률': '불확실성하 의사결정|기댓값',
    'subject:대응': '대응 퍼즐|일대일 속성 배치|합계 제약',
    'subject:순서': '순서 퍼즐|발표 순서',
    'subject:조건논리': '직원 속성의 조건 관계',
    'subject:양화논리': '전칭·존재 명제',
    'subject:생리': '알코올 대사',
    'subject:분자생물': '경쟁적 효소 억제|DNA 메틸화|세균의 LPS 합성|담즙 내성 가설',
    'subject:현대물리': '수소 원자 에너지 준위',
    'subject:광학': '빛의 스펙트럼',
    'subject:유전': '획득형질의 유전|벼의 내한성',
    'subject:천문': '빅뱅 핵합성|수소·헬륨 구성비|우주 팽창과 밀도',
    'subject:운동법칙': '운동량과 충격량|상호작용의 반대 방향',
}
for _target, _labels in _ALIAS_GROUPS.items():
    for _label in _labels.split('|'):
        LEGACY_TARGETS[_label] = tuple(_target.split(':', 1))


def read_json(path):
    return json.loads(path.read_text(encoding='utf-8'))


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def build(source_dir, metadata_only=False):
    old_path = ROOT / 'data/2027.json'
    old = read_json(old_path)
    extracted_path = source_dir / 'questions-extracted.json'
    extracted = read_json(extracted_path)
    if len(extracted) != 755 or len({q['id'] for q in extracted}) != 755:
        raise ValueError('Extraction must contain exactly 755 unique questions.')
    assignments, batches = {}, []
    missing_files = [name for name in CLASSIFICATION_FILES if not (source_dir/name).exists()]
    if missing_files:
        raise ValueError('Missing classification files: ' + ', '.join(missing_files))
    for name in CLASSIFICATION_FILES:
        path = source_dir / name
        rows = read_json(path)
        for original_row in rows:
            row = copy.deepcopy(original_row)
            for subject in row['subjects']:
                if subject['label'] == '범죄':
                    subject['label'] = '범죄·일탈'
            if row['id'] in assignments:
                raise ValueError(f'Duplicate classification: {row["id"]}')
            assignments[row['id']] = row
        batches.append((name, rows, digest(path)))
    source_ids = {q['id'] for q in extracted}
    if set(assignments) != source_ids:
        missing = sorted(source_ids-set(assignments))
        extra = sorted(set(assignments)-source_ids)
        raise ValueError(f'Incomplete classifications: {len(missing)} missing {missing[:12]}, extra={extra[:12]}')

    old_tags = {(t['axis'], t['label']): t for t in old['taxonomy']}
    tags = {}
    def register(axis, label, description, **metadata):
        key = (axis, label)
        if key not in tags:
            previous = old_tags.get(key)
            tag_id = previous['id'] if previous else axis+'-'+hashlib.sha1(label.encode()).hexdigest()[:10]
            tags[key] = {'id': tag_id, 'axis': axis, 'label': label, 'description': description, **metadata}
        return tags[key]['id']

    for tag in old['taxonomy']:
        if tag['axis'] in {'domain', 'field', 'type', 'logic'}:
            register(tag['axis'], tag['label'], tag['description'], **{
                key: value for key, value in tag.items()
                if key not in {'id', 'axis', 'label', 'description', 'count'}
            })
    fields = {label: tag for (axis, label), tag in tags.items() if axis == 'field'}
    subject_fields = collections.defaultdict(set)
    for row in assignments.values():
        if not row['fields'] or not row['subjects'] or not row['types'] or not row['logic']:
            raise ValueError(('Empty classification', row['id']))
        for field in row['fields']:
            if field not in fields:
                raise ValueError(('Unknown field', row['id'], field))
        for subject in row['subjects']:
            if subject['field'] not in row['fields'] or not subject['reason']:
                raise ValueError(('Invalid subject assignment', row['id'], subject))
            label = subject['label']
            if len(label) > 16 or '/' in label or '>' in label:
                raise ValueError(('Subject is not an intermediate label', row['id'], label))
            subject_fields[label].add(subject['field'])
    for label in sorted(subject_fields):
        parents = sorted(subject_fields[label], key=list(fields).index)
        description = SUBJECT_DESCRIPTIONS.get(label)
        if not description:
            raise ValueError(('Missing intermediate subject definition', label))
        register('subject', label, description, parentField=parents[0], parentFields=parents,
                 level='intermediate')

    questions = []
    reviewed = {q['id']: q for q in old['questions']}
    for source in extracted:
        qid = source['id']
        row = assignments[qid]
        is_reviewed = qid in reviewed
        q = copy.deepcopy(reviewed[qid] if is_reviewed else source)
        q['id'] = qid
        q['number'] = source['number']
        q['year'] = source['year']
        q['examKey'] = source['examKey']
        q['examLabel'] = source['examLabel']
        q['sourcePage'] = source['sourcePage']
        q['examPage'] = source['examPage']
        q['sourcePdf'] = 'data/2027-original.pdf' if is_reviewed else source['sourcePdf']
        q['sourcePdfPage'] = source['examPage']
        q['dataPath'] = 'data/archive.json'
        q['title'] = row['title']
        q['fields'] = list(dict.fromkeys(row['fields']))
        q['subjects'] = list(dict.fromkeys(subject['label'] for subject in row['subjects']))
        q['subjectAssignments'] = copy.deepcopy(row['subjects'])
        q['types'] = reviewed[qid]['types'][:] if is_reviewed else list(dict.fromkeys(row['types']))
        q['logic'] = reviewed[qid]['logic'][:] if is_reviewed else list(dict.fromkeys(row['logic']))
        q['domains'] = list(dict.fromkeys(fields[field]['parentDomain'] for field in q['fields']))
        if is_reviewed:
            q['domains'] = reviewed[qid]['domains'][:]
        else:
            q['image'] = source['assetPath']
            q['thumbnail'] = source['thumbnailPath']
            q['answer'] = None
            q['answerStatus'] = 'not-reviewed'
            q['textStatus'] = 'PDF 문자층 추출 · 표·수식·도식은 원본 이미지 확인'
            q['confidence'] = 'classification-only'
        if metadata_only and not is_reviewed:
            q['sourceAccess'] = 'local-only'
            for key in ['text', 'image', 'thumbnail', 'sourcePdf']:
                q[key] = ''
            for key in ['rawText', 'originalExtractedText', 'assetPath', 'thumbnailPath']:
                q.pop(key, None)
            q['textStatus'] = '분류 정보 및 통합 원본 PDF 출처 페이지 제공'
        q['classificationReasons'] = {key: row[key] for key in ('fieldReason', 'typeReason', 'logicReason')}
        q['fieldReasons'] = {field: ' '.join(s['reason'] for s in row['subjects'] if s['field']==field) or row['fieldReason'] for field in q['fields']}
        reasons = q.setdefault('tagReasons', {})
        reasons.update(q['fieldReasons'])
        for subject in row['subjects']:
            reasons[subject['label']] = subject['reason']
        for domain in q['domains']:
            reasons[domain] = row['fieldReason']
        for label in q['types']:
            reasons.setdefault(label, row['typeReason'])
        for label in q['logic']:
            reasons.setdefault(label, row['logicReason'])
        year_label = '2009학년도 예비시험' if source['examKey']=='preliminary' else f'{source["year"]}학년도'
        reasons[year_label] = f'{source["examLabel"]} 추리논증 {source["number"]}번이며, 통합 원본 PDF {source["sourcePage"]}쪽에 있다.'
        q['tags'] = [register('year', year_label, f'{year_label} 법학적성시험 추리논증의 회차 태그.')]
        for axis, key in [('domain','domains'), ('field','fields'), ('subject','subjects'), ('type','types'), ('logic','logic')]:
            for label in q[key]:
                if (axis, label) not in tags:
                    raise ValueError(('Undefined canonical tag', qid, axis, label))
                q['tags'].append(tags[axis,label]['id'])
        q['tags'] = list(dict.fromkeys(q['tags']))
        if is_reviewed:
            for key in PRESERVED_KEYS:
                if q.get(key) != reviewed[qid].get(key):
                    raise ValueError(('Reviewed 2027 value changed', qid, key))
        questions.append(q)

    counts = collections.Counter(tid for q in questions for tid in q['tags'])
    for tag in tags.values():
        tag['count'] = counts[tag['id']]
    tag_aliases, alias_details = {}, []
    for previous in old['taxonomy']:
        if previous['axis'] != 'subject' or any(t['id']==previous['id'] for t in tags.values()):
            continue
        label = previous['label']
        target_key = ('field', label) if label in fields else LEGACY_TARGETS.get(label)
        if target_key not in tags:
            raise ValueError(('Legacy subject alias is not mapped', label, target_key))
        target = tags[target_key]
        tag_aliases[previous['id']] = target['id']
        ids = [q['id'] for q in old['questions'] if label in q['subjects']]
        alias_details.append({'oldId': previous['id'], 'oldLabel': label,
                              'targetId': target['id'], 'targetAxis': target['axis'],
                              'targetLabel': target['label'], 'sourceQuestionIds': ids})
    if len({tag['id'] for tag in tags.values()}) != len(tags):
        raise ValueError('Canonical tag ID collision')

    exams = []
    for key, count in EXPECTED_EXAMS.items():
        selected = [q for q in questions if q['examKey']==key]
        if len(selected)!=count or sorted(q['number'] for q in selected)!=list(range(1,count+1)):
            raise ValueError(('Exam coverage mismatch',key,len(selected),count))
        year = 2009 if key=='preliminary' else int(key)
        exams.append({'key':key,'year':year,'label':'2009학년도 예비시험' if key=='preliminary' else f'{year}학년도',
                      'questionCount':count,'kind':'preliminary' if key=='preliminary' else 'main',
                      'sourcePages':[min(q['sourcePage'] for q in selected),max(q['sourcePage'] for q in selected)],
                      'sourcePdf':selected[0]['sourcePdf'],'sourcePdfPageCount':max(q['examPage'] for q in selected)})
    provenance_path=source_dir/'provenance.json'
    provenance=read_json(provenance_path) if provenance_path.exists() else {}
    if provenance and provenance['source']['sha256']!=SOURCE_SHA256:
        raise ValueError('Original PDF provenance does not match expected archive source.')
    policy={**old.get('classificationPolicy',{}),
            'subject':'분야 아래 하나의 중간 소재 계층을 사용한다. 구체적인 사례명은 제목과 원문에 보존하며 등장 단어만으로 소재를 배정하지 않는다.',
            'review':'2027 수정본의 정답·해설·원문과 이미지는 보존한다. 다른 715문항은 소재 분류만 제공하고 정답과 해설을 생성하지 않는다.',
            'sharedSubjects':'같은 소재명이 여러 분야에 걸치면 canonical 태그 하나와 parentFields를 사용하고 문항별 근거는 subjectAssignments에 보존한다.'}
    result={'schemaVersion':2,'exam':{'label':'LEET 추리논증 전체 아카이브','questionCount':755,'examCount':20,
                                    'status':'전체 소재 분류 적용 · 2027 수정 해설 보존','reviewedQuestionCount':40},
            'exams':exams,'questions':questions,'taxonomy':list(tags.values()),'tagAliases':tag_aliases,
            'references':copy.deepcopy(old.get('references',[])),'classificationPolicy':policy}
    manifest={'schemaVersion':1,'sourceSha256':SOURCE_SHA256,'sourcePageCount':356,
              'questionCount':755,'examCount':20,'questionIds':[q['id'] for q in questions],
              'reviewedQuestionIds':list(reviewed),'unreviewedQuestionCount':715,'exams':exams,
              'extractionSha256':digest(extracted_path),'reviewed2027Sha256':digest(old_path),
              'classificationFiles':[{'path':'data/classifications/'+name,'questionCount':len(rows),'sha256':sha} for name,rows,sha in batches],
              'legacyTagAliases':alias_details,'taxonomyCount':len(tags)}
    result['publicationMode'] = 'metadata-only' if metadata_only else 'full-source'
    manifest['publicationMode'] = result['publicationMode']
    write_json(ROOT/'data/archive.json',result)
    write_json(ROOT/'data/archive-manifest.json',manifest)
    classifications_dir=ROOT/'data/classifications'
    classifications_dir.mkdir(parents=True,exist_ok=True)
    for name, rows, source_hash in batches:
        payload=(source_dir/name).read_bytes()
        if hashlib.sha256(payload).hexdigest()!=source_hash:
            raise ValueError(('Classification input changed during build',name))
        (classifications_dir/name).write_bytes(payload)
    write_docs(exams, tag_aliases, subject_fields, metadata_only)
    print(f'Built {len(questions)} questions / {len(exams)} exams / {len(tags)} canonical tags / {len(tag_aliases)} legacy aliases.')


def write_docs(exams, aliases, parents, metadata_only=False):
    lines=['# 전체 아카이브의 소재 분류와 재생성','',
           '20회분 755문항을 분야 → 중간 소재 한 계층으로 분류한다. 같은 개념의 구체적인 사례명은 제목에 두며, 각 배정의 내용 근거는 문항별 `subjectAssignments`와 `tagReasons`에 저장한다.','',
           '2027학년도 40문항은 기존 수정 원문, 이미지, 정답, 보기별 판단과 해설을 보존한다. 나머지 715문항의 정답은 `null`, 상태는 `not-reviewed`이다. 공개판은 새로운 715문항의 분류·근거·통합 PDF 출처 쪽만 제공하며, 새로 첨부된 원문·이미지·PDF를 공개하지 않는다.','',
           '## 회차 범위','', '| 회차 | 문항 수 | 통합 원본 PDF 쪽 |','| --- | ---: | --- |']
    lines.extend(f'| {e["label"]} | {e["questionCount"]} | {e["sourcePages"][0]}–{e["sourcePages"][1]} |' for e in exams)
    lines += ['', '## 태그와 기존 링크','',
              '대범주·분야·문항 유형·풀이 논리의 기존 태그 ID와 정의를 재사용한다. 소재는 짧은 중간 범주와 내용 정의를 갖는다. 모든 태그의 문항 수는 전체 755문항에서 다시 계산한다.', '',
              f'기존의 세부 학문·사례 소재 ID {len(aliases)}개는 `tagAliases`를 통해 관련 분야나 중간 소재로 연결한다. 분야명과 같은 구 소재는 그 분야 태그로 연결하고, 나머지는 해당 2027 원문의 논점에 근거하여 연결한다. 자세한 대응과 근거 문항 ID는 `data/archive-manifest.json`의 `legacyTagAliases`에 있다.','',
              '동일한 소재명이 여러 분야에서 쓰이면 ID를 하나로 유지한다. `parentField`는 대표 분야, `parentFields`는 가능한 분야 전체이며 문항별 배정 분야는 `subjectAssignments`로 확인한다.']
    for label, fields in sorted(parents.items()):
        if len(fields)>1:
            lines.append(f'- {label}: '+', '.join(sorted(fields)))
    lines += ['', '## 재생성','',
              '입력 묶음에는 `questions-extracted.json`, 여섯 개의 `classifications-*.json`, 원본 SHA를 담은 `provenance.json`이 포함된다. 입력 분류가 755문항을 빠짐없이 한 번씩 포함할 때만 결과를 쓴다.','',
              '```bash','python scripts/build_archive.py --source-dir /path/to/source-audit --metadata-only','python scripts/validate_archive.py','python scripts/validate_data.py','```','',
              '생성기는 네트워크 접근이나 PDF 재추출 없이 실행되며 기존 `data/2027.json`을 수정하지 않는다. 통합 원본의 SHA-256은 `data/archive-manifest.json`에서 확인할 수 있다.']
    path=ROOT/'docs/archive-classification.md';path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text('\n'.join(lines)+'\n',encoding='utf-8')


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-dir',type=Path,default=ROOT.parents[1]/'source-audit',help='source-audit input directory')
    parser.add_argument('--metadata-only', action='store_true', help='publish classification metadata only; preserve existing 2027 source')
    args=parser.parse_args()
    build(args.source_dir.resolve(), metadata_only=args.metadata_only)


if __name__=='__main__':
    main()
