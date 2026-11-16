'use strict';
// ======================================================================
// TRAIN TOOLS — daily plan & streak, ladder card, "Is it safe?" drill, Puzzle Rush,
// "Win a won position", My mistakes (spaced repetition), weakness report.
// Tools take over the Train tab's board through T.tool = { pos, draw, move, canPick, stop }.
// ======================================================================
let toolEngine = null;
function toolSearch(fen, opts) {
  if (!toolEngine) toolEngine = new Engine();
  return toolEngine.search(fen, { skill: 20, ...opts }).promise.then(r => (r && !r.cancelled ? r : null));
}
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const localDay = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const DAY = 864e5;
const colorName = c => (c === 'w' ? 'White' : 'Black');
function toolBoard(st, anim, extra = {}) {
  if (mode !== 'train') return;
  flip.train = st.orient === 'b';
  drawBoard({ pos: st.pos, last: st.last, sel: selected, targets: selected && st.canMove && st.canMove() ? st.pos.moves({ square: selected, verbose: true }) : [],
              arrows: (st.arrows || []).map(([f, t, c]) => ({ from: f, to: t, color: AR[c] || c })), badge: st.badge, marks: st.marks || [], anim, ...extra });
  const me = { name: 'You', av: '🙂', toMove: st.canMove ? st.canMove() : false };
  const opp = { name: st.oppName || 'Coach', elo: st.oppElo || '', av: st.oppAv || '🎓', thinking: !!st.thinking };
  renderCards(st.pos, st.orient === 'w' ? { w: me, b: opp } : { w: opp, b: me }, !!st.caps);
  showEval(st.score || null);
}
function toolHead(icon, title, sub) {
  return `<div class="tr-top"><button class="icon-btn" data-tr="home" title="Back to training">←</button>
    <div><div class="tr-k">${sub || 'Training tool'}</div><div class="tr-t">${icon} ${esc(title)}</div></div></div>`;
}
// generic "user moves a piece" helper with promotion
function toolLegal(st, from, to, promo, cb) {
  const legal = st.pos.moves({ square: from, verbose: true }).filter(m => m.to === to);
  if (!legal.length) return null;
  if (legal.some(m => m.promotion) && !promo) { askPromotion(st.pos.turn(), q => cb(from, to, q)); return 'wait'; }
  return { from, to, promotion: promo || undefined };
}

// ---------------------------------------------------------------- daily plan + streak
function daily() {
  let d = prog.daily;
  if (!d || d.date !== localDay()) d = prog.daily = { date: localDay(), pz: 0, lesson: false, game: false, done: false };
  return d;
}
function streakNow() {
  const s = prog.dstreak; if (!s || !s.last) return 0;
  return s.last === localDay() || s.last === localDay(new Date(Date.now() - DAY)) ? s.n : 0;
}
function dailyBump(kind) {
  const d = daily();
  if (kind === 'pz') d.pz++; else d[kind] = true;
  if (!d.done && d.pz >= 5 && d.lesson && d.game) {
    d.done = true;
    const s = prog.dstreak || { n: 0, last: null, best: 0 };
    s.n = s.last === localDay(new Date(Date.now() - DAY)) ? s.n + 1 : 1;
    s.last = d.date; s.best = Math.max(s.best || 0, s.n); prog.dstreak = s;
    setTimeout(() => confetti(70), 300);
  }
  saveProgress();
}
function dailyCard() {
  const d = daily(), st = streakNow();
  const row = (ok, txt, act) => `<button class="tl-task${ok ? ' ok' : ''}" ${act ? `data-tl="${act}"` : 'disabled'}><span class="ck">${ok ? '✓' : ''}</span><span>${txt}</span></button>`;
  return `<div class="card tl-daily">
    <div class="tl-row"><div><div class="card-h">Today's 15-minute plan</div>${d.done ? '<div class="op-ok">All done today — see you tomorrow! 🎉</div>' : '<div class="pz-s">Do all three every day to build your streak.</div>'}</div>
      <div class="tl-streak${st ? ' on' : ''}"><b>${st}</b><small>day streak 🔥</small></div></div>
    ${row(d.pz >= 5, `Solve 5 puzzles <small>(${Math.min(5, d.pz)}/5)</small>`, 'go:rush')}
    ${row(d.lesson, 'Do one lesson or review', 'go:lesson')}
    ${row(d.game, 'Finish a game vs Stockfish', 'go:ladder')}
  </div>`;
}

// ---------------------------------------------------------------- ladder card
function ladderCard() {
  const L = prog.ladder || { elo: 400, games: 0, w: 0, l: 0, d: 0, best: 400, badges: [] };
  const pct = Math.max(0, Math.min(100, (L.elo - 400) / 6));
  const marks = [600, 800, 1000].map(b => `<span class="${L.elo >= b ? 'on' : ''}" style="left:${(b - 400) / 6}%">${b}</span>`).join('');
  return `<div class="card tl-ladder">
    <div class="tl-row"><div><div class="card-h">🪜 Climb to 1000</div><div class="pz-s">Beat the ladder bot to raise its rating. Win +50, lose −35.</div></div>
      <div class="tl-elo"><b>${L.elo}</b><small>${L.games ? `${L.w}W ${L.l}L ${L.d}D` : 'start: 400'}</small></div></div>
    <div class="tl-lbar"><div style="width:${pct}%"></div>${marks}</div>
    <button class="btn primary wide" data-tl="ladder">♟ Play a ladder game</button>
  </div>`;
}

// ---------------------------------------------------------------- home section
function trHomeTop() {
  const due = bankDue().length, total = (prog.bank || []).length;
  const tools = [
    ['safe', '🛡', 'Is it safe?', 'Spot moves that hang material'],
    ['rush', '⚡', 'Puzzle Rush', `3 minutes, 3 lives${prog.rush && prog.rush.best ? ` · best ${prog.rush.best}` : ''}`],
    ['mistakes', '🔁', 'My mistakes', total ? `${due} due · ${total} saved` : 'Turn your blunders into puzzles'],
    ['convert', '🏆', 'Win a won position', 'Finish off Stockfish when ahead'],
    ['weak', '📊', 'Weakness report', 'What to practise next'],
  ];
  return dailyCard() + ladderCard() + `<div class="card"><div class="card-h">Training tools</div><div class="tl-grid">
    ${tools.map(([id, ic, t, s]) => `<button class="tl-tool" data-tl="tool:${id}"><span class="ic">${ic}</span><b>${t}</b><small>${s}</small></button>`).join('')}
  </div></div>`;
}
function trOpenTool(id) {
  if (T.tool && T.tool.stop) T.tool.stop();
  T.token++; T.view = 'tool'; $('trList').hidden = true; selected = null;
  T.tool = { safe: SafeTool, rush: RushTool, mistakes: BankTool, convert: ConvTool, weak: WeakTool }[id]();
}
$('trainView').addEventListener('click', e => {
  const b = e.target.closest('[data-tl]'); if (!b || b.disabled) return;
  const a = b.dataset.tl;
  if (a.startsWith('tool:')) return trOpenTool(a.slice(5));
  if (a === 'ladder' || a === 'go:ladder') {
    $('level').value = LADDER_VAL; savePlay(); setMode('play'); newGame(); return;
  }
  if (a === 'go:rush') return trOpenTool('rush');
  if (a === 'go:lesson') { const nx = trNext(); if (nx) trOpen(nx.id); else trReview(); return; }
  if (T.tool && T.tool.act) T.tool.act(a, b);
});

