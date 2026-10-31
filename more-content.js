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

// The middle of the romance: vulnerability, an honest admission, and a place made for you.
chapterStories.lamp = [
  {speaker:'the lantern',text:'the lantern opens late, onto a study lit by a single lamp. the brazier has gone cold. lin yan is at his desk, full-sized, still in his court robe, and he has not heard you arrive.'},
  {speaker:'you',text:'there is a memorial in front of him with a long red line through it. he is looking at it the way people look at something they have already read too many times.'},
  {speaker:'lin yan',text:'“ah.” he turns, and for a moment the polished minister arrives too late to cover the tired man. “you caught me at a poor hour. i was about to be very composed.”'},
  {speaker:'stay until the lamp goes out',text:'the lamp throws one warm circle across the desk and leaves the rest of the study to the dark. his hat lies on the floor where it fell, or was put.'},
  {speaker:'lin yan',text:'“the canal repairs,” he says. “twelve workers and some timber. the ministry has decided the villages can wait until spring.” he laughs, without much in it. “i argued very well. i was told i argued too well.”'},
  {speaker:'lin yan',text:'“i am supposed to be good at this.” he rubs his thumb along the red line. “some days i think i am only good at sounding as if i am.”'},
  {speaker:'you',text:'the lamp hisses softly. he is waiting to see what you will do with him like this.',choice:'comfort',options:['tell me what happened, from the beginning.','you don’t have to be brilliant tonight.','sit down beside him and say nothing.']},
  {speaker:'lin yan',branch:'comfort',variants:[
    'so he does. all of it: the meeting, the colleague who smiled the whole way through, the moment he knew he had lost.\n\nyou listen. when he finishes, he looks surprised to find the telling is over, and that it helped.',
    'he stares at you. then something in his shoulders gives way, very quietly.\n\n“no,” he says. “i suppose i don’t.” he sets down the brush as though it weighed more than it should.',
    'you sit. after a while, without looking at you, he moves the memorial aside and leans until his shoulder rests against yours.\n\nneither of you mentions it.'
  ]},
  {speaker:'the study',text:'the lamp gutters and steadies. somewhere outside, a night bird tries one note and gives up. he has pushed the memorial off the edge of the desk entirely.'},
  {speaker:'lin yan',text:'“when i was small,” he says, “the other kind of small, a boy, i thought a minister’s house would feel like an achievement.”\n\nhe looks around the study. “it felt like an office with a bed in it. until recently.”'},
  {speaker:'you',text:'“until recently?”\n\nhe takes a breath like a man stepping off a ledge.'},
  {speaker:'lin yan',text:'“you are here,” he says simply, “and then this is a home. you leave, and it is an office again. i have tried to reason my way out of it. i am, as noted, very good at reasoning.”\n\na small, wrecked smile. “it did not work.”'},
  {speaker:'the study',text:'from the drawer he takes a sheet you recognise: the poem, four lines about a lamp left burning for someone late. there is a fifth line now, the ink newer than the rest.'},
  {speaker:'lin yan',text:'“it came to me a few days ago.” he doesn’t read it aloud. he hands it to you instead.\n\nthe last line reads: and find that someone kept a lamp for me.'},
  {speaker:'you',text:'the paper is warm from the drawer, or from his hands. the lamp is burning low.',choice:'lamp',options:['turn the lamp down, and stay.','leave it burning a little longer.']},
  {speaker:'lin yan',branch:'lamp',variants:[
    'you lower the wick until the room is only shapes and warmth. in the dark he finds your hand on the first try, as if he has known where it was all evening.\n\n“stay until it goes out,” he says. “that is all. just until then.”',
    'you leave it. by its light you watch him read the poem over your shoulder, mouthing the last line as if checking it is still true.\n\n“a little longer,” he agrees, and his head comes to rest, very lightly, against yours.'
  ]},
  {speaker:'lin yan',text:'when the lantern begins to gather at the door, the lamp is very low. he walks you there with the poem still in your hand.\n\n“keep it,” he says. “it was always going to be yours. i only needed the ending.”'},
  {speaker:'home again',text:'the little courtyard is quiet. lin yan is at his tiny desk, but he has pushed his papers aside. when he sees you, he sets down his brush at once.'},
  {speaker:'lin yan',text:'“you look tired,” he says. “sit down. today i am in charge of the tea.”',ending:true}
];
chapterStories.lotus = [
  {speaker:'the lantern',text:'the lantern opens onto water. a long wooden walk runs out over a lotus pond toward a pavilion with its lamps already lit. lin yan waits at the start of it, holding two paper lanterns folded into flowers.'},
  {speaker:'lin yan',text:'“the pavilion is the only place in the residence without a desk,” he says. “i checked. thoroughly.”\n\nhe hands you one of the paper lotuses. “there is a custom with these. i shall explain it badly when we get there.”'},
  {speaker:'the lotus pavilion',text:'the boards creak softly under you both. the leaves on either side are as wide as parasols, and the flowers have half closed for the evening, pale and pink in the lamplight. the air smells green and warm.'},
  {speaker:'you',text:'he walks closer than the path requires. when it narrows, he doesn’t fall behind. his sleeve brushes your hand, and then again, and the second time does not feel like an accident.'},
  {speaker:'lin yan',text:'“i have been thinking,” he says, “about honesty. as a policy.” he keeps his eyes on the pavilion ahead. “i have recommended it to a great many people. it seems unfair not to try it myself.”'},
  {speaker:'the pavilion',text:'inside, the lamps hang low and the water is all around. he kneels at the edge to set his paper lotus on the surface, lights the little wick inside it, and lets it go. it drifts away, glowing.'},
  {speaker:'lin yan',text:'“you make a wish,” he explains, badly, as promised. “or a confession. traditionally, nobody can tell which.”\n\nhe watches his float out of reach. “i have just done one of the two.”'},
  {speaker:'you',text:'you set yours on the water beside his. the two lights turn slowly, then drift together, nudging against the same lotus leaf, and stay there.'},
  {speaker:'lin yan',text:'he laughs under his breath at the lanterns, embarrassed. then he turns to you, and the laugh goes.\n\n“i am attracted to you,” he says. “there. a plain statement of fact, no decoration. i have been carrying it around for weeks like a seal i was afraid to use.”'},
  {speaker:'lin yan',text:'“i do not need anything from you because of it,” he adds quickly. “i only did not want to keep sitting beside you, pretending it was the cushion i liked.”',choice:'pace',options:['close the distance, and invite a kiss.','take his hand.','ask if you can take this slowly.']},
  {speaker:'lin yan',branch:'pace',variants:[
    'you step closer. he understands a moment after you do, and then he is the one who closes the last of the distance, carefully, as if he wants to leave you every chance to change your mind.\n\nyou don’t. the kiss is brief and very warm and tastes faintly of lotus tea. when it ends, he keeps his forehead against yours. “oh,” he says, which is not like him at all.',
    'you take his hand. he looks down at your joined fingers as if reading a document he has waited years to see signed.\n\n“yes,” he says. “that. exactly that.” his thumb moves once across your knuckles, slowly, and stays.',
    'his whole face softens. “of course,” he says, and means it. “slowly is a speed i am very good at. you have seen how long it takes me to finish a poem.”\n\nhe offers his arm, nothing more, and you take it, and that is plenty.'
  ]},
  {speaker:'the pavilion',text:'the paper lanterns have reached the far side of the pond, still together. on the bank, someone in the residence has begun to play a flute, badly, with great feeling.'},
  {speaker:'lin yan',text:'“that is my secretary,” he says. “i shall speak to him in the morning.”\n\nhe does not sound as though he will speak to him at all.'},
  {speaker:'you',text:'you stay until the pavilion lamps burn down to their last inch. he talks about nothing much: the carp, the flute, a childhood fear of frogs he swears you must never repeat. every so often he stops mid-sentence just to look at you.'},
  {speaker:'lin yan',text:'at the end of the walk, the lantern waits. he stops you with a hand at your sleeve.\n\n“thank you,” he says, “for letting me be honest. it was much less terrible than i feared.”'},
  {speaker:'home again',text:'the courtyard returns. lin yan is sitting on the rim of his teacup, and when he sees you he doesn’t straighten his robe or settle his hat. he simply smiles, with his whole face, before he can think better of it.'},
  {speaker:'lin yan',text:'“you’re here,” he says. “good. i missed you. that is also a plain statement of fact.”',ending:true}
];
chapterStories.beside = [
  {speaker:'the lantern',text:'the lantern opens, and for a moment you think it has failed: you are standing in the courtyard. the wisteria, the moon gate, the tea table.\n\nthen you understand. it is his courtyard, at its true size, and he is sitting at the table where you have fed him a hundred buns.'},
  {speaker:'lin yan',text:'“i wanted you to see it properly,” he says, rising. “the real one. this is where my residence was folded up from. it seemed only right that you should see it unfolded.”'},
  {speaker:'a place beside him',text:'everything is the size it should be. the teacup he used to sleep against is an ordinary cup. the cushion you bought him is an ordinary cushion, set in the best place by the window. on the table: two cups, one of them chipped.'},
  {speaker:'you',text:'it is very strange, and then it isn’t strange at all. you know every corner of this place. you have only never stood in it.'},
  {speaker:'lin yan',text:'“i am not good at doing things without a plan,” he says, “so i have made one. it is very short. it has a great many crossings-out.”\n\nhe takes a small square of folded paper from his sleeve, and doesn’t look at it.'},
  {speaker:'the courtyard',text:'he sits, and gestures to the place beside him. not across the table this time. beside. the second cup is already poured.'},
  {speaker:'lin yan',text:'he sets a small object between the cups: a seal carved from pale stone, with a red silk tassel. he turns it so you can see its face.\n\ntwo names are carved there, side by side. his, and yours.'},
  {speaker:'lin yan',text:'“a seal is a promise,” he says. “anything pressed with it is meant. i had this one made weeks ago, and then i hid it in a drawer, because i am a coward with excellent handwriting.”'},
  {speaker:'lin yan',text:'“the lantern brings you here and takes you back. i am grateful for it. but i find i do not want to be visited.” he swallows. “i want to be lived with. i want a life with you in it that does not end when the light gathers at the door. i want to know if you want that too.”',choice:'answer',options:['yes. of course yes.','only if you admit you’re sentimental.','press the seal into his palm, and close his hand.']},
  {speaker:'lin yan',branch:'answer',variants:[
    'you barely get the word out before he laughs, a startled, helpless sound, and then you are in his arms, and he is saying something into your hair that you can’t quite hear and don’t need to.',
    '“i am appallingly sentimental,” he says at once. “i have kept every pressed petal. i have a book of your visits. i named a cushion.” he is laughing, and very close to something else. “so. is that a yes?”\n\nyou tell him it is.',
    'you close his fingers around the seal with both your hands over his. he looks at them for a long time.\n\n“that is a yes,” he says, very softly, as if confirming a document. “i am going to keep that yes. i am going to keep it forever.”'
  ]},
  {speaker:'the courtyard',text:'for a while neither of you says anything useful. the tea goes cold. the cat appears on the wall, assesses the situation, and leaves, apparently satisfied.'},
  {speaker:'lin yan',text:'“i love you,” he says eventually, as if he has only now realised he never actually said it. “i should have opened with that. it was the first line on the plan. i crossed it out four times for being too obvious.”'},
  {speaker:'you',text:'you tell him you love him too. he goes quiet and pink and pleased in a way that makes him look, briefly, about nineteen.'},
  {speaker:'lin yan',text:'“may i call you something?” he asks. “something that isn’t for anyone else. i have a shortlist. it is also very short.”',choice:'name',options:['little lantern.','trouble.','dearest.']},
  {speaker:'lin yan',branch:'name',variants:[
    '“little lantern,” he says, trying it out. “you did, after all, light the way.” he looks absurdly pleased with himself. “i have been saving that one.”',
    '“trouble,” he agrees, delighted. “it is accurate. you have been nothing but trouble since the teacup.” he kisses your knuckles. “my favourite kind.”',
    '“dearest,” he says, and then has to look away for a moment, because saying it out loud has turned out to be a great deal more than he expected.'
  ]},
  {speaker:'lin yan',text:'when the light gathers at the gate, he walks you there with your hand in his.\n\n“this is the last time i shall say goodbye properly,” he says. “from now on, it is only ‘see you soon’. that is the plan. it is the only line i did not cross out.”'},
  {speaker:'home again',text:'the little courtyard returns, exactly the same and entirely different. beside his tiny cup, lin yan has set the tiniest seal you have ever seen, its red tassel no longer than an eyelash.'},
  {speaker:'lin yan',text:'“welcome home,” he says. then, catching himself, quite deliberately: “no. i mean it. welcome home.”',ending:true}
];

