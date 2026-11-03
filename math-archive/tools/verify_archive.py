"""Verify complete question inventories, source image bounds, and metadata."""
import collections,json,re
from pathlib import Path
from PIL import Image
from build_archive import A_CALCULUS, ROOT

m=json.loads((ROOT/'data'/'questions.json').read_text())
questions=m['items']
assert len(questions)==686 and len({q['id'] for q in questions})==686
assert len(m['exams'])==24 and not m['warnings']
for ex in m['exams']:
    ids={q['number'] for q in questions if q['exam_id']==ex['id']}
    assert ids==set(range(1,31))-A_CALCULUS.get(ex['id'],set()),ex['id']
    assert len(ids)==ex['count'],ex['id']
atlases={}
for q in questions:
    a=q['original'];name=a['atlas']
    if name not in atlases:
        im=Image.open(ROOT/name);im.verify()
        atlases[name]=Image.open(ROOT/name)
    im=atlases[name];assert im.size==(a['atlas_width'],a['atlas_height']),q['id']
    assert 0<=a['y']<a['y']+a['height']<=im.height and 0<a['width']<=im.width,q['id']
    assert q['points'] in (2,3,4) and q['statement_latex'].startswith(f'{q["number"]}. '),q['id']
    assert q['statement_latex'].count('$')%2==0 and not re.search('[\ue000-\uf8ff]',q['statement_latex']),q['id']
    assert q['concepts'] and q['classification_status']!='분류 초안',q['id']
    if q['subject']=='확률과 통계':assert q['textbook_chapters'],q['id']
print('Inventory, numbering, points, and original image bounds passed.')
print(dict(collections.Counter(q['subject'] for q in questions)))
print(f'{len(atlases)} valid source image atlases')
