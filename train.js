'use strict';
// ======================================================================
// TRAIN — a step-by-step course: learn an idea on the board, then practise it on real
// Lichess puzzles of that theme. Every wrong move gets a Stockfish explanation.
// ======================================================================
// Slides: { fen | moves (SAN from the start), text, arrows: [[from,to,colour]], marks: [sq], try: 'uci' }
// Practice: { themes, max (rating cap), n, need }  — puzzles from the pool / Lichess
//        or { good: [{ fen|moves, prompt, need: 'center'|'develop'|'castle' }] } — any move Stockfish rates good
const TR_UNITS = [
  { name: 'Unit 1 · Stop losing pieces', lessons: [
    { id: 'hang', icon: '🎈', title: 'Free pieces', goal: 'Spot pieces nobody defends — and take them.',
      slides: [
        { fen: '6k1/5ppp/8/8/4n3/8/5PPP/4R1K1 w - - 0 1', arrows: [['e1', 'e4', 'r']], marks: ['e4'], try: 'e1e4',
          text: 'A piece is <b>hanging</b> when it is attacked and <b>nobody defends it</b>. Black\'s knight on e4 is attacked by your rook — and no black piece protects it. <b>Take it!</b>' },
        { moves: ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3'], arrows: [['c3', 'd5', 'r']],
          text: 'A piece attacked by a <b>cheaper</b> piece is in trouble even when it is defended. Here a knight (3) attacks Black\'s queen (9). Black must move the queen right away — trading it for a knight would be a disaster.' },
        { moves: ['e4', 'e5', 'Nf3'], arrows: [['f3', 'e5', 'r']],
          text: 'The habit that stops most blunders: after <b>every</b> move your opponent makes, ask <b>"What does that move attack?"</b> Here 2.Nf3 attacks the e5 pawn, so Black defends it with 2…Nc6. Then before <b>your</b> move, check that the piece you move doesn\'t leave something undefended.' },
      ],
      practice: { themes: ['hangingPiece'], max: 1500, n: 5, need: 4 } },
    { id: 'mate1', icon: '♚', title: 'Checkmate in one', goal: 'Find the move that ends the game.',
      slides: [
        { fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1', arrows: [['a1', 'a8', 'g']], try: 'a1a8',
          text: 'Checkmate = the king is in check and has <b>no way out</b>: it can\'t move, nothing can block, and the checking piece can\'t be taken. Black\'s king is boxed in by its own pawns. Find the mate!' },
        { moves: ['e4', 'e5', 'Qh5', 'Nc6', 'Bc4', 'Nf6'], arrows: [['h5', 'f7', 'g'], ['c4', 'f7', 'y']], try: 'h5f7',
          text: 'A queen right next to the king is checkmate when something <b>protects</b> her — here the bishop on c4 guards f7, so the king can\'t take. Black forgot about f7. Play the mate.' },
        { fen: '6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1',
          text: 'How to find mates: look at <b>every check</b> you have — every single one, even "silly" ones like queen sacrifices. For each check ask: can the king <b>run</b>, can something <b>block</b>, can the checker be <b>captured</b>? If all three answers are no, it\'s mate.' },
      ],
      practice: { themes: ['mateIn1'], max: 1200, n: 6, need: 5 } },
    { id: 'cct', icon: '🔎', title: 'Checks, captures, threats', goal: 'The 10-second routine strong players use every move.',
      slides: [
        { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5'], arrows: [['g5', 'f7', 'r'], ['c4', 'f7', 'r']], marks: ['f7'],
          text: 'White just played Ng5. What does it threaten? <b>Nxf7</b>, attacking Black\'s queen and rook at once. If Black doesn\'t ask "what does that move attack?", they lose material. (Best here is 4…d5!, blocking the bishop.)' },
        { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'],
          text: 'Before <b>your</b> move, scan in this order:<br>1. <b>Checks</b> — every check I can give.<br>2. <b>Captures</b> — every piece I can take. Is it free?<br>3. <b>Threats</b> — what can I attack? And what is my opponent threatening?<br>Only then pick a "normal" move. It takes 10 seconds and wins games.' },
      ],
      practice: { themes: ['hangingPiece', 'mateIn1', 'fork'], max: 1050, n: 6, need: 5 } },
  ] },
  { name: 'Unit 2 · Tactics that win material', lessons: [
    { id: 'fork', icon: '🍴', title: 'The fork', goal: 'Attack two things at once — they can only save one.',
      slides: [
        { fen: 'r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1', arrows: [['b5', 'c7', 'g']], try: 'b5c7',
          text: 'A <b>fork</b> is one piece attacking two at once. Knights are the best forkers because their jump is hard to see. Find the knight move that checks the king <b>and</b> attacks the rook.' },
        { fen: '4k3/8/2n1r3/8/3P4/8/8/6K1 w - - 0 1', arrows: [['d4', 'd5', 'g']], try: 'd4d5',
          text: 'Even a little pawn can fork. Push the pawn so it attacks the knight <b>and</b> the rook — Black can only save one, and you win the other for a pawn.' },
        { fen: '4k3/8/2n1r3/3P4/8/8/8/6K1 b - - 0 1', arrows: [['d5', 'c6', 'r'], ['d5', 'e6', 'r']],
          text: 'To find forks, look for <b>two enemy pieces</b> that are undefended or worth more than your attacker — and the king! Then ask: which of my pieces can reach a square that hits both?' },
      ],
      practice: { themes: ['fork'], max: 1300, n: 6, need: 4 } },
    { id: 'pin', icon: '📌', title: 'The pin', goal: 'Freeze a piece in front of something bigger.',
      slides: [
        { moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'], arrows: [['b4', 'e1', 'r']], marks: ['c3'],
          text: 'A <b>pin</b>: the bishop on b4 attacks the knight on c3, and behind the knight is the white king. The knight is <b>not allowed</b> to move — that would expose the king. A frozen piece can\'t defend or attack anything.' },
        { moves: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4'], arrows: [['g4', 'd1', 'r']], marks: ['f3'],
          text: 'Here the knight on f3 <b>may</b> move — but then Black takes the queen on d1. Pins against the queen or a rook are just as strong. Pile up on a pinned piece: attack it again and it often falls.' },
      ],
      practice: { themes: ['pin'], max: 1500, n: 5, need: 4 } },
    { id: 'skewer', icon: '🍢', title: 'The skewer', goal: 'Attack the big piece so the one behind it falls.',
      slides: [
        { fen: '8/8/8/8/q3k3/8/8/6KR w - - 0 1', arrows: [['h1', 'h4', 'g'], ['h4', 'a4', 'y']], try: 'h1h4',
          text: 'A <b>skewer</b> is a pin turned around: you attack the <b>more valuable</b> piece first, it has to move, and you take the piece behind it. Check the king along the 4th rank — after it steps away, the queen on a4 is yours.' },
        { fen: '8/8/8/8/q3k3/8/8/6K1 w - - 0 1',
          text: 'Skewers work along lines — ranks, files and diagonals — so they come from queens, rooks and bishops. Look for two enemy pieces <b>lined up</b>, especially a king or queen in front of something else.' },
      ],
      practice: { themes: ['skewer'], max: 1700, n: 5, need: 3 } },
    { id: 'disc', icon: '💥', title: 'Discovered attacks', goal: 'Move one piece to unleash another.',
      slides: [
        { fen: 'q3k3/8/8/8/4B3/8/8/4R1K1 w - - 0 1', arrows: [['e4', 'a8', 'g'], ['e1', 'e8', 'r']], try: 'e4a8',
          text: 'Your bishop blocks your own rook. When the bishop moves, the rook suddenly gives <b>check</b> — a "discovered check". Black has to answer the check, so the bishop can grab anything it wants. Take the queen!' },
        { fen: 'q3k3/8/8/8/4B3/8/8/4R1K1 w - - 0 1',
          text: 'Look for your pieces standing <b>in front of</b> your own queen, rook or bishop, aimed at something. Moving the front piece makes <b>two</b> attacks in one move — and the front piece can attack too.' },
      ],
      practice: { themes: ['discoveredAttack', 'discoveredCheck'], max: 1500, n: 5, need: 3 } },
  ] },
  { name: 'Unit 3 · Checkmate patterns', lessons: [
    { id: 'backrank', icon: '🧱', title: 'Back-rank mate', goal: 'The most common checkmate in real games.',
      slides: [
        { fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', arrows: [['d1', 'd8', 'g']], try: 'd1d8',
          text: 'Black castled and left the three pawns in front of the king. Now the king has no air: a rook or queen on the back rank is <b>mate</b>. Do it.' },
        { fen: '6k1/5pp1/7p/8/8/8/5PPP/3R2K1 w - - 0 1', arrows: [['d1', 'd8', 'r']], marks: ['h7'],
          text: 'The cure is "<b>luft</b>" (air): one pawn move like …h6 gives the king an escape square. Rd8+ is now just a check — the king goes to h7. Before your opponent can play a back-rank trick, give your own king some air.' },
      ],
      practice: { themes: ['backRankMate'], max: 1700, n: 5, need: 3 } },
    { id: 'mate2', icon: '♛', title: 'Mate in two', goal: 'Plan two moves ahead with forcing moves.',
      slides: [
        { fen: '6k1/8/8/8/8/8/R7/1R4K1 w - - 0 1', arrows: [['a2', 'a7', 'g'], ['b1', 'b8', 'y']], try: 'a2a7',
          text: 'Two rooks "ladder": one rook cuts off the 7th rank, the other mates on the 8th. Play the first move — the rook to the 7th rank. Whatever Black does, Rb8 is mate next.' },
        { fen: '6k1/R7/8/8/8/8/8/1R4K1 b - - 0 1',
          text: 'To find a mate in two, try the <b>most forcing</b> moves first: checks, then captures, then big threats. A quiet first move (like Ra7 here) works when the opponent has no useful reply.' },
      ],
      practice: { themes: ['mateIn2'], max: 1300, n: 5, need: 3 } },
  ] },
  { name: 'Unit 4 · Play like a real player', lessons: [
    { id: 'open', icon: '🚀', title: 'Opening principles', goal: 'Center, develop, castle — the first 10 moves.',
      slides: [
        { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'O-O', 'Nf6'],
          text: 'You don\'t need to memorise openings. Follow 3 rules:<br>1. <b>Center</b> — put a pawn on e4 or d4.<br>2. <b>Develop</b> — knights and bishops off the back rank, toward the center.<br>3. <b>Castle</b> — get your king safe, usually by move 6–8.<br>Both sides here did all three. ✔' },
        { moves: ['e4', 'e5', 'Qh5', 'Nc6', 'Qf3', 'Nf6', 'Qb3'],
          text: 'What <b>not</b> to do: White moved the queen three times. Each queen move develops nothing, and the queen gets chased around by Black\'s pieces. Rule of thumb: don\'t bring the queen out early, and don\'t move the same piece twice in the opening without a reason.' },
      ],
      practice: { good: [
        { moves: [], prompt: 'Make a strong first move that takes the <b>center</b>.', need: 'center' },
        { moves: ['e4'], prompt: 'You are Black. White took the center — fight for it too.', need: 'center' },
        { moves: ['e4', 'e5'], prompt: '<b>Develop</b> a knight or bishop toward the center.', need: 'develop' },
        { moves: ['d4', 'd5', 'c4', 'e6', 'Nc3'], prompt: 'You are Black. <b>Develop</b> a piece.', need: 'develop' },
        { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'], prompt: 'Your king is still in the middle. Get it <b>safe</b>.', need: 'castle', maxLoss: 14 },
        { moves: ['e4', 'e5', 'Nf3', 'Nc6'], prompt: 'Black attacked nothing and developed. Your move: <b>develop</b> — and keep the queen at home.', need: 'develop' },
      ], need: 5 } },
    { id: 'defend', icon: '🛡', title: 'Defending', goal: 'When something is attacked: move it, guard it, or block.',
      slides: [
        { fen: '4r1k1/5ppp/8/8/4N3/8/5PPP/6K1 w - - 0 1', arrows: [['e8', 'e4', 'r']], marks: ['e4'],
          text: 'Black\'s rook attacks your knight on e4 and nothing defends it. Your options when a piece is attacked:<br>1. <b>Move</b> it to a safe square.<br>2. <b>Defend</b> it with another piece.<br>3. <b>Block</b> the attack.<br>4. <b>Counter-attack</b> something bigger (or give check).' },
        { fen: '4r1k1/5ppp/8/8/4N3/8/5PPP/6K1 w - - 0 1',
          text: 'Most games between beginners are lost by <b>ignoring threats</b>, not by missing brilliant moves. After every enemy move, find what it attacks before you do anything else.' },
      ],
      practice: { themes: ['defensiveMove'], max: 1700, n: 5, need: 3 } },
    { id: 'promo', icon: '👑', title: 'Pawns become queens', goal: 'Push passed pawns — and win endgames.',
      slides: [
        { fen: '8/5k2/8/1P6/8/8/5K2/8 w - - 0 1', arrows: [['b5', 'b8', 'g']], try: 'b5b6',
          text: 'A <b>passed pawn</b> has no enemy pawns in front of it or beside it. Black\'s king is too far away to catch this one. Push it!' },
        { fen: '8/5k2/1P6/8/8/8/5K2/8 b - - 0 1',
          text: '"Rule of the square": draw a square from the pawn to its promotion rank. If the enemy king can\'t step into that square, the pawn queens by itself. In the endgame, kings become fighters — bring yours into the game. (The <b>Endgames</b> tab has full drills, like king + queen checkmate.)' },
      ],
      practice: { themes: ['promotion', 'advancedPawn'], max: 1500, n: 5, need: 3 } },
    { id: 'mates', icon: '🏁', title: 'Must-know checkmates', goal: 'Two rooks, king + queen, king + rook — finish won games.',
      slides: [
        { fen: '8/8/8/4k3/8/8/8/3QK3 w - - 0 1',
          text: 'Being a queen or a rook up is only a win if you know how to <b>checkmate</b> with it. Many beginner games end in a draw (or stalemate!) because the winning side just gives random checks. These three techniques take a few minutes each and win you games for life.' },
        { fen: '8/8/8/4k3/8/8/8/R3K2R w - - 0 1', arrows: [['a1', 'a4', 'g'], ['h1', 'h5', 'y']],
          text: '<b>The ladder</b> (two rooks): one rook cuts the king off along a rank, the other checks on the next rank — they take turns, pushing the king back step by step to the edge. Then the practice uses the <b>Endgames</b> trainer, where the defence is perfect.' },
      ],
      practice: { endgames: ['eg-rr', 'eg-kq', 'eg-kr'] } },
  ] },
  { name: 'Unit 5 · Don\'t fall for traps', lessons: [
    { id: 'scholar', icon: '🎯', title: 'Scholar\'s Mate', goal: 'Stop the 4-move checkmate — and punish it.',
      slides: [
        { moves: ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5'], arrows: [['h5', 'f7', 'r'], ['c4', 'f7', 'r']], marks: ['f7'], orient: 'b',
          text: 'The most common trap in online games. White\'s queen and bishop both aim at <b>f7</b>, which only your king defends. A careless move like 3…Nf6?? loses at once to 4.Qxf7# — checkmate.' },
        { moves: ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5'], try: 'g7g6', arrows: [['g7', 'g6', 'g']],
          text: 'Block the queen\'s path with <b>3…g6</b> — it also attacks the queen, so White has to waste another move. (3…Qe7 also defends f7.) Play …g6.' },
        { moves: ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'g6', 'Qf3', 'Nf6'], arrows: [['f6', 'f7', 'g']], orient: 'b',
          text: 'After 4.Qf3 (aiming at f7 again) just play <b>4…Nf6</b> — it blocks the attack <b>and</b> develops. White\'s queen has moved twice and you are ahead in development. Rule: always check f7 (or f2) when a queen and bishop line up on it.' },
      ],
      practice: { good: [
        { moves: ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5'], prompt: 'White threatens <b>Qxf7#</b>. Stop it!' },
        { moves: ['e4', 'e5', 'Qh5', 'Nc6', 'Bc4'], prompt: 'Same trap, different move order. Stop the mate.' },
        { moves: ['e4', 'e5', 'Qf3', 'Nc6', 'Bc4'], prompt: 'The queen is on f3 now. What is White threatening? Stop it.' },
        { moves: ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'g6', 'Qf3'], prompt: 'White threatens Qxf7# again. Defend <b>and</b> develop.', need: 'develop' },
        { moves: ['e4', 'e5', 'Qh5'], prompt: 'White\'s queen attacks e5 (and eyes f7). Defend with a developing move.', need: 'develop', maxLoss: 4 },
      ], need: 4 } },
    { id: 'fried', icon: '🍳', title: 'Fried Liver & f7', goal: 'Defend the weak f7 square.',
      slides: [
        { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5'], arrows: [['g5', 'f7', 'r'], ['c4', 'f7', 'r']], marks: ['f7'], orient: 'b',
          text: '4.Ng5 attacks f7 <b>twice</b> (knight + bishop) and only the king defends it. If Black ignores it, Nxf7 forks the queen and the rook.' },
        { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5'], try: 'd7d5', arrows: [['d7', 'd5', 'g']],
          text: 'The best defence is <b>4…d5!</b> — it blocks the bishop\'s line to f7. Play it.' },
        { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Nxd5'], arrows: [['g5', 'f7', 'r']], orient: 'b',
          text: 'Careful: after 5.exd5, taking back with 5…Nxd5?! allows <b>6.Nxf7!</b> — the <b>Fried Liver</b>: 6…Kxf7 7.Qf3+ drags your king into the open. The safe move is <b>5…Na5</b>, attacking the bishop instead.' },
      ],
      practice: { good: [
        { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5'], prompt: 'f7 is attacked twice. Defend!' },
        { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5'], prompt: 'White took on d5. Careful — what is the <b>safe</b> move?', maxLoss: 6 },
        { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Nxd5'], prompt: 'You are White. Black took back with the knight. Punish it!', maxLoss: 6 },
        { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'h6'], prompt: 'You are White. Black played a slow move. Find a good, active move.' },
      ], need: 3 } },
    { id: 'legal', icon: '⚡', title: 'The Légal trap', goal: 'A pin to the queen is not a real pin.',
      slides: [
        { moves: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4', 'Nc3', 'g6'], arrows: [['g4', 'd1', 'r']], marks: ['f3'],
          text: 'Black pins the knight to the queen and relaxes with 4…g6?. But the knight is only pinned to the <b>queen</b>, not the king — so it is allowed to move.' },
        { moves: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4', 'Nc3', 'g6'], try: 'f3e5', arrows: [['f3', 'e5', 'g']],
          text: 'Play <b>5.Nxe5!</b> — it looks like it hangs the queen.' },
        { moves: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4', 'Nc3', 'g6', 'Nxe5', 'Bxd1', 'Bxf7+', 'Ke7', 'Nd5'], marks: ['e7'],
          text: 'If Black grabs the queen: 5…Bxd1 6.Bxf7+ Ke7 7.Nd5# — <b>checkmate</b> with three minor pieces! (Best for Black was 5…dxe5, just losing a pawn.) Lesson: when you pin a piece to the queen, check what happens if it moves anyway.' },
      ],
      practice: { good: [
        { moves: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4', 'Nc3', 'g6'], prompt: 'You are White. Spring the trap!', maxLoss: 5 },
        { moves: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4', 'Nc3', 'g6', 'Nxe5'], prompt: 'You are Black. You can take the queen… should you? Find the best move.' },
        { moves: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4'], prompt: 'You are White and your knight is pinned to the queen. Make a good developing move.' },
      ], need: 2 } },
    { id: 'earlyq', icon: '👑', title: 'Punish the early queen', goal: 'Develop with tempo — make the queen run.',
      slides: [
        { moves: ['e4', 'd5', 'exd5', 'Qxd5'], try: 'b1c3', arrows: [['b1', 'c3', 'g']],
          text: 'An early queen is a target. Bring out a piece <b>and</b> attack her at the same time ("with tempo") — she has to move again, and you get another free developing move. Play Nc3.' },
        { moves: ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qa5', 'd4', 'Nf6', 'Nf3'],
          text: 'White has three pieces/pawns in play, Black\'s queen has moved twice. Don\'t chase the queen with lots of pawn moves, though — chase her with <b>pieces</b> that you wanted to develop anyway.' },
      ],
      practice: { good: [
        { moves: ['e4', 'd5', 'exd5', 'Qxd5'], prompt: 'Black\'s queen came out early. Develop <b>and</b> attack her.', need: 'develop', maxLoss: 6 },
        { moves: ['e4', 'e5', 'Nc3', 'Qh4'], prompt: 'You are White. The queen jumped to h4. Develop a piece with a threat.', need: 'develop' },
        { moves: ['e4', 'e5', 'Nf3', 'Qf6'], prompt: 'You are White. Black\'s queen blocks her own knight. Just develop well.', need: 'develop' },
        { moves: ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qa5'], prompt: 'The queen ran to a5. Keep developing your pieces (not your queen).', need: 'develop' },
      ], need: 3 } },
  ] },
];
const TR_LESSONS = TR_UNITS.flatMap((u, ui) => u.lessons.map(l => ({ ...l, unit: ui, unitName: u.name })));
const TR_HINT = {
  hangingPiece: 'Look for an enemy piece that nobody defends.', mateIn1: 'Check every possible check.', fork: 'Which piece can attack two things at once?',
  pin: 'Something is lined up in front of the king or queen.', skewer: 'Attack the big piece — what is standing behind it?',
  discoveredAttack: 'Move a piece out of the way of your queen, rook or bishop.', discoveredCheck: 'Move the piece that blocks your check.',
  backRankMate: 'The king is stuck on its back rank.', mateIn2: 'Start with the most forcing move — usually a check.',
  defensiveMove: 'What is your opponent threatening? Stop it.', promotion: 'Can a pawn reach the last rank?', advancedPawn: 'Your most advanced pawn is the hero.',
};
const AR = { g: '#79a865', r: '#d9534a', y: '#e3b54a', b: '#5b8db5' };

const T = { view: 'path', L: null, slide: 0, pos: null, last: null, arrows: [], marks: [], badge: null, tried: false,
            exs: [], ex: 0, res: [], step: 0, state: 'idle', miss: false, hint: 0, msg: null, why: null, token: 0, loading: false };
let trEngine = null;
function trSearch(fen, opts) {
  if (!trEngine) trEngine = new Engine();
  const job = trEngine.search(fen, { skill: 20, ...opts });
  return job.promise.then(r => (r && !r.cancelled ? r : null));
}
const trProg = () => (prog.train = prog.train || { done: {}, seen: [], stats: {} });
const posFrom = s => { const c = new Chess(s.fen || undefined); if (!s.fen) for (const m of s.moves || []) c.move(m); return c; };
const lastOf = c => { const h = c.history({ verbose: true }), m = h[h.length - 1]; return m ? { from: m.from, to: m.to } : null; };

// ---------- drawing ----------
function trDraw(anim) {
  if (mode !== 'train') return;
  if (T.tool) return T.tool.draw(anim);
  if (!T.pos) T.pos = new Chess();
  flip.train = T.pos && T.view !== 'path' ? T.orient === 'b' : false;
  const canMove = trCanMove();
  drawBoard({ pos: T.pos, last: T.last, sel: selected, targets: selected && canMove ? T.pos.moves({ square: selected, verbose: true }) : [],
              arrows: T.arrows.map(([f, t, c]) => ({ from: f, to: t, color: AR[c] || c })), marks: T.marks, badge: T.badge, anim });
  const meC = T.orient || 'w';
  const me = { name: 'You', av: '🙂', toMove: canMove };
  const coach = { name: 'Coach', elo: T.L ? T.L.title : 'Training', av: '🎓' };
  renderCards(T.pos, meC === 'w' ? { w: me, b: coach } : { w: coach, b: me }, false);
  showEval(null);
}
function trCanMove() {
  if (T.view === 'learn') { const s = T.L.slides[T.slide]; return !!(s.try && !T.tried); }
  return T.view === 'practice' && T.state === 'play' && T.pos.turn() === T.orient;
}

// ---------- path (home) ----------
function trNext() { const d = trProg().done; return TR_LESSONS.find(l => !d[l.id]) || null; }
function stars(n) { return '<span class="stars">' + '★'.repeat(n) + '<i>' + '★'.repeat(3 - n) + '</i></span>'; }
function trRenderPath() {
  T.view = 'path'; T.L = null; T.arrows = []; T.marks = []; T.badge = null; T.orient = 'w';
  T.pos = new Chess(); T.last = null;
  const P = trProg(), done = Object.keys(P.done).filter(k => TR_LESSONS.some(l => l.id === k)).length, nx = trNext();
  const pct = Math.round(done / TR_LESSONS.length * 100);
  $('trMain').innerHTML = `
    <div class="tr-hero">
      <div class="tr-hero-t">Your chess coach</div>
      <div class="pz-s">Short lessons, then practice on real positions. When you go wrong, Stockfish shows you exactly why.</div>
      <div class="tr-prog"><div style="width:${pct}%"></div></div>
      <div class="pz-s">${done} of ${TR_LESSONS.length} lessons done</div>
    </div>
    ${nx ? `<button class="btn primary wide tr-go" data-tr="open:${nx.id}"><span>${nx.icon}</span> ${done ? 'Continue' : 'Start'}: ${esc(nx.title)}</button>` : '<div class="op-ok">🏆 You finished every lesson! Keep sharp with the review and training games.</div>'}
    <div class="btn-grid">
      <button class="btn" data-tr="game" title="Play Stockfish with blunder guard, threat alerts and the live coach">♟ Training game</button>
      <button class="btn" data-tr="review" ${done ? '' : 'disabled title="Finish a lesson first"'}>🔁 Mixed review</button>
    </div>`;
  // endgame lessons pass automatically once the Endgames tab items are won
  for (const l of TR_LESSONS) if (l.practice.endgames && !P.done[l.id] && l.practice.endgames.every(id => ((prog.endgames || {})[id] || {}).done)) P.done[l.id] = { stars: 3, at: Date.now() };
  $('trList').innerHTML = (window.trHomeTop ? trHomeTop() : '') + TR_UNITS.map((u, ui) => `<div class="card"><div class="card-h">${esc(u.name)}</div><div class="op-lines">
    ${u.lessons.map(l => { const d = P.done[l.id]; return `<button class="op-line${nx && nx.id === l.id ? ' on' : ''}" data-tr="open:${l.id}">
      <span class="st">${l.icon}</span><span class="nm">${esc(l.title)}<small class="tr-goal">${esc(l.goal)}</small></span>${d ? stars(d.stars) : ''}</button>`; }).join('')}
    </div></div>`).join('');
  $('trList').hidden = false;
  trDraw();
}

// ---------- learn (slides) ----------
function trOpen(id) {
  const L = TR_LESSONS.find(l => l.id === id); if (!L) return;
  T.token++; T.L = L; T.view = 'learn'; T.slide = 0; $('trList').hidden = true;
  trShowSlide();
}
function trShowSlide() {
  const s = T.L.slides[T.slide];
  T.pos = posFrom(s); T.last = lastOf(T.pos); T.tried = false; T.badge = null; T.msg = null;
  T.orient = s.orient || (s.try ? T.pos.turn() : 'w');
  T.arrows = s.try ? [] : (s.arrows || []); T.marks = s.try ? [] : (s.marks || []);
  trRenderLearn(); trDraw();
}
function trRenderLearn() {
  const L = T.L, s = L.slides[T.slide], last = T.slide === L.slides.length - 1;
  const task = s.try && !T.tried ? `<div class="op-task">👉 Your turn — play it on the board.${T.msg ? ` <span class="tr-bad">${T.msg}</span>` : ''}</div>` : '';
  const ok = s.try && T.tried ? '<div class="op-ok">✓ Exactly!</div>' : '';
  $('trMain').innerHTML = `
    <div class="tr-top"><button class="icon-btn" data-tr="home" title="All lessons">←</button>
      <div><div class="tr-k">${esc(L.unitName)}</div><div class="tr-t">${L.icon} ${esc(L.title)}</div></div></div>
    <div class="tr-dots">${L.slides.map((_, i) => `<i class="${i === T.slide ? 'on' : i < T.slide ? 'done' : ''}"></i>`).join('')}<i class="pr"></i></div>
    <div class="op-body tr-text">${s.text}</div>${task}${ok}
    <div class="row">
      <button class="btn" data-tr="prev" ${T.slide ? '' : 'disabled'}>◀ Back</button>
      ${s.try && !T.tried ? '<button class="btn" data-tr="show">Show me</button>' : ''}
      <button class="btn primary" data-tr="${last ? 'practice' : 'next'}">${last ? 'Start practice ▶' : 'Next ▶'}</button>
    </div>`;
}
function trSlideMove(from, to) {
  const s = T.L.slides[T.slide];
  const legal = T.pos.moves({ square: from, verbose: true }).filter(m => m.to === to);
  if (!legal.length) return false;
  // the shown move, or any other move that is also checkmate when the lesson move is
  const ok = from + to === s.try.slice(0, 4) || (posMates(T.pos, s.try) && posMates(T.pos, from + to + 'q'));
  if (!ok) {
    const m = T.pos.move({ from, to, promotion: 'q' }); T.pos.undo();
    T.msg = `${m.san} isn't it — try again.`; sfx('wrong'); selected = null; trRenderLearn(); trDraw(); return true;
  }
  trPlaySlideAnswer(from, to);
  return true;
}
const posMates = (pos, uci) => { const c = new Chess(pos.fen()); c.move(uciMove(uci)); return c.in_checkmate(); };
function trPlaySlideAnswer(from, to) {
  const s = T.L.slides[T.slide];
  const m = T.pos.move({ from, to, promotion: 'q' }); if (!m) return;
  T.tried = true; T.last = { from, to }; T.badge = { sq: to, kind: 'best' }; T.arrows = s.arrows || []; T.marks = s.marks || [];
  selected = null; T.msg = null;
  T.pos.in_checkmate() ? sfx('end') : moveSound(m);
  trRenderLearn(); trDraw(moveAnim(m));
}

// ---------- practice ----------
async function trStartPractice(L, review = false) {
  const tok = ++T.token;
  T.L = L; T.view = 'practice'; T.exs = []; T.ex = 0; T.res = []; T.review = review; $('trList').hidden = true;
  const pr = L.practice;
  if (pr.endgames) return trRenderEndgamePractice(L);
  if (pr.good) T.exs = pr.good.map(g => ({ kind: 'good', ...g }));
  else {
    T.loading = true; trRenderPractice();
    const list = await trPickPuzzles(pr.themes, pr.max, pr.n);
    if (tok !== T.token) return;
    T.loading = false;
    T.exs = list.map(p => ({ kind: 'pz', p }));
    if (!T.exs.length) { $('trMain').innerHTML = '<div class="pz-s">Couldn\'t load practice puzzles (no internet?). Try again later.</div><button class="btn" data-tr="home">← Back</button>'; return; }
  }
  trSetEx();
}
async function trPickPuzzles(themes, max, n) {
  const seen = new Set(trProg().seen);
  const fits = p => p.th.some(t => themes.includes(t)) && p.r <= max;
  let cand = PZ_POOL.filter(p => fits(p) && !seen.has(p.id));
  if (cand.length < n) {
    // top up from Lichess, by theme
    for (let tries = 0; tries < n * 3 && cand.length < n; tries++) {
      const theme = themes[tries % themes.length];
      try {
        const r = await fetch(`https://lichess.org/api/puzzle/next?angle=${theme}&difficulty=easiest`, { headers: { Accept: 'application/json' } });
        if (!r.ok) break;
        const j = await r.json(), c = new Chess();
        for (const san of j.game.pgn.split(' ')) if (!c.move(san, { sloppy: true })) throw new Error('bad pgn');
        const last = c.history({ verbose: true }).pop();
        const p = { id: j.puzzle.id, fen: c.fen(), last: last.from + last.to, sol: j.puzzle.solution, r: j.puzzle.rating, th: j.puzzle.themes, g: j.game.id };
        if (!PZ_POOL.some(x => x.id === p.id)) { PZ_POOL.push(p); prog.extra.push(p); if (prog.extra.length > 400) prog.extra.shift(); }
        if (!seen.has(p.id) && !cand.some(x => x.id === p.id) && p.th.some(t => themes.includes(t))) cand.push(p);
      } catch { break; }
    }
  }
  if (cand.length < n) cand = cand.concat(PZ_POOL.filter(p => fits(p) && seen.has(p.id) && !cand.includes(p))); // allow repeats
  cand.sort((a, b) => a.r - b.r);
  const pool = cand.slice(0, Math.max(n * 3, 12));
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  return pool.slice(0, n).sort((a, b) => a.r - b.r);
}
function trRenderEndgamePractice(L) {
  T.view = 'egpractice'; $('trList').hidden = true;
  const items = L.practice.endgames.map(id => EG_ITEMS.find(x => x.id === id)).filter(Boolean);
  const done = it => !!((prog.endgames || {})[it.id] || {}).done;
  const all = items.every(done);
  if (all) { const P = trProg(); if (!P.done[L.id]) { P.done[L.id] = { stars: 3, at: Date.now() }; saveProgress(); if (window.dailyBump) dailyBump('lesson'); } }
  $('trMain').innerHTML = `
    <div class="tr-top"><button class="icon-btn" data-tr="home" title="All lessons">←</button>
      <div><div class="tr-k">Practice · Endgames trainer</div><div class="tr-t">${L.icon} ${esc(L.title)}</div></div></div>
    <div class="pz-s">Each one opens the Endgames tab, where Stockfish/the tablebase defends perfectly. Win all three to pass. Come back here after each one.</div>
    <div class="op-lines">${items.map(it => `<button class="op-line${done(it) ? ' on' : ''}" data-tr="eg:${it.id}"><span class="st">${done(it) ? '✓' : '○'}</span><span class="nm">${esc(it.name)}</span><span class="stars">${done(it) ? 'done' : 'Go ▶'}</span></button>`).join('')}</div>
    ${all ? '<div class="op-ok">✓ All three mastered — lesson passed!</div>' : ''}`;
  if (!T.pos) T.pos = new Chess();
  trDraw();
}
function trSetEx() {
  const e = T.exs[T.ex];
  T.state = 'play'; T.miss = false; T.hint = 0; T.why = null; T.msg = null; T.badge = null; T.arrows = []; T.marks = []; T.step = 0; selected = null;
  if (e.kind === 'pz') {
    T.pos = new Chess(e.p.fen); T.last = e.p.last ? { from: e.p.last.slice(0, 2), to: e.p.last.slice(2, 4) } : null;
  } else { T.pos = posFrom(e); T.last = lastOf(T.pos); }
  T.orient = T.pos.turn();
  trRenderPractice(); trDraw();
}
function trTask() {
  const e = T.exs[T.ex], side = T.orient === 'w' ? 'White' : 'Black';
  if (e.kind === 'good') return e.prompt;
  const th = e.p.th, mate = th.find(t => /^mateIn\d/.test(t));
  if (mate) return `${side} to move — <b>checkmate in ${mate.slice(6)}</b>.`;
  if (th.includes('defensiveMove')) return `${side} to move — find the move that <b>saves</b> you.`;
  return `${side} to move — find the best move${th.includes('crushing') || th.includes('advantage') ? ' and <b>win material</b>' : ''}.`;
}
function trRenderPractice() {
  const L = T.L;
  if (T.loading) { $('trMain').innerHTML = `<div class="tr-top"><button class="icon-btn" data-tr="home">←</button><div class="tr-t">${L.icon} ${esc(L.title)}</div></div><div class="pz-s"><span class="spin"></span> Getting practice positions…</div>`; return; }
  const e = T.exs[T.ex], n = T.exs.length;
  const dots = T.exs.map((_, i) => `<i class="${i < T.res.length ? (T.res[i] ? 'ok' : 'no') : i === T.ex ? 'on' : ''}"></i>`).join('');
  let st = '', btns = '';
  if (T.state === 'play') {
    st = `<div class="tr-task">${trTask()}</div>${T.msg ? `<div class="pz-s">${T.msg}</div>` : ''}${T.hint && e.kind === 'pz' ? `<div class="pz-s">💡 ${trHintText(e)}</div>` : ''}`;
    btns = `<button class="btn" data-tr="hint">💡 Hint</button><button class="btn" data-tr="answer">👁 Show answer</button>`;
  } else if (T.state === 'step') st = `<div class="op-ok">✓ Good — keep going…</div><div class="tr-task">${trTask()}</div>`;
  else if (T.state === 'checking') st = `<div class="pz-s"><span class="spin"></span> Stockfish is checking your move…</div>`;
  else if (T.state === 'wrong') {
    st = `<div class="tr-verdict bad">✕ ${esc(T.wrongSan)} isn't it</div><div class="coach-b">${T.why || '<p><span class="spin"></span> Coach is looking at why…</p>'}</div>`;
    btns = `<button class="btn primary" data-tr="retry">↻ Try again</button><button class="btn" data-tr="answer">👁 Show answer</button>`;
  } else if (T.state === 'solved' || T.state === 'shown') {
    st = `<div class="tr-verdict ${T.state === 'solved' && !T.miss ? 'good' : ''}">${T.state === 'solved' ? (T.miss ? '✓ Solved (with help)' : '✓ Correct!') : '👁 The answer'}</div><div class="coach-b">${T.why || '<p><span class="spin"></span> Coach is explaining…</p>'}</div>`;
    btns = `<button class="btn primary" data-tr="nextex">${T.ex + 1 < n ? 'Next ▶' : 'Finish ▶'}</button>`;
  }
  $('trMain').innerHTML = `
    <div class="tr-top"><button class="icon-btn" data-tr="home" title="All lessons">←</button>
      <div><div class="tr-k">${T.review ? 'Mixed review' : 'Practice'} · ${T.ex + 1} of ${n}</div><div class="tr-t">${L.icon} ${esc(L.title)}</div></div></div>
    <div class="tr-dots res">${dots}</div>
    ${st}
    ${btns ? `<div class="row">${btns}</div>` : ''}
    ${T.state === 'play' && !T.review ? '<button class="linkbtn" data-tr="relearn" style="align-self:flex-start">Read the lesson again</button>' : ''}`;
}
function trHintText(e) {
  const t = e.p.th.find(x => TR_HINT[x]);
  const base = t ? TR_HINT[t] : 'Checks, captures, threats — in that order.';
  return T.hint >= 2 ? base + ' The arrow shows the move.' : base + ' The highlighted piece moves.';
}
function trMove(from, to, promo) {
  if (T.view === 'learn') return trSlideMove(from, to);
  if (!trCanMove()) return false;
  const legal = T.pos.moves({ square: from, verbose: true }).filter(m => m.to === to);
  if (!legal.length) return false;
  if (legal.some(m => m.promotion) && !promo) { askPromotion(T.orient, q => trMove(from, to, q)); return true; }
  const e = T.exs[T.ex], fb = T.pos.fen(), prevLast = T.last;
  const m = T.pos.move({ from, to, promotion: promo || undefined }), uci = from + to + (promo || '');
  T.last = { from, to }; selected = null; T.arrows = []; T.marks = []; T.msg = null;
  if (e.kind === 'good') { trJudgeGood(e, fb, m, uci, prevLast); return true; }
  const sol = e.p.sol;
  if (uci === sol[T.step] || T.pos.in_checkmate()) {
    T.step++; T.badge = { sq: to, kind: 'best' };
    if (T.step >= sol.length || T.pos.in_checkmate()) { trFinishEx(true, fb, uci); trDraw(moveAnim(m)); return true; }
    moveSound(m); T.state = 'step'; trRenderPractice(); trDraw(moveAnim(m));
    const tok = T.token;
    setTimeout(() => {
      if (tok !== T.token || T.state !== 'step') return;
      const r = T.pos.move(uciMove(sol[T.step])); T.step++;
      T.last = { from: r.from, to: r.to }; T.badge = null; T.state = 'play'; T.hint = 0;
      moveSound(r); trRenderPractice(); trDraw(moveAnim(r));
    }, 600);
    return true;
  }
  // wrong: keep it on the board, ask Stockfish why it fails
  T.miss = true; T.state = 'wrong'; T.wrongSan = m.san; T.why = null; T.prevLast = prevLast;
  T.badge = { sq: to, kind: 'blunder' }; sfx('wrong');
  trRenderPractice(); trDraw(moveAnim(m));
  const tok = T.token, at = T.ex;
  judge(fb, uci, sol[T.step], trSearch, { depth: 14, movetime: 1500 }).then(j => {
    if (tok !== T.token || T.ex !== at || T.state !== 'wrong') return;
    let html = '';
    try {
      if (j) {
        html = whyText(fb, uci, j);
        const reply = j.played.pv[1];
        if (reply) T.arrows = [[reply.slice(0, 2), reply.slice(2, 4), 'r']];
      }
    } catch (err) { console.warn(err); }
    T.why = html || '<p>That move lets your opponent off the hook. Look again — checks, captures, threats.</p>';
    trRenderPractice(); trDraw();
  });
  return true;
}
async function trJudgeGood(e, fb, m, uci, prevLast) {
  T.state = 'checking'; moveSound(m); trRenderPractice(); trDraw(moveAnim(m));
  const tok = T.token, at = T.ex;
  const j = await judge(fb, uci, null, trSearch, { depth: 15, movetime: 1800 });
  if (tok !== T.token || T.ex !== at) return;
  const pass = trNeed(e.need, m), loss = j ? j.loss : 0;
  if (j && loss <= (e.maxLoss || 8) && pass) {
    T.badge = { sq: m.to, kind: loss < 1.5 ? 'best' : 'good' };
    T.state = 'solved';
    T.why = `<p>${trNeedPraise(e.need, m)}</p>` + ideaHTML(moveIdea(fb, j.played));
    trRecord(!T.miss); sfx('move');
  } else {
    T.miss = true; T.state = 'wrong'; T.wrongSan = m.san; T.badge = { sq: m.to, kind: 'mistake' }; sfx('wrong');
    let html = '';
    if (!pass) html += `<p>${trNeedMiss(e.need, m)}</p>`;
    if (j && loss > (e.maxLoss || 8)) { try { html += whyText(fb, uci, j); } catch {} }
    if (j && j.best) { const s = pvSan(fb, j.best.pv, 1)[0]; html += `<p>A good choice here: <b>${esc(s)}</b>.</p>`; }
    T.why = html; T.goodBest = j && j.best ? j.best.pv[0] : null;
  }
  trRenderPractice(); trDraw();
}
function trNeed(need, m) {
  const home = m.color === 'w' ? '1' : '8';
  if (need === 'center') return (m.piece === 'p' && ['c4', 'd4', 'e4', 'c5', 'd5', 'e5', 'e6', 'c6', 'd6'].includes(m.to)) || (m.piece === 'n' && ['c3', 'f3', 'c6', 'f6'].includes(m.to));
  if (need === 'develop') return 'nb'.includes(m.piece) && m.from[1] === home;
  if (need === 'castle') return m.flags.includes('k') || m.flags.includes('q');
  return true;
}
function trNeedPraise(need, m) {
  return need === 'center' ? (m.piece === 'p' ? 'A pawn in the center controls key squares and opens lines for your pieces.' : 'The knight controls the center from here.')
    : need === 'develop' ? `Good — the ${NAME[m.piece]} joins the game and you are one step closer to castling.`
    : need === 'castle' ? 'Castled! Your king is safe behind its pawns and your rook is ready to join the game.' : 'Good move.';
}
function trNeedMiss(need, m) {
  return need === 'center' ? `${m.san} doesn't fight for the center (e4, d4, e5, d5).`
    : need === 'develop' ? `${m.san} doesn't bring a knight or bishop off the back rank.`
    : need === 'castle' ? `${m.san} leaves the king in the middle — castling was possible.` : '';
}
function trRetry() {
  T.pos.undo(); T.badge = null; T.arrows = []; T.last = T.prevLast !== undefined ? T.prevLast : T.last; T.state = 'play'; T.why = null;
  const e = T.exs[T.ex];
  if (e.kind === 'good') { T.pos = posFrom(e); T.last = lastOf(T.pos); }
  trRenderPractice(); trDraw();
}
async function trShowAnswer() {
  const e = T.exs[T.ex], tok = T.token;
  if (T.state === 'wrong') { if (e.kind === 'good') { T.pos = posFrom(e); T.last = lastOf(T.pos); } else { T.pos.undo(); T.last = T.prevLast; } }
  T.miss = true; T.badge = null;
  if (e.kind === 'good') {
    T.state = 'shown'; T.why = null; trRenderPractice();
    const fb = T.pos.fen(), r = await trSearch(fb, { depth: 13, movetime: 1200 });
    if (tok !== T.token) return;
    const l = r && r.lines[0]; if (!l) return;
    T.arrows = [[l.pv[0].slice(0, 2), l.pv[0].slice(2, 4), 'g']];
    T.why = `<p>Stockfish suggests <b>${esc(pvSan(fb, l.pv, 1)[0])}</b>.</p>` + ideaHTML(moveIdea(fb, l), false);
    trRecord(false); trRenderPractice(); trDraw();
    return;
  }
  const fb = T.pos.fen(), u = e.p.sol[T.step];
  T.arrows = [[u.slice(0, 2), u.slice(2, 4), 'g']]; T.state = 'shown'; T.why = null;
  trRenderPractice(); trDraw();
  trRecord(false);
  // explain the right move, then play the rest of the solution
  const r = await trSearch(fb, { depth: 14, movetime: 1500, searchmoves: u });
  if (tok !== T.token) return;
  const line = r && r.lines[0] ? r.lines[0] : { pv: e.p.sol.slice(T.step), score: { cp: 0, mate: null } };
  T.why = `<p>The answer: <b>${esc(pvSan(fb, [u], 1)[0])}</b>${e.p.sol.length - T.step > 1 ? ` — full line: ${lineText(fb, pvSan(fb, e.p.sol.slice(T.step), 8))}` : ''}</p>` + ideaHTML(moveIdea(fb, line), false);
  trRenderPractice();
  for (let i = T.step; i < e.p.sol.length; i++) {
    await new Promise(res => setTimeout(res, 900));
    if (tok !== T.token) return;
    const m = T.pos.move(uciMove(e.p.sol[i])); if (!m) break;
    T.last = { from: m.from, to: m.to }; T.arrows = []; moveSound(m); trDraw(moveAnim(m));
  }
}
function trFinishEx(ok, fb, uci) {
  T.state = 'solved'; T.why = null;
  trRecord(ok && !T.miss);
  if (!T.miss) sfx('right'); else sfx('move');
  trRenderPractice();
  // why does it work? (engine line from the start of the puzzle)
  const e = T.exs[T.ex], tok = T.token, start = new Chess(e.p.fen).fen();
  trSearch(start, { depth: 14, movetime: 1500, searchmoves: e.p.sol[0] }).then(r => {
    if (tok !== T.token) return;
    const line = r && r.lines[0] ? r.lines[0] : { pv: e.p.sol, score: { cp: 0, mate: null } };
    T.why = ideaHTML(moveIdea(start, line), false);
    trRenderPractice();
  });
}
function trRecord(ok) {
  if (T.res.length > T.ex) return;
  T.res.push(ok);
  const P = trProg(), e = T.exs[T.ex];
  if (e.kind === 'pz') { if (!P.seen.includes(e.p.id)) P.seen.push(e.p.id); if (P.seen.length > 2000) P.seen.shift(); }
  const k = T.L.id, s = P.stats[k] || [0, 0]; P.stats[k] = [s[0] + (ok ? 1 : 0), s[1] + 1];
  if (ok && window.dailyBump) dailyBump('pz');
  saveProgress();
}
function trNextEx() {
  if (T.ex + 1 < T.exs.length) { T.ex++; T.token++; trSetEx(); return; }
  trDone();
}
function trDone() {
  const L = T.L, ok = T.res.filter(Boolean).length, n = T.exs.length, need = L.practice.need ?? Math.ceil(n * 0.7);
  const pass = ok >= need, st = ok === n ? 3 : pass ? 2 : ok >= need - 1 ? 1 : 0;
  const P = trProg();
  if (!T.review && pass) { const prev = P.done[L.id]; P.done[L.id] = { stars: Math.max(st, prev ? prev.stars : 0), at: Date.now() }; saveProgress(); }
  if (pass) confetti(ok === n ? 90 : 40);
  if (window.dailyBump) dailyBump('lesson');
  const nx = trNext();
  T.view = 'done';
  $('trMain').innerHTML = `
    <div class="tr-top"><button class="icon-btn" data-tr="home">←</button><div><div class="tr-k">${T.review ? 'Mixed review' : 'Results'}</div><div class="tr-t">${L.icon} ${esc(L.title)}</div></div></div>
    <div class="tr-score">${ok} / ${n}<small>solved first try</small></div>
    ${T.review ? '' : stars(st)}
    <div class="op-body">${pass ? (ok === n ? '<p class="op-ok">Perfect! You\'ve got this idea.</p>' : '<p class="op-ok">Lesson passed. 👏</p>')
      : `<p>You need ${need} of ${n} to pass. Read the idea again, then try a fresh set — you'll get it.</p>`}</div>
    <div class="row">
      <button class="btn" data-tr="${T.review ? 'review' : 'again'}">↻ ${pass ? 'Practise more' : 'Try again'}</button>
      ${pass && nx && !T.review ? `<button class="btn primary" data-tr="open:${nx.id}">Next: ${esc(nx.title)} ▶</button>` : `<button class="btn primary" data-tr="home">All lessons</button>`}
    </div>
    ${pass ? '<button class="btn wide" data-tr="game">♟ Use it in a training game vs Stockfish</button>' : ''}`;
}
function trReview() {
  const P = trProg(), done = TR_LESSONS.filter(l => P.done[l.id] && l.practice.themes);
  if (!done.length) return;
  const themes = [...new Set(done.flatMap(l => l.practice.themes))], max = Math.max(...done.map(l => l.practice.max));
  trStartPractice({ id: 'review', icon: '🔁', title: 'Mixed review', practice: { themes, max, n: 8, need: 6 } }, true);
}
function trTrainingGame() {
  TG.guard = true; TG.threat = true; PC.on = true;
  store.set('tgGuard', true); store.set('tgThreat', true); store.set('coach', true);
  syncTraining(); $('coachOn').checked = true;
  setMode('play'); newGame();
}

// ---------- controls ----------
$('trainView').addEventListener('click', e => {
  const b = e.target.closest('[data-tr]'); if (!b || b.disabled) return;
  const a = b.dataset.tr;
  if (a.startsWith('open:')) return trOpen(a.slice(5));
  if (a === 'home') { T.token++; if (T.tool) { if (T.tool.stop) T.tool.stop(); T.tool = null; } return trRenderPath(); }
  if (a.startsWith('eg:')) { const it = EG_ITEMS.find(x => x.id === a.slice(3)); if (!it) return; G.item = it; G.state = 'idle'; setMode('endgame'); if (G.item !== it || G.pos.fen() !== new Chess(it.fen).fen()) egStart(it); egLines(); return; }
  if (a === 'next') { T.slide++; return trShowSlide(); }
  if (a === 'prev') { T.slide--; return trShowSlide(); }
  if (a === 'show') { const s = T.L.slides[T.slide]; return trPlaySlideAnswer(s.try.slice(0, 2), s.try.slice(2, 4)); }
  if (a === 'practice' || a === 'again') return trStartPractice(T.L);
  if (a === 'relearn') { T.token++; T.view = 'learn'; T.slide = 0; return trShowSlide(); }
  if (a === 'hint') {
    const ex = T.exs[T.ex]; T.miss = true; T.hint = Math.min(2, T.hint + 1);
    if (ex.kind === 'pz') { const u = ex.p.sol[T.step]; T.marks = [u.slice(0, 2)]; if (T.hint >= 2) T.arrows = [[u.slice(0, 2), u.slice(2, 4), 'y']]; }
    else T.msg = ex.need === 'castle' ? 'Look at your king.' : ex.need === 'develop' ? 'Knights and bishops on your back rank want to come out.' : 'The squares e4, d4, e5, d5 are the center.';
    trRenderPractice(); return trDraw();
  }
  if (a === 'retry') return trRetry();
  if (a === 'answer') return trShowAnswer();
  if (a === 'nextex') return trNextEx();
  if (a === 'review') return trReview();
  if (a === 'game') return trTrainingGame();
});
EXTRA_MODES.train = {
  view: 'trainView',
  ctl: {
    pos: () => (T.tool ? T.tool.pos() : T.pos || new Chess()), draw: () => trDraw(),
    move: (f, t, anim) => (T.tool ? T.tool.move(f, t, anim) : trMove(f, t)),
    canPick: p => (T.tool ? T.tool.canPick(p) : trCanMove() && p.color === T.pos.turn()),
    click: sq => (T.tool && T.tool.click ? T.tool.click(sq) : false),
  },
  draw: () => trDraw(),
  init: () => { trProg(); trRenderPath(); },
  enter: () => { if (T.tool) return; if (T.view === 'path') trRenderPath(); else if (T.view === 'egpractice') trRenderEndgamePractice(T.L); },
  leave: () => { if (T.tool && T.tool.pause) T.tool.pause(); },
};
