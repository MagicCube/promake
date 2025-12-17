import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { Copy, Hash, MoreVertical, RefreshCcw, Trash2 } from "lucide-react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

import {
  useDeleteGeneration,
  useRegenerate,
} from "@/client/biz-logic/generation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LightRays } from "@/components/ui/light-rays";
import { type GenerationOutput, type Generation } from "@/core/types";
import { cn } from "@/lib/utils";

import { Scrubber } from "./scrubber";

export function GenerationCard({
  className,
  projectId,
  generation,
  onSelect,
}: {
  className?: string;
  projectId: string;
  generation: Generation;
  onSelect?: (output: GenerationOutput) => void;
}) {
  const regenerate = useRegenerate();
  const deleteGeneration = useDeleteGeneration();
  const defaultOutputIndex = useMemo(() => {
    if (!generation.defaultOutputId) {
      return 0;
    }
    return generation.outputs.findIndex(
      (output) => output.id === generation.defaultOutputId,
    );
  }, [generation.defaultOutputId, generation.outputs]);

  const handleCopyPrompt = useCallback(async () => {
    await navigator.clipboard.writeText(generation.input.prompt);
    toast("Prompt copied to clipboard");
  }, [generation.input.prompt]);
  const handleRegenerate = useCallback(async () => {
    await regenerate({
      projectId,
      generation: generation,
    });
  }, [generation, projectId, regenerate]);
  const handleDeleteGeneration = useCallback(async () => {
    await deleteGeneration({
      projectId,
      generationId: generation.id,
    });
  }, [deleteGeneration, generation.id, projectId]);
  const handleDoubleClick = useCallback(
    (output: GenerationOutput) => {
      onSelect?.(output);
    },
    [onSelect],
  );
  return (
    <Card
      className={cn(
        `group/creation-card aspect-${generation.input.aspectRatio.replace(":", "/")} relative overflow-hidden p-0`,
        className,
      )}
    >
      <CardHeader className="absolute top-0 right-0 left-0 z-10 flex h-12 bg-linear-to-b from-[rgba(0,0,0,0.2)] to-transparent px-2 pt-2 opacity-0 transition-opacity delay-500 duration-200 select-none group-hover/creation-card:opacity-100">
        <div className="flex w-full items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={handleCopyPrompt}>
                <Copy />
                <span>Copy Prompt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleRegenerate}>
                <RefreshCcw />
                <span>Regenerate</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleDeleteGeneration}>
                <Trash2 />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="size-full p-0">
        <Scrubber defaultIndex={defaultOutputIndex}>
          {generation.outputs.map((output, i) => (
            <CardImage
              key={i}
              projectId={projectId}
              generationId={generation.id}
              image={output}
              onDoubleClick={() => handleDoubleClick(output)}
            />
          ))}
        </Scrubber>
      </CardContent>
      <CardFooter className="absolute right-0 bottom-0 left-0 z-10 flex translate-y-12 flex-col items-start bg-linear-to-b from-transparent to-[rgba(0,0,0,0.75)] px-4 opacity-0 transition-transform delay-600 duration-200 group-hover/creation-card:translate-y-0 group-hover/creation-card:opacity-100">
        <div className="py-2 select-text">
          <div
            className="line-clamp-2 h-8 cursor-pointer overflow-hidden text-xs text-shadow-2xs"
            onClick={handleCopyPrompt}
          >
            {generation.input.prompt}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function CardImage({
  className,
  image,
  projectId,
  generationId,
  onClick,
  onDoubleClick,
}: {
  className?: string;
  image: GenerationOutput;
  projectId: string;
  generationId: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
}) {
  if (image.state === "error") {
    return (
      <div
        className={cn("flex size-full items-center justify-center", className)}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        <div className="text-white">
          <h3 className="text-lg font-bold">Failed to generate image</h3>
          <div className="text-sm text-white/80">{image.error ?? ""}</div>
        </div>
        <LightRays
          className={className}
          color="rgba(255, 128, 128, 0.8)"
          count={2}
          speed={6}
        />
      </div>
    );
  } else if (image.state === "completed" && image.url) {
    return (
      <img
        className={cn("size-full object-cover", className)}
        src={`/data/projects/${projectId}/${generationId}/${image.url}`}
        alt=""
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      />
    );
  }
  return (
    <div
      className="animate-bg size-full object-cover"
      style={{
        backgroundImage:
          "linear-gradient(125deg,#2c3e50,oklch(0.6972 0.1141 143.89),#2980b9,#e74c3c,#8e44ad)",
        backgroundSize: "400% 400%",
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    ></div>
  );
}
