import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const projectsDir = path.join(root, "src", "content", "projects");
const writingDir = path.join(root, "src", "content", "writing");

const readMarkdownFiles = async (dir) => {
  const files = await readdir(dir);
  const markdown = files.filter((name) => name.endsWith(".md"));
  return Promise.all(
    markdown.map(async (name) => ({
      slug: name.replace(/\.md$/, ""),
      raw: await readFile(path.join(dir, name), "utf8"),
    }))
  );
};

const parseYamlList = (frontmatter, key) => {
  const block = frontmatter.match(new RegExp(`${key}:([\\s\\S]*?)(?:\\n\\w+:|$)`));
  if (!block) return [];
  return block[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
};

const frontmatterFor = (raw) => {
  if (!raw.startsWith("---")) return "";
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return "";
  return raw.slice(3, end);
};

const projects = await readMarkdownFiles(projectsDir);
const writing = await readMarkdownFiles(writingDir);

const projectSlugs = new Set(projects.map((item) => item.slug));
const writingSlugs = new Set(writing.map((item) => item.slug));

const errors = [];

for (const project of projects) {
  const frontmatter = frontmatterFor(project.raw);
  const relatedWriting = parseYamlList(frontmatter, "relatedWriting");
  for (const slug of relatedWriting) {
    if (!writingSlugs.has(slug)) {
      errors.push(`Project ${project.slug} references missing writing slug: ${slug}`);
    }
  }
}

for (const post of writing) {
  const frontmatter = frontmatterFor(post.raw);
  const relatedProjects = parseYamlList(frontmatter, "relatedProjects");
  for (const slug of relatedProjects) {
    if (!projectSlugs.has(slug)) {
      errors.push(`Writing ${post.slug} references missing project slug: ${slug}`);
    }
  }
}

if (errors.length) {
  console.error("Link validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Link validation passed (${projects.length} projects, ${writing.length} writing notes).`);
