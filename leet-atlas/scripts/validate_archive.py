"""Validate complete archive coverage, provenance, classification and preserved reviews."""
import collections
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
archive = ROOT / 'data/archive.json'
assert archive.exists(), '20회분 전체 archive.json이 아직 생성되지 않았습니다.'
d = json.loads(archive.read_text())
old = json.loads((ROOT / 'data/2027.json').read_text())
questions = d['questions']
assert len(questions) == 755
assert len({q['id'] for q in questions}) == 755
expected = {'preliminary': 40, **{str(y): 35 if 2010 <= y <= 2018 else 40 for y in range(2009, 2028)}}
assert dict(collections.Counter(q['examKey'] for q in questions)) == expected
assert len(d['exams']) == 20
assert sum(e['questionCount'] for e in d['exams']) == 755
taxonomy = {t['id']: t for t in d['taxonomy']}
assert len(taxonomy) == len(d['taxonomy'])
assert len({(t['axis'], t['label']) for t in d['taxonomy']}) == len(taxonomy)
fields = {t['label'] for t in d['taxonomy'] if t['axis'] == 'field'}
counts = collections.Counter(tid for q in questions for tid in q['tags'])
for t in taxonomy.values():
    assert t['description'] and t['count'] == counts[t['id']], t['id']
    if t['axis'] == 'subject':
        parent_fields = t.get('parentFields', [t['parentField']])
        assert parent_fields and set(parent_fields) <= fields and t['parentField'] in parent_fields, t
        assert len(t['label']) <= 16, ('소재가 지나치게 구체적입니다.', t)
        assert '>' not in t['label'] and '/' not in t['label'], t
by_id = {q['id']: q for q in questions}
for exam, count in expected.items():
    selected = [q for q in questions if q['examKey'] == exam]
    assert sorted(q['number'] for q in selected) == list(range(1, count + 1)), exam
    for q in selected:
        assert q['id'] == (f'p{q["number"]:03}' if exam == 'preliminary' else f'{int(exam)%100:02}{q["number"]:02}'), q['id']
for q in questions:
    if q.get('sourceAccess') == 'local-only':
        assert not any(q.get(key) for key in ['text','rawText','image','thumbnail','sourcePdf','assetPath','thumbnailPath']), q['id']
    else:
        assert len(q['text']) >= 160, q['id']
    assert '\ufffd' not in q['text'], q['id']
    if q.get('sourceAccess') != 'local-only':
        assert q['text'].lstrip().startswith(str(q['number']) + '.'), q['id']
    assert q['sourcePage'] in range(1, 357) and q['examPage'] > 0
    if q.get('sourceAccess') != 'local-only':
        assert q['image'] and q['thumbnail'] and q['sourcePdf']
    for key in ['domains', 'fields', 'subjects', 'types', 'logic', 'tags']:
        assert q[key], (q['id'], key)
    assert 1 <= len(q['subjects']) <= 4, q['id']
    assert len(q['tags']) == len(set(q['tags']))
    for tid in q['tags']:
        assert tid in taxonomy, (q['id'], tid)
        t = taxonomy[tid]
        assert q['tagReasons'].get(t['label']) or q['tagReasons'].get(tid), (q['id'], t['label'])
        if t['axis'] == 'subject':
            assert set(t.get('parentFields', [t['parentField']])) & set(q['fields']), (q['id'], t)
    assert {t['axis'] for tid in q['tags'] for t in [taxonomy[tid]]} >= {'domain','field','subject','type','logic','year'}
    if q['examKey'] != '2027':
        assert q.get('answer') is None and q['answerStatus'] == 'not-reviewed', q['id']
        assert not q.get('options') and not q.get('steps'), q['id']
for before in old['questions']:
    after = by_id[before['id']]
    for key in ['text','rawText','image','thumbnail','answer','sourceMarkedAnswer','answerStatus','summary','steps','statements','options','textCorrections','reviewNotes']:
        assert after.get(key) == before.get(key), ('기존 수정본 보존 실패', before['id'], key)
assert by_id['2708']['answer'] == 3
for qid in ['0929','1218','1221','1309','1334','1404','1626','1634','1714','1804']:
    assert len(by_id[qid].get('clips', [])) >= 2, ('두 열에 이어진 문항 원문 누락', qid)
for alias, target in d['tagAliases'].items():
    assert target in taxonomy and alias not in taxonomy, (alias, target)
report = json.loads((ROOT/'data/archive-manifest.json').read_text())
assert report['questionCount'] == 755 and report['examCount'] == 20
assert len(report['sourceSha256']) == 64
assert set(report['questionIds']) == set(by_id)
print(f'PASS: {len(questions)} questions, {len(expected)} exams, {len(taxonomy)} canonical tags; complete source ranges, aliases and 2027 corrected analyses preserved.')
