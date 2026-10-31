// Content and pure rules for the three little games. They get subtler as trust grows:
// tier 0 below 220 bond, tier 1 below 540, tier 2 after that.
export const gameTier = bond => bond < 220 ? 0 : bond < 540 ? 1 : 2;

// A deterministic 0..1 roll from any string, so a puzzle holds still within a day.
export function roll(key) {
  let h = 2166136261;
  for (const c of key) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  // finish with an avalanche step so keys differing in one character land far apart
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
const pick = (list, key) => list[Math.floor(roll(key) * list.length)];

// ---- scattered memorial: problem, evidence, plan, request. Tier 2 uses all four. ----
export const MEMORIAL_TOPICS = [
  { topic:'the village canal', parts:['the canal gate has broken, leaving two villages without water.','i inspected the bank myself; the old timbers have rotted through.','new timbers and twelve workers would see it repaired within three days.','i therefore request the timber and the workers, to begin at once.'] },
  { topic:'the school library', parts:['the village school has more pupils than books.','the teacher reports three children sharing every primer.','the old county collection holds forty suitable copies, unused.','i ask that these copies be sent to the school before the autumn term.'] },
  { topic:'a troublesome bridge', parts:['the bridge near the market is unsafe after the recent rain.','two planks gave way beneath a cart on the fifth day of the month.','a local carpenter can replace the damaged planks by the end of the week.','i request permission to close the crossing while the work is done.'] },
  { topic:'a particularly small minister', parts:['an official of some importance has become inconveniently small.','careful observation shows that warm meals and good company improve his condition.','a regular supply of dumplings has been arranged, along with a cushion.','i request that the present arrangements continue indefinitely.'] },
  { topic:'the eastern granary', parts:['the eastern granary roof leaks whenever it rains.','the clerk found damp in eleven sacks of rice this spring.','new tiles from the kiln at the crossroads would seal it before summer.','i ask for funds to buy the tiles and pay the roofers.'] },
  { topic:'the temple orchard', parts:['the temple orchard has not been pruned in three years.','the monks report half the usual harvest of plums.','two gardeners from the county seat could restore it in a season.','i request that the gardeners be lent to the temple until autumn.'] },
  { topic:'the hill road', parts:['the post road to the hills washes out every spring.','letters from the hill villages arrive up to a fortnight late.','a stone drain along the low stretch would keep the road dry.','i ask permission to hire stonemasons for the drain.'] },
  { topic:'the lantern festival', parts:['the lantern festival has no one to organise it this year.','the old organiser has retired to raise ducks.','the schoolteacher and two merchants have offered to share the work.','i request that they be given the festival budget, and my thanks.'] }
];
// lines that have no business in a memorial, however true
export const DECOYS = [
  { line:'may the emperor live ten thousand years, and also enjoy this memorial.', reply:'“correct, but the emperor has heard it before. perhaps leave it out this once.”' },
  { line:'the ministry tea has become noticeably weaker this season.', reply:'“a grave matter. for a separate memorial. a very strongly worded one.”' },
  { line:'i have been in unusually excellent company lately.', reply:'“true. but i would rather the ministry did not know about you. leave it out?”' },
  { line:'the cat on the courtyard wall has reviewed this proposal and approves.', reply:'“the cat’s endorsement is noted. the emperor may not value it as highly.”' },
  { line:'my brush is new and writes beautifully, which is relevant.', reply:'“it is a beautiful brush. it is not, sadly, relevant.”' },
  { line:'a colleague still owes me a seal, but that is another matter.', reply:'“it is another matter. so it belongs in another memorial.”' }
];
// key is anything stable for the sitting, e.g. day plus how many games played
export function memorialPuzzle(bond, key) {
  const tier = gameTier(bond), t = pick(MEMORIAL_TOPICS, key + ':topic');
  const answer = (tier === 2 ? [0, 1, 2, 3] : [0, 1, 3]).map(i => ({ id: 'p' + i, line: t.parts[i] }));
  const cards = [...answer];
  if (tier > 0) { const d = pick(DECOYS, key + ':decoy'); cards.push({ id: 'decoy', line: d.line, reply: d.reply }); }
  // shuffle with the same roll, so a re-render doesn't reshuffle under the player's finger
  const shuffled = cards.map((c, i) => ({ c, r: roll(key + ':card' + i) })).sort((a, b) => a.r - b.r).map(x => x.c);
  return { tier, topic: t.topic, cards: shuffled, answer: answer.map(c => c.id),
    hint: tier === 2 ? 'the problem, then the evidence, then the plan, then the request. nothing that isn’t business.' : tier === 1 ? 'the problem, then the evidence, then the request. and only the business.' : 'begin with the problem, then the evidence, then the request.' };
}
export const CLERK_RANKS = [[0,'a hopeful clerk'],[3,'a capable clerk'],[8,'a trusted secretary'],[15,'his right hand']];
export const clerkRank = perfects => [...CLERK_RANKS].reverse().find(([n]) => perfects >= n)[1];

// ---- tea for two: what he'd like follows his mood, or the hour when he's content ----
export const LEAVES = [['jasmine','jasmine'],['lotus','lotus'],['rice','roasted rice']];
export const STEEPS = [['brief','wake briefly'],['rested','rest a little'],['long','let it deepen']];
// each wish: the cup, then three clues from plain to subtle
export const TEA_WISHES = {
  drowsy:   { leaf:'rice', steep:'long', note:'when he’s drowsy', clues:['“roasted rice, steeped long and dark. i need to see the page properly.”','“something roasted. strong enough to argue with.”','“the characters keep wandering off the page.”'] },
  restless: { leaf:'lotus', steep:'rested', note:'when he’s restless', clues:['“lotus, rested a little. something to settle the administration.”','“something soft and floral, given a little time.”','“everything is slightly out of place today. including me.”'] },
  peckish:  { leaf:'rice', steep:'rested', note:'when he’s peckish', clues:['“roasted rice, a patient steep. it is almost a meal.”','“something toasty. the sort of cup that fills a corner.”','“is it nearly lunchtime? hypothetically.”'] },
  wistful:  { leaf:'jasmine', steep:'brief', note:'when he’s wistful', clues:['“jasmine, only just woken. something bright.”','“something fragrant and light. a little sunshine in a cup.”','“it is a quiet sort of day. i would not mind being cheered.”'] },
  stuffed:  { leaf:'lotus', steep:'brief', note:'when he’s overdone the dumplings', clues:['“lotus, barely steeped. i have no room for anything heavier.”','“something delicate. very, very light.”','“i may have been overly enthusiastic about lunch.”'] },
  morning:  { leaf:'jasmine', steep:'brief', note:'in the morning', clues:['“jasmine, quickly. the morning will not wait.”','“something bright and fragrant. quick about it.”','“there are seventeen letters waiting. i would like to face them awake.”'] },
  afternoon:{ leaf:'lotus', steep:'rested', note:'in the afternoon', clues:['“lotus, rested. the afternoon deserves it.”','“something floral, with a little patience.”','“the afternoon is long and the paperwork is longer.”'] },
  evening:  { leaf:'rice', steep:'rested', note:'in the evening', clues:['“roasted rice, a patient steep. for the evening.”','“something warm and toasty. the lanterns are being lit.”','“the day is nearly done. i would like it to end gently.”'] },
  night:    { leaf:'lotus', steep:'long', note:'late at night', clues:['“lotus, left to rest a long while. something for the moon.”','“something floral and deep. there is no hurry at all.”','“the night is long. so, for once, is my patience.”'] }
};
export function teaWishKey(mood, period) { return TEA_WISHES[mood] ? mood : period; }
export function judgeTea(wishKey, leaf, steep) {
  const w = TEA_WISHES[wishKey];
  return w.leaf === leaf && w.steep === steep ? 'perfect' : w.leaf === leaf ? 'close' : 'other';
}

// ---- the missing page: three usual places, plus anything you've furnished him with ----
export const SEARCH_SPOTS = [
  { id:'tray', label:'beside the tea tray', icon:'tea', hint:'“it smelled faintly of jasmine when i last saw it.”' },
  { id:'book', label:'under his book', icon:'journal', hint:'“i was reading at the time. or pretending to.”' },
  { id:'ink', label:'near the inkstone', icon:'seal', hint:'“there was ink on my sleeve afterward. that may mean something.”' },
  { id:'cushion', item:'cushion', label:'under the silk cushion', icon:'cushion', hint:'“i may have been napping. briefly. officially.”' },
  { id:'orchid', item:'orchid', label:'behind the orchid', icon:'orchid', hint:'“there was a petal on it. i remember thinking it looked decorative.”' },
  { id:'poem', item:'scroll', label:'tucked behind the poem', icon:'scroll', hint:'“it was near something else i had not finished.”' },
  { id:'cup', item:'cup', label:'inside the painted cup', icon:'tea', hint:'“it was near something i drink from. that narrows it down less than i hoped.”' },
  { id:'seal', item:'seal', label:'beneath his desk seal', icon:'seal', hint:'“i was feeling very official at the time.”' },
  { id:'chime', item:'chime', label:'under the wind chime', icon:'chime', hint:'“something rang, very softly, when i put it down.”' }
];
export function searchSpots(placed) { return SEARCH_SPOTS.filter(s => !s.item || placed.includes(s.item)); }
export function pageSpot(placed, day) { const spots = searchSpots(placed); return spots[Math.floor(roll('page:' + day) * spots.length)].id; }
