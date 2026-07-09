import { toast } from "sonner";
import type { ReceiptsData, ReceiptsDataApi } from "./receipts-history.types";
import { mapToReceiptsData } from "./receipts-history.utils";

const useReceiptsHistory = () => {
  const getReceiptsData = async () => {
    const receiptsResponse = await fetch("/api/receipts", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!receiptsResponse.ok) {
      toast.error("Receipts haven't fetched. Try again...");
    }

    const data: ReceiptsDataApi[] = await receiptsResponse.json();
    toast.success("Receipts have fetched");

    const receiptsData: ReceiptsData[] = mapToReceiptsData(data);

    return receiptsData;
  };

  return { getReceiptsData };
};

export { useReceiptsHistory };
