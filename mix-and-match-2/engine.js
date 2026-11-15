(function(root){'use strict';
const WORDS={"2":["사과","바다","우주","나무","구름","하늘","바람","노을","달빛","별빛","학교","연필","시계","가방","의자","책상","창문","거울","사진","마음","생각","기억","약속","여행","소금","설탕","우산","눈꽃","파도","강물","단풍","번개","태양","달력","호수","공원","시장","도시","골목","노래","춤꾼","그림","물감","종이","열쇠","비밀","지혜","용기","행복","희망"],"3":["무지개","도서관","자전거","비행기","자동차","소나기","강아지","고양이","호랑이","코끼리","다람쥐","원숭이","나침반","모래성","눈사람","꽃다발","선인장","민들레","진달래","소나무","개나리","잠자리","반딧불","나뭇잎","보름달","초승달","지평선","수평선","운동장","정거장","박물관","미술관","수영장","냉장고","세탁기","계산기","돋보기","손수건","목도리","신호등"],"4":["해바라기","고속도로","횡단보도","전화번호","주민등록","일기예보","사자성어","동문서답","우왕좌왕","좌충우돌","동고동락","금상첨화","일석이조","천고마비","유비무환","자업자득","인과응보","고진감래","산전수전","희로애락","기승전결","이심전심","오리무중","전전긍긍","십중팔구","천차만별","가지각색","지리멸렬","과학기술","자연환경","문화유산","비밀번호","생활습관","대중교통"]};
const GLYPHS=typeof module!=='undefined'&&module.exports?require('./glyphs.js'):root.MixHangulGlyphs;
const LENGTHS=[2,2,2,2,3,3,3,3,3,4,4,4];
function shuffle(a,r=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function glyph(ch){const rows=GLYPHS[ch];if(!rows)throw Error('Missing 7×11 glyph: '+ch);return rows.flatMap((row,y)=>[...row].flatMap((v,x)=>v==='1'?[y*7+x]:[]));}
function make(word,n,r=Math.random){const w=word.length*9,h=13,active=[];[...word].forEach((ch,j)=>glyph(ch).forEach(i=>active.push((Math.floor(i/7)+1)*w+1+j*9+i%7)));const pieces=Array.from({length:n},()=>[]);shuffle(active,r).forEach((v,i)=>pieces[i%n].push(v));return{word,w,h,pieces,active};}
function makeDeck(r=Math.random){return [2,3,4].flatMap((n,i)=>shuffle(WORDS[n],r).slice(0,[4,5,3][i]));}
const api={WORDS,GLYPHS,LENGTHS,shuffle,glyph,make,makeDeck};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MixHangul=api;
})(typeof window==='undefined'?globalThis:window);
