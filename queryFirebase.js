import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
    projectId: "nanjing-monkey-kings",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
    const q = query(collection(db, 'parlays'));
    const snap = await getDocs(q);
    snap.forEach(d => console.log(JSON.stringify(d.data(), null, 2)));
}
check();
