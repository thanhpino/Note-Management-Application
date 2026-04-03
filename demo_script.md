# DEMO SCRIPT CHẤM THI - 28 TIÊU CHÍ RUBRIC

Sử dụng kịch bản này để chứng minh 100% các tính năng. Dùng Chrome (Mở 2 tab: 1 Thường, 1 Ẩn danh).

## 1. USER REGISTRATION & ACTIVATION (0.5 điểm)
- **Thao tác**: Vào màn hình Register. Nhập email mới, password x2.
- **Account**: Mới bất kỳ.
- **Highlight**: 
  - Form validation chặt chẽ.
  - Đăng ký xong tự động Auto-login. Banner "Account is unverified" hiện ở mọi trang. 
  - Mở console / Email check nhận link Activate. Click link tắt banner vĩnh viễn.

## 2. LOGIN, LOGOUT & PASSWORD RESET (0.5 điểm)
- **Thao tác**: Nhấn Logout. Chuyển qua Forgot Password. 
- **Account**: Account vừa tạo.
- **Highlight**:
  - OTP/Link bảo mật. Nhập mã tạo pass mới -> Chuyển luồng log-in manual mượt mà. Đăng nhập JWT cookie an toàn.

## 3. USER PROFILE, AVATAR & PREFERENCES (0.75 điểm)
- **Thao tác**: Vào Settings ("Bánh răng").
- **Account**: Owner.
- **Highlight**:
  - Giao diện Profile hiển thị thông tin.
  - Upload avatar lên Cloudinary thay đổi góc avatar lập tức.
  - Toggle Dark Mode -> Theme đảo màu ngay trên document.
  - Đổi "Note Font Size" -> Font chữ Editor phóng to. Đổi "Change Password" với current/new pass. 

## 4. LIST/GRID VIEW & SEARCH NOTES (0.5 điểm)
- **Thao tác**: Ở Dashboard, trên đỉnh có Icon List / Grid. Gõ vào thanh Search.
- **Account**: Owner.
- **Highlight**: 
  - Grid/List transition siêu êm.
  - Thanh Search là Live Debounce 300ms, tìm cả title và content, kết quả realtime ra Skeleton loading. Empty State khi search null cực đẹp!

## 5. CREATE, UPDATE & DELETE (0.75 điểm)
- **Thao tác**: Bấm "New Note". Không có nút Save. Gõ vào Editor. Sau đó chọn Delete (Thùng rác đỏ).
- **Account**: Owner.
- **Highlight**:
  - Auto-save! Header hiển thị `Saving...` sau đó là `Saved ✓`.
  - Same UI giữa Create và Edit.
  - Bấm xoá nhảy Modal Confirm.

## 6. ATTACH IMAGES TO NOTES (0.25 điểm)
- **Thao tác**: Click Icon ảnh ở Footer Note Editor.
- **Highlight**: Tải nhiều ảnh cùng lúc, lưu mảng array trên Cloudinary. Có nút Hover thùng rác gỡ ảnh.

## 7. PIN NOTES & LABEL MANAGEMENT (0.75 điểm)
- **Thao tác**: Pin 1 Note trên Dashboard. Qua Sidebar quản lý Label.
- **Highlight**: 
  - Ghim notes: Icon Pin lên góc (cả Grid/List), đẩy Note lên ưu tiên ngày Pin.
  - Label: CRUD (Thêm, Xóa, Sửa name) Sidebar mượt mà. 
  - Attach Label: Vào Note Editor, dưới Footer có dropdown chọn Label checkbox đa nhiệm.

## 8. PASSWORD PROTECTED NOTES [Better Approach] (1.0 điểm)
- **Thao tác**: Khóa 1 Note bằng Icon Ổ khóa.
- **Account**: Owner.
- **Highlight**:
  - Khóa: Cần nhập 2 lần mật khẩu.
  - Xem Note bọc Password: Lần sau load phải nhập mật khẩu để unlock Verify.
  - Đổi MK (Change) / Gỡ MK (Remove): Phải nhập Current Password (đây là điểm nhấn Better Approach!!). Icon 🔒 hiển thị ra Dashboard.

## 9. SHARED NOTES [Better Approach] (0.75 điểm)
- **Thao tác**: Bấm Share Note. Gửi "recipient@test.com" quyền Edit. Đăng nhập Recipient ở Tab ẩn danh.
- **Highlight**:
  - Validate email hệ thống.
  - Owner mở Modal ra THẤY ĐƯỢC danh sách user đã share (Better Approach).
  - Owner đổi Quyền (Edit -> Read) hoặc Thùng rác Thu Hồi trên lưới danh sách (Better Approach).
  - Recipient có dấu chấm đỏ Notification khi được nhận. Cột "Shared With Me" hiển thị đẹp.

## 10. REAL-TIME COLLABORATION (0.5 điểm)
- **Thao tác**: Mở chung Note Edit ở cả Owner và Recipient. Một bên sửa con trỏ.
- **Highlight**: Bên này gõ -> 1 giây sau bên kia tự hiện `Toast: Note updated by collaborator` và chèn nội dung êm ái mà ko cần F5. Websocket siêu tốc.

## 11. UI/UX & RESPONSIVE (0.75 điểm)
- **Thao tác**: Co kéo nhỏ trình duyệt về kích cỡ Mobile.
- **Highlight**: Sidebar gập lại, Hamburger menu. Skeleton UI xuất sắc. Toast thông báo khắp nơi. 

## 12. OFFLINE CAPABILITIES (0.5 điểm)
- **Thao tác**: Ngắt mạng Wifi hoặc vào Network -> Offline. Gõ Note. Mở lại mạng.
- **Highlight**: Note vừa gõ vẫn được thao tác offline nhờ `Dexie IndexedDB`, sau đó được `useOfflineSync` fetch lên Server ngay khi mạng có lại. PWA đẳng cấp.

## 13. ONLINE DEPLOYMENT & ĐÚNG ĐỊNH DẠNG (0.5 điểm)
- **Highlight**: Demo Docker `docker-compose.prod.yml` chạy 1 phát được luôn! Nginx setup config cực chuẩn chỉnh theo Document. Hoặc show Link Render Public Web. Mọi API trơn mượt không giựt lỗi.
