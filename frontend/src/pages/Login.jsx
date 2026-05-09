import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Backend request
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // 1. LocalStorage mein data save karein
      localStorage.setItem("user", JSON.stringify(res.data));
      
      // 2. CRITICAL FIX: 'navigate' ki jagah full reload use karein
      // Isse App.jsx state properly update hogi aur "Hi, Shivam Yadav" dikhega
      window.location.href = "/"; 
      
    } catch (err) {
      console.error("Login Error:", err);
      // Backend se aane wale message ko correctly handle karein
      setError(err.response?.data?.message || err.response?.data || "Invalid Email or Password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1e293b] p-10 rounded-3xl border border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-300">
        <h2 className="text-4xl font-bold text-cyan-400 mb-2 text-center">Welcome Back</h2>
        <p className="text-slate-400 text-center mb-8">Login to manage your quizzes</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              placeholder="shivam@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-medium mb-2 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center
              ${loading ? 'bg-cyan-800 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20'}`}
          >
            {loading ? (
              <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-400 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-400 hover:underline font-medium">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;