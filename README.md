Good—this is a **big upgrade in UX and product positioning**, but it also changes your **auth system, security model, and flows** quite a bit. I’ll restructure everything to feel like a **clean, enterprise-grade SaaS**, not a hacky MVP.

---

# 🚀 PRODUCT REFRAME (ENTERPRISE SAAS STYLE)

You now have **2 clearly separated experiences**:

### 🧍 Customer App (Public-facing, polished UI)

* Email OTP login (passwordless)
* Booking-focused
* Clean, fast, mobile-first

### 🛡️ Admin / Trainer App (Secure dashboard)

* Email + password login
* Internal system
* Analytics, management, control

👉 This separation is exactly how products like Calendly and Mindbody structure their apps.

---

# 🧩 FEATURE LIST (UPDATED)

---

## 🧍 Customer App (Public SaaS UI)

✨ **Beautiful landing page**

* Branding, hero section, CTA
* Featured trainers
* Social proof

🔐 **OTP-based login (Email)**

* Passwordless auth
* Secure token-based session

👤 **Customer profile**

* Personal details
* Booking history

🔍 **Browse trainers**

* Filters (price, specialty, rating)

⚡ **Instant booking**

* Live slot availability

💳 **Secure payments**

* Stripe checkout

🔄 **Reschedule / cancel**

* Policy-driven

⭐ **Reviews**

* Post-session rating

📧 **Email notifications**

* Booking confirmation
* Reminder emails

---

## 🧑‍🏫 Trainer Dashboard

🔐 **Login (email + password)**

📅 **Slot management**

* Create/edit/block slots

📊 **Dashboard**

* Upcoming sessions
* Revenue summary

👤 **Client management**

* View customers
* Session history

💬 **Session notes**

🔔 **Notifications**

💰 **Payout setup (Stripe Connect)**

---

## 🛡️ Admin Dashboard

🔐 **Secure login (email + password)**

👥 **User management**

* Trainers / customers

📊 **Platform analytics**

💰 **Revenue tracking**

🛠️ **System controls**

* Block users
* Manage bookings

📧 **Email automation**

---

# 🗺️ UPDATED ROADMAP

---

## 1️⃣ MVP — Core Booking + OTP Auth (Weeks 1–6)

👉 Goal: frictionless onboarding + booking

### Auth

* Email OTP login (customer)
* Admin login (email/password)

### Core

* Trainer profiles
* Slot CRUD
* Browse trainers
* Booking flow
* Stripe payment
* Webhook confirmation

### UI

* Landing page (basic but clean)
* Customer dashboard (bookings list)

### Notifications

* OTP email
* Booking confirmation email

---

## 2️⃣ Growth — Trust & Usability (Weeks 7–12)

* Reviews & ratings
* Trainer dashboard (improved)
* Booking history UI polish
* Email reminders (24h)
* Stripe Connect payouts
* Better landing page (UI/UX upgrade)

---

## 3️⃣ Retention — Engagement (Weeks 13–20)

* Recurring slots
* Waitlist
* Push notifications
* Cancellation policy engine
* Google Calendar sync
* In-app messaging

---

## 4️⃣ Scale — Enterprise Features

* Admin analytics dashboard
* Role-based permissions (granular)
* Audit logs
* Coupons & promos
* Subscription plans
* Multi-tenant support (future SaaS expansion)

---

# 🗄️ DATABASE DESIGN (UPDATED FOR OTP AUTH)

---

## users

```sql id="b8d9v1"
id PK uuid
email varchar UNIQUE
role enum (admin, trainer, customer)
is_verified boolean
created_at timestamp
```

---

## 🔐 otp_codes (NEW)

```sql id="yqk2r8"
id PK uuid
email varchar
otp varchar
expires_at timestamp
is_used boolean
created_at timestamp
```

👉 Store hashed OTP in production (important)

---

## 🔐 sessions (NEW - recommended)

```sql id="2hpw4s"
id PK uuid
user_id FK users
refresh_token varchar
expires_at timestamp
created_at timestamp
```

---

## trainer_profiles

```sql id="3lq8dz"
id PK uuid
user_id FK users
bio text
specialties text[]
price_per_session numeric
stripe_account_id varchar
```

