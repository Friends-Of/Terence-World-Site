import type { CollectionEntry } from "astro:content";

export const sortByDateDesc = <T extends CollectionEntry<"projects"> | CollectionEntry<"writing">>(items: T[]) =>
  [...items].sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

export const uniqueRoleHats = (projects: CollectionEntry<"projects">[]) =>
  [...new Set(projects.flatMap((project) => project.data.roleHats))].sort((a, b) => a.localeCompare(b));

export const uniqueTags = (writing: CollectionEntry<"writing">[]) =>
  [...new Set(writing.flatMap((post) => post.data.tags))].sort((a, b) => a.localeCompare(b));

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
