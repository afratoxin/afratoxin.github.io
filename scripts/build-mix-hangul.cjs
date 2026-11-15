'use strict';
// Author a fixed-cell block alphabet. All syllables use the full 7×11 drawing box.
const fs=require('node:fs');
const initials=Array.from('ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'),vowels=Array.from('ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'),finals=['',...Array.from('ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ')];
const old=fs.readFileSync('mix-and-match-2/engine.js','utf8');const WORDS=JSON.parse(old.match(/const WORDS=(.*);\n/)[1]);
function bitmap(ch){
 const grid=Array.from({length:11},()=>Array(7).fill(0)),code=ch.charCodeAt(0)-0xac00,initial=initials[Math.floor(code/588)],vowel=vowels[Math.floor(code/28)%21],final=finals[code%28];
 const dot=(x,y)=>{if(x>=0&&x<7&&y>=0&&y<11)grid[y][x]=1;};
 function line(x1,y1,x2,y2){let dx=Math.abs(x2-x1),sx=x1<x2?1:-1,dy=-Math.abs(y2-y1),sy=y1<y2?1:-1,err=dx+dy;for(;;){dot(x1,y1);if(x1===x2&&y1===y2)break;const e=2*err;if(e>=dy){err+=dy;x1+=sx;}if(e<=dx){err+=dx;y1+=sy;}}}
 function consonant(c,x,y,w,h){
  const X=x+w-1,Y=y+h-1,mx=x+Math.floor((w-1)/2),my=y+Math.floor((h-1)/2),H=yy=>line(x,yy,X,yy),V=xx=>line(xx,y,xx,Y),rect=()=>{H(y);H(Y);V(x);V(X);};
  const pairs={'ㄲ':'ㄱㄱ','ㄸ':'ㄷㄷ','ㅃ':'ㅂㅂ','ㅆ':'ㅅㅅ','ㅉ':'ㅈㅈ','ㄳ':'ㄱㅅ','ㄵ':'ㄴㅈ','ㄶ':'ㄴㅎ','ㄺ':'ㄹㄱ','ㄻ':'ㄹㅁ','ㄼ':'ㄹㅂ','ㄽ':'ㄹㅅ','ㄾ':'ㄹㅌ','ㄿ':'ㄹㅍ','ㅀ':'ㄹㅎ','ㅄ':'ㅂㅅ'};
  if(pairs[c]){const left=Math.floor((w-1)/2),right=w-left-1;consonant(pairs[c][0],x,y,left,h);consonant(pairs[c][1],x+left+1,y,right,h);return;}
  if(c==='ㄱ'){H(y);V(X);}if(c==='ㄴ'){V(x);H(Y);}if(c==='ㄷ'){H(y);V(x);H(Y);}if(c==='ㄹ'){H(y);line(X,y,X,my);H(my);line(x,my,x,Y);H(Y);}if(c==='ㅁ')rect();
  if(c==='ㅂ'){V(x);V(X);H(my);H(Y);}if(c==='ㅅ'){line(mx,y,mx,my);line(mx,my,x,Y);line(mx,my,X,Y);}
  if(c==='ㅇ'){if(w<3||h<3){rect();return;}line(x+1,y,X-1,y);line(x+1,Y,X-1,Y);line(x,y+1,x,Y-1);line(X,y+1,X,Y-1);}
  if(c==='ㅈ'||c==='ㅊ'){const top=c==='ㅊ'?y+Math.min(2,h-2):y;if(c==='ㅊ')line(mx,y,mx,top-1);H(top);line(mx,top,mx,Math.max(top,my));line(mx,Math.max(top,my),x,Y);line(mx,Math.max(top,my),X,Y);}
  if(c==='ㅋ'){H(y);H(my);V(X);}if(c==='ㅌ'){H(y);H(my);H(Y);V(x);}if(c==='ㅍ'){H(y);H(Y);line(x+Math.min(1,w-1),y,x+Math.min(1,w-1),Y);line(X-Math.min(1,w-1),y,X-Math.min(1,w-1),Y);}
  if(c==='ㅎ'){H(y+Math.min(1,h-1));dot(mx,y);const cy=y+Math.min(3,h-2);consonant('ㅇ',x,cy,w,Y-cy+1);}
 }
 function vertical(v,x,y,w,h){const X=x+w-1,Y=y+h-1,mid=y+Math.floor((h-1)/2),double=['ㅐ','ㅒ','ㅔ','ㅖ'].includes(v),right=['ㅓ','ㅕ','ㅔ','ㅖ'].includes(v),stem=double?(right?x+1:x):right?X:x,ys=['ㅑ','ㅒ','ㅕ','ㅖ'].includes(v)?[Math.max(y,mid-1),Math.min(Y,mid+1)]:[mid];if(v==='ㅣ'){line(X,y,X,Y);return;}line(stem,y,stem,Y);for(const yy of ys)line(double?x:right?x:stem,yy,double?X-1:right?stem:X,yy);if(double)line(X,y,X,Y);}
 function horizontal(v,x,y,w,h){const X=x+w-1,Y=y+h-1,up=['ㅗ','ㅛ'].includes(v),bar=up?Y:y;line(x,bar,X,bar);if(v==='ㅡ')return;const arms=['ㅛ','ㅠ'].includes(v)?[x+Math.floor((w-1)/3),x+Math.ceil(2*(w-1)/3)]:[x+Math.floor((w-1)/2)];for(const xx of arms)line(xx,up?y:bar,xx,up?bar:Y);}
 const compound={'ㅘ':['ㅗ','ㅏ'],'ㅙ':['ㅗ','ㅐ'],'ㅚ':['ㅗ','ㅣ'],'ㅝ':['ㅜ','ㅓ'],'ㅞ':['ㅜ','ㅔ'],'ㅟ':['ㅜ','ㅣ'],'ㅢ':['ㅡ','ㅣ']};
 if(compound[vowel]){const finalH=final==='ㄹ'?5:3,upper=final?10-finalH:11,vw=['ㅙ','ㅞ'].includes(vowel)?3:2,cw=7-vw-1;consonant(initial,0,0,cw,Math.max(2,upper-3));horizontal(compound[vowel][0],0,upper-3,cw+1,3);vertical(compound[vowel][1],cw+1,0,vw,upper);if(final)consonant(final,0,11-finalH,7,finalH);}
 else if(['ㅗ','ㅛ','ㅜ','ㅠ','ㅡ'].includes(vowel)){const finalH=final==='ㄹ'?5:3,ch=final?(finalH===5?3:4):vowel==='ㅡ'?8:6;consonant(initial,0,0,7,ch);const vy=ch+1,vh=final?(finalH===5?2:2):11-vy;horizontal(vowel,0,vowel==='ㅡ'?(final?ch+1:10):vy,7,vowel==='ㅡ'?1:vh);if(final)consonant(final,0,11-finalH,7,finalH);}
 else{const finalH=final==='ㄹ'?5:4,h=final?10-finalH:11,vw=['ㅐ','ㅒ','ㅔ','ㅖ'].includes(vowel)?3:2;consonant(initial,0,0,7-vw-1,h);vertical(vowel,7-vw,0,vw,h);if(final)consonant(final,0,11-finalH,7,finalH);}
 return grid.map(row=>row.join(''));
}
const chars=[...new Set(Object.values(WORDS).flat().join(''))];const atlas=Object.fromEntries(chars.map(ch=>[ch,bitmap(ch)]));
for(const [ch,rows]of Object.entries(atlas)){const cells=rows.flatMap((row,y)=>[...row].flatMap((v,x)=>v==='1'?[[x,y]]:[]));if(Math.min(...cells.map(c=>c[0]))!==0||Math.max(...cells.map(c=>c[0]))!==6||Math.min(...cells.map(c=>c[1]))!==0||Math.max(...cells.map(c=>c[1]))!==10)throw Error('Incomplete 7×11 glyph: '+ch);}
fs.writeFileSync('mix-and-match-2/glyphs.js',"(function(root){'use strict';const glyphs="+JSON.stringify(atlas)+";if(typeof module!=='undefined'&&module.exports)module.exports=glyphs;else root.MixHangulGlyphs=glyphs;})(typeof window==='undefined'?globalThis:window);\n");console.log('Wrote '+chars.length+' full 7×11 Hangul glyphs.');
