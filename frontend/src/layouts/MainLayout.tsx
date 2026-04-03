import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Settings, Search, Menu, X, Users } from 'lucide-react';
import { LabelManager } from '../components/LabelManager';

const MainLayout: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">Loading workspace...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navLinks = [
    { name: 'All Notes', path: '/', icon: <Home size={20} /> },
    { name: 'Shared with Me', path: '/shared', icon: <Users size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-16 flex justify-between items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-black tracking-widest flex items-center gap-1 cursor-default select-none">
            <span className="text-white bg-primary w-8 h-8 flex items-center justify-center rounded-lg shadow-lg shadow-primary/40 transform -rotate-6 transition-transform hover:rotate-0">N</span>
            <span className="text-gray-800 dark:text-white">O</span>
            <span className="text-primary font-bold">T</span>
            <span className="text-gray-800 dark:text-white">E</span>
            <span className="text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 px-2 py-0.5 rounded text-lg shadow-sm transform scale-90">S</span>
          </h1>
          <button className="md:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navLinks.map(item => (
             <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300/50 dark:shadow-none font-medium' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
              }`}
             >
               {item.icon} {item.name}
             </Link>
          ))}
          
          <div className="flex-1 pb-2">
            <LabelManager activeLabelId={new URLSearchParams(location.search).get('label')} onSelectLabel={(id) => {
               if (id) {
                 navigate(`/?label=${id}`);
               } else {
                 navigate(`/`);
               }
            }} />
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/80 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.displayName} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate dark:text-white group-hover:text-primary transition-colors">{user.displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                logout();
              }} 
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors" 
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 bg-gray-50/50 dark:bg-gray-900/50">
        {!user.isVerified && (
          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-6 py-2 text-sm flex items-center justify-center gap-3 shadow-sm border-b border-amber-200 dark:border-amber-800">
            <span>Please check your email ({user.email}) to activate your account.</span>
            <button 
              onClick={async () => {
                try {
                  const api = (await import('../services/api')).default;
                  const { toast } = await import('react-toastify');
                  await api.post('/auth/resend-activation');
                  toast.success('Activation email resent! Check your inbox.');
                } catch(_e) {
                  const { toast } = await import('react-toastify');
                  toast.error('Failed to resend email, try again later.');
                }

              }}
              className="bg-amber-500 text-white px-3 py-1 rounded-md hover:bg-amber-600 transition-colors font-bold text-xs shadow-sm">
              Resend Email
            </button>
          </div>
        )}
        <header className="h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm z-10 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <button className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="relative max-w-md w-full hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search notes..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 border-none focus:ring-2 focus:ring-primary text-sm outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet context={{ searchQuery }} />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
