// /lib/assemblyai.ts
import {AssemblyAI} from 'assemblyai';

const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY|| '' });

export const transcribeAudio = async (audioUrl: string): Promise<string> => {
  const config = {
    audio_url: audioUrl,
  };

  try {
    const transcript = await client.transcripts.create(config);
    return transcript.text as string;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio');
  }
};
