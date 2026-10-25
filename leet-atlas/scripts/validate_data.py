"""Fail on missing source assets, questions, verdicts, tag references or provenance."""
from pathlib import Path
import json,hashlib,collections
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
d=json.loads((ROOT/'data/2027.json').read_text());qs=d['questions'];tax=d['taxonomy'];ids={t['id'] for t in tax}
assert [q['id'] for q in qs]==[f'27{n:02}' for n in range(1,41)]
assert len(ids)==len(tax)
expected=[5,3,3,4,5,1,1,3,3,1,2,4,5,5,1,2,1,2,5,4,2,1,5,1,1,1,2,3,1,4,3,3,2,4,3,3,3,1,4,1]
assert [q['sourceMarkedAnswer'] for q in qs]==expected
for q in qs:
 assert q['year']==2027 and q['sourcePage']==337+(q['number']-1)//2
 assert q['text'].lstrip().startswith(str(q['number'])+'.')
 assert q['originalExtractedText'] and q['rawText']
 assert '\ufffd' not in q['text']
 assert not any(0xe000<=ord(c)<=0xf8ff for c in q['text']), (q['id'],'PUA in display text')
 assert q['tags'] and set(q['tags'])<=ids
 for field in ['domains','fields','subjects','types','logic']:
  assert q[field], (q['id'],field)
 assert [o['number'] for o in q['options']]==list(range(1,6))
 assert sum(o['correct'] for o in q['options'])==1
 assert q['options'][q['answer']-1]['correct']
 assert all(len(o['explanation'])>=20 for o in q['options'])
 assert all(isinstance(s['verdict'],bool) and len(s['explanation'])>=20 for s in q['statements'])
 assert len(q['steps'])>=3 and len(q['summary'])>=30
 for key in ['image','thumbnail']:
  im=Image.open(ROOT/q[key]);im.verify()
 assert (ROOT/'data'/f'{q["id"]}.txt').exists()
 for tag in q['logic']:
  assert q['tagReasons'].get(tag), (q['id'],'logic tag without reason',tag)
 assert q['answerStatus']=='source-and-solution-agree'
 if q['id']=='2708':
  assert q['confidence']=='high' and q['answer']==3
  assert [s['label'] for s in q['statements'] if s['verdict']]==['ㄱ','ㄴ']
  assert '㉡과 ㉢은 동시에 참일 수' in ' '.join(q['text'].split())
  assert '㉣은 참이고 ㉤은 거짓이라면' in ' '.join(q['text'].split())
for t in tax:
 assert t['description']
 assert t['count']==sum(t['id'] in q['tags'] for q in qs)
assert len({(t['axis'],t['label']) for t in tax})==len(tax)
print(f'PASS: {len(qs)} questions, {sum(len(q["options"]) for q in qs)} option explanations, {len(tax)} tags, 80 valid images.')
assert d['exam'].get('conflictQuestionIds',[])==[]
for q in qs:
 for tid in q['tags']:
  t=next(t for t in tax if t['id']==tid)
  if t['axis']!='year':assert q['tagReasons'].get(t['label']), (q['id'],t['label'])
fields=[t for t in tax if t['axis']=='field']
assert fields and any(t['label']=='정보과학' and t['count']==0 for t in fields)
assert all(t.get('parentDomain') for t in fields)
print('Updated 2708: ㄱ·ㄴ true, answer ③. Field catalog and per-tag reasons verified.')
