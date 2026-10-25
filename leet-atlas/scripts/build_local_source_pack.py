"""Build one PRIVATE text-and-image import from locally held source material.

The result must stay outside the public project. No original passages, images,
PDF pages, or generated bundles belong in the public repository.
"""
from __future__ import annotations

import argparse
import base64
import copy
import io
import json
import os
import re
import tempfile
import unicodedata
from pathlib import Path

from PIL import Image

MAX_PACK_BYTES = 64 * 1024 * 1024
MAX_RECORD_BYTES = 2 * 1024 * 1024
PROJECT_ROOT = Path(__file__).resolve().parent.parent
REPOSITORY_ROOT = next((directory for directory in (PROJECT_ROOT, *PROJECT_ROOT.parents)
                        if (directory / '.git').exists()), PROJECT_ROOT)


def serialize(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'))


def index_questions(data, label):
    rows = data.get('questions') if isinstance(data, dict) else None
    if not isinstance(rows, list):
        raise ValueError(f'{label}: questions array is required')
    result = {}
    for question in rows:
        qid = question.get('id') if isinstance(question, dict) else None
        if not isinstance(qid, str) or not re.fullmatch(r'[A-Za-z0-9_-]+', qid) or qid in result:
            raise ValueError(f'{label}: question IDs must be safe, unique and nonempty')
        for key in ('number', 'sourcePage'):
            if type(question.get(key)) is not int or question[key] < 1:
                raise ValueError(f'{qid}: {key} must be a positive integer')
        if not isinstance(question.get('examKey'), str) or not question['examKey']:
            raise ValueError(f'{qid}: examKey is required')
        result[qid] = question
    return result


def validate_text(text, question):
    qid = question['id']
    if not isinstance(text, str) or not text.strip() or len(text) > 100000:
        raise ValueError(f'{qid}: missing or excessive text')
    if '\ufffd' in text or any(unicodedata.category(char) == 'Co' for char in text):
        raise ValueError(f'{qid}: unresolved source glyphs')
    if not re.match(rf"^{question['number']}\.", text.lstrip()):
        raise ValueError(f'{qid}: incorrect question boundary')
    if any(marker not in text for marker in '①②③④⑤'):
        raise ValueError(f'{qid}: five option markers are required')


def image_data_url(path, qid):
    try:
        if path.stat().st_size > MAX_RECORD_BYTES:
            raise ValueError(f'{qid}: image exceeds 2 MiB')
        payload = path.read_bytes()
        with Image.open(io.BytesIO(payload)) as image:
            if image.format != 'WEBP':
                raise ValueError(f'{qid}: a real WEBP image is required')
            image.verify()
        with Image.open(io.BytesIO(payload)) as image:
            image.load()
            if not 0 < image.width <= 12000 or not 0 < image.height <= 12000 or image.width * image.height > 50000000:
                raise ValueError(f'{qid}: excessive image dimensions')
    except (OSError, ValueError, Image.DecompressionBombError) as error:
        raise ValueError(f'{qid}: missing, invalid or excessive WEBP image') from error
    return 'data:image/webp;base64,' + base64.b64encode(payload).decode('ascii')


def validate_source_metadata(text_pack, local_ids):
    source = text_pack.get('source')
    if not isinstance(source, dict) or not isinstance(source.get('name'), str) or not source['name'].strip() or \
            not isinstance(source.get('sha256'), str) or not re.fullmatch(r'[0-9a-fA-F]{64}', source['sha256']) or \
            type(source.get('pageCount')) is not int or source['pageCount'] < 1:
        raise ValueError('Text pack must identify its source PDF, SHA-256 and page count')
    for field in ('correctedQuestionIds', 'diagramQuestionIds'):
        ids = text_pack.get(field, [])
        if not isinstance(ids, list) or not all(isinstance(qid, str) and qid in local_ids for qid in ids) or len(ids) != len(set(ids)):
            raise ValueError(f'{field}: unique local question IDs are required')


def build_pack(text_pack, registry, image_dir):
    if not isinstance(text_pack, dict) or text_pack.get('schemaVersion') != 1 or text_pack.get('kind') != 'leet-atlas-local-text':
        raise ValueError('A schemaVersion 1 leet-atlas-local-text pack is required')
    known = index_questions(registry, 'registry')
    originals = index_questions(text_pack, 'text pack')
    local_ids = {qid for qid, question in known.items() if question.get('sourceAccess') == 'local-only'}
    if len(known) != 755 or len(local_ids) != 715:
        raise ValueError('Registry must contain exactly 755 questions, including 715 local-only questions')
    if set(originals) != local_ids:
        missing, extra = local_ids - set(originals), set(originals) - local_ids
        raise ValueError(f'Text pack IDs must match the 715 local questions exactly (missing={len(missing)}, extra={len(extra)})')
    if any(question['examKey'] != '2027' for qid, question in known.items() if qid not in local_ids):
        raise ValueError('The 40 published 2027 questions must remain outside this private bundle')
    validate_source_metadata(text_pack, local_ids)
    records, exams = [], {}
    for qid, question in known.items():
        if qid not in local_ids:
            continue
        original = originals[qid]
        if any(original[key] != question[key] for key in ('examKey', 'number', 'sourcePage')):
            raise ValueError(f'{qid}: exam, question number or source page mismatch')
        if question['sourcePage'] > text_pack['source']['pageCount']:
            raise ValueError(f'{qid}: source page exceeds the source PDF page count')
        validate_text(original.get('text'), question)
        record = {key: original[key] for key in ('id', 'examKey', 'number', 'sourcePage', 'text')}
        record['image'] = image_data_url(Path(image_dir) / f'{qid}.webp', qid)
        if len(serialize(record).encode('utf-8')) > MAX_RECORD_BYTES:
            raise ValueError(f'{qid}: combined text and image exceeds 2 MiB')
        records.append(record)
        exam = exams.setdefault(question['examKey'], {
            'key': question['examKey'], 'label': question.get('examLabel', question['examKey']), 'questionCount': 0,
        })
        exam['questionCount'] += 1
    pack = {
        'schemaVersion': 1, 'kind': 'leet-atlas-local-sources',
        'source': copy.deepcopy(text_pack['source']),
        'coverage': {'total': 755, 'included': 40, 'importable': 715},
        'counts': {'registry': 755, 'public': 40, 'questions': 715, 'texts': 715, 'images': 715},
        'exams': list(exams.values()),
        'correctedQuestionIds': list(text_pack.get('correctedQuestionIds', [])),
        'diagramQuestionIds': list(text_pack.get('diagramQuestionIds', [])),
        'notes': ['본문과 원문 이미지는 이 브라우저에만 저장합니다.',
                  '공개된 2027학년도 40문항은 기존 자료를 그대로 사용합니다.'],
        'questions': records,
    }
    if len((serialize(pack) + '\n').encode('utf-8')) > MAX_PACK_BYTES:
        raise ValueError('Source bundle exceeds the browser import limit of 64 MiB')
    return pack


def validate_output_path(output):
    output = Path(output).resolve()
    if output == REPOSITORY_ROOT or REPOSITORY_ROOT in output.parents:
        raise ValueError('Private source bundles must be written outside the public repository')
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--text-pack', required=True, type=Path)
    parser.add_argument('--registry', required=True, type=Path)
    parser.add_argument('--image-dir', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    try:
        output = validate_output_path(args.output)
        load = lambda path: json.loads(path.read_text(encoding='utf-8'))
        pack = build_pack(load(args.text_pack), load(args.registry), args.image_dir)
        payload = (serialize(pack) + '\n').encode('utf-8')
        output.parent.mkdir(parents=True, exist_ok=True)
        temporary_path = None
        try:
            with tempfile.NamedTemporaryFile(dir=output.parent, prefix='.leet-sources-', delete=False) as temporary:
                temporary_path = Path(temporary.name)
                temporary.write(payload)
            os.replace(temporary_path, output)
        finally:
            if temporary_path and temporary_path.exists():
                temporary_path.unlink()
        print(json.dumps({'questions': len(pack['questions']), 'examCount': len(pack['exams']),
                          'bytes': len(payload), 'counts': pack['counts'],
                          'correctedQuestions': len(pack['correctedQuestionIds'])}, ensure_ascii=False))
    except (OSError, ValueError) as error:
        parser.exit(1, f'{error}\n')


if __name__ == '__main__':
    main()
