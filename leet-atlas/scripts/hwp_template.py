"""Fill the user's one-page question/solution HWP template using Hancom Automation.

Windows + installed Hancom Hangeul, pywin32, pypdf and reportlab are required.
The template itself remains a local input; it is not included in this repository.
"""
from __future__ import annotations
import argparse
import copy
import hashlib
import json
from pathlib import Path
import re
import site
import tempfile
import shutil
import gc
import xml.etree.ElementTree as E

CIRCLES = ['', '①', '②', '③', '④', '⑤']


def compatible_fonts(root):
    changed = []
    for font in root.findall('.//FONT'):
        if font.get('Type', '').lower() == 'hft':
            previous = font.get('Name', '')
            font.set('Name', '바탕' if '명조' in previous else '돋움')
            font.set('Type', 'ttf')
            changed.append(previous)
    return sorted(set(changed))


def validate_rendered_text(text, document):
    visible = re.sub(r'\s+', '', text)
    outer = document.find('.//TABLE')
    cells = [c for row in outer.findall('ROW') for c in row.findall('CELL')
             if c.get('RowAddr') == '2' and c.get('ColAddr') in ['0', '6']]
    # Check the final native layout, including publication overrides and table
    # cells. Raw draft strings may have different labels/line breaks.
    required = [n.text for cell in cells for n in cell.iter('CHAR') if n.text and n.text.strip()]
    if not required:
        raise ValueError('검증할 문항·해설 본문이 없습니다.')
    for value in required:
        if re.sub(r'\s+', '', value) not in visible:
            raise ValueError('문서에서 문항·해설 글꼴 또는 내용이 누락되었습니다.')


def validate_output_paths(template, input_file, output, overwrite=False):
    template, input_file, output = Path(template).resolve(), Path(input_file).resolve(), Path(output).resolve()
    if output.suffix.lower() != '.hwp':
        raise ValueError('출력 파일 확장자는.hwp여야 합니다.')
    targets = [output.with_suffix(suffix).resolve() for suffix in ['.hwp','.hwpx','.pdf','.png','.txt']]
    if any(p in [template, input_file] for p in targets):
        raise ValueError('원본과 다른 출력 경로를 지정해 주세요.')
    if not overwrite and any(p.exists() for p in targets):
        raise FileExistsError('관련 출력 파일이 이미 있습니다. 다른 이름을 지정하거나 --overwrite를 사용하세요.')


def choice_text(value, index):
    return re.sub(r'^(?:' + CIRCLES[index] + r'|' + str(index) + r'[.)])\s+', '', str(value).strip())


def numbered_question(question, number):
    question = question.strip()
    return question if re.match(r'^\d+[.)]\s*', question) else f'{number}. {question}'


def question_text(draft, number=1):
    choices = [choice_text(value, i) for i, value in enumerate(draft['choices'], 1)]
    return f"{numbered_question(draft['question'], number)}\n\n{draft['passage'].strip()}\n\n" + '\n'.join(f'{CIRCLES[i]} {v}' for i, v in enumerate(choices, 1)) + '\n'


