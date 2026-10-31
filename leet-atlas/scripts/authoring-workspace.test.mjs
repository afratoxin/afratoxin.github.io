import test from 'node:test';
import assert from 'node:assert/strict';
import * as author from '../authoring.mjs';
const rich=await import('../author-rich-content.mjs').catch(()=>({}));
const legacy=()=>({schemaVersion:1,title:'문항',passage:'지급액은 최대 1억 원이다. 순서대로 비율 계산한다.',question:'지급액은?',choices:['5000만 원','6000만 원','7000만 원','1억 원','2억 원'],answer:4,solution:'계산 결과',steps:['순서 계산'],optionAnalyses:[1,2,3,4,5].map(number=>({number,isAnswer:number===4,reason:'계산 결과 대조'})),classifications:[{axis:'domain',label:'법률',reason:'규칙'},{axis:'type',label:'적용',reason:'대입'},{axis:'logic',label:'계산',reason:'수량'}],review:['answerUniqueness','sufficiency','optionValidity','originality','classification'].map(criterion=>({criterion,status:'pass',evidence:'기존 검토'}))});
const taxonomy=[{axis:'domain',label:'법률'},{axis:'type',label:'적용'},{axis:'logic',label:'계산'}];
const parse=value=>author.parseDraft(JSON.stringify(value),taxonomy);
test('old five-check drafts migrate new author checks to uncertain',()=>{const result=parse(legacy());assert.equal(result.review.length,9);for(const row of result.review.slice(5))assert.equal(row.status,'uncertain');assert.equal(result.expectedMinutes,null);});
test('draft changes create bounded prior versions and same content keeps human confirmations',()=>{let p={draft:parse(legacy()),humanReview:{answerUniqueness:true}};assert.equal(author.withDraft(p,parse(legacy())).humanReview.answerUniqueness,true);for(let i=0;i<25;i++){const next=parse({...legacy(),title:'변경 '+i});p=author.withDraft(p,next);}assert.equal(p.versions.length,20);assert.deepEqual(p.humanReview,{});assert.ok(p.versions.every(v=>v.draft.title));const restored=author.restoreVersion(p,p.versions[0].id);assert.equal(restored.draft.title,p.versions[0].draft.title);assert.ok(restored.versions.some(v=>v.draft.title==='변경 24'));});
test('attachment import accepts only bounded raster data with matching signature',()=>{const image={id:'img1',name:'그림',caption:'자료',placement:'after-passage',dataUrl:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6qh8AAAAASUVORK5CYII='};const result=parse({...legacy(),attachments:[image]});assert.equal(result.attachments[0].caption,'자료');for(const dataUrl of ['https://example.org/a.png','data:image/svg+xml;base64,PHN2Zz4=','data:image/png;base64,PHNjcmlwdD4='])assert.throws(()=>parse({...legacy(),attachments:[{...image,dataUrl}]}),/이미지|첨부/);});
test('safe rich preview renders tables and supported MathML and escapes HTML',()=>{const result=rich.renderRichText('| 항목 | 값 |\n| --- | --- |\n| <img onerror=x> | $x^2$ |\n\n$\\unknown{a}$');assert.match(result,/<table/);assert.match(result,/<math/);assert.match(result,/&lt;img/);assert.doesNotMatch(result,/<img onerror/);assert.match(result,/\\unknown/);});
test('quality hints identify cap shortcuts as a review prompt without claiming proof',()=>{const hints=author.qualityHints(parse(legacy()));assert.ok(hints.some(h=>h.id==='cap-shortcut'));assert.ok(hints.every(h=>h.status==='check'));});
test('reference packets include category boundaries and final treatment notes',()=>{const prompt=author.buildCreationPrompt({brief:'규칙 적용',questions:[{id:'1022',title:'기출',sourceText:'원문',finalTreatment:{status:'multiple',source:'공식자료',date:'2020-01-01'}}],taxonomy:[{axis:'logic',label:'계산',definition:'필수 수치 연산',assignmentBoundary:'단순 숫자 언급 제외',parent:'수리 추론'}]});for(const text of ['필수 수치 연산','단순 숫자 언급 제외','수리 추론','multiple','공식자료'])assert.ok(prompt.includes(text),text);});

test('real JPEG and WebP imports enforce width and total pixel bounds just like PNG',async()=>{
 const {readFile}=await import('node:fs/promises');const fixtures=JSON.parse(await readFile(new URL('./fixtures/author-attachment-dimensions.json',import.meta.url),'utf8'));
 for(const [type,images] of Object.entries(fixtures)){
  const attachment=dataUrl=>({id:'image-'+type,name:'실제 이미지',caption:'도식',placement:'after-passage',dataUrl});
  assert.equal(rich.validateAttachments([attachment(images.valid)]).length,1,type+' valid');
  for(const kind of ['lossless','extended'])if(images[kind])assert.equal(rich.validateAttachments([attachment(images[kind])]).length,1,type+' '+kind);
  for(const kind of ['wide','area','losslessWide','losslessArea','extendedWide','extendedArea'].filter(key=>images[key]))assert.throws(()=>rich.validateAttachments([attachment(images[kind])]),/4096|화소/,type+' '+kind);
  const header=type==='jpeg'?Buffer.from([255,216,255,217]):Buffer.from('RIFF\u0004\u0000\u0000\u0000WEBP','binary');
  assert.throws(()=>rich.validateAttachments([attachment('data:image/'+type+';base64,'+header.toString('base64'))]),/이미지/,type+' missing dimensions');
 }
});
