"""Build a source-faithful, auditable question archive from supplied KICE PDFs.

The original crop is authoritative. Transcriptions never silently become verified.
Only 2015-curriculum items are selected; the 2021 A/B papers keep their provenance.
"""
from __future__ import annotations
import base64, collections, hashlib, io, json, math, re, sys
from pathlib import Path
import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / 'project_sources'
MAP = {
  0xe000:'A',0xe001:'B',0xe002:'C',0xe005:'F',0xe006:'G',0xe00c:'M',0xe00e:'O',0xe011:'R',0xe012:'S',0xe017:'X',0xe018:'Y',0xe019:'Z',
  **{0xe034+i:str(i+1) for i in range(9)},0xe03d:'0',0xe03e:'!',
  0xe044:'(',0xe045:')',0xe046:'-',0xe047:'=',0xe048:'+',0xe049:'[',0xe04a:']',0xe04b:r'\{',0xe04c:r'\}',0xe04d:r'\mid ',0xe04f:':',0xe052:',',0xe053:'.',0xe055:'<',0xe056:'>',
  0xe05b:r'\int ',0xe05c:r'\sqrt',0xe067:r'\sum ',0xe06d:'BAR',
  0xe078:r'\{',0xe079:'',0xe07a:'',0xe07b:'',
  0xe09d:r'\alpha ',0xe09e:r'\beta ',0xe0a4:r'\theta ',0xe0ac:r'\pi ',0xe0ae:r'\sigma ',
  **{0xe0e5+i:chr(ord('a')+i) for i in range(26)},
  0xe100:r'\lceil ',0xe101:'|',0xe102:r'\rceil ',0xe103:'[',0xe104:']',0xe105:'|',
}
UNI = {'→':r'\to ','∞':r'\infty ','×':r'\times ','≤':r'\le ','≥':r'\ge ','≠':r'\ne ','∩':r'\cap ','∪':r'\cup ','∠':r'\angle ','⊂':r'\subset ','∅':r'\varnothing ','∘':r'\circ ','⋯':r'\cdots ','°':r'^\circ '}
# Manually determined by reading each 2021 A-type problem against its syllabus.
A_CALCULUS = {
 '2021-06-a':{2,5,7,10,11,16,20,25,28,30},
 '2021-09-a':{2,4,6,7,8,15,18,20,23,25,28,30},
 '2021-11-a':{2,7,8,11,14,15,18,20,23,24,28,30},
}
A_UNITS = {
 '2021-06-a': {1:'E',3:'S',4:'C',6:'E',8:'C',9:'E',12:'E',13:'P',14:'T',15:'S',17:'P',18:'E',19:'P',21:'S',22:'C',23:'T',24:'S',26:'S',27:'P',29:'C'},
 '2021-09-a': {1:'E',3:'P',5:'V',9:'C',10:'S',11:'E',12:'T',13:'E',14:'V',16:'S',17:'P',19:'P',21:'T',22:'C',24:'E',26:'V',27:'S',29:'C'},
 '2021-11-a': {1:'E',3:'T',4:'P',5:'E',6:'V',9:'P',10:'T',12:'V',13:'E',16:'S',17:'V',19:'P',21:'S',22:'C',25:'S',26:'C',27:'E',29:'C'},
}
UNIT_KEYS={
 'E':('수학Ⅰ','지수함수와 로그함수','지수·로그의 성질과 활용'),
 'T':('수학Ⅰ','삼각함수','삼각함수의 성질과 활용'),
 'S':('수학Ⅰ','수열','수열의 일반항과 항 사이의 관계'),
 'L':('수학Ⅱ','함수의 극한과 연속','함수의 극한과 연속'),
 'D':('수학Ⅱ','미분','다항함수의 미분과 도함수의 활용'),
 'I':('수학Ⅱ','적분','다항함수의 적분과 정적분의 활용'),
 'C':('확률과 통계','경우의 수','경우 분류와 조합'),
 'P':('확률과 통계','확률','수학적 확률'),
 'V':('확률과 통계','통계','확률분포'),
}
def decode(s):
    return ''.join(MAP.get(ord(c),UNI.get(c,c)) for c in s)

def bbox_union(items):
    return [min(c['bbox'][0] for c in items),min(c['bbox'][1] for c in items),max(c['bbox'][2] for c in items),max(c['bbox'][3] for c in items)]

