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
The Intelligent Note Management Application is a modern platform that allows users to create, secure, and collaborate on notes in real-time. Built with Laravel 11 (Backend) and React Vite (Frontend).

--------------------------------------------------
2. DEPLOYMENT & ACCESS (DOCKER)
--------------------------------------------------
The project is containerized using Docker Compose.
1. Ensure Docker is running.
2. Open terminal in the root directory.
3. Run: docker-compose up --build
4. Access:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Real-time: http://localhost:8080

--------------------------------------------------
3. MANUAL INSTALLATION (4 TERMINALS)
--------------------------------------------------
If not using Docker, run these 4 terminals:

- Terminal 1 (Backend API): cd backend-php && php artisan serve
- Terminal 2 (WebSocket): cd backend-php && php artisan reverb:start
- Terminal 3 (Background Jobs): cd backend-php && php artisan queue:work
- Terminal 4 (Frontend): cd frontend && npm run dev

--------------------------------------------------
4. TEST ACCOUNTS
--------------------------------------------------
Account A (Owner):
- Email: user@example.com
- Password: password123

Account B (Collaborator):
- Email: collaborator@example.com
- Password: password123

--------------------------------------------------
5. EVALUATION NOTES
--------------------------------------------------
- Ensure 'queue:work' is running for email features.
- If real email is not configured, check logs at:
  backend-php/storage/logs/laravel.log
- Use two different browsers to test real-time collaboration features.

--------------------------------------------------
Thank you for evaluating our final project!
