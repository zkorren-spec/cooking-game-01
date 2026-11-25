// Yatai Rush — the four dishes, the six counter trays, the three cauldrons.
// Data only; no drawing and no state here.
window.Y = window.Y || {};

Y.RECIPES = {
  shoyu: {
    name: 'Shoyu Classic', base: 200, broth: 'shoyu', plate: 'bowl',
    steps: ['broth', 'noodles', 'narutomaki', 'scallions'],
    brothColor: '#6B3A1F', brothHi: '#8A5A2E'
  },
  miso: {
    name: 'Crimson Miso', base: 240, broth: 'miso', plate: 'bowl',
    steps: ['broth', 'noodles', 'egg', 'scallions'],
    brothColor: '#C23B1E', brothHi: '#E85A2A'
  },
  tonkotsu: {
    name: 'Charred Tonkotsu', base: 320, broth: 'tonkotsu', plate: 'bowl',
    steps: ['broth', 'noodles', 'chashu', 'egg', 'nori', 'narutomaki'],
    brothColor: '#F2E3C2', brothHi: '#FBF3DC'
  },
  gyoza: {
    name: 'Crispy Gyoza', base: 280, broth: null, plate: 'slate',
    steps: ['gyoza', 'scallions'],
    brothColor: null, brothHi: null
  }
};

Y.DISH_ORDER = ['shoyu', 'miso', 'tonkotsu', 'gyoza'];

// Human labels for recipe steps (tickets, hints, popups).
Y.STEP_LABELS = {
  broth: 'Broth', noodles: 'Noodles', narutomaki: 'Narutomaki', egg: 'Jammy Egg',
  chashu: 'Seared Chashu', nori: 'Nori', scallions: 'Scallions', gyoza: 'Seared Gyoza'
};

Y.stepsRemaining = function (dishId, steps) {
  return Y.RECIPES[dishId].steps.filter(function (st) { return !steps[st]; });
};

// Counter trays, hotkeys 1-6. kind: 'cook' goes to a station first,
// 'direct' drops straight into the active bowl.
Y.TRAYS = [
  { id: 'noodles', label: 'Noodle Nest', key: '1', kind: 'cook', station: 'boiler' },
  { id: 'chashu', label: 'Raw Chashu', key: '2', kind: 'cook', station: 'griddle' },
  { id: 'gyoza', label: 'Raw Gyoza', key: '3', kind: 'cook', station: 'griddle' },
  { id: 'narutomaki', label: 'Narutomaki', key: '4', kind: 'direct', step: 'narutomaki' },
  { id: 'egg', label: 'Jammy Egg', key: '5', kind: 'direct', step: 'egg' },
  { id: 'garnish', label: 'Scallion / Nori', key: '6', kind: 'direct', step: 'garnish' }
];

Y.CAULDRONS = [
  { id: 'shoyu', label: 'SHOYU', color: '#6B3A1F' },
  { id: 'miso', label: 'MISO', color: '#C23B1E' },
  { id: 'tonkotsu', label: 'TONKOTSU', color: '#F2E3C2' }
];

// The garnish tray serves scallions on most bowls and nori on tonkotsu.
Y.stepForTray = function (trayId, dishId) {
  if (trayId === 'garnish') return dishId === 'tonkotsu' ? 'nori' : 'scallions';
  return trayId;
};
