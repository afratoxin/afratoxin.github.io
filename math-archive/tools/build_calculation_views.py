"""Build inline math-only calculation traces from locally available EBSi PDFs.

The published images retain mathematical notation only. They do not contain
the source's explanatory paragraphs, diagrams, or PDF pages.
"""
from __future__ import annotations

import argparse
import collections
import io
import json
import math
from pathlib import Path
import re

import fitz
from PIL import Image, ImageChops, ImageDraw

from import_ebsi import exam_id
from build_archive import ROOT

WIDTH = 360
SCALE = 1.62
DIGITS = str.maketrans({
    **{chr(0xe034 + i): value for i, value in enumerate('1234567890')},
    **dict(zip('０１２３４５６７８９', '0123456789')),
})
INTENT = re.compile(r'출\s*제\s*의\s*도')
SOLUTION = re.compile(r'정\s*답\s*풀\s*이|(?<!다른 )^\s*\[?\s*풀\s*이\s*\]?\s*:?$')
ANSWER = re.compile(r'^\s*정\s*답\s*[:：]?\s*([①②③④⑤]|\d{1,3})[.!]?\s*$')
MATH_FONT = re.compile(r'HyhwpEQ', re.I)
MATH_PUNCTUATION = frozenset('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-×÷=<>≤≥∩∪∠√|·.,()[]{}!→∞πσμ′″%:↗↘−ⅰⅱⅲⅳⅤⅠⅡⅢⅣ')


def normalize(text):
    return (text.translate(DIGITS).replace('㱲㛲㘮⊚', '출제의도')
            .replace('㛫⇋䍖㙊', '정답풀이').replace('㛫⇋', '정답').strip())


def page_columns(page):
    columns = [[], []]
    for block in page.get_text('rawdict')['blocks']:
        for line in block.get('lines', []):
            x0, top, x1, bottom = line['bbox']
            if not 42 < top < 785:
                continue
            text = normalize(''.join(c['c'] for s in line['spans'] for c in s['chars']))
            side = int((x0 + x1) / 2 >= page.rect.width / 2)
            columns[side].append((top, bottom, x0, text, line))
    return [sorted(col, key=lambda line: (line[0], line[2])) for col in columns]


def question_anchors(columns):
    anchors = []
    for col, rows in enumerate(columns):
        for row, (top, _, x, text, _) in enumerate(rows):
            if not INTENT.search(text):
                continue
            number = re.search(r'(\d{1,2})\s*\.', text)
            if not number:
                neighbors = rows[max(0, row - 6):row + 7]
                for neighbor in neighbors:
                    if abs(neighbor[0] - top) < 5 and neighbor[2] <= x + 6:
                        candidate = re.fullmatch(r'(\d{1,2})\s*\.', neighbor[3])
                        if candidate:
                            number = candidate
            if number:
                anchors.append((int(number[1]), col, row))
    return anchors


def solution_rows(columns, anchors, index, answer, question_id):
    _, first_column, first_row = anchors[index]
    if index + 1 < len(anchors):
        _, last_column, last_row = anchors[index + 1]
    else:
        last_column, last_row = len(columns) - 1, len(columns[-1])
    rows = []
    for col in range(first_column, last_column + 1):
        start = first_row + 1 if col == first_column else 0
        end = last_row if col == last_column else len(columns[col])
        rows.extend((col, line) for line in columns[col][start:end])
    start = next((i for i, (_, line) in enumerate(rows) if SOLUTION.search(line[3])), None)
    if question_id == '2021-06-a-26' and start is None:
        start = next(i for i, (_, line) in enumerate(rows) if line[3].endswith('?'))
    if start is None:
        raise ValueError(f'No solution opening for {question_id}')
    for i, (col, (top, _, x, text, _)) in enumerate(rows[start + 1:], start + 1):
        match = ANSWER.fullmatch(text)
        if match and match[1] == answer:
            return rows[start + 1:i]
        if text == '정답':
            candidates = [line[3] for c, line in rows[max(start + 1, i - 5):i + 6]
                          if c == col and abs(line[0] - top) < 3 and line[2] > x]
            if answer in candidates:
                return rows[start + 1:i]
    raise ValueError(f'No matching solution answer for {question_id}')


def equation_font(span):
    return MATH_FONT.search(span['font']) or any(
        '\ue000' <= c['c'] <= '\ue1ff' for c in span['chars'])


def math_boxes(line, fonts):
    spans = line['spans']
    equation_chars = [c for span in spans if span['font'] in fonts
                      for c in span['chars'] if
                      '\ue000' <= c['c'] <= '\ue1ff' or c['c'] in MATH_PUNCTUATION]
    if not equation_chars:
        return []
    boxes = [c['bbox'] for c in equation_chars]
    for span in spans:
        if span['font'] in fonts:
            continue
        for c in span['chars']:
            if c['c'] not in MATH_PUNCTUATION:
                continue
            x0, _, x1, _ = c['bbox']
            if any(max(b[0] - x1, x0 - b[2]) < 2.8 for b in boxes):
                boxes.append(c['bbox'])
    return boxes


