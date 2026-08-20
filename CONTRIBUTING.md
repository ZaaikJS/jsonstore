# Contributing

Thanks for taking the time to contribute! 🎉

Please take a moment to read this document — it keeps the project consistent and makes reviewing pull requests fast and pleasant.

## Getting started

1. **Fork** the repository on GitHub.
2. **Clone** your fork:

   ```bash
   git clone https://github.com/<your-username>/jsonstore.git
   cd jsonstore
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Create a branch** for your work:

   ```bash
   git checkout -b feat/my-awesome-change
   ```

## Development

Before opening a pull request, make sure everything passes:

| Command          | What it does                    |
| ---------------- | ------------------------------- |
| `npm run build`  | Compiles ESM + CJS into `dist/` |
| `npm run lint`   | Runs ESLint                     |
| `npm run format` | Formats the code with Prettier  |
| `npm test`       | Runs the tests with Vitest      |

Run the full quality gate before submitting:

```bash
npm run lint
npm run format:check
npm test
npm run build
```

### Tests

- Add or update tests in the `tests/` directory for every change.
- Tests must run in Node (they use an in-memory `Storage` mock — no browser needed).
- Make sure the entire suite passes: `npm test`.

### Code style

- The project uses **ESLint** + **Prettier** — no manual style debates.
- `npm run format` fixes formatting automatically; `npm run lint:fix` fixes lint issues.
- TypeScript is strict (`strict: true`). Keep new code type-safe and avoid `any`.

### Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add a new method
fix: handle corrupted JSON
docs: update the README
test: cover the add() merge
chore: bump dependencies
ci: drop Node 18
```

## Opening a pull request

1. Push your branch to your fork:

   ```bash
   git push origin feat/my-awesome-change
   ```

2. Open a pull request against the `main` branch of `ZaaikJS/jsonstore`.
3. Describe **what** you changed and **why**.
4. If the change is user-visible, update the `README.md` accordingly.
5. CI runs automatically (lint, format, tests, build) — make sure it's green.

## Becoming a contributor

This project uses [all-contributors](https://allcontributors.org). Once your pull request is merged (or your issue/help is acknowledged), add yourself to the list:

```bash
npm run contributors:add -- <your-username> <contribution-type>
npm run contributors:generate
```

Common contribution types: `code`, `doc`, `test`, `bug`, `ideas`, `review`, `infra`.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
