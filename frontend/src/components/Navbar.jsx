import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-[#1e293b] p-4 border-b border-slate-700 flex justify-between items-center px-8">
      <Link to="/" className="text-2xl font-bold text-cyan-400">QUIZMAKER</Link>
      
      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-slate-300">Hi, <b className="text-white">{user.username || user.name}</b></span>
            <button 
              onClick={onLogout}
              className="bg-red-500/10 text-red-500 border border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="text-slate-300 py-2">Login</Link>
            <Link to="/register" className="bg-cyan-600 px-4 py-2 rounded-xl text-white font-bold">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;