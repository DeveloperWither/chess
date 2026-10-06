'use strict';
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem('cs_' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('cs_' + k, JSON.stringify(v)); } catch {} },
};
const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const NAME = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };

// ======================================================================
// Pieces (cburnett)
// ======================================================================
const PIECE_PATHS = {
  k: '<path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter" fill="none"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7"/><path class="det" fill="none" d="M12.5 30c5.5-3 14.5-3 20 0M12.5 33.5c5.5-3 14.5-3 20 0M12.5 37c5.5-3 14.5-3 20 0"/><path class="detb" fill="none" d="M32 29.5s8.5-4 6.03-9.65C34.15 14 25 18 22.5 24.5v2.1-2.1C20 18 9.906 14 6.997 19.85c-2.497 5.65 4.853 9 4.853 9"/>',
  q: '<path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path class="det" d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/>',
  r: '<path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path class="det" d="M11 14h23" fill="none" stroke-linejoin="miter"/><path class="detb" fill="none" stroke-width="1" stroke-linejoin="miter" d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17"/>',
  b: '<g stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path class="det" d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter" fill="none"/>',
  n: '<path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"/><path class="eye" fill="#000" d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" stroke-width="1.5"/><path class="detb" fill="#e9e9e9" stroke="none" d="M24.55 10.4l-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34-2.37-4.49-5.79-6.64-9.19-7.16l-.51-.1z"/>',
  p: '<path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03C15.41 27.09 11 31.58 11 39.5H34c0-7.92-4.41-12.41-7.41-13.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" stroke-linecap="round"/>',
};
function pieceSVG(color, type, cls = 'pc') {
  return `<svg class="${cls} ${color === 'w' ? 'pw' : 'pb'}" viewBox="0 0 45 45"><g fill="url(#g${color})" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${PIECE_PATHS[type]}</g></svg>`;
}

// ======================================================================
// Sound (synthesized, no files)
// ======================================================================
let soundOn = store.get('sound', true), actx = null;
function sfx(kind) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime;
    const noise = (dur, freq, gain) => {
      const len = Math.floor(actx.sampleRate * dur), buf = actx.createBuffer(1, len, actx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 5);
      const src = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
      src.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 1.1; g.gain.value = gain;
      src.connect(f).connect(g).connect(actx.destination); src.start(t);
    };
    const tone = (freq, dur, gain, delay = 0) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.frequency.value = freq; g.gain.setValueAtTime(gain, t + delay); g.gain.exponentialRampToValueAtTime(0.0001, t + delay + dur);
      o.connect(g).connect(actx.destination); o.start(t + delay); o.stop(t + delay + dur);
    };
    if (kind === 'move') { noise(0.06, 1500, 1.6); tone(240, 0.05, 0.05); }
    if (kind === 'capture') { noise(0.11, 750, 2.6); tone(150, 0.09, 0.09); }
    if (kind === 'check') { noise(0.06, 1500, 1.4); tone(660, 0.12, 0.05); tone(880, 0.16, 0.05, 0.07); }
    if (kind === 'end') [523, 659, 784, 1047].forEach((f, k) => tone(f, 0.6, 0.045, k * 0.09));
    if (kind === 'wrong') { tone(220, 0.18, 0.07); tone(165, 0.3, 0.07, 0.12); }
    if (kind === 'msg') { tone(988, 0.09, 0.04); tone(1319, 0.16, 0.04, 0.08); }
    if (kind === 'right') { tone(784, 0.12, 0.05); tone(1175, 0.2, 0.05, 0.08); }
  } catch {}
}
const moveSound = m => sfx(/[#+]/.test(m.san) ? 'check' : m.captured ? 'capture' : 'move');

// ======================================================================
// Engine wrapper: queued UCI searches with MultiPV, white-POV scores
// ======================================================================
function normScore(type, raw, sign) {
  if (type === 'mate') { const m = raw * sign; return { mate: m, cp: m > 0 ? 10000 - m * 10 : -10000 - m * 10 }; }
  return { cp: raw * sign, mate: null };
}
class Engine {
  constructor() { this.w = null; this.cur = null; this.queue = []; this.ready = this.boot(); this.ready.catch(() => {}); }
  async boot() {
    for (const url of ['engine/stockfish.wasm.js', 'stockfish.js']) {
      try { await this.tryStart(url); this.url = url; return true; } catch (e) { console.warn('engine failed:', url, e); }
    }
    throw new Error('Could not start Stockfish');
  }
  tryStart(url) {
    return new Promise((res, rej) => {
      let w; try { w = new Worker(url); } catch (e) { return rej(e); }
      const t = setTimeout(() => { w.terminate(); rej(new Error('timeout')); }, 15000);
      w.onmessage = e => {
        const l = String(e.data);
        if (l === 'uciok') { w.postMessage('setoption name Hash value 32'); w.postMessage('isready'); }
        else if (l === 'readyok') { clearTimeout(t); this.w = w; w.onmessage = ev => this.onLine(String(ev.data)); res(); }
      };
      w.onerror = e => { clearTimeout(t); w.terminate(); rej(e); };
      w.postMessage('uci');
    });
  }
  search(fen, opts = {}, onInfo = null) {
    const job = { fen, opts, onInfo, lines: [], depth: 0, done: false, cancelled: false };
    const promise = new Promise(res => (job.resolve = res));
    const cancel = () => {
      if (job.done) return;
      job.cancelled = true;
      const qi = this.queue.indexOf(job);
      if (qi >= 0) { this.queue.splice(qi, 1); job.done = true; job.resolve(null); }
      else if (this.cur === job) this.w.postMessage('stop');
    };
    this.queue.push(job);
    this.ready.then(() => this.pump(), () => { job.done = true; job.resolve(null); });
    return { promise, cancel };
  }
  pump() {
    if (this.cur || !this.queue.length || !this.w) return;
    const j = (this.cur = this.queue.shift()), o = j.opts;
    j.seen = performance.now();
    j.sign = j.fen.split(' ')[1] === 'w' ? 1 : -1;
    this.w.postMessage('setoption name MultiPV value ' + (o.multipv || 1));
    this.w.postMessage('setoption name Skill Level value ' + (o.skill ?? 20));
    this.w.postMessage('position fen ' + j.fen);
    // searchmoves must come last: Stockfish treats every token after it as a move
    this.w.postMessage('go' + (o.depth ? ' depth ' + o.depth : '') + (o.movetime ? ' movetime ' + o.movetime : '') + (o.searchmoves ? ' searchmoves ' + o.searchmoves : ''));
  }
  onLine(l) {
    const j = this.cur; if (!j) return;
    j.seen = performance.now();
    if (l.startsWith('info') && l.includes(' pv ') && l.includes(' score ') && !/ (upper|lower)bound/.test(l)) {
      const m = l.match(/score (cp|mate) (-?\d+)/); if (!m) return;
      const mpv = +((l.match(/ multipv (\d+)/) || [])[1] || 1), depth = +((l.match(/ depth (\d+)/) || [])[1] || 0);
      j.lines[mpv - 1] = { depth, score: normScore(m[1], +m[2], j.sign), pv: l.split(' pv ')[1].trim().split(/\s+/) };
      if (mpv === 1) j.depth = depth;
      if (j.onInfo) j.onInfo(j);
    } else if (l.startsWith('bestmove')) {
      const bm = l.split(' ')[1];
      this.cur = null; j.done = true;
      j.resolve({ bestmove: bm && bm !== '(none)' ? bm : null, lines: j.lines.filter(Boolean), depth: j.depth, cancelled: j.cancelled });
      this.pump();
    }
  }
}

// ======================================================================
// Shared helpers
// ======================================================================
const winPct = cp => 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * Math.max(-1500, Math.min(1500, cp)))) - 1);
function fmtScore(s) {
  if (!s) return '0.0';
  if (s.mate === 0) return '#';
  if (s.mate != null) return (s.mate > 0 ? '+' : '-') + 'M' + Math.abs(s.mate);
  const v = s.cp / 100; return (v > 0 ? '+' : '') + v.toFixed(1);
}
function showEval(s) {
  if (!s) s = { cp: 0, mate: null };
  const pct = s.mate === 0 ? (s.cp > 0 ? 100 : 0) : s.mate != null ? (s.mate > 0 ? 100 : 0) : winPct(s.cp);
  $('evalfill').style.height = pct + '%';
  const t = $('evaltext'), whiteAhead = s.cp >= 0;
  t.textContent = fmtScore(s).replace(/^[+-]/, '');
  // label sits on the side that's ahead
  const atBottom = whiteAhead !== isFlipped();
  t.className = 'evaltext ' + (atBottom ? 'bot' : 'top');
  t.style.color = whiteAhead ? '#333' : '#ddd';
}
const uciMove = u => ({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] || undefined });
const withTurn = (fen, t) => { const p = fen.split(' '); p[1] = t; p[3] = '-'; return p.join(' '); };
function matBal(c, color) {
  let s = 0;
  for (const row of c.board()) for (const p of row) if (p) s += p.color === color ? VAL[p.type] : -VAL[p.type];
  return s;
}

// ======================================================================
// Board renderer
// ======================================================================
let mode = 'play';
const flip = { play: false, review: false, puzzle: false, opening: false };
const isFlipped = () => flip[mode];
const boardEl = $('board');
function squareName(r, c) {
  const f = isFlipped() ? 7 - c : c, rank = isFlipped() ? r : 7 - r;
  return 'abcdefgh'[f] + (rank + 1);
}
function sqXY(sq) {
  const f = sq.charCodeAt(0) - 97, r = +sq[1] - 1;
  return [(isFlipped() ? 7 - f : f) + 0.5, (isFlipped() ? r : 7 - r) + 0.5];
}
function arrowSVG(a, b, color) {
  const [x1, y1] = sqXY(a), [x2, y2] = sqXY(b);
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, px = -uy, py = ux;
  const sw = 0.085, hw = 0.24, hl = 0.42, sx = x1 + ux * 0.22, sy = y1 + uy * 0.22, ex = x2 - ux * 0.08, ey = y2 - uy * 0.08;
  const bx = ex - ux * hl, by = ey - uy * hl;
  const pts = [[sx + px * sw, sy + py * sw], [bx + px * sw, by + py * sw], [bx + px * hw, by + py * hw], [ex, ey],
               [bx - px * hw, by - py * hw], [bx - px * sw, by - py * sw], [sx - px * sw, sy - py * sw]];
  return `<polygon points="${pts.map(p => p.map(v => v.toFixed(3)).join(',')).join(' ')}" fill="${color}" opacity=".82"/>`;
}
const KINFO = {
  brilliant: { sym: '!!', label: 'Brilliant', phrase: 'brilliant!!' },
  great: { sym: '!', label: 'Great', phrase: 'a great move' },
  best: { sym: '★', label: 'Best', phrase: 'the best move' },
  excellent: { sym: '✦', label: 'Excellent', phrase: 'excellent' },
  good: { sym: '✓', label: 'Good', phrase: 'good' },
  inaccuracy: { sym: '?!', label: 'Inaccuracy', phrase: 'an inaccuracy' },
  mistake: { sym: '?', label: 'Mistake', phrase: 'a mistake' },
  miss: { sym: '✕', label: 'Miss', phrase: 'a missed win' },
  blunder: { sym: '??', label: 'Blunder', phrase: 'a blunder' },
  forced: { sym: '□', label: 'Forced', phrase: 'forced' },
};
const KORDER = ['brilliant', 'great', 'best', 'excellent', 'good', 'inaccuracy', 'mistake', 'miss', 'blunder'];

function drawBoard({ pos, last, sel, targets = [], badge, arrows = [], marks = [], tints = {}, coords = true, blind = false, anim }) {
  boardEl.classList.toggle('blind', blind);
  boardEl.innerHTML = '';
  const inCheck = pos.in_check(), turn = pos.turn();
  const frag = document.createDocumentFragment();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const sq = squareName(r, c), el = document.createElement('div');
    const fi = sq.charCodeAt(0) - 97, ri = +sq[1] - 1;
    el.className = 'sq ' + ((fi + ri) % 2 ? 'l' : 'd') + (c === 7 ? ' edge-r' : '') + (r === 0 ? ' edge-t' : '');
    el.dataset.sq = sq;
    const p = pos.get(sq);
    if (last && (last.from === sq || last.to === sq)) el.classList.add('last');
    if (sel === sq) el.classList.add('sel');
    if (marks.includes(sq)) el.classList.add('mark');
    if (tints[sq]) el.classList.add('tint-' + tints[sq]);
    if (inCheck && p && p.type === 'k' && p.color === turn) el.classList.add('check');
    const t = targets.find(m => m.to === sq);
    if (t) { el.classList.add('hint'); if (p || t.flags.includes('e')) el.classList.add('cap'); }
    let html = '';
    if (coords && c === 0) html += `<span class="coord r">${sq[1]}</span>`;
    if (coords && r === 7) html += `<span class="coord f">${sq[0]}</span>`;
    if (p) html += pieceSVG(p.color, p.type);
    if (badge && badge.sq === sq) html += `<div class="badge k-${badge.kind}">${KINFO[badge.kind].sym}</div>`;
    el.innerHTML = html;
    frag.appendChild(el);
  }
  boardEl.appendChild(frag);
  $('arrows').innerHTML = arrows.map(a => arrowSVG(a.from, a.to, a.color)).join('');
  $('evalbar').classList.toggle('flipped', isFlipped());
  if (anim) animate(anim);
}
function animate(list) {
  const size = boardEl.clientWidth / 8;
  for (const { from, to } of list) {
    const pc = boardEl.querySelector(`[data-sq="${to}"] .pc`); if (!pc) continue;
    const [x1, y1] = sqXY(from), [x2, y2] = sqXY(to);
    pc.style.transition = 'none';
    pc.style.transform = `translate(${(x1 - x2) * size}px, ${(y1 - y2) * size}px)`;
    pc.getBoundingClientRect();
    pc.style.transition = 'transform .2s cubic-bezier(.25,.8,.25,1)';
    pc.style.transform = '';
  }
  for (const a of list) if (a.cap) fxCapture(a.to, 170);
}
// Little impact burst on a capture square.
function fxCapture(sq, delay = 0) {
  setTimeout(() => {
    const el = boardEl.querySelector(`[data-sq="${sq}"]`); if (!el) return;
    const b = document.createElement('div'); b.className = 'fx-burst'; el.appendChild(b);
    for (let k = 0; k < 9; k++) {
      const sp = document.createElement('div'), a = k / 9 * 2 * Math.PI + Math.random() * 0.5, d = 26 + Math.random() * 26;
      sp.className = 'fx-spark'; sp.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'px'); sp.style.setProperty('--dy', (Math.sin(a) * d).toFixed(1) + 'px');
      el.appendChild(sp);
    }
    setTimeout(() => el.querySelectorAll('.fx-burst, .fx-spark').forEach(x => x.remove()), 700);
  }, delay);
}
function confetti(n = 90) {
  const cols = ['#81b64c', '#e8b64c', '#5c8bb0', '#1baca6', '#fa412d', '#ebe3f6', '#ffa459'];
  for (let k = 0; k < n; k++) {
    const c = document.createElement('div');
    c.className = 'fx-confetti';
    c.style.left = Math.random() * 100 + 'vw'; c.style.background = cols[k % cols.length];
    c.style.animationDuration = (2.2 + Math.random() * 1.8) + 's'; c.style.animationDelay = Math.random() * 0.6 + 's';
    c.style.setProperty('--dx', (Math.random() * 30 - 15) + 'vw'); c.style.setProperty('--rot', (Math.random() * 1440 - 720) + 'deg');
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4800);
  }
}
function moveAnim(m, reverse = false) {
  const list = [{ from: m.from, to: m.to, cap: !reverse && !!m.captured }];
  const rank = m.color === 'w' ? '1' : '8';
  if (m.flags.includes('k')) list.push({ from: 'h' + rank, to: 'f' + rank });
  if (m.flags.includes('q')) list.push({ from: 'a' + rank, to: 'd' + rank });
  return reverse ? list.map(x => ({ from: x.to, to: x.from })) : list;
}

// ---------- Player cards ----------
function capturedHTML(pos) {
  const start = { p: 8, n: 2, b: 2, r: 2, q: 1 };
  const cnt = { w: { p: 0, n: 0, b: 0, r: 0, q: 0 }, b: { p: 0, n: 0, b: 0, r: 0, q: 0 } };
  for (const row of pos.board()) for (const p of row) if (p && p.type !== 'k') cnt[p.color][p.type]++;
  const diff = matBal(pos, 'w');
  const out = {};
  for (const me of ['w', 'b']) {
    const them = me === 'w' ? 'b' : 'w';
    let s = '';
    for (const t of ['q', 'r', 'b', 'n', 'p']) for (let i = cnt[them][t]; i < start[t]; i++) s += pieceSVG(them, t, '');
    const adv = me === 'w' ? diff : -diff;
    out[me] = s + (adv > 0 ? `<span class="adv">+${adv}</span>` : '');
  }
  return out;
}
function renderCards(pos, info, showCaps = true) {
  const caps = showCaps ? capturedHTML(pos) : { w: '', b: '' }, topC = isFlipped() ? 'w' : 'b', botC = topC === 'w' ? 'b' : 'w';
  const card = c => {
    const p = info[c];
    return `<div class="avatar ${c}">${esc(p.av)}</div><div><div class="pname">${esc(p.name)}${p.elo ? `<small>(${esc(p.elo)})</small>` : ''}${p.toMove ? '' : ''}</div>
      <div class="caps">${caps[c]}</div></div>${p.toMove ? '<span class="turn-dot" title="To move"></span>' : ''}${p.acc != null ? `<span class="accchip">${p.acc.toFixed(1)}</span>` : ''}`;
  };
  $('pTop').innerHTML = card(topC);
  $('pBot').innerHTML = card(botC);
}

