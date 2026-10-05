'use strict';
// ======================================================================
// VISION & COORDINATE TRAINER
// ======================================================================
const FILES = 'abcdefgh';
const ALL_SQ = [...Array(64)].map((_, i) => FILES[i % 8] + (Math.floor(i / 8) + 1));
const isLight = sq => (FILES.indexOf(sq[0]) + +sq[1] - 1) % 2 === 1;
const pickSq = (not) => { let s; do s = ALL_SQ[Math.floor(Math.random() * 64)]; while (s === not); return s; };
const V_DRILLS = [
  { id: 'find', icon: '🎯', name: 'Find the square', time: 30,
    how: 'A square name appears — click that square as fast as you can. No coordinates on the board: you have to KNOW where it is.' },
  { id: 'name', icon: '🏷', name: 'Name the square', time: 30,
    how: 'A square lights up — pick its name (keys 1–4 work too).' },
  { id: 'color', icon: '◐', name: 'Light or dark?', time: 30,
    how: 'The board is blank. Picture the square in your head: is it light or dark? (Keys L / D). Tip: a1 is dark, and squares on the a1–h8 diagonal are all dark.' },
  { id: 'knight', icon: '♞', name: 'Knight routes', time: 60,
    how: 'Hop the knight to the gold square in the FEWEST possible moves. Plan the whole route in your head before you click.' },
  { id: 'checks', icon: '⚔', name: 'Find every check',
    how: 'A real game position. Play EVERY checking move for the side to move (drag or click). Strong players see all checks first — this builds that habit.' },
  { id: 'hanging', icon: '🎈', name: 'Hanging pieces',
    how: 'Click every piece (both colours) that can be taken for free or by a cheaper piece, then press ✔ Check. Ignore pins and tactics — just count attackers and defenders.' },
];
const EMPTY = (() => { const c = new Chess(); c.clear(); return c; })();
const V = { drill: 'find', running: false, score: 0, miss: 0, end: 0, timer: null, target: null, opts: [], pos: EMPTY, tints: {}, marks: [],
            arrows: [], last: null, knightAt: null, hops: 0, minHops: 0, checks: [], found: [], picks: new Set(), answer: null, checked: false,
            msg: null, side: 'w', coords: false, streak: 0, token: 0 };

// ---------- helpers ----------
function knightDist(a, b) {
  const xy = s => [FILES.indexOf(s[0]), +s[1] - 1], [bx, by] = xy(b);
  const seen = new Map([[a, 0]]), q = [a];
  while (q.length) {
    const s = q.shift(), [x, y] = xy(s), d = seen.get(s);
    if (x === bx && y === by) return d;
    for (const [dx, dy] of [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]]) {
      const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx > 7 || ny > 7) continue;
      const n = FILES[nx] + (ny + 1); if (!seen.has(n)) { seen.set(n, d + 1); q.push(n); }
    }
  }
  return 99;
}
const isKnightHop = (a, b) => { const dx = Math.abs(a.charCodeAt(0) - b.charCodeAt(0)), dy = Math.abs(a[1] - b[1]); return dx * dy === 2; };
// Pieces of `byColor` that can capture on `sq` right now.
function attackersOf(fen, sq, byColor) {
  const c = new Chess(); if (!c.load(withTurn(fen, byColor))) return [];
  return c.moves({ verbose: true }).filter(m => m.to === sq && m.captured && m.captured !== 'k').map(m => ({ from: m.from, piece: m.piece }));
}
function defendersOf(fen, sq) {
  const c = new Chess(fen), p = c.get(sq); if (!p) return [];
  const opp = p.color === 'w' ? 'b' : 'w', t = new Chess(); if (!t.load(withTurn(fen, p.color))) return [];
  t.remove(sq); t.put({ type: 'n', color: opp }, sq);
  return t.moves({ verbose: true }).filter(m => m.to === sq && m.captured).map(m => ({ from: m.from, piece: m.piece }));
}
function hangingPieces(fen) {
  const c = new Chess(fen), out = [];
  for (const sq of ALL_SQ) {
    const p = c.get(sq); if (!p || p.type === 'k') continue;
    const att = attackersOf(fen, sq, p.color === 'w' ? 'b' : 'w'); if (!att.length) continue;
    const def = defendersOf(fen, sq), cheap = att.filter(a => VAL[a.piece] < VAL[p.type]);
    if (!def.length || cheap.length) out.push({ sq, p, att, def, cheap: cheap.length > 0 });
  }
  return out;
}
const pieceName = (p, sq) => `${p.color === 'w' ? 'white' : 'black'} ${NAME[p.type]} on ${sq}`;
function randomGamePos(test) {
  for (let i = 0; i < 300; i++) {
    const pz = PZ_POOL[Math.floor(Math.random() * PZ_POOL.length)]; if (!pz) break;
    const c = new Chess(pz.fen); if (c.game_over()) continue;
    const r = test(c); if (r) return { c, r };
  }
  return null;
}

