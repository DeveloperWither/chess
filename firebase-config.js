// Firebase project settings for online play (accounts, friends, team games).
// Project: chess-studio-0855 (created 2026-10-05). These values are public by design — security comes from firebase/firestore.rules.
window.FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAKXK1JjOlzm71k2ycyg3Dei-vVuvqtyNU',
  authDomain: 'chess-studio-0855.firebaseapp.com',
  projectId: 'chess-studio-0855',
  storageBucket: 'chess-studio-0855.firebasestorage.app',
  messagingSenderId: '187324605423',
  appId: '1:187324605423:web:81307bfd0eda976ab78c1a',
};

// Notifications: the chess-studio-push Cloudflare Worker (push-worker/) + its public VAPID key.
window.PUSH_CONFIG = {
  url: /[?&]emu=1/.test(location.search) ? 'http://127.0.0.1:8787' : 'WORKER_URL',
  vapidPublicKey: 'BEV_BTHHixlRnmpOK4D4NpxrHK2sZIuDZpxxOk-GeSqOzyjAw2gYr6uoy4kAslUJ_DmUnIKAvucKGh-sarob6vg',
};
