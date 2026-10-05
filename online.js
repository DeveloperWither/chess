'use strict';
// ======================================================================
// ONLINE — accounts, friends, challenges and 2/3/4-player team chess (Firebase)
// ======================================================================
// Turn order: White's team and Black's team alternate, teammates rotate.
//   3 players (2 v 1): W1 → B → W2 → B → W1 …      4 players: W1 → B1 → W2 → B2 …
const FB_VER = '10.12.2';
const EMU = /[?&]emu=1/.test(location.search); // local Firebase emulator (testing)
const NAME_RE = /^[A-Za-z0-9_]{5,20}$/;
const ONLINE_MS = 120000;
const N = { ready: false, cfgMissing: false, auth: null, db: null, user: null, me: null, friends: [], fdocs: {}, invites: [], games: [],
            gid: null, game: null, chess: null, prevPly: -1, dlg: null, unsub: [], gUnsub: null, fUnsubs: {}, beat: null, offline: false, msg: '' };
const emailOf = name => `${name.toLowerCase()}@users.chess-studio.app`;
const loadScript = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
const isOnline = u => u && u.lastSeen && Date.now() - u.lastSeen < ONLINE_MS;
const nm = (g, uid) => (g.names && g.names[uid]) || '?';
const FV = () => firebase.firestore.FieldValue;

// ---------- game rules ----------
// Who has to move at ply p (null while the game hasn't started).
function seatAt(g, p) { const team = p % 2 ? g.b : g.w; return team && team.length ? team[Math.floor(p / 2) % team.length] : null; }
function turnOrder(g) { const out = [], n = g.size === 2 ? 2 : 4; for (let p = 0; p < n; p++) out.push({ uid: seatAt(g, p), color: p % 2 ? 'b' : 'w' }); return out; }
// Which sides a new player may join: 2 = one each; 3 = teams of 2+1 (each side needs at least one); 4 = two each.
function openSides(g) {
  const cap = g.size === 2 ? 1 : 2, total = g.w.length + g.b.length, left = g.size - total, out = [];
  for (const c of ['w', 'b']) {
    if (g[c].length >= cap || left <= 0) continue;
    const other = c === 'w' ? 'b' : 'w';
    if (left === 1 && g[other].length === 0) continue; // last seat must go to the empty side
    out.push(c);
  }
  return out;
}
const myColor = g => (g.w.includes(N.me.uid) ? 'w' : g.b.includes(N.me.uid) ? 'b' : null);
const sideName = c => (c === 'w' ? 'White' : 'Black');

