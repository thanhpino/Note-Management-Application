import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      {/* Left Column: Hero/Branding (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/40 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/40 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Content */}
        <div className="relative z-10 w-full flex flex-col justify-between p-12 lg:p-20">
          <div>
            <h1 className="text-4xl font-black tracking-widest flex items-center gap-2 cursor-default select-none mb-12">
              <span className="text-white bg-primary w-12 h-12 flex items-center justify-center rounded-xl shadow-lg shadow-primary/40 transform -rotate-6 transition-transform hover:rotate-0">N</span>
              <span className="text-white">O</span>
              <span className="text-primary font-bold">T</span>
              <span className="text-white">E</span>
              <span className="text-gray-900 bg-white px-2 py-0.5 rounded-lg shadow-sm transform scale-90">S</span>
            </h1>
            
            <h2 className="text-5xl font-extrabold text-white leading-tight mb-6">
              Capture your thoughts.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Master your world.</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-md leading-relaxed font-light">
              Experience the minimalist, lightning-fast workspace designed to keep your ideas secure, organized, and perfectly clear.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
            <div className="flex -space-x-4">
              <img className="w-10 h-10 rounded-full border-2 border-gray-900" src="https://i.pravatar.cc/100?img=1" alt="User" />
              <img className="w-10 h-10 rounded-full border-2 border-gray-900" src="https://i.pravatar.cc/100?img=2" alt="User" />
              <img className="w-10 h-10 rounded-full border-2 border-gray-900" src="https://i.pravatar.cc/100?img=3" alt="User" />
              <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-xs text-white">99+</div>
            </div>
            <p>Join thousands of professionals already using Notes.</p>
          </div>
        </div>
        
        {/* Subtle dot pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-gray-50 dark:bg-gray-900 z-10 transition-colors duration-300">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-2xl shadow-indigo-100/50 dark:shadow-none border border-gray-100 dark:border-gray-700 relative z-20">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
