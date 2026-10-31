// Safe, deliberately small content renderer: no HTML, URL links, scripts, or evaluation.
export const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const ATTACHMENT_BYTES=120000;
function rasterDimensions(bytes,type){
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),dimensions=[];
 const invalid=()=>{throw new Error('이미지 크기 정보가 없거나 데이터가 손상되었습니다.');};
 if(type==='png'){
  if(bytes.length<33||view.getUint32(8)!==13||String.fromCharCode(...bytes.slice(12,16))!=='IHDR')invalid();
  dimensions.push([view.getUint32(16),view.getUint32(20)]);
 }else if(type==='jpeg'){
  let offset=2;
  while(offset<bytes.length){
   if(bytes[offset++]!==255)invalid();while(bytes[offset]===255)offset++;if(offset>=bytes.length)invalid();const marker=bytes[offset++];
   if(marker===0xDA||marker===0xD9)break;
   if(marker===0x01||marker>=0xD0&&marker<=0xD7)continue;
   if(offset+2>bytes.length)invalid();const length=view.getUint16(offset);if(length<2||offset+length>bytes.length)invalid();
   if(marker>=0xC0&&marker<=0xCF&&![0xC4,0xC8,0xCC].includes(marker)){
    if(length<8)invalid();dimensions.push([view.getUint16(offset+5),view.getUint16(offset+3)]);
   }
   offset+=length;
  }
 }else{
  if(bytes.length<20||view.getUint32(4,true)+8!==bytes.length)invalid();
  let offset=12,hasPixels=false;
  const uint24=i=>bytes[i]|bytes[i+1]<<8|bytes[i+2]<<16;
  while(offset<bytes.length){
   if(offset+8>bytes.length)invalid();const chunk=String.fromCharCode(...bytes.slice(offset,offset+4)),size=view.getUint32(offset+4,true),start=offset+8,end=start+size;
   if(end>bytes.length)invalid();
   if(chunk==='VP8X'){
    if(size!==10||bytes[start]&2)invalid();dimensions.push([uint24(start+4)+1,uint24(start+7)+1]);
   }else if(chunk==='VP8 '){
    if(size<10||bytes[start]&1||bytes[start+3]!==0x9d||bytes[start+4]!==0x01||bytes[start+5]!==0x2a)invalid();
    dimensions.push([view.getUint16(start+6,true)&0x3fff,view.getUint16(start+8,true)&0x3fff]);hasPixels=true;
   }else if(chunk==='VP8L'){
    if(size<5||bytes[start]!==0x2f||bytes[start+4]&0xe0)invalid();
    dimensions.push([1+(bytes[start+1]|(bytes[start+2]&0x3f)<<8),1+((bytes[start+2]>>6)|bytes[start+3]<<2|(bytes[start+4]&0x0f)<<10)]);hasPixels=true;
   }else if(chunk==='ANIM'||chunk==='ANMF')invalid();
   offset=end+(size&1);if(offset>bytes.length)invalid();
  }
  if(!hasPixels)invalid();
 }
 if(!dimensions.length)invalid();
 for(const [width,height]of dimensions)if(!width||!height||width>4096||height>4096||width*height>8000000)throw new Error('이미지는 4096px·800만 화소 이하여야 합니다.');
 if(dimensions.some(([w,h])=>w!==dimensions[0][0]||h!==dimensions[0][1]))invalid();
 return dimensions[0];
}
export function validateAttachments(value=[]){
 if(!Array.isArray(value)||value.length>3)throw new Error('첨부 이미지는 최대 3개입니다.');
 const ids=new Set();
 return value.map(v=>{
  if(!v||typeof v.id!=='string'||! /^[a-zA-Z0-9_-]{1,60}$/.test(v.id)||ids.has(v.id))throw new Error('첨부 이미지 ID가 잘못되었습니다.');ids.add(v.id);
  const match=typeof v.dataUrl==='string'&&v.dataUrl.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/);
  if(!match||match[2].length%4!==0||match[2].length>Math.ceil(ATTACHMENT_BYTES/3)*4)throw new Error('첨부 이미지는 120KB 이하 PNG/JPEG/WebP만 지원합니다.');
  let bytes;try{bytes=Uint8Array.from(atob(match[2]),c=>c.charCodeAt(0));}catch{throw new Error('첨부 이미지 데이터가 잘못되었습니다.');}
  const sig=Array.from(bytes.slice(0,12));
  if(!(match[1]==='png'&&sig.slice(0,8).join(',')==='137,80,78,71,13,10,26,10'||match[1]==='jpeg'&&sig[0]===255&&sig[1]===216&&sig[2]===255||match[1]==='webp'&&String.fromCharCode(...sig.slice(0,4))==='RIFF'&&String.fromCharCode(...sig.slice(8,12))==='WEBP'))throw new Error('이미지 형식과 실제 데이터가 다릅니다.');
  rasterDimensions(bytes,match[1]);
  for(const key of ['name','caption'])if(v[key]!==undefined&&(typeof v[key]!=='string'||v[key].length>(key==='caption'?2000:200)))throw new Error('첨부 이미지 이름·설명을 확인해 주세요.');
  if(!['after-passage','after-question','solution'].includes(v.placement))throw new Error('첨부 이미지 위치를 확인해 주세요.');
  return {id:v.id,name:v.name||'도식',caption:v.caption||'',placement:v.placement,dataUrl:v.dataUrl};
 });
}
const commands={alpha:'α',beta:'β',gamma:'γ',delta:'δ',theta:'θ',lambda:'λ',mu:'μ',pi:'π',sigma:'σ',sum:'∑',times:'×',cdot:'·',le:'≤',leq:'≤',ge:'≥',geq:'≥',ne:'≠',infty:'∞'};
function formula(source){
 let i=0;
 function atom(){
  while(source[i]===' ')i++;
  if(i>=source.length)throw Error();
  if(source[i]==='{'){i++;const v=sequence('}');if(source[i++]!=='}')throw Error();return `<mrow>${v}</mrow>`;}
  if(source[i]==='\\'){i++;const name=source.slice(i).match(/^[A-Za-z]+/)?.[0];if(!name)throw Error();i+=name.length;if(name==='frac')return `<mfrac>${atom()}${atom()}</mfrac>`;if(name==='sqrt')return `<msqrt>${atom()}</msqrt>`;if(!commands[name])throw Error();return `<mo>${commands[name]}</mo>`;}
  const c=source[i++];if(/[a-zA-Zα-ωΑ-Ω]/.test(c))return `<mi>${escapeHtml(c)}</mi>`;if(/[0-9]/.test(c))return `<mn>${c}</mn>`;if(/[+\-=<>()[\]|.,:/×÷%]/.test(c))return `<mo>${escapeHtml(c)}</mo>`;throw Error();
 }
 function sequence(end){let out='';while(i<source.length&&source[i]!==end){if(source[i]===' '){i++;continue;}let base=atom();let sub='',sup='';while(source[i]==='_'||source[i]==='^'){const marker=source[i++];const script=atom();if(marker==='_'){if(sub)throw Error();sub=script;}else{if(sup)throw Error();sup=script;}}base=sub&&sup?`<msubsup>${base}${sub}${sup}</msubsup>`:sub?`<msub>${base}${sub}</msub>`:sup?`<msup>${base}${sup}</msup>`:base;out+=base;}return out;}
 try{if(source.length>1000)throw Error();const body=sequence();return `<math xmlns="http://www.w3.org/1998/Math/MathML" aria-label="${escapeHtml(source)}"><mrow>${body}</mrow></math>`;}catch{return `<code class="formula-unsupported">${escapeHtml('$'+source+'$')}</code>`;}
}
function inline(source){let result='',last=0;for(const m of source.matchAll(/\$([^$\n]+)\$/g)){result+=escapeHtml(source.slice(last,m.index))+formula(m[1]);last=m.index+m[0].length;}return result+escapeHtml(source.slice(last));}
export function renderRichText(value){
 const lines=String(value??'').split('\n');let out='';
 const cells=line=>line.trim().replace(/^\||\|$/g,'').split('|').map(v=>v.trim());
 for(let i=0;i<lines.length;i++){
  if(lines[i].includes('|')&&i+1<lines.length&&/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[i+1])){
   const header=cells(lines[i]);out+='<div class="author-table-scroll"><table><thead><tr>'+header.map(c=>`<th scope="col">${inline(c)}</th>`).join('')+'</tr></thead><tbody>';i++;
   while(i+1<lines.length&&lines[i+1].includes('|')&&lines[i+1].trim()){const row=cells(lines[++i]);out+='<tr>'+header.map((_,j)=>`<td>${inline(row[j]||'')}</td>`).join('')+'</tr>';}
   out+='</tbody></table></div>';
  }else out+=`<div class="rich-line">${inline(lines[i])||'<br>'}</div>`;
 }
 return out;
}
export function renderAttachments(attachments,placement){return (attachments||[]).filter(v=>v.placement===placement).map(v=>`<figure class="author-diagram"><img src="${escapeHtml(v.dataUrl)}" alt="${escapeHtml(v.caption||v.name)}" loading="lazy"><figcaption>${escapeHtml(v.caption)}</figcaption></figure>`).join('');}
