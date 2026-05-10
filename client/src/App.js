import React, { useState } from 'react';
import Landing from './components/Landing';
import StudentDashboard from './components/StudentDashboard';
import OrganizerDashboard from './components/OrganizerDashboard';
import Quiz from './components/Quiz';
import Leaderboard from './components/Leaderboard';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function App() {
  const [view, setView] = useState('landing');
  const [userType, setUserType] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [previousView, setPreviousView] = useState('landing');

  const handleStudentSelect = (name) => {
    setUserType('student');
    setStudentName(name);
    setView('student-dashboard');
  };

  const handleOrganizerSelect = () => {
    setUserType('organizer');
    setView('organizer-dashboard');
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    setView('quiz');
  };

  const handleQuizComplete = () => {
    setPreviousView('quiz');
    setView('quiz-complete');
  };

  const handleViewLeaderboard = () => {
    setPreviousView(view);
    setView('leaderboard');
  };

  const handleLeaderboardBack = () => {
    if (previousView === 'student-dashboard' || previousView === 'quiz') {
      setView('student-dashboard');
    } else if (previousView === 'quiz-complete') {
      setView('quiz-complete');
    } else {
      handleBackToLanding();
    }
  };

  const handleBackToLanding = () => {
    setView('landing');
    setUserType(null);
    setStudentName('');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {view === 'landing' && (
        <Landing 
          onStudentSelect={handleStudentSelect}
          onOrganizerSelect={handleOrganizerSelect}
        />
      )}
      {view === 'student-dashboard' && (
        <StudentDashboard
          studentName={studentName}
          onAuthenticated={handleAuthenticated}
          onBack={handleBackToLanding}
          onViewLeaderboard={handleViewLeaderboard}
        />
      )}
      {view === 'organizer-dashboard' && (
        <OrganizerDashboard
          onBack={handleBackToLanding}
        />
      )}
      {view === 'quiz' && (
        <Quiz
          studentName={studentName}
          onComplete={handleQuizComplete}
        />
      )}
      {view === 'leaderboard' && (
        <Leaderboard
          onBack={handleLeaderboardBack}
        />
      )}
      {view === 'quiz-complete' && (
        <div className="quiz-complete-container">
          <div className="quiz-complete-card">
            <h1 className="quiz-complete-title">🎉 Quiz Completed!</h1>
            <p className="quiz-complete-message">Thank you for participating in the AI Quiz!</p>
            <div className="quiz-complete-actions">
              <button onClick={handleViewLeaderboard} className="view-leaderboard-btn">
                🏆 View Leaderboard
              </button>
              <button onClick={handleBackToLanding} className="back-home-btn">
                🏠 Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
