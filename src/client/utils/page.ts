export function getPageNameFromPath(pathname: string) {
  const parts = pathname.split("/");
  const lastPart = parts[parts.length - 1];
  if (!lastPart) return null;
  return lastPart;
}
