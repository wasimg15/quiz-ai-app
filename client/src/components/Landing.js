import React, { useState } from 'react';
import './Landing.css';

function Landing({ onStudentSelect, onOrganizerSelect }) {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onStudentSelect(name);
    }
  };

  const handleOrganizerSubmit = (e) => {
    e.preventDefault();
    // Simple hardcoded password - in production, this should be verified on the backend
    const MASTER_PASSWORD = 'admin123';
    if (password === MASTER_PASSWORD) {
      onOrganizerSelect();
    } else {
      setPasswordError('Incorrect password');
    }
  };

  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1 className="landing-title">AI Quiz Challenge</h1>
        <p className="landing-subtitle">Test your knowledge about Artificial Intelligence</p>
        
        <div className="role-selector">
          <button
            className={`role-btn ${selectedRole === 'student' ? 'active' : ''}`}
            onClick={() => setSelectedRole('student')}
          >
            👨‍🎓 Student
          </button>
          <button
            className={`role-btn ${selectedRole === 'organizer' ? 'active' : ''}`}
            onClick={() => setSelectedRole('organizer')}
          >
            👨‍💼 Organizer
          </button>
        </div>

        {selectedRole === 'student' && (
          <form className="student-form" onSubmit={handleStudentSubmit}>
            <input
              type="text"
              className="name-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <button type="submit" className="join-btn">
              Join Quiz
            </button>
          </form>
        )}

        {selectedRole === 'organizer' && (
          <form className="organizer-form" onSubmit={handleOrganizerSubmit}>
            <p className="organizer-text">You will manage the quiz and authenticate students.</p>
            <input
              type="password"
              className="password-input"
              placeholder="Enter master password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              required
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
            <button type="submit" className="organizer-btn">
              Access Organizer Dashboard
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Landing;
