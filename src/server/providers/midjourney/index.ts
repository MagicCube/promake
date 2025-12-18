import { type GenerationInput, type GenerativeModel } from "@/core/types";
import { env } from "@/env";

import type { GenerationProvider } from "../generation-provider";

export class MidjourneyGenerationProvider implements GenerationProvider {
  name = "midjourney";
  displayName = "Midjourney";

  supportedModels = [
    {
      name: "MID_JOURNEY",
      displayName: "Midjourney",
      supportBatchGeneration: true,
      supportedBatchSizes: [4],
      supportedResolutions: [],
    } satisfies GenerativeModel,
    {
      name: "NIJI_JOURNEY",
      displayName: "Niji",
      supportBatchGeneration: true,
      supportedBatchSizes: [4],
      supportedResolutions: [],
    } satisfies GenerativeModel,
  ];

  async batchGenerate(input: GenerationInput) {
    const taskId = await request<string>("POST", "submit/imagine", {
      base64Array: input.referenceImageURLs,
      botType: input.model,
      notifyHook: "", // We've no public domain for webhooks
      prompt: input.prompt + ` --ar ${input.aspectRatio}`,
      state: "",
    });
    console.info("Midjourney Task ID", taskId);

    let ticks = 0;
    let errors = 0;
    let firstTime = true;
    let progress = 0;
    while (true) {
      await new Promise((resolve) =>
        setTimeout(resolve, firstTime ? 5000 : progress > 88 ? 1000 : 4000),
      );
      firstTime = false;
      try {
        const result = await request<{
          status: string;
          progress: string;
          imageUrls: { url: string }[];
          failReason: string;
        }>("GET", `task/${taskId}/fetch`, undefined);
        if (result.status === "SUCCESS") {
          return result.imageUrls.map((i) => {
            return {
              url: i.url,
              mimeType: i.url.endsWith("png") ? "image/png" : "image/jpeg",
            };
          });
        } else if (result.status === "FAILURE") {
          console.error(result);
          throw new Error(
            "Failed to generate image using Midjourney: " + result.failReason,
          );
        }
        progress = parseInt(result.progress);
        console.info("Midjourney Task ID", taskId, `${progress}%`);
        ticks++;
        if (ticks > 120) {
          throw new Error("Failed to generate image using Midjourney");
        }
      } catch (e) {
        errors++;
        if (errors > 5) {
          throw new Error("Failed to generate image using Midjourney");
        } else {
          console.error(e);
        }
      }
    }
  }
}

async function request<Res = unknown, Req = unknown>(
  method: "GET" | "POST",
  path: string,
  body?: Req,
) {
  const url = new URL(path, "https://api.302.ai/mj/");
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "mj-api-secret": env._302_AI_API_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (method === "GET") {
    return (await response.json()) as Res;
  } else {
    const { code, description, result, type } = (await response.json()) as {
      code: number;
      description: string;
      result: string;
      type?: string;
    };
    if (code !== 1) {
      throw new Error(`[${type ?? "Error"} ${code}]: ${description}`);
    }
    return result as Res;
  }
}
