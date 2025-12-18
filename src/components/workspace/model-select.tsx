import { Banana, Cpu, Sailboat } from "lucide-react";
import { useMemo } from "react";

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
import { api } from "@/trpc/react";

export function useProviders() {
  const { data: providers = [] } = api.provider.list.useQuery();
  return providers;
}

export function useModel(modelName: string) {
  const { data: providers = [] } = api.provider.list.useQuery();
  const model = useMemo(() => {
    for (const provider of providers) {
      const foundModel = provider.supportedModels.find(
        (m) => m.name === modelName,
      );
      if (foundModel) return foundModel;
    }
    return null;
  }, [providers, modelName]);
  return model;
}

export function ModelSelect({
  modelName,
  onSelect,
}: {
  modelName: string;
  onSelect?: (model: string, provider: string) => void;
}) {
  const { data: providers = [] } = api.provider.list.useQuery();
  const model = useModel(modelName);
  const icon = useMemo(() => {
    const provider = providers.find((p) =>
      p.supportedModels.some((m) => m.name === model?.name),
    );
    if (!provider) return null;
    switch (provider.name) {
      case "gemini":
        return <Banana />;
      case "midjourney":
        return <Sailboat />;
      default:
        return <Cpu />;
    }
  }, [model, providers]);
  return (
    <PromptInputHoverCard openDelay={200} closeDelay={100}>
      <PromptInputHoverCardTrigger className="inline-block">
        <PromptInputButton className="px-1! py-2" size="xs" variant="ghost">
          <div className="flex items-center justify-center gap-0.5">
            {icon}
            <span className="font-normal">
              {model?.displayName ?? modelName}
            </span>
          </div>
        </PromptInputButton>
      </PromptInputHoverCardTrigger>
      <PromptInputHoverCardContent className="w-48 p-0">
        <PromptInputCommand>
          <PromptInputCommandList>
            {providers.map((provider) => (
              <PromptInputCommandGroup
                key={provider.name}
                heading={provider.displayName}
              >
                {provider.supportedModels.map((model) => (
                  <PromptInputCommandItem
                    key={model.name}
                    className="whitespace-nowrap"
                    onSelect={() => onSelect?.(model.name, provider.name)}
                  >
                    <div>{model.displayName}</div>
                    <span className="text-primary ml-auto">
                      {model.name === modelName ? "✓" : ""}
                    </span>
                  </PromptInputCommandItem>
                ))}
              </PromptInputCommandGroup>
            ))}
          </PromptInputCommandList>
        </PromptInputCommand>
      </PromptInputHoverCardContent>
    </PromptInputHoverCard>
  );
}
