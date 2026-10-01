import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const source = join(root, "src");
const routes = [
  ["", "overview"],
  ["marketing", "marketing"],
  ["marketing/analytics", "analytics"],
  ["marketing/search-console", "search-console"],
  ["marketing/tag-manager", "tag-manager"],
  ["marketing/attribution", "attribution"]
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
const template = await readFile(join(source, "index.html"), "utf8");
for (const [path, page] of routes) {
  const target = join(dist, path, "index.html");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, template.replaceAll("__TCFR_PAGE__", page));
}
await cp(join(source, "assets"), join(dist, "assets"), { recursive: true });
await writeFile(join(dist, "robots.txt"), "User-agent: *\nDisallow: /\n");
await writeFile(join(dist, "_routes.json"), JSON.stringify({ version: 1, include: ["/*"], exclude: [] }, null, 2));
console.log(`Built ${routes.length} private routes in ${dist}`);
