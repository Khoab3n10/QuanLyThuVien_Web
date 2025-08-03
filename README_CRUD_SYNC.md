# Đồng bộ hóa CRUD Frontend vs Backend

## Tổng quan

Dự án này đã được cập nhật để đồng bộ hóa hoàn toàn giữa Frontend và Backend, đảm bảo các thao tác CRUD hoạt động chính xác.

## Các thay đổi chính

### 1. API Endpoints
- ✅ Cập nhật từ `/api/Book` → `/api/Sach`
- ✅ Cập nhật từ `/api/Readers` → `/api/DocGia`
- ✅ Đồng bộ với backend controllers thực tế

### 2. Data Mapping
- ✅ Book: Mapping đúng với model `Sach` và DTO `CreateSachDto`
- ✅ Reader: Mapping đúng với model `DocGia` và DTO `CreateDocGiaDto`
- ✅ Xử lý fallback values cho các trường có thể null

### 3. Services
- ✅ `bookService.js`: Cập nhật mapping functions
- ✅ `readerService.js`: Đã có sẵn, mapping đúng
- ✅ Error handling tốt hơn

### 4. Components
- ✅ `BookManagement.js`: Sử dụng bookService
- ✅ `ReaderManagement.js`: Sử dụng readerService
- ✅ `BookModal.js`: Field names đã đúng
- ✅ `ReaderModal.js`: Cập nhật field names

## Cách sử dụng

### 1. Chạy Backend
```bash
cd LibraryBackEnd/LibraryApi
dotnet run
```

### 2. Chạy Frontend
```bash
npm start
```

### 3. Test CRUD Operations
```bash
node test-crud-sync.js
```

## API Endpoints

### Books (Sách)
- `GET /api/Sach` - Lấy danh sách sách
- `GET /api/Sach/{id}` - Lấy sách theo ID
- `POST /api/Sach` - Tạo sách mới
- `PUT /api/Sach/{id}` - Cập nhật sách
- `DELETE /api/Sach/{id}` - Xóa sách
- `GET /api/Sach/search` - Tìm kiếm sách

### Readers (Độc giả)
- `GET /api/DocGia` - Lấy danh sách độc giả
- `GET /api/DocGia/{id}` - Lấy độc giả theo ID
- `POST /api/DocGia` - Tạo độc giả mới
- `PUT /api/DocGia/{id}` - Cập nhật độc giả
- `DELETE /api/DocGia/{id}` - Xóa độc giả

## Data Models

### Book (Frontend → Backend)
```javascript
// Frontend
{
  title: "Tên sách",
  author: "Tác giả",
  isbn: "1234567890123",
  category: "Thể loại",
  publisher: "Nhà xuất bản",
  publishYear: 2024,
  quantity: 5,
  price: 150000, // Giá sách (VNĐ)
  status: "Có sẵn",
  location: "Vị trí",
  coverImage: "URL hình ảnh"
}

// Backend (CreateSachDto) - Database Azure
{
  tenSach: "Tên sách",
  tacGia: "Tác giả",
  isbn: "1234567890123",
  theLoai: "Thể loại",
  nhaXuatBan: "Nhà xuất bản",
  namXB: 2024,
  soLuong: 5,
  giaSach: 150000, // Giá sách (VNĐ)
  trangThai: "Có sẵn",
  viTriLuuTru: "Vị trí",
  anhBia: "URL hình ảnh"
}
```

### Reader (Frontend → Backend)
```javascript
// Frontend
{
  name: "Họ tên",
  birthDate: "1990-01-01",
  gender: "Nam",
  address: "Địa chỉ",
  email: "email@example.com",
  phone: "0123456789",
  memberType: "Thuong",
  membershipFee: 100000
}

// Backend (CreateDocGiaDto)
{
  hoTen: "Họ tên",
  ngaySinh: "1990-01-01",
  gioiTinh: "Nam",
  diaChi: "Địa chỉ",
  email: "email@example.com",
  sdt: "0123456789",
  loaiDocGia: "Thuong",
  phiThanhVien: 100000
}
```

