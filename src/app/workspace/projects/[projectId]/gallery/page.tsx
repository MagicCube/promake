"use client";

import { useParams } from "next/navigation";

import { PromptInputProvider } from "@/components/ai-elements/prompt-input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CreateGenerationCard } from "@/components/workspace/create-generation-card";
import { GenerationMasonryList } from "@/components/workspace/generation-masonry-list";

export default function ProjectGalleryPage() {
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <div className="flex size-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="pb-4" defaultSize={36}>
          <PromptInputProvider>
            <CreateGenerationCard
              className="h-full w-full"
              projectId={projectId}
            />
          </PromptInputProvider>
        </ResizablePanel>
        <ResizableHandle className="opacity-0" />
        <ResizablePanel>
          <GenerationMasonryList className="size-full" projectId={projectId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
