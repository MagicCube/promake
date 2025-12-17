import { ImageIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";

import { useSetDefaultGenerationOutput } from "@/client/biz-logic/generation";
import { useProjectQuery } from "@/client/biz-logic/project";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Generation, GenerationOutput } from "@/core/types";
import { cn } from "@/lib/utils";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

import { GenerationCard } from "./generation-card";
import { toast } from "sonner";

export function GenerationMasonryList({
  className,
  projectId,
  ...props
}: React.ComponentProps<typeof ScrollArea> & {
  projectId: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: project } = useProjectQuery({ projectId });
  const setDefaultGenerationOutput = useSetDefaultGenerationOutput();
  const [cols, setCols] = useState(3);
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const observer = new ResizeObserver(() => {
      const width = containerRef.current!.offsetWidth;
      if (width < 640) {
        setCols(1);
      } else if (width < 1024) {
        setCols(2);
      } else {
        setCols(3);
      }
    });
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [project]);
  const handleOutputSelect = useCallback(
    async ({
      output,
      generation,
    }: {
      output: GenerationOutput;
      generation: Generation;
    }) => {
      if (generation.outputs.length > 1) {
        await setDefaultGenerationOutput({
          projectId,
          generationId: generation.id,
          outputId: output.id,
        });
        toast("Default image set");
      }
    },
    [projectId, setDefaultGenerationOutput],
  );
  if (!project) {
    return null;
  }
  return (
    <ScrollArea
      ref={containerRef}
      className={cn("select-none", className)}
      {...props}
    >
      <div className="flex size-full justify-center">
        {project.generations.length === 0 ? (
          <Empty className="mt-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon />
              </EmptyMedia>
              <EmptyTitle>No image yet</EmptyTitle>
              <EmptyDescription>
                No image found in the current project yet. Get started by
                generating your first image in the left panel.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Masonry
            breakpointCols={cols}
            className="-ml-2 flex size-full"
            columnClassName="pl-4 bg-clip-padding"
          >
            {project.generations.map((generation) => (
              <GenerationCard
                key={generation.id}
                className="mb-4"
                projectId={projectId}
                generation={generation}
                onSelect={(output) =>
                  handleOutputSelect({ generation, output })
                }
              />
            ))}
          </Masonry>
        )}
      </div>
    </ScrollArea>
  );
}
