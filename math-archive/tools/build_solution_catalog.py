"""Build a solution catalog from authored notes and indexed source references."""
import argparse
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
GROUPS = {
    'motion': ('위치·속도·가속도와 상대 위치', '위치·속도·가속도를 미분과 적분으로 잇는다. 만남이나 같은 속도는 차가 0인 때로 바꾼다.'),
    'expo-shift': ('지수·로그 그래프의 같은 높이 또는 길이', '점근선과 공통 높이로 교점의 좌표를 나타내고, 두 지수식을 나누거나 거리 조건을 대입한다.'),
    'integral-differentiate': ('변하는 적분 구간을 미분해 피적분함수 찾기', '적분 조건의 양변을 미분해 함수 관계를 얻고, 원래 식의 기준점에 대입해 상수를 복원한다.'),
    'integral-positivity': ('모든 구간의 적분 조건을 점별 부호로 바꾸기', '함숫값이 음수인 점 주변에서 적분이 음수가 된다는 사실로 조건을 피적분함수의 최솟값에 옮긴다.'),
    'integral-cancel': ('정적분을 더하거나 빼 공통 구간 없애기', '구간을 분할하거나 적분의 선형성을 적용해 공통 항을 소거하고 남은 식만 계산한다.'),
    'circumcircle': ('공통 외접원에서 현과 각을 변환하기', '코사인법칙이나 원주각으로 필요한 변·각을 얻고, 현의 길이와 맞은각의 사인 비를 지름으로 연결한다.'),
    'signed-area': ('부호가 바뀌는 곳에서 적분 나누기', '교점이나 영점으로 구간을 나눈 뒤 부호 있는 적분을 실제 넓이나 이동거리로 바꾼다.'),
    'exceptional-indices': ('규칙이 바뀌는 지표만 골라 합 계산하기', '대부분의 항을 기본 규칙으로 합하고 예외 지표에서 생기는 차이만 보정한다.'),
    'vanishing-order': ('분모의 영점과 분자의 소거 조건 맞추기', '분모가 0이 되는 후보를 먼저 찾고, 유한한 극한을 갖도록 분자도 필요한 차수만큼 0이 되게 한다.'),
    'boundary-values': ('식이 갈리는 경계에서 값·기울기 맞추기', '경계 양쪽의 함수값과 필요한 경우 미분계수를 비교해 조건을 매개변수 식으로 바꾼다.'),
    'trig-symmetry': ('삼각함수 대칭으로 좌표와 넓이 줄이기', '주기 이동과 점·축 대칭을 이용해 여러 교점의 좌표를 한 변수로 표현한다.'),
    'cancel-corners': ('절댓값 꼭짓점의 기울기 변화 상쇄하기', '단순근에서 생기는 좌우 기울기 차를 찾아, 합성된 식의 같은 위치에서 변화량이 상쇄되도록 한다.'),
    'inverse-coordinate': ('역함수 관계로 교점의 좌표 옮기기', '로그식을 지수식으로 바꾸어 반사·평행이동·배율에 따른 좌표 대응을 찾는다.'),
    'state-transitions': ('반복 시행에서 상태별 경로 수 누적하기', '현재 배열이나 위치를 상태로 두고 한 시행에서 가능한 이동을 세어 다음 단계의 경로 수를 구한다.'),
    'conditional-space': ('조건을 만족하는 표본공간부터 다시 세기', '조건이 성립하는 전체 경우를 분모로 두고, 두 사건을 동시에 만족하는 경우를 분자로 센다.'),
    'bounded-compositions': ('합 조건의 정수 해에서 제한 처리하기', '최솟값을 빼거나 합이 정해진 비음수 정수 해로 바꾼 뒤, 불가능한 해를 제외하거나 상한에 따라 나눈다.'),
    'moments': ('제곱의 평균을 평균과 분산으로 분리하기', '확률질량을 모두 나열하기 전에 합이나 표본평균의 평균·분산으로 필요한 적률을 계산한다.'),
    'log-substitute': ('로그 밑을 통일하고 대수식으로 바꾸기', '밑을 통일하고 로그값을 변수로 두어 방정식을 푼 뒤 진수 조건과 원래 구할 값을 확인한다.'),
    'progression-ratio': ('등차·등비수열의 일정한 간격 이용하기', '항을 첫째항과 공차·공비로 나타내고, 같은 간격의 항이나 부분합을 비교해 매개변수를 없앤다.'),
    'period-count': ('한 주기의 해를 세고 구간 끝점 확인하기', '목표 높이가 최댓값·최솟값에 닿는 경우를 따로 보고 주기 수와 끝점 포함 여부를 반영한다.'),
    'inverse-branch': ('높이 변화에 따른 가장 오른쪽 교점 추적하기', '가로선을 움직이며 원하는 교점 가지를 따라가고 극값의 높이에서 가지가 새로 생기거나 사라지는지 본다.'),
    'reverse-recurrence': ('점화식을 거슬러 올라가 가능한 이전 항 세기', '목표 항에서 각 분기의 역상을 만들고 부호나 홀짝 조건을 통과한 후보만 남긴다.'),
    'forward-recurrence': ('점화식의 분기를 따라 항·주기 찾기', '항의 부호나 나머지를 상태로 보아 다음 항을 결정하고 반복되는 블록을 찾아 계산을 줄인다.'),
    'flip-parity': ('뒤집기 횟수의 홀짝만 추적하기', '각 자리의 변화는 뒤집은 총횟수의 홀짝으로 정해진다. 시행 순서 대신 홀짝 조건을 풀어 가능한 횟수를 센다.'),
    'separator-gaps': ('구분자를 먼저 놓고 틈에 배치하기', '빈 자리나 다른 종류의 대상을 구분자로 삼아 틈을 만든 뒤, 인접 조건에 따라 쓸 수 있는 틈을 고른다.'),
    'tangent-parameter': ('접점을 변수로 놓고 접선 조건 풀기', '접점 $t$에서의 기울기와 함숫값을 이용해 접선 식을 세우고, 통과하는 점이나 다른 직선과의 관계를 대입한다.'),
    'integer-parameter': ('실수 조건을 정수 후보 범위로 좁히기', '부등식이나 경계값으로 가능한 구간을 얻은 뒤 정수 조건으로 후보를 세고 끝점을 검산한다.'),
    'roots-as-factors': ('근을 인수로 놓아 함수의 계수 줄이기', '주어진 영점이나 교점의 좌표로 차함수를 인수분해하고 남은 인수와 계수를 다른 조건에서 결정한다.'),
    'difference-sums': ('연속한 누적합을 빼 일반항 복원하기', '누적합을 한 단계씩 빼 공통 항을 지우고 $S_n-S_{n-1}=a_n$으로 필요한 항을 복원한다.'),
    'derivative-level': ('도함수의 부호로 극값과 교점 개수 정하기', '도함수의 영점과 부호로 증가·감소 구간을 나누고, 극값의 높이와 경계에서 등식이 되는 경우를 비교한다.'),
    'modular-count': ('홀짝 또는 나머지에 따라 경우 나누기', '원소를 같은 나머지끼리 묶고 합·곱의 나머지 조건이 허용하는 조합만 센다.'),
    'sum-distribution': ('시행 결과의 합을 만드는 조합과 순서 세기', '목표 합을 이루는 값의 조합을 먼저 나누고, 각 조합의 순서 수와 독립시행의 확률을 곱해 더한다.'),
    'normal-approximation': ('한 시행의 확률로 이항분포를 만들고 정규근사하기', '한 시행의 성공확률을 구하고 반복 횟수로 평균과 분산을 만든 뒤 표준화한다.'),
    'normal-symmetry': ('정규분포의 대칭과 표준화로 기준 맞추기', '평균을 중심으로 대칭인 확률을 옮겨 놓고 서로 다른 분포의 경계값을 표준점수로 비교한다.'),
    'confidence-width': ('신뢰구간의 중심과 반폭을 따로 쓰기', '끝점의 평균은 표본평균으로, 반폭은 임계값과 표준오차의 곱으로 해석한다.'),
    'count-function': ('함수의 치역 조건을 원소별 배정으로 바꾸기', '각 정의역 원소가 가질 수 있는 함숫값을 분류하고, 중복이나 순서 제한을 만족하는 배정 수를 센다.'),
    'complement-count': ('여사건 또는 겹치는 경우를 빼서 세기', '직접 세기 복잡한 사건을 전체에서 제외되는 경우로 바꾸거나, 겹쳐 센 경우를 포함배제로 조정한다.'),
    'arrangement-blocks': ('붙어야 하는 대상을 묶고 배치하기', '인접 조건을 블록으로 나타낸 뒤 내부 순서, 바깥 배열, 회전이나 동일 원소의 중복을 반영한다.'),
    'trig-identity': ('삼각비 항등식으로 식을 한 변수로 줄이기', '기본 관계식과 각의 범위를 이용해 사인·코사인 중 한 값으로 식을 정리하고 부호를 결정한다.'),
    'independent-trials': ('독립시행에서 성공 횟수와 위치 나누기', '한 시행의 경우를 먼저 분류하고 반복 횟수나 성공 위치를 고른 뒤 독립확률의 곱을 더한다.'),
}


