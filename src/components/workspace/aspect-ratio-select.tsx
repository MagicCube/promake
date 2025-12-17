import { useCallback, useMemo } from "react";

import {
  PromptInputButton,
  PromptInputCommand,
  PromptInputCommandGroup,
  PromptInputCommandItem,
  PromptInputCommandList,
  PromptInputCommandSeparator,
  PromptInputHoverCard,
  PromptInputHoverCardContent,
  PromptInputHoverCardTrigger,
} from "@/components/ai-elements/prompt-input";
import {
  AspectRatio,
  getOrientation,
  parseAspectRatio,
  isLandscapeAspectRatio,
  isPortraitAspectRatio,
  isSquareAspectRatio,
  formatAspectRatio,
} from "@/core/types";
import { cn } from "@/lib/utils";

export function AspectRatioSelect({
  value,
  onSelect,
}: {
  value: AspectRatio;
  onSelect?: (aspectRatio: AspectRatio) => void;
}) {
  const orientation = useMemo(() => getOrientation(value), [value]);
  const [longer, shorter] = useMemo<[number, number]>(() => {
    const [x, y] = parseAspectRatio(value);
    if (x === y) {
      return [16, 9];
    } else if (x > y) {
      return [x, y];
    } else {
      return [y, x];
    }
  }, [value]);
  const handleAspectRatioSelect = useCallback(
    (value: AspectRatio) => {
      onSelect?.(value);
    },
    [onSelect],
  );
  return (
    <PromptInputHoverCard openDelay={200} closeDelay={100}>
      <PromptInputHoverCardTrigger className="inline-block">
        <PromptInputButton className="px-1! py-2" size="xs" variant="ghost">
          <AspectIcon className="size-3" aspectRatio={value} />
          <span className="text-xs">{formatAspectRatio(value)}</span>
        </PromptInputButton>
      </PromptInputHoverCardTrigger>
      <PromptInputHoverCardContent className="w-60 p-0">
        <PromptInputCommand>
          <PromptInputCommandList>
            <PromptInputCommandGroup heading="Orientation">
              <AspectSizeCommandItem
                aspectRatio="3:2"
                isSelected={isLandscapeAspectRatio(value)}
                onSelect={() =>
                  handleAspectRatioSelect(`${longer}:${shorter}` as AspectRatio)
                }
              >
                Landscape
              </AspectSizeCommandItem>
              <AspectSizeCommandItem
                aspectRatio="2:3"
                isSelected={isPortraitAspectRatio(value)}
                onSelect={() =>
                  handleAspectRatioSelect(`${shorter}:${longer}` as AspectRatio)
                }
              >
                Portrait
              </AspectSizeCommandItem>
              <AspectSizeCommandItem
                aspectRatio="1:1"
                isSelected={isSquareAspectRatio(value)}
                onSelect={() => handleAspectRatioSelect("1:1")}
              >
                Square
              </AspectSizeCommandItem>
            </PromptInputCommandGroup>
            <PromptInputCommandSeparator />
            <PromptInputCommandGroup heading="Aspect Ratio">
              {AspectRatio._def.values
                .filter((aspectRatio) =>
                  orientation === "square"
                    ? isSquareAspectRatio(aspectRatio)
                    : orientation === "landscape"
                      ? isLandscapeAspectRatio(aspectRatio)
                      : isPortraitAspectRatio(aspectRatio),
                )
                .map((aspectRatio) => (
                  <AspectSizeCommandItem
                    key={aspectRatio}
                    aspectRatio={aspectRatio}
                    isSelected={aspectRatio === value}
                    onSelect={() => handleAspectRatioSelect(aspectRatio)}
                  />
                ))}
            </PromptInputCommandGroup>
          </PromptInputCommandList>
        </PromptInputCommand>
      </PromptInputHoverCardContent>
    </PromptInputHoverCard>
  );
}

export function AspectSizeCommandItem({
  aspectRatio,
  isSelected,
  children,
  ...props
}: {
  aspectRatio: AspectRatio;
  isSelected?: boolean;
} & React.ComponentProps<typeof PromptInputCommandItem>) {
  return (
    <PromptInputCommandItem {...props}>
      <AspectIcon
        className={cn(isSelected ? "text-primary" : "text-muted-foreground")}
        aspectRatio={aspectRatio}
      />
      <span
        className={cn(isSelected ? "text-primary" : "text-muted-foreground")}
      >
        {children ?? formatAspectRatio(aspectRatio)}
      </span>
      <span className="text-primary ml-auto">{isSelected ? "✓" : ""}</span>
    </PromptInputCommandItem>
  );
}

export function AspectIcon({
  className,
  aspectRatio,
}: {
  className?: string;
  aspectRatio: AspectRatio;
}) {
  const [ratioX, ratioY] = useMemo(() => {
    return parseAspectRatio(aspectRatio);
  }, [aspectRatio]);
  return (
    <svg
      className={cn("size-4 duration-200", className)}
      viewBox={`0 0 ${16 * (ratioX / ratioY)} ${16}`}
    >
      <rect
        x={0}
        y={0}
        rx={ratioX === ratioY ? 6 : 3}
        ry={ratioX === ratioY ? 6 : 3}
        width={16 * (ratioX / ratioY)}
        height={16}
        stroke="currentColor"
        strokeWidth={1.5}
        fill="transparent"
      />
    </svg>
  );
}
