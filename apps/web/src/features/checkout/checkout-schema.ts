import { z } from 'zod'

export const paymentMethodSchema = z.literal('WHATSAPP')

export const checkoutSchema = z.object({
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  telephone: z.string().trim().regex(/^\+?[0-9\s-]{9,18}$/),
  city: z.string().trim().min(2).max(80),
  address: z.string().trim().min(8).max(240),
  deliveryNotes: z.string().trim().max(500).optional(),
  paymentMethod: paymentMethodSchema,
  acceptedTerms: z.literal(true),
})

export type CheckoutForm = z.infer<typeof checkoutSchema>
