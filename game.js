import { CHAPTERS, REQUESTS, ITEMS, RIBBONS } from './catalog.js';

export const SAVE_KEY = 'sleeve-and-lantern.v1';
export const CATEGORIES = ['nourishment','affection','comfort','rest'];
const clamp = (v,lo=0,hi=100)=>Math.min(hi,Math.max(lo,v));
const blankChapter = ()=>({unlocked:false,complete:false,cursor:0,choices:{},inProgress:false});
export const LOW = 35, FLOURISH = 70, ATTUNE_CAP = 4;
// which need each kind of care answers; reading the lowest one right earns a small bonus
const REMEDIES = {feed:['fullness'],tea:['comfort','energy'],pet:['mood'],pickup:['mood'],talk:['mood'],game:['mood'],tidy:['comfort'],rest:['energy']};
const STUFFED_MS = 30*60000;
const requestForDay = day=>({id:REQUESTS[(day-1)%REQUESTS.length].id,done:false,searched:[]});

export function freshState(now=Date.now()) {
  return {schema:2,day:1,bond:0,copper:20,needs:{fullness:54,energy:72,comfort:63,mood:67},asleep:false,
    claimed:[],talked:false,played:false,tidied:false,attuned:0,flourished:false,stuffedAt:null,preference:'gentle',chapter:blankChapter(),
    chapters:{rain:blankChapter(),ribbon:blankChapter(),game:blankChapter()},request:requestForDay(1),
    owned:['official'],outfit:'official',placed:[],memories:{name:'',lastTea:null,ribbon:null,recentActions:[],recentChats:[],tidyCount:0,holdCount:0,requestsDone:0,recipes:[]},
    settings:{sound:false,reducedMotion:false},lastSeen:now};
}

