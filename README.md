# jsonstore

> A tiny typed wrapper around `localStorage` for painless JSON persistence.

Save, merge, and read JSON objects in `localStorage` with full TypeScript support — no configuration, no dependencies, no bundler required.

[![Repo size](https://img.shields.io/github/repo-size/ZaaikJS/jsonstore)](https://github.com/ZaaikJS/jsonstore)
[![Language](https://img.shields.io/github/languages/top/ZaaikJS/jsonstore)](https://github.com/ZaaikJS/jsonstore)
[![Forks](https://img.shields.io/github/forks/ZaaikJS/jsonstore)](https://github.com/ZaaikJS/jsonstore)
[![Issues](https://img.shields.io/github/issues/ZaaikJS/jsonstore)](https://github.com/ZaaikJS/jsonstore/issues)
[![Pull requests](https://img.shields.io/github/issues-pr/ZaaikJS/jsonstore)](https://github.com/ZaaikJS/jsonstore/pulls)
[![Contributors](https://img.shields.io/github/contributors/ZaaikJS/jsonstore)](https://github.com/ZaaikJS/jsonstore/graphs/contributors)
[![License](https://img.shields.io/github/license/ZaaikJS/jsonstore)](https://github.com/ZaaikJS/jsonstore/blob/main/LICENSE)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg)](#contributors)

---

## Features

- **Typed reads** — `get<T>(key)` gives you autocomplete and compile-time safety.
- **Deep merge** — `add()` merges nested objects recursively and appends to arrays.
- **Namespaced** — a prefix keeps your keys isolated from anything else on the domain.
- **Scoped `clear()`** — only removes keys created by the package, never the whole storage.
- **SSR-safe** — throws a clear error outside the browser, or accept any `Storage` implementation.
- **Zero dependencies** — ships as dual ESM + CJS.
- **Resilient** — returns `null` for missing or corrupted data instead of crashing.

## Installation

```bash
npm install @zaaik/jsonstore
```

## Quick start

```ts
import { storage } from "@zaaik/jsonstore";

interface User {
  id: number;
  name: string;
  age?: number;
  genre?: string;
}

// save (or replace) a complete object
storage.set("user", {
  id: 123,
  name: "Michael",
});

// merge new fields into the existing object
storage.add("user", {
  age: 34,
  genre: "Male",
});

// read a typed value — null if it doesn't exist
const user = storage.get<User>("user");
console.log(user?.name); // "Michael"
```

## API reference

### `set(key, value)`

Replaces the entire value stored under `key`.

```ts
storage.set("user", { id: 123, name: "Michael" });
storage.set("theme", "dark");
```

### `add(key, value)`

Merges `value` into the existing stored data. If the key does not exist yet, it behaves like `set()`.

- **Objects** are merged deeply (nested keys are preserved).
- **Arrays** are concatenated.
- Any other value replaces the current one.

```ts
storage.set("user", {
  id: 123,
  address: { city: "BS", street: "A" },
});

storage.add("user", { address: { number: 100 } });
// => { id: 123, address: { city: "BS", street: "A", number: 100 } }

storage.set("tags", ["a", "b"]);
storage.add("tags", ["c"]);
// => ["a", "b", "c"]
```

### `get<T>(key)`

Returns the parsed value typed as `T`, or `null` if the key is missing or its JSON is corrupted.

```ts
const user = storage.get<User>("user"); // User | null
const missing = storage.get<User>("admin"); // null
```

### `remove(key)`

Deletes the entire key.

```ts
storage.remove("user");
```

### `remove(key, ...fields)`

Deletes only the given fields from the stored object. Nested paths are supported with dot notation.

```ts
storage.remove("user", "age", "genre");
storage.remove("user", "address.number");
```

### `has(key)`

Returns `true` if the key exists.

```ts
storage.has("user"); // boolean
```

### `keys()`

Returns all keys saved by this namespace (without the prefix).

```ts
storage.keys(); // ["user", "theme"]
```

### `size()`

Returns the number of saved keys.

```ts
storage.size(); // 2
```

### `clear()`

Removes **only** the keys created by the package namespace — unrelated keys on the domain are untouched.

```ts
storage.clear();
```

## Namespaces

Each instance stores keys under a prefix, avoiding collisions with other keys on the same origin. The default `storage` instance uses the `jsonstore:` prefix.

```ts
import { storage, createStorage } from "@zaaik/jsonstore";

const settings = createStorage({ prefix: "app:settings:" });

settings.set("theme", "dark");
storage.keys(); // [] — different namespace, no interference
```

Instances sharing the same prefix share their data; instances with different prefixes are fully isolated — including `clear()`.

## TypeScript

`get<T>` is the only place you specify a type manually, because it's the only method that returns data of unknown shape.

```ts
interface User {
  id: number;
  name: string;
}

const user = storage.get<User>("user");
user.name; // autocomplete + type checking
```

`set()` and `add()` infer the type from the value you pass, and values are validated for JSON serializability at runtime (functions, `undefined`, and symbols throw a clear `TypeError`).

## SSR & testing

Outside the browser, there is no global `localStorage`. Provide any object implementing the standard `Storage` interface — useful in tests or server environments.

```ts
import { createStorage } from "@zaaik/jsonstore";

const storage = createStorage({
  storage: myCustomStorage, // any Storage-compatible implementation
});

storage.set("user", { id: 1 });
```

Without a `localStorage` available, every method throws a descriptive error telling you to pass a `storage` implementation.

## Development

| Script           | Description                    |
| ---------------- | ------------------------------ |
| `npm run build`  | Compile ESM + CJS into `dist/` |
| `npm run lint`   | Run ESLint                     |
| `npm run format` | Format the code with Prettier  |
| `npm test`       | Run the tests with Vitest      |

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on setting up the project, running tests, and opening pull requests.

## Contributors

Thanks to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://voxymc.net/"><img src="https://avatars.githubusercontent.com/u/67669903?v=4?s=100" width="100px;" alt="Harrison"/><br /><sub><b>Harrison</b></sub></a><br /><a href="https://github.com/ZaaikJS/jsonstore/commits?author=ZaaikJS" title="Code">💻</a> <a href="https://github.com/ZaaikJS/jsonstore/commits?author=ZaaikJS" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

Contributions of any kind are welcome!

## License

MIT
