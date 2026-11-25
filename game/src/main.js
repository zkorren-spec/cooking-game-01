// Yatai Rush — game loop and wiring. Own code, written for this entry.
(function () {
  'use strict';
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const state = Y.newState();
  Y.shotFromURL(state);
  Y.Input.init(canvas, state);
  window.__game = state;
  window.__shot = function (n) { Y.applyShot(state, n); };
  let last = performance.now();
  let animT = 1.0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!state.frozen) {
      animT += dt;
      Y.tick(state, dt);
    }
    Y.render(ctx, state, animT);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
