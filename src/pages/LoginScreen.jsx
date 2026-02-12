import { signOut } from 'firebase/auth';
import React from 'react';
import { auth } from '../firebase';

const LoginScreen = ({ onLogin, user, totalPoints }) => {
  if (user) {
    return (
      <div className="page login-page">
        <h1>ברוך הבא {user.displayName}!</h1>
        <p>נקודות: {totalPoints}</p>
        <button className="main-btn" onClick={onLogin}>התחל משחק</button>
        <button className="secondary-btn" onClick={() => signOut(auth)}>יציאה</button>
      </div>
    );
  }
  return (
    <div className="page login-page">
      <h1 className="logo">VerBoom</h1>
      <p className="tagline">משחק פעלים פרסיים</p>
      <button className="main-btn google-btn" onClick={onLogin}>
        התחבר עם Google
      </button>
    </div>
  );
};


export default LoginScreen;