import {groupTags} from './tag-groups.mjs?v=20261026-strengthen-release1';

const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const asSet=value=>new Set(Array.isArray(value)||value instanceof Set?value:[]);
const makeNode=tag=>({id:tag.id,label:tag.label,tag,children:[]});
const fallbackNode=(id,label)=>({id,label,tag:null,children:[]});

function taxonomyTags(taxonomy) {
  const tags=taxonomy instanceof Map?[...taxonomy.values()]:Array.isArray(taxonomy)?taxonomy:[];
  return [...new Map(tags.filter(tag=>tag&&typeof tag.id==='string'&&tag.id).map(tag=>[tag.id,tag])).values()];
}

/** Build the visible domain → field → subject paths without changing registered tags. */
export function buildDomainTree(taxonomy=[]) {
  const tags=taxonomyTags(taxonomy);
  const roots=tags.filter(tag=>tag.axis==='domain').map(makeNode);
  const domains=new Map(roots.map(node=>[node.label,node]));
  const fields=new Map();
  const missingDomains=new Map();
  const missingFields=new Map();

  function unregisteredDomain(label='') {
    const name=label||'대범주 미지정';
    if(!missingDomains.has(name)) {
      const node=fallbackNode(`unregistered-domain:${name}`,name);
      missingDomains.set(name,node);
      roots.push(node);
    }
    return missingDomains.get(name);
  }

  for(const tag of tags.filter(tag=>tag.axis==='field')) {
    const node=makeNode(tag);
    fields.set(tag.label,node);
    const parent=domains.get(tag.parentDomain)||unregisteredDomain(tag.parentDomain);
    parent.children.push(node);
  }

  function unregisteredField(label='') {
    const name=label||'분야 미지정';
    if(!missingFields.has(name)) {
      const node=fallbackNode(`unregistered-field:${name}`,name);
      missingFields.set(name,node);
      unregisteredDomain().children.push(node);
    }
    return missingFields.get(name);
  }

  for(const tag of tags.filter(tag=>tag.axis==='subject')) {
    const registeredParents=Array.isArray(tag.parentFields)?tag.parentFields.filter(parent=>typeof parent==='string'&&parent):[];
    const parents=[...new Set(registeredParents.length?registeredParents:[tag.parentField||''])];
    for(const label of parents)(fields.get(label)||unregisteredField(label)).children.push(makeNode(tag));
  }
  return roots;
}

/** Keep base types visible and attach only explicit parentTagId relationships. */
function buildAxisTree(taxonomy,axis) {
  const tags=taxonomyTags(taxonomy).filter(tag=>tag.axis===axis);
  const nodes=new Map(tags.map(tag=>[tag.id,makeNode(tag)]));
  const roots=[];
  function safeParent(tag) {
    const parent=nodes.get(tag.parentTagId);
    const visited=new Set([tag.id]);
    let current=parent;
    while(current) {
      if(visited.has(current.id))return null;
      visited.add(current.id);
      current=nodes.get(current.tag.parentTagId);
    }
    return parent;
  }
  for(const tag of tags) {
    const node=nodes.get(tag.id),parent=safeParent(tag);
    if(parent)parent.children.push(node);
    else roots.push(node);
  }
  return roots;
}

export function buildTypeTree(taxonomy=[]) { return buildAxisTree(taxonomy,'type'); }
export function buildLogicTree(taxonomy=[]) { return buildAxisTree(taxonomy,'logic'); }

function tagsIn(nodes) {
  const tags=new Map();
  function visit(node) {
    if(node.tag)tags.set(node.tag.id,node.tag);
    node.children.forEach(visit);
  }
  nodes.forEach(visit);
  return [...tags.values()];
}

