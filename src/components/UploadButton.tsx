import { Button } from "./ui/button";

interface UploadButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function UploadButton({ onClick, disabled }: UploadButtonProps) {
  return (
    <Button
      className="w-full cursor-pointer"
      type="submit"
      onClick={onClick}
      disabled={disabled}
    >
      Upload a receipt
    </Button>
  );  
}
