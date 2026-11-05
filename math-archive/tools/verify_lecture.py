"""Verify narration coverage and preserve mathematical/user-facing contracts."""
import json
from pathlib import Path
import re
from lecture_voice import speak
ROOT=Path(__file__).resolve().parents[1]

base=json.loads((ROOT/'data/solutions.json').read_text())
geo=json.loads((ROOT/'data/geometry.json').read_text())
assert len(base['items'])==297
assert sum(len(x['steps']) for x in base['items'].values())==795
assert len(geo['items'])==71
maths=lambda text:re.findall(r'\$[^$]*\$',text)
count=0
for dataset in [base,geo]:
    for qid,item in dataset['items'].items():
        t=item['teaching'];n=len(item['steps'])
        assert len(t['focus'])==n,qid
        assert set(t['approach'])==set(map(str,range(n))),qid
        assert set(t['stage_body'])==set(map(str,range(n))),qid
        key=str(t['key_step'])
        assert 0<=t.get('key_paragraph',0)<len(t['stage_body'][key]),qid
        for text in [item['idea'],*item['steps']]:
            assert text.count('$')%2==0,(qid,text)
            assert not re.search('[\x00-\x08\x0b\x0c\ue000-\uf8ff]',text),qid
            assert not re.search(r'\d+\s*/\s*\d+',text),qid
            assert not re.search(r'\\(?:binom|tbinom)\b',text),qid
            assert all(not re.search('[가-힣]',m) for m in maths(text)),qid
            assert maths(speak(text))==maths(text),qid
            count+=1
        for i in range(n):
            j=str(i)
            assert t['stage_body'][j] and t['stage_result'][j]==t['stage_body'][j][-1],(qid,j)
    if dataset is base:
        for qid,item in dataset['items'].items():
            t=item['teaching']
            for indices in t['focus']:assert all(0<=i<len(t['sources']) for i in indices),qid

q=base['items']['2027-09-15']
assert any('(2x+1)f(x)' in r['quote'] for r in q['teaching']['sources'])
assert '(2ax+1)' not in base['question_overrides']['2027-09-15']['statement_latex']
print(f'{count} lecture texts checked: 297 solutions, 795 stages, 71 geometric readings; math notation and source references valid.')