// ---------------------------------------------------------------- "Is it safe?" drill
function SafeTool() {
  const S = { id: 'safe', tok: T.token, queue: [], q: null, n: 0, ok: 0, round: 10, answered: null, pos: new Chess(), last: null, arrows: [], orient: 'w',
              oppName: 'Safety check', oppAv: '🛡', busy: false };
  async function gen(tok) {
    for (let attempt = 0; attempt < 8; attempt++) {
      const c = new Chess(), plies = 10 + Math.floor(Math.random() * 22);
      let ok = true;
      for (let i = 0; i < plies; i++) {
        const r = await toolSearch(c.fen(), { depth: 5, multipv: 3 });
        if (tok !== S.tok) return null;
        if (!r || !r.lines.length) { ok = false; break; }
        const sg = c.turn() === 'w' ? 1 : -1, best = r.lines[0].score.cp * sg;
        const cands = r.lines.filter(l => l.score.cp * sg > best - 60 && l.pv[0]);
        c.move(uciMove(cands[Math.floor(Math.random() * cands.length)].pv[0]));
        if (c.game_over()) { ok = false; break; }
      }
      if (!ok || c.in_check()) continue;
      const fen = c.fen(), side = c.turn(), wantUnsafe = Math.random() < 0.5;
      const risky = m => { const d = new Chess(fen); d.move(m); return d.moves({ verbose: true }).some(x => x.to === m.to); };
      const moves = shuffle(c.moves({ verbose: true }).filter(m => m.piece !== 'k' && !/[kq]/.test(m.flags)))
        .map(m => ({ m, r: risky(m) })).sort((a, b) => (b.r - a.r) * (wantUnsafe ? 1 : -1));
      for (const { m } of moves.slice(0, 5)) {
        const uci = m.from + m.to + (m.promotion || '');
        const j = await judge(fen, uci, null, toolSearch, { depth: 10, movetime: 450 });
        if (tok !== S.tok) return null;
        if (!j) continue;
        const sw = materialSwing(fen, j.played.pv, side, 6), sb = materialSwing(fen, j.best.pv, side, 6);
        let label = null;
        if (sw.delta <= -2 && j.loss >= 15) label = 'unsafe';
        else if (sw.delta >= 0 && j.loss < 6 && sb.delta < 2) label = 'safe';
        if (label && (label === (wantUnsafe ? 'unsafe' : 'safe') || attempt >= 3)) return { fen, uci, san: m.san, label, j, sw, side };
      }
    }
    return null;
  }
  async function fill() {
    if (S.busy) return; S.busy = true;
    const tok = S.tok;
    while (S.queue.length < 2 && tok === S.tok) {
      const q = await gen(tok);
      if (tok !== S.tok) break;
      if (q) S.queue.push(q);
      if (!S.q && !S.done) next();
    }
    S.busy = false;
  }
  function next() {
    if (S.n >= S.round) return finish();
    S.q = S.queue.shift() || null; S.answered = null; S.badge = null;
    if (S.q) { S.pos = new Chess(S.q.fen); S.orient = S.q.side; S.last = null; S.arrows = [[S.q.uci.slice(0, 2), S.q.uci.slice(2, 4), 'b']]; }
    render(); draw(); fill();
  }
  function answer(a) {
    if (!S.q || S.answered) return;
    const q = S.q, right = a === q.label;
    S.answered = { a, right }; S.n++; if (right) S.ok++;
    const P = (prog.safe = prog.safe || { ok: 0, total: 0, best: 0 }); P.total++; if (right) P.ok++; saveProgress();
    sfx(right ? 'right' : 'wrong');
    const m = S.pos.move(uciMove(q.uci)); S.last = { from: m.from, to: m.to };
    S.badge = { sq: m.to, kind: q.label === 'unsafe' ? 'blunder' : 'best' };
    const reply = q.j.played.pv[1];
    S.arrows = q.label === 'unsafe' && reply ? [[reply.slice(0, 2), reply.slice(2, 4), 'r']] : [];
    render(); draw(moveAnim(m));
  }
  function finish() {
    const P = (prog.safe = prog.safe || { ok: 0, total: 0, best: 0 }); P.best = Math.max(P.best || 0, S.ok); saveProgress();
    S.q = null; S.done = true; render();
  }
  function render() {
    let body;
    if (S.done) body = `<div class="tr-score">${S.ok} / ${S.round}<small>correct · best ${prog.safe.best}</small></div>
      <div class="op-body"><p>${S.ok >= 9 ? 'Excellent eyes! You rarely miss a hanging piece.' : S.ok >= 7 ? 'Good. Keep doing this — and ask "is it safe?" before every move in your games.' : 'Keep practising: before every move, look at every enemy piece that could capture on your destination square.'}</p></div>
      <div class="row"><button class="btn primary" data-tl="again">↻ New round</button><button class="btn" data-tr="home">Done</button></div>`;
    else if (!S.q) body = `<div class="pz-s"><span class="spin"></span> Setting up a realistic position… (Stockfish is playing out an opening)</div>`;
    else {
      const q = S.q;
      body = `<div class="tr-dots res">${Array.from({ length: S.round }, (_, i) => `<i class="${i < S.n ? (i === S.n - 1 && S.answered ? (S.answered.right ? 'ok' : 'no') : 'done') : i === S.n ? 'on' : ''}"></i>`).join('')}</div>
        <div class="tr-task">${colorName(q.side)} wants to play <b class="mono">${esc(q.san)}</b> (blue arrow). Is that move <b>safe</b>?</div>`;
      if (!S.answered) body += `<div class="row"><button class="btn tl-safe" data-tl="a:safe">✓ Safe</button><button class="btn tl-unsafe" data-tl="a:unsafe">✕ Loses material</button></div>
        <div class="pz-s">Look at the square it lands on and what it stops defending. Who can capture what?</div>`;
      else {
        const r = S.answered.right, fen = q.fen;
        let why;
        if (q.label === 'unsafe') { try { why = whyText(fen, q.uci, q.j); } catch { why = ''; } }
        else {
          const after = new Chess(fen); after.move(uciMove(q.uci));
          const line = pvSan(after.fen(), q.j.played.pv.slice(1), 4);
          why = `<p>Nothing can be won from it — the opponent has no capture that gains material.${line.length ? ` Likely play: ${lineText(after.fen(), line)}` : ''}</p>`;
        }
        body += `<div class="tr-verdict ${r ? 'good' : 'bad'}">${r ? '✓ Right' : '✕ Not quite'} — it is ${q.label === 'unsafe' ? '<b>not safe</b>' : '<b>safe</b>'}</div>
          <div class="coach-b">${why}</div>
          <button class="btn primary wide" data-tl="next">${S.n >= S.round ? 'See score ▶' : 'Next ▶'}</button>`;
      }
    }
    $('trMain').innerHTML = toolHead('🛡', 'Is it safe?', `Question ${Math.min(S.n + (S.answered ? 0 : 1), S.round)} of ${S.round} · ${S.ok} right`) + body;
  }
  const draw = anim => toolBoard(S, anim);
  S.act = a => {
    if (a.startsWith('a:')) answer(a.slice(2));
    else if (a === 'next') { S.q = null; next(); }
    else if (a === 'again') { S.n = 0; S.ok = 0; S.done = false; S.q = null; next(); }
  };
  S.draw = draw; S.pos_ = () => S.pos;
  render(); draw(); fill();
  return { act: S.act, draw, pos: () => S.pos, move: () => false, canPick: () => false, stop: () => { S.tok = -1; } };
}

