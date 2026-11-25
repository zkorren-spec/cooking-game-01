// Yatai Rush — particles: steam curls, burn smoke, sizzle sparks, yen popups.
window.Y = window.Y || {};

Y.addPopup = function (s, x, y, text, color, size) {
  s.popups.push({ x: x, y: y, text: text, color: color || '#F4A922', size: size || 24, life: 1.6, max: 1.6 });
};

Y.spawnSteam = function (s, x, y) {
  s.particles.push({ kind: 'steam', x: x, y: y, vx: (Math.random() - 0.5) * 8, vy: -22 - Math.random() * 10, life: 1.4, max: 1.4, size: 10 + Math.random() * 8 });
};

Y.spawnSmoke = function (s, x, y) {
  s.particles.push({ kind: 'smoke', x: x, y: y, vx: (Math.random() - 0.5) * 12, vy: -30 - Math.random() * 14, life: 1.1, max: 1.1, size: 9 + Math.random() * 7 });
};

Y.spawnSpark = function (s, x, y) {
  s.particles.push({ kind: 'spark', x: x, y: y, vx: (Math.random() - 0.5) * 60, vy: -20 - Math.random() * 50, life: 0.45, max: 0.45, size: 2 + Math.random() * 2.5 });
};

// A burst of sizzle sparks, e.g. when food first hits the griddle.
Y.spawnBurst = function (s, x, y, n) {
  for (let i = 0; i < (n || 6); i++) Y.spawnSpark(s, x, y);
};

Y.updateParticles = function (s, dt) {
  for (let i = s.particles.length - 1; i >= 0; i--) {
    const p = s.particles[i];
    p.life -= dt;
    if (p.life <= 0) { s.particles.splice(i, 1); continue; }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.kind === 'spark') p.vy += 160 * dt;
  }
  for (let i = s.popups.length - 1; i >= 0; i--) {
    const p = s.popups[i];
    p.life -= dt;
    p.y -= 26 * dt;
    if (p.life <= 0) s.popups.splice(i, 1);
  }
};

Y.drawParticles = function (ctx, s) {
  s.particles.forEach(function (p) {
    const a = Math.max(0, p.life / p.max);
    if (p.kind === 'steam') {
      ctx.fillStyle = 'rgba(250, 243, 224, ' + (0.5 * a).toFixed(2) + ')';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.62, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.kind === 'smoke') {
      ctx.fillStyle = 'rgba(35, 25, 23, ' + (0.55 * a).toFixed(2) + ')';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(244, 169, 34, ' + a.toFixed(2) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  s.popups.forEach(function (p) {
    const a = Math.min(1, (p.life / p.max) * 2);
    ctx.globalAlpha = a;
    ctx.font = '900 ' + p.size + 'px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#231917';
    ctx.strokeText(p.text, p.x, p.y);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x, p.y);
    ctx.globalAlpha = 1;
  });
};
