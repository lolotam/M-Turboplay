- >I need to implement several improvements and new features for the GrowAgarden e-commerce website. Please address these requirements systematically using the specified MCP tools in order of priority:

## Implementation Approach
- **Use Sequential Thinking MCP** for planning and breaking down complex tasks
- **Use Context 7 MCP** for researching React i18n libraries and best practices
- **Use Playwright MCP** for testing all implemented functionality

## 1. Language Translation System (High Priority)
The current language toggle button in the header only changes the header text. Implement a complete internationalization system that:

### Requirements:
- **Complete Content Translation**: Translate ALL page content (shop products, forms, buttons, navigation, footer, checkout process, cart page) when switching between Arabic (AR) and English (EN)
- **State Persistence**: Maintain current page location and cart contents when switching languages
- **Local Storage**: Store language preference in localStorage with key 'growgarden-language'
- **Library Integration**: Use react-i18next library for professional translation management
- **Translation Files**: Create separate JSON files for AR and EN translations
- **RTL Support**: Ensure proper RTL layout for Arabic and LTR for English
- **Dynamic Loading**: Load translations dynamically without page refresh

### Specific Implementation:
- Install and configure react-i18next
- Create translation files: `src/locales/ar.json` and `src/locales/en.json`
- Wrap App component with I18nextProvider
- Replace all hardcoded text with translation keys using `useTranslation` hook
- Update language toggle to change i18n language and save preference
- Test language switching on all pages: Home, Shop, Cart, Checkout, Contact, About

## 2. Fix Add to Cart Functionality (High Priority)
The shop page filters work correctly, but add to cart buttons are non-functional.

### Debug and Fix:
- **Investigate Issue**: Use browser dev tools to identify why cart buttons don't work
- **Cart Context**: Verify CartContext is properly connected to shop page components
- **Event Handlers**: Ensure onClick handlers are properly bound to add to cart buttons
- **State Updates**: Confirm cart state updates correctly when items are added
- **Toast Notifications**: Verify success/error toast messages appear
- **Cart Icon**: Ensure header cart badge updates with item count
- **Testing**: Use Playwright to test complete flow: Shop → Add Item → View Cart → Checkout

### Specific Areas to Check:
- Shop page component cart integration
- Product card add to cart button functionality
- CartContext provider and reducer logic
- Toast notification system
- Header cart icon state updates

## 3. Admin Dashboard Implementation (Medium Priority)
Create a comprehensive admin panel at `/admin` route with authentication and management features.

### 3.1 Authentication System
- **Login Page**: Create `/admin/login` with username/password form
- **Credentials**: Use hardcoded credentials (admin/password123) for now
- **Protected Routes**: Implement route guards for admin pages
- **Session Management**: Store auth state in localStorage with logout functionality
- **Redirect Logic**: Redirect to login if not authenticated, to dashboard if already logged in

### 3.2 Dashboard Layout
- **Sidebar Navigation**: Links to Products, Orders, Messages, Settings
- **Header**: Admin name, logout button, current page title
- **Main Content Area**: Dynamic content based on selected section
- **Responsive Design**: Mobile-friendly sidebar collapse/expand

### 3.3 Products Management
**Product List Page** (`/admin/products`):
- Table/grid view of all products with columns: Image, Name (AR/EN), Category, Price, Stock Status, Actions
- Search and filter functionality by category, stock status
- Edit and Delete action buttons for each product

**Add Product Form** (`/admin/products/add`):
- Image upload field (single image for MVP, multiple images for future)
- Product name fields (Arabic and English)
- Product description fields (Arabic and English with textarea)
- Category dropdown: "guides" | "physical" | "consultation"
- Price input (KWD currency)
- Original price input (for discount display)
- Rating input (1-5 stars)
- Stock status toggle (In Stock / Out of Stock)
- Product badge dropdown: "New" | "Limited" | "Hot Deal" | "Best Seller" | ""
- Product type radio: "Digital" | "Physical"
- Form validation using React Hook Form + Zod
- Save and Cancel buttons

