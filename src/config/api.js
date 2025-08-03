// API Configuration
const API_CONFIG = {
  BASE_URL:
    "https://libraryapi20250714182231-dvf7buahgwdmcmg7.southeastasia-01.azurewebsites.net/",
  ENDPOINTS: {
    LOGIN: "/api/Auth/login",
    LOGOUT: "/api/Auth/logout",
    USERS: "/api/Users",
    BOOKS: "/api/Book",
    READERS: "/api/DocGia",
    BORROWS: "/api/Borrow",
    FINES: "/api/Fine",
    REPORTS: "/api/Reports",
  },
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// API Helper Functions
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const token = localStorage.getItem("token");

  console.log("=== API Request Debug ===");
  console.log("URL:", url);
  console.log("Token exists:", !!token);
  console.log("Token:", token ? token.substring(0, 20) + "..." : "No token");

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    timeout: API_CONFIG.TIMEOUT,
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    console.log("Making request with options:", {
      method: finalOptions.method || "GET",
      headers: finalOptions.headers,
      body: finalOptions.body ? "Has body" : "No body",
    });

    const response = await fetch(url, finalOptions);

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      let errorData = {};
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          const textResponse = await response.text();
          console.log("Full server error response:", textResponse);
          errorData = { message: `Server error: ${textResponse.substring(0, 200)}` };
        }
      } catch (parseError) {
        console.warn("Failed to parse error response:", parseError);
        errorData = { message: `HTTP error! status: ${response.status}` };
      }
      
      console.error("API Error Response:", errorData);
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    // Handle successful response  
    let data;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If not JSON, return as text
        data = await response.text();
        console.warn("Response is not JSON:", data.substring(0, 100));
      }
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError);
      throw new Error("Failed to parse server response. Server may be down or returning invalid data.");
    }
    
    console.log("API Response data:", data);
    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    
    // Handle network errors (backend down, connection issues)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ quản trị viên.');
    }
    
    // Handle other errors
    throw error;
  }
};

