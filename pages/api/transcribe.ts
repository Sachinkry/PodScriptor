// pages/api/transcribe.ts
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

// Create an instance of axios with predefined configs
const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: process.env.ASSEMBLYAI_API_KEY || '',
    "content-type": "application/json",
  },
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Make sure to validate the body structure and presence of the url
    if (typeof req.body.data?.url !== 'string') {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    const response = await assembly.post("/transcript", {
      audio_url: req.body.data.url,
      speaker_labels: true
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export default handler;