// ======================================================================
// PLAY MODE
// ======================================================================
const LEVELS = [
  { skill: 0, depth: 3, time: 200, name: 'Beginner' },
  { skill: 4, depth: 6, time: 400, name: 'Casual' },
  { skill: 9, depth: 10, time: 700, name: 'Club' },
  { skill: 14, depth: 14, time: 1200, name: 'Expert' },
  { skill: 18, depth: 20, time: 2000, name: 'Master' },
  { skill: 20, depth: 99, time: 3000, name: 'Grandmaster' },
  { skill: 20, depth: 99, time: 8000, name: 'Maximum' },
];
const game = new Chess();
let playerColor = 'w', selected = null, lastMove = null, gameId = 0;
let thinkJob = null, hintJob = null, hintArrow = null, playScore = null, engineReady = false, pendingAnim = null;
const playEngine = new Engine();
const PC = { on: store.get('coach', true), notes: {}, card: null, token: 0, job: null };
playEngine.ready.then(() => { engineReady = true; updateStatus(); maybeEngineMove(); },
                      () => setStatus('Could not start the engine — open the app with "Play Chess.bat"'));

function drawPlay(anim) {
  if (mode !== 'play') return;
  drawBoard({
    pos: game, last: lastMove, sel: selected, targets: selected ? game.moves({ square: selected, verbose: true }) : [],
    arrows: hintArrow ? [{ ...hintArrow, color: '#81b64c' }] : [], badge: coachBadge(), anim,
  });
  const L = LEVELS[+$('level').value], turn = game.turn(), over = game.game_over();
  const me = { name: 'You', av: '🙂', toMove: !over && turn === playerColor };
  const sf = { name: 'Stockfish', elo: L.name, av: '♞', toMove: !over && turn !== playerColor };
  renderCards(game, playerColor === 'w' ? { w: me, b: sf } : { w: sf, b: me });
  showEval(playScore);
}
function maybeEngineMove() {
  if (!engineReady || game.game_over() || game.turn() === playerColor || thinkJob) return;
  const L = LEVELS[+$('level').value], gid = gameId;
  const job = playEngine.search(game.fen(), { skill: L.skill, depth: L.depth, movetime: L.time }, j => {
    const l = j.lines[0]; if (!l) return;
    playScore = l.score; if (mode === 'play') showEval(playScore);
    $('info').textContent = `depth ${l.depth} · ${fmtScore(l.score)}`;
  });
  thinkJob = job; updateStatus();
  job.promise.then(r => {
    if (thinkJob === job) thinkJob = null;
    if (!r || r.cancelled || gid !== gameId || !r.bestmove) { updateStatus(); return; }
    doMove(uciMove(r.bestmove));
  });
}
function stopThinking() {
  if (thinkJob) { thinkJob.cancel(); thinkJob = null; }
  if (hintJob) { hintJob.cancel(); hintJob = null; }
}
function doMove(mv) {
  const fb = game.fen(), res = game.move(mv);
  if (!res) return false;
  if (hintJob) { hintJob.cancel(); hintJob = null; }
  if (res.color === playerColor) coachMove(fb, res, game.history().length - 1);
  lastMove = { from: res.from, to: res.to };
  selected = null; hintArrow = null; gameId++;
  if (hintJob) { hintJob.cancel(); hintJob = null; }
  if (pendingAnim === false && res.captured) fxCapture(res.to);
  drawPlay(pendingAnim === false ? null : moveAnim(res)); pendingAnim = null;
  if (game.in_checkmate() && game.turn() !== playerColor) setTimeout(() => confetti(), 300);
  renderPlayMoves(); updateStatus(); savePlay();
  game.game_over() ? sfx('end') : moveSound(res);
  setTimeout(maybeEngineMove, 60);
  return true;
}
function tryUserMove(from, to, animate = true) {
  if (game.turn() !== playerColor || thinkJob || game.game_over()) return false;
  const moves = game.moves({ square: from, verbose: true }).filter(m => m.to === to);
  if (!moves.length) return false;
  pendingAnim = animate ? null : false;
  if (moves.some(m => m.promotion)) { askPromotion(playerColor, p => doMove({ from, to, promotion: p })); return true; }
  return doMove({ from, to });
}
function askPromotion(color, cb) {
  const box = $('promoChoices'); box.innerHTML = '';
  for (const p of ['q', 'r', 'b', 'n']) {
    const b = document.createElement('button'); b.innerHTML = pieceSVG(color, p, '');
    b.onclick = () => { $('promo').classList.remove('show'); cb(p); };
    box.appendChild(b);
  }
  $('promo').classList.add('show');
}
function renderPlayMoves() {
  const h = game.history(), el = $('moves');
  let html = '';
  const startNum = +game.fen().split(' ')[5] - Math.floor((h.length + (game.turn() === 'b' ? 1 : 0)) / 2);
  for (let i = 0; i < h.length; i += 2) {
    const cell = k => {
      const n = PC.notes[k], kb = n && n.kind ? `<i class="kb k-${n.kind}">${KINFO[n.kind].sym}</i>` : '';
      return `<span class="m${k === h.length - 1 ? ' cur' : ''}${n && n.kind ? ' t-' + n.kind : ''}">${kb}${h[k] || ''}</span>`;
    };
    html += `<span class="n">${startNum + i / 2}.</span>${cell(i)}${cell(i + 1)}`;
  }
  el.innerHTML = html || '<span></span><span class="m" style="color:var(--faint)">No moves yet</span>';
  el.scrollTop = el.scrollHeight;
}
function setStatus(t) { $('status').textContent = t; }
function updateStatus() {
  if (!engineReady) return setStatus('Loading engine…');
  if (game.in_checkmate()) return setStatus(game.turn() === playerColor ? '♚ Checkmate — Stockfish wins' : '🏆 Checkmate — you win!');
  if (game.in_stalemate()) return setStatus('½ Draw by stalemate');
  if (game.in_threefold_repetition()) return setStatus('½ Draw by repetition');
  if (game.insufficient_material()) return setStatus('½ Draw — insufficient material');
  if (game.in_draw()) return setStatus('½ Draw (50-move rule)');
  if (hintJob) return setStatus('💡 Finding a hint…');
  if (hintArrow) return setStatus(`💡 Try ${hintArrow.san}`);
  if (game.turn() === playerColor) return setStatus((game.in_check() ? '⚠ Check! ' : '') + 'Your move');
  setStatus('Stockfish is thinking…');
}
function newGame() {
  stopThinking(); game.reset(); gameId++; lastMove = null; selected = null; hintArrow = null; playScore = null;
  resetCoach();
  flip.play = playerColor === 'b';
  $('info').textContent = '';
  drawPlay(); renderPlayMoves(); updateStatus(); savePlay();
  setTimeout(maybeEngineMove, 300);
}

// ---------- Input (click + drag) ----------
let drag = null;
const playCtl = {
  pos: () => game, draw: () => drawPlay(), move: (f, t, anim) => tryUserMove(f, t, anim),
  canPick: p => p.color === playerColor && game.turn() === playerColor && !thinkJob && !game.game_over(),
};
// Tabs defined in their own files register { view, ctl, draw, init, enter, leave, flip } here.
const EXTRA_MODES = {};
const ctl = () => (mode === 'play' ? playCtl : mode === 'puzzle' ? puzzleCtl : mode === 'opening' ? opCtl : EXTRA_MODES[mode] ? EXTRA_MODES[mode].ctl : null);
boardEl.addEventListener('pointerdown', e => {
  const C = ctl(); if (!C || e.button > 0) return;
  const sqEl = e.target.closest('.sq'); if (!sqEl) return;
  const sq = sqEl.dataset.sq, p = C.pos().get(sq);
  if (C.click && C.click(sq)) return;
  if (selected && selected !== sq && C.move(selected, sq, true)) return;
  if (p && C.canPick(p)) {
    selected = sq; C.draw();
    const size = boardEl.clientWidth / 8, ghost = document.createElement('div');
    ghost.className = 'dragging'; ghost.style.width = ghost.style.height = size + 'px';
    ghost.innerHTML = pieceSVG(p.color, p.type);
    ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px';
    drag = { from: sq, ghost, moved: false, x: e.clientX, y: e.clientY };
    boardEl.setPointerCapture(e.pointerId);
  } else { selected = null; C.draw(); }
});
boardEl.addEventListener('pointermove', e => {
  if (!drag) return;
  if (!drag.moved) {
    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 4) return;
    drag.moved = true; document.body.appendChild(drag.ghost);
    const s = boardEl.querySelector(`[data-sq="${drag.from}"] .pc`); if (s) s.style.opacity = 0.25;
  }
  drag.ghost.style.left = e.clientX + 'px'; drag.ghost.style.top = e.clientY + 'px';
});
boardEl.addEventListener('pointerup', e => {
  if (!drag) return;
  const d = drag; drag = null; d.ghost.remove();
  if (!d.moved) return;
  const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('.sq');
  const C = ctl(); if (!C) return;
  if (!(el && el.dataset.sq !== d.from && C.move(d.from, el.dataset.sq, false))) C.draw();
});

// ---------- Play controls ----------
$('newBtn').onclick = newGame;
$('flipBtn').onclick = () => { flip.play = !flip.play; drawPlay(); };
$('level').onchange = () => { drawPlay(); savePlay(); };
document.querySelectorAll('#sideSeg button').forEach(b => (b.onclick = () => {
  document.querySelectorAll('#sideSeg button').forEach(x => x.classList.toggle('on', x === b));
  playerColor = b.dataset.side; newGame();
}));
$('undoBtn').onclick = () => {
  if (!game.history().length) return;
  stopThinking(); gameId++;
  game.undo();
  if (game.turn() !== playerColor) game.undo();
  const h = game.history({ verbose: true }), lm = h[h.length - 1];
  lastMove = lm ? { from: lm.from, to: lm.to } : null; selected = null; hintArrow = null;
  for (const k of Object.keys(PC.notes)) if (+k >= game.history().length) delete PC.notes[k];
  PC.token++; PC.card = null; renderPlayCoach();
  drawPlay(); renderPlayMoves(); updateStatus(); savePlay();
  setTimeout(maybeEngineMove, 100);
};
$('hintBtn').onclick = playHint;
$('playCoach').onclick = e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  if (b.dataset.act === 'takeback') $('undoBtn').click();
  else if (b.dataset.act === 'showbest' && PC.card && PC.card.bestUci) { hintArrow = { from: PC.card.bestUci.slice(0, 2), to: PC.card.bestUci.slice(2, 4), san: PC.card.bestSan }; drawPlay(); }
  else if (b.dataset.act === 'close') { PC.card = null; renderPlayCoach(); }
};
$('coachOn').checked = PC.on;
$('coachOn').onchange = () => { PC.on = $('coachOn').checked; store.set('coach', PC.on); if (!PC.on) { PC.token++; PC.card = null; renderPlayCoach(); drawPlay(); } };

// ---------- Live coach: judges each of your moves and explains hints ----------
let coachEngine = null;
function coachSearch(fen, opts) {
  if (!coachEngine) coachEngine = new Engine();
  const job = coachEngine.search(fen, { skill: 20, ...opts });
  PC.job = job;
  return job.promise.then(r => { if (PC.job === job) PC.job = null; return r && !r.cancelled ? r : null; });
}
function resetCoach() { PC.token++; PC.notes = {}; PC.card = null; if (PC.job) { PC.job.cancel(); PC.job = null; } renderPlayCoach(); }
// Badge on your last move's square (until the engine's reply lands on it).
function coachBadge() {
  const h = game.history({ verbose: true });
  for (let k = h.length - 1; k >= Math.max(0, h.length - 2); k--) {
    if (h[k].color !== playerColor) continue;
    const n = PC.notes[k];
    return n && n.kind && (k === h.length - 1 || h[k + 1].to !== h[k].to) ? { sq: h[k].to, kind: n.kind } : null;
  }
  return null;
}
async function coachMove(fb, m, k) {
  if (!PC.on) return;
  const token = ++PC.token, uci = m.from + m.to + (m.promotion || '');
  if (PC.job) { PC.job.cancel(); PC.job = null; }
  PC.notes[k] = { pending: true };
  PC.card = { kind: 'thinking', title: `Checking <b>${esc(m.san)}</b>…`, body: '<p><span class="spin"></span> Stockfish is judging your move.</p>' };
  renderPlayCoach();
  const j = await judge(fb, uci, null, coachSearch, { depth: 15, movetime: 2500 });
  if (token !== PC.token || !PC.notes[k]) return;
  if (!j) { delete PC.notes[k]; PC.card = null; renderPlayCoach(); return; }
  const after = new Chess(fb); after.move(uciMove(uci));
  const kind = j.best.pv[0] === uci || after.in_checkmate() ? 'best' : j.loss < 2 ? 'excellent' : j.loss < 5 ? 'good' : j.loss < 10 ? 'inaccuracy' : j.loss < 20 ? 'mistake' : 'blunder';
  PC.notes[k] = { kind };
  const bestSan = pvSan(fb, j.best.pv, 1)[0], bad = ['inaccuracy', 'mistake', 'blunder'].includes(kind);
  let body;
  if (bad) {
    const bi = moveIdea(fb, j.best);
    body = whyText(fb, uci, j) +
      `<div class="bestline"><div class="bh"><i class="kb k-best">★</i>Better was <b>${esc(bestSan)}</b></div>${bi.reasons.length ? `<div class="bwhy">${bi.reasons.join(' ')}</div>` : ''}${bi.line ? `<div class="ln">${bi.line}</div>` : ''}</div>`;
  } else body = ideaHTML(moveIdea(fb, j.played));
  PC.card = { kind, title: `<b>${esc(m.san)}</b> is ${KINFO[kind].phrase}`, body, score: j.played.score, bestUci: bad ? j.best.pv[0] : null, bestSan,
              actions: bad ? [{ id: 'takeback', label: '↶ Take back', primary: kind !== 'inaccuracy' }, { id: 'showbest', label: '★ Show best move' }] : [] };
  if (kind === 'blunder' || kind === 'mistake') sfx('wrong');
  renderPlayCoach(); renderPlayMoves(); drawPlay();
}
function renderPlayCoach() {
  const el = $('playCoach'), c = PC.card;
  el.hidden = !c; if (!c) return;
  const icon = c.kind === 'thinking' ? '<span class="spin"></span>' : c.kind === 'hint' ? '💡' : KINFO[c.kind].sym;
  el.style.setProperty('--kc', c.kind === 'thinking' ? 'var(--line)' : c.kind === 'hint' ? 'var(--gold)' : `var(--k-${c.kind})`);
  el.classList.remove('anim-in'); void el.offsetWidth; el.classList.add('anim-in'); // replay the entrance animation
  el.innerHTML = `<div class="coach-h"><i class="kb big ${KINFO[c.kind] ? 'k-' + c.kind : 'k-' + c.kind}">${icon}</i>
      <div class="coach-hd"><div class="coach-t">${c.title}</div><div class="coach-sub">${c.kind === 'hint' ? 'Hint from Stockfish' : 'Live coach'}</div></div>
      ${c.score ? `<span class="evchip ${c.score.cp >= 0 ? 'w' : 'b'}">${fmtScore(c.score)}</span>` : ''}
      <button class="coach-x" data-act="close" title="Hide">✕</button></div>
    <div class="coach-b">${c.body}</div>
    ${c.actions && c.actions.length ? `<div class="coach-act">${c.actions.map(a => `<button class="btn${a.primary ? ' primary' : ''}" data-act="${a.id}">${a.label}</button>`).join('')}</div>` : ''}`;
}
async function playHint() {
  if (!engineReady) return setStatus('Loading engine…');
  if (game.game_over()) return setStatus('The game is over — start a new one for hints.');
  if (game.turn() !== playerColor || thinkJob) return setStatus('💡 Wait for Stockfish to move, then ask for a hint.');
  if (hintJob) return;
  const fen = game.fen(), gid = gameId, token = ++PC.token;
  if (PC.job) { PC.job.cancel(); PC.job = null; }
  const job = { cancel() { if (PC.job) PC.job.cancel(); } };
  hintJob = job;
  PC.card = { kind: 'thinking', title: 'Finding the best move…', body: '<p><span class="spin"></span> Stockfish is searching deeply.</p>' };
  renderPlayCoach(); updateStatus();
  const r = await coachSearch(fen, { depth: 18, movetime: 3000 });
  if (hintJob === job) hintJob = null;
  if (gid !== gameId || token !== PC.token) { updateStatus(); return; }
  const line = r && r.lines[0];
  if (!line) { PC.card = null; renderPlayCoach(); updateStatus(); return; }
  const san = pvSan(fen, line.pv, 1)[0];
  hintArrow = { from: line.pv[0].slice(0, 2), to: line.pv[0].slice(2, 4), san };
  PC.card = { kind: 'hint', title: `Try <b>${esc(san)}</b>`, body: ideaHTML(moveIdea(fen, line)), score: line.score };
  drawPlay(); renderPlayCoach(); updateStatus();
}
$('reviewThisBtn').onclick = () => {
  if (!game.history().length) { setStatus('Play some moves first!'); return; }
  const L = LEVELS[+$('level').value].name;
  const names = playerColor === 'w' ? { white: 'You', black: 'Stockfish ' + L } : { white: 'Stockfish ' + L, black: 'You' };
  setMode('review');
  loadReview(game.pgn(), { ...names, userColor: playerColor, title: 'Your game vs Stockfish' });
};

