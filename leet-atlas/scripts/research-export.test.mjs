import test from 'node:test';
import assert from 'node:assert/strict';
import {preparePrintImages} from '../source-image.mjs';
import {printableSelection} from '../research-workspace.mjs';
const q={id:'2723',year:2027,number:23,title:'<img src=x onerror=alert(1)>',text:'그림 선택지',answer:2,summary:'<script>x</script>',steps:[],options:[]};
test('standalone source exports embed direct assets as well as already bundled data',async()=>{
 let loaded=false,calls=0;
 const bytes=new Uint8Array([82,73,70,70,4,0,0,0,87,69,66,80]);const data='data:image/webp;base64,'+Buffer.from(bytes).toString('base64');
 const images=await preparePrintImages([q,{...q,id:'2020'}],{load:async()=>{loaded=true},imageFor:item=>{assert.equal(loaded,true);return item.id==='2723'?'assets/questions/2723.webp':data},fetcher:async path=>{calls++;assert.equal(path,'assets/questions/2723.webp');return {ok:true,blob:async()=>new Blob([bytes],{type:'application/octet-stream'})}}});
 assert.equal(calls,1);assert.equal(images.get('2723'),data);assert.equal(images.get('2020'),data);
 const html=printableSelection([q],{images});assert.match(html,/src="data:image\/webp;base64,/);assert.doesNotMatch(html,/src="assets\//);assert.match(html,/2027학년도 23번/);assert.doesNotMatch(html,/<img src=x/);
});
test('image loading failure stops export rather than silently dropping diagram choices',async()=>{
 await assert.rejects(()=>preparePrintImages([q],{imageFor:()=>'/missing.webp',fetcher:async()=>({ok:false})}),/원본 이미지/);
});
test('answer export preserves book key, separately describes final treatment and escapes explanations',()=>{
 const record={questionId:q.id,type:'no-answer',summary:'최종 처리',reason:'경계 사례',sources:[]};
 const html=printableSelection([q],{solutions:true,registry:{records:[record]}});
 assert.match(html,/해설서 기준 ②/);assert.match(html,/경계 사례/);assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>x/);
});
