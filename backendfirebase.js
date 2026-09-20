import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyA8MEWFrx1AEBYJwoISEOyQTqxtaFvfFlw",
  authDomain: "emoji-hunt-5c5ec.firebaseapp.com",
  projectId: "emoji-hunt-5c5ec",
  storageBucket: "emoji-hunt-5c5ec.firebasestorage.app",
  messagingSenderId: "686209011834",
  appId: "1:686209011834:web:ab0545173a9e88fa542bc3",
  measurementId: "G-F1F58W1ZXY"
});

const leaderboardCollection = collection(getFirestore(app), "Leaderboard");

export async function submitScore(name, score, mode) {
  await addDoc(leaderboardCollection, {
    name: String(name || "Player").trim() || "Player",
    score: Number(score) || 0,
    mode: String(mode || ""),
    timestamp: Date.now()
  });
}

export async function getTopScores(limit = 10) {
  const snapshot = await getDocs(leaderboardCollection);
  return snapshot.docs
    .map((entry) => entry.data())
    .sort((first, second) => Number(second.score) - Number(first.score))
    .slice(0, limit);
}

export function watchLeaderboard(onChange, onError) {
  return onSnapshot(
    leaderboardCollection,
    (snapshot) => onChange(snapshot.docs.map((entry) => entry.data())),
    onError
  );
}
