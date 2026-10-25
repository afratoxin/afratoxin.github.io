"""Check completeness and source-payload exclusion in explanations-only mode."""
import collections
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT/'data/archive.json').read_text())
assert data['publicationMode'] == 'explanations-only'
questions = data['questions']
assert len(questions) == len({q['id'] for q in questions}) == 755
expected = {'preliminary': 40, **{str(y): 35 if 2010 <= y <= 2018 else 40 for y in range(2009, 2028)}}
assert dict(collections.Counter(q['examKey'] for q in questions)) == expected
assert len(data['exams']) == 20
for q in questions:
    assert q['answer'] in range(1, 6) and len(q['summary']) >= 70, q['id']
    assert len(q['steps']) >= 3 and all(q['steps']), q['id']
    assert [o['number'] for o in q['options']] == [1, 2, 3, 4, 5], q['id']
    assert all(len(o['explanation']) >= 20 for o in q['options']), q['id']
    assert not all(o['explanation'].startswith('이 조합은') for o in q['options']), q['id']
    if q['examKey'] != '2027':
        assert q['sourceAccess'] == 'local-only', q['id']
        for key in ('text', 'rawText', 'sourceText', 'sourceStem', 'sourceOptions',
                    'originalExtractedText', 'originalSourceOptions', 'image',
                    'thumbnail', 'imageBundle', 'sourcePdf', 'assetPath', 'thumbnailPath'):
            assert not q.get(key), (q['id'], key)
        assert all(set(o) == {'number', 'correct', 'explanation'} for o in q['options']), q['id']
    if q['answerStatus'] == 'source-conflict':
        assert q.get('answerIssue'), q['id']
for exam in data['exams']:
    assert exam['key'] == '2027' or not exam.get('sourcePdf'), exam['key']
old = json.loads((ROOT/'data/2027.json').read_text())
by_id = {q['id']: q for q in questions}
for before in old['questions']:
    after = by_id[before['id']]
    for key in ('text', 'rawText', 'image', 'thumbnail', 'answer', 'summary', 'steps', 'statements', 'options'):
        assert before.get(key) == after.get(key), (before['id'], key)
assert by_id['2708']['answer'] == 3
print('PASS: 755 self-authored draft explanations, 3775 option explanations; no new original payloads; corrected 2027 preserved.')
