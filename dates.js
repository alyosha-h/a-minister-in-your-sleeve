// After the jade is whole, he can be tall whenever he likes. These are evenings at his true height,
// repeatable, each set in a place the story already made yours. One choice each; styles feed the tally.
export const DATES = [
  { id:'window', title:'tea by the window', art:'tea-at-true-height.webp', nodes:[
    {speaker:'the study',text:'he has made the tea himself, at his true height, and is very pleased about it. the study smells of jasmine and ink.'},
    {speaker:'lin yan',text:'“the ministry sent eleven letters today. i answered four.” he hands you your cup, the chipped one. “the other seven can learn patience. it is a virtue. i read about it.”'},
    {speaker:'lin yan',text:'“tell me something,” he says. “anything. i have been looking forward to it all day.”',choice:'talk',options:['tell him about your day.','ask whether the seven letters deserve it.','just enjoy the quiet with him.'],styles:['gentle','teasing','quiet']},
    {speaker:'lin yan',branch:'talk',variants:['he listens the way he always does, chin in his hand, as if your day were a matter of state. when you finish, he says, “thank you,” and means for all of it.','“they deserve far worse,” he says happily. “one of them used three pages to say ‘no’. i have framed it.”','you drink your tea. he drinks his. at some point his foot finds yours under the table and stays there.']},
    {speaker:'lin yan',text:'“same time tomorrow,” he says, when the cups are empty. it isn’t a question.',ending:true}
  ]},
  { id:'rainwalk', title:'a walk in the rain', art:'beneath-one-umbrella.webp', nodes:[
    {speaker:'the garden',text:'it is raining, which he claims is a coincidence. the umbrella is already open. it is, you notice, the smaller of his two umbrellas.'},
    {speaker:'lin yan',text:'“the large one is being repaired,” he says. “it has been being repaired for some weeks. it will be repaired for some weeks more.”'},
    {speaker:'lin yan',text:'his sleeve is getting wet again. he does not seem to mind at all.',choice:'rain',options:['tilt the umbrella back toward him.','step in a puddle, deliberately.','walk slower.'],styles:['gentle','teasing','quiet']},
    {speaker:'lin yan',branch:'rain',variants:['he tilts it back toward you. you tilt it toward him. this continues for some time, and neither of you is dry, and neither of you cares.','“you are a menace,” he says, and steps in the next one himself, with tremendous ceremony.','he matches your pace without a word. the walk takes twice as long. you suspect that was the point all along.']},
    {speaker:'lin yan',text:'at the door he shakes out the umbrella. “a perfectly adequate arrangement,” he says, which is what he said the first time, and you both remember it.',ending:true}
  ]},
  { id:'pavilion', title:'the pavilion at dusk', art:'lotus-pavilion.webp', nodes:[
    {speaker:'the pavilion',text:'the lotus are open this evening. he has brought two paper lanterns again, folded a little more neatly than last time. he has been practising.'},
    {speaker:'lin yan',text:'“the gardener asked if i intend to make this a habit,” he says, lighting the wicks. “i told him i intend to make it a tradition. he said that is the same thing with better clothes.”'},
    {speaker:'lin yan',text:'the two lights go out across the water together, as they always seem to.',choice:'lantern',options:['make a wish.','ask what he wished for.','watch them, and lean on him.'],styles:['gentle','teasing','quiet']},
    {speaker:'lin yan',branch:'lantern',variants:['you close your eyes and wish. when you open them, he is watching you instead of the lanterns. “i hope it comes true,” he says. “i suspect i am in it.”','“a confession or a wish,” he reminds you. “nobody can tell which.” then, very quietly: “it was both. it is always both.”','he puts his arm around you without comment, as though it were simply where it goes now. it is.']},
    {speaker:'lin yan',text:'his secretary has started on the flute again, somewhere across the water. “i have given up,” lin yan says, and kisses your temple. “let him play.”',ending:true}
  ]},
  { id:'rematch', title:'a rematch', art:'game-he-intends-to-lose.webp', nodes:[
    {speaker:'the study',text:'the board is set. the white stone, the one he gave you, sits on your side of the table. he has polished it, by the look of it.'},
    {speaker:'lin yan',text:'“i have been studying,” he says, with tremendous seriousness. “i have read three books on strategy. i understood one of them.”'},
    {speaker:'lin yan',text:'twenty moves in, he leaves a group open again. it is very obvious.',choice:'move',options:['take it, gently.','call his bluff, again.','play somewhere else entirely.'],styles:['gentle','teasing','quiet']},
    {speaker:'lin yan',branch:'move',variants:['you take it. he sighs, enormously pleased. “a merciful victor. i am in good hands.”','“you are letting me win.” he puts his hand on his heart. “i am being strategic. the strategy is that i like your face when you win.”','you place your stone far from the trap. he looks at the board, then at you, and laughs. “you are not even playing,” he says. “you are just spending time with me.” “yes.” “good.”']},
    {speaker:'lin yan',text:'nobody counts the final score. it stays on the board overnight, and in the morning, neither of you lets the steward clear it away.',ending:true}
  ]},
  { id:'lamp', title:'a late lamp', art:'stay-until-the-lamp.webp', nodes:[
    {speaker:'the study',text:'it is late, and the lamp is low, and he is not working. he is sitting on the floor cushions with a book he has not turned a page of in some time.'},
    {speaker:'lin yan',text:'“i was waiting,” he admits, before you can ask. “i am allowed to say that now. i checked with myself.”'},
    {speaker:'lin yan',text:'he makes room on the cushion beside him.',choice:'stay',options:['read to him.','ask him to read to you.','sit until the lamp goes out.'],styles:['gentle','teasing','quiet']},
    {speaker:'lin yan',branch:'stay',variants:['you read aloud. he closes his eyes to listen, and by the third page his head has found your shoulder.','he reads beautifully, and then does all the voices, and the voices are terrible, and he knows it, and keeps going.','you sit. the lamp burns down slowly. it goes out the way it did the first time, and he finds your hand in the dark on the first try, the way he did the first time.']},
    {speaker:'lin yan',text:'“stay until it goes out,” he says. “that is all.” it has gone out. neither of you moves.',ending:true}
  ]},
  { id:'courtyard', title:'the courtyard, full size', art:'place-beside-him.webp', nodes:[
    {speaker:'the courtyard',text:'the courtyard at its true size, in late light. the cat is on the wall. two cups on the table. the seal, with both names, in its little dish beside them.'},
    {speaker:'lin yan',text:'“i still find it strange,” he says, “sitting here at this height. i keep expecting you to offer me a bun the size of my head.”'},
    {speaker:'lin yan',text:'he is sitting beside you. not across. beside.',choice:'home',options:['offer him a bun anyway.','tell him he was very cute small.','lean into his side.'],styles:['gentle','teasing','quiet']},
    {speaker:'lin yan',branch:'home',variants:['he takes it. it is a normal-sized bun. he eats it with enormous satisfaction and says it is the best one you have ever given him.','“i was dignified,” he corrects. then, after a long pause: “and cute. i have read my own record. i was very cute.”','he puts his arm around you and goes on watching the wisteria move, as if this is simply what evenings are. it is.']},
    {speaker:'lin yan',text:'“welcome home,” he says, as the light goes gold. he says it most evenings. it has not yet worn out.',ending:true}
  ]}
];
