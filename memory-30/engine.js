(function(root){'use strict';
function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=Math.imul(a^a>>>15,1|a);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296}}
function build(seed,round=1){const random=rng(seed),pick=a=>a[Math.floor(random()*a.length)],int=(a,b)=>a+Math.floor(random()*(b-a+1)),shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const names=shuffle(round===1?['서준','하린','도윤','예린','지후','수빈','시우','나연','민재','다은','유진','태오']:['윤서','건우','채원','선우','수아','현우','지안','은호','소율','준서','서아','재윤']);const [a,b,c,d,e,f,g,h,i,j,k,l]=names;
const company=pick(['은하 디자인','여울 출판사','새봄 연구소','하람 건축사무소']),city=pick(['수원','춘천','전주','청주']),height=int(168,188),gain=int(7,16),shoes=pick([245,250,255,260,265,270]),price=pick([12800,15600,18400,21600,24800]),discount=pick([10,20,25]),quantity=int(2,4),days=['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],anchor=int(0,6),visit=int(3,8),baseDay=11,month=pick([4,6,9,11]),dong=int(101,115),ho=pick([203,305,402,507,608]),age=int(19,28),distance=pick([720,960,1440]),speed=pick([60,80,120]),color=pick(['보라색','주황색','초록색','파란색']),item=pick(['손목시계','보온병','필통','우산']),place=pick(['도서관','수영장','기차역','미술관']),floor=int(2,8),duration=pick([15,20,25]),hour=int(9,14),code=String(int(100000,999999)),digit=int(2,5),snack=pick(['크루아상','샌드위치','치즈빵','머핀']),unit=pick([1800,2200,2600,3200]),count=int(3,5),coupon=pick([500,1000,1500]),favorite=pick(['클라이밍','배드민턴','수영','탁구']);
const facts=[];function fact(id,text){facts.push({id,text})}
fact('growth',`${a}: 지난 2년 동안 키가 ${gain}cm 자랐다.`);fact('height',`${a}의 현재 키는 ${height}cm이다.`);fact('shoes',`${a}의 신발 크기는 ${shoes}mm이다.`);
fact('work',`${b}의 직장은 ${company}이다.`);fact('city',`${company}의 사무실은 ${city}에 있다.`);fact('late',`${b}은 매주 목요일 오후 6시부터 밤 10시까지 사무실에서 야근한다.`);
fact('price',`휴대용 스피커 · 정가 ${price.toLocaleString('ko-KR')}원`);fact('sale',`오늘 휴대용 스피커는 정가에서 ${discount}% 할인한다.`);fact('qty',`${c}은 오늘 할인 중인 휴대용 스피커를 ${quantity}개 구매했다.`);
fact('visit',`${d}은 ${month}월 ${visit}일에 ${e}의 집에 방문했다.`);fact('weekday',`올해 ${month}월 ${baseDay}일은 ${days[anchor]}이다.`);fact('home',`${e}의 집 주소: ${dong}동 ${ho}호`);
fact('sibling',`${f}과 ${g}은 쌍둥이이며, 두 사람의 만 나이는 같다.`);fact('age',`${g}의 현재 만 나이는 ${age}세이다.`);fact('hobby',`${f}이 가장 좋아하는 운동은 ${favorite}이다.`);
fact('distance',`${h}의 집에서 ${place}까지의 길이는 ${distance}m이다.`);fact('speed',`${h}은 1분에 ${speed}m의 일정한 속도로 걷는다.`);fact('return',`${h}은 집에서 ${place}까지 걸어갔다가 같은 길로 바로 돌아왔다. 쉬는 시간은 없다.`);
fact('color',`${color} ${item}`);fact('owner',`${i}의 ${item}은 명제에 제시된 색의 ${item}이다. 이 명제 세트의 ${item}은 하나뿐이다.`);fact('location',`${i}은 자신의 ${item}을 ${place} ${floor}층에 두고 왔다.`);
fact('before',`면접 순서: ${j} 바로 다음은 ${k}이다.`);fact('after',`${k} 바로 다음에 면접을 보는 사람은 ${l}이다.`);fact('schedule',`${j}의 면접은 ${hour}시에 시작한다. 각 면접은 ${duration}분이며, 면접 사이 쉬는 시간은 없다.`);
fact('code',`보관함 번호: ${code}`);fact('codeowner',`이 명제 세트의 보관함 주인은 ${c}이다.`);fact('rule',`보관함 주인이 기억해야 할 숫자는 보관함 번호를 왼쪽에서 세어 ${digit}번째 숫자이다.`);
fact('unit',`${snack} 하나의 가격은 ${unit.toLocaleString('ko-KR')}원이다.`);fact('count',`${d}은 ${snack} ${count}개만 샀다.`);fact('coupon',`${d}은 이번 ${snack} 구매 총액에서 ${coupon.toLocaleString('ko-KR')}원을 할인받았다.`);
const shown=shuffle(facts),number=id=>shown.findIndex(f=>f.id===id)+1,pool=[];
function question(text,answer,wrong,refs,explain){answer=String(answer);const options=shuffle([...new Set([answer,...wrong.map(String)])].slice(0,4));if(options.length!==4)throw Error('Four distinct options required: '+text);pool.push({text,answer,options,correct:options.indexOf(answer),refs:refs.map(id=>({id,number:number(id),text:facts.find(f=>f.id===id).text})),explain,depth:refs.length})}
const num=(v,u,steps=[-2,-1,1])=>steps.map(n=>(v+n)+u),money=v=>v.toLocaleString('ko-KR')+'원';
question(`${a}의 신발 크기는?`,shoes+'mm',[shoes-10,shoes-5,shoes+5].map(v=>v+'mm'),['shoes'],`신발 크기는 ${shoes}mm이다.`);
question(`${f}이 가장 좋아하는 운동은?`,favorite,['클라이밍','배드민턴','수영','탁구'].filter(v=>v!==favorite),['hobby'],'운동과 인물을 연결해 기억하는 문제다.');
question(`제시된 ${item}의 색은?`,color,['보라색','주황색','초록색','파란색'].filter(v=>v!==color),['color'],`제시된 물건의 색은 ${color}이다.`);
question(`보관함 번호의 마지막 숫자는?`,code.at(-1),[1,2,3].map(n=>(Number(code.at(-1))+n)%10),['code'],`${code}의 마지막 숫자는 ${code.at(-1)}이다.`);
question(`${company}의 사무실이 있는 도시는?`,city,['수원','춘천','전주','청주'].filter(v=>v!==city),['city'],`사무실은 ${city}에 있다.`);
question(`${a}의 2년 전 키는?`,height-gain+'cm',num(height-gain,'cm'),['growth','height'],`${height} − ${gain} = ${height-gain}cm`);
question(`${b}이 근무하는 사무실이 있는 도시는?`,city,['수원','춘천','전주','청주'].filter(v=>v!==city),['work','city'],`${b} → ${company} → ${city}`);
const sale=price*(100-discount)/100;
question(`오늘 휴대용 스피커 한 개의 할인가격은?`,money(sale),[sale+1000,price,sale-1000].map(money),['price','sale'],`${money(price)} × ${(100-discount)/100} = ${money(sale)}`);
question(`${d}이 ${e}의 집을 방문한 요일은?`,days[(anchor+visit-baseDay+14)%7],shuffle(days.filter(v=>v!==days[(anchor+visit-baseDay+14)%7])).slice(0,3),['visit','weekday'],`${month}월 ${baseDay}일에서 ${baseDay-visit}일 전이므로 ${days[(anchor+visit-baseDay+14)%7]}이다.`);
question(`${f}의 현재 만 나이는?`,age+'세',num(age,'세'),['sibling','age'],`${f}과 ${g}의 만 나이가 같고, ${g}은 ${age}세이다.`);
question(`${j} 다음 다음에 면접을 보는 사람은?`,l,[j,k,a],['before','after'],`${j} → ${k} → ${l}`);
question(`${c}이 오늘 스피커 구매에 지불한 총액은?`,money(sale*quantity),[price*quantity,sale*(quantity+1),sale*quantity-1000,sale*quantity+1700].map(money),['price','sale','qty'],`${money(price)} × ${(100-discount)/100} × ${quantity} = ${money(sale*quantity)}`);
question(`${dong}동 ${ho}호에 ${d}이 방문한 요일은?`,days[(anchor+visit-baseDay+14)%7],shuffle(days.filter(v=>v!==days[(anchor+visit-baseDay+14)%7])).slice(0,3),['home','visit','weekday'],`주소의 주인 ${e} → ${d}의 방문일 ${month}월 ${visit}일 → ${days[(anchor+visit-baseDay+14)%7]}`);
const minutes=distance*2/speed,fmt=v=>Number(v.toFixed(2))+'분';
question(`${h}의 왕복 이동 시간은?`,fmt(minutes),[minutes/2,minutes+2,minutes+5].map(fmt),['distance','speed','return'],`${distance} × 2 ÷ ${speed} = ${fmt(minutes)}`);
question(`${d}이 ${snack} 구매에 실제로 지불한 돈은?`,money(unit*count-coupon),[unit*count,unit*(count-1)-coupon,unit*count+coupon].map(money),['unit','count','coupon'],`${money(unit)} × ${count} − ${money(coupon)} = ${money(unit*count-coupon)}`);
question(`목요일 밤 8시에 ${b}이 야근하고 있는 도시는?`,city,['수원','춘천','전주','청주'].filter(v=>v!==city),['late','work','city'],`야근 시간에 사무실에 있음 → 직장 ${company} → 소재지 ${city}`);
const clock=m=>Math.floor(m/60)+'시 '+String(m%60).padStart(2,'0')+'분';
question(`${l}의 면접 시작 시각은?`,clock(hour*60+duration*2),[hour*60+duration,hour*60+duration*3,hour*60].map(clock),['before','after','schedule'],`${j}부터 두 명 뒤이므로 ${clock(hour*60)} + ${duration} × 2분 = ${clock(hour*60+duration*2)}`);
question(`${i}이 두고 온 물건의 색과 층수가 올바른 것은?`,`${color} · ${floor}층`,[`${color} · ${floor+1}층`,`${['빨간색','노란색'].find(v=>v!==color)} · ${floor}층`,`${color} · ${floor-1}층`],['color','owner','location'],`색 ${color} → 주인 ${i} → ${place} ${floor}층`);
question(`${c}이 보관함 번호에서 기억해야 할 숫자는?`,code[digit-1],[1,2,3].map(n=>(Number(code[digit-1])+n)%10),['code','codeowner','rule'],`${c}의 보관함 번호 ${code}에서 왼쪽 ${digit}번째는 ${code[digit-1]}이다.`);
// Prevent earlier questions from teaching answers to later questions: sample one per concept.
const questions=[...pool.slice(0,5),pool[5],pick([pool[6],pool[15]]),pick([pool[7],pool[11]]),pick([pool[8],pool[12]]),pool[9],pick([pool[10],pool[16]]),pool[13],pool[14],pool[17],pool[18]];
// Drop direct color/city/code questions when their facts appear in the combination questions.
// Substitute unrelated details to avoid leaking a chain's answer.
questions[2]={...questions[2],text:`${i}이 물건을 두고 온 장소는?`,answer:place,options:shuffle(['도서관','수영장','기차역','미술관']),refs:[{id:'location',number:number('location'),text:facts.find(f=>f.id==='location').text}],explain:`${place}에 두고 왔다.`,depth:1};questions[2].correct=questions[2].options.indexOf(place);
questions[4]={...questions[4],text:`${b}의 목요일 야근 종료 시각은?`,answer:'밤 10시',options:shuffle(['밤 8시','밤 9시','밤 10시','밤 11시']),refs:[{id:'late',number:number('late'),text:facts.find(f=>f.id==='late').text}],explain:'목요일 야근은 밤 10시까지이다.',depth:1};questions[4].correct=questions[4].options.indexOf('밤 10시');
// Use the correct Korean particle for each generated person's name.
function natural(text){for(const name of names){const final=(name.charCodeAt(name.length-1)-0xAC00)%28!==0;for(const [withFinal,withoutFinal] of [['은','는'],['이','가'],['을','를'],['과','와']])text=text.replaceAll(name+withFinal,name+(final?withFinal:withoutFinal))}return text}
for(const f of shown)f.text=natural(f.text);
for(const q of questions){q.text=natural(q.text);q.explain=natural(q.explain);for(const f of q.refs)f.text=natural(f.text)}
return {seed,round,facts:shown,questions:shuffle(questions),model:{names,price,discount,quantity,height,gain,unit,count,coupon,distance,speed,age,anchor,visit,baseDay}};
}
const api={build};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Memory30=api;
})(typeof globalThis==='undefined'?this:globalThis);