def suggested_logic(question, reference):
    statement = question['statement_latex']
    context = ' '.join(question['concepts']) + ' ' + reference.get('intent', '')
    unit = question['unit']
    if re.search('가속도|수직선 위를 움직|운동 방향|두 점.*속도', statement):
        return 'motion'
    if unit == '지수함수와 로그함수':
        if ('log' in statement and re.search(r'y\\s*=', statement) and
                re.search('대칭|교점|중점|직선', statement)):
            return 'inverse-coordinate'
        return 'expo-shift' if re.search('곡선|그래프|점근선', statement) else 'log-substitute'
    if unit == '삼각함수':
        if re.search('사인법칙|코사인법칙|외접원|원주각|삼각형의 각·변', context) and not re.search('주기와 삼각|삼각함수의 그래프를', context[-110:]):
            return 'circumcircle'
        if re.search('대칭|넓이', statement) and re.search(r'\\(?:sin|cos|tan)', statement):
            return 'trig-symmetry'
        return 'period-count' if re.search('주기|방정식|실근|교점', context + statement) else 'trig-identity'
    if unit == '수열':
        if re.search(r'귀납|점화|a_\{n\+1\}', context + statement):
            if re.search('첫째항의 값|역으로|최댓값|가능한 모든', context + statement):
                return 'reverse-recurrence'
            if not re.search('합과 일반항 사이|첫째항부터 제', context + statement):
                return 'forward-recurrence'
        if re.search('등차수열|등비수열', context + statement):
            return 'progression-ratio'
        if re.search('첫째항부터|시그마|누적|수열의 합', context + statement):
            return 'difference-sums'
        return 'forward-recurrence'
    if unit == '함수의 극한과 연속':
        if r'\lim' in statement and r'\frac' in statement:
            return 'vanishing-order'
        return 'boundary-values'
    if unit == '미분':
        if '접선' in statement:
            return 'tangent-parameter'
        if re.search('절댓값|미분가능', statement) and re.search(r'\\begin\{cases\}|\\lvert|\|', statement):
            return 'cancel-corners' if '미분가능' in statement and '|' in statement else 'boundary-values'
        if re.search('가장 (오른쪽|큰)|실근의 최댓값|가장 큰 실근|에서만 불연속', statement):
            return 'inverse-branch'
        if re.search(r"f\([0-9-]+\)=0", statement):
            return 'roots-as-factors'
        return 'derivative-level'
    if unit == '적분':
        if re.search(r'\\int\s*_\{[^}]+\}\^\{[tx]\}|넓이를 .+라 할 때', statement) and re.search("정의된|모든 실수|미분|극값|S'", context + statement):
            return 'integral-differentiate'
        if re.search('넓이|절댓값', context) or '|' in statement:
            return 'signed-area'
        return 'integral-cancel'
    if unit == '경우의 수':
        if re.search('이웃|서로 붙', statement):
            return 'separator-gaps' if re.search('이웃하지|서로 붙지', statement) else 'arrangement-blocks'
        if re.search('함수.*개수|치역', statement):
            return 'count-function'
        if re.search('중복조합|나누어|넣을|순서쌍', context + statement):
            return 'bounded-compositions'
        return 'arrangement-blocks'
    if unit == '확률':
        if re.search('조건부확률', context):
            return 'conditional-space'
        if re.search('뒤집', statement):
            return 'flip-parity'
        if re.search('여사건|덧셈정리', context):
            return 'complement-count'
        if re.search('반복|독립시행', context + statement):
            return 'independent-trials'
        return 'sum-distribution'
    if re.search('신뢰구간|모평균의 추정', context):
        return 'confidence-width'
    if re.search('정규근사|이항분포.{0,25}정규', context):
        return 'normal-approximation'
    if re.search('정규분포|표준화', context):
        return 'normal-symmetry'
    return 'moments' if re.search('분산|기댓값|표준편차', context) else 'sum-distribution'


