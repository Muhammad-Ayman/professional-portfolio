# Email Configuration with Resend

This project uses [Resend](https://resend.com/) for handling email functionality, including contact form submissions and newsletter subscriptions.

## Setup Instructions

### 1. Get Your Resend API Key

1. Sign up for a free account at [https://resend.com/](https://resend.com/)
2. Navigate to the API Keys section in your dashboard
3. Create a new API key
4. Copy the API key (it starts with `re_`)

### 2. Configure Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
# Resend Email Configuration
RESEND_API_KEY="re_your_api_key_here"

# Email addresses
CONTACT_EMAIL="your-email@example.com"
PROFILE_EMAIL="your-email@example.com"

# The "from" email address (must be verified in Resend)
FROM_EMAIL="noreply@yourdomain.com"
```

### 3. Verify Your Domain (Optional but Recommended)

For production use, you should verify your domain in Resend:

1. Go to your Resend dashboard
2. Navigate to Domains
3. Add your domain and follow the DNS configuration instructions
4. Once verified, use an email from your domain in `FROM_EMAIL`

For testing, you can use `onboarding@resend.dev` which is provided by Resend.

## Environment Variables Explained

### Required Variables

- **`RESEND_API_KEY`**: Your Resend API key (get it from [resend.com](https://resend.com/))
- **`CONTACT_EMAIL`** or **`PROFILE_EMAIL`**: Where contact form submissions and newsletter notifications will be sent

### Optional Variables

- **`FROM_EMAIL`**: The email address shown as the sender (defaults to `onboarding@resend.dev` for testing)

## Features

### Contact Form (`/contact`)

When a user submits the contact form:
1. Their message is sent to your `CONTACT_EMAIL`
2. The email includes their name, email, and message
3. You can reply directly to their email address
4. Success/error messages are displayed to the user

### Newsletter Subscription (`/insights`)

When a user subscribes to the newsletter:
1. You receive a notification at `CONTACT_EMAIL` with the subscriber's email
2. The subscriber receives a welcome confirmation email
3. Success/error messages are displayed to the user

## Testing

To test the email functionality in development:

1. Make sure your `.env` file has the `RESEND_API_KEY` set
2. Use `onboarding@resend.dev` as the `FROM_EMAIL` for testing
3. Submit the contact form or newsletter subscription
4. Check the Resend dashboard for delivery status
5. Check your `CONTACT_EMAIL` inbox for notifications

## API Endpoints

- **POST** `/api/email/contact` - Submit contact form
  - Body: `{ name: string, email: string, message: string }`
  
- **POST** `/api/email/newsletter` - Subscribe to newsletter
  - Body: `{ email: string }`

## Error Handling

Both forms include comprehensive error handling:
- Input validation
- Network error handling
- User-friendly error messages
- Loading states during submission

## Resend Free Tier

Resend's free tier includes:
- 3,000 emails per month
- 100 emails per day
- All features included

Perfect for portfolio websites and small projects!

## Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Dashboard](https://resend.com/overview)
- [Domain Verification Guide](https://resend.com/docs/dashboard/domains/introduction)

