import { useCallback } from "react";

import { api } from "@/trpc/react";

export function useProjectQuery({ projectId }: { projectId?: string }) {
  const ret = api.project.get.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId },
  );
  return ret;
}

export function useProjectListQuery(config?: { enabled?: boolean }) {
  const ret = api.project.list.useQuery(undefined, config);
  return ret;
}

export function useCreateProject() {
  const utils = api.useUtils();
  const createProject = api.project.create.useMutation();
  const callback = useCallback(
    async ({
      projectId,
      data,
    }: {
      projectId: string;
      data: {
        name: string;
        generations: [];
      };
    }) => {
      const newProject = await createProject.mutateAsync({ projectId, data });
      utils.project.list.setData(undefined, (old) => {
        return [
          { id: newProject.id, name: newProject.name, thumbnail: undefined },
          ...old!,
        ];
      });
    },
    [createProject, utils.project.list],
  );
  return callback;
}

export function useUpdateProject() {
  const utils = api.useUtils();
  const updateProject = api.project.update.useMutation({
    onSuccess: async ({ id: projectId }, { data }) => {
      utils.project.get.setData({ projectId }, (old) => {
        const changes = {
          ...old!,
        };
        if (data.name) {
          changes.name = data.name;
        }
        return changes;
      });
      utils.project.list.setData(undefined, (old) => {
        if (data.name) {
          return old!.map((p) => {
            if (p.id === projectId) {
              return {
                ...p,
                name: data.name!,
              };
            }
            return p;
          });
        }
        return old;
      });
    },
  });
  return updateProject.mutateAsync;
}

export function useDeleteProject() {
  const utils = api.useUtils();
  const deleteProject = api.project.delete.useMutation({
    onSuccess: async (_, { projectId }) => {
      utils.project.list.setData(undefined, (old) => {
        return old!.filter((p) => p.id !== projectId);
      });
    },
  });
  return deleteProject.mutateAsync;
}
