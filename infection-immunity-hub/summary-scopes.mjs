import {SUMMARY_QUESTIONS} from './summary-bank.mjs?v=20261120a';

export const SUMMARY_SCOPES={
 general:{doc:'notes_general',title:'일반·약리·병리·예방'},
 bacteria:{doc:'notes_bacteria',title:'세균·진균'},
 virus:{doc:'notes_virus',title:'바이러스'}
};

export function summaryFilters(scope='all'){
 const doc=SUMMARY_SCOPES[scope]?.doc;
 const questions=scope==='all'?SUMMARY_QUESTIONS:doc?SUMMARY_QUESTIONS.filter(q=>q.summaryDoc===doc):[];
 return {topic:'all',mode:'all',count:0,questionType:'all',questionIds:questions.map(q=>q.id),summaryScope:scope};
}

export function summaryScopeTitle(scope){
 return scope==='all'?'정리본 종합 복습':SUMMARY_SCOPES[scope]?`정리본 · ${SUMMARY_SCOPES[scope].title}`:'정리본 복습';
}

export function summaryQuestionLabel(question){
 const scope=Object.values(SUMMARY_SCOPES).find(s=>s.doc===question.summaryDoc);
 return scope?`정리본 · ${scope.title}`:'정리본 종합 복습';
}
