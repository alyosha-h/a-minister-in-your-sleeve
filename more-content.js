import { conversations, story } from './content.js';

export const allConversations = [...conversations,
  {intro:'he has folded a tiny paper boat and set it beside the teapot. “for emergencies,” he explains. “the sort involving excessive tea.”',choices:[
    {label:'does it have room for two?',preference:'teasing',response:'“with sensible packing.” he considers the boat very seriously.\n\n“you may have to leave your official hat behind. i shall, of course, retain mine.”'},
    {label:'offer to make him a little sail.',preference:'gentle',response:'he watches your hands with quiet interest.\n\n“a fine vessel,” he says when you finish. “i shall credit you in the expedition report.”'},
    {label:'sit and watch the little boat together.',preference:'quiet',response:'the boat drifts in a shallow dish. for a while, neither of you asks it to go anywhere.\n\n“this is a very agreeable sort of journey,” he says.'}]},
  {intro:'“i am compiling a list of excellent things,” he announces. “warm tea. a dry sleeve. a sentence that finally says what you mean.”',choices:[
    {label:'a minister who fits in your sleeve?',preference:'teasing',response:'“a rare and distinguished category.”\n\nhe taps the page. “shall i add a person who is excessively pleased about it?”'},
    {label:'add having someone to share them with.',preference:'gentle',response:'his brush pauses over the paper.\n\n“yes,” he says. “that does improve the whole list, rather.”'},
    {label:'tell him one small thing you liked today.',preference:'quiet',response:'he writes it down with the care of an official record.\n\n“there. preserved against a difficult day.”'}]},
  {intro:'he peers over the edge of a book. “the author has spent four pages describing a garden. i respect his priorities.”',choices:[
    {label:'how many pages would you give this one?',preference:'teasing',response:'“the garden? two.” he glances up at you.\n\n“the company would require a separate volume.”'},
    {label:'read a little to him.',preference:'gentle',response:'he settles against the book while you read. the teasing gradually leaves his face.\n\n“another paragraph?” he asks, when you pause.'},
    {label:'share the quiet with him.',preference:'quiet',response:'he makes a careful fold in the corner of his page, then closes the book.\n\n“the garden is quite good enough without a description.”'}]},
  {intro:'“i have been practicing my handwriting at this size.” he shows you a page of exceptionally small characters. “an exercise in restraint.”',choices:[
    {label:'the speeches could use some restraint too.',preference:'teasing',response:'he gives you a wounded look that lasts almost half a second.\n\n“fortunately, i have a very patient audience.”'},
    {label:'tell him the work is beautiful.',preference:'gentle',response:'he looks back at the page as though you have changed it.\n\n“you think so?” he smooths one corner. “then you may keep this one.”'},
    {label:'watch the brush move.',preference:'quiet',response:'he slows the brush so you can follow each stroke.\n\n“there is no need to hurry a line,” he murmurs. “it knows when it has arrived.”'}]},
  {minStage:1,intro:'“i have received an invitation to a tiresome dinner,” he says. “a terrible inconvenience. i had hoped to spend the evening here.”',choices:[
    {label:'with the tea, obviously.',preference:'teasing',response:'“obviously.” his eyes meet yours.\n\n“the tea has been particularly good company lately.”'},
    {label:'i’d like you to stay.',preference:'gentle',response:'he smiles before he remembers to look composed.\n\n“then i shall write a very convincing refusal.”'},
    {label:'set a second cup beside him.',preference:'quiet',response:'he looks at the cups, then at you.\n\n“a persuasive argument. i concede.”'}]},
  {minStage:1,intro:'“you do a great deal for me,” he says, setting his brush down. “tell me one thing that would make today easier for you.”',choices:[
    {label:'keep being this cute.',preference:'teasing',response:'“an arduous responsibility.” the pink at his ears rather spoils the solemn delivery.\n\n“i shall do my best.”'},
    {label:'remind me that rest counts, too.',preference:'gentle',response:'his voice softens. “it does. even when the work is unfinished.”\n\nhe pats the space beside him. “you may take my professional opinion on this matter.”'},
    {label:'just stay here with me.',preference:'quiet',response:'“yes.” there is no joke in the answer.\n\nhe sets the brush aside and turns his full attention toward you.'}]},
  {minStage:2,intro:'he listens to the wind in the garden. “i used to think a quiet house was simply a house without visitors.”',choices:[
    {label:'have i ruined your theory?',preference:'teasing',response:'“quite thoroughly.”\n\nhe moves his cup closer to yours. “i find i do not object.”'},
    {label:'it can be quiet with someone you trust.',preference:'gentle',response:'he takes a moment before answering.\n\n“yes,” he says. “i am beginning to understand that.”'},
    {label:'offer him your hand.',preference:'quiet',response:'he rests both little hands against your finger.\n\nfor once, he leaves the explanation to the silence.'}]},
  {minStage:3,intro:'he catches you looking at the ribbon near his collar. “it is still perfectly serviceable. there is no reason to change it.”',choices:[
    {label:'no sentimental reason at all?',preference:'teasing',response:'“none that i am obliged to state in a public document.”\n\nhe looks up at you. “you may, however, draw your own conclusions.”'},
    {label:'i’m glad you kept it.',preference:'gentle',response:'“so am i.” the answer is quiet, and entirely unguarded.\n\nhe brushes a thumb over the silk.'},
    {label:'straighten it gently.',preference:'quiet',response:'he stands very still while you adjust the small loop.\n\n“there,” he murmurs. “just as you left it.”'}]}
];

