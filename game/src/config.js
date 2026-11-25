// Yatai Rush — palette, timings, layout. One place for every magic number.
window.Y = window.Y || {};
Y.CONFIG = {
  W: 1280,
  H: 720,
  SHIFT_SECONDS: 120,
  COLORS: {
    indigo: '#1B1F3B',
    cedar: '#C88446',
    cedarDark: '#9A6232',
    cream: '#FAF3E0',
    crimson: '#D93829',
    amber: '#F4A922',
    jade: '#2E9E5B',
    espresso: '#231917',
    steel: '#B9C0CC',
    steelDark: '#7E8794'
  },
  // Cook times (seconds) per station item: cooking phase, then the perfect
  // window, then the burning phase, then the item is burnt.
  COOK: { noodles: 3.0, chashu: 4.0, gyoza: 5.0 },
  PERFECT_WINDOW: 2.5,
  BURN_WINDOW: 3.0,
  PATIENCE_MAX: 42,
  PATIENCE_MIN: 30,
  MAX_TICKETS: 4,
  SPAWN_FIRST: 11,
  SPAWN_MIN: 7,
  STREAK_CAP: 5,
  PERFECT_TIP_BONUS: 1.25,
  TIP_MAX: 120,
  SHAKE_MS: 180,
  // Layout of the three bands (1280x720 logical canvas).
  LAYOUT: {
    ticketX: 20, ticketY: 12, ticketW: 195, ticketH: 108, ticketPitch: 212,
    hudX: 930, hudY: 12, hudW: 330, hudH: 108,
    boilerX: 40, boilerY: 180, boilerW: 290, boilerH: 190,
    basketCx: [120, 250], basketCy: 275, basketR: 52,
    cauldronCx: [420, 545, 670], cauldronCy: 275, cauldronR: 58,
    griddleX: 760, griddleY: 190, griddleW: 360, griddleH: 170,
    slotCx: [820, 940, 1060], slotCy: 275, slotR: 48,
    trashX: 1150, trashY: 210, trashW: 100, trashH: 140,
    trayX: [30, 180, 330], trayY: [410, 540], trayW: 140, trayH: 118,
    matX: 510, matY: 420, matW: 350, matH: 260,
    bowlCx: 685, bowlCy: 545, bowlR: 95,
    passX: 900, passY: 430, passW: 200, passH: 190,
    readyCx: 1000, readyCy: 525,
    bellCx: 1175, bellCy: 525, bellR: 42
  }
};

// Shift-end ranks, by final score.
Y.RANKS = [
  { min: 5000, title: 'MASTER CHEF' },
  { min: 2500, title: 'SOLID COOK' },
  { min: 0, title: 'LINE COOK' }
];

Y.rankFor = function (score) {
  for (let i = 0; i < Y.RANKS.length; i++) {
    if (score >= Y.RANKS[i].min) return Y.RANKS[i].title;
  }
  return 'LINE COOK';
};
