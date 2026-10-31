const ATLAS_SIZE = 1254;
const CELL_WIDTH = ATLAS_SIZE / 4;
const ROW_WINDOWS = [[0, 330], [330, 313], [643, 311], [954, 300]];

// The illustrated sheet is not a uniform grid: both pillows cross the
// fourth column's left edge. Keep them at the standing poses' pixel scale,
// and trim only the empty corner shared with the neighboring hat wings.
const SLEEP_WINDOW = {
  left: 900, width: 350, height: 250,
  clip: 'polygon(11.4286% 0,100% 0,100% 100%,0 100%,0 36%,11.4286% 36%)'
};

// Mood poses live on their own even strip per outfit: stuffed, peckish, drowsy.
export const MOOD_FRAMES = { stuffed: 16, peckish: 17, drowsy: 18 };
const MOOD_STRIP = { width: 939, height: 330, cell: 313 };
const sheetName = outfit => outfit === 'leisure' ? 'leisure' : outfit === 'travel' ? 'travel' : 'minister';

export function spriteFrameStyle(frame, outfit = 'official') {
  if (frame >= 16) {
    const { width, height, cell } = MOOD_STRIP, left = (frame - 16) * cell;
    return {
      backgroundImage: 'url("./assets/' + sheetName(outfit) + '-moods.webp")',
      width: '100%', height: '100%', left: '0%',
      backgroundSize: (width / cell * 100) + '% 100%',
      backgroundPosition: (left / (width - cell) * 100) + '% 0%',
      clipPath: 'none'
    };
  }
  const [top, height] = ROW_WINDOWS[Math.floor(frame / 4)];
  let view = { left: (frame % 4) * CELL_WIDTH, top, width: CELL_WIDTH, height, clip: 'none' };
  if (frame === 10) {
    // The right hat wing is high up; the pillow beside it is lower down.
    view.clip = 'polygon(0 0,96% 0,96% 46%,88% 46%,88% 100%,0 100%)';
  }
  if (frame === 14) view.clip = 'polygon(0 0,96% 0,96% 50%,88% 50%,88% 100%,0 100%)';
  if (frame === 12) view = { left:0, top:954, width:333, height:300, clip:'none' };
  if (frame === 11 || frame === 15) {
    view = { ...SLEEP_WINDOW, top: frame === 11 ? 700 : 1000 };
    if (frame === 15) view.clip = 'polygon(11.4286% 0,100% 0,100% 100%,0 100%,0 48%,11.4286% 48%)';
    if (outfit !== 'official') view.clip = frame === 11
      ? 'polygon(8.5714% 0,100% 0,100% 100%,0 100%,0 24%,8.5714% 24%)'
      : 'polygon(8.5714% 0,100% 0,100% 100%,0 100%,0 28%,8.5714% 28%)';
  }
  const sleeping = frame === 11 || frame === 15 || frame === 12;
  const width = sleeping ? view.width / CELL_WIDTH * 100 : 100;
  return {
    backgroundImage: 'url("./assets/' + sheetName(outfit) + '-sprites.webp")',
    width: width + '%',
    height: (sleeping ? view.height / CELL_WIDTH * 100 : 100) + '%',
    left: (100 - width) / 2 + '%',
    backgroundSize: (ATLAS_SIZE / view.width * 100) + '% ' + (ATLAS_SIZE / view.height * 100) + '%',
    backgroundPosition: (view.left / (ATLAS_SIZE - view.width) * 100) + '% ' + (view.top / (ATLAS_SIZE - view.height) * 100) + '%',
    clipPath: view.clip
  };
}
