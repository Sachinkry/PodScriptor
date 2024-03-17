// index.tsx
import * as React from 'react';
import Head from 'next/head';
import { useState, useCallback, ChangeEvent } from 'react';
import InputAndTranscribeBtn from '@/components/InputAndTranscribeBtn';
import TranscriptionDisplay from '@/components/TranscriptionDisplay';
import { uploadFile } from '@/lib/uploadFile';
import { transcribe } from '@/lib/transcribe';
import { TranscriptionResult } from '@/interfaces/type';


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [transcript, setTranscript] = useState<string | TranscriptionResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleInput = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
       setTranscript("");
       setError("");
       setStatus("");
      //  event.target.value = "";
    }
  };

  const handleTranscription = async () => {
    if (!file) return;
    
    try {
      setStatus("uploading");
      
      // The upload function is assumed to return the URL of the uploaded file
      const url: string = await uploadFile(file);
      
      setStatus("transcribing");
      
      // Assume 'transcribe' returns an object with a 'text' string property
      const transcriptionText: string = await transcribe(url);
      
      setTranscript(transcriptionText);
      setStatus("");
    } catch (error: any) { // 'any' can be replaced with a more specific error type if known
      console.error(error);
      setError(error.message);
      setStatus("");
    }
  };

  const isTranscribeButtonDisabled = !file || status === "transcribing";
  console.log("Button disabled state:", isTranscribeButtonDisabled);

  
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 space-y-4 flex flex-col gap-4">
      <Head>
        <title>Transcriptor</title>
        <meta name="description" content="Transcribe your audio files" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-neutral-900 dark:text-neutral-200">
            Podcast Transcript Generator
          </h1>
          <p className="mt-3 text-xl text-neutral-600 dark:text-neutral-400">
            Upload Your Audio File below
          </p>
        </div>
        
        <InputAndTranscribeBtn 
          onFileChange={handleInput} 
          onTranscribeClick={handleTranscription}
          isDisabled={isTranscribeButtonDisabled}
        />

        <div className='bg-neutral-900 w-1/2 h-0.5 mt-8 '></div>

        <TranscriptionDisplay file={file} transcript={transcript} status={status} error={error} />

        <footer className="mt-12 mb-4 text-center text-neutral-600 dark:text-neutral-400 text-sm">
          Made with &hearts; by Sachin
        </footer>
      </div>
    </div>
  );
}
