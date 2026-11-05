"""Build authored geometric readings and exact SVG plot specifications."""
import copy
import json
from pathlib import Path
from geometry_plots import plots

ROOT=Path(__file__).resolve().parents[1]

def readable_math(value):
    if isinstance(value,str):return value.replace('\\frac','\\dfrac')
    if isinstance(value,list):return [readable_math(v) for v in value]
    if isinstance(value,dict):return {k:readable_math(v) for k,v in value.items()}
    return value

def build():
    original=json.loads((ROOT/'data/solutions.json').read_text())['items']
    diagrams=plots()
    items={}
    qid=None
    for line in (ROOT/'content/graph-solutions.txt').read_text().splitlines():
        if not line.strip() or line.startswith('#'): continue
        key,_,text=line.partition(' ')
        if key=='@@':
            qid=text
            assert qid in original,qid
            items[qid]={'idea':'','stages':[]}
        elif key=='IDEA':items[qid]['idea']=text
        elif key=='CORE':items[qid]['core']=int(text)
        elif key=='STEP':items[qid]['stages'].append({'title':text,'body':[]})
        elif key=='WHY':items[qid]['stages'][-1]['reason']=text
        elif key=='BRIDGE':items[qid]['stages'][-1]['bridge']=text
        elif key=='TEXT':items[qid]['stages'][-1]['body'].append(text)
        elif key=='PLOT':items[qid]['stages'][-1]['plot']=text
        elif key=='REF':items[qid]['stages'][-1]['ref']=int(text)
        elif key=='FOCUS':items[qid]['stages'][-1]['focus']=[int(x) for x in text.split(',')]
        elif key=='CONTINUE':items[qid]['continue']=True
        else:raise ValueError(line)
    result={}
    for qid,note in items.items():
        src=original[qid];teaching=src['teaching']
        out={'idea':note['idea'],'steps':[],'teaching':{'key_step':note.get('core',0),'key_paragraph':1 if qid=='2023-11-22' else 0,'why':note['stages'][note.get('core',0)]['reason'],'approach':{},'stage_body':{},'stage_result':{},'focus':[],'plots':{},'step_titles':{}}}
        t=out['teaching']
        for i,stage in enumerate(note['stages']):
            assert stage.get('reason') and stage['body'],(qid,i)
            j=str(i);body=stage['body']
            t['approach'][j]={'reason':stage['reason'],'bridge':stage.get('bridge','')}
            t['stage_body'][j]=body;t['stage_result'][j]=body[-1];t['step_titles'][j]=stage['title']
            focus=stage.get('focus',teaching['focus'][stage.get('ref',0)])
            assert all(0<=v<len(teaching['sources']) for v in focus),(qid,focus)
            t['focus'].append(focus)
            if stage.get('plot'):
                assert stage['plot'] in diagrams,stage['plot']
                t['plots'][j]=stage['plot']
            out['steps'].append(' '.join(body))
        if note.get('continue'):
            for i,step in enumerate(src['steps']):
                j=str(len(out['steps']));t['approach'][j]=copy.deepcopy(teaching['approach'][str(i)])
                t['stage_body'][j]=copy.deepcopy(teaching['stage_body'][str(i)])
                t['stage_result'][j]=teaching['stage_result'][str(i)];t['focus'].append(teaching['focus'][i])
                t['step_titles'][j]='이제 계산을 이어갈게요'
                out['steps'].append(step)
        assert len(out['steps'])==len(t['focus'])
        result[qid]=out
    target=ROOT/'data/geometry.json'
    target.write_text(json.dumps(readable_math({'revision':'geometry-1','items':result,'plots':diagrams}),ensure_ascii=False,separators=(',',':'))+'\n')
    print(f'{len(result)} geometric solutions, {len(diagrams)} plots, {sum(len(x["steps"]) for x in result.values())} stages')
    return result,diagrams

if __name__=='__main__':build()

