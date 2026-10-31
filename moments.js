// Small scenes between the lantern chapters, one per real day at most, offered as bond grows.
// Each reply leans gentle, teasing or quiet, and feeds how he knows you.
export const MOMENTS = [
  { id:'cat', bond:60, title:'a frequent visitor',
    text:'a grey cat has settled on the wall above the tea tray. lin yan addresses it with great formality.\n\n“the memorial on canal repairs,” he tells it, “is in its third draft.” the cat closes its eyes. “it agrees. i find that reassuring.”',
    options:[
      {label:'it’s definitely taking notes.', style:'teasing', response:'“naturally. it reports directly to the emperor.” he lowers his voice. “i am trying to make a good impression.”'},
      {label:'maybe it just likes your voice.', style:'gentle', response:'he stops mid-sentence. “that is a very kind theory.” he glances at you, then away. “i shall continue reading. for the cat.”'},
      {label:'sit and watch it with him.', style:'quiet', response:'the three of you keep company with the afternoon. at some point he stops reading altogether, and nobody minds.'}
    ] },
  { id:'poem', bond:110, title:'one line missing',
    text:'among the official papers, a sheet in a looser hand. he tries to cover it with his sleeve, which is roughly the size of the poem.\n\n“it is unfinished,” he says. “the last line will not come. i have been asking it politely for a month.”',
    options:[
      {label:'read it to me?', style:'gentle', response:'he hesitates, then reads it: four lines about a lamp left burning for someone late. he stops where the fifth should be. “there. now you know the trouble.”'},
      {label:'have you tried asking it rudely?', style:'teasing', response:'“i am a minister. i do not negotiate rudely with poetry.” a pause. “i will try it tonight. do not tell anyone.”'},
      {label:'let him keep it covered.', style:'quiet', response:'you look at the cat instead. after a moment, his sleeve relaxes. “thank you,” he says, very quietly. “one day i will read it to you.”'}
    ] },
  { id:'talisman', bond:165, title:'the cracked jade',
    text:'he unwraps a small cloth and sets it on the table: a disc of green jade, finely carved, split by one dark crack.\n\n“this is why i am the size of a teacup,” he says. “a gift from a well-meaning colleague. it was meant to protect me from overwork.” he looks at it without much love. “it was very thorough.”',
    options:[
      {label:'does it hurt, being small?', style:'gentle', response:'“no.” he considers it more honestly. “it is lonely, sometimes. or it was.” he folds the cloth back over the crack. “less so lately.”'},
      {label:'so technically, you’re on holiday.', style:'teasing', response:'he opens his mouth to object, then closes it. “an enforced holiday,” he concedes. “with excellent dumplings. i shall have to write a complaint and a thank-you note.”'},
      {label:'touch the edge of the crack, carefully.', style:'quiet', response:'the jade is warm. he watches your finger follow the line. “it mends a little,” he says, “when i am well looked after. i have been noticing.”'}
    ] },
  { id:'capital', bond:300, title:'a letter from the capital',
    text:'a letter has arrived, sealed in red. he reads it twice, then sets it face down.\n\n“the ministry would like to know when i intend to return.” his tone is light. his hands are not. “i told them i am handling a matter of some delicacy.”',
    options:[
      {label:'are they wrong to want you back?', style:'gentle', response:'“no. there is work only i can do.” he turns his cup. “i am only discovering that i would like to be missed for other reasons, too.”'},
      {label:'is the delicate matter me?', style:'teasing', response:'“certainly not.” his ears go pink. “the delicate matter is the dumpling supply. you are a… related concern.”'},
      {label:'pour him more tea and say nothing.', style:'quiet', response:'he lets you. when the cup is full, he turns the letter over again, folds it small, and tucks it under the inkstone. out of sight, for today.'}
    ] },
  { id:'needle', bond:390, title:'a small repair',
    text:'there is a tear in the hem of his sleeve. he is attempting to thread a needle that, to him, is the length of a spear.\n\n“i have negotiated border treaties,” he says, squinting. “i refuse to be defeated by an eye this size.”',
    options:[
      {label:'offer to thread it for him.', style:'gentle', response:'he hands it over with tremendous reluctance and visible relief. you thread it in one try. “a fluke,” he says, and lets you hold the fabric while he stitches.'},
      {label:'suggest he declare war on it.', style:'teasing', response:'“do not tempt me.” he squares up to the needle. it takes four more tries. when it goes through, he looks at you as if you had personally cheered.'},
      {label:'hold the needle still so he can aim.', style:'quiet', response:'you steady it between two fingers. he threads it on the second try, then keeps hold of the thread a moment longer than necessary, your hands very close together.'}
    ] },
  { id:'court', bond:470, title:'before the courtyard',
    text:'the evening is cool. he has been quiet for a while.\n\n“at court, everyone wanted something,” he says. “a signature. a favour. a word in the right ear. i was very good at it.” he watches the lantern. “i did not have anyone to drink tea with. i had not noticed until i did.”',
    options:[
      {label:'you have someone now.', style:'gentle', response:'“yes.” he doesn’t hide from it this time. “i do.”'},
      {label:'i want something too, you know.', style:'teasing', response:'he looks wary. “what?” you point at the second bun. he laughs, properly, the kind that surprises him. “take it. take both. i am outnumbered.”'},
      {label:'move a little closer to him.', style:'quiet', response:'he notices. he doesn’t say anything, but he shifts too, until his shoulder rests against your hand, and stays there.'}
    ] },
  { id:'mending', bond:650, title:'a narrower crack',
    text:'he shows you the jade again. the crack is shorter now, a hairline where it used to be a seam.\n\n“at this rate,” he says, very evenly, “it will be whole before the plums are ripe.” he wraps it up again quickly. neither of you says what that might mean.',
    options:[
      {label:'that’s good news. isn’t it?', style:'gentle', response:'“it is.” he means it, and it costs him a little. “i only find that i have grown fond of the view from the tea tray.”'},
      {label:'i’ll miss carrying you in my sleeve.', style:'teasing', response:'“you will still be welcome to try,” he says. “it may be less convenient. i am told i am quite tall.” his smile wobbles, then holds.'},
      {label:'leave the cloth folded between you.', style:'quiet', response:'you both look at it for a while. then he pushes it gently aside and pours the tea, as if to say: not today. today is still ours.'}
    ] },
  { id:'brush', bond:760, title:'your name, in his hand',
    text:'“hold the brush like this.” he demonstrates with one entirely tiny brush, then guides yours with a hand on your knuckle.\n\nhe is teaching you to write your name. or rather, the characters he has chosen for it. “i thought about it for some time,” he admits. “they had to be right.”',
    options:[
      {label:'what do they mean?', style:'gentle', response:'“the first is ‘steady light’.” he touches the second, still wet. “the second does not translate well. ‘the place someone returns to.’ roughly.”'},
      {label:'mine look like a cat walked on them.', style:'teasing', response:'“the cat would be flattered.” he studies them seriously. “no. these are better. they are yours.” he takes the sheet to dry beside his own work.'},
      {label:'write them again, slowly, beside his.', style:'quiet', response:'he watches each stroke. when you finish, he doesn’t correct anything. he just sets your sheet next to his memorial, the two hands side by side.'}
    ] },
  { id:'moon', bond:860, title:'a sleepless night',
    text:'it is late. you find him at the edge of the table, legs dangling, looking up at the moon.\n\n“i am not sleepy,” he says, before you can ask. “i was thinking. about the talisman. about after.” he pats the wood beside him. “stay a moment?”',
    options:[
      {label:'tell him whatever happens, you’ll visit.', style:'gentle', response:'“even if i am very tall and very busy?” you nod. he lets out a breath he seems to have held for weeks. “then i shall stop worrying. mostly.”'},
      {label:'ask if the moon is taking notes too.', style:'teasing', response:'“the moon is extremely discreet.” he leans back on his hands. “the cat, however, has a big mouth.” he is smiling when he finally yawns.'},
      {label:'sit with him until he falls asleep.', style:'quiet', response:'it takes a long time. you don’t mind. at some point his head tips sideways against your thumb, and you stay very still.'}
    ] },
  { id:'chip', bond:1100, title:'the second cup',
    text:'your cup, the one with the blue line under the rim, has a small chip in it now. he discovered it this morning and has been unusually quiet about it.\n\n“i could have it replaced,” he says. “there is a potter in the capital.” he turns it so the chip faces him, not you. “i would rather not.”',
    options:[
      {label:'keep it. it’s ours.', style:'gentle', response:'“ours,” he repeats, as though trying the word out in a new hand. he sets the cup back in its place, chip and all.'},
      {label:'it has character now. like you.', style:'teasing', response:'“i shall choose to take that as a compliment.” he does, visibly. “very well. it stays. it has survived us this long.”'},
      {label:'run your thumb over the chip.', style:'quiet', response:'he watches you. “that is where it happened,” he says. “at our table. i suppose i want to remember that too.”'}
    ] },
  { id:'record', bond:1300, title:'an official record',
    text:'he hands you a slim bound book, very formal, very small. the cover reads: a record of ordinary days.\n\ninside, in his careful hand, is every visit. what you ate. what the weather did. one line each. some days just say: “they came. it was good.”',
    options:[
      {label:'you kept all of them?', style:'gentle', response:'“every one.” he looks unexpectedly shy. “one ought to keep a few. i found i could not choose which.”'},
      {label:'some of these entries are just ‘dumplings’.', style:'teasing', response:'“those were very significant days.” he tries to look stern and fails. “the record is accurate. i will not be taking questions.”'},
      {label:'read every page, slowly, while he waits.', style:'quiet', response:'he doesn’t interrupt. when you reach the last page, there is an empty line, already dated for tomorrow.'}
    ] }
];
