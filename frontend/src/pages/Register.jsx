import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  // Model ke hisaab se state variables
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Backend request mein 'username' hi bhejna
      await axios.post('http://localhost:5000/api/auth/register', { 
        username, 
        email, 
        password 
      });
      
      alert("Account created successfully! Please login.");
      navigate('/login'); 
    } catch (err) {
      setError(err.response?.data || "Registration failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1e293b] p-10 rounded-3xl border border-slate-700 shadow-2xl">
        <h2 className="text-4xl font-bold text-cyan-400 mb-2 text-center">Create Account</h2>
        <p className="text-slate-400 text-center mb-8">Join the Online Quiz Maker community</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-slate-400 text-sm mb-2 ml-1">Username</label>
            <input 
              type="text" 
              className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-cyan-500 transition-all"
              placeholder="shivam_yadav"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-cyan-500 transition-all"
              placeholder="shivam@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-cyan-500 transition-all"
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
              'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:underline font-medium">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;