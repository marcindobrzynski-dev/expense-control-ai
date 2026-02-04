import InputFile from "./InputFile";
import UploadButton from "./UploadButton";
import { useUploadForm } from "@/lib/uploadForm";

export default function UploadForm() {
  const { file, handleFileChange, handleUpload } = useUploadForm();
  return (
    <div className="flex flex-col gap-4">
      <InputFile onChange={handleFileChange} />
      {file && <img src={file} alt="Receipt" className="w-full h-auto rounded-md mb-2" />}
      <UploadButton onClick={handleUpload} disabled={!file} />
    </div>
  );
}