// ---------- boot ----------
async function onInit() {
  const cfg = EMU ? { apiKey: 'demo-key', authDomain: 'demo-chess.firebaseapp.com', projectId: 'demo-chess' } : window.FIREBASE_CONFIG;
  if (!cfg) { N.cfgMissing = true; onRender(); return; }
  try {
    for (const m of ['app', 'auth', 'firestore']) await loadScript(`https://www.gstatic.com/firebasejs/${FB_VER}/firebase-${m}-compat.js`);
  } catch { N.offline = true; onRender(); return; }
  firebase.initializeApp(cfg);
  N.auth = firebase.auth(); N.db = firebase.firestore();
  if (EMU) { N.auth.useEmulator('http://127.0.0.1:9099'); N.db.useEmulator('127.0.0.1', 8080); }
  N.ready = true;
  N.auth.onAuthStateChanged(u => (u ? signedIn(u) : signedOut()));
}
function showLogin(on) {
  $('login').hidden = !on;
  if (on) setTimeout(() => $('lgName').focus(), 50);
}
async function doLogin(create) {
  const name = $('lgName').value.trim(), pw = $('lgPass').value, pw2 = $('lgPass2').value;
  const err = t => { $('lgErr').textContent = t; };
  if (!NAME_RE.test(name)) return err('Username: 5–20 letters, numbers or _');
  if (pw.length < 8) return err('Password: at least 8 characters');
  if (create && pw !== pw2) return err('The two passwords are different');
  err(''); $('lgGo').disabled = true; $('lgGo').innerHTML = '<span class="spin"></span>';
  try {
    if (create) {
      N.pendingName = name;
      const cred = await N.auth.createUserWithEmailAndPassword(emailOf(name), pw);
      await N.db.collection('users').doc(cred.user.uid).set({ name, nameLower: name.toLowerCase(), lastSeen: Date.now(), created: Date.now() }, { merge: true });
    } else await N.auth.signInWithEmailAndPassword(emailOf(name), pw);
    $('lgPass').value = $('lgPass2').value = '';
  } catch (e) {
    const c = e.code || '';
    err(c.includes('email-already-in-use') ? 'That username is taken — pick another one'
      : c.includes('invalid-credential') || c.includes('wrong-password') || c.includes('user-not-found') ? 'Wrong username or password'
      : c.includes('network') ? 'No internet connection' : c.includes('too-many') ? 'Too many tries — wait a minute' : 'Could not log in: ' + (e.message || c));
  } finally { $('lgGo').disabled = false; $('lgGo').textContent = create ? 'Create account' : 'Log in'; }
}
async function signedIn(u) {
  N.user = u; showLogin(false); store.set('onlineSkip', false);
  const snap = await N.db.collection('users').doc(u.uid).get();
  const name = (snap.exists && snap.data().name) || N.pendingName || u.email.split('@')[0];
  N.me = { uid: u.uid, name };
  if (!snap.exists) await N.db.collection('users').doc(u.uid).set({ name, nameLower: name.toLowerCase(), lastSeen: Date.now(), created: Date.now() }, { merge: true });
  beat(); clearInterval(N.beat); N.beat = setInterval(beat, 45000);
  const uid = u.uid;
  N.unsub.push(N.db.collection('users').doc(uid).collection('friends').onSnapshot(s => { N.friends = s.docs.map(d => ({ uid: d.id, ...d.data() })).sort((a, b) => a.name.localeCompare(b.name)); watchFriends(); onRender(); }));
  N.unsub.push(N.db.collection('games').where('invited', 'array-contains', uid).onSnapshot(s => {
    const before = N.invites.length;
    N.invites = s.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => g.status === 'waiting');
    if (N.invites.length > before) sfx('check');
    onRender();
  }, e => console.warn('invites', e)));
  N.unsub.push(N.db.collection('games').where('members', 'array-contains', uid).onSnapshot(s => {
    N.games = s.docs.map(d => ({ id: d.id, ...d.data() })).filter(g => g.status !== 'cancelled').sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    onRender();
  }, e => console.warn('games', e)));
  renderAccountChip(); onRender();
}
function signedOut() {
  N.unsub.forEach(f => f()); N.unsub = []; Object.values(N.fUnsubs).forEach(f => f()); N.fUnsubs = {};
  if (N.gUnsub) N.gUnsub(); N.gUnsub = null;
  clearInterval(N.beat); N.user = null; N.me = null; N.friends = []; N.invites = []; N.games = []; N.gid = null; N.game = null;
  renderAccountChip(); onRender();
  if (!N.skipped && !store.get('onlineSkip', false)) showLogin(true);
}
function beat() { if (N.me && N.db) N.db.collection('users').doc(N.me.uid).update({ lastSeen: Date.now() }).catch(() => {}); }
function watchFriends() {
  for (const f of N.friends) if (!N.fUnsubs[f.uid]) N.fUnsubs[f.uid] = N.db.collection('users').doc(f.uid).onSnapshot(d => { N.fdocs[f.uid] = d.data(); onRender(); });
}

// ---------- friends ----------
async function addFriend() {
  const name = $('onFriendName').value.trim();
  if (!name) return;
  if (name.toLowerCase() === N.me.name.toLowerCase()) return setMsg("That's you!");
  const q = await N.db.collection('users').where('nameLower', '==', name.toLowerCase()).limit(1).get();
  if (q.empty) return setMsg(`No player called “${esc(name)}”.`);
  const d = q.docs[0], them = { uid: d.id, name: d.data().name };
  if (N.friends.some(f => f.uid === them.uid)) return setMsg(`${esc(them.name)} is already your friend.`);
  const b = N.db.batch(), now = Date.now();
  b.set(N.db.collection('users').doc(N.me.uid).collection('friends').doc(them.uid), { name: them.name, since: now });
  b.set(N.db.collection('users').doc(them.uid).collection('friends').doc(N.me.uid), { name: N.me.name, since: now });
  await b.commit();
  $('onFriendName').value = ''; setMsg(`✓ ${esc(them.name)} added — you're now in each other's friend lists.`);
}
async function removeFriend(uid) {
  const f = N.friends.find(x => x.uid === uid); if (!f || !confirm(`Remove ${f.name} from your friends?`)) return;
  const b = N.db.batch();
  b.delete(N.db.collection('users').doc(N.me.uid).collection('friends').doc(uid));
  b.delete(N.db.collection('users').doc(uid).collection('friends').doc(N.me.uid));
  await b.commit();
}
function setMsg(t) { N.msg = t; onRender(); }

