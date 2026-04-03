import { useEffect, useState } from 'react';
import { db } from '../config/indexedDB';
import api from '../services/api';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      performSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const performSync = async () => {
    try {
      // 1. Get all pending offline changes
      const pendingUpdates = await db.notes.where('syncStatus').equals('pending_update').toArray();
      const pendingCreates = await db.notes.where('syncStatus').equals('pending_create').toArray();
      const pendingDeletes = await db.notes.where('syncStatus').equals('pending_delete').toArray();

      // 2. Push local changes to server
      for (const note of pendingCreates) {
        const { _id, syncStatus, ...data } = note;
        const res = await api.post('/notes', data);
        await db.notes.delete(note._id);
        await db.notes.put({ ...res.data, syncStatus: 'synced' });
      }

      for (const note of pendingUpdates) {
        const { _id, syncStatus, ...data } = note;
        const res = await api.put(`/notes/${_id}`, data);
        await db.notes.put({ ...res.data, syncStatus: 'synced' });
      }

      for (const note of pendingDeletes) {
        await api.delete(`/notes/${note._id}`);
        await db.notes.delete(note._id);
      }

    } catch (error) {
      console.error('Failed to sync offline changes:', error);
    }
  };

  /** Save to Local DB with pending status if offline */
  const saveOffline = async (note: any, action: 'create' | 'update' | 'delete') => {
    const syncStatus = action === 'create' ? 'pending_create' : action === 'update' ? 'pending_update' : 'pending_delete';
    if (action === 'delete') {
      await db.notes.put({ ...note, syncStatus });
    } else {
      await db.notes.put({ ...note, syncStatus });
    }
  };

  return { isOnline, performSync, saveOffline };
};
