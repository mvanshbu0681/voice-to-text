
import { useState } from 'react';
import { useNotes } from '@/contexts/NotesContext';
import NoteCard from './NoteCard';
import { Input } from "@/components/ui/input";
import { useIsMobile } from '@/hooks/use-mobile';

interface NotesListProps {
  className?: string;
}

const NotesList: React.FC<NotesListProps> = ({ className }) => {
  const { notes } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();

  // Filter notes based on search query
  const filteredNotes = searchQuery
    ? notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (notes.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-muted-foreground">No notes yet. Start by creating a new note!</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No notes match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;
