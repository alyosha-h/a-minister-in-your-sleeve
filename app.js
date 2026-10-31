import { SAVE_KEY, freshState, validateState, elapsedCare, care, conversation, canBeginDay, beginDay, checkpoint, completeChapter, chapterRecord, nextChapter, relationshipLabel, moodOf, LOW, rollDay, periodOf, weatherOf, dateKey, ritualDue, RITUALS, styleOf, momentDue, MEND_GOAL } from './game.js';
import { TREATS } from './catalog.js';
import { CHAPTERS, RIBBONS } from './catalog.js';
import { allConversations, chapterStories } from './more-content.js';
import { spriteFrameStyle, MOOD_FRAMES } from './sprites.js';
import { createPhaseTwoUI } from './phase-two-ui.js';
import { createCloudSync } from './cloud.js';

const $=id=>document.getElementById(id),backupKey=SAVE_KEY+'.backup';
let storageAvailable=true,recovered=false,state=load(),welcomeGap=0;
({state,gap:welcomeGap}=rollDay(state));
for(const c of CHAPTERS)chapterRecord(state,c.id).inProgress=false;
let busy=false,animation={mode:state.asleep?'sleep':'idle',start:performance.now()},storySession=null;
let animationTimer,toastTimer,audio,isTalking=false,phaseTwo,cloud=null;
const pages=['care','lantern','room','journal','settings'];
const moodStatus={stuffed:'pleasantly, regrettably full',peckish:'eyeing the kitchen',drowsy:'nodding over his papers',restless:'fidgeting with his sleeves',wistful:'a little wistful today',flourishing:'in excellent spirits'};
const ritualHints={morning:'breakfast time',afternoon:'it’s teatime',evening:'an evening chat',night:'past his bedtime'};
const ritualToasts={morning:'breakfast together · +3 bond',afternoon:'afternoon tea, properly observed · +3 bond',evening:'an evening’s conversation · +3 bond',night:'tucked in for the night · +3 bond'};
const periodLines={
  morning:['“good morning. i have already reviewed two memorials and one very small breakfast.”','“the light is kind at this hour. so, apparently, are you.”'],
  afternoon:['“it is nearly teatime. i say this as a matter of record.”','“the afternoon is for correspondence. or for not doing correspondence, together.”'],
  evening:['“the lanterns are being lit. i always liked this part of the day.”','“stay for a while? the evening is better with company.”'],
  night:['“you are up late. so am i. we needn’t tell anyone.”','“the moon is out. the paperwork, mercifully, is not.”']
};
const rainLines=['“listen. the rain is doing all the talking today. it’s rather restful.”','“a wet day. i have no intention of going anywhere. you?”','“the wisteria is drinking. i shall have tea in solidarity.”'];
const awayLines=gap=>gap>=7?['“you are back.” he sets down his brush very carefully. “i kept your cup out. every day. it was no trouble.”','“there you are. the courtyard has been very well administered in your absence. and very quiet.”']:gap>=3?['“ah. i had begun drafting a memorial on your whereabouts. it can be shelved.”','“welcome back. i have saved three stories and one dumpling. the dumpling did not survive.”']:['“you missed a rather good sunset. i watched it twice, for both of us.”','“yesterday was quiet. i’m glad today isn’t.”'];
const moodLines={
  stuffed:['“i have made an error of policy. it was delicious.”','“no more buns. possibly ever. ask me again at supper.”','“i shall simply lie here and govern from a horizontal position.”'],
  peckish:['“is it lunchtime? i ask on behalf of a colleague.”','“i could manage a dumpling. purely to keep my strength up for the paperwork.”','“the kitchen is very far away for someone my size. i mention it only in passing.”'],
  drowsy:['“i am reading. with my eyes closed. it is a technique.”','“the characters keep… wandering about the page.”','“if i were to rest my head on this scroll, it would be strictly temporary.”'],
  restless:['“something is out of place. possibly everything.”','“this cushion has developed opinions. so have the papers.”','“a cup of something warm might settle the administration.”'],
  wistful:['“it is quiet today. that is not a complaint. not exactly.”','“you are here. good. i was beginning to talk to the inkstone.”','“would you sit with me? there is no particular reason.”'],
  flourishing:['“i feel as though i could draft an entire edict before supper. i won’t. but i could.”','“everything is in order. i do not trust it, but i am enjoying it.”','“you have been taking very good care of me. i have noticed. officially.”']
};
let activePage='care',selectedChapter=(nextChapter(state)||CHAPTERS.at(-1)).id;

