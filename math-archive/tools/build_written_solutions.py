"""Rebuild prose solutions from independently authored per-question notes.

Every record contains a question-specific idea and Korean prose with only
mathematical expressions delimited by $. No PDF extraction runs in this step.
"""
from pathlib import Path
import copy
import json
import re

ROOT = Path(__file__).resolve().parents[1]
ALIASES = {
 '2021-06-b-18':'2021-06-a-26', '2021-06-b-20':'2021-06-a-27',
 '2021-06-b-21':'2021-06-a-18', '2021-09-b-16':'2021-09-a-16',
 '2021-09-b-27':'2021-09-a-26', '2021-09-b-29':'2021-09-a-29',
 '2021-11-b-15':'2021-11-a-26', '2021-11-b-29':'2021-11-a-19',
}

def rebuild():
    catalog = json.loads((ROOT/'data/solutions.json').read_text())
    notes = json.loads((ROOT/'content/retained-solutions.json').read_text())
    for path in sorted((ROOT/'content').glob('solutions-*.txt')):
        for block in path.read_text().split('@@ ')[1:]:
            qid, idea, *steps = block.strip().splitlines()
            assert qid not in notes, (path, qid)
            assert idea and steps, qid
            notes[qid] = {'idea':idea, 'steps':steps}
    for qid, original in ALIASES.items():
        notes[qid] = copy.deepcopy(notes[original])
    teaching = {}
    for path in sorted((ROOT/'content').glob('insights-*.txt')):
        for line in path.read_text().splitlines():
            if not line.strip():
                continue
            qid, index, why = line.split('|', 2)
            assert qid not in teaching, qid
            teaching[qid] = {'key_step': int(index), 'why': why}
    for qid, original in ALIASES.items():
        teaching[qid] = copy.deepcopy(teaching[original])
    details = json.loads((ROOT/'content/teaching-details.json').read_text())
    for qid, paragraphs in details.items():
        teaching[qid]['details'] = paragraphs
    readings = json.loads((ROOT/'content/walkthrough-readings.json').read_text())
    for qid, paragraphs in readings.items():
        teaching[qid]['readings'] = paragraphs
    assert set(teaching) == set(notes), set(notes) - set(teaching)
    # The A and B versions ask different forms of the same mathematical value.
    notes['2021-06-b-20']['steps'][-1] = '따라서 조건부확률은 $17/29$이다.'
    notes['2021-11-b-29']['steps'][-1] += ' 기약분수에서 $p+q=540+47=587$이다.'
    assert set(notes) == set(catalog['items']), set(catalog['items']) - set(notes)
    overrides = json.loads((ROOT/'content/logic-classification.json').read_text())
    catalog['groups'].update(overrides['groups'])
    for qid, note in notes.items():
        item = catalog['items'][qid]
        item.update(note)
        item['teaching'] = teaching[qid]
        assert 0 <= teaching[qid]['key_step'] < len(item['steps']), qid
        item['logic'] = overrides['items'].get(qid, item['logic'])
        for key in ('calculation','source','sourceUrl','reference','pdf','source_page'):
            item.pop(key,None)
        item['explanation_format'] = 'prose-and-latex'
        for text in [item['idea'],*item['steps'],teaching[qid]['why'],*teaching[qid].get('readings',{}).values(),*[p for ps in teaching[qid].get('details',{}).values() for p in ps]]:
            assert text.count('$') % 2 == 0, qid
            assert not re.search(r'[\ue000-\uf8ff]', text), qid
            assert re.search('[가-힣]', re.sub(r'\$[^$]*\$', '', text)), (qid,text)
            assert all(not re.search('[가-힣]', math) for math in re.findall(r'\$([^$]*)\$',text)), (qid,text)
        assert all(key in catalog['groups'] for key in item['logic']), qid
    from stack_fractions import convert_tree
    catalog['question_overrides'] = {
        '2022-example-15': {
            'subject': '수학Ⅰ', 'unit': '수열',
            'concepts': ['수열의 귀납적 정의와 항 사이의 관계'],
            'scope_judgement': '2015 개정 수학Ⅰ 범위에서 풀이 가능',
        }
    }
    catalog = convert_tree(catalog)
    from combinatorics_notation import convert_tree as combinatorics_tree
    catalog = combinatorics_tree(catalog)
    (ROOT/'data/solutions.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2)+'\n')
    print(f'{len(notes)} complete prose solutions with individual ideas')

if __name__=='__main__':
    rebuild()

