import { beforeEach, describe, expect, it } from "vitest";
import { createStorage } from "../src/index.js";
import { MemoryStorage } from "./memory-storage.js";

interface User {
  id: number;
  name: string;
  age?: number;
  genre?: string;
  address?: { city: string; number?: number };
}

describe("JsonStorage", () => {
  let storage: ReturnType<typeof createStorage>;

  beforeEach(() => {
    storage = createStorage({ storage: new MemoryStorage() });
  });

  it("salva e lê um objeto completo", () => {
    storage.set("user", { id: 123, name: "Harrison" });
    const user = storage.get<User>("user");
    expect(user).toEqual({ id: 123, name: "Harrison" });
  });

  it("set substitui o valor existente", () => {
    storage.set("user", { id: 1, name: "A" });
    storage.set("user", { id: 2, name: "B" });
    expect(storage.get("user")).toEqual({ id: 2, name: "B" });
  });

  it("get retorna null para chave inexistente", () => {
    expect(storage.get("missing")).toBeNull();
  });

  it("get retorna null para JSON corrompido", () => {
    const store = new MemoryStorage();
    const corrupted = createStorage({ storage: store });
    store.setItem("jsonstore:broken", "{nao-e-json");
    expect(corrupted.get("broken")).toBeNull();
  });

  it("add mescla campos no objeto existente", () => {
    storage.set("user", { id: 123, name: "Harrison" });
    storage.add("user", { age: 34, genre: "Male" });
    expect(storage.get<User>("user")).toEqual({
      id: 123,
      name: "Harrison",
      age: 34,
      genre: "Male",
    });
  });

  it("add faz deep merge em objetos aninhados", () => {
    storage.set("user", { id: 123, address: { city: "SP", street: "A" } });
    storage.add("user", { address: { number: 100 } });
    expect(storage.get<User>("user")).toEqual({
      id: 123,
      address: { city: "SP", street: "A", number: 100 },
    });
  });

  it("add concatena arrays", () => {
    storage.set("tags", ["a", "b"]);
    storage.add("tags", ["c", "d"]);
    expect(storage.get<string[]>("tags")).toEqual(["a", "b", "c", "d"]);
  });

  it("add em chave inexistente comporta-se como set", () => {
    storage.add("user", { id: 1 });
    expect(storage.get("user")).toEqual({ id: 1 });
  });

  it("remove apaga a chave inteira", () => {
    storage.set("user", { id: 1 });
    storage.remove("user");
    expect(storage.get("user")).toBeNull();
    expect(storage.has("user")).toBe(false);
  });

  it("remove apaga apenas campos específicos", () => {
    storage.set("user", { id: 1, name: "A", age: 30, genre: "M" });
    storage.remove("user", "age", "genre");
    expect(storage.get("user")).toEqual({ id: 1, name: "A" });
  });

  it("remove apaga campo aninhado via caminho com ponto", () => {
    storage.set("user", { id: 1, address: { city: "SP", number: 100 } });
    storage.remove("user", "address.number");
    expect(storage.get("user")).toEqual({ id: 1, address: { city: "SP" } });
  });

  it("remove em chave inexistente não lança erro", () => {
    expect(() => storage.remove("missing")).not.toThrow();
  });

  it("has e size refletem o estado atual", () => {
    storage.set("a", 1);
    storage.set("b", 2);
    expect(storage.has("a")).toBe(true);
    expect(storage.size()).toBe(2);
    storage.remove("a");
    expect(storage.has("a")).toBe(false);
    expect(storage.size()).toBe(1);
  });

  it("keys retorna apenas as chaves do pacote", () => {
    storage.set("a", 1);
    storage.set("b", 2);
    expect(storage.keys().sort()).toEqual(["a", "b"]);
  });

  it("lança erro ao salvar valor não serializável", () => {
    expect(() => storage.set("fn", () => 1)).toThrow(TypeError);
    expect(() => storage.set("undef", undefined)).toThrow(TypeError);
  });
});
