<<<<<<< HEAD
# ArogyaNexa_
=======
﻿# ArogyaNexa — Frontend

A Next.js 14 clinical pharmacy platform with role-based dashboards, AI assistant, prescription management, and e-commerce.

---

## Quick Start

```bash
cd stitch/frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Credentials

All accounts use password: **`Demo@1234`**
Defined in `lib/demoAuth.ts` — intercepts login before hitting the backend.

| Role | Email | Dashboard | Access |
|------|-------|-----------|--------|
| Customer | `customer@demo.com` | `/dashboard` | Browse products, orders, prescriptions |
| Doctor | `doctor@demo.com` | `/doctor` | Patient portal, consultations |
| Pharmacist | `pharmacist@demo.com` | `/pharmacist` | Prescription review, dispensing queue |
| Admin | `admin@demo.com` | `/admin/dashboard` | Orders, products, users, operations |
| Super Admin | `superadmin@demo.com` | `/superadmin` | Full system access |
| Content Editor | `content@demo.com` | `/admin/content` | Wellness articles, education hub |

> The login page has a collapsible **"Demo credentials"** panel with a **Use** button per role that auto-fills the form.

---

## Environment Variables

```env
# stitch/frontend/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
```

---

## Project Structure

```
stitch/frontend/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Landing page
│   ├── login/                  # Login with demo credentials panel
│   ├── register/               # Registration
│   ├── dashboard/              # Customer / Patient dashboard
│   ├── doctor/                 # Doctor portal
│   ├── pharmacist/             # Pharmacist review interface
│   ├── admin/
│   │   ├── dashboard/          # Admin overview
│   │   ├── orders/             # Order management
│   │   ├── products/           # Product management table
│   │   ├── users/              # User management
│   │   ├── operations/         # Operations admin
│   │   ├── logistics/          # Shipping & logistics
│   │   ├── crm/                # Sales CRM dashboard
│   │   ├── payments/           # Payments
│   │   └── content/            # Content editor dashboard
│   ├── superadmin/             # Super admin dashboard
│   ├── products/               # Product listing & detail
│   ├── cart/                   # Shopping cart
│   ├── checkout/               # Secure checkout
│   ├── orders/                 # Customer order history & tracking
│   ├── prescriptions/          # Prescription upload & tracking
│   ├── profile/                # Customer profile & security settings
│   ├── wellness/               # Wellness education hub
│   ├── ai-assistant/           # AI chat assistant
│   └── verify/                 # MFA verification
├── components/
│   ├── landing/                # Hero, Features, Categories, etc.
│   └── ui/                     # Navbar, Footer, Toast, ProtectedRoute, etc.
├── hooks/                      # useAuth, useAppDispatch
├── lib/
│   ├── api/                    # auth, orders, products, cart, payments
│   ├── axios.ts                # Axios instance with token interceptor
│   ├── demoAuth.ts             # Demo credentials & mock login logic
│   ├── images.ts               # All image URLs from stitch HTML mockups
│   ├── mockData.ts             # Mock products, orders, cart, metrics
│   └── utils.ts                # formatCurrency, formatDate, cn
├── store/                      # Redux Toolkit — authSlice, cartSlice
└── types/                      # auth, api, product, order, cart
```

---

## Image Assets (`lib/images.ts`)

All images are sourced from the stitch HTML design mockups (`stitch/stitch/*/code.html`).
They are hosted externally on `lh3.googleusercontent.com` (already whitelisted in `next.config.mjs`).

The file exports named constants grouped by screen/context:

```ts
import { IMAGES } from '@/lib/images';

// Usage examples
<Image src={IMAGES.hero.pillBottlesFrosted} alt="..." />
<Image src={IMAGES.products.whiteBottle} alt="..." />
<Image src={IMAGES.people.femaleDoctor} alt="..." />
```

### Image Groups

| Group | Keys | Source Screen |
|-------|------|---------------|
| `hero` | `pillBottlesFrosted`, `pharmaBox`, `essentialOils` | `customer_home_page` |
| `products` | `whiteBottle`, `tabletsBlister`, `capsulesPoured`, `inhaler`, `vitamins`, `bpMonitor`, `pillBottleAmber`, `pharmaBoxSleek`, `capsulesMacro`, `medicalCream`, `vitaminAmber`, `pillsWhite`, `pillsBlue`, `prescriptionBottle`, `omegaBrown`, `vitaminD3`, `pillOrganizer`, `serumBottle`, `dermaBox` | product screens |
| `people` | `femaleDoctor`, `maleDoctorGlasses`, `pharmacistSmiling`, `pharmacistWhiteCoat`, `pharmacistFriendly`, `clinicalAdmin`, `medicalResearcher`, `femaleResearcher`, `healthcareAdmin`, `elderlyPatient`, `youngWoman`, `professionalMan`, `manSpectacles`, `womanSmiling`, `manSmiling`, `medAdministrator`, `crmManNavy`, `crmWomanGlasses`, `crmManTablet`, `resetPasswordDoctor` | various dashboards |
| `medical` | `labModern`, `labBlueLight`, `prescriptionForm`, `prescriptionDoc`, `medicalConcept`, `crystalsMicro` | clinical screens |
| `wellness` | `mediterraneanSalad`, `clinicalSetting`, `organicVegetables`, `herbalTea`, `doctorConsultation`, `yogaTopView`, `grainBowl`, `supplementBottle` | wellness & article screens |
| `maps` | `nycMap`, `londonMap`, `metroMap` | order tracking, logistics, CRM |
| `abstract` | `worldMap`, `biologicalRhythms`, `molecularStructures`, `secureNetwork`, `verificationSeal` | superadmin, checkout, wellness |
| `brand` | `apothecaryBottles`, `premiumPackaging` | title slide / branding |

---

## Auth Flow

```
Login Page
  ↓ (demo credentials?)
  ├── YES → getDemoAuthResponse() in lib/demoAuth.ts
  │         Returns mock token + roles, no backend call
  └── NO  → POST /api/v1/auth/login (real backend)

After login → getDashboardForRoles(roles) → redirect to role dashboard
```

Token is stored in `localStorage` as `accessToken` and attached to all API requests via the Axios interceptor.

---

## Role-Based Access

Defined in `hooks/useAuth.ts`:

```ts
const { isCustomer, isPharmacist, isAdmin, isSuperAdmin, hasRole } = useAuth();
```

Protected routes use `<ProtectedRoute requiredRole="ADMIN">` which redirects to `/403` if the role doesn't match.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Redux Toolkit |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Icons | Lucide React + Material Symbols |
| Payments | Razorpay |
| Animation | Framer Motion |
>>>>>>> 52fd3aa (frontend upload)
