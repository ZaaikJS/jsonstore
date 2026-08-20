import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const stubs = [
  { dir: "dist/esm", content: { type: "module" } },
  { dir: "dist/cjs", content: { type: "commonjs" } },
];

for (const { dir, content } of stubs) {
  const target = join(root, dir, "package.json");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(content, null, 2)}\n`);
  console.log(`created ${dir}/package.json`);
}