---

## slots

```sql id="0b6nfd"
id PK uuid
trainer_id FK trainer_profiles
start_time timestamp
end_time timestamp
status enum (available, booked, blocked)
```

---

## bookings

```sql id="7d1nxe"
id PK uuid
slot_id FK slots
customer_id FK users
payment_id FK payments
status enum (confirmed, cancelled, completed)
notes text
created_at timestamp
```

---

## payments

```sql id="q1f6ys"
id PK uuid
user_id FK users
stripe_payment_id varchar
amount numeric
currency varchar
status enum
created_at timestamp
```

---

## reviews

```sql id="k4mz9p"
id PK uuid
booking_id FK bookings
rating int
comment text
created_at timestamp
```

---

# 🔌 API DESIGN (ENTERPRISE-LEVEL)

---

## 🔐 Auth (OTP-based)

POST /auth/request-otp

```json id="m8n0fh"
{ "email": "user@email.com" }
```

---

POST /auth/verify-otp

```json id="z1k2xp"
{
  "email": "user@email.com",
  "otp": "123456"
}
```

Response:

* Access token
* Refresh token

---

POST /auth/admin-login

```json id="ps2x1v"
{
  "email": "admin@email.com",
  "password": "****"
}
```

---

POST /auth/refresh

POST /auth/logout

---

## 👨‍🏫 Trainers

GET /trainers
GET /trainers/:id
PUT /trainers/me

---

## 📅 Slots

GET /trainers/:id/slots
POST /slots
PUT /slots/:id
DELETE /slots/:id

---

## 📅 Bookings

POST /bookings

GET /bookings/me

PUT /bookings/:id/cancel

PUT /bookings/:id/reschedule

---

## 💳 Payments

POST /payments/intent

POST /payments/webhook

POST /payments/refund

---

## ⭐ Reviews

POST /reviews
GET /trainers/:id/reviews

---

# 🔐 AUTH FLOW (CRITICAL — ENTERPRISE STYLE)

---

## ✉️ Customer OTP Login

1. User enters email

2. `/auth/request-otp`

   * Generate OTP
   * Store in DB
   * Send via email

3. User enters OTP

4. `/auth/verify-otp`

   * Validate OTP
   * Mark used
   * Create user if not exists
   * Issue JWT + refresh token

---

## 🔑 Admin Login

1. Email + password
2. bcrypt compare
3. Issue tokens

---

# ⚠️ SECURITY REQUIREMENTS (NON-NEGOTIABLE)

---

## OTP

* Expiry: 5–10 mins
* Max attempts limit
* Rate limit `/request-otp`
* Hash OTP in DB

---

## Auth

* JWT short expiry (15 min)
* Refresh tokens stored in DB
* Rotate refresh tokens

---

## API Protection

* Role-based middleware
* Admin routes protected strictly

---

# 🎨 FRONTEND STRUCTURE (IMPORTANT)

---

## Customer App (Public)

* Landing page
* Trainer listing
* Booking flow
* OTP login modal/page
* Customer dashboard

---

## Admin/Trainer App

* Separate route (/admin or subdomain)
* Protected dashboard
* Management UI

---

# 🧠 FINAL HONEST ASSESSMENT

---

### 🔥 What You Improved

* Removed password friction → better conversion
* Clear separation of user vs admin → scalable architecture
* SaaS-ready foundation

---

### ⚠️ What Got More Complex

* Auth system (OTP + sessions)
* Email delivery reliability
* Security (rate limits, expiry)

---

### 🎯 Biggest Risk Now

If OTP fails or delays →
👉 Users **cannot log in at all**

So:

* Use reliable email service (Resend, SES)
* Add retry UX
* Keep OTP simple

---

# 🧭 My Recommendation

👉 Build this in order:

1. OTP auth (rock solid)
2. Booking flow
3. Payment webhook
4. Basic dashboard

---

If you want next, I can help you with:

* OTP system (Node.js + Prisma code)
* Auth middleware (production-ready)
* Frontend OTP UX (React)
* Folder structure for enterprise app

Just tell me 👍
