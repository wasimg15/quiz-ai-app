import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Leaderboard.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function Leaderboard({ onBack }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const socket = io(BACKEND_URL);

    fetchResults();
    const interval = setInterval(fetchResults, 5000);

    socket.on('quiz-reset', () => {
      setResults([]);
    });

    return () => {
      clearInterval(interval);
      socket.off('quiz-reset');
      socket.disconnect();
    };
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/quiz-results`);
      const data = await response.json();
      const sorted = [...data].sort((a, b) => b.score - a.score);
      setResults(sorted);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const getRankColor = (index) => {
    if (index === 0) return '#ffd700';
    if (index === 1) return '#c0c0c0';
    if (index === 2) return '#cd7f32';
    return '#667eea';
  };

  const getRankIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1 className="leaderboard-title">🏆 Leaderboard</h1>
        
        {results.length === 0 ? (
          <div className="no-results">
            <p>No quiz results yet. Waiting for students to complete the quiz...</p>
          </div>
        ) : (
          <>
            <div className="leaderboard-list">
              {results.map((result, index) => (
                <div key={result.id} className="leaderboard-item">
                  <div 
                    className="rank-badge"
                    style={{ backgroundColor: getRankColor(index) }}
                  >
                    {getRankIcon(index)}
                  </div>
                  <div className="student-info">
                    <div className="student-name">{result.name}</div>
                    <div className="score-display">
                      {result.score} / {result.totalQuestions}
                    </div>
                  </div>
                  <div className="percentage">
                    {Math.round((result.score / result.totalQuestions) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