// ---------------------------------------------------------------- Puzzle Rush
function RushTool() {
  const S = { tok: T.token, on: false, done: false, score: 0, strikes: 0, cursor: 450, used: new Set(), p: null, pos: new Chess(), step: 0, last: null, orient: 'w',
              badge: null, arrows: [], end: 0, timer: null, oppName: 'Rush', oppAv: '⚡', busy: false };
  const DUR = 180000;
  function pick() {
    const pool = PZ_POOL.filter(p => !S.used.has(p.id));
    pool.sort((a, b) => Math.abs(a.r - S.cursor) - Math.abs(b.r - S.cursor));
    const near = pool.slice(0, 6);
    return near[Math.floor(Math.random() * near.length)] || null;
  }
  function load() {
    const p = pick(); if (!p) return finish();
    S.p = p; S.used.add(p.id); S.pos = new Chess(p.fen); S.step = 0; S.orient = S.pos.turn(); S.badge = null; S.busy = false;
    S.last = p.last ? { from: p.last.slice(0, 2), to: p.last.slice(2, 4) } : null;
    render(); draw();
  }
  function start() {
    S.on = true; S.done = false; S.score = 0; S.strikes = 0; S.cursor = 450; S.used.clear(); S.end = performance.now() + DUR;
    clearInterval(S.timer); S.timer = setInterval(tick, 200); load();
  }
  function tick() {
    const left = S.end - performance.now(), el = document.getElementById('rushClock');
    if (el) { el.textContent = fmtClock(left); el.classList.toggle('low', left < 20000); }
    if (left <= 0) finish();
  }
  function finish() {
    clearInterval(S.timer); S.on = false; S.done = true; S.busy = true;
    const R = (prog.rush = prog.rush || { best: 0, runs: 0 }); const rec = S.score > R.best; R.best = Math.max(R.best, S.score); R.runs++; saveProgress();
    if (rec && S.score) confetti(80);
    S.record = rec; render();
  }
  function move(from, to, promo) {
    if (!S.on || S.busy || S.pos.turn() !== S.orient) return false;
    const mv = toolLegal(S, from, to, promo, move); if (!mv) return false; if (mv === 'wait') return true;
    const m = S.pos.move(mv), uci = m.from + m.to + (m.promotion || ''), tok = S.tok;
    S.last = { from: m.from, to: m.to }; selected = null;
    if (uci === S.p.sol[S.step] || S.pos.in_checkmate()) {
      S.step++;
      if (S.step >= S.p.sol.length || S.pos.in_checkmate()) {
        S.score++; S.cursor += 45; S.badge = { sq: m.to, kind: 'best' }; S.busy = true; sfx('right');
        if (window.dailyBump) dailyBump('pz');
        render(); draw(moveAnim(m)); setTimeout(() => { if (tok === S.tok && S.on) load(); }, 450); return true;
      }
      moveSound(m); S.busy = true; draw(moveAnim(m));
      setTimeout(() => {
        if (tok !== S.tok || !S.on) return;
        const r = S.pos.move(uciMove(S.p.sol[S.step])); S.step++; S.last = { from: r.from, to: r.to }; S.busy = false;
        moveSound(r); draw(moveAnim(r));
      }, 300);
      return true;
    }
    S.strikes++; S.badge = { sq: m.to, kind: 'blunder' }; S.busy = true; S.cursor = Math.max(400, S.cursor - 60); sfx('wrong');
    const u = S.p.sol[S.step]; S.arrows = [[u.slice(0, 2), u.slice(2, 4), 'g']];
    render(); draw(moveAnim(m));
    setTimeout(() => { if (tok !== S.tok) return; S.arrows = []; if (S.strikes >= 3) finish(); else load(); }, 1100);
    return true;
  }
  function render() {
    let body;
    if (S.done) body = `<div class="tr-score">${S.score}<small>puzzles solved${S.record ? ' · 🏅 new best!' : ` · best ${prog.rush.best}`}</small></div>
      <div class="row"><button class="btn primary" data-tl="start">↻ Go again</button><button class="btn" data-tr="home">Done</button></div>`;
    else if (!S.on) body = `<div class="op-body"><p>Solve as many puzzles as you can in <b>3 minutes</b>. They start very easy and get harder as you go. Three wrong moves and the run ends.</p>
      <p>Speed builds <b>pattern recognition</b> — the instant "I've seen this" feeling that strong players have.</p></div>
      <button class="btn primary wide tr-go" data-tl="start">⚡ Start</button>${prog.rush && prog.rush.best ? `<div class="pz-s">Your best: ${prog.rush.best}</div>` : ''}`;
    else body = `<div class="tl-rush"><span class="clock run" id="rushClock">${fmtClock(S.end - performance.now())}</span>
        <span class="tl-rs"><b>${S.score}</b> solved</span><span class="tl-lives">${'❤'.repeat(3 - S.strikes)}<i>${'❤'.repeat(S.strikes)}</i></span></div>
      <div class="tr-task">${colorName(S.orient)} to move${S.p && S.p.th.some(t => /^mateIn/.test(t)) ? ' — <b>checkmate</b>' : ''}.</div>`;
    $('trMain').innerHTML = toolHead('⚡', 'Puzzle Rush') + body;
  }
  const draw = anim => toolBoard(S, anim, {});
  S.canMove = () => S.on && !S.busy && S.pos.turn() === S.orient;
  render(); draw();
  return { act: a => { if (a === 'start') start(); }, draw, pos: () => S.pos, move: (f, t) => move(f, t),
           canPick: p => S.canMove() && p.color === S.orient, stop: () => { S.tok = -1; clearInterval(S.timer); }, pause: () => { if (S.on) finish(); } };
}

