// types.ts
export interface Utterance {
    speaker: string;
    text: string;
    start: number;
    end: number;
  }
  
  export interface TranscriptionResult {
    utterances: Utterance[];
  }
  