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
  {
    id: 'italian', name: 'Italian Game', side: 'w', icon: '♗',
    blurb: 'You are White: 1.e4 e5 2.Nf3 Nc6 3.Bc4. Fast development, a bishop aimed at f7, and lots of traps for the opponent. Start with 📚 Basics.',
    lessons: [
      {
        id: 'it-l1', title: '1. The Italian idea', steps: [
          { moves: '', task: 'e4',
            text: 'Three rules win most beginner openings: <b>1)</b> take the centre with a pawn, <b>2)</b> develop knights and bishops quickly, <b>3)</b> castle early. Start with 1.e4.' },
          { moves: 'e4 e5', task: 'Nf3', arrows: ['g1f3'],
            text: 'Black mirrors you with 1…e5. Develop a knight AND attack the e5 pawn at the same time: 2.Nf3.',
            done: 'Every good opening move does two jobs. Nf3 develops and makes Black defend e5.' },
          { moves: 'e4 e5 Nf3 Nc6', task: 'Bc4', arrows: ['f1c4'], marks: ['f7'],
            text: 'Black defends e5 with the knight. Now put your bishop on its best diagonal: 3.Bc4 — the Italian Game.',
            done: 'The bishop points straight at <b>f7</b>. Before castling, f7 is Black\'s weakest square: only the king defends it. Many quick wins happen on f7.' },
          { moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5', arrows: ['e1g1', 'c2c3', 'd2d4'], marks: ['f7', 'f2'],
            text: 'Your next jobs: castle (O-O) so your king is safe and your rook joins, then play c3 and d4 (or the quieter d3) to fight for the centre.<br><br>Black has the same ideas: Black\'s bishop on c5 aims at <b>your</b> f2. So don\'t leave your king in the middle, and don\'t bring your queen out early just to chase pawns.' },
        ],
      },
      {
        id: 'it-l2', title: '2. The plan: c3, then d3 or d4', steps: [
          { moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5', task: 'c3', arrows: ['c2c3'], marks: ['d4'],
            text: 'Black copied you with 3…Bc5 (the Giuoco Piano). You want a pawn on d4, but d4 is covered by Black\'s bishop and e5 pawn. Prepare it: 4.c3!',
            done: 'Now if you play d4 and Black takes, you recapture with the c-pawn and keep TWO pawns in the centre.' },
          { moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6', task: 'd3', arrows: ['!f6e4'],
            text: 'Black attacks your e4 pawn. The calm way (the "Giuoco Pianissimo", the very quiet game) is to defend it with a pawn: 5.d3.',
            done: 'e4 is safe, your dark bishop can come out, and you can castle next move. Slow but very solid — and the top players use it too.' },
          { moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O', arrows: ['f1e1', 'c4b3', 'h2h3', 'b1d2'],
            text: '<b>Middlegame plan after d3:</b> Re1 (supports e4), Bb3 (keeps the bishop safe from …Na5 or …d5 attacks), h3 (stops …Bg4 pinning your knight), then Nbd2-f1-g3 bringing the knight toward Black\'s king. When everything is ready, push d3-d4.' },
          { moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2 d5', marks: ['d4'],
            text: 'The sharper way is 5.d4 at once. After trades you often get an <b>isolated d4 pawn</b> (no pawns beside it). It gives your pieces lots of space and attacking chances — but if all the pieces get traded it can become weak. With an isolated pawn: attack, don\'t trade.' },
        ],
      },
      {
        id: 'it-l3', title: '3. Two Knights & the Fried Liver', steps: [
          { moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6', task: 'Ng5', arrows: ['f3g5', 'c4f7'], marks: ['f7'],
            text: 'Black plays 3…Nf6 (the Two Knights) and attacks e4. The safe answer is 4.d3. The wild answer is 4.Ng5!? — the knight AND the bishop now attack f7. Try it: play 4.Ng5.',
            done: 'f7 is attacked twice and defended only once (by the king). Black has to block with …d5.' },
          { moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5', task: 'exd5', arrows: ['e4d5'],
            text: 'Black blocks the bishop\'s line to f7 with 4…d5. Take the pawn: 5.exd5.' },
          { moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5', task: 'Nxf7', arrows: ['g5f7'], marks: ['d5', 'e8'],
            text: 'Black took back with the knight — the most common beginner mistake here! Now comes the <b>Fried Liver Attack</b>: sacrifice your knight on f7 to drag the king out. Play 6.Nxf7!',
            done: 'The knight attacks the queen and the rook. Black more or less has to take it with the king.' },
          { moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7 Kxf7', task: 'Qf3+', arrows: ['d1f3'], marks: ['d5'],
            text: 'The king took. Now check it AND hit the d5 knight twice: 7.Qf3+!',
            done: 'The king has to go to e6 to keep protecting the knight on d5 (it is pinned to the king by your bishop). Next Nc3 piles on d5 — Black\'s king is stuck in the middle of the board. Stockfish rates this about +1.5 for you.' },
          { moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5', task: 'Bb5+', arrows: ['!a5c4'],
            text: 'Strong players don\'t take with the knight — they play 5…Na5!, attacking your bishop. Play 6.Bb5+ (check, and the bishop is safe).',
            done: 'You will be a pawn up, but Black gets fast development for it. That is why 4.Ng5 is a gamble: great against beginners, but Stockfish says the quiet 4.d3 is the safer choice.' },
        ],
      },
      {
        id: 'it-l4', title: '4. Traps: set them, don\'t fall in', steps: [
          { moves: 'e4 e5 Nf3 Nc6 Bc4 Nd4', marks: ['e5', 'd4'], arrows: ['!f3e5', '!d8g5'],
            text: '<b>The Blackburne Shilling trap.</b> Black\'s 3…Nd4 looks like a mistake — e5 seems free. But 4.Nxe5?? Qg5! attacks your knight AND g2, and after 5.Nxf7?? Qxg2 6.Rf1 Qxe4+ 7.Be2 Nf3# is checkmate. Lesson: when a piece is offered for free, ask WHY.' },
          { moves: 'e4 e5 Nf3 Nc6 Bc4 Nd4', task: 'Nxd4', arrows: ['f3d4'],
            text: 'The right answer: trade the annoying knight. Play 4.Nxd4.',
            done: 'After 4…exd4 5.O-O you are ahead in development and Black\'s pawn on d4 is in the way. Black wasted time with the knight.' },
          { moves: 'e4 e5 Nf3 d6 Bc4 Bg4 h3 Bh5 Nc3 Nc6', task: 'Nxe5', arrows: ['f3e5'], marks: ['h5', 'f7'],
            text: '<b>The Légal Trap.</b> Black pinned your knight to your queen and then made a slow move. The pin is not real! Play 6.Nxe5!',
            done: 'If Black grabs your queen with 6…Bxd1??, then 7.Bxf7+ Ke7 8.Nd5# is checkmate with three minor pieces. If 6…Nxe5 7.Qxh5 — you win a pawn anyway.' },
          { moves: 'e4 e5 Nf3 d6 Bc4 Bg4 h3 Bh5 Nc3 Nc6 Nxe5 Bxd1 Bxf7+ Ke7', task: 'Nd5#', arrows: ['c3d5'],
            text: 'Black took the queen and got a lot of trouble. Finish it: 8.Nd5 is checkmate!',
            done: 'Checkmate — with a queen down! Remember the pattern: bishop on f7, knights on e5 and d5.' },
          { moves: 'e4 e5 Nf3 Nf6 Nxe5 Nxe4 Qe2 Nf6', task: 'Nc6+', arrows: ['e5c6', '!e2e8'],
            text: '<b>Petrov trap.</b> Black copied you with 3…Nxe4 and after 4.Qe2 retreated 4…Nf6?? — but the e-file is open. Move your knight with a DISCOVERED CHECK that also attacks the queen: 5.Nc6+!',
            done: 'Black has to deal with the check from your queen, and next you take the queen on d8. Copying moves is dangerous!' },
        ],
      },
    ],
    groups: [
      {
        name: 'Giuoco Piano (3…Bc5)',
        plan: 'Castle, Re1, Bb3 and h3, then bring the b1 knight round to g3 (Nbd2-f1-g3). Push d3-d4 when your pieces are ready. Keep the bishop on the a2-g8 diagonal aimed at f7. Don\'t start attacking before you have castled.',
        lines: [
          { id: 'it-gp-d3', name: '5.d3 — the quiet main line', pgn: `
            e4 {Take the centre and open lines for your queen and bishop.}
            e5 {Black stakes an equal claim in the centre.}
            Nf3 {Develop AND attack e5.}
            Nc6 {The natural defence: develop a knight and protect e5.}
            Bc4 {The Italian Game. The bishop aims at f7, the weakest point in Black's camp (only the king guards it).}
            Bc5 {The Giuoco Piano ("quiet game"): Black copies you and aims at YOUR f2.}
            [Nxe5: e5 is protected by the c6 knight. After 4…Nxe5 you are just a piece down — and the "fork trick" 5.d4 fails to 5…Bxd4.]
            c3 {Prepare d4: if Black ever takes on d4, you recapture with this pawn and keep a big centre.}
            Nf6 {Develop and attack your e4 pawn.}
            d3 {Defend e4 with a pawn. This is the Giuoco Pianissimo — the "very quiet game". Solid, safe and full of hidden ideas.}
            d6 {Black also supports the centre.}
            O-O {Castle: your king is safe and the rook comes toward the centre.}
            O-O
            Re1 {The rook supports e4 and gets ready for a later d4 that opens the centre.}
            a6 {Black makes a hole for the bishop on a7, so it can't be chased by b4 or d4.}
            Bb3 {Same idea: step back before Black's …Na5 or …d5 can hit the bishop. It still aims at f7.}
            Ba7
            h3 {Stop …Bg4 pinning your knight to your queen. Now the knight on f3 is free to move.}
            Re8 {Black copies you.}
            Nbd2 {Next Nf1 and Ng3 — the knight heads for the kingside, where Black's king lives.}` },
          { id: 'it-gp-d3-o-o', name: '5.d3 O-O 6.O-O d5', pgn: `
            e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3
            O-O {Black castles first.}
            O-O
            d5 {Black strikes in the centre and attacks your bishop.}
            exd5 {Take: the d5 pawn is attacking c4 and e4, so remove it.}
            Nxd5
            Re1 {Hit e5! It is now protected only by the c6 knight, and your rook is on the open e-file. Next Nbd2-e4 or b4.}` },
          { id: 'it-gp-d4', name: '5.d4 — the sharp centre', pgn: `
            e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6
            d4 {The sharper way: build the centre right now. (5.d3 is the quieter choice.)}
            exd4 {Black takes — it has to, or you push d5/dxe5.}
            cxd4 {Recapture with the pawn: two pawns in the centre.}
            Bb4+ {Black's bishop has to leave c5 anyway, so it checks on the way.}
            Bd2 {Block with a piece and offer a trade.}
            Bxd2+
            Nbxd2 {Take back with the b1 knight — it develops and protects e4.}
            d5 {Black breaks your centre before you can play e5.}
            exd5 {Take. Your d4 pawn is now isolated — but your pieces get open lines.}
            Nxd5
            Qb3 {Hit the d5 knight and the b7 pawn at the same time.}
            Nce7 {The knight protects d5 from e7.}
            O-O {Castle. Plan: Rfe1 and Rac1, use the open files, and keep pieces on the board — the isolated pawn is strong while there are pieces to attack with.}` },
          { id: 'it-gp-d6', name: '4…d6 — take the centre', pgn: `
            e4 e5 Nf3 Nc6 Bc4 Bc5 c3
            d6 {Black supports e5 but blocks the bishop's retreat path a bit.}
            d4 {Now d4 comes with no danger: take the whole centre.}
            exd4
            cxd4
            Bb6 {The bishop steps back but stays on the diagonal.}
            Nc3 {Develop and protect e4.}
            Nf6
            h3 {Stop …Bg4. Next O-O, Re1 — you have the big centre and easy development.}` },
        ],
      },
      {
        name: 'Two Knights (3…Nf6)',
        plan: 'In the quiet 4.d3 lines: O-O, Re1, c3, Bb3, h3 and Nbd2-f1-g3, just like the Giuoco Piano. In the wild 4.Ng5 lines: if you won material, finish developing before attacking; if Black has a pawn for nothing, keep pieces coordinated and look at Black\'s king.',
        lines: [
          { id: 'it-tk-d3', name: '4.d3 — the safe line', pgn: `
            e4 e5 Nf3 Nc6 Bc4
            Nf6 {The Two Knights Defence: Black attacks e4 instead of copying with …Bc5.}
            d3 {The calm answer: defend e4 with a pawn and keep everything safe. (4.Ng5 is the wild option — see the other lines.)}
            Be7 {A quiet set-up for Black.}
            O-O
            O-O
            Re1 {Support e4. You have more central control.}
            d6
            c3 {Prepare d4 and give your bishop a retreat square on c2. Then Bb3, h3, Nbd2-f1-g3.}` },
          { id: 'it-tk-d3-bc5', name: '4.d3 Bc5 — same as the Giuoco', pgn: `
            e4 e5 Nf3 Nc6 Bc4 Nf6 d3
            Bc5 {The bishop goes to c5 after all.}
            c3 {This is exactly the Giuoco Pianissimo position from 3…Bc5 4.c3 Nf6 5.d3 — a transposition. Same plan!}
            d6 O-O O-O Re1 a6 Bb3 Ba7 h3` },
          { id: 'it-tk-ng5', name: '4.Ng5 d5 5.exd5 Na5 — main line', pgn: `
            e4 e5 Nf3 Nc6 Bc4 Nf6
            Ng5 {The aggressive try: knight and bishop both hit f7.}
            d5 {The only good defence: block the bishop.}
            exd5 {Take, and now d5 is attacked again.}
            Na5 {Black's best: attack your bishop instead of taking back.}
            [d3: Possible, but 6.Bb5+ is the main move — it gains time with check.]
            Bb5+ {Check, and the bishop gets out of danger.}
            c6 {Black blocks and attacks your d5 pawn.}
            dxc6 {Take: you'll be a pawn up.}
            bxc6
            Be2 {Retreat. The bishop stays safe and guards your kingside.}
            h6 {Black kicks your g5 knight.}
            Nf3 {Back home.}
            e4 {Black kicks it again — this is Black's compensation for the pawn: fast development and space.}
            Ne5 {The knight finds a great central square.}
            Bd6 {Black develops with an eye on e5.}
            d4 {Support the knight and open lines for your c1 bishop.}
            exd3 {Black takes "en passant"! (A pawn that just moved two squares can be taken as if it moved one.)}
            Nxd3 {Recapture. You are a pawn up — now castle, play b3 and Bb2 and keep everything protected.}` },
          { id: 'it-tk-fried', name: '5…Nxd5? Fried Liver Attack', pgn: `
            e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5
            Nxd5 {A natural mistake! The knight on d5 is now a target.}
            Nxf7 {The Fried Liver! Sacrifice the knight to pull Black's king into the open. It attacks the queen and rook too.}
            Kxf7
            Qf3+ {Check — and the d5 knight is attacked twice (queen and bishop). It is pinned to the king.}
            Ke6 {The king must stay close to defend d5. Any other move loses the knight.}
            Nc3 {Pile up on the pinned knight: three attackers on d5.}
            Nb4 {Black defends d5 with another knight and threatens …Nxc2+.}
            Qe4 {Protect c2 (so …Nxc2+ can be answered by Qxc2) and keep the king boxed in. Black's king is stuck on e6.}
            c6
            a3 {Kick the b4 knight away. When the defenders of d5 go, d5 falls and Black's king has no shelter. Next d4 opens even more lines.}` },
          { id: 'it-tk-fried-kg8', name: 'Fried Liver: 7…Kg8?? mate', pgn: `
            e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7 Kxf7 Qf3+
            Kg8 {This hides the king — but it leaves d5 defended only by the queen.}
            Bxd5+ {Check with the bishop!}
            Qxd5
            Qxd5+ {Check again — the queen comes in.}
            Be6
            Qxe6# {Checkmate! The bishop on f8 blocks the king's only escape square.}` },
          { id: 'it-tk-traxler', name: '4.Ng5 Bc5!? Traxler', pgn: `
            e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5
            Bc5 {The Traxler: Black ignores f7 and counter-attacks f2. Very tricky, but Stockfish says it is a mistake — f7 really falls.}
            Bxf7+ {Take with the bishop and check — the simple, safe way. (Nxf7 wins more in theory, but after …Bxf2+! the position gets crazy.)}
            Ke7 {The king can't take: Bxf7+ comes with check and the g5 knight guards f7.}
            Bb3 {Retreat to safety. You are a pawn up and Black's king has lost the right to castle. Next O-O, d3, Nc3.}` },
        ],
      },
      {
        name: 'Hungarian & Blackburne Shilling',
        plan: 'Black played passively (3…Be7) or wasted time (3…Nd4). Grab the centre with d4, develop fast, castle, and use your lead. Don\'t grab pawns that are offered for free without checking why.',
        lines: [
          { id: 'it-hu-exd4', name: '3…Be7 Hungarian 4.d4 exd4', pgn: `
            e4 e5 Nf3 Nc6 Bc4
            Be7 {The Hungarian: very solid, but passive — the bishop doesn't attack anything from e7.}
            d4 {Black didn't fight for d4, so take it now.}
            exd4
            Nxd4 {Recapture with the knight: a strong piece in the centre.}
            Nf6
            Nc3 {Develop and protect e4.}
            O-O
            O-O {Castle. You have more space and freer pieces. Plan: Re1, Bf4 or Be3, Qd2.}` },
          { id: 'it-hu-d6', name: '3…Be7 4.d4 d6', pgn: `
            e4 e5 Nf3 Nc6 Bc4 Be7 d4
            d6 {Black holds e5 with a pawn.}
            d5 {Gain space with tempo: the c6 knight is attacked.}
            Nb8 {The knight has to go back home. Black has lost time.}
            Bd3 {Keep the bishop safe and protect e4. Next c4, Nc3, O-O — a big space advantage.}` },
          { id: 'it-bs', name: '3…Nd4?! Blackburne Shilling', pgn: `
            e4 e5 Nf3 Nc6 Bc4
            Nd4 {A trap! It looks like it just gives away e5. Objectively it wastes time — IF you don't fall for it.}
            [Nxe5: The Blackburne Shilling trap: 4…Qg5! attacks your knight and g2. If 5.Nxf7?? Qxg2 6.Rf1 Qxe4+ 7.Be2 Nf3# is checkmate.]
            Nxd4 {Trade the annoying knight. Simple and strong.}
            exd4
            O-O {Castle. Black's d4 pawn blocks Black's own pieces.}
            Nf6
            Re1 {The rook hits e-file and protects e4. You're ahead in development; next c3 or d3 and Bb3.}` },
        ],
      },
      {
        name: 'Black avoids 2…Nc6',
        plan: 'Black played a less common second move. Keep following the rules: centre, develop, castle. Watch for tactics on f7 and on the e-file — they are often the quickest way to an advantage.',
        lines: [
          { id: 'it-ph-nf6', name: '2…d6 Philidor 3.Bc4 Nf6', pgn: `
            e4 e5 Nf3
            d6 {The Philidor: solid, but it blocks Black's f8 bishop.}
            Bc4 {Same Italian idea: aim at f7.}
            Nf6
            Nc3 {Develop and defend e4.}
            Be7
            d4 {Now take the centre.}
            exd4
            Nxd4
            O-O
            O-O {Castle. You have more space; plan Re1, Bf4, Qd2 or f4.}` },
          { id: 'it-ph-bg4', name: '2…d6 3.Bc4 Bg4 4.h3 Bxf3', pgn: `
            e4 e5 Nf3 d6 Bc4
            Bg4 {Pins your knight to your queen.}
            h3 {Ask the bishop at once.}
            Bxf3
            Qxf3 {Recapture with the queen: now queen AND bishop look at f7!}
            Qd7 {The only good way to stop the threats. (5…Nf6? 6.Qb3! attacks f7 and b7 at once.)}
            d3 {Protect e4 calmly.}
            Nf6
            O-O {Castle. You have the two bishops — open the position (c3, d4) to make them strong.}` },
          { id: 'it-legal', name: 'Légal Trap 4…Bh5 5.Nc3 Nc6?', pgn: `
            e4 e5 Nf3 d6 Bc4 Bg4 h3
            Bh5 {Black keeps the pin.}
            Nc3 {Develop. Now the trap is set.}
            Nc6 {Looks natural, but it allows a famous trick.}
            Nxe5 {The Légal Trap! Ignore the "pin" — if Black takes your queen, it is mate.}
            Bxd1 {Greedy!}
            [Kxd1: Don't take back! You have a checkmate: Bxf7+ and Nd5#.]
            Bxf7+ {Check! The king has only one square.}
            Ke7
            Nd5# {Checkmate with three minor pieces against a queen up.}` },
          { id: 'it-legal-nxe5', name: 'Légal Trap: Black takes the knight', pgn: `
            e4 e5 Nf3 d6 Bc4 Bg4 h3 Bh5 Nc3 Nc6 Nxe5
            Nxe5 {Black's best: take the knight instead of the queen.}
            Qxh5 {Your queen takes the bishop — it was unprotected.}
            Nxc4 {Black takes your bishop.}
            Qb5+ {Check and fork: the king and the c4 knight are both attacked.}
            c6
            Qxc4 {You have won a pawn and Black's king can't castle easily. Next d3, O-O.}` },
          { id: 'it-petrov', name: '2…Nf6 Petrov', pgn: `
            e4 e5 Nf3
            Nf6 {The Petrov: Black counter-attacks your e4 pawn.}
            Nxe5 {Take first — e5 is undefended.}
            d6 {Correct: kick the knight before taking e4.}
            [Nxf7: The Cochrane Gambit — a piece for two pawns. Fun, but Stockfish says it is unsound. Retreat the knight.]
            Nf3 {Back to safety.}
            Nxe4 {Now Black takes your pawn.}
            d4 {Take the centre. Black's knight on e4 will be chased by Bd3, O-O, Re1, c4.}
            d5
            Bd3 {Develop with an attack on e4. Next O-O, Re1 and c4.}` },
          { id: 'it-petrov-trap', name: 'Petrov: 3…Nxe4? 4.Qe2', pgn: `
            e4 e5 Nf3 Nf6 Nxe5
            Nxe4 {Copying is a mistake here.}
            Qe2 {Attack the e4 knight and pin… the e-file now points at Black's king!}
            Nf6 {Blunder: the knight leaves and the e-file is open.}
            Nc6+ {Discovered check from your queen — and the knight attacks the queen on d8!}
            Be7
            Nxd8 {You win the queen.}` },
          { id: 'it-petrov-qe7', name: 'Petrov: 3…Nxe4? 4.Qe2 Qe7', pgn: `
            e4 e5 Nf3 Nf6 Nxe5 Nxe4 Qe2
            Qe7 {Black's best: block the e-file with the queen.}
            Qxe4 {Take the knight.}
            d6 {Black attacks your knight on e5 and pins it — your queen is behind it.}
            d4 {Protect the knight with a pawn. You have won a pawn and you're ahead in development.}` },
        ],
      },
      {
        name: 'Punish early queen moves',
        plan: 'Black\'s queen came out too early. Develop with tempo (attack the queen while bringing out pieces), take the centre and castle. Every time Black moves the queen again, you gain more time.',
        lines: [
          { id: 'it-qf6', name: '4…Qf6?! — kick the queen', pgn: `
            e4 e5 Nf3 Nc6 Bc4 Bc5 c3
            Qf6 {The queen protects e5 and eyes f2 — but it stands on a square your pawns can attack.}
            d4 {Open the centre while Black's queen is misplaced.}
            exd4
            e5 {Push with tempo — the queen is attacked!}
            Qg6 {The queen runs.}
            cxd4 {Now both your centre pawns are strong and the c5 bishop is attacked.}
            Bb4+
            Nc3 {Block and develop. You are clearly better: big centre, and Black's queen is still in the way.}` },
        ],
      },
    ],
  },
  {
    id: 'caro', name: 'Caro-Kann Defense', side: 'b', icon: '♝',
    blurb: 'You are Black and answer 1.e4 with 1…c6, then 2…d5. Rock-solid, and unlike the French your light bishop gets OUT before you play …e6. Start with 📚 Basics.',
    lessons: [
      {
        id: 'ck-l1', title: '1. What is the Caro-Kann?', steps: [
          { moves: 'e4', task: 'c6', arrows: ['c7c6'],
            text: 'White opens 1.e4. The Caro-Kann answer looks very modest: 1…c6. Play it.',
            done: 'It prepares …d5 — and when White\'s e4 pawn takes on d5, you can recapture with this c-pawn and keep a pawn in the centre.' },
          { moves: 'e4 c6 d4', task: 'd5', arrows: ['d7d5'],
            text: 'White takes the centre with 2.d4. Now strike: 2…d5, attacking e4.',
            done: 'Your d5 pawn is protected by c6. White has to decide what to do with the e4 pawn.' },
          { moves: 'e4 c6 d4 d5', marks: ['e4', 'd5'], arrows: ['!d5e4'],
            text: 'White has three main answers, and you\'ll learn each:<br>• <b>3.e5</b> push — the Advance: you play 3…Bf5!<br>• <b>3.Nc3</b> (or Nd2) defend — the Classical: you take 3…dxe4 and play …Bf5 with tempo<br>• <b>3.exd5</b> trade — the Exchange / Panov: you recapture …cxd5.' },
        ],
      },
      {
        id: 'ck-l2', title: '2. Bishop out BEFORE …e6', steps: [
          { moves: 'e4 c6 d4 d5 e5', task: 'Bf5', arrows: ['c8f5'], marks: ['e6'],
            text: 'White pushed past with 3.e5. Here is the big Caro-Kann idea: your light-squared bishop comes out <b>first</b>. Play 3…Bf5.',
            done: 'In the French you play …e6 early and that bishop is stuck behind it for the whole game. In the Caro-Kann it gets out first, and then …e6 builds a wall behind it.' },
          { moves: 'e4 c6 d4 d5 e5 Bf5 Nf3', task: 'e6', arrows: ['e7e6'],
            text: 'Now close the wall: 4…e6. It frees your f8 bishop and supports d5.',
            done: 'Your pawns on c6, d5 and e6 are solid, and your bishop is OUTSIDE the chain. Your pieces will go: knights to d7 and e7, dark bishop to e7, castle kingside.' },
          { moves: 'e4 c6 d4 d5 e5 Bf5 Nf3 e6 Be2 Nd7 O-O Ne7', arrows: ['c7c5', 'h7h6', 'e7g6'], marks: ['d4'],
            text: '<b>Your plan:</b> hit the base of White\'s pawn chain (d4) with …c5 — yes, the c-pawn moves twice, but now it does more. Play …h6 so your bishop always has h7 to hide on. Knights go to g6/f5 and c6 to attack d4 and e5.' },
        ],
      },
      {
        id: 'ck-l3', title: '3. The Classical: develop with tempo', steps: [
          { moves: 'e4 c6 d4 d5 Nc3', task: 'dxe4', arrows: ['d5e4'],
            text: 'White defends e4 with the knight. Just take it: 3…dxe4.',
            done: 'The knight takes back on e4 — and that gives your bishop a target.' },
          { moves: 'e4 c6 d4 d5 Nc3 dxe4 Nxe4', task: 'Bf5', arrows: ['c8f5'],
            text: 'Develop the bishop AND attack the knight: 4…Bf5.',
            done: 'That\'s "development with tempo": you bring out a piece and White has to spend a move on the knight.' },
          { moves: 'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3', task: 'Bg6', arrows: ['f5g6'],
            text: 'The knight hits your bishop. Step back to g6, where it still controls the b1-h7 diagonal.' },
          { moves: 'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4', task: 'h6', arrows: ['!h4h5', 'h7h6'], marks: ['g6', 'h7'],
            text: 'Danger! White threatens h5, and your bishop would be TRAPPED: h7 is blocked by your own pawn and f5 is covered by the g3 knight. Make an escape square: 6…h6.',
            done: 'Now if h5, the bishop drops back to h7. This is a key Caro-Kann pattern: always keep an escape square for that bishop.' },
        ],
      },
      {
        id: 'ck-l4', title: '4. Traps to avoid', steps: [
          { moves: 'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Qe2', marks: ['d6', 'e7'], arrows: ['!e4d6'],
            text: '<b>The famous smothered mate.</b> If Black plays 4…Nd7 (instead of our 4…Bf5) and White answers 5.Qe2, the natural 5…Ngf6?? loses at once: 6.Nd6 is checkmate! The e7 pawn can\'t take (it is pinned by the queen) and the king is surrounded by its own pieces. One more reason we play 4…Bf5.' },
          { moves: 'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Qe2 Ngf6 Nd6#', marks: ['d6', 'e8'],
            text: 'This is the final position. Checkmate on move 6 — it has happened in grandmaster games!' },
          { moves: 'e4 c6 d4 d5 e5 Bf5 g4', task: 'Be4', arrows: ['f5e4', '!g4f5'],
            text: 'Against the Advance, White sometimes storms with 4.g4, chasing your bishop. Don\'t panic: go to e4 — it\'s protected by your d5 pawn. Play 4…Be4.',
            done: 'White usually plays f3 to kick it again, which weakens White\'s own king. Your bishop then goes to g6.' },
          { moves: 'e4 c6 d4 d5 e5 Bf5 g4 Be4 f3 Bg6 h4', task: 'h5', arrows: ['!h4h5', 'h7h5'],
            text: 'Now White threatens h5 to trap your bishop. Stop it with 6…h5!',
            done: 'The bishop is safe, and White\'s pawns have left big holes around White\'s king.' },
          { moves: 'e4 c6 d4 d5 exd5 cxd5 Bd3 Nc6 c3 Nf6 Bf4 Bg4 Qb3', task: 'Na5', arrows: ['!b3b7', 'c6a5'], marks: ['b7'],
            text: 'In the Exchange Variation White\'s queen hits b7 (your bishop left c8, so b7 is undefended). Counter-attack: 7…Na5!',
            done: 'The queen has to move, and after 8.Qa4+ Bd7 9.Qc2 b7 is safe and your knight can come back to c6.' },
        ],
      },
    ],
    groups: [
      {
        name: 'Advance Variation (3.e5)',
        plan: 'Hit the base of White\'s chain with …c5, put knights on c6 and f5/g6 to attack d4, keep …h6 so the bishop has h7. Castle kingside when White\'s pieces are not aimed there. If White trades on c5, take back with the bishop.',
        lines: [
          { id: 'ck-adv-nf3', name: '4.Nf3 e6 5.Be2 — Short system', pgn: `
            e4 {White takes the centre.}
            c6 {The Caro-Kann. You prepare …d5 so the pawn on d5 is protected.}
            d4 {White builds the two-pawn centre.}
            d5 {Hit e4.}
            e5 {The Advance: White grabs space and takes f6 from your knight.}
            [Nf6: The e5 pawn controls f6 — 4.exf6 just wins your knight. Against the Advance your g8 knight goes to e7 instead. First get the bishop out with …Bf5.]
            Bf5 {The key move: the bishop gets out BEFORE you play …e6. (…e6 first would lock it in behind the pawn — exactly the French problem.)}
            Nf3 {Calm development.}
            e6 {Now build the wall. Your bishop is outside, your f8 bishop is free.}
            Be2 {White prepares to castle.}
            Nd7 {The knight goes to d7 (f6 is taken by the e5 pawn) and supports …c5 later.}
            O-O
            Ne7 {The other knight heads to g6 or f5 to attack d4 and e5.}
            Nbd2
            c5 {Hit the base of the chain. Now d4 is attacked by a pawn and White's centre must decide.}
            dxc5
            Nc6 {Your knights on c6 and d7 both attack e5 — you'll win back the c5 pawn or the e5 pawn.}
            Nb3
            Be7 {Develop and get ready to castle. Next …O-O and …Bxc5 or …Ndxe5. Equal and comfortable.}` },
          { id: 'ck-adv-bd3', name: '4.Bd3 — trade bishops', pgn: `
            e4 c6 d4 d5 e5 Bf5
            Bd3 {White offers to trade your good bishop.}
            Bxd3 {Take it: you're trading your "problem bishop" for White's good one.}
            Qxd3
            e6 {Build the wall.}
            Nf3
            c5 {Hit the base right away.}
            c3 {White supports d4.}
            Nc6 {Pressure on d4. Next …Qb6, …Nge7-f5 — same plan as the French Advance, but without the bad bishop!}` },
          { id: 'ck-adv-nc3-be3', name: '4.Nc3 e6 5.g4 — 8.Be3', pgn: `
            e4 c6 d4 d5 e5 Bf5
            Nc3 {White prepares an aggressive pawn storm.}
            e6
            g4 {Chase the bishop!}
            Bg6 {Step back but stay on the diagonal.}
            Nge2 {White plans Nf4 and h4-h5 to trap the bishop.}
            c5 {Counter-attack in the centre! When White attacks on the wing, hit back in the middle.}
            h4 {Threatening h5 to trap the bishop.}
            h6 {Make the escape square h7 — now h5 is answered by …Bh7.}
            Be3
            Ne7 {Heading to c6 to pile up on d4. Black is fine: White's pawns on g4 and h4 can become weak.}` },
          { id: 'ck-adv-nc3-h5', name: '4.Nc3 e6 5.g4 — 8.h5', pgn: `
            e4 c6 d4 d5 e5 Bf5 Nc3 e6 g4 Bg6 Nge2 c5 h4 h6
            h5 {White chases the bishop again.}
            Bh7 {Thanks to …h6 the bishop has a home.}
            f4 {White grabs more space.}
            Ne7 {Knight to c6 and keep hitting d4. White's pawns have run far forward — the squares behind them are weak.}` },
          { id: 'ck-adv-g4', name: '4.g4 Be4 — the pawn storm', pgn: `
            e4 c6 d4 d5 e5 Bf5
            g4 {White chases the bishop right away.}
            Be4 {Protected by d5. White has to spend another pawn move.}
            f3 {Kick it again — but this weakens White's king.}
            Bg6
            h4 {Threatening h5 to trap the bishop.}
            h5 {Stop it! Now h5 is impossible.}
            e6 {White tries to smash your position open — but this pawn sacrifice is a mistake, and Stockfish rates Black better after it.}
            Qd6 {Calm: the queen eyes g3 (a weak square after f3 and h4) and you will take back on f7 with the bishop.}
            exf7+
            Bxf7 {Black is better: White's kingside pawns are loose and White's king has no safe home.}` },
        ],
      },
      {
        name: 'Classical (3.Nc3 dxe4 4.Nxe4 Bf5)',
        plan: 'Finish development: …e6, …Ngf6, …Be7 or …Bd6, …Qc7, and castle — usually kingside, or queenside if White castled kingside. You have no weaknesses. Later free yourself with …c5 or …e5.',
        lines: [
          { id: 'ck-cl-main', name: 'Main line 6.h4 h6 7.Nf3', pgn: `
            e4 c6 d4 d5
            Nc3 {White defends e4 with the knight.}
            dxe4 {Take — e4 can't be held.}
            Nxe4
            Bf5 {Develop the bishop and hit the knight: development with tempo.}
            Ng3 {The knight attacks your bishop.}
            Bg6 {Step back; the bishop stays on its good diagonal.}
            h4 {White threatens h5 to trap the bishop.}
            [e6: Blunder! 7.h5 and your bishop on g6 is trapped — h7 is blocked by your own pawn and f5 is covered by the g3 knight.]
            h6 {Make an escape square: after h5 the bishop goes to h7.}
            Nf3
            Nd7 {The knight goes to d7 (not f6 yet) so that if White plays Ne5, you can trade it off.}
            h5
            Bh7
            Bd3 {White offers to trade the light-squared bishops.}
            Bxd3 {Trade. Your bishop has done its job.}
            Qxd3
            e6 {Build the wall and free your f8 bishop.}
            Bd2
            Ngf6 {Develop. You will castle after …Be7.}
            O-O-O
            Be7 {Solid. Next …O-O or …Qc7 and …O-O-O. White has a little space, but you have no weaknesses.}` },
          { id: 'ck-cl-bf4', name: 'Main line with 11.Bf4', pgn: `
            e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3 e6
            Bf4 {The bishop takes the h2-b8 diagonal.}
            Ngf6
            O-O-O
            Be7 {Develop and castle next. The same calm plan.}` },
          { id: 'ck-cl-nf3', name: '6.Nf3 Nd7', pgn: `
            e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6
            Nf3 {White develops first.}
            Nd7 {Same set-up: …Nd7, …e6, …Ngf6.}
            Bd3 {White offers a bishop trade.}
            e6 {Build the wall. If Bxg6 hxg6, your h-file opens for the rook.}` },
          { id: 'ck-cl-bc4', name: '6.Bc4 e6', pgn: `
            e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6
            Bc4 {White's bishop aims at e6 and f7.}
            e6 {Close the diagonal. Your pawn on e6 blunts the c4 bishop.}
            N1e2
            Nf6
            Nf4
            Bd6 {Challenge the f4 knight. Next …O-O and …Nbd7. Solid and equal.}` },
          { id: 'ck-cl-nd2', name: '3.Nd2 — same plan', pgn: `
            e4 c6 d4 d5
            Nd2 {Another way to defend e4.}
            dxe4 {Same answer.}
            Nxe4
            Bf5 {Exactly the same position as after 3.Nc3.}
            Ng3 Bg6` },
        ],
      },
      {
        name: 'Exchange & Panov (3.exd5)',
        plan: 'Exchange (4.Bd3): develop with …Nc6, …Nf6, …Bg4, …e6, …Bd6, castle, and play on the queenside with …Rc8 and the "minority attack" …b5-b4. Panov (4.c4): White gets an isolated d4 pawn — blockade it with a knight on d5, trade pieces, and attack it in the endgame.',
        lines: [
          { id: 'ck-ex-qb3', name: 'Exchange 4.Bd3 … 7.Qb3', pgn: `
            e4 c6 d4 d5
            exd5 {The Exchange Variation.}
            cxd5 {Recapture with the c-pawn — this was the point of 1…c6. You keep a central pawn.}
            Bd3 {White's bishop aims at h7.}
            Nc6 {Develop and pressure d4.}
            c3 {White supports d4.}
            Nf6 {Develop and protect h7 and the d5 pawn.}
            Bf4
            Bg4 {Your bishop gets out to an active square, pinning against the queen idea Qd1.}
            Qb3 {A double attack: b7 is undefended now that your bishop left c8, and d5 is hit too.}
            Na5 {Hit the queen. Your knight comes back to c6 later.}
            Qa4+
            Bd7 {Block the check and the queen must move again.}
            Qc2
            e6 {Free the f8 bishop. Next …Bd6 to trade off White's strong f4 bishop, castle, and …Nc6. Equal.}` },
          { id: 'ck-ex-nf3', name: 'Exchange 4.Bd3 … 6.Nf3', pgn: `
            e4 c6 d4 d5 exd5 cxd5 Bd3 Nc6 c3 Nf6
            Nf3 {White develops the knight first.}
            Bg4 {Pin the knight — it is the best defender of d4 and e5.}
            O-O
            e6 {Free the f8 bishop. Next …Bd6, …O-O and …Qc7.}` },
          { id: 'ck-panov-exd5', name: 'Panov 4.c4 — 7.cxd5', pgn: `
            e4 c6 d4 d5 exd5 cxd5
            c4 {The Panov Attack: White hits d5 and wants active piece play.}
            Nf6 {Defend d5 and develop.}
            Nc3
            e6 {Defend d5 again and free your f8 bishop.}
            Nf3
            Be7 {Develop and prepare to castle.}
            cxd5
            Nxd5 {Take back with the knight — it blockades White's isolated d4 pawn.}
            Bd3
            Nc6 {Pressure on d4.}
            O-O
            O-O {Castle. Plan: trade pieces, then attack the lonely d4 pawn.}
            Re1
            Nf6 {Defend your kingside (and h7) with the knight. Next …b6, …Bb7 and …Rc8.}` },
          { id: 'ck-panov-c5', name: 'Panov 4.c4 — 7.c5', pgn: `
            e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 e6 Nf3 Be7
            c5 {White grabs queenside space instead.}
            O-O {Castle first.}
            Bd3
            b6 {Attack the c5 pawn at once — undermine White's space.}
            b4
            a5 {Hit the b4 support pawn too. White's queenside pawns become targets.}` },
        ],
      },
      {
        name: 'Two Knights (2.Nc3 d5 3.Nf3)',
        plan: 'You have traded your light bishop for a knight, so put your pawns on light squares (c6, d5, e6) and play solidly: …Nf6, …Nbd7, …Be7, castle. White has the bishop pair but no easy targets.',
        lines: [
          { id: 'ck-2n-d4', name: '4.h3 Bxf3 5.Qxf3 e6 6.d4', pgn: `
            e4 c6
            Nc3 {White develops first and keeps d2-d4 for later.}
            d5 {Same idea — hit e4.}
            Nf3 {The Two Knights.}
            Bg4 {Develop the bishop and pin the f3 knight.}
            h3 {Ask the bishop.}
            Bxf3 {Take — your bishop for the knight.}
            Qxf3
            e6 {Build the wall; your pawns now sit on light squares.}
            d4
            Nf6
            Bd3 {White gambits the d4 pawn for activity.}
            dxe4
            Nxe4
            Qxd4 {Take the pawn: it's safe now.}
            c3
            Qd8 {Retreat to safety. You are a pawn up; finish developing and trade pieces.}` },
          { id: 'ck-2n-d3', name: '4.h3 Bxf3 5.Qxf3 e6 6.d3', pgn: `
            e4 c6 Nc3 d5 Nf3 Bg4 h3 Bxf3 Qxf3 e6
            d3 {A quieter set-up.}
            Nf6
            Bd2
            d4 {Gain space and kick the c3 knight.}
            Ne2
            c5 {Support the d4 pawn. Next …Nc6, …Be7, castle. A comfortable game.}` },
        ],
      },
      {
        name: 'White\'s early sidelines',
        plan: 'White avoided the main lines. Keep it simple: …d5, develop, castle. Put pawns on light squares if you trade your light bishop.',
        lines: [
          { id: 'ck-c4', name: '2.c4', pgn: `
            e4 c6
            c4 {White plays c4 early.}
            d5 {Still hit the centre.}
            exd5
            cxd5
            cxd5
            Nf6 {Develop first and win back d5 next move.}
            Nc3
            Nxd5 {Pawn back.}
            Nf3
            Nc6 {Free development and an equal game.}` },
        ],
      },
    ],
  },
];
