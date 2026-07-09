import { showLastReceipts, deleteReceipt } from "@/lib/services/receipts.service";
import type { APIRoute, APIContext } from "astro";
import { supabaseClient } from "@/lib/supabase";

async function handleGet(context: APIContext): Promise<Response> {
  try {
    const receiptsData = await showLastReceipts(supabaseClient, 10, 0);

    return new Response(JSON.stringify(receiptsData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to get receipts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const GET: APIRoute = async (context) => {
  return handleGet(context);
};
