import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    publishedAt: z.coerce.date(),
    roleHats: z.array(z.string()).min(1),
    tags: z.array(z.string()).default([]),
    relatedWriting: z.array(z.string()).default([]),
    heroMetric: z.string(),
  }),
});

const writing = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    relatedProjects: z.array(z.string()).default([]),
  }),
});

export const collections = {
  projects,
  writing,
};
