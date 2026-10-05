'use strict';
// ======================================================================
// ENDGAMES — perfect play from the Lichess Syzygy tablebase (up to 7 pieces)
// ======================================================================
// Every position's goal was verified against the tablebase. `side` = the colour you play.
const EG_GROUPS = [
  { name: 'Basic checkmates', items: [
    { id: 'eg-rr', name: 'Two rooks — the ladder', fen: '8/8/8/4k3/8/8/8/R3K2R w - - 0 1', goal: 'win', side: 'w',
      tech: 'The easiest mate. The rooks take turns: one cuts the king off on a rank, the other checks on the next rank — pushing it back rank by rank like climbing a ladder. If the king attacks a rook, swing that rook to the far side of the board.' },
    { id: 'eg-kq', name: 'King + queen', fen: '8/8/8/4k3/8/8/8/3QK3 w - - 0 1', goal: 'win', side: 'w',
      tech: '1) Put your queen a knight\'s jump away from the enemy king — it shrinks the king\'s box every move without giving check. 2) Follow the king as the box shrinks. 3) STOP when it has only two squares on the edge — don\'t stalemate! 4) Bring your own king next to it, then mate on the edge.' },
    { id: 'eg-kr', name: 'King + rook — the box', fen: '8/8/8/4k3/8/8/8/R3K3 w - - 0 1', goal: 'win', side: 'w',
      tech: 'The rook builds a box around the king. Shrink the box whenever you safely can; when you can\'t, bring your king closer. When the kings face each other (opposition), check with the rook to push the king back a rank. Keep the rook far from the enemy king or protected.' },
    { id: 'eg-bb', name: 'Two bishops', fen: '8/8/8/4k3/8/8/8/2B1KB2 w - - 0 1', goal: 'win', side: 'w',
      tech: 'Bishops side by side make a diagonal wall the king can\'t cross. With your king helping, drive the enemy king to the edge and then into ANY corner. Watch for stalemate once it is cornered.' },
    { id: 'eg-bn', name: 'Bishop + knight (expert)', fen: '8/8/8/4k3/8/8/8/1N2KB2 w - - 0 1', goal: 'win', side: 'w',
      tech: 'The hardest basic mate (up to 30+ moves). You can only force mate in a corner the SAME colour as your bishop — here a light bishop, so h1 or a8. Drive the king to the edge first, then use the knight\'s "W manoeuvre" to push it from the wrong corner to the right one.' },
  ] },
  { name: 'Pawn endings', items: [
    { id: 'eg-key', name: 'Key squares', fen: '8/8/3k4/8/3K4/8/3P4/8 w - - 0 1', goal: 'win', side: 'w',
      tech: 'For a pawn on its 2nd–4th rank, the KEY SQUARES are the three squares two ranks in front of it (for d2: c4, d4, e4). If your king stands on a key square, the pawn queens by force. You\'re already there: keep your king in FRONT of the pawn, gain ground with opposition, and only push the pawn when your king has made the path safe.' },
    { id: 'eg-opp', name: 'Opposition & zugzwang', fen: '4k3/8/4K3/4P3/8/8/8/8 b - - 0 1', goal: 'win', side: 'w',
      tech: 'Kings facing each other with one square between them = OPPOSITION; the side that does NOT have to move holds it. Black must move and give way. Step your king to the side the black king left (e.g. …Kd8 Kf7), then the pawn walks home. Pushing the pawn too early lets Black reach a stalemate.' },
    { id: 'eg-oppdef', name: 'Defend with the opposition', fen: '8/8/4k3/8/4K3/4P3/8/8 w - - 0 1', goal: 'draw', side: 'b',
      tech: 'You are Black. Keep your king IN FRONT of the pawn. Whenever White\'s king steps forward, step directly in front of it (take the opposition). When the pawn arrives with check on your 2nd rank, go straight back (in front of it), not to the side — the game ends in stalemate or the pawn is lost.' },
    { id: 'eg-rookpawn', name: 'Rook pawn — the corner draw', fen: 'k7/8/1K6/P7/8/8/8/8 b - - 0 1', goal: 'draw', side: 'b',
      tech: 'You are Black. An a- or h-pawn cannot be won if your king reaches the corner in front of it — White\'s king has no room to get around. Just shuttle between a8 and b8. Stalemate is your friend here.' },
    { id: 'eg-square', name: 'Rule of the square', fen: '8/8/8/8/P7/4k3/8/7K b - - 0 1', goal: 'draw', side: 'b',
      tech: 'You are Black. Draw a square from the pawn to its queening square (a4–d4–d8–a8). If your king can step INTO that square, you catch the pawn. Only one move here does it — every other move loses!' },
    { id: 'eg-outside', name: 'Outside passed pawn', fen: '8/8/8/p1k5/8/2K5/1P4P1/8 w - - 0 1', goal: 'win', side: 'w',
      tech: 'Your g-pawn is far from the kings — an "outside passed pawn". Push it to drag Black\'s king over to stop it; meanwhile your king walks over and eats the queenside pawn. A decoy that wins most pawn endings.' },
  ] },
  { name: 'Rook endings', items: [
    { id: 'eg-lucena', name: 'Lucena — build a bridge', fen: '1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1', goal: 'win', side: 'w',
      tech: 'The most important winning rook endgame. Your pawn is on the 7th and your king is in front of it. 1) Check the black king further away (Rd1+). 2) Lift your rook to the 4th rank (Rd4) — the "bridge". 3) Walk your king out; when the black rook checks, block with your rook on the 4th rank. The pawn queens.' },
    { id: 'eg-philidor', name: 'Philidor — the 3rd-rank defence', fen: '4k3/R7/1r6/3KP3/8/8/8/8 b - - 0 1', goal: 'draw', side: 'b',
      tech: 'You are Black: the most important drawing rook endgame. Keep your rook on your 3rd rank (the 6th rank here) so White\'s king can\'t advance. Once White pushes the pawn to the 6th, swing your rook to the far end of the board and give checks from behind — White\'s king has nowhere to hide.' },
    { id: 'eg-rvp', name: 'Rook vs pawn', fen: '8/8/8/8/8/2k5/2p5/4K2R w - - 0 1', goal: 'win', side: 'w',
      tech: 'The pawn is one step from queening. Keep your rook behind or beside it to stop it, and bring your king to help. If the black king guards the pawn, use rook checks to drive it away — then capture the pawn.' },
  ] },
  { name: 'Queen endings', items: [
    { id: 'eg-qvp', name: 'Queen vs pawn on the 7th', fen: '8/8/8/8/8/8/4pk2/K6Q w - - 0 1', goal: 'win', side: 'w',
      tech: 'Check and pin to force the black king IN FRONT of its own pawn. Each time it blocks the pawn, you get a free move to bring your king one step closer. Repeat until your king arrives and helps win the pawn. (Against a-, c-, f- and h-pawns this is often a draw because of stalemate tricks.)' },
  ] },
];
const EG_ITEMS = EG_GROUPS.flatMap(g => g.items.map(it => ({ ...it, group: g.name })));
const G = { item: null, pos: null, explore: false, state: 'idle', tb: null, last: null, badge: null, hint: false, show: false, coach: null,
            mistakes: 0, hints: 0, userMoves: 0, token: 0, offline: false, undoLast: null, log: [] };
