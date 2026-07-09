import type { SupabaseClient } from "@supabase/supabase-js";
import type { ReceiptAnalysis } from "@/lib/schemas";
import type { ReceiptItem } from "@/types/receipts.types";

type DBClient = SupabaseClient;

async function addNewReceipt(supabase: DBClient, parsed: ReceiptAnalysis) {
  const { data: newReceiptData, error: newReceiptError } = await supabase
    .from("receipts")
    .insert({
      store_name: parsed.storeName,
      purchase_date: parsed.date ? parsed.date : null,
      total_amount: parsed.total,
      raw_ai_response: parsed,
    })
    .select()
    .single();

  if (newReceiptError) {
    throw new Error(`Error adding receipt: ${newReceiptError.message}`);
  }

  return newReceiptData;
}

async function addNewReceiptItems(supabase: DBClient, receiptItems: ReceiptItem[]) {
  const { error: addNewReceiptItemsError } = await supabase.from("receipt_items").insert(receiptItems);

  if (addNewReceiptItemsError) {
    throw new Error(`Error adding receipt items: ${addNewReceiptItemsError.message}`);
  }
}

async function showLastReceipts(supabase: DBClient, limit = 10, offset = 0) {
  if (limit < 1 || limit > 25) {
    throw new Error("Limit must be between 1 and 25");
  }

  if (offset < 0) {
    throw new Error("Offset must be non-negative");
  }

  const { data: receiptsData, error: receiptsDataError } = await supabase.from("receipts").select();

  if (receiptsDataError) {
    throw new Error(`Failed to fetch receipts: ${receiptsDataError.message}`);
  }

  return receiptsData;
}

async function deleteReceipt(supabase: DBClient, receiptId: string) {
  const { status: deleteReceiptStatus, statusText: deleteReceiptStatusText } = await supabase
    .from("receipts")
    .delete()
    .eq("id", receiptId);

  if (deleteReceiptStatus !== 204) {
    console.error(`Status: ${deleteReceiptStatus}, text status: ${deleteReceiptStatusText}`);
    throw new Error("Failed to delete receipt of id: " + receiptId);
  }

  return {
    status: deleteReceiptStatus,
    content: deleteReceiptStatusText,
  };
}

export { addNewReceipt, addNewReceiptItems, showLastReceipts, deleteReceipt };
