import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBoZpYT7aKjUENovZ1qZXP2YknfnXVdECc",
  authDomain: "nanjing-monkey-kings.firebaseapp.com",
  projectId: "nanjing-monkey-kings",
  storageBucket: "nanjing-monkey-kings.firebasestorage.app",
  messagingSenderId: "11881292063",
  appId: "1:11881292063:web:587dc514bf5330b540102a",
  measurementId: "G-J7WDRE6HRT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Use memory-only cache to avoid IndexedDB "Database is closing/hidden"
// errors that occur when the Google OAuth popup triggers page-visibility events.
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache()
});
