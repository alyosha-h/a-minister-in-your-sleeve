import { CHAPTERS, ITEMS, RIBBONS, LETTERS, POSTSCRIPTS, TREATS } from './catalog.js';
import { gameTier, memorialPuzzle, clerkRank, LEAVES, STEEPS, TEA_WISHES, SEARCH_SPOTS, searchSpots } from './minigames.js';
import { MOMENTS } from './moments.js';
import { DATES } from './dates.js';
import { chapterRecord, requestDefinition, relationshipLabel, finishGame, tooTiredToPlay, styleOf, STYLES, momentDue, shareMoment, dateKey, currentTeaWish, orchidThirsty, waterOrchid, buyTreat, MEND_GOAL, searchPage, openPack, cardPool, seeCard, purchase, equipOutfit, placeFurnishing, rememberPlayer } from './game.js';
import { spriteFrameStyle } from './sprites.js';
import { CARDS, RARITIES, TIER_ORDER, PACK_PRICE, DUPLICATE_REFUND } from './cards.js';

const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=name=>'<svg aria-hidden="true"><use href="#i-'+name+'"/></svg>';
const teaName=id=>({jasmine:'jasmine tea',lotus:'lotus tea',rice:'roasted rice tea'}[id]||'a warm cup');

export function createPhaseTwoUI(ctx){
  const outfits=ITEMS.filter(i=>i.kind==='outfit');
  let roomView='outfits',journalView='today',outfitIndex=0,shownOutfit=null;
  let activity={view:'menu'};
  let pack=null,cardFocus=null,cardFilter='all';
  // Browsing previews is free, but when what he's wearing changes (shop, import,
  // cloud restore), bring the wardrobe back to the outfit he actually has on.
  function followOutfit(){const id=ctx.state().outfit;if(id!==shownOutfit){shownOutfit=id;outfitIndex=Math.max(0,outfits.findIndex(i=>i.id===id));}}
  followOutfit();

  // portrait cards: the art is either a sprite pose or a painted portrait of its own
  const kebab=k=>k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase());
  function cardArt(card){
    if(card.sprite){const st=spriteFrameStyle(card.sprite.frame,card.sprite.outfit);return '<span class="lc-pose"><span class="lc-sprite" style="'+esc(Object.entries(st).map(([k,v])=>kebab(k)+':'+v).join(';'))+'"></span></span>';}
    return '<span class="lc-paint" style="background-image:url(\'./assets/'+card.art+'\')"></span>';
  }
  function cardFace(card,count=1){
    return '<span class="lc-card lc-'+card.rarity+'"><span class="lc-art">'+cardArt(card)+'</span><span class="lc-foil"></span><span class="lc-glare"></span><span class="lc-label"><strong>'+esc(card.name)+'</strong><small>'+esc(RARITIES[card.rarity].name)+(count>1?' · ×'+count:'')+'</small></span></span>';
  }
  function lockedHint(s,card){
    if(!card.chapter||chapterRecord(s,card.chapter).complete)return 'still out there';
    const c=CHAPTERS.find(x=>x.id===card.chapter);return 'after evening '+c.number;
  }
  // tiers from humblest to rarest, with each one's real chance per card (cutoffs nest, so subtract the tier above)
  const TIERS=['common',...[...TIER_ORDER].reverse()];
  const chance=t=>{const i=TIER_ORDER.indexOf(t),above=i>0?RARITIES[TIER_ORDER[i-1]].odds:0;return t==='common'?1-RARITIES[TIER_ORDER.at(-1)].odds:RARITIES[t].odds-above;};
  const pct=v=>(v*100<1?(v*100).toFixed(1):Math.round(v*100))+'%';
  const backArrow='<svg class="back-arrow" aria-hidden="true"><use href="#i-arrow"/></svg>';
  const badge=p=>p.duplicate?'<span class="lc-dupe">spare · +'+DUPLICATE_REFUND+'</span>':'<span class="lc-dupe lc-new">new</span>';
  // a slim bar for the full-panel card views: a way back, and your copper
  const cardsBar=(s,label='album')=>'<div class="cards-bar"><button id="cardsBack" class="cards-back">'+backArrow+'<span>'+label+'</span></button><span class="cards-purse">'+icon('coins')+'<span>'+s.copper+'</span></span></div>';
  function bindBar(){const b=$('cardsBack');if(b)b.onclick=()=>{pack=null;cardFocus=null;renderRoom();};}
  const ownedInView=s=>TIERS.filter(t=>cardFilter==='all'||cardFilter===t).flatMap(t=>CARDS.filter(c=>c.rarity===t&&s.cards[c.id]));
  function stepFocus(d){const s=ctx.state(),list=ownedInView(s);if(list.length<2)return;const i=list.findIndex(c=>c.id===cardFocus);cardFocus=list[(i+d+list.length)%list.length].id;renderRoom();}
  document.addEventListener('keydown',e=>{if(ctx.page()!=='room'||roomView!=='cards'||!cardFocus||document.querySelector('dialog[open]'))return;if(e.key==='ArrowLeft')stepFocus(-1);else if(e.key==='ArrowRight')stepFocus(1);else if(e.key==='Escape'){cardFocus=null;renderRoom();}});
  // tcg-style tilt: the card leans toward wherever you press, and the foil and glare follow your finger
  const noMotion=()=>document.body.classList.contains('reduced-motion')||matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tilted=(face,cls='')=>'<div class="tilt '+cls+'"><div class="tilt-inner">'+face+'</div></div>';
  function attachTilt(el,{mouseOnly=false,max=26,onRelease}={}){
    // eased so a small nudge off-centre already leans the card a good way
    const curve=v=>Math.sign(v)*Math.abs(v)**.6;
    let down=null,last=null,raf=0;
    const apply=()=>{raf=0;if(!last)return;const r=el.getBoundingClientRect(),px=Math.min(1,Math.max(0,(last.x-r.left)/r.width)),py=Math.min(1,Math.max(0,(last.y-r.top)/r.height));
      el.style.setProperty('--ry',(curve((px-.5)*2)*max).toFixed(2)+'deg');el.style.setProperty('--rx',(-curve((py-.5)*2)*max).toFixed(2)+'deg');
      el.style.setProperty('--px',(px*100).toFixed(1)+'%');el.style.setProperty('--py',(py*100).toFixed(1)+'%');el.style.setProperty('--glare',Math.min(1,.4+Math.hypot(px-.5,py-.5)*1.5).toFixed(2));};
    const reset=()=>{last=null;el.classList.remove('is-tilting');el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg');el.style.setProperty('--glare','0');};
    const move=e=>{if(e.pointerType==='mouse'?false:(mouseOnly||!down))return;last={x:e.clientX,y:e.clientY};el.classList.add('is-tilting');if(!raf)raf=requestAnimationFrame(apply);};
    el.addEventListener('pointerdown',e=>{if(mouseOnly&&e.pointerType!=='mouse')return;down={x:e.clientX,y:e.clientY,t:performance.now()};el.setPointerCapture?.(e.pointerId);move(e);});
    el.addEventListener('pointermove',move);
    el.addEventListener('pointerup',e=>{const d=down;down=null;const r=el.getBoundingClientRect();if(e.pointerType!=='mouse'||e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)reset();if(d&&onRelease)onRelease({dx:e.clientX-d.x,dy:e.clientY-d.y,dt:performance.now()-d.t});});
    el.addEventListener('pointercancel',()=>{down=null;reset();});
    el.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!down)reset();});
  }
  const packFace='<div class="pack"><div class="pack-top"></div><div class="pack-body"><span class="pack-emblem">'+icon('lantern')+'</span><strong>portrait cards</strong><small>lin yan · three within</small></div><span class="pack-glow"></span><span class="pack-cut" id="packCut"><i id="packTrail"></i></span></div>';
  function renderPack(root){
    const card=pack.stage==='reveal'?CARDS.find(c=>c.id===pack.pulls[pack.index].id):null;
    if(pack.stage==='sealed'||pack.stage==='tearing'){
      root.innerHTML='<div class="pack-stage" data-stage="'+pack.stage+'">'+cardsBar(ctx.state())+'<p class="eyebrow pack-eyebrow">a fresh pack</p>'+tilted(packFace,'pack-wrap')+'<p class="pack-hint">swipe along the top to tear it open</p><button id="packTear" class="text-button">or just open it '+icon('arrow')+'</button></div>';
      bindBar();if(pack.stage==='tearing')return;
      const wrap=root.querySelector('.pack-wrap'),cut=$('packCut'),trail=$('packTrail');attachTilt(wrap,{max:18});
      let span=null;
      cut.onpointerdown=e=>{e.stopPropagation();cut.setPointerCapture?.(e.pointerId);span={min:e.clientX,max:e.clientX};};
      cut.onpointermove=e=>{if(!span)return;span.min=Math.min(span.min,e.clientX);span.max=Math.max(span.max,e.clientX);const r=cut.getBoundingClientRect();
        trail.style.left=((span.min-r.left)/r.width*100)+'%';trail.style.width=((span.max-span.min)/r.width*100)+'%';if((span.max-span.min)/r.width>.62){span=null;tearPack();}};
      cut.onpointerup=cut.onpointercancel=()=>{span=null;trail.style.width='0';};
      $('packTear').onclick=tearPack;return;
    }
    if(pack.stage==='reveal'){
      const p=pack.pulls[pack.index],left=pack.pulls.length-pack.index-1;
      root.innerHTML='<div class="pack-stage" data-stage="reveal">'+cardsBar(ctx.state())+'<p class="eyebrow pack-eyebrow">card '+(pack.index+1)+' of '+pack.pulls.length+'</p><div class="reveal-wrap burst-'+card.rarity+'"><span class="reveal-burst"></span>'+(card.rarity!=='common'?'<span class="sparkles"><i></i><i></i><i></i><i></i><i></i></span>':'')+Array.from({length:left},(_,i)=>'<span class="stack-back" style="--n:'+(i+1)+'"><span class="lc-back">'+icon('lantern')+'</span></span>').join('')+tilted(cardFace(card)+badge(p),'reveal-card')+'</div><p class="pack-line">'+esc(card.line)+'</p><button id="revealNext" class="primary-button">'+(left?'next card · or swipe him away':'see the haul')+'</button></div>';
      bindBar();const el=root.querySelector('.reveal-card');
      const next=dir=>{if(el.dataset.gone)return;el.dataset.gone='1';el.classList.add(dir<0?'fly-left':'fly-right');setTimeout(()=>{if(!pack)return;pack.index++;if(pack.index>=pack.pulls.length)pack.stage='summary';renderRoom();},noMotion()?0:320);};
      attachTilt(el,{onRelease:({dx,dy,dt})=>{if(Math.abs(dx)>80)next(Math.sign(dx));else if(Math.hypot(dx,dy)<8&&dt<350)next(1);}});
      $('revealNext').onclick=()=>next(1);ctx.ping(card.rarity==='common'?'care':'lantern');return;
    }
    const fresh=pack.pulls.filter(p=>!p.duplicate).length,spare=pack.pulls.length-fresh;
    root.innerHTML='<div class="pack-view">'+cardsBar(ctx.state())+'<p class="eyebrow pack-eyebrow">a fine haul · '+[fresh&&fresh+' new',spare&&spare+' spare'].filter(Boolean).join(' · ')+'</p><div class="pack-row">'+pack.pulls.map(p=>{const c=CARDS.find(x=>x.id===p.id);return '<button class="haul-slot" data-haul="'+c.id+'" aria-label="look at '+esc(c.name)+'">'+tilted(cardFace(c),'haul-card')+badge(p)+'</button>';}).join('')+'</div><p class="pack-line">“well. i suppose you will be wanting to look at those for a while.”</p><p class="pack-hint">tap a card to take a closer look</p><div class="pack-actions"><button id="packAgain" class="primary-button" '+(ctx.state().copper<PACK_PRICE?'disabled':'')+'>another pack · '+PACK_PRICE+' copper</button></div>'+(pack.refund?'<p class="shop-note">spares are sold back to the kitchen staff, who collect. +'+pack.refund+' copper.</p>':'')+'</div>';
    bindBar();root.querySelectorAll('.haul-card').forEach(el=>attachTilt(el,{mouseOnly:true,max:18}));
    root.querySelectorAll('[data-haul]').forEach(b=>b.onclick=()=>{pack=null;cardFilter='all';cardFocus=b.dataset.haul;renderRoom();});
    $('packAgain').onclick=buyPack;
  }
  function tearPack(){
    if(!pack||pack.stage!=='sealed')return;const id=pack.id;pack.stage='tearing';ctx.ping('tea');
    // animate in place rather than re-rendering, so the torn strip can fly off the pack you were touching
    const stage=$('roomContent').querySelector('.pack-stage');if(stage)stage.dataset.stage='tearing';
    setTimeout(()=>{if(pack?.id===id){pack.stage='reveal';pack.index=0;renderRoom();}},noMotion()?0:950);
  }
  function renderCards(s){
    const root=$('roomContent');
    // the minute tick re-renders the room: leave a pack or a held card alone mid-gesture
    const key=pack?'pack'+pack.id+pack.stage+(pack.index||0):cardFocus?'focus'+cardFocus+s.cards[cardFocus]:'album';
    if(key!=='album'&&root.dataset.view===key&&root.firstChild)return;root.dataset.view=key;
    if(pack)return renderPack(root);
    if(cardFocus){
      const card=CARDS.find(c=>c.id===cardFocus),list=ownedInView(s),i=list.findIndex(c=>c.id===card.id),ch=CHAPTERS.find(c=>c.id===card.chapter),n=s.cards[card.id];
      root.innerHTML='<div class="pack-view card-focus">'+cardsBar(s)+tilted(cardFace(card,n),'focus-card')+'<div class="focus-meta">'+(list.length>1?'<button id="focusPrev" class="focus-step" aria-label="previous card">'+backArrow+'</button>':'<span></span>')+'<div class="focus-tags"><span class="tier-chip tier-'+card.rarity+'"><i></i>'+esc(RARITIES[card.rarity].name)+'</span>'+(ch?'<span class="meta-chip">evening '+ch.number+'</span>':'')+(n>1?'<span class="meta-chip">×'+n+'</span>':'')+(i>=0?'<small>'+(i+1)+' of '+list.length+'</small>':'')+'</div>'+(list.length>1?'<button id="focusNext" class="focus-step" aria-label="next card">'+icon('arrow')+'</button>':'<span></span>')+'</div><p class="pack-line">'+esc(card.line)+'</p></div>';
      bindBar();attachTilt(root.querySelector('.focus-card'));
      if($('focusPrev')){$('focusPrev').onclick=()=>stepFocus(-1);$('focusNext').onclick=()=>stepFocus(1);}
      if(s.cardsNew?.includes(card.id))ctx.commit({state:seeCard(s,card.id)});
      return;
    }
    const pool=cardPool(s),have=CARDS.filter(c=>s.cards[c.id]).length,afford=s.copper>=PACK_PRICE,fresh=new Set(s.cardsNew||[]);
    const tally=t=>{const all=CARDS.filter(c=>c.rarity===t);return {have:all.filter(c=>s.cards[c.id]).length,all:all.length};};
    const shelf='<div class="pack-shelf"><div class="shelf-pack" aria-hidden="true"><span class="shelf-wrapper"><span class="pack-emblem">'+icon('lantern')+'</span></span></div><div class="shelf-copy"><span class="eyebrow">portrait cards</span><h2>a fresh pack</h2><p>three cards, sealed. he insists he hasn’t peeked.</p><details class="odds"><summary>what’s inside</summary><ul>'+[...TIERS].reverse().map(t=>'<li><span class="tier-chip tier-'+t+'"><i></i>'+esc(RARITIES[t].name)+'</span><span>'+pct(chance(t))+' a card</span></li>').join('')+'</ul><p>painted cards join after each lantern evening. spares sell back for '+DUPLICATE_REFUND+' copper.</p></details></div><button id="buyPack" class="primary-button shelf-buy" '+(afford?'':'disabled')+'>'+icon('coins')+'<strong>'+PACK_PRICE+'</strong><small>'+(afford?'open one':(PACK_PRICE-s.copper)+' short')+'</small></button></div>';
    const progress='<div class="collection-progress"><div><strong>'+have+'</strong><span> of '+CARDS.length+' collected</span>'+(fresh.size?'<span class="new-count">'+fresh.size+' new</span>':'')+'</div><span class="need-track"><span style="width:'+(have/CARDS.length*100)+'%"></span></span></div>';
    const filters='<div class="tier-filters" role="group" aria-label="show cards">'+['all',...TIERS].map(f=>{const c=f==='all'?{have,all:CARDS.length}:tally(f);return '<button data-filter="'+f+'" aria-pressed="'+(cardFilter===f)+'" class="filter-chip tier-'+f+'">'+(f==='all'?'':'<i></i>')+esc(f==='all'?'all':RARITIES[f].name)+'<small>'+c.have+'/'+c.all+'</small></button>';}).join('')+'</div>';
    const slot=c=>s.cards[c.id]?'<button class="album-slot" data-card="'+c.id+'" aria-label="'+esc(c.name)+(fresh.has(c.id)?', new':'')+'">'+tilted(cardFace(c,s.cards[c.id]))+(fresh.has(c.id)?'<span class="slot-new">new</span>':'')+'</button>':'<span class="album-slot is-empty lc-'+c.rarity+'"><span>'+(pool.includes(c)?'?':icon('lantern'))+'</span><small>'+esc(lockedHint(s,c))+'</small></span>';
    const sections=TIERS.filter(t=>cardFilter==='all'||cardFilter===t).map(t=>{const c=tally(t);const mine=CARDS.filter(x=>x.rarity===t),own=mine.filter(x=>s.cards[x.id]),open=mine.filter(x=>!s.cards[x.id]&&pool.includes(x)),locked=mine.filter(x=>!s.cards[x.id]&&!pool.includes(x));
      // cards behind evenings you haven't had fold into one quiet line, rather than a wall of empty frames
      const next=locked.map(x=>CHAPTERS.find(ch=>ch.id===x.chapter)).sort((x,y)=>x.number.localeCompare(y.number))[0];
      return '<section class="album-section"><h3><span class="tier-chip tier-'+t+'"><i></i>'+esc(RARITIES[t].name)+'</span><small>'+c.have+' / '+c.all+'</small></h3>'+(own.length||open.length?'<div class="card-album">'+[...own,...open].map(slot).join('')+'</div>':'')+(locked.length?'<div class="locked-note lc-'+t+'">'+icon('lantern')+'<span>'+(own.length||open.length?locked.length+' more':'all '+locked.length)+' wait behind later evenings</span><small>next · evening '+next.number+'</small></div>':'')+'</section>';}).join('');
    root.innerHTML=shelf+progress+filters+sections+'<p class="shop-note">he “disapproves” of the whole collection. he has also asked twice how it’s coming along.</p>';
    $('buyPack').onclick=buyPack;
    root.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{cardFilter=b.dataset.filter;renderRoom();});
    root.querySelectorAll('[data-card]').forEach(b=>{attachTilt(b.querySelector('.tilt'),{mouseOnly:true,max:20});b.onclick=()=>{cardFocus=b.dataset.card;renderRoom();};});
  }
  let packSeq=0;
  function buyPack(){
    try{const r=openPack(ctx.state());pack={id:++packSeq,pulls:r.pulls,refund:r.refund,stage:'sealed',index:0};ctx.commit({state:r.state});$('roomContent').scrollTop=0;ctx.speak('“you bought another one. i see. i am going to stand over here and not look.”','a small minister, very interested in the floor.');}catch(e){ctx.toast(e.message);}
  }

  function renderRoom(){
    followOutfit();const s=ctx.state();$('copperValue').textContent=s.copper;if(roomView!=='cards')delete $('roomContent').dataset.view;
    // a pack or a held card takes the whole panel, so the art can be as big as the screen allows
    $('roomPanel').classList.toggle('cards-immersive',roomView==='cards'&&Boolean(pack||cardFocus));
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
    }else if(roomView==='cards'){
      renderCards(s);
    }else if(roomView==='pantry'){
      $('roomContent').innerHTML='<div class="furnishing-grid">'+TREATS.map(t=>'<article class="furnishing-card"><span class="prop-icon">'+icon(t.tray==='tea'?'tea':'bun')+'</span><h2>'+esc(t.name)+'</h2><p class="effect-note">'+esc(t.description)+'</p><button data-treat="'+t.id+'">'+t.price+' copper · buy'+(s.pantry[t.id]?' · '+s.pantry[t.id]+' kept':'')+'</button></article>').join('')+'</div><p class="shop-note">treats appear in the feed and tea trays. each is a big comfort, and a little extra bond.</p>';
      document.querySelectorAll('[data-treat]').forEach(b=>b.onclick=()=>{try{const next=buyTreat(ctx.state(),b.dataset.treat);ctx.commit({state:next});ctx.toast(TREATS.find(t=>t.id===b.dataset.treat).name+' · into the pantry');renderRoom();}catch(e){ctx.toast(e.message);}});
    }else{
      $('roomContent').innerHTML='<div class="furnishing-grid">'+ITEMS.filter(i=>i.kind==='furnishing').map(item=>{const owned=s.owned.includes(item.id),placed=s.placed.includes(item.id);return '<article class="furnishing-card '+(placed?'is-placed':'')+'"><span class="prop-icon prop-'+item.id+'"><img src="./assets/prop-'+item.id+'.webp" alt=""></span><h2>'+esc(item.name)+'</h2><p class="effect-note">'+esc(item.effect)+'</p><button data-furnishing="'+item.id+'">'+(owned?placed?'put away':'place in courtyard':item.price+' copper · buy')+'</button></article>';}).join('')+'</div><p class="shop-note">tap a placed object in the courtyard to hear what he thinks.</p>';
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
  const KEEPSAKE_PROPS=[{id:'secondcup',chapter:'tea'},{id:'petal',chapter:'rain'},{id:'stone',chapter:'game'},{id:'poem',chapter:'lamp'},{id:'lanterns',chapter:'lotus'},{id:'sealtwo',chapter:'beside'},{id:'jade',chapter:'jade'}];
  function renderDecor(){
    // a thirsty orchid droops until watered; the chime stirs when he has something to show you
    const s=ctx.state(),thirsty=orchidThirsty(s),stirring=Boolean(momentDue(s));
    $('roomDecor').innerHTML=s.placed.map(id=>{const i=ITEMS.find(x=>x.id===id),flag=id==='orchid'&&thirsty?' thirsty':id==='chime'&&stirring?' stirring':'';return '<button class="room-object object-'+id+flag+'" data-object="'+id+'" aria-label="'+(flag===' thirsty'?'water the orchid':'inspect '+esc(i.name))+'"><img src="./assets/prop-'+id+'.webp" alt=""></button>';}).join('');
    document.querySelectorAll('[data-object]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.object;
      if(id==='orchid'&&orchidThirsty(ctx.state())){ctx.commit(waterOrchid(ctx.state()));ctx.speak('“ah. it was being very diplomatic about its thirst. thank you.”','a little water, and the orchid lifts its head.');ctx.ping('tea');return;}
      if(id==='chime'&&momentDue(ctx.state())){openMomentSheet();return;}
      ctx.speak(ITEMS.find(i=>i.id===id).reaction,'a little corner that feels more like home.');ctx.ping('tea');
    });
    $('paperClutter').hidden=s.tidied;
    const ribbon=RIBBONS.find(r=>r.id===s.memories.ribbon);$('ribbonTie').hidden=!ribbon||s.asleep;if(ribbon)$('ribbonTie').src='./assets/prop-ribbon-'+ribbon.id+'.webp';
    // each lantern evening leaves something behind in the courtyard; the finished poem takes the stand if he has one
    const kept=KEEPSAKE_PROPS.filter(k=>chapterRecord(s,k.chapter).complete&&!(k.chapter==='lamp'&&s.placed.includes('scroll')));
    $('keepsakes').innerHTML=kept.map(k=>'<img class="keepsake-prop keepsake-'+k.id+'" src="./assets/prop-'+k.id+'.webp" alt="">').join('');
    $('roomDecor').querySelector('.object-scroll img')?.setAttribute('src','./assets/prop-'+(chapterRecord(s,'lamp').complete?'poem':'scroll')+'.webp');
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

  $('roomSegments').querySelectorAll('button').forEach(b=>b.onclick=()=>{roomView=b.dataset.roomView;pack=null;cardFocus=null;renderRoom();});
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
