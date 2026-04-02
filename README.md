# LUXE — AI-Powered E-Commerce Frontend

A production-ready React frontend for an AI-powered e-commerce and rental platform.

---

## Tech Stack

- **React 18** + **Vite** (lightning-fast dev server)
- **TailwindCSS 3** (utility-first styling)
- **React Router v6** (client-side routing with protected routes)
- **Axios** (API calls with interceptors)
- **Context API** (Auth, Cart, Wishlist state)
- **Recharts** (admin analytics charts)
- **react-hot-toast** (notifications)
- **lucide-react** (icons)
- **date-fns** (date formatting)

---

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/         # Navbar, Footer, Layout
│   │   ├── shop/           # ProductCard, CartComponent, WishlistComponent
│   │   ├── rental/         # RentalCard
│   │   ├── chat/           # AIChatUI
│   │   ├── admin/          # AdminAnalyticsPanel
│   │   └── common/         # Skeletons, ErrorUI, LoadingScreen
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── WishlistContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   ├── Rent.jsx
│   │   ├── AIChat.jsx
│   │   ├── Premium.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── CartPage.jsx
│   │   ├── WishlistPage.jsx
│   │   └── Checkout.jsx
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── services/
│   │   ├── api.js           # Axios base config
│   │   ├── authAPI.js
│   │   ├── productAPI.js
│   │   └── index.js         # rentalAPI, aiAPI, paymentAPI, orderAPI, adminAPI
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── vercel.json
```

---

## Quick Start

### 1. Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### 2. Clone / Extract

```bash
cd frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=LUXE
```

### 5. Run Development Server

```bash
npm run dev
```

Open: **http://localhost:5173**

### 6. Build for Production

```bash
npm run build
```

### 7. Preview Production Build

```bash
npm run preview
```

---

## Demo Accounts

On the Login page, click the demo buttons or use:

| Role  | Email             | Password  |
|-------|-------------------|-----------|
| User  | demo@luxe.com     | demo123   |
| Admin | admin@luxe.com    | admin123  |

> Note: Demo mode works without a backend — all API calls fall back to mock data.

---

## Backend API

This frontend expects a Node.js + Express backend at `VITE_API_BASE_URL`.

### Required API Endpoints

#### Auth
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET  /api/auth/me`

#### Products
- `GET  /api/products`         — `?category=&sort=&search=`
- `GET  /api/products/:id`
- `GET  /api/products/featured`

#### Rentals
- `GET  /api/rentals/available`
- `POST /api/rentals`
- `GET  /api/rentals/my`

#### AI
- `POST /api/ai/chat`          — `{ messages: [{role, content}] }`

#### Orders
- `POST /api/orders`
- `GET  /api/orders/my`

#### Payments
- `POST /api/payments/premium`

#### Admin (admin role required)
- `GET  /api/admin/dashboard`
- `GET  /api/admin/users`
- `GET  /api/admin/inventory`

### Expected Response Format

```json
{
  "success": true,
  "data": { ... }
}
```

Auth endpoints return:
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "role": "user|admin",
    "isPremium": false,
    "loyaltyPoints": 0
  }
}
```

---

## Features

### Pages
| Page              | Route             | Protected |
|-------------------|-------------------|-----------|
| Home              | `/`               | No        |
| Shop              | `/shop`           | No        |
| Product Details   | `/products/:id`   | No        |
| Rent              | `/rent`           | No        |
| AI Chat           | `/ai-chat`        | No*       |
| Premium           | `/premium`        | No        |
| Login             | `/login`          | No        |
| Register          | `/register`       | No        |
| Cart              | `/cart`           | No        |
| Wishlist          | `/wishlist`       | No        |
| Checkout          | `/checkout`       | Yes       |
| User Dashboard    | `/dashboard/*`    | Yes       |
| Admin Dashboard   | `/admin/*`        | Admin     |

*AI Chat requires login to send messages

### Key Features
- ✅ Product listing with search, filter, sort
- ✅ Rental system with duration picker and fee calculator
- ✅ AI Chat UI with typing indicator and suggestions
- ✅ Premium subscription page with plan selection
- ✅ Shopping cart with quantity management (localStorage)
- ✅ Wishlist with heart toggle (localStorage)
- ✅ User dashboard (orders, rentals, wishlist, referral)
- ✅ Admin dashboard with analytics charts
- ✅ Inventory alerts panel
- ✅ Multi-step checkout with payment methods
- ✅ Protected routes with role-based access
- ✅ Loading skeletons on every data-loading state
- ✅ Responsive mobile-first design
- ✅ Dark theme with custom design system

---

## Deployment to Vercel (FREE)

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts. Set environment variables when asked.

### Option B: Vercel Dashboard

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Set **Framework**: Vite
5. Set **Environment Variables**:
   - `VITE_API_BASE_URL` = your backend URL
6. Click Deploy

### Backend Deployment Options (FREE)
- **Railway** — [railway.app](https://railway.app) (Node.js backend)
- **Render** — [render.com](https://render.com)
- **Cyclic** — [cyclic.sh](https://cyclic.sh)

---

## Customization

### Change Brand Colors
Edit `tailwind.config.js` → `theme.extend.colors.brand`

### Add New Pages
1. Create `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`
3. Add nav link in `src/components/layout/Navbar.jsx`

### Add New API
1. Create or add to `src/services/`
2. Import in the page component

---

## VS Code Extensions Recommended

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Auto Rename Tag

---

## License

MIT — Free to use for personal and commercial projects.
