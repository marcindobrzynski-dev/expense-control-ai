import { OpenRouter } from "@openrouter/sdk";

export async function getOpenRouterResult(imageUrl: string): Promise<string> {
  const openRouter = new OpenRouter({
    apiKey: import.meta.env.PUBLIC_OPENROUTER_API_KEY,
  });

  const result = await openRouter.chat.send({
    model: "google/gemini-3-flash-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Otrzymasz paragon zakupowy. Jeżeli nie widzisz paragonu na zdjęciu - napisz "Nie widzę paragonu". W przeciwnym razie Twoim zadaniem jest wypisanie wszystkich produktów i ich cen w formie listy punktowanej, a następnie podanie sumarycznej ceny za wszystkie produkty.

Przeanalizuj paragon i wypisz:
1. Każdy produkt wraz z jego ceną w formie listy punktowanej (używając znaku "-")
2. Na końcu podaj sumę wszystkich cen (całkowitą kwotę do zapłaty)

Jeśli na paragonie znajduje się już suma całkowita, użyj tej wartości. Jeśli nie, oblicz sumę wszystkich cen produktów.

Format odpowiedzi:
- Użyj listy punktowanej dla każdego produktu
- Dla każdego produktu podaj nazwę i cenę
- Na końcu listy dodaj linię oddzielającą (np. "---")
- Następnie podaj "Suma całkowita:" z całkowitą kwotą

Umieść swoją odpowiedź w tagach <answer>.`,
          },
          {
            type: "image_url",
            imageUrl: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
    stream: false,
  });

  return result.choices[0].message.content as string;
}
