# 🏥 MediQueue — Healthcare Queue Management System

A full-stack web application that digitizes hospital appointment booking and patient queue management. Patients book appointments online, doctors manage their daily queues in real time, and admins oversee the entire platform.

---

## 📸 Screenshots

| Admin Dashboard | Manage Doctors | Analytics |
|---|---|---|
| ![Admin Dashboard](Project%20page%20images/admin%20dashboard.png) | ![Manage Doctors](Project%20page%20images/manage%20doctors.png) | ![Analytics](Project%20page%20images/manage%20profile.png) |

---

## 🚀 Live Demo

> Coming soon — deployment in progress (Render + Vercel + MongoDB Atlas)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [API Overview](#-api-overview)
- [Database Design](#-database-design)
- [Security Implementation](#-security-implementation)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [What I Learned](#-what-i-learned)
- [Folder Structure](#-folder-structure)

---

## ✨ Features

### 👤 Patient
- Register with OTP-based email verification
- Book appointments by selecting doctor, date, and available time slot
- Receive a token number for queue position
- Track live queue position and estimated waiting time in real time
- View full appointment history with search and infinite scroll
- Cancel appointment with automatic refund eligibility check (24-hour cutoff)
- Reschedule appointment to a new date and time slot
- Submit star ratings and reviews after completed appointments
- Manage profile — medical history, allergies, medications, emergency contact, insurance details

### 👨‍⚕️ Doctor
- Secure login with role-based access
- View today's schedule and upcoming patient list
- Queue management — mark complete, move to next patient, skip, mark no-show
- Add consultation notes, diagnosis, and prescription per appointment
- Configure weekly schedule with start/end times, break slots, and slot duration
- Toggle availability and update consultation fee
- View personal appointment statistics

### 👨‍💼 Admin
- Register doctors with OTP email verification workflow
- Approve, reject, suspend, deactivate, or reactivate doctor accounts
- View paginated doctor list with search
- Access platform analytics — weekly appointments chart, doctor performance chart
- Generate platform reports — doctor/patient/appointment counts and breakdowns
- View all users and delete accounts

### 🔐 Authentication & Security
- OTP-based registration for patients and doctors
- JWT access tokens (15 min) + refresh tokens (7 days) with httpOnly cookies
- Automatic token refresh via Axios interceptor
- Account lockout after 5 failed login attempts (15-minute window)
- Suspicious activity detection with 30-minute lock on token reuse attack
- Role-based route protection (Admin / Doctor / Patient)
- Request sanitization against NoSQL injection and XSS
- Rate limiting on auth and sensitive API endpoints
- Password reset via 6-digit OTP with 10-minute expiry

### 📧 Email Notifications
- OTP emails for registration and password reset
- Doctor invitation email with verification link
- Appointment cancellation email with refund status
- Reschedule confirmation email
- Appointment reminder email with token number
- Contact form notification to admin + confirmation to user

### ✅ Form Validation
- Shared validation utility with reusable rules (required, email, strongPassword, passwordMatch, phone, age, OTP)
- Real-time per-field validation on blur and onChange
- Field-level error messages with red border highlighting
- Applied on every form: Login, Register, ForgotPassword, ChangePassword, AddDoctor, PatientProfile

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router DOM v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| Axios | HTTP client with interceptors |
| Recharts | Analytics charts |
| Lucide React | Icon library |
| Vite | Build tool and dev server |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js v5 | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM with schema validation |
| JSON Web Token | Authentication tokens |
| bcrypt | Password hashing |
| Nodemailer | Email sending via Gmail |
| Multer | File upload handling |
| ImageKit | Cloud image storage |
| express-rate-limit | API rate limiting |
| Helmet | HTTP security headers |
| cookie-parser | Cookie handling |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  Patient UI │ Doctor UI │ Admin UI │ Auth Pages          │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (Axios + JWT Bearer)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  Express.js REST API                     │
│                                                         │
│  Auth Routes      /api/auth                             │
│  Admin Routes     /api/admin                            │
│  Doctor Routes    /api/doctor                           │
│  Patient Routes   /api/patient                          │
│  Appointment      /api/appointments                     │
│  Schedule         /api/schedule                         │
│  Upload           /api/upload                           │
│  Contact          /api/contact                          │
│                                                         │
│  Middlewares: Auth │ Role │ RateLimit │ Sanitize │ Error │
└──────────────────────┬──────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       MongoDB      ImageKit     Gmail
      (Database)   (Images)     (Email)
```

---

## 📡 API Overview

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register patient, send OTP |
| POST | `/api/auth/verify-otp` | Public | Verify OTP, create account |
| POST | `/api/auth/login` | Public | Login, receive JWT tokens |
| POST | `/api/auth/logout` | Auth | Logout, clear session |
| POST | `/api/auth/forgot-password-otp` | Public | Send password reset OTP |
| POST | `/api/auth/forgot-password-otp/verify` | Public | Verify OTP, reset password |
| POST | `/api/auth/change-password` | Auth | Change password |
| POST | `/api/admin/register-doctor` | Admin | Invite doctor via OTP |
| POST | `/api/admin/verify-doctor-otp` | Admin | Verify doctor OTP |
| GET | `/api/admin/doctors` | Admin | Get all doctors (paginated) |
| PATCH | `/api/admin/doctors/:id/approval` | Admin | Approve/reject/suspend doctor |
| GET | `/api/admin/analytics` | Admin | Platform analytics |
| GET | `/api/admin/reports/platform` | Admin | Generate platform report |
| GET | `/api/appointments/available-slots` | Patient | Get available slots |
| POST | `/api/appointments/book` | Patient | Book appointment |
| GET | `/api/appointments/my-appointments` | Patient | Patient appointment history |
| PUT | `/api/appointments/:id/cancel` | Auth | Cancel with refund logic |
| POST | `/api/appointments/:id/reschedule` | Patient | Reschedule appointment |
| PATCH | `/api/appointments/:id/no-show` | Doctor | Mark no-show |
| POST | `/api/appointments/:id/review` | Patient | Submit rating + review |
| POST | `/api/appointments/:id/reminder` | Admin | Send reminder email |
| GET | `/api/appointments/live-queue/status` | Patient | Live queue position |
| PUT | `/api/appointments/:id/status` | Doctor | Update appointment status |
| PUT | `/api/appointments/:id/consultation-notes` | Doctor | Add notes + complete |
| GET | `/api/doctor/me` | Doctor | Get own profile |
| PUT | `/api/doctor/:id` | Doctor | Update profile |
| GET | `/api/schedule` | Doctor | Get weekly schedule |
| POST | `/api/schedule` | Doctor | Set day schedule |
| GET | `/api/patient/me` | Patient | Get own profile |
| PUT | `/api/patient/:id` | Patient | Update profile |

---

## 🗄 Database Design

### Models & Key Design Decisions

**User** — base auth record for all roles
- `email` indexed + unique + lowercase
- `failedLoginAttempts`, `lockUntil` for brute-force protection
- `refreshTokenHash` for token rotation security

**Doctor** — extends User with professional data
- `user` unique ref (one doctor profile per user)
- `verificationStatus` — pending / approved / rejected / suspended
- Compound index on `{ specialization, verificationStatus, isAvailable }` for fast doctor search

**Patient** — extends User with medical data
- `user` unique ref
- Medical history, allergies, medications, emergency contact, insurance details
- `age` stored as Number with min/max validation

**Appointment** — core business entity
- Index on `appointmentDate`
- Compound index on `{ doctor, appointmentDate }` for slot availability queries
- Compound index on `{ patient, appointmentDate: -1 }` for history queries
- `status` enum: pending / confirmed / completed / cancelled / no-show
- Cancellation fields: `cancelledAt`, `cancellationReason`, `cancelledBy`, `refundStatus`
- Reschedule fields: `rescheduledFrom` (ref), `rescheduledAt`
- Review fields: `rating` (1–5), `review`, `reviewSubmittedAt`

**Schedule** — doctor weekly availability
- Unique compound index `{ doctor, dayOfWeek }` prevents duplicate entries
- `breaks` array for lunch/prayer breaks
- `slotDuration` and `maxPatientsPerDay` control slot generation

**OtpRegistration** — temporary OTP storage
- TTL index on `expiresAt` for automatic cleanup
- Stores hashed OTP only, never plaintext

---

## 🔒 Security Implementation

### Authentication Flow
```
Register → Send OTP → Verify OTP → Create User → Issue Tokens
Login    → Verify Password → Issue Access Token (15min) + Refresh Token (7d)
Request  → Axios interceptor attaches Bearer token
401 hit  → Auto-refresh via /auth/refresh-token → Retry original request
Logout   → Clear refresh token hash from DB + clear cookies
```

### Token Security
- Access tokens stored in memory (localStorage) — short-lived (15 min)
- Refresh tokens in httpOnly cookies — cannot be accessed by JavaScript
- Refresh token hash stored in DB — token reuse = suspicious activity lock
- On reuse attack detected: account locked for 30 minutes

### Account Protection
- 5 failed logins → 15-minute lockout
- All passwords hashed with bcrypt (cost factor 10)
- OTP hashed with SHA-256 before storage
- Rate limiting: 100 req/15min general, 5 req/15min on password reset

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Gmail account with App Password enabled
- ImageKit account (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/medi-queue.git
cd medi-queue

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the App

```bash
# Terminal 1 — Start backend (from /backend)
npm run dev

# Terminal 2 — Start frontend (from /frontend)
npm run dev
```

Backend runs on `http://localhost:3000`
Frontend runs on `http://localhost:5173`

### Create Admin Account

```bash
cd backend
node createAdmin.js
```

---

## 🔑 Environment Variables

Create a `.env` file inside `/backend`:

```env
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mediqueue

# JWT
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars

# ImageKit (image uploads)
IMAGEKIT_PUBLIC_KEY=public_xxx
IMAGEKIT_PRIVATE_KEY=private_xxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/yourid/

# Gmail (Nodemailer)
GOOGLE_USER=youremail@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password

# App
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@yourdomain.com
```

> **Gmail Setup:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate password for "Mail"

---

## 🧠 What I Learned

### Backend & API Design
- Designing a RESTful API with clear resource naming and HTTP method conventions
- Building custom middleware for authentication, role authorization, rate limiting, and input sanitization
- Implementing JWT refresh token rotation with reuse detection to prevent token theft
- Using MongoDB aggregation pipelines for analytics (groupBy doctor, weekly trends)
- Database indexing strategy — when to use single-field vs compound indexes and why
- Schema-level validation vs application-level validation — using both layers together
- Handling async errors cleanly with a global error handler instead of try/catch everywhere
- Sending transactional emails with Nodemailer and handling failures non-blocking

### Frontend & React
- Managing complex auth state with React Context + useReducer pattern
- Axios interceptors for automatic token refresh without touching individual API calls
- Building real-time features via polling with proper cleanup on unmount
- Infinite scroll with IntersectionObserver API
- Form validation architecture — reusable rule-based system vs per-component validation
- `useMemo` and `useCallback` for performance in lists that re-render often
- Building role-based protected routes cleanly with a wrapper component

### Security
- Why httpOnly cookies for refresh tokens prevent XSS token theft
- How brute-force account lockout should work (attempts + time window)
- Why OTP should be hashed before storage (same principle as passwords)
- NoSQL injection patterns and how to prevent them with key sanitization
- Rate limiting strategy — different limits for different route sensitivity

### Product Thinking
- Modelling a real-world workflow end to end (booking → queue → consultation → review)
- Handling edge cases: expired slots, double booking, past appointment cancellation, token reuse
- Refund eligibility as a business rule encoded in the data model
- Designing for multiple user roles with overlapping but distinct permissions

---

## 📁 Folder Structure

```
medi-queue/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, ImageKit config
│   │   ├── controllers/     # Business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── admin.controller.js
│   │   │   ├── appointment.controller.js
│   │   │   ├── doctor.controller.js
│   │   │   ├── patient.controller.js
│   │   │   ├── queue.controller.js
│   │   │   ├── schedule.controller.js
│   │   │   └── contact.controller.js
│   │   ├── middlewares/     # Auth, roles, rate limit, validation
│   │   ├── models/          # Mongoose schemas
│   │   │   ├── user.model.js
│   │   │   ├── docter.model.js
│   │   │   ├── patient.model.js
│   │   │   ├── appointment.model.js
│   │   │   ├── Schedule.model.js
│   │   │   └── otp.model.js
│   │   ├── routes/          # Express routers
│   │   ├── utils/           # Email, tokens, OTP, errors
│   │   └── app.js
│   ├── createAdmin.js       # Admin seeder script
│   ├── server.js
│   └── .env.example
│
└── frontend/
    └── src/
        ├── api/             # Axios config, authService, patientService
        ├── assets/          # Images, icons
        ├── components/
        │   ├── adminComponents/
        │   ├── doctorComponents/
        │   ├── patientComponents/
        │   └── common/
        ├── context/         # AuthContext
        ├── pages/
        │   ├── admin/       # Dashboard, ManageDoctors, Analytics
        │   ├── auth/        # Login, Register, ForgotPassword, etc.
        │   ├── doctor/      # Dashboard, QueueManagement, Profile
        │   ├── patient/     # Dashboard, BookAppointment, History, etc.
        │   └── public/      # Home, ContactUs, NotFound
        ├── utils/           # validation.js
        └── App.jsx
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes please open an issue first.

---

## 📄 License

MIT License — feel free to use this project for learning or portfolio purposes.

---

## 👨‍💻 Author

**Aman Chaudhary**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourprofile)

---

> Built with ❤️ to solve a real problem — long hospital queues and zero visibility into wait times.
