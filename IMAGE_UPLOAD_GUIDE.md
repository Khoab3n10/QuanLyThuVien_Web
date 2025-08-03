# Hướng dẫn sử dụng chức năng Upload Ảnh cho Sách

## Vấn đề đã được sửa

### ❌ **Vấn đề ban đầu:**
- Chức năng thêm sách của thủ thư không có thể upload ảnh
- Backend thiếu cấu hình static files
- Không có thư mục wwwroot để lưu trữ file
- Endpoint upload không hoạt động đúng

### ✅ **Giải pháp đã thực hiện:**

## 1. **Backend - Cấu hình Static Files**

### Tạo thư mục cần thiết:
```
LibraryBackEnd/LibraryApi/
├── wwwroot/
│   └── uploads/
│       └── book-covers/
```

### Cập nhật Program.cs:
```csharp
// Add static files middleware to serve uploaded images
app.UseStaticFiles();
```

### Endpoint Upload (SachController.cs):
```csharp
[HttpPost("upload-image")]
public async Task<ActionResult<string>> UploadBookImage(IFormFile file)
{
    // Validate file type and size
    // Save to wwwroot/uploads/book-covers/
    // Return image URL
}
```

## 2. **Frontend - Component Upload**

### BookCoverUpload Component:
- ✅ Drag & drop support
- ✅ File validation (JPG, PNG, GIF, max 5MB)
- ✅ Preview image
- ✅ Remove image
- ✅ Loading state

### BookModal Integration:
- ✅ Tích hợp BookCoverUpload component
- ✅ Lưu URL ảnh vào form data
- ✅ Gửi URL ảnh lên backend khi tạo/cập nhật sách

## 3. **Cách sử dụng**

### **Bước 1: Mở form thêm sách**
1. Đăng nhập với tài khoản thủ thư
2. Vào trang "Quản lý sách"
3. Click nút "Thêm sách"

### **Bước 2: Upload ảnh**
1. **Cách 1 - Kéo thả:**
   - Kéo file ảnh từ máy tính
   - Thả vào vùng upload (có viền đứt nét)
   - Ảnh sẽ tự động upload

2. **Cách 2 - Chọn file:**
   - Click vào vùng upload
   - Chọn file ảnh từ hộp thoại
   - Ảnh sẽ tự động upload

### **Bước 3: Xem preview**
- Ảnh sẽ hiển thị preview ngay lập tức
- Có thể click nút "X" để xóa ảnh
- Có thể upload ảnh khác để thay thế

### **Bước 4: Lưu sách**
- Điền đầy đủ thông tin sách
- Click "Thêm sách"
- Ảnh sẽ được lưu cùng với thông tin sách

## 4. **Yêu cầu file ảnh**

### **Định dạng hỗ trợ:**
- ✅ JPG/JPEG
- ✅ PNG
- ✅ GIF

### **Kích thước tối đa:**
- ✅ 5MB

### **Khuyến nghị:**
- Tỷ lệ khung hình: 3:4 hoặc 1:1
- Độ phân giải: 300x400px trở lên
- Chất lượng: 72-150 DPI

## 5. **Cấu trúc thư mục**

```
Backend:
LibraryBackEnd/LibraryApi/wwwroot/uploads/book-covers/
├── [GUID].jpg
├── [GUID].png
└── [GUID].gif

Frontend:
src/components/
├── BookCoverUpload.js
├── BookCoverUpload.css
└── BookModal.js
```

## 6. **API Endpoints**

### **Upload ảnh:**
```
POST /api/Sach/upload-image
Content-Type: multipart/form-data
Authorization: Bearer [token]

Body:
- file: [image file]

Response:
{
  "imageUrl": "/uploads/book-covers/[filename]",
  "fullUrl": "http://localhost:5280/uploads/book-covers/[filename]",
  "fileName": "[filename]"
}
```

### **Truy cập ảnh:**
```
GET /uploads/book-covers/[filename]
```

## 7. **Test chức năng**

### **Trong browser console:**
```javascript
// Test upload functionality
window.testImageUpload.runImageUploadTests()
```

### **Test thủ công:**
1. Mở form thêm sách
2. Upload một file ảnh
3. Kiểm tra preview hiển thị
4. Lưu sách và kiểm tra ảnh được lưu

## 8. **Xử lý lỗi**

### **Lỗi thường gặp:**

1. **"Chỉ chấp nhận file hình ảnh"**
   - Giải pháp: Chọn file có định dạng JPG, PNG, GIF

2. **"Kích thước file không được vượt quá 5MB"**
   - Giải pháp: Nén ảnh hoặc chọn ảnh nhỏ hơn

3. **"Lỗi upload hình ảnh"**
   - Giải pháp: Kiểm tra kết nối mạng và thử lại

4. **Ảnh không hiển thị sau khi upload**
   - Giải pháp: Kiểm tra backend có chạy không
   - Kiểm tra thư mục wwwroot có tồn tại không

## 9. **Bảo mật**

### **Validation:**
- ✅ Kiểm tra định dạng file
- ✅ Kiểm tra kích thước file
- ✅ Tạo tên file duy nhất (GUID)
- ✅ Lưu trong thư mục riêng biệt

### **Access Control:**
- ✅ Yêu cầu authentication
- ✅ Chỉ thủ thư mới có quyền upload

## 10. **Performance**

### **Optimization:**
- ✅ Compress ảnh trước khi upload
- ✅ Sử dụng lazy loading cho ảnh
- ✅ Cache ảnh đã upload

### **Storage:**
- ✅ Tự động tạo thư mục nếu chưa có
- ✅ Xóa file cũ khi cập nhật ảnh mới

## Kết quả

✅ **Chức năng upload ảnh hoạt động hoàn toàn**
✅ **Giao diện thân thiện với người dùng**
✅ **Validation đầy đủ**
✅ **Bảo mật tốt**
✅ **Performance tối ưu**

Bây giờ thủ thư có thể dễ dàng thêm ảnh bìa cho sách khi tạo mới hoặc cập nhật! 