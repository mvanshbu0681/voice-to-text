
import { useState, useEffect, useCallback } from 'react';
import { RecognitionStatus } from '@/types/note';
import { toast } from '@/components/ui/sonner';

interface SpeechRecognitionHook {
  status: RecognitionStatus;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isRecognitionSupported: boolean;
}

// TypeScript definitions for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

// Define the types for the SpeechRecognition API
interface SpeechRecognitionApi extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
  onaudiostart: () => void;
  onaudioend: () => void;
  onnomatch: () => void;
  onsoundstart: () => void;
  onsoundend: () => void;
  onspeechstart: () => void;
  onspeechend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionApi;
    webkitSpeechRecognition: new () => SpeechRecognitionApi;
  }
}

const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [recognition, setRecognition] = useState<SpeechRecognitionApi | null>(null);
  const [status, setStatus] = useState<RecognitionStatus>({
    isListening: false,
    isSupported: false,
    transcript: '',
    error: null
  });

  // Determine if SpeechRecognition is supported
  const isRecognitionSupported = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (!isRecognitionSupported) {
      setStatus(prev => ({ ...prev, isSupported: false }));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setStatus(prev => ({ ...prev, transcript }));
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setStatus(prev => ({ 
        ...prev, 
        error: event.error || 'An unknown error occurred',
        isListening: false
      }));
      toast.error(`Speech recognition error: ${event.error}`);
    };

    recognitionInstance.onend = () => {
      setStatus(prev => ({ ...prev, isListening: false }));
    };

    setRecognition(recognitionInstance);
    setStatus(prev => ({ ...prev, isSupported: true }));

    return () => {
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        if (status.isListening) {
          recognition.stop();
        }
      }
    };
  }, [isRecognitionSupported]);

  const startListening = useCallback(() => {
    if (!recognition) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    try {
      recognition.start();
      setStatus(prev => ({ ...prev, isListening: true, error: null }));
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast.error('Failed to start speech recognition');
      setStatus(prev => ({ ...prev, error: String(error), isListening: false }));
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (!recognition) return;

    try {
      recognition.stop();
      setStatus(prev => ({ ...prev, isListening: false }));
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }, [recognition]);

  const resetTranscript = useCallback(() => {
    setStatus(prev => ({ ...prev, transcript: '' }));
  }, []);

  return {
    status,
    startListening,
    stopListening,
    resetTranscript,
    isRecognitionSupported
  };
};

export default useSpeechRecognition;
