'use strict';
// Opening repertoires for the Openings trainer.
//  - lessons: step-by-step concept lessons (Basics mode). Each step shows the position after `moves`,
//    optional arrows ('e7e6' green, '!d1d4' red) and marked squares; `task` is a move the user must find.
//  - groups/lines: move sequences. {text} after a move = coach note for that move.
//    [SAN: text] = why a tempting WRONG move is bad in the current position.
//    Notes are shared by position, so a move only needs explaining once across lines.
//  - plan: the middlegame plan shown when the book runs out and Stockfish takes over.
const OPENINGS = [
  {
    id: 'french', name: 'French Defense', side: 'b', icon: '♚',
    blurb: 'You are Black and answer 1.e4 with 1…e6. Start with 📚 Basics, then learn a reply to every White try.',
    lessons: [
      {
        id: 'fr-l1', title: '1. What is the French?', steps: [
          { moves: 'e4', task: 'e6',
            text: 'White opens 1.e4 — a pawn in the centre that also opens lines for the queen and bishop. The French answer is a modest-looking pawn move: 1…e6. Play it.',
            done: 'That is the French Defense. It looks quiet, but it is preparing a fight for the centre.' },
          { moves: 'e4 e6 d4', task: 'd5', arrows: ['d7d5'],
            text: 'White builds the "ideal" two-pawn centre with 2.d4. Now comes the point of 1…e6: play 2…d5 and attack e4.',
            done: 'Your d5 pawn attacks e4 — and it is PROTECTED by the e6 pawn. That is why you played …e6 first: if you play …d5 without it, White takes on d5 and your queen has to recapture and gets chased around.' },
          { moves: 'e4 e6 d4 d5', marks: ['e4', 'd5'], arrows: ['!d5e4'],
            text: 'White\'s e4 pawn is attacked. White has four main answers, and you will learn a reply to each:<br>• <b>3.e5</b> push past — the Advance (you hit back with …c5)<br>• <b>3.Nc3</b> defend — you pin it with 3…Bb4, the Winawer<br>• <b>3.Nd2</b> defend — the Tarrasch, you answer 3…c5<br>• <b>3.exd5</b> trade — the Exchange, a calm equal game' },
          { moves: 'e4 e6 d4 d5', marks: ['c8', 'e6'],
            text: 'The price of the French: your light-squared bishop on c8 is shut in by your own e6 pawn — the famous "French bishop". A lot of French strategy is about fixing it: trade it off (…b6 and …Ba6, or …Bd7-b5), or free it after a pawn break. Don\'t worry about it — in return you get a rock-solid centre that is very hard to attack.' },
        ],
      },
      {
        id: 'fr-l2', title: '2. Pawn chains: hit the base!', steps: [
          { moves: 'e4 e6 d4 d5 e5', marks: ['d4', 'e5', 'd5', 'e6'],
            text: 'After 3.e5 both sides have a pawn CHAIN. White\'s chain (d4-e5) points at your kingside. Yours (e6-d5) points at the queenside.<br><br>Golden rule: attack a chain at its <b>BASE</b> — the back pawn that holds everything up. White\'s base is d4.' },
          { moves: 'e4 e6 d4 d5 e5', task: 'c5', arrows: ['c7c5'],
            text: 'So hit the base at once. Play 3…c5!',
            done: 'If d4 ever falls, the e5 pawn loses its support and White\'s whole centre wobbles. You will play …c5 in almost every French.' },
          { moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6', marks: ['d4'], arrows: ['c5d4', 'c6d4', 'b6d4'],
            text: 'Now pile up on d4: the c5 pawn, the knight on c6 and the queen on b6 all attack it. White defends with c3, Nf3 and the queen.<br><br><b>Count attackers vs defenders every move.</b> If you get more attackers than White has defenders, d4 falls. Your knight will add a fourth attacker from f5.' },
          { moves: 'e4 e6 d4 d5 e5 c5 dxc5 Nc6 Nf3 Bxc5 Bd3', task: 'f6', arrows: ['f7f6'],
            text: 'The second lever is …f6, hitting e5 (the HEAD of the chain). Use it once your pieces are ready — it opens the f-file for your rook and frees your position. Here White gave up d4 already, so hit e5 now: play …f6.',
            done: 'e5 is attacked and has no pawn support — White\'s centre is collapsing.' },
          { moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2 cxd4 cxd4 Nh6 Nc3 Nf5', arrows: ['!d1g4', 'c8c1'],
            text: 'Who attacks where? Pawns point to where you play. White\'s e5 pawn gains space on the <b>kingside</b> — White attacks there (Qg4, h4, Bd3, f4-f5). Your pawns point at the <b>queenside</b> — you attack there (the c-file, pressure on b2 and d4, …a6 and …b5).<br><br>Don\'t castle kingside into a White attack before your knight is on f5 defending.' },
        ],
      },
      {
        id: 'fr-l3', title: '3. Where your pieces go', steps: [
          { moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2 cxd4 cxd4', task: 'Nh6', arrows: ['g8h6', 'h6f5'], marks: ['f6'],
            text: 'Your g8 knight can\'t use f6 — the e5 pawn controls it. Its best square is <b>f5</b>, where it hits d4 and guards your kingside. Get there via h6 (or e7). Play …Nh6.',
            done: 'Next …Nf5. If White grabs it with Bxh6, first take …Qxb2! (the c1 bishop no longer guards b2), then recapture …gxh6.' },
          { moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2', arrows: ['!b6b2', '!c1b2'],
            text: 'A classic beginner mistake: grabbing b2 while White\'s bishop on c1 still guards it. …Qxb2?? Bxb2 and your queen is gone. Only take on b2 when the c1 bishop has left.' },
          { moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2 cxd4 cxd4 Nh6 Nc3 Nf5', arrows: ['f8e7', 'c8d7', 'a8c8'],
            text: 'The rest of the set-up: dark bishop to e7 (or …Bb4+), light bishop to d7, rook to c8 on the open c-file, then castle. Every piece either hits d4 or guards the king.' },
        ],
      },
      {
        id: 'fr-l4', title: '4. Traps you must know', steps: [
          { moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Bd3 cxd4 cxd4', arrows: ['!d3b5', '!d1d4'], marks: ['d4'],
            text: 'White has left d4 hanging. It looks free: …Nxd4 Nxd4 Qxd4 — but then <b>Bb5+!</b> The bishop gives check AND gets out of the way of the queen on d1, which now attacks your queen on d4. You lose your queen. This trap has caught thousands of players.' },
          { moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Bd3 cxd4 cxd4', task: 'Bd7', arrows: ['c8d7'],
            text: 'The fix: play …Bd7 first. Now b5 is covered, so Bb5+ is impossible.',
            done: 'Next move you can take on d4 safely. White may sacrifice the pawn anyway (the Milner-Barry Gambit) — you will learn that line.' },
          { moves: 'e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4', task: 'O-O', arrows: ['!g4g7'],
            text: 'In the Winawer you trade your dark bishop, so g7 becomes a weak spot. White\'s queen goes straight for it with Qg4. The simplest answer: castle! Your king then guards g7.',
            done: 'g7 is safe. Your plan: …Nbc6, …f5 or …Nf5, and lock the queenside with …c4 when it helps.' },
        ],
      },
    ],
    groups: [
      {
        name: 'Advance Variation (3.e5)',
        plan: 'Keep hammering d4 (…Nf5, …Qb6, …Bd7, …Rc8). If White\'s centre holds, break with …f6 to open the f-file. Castle once the knight on f5 guards your king. Never take on b2 while the c1 bishop guards it.',
        lines: [
          { id: 'fr-adv-be2', name: 'Main line 6.Be2', pgn: `
            e4 {White grabs the centre and frees the queen and bishop.}
            e6 {The French. You prepare …d5 so that when you hit e4, your pawn on d5 is already protected.}
            d4 {White builds the two-pawn centre.}
            d5 {Hit e4. White must now push, defend or trade.}
            e5 {The Advance: White grabs space and takes f6 away from your knight. The pawn chain d4-e5 is set.}
            [f6: Too early. First hit the BASE of the chain with …c5. Playing …f6 now weakens the e8-h5 diagonal and White answers Bd3 with Qh5+ ideas.]
            c5 {Attack the base of the chain (d4). If d4 falls, e5 is left hanging. This is THE French move.}
            c3 {White supports d4 with a pawn so it can always recapture with a pawn.}
            Nc6 {Second attacker on d4. Count: you have 2 attackers, White has 2 defenders (c3, queen).}
            Nf3 {White adds a third defender.}
            Qb6 {Third attacker — and the queen also eyes b2. This is the most direct set-up.}
            Be2 {White simply develops and prepares to castle.}
            [Qxb2: Never! The c1 bishop guards b2: …Qxb2?? Bxb2 and your queen is gone.]
            cxd4 {Release the tension now. White has to recapture with the c-pawn, which opens the c-file for your rook.}
            cxd4 {The c-file is open. White's d4 is now defended only by pieces — a target.}
            Nh6 {The knight heads for f5, where it hits d4 a fourth time and guards your king. (If Bxh6, take …Qxb2 first, then …gxh6.)}
            Nc3 {White develops and covers d5.}
            Nf5 {A dream square: no white pawn can kick it, it attacks d4 and it defends e7, g7 and h6. Next …Bb4 or …Be7 and castle.}` },
          { id: 'fr-adv-bxh6', name: '6.Be2 … 8.Bxh6', pgn: `
            e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2 cxd4 cxd4 Nh6
            Bxh6 {White takes your knight to damage your kingside pawns.}
            Qxb2 {In-between move: b2 is unprotected now that the bishop left c1, so grab the pawn first, then recapture on h6. (Taking …gxh6 at once is also fine.)}
            Nbd2 {White defends and develops. The bishop on h6 is still hanging.}
            gxh6 {Now recapture. You are a pawn up with the bishop pair. Your king will be safe on the queenside or in the centre.}` },
          { id: 'fr-adv-b3', name: '6.Be2 … 8.b3', pgn: `
            e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Be2 cxd4 cxd4 Nh6
            b3 {White protects the c-file squares and prepares Bb2 to hold d4.}
            Nf5 {Same plan: knight to f5, attacking d4.}
            Bb2
            Bb4+ {Check! White can't block well — Nc3 or Nbd2 drop the c3 / d4 control, so White's king usually has to move.}
            Kf1 {White's king loses the right to castle — a small win for you.}
            Be7 {Retreat the bishop to safety; White's king is awkward and you keep pressure on d4. Plan: …O-O, …Bd7, …Rac8.}` },
          { id: 'fr-adv-a3', name: '6.a3 — stop b4 with …a5', pgn: `
            e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6
            a3 {White wants b4, to gain queenside space and kill your pressure on d4.}
            a5 {Stop b4 for good! Now b4 would just be taken. This keeps your queenside play alive.}
            Bd3 {White develops toward your kingside.}
            Bd7 {Develop; the bishop connects your rooks and can later go to b5 to trade off White's good bishop.}
            Bc2 {White keeps the bishop, avoiding a trade.}
            Nh6 {Knight toward f5. If Bxh6 gxh6, you get the bishop pair and the open g-file for your rook — Stockfish rates it equal.}` },
          { id: 'fr-adv-a3-be2', name: '6.a3 a5 7.Be2', pgn: `
            e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 a5
            Be2 {Quiet development.}
            Nh6 {Same plan: knight to f5. If White takes on d4 later, …Nxe5 ideas appear because e5 is undefended.}` },
          { id: 'fr-adv-mb', name: 'Milner-Barry Gambit 6.Bd3', pgn: `
            e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6
            Bd3 {The Milner-Barry Gambit: White is ready to give up d4 for quick development.}
            cxd4 {Take first.}
            cxd4
            [Nxd4: THE TRAP! …Nxd4 Nxd4 Qxd4 Bb5+ — the bishop checks and uncovers the white queen on d4. You lose your queen.]
            Bd7 {Covers b5, so the Bb5+ trick no longer works. Now d4 really is attackable.}
            O-O {White offers the pawn.}
            Nxd4 {Now it is safe to take.}
            Nxd4
            Qxd4 {A clean pawn up. White has development for it — so don't grab more pawns; finish developing (…Ne7, …Nc6, …O-O-O) and trade pieces.}` },
          { id: 'fr-adv-dxc5', name: '4.dxc5', pgn: `
            e4 e6 d4 d5 e5 c5
            dxc5 {White gives up the base of its chain — a strategic concession.}
            Nc6 {Develop first; c5 will fall anyway.}
            Nf3
            Bxc5 {Pawn regained, with a free and active bishop.}
            Bd3
            f6 {Now hit the head of the chain! e5 has no pawn behind it and will fall or be traded. Your position is excellent.}` },
          { id: 'fr-adv-nf3', name: '4.Nf3 (no c3)', pgn: `
            e4 e6 d4 d5 e5 c5
            Nf3 {White skips c3, so d4 has no pawn support.}
            cxd4 {Grab it — d4 is now a target and White must spend time getting it back.}
            Bd3 {White offers a gambit for quick development.}
            Nc6
            O-O
            Nge7 {Heading for g6 to attack e5, and keeping the d4 pawn defended.}
            Bf4
            Ng6 {Hits the bishop and the e5 pawn. You are a pawn up with a good position.}` },
        ],
      },
      {
        name: 'Winawer (3.Nc3 Bb4)',
        plan: 'White has doubled c-pawns and the bishop pair. Keep the position CLOSED so the bishops stay weak: lock with …c4, put a knight on f5, pressure c3 and a4 with …Qa5 and …Bd7. White attacks your kingside — keep g7 defended.',
        lines: [
          { id: 'fr-win-qg4', name: '7.Qg4 — castle!', pgn: `
            e4 e6 d4 d5
            Nc3 {White defends e4 with a knight.}
            Bb4 {The Winawer! Pin the knight that defends e4. Now e4 is really attacked.}
            e5 {White closes the centre.}
            c5 {Same idea as always: hit the base, d4.}
            a3 {White asks your bishop to decide.}
            Bxc3+ {Take. You give up the bishop pair, but White gets doubled, weak c-pawns.}
            bxc3 {Look at White's pawns: c2 and c3 doubled, a3 isolated. Long-term targets.}
            Ne7 {The knight goes to e7 (not f6!) heading for f5 or c6 via g6/f5, and guards g6.}
            Qg4 {White attacks g7 — your dark bishop is gone, so g7 is weak.}
            O-O {Castle! The king defends g7. Simple and solid.}
            Bd3 {White aims everything at your king (Bxh7+ ideas).}
            c4 {Hit the bishop! It is kicked off the b1-h7 diagonal it was using to attack your king, and the queenside is locked for good.}
            Bh6 {Tricky: White threatens Qxg7 mate.}
            Ng6 {Block the g-file. g7 is safe again.}
            Bxg6
            fxg6 {Recapture toward the centre and open the f-file for your rook. Your pawn on c4 cramps White's queenside; next …Nc6, …Qe8, …Bd7.}` },
          { id: 'fr-win-qg4-nf3', name: '7.Qg4 O-O 8.Nf3', pgn: `
            e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 O-O
            Nf3 {White develops before attacking.}
            f5 {Block the queen out! With the f-pawn on f5, the g-file and the b1-h7 diagonal are much harder for White to use.}
            Qg5 {The queen hits your knight on e7.}
            Qc7 {Defend the knight along the 7th rank and pressure c3/e5. Next …Nbc6, …Bd7, …c4.}` },
          { id: 'fr-win-nf3', name: '7.Nf3', pgn: `
            e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7
            Nf3 {Calm development instead of Qg4.}
            Nbc6 {Develop and add pressure on d4.}
            a4 {White plans Ba3 to activate the bishop.}
            Qa5 {The queen pins the c3 pawn to the king (along a5-e1) and eyes a4.}
            Bd2
            Bd7 {Develop and connect. Plans: …c4 to fix White's pawns, …O-O, and later …f6.}` },
          { id: 'fr-win-bd2', name: '5.Bd2', pgn: `
            e4 e6 d4 d5 Nc3 Bb4 e5 c5
            Bd2 {White breaks the pin.}
            Ne7 {Natural development toward f5.}
            Nb5 {White tries to trade off your bishop with the knight.}
            Bxd2+
            Qxd2
            O-O {Castle — your king is safe and …Nbc6 / …a6 kick the knight next.}` },
          { id: 'fr-win-a3', name: '4.a3', pgn: `
            e4 e6 d4 d5 Nc3 Bb4
            a3 {Forcing an immediate decision.}
            Bxc3+
            bxc3
            dxe4 {Grab the centre pawn.}
            Qg4
            Nf6 {Develop. If Qxg7, your rook comes to g8 with tempo.}
            Qxg7
            Rg8
            Qh6
            Nbd7 {Develop and play …c5 / …b6 next. Material is level and White's pawns are a mess.}` },
          { id: 'fr-win-exd5', name: '4.exd5 (Exchange Winawer)', pgn: `
            e4 e6 d4 d5 Nc3 Bb4
            exd5 {Symmetrical pawns — White wants a quiet game.}
            exd5
            Bd3
            Nf6 {Natural development — the knight can use f6 here because White has no e5 pawn.}
            Ne2
            O-O {Castle.}
            O-O
            h6 {Stops Bg5 pinning your knight. Next …Nc6 and …Re8. Equal.}` },
          { id: 'fr-win-ne2', name: '4.Ne2', pgn: `
            e4 e6 d4 d5 Nc3 Bb4
            Ne2 {Protecting c3 in advance so the pin doesn't hurt.}
            dxe4 {Take the pawn.}
            a3
            Be7 {Keep the bishop and the extra pawn.}
            Nxe4
            Nf6 {Challenge White's best knight. Comfortable and equal.}` },
        ],
      },
      {
        name: 'Tarrasch (3.Nd2)',
        plan: 'You often get an isolated pawn on d5 after …cxd4. In the middlegame it is a STRENGTH: it gives your pieces open lines and the e4 square for a knight. Keep pieces on the board, develop fast (…Bd6, …O-O, …Re8, …Qe7), and attack. Avoid trading into an endgame, where the lone pawn becomes weak.',
        lines: [
          { id: 'fr-tar-bb5', name: '4.exd5 exd5 5.Bb5+', pgn: `
            e4 e6 d4 d5
            Nd2 {The Tarrasch: the knight defends e4 but avoids your …Bb4 pin.}
            c5 {Strike d4 at once — the knight on d2 doesn't control d4 or d5, so this is the perfect moment.}
            exd5 {White trades in the centre.}
            [Qxd5: Playable, but White gains time with Ngf3 and Bc4 hitting your queen. Recapturing with the pawn keeps a strong centre pawn and opens your c8 bishop.]
            exd5 {Recapture with the pawn: your c8 bishop is free, and your d5 pawn controls e4 and c4.}
            Bb5+ {White wants to trade off your good light-squared bishop.}
            Bd7 {Block with the bishop and offer the trade — it costs you nothing.}
            Bxd7+
            Nxd7 {Recapture with the knight — it develops and supports …Ngf6 next.}
            Ngf3
            Ngf6 {Develop the other knight. Now …Be7 or …Bd6 and castle.}
            O-O
            Be7 {Solid. Castle next, then …Re8 and …Qb6 / …Rc8. Equal and active.}` },
          { id: 'fr-tar-ngf3', name: '4.Ngf3', pgn: `
            e4 e6 d4 d5 Nd2 c5
            Ngf3 {White develops first.}
            Nf6 {Develop and add pressure on e4.}
            exd5
            exd5 {Same pawn structure as the main line: your bishop is free.}
            Bb5+
            Bd7
            Bxd7+
            Nbxd7 {Recapture with the queen's knight so your f6 knight keeps guarding the kingside.}
            O-O
            Be7 {Castle next. Plans: …O-O, …Re8, …Qb6.}` },
        ],
      },
      {
        name: 'Exchange (3.exd5)',
        plan: 'Symmetrical and calm. Develop everything, put a rook on e8 (the open e-file), and only then look for …c5, …Ne4 or …Bg4. You are fully equal — don\'t play passively.',
        lines: [
          { id: 'fr-exc-nf3', name: 'Symmetrical 4.Nf3', pgn: `
            e4 e6 d4 d5
            exd5 {The Exchange Variation — White goes for a quiet, symmetrical game.}
            exd5 {Bonus: your c8 bishop is free now. No "bad bishop" problem!}
            Nf3
            Nf6
            Bd3
            Bd6
            O-O
            O-O
            Bg5
            Bg4 {Copying is fine here. Next …Nbd7, …c6, …Re8. Equal.}` },
          { id: 'fr-exc-c4', name: '4.c4', pgn: `
            e4 e6 d4 d5 exd5 exd5
            c4 {White aims for an isolated queen's pawn position.}
            Nf6 {Develop quickly and fight for d5.}
            Nc3
            Bb4 {Pin and pressure the centre.}
            Nf3
            O-O {Castle; then …dxc4 and …Re8 — d4 will become your target.}` },
        ],
      },
      {
        name: 'Anti-French sidelines',
        plan: 'White avoided the main French. Don\'t panic: play …d5, …c5, …Nc6, develop and castle. Usually you attack on the queenside while White goes for your king.',
        lines: [
          { id: 'fr-anti-kia', name: "2.d3 King's Indian Attack", pgn: `
            e4 e6
            d3 {The King's Indian Attack: White avoids French theory.}
            d5
            Nd2
            Nf6 {Develop.}
            Ngf3
            c5 {Grab queenside space — your play is on the queenside, White's on the kingside.}
            g3
            Nc6
            Bg2
            Be7
            O-O
            O-O {Safe and flexible. Plan: …b5-b4 to attack on the queenside.}` },
          { id: 'fr-anti-qe2', name: '2.Qe2 Chigorin', pgn: `
            e4 e6
            Qe2 {The Chigorin: discourages …d5, because after exd5 the e-file opens against your king.}
            c5 {Switch plans — a Sicilian-style set-up.}
            Nf3
            Nc6
            g3
            g6 {Mirror White — your bishop goes to g7.}
            Bg2
            Bg7
            O-O
            Nge7 {Solid; …d6 and …O-O next.}` },
          { id: 'fr-anti-nf3', name: '2.Nf3', pgn: `
            e4 e6
            Nf3
            d5 {Same French plan.}
            Nc3 {The Two Knights set-up.}
            Nf6 {Hit e4 again.}
            e5
            Nfd7
            d4
            c5 {Back in a classical French structure — hit d4!}` },
          { id: 'fr-anti-nc3', name: '2.Nc3', pgn: `
            e4 e6
            Nc3
            d5 {Same plan. If d4 next, it is a normal French.}
            Nf3 {White delays d4.}
            Nf6 {Hit e4 again.}
            e5
            Nfd7
            d4
            c5 {Transposes to the 2.Nf3 line — strike d4.}` },
          { id: 'fr-anti-c4', name: '2.c4', pgn: `
            e4 e6
            c4 {Trying to stop …d5? Not really.}
            d5 {Challenge the centre anyway.}
            exd5
            exd5
            cxd5
            Nf6 {Don't recapture with the queen — develop, and d5 falls next.}
            Nc3
            Nxd5
            Nf3
            Nc6 {Free development and equality.}` },
          { id: 'fr-anti-f4', name: '2.f4', pgn: `
            e4 e6
            f4 {Aggressive, but it weakens e3 and the kingside.}
            d5
            e5
            c5 {Same lever as always.}
            Nf3
            Nc6
            c3
            Nh6 {Knight to f5 — a superb outpost now that White's f-pawn has moved.}` },
        ],
      },
    ],
  },
  {
    id: 'vsfrench', name: 'Beat the French', side: 'w', icon: '♔',
    blurb: 'You are White and your opponent plays the French. Nothing can stop 1…e6 — but the Advance Variation cramps Black and gives lots of chances to go wrong. Start with 📚 Basics.',
    lessons: [
      {
        id: 'vf-l1', title: '1. Can you stop the French?', steps: [
          { moves: '', task: 'e4',
            text: 'Honest answer: no move order can stop your opponent playing 1…e6. But YOU decide what kind of French it becomes. Start with 1.e4.' },
          { moves: 'e4 e6', task: 'd4',
            text: 'Black plays the French. Take the whole centre with 2.d4.' },
          { moves: 'e4 e6 d4 d5', task: 'e5', arrows: ['e4e5'],
            text: 'Black attacks e4. Your weapon is the <b>Advance Variation</b>: push 3.e5!',
            done: 'Look at what this does: f6 is taken away from Black\'s knight, your pawn cramps Black\'s kingside, and Black\'s c8 bishop stays locked behind e6. Black has fewer good squares — and many players don\'t know what to do here.' },
        ],
      },
      {
        id: 'vf-l2', title: '2. Your Advance plan', steps: [
          { moves: 'e4 e6 d4 d5 e5 c5', task: 'c3', marks: ['d4'],
            text: 'Black always hits the base of your chain with …c5. Keep the chain alive: support d4 with 4.c3, so if Black ever takes on d4 you recapture with a pawn.' },
          { moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6', task: 'Nf3',
            text: 'Black adds a second attacker on d4. Add a defender that also develops: 5.Nf3.' },
          { moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6', task: 'a3', arrows: ['a2a3', '!b6b2'],
            text: 'Black\'s queen hits d4 and b2. Play 6.a3! — it prepares b4, grabbing queenside space and making room for your bishop on b2.',
            done: 'Notice b2 is safe: your c1 bishop guards it, so …Qxb2?? Bxb2 drops the queen.' },
          { moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 c4 Nbd2 Na5 Rb1', arrows: ['f1d3', 'd1e2'],
            text: '<b>Middlegame plan:</b> hold d4 and e5 — never let Black take them for free. Then attack on the kingside where your space is: Be2/Bd3, O-O, Re1, sometimes h4 and Ng5. If Black plays …f6, look at exf6 or keeping e5 with Bf4, and watch for Qh5+ tricks.' },
        ],
      },
      {
        id: 'vf-l3', title: '3. Punish common mistakes', steps: [
          { moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 cxd4 cxd4 Nxd4', task: 'Qxd4', marks: ['d4'],
            text: 'Black grabbed d4 with the knight. Count the defenders: your knight AND your queen guard d4, so the knight is just hanging. Take it — but with which piece? Take with the QUEEN.',
            done: 'Qxd4! Now if …Qxd4 Nxd4 the queens come off and you are a whole knight up. (Nxd4 would also win a piece, but Black gets …Bc5 pinning your knight — Stockfish rates Qxd4 clearly better.)' },
          { moves: 'e4 e6 d4 d5 e5 f6', task: 'Bd3', marks: ['e8', 'h5'],
            text: 'Black hits e5 too early with …f6, before …c5. This weakens the diagonal from h5 to the black king. Develop with Bd3 and get ready for Qh5+.' },
          { moves: 'e4 e6 d4 d5 e5 f6 Bd3 fxe5', task: 'Qh5+', arrows: ['d1h5'],
            text: 'Black took the pawn. Punish it: Qh5+!' },
          { moves: 'e4 e6 d4 d5 e5 f6 Bd3 fxe5 Qh5+ g6', task: 'Bxg6+', arrows: ['d3g6'],
            text: 'Black blocks with …g6. Smash through: Bxg6+! If the h-pawn takes, the rook on h8 is left unprotected.' },
          { moves: 'e4 e6 d4 d5 e5 f6 Bd3 fxe5 Qh5+ g6 Bxg6+ hxg6', task: 'Qxh8', arrows: ['h5h8'],
            text: 'Black took the bishop. Don\'t play Qxg6+ (that lets Black escape) — take the ROOK: Qxh8!',
            done: 'You win a whole rook. Stockfish rates this about +4 for you.' },
        ],
      },
    ],
    groups: [
      {
        name: 'Advance — main lines',
        plan: 'Keep d4 and e5. Gain queenside space with a3/b4, develop Bd3 or Be2, castle, then attack on the kingside (Re1, Nbd2-f1-g3, h4). Trade Black\'s best knight (on f5) with Bxf5 when it helps.',
        lines: [
          { id: 'vf-a3-c4', name: '5…Qb6 6.a3 c4', pgn: `
            e4 {Take the centre.}
            e6 {The French. Black prepares …d5.}
            d4 {Build the full centre.}
            d5
            [exd5: That's the Exchange — it frees Black's c8 bishop and gives a dull, equal game. Push with e5 instead.]
            e5 {The Advance! Gain space, take f6 from Black's knight, and keep Black's c8 bishop buried behind e6.}
            c5 {Black hits the base of your chain.}
            [dxc5: This gives up the base of your chain — Black regains the pawn with …Nc6 and …Bxc5 and your e5 pawn becomes weak.]
            c3 {Support d4 with a pawn so you can always recapture cxd4.}
            Nc6
            Nf3 {Third defender of d4, and it develops a piece.}
            Qb6 {The queen joins the attack on d4 and b2.}
            a3 {Prepare b4: space on the queenside and a route for your dark bishop to b2. (b2 is safe — Bc1 guards it.)}
            c4 {Black locks the queenside. Now there is no more pressure on d4!}
            Nbd2 {Cover b3 so Black's knight can't land there, and keep an eye on c4.}
            Na5
            Rb1 {Prepare b4 anyway. Then Be2, O-O and a kingside attack with your extra space.}` },
          { id: 'vf-a3-nh6', name: '6.a3 Nh6', pgn: `
            e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3
            Nh6 {Black aims for …Nf5 to hit d4.}
            b4 {Gain space with tempo — it hits c5.}
            cxd4
            Bxh6 {In-between move! Take the knight before recapturing on d4. Black's kingside pawns get doubled.}
            gxh6
            cxd4 {Now recapture. Black's kingside is broken and d4 is solid. Plan: Bd3, O-O, Nc3.}` },
          { id: 'vf-a3-bd7', name: '6.a3 Bd7', pgn: `
            e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3
            Bd7 {Black prepares …c4 or …Rc8.}
            b4 {Space first — the c5 pawn is challenged.}
            cxd4
            cxd4 {Recapture with the pawn; the c3 square is free for your knight.}
            Nge7
            Nc3 {Develop, guard d5 and b5. Plan: Bd3, O-O, Na4/Bb2.}` },
          { id: 'vf-a3-a5', name: '6.a3 a5', pgn: `
            e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3
            a5 {Black stops b4.}
            Bd3 {Develop toward Black's kingside instead.}
            Bd7
            Bc2 {Keep the bishop — it points at h7. Don't let Black trade it off with …Bb5.}` },
          { id: 'vf-a3-cxd4', name: '6.a3 cxd4', pgn: `
            e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3
            cxd4 {Black releases the tension.}
            cxd4 {Recapture with the pawn — the centre stays.}
            Nge7
            Bd3 {Develop toward the kingside.}
            Nf5
            Bxf5 {Trade off Black's best piece.}
            exf5
            Nc3 {Black has doubled f-pawns and a weak d5. Plan: O-O, Ne2-f4 and pressure d5.}` },
          { id: 'vf-bd7', name: '5…Bd7', pgn: `
            e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3
            Bd7 {Black delays …Qb6.}
            a3 {Same idea — prepare b4.}
            Qb6 {Back to the 6.a3 Bd7 line by transposition.}
            b4 cxd4 cxd4 Nge7 Nc3` },
          { id: 'vf-nge7', name: '5…Nge7', pgn: `
            e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3
            Nge7 {Black heads for f5.}
            Na3 {The knight goes to b5 or c2, hitting d4/d6 and guarding d4.}
            cxd4
            Nb5 {Hit d4 and the d6 square instead of recapturing at once.}
            Nf5
            Nbxd4 {Pawn back, with a well-placed knight on d4.}` },
          { id: 'vf-nh6', name: '5…Nh6', pgn: `
            e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3
            Nh6 {Black heads for f5 early.}
            Bxh6 {Take it! Black's kingside pawns get wrecked.}
            gxh6
            Bb5 {Pin the knight on c6 and prepare to castle. Black's king has no safe home.}` },
          { id: 'vf-qb6-first', name: '4…Qb6', pgn: `
            e4 e6 d4 d5 e5 c5 c3
            Qb6 {Queen first.}
            Nf3 {Same plan.}
            Nc6 {Transposes to the main line.}
            a3 c4 Nbd2 Na5 Rb1` },
          { id: 'vf-bb4', name: '4…cxd4 5.cxd4 Bb4+', pgn: `
            e4 e6 d4 d5 e5 c5 c3
            cxd4 {Early release.}
            cxd4 {Recapture with the pawn — your centre stays intact.}
            Bb4+
            Nc3 {Block with development.}
            Nc6
            Nf3
            Nge7
            Bd3 {Natural development; castle next and use your extra space.}` },
          { id: 'vf-b6', name: '3…b6', pgn: `
            e4 e6 d4 d5 e5
            b6 {Black wants to trade off the bad bishop with …Ba6.}
            Nf3
            Ba6
            Bxa6 {Trade on your terms — Black's knight ends up on the rim.}
            Nxa6
            Qe2 {Hit the knight on a6 — it has to go back.}
            Nb8
            O-O {Well ahead in development, with more space.}` },
        ],
      },
      {
        name: 'Punish mistakes',
        plan: 'You won material. Now trade pieces (not pawns), keep your king safe, and don\'t give Black counterplay. A piece up, simple chess wins.',
        lines: [
          { id: 'vf-trap-nxd4', name: '…Nxd4?? loses a piece', pgn: `
            e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 cxd4 cxd4
            Nxd4 {A blunder: d4 is defended twice (knight and queen).}
            Qxd4 {Take with the QUEEN! It offers a queen trade, and after …Qxd4 Nxd4 you are simply a knight up. (Taking with the knight is weaker — Black gets …Bc5 pressure on your pinned knight.)}
            Qxd4
            Nxd4 {A clean extra knight. Trade pieces and the game is won.}` },
          { id: 'vf-trap-qxb2', name: '…Qxb2?? drops the queen', pgn: `
            e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3
            Qxb2 {Greedy — but the c1 bishop guards b2.}
            Bxb2 {Thank you! A whole queen.}` },
          { id: 'vf-trap-f6', name: '3…f6?! — Qxh8 trick', pgn: `
            e4 e6 d4 d5 e5
            f6 {Too early: it weakens the h5-e8 diagonal.}
            Bd3 {Develop and aim at the king. Qh5+ is in the air.}
            fxe5
            Qh5+ {Check! The black king is exposed.}
            g6
            Bxg6+ {Smash! If …hxg6, the h8 rook is undefended.}
            hxg6
            Qxh8 {Take the rook — a whole rook up.}` },
          { id: 'vf-trap-f6-kd7', name: '3…f6?! — Black defends best', pgn: `
            e4 e6 d4 d5 e5 f6 Bd3 fxe5 Qh5+ g6 Bxg6+
            Kd7 {Black's best: don't take the bishop.}
            Nf3 {Develop and attack e5. Black's king is stuck in the centre — you are clearly better.}` },
          { id: 'vf-trap-f6-ke7', name: '3…f6?! — 5…Ke7', pgn: `
            e4 e6 d4 d5 e5 f6 Bd3 fxe5 Qh5+
            Ke7 {The king runs.}
            Bg5+ {Bring in another attacker with check.}
            Nf6
            dxe5 {The f6 knight is pinned and attacked. Black is close to lost (+4).}` },
        ],
      },
      {
        name: "Black's early sidelines",
        plan: 'Black avoided the main French. Keep it simple: grab the centre, develop quickly, castle, and use your space.',
        lines: [
          { id: 'vf-benoni', name: '2…c5 Franco-Benoni', pgn: `
            e4 e6 d4
            c5 {Black switches to a Benoni-style set-up.}
            d5 {Gain space — drive into Black's camp.}
            exd5
            exd5
            d6
            Nf3 {Develop and keep options for c4.}
            Be7
            c4 {Grab more space — your d5 pawn is now rock solid and Black's position is cramped.}
            Nf6
            Nc3 {Develop. Plan: Bd3, O-O, Re1 and keep Black squeezed.}` },
          { id: 'vf-owen', name: '2…b6', pgn: `
            e4 e6 d4
            b6 {Black fianchettoes the queen's bishop.}
            Nf3
            Bb7 {Pressure on e4.}
            Bd3 {Defend e4 with a piece.}
            c5
            c3
            Nf6
            Qe2 {e4 is solid. Castle, then push e5 when ready.}` },
          { id: 'vf-nf6', name: '2…Nf6', pgn: `
            e4 e6 d4
            Nf6 {Attacking e4 with a piece.}
            e5 {Kick the knight!}
            Nd5
            c4 {Kick it again — you gain space with tempo.}
            Nb6
            Nf3
            d6
            Nc3 {A big centre and easy development.}` },
        ],
      },
    ],
  },
];
