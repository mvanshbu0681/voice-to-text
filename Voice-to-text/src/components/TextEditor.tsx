import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useTextOperations from '@/hooks/useTextOperations';
import { toast } from '@/components/ui/sonner';
import { Edit, List, ListOrdered, AlignLeft, Copy } from 'lucide-react';

interface TextEditorProps {
  initialText: string;
  onTextChange: (text: string) => void;
  className?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ initialText, onTextChange, className }) => {
  const [text, setText] = useState(initialText);
  const { processText, isProcessing } = useTextOperations();

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onTextChange(e.target.value);
  };

  const applyOperation = (operation: 'grammar' | 'rephrase' | 'bullets' | 'paragraphs' | 'enhance') => {
    if (!text.trim()) {
      toast.warning("Please add some text first");
      return;
    }
    
    const processed = processText(text, operation);
    setText(processed);
    onTextChange(processed);
    toast.success(`Text ${operation} complete`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  return (
    <div className={className}>
      <Textarea 
        value={text} 
        onChange={handleTextChange} 
        placeholder="Your text will appear here..." 
        className="h-48 mb-3 font-medium p-4"
      />
      
      <div className="flex flex-wrap items-center gap-2">
        <Button 
          onClick={() => applyOperation('grammar')} 
          variant="outline"
          disabled={isProcessing || !text.trim()}
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
          Fix Grammar
        </Button>
        
        <Button 
          onClick={() => applyOperation('rephrase')} 
          variant="outline"
          disabled={isProcessing || !text.trim()}
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
          Rephrase
        </Button>
        
        <Button 
          onClick={() => applyOperation('bullets')} 
          variant="outline"
          disabled={isProcessing || !text.trim()}
          className="gap-2"
        >
          <List className="h-4 w-4" />
          Bullet Points
        </Button>
        
        <Button 
          onClick={() => applyOperation('paragraphs')} 
          variant="outline"
          disabled={isProcessing || !text.trim()}
          className="gap-2"
        >
          <AlignLeft className="h-4 w-4" />
          Paragraphs
        </Button>
        
        <Button 
          onClick={() => applyOperation('enhance')} 
          variant="outline"
          disabled={isProcessing || !text.trim()}
          className="gap-2"
        >
          <ListOrdered className="h-4 w-4" />
          Enhance
        </Button>
        
        <Button 
          onClick={copyToClipboard} 
          variant="outline"
          disabled={!text.trim()}
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
      </div>
    </div>
  );
};

export default TextEditor;
