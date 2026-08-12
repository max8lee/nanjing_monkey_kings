/**
 * firebaseDb.js
 * Thin wrappers around Firestore so the rest of the app never imports
 * Firebase directly.
 *
 * Collections:
 *   users/          — one doc per user, keyed by Firebase Auth uid
 *   claimedPlayers/ — one doc per claimed player, keyed by player id
 *   customBios/     — custom bio overrides per player id
 */

import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUser(uid) {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? { uid, ...snap.data() } : null;
}

export async function saveUser(uid, data) {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
}

export async function updateUser(uid, partial) {
    await updateDoc(doc(db, 'users', uid), partial);
}

export async function getTopUsersByTokens(limitCount = 4) {
    const q = query(collection(db, 'users'), orderBy('tokens', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    const result = [];
    snap.forEach(d => {
        result.push({ uid: d.id, ...d.data() });
    });
    return result;
}

// ─── Claimed Players ──────────────────────────────────────────────────────────

export async function getAllClaimedPlayers() {
    const snap = await getDocs(collection(db, 'claimedPlayers'));
    const result = {};
    snap.forEach(d => { result[d.id] = d.data(); });
    return result;
}

export async function claimPlayer(playerId, claimData) {
    await setDoc(doc(db, 'claimedPlayers', playerId), claimData);
}

// ─── Custom Player Bios ───────────────────────────────────────────────────────

export async function getAllCustomBios() {
    const snap = await getDocs(collection(db, 'customBios'));
    const result = {};
    snap.forEach(d => { result[d.id] = d.data(); });
    return result;
}

export async function saveCustomBio(playerId, data) {
    await setDoc(doc(db, 'customBios', playerId), data, { merge: true });
}

// Username mappings
export async function claimUsername(username, authEmail) {
    try {
        await setDoc(doc(db, 'usernames', username.toLowerCase()), { email: authEmail });
    } catch (e) {
        console.error("Error claiming username:", e);
    }
}

export async function updateTokenLedger(username, increment) {
    if (!username) return;
    const docRef = doc(db, 'tokenLedger', username.toLowerCase());
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
        await setDoc(docRef, { balance: Math.max(0, increment) });
    } else {
        const data = snap.data();
        await updateDoc(docRef, { balance: Math.max(0, (data.balance || 0) + increment) });
    }
}

// ─── Fan Polls ────────────────────────────────────────────────────────────────

export function onPollUpdate(pollId, callback) {
    return onSnapshot(doc(db, 'fanPolls', pollId), (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data());
        } else {
            callback({});
        }
    });
}

export async function submitPollVote(pollId, uid, option) {
    if (!uid) return;
    await setDoc(doc(db, 'fanPolls', pollId), { [uid]: option }, { merge: true });
}

export async function getAuthEmailByUsername(username) {
    try {
        const d = await getDoc(doc(db, 'usernames', username.toLowerCase()));
        if (d.exists()) {
            return d.data().email;
        }
    } catch (e) {
        console.error("Error looking up username:", e);
    }
    return null;
}

// ─── Team Data (Games & Logs) ────────────────────────────────────────────────
export async function getSeasonGames(seasonId) {
    const snap = await getDocs(collection(db, 'seasons', seasonId, 'games'));
    const games = [];
    snap.forEach(d => { games.push({ id: d.id, ...d.data() }); });
    // Sort games by gameId descending (latest game first) to match DATA_SCHEDULE_SEASON2 format
    games.sort((a, b) => b.gameId - a.gameId);
    return games;
}

export async function getSeasonPlayerLogs(seasonId) {
    const snap = await getDocs(collection(db, 'seasons', seasonId, 'player_game_logs'));
    const logs = [];
    snap.forEach(d => { logs.push({ id: d.id, ...d.data() }); });
    return logs;
}
