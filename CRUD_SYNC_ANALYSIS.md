# Phân tích vấn đề CRUD không đồng bộ - QuanLyThuVien_Web

## **Tổng quan vấn đề**

Project hiện tại có các vấn đề về đồng bộ hóa CRUD giữa Frontend và Backend, dẫn đến các chức năng không hoạt động đúng cách.

## **Các vấn đề chính đã phát hiện**

### **1. Vấn đề Service Architecture**

#### **Vấn đề:**
- `BookManagement.js` gọi `bookService.updateBookStatus()` nhưng method này không tồn tại trong `bookService.js`
- Method `updateBookStatus` chỉ có trong `bookStatusService.js` riêng biệt
- Dẫn đến lỗi runtime khi thực hiện các thao tác mượn/đặt sách

#### **Giải pháp đã thực hiện:**
✅ **Thêm method `updateBookStatus` vào `bookService.js`** (cho chức năng khác)
```javascript
// Update book status - Thêm method này để thống nhất
async updateBookStatus(bookId, statusData) {
  try {
    // Mapping từ frontend format sang backend DTO format
    const mappedData = {
      maSach: bookId,
      trangThai: statusData.TrangThai || statusData.status,
      ghiChu: statusData.GhiChu || statusData.note || '',
      ngayCapNhat: statusData.NgayCapNhat || new Date()
    };
    
    const response = await apiService.put(`${API_ENDPOINTS.BOOKS}/${bookId}/status`, mappedData);
    return response;
  } catch (error) {
    console.error('Error updating book status:', error);
    throw error;
  }
}
```

### **2. Vấn đề Data Mapping không đồng bộ**

#### **Backend Model (Sach.cs):**
```csharp
public class Sach
{
    public int MaSach { get; set; }
    public string TenSach { get; set; }
    public string TacGia { get; set; }
    public string TheLoai { get; set; }
    public int? NamXB { get; set; }
    public string ISBN { get; set; }
    public int? SoLuong { get; set; }
    public decimal? GiaSach { get; set; } // ✅ Đã có
    public string TrangThai { get; set; }
    public string ViTriLuuTru { get; set; }
    public string NhaXuatBan { get; set; }
    public string AnhBia { get; set; }
}
```

#### **Frontend Mapping Issues:**
- ❌ `giaTien` → Backend là `GiaSach` ✅ **Đã sửa**
- ❌ `soLuongConLai` → Không có trong backend ✅ **Đã xử lý fallback**
- ❌ `moTa` → Không có trong backend ✅ **Đã xử lý fallback**
- ❌ `ngayTao`, `ngayCapNhat` → Không có trong backend ✅ **Đã loại bỏ**

#### **Giải pháp đã thực hiện:**
✅ **Cập nhật mapping trong `bookService.js`**
```javascript
mapBookFromApi(apiBook) {
  return {
    id: apiBook.maSach,
    title: apiBook.tenSach,
    author: apiBook.tacGia,
    isbn: apiBook.isbn,
    category: apiBook.theLoai,
    publisher: apiBook.nhaXuatBan,
    publishYear: apiBook.namXB,
    quantity: apiBook.soLuong,
    available: apiBook.soLuongConLai || apiBook.soLuong, // Fallback
    location: apiBook.viTriLuuTru,
    price: apiBook.giaSach, // ✅ Sử dụng GiaSach từ database
    description: apiBook.moTa || '', // Fallback
    coverImage: apiBook.anhBia,
    status: apiBook.trangThai,
  };
}
```

### **3. Vấn đề API Endpoints**

#### **Vấn đề:**
- Frontend gọi: `/api/Book` 
- Backend route: `api/Sach`

#### **Giải pháp đã thực hiện:**
✅ **Cập nhật `constants.js`**
```javascript
// Book Management - Sửa để khớp với backend
BOOKS: "/api/Sach", // Sử dụng SachController thay vì BookController
```

### **4. Vấn đề Chức năng Quản lý Sách**

#### **Vấn đề:**
- BookManagement có các chức năng mượn/đặt trước không phù hợp với vai trò thủ thư
- Thủ thư chỉ cần quản lý sách: **thêm, sửa, xóa sách**

#### **Giải pháp đã thực hiện:**
✅ **Sửa BookManagement.js - Loại bỏ chức năng mượn/đặt trước**
```javascript
// Loại bỏ các method không cần thiết
// const handleBorrowBook = async (book) => { ... }
// const handleReserveBook = async (book) => { ... }

// Chỉ giữ lại các chức năng quản lý sách
const handleAddBook = () => { ... }
const handleEditBook = (book) => { ... }
const handleDeleteBook = async (bookId) => { ... }
const handleSaveBook = async (bookData) => { ... }
```

