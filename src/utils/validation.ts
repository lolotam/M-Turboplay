import { z } from 'zod';

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject must be less than 100 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(500, 'Message must be less than 500 characters'),
});

// Login form validation schema
export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
});

// Registration form validation schema
export const registerFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password must be less than 100 characters'),
  confirmPassword: z.string(),
  phone: z.string().regex(/^\+?[0-9\s\-\(\)]+$/, 'Please enter a valid phone number').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Product validation schema
export const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  titleEn: z.string().min(3, 'English title must be at least 3 characters').max(100, 'English title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
  descriptionEn: z.string().min(10, 'English description must be at least 10 characters').max(1000, 'English description must be less than 1000 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0').max(9999.99, 'Price must be less than 10000'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  sku: z.string().min(3, 'SKU must be at least 3 characters').max(50, 'SKU must be less than 50 characters'),
  image: z.string().url('Please enter a valid image URL'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type ProductFormData = z.infer<typeof productSchema>;