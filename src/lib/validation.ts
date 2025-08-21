import { z } from 'zod';
export const SubmitSchema = z.object({
  cancellationId: z.string().min(1),
  acceptDownsell: z.boolean(),
  reason: z.string().trim().min(1).max(500),
});
export type SubmitInput = z.infer<typeof SubmitSchema>;