// ---------------------------------------------------------------- Win a won position
const CONV = [
  { id: 'cv-q', name: 'A whole queen up', fen: 'r5k1/5ppp/8/8/8/8/5PPP/3QR1K1 w - - 0 1', tip: 'Trade the last black rook if you can, then mate. Watch your own back rank!' },
  { id: 'cv-r', name: 'A rook up', fen: '3r2k1/5ppp/8/8/8/8/5PPP/2R1R1K1 w - - 0 1', tip: 'Take the open file, trade rooks, then mate with rook + king. Give your king air (h3) first.' },
  { id: 'cv-n', name: 'A knight up (middlegame)', fen: 'r1b2rk1/pp3ppp/2n5/8/8/2N2N2/PPP2PPP/R1B2RK1 w - - 0 1', tip: 'Develop everything, trade pieces (not pawns), then use the extra piece to win pawns and promote.' },
  { id: 'cv-qr', name: 'Queen vs rook', fen: '6k1/5pp1/7p/8/8/8/r4PPP/3Q2K1 w - - 0 1', tip: 'Keep your back rank safe, then hunt the rook with forks and checks — or win pawns and promote.' },
  { id: 'cv-rb', name: 'A rook up — as Black', fen: '2kr4/ppp2ppp/8/8/8/8/PPP2PPP/2K5 b - - 0 1', tip: 'Get the rook to the 2nd rank (your 7th) to eat pawns, then promote or mate.' },
];
function ConvTool() {
  const S = { tok: T.token, item: null, pos: new Chess(), last: null, orient: 'w', badge: null, arrows: [], my: 0, thinking: false, over: null, score: null,
              oppName: 'Stockfish', oppElo: 'defending', oppAv: '♞', caps: true };
  const LIMIT = 60;
  function list() {
    S.item = null; S.pos = new Chess(CONV[0].fen); S.orient = 'w'; S.arrows = []; S.badge = null; S.last = null;
    const P = prog.convert || {};
    $('trMain').innerHTML = toolHead('🏆', 'Win a won position') + `
      <div class="op-body"><p>Being ahead only counts if you can <b>finish</b>. You start winning — Stockfish defends as hard as it can. Checkmate it within ${LIMIT} moves. A draw or stalemate counts as a fail.</p></div>
      <div class="op-lines">${CONV.map(c => `<button class="op-line${P[c.id] ? ' on' : ''}" data-tl="cv:${c.id}"><span class="st">${P[c.id] ? '✓' : '○'}</span><span class="nm">${esc(c.name)}${P[c.id] ? `<small class="tr-goal">won in ${P[c.id].best} moves</small>` : ''}</span><span class="stars">Play ▶</span></button>`).join('')}</div>`;
    draw();
  }
  function begin(id) {
    S.item = CONV.find(c => c.id === id); S.pos = new Chess(S.item.fen); S.orient = S.pos.turn(); S.my = 0; S.over = null; S.last = null; S.badge = null; S.arrows = []; S.score = null; S.tok = ++T.token;
    render(); draw(); evalNow();
  }
  async function evalNow() {
    const tok = S.tok, r = await toolSearch(S.pos.fen(), { depth: 10, movetime: 300 });
    if (tok !== S.tok || !r || !r.lines[0]) return; S.score = r.lines[0].score; draw();
  }
  function move(from, to, promo) {
    if (!S.item || S.over || S.thinking || S.pos.turn() !== S.orient) return false;
    const mv = toolLegal(S, from, to, promo, move); if (!mv) return false; if (mv === 'wait') return true;
    const m = S.pos.move(mv); S.my++; S.last = { from: m.from, to: m.to }; S.arrows = []; selected = null;
    moveSound(m); draw(moveAnim(m));
    if (check()) return true;
    reply(); return true;
  }
  async function reply() {
    S.thinking = true; render(); draw();
    const tok = S.tok, r = await toolSearch(S.pos.fen(), { depth: 12, movetime: 500 });
    if (tok !== S.tok) return;
    S.thinking = false;
    if (!r || !r.bestmove) { render(); return; }
    if (r.lines[0]) S.score = r.lines[0].score;
    const m = S.pos.move(uciMove(r.bestmove)); S.last = { from: m.from, to: m.to }; moveSound(m);
    draw(moveAnim(m));
    if (!check()) render();
  }
  function check() {
    if (S.pos.in_checkmate()) {
      const won = S.pos.turn() !== S.orient;
      S.over = won ? 'win' : 'loss';
      if (won) { const P = (prog.convert = prog.convert || {}); const b = P[S.item.id]; P[S.item.id] = { best: Math.min(b ? b.best : 999, S.my) }; saveProgress(); confetti(80); sfx('end'); }
      render(); return true;
    }
    if (S.pos.game_over()) { S.over = 'draw'; sfx('wrong'); render(); return true; }
    if (S.my >= LIMIT) { S.over = 'limit'; render(); return true; }
    return false;
  }
  async function hint() {
    if (S.over || S.thinking) return;
    const tok = S.tok, r = await toolSearch(S.pos.fen(), { depth: 14, movetime: 900 });
    if (tok !== S.tok || !r || !r.bestmove) return;
    S.arrows = [[r.bestmove.slice(0, 2), r.bestmove.slice(2, 4), 'y']]; S.hintTxt = ideaHTML(moveIdea(S.pos.fen(), r.lines[0]), false); render(); draw();
  }
  function render() {
    if (!S.item) return list();
    const sc = S.score, adv = sc ? (sc.mate != null ? (sc.mate * (S.orient === 'w' ? 1 : -1) > 0 ? 'mate coming' : 'getting mated!') : ((sc.cp * (S.orient === 'w' ? 1 : -1)) / 100).toFixed(1)) : '…';
    let st;
    if (S.over === 'win') st = `<div class="tr-verdict good">🏆 Checkmate in ${S.my} moves!</div><div class="pz-s">Converted. That's exactly the skill that wins rated games.</div>`;
    else if (S.over) st = `<div class="tr-verdict bad">${S.over === 'draw' ? '½ It slipped to a draw' : S.over === 'limit' ? `⏱ ${LIMIT} moves without mate` : '✕ You got mated!'}</div><div class="pz-s">Tip: ${esc(S.item.tip)}</div>`;
    else st = `<div class="tr-task">${S.thinking ? '<span class="spin"></span> Stockfish is defending…' : 'Your move.'}</div>
      <div class="pz-s">Move ${S.my}/${LIMIT} · your advantage: <b>${adv}</b>${sc && sc.mate == null && sc.cp * (S.orient === 'w' ? 1 : -1) < 200 ? ' — careful, it\'s slipping!' : ''}</div>
      ${S.hintTxt ? `<div class="coach-b">${S.hintTxt}</div>` : ''}`;
    $('trMain').innerHTML = toolHead('🏆', S.item.name, 'Win a won position') + `<div class="pz-s">💡 ${esc(S.item.tip)}</div>${st}
      <div class="row">${S.over ? `<button class="btn primary" data-tl="cv:${S.item.id}">↻ Try again</button>` : '<button class="btn" data-tl="hint">💡 Hint</button>'}<button class="btn" data-tl="list">All positions</button></div>`;
    S.hintTxt = S.over ? null : S.hintTxt;
  }
  const draw = anim => toolBoard(S, anim);
  S.canMove = () => !!S.item && !S.over && !S.thinking && S.pos.turn() === S.orient;
  list();
  return { act: a => { if (a.startsWith('cv:')) begin(a.slice(3)); else if (a === 'list') { S.tok = ++T.token; list(); } else if (a === 'hint') { S.hintTxt = null; hint(); } },
           draw, pos: () => S.pos, move: (f, t) => { S.hintTxt = null; return move(f, t); }, canPick: p => S.canMove() && p.color === S.orient, stop: () => { S.tok = -1; } };
}

