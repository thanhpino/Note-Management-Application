import { useState } from 'react';
import { Lock } from 'lucide-react';

export const VerifyPasswordModal = ({ isOpen, onSubmit }: { isOpen: boolean, onSubmit: (password: string) => void }) => {

  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-200 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center transform transition-all scale-100">
        <div className="w-16 h-16 bg-linear-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Lock size={32} className="text-primary dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Note Locked</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">This note is protected. Please enter the password to view it.</p>

        <input
          type="password"
          placeholder="Enter Password"
          value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSubmit(password)}
          className="w-full px-4 py-3.5 mb-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary text-center text-lg tracking-widest transition-all"
        />

        <button onClick={() => onSubmit(password)} className="w-full bg-linear-to-r from-primary to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]">
          Unlock
        </button>
      </div>
    </div>
  );
};