// ======================================================================
// REVIEW MODE
// ======================================================================
// Fixed depth (with a safety time cap) so the best move and the played move are scored on equal terms.
const QUAL = [{ time: 2500, depth: 11 }, { time: 6000, depth: 14 }, { time: 12000, depth: 18 }];
let qIdx = store.get('quality', 1);
let reviewEngine = null;
const R = { token: 0, job: null, meta: null, fens: [], moves: [], evals: [], cls: [], idx: 0, done: false, sub: 'summary' };

function terminalEval(fen) {
  const c = new Chess(fen);
  if (c.in_checkmate()) return { cp: c.turn() === 'w' ? -10000 : 10000, mate: 0, pv: [], best: null, terminal: true };
  if (c.in_draw() || c.in_stalemate() || c.insufficient_material()) return { cp: 0, mate: null, pv: [], best: null, terminal: true };
  return null;
}
function loadReview(pgn, meta = {}) {
  const c = new Chess();
  let ok = c.load_pgn(pgn, { sloppy: true });
  if (!ok) ok = c.load_pgn(pgn.replace(/\{[^}]*\}/g, '').replace(/\$\d+/g, '').replace(/\([^()]*\)/g, ''), { sloppy: true });
  const hist = ok ? c.history({ verbose: true }) : [];
  if (!ok || !hist.length) { showImport(); msg('Could not read any moves from that PGN.', true); return false; }
  const hdr = c.header();
  const g = new Chess(hdr.FEN || DEFAULT_FEN);
  R.token++; if (R.job) { R.job.cancel(); R.job = null; }
  R.fens = [g.fen()]; R.moves = []; R.evals = []; R.cls = []; R.done = false; R.idx = 0; R.running = 0; R.cur = 0; R.eta = 0;
  for (const h of hist) { const m = g.move(h.san); m.uci = m.from + m.to + (m.promotion || ''); R.moves.push(m); R.fens.push(g.fen()); }
  const opening = hdr.ECOUrl ? decodeURIComponent(hdr.ECOUrl.split('/').pop()).replace(/-/g, ' ') : (hdr.Opening || '');
  R.meta = {
    white: meta.white || hdr.White || 'White', black: meta.black || hdr.Black || 'Black',
    welo: meta.welo || hdr.WhiteElo, belo: meta.belo || hdr.BlackElo,
    result: hdr.Result || '*', opening, date: (hdr.Date || '').replace(/\./g, '-'), userColor: meta.userColor || 'w', title: meta.title,
  };
  flip.review = R.meta.userColor === 'b';
  $('rvImport').hidden = true; $('rvGame').hidden = false;
  showSub('summary');
  $('rvTitle').innerHTML = `${esc(R.meta.white)} vs ${esc(R.meta.black)} <span style="color:var(--muted);font-weight:500">${esc(R.meta.result)}</span>
    <small>${esc([R.meta.opening, R.meta.date].filter(Boolean).join(' · ') || R.meta.title || '')}</small>`;
  refreshReview();
  analyzeAll(R.token);
  return true;
}
async function analyzeAll(token) {
  if (R.running === token) return;
  R.running = token;
  try { await analyzeLoop(token); } finally { if (R.running === token) R.running = 0; }
}
async function analyzeLoop(token) {
  if (!reviewEngine) reviewEngine = new Engine();
  try { await reviewEngine.ready; } catch { $('rvProgTxt').textContent = 'Engine failed to start'; return; }
  $('rvProg').hidden = false;
  const q = QUAL[qIdx], n = R.fens.length, t0 = performance.now(), start = R.evals.filter(Boolean).length;
  for (let k = 0; k < n; k++) {
    if (token !== R.token) return;
    if (R.evals[k]) continue; // already analyzed (resuming)
    R.cur = k;
    try { await analyzePos(k, q, token); }
    catch (e) { console.error('review: position', k, 'failed', e); }
    if (token !== R.token) return;
    if (!R.evals[k]) { const p = R.evals[k - 1]; R.evals[k] = p ? { cp: p.cp, mate: p.mate, pv: [], best: null } : { cp: 0, mate: null, pv: [], best: null }; }
    if (k > 0) { try { R.cls[k - 1] = classify(k - 1); } catch (e) { console.error('classify', e); R.cls[k - 1] = { kind: 'good', loss: 0, acc: 100, wb: 50, wa: 50 }; } }
    const done = R.evals.filter(Boolean).length, rate = (performance.now() - t0) / Math.max(1, done - start);
    $('rvBar').style.width = (done / n * 100) + '%';
    R.eta = Math.round(rate * (n - done) / 1000);
    progText();
    // a drawing error must never stop the analysis
    try { refreshReview(k); } catch (e) { console.error('review render', e); }
  }
  R.done = true; R.cur = -1;
  $('rvProg').hidden = true;
  refreshReview();
  sfx('end');
}
function progText(depth) {
  const n = R.fens.length, done = R.evals.filter(Boolean).length;
  if (done >= n) { $('rvProgTxt').textContent = ''; return; }
  $('rvProgTxt').textContent = `Analyzing move ${Math.max(1, Math.ceil((R.cur + 0.5) / 2))} of ${Math.ceil((n - 1) / 2)}` +
    (depth ? ` · depth ${depth}/${QUAL[qIdx].depth}` : '') + (R.eta ? ` · ~${R.eta}s left` : '');
}
async function analyzePos(k, q, token) {
  let ev = terminalEval(R.fens[k]);
  if (!ev) {
    const legal = new Chess(R.fens[k]).moves().length;
    const r = await runJob(R.fens[k], { multipv: legal > 1 ? 2 : 1, movetime: q.time, depth: legal > 1 ? q.depth : 6, skill: 20 }, token)
      // the engine keeps crashing on this position: skip it (reuse the previous eval) instead of freezing the whole review
      || (token === R.token ? { lines: [], bestmove: null, skipped: true } : null);
    if (!r) return;
    if (r.skipped) console.warn('review: skipped position', k, R.fens[k]);
    const prev = R.evals[k - 1];
    const l0 = r.lines[0] || (r.skipped && prev ? { score: { cp: prev.cp, mate: prev.mate }, pv: [], depth: 0 } : null);
    ev = l0 ? { cp: l0.score.cp, mate: l0.score.mate, pv: l0.pv, best: r.bestmove || l0.pv[0], second: r.lines[1] ? r.lines[1].score : null, depth: l0.depth }
            : { cp: 0, mate: null, pv: [], best: r.bestmove };
    // Score the move actually played from the same root and depth (avoids side-to-move eval bias).
    const mv = R.moves[k];
    if (mv) {
      const hit = r.lines.find(l => l.pv[0] === mv.uci);
      if (hit) ev.played = { cp: hit.score.cp, mate: hit.score.mate, pv: hit.pv };
      else {
        const r2 = await runJob(R.fens[k], { multipv: 1, movetime: q.time, depth: q.depth, skill: 20, searchmoves: mv.uci }, token);
        if (!r2 && token !== R.token) return;
        const p = r2 && r2.lines[0];
        if (p) ev.played = { cp: p.score.cp, mate: p.score.mate, pv: p.pv };
      }
    }
  }
  if (token === R.token) R.evals[k] = ev;
}

async function runJob(fen, opts, token, retry = true) {
  const eng = reviewEngine, job = eng.search(fen, opts, j => progText(j.depth));
  R.job = job;
  // watchdog: a search may legitimately run long, but an engine that goes silent has hung or crashed —
  // restart it and try once more
  const t0 = performance.now(), cap = (opts.movetime || 5000) + 8000;
  let timer;
  const stalled = new Promise(res => (timer = setInterval(() => {
    const cur = eng.cur, quiet = cur ? performance.now() - (cur.seen || t0) : performance.now() - t0;
    if (document.hidden) return; // the browser may pause workers in background tabs — don't count that
    if (quiet > 10000 || performance.now() - t0 > cap * 2) res('timeout');
  }, 1000)));
  const r = await Promise.race([job.promise, stalled]);
  clearInterval(timer);
  if (R.job === job) R.job = null;
  if (r === 'timeout') {
    console.warn('review engine stalled — restarting it');
    try { eng.w.terminate(); } catch {}
    if (reviewEngine === eng) reviewEngine = new Engine();
    try { await reviewEngine.ready; } catch { return null; }
    return token === R.token && retry ? runJob(fen, opts, token, false) : null;
  }
  return token !== R.token || !r || r.cancelled ? null : r;
}
// If the tab was in the background (or the engine died) pick the analysis up where it stopped.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && R.fens.length && !R.done && !R.running) analyzeAll(R.token);
});
// Score of the played move i (falls back to the next position's eval).
function playedOf(i) {
  const e0 = R.evals[i], e1 = R.evals[i + 1];
  if (e1 && e1.terminal) return { cp: e1.cp, mate: e1.mate, pv: [R.moves[i].uci] };
  return (e0 && e0.played) || { cp: e1.cp, mate: e1.mate, pv: [R.moves[i].uci, ...e1.pv] };
}

// ---------- Tactical helpers ----------
// Best capture the side to move can make, accounting for a single recapture.
function threatened(fen) {
  const c = new Chess(fen); let best = { net: 0 };
  for (const m of c.moves({ verbose: true })) {
    // in a flipped-turn position the king can be "capturable" — taking it would break chess.js
    if (!m.captured || m.captured === 'k') continue;
    const gain = VAL[m.captured];
    c.move(m);
    const recap = c.moves({ verbose: true }).some(r => r.to === m.to);
    c.undo();
    const net = recap ? gain - VAL[m.piece] : gain;
    if (net > best.net) best = { net, piece: m.captured, square: m.to, by: m };
  }
  return best;
}
// Pieces attacked by the piece that just moved (for fork detection).
function forkInfo(fen, uci) {
  try {
    const c = new Chess(fen), m = c.move(uciMove(uci)); if (!m) return null;
    const t = new Chess(); if (!t.load(withTurn(c.fen(), m.color))) return null;
    const hits = [...new Set(t.moves({ square: m.to, verbose: true }).filter(x => x.captured).map(x => x.captured))];
    if (c.in_check() && !hits.includes('k')) hits.push('k');
    const big = hits.filter(p => p === 'k' || VAL[p] > VAL[m.piece] || VAL[p] >= 5);
    if (big.length < 2) return null;
    big.sort((a, b) => (b === 'k' ? 99 : VAL[b]) - (a === 'k' ? 99 : VAL[a]));
    return big.slice(0, 2).map(p => NAME[p]).join(' and ');
  } catch { return null; }
}
// Material change (from `color`'s point of view) along an engine line.
function materialSwing(fen, pv, color, maxPly = 8, firstQuiet = false) {
  const c = new Chess(fen), base = matBal(c, color), bals = [], moves = [];
  for (const u of pv.slice(0, maxPly + 2)) { const m = c.move(uciMove(u)); if (!m) break; moves.push(m); bals.push(matBal(c, color)); }
  if (!bals.length) return { delta: 0 };
  // stop counting at a quiet point, so a half-finished trade isn't read as won/lost material
  const n = bals.length;
  let idx = n;
  if (firstQuiet) { for (let j = 1; j <= Math.min(n, maxPly); j++) if (j === n || !moves[j].captured) { idx = j; break; } }
  else for (let j = Math.min(n, maxPly); j >= 1; j--) if (j === n || !moves[j].captured) { idx = j; break; }
  let won = null, lost = null;
  for (const m of moves.slice(0, idx)) {
    if (!m.captured) continue;
    if (m.color === color) { if (!won || VAL[m.captured] > VAL[won]) won = m.captured; }
    else if (!lost || VAL[m.captured] > VAL[lost]) lost = m.captured;
  }
  return { delta: bals[idx - 1] - base, wonPiece: won, lostPiece: lost };
}
function matWord(d, piece) {
  if (piece === 'q' && d >= 6) return 'the queen';
  if (piece === 'r' && d >= 4) return 'a rook';
  if (piece === 'r' && d >= 2) return 'the exchange';
  if ((piece === 'n' || piece === 'b') && d >= 2) return 'a ' + NAME[piece];
  if (d <= 1) return 'a pawn';
  return `${d} pawns' worth of material`;
}
function pvSan(fen, pv, n = 6) {
  const c = new Chess(fen), out = [];
  for (const u of (pv || []).slice(0, n)) { const m = c.move(uciMove(u)); if (!m) break; out.push(m.san); }
  return out;
}
function lineText(fen, sans) {
  const p = fen.split(' '); let num = +p[5], w = p[1] === 'w';
  return sans.map((s, k) => { const t = w ? `${num}.${s}` : (k === 0 ? `${num}…${s}` : s); if (!w) num++; w = !w; return t; }).join(' ');
}

// The engine's score in plain words, from `side`'s point of view.
function evalWords(score, side) {
  const s = side === 'w' ? 1 : -1, them = side === 'w' ? 'Black' : 'White';
  if (score.mate != null) return score.mate * s > 0 ? `you have a forced mate in ${Math.abs(score.mate)}` : `${them} has a forced mate in ${Math.abs(score.mate)}`;
  const v = score.cp * s / 100;
  if (v >= 3) return 'you are winning';
  if (v >= 1.5) return 'you are clearly better';
  if (v >= 0.5) return 'you are slightly better';
  if (v > -0.5) return 'the position is about equal';
  if (v > -1.5) return `${them} is slightly better`;
  if (v > -3) return `${them} is clearly better`;
  return `${them} is winning`;
}
// What a move achieves, read only from facts on the board and Stockfish's own main line —
// every claim (wins material, fork, attack, defence) is checked, nothing is guessed.
function moveIdea(fen, line) {
  const side = fen.split(' ')[1], s = side === 'w' ? 1 : -1, opp = side === 'w' ? 'b' : 'w', them = side === 'w' ? 'Black' : 'White';
  const B = x => `<b>${x}</b>`, sans = pvSan(fen, line.pv, 6), reasons = [];
  const c = new Chess(fen), m = line.pv[0] && c.move(uciMove(line.pv[0]));
  const res = { reasons, line: sans.length ? lineText(fen, sans) : '', evalTxt: `${fmtScore(line.score)} — ${evalWords(line.score, side)}` };
  if (!m) return res;
  const fa = c.fen();
  if (c.in_checkmate()) { reasons.push('It is checkmate!'); return res; }
  if (line.score.mate != null && line.score.mate * s > 0) { reasons.push(`It forces checkmate in ${Math.abs(line.score.mate)} — ${them} cannot stop it.`); return res; }
  const fork = forkInfo(fen, line.pv[0]), sw = materialSwing(fen, line.pv, side);
  if (fork) reasons.push(`It forks the ${fork} — both are attacked at once and only one can be saved.`);
  if (sw.delta >= 2) reasons.push(`It wins ${matWord(sw.delta, sw.wonPiece)} by force (see the line below).`);
  else if (m.captured && sw.delta >= 0) reasons.push(`It takes the ${NAME[m.captured]} on ${m.to}${sw.delta === 0 ? ' — the trade comes out even' : ''}.`);
  const before = threatened(withTurn(fen, opp)), after = threatened(fa);
  if (before.net >= 2 && after.net < before.net && sw.delta < 2)
    reasons.push(`Your ${NAME[before.piece]} on ${before.square} was under attack and could be lost — this move takes care of it.`);
  const thr = threatened(withTurn(fa, side));
  if (!fork && sw.delta < 2 && thr.net >= 2 && thr.piece !== 'p')
    reasons.push(`It attacks the ${NAME[thr.piece]} on ${thr.square}, so ${them} has to spend a move defending it.`);
  if (c.in_check() && !reasons.length) reasons.push(`It gives check, so ${them} must answer it and has no time for their own plans.`);
  if (!reasons.length) {
    const ply = +fen.split(' ')[5], rank = side === 'w' ? '1' : '8';
    if (m.flags.includes('k') || m.flags.includes('q')) reasons.push('Castling gets your king to safety and brings a rook toward the center.');
    else if (m.promotion) reasons.push(`It promotes the pawn to a ${NAME[m.promotion]}.`);
    else if (ply <= 12 && 'nb'.includes(m.piece) && m.from[1] === rank) reasons.push('It develops a piece toward the center, getting you closer to castling.');
    else if (ply <= 8 && m.piece === 'p' && 'de'.includes(m.from[0])) reasons.push('It grabs space in the center and opens lines for your pieces.');
    else if (sw.delta <= -1) reasons.push(`It gives up ${matWord(-sw.delta, sw.lostPiece)}, but Stockfish sees enough play in return (see the line).`);
    else reasons.push(`A quiet improving move — every other try gives ${them} more chances.`);
  }
  return res;
}
const ideaHTML = (idea, withEval = true) => idea.reasons.map(r => `<p>${r}</p>`).join('') +
  (idea.line ? `<p class="why-line">Stockfish's line: <b>${idea.line}</b></p>` : '') + (withEval ? `<p class="why-eval">Evaluation: <b>${idea.evalTxt}</b></p>` : '');

const isRecapture = i => i > 0 && !!R.moves[i].captured && !!R.moves[i - 1].captured && R.moves[i - 1].to === R.moves[i].to;

