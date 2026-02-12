import React from 'react';

const GameOverScreen = ({ score, correctAnswer, onRestart, onBackHome }) => {
  return (
    <div className="page game-over-page">
      <h2 className="title-wrong">אופס, טעית!</h2>
      <p>התשובה הנכונה הייתה: <span className="correct-answer">{correctAnswer}</span></p>

      <div className="final-score">
        <h3>הניקוד שלך: {score}</h3>
      </div>

      <button className="main-btn" onClick={onRestart}>נסה שוב 🔄</button>
      <button className="secondary-btn" onClick={onBackHome}>חזרה למסך הבית</button>
    </div>
  );
};

export default GameOverScreen;