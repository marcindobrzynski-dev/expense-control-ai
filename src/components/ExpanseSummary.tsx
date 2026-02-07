import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import type { ReceiptAnalysis } from "@/lib/schemas";

interface ExpanseSummaryProps {
  summary: ReceiptAnalysis;
}

export default function ExpanseSummary({ summary }: ExpanseSummaryProps) {
  return (
    <>
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Summary of expenses</CardTitle>
            <CardDescription>Here you will find a summary of your expenses.</CardDescription>
          </CardHeader>
          <CardContent className="text-start">
            <h5 className="font-bold text-lg">Store: {summary.storeName}</h5>
            <p className="text-sm mb-3">Date: {summary.date}</p>
            <ul className="list-disc list-inside mb-3">
              {summary.items.map((item) => (
                <li key={item.name}>
                  {item.name} - {item.price} PLN - {item.quantity} units
                </li>
              ))}
            </ul>
            <p>Summary total: {summary.total} PLN</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