function load(){
  for(const key of [SAVE_KEY,backupKey])try{const raw=localStorage.getItem(key);if(raw){const s=elapsedCare(validateState(JSON.parse(raw)));recovered=key===backupKey;return s;}}catch(e){if(e instanceof DOMException&&e.name==='SecurityError')storageAvailable=false;}
  return freshState();
}
function save(){
  state.lastSeen=Date.now();
  try{const previous=localStorage.getItem(SAVE_KEY);if(previous)try{validateState(JSON.parse(previous));localStorage.setItem(backupKey,previous);}catch{}localStorage.setItem(SAVE_KEY,JSON.stringify(state));storageAvailable=true;}catch{storageAvailable=false;}
  $('saveStatus').innerHTML=storageAvailable?'<span class="save-dot"></span> progress saved on this device':'<span class="save-dot"></span> save a copy to keep your progress';
  cloud?.changed();
}
function adoptState(candidate){
  candidate=rollDay(elapsedCare(candidate)).state;for(const c of CHAPTERS)chapterRecord(candidate,c.id).inProgress=false;
  state=candidate;selectedChapter=(nextChapter(state)||CHAPTERS.at(-1)).id;save();render();
  animation={mode:state.asleep?'sleep':'idle',start:performance.now()};idleSpeech();return state;
}
const cloudMessages={local:'cloud save isn’t available in this view, so progress stays in this browser.',connecting:'checking your cloud save…',syncing:'syncing to your claude account…',synced:'safely kept in your claude account.',restored:'picked up from your claude account.',offline:'couldn’t reach the cloud just now. progress is safe here and will sync on your next action.',full:'the cloud save is full. progress is still kept in this browser.',waiting:'two different saves were found. reopen him to choose which to keep.'};
function cloudStatus(status){
  // Standalone (no cloud platform): the settings copy already explains browser saving.
  $('cloudStatus').hidden=status==='local';$('cloudStatus').textContent=cloudMessages[status]||'';$('cloudStatus').dataset.status=status;
  if(status==='restored')toast('welcome back. your courtyard followed you here.');
}
function askConflict(local,remote,savedAt){
  return new Promise(resolve=>{
    const d=$('syncDialog');let answered=null;
    const when=new Date(savedAt).toLocaleString([],{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).toLowerCase();
    $('syncIntro').textContent='another device saved your courtyard on '+when+'. which one should he wake up in?';
    $('syncUseCloud').textContent='the cloud save · day '+remote.day+', '+remote.bond+' bond';
    $('syncUseLocal').textContent='this device · day '+local.day+', '+local.bond+' bond';
    $('syncUseCloud').onclick=()=>{answered='cloud';d.close();};$('syncUseLocal').onclick=()=>{answered='local';d.close();};
    d.addEventListener('close',()=>resolve(answered),{once:true});closeTrays();if(!d.open)d.showModal();
  });
}
function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').classList.add('visible');toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3600);}
function ping(type='care'){
  if(!state.settings.sound)return;
  try{audio||=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume().catch(()=>{});
    const notes=type==='lantern'?[392,493.88,587.33]:type==='tea'?[587.33,783.99]:[523.25,659.25];
    notes.forEach((frequency,i)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.13;o.type='sine';o.frequency.value=frequency;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.025,t+.025);g.gain.exponentialRampToValueAtTime(.001,t+.65);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.7);});
  }catch{}
}
function closeTrays(){$('foodTray').hidden=true;$('teaTray').hidden=true;document.querySelectorAll('[aria-controls="foodTray"],[aria-controls="teaTray"]').forEach(b=>b.setAttribute('aria-expanded','false'));}
function pageFromLocation(){const p=location.hash.slice(1);return pages.includes(p)?p:'care';}
function selectPage(page,updateHistory=true){
  if(!pages.includes(page))page='care';closeTrays();activePage=page;document.body.dataset.page=page;
  for(const name of pages){$(name+'Panel').hidden=name!==page;$('tab-'+name).setAttribute('aria-selected',String(name===page));$('tab-'+name).tabIndex=name===page?0:-1;}
  if(updateHistory&&location.hash!=='#'+page)history.pushState({page},'','#'+page);
  phaseTwo?.onPage(page);if(page==='lantern')renderLantern();
}
function showSheet(id){closeTrays();$(id).showModal();history.pushState({page:activePage,sheet:id},'','#'+activePage);}
function replaceSheet(id,callback){
  if(history.state?.sheet===id){window.addEventListener('popstate',()=>callback(),{once:true});$(id).close();}
  else{$(id).close();callback();}
}
window.addEventListener('popstate',event=>{for(const d of document.querySelectorAll('dialog[open]'))if(d.id!==event.state?.sheet)d.close();selectPage(pageFromLocation(),false);});
for(const d of document.querySelectorAll('dialog'))d.addEventListener('close',()=>{if(history.state?.sheet===d.id)history.back();});
for(const tab of document.querySelectorAll('.app-tabs [role="tab"]')){
  tab.addEventListener('click',()=>selectPage(tab.dataset.page));
  tab.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=pages.indexOf(activePage),n=e.key==='Home'?0:e.key==='End'?pages.length-1:(i+(e.key==='ArrowRight'?1:-1)+pages.length)%pages.length;selectPage(pages[n]);$('tab-'+pages[n]).focus();});
}
function renderLantern(){
  const meta=CHAPTERS.find(c=>c.id===selectedChapter)||CHAPTERS[0],record=chapterRecord(state,meta.id),index=CHAPTERS.indexOf(meta),previous=index?CHAPTERS[index-1]:null;
  $('bondValue').textContent=state.bond+' / '+meta.bond;
  $('bondBar').style.width=Math.min(100,state.bond/meta.bond*100)+'%';
  $('bondDescription').textContent=record.complete?'a memory you can return to.':record.unlocked?'the lantern holds another evening together.':previous&&!chapterRecord(state,previous.id).complete?'first, share “'+previous.title+'”.':state.bond>=meta.bond&&state.day<meta.day?'some evenings can’t be hurried. this one waits for day '+meta.day+'.':meta.mend&&state.talisman.mend<meta.mend?'the jade is still mending: '+state.talisman.mend+' of '+meta.mend+'. good days help it along.':'small kindnesses bring this evening closer.';
  $('chapterTitle').textContent=meta.title;$('chapterNumber').textContent='a lanternlit encounter · '+meta.number;$('coverMark').textContent=meta.number;
  $('chapterCover').style.backgroundImage='linear-gradient(180deg,#33243c20,transparent 50%,#30203c22),url("./assets/'+meta.art+'")';
  $('chapterCover').setAttribute('aria-label',meta.title+' · illustrated portrait');
  $('chapterButton').disabled=!record.unlocked;
  $('chapterButton').querySelector('span').textContent=record.complete?'revisit this memory':record.unlocked?record.cursor>0?'continue your visit':'follow the lantern':'gathering light';
  $('chapterDescription').textContent=record.complete?meta.keepsake+' · kept in your journal':record.unlocked?'his world is waiting. come a little closer.':'a little care might bring his world a little closer.';
  $('chapterNote').textContent=record.complete?'replay anytime · your choices are safely kept':record.unlocked?'ready · he’ll meet your '+((!record.complete&&record.tone)||styleOf(state))+' company in kind':meta.bond+' bond · from day '+meta.day+(meta.mend?' · the jade whole':'')+(previous&&!chapterRecord(state,previous.id).complete?' · previous chapter first':'');
  $('chapterInvitation').classList.toggle('ready',record.unlocked);
  $('chapterTabs').innerHTML=CHAPTERS.map(c=>'<button data-chapter="'+c.id+'" aria-label="chapter '+c.number+': '+c.title+'" aria-pressed="'+(c.id===meta.id)+'"><span>'+c.number+'</span><small>'+ (chapterRecord(state,c.id).complete?'✓':chapterRecord(state,c.id).unlocked?'✦':'·')+'</small></button>').join('');
  document.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>{selectedChapter=b.dataset.chapter;renderLantern();});
}
function render(){
  const now=Date.now(),period=periodOf(now),rain=weatherOf(dateKey(now))==='rain',due=ritualDue(state,now);
  $('dayLabel').textContent='day '+String(state.day).padStart(2,'0')+' · '+period;
  $('sceneFrame').dataset.period=period;$('dayIcon').setAttribute('href',period==='night'||period==='evening'?'#i-moon':'#i-sun');$('sceneFrame').classList.toggle('rainy',rain);
  document.querySelectorAll('.care-action').forEach(b=>{const a=b.dataset.action,hint=due&&RITUALS[due]===a;b.classList.toggle('ritual',Boolean(hint));if(b.dataset.small===undefined)b.dataset.small=b.querySelector('small')?.textContent??'';const sm=b.querySelector('small');if(sm)sm.textContent=hint?ritualHints[due]:b.dataset.small;});
  for(const [k,v]of Object.entries(state.needs)){const n=Math.round(v);$(k+'Value').textContent=n;$(k+'Bar').style.width=n+'%';$(k+'Meter').setAttribute('aria-valuenow',n);$(k+'Meter').closest('.need').classList.toggle('low',v<LOW);}
  const mood=moodOf(state);$('sceneFrame').dataset.mood=mood;
  const upcoming=nextChapter(state),ready=CHAPTERS.some(c=>{const r=chapterRecord(state,c.id);return r.unlocked&&!r.complete;});
  $('momentButton').hidden=!momentDue(state);
  document.querySelectorAll('.treat-button').forEach(b=>{const n=state.pantry[b.dataset.food||b.dataset.tea]||0;b.hidden=!n;b.querySelector('small').textContent='×'+n;});
  $('bondSummary').textContent=upcoming?state.bond+' / '+upcoming.bond:state.bond+' bond';$('lanternNavDot').hidden=!ready;
  $('tab-lantern').setAttribute('aria-label',ready?'lantern, encounter ready':'lantern');
  $('sceneFrame').classList.toggle('lantern-ready',ready);$('sceneFrame').classList.toggle('is-asleep',state.asleep);
  $('sceneLantern').setAttribute('aria-label',ready?'follow the lantern to his study':'visit the lantern and your memories');
  $('sceneLantern').title=ready?'an evening is waiting':'your time together';
  $('keepsake').hidden=!state.chapter.complete;$('newDayButton').hidden=!canBeginDay(state);$('sceneFrame').classList.toggle('day-ready',canBeginDay(state));
  $('sceneStatus').textContent=state.asleep?'dreaming, probably of dumplings':moodStatus[mood]||relationshipLabel(state);
  document.body.classList.toggle('reduced-motion',state.settings.reducedMotion);
  $('soundButton').setAttribute('aria-pressed',String(state.settings.sound));$('soundButton').setAttribute('aria-label','turn sound '+(state.settings.sound?'off':'on'));
  $('soundSetting').checked=state.settings.sound;$('motionSetting').checked=state.settings.reducedMotion;
  document.querySelectorAll('.care-action').forEach(b=>b.disabled=busy);$('characterButton').disabled=busy;$('paperClutter').disabled=busy;
  renderLantern();phaseTwo?.render();
}
function speak(text,activity){$('speechText').textContent=text;if(activity)$('activityLabel').textContent=activity;}
function idleSpeech(){
  if(document.querySelector('dialog[open]')||busy)return;
  if(state.asleep){speak('“mm… the memorial can wait.”','an important minister, taking a very important nap.');return;}
  const mood=moodOf(state);
  if(moodLines[mood]&&Math.random()<(mood==='flourishing'?.4:.7)){speak(moodLines[mood][Math.floor(Math.random()*moodLines[mood].length)],moodStatus[mood]+'.');return;}
  if(Math.random()<.3){const now=Date.now(),pool=weatherOf(dateKey(now))==='rain'?rainLines:periodLines[periodOf(now)];speak(pool[Math.floor(Math.random()*pool.length)],'a familiar little presence, glad you’re here.');return;}
  let lines;
  if(state.chapters.jade.complete)lines=['“the ministry had me all morning. this is much better.”','“small by choice. it is a very different thing.”','“i wrote another line in the record today. it was about you. it usually is.”'];
  else if(state.chapters.game.complete)lines=['“a rematch? i have saved you a very good seat.”','“you may sit closer. i find it improves my concentration.”','“the white stone is still yours. so is the afternoon.”'];
  else if(state.chapters.ribbon.complete)lines=['“the ribbon? perfectly serviceable. i see no reason to change it.”','“a quiet moment? i have one here, just for you.”'];
  else if(state.chapters.rain.complete)lines=['“if it rains, we have a perfectly good umbrella.”','“a damp sleeve is a small price for such good company.”'];
  else if(state.chapter.complete)lines=['“i have left your cup out. just in case.”','“i was not waiting. i simply had nowhere better to be.”','“shall we leave the paperwork until tomorrow?”'];
  else lines=['“a respectable residence. a little short on staff.”','“the hat is an emblem of office. please be gentle.”','“i oversee three departments. i can manage one bun.”','“you may sit closer. if you wish.”'];
  if(state.memories.name)lines.push('“'+state.memories.name+'? nothing urgent. i was just glad you were here.”');
  if(state.memories.lastTea)lines.push('“shall we share another cup? i remember the last one rather fondly.”');
  speak(lines[Math.floor(Math.random()*lines.length)],'a familiar little presence, glad you’re here.');
}
function setAnimation(mode,duration=1550){
  clearTimeout(animationTimer);busy=true;animation={mode,start:performance.now()};
  $('characterArea').className='character-area is-'+({feed:'feeding',tea:'drinking',pet:'petting',talk:'talking',rest:'resting',tidy:'tidying',pickup:'held'}[mode]||mode);render();
  animationTimer=setTimeout(()=>{busy=false;animation={mode:state.asleep?'sleep':'idle',start:performance.now()};$('characterArea').className='character-area';render();},duration);
}
const frames={feed:[2,3],tea:[4,5],pet:[6,7],talk:[8,9],rest:[10,11],sleep:[11,15],tidy:[12],pickup:[7,9]};
let previousFrame='';
// his resting pose follows his mood; the plain idle keeps its blink
function idleFrame(mood,time,still){
  if(mood==='drowsy')return !still&&time%9000>7400?10:MOOD_FRAMES.drowsy;
  if(MOOD_FRAMES[mood])return MOOD_FRAMES[mood];
  if(mood==='restless')return 13;
  if(mood==='wistful')return 7;
  if(mood==='flourishing'&&!still&&time%11000>9200)return 14;
  return !still&&time%6400<170?1:0;
}
function animate(time){
  const noMotion=state.settings.reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame;if(animation.mode==='idle')frame=idleFrame(moodOf(state),time,noMotion);else{const list=frames[animation.mode]||[0];frame=list[noMotion?0:Math.floor(Math.max(0,time-animation.start)/(animation.mode==='sleep'?2400:650))%list.length];}
  const key=state.outfit+':'+frame;if(key!==previousFrame){Object.assign($('characterSprite').style,spriteFrameStyle(frame,state.outfit));previousFrame=key;}
  requestAnimationFrame(animate);
}
function commitResult(result){
  const before=new Set(CHAPTERS.filter(c=>chapterRecord(state,c.id).unlocked).map(c=>c.id));before.mend=state.talisman.mend;state=result.state;save();render();
  if(result.reward){$('bondFloat').textContent='+'+result.reward+' bond';$('bondFloat').classList.remove('show');void $('bondFloat').offsetWidth;$('bondFloat').classList.add('show');}
  const unlocked=CHAPTERS.find(c=>chapterRecord(state,c.id).unlocked&&!before.has(c.id));
  if(unlocked){selectedChapter=unlocked.id;renderLantern();ping('lantern');toast('the lantern is glowing · '+unlocked.title);}
  else if(result.flourished)toast('he’s flourishing · a bonus for keeping him well, +5 bond');
  else if(result.requestCompleted)toast('a small request, fulfilled · +15 bond and +12 copper');
  else if(result.ritual)toast(ritualToasts[result.ritual]);
  else if(result.attuned)toast('just what he needed · +3 bond');
  else if(state.talisman.mend>before.mend)toast(state.talisman.mend>=MEND_GOAL?'the jade is whole. the lantern is waiting.':'the jade mends a little · '+state.talisman.mend+' / '+MEND_GOAL);
  return result;
}
function doCare(action,item=null,allowSheet=false){
  if(busy||(!allowSheet&&document.querySelector('dialog[open]')))return null;
  closeTrays();const r=care(state,action,Date.now(),item);commitResult(r);setAnimation(action,action==='rest'?1900:1550);ping(action);
  if(action==='feed')speak(item==='dumplings'?'“an excellent policy. more dumplings, fewer meetings.”':'“this is an appropriate size. for a banquet.”','a small bite. a very satisfied minister.');
  if(action==='tea')speak(item==='lotus'?'“lotus tea. you remembered what the garden smells like.”':item==='rice'?'“a very comforting cup. perhaps the letters can wait.”':'“leave the paperwork. just for one cup.”','both hands around a warm little cup.');
  if(action==='pet'){speak(state.chapters.game.complete?'“you may continue. i have cleared my schedule.”':'“i am allowing this as a diplomatic courtesy.”','he leans into your hand. purely diplomatic.');$('hearts').innerHTML='<span>♥</span><span>♥</span><span>♥</span>';$('petHint').hidden=true;setTimeout(()=>$('hearts').replaceChildren(),2300);}
  if(action==='rest')speak('“five minutes. wake me before the next dynasty.”','an important minister, taking a very important nap.');
  if(action==='tidy')speak('“a remarkably efficient administration. i was keeping that poem, though.”','the papers settle. he looks quietly pleased.');
  if(action==='pickup')speak('“a better view. and rather agreeable company.”','a little trust, in the palm of your hand.');
  if(r.treat)speak(TREATS.find(t=>t.id===r.treat).line,'a small luxury, gratefully received.');
  else if(r.stuffed)speak(['“i… could not possibly. and yet.”','“this is how dynasties fall. one more bun.”','“i will require a short lie-down. for the good of the state.”'][Math.floor(Math.random()*3)],'one bun past diplomacy.');
  else if(r.attuned&&Math.random()<.5)speak(['“how did you know?”','“exactly that. i was about to ask. eventually.”','“you read me better than my own secretaries.”'][Math.floor(Math.random()*3)]);
  return r;
}
function toggleTray(action){const tray=$(action==='feed'?'foodTray':'teaTray'),open=tray.hidden;closeTrays();tray.hidden=!open;document.querySelector('[data-action="'+action+'"]').setAttribute('aria-expanded',String(open));}
function chooseConversation(){
  const stage=CHAPTERS.filter(c=>chapterRecord(state,c.id).complete).length,eligible=allConversations.map((c,i)=>({c,i})).filter(x=>(x.c.minStage||0)<=stage);
  return eligible.find(x=>!state.memories.recentChats.includes(x.i))||eligible[(state.day-1)%eligible.length];
}
function openTalk(){
  closeTrays();isTalking=false;const selected=chooseConversation(),dialogue=selected.c;
  $('talkDialog').querySelector('h2').textContent='what’s on his mind?';$('talkIntro').textContent=dialogue.intro;$('talkChoices').replaceChildren();
  $('talkReward').textContent=state.talked?'the pleasure of your company is always welcome.':'your first conversation today · +15 bond';
  dialogue.choices.forEach(choice=>{const b=document.createElement('button');b.textContent=choice.label;b.onclick=()=>{
    if(isTalking)return;isTalking=true;const r=conversation(state,choice.preference,Date.now(),selected.i);commitResult(r);
    $('talkIntro').textContent=choice.response;$('talkDialog').querySelector('h2').textContent='a little closer.';$('talkChoices').replaceChildren();
    const done=document.createElement('button');done.textContent='stay a moment, then return';done.onclick=()=>$('talkDialog').close();$('talkChoices').append(done);
    $('talkReward').textContent=r.reward?'+'+r.reward+' bond · +'+r.copper+' copper':'some things don’t need a reward.';animation={mode:'talk',start:performance.now()};ping();done.focus();
  };$('talkChoices').append(b);});showSheet('talkDialog');
}
$('talkDialog').addEventListener('close',()=>{if(isTalking)speak({teasing:'“you are very impertinent. do sit closer.”',quiet:'he says nothing, but he doesn’t move away either.',gentle:'“thank you for staying a little while.”'}[styleOf(state)],'some company, and a little less distance.');animation={mode:state.asleep?'sleep':'idle',start:performance.now()};});
function openStory(id=null){
  const meta=CHAPTERS.find(c=>c.id===(id||selectedChapter))||CHAPTERS[0],record=chapterRecord(state,meta.id);
  if(!record.unlocked){toast(meta.bond+' bond, day '+meta.day+', and the previous chapter will bring this evening closer.');return;}
  if(busy)return;selectedChapter=meta.id;closeTrays();const book=chapterStories[meta.id];
  // a first visit keeps the tone it began with; replays follow how you are with him now
  storySession={id:meta.id,cursor:record.complete?0:Math.min(record.cursor,book.length-1),choices:{...record.choices},replay:record.complete,tone:(!record.complete&&record.tone)||styleOf(state)};
  if(!storySession.replay){state=checkpoint(state,storySession.cursor,storySession.choices,Date.now(),meta.id,storySession.tone);save();}
  $('storyDialog').classList.remove('art-only');$('viewArtButton').textContent='view art';$('viewArtButton').setAttribute('aria-pressed','false');
  $('storyDialog').setAttribute('aria-label',meta.title);$('storyTitle').innerHTML='<svg><use href="#i-lantern"/></svg> '+meta.number+' · '+meta.title;
  $('storyArt').style.backgroundImage='url("./assets/'+meta.art+'")';$('storyArt').setAttribute('aria-label',meta.title+' · lin yan at his full adult height');
  renderStory();showSheet('storyDialog');ping('lantern');
}
function storyText(text){
  const ribbon=storySession.id==='ribbon'?RIBBONS[storySession.choices.color??0]:RIBBONS.find(r=>r.id===state.memories.ribbon)||RIBBONS[0];
  return text.replaceAll('{{ribbon}}',ribbon.name).replaceAll('{{name}}',state.memories.name||'my guest');
}
function renderStory(){
  const book=chapterStories[storySession.id],node=book[storySession.cursor];$('storyDialog').classList.toggle('has-choices',Boolean(node.choice));$('storySpeaker').textContent=node.speaker;
  $('storyText').textContent=storyText(node.branch?node.variants[storySession.choices[node.branch]??0]||node.variants[0]:node.tones?.[storySession.tone]||node.text);
  $('storyArt').classList.toggle('before-reveal',storySession.cursor<2);$('storyChoices').replaceChildren();$('storyNext').disabled=Boolean(node.choice);
  $('storyNext').innerHTML=node.ending?'keep this moment <svg><use href="#i-arrow"/></svg>':'continue <svg><use href="#i-arrow"/></svg>';
  $('storyProgress').textContent=(storySession.replay?'a memory · ':'')+String(storySession.cursor+1).padStart(2,'0')+' / '+book.length;
  if(node.choice)node.options.forEach((label,i)=>{const b=document.createElement('button');b.textContent=label;b.onclick=()=>{storySession.choices[node.choice]=i;advanceStory();};$('storyChoices').append(b);});
  $('storyDialog').querySelector('.story-reading').scrollTop=0;
}
function advanceStory(){
  if(!storySession)return;const node=chapterStories[storySession.id][storySession.cursor];
  if(node.ending){
    const meta=CHAPTERS.find(c=>c.id===storySession.id),replay=storySession.replay;
    if(!replay){commitResult({state:completeChapter(state,Date.now(),meta.id)});selectedChapter=(nextChapter(state)||meta).id;}
    $('storyDialog').close();render();speak(meta.id==='jade'?'“good evening. i saved you a seat.”':meta.id==='ribbon'?'“perfectly serviceable. and i like the way you tied it.”':meta.id==='rain'?'“if it rains, you know where to find me.”':meta.id==='game'?'“a rematch? whenever you like.”':'“your cup is still here. i thought we might keep it that way.”','another small memory, kept close.');
    toast('a memory to keep · '+meta.keepsake);ping('lantern');return;
  }
  storySession.cursor++;if(!storySession.replay){state=checkpoint(state,storySession.cursor,storySession.choices,Date.now(),storySession.id,storySession.tone);save();}renderStory();
}
$('storyDialog').addEventListener('close',()=>{if(storySession&&!storySession.replay)chapterRecord(state,storySession.id).inProgress=false;state.lastSeen=Date.now();save();storySession=null;render();cloud?.resume();});
$('storyDialog').addEventListener('keydown',e=>{if(!storySession)return;const node=chapterStories[storySession.id][storySession.cursor];if((e.key==='ArrowRight'||(e.key===' '&&e.target===$('storyDialog')))&&!node.choice){e.preventDefault();advanceStory();}});

