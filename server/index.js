const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", process.env.CLIENT_URL].filter(Boolean),
    methods: ["GET", "POST"]
  }
});

// Store students waiting for authentication
let waitingStudents = [];
// Store authenticated students
let authenticatedStudents = [];
// Store quiz results
let quizResults = [];
// Quiz state
let quizStarted = false;

// API endpoint to get waiting students
app.get('/api/waiting-students', (req, res) => {
  res.json(waitingStudents);
});

// API endpoint to get authenticated students
app.get('/api/authenticated-students', (req, res) => {
  res.json(authenticatedStudents);
});

// API endpoint to get quiz results
app.get('/api/quiz-results', (req, res) => {
  res.json(quizResults);
});

// API endpoint to start quiz
app.post('/api/start-quiz', (req, res) => {
  quizStarted = true;
  io.emit('quiz-started');
  res.json({ success: true });
});

// API endpoint to reset quiz
app.post('/api/reset-quiz', (req, res) => {
  quizStarted = false;
  waitingStudents = [];
  authenticatedStudents = [];
  quizResults = [];
  io.emit('quiz-reset');
  res.json({ success: true });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Student joins waiting room
  socket.on('student-join', (data) => {
    // Check if student already exists in waiting list
    const existingIndex = waitingStudents.findIndex(s => s.id === socket.id);
    if (existingIndex !== -1) {
      // Update existing student's name and join time
      waitingStudents[existingIndex] = {
        ...waitingStudents[existingIndex],
        name: data.name,
        joinedAt: new Date()
      };
    } else {
      // Add new student
      const student = {
        id: socket.id,
        name: data.name,
        joinedAt: new Date()
      };
      waitingStudents.push(student);
    }
    io.emit('waiting-students-updated', waitingStudents);
  });

  // Organizer authenticates student
  socket.on('authenticate-student', (studentId) => {
    const studentIndex = waitingStudents.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
      const student = waitingStudents.splice(studentIndex, 1)[0];
      authenticatedStudents.push(student);
      io.emit('student-authenticated', { studentId, name: student.name });
      io.emit('waiting-students-updated', waitingStudents);
      io.emit('authenticated-students-updated', authenticatedStudents);
    }
  });

  // Student submits quiz result
  socket.on('submit-quiz', (data) => {
    const result = {
      id: socket.id,
      name: data.name,
      score: data.score,
      totalQuestions: data.totalQuestions,
      completedAt: new Date()
    };
    quizResults.push(result);
    io.emit('quiz-results-updated', quizResults);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    waitingStudents = waitingStudents.filter(s => s.id !== socket.id);
    authenticatedStudents = authenticatedStudents.filter(s => s.id !== socket.id);
    io.emit('waiting-students-updated', waitingStudents);
    io.emit('authenticated-students-updated', authenticatedStudents);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
