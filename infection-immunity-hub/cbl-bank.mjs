import {QUESTIONS as Q1,RECALL_QUESTIONS as R1,PARTS as P1} from './cbl1-bank.mjs?v=20261118c';
import {QUESTIONS as Q2,RECALL_QUESTIONS as R2,PARTS as P2} from './cbl2-bank.mjs?v=20261118c';
import {QUESTIONS as Q3,RECALL_QUESTIONS as R3,PARTS as P3} from './cbl3-bank.mjs?v=20261118c';

const guidance={
 fascia:{title:'IDSA · 괴사성 연조직 감염',url:'https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/'},
 meningo:{title:'CDC · 수막구균 접촉자 예방',url:'https://www.cdc.gov/surv-manual/php/table-of-contents/chapter-8-meningococcal-disease.html'},
 mpox:{title:'WHO · Mpox 진단·관리',url:'https://www.who.int/news-room/fact-sheets/detail/mpox'},
 vzv:{title:'CDC · VZV 감염관리',url:'https://www.cdc.gov/infection-control/hcp/isolation-precautions/appendix-a-type-duration.html'},
 b19:{title:'CDC · B19 노출·위험군 관리',url:'https://www.cdc.gov/infection-control/hcp/healthcare-personnel-epidemiology-control/parvovirus.html'}
};
function withGuidance(q){
 const key=q.lecture==='261111_03'?(/수막구균/.test(q.stem)?'meningo':/Mpox/.test(q.stem)?'mpox':null):q.lecture==='261113_03'?(/대상포진|수두|VZV/.test(q.stem)?'vzv':'b19'):/urgent-exploration|clindamycin-role|repeat-debridement/.test(q.id)?'fascia':null;
 return key?{...q,externalRefs:[...(q.externalRefs||[]),guidance[key]]}:q;
}
export const CBL_QUESTIONS=[...Q1,...Q2,...Q3].map(withGuidance);
export const CBL_RECALL_QUESTIONS=[...R1,...R2,...R3].map(withGuidance);
export const CBL_PARTS={...P1,...P2,...P3};
