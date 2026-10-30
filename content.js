export const conversations = [
  { intro: '“i have decided this courtyard is an acceptable temporary residence.” he pauses. “the company is… also acceptable.”',
    choices: [
      { label: 'only acceptable?', preference: 'teasing', response: '“i am a minister. we must leave room for improvement.”\n\nhe hides his smile behind one enormous sleeve. “perhaps you could stay and assist with the assessment.”' },
      { label: 'i’m glad you’re comfortable here.', preference: 'gentle', response: 'he looks down at the cushion you arranged for him.\n\n“you have been rather kind about all this.” a quieter smile. “i have noticed.”' },
      { label: 'sit beside him for a while.', preference: 'quiet', response: 'for once, he leaves the silence alone. he shuffles closer to your hand and returns to his book.\n\nwhen you begin to move, one little sleeve catches your finger.' }
    ] },
  { intro: '“a colleague has sent me seven pages explaining why he could not possibly have misplaced a seal.” he lifts a tiny eyebrow. “the seal was in his sleeve.”',
    choices: [
      { label: 'a dangerous place. full of ministers.', preference: 'teasing', response: 'he laughs so suddenly that his hat slips.\n\n“i will not be quoting you in the official response. privately, however, your insight is appreciated.”' },
      { label: 'shall i pour the tea while you answer?', preference: 'gentle', response: '“yes, please.” the answer comes without his usual protest.\n\nhe catches himself, then smiles. “i appear to be getting used to you.”' },
      { label: 'offer him your company while he writes.', preference: 'quiet', response: 'he makes space beside the page. the brush scratches softly for a while.\n\n“it is easier to do tiresome things when you are here,” he says, without looking up.' }
    ] },
  { intro: 'he is watching a petal float in his tea. “tell me something about your day. i have had quite enough of hearing my own voice.”',
    choices: [
      { label: 'it’s better now that i’m here.', preference: 'teasing', response: 'he opens his mouth, closes it, and looks rather pleased with the tea.\n\n“you cannot simply say things like that while i am drinking.”' },
      { label: 'a long day. i could use a little company.', preference: 'gentle', response: 'the teasing leaves his face. “then sit down.”\n\nhe pushes the little plate toward you. “nothing else is required of you here. we can be quiet for a while.”' },
      { label: 'tell him about one small, good thing.', preference: 'quiet', response: 'he listens with his chin in his hand, giving this small thing the attention of a matter of state.\n\n“i am glad,” he says. “we should keep track of those.”' }
    ] },
  { intro: '“i dreamed the talisman was repaired.” he straightens a fold of his robe. “the first thing i did was make tea. properly sized tea.”',
    choices: [
      { label: 'and who was the second cup for?', preference: 'teasing', response: 'his fingers stop on the fold.\n\n“an exceptionally impertinent guest.” he looks up at you. “i rather hope they will visit.”' },
      { label: 'i’d like to see your home.', preference: 'gentle', response: '“i would like that too.” there is no joke tucked into the answer.\n\n“there is a place by the window. the light is very good in the afternoon. i think you would like it.”' },
      { label: 'tell him you’ll help him get there.', preference: 'quiet', response: 'he reaches out and rests his hand against your finger.\n\n“i believe you,” he says. for a moment, his small voice sounds very steady.' }
    ] }
];

