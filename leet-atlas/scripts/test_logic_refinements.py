"""Logic refinements must preserve source material and stay in their own axis."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest
import re

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('augment_logic', ROOT / 'scripts/augment_taxonomy.py')
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


class LogicBuilderTest(unittest.TestCase):
    def fixture(self):
        archive = {'taxonomy': [
            {'id': 'logic-strengthen', 'axis': 'logic', 'label': '강화·약화', 'description': '기존 설명'},
            {'id': 'type-old', 'axis': 'type', 'label': '논증 평가', 'description': '기존 유형'}],
            'questions': [{'id': 'q', 'tags': ['type-old'], 'types': ['논증 평가'],
                           'logic': ['기존 논리'], 'tagReasons': {'기존 논리': '보존'},
                           'text': '원문', 'answer': 3, 'summary': '해설', 'options': []}]}
        refinements = {'definitions': [
            {'id': 'logic-neutral', 'axis': 'logic', 'label': '관련되지만 중립',
             'description': '핵심 조건 불변', 'parentTagId': 'logic-strengthen', 'parentLabel': '강화·약화'}],
            'assignments': [{'questionId': 'q', 'tagId': 'logic-neutral', 'reason': '조건이 변하지 않음',
                             'parentAdditionReason': '추가 정보의 약화 여부 평가'}]}
        return archive, refinements

    def test_logic_assignment_adds_parent_to_logic_without_touching_types_or_sources(self):
        archive, refinements = self.fixture()
        snapshot = copy.deepcopy(archive)
        result = builder.augment_archive(archive, refinements)
        self.assertEqual(archive, snapshot)
        q = result['questions'][0]
        self.assertEqual(q['types'], ['논증 평가'])
        self.assertEqual(q['logic'], ['기존 논리', '강화·약화', '관련되지만 중립'])
        self.assertEqual(q['tagReasons']['관련되지만 중립'], '조건이 변하지 않음')
        self.assertEqual(q['tagReasons']['logic-neutral'], '조건이 변하지 않음')
        self.assertEqual(q['tagReasons']['강화·약화'], '추가 정보의 약화 여부 평가')
        for key in ('text', 'answer', 'summary', 'options'):
            self.assertEqual(q[key], snapshot['questions'][0][key])
        self.assertEqual(builder.augment_archive(result, refinements), result)

    def test_unsupported_axis_and_cross_axis_parent_are_rejected(self):
        for axis in ('subject', 'field', 'domain', ''):
            archive, refinements = self.fixture()
            refinements['definitions'][0]['axis'] = axis
            with self.subTest(axis=axis), self.assertRaises(ValueError):
                builder.augment_archive(archive, refinements)
        archive, refinements = self.fixture()
        refinements['definitions'][0].update(parentTagId='type-old', parentLabel='논증 평가')
        with self.assertRaises(ValueError):
            builder.augment_archive(archive, refinements)


class PublishedLogicRefinementsTest(unittest.TestCase):
    def setUp(self):
        self.refinements = json.loads((ROOT / 'data/logic-refinements.json').read_text(encoding='utf-8'))
        self.archive = json.loads((ROOT / 'data/archive.json').read_text(encoding='utf-8'))
        self.questions = {q['id']: q for q in self.archive['questions']}

    def test_review_coverage_explains_every_assignment_and_exclusion(self):
        r = self.refinements
        reviewed = {item['questionId']: item for item in r['reviews']}
        expected = set(r['coverage']['originalQuestionIds'] + r['coverage']['additionalCandidateIds'])
        self.assertEqual(set(reviewed), expected)
        self.assertEqual(len(reviewed), len(r['reviews']))
        assigned = {a['questionId'] for a in r['assignments']}
        self.assertEqual(assigned, {qid for qid, review in reviewed.items() if review['status'] == 'assigned'})
        for qid, review in reviewed.items():
            self.assertIn(qid, self.questions)
            self.assertTrue(review['reviewReason'].strip(), qid)
            self.assertIn(review['status'], ('assigned', 'excluded'))

    def test_each_membership_has_specific_evidence_present_in_the_original(self):
        normalize = lambda value: re.sub(r'\s+', '', value)
        seen = set()
        for a in self.refinements['assignments']:
            q = self.questions[a['questionId']]
            key = (q['id'], a['tagId'])
            self.assertNotIn(key, seen)
            seen.add(key)
            self.assertGreater(len(a['reason']), 25, key)
            self.assertTrue(a['unit'] and a['target'], key)
            self.assertIn(a['effect'], ('strengthen', 'weaken', 'neutral', 'undetermined', 'mixed'))
            self.assertIn(a['evidenceField'], ('sourceStem', 'text', 'sourceOptions'))
            source = q[a['evidenceField']]
            if isinstance(source, list):
                source = ' '.join(o['text'] for o in source)
            self.assertGreaterEqual(len(normalize(a['evidenceText'])), 10, key)
            self.assertIn(normalize(a['evidenceText']), normalize(source), key)

    def test_published_logic_memberships_and_counts_are_reproducible(self):
        r = self.refinements
        tags = {t['id']: t for t in self.archive['taxonomy']}
        for definition in r['definitions']:
            tag = tags[definition['id']]
            self.assertEqual(tag['axis'], 'logic')
            self.assertEqual(tag['parentTagId'], 'logic-strengthen')
            self.assertIn(tag['refinementGroup'], ('판단상 혼동', '증거의 작용 방식'))
            self.assertEqual(tag['count'], sum(tag['id'] in q['tags'] for q in self.questions.values()))
        for a in r['assignments']:
            q, tag = self.questions[a['questionId']], tags[a['tagId']]
            self.assertIn(tag['id'], q['tags'])
            self.assertIn('logic-strengthen', q['tags'])
            self.assertIn(tag['label'], q['logic'])
            self.assertNotIn(tag['label'], q['types'])
            self.assertEqual(q['tagReasons'][tag['id']], a['reason'])
            self.assertEqual(q['tagReasons'][tag['label']], a['reason'])
        self.assertEqual(builder.augment_archive(self.archive, r), self.archive)

    def test_reversal_competition_and_neutrality_remain_distinct_in_key_examples(self):
        for qid, suffix in [('2710', 'reversed'), ('2638', 'competition'), ('2739', 'neutral'), ('2321', 'insufficient')]:
            self.assertIn('logic-strengthen-' + suffix, self.questions[qid]['tags'], qid)


if __name__ == '__main__':
    unittest.main()
