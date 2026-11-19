import {emphasizeFeedback} from './emphasis.mjs?v=20261119e';
import {correctChoiceIndices} from './logic.mjs?v=20261119e';

const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeCapture=src=>/^assets\/cbl-past\/[a-z0-9._-]+\.(?:webp|png)$/.test(src||'');
export const originalLabel=q=>`${q.year}년 ${q.examPaper||'1차'} ${q.number}번`;
export function originalChoiceImage(q,index){
 const im=q.choiceImages?.[index];
 return im&&safeCapture(im.src)?`<img class="original-choice-image" src="${e(im.src)}" alt="원문 ${index+1}번 선지 그림" width="${Number(im.width)||300}" height="${Number(im.height)||200}">`:'';
}
function capturesMarkup(captures=[],label='기출 원문'){
 return `<div class="original-captures">${captures.filter(c=>safeCapture(c.src)).map((c,i)=>`<figure><button type="button" class="original-capture" data-original-open="${e(c.src)}" data-original-caption="${e(label)} · 족보 PDF ${e(c.page)}쪽" aria-label="${e(label)} 원문 ${i+1} 확대"><img src="${e(c.src)}" alt="${e(label)} 원문 캡처 ${i+1}" width="${Number(c.width)||900}" height="${Number(c.height)||900}"><span>원문 ${i+1}${captures.length>1?' / '+captures.length:''} · PDF ${e(c.page)}쪽 · 확대 ⤢</span></button></figure>`).join('')}</div>`;
}
export function originalPrompt(q){
 const o=q.original||{};
 return `<section class="original-question-source" aria-label="기출 원문과 OCR"><p class="original-source-label">${e(originalLabel(q))} · 족보 PDF ${(o.pages||[]).map(e).join('·')}쪽</p>${o.figureNote?`<p class="original-classification">${e(o.figureNote)}</p>`:''}${capturesMarkup(o.captures,originalLabel(q))}<details class="original-ocr"><summary>OCR 원문 · 검색·복사</summary><p class="muted">${o.ocrChecked?'캡처와 대조한 전사문':'OCR 전사문'} · 사진·표는 위 원문 캡처를 확인하세요.</p><pre>${e(o.ocrText||q.stem)}</pre>${o.ocrRaw?`<details><summary>자동 OCR 인식 결과</summary><pre>${e(o.ocrRaw)}</pre></details>`:''}</details>${o.classificationNote?`<p class="original-classification">${e(o.classificationNote)}</p>`:''}</section>`;
}
export function originalFeedback(q,correct){
 const accepted=correctChoiceIndices(q),all=q.answerPolicy==='all-credit';
 const answer=all?'전원정답 처리':accepted.map(i=>`${i+1}번 · ${q.choices[i]}`).join(' / ');
 return `<h3>${correct===null?'정답·상세 해설':correct?'정답입니다.':'정답 근거를 확인하세요.'}</h3><p class="answer-line">${all?'족보 판정':'정답'} · ${e(answer)}</p>${q.answerNote?`<p class="original-key-note mark-red">${e(q.answerNote)}</p>`:''}${q.keyClue?`<p class="study-clue"><b>핵심 단서</b> ${emphasizeFeedback(q.keyClue,{clue:true})}</p>`:''}<p>${emphasizeFeedback(q.explanation)}</p>${q.takeaways?.length?`<ul class="original-takeaways">${q.takeaways.map(t=>`<li>${emphasizeFeedback(t)}</li>`).join('')}</ul>`:''}${q.choiceNotes?.length===5?`<details class="choice-explanations" open><summary>선지별 상세 해설</summary><ol>${q.choices.map((c,i)=>`<li><b>${i+1}번 · ${e(c)}</b><p>${emphasizeFeedback(q.choiceNotes[i])}</p></li>`).join('')}</ol></details>`:''}${q.evidenceScope?`<p class="original-evidence-scope">${e(q.evidenceScope)}</p>`:''}${q.editorialNote||q.original?.editorialNote?`<p class="supplement"><b>원문 대조 메모</b> ${e(q.editorialNote||q.original.editorialNote)}</p>`:''}`;
}
export function originalEmpty(section){
 if(!section)return '';
 return `<section class="original-empty-evidence"><h3>족보 수록 범위 확인</h3><p>${e(section.message||section.reason||'제공 자료에서 문항 원문을 확인할 수 없습니다.')}</p>${capturesMarkup(section.captures||section.original?.captures,'출제 여부 기록')}<pre>${e(section.ocrText||section.original?.ocrText||'')}</pre></section>`;
}
export function originalIndex(bank,topics){
 return `<p class="original-library-note">문항별 원문 캡처와 대조한 OCR을 제공합니다. 답을 고르면 정답·선지별 상세 해설과 강의 근거를 확인할 수 있습니다. 원문의 선지 순서를 유지합니다.</p><details class="original-index"><summary>연도·번호로 ${bank.length}개 기출 원문 찾기</summary>${Object.entries(topics).map(([topic,t])=>{const questions=bank.filter(q=>q.topic===topic);return questions.length?`<h3>${e(t.title)}</h3><div class="original-index-buttons">${questions.map(q=>`<button type="button" data-study-original="${e(q.id)}">${e(originalLabel(q))}</button>`).join('')}</div>`:'';}).join('')}</details>`;
}
let installed=false;
export function installOriginalViewer(){
 if(installed)return;installed=true;
 document.body.insertAdjacentHTML('beforeend','<dialog id="originalDialog" class="evidence-dialog original-dialog" aria-labelledby="originalDialogTitle"><div class="evidence-dialog-head"><h2 id="originalDialogTitle">기출 원문</h2><button type="button" class="button outline small" data-original-close>닫기 ×</button></div><div class="evidence-image-scroll"><img id="originalLarge" alt=""></div></dialog>');
 const dialog=document.getElementById('originalDialog'),img=document.getElementById('originalLarge');
 document.addEventListener('click',event=>{
  const open=event.target.closest('[data-original-open]');
  if(open&&safeCapture(open.dataset.originalOpen)){img.src=open.dataset.originalOpen;img.alt=open.dataset.originalCaption||'기출 원문';document.getElementById('originalDialogTitle').textContent=img.alt;dialog.showModal();return;}
  if(event.target.closest('[data-original-close]'))dialog.close();
 });
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
}
