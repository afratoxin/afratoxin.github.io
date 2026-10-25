"""Test the text-only import builder without committing any original passages."""
import copy
import importlib.util
import unittest
from pathlib import Path

SPEC = importlib.util.spec_from_file_location('local_pack', Path(__file__).with_name('build_local_text_pack.py'))


class LocalTextPackTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.builder = importlib.util.module_from_spec(SPEC)
        SPEC.loader.exec_module(cls.builder)

    def setUp(self):
        self.registry = {'questions': [
            {'id': 'p001', 'examKey': 'preliminary', 'examLabel': '2009학년도 예비시험', 'number': 1, 'sourcePage': 1, 'sourceAccess': 'local-only'},
            {'id': '0901', 'examKey': '2009', 'examLabel': '2009학년도', 'number': 1, 'sourcePage': 21, 'sourceAccess': 'local-only'},
            {'id': '2701', 'examKey': '2027', 'examLabel': '2027학년도', 'number': 1, 'sourcePage': 337, 'text': '보존할 기존 본문'},
        ]}
        self.source = {'questions': [
            {**q, 'text': '1. 시험용 본문\n① 첫째\n② 둘째\n③ 셋째\n④ 넷째\n⑤ 다섯째', 'image': 'private-image', 'answer': 3}
            for q in self.registry['questions']
        ]}

    def build(self, **kw):
        return self.builder.build_pack(self.source, self.registry, **kw)

    def test_all_unpublished_questions_are_in_registry_order_and_public_text_is_preserved(self):
        before = copy.deepcopy((self.source, self.registry))
        pack = self.build(source_name='source.pdf', source_sha256='a' * 64, page_count=356)
        self.assertEqual([q['id'] for q in pack['questions']], ['p001', '0901'])
        self.assertEqual(pack['kind'], 'leet-atlas-local-text')
        self.assertEqual(pack['coverage'], {'total': 3, 'included': 1, 'importable': 2})
        self.assertEqual([e['key'] for e in pack['exams']], ['preliminary', '2009'])
        self.assertEqual(pack['source']['sha256'], 'a' * 64)
        self.assertTrue(all(set(q) == {'id', 'examKey', 'number', 'sourcePage', 'text'} for q in pack['questions']))
        self.assertEqual((self.source, self.registry), before)

    def test_all_source_ids_must_match_registry_exactly(self):
        for alter in ['missing', 'duplicate', 'unknown']:
            with self.subTest(alter=alter):
                saved = copy.deepcopy(self.source)
                if alter == 'missing': self.source['questions'].pop()
                if alter == 'duplicate': self.source['questions'].append(copy.deepcopy(self.source['questions'][0]))
                if alter == 'unknown': self.source['questions'][0]['id'] = '9999'
                with self.assertRaises(ValueError): self.build()
                self.source = saved

    def test_round_number_and_page_must_match_registry(self):
        for key, value in [('examKey', '2009'), ('number', 2), ('sourcePage', 999)]:
            with self.subTest(key=key):
                saved = self.source['questions'][0][key]
                self.source['questions'][0][key] = value
                with self.assertRaises(ValueError): self.build()
                self.source['questions'][0][key] = saved

    def test_empty_text_broken_glyphs_wrong_boundary_and_missing_option_are_rejected(self):
        for text in ['', '1. \ufffd ①②③④⑤', '1. \ue001 ①②③④⑤', '2. 시험 ①②③④⑤', '1. 시험 ①②③④']:
            with self.subTest(text=text):
                self.source['questions'][0]['text'] = text
                with self.assertRaises(ValueError): self.build()

    def test_exact_corrections_are_applied_without_mutating_source(self):
        pack = self.build(corrections=[{'id': '0901', 'old': '시험용', 'new': '검수된', 'count': 1}])
        self.assertIn('검수된', pack['questions'][1]['text'])
        self.assertIn('시험용', self.source['questions'][1]['text'])
        self.assertEqual(pack['correctedQuestionIds'], ['0901'])

    def test_stale_ambiguous_or_public_corrections_are_rejected(self):
        for correction in [
            {'id': '0901', 'old': '없음', 'new': '대체', 'count': 1},
            {'id': '0901', 'old': '시험용', 'new': '대체', 'count': 2},
            {'id': '2701', 'old': '시험용', 'new': '대체', 'count': 1},
        ]:
            with self.assertRaises(ValueError): self.build(corrections=[correction])

    def test_correction_count_must_be_a_positive_integer(self):
        for count in [0, -1, True, 1.0, '1']:
            with self.subTest(count=count), self.assertRaises(ValueError):
                self.build(corrections=[{'id': '0901', 'old': '없는 텍스트' if count == 0 else '시험용', 'new': '대체', 'count': count}])


if __name__ == '__main__':
    unittest.main()
