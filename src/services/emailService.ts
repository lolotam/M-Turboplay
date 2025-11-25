import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_growgarden';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_user_registration';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key_here';

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'your_public_key_here') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface EmailNotificationData {
  to_email: string;
  to_name: string;
  from_name: string;
  subject: string;
  message: string;
  user_name?: string;
  user_email?: string;
  registration_date?: string;
  site_name?: string;
}

export interface UserRegistrationEmailData {
  userName: string;
  userEmail: string;
  registrationDate: string;
  adminEmail: string;
}

class EmailService {
  private isConfigured(): boolean {
    return !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'your_public_key_here');
  }

  /**
   * Send email notification to admin when new user registers
   */
  async sendUserRegistrationNotification(data: UserRegistrationEmailData): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('EmailJS not configured. Email notification skipped.');
      return false;
    }

    try {
      const templateParams: EmailNotificationData = {
        to_email: data.adminEmail,
        to_name: 'Store Administrator',
        from_name: 'GrowGarden Store',
        subject: `New User Registration - ${data.userName}`,
        message: `A new user has registered on GrowGarden Store.

User Details:
- Name: ${data.userName}
- Email: ${data.userEmail}
- Registration Date: ${data.registrationDate}

Please review the new user account in the admin dashboard.

Best regards,
GrowGarden Store System`,
        user_name: data.userName,
        user_email: data.userEmail,
        registration_date: data.registrationDate,
        site_name: 'GrowGarden Store'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('Email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send custom email notification
   */
  async sendCustomNotification(data: EmailNotificationData): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('EmailJS not configured. Email notification skipped.');
      return false;
    }

    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        data
      );

      console.log('Custom email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to send custom email:', error);
      return false;
    }
  }

  /**
   * Send order notification to admin
   */
  async sendOrderNotification(orderData: {
    orderId: string;
    customerName: string;
    customerEmail: string;
    totalAmount: string;
    adminEmail: string;
  }): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('EmailJS not configured. Email notification skipped.');
      return false;
    }

    try {
      const templateParams: EmailNotificationData = {
        to_email: orderData.adminEmail,
        to_name: 'Store Administrator',
        from_name: 'GrowGarden Store',
        subject: `New Order Received - #${orderData.orderId}`,
        message: `A new order has been placed on GrowGarden Store.

Order Details:
- Order ID: #${orderData.orderId}
- Customer: ${orderData.customerName}
- Email: ${orderData.customerEmail}
- Total Amount: ${orderData.totalAmount}

Please review the order in the admin dashboard.

Best regards,
GrowGarden Store System`,
        site_name: 'GrowGarden Store'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('Order notification sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to send order notification:', error);
      return false;
    }
  }

  /**
   * Send contact form notification to admin
   */
  async sendContactFormNotification(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    adminEmail: string;
  }): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('EmailJS not configured. Email notification skipped.');
      return false;
    }

    try {
      const templateParams: EmailNotificationData = {
        to_email: contactData.adminEmail,
        to_name: 'Store Administrator',
        from_name: 'GrowGarden Store',
        subject: `Contact Form: ${contactData.subject}`,
        message: `A new contact form submission has been received.

Contact Details:
- Name: ${contactData.name}
- Email: ${contactData.email}
- Subject: ${contactData.subject}

Message:
${contactData.message}

Please respond to the customer inquiry.

Best regards,
GrowGarden Store System`,
        site_name: 'GrowGarden Store'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('Contact form notification sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to send contact form notification:', error);
      return false;
    }
  }

  /**
   * Test email configuration
   */
  async testEmailConfiguration(): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('EmailJS not configured. Cannot test email.');
      return false;
    }

    try {
      const testData: EmailNotificationData = {
        to_email: 'mwaleedtam2016@gmail.com',
        to_name: 'Store Administrator',
        from_name: 'GrowGarden Store',
        subject: 'Email Configuration Test',
        message: 'This is a test email to verify that the email notification system is working correctly.',
        site_name: 'GrowGarden Store'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        testData
      );

      console.log('Test email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to send test email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
export default emailService;