const tbCache = new Map();
let egEngine = null;

// ---------- tablebase ----------
async function tbFetch(fen) {
  const key = fen.split(' ').slice(0, 5).join(' ');
  if (tbCache.has(key)) return tbCache.get(key);
  const pieces = fen.split(' ')[0].replace(/[^a-z]/gi, '').length;
  if (pieces > 7) return { tooMany: true };
  try {
    const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch('https://tablebase.lichess.ovh/standard?fen=' + encodeURIComponent(fen), { signal: ctrl.signal });
    clearTimeout(t);
    if (!r.ok) return null;
    const j = await r.json();
    tbCache.set(key, j); G.offline = false;
    return j;
  } catch { G.offline = true; return null; }
}
// win = 1 / draw = 0 / loss = -1 for the side to move. Cursed wins/blessed losses are draws under the 50-move rule.
const wdl = cat => (cat === 'win' || cat === 'maybe-win' ? 1 : cat === 'loss' || cat === 'maybe-loss' ? -1 : 0);
const WDL_WORD = { 1: 'winning', 0: 'drawn', '-1': 'losing' };
// "mate in N" (or DTZ) from the mover's point of view
function distText(t) {
  if (!t) return '';
  if (t.checkmate) return 'checkmate';
  if (t.dtm != null && t.dtm !== 0) return `mate in ${Math.ceil(Math.abs(t.dtm) / 2)}`;
  if (t.dtz != null && t.dtz !== 0) return `${Math.abs(t.dtz)} plies to a pawn move/capture`;
  return '';
}
const moveTag = m => { const r = -wdl(m.category); return { r, txt: r > 0 ? 'Win' : r < 0 ? 'Loss' : 'Draw', d: m.checkmate ? 'mate' : m.dtm != null && m.dtm !== 0 ? `M${Math.ceil(Math.abs(m.dtm) / 2)}` : '' }; };

