import "dotenv/config";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";
import OpenAI from "openai";

const rootDir = process.cwd();
const proofsDir = path.join(rootDir, "src", "proofs");
const outputDir = path.join(rootDir, "src", "rag");
const outputFile = path.join(outputDir, "index.json");

const embedModel = process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small";
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("OPENAI_API_KEY is required to build the RAG index.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

const normalizeText = (text) =>
  text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*?\]\([^)]*?\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[*-]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

const chunkText = (text, size = 1000, overlap = 160) => {
  const chunks = [];
  if (!text) return chunks;
  const step = Math.max(size - overlap, 1);
  for (let start = 0; start < text.length; start += step) {
    const chunk = text.slice(start, Math.min(start + size, text.length)).trim();
    if (chunk.length >= 120) {
      chunks.push(chunk);
    }
  }
  return chunks;
};

const toTitle = (value) =>
  value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();

const routeHintFor = (relativePath) => {
  const normalized = relativePath.replace(/\\/g, "/").toLowerCase();
  if (normalized.includes("/projects/fireside/")) return "/projects/fireside";
  if (normalized.includes("/projects/goodies/")) return "/projects/goodies";
  if (normalized.includes("/fit/")) return "/fit";
  if (normalized.includes("/system/")) return "/system";
  if (normalized.includes("/about/") || normalized.includes("/identity/")) return "/about";
  return "/system";
};

const extractTitle = (raw, relativePath) => {
  const match = raw.match(/^#\s+(.+)/m);
  if (match) return match[1].trim();
  const base = path.basename(relativePath, path.extname(relativePath));
  return toTitle(base);
};

const embed = async (text) => {
  const response = await openai.embeddings.create({
    model: embedModel,
    input: text,
  });
  return response.data[0].embedding;
};

const files = await glob("src/proofs/**/*.md", { cwd: rootDir, nodir: true });

if (!files.length) {
  console.warn("No proof files found under src/proofs.");
}

const chunks = [];

for (const file of files) {
  const absolutePath = path.join(rootDir, file);
  const raw = await readFile(absolutePath, "utf8");
  const title = extractTitle(raw, file);
  const cleaned = normalizeText(raw);
  const pieces = chunkText(cleaned);
  for (let index = 0; index < pieces.length; index += 1) {
    const text = pieces[index];
    const embedding = await embed(text);
    const idBase = file.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    const id = `${idBase}_${String(index).padStart(4, "0")}`;
    chunks.push({
      id,
      title,
      sourcePath: file,
      routeHint: routeHintFor(file),
      text,
      embedding,
    });
    console.log(`Embedded ${file} [${index + 1}/${pieces.length}]`);
  }
}

await mkdir(outputDir, { recursive: true });
await writeFile(
  outputFile,
  JSON.stringify({ version: 1, createdAt: new Date().toISOString(), chunks }, null, 2),
  "utf8"
);

console.log(`RAG index written to ${path.relative(rootDir, outputFile)} (${chunks.length} chunks)`);
