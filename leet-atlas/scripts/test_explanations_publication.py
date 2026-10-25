import copy
import json
import unittest
from pathlib import Path

from build_explanations_archive import explanations_archive


class ExplanationPublicationTests(unittest.TestCase):
    def test_published_manifest_describes_all_authored_drafts_without_claiming_official_verification(self):
        root = Path(__file__).resolve().parents[1]
        data = json.loads((root / 'data/archive.json').read_text())
        manifest = json.loads((root / 'data/archive-manifest.json').read_text())
        self.assertEqual(manifest['publicationMode'], data['publicationMode'])
        self.assertEqual(manifest['draftExplanationQuestionCount'], len(data['questions']))
        self.assertEqual(manifest['optionExplanationCount'], sum(len(q['options']) for q in data['questions']))
        self.assertEqual(manifest['preservedSourceQuestionCount'], 40)
        self.assertEqual(manifest['sourceReferenceQuestionCount'], 715)
        self.assertIs(manifest['officialAnswerVerificationComplete'], False)

    def test_new_questions_publish_authored_analysis_without_original_payload(self):
        source = {'publicationMode': 'full-content', 'exam': {}, 'exams': [{'key': '2020', 'sourcePdf': 'private.pdf'}], 'questions': [{
            'id': '2001', 'examKey': '2020', 'year': 2020, 'number': 1,
            'title': '자체 분류 제목', 'summary': '자체 작성 해설', 'steps': ['근거'],
            'options': [{'number': 1, 'correct': True, 'explanation': '자체 선지 해설', 'text': 'ORIGINAL_OPTION'}],
            'answer': 1, 'answerStatus': 'source-and-solution-agree',
            'text': 'ORIGINAL_TEXT', 'sourceText': 'ORIGINAL_TEXT', 'sourceStem': 'ORIGINAL_STEM',
            'sourceOptions': [{'text': 'ORIGINAL_OPTION'}], 'rawText': 'ORIGINAL_RAW',
            'imageBundle': 'data/images/2020.json', 'image': 'assets/questions/2001.webp',
            'thumbnail': 'assets/thumbs/2001.webp', 'sourcePdf': 'private.pdf',
            'unexpectedSourceField': 'UNAPPROVED_PAYLOAD',
        }]}
        before = copy.deepcopy(source)
        result = explanations_archive(source)
        self.assertEqual(source, before, 'The complete local archive must remain available')
        row = result['questions'][0]
        self.assertEqual(row['summary'], '자체 작성 해설')
        self.assertEqual(row['options'], [{'number': 1, 'correct': True, 'explanation': '자체 선지 해설'}])
        self.assertEqual(row['sourceAccess'], 'local-only')
        self.assertEqual(row['answer'], 1)
        self.assertEqual(result['publicationMode'], 'explanations-only')
        self.assertNotIn('ORIGINAL_', str(result))
        self.assertNotIn('UNAPPROVED_PAYLOAD', str(result))
        self.assertNotIn('private.pdf', str(result))
        self.assertNotIn('imageBundle', row)

    def test_previously_published_2027_corrected_question_is_preserved(self):
        corrected = {'id': '2708', 'examKey': '2027', 'answer': 3, 'text': 'corrected text', 'image': 'assets/questions/2708.webp', 'summary': 'corrected explanation'}
        source = {'exam': {}, 'exams': [{'key': '2027', 'sourcePdf': 'data/2027-original.pdf'}], 'questions': [corrected]}
        result = explanations_archive(source)
        self.assertEqual(result['questions'], [corrected])
        self.assertEqual(result['exams'][0]['sourcePdf'], 'data/2027-original.pdf')


if __name__ == '__main__':
    unittest.main()