def math_strip(page_image, rows, left, fonts):
    boxes = [box for row in rows for box in math_boxes(row, fonts)]
    if not boxes:
        return None
    top = max(0, math.floor(min(b[1] for b in boxes) * SCALE) - 2)
    bottom = min(page_image.height, math.ceil(max(b[3] for b in boxes) * SCALE) + 2)
    right = min(page_image.width, math.ceil(max(b[2] for b in boxes) * SCALE) + 2)
    left = max(0, min(left, math.floor(min(b[0] for b in boxes) * SCALE)))
    source = page_image.crop((left, top, right, bottom))
    mask = Image.new('1', source.size)
    draw = ImageDraw.Draw(mask)
    for x0, y0, x1, y1 in boxes:
        draw.rectangle((math.floor(x0 * SCALE) - left, math.floor(y0 * SCALE) - top,
                        math.ceil(x1 * SCALE) - left, math.ceil(y1 * SCALE) - top), fill=1)
    cropped = Image.composite(source, Image.new('L', source.size, 255), mask)
    ink = ImageChops.invert(cropped).getbbox()
    if not ink:
        return None
    return cropped.crop((0, max(ink[1] - 2, 0), cropped.width, min(ink[3] + 2, cropped.height)))


def render_trace(document, rows, images):
    strips = []
    fonts = {span['font'] for _, (_, _, _, _, line) in rows
             for span in line['spans'] if equation_font(span)}
    by_column = collections.defaultdict(list)
    for col, (_, _, _, _, line) in rows:
        if math_boxes(line, fonts):
            by_column[col].append(line)
    for col, lines in by_column.items():
        page_number, side = divmod(col, 2)
        page = document[page_number]
        if page_number not in images:
            pixmap = page.get_pixmap(matrix=fitz.Matrix(SCALE, SCALE), colorspace=fitz.csGRAY, alpha=False)
            images[page_number] = Image.frombytes('L', (pixmap.width, pixmap.height), pixmap.samples)
        left = int((72 if side == 0 else page.rect.width / 2 + 7) * SCALE)
        groups = []
        for line in lines:
            if groups and line['bbox'][1] - groups[-1][1] < 2.6:
                members, bottom = groups[-1]
                members.append(line)
                groups[-1] = (members, max(bottom, line['bbox'][3]))
            else:
                groups.append(([line], line['bbox'][3]))
        for group, _ in groups:
            strip = math_strip(images[page_number], group, left, fonts)
            if strip:
                strips.append(strip)
    if not strips:
        return None
    width = max(WIDTH, max(strip.width for strip in strips) + 14)
    trace = Image.new('L', (width, 10 + sum(strip.height + 4 for strip in strips)), 255)
    top = 5
    for strip in strips:
        trace.paste(strip, (7, top))
        top += strip.height + 4
    return trace


def local_papers(directory):
    for meta in sorted(directory.glob('*-solution-meta.json')):
        exam = exam_id(meta.name[:9])
        info = json.loads(meta.read_text())
        for document in info['docs']:
            name = document['name']
            suffix = '' if name == 'combined' else '-a' if ('가형' in name or '수학가.' in name) else '-b'
            yield exam + suffix, directory / document['pdf']


def save_atlas(exam, traces, destination, records):
    width = max(trace.width for _, trace in traces)
    height = sum(trace.height + 2 for _, trace in traces)
    assert height < 16384, (exam, height)
    atlas = Image.new('L', (width, height), 255)
    top = 0
    offsets = {}
    for question_id, trace in traces:
        atlas.paste(trace, (0, top))
        offsets[question_id] = top
        top += trace.height + 2
    data = io.BytesIO()
    atlas.save(data, format='WEBP', lossless=True, method=4)
    suffix = 'webp'
    if not data.getbuffer().nbytes:
        suffix = 'png'
        atlas.save(data, format='PNG', optimize=True)
    with Image.open(data) as check:
        assert check.size == (width, height)
        check.verify()
    filename = f'solution-{exam}.{suffix}'
    (destination / filename).write_bytes(data.getvalue())
    for question_id, trace in traces:
        records[question_id]['calculation'] = {
            'image': f'assets/{filename}', 'top': offsets[question_id],
            'width': width, 'height': trace.height, 'imageHeight': height,
        }


def save_exam(exam, traces, destination, records):
    batch = []
    height = 0
    part = 1
    for question_id, trace in traces:
        if batch and height + trace.height + 2 >= 16000:
            save_atlas(f'{exam}-{part}', batch, destination, records)
            batch, height = [], 0
            part += 1
        batch.append((question_id, trace))
        height += trace.height + 2
    save_atlas(f'{exam}-{part}', batch, destination, records)


def build(directory, catalog_path):
    catalog = json.loads(catalog_path.read_text())
    records = catalog['items']
    required = {key for key, value in records.items() if not value.get('steps')}
    for exam, path in local_papers(directory):
        wanted = [key for key in sorted(required) if key.rsplit('-', 1)[0] == exam]
        if not wanted:
            continue
        traces = []
        with fitz.open(path) as document:
            columns = [column for page in document for column in page_columns(page)]
            anchors = question_anchors(columns)
            images = {}
            for question_id in wanted:
                number = int(question_id.rsplit('-', 1)[1])
                index = next(i for i, a in enumerate(anchors) if a[0] == number)
                rows = solution_rows(columns, anchors, index, records[question_id]['answer'], question_id)
                trace = render_trace(document, rows, images)
                if trace is None:
                    raise ValueError(f'No calculation was extracted for {question_id}')
                traces.append((question_id, trace))
        save_exam(exam, traces, ROOT / 'assets', records)
    assert {key for key, value in records.items() if value.get('calculation')} == required
    for value in records.values():
        value.pop('reference', None)
    catalog_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(records) - len(required)} worked explanations, {len(required)} inline calculation traces')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', type=Path)
    args = parser.parse_args()
    build(args.directory, ROOT / 'data/solutions.json')
