import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('Agora Team'),
    date: z.string(),
    image: z.string().optional(),
    thumbnail: z.string(),
  }),
});

export const collections = {
  blog,
};
