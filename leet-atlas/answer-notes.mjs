const circle=['','①','②','③','④','⑤'];
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function answerInfo(question,registry={records:[]}){
 const exception=registry.records?.find(record=>record.questionId===question.id)||null;
 const options=exception?.correctOptions?.map(number=>circle[number]).join('·')||'';
 const finalLabel=!exception?'':exception.type==='no-answer'?`정답 없음${exception.scoring==='all-accepted'?' · 전원 정답 처리':''}`:exception.type==='multiple-answers'?`복수정답 ${options}`:`최종 답안 ${options}`;
 return {bookAnswer:question.answer,bookLabel:circle[question.answer]||String(question.answer),basisLabel:'공식 해설서 기준 답안',exception,finalLabel,verificationLabel:exception?'별도 최종 처리 이력 있음':'별도 최종 처리 이력 미등록'};
}
export function answerHistoryMarkup(question,registry){
 const info=answerInfo(question,registry),note=info.exception;
 if(!note)return `<details class="provenance-details"><summary>답안 기준·출처 확인</summary><p>표기 답안은 사용자가 지정한 공식 해설서 기준입니다. 별도 최종 처리 이력은 현재 등록되지 않았습니다.</p><p>처리 이력 미등록은 이의심사 이력이 없다는 뜻이 아닙니다. 최종 결정이 확인되면 해설서 답안과 분리해 기록합니다.</p></details>`;
 return `<aside class="answer-exception" aria-label="최종 답안 처리 이력"><strong>${esc(info.finalLabel)}</strong><p>${esc(note.summary)}</p><p>${esc(note.reason)}</p><p class="answer-exception-meta">해설서 표기 ${esc(info.bookLabel)} 유지 · 결정일 ${esc(note.decisionDate)} · 기록 확인 ${esc(registry.checkedAt)}</p>${(note.sources||[]).filter(source=>/^https?:\/\//.test(source.url)).map(source=>`<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)}</a>`).join(' · ')}<p class="answer-exception-meta">${esc(note.evidenceNote||'')}</p></aside>`;
}
