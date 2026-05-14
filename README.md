![App Banner](frontend/public/assets/banner.png)

# 📝 INTELLIGENT NOTE MANAGEMENT APPLICATION
**Live Demo:** [https://note-management-frontend.onrender.com](https://note-management-frontend.onrender.com)

**Team Members:** 
- Truong Minh Thanh (524H0032) - Team Leader
- Nguyễn Hữu Tân (524H0028)
- Nguyễn Chí Minh (524H0111)

**Course:** Web Application Development - Final Project
**GitHub Repository:** [https://github.com/thanhpino/Note-Management-Application](https://github.com/thanhpino/Note-Management-Application)
**Demo Video:** [Click here to watch the demo video](Link_Video_Demo_Ở_Đây)

---

## ✨ OPTIONAL FEATURES (EXTRA POINTS)
Our team has implemented the following advanced features beyond the basic requirements:
1. **Real-time Collaboration:** Powered by Laravel Reverb (WebSockets) for instant note syncing and presence tracking.
2. **Progressive Web App (PWA):** Full offline support with Service Workers and intelligent caching.
3. **Secure Notes:** Industrial-grade security with password-protected notes and secure hashing.
4. **Direct Cloud Storage:** Lightning-fast media handling with direct-to-Cloudinary uploads.
5. **Asynchronous Processing:** Background Email Queue for a non-blocking user experience.

---

## 🛠 TECH STACK
- **Frontend:** React JS, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend:** Laravel 11 (PHP 8.3+), Sanctum (Authentication), Reverb (WebSocket Server).
- **Database:** MySQL / PostgreSQL.
- **Media Storage:** Cloudinary SDK.
- **Real-time:** Laravel Reverb.
- **PWA:** Service workers & LocalStorage.

---

## 🚀 INSTALLATION & SETUP

### 🐳 Option 1: Running with Docker (Recommended)
```bash
docker-compose up --build
```
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Real-time Server:** [http://localhost:8080](http://localhost:8080)

### 🛠 Option 2: Manual Installation (Reproducing from Source)
1. **Backend (/backend-php):**
   ```bash
   composer install
   php artisan key:generate
   php artisan migrate --seed
   ```
2. **Frontend (/frontend):**
   ```bash
   npm install
   ```
3. **Running (4 Terminals):**
   - Terminal 1: `php artisan serve`
   - Terminal 2: `php artisan reverb:start`
   - Terminal 3: `php artisan queue:work`
   - Terminal 4: `npm run dev`

---

## 🔑 TEST ACCOUNTS
| Role | Email | Password |
| :--- | :--- | :--- |
| **User A** | user@example.com | password123 |
| **User B** | collaborator@example.com | password123 |

---

## 📌 EVALUATION NOTES
- **Email Delivery:** Ensure `queue:work` is running. If SMTP is not configured, links are logged in `backend-php/storage/logs/laravel.log`.
- **Real-time:** Open two different browsers to observe presence avatars and live updates.
- **PWA:** Use Chrome DevTools "Offline" mode to test local persistence.

---
*Thank you for evaluating our final project!*
