import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Trash2, Unlock, Lock, Loader2, Image as ImageIcon, Pin, X, Hash, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import socket from '../services/socket';
import { ShareModal } from '../components/ShareModal';
import { PasswordModal } from '../components/PasswordModal';
import { VerifyPasswordModal } from '../components/VerifyPasswordModal';

const NoteEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [color, setColor] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [isNoteReady, setIsNoteReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Labels
  const [availableLabels, setAvailableLabels] = useState<any[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [showLabelMenu, setShowLabelMenu] = useState(false);

  const contentRef = useRef(content);
  const titleRef = useRef(title);

  useEffect(() => {
    contentRef.current = content;
    titleRef.current = title;
  }, [content, title]);

  useEffect(() => {
    if (id && id !== 'new') {
      api.get(`/notes`)
        // Actually, let's fetch all and filter.
        .then(res => {
          const note = res.data.find((n: any) => n._id === id);
          if (note) {
            setTitle(note.title);
            setContent(note.content);
            setIsPinned(note.isPinned || false);
            setImages(note.images || []);
            setSelectedLabels(note.labels || []);
            setColor(note.color || '');
            setIsLocked(!!note.notePasswordHash);

            // Temporary checking logic
            if (note.notePasswordHash && !localStorage.getItem(`note_token_${note._id}`)) {
              setRequiresVerification(true);
            }
            setIsNoteReady(true);
            socket.emit('join_note_room', { noteId: id });
          } else {
            toast.error('Note not found');
            navigate('/');
          }
        });
    } else {
      setIsNoteReady(true);
    }

    return () => {
      if (id && id !== 'new') {
        socket.emit('leave_note_room', { noteId: id });
      }
    };
  }, [id, navigate]);

  useEffect(() => {
    socket.on('note_updated', (data) => {
      setTitle(data.title);
      setContent(data.content);
      toast.info('Note updated by collaborator', { autoClose: 2000, position: 'bottom-left' });
    });
    return () => {
      socket.off('note_updated');
    };
  }, []);

  useEffect(() => {
    // Load available labels
    api.get('/labels').then(res => setAvailableLabels(res.data)).catch(() => { });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (id === 'new') {
        const res = await api.post('/notes', { title, content, labels: selectedLabels, color });
        navigate(`/note/${res.data._id}`, { replace: true });
        toast.success('Note created');
      } else {
        await api.put(`/notes/${id}`, { title, content, labels: selectedLabels, color, images });
        socket.emit('note_content_change', { noteId: id, title, content, images, updatedAt: new Date() });

      }
    } catch (error) {
      toast.error('Failed to save note');
    } finally {
      setTimeout(() => setSaving(false), 500);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.delete(`/notes/${id}`);
        toast.success('Note deleted');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };

  const handleTogglePin = async () => {
    try {
      await api.put(`/notes/${id}/pin`);
      setIsPinned(!isPinned);
      toast.success(isPinned ? 'Note unpinned' : 'Note pinned');
    } catch {
      toast.error('Failed to change pin status');
    }
  };

  const handleVerifyPassword = async (password: string) => {
    try {
      const res = await api.post(`/notes/${id}/verify-password`, { password });
      localStorage.setItem(`note_token_${id}`, res.data.tempToken);
      setRequiresVerification(false);
      toast.success('Note unlocked');
    } catch {
      toast.error('Incorrect password');
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || id === 'new') return;
    setUploadingImage(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach(f => formData.append('images', f));
    try {
      const res = await api.post(`/notes/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImages(res.data.images);
      toast.success('Images uploaded');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async (url: string) => {
    const originalImages = [...images];
    // Update local state immediately for instant feedback
    const newImages = images.filter(img => img !== url);
    setImages(newImages);

    try {
      // Use query parameter to avoid issues with slashes in the URL path
      const res = await api.delete(`/notes/${id}/images?url=${encodeURIComponent(url)}`);
      // Update with server truth just in case, but usually it matches
      setImages(res.data.images);
      toast.info('Image removed from note');
    } catch (error) {
      // Rollback on failure
      setImages(originalImages);
      toast.error('Failed to remove image from server');
    }
  };




  // Debounced Auto-save simulator (1000ms as requested)
  useEffect(() => {
    if (!isNoteReady || (!title && !content)) return; // Guard for empty content
    const timeoutId = setTimeout(() => {
      handleSave();
    }, 1000);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, selectedLabels, color, images, isNoteReady]);


  if (!isNoteReady) {
    return <div className="h-full flex items-center justify-center text-gray-500">Loading...</div>;
  }

  const colors = [
    { name: 'Default', value: '' },
    { name: 'Red', value: '#F28B82' },
    { name: 'Orange', value: '#FBBC04' },
    { name: 'Yellow', value: '#FFF475' },
    { name: 'Green', value: '#CCFF90' },
    { name: 'Teal', value: '#A7FFEB' },
    { name: 'Blue', value: '#CBF0F8' },
    { name: 'Dark Blue', value: '#AECBFA' },
    { name: 'Purple', value: '#D7AEFB' },
    { name: 'Pink', value: '#FDCFE8' },
    { name: 'Brown', value: '#E6C9A8' },
    { name: 'Gray', value: '#E8EAED' },
  ];

  return (
    <div
      className={`h-full flex flex-col max-w-4xl mx-auto w-full shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/60 transition-colors duration-500`}
      style={{ backgroundColor: color || undefined }}
    >
      <header className={`px-6 py-4 border-b border-gray-100/30 dark:border-gray-700/60 flex items-center justify-between ${color ? 'bg-black/5' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2 font-medium">
            <ArrowLeft size={20} /> Back
          </button>
          {saving ? (
            <span className="text-xs text-primary flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-full"><Loader2 size={12} className="animate-spin" /> Saving...</span>
          ) : (
            <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">Saved ✓</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleTogglePin} className={`p-2 rounded-xl transition-all ${isPinned ? 'text-amber-500 bg-amber-50' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`} title={isPinned ? "Unpin" : "Pin"}>
            <Pin size={20} className={isPinned ? 'fill-current' : ''} />
          </button>
          <button onClick={() => setShowShareModal(true)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all" title="Share Note">
            <Share2 size={20} />
          </button>
          <button onClick={() => setShowPasswordModal(true)} className={`p-2 rounded-xl transition-all ${isLocked ? 'text-emerald-500 bg-emerald-50' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`} title="Lock Note">
            {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
          </button>
          <button onClick={handleDelete} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all" title="Delete">
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note Title"
          className={`text-4xl font-extrabold bg-transparent border-none outline-none text-gray-900 ${!color && 'dark:text-white'} placeholder-gray-300 ${!color && 'dark:placeholder-gray-600'} focus:ring-0 w-full`}
        />
        {/* Label Chips */}
        {selectedLabels.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1">
            {selectedLabels.map(id => {
              const label = availableLabels.find(l => l._id === id);
              if (!label) return null;
              return (
                <div key={id} className="flex items-center gap-1.5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-indigo-300 px-3 py-1 rounded-full border border-primary/20 group/chip hover:bg-primary/20 transition-all">
                  <Tag size={12} />
                  <span className="text-sm font-medium">{label.name}</span>
                  <button 
                    onClick={() => setSelectedLabels(selectedLabels.filter(sid => sid !== id))}
                    className="hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-white/50 dark:hover:bg-gray-800/50"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Start writing your thoughts..."
          className={`flex-1 w-full text-lg leading-relaxed text-gray-700 ${!color && 'dark:text-gray-300'} bg-transparent border-none outline-none resize-none placeholder-gray-400 ${!color && 'dark:placeholder-gray-600'} focus:ring-0`}
        />
      </div>


      <footer className={`px-6 py-4 border-t border-gray-100/30 dark:border-gray-700/60 flex flex-col gap-6 ${color ? 'bg-black/5' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {colors.map(c => (
              <button
                key={c.name}
                onClick={() => setColor(c.value)}
                title={c.name}
                className={`w-6 h-6 rounded-full border border-black/10 transition-all hover:scale-125 ${color === c.value ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                style={{ backgroundColor: c.value || 'white' }}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {content.length} characters
          </span>
        </div>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((url: string, index: number) => (
              <div key={index} className="relative group rounded-xl overflow-hidden aspect-square w-24 shadow-md border-2 border-white dark:border-gray-800">
                <img src={url} alt="attached" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <button
                  onClick={() => handleRemoveImage(url)}
                  className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-[2px] transition-all"
                  title="Remove Image"
                >
                  <div className="bg-red-500 p-2 rounded-full shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                    <X size={16} />
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            type="file" multiple accept="image/*"
            className="hidden" ref={fileInputRef}
            onChange={handleImageUpload}
          />
          
          <div className="flex items-center bg-white/50 dark:bg-gray-800/50 p-1 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm backdrop-blur-sm">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={id === 'new' || uploadingImage}
              className="px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-primary hover:shadow-sm transition-all disabled:opacity-50"
            >
              {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} className="text-indigo-500" />}
              {id === 'new' ? 'Save to Add Image' : 'Add Image'}
            </button>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

            <div className="relative">
              <button 
                onClick={() => setShowLabelMenu(!showLabelMenu)} 
                className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all ${showLabelMenu ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-primary hover:shadow-sm'}`}
              >
                <Hash size={16} className="text-purple-500" />
                Labels {selectedLabels.length > 0 && <span className="bg-primary/10 px-1.5 rounded text-[10px] text-primary">{selectedLabels.length}</span>}
              </button>

              {showLabelMenu && (
                <div className="absolute bottom-full left-0 mb-4 w-56 bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700/60 rounded-2xl p-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <p className="text-[10px] font-black text-gray-400 mb-3 px-2 uppercase tracking-widest">Organize with Labels</p>
                  <div className="max-h-48 overflow-y-auto pr-1 flex flex-col gap-1 custom-scrollbar">
                    {availableLabels.length === 0 ? (
                      <p className="text-xs px-2 py-4 text-center text-gray-400 italic">No labels created yet</p>
                    ) : (
                      availableLabels.map(lbl => (
                        <label key={lbl._id} className="flex items-center gap-3 px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl cursor-pointer transition-all group/label">
                          <input
                            type="checkbox"
                            className="rounded-md text-primary focus:ring-primary w-4 h-4 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 transition-all border-2 group-hover/label:border-primary"
                            checked={selectedLabels.includes(lbl._id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedLabels([...selectedLabels, lbl._id]);
                              else setSelectedLabels(selectedLabels.filter(id => id !== lbl._id));
                            }}
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-1">{lbl.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>


      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        noteId={id}
      />
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        noteId={id}
        isLocked={isLocked}
        onLockSuccess={setIsLocked}
      />
      <VerifyPasswordModal
        isOpen={requiresVerification}
        onSubmit={handleVerifyPassword}
      />
    </div>
  );
};

export default NoteEditor;
