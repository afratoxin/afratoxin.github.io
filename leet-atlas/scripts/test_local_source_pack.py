"""Exercise private source bundle creation using synthetic text and images only."""
import copy
import hashlib
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from PIL import Image

SCRIPT = Path(__file__).with_name('build_local_source_pack.py')


class LocalSourcePackTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.builder = None
        if SCRIPT.exists():
            spec = importlib.util.spec_from_file_location('source_pack', SCRIPT)
            cls.builder = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(cls.builder)
        cls.temp = tempfile.TemporaryDirectory()
        cls.images = Path(cls.temp.name) / 'images'
        cls.images.mkdir()
        synthetic = Path(cls.temp.name) / 'solid.webp'
        Image.new('RGB', (3, 2), (40, 120, 210)).save(synthetic, 'WEBP')
        cls.image_bytes = synthetic.read_bytes()
        for i in range(755):
            (cls.images / f'q{i:04}.webp').write_bytes(cls.image_bytes)

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    def setUp(self):
        self.registry = {'questions': [
            {'id': f'q{i:04}', 'examKey': '2026' if i < 715 else '2027',
             'examLabel': '합성 시험', 'number': i + 1, 'sourcePage': i + 1,
             **({'sourceAccess': 'local-only'} if i < 715 else {'text': 'public text', 'image': 'public.webp'})}
            for i in range(755)
        ]}
        self.text_pack = {
            'schemaVersion': 1, 'kind': 'leet-atlas-local-text',
            'source': {'name': 'synthetic.pdf', 'sha256': 'a' * 64, 'pageCount': 755},
            'correctedQuestionIds': ['q0001'], 'diagramQuestionIds': ['q0002'],
            'questions': [{key: question[key] for key in ('id', 'examKey', 'number', 'sourcePage')}
                          | {'text': f'{question["number"]}. 합성 문제\n① 가\n② 나\n③ 다\n④ 라\n⑤ 마'}
                          for question in self.registry['questions'][:715]],
        }

    def build(self):
        return self.builder.build_pack(self.text_pack, self.registry, self.images)

    def test_bundle_contains_exactly_local_questions_with_text_and_real_webp(self):
        self.assertIsNotNone(self.builder, 'The private source bundle builder is required')
        before = copy.deepcopy((self.text_pack, self.registry))
        pack = self.build()
        self.assertEqual(pack['schemaVersion'], 1)
        self.assertEqual(pack['kind'], 'leet-atlas-local-sources')
        self.assertEqual(len(pack['questions']), 715)
        self.assertEqual([q['id'] for q in pack['questions']], [f'q{i:04}' for i in range(715)])
        self.assertTrue(all(set(q) == {'id', 'examKey', 'number', 'sourcePage', 'text', 'image'} for q in pack['questions']))
        self.assertTrue(all(q['image'].startswith('data:image/webp;base64,UklGR') for q in pack['questions']))
        self.assertEqual(pack['coverage'], {'total':755, 'included':40, 'importable':715})
        self.assertEqual(pack['counts'], {'registry':755, 'public':40, 'questions':715, 'texts':715, 'images':715})
        self.assertEqual(pack['source'], self.text_pack['source'])
        self.assertEqual(pack['correctedQuestionIds'], ['q0001'])
        self.assertEqual(pack['diagramQuestionIds'], ['q0002'])
        self.assertEqual((self.text_pack, self.registry), before)

    def test_registry_must_have_755_unique_questions_and_715_local_records(self):
        for alteration in ('missing', 'duplicate', 'not_local', 'unsafe_id'):
            with self.subTest(alteration=alteration):
                original = copy.deepcopy(self.registry)
                if alteration == 'missing': self.registry['questions'].pop()
                if alteration == 'duplicate': self.registry['questions'][-1]['id'] = 'q0000'
                if alteration == 'not_local': self.registry['questions'][0].pop('sourceAccess')
                if alteration == 'unsafe_id': self.registry['questions'][0]['id'] = '../private'
                with self.assertRaises(ValueError): self.build()
                self.registry = original

    def test_text_pack_missing_extra_duplicate_and_public_ids_are_rejected(self):
        for alteration in ('missing', 'extra', 'duplicate', 'public'):
            with self.subTest(alteration=alteration):
                original = copy.deepcopy(self.text_pack)
                if alteration == 'missing': self.text_pack['questions'].pop()
                if alteration == 'extra': self.text_pack['questions'].append({**self.text_pack['questions'][0], 'id':'unknown'})
                if alteration == 'duplicate': self.text_pack['questions'][-1]['id'] = 'q0000'
                if alteration == 'public': self.text_pack['questions'][-1]['id'] = 'q0715'
                with self.assertRaises(ValueError): self.build()
                self.text_pack = original

    def test_exam_number_and_exact_source_page_must_match_the_registry(self):
        for key, value in [('examKey','2025'), ('number',2), ('number',True), ('sourcePage',999), ('sourcePage',None)]:
            with self.subTest(key=key,value=value):
                original = self.text_pack['questions'][0][key]
                self.text_pack['questions'][0][key] = value
                with self.assertRaises(ValueError): self.build()
                self.text_pack['questions'][0][key] = original

    def test_blank_excessive_and_unresolved_source_text_are_rejected(self):
        for text in ['', ' \n ', 10, 'x' * 100001, '1. \ufffd ①②③④⑤', '1. \ue001 ①②③④⑤', '2. 시험 ①②③④⑤', '1. 시험 ①②③④']:
            with self.subTest(text=str(text)[:20]):
                self.text_pack['questions'][0]['text'] = text
                with self.assertRaises(ValueError): self.build()

    def test_missing_corrupt_non_webp_and_oversized_images_are_rejected(self):
        path = self.images / 'q0000.webp'
        png = Path(self.temp.name) / 'wrong.png'
        Image.new('RGB', (2,2)).save(png, 'PNG')
        try:
            for image_bytes in [None, b'RIFF\x04\x00\x00\x00WEBP', png.read_bytes(), b'x' * (2 * 1024 * 1024 + 1)]:
                with self.subTest(size=len(image_bytes) if image_bytes else None):
                    if image_bytes is None: path.unlink()
                    else: path.write_bytes(image_bytes)
                    with self.assertRaises(ValueError): self.build()
                    path.write_bytes(self.image_bytes)
        finally: path.write_bytes(self.image_bytes)

    def test_source_pdf_metadata_and_corrected_ids_must_be_valid(self):
        for field,value in [('source',{}), ('correctedQuestionIds',['q0715']), ('correctedQuestionIds',['q0001','q0001']),
                            ('diagramQuestionIds',['unknown']), ('schemaVersion',2), ('kind','other')]:
            with self.subTest(field=field):
                original = copy.deepcopy(self.text_pack[field])
                self.text_pack[field] = value
                with self.assertRaises(ValueError): self.build()
                self.text_pack[field] = original

    def test_cli_writes_outside_repository_and_never_changes_inputs(self):
        directory = Path(self.temp.name) / 'cli'
        directory.mkdir(exist_ok=True)
        registry_path, text_path = directory / 'registry.json', directory / 'texts.json'
        registry_path.write_text(json.dumps(self.registry), encoding='utf-8')
        text_path.write_text(json.dumps(self.text_pack), encoding='utf-8')
        inputs = [registry_path, text_path, *self.images.glob('*.webp')]
        before = {path: hashlib.sha256(path.read_bytes()).hexdigest() for path in inputs}
        output = directory / 'result.json'
        run = subprocess.run([sys.executable,str(SCRIPT),'--text-pack',str(text_path),'--registry',str(registry_path),
                              '--image-dir',str(self.images),'--output',str(output)], text=True, capture_output=True)
        self.assertEqual(run.returncode, 0, run.stderr)
        payload = output.read_bytes()
        self.assertEqual(len(json.loads(payload)['questions']),715)
        self.assertEqual(json.loads(run.stdout)['bytes'],len(payload))
        self.assertEqual(before,{path:hashlib.sha256(path.read_bytes()).hexdigest() for path in inputs})

    def test_cli_refuses_to_write_a_source_bundle_inside_the_public_project(self):
        for directory in [SCRIPT.parent.parent, SCRIPT.parents[2]]:
            with self.subTest(directory=directory), self.assertRaises(ValueError):
                self.builder.validate_output_path(directory / 'private-pack.json')


if __name__ == '__main__':
    unittest.main()
