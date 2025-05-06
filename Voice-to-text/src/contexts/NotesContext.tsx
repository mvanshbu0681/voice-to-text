
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Note } from '@/types/note';
import { toast } from '@/components/ui/sonner';

interface NotesContextType {
  notes: Note[];
  addNote: (content: string, title?: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('voice-notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        // Convert date strings back to Date objects
        const notesWithDates = parsedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        setNotes(notesWithDates);
      } catch (error) {
        console.error('Failed to parse notes from localStorage:', error);
        toast.error('Failed to load saved notes');
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('voice-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (content: string, title: string = 'New Note') => {
    const now = new Date();
    const newNote: Note = {
      id: crypto.randomUUID(),
      content,
      title,
      createdAt: now,
      updatedAt: now
    };
    setNotes(prev => [newNote, ...prev]);
    toast.success('Note created');
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id 
          ? { ...note, ...updates, updatedAt: new Date() } 
          : note
      )
    );
    toast.success('Note updated');
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast.success('Note deleted');
  };

  const getNoteById = (id: string) => {
    return notes.find(note => note.id === id);
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, getNoteById }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
