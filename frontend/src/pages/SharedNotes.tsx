import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Lock } from 'lucide-react';
import api from '../services/api';

const SharedNotes: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await api.get('/notes/shared-with-me');
        setNotes(res.data);
        
        // Also clear notifications if any
        await api.put('/users/clear-notification');
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, []);

  return (
    <div className="flex-1 w-full flex flex-col p-8 overflow-y-auto max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center">
          <Users className="text-primary dark:text-indigo-400" size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Shared with Me</h2>
          <p className="text-gray-500 text-sm mt-1">Notes that others have given you access to</p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">Loading shared notes...</div>
      ) : notes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4 mt-20">
           <FileText size={48} className="opacity-20" />
           <p>No notes have been shared with you yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {notes.map(note => (
            <div onClick={() => navigate(`/note/${note._id}`)} key={note._id} className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col h-64">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-80" />
               
               <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 leading-tight flex items-center gap-2">
                  {note.notePasswordHash && <Lock size={16} className="text-emerald-500 shrink-0" />}
                  {note.title}
               </h3>
               
               <div className="flex items-center gap-2 mb-4 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 w-fit px-3 py-1 rounded-full">
                 <Users size={12} />
                 <span>Shared by Owner</span>
               </div>

               <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed flex-1">
                 {note.content}
               </p>
               
               <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/60 flex justify-between items-center shrink-0">
                 <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{new Date(note.updatedAt).toLocaleDateString()}</span>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedNotes;
