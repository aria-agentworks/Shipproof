import crypto from 'crypto'
import Razorpay from 'razorpay'

// Pricing plans in multiple currencies
export const PLANS = {
  free: {
    name: 'Free',
    price: { INR: 0, USD: 0, EUR: 0 },
    videosPerMonth: 5,
    emailsPerDay: 3,
    features: [
      '5 packing videos/month',
      '3 emails per day',
      'Basic dashboard',
      'Buyer verification link',
    ],
    limit: 5,
  },
  pro: {
    name: 'Pro',
    price: { INR: 49900, USD: 999, EUR: 999 }, // in paise/smallest unit
    videosPerMonth: 200,
    emailsPerDay: 50,
    features: [
      '200 packing videos/month',
      '50 emails per day',
      'Full dashboard & analytics',
      'Buyer verification link',
      'Priority support',
    ],
    limit: 200,
  },
  business: {
    name: 'Business',
    price: { INR: 149900, USD: 2999, EUR: 2999 },
    videosPerMonth: -1, // unlimited
    emailsPerDay: -1,
    features: [
      'Unlimited packing videos',
      'Unlimited emails',
      'Full dashboard & analytics',
      'Multi-seller support',
      'Custom branding',
      'API access',
      'Priority support',
    ],
    limit: -1,
  },
} as const

export type PlanKey = keyof typeof PLANS
export type Currency = 'INR' | 'USD' | 'EUR'

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
}

export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency]
}

export function formatPrice(amount: number, currency: Currency): string {
  if (currency === 'INR') return `${CURRENCY_SYMBOLS[currency]}${(amount / 100).toLocaleString('en-IN')}`
  return `${CURRENCY_SYMBOLS[currency]}${(amount / 100).toFixed(2)}`
}

// Detect currency from browser locale
export function detectCurrency(locale: string = typeof navigator !== 'undefined' ? navigator.language : 'en-US'): Currency {
  const lang = locale.toLowerCase()
  if (lang.startsWith('en-in') || lang === 'hi' || lang.startsWith('ta') || lang.startsWith('te') || lang.startsWith('bn') || lang.startsWith('mr') || lang.startsWith('gu')) return 'INR'
  // Most of Europe uses EUR
  const euroLocales = ['de', 'fr', 'es', 'it', 'nl', 'be', 'at', 'pt', 'pl', 'fi', 'gr', 'sv']
  for (const loc of euroLocales) {
    if (lang.startsWith(loc)) return 'EUR'
  }
  return 'USD'
}

// Get Razorpay instance
function getRazorpayInstance(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) return null
  return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

// Create a Razorpay order
export async function createOrder(planKey: PlanKey, currency: Currency): Promise<{ orderId: string; amount: number; currency: string } | null> {
  const instance = getRazorpayInstance()
  if (!instance) return null

  const plan = PLANS[planKey]
  const amount = plan.price[currency]
  if (amount === 0) return null

  const order = await instance.orders.create({
    amount,
    currency,
    receipt: `shipproof_${planKey}_${Date.now()}`,
    notes: {
      plan: planKey,
      type: 'subscription',
    },
  })

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  }
}

// Verify payment signature
export function verifyPayment(params: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) return false

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${params.razorpay_order_id}|${params.razorpay_payment_id}`)
    .digest('hex')

  return expectedSignature === params.razorpay_signature
}
