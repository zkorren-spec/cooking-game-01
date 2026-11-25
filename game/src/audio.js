// Yatai Rush — WebAudio synth bleeps. No audio files, no network.
window.Y = window.Y || {};

Y.Audio = (function () {
  let ctx = null;
  function ensure() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch (e) { ctx = null; }
    return ctx;
  }
  function tone(freq, dur, type, vol, when) {
    const ac = ensure();
    if (!ac) return;
    try {
      const t0 = ac.currentTime + (when || 0);
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(vol || 0.12, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      o.connect(g);
      g.connect(ac.destination);
      o.start(t0);
      o.stop(t0 + dur + 0.02);
    } catch (e) { /* audio is garnish, never fatal */ }
  }
  return {
    unlock: function () { ensure(); },
    tick: function () { tone(660, 0.07, 'square', 0.05); },
    ding: function () { tone(880, 0.18, 'sine', 0.12); tone(1320, 0.22, 'sine', 0.08, 0.07); },
    chime: function () {
      tone(523, 0.14, 'sine', 0.1);
      tone(659, 0.14, 'sine', 0.1, 0.09);
      tone(784, 0.22, 'sine', 0.1, 0.18);
    },
    bell: function () { tone(1175, 0.35, 'sine', 0.14); tone(1568, 0.3, 'sine', 0.08, 0.02); },
    buzz: function () { tone(160, 0.22, 'sawtooth', 0.08); },
    thud: function () { tone(90, 0.16, 'sine', 0.16); },
    sizzle: function () { tone(2400, 0.08, 'sine', 0.03); tone(3100, 0.06, 'sine', 0.02, 0.05); },
    fanfare: function () {
      tone(523, 0.16, 'sine', 0.12);
      tone(659, 0.16, 'sine', 0.12, 0.12);
      tone(784, 0.16, 'sine', 0.12, 0.24);
      tone(1047, 0.3, 'sine', 0.12, 0.36);
    }
  };
})();
