import assert from 'node:assert/strict'
import test from 'node:test'
import { checkoutSchema } from './checkout-schema.ts'

const valid = {
  firstName: 'Sara', lastName: 'Amrani', telephone: '+212612345678', email: 'sara@example.com',
  city: 'Casablanca', address: '18 Rue Al Massira', postalCode: '20000', deliveryNotes: '',
  paymentMethod: 'WHATSAPP', acceptedTerms: true,
}

test('checkout accepts WhatsApp ordering only', () => {
  assert.equal(checkoutSchema.safeParse(valid).success, true)
  assert.equal(checkoutSchema.safeParse({ ...valid, paymentMethod: 'CASH_ON_DELIVERY' }).success, false)
})

test('checkout rejects online payment and missing consent', () => {
  assert.equal(checkoutSchema.safeParse({ ...valid, paymentMethod: 'ONLINE_PAYMENT' }).success, false)
  assert.equal(checkoutSchema.safeParse({ ...valid, acceptedTerms: false }).success, false)
})
