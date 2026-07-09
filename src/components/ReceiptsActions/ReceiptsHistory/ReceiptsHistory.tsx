import { useState } from "react";
import { Button } from "../../ui/button";
import { useReceiptsHistory } from "./useReceiptsHistory";
import { ReceiptText } from "lucide-react";
import type { ReceiptsData, ReceiptsItems } from "./receipts-history.types";
import DeleteReceipt from "../DeleteReceipt/DeleteReceipt";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Your receipts history</DialogTitle>
          <DialogDescription>
            This is where the history of receipts added to your database is located.
          </DialogDescription>
        </DialogHeader>

        {receiptsData.length <= 0 && <span className="text-destructive">You have no receipts to display.</span>}

        {receiptsData.length > 0 && (
          <ScrollArea className="flex-1 overflow-y-auto pr-4">
            {receiptsData.map((item: ReceiptsData) => (
              <div className="bg-stone-300/5 p-6 mb-3 rounded-lg" key={item.receiptId}>
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-md font-bold mb-1">{item.storeName.toUpperCase()}</h5>
                    <p>
                      You spent {item.totalAmount} on the day {item.purchaseDate}.
                    </p>
                  </div>

                  <div>
                    <DeleteReceipt receiptId={item.receiptId} />
                  </div>
                </div>

                <ul className="mt-3">
                  {item.aiResponse.items.map((response: ReceiptsItems) => (
                    <li className="text-sm" key={response.name}>
                      [{response.quantity}] {response.name} - {response.price}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ReceiptsHistory;