// The finale: the talisman mends, and for the first time in years he gets to choose.
chapterStories.jade = [
  {speaker:'the lantern',text:'the light opens onto his study at dusk. on the table, on its square of cloth, lies the jade disc.\n\nthe crack is gone.'},
  {speaker:'lin yan',text:'“it finished mending this morning,” he says. “i watched the last of the line close. it took about as long as a cup of tea.”\n\nhe is standing by the window, at his full height, and he looks as if he has been waiting there for some time.'},
  {speaker:'the jade made whole',text:'the talisman is warm when you touch it, like a hand that has just let go of yours. the carving you could never quite make out is clear now: two cups, side by side.'},
  {speaker:'lin yan',text:'“my well-meaning colleague finally sent instructions.” he unfolds a letter, very small writing, very many apologies. “whole, it answers to whoever holds it. tall or small, as one pleases.”'},
  {speaker:'you',text:'he turns the jade over in his fingers.\n\n“which means the ministry will expect me back at my desk, at my usual height. and it means,” he adds, more slowly, “that i get to choose.”'},
  {speaker:'the study',text:'your cup sits on the table, chip turned toward the wall. the record of ordinary days lies beside it, closed. outside, the wisteria moves in the evening air.'},
  {speaker:'lin yan',text:'“i have spent a long time being chosen for things. appointed. summoned. assigned.”\n\nhe sets the jade down between you. “this is the first thing in years that is mine to decide. i find i want to ask you first.”'},
  {speaker:'you',text:'he waits. for once, he has not prepared a speech.',choice:'ask',options:['what do you want?','whatever you choose, i’m here.','say nothing. take his hand.']},
  {speaker:'lin yan',branch:'ask',variants:[
    '“what do i want.” he says it as though nobody has asked him in a very long time, which you suspect is true.\n\n“i want my work. i am good at it, and it matters.” he looks at you. “and i want the evenings. i want to know that the second cup is still out.”',
    'he lets out a breath. “i know. that is rather the trouble.” he smiles. “it is very hard to leave somewhere that keeps a place for you.”\n\n“so i shan’t,” he says. “not entirely.”',
    'your hand finds his. he looks down at it for a long moment, and his fingers close.\n\n“yes,” he says quietly, as if you had said a great deal. “that is what i thought too.”'
  ]},
  {speaker:'the study',text:'he picks up the jade and places it in your palm, then folds your fingers around it, the way he once folded them around a white stone.\n\n“you have kept me in your sleeve all this while. it seems only fair you keep this, too.”'},
  {speaker:'lin yan',text:'“the ministry may have me in the mornings, at my usual height. the rest of the time…”\n\nhe glances toward the lantern, toward the courtyard somewhere beyond it. “i have grown very fond of the view from the tea tray.”'},
  {speaker:'you',text:'the jade is warm in your hand. whatever you ask of it, he will be the one to answer.',choice:'stay',options:['then come back small. every evening.','stay tall a while longer. sit with me.']},
  {speaker:'lin yan',branch:'stay',variants:[
    '“every evening,” he agrees. “i shall be insufferable about it. i will expect dumplings.”\n\nhe is smiling so widely he has to look away. “i would not have it any other way.”',
    'he sits. not across from you: beside you, close enough that his sleeve lies over your wrist.\n\n“a while longer,” he agrees. the lantern can wait. for once, everything can.'
  ]},
  {speaker:'lin yan',text:'“there is one more thing.” he opens the record of ordinary days to its last page, dips his brush, and writes a single careful line.\n\nhe turns the book so you can read it: today, i chose.'},
  {speaker:'the lantern',text:'the light begins to gather at the door. he walks you to it with your hand in his, unhurried, the way people walk when they know they will be back.'},
  {speaker:'lin yan',text:'“thank you,” he says at the threshold. “for the cushion. the tea. the patience.” a pause. “for asking.”\n\nhe lets go of your hand last.'},
  {speaker:'home again',text:'the little courtyard returns. lin yan stands beside his cup, small again by his own choosing, the jade hanging from his belt on a length of {{ribbon}}.\n\nhe looks entirely at home.'},
  {speaker:'lin yan',text:'“good evening,” he says, as if he had never been anywhere else.\n\n“i saved you a seat. i always will.”',ending:true}
];

