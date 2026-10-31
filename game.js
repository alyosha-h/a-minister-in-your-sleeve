import { CHAPTERS, REQUESTS, ITEMS, RIBBONS, TREATS } from './catalog.js';
import { MOMENTS } from './moments.js';
import { CHECKIN, ABOUT_YOU } from './more-content.js';
import { TEA_WISHES, teaWishKey, judgeTea, searchSpots, pageSpot } from './minigames.js';

export const SAVE_KEY = 'sleeve-and-lantern.v1';
export const CATEGORIES = ['nourishment','affection','comfort','rest'];
const clamp = (v,lo=0,hi=100)=>Math.min(hi,Math.max(lo,v));
const blankChapter = ()=>({unlocked:false,complete:false,cursor:0,choices:{},inProgress:false});
export const LOW = 35, FLOURISH = 70, ATTUNE_CAP = 4;
export const STYLES = ['gentle','teasing','quiet'];
// the talisman mends a little on good days: a fulfilled request, a flourishing day, a perfect game, a shared moment
export const MEND_GOAL = 40, MEND_DAILY = 4;
export const PACES = ['kiss','hand','slow'], NICKNAMES = ['little lantern','trouble','dearest'];
// how everyday care colours the way he knows you; conversations count for more
const CARE_STYLE = {feed:'gentle',pet:'gentle',pickup:'gentle',tea:'quiet',rest:'quiet',tidy:'teasing',game:'teasing'};
const TALK_WEIGHT = 3;
// which need each kind of care answers; reading the lowest one right earns a small bonus
const REMEDIES = {feed:['fullness'],tea:['comfort','energy'],pet:['mood'],pickup:['mood'],talk:['mood'],game:['mood'],tidy:['comfort'],rest:['energy']};
const STUFFED_MS = 30*60000;
// real days turn over at 4am local, so a late night still counts as the same day
const ROLLOVER_HOURS = 4;
export const RITUALS = {morning:'feed',afternoon:'tea',evening:'talk',night:'rest'};
export function dateKey(now=Date.now()) {
  const d=new Date(now-ROLLOVER_HOURS*3600000);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
export function periodOf(now=Date.now()) {
  const h=new Date(now).getHours();return h>=5&&h<11?'morning':h>=11&&h<17?'afternoon':h>=17&&h<22?'evening':'night';
}
// the same weather for everyone on a given date: roughly one rainy day in five
export function weatherOf(key) {
  let h=7;for(const c of key)h=(h*31+c.charCodeAt(0))>>>0;return h%5===0?'rain':'clear';
}
const daysBetween=(a,b)=>Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);
const KEY = /^\d{4}-\d{2}-\d{2}$/;
const requestForDay = day=>({id:REQUESTS[(day-1)%REQUESTS.length].id,done:false,searched:[],spot:null});

export function freshState(now=Date.now()) {
  return {schema:2,day:1,bond:0,copper:20,needs:{fullness:54,energy:72,comfort:63,mood:67},asleep:false,
    claimed:[],talked:false,played:false,tidied:false,attuned:0,flourished:false,stuffedAt:null,dayKey:dateKey(now),manualKey:null,rituals:{key:dateKey(now),done:[]},affinity:{gentle:0,teasing:0,quiet:0},nudged:[],moments:{seen:[],key:null},preference:'gentle',chapter:blankChapter(),
    chapters:{rain:blankChapter(),ribbon:blankChapter(),game:blankChapter(),lamp:blankChapter(),lotus:blankChapter(),beside:blankChapter(),jade:blankChapter()},talisman:{mend:0,key:null,today:0},pantry:{},orchidKey:null,request:requestForDay(1),
    owned:['official'],outfit:'official',placed:[],memories:{name:'',lastTea:null,ribbon:null,recentActions:[],recentChats:[],tidyCount:0,holdCount:0,requestsDone:0,recipes:[],memorialPerfects:0,teaPerfects:0,teaNotes:[],gamesPlayed:0,pace:null,nickname:null,you:{day:null,about:{},aboutKey:null},datesDone:0,dateKey:null},
    settings:{sound:false,reducedMotion:false,theme:'system'},lastSeen:now};
}

