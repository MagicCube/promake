export function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  let result = str.charAt(0).toUpperCase() + str.slice(1);
  result = result.replace("-", " ");
  return result;
}