export const story = [
  { speaker: 'the lantern', text: 'the lantern brightens with a quiet, steady light. the courtyard falls still. beneath the silk shade, a doorway unfolds where there was only air.', pose: 'narrator' },
  { speaker: 'lin yan', text: '“well,” he says, looking from the light to you. “that is new.”\n\nhis hand reaches out. very small, very certain. “shall we find out?”' },
  { speaker: 'tea at his true height', text: 'you step through together. for a heartbeat there is the scent of rain on warm stone. then polished wood beneath your feet, a lattice window, the soft clink of porcelain. his study.', reveal: true },
  { speaker: 'you', text: 'lin yan stands beside the table. the same untidy hair, the same blue robe. but now you have to lift your eyes to meet his.\n\nhe is close enough that you can see him trying not to smile.' },
  { speaker: 'lin yan', text: '“before you say anything: this is my usual height.”\n\nhe takes the teapot from your hands, his fingers brushing yours. “i do not generally conduct affairs of state from a saucer.”' },
  { speaker: 'the study', text: 'his hat rests beside a stack of letters. outside the window, the wisteria is moving in the evening air. everything is familiar in a new proportion.\n\nhe pulls a cushion into the place beside his own.' },
  { speaker: 'lin yan', text: '“sit with me.”\n\nhe says it so naturally that you almost miss the small hesitation afterward. “there is something i have been meaning to do properly.”' },
  { speaker: 'you', text: 'he pours your tea first. at this distance, the dignified little speeches you have come to expect feel different. quieter. less like a performance.\n\nhis sleeve settles against your wrist.' },
  { speaker: 'lin yan', text: '“thank you.”\n\nhe looks directly at you. “for the meals. and the absurdly comfortable cushion. for staying when i was not being especially gracious.”', choice: 'thanks', options: ['you were quite a handful.', 'you don’t have to earn being cared for.', 'i liked having you close.'] },
  { speaker: 'lin yan', branch: 'thanks', variants: [
    '“a very small handful.” his mouth curves. “i was hoping my excellent conversation would compensate.”\n\nthen, more softly: “i am glad you stayed anyway.”',
    'he goes still for a moment. the answer he had prepared seems to leave him.\n\n“i shall have to remember that,” he says. “perhaps you might remind me, from time to time.”',
    'the pink at his ears deepens. “did you?”\n\nfor once, he makes no attempt to hide how pleased he is. “i was beginning to hope that was the reason.”'
  ] },
  { speaker: 'the study', text: 'the tea is fragrant and a little too hot. for a while, you talk about nothing urgent: the crooked branch outside, a poem he cannot finish, whether the courtyard cat is actually listening to him.\n\nhe keeps finding reasons to make you laugh.' },
  { speaker: 'lin yan', text: '“i had imagined this,” he admits at last.\n\n“not the lantern. certainly not the saucer.” he glances at the cup in your hands. “having you here. being able to pour the tea myself.”' },
  { speaker: 'you', text: 'you notice the second cup matches his own. it has a fine blue line beneath the rim. he follows your gaze and touches it with one finger.\n\n“that one can be yours,” he says.' },
  { speaker: 'the lantern', text: 'a thread of light gathers beside the door. neither of you speaks for a moment. the visit is ending.\n\nlin yan sets down his cup, then holds out his hand, palm open between you.' },
  { speaker: 'lin yan', text: '“come back.” his voice is gentle, but the invitation is plain.\n\n“even when we have repaired this ridiculous talisman. even when i no longer need rescuing from my own teapot.”', choice: 'hand', options: ['take his hand.', 'offer him your arm.'] },
  { speaker: 'you', branch: 'hand', variants: [
    'you put your hand in his. his fingers close around yours with a care that makes you suddenly aware of every point of contact.\n\nhe smiles as though you have answered a question he was afraid to ask.',
    'you offer your arm. after one startled, delighted glance, he links his own through it.\n\n“very proper,” he murmurs. “i see we shall have to be quite improper about how often we do this.”'
  ] },
  { speaker: 'lin yan', text: '“next time, i shall have something better prepared.”\n\nhe is still holding you when you reach the light. “although i cannot promise to improve the company. i am afraid you have already seen my best efforts.”' },
  { speaker: 'home again', text: 'the familiar courtyard returns around you. lin yan is small again, standing beside the tea tray. he looks up at you, and the smile is exactly the same.\n\na second cup now sits beside his own.' },
  { speaker: 'lin yan', text: '“well?” he settles his hat and clears his throat.\n\n“shall we leave your place set?”', ending: true }
];
