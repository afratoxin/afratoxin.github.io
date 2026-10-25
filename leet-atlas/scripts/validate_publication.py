"""Validate the authorized full-content or classification-only publication mode."""
import json
import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT/'data/archive.json').read_text())
if data.get('publicationMode') == 'explanations-only':
    runpy.run_path(str(ROOT/'scripts/validate_explanations_archive.py'))
    raise SystemExit(0)
if data.get('publicationMode') == 'full-content':
    runpy.run_path(str(ROOT/'scripts/validate_full_archive.py'))
    raise SystemExit(0)
assert data.get('publicationMode') == 'metadata-only', '공개 데이터는 분류 정보 전용이어야 합니다.'
assert len(data['questions']) == 755
for q in data['questions']:
    if q['examKey'] == '2027':
        continue
    assert q.get('sourceAccess') == 'local-only', q['id']
    assert not any(q.get(key) for key in ['text','rawText','originalExtractedText','image','thumbnail','sourcePdf','assetPath','thumbnailPath']), q['id']
    assert q['title'] and q['tagReasons'] and q['sourcePage'], q['id']
for e in data['exams']:
    if e['key'] != '2027':
        assert not e.get('sourcePdf'), e['key']
assert 'data:image' not in json.dumps(data), '파생 이미지가 공개 데이터에 포함돼 있습니다.'
print('PASS: public archive contains 755 classifications and no newly attached source payloads; existing 2027 publication is preserved.')
