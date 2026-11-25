// Yatai Rush — mouse + keyboard input. Hit-tests Y.hits (built by renderer)
// and dispatches to the kitchenState actions. Click-only, no drag-and-drop.
window.Y = window.Y || {};

Y.Input = (function () {
  function toCanvas(canvas, ev) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (ev.clientX - r.left) * (Y.CONFIG.W / r.width),
      y: (ev.clientY - r.top) * (Y.CONFIG.H / r.height)
    };
  }

  function findHit(x, y) {
    for (let i = Y.hits.length - 1; i >= 0; i--) {
      const h = Y.hits[i];
      if (h.shape === 'rect') {
        if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h;
      } else {
        const dx = x - h.cx, dy = y - h.cy;
        if (dx * dx + dy * dy <= h.r * h.r) return h;
      }
    }
    return null;
  }

  function dispatch(s, h) {
    if (!h) return;
    if (s.frozen) return;
    if (s.mode === 'over' && h.action !== 'again') return;
    switch (h.action) {
      case 'ticket': Y.selectTicket(s, h.arg); break;
      case 'tray': Y.trayClick(s, h.arg); break;
      case 'cauldron': Y.cauldronClick(s, h.arg); break;
      case 'basket': Y.basketClick(s, h.arg); break;
      case 'slot': Y.slotClick(s, h.arg); break;
      case 'bowl': Y.bowlClick(s); break;
      case 'bell': Y.serveClick(s); break;
      case 'trash': Y.trashClick(s); break;
      case 'banner-x': s.banner = false; break;
      case 'again': Y.resetState(s); break;
    }
  }

  return {
    init: function (canvas, s) {
      canvas.addEventListener('mousemove', function (ev) {
        const p = toCanvas(canvas, ev);
        s.mouse.x = p.x;
        s.mouse.y = p.y;
      });
      canvas.addEventListener('click', function (ev) {
        Y.Audio.unlock();
        const p = toCanvas(canvas, ev);
        s.mouse.x = p.x;
        s.mouse.y = p.y;
        dispatch(s, findHit(p.x, p.y));
      });
      window.addEventListener('keydown', function (ev) {
        if (ev.repeat) return;
        Y.Audio.unlock();
        if (s.frozen) return;
        if (ev.code === 'Space') {
          ev.preventDefault();
          if (s.mode === 'playing') Y.serveClick(s);
          return;
        }
        if (ev.code === 'KeyR') {
          Y.resetState(s);
          return;
        }
        if (ev.code === 'KeyX') {
          if (s.mode === 'playing') Y.trashClick(s);
          return;
        }
        if (ev.code === 'Enter') {
          s.banner = false;
          return;
        }
        const n = parseInt(ev.key, 10);
        if (n >= 1 && n <= 6 && s.mode === 'playing') {
          Y.trayClick(s, Y.TRAYS[n - 1].id);
        }
        if (ev.code === 'F1' || ev.code === 'F2' || ev.code === 'F3' || ev.code === 'F4') {
          ev.preventDefault();
          Y.applyShot(s, parseInt(ev.code.slice(1), 10));
        }
      });
    }
  };
})();
