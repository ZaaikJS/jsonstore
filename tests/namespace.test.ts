import { describe, expect, it } from "vitest";
import { createStorage } from "../src/index.js";
import { MemoryStorage } from "./memory-storage.js";

describe("namespace", () => {
  it("usa o prefixo padrão jsonstore:", () => {
    const store = new MemoryStorage();
    const storage = createStorage({ storage: store });

    storage.set("user", { id: 1 });

    expect(store.getItem("jsonstore:user")).toBe(JSON.stringify({ id: 1 }));
    expect(store.getItem("user")).toBeNull();
  });

  it("suporta prefixo customizado", () => {
    const store = new MemoryStorage();
    const storage = createStorage({ storage: store, prefix: "app:" });

    storage.set("user", { id: 1 });

    expect(store.getItem("app:user")).not.toBeNull();
    expect(store.getItem("jsonstore:user")).toBeNull();
  });

  it("clear limpa apenas chaves do pacote", () => {
    const store = new MemoryStorage();
    const storage = createStorage({ storage: store });

    storage.set("user", { id: 1 });
    store.setItem("unrelated", "nao mexa");

    storage.clear();

    expect(store.getItem("jsonstore:user")).toBeNull();
    expect(store.getItem("unrelated")).toBe("nao mexa");
  });

  it("clear não afeta outro namespace", () => {
    const store = new MemoryStorage();
    const a = createStorage({ storage: store, prefix: "a:" });
    const b = createStorage({ storage: store, prefix: "b:" });

    a.set("x", 1);
    b.set("y", 2);

    a.clear();

    expect(store.getItem("a:x")).toBeNull();
    expect(store.getItem("b:y")).not.toBeNull();
  });

  it("instâncias com prefixo igual compartilham as chaves", () => {
    const store = new MemoryStorage();
    const a = createStorage({ storage: store });
    const b = createStorage({ storage: store });

    a.set("x", 1);
    b.set("y", 2);

    expect(a.keys().sort()).toEqual(["x", "y"]);
    expect(a.get("y")).toBe(2);
  });

  it("lança erro claro quando não há localStorage disponível", () => {
    const storage = createStorage({ storage: null });
    expect(() => storage.set("user", { id: 1 })).toThrow(/localStorage não está disponível/);
  });
});
