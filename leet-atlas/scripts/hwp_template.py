"""Fill the user's one-page question/solution HWP template using Hancom Automation.

Windows + installed Hancom Hangeul, pywin32 and pypdf are required for export.
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
            raise ValueError('문서에서 문항·해설 글꼴 또는 내용이 누락되었습니다. --compatible-fonts로 호환 글꼴을 적용한 뒤 다시 확인하세요.')


def validate_output_paths(template, input_file, output, overwrite=False):
    template, input_file, output = Path(template).resolve(), Path(input_file).resolve(), Path(output).resolve()
    if output.suffix.lower() != '.hwp':
        raise ValueError('출력 파일 확장자는.hwp여야 합니다.')
    targets = [output.with_suffix(suffix).resolve() for suffix in ['.hwp','.hwpx','.pdf','.txt']]
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
    outer = root.find('.//TABLE')
    if outer is None:
        raise ValueError('지원하는1페이지1문항 템플릿의 표를 찾지 못했습니다.')
    cells = {(int(c.get('RowAddr', -1)), int(c.get('ColAddr', -1))): c for r in outer.findall('ROW') for c in r.findall('CELL')}
    if not {(2, 0), (2, 5), (2, 6)}.issubset(cells):
        raise ValueError('왼쪽 문항·중앙 눈금·오른쪽 해설의 템플릿 구조가 필요합니다.')
    styles = {s.get('Name'): s.attrib for s in root.findall('.//STYLE')}
    ids = {int(n.get('InstId')) for n in root.iter() if n.get('InstId', '').isdigit()}
    next_id = max(ids or {1000000}) + 1

    def para(text='', style='바탕글', char=None):
        attrs = styles.get(style, styles.get('바탕글', {}))
        p = E.Element('P', ParaShape=attrs.get('ParaShape', '1'), Style=attrs.get('Id', '0'))
        run = E.SubElement(p, 'TEXT', CharShape=str(char if char is not None else attrs.get('CharShape', '1')))
        E.SubElement(run, 'CHAR').text = str(text)
        return p

    def fill(cell, paragraphs):
        old = cell.find('PARALIST')
        attrs = dict(old.attrib) if old is not None else {'VertAlign': 'Top', 'LineWrap': 'Break'}
        if old is not None:
            cell.remove(old)
        pl = E.SubElement(cell, 'PARALIST', attrs)
        pl.extend(paragraphs or [para()])
        return pl

    def table(rows, width, widths=None, boxed=False):
        nonlocal next_id
        if not rows or not rows[0]:
            raise ValueError('비어 있는 표는 출력할 수 없습니다.')
        cols = len(rows[0])
        if any(len(row) != cols for row in rows):
            raise ValueError('표의 각 행은 같은 열 수여야 합니다.')
        widths = widths or [width // cols] * (cols - 1) + [width - (width // cols) * (cols - 1)]
        t = E.Element('TABLE', BorderFill='4', CellSpacing='0', ColCount=str(cols), RowCount=str(len(rows)), PageBreak='None', RepeatHeader='true')
        shape = E.SubElement(t, 'SHAPEOBJECT', InstId=str(next_id), Lock='false', NumberingType='Table', ZOrder='1'); next_id += 1
        E.SubElement(shape, 'SIZE', Height='1100', Width=str(width), HeightRelTo='Absolute', WidthRelTo='Absolute', Protect='false')
        E.SubElement(shape, 'POSITION', TreatAsChar='true', AffectLSpacing='false', FlowWithText='true', AllowOverlap='false', HoldAnchorAndSO='false', HorzAlign='Left', HorzOffset='0', HorzRelTo='Para', VertAlign='Top', VertOffset='0', VertRelTo='Para')
        E.SubElement(shape, 'OUTSIDEMARGIN', Bottom='0', Left='0', Right='0', Top='0')
        E.SubElement(t, 'INSIDEMARGIN', Bottom='0', Left='0', Right='0', Top='0')
        for ri, values in enumerate(rows):
            row = E.SubElement(t, 'ROW')
            for ci, value in enumerate(values):
                c = E.SubElement(row, 'CELL', BorderFill='11' if boxed else ('12' if ri == 0 else '4'), ColAddr=str(ci), RowAddr=str(ri), ColSpan='1', RowSpan='1', Width=str(widths[ci]), Height='1100', Dirty='false', Editable='false', HasMargin='true', Header='false', Protect='false')
                margin = '420' if boxed else '150'
                E.SubElement(c, 'CELLMARGIN', Bottom=margin, Left=margin, Right=margin, Top=margin)
                if isinstance(value, list):
                    fill(c, value)
                else:
                    fill(c, [para(value, '표-가운데', char=40)])
                c.find('PARALIST').set('VertAlign', 'Top' if boxed else 'Center')
        return t

    def carrier(t, style='보기박스'):
        p = para('', style)
        run = p.find('TEXT'); run.remove(run.find('CHAR')); run.append(t)
        return p

    header_values = {(0,0):'파일명', (0,1):filename, (0,5):'메모', (0,6):publication.get('memo','출제 의도 / 풀이 / 선택지 해설'), (1,0):'테마', (1,1):publication.get('theme','규칙 적용'), (1,2):'출제자', (1,3):publication.get('author','제작 예시')}
    for address, value in header_values.items():
        if address in cells:
            fill(cells[address], [para(value, char=16 if address == (0,1) else 15)])
    left = cells[(2,0)]
    stem = para(numbered_question(draft['question'], number), '문제')
    blocks = publication.get('blocks') or [{'kind':'paragraph', 'text':p} for p in re.split(r'\n+', draft['passage'].strip()) if p.strip()]
    body = []
    for block in blocks:
        if block.get('kind') == 'table':
            body.append(carrier(table(block['rows'], 29250, block.get('widths')), '표-가운데'))
        else:
            style = '<사례견해>' if block.get('kind') == 'heading' else '박스내용(들여쓰기)'
            body.append(para(block.get('text',''), style))
    box = table([[body]], 30809, boxed=True)
    content = [stem, carrier(box)]
    content.extend(para(f'{CIRCLES[i]} {choice_text(v, i)}', '선택지') for i, v in enumerate(draft['choices'], 1))
    fill(left, content)
    guide = cells[(2,5)]
    if '―' not in ''.join(guide.itertext()): fill(guide, [para()])
    right = cells[(2,6)]
    classifications = draft.get('classifications', [])
    labels = lambda axis: '·'.join(v['label'] for v in classifications if v.get('axis') == axis)
    # Keep the same two metadata rows as ordinary paragraphs. The installed
    # Hancom PDF renderer clips the last column of the template's inline grid.
    info = [para(f"정답 {CIRCLES[draft['answer']]}   |   난이도 {publication.get('difficulty','미평정')}", '해설정보표내부'),
            para(f"내용 영역: {labels('domain')}   |   문항 유형: {labels('type')}", '해설정보표내부')]
    solution = publication.get('solution', draft['solution'])
    intent = publication.get('intent', ' / '.join(draft.get('steps', [])[:2]))
    right_paras = [para(publication.get('topic',draft['title']), '글 주제'), *info]
    if intent:
        right_paras += [para('출제 의도','코멘트제목 10.5pt'), para(intent,'코멘트내용 9pt')]
    right_paras.append(para('풀이','코멘트제목 10.5pt'))
    right_paras.extend(para(p,'코멘트내용 9pt') for p in solution.splitlines() if p.strip())
    right_paras.append(para('정오 판단','코멘트제목 10.5pt'))
    reasons = publication.get('optionReasons') or [a.get('reason','') for a in sorted(draft.get('optionAnalyses', []), key=lambda a:a['number'])]
    truth = publication.get('optionTruth')
    for i, reason in enumerate(reasons, 1):
        verdict = f" ({'○' if truth[i-1] else '×'})" if isinstance(truth,list) and len(truth)==5 and all(isinstance(v,bool) for v in truth) else (' 정답' if i==draft['answer'] else '')
        right_paras += [para(f'{CIRCLES[i]}{verdict}','정오판단_선지'), para(reason,'정오판단_설명')]
    fill(right, right_paras)
    return root


def export(template, input_file, output, deps=None, overwrite=False, font_fallback=False):
    validate_output_paths(template, input_file, output, overwrite)
    if deps: site.addsitedir(str(Path(deps).resolve()))
    import win32com.client
    from pypdf import PdfReader
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
            staged_pdf = staged.with_suffix('.pdf')
            if not hwp.SaveAs(str(staged_pdf), 'PDF', ''): raise RuntimeError('레이아웃 확인용 PDF를 만들지 못했습니다.')
            if not hwp.Open(str(staged), 'HWP', ''): raise RuntimeError('저장한 HWP를 다시 열지 못했습니다.')
            # Hancom's plain-text exporter writes some glyphs as literal
            # entities (e.g. ◦ -> &#9702;). Reparse native XML to compare glyphs.
            reopened = E.fromstring(hwp.GetTextFile('HWPML2X', ''))
            validate_rendered_text(''.join(reopened.itertext()), result)
            pdf = PdfReader(staged_pdf)
            validate_rendered_text('\n'.join(p.extract_text() for p in pdf.pages), result)
            page_count = len(pdf.pages)
            if page_count != 1: raise RuntimeError(f'문서가{page_count}페이지입니다. 내용의 길이를 조정한 뒤 다시 출력해 주세요. 글자 크기는 자동으로 줄이지 않습니다.')
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
        for suffix in ['.hwp','.hwpx','.pdf','.txt']:
            shutil.copyfile(staged.with_suffix(suffix), output.with_suffix(suffix))
    hwpx, preview = output.with_suffix('.hwpx'), output.with_suffix('.pdf')
    return {'hwp':str(output),'hwpx':str(hwpx),'preview':str(preview),'pages':page_count,'sourceUnchanged':True,'fontSubstitutions':substitutions}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--template', required=True); parser.add_argument('--input', required=True)
    parser.add_argument('--output', required=True); parser.add_argument('--deps'); parser.add_argument('--overwrite', action='store_true'); parser.add_argument('--compatible-fonts', action='store_true')
    args = parser.parse_args()
    print(json.dumps(export(args.template,args.input,args.output,args.deps,args.overwrite,args.compatible_fonts),ensure_ascii=False))