// ---------- challenges / lobby ----------
async function createGame(friendUid, size, side) {
  const f = N.friends.find(x => x.uid === friendUid);
  const g = { size, createdBy: N.me.uid, names: { [N.me.uid]: N.me.name }, w: side === 'w' ? [N.me.uid] : [], b: side === 'b' ? [N.me.uid] : [],
              members: [N.me.uid], invited: f ? [f.uid] : [], status: 'waiting', moves: [], result: null, reason: '', createdAt: Date.now(), updatedAt: Date.now() };
  if (f) g.names[f.uid] = f.name;
  const ref = await N.db.collection('games').add(g);
  N.dlg = null; openGame(ref.id);
}
async function invite(gid, uid) {
  const f = N.friends.find(x => x.uid === uid); if (!f) return;
  await N.db.collection('games').doc(gid).update({ invited: FV().arrayUnion(uid), [`names.${uid}`]: f.name, updatedAt: Date.now() });
}
async function joinGame(gid, side) {
  const ref = N.db.collection('games').doc(gid);
  try {
    await N.db.runTransaction(async tx => {
      const s = await tx.get(ref), g = s.data();
      if (!g || g.status !== 'waiting') throw new Error('This game has already started or was cancelled.');
      if (!openSides(g).includes(side)) throw new Error(`No free seat on ${sideName(side)} any more.`);
      const w = side === 'w' ? [...g.w, N.me.uid] : g.w, b = side === 'b' ? [...g.b, N.me.uid] : g.b;
      const full = w.length + b.length === g.size && w.length && b.length;
      tx.update(ref, { w, b, members: [...g.members, N.me.uid], invited: g.invited.filter(x => x !== N.me.uid),
                       [`names.${N.me.uid}`]: N.me.name, status: full ? 'playing' : 'waiting', updatedAt: Date.now() });
    });
    openGame(gid);
  } catch (e) { setMsg(esc(e.message)); }
}
async function declineGame(gid) { await N.db.collection('games').doc(gid).update({ invited: FV().arrayRemove(N.me.uid), updatedAt: Date.now() }); }
async function cancelGame(gid) {
  if (!confirm('Cancel this game?')) return;
  await N.db.collection('games').doc(gid).update({ status: 'cancelled', updatedAt: Date.now() });
  closeGame();
}

