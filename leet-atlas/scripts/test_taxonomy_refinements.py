"""Regression checks for additive, source-safe taxonomy refinements.

Run: python -m unittest discover -s scripts -p 'test_*.py'
"""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
BUILDER = ROOT / 'scripts/augment_taxonomy.py'
REFINEMENTS = ROOT / 'data/type-refinements.json'


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':')).encode()).hexdigest()


def baseline_annotations(data, refinement):
    """Undo only the additions recorded in the public review metadata."""
    annotations = {q['id']: {key: copy.deepcopy(q[key]) for key in ('tags', 'types', 'tagReasons')}
                   for q in data['questions']}
    definitions = {t['id']: t for t in refinement['definitions']}
    for assignment in reversed(refinement['assignments']):
        annotation = annotations[assignment['questionId']]
        tag = definitions[assignment['tagId']]
        if tag['id'] in annotation['tags']:
            annotation['tags'].remove(tag['id'])
        if tag['label'] in annotation['types']:
            annotation['types'].remove(tag['label'])
        annotation['tagReasons'].pop(tag['id'], None)
        if assignment.get('parentAdditionReason'):
            if tag['parentTagId'] in annotation['tags']:
                annotation['tags'].remove(tag['parentTagId'])
            if tag['parentLabel'] in annotation['types']:
                annotation['types'].remove(tag['parentLabel'])
            annotation['tagReasons'].pop(tag['parentTagId'], None)
    return annotations


