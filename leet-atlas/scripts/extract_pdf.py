"""Extract the two-column 2027 exam without rewriting its text.
Usage: python scripts/extract_pdf.py SOURCE.pdf OUTPUT_DIR [--start-page 337]
SOURCE may be the full supplied compilation (start-page 337) or the preserved
20-page 2027-original.pdf (start-page 1). Output is a fresh directory only.
"""
import argparse,subprocess,hashlib,json,re
from pathlib import Path
import fitz

def main():
 ap=argparse.ArgumentParser(description=__doc__)
 ap.add_argument('source',type=Path);ap.add_argument('output',type=Path)
 ap.add_argument('--start-page',type=int,default=337)
 args=ap.parse_args();out=args.output
 if out.exists() and any(out.iterdir()):raise SystemExit('Output directory must be empty to preserve reviewed files.')
 for path in ['data','assets/questions','assets/thumbs']: (out/path).mkdir(parents=True,exist_ok=True)
 source=args.source.resolve();doc=fitz.open(source);records=[]
 assert args.start_page>=1 and args.start_page+19<=len(doc)
 for page_number in range(20):
  page=doc[args.start_page-1+page_number]
  for side in range(2):
   number=page_number*2+side+1;qid=f'27{number:02}'
   x0,x1=(86,411) if side==0 else (433,759)
   headings=[]
   for block in page.get_text('dict')['blocks']:
    for line in block.get('lines',[]):
     if x0-2<=line['bbox'][0]<x1:
      text=''.join(span['text'] for span in line['spans'])
      if re.match(rf'^{number}\.\s*',text):headings.append(line)
   if not headings:raise ValueError(f'{qid}: question heading not found')
   y0=min(line['bbox'][1] for line in headings)-3
   crop=fitz.Rect(x0,y0,x1,1076)
   bottoms=[b['bbox'][3] for b in page.get_text('dict',clip=crop)['blocks'] if y0<b['bbox'][1]<1074]
   y1=min(1078,max(bottoms)+8) if bottoms else 1076;crop.y1=y1
   page.get_pixmap(matrix=fitz.Matrix(2,2),clip=crop,annots=True).pil_save(out/f'assets/questions/{qid}.webp',format='WEBP',lossless=True)
   page.get_pixmap(matrix=fitz.Matrix(.65,.65),clip=crop,annots=True).pil_save(out/f'assets/thumbs/{qid}.webp',format='WEBP',quality=85)
   txt_path=out/f'data/{qid}.txt'
   subprocess.run(['pdftotext','-f',str(args.start_page+page_number),'-l',str(args.start_page+page_number),'-x',str(int(x0)),'-y',str(int(y0)),'-W',str(int(x1-x0)+1),'-H',str(int(y1-y0)+1),'-layout','-nopgbrk',str(source),str(txt_path)],check=True)
   text=txt_path.read_text().strip();txt_path.write_text(text+'\n')
   records.append({'id':qid,'year':2027,'number':number,'sourcePage':337+page_number,'examPage':page_number+1,'text':text,'rawText':page.get_text('text',clip=crop),'image':f'assets/questions/{qid}.webp','thumbnail':f'assets/thumbs/{qid}.webp','clip':[round(z,3) for z in crop],'extractionStatus':'PDF 문자층 추출 · 원본 이미지 대조'})
 (out/'data/extracted-2027.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
 (out/'data/source-manifest.json').write_text(json.dumps({'sourceFile':source.name,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'pages':list(range(337,357)),'count':40,'questionIds':[r['id'] for r in records],'notes':['원본 회색 강조 표시를 그대로 보존한다.','위치 기반 공백과 개행을 복원한 추출본이다. 도식·수식은 원본과 대조한다.']},ensure_ascii=False,indent=2)+'\n')
 print('Extracted 40 questions into',out)
if __name__=='__main__':main()
