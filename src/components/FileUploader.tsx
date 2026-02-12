import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { CloudUploadIcon } from "lucide-react";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

function FileUploader({ onFileSelect }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    setIsDragging(false);

    if (file) {
      onFileSelect(file);
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      onFileSelect(file);
    }
  }

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-2 p-10 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${isDragging
        ? "border-primary bg-primary/5"
        : "border-muted-foreground/25 hover:border-muted-foreground/50"
      }`}
    >
      <CloudUploadIcon className="w-10 h-10" />
      <p>Drag & drop your receipt</p>
      <p>or click to browse</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}

export default FileUploader;