def marker_spans(page):
    out=[]
    for b in page.get_text('dict')['blocks']:
      for l in b.get('lines',[]):
       for s in l['spans']:
        m=re.fullmatch(r'\s*(\d{1,2})\.\s*',s['text'])
        if m and 11<s['size']<17 and 65<s['bbox'][0]<page.rect.width-70 and 105<s['bbox'][1]<page.rect.height-100:
            out.append({'number':int(m[1]),'bbox':s['bbox']})
    return sorted(out,key=lambda m:(m['bbox'][0]>page.rect.width/2,m['bbox'][1]))

def glyphs(page,rect):
    out=[]
    for b in page.get_text('rawdict')['blocks']:
     for l in b.get('lines',[]):
      for s in l['spans']:
       for c in s['chars']:
        bb=c['bbox'];cx=(bb[0]+bb[2])/2;cy=(bb[1]+bb[3])/2
        if rect.x0<=cx<=rect.x1 and rect.y0<=cy<=rect.y1:
          out.append(dict(c, size=s['size'], font=s['font'], math='EQ' in s['font']))
    return out

def bar_y(c,gray,scale):
    # Locate the actual ink of a stretched HWP rule, rather than its font bbox.
    x0,y0,x1,y1=c['bbox'];reg=gray.crop((int(x0*scale),int(y0*scale),math.ceil(x1*scale),math.ceil(y1*scale)))
    w,h=reg.size
    if not w or not h:return c['origin'][1]-.4*c['size']
    vals=list(reg.getdata())
    rows=[sum(255-vals[y*w+x] for x in range(w)) for y in range(h)]
    return (int(y0*scale)+max(range(h),key=rows.__getitem__))/scale

