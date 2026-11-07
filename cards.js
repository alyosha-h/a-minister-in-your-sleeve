// collectible portrait cards, sold by the pack in the room. lin yan is aware they exist,
// claims to disapprove, and has opinions about every single one.
// sprite cards are always in the pool; painted portraits (assets/cards) join once you've shared that evening,
// so a pack never spoils an encounter you haven't had yet.
export const PACK_PRICE = 18, PACK_SIZE = 3, DUPLICATE_REFUND = 3;
export const RARITIES = {
  common:{name:'sketch',odds:1},
  // a card is the first tier its roll falls under, so per card: ~4% after dark, ~7% lanternlit, ~22% close study
  rare:{name:'close study',odds:.33},
  lanternlit:{name:'lanternlit',odds:.11},
  afterdark:{name:'after dark',odds:.04}
};
export const TIER_ORDER = ['afterdark','lanternlit','rare'];

export const CARDS = [
  // sketches: the small minister, from the household's private stock
  {id:'headpat',rarity:'common',name:'headpat, received',sprite:{frame:6,outfit:'official'},line:'“that was within regulations. barely. you may repeat it, for the record.”'},
  {id:'smirk',rarity:'common',name:'the smirk',sprite:{frame:9,outfit:'official'},line:'“i was not posing. this is simply what my face does when i am right.”'},
  {id:'fluster',rarity:'common',name:'caught looking',sprite:{frame:7,outfit:'official'},line:'“the hat slipped. my composure did not. please disregard the colour of my ears.”'},
  {id:'complaint',rarity:'common',name:'an official complaint',sprite:{frame:13,outfit:'official'},line:'“i object to this card. i object to it being so popular.”'},
  {id:'mouthful',rarity:'common',name:'mouth full, dignity intact',sprite:{frame:3,outfit:'official'},line:'“a minister may be painted eating. he may not be painted enjoying it this much.”'},
  {id:'nap',rarity:'common',name:'do not disturb',sprite:{frame:11,outfit:'official'},line:'“who let the painter in while i was asleep. …was it you. it was you.”'},
  {id:'hatless',rarity:'common',name:'no hat, no rules',sprite:{frame:0,outfit:'leisure'},line:'“hair down, collar loose. this card is not to leave the household.”'},
  {id:'morningtea',rarity:'common',name:'morning tea, robe optional',sprite:{frame:5,outfit:'leisure'},line:'“the robe is on. it is merely on in a relaxed capacity.”'},
  {id:'bedhead',rarity:'common',name:'bedhead',sprite:{frame:15,outfit:'leisure'},line:'“i have been informed this is the most traded card in the province. i am furious. i am also a little flattered.”'},
  {id:'stuffed',rarity:'common',name:'thoroughly fed',sprite:{frame:16,outfit:'leisure'},line:'“you are not to show this one to the ministry. or to anyone you wish to impress.”'},
  {id:'hello',rarity:'common',name:'good morning, you',sprite:{frame:14,outfit:'leisure'},line:'“i waved first. this is documented. you cannot pretend otherwise.”'},
  {id:'packed',rarity:'common',name:'packed exceptionally lightly',sprite:{frame:9,outfit:'travel'},line:'“the satchel holds a brush, a cake, and room for one more thing. guess.”'},
  {id:'roadflirt',rarity:'common',name:'points of interest',sprite:{frame:8,outfit:'travel'},line:'“and to my left, a very fine view. no — my left. you are looking at me again.”'},
  // close studies: quieter, closer portraits from around each evening
  {id:'collar',rarity:'rare',art:'cards/collar.webp',chapter:'tea',name:'the collar, slightly open',line:'“it is loose because the tea was hot. that is the only reason. stop looking at it. …you may look at it.”'},
  {id:'wetsilk',rarity:'rare',art:'cards/wetsilk.webp',chapter:'rain',name:'wet silk, regrettably',line:'“the umbrella was for you. the rain had other plans for my robe. i trust you are enjoying the garden.”'},
  {id:'nape',rarity:'rare',art:'cards/nape.webp',chapter:'ribbon',name:'the nape of his neck',line:'“a minister’s nape is a private matter of state. you have clearance. very limited clearance.”'},
  {id:'hands',rarity:'rare',art:'cards/hands.webp',chapter:'game',name:'hands, for reference',line:'“you were watching my hands instead of the board. this explains your opening.”'},
  {id:'afterhours',rarity:'rare',art:'cards/afterhours.webp',chapter:'lamp',name:'after hours',line:'“the lamp is low, and so, i will admit, is my guard.”'},
  {id:'closer',rarity:'rare',art:'cards/closer.webp',chapter:'lotus',name:'closer, please',line:'“the pavilion is very small and i am very tall. you will have to come closer. those are the rules.”'},
  {id:'thatsmile',rarity:'rare',art:'cards/thatsmile.webp',chapter:'beside',name:'that smile',line:'“i woke and you were there. this is simply the face that happened. the painter was told to hurry.”'},
  {id:'unguarded',rarity:'rare',art:'cards/unguarded.webp',chapter:'jade',name:'unguarded',line:'“the bathhouse is occupied. it is occupied by me. …you may stay. hand me the towel. no, the other towel. slowly.”'},
  // lanternlit: the grand portrait for each evening, foiled, and signed on the back
  {id:'lit-tea',rarity:'lanternlit',art:'cards/lit-tea.webp',chapter:'tea',name:'tea at his true height',line:'“the painter asked me to think of someone while i sat. you can see the result. it is very obvious.”'},
  {id:'lit-rain',rarity:'lanternlit',art:'cards/lit-rain.webp',chapter:'rain',name:'beneath one umbrella',line:'“he painted more rain than there was. i did not correct him. my sleeve was ruined in good company.”'},
  {id:'lit-ribbon',rarity:'lanternlit',art:'cards/lit-ribbon.webp',chapter:'ribbon',name:'the ribbon at his nape',line:'“the artist was very thorough about the ribbon. and the hands tying it. you will notice whose hands.”'},
  {id:'lit-game',rarity:'lanternlit',art:'cards/lit-game.webp',chapter:'game',name:'a game he intends to lose',line:'“commemorating a defeat. i wanted it on record that i was smiling the whole time.”'},
  {id:'lit-lamp',rarity:'lanternlit',art:'cards/lit-lamp.webp',chapter:'lamp',name:'stay until the lamp goes out',line:'“i look tired in this one. i look happy, too. the artist said the two are rarely painted together.”'},
  {id:'lit-lotus',rarity:'lanternlit',art:'cards/lit-lotus.webp',chapter:'lotus',name:'the lotus pavilion',line:'“the lanterns are brighter than in life. i am exactly as besotted.”'},
  {id:'lit-beside',rarity:'lanternlit',art:'cards/lit-beside.webp',chapter:'beside',name:'a place beside him',line:'“a limited run of one. it is yours. if anyone else obtains a copy, i will have them audited.”'},
  {id:'lit-jade',rarity:'lanternlit',art:'cards/lit-jade.webp',chapter:'jade',name:'the jade made whole',line:'“the last card. collectors keep these behind glass. i would rather you kept it in your sleeve.”'},
  // after dark: what the painter was asked to leave out of the official set
  {id:'ad-tea',rarity:'afterdark',art:'cards/ad-tea.webp',chapter:'tea',name:'the robe was in the way',line:'“the robe was in the way of the teapot. that is my official position. my unofficial position is that you are staring, and i am letting you.”'},
  {id:'ad-rain',rarity:'afterdark',art:'cards/ad-rain.webp',chapter:'rain',name:'wrung out',line:'“you said you were cold. i am demonstrating that nothing can be done about it, except standing very close.”'},
  {id:'ad-ribbon',rarity:'afterdark',art:'cards/ad-ribbon.webp',chapter:'ribbon',name:'tied, loosely',line:'“you tied it. i am merely declining to untie it. a minister knows when to yield.”'},
  {id:'ad-game',rarity:'afterdark',art:'cards/ad-game.webp',chapter:'game',name:'a forfeit, paid in full',line:'“i lost the robe on purpose. i would like that noted. i would like you to come and collect your winnings.”'},
  {id:'ad-lamp',rarity:'afterdark',art:'cards/ad-lamp.webp',chapter:'lamp',name:'the lamp went out',line:'“the lamp went out hours ago. i did not notice. i was occupied.”'},
  {id:'ad-lotus',rarity:'afterdark',art:'cards/ad-lotus.webp',chapter:'lotus',name:'the water is warm',line:'“the water is warm. i am not going to say it twice. …it is very warm.”'},
  {id:'ad-beside',rarity:'afterdark',art:'cards/ad-beside.webp',chapter:'beside',name:'nowhere else to look',line:'“there. now you cannot look anywhere else. i have considered this arrangement for some time.”'},
  {id:'ad-jade',rarity:'afterdark',art:'cards/ad-jade.webp',chapter:'jade',name:'room for two',line:'“there is room for two. the tub has been measured. by me. twice.”'}
];
export const CARD_IDS = CARDS.map(c=>c.id);
