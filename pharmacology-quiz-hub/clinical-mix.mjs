// Select a format before the existing least-seen/recent-question logic runs.
// Showing or skipping a question never records an attempt in the shared ledger.
export function clinicalQuestionPool(bank,state={},mode='mixed',period=4,offset=0){
 if(!bank.length)return bank;
 const count=Number.isFinite(state.draws)?state.draws:Object.values(state.seen||{}).reduce((sum,n)=>sum+(Number(n)||0),0);
 const wanted=mode==='clinical'||(mode==='mixed'&&count%period===offset);
 const selected=bank.filter(q=>(q.format==='clinical')===wanted);
 return selected.length?selected:bank;
}
