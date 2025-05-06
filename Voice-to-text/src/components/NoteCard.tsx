
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Note } from '@/types/note';
import { useNotes } from '@/contexts/NotesContext';
import { Trash2, Edit, Copy } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import TextEditor from './TextEditor';

interface NoteCardProps {
  note: Note;
  className?: string;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, className }) => {
  const { updateNote, deleteNote } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Format date to be more readable
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(note.updatedAt));

  const handleCopy = () => {
    navigator.clipboard.writeText(note.content)
      .then(() => toast.success("Note copied to clipboard"))
      .catch(() => toast.error("Failed to copy note"));
  };

  const handleSaveEdit = () => {
    updateNote(note.id, {
      title: editTitle,
      content: editContent
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteNote(note.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Card className={`note-card-shadow hover:shadow-lg transition-shadow ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold truncate">{note.title}</CardTitle>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm whitespace-pre-wrap line-clamp-4">{note.content}</p>
        </CardContent>
        <CardFooter className="pt-0 justify-between border-t border-gray-100 p-4">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(true)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Make changes to your note here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Note title"
            />
            
            <TextEditor
              initialText={editContent}
              onTextChange={setEditContent}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NoteCard;