// ---------- flow ----------
const egUser = () => (G.explore ? G.pos.turn() : G.item.side);
function egStart(item) {
  G.token++; G.item = item; G.explore = false; G.pos = new Chess(item.fen);
  G.last = null; G.badge = null; G.hint = false; G.coach = null; G.mistakes = 0; G.hints = 0; G.userMoves = 0; G.log = [];
  G.show = false; selected = null;
  flip.endgame = item.side === 'b';
  prog.egItem = item.id; saveProgress();
  egRender();
  egTurn();
}
function egExplore(fen) {
  const c = new Chess();
  if (!c.load(fen)) { G.coach = { kind: 'bad', icon: '⚠', title: 'That FEN is not valid' }; egRender(); return; }
  G.token++; G.explore = true; G.pos = c; G.last = null; G.badge = null; G.hint = false; G.coach = null; G.show = true; G.log = []; selected = null;
  flip.endgame = c.turn() === 'b';
  egRender(); egTurn();
}
async function egTurn() {
  const token = G.token, fen = G.pos.fen();
  if (G.pos.game_over()) return egOver();
  G.state = 'load'; egRender();
  const t = await tbFetch(fen);
  if (G.token !== token) return;
  G.tb = t && !t.tooMany ? t : null;
  if (G.explore || G.pos.turn() === G.item.side) { G.state = 'play'; egRender(); return; }
  // opponent: perfect tablebase defence (random among equally good moves), Stockfish if offline
  G.state = 'wait'; egRender();
  await new Promise(r => setTimeout(r, 450));
  if (G.token !== token) return;
  let uci = null;
  if (G.tb && G.tb.moves.length) {
    const b = G.tb.moves[0], same = G.tb.moves.filter(m => m.category === b.category && m.dtz === b.dtz && m.dtm === b.dtm);
    uci = same[Math.floor(Math.random() * same.length)].uci;
  } else {
    if (!egEngine) egEngine = new Engine();
    const r = await egEngine.search(fen, { depth: 18, movetime: 1500 }).promise;
    if (G.token !== token) return;
    uci = r && r.bestmove;
  }
  if (!uci) return;
  const m = G.pos.move(uciMove(uci));
  G.last = { from: m.from, to: m.to }; G.badge = null; G.log.push({ who: 'them', san: m.san });
  if (mode === 'endgame') moveSound(m);
  egDraw(moveAnim(m));
  egTurn();
}
function egOver() {
  G.state = 'over';
  if (G.explore) { G.coach = { kind: 'play', icon: '🏁', title: G.pos.in_checkmate() ? 'Checkmate' : 'Draw' }; egRender(); return; }
  const it = G.item, mated = G.pos.in_checkmate(), userWon = mated && G.pos.turn() !== it.side, drawn = !mated;
  const success = it.goal === 'win' ? userWon : !(mated && G.pos.turn() === it.side);
  if (success) egSuccess(mated ? 'Checkmate!' : 'Draw secured!');
  else {
    const why = G.pos.in_stalemate() ? 'Stalemate — the king had no moves and wasn\'t in check.' : G.pos.insufficient_material() ? 'Not enough material left to mate.' : drawn ? 'The game was drawn.' : 'You were checkmated.';
    G.coach = { kind: 'bad', icon: '✕', title: it.goal === 'win' ? 'The win slipped away' : 'Lost', body: `<p>${why}</p>`, actions: [{ id: 'retry', label: '↻ Try again', primary: true }] };
    sfx('wrong'); egRender();
  }
}
function egSuccess(title) {
  const it = G.item, p = (prog.endgames[it.id] = prog.endgames[it.id] || { done: 0, perfect: 0 });
  const perfect = !G.mistakes && !G.hints;
  p.done++; if (perfect) p.perfect++;
  saveProgress(); sfx('end');
  G.state = 'over';
  G.coach = { kind: 'good', icon: '🏆', title, body: `<p>${perfect ? 'Perfect — no mistakes and no hints! ★' : `${G.mistakes} mistake${G.mistakes === 1 ? '' : 's'}, ${G.hints} hint${G.hints === 1 ? '' : 's'}. Try again for a clean ★.`}</p><p class="pz-s">${G.userMoves} moves played.</p>`,
              actions: [{ id: 'retry', label: '↻ Again' }, { id: 'next', label: 'Next endgame ⏭', primary: true }] };
  egRender(); egLines();
}
async function egMove(from, to, promo, anim = true) {
  selected = null;
  if (G.state !== 'play' || G.pos.turn() !== egUser()) return false;
  const legal = G.pos.moves({ square: from, verbose: true }).filter(m => m.to === to);
  if (!legal.length) return false;
  if (legal.some(m => m.promotion) && !promo) { askPromotion(G.pos.turn(), q => egMove(from, to, q)); return true; }
  const before = G.tb, prevLast = G.last, token = G.token;
  const m = G.pos.move({ from, to, promotion: promo || undefined }), uci = from + to + (promo || '');
  G.last = { from, to }; G.hint = false; moveSound(m); egDraw(anim ? moveAnim(m) : null);
  if (G.explore) { G.log.push({ who: 'me', san: m.san }); return egTurn(), true; }
  G.userMoves++;
  const entry = before && before.moves.find(x => x.uci === uci);
  if (!before || !entry) { G.log.push({ who: 'me', san: m.san }); egTurn(); return true; }
  const was = wdl(before.category), now = -wdl(entry.category), best = before.moves[0];
  if (now < was) {
    // result got worse: explain and offer a take-back
    G.mistakes++; G.badge = { sq: to, kind: 'blunder' }; G.undoLast = prevLast; G.state = 'review';
    G.coach = { kind: 'bad', icon: '??', title: `${m.san} ${was > 0 && now === 0 ? 'throws away the win' : was > 0 ? 'loses!' : 'loses the draw'}`,
                body: `<p>Before your move the position was <b>${WDL_WORD[was]}</b>${distText(before) ? ` (${distText(before)})` : ''}. After ${m.san} it is <b>${WDL_WORD[now]}</b>.</p>
                       ${G.pos.in_stalemate() ? '<p>Stalemate! The king has no legal moves and isn\'t in check.</p>' : ''}
                       <p>A correct move was <b>${best.san}</b>. Remember the technique: ${esc(G.item.tech)}</p>`,
                actions: [{ id: 'takeback', label: '↶ Take it back', primary: true }, { id: 'keep', label: 'Keep playing' }] };
    sfx('wrong'); egRender(); return true;
  }
  // still on track: was it the fastest?
  const optimal = entry.category === best.category && entry.dtm === best.dtm && entry.dtz === best.dtz;
  G.badge = { sq: to, kind: optimal ? 'best' : 'good' };
  let note = '';
  if (was > 0) note = optimal ? `✓ Perfect${entry.dtm ? ` — mate in ${Math.ceil(Math.abs(entry.dtm) / 2)}` : ''}` : `✓ Still winning, but slower${best.dtm ? ` (best: ${best.san}, mate in ${Math.ceil(Math.abs(best.dtm) / 2)})` : ` (best: ${best.san})`}`;
  else note = '✓ Still a draw — good defence';
  G.log.push({ who: 'me', san: m.san, note });
  egDraw();
  if (G.token !== token) return true;
  // a held draw: once the pawns are gone, or after 25 accurate moves, call it
  if (G.item.goal === 'draw' && !G.pos.game_over() && (G.pos.insufficient_material() || G.userMoves >= 25)) { egSuccess('Draw held!'); return true; }
  egTurn();
  return true;
}
function egAction(id) {
  if (id === 'takeback') { G.pos.undo(); G.userMoves--; G.badge = null; G.last = G.undoLast; G.coach = null; G.state = 'play'; egRender(); }
  else if (id === 'keep') { G.coach = null; G.log.push({ who: 'bad', san: G.pos.history().slice(-1)[0], note: '?? mistake' }); egTurn(); }
  else if (id === 'retry') egStart(G.item);
  else if (id === 'next') egStart(EG_ITEMS[(EG_ITEMS.indexOf(EG_ITEMS.find(x => x.id === G.item.id)) + 1) % EG_ITEMS.length]);
}

