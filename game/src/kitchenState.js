// Yatai Rush — kitchen state: tickets, cook timers, bowl assembly, serving.
// The model. Rendering lives in renderer.js; input in input.js.
window.Y = window.Y || {};

Y.newState = function () {
  const s = {
    mode: 'playing',
    frozen: false,
    banner: true,
    timeLeft: Y.CONFIG.SHIFT_SECONDS,
    elapsed: 0,
    score: 0, tips: 0, served: 0, perfectCooks: 0, burned: 0,
    streak: 0, bestStreak: 0, stars: 3,
    tickets: [], nextTicketId: 1,
    activeTicket: null,
    bowl: null,
    boiler: [null, null],
    griddle: [null, null, null],
    carried: null,
    ready: null,
    popups: [], particles: [],
    shake: 0,
    spawnTimer: Y.CONFIG.SPAWN_FIRST,
    mouse: { x: 640, y: 360 },
    muted: false,
    stamp: ''
  };
  Y.spawnTicket(s, 'shoyu');
  Y.spawnTicket(s, 'miso');
  Y.spawnTicket(s, 'tonkotsu');
  return s;
};

Y.resetState = function (s) {
  const fresh = Y.newState();
  Object.keys(fresh).forEach(function (k) { s[k] = fresh[k]; });
};

// Cook zone for a station item: cooking (amber) -> perfect (green 2.5s)
// -> burning (flashing red) -> burnt (charred, must be trashed).
Y.zoneOf = function (kind, t) {
  const c = Y.CONFIG;
  const cook = c.COOK[kind];
  if (t < cook) return { zone: 'cooking', frac: t / cook };
  if (t < cook + c.PERFECT_WINDOW) return { zone: 'perfect', frac: 1 };
  if (t < cook + c.PERFECT_WINDOW + c.BURN_WINDOW) return { zone: 'burning', frac: 1 };
  return { zone: 'burnt', frac: 1 };
};

Y.multiplier = function (s) {
  return s.streak > 0 ? Math.min(1 + s.streak, Y.CONFIG.STREAK_CAP) : 1;
};

Y.spawnTicket = function (s, dishId) {
  const c = Y.CONFIG;
  const dish = dishId || Y.DISH_ORDER[Math.floor(Math.random() * Y.DISH_ORDER.length)];
  const ramp = Math.min(1, s.elapsed / c.SHIFT_SECONDS);
  const max = c.PATIENCE_MAX + (c.PATIENCE_MIN - c.PATIENCE_MAX) * ramp;
  const ticket = { id: s.nextTicketId++, dish: dish, patience: max, max: max };
  s.tickets.push(ticket);
  if (s.activeTicket === null) s.activeTicket = ticket.id;
  return ticket;
};

Y.activeDish = function (s) {
  if (s.bowl) return s.bowl.dish;
  const t = s.tickets.find(function (x) { return x.id === s.activeTicket; });
  return t ? t.dish : null;
};

Y.selectTicket = function (s, id) {
  s.activeTicket = id;
  Y.Audio.tick();
};

Y.trayClick = function (s, trayId) {
  const tray = Y.TRAYS.find(function (t) { return t.id === trayId; });
  if (!tray) return;
  if (tray.kind === 'cook') {
    const slots = tray.station === 'boiler' ? s.boiler : s.griddle;
    const free = slots.indexOf(null);
    if (free === -1) {
      Y.Audio.buzz();
      Y.addPopup(s, 255, 400, 'STATION FULL', '#D93829', 20);
      return;
    }
    slots[free] = { kind: trayId, t: 0, countedBurn: false };
    Y.Audio.tick();
    return;
  }
  const dish = Y.activeDish(s);
  if (!dish) { Y.Audio.buzz(); return; }
  Y.addStep(s, Y.stepForTray(trayId, dish), false);
};

Y.cauldronClick = function (s, brothId) {
  const dish = Y.activeDish(s);
  if (!dish) { Y.Audio.buzz(); return; }
  if (Y.RECIPES[dish].broth !== brothId) {
    Y.Audio.buzz();
    Y.addPopup(s, 545, 380, 'WRONG BROTH', '#D93829', 20);
    return;
  }
  Y.addStep(s, 'broth', false);
};