// ---------- Classification ----------
function classify(i) {
  const mv = R.moves[i], e0 = R.evals[i], pl = playedOf(i), s = mv.color === 'w' ? 1 : -1;
  const wb = winPct(e0.cp * s), wa = winPct(pl.cp * s), loss = Math.max(0, wb - wa);
  const acc = Math.max(0, Math.min(100, 103.1668 * Math.exp(-0.04354 * loss) - 3.1669));
  const legal = new Chess(R.fens[i]).moves().length;
  const isBest = mv.uci === e0.best;
  let kind;
  if (legal === 1) kind = 'forced';
  else if (isBest || new Chess(R.fens[i + 1]).in_checkmate()) kind = 'best';
  else if (loss < 2) kind = 'excellent';
  else if (loss < 5) kind = 'good';
  else if (loss < 10) kind = 'inaccuracy';
  else if (loss < 20) kind = 'mistake';
  else kind = 'blunder';

  if (kind === 'best' || kind === 'excellent') {
    const opp = mv.color === 'w' ? 'b' : 'w';
    const t = threatened(R.fens[i + 1]), before = threatened(withTurn(R.fens[i], opp));
    const capV = mv.captured ? VAL[mv.captured] : 0;
    if (t.net - capV >= 2 && VAL[t.piece] >= 3 && t.net > before.net && wa >= 45 && wb < 97) kind = 'brilliant';
    else if (kind === 'best' && !isRecapture(i) && e0.second && wb - winPct(e0.second.cp * s) >= 15 && wb > 25 && wb < 97) kind = 'great';
  }
  if ((kind === 'inaccuracy' || kind === 'mistake') && i > 0 && R.cls[i - 1] && ['mistake', 'blunder'].includes(R.cls[i - 1].kind) && wb >= 55) kind = 'miss';
  return { kind, loss, acc, wb, wa };
}

// ---------- Explanations ----------
function explain(i) {
  const mv = R.moves[i], c = R.cls[i], e0 = R.evals[i], e1 = playedOf(i), reply = e1.pv.slice(1);
  const side = mv.color, s = side === 'w' ? 1 : -1, fb = R.fens[i], fa = R.fens[i + 1], k = c.kind;
  const them = side === 'w' ? 'Black' : 'White';
  const T = [], B = x => `<b>${x}</b>`;
  const bestSans = pvSan(fb, e0.pv, 6), bestSan = bestSans[0] || '';
  const replySans = pvSan(fa, reply, 6);
  const notBest = k !== 'forced' && mv.uci !== e0.best && !!bestSan;
  const after = new Chess(fa);

  if (after.in_checkmate()) return { T: ['Checkmate — game over. Beautifully finished! 🎉'], best: null };
  if (k === 'forced') T.push('This was the only legal move.');
  const hadMate = e0.mate != null && e0.mate * s > 0, keepsMate = e1.mate != null && e1.mate * s > 0;
  const facingMate = e1.mate != null && e1.mate * s < 0, wasFacingMate = e0.mate != null && e0.mate * s < 0;

  if (k === 'brilliant') { const t = threatened(fa); T.push(`A sacrifice! Your ${NAME[t.piece]} on ${t.square} can be taken, but the engine confirms it works — grabbing it is bad for ${them}.`); }
  if (k === 'great') T.push('The only strong move in the position — every alternative was clearly worse. Well found!');
  if (k === 'miss') T.push(`${them}'s last move was a mistake, but this move doesn't take advantage of it.`);

  if (hadMate && !keepsMate) T.push(`You had a forced checkmate in ${Math.abs(e0.mate)}: ${B(lineText(fb, bestSans))}`);
  const allowsMate = facingMate && !wasFacingMate;
  if (allowsMate) T.push(`This allows a forced checkmate in ${Math.abs(e1.mate)}: ${B(lineText(fa, replySans))}${bestSan ? ` — ${B(bestSan)} would have prevented it.` : ''}`);
  else if (facingMate && wasFacingMate && c.loss < 5) T.push(`${them} already had a forced mate here — there was no defence.`);

  if (c.loss >= 5 && !facingMate && !hadMate) {
    const played = materialSwing(fb, e1.pv, side), best = materialSwing(fb, e0.pv, side);
    if (played.delta <= -2 && best.delta - played.delta >= 2) {
      const t = threatened(fa);
      if (t.net >= 2 && reply[0] && reply[0].slice(2, 4) === t.square)
        T.push(`This leaves your ${NAME[t.piece]} on ${t.square} unprotected — ${B(replySans[0])} wins it.`);
      else T.push(`This loses material: ${them} answers ${B(replySans[0])} and wins ${matWord(-played.delta, played.lostPiece)}. Line: ${B(lineText(fa, replySans))}`);
    } else if (best.delta >= 2 && best.delta - played.delta >= 2) {
      const fork = forkInfo(fb, e0.pv[0]);
      T.push(`You missed ${B(bestSan)}, which wins ${matWord(best.delta, best.wonPiece)}${fork ? ` — it forks the ${fork}` : ''}.`);
    } else {
      const ev0 = fmtScore(e0), ev1 = fmtScore(e1);
      if (c.wb >= 60 && c.wa < 55) T.push(`This lets your advantage slip away — the evaluation drops from ${B(ev0)} to ${B(ev1)}.`);
      else if (c.wb >= 40 && c.wa < 40) T.push(`This hands ${them} the upper hand — the evaluation swings from ${B(ev0)} to ${B(ev1)}.`);
      else T.push(`This makes your position worse (${B(ev0)} → ${B(ev1)}).`);
      if (replySans[0]) {
        const rFork = reply[0] && forkInfo(fa, reply[0]);
        T.push(rFork ? `Watch out for ${B(replySans[0])}, forking your ${rFork}.`
                     : `${them}'s strongest reply is ${B(replySans[0])}${/\+/.test(replySans[0]) ? ', with check' : ''}.`);
      }
    }
  }

  if (c.loss < 5 && k !== 'forced' && k !== 'brilliant' && !allowsMate) {
    const fork = forkInfo(fb, mv.uci), played = materialSwing(fb, e1.pv, side, 8, true);
    const rank = mv.color === 'w' ? '1' : '8';
    if (keepsMate) T.push(`Forces checkmate in ${Math.abs(e1.mate)}: ${B(lineText(fa, replySans))}`);
    else if (fork) T.push(`A fork! Your ${NAME[mv.piece]} attacks the ${fork} at the same time.`);
    else if (mv.flags.includes('k') || mv.flags.includes('q')) T.push('Castling tucks your king into safety and connects your rooks.');
    else if (mv.promotion) T.push(`Promotes to a ${NAME[mv.promotion]}!`);
    else if (isRecapture(i)) T.push(`Recaptures on ${mv.to}, keeping the material level.`);
    else if (mv.captured && played.delta >= 1) T.push(`Wins ${matWord(played.delta, played.wonPiece)}.`);
    else if (mv.captured) T.push('A good trade that keeps the balance.');
    else if (i < 20 && 'nb'.includes(mv.piece) && mv.from[1] === rank) T.push('Develops a piece toward the center.');
    else if (i < 12 && mv.piece === 'p' && 'de'.includes(mv.from[0])) T.push('Stakes a claim in the center.');
    else if (/\+/.test(mv.san) && k === 'best') T.push('A strong check that keeps the initiative.');
    if ((k === 'best' || k === 'excellent' || k === 'great') && !T.length) T.push(...moveIdea(fb, { pv: e1.pv, score: e1 }).reasons);
    if (k === 'excellent') T.push('Nearly as strong as the top move — the evaluation barely changes.');
    if (k === 'good') T.push(`A solid move, though ${B(bestSan)} was a bit more precise.`);
  }
  const showBest = notBest && !['best', 'brilliant', 'great'].includes(k);
  return { T, best: showBest ? { san: bestSan, line: lineText(fb, bestSans), why: moveIdea(fb, { pv: e0.pv, score: e0 }).reasons } : null };
}

// ---------- Review rendering ----------
function accuracyOf(color) {
  const a = [];
  R.cls.forEach((c, i) => { if (c && R.moves[i].color === color && c.kind !== 'forced') a.push(c.acc); });
  if (!a.length) return null;
  const mean = a.reduce((x, y) => x + y, 0) / a.length, harm = a.length / a.reduce((t, x) => t + 1 / Math.max(x, 5), 0);
  return (mean + harm) / 2;
}
function counts() {
  const r = { w: {}, b: {} };
  R.cls.forEach((c, i) => { if (c) r[R.moves[i].color][c.kind] = (r[R.moves[i].color][c.kind] || 0) + 1; });
  return r;
}
function renderSummary() {
  const aw = accuracyOf('w'), ab = accuracyOf('b'), ct = counts(), m = R.meta;
  const accBox = (c, name, acc) => `<div class="acc ${c}"><div class="avatar ${c}">${esc(name[0] || '?').toUpperCase()}</div>
      <div class="nm">${esc(name)}</div><div class="num">${acc == null ? '<span class="spin"></span>' : acc.toFixed(1)}</div><div class="lbl">Accuracy</div></div>`;
  let rows = '';
  for (const k of KORDER) {
    const w = ct.w[k] || 0, b = ct.b[k] || 0;
    rows += `<div class="krow"><span class="wc t-${k} ${w ? '' : 'zero'}">${w}</span><span class="kname"><i class="kb k-${k}">${KINFO[k].sym}</i>${KINFO[k].label}</span><span class="bc t-${k} ${b ? '' : 'zero'}">${b}</span></div>`;
  }
  $('rvSummary').innerHTML = `<div class="acc-row">${accBox('w', m.white, aw)}<span class="vs">VS</span>${accBox('b', m.black, ab)}</div>
    <div class="ktable">${rows}</div>
    <button class="btn primary wide" id="startReview">${R.done ? '▶ Start Review' : '▶ Start Review (analysis continues)'}</button>`;
  $('startReview').onclick = () => { showSub('moves'); setIdx(firstInteresting()); };
}
function firstInteresting() { return 1; }
function renderGraph() {
  const n = R.fens.length, W = 1000, H = 100;
  if (n < 2) { $('graph').innerHTML = ''; return; }
  const X = k => k / (n - 1) * W, Y = cp => H * (1 - winPct(cp) / 100);
  let d = `M0,${H}`, last = 0;
  for (let k = 0; k < n && R.evals[k]; k++) { d += ` L${X(k).toFixed(1)},${Y(R.evals[k].cp).toFixed(1)}`; last = k; }
  d += ` L${X(last).toFixed(1)},${H} Z`;
  let dots = '';
  R.cls.forEach((c, i) => {
    if (!c || !['brilliant', 'great', 'inaccuracy', 'mistake', 'miss', 'blunder'].includes(c.kind)) return;
    if (c.kind === 'inaccuracy') return;
    dots += `<span class="gdot k-${c.kind}" style="left:${X(i + 1) / 10}%;top:${Y(R.evals[i + 1].cp)}%"></span>`;
  });
  const cur = R.sub === 'moves' ? `<div class="gcur" style="left:${X(R.idx) / 10}%"></div>` : '';
  $('graph').innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${d}" fill="#eef1f5"/>
    <line x1="0" y1="50" x2="${W}" y2="50" stroke="rgba(130,140,160,.6)" stroke-width="1" vector-effect="non-scaling-stroke" stroke-dasharray="4 4"/></svg>${dots}${cur}`;
}
function renderReviewMoves() {
  const el = $('rvMoveList'); let html = '';
  const startNum = +R.fens[0].split(' ')[5], blackFirst = R.fens[0].split(' ')[1] === 'b';
  const cell = i => {
    if (i < 0 || i >= R.moves.length) return '<span class="m"></span>';
    const c = R.cls[i], notable = c && !['best', 'excellent', 'good'].includes(c.kind);
    return `<span class="m${R.idx === i + 1 ? ' cur' : ''}" data-i="${i + 1}">${c ? `<i class="kb k-${c.kind}" style="${notable ? '' : 'opacity:.55;transform:scale(.8)'}">${KINFO[c.kind].sym}</i>` : '<i class="kb" style="background:rgba(255,255,255,.06)"></i>'}<span class="${c ? 't-' + (notable ? c.kind : '') : ''}">${R.moves[i].san}</span></span>`;
  };
  const off = blackFirst ? 1 : 0;
  for (let i = -off, row = 0; i < R.moves.length; i += 2, row++) html += `<span class="n">${startNum + row}.</span>${cell(i)}${cell(i + 1)}`;
  el.innerHTML = html;
  const cur = el.querySelector('.m.cur');
  if (cur) { const top = cur.offsetTop - el.offsetTop; if (top < el.scrollTop || top > el.scrollTop + el.clientHeight - 30) el.scrollTop = top - el.clientHeight / 2; }
}
function renderCoach() {
  const n = R.idx, el = $('coach');
  if (n === 0) {
    el.style.setProperty('--kc', 'var(--line)');
    el.innerHTML = `<div class="coach-h"><i class="kb big" style="background:linear-gradient(145deg,#f3cf7a,#c38e2c)">♞</i><div><div class="coach-t">Let's review this game</div>
      <div class="coach-sub">${esc(R.meta.opening || 'Starting position')}</div></div></div>
      <div class="coach-b"><p>Use <b>→</b> / <b>←</b> (or the buttons) to step through each move. I'll tell you which moves were good, which were mistakes — and why.</p></div>`;
    return;
  }
  const i = n - 1, mv = R.moves[i], c = R.cls[i];
  const who = `${mv.color === 'w' ? R.meta.white : R.meta.black} · move ${Math.ceil(n / 2) + +R.fens[0].split(' ')[5] - 1}`;
  if (!c) {
    el.style.setProperty('--kc', 'var(--line)');
    el.innerHTML = `<div class="coach-h"><i class="kb big" style="background:rgba(255,255,255,.08)"><span class="spin"></span></i><div><div class="coach-t"><b>${mv.san}</b></div><div class="coach-sub">${esc(who)}</div></div></div>
      <div class="coach-b"><p>Stockfish is still analyzing this move…</p></div>`;
    return;
  }
  const ex = explain(i), e = playedOf(i);
  el.style.setProperty('--kc', `var(--k-${c.kind})`);
  el.innerHTML = `<div class="coach-h"><i class="kb big k-${c.kind}">${KINFO[c.kind].sym}</i>
      <div><div class="coach-t"><b>${mv.san}</b> is ${KINFO[c.kind].phrase}</div><div class="coach-sub">${esc(who)}</div></div>
      <span class="evchip ${e.cp >= 0 ? 'w' : 'b'}">${fmtScore(e)}</span></div>
    <div class="coach-b">${ex.T.map(t => `<p>${t}</p>`).join('')}</div>
    ${ex.best ? `<div class="bestline"><div class="bh"><i class="kb k-best">★</i>Best was <b>${ex.best.san}</b></div>${ex.best.why.length ? `<div class="bwhy">${ex.best.why.join(' ')}</div>` : ''}<div class="ln">${ex.best.line}</div></div>` : ''}`;
}
function drawReview(anim) {
  if (mode !== 'review') return;
  if (!R.fens.length) {
    drawBoard({ pos: new Chess() });
    renderCards(new Chess(), { w: { name: 'White', av: 'W' }, b: { name: 'Black', av: 'B' } });
    showEval(null); return;
  }
  const n = R.idx, pos = new Chess(R.fens[n]), m = R.moves[n - 1], c = R.cls[n - 1];
  const arrows = [];
  if (m && c && R.sub === 'moves' && !['best', 'brilliant', 'great', 'forced'].includes(c.kind) && R.evals[n - 1].best && R.evals[n - 1].best !== m.uci) {
    const b = R.evals[n - 1].best; arrows.push({ from: b.slice(0, 2), to: b.slice(2, 4), color: '#81b64c' });
  }
  drawBoard({ pos, last: m ? { from: m.from, to: m.to } : null, badge: m && c && R.sub === 'moves' ? { sq: m.to, kind: c.kind } : null, arrows, anim });
  const meta = R.meta, done = R.done;
  renderCards(pos, {
    w: { name: meta.white, elo: meta.welo, av: (meta.white[0] || 'W').toUpperCase(), acc: done ? accuracyOf('w') : null, toMove: pos.turn() === 'w' && !pos.game_over() },
    b: { name: meta.black, elo: meta.belo, av: (meta.black[0] || 'B').toUpperCase(), acc: done ? accuracyOf('b') : null, toMove: pos.turn() === 'b' && !pos.game_over() },
  });
  showEval(R.evals[n] || null);
}
function refreshReview(changedK) {
  renderGraph(); renderSummary();
  if (R.sub === 'moves') {
    renderReviewMoves();
    // only redraw the coach/board when the analysis touched what's on screen
    if (changedK === undefined || changedK === R.idx || changedK === R.idx - 1 || changedK === R.idx + 1) { renderCoach(); drawReview(); }
  } else if (changedK === undefined || changedK === R.idx) drawReview();
}
function setIdx(n) {
  n = Math.max(0, Math.min(R.fens.length - 1, n));
  const prev = R.idx; R.idx = n;
  let anim = null;
  if (n === prev + 1 && R.moves[n - 1]) { anim = moveAnim(R.moves[n - 1]); moveSound(R.moves[n - 1]); }
  else if (n === prev - 1 && R.moves[prev - 1]) { anim = moveAnim(R.moves[prev - 1], true); sfx('move'); }
  drawReview(anim); renderCoach(); renderReviewMoves(); renderGraph();
}
function showSub(sub) {
  R.sub = sub;
  $('rvSummary').hidden = sub !== 'summary';
  $('rvMoves').hidden = sub !== 'moves';
  drawReview(); renderGraph();
}
function showImport() {
  R.token++; if (R.job) { R.job.cancel(); R.job = null; }
  R.fens = []; R.moves = []; R.evals = []; R.cls = [];
  $('rvImport').hidden = false; $('rvGame').hidden = true; $('rvProg').hidden = false;
  $('rvBar').style.width = '0'; $('rvProgTxt').textContent = '';
  drawReview();
}
function msg(t, err = false) { const m = $('ccMsg'); m.innerHTML = t; m.classList.toggle('err', err); }

