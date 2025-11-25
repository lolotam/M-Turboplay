# Email Notification System Setup Guide

## Overview

The GrowGarden e-commerce application includes a comprehensive email notification system that sends automated emails to administrators when important events occur, such as:

- New user registrations
- New orders placed
- Contact form submissions

The system uses EmailJS for client-side email sending, which allows the frontend application to send emails without requiring a backend server.

## Features

### 1. Automated Email Notifications
- **User Registration**: Sends email to admin when new users register
- **Order Notifications**: Sends email when new orders are placed
- **Contact Form**: Sends email when customers submit contact forms

### 2. Admin Configuration Interface
- Visual configuration status indicator
- EmailJS service configuration
- Notification type toggles
- Test email functionality

### 3. Bilingual Support
- All email templates support Arabic and English
- Admin interface available in both languages

## Setup Instructions

### Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Create a new email service (Gmail, Outlook, etc.)
4. Create an email template
5. Get your Service ID, Template ID, and Public Key

### Step 2: Configure Environment Variables

Update your `.env` file with the EmailJS credentials:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_your_service_id
VITE_EMAILJS_TEMPLATE_ID=template_your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### Step 3: EmailJS Template Setup

Create an email template in EmailJS with the following variables:

```
{{to_email}} - Recipient email address
{{to_name}} - Recipient name
{{from_name}} - Sender name (GrowGarden Store)
{{subject}} - Email subject
{{message}} - Email body content
{{user_name}} - User name (for registration emails)
{{user_email}} - User email (for registration emails)
{{registration_date}} - Registration date
{{site_name}} - Site name (GrowGarden Store)
```

### Step 4: Test Configuration

1. Navigate to Admin Settings → Email Notification Settings
2. Enter your EmailJS credentials
3. Click "Test Email" to verify configuration
4. Check your email inbox for the test message

## Email Templates

### User Registration Template
```
Subject: New User Registration - {{user_name}}

A new user has registered on GrowGarden Store.

User Details:
- Name: {{user_name}}
- Email: {{user_email}}
- Registration Date: {{registration_date}}

Please review the new user account in the admin dashboard.

Best regards,
GrowGarden Store System
```

### Order Notification Template
```
Subject: New Order Received - #{{order_id}}

A new order has been placed on GrowGarden Store.

Order Details:
- Order ID: #{{order_id}}
- Customer: {{customer_name}}
- Email: {{customer_email}}
- Total Amount: {{total_amount}}

Please review the order in the admin dashboard.

Best regards,
GrowGarden Store System
```

### Contact Form Template
```
Subject: Contact Form: {{subject}}

A new contact form submission has been received.

Contact Details:
- Name: {{name}}
- Email: {{email}}
- Subject: {{subject}}

Message:
{{message}}

Please respond to the customer inquiry.

Best regards,
GrowGarden Store System
```

## Technical Implementation

### Files Modified/Created

1. **src/services/emailService.ts** - Main email service class
2. **src/components/admin/EmailNotificationSettings.tsx** - Admin configuration interface
3. **src/components/auth/RegisterForm.tsx** - Updated to send registration emails
4. **src/pages/Contact.tsx** - Updated to send contact form emails
5. **src/pages/AdminSettings.tsx** - Added email settings section

### Key Functions

- `emailService.sendUserRegistrationNotification()` - Sends user registration emails
- `emailService.sendOrderNotification()` - Sends order notification emails
- `emailService.sendContactFormNotification()` - Sends contact form emails
- `emailService.testEmailConfiguration()` - Tests email configuration

### Error Handling

The system includes comprehensive error handling:
- Graceful fallback when EmailJS is not configured
- User-friendly error messages
- Console logging for debugging
- Non-blocking errors (registration/contact forms still work if email fails)

## Configuration Status

The admin interface shows real-time configuration status:
- ✅ **Configured**: EmailJS credentials are properly set
- ❌ **Not Configured**: Missing or invalid EmailJS credentials

## Security Considerations

- EmailJS public key is safe to expose in frontend code
- No sensitive email credentials are stored in the frontend
- All email sending is handled through EmailJS secure API
- Rate limiting is handled by EmailJS service

## Troubleshooting

### Common Issues

1. **Test email not received**
   - Check spam/junk folder
   - Verify EmailJS template variables
   - Ensure service is active in EmailJS dashboard

2. **Configuration not saving**
   - Check browser console for errors
   - Verify environment variables are loaded

3. **Emails not sending automatically**
   - Check browser console for API errors
   - Verify EmailJS service limits
   - Ensure public key is correct

### Debug Mode

Enable debug logging by checking browser console for:
- EmailJS API responses
- Configuration status messages
- Error details

## Future Enhancements

Potential improvements for the email system:
- Email templates customization in admin interface
- Email delivery status tracking
- Bulk email notifications
- Email scheduling
- Advanced email analytics

## Support

For technical support with the email notification system:
- Check EmailJS documentation: https://www.emailjs.com/docs/
- Review browser console for error messages
- Test configuration using the built-in test function
