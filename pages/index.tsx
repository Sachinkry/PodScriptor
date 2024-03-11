// index.tsx
import * as React from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loader from '@/components/ui/Loader';
import { useState, useCallback, ChangeEvent } from 'react';
import clsx from "clsx";  // add class neames together
import axios from 'axios';

interface TranscriptionResult {
  text: string;
  // Include other relevant properties of the transcription result
}

// wait for some time (ms) before calling next function or action 
const wait = (time: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

// upload the file to assembly ai '/upload' endpoint 
// takes a File object & returns a Promise, which when resolved gives URL of the uploaded file
const upload = async (file: File): Promise<any> => {
  const formData = new FormData();

  formData.append("data", file);

  const response = await axios.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.upload_url;
};

// takes URL of uploaded-file & returns the transcribed data 
const transcribe = async (url: string): Promise<string> => {
  const response = await axios.post("/api/transcribe", { data: { url } });
  const id = response.data.id;

  let data = response.data;

  while (data.status !== "completed" && data.status !== "error") {
    await wait(1000);
    const response = await axios.post("/api/result", { data: { id } });

    data = response.data;
  }

  return data;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [transcript, setTranscript] = useState<string | TranscriptionResult>("");
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
      const url: string = await upload(file);
      
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

  
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900">
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

        <div className="mt-6 flex w-full max-w-md flex-col items-stretch gap-4 px-4 sm:flex-row">
          <Input
            placeholder="Upload Audio File"
            className="flex-1 curosor-pointer"
            type='file'
            onChange={handleInput}
          />
          <Button 
            variant="default" 
            size="default"
            onClick={handleTranscription}
          >
            Transcribe
          </Button>

        </div>
        <div className='bg-neutral-900 w-1/2 h-0.5 mt-8 '></div>


        <div className="mt-6 mx-4 w-full max-w-4xl min-h-full grid-cols-4 gap-4 h-1/2 rounded-md p-3 flex items-center ">
        {file && (
          <div
            className={clsx(
              "flex justify-center bg-neutral-300  w-full items-center rounded-lg border mt-2 p-3",
              error && "border-red-500"
            )}
          >
            {transcript && !error ? (
            typeof transcript === 'string' ? transcript : (transcript as TranscriptionResult).text // Check if transcript is a string; otherwise, try to render transcript.text
                    ) : (
            <div className="w-full flex justify-center">
              {status && !error && (
                <>
                  <Loader />
                  <span className="ml-2 capitalize">{status}...</span>
                </>
              )}
              {error && <span className="text-red-500">{error}</span>}
              {!status &&
                !error &&
                `File "${file.name}" ready for transcription`}
            </div>
          )}

          </div>
        )}
        </div>

        <footer className="mt-12 mb-4 text-center text-neutral-600 dark:text-neutral-400">
          Made with ❤ by Sachin
        </footer>
      </div>
    </div>
  );
}
