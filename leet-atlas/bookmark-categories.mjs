import {BOOKMARK_COLORS,bookmarkColors,isBookmarkCategoryId} from './core.mjs';

export const BOOKMARK_CATEGORIES_KEY='leet-atlas:bookmark-categories:v1';
const clone=categories=>categories.map(category=>({...category}));
const nameKey=name=>name.normalize('NFKC').trim().toLocaleLowerCase('ko');
const legacy=new Map(BOOKMARK_COLORS.map(category=>[category.id,category]));

export function defaultBookmarkCategories(){
 return ['red','green','blue'].map((id,index)=>({id,label:`북마크 ${index+1}`,hex:legacy.get(id).hex}));
}

export function validateBookmarkCategories(input){
 if(!Array.isArray(input)||input.length>100)throw new Error('북마크 종류는 최대 100개까지 저장할 수 있습니다.');
 const ids=new Set(),names=new Set();
 return input.map(value=>{
  if(!value||typeof value!=='object'||Array.isArray(value)||!isBookmarkCategoryId(value.id))throw new Error('북마크 종류의 ID를 확인해 주세요.');
  if(typeof value.label!=='string'||!value.label.trim()||[...value.label.trim()].length>40)throw new Error('북마크 이름은 1~40자로 입력해 주세요.');
  if(typeof value.hex!=='string'||!/^#[0-9a-fA-F]{6}$/.test(value.hex))throw new Error('북마크 색상은 #RRGGBB 형식이어야 합니다.');
  const label=value.label.trim(),key=nameKey(label);
  if(ids.has(value.id)||names.has(key))throw new Error('같은 ID나 이름의 북마크 종류가 이미 있습니다.');
  ids.add(value.id);names.add(key);return {id:value.id,label,hex:value.hex.toLowerCase()};
 });
}

function uniqueRecoveryLabel(preferred,names){
 let label=preferred,index=2;
 while(names.has(nameKey(label)))label=`${preferred.slice(0,30)} (${index++})`;
 names.add(nameKey(label));return label;
}
function recoveredColor(id){
 let hash=0;for(const character of id)hash=(Math.imul(hash,31)+character.charCodeAt(0))>>>0;
 return BOOKMARK_COLORS[hash%BOOKMARK_COLORS.length].hex;
}
export function resolveBookmarkCategories(input,reviews={}){
 const result=input===undefined?defaultBookmarkCategories():validateBookmarkCategories(input);
 const ids=new Set(result.map(value=>value.id)),names=new Set(result.map(value=>nameKey(value.label)));
 const used=new Set(Object.values(reviews&&typeof reviews==='object'&&!Array.isArray(reviews)?reviews:{}).flatMap(bookmarkColors));
 let recovered=1;
 for(const id of used){
  if(ids.has(id))continue;
  const old=legacy.get(id),preferred=old?.label||`복원 북마크 ${recovered++}`;
  result.push({id,label:uniqueRecoveryLabel(preferred,names),hex:old?.hex||recoveredColor(id)});ids.add(id);
 }
 return validateBookmarkCategories(result);
}

function newId(){
 if(typeof globalThis.crypto?.randomUUID==='function')return `bm_${globalThis.crypto.randomUUID()}`;
 if(typeof globalThis.crypto?.getRandomValues!=='function')throw new Error('이 환경에서는 안전한 북마크 ID를 만들 수 없습니다.');
 const bytes=globalThis.crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
 const hex=[...bytes].map(value=>value.toString(16).padStart(2,'0')).join('');
 return `bm_${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
const readEnvelope=raw=>{
 const value=JSON.parse(raw);
 if(!value||typeof value!=='object'||Array.isArray(value)||value.schemaVersion!==1)throw new Error('북마크 종류 저장 형식을 확인해 주세요.');
 return validateBookmarkCategories(value.categories);
};

export function createBookmarkCategoryStore(storage,reviews={}){
 let current=resolveBookmarkCategories(undefined,reviews),latestReviews=reviews,lastRaw=null,error='',writeBlocked=false;
 const readFailure=()=>{writeBlocked=true;error='기존 북마크 종류를 읽지 못해 덮어쓰기를 중단했습니다. 현재 화면의 이름과 종류를 백업해 주세요.';};
 try{lastRaw=storage?.getItem(BOOKMARK_CATEGORIES_KEY)??null;if(lastRaw!==null)current=resolveBookmarkCategories(readEnvelope(lastRaw),latestReviews);}catch{readFailure();}
 function sync(nextReviews=latestReviews){
  latestReviews=nextReviews;
  let changed=false;
  // A damaged registry remains untouched; memory remains usable for backup.
  if(!writeBlocked&&storage){
   try{
    const raw=storage.getItem(BOOKMARK_CATEGORIES_KEY)??null;
    if(raw!==lastRaw){
     const loaded=resolveBookmarkCategories(raw===null?undefined:readEnvelope(raw),latestReviews);
     current=loaded;lastRaw=raw;changed=true;error='';
    }
   }catch{readFailure();}
  }
  const recovered=resolveBookmarkCategories(current,latestReviews);
  if(JSON.stringify(recovered)!==JSON.stringify(current)){current=recovered;changed=true;}
  return changed;
 }
 function persist(candidate){
  current=validateBookmarkCategories(candidate);
  if(writeBlocked)return clone(current);
  try{
   if(!storage)throw new Error('storage unavailable');
   const raw=JSON.stringify({schemaVersion:1,categories:current});storage.setItem(BOOKMARK_CATEGORIES_KEY,raw);lastRaw=raw;error='';
  }catch{error='브라우저 저장에 실패했습니다. 변경한 북마크 종류는 현재 화면에 유지됩니다. 백업 파일을 내려받아 주세요.';}
  return clone(current);
 }
 return {
  get state(){return clone(current);},get error(){return error;},sync,
  rename(id,label){
   sync();if(!current.some(value=>value.id===id))throw new Error('이름을 바꿀 북마크 종류를 찾을 수 없습니다.');
   return persist(validateBookmarkCategories(current.map(value=>value.id===id?{...value,label}:value)));
  },
  add(label){
   sync();let id;do{id=newId();}while(current.some(value=>value.id===id));
   const used=new Set(current.map(value=>value.hex)),hex=BOOKMARK_COLORS.find(value=>!used.has(value.hex))?.hex||BOOKMARK_COLORS[current.length%BOOKMARK_COLORS.length].hex;
   const candidate=validateBookmarkCategories([...current,{id,label,hex}]);persist(candidate);return {...candidate.at(-1)};
  },
  merge(incoming,nextReviews=latestReviews){
   const validated=validateBookmarkCategories(incoming);sync(nextReviews);
   const merged=[...new Map([...current,...validated].map(value=>[value.id,value])).values()];
   return persist(resolveBookmarkCategories(merged,nextReviews));
  }
 };
}
