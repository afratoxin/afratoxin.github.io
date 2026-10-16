import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {SIGNAL_TARGETS,SIGNAL_DRUGS} from './signal31-data.mjs';
const imageIds=['tretinoin','cetuximab','panitumumab','gefitinib','erlotinib','lapatinib','afatinib','trastuzumab','enhertu','rituximab','alemtuzumab','denileukin','gemtuzumab','brentuximab','nivolumab','pembrolizumab','durvalumab','atezolizumab','imatinib','nilotinib','dasatinib','bevacizumab','sorafenib','sunitinib','bortezomib','crizotinib','vorinostat'];
test('31강 드래그는 이미지 속 27개 약물만 등록하며 이름과 표적을 짧게 표시한다',()=>{
 assert.deepEqual(SIGNAL_TARGETS.map(d=>d.id).sort(),[...imageIds].sort());
 const by=id=>SIGNAL_TARGETS.find(d=>d.id===id);
 assert.equal(by('enhertu').name,'Enhertu');assert.equal(by('dasatinib').name,'Dasatinib');assert.equal(by('gemtuzumab').name,'Gemtuzumab');assert.equal(by('brentuximab').name,'Brentuximab');
 for(const d of SIGNAL_TARGETS){assert.ok(d.categories.length);assert.ok(d.categories.every(c=>SIGNAL_DRUGS.find(x=>x.id===d.id).targets.includes(c)),d.id);assert.ok(d.name.length<=20,d.id);}
 const categories=new Set(SIGNAL_TARGETS.flatMap(d=>d.categories));for(const absent of ['SRC','HER4','RAF'])assert.ok(!categories.has(absent),absent);
 assert.deepEqual(by('bevacizumab').categories,['VEGF-A']);assert.ok(!by('sunitinib').categories.includes('RAF'));
 assert.deepEqual(by('lapatinib').categories,['EGFR','HER2']);assert.deepEqual(by('dasatinib').categories,['BCR-ABL','KIT','PDGFR']);
});
test('31강만 폭이 제한된 격자와 줄바꿈을 사용하고 범위 선택으로 이미지 밖 약물을 열지 않는다',async()=>{
 const [css,html]=await Promise.all(['style.css','index.html'].map(f=>readFile(new URL(f,import.meta.url),'utf8')));
 assert.match(css,/#sigBoard\s+\.drop-zones\s*\{[^}]*repeat\(auto-fit,\s*minmax\(140px,\s*180px\)\)/);
 assert.match(css,/#sigBoard\s+\.drug-chip\s*\{[^}]*white-space:\s*normal/);
 const select=html.match(/<select id="sigMatchFilter">([\s\S]*?)<\/select>/)?.[1];assert.ok(select);assert.match(select,/이미지.*27/);assert.doesNotMatch(select,/value="all"|value="core"/);
});
