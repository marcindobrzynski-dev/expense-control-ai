import { deleteReceipt } from "@/lib/services/receipts.service";
import type { APIRoute, APIContext } from "astro";
import { supabaseClient } from "@/lib/supabase";

import { createJsonResponse } from "@/lib/utils";

async function handleDelete({ params }: APIContext): Promise<Response> {
  try {
    const { id: receiptId } = params;
    if (!receiptId) return createJsonResponse({ error: "Empty receipt id" }, 403);

    const deleteReceiptInfo = await deleteReceipt(supabaseClient, receiptId);
    console.log(deleteReceiptInfo);

    return createJsonResponse(deleteReceiptInfo, 200);
  } catch (error) {
    console.error(error);
    return createJsonResponse({ error: "Failed to delete receipt" }, 500);
  }
}

export const DELETE: APIRoute = async (context) => {
  return handleDelete(context);
};
