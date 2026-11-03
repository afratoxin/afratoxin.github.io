"""Import publicly listed EBSi wrong-answer rates from saved Full Service pages.

Run with a directory of retrieveMainWrongList.ajax responses named <irecord>-wrong.html.
"""
import argparse
import json
import re
from decimal import Decimal
from pathlib import Path

from lxml import html

ROOT = Path(__file__).resolve().parents[1]
COHORTS = {
    '140119': '확률과 통계', '140120': '미적분', '140121': '기하',
    '61001': '가형', '61007': '나형',
}
FULL_SERVICE = 'https://www.ebsi.co.kr/ebs/xip/xipa/retrieveSCVMainInfo.ebs'
LEGACY = {'202006183': '2021-06', '202009163': '2021-09', '202012033': '2021-11'}


def exam_id(record):
    if record in LEGACY:
        return LEGACY[record]
    month = '09' if record == '202209013' else record[4:6]
    if month not in {'06', '09', '11'}:
        raise ValueError(f'Unexpected record: {record}')
    return f'{int(record[:4]) + 1}-{month}'


def import_rates(directory):
    archive = json.loads((ROOT / 'data/questions.json').read_text())
    questions = {question['id']: question for question in archive['items']}
    exams = {}
    rates = {}
    answers = {}
    for path in sorted(directory.glob('*-wrong.html')):
        record = path.name.split('-')[0]
        exam = exam_id(record)
        exams[exam] = f'{FULL_SERVICE}?irecord={record}&targetCd=D300'
        document = html.parse(str(path))
        for code, cohort in COHORTS.items():
            rows = document.xpath(f'//div[@id="orderWrong"]//tr[contains(concat(" ",normalize-space(@class)," "), " subj_{code} ")]')
            if not rows:
                continue
            assert len(rows) == 15, (record, cohort, len(rows))
            for row in rows:
                cells = row.xpath('./td')
                rank, number, wrong, points, answer = [cell.text_content().strip() for cell in cells[:5]]
                assert 1 <= int(rank) <= 15 and 1 <= int(number) <= 30
                if code in {'140120', '140121'} and int(number) > 22:
                    continue
                paper = exam + {'61001': '-a', '61007': '-b'}.get(code, '')
                question_id = f'{paper}-{int(number):02}'
                question = questions.get(question_id)
                if question is None:
                    continue
                assert question['points'] == int(points), (question_id, question['points'], points)
                if not re.fullmatch(r'\d{1,3}(?:\.\d+)?', wrong):
                    continue
                percent = Decimal(wrong)
                assert 0 <= percent <= 100, (question_id, cohort, wrong)
                assert cohort not in rates.setdefault(question_id, {}), (question_id, cohort)
                rates[question_id][cohort] = float(percent)
                if answer in '①②③④⑤' or re.fullmatch(r'\d{1,3}', answer):
                    previous = answers.setdefault(question_id, answer)
                    assert previous == answer, (question_id, previous, answer)
    assert set(exams) == {exam['id'].removesuffix('-a').removesuffix('-b') for exam in archive['exams']} - {'2022-example'}
    return {'exams': exams, 'rates': rates, 'answers': answers}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', type=Path)
    args = parser.parse_args()
    data = import_rates(args.directory)
    (ROOT / 'data/ebsi-rates.json').write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(f"{len(data['exams'])} exams, {len(data['rates'])} questions, {sum(map(len, data['rates'].values()))} cohort rates.")