// ---------- Chess.com import ----------
const TC_ICON = { bullet: '🚀', blitz: '⚡', rapid: '⏱', daily: '☀' };
const DRAWS = ['agreed', 'repetition', 'stalemate', 'insufficient', '50move', 'timevsinsufficient'];
let ccGames = [], ccUser = '';
async function loadChessCom() {
  const user = $('ccUser').value.trim();
  if (!user) { msg('Type your Chess.com username first.', true); return; }
  store.set('user', user);
  msg('<span class="spin"></span> Fetching your games from Chess.com…');
  $('gameList').innerHTML = ''; $('ccLoad').disabled = true;
  try {
    const r = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(user.toLowerCase())}/games/archives`);
    if (r.status === 404) throw new Error(`No Chess.com player called “${esc(user)}”.`);
    if (!r.ok) throw new Error('Chess.com returned an error (' + r.status + '). Try again in a moment.');
    const { archives = [] } = await r.json();
    let games = [];
    for (let a = archives.length - 1; a >= 0 && a >= archives.length - 3 && games.length < 40; a--) {
      const res = await fetch(archives[a]); if (!res.ok) continue;
      const data = await res.json();
      games = games.concat((data.games || []).filter(g => g.rules === 'chess' && g.pgn).reverse());
    }
    ccGames = games.slice(0, 40); ccUser = user.toLowerCase();
    if (!ccGames.length) throw new Error('No recent standard games found for this account.');
    msg(`Showing your ${ccGames.length} most recent games — click one to analyze it.`);
    renderGameList();
  } catch (e) {
    msg(e instanceof TypeError ? 'Could not reach Chess.com — check your internet connection, or paste the PGN instead.' : e.message, true);
  } finally { $('ccLoad').disabled = false; }
}
function renderGameList() {
  $('gameList').innerHTML = ccGames.map((g, i) => {
    const meW = g.white.username.toLowerCase() === ccUser, me = meW ? g.white : g.black, opp = meW ? g.black : g.white;
    const res = me.result === 'win' ? 'W' : DRAWS.includes(me.result) ? 'D' : 'L';
    const date = new Date(g.end_time * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const tc = g.time_control.includes('/') ? 'daily' : (() => { const [b, inc] = g.time_control.split('+').map(Number); return `${b >= 60 ? b / 60 + ' min' : b + 's'}${inc ? ' +' + inc : ''}`; })();
    return `<button class="gitem" data-i="${i}"><span class="res ${res}">${res}</span>
      <span class="gmain"><b>vs ${esc(opp.username)} <span style="color:var(--muted);font-weight:500">(${opp.rating})</span></b>
      <small>${meW ? '♔ White' : '♚ Black'} · ${esc(me.result)} · you ${me.rating}</small></span>
      <span class="gside"><span class="tc">${TC_ICON[g.time_class] || '♟'}</span>${esc(tc)}<br>${date}</span></button>`;
  }).join('');
}
$('gameList').onclick = e => {
  const b = e.target.closest('.gitem'); if (!b) return;
  const g = ccGames[+b.dataset.i], meW = g.white.username.toLowerCase() === ccUser;
  loadReview(g.pgn, { white: g.white.username, black: g.black.username, welo: g.white.rating, belo: g.black.rating, userColor: meW ? 'w' : 'b' });
};
$('ccLoad').onclick = loadChessCom;
$('ccUser').onkeydown = e => { if (e.key === 'Enter') loadChessCom(); };
$('ccUser').value = store.get('user', '');
$('pgnLoad').onclick = () => { const t = $('pgnIn').value.trim(); if (!t) return msg('Paste a PGN first.', true); msg(''); loadReview(t, {}); };
document.querySelectorAll('#srcSeg button').forEach(b => (b.onclick = () => {
  document.querySelectorAll('#srcSeg button').forEach(x => x.classList.toggle('on', x === b));
  $('srcCC').hidden = b.dataset.src !== 'cc'; $('srcPGN').hidden = b.dataset.src !== 'pgn';
}));
document.querySelectorAll('#qSeg button').forEach(b => {
  b.classList.toggle('on', +b.dataset.q === qIdx);
  b.onclick = () => { qIdx = +b.dataset.q; store.set('quality', qIdx); document.querySelectorAll('#qSeg button').forEach(x => x.classList.toggle('on', x === b)); };
});
$('rvBack').onclick = showImport;
$('rvSummaryBtn').onclick = () => showSub('summary');
$('navFirst').onclick = () => setIdx(0);
$('navPrev').onclick = () => setIdx(R.idx - 1);
$('navNext').onclick = () => setIdx(R.idx + 1);
$('navLast').onclick = () => setIdx(R.fens.length - 1);
$('navFlip').onclick = () => { flip.review = !flip.review; drawReview(); };
$('rvMoveList').onclick = e => { const m = e.target.closest('.m[data-i]'); if (m) setIdx(+m.dataset.i); };
$('graph').onclick = e => {
  if (R.fens.length < 2) return;
  const r = $('graph').getBoundingClientRect();
  if (R.sub !== 'moves') showSub('moves');
  setIdx(Math.round((e.clientX - r.left) / r.width * (R.fens.length - 1)));
};
$('playHereBtn').onclick = () => {
  const fen = R.fens[R.idx]; if (!fen) return;
  setMode('play');
  stopThinking(); game.load(fen); gameId++;
  playerColor = game.turn(); flip.play = playerColor === 'b';
  document.querySelectorAll('#sideSeg button').forEach(x => x.classList.toggle('on', x.dataset.side === playerColor));
  const m = R.moves[R.idx - 1]; lastMove = m ? { from: m.from, to: m.to } : null; selected = null; hintArrow = null; playScore = R.evals[R.idx] || null;
  drawPlay(); renderPlayMoves(); updateStatus();
};

// ======================================================================
// SAVED PROGRESS (browser storage + progress.json via serve.py)
// ======================================================================
let prog = { v: 1, rating: 1000, solved: {}, failed: {}, streak: 0, bestStreak: 0, hist: [], level: 'auto', curId: null, extra: [], play: null, tab: 'play', openings: {}, vision: {}, endgames: {}, opId: null, opMode: null, opLine: null, updated: 0 };
async function loadProgress() {
  const local = store.get('progress', null);
  let remote = null;
  try {
    const ctrl = new AbortController(); setTimeout(() => ctrl.abort(), 1500);
    const r = await fetch('api/progress', { cache: 'no-store', signal: ctrl.signal });
    if (r.ok) remote = await r.json();
  } catch {}
  const pick = [local, remote].filter(x => x && x.v === 1).sort((a, b) => (b.updated || 0) - (a.updated || 0))[0];
  if (pick) prog = { ...prog, ...pick };
}
let saveTimer = null;
function saveProgress() {
  prog.updated = Date.now();
  store.set('progress', prog);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    fetch('api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(prog) }).catch(() => {});
  }, 400);
}
window.addEventListener('beforeunload', () => {
  try { navigator.sendBeacon('api/progress', new Blob([JSON.stringify(prog)], { type: 'application/json' })); } catch {}
});
function savePlay() {
  prog.play = { pgn: game.history().length || game.fen() !== DEFAULT_FEN ? game.pgn() : '', color: playerColor, level: +$('level').value };
  saveProgress();
}
function restorePlay() {
  const p = prog.play; if (!p) return;
  if (p.level != null) $('level').value = p.level;
  if (p.color) {
    playerColor = p.color; flip.play = playerColor === 'b';
    document.querySelectorAll('#sideSeg button').forEach(x => x.classList.toggle('on', x.dataset.side === playerColor));
  }
  stopThinking(); gameId++;
  if (p.pgn && game.load_pgn(p.pgn)) {
    const h = game.history({ verbose: true }), lm = h[h.length - 1];
    lastMove = lm ? { from: lm.from, to: lm.to } : null;
  }
}

// ======================================================================
// PUZZLES
// ======================================================================
const PZ_LEVELS = [
  { id: 'auto', name: 'Auto', sub: 'your level' },
  { id: 'beginner', name: 'Beginner', min: 0, max: 1000 },
  { id: 'easy', name: 'Easy', min: 1000, max: 1300 },
  { id: 'medium', name: 'Medium', min: 1300, max: 1600 },
  { id: 'hard', name: 'Hard', min: 1600, max: 1900 },
  { id: 'expert', name: 'Expert', min: 1900, max: 2200 },
  { id: 'master', name: 'Master', min: 2200, max: 9999 },
];
const ONLINE_DIFF = { auto: 'normal', beginner: 'easiest', easy: 'easiest', medium: 'easier', hard: 'normal', expert: 'harder', master: 'hardest' };
let PZ_POOL = [];
const P = { cur: null, pos: null, color: 'w', step: 0, state: 'idle', failed: false, hint: 0, last: null, badge: null, delta: null,
            ana: false, anaPos: null, anaLast: null, anaJob: null, anaLines: [], token: 0 };
let anaEngine = null;
const puzzleCtl = {
  pos: () => (P.ana ? P.anaPos : P.pos) || new Chess(), draw: () => drawPuzzle(),
  move: (f, t, anim) => puzzleMove(f, t, null, anim),
  canPick: p => P.ana ? p.color === P.anaPos.turn() && !P.anaPos.game_over() : P.state === 'play' && p.color === P.color && P.pos.turn() === P.color,
};
const themeName = t => t.replace(/([a-z])([A-Z0-9])/g, '$1 $2').replace(/^./, c => c.toUpperCase()).replace(/In (\d)/, 'in $1');
const levelOf = r => PZ_LEVELS.slice(1).find(l => r >= l.min && r < l.max);

async function initPuzzles() {
  try { PZ_POOL = await (await fetch('puzzles.json', { cache: 'no-store' })).json(); } catch { PZ_POOL = []; }
  const ids = new Set(PZ_POOL.map(p => p.id));
  for (const p of prog.extra || []) if (!ids.has(p.id)) { PZ_POOL.push(p); ids.add(p.id); }
  renderLevels(); renderPzStats(); renderHist();
  const cur = prog.curId && PZ_POOL.find(p => p.id === prog.curId);
  if (cur) startPuzzle(cur); else nextPuzzle();
}
function rangeFor(id) {
  const L = PZ_LEVELS.find(l => l.id === id);
  return L.id === 'auto' ? [prog.rating - 150, prog.rating + 150] : [L.min, L.max];
}
function pickPuzzle() {
  const fresh = p => !prog.solved[p.id] && !prog.failed[p.id] && (!P.cur || p.id !== P.cur.id);
  let [lo, hi] = rangeFor(prog.level);
  let cands = PZ_POOL.filter(p => fresh(p) && p.r >= lo && p.r < hi);
  if (prog.level === 'auto') for (const w of [300, 500, 900]) { if (cands.length) break; cands = PZ_POOL.filter(p => fresh(p) && Math.abs(p.r - prog.rating) < w); }
  return cands.length ? cands[Math.floor(Math.random() * cands.length)] : null;
}
async function fetchOnlinePuzzle() {
  const [lo, hi] = rangeFor(prog.level);
  for (let tries = 0; tries < 4; tries++) {
    try {
      const r = await fetch(`https://lichess.org/api/puzzle/next?difficulty=${ONLINE_DIFF[prog.level]}`, { headers: { Accept: 'application/json' } });
      if (!r.ok) return null;
      const j = await r.json(), c = new Chess();
      for (const san of j.game.pgn.split(' ')) if (!c.move(san, { sloppy: true })) throw new Error('bad pgn');
      const last = c.history({ verbose: true }).pop();
      const p = { id: j.puzzle.id, fen: c.fen(), last: last.from + last.to, sol: j.puzzle.solution, r: j.puzzle.rating, th: j.puzzle.themes, g: j.game.id };
      if (!PZ_POOL.some(x => x.id === p.id)) { PZ_POOL.push(p); prog.extra.push(p); if (prog.extra.length > 400) prog.extra.shift(); }
      if (!prog.solved[p.id] && !prog.failed[p.id] && (prog.level === 'auto' || (p.r >= lo - 100 && p.r < hi + 100))) { renderLevels(); return p; }
    } catch { return null; }
  }
  return null;
}
async function nextPuzzle() {
  let p = pickPuzzle();
  if (!p) {
    setPz('wait', '⏳', 'Fetching new puzzles…', 'You have played every saved puzzle at this level — getting more from Lichess.');
    p = await fetchOnlinePuzzle();
  }
  if (!p) { setPz('fail', '🏁', 'Level complete!', 'You have played every puzzle at this level. Pick another difficulty (or connect to the internet for more).'); return; }
  startPuzzle(p);
}
function startPuzzle(p) {
  stopAna(); P.ana = false; P.token++;
  P.cur = p; P.pos = new Chess(p.fen); P.color = P.pos.turn(); P.step = 0; P.state = 'play';
  P.failed = !!(prog.failed[p.id] || prog.solved[p.id]); P.replay = P.failed; P.hint = 0; P.badge = null; P.delta = null;
  P.last = { from: p.last.slice(0, 2), to: p.last.slice(2, 4) };
  flip.puzzle = P.color === 'b';
  prog.curId = p.id; saveProgress();
  selected = null;
  drawPuzzle([{ from: P.last.from, to: P.last.to }]); renderPzStatus(); renderAna();
}
function recordResult(win) {
  const p = P.cur;
  if (P.replay || prog.solved[p.id] || prog.failed[p.id]) return;
  const n = Object.keys(prog.solved).length + Object.keys(prog.failed).length;
  const K = n < 20 ? 48 : 28, exp = 1 / (1 + Math.pow(10, (p.r - prog.rating) / 400));
  const d = Math.round(K * ((win ? 1 : 0) - exp)) || (win ? 1 : -1);
  prog.rating = Math.max(400, prog.rating + d); P.delta = d;
  if (win) { prog.solved[p.id] = 1; prog.streak++; prog.bestStreak = Math.max(prog.bestStreak, prog.streak); }
  else { prog.failed[p.id] = 1; prog.streak = 0; }
  prog.hist.unshift({ id: p.id, r: p.r, ok: win, d });
  prog.hist = prog.hist.slice(0, 40);
  saveProgress(); renderPzStats(); renderHist(); renderLevels();
}
function failOnce() { if (!P.failed) { P.failed = true; recordResult(false); } }

function puzzleMove(from, to, promo, anim = true) {
  selected = null;
  if (P.ana) {
    const legal = P.anaPos.moves({ square: from, verbose: true }).filter(m => m.to === to);
    if (!legal.length) return false;
    if (legal.some(m => m.promotion) && !promo) { askPromotion(P.anaPos.turn(), q => puzzleMove(from, to, q)); return true; }
    const m = P.anaPos.move({ from, to, promotion: promo || undefined });
    P.anaLast = { from, to }; moveSound(m);
    drawPuzzle(anim ? moveAnim(m) : null); runAna();
    return true;
  }
  if (P.state !== 'play' || P.pos.turn() !== P.color) return false;
  const legal = P.pos.moves({ square: from, verbose: true }).filter(m => m.to === to);
  if (!legal.length) return false;
  if (legal.some(m => m.promotion) && !promo) { askPromotion(P.color, q => puzzleMove(from, to, q)); return true; }
  const prevLast = P.last, cur = P.cur, token = P.token;
  const m = P.pos.move({ from, to, promotion: promo || undefined });
  const uci = from + to + (promo || '');
  const correct = uci === cur.sol[P.step] || P.pos.in_checkmate();
  P.last = { from, to }; P.hint = 0;
  if (correct) {
    P.step++;
    P.badge = { sq: to, kind: 'best' };
    drawPuzzle(anim ? moveAnim(m) : null);
    if (P.step >= cur.sol.length) { finishPuzzle(); return true; }
    moveSound(m);
    P.state = 'wait';
    setPz('good', '✓', 'Best move! Keep going…', 'Wait for the reply, then find the next move.');
    setTimeout(() => {
      if (P.token !== token) return;
      const r = P.pos.move(uciMove(cur.sol[P.step])); P.step++;
      P.last = { from: r.from, to: r.to }; P.badge = null; P.state = 'play';
      moveSound(r); drawPuzzle(moveAnim(r)); renderPzStatus();
    }, 550);
  } else {
    P.badge = { sq: to, kind: 'blunder' };
    drawPuzzle(anim ? moveAnim(m) : null); sfx('wrong');
    failOnce();
    P.state = 'wait';
    setPz('bad', '✕', `${m.san} isn't it`, 'Try again — the puzzle is marked as missed, but you can still find the answer.');
    setTimeout(() => {
      if (P.token !== token) return;
      P.pos.undo(); P.badge = null; P.last = prevLast; P.state = 'play';
      drawPuzzle(); renderPzStatus(true);
    }, 750);
  }
  return true;
}
function finishPuzzle() {
  P.state = 'solved';
  if (!P.failed) { recordResult(true); confetti(40); }
  sfx('right');
  renderPzStatus(); drawPuzzle();
}
function showSolution() {
  if (P.state !== 'play') return;
  failOnce();
  P.state = 'wait';
  const token = P.token;
  const stepFn = () => {
    if (P.token !== token) return;
    if (P.step >= P.cur.sol.length) { P.state = 'shown'; renderPzStatus(); drawPuzzle(); return; }
    const r = P.pos.move(uciMove(P.cur.sol[P.step])); P.step++;
    P.last = { from: r.from, to: r.to }; P.badge = r.color === P.color ? { sq: r.to, kind: 'best' } : null;
    moveSound(r); drawPuzzle(moveAnim(r));
    setTimeout(stepFn, 750);
  };
  setPz('wait', '👁', 'Showing the solution…', '');
  stepFn();
}
function useHint() {
  if (P.state !== 'play' || P.ana) return;
  failOnce();
  P.hint = Math.min(2, P.hint + 1);
  drawPuzzle(); renderPzStatus(true);
}