// ---------------------------------------------------------------- My mistakes (spaced repetition)
const IVL = [1, 3, 7, 16, 35];
const fenKey = f => f.split(' ').slice(0, 4).join(' ');
function bankAdd(e) {
  if (!e || !e.fen || !e.best) return;
  const B = (prog.bank = prog.bank || []), k = fenKey(e.fen);
  if (B.some(x => fenKey(x.fen) === k)) return;
  B.push({ id: 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), fen: e.fen, best: e.best, line: e.line || [e.best], played: e.played, loss: Math.round(e.loss || 0),
           src: e.src, game: e.game || '', added: Date.now(), due: Date.now(), lvl: 0, reps: 0 });
  if (B.length > 400) B.splice(0, B.length - 400);
  saveProgress();
}
const bankDue = () => (prog.bank || []).filter(x => x.lvl < IVL.length && x.due <= Date.now());
function bankGrade(x, right) {
  if (right) { x.lvl++; x.due = Date.now() + (IVL[Math.min(x.lvl - 1, IVL.length - 1)] * DAY) - 3600e3; }
  else { x.lvl = 0; x.due = Date.now() + DAY - 3600e3; }
  x.reps++; saveProgress();
}

// ---------------------------------------------------------------- Puzzles from your Chess.com games
// Stockfish goes through your recent Chess.com games and saves every big mistake (into the same bank as "My mistakes").
// The Puzzles tab then mixes in (about 4 in 10) either the exact position from your game, or a different puzzle with
// the same idea (fork, hanging piece, mate in 1…) or from the opening you play.
const MINE = { on: store.get('pzMine', true), busy: false, msg: '' };
const mineUser = () => store.get('user', '') || 'cheszwither';
function openingKey(pgn) {
  const m = /\[ECOUrl "[^"]*\/openings\/([^"]+)"\]/.exec(pgn || ''); if (!m) return null;
  const w = decodeURIComponent(m[1]).replace(/^Caro-Kann/, 'Caro~Kann').split('-');
  const i = w.findIndex(x => /^(Game|Defense|Opening|Gambit|Attack|System)$/.test(x));
  if (i < 0 || i > 4) return null;
  let k = w.slice(0, i + 1).join('_').replace('~', '-');
  if (/Pawn_Opening$/.test(k)) k = k.replace(/Opening$/, 'Game');
  return k;
}
async function scanChessCom(user, max, say) {
  user = (user || '').trim().toLowerCase(); if (!user) throw new Error('Type your Chess.com username first.');
  store.set('user', user);
  say('Fetching games from Chess.com…');
  const r = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(user)}/games/archives`);
  if (!r.ok) throw new Error(r.status === 404 ? 'No Chess.com player with that name.' : 'Chess.com error ' + r.status);
  const { archives = [] } = await r.json();
  const seen = new Set(prog.bankScanned || []);
  let games = [];
  for (let a = archives.length - 1; a >= 0 && games.length < max && a >= archives.length - 3; a--) {
    const d = await (await fetch(archives[a])).json();
    games = games.concat((d.games || []).filter(g => g.rules === 'chess' && g.pgn && !seen.has(g.url)).reverse());
  }
  games = games.slice(0, max);
  if (!games.length) return { added: 0, games: 0 };
  let added = 0;
  const ops = (prog.mineOpen = prog.mineOpen || {});
  for (let gi = 0; gi < games.length; gi++) {
    const g = games[gi], c = new Chess();
    if (!c.load_pgn(g.pgn, { sloppy: true })) continue;
    const me = g.white.username.toLowerCase() === user ? 'w' : 'b';
    const ok = openingKey(g.pgn); if (ok) ops[ok] = (ops[ok] || 0) + 1;
    const h = c.history({ verbose: true }), p = new Chess(c.header().FEN || undefined);
    const name = `vs ${me === 'w' ? g.black.username : g.white.username}`;
    for (let k = 0; k < h.length; k++) {
      const fb = p.fen(); p.move(h[k].san);
      if (h[k].color !== me || k < 6) continue;
      say(`Game ${gi + 1}/${games.length} (${name}) · move ${Math.floor(k / 2) + 1}… ${added} mistakes found`);
      const uci = h[k].from + h[k].to + (h[k].promotion || '');
      const j = await judge(fb, uci, null, toolSearch, { depth: 10, movetime: 260 });
      if (j && j.loss >= 15) {
        const before = (prog.bank || []).length;
        bankAdd({ fen: fb, best: j.best.pv[0], line: j.best.pv.slice(0, 8), played: h[k].san, loss: j.loss, src: 'chess.com', game: name });
        if ((prog.bank || []).length > before) added++;
      }
    }
    (prog.bankScanned = prog.bankScanned || []).push(g.url); saveProgress();
  }
  return { added, games: games.length };
}
// What kind of mistake was it? (Lichess puzzle theme names, so we can find puzzles with the same idea.)
function mineTags(x) {
  if (x.tags) return x.tags;
  const t = new Set();
  try {
    const side = x.fen.split(' ')[1], line = x.line && x.line.length ? x.line : [x.best];
    const g = new Chess(x.fen); let n = 0, mate = false;
    for (const u of line) { if (!g.move(uciMove(u))) break; n++; if (g.in_checkmate()) { mate = true; break; } }
    if (mate) { const mv = Math.ceil(n / 2); t.add(mv <= 1 ? 'mateIn1' : mv === 2 ? 'mateIn2' : 'mateIn3'); }
    if (forkInfo(x.fen, x.best)) t.add('fork');
    const c = new Chess(x.fen), first = c.move(uciMove(x.best)), sw = materialSwing(x.fen, line, side);
    if (first && first.captured && sw.delta >= 2) t.add('hangingPiece');
    if (x.played) { const p = new Chess(x.fen), pm = p.move(x.played, { sloppy: true }); if (pm && threatened(p.fen()).net >= 2) t.add('hangingPiece'); }
    if (!t.size) t.add(sw.delta >= 2 ? 'advantage' : 'defensiveMove');
  } catch { t.add('advantage'); }
  return (x.tags = [...t]);
}
const MINE_WORD = { mateIn1: 'missed mates in 1', mateIn2: 'missed mates in 2', mateIn3: 'missed mates', fork: 'forks', hangingPiece: 'hanging pieces',
                    advantage: 'winning chances you missed', defensiveMove: 'defending' };
function mineTagCounts() {
  const n = {}; for (const x of prog.bank || []) for (const tg of mineTags(x)) n[tg] = (n[tg] || 0) + 1;
  return n;
}
const mineWeighted = obj => { const e = Object.entries(obj); let r = Math.random() * e.reduce((a, [, v]) => a + v, 0); for (const [k, v] of e) if ((r -= v) <= 0) return k; return e.length ? e[0][0] : null; };
function mineExact(x) {
  return { id: 'my-' + x.id, fen: x.fen, last: '', sol: [x.best], r: prog.rating, th: mineTags(x),
           mine: { kind: 'exact', bankId: x.id, game: x.game, played: x.played, line: x.line } };
}
// Called by the Puzzles tab before it picks a normal puzzle. Returns a puzzle, or null for a normal one.
async function minePick(range) {
  const B = prog.bank || [];
  if (!MINE.on || !B.length || Math.random() > 0.4) return null;
  const now = Date.now(), seen = (prog.mineSeen = prog.mineSeen || {});
  if (Math.random() < 0.35) { // the very same position from your game
    const xs = B.filter(x => x.lvl < IVL.length && !(seen[x.id] > now - DAY / 2));
    const due = xs.filter(x => x.due <= now), pool = due.length ? due : xs;
    if (pool.length) { const x = pool[Math.floor(Math.random() * pool.length)]; seen[x.id] = now; return mineExact(x); }
  }
  // a different puzzle with the same idea
  const [lo, hi] = range, mid = (lo + hi) / 2;
  const fresh = p => !prog.solved[p.id] && !prog.failed[p.id] && (!P.cur || p.id !== P.cur.id);
  const opens = prog.mineOpen || {};
  if (Object.keys(opens).length && Math.random() < 0.25) {
    const key = mineWeighted(opens), p = await fetchOnlinePuzzle(key);
    if (p) return { ...p, mine: { kind: 'opening', tag: key.replace(/_/g, ' ') } };
  }
  const tag = mineWeighted(mineTagCounts()); if (!tag) return null;
  const src = B.filter(x => mineTags(x).includes(tag)).pop();
  let cands = [];
  for (const w of [250, 450, 800]) { cands = PZ_POOL.filter(p => fresh(p) && (p.th || []).includes(tag) && Math.abs(p.r - mid) < w); if (cands.length) break; }
  let p = cands.length ? cands[Math.floor(Math.random() * cands.length)] : await fetchOnlinePuzzle(tag);
  return p ? { ...p, mine: { kind: 'similar', tag, game: src && src.game, played: src && src.played } } : null;
}
function renderMineCard() {
  const el = document.getElementById('mineCard'); if (!el) return;
  const B = prog.bank || [], counts = Object.entries(mineTagCounts()).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const top = counts.map(([k]) => MINE_WORD[k] || themeName(k)).join(', ');
  el.innerHTML = `<div class="card-h">🎯 Puzzles from your games</div>
    <div class="pz-s">${B.length ? `Stockfish has found <b>${B.length}</b> mistakes in your games. About 4 in 10 puzzles are now your own positions or new puzzles with the same idea${top ? ` — mostly <b>${esc(top)}</b>` : ''}.`
      : 'Stockfish checks your Chess.com games, finds your mistakes, and mixes those positions — plus similar puzzles — into your puzzles.'}</div>
    <label class="coach-toggle" style="margin-top:8px"><input type="checkbox" id="mineOn" ${MINE.on ? 'checked' : ''}><span class="tg"></span><span><b>Mix them into my puzzles</b></span></label>
    <div class="inrow"><input id="mineUser" value="${esc(mineUser())}" placeholder="Chess.com username" autocomplete="off" spellcheck="false"><button class="btn" id="mineScan" ${MINE.busy ? 'disabled' : ''}>${MINE.busy ? 'Scanning…' : 'Scan new games'}</button></div>
    <div class="pz-s" id="mineMsg">${esc(MINE.msg)}</div>`;
}
async function mineScan(manual) {
  if (MINE.busy) return;
  const inp = document.getElementById('mineUser'), user = inp ? inp.value : mineUser();
  const say = m => { MINE.msg = m; const e = document.getElementById('mineMsg'); if (e) e.textContent = m; };
  MINE.busy = true; renderMineCard();
  try {
    const r = await scanChessCom(user, manual ? 10 : 5, say);
    prog.mineScanAt = Date.now(); saveProgress();
    MINE.msg = r.games ? `Done — ${r.added} new mistake${r.added === 1 ? '' : 's'} found in ${r.games} game${r.games === 1 ? '' : 's'}.` : 'No new games — everything recent is already scanned.';
  } catch (e) { MINE.msg = e instanceof TypeError ? 'Could not reach Chess.com (no internet?).' : e.message; }
  MINE.busy = false; renderMineCard();
}
// When the Puzzles tab opens: look at new games quietly, at most twice a day.
function mineAutoScan() {
  renderMineCard();
  if (MINE.on && !MINE.busy && Date.now() - (prog.mineScanAt || 0) > DAY / 2) mineScan(false);
}
document.addEventListener('change', e => { if (e.target.id === 'mineOn') { MINE.on = e.target.checked; store.set('pzMine', MINE.on); } });
document.addEventListener('click', e => { if (e.target.id === 'mineScan') mineScan(true); });
function harvestReview() {
  if (!R.meta || !R.meta.userKnown) return;
  const me = R.meta.userColor, game = `${R.meta.white} vs ${R.meta.black}${R.meta.date ? ' · ' + R.meta.date : ''}`;
  R.moves.forEach((m, i) => {
    const c = R.cls[i], ev = R.evals[i];
    if (m.color !== me || !c || !ev || !ev.best || !['mistake', 'blunder', 'miss'].includes(c.kind)) return;
    bankAdd({ fen: R.fens[i], best: ev.best, line: (ev.pv || []).slice(0, 8), played: m.san, loss: c.loss, src: 'review', game });
  });
}
function BankTool() {
  const S = { tok: T.token, view: 'list', items: [], i: 0, cur: null, pos: new Chess(), last: null, orient: 'w', badge: null, arrows: [], state: 'play', why: null,
              oppName: 'Your game', oppAv: '🔁', scan: null };
  function list() {
    S.view = 'list'; S.cur = null; S.pos = new Chess(); S.arrows = []; S.badge = null; S.last = null; S.orient = 'w';
    const B = prog.bank || [], due = bankDue(), mastered = B.filter(x => x.lvl >= IVL.length).length;
    const next = B.filter(x => x.lvl < IVL.length && x.due > Date.now()).sort((a, b) => a.due - b.due)[0];
    const user = store.get('user', '') || 'cheszwither';
    $('trMain').innerHTML = toolHead('🔁', 'My mistakes') + `
      <div class="op-body"><p>Every big mistake from your games becomes a puzzle here. Solve it and it comes back after 1, 3, 7, 16 and 35 days — until the right idea is automatic.</p></div>
      <div class="pz-stats"><div><span class="pz-num">${due.length}</span><span class="pz-lbl">Due now</span></div><div><span class="pz-num">${B.length}</span><span class="pz-lbl">Saved</span></div><div><span class="pz-num">${mastered}</span><span class="pz-lbl">Mastered</span></div></div>
      ${due.length ? `<button class="btn primary wide tr-go" data-tl="bk:go">▶ Practise ${due.length} mistake${due.length > 1 ? 's' : ''}</button>` : `<div class="pz-s">${B.length ? `Nothing due — next one ${next ? 'in ' + Math.max(1, Math.ceil((next.due - Date.now()) / DAY)) + ' day(s)' : 'later'}.` : 'No mistakes saved yet.'}</div>`}
      <div class="card-h" style="margin-top:6px">Add mistakes from your Chess.com games</div>
      <div class="inrow"><input id="bkUser" value="${esc(user)}" placeholder="Chess.com username" autocomplete="off" spellcheck="false"><button class="btn" data-tl="bk:scan" ${S.scan ? 'disabled' : ''}>Scan last 5 games</button></div>
      <div class="pz-s" id="bkMsg">${S.scan ? esc(S.scan) : 'Games vs Stockfish (Play tab) and games you analyse in Game Review are added automatically.'}</div>`;
    draw();
  }
  async function scan() {
    if (MINE.busy) return;
    const tok = S.tok, say = m => { S.scan = m; const el = document.getElementById('bkMsg'); if (el) el.textContent = m; };
    MINE.busy = true;
    try {
      const r = await scanChessCom($('bkUser').value, 5, m => { if (tok === S.tok) say(m); });
      prog.mineScanAt = Date.now(); saveProgress();
      S.scan = null; if (tok === S.tok) { list(); say(r.games ? `Done — ${r.added} new mistake${r.added === 1 ? '' : 's'} added from ${r.games} games.` : 'No new games to scan — all recent games were already scanned.'); }
    } catch (e) { S.scan = null; say(e instanceof TypeError ? 'Could not reach Chess.com (no internet?).' : e.message); }
    MINE.busy = false;
  }
  function go() { S.items = shuffle(bankDue()).slice(0, 10); S.i = 0; S.ok = 0; if (!S.items.length) return list(); load(); }
  function load() {
    const x = (S.cur = S.items[S.i]);
    S.view = 'ex'; S.state = 'play'; S.why = null; S.graded = false; S.pos = new Chess(x.fen); S.orient = S.pos.turn(); S.last = null; S.badge = null; S.arrows = []; S.tries = 0;
    render(); draw();
  }
  function grade(right) {
    const x = S.cur;
    const ok = right && S.tries === 0;
    if (ok) { S.ok++; if (window.dailyBump) dailyBump('pz'); }
    bankGrade(x, ok);
  }
  async function move(from, to, promo) {
    if (S.view !== 'ex' || S.state !== 'play' || S.pos.turn() !== S.orient) return false;
    const mv = toolLegal(S, from, to, promo, move); if (!mv) return false; if (mv === 'wait') return true;
    const fb = S.pos.fen(), m = S.pos.move(mv), uci = m.from + m.to + (m.promotion || ''), tok = S.tok;
    S.last = { from: m.from, to: m.to }; selected = null; S.state = 'checking'; moveSound(m); render(); draw(moveAnim(m));
    let ok = uci === S.cur.best || S.pos.in_checkmate(), j = null;
    if (!ok) { j = await judge(fb, uci, S.cur.best, toolSearch, { depth: 12, movetime: 800 }); if (tok !== S.tok) return true; ok = !!j && j.loss <= 5; }
    if (ok) {
      if (!S.graded) { grade(S.tries === 0); S.graded = true; }
      S.state = 'solved'; S.badge = { sq: m.to, kind: 'best' }; sfx('right');
      const line = { pv: S.cur.line && S.cur.line[0] === uci ? S.cur.line : [uci], score: { cp: 0, mate: null } };
      S.why = ideaHTML(moveIdea(fb, line), false);
    } else {
      if (!S.graded) { grade(false); S.graded = true; }
      S.tries++; S.state = 'wrong'; S.badge = { sq: m.to, kind: 'mistake' }; sfx('wrong');
      try { S.why = j ? whyText(fb, uci, j) : ''; } catch { S.why = ''; }
      const reply = j && j.played.pv[1]; S.arrows = reply ? [[reply.slice(0, 2), reply.slice(2, 4), 'r']] : [];
    }
    render(); draw();
    return true;
  }
  function show() {
    if (S.state === 'wrong') { S.pos = new Chess(S.cur.fen); S.last = null; }
    if (!S.graded) { grade(false); S.graded = true; }
    const fb = S.cur.fen, u = S.cur.best;
    S.state = 'solved'; S.arrows = [[u.slice(0, 2), u.slice(2, 4), 'g']]; S.badge = null;
    S.why = `<p>The better move was <b>${esc(pvSan(fb, [u], 1)[0])}</b>.</p>` + ideaHTML(moveIdea(fb, { pv: S.cur.line && S.cur.line.length ? S.cur.line : [u], score: { cp: 0, mate: null } }), false);
    render(); draw();
  }
  function render() {
    if (S.view === 'list') return list();
    if (S.view === 'done') {
      $('trMain').innerHTML = toolHead('🔁', 'My mistakes') + `<div class="tr-score">${S.ok} / ${S.items.length}<small>fixed on the first try</small></div>
        <div class="op-body"><p>Solved ones come back later at longer gaps; missed ones come back tomorrow.</p></div><div class="row"><button class="btn primary" data-tl="bk:list">Back</button></div>`;
      return;
    }
    const x = S.cur;
    let st = '';
    if (S.state === 'play') st = `<div class="tr-task">In your game ${x.game ? `(${esc(x.game)})` : ''} you played <b class="mono">${esc(x.played || '?')}</b> here${x.loss ? ` — it cost about ${x.loss}% win chance` : ''}. <b>Find a better move</b> for ${colorName(S.orient)}.</div>`;
    else if (S.state === 'checking') st = '<div class="pz-s"><span class="spin"></span> Checking…</div>';
    else if (S.state === 'wrong') st = `<div class="tr-verdict bad">✕ Not that one either</div><div class="coach-b">${S.why || ''}</div>`;
    else st = `<div class="tr-verdict good">✓ ${S.tries ? 'Found it' : 'Fixed!'}</div><div class="coach-b">${S.why || ''}</div>`;
    const btns = S.state === 'play' ? '<button class="btn" data-tl="bk:show">👁 Show answer</button>'
      : S.state === 'wrong' ? '<button class="btn primary" data-tl="bk:retry">↻ Try again</button><button class="btn" data-tl="bk:show">👁 Show answer</button>'
      : S.state === 'solved' ? `<button class="btn primary" data-tl="bk:next">${S.i + 1 < S.items.length ? 'Next ▶' : 'Finish ▶'}</button>` : '';
    $('trMain').innerHTML = toolHead('🔁', 'My mistakes', `Mistake ${S.i + 1} of ${S.items.length}`) + st + (btns ? `<div class="row">${btns}</div>` : '');
  }
  const draw = anim => toolBoard(S, anim);
  S.canMove = () => S.view === 'ex' && S.state === 'play' && S.pos.turn() === S.orient;
  const act = a => {
    if (a === 'bk:go') go();
    else if (a === 'bk:scan') scan();
    else if (a === 'bk:list') { S.view = 'list'; list(); }
    else if (a === 'bk:show') show();
    else if (a === 'bk:retry') { S.pos = new Chess(S.cur.fen); S.last = null; S.badge = null; S.arrows = []; S.state = 'play'; render(); draw(); }
    else if (a === 'bk:next') { S.i++; if (S.i < S.items.length) load(); else { S.view = 'done'; render(); } }
  };
  list();
  return { act, draw, pos: () => S.pos, move: (f, t) => { if (!S.canMove() || !S.pos.moves({ square: f, verbose: true }).some(m => m.to === t)) return false; move(f, t); return true; },
           canPick: p => S.canMove() && p.color === S.orient, stop: () => { S.tok = -1; } };
}

// ---------------------------------------------------------------- Weakness report
function WeakTool() {
  const S = { pos: new Chess(), orient: 'w', oppName: 'Report', oppAv: '📊' };
  const rows = [];
  const P = trProg(), solvedIds = prog.solved || {}, failedIds = prog.failed || {};
  const byId = new Map(PZ_POOL.map(p => [p.id, p]));
  for (const L of TR_LESSONS) {
    if (!L.practice.themes) continue;
    let ok = 0, n = 0;
    const s = P.stats[L.id]; if (s) { ok += s[0]; n += s[1]; }
    for (const [id, v] of [...Object.keys(solvedIds).map(i => [i, 1]), ...Object.keys(failedIds).map(i => [i, 0])]) {
      const p = byId.get(id); if (p && p.th.some(t => L.practice.themes.includes(t))) { ok += v; n++; }
    }
    rows.push({ L, name: L.title, icon: L.icon, ok, n });
  }
  const sf = prog.safe; rows.push({ tool: 'safe', name: 'Is it safe? (spotting hanging pieces)', icon: '🛡', ok: sf ? sf.ok : 0, n: sf ? sf.total : 0 });
  const B = prog.bank || []; const fixed = B.filter(x => x.lvl > 0).length;
  rows.push({ tool: 'mistakes', name: 'Fixing your own mistakes', icon: '🔁', ok: fixed, n: B.length });
  const ranked = rows.filter(r => r.n >= 3).sort((a, b) => a.ok / a.n - b.ok / b.n);
  const weakest = ranked[0], untried = rows.filter(r => r.n < 3);
  const bar = r => { const pct = r.n ? Math.round(r.ok / r.n * 100) : null; return `<div class="wk-row"><span class="ic">${r.icon}</span><span class="nm">${esc(r.name)}</span>
    <span class="wk-bar">${pct == null ? '' : `<i style="width:${pct}%" class="${pct < 50 ? 'lo' : pct < 75 ? 'mid' : 'hi'}"></i>`}</span><span class="wk-n">${pct == null ? `<small>${r.n ? r.n + ' tries' : '—'}</small>` : pct + '%'}</span></div>`; };
  $('trMain').innerHTML = toolHead('📊', 'Weakness report') + `
    ${weakest ? `<div class="op-body"><p>Your weakest skill right now: <b>${weakest.icon} ${esc(weakest.name)}</b> (${Math.round(weakest.ok / weakest.n * 100)}% of ${weakest.n}).</p></div>
      <button class="btn primary wide" data-tl="wk:${weakest.tool ? 'tool:' + weakest.tool : 'lesson:' + weakest.L.id}">Practise this next ▶</button>`
      : '<div class="op-body"><p>Not enough data yet — do a few lessons, puzzles and drills, then come back. Each skill needs at least 3 tries.</p></div>'}
    <div class="wk">${[...ranked, ...untried].map(bar).join('')}</div>
    <div class="pz-s">Counts your Train practice, Puzzles-tab puzzles of the same themes, the safety drill and your mistake bank.</div>`;
  toolBoard(S);
  return { act: a => { if (a.startsWith('wk:tool:')) trOpenTool(a.slice(8)); else if (a.startsWith('wk:lesson:')) { T.tool = null; trStartPractice(TR_LESSONS.find(l => l.id === a.slice(10))); } },
           draw: () => toolBoard(S), pos: () => S.pos, move: () => false, canPick: () => false };
}
