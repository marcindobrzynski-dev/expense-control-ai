import type { SupabaseClient } from "@supabase/supabase-js";

type DBClient = SupabaseClient;

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

export { showLastReceipts };
