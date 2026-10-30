export const CHAPTERS = [
  { id:'tea', number:'01', title:'tea at his true height', bond:20, art:'tea-at-true-height.png', keepsake:'a second cup', icon:'tea', letter:'your place is still set', choices:{thanks:3,hand:2} },
  { id:'rain', number:'02', title:'beneath one umbrella', bond:70, art:'beneath-one-umbrella.png', keepsake:'a pressed wisteria petal', icon:'leaf', letter:'regarding the weather', choices:{shelter:3,goodbye:2} },
  { id:'ribbon', number:'03', title:'the ribbon at his nape', bond:150, art:'ribbon-at-his-nape.png', keepsake:'the ribbon you chose', icon:'ribbon', letter:'a very minor matter of appearance', choices:{color:3,comfort:3} },
  { id:'game', number:'04', title:'a game he intends to lose', bond:260, art:'game-he-intends-to-lose.png', keepsake:'a white game stone', icon:'stone', letter:'an invitation to a rematch', choices:{bluff:3,touch:2} }
];
export const REQUESTS = [
  {id:'company',title:'stay a little while',quote:'“this paragraph refuses to finish itself. perhaps it needs an audience.”',description:'share a conversation while he puts his thoughts in order.',actions:['talk'],cta:'sit with him',action:'talk'},
  {id:'warmth',title:'something warm, please',quote:'“an urgent matter. the kitchen seems to be rather far away.”',description:'offer him a bun, dumplings, or a warm cup of tea.',actions:['feed','tea'],cta:'bring a warm bite',action:'feed'},
  {id:'page',title:'the missing page',quote:'“the conclusion of my memorial has vanished. i am certain it was an excellent conclusion.”',description:'look beside the tea tray, under his book, and near the inkstone.',actions:['find'],cta:'help him look',action:'search'},
  {id:'match',title:'an impartial opponent',quote:'“i require someone clever enough to present a challenge. naturally, i thought of you.”',description:'play either scattered memorial or tea for two.',actions:['game'],cta:'play together',action:'games'},
  {id:'view',title:'a better view',quote:'“from here, the garden is mostly table. might i borrow your hand?”',description:'pick him up and let him see the courtyard from your palm.',actions:['pickup'],cta:'offer your hand',action:'pickup'},
  {id:'ink',title:'ink and sleeves',quote:'“the papers have organised a rebellion. i shall need assistance.”',description:'tidy his desk and rescue a little space for the teacups.',actions:['tidy'],cta:'tidy together',action:'tidy'},
  {id:'tea',title:'one cup, no paperwork',quote:'“i have a proposal. we ignore the correspondence until the tea is gone.”',description:'pour a cup of jasmine, lotus, or roasted rice tea.',actions:['tea'],cta:'put the kettle on',action:'tea'},
  {id:'rest',title:'a quiet evening',quote:'“i am not sleepy. i am simply examining the inside of my eyelids.”',description:'help him settle down for a proper rest.',actions:['rest'],cta:'tuck him in',action:'rest'}
];
export const ITEMS = [
  {id:'official',kind:'outfit',name:'the official robe',price:0,icon:'ribbon',description:'periwinkle silk. an impressive hat. considerable authority.'},
  {id:'leisure',kind:'outfit',name:'a morning at home',price:48,icon:'ribbon',description:'ivory silk, jade edging, and absolutely no official hat.'},
  {id:'travel',kind:'outfit',name:'the road to somewhere',price:72,icon:'ribbon',description:'deep teal, a little satchel, and the suggestion of an adventure.'},
  {id:'cushion',kind:'furnishing',name:'a silk cushion',price:24,icon:'cushion',description:'a very small luxury for a very important nap.',reaction:'“this is excellent. i may have to postpone several appointments.”'},
  {id:'orchid',kind:'furnishing',name:'a little orchid',price:30,icon:'orchid',description:'a small garden at the edge of his desk.',reaction:'“it is good company. never interrupts a sentence.”'},
  {id:'scroll',kind:'furnishing',name:'an evening poem',price:38,icon:'scroll',description:'a few original lines in his own untidy hand.',reaction:'“stay until the lamp is low / and call this little corner home.” he pretends to inspect the mounting.'},
  {id:'cup',kind:'furnishing',name:'a painted cup',price:20,icon:'tea',description:'blue leaves and a rim just right for tiny hands.',reaction:'“i shall need to test it. repeatedly. you may keep me company.”'},
  {id:'seal',kind:'furnishing',name:'his desk seal',price:28,icon:'seal',description:'a little piece of official dignity, restored.',reaction:'“at last. i may now issue properly authorised requests for dumplings.”'},
  {id:'chime',kind:'furnishing',name:'a wind chime',price:32,icon:'chime',description:'one soft note when the garden stirs.',reaction:'“listen. even the wind has decided to speak more gently here.”'}
];
export const RIBBONS = [{id:'rose',name:'rose silk',color:'#d995b5'},{id:'blue',name:'blue silk',color:'#8aaed7'},{id:'gold',name:'gold silk',color:'#d5b56e'}];
export const MEMORIALS = [
  {topic:'the village canal',parts:['the canal gate has broken, leaving two villages without water.','i inspected the bank; new timbers would allow repairs within three days.','i therefore request timber and twelve workers to begin the repairs.']},
  {topic:'the school library',parts:['the village school has more pupils than books.','the old county collection contains forty copies suitable for their lessons.','i ask that these copies be sent to the school before the autumn term.']},
  {topic:'a troublesome bridge',parts:['the bridge near the market is unsafe after the recent rain.','a local carpenter can replace its damaged planks by the end of the week.','i request permission to close the crossing while the work is done.']},
  {topic:'a particularly small minister',parts:['an official of some importance has become inconveniently small.','careful observation shows that warm meals and good company improve his condition.','i request that the present arrangements continue indefinitely.']}
];
export const TEA_CLUES = [
  {line:'“something fragrant, please. jasmine, perhaps. i like it gently brewed.”',leaf:'jasmine',steep:'brief'},
  {line:'“the lotus scent reminds me of the garden. let the leaves rest a little longer today.”',leaf:'lotus',steep:'rested'},
  {line:'“roasted rice, and a patient steep. the sort of cup you can take your time over.”',leaf:'rice',steep:'rested'}
];
export const LETTERS = {
  tea:'i have put the second cup beside mine. this is a practical arrangement: it will save me the trouble of finding it every time you visit.\n\ni thought you should know that the place by the window is still the best one.\n\n— lin yan',
  rain:'the umbrella has dried. my sleeve, eventually, has done the same.\n\ni am told there may be rain again this week. i offer this information without any particular motive.\n\nif you happen to be nearby, you know where to find me.\n\n— lin yan',
  ribbon:'the ribbon has proved entirely suitable. it stays where it is put, does not catch on my collar, and has attracted no comment from anyone whose opinion matters.\n\ni have kept it on today.\n\n— lin yan',
  game:'i have reviewed the final position. several alternative moves were available. i have decided not to explain them in writing.\n\na rematch would be the sensible way to settle the matter. same table. same company.\n\nthere is no need to return the white stone.\n\n— lin yan'
};
