import { toast } from "sonner";

const useDeleteReceipt = async (receiptId: string) => {
  const deleteResponse = await fetch(`/api/receipts/${receiptId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!deleteResponse.ok) {
    toast.error(`The receipt ${receiptId} was not deleted. Try again...`);
  }

  toast.success(`The receipt ${receiptId} has been removed.`);
};

export { useDeleteReceipt };
