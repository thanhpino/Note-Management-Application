# 📝 INTELLIGENT NOTE MANAGEMENT APPLICATION
**Team Members:** 
- Truong Minh Thanh (524H0032) - Team Leader
- Nguyễn Hữu Tân (524H0028)
- Nguyễn Chí Minh (524H0111)

**Course:** Web Application Development - Final Project
**GitHub Repository:** [https://github.com/thanhpino/Note-Management-Application](https://github.com/thanhpino/Note-Management-Application)
**Demo Video:** [Click here to watch the demo video](Link_Video_Demo_Ở_Đây)

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

### 4. Running the Project (4 Terminals required)
To experience the full functionality (including fast registration and real-time sync):
- **Terminal 1 (Backend API):** `cd backend-php && php artisan serve`
- **Terminal 2 (WebSocket):** `cd backend-php && php artisan reverb:start`
- **Terminal 3 (Background Jobs):** `cd backend-php && php artisan queue:work`
- **Terminal 4 (Frontend):** `cd frontend && npm run dev`

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
- **Account Activation:** Ensure Terminal 3 (`queue:work`) is running. If real email delivery is not configured, check the logs in `backend-php/storage/logs/laravel.log` or manually update `is_verified` to `1` in the `users` table.
- **Real-time Demo:** Open two different browsers (e.g., Chrome and Edge) to see user avatars appear in the header when accessing the same note.

---
*Thank you for evaluating our final project!*
