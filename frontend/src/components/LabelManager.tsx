import { useState, useEffect } from 'react';
import { Plus, X, Tag, Edit2, Check, Trash2 } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

export const LabelManager = ({ activeLabelId, onSelectLabel }: { activeLabelId?: string | null, onSelectLabel: (id: string | null) => void }) => {
  const [labels, setLabels] = useState<any[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  async function fetchLabels() {
    try {
      const res = await api.get('/labels');
      setLabels(res.data);
    } catch {
      // Silent fail for initial fetch
    }
  }

  useEffect(() => {
    fetchLabels();
  }, []);



  const handleCreate = async () => {
    if (!newLabel.trim()) return;
    try {
      const res = await api.post('/labels', { name: newLabel });
      setLabels([...labels, res.data]);
      setNewLabel('');
      toast.success('Label created');
    } catch (_e) {
      toast.error('Failed to create label');
    }

  };

  const handleUpdate = async (id: string) => {
    try {
      await api.put(`/labels/${id}`, { name: editName });
      setLabels(labels.map(l => l._id === id ? { ...l, name: editName } : l));
      setEditingId(null);
      toast.success('Label updated');
    } catch (_e) {
      toast.error('Failed to update label');
    }

  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/labels/${id}`);
      setLabels(labels.filter(l => l._id !== id));
      toast.success('Label deleted');
    } catch (_e) {
      toast.error('Failed to delete label');
    }

  };

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between px-4 mb-2">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Labels</p>
      </div>

      <ul className="space-y-1">
        <li>
           <button onClick={() => onSelectLabel(null)} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-left group ${!activeLabelId ? 'bg-indigo-600 text-white shadow-md dark:shadow-none font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
             <Tag size={16} className={`${!activeLabelId ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500'} transition-colors`} /> All Labels
           </button>
        </li>
        {labels.map(l => (
          <li key={l.id} className="relative group">
            <div className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-left ${activeLabelId === l.id ? 'bg-indigo-600 text-white shadow-md font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
              <Tag size={16} className={`${activeLabelId === l.id ? 'text-white' : 'text-gray-400'}`} />
              {editingId === l.id ? (
                <div className="flex items-center flex-1 gap-2">
                  <input 
                    type="text" autoFocus
                    value={editName} onChange={e => setEditName(e.target.value)}
                    className={`flex-1 bg-white dark:bg-gray-800 border ${activeLabelId === l.id ? 'border-white text-gray-800' : 'border-indigo-500'} text-sm px-2 py-0.5 rounded outline-none`}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate(l.id)}
                  />
                  <button onClick={() => handleUpdate(l.id)} className="text-emerald-500"><Check size={14}/></button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-red-500"><X size={14}/></button>
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-between">
                  <span className="flex-1 truncate cursor-pointer text-sm" onClick={() => onSelectLabel(l.id)}>{l.name}</span>
                  <div className="hidden group-hover:flex items-center gap-2">
                    <button onClick={() => { setEditingId(l.id); setEditName(l.name); }} className="text-gray-400 hover:text-indigo-500"><Edit2 size={12}/></button>
                    <button onClick={() => handleDelete(l.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={12}/></button>
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
        <li>
            <div className="w-full flex items-center gap-3 px-4 py-2 mt-1 rounded-xl text-gray-600 dark:text-gray-300">
               <Plus size={16} className="text-gray-400" />
               <input 
                 type="text" 
                 placeholder="New label..."
                 value={newLabel}
                 onChange={e => setNewLabel(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleCreate()}
                 className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-400"
               />
            </div>
        </li>
      </ul>
    </div>
  );
};
