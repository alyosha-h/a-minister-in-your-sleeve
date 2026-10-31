import { CHAPTERS, ITEMS, RIBBONS, MEMORIALS, TEA_CLUES, LETTERS } from './catalog.js';
import { chapterRecord, requestDefinition, relationshipLabel, finishGame, tooTiredToPlay, searchPage, purchase, equipOutfit, placeFurnishing, rememberPlayer } from './game.js';
import { spriteFrameStyle } from './sprites.js';

const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=name=>'<svg aria-hidden="true"><use href="#i-'+name+'"/></svg>';
const teaName=id=>({jasmine:'jasmine tea',lotus:'lotus tea',rice:'roasted rice tea'}[id]||'a warm cup');

export function createPhaseTwoUI(ctx){
  const outfits=ITEMS.filter(i=>i.kind==='outfit');
  let roomView='outfits',journalView='today',outfitIndex=0,shownOutfit=null;
  let activity={view:'menu'},draftPreference=null;
  // Browsing previews is free, but when what he's wearing changes (shop, import,
  // cloud restore), bring the wardrobe back to the outfit he actually has on.
  function followOutfit(){const id=ctx.state().outfit;if(id!==shownOutfit){shownOutfit=id;outfitIndex=Math.max(0,outfits.findIndex(i=>i.id===id));}}
  followOutfit();

  function renderRoom(){
    followOutfit();const s=ctx.state();$('copperValue').textContent=s.copper;
    document.querySelectorAll('[data-room-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.roomView===roomView)));
    if(roomView==='outfits'){
      const item=outfits[outfitIndex],owned=s.owned.includes(item.id),wearing=s.outfit===item.id;
      $('roomContent').innerHTML='<div class="outfit-view"><div class="outfit-stage"><span class="outfit-flower">✦</span><div class="outfit-character"><span class="character-sprite" id="outfitPreview"></span></div><span class="outfit-stage-note">'+(wearing?'his current look':'a change of pace')+'</span></div><div class="outfit-pager"><button id="outfitPrevious" aria-label="previous outfit">'+icon('arrow')+'</button><div>'+outfits.map((o,i)=>'<button data-outfit-index="'+i+'" aria-label="preview '+esc(o.name)+'" aria-pressed="'+(i===outfitIndex)+'" class="outfit-dot dot-'+o.id+'"></button>').join('')+'</div><button id="outfitNext" aria-label="next outfit">'+icon('arrow')+'</button></div><div class="outfit-description"><h2>'+esc(item.name)+'</h2><p>'+esc(item.description)+'</p></div><button id="outfitPurchase" class="primary-button" '+(wearing?'disabled':'')+'>'+(wearing?'wearing this':owned?'wear this outfit':'buy & wear · '+item.price+' copper')+'</button><p class="shop-note">all care poses included · food and tea are always free</p></div>';
      Object.assign($('outfitPreview').style,spriteFrameStyle(0,item.id));
      $('outfitPrevious').onclick=()=>{outfitIndex=(outfitIndex+outfits.length-1)%outfits.length;renderRoom();};
      $('outfitNext').onclick=()=>{outfitIndex=(outfitIndex+1)%outfits.length;renderRoom();};
      document.querySelectorAll('[data-outfit-index]').forEach(b=>b.onclick=()=>{outfitIndex=Number(b.dataset.outfitIndex);renderRoom();});
      $('outfitPurchase').onclick=()=>{try{let next=ctx.state();if(!owned)next=purchase(next,item.id);next=equipOutfit(next,item.id);ctx.commit({state:next});ctx.speak(item.id==='official'?'“a minister must occasionally look the part.”':item.id==='leisure'?'“i have declared the remainder of the day unofficial.”':'“shall we go somewhere? i have packed exceptionally lightly.”','a small change, and a pleased little minister.');ctx.toast(wearing?'already looking splendid.':item.name+' · now wearing');}catch(e){ctx.toast(e.message);}};
      let startX=0;
      $('roomContent').querySelector('.outfit-stage').onpointerdown=e=>{startX=e.clientX;};
      $('roomContent').querySelector('.outfit-stage').onpointerup=e=>{const d=e.clientX-startX;if(Math.abs(d)>45){outfitIndex=(outfitIndex+(d<0?1:-1)+outfits.length)%outfits.length;renderRoom();}};
    }else{
      $('roomContent').innerHTML='<div class="furnishing-grid">'+ITEMS.filter(i=>i.kind==='furnishing').map(item=>{const owned=s.owned.includes(item.id),placed=s.placed.includes(item.id);return '<article class="furnishing-card '+(placed?'is-placed':'')+'"><span class="prop-icon prop-'+item.id+'">'+icon(item.icon)+'</span><h2>'+esc(item.name)+'</h2><button data-furnishing="'+item.id+'">'+(owned?placed?'put away':'place in courtyard':item.price+' copper · buy')+'</button></article>';}).join('')+'</div><p class="shop-note">tap a placed object in the courtyard to hear what he thinks.</p>';
      document.querySelectorAll('[data-furnishing]').forEach(b=>b.onclick=()=>{const item=ITEMS.find(i=>i.id===b.dataset.furnishing);try{let next=ctx.state();if(!next.owned.includes(item.id))next=purchase(next,item.id);next=placeFurnishing(next,item.id);const placed=next.placed.includes(item.id);ctx.commit({state:next});if(placed)ctx.speak(item.reaction,'making a little home, together.');ctx.toast(placed?item.name+' · placed in his courtyard':item.name+' · put away');}catch(e){ctx.toast(e.message);}});
    }
  }

  function renderJournal(force=false){
    if(!force&&document.activeElement?.id==='playerName')return;
    const s=ctx.state();document.querySelectorAll('[data-journal-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.journalView===journalView)));
    if(journalView==='today'){
      const req=requestDefinition(s),last=[...CHAPTERS].reverse().find(c=>chapterRecord(s,c.id).complete);
      $('journalContent').innerHTML='<article class="request-card"><div class="request-label">'+icon(s.request.done?'heart':'journal')+'<span>'+(s.request.done?'a small kindness, remembered':'his request · day '+s.day)+'</span></div><h2>'+esc(req.title)+'</h2><blockquote>'+esc(req.quote)+'</blockquote><p>'+esc(req.description)+'</p><button id="requestAction" class="primary-button" '+(s.request.done?'disabled':'')+'>'+(s.request.done?'completed · +15 bond, +12 copper':esc(req.cta))+'</button></article><article class="letter-preview"><span class="eyebrow">'+(last?'a letter he left for you':'an unfinished note')+'</span><h3>'+(last?esc(last.letter):'a little place to begin')+'</h3><p>'+(last?'folded neatly beside your cup.':'“for the household: twenty copper, a reasonably comfortable cushion, and the hope of good company.”')+'</p>'+(last?'<button id="readLetter" class="text-button">unfold the letter '+icon('arrow')+'</button>':'<p class="journal-note">care, requests, and games earn more copper.</p>')+'</article>';
      $('requestAction').onclick=runRequest;
      if(last)$('readLetter').onclick=()=>openLetter(last.id);
    }else if(journalView==='keepsakes'){
      $('journalContent').innerHTML='<div class="keepsake-grid">'+CHAPTERS.map(c=>{const done=chapterRecord(s,c.id).complete;return '<button class="keepsake-card '+(done?'found':'unfound')+'" data-keepsake="'+c.id+'" '+(!done?'disabled':'')+'>'+icon(c.icon)+'<span>'+esc(done?c.keepsake:'an evening yet to come')+'</span><small>'+esc(done?c.title:c.bond+' bond · chapter '+c.number)+'</small></button>';}).join('')+'</div><div class="journal-facts"><span class="eyebrow">little discoveries</span><p>'+esc(s.memories.lastTea?'last shared: '+teaName(s.memories.lastTea):'a cup of tea is a good place to start.')+'</p><p>'+esc(s.memories.tidyCount?'he keeps an unfinished poem among the official papers.':'his desk contains considerably more poetry than he admits.')+'</p></div>';
      document.querySelectorAll('[data-keepsake]').forEach(b=>b.onclick=()=>openLetter(b.dataset.keepsake));
    }else{
      draftPreference=s.preference;
      $('journalContent').innerHTML='<div class="relationship-card"><span class="eyebrow">your time together</span><h2>'+esc(relationshipLabel(s))+'</h2><p>'+esc(s.memories.ribbon?'he is still wearing the '+RIBBONS.find(r=>r.id===s.memories.ribbon).name+' you chose.':'he is learning the small things that make you, you.')+'</p></div><form id="playerMemoryForm" class="memory-form"><label for="playerName">what should he call you?</label><input id="playerName" maxlength="24" autocomplete="off" placeholder="a name, if you like" value="'+esc(s.memories.name)+'"><span class="memory-label">your kind of company</span><div class="preference-buttons">'+[['gentle','gentle'],['teasing','teasing'],['quiet','quiet']].map(([v,label])=>'<button type="button" data-preference="'+v+'" aria-pressed="'+(s.preference===v)+'">'+label+'</button>').join('')+'</div><button class="primary-button" type="submit">let him remember</button></form><p class="journal-note">he remembers your name, your way of spending time together, shared teas, and the ribbon you chose.</p>';
      document.querySelectorAll('[data-preference]').forEach(b=>b.onclick=()=>{draftPreference=b.dataset.preference;document.querySelectorAll('[data-preference]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));});
      $('playerMemoryForm').onsubmit=e=>{e.preventDefault();const next=rememberPlayer(ctx.state(),$('playerName').value,draftPreference);ctx.commit({state:next});renderJournal(true);ctx.toast(next.memories.name?'“'+next.memories.name+'. yes, i like the sound of that.”':'he’ll remember how you like to spend time together.');};
    }
  }

  function renderDecor(){
    const s=ctx.state();$('roomDecor').innerHTML=s.placed.map(id=>{const i=ITEMS.find(x=>x.id===id);return '<button class="room-object object-'+id+'" data-object="'+id+'" aria-label="inspect '+esc(i.name)+'">'+icon(i.icon)+'</button>';}).join('');
    document.querySelectorAll('[data-object]').forEach(b=>b.onclick=()=>{ctx.speak(ITEMS.find(i=>i.id===b.dataset.object).reaction,'a little corner that feels more like home.');ctx.ping('tea');});
    $('paperClutter').hidden=s.tidied;
    const ribbon=RIBBONS.find(r=>r.id===s.memories.ribbon);$('ribbonTie').hidden=!ribbon||s.asleep;if(ribbon)$('ribbonTie').style.color=ribbon.color;
    $('sceneFrame').classList.toggle('rainy',s.chapters.rain.complete&&s.day%3===0);
    $('requestSummary').textContent=s.request.done?'a small kindness, remembered':requestDefinition(s).title;
    $('requestShortcut').classList.toggle('request-done',s.request.done);
  }

  function openLetter(id){const meta=CHAPTERS.find(c=>c.id===id);if(!meta||!chapterRecord(ctx.state(),id).complete)return;activity={view:'letter',id};renderActivity();ctx.showSheet('activityDialog');}
  function runRequest(){
    const req=requestDefinition(ctx.state());if(ctx.state().request.done)return;
    if(req.action==='talk'){ctx.selectPage('care');ctx.openTalk();}
    else if(['feed','tea'].includes(req.action)){ctx.selectPage('care');ctx.openTray(req.action);}
    else if(req.action==='tidy'||req.action==='rest'){ctx.selectPage('care');ctx.care(req.action);}
    else openActivity(req.action==='search'?'search':req.action==='pickup'?'held':'games');
  }
  function openJournal(){journalView='today';ctx.selectPage('journal');renderJournal();}
  function openActivity(view='menu'){
    activity={view};
    if(view==='held')activity.result=ctx.careInSheet('pickup');
    renderActivity();ctx.showSheet('activityDialog');
  }
  function showResult(kind,result,perfect=false){
    activity={view:'result',kind,result,perfect};renderActivity();
  }
  function finish(kind,tea=null,perfect=false){const r=finishGame(ctx.state(),kind,Date.now(),tea);ctx.commit(r);ctx.ping('lantern');showResult(kind,r,perfect);}
  function renderActivity(){
    const root=$('activityContent'),s=ctx.state();$('activityBack').hidden=['menu','held','letter'].includes(activity.view);
    $('activityEyebrow').textContent=activity.view==='letter'?'a note in his own hand':'a little time together';
    if(activity.view==='menu'){
      $('activityTitle').textContent='little things, together.';
      root.innerHTML='<div class="activity-menu"><button data-activity="held">'+icon('pet')+'<span><strong>pick him up</strong><small>a better view from your palm</small></span>'+icon('arrow')+'</button><button data-activity="tidy">'+icon('scroll')+'<span><strong>tidy together</strong><small>a little order among the papers</small></span>'+icon('arrow')+'</button><button data-activity="games">'+icon('stone')+'<span><strong>play a little</strong><small>a memorial, or tea for two</small></span>'+icon('arrow')+'</button></div><p class="dialog-footnote">a new kind of care earns bond and copper. the company is always welcome.</p>';
      document.querySelectorAll('[data-activity]').forEach(b=>b.onclick=()=>{
        const view=b.dataset.activity;
        if(view==='tidy'){$('activityDialog').close();ctx.care('tidy');return;}
        activity={view};if(view==='held')activity.result=ctx.careInSheet('pickup');renderActivity();
      });
    }else if(activity.view==='held'){
      $('activityTitle').textContent='a little closer.';
      root.innerHTML='<div class="held-scene"><img src="./assets/cupped-palm.webp" alt="your open hand, gently holding him"><div class="held-minister"><span class="character-sprite" id="heldSprite"></span></div></div><p class="held-line">'+esc(s.memories.holdCount>1?'“yes. this is a very agreeable view. you may take your time.”':'“an unconventional mode of transport. i find i approve.”')+'</p><button id="setDown" class="primary-button">set him down gently</button><p class="dialog-footnote">'+(activity.result?.reward?'a little trust · +'+activity.result.reward+' bond':'no hurry. he looks quite comfortable.')+'</p>';
      Object.assign($('heldSprite').style,spriteFrameStyle(9,s.outfit));$('setDown').onclick=()=>{$('activityDialog').close();ctx.speak('“a very satisfactory excursion. i may request another.”','he looks at your hand a little more fondly.');};
    }else if(activity.view==='games'&&tooTiredToPlay(s)){
      $('activityTitle').textContent='a forfeit, of sorts.';
      root.innerHTML='<div class="game-result-icon">'+icon('moon')+'</div><p class="game-intro">“i could beat you in my sleep. that is precisely the problem.”</p><p class="dialog-footnote">he’s too drowsy for games. a rest or a warm cup first.</p><button id="resultDone" class="primary-button">let him be</button>';
      $('resultDone').onclick=()=>$('activityDialog').close();
    }else if(activity.view==='games'){
      $('activityTitle').textContent='a worthy opponent.';
      root.innerHTML='<div class="activity-menu"><button id="playMemorial">'+icon('scroll')+'<span><strong>scattered memorial</strong><small>put his thoughts in order</small></span>'+icon('arrow')+'</button><button id="playTea">'+icon('tea')+'<span><strong>tea for two</strong><small>find the cup he has in mind</small></span>'+icon('arrow')+'</button></div><p class="dialog-footnote">'+(s.played?'today’s game reward is already yours. play again for the pleasure of it.':'your first game today · +10 bond and +8 copper, plus any new care category.')+'</p>';
      $('playMemorial').onclick=()=>{activity={view:'memorial',picked:[],hint:false};renderActivity();};$('playTea').onclick=()=>{activity={view:'tea',leaf:null,steep:null};renderActivity();};
    }else if(activity.view==='memorial'){
      const puzzle=MEMORIALS[(s.day-1)%MEMORIALS.length],order=s.day%2?[1,2,0]:[2,0,1];
      $('activityTitle').textContent='scattered memorial.';
      root.innerHTML='<p class="game-intro">“a small matter concerning '+esc(puzzle.topic)+'. help me put these in order?”</p><p class="game-instruction">tap the three passages in the order you would write them.</p><div class="paper-pieces">'+order.filter(i=>!activity.picked.includes(i)).map(i=>'<button data-paper="'+i+'">'+esc(puzzle.parts[i])+'</button>').join('')+'</div><ol class="paper-order">'+activity.picked.map(i=>'<li>'+esc(puzzle.parts[i])+'</li>').join('')+'</ol>'+(activity.hint?'<p class="hint-text">begin with the problem, then the evidence, then the request.</p>':'')+'<div class="game-buttons"><button id="paperHelp" class="text-button">ask him for a hint</button><button id="paperReset" class="text-button">start over</button></div>'+(activity.picked.length===3?'<button id="submitPaper" class="primary-button">present the memorial</button>':'');
      document.querySelectorAll('[data-paper]').forEach(b=>b.onclick=()=>{activity.picked.push(Number(b.dataset.paper));renderActivity();});
      $('paperReset').onclick=()=>{activity.picked=[];renderActivity();};
      $('paperHelp').onclick=()=>{if(activity.hint)activity.picked=[0,1,2];else activity.hint=true;renderActivity();if(activity.hint&&$('paperHelp'))$('paperHelp').textContent='let him help arrange it';};
      if($('submitPaper'))$('submitPaper').onclick=()=>{if(activity.picked.join(',')==='0,1,2')finish('memorial');else{activity.hint=true;activity.picked=[];renderActivity();ctx.toast('“a good beginning. shall we put the problem first?”');}};
    }else if(activity.view==='tea'){
      const clue=TEA_CLUES[(s.day-1)%TEA_CLUES.length];$('activityTitle').textContent='tea for two.';
      root.innerHTML='<p class="game-intro">'+esc(clue.line)+'</p><p class="game-instruction">choose leaves, then a little patience.</p><div class="tea-options">'+[['jasmine','jasmine'],['lotus','lotus'],['rice','roasted rice']].map(([v,label])=>'<button data-leaf="'+v+'" aria-pressed="'+(activity.leaf===v)+'">'+icon('leaf')+'<span>'+label+'</span></button>').join('')+'</div><span class="memory-label">let the leaves…</span><div class="steep-options"><button data-steep="brief" aria-pressed="'+(activity.steep==='brief')+'">wake briefly</button><button data-steep="rested" aria-pressed="'+(activity.steep==='rested')+'">rest a little longer</button></div><button id="pourGameTea" class="primary-button" '+(!activity.leaf||!activity.steep?'disabled':'')+'>pour a cup for him</button><p class="dialog-footnote">there’s no timer. he is very good company while the tea brews.</p>';
      document.querySelectorAll('[data-leaf]').forEach(b=>b.onclick=()=>{activity.leaf=b.dataset.leaf;renderActivity();});document.querySelectorAll('[data-steep]').forEach(b=>b.onclick=()=>{activity.steep=b.dataset.steep;renderActivity();});
      $('pourGameTea').onclick=()=>finish('tea',activity.leaf,activity.leaf===clue.leaf&&activity.steep===clue.steep);
    }else if(activity.view==='search'){
      $('activityTitle').textContent='the missing page.';
      root.innerHTML='<p class="game-intro">“i put it somewhere quite sensible. that is the difficulty.”</p><div class="search-locations">'+['beside the tea tray','under his book','near the inkstone'].map((text,i)=>'<button data-search="'+i+'" '+(s.request.searched.includes(i)?'disabled':'')+'>'+icon(i===0?'tea':i===1?'journal':'seal')+'<span>'+text+'</span></button>').join('')+'</div><p class="dialog-footnote">'+(activity.message||'three likely places. one very important conclusion.')+'</p>';
      document.querySelectorAll('[data-search]').forEach(b=>b.onclick=()=>{const r=searchPage(ctx.state(),Number(b.dataset.search));ctx.commit(r);if(r.found){showResult('search',r,true);ctx.speak('“there it is. an excellent conclusion, just as i remembered.”','one page rescued. one grateful little minister.');}else{activity.message='a spare note, a tea stain, and no conclusion. try another place.';renderActivity();}});
    }else if(activity.view==='result'){
      $('activityTitle').textContent=activity.kind==='search'?'a conclusion, recovered.':activity.kind==='tea'?'a very agreeable cup.':'a persuasive argument.';
      const line=activity.kind==='search'?'“my reputation is saved. i shall have to acknowledge your assistance.”':activity.kind==='tea'?activity.perfect?'“exactly what i had in mind. you have been paying attention.”':'“a different cup than i expected. i rather like your interpretation.”':'“clear, concise, and remarkably sensible. i should like you on my staff. very close to my desk.”';
      root.innerHTML='<div class="game-result-icon">'+icon(activity.kind==='tea'?'tea':activity.kind==='search'?'journal':'scroll')+'</div><p class="game-intro">'+esc(line)+'</p><div class="earned-reward">'+(activity.result.reward?'+'+activity.result.reward+' bond · +'+activity.result.copper+' copper':'another pleasant moment together')+'</div><button id="resultDone" class="primary-button">a moment well spent</button>';
      $('resultDone').onclick=()=>$('activityDialog').close();
    }else if(activity.view==='letter'){
      const c=CHAPTERS.find(x=>x.id===activity.id);$('activityTitle').textContent=c.letter;root.innerHTML='<p class="letter-prose">'+esc(LETTERS[c.id])+'</p><p class="dialog-footnote">kept in your journal · '+esc(c.title)+'</p>';
    }
  }

  function renderAlbum(){
    const s=ctx.state();$('albumContent').innerHTML=CHAPTERS.map(c=>{const r=chapterRecord(s,c.id);return '<button class="album-card '+(r.unlocked?'':'locked')+'" data-memory="'+c.id+'" '+(!r.unlocked?'disabled':'')+'><span class="album-art" style="background-image:url(\'./assets/'+c.art+'\')"><i>'+c.number+'</i></span><strong>'+esc(c.title)+'</strong><small>'+(r.complete?'replay this memory':r.unlocked?'a visit waiting for you':c.bond+' bond · previous chapter first')+'</small></button>';}).join('');
    document.querySelectorAll('[data-memory]').forEach(b=>b.onclick=()=>ctx.replaceSheet('albumDialog',()=>ctx.openStory(b.dataset.memory)));
  }

  $('roomSegments').querySelectorAll('button').forEach(b=>b.onclick=()=>{roomView=b.dataset.roomView;renderRoom();});
  $('journalSegments').querySelectorAll('button').forEach(b=>b.onclick=()=>{journalView=b.dataset.journalView;renderJournal(true);});
  $('activityBack').onclick=()=>{activity={view:'menu'};renderActivity();};
  $('albumButton').onclick=()=>{renderAlbum();ctx.showSheet('albumDialog');};
  $('requestShortcut').onclick=openJournal;$('paperClutter').onclick=()=>ctx.care('tidy');
  return {
    render(){renderDecor();if(ctx.page()==='room')renderRoom();if(ctx.page()==='journal')renderJournal();},
    onPage(page){if(page==='room')renderRoom();if(page==='journal')renderJournal();},
    openActivity,openJournal,runRequest,renderAlbum
  };
}
