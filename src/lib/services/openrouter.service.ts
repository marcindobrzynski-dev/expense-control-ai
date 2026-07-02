import type { ReceiptAnalysis } from "../schemas";

async function getOpenRouterResult(imageUrl: string): Promise<ReceiptAnalysis> {
  const response = await fetch("/api/analyze-receipt", {
    method: "POST",
    body: JSON.stringify({ imageUrl }),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to analyze receipt");
  }

  const data = await response.json();

  return data;
}

export { getOpenRouterResult };
