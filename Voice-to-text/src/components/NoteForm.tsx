
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotes } from '@/contexts/NotesContext';
import VoiceRecorder from './VoiceRecorder';
import TextEditor from './TextEditor';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface NoteFormProps {
  className?: string;
}

const NoteForm: React.FC<NoteFormProps> = ({ className }) => {
  const [title, setTitle] = useState('New Note');
  const [content, setContent] = useState('');
  const { addNote } = useNotes();

  const handleTranscriptChange = (transcript: string) => {
    setContent(transcript);
  };

  const handleSave = () => {
    if (content.trim()) {
      addNote(content, title || 'Untitled Note');
      setContent('');
      setTitle('New Note');
    }
  };

  return (
    <Card className={`w-full shadow-md ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Create New Note</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input 
          placeholder="Note title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="font-medium"
        />
        
        <VoiceRecorder onTranscriptChange={handleTranscriptChange} />
        
        <TextEditor 
          initialText={content} 
          onTextChange={setContent}
        />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave}
          className="w-full"
          variant="default" 
          disabled={!content.trim()}
        >
          Save Note
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoteForm;
