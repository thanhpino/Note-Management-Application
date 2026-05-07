# Note Management Web Application

**Sinh viên:** Trương Minh Thành  
**MSSV:** 524H0032
**Deployment URL:** https://notes.thanhminh.dev

---

## 🌟 Overview
Ứng dụng quản lý ghi chú thông minh được xây dựng trên nền tảng MERN Stack, tích hợp các công nghệ hiện đại nhất như WebSockets cho Real-time Collaboration, PWA cho Offline Capabilities, và hệ thống bảo mật Note-level Password. Giao diện được thiết kế theo phong cách hiện đại, trực quan và đáp ứng hoàn toàn trên các thiết bị di động.

## 🚀 Tính năng nổi bật (Key Features)
- **Real-time Collaboration:** Chỉnh sửa ghi chú đồng thời giữa nhiều người dùng qua Socket.io.
- **Offline Modes:** Hoạt động ngay cả khi không có mạng nhờ Service Workers và IndexedDB. Tự động đồng bộ khi Online.
- **Security:** Mã hóa mật khẩu người dùng và hỗ trợ khóa ghi chú bằng mật khẩu riêng.
- **Rich Media:** Đính kèm nhiều hình ảnh (Cloudinary), quản lý nhãn (Labels) và màu sắc ghi chú linh hoạt.
- **Modern UI/UX:** Hỗ trợ Dark Mode, Skeleton Loading và các trình hiệu ứng mượt mà.

## 🛠 Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS v4, Vite, Socket.io-client, Dexie.js.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Socket.io, Nodemailer.
- **Infrastructure:** Docker, Docker Compose, Nginx, Cloudinary API.

---

## 💻 Hướng dẫn cài đặt & Chạy dự án

### Cách 1: Sử dụng Docker Compose
Đảm bảo bạn đã cài đặt Docker và Docker Desktop.
1. Mở Terminal tại thư mục gốc của dự án.
2. Chạy lệnh:
   ```bash
   docker-compose up --build
   ```
3. Truy cập ứng dụng tại: `http://localhost`.

### Cách 2: Chạy Local (Manual)
**Yêu cầu:** Node.js v18+, MongoDB.

**1. Backend:**
```bash
cd backend
npm install
npm run dev
```
(Lưu ý: Cần cấu hình file `.env` theo mẫu `.env.example`).

**2. Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Truy cập tại: `http://localhost:5173`.

---

## 📝 Demo & Assessment
Vui lòng xem file [Rubrik_SelfAssessment.md](./Rubrik_SelfAssessment.md) để biết chi tiết 28 tiêu chí đã hoàn thành và [demo_script.md](./demo_script.md) để hỗ trợ quá trình quay video / thuyết trình.

---
*Dự án được thực hiện phục vụ mục đích học tập và nghiên cứu.*
