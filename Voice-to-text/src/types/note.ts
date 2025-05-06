
export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
}

export interface RecognitionStatus {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
}
