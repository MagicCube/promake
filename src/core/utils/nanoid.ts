import { nanoid as nanoidPrimitive } from "nanoid";

export function nanoid(length = 8) {
  return nanoidPrimitive(length);
}
