// Yatai Rush — deterministic screenshot states (?shot=1|2|3|4&seed=1).
// Real renders of the game's own code with the clock paused.
window.Y = window.Y || {};

Y.applyShot = function (s, n) {
  Y.resetState(s);
  s.frozen = true;
  s.banner = false;
  s.muted = true;
  s.nextTicketId = 10;
  const mk = function (id, dish, frac) {
    return { id: id, dish: dish, patience: 42 * frac, max: 42 };
  };
  if (n === 1) {
    // Hero frame: mid-shift rush, everything on screen at once.
    s.timeLeft = 78;
    s.score = 2450;
    s.streak = 2;
    s.bestStreak = 2;
    s.stars = 3;
    s.tickets = [mk(1, 'shoyu', 0.8), mk(2, 'miso', 0.55), mk(3, 'tonkotsu', 0.75)];
    s.activeTicket = 2;
    s.boiler = [{ kind: 'noodles', t: 1.5, countedBurn: false }, null];
    s.griddle = [
      { kind: 'chashu', t: 2.0, countedBurn: false },
      { kind: 'chashu', t: 1.2, countedBurn: false },
      null
    ];
    s.bowl = { dish: 'miso', steps: { broth: true, noodles: true }, perfect: false };
    s.carried = { kind: 'egg', perfect: false, burnt: false };
    s.mouse = { x: 800, y: 470 };
    s.ready = { dish: 'shoyu', ticketId: 1, perfect: false };
  } else if (n === 2) {
    // Overcook tension: a perfect gyoza, a burning chashu, a red ticket.
    s.timeLeft = 44;
    s.score = 4120;
    s.streak = 3;
    s.bestStreak = 3;
    s.stars = 3;
    s.tickets = [mk(1, 'shoyu', 0.15), mk(2, 'miso', 0.6), mk(3, 'tonkotsu', 0.45), mk(4, 'gyoza', 0.8)];
    s.activeTicket = 3;
    s.boiler = [{ kind: 'noodles', t: 2.0, countedBurn: false }, null];
    s.griddle = [
      { kind: 'gyoza', t: 6.0, countedBurn: false },
      { kind: 'chashu', t: 8.0, countedBurn: false },
      null
    ];
    s.bowl = { dish: 'tonkotsu', steps: { broth: true, noodles: true, nori: true }, perfect: false };
    s.ready = { dish: 'gyoza', ticketId: 4, perfect: true };
    s.popups.push({ x: 1000, y: 400, text: '+360 PERFECT! x4', color: '#F4A922', size: 30, life: 1.6, max: 1.6 });
  } else if (n === 3) {
    // Multi-dish variety: chashu mid-transfer, checkmarks, x5 streak.
    s.timeLeft = 21;
    s.score = 5680;
    s.streak = 4;
    s.bestStreak = 4;
    s.stars = 2;
    s.tickets = [mk(1, 'tonkotsu', 0.7), mk(2, 'shoyu', 0.5), mk(3, 'miso', 0.35)];
    s.activeTicket = 1;
    s.boiler = [{ kind: 'noodles', t: 1.0, countedBurn: false }, null];
    s.griddle = [
      null,
      { kind: 'gyoza', t: 3.0, countedBurn: false },
      null
    ];
    s.bowl = { dish: 'tonkotsu', steps: { broth: true, noodles: true, nori: true }, perfect: false };
    s.carried = { kind: 'chashu', perfect: true, burnt: false };
    s.mouse = { x: 830, y: 420 };
    s.ready = { dish: 'miso', ticketId: 3, perfect: true };
  }
  if (n === 4) {
    // End-of-shift scorecard over a busy, live kitchen.
    s.mode = 'over';
    s.timeLeft = 0;
    s.score = 12480;
    s.tips = 6940;
    s.served = 15;
    s.perfectCooks = 12;
    s.bestStreak = 4;
    s.streak = 4;
    s.burned = 1;
    s.stars = 3;
    s.stamp = 'MASTER CHEF';
    s.tickets = [mk(1, 'shoyu', 0.6), mk(2, 'miso', 0.4), mk(3, 'tonkotsu', 0.8)];
    s.activeTicket = 1;
    s.boiler = [{ kind: 'noodles', t: 2.2, countedBurn: false }, null];
    s.griddle = [
      { kind: 'chashu', t: 3.0, countedBurn: false },
      { kind: 'gyoza', t: 6.5, countedBurn: false },
      null
    ];
    s.bowl = { dish: 'shoyu', steps: { broth: true, noodles: true }, perfect: false };
    s.ready = { dish: 'tonkotsu', ticketId: 3, perfect: true };
  }
};

Y.shotFromURL = function (s) {
  try {
    const q = new URLSearchParams(window.location.search);
    const n = parseInt(q.get('shot'), 10);
    if (n >= 1 && n <= 4) Y.applyShot(s, n);
  } catch (e) { /* no shot param, normal play */ }
};
