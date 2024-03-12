// lib/uploadFile.ts
// takes a file object and returns a URL
import axios from 'axios';

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("data", file);

  const response = await axios.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.upload_url;
};
