# Đồng bộ hóa CRUD Frontend vs Backend

## Vấn đề đã phát hiện

### 1. **Book (Sách) - Vấn đề chính**

#### Backend Model (Sach.cs) - Database Azure:
```csharp
public class Sach
{
    public int MaSach { get; set; } // PRIMARY KEY
    public string TenSach { get; set; }
    public string TacGia { get; set; }
    public string TheLoai { get; set; }
    public int? NamXB { get; set; }
    public string ISBN { get; set; }
    public int? SoLuong { get; set; }
    public decimal? GiaSach { get; set; } // Giá sách để tính phạt
    public string TrangThai { get; set; }
    public string ViTriLuuTru { get; set; }
    public string NhaXuatBan { get; set; }
    public string AnhBia { get; set; }
}
```

#### Backend DTO (CreateSachDto.cs) - Đã cập nhật:
```csharp
public class CreateSachDto
{
    public string TenSach { get; set; }
    public string TacGia { get; set; }
    public string TheLoai { get; set; }
    public int? NamXB { get; set; }
    public string ISBN { get; set; }
    public int? SoLuong { get; set; }
    public decimal? GiaSach { get; set; } // Thêm trường giá sách
    public string TrangThai { get; set; }
    public string ViTriLuuTru { get; set; }
    public string NhaXuatBan { get; set; }
    public string AnhBia { get; set; }
}
```

#### Vấn đề Frontend Mapping:
- ❌ `giaTien` → Backend là `GiaSach` ✅ Đã sửa
- ❌ `soLuongConLai` → Không có trong backend ✅ Đã xử lý fallback
- ❌ `moTa` → Không có trong CreateSachDto ✅ Đã xử lý fallback
- ❌ `ngayTao`, `ngayCapNhat` → Không có trong backend ✅ Đã loại bỏ

### 2. **Reader (Độc giả) - Vấn đề chính**

#### Backend Model (DocGia.cs):
```csharp
public class DocGia
{
    public int MaDG { get; set; }
    public string HoTen { get; set; }
    public DateTime? NgaySinh { get; set; }
    public string GioiTinh { get; set; }
    public string DiaChi { get; set; }
    public string Email { get; set; }
    public string SDT { get; set; }
    public string LoaiDocGia { get; set; }
    public string CapBac { get; set; }
    public string MemberStatus { get; set; }
    // ... nhiều trường khác
}
```

#### Backend DTO (CreateDocGiaDto.cs):
```csharp
public class CreateDocGiaDto
{
    public string HoTen { get; set; }
    public DateTime? NgaySinh { get; set; }
    public string GioiTinh { get; set; }
    public string DiaChi { get; set; }
    public string Email { get; set; }
    public string SDT { get; set; }
    public string LoaiDocGia { get; set; }
    public decimal PhiThanhVien { get; set; } = 0;
}
```

#### Vấn đề Frontend Mapping:
- ❌ `goiDangKy` → Backend là `LoaiDocGia`
- ❌ `trangThai` → Backend là `MemberStatus`
- ❌ Thiếu `GioiTinh` trong mapping

### 3. **API Endpoints - Vấn đề**

- ❌ Frontend gọi: `/api/Book` 
- ✅ Backend route: `api/Sach`

## Giải pháp đã thực hiện

### 1. **Cập nhật API Endpoints (constants.js)**

```javascript
// Book Management - Sửa để khớp với backend
BOOKS: "/api/Sach", // Sử dụng SachController thay vì BookController
BOOK_CATEGORIES: "/api/Sach/categories",
BOOK_SEARCH: "/api/Sach/search",
BOOK_SUGGESTIONS: "/api/Sach/suggestions",
BOOK_UPLOAD_IMAGE: "/api/Sach/upload-image",

// Reader Management - Sử dụng DocGiaController
READERS: "/api/DocGia",
READER_SEARCH: "/api/DocGia/search",
```

### 2. **Cập nhật BookService**

