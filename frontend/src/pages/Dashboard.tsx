import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import { Plus, LayoutGrid, List, X, Lock } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const [, setLabels] = useState<any[]>([]);
  const [activeLabel, setActiveLabel] = useState<any>(null);

  const location = useLocation();

  useEffect(() => {
    fetchNotes();
    fetchLabels();
  }, [location.search]);

  const fetchLabels = async () => {
    try {
      const res = await api.get('/labels');
      setLabels(res.data);
      const labelId = new URLSearchParams(location.search).get('label');
      if (labelId) {
        setActiveLabel(res.data.find((l: any) => l._id === labelId));
      } else {
        setActiveLabel(null);
      }
    } catch {
      // Ignore initial fetch errors
    }
  };

  // Load cache immediately on mount for better UX
  useEffect(() => {
    const cached = localStorage.getItem('notes_cache');
    if (cached) {
      setNotes(JSON.parse(cached));
      setLoading(false); // Show cached data while fetching fresh data
    }
  }, []);

  const fetchNotes = async () => {
    setLoading(notes.length === 0); // Only show loading if no cache
    try {
      const searchParams = new URLSearchParams(location.search);
      const labelId = searchParams.get('label');
      const url = labelId ? `/notes?label=${labelId}` : '/notes';
      const res = await api.get(url);
      setNotes(res.data);
      // Update cache
      localStorage.setItem('notes_cache', JSON.stringify(res.data));
    } catch {
      if (localStorage.getItem('notes_cache')) {
        toast.info('Working offline mode');
      } else {
        toast.error('Failed to fetch notes');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    try {
      const res = await api.post('/notes', { title: 'Untitled Note', content: '' });
      navigate(`/note/${res.data._id}`);
    } catch {
      toast.error('Could not create note');
    }
  };


  const filteredNotes = notes.filter(note =>
    note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">All Notes</h2>
          <div className="flex text-gray-500 text-sm mt-2 items-center gap-3">
            {activeLabel ? (
              <div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/40 text-primary dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 animate-in slide-in-from-left duration-300">
                <span className="font-bold flex items-center gap-1"><span className="text-xs">#</span>{activeLabel.name}</span>
                <button onClick={() => navigate('/')} className="hover:text-red-500 transition-colors p-0.5"><X size={14} /></button>
              </div>
            ) : (
              <span className="inline-block animate-typewriter text-primary font-medium pr-1">
                Manage your workspace • Organize your thoughts • Secure your ideas
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              <LayoutGrid size={18} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              <List size={18} />
            </button>
          </div>
          <button onClick={handleCreateNote} className="flex items-center gap-2 bg-linear-to-r from-primary to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-primary/30 dark:shadow-none hover:shadow-primary/50 hover:-translate-y-0.5 transform">
            <Plus size={20} strokeWidth={3} />
            <span className="hidden sm:inline">New Note</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`group bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700/60 animate-pulse flex ${viewMode === 'grid' ? 'flex-col h-64' : 'flex-row items-center gap-6'}`}>
              <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg ${viewMode === 'list' ? 'h-16 w-1/3' : 'h-6 w-3/4 mb-4'}`}></div>
              <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg ${viewMode === 'list' ? 'h-10 w-1/2' : 'h-24 w-full'}`}></div>
            </div>
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 mt-20">
          {searchQuery ? (
            <>
              <p className="text-xl font-medium">No notes found.</p>
              <p className="text-sm">Try adjusting your search keywords.</p>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <LayoutGrid size={40} className="text-primary opacity-60" />
              </div>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">Workspace is empty</p>
              <p className="text-sm text-gray-500">Kick things off by creating a new note.</p>
            </>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-500 ease-in-out"
          : "flex flex-col gap-4 transition-all duration-500 ease-in-out"}>
          {filteredNotes.map(note => {
            const firstImage = note.images && note.images.length > 0 ? note.images[0] : null;

            return (
              <div
                key={note.id || note._id}
                onClick={() => navigate(`/note/${note.id || note._id}`)}
                className={`group relative bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700/50 transition-all duration-300 cursor-pointer flex ${viewMode === 'grid' ? 'flex-col h-72 hover:-translate-y-1.5' : 'flex-row items-center gap-4 p-4 hover:translate-x-1'} overflow-hidden`}
                style={{
                  backgroundColor: note.color && !document.documentElement.classList.contains('dark') ? note.color : undefined
                }}
              >
                {/* Image Preview - Grid Mode */}
                {viewMode === 'grid' && firstImage && (
                  <div className="h-32 w-full overflow-hidden">
                    <img src={firstImage} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                )}

                <div className={`absolute top-0 left-0 bg-linear-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity ${viewMode === 'grid' ? 'w-full h-1' : 'h-full w-1'}`} />

                {/* Thumbnail - List Mode */}
                {viewMode === 'list' && firstImage && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                    <img src={firstImage} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className={`flex flex-col flex-1 ${viewMode === 'grid' ? 'p-0' : 'py-1'}`}>
                  <div className="px-6 py-4 flex-1">
                    <h3 className={`text-xl font-bold mb-3 line-clamp-2 leading-tight ${note.color ? 'text-gray-900' : 'text-gray-800 dark:text-white'}`}>
                      {note.is_pinned && <span title="Pinned" className="mr-2">📌</span>}
                      {note.is_password_protected && <Lock size={18} className="inline mr-2 text-emerald-500" />}
                      {note.title || 'Untitled Note'}
                    </h3>

                    {/* Image Preview */}
                    {note.images && note.images.length > 0 && !note.is_password_protected && (
                      <div className="mb-4 rounded-xl overflow-hidden h-32 border border-black/5 dark:border-white/5">
                        <img src={note.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {note.is_password_protected ? (
                      <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm italic py-2">
                        <Lock size={14} /> Content hidden for your privacy
                      </div>
                    ) : (
                      <p className={`${note.color ? 'text-gray-800' : 'text-gray-600 dark:text-gray-400'} text-sm leading-relaxed ${viewMode === 'grid' ? 'line-clamp-3' : 'line-clamp-1'}`}>
                        {note.content || <span className="opacity-40 italic">Empty note</span>}
                      </p>
                    )}
                  </div>

                  <div className={`${viewMode === 'grid' ? 'px-6 pb-4 flex justify-between items-center shrink-0 mt-auto' : 'text-right min-w-[100px] pr-4'}`}>
                    <span className={`text-xs font-medium ${note.color ? 'text-gray-700' : 'text-gray-400 dark:text-gray-500'}`}>{new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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

export default Dashboard;
