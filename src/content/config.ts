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

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    heroBadge: z.string().optional(),
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    heroImage: z.string().optional(),
    heroCta1: z.string().optional(),
    heroCta2: z.string().optional(),
    brandLabel: z.string().optional(),
    brandHeading: z.string().optional(),
    brandDescription: z.string().optional(),
    brandImage: z.string().optional(),
    brandCta: z.string().optional(),
    stat1Value: z.string().optional(),
    stat1Label: z.string().optional(),
    stat2Value: z.string().optional(),
    stat2Label: z.string().optional(),
    stat3Value: z.string().optional(),
    stat3Label: z.string().optional(),
    pillarsTitle: z.string().optional(),
    pillar1Title: z.string().optional(),
    pillar1Desc: z.string().optional(),
    pillar1Link: z.string().optional(),
    pillar2Title: z.string().optional(),
    pillar2Desc: z.string().optional(),
    pillar2Link: z.string().optional(),
    pillar3Title: z.string().optional(),
    pillar3Desc: z.string().optional(),
    pillar3Link: z.string().optional(),
    productSectionTitle: z.string().optional(),
    productSectionLabel: z.string().optional(),
    innovationLabel: z.string().optional(),
    innovationTitle: z.string().optional(),
    innovationDesc: z.string().optional(),
    innovationImage: z.string().optional(),
    innovationFeature1: z.string().optional(),
    innovationFeature2: z.string().optional(),
    innovationFeature3: z.string().optional(),
    globalLabel: z.string().optional(),
    globalTitle: z.string().optional(),
    globalDesc: z.string().optional(),
    ctaBanner: z.string().optional(),
    ctaBannerDesc: z.string().optional(),
    ctaButton: z.string().optional(),
  }),
});

export const collections = { products, solutions, caseStudies, pages };
