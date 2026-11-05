"""Publish question-specific lecture narration over verified solution stages.

Run after rebuilding the source solutions and their image highlights.  Authored
reason/bridge files and body overrides stay reviewable independently of JSON.
"""
import copy
import json
from pathlib import Path
import re
from build_written_solutions import ALIASES
from build_geometry_solutions import build as build_geometry
from lecture_voice import speak

ROOT=Path(__file__).resolve().parents[1]

def build():
    path=ROOT/'data/solutions.json'
    catalog=json.loads(path.read_text());before=copy.deepcopy(catalog)
    guidance={}
    for source in sorted((ROOT/'content').glob('reader-guidance-*.txt')):
        for block in source.read_text().split('@@ ')[1:]:
            qid,*lines=block.strip().splitlines();assert qid not in guidance,qid
            guidance[qid]=[]
            for line in lines:
                reason,bridge=line.split(' || ',1)
                guidance[qid].append({'reason':reason,'bridge':bridge})
    for qid,original in ALIASES.items():guidance[qid]=copy.deepcopy(guidance[original])
    overrides=json.loads((ROOT/'content/teacher-body-overrides.json').read_text())
    assert set(guidance)==set(catalog['items'])
    stages=paragraphs=0
    for qid,item in catalog['items'].items():
        teaching=item['teaching'];count=len(item['steps'])
        assert len(guidance[qid])==count,qid
        if qid in overrides:assert set(overrides[qid])==set(map(str,range(count))),qid
        item['idea']=speak(item['idea'])
        teaching['approach']={str(i):v for i,v in enumerate(guidance[qid])}
        for i in range(count):
            j=str(i);body=overrides.get(qid,{}).get(j,teaching['stage_body'][j])
            teaching['stage_body'][j]=[speak(p) for p in body]
            teaching['stage_result'][j]=teaching['stage_body'][j][-1]
            plan=teaching['approach'][j]
            item['steps'][i]=' '.join([plan['reason'],plan['bridge'],*teaching['stage_body'][j]])
            paragraphs+=len(body);stages+=1
        key=teaching['approach'][str(teaching['key_step'])]
        teaching['why']=key['reason']+' '+key['bridge']
        item['explanation_revision']='lecture-1'
        # Corrections below are literal OCR corrections verified on the image.
        if qid=='2027-09-15':
            for region in teaching['sources']:
                region['quote']=region['quote'].replace('(2ax+1)','(2x+1)')
                if region['quote']=='모든 실수  에 대하여':region['quote']='모든 실수 $a$에 대하여'
        assert item['answer']==before['items'][qid]['answer'],qid
        assert item['logic']==before['items'][qid]['logic'],qid
        assert teaching['focus']==before['items'][qid]['teaching']['focus'],qid
        assert [s['rect'] for s in teaching['sources']]==[s['rect'] for s in before['items'][qid]['teaching']['sources']],qid
        for text in [item['idea'],*item['steps']]:
            assert text.count('$')%2==0,(qid,text)
            assert not re.search(r'[\x00-\x08\x0b\x0c\ue000-\uf8ff]',text),(qid,text)
            assert not re.search(r'(?<!\\)\d+\s*/\s*\d+',text),(qid,text)
    qs=json.loads((ROOT/'data/questions.json').read_text())['items']
    q=next(q for q in qs if q['id']=='2027-09-15')
    statement=q['statement_latex'].replace('(2ax+1)','(2x+1)').replace('모든 실수 에 대하여','모든 실수 $a$에 대하여')
    catalog.setdefault('question_overrides',{}).setdefault(q['id'],{})['statement_latex']=statement
    path.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
    build_geometry()
    gp=ROOT/'data/geometry.json';geo=json.loads(gp.read_text())
    geo['revision']='lecture-1'
    for plot in geo['plots'].values():
        if plot.get('caption'):plot['caption']=speak(plot['caption'])
    gp.write_text(json.dumps(geo,ensure_ascii=False,separators=(',',':'))+'\n')
    print(f'{len(catalog["items"])} lecture solutions; {stages} authored stages; {paragraphs} calculation paragraphs; {len(overrides)} individually revised calculation sets')

if __name__=='__main__':build()
