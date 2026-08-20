import type { JSONValue, StorageOptions } from "./types.js";

const DEFAULT_PREFIX = "jsonstore:";

function getGlobalStorage(): Storage | null {
  if (typeof globalThis !== "undefined" && typeof globalThis.localStorage !== "undefined") {
    return globalThis.localStorage;
  }
  return null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeDeep(target: unknown, source: unknown): unknown {
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source];
  }
  if (isPlainObject(target) && isPlainObject(source)) {
    const result: Record<string, unknown> = { ...target };
    for (const [key, value] of Object.entries(source)) {
      result[key] = key in result ? mergeDeep(result[key], value) : value;
    }
    return result;
  }
  return source;
}

function deleteDeepPath(obj: Record<string, unknown>, path: string): void {
  const parts = path.split(".");
  let cursor: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i] as string;
    const next = cursor[part];
    if (!isPlainObject(next)) {
      return;
    }
    cursor = next;
  }
  const last = parts[parts.length - 1] as string;
  delete cursor[last];
}

function wrapError(message: string, error: unknown): Error {
  if (error instanceof Error && error.name === "QuotaExceededError") {
    return new Error(`${message}: quota do localStorage excedida.`);
  }
  if (error instanceof Error) {
    return new Error(`${message}: ${error.message}`);
  }
  return new Error(message);
}

export class JsonStorage {
  readonly prefix: string;
  readonly #storage: Storage | null;

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix ?? DEFAULT_PREFIX;
    this.#storage = options.storage ?? getGlobalStorage();
  }

  #store(): Storage {
    if (!this.#storage) {
      throw new Error(
        "localStorage não está disponível neste ambiente. Forneça uma implementação via `storage` em createStorage()."
      );
    }
    return this.#storage;
  }

  #prefixed(key: string): string {
    return this.prefix + key;
  }

  #serialize(value: unknown): string {
    let serialized: string | undefined;
    try {
      serialized = JSON.stringify(value) ?? undefined;
    } catch (error) {
      throw new Error(`Valor não serializável em JSON: ${String(error)}`, {
        cause: error,
      });
    }
    if (serialized === undefined) {
      throw new TypeError("Valor não serializável em JSON (undefined, function ou symbol).");
    }
    return serialized;
  }

  set(key: string, value: unknown): void {
    const serialized = this.#serialize(value);
    try {
      this.#store().setItem(this.#prefixed(key), serialized);
    } catch (error) {
      throw wrapError(`Falha ao salvar a chave "${key}"`, error);
    }
  }

  add(key: string, value: unknown): void {
    const current = this.get(key);
    if (current === null) {
      this.set(key, value);
      return;
    }
    this.set(key, mergeDeep(current, value));
  }

  get<T = JSONValue>(key: string): T | null {
    const raw = this.#store().getItem(this.#prefixed(key));
    if (raw === null) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  has(key: string): boolean {
    return this.#store().getItem(this.#prefixed(key)) !== null;
  }

  keys(): string[] {
    const store = this.#store();
    const result: string[] = [];
    for (let i = 0; i < store.length; i++) {
      const rawKey = store.key(i);
      if (rawKey?.startsWith(this.prefix)) {
        result.push(rawKey.slice(this.prefix.length));
      }
    }
    return result;
  }

  size(): number {
    return this.keys().length;
  }

  remove(key: string, ...fields: string[]): void {
    if (fields.length === 0) {
      this.#store().removeItem(this.#prefixed(key));
      return;
    }
    const current = this.get(key);
    if (!isPlainObject(current)) {
      return;
    }
    for (const field of fields) {
      deleteDeepPath(current, field);
    }
    this.set(key, current);
  }

  clear(): void {
    const store = this.#store();
    for (const key of this.keys()) {
      store.removeItem(this.prefix + key);
    }
  }
}