// ---------- Puzzle rendering ----------
function drawPuzzle(anim) {
  if (mode !== 'puzzle') return;
  if (!P.pos) { drawBoard({ pos: new Chess() }); return; }
  const pos = P.ana ? P.anaPos : P.pos;
  const arrows = [];
  let sel = selected;
  const next = P.cur.sol[P.step];
  if (!P.ana && P.state === 'play' && P.hint && next) {
    if (P.hint === 1 && !sel) sel = next.slice(0, 2);
    if (P.hint === 2) arrows.push({ from: next.slice(0, 2), to: next.slice(2, 4), color: '#f7c045' });
  }
  if (P.ana && P.anaLines[0] && P.anaLines[0].pv[0]) { const u = P.anaLines[0].pv[0]; arrows.push({ from: u.slice(0, 2), to: u.slice(2, 4), color: '#5c8bb0' }); }
  drawBoard({ pos, last: P.ana ? P.anaLast : P.last, sel, targets: sel && sel === selected ? pos.moves({ square: sel, verbose: true }) : [],
              badge: P.ana ? null : P.badge, arrows, anim });
  const done = ['solved', 'shown'].includes(P.state);
  const me = { name: 'You', elo: prog.rating, av: '🙂', toMove: !P.ana && P.state === 'play' };
  const opp = { name: 'Puzzle', elo: done || P.replay ? P.cur.r : '?', av: '🧩' };
  renderCards(pos, P.color === 'w' ? { w: me, b: opp } : { w: opp, b: me });
  if (!P.ana) showEval(null);
}
function setPz(kind, icon, title, sub, extra = '') {
  $('pzStatus').className = 'card pz-status ' + kind;
  $('pzStatus').innerHTML = `<div class="pz-h"><span class="pz-ic">${icon}</span><div><div class="pz-t">${title}</div>${sub ? `<div class="pz-s">${sub}</div>` : ''}</div></div>${extra}`;
  const playing = P.state === 'play';
  $('pzHint').disabled = !playing || P.ana; $('pzSol').disabled = !playing || P.ana;
  $('pzNext').classList.toggle('primary', !playing);
}
function renderPzStatus(afterMiss = false) {
  if (!P.cur) return;
  renderAna();
  const side = P.color === 'w' ? 'White' : 'Black';
  const tags = `<div class="tags">${(P.cur.th || []).filter(t => !['short', 'long', 'veryLong', 'oneMove', 'middlegame', 'opening', 'endgame'].includes(t)).map(t => `<span class="tag">${esc(themeName(t))}</span>`).join('')}
    <span class="tag lvl">★ ${P.cur.r}</span><a class="tag link" href="https://lichess.org/training/${esc(P.cur.id)}" target="_blank" rel="noopener">#${esc(P.cur.id)}</a></div>`;
  const deltaTxt = P.delta == null ? '' : `<span class="delta ${P.delta >= 0 ? 'up' : 'down'}">${P.delta >= 0 ? '+' : ''}${P.delta}</span>`;
  if (P.state === 'solved') return setPz('good', '🎉', `Solved! ${deltaTxt}`, P.failed ? (P.replay ? 'Replayed puzzle — rating unchanged.' : 'Found it in the end — it still counts as a miss.') : `Streak: ${prog.streak} 🔥`, tags);
  if (P.state === 'shown') return setPz('bad', '👁', `Solution shown ${deltaTxt}`, 'Use the analyzer to see why this works, or retry it.', tags);
  const hintTxt = P.hint === 1 ? 'Hint: move the highlighted piece.' : P.hint === 2 ? 'Hint: play the arrow move.' : '';
  if (afterMiss || P.hint) return setPz(P.hint ? 'hint' : 'bad', P.hint ? '💡' : '✕', P.hint ? hintTxt : 'Not quite — try again', `Find the best move for ${side}.`);
  const mateN = (P.cur.th || []).find(t => /^mateIn\d$/.test(t));
  setPz('play', P.color === 'w' ? '♔' : '♚', `${side} to move`, mateN ? `Find checkmate in ${mateN.slice(-1)}.` : 'Find the best move.');
}
function renderPzStats() {
  $('pzRating').textContent = prog.rating;
  $('pzStreak').textContent = prog.streak;
  $('pzSolved').textContent = Object.keys(prog.solved).length;
}
function renderLevels() {
  $('pzLevels').innerHTML = PZ_LEVELS.map(L => {
    let sub = L.sub;
    if (!sub) {
      const inL = PZ_POOL.filter(p => p.r >= L.min && p.r < L.max), done = inL.filter(p => prog.solved[p.id]).length;
      sub = `${done}/${inL.length}`;
    } else sub = `≈ ${prog.rating}`;
    return `<button class="lvl-chip${prog.level === L.id ? ' on' : ''}" data-l="${L.id}"><b>${L.name}</b><small>${sub}</small></button>`;
  }).join('');
}
function renderHist() {
  $('pzHist').innerHTML = prog.hist.length ? prog.hist.map((h, i) =>
    `<button class="hchip ${h.ok ? 'ok' : 'no'}" data-i="${i}" title="Puzzle ${esc(h.id)} · rated ${h.r}">${h.ok ? '✓' : '✕'}<small>${h.d > 0 ? '+' : ''}${h.d}</small></button>`).join('')
    : '<span class="pz-s">Your solved puzzles will show up here.</span>';
}

// ---------- Analyzer ----------
function toggleAna() {
  if (!P.cur) return;
  if (!P.ana && P.state === 'play') failOnce();
  P.ana = !P.ana;
  if (P.ana) { P.anaPos = new Chess(P.pos.fen()); P.anaLast = P.last; selected = null; runAna(); }
  else { stopAna(); P.anaLines = []; }
  drawPuzzle(); renderAna(); renderPzStatus();
}
function stopAna() { if (P.anaJob) { P.anaJob.cancel(); P.anaJob = null; } }
function runAna() {
  stopAna(); P.anaLines = []; renderAnaLines();
  if (P.anaPos.game_over()) { showEval(terminalEval(P.anaPos.fen()) || null); renderAnaLines(); return; }
  if (!anaEngine) anaEngine = new Engine();
  const fen = P.anaPos.fen();
  let t = 0;
  const job = anaEngine.search(fen, { multipv: 3, depth: 24, movetime: 30000, skill: 20 }, j => {
    if (P.anaJob !== job) return;
    P.anaLines = j.lines.filter(Boolean); P.anaDepth = j.depth;
    const now = performance.now(); if (now - t < 150) return; t = now;
    renderAnaLines(); showEval(P.anaLines[0] && P.anaLines[0].score); drawPuzzle();
  });
  P.anaJob = job;
  job.promise.then(() => { if (P.anaJob === job) { P.anaJob = null; renderAnaLines(); drawPuzzle(); if (P.anaLines[0]) showEval(P.anaLines[0].score); } });
}
function renderAna() {
  $('anaBtn').textContent = P.ana ? '✕ Close analyzer' : (P.state === 'play' ? '🔬 Analyze (counts as a miss)' : '🔬 Analyze position');
  $('anaBtn').classList.toggle('on', P.ana);
  $('anaBody').hidden = !P.ana;
  renderAnaLines();
}
function renderAnaLines() {
  if (!P.ana) return;
  const fen = P.anaPos.fen();
  let html;
  if (P.anaPos.game_over()) html = `<div class="pz-s">${P.anaPos.in_checkmate() ? 'Checkmate.' : 'Draw.'}</div>`;
  else if (!P.anaLines.length) html = '<div class="pz-s"><span class="spin"></span> Thinking…</div>';
  else html = P.anaLines.map((l, i) => `<button class="aline" data-i="${i}"><span class="evchip ${l.score.cp >= 0 ? 'w' : 'b'}">${fmtScore(l.score)}</span>
      <span class="aln">${lineText(fen, pvSan(fen, l.pv, 8))}</span></button>`).join('');
  $('anaLines').innerHTML = html;
  $('anaDepth').innerHTML = P.anaJob ? `<span class="spin"></span> depth ${P.anaDepth || 0}` : (P.anaLines.length ? `depth ${P.anaDepth} ✓` : '');
}
function anaUndo() { if (P.ana && P.anaPos.undo()) { const h = P.anaPos.history({ verbose: true }), l = h[h.length - 1]; P.anaLast = l ? { from: l.from, to: l.to } : P.last; drawPuzzle(); runAna(); } }

// ---------- Puzzle controls ----------
$('pzLevels').onclick = e => {
  const b = e.target.closest('.lvl-chip'); if (!b) return;
  prog.level = b.dataset.l; saveProgress(); renderLevels();
  if (P.state === 'play' && !P.failed && P.step === 0) nextPuzzle();
};
$('pzNext').onclick = () => { if (P.state === 'play' && !P.failed && P.cur && P.step > 0) failOnce(); nextPuzzle(); };
$('pzRetry').onclick = () => P.cur && startPuzzle(P.cur);
$('pzHint').onclick = useHint;
$('pzSol').onclick = showSolution;
$('pzFlip').onclick = () => { flip.puzzle = !flip.puzzle; drawPuzzle(); };
$('anaBtn').onclick = toggleAna;
$('anaUndo').onclick = anaUndo;
$('anaReset').onclick = () => { if (!P.ana) return; P.anaPos = new Chess(P.pos.fen()); P.anaLast = P.last; drawPuzzle(); runAna(); };
$('anaLines').onclick = e => {
  const b = e.target.closest('.aline'); if (!b) return;
  const l = P.anaLines[+b.dataset.i]; if (!l || !l.pv[0]) return;
  const u = l.pv[0]; puzzleMove(u.slice(0, 2), u.slice(2, 4), u[4] || null);
};
$('pzHist').onclick = e => {
  const b = e.target.closest('.hchip'); if (!b) return;
  const h = prog.hist[+b.dataset.i], p = h && PZ_POOL.find(x => x.id === h.id);
  if (p) startPuzzle(p);
};
$('pzReset').onclick = () => {
  if (!confirm('Reset your puzzle rating, streak and solved puzzles? This cannot be undone.')) return;
  Object.assign(prog, { rating: 1000, solved: {}, failed: {}, streak: 0, bestStreak: 0, hist: [] });
  saveProgress(); renderPzStats(); renderHist(); renderLevels(); nextPuzzle();
};

// ======================================================================
// OPENINGS TRAINER (repertoires in openings.js)
// ======================================================================
const posKey = fen => fen.split(' ').slice(0, 4).join(' ');
const sanToUci = (fen, san) => { const m = new Chess(fen).move(san, { sloppy: true }); return m ? m.from + m.to + (m.promotion || '') : null; };
for (const op of OPENINGS) {
  op.notes = {}; op.why = {}; op.book = {}; op.lines = [];
  for (const g of op.groups) for (const l of g.lines) {
    const c = new Chess(); l.moves = []; l.group = g.name; l.plan = l.plan || g.plan;
    for (const t of l.pgn.matchAll(/\{([^}]*)\}|\[([^\]:]+):([^\]]*)\]|(\S+)/g)) {
      if (t[1] !== undefined) { const m = l.moves[l.moves.length - 1]; if (m && !op.notes[m.key]) op.notes[m.key] = t[1].trim(); continue; }
      if (t[2] !== undefined) { op.why[posKey(c.fen()) + '|' + t[2].trim()] = t[3].trim(); continue; }
      const key = posKey(c.fen()), m = c.move(t[4], { sloppy: true });
      if (!m) { console.warn('bad opening move', l.id, t[4]); break; }
      const mv = { san: m.san, uci: m.from + m.to + (m.promotion || ''), key: key + '|' + m.san, color: m.color };
      l.moves.push(mv);
      const opts = (op.book[key] = op.book[key] || []);
      let e = opts.find(x => x.san === mv.san);
      if (!e) opts.push((e = { ...mv, lines: [] }));
      e.lines.push(l);
    }
    l.endKey = posKey(c.fen());
    op.lines.push(l);
  }
  for (const ls of op.lessons) for (const st of ls.steps) {
    const c = new Chess();
    for (const s of st.moves.split(/\s+/).filter(Boolean)) c.move(s, { sloppy: true });
    st.fen = c.fen();
    const h = c.history({ verbose: true }), lm = h[h.length - 1];
    st.last = lm ? { from: lm.from, to: lm.to } : null;
    if (st.task) st.taskUci = sanToUci(st.fen, st.task);
  }
}
const noteOf = (op, mv) => op.notes[mv.key] || '';
const moveLabel = (ply, san) => `${Math.floor(ply / 2) + 1}${ply % 2 ? '…' : '.'}${san}`;
const MODE_INFO = {
  basics: 'Short lessons: what the opening is about, the pawn structure, where pieces go, and the traps.',
  learn: 'Follow the green arrow — every move is explained. When the book ends, keep playing vs Stockfish.',
  practice: 'Play the line from memory. Wrong moves are explained; 💡 Hint if stuck. Then play on vs Stockfish.',
  drill: 'The opponent picks ANY known reply at every move (and sometimes a surprise). Like a real game.',
};
const O = { op: null, mode: 'learn', line: null, lesson: 0, step: 0, pos: null, phase: 'book', state: 'idle', hint: 0, tries: 0,
            miss: 0, used: false, wrong: false, last: null, badge: null, feed: [], token: 0, clean: false, coach: null,
            hintMove: null, evalScore: null, level: 2, surprise: true, solved: false, pending: null, credited: [] };
let opEngine = null, opJob = null;
const opCtl = {
  pos: () => O.pos || new Chess(), draw: () => drawOpening(), move: (f, t, anim) => opMove(f, t, null, anim),
  canPick: p => O.state === 'play' && p.color === O.op.side && O.pos.turn() === O.op.side,
};
const opStat = id => prog.openings[id] || { learned: false, reps: 0, perfect: 0 };
const userTurn = () => O.pos.turn() === O.op.side;
const ply = () => O.pos.history().length;
const themName = () => (O.op.side === 'b' ? 'White' : 'Black');
const povScore = s => { const k = O.op.side === 'w' ? 1 : -1; return fmtScore({ cp: s.cp * k, mate: s.mate == null ? null : s.mate * k }); };

function opSearch(fen, opts) {
  if (!opEngine) opEngine = new Engine();
  const job = opEngine.search(fen, opts);
  opJob = job;
  return job.promise.then(r => { if (opJob === job) opJob = null; return r && !r.cancelled ? r : null; });
}
function stopOpJob() { if (opJob) { opJob.cancel(); opJob = null; } }
// Score the move `uci` against the engine's best (or against `refUci`) from the same root and depth.
async function judge(fen, uci, refUci, search = opSearch, lim = { depth: 12, movetime: 2000 }) {
  const s = fen.split(' ')[1] === 'w' ? 1 : -1, after = new Chess(fen);
  after.move(uciMove(uci));
  const term = terminalEval(after.fen());
  const ref = await search(fen, refUci ? { ...lim, searchmoves: refUci } : { ...lim });
  if (!ref || !ref.lines[0]) return null;
  const best = ref.lines[0];
  let played = best;
  if (term) played = { score: { cp: term.cp, mate: term.mate }, pv: [uci] };
  else if (best.pv[0] !== uci) {
    const r = await search(fen, { ...lim, searchmoves: uci });
    if (!r || !r.lines[0]) return null;
    played = r.lines[0];
  }
  return { best, played, loss: Math.max(0, winPct(best.score.cp * s) - winPct(played.score.cp * s)) };
}
// Plain-language reason why a move is worse than the alternative, using the engine lines.
function whyText(fb, uci, j) {
  const side = fb.split(' ')[1], s = side === 'w' ? 1 : -1, them = side === 'w' ? 'Black' : 'White', B = x => `<b>${x}</b>`;
  const fa = (() => { const c = new Chess(fb); c.move(uciMove(uci)); return c.fen(); })();
  const reply = j.played.pv.slice(1), replySans = pvSan(fa, reply, 6), T = [];
  const ps = j.played.score, bs = j.best.score;
  if (ps.mate != null && ps.mate * s < 0 && !(bs.mate != null && bs.mate * s < 0)) {
    T.push(`This allows a forced checkmate: ${B(lineText(fa, replySans))}`);
  } else if (bs.mate != null && bs.mate * s > 0 && !(ps.mate != null && ps.mate * s > 0)) {
    T.push(`You had a forced checkmate: ${B(lineText(fb, pvSan(fb, j.best.pv, 6)))}`);
  } else {
    const played = materialSwing(fb, j.played.pv, side), best = materialSwing(fb, j.best.pv, side);
    if (played.delta <= -2 && best.delta - played.delta >= 2) {
      const t = threatened(fa);
      if (t.net >= 2 && reply[0] && reply[0].slice(2, 4) === t.square) T.push(`It leaves your ${NAME[t.piece]} on ${t.square} unprotected — ${them} takes it with ${B(replySans[0])}.`);
      else T.push(`It loses material: ${them} answers ${B(replySans[0])} and wins ${matWord(-played.delta, played.lostPiece)}. Line: ${B(lineText(fa, replySans))}`);
    } else if (best.delta >= 2 && best.delta - played.delta >= 2) {
      const fork = forkInfo(fb, j.best.pv[0]);
      T.push(`It misses ${B(pvSan(fb, j.best.pv, 1)[0])}, which wins ${matWord(best.delta, best.wonPiece)}${fork ? ` — a fork of the ${fork}` : ''}.`);
    } else {
      const rFork = reply[0] && forkInfo(fa, reply[0]);
      if (replySans[0]) T.push(rFork ? `${them} replies ${B(replySans[0])}, forking your ${rFork}.` : `${them}'s strongest reply is ${B(replySans[0])}${/\+/.test(replySans[0]) ? ' (check)' : ''}. Likely line: ${lineText(fa, replySans)}`);
    }
  }
  const pov = x => fmtScore({ cp: x.cp * s, mate: x.mate == null ? null : x.mate * s });
  T.push(`Stockfish rates your position ${B(pov(bs))} → ${B(pov(ps))} after this move (+ = good for you).`);
  return T.map(t => `<p>${t}</p>`).join('');
}
// Why the engine likes a move (for hints after the book).
function reasonFor(fen, line) {
  const idea = moveIdea(fen, line);
  return idea.reasons.join(' ') + (idea.line ? ` Line: ${idea.line}` : '');
}

