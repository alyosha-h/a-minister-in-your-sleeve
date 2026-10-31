// What he gets up to when nobody is asking anything of him. Each activity has a place in the
// courtyard, a resting pose, a caption and a few lines; `when` decides if it suits the moment.
export const SPOTS = {
  center: { left: 50, bottom: 13, scale: 1 },
  tea:    { left: 29, bottom: 12, scale: 1 },
  desk:   { left: 71, bottom: 12, scale: 1 },
  garden: { left: 54, bottom: 31, scale: .78 },  // the far edge of the table, looking out toward the moon gate
  cushion: { left: 73, bottom: 25, scale: .9 }   // on the silk cushion, when he has one
};

export const ACTIVITIES = [
  { id:'letters', spot:'desk', frame:12, caption:'sorting the morning correspondence.', weight:3,
    when:c=>c.period==='morning'||c.period==='afternoon',
    lines:['“eleven letters. nine complaints. one invitation. one recipe, sent to the wrong minister. i am keeping it.”','“this colleague writes as though ink were free. it is not. i have checked.”'] },
  { id:'tea', spot:'tea', frame:4, caption:'a cup of tea, held in both hands.', weight:3,
    lines:['“the second cup is warming. purely as a precaution.”','“tea first. then the empire.”'] },
  { id:'cricket', spot:'garden', frame:13, caption:'in a formal dispute with a cricket.', weight:2,
    when:c=>c.period!=='night'&&!c.rain,
    lines:['“the cricket has been asked, twice, to keep its voice down.”','“it is a matter of principle. also of volume.”'] },
  { id:'rainwatch', spot:'center', frame:0, caption:'watching the rain from under the eaves.', weight:6,
    when:c=>c.rain,
    lines:['“listen. it sounds like someone very patient tapping on the roof.”','“i have decided the rain is not an administrative inconvenience. i have reconsidered several things.”'] },
  { id:'stars', spot:'garden', frame:0, caption:'counting the stars over the moon gate.', weight:4,
    when:c=>c.period==='night'&&!c.rain,
    lines:['“i have counted forty-one stars. the forty-second keeps moving.”','“come and look. they are much the same size as me tonight.”'] },
  { id:'poem', spot:'desk', frame:12, caption:'working on a poem, and covering it when you look.', weight:2,
    when:c=>!c.chapters.lamp,
    lines:['“nothing. it is nothing. it is an inventory of rice.”','“one line short. it has been one line short for weeks.”'] },
  { id:'lamplight', spot:'desk', frame:12, caption:'writing by the evening lamp.', weight:2,
    when:c=>c.period==='evening',
    lines:['“the lamp makes everything look more important than it is. including me.”'] },
  { id:'orchid', spot:'tea', frame:0, caption:'admiring the orchid.', weight:3,
    when:c=>c.placed.includes('orchid')&&!c.orchidThirsty,
    lines:['“it has opened another flower. i have been told it is showing off. i approve.”'] },
  { id:'thirsty', spot:'tea', frame:13, caption:'frowning at a drooping orchid.', weight:6,
    when:c=>c.orchidThirsty,
    lines:['“the orchid is sulking. i suspect neglect. i suspect myself.”'] },
  { id:'cushion', spot:'cushion', frame:11, caption:'napping on the silk cushion. officially, resting his eyes.', weight:3,
    when:c=>c.placed.includes('cushion')&&c.energy<60&&c.period!=='morning',
    lines:['“mm. five more minutes. the empire can manage.”'] },
  { id:'chime', spot:'garden', frame:0, caption:'listening to the wind chime.', weight:2,
    when:c=>c.placed.includes('chime'),
    lines:['“one note, then another. it never repeats itself. i find that very restful in a colleague.”'] },
  // after the lantern evenings have changed things
  { id:'record', spot:'desk', frame:12, caption:'writing one line in the record of ordinary days.', weight:3,
    when:c=>c.moments.includes('record'),
    lines:['“today’s entry is very short. it says: they came. it was good. i may add a third sentence.”'] },
  { id:'twocups', spot:'tea', frame:4, caption:'setting out two cups, as usual.', weight:4,
    when:c=>c.chapters.beside,
    lines:['“two cups. i have stopped pretending one of them is spare.”'] },
  { id:'letter-you', spot:'desk', frame:12, caption:'writing you a letter you will receive in about four minutes.', weight:3,
    when:c=>c.chapters.jade,
    lines:['“do not read over my shoulder. it is addressed to you, which is not the same thing as being for you yet.”'] }
];

// he moved because he wanted to, so pick something new (and, where possible, somewhere new)
export function chooseActivity(ctx, currentId, rand = Math.random) {
  const pool = ACTIVITIES.filter(a => a.id !== currentId && (!a.when || a.when(ctx)));
  const total = pool.reduce((n, a) => n + a.weight, 0);
  let roll = rand() * total;
  for (const a of pool) if ((roll -= a.weight) <= 0) return a;
  return pool[0] || ACTIVITIES[1];
}
export const activityById = id => ACTIVITIES.find(a => a.id === id);
