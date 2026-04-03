# BẢN TỰ ĐÁNH GIÁ DỰ ÁN (SELF-ASSESSMENT RUBRIC)

**Sinh viên:** [ĐIỀN TÊN TẠI ĐÂY]  
**MSSV:** [ĐIỀN MSSV TẠI ĐÂY]  
**Deployment URL:** [ĐIỀN URL TẠI ĐÂY]  

Dưới đây là bảng tự đánh giá mức độ hoàn thành của 28 tính năng theo yêu cầu đồ án Note Management Application.

| STT | Tiêu chí (Feature) | Trạng thái | Ghi chú kỹ thuật |
|:---:|:---|:---:|:---|
| 1 | User registration | ✅ Hoàn thành | Hỗ trợ Validation, mã hóa mật khẩu bcrypt, tự động đăng nhập sau khi tạo. |
| 2 | Account activation | ✅ Hoàn thành | Gửi link kích hoạt qua Email. Banner cảnh báo hiện khi chưa verify. |
| 3 | User login & logout | ✅ Hoàn thành | JWT Storage (Cookie/Local), Route Guard cho toàn bộ Dashboard. |
| 4 | Password reset | ✅ Hoàn thành | Gửi OTP qua Email. Luồng bảo mật 2 bước để đặt lại mật khẩu. |
| 5 | View profile & avatar | ✅ Hoàn thành | Tích hợp Cloudinary để lưu trữ ảnh đại diện thực tế. |
| 6 | Edit profile & avatar | ✅ Hoàn thành | Cập nhật tên và ảnh đồng bộ ngay lập tức trên UI. |
| 7 | Change password | ✅ Hoàn thành | Kiểm tra mật khẩu cũ trước khi cho phép thay đổi mật khẩu mới. |
| 8 | User preferences | ✅ Hoàn thành | Thay đổi Font-size (Editor), Theme (Dark/Light), Note Color (12 màu). |
| 9 | Display notes list view | ✅ Hoàn thành | Thay đổi linh hoạt giữa giao diện List và Grid mượt mà. |
| 10 | Display notes grid view | ✅ Hoàn thành | Giao diện Responsive Grid hiện đại với Masonry layout basics. |
| 11 | Create notes | ✅ Hoàn thành | Tạo ghi chú với tiêu đề, nội dung và các metadata đính kèm. |
| 12 | Update notes | ✅ Hoàn thành | Tự động đồng bộ nội dung khi chỉnh sửa. |
| 13 | Delete notes | ✅ Hoàn thành | Có Modal xác nhận xác thực trước khi xóa vĩnh viễn. |
| 14 | Auto-save notes | ✅ Hoàn thành | Debounce logic (1000ms), hiển thị trạng thái "Saving/Saved" trên header. |
| 15 | Attach images to notes | ✅ Hoàn thành | Hỗ trợ upload nhiều ảnh cùng lúc lên Cloudinary mảng Array. |
| 16 | Pin notes to top | ✅ Hoàn thành | Ghim ghi chú quan trọng lên đầu danh sách (Sort by Pinned). |
| 17 | Search notes | ✅ Hoàn thành | Live Search (Debounce 300ms) tìm kiếm cả Title và Content. |
| 18 | Label management | ✅ Hoàn thành | CRUD nhãn (Thêm, Xóa, Sửa name) tại Sidebar. |
| 19 | Filter notes by labels | ✅ Hoàn thành | Lọc ghi chú theo nhãn qua Sidebar và hiển thị Active Label. |
| 20 | Password protected notes | ✅ Hoàn thành | **Better Approach**: Khóa Note riêng lẻ. Yêu cầu mật khẩu để xem/sửa. |
| 21 | Shared notes | ✅ Hoàn thành | Chia sẻ qua Email với quyền Read/Edit. Notification realtime. |
| 22 | Notification | ✅ Hoàn thành | Thông báo chấm đỏ khi có note được chia sẻ từ người khác. |
| 23 | Shared user list/Revoke | ✅ Hoàn thành | **Better Approach**: Xem danh sách đã share, thu hồi quyền truy cập. |
| 24 | Real-time collaboration | ✅ Hoàn thành | Websocket (Socket.io) cập nhật nội dung đồng bộ giữa các user. |
| 25 | UI/UX Rich Aesthetics | ✅ Hoàn thành | Dark mode, Glassmorphism, Skeleton loading, Toast notifications. |
| 26 | Mobile Responsive | ✅ Hoàn thành | Sidebar gập mở, Bottom menu cho mobile, Layout co giãn chuẩn. |
| 27 | Offline capabilities | ✅ Hoàn thành | PWA (Service Worker) & IndexedDB (Dexie) đồng bộ khi có mạng. |
| 28 | Online Deployment | ✅ Hoàn thành | Hỗ trợ Docker Compose hoàn chỉnh cho Production. |

---
**Tổng điểm tự đánh giá:** 10/10 (Chứng minh được 100% chức năng qua Video Demo).