// ---------- the game itself ----------
function openGame(gid) {
  if (N.gUnsub) N.gUnsub();
  N.gid = gid; N.game = null; N.prevPly = -1; selected = null;
  N.gUnsub = N.db.collection('games').doc(gid).onSnapshot(d => {
    if (!d.exists) return closeGame();
    const g = { id: d.id, ...d.data() };
    const c = new Chess(); for (const san of g.moves) c.move(san);
    const newPly = g.moves.length, isNew = N.prevPly >= 0 && newPly > N.prevPly;
    N.game = g; N.chess = c;
    if (N.prevPly < 0) flip.online = myColor(g) === 'b';
    if (isNew) { const h = c.history({ verbose: true }), m = h[h.length - 1]; if (m && g.moves.length - 1 !== N.myLastPly) { moveSound(m); onDraw(moveAnim(m)); } }
    if (isNew && g.status === 'playing' && seatAt(g, newPly) === N.me.uid) sfx('check');
    if (g.status === 'over' && N.prevStatus === 'playing') sfx('end');
    N.prevPly = newPly; N.prevStatus = g.status;
    onRender();
  }, e => { setMsg('Could not open the game: ' + esc(e.message)); closeGame(); });
  if (mode !== 'online') setMode('online');
  onRender();
}
function closeGame() { if (N.gUnsub) N.gUnsub(); N.gUnsub = null; N.gid = null; N.game = null; onRender(); }
const myTurn = () => N.game && N.game.status === 'playing' && seatAt(N.game, N.game.moves.length) === N.me.uid;
async function onMove(from, to, promo) {
  selected = null;
  const g = N.game; if (!myTurn()) return false;
  const legal = N.chess.moves({ square: from, verbose: true }).filter(m => m.to === to);
  if (!legal.length) return false;
  if (legal.some(m => m.promotion) && !promo) { askPromotion(N.chess.turn(), q => onMove(from, to, q)); return true; }
  const c = new Chess(); for (const s of g.moves) c.move(s);
  const m = c.move({ from, to, promotion: promo || undefined }); if (!m) return false;
  // show it straight away; the database confirms it a moment later
  N.chess = c; N.myLastPly = g.moves.length; moveSound(m); onDraw();
  const upd = { moves: [...g.moves, m.san], updatedAt: Date.now() };
  if (c.game_over()) {
    upd.status = 'over';
    if (c.in_checkmate()) { upd.result = m.color === 'w' ? '1-0' : '0-1'; upd.reason = 'checkmate'; }
    else { upd.result = '1/2-1/2'; upd.reason = c.in_stalemate() ? 'stalemate' : c.insufficient_material() ? 'insufficient material' : c.in_threefold_repetition() ? 'repetition' : '50-move rule'; }
  }
  const ref = N.db.collection('games').doc(g.id), ply = g.moves.length;
  try {
    await N.db.runTransaction(async tx => {
      const s = await tx.get(ref), cur = s.data();
      if (cur.status !== 'playing' || cur.moves.length !== ply) throw new Error('The game changed — try again.');
      tx.update(ref, upd);
    });
  } catch (e) { setMsg(esc(e.message)); }
  return true;
}
async function resign() {
  const g = N.game; if (!g || g.status !== 'playing' || !confirm('Resign for your whole team?')) return;
  const c = myColor(g);
  await N.db.collection('games').doc(g.id).update({ status: 'over', result: c === 'w' ? '0-1' : '1-0', reason: `${N.me.name} resigned`, updatedAt: Date.now() });
}

