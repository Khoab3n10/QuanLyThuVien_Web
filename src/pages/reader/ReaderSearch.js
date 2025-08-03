import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaBook,
  FaUser,
  FaCalendar,
  FaMapMarkerAlt,
  FaTimes,
  FaFilter,
  FaImage,
  FaCog,
  FaSort,
  FaClock,
} from "react-icons/fa";
import { useToast } from "../../hooks";
import reservationService from "../../services/reservationService";
import "./ReaderSearch.css";

const ReaderSearch = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Search and filter state
  const [searchForm, setSearchForm] = useState({
    searchTerm: "", // Main search term for all fields
    tenSach: "",
    tacGia: "",
    isbn: "",
    theLoai: "",
    namXuatBan: "",
    nhaXuatBan: "",
    trangThai: "",
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [reserving, setReserving] = useState({});

  const { showToast } = useToast();

  const categories = [
    "Tất cả",
    "Kỹ năng sống",
    "Tiểu thuyết",
    "Kinh doanh",
    "Tâm lý học",
    "Khoa học",
    "Lịch sử",
    "Văn học",
    "Giáo dục",
    "Công nghệ",
  ];

  const years = [
    "Tất cả",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
  ];

  const publishers = [
    "Tất cả",
    "NXB Tổng hợp TP.HCM",
    "NXB Văn học",
    "NXB Hội nhà văn",
    "NXB Lao động",
    "NXB Thế giới",
    "NXB Trẻ",
    "NXB Kim Đồng",
  ];

  const statusOptions = ["Tất cả", "Có sẵn", "Còn ít", "Hết sách"];

  const sortOptions = [
    { value: "title", label: "Tên sách" },
    { value: "author", label: "Tác giả" },
    { value: "year", label: "Năm xuất bản" },
    { value: "available", label: "Số lượng có sẵn" },
  ];

  // API URLs
  const apiUrl = "http://localhost:5280/api/Sach";
  const searchApiUrl = "http://localhost:5280/api/Sach/search";
  const suggestionsApiUrl = "http://localhost:5280/api/Sach/suggestions";

  // Load books from API
  useEffect(() => {
    fetchBooks();
  }, []);

  // Apply filters and sorting when data changes
  useEffect(() => {
    applyFiltersAndSort();
  }, [books, searchForm, sortBy, sortOrder]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl);
      const data = await response.json();

      const mappedBooks = data.map((book) => ({
        id: book.maSach,
        title: book.tenSach,
        author: book.tacGia,
        isbn: book.isbn,
        category: book.theLoai,
        publisher: book.nhaXuatBan || "Không có thông tin",
        publishYear: book.namXB,
        quantity: book.soLuong,
        available: book.soLuongConLai,
        location: book.viTriLuuTru,
        description: book.moTa || "Không có mô tả",
        coverImage: book.anhBia || "/images/default-book-cover.jpg",
      }));

      setBooks(mappedBooks);
    } catch (error) {
      console.error("Lỗi khi tải sách:", error);
      // Fallback to mock data if API fails
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  const applyFiltersAndSort = () => {
    let filtered = [...books];

    // Apply main search term to all searchable fields
    if (searchForm.searchTerm) {
      const searchLower = searchForm.searchTerm.toLowerCase();
      filtered = filtered.filter((book) => {
        return (
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower) ||
          book.isbn.includes(searchForm.searchTerm) ||
          book.category.toLowerCase().includes(searchLower) ||
          book.publisher.toLowerCase().includes(searchLower) ||
          book.location.toLowerCase().includes(searchLower) ||
          book.description.toLowerCase().includes(searchLower) ||
          book.publishYear?.toString().includes(searchForm.searchTerm)
        );
      });
    }

    // Apply specific field filters (for advanced search)
    if (searchForm.tenSach) {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(searchForm.tenSach.toLowerCase())
      );
    }

    if (searchForm.tacGia) {
      filtered = filtered.filter((book) =>
        book.author.toLowerCase().includes(searchForm.tacGia.toLowerCase())
      );
    }

    if (searchForm.isbn) {
      filtered = filtered.filter((book) => book.isbn.includes(searchForm.isbn));
    }

    if (searchForm.theLoai && searchForm.theLoai !== "Tất cả") {
      filtered = filtered.filter(
        (book) => book.category === searchForm.theLoai
      );
    }

    if (searchForm.namXuatBan && searchForm.namXuatBan !== "Tất cả") {
      filtered = filtered.filter(
        (book) => book.publishYear?.toString() === searchForm.namXuatBan
      );
    }

    if (searchForm.nhaXuatBan && searchForm.nhaXuatBan !== "Tất cả") {
      filtered = filtered.filter(
        (book) => book.publisher === searchForm.nhaXuatBan
      );
    }

    // Apply status filter
    if (searchForm.trangThai && searchForm.trangThai !== "Tất cả") {
      filtered = filtered.filter((book) => {
        const total = book.total || book.quantity;
        const available = book.available;

        switch (searchForm.trangThai) {
          case "Có sẵn":
            return available > 0 && available >= total * 0.3;
          case "Còn ít":
            return available > 0 && available < total * 0.3;
          case "Hết sách":
            return available === 0;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "author":
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case "year":
          aValue = a.publishYear;
          bValue = b.publishYear;
          break;
        case "available":
          aValue = a.available;
          bValue = b.available;
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredBooks(filtered);
  };

  // Fetch search suggestions from API
  const fetchSuggestions = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${suggestionsApiUrl}?q=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      setSearchSuggestions(data);
    } catch (error) {
      console.error("Lỗi khi tải gợi ý:", error);
      // Fallback to local suggestions
      generateLocalSuggestions(searchTerm);
    }
  };

  // Generate local suggestions as fallback
  const generateLocalSuggestions = (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchSuggestions([]);
      return;
    }

    const suggestions = [];
    const searchLower = searchTerm.toLowerCase();

    // Search in titles
    books.forEach((book) => {
      if (
        book.title.toLowerCase().includes(searchLower) &&
        !suggestions.some((s) => s.text === book.title)
      ) {
        suggestions.push({ text: book.title, type: "Tên sách" });
      }
    });

    // Search in authors
    books.forEach((book) => {
      if (
        book.author.toLowerCase().includes(searchLower) &&
        !suggestions.some((s) => s.text === book.author)
      ) {
        suggestions.push({ text: book.author, type: "Tác giả" });
      }
    });

    // Search in ISBN
    books.forEach((book) => {
      if (
        book.isbn.includes(searchTerm) &&
        !suggestions.some((s) => s.text === book.isbn)
      ) {
        suggestions.push({ text: book.isbn, type: "ISBN" });
      }
    });

    // Search in categories
    books.forEach((book) => {
      if (
        book.category.toLowerCase().includes(searchLower) &&
        !suggestions.some((s) => s.text === book.category)
      ) {
        suggestions.push({ text: book.category, type: "Thể loại" });
      }
    });

    // Search in publishers
    books.forEach((book) => {
      if (
        book.publisher.toLowerCase().includes(searchLower) &&
        !suggestions.some((s) => s.text === book.publisher)
      ) {
        suggestions.push({ text: book.publisher, type: "Nhà xuất bản" });
      }
    });

    setSearchSuggestions(suggestions.slice(0, 8));
  };

  // Handle search input change
  const handleSearchChange = (field, value) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Generate suggestions for main search field
    if (field === "searchTerm") {
      fetchSuggestions(value);
      setShowSuggestions(value.length > 0);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchForm((prev) => ({
      ...prev,
      searchTerm: suggestion.text,
    }));
    setShowSuggestions(false);
  };

  // Handle form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchForm({
      searchTerm: "",
      tenSach: "",
      tacGia: "",
      isbn: "",
      theLoai: "",
      namXuatBan: "",
      nhaXuatBan: "",
      trangThai: "",
    });
    setSortBy("title");
    setSortOrder("asc");
    setSearchSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowSuggestions(false);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleReserveBook = async (bookId) => {
    try {
      setReserving((prev) => ({ ...prev, [bookId]: true }));

      // Lấy thông tin Reader từ context hoặc localStorage
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const docGiaId = currentUser.docGiaId || currentUser.maDG || 1; // Use docGiaId from backend

      // Kiểm tra sách có sẵn không
      const book = books.find((b) => b.id === bookId);
      if (!book) {
        showToast("Không tìm thấy thông tin sách", "error");
        return;
      }

      if (book.available > 0) {
        // Sách có sẵn - Tạo phiếu đặt mượn
        const result = await reservationService.createBorrowTicket(
          docGiaId,
          bookId
        );
        showToast(result.message, "success");

        // Cập nhật trạng thái sách trong danh sách
        setBooks((prev) =>
          prev.map((book) =>
            book.id === bookId
              ? { ...book, available: book.available - 1, hasReservation: true }
              : book
          )
        );
      } else {
        // Sách không có sẵn - Tạo đặt trước
        const result = await reservationService.createReservation(
          docGiaId,
          bookId
        );
        showToast(result.message, "success");

        // Cập nhật trạng thái sách trong danh sách
        setBooks((prev) =>
          prev.map((book) =>
            book.id === bookId ? { ...book, hasReservation: true } : book
          )
        );
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setReserving((prev) => ({ ...prev, [bookId]: false }));
    }
  };

  // Kiểm tra điều kiện đặt mượn trước khi hiển thị nút
  const checkBorrowConditions = async (bookId) => {
    try {
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const docGiaId = currentUser.docGiaId || currentUser.maDG || 1;

      const result = await reservationService.checkBorrowConditions(
        docGiaId,
        bookId
      );
      return result.success;
    } catch (error) {
      console.error("Lỗi kiểm tra điều kiện:", error);
      return false;
    }
  };

  // Lấy thông tin hàng đợi cho sách
  const getQueueInfo = async (bookId) => {
    try {
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const docGiaId = currentUser.docGiaId || currentUser.maDG || 1;

      const result = await reservationService.getQueueInfo(bookId, docGiaId);
      return result;
    } catch (error) {
      console.error("Lỗi lấy thông tin hàng đợi:", error);
      return { position: 0, total: 0 };
    }
  };

  const getAvailabilityBadge = (available, total) => {
    if (available === 0) {
      return <span className="badge badge-danger">Hết sách</span>;
    } else if (available < total * 0.3) {
      return (
        <span className="badge badge-warning">
          Còn ít ({available}/{total})
        </span>
      );
    } else {
      return (
        <span className="badge badge-success">
          Có sẵn ({available}/{total})
        </span>
      );
    }
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = "/images/default-book-cover.jpg";
  };

  const loadMockData = () => {
    const mockBooks = [
      {
        id: 1,
        title: "Đắc Nhân Tâm - Nghệ Thuật Đắc Nhân Tâm Và Gây Ảnh Hưởng",
        author: "Dale Carnegie",
        category: "Kỹ năng sống",
        publisher: "NXB Tổng hợp TP.HCM",
        publishYear: 2019,
        isbn: "978-604-1-00001-1",
        available: 3,
        total: 5,
        location: "Kệ A1 - Tầng 1 - Khu vực Kỹ năng sống",
        description:
          "Cuốn sách về nghệ thuật đắc nhân tâm, cách ứng xử và giao tiếp hiệu quả trong cuộc sống và công việc. Sách cung cấp những nguyên tắc và phương pháp thực tế để xây dựng mối quan hệ tốt đẹp với mọi người.",
        coverImage: "/images/book-covers/dac-nhan-tam.jpg",
      },
      {
        id: 2,
        title: "Nhà Giả Kim - Hành Trình Tìm Kiếm Kho Báu Và Ý Nghĩa Cuộc Sống",
        author: "Paulo Coelho",
        category: "Tiểu thuyết",
        publisher: "NXB Văn học",
        publishYear: 2020,
        isbn: "978-604-1-00002-2",
        available: 1,
        total: 3,
        location: "Kệ B2 - Tầng 1 - Khu vực Văn học nước ngoài",
        description:
          "Câu chuyện về hành trình tìm kiếm kho báu và khám phá ý nghĩa thực sự của cuộc sống. Thông qua chuyến phiêu lưu của Santiago, tác giả gửi gắm những bài học sâu sắc về ước mơ, lòng dũng cảm và sự kiên trì.",
        coverImage: "/images/book-covers/nha-gia-kim.jpg",
      },
      {
        id: 3,
        title:
          "Tuổi Trẻ Đáng Giá Bao Nhiêu - Những Trải Nghiệm Và Bài Học Quý Giá",
        author: "Rosie Nguyễn",
        category: "Kỹ năng sống",
        publisher: "NXB Hội nhà văn",
        publishYear: 2018,
        isbn: "978-604-1-00003-3",
        available: 2,
        total: 4,
        location: "Kệ A3 - Tầng 1 - Khu vực Kỹ năng sống",
        description:
          "Những trải nghiệm và bài học quý giá cho tuổi trẻ về việc sống có ý nghĩa, theo đuổi đam mê và tạo dựng giá trị cho bản thân. Sách chia sẻ góc nhìn chân thực về cuộc sống và cách vượt qua những thách thức.",
        coverImage: "/images/book-covers/tuoi-tre-dang-gia-bao-nhieu.jpg",
      },
      {
        id: 4,
        title:
          "Cách Nghĩ Để Thành Công - Những Nguyên Tắc Và Phương Pháp Để Đạt Được Thành Công",
        author: "Napoleon Hill",
        category: "Kinh doanh",
        publisher: "NXB Lao động",
        publishYear: 2021,
        isbn: "978-604-1-00004-4",
        available: 4,
        total: 6,
        location: "Kệ C1 - Tầng 2 - Khu vực Kinh doanh và Quản lý",
        description:
          "Những nguyên tắc và phương pháp để đạt được thành công trong cuộc sống và sự nghiệp. Sách phân tích tư duy của những người thành công và đưa ra các bước thực hành cụ thể.",
        coverImage: "/images/book-covers/cach-nghi-de-thanh-cong.jpg",
      },
      {
        id: 5,
        title:
          "Đọc Vị Bất Kỳ Ai - Nghệ Thuật Đọc Hiểu Tâm Lý Và Suy Nghĩ Của Người Khác",
        author: "David J. Lieberman",
        category: "Tâm lý học",
        publisher: "NXB Thế giới",
        publishYear: 2020,
        isbn: "978-604-1-00005-5",
        available: 0,
        total: 2,
        location: "Kệ B3 - Tầng 2 - Khu vực Tâm lý học",
        description:
          "Nghệ thuật đọc hiểu tâm lý và suy nghĩ của người khác thông qua ngôn ngữ cơ thể, biểu hiện và hành vi. Sách cung cấp các kỹ năng thực tế để hiểu và giao tiếp hiệu quả với mọi người.",
        coverImage: "/images/book-covers/doc-vi-bat-ky-ai.jpg",
      },
      {
        id: 6,
        title: "Sapiens: Lược Sử Loài Người - Từ Thời Cổ Đại Đến Kỷ Nguyên Số",
        author: "Yuval Noah Harari",
        category: "Lịch sử",
        publisher: "NXB Thế giới",
        publishYear: 2021,
        isbn: "978-604-1-00006-6",
        available: 2,
        total: 3,
        location: "Kệ D1 - Tầng 2 - Khu vực Lịch sử và Văn hóa",
        description:
          "Lịch sử phát triển của loài người từ thời cổ đại đến kỷ nguyên số. Sách đưa ra góc nhìn mới mẻ về sự tiến hóa của con người và những thay đổi lớn lao trong lịch sử nhân loại.",
        coverImage: "/images/book-covers/sapiens.jpg",
      },
    ];
    setBooks(mockBooks);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="reader-search">
      <div className="page-header">
        <h1 className="page-title">DANH SÁCH TRA CỨU SÁCH</h1>
        <p className="page-subtitle">Tìm kiếm và khám phá kho sách thư viện</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          {/* Main search bar with suggestions */}
          <div className="search-bar-container">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sách, tác giả, ISBN, thể loại, nhà xuất bản, vị trí..."
                value={searchForm.searchTerm}
                onChange={(e) =>
                  handleSearchChange("searchTerm", e.target.value)
                }
                onKeyDown={handleKeyDown}
                className="search-input"
              />
              {searchForm.searchTerm && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => handleSearchChange("searchTerm", "")}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Search suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="search-suggestions">
                {searchSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <FaSearch className="suggestion-icon" />
                    <span className="suggestion-text">{suggestion.text}</span>
                    <span className="suggestion-type">{suggestion.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick filters and controls */}
          <div className="quick-controls">
            <div className="quick-filters">
              <select
                value={searchForm.theLoai}
                onChange={(e) => handleSearchChange("theLoai", e.target.value)}
                className="quick-filter"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={searchForm.trangThai}
                onChange={(e) =>
                  handleSearchChange("trangThai", e.target.value)
                }
                className="quick-filter"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="quick-filter"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sắp xếp theo: {option.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="sort-order-btn"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                title={sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}
              >
                <FaSort className={sortOrder === "asc" ? "asc" : "desc"} />
              </button>
            </div>

            <div className="control-buttons">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <FaFilter />
                {showAdvancedFilters ? "Ẩn bộ lọc nâng cao" : "Bộ lọc nâng cao"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearFilters}
              >
                <FaTimes /> Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Advanced search form */}
          {showAdvancedFilters && (
            <div className="advanced-search-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Tên sách:</label>
                  <input
                    type="text"
                    value={searchForm.tenSach}
                    onChange={(e) =>
                      handleSearchChange("tenSach", e.target.value)
                    }
                    placeholder="Nhập tên sách..."
                  />
                </div>
                <div className="form-group">
                  <label>Tác giả:</label>
                  <input
                    type="text"
                    value={searchForm.tacGia}
                    onChange={(e) =>
                      handleSearchChange("tacGia", e.target.value)
                    }
                    placeholder="Nhập tên tác giả..."
                  />
                </div>
                <div className="form-group">
                  <label>Mã ISBN:</label>
                  <input
                    type="text"
                    value={searchForm.isbn}
                    onChange={(e) => handleSearchChange("isbn", e.target.value)}
                    placeholder="Nhập mã ISBN..."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Thể loại:</label>
                  <select
                    value={searchForm.theLoai}
                    onChange={(e) =>
                      handleSearchChange("theLoai", e.target.value)
                    }
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Năm xuất bản:</label>
                  <select
                    value={searchForm.namXuatBan}
                    onChange={(e) =>
                      handleSearchChange("namXuatBan", e.target.value)
                    }
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Nhà xuất bản:</label>
                  <select
                    value={searchForm.nhaXuatBan}
                    onChange={(e) =>
                      handleSearchChange("nhaXuatBan", e.target.value)
                    }
                  >
                    {publishers.map((publisher) => (
                      <option key={publisher} value={publisher}>
                        {publisher}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Trạng thái:</label>
                  <select
                    value={searchForm.trangThai}
                    onChange={(e) =>
                      handleSearchChange("trangThai", e.target.value)
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="results-section">
        <div className="results-header">
          <h3>Tìm thấy {filteredBooks.length} sách</h3>
          {(searchForm.searchTerm ||
            searchForm.tenSach ||
            searchForm.tacGia ||
            searchForm.isbn ||
            searchForm.theLoai !== "" ||
            searchForm.namXuatBan !== "" ||
            searchForm.nhaXuatBan !== "" ||
            searchForm.trangThai !== "") && (
            <div className="active-filters">
              <span>Bộ lọc đang áp dụng:</span>
              {searchForm.searchTerm && (
                <span className="filter-tag">
                  Tìm kiếm: {searchForm.searchTerm}
                </span>
              )}
              {searchForm.tenSach && (
                <span className="filter-tag">
                  Tên sách: {searchForm.tenSach}
                </span>
              )}
              {searchForm.tacGia && (
                <span className="filter-tag">Tác giả: {searchForm.tacGia}</span>
              )}
              {searchForm.isbn && (
                <span className="filter-tag">ISBN: {searchForm.isbn}</span>
              )}
              {searchForm.theLoai !== "" && searchForm.theLoai !== "Tất cả" && (
                <span className="filter-tag">
                  Thể loại: {searchForm.theLoai}
                </span>
              )}
              {searchForm.namXuatBan !== "" &&
                searchForm.namXuatBan !== "Tất cả" && (
                  <span className="filter-tag">
                    Năm: {searchForm.namXuatBan}
                  </span>
                )}
              {searchForm.nhaXuatBan !== "" &&
                searchForm.nhaXuatBan !== "Tất cả" && (
                  <span className="filter-tag">
                    NXB: {searchForm.nhaXuatBan}
                  </span>
                )}
              {searchForm.trangThai !== "" &&
                searchForm.trangThai !== "Tất cả" && (
                  <span className="filter-tag">
                    Trạng thái: {searchForm.trangThai}
                  </span>
                )}
            </div>
          )}
        </div>

        {filteredBooks.length > 0 ? (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-cover">
                  <img
                    src={book.coverImage}
                    alt={`Bìa sách ${book.title}`}
                    onError={handleImageError}
                    className="book-cover-image"
                  />
                  {!book.coverImage && (
                    <div className="book-cover-placeholder">
                      <FaImage />
                    </div>
                  )}
                </div>

                <div className="book-content">
                  <div className="book-header">
                    <h4 className="book-title">{book.title}</h4>
                    {getAvailabilityBadge(
                      book.available,
                      book.total || book.quantity
                    )}
                  </div>

                  <div className="book-info">
                    <div className="book-info-item">
                      <FaUser className="book-info-icon" />
                      <div className="book-info-content">
                        <span className="book-info-label">Tác giả</span>
                        <span className="book-info-value">{book.author}</span>
                      </div>
                    </div>

                    <div className="book-info-item">
                      <FaBook className="book-info-icon" />
                      <div className="book-info-content">
                        <span className="book-info-label">Thể loại</span>
                        <span className="book-info-value">{book.category}</span>
                      </div>
                    </div>

                    <div className="book-info-item">
                      <FaCalendar className="book-info-icon" />
                      <div className="book-info-content">
                        <span className="book-info-label">
                          Thông tin xuất bản
                        </span>
                        <span className="book-info-value">
                          {book.publisher} - {book.publishYear}
                        </span>
                      </div>
                    </div>

                    <div className="book-info-item">
                      <FaMapMarkerAlt className="book-info-icon" />
                      <div className="book-info-content">
                        <span className="book-info-label">Vị trí lưu trữ</span>
                        <span className="book-info-value highlight">
                          {book.location}
                        </span>
                      </div>
                    </div>

                    <div className="book-info-item">
                      <FaBook className="book-info-icon" />
                      <div className="book-info-content">
                        <span className="book-info-label">Mã ISBN</span>
                        <span className="book-info-value highlight">
                          {book.isbn}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="book-description">
                    <p>{book.description}</p>
                  </div>

                  <div className="book-actions">
                    {book.available > 0 ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleReserveBook(book.id)}
                        disabled={reserving[book.id]}
                      >
                        <FaClock />
                        {reserving[book.id]
                          ? "Đang đặt trước..."
                          : "Yêu cầu mượn"}
                      </button>
                    ) : (
                      <div className="book-actions-buttons">
                        {book.hasReservation ? (
                          <button className="btn btn-success" disabled>
                            <FaClock /> Đã đặt trước
                          </button>
                        ) : (
                          <button
                            className="btn btn-warning"
                            onClick={() => handleReserveBook(book.id)}
                            disabled={reserving[book.id]}
                          >
                            <FaClock />
                            {reserving[book.id]
                              ? "Đang đặt trước..."
                              : "Đặt trước"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Không tìm thấy sách</h3>
            <p>Không có sách nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReaderSearch;
