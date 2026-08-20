import { JsonStorage } from "./storage.js";
import type { StorageOptions } from "./types.js";

export { JsonStorage } from "./storage.js";
export type { JSONPrimitive, JSONValue, JSONObject, StorageOptions } from "./types.js";

export function createStorage(options?: StorageOptions): JsonStorage {
  return new JsonStorage(options);
}

export const storage = createStorage();