// ---------- Flow ----------
function initOpenings() {
  O.op = OPENINGS.find(o => o.id === prog.opId) || OPENINGS[0];
  O.mode = prog.opV2 && MODE_INFO[prog.opMode] ? prog.opMode : 'basics';
  prog.opV2 = true;
  O.level = prog.opLevel ?? 2; O.surprise = prog.opSurprise ?? true;
  $('opSeg').innerHTML = OPENINGS.map(o => `<button data-op="${o.id}">${o.icon} ${esc(o.name)}</button>`).join('');
  $('opLevel').innerHTML = LEVELS.slice(0, 6).map((L, i) => `<option value="${i}">${L.name}</option>`).join('');
  $('opLevel').value = O.level; $('opSurprise').checked = O.surprise;
  if (O.mode === 'basics') startLesson(Math.min(prog.opLesson || 0, O.op.lessons.length - 1), 0);
  else startTraining(O.op.lines.find(l => l.id === prog.opLine) || O.op.lines[0]);
}
function resetBoardState() {
  O.token++; stopOpJob();
  O.pos = new Chess(); O.phase = 'book'; O.hint = 0; O.tries = 0; O.miss = 0; O.used = false; O.wrong = false;
  O.last = null; O.badge = null; O.feed = []; O.coach = null; O.hintMove = null; O.evalScore = null; O.pending = null;
  O.solved = false; O.credited = []; selected = null;
  flip.opening = O.op.side === 'b';
}
function startTraining(line) {
  if (O.mode === 'basics') O.mode = 'learn';
  resetBoardState();
  O.line = O.mode === 'drill' ? null : line;
  prog.opId = O.op.id; prog.opMode = O.mode; if (line) prog.opLine = line.id; saveProgress();
  renderOpening(); drawOpening();
  advance();
}
function expectedMove() {
  if (O.line) return O.line.moves[ply()] || null;
  return (O.op.book[posKey(O.pos.fen())] || []).find(m => m.color === O.op.side) || null;
}
function opponentOptions() {
  if (O.line) { const m = O.line.moves[ply()]; return m ? [m] : []; }
  return (O.op.book[posKey(O.pos.fen())] || []).filter(m => m.color !== O.op.side);
}
function advance() {
  if (O.phase === 'free') return freeAdvance();
  if (O.pos.game_over()) return bookComplete();
  if (userTurn()) {
    if (!expectedMove()) return bookComplete();
    O.state = 'play'; renderOpStatus(); drawOpening(); return;
  }
  const opts = opponentOptions();
  if (!opts.length) return bookComplete();
  O.state = 'wait'; renderOpStatus();
  const token = O.token;
  setTimeout(async () => {
    if (O.token !== token) return;
    // Drill: sometimes leave the book with a sensible engine move, like a real opponent would.
    if (O.mode === 'drill' && O.surprise && ply() >= 4 && Math.random() < 0.12) {
      const fen = O.pos.fen(), r = await opSearch(fen, { depth: 10, movetime: 1200, multipv: 4 });
      if (O.token !== token) return;
      const s = O.pos.turn() === 'w' ? 1 : -1, book = new Set(opts.map(o => o.uci));
      const cands = r ? r.lines.filter(l => l.pv[0] && !book.has(l.pv[0]) && (r.lines[0].score.cp - l.score.cp) * s < 80) : [];
      if (cands.length) {
        const pick = cands[Math.floor(Math.random() * cands.length)];
        const m = O.pos.move(uciMove(pick.pv[0]));
        O.feed.push({ who: 'surprise', label: moveLabel(ply() - 1, m.san), note: `Surprise! This move is not in your book — just like a real opponent might play. Now you have to think: what does it change, and does it leave anything loose? Use 💡 Hint if you want Stockfish's help.` });
        O.last = { from: m.from, to: m.to }; O.badge = null;
        if (mode === 'opening') moveSound(m);
        drawOpening(moveAnim(m)); renderOpMoves();
        enterFree(false);
        return;
      }
    }
    const ws = opts.map(o => (o.lines || []).reduce((a, l) => a + 4 - Math.min(3, opStat(l.id).perfect), 0) || 1);
    let r = Math.random() * ws.reduce((a, b) => a + b, 0);
    const mv = opts.find((o, i) => (r -= ws[i]) < 0) || opts[0];
    const m = O.pos.move(mv.san);
    O.feed.push({ who: 'them', label: moveLabel(ply() - 1, m.san), note: noteOf(O.op, mv) });
    O.last = { from: m.from, to: m.to }; O.badge = null;
    if (mode === 'opening') moveSound(m);
    drawOpening(moveAnim(m)); renderOpMoves();
    advance();
  }, ply() === 0 ? 400 : O.mode === 'learn' ? 1000 : 650);
}
// The book has run out: credit the line, then Stockfish takes over.
function bookComplete() {
  const key = posKey(O.pos.fen());
  const lines = O.line ? [O.line] : O.op.lines.filter(l => l.endKey === key);
  O.clean = !O.miss && !O.used;
  for (const l of lines) {
    const p = (prog.openings[l.id] = { ...opStat(l.id), learned: true });
    if (O.mode !== 'learn') { p.reps++; if (O.clean) p.perfect++; }
  }
  O.credited = lines; saveProgress(); sfx('right');
  const l = lines[0];
  const stars = l ? Math.min(3, opStat(l.id).perfect) : 0;
  const how = O.mode === 'learn' ? 'Line learned — next time try it in 🎯 Practice.'
    : O.clean ? `Perfect run! ${stars}/3 ★${stars >= 3 ? ' — mastered 🏆' : ''}`
    : `${O.miss} wrong move${O.miss === 1 ? '' : 's'}${O.used ? ' + hints' : ''} — play it again for a clean ★.`;
  O.feed.push({ who: 'coach', label: '📘 End of book', note: `${l ? `<b>${esc(l.group)} · ${esc(l.name)}</b><br>` : ''}${how}<br><br><b>Your plan from here:</b> ${esc(l ? l.plan : O.op.groups[0].plan)}<br><br>Stockfish (${LEVELS[O.level].name}) now plays ${themName()} — keep going! I'll check every move you make.`, html: true });
  enterFree(true);
  renderOpLines();
}
function enterFree(fromBook) {
  O.phase = 'free'; O.hint = 0; O.hintMove = null;
  if (!fromBook) O.feed.push({ who: 'coach', label: '⚔ Off the book', note: `You're on your own now — Stockfish (${LEVELS[O.level].name}) plays ${themName()}. Plan: ${esc((O.line || {}).plan || O.op.groups[0].plan)}`, html: true });
  freeAdvance();
}
function freeAdvance() {
  if (O.pos.game_over()) {
    O.state = 'over';
    const win = O.pos.in_checkmate() && !userTurn();
    O.coach = { kind: win ? 'good' : O.pos.in_checkmate() ? 'bad' : 'play', icon: win ? '🏆' : O.pos.in_checkmate() ? '♚' : '½',
                title: win ? 'Checkmate — you win!' : O.pos.in_checkmate() ? 'Checkmated' : 'Draw', sub: 'Press 📊 Review to go through the game, or Next line.' };
    sfx('end'); renderOpStatus(); drawOpening(); return;
  }
  if (userTurn()) { O.state = 'play'; renderOpStatus(); drawOpening(); return; }
  O.state = 'wait'; renderOpStatus();
  const L = LEVELS[O.level], token = O.token;
  opSearch(O.pos.fen(), { skill: L.skill, depth: L.depth, movetime: Math.min(L.time, 2500) }).then(r => {
    if (O.token !== token || !r || !r.bestmove) return;
    const m = O.pos.move(uciMove(r.bestmove));
    O.feed.push({ who: 'them', label: moveLabel(ply() - 1, m.san), note: '' });
    O.last = { from: m.from, to: m.to }; O.badge = null; O.hint = 0; O.hintMove = null;
    if (mode === 'opening') moveSound(m);
    drawOpening(moveAnim(m)); renderOpMoves();
    freeAdvance();
  });
}

// ---------- User moves ----------
function opMove(from, to, promo, anim = true) {
  selected = null;
  if (O.state !== 'play' || !userTurn()) return false;
  const legal = O.pos.moves({ square: from, verbose: true }).filter(m => m.to === to);
  if (!legal.length) return false;
  if (legal.some(m => m.promotion) && !promo) { askPromotion(O.op.side, q => opMove(from, to, q)); return true; }
  const fb = O.pos.fen(), prevLast = O.last, n = ply(), exp = O.phase === 'book' && O.mode !== 'basics' ? expectedMove() : null;
  const m = O.pos.move({ from, to, promotion: promo || undefined }), uci = from + to + (promo || '');
  O.last = { from, to };
  if (O.mode === 'basics') { lessonMove(m, uci, prevLast, anim); return true; }
  if (O.phase === 'book') {
    if (uci === exp.uci) {
      O.feed.push({ who: 'me', label: moveLabel(n, m.san), note: noteOf(O.op, exp) });
      O.hint = 0; O.tries = 0; O.wrong = false; O.badge = { sq: to, kind: 'best' }; O.coach = null;
      moveSound(m); drawOpening(anim ? moveAnim(m) : null); renderOpMoves();
      advance();
    } else bookMiss(m, uci, fb, exp, prevLast, anim);
    return true;
  }
  freeMove(m, uci, fb, prevLast, anim);
  return true;
}
async function bookMiss(m, uci, fb, exp, prevLast, anim) {
  O.miss++; O.tries++; O.wrong = true; O.state = 'think';
  if (O.mode !== 'learn' && O.tries >= 2) { O.hint = 2; O.used = true; }
  O.badge = { sq: m.to, kind: 'mistake' }; O.undoLast = prevLast;
  sfx('wrong'); drawOpening(anim ? moveAnim(m) : null);
  const authored = O.op.why[posKey(fb) + '|' + m.san];
  O.coach = { kind: 'bad', icon: '✕', title: `${esc(m.san)} isn't the book move`, body: (authored ? `<p>${esc(authored)}</p>` : '') + '<p class="pz-s"><span class="spin"></span> Asking Stockfish why…</p>' };
  renderOpStatus();
  const token = O.token, j = await judge(fb, uci, exp.uci);
  if (O.token !== token) return;
  const showBook = O.mode === 'learn' || O.hint === 2;
  const bookTxt = showBook ? `<p>The book move is <b>${esc(moveLabel(ply() - 1, exp.san))}</b>${noteOf(O.op, exp) ? ' — ' + esc(noteOf(O.op, exp)) : '.'}</p>` : '<p>Try to find the book move. Stuck? Press 💡 Hint.</p>';
  let body = authored ? `<p>${esc(authored)}</p>` : '', kind = 'bad', icon = '✕';
  if (!j) body += '<p>Not the move this repertoire plays.</p>';
  else if (j.loss < 4) {
    kind = 'hint'; icon = '≈'; O.badge.kind = 'good';
    body += `<p>Actually not bad — Stockfish rates it about the same (${povScore(j.played.score)} vs ${povScore(j.best.score)}). But it's not the repertoire move, so you'd be on your own after it.</p>`;
  } else {
    O.badge.kind = j.loss < 10 ? 'inaccuracy' : j.loss < 20 ? 'mistake' : 'blunder';
    if (!authored) body += whyText(fb, uci, j);
    else body += `<p>Stockfish: ${povScore(j.best.score)} → ${povScore(j.played.score)} for you.</p>`;
  }
  O.coach = { kind, icon, title: `${esc(m.san)} isn't the book move`, body: body + bookTxt, actions: [{ id: 'retry', label: '↶ Try again', primary: true }] };
  O.state = 'review'; drawOpening(); renderOpStatus();
}
async function freeMove(m, uci, fb, prevLast, anim) {
  O.badge = null; O.hint = 0; O.hintMove = null; O.undoLast = prevLast; O.state = 'think';
  moveSound(m); drawOpening(anim ? moveAnim(m) : null); renderOpMoves();
  O.coach = { kind: 'play', icon: '🔍', title: 'Coach is checking your move…', body: '<p class="pz-s"><span class="spin"></span> Stockfish is looking at it.</p>' };
  renderOpStatus();
  const token = O.token, n = ply() - 1, j = await judge(fb, uci);
  if (O.token !== token) return;
  if (!j) { O.coach = null; O.feed.push({ who: 'me', label: moveLabel(n, m.san), note: '' }); return freeAdvance(); }
  O.evalScore = j.played.score;
  const isBest = j.best.pv[0] === uci;
  const kind = isBest ? 'best' : j.loss < 2 ? 'excellent' : j.loss < 5 ? 'good' : j.loss < 10 ? 'inaccuracy' : j.loss < 20 ? 'mistake' : 'blunder';
  O.badge = { sq: m.to, kind };
  const bestSan = pvSan(fb, j.best.pv, 1)[0];
  if (kind === 'mistake' || kind === 'blunder') {
    O.pending = { label: moveLabel(n, m.san), kind, bestSan };
    O.coach = { kind: 'bad', icon: KINFO[kind].sym, title: `${esc(m.san)} is ${KINFO[kind].phrase}`, body: whyText(fb, uci, j) + `<p>Better was <b>${esc(bestSan)}</b>.</p>`,
                actions: [{ id: 'takeback', label: '↶ Take it back', primary: true }, { id: 'keep', label: 'Keep playing' }] };
    O.state = 'review'; sfx('wrong'); drawOpening(); renderOpStatus(); return;
  }
  O.coach = null;
  O.feed.push({ who: 'me', label: moveLabel(n, m.san), note: kind === 'inaccuracy' ? `?! A bit inaccurate — ${bestSan} was better.` : `${KINFO[kind].sym} ${KINFO[kind].label}` });
  drawOpening(); freeAdvance();
}
function opAction(id) {
  if (id === 'retry' || id === 'takeback') {
    O.pos.undo(); O.badge = null; O.last = O.undoLast; O.coach = null; O.pending = null; O.state = 'play';
    drawOpening(); renderOpMoves(); renderOpStatus();
  } else if (id === 'keep' && O.pending) {
    O.feed.push({ who: 'bad', label: O.pending.label, note: `${KINFO[O.pending.kind].sym} ${KINFO[O.pending.kind].label} — ${O.pending.bestSan} was better.` });
    O.pending = null; O.coach = null; freeAdvance();
  }
}
async function opHint() {
  if (O.mode === 'basics') { if (!O.solved && curStep().task) { O.lessonHint = true; drawOpening(); renderOpStatus(); } return; }
  if (O.state !== 'play' || !userTurn() || (O.mode === 'learn' && O.phase === 'book')) return;
  O.used = O.used || O.phase === 'book';
  if (O.phase === 'book') { O.hint = Math.min(2, O.hint + 1); drawOpening(); renderOpStatus(); return; }
  if (O.hint >= 2) return;
  O.hint++;
  if (!O.hintMove) {
    O.coach = { kind: 'hint', icon: '💡', title: 'Thinking…', body: '<p class="pz-s"><span class="spin"></span> Stockfish is looking for the best move.</p>' };
    renderOpStatus();
    const token = O.token, fen = O.pos.fen(), r = await opSearch(fen, { depth: 14, movetime: 2500 });
    if (O.token !== token || O.pos.fen() !== fen) return;
    O.coach = null;
    if (!r || !r.lines[0]) { renderOpStatus(); return; }
    O.hintMove = { uci: r.lines[0].pv[0], san: pvSan(fen, r.lines[0].pv, 1)[0], why: reasonFor(fen, r.lines[0]) };
    O.evalScore = r.lines[0].score;
  }
  drawOpening(); renderOpStatus();
}