// Mock data for fallback
export const MOCK_DATA = {
  users: {
    admin: { username: "admin", role: "Admin", email: "admin@library.com" },
    librarian: {
      username: "librarian",
      role: "Librarian",
      email: "librarian@library.com",
    },
    reader: {
      username: "reader",
      role: "Reader",
      email: "reader@library.com",
    },
    reader1: {
      username: "reader1",
      role: "Reader",
      email: "reader1@library.com",
    },
    reader2: {
      username: "reader2", 
      role: "Reader",
      email: "reader2@library.com",
    },
    nguyenvana: {
      username: "nguyenvana",
      role: "Reader", 
      email: "nguyenvana@library.com",
    },
    tranvanb: {
      username: "tranvanb",
      role: "Reader",
      email: "tranvanb@library.com", 
    },
    accountant: {
      username: "accountant",
      role: "Accountant",
      email: "accountant@library.com",
    },
    warehouse: {
      username: "warehouse",
      role: "Nhân viên kho sách",
      email: "warehouse@library.com",
    },
    b367: {
      username: "b367",
      role: "Reader",
      email: "tranb@library.com",
    },
  },
  readerProfiles: {
    reader: {
      id: 1,
      name: 'Độc giả mặc định',
      email: 'reader@library.com',
      phone: '0123456789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      memberSince: '2023-01-15',
      memberId: 'R001',
      status: 'active',
      totalBorrows: 15,
      currentBorrows: 2,
      totalBooks: 12,
      overdueBooks: 1
    },
    reader1: {
      id: 2,
      name: 'Nguyễn Văn A',
      email: 'reader1@library.com',
      phone: '0123456788',
      address: '456 Đường DEF, Quận 2, TP.HCM',
      memberSince: '2023-02-20',
      memberId: 'R002',
      status: 'active',
      totalBorrows: 8,
      currentBorrows: 1,
      totalBooks: 7,
      overdueBooks: 0
    },
    reader2: {
      id: 3,
      name: 'Trần Thị B',
      email: 'reader2@library.com',
      phone: '0123456787',
      address: '789 Đường GHI, Quận 3, TP.HCM',
      memberSince: '2023-03-10',
      memberId: 'R003',
      status: 'active',
      totalBorrows: 22,
      currentBorrows: 3,
      totalBooks: 19,
      overdueBooks: 0
    },
    nguyenvana: {
      id: 4,
      name: 'Nguyễn Văn An',
      email: 'nguyenvana@library.com',
      phone: '0123456786',
      address: '321 Đường JKL, Quận 4, TP.HCM',
      memberSince: '2023-04-05',
      memberId: 'R004',
      status: 'active',
      totalBorrows: 12,
      currentBorrows: 2,
      totalBooks: 10,
      overdueBooks: 1
    },
    tranvanb: {
      id: 5,
      name: 'Trần Văn Bình',
      email: 'tranvanb@library.com',
      phone: '0123456785',
      address: '654 Đường MNO, Quận 5, TP.HCM', 
      memberSince: '2023-05-12',
      memberId: 'R005',
      status: 'active',
      totalBorrows: 6,
      currentBorrows: 1,
      totalBooks: 5,
      overdueBooks: 0
    },
    b367: {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranb@library.com',
      phone: '0987654321',
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      memberSince: '2023-02-10',
      memberId: 'R002',
      status: 'active',
      totalBorrows: 8,
      currentBorrows: 1,
      totalBooks: 5,
      overdueBooks: 0
    }
  },
  readerBorrowedBooks: {
    reader: [
      {
        id: 1,
        bookTitle: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        category: "Kỹ năng sống",
        borrowDate: "2024-01-15",
        returnDate: "2024-02-15",
        daysLeft: 5,
        status: "borrowed",
        isbn: "978-604-1-00001-1",
        location: "Kệ A1",
      },
      {
        id: 2,
        bookTitle: "Nhà Giả Kim",
        author: "Paulo Coelho",
        category: "Tiểu thuyết",
        borrowDate: "2024-01-20",
        returnDate: "2024-02-20",
        daysLeft: -5,
        status: "overdue",
        isbn: "978-604-1-00002-2",
        location: "Kệ A2",
      }
    ],
    reader1: [
      {
        id: 1,
        bookTitle: "Cách Nghĩ Để Thành Công",
        author: "Napoleon Hill",
        category: "Kinh doanh",
        borrowDate: "2024-02-01",
        returnDate: "2024-03-01",
        daysLeft: 10,
        status: "borrowed",
        isbn: "978-604-1-00003-3",
        location: "Kệ C1",
      }
    ],
    reader2: [
      {
        id: 1,
        bookTitle: "Đọc Vị Bất Kỳ Ai",
        author: "David J. Lieberman",
        category: "Tâm lý học",
        borrowDate: "2024-01-25",
        returnDate: "2024-02-25",
        daysLeft: 8,
        status: "borrowed",
        isbn: "978-604-1-00004-4",
        location: "Kệ B3",
      },
      {
        id: 2,
        bookTitle: "Sapiens: Lược Sử Loài Người",
        author: "Yuval Noah Harari",
        category: "Lịch sử",
        borrowDate: "2024-01-10",
        returnDate: "2024-02-10",
        daysLeft: -2,
        status: "overdue",
        isbn: "978-604-1-00005-5",
        location: "Kệ D1",
      },
      {
        id: 3,
        bookTitle: "Nghĩ Giàu Làm Giàu",
        author: "Napoleon Hill",
        category: "Kinh doanh",
        borrowDate: "2024-02-05",
        returnDate: "2024-03-05",
        daysLeft: 15,
        status: "borrowed",
        isbn: "978-604-1-00006-6",
        location: "Kệ C2",
      }
    ],
    nguyenvana: [
      {
        id: 1,
        bookTitle: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
        author: "Rosie Nguyễn",
        category: "Kỹ năng sống",
        borrowDate: "2024-01-12",
        returnDate: "2024-02-12",
        daysLeft: 3,
        status: "borrowed",
        isbn: "978-604-1-00007-7",
        location: "Kệ A3",
      },
      {
        id: 2,
        bookTitle: "Khởi Nghiệp Bán Lẻ",
        author: "Phillip McGraw",
        category: "Kinh doanh",
        borrowDate: "2024-01-18",
        returnDate: "2024-02-18",
        daysLeft: -1,
        status: "overdue",
        isbn: "978-604-1-00008-8",
        location: "Kệ C3",
      }
    ],
    tranvanb: [
      {
        id: 1,
        bookTitle: "Lập Trình Python Cơ Bản",
        author: "John Smith",
        category: "Công nghệ",
        borrowDate: "2024-02-10",
        returnDate: "2024-03-10",
        daysLeft: 20,
        status: "borrowed",
        isbn: "978-604-1-00009-9",
        location: "Kệ E1",
      }
    ],
    b367: [
      {
        id: 1,
        bookTitle: "Lập trình Python",
        author: "Nguyễn Văn C",
        category: "Công nghệ",
        borrowDate: "2024-01-10",
        returnDate: "2024-01-24",
        daysLeft: 8,
        status: "borrowed",
        isbn: "978-604-1-00010-5",
        location: "Kệ F1",
      }
    ]
  },
  readerBorrowHistory: {
    reader: [
      {
        id: 101,
        bookTitle: "Cách Nghĩ Để Thành Công",
        author: "Napoleon Hill",
        category: "Kinh doanh",
        borrowDate: "2023-12-01",
        returnDate: "2023-12-15",
        actualReturnDate: "2023-12-14",
        status: "returned",
        isbn: "978-604-1-00004-4",
        location: "Kệ C1",
        fine: 0,
      }
    ],
    reader1: [
      {
        id: 101,
        bookTitle: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        category: "Kỹ năng sống",
        borrowDate: "2023-11-01",
        returnDate: "2023-11-15",
        actualReturnDate: "2023-11-18",
        status: "returned_late",
        isbn: "978-604-1-00001-1",
        location: "Kệ A1",
        fine: 15000,
      },
      {
        id: 102,
        bookTitle: "Nhà Giả Kim",
        author: "Paulo Coelho",
        category: "Tiểu thuyết",
        borrowDate: "2023-12-10",
        returnDate: "2023-12-25",
        actualReturnDate: "2023-12-23",
        status: "returned",
        isbn: "978-604-1-00002-2",
        location: "Kệ A2",
        fine: 0,
      }
    ],
    reader2: [
      {
        id: 101,
        bookTitle: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        category: "Kỹ năng sống",
        borrowDate: "2023-10-01",
        returnDate: "2023-10-15",
        actualReturnDate: "2023-10-14",
        status: "returned",
        isbn: "978-604-1-00001-1",
        location: "Kệ A1",
        fine: 0,
      },
      {
        id: 102,
        bookTitle: "Cách Nghĩ Để Thành Công",
        author: "Napoleon Hill",
        category: "Kinh doanh",
        borrowDate: "2023-11-20",
        returnDate: "2023-12-05",
        actualReturnDate: "2023-12-08",
        status: "returned_late",
        isbn: "978-604-1-00003-3",
        location: "Kệ C1",
        fine: 15000,
      },
      {
        id: 103,
        bookTitle: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
        author: "Rosie Nguyễn",
        category: "Kỹ năng sống",
        borrowDate: "2023-12-15",
        returnDate: "2023-12-30",
        actualReturnDate: "2024-01-05",
        status: "returned_late",
        isbn: "978-604-1-00007-7",
        location: "Kệ A3",
        fine: 30000,
      }
    ],
    nguyenvana: [
      {
        id: 101,
        bookTitle: "Nhà Giả Kim",
        author: "Paulo Coelho",
        category: "Tiểu thuyết",
        borrowDate: "2023-09-15",
        returnDate: "2023-09-30",
        actualReturnDate: "2023-09-28",
        status: "returned",
        isbn: "978-604-1-00002-2",
        location: "Kệ A2",
        fine: 0,
      },
      {
        id: 102,
        bookTitle: "Đọc Vị Bất Kỳ Ai",
        author: "David J. Lieberman",
        category: "Tâm lý học",
        borrowDate: "2023-11-01",
        returnDate: "2023-11-16",
        actualReturnDate: "2023-11-20",
        status: "returned_late",
        isbn: "978-604-1-00004-4",
        location: "Kệ B3",
        fine: 20000,
      }
    ],
    tranvanb: [
      {
        id: 101,
        bookTitle: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        category: "Kỹ năng sống",
        borrowDate: "2023-12-20",
        returnDate: "2024-01-05",
        actualReturnDate: "2024-01-03",
        status: "returned",
        isbn: "978-604-1-00001-1",
        location: "Kệ A1",
        fine: 0,
      }
    ],
    b367: [
      {
        id: 101,
        bookTitle: "JavaScript cơ bản",
        author: "Trần Văn D",
        category: "Công nghệ",
        borrowDate: "2023-12-01",
        returnDate: "2023-12-15",
        actualReturnDate: "2023-12-15",
        status: "returned",
        isbn: "978-604-1-00011-2",
        location: "Kệ F2",
        fine: 0,
      }
    ]
  },
  readerFines: {
    reader: [
      {
        id: 1,
        bookTitle: 'Đắc Nhân Tâm',
        dueDate: '2024-01-10',
        returnDate: '2024-01-15',
        daysLate: 5,
        amount: 25000,
        reason: 'Trả sách trễ',
        status: 'pending',
        fineType: 'late_return'
      }
    ],
    reader1: [
      {
        id: 1,
        bookTitle: 'Nhà Giả Kim',
        dueDate: '2024-01-05',
        returnDate: '2024-01-08',
        daysLate: 3,
        amount: 15000,
        reason: 'Trả sách trễ',
        status: 'paid',
        fineType: 'late_return',
        paidDate: '2024-01-08'
      }
    ],
    reader2: [
      {
        id: 1,
        bookTitle: 'Cách Nghĩ Để Thành Công',
        dueDate: '2023-12-05',
        returnDate: '2023-12-08',
        daysLate: 3,
        amount: 15000,
        reason: 'Trả sách trễ',
        status: 'paid',
        fineType: 'late_return',
        paidDate: '2023-12-08'
      },
      {
        id: 2,
        bookTitle: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        dueDate: '2023-12-30',
        returnDate: '2024-01-05',
        daysLate: 6,
        amount: 30000,
        reason: 'Trả sách trễ',
        status: 'pending',
        fineType: 'late_return'
      },
      {
        id: 3,
        bookTitle: 'Sapiens: Lược Sử Loài Người',
        dueDate: '2024-02-10',
        returnDate: 'Chưa trả',
        daysLate: 2,
        amount: 10000,
        reason: 'Trả sách trễ',
        status: 'pending',
        fineType: 'late_return'
      }
    ],
    nguyenvana: [
      {
        id: 1,
        bookTitle: 'Đọc Vị Bất Kỳ Ai',
        dueDate: '2023-11-16',
        returnDate: '2023-11-20',
        daysLate: 4,
        amount: 20000,
        reason: 'Trả sách trễ',
        status: 'paid',
        fineType: 'late_return',
        paidDate: '2023-11-20'
      },
      {
        id: 2,
        bookTitle: 'Khởi Nghiệp Bán Lẻ',
        dueDate: '2024-02-18',
        returnDate: 'Chưa trả',
        daysLate: 1,
        amount: 5000,
        reason: 'Trả sách trễ',
        status: 'pending',
        fineType: 'late_return'
      }
    ],
    tranvanb: [],
    b367: []
  },
  readerReservations: {
    reader: [
      {
        maPhieuDat: 'PDT001',
        tenSach: 'Cách Nghĩ Để Thành Công',
        tacGia: 'Napoleon Hill',
        ngayDat: '2024-02-15T10:30:00',
        ngayHetHan: '2024-02-20T23:59:59',
        trangThai: 'Chờ phê duyệt',
        viTri: 'Kệ C1',
        maSach: 3,
        loaiYeuCau: 'Đặt mượn'
      }
    ],
    reader1: [
      {
        maPhieuDat: 'PDT002',
        tenSach: 'Đọc Vị Bất Kỳ Ai',
        tacGia: 'David J. Lieberman',
        ngayDat: '2024-02-10T14:20:00',
        ngayHetHan: '2024-02-17T23:59:59',
        trangThai: 'Đã xử lý',
        viTri: 'Kệ B3',
        maSach: 4
      }
    ],
    reader2: [
      {
        maPhieuDat: 'PDT003',
        tenSach: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        tacGia: 'Rosie Nguyễn',
        ngayDat: '2024-02-12T09:15:00',
        ngayHetHan: '2024-02-19T23:59:59',
        trangThai: 'Đang chờ',
        viTri: 'Kệ A3',
        maSach: 7
      },
      {
        maPhieuDat: 'PDT004',
        tenSach: 'Lập Trình Python Nâng Cao',
        tacGia: 'Mark Lutz',
        ngayDat: '2024-02-08T16:45:00',
        ngayHetHan: '2024-02-15T23:59:59',
        trangThai: 'Quá hạn',
        viTri: 'Kệ E2',
        maSach: 8
      }
    ],
    nguyenvana: [
      {
        maPhieuDat: 'PDT005',
        tenSach: 'Sapiens: Lược Sử Loài Người',
        tacGia: 'Yuval Noah Harari',
        ngayDat: '2024-02-14T11:00:00',
        ngayHetHan: '2024-02-21T23:59:59',
        trangThai: 'Đang chờ',
        viTri: 'Kệ D1',
        maSach: 5
      }
    ],
    tranvanb: [],
    b367: [
      {
        maPhieuDat: 'PDT003',
        tenSach: 'Lập trình Python',
        tacGia: 'Nguyễn Văn C',
        ngayDat: '2024-01-10T14:20:00',
        ngayHetHan: '2024-01-25T23:59:59',
        trangThai: 'Đã phê duyệt',
        viTri: 'Kệ F1',
        maSach: 10,
        loaiYeuCau: 'Đặt mượn',
        ghiChuThuThu: 'Vui lòng đến nhận sách trước 17:00'
      }
    ]
  },
  books: [
    {
      id: 1,
      title: "Đắc Nhân Tâm",
      author: "Dale Carnegie",
      category: "Kỹ năng sống",
      shelf: "Kệ A1",
      status: "Có sẵn",
      coverImage: "https://salt.tikicdn.com/cache/750x750/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg",
      description:
        "Cuốn sách kinh điển về nghệ thuật đối nhân xử thế và kỹ năng giao tiếp.",
      publishedYear: 1936,
      isbn: "978-0-671-02703-2",
    },
    {
      id: 2,
      title: "Nhà Giả Kim",
      author: "Paulo Coelho",
      category: "Tiểu thuyết",
      shelf: "Kệ B2",
      status: "Có sẵn",
      coverImage: "https://salt.tikicdn.com/cache/750x750/ts/product/45/3b/fc/07f70f3be265b0a58bbf5b159be4f905.jpg",
      description:
        "Câu chuyện về hành trình tìm kiếm kho báu và ý nghĩa cuộc sống.",
      publishedYear: 1988,
      isbn: "978-0-06-231500-7",
    },
    {
      id: 3,
      title: "Clean Code",
      author: "Robert C. Martin",
      category: "Công nghệ",
      shelf: "Kệ C3",
      status: "Đã mượn",
      coverImage: "https://m.media-amazon.com/images/I/41xShlnTZTL._SY346_.jpg",
      description: "Hướng dẫn viết code sạch và dễ bảo trì.",
      publishedYear: 2008,
      isbn: "978-0-132-35088-4",
    },
    {
      id: 4,
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      category: "Công nghệ",
      shelf: "Kệ D4",
      status: "Có sẵn",
      coverImage: "/images/book-covers/javascript.jpg",
      description: "Những phần tốt nhất của JavaScript và cách sử dụng hiệu quả.",
      publishedYear: 2008,
      isbn: "978-0-596-51774-8",
    },
    {
      id: 5,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      category: "Lịch sử",
      shelf: "Kệ E5",
      status: "Có sẵn",
      coverImage: "https://salt.tikicdn.com/cache/750x750/ts/product/e3/49/e6/1e9c937b98cd9b3b66c1edf21e2bf2b1.jpg",
      description: "Lược sử loài người từ thời tiền sử đến hiện tại.",
      publishedYear: 2011,
      isbn: "978-0-062-31609-7",
    },
    {
      id: 6,
      title: "The Design of Everyday Things",
      author: "Don Norman",
      category: "Thiết kế",
      shelf: "Kệ F6",
      status: "Có sẵn",
      coverImage: "", // Để trống để test fallback
      description: "Nguyên lý thiết kế tốt và khả năng sử dụng.",
      publishedYear: 2013,
      isbn: "978-0-465-05065-9",
    },
    {
      id: 7,
      title: "Atomic Habits",
      author: "James Clear",
      category: "Kỹ năng sống",
      shelf: "Kệ G7",
      status: "Đã đặt",
      coverImage: "invalid-url-test", // URL không hợp lệ để test error handling
      description: "Cách xây dựng thói quen tốt và loại bỏ thói quen xấu.",
      publishedYear: 2018,
      isbn: "978-0-735-21129-2",
    },
    {
      id: 8,
      title: "Python Machine Learning",
      author: "Sebastian Raschka",
      category: "Công nghệ",
      shelf: "Kệ H8",
      status: "Có sẵn",
      coverImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+TUw8L3RleHQ+PC9zdmc+", // Data URL để test
      description: "Machine Learning với Python từ cơ bản đến nâng cao.",
      publishedYear: 2019,
      isbn: "978-1-789-95569-8",
    },
    {
      id: 9,
      title: "Web Development",
      author: "Mike Johnson",
      category: "Công nghệ",
      shelf: "Kệ I9",
      status: "Đã đặt",
      coverImage: "/images/book-covers/web.jpg", // Local file
      description: "Toàn diện về phát triển web hiện đại với các công nghệ mới nhất.",
      publishedYear: 2023,
      isbn: "978-5-432-10987-6",
    },
  ],
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    return false;
  }

  // Check if token is expired and validate user data consistency
  try {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    if (tokenData.exp < currentTime) {
      console.log("Token expired, clearing authentication");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }

    // ✅ NEW: Validate token-user data consistency for security
    const userData = JSON.parse(user);
    const tokenUserId = tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    
    if (tokenUserId && userData.userId && tokenUserId.toString() !== userData.userId.toString()) {
      console.error("🚨 SECURITY: Token and user data mismatch!");
      console.log("Token User ID:", tokenUserId);
      console.log("Stored User ID:", userData.userId);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error parsing token:", error);
    return false;
  }
};

// Handle authentication errors
export const handleAuthError = (error) => {
  if (error.message.includes("401") || error.message.includes("Unauthorized")) {
    console.log("Authentication error detected, clearing tokens");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    window.location.href = "/";
    return true;
  }
  return false;
};

// Enhanced API request with authentication handling
export const authenticatedRequest = async (endpoint, options = {}) => {
  if (!isAuthenticated()) {
    console.log("User not authenticated, redirecting to login");
    window.location.href = "/";
    return;
  }

  try {
    return await apiRequest(endpoint, options);
  } catch (error) {
    if (handleAuthError(error)) {
      return;
    }
    throw error;
  }
};

export default API_CONFIG;
