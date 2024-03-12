// lib/transcribe.ts
import axios from 'axios';

// wait for some time (ms) before calling next function or action 
const wait = (time: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
};

// takes URL of uploaded-file & returns the transcribed data 
export const transcribe = async (url: string): Promise<string> => {
    const response = await axios.post("/api/transcribe", { data: { url } });
    const id = response.data.id;
  
    let data = response.data;
  
    while (data.status !== "completed" && data.status !== "error") {
      await wait(1000);
      const response = await axios.post("/api/result", { data: { id } });
  
      data = response.data;
    }
    console.log("transcribeData... ", data)
    return data;
  };