def build_document(source, draft, publication=None, filename='완성문항.hwp', number=1):
    publication = publication or {}
    if len(draft.get('choices', [])) != 5 or draft.get('answer') not in range(1, 6):
        raise ValueError('다섯 선택지와 정답 번호1~5가 필요합니다.')
    for key in ['title', 'question', 'passage', 'solution']:
        if not isinstance(draft.get(key), str) or not draft[key].strip():
            raise ValueError(f'{key} 내용이 필요합니다.')
    root = copy.deepcopy(source)
    # Template document utilities are not question content. In particular,
    # OnDocument_New handlers must not execute during XML import or delivery.
    for parent in root.iter():
        for child in list(parent):
            if child.tag == 'SCRIPTCODE': parent.remove(child)
    outer = root.find('.//TABLE')
    if outer is None:
        raise ValueError('지원하는1페이지1문항 템플릿의 표를 찾지 못했습니다.')
    cells = {(int(c.get('RowAddr', -1)), int(c.get('ColAddr', -1))): c for r in outer.findall('ROW') for c in r.findall('CELL')}
    if not {(2, 0), (2, 5), (2, 6)}.issubset(cells):
        raise ValueError('왼쪽 문항·중앙 눈금·오른쪽 해설의 템플릿 구조가 필요합니다.')
    styles = {s.get('Id'): s.get('Name') for s in root.findall('.//STYLE')}

    def text(node):
        return ''.join(node.itertext())

    def paragraph(prototype, value):
        # Direct formatting on actual sample paragraphs differs from STYLE
        # defaults. Copy both paragraph and character overrides verbatim.
        p = E.Element('P', dict(prototype.attrib))
        run = prototype.find('TEXT')
        t = E.SubElement(p, 'TEXT', dict(run.attrib) if run is not None else {})
        E.SubElement(t, 'CHAR').text = str(value)
        return p

    def with_style(scope, name, predicate=lambda p: True):
        return next(p for p in scope.iter('P') if styles.get(p.get('Style')) == name and predicate(p))

    def fill(cell, paragraphs):
        old = cell.find('PARALIST')
        attrs = dict(old.attrib) if old is not None else {'VertAlign': 'Top', 'LineWrap': 'Break'}
        if old is not None:
            cell.remove(old)
        pl = E.SubElement(cell, 'PARALIST', attrs)
        pl.extend(paragraphs)
        return pl

    left, right = cells[(2,0)], cells[(2,6)]
    left_pl, right_pl = left.find('PARALIST'), right.find('PARALIST')
    try:
        stem_proto = with_style(left_pl, '문제')
        box_carrier = next(p for p in left_pl.findall('P') if p.find('./TEXT/TABLE[@ColCount="1"]') is not None)
        box_proto = box_carrier.find('./TEXT/TABLE')
        body_proto = with_style(box_proto, '박스내용(들여쓰기)')
        bullet_proto = with_style(box_proto, '보기내용(내어쓰기)', lambda p: text(p).startswith('◦'))
        heading_proto = with_style(box_proto, '<사례견해>')
        fact_carrier = next(p for p in box_proto.iter('P') if p.find('./TEXT/TABLE') is not None)
        fact_proto = fact_carrier.find('./TEXT/TABLE')
        # A hidden memo also uses this named style. Only visible outer
        # paragraphs are choice prototypes; memo typography is unrelated.
        choice_proto = next(p for p in left_pl.findall('P') if styles.get(p.get('Style')) == '선택지')
        topic_proto = with_style(right_pl, '글 주제')
        meta_proto = next(p for p in right_pl.findall('P') if p.find('./TEXT/TABLE[@ColCount="4"]') is not None)
        comment_proto = next(p for p in right_pl.findall('P') if p.find('./TEXT/TABLE[@RowCount="3"]') is not None)
        verdict_proto = next(p for p in right_pl.findall('P') if p.find('.//RECTANGLE') is not None)
        option_proto = with_style(right_pl, '정오판단_선지', lambda p: text(p).startswith('①'))
        reason_proto = with_style(right_pl, '정오판단_설명', lambda p: bool(text(p).strip()))
    except StopIteration as exc:
        raise ValueError('원본의 문항 상자·정답 표·논평 상자·정오판단 서식을 찾지 못했습니다.') from exc

    def table(rows, widths=None):
        if not rows or not rows[0]:
            raise ValueError('비어 있는 표는 출력할 수 없습니다.')
        cols = len(rows[0])
        if any(len(row) != cols for row in rows):
            raise ValueError('표의 각 행은 같은 열 수여야 합니다.')
        t = copy.deepcopy(fact_proto)
        sample = t.find('ROW/CELL')
        sample_p = sample.find('PARALIST/P')
        width = int(t.find('SHAPEOBJECT/SIZE').get('Width'))
        weights = widths if widths is not None else [1] * cols
        if len(weights) != cols or any(v <= 0 for v in weights):
            raise ValueError('표의 열 너비가 올바르지 않습니다.')
        widths = [int(width*v/sum(weights)) for v in weights]
        widths[-1] += width-sum(widths)
        for row in t.findall('ROW'): t.remove(row)
        t.set('ColCount', str(cols)); t.set('RowCount', str(len(rows)))
        t.find('SHAPEOBJECT/SIZE').set('Height', str(int(sample.get('Height'))*len(rows)))
        for ri, values in enumerate(rows):
            row = E.SubElement(t, 'ROW')
            for ci, value in enumerate(values):
                c = copy.deepcopy(sample)
                c.set('ColAddr', str(ci)); c.set('RowAddr', str(ri)); c.set('Width', str(widths[ci]))
                fill(c, [paragraph(sample_p, value)])
                row.append(c)
        return t

    def carrier(prototype, t):
        p = paragraph(prototype, '')
        run = p.find('TEXT'); run.remove(run.find('CHAR')); run.append(t)
        return p

    # Fixed labels, memo typography and filename field remain the template's.
    header_values = {(0,1):filename, (1,1):publication.get('theme','규칙 적용'), (1,3):publication.get('author','제작 예시')}
    for address, value in header_values.items():
        if address in cells:
            cell = cells[address]
            p = cell.find('PARALIST/P')
            if address == (0,1):
                # Do not remove the automatic filename field around the text.
                chars = p.findall('./TEXT/CHAR')
                chars[0].text = filename
                for node in chars[0]: chars[0].remove(node)
                for node in chars[1:]: node.text = ''
            else: fill(cell, [paragraph(p, value)])
    stem = copy.deepcopy(stem_proto)
    for child in list(stem): stem.remove(child)
    numbered = numbered_question(draft['question'], number)
    prefix, content = re.match(r'^(\d+[.)])\s*(.*)', numbered, re.S).groups()
    for prototype, value in zip(stem_proto.findall('TEXT')[:2], [prefix, ' '+content]):
        run = E.SubElement(stem, 'TEXT', dict(prototype.attrib))
        E.SubElement(run, 'CHAR', dict(prototype.find('CHAR').attrib)).text = value
    blocks = publication.get('blocks') or [{'kind':'paragraph', 'text':p} for p in re.split(r'\n+', draft['passage'].strip()) if p.strip()]
    body = []
    for block in blocks:
        if block.get('kind') == 'table':
            body.append(carrier(fact_carrier, table(block['rows'], block.get('widths'))))
        else:
            value = block.get('text','')
            prototype = heading_proto if block.get('kind') == 'heading' else bullet_proto if value.startswith('◦') else body_proto
            body.append(paragraph(prototype, value))
    box = copy.deepcopy(box_proto)
    fill(box.find('ROW/CELL'), body)
    box.find('SHAPEOBJECT/SIZE').set('Height', box.find('ROW/CELL').get('Height'))
    content = [stem, carrier(box_carrier, box)]
    content.extend(paragraph(choice_proto, f'{CIRCLES[i]} {choice_text(v, i)}') for i, v in enumerate(draft['choices'], 1))
    fill(left, content)
    classifications = draft.get('classifications', [])
    labels = lambda axis: '·'.join(v['label'] for v in classifications if v.get('axis') == axis)
    meta = copy.deepcopy(meta_proto)
    metadata = {(0,1):CIRCLES[draft['answer']], (0,3):publication.get('difficulty','미평정'), (1,1):labels('domain'), (1,3):labels('type')}
    for row in meta.find('./TEXT/TABLE').findall('ROW'):
        for c in row.findall('CELL'):
            key = (int(c.get('RowAddr')), int(c.get('ColAddr')))
            if key in metadata: fill(c, [paragraph(c.find('PARALIST/P'), metadata[key])])
    solution = publication.get('solution', draft['solution'])
    intent = publication.get('intent', ' / '.join(draft.get('steps', [])[:2]))
    comment = copy.deepcopy(comment_proto)
    comment_rows = comment.find('./TEXT/TABLE').findall('ROW')
    title_cell = comment_rows[0].findall('CELL')[1]
    fill(title_cell, [paragraph(title_cell.find('PARALIST/P'), publication.get('commentTitle','출제 의도와 풀이'))])
    body_cell = comment_rows[-1].find('CELL')
    prototype = body_cell.find('PARALIST/P')
    fill(body_cell, [paragraph(prototype, value) for value in ([intent] if intent else []) + [p for p in solution.splitlines() if p.strip()]])
    right_paras = [paragraph(topic_proto, publication.get('topic',draft['title'])), meta, comment, copy.deepcopy(verdict_proto)]
    reasons = publication.get('optionReasons') or [a.get('reason','') for a in sorted(draft.get('optionAnalyses', []), key=lambda a:a['number'])]
    if len(reasons) != 5: raise ValueError('선택지 해설 다섯 개가 필요합니다.')
    truth = publication.get('optionTruth')
    has_truth = isinstance(truth,list) and len(truth)==5 and all(isinstance(v,bool) for v in truth)
    for i, reason in enumerate(reasons, 1):
        verdict = ('○' if truth[i-1] else '×') if has_truth else ('정답' if i==draft['answer'] else '오답')
        right_paras += [paragraph(option_proto, f'{CIRCLES[i]} {choice_text(draft["choices"][i-1], i)} ({verdict})'), paragraph(reason_proto, '↳ '+reason)]
    fill(right, right_paras)
    return root