// ---------- rendering ----------
function onDraw(anim) {
  if (mode !== 'online') return;
  const g = N.game;
  if (!g || !N.chess) { drawBoard({ pos: new Chess() }); renderCards(new Chess(), { w: { name: 'White', av: 'W' }, b: { name: 'Black', av: 'B' } }); showEval(null); return; }
  const h = N.chess.history({ verbose: true }), lm = h[h.length - 1];
  drawBoard({ pos: N.chess, last: lm ? { from: lm.from, to: lm.to } : null, sel: selected, targets: selected ? N.chess.moves({ square: selected, verbose: true }) : [], anim });
  const ply = g.moves.length, now = g.status === 'playing' ? seatAt(g, ply) : null;
  const team = c => ({ name: g[c].map(u => nm(g, u)).join(' + ') || '(empty)', av: c === 'w' ? '♔' : '♚', elo: g[c].length > 1 ? `team of ${g[c].length}` : null,
                       toMove: now && g[c].includes(now) });
  renderCards(N.chess, { w: team('w'), b: team('b') });
  showEval(null);
}
function renderAccountChip() {
  const b = $('acctBtn'); if (!b) return;
  b.hidden = N.cfgMissing && !EMU;
  b.textContent = N.me ? '👤 ' + N.me.name : '👤 Log in';
}
function gameCard(g) {
  const ply = g.moves.length, turn = g.status === 'playing' ? seatAt(g, ply) : null;
  const vs = `${g.w.map(u => nm(g, u)).join(' + ') || '…'} <span class="pz-s">vs</span> ${g.b.map(u => nm(g, u)).join(' + ') || '…'}`;
  const tag = g.status === 'waiting' ? '<span class="tag">waiting for players</span>' : g.status === 'over' ? `<span class="tag">${esc(g.result)}</span>`
    : turn === N.me.uid ? '<span class="tag lvl">your turn!</span>' : `<span class="tag">${esc(nm(g, turn))} to move</span>`;
  return `<button class="op-line${g.id === N.gid ? ' on' : ''}" data-game="${g.id}"><span class="st on-size" title="${g.size} players">👥${g.size}</span><span class="nm">${vs}</span>${tag}</button>`;
}
function onRender() {
  renderAccountChip();
  if (!$('onAccount')) return;
  // account card
  let acc;
  if (N.cfgMissing && !EMU) acc = `<div class="card-h">Online play — setup needed</div><div class="pz-s">Online play needs a free Firebase project. Follow the steps in <b>ONLINE-SETUP.txt</b> (in the chessstockfish folder), then paste the config into <b>app/firebase-config.js</b>.</div>`;
  else if (N.offline) acc = `<div class="card-h">Online play</div><div class="pz-s">⚠ No internet — online play is unavailable right now. Everything else works offline.</div>`;
  else if (!N.ready) acc = `<div class="pz-s"><span class="spin"></span> Connecting…</div>`;
  else if (!N.me) acc = `<div class="card-h">Online play</div><div class="pz-s">Log in to add friends and play 2, 3 or 4-player games.</div><button class="btn primary wide" data-on="login">👤 Log in / create account</button>`;
  else acc = `<div class="ana-top"><span class="card-h">Signed in</span><button class="linkbtn" data-on="logout">Log out</button></div><div class="pz-t">👤 ${esc(N.me.name)}</div>`;
  $('onAccount').innerHTML = acc + (N.msg ? `<div class="pz-s on-msg">${N.msg}</div>` : '');
  const signed = !!N.me;
  $('onFriendsCard').hidden = !signed; $('onGamesCard').hidden = !signed;
  // incoming challenges
  const inv = signed ? N.invites.filter(g => !g.members.includes(N.me.uid)) : [];
  $('onInvites').hidden = !inv.length;
  $('onInvites').innerHTML = `<div class="card-h">⚔ Challenges for you</div>` + inv.map(g => {
    const sides = openSides(g), by = nm(g, g.createdBy);
    const seats = c => g[c].map(u => esc(nm(g, u))).join(' + ');
    const btn = c => `<button class="btn${c === 'w' ? '' : ''}" data-join="${g.id}" data-side="${c}">Join ${sideName(c)}${g[c].length ? ` (with ${seats(c)})` : ''}</button>`;
    return `<div class="on-inv"><div><b>${esc(by)}</b> invites you to a <b>${g.size}-player</b> game</div>
      <div class="pz-s">White: ${seats('w') || '—'} · Black: ${seats('b') || '—'}</div>
      <div class="row">${sides.map(btn).join('')}<button class="btn" data-decline="${g.id}">✕</button></div></div>`;
  }).join('');
  // challenge dialog
  if (N.dlg) {
    const d = N.dlg, f = N.friends.find(x => x.uid === d.uid);
    $('onDlg').hidden = false;
    $('onDlg').innerHTML = `<div class="card-h">Challenge ${esc(f ? f.name : '')}</div>
      <div class="field"><label>PLAYERS</label><div class="seg" id="dlgSize">${[2, 3, 4].map(n => `<button data-size="${n}" class="${d.size === n ? 'on' : ''}">${n === 2 ? '1 vs 1' : n === 3 ? '3 players' : '4 players (2v2)'}</button>`).join('')}</div>
      <div class="pz-s" style="margin-top:6px">${d.size === 2 ? 'Normal game.' : d.size === 3 ? 'Two players share one side and take turns: e.g. you → Black → your teammate → Black → you…' : 'Two teams of two. Order: White 1 → Black 1 → White 2 → Black 2 → …'}${d.size > 2 ? ' Invite the other player(s) from the lobby.' : ''}</div></div>
      <div class="field"><label>YOU PLAY</label><div class="seg" id="dlgSide"><button data-side="w" class="${d.side === 'w' ? 'on' : ''}">♔ White</button><button data-side="b" class="${d.side === 'b' ? 'on' : ''}">♚ Black</button></div></div>
      <div class="row"><button class="btn" data-on="dlgcancel">Cancel</button><button class="btn primary" data-on="dlgsend">⚔ Send challenge</button></div>`;
  } else $('onDlg').hidden = true;
  // current game / lobby
  const g = N.game;
  $('onGame').hidden = !g; $('onGameBtns').hidden = !g;
  if (g) {
    const order = turnOrder(g), ply = g.moves.length, nowUid = g.status === 'playing' ? seatAt(g, ply) : null;
    const strip = g.status === 'waiting' ? '' : `<div class="on-order">${order.map((o, i) => `<span class="${o.uid === nowUid && i === ply % order.length ? 'now' : ''} ${o.color}">${o.color === 'w' ? '♔' : '♚'} ${esc(nm(g, o.uid))}</span>`).join('<i>→</i>')}</div>`;
    let head;
    if (g.status === 'waiting') {
      const need = g.size - g.w.length - g.b.length;
      const seats = c => { const cap = g.size === 2 ? 1 : 2; let s = g[c].map(u => `<span class="tag">${esc(nm(g, u))}</span>`).join(''); for (let i = g[c].length; i < cap; i++) s += '<span class="tag on-empty">empty</span>'; return s; };
      const canInvite = N.friends.filter(f => !g.members.includes(f.uid) && !g.invited.includes(f.uid));
      head = `<div class="pz-h"><span class="pz-ic">⏳</span><div><div class="pz-t">Waiting for ${need} more player${need === 1 ? '' : 's'}</div><div class="pz-s">${g.size}-player game · starts automatically when full</div></div></div>
        <div class="on-seats"><div><b>♔ White</b> ${seats('w')}</div><div><b>♚ Black</b> ${seats('b')}</div></div>
        ${g.invited.length ? `<div class="pz-s">Invited: ${g.invited.map(u => esc(nm(g, u))).join(', ')}</div>` : ''}
        ${canInvite.length ? `<div class="pz-s">Invite more:</div><div class="tags">${canInvite.map(f => `<button class="tag on-invbtn" data-invite="${f.uid}">+ ${esc(f.name)}</button>`).join('')}</div>` : ''}`;
    } else if (g.status === 'playing') {
      const mine = nowUid === N.me.uid, check = N.chess.in_check() ? ' — check!' : '';
      head = `<div class="pz-h"><span class="pz-ic">${mine ? '👉' : '⏳'}</span><div><div class="pz-t">${mine ? 'Your move' + check : `${esc(nm(g, nowUid))} to move${check}`}</div>
        <div class="pz-s">You play ${sideName(myColor(g))}${g[myColor(g)].length > 1 ? ' with ' + g[myColor(g)].filter(u => u !== N.me.uid).map(u => esc(nm(g, u))).join(', ') : ''} · move ${Math.floor(ply / 2) + 1}</div></div></div>${strip}`;
    } else {
      const win = g.result === '1-0' ? 'w' : g.result === '0-1' ? 'b' : null, me = myColor(g);
      head = `<div class="pz-h"><span class="pz-ic">${!win ? '½' : win === me ? '🏆' : '♚'}</span><div><div class="pz-t">${!win ? 'Draw' : win === me ? 'Your team won!' : 'Your team lost'}</div><div class="pz-s">${esc(g.result)} · ${esc(g.reason)}</div></div></div>${strip}`;
    }
    $('onGame').className = 'card pz-status ' + (g.status === 'playing' && nowUid === N.me.uid ? 'play' : g.status === 'over' ? 'good' : '');
    $('onGame').innerHTML = head;
    $('onResign').hidden = g.status !== 'playing'; $('onCancel').hidden = !(g.status === 'waiting' && g.createdBy === N.me.uid);
    $('onReview').hidden = g.moves.length < 2;
  }
  // friends
  if (signed) {
    $('onFriends').innerHTML = N.friends.length ? N.friends.map(f => {
      const on = isOnline(N.fdocs[f.uid]);
      return `<div class="on-friend"><span class="on-dot ${on ? 'on' : ''}" title="${on ? 'online' : 'offline'}"></span><span class="nm">${esc(f.name)}</span>
        <button class="btn" data-chal="${f.uid}">⚔ Challenge</button><button class="linkbtn" data-unfriend="${f.uid}" title="Remove friend">✕</button></div>`;
    }).join('') : '<div class="pz-s">No friends yet — type a friend\'s username above. They need an account first.</div>';
    const act = N.games.filter(x => x.status !== 'over'), done = N.games.filter(x => x.status === 'over').slice(0, 5);
    $('onGames').innerHTML = (act.length ? act.map(gameCard).join('') : '<div class="pz-s">No active games. Challenge a friend!</div>') +
      (done.length ? `<div class="op-group">Finished</div>${done.map(gameCard).join('')}` : '');
  }
  onDraw();
}

