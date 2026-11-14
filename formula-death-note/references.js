(()=>{'use strict';
const types=['factorial','square','power'],storageKey='death-note-reference-tables-v1',format=n=>n.toLocaleString('ko-KR');
function renderTable(id,title,caption,headers,rows){
 const host=document.getElementById('reference-'+id),heading=document.createElement('h3'),scroll=document.createElement('div'),table=document.createElement('table'),cap=document.createElement('caption'),head=document.createElement('thead'),body=document.createElement('tbody'),header=document.createElement('tr');
 heading.id='reference-title-'+id;heading.textContent=title;scroll.className='reference-scroll';scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-labelledby',heading.id);cap.textContent=caption;table.append(cap);
 headers.forEach(value=>{const cell=document.createElement('th');cell.scope='col';cell.textContent=value;header.append(cell)});head.append(header);table.append(head);
 rows.forEach(values=>{const row=document.createElement('tr');values.forEach((value,index)=>{const cell=document.createElement(index===0?'th':'td');if(index===0)cell.scope='row';cell.textContent=value;row.append(cell)});body.append(row)});table.append(body);scroll.append(table);host.append(heading,scroll);
}
let factorial=1;const factorialRows=[];for(let n=0;n<=12;n++){if(n>0)factorial*=n;factorialRows.push([n+'!',format(factorial)])}
renderTable('factorial','팩토리얼 표','0!~12! · 게임에서 허용하는 팩토리얼 범위',['수식','값'],factorialRows);
renderTable('square','제곱수 표','1²~30² · 괄호로 만든 수도 제곱할 수 있습니다.',['수식','값'],Array.from({length:30},(_,i)=>[(i+1)+'²',format((i+1)**2)]));
renderTable('power','지수 표','밑 2~6, 지수 2~10 · 예: 2^5 = 32. 옆으로 스크롤할 수 있습니다.',['지수 n','2ⁿ','3ⁿ','4ⁿ','5ⁿ','6ⁿ'],Array.from({length:9},(_,i)=>[i+2,...[2,3,4,5,6].map(base=>format(base**(i+2)))]));
let saved={};try{const value=JSON.parse(localStorage.getItem(storageKey)||'{}');if(value&&typeof value==='object')saved=value}catch{}
function sync(){let visible=false;types.forEach(type=>{const checked=document.getElementById('show-'+type).checked;document.getElementById('reference-'+type).hidden=!checked;visible=visible||checked});document.getElementById('reference-empty').hidden=visible}
types.forEach(type=>{const input=document.getElementById('show-'+type);input.checked=saved[type]===true;input.addEventListener('change',()=>{sync();const preferences={};types.forEach(key=>preferences[key]=document.getElementById('show-'+key).checked);try{localStorage.setItem(storageKey,JSON.stringify(preferences))}catch{}})});sync();
})();
