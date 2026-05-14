# 📝 INTELLIGENT NOTE MANAGEMENT APPLICATION
--------------------------------------------------
TEAM MEMBERS:
- Truong Minh Thanh (524H0032) - Team Leader
- Nguyễn Hữu Tân (524H0028)
- Nguyễn Chí Minh (524H0111)

COURSE: Web Application Development - Final Project
GITHUB: https://github.com/thanhpino/Note-Management-Application
DEMO VIDEO: [Link_Video_Demo_Ở_Đây]

--------------------------------------------------
1. OVERVIEW
--------------------------------------------------
A high-performance Note Management platform featuring real-time collaboration, secure note protection, and offline support.
Built with Laravel 11 (Backend) and React Vite (Frontend).

--------------------------------------------------
2. OPTIONAL FEATURES (EXTRA POINTS) ✨
--------------------------------------------------
Our team has implemented the following advanced features:
- REAL-TIME COLLABORATION: Using Laravel Reverb (WebSockets) for instant note syncing and presence tracking (see who is online).
- PROGRESSIVE WEB APP (PWA): Full offline support with Service Workers and LocalStorage caching.
- SECURE NOTES: Notes can be password-protected with industry-standard hashing.
- DIRECT CLOUD UPLOAD: Images/Avatars are uploaded directly from Frontend to Cloudinary for maximum speed.
- BACKGROUND EMAIL QUEUE: Registration and OTP emails are processed asynchronously using Laravel Queue for a seamless UX.

--------------------------------------------------
3. RUNNING THE PROJECT (DOCKER - RECOMMENDED)
--------------------------------------------------
1. Ensure Docker & Docker Compose are running.
2. Open terminal in the root directory.
3. Run: docker-compose up --build
4. Access:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Real-time: http://localhost:8080

--------------------------------------------------
4. MANUAL INSTALLATION (REPRODUCING FROM SOURCE)
--------------------------------------------------
Prerequisites: PHP 8.2+, Node 18+, Composer, NPM, MySQL.

A. BACKEND SETUP (/backend-php):
   1. composer install
   2. cp .env.example .env (Configure DB and Cloudinary keys)
   3. php artisan key:generate
   4. php artisan migrate --seed

B. FRONTEND SETUP (/frontend):
   1. npm install
   2. cp .env.example .env

C. RUNNING (Open 4 separate terminals):
   - Terminal 1: php artisan serve
   - Terminal 2: php artisan reverb:start
   - Terminal 3: php artisan queue:work
   - Terminal 4: npm run dev

--------------------------------------------------
5. TEST ACCOUNTS (PRE-LOADED DATA)
--------------------------------------------------
Account A (Owner):
- Email: user@example.com
- Password: password123

Account B (Collaborator):
- Email: collaborator@example.com
- Password: password123

--------------------------------------------------
6. EVALUATION NOTES FOR TEACHERS
--------------------------------------------------
- REAL-TIME DEMO: Access the same note from two different browsers (e.g. Chrome & Edge) to see real-time updates and presence avatars.
- EMAIL LOGS: If SMTP is not configured, find activation links in:
  backend-php/storage/logs/laravel.log
- OFFLINE MODE: Toggle "Offline" in Chrome DevTools to test PWA capabilities.

--------------------------------------------------
Thank you for evaluating our final project!
