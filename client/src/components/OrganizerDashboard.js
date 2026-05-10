import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './OrganizerDashboard.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function OrganizerDashboard({ onBack }) {
  const [waitingStudents, setWaitingStudents] = useState([]);
  const [authenticatedStudents, setAuthenticatedStudents] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const [activeTab, setActiveTab] = useState('students');
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(BACKEND_URL);

    fetchWaitingStudents();
    fetchAuthenticatedStudents();
    fetchQuizResults();

    socketRef.current.on('waiting-students-updated', (students) => {
      setWaitingStudents(students);
    });

    socketRef.current.on('authenticated-students-updated', (students) => {
      setAuthenticatedStudents(students);
    });

    socketRef.current.on('student-authenticated', (data) => {
      console.log('Student authenticated:', data);
    });

    socketRef.current.on('quiz-results-updated', (results) => {
      setQuizResults(results);
    });

    return () => {
      socketRef.current.off('waiting-students-updated');
      socketRef.current.off('authenticated-students-updated');
      socketRef.current.off('student-authenticated');
      socketRef.current.off('quiz-results-updated');
      socketRef.current.disconnect();
    };
  }, []);

  const fetchWaitingStudents = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/waiting-students`);
      const data = await response.json();
      setWaitingStudents(data);
    } catch (error) {
      console.error('Error fetching waiting students:', error);
    }
  };

  const fetchAuthenticatedStudents = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/authenticated-students`);
      const data = await response.json();
      setAuthenticatedStudents(data);
    } catch (error) {
      console.error('Error fetching authenticated students:', error);
    }
  };

  const fetchQuizResults = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/quiz-results`);
      const data = await response.json();
      const sorted = [...data].sort((a, b) => b.score - a.score);
      setQuizResults(sorted);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
    }
  };

  const handleAuthenticate = (studentId) => {
    socketRef.current.emit('authenticate-student', studentId);
  };

  const handleStartQuiz = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/start-quiz`, {
        method: 'POST',
      });
      setQuizStarted(true);
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  };

  const handleResetQuiz = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/reset-quiz`, {
        method: 'POST',
      });
      setQuizStarted(false);
      setWaitingStudents([]);
      setAuthenticatedStudents([]);
      setQuizResults([]);
    } catch (error) {
      console.error('Error resetting quiz:', error);
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
    <div className="organizer-dashboard-container">
      <div className="organizer-dashboard-card">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1 className="dashboard-title">Organizer Dashboard</h1>
        
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            👥 Students
          </button>
          <button
            className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            🏆 Leaderboard
          </button>
        </div>

        {activeTab === 'students' && (
          <>
            <div className="stats-section">
              <div className="stat-card">
                <div className="stat-number">{waitingStudents.length}</div>
                <div className="stat-label">Waiting</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{authenticatedStudents.length}</div>
                <div className="stat-label">Authenticated</div>
              </div>
            </div>

            <div className="students-section">
              <h2 className="section-title">Waiting Students</h2>
              {waitingStudents.length === 0 ? (
                <p className="no-students">No students waiting</p>
              ) : (
                <div className="students-list">
                  {waitingStudents.map((student) => (
                    <div key={student.id} className="student-item">
                      <span className="student-name">{student.name}</span>
                      <button
                        onClick={() => handleAuthenticate(student.id)}
                        className="authenticate-btn"
                        disabled={quizStarted}
                      >
                        ✓ Authenticate
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="students-section">
              <h2 className="section-title">Authenticated Students</h2>
              {authenticatedStudents.length === 0 ? (
                <p className="no-students">No students authenticated yet</p>
              ) : (
                <div className="students-list">
                  {authenticatedStudents.map((student) => (
                    <div key={student.id} className="student-item authenticated">
                      <span className="student-name">{student.name}</span>
                      <span className="authenticated-badge">✓</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="actions-section">
              {!quizStarted ? (
                <button
                  onClick={handleStartQuiz}
                  className="start-quiz-btn"
                  disabled={authenticatedStudents.length === 0}
                >
                  🚀 Start Quiz
                </button>
              ) : (
                <button onClick={handleResetQuiz} className="reset-quiz-btn">
                  🔄 Reset Quiz
                </button>
              )}
            </div>
          </>
        )}

        {activeTab === 'leaderboard' && (
          <div className="leaderboard-section">
            <h2 className="section-title">🏆 Quiz Leaderboard</h2>
            {quizResults.length === 0 ? (
              <p className="no-students">No quiz results yet. Waiting for students to complete the quiz...</p>
            ) : (
              <div className="leaderboard-list">
                {quizResults.map((result, index) => (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizerDashboard;
