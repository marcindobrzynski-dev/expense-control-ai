import type { APIRoute } from "astro";
import { addNewReceipt, addNewReceiptItems } from "@/lib/services/receipts.service";
import { OpenRouter } from "@openrouter/sdk";
import { supabaseClient } from "@/lib/supabase";
import { SCANNER_MACHINE_SYSTEM_PROMPT } from "@/lib/robots/robots.constants";

import { zodToJsonSchema } from "zod-to-json-schema";
import { ReceiptAnalysisSchema } from "@/lib/schemas";
import { createJsonResponse } from "@/lib/utils";

import type { ReceiptItem } from "@/types/receipts.types";

export const POST: APIRoute = async ({ request }) => {
  const { imageUrl } = await request.json();

  if (!imageUrl || !imageUrl.startsWith("data:image/")) return createJsonResponse({ error: "Invalid image URL" }, 400);

  const openRouter = new OpenRouter({
    apiKey: import.meta.env.OPENROUTER_API_KEY,
  });

  try {
    const result = await openRouter.chat.send({
      model: "google/gemini-3.1-flash-lite",
      messages: [
        {
          role: "system",
          content: SCANNER_MACHINE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this receipt." },
            { type: "image_url", imageUrl: { url: imageUrl } },
          ],
        },
      ],
      responseFormat: {
        type: "json_schema",
        jsonSchema: {
          name: "ReceiptAnalysis",
          strict: true,
          schema: zodToJsonSchema(ReceiptAnalysisSchema),
        },
      },
      stream: false,
    });

    const raw = result.choices[0].message.content ?? "";
    const parsed = ReceiptAnalysisSchema.parse(JSON.parse(raw as string));

    if (parsed) {
      const newReceiptData = await addNewReceipt(supabaseClient, parsed);

      if (newReceiptData) {
        if (parsed.items && parsed.items.length > 0) {
          const listOfReceiptItems: ReceiptItem[] = parsed.items.map((receiptItem) => {
            return {
              receipt_id: newReceiptData.id as string,
              product_name: receiptItem.name,
              unit_price: receiptItem.price,
              quantity: receiptItem.quantity,
              total_price: receiptItem.price * receiptItem.quantity,
            };
          });

          await addNewReceiptItems(supabaseClient, listOfReceiptItems);
        }
      }
    }

    return createJsonResponse(parsed, 200)
  } catch (error) {
    console.error("Failed to analyze receipt", error);
    const message = error instanceof SyntaxError ? "Invalid JSON response from the model" : "Failed to analyze receipt";
    return createJsonResponse({ error: message }, 500, { "Content-Type": "application/json" });
  }
};
