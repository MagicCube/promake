import { GalleryHorizontalEnd, X } from "lucide-react";

import {
  PromptInputButton,
  PromptInputCommand,
  PromptInputCommandGroup,
  PromptInputCommandItem,
  PromptInputCommandList,
  PromptInputHoverCard,
  PromptInputHoverCardContent,
  PromptInputHoverCardTrigger,
} from "@/components/ai-elements/prompt-input";
import { cn } from "@/lib/utils";

export function BatchSizeSelect({
  batchSize,
  supportedBatchSizes = [1, 2, 3, 4, 5, 6, 7, 8],
  onSelect,
}: {
  batchSize: number;
  supportedBatchSizes?: number[];
  onSelect?: (batchSize: number) => void;
}) {
  return (
    <PromptInputHoverCard openDelay={200} closeDelay={100}>
      <PromptInputHoverCardTrigger className="inline-block">
        <PromptInputButton className="px-1! py-2" size="xs" variant="ghost">
          <div className="flex items-center justify-center gap-0.5">
            <GalleryHorizontalEnd
              className={cn("size-3", batchSize > 1 ? "text-primary" : "")}
            />
            <X className={cn("size-2", batchSize > 1 ? "text-primary" : "")} />
            <span
              className={cn("font-normal", batchSize > 1 ? "text-primary" : "")}
            >
              {batchSize}
            </span>
          </div>
        </PromptInputButton>
      </PromptInputHoverCardTrigger>
      <PromptInputHoverCardContent className="w-22 p-0">
        <PromptInputCommand>
          <PromptInputCommandList>
            <PromptInputCommandGroup heading="Batch Size">
              {supportedBatchSizes.map((size) => (
                <PromptInputCommandItem
                  key={size}
                  onSelect={() => onSelect?.(size)}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center gap-1",
                      size === batchSize
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    <X
                      className={cn(
                        "size-3",
                        size === batchSize
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    />
                    {size}
                  </div>
                  <span className="text-primary ml-auto">
                    {size === batchSize ? "✓" : ""}
                  </span>
                </PromptInputCommandItem>
              ))}
            </PromptInputCommandGroup>
          </PromptInputCommandList>
        </PromptInputCommand>
      </PromptInputHoverCardContent>
    </PromptInputHoverCard>
  );
}
