// pages/api/upload.ts
import axios from "axios";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from 'next';
import multiparty from "multiparty";

// an interface defining the structure of the form parsing result
interface FormParseResult {
  fields: { [key: string]: any };
  files: { [key: string]: any };
}

// Promise-based function to parse form data
const parseForm = (req: NextApiRequest): Promise<FormParseResult> => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();

    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

// the API route handler function
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY || '',
      "content-type": "application/json",
      "transfer-encoding": "chunked",
    },
  });

  try {
    const { files } = await parseForm(req);
    // check if the data field contains the uploaded file
    if (!files.data || files.data.length === 0) {
      throw new Error('No file uploaded.');
    }

    const file = await fs.readFile(files.data[0].path);
    // use the assembly instance to POST the file to '/upload' endpoint
    const response = await assembly.post("/upload", file);

    // the AssemblyAI API response data, a URL
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
