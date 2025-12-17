import { useCallback, useEffect, useState } from "react";

import {
  useCreateGeneration,
  useRegenerate,
} from "@/client/biz-logic/generation";
import {
  getLocalSettings,
  loadLocalSettings,
  saveLocalSettings,
} from "@/client/settings/local-settings";
import { type GenerationInput } from "@/core/types";
import { cn } from "@/lib/utils";

import {
  PromptInput,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputHeader,
  usePromptInputAttachments,
  type PromptInputMessage,
} from "../ai-elements/prompt-input";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { AspectRatioSelect } from "./aspect-ratio-select";
import { BatchSizeSelect } from "./batch-size-select";
import { CodeEditor } from "./code-editor";
import { ResolutionSelect } from "./resolution-select";

export function CreateGenerationCard({
  className,
  projectId,
}: {
  className?: string;
  projectId: string;
}) {
  const [localSettingsLoaded, setLocalSettingsLoaded] = useState(false);
  const [generationInput, setGenerationInput] = useState<GenerationInput>({
    ...getLocalSettings().lastGeneration,
    prompt: "",
  });
  const [batchSize, setBatchSize] = useState(
    getLocalSettings().lastGeneration.batchSize,
  );
  useEffect(() => {
    if (localSettingsLoaded) return;
    loadLocalSettings();
    setGenerationInput({
      ...getLocalSettings().lastGeneration,
      prompt: "",
    });
    setBatchSize(getLocalSettings().lastGeneration.batchSize);
    setLocalSettingsLoaded(true);
  }, [localSettingsLoaded]);
  const attachments = usePromptInputAttachments();
  const createGeneration = useCreateGeneration();
  const regenerate = useRegenerate();
  const handleSubmit = useCallback(
    async ({ files }: PromptInputMessage) => {
      const generation = await createGeneration({
        projectId,
        input: {
          ...generationInput,
          referenceImageURLs: files.map((file) => file.url),
        },
        batchSize,
      });
      setGenerationInput({
        ...generationInput,
        prompt: "",
      });
      attachments.clear();
      await regenerate({
        projectId,
        generation,
      });
    },
    [
      attachments,
      batchSize,
      createGeneration,
      generationInput,
      projectId,
      regenerate,
    ],
  );
  return (
    <Card className={cn("flex flex-col gap-4", className)}>
      <CardHeader className="shrink-0 px-4">
        <CardTitle>Generate new image</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 grow px-4">
        <div className="min-h-0 grow">
          <PromptInput
            id="prompt-input-form"
            className="flex size-full"
            globalDrop
            multiple
            onSubmit={handleSubmit}
          >
            <PromptInputHeader className="py-1">
              <PromptInputAttachments>
                {(attachment) => <PromptInputAttachment data={attachment} />}
              </PromptInputAttachments>
            </PromptInputHeader>
            <PromptInputBody className="min-h-0 grow">
              <CodeEditor
                className="size-full"
                placeholder="Your next great idea goes from here"
                value={generationInput.prompt}
                onChange={(newValue) => {
                  setGenerationInput({
                    ...generationInput,
                    prompt: newValue ?? "",
                  });
                }}
              />
            </PromptInputBody>
          </PromptInput>
        </div>
      </CardContent>
      <CardFooter className="flex shrink-0 justify-between px-4">
        <div className="flex gap-2">
          <BatchSizeSelect
            batchSize={batchSize}
            onSelect={(value) => {
              setBatchSize(value);
              saveLocalSettings({
                lastGeneration: {
                  ...generationInput,
                  batchSize: value,
                },
              });
            }}
          />
          <AspectRatioSelect
            value={generationInput.aspectRatio}
            onSelect={(value) => {
              setGenerationInput({
                ...generationInput,
                aspectRatio: value,
              });
              saveLocalSettings({
                lastGeneration: {
                  ...generationInput,
                  batchSize,
                  aspectRatio: value,
                },
              });
            }}
          />
          <ResolutionSelect
            resolution={generationInput.resolution ?? "1k"}
            onSelect={(value) => {
              setGenerationInput({
                ...generationInput,
                resolution: value,
              });
              saveLocalSettings({
                lastGeneration: {
                  ...generationInput,
                  batchSize,
                  resolution: value,
                },
              });
            }}
          />
        </div>
        <div className="flex">
          <Button
            disabled={generationInput.prompt.trim() === ""}
            onClick={() => {
              (
                document.getElementById("prompt-input-form") as HTMLFormElement
              ).requestSubmit();
            }}
          >
            Generate
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
