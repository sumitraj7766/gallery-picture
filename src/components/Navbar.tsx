import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Image as ImageIcon, Heart } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-zinc-950 border-b border-white/10 py-4 px-6 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <Link to="/gallery" className="flex items-center gap-2 text-xl font-bold text-white">
        <ImageIcon className="text-emerald-500" />
        <span>Pixabay Gallery</span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/gallery" className="text-zinc-400 hover:text-white transition-colors">Gallery</Link>
            <button 
              onClick={() => navigate('/gallery', { state: { showFavorites: true } })}
              className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
            >
              <Heart size={18} className="text-red-500" />
              <span>Favorites</span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <span className="text-zinc-300 text-sm">Hi, {user.name}</span>
              <button 
                onClick={handleLogout}
                className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="text-zinc-400 hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
