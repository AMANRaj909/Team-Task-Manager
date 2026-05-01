# 🚀 Nexus Task Manager

Nexus is a premium, high-fidelity **Team Task Management** application built with a modern full-stack architecture. It features a sophisticated "Rose Vale & Cornsilk" aesthetic, high-performance animations, and robust project tracking capabilities.

![Nexus Dashboard](https://raw.githubusercontent.com/AMANRaj909/Team-Task-Manager/main/screenshot.png) *(Note: Add your actual screenshot here later)*

## ✨ Key Features

- **💎 Premium UI/UX**: Eye-soothing "Rose Vale" (#A94A4A) and "Cornsilk" (#FFF6DA) color palette with a clean, light-theme aesthetic.
- **⚡ Advanced Animations**: Powered by **Framer Motion** for smooth, spring-based transitions and interactive elements.
- **🔐 Secure Authentication**: JWT-based identity verification with role-based access control (Admin/Member).
- **📊 Interactive Dashboard**: Real-time statistics, progress charts, and activity logs.
- **📂 Project Sectors**: Create, manage, and monitor high-level project sectors.
- **✅ Task Registry**: Sophisticated task tracking with assignment, status updates, and deadline management.
- **👥 Team Sync**: Effortlessly add and manage team members within specific projects.

## 🛠️ Tech Stack

### **Frontend**
- **React 18** (Vite)
- **Tailwind CSS v4** (Advanced Styling)
- **Framer Motion** (Fluid Animations)
- **Lucide React** (Premium Iconography)
- **Axios** (API Communication)

### **Backend**
- **Node.js & Express**
- **Prisma ORM** (Database Management)
- **PostgreSQL** (Supabase)
- **JWT & Bcrypt.js** (Security)

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18+)
- PostgreSQL Database (or Supabase account)

### **Installation**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AMANRaj909/Team-Task-Manager.git
   cd Team-Task-Manager
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/dbname?pgbouncer=true"
   JWT_SECRET="your_secret_key"
   PORT=5000
   ```
   Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the development servers:
   ```bash
   # In backend folder
   npm run dev

   # In frontend folder
   npm run dev
   ```

## 🏗️ Architecture

Nexus follows a decoupled client-server architecture:
- **Backend**: RESTful API designed with modular routes and Prisma for type-safe database operations.
- **Frontend**: Component-driven architecture with Context API for global state management (Auth).

## 📄 License

This project is licensed under the MIT License.

---
Built with ❤️ by [Aman Raj](https://github.com/AMANRaj909)
