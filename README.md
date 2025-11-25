# M-TurboPlay 🎮✨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.5.3-blue.svg)](https://www.typescriptlang.org/)

**M-TurboPlay** is a modern, full-stack e-commerce platform designed for gaming enthusiasts. Shop for digital gaming products, Roblox items, and gaming accessories with a beautiful, responsive interface featuring the latest **Neo-Space-Dashboard** theme.

## 🌟 Features

### 🎨 Modern UI/UX
- **Neo-Space-Dashboard Theme** - Stunning pink (#F72585) and cyan (#4CC9F0) accents on deep space backgrounds
- Built with React 18 and TypeScript for type safety
- Tailwind CSS with custom Poppins typography
- Shadcn/ui components for consistent styling
- Fully responsive design (mobile, tablet, desktop)
- Dark theme optimized for gaming

### 🛒 E-commerce Platform
- Modern shopping cart with persistent storage
- Advanced product catalog with filtering and search
- Secure checkout process
- Order tracking and history
- Wishlist functionality

### 🌍 Multi-language Support
- Full Arabic and English language support
- Right-to-Left (RTL) layout for Arabic with Cairo font
- Left-to-Right (LTR) layout for English with Poppins font
- Dynamic language switching
- Persistent language preferences

### 💳 Payment Integration
- **Stripe-powered payments** supporting:
  - KNET (Kuwait's local payment network)
  - Visa, MasterCard, American Express
  - Apple Pay, Google Pay
- Secure PCI-compliant payment processing
- 3D Secure authentication support

### 🔐 Admin Dashboard
- Comprehensive product management
- Order tracking and management
- Customer message handling
- User management system
- Inventory control
- Analytics dashboard

## 🚀 Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript 5.5.3
- **Build Tool**: Vite 5.4.19
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Shadcn/ui
- **State Management**: React Context API + TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM 6.28.0
- **Icons**: Lucide React
- **Fonts**: Poppins (English), Cairo/Tajawal (Arabic)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Payment Processing**: Stripe SDK

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx with SSL termination
- **SSL Certificates**: Let's Encrypt
- **Domain**: m-turboplay.com

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js**: Version 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **Supabase Account**: For backend services ([Sign up](https://supabase.com))
- **Stripe Account**: For payment processing ([Sign up](https://stripe.com))

## 🛠 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/lolotam/M-Turboplay.git
cd M-Turboplay
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_URL=https://your-project.supabase.co

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# API Configuration
VITE_API_URL=http://localhost:3001
VITE_SITE_URL=http://localhost:5555

# Admin Configuration
VITE_ADMIN_EMAIL=admin@m-turboplay.com

# EmailJS Configuration (Optional - for contact forms)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 4. Database Setup (Supabase)

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the database schema located in `supabase_schema.sql`
4. Set up authentication providers in Supabase dashboard
5. Configure row-level security policies
6. Copy your project URL and anon key to `.env`

#### Database Schema

The application uses the following main tables:
- `products` - Product catalog
- `orders` - Order management
- `users` - User profiles
- `cart_items` - Shopping cart
- `categories` - Product categories

Run the SQL files in this order:
```bash
# Main schema
supabase_schema.sql

# Add missing columns (if needed)
supabase_migration_add_missing_columns.sql

# Add products (optional - sample data)
add_playstation_products.sql
add_xbox_products.sql
add_nintendo_products.sql
add_pc_games_products.sql
add_mobile_games_products.sql
```

### 5. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard (Developers > API keys)
3. For production, configure webhook endpoints:
   - Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
   - Events to listen for: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Enable payment methods in Dashboard > Settings > Payment methods:
   - KNET (for Kuwait)
   - Cards (Visa, MasterCard, Amex)
   - Apple Pay / Google Pay

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

The application will run on `http://localhost:5555`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing & Quality

### Lint Code
```bash
npm run lint
```

### Type Check
```bash
npx tsc --noEmit
```

## 🐳 Docker Deployment

### Production Deployment with Docker Compose

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

The production setup includes:
- Frontend container (React/Vite)
- Nginx reverse proxy with SSL
- Automatic HTTPS with Let's Encrypt

## 📦 Dependencies

### Core Dependencies
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `react-router-dom`: ^6.28.0
- `typescript`: ^5.5.3
- `vite`: ^5.4.19

### UI & Styling
- `tailwindcss`: ^3.4.1
- `@radix-ui/*`: Various Radix UI primitives
- `class-variance-authority`: ^0.7.1
- `clsx`: ^2.1.1
- `lucide-react`: ^0.469.0

### State & Data Management
- `@tanstack/react-query`: ^5.64.2
- `react-hook-form`: ^7.54.2
- `zod`: ^3.23.8

### Payment & Backend
- `@stripe/stripe-js`: ^5.2.0
- `@supabase/supabase-js`: ^2.48.2

### Internationalization
- `react-i18next`: ^15.2.0
- `i18next`: ^24.1.0

### Utilities
- `date-fns`: ^4.1.0
- `sonner`: ^1.7.4 (for toast notifications)
-`recharts`: ^2.15.0 (for analytics charts)

See `package.json` for complete list with exact versions.

## 🌐 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes | `https://xxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | Yes | `eyJhbGc...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes | `pk_test_xxx` |
| `VITE_SITE_URL` | Frontend URL | Yes | `http://localhost:5555` |
| `VITE_ADMIN_EMAIL` | Admin email address | Yes | `admin@example.com` |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID | No | `service_xxx` |

## 🔒 Security Features

- **PCI DSS Compliance**: Stripe handles all sensitive payment data
- **SSL/TLS Encryption**: All communications encrypted in production
- **Input Validation**: Comprehensive sanitization with Zod
- **Authentication**: Secure user auth with Supabase
- **Row-Level Security**: Database-level access control
- **CORS Protection**: Configured CORS policies

## 📱 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Theme Customization

The application uses a custom "Neo-Space-Dashboard" theme with the following color palette:

| Color | Hex | Usage |
|-------|-----|-------|
| Hot Pink | `#F72585` | Primary CTAs, links, buttons |
| Cyan | `#4CC9F0` | Secondary actions, highlights |
| Deep Purple | `#7209B7` | Accent elements |
| Deep Space | `#0B032D` | Main background |
| Card Purple | `#1F0F57` | Card backgrounds |
| White | `#FFFFFF` | Primary text |

Theme can be customized in `src/index.css` and `tailwind.config.ts`.

## 🚀 Deployment Guide

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions including:
- VPS setup and configuration
- Docker deployment
- Nginx configuration
- SSL certificate setup
- Domain configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- **Email**: support@m-turboplay.com
- **Issues**: [GitHub Issues](https://github.com/lolotam/M-Turboplay/issues)

## 🔄 Version History

### v3.0.0 (Current) - Neo-Space Theme
- ✨ **NEW**: Neo-Space-Dashboard theme with pink/cyan color scheme
- 🎨 Typography upgrade to Poppins font (English) with Arabic font preservation
- 🎯 Enhanced UI components with modern gradients and glows
- 📱 Improved responsive design across all breakpoints
- 🐛 Fixed product detail page cart functionality

### v2.0.0 - Stripe Migration
- ✅ Complete migration to Stripe payment gateway
- ✅ Enhanced admin dashboard
- ✅ Improved multi-language support
- ✅ Modern UI/UX with Tailwind CSS

### v1.0.0 - Initial Release
- Basic e-commerce functionality
- Multi-language support
- Basic admin dashboard

## 🌟 Acknowledgments

- **React Team** for the amazing framework
- **Stripe** for secure payment processing
- **Supabase** for backend-as-a-service
- **Tailwind CSS** for the utility-first CSS framework
- **Shadcn** for beautiful UI components
- **Vercel** for development tools

---

**Built with ❤️ for the gaming community**

*M-TurboPlay - Where Gaming Dreams Come True* 🎮✨