/** Render only the four filter disclosures; the application owns the surrounding panel. */
export function renderSidebar({taxonomy=[],selectedTags=[],openKeys=[]}={},renderTag) {
  const tags=taxonomyTags(taxonomy),selected=asSet(selectedTags),manual=asSet(openKeys);
  const domainTree=buildDomainTree(tags),typeTree=buildTypeTree(tags),logicTree=buildLogicTree(tags);
  const renderChoice=typeof renderTag==='function'?renderTag:(tag,path)=>{
    const active=selected.has(tag.id);
    return `<button type="button" class="filter-choice${active?' is-active':''}" data-axis="${escape(tag.axis)}" data-filter-tag="${escape(tag.id)}" data-tag-search="${escape([tag.label,tag.description,path].filter(Boolean).join(' '))}" aria-pressed="${active}">${escape(tag.label)}</button>`;
  };
  const countLabel=items=>{
    const count=items.filter(tag=>selected.has(tag.id)).length;
    return `${count?`${count}개 선택 / `:''}${items.length}`;
  };
  const nodeKey=(node,kind)=>`${kind}:${node.id}`;
  const childKind=kind=>kind==='domain'?'field':kind==='field'?'subject':kind;
  function containsOpen(nodes,kind) {
    return nodes.some(node=>manual.has(nodeKey(node,kind))||containsOpen(node.children,childKind(kind)));
  }
  function renderNode(node,path,kind) {
    const ownTags=tagsIn([node]);
    const nested=kind==='domain'||kind==='field'||node.children.length>0;
    if(!nested)return `<div class="filter-tree-leaf" data-related-group>${node.tag?renderChoice(node.tag,path.join(' ')):''}</div>`;
    const key=nodeKey(node,kind);
    const open=manual.has(key)||ownTags.some(tag=>selected.has(tag.id))||containsOpen(node.children,childKind(kind));
    const currentPath=[...path,node.label];
    const groups=new Map();
    for(const child of node.children) {
      const label=child.tag?.refinementGroup||'';
      if(!groups.has(label))groups.set(label,[]);
      groups.get(label).push(child);
    }
    const children=[...groups].map(([label,nodes])=>label?`<section data-related-group class="filter-tag-group"><h4>${escape(label)}</h4>${nodes.map(child=>renderNode(child,[...currentPath,label],childKind(kind))).join('')}</section>`:nodes.map(child=>renderNode(child,currentPath,childKind(kind))).join('')).join('');
    return `<details class="filter-tree-group filter-tree-${kind}" data-related-group data-filter-disclosure="${escape(key)}"${open?' open':''}><summary><span class="filter-disclosure-label">${escape(node.label)}</span><span class="filter-disclosure-count">${escape(countLabel(ownTags))}</span></summary><div class="filter-tree-body">${node.tag?`<div class="filter-parent-choice" data-related-group><span class="filter-parent-label">이 범주 선택</span>${renderChoice(node.tag,path.join(' '))}</div>`:''}<div class="filter-tree-children">${children}</div></div></details>`;
  }
  function renderGroups(axis,label) {
    const roots=axis==='logic'?logicTree:null;
    const nodes=new Map((roots||[]).map(node=>[node.id,node]));
    return groupTags(roots?roots.map(node=>node.tag):tags,{axis}).map(group=>`<section class="filter-tag-group" data-related-group><h4>${escape(group.label)}<span>${escape(countLabel(group.tags))}</span></h4><div class="filter-tags">${group.tags.map(tag=>roots?renderNode(nodes.get(tag.id),[label,group.label],axis):renderChoice(tag,`${label} ${group.label}`)).join('')}</div></section>`).join('');
  }
  const axes=[
    {id:'domain',label:'대범주',tree:domainTree,items:tags.filter(tag=>['domain','field','subject'].includes(tag.axis))},
    {id:'type',label:'문항 유형',tree:typeTree,items:tags.filter(tag=>tag.axis==='type')},
    {id:'logic',label:'풀이 논리',items:tags.filter(tag=>tag.axis==='logic')},
    {id:'year',label:'연도',items:tags.filter(tag=>tag.axis==='year')},
  ];
  return axes.map(axis=>{
    const key=`axis:${axis.id}`;
    const open=manual.has(key)||axis.items.some(tag=>selected.has(tag.id))||containsOpen(axis.tree||(axis.id==='logic'?logicTree:[]),axis.id);
    const selectedCount=axis.items.filter(tag=>selected.has(tag.id)).length;
    const rootCount=axis.tree?axis.tree.length:axis.items.length;
    const rootCountLabel=`${selectedCount?`${selectedCount}개 선택 · `:''}${rootCount}`;
    const choices=axis.tree?axis.tree.map(node=>renderNode(node,[axis.label],axis.id)).join(''):renderGroups(axis.id,axis.label);
    return `<details class="filter-section filter-axis" data-filter-root="${axis.id}" data-filter-disclosure="${key}"${open?' open':''}><summary><span class="filter-disclosure-label">${axis.label}</span><span class="filter-disclosure-count">${escape(rootCountLabel)}</span></summary><div class="filter-axis-body"><p class="filter-rule">${axis.id==='year'?'선택 연도 중 하나 이상 · OR':'선택 태그 모두 · AND'}</p><label class="taxonomy-search-label"><span class="sr-only">${axis.label} 태그 검색</span><input class="taxonomy-search" type="search" data-taxonomy-search="${axis.id}" placeholder="${axis.label} 태그 찾기" autocomplete="off"></label><div class="filter-groups filter-axis-choices" data-tag-choices="${axis.id}">${choices}</div><p class="tag-search-empty" data-tag-empty="${axis.id}" hidden>일치하는 태그가 없습니다.</p></div></details>`;
  }).join('');
}
