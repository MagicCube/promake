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
import type { Resolution } from "@/core/types";
import { cn } from "@/lib/utils";

export function ResolutionSelect({
  resolution,
  onSelect,
}: {
  resolution: Resolution;
  onSelect?: (resolution: Resolution) => void;
}) {
  return (
    <PromptInputHoverCard openDelay={200} closeDelay={100}>
      <PromptInputHoverCardTrigger className="inline-block">
        <PromptInputButton className="px-1! py-2" size="xs" variant="ghost">
          <div className="flex items-center justify-center gap-0.5 rounded border-[0.5px] border-white px-2 text-xs">
            {resolution.toUpperCase()}
          </div>
        </PromptInputButton>
      </PromptInputHoverCardTrigger>
      <PromptInputHoverCardContent className="w-22 p-0">
        <PromptInputCommand>
          <PromptInputCommandList>
            <PromptInputCommandGroup heading="Resolution">
              {["1k", "2k", "4k"].map((res) => (
                <PromptInputCommandItem
                  key={res}
                  onSelect={() => onSelect?.(res as Resolution)}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center gap-1",
                      resolution === res
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {res.toUpperCase()}
                  </div>
                  <span className="text-primary ml-auto">
                    {resolution === res ? "✓" : ""}
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
