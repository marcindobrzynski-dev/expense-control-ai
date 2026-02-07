import { z } from "zod";

export const ReceiptItemSchema = z.object({
  name: z.string().describe("Name of the product"),
  price: z.number().describe("Price of the single unit"),
  quantity: z.number().default(1).describe("Quantity of the product"),
});

export const ReceiptAnalysisSchema = z.object({
  storeName: z.string().nullable().describe("Name of the shop/store"),
  date: z.string().nullable().describe("Date of purchase in YYYY-MM-DD format"),
  items: z.array(ReceiptItemSchema),
  total: z.number().describe("Total sum from the receipt"),
});

export type ReceiptItem = z.infer<typeof ReceiptItemSchema>;
export type ReceiptAnalysis = z.infer<typeof ReceiptAnalysisSchema>;
