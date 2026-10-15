// Small DOM fixture for exercising the app's real event handlers without a browser.
export function createTestDocument(html){
  const decode=s=>s.replace(/&(?:amp|lt|gt|quot|#39);/g,x=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[x]));
  class Element{
    constructor(tag){this.tagName=tag.toUpperCase();this.childNodes=[];this.attributes={};this.dataset={};this.listeners={};this.style={values:{},setProperty(k,v){this.values[k]=String(v);},getPropertyValue(k){return this.values[k]||'';}};this.className='';this.hidden=false;this.disabled=false;this._value=null;this.classList={contains:c=>this.className.split(/\s+/).includes(c),toggle:(c,on)=>{const s=new Set(this.className.split(/\s+/).filter(Boolean));on??=!s.has(c);on?s.add(c):s.delete(c);this.className=[...s].join(' ');return on;},add:(...cs)=>cs.forEach(c=>this.classList.toggle(c,true)),remove:(...cs)=>cs.forEach(c=>this.classList.toggle(c,false))};}
    get children(){return this.childNodes.filter(x=>x.tagName!=='#TEXT');}get childElementCount(){return this.children.length;}get parentElement(){return this.parentNode;}get firstElementChild(){return this.children[0];}get nextSibling(){const a=this.parentNode?.childNodes||[];return a[a.indexOf(this)+1]||null;}
    set id(v){this.attributes.id=v;}get id(){return this.attributes.id;}
    set value(v){this._value=String(v);}get value(){if(this._value!==null)return this._value;if(this.tagName==='SELECT')return this.children.find(x=>x.attributes.selected!==undefined)?.value||this.children[0]?.value||'';return this.attributes.value??this.textContent;}
    set textContent(s){this.replaceChildren();if(String(s)){const t=new Element('#text');t._text=String(s);this.append(t);}}get textContent(){return this.tagName==='#TEXT'?this._text||'':this.childNodes.map(x=>x.textContent).join('');}
    set innerHTML(s){this.replaceChildren();parse(s,this);}get innerHTML(){return this.textContent;}
    append(...xs){for(let x of xs){if(typeof x==='string'){const t=new Element('#text');t._text=x;x=t;}if(x.fragment){this.append(...[...x.childNodes]);continue;}if(x.parentNode)x.parentNode.childNodes=x.parentNode.childNodes.filter(n=>n!==x);this.childNodes.push(x);x.parentNode=this;}}
    insertBefore(n,before){if(!before){this.append(n);return n;}if(n.parentNode)n.parentNode.childNodes=n.parentNode.childNodes.filter(x=>x!==n);this.childNodes.splice(this.childNodes.indexOf(before),0,n);n.parentNode=this;return n;}
    replaceChildren(...xs){this.childNodes.forEach(x=>x.parentNode=null);this.childNodes=[];this.append(...xs);}
    setAttribute(k,v){this.attributes[k]=String(v);if(k==='class')this.className=String(v);if(k==='hidden')this.hidden=true;if(k==='disabled')this.disabled=true;if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=String(v);}
    getAttribute(k){if(k.startsWith('data-'))return this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]??null;return this.attributes[k]??null;}removeAttribute(k){delete this.attributes[k];if(k==='hidden')this.hidden=false;}
    addEventListener(k,fn){(this.listeners[k]??=[]).push(fn);}
    dispatch(k,extra={}){let stopped=false;const e={key:'',target:this,preventDefault(){this.defaultPrevented=true;},stopPropagation(){stopped=true;},...extra};for(let n=this;n;n=n.parentNode){for(const fn of n.listeners[k]||[])fn(e);if(stopped)break;}return e;}
    click(){if(!this.disabled)this.dispatch('click');}contains(n){return this===n||this.childNodes.some(x=>x.contains(n));}
    matches(selector){
      const attrs=[...selector.matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)];let bare=selector.replace(/\[[^\]]+\]/g,'');
      if(attrs.some(([,k,v])=>this.getAttribute(k)===null||(v!==undefined&&this.getAttribute(k)!==v)))return false;
      const id=bare.match(/#([\w-]+)/);if(id&&this.id!==id[1])return false;
      for(const [,c]of bare.matchAll(/\.([\w-]+)/g))if(!this.classList.contains(c))return false;
      const tag=bare.match(/^[\w-]+/);return !tag||this.tagName===tag[0].toUpperCase();
    }
    closest(s){return this.matches(s)?this:this.parentNode?.closest(s)||null;}
    querySelectorAll(s){
      const special=s.match(/^\[data-category="(.*)"\] \.zone-chips$/);if(special){const zone=this.querySelectorAll('[data-category]').find(x=>x.dataset.category===special[1]);return zone?zone.querySelectorAll('.zone-chips'):[];}
      const out=[];for(const c of this.children){if(c.matches(s))out.push(c);out.push(...c.querySelectorAll(s));}return out;
    }
    querySelector(s){return this.querySelectorAll(s)[0]||null;}
  }
  function parse(source,root){const stack=[root];for(const token of source.match(/<!--[\s\S]*?-->|<![^>]*>|<[^>]*>|[^<]+/g)||[]){if(token.startsWith('<!'))continue;if(token.startsWith('</')){const tag=token.slice(2,-1).trim().toUpperCase();if(stack.some(x=>x.tagName===tag))while(stack.pop().tagName!==tag){}continue;}if(token.startsWith('<')){const tag=token.match(/^<([\w-]+)/)?.[1];if(!tag)continue;const e=new Element(tag);const rest=token.slice(tag.length+1,-1);for(const m of rest.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g))e.setAttribute(m[1],decode(m[2]??m[3]??m[4]??''));stack.at(-1).append(e);if(!/^(meta|link|input|img|br|hr|source)$/i.test(tag)&&!token.endsWith('/>'))stack.push(e);}else{const t=new Element('#text');t._text=decode(token);stack.at(-1).append(t);}}}
  const doc=new Element('#document');doc.createElement=tag=>new Element(tag);doc.createElementNS=(ns,tag)=>new Element(tag);doc.createDocumentFragment=()=>Object.assign(new Element('fragment'),{fragment:true});doc.getElementById=id=>doc.querySelector('#'+id);parse(html,doc);return doc;
}
