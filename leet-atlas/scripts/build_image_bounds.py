"""Measure foreground bounds without modifying any source pixels or assets."""
import base64
import hashlib
import io
import json
from pathlib import Path
from PIL import Image, ImageChops

def foreground(image):
    red,green,blue=image.convert('RGB').split()
    darkest=ImageChops.darker(ImageChops.darker(red,green),blue)
    return darkest.point(lambda value:255 if value<245 else 0)

def detect_bounds(image, padding=6):
    box=foreground(image).getbbox()
    if not box:return (0,0,image.width,image.height)
    left,top,right,bottom=box
    return (max(0,left-padding),max(0,top-padding),min(image.width,right+padding),min(image.height,bottom+padding))

def build(root):
    archive=json.loads((root/'data/archive.json').read_text(encoding='utf-8'))
    bundles={}
    items={}
    for question in archive['questions']:
        bundle=question.get('imageBundle')
        if bundle:
            if bundle not in bundles:bundles[bundle]=json.loads((root/bundle).read_text(encoding='utf-8'))
            raw=base64.b64decode(bundles[bundle]['images'][question['id']])
        else:
            raw=(root/question['image']).read_bytes()
        image=Image.open(io.BytesIO(raw)).convert('RGB')
        left,top,right,bottom=detect_bounds(image)
        # Verify every detected foreground pixel remains inside the display bounds.
        actual=foreground(image).getbbox()
        if actual and not(left<=actual[0] and top<=actual[1] and right>=actual[2] and bottom>=actual[3]):
            raise ValueError(f"foreground clipped: {question['id']}")
        items[question['id']]={'width':image.width,'height':image.height,'left':left,'top':top,'contentWidth':right-left,'contentHeight':bottom-top,'sha256':hashlib.sha256(raw).hexdigest()}
    output={'schemaVersion':1,'method':'all pixels with any RGB channel below 245, plus 6px safety padding','sourceImagesPreserved':True,'coverage':len(items),'items':items}
    (root/'data/image-bounds.json').write_text(json.dumps(output,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
    print(f"Validated foreground preservation for {len(items)} source images")
    for item in ['2021','2701']:
        print(item,items[item])

if __name__=='__main__':build(Path(__file__).resolve().parents[1])
