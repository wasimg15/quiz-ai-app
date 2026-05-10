import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './StudentDashboard.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function StudentDashboard({ studentName, onAuthenticated, onBack, onViewLeaderboard }) {
  const [status, setStatus] = useState('waiting');
  const [message, setMessage] = useState('Waiting for organizer authentication...');

  useEffect(() => {
    const socket = io(BACKEND_URL);

    socket.emit('student-join', { name: studentName });

    socket.on('student-authenticated', (data) => {
      if (data.name === studentName) {
        setStatus('authenticated');
        setMessage('You have been authenticated! Waiting for quiz to start...');
      }
    });

    socket.on('quiz-started', () => {
      setMessage('Quiz is starting!');
      setTimeout(() => {
        onAuthenticated();
      }, 1000);
    });

    return () => {
      socket.off('student-authenticated');
      socket.off('quiz-started');
      socket.disconnect();
    };
  }, [studentName, onAuthenticated]);

  return (
    <div className="student-dashboard-container">
      <div className="student-dashboard-card">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1 className="dashboard-title">Welcome, {studentName}!</h1>
        <div className="status-section">
          <div className={`status-indicator ${status}`}>
            {status === 'waiting' && '⏳'}
            {status === 'authenticated' && '✅'}
          </div>
          <p className="status-message">{message}</p>
        </div>
        <div className="info-section">
          <p className="info-text">📝 20 Questions on AI</p>
          <p className="info-text">⏱️ 30 seconds per question</p>
          <p className="info-text">🏆 Compete with 100 students</p>
        </div>
        <button onClick={onViewLeaderboard} className="view-leaderboard-btn">
          🏆 View Leaderboard
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;
