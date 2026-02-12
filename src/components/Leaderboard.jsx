import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/scoreService';

const Leaderboard = () => {
    const [topScores, setTopScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            const scores = await getLeaderboard();
            setTopScores(scores);
            setLoading(false);
        };
        fetchScores();
    }, []);

    if (loading) return <p>טוען טבלת אלופים...</p>;

    return (
        <div className="leaderboard">
            <h3>🏆 טבלת האלופים</h3>
            <ul>
                {topScores.map((entry, index) => (
                    <li key={index} style={{ listStyle: 'none', margin: '5px 0' }}>
                        <span>{index + 1}. </span>
                        <img src={entry.photoURL} alt="" style={{ width: '20px', borderRadius: '50%', marginLeft: '5px' }} />
                        <strong>{entry.displayName}</strong>: {entry.score} נקודות
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;