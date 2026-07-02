import { useState } from "react";
import { Button } from "../../ui/button";
import { useReceiptsHistory } from "./useReceiptsHistory";
import { ReceiptText } from "lucide-react";
import type { ReceiptsData, ReceiptsItems } from "./receipts-history.types";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function ReceiptsHistory() {
  const [receiptsData, setReceiptsData] = useState([] as ReceiptsData[]);
  const { getReceiptsData } = useReceiptsHistory();

  const handleReceipts = async () => {
    const data: ReceiptsData[] = await getReceiptsData();
    setReceiptsData(data);
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleReceipts}>
          <ReceiptText /> Receipts history
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your receipts history</DialogTitle>
          <DialogDescription>
            This is where the history of receipts added to your database is located.
          </DialogDescription>
        </DialogHeader>
        {receiptsData &&
          receiptsData.map((item: ReceiptsData) => (
            <div className="bg-stone-300/5 p-6 mb-3 rounded-lg" key={item.receiptId}>
              <h5 className="text-md font-bold mb-1">{item.storeName.toUpperCase()}</h5>
              <p>
                You spent {item.totalAmount} on the day {item.purchaseDate}.
              </p>

              <ul className="mt-3">
                {item.aiResponse.items.map((response: ReceiptsItems) => (
                  <li className="text-sm" key={response.name}>
                    [{response.quantity}] {response.name} - {response.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </DialogContent>
    </Dialog>
  );
}

export default ReceiptsHistory;
