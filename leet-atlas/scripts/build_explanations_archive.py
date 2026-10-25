"""Prepare self-authored explanations without publishing new source payloads.

The complete archive stays local. The existing 2027 publication is preserved.
All other question records use an allowlist; newly added source fields cannot
silently enter this publication variant.
"""
import argparse
import copy
import json
from pathlib import Path


PUBLIC_KEYS = {
    'id', 'year', 'number', 'questionNumber', 'examKey', 'examLabel', 'title',
    'domains', 'fields', 'subjects', 'subjectAssignments', 'types', 'logic',
    'tags', 'tagReasons', 'classificationReasons', 'fieldReasons', 'dataPath',
    'sourcePage', 'examPage', 'sourcePdfPage',
    'answer', 'sourceMarkedAnswer', 'derivedAnswer', 'answerStatus', 'answerBasis',
    'summary', 'steps', 'statements', 'pitfalls', 'confidence', 'reviewNotes',
    'answerIssue', 'answerWarning', 'derivedConclusion',
}


def explanations_archive(source):
    result = copy.deepcopy(source)
    result['publicationMode'] = 'explanations-only'
    for index, question in enumerate(source['questions']):
        if question['examKey'] == '2027':
            continue
        row = {key: copy.deepcopy(value) for key, value in question.items() if key in PUBLIC_KEYS}
        row.update(text='', image='', thumbnail='', sourcePdf='', sourceAccess='local-only')
        row['options'] = [
            {key: copy.deepcopy(option[key]) for key in ('number', 'correct', 'explanation')}
            for option in question.get('options', [])
        ]
        result['questions'][index] = row
    for exam in result.get('exams', []):
        if exam['key'] != '2027':
            exam.pop('sourcePdf', None)
    result.setdefault('exam', {})['status'] = '전체 회차 자체 해설 초안 · 원문은 소장 PDF 참조'
    result['exam']['explanationQuestionCount'] = len(result['questions'])
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    result = explanations_archive(json.loads(args.input.read_text()))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(f'Prepared {len(result["questions"])} self-authored explanations without new original payloads.')
