import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const sidebar=await import('../sidebar.mjs').catch(error=>{
  if(error.code==='ERR_MODULE_NOT_FOUND')return {};
  throw error;
});
const api=name=>{
  assert.equal(typeof sidebar[name],'function',`sidebar exports ${name}`);
  return sidebar[name];
};
const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const renderChoice=(tag,path)=>`<button type="button" data-filter-tag="${escape(tag.id)}" data-axis="${escape(tag.axis)}" data-tag-search="${escape(`${tag.label} ${path}`)}">${escape(tag.label)}</button>`;
const fixture=[
  {id:'domain-human',axis:'domain',label:'인문'},
  {id:'domain-social',axis:'domain',label:'사회'},
  {id:'field-history',axis:'field',label:'역사학',parentDomain:'인문'},
  {id:'field-society',axis:'field',label:'일반사회',parentDomain:'사회'},
  {id:'field-philosophy',axis:'field',label:'철학',parentDomain:'인문'},
  {id:'subject-shared',axis:'subject',label:'사회변동',parentFields:['역사학','일반사회'],parentField:'역사학'},
  {id:'subject-ethics',axis:'subject',label:'도덕',parentField:'철학'},
  {id:'type-evaluation',axis:'type',label:'논증 평가'},
  {id:'type-structure-diagram',axis:'type',label:'논증구조도'},
  {id:'type-4536b24c5d',axis:'type',label:'논리 퍼즐'},
  {id:'type-puzzle-lies',axis:'type',label:'거짓말 찾기',parentTagId:'type-4536b24c5d'},
  {id:'type-puzzle-order',axis:'type',label:'배열하기',parentTagId:'type-4536b24c5d'},
  {id:'type-823b36ade9',axis:'type',label:'실험 분석'},
  {id:'type-experiment-variable',axis:'type',label:'변수 통제 실험',parentTagId:'type-823b36ade9'},
  {id:'logic-variable',axis:'logic',label:'변수 통제'},
  {id:'year-2026',axis:'year',label:'2026학년도'},
  {id:'year-2019',axis:'year',label:'2019학년도'},
];
const flatten=nodes=>nodes.flatMap(node=>[node,...flatten(node.children)]);
const decode=value=>value.replace(/&(?:amp|lt|gt|quot|#39);/g,entity=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[entity]));

// A small fragment reader keeps these tests independent of browser and UI libraries.
function fragment(html) {
  const root={name:'#root',attrs:{},children:[],text:''};
  let current=root;
  for(const token of html.matchAll(/<\/?[a-z][^>]*>|[^<]+/gi)) {
    const value=token[0];
    if(value.startsWith('</')) { current=current.parent; continue; }
    if(!value.startsWith('<')) { current.text+=decode(value); continue; }
    const [,name,raw]=value.match(/^<([a-z][\w-]*)([^>]*)>/i);
    const attrs=Object.fromEntries([...raw.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].map(([,key,value=''])=>[key,decode(value)]));
    const node={name,attrs,children:[],text:'',parent:current};
    current.children.push(node);
    if(!['input','br','hr','img','meta','link'].includes(name))current=node;
  }
  return root;
}
const descendants=node=>node.children.flatMap(child=>[child,...descendants(child)]);
const find=(node,predicate)=>descendants(node).find(predicate);
const withAttr=(node,name,value)=>find(node,item=>item.attrs[name]===value);
const disclosure=(root,key)=>withAttr(root,'data-filter-disclosure',key);
const isOpen=node=>Object.hasOwn(node.attrs,'open');
const allText=node=>node.text+node.children.map(allText).join('');
const render=(options={},callback=renderChoice)=>fragment(api('renderSidebar')({taxonomy:fixture,...options},callback));

test('domain hierarchy follows parent labels while keeping category tag IDs',()=>{
  const tree=api('buildDomainTree')(fixture);
  assert.deepEqual(tree.map(node=>node.id),['domain-human','domain-social']);
  assert.deepEqual(tree[0].children.map(node=>node.id),['field-history','field-philosophy']);
  assert.deepEqual(tree[0].children[1].children.map(node=>node.id),['subject-ethics']);
  assert.equal(tree[0].tag,fixture[0]);
  assert.equal(tree[0].children[0].tag,fixture[2]);
});

test('shared subjects appear in every parent field with one unchanged tag ID',()=>{
  const before=structuredClone(fixture);
  const tree=api('buildDomainTree')(fixture);
  const occurrences=flatten(tree).filter(node=>node.id==='subject-shared');
  assert.equal(occurrences.length,2);
  assert.ok(occurrences.every(node=>node.tag===fixture[5]));
  assert.deepEqual(fixture,before);
});

test('orphan fields and subjects stay reachable through nonselectable fallback groups',()=>{
  const input=[
    {id:'field-orphan',axis:'field',label:'새 분야',parentDomain:'미등록 대범주'},
    {id:'subject-parent',axis:'subject',label:'새 소재',parentFields:['새 분야']},
    {id:'subject-orphan',axis:'subject',label:'미분류 소재',parentField:'미등록 분야'},
  ];
  const tree=api('buildDomainTree')(input);
  assert.deepEqual(flatten(tree).filter(node=>node.tag).map(node=>node.id).sort(),['field-orphan','subject-orphan','subject-parent']);
  assert.ok(tree.every(node=>node.tag===null));
  assert.ok(flatten(tree).some(node=>node.tag===null&&node.children.some(child=>child.id==='subject-orphan')));
});

test('question subtypes use parentTagId and structure diagrams remain a separate root',()=>{
  const tree=api('buildTypeTree')(fixture);
  assert.deepEqual(tree.map(node=>node.id),['type-evaluation','type-structure-diagram','type-4536b24c5d','type-823b36ade9']);
  assert.deepEqual(tree[2].children.map(node=>node.id),['type-puzzle-lies','type-puzzle-order']);
  assert.deepEqual(tree[3].children.map(node=>node.id),['type-experiment-variable']);
  assert.ok(flatten(tree).every(node=>node.tag.axis==='type'));
});

test('missing or cyclic type parents cannot hide registered question types',()=>{
  const input=[
    {id:'missing-parent',axis:'type',label:'누락 상위',parentTagId:'unknown'},
    {id:'cycle-a',axis:'type',label:'순환 가',parentTagId:'cycle-b'},
    {id:'cycle-b',axis:'type',label:'순환 나',parentTagId:'cycle-a'},
  ];
  const nodes=flatten(api('buildTypeTree')(input));
  assert.deepEqual(nodes.map(node=>node.id).sort(),['cycle-a','cycle-b','missing-parent']);
});

test('sidebar contains only four top-level native disclosures, all collapsed initially',()=>{
  const root=render();
  assert.deepEqual(root.children.map(node=>[node.name,node.attrs['data-filter-disclosure']]),[
    ['details','axis:domain'],['details','axis:type'],['details','axis:logic'],['details','axis:year'],
  ]);
  assert.deepEqual(root.children.map(node=>allText(node.children[0]).replace(/\s*\d.*$/,'').trim()),['대범주','문항 유형','풀이 논리','연도']);
  assert.ok(root.children.every(node=>!isOpen(node)));
  assert.ok(descendants(root).filter(node=>node.name==='details').every(node=>!isOpen(node)));
});

test('selected shared subjects expand every complete ancestor path and show unique counts',()=>{
  const root=render({selectedTags:['subject-shared']});
  for(const key of ['axis:domain','domain:domain-human','field:field-history','domain:domain-social','field:field-society']) {
    assert.ok(isOpen(disclosure(root,key)),key);
  }
  assert.equal(isOpen(disclosure(root,'field:field-philosophy')),false);
  assert.match(allText(disclosure(root,'axis:domain').children[0]),/1개 선택\s*·\s*2/);
});

test('selected parent categories expand their own selection control and preserve button state',()=>{
  const root=fragment(api('renderSidebar')({taxonomy:fixture,selectedTags:['field-philosophy']}));
  assert.ok(isOpen(disclosure(root,'axis:domain')));
  assert.ok(isOpen(disclosure(root,'domain:domain-human')));
  assert.ok(isOpen(disclosure(root,'field:field-philosophy')));
  assert.equal(withAttr(root,'data-filter-tag','field-philosophy').attrs['aria-pressed'],'true');
  assert.equal(isOpen(disclosure(root,'domain:domain-social')),false);
});

test('selected subtypes open their type parent and the question-type root',()=>{
  const root=render({selectedTags:new Set(['type-puzzle-order'])});
  assert.ok(isOpen(disclosure(root,'axis:type')));
  assert.ok(isOpen(disclosure(root,'type:type-4536b24c5d')));
  assert.equal(isOpen(disclosure(root,'type:type-823b36ade9')),false);
});

test('manual disclosure keys remain open independently and reveal their complete path',()=>{
  const root=render({openKeys:new Set(['field:field-philosophy','axis:year'])});
  for(const key of ['axis:domain','domain:domain-human','field:field-philosophy','axis:year'])assert.ok(isOpen(disclosure(root,key)),key);
  assert.equal(isOpen(disclosure(root,'domain:domain-social')),false);
  assert.equal(isOpen(disclosure(root,'axis:type')),false);
});

test('category selection controls stay inside disclosure bodies and leaves remain simple buttons',()=>{
  const root=render();
  assert.ok(descendants(root).filter(node=>node.name==='summary').every(summary=>!descendants(summary).some(node=>node.name==='button')));
  for(const [key,id] of [['domain:domain-human','domain-human'],['field:field-history','field-history'],['type:type-4536b24c5d','type-4536b24c5d']]) {
    assert.ok(withAttr(disclosure(root,key),'data-filter-tag',id));
  }
  assert.equal(disclosure(root,'type:type-evaluation'),undefined);
  assert.ok(withAttr(root,'data-filter-tag','type-evaluation'));
  assert.ok(withAttr(root,'data-filter-tag','type-structure-diagram'));
  assert.doesNotMatch(allText(disclosure(root,'axis:type')),/논증·관점 분석|규칙·내용 이해|실험·모형·퍼즐/);
});

test('search controls cover the four roots and callbacks receive all parent labels',()=>{
  const root=render();
  for(const axis of ['domain','type','logic','year']) {
    const section=disclosure(root,`axis:${axis}`);
    assert.ok(withAttr(section,'data-taxonomy-search',axis));
    assert.ok(withAttr(section,'data-tag-choices',axis));
    assert.ok(withAttr(section,'data-tag-empty',axis));
  }
  const shared=descendants(root).filter(node=>node.attrs['data-filter-tag']==='subject-shared');
  assert.deepEqual(shared.map(node=>node.attrs['data-tag-search']),['사회변동 대범주 인문 역사학','사회변동 대범주 사회 일반사회']);
  assert.match(withAttr(root,'data-filter-tag','type-puzzle-lies').attrs['data-tag-search'],/문항 유형 논리 퍼즐/);
  assert.ok(disclosure(root,'field:field-history').attrs['data-related-group']!==undefined);
});

test('every archive category and newly registered subtype remains reachable without mutation',async()=>{
  const archive=JSON.parse(await readFile(new URL('../data/archive.json',import.meta.url),'utf8'));
  const before=structuredClone(archive.taxonomy);
  const root=render({taxonomy:archive.taxonomy});
  const actual=new Set(descendants(root).flatMap(node=>node.attrs['data-filter-tag']?[node.attrs['data-filter-tag']]:[]));
  assert.deepEqual([...actual].sort(),archive.taxonomy.map(tag=>tag.id).sort());
  assert.deepEqual(archive.taxonomy,before);
  assert.match(allText(disclosure(root,'axis:year')),/2020년대/);
  assert.match(allText(disclosure(root,'axis:logic')),/条件|조건|논증/);
});

test('untrusted labels and disclosure identifiers are escaped in generated HTML',()=>{
  const taxonomy=[
    {id:'domain-"<bad>',axis:'domain',label:'인문 <script>alert(1)</script> & "예술"'},
    {id:'field-safe',axis:'field',label:'<img src=x>',parentDomain:'인문 <script>alert(1)</script> & "예술"'},
  ];
  const html=api('renderSidebar')({taxonomy},renderChoice);
  assert.doesNotMatch(html,/<script|<img/);
  assert.match(html,/&lt;script&gt;/);
  assert.match(html,/domain:domain-&quot;&lt;bad&gt;/);
  const root=fragment(html);
  assert.ok(disclosure(root,'domain:domain-"<bad>'));
  assert.ok(allText(root).includes('인문 <script>alert(1)</script> & "예술"'));
});