// ---------- rendering ----------
function egDraw(anim) {
  if (mode !== 'endgame') return;
  if (!G.pos) { drawBoard({ pos: new Chess() }); return; }
  const arrows = [];
  if (G.hint && G.tb && G.tb.moves[0]) { const u = G.tb.moves[0].uci; arrows.push({ from: u.slice(0, 2), to: u.slice(2, 4), color: '#f7c045' }); }
  drawBoard({ pos: G.pos, last: G.last, sel: selected, targets: selected ? G.pos.moves({ square: selected, verbose: true }) : [], badge: G.badge, arrows, anim });
  const u = G.explore ? 'w' : G.item.side;
  const me = { name: G.explore ? 'White' : 'You', av: G.explore ? 'W' : '🙂', toMove: G.pos.turn() === u && !G.pos.game_over() };
  const tb = { name: G.explore ? 'Black' : 'Tablebase', elo: G.explore ? null : 'perfect play', av: G.explore ? 'B' : '📚', toMove: G.pos.turn() !== u && !G.pos.game_over() };
  renderCards(G.pos, u === 'w' ? { w: me, b: tb } : { w: tb, b: me }, false);
  // eval bar: full for a win, middle for a draw
  const t = G.tb;
  if (t) { const r = wdl(t.category) * (G.pos.turn() === 'w' ? 1 : -1); showEval(r ? { cp: r * 1000, mate: t.dtm ? Math.ceil(t.dtm / 2) * (G.pos.turn() === 'w' ? 1 : -1) : null } : { cp: 0, mate: null }); }
  else showEval(null);
}
function egStatusParts() {
  if (G.coach) return G.coach;
  const it = G.item, t = G.tb;
  const offline = G.offline ? '<p class="pz-s">⚠ Can\'t reach the tablebase (no internet?) — Stockfish is defending instead, and moves can\'t be checked.</p>' : '';
  if (G.explore) {
    const who = G.pos.turn() === 'w' ? 'White' : 'Black';
    const res = !t ? (G.state === 'load' ? 'Looking it up…' : 'Not in the tablebase (more than 7 pieces?)') : `${who} to move: ${WDL_WORD[wdl(t.category)]}${distText(t) ? ` — ${distText(t)}` : ''}`;
    return { kind: 'play', icon: '🔍', title: 'Tablebase explorer', sub: res, body: offline + '<p>Move pieces for either side, or click a move in the list below.</p>' };
  }
  const goal = it.goal === 'win' ? 'Win' : 'Hold the draw';
  const status = !t ? '' : `Tablebase: ${WDL_WORD[G.pos.turn() === it.side ? wdl(t.category) : -wdl(t.category)]}${distText(t) ? ` · ${distText(t)}` : ''} for you`;
  const last = G.log.slice(-1)[0];
  let body = `<p>${esc(it.tech)}</p>${offline}`;
  if (last && last.note) body = `<p class="${last.who === 'bad' ? '' : 'op-ok'}">${esc(last.san)} — ${esc(last.note)}</p>` + body;
  if (G.hint && t && t.moves[0]) body = `<p class="op-task">💡 Play ${esc(t.moves[0].san)}${t.moves[0].dtm ? ` (mate in ${Math.ceil(Math.abs(t.moves[0].dtm) / 2)})` : ''}</p>` + body;
  return { kind: G.state === 'wait' ? 'play' : 'play', icon: it.goal === 'win' ? '♔' : '🛡',
           title: G.state === 'wait' ? 'Tablebase is replying…' : `${goal} — ${G.pos.turn() === it.side ? 'your move' : '…'}`, sub: status, body };
}
function egRender() {
  const p = egStatusParts();
  $('egStatus').className = 'card pz-status ' + p.kind;
  $('egStatus').innerHTML = `<div class="pz-h"><span class="pz-ic">${p.icon}</span><div><div class="pz-t">${p.title}</div>${p.sub ? `<div class="pz-s">${p.sub}</div>` : ''}</div></div>
    ${p.body ? `<div class="op-body">${p.body}</div>` : ''}
    ${p.actions ? `<div class="row">${p.actions.map(a => `<button class="btn${a.primary ? ' primary' : ''}" data-act="${a.id}">${a.label}</button>`).join('')}</div>` : ''}
    ${G.item && !G.explore ? `<div class="tags"><span class="tag">${esc(G.item.group)} · ${esc(G.item.name)}</span><span class="tag lvl">Goal: ${G.item.goal === 'win' ? 'WIN' : 'DRAW'}</span></div>` : ''}`;
  $('egHint').disabled = G.explore || G.state !== 'play';
  $('egShow').textContent = G.show ? '🙈 Hide tablebase' : '📊 Show tablebase';
  egMovesList(); egDraw();
}
function egMovesList() {
  const box = $('egTb'), t = G.tb;
  box.hidden = !G.show;
  if (!G.show) return;
  if (!t) { box.innerHTML = `<div class="pz-s">${G.state === 'load' ? '<span class="spin"></span> Looking up…' : 'No tablebase data for this position.'}</div>`; return; }
  box.innerHTML = `<div class="card-h" style="margin-bottom:6px">${G.pos.turn() === 'w' ? 'White' : 'Black'}'s moves — perfect results</div>` +
    t.moves.map(m => { const g = moveTag(m); return `<button class="eg-mv" data-uci="${m.uci}"><b>${esc(m.san)}</b><span class="eg-r ${g.r > 0 ? 'w' : g.r < 0 ? 'l' : 'd'}">${g.txt}</span><small>${g.d}</small></button>`; }).join('');
}
function egLines() {
  let html = '';
  for (const g of EG_GROUPS) {
    html += `<div class="op-group">${esc(g.name)}</div>`;
    for (const it of g.items) {
      const p = prog.endgames[it.id] || { done: 0, perfect: 0 };
      html += `<button class="op-line${G.item && G.item.id === it.id && !G.explore ? ' on' : ''}" data-id="${it.id}"><span class="st">${p.perfect ? '★' : p.done ? '✓' : '○'}</span>
        <span class="nm">${esc(it.name)}</span><span class="stars">${it.goal === 'win' ? 'win' : 'draw'}</span></button>`;
    }
  }
  $('egList').innerHTML = html;
  const done = EG_ITEMS.filter(it => (prog.endgames[it.id] || {}).done).length;
  $('egProg').textContent = `${done}/${EG_ITEMS.length} done`;
}

