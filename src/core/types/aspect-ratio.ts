import z from "zod";

export const AspectRatio = z.enum([
  "1:1",
  "2:3",
  "3:2",
  "3:4",
  "4:3",
  "16:9",
  "9:16",
]);
export type AspectRatio = z.infer<typeof AspectRatio>;

export function parseAspectRatio(aspectRatio: AspectRatio): [number, number] {
  const [width, height] = aspectRatio.split(":");
  return [Number(width), Number(height)];
}

export function getOrientation(aspectRatio: AspectRatio) {
  return isLandscapeAspectRatio(aspectRatio)
    ? "landscape"
    : isPortraitAspectRatio(aspectRatio)
      ? "portrait"
      : "square";
}

export function formatAspectRatio(aspectRatio: AspectRatio) {
  const [width, height] = parseAspectRatio(aspectRatio);
  return `${width}:${height}`;
}

export function isLandscapeAspectRatio(aspectRatio: AspectRatio) {
  const [width, height] = parseAspectRatio(aspectRatio);
  return width > height;
}

export function isPortraitAspectRatio(aspectRatio: AspectRatio) {
  const [width, height] = parseAspectRatio(aspectRatio);
  return width < height;
}

export function isSquareAspectRatio(aspectRatio: AspectRatio) {
  const [width, height] = parseAspectRatio(aspectRatio);
  return width === height;
}
