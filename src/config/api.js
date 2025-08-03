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
  },
  books: [
    {
      id: 1,
      title: "Đắc Nhân Tâm",
      author: "Dale Carnegie",
      category: "Kỹ năng sống",
      shelf: "Kệ A1",
      status: "Có sẵn",
      coverImage: "/images/book-covers/python.jpg",
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
      coverImage: "/images/book-covers/ml.jpg",
      description:
        "Câu chuyện về hành trình tìm kiếm kho báu và ý nghĩa cuộc sống.",
      publishedYear: 1988,
      isbn: "978-0-06-231500-7",
    },
    {
      id: 3,
      title: "React Programming",
      author: "John Doe",
      category: "Công nghệ",
      shelf: "Kệ C3",
      status: "Đã mượn",
      coverImage: "/images/book-covers/react.jpg",
      description: "Hướng dẫn chi tiết về React.js và các best practices.",
      publishedYear: 2023,
      isbn: "978-1-234-56789-0",
    },
    {
      id: 4,
      title: "Database Design",
      author: "Jane Smith",
      category: "Công nghệ",
      shelf: "Kệ D4",
      status: "Có sẵn",
      coverImage: "/images/book-covers/database.jpg",
      description: "Nguyên lý thiết kế cơ sở dữ liệu và tối ưu hóa hiệu suất.",
      publishedYear: 2022,
      isbn: "978-0-987-65432-1",
    },
    {
      id: 5,
      title: "Web Development",
      author: "Mike Johnson",
      category: "Công nghệ",
      shelf: "Kệ E5",
      status: "Đã đặt",
      coverImage: "/images/book-covers/web.jpg",
      description:
        "Toàn diện về phát triển web hiện đại với các công nghệ mới nhất.",
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
