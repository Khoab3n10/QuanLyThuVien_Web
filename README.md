# Hệ Thống Quản Lý Thư Viện

Ứng dụng web quản lý thư viện được xây dựng bằng ReactJS với hai giao diện riêng biệt cho Admin và Độc giả.

## 🎯 **Tính năng chính**

### 👨‍💼 **Giao diện Admin** (`/`)
- **Dashboard tổng quan** với thống kê và biểu đồ
- **Quản lý sách** - CRUD đầy đủ, tìm kiếm, phân loại
- **Quản lý độc giả** - Đăng ký, cập nhật thông tin
- **Quản lý mượn trả** - Tạo phiếu, theo dõi quá hạn
- **Thống kê chi tiết** và báo cáo

### 👤 **Giao diện Độc giả** (`/reader`)
- **Trang chủ cá nhân** với thông tin và thống kê
- **Tìm kiếm sách** với bộ lọc nâng cao
- **Sách của tôi** - Quản lý sách đang mượn
- **Lịch sử mượn** - Xem lại các lượt mượn trả
- **Thông tin cá nhân** - Cập nhật profile

## 🚀 **Cài đặt và chạy**

### Yêu cầu hệ thống
- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại: http://localhost:3000

### Chuyển đổi giữa giao diện
- **Admin**: Truy cập `/` hoặc click "Chuyển sang Admin" từ sidebar độc giả
- **Độc giả**: Truy cập `/reader` hoặc click "Chuyển sang Độc giả" từ sidebar admin

## 📁 **Cấu trúc dự án**

```
src/
├── components/              # Components tái sử dụng
│   ├── Sidebar.js          # Thanh điều hướng (tự động chuyển đổi)
│   ├── BookModal.js        # Modal thêm/sửa sách
│   ├── ReaderModal.js      # Modal thêm/sửa độc giả
│   └── BorrowModal.js      # Modal thêm/sửa phiếu mượn
├── pages/                  # Trang Admin
│   ├── Dashboard.js        # Dashboard tổng quan
│   ├── BookManagement.js   # Quản lý sách
│   ├── ReaderManagement.js # Quản lý độc giả
│   └── BorrowManagement.js # Quản lý mượn trả
├── pages/reader/           # Trang Độc giả
│   ├── ReaderHome.js       # Trang chủ độc giả
│   ├── ReaderSearch.js     # Tìm kiếm sách
│   ├── ReaderMyBooks.js    # Sách đang mượn
│   ├── ReaderHistory.js    # Lịch sử mượn
│   └── ReaderProfile.js    # Thông tin cá nhân
├── App.js                  # Component chính với routing
├── index.js                # Entry point
└── index.css               # CSS global
```

## 🎨 **Tính năng giao diện**

### **Giao diện Admin**
- 🎛️ **Dashboard** với thống kê trực quan
- 📚 **Quản lý sách** với tìm kiếm và lọc
- 👥 **Quản lý độc giả** với thông tin chi tiết
- 🔄 **Quản lý mượn trả** với theo dõi quá hạn
- 📊 **Báo cáo** và thống kê chi tiết

### **Giao diện Độc giả**
- 🏠 **Trang chủ** với thông tin cá nhân
- 🔍 **Tìm kiếm sách** với bộ lọc nâng cao
- 📖 **Sách của tôi** với quản lý mượn trả
- 📅 **Lịch sử mượn** với thống kê chi tiết
- 👤 **Thông tin cá nhân** với chỉnh sửa inline

## 🛠️ **Công nghệ sử dụng**

- **React 18** - Framework JavaScript
- **React Router** - Điều hướng và routing
- **React Icons** - Icon library
- **CSS3** - Styling và responsive design
- **HTML5** - Markup

## 📱 **Responsive Design**

- 🎨 **Thiết kế hiện đại** với gradient và shadow
- 📱 **Mobile-first** responsive design
- ⚡ **Performance** tối ưu
- 🔍 **Tìm kiếm** nhanh chóng và chính xác
- 📊 **Thống kê** trực quan với badges
- 🎯 **UX/UI** thân thiện với người dùng

## 🔄 **Luồng hoạt động**

### **Admin**
1. **Dashboard** → Xem tổng quan hệ thống
2. **Quản lý sách** → Thêm, sửa, xóa sách
3. **Quản lý độc giả** → Đăng ký và quản lý độc giả
4. **Quản lý mượn trả** → Tạo phiếu và theo dõi

### **Độc giả**
1. **Trang chủ** → Xem thông tin cá nhân và sách đang mượn
2. **Tìm kiếm sách** → Tìm và yêu cầu mượn sách
3. **Sách của tôi** → Quản lý sách đang mượn
4. **Lịch sử mượn** → Xem lại các lượt mượn trả
5. **Thông tin cá nhân** → Cập nhật profile

## 🎯 **Tính năng nổi bật**

### **Giao diện Admin**
- ✅ **CRUD đầy đủ** cho sách, độc giả, mượn trả
- ✅ **Tìm kiếm và lọc** nâng cao
- ✅ **Thống kê real-time** với dashboard
- ✅ **Theo dõi quá hạn** với highlight
- ✅ **Modal forms** với validation

### **Giao diện Độc giả**
- ✅ **Tìm kiếm sách** với bộ lọc thể loại
- ✅ **Yêu cầu mượn sách** trực tuyến
- ✅ **Quản lý sách đang mượn** với gia hạn
- ✅ **Lịch sử chi tiết** với thống kê
- ✅ **Cập nhật thông tin** inline

## 🚀 **Tùy chỉnh**

### **Thay đổi theme**
Chỉnh sửa file `src/index.css` để thay đổi màu sắc và style.

### **Thêm tính năng mới**
- Tạo component mới trong `components/`
- Thêm route mới trong `App.js`
- Tạo page mới trong `pages/` hoặc `pages/reader/`

### **Tích hợp backend**
- Thay thế mock data bằng API calls
- Thêm authentication và authorization
- Tích hợp real-time notifications

## 📝 **Lưu ý**

- Dữ liệu hiện tại là mock data, cần tích hợp với backend thực tế
- Có thể thêm authentication và authorization
- Có thể mở rộng thêm tính năng báo cáo, xuất PDF
- Responsive design đã được tối ưu cho mobile
- Có thể thêm dark mode và theme switching
