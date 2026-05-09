import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import CreateQuiz from './pages/CreateQuiz';
import Login from './pages/Login';
import QuizPlay from './pages/QuizPlay';
import Register from './pages/Register';
import Navbar from './components/Navbar'; 

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("user");
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login"; 
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0f172a]">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="pt-4"> 
          <Routes key={user ? user._id : 'guest'}>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/create-quiz" element={user ? <CreateQuiz /> : <Navigate to="/login" />} />
            <Route path="/play/:id" element={<QuizPlay />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;