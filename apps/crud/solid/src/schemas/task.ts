import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  status: z.enum(['pending', 'in-progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  categoryId: z.coerce.number().min(1, 'Category is required'),
})

export type TaskFormData = z.infer<typeof taskSchema>
