import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
    projectId: "nanjing-monkey-kings",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
    const q = query(collection(db, 'seasons/season2/player_game_logs'), where('playerId', '==', 'p14'), where('gameId', '==', 3));
    const snap = await getDocs(q);
    snap.forEach(d => console.log(d.id, d.data()));
}
check();
