import type { ReceiptsData, ReceiptsDataApi } from "./receipts-history.types";

const mapToReceiptsData = (data: ReceiptsDataApi[]): ReceiptsData[] => {
  let result: ReceiptsData[] = [];

  result = data.map((item: ReceiptsDataApi) => {
    return {
      receiptId: item.id,
      storeName: item.store_name,
      aiResponse: item.raw_ai_response,
      totalAmount: item.total_amount,
      purchaseDate: item.purchase_date,
      createdAt: item.created_at,
    };
  });

  return result;
};

export { mapToReceiptsData };