def math_tex(chars,depth=0):
    """Recover fractions, radicals, limits and scripts from positioned glyphs."""
    if not chars:return ''
    if depth>9:return ''.join(decode(c['c']) for c in sorted(chars,key=lambda c:(c['bbox'][0],c['bbox'][1])) if c['c']!='\ue06d')
    chars=[dict(c) for c in chars if c['c'].strip() or c.get('tex')]
    if not chars:return ''
    # Rebuild the rows behind HWP's three-part tall cases brace.
    case_heads=[c for c in chars if c['c']=='\ue078']
    if case_heads:
      edge=min(c['bbox'][0] for c in case_heads)
      prefix=[c for c in chars if c['bbox'][2]<edge+1 and c['c'] not in ['\ue078','\ue079','\ue07a','\ue07b']]
      body=[c for c in chars if c['bbox'][0]>edge+4 and c['c'] not in ['\ue078','\ue079','\ue07a','\ue07b']]
      if body:
        rows=[]
        for c in sorted(body,key=lambda c:c['origin'][1]):
          for row in rows:
            if abs(row[0]-c['origin'][1])<7:row[1].append(c);break
          else:rows.append([c['origin'][1],[c]])
        if len(rows)>1:
          return math_tex(prefix,depth+1)+r'\begin{cases}'+r'\\'.join(math_tex(row[1],depth+1) for row in rows)+r'\end{cases}'
    # An outer fraction/radical is handled before smaller, nested rules.
    bars=sorted([c for c in chars if c['c']=='\ue06d'],key=lambda c:c['bbox'][2]-c['bbox'][0],reverse=True)
    for bar in bars:
      if bar not in chars:continue
      x0,y0,x1,y1=bar['bbox'];by=bar.get('rule_y',(y0+y1)/2)
      left_roots=[c for c in chars if c['c']=='\ue05c' and -3<x0-c['bbox'][2]<3 and abs(c['origin'][1]-bar['origin'][1])<bar['size']]
      other=[c for c in chars if c is not bar and x0-1<=(c['bbox'][0]+c['bbox'][2])/2<=x1+1 and abs(c['origin'][1]-by)<max(19,bar['size']*1.25)]
      if left_roots:
        root=min(left_roots,key=lambda c:abs(c['bbox'][2]-x0));inside=[c for c in other if c['bbox'][1]>=by-2 and c['bbox'][3]<=root['bbox'][3]+7]
        if inside:
          rad=math_tex(inside,depth+1)
          index=[c for c in chars if root['bbox'][0]-4<c['bbox'][0]<x0 and c['size']<root['size']*.78 and c['bbox'][3]<root['origin'][1]-root['size']*.25]
          tex=r'\sqrt'+('['+math_tex(index,depth+1)+']' if index else '')+'{'+rad+'}'
          take=[bar,root]+inside+index;bb=bbox_union(take)
          node={'c':'','tex':tex,'bbox':bb,'origin':(bb[0],max(c['origin'][1] for c in inside)),'size':max(c['size'] for c in inside)}
          chars=[c for c in chars if c not in take]+[node]
          continue
      upper=[c for c in other if c['origin'][1]<by+1]
      lower=[c for c in other if c['origin'][1]>by+3]
      if upper and lower:
        take=[bar]+upper+lower;bb=bbox_union(take)
        node={'c':'','tex':r'\frac{'+math_tex(upper,depth+1)+'}{'+math_tex(lower,depth+1)+'}','bbox':bb,'origin':(bb[0],by+3),'size':max(c['size'] for c in upper+lower)}
        chars=[c for c in chars if c not in take]+[node]
      elif lower:
        take=[bar]+lower;bb=bbox_union(take)
        node={'c':'','tex':r'\overline{'+math_tex(lower,depth+1)+'}','bbox':bb,'origin':(bb[0],max(c['origin'][1] for c in lower)),'size':max(c['size'] for c in lower)}
        chars=[c for c in chars if c not in take]+[node]
      else:chars.remove(bar)
    if not chars:return ''
    # Consolidate named operators before attaching their centered limits.
    ordered=sorted([c for c in chars if c['c'] in 'acgilmnost' and c['c']],key=lambda c:(c['bbox'][0],c['bbox'][1]))
    for name in ['lim','sin','cos','tan','log']:
      for i in range(len(ordered)-2):
        run=ordered[i:i+3]
        if ''.join(c['c'] for c in run)!=name:continue
        if max(c['origin'][1] for c in run)-min(c['origin'][1] for c in run)>2:continue
        bb=bbox_union(run);oy=sum(c['origin'][1] for c in run)/3
        node={'c':'','tex':'\\'+name+' ','bbox':bb,'origin':(bb[0],oy),'size':max(c['size'] for c in run)}
        if name=='lim':
          lower=[c for c in chars if c not in run and bb[0]-5<=(c['bbox'][0]+c['bbox'][2])/2<=bb[2]+5 and oy+2<c['origin'][1]<oy+17 and c['size']<node['size']*.85]
          if lower:node['tex']=r'\lim_{'+math_tex(lower,depth+1)+'}'
          chars=[c for c in chars if c not in lower]
        chars=[c for c in chars if c not in run]+[node]
    # A dominant baseline excludes the smaller indices in ordinary formulas.
    groups=[]
    ordinary=[c for c in chars if c.get('c') not in ['\ue05b','\ue067','\ue078','\ue079','\ue07a','\ue07b'] and c['size']<=14]
    for c in (ordinary or chars):
      if c.get('c') in ['\ue078','\ue079','\ue07a','\ue07b']:continue
      for g in groups:
        if abs(g[0]-c['origin'][1])<2:
          g[1].append(c);break
      else:groups.append([c['origin'][1],[c]])
    if not groups:return r'\{'
    main_size=max((c['size'] for c in ordinary),default=11)
    base_y,base_members=max(groups,key=lambda g:sum(max(1,c['bbox'][2]-c['bbox'][0]) for c in g[1] if c['size']>=main_size*.9))
    base_size=collections.Counter(round(c['size'],1) for c in base_members).most_common(1)[0][0]
    seq=sorted(chars,key=lambda c:(c['bbox'][0],c['bbox'][1]))
    tokens=[];used=set()
    for i,c in enumerate(seq):
      if i in used:continue
      if c['c'] in ['\ue079','\ue07a','\ue07b']:continue
      val=c.get('tex',decode(c['c']))
      if not val:continue
      is_script=c['size']<base_size*.86 and abs(c['origin'][1]-base_y)>1.55
      if is_script:
        group=[c];used.add(i)
        for j,d in enumerate(seq[i+1:],i+1):
          if j in used:continue
          if d['bbox'][0]-group[-1]['bbox'][2]>5:break
          if abs(d['origin'][1]-c['origin'][1])<2 and d['size']<base_size*.86:
            group.append(d);used.add(j)
        contents=math_tex(group,depth+1)
        mark='^' if c['origin'][1]<base_y else '_'
        if tokens:tokens[-1]+=mark+'{'+contents+'}'
        else:tokens.append('{}'+mark+'{'+contents+'}')
      else:tokens.append(val)
    tex=''.join(tokens)
    # HWP spells these operators using separate glyphs.
    tex=re.sub(r'(?<![a-zA-Z\\])(sin|cos|tan|log|lim)(?![a-zA-Z])',lambda m:'\\'+m[1]+' ',tex)
    tex=re.sub(r'\{\}_\{([^{}]+)\}(\\sum\s*)',r'\2_{\1}',tex)
    tex=tex.replace('BAR','').replace(r'\sqrt{',r'\sqrt{')
    return tex

