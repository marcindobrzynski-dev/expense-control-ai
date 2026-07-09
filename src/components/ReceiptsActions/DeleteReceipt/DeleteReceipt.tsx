import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useDeleteReceipt } from "./useDeleteReceipt";

interface DeleteReceiptProps {
  receiptId: string;
}

function DeleteReceipt({ receiptId }: DeleteReceiptProps) {
  const handleDeleteReceipt = async () => await useDeleteReceipt(receiptId);

  return (
    <Button size="sm" variant="destructive" onClick={handleDeleteReceipt}>
      <X />
    </Button>
  );
}

export default DeleteReceipt;