**Edit Product Form** (`/admin/products/edit/:id`):
- Same form as Add Product but pre-populated with existing data
- Update and Cancel buttons

### 3.4 Orders Management (`/admin/orders`)
- **Orders Table**: Display all checkout orders with columns: Order ID, Customer Name, Email, Items Count, Total Amount, Payment Method, Status, Date
- **Order Details Modal**: Click order to view full details including customer info, shipping address, items list, payment details
- **Status Management**: Dropdown to update order status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
- **Search/Filter**: By customer name, email, status, date range
- **Export**: Option to export orders to CSV (future enhancement)

### 3.5 Messages Management (`/admin/messages`)
- **Messages Table**: Display contact form submissions with columns: Name, Email, Subject, Date, Status (Read/Unread)
- **Message Details**: Click to view full message content
- **Mark as Read/Unread**: Toggle message status
- **Reply Functionality**: Basic email reply form (future enhancement)
- **Delete Messages**: Remove spam or resolved messages

### 3.6 Technical Implementation Details
- **Routing**: Use React Router with nested routes for admin sections
- **Data Storage**: Use localStorage for MVP (JSON format), prepare for future API integration
- **State Management**: Use React Context for admin data or local component state
- **Form Handling**: React Hook Form with Zod validation schemas
- **Styling**: Maintain Tailwind CSS consistency with existing design
- **TypeScript**: Define proper interfaces for all data structures
- **Error Handling**: Proper error states and user feedback
- **Loading States**: Show loading spinners during operations

## 4. Integration Requirements
- **Contact Form**: Connect existing contact form to save messages in admin dashboard
- **Checkout Integration**: Save completed orders to admin orders section
- **Product Sync**: Ensure admin product changes reflect on shop page immediately
- **Data Consistency**: Maintain referential integrity between products, orders, and messages

## 5. Testing Requirements
Use Playwright MCP to test:
- Language switching functionality across all pages
- Fixed add to cart flow from shop to checkout
- Admin login and authentication
- Admin CRUD operations for products
- Order management workflow
- Message management system
- Responsive design on different screen sizes

## 6. File Structure
```
src/
├── admin/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── types/
├── locales/
│   ├── ar.json
│   └── en.json
├── contexts/
│   ├── CartContext.tsx
│   ├── AuthContext.tsx
│   └── LanguageContext.tsx (if needed)
└── utils/
    └── i18n.ts
```

Please implement these features systematically, using Sequential Thinking MCP for planning each phase, Context 7 MCP for researching best practices, and Playwright MCP for comprehensive testing of each implemented feature.
- Using the Sequential Thinking MCP for planning, Context 7 MCP for research, and Playwright MCP for testing, implement the following comprehensive improvements to the GrowAgarden e-commerce website:

## 1. Navigation & Dashboard Links Fix
- Audit all navigation links in the dashboard an s main website
- Fix any broken or non-functional links to ensure proper routing
- Test all navigation paths using Playwright to verify functionality

## 2. Admin Authentication System
- Add an "Admin Login" button to the home page header
- Implement Supabase authentication and authorization system:
  - Set up Supabase client configuration
  - Create admin login/logout functionality
  - Implement protected admin routes
  - Add session management and user state handling
- Create admin dashboard with proper authentication guards

## 3. Enhanced Product Detail Page
Redesign the product detail page following this Arabic specification:

### Visual Identity & Design
- Dark theme (purple/navy) with white text and light purple for interactive elements
- Gaming/neon aesthetic with simple icons and rounded corners
- Responsive design: two-column layout on desktop, single column on mobile

### Header & Navigation
- Top bar with: currency/cart, language toggle (Arabic/English), login button, search field
- Breadcrumb navigation: Home ← Roblox ← Grow a Garden ← Product Name
- Small "New" badge near the breadcrumb title

