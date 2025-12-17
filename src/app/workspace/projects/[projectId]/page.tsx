import { redirect } from "next/navigation";

export default async function WorkspaceProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`./${projectId}/gallery`);
}
