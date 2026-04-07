import { useState, useEffect } from 'react';
import { X, Lock } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

export const PasswordModal = ({ isOpen, onClose, noteId, isLocked, onLockSuccess }: any) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [mode, setMode] = useState<'set' | 'remove' | 'change'>(isLocked ? 'remove' : 'set');

  useEffect(() => {
    setMode(isLocked ? 'remove' : 'set');
    setPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
  }, [isLocked, isOpen]);

  if (!isOpen) return null;

  const handleAction = async () => {
    try {
      if (mode === 'remove') {
        await api.delete(`/notes/${noteId}/lock`, { data: { currentPassword } });
        toast.success('Note unlocked permanently');
        onLockSuccess(false);
      } else if (mode === 'change') {
        if (!currentPassword) return toast.error('Current password required');
        await api.put(`/notes/${noteId}/lock`, { currentPassword, newPassword: password, confirmPassword });
        toast.success('Password changed');
        onLockSuccess(true);
      } else {
        await api.post(`/notes/${noteId}/lock`, { password, confirmPassword });
        toast.success('Note locked');
        onLockSuccess(true);
      }
      onClose();
      setPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to update lock');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <Lock size={20} className="text-primary" /> {isLocked ? 'Remove Password' : 'Set Password'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {isLocked && (
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl mb-6">
            <button onClick={() => setMode('remove')} className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${mode === 'remove' ? 'bg-white dark:bg-gray-800 shadow-sm text-primary' : 'text-gray-500'}`}>Remove</button>
            <button onClick={() => setMode('change')} className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${mode === 'change' ? 'bg-white dark:bg-gray-800 shadow-sm text-primary' : 'text-gray-500'}`}>Change</button>
          </div>
        )}
        <div className="space-y-4 mb-6">
          {(mode === 'remove' || mode === 'change') && (
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-primary"
            />
          )}
          {(mode === 'set' || mode === 'change') && (
            <>
              <input
                type="password"
                placeholder="Enter new password"
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-primary"
              />
            </>
          )}
        </div>

        <button onClick={handleAction} className="w-full bg-linear-to-r from-primary to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-md">
          {mode === 'remove' ? 'Remove Lock' : mode === 'change' ? 'Change Password' : 'Enable Lock'}
        </button>
      </div>
    </div>
  );
};
