"""Verify every original, parsed text and substantive five-choice explanation."""
import base64
import collections
import io
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
d = json.loads((ROOT/'data/archive.json').read_text())
assert d.get('publicationMode') == 'full-content', '모든 문항의 이미지·본문·해설이 아직 반영되지 않았습니다.'
qs = d['questions']
assert len(qs) == len({q['id'] for q in qs}) == 755
old = json.loads((ROOT/'data/2027.json').read_text())
by_id = {q['id']:q for q in qs}
images = {}
for path in sorted((ROOT/'data/images').glob('*.json')):
    bundle = json.loads(path.read_text())
    assert bundle['mimeType'] == 'image/webp'
    for qid, encoded in bundle['images'].items():
        assert qid not in images, qid
        payload = base64.b64decode(encoded, validate=True)
        im = Image.open(io.BytesIO(payload)); im.verify()
        assert im.format == 'WEBP', qid
        images[qid] = path
assert len(images) == 715
for q in qs:
    qid = q['id']
    assert len(q['text']) >= 160 and '\ufffd' not in q['text'], qid
    assert not any(0xe000 <= ord(c) <= 0xf8ff for c in q['text']), qid
    assert all(c in q['text'] for c in '①②③④⑤'), qid
    assert q['answer'] in range(1,6) and q['sourceMarkedAnswer'] in range(1,6), qid
    assert q['answerStatus'] in {'source-and-solution-agree','source-conflict'}, qid
    if q['answerStatus'] == 'source-and-solution-agree':
        assert q['answer'] == q['sourceMarkedAnswer'] == q.get('derivedAnswer',q['answer']), qid
    else:
        assert q.get('answerIssue'), qid
        if q.get('derivedAnswer') is None:
            assert q.get('derivedConclusion'), qid
        else:
            assert q['derivedAnswer'] in range(1,6), qid
    assert len(q['summary']) >= 70, qid
    assert len(q['steps']) >= 3 and all(q['steps']), qid
    assert [o['number'] for o in q['options']] == [1,2,3,4,5], qid
    no_listed_answer = q['answerStatus'] == 'source-conflict' and q.get('derivedAnswer') is None
    assert sum(bool(o['correct']) for o in q['options']) == (0 if no_listed_answer else 1), qid
    minimum_option_length = 20 if q['examKey'] == '2027' else 25
    assert all(len(o['explanation']) >= minimum_option_length for o in q['options']), qid
    assert all(isinstance(s['verdict'],bool) and len(s['explanation']) >= 20 for s in q.get('statements',[])), qid
    if q['examKey'] != '2027':
        assert qid in images and q['sourceAccess'] == 'bundled', qid
        assert q['imageBundle'] == images[qid].relative_to(ROOT).as_posix(), qid
        assert [o['number'] for o in q['sourceOptions']] == [1,2,3,4,5], qid
for before in old['questions']:
    after = by_id[before['id']]
    for key in ['text','rawText','image','thumbnail','answer','sourceMarkedAnswer','answerStatus','summary','steps','statements','options','textCorrections','reviewNotes']:
        assert before.get(key) == after.get(key), (before['id'],key)
corrected = by_id['2708']
assert corrected['sourceText'] == corrected['text'], '2708 auxiliary source text reverted to the superseded version'
assert '㉡과 ㉢은 동시에 참일 수' in corrected['sourceStem'], '2708 ㄱ references must match the corrected source'
assert 'ㄷ. ㉣은 참이고' in corrected['sourceStem'], '2708 ㄷ premise must match the corrected source'
print(f'PASS: {len(qs)} originals/texts/analyses, {sum(len(q["options"]) for q in qs)} option explanations, {len(images)} bundled images and 40 preserved 2027 originals.')