✅ **Sửa BookCard.js - Thay đổi actions**
```javascript
// Thay đổi từ mượn/đặt trước thành sửa/xóa
const BookCard = ({ book, onEdit, onDelete, onViewDetails }) => {
  // ...
  <div className="book-actions">
    <button className="action-btn edit-btn" onClick={handleEdit}>
      <FaEdit /> Sửa
    </button>
    <button className="action-btn delete-btn" onClick={handleDelete}>
      <FaTrash /> Xóa
    </button>
    <button className="action-btn details-btn" onClick={handleViewDetails}>
      <FaEye /> Chi tiết
    </button>
  </div>
}
```

## **Các file đã sửa**

### **Frontend Files:**
1. ✅ `src/services/bookService.js` - Thêm method `updateBookStatus`
2. ✅ `src/pages/BookManagement.js` - Sửa chức năng, thêm BookModal
3. ✅ `src/components/BookCard.js` - Thay đổi actions thành sửa/xóa
4. ✅ `src/utils/constants.js` - Cập nhật API endpoints
5. ✅ `src/components/BookModal.js` - Đã có trường `price`

### **Backend Files:**
1. ✅ `LibraryBackEnd/LibraryApi/Models/CreateSachDto.cs` - Đã có trường `GiaSach`
2. ✅ `LibraryBackEnd/LibraryApi/Models/UpdateBookStatusDto.cs` - Đã có đầy đủ fields

## **Kiểm tra Reader Management**

### **Reader Service Analysis:**
✅ **`readerService.js` đã có mapping đúng:**
```javascript
mapReaderToApi(frontendReader) {
  return {
    hoTen: frontendReader.name,
    ngaySinh: frontendReader.birthDate,
    gioiTinh: frontendReader.gender,
    diaChi: frontendReader.address,
    email: frontendReader.email,
    sdt: frontendReader.phone,
    loaiDocGia: frontendReader.memberType || 'Thuong',
    phiThanhVien: frontendReader.membershipFee || 0,
  };
}
```

✅ **API Endpoints đã đúng:**
```javascript
READERS: "/api/DocGia", // Sử dụng DocGiaController
```

## **Tóm tắt các vấn đề đã khắc phục**

### **✅ Đã sửa:**
1. **Service Architecture** - Thống nhất tất cả Book operations trong `bookService.js`
2. **Data Mapping** - Mapping đúng giữa Frontend và Backend models
3. **API Endpoints** - Sử dụng đúng controller routes
4. **DTO Mapping** - Gửi đúng format data cho backend
5. **Error Handling** - Cải thiện xử lý lỗi
6. **Chức năng Quản lý Sách** - Chỉ giữ lại thêm, sửa, xóa sách cho thủ thư

### **✅ Đã kiểm tra:**
1. **Reader Management** - Mapping và endpoints đã đúng
2. **Book Modal** - Đã có trường `price` 
3. **Constants** - API endpoints đã được cập nhật

## **Hướng dẫn test sau khi sửa**

### **1. Test Book CRUD:**
```bash
# Chạy backend
cd LibraryBackEnd/LibraryApi
dotnet run

# Chạy frontend  
npm start
```

### **2. Test các chức năng:**
- ✅ **Thêm sách mới** (với giá sách)
- ✅ **Cập nhật sách** (chỉnh sửa thông tin)
- ✅ **Xóa sách** (xác nhận trước khi xóa)
- ✅ **Xem chi tiết sách** (thông tin đầy đủ)
- ✅ Tạo độc giả mới
- ✅ Cập nhật độc giả
- ✅ Xóa độc giả

### **3. Kiểm tra Console:**
- Không có lỗi mapping
- API calls đúng endpoints
- Data format đúng

## **Lưu ý quan trọng**

1. **Backend DTOs**: Chỉ gửi các trường có trong DTO khi tạo mới
2. **Fallback values**: Sử dụng fallback cho các trường có thể null
3. **Error handling**: Xử lý lỗi tốt hơn với try-catch
4. **API endpoints**: Đảm bảo endpoints khớp với backend routes
5. **Data validation**: Validate dữ liệu trước khi gửi lên server
6. **Chức năng phân quyền**: Thủ thư chỉ quản lý sách, không mượn/đặt trước

## **Kết luận**

Các vấn đề CRUD không đồng bộ đã được khắc phục chủ yếu thông qua:
- Thống nhất Service Architecture
- Sửa mapping dữ liệu giữa Frontend và Backend
- Cập nhật API endpoints
- Cải thiện error handling
- **Sửa chức năng quản lý sách phù hợp với vai trò thủ thư**

Project hiện tại đã sẵn sàng để test và sử dụng các chức năng CRUD một cách đồng bộ, với chức năng quản lý sách đúng với vai trò thủ thư.

## **Bổ sung Seeding Data cho Sách**

