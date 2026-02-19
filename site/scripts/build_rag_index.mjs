import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const inputRoots = [
  path.join(rootDir, "src", "content", "projects"),
  path.join(rootDir, "src", "content", "writing"),
  path.join(rootDir, "src", "pages", "now.md"),
];

const outputPath = path.join(rootDir, "src", "rag", "index.json");
const embedModel = process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small";
const apiKey = process.env.OPENAI_API_KEY;

let openai = null;
if (apiKey) {
  try {
    const { default: OpenAI } = await import("openai");
    openai = new OpenAI({ apiKey });
  } catch {
    console.warn("OPENAI_API_KEY is set but openai SDK is not installed. Continuing without embeddings.");
  }
}

const walk = async (entryPath) => {
  const entries = await readdir(entryPath, { withFileTypes: true }).catch(() => null);
  if (!entries) {
    return [entryPath];
  }

  const results = [];

  for (const entry of entries) {
    const full = path.join(entryPath, entry.name);
    if (entry.isDirectory()) {
      const nested = await walk(full);
      results.push(...nested);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(full);
    }
  }

  return results;
};

const readInputs = async () => {
  const files = [];
  for (const root of inputRoots) {
    if (root.endsWith(".md")) {
      files.push(root);
      continue;
    }
    const nested = await walk(root);
    files.push(...nested);
  }
  return files;
};

const stripFrontmatter = (raw) => {
  if (!raw.startsWith("---")) return { frontmatter: "", body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { frontmatter: "", body: raw };
  return {
    frontmatter: raw.slice(3, end).trim(),
    body: raw.slice(end + 4).trim(),
  };
};

const getFrontmatterValue = (frontmatter, key) => {
  const re = new RegExp(`^${key}:\\s*(.+)$`, "m");
  const match = frontmatter.match(re);
  return match ? match[1].trim() : "";
};

const normalize = (text) =>
  text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

const chunkText = (text, size = 900, overlap = 130) => {
  const chunks = [];
  const step = Math.max(size - overlap, 1);
  for (let start = 0; start < text.length; start += step) {
    const candidate = text.slice(start, Math.min(start + size, text.length)).trim();
    if (candidate.length >= 100) chunks.push(candidate);
  }
  return chunks;
};

const tokenize = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 2);

const routeHintFor = (relativePath) => {
  const normalized = relativePath.replace(/\\/g, "/");
  if (normalized.includes("/content/projects/")) {
    const slug = path.basename(normalized, ".md");
    return `/projects/${slug}`;
  }
  if (normalized.includes("/content/writing/")) {
    const slug = path.basename(normalized, ".md");
    return `/writing/${slug}`;
  }
  if (normalized.endsWith("/pages/now.md")) return "/now";
  return "/";
};

const embed = async (text) => {
  if (!openai) return undefined;
  const response = await openai.embeddings.create({
    model: embedModel,
    input: text,
  });
  return response.data[0]?.embedding;
};

const files = await readInputs();
const chunks = [];

for (const file of files) {
  const raw = await readFile(file, "utf8");
  const relativePath = path.relative(rootDir, file);
  const { frontmatter, body } = stripFrontmatter(raw);

  const title =
    getFrontmatterValue(frontmatter, "title") ||
    body.match(/^#\s+(.+)/m)?.[1]?.trim() ||
    path.basename(file, ".md");

  const normalized = normalize(body);
  const pieces = chunkText(normalized);

  for (let index = 0; index < pieces.length; index += 1) {
    const text = pieces[index];
    const id = `${relativePath.replace(/[^a-zA-Z0-9]+/g, "_")}_${String(index).padStart(3, "0")}`;
    const embedding = await embed(text);

    chunks.push({
      id,
      title,
      sourcePath: relativePath,
      routeHint: routeHintFor(relativePath),
      text,
      tokens: tokenize(text),
      embedding,
    });
  }
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  JSON.stringify(
    {
      version: 1,
      createdAt: new Date().toISOString(),
      chunks,
    },
    null,
    2
  ),
  "utf8"
);

console.log(`Wrote ${chunks.length} chunks to ${path.relative(rootDir, outputPath)}`);
