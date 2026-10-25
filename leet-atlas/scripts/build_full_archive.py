"""Merge parsed originals and self-authored solution drafts into the classified archive.

The default build requires all 715 new solutions before writing any output.
--allow-partial is for local review and never labels an incomplete archive full-content.
Existing 2027 originals and solution text are always read from data/2027.json.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOLUTION_FILES = tuple(f'solutions-{letter}.json' for letter in 'abcde')
CLASSIFICATION_KEYS = {
    'id', 'year', 'number', 'questionNumber', 'examKey', 'examLabel', 'title',
    'domains', 'fields', 'subjects', 'subjectAssignments', 'types', 'logic',
    'tags', 'tagReasons', 'classificationReasons', 'fieldReasons', 'dataPath',
    'sourcePage', 'examPage', 'sourcePdf', 'sourcePdfPage', 'column', 'clip', 'clips',
}
SOURCE_KEYS = (
    'text', 'rawText', 'sourceText', 'sourceStem', 'sourceOptions',
    'sourceTextExtraction', 'sourceMarkedAnswer', 'answerExtractionEvidence',
    'answerExtractionStatus', 'clip', 'clips', 'sourcePage', 'sourcePdfPage',
)
SOLUTION_KEYS = (
    'summary', 'steps', 'statements', 'options', 'pitfalls', 'confidence',
    'reviewNotes', 'answerIssue', 'answerWarning', 'answerConflict', 'derivedConclusion',
)
ANSWER_BASIS = '원본 표시와 자체 풀이 대조 · 외부 공식 정답표 미대조'


def read_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def sha256(payload):
    return hashlib.sha256(payload).hexdigest()


def json_bytes(data):
    return (json.dumps(data, ensure_ascii=False, indent=2) + '\n').encode('utf-8')


def sanitized(value):
    if isinstance(value, dict):
        return {key: sanitized(item) for key, item in value.items()}
    if isinstance(value, list):
        return [sanitized(item) for item in value]
    if isinstance(value, str) and value.startswith(('/workspace/', '/root/', '/home/', '/tmp/')):
        return Path(value).name
    return value


def solution_errors(solution, source):
    errors = []
    derived = solution.get('derivedAnswer', solution.get('answer'))
    no_listed_answer = derived is None and solution.get('answerStatus') == 'source-conflict' and bool(solution.get('derivedConclusion')) and bool(solution.get('answerIssue'))
    if not no_listed_answer and (type(derived) is not int or derived not in range(1, 6)):
        errors.append('derivedAnswer must be 1..5 or a documented no-listed-answer conflict')
    if solution.get('sourceMarkedAnswer', source['sourceMarkedAnswer']) != source['sourceMarkedAnswer']:
        errors.append('sourceMarkedAnswer does not match the preserved original')
    if len(solution.get('summary', '')) < 70:
        errors.append('summary must contain at least 70 characters')
    steps = solution.get('steps', [])
    if len(steps) < 3 or not all(steps):
        errors.append('at least three substantive steps are required')
    options = solution.get('options', [])
    if [option.get('number') for option in options] != [1, 2, 3, 4, 5]:
        errors.append('five ordered option explanations are required')
    elif no_listed_answer:
        if any(option.get('correct') for option in options):
            errors.append('a no-listed-answer conflict cannot mark an option correct')
    elif sum(bool(option.get('correct')) for option in options) != 1:
        errors.append('exactly one option must be correct')
    elif next(option['number'] for option in options if option.get('correct')) != derived:
        errors.append('correct option must reflect derivedAnswer without changing the original key')
    if any(len(option.get('explanation', '')) < 25 for option in options):
        errors.append('each option explanation must contain at least 25 characters')
    for statement in solution.get('statements', []):
        if not isinstance(statement.get('verdict'), bool) or len(statement.get('explanation', '')) < 20:
            errors.append('each statement needs a boolean verdict and explanation')
    if not solution.get('confidence'):
        errors.append('confidence is required')
    return errors


def build(source_dir, *, allow_partial=False, output_dir=None, metadata_path=None,
          reviewed_path=None, image_dir=None, manifest_path=None):
    source_dir = Path(source_dir)
    output_dir = Path(output_dir or ROOT/'data')
    metadata_path = Path(metadata_path or ROOT/'data/archive.json')
    reviewed_path = Path(reviewed_path or ROOT/'data/2027.json')
    image_dir = Path(image_dir or ROOT/'data/images')
    manifest_path = Path(manifest_path or ROOT/'data/archive-manifest.json')
    source_path = source_dir/'questions-with-answers.json'
    report_path = source_dir/'source-completion-report.json'
    snapshots = {}

    def snapshot(path):
        payload = path.read_bytes()
        snapshots[path] = payload
        return json.loads(payload)

    metadata = snapshot(metadata_path)
    reviewed = {q['id']: q for q in snapshot(reviewed_path)['questions']}
    source = {q['id']: q for q in snapshot(source_path)}
    report = snapshot(report_path)
    original_manifest = snapshot(manifest_path)
    metadata_ids = {q['id'] for q in metadata['questions']}
    if len(metadata['questions']) != 755 or len(metadata_ids) != 755 or set(source) != metadata_ids or len(reviewed) != 40:
        raise ValueError('Expected exactly 755 parsed and classified originals and 40 preserved 2027 questions.')
    expected = metadata_ids - set(reviewed)
    solutions, batches = {}, []
    for name in SOLUTION_FILES:
        path = source_dir/name
        if not path.exists():
            continue
        rows = snapshot(path)
        if not isinstance(rows, list):
            raise ValueError(f'{name}: expected an array of solution drafts')
        for solution in rows:
            qid = solution['id']
            if qid not in expected or qid in solutions:
                raise ValueError(f'{name}: unexpected or duplicate solution {qid}')
            solutions[qid] = solution
        batches.append((name, rows, snapshots[path]))
    missing = sorted(expected-set(solutions))
    if missing and not allow_partial:
        raise ValueError(f'Incomplete solutions: need all 715 before writing; missing {len(missing)}: {", ".join(missing[:20])}')
    invalid = {qid: solution_errors(solution, source[qid]) for qid, solution in solutions.items()}
    invalid = {qid: errors for qid, errors in invalid.items() if errors}
    if invalid and not allow_partial:
        raise ValueError('Invalid solution drafts: ' + json.dumps(invalid, ensure_ascii=False))
    for qid in invalid:
        del solutions[qid]
    missing = sorted(expected-set(solutions))

    image_paths = {}
    image_files = []
    for path in sorted(image_dir.glob('*.json')):
        image_bundle = snapshot(path)
        if image_bundle.get('schemaVersion') != 1 or image_bundle.get('mimeType') != 'image/webp':
            raise ValueError(f'Invalid image bundle {path.name}')
        for qid in image_bundle['images']:
            if qid in image_paths or qid not in expected or source[qid]['examKey'] != image_bundle['examKey']:
                raise ValueError(f'Duplicate or unexpected image {qid} in {path.name}')
            image_paths[qid] = f'data/images/{path.name}'
        image_files.append({'path': f'data/images/{path.name}', 'examKey': image_bundle['examKey'],
                            'imageCount': len(image_bundle['images']), 'sha256': sha256(snapshots[path])})
    if set(image_paths) != expected:
        raise ValueError(f'Expected all 715 bundled originals; missing {sorted(expected-set(image_paths))[:20]}')

    result = copy.deepcopy(metadata)
    questions = []
    for previous in metadata['questions']:
        qid = previous['id']
        q = copy.deepcopy(previous)
        parsed = source[qid]
        for key in SOURCE_KEYS:
            if key in parsed:
                q[key] = copy.deepcopy(parsed[key])
        if qid in reviewed:
            for key, value in reviewed[qid].items():
                if key not in CLASSIFICATION_KEYS:
                    q[key] = copy.deepcopy(value)
            q.pop('imageBundle', None)
            if qid == '2708':
                # The all-years PDF predates the user's corrected 2027 source.
                # Auxiliary text must use the same authoritative version as UI.
                q['sourceText'] = q['text']
                q['sourceStem'] = q['text'].split('①', 1)[0].rstrip()
        else:
            q.update(sourceAccess='bundled', imageBundle=image_paths[qid], image=parsed['assetPath'],
                     thumbnail=parsed['assetPath'], sourcePdf='', textStatus='원본 이미지 보존 · PDF 문자층 공백·줄바꿈 및 수식 복원',
                     answerBasis=ANSWER_BASIS)
            for key in SOLUTION_KEYS:
                q.pop(key, None)
            if qid in solutions:
                solution = solutions[qid]
                for key in SOLUTION_KEYS:
                    if key in solution:
                        q[key] = copy.deepcopy(solution[key])
                derived = solution.get('derivedAnswer', solution.get('answer'))
                marked = parsed['sourceMarkedAnswer']
                conflict = derived != marked or solution.get('answerStatus') == 'source-conflict'
                q.update(answer=marked, derivedAnswer=derived,
                         answerStatus='source-conflict' if conflict else 'source-and-solution-agree')
                if conflict:
                    q['answerIssue'] = solution.get('answerIssue') or f'원본 표시 {marked}번과 자체 풀이 {derived}번이 일치하지 않습니다. 원본과 풀이를 함께 검토해 주세요.'
                q['reviewNotes'] = list(q.get('reviewNotes', []))
            else:
                q.update(answer=None, answerStatus='not-reviewed', confidence='not-reviewed')
                q.pop('derivedAnswer', None)
        questions.append(q)
    result['questions'] = questions
    complete = not missing
    result['publicationMode'] = 'full-content' if complete else 'partial-content'
    result['exam'].update(reviewedQuestionCount=40+len(solutions),
                          status='전체 원본·파싱 텍스트 · 자체 해설 초안' if complete else '원본·파싱 텍스트 및 자체 해설 일부 작성 중',
                          answerSource=ANSWER_BASIS, reviewStatus='자체 해설 초안 · 공식 정답표 외부 대조 미완료')
    result.setdefault('classificationPolicy', {})['review'] = '2027 수정본의 원문·정답·해설을 보존한다. 나머지 문항은 제공 원본 표시와 자체 풀이를 대조한 해설 초안이며 외부 공식 정답표와 대조하지 않았다. 불일치는 숨기거나 정답키에 맞춰 고치지 않는다.'
    for exam in result.get('exams', []):
        if exam['key'] != '2027':
            exam['sourcePdf'] = ''
    public_report = sanitized(report)
    public_report.update(schemaVersion=1, description='원본 이미지·선지 표시 정답·PDF 문자층 파싱 및 복원 검증',
                         sourceExtractionSha256=sha256(snapshots[source_path]))
    report_bytes = json_bytes(public_report)
    manifest = copy.deepcopy(original_manifest)
    manifest.update(publicationMode=result['publicationMode'],
                    reviewedQuestionIds=[q['id'] for q in questions if q['answerStatus'] != 'not-reviewed'],
                    unreviewedQuestionCount=len(missing), solutionQuestionCount=40+len(solutions),
                    optionExplanationCount=sum(len(q.get('options', [])) for q in questions),
                    solutionFiles=[{'path': f'data/solutions/{name}', 'questionCount': len(rows), 'sha256': sha256(payload)} for name, rows, payload in batches],
                    sourceParseReportSha256=sha256(report_bytes),
                    sourceParseInputReportSha256=sha256(snapshots[report_path]),
                    sourceParsedQuestionsSha256=sha256(snapshots[source_path]),
                    imageCount=len(image_paths), imageBundleFiles=image_files,
                    sourceContentRequestedDate='2026-10-26',
                    publicationApprovalStatus='pending-exact-public-destination-confirmation',
                    sourcePayloadAuthorizationScope='사용자가 모든 문항의 원본 이미지·파싱 텍스트·해설 작성을 요청했다. 원문을 공개 GitHub 저장소에 게시하는 자동 승인 검토는 정확한 대상과 payload의 추가 확인을 요구해 보류 중이다.',
                    answerSource=ANSWER_BASIS, incompleteSolutionIds=missing, invalidSolutionDrafts=invalid)
    for path, payload in snapshots.items():
        if path.read_bytes() != payload:
            raise ValueError(f'Input changed during build: {path.name}; rerun after the writer finishes.')
    outputs = {output_dir/'archive-manifest.json': json_bytes(manifest),
               output_dir/'source-parsing-report.json': report_bytes,
               **{output_dir/'solutions'/name: payload for name, _, payload in batches},
               output_dir/'archive.json': json_bytes(result)}
    for path, payload in outputs.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_name(path.name+'.tmp')
        temporary.write_bytes(payload)
        temporary.replace(path)
    print(f'Built {result["publicationMode"]}: {len(questions)} originals / {40+len(solutions)} analyses / {manifest["optionExplanationCount"]} option explanations / {len(image_paths)} bundled images.')
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-dir', type=Path, default=ROOT.parents[1]/'source-audit')
    parser.add_argument('--allow-partial', action='store_true')
    parser.add_argument('--output-dir', type=Path, default=ROOT/'data')
    args = parser.parse_args()
    try:
        build(args.source_dir.resolve(), allow_partial=args.allow_partial, output_dir=args.output_dir.resolve())
    except (ValueError, KeyError) as error:
        parser.exit(1, f'Build stopped without publishing: {error}\n')


if __name__ == '__main__':
    main()
