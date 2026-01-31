import { useState } from "react";
import InputFile from "./InputFile";
import UploadButton from "./UploadButton";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  }

  const handleUpload = () => {
    if (!file) {
      return;
    }

    console.log(`Your receipt: ${file.name}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <InputFile onChange={handleFileChange} />
      <UploadButton onClick={handleUpload} disabled={!file} />
    </div>
  );
}