export function chapterRecord(s,id='tea') {return id==='tea'?s.chapter:s.chapters[id];}
export function refreshUnlocks(s) {
  // chapters ask for both bond and days together, so the arc can't be finished in a sitting
  CHAPTERS.forEach((c,i)=>{const r=chapterRecord(s,c.id);if(s.bond>=c.bond&&s.day>=c.day&&(!c.mend||s.talisman.mend>=c.mend)&&(!i||chapterRecord(s,CHAPTERS[i-1].id).complete))r.unlocked=true;});
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
// the way you've mostly spent time with him; ties go to your latest conversation
export function styleOf(s) {
  const best=Math.max(...STYLES.map(k=>s.affinity[k]));return best>0&&s.affinity[s.preference]!==best?STYLES.find(k=>s.affinity[k]===best):s.preference;
}
function nudge(s,style,n=1){if(STYLES.includes(style))s.affinity[style]+=n;}
// care counts once per kind per day, so endless headpats don't drown out what you say
function careNudge(s,action){if(s.nudged.includes(action))return;s.nudged.push(action);nudge(s,CARE_STYLE[action]);}
// one small scene per real day, the earliest he's ready to share
export function momentDue(s,now=Date.now()) {
  if(s.moments.key===dateKey(now))return null;return MOMENTS.find(m=>!s.moments.seen.includes(m.id)&&s.bond>=m.bond)||null;
}
export function shareMoment(input,id,optionIndex,now=Date.now()){
  const m=MOMENTS.find(x=>x.id===id),option=m?.options[optionIndex];
  if(!m||!option||momentDue(input,now)?.id!==id)throw new Error('That moment isn’t ready yet.');
  const s=elapsedCare(input,now);s.moments.seen.push(id);s.moments.key=dateKey(now);nudge(s,option.style,2);mend(s,1);
  return result(s,{reward:6,copper:4},{reward:0,copper:0,requestCompleted:false});
}
// once a day he asks how yours went; on a later visit (a new day, or a new part of this one) he follows up
export function checkinDue(s,now=Date.now()){return s.day>=2&&s.memories.you.day?.key!==dateKey(now);}
export function aboutDue(s,now=Date.now()){
  if(s.day<3||checkinDue(s,now)||s.memories.you.aboutKey===dateKey(now))return null;return ABOUT_YOU.find(q=>!(q.id in s.memories.you.about))||null;
}
export function answerCheckin(input,answerId,now=Date.now()){
  const a=CHECKIN.answers.find(x=>x.id===answerId);if(!a||!checkinDue(input,now))throw new Error('he has already asked today.');
  const r=conversation(input,a.style,now,null);r.state.memories.you.day={answer:a.id,key:dateKey(now),period:periodOf(now),followed:false};return r;
}
export function answerAbout(input,questionId,answerId,now=Date.now()){
  const q=ABOUT_YOU.find(x=>x.id===questionId),a=q?.answers.find(x=>x.id===answerId);if(!a||aboutDue(input,now)?.id!==questionId)throw new Error('that question can wait.');
  const r=conversation(input,a.style,now,null);r.state.memories.you.about[q.id]=a.id;r.state.memories.you.aboutKey=dateKey(now);return r;
}
export function pendingFollowUp(s,now=Date.now()){
  const d=s.memories.you.day;return d&&!d.followed&&(d.key!==dateKey(now)||d.period!==periodOf(now))?CHECKIN.answers.find(a=>a.id===d.answer):null;
}
// a long day earns you a cup he poured himself; the rest are simply remembered
export function followUp(input,accepted=false,now=Date.now()){
  const f=pendingFollowUp(input,now);if(!f)throw new Error('nothing to follow up.');
  const s=elapsedCare(input,now);s.memories.you.day.followed=true;
  if(!accepted)return {state:s,reward:0,copper:0};
  s.needs.mood+=8;settle(s);s.bond+=3;s.copper+=1;return result(s,{reward:3,copper:1},{reward:0,copper:0,requestCompleted:false});
}
// evenings at his true height, once the jade is whole: the first each real day is rewarded
export function finishDate(input,style,now=Date.now()){
  if(!chapterRecord(input,'jade').complete)throw new Error('the jade is not yet whole.');
  const s=elapsedCare(input,now),first=s.memories.dateKey!==dateKey(now);s.memories.datesDone++;s.memories.dateKey=dateKey(now);
  s.needs.mood+=12;s.needs.comfort+=8;settle(s);nudge(s,style);
  if(!first)return result(s,{reward:0,copper:0},{reward:0,copper:0,requestCompleted:false});
  s.bond+=5;s.copper+=3;return result(s,{reward:5,copper:3},{reward:0,copper:0,requestCompleted:false});
}
export function tooTiredToPlay(s) {return s.asleep||s.needs.energy<25;}
export function relationshipLabel(s) {
  const n=CHAPTERS.filter(c=>chapterRecord(s,c.id).complete).length;
  return ['an unexpected guest','familiar company','trusted company','private confidants','something unspoken','mutual longing','something spoken','lovers','a shared home'][n];
}
function cleanChapter(input,meta) {
  const r=blankChapter();if(!input||typeof input!=='object')return r;
  r.unlocked=input.unlocked===true;r.complete=input.complete===true&&r.unlocked;
  r.cursor=Number.isInteger(input.cursor)?clamp(input.cursor,0,99):0;
  r.inProgress=input.inProgress===true&&r.unlocked&&!r.complete;
  if(STYLES.includes(input.tone))r.tone=input.tone;
  for(const [key,count]of Object.entries(meta.choices)){const v=input.choices?.[key];if(Number.isInteger(v)&&v>=0&&v<count)r.choices[key]=v;}
  return r;
}
export function validateState(input) {
  if(!input||![1,2].includes(input.schema)||!Number.isFinite(input.bond)||input.bond<0||!Number.isInteger(input.day)||input.day<1||!input.needs||!input.chapter||!Array.isArray(input.claimed)||!Number.isFinite(input.lastSeen))throw new Error('This is not a valid courtyard save.');
  const s=freshState();s.day=clamp(input.day,1,100000);s.bond=clamp(input.bond,0,1000000);
  for(const key of Object.keys(s.needs)){if(!Number.isFinite(input.needs[key]))throw new Error('The save has an incomplete care record.');s.needs[key]=clamp(input.needs[key]);}
  s.attuned=Number.isInteger(input.attuned)?clamp(input.attuned,0,ATTUNE_CAP):0;s.flourished=input.flourished===true;s.stuffedAt=Number.isFinite(input.stuffedAt)?input.stuffedAt:null;
  // saves from before real days start counting from today
  s.dayKey=KEY.test(input.dayKey)?input.dayKey:dateKey();s.manualKey=KEY.test(input.manualKey)?input.manualKey:null;
  if(KEY.test(input.rituals?.key))s.rituals={key:input.rituals.key,done:(Array.isArray(input.rituals.done)?input.rituals.done:[]).filter(p=>p in RITUALS)};
  s.asleep=input.asleep===true;s.claimed=[...new Set(input.claimed.filter(c=>CATEGORIES.includes(c)))];s.talked=input.talked===true;
  s.preference=STYLES.includes(input.preference)?input.preference:'gentle';
  // older saves only knew your latest conversation; let it seed the running tally
  s.moments={seen:[...new Set((Array.isArray(input.moments?.seen)?input.moments.seen:[]).filter(id=>MOMENTS.some(m=>m.id===id)))],key:KEY.test(input.moments?.key)?input.moments.key:null};
  s.nudged=(Array.isArray(input.nudged)?input.nudged:[]).filter(a=>a in CARE_STYLE);
  s.affinity=Object.fromEntries(STYLES.map(k=>[k,Number.isFinite(input.affinity?.[k])?Math.floor(clamp(input.affinity[k],0,1000000)):k===s.preference?TALK_WEIGHT:0]));s.chapter=cleanChapter(input.chapter,CHAPTERS[0]);
  if(input.schema===1&&input.chapter.complete===true&&s.bond>=20){s.chapter.unlocked=true;s.chapter.complete=true;}
  if(input.schema===2){
    for(const c of CHAPTERS.slice(1))s.chapters[c.id]=cleanChapter(input.chapters?.[c.id],c);
    s.copper=Number.isFinite(input.copper)?Math.floor(clamp(input.copper,0,1000000)):20;s.played=input.played===true;s.tidied=input.tidied===true;
    s.owned=[...new Set(['official',...(Array.isArray(input.owned)?input.owned:[]).filter(id=>ITEMS.some(i=>i.id===id))])];
    if(s.owned.includes(input.outfit)&&ITEMS.some(i=>i.id===input.outfit&&i.kind==='outfit'))s.outfit=input.outfit;
    s.placed=[...new Set((Array.isArray(input.placed)?input.placed:[]).filter(id=>s.owned.includes(id)&&ITEMS.some(i=>i.id===id&&i.kind==='furnishing')))];
    const expected=requestForDay(s.day);s.request=expected;
    if(input.request?.id===expected.id){s.request.done=input.request.done===true;s.request.searched=[...new Set((Array.isArray(input.request.searched)?input.request.searched:[]).filter(i=>typeof i==='string'))];if(typeof input.request.spot==='string')s.request.spot=input.request.spot;}
    const m=input.memories||{};s.memories.name=typeof m.name==='string'?m.name.replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,24):'';
    s.memories.lastTea=['jasmine','lotus','rice'].includes(m.lastTea)?m.lastTea:null;s.memories.ribbon=RIBBONS.some(r=>r.id===m.ribbon)?m.ribbon:null;
    s.memories.recentActions=(Array.isArray(m.recentActions)?m.recentActions:[]).filter(a=>['feed','tea','pet','rest','tidy','pickup','game'].includes(a)).slice(-8);
    s.memories.recentChats=(Array.isArray(m.recentChats)?m.recentChats:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<100).slice(-12);
    for(const k of ['tidyCount','holdCount','requestsDone','memorialPerfects','teaPerfects','gamesPlayed'])s.memories[k]=Number.isFinite(m[k])?Math.floor(clamp(m[k],0,1000000)):0;
    // what you've told him about yourself, and whether he has followed up on it yet
    const you=m.you||{},d=you.day;
    s.memories.you={day:d&&CHECKIN.answers.some(a=>a.id===d.answer)&&KEY.test(d.key)?{answer:d.answer,key:d.key,period:typeof d.period==='string'?d.period:'afternoon',followed:d.followed===true}:null,
      about:Object.fromEntries(ABOUT_YOU.filter(q=>q.answers.some(a=>a.id===you.about?.[q.id])).map(q=>[q.id,you.about[q.id]])),aboutKey:KEY.test(you.aboutKey)?you.aboutKey:null};
    s.memories.datesDone=Number.isFinite(m.datesDone)?Math.floor(clamp(m.datesDone,0,1000000)):0;s.memories.dateKey=KEY.test(m.dateKey)?m.dateKey:null;
    s.memories.pace=PACES.includes(m.pace)?m.pace:null;s.memories.nickname=NICKNAMES.includes(m.nickname)?m.nickname:null;
    s.memories.teaNotes=[...new Set((Array.isArray(m.teaNotes)?m.teaNotes:[]).filter(k=>k in TEA_WISHES))];
    s.memories.recipes=[...new Set((Array.isArray(m.recipes)?m.recipes:[]).filter(k=>['jasmine','lotus','rice'].includes(k)))];
  }else s.request=requestForDay(s.day);
  const tal=input.talisman||{};s.talisman={mend:Number.isFinite(tal.mend)?Math.floor(clamp(tal.mend,0,MEND_GOAL)):0,key:KEY.test(tal.key)?tal.key:null,today:Number.isFinite(tal.today)?clamp(tal.today,0,MEND_DAILY):0};
  s.pantry=Object.fromEntries(TREATS.map(t=>[t.id,Number.isFinite(input.pantry?.[t.id])?Math.floor(clamp(input.pantry[t.id],0,999)):0]).filter(([,n])=>n>0));
  s.orchidKey=KEY.test(input.orchidKey)?input.orchidKey:null;
  s.settings.sound=input.settings?.sound===true;s.settings.reducedMotion=input.settings?.reducedMotion===true;s.settings.theme=['light','dark'].includes(input.settings?.theme)?input.settings.theme:'system';s.lastSeen=Math.max(0,input.lastSeen);
  if(s.chapters.ribbon.complete&&!s.memories.ribbon)s.memories.ribbon=RIBBONS[s.chapters.ribbon.choices.color??0].id;
  if(s.chapters.lotus.complete&&!s.memories.pace)s.memories.pace=PACES[s.chapters.lotus.choices.pace??1];
  if(s.chapters.beside.complete&&!s.memories.nickname)s.memories.nickname=NICKNAMES[s.chapters.beside.choices.name??2];
  return refreshUnlocks(s);
}
export function elapsedCare(input,now=Date.now()) {
  const s=structuredClone(input),hours=clamp((now-s.lastSeen)/3600000,0,8);
  if(!CHAPTERS.some(c=>chapterRecord(s,c.id).inProgress)){
    s.needs.fullness=clamp(s.needs.fullness-hours*4,15);s.needs.comfort=clamp(s.needs.comfort-hours*2*(orchidHappy(s,now)?.6:1),15);s.needs.mood=clamp(s.needs.mood-hours*1.5*(s.placed.includes('chime')?.5:1),15);s.needs.energy=clamp(s.needs.energy+hours*(s.asleep?10:-2.5),15);
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
  s.flourished=true;s.bond+=5;s.copper+=5;mend(s,1);return {reward:5,copper:5,flourished:true};
}
// a few points a day at most, so the jade keeps pace with the story rather than racing it
function mend(s,n){
  const key=dateKey(s.lastSeen);if(s.talisman.key!==key)s.talisman={...s.talisman,key,today:0};
  const add=Math.max(0,Math.min(n,MEND_DAILY-s.talisman.today,MEND_GOAL-s.talisman.mend));s.talisman.mend+=add;s.talisman.today+=add;return add;
}
export function orchidThirsty(s,now=Date.now()){return s.placed.includes('orchid')&&(!s.orchidKey||daysBetween(s.orchidKey,dateKey(now))>=2);}
function orchidHappy(s,now){return s.placed.includes('orchid')&&!orchidThirsty(s,now);}
export function waterOrchid(input,now=Date.now()){
  if(!orchidThirsty(input,now))throw new Error('the orchid is perfectly content.');
  const s=elapsedCare(input,now);s.orchidKey=dateKey(now);s.needs.comfort+=8;s.needs.mood+=5;settle(s);s.copper+=1;nudge(s,'quiet');
  return result(s,{reward:0,copper:1},{reward:0,copper:0,requestCompleted:false});
}
export function buyTreat(input,id){
  const t=TREATS.find(x=>x.id===id);if(!t)throw new Error('the kitchen doesn’t make that.');if(input.copper<t.price)throw new Error('a little more copper, and it’s yours.');
  const s=structuredClone(input);s.copper-=t.price;s.pantry[id]=(s.pantry[id]||0)+1;return s;
}
// one small bonus per time of day, for the thing that suits it
function ritual(s,action,now){
  const key=dateKey(now),period=periodOf(now);if(s.rituals.key!==key)s.rituals={key,done:[]};
  if(RITUALS[period]!==action||s.rituals.done.includes(period))return {reward:0,copper:0,ritual:null};
  s.rituals.done.push(period);s.bond+=3;s.copper+=2;return {reward:3,copper:2,ritual:period};
}
export function ritualDue(s,now=Date.now()) {
  const period=periodOf(now);return s.rituals.key===dateKey(now)&&s.rituals.done.includes(period)?null:period;
}
function settle(s){for(const k of Object.keys(s.needs))s.needs[k]=clamp(s.needs[k]);}
function finishRequest(s,action){
  if(s.request.done||!requestDefinition(s).actions.includes(action))return {reward:0,copper:0,requestCompleted:false};
  const sealed=s.placed.includes('seal')?6:0;s.request.done=true;s.memories.requestsDone++;s.bond+=15;s.copper+=12+sealed;mend(s,2);return {reward:15,copper:12+sealed,requestCompleted:true};
}
function result(s,base,request,tuned={reward:0,copper:0},rite={reward:0,copper:0,ritual:null}){
  const bloom=flourish(s);refreshUnlocks(s);
  return {state:s,reward:base.reward+request.reward+tuned.reward+bloom.reward+rite.reward,copper:base.copper+request.copper+tuned.copper+bloom.copper+rite.copper,requestCompleted:request.requestCompleted,attuned:Boolean(tuned.attuned),flourished:bloom.flourished,stuffed:Boolean(tuned.stuffed),treat:tuned.treat||null,ritual:rite.ritual,mend:s.talisman.mend};
}
export function care(input,action,now=Date.now(),item=null){
  const s=elapsedCare(input,now);if(!['feed','tea','pet','rest','tidy','pickup'].includes(action))throw new Error('Unknown care action.');
  const tuned=attune(s,action);s.asleep=action==='rest';let category;
  // a treat from the pantry, if there's one to hand
  const treat=TREATS.find(t=>t.id===item&&t.tray===action&&s.pantry[t.id]>0);
  if(treat){s.pantry[treat.id]--;if(!s.pantry[treat.id])delete s.pantry[treat.id];tuned.treat=treat.id;tuned.reward+=2;s.bond+=2;}
  // a bun on a full stomach: funny, sleepy, and no bonus
  if(action==='feed'&&s.needs.fullness>=90){s.stuffedAt=now;tuned.stuffed=true;s.needs.energy-=10;}
  else if(action==='feed')s.stuffedAt=null;
  if(action==='feed'){s.needs.fullness+=32;s.needs.comfort+=4;category='nourishment';}
  if(action==='tea'){s.needs.fullness+=5;s.needs.comfort+=s.placed.includes('cup')?32:25;s.needs.energy+=6;category='nourishment';if(['jasmine','lotus','rice'].includes(item)){s.memories.lastTea=item;if(!s.memories.recipes.includes(item))s.memories.recipes.push(item);}}
  if(action==='pet'){s.needs.mood+=23;s.needs.comfort+=8;category='affection';}
  if(action==='pickup'){s.needs.mood+=18;s.needs.comfort+=7;category='affection';s.memories.holdCount++;}
  if(action==='tidy'){s.needs.comfort+=25;s.needs.energy-=6;s.tidied=true;s.memories.tidyCount++;category='comfort';}
  if(action==='rest'){s.needs.energy+=s.placed.includes('cushion')?55:40;s.needs.comfort+=12;s.needs.fullness-=10;s.stuffedAt=null;category='rest';}
  if(treat)for(const [k,v] of Object.entries(treat.boost))s.needs[k]+=v;
  settle(s);careNudge(s,action);s.memories.recentActions=[...s.memories.recentActions,action].slice(-8);
  return result(s,categoryReward(s,category),finishRequest(s,action),tuned,ritual(s,action,now));
}
export function conversation(input,preference,now=Date.now(),chatIndex=null){
  const s=elapsedCare(input,now),tuned=attune(s,'talk');s.asleep=false;const reward=s.talked?0:15,copper=s.talked?0:4;
  s.bond+=reward;s.copper+=copper;s.talked=true;if(STYLES.includes(preference)){s.preference=preference;nudge(s,preference,TALK_WEIGHT);}s.needs.mood+=s.placed.includes('scroll')?16:10;s.needs.energy-=4;settle(s);
  if(Number.isInteger(chatIndex))s.memories.recentChats=[...s.memories.recentChats.filter(i=>i!==chatIndex),chatIndex].slice(-12);
  return result(s,{reward,copper},finishRequest(s,'talk'),tuned,ritual(s,'talk',now));
}
export function currentTeaWish(s,now=Date.now()){return teaWishKey(moodOf(elapsedCare(s,now),now),periodOf(now));}
// tea is {leaf,steep}; he judges it against what he wanted right now. memorials report perfect from the table.
export function finishGame(input,kind,now=Date.now(),tea=null,perfect=false){
  if(!['memorial','tea'].includes(kind))throw new Error('Unknown game.');
  if(tooTiredToPlay(elapsedCare(input,now)))throw new Error('he is too sleepy to play just now.');
  const wish=kind==='tea'?currentTeaWish(input,now):null;
  const s=elapsedCare(input,now),tuned=attune(s,'game');s.asleep=false;s.needs.mood+=15;s.needs.energy-=12;s.needs.fullness-=6;settle(s);careNudge(s,'game');const base=categoryReward(s,'affection');
  if(!s.played){s.played=true;s.bond+=10;s.copper+=8;base.reward+=10;base.copper+=8;}
  let verdict=perfect===true?'perfect':'done';
  if(kind==='tea'){
    const leaf=['jasmine','lotus','rice'].includes(tea?.leaf)?tea.leaf:null;verdict=leaf?judgeTea(wish,leaf,tea.steep):'other';
    if(leaf){s.memories.lastTea=leaf;if(!s.memories.recipes.includes(leaf))s.memories.recipes.push(leaf);}
    if(verdict==='perfect'){s.memories.teaPerfects++;if(!s.memories.teaNotes.includes(wish))s.memories.teaNotes.push(wish);}
  }else if(verdict==='perfect')s.memories.memorialPerfects++;
  // getting it exactly right is worth a little extra
  if(verdict==='perfect'){s.copper+=2;base.copper+=2;mend(s,1);}
  s.memories.gamesPlayed++;s.memories.recentActions=[...s.memories.recentActions,'game'].slice(-8);
  return {...result(s,base,finishRequest(s,'game'),tuned),verdict,wish};
}
export function searchPage(input,spot,now=Date.now()){
  const s=elapsedCare(input,now),spots=searchSpots(s.placed).map(x=>x.id);
  if(s.request.id!=='page'||s.request.done||!spots.includes(spot))return {state:s,reward:0,copper:0,requestCompleted:false,found:s.request.done};
  // the hiding place is settled on the first look, so moving furniture can't move the page
  s.request.spot??=pageSpot(s.placed,s.day);if(!spots.includes(s.request.spot))s.request.spot=spots[0];
  if(!s.request.searched.includes(spot))s.request.searched.push(spot);
  if(spot!==s.request.spot)return {state:s,reward:0,copper:0,requestCompleted:false,found:false};
  s.tidied=true;s.memories.tidyCount++;s.needs.comfort=clamp(s.needs.comfort+20);return {...result(s,categoryReward(s,'comfort'),finishRequest(s,'find')),found:true};
}
// the manual skip ahead is a catch-up: once per real day, after a full day's care
export function canBeginDay(s,now=Date.now()){return s.claimed.length>=3&&(s.talked||s.request.done)&&s.manualKey!==dateKey(now);}
function nextDay(s){
  s.day++;s.claimed=[];s.talked=false;s.played=false;s.asleep=false;s.tidied=false;s.attuned=0;s.flourished=false;s.nudged=[];s.request=requestForDay(s.day);return s;
}
export function beginDay(input,now=Date.now()){
  if(!canBeginDay(input,now))throw new Error('Share three kinds of care and a conversation or request first, once per day.');
  const s=nextDay(elapsedCare(input,now));s.manualKey=dateKey(now);return s;
}
// a new real day turns the page on its own; gap is how many calendar days passed
export function rollDay(input,now=Date.now()){
  const key=dateKey(now);if(input.dayKey===key)return {state:input,rolled:false,gap:0};
  const s=structuredClone(input),gap=Math.max(1,daysBetween(s.dayKey,key));s.dayKey=key;
  // an untouched day stays open, so 'day n' counts days spent together, not days away
  if(!s.claimed.length&&!s.talked&&!s.request.done){s.attuned=0;s.flourished=false;return {state:s,rolled:false,gap};}
  return {state:nextDay(s),rolled:true,gap};
}
export function checkpoint(input,cursor,choices,now=Date.now(),id='tea',tone=null){
  const meta=CHAPTERS.find(c=>c.id===id),r=chapterRecord(input,id);if(!meta||!r?.unlocked)throw new Error('The lantern is still gathering light.');
  if(r.complete)throw new Error('This memory is complete; replay choices stay separate.');
  const s=structuredClone(input),record=chapterRecord(s,id);record.cursor=cursor;record.choices={...choices};record.inProgress=true;if(STYLES.includes(tone))record.tone=tone;s.lastSeen=now;return s;
}
export function completeChapter(input,now=Date.now(),id='tea'){
  const r=chapterRecord(input,id);if(!r?.unlocked)throw new Error('The lantern is still gathering light.');
  if(r.complete)return structuredClone(input);
  const s=structuredClone(input),record=chapterRecord(s,id);record.complete=true;record.inProgress=false;s.lastSeen=now;
  if(id==='ribbon')s.memories.ribbon=RIBBONS[record.choices.color??0].id;
  // the pavilion and the seal leave something he keeps referring back to
  if(id==='lotus')s.memories.pace=PACES[record.choices.pace??1];
  if(id==='beside')s.memories.nickname=NICKNAMES[record.choices.name??2];
  return refreshUnlocks(s);
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
