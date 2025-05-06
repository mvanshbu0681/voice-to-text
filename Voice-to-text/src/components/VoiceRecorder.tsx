
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, CirclePlay, CircleStop, RefreshCcw } from 'lucide-react';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import { toast } from '@/components/ui/sonner';

interface VoiceRecorderProps {
  onTranscriptChange: (transcript: string) => void;
  className?: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptChange, className }) => {
  const { status, startListening, stopListening, resetTranscript, isRecognitionSupported } = useSpeechRecognition();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Update parent component with transcript
  useEffect(() => {
    onTranscriptChange(status.transcript);
  }, [status.transcript, onTranscriptChange]);

  // Check microphone permissions
  useEffect(() => {
    if (isRecognitionSupported && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => setHasPermission(true))
        .catch((error) => {
          console.error('Microphone permission denied:', error);
          setHasPermission(false);
        });
    }
  }, [isRecognitionSupported]);

  const toggleRecording = () => {
    if (status.isListening) {
      stopListening();
    } else {
      if (hasPermission) {
        startListening();
      } else {
        toast.error("Please enable microphone permissions");
        // Try requesting permissions again
        navigator.mediaDevices?.getUserMedia({ audio: true })
          .then(() => {
            setHasPermission(true);
            startListening();
          })
          .catch(() => {
            toast.error("Microphone access is required for voice recording");
          });
      }
    }
  };

  const handleReset = () => {
    stopListening();
    resetTranscript();
    toast.success("Transcript cleared");
  };

  if (!isRecognitionSupported) {
    return (
      <div className={`p-4 rounded-md bg-red-50 text-red-500 ${className}`}>
        <p className="mb-2 font-semibold">Speech recognition not supported</p>
        <p className="text-sm">Your browser doesn't support speech recognition. Please try using Chrome, Edge, or Safari.</p>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        onClick={toggleRecording} 
        variant={status.isListening ? "destructive" : "default"}
        size="lg"
        className={`relative ${status.isListening ? 'animate-pulse-recording' : ''}`}
      >
        {status.isListening ? (
          <>
            <CircleStop className="mr-2 h-5 w-5" />
            Stop Recording
          </>
        ) : (
          <>
            <CirclePlay className="mr-2 h-5 w-5" />
            Start Recording
          </>
        )}
      </Button>
      
      <Button onClick={handleReset} variant="outline" size="icon" title="Reset transcript">
        <RefreshCcw className="h-5 w-5" />
      </Button>
      
      {status.isListening && (
        <div className="ml-2 flex items-center gap-2 text-sm bg-red-50 text-red-500 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Recording...
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
