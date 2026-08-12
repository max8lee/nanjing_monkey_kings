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

import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy, limit, onSnapshot, where, writeBatch, increment } from 'firebase/firestore';
import { db } from './firebase';
import { DATA_STATS_SEASON2, DATA_SCHEDULE_SEASON2 } from './data/teamData';

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

export async function submitParlay(parlayData) {
    const docRef = doc(collection(db, 'parlays'));
    await setDoc(docRef, { ...parlayData, id: docRef.id });
    return docRef.id;
}

export async function getUserParlays(uid) {
    if (!uid) return [];
    const q = query(collection(db, 'parlays'), where('uid', '==', uid));
    const snap = await getDocs(q);
    const parlays = [];
    snap.forEach(doc => {
        parlays.push(doc.data());
    });
    // sort by timestamp descending
    return parlays.sort((a, b) => b.timestamp - a.timestamp);
}

// ─── ADMIN: SETTLE PARLAYS ───────────────────────────────────────────────────

export async function adminSettleParlays() {
    const q = query(collection(db, 'parlays'), where('status', '==', 'OPEN'));
    const snap = await getDocs(q);
    
    const logsSnap = await getDocs(collection(db, 'seasons', 'season2', 'player_game_logs'));
    const logs = [];
    logsSnap.forEach(d => logs.push({ id: d.id, ...d.data() }));

    const batch = writeBatch(db);
    let count = 0;

    snap.forEach(docSnap => {
        const parlay = docSnap.data();
        const updatedLegs = parlay.legs.map(leg => {
            if (leg.status === 'WON' || leg.status === 'LOST') return leg;
            
            // Find player ID from DATA_STATS_SEASON2
            const statObj = DATA_STATS_SEASON2.find(p => p.name === leg.player);
            const pId = statObj ? statObj.id : null;
            
            const playerLogs = logs.filter(l => 
                l.playerName === leg.player || 
                (pId && l.playerId === pId) || 
                (pId && l.id && l.id.includes(pId)) ||
                (l.id && l.id.includes(leg.player.split(' ')[0].toLowerCase()))
            );
            
            // Filter out games that started before the parlay was placed
            const validLogs = playerLogs.filter(log => {
                if (!log.gameId) return false;
                const gameSchedule = DATA_SCHEDULE_SEASON2.find(g => g.gameSlug === `game-${log.gameId}`);
                if (!gameSchedule || !gameSchedule.date) return false;
                
                const dateParts = gameSchedule.date.split(' • ');
                if (dateParts.length !== 2) return false;
                
                const gameTimestamp = new Date(`${dateParts[0]} 2026 ${dateParts[1]}`).getTime();
                return gameTimestamp > parlay.timestamp;
            });
            
            if (validLogs.length === 0) {
                // Check if ANY game was logged after the parlay was placed
                const anyGamePlayed = logs.some(l => {
                    if (!l.gameId) return false;
                    const gs = DATA_SCHEDULE_SEASON2.find(g => g.gameSlug === `game-${l.gameId}`);
                    if (!gs || !gs.date) return false;
                    const parts = gs.date.split(' • ');
                    if (parts.length !== 2) return false;
                    const tStamp = new Date(`${parts[0]} 2026 ${parts[1]}`).getTime();
                    return tStamp > parlay.timestamp;
                });
                
                if (anyGamePlayed) {
                    return { ...leg, status: 'VOID', actual: 'DNP' };
                }
                return leg;
            }
            
            validLogs.sort((a, b) => b.gameId - a.gameId);
            const latestLog = validLogs[0];
            
            let actual = 0;
            if (leg.stat === 'Points Scored') actual = latestLog.pts || 0;
            else if (leg.stat === 'Total Rebounds') actual = (latestLog.oreb || 0) + (latestLog.dreb || 0) || (latestLog.reb || 0);
            else if (leg.stat === 'Points + Rebounds') actual = (latestLog.pts || 0) + ((latestLog.oreb || 0) + (latestLog.dreb || 0) || (latestLog.reb || 0));
            else if (leg.stat === 'Assists') actual = latestLog.ast || 0;
            else if (leg.stat === '3-Pointers Made') actual = latestLog.p3m || 0;

            const lineNum = parseFloat(leg.line);
            let legStatus = 'OPEN';
            if (leg.pick === 'OVER') legStatus = actual > lineNum ? 'WON' : 'LOST';
            else legStatus = actual < lineNum ? 'WON' : 'LOST';

            return { ...leg, actual, status: legStatus };
        });

        let anyLost = updatedLegs.some(l => l.status === 'LOST');
        let anyVoid = updatedLegs.some(l => l.status === 'VOID');
        let anyOpen = updatedLegs.some(l => l.status === 'OPEN' || !l.status);
        
        let newStatus = 'OPEN';
        if (anyVoid) newStatus = 'VOID';
        else if (anyLost) newStatus = 'LOST';
        else if (!anyOpen) newStatus = 'WON';

        if (newStatus !== 'OPEN') {
            batch.update(docSnap.ref, { legs: updatedLegs, status: newStatus });
            count++;
            if (newStatus === 'WON') {
                const userRef = doc(db, 'users', parlay.uid);
                batch.update(userRef, { tokens: increment(parlay.potentialPayout) });
            } else if (newStatus === 'VOID') {
                const userRef = doc(db, 'users', parlay.uid);
                batch.update(userRef, { tokens: increment(parlay.wager) }); // Refund the wager
            }
        }
    });

    if (count > 0) {
        await batch.commit();
        return `Successfully settled ${count} parlays!`;
    } else {
        return "No parlays were ready to settle based on available stats.";
    }
}
