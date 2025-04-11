
import './App.css'
import Chatbot from "./components/Chatbot"; // Adjust the path if needed
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../frontend/src/Components/context/AuthContext';
import ProtectedRoute from '../frontend/src/Components/ProtectedRoute';
import Navbar from '../frontend/src/Components/Navbar';
import Home from './components/Home';
import Books from './components/Books';
import Notes from './components/Notes';
import QuestionPapers from './components/QuestionPapers';
import Feedback from './components/Feedback';
import AuthPage from '../frontend/src/Components/AuthPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <h1>Welcome to EduTrade</h1>
      <Chatbot />
          <Routes>
            {/* Public Route */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            
            <Route path="/books" element={
              <ProtectedRoute>
                <Books />
              </ProtectedRoute>
            } />
            
            <Route path="/notes" element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            } />
            
            <Route path="/question-papers" element={
              <ProtectedRoute>
                <QuestionPapers />
              </ProtectedRoute>
            } />
            
            <Route path="/feedback" element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            } />

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}



export default App




