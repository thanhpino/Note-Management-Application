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
      } catch (_e) {
        console.error(_e);
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
          {notes.map(note => {
            const isLocked = !!note.notePasswordHash;
            const hasImages = note.images && note.images.length > 0;
            const firstImage = hasImages && !isLocked ? note.images[0] : null;

            return (
              <div 
                onClick={() => navigate(`/note/${note._id}`)} 
                key={note._id} 
                style={{ backgroundColor: note.color }}
                className={`group ${note.color ? '' : 'bg-white dark:bg-gray-800'} p-0 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col h-72`}
              >
                 {/* Image Preview */}
                 {firstImage && (
                   <div className="h-32 w-full overflow-hidden border-b border-gray-100/30 dark:border-gray-700/30">
                     <img src={firstImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   </div>
                 )}

                 <div className="p-6 flex flex-col flex-1">
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-400 to-indigo-500 opacity-80" />
                    
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 leading-tight flex items-center gap-2">
                       {isLocked && <Lock size={16} className="text-emerald-500 shrink-0" />}
                       {note.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mt-1 mb-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-white/50 dark:bg-indigo-900/30 w-fit px-3 py-1 rounded-full shadow-xs">
                        <Users size={10} />
                        <span>Shared</span>
                      </div>
                      {note.labels?.map((label: any) => (
                        <div key={label._id} className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-white/40 dark:bg-gray-700/50 dark:text-gray-400 px-2.5 py-1 rounded-full uppercase tracking-tight shadow-xs">
                          #{label.name}
                        </div>
                      ))}
                    </div>

                    <p className={`text-sm line-clamp-3 leading-relaxed flex-1 ${note.color ? 'text-gray-800' : 'text-gray-600 dark:text-gray-400'}`}>
                      {note.content}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-black/5 dark:border-gray-700/60 flex justify-between items-center shrink-0">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">{new Date(note.updatedAt).toLocaleDateString()}</span>
                      {note.userId?.displayName && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 rounded">By {note.userId.displayName}</span>
                      )}
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SharedNotes;