class TaxonomyRefinementsTest(unittest.TestCase):
    def builder(self):
        self.assertTrue(BUILDER.exists(), 'The additive taxonomy builder is missing')
        spec = importlib.util.spec_from_file_location('augment_taxonomy', BUILDER)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module

    def refinements(self):
        self.assertTrue(REFINEMENTS.exists(), 'The reviewed classifications are not published')
        return json.loads(REFINEMENTS.read_text())

    def fixture(self):
        data = {
            'publicationMode': 'explanations-only',
            'exam': {'questionCount': 2, 'examCount': 1},
            'taxonomy': [
                {'id': 'parent', 'axis': 'type', 'label': '부모', 'description': '기존 정의', 'count': 1},
                {'id': 'old', 'axis': 'type', 'label': '기존 유형', 'count': 1}],
            'questions': [
                {'id': 'one', 'examKey': '2027', 'types': ['부모'], 'tags': ['parent'],
                 'tagReasons': {'부모': '기존 사유', 'parent': '기존 ID 사유'},
                 'text': '보존해야 하는 원래 본문', 'image': 'native.webp',
                 'answer': 2, 'summary': '기존 해설', 'steps': ['기존 풀이'],
                 'options': [{'number': 2, 'explanation': '기존 선지 해설'}]},
                {'id': 'two', 'examKey': '2020', 'types': ['기존 유형'], 'tags': ['old'],
                 'tagReasons': {'기존 유형': '그대로 둘 사유'}, 'text': '', 'image': '',
                 'sourcePage': 7, 'sourceAccess': 'local-only', 'summary': '공개 자체 해설'}]}
        refinement = {
            'schemaVersion': 1,
            'definitions': [{'id': 'child', 'axis': 'type', 'label': '자식',
                             'parentTagId': 'parent', 'parentLabel': '부모',
                             'description': '자식 정의'}],
            'assignments': [
                {'questionId': 'one', 'tagId': 'child', 'reason': '첫 분류 사유'},
                {'questionId': 'two', 'tagId': 'child', 'reason': '둘째 분류 사유',
                 'parentAdditionReason': '부모를 함께 추가하는 사유'}]}
        return data, refinement

    def test_additions_preserve_original_sources_explanations_and_reasons(self):
        augment = self.builder().augment_archive
        before, refinement = self.fixture()
        snapshot = copy.deepcopy(before)
        after = augment(before, refinement)
        self.assertEqual(before, snapshot, 'Builder mutated its input')
        for old, new in zip(before['questions'], after['questions']):
            for key, value in old.items():
                if key not in ('types', 'tags', 'tagReasons'):
                    self.assertEqual(new[key], value, (old['id'], key))
            self.assertEqual(new['types'][:len(old['types'])], old['types'])
            self.assertEqual(new['tags'][:len(old['tags'])], old['tags'])
            for key, reason in old['tagReasons'].items():
                self.assertEqual(new['tagReasons'][key], reason)
        self.assertEqual(after['questions'][0]['tagReasons']['parent'], '기존 ID 사유')
        self.assertEqual(after['questions'][1]['tagReasons']['parent'], '부모를 함께 추가하는 사유')
        self.assertEqual(after['questions'][1]['tagReasons']['child'], '둘째 분류 사유')
        counts = {tag['id']: tag['count'] for tag in after['taxonomy']}
        self.assertEqual(counts, {'parent': 2, 'old': 1, 'child': 2})
        self.assertEqual(after['publicationMode'], 'explanations-only')

    def test_builder_is_idempotent(self):
        augment = self.builder().augment_archive
        before, refinement = self.fixture()
        once = augment(before, refinement)
        self.assertEqual(augment(once, refinement), once)

    def test_unknown_question_and_tag_assignments_are_rejected(self):
        augment = self.builder().augment_archive
        for key, value in [('questionId', 'missing-question'), ('tagId', 'missing-tag')]:
            before, refinement = self.fixture()
            refinement['assignments'][0][key] = value
            with self.subTest(key=key), self.assertRaises(ValueError):
                augment(before, refinement)

    def test_unknown_parent_and_parent_cycles_are_rejected(self):
        augment = self.builder().augment_archive
        before, refinement = self.fixture()
        refinement['definitions'][0]['parentTagId'] = 'missing-parent'
        with self.assertRaises(ValueError):
            augment(before, refinement)
        before, refinement = self.fixture()
        refinement['definitions'][0]['parentTagId'] = 'child'
        with self.assertRaises(ValueError):
            augment(before, refinement)

    def test_parent_expansion_requires_a_reason(self):
        augment = self.builder().augment_archive
        before, refinement = self.fixture()
        del refinement['assignments'][1]['parentAdditionReason']
        with self.assertRaises(ValueError):
            augment(before, refinement)

    def test_actual_reviewed_assignments_and_counts(self):
        data = json.loads((ROOT / 'data/archive.json').read_text())
        refinement = self.refinements()
        tags = {t['id']: t for t in data['taxonomy']}
        questions = {q['id']: q for q in data['questions']}
        expected_counts = {
            'type-argument-diagram': 10,
            'type-puzzle-truth': 11, 'type-puzzle-ordering': 19,
            'type-puzzle-predicate': 16, 'type-puzzle-calculation': 26,
            'type-puzzle-matching': 27, 'type-puzzle-relations': 14,
            'type-puzzle-conditions': 11,
            'type-experiment-social': 31, 'type-experiment-natural': 38,
            'type-experiment-methodology': 4,
            'type-4536b24c5d': 83, 'type-823b36ade9': 73,
            'type-01f0e7e37e': 71}
        for tag_id, count in expected_counts.items():
            self.assertIn(tag_id, tags)
            self.assertEqual(tags[tag_id]['count'], count, tag_id)
        diagram_ids = {q['id'] for q in data['questions'] if 'type-argument-diagram' in q['tags']}
        self.assertEqual(diagram_ids, {'0918', '1016', '1920', '2020', '2236',
                                     '2319', '2425', '2521', '2623', '2723'})
        self.assertNotIn('type-argument-diagram', questions['p014']['tags'])
        self.assertNotIn('parentTagId', tags['type-argument-diagram'])
        self.assertNotIn('type-823b36ade9', questions['1126']['tags'])
        for assignment in refinement['assignments']:
            q = questions[assignment['questionId']]
            tag = tags[assignment['tagId']]
            self.assertIn(tag['id'], q['tags'])
            self.assertIn(tag['label'], q['types'])
            self.assertEqual(q['tagReasons'][tag['id']], assignment['reason'])
            if tag.get('parentTagId'):
                self.assertIn(tag['parentTagId'], q['tags'])
        puzzle_original = {a['questionId'] for a in refinement['assignments']
                           if a['group'] == 'puzzle' and a['coverage'] == 'existing-parent'}
        experiment_original = {a['questionId'] for a in refinement['assignments']
                               if a['group'] == 'experiment' and a['coverage'] == 'existing-parent'}
        self.assertEqual(len(puzzle_original), 77)
        self.assertEqual(len(experiment_original), 62)
        baseline = baseline_annotations(data, refinement)
        self.assertEqual(puzzle_original, {qid for qid, annotation in baseline.items()
                                          if 'type-4536b24c5d' in annotation['tags']})
        self.assertEqual(experiment_original, {qid for qid, annotation in baseline.items()
                                              if 'type-823b36ade9' in annotation['tags']})
        self.assertEqual(len(data['questions']), 755)
        self.assertEqual(len(data['exams']), 20)
        self.assertEqual(data['publicationMode'], 'explanations-only')

    def test_all_tag_counts_references_and_parent_links_are_valid(self):
        data = json.loads((ROOT / 'data/archive.json').read_text())
        tags = {t['id']: t for t in data['taxonomy']}
        self.assertEqual(len(tags), len(data['taxonomy']))
        for q in data['questions']:
            self.assertEqual(len(q['tags']), len(set(q['tags'])), q['id'])
            self.assertEqual(len(q['types']), len(set(q['types'])), q['id'])
            self.assertTrue(set(q['tags']) <= set(tags), q['id'])
        for tag_id, tag in tags.items():
            self.assertEqual(tag['count'], sum(tag_id in q['tags'] for q in data['questions']), tag_id)
            seen = {tag_id}
            while tag.get('parentTagId'):
                parent_id = tag['parentTagId']
                self.assertIn(parent_id, tags)
                self.assertNotIn(parent_id, seen)
                self.assertEqual(tag['parentLabel'], tags[parent_id]['label'])
                seen.add(parent_id)
                tag = tags[parent_id]

    def test_full_preservation_hashes_and_native_2027(self):
        data = json.loads((ROOT / 'data/archive.json').read_text())
        refinement = self.refinements()
        immutable = copy.deepcopy(data)
        immutable.pop('taxonomy')
        for q in immutable['questions']:
            for key in ('tags', 'types', 'tagReasons'):
                q.pop(key, None)
        self.assertEqual(digest(immutable), refinement['preservation']['immutableArchiveSha256'])
        annotations = baseline_annotations(data, refinement)
        self.assertEqual(digest(annotations), refinement['preservation']['legacyAnnotationsSha256'])
        native = json.loads((ROOT / 'data/2027.json').read_text())
        self.assertEqual(digest(native), refinement['preservation']['native2027Sha256'])
        self.assertEqual(hashlib.sha256((ROOT/'data/2027.json').read_bytes()).hexdigest(),
                         refinement['preservation']['native2027FileSha256'])
        new_ids = {tag['id'] for tag in refinement['definitions']}
        legacy_taxonomy = [{key: value for key, value in tag.items() if key != 'count'}
                           for tag in data['taxonomy'] if tag['id'] not in new_ids]
        self.assertEqual(len(legacy_taxonomy), 221)
        self.assertEqual(digest(legacy_taxonomy),
                         refinement['preservation']['legacyTaxonomyMetadataSha256'])
        archive_questions = {q['id']: q for q in data['questions']}
        for q in native['questions']:
            for key in ('text', 'rawText', 'image', 'thumbnail', 'answer', 'summary',
                        'steps', 'statements', 'options'):
                self.assertEqual(q.get(key), archive_questions[q['id']].get(key), (q['id'], key))

    def test_published_metadata_has_no_original_payloads_or_private_paths(self):
        refinement = self.refinements()
        serialized = json.dumps(refinement, ensure_ascii=False)
        for forbidden in ('/workspace/', 'data:image', 'originalExtractedText',
                          'sourceOptions', 'rawText', 'sourceStem', 'imageBundle'):
            self.assertNotIn(forbidden, serialized)
        self.assertEqual(refinement['auditCounts']['corpusQuestions'], 755)
        self.assertEqual(len(refinement['definitions']), 11)

    def test_cli_reproduces_archive_and_is_idempotent(self):
        self.builder()
        with tempfile.TemporaryDirectory() as temporary:
            output = Path(temporary) / 'archive.json'
            original = json.loads((ROOT/'data/archive.json').read_text())
            refinement = self.refinements()
            baseline = copy.deepcopy(original)
            annotations = baseline_annotations(original, refinement)
            new_ids = {tag['id'] for tag in refinement['definitions']}
            baseline['taxonomy'] = [tag for tag in baseline['taxonomy'] if tag['id'] not in new_ids]
            for q in baseline['questions']:
                q.update(annotations[q['id']])
            for tag in baseline['taxonomy']:
                tag['count'] = sum(tag['id'] in q['tags'] for q in baseline['questions'])
            baseline_path = Path(temporary) / 'before.json'
            baseline_path.write_text(json.dumps(baseline, ensure_ascii=False))
            subprocess.run([sys.executable, str(BUILDER), '--archive', str(baseline_path),
                            '--refinements', str(REFINEMENTS), '--output', str(output)], check=True,
                           capture_output=True, text=True)
            self.assertEqual(json.loads(output.read_text()), json.loads((ROOT/'data/archive.json').read_text()))
            first = output.read_bytes()
            subprocess.run([sys.executable, str(BUILDER), '--archive', str(output),
                            '--refinements', str(REFINEMENTS), '--output', str(output)], check=True,
                           capture_output=True, text=True)
            self.assertEqual(output.read_bytes(), first)


if __name__ == '__main__':
    unittest.main()
