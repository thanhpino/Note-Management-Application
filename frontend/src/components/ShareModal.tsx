import { useState, useEffect } from 'react';
import { X, UserPlus, Trash2 } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

export const ShareModal = ({ isOpen, onClose, noteId }: any) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [shares, setShares] = useState([]);

  useEffect(() => {
    if (isOpen && noteId && noteId !== 'new') {
      api.get(`/notes/${noteId}/shares`)
        .then(res => setShares(res.data))
        .catch(() => { });
    }
  }, [isOpen, noteId]);

  if (!isOpen) return null;

  const handleShare = async () => {
    try {
      await api.post(`/notes/${noteId}/shares`, { email, permission });
      toast.success('Shared successfully');
      setEmail('');
      api.get(`/notes/${noteId}/shares`).then(res => setShares(res.data));
    } catch (_e: any) {
      toast.error(_e.response?.data?.message || 'Failed to share');
    }

  };

  const handleRevoke = async (uid: string) => {
    try {
      await api.delete(`/notes/${noteId}/shares/${uid}`);
      setShares(shares.filter((s: any) => s.userId._id !== uid));
      toast.success('Access revoked');
    } catch (_e: any) {
      toast.error('Failed to revoke access');
    }

  };

  return (
    <div className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold dark:text-white">Share Note</h2>
          <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="email"
            placeholder="User Email"
            value={email} onChange={e => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-primary"
          />
          <select value={permission} onChange={e => setPermission(e.target.value)} className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-primary">
            <option value="view">View</option>
            <option value="edit">Edit</option>
          </select>
          <button onClick={handleShare} className="bg-primary hover:bg-indigo-600 text-white p-2 rounded-lg transition-colors"><UserPlus size={20} /></button>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Shared with</h3>
          {shares.length === 0 && <p className="text-sm text-gray-500">Not shared with anyone</p>}
          {shares.map((s: any) => (
            <div key={s.userId._id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
              <div>
                <p className="text-sm font-medium dark:text-white">{s.userId.email}</p>
                <p className="text-xs text-gray-500 capitalize">{s.permission}</p>
              </div>
              <button onClick={() => handleRevoke(s.userId._id)} className="text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
