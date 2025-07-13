import z from 'zod';

export const createMessageDTO = z.object({
  chatRoom: z.string(),
  authorId: z.string(),
  text: z.string().trim().min(1),
});

export type CreateMessageDTO = z.infer<typeof createMessageDTO>;
