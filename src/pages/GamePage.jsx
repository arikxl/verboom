/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from 'react';
import { updateScoreInFirebase } from '../services/scoreService';

const GamePage = ({ verbsData, userScore, setUserScore, user, onGameOver }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [streak, setStreak] = useState(0);
  const [hintsVisible, setHintsVisible] = useState({ pronunciation: false, meaning: false });
  const [feedback, setFeedback] = useState('');

  const calculateCorrectAnswer = () => {
    if (!currentQuestion) return '';
    const { verb, pronoun, tense } = currentQuestion;
    if (!verb?.past_stem || !pronoun?.suffix) return '';
    let suffix = tense === 'past'
      ? (pronoun.suffix_past ?? pronoun.suffix ?? '')
      : (pronoun.suffix_present ?? pronoun.suffix ?? '');
    if (tense === 'past') {
      return verb.past_stem + suffix;
    }
    const prefix = verb.infinitive ? verb.infinitive.slice(0, -2) : '';
    return prefix + (verb.present_stem ?? verb.past_stem) + suffix;
  };

  const generateQuestion = useCallback(() => {
    if (!verbsData?.verbs?.length) return;
    const randomVerb = verbsData.verbs[Math.floor(Math.random() * verbsData.verbs.length)];
    const randomPronoun = verbsData.pronouns[Math.floor(Math.random() * verbsData.pronouns.length)];
    setCurrentQuestion({
      verb: randomVerb,
      pronoun: randomPronoun,
      tense: 'past'
    });
    setUserInput('');
    setHintsVisible({ pronunciation: false, meaning: false });
    setFeedback('');
  }, [verbsData]);

  // ←←←←←← הוסף את זה!
  useEffect(() => {
    if (verbsData) {
      generateQuestion();
    }
  }, [generateQuestion]);

  const handleUseHint = async (hintType, cost) => {
    if (userScore < cost) {
      setFeedback('נקודות לא מספיקות!');
      return;
    }
    setHintsVisible(prev => ({ ...prev, [hintType]: true }));
    setUserScore(prev => prev - cost);
    if (user?.uid) {
      await updateScoreInFirebase(user.uid, -cost);
    }
  };

  const checkAnswer = async () => {
    const correct = calculateCorrectAnswer();
    if (userInput.trim() === correct) {
      const newStreak = streak + 1;
      let pointsToAdd = newStreak >= 3 ? 2 : 1;
      setUserScore(prev => prev + pointsToAdd);
      setStreak(newStreak);
      if (user?.uid) {
        await updateScoreInFirebase(user.uid, pointsToAdd);
      }
      setFeedback(`${pointsToAdd} נקודות! ${newStreak === 1 ? 'כל הכבוד!' : 'שרשרת!'}`);
      setTimeout(generateQuestion, 1200);
    } else {
      setFeedback(`תשובה נכונה: ${correct}`);
      onGameOver(userScore, correct);
    }
  };

  if (!currentQuestion) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        טוען שאלה ראשונה...
      </div>
    );
  }

  return (
    <div className="game-container" dir="rtl">
      <div className="stats">
        נקודות: {userScore} | רצף: {streak}
      </div>
      <h1>{currentQuestion.verb.infinitive}</h1>
      <div className="hints-row">
        <button onClick={() => handleUseHint('pronunciation', 1)} disabled={hintsVisible.pronunciation || userScore < 1}>
          הגייה (1)
        </button>
        <button onClick={() => handleUseHint('meaning', 2)} disabled={hintsVisible.meaning || userScore < 2}>
          משמעות (2)
        </button>
      </div>
      <div className="hint-display">
        {hintsVisible.pronunciation && <p>{currentQuestion.verb.pronunciation}</p>}
        {hintsVisible.meaning && <p>{currentQuestion.verb.meaning_he}</p>} {/* תוקן meaningHeb */}
      </div>
      <p><strong>עבר: </strong>{currentQuestion.pronoun.label}</p>
      <input
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        placeholder="הזן תשובה..."
        dir="rtl"
      />
      <br />
      <mark style={{ opacity: 0.3, userSelect: 'all', backgroundColor: 'yellow' }}>
        {calculateCorrectAnswer()}
      </mark>
      <br />
      <button onClick={checkAnswer}>בדוק תשובה</button>
      <p>{feedback}</p>
    </div>
  );
};

export default GamePage;
