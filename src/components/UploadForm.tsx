import InputFile from "./InputFile";
import UploadButton from "./UploadButton";
import { useUploadForm } from "@/lib/uploadForm";

export default function UploadForm() {
  const { file, handleFileChange, handleUpload } = useUploadForm();
  return (
    <div className="flex flex-col gap-4">
      <InputFile onChange={handleFileChange} />
      <UploadButton onClick={handleUpload} disabled={!file} />
    </div>
  );
}
