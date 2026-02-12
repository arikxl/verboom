// src/services/scoreService.js
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc, increment } from 'firebase/firestore';

export const updateScoreInFirebase = async (userId, points) => {
    if (!userId || typeof userId !== 'string') {
        console.error('Cannot update score: Invalid User ID');
        return;
    }

    const userRef = doc(db, 'users', userId);
    try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            await updateDoc(userRef, {
                totalPoints: increment(points),
                lastUpdated: new Date()
            });
        } else {
            // שחקן חדש – שמור פרופיל מלא
            await setDoc(userRef, {
                uid: userId,
                displayName: auth.currentUser?.displayName || 'שחקן',
                photoURL: auth.currentUser?.photoURL || '',
                totalPoints: Math.max(0, points),
                gamesPlayed: 1,
                createdAt: new Date(),
                lastUpdated: new Date()
            });
        }
    } catch (e) {
        console.error('Firebase Update Error:', e);
    }
};


export const getUserBalance = async (userId) => {
    if (!userId || typeof userId !== 'string') return 0;
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    return snap.exists() ? (snap.data().totalPoints || 0) : 0;
};

export const getLeaderboard = async () => {
    try {
        const snapshot = await db.collection('users').orderBy('totalPoints', 'desc').limit(10).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error('Leaderboard error:', e);
        return [];
    }
};