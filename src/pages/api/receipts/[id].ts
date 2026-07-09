import { deleteReceipt } from "@/lib/services/receipts.service";
import type { APIRoute, APIContext } from "astro";
import { supabaseClient } from "@/lib/supabase";

async function handleDelete({ params }: APIContext): Promise<Response> {
  try {
    const { id: receiptId } = params;
    if (!receiptId) {
      return new Response(JSON.stringify({ error: "Empty receipt id. Try again..." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deleteReceiptInfo = await deleteReceipt(supabaseClient, receiptId);
    console.log(deleteReceiptInfo);

    return new Response(JSON.stringify(deleteReceiptInfo), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to delete receipt" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const DELETE: APIRoute = async (context) => {
  return handleDelete(context);
};
