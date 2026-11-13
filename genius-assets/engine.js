(function(root){
'use strict';
function shuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function calculate(a,op,b){if(typeof a!=='number'||typeof b!=='number')return null;return op==='+'?a+b:op==='−'?a-b:op==='×'?a*b:op==='÷'&&b!==0?a/b:null;}
function numberSolutions(board){const map=new Map();for(let a=0;a<16;a++)for(let o=0;o<16;o++)for(let b=0;b<16;b++){if(a===b||a===o||b===o)continue;const value=calculate(board[a],board[o],board[b]);if(Number.isInteger(value)&&value>0){if(!map.has(value))map.set(value,[]);map.get(value).push([a,o,b]);}}return map;}
function isHap(cards){return cards.length===3&&[0,1,2].every(p=>{const size=new Set(cards.map(c=>c[p])).size;return size===1||size===3;});}
function haps(board){const out=[];for(let a=0;a<board.length;a++)for(let b=a+1;b<board.length;b++)for(let c=b+1;c<board.length;c++)if(isHap([board[a],board[b],board[c]]))out.push([a,b,c]);return out;}
function setDeck(){return Array.from({length:27},(_,i)=>[Math.floor(i/9),Math.floor(i/3)%3,i%3]);}
function numberBoard(rng=Math.random){return shuffle([...Array.from({length:12},(_,i)=>i+1),'+','−','×','÷'],rng);}
function pictureStep(position,correct){return correct?position+1:position-1;}
const api={shuffle,calculate,numberSolutions,numberBoard,isHap,haps,setDeck,pictureStep};if(typeof document==='undefined')module.exports=api;else root.GeniusEngine=api;
})(typeof window==='undefined'?globalThis:window);
