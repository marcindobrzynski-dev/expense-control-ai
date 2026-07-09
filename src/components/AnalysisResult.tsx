import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from "@/components/ui/table";
import type { ReceiptAnalysis } from "@/lib/schemas";
import { TriangleAlertIcon } from "lucide-react";

interface AnalysisResultProps {
  data: ReceiptAnalysis;
}

function AnalysisResult({ data }: AnalysisResultProps) {
  const itemsSum = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hasMismatch = Math.abs(itemsSum - data.total) > 0.01;

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold mb-1">{data.storeName ?? "Unknown store"}</h2>
        <p className="text-sm text-muted-foreground mb-3">Date purchased: {data.date ?? "Unknown date"}</p>
        {hasMismatch && (
          <p className="flex justify-center items-center gap-2 text-sm text-yellow-600 mb-3">
            <TriangleAlertIcon className="w-4 h-4" />
            Items sum ({itemsSum.toFixed(2)}) doesn't match receipt total ({data.total.toFixed(2)})
          </p>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((item, index) => (
            <TableRow key={`${item.name}-${index}`}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{(item.price * item.quantity).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell>{data.total.toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

export default AnalysisResult;
