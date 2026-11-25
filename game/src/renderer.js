// Yatai Rush — all canvas drawing. Chunky inked 2.5D vector, procedural only.
// No images, no emoji, no external assets. Builds Y.hits every frame.
window.Y = window.Y || {};
Y.hits = [];

(function () {
  const C = Y.CONFIG.COLORS;
  const L = Y.CONFIG.LAYOUT;

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function ink(ctx, w) {
    ctx.lineWidth = w || 3;
    ctx.strokeStyle = C.espresso;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  function shadow(ctx, x, y, rx, ry) {
    ctx.fillStyle = 'rgba(27, 31, 59, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function hitRect(x, y, w, h, action, arg) {
    Y.hits.push({ shape: 'rect', x: x, y: y, w: w, h: h, action: action, arg: arg });
  }
  function hitCircle(cx, cy, r, action, arg) {
    Y.hits.push({ shape: 'circle', cx: cx, cy: cy, r: r, action: action, arg: arg });
  }

  function drawStar(ctx, x, y, r, filled) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 === 0 ? r : r * 0.45;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const px = x + Math.cos(a) * rad;
      const py = y + Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = filled ? C.amber : 'rgba(250, 243, 224, 0.18)';
    ctx.fill();
    ink(ctx, 2);
  }

  function drawFlame(ctx, x, y, s, color) {
    ctx.fillStyle = color || C.amber;
    ctx.beginPath();
    ctx.moveTo(x, y - 14 * s);
    ctx.bezierCurveTo(x + 10 * s, y - 4 * s, x + 8 * s, y + 8 * s, x, y + 12 * s);
    ctx.bezierCurveTo(x - 8 * s, y + 8 * s, x - 10 * s, y - 4 * s, x, y - 14 * s);
    ctx.closePath();
    ctx.fill();
    ink(ctx, 2);
    ctx.fillStyle = C.crimson;
    ctx.beginPath();
    ctx.arc(x, y + 4 * s, 3.5 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // ---- food helpers (all procedural) ----
  function drawSteam(ctx, x, y, t, seed, dark) {
    for (let i = 0; i < 3; i++) {
      const ph = seed + i * 2.1;
      const sx = x + (i - 1) * 14 + Math.sin(t * 1.4 + ph) * 5;
      const sy = y - ((t * 14 + i * 16) % 44);
      ctx.strokeStyle = dark ? 'rgba(35,25,23,0.5)' : 'rgba(250,243,224,0.55)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(sx, sy + 12);
      ctx.bezierCurveTo(sx - 7, sy + 4, sx + 7, sy - 4, sx, sy - 12);
      ctx.stroke();
    }
    ctx.lineCap = 'butt';
  }

  function drawNoodles(ctx, x, y, r) {
    ctx.strokeStyle = '#E8C86A';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      const yy = y - r * 0.5 + i * r * 0.26;
      ctx.beginPath();
      ctx.moveTo(x - r * 0.7, yy);
      ctx.bezierCurveTo(x - r * 0.3, yy - 7, x + r * 0.2, yy + 7, x + r * 0.7, yy);
      ctx.stroke();
    }
    ctx.lineCap = 'butt';
  }

  function drawBroth(ctx, x, y, r, color, hi) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hi;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.ellipse(x - r * 0.3, y - r * 0.35, r * 0.5, r * 0.22, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawNarutomaki(ctx, x, y, r) {
    ctx.fillStyle = C.cream;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ink(ctx, 2);
    ctx.strokeStyle = '#E87A90';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 4; a += 0.25) {
      const rad = (a / (Math.PI * 4)) * r * 0.8;
      const px = x + Math.cos(a) * rad;
      const py = y + Math.sin(a) * rad;
      if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  function drawEgg(ctx, x, y, r) {
    ctx.fillStyle = '#FFF6E8';
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.78, 0, 0, Math.PI * 2);
    ctx.fill();
    ink(ctx, 2);
    ctx.fillStyle = C.amber;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.52, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x - r * 0.2, y - r * 0.22, Math.max(2, r * 0.12), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawChashu(ctx, x, y, r, burnt) {
    ctx.fillStyle = burnt ? '#2B1B12' : '#D97B6C';
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.72, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ink(ctx, 2);
    if (!burnt) {
      ctx.strokeStyle = '#8A3B2E';
      ctx.lineWidth = 3;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(x - r * 0.6, y + i * r * 0.3 - r * 0.15);
        ctx.lineTo(x + r * 0.6, y + i * r * 0.3 + r * 0.15);
        ctx.stroke();
      }
      ctx.fillStyle = '#F2D8C9';
      ctx.beginPath();
      ctx.ellipse(x - r * 0.25, y - r * 0.2, r * 0.4, r * 0.18, -0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawGyoza(ctx, x, y, r, burnt) {
    ctx.fillStyle = burnt ? '#2B1B12' : '#E8B96A';
    ctx.beginPath();
    ctx.moveTo(x - r, y + r * 0.3);
    ctx.quadraticCurveTo(x, y - r * 1.3, x + r, y + r * 0.3);
    ctx.quadraticCurveTo(x, y + r * 0.75, x - r, y + r * 0.3);
    ctx.closePath();
    ctx.fill();
    ink(ctx, 2);
    if (!burnt) {
      ctx.strokeStyle = '#B97F2E';
      ctx.lineWidth = 2;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * r * 0.45 - 4, y - r * 0.25);
        ctx.lineTo(x + i * r * 0.45 + 4, y + r * 0.05);
        ctx.stroke();
      }
    }
  }

  function drawScallions(ctx, x, y, r) {
    ctx.strokeStyle = C.jade;
    ctx.lineWidth = 3;
    const spots = [[-0.5, -0.3], [0.1, -0.5], [0.5, 0], [-0.1, 0.35], [0.45, 0.4]];
    spots.forEach(function (sp) {
      ctx.beginPath();
      ctx.arc(x + sp[0] * r, y + sp[1] * r, r * 0.16, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  function drawNori(ctx, x, y, w, h) {
    ctx.fillStyle = '#1E4D2B';
    rr(ctx, x - w / 2, y - h / 2, w, h, 3);
    ctx.fill();
    ink(ctx, 2);
  }

  function drawBowl(ctx, x, y, r, dishId, steps, animT) {
    shadow(ctx, x, y + r * 0.95, r * 1.05, r * 0.18);
    ctx.fillStyle = '#2A3160';
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.92, 0, 0, Math.PI * 2);
    ctx.fill();
    ink(ctx, 3);
    ctx.fillStyle = C.cream;
    ctx.beginPath();
    ctx.ellipse(x, y - r * 0.08, r * 0.86, r * 0.76, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!dishId) return;
    const rec = Y.RECIPES[dishId];
    const inner = r * 0.78;
    if (steps.broth) drawBroth(ctx, x, y - r * 0.08, inner, rec.brothColor, rec.brothHi);
    if (steps.noodles) drawNoodles(ctx, x, y - r * 0.08, inner * 0.8);
    if (steps.nori) drawNori(ctx, x + r * 0.5, y - r * 0.35, r * 0.34, r * 0.62);
    if (steps.chashu) drawChashu(ctx, x - r * 0.3, y - r * 0.15, r * 0.34, false);
    if (steps.egg) drawEgg(ctx, x + r * 0.28, y + r * 0.18, r * 0.3);
    if (steps.narutomaki) drawNarutomaki(ctx, x - r * 0.05, y - r * 0.42, r * 0.26);
    if (steps.scallions) drawScallions(ctx, x, y - r * 0.05, r * 0.8);
    if (dishId === 'miso' && steps.broth) {
      ctx.fillStyle = 'rgba(217, 56, 41, 0.75)';
      [[-0.4, 0.3], [0.35, -0.3], [0.05, 0.45]].forEach(function (p) {
        ctx.beginPath();
        ctx.arc(x + p[0] * r, y + p[1] * r, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  function drawSlate(ctx, x, y, w, h, steps) {
    shadow(ctx, x, y + h * 0.55, w * 0.55, 10);
    ctx.fillStyle = '#23272E';
    rr(ctx, x - w / 2, y - h / 2, w, h, 8);
    ctx.fill();
    ink(ctx, 3);
    if (steps.gyoza) {
      drawGyoza(ctx, x - w * 0.28, y - 6, 26, false);
      drawGyoza(ctx, x - w * 0.09, y - 6, 26, false);
      drawGyoza(ctx, x + w * 0.10, y - 6, 26, false);
      drawGyoza(ctx, x + w * 0.29, y - 6, 26, false);
      drawScallions(ctx, x, y + 26, 60);
    }
    // Soy dipping cup, always on the slate.
    ctx.fillStyle = C.cream;
    ctx.beginPath();
    ctx.arc(x + w / 2 - 26, y + h / 2 - 22, 13, 0, Math.PI * 2);
    ctx.fill();
    ink(ctx, 2);
    ctx.fillStyle = '#4A2410';
    ctx.beginPath();
    ctx.arc(x + w / 2 - 26, y + h / 2 - 22, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCookRing(ctx, x, y, r, zone, frac, animT) {
    let color = C.amber;
    let width = 8;
    if (zone === 'perfect') {
      color = C.jade;
      width = 10 + Math.sin(animT * 8) * 2;
    } else if (zone === 'burning') {
      color = (Math.sin(animT * 10) > 0) ? C.crimson : '#FF7A6B';
      width = 10;
    } else if (zone === 'burnt') {
      color = '#2B1B12';
      width = 8;
    }
    ctx.strokeStyle = 'rgba(35,25,23,0.35)';
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
    ctx.stroke();
    ctx.lineCap = 'butt';
  }

  function stepIcon(ctx, x, y, step, done) {
    if (step === 'broth') {
      ctx.fillStyle = '#6B3A1F';
      ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill(); ink(ctx, 2);
    } else if (step === 'noodles') {
      drawNoodles(ctx, x, y, 9);
    } else if (step === 'narutomaki') {
      drawNarutomaki(ctx, x, y, 8);
    } else if (step === 'egg') {
      drawEgg(ctx, x, y, 8);
    } else if (step === 'chashu') {
      drawChashu(ctx, x, y, 8, false);
    } else if (step === 'nori') {
      drawNori(ctx, x, y, 12, 16);
    } else if (step === 'scallions') {
      drawScallions(ctx, x, y, 12);
    } else if (step === 'gyoza') {
      drawGyoza(ctx, x, y, 9, false);
    }
    if (done) {
      ctx.fillStyle = C.jade;
      ctx.beginPath(); ctx.arc(x + 7, y - 7, 7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 3, y - 7); ctx.lineTo(x + 6, y - 4); ctx.lineTo(x + 11, y - 10);
      ctx.stroke();
    }
  }

  function drawTicket(ctx, s, t, i, animT) {
    const x = L.ticketX + i * L.ticketPitch;
    const y = L.ticketY;
    const rec = Y.RECIPES[t.dish];
    const active = t.id === s.activeTicket;
    const frac = Math.max(0, t.patience / t.max);
    // Hanging clip + slip.
    ctx.fillStyle = '#8A8F9C';
    rr(ctx, x + 82, y - 6, 30, 14, 4);
    ctx.fill();
    ctx.fillStyle = C.cream;
    rr(ctx, x, y, L.ticketW, L.ticketH, 6);
    ctx.fill();
    ctx.lineWidth = active ? 4 : 3;
    ctx.strokeStyle = active ? C.amber : C.espresso;
    ctx.stroke();
    // Dish name.
    ctx.fillStyle = C.espresso;
    ctx.font = '900 15px Trebuchet MS, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(rec.name, x + 10, y + 22);
    // Mini ingredient icons with checkmarks from the active bowl.
    const bowlSteps = (s.bowl && s.bowl.dish === t.dish) ? s.bowl.steps : {};
    const readyDone = (s.ready && s.ready.dish === t.dish);
    rec.steps.forEach(function (st, k) {
      const ix = x + 20 + k * 29;
      const done = readyDone || !!bowlSteps[st];
      stepIcon(ctx, ix, y + 52, st, done);
    });
    // Patience bar, 10px, green -> amber -> flashing red.
    const bw = L.ticketW - 20;
    ctx.fillStyle = 'rgba(35,25,23,0.2)';
    rr(ctx, x + 10, y + L.ticketH - 20, bw, 10, 5);
    ctx.fill();
    let bar = C.jade;
    if (frac < 0.2) bar = (Math.sin(animT * 10) > 0) ? C.crimson : '#FF7A6B';
    else if (frac < 0.5) bar = C.amber;
    ctx.fillStyle = bar;
    if (frac > 0.02) {
      rr(ctx, x + 10, y + L.ticketH - 20, bw * frac, 10, 5);
      ctx.fill();
    }
    hitRect(x, y, L.ticketW, L.ticketH, 'ticket', t.id);
  }

  function fmtTime(sec) {
    const m = Math.floor(sec / 60);
    const ss = Math.floor(sec % 60);
    return (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss;
  }

  function drawHUD(ctx, s, animT) {
    ctx.fillStyle = '#3A2A1A';
    rr(ctx, L.hudX, L.hudY, L.hudW, L.hudH, 8);
    ctx.fill();
    ink(ctx, 3);
    const urgent = s.timeLeft <= 10 && s.mode === 'playing';
    ctx.fillStyle = urgent && Math.sin(animT * 10) > 0 ? C.crimson : C.amber;
    ctx.font = '900 40px Trebuchet MS, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(fmtTime(s.timeLeft), L.hudX + 16, L.hudY + 46);
    ctx.fillStyle = C.cream;
    ctx.font = '900 26px Trebuchet MS, sans-serif';
    ctx.fillText('¥' + s.score.toLocaleString('en-US'), L.hudX + 16, L.hudY + 82);
    // Streak flame badge.
    const mult = Y.multiplier(s);
    if (s.streak > 0) {
      drawFlame(ctx, L.hudX + 225, L.hudY + 34, 1.5);
      ctx.fillStyle = C.amber;
      ctx.font = '900 28px Trebuchet MS, sans-serif';
      ctx.fillText('x' + mult, L.hudX + 248, L.hudY + 44);
    } else {
      ctx.fillStyle = 'rgba(250,243,224,0.4)';
      ctx.font = '900 20px Trebuchet MS, sans-serif';
      ctx.fillText('NO STREAK', L.hudX + 215, L.hudY + 40);
    }
    // Service stars.
    for (let i = 0; i < 3; i++) {
      drawStar(ctx, L.hudX + 232 + i * 32, L.hudY + 82, 13, i < s.stars);
    }
  }

  function drawBoiler(ctx, s, animT) {
    const x = L.boilerX, y = L.boilerY, w = L.boilerW, h = L.boilerH;
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, '#D7DCE3');
    grad.addColorStop(1, '#9AA3AF');
    ctx.fillStyle = grad;
    rr(ctx, x, y, w, h, 14);
    ctx.fill();
    ink(ctx, 3);
    ctx.fillStyle = C.espresso;
    ctx.font = '900 13px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NOODLE BOILER', x + w / 2, y + 22);
    s.boiler.forEach(function (item, i) {
      const cx = L.basketCx[i], cy = L.basketCy;
      ctx.fillStyle = '#6E7683';
      ctx.beginPath(); ctx.arc(cx, cy, L.basketR, 0, Math.PI * 2); ctx.fill();
      ink(ctx, 3);
      ctx.strokeStyle = 'rgba(35,25,23,0.35)';
      ctx.lineWidth = 1.5;
      for (let k = -2; k <= 2; k++) {
        ctx.beginPath(); ctx.moveTo(cx - 44, cy + k * 16); ctx.lineTo(cx + 44, cy + k * 16); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + k * 16, cy - 44); ctx.lineTo(cx + k * 16, cy + 44); ctx.stroke();
      }
      if (item) {
        item.px = cx; item.py = cy;
        const z = Y.zoneOf(item.kind, item.t);
        const burnt = z.zone === 'burnt';
        ctx.strokeStyle = burnt ? '#1E120B' : '#E8C86A';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        for (let k = 0; k < 4; k++) {
          const yy = cy - 16 + k * 11;
          ctx.beginPath();
          ctx.moveTo(cx - 28, yy);
          ctx.bezierCurveTo(cx - 10, yy - 6, cx + 10, yy + 6, cx + 28, yy);
          ctx.stroke();
        }
        ctx.lineCap = 'butt';
        drawCookRing(ctx, cx, cy, L.basketR + 10, z.zone, z.frac, animT);
        if (z.zone === 'burning') drawSteam(ctx, cx, cy - 50, animT, i * 3, true);
        else if (z.zone !== 'burnt') drawSteam(ctx, cx, cy - 50, animT, i * 3, false);
      }
      hitCircle(cx, cy, L.basketR + 12, 'basket', i);
    });
  }

  function drawCauldrons(ctx, s, animT) {
    Y.CAULDRONS.forEach(function (c, i) {
      const cx = L.cauldronCx[i], cy = L.cauldronCy;
      shadow(ctx, cx, cy + L.cauldronR + 6, L.cauldronR + 6, 10);
      ctx.fillStyle = '#4A4F5A';
      ctx.beginPath(); ctx.arc(cx, cy, L.cauldronR, 0, Math.PI * 2); ctx.fill();
      ink(ctx, 3);
      drawBroth(ctx, cx, cy - 4, L.cauldronR - 10, c.color, c.color);
      drawSteam(ctx, cx, cy - 52, animT, i * 5, false);
      // Ladle resting on the rim.
      ctx.strokeStyle = C.cedar;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx + L.cauldronR - 6, cy - L.cauldronR + 10);
      ctx.lineTo(cx + L.cauldronR + 16, cy - L.cauldronR - 14);
      ctx.stroke();
      ctx.lineCap = 'butt';
      // Glow when the active dish still needs this broth.
      const dish = Y.activeDish(s);
      const need = dish && Y.RECIPES[dish].broth === c.id && !(s.bowl && s.bowl.steps.broth);
      if (need) {
        ctx.strokeStyle = 'rgba(244,169,34,' + (0.5 + 0.4 * Math.sin(animT * 5)).toFixed(2) + ')';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(cx, cy, L.cauldronR + 6, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.fillStyle = C.espresso;
      ctx.font = '900 12px Trebuchet MS, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(c.label, cx, cy + L.cauldronR + 20);
      hitCircle(cx, cy, L.cauldronR, 'cauldron', c.id);
    });
  }

  function drawGriddle(ctx, s, animT) {
    const x = L.griddleX, y = L.griddleY, w = L.griddleW, h = L.griddleH;
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, '#3A3230');
    grad.addColorStop(1, '#241F1E');
    ctx.fillStyle = grad;
    rr(ctx, x, y, w, h, 14);
    ctx.fill();
    ink(ctx, 3);
    ctx.fillStyle = C.cream;
    ctx.font = '900 13px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CAST-IRON GRIDDLE', x + w / 2, y + 22);
    s.griddle.forEach(function (item, i) {
      const cx = L.slotCx[i], cy = L.slotCy;
      ctx.fillStyle = '#171414';
      ctx.beginPath(); ctx.arc(cx, cy, L.slotR, 0, Math.PI * 2); ctx.fill();
      ink(ctx, 2);
      if (item) {
        item.px = cx; item.py = cy;
        const z = Y.zoneOf(item.kind, item.t);
        const burnt = z.zone === 'burnt';
        if (item.kind === 'chashu') drawChashu(ctx, cx, cy, 30, burnt);
        else {
          drawGyoza(ctx, cx - 18, cy - 4, 17, burnt);
          drawGyoza(ctx, cx + 16, cy + 6, 17, burnt);
          drawGyoza(ctx, cx + 2, cy - 16, 15, burnt);
        }
        drawCookRing(ctx, cx, cy, L.slotR + 10, z.zone, z.frac, animT);
        if (z.zone === 'cooking' || z.zone === 'perfect') {
          // Deterministic sizzle sparks (pure function of animT + slot).
          for (let k = 0; k < 4; k++) {
            const a = animT * 3 + i * 2 + k * 1.7;
            const sx = cx + Math.sin(a * 2.3) * 34;
            const sy = cy - 20 - ((animT * 30 + k * 13) % 34);
            ctx.fillStyle = 'rgba(244,169,34,0.9)';
            ctx.beginPath(); ctx.arc(sx, sy, 2.5, 0, Math.PI * 2); ctx.fill();
          }
        }
        if (z.zone === 'burning') {
          drawSteam(ctx, cx, cy - 44, animT, i * 7, true);
          // Warning triangle.
          ctx.fillStyle = C.crimson;
          ctx.beginPath();
          ctx.moveTo(cx + 46, cy - 62);
          ctx.lineTo(cx + 59, cy - 40);
          ctx.lineTo(cx + 33, cy - 40);
          ctx.closePath();
          ctx.fill();
          ink(ctx, 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '900 15px Trebuchet MS, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('!', cx + 46, cy - 43);
        }
      }
      hitCircle(cx, cy, L.slotR + 12, 'slot', i);
    });
  }

  function drawTrash(ctx, s, animT) {
    const x = L.trashX, y = L.trashY, w = L.trashW, h = L.trashH;
    const hot = s.carried && s.carried.burnt;
    if (hot) {
      ctx.strokeStyle = 'rgba(217,56,41,' + (0.5 + 0.4 * Math.sin(animT * 6)).toFixed(2) + ')';
      ctx.lineWidth = 4;
      rr(ctx, x - 6, y - 6, w + 12, h + 12, 12);
      ctx.stroke();
    }
    ctx.fillStyle = '#5A3A34';
    rr(ctx, x + 8, y + 18, w - 16, h - 18, 8);
    ctx.fill();
    ink(ctx, 3);
    ctx.fillStyle = C.crimson;
    rr(ctx, x, y, w, 22, 8);
    ctx.fill();
    ink(ctx, 3);
    ctx.fillStyle = C.espresso;
    ctx.font = '900 13px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TRASH', x + w / 2, y + h + 18);
    ctx.fillStyle = 'rgba(35,25,23,0.6)';
    ctx.font = '700 11px Trebuchet MS, sans-serif';
    ctx.fillText('[ X ]', x + w / 2, y + h + 34);
    hitRect(x, y, w, h, 'trash', null);
  }

  function drawTrayIcon(ctx, tray, cx, cy) {
    if (tray.id === 'noodles') {
      ctx.strokeStyle = '#E8C86A';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      for (let k = 0; k < 3; k++) {
        const yy = cy - 12 + k * 12;
        ctx.beginPath();
        ctx.moveTo(cx - 26, yy);
        ctx.bezierCurveTo(cx - 8, yy - 7, cx + 8, yy + 7, cx + 26, yy);
        ctx.stroke();
      }
      ctx.lineCap = 'butt';
    } else if (tray.id === 'chashu') {
      ctx.fillStyle = '#E8A29A';
      rr(ctx, cx - 30, cy - 18, 60, 36, 8);
      ctx.fill();
      ink(ctx, 2);
      ctx.fillStyle = '#F2D8C9';
      rr(ctx, cx - 30, cy - 4, 60, 8, 4);
      ctx.fill();
    } else if (tray.id === 'gyoza') {
      drawGyoza(ctx, cx - 20, cy, 18, false);
      drawGyoza(ctx, cx + 18, cy, 18, false);
    } else if (tray.id === 'narutomaki') {
      drawNarutomaki(ctx, cx, cy, 24);
    } else if (tray.id === 'egg') {
      drawEgg(ctx, cx, cy, 24);
    } else {
      drawScallions(ctx, cx - 16, cy, 30);
      drawNori(ctx, cx + 26, cy, 22, 34);
    }
  }

  function drawTrays(ctx, s) {
    Y.TRAYS.forEach(function (tray, i) {
      const col = i % 3, row = Math.floor(i / 3);
      const x = L.trayX[col], y = L.trayY[row];
      const grad = ctx.createLinearGradient(x, y, x, y + L.trayH);
      grad.addColorStop(0, '#D7DCE3');
      grad.addColorStop(1, '#AEB6C2');
      ctx.fillStyle = grad;
      rr(ctx, x, y, L.trayW, L.trayH, 10);
      ctx.fill();
      ink(ctx, 3);
      drawTrayIcon(ctx, tray, x + L.trayW / 2, y + 48);
      ctx.fillStyle = C.espresso;
      ctx.font = '900 13px Trebuchet MS, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tray.label, x + L.trayW / 2, y + L.trayH - 12);
      // Hotkey pill.
      ctx.fillStyle = C.espresso;
      ctx.beginPath(); ctx.arc(x + L.trayW - 16, y + 16, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.cream;
      ctx.font = '900 14px Trebuchet MS, sans-serif';
      ctx.fillText(tray.key, x + L.trayW - 16, y + 21);
      hitRect(x, y, L.trayW, L.trayH, 'tray', tray.id);
    });
  }

  function drawMat(ctx, s, animT) {
    const x = L.matX, y = L.matY, w = L.matW, h = L.matH;
    ctx.fillStyle = '#5A4632';
    rr(ctx, x, y, w, h, 12);
    ctx.fill();
    ink(ctx, 3);
    ctx.strokeStyle = 'rgba(35,25,23,0.4)';
    ctx.lineWidth = 2;
    for (let k = 1; k < 8; k++) {
      ctx.beginPath(); ctx.moveTo(x + 8, y + k * 32); ctx.lineTo(x + w - 8, y + k * 32); ctx.stroke();
    }
    const bx = L.bowlCx, by = L.bowlCy;
    if (s.bowl) {
      const rec = Y.RECIPES[s.bowl.dish];
      const done = rec.steps.filter(function (st) { return s.bowl.steps[st]; }).length;
      const complete = done === rec.steps.length;
      if (complete) {
        ctx.strokeStyle = 'rgba(46,158,91,' + (0.6 + 0.3 * Math.sin(animT * 5)).toFixed(2) + ')';
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(bx, by, L.bowlR + 12, 0, Math.PI * 2); ctx.stroke();
      }
      if (rec.plate === 'slate') drawSlate(ctx, bx, by, 230, 120, s.bowl.steps);
      else drawBowl(ctx, bx, by, L.bowlR, s.bowl.dish, s.bowl.steps, animT);
      // Progress chip.
      ctx.fillStyle = C.espresso;
      rr(ctx, bx - 34, y + 14, 68, 30, 15);
      ctx.fill();
      ctx.fillStyle = C.cream;
      ctx.font = '900 18px Trebuchet MS, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(done + '/' + rec.steps.length, bx, y + 36);
      ctx.fillStyle = C.cream;
      ctx.font = '900 14px Trebuchet MS, sans-serif';
      ctx.fillText(rec.name, bx, y + h - 14);
    } else {
      // Placeholder outline for the active bowl.
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = 'rgba(250,243,224,0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(bx, by, L.bowlR, L.bowlR * 0.9, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(250,243,224,0.7)';
      ctx.font = '900 15px Trebuchet MS, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ACTIVE BOWL', bx, by + 6);
    }
    // Dotted drop ring while carrying something.
    if (s.carried) {
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = s.carried.burnt ? C.crimson : C.jade;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(bx, by, L.bowlR + 22, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    }
    hitCircle(bx, by, L.bowlR + 24, 'bowl', null);
  }

  function drawPass(ctx, s, animT) {
    const x = L.passX, y = L.passY, w = L.passW, h = L.passH;
    ctx.fillStyle = '#7A2E1D';
    rr(ctx, x, y, w, h, 12);
    ctx.fill();
    ink(ctx, 3);
    ctx.strokeStyle = C.amber;
    ctx.lineWidth = 2;
    rr(ctx, x + 8, y + 8, w - 16, h - 16, 8);
    ctx.stroke();
    const rx = L.readyCx, ry = L.readyCy;
    if (s.ready) {
      const rec = Y.RECIPES[s.ready.dish];
      if (rec.plate === 'slate') drawSlate(ctx, rx, ry, 170, 100, { gyoza: true, scallions: true });
      else {
        const all = {};
        rec.steps.forEach(function (st) { all[st] = true; });
        drawBowl(ctx, rx, ry, 62, s.ready.dish, all, animT);
      }
      drawSteam(ctx, rx, ry - 70, animT, 9, false);
    } else {
      ctx.fillStyle = 'rgba(250,243,224,0.5)';
      ctx.font = '900 14px Trebuchet MS, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SERVING PASS', rx, ry);
    }
    // Chopsticks on a ceramic rest.
    ctx.fillStyle = C.cream;
    rr(ctx, x + 14, y + h - 30, 54, 14, 4);
    ctx.fill();
    ink(ctx, 2);
    ctx.strokeStyle = C.cedar;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x + 76, y + h - 26); ctx.lineTo(x + 186, y + h - 34); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 76, y + h - 16); ctx.lineTo(x + 186, y + h - 20); ctx.stroke();
    ctx.lineCap = 'butt';
    // Brass service bell.
    const bx = L.bellCx, by = L.bellCy;
    if (s.ready) {
      ctx.strokeStyle = 'rgba(46,158,91,' + (0.5 + 0.4 * Math.sin(animT * 6)).toFixed(2) + ')';
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(bx, by, L.bellR + 8 + Math.sin(animT * 6) * 3, 0, Math.PI * 2); ctx.stroke();
    }
    const bg = ctx.createRadialGradient(bx - 12, by - 14, 6, bx, by, L.bellR);
    bg.addColorStop(0, '#FFE9A8');
    bg.addColorStop(0.6, C.amber);
    bg.addColorStop(1, '#B97F2E');
    ctx.fillStyle = bg;
    ctx.beginPath(); ctx.arc(bx, by, L.bellR, 0, Math.PI * 2); ctx.fill();
    ink(ctx, 3);
    ctx.fillStyle = '#FFF3C4';
    ctx.beginPath(); ctx.arc(bx - 12, by - 14, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.espresso;
    ctx.font = '900 13px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SERVE!', bx, by + 4);
    ctx.fillStyle = C.cream;
    ctx.font = '900 13px Trebuchet MS, sans-serif';
    ctx.fillText('SPACE / CLICK', bx, by + L.bellR + 20);
    hitCircle(bx, by, L.bellR + 8, 'bell', null);
  }

  function drawBanner(ctx, s) {
    const x = 490, y = 392, w = 780, h = 38;
    ctx.fillStyle = C.cream;
    rr(ctx, x, y, w, h, 10);
    ctx.fill();
    ink(ctx, 3);
    ctx.fillStyle = C.espresso;
    ctx.font = '900 15px Trebuchet MS, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('1–6 cook & add  ·  Click a cauldron for broth  ·  SPACE rings the bell  ·  X trashes', x + 14, y + 25);
    ctx.fillStyle = C.crimson;
    ctx.beginPath(); ctx.arc(x + w - 20, y + 19, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 14px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('X', x + w - 20, y + 24);
    hitCircle(x + w - 20, y + 19, 14, 'banner-x', null);
  }

  function drawEndCard(ctx, s, animT) {
    ctx.fillStyle = 'rgba(27, 31, 59, 0.7)';
    ctx.fillRect(0, 0, 1280, 720);
    const w = 520, h = 470, x = 640 - w / 2, y = 125;
    ctx.fillStyle = C.cream;
    rr(ctx, x, y, w, h, 14);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = C.crimson;
    ctx.stroke();
    ctx.fillStyle = C.espresso;
    ctx.font = '900 34px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SHIFT COMPLETE', 640, y + 56);
    for (let i = 0; i < 3; i++) drawStar(ctx, 592 + i * 48, y + 92, 17, i < s.stars);
    const rows = [
      ['Orders Served', '' + s.served],
      ['Perfect Cooks', '' + s.perfectCooks],
      ['Best Streak', 'x' + Y.multiplier({ streak: s.bestStreak })],
      ['Burned', '' + s.burned],
      ['Total Tips', '¥' + s.tips.toLocaleString('en-US')]
    ];
    ctx.font = '700 20px Trebuchet MS, sans-serif';
    rows.forEach(function (row, i) {
      const ry = y + 150 + i * 38;
      ctx.textAlign = 'left';
      ctx.fillStyle = C.espresso;
      ctx.fillText(row[0], x + 60, ry);
      ctx.textAlign = 'right';
      ctx.fillText(row[1], x + w - 60, ry);
    });
    ctx.fillStyle = C.crimson;
    ctx.font = '900 40px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('¥' + s.score.toLocaleString('en-US'), 640, y + 360);
    // Tilted red ink stamp with the shift rank.
    ctx.save();
    ctx.translate(805, y + 115);
    ctx.rotate(-0.1);
    ctx.font = '900 22px Trebuchet MS, sans-serif';
    const stampW = ctx.measureText(s.stamp || 'LINE COOK').width + 32;
    ctx.strokeStyle = C.crimson;
    ctx.lineWidth = 4;
    rr(ctx, -stampW / 2, -20, stampW, 40, 6);
    ctx.stroke();
    ctx.fillStyle = C.crimson;
    ctx.textAlign = 'center';
    ctx.fillText(s.stamp || 'LINE COOK', 0, 8);
    ctx.restore();
    ctx.fillStyle = C.crimson;
    rr(ctx, 640 - 110, y + h - 70, 220, 48, 10);
    ctx.fill();
    ink(ctx, 3);
    ctx.fillStyle = C.cream;
    ctx.font = '900 22px Trebuchet MS, sans-serif';
    ctx.fillText('PLAY AGAIN', 640, y + h - 38);
    hitRect(640 - 110, y + h - 70, 220, 48, 'again', null);
  }

  Y.render = function (ctx, s, animT) {
    Y.hits = [];
    ctx.save();
    if (s.shake > 0) {
      ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
    }
    // Page backdrop.
    ctx.fillStyle = C.indigo;
    ctx.fillRect(-12, -12, 1304, 744);
    // Top band: ticket rail.
    ctx.fillStyle = '#232748';
    ctx.fillRect(0, 0, 1280, 130);
    ctx.fillStyle = '#8A8F9C';
    ctx.fillRect(12, 4, 888, 10);
    s.tickets.forEach(function (t, i) { drawTicket(ctx, s, t, i, animT); });
    drawHUD(ctx, s, animT);
    // Noren valance.
    ctx.fillStyle = C.crimson;
    ctx.fillRect(0, 130, 1280, 26);
    ctx.fillStyle = C.cream;
    for (let x = 0; x < 1280; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 156);
      ctx.lineTo(x + 32, 142);
      ctx.lineTo(x + 64, 156);
      ctx.closePath();
      ctx.fill();
    }
    // Middle band: subway tiles.
    ctx.fillStyle = '#EDE4CE';
    ctx.fillRect(0, 156, 1280, 234);
    ctx.strokeStyle = 'rgba(35,25,23,0.12)';
    ctx.lineWidth = 2;
    for (let yy = 190; yy < 390; yy += 34) {
      ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(1280, yy); ctx.stroke();
    }
    for (let xx = 0; xx < 1280; xx += 68) {
      ctx.beginPath(); ctx.moveTo(xx, 156); ctx.lineTo(xx, 390); ctx.stroke();
    }
    drawBoiler(ctx, s, animT);
    drawCauldrons(ctx, s, animT);
    drawGriddle(ctx, s, animT);
    drawTrash(ctx, s, animT);
    // Overhead lantern cones: warm light pouring onto the cooking line.
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    let cone = ctx.createRadialGradient(180, 60, 10, 180, 60, 520);
    cone.addColorStop(0, 'rgba(244, 169, 34, 0.16)');
    cone.addColorStop(1, 'rgba(244, 169, 34, 0)');
    ctx.fillStyle = cone;
    ctx.fillRect(0, 0, 700, 390);
    cone = ctx.createRadialGradient(1100, 60, 10, 1100, 60, 520);
    cone.addColorStop(0, 'rgba(244, 169, 34, 0.16)');
    cone.addColorStop(1, 'rgba(244, 169, 34, 0)');
    ctx.fillStyle = cone;
    ctx.fillRect(580, 0, 700, 390);
    ctx.restore();
    // Bottom band: cedar counter.
    ctx.fillStyle = C.cedar;
    ctx.fillRect(0, 390, 1280, 330);
    ctx.strokeStyle = 'rgba(35,25,23,0.25)';
    ctx.lineWidth = 2;
    for (let yy = 445; yy < 720; yy += 55) {
      ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(1280, yy); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(154,98,50,0.5)';
    ctx.lineWidth = 1.5;
    for (let k = 0; k < 24; k++) {
      const gy = 400 + ((k * 47) % 310);
      const gx = (k * 173) % 1200;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.bezierCurveTo(gx + 30, gy + 3, gx + 60, gy - 3, gx + 90, gy + 2);
      ctx.stroke();
    }
    drawTrays(ctx, s);
    drawMat(ctx, s, animT);
    drawPass(ctx, s, animT);
    // Carried item follows the mouse.
    if (s.carried && s.mode === 'playing') {
      const mx = s.mouse.x, my = s.mouse.y;
      shadow(ctx, mx, my + 26, 30, 8);
      if (s.carried.kind === 'noodles') {
        ctx.strokeStyle = s.carried.burnt ? '#1E120B' : '#E8C86A';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        for (let k = 0; k < 3; k++) {
          const yy = my - 10 + k * 11;
          ctx.beginPath();
          ctx.moveTo(mx - 24, yy);
          ctx.bezierCurveTo(mx - 8, yy - 6, mx + 8, yy + 6, mx + 24, yy);
          ctx.stroke();
        }
        ctx.lineCap = 'butt';
      } else if (s.carried.kind === 'chashu') {
        drawChashu(ctx, mx, my, 26, s.carried.burnt);
      } else if (s.carried.kind === 'egg') {
        drawEgg(ctx, mx, my, 24);
      } else {
        drawGyoza(ctx, mx - 14, my, 16, s.carried.burnt);
        drawGyoza(ctx, mx + 14, my, 16, s.carried.burnt);
      }
      if (s.carried.perfect) {
        ctx.fillStyle = C.jade;
        ctx.font = '900 13px Trebuchet MS, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PERFECT', mx, my - 34);
      }
    }
    Y.drawParticles(ctx, s);
    if (s.banner && s.mode === 'playing') drawBanner(ctx, s);
    if (s.mode === 'over') drawEndCard(ctx, s, animT);
    ctx.restore();
  };
})();
