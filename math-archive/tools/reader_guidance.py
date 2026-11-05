"""Join individually reviewed reasoning bridges to each calculation stage.

No inferred or generic fallback: every published stage needs an authored entry.
The original stage boundaries are retained for the source-image annotations.
"""
from pathlib import Path
import copy
import json
import re

def sentences(text):
    protected=[]
    def hide(match):
        protected.append(match[0])
        return '\x01'+str(len(protected)-1)+'\x02'
    text=re.sub(r'\$[^$]*\$',hide,text)
    parts=re.split(r'(?<=[다요죠음임])\.\s+',text)
    return [re.sub(r'\x01(\d+)\x02',lambda m:protected[int(m[1])],p+('.' if i<len(parts)-1 else '')) for i,p in enumerate(parts) if p]

def apply(catalog, root: Path, aliases):
    guidance={}
    for path in sorted((root/'content').glob('reader-guidance-*.txt')):
        for block in path.read_text().split('@@ ')[1:]:
            qid,*lines=block.strip().splitlines()
            assert qid not in guidance,qid
            guidance[qid]=[]
            for line in lines:
                reason,bridge=line.split(' || ',1)
                assert reason and bridge,(qid,line)
                guidance[qid].append({'reason':reason,'bridge':bridge})
    revisions=json.loads((root/'content/reader-revisions.json').read_text())
    for qid,original in aliases.items():
        guidance[qid]=copy.deepcopy(guidance[original])
    assert set(guidance)==set(catalog['items']),set(catalog['items'])-set(guidance)
    total=0
    for qid,item in catalog['items'].items():
        teaching=item['teaching']
        assert len(guidance[qid])==len(item['steps']),(qid,len(guidance[qid]),len(item['steps']))
        body={};results={}
        for i,step in enumerate(item['steps']):
            override=revisions.get(qid,{}).get(str(i))
            detail_paragraphs=[part for note in teaching.get('details',{}).get(str(i),[]) for part in sentences(note)]
            # Explain a detailed derivation before its compressed result, never
            # place the justification after the answer it is meant to support.
            paragraphs=override if override else detail_paragraphs+sentences(step)
            results[str(i)]=override[-1] if override else sentences(step)[-1]
            # Do not repeat an identical paragraph when legacy notes overlap.
            body[str(i)]=list(dict.fromkeys(paragraphs))
            texts=[guidance[qid][i]['reason'],guidance[qid][i]['bridge'],*body[str(i)]]
            for text in texts:
                assert text.count('$')%2==0,(qid,i,text)
                assert re.search('[가-힣]',re.sub(r'\$[^$]*\$','',text)),(qid,i,text)
                assert not re.search('[\u3040-\u30ff\u4e00-\u9fff]',text),(qid,i,text)
                assert not any(re.search('[가-힣]',m) for m in re.findall(r'\$([^$]*)\$',text)),(qid,i,text)
            item['steps'][i]=' '.join(texts)
            total+=1
        teaching['approach']={str(i):v for i,v in enumerate(guidance[qid])}
        teaching['stage_body']=body
        teaching['stage_result']=results
        teaching['key_paragraph']={'2023-11-22':3}.get(qid,0)
        key=guidance[qid][teaching['key_step']]
        teaching['why']=key['reason']+' '+key['bridge']
        teaching.pop('details',None)
        teaching.pop('readings',None)
        item['explanation_revision']='reader-first-1'
    print(f'{len(guidance)} individually reviewed solutions; {total} authored reasoning bridges')
