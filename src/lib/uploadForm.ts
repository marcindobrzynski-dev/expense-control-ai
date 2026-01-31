import { useState } from "react";

export function useUploadForm() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      return;
    }

    console.log(`Your receipt: ${file.name}`);
  };

  return {
    file,
    handleFileChange,
    handleUpload,
  };
}
