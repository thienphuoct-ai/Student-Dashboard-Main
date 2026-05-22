# UMS - Student Dashboard (Hệ thống Quản lý Sinh viên)

## 1. Tên đề tài
Xây dựng giao diện Frontend cho Hệ thống Quản lý Sinh viên (University Management System - UMS), phân hệ Student Dashboard.

## 2. Mô tả ngắn về chức năng website
Website là một Dashboard dành riêng cho sinh viên, giúp theo dõi quá trình học tập một cách trực quan. Các chức năng chính bao gồm:
* **Trang chủ (Dashboard):** Thống kê tỷ lệ điểm danh các môn học, hiển thị danh sách giáo viên vắng mặt, bảng tin thông báo và tính năng xem Thời khóa biểu (Timetable) thay đổi linh hoạt theo ngày.
* **Trang Lịch thi (Examination):** Cung cấp danh sách các môn thi sắp tới, thời gian và phòng thi cụ thể.
* **Trang Mật khẩu (Change Password):** Form biểu mẫu cho phép sinh viên thay đổi mật khẩu an toàn với các trạng thái focus/hover rõ ràng.

## 3. Công nghệ sử dụng
* **Framework:** Next.js (App Router)
* **Thư viện UI:** React JS
* **Ngôn ngữ:** TypeScript (TSX)
* **Styling:** CSS thuần (Global CSS, CSS Flexbox/Grid, tích hợp Responsive Media Queries)
* **Icons:** Google Material Icons Sharp

## 4. Hướng dẫn cài đặt và chạy dự án trên localhost
Để chạy dự án này trên máy cá nhân, thực hiện các bước sau:

**Bước 1:** Clone mã nguồn từ GitHub về máy
```bash
git clone https://github.com/thienphuoct-ai/Student-Dashboard-Main.git
**Bước 2:** Di chuyển vào thư mục dự án

```bash
cd [Tên-thư-mục-dự-án]
**Bước 3:** Cài đặt các thư viện cần thiết
```Bash
npm install
**Bước 4:** Khởi chạy server ở chế độ phát triển

```Bash
npm run dev

