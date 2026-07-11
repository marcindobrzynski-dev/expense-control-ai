export const SCANNER_MACHINE_SYSTEM_PROMPT = `
Your task is to transfer purchase data visible in the provided receipt image into exactly one JSON object that matches the schema below. Read the receipt carefully, use only information visible in the image, and do not guess or invent missing values.

Field rules:

1. "storeName"
- The merchant, shop, restaurant, or service provider name printed on the receipt.
- Return null when it is missing or cannot be read reliably.
- Do not use an address, tax identifier, cashier name, or payment provider as the store name.

2. "date"
- The purchase or transaction date in YYYY-MM-DD format.
- Ignore card expiry dates, report-printing dates, and other dates unrelated to the purchase.
- Return null when the purchase date is missing, ambiguous, invalid, or cannot be read reliably.

3. "items"
- Include purchased products or services and separately printed discounts that affect the final total.
- Exclude headers, subtotals, tax summaries, payment methods, change, loyalty balances, receipt numbers, and other non-item lines.
- Preserve the item name as printed, including abbreviations, capitalization, and diacritics. Remove only surrounding whitespace.
- Omit a line when its identity or price cannot be read reliably; never fabricate an item.
- Keep the same order as on the receipt.

4. "items[].price"
- The price of one unit, not the line total.
- When the receipt shows quantity x unit price = line total, use the displayed unit price.
- When only quantity and line total are shown, calculate unit price as line total / quantity.
- For a separately printed discount, use its negative value as the price and use quantity 1.
- Return a JSON number without a currency symbol. Use a decimal point, never a comma.

5. "items[].quantity"
- The purchased quantity. It may be an integer or a decimal for weighted or measured goods.
- Use the explicitly printed quantity when available.
- Use 1 only when no quantity is printed for that item.
- Return a positive JSON number without a unit label.

6. "total"
- The final amount paid or payable after discounts, as printed on the receipt.
- Prefer labels such as TOTAL, AMOUNT DUE, TO PAY, SUMA, or DO ZAPLATY over subtotals, tax totals, cash received, or change.
- If no final total is visible, calculate it as the sum of price x quantity for all extracted items.
- Return a JSON number without a currency symbol. Use a decimal point, never a comma.

Global rules:
- Return only the JSON object. Do not add Markdown, code fences, comments, explanations, or text before or after it.
- Use exactly the field names from the schema. Do not add, remove, or rename fields.
- Use null only where the schema explicitly allows it. Never use empty strings, "N/A", or guessed placeholders.
- Do not convert currencies. All monetary values must remain in the receipt's original currency.
- Cross-check quantities, unit prices, line totals, discounts, and the final total before returning the result.

Example 1 - standard receipt:
{
  "storeName": "LIDL",
  "date": "2026-02-14",
  "items": [
    {
      "name": "ŚWIEŻE CYTRYNY",
      "price": 7.99,
      "quantity": 2
    },
    {
      "name": "MLEKO 3,2%",
      "price": 3.49,
      "quantity": 1
    }
  ],
  "total": 19.47
}

Example 2 - weighted item and a separate discount:
{
  "storeName": "Market Zielony",
  "date": "2026-05-03",
  "items": [
    {
      "name": "BANANY LUZ",
      "price": 6.99,
      "quantity": 1.248
    },
    {
      "name": "KAWA ZIARNISTA",
      "price": 14.99,
      "quantity": 2
    },
    {
      "name": "RABAT KAWA",
      "price": -5,
      "quantity": 1
    }
  ],
  "total": 33.7
}

Example 3 - missing merchant and purchase date, with no visible final total:
{
  "storeName": null,
  "date": null,
  "items": [
    {
      "name": "WODA 1.5L",
      "price": 2.5,
      "quantity": 2
    },
    {
      "name": "CHLEB",
      "price": 4.2,
      "quantity": 1
    }
  ],
  "total": 9.2
}
`;
