import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ReceiptPreviewProps {
  imageUrl: string;
}

function ReceiptPreview({ imageUrl }: ReceiptPreviewProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={imageUrl}
        alt="Receipt"
        className="max-h-[500px] w-full object-cover rounded-lg cursor-pointer"
        onClick={() => setOpen(true)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-7xl p-0">
          <DialogTitle className="sr-only">Receipt Preview</DialogTitle>
          <img src={imageUrl} alt="Receipt" className="max-h-[85vh] w-full object-contain rounded-lg" />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ReceiptPreview;
