"""Do not invent a listed answer when the literal rule yields no valid option."""
import copy
import json
from pathlib import Path
import unittest
from build_full_archive import solution_errors

FIXTURE = Path(__file__).resolve().parent/'fixtures/no-listed-answer.json'

class NoListedAnswer(unittest.TestCase):
    def setUp(self):
        case=json.loads(FIXTURE.read_text())
        self.source=case['source']
        self.solution=case['solution']

    def test_documented_no_listed_answer_preserves_source_key(self):
        self.assertEqual(self.source['sourceMarkedAnswer'],2)
        self.assertIsNone(self.solution['derivedAnswer'])
        self.assertEqual(self.solution['answerStatus'],'source-conflict')
        self.assertTrue(self.solution['derivedConclusion'])
        self.assertEqual(solution_errors(self.solution,self.source),[])

    def test_null_answer_without_conflict_and_reason_is_rejected(self):
        bad=copy.deepcopy(self.solution)
        bad['answerStatus']='source-and-solution-agree'
        bad.pop('derivedConclusion',None)
        self.assertTrue(solution_errors(bad,self.source))

if __name__=='__main__': unittest.main()
