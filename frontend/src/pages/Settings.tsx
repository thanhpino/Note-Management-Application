import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, KeyRound } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [fontSize, setFontSize] = useState(localStorage.getItem('appFontSize') || '16px');

  const handleThemeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleFontSizeChange = (val: string) => {
    setFontSize(val);
    localStorage.setItem('appFontSize', val);
    document.documentElement.style.fontSize = val;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return toast.error('Please fill all fields');
    if (newPassword.length < 6) return toast.error('New password must be at least 6 length');

    setLoading(true);
    try {
      await api.put('/users/change-password', { currentPassword, newPassword });
      toast.success('Password updated successfully. Please login again.');
      logout();
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="flex-1 w-full flex flex-col p-8 overflow-y-auto max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
          <SettingsIcon className="text-gray-700 dark:text-gray-300" size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Settings</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your account preferences</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-8 mb-8">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700/60 pb-4">
          <KeyRound size={20} className="text-primary" /> Change Password
        </h3>
        
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
            <input 
              type="password" 
              value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <input 
               type="password" 
               value={newPassword} onChange={e => setNewPassword(e.target.value)}
               className="w-full px-4 py-2.5 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button disabled={loading} className="mt-4 bg-primary hover:bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md disabled:opacity-70 flex items-center gap-2">
            <Save size={18} /> Update Password
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-8">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700/60 pb-4">
          Preferences
        </h3>
        <div className="space-y-6 max-w-md">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500">Toggle dark theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isDarkMode}
                onChange={(e) => handleThemeToggle(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Font Size Toggle */}
          <div>
            <p className="font-medium text-gray-800 dark:text-white mb-2">App Font Size</p>
            <select 
              className="w-full px-4 py-2.5 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-primary"
              value={fontSize}
              onChange={(e) => handleFontSizeChange(e.target.value)}
            >
              <option value="14px">Small (14px)</option>
              <option value="16px">Medium (16px) - Default</option>
              <option value="18px">Large (18px)</option>
              <option value="20px">Extra Large (20px)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
