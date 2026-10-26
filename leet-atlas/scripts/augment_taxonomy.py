"""Apply reviewed, additive type/logic refinements without replacing source data.

The normalized definitions and assignments in data/type-refinements.json are
self-contained. This builder does not read lecture PDFs or private audit files.
"""
import argparse
import copy
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def augment_archive(archive, refinements):
    """Return an augmented copy, rejecting invalid assignments before writing."""
    result = copy.deepcopy(archive)
    questions = {q['id']: q for q in result['questions']}
    taxonomy = {tag['id']: tag for tag in result['taxonomy']}
    if len(questions) != len(result['questions']):
        raise ValueError('Duplicate question IDs')
    if len(taxonomy) != len(result['taxonomy']):
        raise ValueError('Duplicate taxonomy IDs')

    definitions = refinements.get('definitions', [])
    definition_ids = set()
    for definition in definitions:
        tag_id = definition.get('id')
        if not tag_id or tag_id in definition_ids:
            raise ValueError(f'Duplicate or missing refinement ID: {tag_id}')
        definition_ids.add(tag_id)
        if definition.get('axis') not in ('type', 'logic') or not definition.get('label') or not definition.get('description'):
            raise ValueError(f'Incomplete type/logic definition: {tag_id}')
        if tag_id in taxonomy:
            existing = taxonomy[tag_id]
            for key, value in definition.items():
                if key != 'count' and existing.get(key) != value:
                    raise ValueError(f'Refinement conflicts with existing taxonomy: {tag_id}.{key}')
        else:
            tag = copy.deepcopy(definition)
            tag.pop('count', None)
            result['taxonomy'].append(tag)
            taxonomy[tag_id] = tag

    for tag_id, tag in taxonomy.items():
        current = tag
        seen = {tag_id}
        while current.get('parentTagId'):
            parent_id = current['parentTagId']
            if parent_id not in taxonomy:
                raise ValueError(f'Unknown parent tag: {parent_id}')
            if parent_id in seen:
                raise ValueError(f'Cyclic taxonomy parent: {parent_id}')
            parent = taxonomy[parent_id]
            if current.get('parentLabel') != parent['label']:
                raise ValueError(f'Parent label mismatch: {current["id"]}')
            if current['axis'] != parent['axis']:
                raise ValueError(f'Parent axis mismatch: {current["id"]}')
            seen.add(parent_id)
            current = parent

    assignments_seen = set()
    for assignment in refinements.get('assignments', []):
        question_id, tag_id = assignment.get('questionId'), assignment.get('tagId')
        if question_id not in questions:
            raise ValueError(f'Unknown question assignment: {question_id}')
        if tag_id not in definition_ids:
            raise ValueError(f'Unknown refinement assignment: {tag_id}')
        if not isinstance(assignment.get('reason'), str) or not assignment['reason'].strip():
            raise ValueError(f'Missing assignment reason: {question_id}/{tag_id}')
        if (question_id, tag_id) in assignments_seen:
            raise ValueError(f'Duplicate assignment: {question_id}/{tag_id}')
        assignments_seen.add((question_id, tag_id))
        q, tag = questions[question_id], taxonomy[tag_id]
        tags = q.setdefault('tags', [])
        labels = q.setdefault('types' if tag['axis'] == 'type' else 'logic', [])
        reasons = q.setdefault('tagReasons', {})
        parent_id = tag.get('parentTagId')
        if parent_id and parent_id not in tags:
            parent_reason = assignment.get('parentAdditionReason')
            if not isinstance(parent_reason, str) or not parent_reason.strip():
                raise ValueError(f'Missing parent addition reason: {question_id}/{parent_id}')
            tags.append(parent_id)
            if tag['parentLabel'] not in labels:
                labels.append(tag['parentLabel'])
            reasons.setdefault(parent_id, parent_reason)
            if tag['axis'] == 'logic':
                reasons.setdefault(tag['parentLabel'], parent_reason)
        if tag_id not in tags:
            tags.append(tag_id)
        if tag['label'] not in labels:
            labels.append(tag['label'])
        reasons.setdefault(tag_id, assignment['reason'])
        if tag['axis'] == 'logic':
            reasons.setdefault(tag['label'], assignment['reason'])

    counts = {tag_id: 0 for tag_id in taxonomy}
    for q in result['questions']:
        if len(q.get('tags', [])) != len(set(q.get('tags', []))):
            raise ValueError(f'Duplicate question tags: {q["id"]}')
        for tag_id in q.get('tags', []):
            if tag_id not in taxonomy:
                raise ValueError(f'Unknown question tag: {q["id"]}/{tag_id}')
            counts[tag_id] += 1
    for tag_id, tag in taxonomy.items():
        tag['count'] = counts[tag_id]
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--archive', type=Path, default=ROOT / 'data/archive.json')
    parser.add_argument('--refinements', type=Path, default=ROOT / 'data/type-refinements.json')
    parser.add_argument('--output', type=Path, help='Defaults to updating --archive')
    parser.add_argument('--manifest', type=Path, help='Optionally refresh only taxonomyCount')
    args = parser.parse_args()
    try:
        archive = json.loads(args.archive.read_text(encoding='utf-8'))
        refinements = json.loads(args.refinements.read_text(encoding='utf-8'))
        augmented = augment_archive(archive, refinements)
    except (ValueError, KeyError, TypeError) as error:
        parser.error(str(error))
    output = args.output or args.archive
    output.write_text(json.dumps(augmented, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    if args.manifest:
        manifest = json.loads(args.manifest.read_text(encoding='utf-8'))
        manifest['taxonomyCount'] = len(augmented['taxonomy'])
        args.manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    print(f'Augmented {len(augmented["questions"])} questions; '
          f'{len(refinements["definitions"])} refinement definitions; '
          f'{len(refinements["assignments"])} reviewed memberships; '
          f'{len(augmented["taxonomy"])} taxonomy entries.')


if __name__ == '__main__':
    main()
