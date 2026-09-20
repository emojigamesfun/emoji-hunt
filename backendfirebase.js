import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, get, onValue, push, ref } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const app = initializeApp({
  apiKey: "AIzaSyA8MEWFrx1AEBYJwoISEOyQTqxtaFvfFlw",
  authDomain: "emoji-hunt-5c5ec.firebaseapp.com",
  projectId: "emoji-hunt-5c5ec",
  databaseURL: "https://emoji-hunt-5c5ec-default-rtdb.firebaseio.com",
  storageBucket: "emoji-hunt-5c5ec.firebasestorage.app",
  messagingSenderId: "686209011834",
  appId: "1:686209011834:web:ab0545173a9e88fa542bc3",
  measurementId: "G-F1F58W1ZXY"
});

const database = getDatabase(app);
const leaderboardRef = ref(database, "leaderboard");

function normalizeScore(snapshot) {
  const data = snapshot.val() || {};
  return {
    id: snapshot.key,
    name: String(data.name || data.username || "Player").trim(),
    score: Number(data.score) || 0,
    mode: String(data.mode || ""),
    timestamp: Number(data.timestamp) || 0
  };
}

export async function submitScore(name, score, mode = "") {
  const safeName = String(name || "Player").trim() || "Player";
  const numericScore = Number(score) || 0;
  await push(leaderboardRef, {
    name: safeName,
    score: numericScore,
    mode: String(mode || ""),
    timestamp: Date.now()
  });
}

export async function getTopScores(limit = 10) {
  const snapshot = await get(leaderboardRef);
  return snapshot.exists()
    ? snapshotToScores(snapshot).sort((first, second) => second.score - first.score || first.name.localeCompare(second.name)).slice(0, limit)
    : [];
}

export function watchLeaderboard(onChange, onError = console.error) {
  return onValue(
    leaderboardRef,
    (snapshot) => onChange(snapshotToScores(snapshot)),
    onError
  );
}

function snapshotToScores(snapshot) {
  const bestByPlayer = new Map();
  snapshot.forEach((scoreSnapshot) => {
    const score = normalizeScore(scoreSnapshot);
    const key = score.name.toLowerCase();
    const previous = bestByPlayer.get(key);
    if (!previous || score.score > previous.score || (!previous.mode && score.mode)) {
      bestByPlayer.set(key, {
        ...score,
        score: Math.max(score.score, previous ? previous.score : 0),
        mode: score.mode || (previous && previous.mode) || ""
      });
    }
  });
  return Array.from(bestByPlayer.values());
}