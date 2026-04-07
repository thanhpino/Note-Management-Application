import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 overflow-hidden">
      {/* Left Column: Hero/Branding (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-950 overflow-hidden border-r border-gray-800/50">
        {/* Background Decorative Gradients - Floating */}
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] left-[-5%] w-[450px] h-[450px] bg-primary/30 rounded-full mix-blend-screen filter blur-[100px] opacity-60"
        ></motion.div>
        <motion.div
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 40, -40, 0],
            scale: [1, 1.2, 1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[120px] opacity-60"
        ></motion.div>

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col justify-between p-12 lg:p-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-black tracking-widest flex items-center gap-2 cursor-default select-none mb-12">
              <motion.span
                whileHover={{ rotate: 0, scale: 1.1 }}
                initial={{ rotate: -12, scale: 0.8 }}
                animate={{ rotate: -6, scale: 1 }}
                className="text-white bg-primary w-12 h-12 flex items-center justify-center rounded-xl shadow-2xl shadow-primary/40"
              >N</motion.span>
              <span className="text-white">O</span>
              <span className="text-primary font-bold">T</span>
              <span className="text-white">E</span>
              <motion.span
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-900 bg-white px-2 py-0.5 rounded-lg shadow-sm transform scale-90"
              >S</motion.span>
            </h1>

            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl font-black text-white leading-[1.1] mb-8 tracking-tighter"
            >
              Capture your dreams.<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-indigo-400 to-purple-400">Master your world.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="text-xl text-gray-400 max-w-md leading-relaxed font-light"
            >
              Step into the minimalist, lightning-fast workspace designed to keep your ideas secure, organized, and crystal clear.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-5 text-sm text-gray-400 font-medium"
          >
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <motion.img
                  key={i}
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-12 h-12 rounded-full border-2 border-gray-950 shadow-xl cursor-pointer"
                  src={`https://i.pravatar.cc/150?img=${i + 10}`}
                  alt="User"
                />
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-gray-950 bg-gray-900 flex items-center justify-center text-xs text-white font-bold shadow-xl">99+</div>
            </div>
            <p className="max-w-[200px] leading-snug">Join thousands of professionals mastering their workspace.</p>
          </motion.div>
        </div>

        {/* Subtle dot pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-size-[32px_32px] opacity-30"></div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-gray-50 dark:bg-gray-900/50 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-700/50 relative z-20"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Decorative background for the form area */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