// How the evening sounds depends on how you've usually spent time with him.
// The written text is the gentle version; these replace it for teasing and quiet company.
const toneVariants = {
  tea: {
    6: {
      teasing: '“sit. before you say something clever about my height again.”\n\nhe pats the cushion with great dignity, then spoils it by smiling. “there is something i have been meaning to do properly. i would prefer an audience that is not laughing.”',
      quiet: 'he doesn’t say anything at first. he only looks at the cushion, then at you, and waits.\n\nwhen you sit, he lets out a breath. “good,” he says. “there is something i have been meaning to do properly.”'
    },
    16: {
      teasing: '“next time, i shall have something better prepared.”\n\nhe is still holding you when you reach the light. “and you will be on your best behaviour. no remarks about saucers.” a pause. “a few remarks. i have grown used to them.”',
      quiet: '“next time,” he begins, and then doesn’t finish.\n\nhe is still holding you when you reach the light. it seems to be the whole of what he meant to say, and you find you understood it anyway.'
    }
  },
  rain: {
    7: {
      teasing: '“a colleague once wrote me six pages arguing that rain is an administrative inconvenience.”\n\n“and you’re about to tell me he was wrong.”\n\n“i was about to tell you he never had to share an umbrella with someone who steps in every puddle on purpose.” he tilts the canopy to cover you anyway.',
      quiet: 'for a while neither of you says anything. the rain does the talking: on the paper, in the leaves, on the stones ahead.\n\n“i used to dislike this sound,” he says eventually. “i think i was only ever listening to it alone.”'
    },
    15: {
      teasing: '“next time,” he says, “i shall consult the sky before making recommendations.”\n\n“you’ll do no such thing.”\n\n“no,” he admits, as the lantern begins to glow. “i shall consult you, and you will tell me to bring the umbrella, and i will forget. deliberately.”',
      quiet: 'he shakes the last drops from the canopy and doesn’t open the door just yet.\n\n“thank you for the walk,” he says, as the lantern begins to glow. it is a very ordinary thing to say. he says it as if it isn’t.'
    }
  },
  ribbon: {
    3: {
      teasing: '“gently, if you please. i have seen how you fold napkins.”\n\nyou tug one strand, very lightly, on purpose. he makes an outraged little sound that turns, halfway through, into a laugh.',
      quiet: 'he doesn’t give any instructions. he only bows his head a little, so the untidy lock is easier to reach.\n\nit is a small thing. it feels like being trusted with something much larger.'
    },
    14: {
      teasing: '“you must tell me if the knot comes loose again.”\n\n“it won’t. i tied it.”\n\n“then you must tell me if you would like to tie it anyway.” he lifts his chin. “i am a reasonable man. i accept invented emergencies.”',
      quiet: 'he touches the knot once, as if checking it is still there.\n\n“you could retie it,” he says. “sometimes. if it ever needed it.” the way he says it, it needn’t need it at all.'
    }
  },
  lamp: {
    5: {
      teasing: '“i am supposed to be good at this.” he flicks the red line with one finger. “ask anyone. ask me. i shall give you a very persuasive answer.”\n\nthe joke doesn’t quite land, even for him.',
      quiet: 'he doesn’t explain at first. he only turns the memorial so you can see the red line, and lets you look at it with him, and that seems to be the explanation.'
    },
    16: {
      teasing: 'when the lantern begins to gather at the door, the lamp is very low. he walks you there with the poem still in your hand.\n\n“keep it,” he says. “and if you ever show it to the cat, i shall deny writing it.” a pause. “i wrote it. it is yours.”',
      quiet: 'when the lantern begins to gather at the door, the lamp is very low. he walks you there, presses the folded poem into your hand and closes your fingers over it.\n\nhe says nothing. it says enough.'
    }
  },
  lotus: {
    4: {
      teasing: '“i have been thinking,” he says, “about honesty as a policy. i have recommended it to a great many people.” he glances at you sideways. “they never thank me. i expect you won’t either.”',
      quiet: 'he says very little on the walk. it is a comfortable silence, and then a slightly less comfortable one: the kind that has something waiting at the end of it.'
    },
    14: {
      teasing: 'at the end of the walk, the lantern waits. he stops you with a hand at your sleeve.\n\n“thank you for letting me be honest,” he says. “i may do it again. you may find it becomes a habit. a terrible one.”',
      quiet: 'at the end of the walk, the lantern waits. he stops, says nothing, and lifts your hand to rest against his chest, where you can feel exactly how fast his heart is going.\n\nthen he lets you go, slowly.'
    }
  },
  beside: {
    4: {
      teasing: '“i have made a plan,” he says. “do not laugh. it is very short and has a great many crossings-out.”\n\nyou do not laugh. he looks almost disappointed. “you may laugh a little.”',
      quiet: 'he doesn’t explain. he only shows you a square of folded paper, worn soft at the creases, as though he has carried it for a long time, and puts it back in his sleeve.'
    },
    15: {
      teasing: 'when the light gathers at the gate, he walks you there with your hand in his.\n\n“this is the last time i shall say goodbye properly,” he says. “from now on i shall say ‘see you soon’, and be insufferable about it. you have been warned.”',
      quiet: 'when the light gathers at the gate, he walks you there with your hand in his. he doesn’t say goodbye at all. he presses his lips to your knuckles, then to the seal’s red tassel, and lets you go.'
    }
  },
  jade: {
    6: {
      teasing: '“i have spent a long time being chosen for things. appointed. summoned. assigned. once, memorably, volunteered by a cat.”\n\nhe sets the jade down between you. “this is the first thing in years that is mine to decide. naturally, i want a second opinion.”',
      quiet: 'he doesn’t explain at first. he only sets the jade down between you, and his hand stays near it, and near yours.\n\n“it is mine to decide,” he says eventually. “i wanted you here when i did.”'
    },
    15: {
      teasing: '“thank you,” he says at the threshold. “for the cushion. the tea. the endless commentary.” a pause. “mostly the commentary.”\n\nhe lets go of your hand last, and makes a point of it.',
      quiet: 'at the threshold he doesn’t say anything at all. he lifts your hand, the one holding the jade, and rests his forehead against your knuckles for a moment.\n\nthen he lets go, last.'
    }
  },
  game: {
    1: {
      teasing: '“nothing terribly serious. i have done quite enough serious thinking today.”\n\nhe waits until you sit opposite him. “i should warn you, i was provincial champion. of a very small province. in a very poor year.”',
      quiet: '“nothing serious,” he says. “i only wanted something for our hands to do while we sat here.”\n\nhe sets the bowl of black stones on your side, and the evening settles around the board.'
    },
    15: {
      teasing: '“you need not return it.”\n\nhe glances at the gathering lantern light. “consider it a deposit. i expect a rematch, and i expect you to lose with considerably less grace than i did.”',
      quiet: '“keep it,” he says.\n\nthe lantern begins to gather its light. he doesn’t look at it. he looks at your closed hand, and then at you, as if memorising the shape of the evening.'
    }
  }
};
for (const [id, beats] of Object.entries(toneVariants))
  for (const [i, tones] of Object.entries(beats)) chapterStories[id][i].tones = tones;