document.querySelectorAll('.care-action').forEach(b=>b.onclick=()=>{const a=b.dataset.action;if(a==='feed'||a==='tea')toggleTray(a);else if(a==='talk')openTalk();else if(a==='more')phaseTwo.openActivity();else doCare(a);});
document.querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>doCare('feed',b.dataset.food));document.querySelectorAll('[data-tea]').forEach(b=>b.onclick=()=>doCare('tea',b.dataset.tea));document.querySelectorAll('.tray-close').forEach(b=>b.onclick=closeTrays);
$('characterButton').onclick=()=>doCare('pet');$('chapterButton').onclick=()=>openStory();
$('sceneLantern').onclick=()=>{const ready=CHAPTERS.find(c=>{const r=chapterRecord(state,c.id);return r.unlocked&&!r.complete;});if(ready)openStory(ready.id);else selectPage('lantern');};
$('storyNext').onclick=advanceStory;$('exitStoryButton').onclick=()=>$('storyDialog').close();
$('viewArtButton').onclick=()=>{const v=$('storyDialog').classList.toggle('art-only');$('viewArtButton').textContent=v?'read on':'view art';$('viewArtButton').setAttribute('aria-pressed',String(v));};
function checkDay(){
  const r=rollDay(state);if(r.state===state)return;state=r.state;save();render();if(r.gap>=2)welcome(r.gap);
  else if(r.rolled){speak({gentle:'“good morning. did you sleep? properly, i mean.”',teasing:'“a new day. i have taken the liberty of starting without you.”',quiet:'he looks up from his brush and makes room for you without a word.'}[styleOf(state)],'another small day, together.');ping();}
}
function welcome(gap){
  const lines=awayLines(gap);speak(lines[Math.floor(Math.random()*lines.length)],'glad you’re here. no explanations needed.');
  toast(gap>=7?'he kept the courtyard while you were away':'welcome back');
}
$('newDayButton').onclick=()=>{state=beginDay(state);save();animation={mode:'idle',start:performance.now()};render();selectPage('care');speak(state.memories.name?'“good morning, '+state.memories.name+'. i was just thinking about breakfast.”':'“a new day. shall we see what it brings?”','another small day, together.');ping();};
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
$('momentButton').onclick=()=>phaseTwo.openMoment();$('homeButton').onclick=()=>selectPage('care');$('bondShortcut').onclick=()=>selectPage('lantern');$('helpButton').onclick=()=>showSheet('helpDialog');
$('soundButton').onclick=()=>{state.settings.sound=!state.settings.sound;save();render();ping();};$('soundSetting').onchange=e=>{state.settings.sound=e.target.checked;save();render();ping();};$('motionSetting').onchange=e=>{state.settings.reducedMotion=e.target.checked;save();render();};
$('exportButton').onclick=()=>{save();const blob=new Blob([JSON.stringify({app:'a-minister-in-your-sleeve',savedAt:new Date().toISOString(),state},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='minister-in-your-sleeve-day-'+state.day+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);$('settingsMessage').textContent='your copy is ready. keep it somewhere safe.';};
$('importButton').onclick=()=>$('importFile').click();
$('importFile').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>150000)throw new Error('that file is too large for a courtyard save.');const data=JSON.parse(await file.text());if(data.app!=='a-minister-in-your-sleeve')throw new Error('please choose an exported courtyard save.');const candidate=rollDay(elapsedCare(validateState(data.state))).state;if(!confirm('restore day '+candidate.day+' with '+candidate.bond+' bond? this replaces progress on this device.'))return;for(const c of CHAPTERS)chapterRecord(candidate,c.id).inProgress=false;state=candidate;selectedChapter=(nextChapter(state)||CHAPTERS.at(-1)).id;save();render();animation={mode:state.asleep?'sleep':'idle',start:performance.now()};$('settingsMessage').textContent='your courtyard is restored. he’s glad you’re back.';idleSpeech();}catch(error){$('settingsMessage').textContent=error instanceof SyntaxError?'that file could not be read. try an exported courtyard save.':error.message;}e.target.value='';};