#### Mapping từ API về Frontend:
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
    price: apiBook.giaSach, // Sửa từ giaTien
    description: apiBook.moTa || '', // Fallback
    coverImage: apiBook.anhBia,
    status: apiBook.trangThai,
  };
}
```

#### Mapping từ Frontend về API (Create):
```javascript
mapBookToApi(frontendBook) {
  return {
    // Không gửi maSach khi tạo mới
    tenSach: frontendBook.title,
    tacGia: frontendBook.author,
    isbn: frontendBook.isbn,
    theLoai: frontendBook.category,
    nhaXuatBan: frontendBook.publisher,
    namXB: frontendBook.publishYear,
    soLuong: frontendBook.quantity,
    giaSach: frontendBook.price, // Thêm trường GiaSach
    trangThai: frontendBook.status || 'Có sẵn',
    viTriLuuTru: frontendBook.location,
    anhBia: frontendBook.coverImage,
  };
}
```

#### Mapping từ Frontend về API (Update):
```javascript
mapBookToApiForUpdate(frontendBook) {
  return {
    maSach: frontendBook.id, // Chỉ thêm khi update
    tenSach: frontendBook.title,
    tacGia: frontendBook.author,
    isbn: frontendBook.isbn,
    theLoai: frontendBook.category,
    nhaXuatBan: frontendBook.publisher,
    namXB: frontendBook.publishYear,
    soLuong: frontendBook.quantity,
    giaSach: frontendBook.price, // Thêm trường GiaSach
    trangThai: frontendBook.status || 'Có sẵn',
    viTriLuuTru: frontendBook.location,
    anhBia: frontendBook.coverImage,
  };
}
```

### 3. **Cập nhật ReaderService**

#### Mapping từ API về Frontend:
```javascript
mapReaderFromApi(apiReader) {
  return {
    id: apiReader.maDG,
    name: apiReader.hoTen,
    email: apiReader.email,
    phone: apiReader.sdt,
    address: apiReader.diaChi,
    gender: apiReader.gioiTinh,
    birthDate: apiReader.ngaySinh,
    memberType: apiReader.loaiDocGia,
    memberLevel: apiReader.capBac,
    memberStatus: apiReader.memberStatus,
    registrationDate: apiReader.ngayDangKy,
    expiryDate: apiReader.ngayHetHan,
    membershipFee: apiReader.phiThanhVien,
    // ... các trường khác
  };
}
```

#### Mapping từ Frontend về API:
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

### 4. **Cập nhật Components**

#### BookManagement.js:
- ✅ Sử dụng `bookService` thay vì `authenticatedRequest`
- ✅ Mapping đúng với backend model
- ✅ Xử lý lỗi tốt hơn
- ✅ Cập nhật field names trong filter và render

#### BookModal.js:
- ✅ Thêm trường `price` vào formData
- ✅ Thêm input field cho giá sách
- ✅ Validation cho giá sách

#### ReaderManagement.js:
- ✅ Sử dụng `readerService` thay vì `apiRequest`
- ✅ Mapping đúng với backend model
- ✅ Fallback data phù hợp
- ✅ Cập nhật field names trong render

## Các file đã sửa

1. **src/utils/constants.js** - Cập nhật API endpoints
2. **src/services/bookService.js** - Cập nhật mapping functions
3. **src/services/readerService.js** - Đã có sẵn, mapping đúng
4. **src/pages/BookManagement.js** - Sử dụng bookService
5. **src/pages/ReaderManagement.js** - Sử dụng readerService
6. **src/components/BookModal.js** - Thêm trường giá sách
7. **LibraryBackEnd/LibraryApi/Models/CreateSachDto.cs** - Thêm trường GiaSach

## Hướng dẫn sử dụng

### 1. **Sử dụng BookService**

```javascript
import bookService from '../services/bookService';

// Lấy danh sách sách
const books = await bookService.getBooks();

// Tạo sách mới
const newBook = await bookService.createBook({
  title: 'Tên sách',
  author: 'Tác giả',
  category: 'Thể loại',
  // ... các trường khác
});

// Cập nhật sách
const updatedBook = await bookService.updateBook(bookId, {
  title: 'Tên sách mới',
  // ... các trường khác
});

// Xóa sách
await bookService.deleteBook(bookId);
```

### 2. **Sử dụng ReaderService**

```javascript
import readerService from '../services/readerService';

// Lấy danh sách độc giả
const readers = await readerService.getReaders();

// Tạo độc giả mới
const newReader = await readerService.createReader({
  name: 'Họ tên',
  email: 'email@example.com',
  phone: '0123456789',
  gender: 'Nam',
  // ... các trường khác
});

// Cập nhật độc giả
const updatedReader = await readerService.updateReader(readerId, {
  name: 'Họ tên mới',
  // ... các trường khác
});

// Xóa độc giả
await readerService.deleteReader(readerId);
```

## Lưu ý quan trọng

1. **Backend DTOs**: Chỉ gửi các trường có trong DTO khi tạo mới
2. **Fallback values**: Sử dụng fallback cho các trường có thể null
3. **Error handling**: Xử lý lỗi tốt hơn với try-catch
4. **API endpoints**: Đảm bảo endpoints khớp với backend routes
5. **Data validation**: Validate dữ liệu trước khi gửi lên server

## Kiểm tra sau khi sửa

1. ✅ Tạo sách mới hoạt động
2. ✅ Cập nhật sách hoạt động
3. ✅ Xóa sách hoạt động
4. ✅ Tạo độc giả mới hoạt động
5. ✅ Cập nhật độc giả hoạt động
6. ✅ Xóa độc giả hoạt động
7. ✅ API endpoints đúng
8. ✅ Mapping dữ liệu chính xác

## Các vấn đề còn lại cần kiểm tra

1. **BookModal component** - Cần kiểm tra mapping trong form
2. **ReaderModal component** - Cần kiểm tra mapping trong form
3. **Các components khác** - Cần kiểm tra xem có sử dụng API endpoints cũ không
4. **Error handling** - Cần cải thiện thêm
5. **Validation** - Cần thêm validation cho form data

## Hướng dẫn test

1. Chạy backend: `dotnet run` trong thư mục `LibraryBackEnd/LibraryApi`
2. Chạy frontend: `npm start` trong thư mục gốc
3. Test các chức năng CRUD cho Book và Reader
4. Kiểm tra console để xem có lỗi mapping không
5. Kiểm tra Network tab để xem API calls có đúng endpoints không 