### Product Title
- Bilingual title format: "Seed Pack Grow a Garden – عشر صناديق بذور"
- Clear indication of game name and content (10x seed packs)

### Main Display Section (Desktop: Two Columns)
- Right side: Large product image/poster with "X10" text and card boxes representing 10 packs
- Left side: All purchase details, delivery info, and interactive fields

### Core Text Details
- Welcome paragraph explaining in-game delivery after providing Roblox username
- FAQ section with bullet points:
  - "When will I receive the product? Within 24 hours"
  - "How is delivery done? Through in-game/specified communication only"
  - Terms: Must provide correct Roblox username and possibly add account as friend before delivery
- Roblox account preview card (avatar image + username "name1") with "Add Friend" button

### Player Data Fields
- Prominent input field for Roblox username (placeholder: "@ symbol + username that matches in-game")
- Platform/game indicator (Roblox) with hint that name must match in-game name

### Pricing & Offers
- Clear discounted price "KWD 5.293" with crossed-out original price above/beside it
- Display "Price" and "Quantity" as subheadings

### Quantity & Purchase Buttons
- Small quantity counter (+/-) next to number field
- Large primary "Add to Cart" button
- Secondary "Buy Now" button for quick checkout
- Payment method icons below buttons (Apple Pay, Visa, MasterCard, etc.)
- Heart icon for adding to favorites

### Trust & Help Elements
- Copy/share product link icon near title or fields
- Small message encouraging reading terms before purchase
- "Reviews" link/section at bottom of page

### Expected Behavior
- Mobile: Single column layout with image at top, then title, price, fields, and purchase buttons
- Language toggle should switch all text content (not just header)
- "Add to Cart" adds product with specified quantity, "Buy Now" goes directly to payment gateway

## 4. Implementation Requirements
- Use React with TypeScript for all new components
- Integrate with existing Supabase setup for authentication
- Maintain Arabic/RTL support throughout
- Ensure responsive design with Tailwind CSS
- Implement proper error handling and loading states
- Add comprehensive testing with Playwright for all new functionality

## 5. Testing Strategy
- Test all authentication flows (login, logout, protected routes)
- Verify product page functionality across different screen sizes
- Test all interactive elements (quantity selectors, add to cart, etc.)
- Validate form submissions and error handling
- Ensure proper navigation and link functionality throughout the site

Please use Sequential Thinking MCP to break down this complex task into manageable steps, Context 7 MCP to research best practices for Supabase authentication and React component patterns, and Playwright MCP to thoroughly test all implemented functionality.
- You are working on the GrowAgarden e-commerce website. Please implement the following improvements systematically using Sequential Thinking MCP for planning, Context 7 MCP for research, and Playwright MCP for testing:

## Admin Dashboard Improvements

