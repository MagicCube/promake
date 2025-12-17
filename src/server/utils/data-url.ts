import fs from "fs/promises";
import path from "path";

const MIME_MAP = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
};

export function isDataURL(url: string) {
  return url.startsWith("data:");
}

export function parseDataURL(url: string) {
  if (!isDataURL(url)) {
    throw new Error("Invalid data URL");
  }
  const parts = url.split(",");
  const mimeType = parts[0]?.split(":")[1]?.split(";")[0];
  const data = parts[1]!;
  let fileExtension: string;
  if (mimeType === "image/jpeg") {
    fileExtension = ".jpg";
  } else if (mimeType === "image/png") {
    fileExtension = ".png";
  } else {
    throw new Error("Unsupported MIME type");
  }
  return { mimeType, data, fileExtension };
}

export async function convertToDataURL(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_MAP[ext as keyof typeof MIME_MAP];

  if (!mimeType) {
    throw new Error(`Unsupported file format: ${ext}`);
  }

  const fileBuffer = await fs.readFile(filePath);
  const base64String = fileBuffer.toString("base64");

  return `data:${mimeType};base64,${base64String}`;
}