// ---------- drill flow ----------
const drill = () => V_DRILLS.find(d => d.id === V.drill);
const timed = () => !!drill().time;
function vSetup() {
  V.token++; clearInterval(V.timer); V.running = false; V.score = 0; V.miss = 0; V.streak = 0;
  V.tints = {}; V.marks = []; V.arrows = []; V.last = null; V.msg = null; V.target = null; V.checked = false;
  V.pos = EMPTY; selected = null;
  const side = V.sideChoice === 'r' ? (Math.random() < .5 ? 'w' : 'b') : V.sideChoice || 'w';
  V.side = side; flip.vision = side === 'b';
  if (!timed()) nextRound();
  vRender();
}
function vStart() {
  vSetup();
  V.running = true; V.end = performance.now() + drill().time * 1000;
  nextRound();
  V.timer = setInterval(() => {
    const left = Math.max(0, V.end - performance.now());
    const t = $('vTime'); if (t) t.textContent = (left / 1000).toFixed(1) + 's';
    if (left <= 0) vFinish();
  }, 100);
  vRender();
}
function vFinish() {
  clearInterval(V.timer); V.running = false; V.target = null; V.tints = {}; V.marks = []; V.pos = EMPTY;
  const best = prog.vision[V.drill] || 0, rec = V.score > best;
  if (rec) { prog.vision[V.drill] = V.score; saveProgress(); }
  V.msg = { kind: 'good', icon: rec ? '🏆' : '⏱', title: `Time! Score: ${V.score}`, sub: rec ? `New personal best! (old: ${best})` : `Personal best: ${best}. ${V.miss} miss${V.miss === 1 ? '' : 'es'}.` };
  sfx('end'); vRender();
}
function flash(sq, kind, ms = 450) {
  V.tints[sq] = kind; vDraw();
  const tok = V.token;
  setTimeout(() => { if (V.token === tok && V.tints[sq] === kind) { delete V.tints[sq]; vDraw(); } }, ms);
}
function nextRound() {
  V.tints = {}; V.marks = []; V.arrows = []; V.last = null; V.checked = false; V.picks = new Set(); V.found = []; V.missThis = false; V.revealed = false;
  const d = V.drill;
  if (d === 'find' || d === 'color') { V.target = pickSq(V.target); V.pos = EMPTY; }
  if (d === 'name') {
    V.target = pickSq(V.target); V.pos = EMPTY; V.marks = [V.target];
    // distractors: neighbouring squares are the ones people mix up
    const f = FILES.indexOf(V.target[0]), r = +V.target[1], near = new Set();
    for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [7 - 2 * f, 0], [0, 9 - 2 * r]]) {
      const nf = f + dx, nr = r + dy; if (nf >= 0 && nf < 8 && nr >= 1 && nr <= 8 && (dx || dy)) near.add(FILES[nf] + nr);
    }
    const pool = [...near].sort(() => Math.random() - .5).slice(0, 3);
    V.opts = [V.target, ...pool].sort(() => Math.random() - .5);
  }
  if (d === 'knight') {
    let a, b; do { a = pickSq(); b = pickSq(a); } while (knightDist(a, b) < 2);
    V.knightAt = a; V.target = b; V.hops = 0; V.minHops = knightDist(a, b); V.path = [a];
    V.pos = new Chess(); V.pos.clear(); V.pos.put({ type: 'n', color: 'w' }, a); V.marks = [b];
  }
  if (d === 'checks') {
    const g = randomGamePos(c => { const ch = c.moves({ verbose: true }).filter(m => /[+#]/.test(m.san)); return ch.length >= 1 && ch.length <= 7 ? ch : null; });
    if (!g) { V.msg = { kind: 'bad', icon: '⚠', title: 'No positions available' }; return; }
    V.pos = g.c; V.checks = g.r; V.side = g.c.turn(); flip.vision = V.side === 'b';
  }
  if (d === 'hanging') {
    const g = randomGamePos(c => { const h = hangingPieces(c.fen()); return h.length >= 1 && h.length <= 4 ? h : null; });
    if (!g) { V.msg = { kind: 'bad', icon: '⚠', title: 'No positions available' }; return; }
    V.pos = g.c; V.answer = g.r; V.side = g.c.turn(); flip.vision = V.side === 'b';
  }
}
function good(sq) { V.score++; V.streak++; if (sq) flash(sq, 'good'); sfx('move'); }
function bad(sq) { V.miss++; V.streak = 0; if (sq) flash(sq, 'bad', 700); sfx('wrong'); }

// coordinate drills: answer handlers
function vClick(sq) {
  const d = V.drill;
  if (d === 'find') {
    if (!V.running) return true;
    if (sq === V.target) good(sq); else { bad(sq); flash(V.target, 'good', 700); }
    nextRound(); vRender(); return true;
  }
  if (d === 'knight') {
    if (!V.running) return true;
    if (!isKnightHop(V.knightAt, sq)) { bad(sq); return true; }
    V.pos.remove(V.knightAt); V.pos.put({ type: 'n', color: 'w' }, sq);
    V.last = { from: V.knightAt, to: sq }; V.knightAt = sq; V.hops++; V.path.push(sq); sfx('move');
    if (sq === V.target) {
      if (V.hops === V.minHops) { V.score++; V.streak++; V.msg = null; flash(sq, 'good'); }
      else { V.miss++; V.streak = 0; flash(sq, 'bad', 700); V.msgTmp = `Took ${V.hops} hops — ${V.minHops} was possible.`; }
      const tok = V.token; vRender();
      setTimeout(() => { if (V.token === tok && V.running) { nextRound(); vRender(); } }, 350);
      return true;
    }
    if (V.hops >= V.minHops + 3) { bad(sq); V.msgTmp = `Lost the way — the shortest route was ${V.minHops} hops.`; nextRound(); }
    vRender(); return true;
  }
  if (d === 'hanging') {
    if (V.checked) return true;
    const p = V.pos.get(sq); if (!p || p.type === 'k') return true;
    V.picks.has(sq) ? V.picks.delete(sq) : V.picks.add(sq);
    vRender(); return true;
  }
  return false; // checks drill uses normal piece moves
}
function vAnswer(ans) {
  if (!V.running) return;
  const d = V.drill;
  if (d === 'name') { if (ans === V.target) good(V.target); else { bad(); flash(V.target, 'bad', 600); } }
  if (d === 'color') { if (ans === (isLight(V.target) ? 'light' : 'dark')) good(); else bad(); }
  nextRound(); vRender();
}
// checks drill: try a move
function vMove(from, to) {
  if (V.drill !== 'checks' || V.checked) return false;
  const ms = V.pos.moves({ square: from, verbose: true }).filter(m => m.to === to);
  if (!ms.length) return false;
  selected = null;
  const hit = V.checks.filter(m => m.from === from && m.to === to);
  if (!hit.length) { bad(to); V.missThis = true; V.msgTmp = `${ms[0].san} is not a check.`; vRender(); return true; }
  if (V.found.some(m => m.from === from && m.to === to)) { V.msgTmp = `${hit[0].san} — already found.`; vRender(); return true; }
  V.found.push(hit[0]); sfx('check'); V.msgTmp = null;
  if (V.found.length === new Set(V.checks.map(m => m.from + m.to)).size) {
    V.checked = true;
    if (!V.missThis) { V.score++; prog.vision.checks = (prog.vision.checks || 0) + 1; saveProgress(); }
    V.msgTmp = null;
  }
  vRender(); return true;
}
function vCheckHanging() {
  if (V.drill !== 'hanging' || V.checked) return;
  V.checked = true;
  const ans = new Set(V.answer.map(h => h.sq)), wrong = [...V.picks].filter(s => !ans.has(s)), missed = [...ans].filter(s => !V.picks.has(s));
  V.tints = {};
  for (const s of V.picks) V.tints[s] = ans.has(s) ? 'good' : 'bad';
  V.marks = missed;
  const ok = !wrong.length && !missed.length;
  if (ok) { V.score++; prog.vision.hanging = (prog.vision.hanging || 0) + 1; saveProgress(); sfx('right'); } else sfx('wrong');
  V.hangResult = { ok, wrong, missed };
  vRender();
}
function vReveal() {
  if (V.drill === 'checks' && !V.checked) { V.checked = true; V.missThis = true; V.revealed = true; V.miss++; vRender(); }
}

// ---------- rendering ----------
function vDraw() {
  if (mode !== 'vision') return;
  const d = V.drill, arrows = [];
  if (d === 'checks') {
    for (const m of V.found) arrows.push({ from: m.from, to: m.to, color: '#81b64c' });
    if (V.checked) for (const m of V.checks) if (!V.found.includes(m)) arrows.push({ from: m.from, to: m.to, color: '#f7c045' });
  }
  const tints = { ...V.tints };
  if (d === 'hanging' && !V.checked) for (const s of V.picks) tints[s] = 'pick';
  if (d === 'knight') for (const s of (V.path || []).slice(0, -1)) tints[s] = tints[s] || 'trail';
  const coordDrill = ['find', 'name', 'color', 'knight'].includes(d);
  drawBoard({ pos: V.pos, last: V.last, sel: selected, targets: selected ? V.pos.moves({ square: selected, verbose: true }) : [],
              marks: V.marks, tints, arrows, coords: !coordDrill || V.coords, blind: d === 'color' });
  const me = { name: 'You', av: '🧠', elo: null, toMove: false };
  const info = { name: drill().name, av: drill().icon, toMove: false };
  renderCards(V.pos, V.side === 'w' ? { w: me, b: info } : { w: info, b: me }, V.drill === 'checks' || V.drill === 'hanging');
  showEval(null);
}
function vRender() {
  const d = drill();
  document.querySelectorAll('#vDrills .lvl-chip').forEach(b => b.classList.toggle('on', b.dataset.d === V.drill));
  $('vHow').textContent = d.how;
  $('vSideRow').hidden = !['find', 'name', 'color', 'knight'].includes(V.drill);
  document.querySelectorAll('#vSide button').forEach(b => b.classList.toggle('on', b.dataset.s === (V.sideChoice || 'w')));
  $('vCoords').checked = V.coords;
  const best = prog.vision[V.drill] || 0;
  let html = '';
  if (timed()) {
    if (V.running) {
      let prompt = '';
      if (V.drill === 'find') prompt = `<div class="v-prompt">${V.target}</div>`;
      if (V.drill === 'color') prompt = `<div class="v-prompt">${V.target}</div><div class="v-opts two"><button class="btn" data-a="light">☀ Light <small>L</small></button><button class="btn" data-a="dark">● Dark <small>D</small></button></div>`;
      if (V.drill === 'name') prompt = `<div class="v-prompt small">Which square is lit?</div><div class="v-opts">${V.opts.map((o, i) => `<button class="btn" data-a="${o}">${o} <small>${i + 1}</small></button>`).join('')}</div>`;
      if (V.drill === 'knight') prompt = `<div class="v-prompt small">♞ ${V.path[0]} → ${V.target}</div><div class="pz-s" style="text-align:center">Hops: ${V.hops} · fewest possible: <b>${V.minHops}</b></div>`;
      html = `<div class="v-bar"><span class="v-time" id="vTime">${drill().time}.0s</span><span class="v-score">✔ ${V.score}</span><span class="v-miss">✕ ${V.miss}</span></div>${prompt}
        ${V.msgTmp ? `<div class="pz-s" style="text-align:center">${esc(V.msgTmp)}</div>` : ''}`;
    } else {
      const m = V.msg;
      html = `${m ? `<div class="pz-h"><span class="pz-ic">${m.icon}</span><div><div class="pz-t">${m.title}</div><div class="pz-s">${m.sub || ''}</div></div></div>` : ''}
        <button class="btn primary wide v-start" id="vStart">▶ Start (${drill().time}s)</button><div class="pz-s" style="text-align:center">Personal best: <b>${best}</b></div>`;
    }
  } else if (V.drill === 'checks') {
    const total = new Set(V.checks.map(m => m.from + m.to)).size, who = V.pos.turn() === 'w' ? 'White' : 'Black';
    const list = V.found.map(m => `<span class="tag">${m.san}</span>`).join('');
    html = `<div class="pz-h"><span class="pz-ic">⚔</span><div><div class="pz-t">${V.checked ? (V.revealed ? 'Here they all are' : V.missThis ? 'All found — but one try was not a check' : 'All checks found! ✓') : `${who} to move — find every check`}</div>
      <div class="pz-s">Found ${V.found.length} of ${V.checked ? total : '?'} · positions cleared: ${prog.vision.checks || 0}</div></div></div>
      ${list ? `<div class="tags">${list}</div>` : ''}
      ${V.msgTmp ? `<div class="pz-s">${esc(V.msgTmp)}</div>` : ''}
      ${V.checked ? `<div class="pz-s">${total} check${total === 1 ? '' : 's'} in total: ${V.checks.filter((m, i, a) => a.findIndex(x => x.from + x.to === m.from + m.to) === i).map(m => m.san).join(', ')}</div>` : ''}
      <div class="row">${V.checked ? '<button class="btn primary" data-a="next">Next position ⏭</button>' : '<button class="btn" data-a="reveal">I\'m done — show the rest</button>'}</div>`;
  } else if (V.drill === 'hanging') {
    let res = '';
    if (V.checked) {
      const r = V.hangResult;
      res = `<div class="op-body">${r.ok ? '<p class="op-ok">✓ Exactly right!</p>' : `<p>${r.missed.length ? `Missed (gold): ${r.missed.join(', ')}. ` : ''}${r.wrong.length ? `Not hanging (red): ${r.wrong.join(', ')}.` : ''}</p>`}
        ${V.answer.map(h => `<p>• <b>${pieceName(h.p, h.sq)}</b>: attacked by ${h.att.map(a => NAME[a.piece] + ' ' + a.from).join(', ')}; ${h.def.length ? `defended by ${h.def.length}, but ${h.cheap ? 'a cheaper piece attacks it' : ''}` : 'no defenders'}.</p>`).join('')}</div>`;
    }
    html = `<div class="pz-h"><span class="pz-ic">🎈</span><div><div class="pz-t">${V.checked ? 'Answer' : 'Click every hanging piece'}</div>
      <div class="pz-s">${V.pos.turn() === 'w' ? 'White' : 'Black'} to move · picked ${V.picks.size} · positions solved: ${prog.vision.hanging || 0}</div></div></div>${res}
      <div class="row">${V.checked ? '<button class="btn primary" data-a="next">Next position ⏭</button>' : '<button class="btn primary" data-a="check">✔ Check</button>'}</div>`;
  }
  $('vStatus').innerHTML = html;
  vDraw();
}

// ---------- controls ----------
$('vDrills').innerHTML = V_DRILLS.map(d => `<button class="lvl-chip" data-d="${d.id}"><b>${d.icon} ${d.name}</b><small>${d.time ? d.time + 's sprint' : 'untimed'}</small></button>`).join('');
$('vDrills').onclick = e => { const b = e.target.closest('.lvl-chip'); if (!b) return; V.drill = b.dataset.d; prog.vDrill = V.drill; saveProgress(); vSetup(); };
$('vSide').onclick = e => { const b = e.target.closest('button'); if (!b) return; V.sideChoice = b.dataset.s; prog.vSide = V.sideChoice; saveProgress(); vSetup(); };
$('vCoords').onchange = () => { V.coords = $('vCoords').checked; vDraw(); };
$('vStatus').onclick = e => {
  if (e.target.closest('#vStart')) return vStart();
  const b = e.target.closest('[data-a]'); if (!b) return;
  const a = b.dataset.a;
  if (a === 'next') { V.missThis = false; V.msgTmp = null; V.hangResult = null; nextRound(); vRender(); }
  else if (a === 'reveal') vReveal();
  else if (a === 'check') vCheckHanging();
  else vAnswer(a);
};
document.addEventListener('keydown', e => {
  if (mode !== 'vision' || e.target.matches('input, textarea, select')) return;
  if (V.running && V.drill === 'name' && /^[1-4]$/.test(e.key)) vAnswer(V.opts[+e.key - 1]);
  if (V.running && V.drill === 'color' && (e.key === 'l' || e.key === 'd')) vAnswer(e.key === 'l' ? 'light' : 'dark');
});
EXTRA_MODES.vision = {
  view: 'visionView',
  ctl: {
    pos: () => V.pos, draw: () => vDraw(), click: sq => vClick(sq), move: (f, t) => vMove(f, t),
    canPick: p => V.drill === 'checks' && !V.checked && p.color === V.pos.turn(),
  },
  draw: () => vDraw(),
  init: () => { V.drill = V_DRILLS.some(d => d.id === prog.vDrill) ? prog.vDrill : 'find'; V.sideChoice = prog.vSide || 'w'; vSetup(); },
  leave: () => { if (V.running) vSetup(); },
};
