import { useCallback } from "react";

import {
  type GenerationOutput,
  type Generation,
  type GenerationInput,
} from "@/core/types";
import { nanoid } from "@/core/utils/nanoid";
import { api } from "@/trpc/react";

export function useCreateGeneration() {
  const utils = api.useUtils();
  const createGeneration = api.generation.create.useMutation();
  const callback = useCallback(
    async ({
      projectId,
      input,
      batchSize,
    }: {
      projectId: string;
      input: GenerationInput;
      batchSize: number;
    }) => {
      const generation: Generation = {
        id: nanoid(),
        input,
        batchSize,
        outputs: [],
      };

      const newGeneration = await createGeneration.mutateAsync({
        projectId,
        generationId: generation.id,
        data: generation,
      });

      utils.project.get.setData({ projectId }, (old) => {
        return {
          ...old!,
          generations: [newGeneration, ...old!.generations],
        };
      });

      return newGeneration;
    },
    [createGeneration, utils.project.get],
  );
  return callback;
}

export function useRegenerate() {
  const updateGeneration = api.generation.update.useMutation();
  const optimisticUpdateGeneration = useOptimisticUpdateGeneration();
  const updateGenerationOutput = api.generation.updateOutput.useMutation();
  const optimisticUpdateGenerationOutput =
    useOptimisticUpdateGenerationOutput();
  const generate = api.generation.generate.useMutation();
  const callback = useCallback(
    async ({
      projectId,
      generation,
    }: {
      projectId: string;
      generation: Generation;
    }) => {
      const outputs: GenerationOutput[] = [];
      let startIndex = 1;
      if (generation.outputs.length > 0) {
        const lastIndex = parseInt(
          generation.outputs[generation.outputs.length - 1]!.id,
        );
        startIndex = lastIndex + 1;
      }
      for (let i = 0; i < generation.batchSize; i++) {
        outputs.push({
          id: (startIndex + i).toString().padStart(3, "0"),
          state: "pending",
        });
      }
      await updateGeneration.mutateAsync({
        projectId,
        generationId: generation.id,
        data: {
          outputs,
          defaultOutputId: undefined,
        },
      });
      optimisticUpdateGeneration({
        projectId,
        generationId: generation.id,
        data: {
          outputs,
        },
      });
      const promises = outputs.map(async (output) => {
        const newOutput = await generate.mutateAsync({
          projectId,
          generationId: generation.id,
          outputId: output.id,
          input: generation.input,
        });
        await updateGenerationOutput.mutateAsync({
          projectId,
          generationId: generation.id,
          outputId: output.id,
          data: newOutput,
        });
        optimisticUpdateGenerationOutput({
          projectId,
          generationId: generation.id,
          outputId: output.id,
          data: newOutput,
        });
        return newOutput;
      });
      await Promise.all(promises);
    },
    [
      generate,
      optimisticUpdateGeneration,
      optimisticUpdateGenerationOutput,
      updateGeneration,
      updateGenerationOutput,
    ],
  );
  return callback;
}

export function useDeleteGeneration() {
  const utils = api.useUtils();
  const deleteGeneration = api.generation.delete.useMutation();
  const callback = useCallback(
    async ({
      projectId,
      generationId,
    }: {
      projectId: string;
      generationId: string;
    }) => {
      await deleteGeneration.mutateAsync({
        projectId,
        generationId,
      });
      utils.project.get.setData({ projectId }, (old) => {
        return {
          ...old!,
          generations: old!.generations.filter((g) => g.id !== generationId),
        };
      });
    },
    [deleteGeneration, utils.project.get],
  );
  return callback;
}

export function useSetDefaultGenerationOutput() {
  const optimisticUpdateGeneration = useOptimisticUpdateGeneration();
  const setDefaultOutput = api.generation.setDefaultOutput.useMutation();
  const callback = useCallback(
    async ({
      projectId,
      generationId,
      outputId,
    }: {
      projectId: string;
      generationId: string;
      outputId: string;
    }) => {
      await setDefaultOutput.mutateAsync({
        projectId,
        generationId,
        outputId,
      });
      optimisticUpdateGeneration({
        projectId,
        generationId,
        data: {
          defaultOutputId: outputId,
        },
      });
    },
    [optimisticUpdateGeneration, setDefaultOutput],
  );
  return callback;
}

function useOptimisticUpdateGeneration() {
  const utils = api.useUtils();
  const callback = useCallback(
    ({
      projectId,
      generationId,
      data,
    }: {
      projectId: string;
      generationId: string;
      data: Partial<Omit<Generation, "id">>;
    }) => {
      utils.project.get.setData({ projectId }, (old) => {
        return {
          ...old!,
          generations: old!.generations.map((g) => {
            if (g.id === generationId) {
              return {
                ...g,
                ...data,
              };
            }
            return g;
          }),
        };
      });
    },
    [utils.project.get],
  );
  return callback;
}

function useOptimisticUpdateGenerationOutput() {
  const utils = api.useUtils();
  const callback = useCallback(
    ({
      projectId,
      generationId,
      outputId,
      data,
    }: {
      projectId: string;
      generationId: string;
      outputId: string;
      data: Omit<GenerationOutput, "id">;
    }) => {
      utils.project.get.setData({ projectId }, (old) => {
        return {
          ...old!,
          generations: old!.generations.map((g) => {
            if (g.id === generationId) {
              return {
                ...g,
                outputs: g.outputs.map((o) => {
                  if (o.id === outputId) {
                    return { id: o.id, ...data } as GenerationOutput;
                  }
                  return o;
                }),
              };
            }
            return g;
          }),
        };
      });
    },
    [utils.project.get],
  );
  return callback;
}