def read_authored(directory):
    items = {}
    for path in sorted(directory.glob('*.txt')):
        for line in path.read_text().splitlines():
            if not line.strip():
                continue
            question_id, keys, answer, *steps = re.split(r'\|(?=(?:[^$]*\$[^$]*\$)*[^$]*$)', line)
            assert question_id not in items and steps, question_id
            assert all(step.strip() and step.count('$') % 2 == 0 for step in steps), question_id
            items[question_id] = {'logic': keys.split(','), 'answer': answer, 'steps': steps}
    return items


def build(sections, authored, overrides, rates):
    archive = json.loads((ROOT / 'data/questions.json').read_text())
    results = {}
    example_url = ('https://www.ebsi.co.kr/ebs/ent/com/downLoadFileDefaultNew.ebs'
                   '?fileGbn=1&bbsCd=B122&datNo=127360#page=136')
    for question in archive['items']:
        if question['points'] != 4:
            continue
        qid = question['id']
        source = sections.get(qid, {})
        known_answer = source.get('answer') or rates['answers'].get(qid)
        item = authored.get(qid, {}).copy()
        if item and known_answer:
            assert item['answer'] == known_answer, (qid, item['answer'], known_answer)
        if not item:
            item = {'logic': overrides.get(qid, [suggested_logic(question, source)]), 'answer': known_answer}
        if question['exam_id'] == '2022-example':
            item['reference'] = {'label': '평가원 예시문항 정답표 · PDF 136쪽 ↗', 'url': example_url}
        elif source:
            label = f"EBSi 정답 및 풀이 · {'압축 파일의 해당 유형 PDF ' if source['is_zip'] else 'PDF '}{source['page']}쪽 ↗"
            url = source['url'] if source['is_zip'] else source['url'] + f"#page={source['page']}"
            item['reference'] = {'label': label, 'url': url}
        assert item['answer'] and item.get('reference'), qid
        assert all(key in GROUPS for key in item['logic']), qid
        results[qid] = item
    assert set(authored) <= set(results)
    return {'groups': {key: {'title': title, 'description': description}
                       for key, (title, description) in GROUPS.items()}, 'items': results}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('sections', type=Path)
    parser.add_argument('authored', type=Path)
    parser.add_argument('overrides', type=Path)
    args = parser.parse_args()
    data = build(json.loads(args.sections.read_text()), read_authored(args.authored),
                 json.loads(args.overrides.read_text()), json.loads((ROOT / 'data/ebsi-rates.json').read_text()))
    (ROOT / 'data/solutions.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print(len(data['items']), 'solution records,', sum('steps' in item for item in data['items'].values()), 'authored.')