def transcription(chars,gray,scale):
    for c in chars:
      if c['c'] in ['′','″']:
        c['c']="'" if c['c']=='′' else "''";c['math']=True
    for c in chars:
      if c['c']=='\ue06d':c['rule_y']=bar_y(c,gray,scale)
    case_blocks=[]
    for brace in list(chars):
      if brace not in chars or not (brace['c']=='\ue078' or brace['c']=='\ue04b' and brace['size']>=14):continue
      edge=brace['bbox'][0];bb=brace['bbox']
      parts=[c for c in chars if c['c'] in ['\ue078','\ue079','\ue07a','\ue07b'] and abs(c['bbox'][0]-edge)<12 and abs(c['origin'][1]-brace['origin'][1])<55]
      if parts:bb=bbox_union(parts+[brace])
      yy=next((c['origin'][1] for c in parts if c['c']=='\ue079'),brace['origin'][1]-(brace['size']-11)*.8)
      body=[c for c in chars if c['bbox'][0]>=edge+4 and bb[1]-15<c['bbox'][1]<bb[3]+2 and c not in parts and c is not brace]
      anchors=[]
      for c in sorted(body,key=lambda c:c['origin'][1]):
        if not c['c'].strip() or not 9<c['size']<=14 or c['c']=='\ue06d':continue
        if not anchors or c['origin'][1]-anchors[-1]>10:anchors.append(c['origin'][1])
      if len(anchors) not in [2,3] or not all(sum(abs(c['origin'][1]-a)<4 for c in body)>1 for a in anchors):continue
      prefix=[c for c in chars if c['math'] and c['bbox'][2]<=edge+1 and c['bbox'][0]>edge-100 and abs(c['origin'][1]-yy)<5]
      if not prefix or not any(c['c']=='\ue047' for c in prefix):continue
      rows=[]
      for a in anchors:
        row=[c for c in body if a==min(anchors,key=lambda y:abs(y-c['origin'][1]))]
        row=sorted(row,key=lambda c:c['bbox'][0]);segments=[];groups=[]
        for c in row:
          if not groups or c['math']!=groups[-1][-1]['math'] or c['bbox'][0]-groups[-1][-1]['bbox'][2]>10:groups.append([c])
          else:groups[-1].append(c)
        for g in groups:
          if g[0]['math']:segments.append(math_tex(g))
          else:
            raw=''.join(c['c'] for c in g).strip()
            if raw:segments.append(r'\text{'+raw.replace('\\',r'\textbackslash{}').replace('{',r'\{').replace('}',r'\}')+'}')
        rows.append(segments[0]+('&'+r'\;'.join(segments[1:]) if len(segments)>1 else '') if segments else '')
      if not all(rows):continue
      tex=math_tex(prefix)+r'\begin{cases}'+r'\\'.join(rows)+r'\end{cases}'
      take=prefix+body+parts+[brace];cover=bbox_union(take)
      case_blocks.append({'text':'$'+tex+'$','bbox':cover,'math':True})
      chars=[c for c in chars if c not in take]
    maths=[c for c in chars if c['math'] and c['c'].strip()]
    normal=[c for c in chars if not c['math']]
    parents=list(range(len(maths)))
    def find(i):
      while parents[i]!=i:parents[i]=parents[parents[i]];i=parents[i]
      return i
    for i,a in enumerate(maths):
      for j in range(i):
        b=maths[j];ar=fitz.Rect(a['bbox']);br=fitz.Rect(b['bbox'])
        gapx=max(ar.x0,br.x0)-min(ar.x1,br.x1);gapy=max(ar.y0,br.y0)-min(ar.y1,br.y1)
        script_link=min(a['size'],b['size'])<.82*max(a['size'],b['size']) and gapx<3 and gapy<6
        if (gapx<5 and gapy<1.6) or script_link:
          parents[find(i)]=find(j)
    components=collections.defaultdict(list)
    for i,c in enumerate(maths):components[find(i)].append(c)
    blocks=case_blocks[:];formulas=[{'latex':b['text'][1:-1],'bbox':[round(x,2) for x in b['bbox']]} for b in case_blocks]
    for cs in components.values():
      bb=bbox_union(cs);tex=math_tex(cs)
      if tex:
        formulas.append({'latex':tex,'bbox':[round(x,2) for x in bb]})
        blocks.append({'text':'$'+tex+'$','bbox':bb,'math':True})
    # Text lines are rebuilt from character origins; mathematical groups are atomic.
    for c in normal:
      blocks.append({'text':c['c'],'bbox':c['bbox'],'math':False})
    labels='①②③④⑤'
    options=[]
    markers=[next((b for b in blocks if b['text']==s),None) for s in labels]
    if all(markers) and all(sum(b['text']==s for b in blocks)==1 for s in labels):
      rows=[]
      for marker in sorted(markers,key=lambda b:(b['bbox'][1],b['bbox'][0])):
        cy=(marker['bbox'][1]+marker['bbox'][3])/2
        row=next((r for r in rows if abs(cy-r[0])<4),None)
        if row is None:rows.append((cy,[marker]))
        else:row[1].append(marker)
      parts={s:[] for s in labels}
      top=min(r[0] for r in rows)
      score_y=max(((b['bbox'][1]+b['bbox'][3])/2 for b in blocks if b['text']=='점'),default=0)
      for b in blocks:
        if b in markers:continue
        x=(b['bbox'][0]+b['bbox'][2])/2;cy=(b['bbox'][1]+b['bbox'][3])/2
        if cy<top-12 or cy<=score_y+5:continue
        ry,ms=min(rows,key=lambda r:abs(r[0]-cy))
        if abs(ry-cy)>(12 if b['math'] else 6):continue
        preceding=[m for m in ms if x>=m['bbox'][2]-1]
        if preceding:parts[max(preceding,key=lambda m:m['bbox'][0])['text']].append(b)
      if all(any(b['text'].strip() for b in v) for v in parts.values()):
        options=[(m,parts[m['text']]) for m in markers]
        taken={id(b) for m,bs in options for b in [m,*bs]}
        blocks=[b for b in blocks if id(b) not in taken]
    lines=[]
    for b in sorted(blocks,key=lambda b:(b['bbox'][1],b['bbox'][0])):
      cy=(b['bbox'][1]+b['bbox'][3])/2
      best=None
      for line in reversed(lines[-8:]):
        if abs(cy-line['cy'])<max(4,min(7,(b['bbox'][3]-b['bbox'][1])*.35)):
          best=line;break
      if best is None:lines.append({'cy':cy,'blocks':[b]})
      else:best['blocks'].append(b)
    out=[]
    for ln in sorted(lines,key=lambda l:l['cy']):
      pieces=sorted(ln['blocks'],key=lambda b:b['bbox'][0]);s='';prev=None
      for p in pieces:
        if prev and (p['bbox'][0]-prev['bbox'][2]>3 or p['math'] or prev['math']):s+=' '
        s+=p['text'];prev=p
      out.append(s.strip())
    if options:
      values=[]
      for marker,bs in options:
        s=marker['text']+' ';prev=None
        for p in sorted(bs,key=lambda b:b['bbox'][0]):
          if prev and (p['bbox'][0]-prev['bbox'][2]>3 or p['math'] or prev['math']):s+=' '
          s+=p['text'];prev=p
        values.append(s.strip())
      out.append('   '.join(values))
    return '\n'.join(out),formulas

