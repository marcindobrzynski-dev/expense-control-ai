import { useState } from "react";
import { getOpenRouterResult } from "./openRouter";

function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export function useUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !previewUrl) {
      return;
    }

    const base64File = await convertToBase64(file);
    const result = await getOpenRouterResult(base64File);

    console.log(`Result: ${result}`);
  };

  return {
    file,
    previewUrl,
    handleFileChange,
    handleUpload,
  };
}