Y.addStep = function (s, step, perfect) {
  const dish = Y.activeDish(s);
  if (!dish) {
    Y.Audio.buzz();
    Y.addPopup(s, 685, 420, 'PICK A TICKET', '#D93829', 20);
    return false;
  }
  const recipe = Y.RECIPES[dish];
  if (recipe.steps.indexOf(step) === -1) {
    Y.Audio.buzz();
    Y.addPopup(s, 685, 420, 'NOT NEEDED', '#D93829', 20);
    return false;
  }
  if (!s.bowl) s.bowl = { dish: dish, steps: {}, perfect: false };
  if (s.bowl.steps[step]) {
    Y.Audio.buzz();
    return false;
  }
  s.bowl.steps[step] = true;
  if (perfect) s.bowl.perfect = true;
  Y.Audio.tick();
  if (recipe.steps.every(function (st) { return s.bowl.steps[st]; })) {
    Y.moveBowlToPass(s);
  }
  return true;
};

Y.moveBowlToPass = function (s) {
  if (!s.bowl || s.ready) return;
  const recipe = Y.RECIPES[s.bowl.dish];
  if (!recipe.steps.every(function (st) { return s.bowl.steps[st]; })) return;
  let ticket = s.tickets.find(function (t) { return t.id === s.activeTicket && t.dish === s.bowl.dish; });
  if (!ticket) ticket = s.tickets.find(function (t) { return t.dish === s.bowl.dish; });
  s.ready = { dish: s.bowl.dish, ticketId: ticket ? ticket.id : null, perfect: s.bowl.perfect };
  s.bowl = null;
  Y.Audio.chime();
  Y.addPopup(s, 1000, 420, 'READY!', '#2E9E5B', 26);
};

Y.pickFromStation = function (s, slots, i) {
  const item = slots[i];
  if (!item) return;
  if (s.carried) {
    Y.Audio.buzz();
    Y.addPopup(s, 685, 420, 'HANDS FULL', '#D93829', 20);
    return;
  }
  const z = Y.zoneOf(item.kind, item.t);
  if (z.zone === 'cooking') {
    Y.Audio.buzz();
    Y.addPopup(s, 685, 420, 'STILL COOKING', '#F4A922', 20);
    return;
  }
  slots[i] = null;
  if (z.zone === 'burnt') {
    s.carried = { kind: item.kind, perfect: false, burnt: true };
    Y.Audio.thud();
    return;
  }
  s.carried = { kind: item.kind, perfect: z.zone === 'perfect', burnt: false };
  if (z.zone === 'perfect') Y.Audio.ding();
  else Y.Audio.tick();
};

Y.basketClick = function (s, i) { Y.pickFromStation(s, s.boiler, i); };

// One-line summary for the debug handle and playtests.
Y.stateSummary = function (s) {
  return {
    mode: s.mode, score: s.score, served: s.served, streak: s.streak,
    stars: s.stars, timeLeft: Math.round(s.timeLeft),
    tickets: s.tickets.map(function (t) { return t.dish + ':' + Math.round(t.patience); }),
    bowl: s.bowl ? s.bowl.dish + ':' + Object.keys(s.bowl.steps).join(',') : null,
    ready: s.ready ? s.ready.dish : null,
    carried: s.carried ? s.carried.kind + (s.carried.burnt ? ':burnt' : '') : null
  };
};
Y.slotClick = function (s, i) { Y.pickFromStation(s, s.griddle, i); };

Y.bowlClick = function (s) {
  if (!s.carried) return;
  if (s.carried.burnt) {
    Y.Audio.buzz();
    Y.addPopup(s, 685, 420, 'BURNT — TRASH IT', '#D93829', 20);
    return;
  }
  if (Y.addStep(s, s.carried.kind, s.carried.perfect)) s.carried = null;
};

