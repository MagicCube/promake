export function isJSON(text: string): boolean {
  if (!/^\s*[\{\[]/.test(text)) return false;
  return true;
}