export function chapterRecord(s,id='tea') {return id==='tea'?s.chapter:s.chapters[id];}
export function refreshUnlocks(s) {
  CHAPTERS.forEach((c,i)=>{const r=chapterRecord(s,c.id);if(s.bond>=c.bond&&(!i||chapterRecord(s,CHAPTERS[i-1].id).complete))r.unlocked=true;});
  return s;
}
export function nextChapter(s) {return CHAPTERS.find(c=>!chapterRecord(s,c.id).complete)||null;}
export function requestDefinition(s) {return REQUESTS.find(r=>r.id===s.request.id)||REQUESTS[0];}
export function wantOf(s) {
  const [need,value]=Object.entries(s.needs).sort((a,b)=>a[1]-b[1])[0];return value<50?need:null;
}
// everything he's genuinely short of: any need under LOW, or failing that his lowest under 50
function wantsOf(s) {
  const low=Object.keys(s.needs).filter(k=>s.needs[k]<LOW);return low.length?low:[wantOf(s)].filter(Boolean);
}
export function moodOf(s,now=Date.now()) {
  if(s.asleep)return 'asleep';
  if(s.stuffedAt&&now-s.stuffedAt<STUFFED_MS)return 'stuffed';
  const want=wantOf(s);
  if(want&&s.needs[want]<LOW)return {fullness:'peckish',energy:'drowsy',comfort:'restless',mood:'wistful'}[want];
  return Object.values(s.needs).every(v=>v>=FLOURISH)?'flourishing':'content';
}
export function tooTiredToPlay(s) {return s.asleep||s.needs.energy<25;}
export function relationshipLabel(s) {
  const n=CHAPTERS.filter(c=>chapterRecord(s,c.id).complete).length;
  return ['an unexpected guest','familiar company','trusted company','private confidants','something unspoken'][n];
}
function cleanChapter(input,meta) {
  const r=blankChapter();if(!input||typeof input!=='object')return r;
  r.unlocked=input.unlocked===true;r.complete=input.complete===true&&r.unlocked;
  r.cursor=Number.isInteger(input.cursor)?clamp(input.cursor,0,99):0;
  r.inProgress=input.inProgress===true&&r.unlocked&&!r.complete;
  for(const [key,count]of Object.entries(meta.choices)){const v=input.choices?.[key];if(Number.isInteger(v)&&v>=0&&v<count)r.choices[key]=v;}
  return r;
}
export function validateState(input) {
  if(!input||![1,2].includes(input.schema)||!Number.isFinite(input.bond)||input.bond<0||!Number.isInteger(input.day)||input.day<1||!input.needs||!input.chapter||!Array.isArray(input.claimed)||!Number.isFinite(input.lastSeen))throw new Error('This is not a valid courtyard save.');
  const s=freshState();s.day=clamp(input.day,1,100000);s.bond=clamp(input.bond,0,1000000);
  for(const key of Object.keys(s.needs)){if(!Number.isFinite(input.needs[key]))throw new Error('The save has an incomplete care record.');s.needs[key]=clamp(input.needs[key]);}
  s.attuned=Number.isInteger(input.attuned)?clamp(input.attuned,0,ATTUNE_CAP):0;s.flourished=input.flourished===true;s.stuffedAt=Number.isFinite(input.stuffedAt)?input.stuffedAt:null;
  s.asleep=input.asleep===true;s.claimed=[...new Set(input.claimed.filter(c=>CATEGORIES.includes(c)))];s.talked=input.talked===true;
  s.preference=['gentle','teasing','quiet'].includes(input.preference)?input.preference:'gentle';s.chapter=cleanChapter(input.chapter,CHAPTERS[0]);
  if(input.schema===1&&input.chapter.complete===true&&s.bond>=20){s.chapter.unlocked=true;s.chapter.complete=true;}
  if(input.schema===2){
    for(const c of CHAPTERS.slice(1))s.chapters[c.id]=cleanChapter(input.chapters?.[c.id],c);
    s.copper=Number.isFinite(input.copper)?Math.floor(clamp(input.copper,0,1000000)):20;s.played=input.played===true;s.tidied=input.tidied===true;
    s.owned=[...new Set(['official',...(Array.isArray(input.owned)?input.owned:[]).filter(id=>ITEMS.some(i=>i.id===id))])];
    if(s.owned.includes(input.outfit)&&ITEMS.some(i=>i.id===input.outfit&&i.kind==='outfit'))s.outfit=input.outfit;
    s.placed=[...new Set((Array.isArray(input.placed)?input.placed:[]).filter(id=>s.owned.includes(id)&&ITEMS.some(i=>i.id===id&&i.kind==='furnishing')))];
    const expected=requestForDay(s.day);s.request=expected;
    if(input.request?.id===expected.id){s.request.done=input.request.done===true;s.request.searched=[...new Set((Array.isArray(input.request.searched)?input.request.searched:[]).filter(i=>[0,1,2].includes(i)))];}
    const m=input.memories||{};s.memories.name=typeof m.name==='string'?m.name.replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,24):'';
    s.memories.lastTea=['jasmine','lotus','rice'].includes(m.lastTea)?m.lastTea:null;s.memories.ribbon=RIBBONS.some(r=>r.id===m.ribbon)?m.ribbon:null;
    s.memories.recentActions=(Array.isArray(m.recentActions)?m.recentActions:[]).filter(a=>['feed','tea','pet','rest','tidy','pickup','game'].includes(a)).slice(-8);
    s.memories.recentChats=(Array.isArray(m.recentChats)?m.recentChats:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<100).slice(-12);
    for(const k of ['tidyCount','holdCount','requestsDone'])s.memories[k]=Number.isFinite(m[k])?Math.floor(clamp(m[k],0,1000000)):0;
    s.memories.recipes=[...new Set((Array.isArray(m.recipes)?m.recipes:[]).filter(k=>['jasmine','lotus','rice'].includes(k)))];
  }else s.request=requestForDay(s.day);
  s.settings.sound=input.settings?.sound===true;s.settings.reducedMotion=input.settings?.reducedMotion===true;s.lastSeen=Math.max(0,input.lastSeen);
  if(s.chapters.ribbon.complete&&!s.memories.ribbon)s.memories.ribbon=RIBBONS[s.chapters.ribbon.choices.color??0].id;
  return refreshUnlocks(s);
}
export function elapsedCare(input,now=Date.now()) {
  const s=structuredClone(input),hours=clamp((now-s.lastSeen)/3600000,0,8);
  if(!CHAPTERS.some(c=>chapterRecord(s,c.id).inProgress)){
    s.needs.fullness=clamp(s.needs.fullness-hours*4,15);s.needs.comfort=clamp(s.needs.comfort-hours*2,15);s.needs.mood=clamp(s.needs.mood-hours*1.5,15);s.needs.energy=clamp(s.needs.energy+hours*(s.asleep?10:-2.5),15);
  }s.lastSeen=now;return s;
}
function categoryReward(s,category){
  if(!category||s.claimed.includes(category))return {reward:0,copper:0};
  s.claimed.push(category);s.bond+=5;s.copper+=3;return {reward:5,copper:3};
}
// call before needs change: did this answer what he was actually missing?
function attune(s,action){
  if(!wantsOf(s).some(w=>REMEDIES[action].includes(w))||s.attuned>=ATTUNE_CAP)return {reward:0,copper:0,attuned:false};
  s.attuned++;s.bond+=3;s.copper+=1;return {reward:3,copper:1,attuned:true};
}
// call after needs change: the first time each day he's doing well all round
function flourish(s){
  if(s.flourished||s.asleep||!Object.values(s.needs).every(v=>v>=FLOURISH))return {reward:0,copper:0,flourished:false};
  s.flourished=true;s.bond+=5;s.copper+=5;return {reward:5,copper:5,flourished:true};
}
function settle(s){for(const k of Object.keys(s.needs))s.needs[k]=clamp(s.needs[k]);}
function finishRequest(s,action){
  if(s.request.done||!requestDefinition(s).actions.includes(action))return {reward:0,copper:0,requestCompleted:false};
  s.request.done=true;s.memories.requestsDone++;s.bond+=15;s.copper+=12;return {reward:15,copper:12,requestCompleted:true};
}
function result(s,base,request,tuned={reward:0,copper:0}){
  const bloom=flourish(s);refreshUnlocks(s);
  return {state:s,reward:base.reward+request.reward+tuned.reward+bloom.reward,copper:base.copper+request.copper+tuned.copper+bloom.copper,requestCompleted:request.requestCompleted,attuned:Boolean(tuned.attuned),flourished:bloom.flourished,stuffed:Boolean(tuned.stuffed)};
}
export function care(input,action,now=Date.now(),item=null){
  const s=elapsedCare(input,now);if(!['feed','tea','pet','rest','tidy','pickup'].includes(action))throw new Error('Unknown care action.');
  const tuned=attune(s,action);s.asleep=action==='rest';let category;
  // a bun on a full stomach: funny, sleepy, and no bonus
  if(action==='feed'&&s.needs.fullness>=90){s.stuffedAt=now;tuned.stuffed=true;s.needs.energy-=10;}
  else if(action==='feed')s.stuffedAt=null;
  if(action==='feed'){s.needs.fullness+=32;s.needs.comfort+=4;category='nourishment';}
  if(action==='tea'){s.needs.fullness+=5;s.needs.comfort+=25;s.needs.energy+=6;category='nourishment';if(['jasmine','lotus','rice'].includes(item)){s.memories.lastTea=item;if(!s.memories.recipes.includes(item))s.memories.recipes.push(item);}}
  if(action==='pet'){s.needs.mood+=23;s.needs.comfort+=8;category='affection';}
  if(action==='pickup'){s.needs.mood+=18;s.needs.comfort+=7;category='affection';s.memories.holdCount++;}
  if(action==='tidy'){s.needs.comfort+=25;s.needs.energy-=6;s.tidied=true;s.memories.tidyCount++;category='comfort';}
  if(action==='rest'){s.needs.energy+=40;s.needs.comfort+=12;s.needs.fullness-=10;s.stuffedAt=null;category='rest';}
  settle(s);s.memories.recentActions=[...s.memories.recentActions,action].slice(-8);
  return result(s,categoryReward(s,category),finishRequest(s,action),tuned);
}
export function conversation(input,preference,now=Date.now(),chatIndex=null){
  const s=elapsedCare(input,now),tuned=attune(s,'talk');s.asleep=false;const reward=s.talked?0:15,copper=s.talked?0:4;
  s.bond+=reward;s.copper+=copper;s.talked=true;if(['gentle','teasing','quiet'].includes(preference))s.preference=preference;s.needs.mood+=10;s.needs.energy-=4;settle(s);
  if(Number.isInteger(chatIndex))s.memories.recentChats=[...s.memories.recentChats.filter(i=>i!==chatIndex),chatIndex].slice(-12);
  return result(s,{reward,copper},finishRequest(s,'talk'),tuned);
}
export function finishGame(input,kind,now=Date.now(),tea=null){
  if(!['memorial','tea'].includes(kind))throw new Error('Unknown game.');
  if(tooTiredToPlay(elapsedCare(input,now)))throw new Error('he is too sleepy to play just now.');
  const s=elapsedCare(input,now),tuned=attune(s,'game');s.asleep=false;s.needs.mood+=15;s.needs.energy-=12;s.needs.fullness-=6;settle(s);const base=categoryReward(s,'affection');
  if(!s.played){s.played=true;s.bond+=10;s.copper+=8;base.reward+=10;base.copper+=8;}
  if(kind==='tea'&&['jasmine','lotus','rice'].includes(tea)){s.memories.lastTea=tea;if(!s.memories.recipes.includes(tea))s.memories.recipes.push(tea);}
  s.memories.recentActions=[...s.memories.recentActions,'game'].slice(-8);return result(s,base,finishRequest(s,'game'),tuned);
}
export function searchPage(input,location,now=Date.now()){
  const s=elapsedCare(input,now);
  if(s.request.id!=='page'||s.request.done||![0,1,2].includes(location))return {state:s,reward:0,copper:0,requestCompleted:false,found:s.request.done};
  if(!s.request.searched.includes(location))s.request.searched.push(location);const found=location===(s.day+1)%3;
  if(!found)return {state:s,reward:0,copper:0,requestCompleted:false,found:false};
  s.tidied=true;s.memories.tidyCount++;s.needs.comfort=clamp(s.needs.comfort+20);return {...result(s,categoryReward(s,'comfort'),finishRequest(s,'find')),found:true};
}
export function canBeginDay(s){return s.claimed.length>=3&&(s.talked||s.request.done);}
export function beginDay(input,now=Date.now()){
  if(!canBeginDay(input))throw new Error('Share three kinds of care and a conversation or request first.');
  const s=elapsedCare(input,now);s.day++;s.claimed=[];s.talked=false;s.played=false;s.asleep=false;s.tidied=false;s.attuned=0;s.flourished=false;s.request=requestForDay(s.day);return s;
}
export function checkpoint(input,cursor,choices,now=Date.now(),id='tea'){
  const meta=CHAPTERS.find(c=>c.id===id),r=chapterRecord(input,id);if(!meta||!r?.unlocked)throw new Error('The lantern is still gathering light.');
  if(r.complete)throw new Error('This memory is complete; replay choices stay separate.');
  const s=structuredClone(input),record=chapterRecord(s,id);record.cursor=cursor;record.choices={...choices};record.inProgress=true;s.lastSeen=now;return s;
}
export function completeChapter(input,now=Date.now(),id='tea'){
  const r=chapterRecord(input,id);if(!r?.unlocked)throw new Error('The lantern is still gathering light.');
  if(r.complete)return structuredClone(input);
  const s=structuredClone(input),record=chapterRecord(s,id);record.complete=true;record.inProgress=false;s.lastSeen=now;
  if(id==='ribbon')s.memories.ribbon=RIBBONS[record.choices.color??0].id;return refreshUnlocks(s);
}
export function purchase(input,id){
  const item=ITEMS.find(i=>i.id===id);if(!item)throw new Error('That item is not in the household shop.');if(input.owned.includes(id))throw new Error('This is already yours.');if(input.copper<item.price)throw new Error('a little more copper, and it’s yours.');
  const s=structuredClone(input);s.copper-=item.price;s.owned.push(id);return s;
}
export function equipOutfit(input,id){
  if(!input.owned.includes(id)||!ITEMS.some(i=>i.id===id&&i.kind==='outfit'))throw new Error('Choose an outfit you own.');const s=structuredClone(input);s.outfit=id;return s;
}
export function placeFurnishing(input,id){
  if(!input.owned.includes(id)||!ITEMS.some(i=>i.id===id&&i.kind==='furnishing'))throw new Error('Choose a furnishing you own.');const s=structuredClone(input);s.placed=s.placed.includes(id)?s.placed.filter(i=>i!==id):[...s.placed,id];return s;
}
export function rememberPlayer(input,name,preference){
  const s=structuredClone(input);s.memories.name=String(name||'').replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,24);if(['gentle','teasing','quiet'].includes(preference))s.preference=preference;return s;
}
