# 📝 INTELLIGENT NOTE MANAGEMENT APPLICATION
**Student:** Truong Minh Thanh  
**ID:** 524H0032  
**Final Project - Web Application Development**

---

## 🌟 OVERVIEW
The Intelligent Note Management Application is a modern platform that allows users to create, secure, and collaborate on notes in real-time. Built with a robust **Laravel 11 (Backend)** and a dynamic **React Vite (Frontend)**, it integrates cutting-edge technologies like WebSockets (Reverb) and Cloud Storage (Cloudinary).

---

## 🛠 TECH STACK
- **Frontend:** React JS, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend:** Laravel 11 (PHP 8.3+), Sanctum (Authentication), Reverb (WebSocket Server).
- **Database:** MySQL / PostgreSQL.
- **Media Storage:** Cloudinary SDK (Images & Avatars).
- **Real-time:** Laravel Reverb (Collaborative editing & presence tracking).
- **PWA:** Service workers & LocalStorage caching (Offline support).

---

## 🚀 INSTALLATION & SETUP

### 🐳 Option 1: Running with Docker (Recommended & Fastest)
To run the entire application (Frontend, Backend, Database, Real-time server) automatically:
1. Make sure you have **Docker** and **Docker Compose** installed.
2. Run the following command in the root directory:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:8000](http://localhost:8000)
   - **Real-time Server:** [http://localhost:8080](http://localhost:8080)

### 🛠 Option 2: Manual Installation (Without Docker)
- PHP >= 8.2
- Node.js >= 18
- Composer & NPM
- MySQL Server

### 2. Backend Setup (`/backend-php`)
```bash
cd backend-php
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```
**Note:** Configure Database and Cloudinary credentials in the `.env` file.

### 3. Frontend Setup (`/frontend`)
```bash
cd frontend
npm install
cp .env.example .env
```

### 4. Running the Project (3 Terminals required)
- **Terminal 1 (Backend):** `php artisan serve` (Runs at http://localhost:8000)
- **Terminal 2 (WebSocket):** `php artisan reverb:start` (For Real-time features)
- **Terminal 3 (Frontend):** `npm run dev` (Runs at http://localhost:5173)

---

## 🔑 TEST ACCOUNTS
Use these accounts to evaluate the application:

| Role | Email | Password | Notes |
| :--- | :--- | :--- | :--- |
| **User A** | user@example.com | password123 | Owner of multiple notes, verified |
| **User B** | collaborator@example.com | password123 | Collaborator / Shared user |

---

## ✨ KEY FEATURES (RUBRIC COMPLIANCE)
The project fulfills **28/28** criteria. Highlights include:
1. **Real-time Collaboration:** Presence tracking (see who is online) and instant sync.
2. **Security:** Password-protected notes with secure hashing.
3. **Advanced Sharing:** Permission-based sharing (Edit/View) and "Copy to My Notes" feature.
4. **Offline Capabilities:** PWA Manifest and intelligent LocalStorage caching for offline access.
5. **Media Integration:** Seamless Cloudinary integration for lightning-fast image hosting.

---

## 📌 EVALUATION NOTES
- **Account Activation:** If real email delivery is not configured, use the "Resend Email" button on the dashboard banner to simulate activation or manually update `email_verified_at` in the database.
- **Real-time Demo:** Open two different browsers (e.g., Chrome and Edge) to see user avatars appear in the header when accessing the same note.

---
*Thank you for evaluating my final project!*
