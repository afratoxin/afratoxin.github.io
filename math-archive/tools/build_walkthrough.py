"""Attach exact source-image regions and source references to the written steps."""
from pathlib import Path
import json,re,sys,math,collections
import fitz
from PIL import Image
from build_archive import marker_spans,glyphs,transcription
ROOT=Path(__file__).resolve().parents[1]
SCALE=1.7

def clean_math_quotes(text):
    # Keep explanations outside math; the source image remains authoritative.
    return text.strip()

def normalize(s):
    s=re.sub(r'\\(?:dfrac|tfrac)',r'\\frac',s)
    s=re.sub(r'\\(?:overline|left|right|,|;|!|quad|qquad)', '',s)
    return re.sub(r'[\s{}$]', '',s).replace('′',"'")

def features(s):
    korean=''.join(re.findall('[가-힣]+',s))
    words=set(re.findall('[가-힣]{2,}',s))
    terms=set('K:'+korean[i:i+3] for i in range(len(korean)-2))
    terms|={'W:'+w for w in words}
    for m in re.findall(r'\$([^$]+)\$',s):
        n=normalize(m)
        if len(n)>2:terms.add('M:'+n)
        terms|={'E:'+p for p in re.findall(r"[a-zA-Z]+(?:'+)?(?:_\(?[a-zA-Z0-9]+\)?)?(?:\([^()]*\))?",n) if len(p)>1}
    return terms

def extract_regions(q,docs):
    filename=q['source_file']
    candidates=[ROOT.parent/'project_sources'/filename,ROOT.parent/'tmp'/filename]
    path=next((p for p in candidates if p.exists()),None)
    assert path,filename
    if str(path) not in docs:docs[str(path)]=fitz.open(path)
    page=docs[str(path)][q['source_page']-1]
    m=next(m for m in marker_spans(page) if m['number']==q['number'])
    x0=int((m['bbox'][0]-5)*SCALE);y0=int((m['bbox'][1]-16)*SCALE)
    o=q['original'];rect=fitz.Rect(x0/SCALE,y0/SCALE,(x0+o['width'])/SCALE,(y0+o['height'])/SCALE)
    pix=page.get_pixmap(matrix=fitz.Matrix(SCALE,SCALE),alpha=False)
    gray=Image.frombytes('RGB',(pix.width,pix.height),pix.samples).convert('L')
    _,_,lines=transcription(glyphs(page,rect),gray,SCALE,with_regions=True)
    result=[]
    for line in lines:
        text=line['text'].strip()
        if not text or re.match(r'^[①②③④⑤]',text):continue
        # Diagram labels are not prose conditions.
        if not re.search('[가-힣]',text) and len(normalize(text))<4:continue
        if re.search('확인사항|답안지|단답형|5지선다형',text):continue
        b=line['bbox'];px=[b[0]*SCALE-x0,b[1]*SCALE-y0,b[2]*SCALE-x0,b[3]*SCALE-y0]
        if px[1]>=o['height'] or px[3]<=0:continue
        box=[max(0,px[0]-3)/o['width'],max(0,px[1]-2)/o['height'],min(o['width'],px[2]+3)/o['width'],min(o['height'],px[3]+2)/o['height']]
        assert all(-.001<=v<=1.001 for v in box),(q['id'],box)
        result.append({'quote':clean_math_quotes(text),'rect':[round(v,5) for v in box]})
    # Every source quote is extracted from the exact question page and image crop.
    assert result,q['id']
    return result

def choose_focus(regions,step,why=''):
    # Match the actual expressions and condition vocabulary, never answer choices.
    query=features(step+' '+why)
    docs=[features(r['quote']) for r in regions]
    df=collections.Counter(t for d in docs for t in d)
    scores=[]
    for i,(r,terms) in enumerate(zip(regions,docs)):
        shared=query&terms
        score=sum((5 if t.startswith('M:') else 2 if t.startswith('E:') else 1)*math.log(2+len(docs)/(1+df[t])) for t in shared)
        # Exact stated equalities are stronger than isolated variable mentions.
        for expr in re.findall(r'\$([^$]+)\$',r['quote']):
            n=normalize(expr)
            if len(n)>3 and n in normalize(step):score+=18
        if re.search('구하|값은|넓이는|확률은|개수는',r['quote']):score*=.65
        scores.append((score,i))
    scores.sort(reverse=True)
    if not scores or scores[0][0]<3:return []
    best=scores[0][1];ids={best}
    # Keep a wrapped condition readable as a whole sentence, up to three lines.
    if best>0 and not re.match(r'^(?:\d+\.|\([가나다라]\)|[ㄱㄴㄷ])',regions[best]['quote']) and not re.search(r'[다요][.。]|\[4점\]',regions[best-1]['quote']):ids.add(best-1)
    if best+1<len(regions) and not re.search(r'[다요][.。]|\[4점\]',regions[best]['quote']) and not re.match(r'^\([가나다라]\)',regions[best+1]['quote']):ids.add(best+1)
    return sorted(ids)

def build():
    catalog=json.loads((ROOT/'data/solutions.json').read_text())
    qs={q['id']:q for q in json.loads((ROOT/'data/questions.json').read_text())['items']}
    overrides=json.loads((ROOT/'content/walkthrough-focus.json').read_text())
    extra=json.loads((ROOT/'content/walkthrough-extra-regions.json').read_text())
    cache_path=ROOT.parent/'tmp/walkthrough-source-regions.json'
    cache=json.loads(cache_path.read_text()) if cache_path.exists() else {}
    docs={};report=[];fallback=0
    for qid,solution in catalog['items'].items():
        q=qs[qid]
        previous=cache.get(qid,{})
        regions=previous['sources'] if previous.get('hash')==q['content_hash'] else extract_regions(q,docs)
        cache[qid]={'hash':q['content_hash'],'sources':regions}
        regions=regions+extra.get(qid,[])
        teaching=solution['teaching'];focus=[]
        for i,step in enumerate(solution['steps']):
            spec=overrides.get(qid,{}).get(str(i))
            if spec is not None:
                ids=[]
                for needle in spec:
                    if isinstance(needle,int):
                        assert 0<=needle<len(regions),(qid,i,needle)
                        ids.append(needle)
                        continue
                    matches=[j for j,r in enumerate(regions) if normalize(needle) in normalize(r['quote'])]
                    assert matches,(qid,i,needle,[r['quote'] for r in regions])
                    ids.extend(matches)
                ids=sorted(set(ids))
            else:ids=choose_focus(regions,step,teaching['why'] if i==teaching['key_step'] else '')
            if not ids:fallback+=1
            focus.append(ids)
            report.append({'id':qid,'step':i,'source':[regions[j]['quote'] for j in ids],'reading':step})
        teaching['sources']=regions;teaching['focus']=focus
    from combinatorics_notation import convert_tree
    catalog=convert_tree(catalog)
    (ROOT/'data/solutions.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
    cache_path.write_text(json.dumps(cache,ensure_ascii=False))
    (ROOT.parent/'tmp/walkthrough-focus-review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(f'{len(catalog["items"])} question images, {len(report)} linked steps; {fallback} steps use prior results without guessing an image highlight')
if __name__=='__main__':build()