// ---------- controls ----------
$('egList').onclick = e => { const b = e.target.closest('.op-line'); if (b) egStart(EG_ITEMS.find(x => x.id === b.dataset.id)); };
$('egStatus').onclick = e => { const b = e.target.closest('[data-act]'); if (b) egAction(b.dataset.act); };
$('egHint').onclick = () => { if (G.state !== 'play' || G.explore || !G.tb) return; G.hint = true; G.hints++; egRender(); };
$('egRestart').onclick = () => (G.explore ? egExplore($('egFen').value.trim() || G.item.fen) : egStart(G.item));
$('egShow').onclick = () => { G.show = !G.show; egRender(); };
$('egFlip').onclick = () => { flip.endgame = !flip.endgame; egDraw(); };
$('egTb').onclick = e => { const b = e.target.closest('.eg-mv'); if (!b || G.state !== 'play') return; const u = b.dataset.uci; egMove(u.slice(0, 2), u.slice(2, 4), u[4] || null); };
$('egLoad').onclick = () => egExplore($('egFen').value.trim());
$('egFromHere').onclick = () => { $('egFen').value = G.pos.fen(); egExplore(G.pos.fen()); };
$('egFromPlay').onclick = () => { $('egFen').value = game.fen(); egExplore(game.fen()); };
EXTRA_MODES.endgame = {
  view: 'endgameView',
  ctl: {
    pos: () => G.pos || new Chess(), draw: () => egDraw(), move: (f, t, anim) => egMove(f, t, null, anim),
    canPick: p => G.state === 'play' && p.color === G.pos.turn() && (G.explore || p.color === G.item.side),
  },
  draw: () => egDraw(),
  init: () => { egLines(); G.item = EG_ITEMS.find(x => x.id === prog.egItem) || EG_ITEMS[0]; G.pos = new Chess(G.item.fen); flip.endgame = G.item.side === 'b'; egRender(); },
  enter: () => { if (G.state === 'idle') egStart(G.item); },
};
