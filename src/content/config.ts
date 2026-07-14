import { defineCollection, z } from 'astro:content';

const nullableString = () => z.string().optional().catch('');
const nullableStrings = () => z.array(z.string()).optional().catch([]);

const products = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    model: z.string().optional(),
    category: z.enum(['forming', 'filling', 'cleaning', 'automation', 'cnc', 'safety']),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    heroImage: nullableString(),
    images: nullableStrings(),
    specs: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional().catch([]),
    features: z.array(z.string()).optional().catch([]),
    published: z.boolean().default(true),
  }),
});

const solutions = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    industry: z.array(z.string()).optional().catch([]),
    heroImage: nullableString(),
    overview: nullableString(),
    highlights: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional().catch([]),
    specs: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional().catch([]),
    published: z.boolean().default(true),
  }),
});

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: nullableString(),
    industry: nullableString(),
    location: nullableString(),
    date: nullableString(),
    heroImage: nullableString(),
    summary: nullableString(),
    challenge: nullableString(),
    solution: nullableString(),
    results: z.array(z.object({
      metric: z.string(),
      value: z.string(),
    })).optional().catch([]),
    images: nullableStrings(),
    published: z.boolean().default(true),
  }),
});

export const collections = { products, solutions, caseStudies };
