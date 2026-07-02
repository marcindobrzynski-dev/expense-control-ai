interface ReceiptsItems {
  name: string;
  price: number;
  quantity: number;
}

interface RawAiResponse {
  date: string;
  storeName: string;
  items: ReceiptsItems[];
  total: number;
}

interface ReceiptsData {
  receiptId: string;
  storeName: string;
  aiResponse: RawAiResponse;
  totalAmount: number;
  purchaseDate: string;
  createdAt: string;
}

interface ReceiptsDataApi {
  created_at: string;
  id: string;
  purchase_date: string;
  raw_ai_response: RawAiResponse;
  store_name: string;
  total_amount: number;
}

export type { ReceiptsData, ReceiptsDataApi, ReceiptsItems };
