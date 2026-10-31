import unittest
import xml.etree.ElementTree as E
from pathlib import Path
import tempfile
from hwp_template import build_document, question_text, compatible_fonts, validate_rendered_text, validate_output_paths


def template():
    root = E.Element('HWPML')
    head = E.SubElement(root, 'HEAD')
    styles = E.SubElement(head, 'STYLELIST')
    names = ['바탕글', '문제', '문제번호', '보기박스', '박스내용(들여쓰기)', '보기내용(내어쓰기)', '표-가운데', '<사례견해>', '선택지', '글 주제', '코멘트제목 10.5pt', '코멘트내용 9pt', '정오판단_선지', '정오판단_설명']
    for i, name in enumerate(names):
        E.SubElement(styles, 'STYLE', Name=name, Id=str(i), ParaShape=str(i), CharShape=str(i))
    body = E.SubElement(root, 'BODY'); sec = E.SubElement(body, 'SECTION')
    p = E.SubElement(sec, 'P'); text = E.SubElement(p, 'TEXT')
    secdef = E.SubElement(text, 'SECDEF'); E.SubElement(secdef, 'PAGEDEF', Width='84188', Height='119052')
    table = E.SubElement(text, 'TABLE', ColCount='8', RowCount='3')
    for r, cols in [(0, [0, 1, 5, 6]), (1, [0, 1, 2, 3]), (2, [0, 5, 6])]:
        row = E.SubElement(table, 'ROW')
        for c in cols:
            cell = E.SubElement(row, 'CELL', RowAddr=str(r), ColAddr=str(c), Width='30000')
            para = E.SubElement(E.SubElement(cell, 'PARALIST'), 'P'); E.SubElement(E.SubElement(para, 'TEXT'), 'CHAR').text = '양식 예시'
    return root


def draft():
    return {'title': '가산과 감액', 'question': '다음으로부터 옳지 않은 것은?', 'passage': '규칙 A & B를 적용한다.\n조건을 모두 판단한다.', 'choices': ['선택지'+str(i) for i in range(1, 6)], 'answer': 5, 'solution': '금액을 순서대로 계산한다.', 'optionAnalyses': [{'number':i, 'isAnswer':i==5, 'reason':'근거'+str(i)} for i in range(1,6)], 'classifications':[{'axis':'domain','label':'법률'}, {'axis':'type','label':'규칙·사례 적용'}]}


class TemplateTests(unittest.TestCase):
    def test_original_geometry_styles_and_source_tree_are_preserved(self):
        source = template(); before = E.tostring(source)
        result = build_document(source, draft(), {}, '완성.hwp')
        self.assertEqual(E.tostring(source), before)
        self.assertEqual(result.find('.//PAGEDEF').attrib, source.find('.//PAGEDEF').attrib)
        self.assertEqual(E.tostring(result.find('HEAD')), E.tostring(source.find('HEAD')))
        self.assertNotIn('양식 예시', ''.join(result.find('BODY').itertext()))

    def test_left_question_first_and_right_solution_do_not_leak(self):
        result = build_document(template(), draft(), {}, '완성.hwp')
        cells = result.find('.//TABLE').findall('ROW')[2].findall('CELL')
        left, right = ''.join(cells[0].itertext()), ''.join(cells[2].itertext())
        self.assertTrue(left.startswith('1. 다음으로부터 옳지 않은 것은?'))
        self.assertIn('규칙 A & B', left); self.assertIn('⑤ 선택지5', left)
        self.assertNotIn('금액을 순서대로 계산', left)
        self.assertIn('금액을 순서대로 계산', right); self.assertIn('법률', right)
        self.assertEqual(question_text(draft()).count('①'), 1)

    def test_native_table_blocks_and_explicit_truth_are_retained(self):
        pub = {'blocks':[{'kind':'table','rows':[['기업','금액'],['갑','8,200']]}], 'optionTruth':[True, True, True, True, False]}
        result = build_document(template(), draft(), pub, '완성.hwp')
        text = ''.join(result.find('BODY').itertext())
        self.assertIn('8,200', text); self.assertIn('⑤ (×)', text)
        self.assertGreater(len(result.findall('.//TABLE')), 1)

    def test_unrecognized_template_and_invalid_choice_counts_fail(self):
        with self.assertRaises(ValueError): build_document(E.Element('HWPML'), draft(), {}, '완성.hwp')
        data=draft();data['choices'].pop()
        with self.assertRaises(ValueError): build_document(template(), data, {}, '완성.hwp')

    def test_legacy_font_fallback_keeps_font_ids_and_ttf_faces(self):
        root=E.fromstring('<HWPML><HEAD><FONTFACE><FONT Id="1" Name="신명 중명조" Type="hft"/><FONT Id="2" Name="맑은 고딕" Type="ttf"/></FONTFACE></HEAD></HWPML>')
        changed=compatible_fonts(root)
        self.assertEqual(root.find('.//FONT[@Id="1"]').get('Name'),'바탕')
        self.assertEqual(root.find('.//FONT[@Id="2"]').get('Name'),'맑은 고딕')
        self.assertTrue(changed)

    def test_saved_text_without_visible_pdf_glyphs_is_not_accepted(self):
        document=build_document(template(),draft())
        text=''.join(document.find('BODY').itertext())
        with self.assertRaisesRegex(ValueError,'글꼴'):
            validate_rendered_text('표와 해설만 보이는 PDF',document)
        validate_rendered_text(text,document)
        with self.assertRaisesRegex(ValueError,'글꼴'):
            validate_rendered_text(text.replace('법률',''),document)

    def test_verification_requires_passage_solution_table_cells_and_reasons(self):
        document=build_document(template(),draft(),{'blocks':[{'kind':'paragraph','text':'완성된 규칙 전문'},{'kind':'table','rows':[['대상','금액'],['갑','8,200']]}]})
        text=''.join(document.find('BODY').itertext())
        for missing in ['완성된 규칙 전문','8,200','금액을 순서대로 계산한다.','근거5']:
            with self.subTest(missing=missing), self.assertRaises(ValueError):
                validate_rendered_text(text.replace(missing,''),document)

    def test_verification_uses_normalized_native_choices_instead_of_raw_prefixes(self):
        value=draft();value['choices']=[f'{i}. 선택지{i}' for i in range(1,6)]
        document=build_document(template(),value)
        text=''.join(document.find('BODY').itertext())
        self.assertIn('① 선택지1',text)
        validate_rendered_text(text,document)

    def test_existing_question_number_is_preserved_in_hwp_and_text(self):
        value=draft();value['question']='12. 다음으로부터 옳지 않은 것은?'
        document=build_document(template(),value)
        left=document.find('.//TABLE').findall('ROW')[2].findall('CELL')[0]
        self.assertTrue(''.join(left.itertext()).startswith('12. 다음'))
        self.assertTrue(question_text(value).startswith('12. 다음'))

    def test_all_related_outputs_are_protected_before_overwriting(self):
        with tempfile.TemporaryDirectory(prefix='leet-hwp-test-') as folder:
            base=Path(folder); source=base/'template.hwp'; data=base/'draft.json'; output=base/'new.hwp'
            with self.assertRaises(ValueError): validate_output_paths(source,data,source,True)
            with self.assertRaises(ValueError): validate_output_paths(source,data,base/'wrong.pdf',False)
            output.with_suffix('.pdf').write_text('existing file')
            with self.assertRaises(FileExistsError): validate_output_paths(source,data,output,False)
            validate_output_paths(source,data,output,True)


if __name__ == '__main__': unittest.main()
