# Interactive AI Quiz App

A full-stack interactive quiz application for 100 students with real-time authentication, leaderboards, and dark theme support.

## Features

- 🎓 **Student & Organizer Roles**: Separate interfaces for students and organizers
- 🔐 **Authentication**: Master password protection for organizer dashboard (default: `admin123`)
- 📝 **20 AI Questions**: Multiple-choice questions on Artificial Intelligence
- ⏱️ **Timer**: 30 seconds per question
- 🏆 **Leaderboard**: Real-time rankings with special styling for top performers
- 🎨 **Dark Theme**: Modern dark UI throughout the application
- 📱 **Responsive**: Works on mobile and desktop devices
- 🔀 **Randomized Answers**: Answer options are shuffled for each quiz attempt
- 🔄 **Real-time Updates**: Socket.io for instant updates across all clients

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Real-time**: Socket.io
- **Styling**: CSS with dark theme

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Local Development

### 1. Clone the repository

```bash
git clone <repository-url>
cd quiz-app
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
REACT_APP_BACKEND_URL=http://localhost:5000
```

### 4. Start the servers

**Terminal 1 - Backend:**
```bash
cd server
node index.js
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Deployment to Render.com

Render.com offers free hosting for both Node.js backends and React frontends.

### Deploying the Backend

1. **Create a new Web Service** on Render.com
2. **Connect your GitHub repository**
3. **Configure the service:**
   - Name: `quiz-app-backend`
   - Environment: Node
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && node index.js`
4. **Add Environment Variables:**
   - `PORT`: `10000` (or any available port)
   - `CLIENT_URL`: Your frontend URL (e.g., `https://quiz-app-frontend.onrender.com`)
5. **Deploy** - Render will build and deploy your backend

### Deploying the Frontend

1. **Create a new Static Site** on Render.com
2. **Connect your GitHub repository**
3. **Configure the site:**
   - Name: `quiz-app-frontend`
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/build`
4. **Add Environment Variable:**
   - `REACT_APP_BACKEND_URL`: Your backend URL (e.g., `https://quiz-app-backend.onrender.com`)
5. **Deploy** - Render will build and deploy your frontend

### Using render.yaml (Alternative)

The repository includes a `render.yaml` file for automated deployment. Simply push your code to GitHub and connect it to Render.com. Render will automatically detect and deploy both services.

## Usage

### For Students

1. Open the app URL
2. Select "Student"
3. Enter your name
4. Wait for organizer authentication
5. Take the quiz when started
6. View the leaderboard after completion

### For Organizers

1. Open the app URL
2. Select "Organizer"
3. Enter master password (`admin123`)
4. Authenticate waiting students
5. Start the quiz when ready
6. Monitor the leaderboard in real-time
7. Reset the quiz to start a new session

## Project Structure

```
quiz-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── data/          # Quiz questions
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
├── server/                # Node.js backend
│   └── index.js
├── render.yaml           # Render deployment config
├── .env.example         # Environment variables template
└── README.md
```

## API Endpoints

### Backend API

- `GET /api/waiting-students` - Get list of waiting students
- `GET /api/authenticated-students` - Get list of authenticated students
- `GET /api/quiz-results` - Get quiz results
- `POST /api/start-quiz` - Start the quiz
- `POST /api/reset-quiz` - Reset the quiz (clears all data)

### Socket.io Events

**Client → Server:**
- `student-join` - Student joins waiting room
- `authenticate-student` - Organizer authenticates a student
- `submit-quiz` - Student submits quiz results

**Server → Client:**
- `waiting-students-updated` - Waiting students list updated
- `authenticated-students-updated` - Authenticated students list updated
- `student-authenticated` - Student was authenticated
- `quiz-started` - Quiz has started
- `quiz-results-updated` - Quiz results updated
- `quiz-reset` - Quiz has been reset

## Troubleshooting

### Socket.io Connection Issues

If you experience Socket.io connection errors in production:
1. Ensure the `CLIENT_URL` environment variable matches your frontend URL
2. Ensure the `REACT_APP_BACKEND_URL` matches your backend URL
3. Check that CORS is properly configured in the server

### Build Errors

If you encounter build errors:
1. Ensure all dependencies are installed in both `client` and `server` directories
2. Check that Node.js version is 14 or higher
3. Verify environment variables are set correctly

## License

This project is open source and available for educational purposes.
