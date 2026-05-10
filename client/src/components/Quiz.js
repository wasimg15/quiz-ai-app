import React, { useState, useEffect, useMemo } from 'react';
import io from 'socket.io-client';
import { quizQuestions } from '../data/quizQuestions';
import './Quiz.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const socket = io(BACKEND_URL);

function Quiz({ studentName, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quizQuestions[0].timeLimit);
  const [answered, setAnswered] = useState(false);

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize shuffled questions immediately using useMemo
  const shuffledQuestions = useMemo(() => {
    return quizQuestions.map((q) => {
      const shuffledOptions = shuffleArray(q.options);
      const newCorrectIndex = shuffledOptions.findIndex((opt) => opt === q.options[q.correct]);
      return {
        ...q,
        options: shuffledOptions,
        correct: newCorrectIndex
      };
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]);

  const handleTimeUp = () => {
    if (!answered) {
      setShowResult(true);
      setAnswered(true);
      setSelectedAnswer(null);
    }
  };

  const handleAnswerSelect = (index) => {
    if (answered) return;
    setSelectedAnswer(index);
    setShowResult(true);
    setAnswered(true);

    if (index === shuffledQuestions[currentQuestion].correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setAnswered(false);
      setTimeLeft(shuffledQuestions[currentQuestion + 1].timeLimit);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = () => {
    socket.emit('submit-quiz', {
      name: studentName,
      score: score,
      totalQuestions: shuffledQuestions.length
    });
    onComplete();
  };

  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;
  const question = shuffledQuestions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="question-counter">
            Question {currentQuestion + 1} of {shuffledQuestions.length}
          </div>
          <div className={`timer ${timeLeft <= 10 ? 'timer-warning' : ''}`}>
            ⏱️ {timeLeft}s
          </div>
        </div>

        <h2 className="question-text">{question.question}</h2>

        <div className="options-container">
          {question.options.map((option, index) => {
            let optionClass = 'option-btn';
            if (showResult) {
              if (index === question.correct) {
                optionClass += ' correct';
              } else if (index === selectedAnswer && index !== question.correct) {
                optionClass += ' incorrect';
              }
            } else if (selectedAnswer === index) {
              optionClass += ' selected';
            }

            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => handleAnswerSelect(index)}
                disabled={answered}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                {option}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="result-section">
            <p className={`result-message ${selectedAnswer === question.correct ? 'correct' : 'incorrect'}`}>
              {selectedAnswer === question.correct ? '✓ Correct!' : '✗ Incorrect!'}
            </p>
            <button onClick={handleNext} className="next-btn">
              {currentQuestion < shuffledQuestions.length - 1 ? 'Next Question →' : 'View Results'}
            </button>
          </div>
        )}

        <div className="score-display">
          Score: {score} / {shuffledQuestions.length}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