Y.trashClick = function (s) {
  if (s.carried) {
    s.carried = null;
    Y.Audio.thud();
    Y.addPopup(s, 1200, 200, 'DUMPED', '#D93829', 20);
    return;
  }
  if (s.bowl && Object.keys(s.bowl.steps).length > 0) {
    s.bowl = null;
    Y.Audio.thud();
    Y.addPopup(s, 685, 420, 'BOWL DUMPED', '#D93829', 20);
  }
};

Y.serveClick = function (s) {
  if (!s.ready) { Y.Audio.buzz(); return; }
  const c = Y.CONFIG;
  const ready = s.ready;
  const recipe = Y.RECIPES[ready.dish];
  const ticket = s.tickets.find(function (t) { return t.id === ready.ticketId; });
  const frac = ticket ? Math.max(0, ticket.patience / ticket.max) : 0;
  const onTime = frac > 0.5;
  if (onTime) {
    s.streak += 1;
    s.bestStreak = Math.max(s.bestStreak, s.streak);
  } else {
    s.streak = 0;
  }
  const mult = Y.multiplier(s);
  const tip = Math.round(frac * c.TIP_MAX * (ready.perfect ? c.PERFECT_TIP_BONUS : 1));
  const points = (recipe.base + tip) * mult;
  s.score += points;
  s.tips += tip * mult;
  s.served += 1;
  if (ready.perfect) s.perfectCooks += 1;
  if (ticket) s.tickets.splice(s.tickets.indexOf(ticket), 1);
  if (s.activeTicket === ready.ticketId) {
    s.activeTicket = s.tickets.length ? s.tickets[0].id : null;
  }
  s.ready = null;
  Y.Audio.bell();
  Y.addPopup(s, 1000, 400, '+¥' + points + (ready.perfect ? ' PERFECT!' : '') + (mult > 1 ? ' x' + mult : ''), '#F4A922', 30);
  Y.moveBowlToPass(s);
  if (s.tickets.length === 0) s.spawnTimer = Math.min(s.spawnTimer, 2);
};

Y.tick = function (s, dt) {
  const c = Y.CONFIG;
  Y.updateParticles(s, dt);
  if (s.mode !== 'playing' || s.frozen) return;
  s.elapsed += dt;
  s.timeLeft -= dt;
  if (s.shake > 0) s.shake = Math.max(0, s.shake - dt);
  if (s.timeLeft <= 0) {
    s.timeLeft = 0;
    s.mode = 'over';
    s.stamp = Y.rankFor(s.score);
    Y.Audio.chime();
    return;
  }
  // Ticket spawns, faster as the shift wears on.
  s.spawnTimer -= dt;
  if (s.spawnTimer <= 0 && s.tickets.length < c.MAX_TICKETS) {
    Y.spawnTicket(s);
    const ramp = Math.min(1, s.elapsed / c.SHIFT_SECONDS);
    s.spawnTimer = c.SPAWN_FIRST + (c.SPAWN_MIN - c.SPAWN_FIRST) * ramp;
  }
  // Patience decay; expiry shatters the streak and costs a star.
  for (let i = s.tickets.length - 1; i >= 0; i--) {
    const t = s.tickets[i];
    t.patience -= dt;
    if (t.patience > 0) continue;
    s.tickets.splice(i, 1);
    s.streak = 0;
    s.stars = Math.max(0, s.stars - 1);
    s.shake = c.SHAKE_MS / 1000;
    Y.Audio.buzz();
    Y.addPopup(s, 400, 60, 'TICKET LOST — STREAK BROKEN', '#D93829', 24);
    if (s.activeTicket === t.id) {
      s.activeTicket = s.tickets.length ? s.tickets[0].id : null;
    }
  }
  // Cook timers; burning items smoke, burnt items count against the shift.
  const stations = s.boiler.concat(s.griddle);
  stations.forEach(function (item) {
    if (!item) return;
    item.t += dt;
    const z = Y.zoneOf(item.kind, item.t);
    if (z.zone === 'burning' && Math.random() < dt * 6) {
      Y.spawnSmoke(s, item.px || 640, item.py || 275);
    }
    if (z.zone === 'burnt' && !item.countedBurn) {
      item.countedBurn = true;
      s.burned += 1;
    }
  });
};