def export(template, input_file, output, deps=None, overwrite=False, font_fallback=False):
    validate_output_paths(template, input_file, output, overwrite)
    if deps: site.addsitedir(str(Path(deps).resolve()))
    import win32com.client
    from pypdf import PdfReader
    from reportlab.pdfgen.canvas import Canvas
    template, input_file, output = Path(template).resolve(), Path(input_file).resolve(), Path(output).resolve()
    source_hash = hashlib.sha256(template.read_bytes()).hexdigest()
    payload = json.loads(input_file.read_text(encoding='utf-8-sig'))
    draft = payload.get('draft', payload); publication = payload.get('publication', {})
    output.parent.mkdir(parents=True, exist_ok=True)
    hwp = win32com.client.DispatchEx('HWPFrame.HwpObject')
    with tempfile.TemporaryDirectory(prefix='leet-hwp-', ignore_cleanup_errors=True) as temp:
        temp = Path(temp)
        if temp.resolve().parent != Path(tempfile.gettempdir()).resolve():
            raise RuntimeError('임시 작업 경로를 확인하지 못했습니다.')
        try:
            hwp.XHwpWindows.Item(0).Visible = False
            local_template = temp/'template.hwp'
            shutil.copyfile(template, local_template)
            if not hwp.Open(str(local_template), 'HWP', ''): raise RuntimeError('HWP 양식을 열지 못했습니다.')
            root = E.fromstring(hwp.GetTextFile('HWPML2X', ''))
            result = build_document(root, draft, publication, output.name)
            substitutions = compatible_fonts(result) if font_fallback else []
            hml = temp/'completed.hml'; E.ElementTree(result).write(hml, encoding='utf-16', xml_declaration=True)
            hwp.Clear(1)
            if not hwp.Open(str(hml), 'HWPML2X', ''): raise RuntimeError('완성 문서 구성을 읽지 못했습니다.')
            # Save to fresh paths: SaveAs can show an overwrite dialog even
            # during hidden automation. Existing outputs stay intact on failure.
            stage_dir = temp / 'export'
            stage_dir.mkdir()
            staged = stage_dir / output.name
            if not hwp.SaveAs(str(staged), 'HWP', ''): raise RuntimeError('HWP 저장에 실패했습니다.')
            if not hwp.SaveAs(str(staged.with_suffix('.hwpx')), 'HWPX', ''): raise RuntimeError('HWPX 저장에 실패했습니다.')
            if not hwp.Open(str(staged), 'HWP', ''): raise RuntimeError('저장한 HWP를 다시 열지 못했습니다.')
            # Hancom's plain-text exporter writes some glyphs as literal
            # entities (e.g. ◦ -> &#9702;). Reparse native XML to compare glyphs.
            reopened = E.fromstring(hwp.GetTextFile('HWPML2X', ''))
            validate_rendered_text(''.join(reopened.itertext()), result)
            page_count = hwp.PageCount
            if page_count != 1: raise RuntimeError(f'문서가{page_count}페이지입니다. 내용의 길이를 조정한 뒤 다시 출력해 주세요. 글자 크기는 자동으로 줄이지 않습니다.')
            # PrintToImage renders the entire page with native HFT fonts.
            # CreatePageImage crops this nested-table form, and native PDF
            # export loses HFT glyphs. Neither warrants changing the HWP fonts.
            action = hwp.CreateAction('PrintToImage')
            parameters = action.CreateSet(); action.GetDefault(parameters)
            png_request = stage_dir/'native-page.png'
            for key, value in {'Format':3,'FileName':str(png_request),'Range':4,'RangeCustom':'1','Resolution':160}.items():
                parameters.SetItem(key, value)
            if not action.Execute(parameters): raise RuntimeError('한글 페이지 이미지를 만들지 못했습니다.')
            images = list(stage_dir.glob('native-page*.png'))
            if len(images) != 1 or images[0].stat().st_size == 0: raise RuntimeError('한글 페이지 이미지가 올바르지 않습니다.')
            staged_png = staged.with_suffix('.png')
            shutil.move(str(images[0]), staged_png)
            # The PDF is a visual preview. The HWP/HWPX remain editable with
            # the original fonts, tables, direct formatting and form elements.
            page = result.find('.//PAGEDEF')
            width, height = int(page.get('Width'))/100, int(page.get('Height'))/100
            staged_pdf = staged.with_suffix('.pdf')
            canvas = Canvas(str(staged_pdf), pagesize=(width,height))
            canvas.drawImage(str(staged_png),0,0,width=width,height=height)
            canvas.showPage();canvas.save()
            if len(PdfReader(staged_pdf).pages) != 1: raise RuntimeError('미리보기 PDF의 페이지 수가 올바르지 않습니다.')
        finally:
            try:
                hwp.Clear(1)
                hwp.Quit()
            finally:
                hwp = None
                gc.collect()
        if hashlib.sha256(template.read_bytes()).hexdigest() != source_hash: raise RuntimeError('원본 양식이 변경되었습니다.')
        staged.with_suffix('.txt').write_text(question_text(draft), encoding='utf-8-sig')
        validate_output_paths(template, input_file, output, overwrite)
        for suffix in ['.hwp','.hwpx','.pdf','.png','.txt']:
            shutil.copyfile(staged.with_suffix(suffix), output.with_suffix(suffix))
    hwpx, preview = output.with_suffix('.hwpx'), output.with_suffix('.pdf')
    return {'hwp':str(output),'hwpx':str(hwpx),'preview':str(preview),'previewImage':str(output.with_suffix('.png')),'pages':page_count,'sourceUnchanged':True,'fontSubstitutions':substitutions}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--template', required=True); parser.add_argument('--input', required=True)
    parser.add_argument('--output', required=True); parser.add_argument('--deps'); parser.add_argument('--overwrite', action='store_true'); parser.add_argument('--compatible-fonts', action='store_true')
    args = parser.parse_args()
    print(json.dumps(export(args.template,args.input,args.output,args.deps,args.overwrite,args.compatible_fonts),ensure_ascii=False))
