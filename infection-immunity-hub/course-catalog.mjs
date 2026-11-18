export const COURSE_GROUPS={
 general:{title:'일반',description:'병인·진단·치료·병리·약리·소아감염'},
 bacteria:{title:'세균·진균',description:'균 특성·독소·배양·감별'},
 virus:{title:'바이러스',description:'구조·질환·검사·항원과 항체'},
 cbl:{title:'CBL',description:'증례의 단서·감별진단·검사·치료 판단'}
};
export const EXTRA_LECTURES={
 '261102_02':{title:'감염병의 병인론',teacher:'최은화',pages:50,group:'general'},
 '261102_03':{title:'감염병의 진단',teacher:'김택수',pages:66,group:'general'},
 '261102_05':{title:'감염병의 치료원칙',teacher:'김홍빈',pages:55,group:'general'},
 '261109_03':{title:'항생제 약리학의 기본 원리·항생제 내성',teacher:'이승환',pages:29,group:'general'},
 '261109_05':{title:'항생제 내성균의 진단과 치료',teacher:'송경호',pages:116,group:'general'},
 '261110_02':{title:'아데노바이러스·폭스바이러스',teacher:'방예지',pages:41,group:'virus'},
 '261111_01':{title:'파르보바이러스',teacher:'김현제',pages:14,group:'virus'},
 '261111_02':{title:'피코르나바이러스',teacher:'조남혁',pages:33,group:'virus'},
 '261112_01':{title:'오소믹소바이러스',teacher:'조남혁',pages:44,group:'virus'},
 '261112_02':{title:'파라믹소·풍진바이러스',teacher:'조남혁',pages:52,group:'virus'},
 '261112_03':{title:'간염바이러스',teacher:'김범준',pages:43,group:'virus'},
 '261113_01':{title:'헤르페스바이러스과',teacher:'김현제',pages:31,group:'virus'},
 '261113_02':{title:'소아감염',teacher:'윤기욱',pages:47,group:'general'}
};
export const CBL_LECTURES={
 '261109_06':{title:'CBL 1 · 침습성 세균감염',short:'CBL 1',teacher:'문송미·강창경',pages:19,group:'cbl'},
 '261111_03':{title:'CBL 2 · Mpox·수막구균',short:'CBL 2',teacher:'이찬미·이현주',pages:6,group:'cbl'},
 '261113_03':{title:'CBL 3 · 대상포진·PPGSS',short:'CBL 3',teacher:'윤기옥·이찬미',pages:9,group:'cbl'}
};
export const NOV16_LECTURES={"261116_01":{"title":"신종·재출현 바이러스","teacher":"조남혁","pages":53,"group":"virus"},"261116_02":{"title":"토가바이러스·플라비바이러스","teacher":"염진기","pages":46,"group":"virus"},"261116_03":{"title":"필로바이러스·분야바이러스","teacher":"염진기","pages":38,"group":"virus"},"261116_05":{"title":"진균감염·칸디다·폐포자충","teacher":"김남중","pages":45,"group":"bacteria"},"261116_06":{"title":"아스페르길루스·크립토코쿠스·털곰팡이·피부진균","short":"아스페르길루스·크립토코쿠스 등","teacher":"김남중","pages":44,"group":"bacteria"}};
export const NOV18_LECTURES={'261118_01':{title:'의료관련감염',teacher:'김의석',pages:49,group:'general'},'261118_02':{title:'방어기전손상환자의 감염',teacher:'최평균',pages:36,group:'general'},'261118_05':{title:'레오바이러스·코로나바이러스·노로바이러스',short:'레오·코로나·노로',teacher:'조남혁',pages:60,group:'virus'}};
const pathology=new Set(['261104_02','261104_03','261104_05']);
export const groupForLecture=code=>NOV18_LECTURES[code]?.group||NOV16_LECTURES[code]?.group||CBL_LECTURES[code]?.group||EXTRA_LECTURES[code]?.group||(pathology.has(code)?'general':'bacteria');
export function orderedLectures(existing){
 return Object.fromEntries(Object.entries({...existing,...EXTRA_LECTURES,...CBL_LECTURES,...NOV16_LECTURES,...NOV18_LECTURES}).sort(([a],[b])=>a.localeCompare(b)).map(([code,t],i)=>[code,{...t,short:t.short||t.title,order:i+1,group:groupForLecture(code)}]));
}
