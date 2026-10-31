const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function contentImageMarkup(url,alt,bounds,{id='',expanded=false,thumbnail=false}={}){
 const valid=bounds&&[bounds.width,bounds.height,bounds.contentWidth,bounds.contentHeight].every(v=>Number.isFinite(v)&&v>0);
 const attrs=`${id?` id="${esc(id)}"`:''} class="${thumbnail?'content-thumbnail':'source-image'}" src="${esc(url)}" alt="${esc(alt)}" decoding="async"`;
 if(!valid)return `<img${attrs}>`;
 const ratio=bounds.contentWidth/bounds.contentHeight;
 const transform=`translate(${-100*bounds.left/bounds.width}%,${-100*bounds.top/bounds.height}%)`;
 return `<span class="source-image-frame${expanded?' is-expanded':''}${thumbnail?' is-thumbnail':''}" style="--content-aspect:${ratio};aspect-ratio:${bounds.contentWidth}/${bounds.contentHeight}"><img${attrs} style="width:${100*bounds.width/bounds.contentWidth}%;transform:${transform}"></span>`;
}
export function applyContentBounds(image,bounds){
 const frame=image.parentElement;
 if(!frame)return;
 if(!bounds){frame.classList.remove('source-image-frame','is-expanded');frame.removeAttribute('style');image.removeAttribute('style');return;}
 frame.classList.add('source-image-frame','is-expanded');
 frame.style.setProperty('--content-aspect',String(bounds.contentWidth/bounds.contentHeight));
 frame.style.aspectRatio=`${bounds.contentWidth}/${bounds.contentHeight}`;
 image.style.width=`${100*bounds.width/bounds.contentWidth}%`;
 image.style.transform=`translate(${-100*bounds.left/bounds.width}%,${-100*bounds.top/bounds.height}%)`;
}
export async function preparePrintImages(questions,{imageFor,load=async()=>{},fetcher=globalThis.fetch}){
 await load(questions);
 const entries=await Promise.all(questions.map(async question=>{
  const url=imageFor(question);if(!url||url.startsWith('data:image/'))return [question.id,url||''];
  const response=await fetcher(url);if(!response.ok)throw new Error('인쇄할 원본 이미지를 불러오지 못했습니다. 다시 시도해 주세요.');
  const blob=await response.blob(),bytes=new Uint8Array(await blob.arrayBuffer());
  const signature=String.fromCharCode(...bytes.subarray(0,12));
  const mime=signature.startsWith('RIFF')&&signature.slice(8)==='WEBP'?'image/webp':bytes[0]===137&&signature.slice(1,4)==='PNG'?'image/png':bytes[0]===255&&bytes[1]===216&&bytes[2]===255?'image/jpeg':null;
  if(!mime)throw new Error('원본 이미지 형식을 확인해 주세요.');
  let binary='';
  for(let offset=0;offset<bytes.length;offset+=8192)binary+=String.fromCharCode(...bytes.subarray(offset,offset+8192));
  return [question.id,`data:${mime};base64,${btoa(binary)}`];
 }));
 return new Map(entries);
}