document.addEventListener('visibilitychange',()=>{if(document.hidden){save();cloud?.flush();}else if(!$('storyDialog').open){state=elapsedCare(state);save();render();checkDay();cloud?.pull();}});window.addEventListener('pagehide',()=>{save();cloud?.flush();});
setInterval(()=>{if(!document.hidden&&!document.querySelector('dialog[open]')&&!busy){state=elapsedCare(state);save();render();checkDay();}},60000);setInterval(idleSpeech,24000);
phaseTwo=createPhaseTwoUI({state:()=>state,commit:commitResult,care:doCare,careInSheet:a=>doCare(a,null,true),speak,toast,ping,selectPage,page:()=>activePage,showSheet,replaceSheet,openTalk,openStory,openTray:toggleTray});
const initial=pageFromLocation();history.replaceState({page:initial},'','#'+initial);selectPage(initial,false);save();render();requestAnimationFrame(animate);
if(welcomeGap>=2)welcome(welcomeGap);else if(state.asleep||state.chapter.complete||moodLines[moodOf(state)])idleSpeech();
cloud=createCloudSync({getState:()=>state,adopt:adoptState,canAdopt:()=>!$('storyDialog').open,onStatus:cloudStatus,askConflict});cloud.init().catch(()=>cloudStatus('local'));
if(recovered)toast('your last good save has been restored.');if(!storageAvailable)toast('browser saving is unavailable. keep a copy from settings.');
