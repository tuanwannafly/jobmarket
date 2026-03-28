# 💼 JobMarket — Full-Stack Recruitment Platform

A full-stack job recruitment platform with role-based access control, resume management, and automated email notifications. Built with **Java Spring Boot 3** on the backend and **React + TypeScript** on the frontend.

> 🚀 **Live Demo:** ([jobmarket-three.vercel.app](https://jobmarket-three.vercel.app/)
>
> ⚠️ **Note:** The backend is hosted on Render's **free tier**. On first load (or after inactivity), the server may take **30–60 seconds to wake up**. Please wait and refresh if you see a loading delay — this is expected behavior.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Role & Permission System](#role--permission-system)
- [Default Accounts](#default-accounts)
- [Architecture Notes](#architecture-notes)

---

## Overview

JobMarket is a recruitment platform that supports three types of users:

| Role | Description |
|------|-------------|
| **Candidate** | Browse jobs, apply with CV/resume, track application status |
| **Company (HR)** | Post jobs, manage applications, review submitted resumes |
| **Super Admin** | Full system control — manage users, companies, roles, permissions, skills |

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Java 17 + Spring Boot 3 | Core framework |
| Spring Security + OAuth2 | Authentication & authorization |
| JWT (stateless, HttpOnly cookie) | Session management |
| Spring Data JPA + Hibernate | ORM / database access |
| MySQL (Aiven Cloud) | Production database |
| Cloudinary | File/image storage (logos, avatars) |
| JavaMailSender (Gmail SMTP) | Email notifications |
| Spring Scheduler | Automated job-alert emails |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| Ant Design (antd) | UI component library |
| Redux Toolkit | Global state management |
| Axios + Mutex | HTTP client with token refresh |
| React Router v6 | Client-side routing |

---

## Features

### 👤 Authentication
- Register as **Candidate** or **Company (HR)**
- Login / Logout with JWT (stored in `localStorage`, refresh token in HttpOnly cookie)
- Auto token refresh using a `Mutex`-locked interceptor (prevents race conditions)

### 🔍 Candidate Features
- Browse and search job listings with filters (skill, location, salary, level)
- View company profiles and open positions
- Apply to jobs by uploading a PDF resume
- Track all submitted applications and their statuses (`PENDING` → `REVIEWING` → `APPROVED` / `REJECTED`)
- Subscribe to job alerts — receive automated emails when new matching jobs are posted

### 🏢 HR / Company Features
- Post and manage job listings (create, update, activate/deactivate)
- View all resumes submitted to their company's jobs
- Update resume status to track hiring pipeline

### 🛡️ Admin Features
- **User Management** — Create, update, delete users; assign roles
- **Company Management** — Manage company profiles with logo upload
- **Job Management** — Full CRUD over all job postings
- **Resume Management** — View all resumes across the platform
- **Skill Management** — Manage the global skill list used in jobs and subscriptions
- **Role Management** — Create roles with custom sets of permissions
- **Permission Management** — Define granular API-level permissions (method + endpoint)

---

## Project Structure

```
jobmarket/
├── backend/                          # Spring Boot application
│   └── src/main/java/com/tuan/jobmarket/
│       ├── config/
│       │   ├── SecurityConfiguration.java    # JWT filter, CORS, whitelist
│       │   ├── PermissionInterceptor.java     # RBAC enforcement per request
│       │   ├── DatabaseInitializer.java       # Seeds default admin + roles
│       │   └── CloudinaryConfig.java          # File upload config
│       ├── controller/               # REST API endpoints (11 controllers)
│       │   ├── AuthController.java
│       │   ├── UserController.java
│       │   ├── CompanyController.java
│       │   ├── JobController.java
│       │   ├── ResumeController.java
│       │   ├── SkillController.java
│       │   ├── RoleController.java
│       │   ├── PermissionController.java
│       │   ├── SubscriberController.java
│       │   ├── FileController.java
│       │   └── EmailController.java
│       ├── domain/                   # JPA entities + DTOs
│       ├── service/                  # Business logic (interface + impl)
│       ├── repository/               # Spring Data JPA repositories
│       └── util/                     # JWT utils, error handlers, annotations
│
└── frontend/                         # React + TypeScript application
    └── src/
        ├── config/
        │   ├── api.ts                # All API call functions
        │   ├── axios-customize.ts    # Axios instance with interceptors
        │   └── permissions.ts        # Frontend permission keys
        ├── pages/
        │   ├── home/                 # Landing page, job listing
        │   ├── job/                  # Job detail page
        │   ├── company/              # Company listing & detail
        │   ├── auth/                 # Login, Register
        │   └── admin/                # Admin dashboard pages
        │       ├── dashboard.tsx
        │       ├── user.tsx
        │       ├── company.tsx
        │       ├── job/
        │       ├── resume.tsx
        │       ├── role.tsx
        │       └── permission.tsx
        ├── components/
        │   ├── admin/                # Admin modals & tables per entity
        │   ├── client/               # Candidate-facing cards, modals
        │   └── share/                # Protected route wrapper
        ├── redux/
        │   ├── store.ts
        │   └── slice/accountSlide.ts # Auth state
        └── types/backend.d.ts        # TypeScript type definitions
```

---

## Getting Started

### Prerequisites

- **Java 17+** and **Maven 3.8+**
- **Node.js 18+** and **npm / yarn**
- A MySQL database (local or cloud)
- A [Cloudinary](https://cloudinary.com/) account (free tier works)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) enabled

---

### Backend Setup

**1. Clone the repository and navigate to the backend folder:**

```bash
git clone https://github.com/tuanwannafly/jobmarket.git
cd jobmarket/backend
```

**2. Configure environment variables** (see [Environment Variables](#environment-variables) section)

**3. Run the application:**

```bash
./mvnw spring-boot:run
```

The server starts at `http://localhost:8080`.

> On first run, `DatabaseInitializer` automatically seeds the database with:
> - All API permissions
> - A `SUPER_ADMIN` role with full access
> - A default admin account (`admin@gmail.com` / `123456`)
> - Sample companies, skills, and job listings

---

### Frontend Setup

**1. Navigate to the frontend folder:**

```bash
cd jobmarket/frontend
```

**2. Install dependencies:**

```bash
npm install
```

**3. Create a `.env` file:**

```env
VITE_BACKEND_URL=http://localhost:8080
```

**4. Start the development server:**

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

**Build for production:**

```bash
npm run build
```

---

## Environment Variables

### Backend — `application.properties`

| Variable | Description | Example |
|----------|-------------|---------|
| `MYSQL_PASSWORD` | MySQL database password | `your_db_password` |
| `JWT_SECRET` | Base64-encoded JWT secret key | `ODcxODJl...` |
| `MAIL_USERNAME` | Gmail address for sending emails | `yourapp@gmail.com` |
| `MAIL_PASSWORD` | Gmail App Password (not your login password) | `abcd efgh ijkl mnop` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `dxxxxxx` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abc123...` |

Set these as system environment variables or in your deployment platform (Render, Railway, etc.):

```bash
export MYSQL_PASSWORD=your_password
export JWT_SECRET=your_base64_secret
export MAIL_USERNAME=your_email@gmail.com
export MAIL_PASSWORD=your_app_password
export CLOUDINARY_CLOUD_NAME=your_cloud_name
export CLOUDINARY_API_KEY=your_api_key
export CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend — `.env`

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Base URL of the backend API |

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Public Endpoints (no authentication required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Login, returns access token + sets refresh token cookie |
| `POST` | `/auth/register?userType=CANDIDATE\|COMPANY` | Register new user |
| `GET`  | `/auth/refresh` | Refresh access token using HttpOnly cookie |
| `POST` | `/auth/logout` | Logout, clears refresh token cookie |
| `GET`  | `/companies` | List all companies (paginated) |
| `GET`  | `/companies/:id` | Get company details |
| `GET`  | `/jobs` | List all jobs (paginated, filterable) |
| `GET`  | `/jobs/:id` | Get job details |
| `GET`  | `/skills` | List all skills |
| `GET`  | `/roles` | List all roles (used in registration) |

### Authenticated Endpoints (JWT required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/auth/account` | Get current user profile |
| `POST` | `/resumes` | Submit a resume for a job |
| `POST` | `/resumes/by-user` | Get current user's submitted resumes |
| `POST` | `/subscribers` | Subscribe to job alerts |
| `POST` | `/subscribers/skills` | Get subscribed skills |
| `PUT`  | `/subscribers` | Update skill subscriptions |
| `PATCH`| `/users/change-password` | Change current user password |

### Admin Endpoints (Role + Permission required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST/PUT/DELETE` | `/users` | Full user management |
| `GET/POST/PUT/DELETE` | `/companies` | Full company management |
| `GET/POST/PUT/DELETE` | `/jobs` | Full job management |
| `GET/PUT/DELETE` | `/resumes` | Resume management & status updates |
| `GET/POST/PUT/DELETE` | `/skills` | Skill management |
| `GET/POST/PUT/DELETE` | `/roles` | Role management |
| `GET/POST/PUT/DELETE` | `/permissions` | Permission management |
| `POST` | `/files` | Upload file to Cloudinary |

### Query Parameters (for list endpoints)

All list endpoints support:

```
GET /api/v1/jobs?page=1&size=10&sort=createdAt,desc&filter=name~'engineer'
```

| Param | Description |
|-------|-------------|
| `page` | Page number (1-indexed) |
| `size` | Items per page |
| `sort` | Field and direction, e.g. `createdAt,desc` |
| `filter` | RSQL-style filter, e.g. `name~'java'` |

---

## Role & Permission System

JobMarket uses a **dynamic RBAC (Role-Based Access Control)** system enforced at the API level.

### How It Works

1. Each **Permission** maps to a specific HTTP method + API endpoint (e.g., `POST /api/v1/jobs`)
2. **Roles** are collections of permissions (e.g., `SUPER_ADMIN` has all permissions; `HR` has job/resume permissions)
3. Every authenticated request passes through `PermissionInterceptor`, which checks if the user's role includes a permission matching the request's method and path
4. If the permission is missing → `403 Forbidden`

### Default Roles

| Role | Description |
|------|-------------|
| `SUPER_ADMIN` | Full system access, seeded automatically |
| `COMPANY` | Can manage jobs and view resumes for their company |
| `Candidate` | Can apply to jobs, manage their own resumes and subscriptions |

### Flow Diagram

```
HTTP Request
    │
    ▼
JWT Filter ──── invalid/missing ──→ 401 Unauthorized
    │
    ▼ valid
PermissionInterceptor
    │ checks user.role.permissions
    │
    ├── match found ──→ Controller → Service → Repository → DB
    │
    └── no match ───→ 403 Forbidden
```

---

## Default Accounts

These accounts are automatically created on the first run:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@gmail.com` | `123456` |

> You can register additional Candidate or Company accounts directly from the registration page.

---

## Architecture Notes

### Token Management (Frontend)
- **Access Token**: Stored in `localStorage`, attached to every request via Axios interceptor
- **Refresh Token**: Stored in HttpOnly cookie (inaccessible to JavaScript), sent automatically with requests
- A `Mutex` lock prevents multiple simultaneous refresh calls when the access token expires

### File Uploads
- Files (resumes, company logos) are uploaded to **Cloudinary** via a dedicated `/api/v1/files` endpoint
- The backend returns a `fileName` URL stored in the database

### Email Notifications
- Uses **Spring `@Scheduled`** to periodically send job-alert emails to subscribers
- Email template is rendered with **Thymeleaf** (`templates/job.html`)

### Database
- Hosted on **Aiven (MySQL)** with SSL required
- Schema is initialized via `schema.sql` on startup
- `DatabaseInitializer` seeds data only if tables are empty (idempotent)

### CORS
- Configured in `CorsConfig.java`
- Allowed origins include `localhost:5173` (dev) and the Vercel production domain

---

## Screenshots

> _Coming soon — or visit the [live demo](https://jobmarket-2ui96cwen-tuanwannaflys-projects.vercel.app) to explore the platform._

---

## Author

**To Dang Minh Tuan**
- GitHub: [github.com/tuanwannafly](https://github.com/tuanwannafly)
- LinkedIn: [linkedin.com/in/tuanwannafly](https://linkedin.com/in/tuanwannafly)
- Email: totuanforwork@gmail.com
