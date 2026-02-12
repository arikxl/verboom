import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { verbsData } from './data/verbsData';
import LoginScreen from './pages/LoginScreen';
import InstructionsScreen from './pages/InstructionsScreen';
import GamePage from './pages/GamePage';
import GameOverScreen from './pages/GameOverScreen';
import { getUserBalance } from './services/scoreService';

const App = () => {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('LOGIN'); // LOGIN, START, PLAY, GAMEOVER
  const [totalPoints, setTotalPoints] = useState(0);
  const [lastGameData, setLastGameData] = useState(null);




  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // בדיקה מחמירה: האם יש אובייקט משתמש והאם יש לו UID
      if (currentUser && typeof currentUser.uid === 'string') {
        setUser(currentUser);
        try {
          const points = await getUserBalance(currentUser.uid);
          setTotalPoints(points);
          setCurrentScreen('START');
        } catch (error) {
          console.error("Failed to load balance:", error);
        }
      } else {
        // אם אין משתמש מחובר
        setUser(null);
        setTotalPoints(0);
        setCurrentScreen('LOGIN');
      }
    });
    return () => unsubscribe();
  }, []);

  // האזנה למצב החיבור של המשתמש
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setCurrentScreen('START');
      } else {
        setUser(null);
        setCurrentScreen('LOGIN');
      }
    });
    return () => unsubscribe();
  }, []);

  // פונקציות מעבר בין מסכים
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const startGame = () => {
    setCurrentScreen('PLAY');
  };



  const handleGameOver = (finalScore, correctAnswer) => {
    setLastGameData({ finalScore, correctAnswer });
    setCurrentScreen('GAMEOVER');
    // פשוט עוצרים כאן. העדכון כבר קרה בתוך המשחק עצמו.
  };

  return (
    <div className="app-container" dir="rtl">
      {currentScreen === 'LOGIN' && (
        <LoginScreen onLogin={handleLogin} user={user} totalPoints={totalPoints} />
      )}

      {

        currentScreen === 'START' && (
          <div>
            <InstructionsScreen
              user={user}
              onStart={startGame}
              onLogout={() => signOut(auth)}
            />
            {user && (
              <div style={{ textAlign: 'center', margin: '20px' }}>
                <img src={user.photoURL} alt="פרופיל" style={{ width: '50px', borderRadius: '50%' }} />
                <h3>ברוך שוב {user.displayName}!</h3>
                <p>נקודות מצטברות: <strong>{totalPoints}</strong></p>
              </div>
            )}
          </div>
        )
      }


      {currentScreen === 'PLAY' && (
        <GamePage
          verbsData={verbsData}
          userScore={totalPoints}        // הערך הנוכחי מה-State של App
          setUserScore={setTotalPoints}  // הפונקציה שמשנה את ה-State ב-App
          user={user}
          onGameOver={handleGameOver}
        />
      )}

      {currentScreen === 'GAMEOVER' && (
        <GameOverScreen
          score={lastGameData.finalScore}
          correctAnswer={lastGameData.correctAnswer}
          onRestart={startGame}
          onBackHome={() => setCurrentScreen('START')}
        />
      )}
    </div>
  );
};

export default App;