// ---------- Basics (lessons) ----------
const curLesson = () => O.op.lessons[O.lesson];
const curStep = () => curLesson().steps[O.step];
function startLesson(li, si) {
  O.mode = 'basics'; resetBoardState();
  O.lesson = li; O.step = si; O.lessonHint = false; O.lessonTries = 0;
  const st = curStep();
  O.pos = new Chess(st.fen); O.last = st.last;
  O.state = st.task ? 'play' : 'idle';
  if (O.step === curLesson().steps.length - 1 && !st.task) markLesson();
  prog.opId = O.op.id; prog.opMode = 'basics'; prog.opLesson = li; saveProgress();
  renderOpening(); drawOpening();
}
function markLesson() { prog.openings['lesson:' + curLesson().id] = { learned: true, reps: 0, perfect: 0 }; saveProgress(); renderOpLines(); }
function lessonMove(m, uci, prevLast, anim) {
  const st = curStep();
  if (uci === st.taskUci) {
    O.solved = true; O.state = 'idle'; O.badge = { sq: m.to, kind: 'best' };
    moveSound(m); sfx('right'); drawOpening(anim ? moveAnim(m) : null);
    if (O.step === curLesson().steps.length - 1) markLesson();
    renderOpStatus(); return;
  }
  O.lessonTries++; O.badge = { sq: m.to, kind: 'mistake' }; O.state = 'wait';
  if (O.lessonTries >= 2) O.lessonHint = true;
  sfx('wrong'); drawOpening(anim ? moveAnim(m) : null);
  O.coach = { kind: 'bad', icon: '✕', title: `Not ${esc(m.san)}`, body: `<p>${O.lessonHint ? 'Look at the yellow arrow.' : 'Read the explanation again — the answer is in it.'}</p>` };
  renderOpStatus();
  const token = O.token;
  setTimeout(() => {
    if (O.token !== token) return;
    O.pos.undo(); O.badge = null; O.last = prevLast; O.coach = null; O.state = 'play';
    drawOpening(); renderOpStatus();
  }, 1100);
}
function lessonNext() {
  const ls = O.op.lessons;
  if (O.step < curLesson().steps.length - 1) return startLesson(O.lesson, O.step + 1);
  if (O.lesson < ls.length - 1) return startLesson(O.lesson + 1, 0);
  O.mode = 'learn'; startTraining(O.op.lines[0]);
}
function lessonBack() {
  if (O.step > 0) return startLesson(O.lesson, O.step - 1);
  if (O.lesson > 0) startLesson(O.lesson - 1, O.op.lessons[O.lesson - 1].steps.length - 1);
}

// ---------- Opening rendering ----------
function drawOpening(anim) {
  if (mode !== 'opening') return;
  if (!O.pos) { drawBoard({ pos: new Chess() }); return; }
  const arrows = [];
  let sel = selected, marks = [];
  const A = (u, color) => arrows.push({ from: u.slice(0, 2), to: u.slice(2, 4), color });
  if (O.mode === 'basics') {
    const st = curStep();
    if (!O.solved) for (const a of st.arrows || []) A(a.replace('!', ''), a[0] === '!' ? '#e0533f' : '#81b64c');
    if (O.lessonHint && !O.solved && st.taskUci) A(st.taskUci, '#f7c045');
    marks = st.marks || [];
  } else if (O.state === 'play' && userTurn()) {
    const exp = O.phase === 'book' ? expectedMove() : O.hintMove;
    if (exp && O.phase === 'book' && O.mode === 'learn') A(exp.uci, '#81b64c');
    else if (exp && O.hint === 2) A(exp.uci, '#f7c045');
    else if (exp && O.hint === 1 && !sel) sel = exp.uci.slice(0, 2);
  }
  drawBoard({ pos: O.pos, last: O.last, sel, targets: sel && sel === selected ? O.pos.moves({ square: sel, verbose: true }) : [], badge: O.badge, arrows, marks, anim });
  const me = { name: 'You', av: '🙂', toMove: O.state === 'play' && userTurn() };
  const them = { name: themName(), elo: O.phase === 'free' && O.mode !== 'basics' ? 'Stockfish ' + LEVELS[O.level].name : 'book', av: O.phase === 'free' ? '♞' : '📖',
                 toMove: ['wait', 'play'].includes(O.state) && !userTurn() };
  renderCards(O.pos, O.op.side === 'w' ? { w: me, b: them } : { w: them, b: me });
  showEval(O.phase === 'free' ? O.evalScore : null);
}
function renderOpening() {
  document.querySelectorAll('#opSeg button').forEach(b => b.classList.toggle('on', b.dataset.op === O.op.id));
  document.querySelectorAll('#opModeSeg button').forEach(b => b.classList.toggle('on', b.dataset.m === O.mode));
  $('opBlurb').textContent = O.op.blurb;
  $('opModeInfo').textContent = MODE_INFO[O.mode];
  $('opSurpriseRow').hidden = O.mode !== 'drill';
  $('opLevelRow').hidden = O.mode === 'basics';
  $('opMovesCard').hidden = O.mode === 'basics';
  renderOpStatus(); renderOpMoves(); renderOpLines();
}
function statusParts() {
  if (O.coach) return O.coach;
  if (O.mode === 'basics') {
    const ls = curLesson(), st = curStep();
    let body = `<p>${st.text}</p>`;
    if (st.task && O.solved) body += `<p class="op-ok">✓ ${st.done || 'Correct!'}</p>`;
    else if (st.task) body += `<p class="op-task">👉 Your move — play it on the board.</p>`;
    return { kind: st.task && !O.solved ? 'play' : 'good', icon: '📚', title: esc(ls.title), sub: `Step ${O.step + 1} of ${ls.steps.length}`, body };
  }
  if (O.state === 'wait') return { kind: 'play', icon: '⏳', title: `${themName()} is thinking…`, sub: O.phase === 'free' ? `Stockfish ${LEVELS[O.level].name}` : 'Book move coming' };
  if (O.phase === 'book') {
    const exp = expectedMove();
    if (!exp) return { kind: 'play', icon: '…', title: '' };
    if (O.mode === 'learn') return { kind: 'play', icon: '📖', title: `Play ${esc(moveLabel(ply(), exp.san))}`, body: `<p>${esc(noteOf(O.op, exp)) || 'Follow the green arrow.'}</p>` };
    if (O.hint) return { kind: 'hint', icon: '💡', title: O.hint === 1 ? 'Hint: move the highlighted piece' : `Hint: ${esc(moveLabel(ply(), exp.san))}`,
                         body: O.hint === 1 ? '<p>Press 💡 again to see the exact move.</p>' : `<p>${esc(noteOf(O.op, exp)) || 'Play the arrow move.'}</p>` };
    if (O.wrong) return { kind: 'bad', icon: '✕', title: 'Not the book move — try again', sub: 'Stuck? Press 💡 Hint.' };
    return { kind: 'play', icon: O.op.side === 'w' ? '♔' : '♚', title: 'Your move', sub: 'Play the book move from memory.' };
  }
  const plan = esc((O.line || O.credited[0] || {}).plan || O.op.groups[0].plan);
  if (O.hint && O.hintMove) return { kind: 'hint', icon: '💡', title: O.hint === 1 ? 'Hint: move the highlighted piece' : `Hint: ${esc(O.hintMove.san)}`,
                                     body: O.hint === 1 ? `<p>Remember the plan: ${plan}</p><p>Press 💡 again to see the move.</p>` : `<p>${O.hintMove.why}</p>` };
  return { kind: 'play', icon: '⚔', title: 'Middlegame — your move', body: `<p><b>Plan:</b> ${plan}</p>` };
}
function renderOpStatus() {
  const p = statusParts(), done = O.phase === 'free' || O.state === 'over';
  const tag = O.mode === 'basics' ? '' : O.mode === 'drill' && !O.credited.length ? '🎲 Drill — the opponent chooses the line'
    : esc(`${(O.line || O.credited[0]).group} · ${(O.line || O.credited[0]).name}`);
  const feed = O.mode === 'basics' ? '' : O.feed.map(f => `<div class="op-note ${f.who}"><b>${esc(f.label)}</b>${f.note ? (f.html ? '<br>' + f.note : ' — ' + esc(f.note)) : ''}</div>`).join('');
  $('opStatus').className = 'card pz-status ' + p.kind;
  $('opStatus').innerHTML = `<div class="pz-h"><span class="pz-ic">${p.icon}</span><div><div class="pz-t">${p.title}</div>${p.sub ? `<div class="pz-s">${p.sub}</div>` : ''}</div></div>
    ${p.body ? `<div class="op-body">${p.body}</div>` : ''}
    ${p.actions ? `<div class="row">${p.actions.map(a => `<button class="btn${a.primary ? ' primary' : ''}" data-act="${a.id}">${a.label}</button>`).join('')}</div>` : ''}
    ${tag ? `<div class="tags"><span class="tag">${tag}</span></div>` : ''}${feed ? `<div class="op-feed" id="opFeed">${feed}</div>` : ''}`;
  const f = $('opFeed'); if (f) f.scrollTop = f.scrollHeight;
  // buttons
  const B = (id, label, show = true, dis = false, prim = false) => { const b = $(id); b.hidden = !show; b.innerHTML = label; b.disabled = dis; b.classList.toggle('primary', prim); };
  if (O.mode === 'basics') {
    const st = curStep(), last = O.lesson === O.op.lessons.length - 1 && O.step === curLesson().steps.length - 1;
    B('opHint', '💡 Show me', true, !st.task || O.solved);
    B('opRestart', '◀ Back', true, O.lesson === 0 && O.step === 0);
    B('opReview', '', false);
    B('opNext', last ? 'Start learning lines ▶' : 'Next ▶', true, false, !st.task || O.solved);
  } else {
    B('opHint', '💡 Hint', true, O.state !== 'play' || !userTurn() || (O.mode === 'learn' && O.phase === 'book'));
    B('opRestart', '↻ Restart line', true, false);
    B('opReview', '📊 Review game', true, ply() < 2);
    B('opNext', 'Next line ⏭', true, false, done);
  }
}
function renderOpMoves() {
  if (!O.pos) return;
  const h = O.pos.history();
  let html = '';
  for (let i = 0; i < h.length; i += 2) html += `<span class="n">${i / 2 + 1}.</span><span class="m">${h[i]}</span><span class="m">${h[i + 1] || ''}</span>`;
  $('opMoves').innerHTML = html || '<span></span><span class="m" style="color:var(--faint)">No moves yet</span>';
  $('opMoves').scrollTop = $('opMoves').scrollHeight;
}
function renderOpLines() {
  let html = '', learned = 0, mastered = 0, group = null;
  if (O.mode === 'basics') {
    O.op.lessons.forEach((ls, i) => {
      const ok = opStat('lesson:' + ls.id).learned;
      if (ok) learned++;
      html += `<button class="op-line${i === O.lesson ? ' on' : ''}" data-lesson="${i}"><span class="st">${ok ? '✅' : '○'}</span><span class="nm">${esc(ls.title)}</span><span class="stars">${ls.steps.length} steps</span></button>`;
    });
    $('opLines').innerHTML = html;
    $('opLinesTitle').textContent = 'Lessons';
    $('opProg').textContent = `${learned}/${O.op.lessons.length} done`;
    return;
  }
  const hide = O.mode === 'drill';
  for (const l of O.op.lines) {
    const p = opStat(l.id), stars = Math.min(3, p.perfect);
    if (p.learned) learned++;
    if (stars >= 3) mastered++;
    if (l.group !== group) { html += `<div class="op-group">${esc(l.group)}</div>`; group = l.group; }
    const st = stars >= 3 ? '🏆' : p.reps ? '🎯' : p.learned ? '📖' : '○';
    html += `<button class="op-line${l === O.line && !hide ? ' on' : ''}" data-id="${l.id}" title="${p.reps} practice run${p.reps === 1 ? '' : 's'}">
      <span class="st">${st}</span><span class="nm">${esc(l.name)}</span><span class="stars">${'★'.repeat(stars)}<i>${'★'.repeat(3 - stars)}</i></span></button>`;
  }
  $('opLines').innerHTML = html;
  $('opLinesTitle').textContent = 'Lines';
  $('opProg').textContent = `${learned}/${O.op.lines.length} learned · ${mastered} mastered`;
}

// ---------- Opening controls ----------
$('opSeg').onclick = e => {
  const b = e.target.closest('button'); if (!b || b.dataset.op === O.op.id) return;
  O.op = OPENINGS.find(o => o.id === b.dataset.op);
  if (O.mode === 'basics') startLesson(0, 0);
  else startTraining(O.op.lines.find(l => !opStat(l.id).learned) || O.op.lines[0]);
};
$('opModeSeg').onclick = e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.m === 'basics') { startLesson(O.mode === 'basics' ? O.lesson : 0, 0); return; }
  const line = O.line || O.credited[0] || O.op.lines[0];
  O.mode = b.dataset.m; startTraining(line);
};
$('opLines').onclick = e => {
  const b = e.target.closest('.op-line'); if (!b) return;
  if (b.dataset.lesson) return startLesson(+b.dataset.lesson, 0);
  if (O.mode === 'drill') O.mode = 'practice';
  startTraining(O.op.lines.find(l => l.id === b.dataset.id));
};
$('opNext').onclick = () => {
  if (O.mode === 'basics') return lessonNext();
  const ls = O.op.lines, cur = O.line || O.credited[0];
  startTraining(O.mode === 'drill' ? null : ls[(ls.indexOf(cur) + 1) % ls.length]);
};
$('opRestart').onclick = () => {
  if (O.mode === 'basics') return lessonBack();
  startTraining(O.line);
};
$('opHint').onclick = opHint;
$('opStatus').onclick = e => { const b = e.target.closest('[data-act]'); if (b) opAction(b.dataset.act); };
$('opLevel').onchange = () => { O.level = +$('opLevel').value; prog.opLevel = O.level; saveProgress(); drawOpening(); };
$('opSurprise').onchange = () => { O.surprise = $('opSurprise').checked; prog.opSurprise = O.surprise; saveProgress(); };
$('opReview').onclick = () => {
  if (!O.pos || ply() < 2 || O.state === 'review') return;
  const pgn = O.pos.pgn();
  setMode('review');
  loadReview(pgn, O.op.side === 'w' ? { white: 'You', black: 'Opponent', userColor: 'w' } : { white: 'Opponent', black: 'You', userColor: 'b' });
};
$('opReset').onclick = () => {
  if (!confirm('Reset your progress for all opening lines and lessons?')) return;
  prog.openings = {}; saveProgress(); renderOpLines();
};

// ======================================================================
// App shell: tabs, themes, sound, keyboard
// ======================================================================
const drawCurrent = () => (mode === 'play' ? drawPlay() : mode === 'review' ? drawReview() : mode === 'puzzle' ? drawPuzzle() : mode === 'opening' ? drawOpening() : EXTRA_MODES[mode].draw());
function setMode(m) {
  if (EXTRA_MODES[mode] && mode !== m && EXTRA_MODES[mode].leave) EXTRA_MODES[mode].leave();
  mode = m;
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.mode === m));
  $('playView').hidden = m !== 'play'; $('reviewView').hidden = m !== 'review'; $('puzzleView').hidden = m !== 'puzzle'; $('openingView').hidden = m !== 'opening';
  for (const [k, x] of Object.entries(EXTRA_MODES)) $(x.view).hidden = m !== k;
  selected = null;
  if (EXTRA_MODES[m] && EXTRA_MODES[m].enter) EXTRA_MODES[m].enter();
  if (m !== 'puzzle') stopAna(); else if (P.ana) runAna();
  drawCurrent();
  prog.tab = m; saveProgress();
}
document.querySelectorAll('#tabs button').forEach(b => (b.onclick = () => setMode(b.dataset.mode)));

const THEMES = { walnut: ['#edd3a8', '#b2804f'], emerald: ['#ebecd0', '#739552'], ocean: ['#dee3e6', '#7e97a6'], royal: ['#ebe3f6', '#8a6fc0'], slate: ['#c8d0db', '#5b6a80'] };
function setTheme(t) {
  document.body.dataset.theme = t; store.set('theme', t);
  document.querySelectorAll('.sw').forEach(s => s.classList.toggle('on', s.dataset.t === t));
}
$('swatches').innerHTML = Object.entries(THEMES).map(([t, [l, d]]) =>
  `<button class="sw" data-t="${t}" title="${t[0].toUpperCase() + t.slice(1)} board" style="background:linear-gradient(135deg, ${l} 50%, ${d} 50%)"></button>`).join('');
$('swatches').onclick = e => { const s = e.target.closest('.sw'); if (s) setTheme(s.dataset.t); };
setTheme(store.get('theme', 'walnut'));

const syncSound = () => { $('soundBtn').textContent = soundOn ? '🔊' : '🔇'; };
$('soundBtn').onclick = () => { soundOn = !soundOn; store.set('sound', soundOn); syncSound(); };
syncSound();

document.addEventListener('keydown', e => {
  if (e.target.matches('input, textarea, select')) return;
  if (mode === 'review' && R.sub === 'moves' && R.fens.length) {
    if (e.key === 'ArrowRight') { setIdx(R.idx + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { setIdx(R.idx - 1); e.preventDefault(); }
    else if (e.key === 'Home') setIdx(0);
    else if (e.key === 'End') setIdx(R.fens.length - 1);
  }
  if (mode === 'puzzle' && P.ana) {
    if (e.key === 'ArrowLeft') { anaUndo(); e.preventDefault(); }
  }
  if (e.key === 'f') {
    if (mode === 'opening') { flip.opening = !flip.opening; drawOpening(); }
    else if (EXTRA_MODES[mode]) { flip[mode] = !flip[mode]; drawCurrent(); }
    else (mode === 'play' ? $('flipBtn') : mode === 'review' ? $('navFlip') : $('pzFlip')).click();
  }
});
window.addEventListener('resize', () => drawCurrent());

(async function boot() {
  await loadProgress();
  restorePlay();
  drawPlay(); renderPlayMoves(); updateStatus(); maybeEngineMove();
  await initPuzzles();
  initOpenings();
  for (const x of Object.values(EXTRA_MODES)) if (x.init) x.init();
  setMode(['play', 'review', 'puzzle', 'opening'].includes(prog.tab) || EXTRA_MODES[prog.tab] ? prog.tab : 'play');
})();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  // when an updated version takes over, reload once so the new buttons/features appear
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController && !reloaded) { reloaded = true; location.reload(); } });
  navigator.serviceWorker.register('sw.js').then(r => r.update()).catch(() => {});
}
