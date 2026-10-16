// Every row supplies a source-backed true pair and an independently checked false pair.
// This builder changes presentation; callers remain responsible for pharmacologic overlap.
export function createPairedQuestion(base,anchor,pool,{polarity='correct',index=0,topic='약물과 특징'}={}){
 if(!['correct','incorrect'].includes(polarity))throw Error('Unknown statement polarity');
 const check=r=>{if(!r?.id||!r.left||!r.right||!r.wrong||r.right===r.wrong)throw Error('A row needs different true/right and false/wrong features');if(!r.source||!r.note)throw Error('A row needs source and explanation');};
 check(anchor);
 const offset=((index%pool.length)+pool.length)%pool.length,ordered=[...pool.slice(offset),...pool.slice(0,offset)],others=[],used=new Set([anchor.left]),families=new Set([anchor.family]),features=new Set([anchor.right]);
 const take=r=>{check(r);others.push(r);used.add(r.left);families.add(r.family);features.add(r.right);};
 for(const r of ordered)if(!used.has(r.left)&&!families.has(r.family)&&!features.has(r.right)){take(r);if(others.length===4)break;}
 if(others.length<4)for(const r of ordered)if(!used.has(r.left)&&!features.has(r.right)){take(r);if(others.length===4)break;}
 if(others.length<4)for(const r of ordered)if(!used.has(r.left)){take(r);if(others.length===4)break;}
 if(others.length!==4)throw Error('Five distinct entities are required for a paired question: '+base.id);
 const pairs=[anchor,...others].map((r,i)=>{const valid=i===0?polarity==='correct':polarity==='incorrect';return {id:r.id,entity:r.id,left:r.left,right:valid?r.right:r.wrong,correctRight:r.right,valid,source:r.source,explanation:r.note};});
 const options=pairs.map(p=>p.left+' — '+p.right),answer=options[0];
 const starts=[`다음 ${topic} 연결 중`,`강의록의 ${topic}에 관한 다음 연결 중`,`${topic}을 비교한 다음 연결 중`];
 const stem=starts[index%starts.length]+(polarity==='correct'?' 옳은 것은?':' 옳지 않은 것은?');
 const note=`${polarity==='correct'?'옳은 연결':'옳지 않은 연결'}은 '${answer}'입니다. ${polarity==='incorrect'?`바른 연결: ${anchor.left} — ${anchor.right}. `:''}${anchor.note}`;
 // A previous rendered question must not leave stale choice indices behind.
 const {choices,answerIndex,answers,...metadata}=base;
 return {...metadata,format:'judgment',polarity,stem,options,answer,note,source:anchor.source,pairs,details:pairs.map(p=>`${p.left} — ${p.right}: ${p.valid?'옳은 연결':'옳지 않은 연결'}. 바른 연결: ${p.left} — ${p.correctRight}. ${p.explanation} (${p.source})`)};
}
