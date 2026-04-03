import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Camera, Save, ArrowLeft, CheckCircle, ShieldAlert, Loader2 } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName) return toast.error('Display Name is required');

    setLoading(true);
    try {
      const res = await api.put('/users/profile', { displayName });
      setUser(res.data);
      toast.success('Profile updated successfully');
    } catch (_error: any) {
      toast.error(_error.response?.data?.message || 'Failed to update profile');
    } finally {

      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) return toast.error('File size too large (max 2MB)');

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const res = await api.put('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data);
      toast.success('Avatar updated successfully');
    } catch (_error: any) {
      toast.error(_error.response?.data?.message || 'Failed to upload avatar');
    } finally {

      setUploading(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium mb-4"
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700/50">
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className={`w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-xl transition-all ${uploading ? 'opacity-50 grayscale' : ''}`}
              />
            ) : (
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-4xl font-black text-white border-4 border-white dark:border-gray-700 shadow-xl ${uploading ? 'opacity-50' : ''}`}>
                {user?.displayName?.charAt(0).toUpperCase()}
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={32} className="text-white animate-spin" />
              </div>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-primary hover:bg-indigo-600 text-white p-2.5 rounded-full shadow-lg transform transition-transform hover:scale-110 active:scale-95"
              title="Change Avatar"
            >
              <Camera size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <h2 className="text-2xl font-bold mt-4 dark:text-white">{user?.displayName}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>

          <div className="mt-4 flex items-center gap-2">
            {user?.isVerified ? (
              <span className="flex items-center gap-1 text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full border border-green-200 dark:border-green-800">
                <CheckCircle size={14} /> Account Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                <ShieldAlert size={14} /> Not Activated
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 pl-1">Display Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="relative opacity-70">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 pl-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <button
            disabled={loading || uploading}
            className="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg hover:shadow-indigo-300/50 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <Save size={20} /> Save Changes
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Account created on {new Date(user?.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Profile;
