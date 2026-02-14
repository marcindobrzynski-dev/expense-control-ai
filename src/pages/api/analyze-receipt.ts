import type { APIRoute } from "astro";
import { OpenRouter } from "@openrouter/sdk";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ReceiptAnalysisSchema } from "@/lib/schemas";
import { supabase } from '@/lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const { imageUrl } = await request.json();

  if (!imageUrl || !imageUrl.startsWith("data:image/")) {
    return new Response(JSON.stringify({ error: "Invalid image URL" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const openRouter = new OpenRouter({
    apiKey: import.meta.env.OPENROUTER_API_KEY,
  });

  try {
    const result = await openRouter.chat.send({
      model: "google/gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content: `You are a receipt scanning machine. Analyze receipt images and extract data.
    
Rules:
- "price" is the unit price of a single item.
- "quantity" is how many units were purchased (default 1 if not specified).
- "total" is the final total from the receipt. If not visible, sum all (price * quantity).
- "storeName" and "date" should be null if not visible on the receipt.
- "date" must be in YYYY-MM-DD format.
- Keep product names exactly as they appear on the receipt.`,
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
      const { data: receipt, error: receiptError } = await supabase
        .from("receipts")
        .insert({
          store_name: parsed.storeName,
          purchase_date: parsed.date ? parsed.date : null,
          total_amount: parsed.total,
          raw_ai_response: parsed
        })
        .select()
        .single();

      if (receiptError) {
        console.error("Error adding receipt: ", receiptError.message);
      } else if (receipt) {
        if (parsed.items && parsed.items.length > 0) {
          const listOfReceiptItems = parsed.items.map(receiptItem => {
            return {
              receipt_id: receipt.id,
              product_name: receiptItem.name,
              unit_price: receiptItem.price,
              quantity: receiptItem.quantity,
              total_price: receiptItem.price * receiptItem.quantity
            };
          })

          const { error: receiptItemsError } = await supabase
            .from("receipt_items")
            .insert(listOfReceiptItems);

          if (receiptItemsError) {
            console.error("Error adding receipt items: ", receiptItemsError.message);
          }
        }
      }
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to analyze receipt", error);

    const message = error instanceof SyntaxError ? "Invalid JSON response from the model" : "Failed to analyze receipt";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