export const chapterStories = {
  tea:story,
  rain:[
    {speaker:'the lantern',text:'the light opens onto a garden path. the air is cool and sweet with wisteria. lin yan is waiting at the far side of the doorway, full-sized again, his sleeve lifted in greeting.'},
    {speaker:'lin yan',text:'“an excellent afternoon for a walk,” he says.\n\nthe first drop lands on the back of his hand. he looks at the sky. “i may have spoken a little early.”'},
    {speaker:'beneath one umbrella',text:'rain gathers in the leaves. before you can turn back, he has an umbrella open above you both. the paper canopy glows amber in the lantern light.\n\n“closer,” he says. “unless you intend to test the weather personally.”'},
    {speaker:'you',text:'you step beneath the canopy. he shifts the umbrella toward you, careful to shelter your shoulder. a dark patch begins to spread along his own sleeve.\n\nhe appears not to notice.'},
    {speaker:'lin yan',text:'“there. a perfectly adequate arrangement.”\n\nhe is very close now. close enough that his shoulder brushes yours whenever the path narrows.',choice:'shelter',options:['you’re getting wet.','is this close enough?','take his offered arm.']},
    {speaker:'lin yan',branch:'shelter',variants:[
      '“a sleeve will dry.” he looks down at you, then tilts the umbrella a little farther your way.\n\n“you have wrapped me in enough blankets. allow me one turn at being useful.”',
      'he glances at the space between you.\n\n“almost,” he says, with considerably less composure than the answer requires. “the rain is rather determined.”',
      'his arm stills beneath your hand. then he draws it closer, just enough to settle you comfortably beside him.\n\n“yes,” he says softly. “that will do very well.”']},
    {speaker:'the garden',text:'you walk without any particular destination. rain taps on the paper above you. the path bends past a stand of bamboo and a low wall bright with moss.\n\nlin yan matches his pace to yours.'},
    {speaker:'lin yan',text:'“a colleague once wrote me six pages explaining why rain should be considered an administrative inconvenience.”\n\n“was he wrong?” you ask.\n\n“not entirely. but he had very poor company beneath his umbrella.”'},
    {speaker:'you',text:'you laugh. his eyes stay on your face a moment longer than necessary.\n\nhe looks away only when a wisteria petal lands on the edge of your sleeve.'},
    {speaker:'lin yan',text:'“hold still.”\n\nhe lifts the petal away with two fingers. for a moment, his hand hovers near yours. then he folds the little purple shape into a clean square of paper.'},
    {speaker:'you',text:'“an official record?” you ask.\n\n“of an entirely ordinary walk.”\n\nhe tucks the paper safely inside his robe. “one ought to keep a few.”'},
    {speaker:'the garden',text:'the rain begins to ease. beyond the wall, the roofs gleam. neither of you turns toward the study.\n\nthe umbrella is suddenly rather more shelter than the weather requires.'},
    {speaker:'lin yan',text:'“we could wait a little longer,” he suggests.\n\nhe studies the sky with an expression of great professional concern. “to be certain.”',choice:'goodbye',options:['stay until the rain passes.','suggest walking back slowly.']},
    {speaker:'lin yan',branch:'goodbye',variants:[
      '“a sensible precaution.” he finds a place beneath the wisteria where you can stand together.\n\nhis hand settles lightly over yours on his arm. neither of you remarks on it.',
      '“slowly,” he agrees at once.\n\nhe chooses the longer path. you notice; he knows you notice. the small smile he gives you makes an explanation unnecessary.']},
    {speaker:'you',text:'at the study door, he pauses to shake the water from the canopy. his hair is a little damp at the temples. he looks happy in a way that has nothing to do with the weather.'},
    {speaker:'lin yan',text:'“next time,” he says, “i shall consult the sky before making recommendations.”\n\nthen, as the lantern begins to glow: “although i cannot promise to regret this one.”'},
    {speaker:'home again',text:'the little courtyard returns. a folded paper rests beside his cup. inside it is the wisteria petal, pressed carefully flat.\n\nlin yan looks up at you and adjusts a perfectly dry sleeve.'},
    {speaker:'lin yan',text:'“if it rains again,” he says, “you know where to find shelter.”\n\nhe smiles. “i shall keep the umbrella ready.”',ending:true}
  ],
  ribbon:[
    {speaker:'the lantern',text:'morning light fills the study when the lantern opens. lin yan is seated by the window with his hair loose and his official hat set aside.\n\nthere is a comb on the table, and a small box of silk ribbons.'},
    {speaker:'lin yan',text:'“i appear to require assistance.”\n\nhe lifts a short, untidy lock at the nape of his neck. “the last knot has developed opinions about whether it wishes to remain tied.”'},
    {speaker:'you',text:'you stand behind him. from here, he looks unexpectedly quiet: the turn of his neck, the soft collar of his robe, the hair he has not quite managed to smooth.\n\nhe hands you the comb.'},
    {speaker:'lin yan',text:'“gently, if you please.”\n\nyou barely touch his hair before he adds, “that was an entirely unnecessary instruction. you are always gentle.”'},
    {speaker:'you',text:'three ribbons wait in the box. rose silk, soft as the wisteria at dusk; blue, like a clear morning; and a narrow length of warm gold.\n\n“which would you like?” he asks.',choice:'color',options:['rose silk.','blue silk.','gold silk.']},
    {speaker:'lin yan',branch:'color',variants:[
      '“rose.” he considers his reflection, then your hands.\n\n“a rather conspicuous choice.” the pink at his ears suggests he is not complaining.',
      '“blue,” he repeats. “a very good color.”\n\nhe smiles a little. “although i believe you have already noticed my opinion on that subject.”',
      '“gold?” he glances over his shoulder, amused and pleased.\n\n“you have decided i should be easier to find in a crowd. a practical consideration.”']},
    {speaker:'you',text:'you gather the small tuft of hair and loop the {{ribbon}} around it. he sits very still. the room holds the quiet scrape of bamboo leaves against the window.\n\n“too tight?” you ask.'},
    {speaker:'lin yan',text:'“no.”\n\nhe answers softly enough that you look up. in the polished bronze on the table, you can see him watching your reflection.'},
    {speaker:'you',text:'you loosen one strand that has caught beneath the silk. your fingertips brush the back of his neck.\n\nhe draws a small breath, then laughs at himself.'},
    {speaker:'lin yan',text:'“i am very good at letting people see the finished result.”\n\nhis fingers rest on the edge of the table. “less practiced at this part.”',choice:'comfort',options:['you don’t have to be perfectly composed.','you can trust me with the untidy parts.','finish the knot, quietly.']},
    {speaker:'lin yan',branch:'comfort',variants:[
      'he lowers his eyes, smiling.\n\n“a dangerous suggestion. you may discover that i am not perfectly composed at all.”\n\n“i have suspected it,” you tell him.',
      'for a moment, he has no answer ready.\n\nthen his hand comes to rest over yours at the edge of the table. “i think,” he says, “that i already do.”',
      'you finish the knot without asking him to explain the feeling.\n\nhis shoulders ease. after a while, he turns his head just enough to lean into the last light touch of your hand.']},
    {speaker:'the study',text:'the knot sits neatly at his nape. you smooth the ends of the {{ribbon}}, then step around where he can see you.\n\nhe looks as though he would like to ask you not to move very far.'},
    {speaker:'lin yan',text:'“well?”\n\n“very distinguished,” you say.\n\n“i was hoping for that.” he touches the silk with one finger. “among other things.”'},
    {speaker:'you',text:'he reaches for his hat, then changes his mind. for the rest of the visit, it stays on the table.\n\nyou drink your tea by the window, close enough that his sleeve lies against yours.'},
    {speaker:'lin yan',text:'“you must tell me if the knot comes loose again.”\n\nhe pauses. “or if you simply think it ought to be retied.”\n\nthe invitation is transparent. he knows it, and lets it remain so.'},
    {speaker:'the lantern',text:'when the light gathers at the doorway, he walks you to it. his hand brushes the back of his neck once more.\n\n“i shall keep it this way,” he says. “for a while.”'},
    {speaker:'home again',text:'the tiny minister stands beside his cup. a small loop of {{ribbon}} is tucked carefully near his collar, where you can see it.\n\nhe catches you looking and turns a very unconvincing frown toward his papers.'},
    {speaker:'lin yan',text:'“it is perfectly serviceable,” he says.\n\nthen, more quietly: “and i like the way you tied it.”',ending:true}
  ],
  game:[
    {speaker:'the lantern',text:'the study is lit by one warm lantern. lin yan has cleared the low table and set out a board, two bowls of stones, and the cup that has become yours.\n\n“i thought we might play,” he says.'},
    {speaker:'lin yan',text:'“nothing terribly serious. i have already done quite enough serious thinking today.”\n\nhe waits until you sit opposite him before adding, “although i intend to be an extremely gracious winner.”'},
    {speaker:'you',text:'the first moves pass easily. he explains whatever you ask, and a few things you do not. outside, the garden darkens into violet.\n\nwhen you reach for a stone, his sleeve brushes your wrist.'},
    {speaker:'lin yan',text:'“your turn.”\n\nyou look down at the board. then at him. he is wearing a rather suspicious expression of innocence.\n\none of his groups has been left remarkably easy to surround.'},
    {speaker:'you',text:'“an extremely gracious winner?” you ask.\n\n“a flexible prediction.” he turns a white stone between his fingers.\n\nyou have a feeling the board is no longer the most important part of the evening.',choice:'bluff',options:['you’re letting me win.','play along with his terrible plan.','what does the winner receive?']},
    {speaker:'lin yan',branch:'bluff',variants:[
      '“an outrageous accusation.”\n\nhe considers the board for a full second before looking back at you. “i may have become distracted. the distinction is important.”',
      'you take the opening. he studies your move with an expression of admirable surprise.\n\n“excellent,” he says. the warmth in his voice makes it clear that he means something larger than the stone.',
      'the stone stops turning between his fingers.\n\n“a rematch,” he says at last. “at the same table. with the same company. i should hate to vary a successful arrangement.”']},
    {speaker:'the study',text:'you play on. he makes a better move this time, then spends longer than necessary deciding where to put the next one.\n\nyou begin to suspect he likes having a reason to keep you here.'},
    {speaker:'lin yan',text:'“you look pleased with yourself.”\n\n“i have a very generous opponent.”\n\n“you have a very good opponent.” his smile softens. “who is having a very good evening.”'},
    {speaker:'you',text:'the {{ribbon}} is still at his nape. he has not changed it. you notice the small familiar knot when he leans over the board, and he notices you noticing.'},
    {speaker:'lin yan',text:'“still perfectly serviceable,” he says, before you can ask.\n\nyou laugh. he gives up pretending that he is looking at the stones.'},
    {speaker:'the study',text:'your hands meet near the edge of the board. it is an accident at first: two people reaching for the same small space.\n\nthen neither of you moves away quite quickly enough.'},
    {speaker:'you',text:'his fingers are warm beside yours. he waits, the last white stone resting loosely in his other hand.\n\nfor once, he leaves the next move entirely to you.',choice:'touch',options:['brush his fingers with yours.','leave your hand beside his.']},
    {speaker:'lin yan',branch:'touch',variants:[
      'you let your fingers brush his. he turns his hand just enough to answer the touch.\n\nthe teasing in his expression gives way to something quieter. “yes,” he says, almost to himself.',
      'you leave your hand where it is. slowly, carefully, he moves his own closer until the sides of your little fingers rest together.\n\nhe smiles at the board as though it has finally explained itself.']},
    {speaker:'lin yan',text:'“we appear to have reached an unusual position.”\n\n“on the board?”\n\n“among other things.” his voice is steady now, but his cheeks are not cooperating.'},
    {speaker:'you',text:'the last moves scarcely matter. when the game ends, he puts the white stone in your hand and folds your fingers gently around it.\n\n“for the record,” he says.'},
    {speaker:'lin yan',text:'“you need not return it.”\n\nhe glances toward the lantern, which has begun to gather its light. “i have plenty of other reasons to ask you back.”'},
    {speaker:'home again',text:'the little courtyard feels especially quiet after the study. a smooth white stone rests beside your cup.\n\nlin yan looks up from the table, then moves his hand into easy reach of yours.'},
    {speaker:'lin yan',text:'“a rematch?”\n\nhe smiles before you can answer. “whenever you like. i am in no hurry to finish playing with you.”',ending:true}
  ]
};
