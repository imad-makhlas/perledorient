import { checkoutSchema } from './checkout-schema'

describe('checkoutSchema', () => {
  it('accepts a complete Moroccan delivery request', () => {
    const result = checkoutSchema.safeParse({
      firstName: 'Sara',
      lastName: 'Amrani',
      telephone: '+212612345678',
      email: 'sara@example.com',
      city: 'Casablanca',
      address: '18 Rue Al Massira',
      postalCode: '20000',
      deliveryNotes: '',
      paymentMethod: 'WHATSAPP',
      acceptedTerms: true,
    })

    expect(result.success).toBe(true)
  })

  it('rejects online payment and missing consent', () => {
    const result = checkoutSchema.safeParse({
      firstName: 'Sara',
      lastName: 'Amrani',
      telephone: '+212612345678',
      city: 'Casablanca',
      address: '18 Rue Al Massira',
      paymentMethod: 'ONLINE_PAYMENT',
      acceptedTerms: false,
    })

    expect(result.success).toBe(false)
  })
})
