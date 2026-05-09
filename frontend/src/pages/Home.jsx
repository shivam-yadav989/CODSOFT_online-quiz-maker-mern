import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // 🔥 FIX: Pehle URL sirf '/api/quizzes' tha, ise '/api/quizzes/all' kar diya
        const res = await axios.get('http://localhost:5000/api/quizzes/all');
        setQuizzes(res.data);
      } catch (err) {
        console.log("Error fetching quizzes:", err);
      }
    };
    fetchQuizzes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleCreateClick = () => {
    if (user) {
      navigate('/create-quiz'); 
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-cyan-400">Online Quiz Maker</h1>
          <p className="text-slate-400 mt-2">Manage and take your quizzes</p>
        </div>
        
        <div className="flex gap-6 items-center">
          {!user ? (
            <Link to="/login" className="text-slate-300 hover:text-white font-medium">Login</Link>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-slate-400">Hi, <b className="text-cyan-400">{user.username}</b></span>
              <button onClick={handleLogout} className="text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition-all">Logout</button>
            </div>
          )}
          
          <button onClick={handleCreateClick} className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl font-bold shadow-lg shadow-cyan-900/20 transition-all transform active:scale-95">+ Create New Quiz</button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6">Available Quizzes</h2>
      
      {quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-all group">
              <h3 className="text-2xl font-bold mb-1">{quiz.title}</h3>
              <p className="text-slate-400 text-sm mb-6">{quiz.questions?.length || 0} Questions Available</p>
              <button onClick={() => navigate(`/play/${quiz._id}`)} className="w-full bg-slate-800 group-hover:bg-cyan-600 py-3 rounded-xl font-semibold transition-all">Start Now</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#1e293b]/30 rounded-3xl border border-dashed border-slate-700">
          <p className="text-slate-500 text-lg">No quizzes available yet. Be the first to create one!</p>
          <button onClick={handleCreateClick} className="mt-4 text-cyan-400 hover:underline">Create Quiz Now</button>
        </div>
      )}
    </div>
  );
};

export default Home;