## Services

### BookService
```javascript
import bookService from '../services/bookService';

// Lấy danh sách sách
const books = await bookService.getBooks();

// Tạo sách mới
const newBook = await bookService.createBook(bookData);

// Cập nhật sách
const updatedBook = await bookService.updateBook(id, bookData);

// Xóa sách
await bookService.deleteBook(id);
```

### ReaderService
```javascript
import readerService from '../services/readerService';

// Lấy danh sách độc giả
const readers = await readerService.getReaders();

// Tạo độc giả mới
const newReader = await readerService.createReader(readerData);

// Cập nhật độc giả
const updatedReader = await readerService.updateReader(id, readerData);

// Xóa độc giả
await readerService.deleteReader(id);
```

## Validation

### Book Validation
- ✅ Title: Required
- ✅ Author: Required
- ✅ ISBN: Required, format validation
- ✅ Category: Required
- ✅ Quantity: Number, positive
- ✅ Price: Number, non-negative
- ✅ Status: Enum values

### Reader Validation
- ✅ Name: Required
- ✅ Birth Date: Required, age validation (6-100)
- ✅ Gender: Required
- ✅ Email: Format validation
- ✅ Phone: Format validation (10-11 digits)
- ✅ Member Type: Required

## Error Handling

### Network Errors
```javascript
try {
  const data = await bookService.getBooks();
} catch (error) {
  console.error('Error fetching books:', error);
  // Handle error appropriately
}
```

### Validation Errors
```javascript
// Form validation in modals
if (!formData.title.trim()) {
  setErrors(prev => ({ ...prev, title: 'Title is required' }));
}
```

## Testing

### Manual Testing
1. Mở ứng dụng trong browser
2. Test các chức năng CRUD cho Book và Reader
3. Kiểm tra console để xem có lỗi không
4. Kiểm tra Network tab để xem API calls

### Automated Testing
```bash
# Chạy test script
node test-crud-sync.js
```

## Troubleshooting

### Common Issues

1. **API 404 Error**
   - Kiểm tra backend có đang chạy không
   - Kiểm tra API endpoints trong constants.js

2. **Mapping Errors**
   - Kiểm tra field names trong services
   - Đảm bảo DTOs khớp với backend

3. **CORS Errors**
   - Kiểm tra CORS configuration trong backend
   - Đảm bảo frontend và backend ports đúng

### Debug Tips

1. **Console Logging**
   ```javascript
   console.log('API Response:', data);
   console.log('Mapped Data:', mappedData);
   ```

2. **Network Tab**
   - Kiểm tra request/response headers
   - Kiểm tra request body format

3. **Backend Logs**
   - Kiểm tra console output của backend
   - Kiểm tra database queries

## Contributing

Khi thêm tính năng mới:

1. **Backend First**: Tạo model và controller trước
2. **DTO Mapping**: Đảm bảo DTOs khớp với frontend needs
3. **Service Layer**: Cập nhật services với mapping đúng
4. **Component Updates**: Cập nhật components để sử dụng services
5. **Testing**: Test cả manual và automated

## File Structure

```
src/
├── services/
│   ├── bookService.js      # Book CRUD operations
│   └── readerService.js    # Reader CRUD operations
├── utils/
│   └── constants.js        # API endpoints
├── pages/
│   ├── BookManagement.js   # Book management page
│   └── ReaderManagement.js # Reader management page
└── components/
    ├── BookModal.js        # Book form modal
    └── ReaderModal.js      # Reader form modal
```

## Status

- ✅ API Endpoints: Synchronized
- ✅ Data Mapping: Correct
- ✅ CRUD Operations: Working
- ✅ Error Handling: Improved
- ✅ Validation: Implemented
- ✅ Testing: Available

**CRUD synchronization is now complete and working correctly!** 🎉 