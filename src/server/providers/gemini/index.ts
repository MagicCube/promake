import { GoogleGenAI, type GenerateContentParameters } from "@google/genai";

import { type GenerationInput, type GenerativeModel } from "@/core/types";
import { isDataURL, parseDataURL } from "@/server/utils/data-url";

import type { GenerationProvider } from "../generation-provider";

const ai = new GoogleGenAI({});

export class GeminiGenerationProvider implements GenerationProvider {
  name = "gemini";
  displayName = "Gemini";

  supportedModels = [
    {
      name: "gemini-3-pro-image-preview",
      displayName: "Nano Banana Pro",
    } satisfies GenerativeModel,
  ];

  async generate(input: GenerationInput) {
    const params: GenerateContentParameters = {
      model: input.model,
      contents: [
        input.prompt,
        ...(input.referenceImageURLs?.map((url) => {
          if (isDataURL(url)) {
            const inlineData = parseDataURL(url);
            return {
              inlineData,
            };
          }
          return {
            url: url,
          };
        }) ?? []),
      ],
      config: {
        imageConfig: {
          aspectRatio: input.aspectRatio,
          imageSize: input.resolution ? input.resolution.toUpperCase() : "1K",
        },
        responseModalities: ["Image"],
      },
    };
    const response = await ai.models.generateContent(params);
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.warn("Model response with text: " + part.text);
        } else if (part.inlineData) {
          if (part.inlineData.mimeType && part.inlineData.data) {
            const imageData = part.inlineData.data;
            const buffer = Buffer.from(imageData, "base64");
            return { buffer, mimeType: part.inlineData.mimeType };
          }
        }
      }
    }
    throw new Error("No image generated");
  }
}