// ---------- controls ----------
$('acctBtn').onclick = () => { if (N.me) setMode('online'); else if (N.ready) showLogin(true); else setMode('online'); };
document.querySelectorAll('#lgTabs button').forEach(b => (b.onclick = () => {
  document.querySelectorAll('#lgTabs button').forEach(x => x.classList.toggle('on', x === b));
  const create = b.dataset.t === 'new';
  $('lgPass2Row').hidden = !create; $('lgGo').textContent = create ? 'Create account' : 'Log in'; $('lgErr').textContent = '';
  $('lgPass').autocomplete = create ? 'new-password' : 'current-password';
}));
$('lgGo').onclick = () => doLogin(!$('lgPass2Row').hidden);
$('login').onkeydown = e => { if (e.key === 'Enter') $('lgGo').click(); };
$('lgSkip').onclick = () => { N.skipped = true; store.set('onlineSkip', true); showLogin(false); };
$('onlineView').onclick = async e => {
  const t = e.target.closest('button'); if (!t) return;
  const d = t.dataset;
  try {
    if (d.on === 'login') showLogin(true);
    else if (d.on === 'logout') { N.skipped = false; await N.auth.signOut(); }
    else if (d.on === 'dlgcancel') { N.dlg = null; onRender(); }
    else if (d.on === 'dlgsend') await createGame(N.dlg.uid, N.dlg.size, N.dlg.side);
    else if (d.on === 'addfriend') await addFriend();
    else if (d.size) { N.dlg.size = +d.size; onRender(); }
    else if (d.side && t.closest('#dlgSide')) { N.dlg.side = d.side; onRender(); }
    else if (d.chal) { N.dlg = { uid: d.chal, size: 2, side: 'w' }; N.msg = ''; onRender(); }
    else if (d.unfriend) await removeFriend(d.unfriend);
    else if (d.join) await joinGame(d.join, d.side);
    else if (d.decline) await declineGame(d.decline);
    else if (d.invite) await invite(N.gid, d.invite);
    else if (d.game) openGame(d.game);
  } catch (err) { setMsg('Something went wrong: ' + esc(err.message || err)); }
};
$('onFriendName').onkeydown = e => { if (e.key === 'Enter') addFriend().catch(err => setMsg(esc(err.message))); };
$('onResign').onclick = () => resign().catch(e => setMsg(esc(e.message)));
$('onCancel').onclick = () => cancelGame(N.gid).catch(e => setMsg(esc(e.message)));
$('onClose').onclick = closeGame;
$('onReview').onclick = () => {
  const g = N.game; if (!g) return;
  const c = new Chess(); g.moves.forEach(s => c.move(s));
  c.header('White', g.w.map(u => nm(g, u)).join(' + '), 'Black', g.b.map(u => nm(g, u)).join(' + '), 'Result', g.result || '*');
  setMode('review');
  loadReview(c.pgn(), { white: g.w.map(u => nm(g, u)).join(' + '), black: g.b.map(u => nm(g, u)).join(' + '), userColor: myColor(g) || 'w' });
};
EXTRA_MODES.online = {
  view: 'onlineView',
  ctl: { pos: () => N.chess || new Chess(), draw: () => onDraw(), move: (f, t) => { if (!myTurn() || !N.chess.moves({ square: f, verbose: true }).some(m => m.to === t)) return false; onMove(f, t).catch(e => setMsg(esc(e.message))); return true; },
         canPick: p => myTurn() && p.color === N.chess.turn() },
  draw: () => onDraw(),
  init: () => { onInit(); onRender(); },
  enter: () => { N.msg = ''; onRender(); },
};