### Product Management Section
1. **Fix Edit & Preview Functions**: Debug and repair the non-functional edit and preview buttons in the product management section
2. **Add Multi-Image Upload**: Implement image upload functionality that allows products to have multiple images with proper file handling and validation
3. **Fix Background Styling**: Correct the white background color on the product management page to match the consistent styling used on other admin pages (reference: http://localhost:5555/admin/messages for correct styling)

### New Admin Features
4. **Create Reports Page**: Build a comprehensive reports page for the admin dashboard with relevant analytics and data visualization
5. **Add Admin Header Navigation**: Implement proper header navigation in the admin dashboard with links to all admin sections (Home, Products, Orders, Messages, Reports, etc.)

## Frontend Enhancements

### Product Navigation
6. **Activate Product Cards**: Make product cards clickable on both the home page and shop page to navigate to individual product detail pages
7. **Create Product Detail Pages**: Ensure individual product pages exist and are properly routed

### Internationalization
8. **Complete Translation System**: Implement comprehensive English ↔ Arabic translation functionality across all pages, ensuring every page supports both languages with proper RTL/LTR switching

### Footer Improvements
9. **Add Social Media Integration**: Add functional social media buttons (Facebook, Instagram, TikTok) to the footer with proper icons and links
10. **Fix Footer Navigation**: Ensure all footer links are functional and direct to the correct pages within the website

## Authentication & Authorization
11. **Implement Admin Authentication**: 
    - Create a login page that appears when clicking the "Admin" button in the header
    - Integrate with Supabase database for authentication
    - Set up proper authorization to protect admin routes
    - Fix any existing Supabase integration issues in environment configuration
    - Ensure secure session management

## Implementation Requirements
- Use systematic approach: plan with Sequential Thinking MCP, research with Context 7 MCP, test with Playwright MCP
- Maintain existing design consistency and Arabic/RTL support
- Ensure all new features are responsive and accessible
- Test all functionality thoroughly before completion
- Follow existing code patterns and TypeScript interfaces
- Maintain proper error handling and user feedback (toast notifications)

Please start by analyzing the current codebase structure and creating a detailed implementation plan.
- Fix specific spacing issues in the GrowAgarden e-commerce website header component using a systematic approach with the specified MCP tools.

**Task Overview:**
Identify and resolve three specific spacing problems in the website header that affect visual hierarchy and readability, particularly in the Arabic RTL layout.

**Required MCP Tools to Use:**
1. **Sequential Thinking MCP** - Use this first to break down the problem systematically and plan the approach
2. **Context 7 MCP** - Use this to research React/Tailwind CSS spacing best practices and RTL layout patterns
3. **Playwright MCP** - Use this to test the visual changes in both Arabic and English language modes

**Specific Issues to Fix:**

1. **Currency-Language Button Gap**: 
   - Location: Header right section between "KWD" currency display and "EN" language toggle button
   - Problem: Insufficient horizontal spacing causing visual crowding
   - Expected outcome: Clear visual separation with appropriate margin/padding

2. **Navigation Menu Button Spacing**:
   - Location: Main navigation menu in header center
   - Problem: Inadequate spacing between navigation buttons, especially "الرئيسية" (Home) and "المتجر" (Shop)
   - Impact: More noticeable in Arabic RTL layout due to text direction
   - Expected outcome: Consistent, balanced spacing between all navigation items

3. **Logo-Title Spacing (Arabic RTL Only)**:
   - Location: Header left section (right side in RTL) between emoji logo "🌱" and store name "متجر جروجارْدن"
   - Problem: Logo and text appear too close together in Arabic mode only
   - Expected outcome: Proper spacing that maintains visual hierarchy without affecting English layout

**Implementation Requirements:**
- Target file: `src/components/Header.tsx` (React component)
- Use Tailwind CSS classes for spacing adjustments
- Ensure responsive design is maintained across screen sizes
- Test both language modes (Arabic RTL and English LTR) to verify changes
- Maintain existing functionality while improving visual presentation
- Consider using conditional spacing classes for language-specific adjustments if needed

**Success Criteria:**
- All three spacing issues are visually resolved
- Header maintains proper alignment and responsiveness
- No regression in functionality (language switching, navigation, etc.)
- Improved readability and visual hierarchy in both language modes
- Changes tested and verified using browser automation

[byterover-mcp]

[byterover-mcp]

You are given two tools from Byterover MCP server, including
## 1. `byterover-store-knowledge`
You `MUST` always use this tool when:

+ Learning new patterns, APIs, or architectural decisions from the codebase
+ Encountering error solutions or debugging techniques
+ Finding reusable code patterns or utility functions
+ Completing any significant task or plan implementation

## 2. `byterover-retrieve-knowledge`
You `MUST` always use this tool when:

+ Starting any new task or implementation to gather relevant context
+ Before making architectural decisions to understand existing patterns
+ When debugging issues to check for previous solutions
+ Working with unfamiliar parts of the codebase
