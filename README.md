# 🌌 NexusBoard – Scalable Task Management Dashboard

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)

NexusBoard is a high-performance, full-stack task management ecosystem designed with **Hexagonal Architecture**. Built as a premium solution for productivity, it combines enterprise-grade patterns with a stunning, glassmorphic UI.
LIVE LINK: (https://profiledashboard-liart.vercel.app/login)

---

## ✨ Features

### 🔐 Secure Authentication
- **JWT-Powered**: Stateless authentication for scalable sessions.
- **Cryptographic Hashing**: User passwords secured via `bcrypt` with high salt rounds.
- **Route Guardians**: Sophisticated `PublicRoute` and `ProtectedRoute` wrappers to manage access intent.
- **Automated Session Cleanup**: Centralized interceptors that flush local state on token expiration.

### 📊 Intelligence Dashboard
- **Dynamic Stats**: Real-time calculation of "Total Tasks", "Completion Rate", and "Productivity Indices" directly from the database.
- **Live Search**: High-speed client-side filtering and full-text search across your task workspace.
- **Visual Feedback**: Success/Error states integrated with GSAP to provide a "felt" user experience.

### 📝 Task Ecosystem (CRUD)
- **Fluid Task Creation**: Rapid entry with auto-refreshing dashboard metrics.
- **Status Lifecycle**: Toggle between 'Pending' and 'Completed' with instant UI synchronization.
- **Modern Interactions**: Edit and delete tasks with smooth Framer Motion transitions.

### 🎨 Premium UI/UX
- **Aesthetic**: Deep slate dark mode with glassmorphic cards and mesh gradients.
- **Motion Design**: Entrance animations and micro-interactions powered by GSAP.
- **Responsive Core**: Custom-built mobile sidebar and adaptive grid layouts.

---

## 🧠 Architectural Philosophy: Hexagonal (Ports & Adapters)

To ensure this project is "future-proof", I implemented **Hexagonal Architecture** on both the Frontend and Backend. This separates business rules from technology choices.

### 🧱 Folder Structure (Enterprise Ready)

#### **Backend Structure**
```text
backend/src/
├── domain/                # Core Business Entities (User, Task)
├── application/           # Use Cases (SignupUser, LoginUser, GetStats)
└── infrastructure/        # Adapters
    ├── database/          # Mongoose Models & Repositories
    ├── web/               # Express Routes, Controllers & Middleware
    └── security/          # JWT & Bcrypt Logic
```

#### **Frontend Structure**
```text
frontend/src/
├── domain/                # Data Models
├── application/           # Logic & Global State (Context)
├── infrastructure/        # API Clients & Service Mappings
└── ui/                    # Presentation Layer
    ├── components/        # Dynamic & Reusable UI
    ├── pages/             # Layout & Route Views
    └── routing/           # Route Guards
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, GSAP, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express, MongoDB (Atlas), Mongoose |
| **Security** | JSON Web Tokens (JWT), BcryptJS |
| **Architecture** | Hexagonal (Clean Architecture), Repository Pattern |

---

## 🧪 Quick Start (Local Setup)

### 1️⃣ Clone and Install
```bash
git clone https://github.com/your-username/nexusboard.git
cd nexusboard
```

### 2️⃣ Backend Configuration
```bash
cd backend
npm install

# Create .env file
echo "PORT=5001" >> .env
echo "MONGO_URI=your_mongodb_connection_string" >> .env
echo "JWT_SECRET=your_secure_secret_key" >> .env

npm run dev
```

### 3️⃣ Frontend Configuration
```bash
cd ../frontend
npm install
npm run dev
```
Accessible at: `http://localhost:5174`

---

## 🔑 API Reference

| Endpoint | Method | Description | Auth |
| :--- | :--- | :--- | :--- |
| `/api/signup` | POST | Register a new identity | No |
| `/api/login` | POST | Secure gateway access | No |
| `/api/profile` | GET | Fetch current user context | Yes |
| `/api/dashboard` | GET | Live stats & productivity scores | Yes |
| `/api/tasks` | GET | Fetch task workspace | Yes |
| `/api/tasks` | POST | Initialize new task | Yes |

---

## 🌍 Real-World Impact & Vision

1. **Personal Mastery**: Reduces cognitive load by centralizing scattered goals into a single "Command Center."
2. **Academic Precision**: Helps students map deadlines to subjects, ensuring examination readiness.
3. **Micro-Team Growth**: Provides a foundation for role-based collaboration in small workgroups.
4. **Future Scope**: Planned implementation of **RBAC (Role-Based Access Control)**, **Redis Caching**, and **Daily Habit Tracking**.

---

## 👨‍💻 Author

**Chandril Das**  
*Frontend / Full-Stack Developer*  
**Tech Stack**: React, Node.js, MongoDB, Tailwind, GSAP

---

> This project was developed as a high-fidelity demonstration of clean code, scalable architecture, and visual excellence. ✅
# profiledashboard
