import { showLastReceipts } from "@/lib/services/receipts.service";
import type { APIRoute, APIContext } from "astro";
import { supabaseClient } from "@/lib/supabase";

import { createJsonResponse } from "@/lib/utils";

async function handleGet(context: APIContext): Promise<Response> {
  try {
    const receiptsData = await showLastReceipts(supabaseClient, 10, 0);

    return createJsonResponse(receiptsData, 200);
  } catch {
    return createJsonResponse({ error: "Failed to delete receipt" }, 500);
  }
}

export const GET: APIRoute = async (context) => {
  return handleGet(context);
};