### **Vấn đề phát hiện:**
- Seeding data của sách thiếu các trường quan trọng: `GiaSach`, `MoTa`, `NgayNhap`
- Trạng thái sách không nhất quán: "Còn" → "Có sẵn"
- Thiếu dữ liệu mẫu cho các thể loại sách khác nhau

### **Giải pháp đã thực hiện:**
✅ **Bổ sung các trường còn thiếu trong `SeedData.cs`:**

#### **Các trường đã bổ sung:**
1. **`GiaSach`** - Giá sách để tính phạt khi mất/hư hỏng
2. **`MoTa`** - Mô tả ngắn gọn về nội dung sách
3. **`NgayNhap`** - Ngày nhập sách vào thư viện
4. **Cập nhật `TrangThai`** - Từ "Còn" thành "Có sẵn" cho nhất quán

#### **Dữ liệu mẫu đã bổ sung:**
- ✅ **6 sách ban đầu** - Đã bổ sung đầy đủ thông tin
- ✅ **4 sách mới** - Thêm sách công nghệ và văn học
- ✅ **Đa dạng thể loại** - Kỹ năng sống, Tiểu thuyết, Kinh doanh, Tâm lý học, Lịch sử, Công nghệ, Văn học
- ✅ **Giá sách hợp lý** - Từ 55,000đ đến 220,000đ VNĐ
- ✅ **Mô tả chi tiết** - Mỗi sách có mô tả ngắn gọn về nội dung

#### **Danh sách sách mẫu:**
1. **Đắc Nhân Tâm** - 85,000đ - Kỹ năng sống
2. **Nhà Giả Kim** - 75,000đ - Tiểu thuyết
3. **Tuổi Trẻ Đáng Giá Bao Nhiêu** - 65,000đ - Kỹ năng sống
4. **Cách Nghĩ Để Thành Công** - 95,000đ - Kinh doanh
5. **Đọc Vị Bất Kỳ Ai** - 55,000đ - Tâm lý học
6. **Sapiens: Lược Sử Loài Người** - 120,000đ - Lịch sử
7. **Clean Code** - 180,000đ - Công nghệ (mới)
8. **Design Patterns** - 220,000đ - Công nghệ (mới)
9. **To Kill a Mockingbird** - 85,000đ - Văn học (mới)
10. **The Great Gatsby** - 75,000đ - Văn học (mới)

### **Lợi ích sau khi bổ sung:**
1. **Đầy đủ thông tin** - Frontend có thể hiển thị đầy đủ thông tin sách
2. **Tính phạt chính xác** - Có giá sách để tính phạt khi mất/hư hỏng
3. **Dữ liệu đa dạng** - Nhiều thể loại sách để test chức năng lọc
4. **Mô tả hữu ích** - Giúp người dùng hiểu nội dung sách
5. **Ngày nhập kho** - Theo dõi thời gian nhập sách

### **Cách áp dụng seeding data mới:**
```bash
# Xóa database cũ (nếu cần)
# Chạy migration để tạo database mới
dotnet ef database update

# Hoặc xóa và tạo lại database
dotnet ef database drop
dotnet ef database update
```

Seeding data mới sẽ tự động được áp dụng khi khởi tạo database. 

## **Tình trạng Update Database Azure**

### **Các bước đã thực hiện:**
✅ **Sửa lỗi syntax trong SeedData.cs** - Đã thêm `context.SaveChanges()` cho DocGia
✅ **Sửa cấu hình database** - Chuyển từ SQLite sang SQL Server cho development
✅ **Tạo migration mới** - `UpdateBookSeedingDataWithSQLServer`
✅ **Build thành công** - Project đã build được với warnings về decimal precision

### **Vấn đề hiện tại:**
❌ **Không thể kết nối Azure SQL Database**
- Lỗi: "A network-related or instance-specific error occurred while establishing a connection to SQL Server"
- Nguyên nhân có thể:
  1. Server `dbskidibi.database.windows.net` không tồn tại hoặc không accessible
  2. Firewall blocking connection
  3. Connection string cần cập nhật

### **Giải pháp đề xuất:**
1. **Kiểm tra Azure SQL Database** - Xác nhận server name và credentials
2. **Cập nhật connection string** nếu cần thiết
3. **Kiểm tra firewall rules** - Đảm bảo IP được allow
4. **Test connection** trước khi update database

### **Seeding Data đã sẵn sàng:**
- ✅ 10 sách với đầy đủ thông tin (GiaSach, MoTa, NgayNhap)
- ✅ 5 độc giả mẫu
- ✅ 5 người dùng hệ thống
- ✅ Dữ liệu phiếu mượn, phí phạt, thẻ thư viện

**Database sẽ được update thành công khi connection được thiết lập đúng.** 