INTELLIGENT NOTE MANAGEMENT APPLICATION
Student: Truong Minh Thanh
ID: 524H0032
Final Project - Web Application Development

--------------------------------------------------
1. PROJECT OVERVIEW
--------------------------------------------------
The Intelligent Note Management Application is a modern platform that allows users to create, secure, and collaborate on notes in real-time.
Built with Laravel 11 (Backend) and React Vite (Frontend).

--------------------------------------------------
2. DEPLOYMENT & ACCESS
--------------------------------------------------
- Public URL: https://note-management-app.onrender.com/
- Source Code: Included in the 'source' folder.

--------------------------------------------------
3. RUNNING THE PROJECT (DOCKER)
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
4. TEST ACCOUNTS (PRE-LOADED DATA)
--------------------------------------------------
Account A (Owner):
- Email: user@example.com
- Password: password123

Account B (Collaborator):
- Email: collaborator@example.com
- Password: password123

Note: Use the "Resend Email" button on dashboard if you need to simulate email activation.

--------------------------------------------------
5. OPTIONAL FEATURES (EXTRA POINTS)
--------------------------------------------------
- Real-time Collaborative Editing (Laravel Reverb).
- Password-protected Notes (Custom Hashing).
- Cloudinary Integration (Image hosting).
- PWA & Offline Caching (Service Workers).
- Responsive Design (Glassmorphism UI).

--------------------------------------------------
6. CLEANING INSTRUCTIONS
--------------------------------------------------
The vendor/ and node_modules/ directories have been removed to reduce size.
Please run 'composer install' and 'npm install' if not using Docker.
