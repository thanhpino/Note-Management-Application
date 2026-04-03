import Dexie, { type Table } from 'dexie';

export interface OfflineNote {
  _id: string;
  title: string;
  content: string;
  isPinned: boolean;
  color: string;
  labels: string[];
  owner: string;
  updatedAt: string;
  syncStatus: 'synced' | 'pending_update' | 'pending_create' | 'pending_delete';
}

export class AppDB extends Dexie {
  notes!: Table<OfflineNote, string>;

  constructor() {
    super('NoteManagementDB');
    this.version(1).stores({
      notes: '_id, title, syncStatus, owner'
    });
  }
}

export const db = new AppDB();
