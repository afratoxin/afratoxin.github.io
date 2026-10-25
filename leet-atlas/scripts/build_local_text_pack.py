"""Build a browser-only text import from a locally held, complete source archive.

No original passages or generated import files belong in the public repository.
Existing published texts stay authoritative; this builder fills local-only rows.
"""
from __future__ import annotations

import argparse
import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path

MAX_BYTES = 8 * 1024 * 1024


def index_questions(data, label):
    rows = data.get('questions') if isinstance(data, dict) else None
    if not isinstance(rows, list):
        raise ValueError(f'{label}: questions array is required')
    ids = [q.get('id') for q in rows]
    if not all(isinstance(qid, str) and qid for qid in ids) or len(ids) != len(set(ids)):
        raise ValueError(f'{label}: question IDs must be unique and nonempty')
    return {q['id']: q for q in rows}


def validate_text(text, question):
    qid = question['id']
    if not isinstance(text, str) or not text.strip() or len(text) > 100000:
        raise ValueError(f'{qid}: missing or excessive text')
    if '\ufffd' in text or any(unicodedata.category(c) == 'Co' for c in text):
        raise ValueError(f'{qid}: unresolved source glyphs')
    if not re.match(rf"^{question['number']}\.", text.lstrip()):
        raise ValueError(f'{qid}: incorrect question boundary')
    if any(marker not in text for marker in '①②③④⑤'):
        raise ValueError(f'{qid}: five option markers are required')


def build_pack(source, registry, *, source_name=None, source_sha256=None,
               page_count=None, corrections=()):
    originals = index_questions(source, 'source')
    known = index_questions(registry, 'registry')
    if set(originals) != set(known):
        raise ValueError('Source and registry must contain exactly the same IDs')
    importable = {qid for qid, q in known.items() if q.get('sourceAccess') == 'local-only'}
    edits = defaultdict(list)
    for correction in corrections:
        qid = correction.get('id')
        if qid not in importable or not correction.get('old') or not isinstance(correction.get('new'), str):
            raise ValueError(f'{qid}: correction must target an importable question')
        count = correction.get('count', 1)
        if type(count) is not int or count < 1:
            raise ValueError(f'{qid}: correction count must be a positive integer')
        edits[qid].append(correction)

    records, exams, diagrams = [], {}, []
    for qid, question in known.items():
        if qid not in importable:
            continue
        original = originals[qid]
        if any(original.get(key) != question.get(key) for key in ('examKey', 'number', 'sourcePage')):
            raise ValueError(f'{qid}: exam, question number or page mismatch')
        text = original.get('text')
        for correction in edits[qid]:
            if not isinstance(text, str) or text.count(correction['old']) != correction.get('count', 1):
                raise ValueError(f'{qid}: stale or ambiguous correction')
            text = text.replace(correction['old'], correction['new'])
        validate_text(text, question)
        records.append({key: text if key == 'text' else question[key]
                        for key in ('id', 'examKey', 'number', 'sourcePage', 'text')})
        exam = exams.setdefault(question['examKey'], {
            'key': question['examKey'], 'label': question.get('examLabel', question['examKey']),
            'questionCount': 0,
        })
        exam['questionCount'] += 1
        if any(option.get('contentType') == 'diagram' for option in original.get('sourceOptions', [])):
            diagrams.append(qid)
    pack = {
        'schemaVersion': 1, 'kind': 'leet-atlas-local-text',
        'coverage': {'total': len(known), 'included': len(known) - len(importable), 'importable': len(records)},
        'exams': list(exams.values()),
        'correctedQuestionIds': [qid for qid in known if edits[qid]],
        'diagramQuestionIds': diagrams,
        'notes': ['기존 제공 본문은 보존하고 비어 있는 문항 본문만 연결합니다.',
                  '그래프·도식·그림 선택지는 원본 PDF와 함께 확인해야 합니다.',
                  '본문은 사이트의 내 본문 불러오기에서 이 브라우저에만 적용합니다.'],
        'questions': records,
    }
    origin = {key: value for key, value in [('name', source_name), ('sha256', source_sha256), ('pageCount', page_count)] if value is not None}
    if origin:
        pack['source'] = origin
    if len((json.dumps(pack, ensure_ascii=False) + '\n').encode('utf-8')) > MAX_BYTES:
        raise ValueError('Text pack exceeds the browser import limit of 8 MiB')
    return pack


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', required=True, type=Path)
    parser.add_argument('--registry', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--corrections', type=Path)
    parser.add_argument('--source-name')
    parser.add_argument('--source-sha256')
    parser.add_argument('--page-count', type=int)
    args = parser.parse_args()
    load = lambda path: json.loads(path.read_text(encoding='utf-8'))
    corrections = load(args.corrections) if args.corrections else []
    pack = build_pack(load(args.input), load(args.registry), corrections=corrections,
                      source_name=args.source_name, source_sha256=args.source_sha256,
                      page_count=args.page_count)
    payload = json.dumps(pack, ensure_ascii=False, separators=(',', ':')) + '\n'
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(payload, encoding='utf-8')
    print(json.dumps({'questions': len(pack['questions']), 'examCount': len(pack['exams']),
                      'bytes': len(payload.encode('utf-8')), 'coverage': pack['coverage'],
                      'correctedQuestions': len(pack['correctedQuestionIds']),
                      'diagramQuestions': pack['diagramQuestionIds']}, ensure_ascii=False))


if __name__ == '__main__':
    main()
