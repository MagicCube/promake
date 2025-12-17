export default async function WorkspaceProjectNotFoundPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const projectId = (await searchParams).projectId;
  return (
    <div className="flex size-full items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1>Project &quot;{projectId}&quot; is not found</h1>
        <p className="text-muted-foreground text-sm">
          The project you are trying to access does not exist.
        </p>
      </div>
    </div>
  );
}