def classify(text,stats_only=False):
    t=text.replace('$',''); concepts=[];unit='';subject=''
    def has(s):return bool(re.search(s,t))
    if stats_only or has('확률|사건.*대하여|정규분포|이항분포|표준편차|분산|신뢰|표본|기댓값|확률변수|이항정리|전개식|중복조합|원순열|순열|조합|경우의 수'):
      subject='확률과 통계'
      if has('정규분포|이항분포|확률변수|표준편차|분산|표본|신뢰|기댓값|모평균'):
        unit='통계'
        for pat,c in [('정규분포','정규분포와 표준화'),('이항분포','이항분포'),('확률밀도|연속확률변수','확률밀도함수와 넓이'),('확률변수|확률분포','확률변수와 확률분포'),('기댓값|평균|분산|표준편차|E\(|V\(','기댓값·분산·표준편차'),('표본평균|크기.*표본','표본평균의 분포'),('신뢰|모평균','모평균의 추정')]:
          if has(pat):concepts.append(c)
      elif has('확률|사건'):
        unit='확률';concepts=['수학적 확률']
        for pat,c in [('독립','사건의 독립'),('조건부|일 때[\s\S]*확률|P\([^\n]{0,35}\\\\mid','조건부확률'),('이거나|배반사건|합사건|\\\\cup','확률의 덧셈정리'),('여사건','여사건의 확률'),('반복|시행.*번|번.*시행','반복 시행의 경우 분류'),('주사위|카드|주머니|공','표본공간과 사건의 경우의 수')]:
          if has(pat):concepts.append(c)
      else:
        unit='경우의 수';concepts=['경우의 수']
        for pat,c in [('전개식|이항정리','이항정리'),('중복조합|순서쌍|서로 구별하지 않','중복조합'),('원형|원탁|원순열|원 모양','원순열'),('일렬|나열','순열'),('중복.*허락','중복순열'),('함수.*개수','함수의 개수와 경우 분류')]:
          if has(pat):concepts.append(c)
    elif has('\\\\int|적분|넓이') and (has('\\\\int|적분') or not has('삼각형|삼각함수|sin|cos|tan')):
      subject='수학Ⅱ';unit='적분'
      if has('\\\\int'):concepts.append('정적분')
      if has('부정적분|도함수|\\\\prime|\''):concepts.append('부정적분과 미분의 관계')
      if has('넓이'):concepts.append('정적분과 도형의 넓이')
      if has('거리|속도|움직'):concepts.append('속도와 이동거리')
      if has('모든 실수|만족|항등'):concepts.append('적분으로 주어진 함수 관계')
    elif has('미분|도함수|접선|접할|극대|극소|극댓값|극솟값|극값|가속도|속도|접하는|′') or "'" in t:
      subject='수학Ⅱ';unit='미분'
      for pat,c in [('미분가능','미분가능성과 연속'),('도함수|미분|\'','다항함수의 미분'),('접선|접할|접하는','접선의 방정식'),('극대|극소|극댓값|극솟값|극값','극대·극소와 도함수의 부호'),('최대|최소|최댓값|최솟값','함수의 최대·최소'),('속도|가속도','미분과 속도·가속도'),('실근|방정식','도함수를 이용한 방정식 해석')]:
        if has(pat):concepts.append(c)
    elif has('극한|연속|lim'):
      subject='수학Ⅱ';unit='함수의 극한과 연속';concepts=['함수의 연속' if has('연속') else '함수의 극한']
      if has('좌극한|우극한|\\\\to'):concepts.append('좌극한·우극한과 극한의 존재')
    elif has('수열|\\\\sum|귀납'):
      subject='수학Ⅰ';unit='수열'
      for pat,c in [('등차','등차수열'),('등비','등비수열'),('합|\\\\sum','수열의 합과 시그마'),('a_.*n|귀납|모든 자연수','수열의 귀납적 정의'),('증명|귀납법','수학적 귀납법')]:
        if has(pat):concepts.append(c)
      if not concepts:concepts=['수열의 일반항과 항 사이의 관계']
    elif has('sin|cos|tan|삼각함수|삼각형|호도법|부채꼴'):
      subject='수학Ⅰ';unit='삼각함수'
      if has('삼각형|사각형|외접원'):concepts=['사인법칙·코사인법칙','삼각형의 변·각·넓이 관계']
      else:
        concepts=['삼각함수의 뜻과 값']
        if has('그래프|주기|최대|최소|방정식'):concepts.append('삼각함수의 그래프와 성질')
    else:
      subject='수학Ⅰ';unit='지수함수와 로그함수'
      if has('log|로그'):concepts.append('로그의 뜻과 성질')
      if has('그래프|곡선|방정식|부등식'):concepts.append('지수함수·로그함수의 그래프와 활용')
      if not concepts:concepts=['지수법칙과 거듭제곱근']
    # A-type calculus items are deliberately excluded from the three target subjects.
    evidence=[]
    for word in ['수열','등차','등비','적분','연속','미분','도함수','접선','극대','극소','삼각형','log','sin','cos','확률','정규분포','이항분포','신뢰','표본','분산','전개식','경우의 수']:
      if word in t:evidence.append(word)
    return subject,unit,concepts,evidence

