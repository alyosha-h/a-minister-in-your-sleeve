import { CHAPTERS, ITEMS, RIBBONS, LETTERS, POSTSCRIPTS, TREATS } from './catalog.js';
import { gameTier, memorialPuzzle, clerkRank, LEAVES, STEEPS, TEA_WISHES, SEARCH_SPOTS, searchSpots } from './minigames.js';
import { MOMENTS } from './moments.js';
import { DATES } from './dates.js';
import { chapterRecord, requestDefinition, relationshipLabel, finishGame, tooTiredToPlay, styleOf, STYLES, momentDue, shareMoment, dateKey, currentTeaWish, orchidThirsty, waterOrchid, buyTreat, MEND_GOAL, searchPage, purchase, equipOutfit, placeFurnishing, rememberPlayer } from './game.js';
import { spriteFrameStyle } from './sprites.js';

const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=name=>'<svg aria-hidden="true"><use href="#i-'+name+'"/></svg>';
const teaName=id=>({jasmine:'jasmine tea',lotus:'lotus tea',rice:'roasted rice tea'}[id]||'a warm cup');

export function createPhaseTwoUI(ctx){
  const outfits=ITEMS.filter(i=>i.kind==='outfit');
  let roomView='outfits',journalView='today',outfitIndex=0,shownOutfit=null;
  let activity={view:'menu'};
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
    }else if(roomView==='pantry'){
      $('roomContent').innerHTML='<div class="furnishing-grid">'+TREATS.map(t=>'<article class="furnishing-card"><span class="prop-icon">'+icon(t.tray==='tea'?'tea':'bun')+'</span><h2>'+esc(t.name)+'</h2><p class="effect-note">'+esc(t.description)+'</p><button data-treat="'+t.id+'">'+t.price+' copper · buy'+(s.pantry[t.id]?' · '+s.pantry[t.id]+' kept':'')+'</button></article>').join('')+'</div><p class="shop-note">treats appear in the feed and tea trays. each is a big comfort, and a little extra bond.</p>';
      document.querySelectorAll('[data-treat]').forEach(b=>b.onclick=()=>{try{const next=buyTreat(ctx.state(),b.dataset.treat);ctx.commit({state:next});ctx.toast(TREATS.find(t=>t.id===b.dataset.treat).name+' · into the pantry');renderRoom();}catch(e){ctx.toast(e.message);}});
    }else{
      $('roomContent').innerHTML='<div class="furnishing-grid">'+ITEMS.filter(i=>i.kind==='furnishing').map(item=>{const owned=s.owned.includes(item.id),placed=s.placed.includes(item.id);return '<article class="furnishing-card '+(placed?'is-placed':'')+'"><span class="prop-icon prop-'+item.id+'">'+icon(item.icon)+'</span><h2>'+esc(item.name)+'</h2><p class="effect-note">'+esc(item.effect)+'</p><button data-furnishing="'+item.id+'">'+(owned?placed?'put away':'place in courtyard':item.price+' copper · buy')+'</button></article>';}).join('')+'</div><p class="shop-note">tap a placed object in the courtyard to hear what he thinks.</p>';
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
      $('journalContent').innerHTML='<div class="keepsake-grid">'+CHAPTERS.map(c=>{const done=chapterRecord(s,c.id).complete;return '<button class="keepsake-card '+(done?'found':'unfound')+'" data-keepsake="'+c.id+'" '+(!done?'disabled':'')+'>'+icon(c.icon)+'<span>'+esc(done?c.keepsake:'an evening yet to come')+'</span><small>'+esc(done?c.title:c.bond+' bond · chapter '+c.number)+'</small></button>';}).join('')+'</div><div class="journal-facts"><span class="eyebrow">little discoveries</span><p>'+esc(s.memories.lastTea?'last shared: '+teaName(s.memories.lastTea):'a cup of tea is a good place to start.')+'</p><p>'+esc(s.memories.tidyCount?'he keeps an unfinished poem among the official papers.':'his desk contains considerably more poetry than he admits.')+'</p><p>'+esc(s.memories.gamesPlayed?'at the memorial table: '+clerkRank(s.memories.memorialPerfects)+'.':'he has been looking for an impartial opponent.')+'</p><p>'+esc(s.memories.teaNotes.length?'tea notes: '+s.memories.teaNotes.length+' of '+Object.keys(TEA_WISHES).length+' of his preferences, learned by heart.':'he has opinions about tea. you could learn them.')+'</p></div>';
      document.querySelectorAll('[data-keepsake]').forEach(b=>b.onclick=()=>openLetter(b.dataset.keepsake));
      const mend=s.talisman.mend;$('journalContent').insertAdjacentHTML('afterbegin','<div class="jade-card">'+icon('jade')+'<div><span class="eyebrow">the cracked jade</span><p>'+esc(mend>=MEND_GOAL?'whole again. the choice is his, and he wants you there for it.':mend?'the crack is narrowing. requests, flourishing days, perfect games and shared moments all help.':'a hairline crack, split right through. it mends when he is well looked after.')+'</p><span class="need-track"><span style="width:'+(mend/MEND_GOAL*100)+'%"></span></span><small>'+mend+' / '+MEND_GOAL+'</small></div></div>');
      // small moments he has shared, kept to reread; the next unshared one is only hinted at
      const seen=MOMENTS.filter(m=>s.moments.seen.includes(m.id)),next=MOMENTS.find(m=>!s.moments.seen.includes(m.id));
      $('journalContent').insertAdjacentHTML('beforeend','<div class="journal-facts"><span class="eyebrow">small moments</span><div class="moment-list">'+seen.map(m=>'<button data-moment="'+m.id+'">'+esc(m.title)+'<small>reread</small></button>').join('')+(next?'<button class="unread" disabled>something not yet shared<small>'+(s.bond>=next.bond?'another day':next.bond+' bond')+'</small></button>':'')+'</div></div>');
      document.querySelectorAll('[data-moment]').forEach(b=>b.onclick=()=>{activity={view:'moment',id:b.dataset.moment,reread:true};renderActivity();ctx.showSheet('activityDialog');});
    }else{
      $('journalContent').innerHTML='<div class="relationship-card"><span class="eyebrow">your time together</span><h2>'+esc(relationshipLabel(s))+'</h2><p>'+esc(s.memories.ribbon?'he is still wearing the '+RIBBONS.find(r=>r.id===s.memories.ribbon).name+' you chose.':'he is learning the small things that make you, you.')+'</p></div><form id="playerMemoryForm" class="memory-form"><label for="playerName">what should he call you?</label><input id="playerName" maxlength="24" autocomplete="off" placeholder="a name, if you like" value="'+esc(s.memories.name)+'"><span class="memory-label">how he knows you</span>'+affinityHtml(s)+'<button class="primary-button" type="submit">let him remember</button></form><p class="journal-note">he remembers your name, your way of spending time together, shared teas, and the ribbon you chose.</p>';
      $('playerMemoryForm').onsubmit=e=>{e.preventDefault();const next=rememberPlayer(ctx.state(),$('playerName').value);ctx.commit({state:next});renderJournal(true);ctx.toast(next.memories.name?'“'+next.memories.name+'. yes, i like the sound of that.”':'he’ll remember how you like to spend time together.');};
    }
  }

  // the running tally of how you spend time with him, which shapes his chapters and letters
  function affinityHtml(s){
    const style=styleOf(s),total=STYLES.reduce((n,k)=>n+s.affinity[k],0)||1;
    const blurb={gentle:'he leans into your kindness, and has stopped pretending not to.',teasing:'he keeps a reply ready for you. he enjoys needing one.',quiet:'he has learned that your silences are company, too.'}[style];
    return '<div class="affinity" role="list">'+STYLES.map(k=>'<div class="affinity-row'+(k===style?' leading':'')+'" role="listitem"><span>'+k+'</span><span class="need-track" role="meter" aria-label="'+k+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+Math.round(s.affinity[k]/total*100)+'"><span style="width:'+(s.affinity[k]/total*100)+'%"></span></span></div>').join('')+'</div><p class="affinity-note">'+esc(blurb)+'</p>';
  }
  function openMomentSheet(){const m=momentDue(ctx.state());if(!m)return;activity={view:'moment',id:m.id};renderActivity();ctx.showSheet('activityDialog');}
  function renderDecor(){
    // a thirsty orchid droops until watered; the chime stirs when he has something to show you
    const s=ctx.state(),thirsty=orchidThirsty(s),stirring=Boolean(momentDue(s));
    $('roomDecor').innerHTML=s.placed.map(id=>{const i=ITEMS.find(x=>x.id===id),flag=id==='orchid'&&thirsty?' thirsty':id==='chime'&&stirring?' stirring':'';return '<button class="room-object object-'+id+flag+'" data-object="'+id+'" aria-label="'+(flag===' thirsty'?'water the orchid':'inspect '+esc(i.name))+'">'+icon(i.icon)+'</button>';}).join('');
    document.querySelectorAll('[data-object]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.object;
      if(id==='orchid'&&orchidThirsty(ctx.state())){ctx.commit(waterOrchid(ctx.state()));ctx.speak('“ah. it was being very diplomatic about its thirst. thank you.”','a little water, and the orchid lifts its head.');ctx.ping('tea');return;}
      if(id==='chime'&&momentDue(ctx.state())){openMomentSheet();return;}
      ctx.speak(ITEMS.find(i=>i.id===id).reaction,'a little corner that feels more like home.');ctx.ping('tea');
    });
    $('paperClutter').hidden=s.tidied;
    const ribbon=RIBBONS.find(r=>r.id===s.memories.ribbon);$('ribbonTie').hidden=!ribbon||s.asleep;if(ribbon)$('ribbonTie').style.color=ribbon.color;
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
  function finish(kind,tea=null,perfect=false){
    const notes=ctx.state().memories.teaNotes.length;let r;try{r=finishGame(ctx.state(),kind,Date.now(),tea,perfect);}catch(e){ctx.toast(e.message);return;}
    ctx.commit(r);ctx.ping('lantern');showResult(kind,r,r.verdict==='perfect');activity.newNote=r.state.memories.teaNotes.length>notes;renderActivity();
  }
  function renderActivity(){
    const root=$('activityContent'),s=ctx.state();$('activityBack').hidden=['menu','held','letter','moment','dates'].includes(activity.view);
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
      $('playMemorial').onclick=()=>{activity={view:'memorial',picked:[],hint:false,helped:false,mistakes:0,key:'m:'+s.day+':'+s.memories.gamesPlayed};renderActivity();};$('playTea').onclick=()=>{activity={view:'tea',leaf:null,steep:null};renderActivity();};
    }else if(activity.view==='memorial'){
      const puzzle=memorialPuzzle(s.bond,activity.key),left=puzzle.cards.filter(c=>!activity.picked.includes(c.id)),line=id=>puzzle.cards.find(c=>c.id===id).line;
      $('activityTitle').textContent='scattered memorial.';
      root.innerHTML='<p class="game-intro">“a small matter concerning '+esc(puzzle.topic)+'. help me put these in order?”</p><p class="game-instruction">'+(puzzle.tier?'tap the passages in the order you would write them. one of them doesn’t belong.':'tap the three passages in the order you would write them.')+'</p><div class="paper-pieces">'+left.map(c=>'<button data-paper="'+c.id+'">'+esc(c.line)+'</button>').join('')+'</div><ol class="paper-order">'+activity.picked.map(id=>'<li>'+esc(line(id))+'</li>').join('')+'</ol>'+(activity.hint?'<p class="hint-text">'+esc(puzzle.hint)+'</p>':'')+'<div class="game-buttons"><button id="paperHelp" class="text-button">'+(activity.hint?'let him help arrange it':'ask him for a hint')+'</button><button id="paperReset" class="text-button">start over</button></div>'+(activity.picked.length===puzzle.answer.length?'<button id="submitPaper" class="primary-button">present the memorial</button>':'');
      document.querySelectorAll('[data-paper]').forEach(b=>b.onclick=()=>{if(activity.picked.length<puzzle.answer.length)activity.picked.push(b.dataset.paper);renderActivity();});
      $('paperReset').onclick=()=>{activity.picked=[];renderActivity();};
      $('paperHelp').onclick=()=>{if(activity.hint)activity.picked=[...puzzle.answer];activity.hint=true;activity.helped=true;renderActivity();};
      if($('submitPaper'))$('submitPaper').onclick=()=>{
        const decoy=activity.picked.includes('decoy')&&puzzle.cards.find(c=>c.id==='decoy');
        if(activity.picked.join(',')===puzzle.answer.join(','))finish('memorial',null,!activity.mistakes&&!activity.helped);
        else{activity.mistakes++;activity.picked=[];if(!decoy)activity.hint=true;renderActivity();ctx.toast(decoy?decoy.reply:'“a good beginning. shall we put the problem first?”');}
      };
    }else if(activity.view==='tea'){
      const wish=currentTeaWish(s),clue=TEA_WISHES[wish].clues[gameTier(s.bond)],notes=s.memories.teaNotes.map(k=>TEA_WISHES[k]);
      $('activityTitle').textContent='tea for two.';
      root.innerHTML='<p class="game-intro">'+esc(clue)+'</p><p class="game-instruction">choose leaves, then a little patience.</p><div class="tea-options">'+LEAVES.map(([v,label])=>'<button data-leaf="'+v+'" aria-pressed="'+(activity.leaf===v)+'">'+icon('leaf')+'<span>'+label+'</span></button>').join('')+'</div><span class="memory-label">let the leaves…</span><div class="steep-options">'+STEEPS.map(([v,label])=>'<button data-steep="'+v+'" aria-pressed="'+(activity.steep===v)+'">'+label+'</button>').join('')+'</div><button id="pourGameTea" class="primary-button" '+(!activity.leaf||!activity.steep?'disabled':'')+'>pour a cup for him</button>'+(notes.length?'<details class="tea-notes"><summary>your tea notes · '+notes.length+' of '+Object.keys(TEA_WISHES).length+'</summary><ul>'+notes.map(n=>'<li><span>'+esc(n.note)+'</span>'+esc(teaName(n.leaf))+', '+esc(STEEPS.find(x=>x[0]===n.steep)[1])+'</li>').join('')+'</ul></details>':'')+'<p class="dialog-footnote">there’s no timer. he is very good company while the tea brews.</p>';
      document.querySelectorAll('[data-leaf]').forEach(b=>b.onclick=()=>{activity.leaf=b.dataset.leaf;renderActivity();});document.querySelectorAll('[data-steep]').forEach(b=>b.onclick=()=>{activity.steep=b.dataset.steep;renderActivity();});
      $('pourGameTea').onclick=()=>finish('tea',{leaf:activity.leaf,steep:activity.steep});
    }else if(activity.view==='search'){
      const spots=searchSpots(s.placed),missed=s.request.searched.length>0&&!s.request.done,hint=missed&&SEARCH_SPOTS.find(x=>x.id===s.request.spot)?.hint;
      $('activityTitle').textContent='the missing page.';
      root.innerHTML='<p class="game-intro">“i put it somewhere quite sensible. that is the difficulty.”</p><div class="search-locations'+(spots.length>4?' many':'')+'">'+spots.map(x=>'<button data-search="'+x.id+'" '+(s.request.searched.includes(x.id)?'disabled':'')+'>'+icon(x.icon)+'<span>'+esc(x.label)+'</span></button>').join('')+'</div><p class="dialog-footnote">'+esc(hint?'a spare note and a tea stain, but no conclusion. he thinks hard. '+hint:spots.length+' likely places. one very important conclusion.')+'</p>';
      document.querySelectorAll('[data-search]').forEach(b=>b.onclick=()=>{const r=searchPage(ctx.state(),b.dataset.search);ctx.commit(r);if(r.found){showResult('search',r,true);ctx.speak('“there it is. an excellent conclusion, just as i remembered.”','one page rescued. one grateful little minister.');}else renderActivity();});
    }else if(activity.view==='result'){
      $('activityTitle').textContent=activity.kind==='search'?'a conclusion, recovered.':activity.kind==='tea'?'a very agreeable cup.':'a persuasive argument.';
      const r=activity.result,w=r.wish&&TEA_WISHES[r.wish];
      const line=activity.kind==='search'?'“my reputation is saved. i shall have to acknowledge your assistance.”'
        :activity.kind==='tea'?(r.verdict==='perfect'?'“exactly what i had in mind. you have been paying attention.”':r.verdict==='close'?'“the right leaves. a little more, or less, patience next time. still lovely.”':'“a different cup than i expected. i rather like your interpretation.”')
        :r.verdict==='perfect'?'“clear, concise, and in order on the first try. you have clerical instincts. i am slightly alarmed.”':'“clear, concise, and remarkably sensible. i should like you on my staff. very close to my desk.”';
      const extra=activity.kind==='tea'&&activity.newNote?'<p class="dialog-footnote">noted in your journal: what he likes '+esc(w.note)+'.</p>':activity.kind==='memorial'?'<p class="dialog-footnote">your standing: '+esc(clerkRank(ctx.state().memories.memorialPerfects))+'</p>':'';
      root.innerHTML='<div class="game-result-icon">'+icon(activity.kind==='tea'?'tea':activity.kind==='search'?'journal':'scroll')+'</div><p class="game-intro">'+esc(line)+'</p>'+extra+'<div class="earned-reward">'+(activity.result.reward?'+'+activity.result.reward+' bond · +'+activity.result.copper+' copper':'another pleasant moment together')+'</div><button id="resultDone" class="primary-button">a moment well spent</button>';
      $('resultDone').onclick=()=>$('activityDialog').close();
    }else if(activity.view==='dates'){
      // after the ending: he can be tall whenever you ask
      $('activityTitle').textContent='an evening at his true height.';$('activityEyebrow').textContent='small by choice, tall on request';
      const rewarded=s.memories.dateKey===dateKey(Date.now());
      root.innerHTML='<div class="activity-menu">'+DATES.map(d=>'<button data-date="'+d.id+'">'+icon('heart')+'<span><strong>'+esc(d.title)+'</strong></span>'+icon('arrow')+'</button>').join('')+'</div><p class="dialog-footnote">'+(rewarded?'you’ve already had tonight’s evening. another is always welcome.':'tonight’s first evening together · +5 bond and +3 copper.')+'</p>';
      document.querySelectorAll('[data-date]').forEach(b=>b.onclick=()=>ctx.replaceSheet('activityDialog',()=>ctx.openDate(b.dataset.date)));
    }else if(activity.view==='moment'){
      const m=MOMENTS.find(x=>x.id===activity.id);$('activityTitle').textContent=m.title;$('activityEyebrow').textContent=activity.reread?'a small moment, kept':'a small moment';
      root.innerHTML='<p class="letter-prose">'+esc(m.text)+'</p>'+(activity.reply!=null?'<p class="letter-prose moment-reply">'+esc(m.options[activity.reply].response)+'</p><div class="earned-reward">'+(activity.result?.reward?'+'+activity.result.reward+' bond · +'+activity.result.copper+' copper':'kept in your journal')+'</div><button id="resultDone" class="primary-button">keep this one</button>':activity.reread?'<button id="resultDone" class="primary-button">fold it away</button>':'<div class="dialog-choices">'+m.options.map((o,i)=>'<button data-reply="'+i+'">'+esc(o.label)+'</button>').join('')+'</div>');
      document.querySelectorAll('[data-reply]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.reply);let r;try{r=shareMoment(ctx.state(),m.id,i);}catch(e){ctx.toast(e.message);return;}ctx.commit(r);ctx.ping('tea');activity.reply=i;activity.result=r;renderActivity();});
      if($('resultDone'))$('resultDone').onclick=()=>$('activityDialog').close();
    }else if(activity.view==='letter'){
      const c=CHAPTERS.find(x=>x.id===activity.id);$('activityTitle').textContent=c.letter;root.innerHTML='<p class="letter-prose">'+esc(LETTERS[c.id]+'\n\n'+POSTSCRIPTS[c.id][styleOf(ctx.state())])+'</p><p class="dialog-footnote">kept in your journal · '+esc(c.title)+'</p>';
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
    openActivity,openJournal,runRequest,renderAlbum,
    openMoment:openMomentSheet,
    openDates(){activity={view:'dates'};renderActivity();ctx.showSheet('activityDialog');}
  };
}
