import {SOURCE_PAGES} from './source-pages.mjs?v=20261114c';

const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const aliases={path1:'261104_02',path2:'261104_03',lab:'261104_05'};

export function sessionMetrics(session){
 const items=session?.items||[],graded=items.filter(item=>item.selected!==null&&item.selected!==undefined);
 const correct=graded.filter(item=>item.selected===item.answer).length,answered=graded.length;
 return {answered,correct,wrong:answered-correct,total:items.length,rate:answered?Math.round(correct/answered*100):null};
}

export function sourcePages(q){
 const refs=q.sourceRefs?.length?q.sourceRefs:[{doc:'antibiotics',pages:q.pages||[]}],seen=new Set(),pages=[];
 for(const ref of refs){
  const doc=aliases[ref.doc]||ref.doc;
  for(const page of ref.pages||[]){
   const key=`${doc}:${page}`,entry=SOURCE_PAGES[key];
   if(!Number.isInteger(page)||page<1||!entry||seen.has(key))continue;
   seen.add(key);pages.push(entry);
  }
 }
 return pages;
}

export function practiceLayout({question,feedback='',q,session,sourceLabel=''}){
 const m=sessionMetrics(session),graded=Boolean(feedback),pages=graded?sourcePages(q):[];
 // Keep the full option-by-option comparison available without pushing source pages away.
 feedback=feedback.replace('class="choice-explanations" open','class="choice-explanations"');
 const shortcutText=(q.format==='ox'?'O / X 선택':'1–5 선택')+(/^lecture-|^table-/.test(q.id||'')?' · 채점 후 Enter 다음 문제':'');
 const evidence=pages.length?`<section class="evidence-card"><div class="support-heading"><h2>강의록 근거</h2><span>${pages.length}쪽</span></div><p class="evidence-caption">${escape(sourceLabel)}<br>실제 PDF 쪽수 · 누르면 확대</p><div class="evidence-grid">${pages.map(p=>`<button type="button" class="evidence-preview" data-evidence-open="${escape(p.doc+':'+p.page)}" aria-label="${escape(p.title)} PDF ${p.page}쪽 확대"><img class="source-page-image" src="${escape(p.src)}" alt="${escape(p.title)} 강의록 PDF ${p.page}쪽" width="${p.width}" height="${p.height}" loading="lazy"><span>${escape(p.title)}<b>PDF ${p.page}쪽 · 확대 ⤢</b></span></button>`).join('')}</div></section>`:'';
 return `<div class="practice-layout${graded?' is-graded':''}"><div class="practice-question-column">${question}</div><aside class="practice-support" aria-label="해설과 학습 보조 자료"><section class="practice-metrics"><div class="support-heading"><h2>학습 현황</h2><span>현재 세트</span></div><div class="practice-metric-grid"><div><strong>${m.rate===null?'—':m.rate+'%'}</strong><span>정답률</span></div><div><strong>${m.correct}<small> / ${m.answered}</small></strong><span>정답 / 채점</span></div><div><strong class="mark-red">${m.wrong}</strong><span>오답</span></div></div><progress value="${m.answered}" max="${m.total||1}" aria-label="${m.total}문항 중 ${m.answered}문항 채점"></progress><p>${m.answered} / ${m.total}문항 채점 · 건너뛴 문제는 미풀이</p></section>${graded?feedback:`<section class="support-locked"><h2>해설·강의 근거</h2><p>답을 고르면 이곳에서 정답과 감별점, 근거가 되는 강의록 페이지를 함께 확인할 수 있습니다.</p><div class="support-study-tip"><b>감별 순서</b><p>증례의 특이 소견 → 비슷한 보기의 차이 → 가장 적절한 답</p></div><p class="support-shortcuts">${shortcutText}</p></section>`}${evidence}</aside></div>`;
}

let viewerInstalled=false;
export function installEvidenceViewer(){
 if(viewerInstalled)return;viewerInstalled=true;
 document.body.insertAdjacentHTML('beforeend','<dialog id="evidenceDialog" class="evidence-dialog" aria-labelledby="evidenceTitle"><div class="evidence-dialog-head"><h2 id="evidenceTitle">강의록 근거</h2><button type="button" class="button outline small" data-evidence-close>닫기 ×</button></div><p>실제 PDF 페이지 캡처 · 인쇄된 쪽번호와 다를 수 있습니다.</p><div class="evidence-image-scroll"><img id="evidenceLarge" alt=""></div></dialog>');
 const dialog=document.getElementById('evidenceDialog');
 document.addEventListener('click',event=>{
  const open=event.target.closest('[data-evidence-open]');
  if(open){const page=SOURCE_PAGES[open.dataset.evidenceOpen];if(!page)return;document.getElementById('evidenceTitle').textContent=`${page.title} · PDF ${page.page}쪽`;const img=document.getElementById('evidenceLarge');img.src=page.src;img.alt=`${page.title} PDF ${page.page}쪽`;dialog.showModal();return;}
  if(event.target.closest('[data-evidence-close]'))dialog.close();
 });
 dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
}