def build(text_only=False):
    items=[];exams=[];warnings=[];excluded=[]
    selections=[(SOURCE/'01-17-2205-2706-_only-.pdf',0,136,8,'common'),(SOURCE/'03-30-1706-2111-_-.pdf',288,360,12,'legacy'),(ROOT.parent/'tmp'/'probability-17.pdf',0,68,4,'stats'),(ROOT.parent/'tmp'/'2027-09.pdf',0,12,12,'full')]
    for filename,start,end,step,kind in selections:
      doc=fitz.open(filename)
      for exam_start in range(start,end,step):
        first=doc[exam_start].get_text();year=int(re.search(r'(20\d\d)학년도',first)[1]);session='예시문항' if '예시문항' in first else '6월 모의평가' if '6월 모의평가' in first else '9월 모의평가' if '9월 모의평가' in first else '수능'
        typ=('가형' if ((exam_start-288)//12)%2==0 else '나형') if kind=='legacy' else '공통'
        sid={'예시문항':'example','6월 모의평가':'06','9월 모의평가':'09','수능':'11'}[session]
        eid=f'{year}-{sid}'+('-a' if typ=='가형' else '-b' if typ=='나형' else '')
        atlas_id=eid+('-stats' if kind=='stats' else '')
        exam={'id':eid,'year':year,'session':session,'type':typ,'source':filename.name,'source_start_page':exam_start+1,'count':0}
        exam_items=[];atlas_parts=[];atlas_y=0;scale=1.7
        expected=[]
        for pi in range(exam_start,exam_start+step):
          page=doc[pi];markers=marker_spans(page);expected += [m['number'] for m in markers]
          footer_start=page.rect.height-140
          for b in page.get_text('dict')['blocks']:
            for ln in b.get('lines',[]):
              lt=''.join(s['text'] for s in ln['spans'])
              if re.search(r'확+\s*인+\s*사+\s*항+|답+안+지+의+\s*해+당+란+',lt) and ln['bbox'][1]>page.rect.height*.64:
                footer_start=min(footer_start,ln['bbox'][1]-13)
          pix=page.get_pixmap(matrix=fitz.Matrix(scale,scale),alpha=False)
          full=Image.frombytes('RGB',(pix.width,pix.height),pix.samples);gray=full.convert('L')
          for mi,m in enumerate(markers):
            x0=m['bbox'][0]-5;col=int(x0>page.rect.width/2);x1=page.rect.width-78 if col else page.rect.width/2-12
            top=m['bbox'][1]-16
            nxt=[o['bbox'][1]-17 for o in markers if int(o['bbox'][0]>page.rect.width/2)==col and o['bbox'][1]>m['bbox'][1]+1]
            bottom=min(nxt) if nxt else footer_start
            if bottom<=m['bbox'][3]+8:bottom=min(nxt) if nxt else page.rect.height-140
            rect=fitz.Rect(x0,top,x1,bottom);cs=glyphs(page,rect)
            # Remove notices and non-question section headings.
            cs=[c for c in cs if not ('단답형' in c['c'])]
            statement,formula=transcription(cs,gray,scale)
            statement=re.sub(r'\n?(?:단답형|5지선다형)\s*$','',statement)
            statement=re.split(r'[*＊]+\s*확+\s*인+\s*사+\s*항+|◦+\s*답+안+지+',statement)[0]
            num=m['number'];stats_only=kind=='stats' or kind=='full' and num>=23
            subj,unit,concepts,evidence=classify(statement,stats_only)
            if num in A_CALCULUS.get(eid,set()):
              excluded.append({'id':f'{eid}-{m["number"]:02}','reason':'가형 미적분: 대상 세 과목 범위 밖','text':statement[:100]});continue
            if eid in A_UNITS:
              manual_subj,manual_unit,fallback=UNIT_KEYS[A_UNITS[eid][num]]
              if unit!=manual_unit:concepts=[fallback]
              subj,unit=manual_subj,manual_unit
            statement=re.sub(r'(?<!\d)'+str(num)+r'\.\s*','',statement,count=1)
            statement=f'{num}. '+statement.strip()
            # Trim bottom whitespace; do not alter any original ink or spacing inside the crop.
            raw_crop=gray.crop((int(x0*scale),int(top*scale),int(x1*scale),int(bottom*scale)))
            inverted=raw_crop.point(lambda x:255 if x<205 else 0)
            ink=inverted.getbbox()
            if ink:bottom=min(bottom,top+(ink[3]+15)/scale)
            crop=full.crop((int(x0*scale),int(top*scale),int(x1*scale),math.ceil(bottom*scale)))
            item={'id':f'{eid}-{num:02}','exam_id':eid,'year':year,'session':session,'paper_type':'확률과 통계' if stats_only else typ,'number':num,'subject':subj,'unit':unit,'concepts':concepts,'concept_evidence':evidence,'classification_status':'검수 완료' if eid in A_UNITS else '분류 초안','transcription_status':'auto','statement_latex':statement,'formulas':formula,'source_page':pi+1,'page_in_exam':pi-exam_start+1+(8 if kind=='stats' else 0),'source_file':filename.name,'original':{'atlas':f'assets/{atlas_id}.webp','x':0,'y':atlas_y,'width':crop.width,'height':crop.height},'points':int(re.search(r'\[(\d)\s*점\]',statement)[1]) if re.search(r'\[(\d)\s*점\]',statement) else None}
            item['content_hash']=hashlib.sha256(re.sub(r'\s+','',statement).encode()).hexdigest()[:16]
            exam_items.append(item);atlas_parts.append(crop);atlas_y+=crop.height+4
          # Releasing full-page rasters keeps peak memory bounded.
        target=list(range(23 if kind=='stats' else 1,23 if kind=='common' else 31))
        if sorted(expected)!=target:
          warnings.append({'exam':eid,'markers':sorted(expected),'reason':'문항 번호 누락 또는 중복'})
        if not atlas_parts:continue
        maxw=max(p.width for p in atlas_parts)
        # PNG has no WebP height limit; use PNG only for exceptionally long atlases.
        ext='webp' if atlas_y<16384 else 'png'
        if text_only:
          with Image.open(ROOT/'assets'/f'{atlas_id}.{ext}') as existing:
            assert existing.size==(maxw,atlas_y)
        else:
          atlas=Image.new('RGB',(maxw,atlas_y),'white');yy=0
          for crop in atlas_parts:atlas.paste(crop,(0,yy));yy+=crop.height+4
          buf=io.BytesIO()
          if ext=='webp':atlas.save(buf,format='WEBP',lossless=True,method=5)
          if ext=='png' or len(buf.getbuffer())==0:
            ext='png';buf=io.BytesIO();atlas.save(buf,format='PNG',optimize=True)
          img=Image.open(buf);assert img.size==(maxw,atlas_y);img.verify()
          (ROOT/'assets'/f'{atlas_id}.{ext}').write_bytes(buf.getvalue())
        for q in exam_items:
          q['original']['atlas']=f'assets/{atlas_id}.{ext}'
          q['original']['atlas_width']=maxw;q['original']['atlas_height']=atlas_y
        exam['count']=len(exam_items)
        prev=next((e for e in exams if e['id']==eid),None)
        if prev:prev['count']+=len(exam_items);prev['selection_source']=filename.name
        else:exams.append(exam)
        items+=exam_items
        print(atlas_id,len(exam_items),f'{maxw}x{atlas_y}',flush=True)
    manifest={'title':'UAA 수학 기출 아카이브','curriculum':'2015 개정 교육과정','updated':'2026-11-04','scope_note':'2021학년도 6월 모의평가부터 2027학년도 9월 모의평가까지 평가원 기출 및 2022학년도 예시문항. 2021학년도 가형은 수학Ⅰ·확률과 통계 문항만 포함하며, 가·나형에 함께 출제된 문항은 각 회차에 표시합니다.','items':items,'exams':exams,'excluded':excluded,'warnings':warnings}
    (ROOT/'data'/'questions.json').write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':')))
    (ROOT/'data'/'review.txt').write_text('\n\n'.join(f'{q["id"]} | {q["subject"]} / {q["unit"]}\n'+q['statement_latex'] for q in items))
    print('TOTAL',len(items),'WARNINGS',len(warnings),'EXCLUDED',len(excluded))
    print(json.dumps(warnings,ensure_ascii=False))

if __name__=='__main__':build(text_only='--text-only' in sys.argv)
