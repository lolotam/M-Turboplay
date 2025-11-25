# Stripe Payment Integration Setup

## Overview
This project uses Stripe as the exclusive payment processor for the GrowAGarden e-commerce store. Stripe handles all payment methods including:
- **KNET** (Kuwait's local payment network)
- **Visa** and **MasterCard**
- **American Express**
- **Apple Pay** and **Google Pay**
- All other international card types

## Setup Instructions

### 1. Get Stripe API Keys
1. Create a Stripe account at https://stripe.com
2. Go to https://dashboard.stripe.com/apikeys
3. Copy your test keys:
   - Publishable key (starts with `pk_test_`)
   - Secret key (starts with `sk_test_`)

### 2. Configure Environment Variables

#### Frontend (.env)
Update the following in your `.env` file:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
VITE_API_URL=http://localhost:3001
VITE_SITE_URL=http://localhost:5555
```

#### Backend (server/.env)
Update the following in your `server/.env` file:
```env
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here  # Optional - for webhook validation
FRONTEND_URL=http://localhost:5555
CURRENCY=kwd
```

### 3. Start the Backend Server
```bash
cd server
npm install
npm start
```

The backend server will run on http://localhost:3001

### 4. Start the Frontend
In a new terminal:
```bash
npm install
npm run dev
```

The frontend runs on http://localhost:5555

## API Endpoints

### Create Payment Intent
**POST** `/api/create-payment-intent`
```json
{
  "amount": 1000,  // Amount in fils (1000 fils = 1 KWD)
  "currency": "kwd",
  "customerData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+96512345678"
  },
  "shippingData": {
    "address": "123 Main Street",
    "city": "Kuwait City",
    "area": "Salmiya",
    "country": "KW"
  },
  "items": [
    {
      "id": "1",
      "title": "Product Name",
      "quantity": 2,
      "price": 500
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### Confirm Payment
**POST** `/api/confirm-payment`
```json
{
  "paymentIntentId": "pi_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "status": "succeeded",
  "amount": 1000,
  "currency": "kwd",
  "metadata": {
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+96512345678"
  }
}
```

### Stripe Webhook (Optional)
**POST** `/api/stripe-webhook`
- Requires `stripe-signature` header
- Handles events: `payment_intent.succeeded`, `payment_intent.payment_failed`

## Testing the Payment Flow

### Test Card Numbers
Use these test card numbers from Stripe:

| Card Type | Number | CVC | Expiry |
|-----------|---------|-----|---------|
| Visa | 4242 4242 4242 4242 | Any 3 digits | Any future date |
| Visa (debit) | 4000 0566 5566 5556 | Any 3 digits | Any future date |
| Mastercard | 5555 5555 5555 4444 | Any 3 digits | Any future date |
| Mastercard (debit) | 5200 8282 8282 8210 | Any 3 digits | Any future date |
| American Express | 3782 822463 10005 | Any 4 digits | Any future date |

### Testing Different Scenarios

#### Successful Payment
Use card: `4242 4242 4242 4242`

#### Payment Requires Authentication (3DS)
Use card: `4000 0025 0000 3155`

#### Payment Declined
Use card: `4000 0000 0000 9995`

## Production Deployment

### 1. Get Production Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Toggle to "Live mode"
3. Copy your production keys:
   - Publishable key (starts with `pk_live_`)
   - Secret key (starts with `sk_live_`)

### 2. Update Environment Variables
Replace test keys with production keys in both frontend and backend `.env` files.

### 3. Configure Webhook Endpoint
1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe-webhook`
3. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the webhook signing secret
5. Update `STRIPE_WEBHOOK_SECRET` in server `.env`

### 4. Enable Payment Methods
1. Go to https://dashboard.stripe.com/settings/payment_methods
2. Enable desired payment methods:
   - Cards (enabled by default)
   - Apple Pay
   - Google Pay
   - KNET (for Kuwait)
   - Other regional payment methods

## Security Considerations

1. **Never expose your Secret Key** - Keep it only on the server
2. **Use HTTPS in production** - Required for PCI compliance
3. **Validate webhook signatures** - Prevent webhook spoofing
4. **Store minimal card data** - Let Stripe handle all sensitive data
5. **Use Stripe Elements or Payment Element** - For PCI compliance
6. **Enable 3D Secure** - For European cards and fraud prevention

## Currency Support

The system is configured for Kuwaiti Dinar (KWD). Note:
- 1 KWD = 1000 fils
- Always send amounts in the smallest currency unit (fils)
- Example: 5.250 KWD = 5250 fils

## Support & Documentation

- Stripe Documentation: https://stripe.com/docs
- Stripe API Reference: https://stripe.com/docs/api
- Test Card Numbers: https://stripe.com/docs/testing
- Stripe Dashboard: https://dashboard.stripe.com
- Support: https://support.stripe.com

## Migration Notes

This project has been fully migrated from Bookeey to Stripe. All payment methods previously handled by Bookeey (KNET, Visa, MasterCard, AMEX, etc.) are now processed through Stripe's unified payment gateway.