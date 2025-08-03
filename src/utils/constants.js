/**
 * Constants used throughout the application
 */

// API Endpoints - Điểm cuối API
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/Auth/login",
    REGISTER: "/api/Auth/register",
    LOGOUT: "/api/Auth/logout",
  },

  // User Management
  USERS: {
    LIST: "/api/Users",
    CREATE: "/api/Users",
    UPDATE: "/api/Users/{id}",
    DELETE: "/api/Users/{id}",
    ROLES: "/api/Users/roles",
  },

  // Book Management
  BOOKS: {
    LIST: "/api/Sach",
    CREATE: "/api/Sach",
    UPDATE: "/api/Sach/{id}",
    DELETE: "/api/Sach/{id}",
    SEARCH: "/api/Sach/search",
  },

  // Reader/DocGia Management  
  DOCGIA: {
    LIST: "/api/DocGia",
    CREATE: "/api/DocGia",
    UPDATE: "/api/DocGia/{id}",
    DELETE: "/api/DocGia/{id}",
    REGISTER_MEMBERSHIP: "/api/DocGia/RegisterMembership",
    CONFIRM_MEMBERSHIP: "/api/DocGia/ConfirmMembership",
  },

  // Reader Management (Different system)
  READERS: {
    LIST: "/api/Readers",
    CREATE: "/api/Readers",
    UPDATE: "/api/Readers/{id}",
    DELETE: "/api/Readers/{id}",
    REGISTER: "/api/Readers/register",
  },

  // Borrow Management
  BORROWS: {
    LIST: "/api/Borrows",
    CREATE: "/api/Borrows",
    RETURN: "/api/Borrows/{id}/return",
    EXTEND: "/api/Borrows/{id}/extend",
  },

  // Reservation Management
  RESERVATIONS: {
    LIST: "/api/Reservation",
    CREATE: "/api/Reservation",
    CANCEL: "/api/Reservation/{id}",
    PROCESS: "/api/Reservation/process-availability/{bookId}",
  },

  // Financial Management
  FINANCIAL: {
    TRANSACTIONS: "/api/Financial/transactions",
    FEES: "/api/Financial/fees",
    PAYMENTS: "/api/Financial/payments",
  },

  // Warehouse Management
  WAREHOUSE: {
    INVENTORY: "/api/Warehouse/inventory",
    STOCK_IN: "/api/Warehouse/stock-in",
    STOCK_CHECK: "/api/Warehouse/stock-check",
  },

  // Reports
  REPORTS: {
    BORROW: "/api/Reports/borrow",
    FINANCIAL: "/api/Reports/financial",
    INVENTORY: "/api/Reports/inventory",
    ACTIVITY: "/api/Reports/activity",
  },

  // System
  SYSTEM: {
    CONFIG: "/api/System/config",
    BACKUP: "/api/System/backup",
    LOGS: "/api/System/logs",
  },
};

// User Roles - Hệ thống vai trò hoàn chỉnh
export const USER_ROLES = {
  // Vai trò quản lý cao cấp
  DIRECTOR: "Giám đốc", // Quản lý tối cao, có tất cả quyền
  ADMIN: "Admin", // Quản trị hệ thống, phân quyền

  // Vai trò quản lý thư viện
  LIBRARY_MANAGER: "Trưởng thư viện", // Quản lý Librarian, duyệt đề xuất
  LIBRARIAN: "Librarian", // Quản lý mượn/trả, đăng ký Reader

  // Vai trò Accountant
  ACCOUNTING_MANAGER: "Trưởng phòng Accountant", // Duyệt đề xuất mua, quản lý Accountant
  ACCOUNTANT: "Nhân viên Accountant", // Xử lý giao dịch tài chính

  // Vai trò kho sách
  WAREHOUSE_MANAGER: "Trưởng kho", // Quản lý kho, duyệt đề xuất bổ sung
  WAREHOUSE_STAFF: "Nhân viên kho", // Nhập kho, kiểm kê

  // Vai trò kỹ thuật
  TECHNICIAN: "Kỹ thuật viên", // Bảo trì hệ thống, sao lưu

  // Vai trò người dùng
  READER: "Reader", // Mượn sách, tìm kiếm
};

// Role Hierarchy - Thứ bậc vai trò
export const ROLE_HIERARCHY = {
  [USER_ROLES.DIRECTOR]: 10, // Cao nhất
  [USER_ROLES.ADMIN]: 9,
  [USER_ROLES.LIBRARY_MANAGER]: 8,
  [USER_ROLES.ACCOUNTING_MANAGER]: 8,
  [USER_ROLES.WAREHOUSE_MANAGER]: 8,
  [USER_ROLES.LIBRARIAN]: 7,
  [USER_ROLES.ACCOUNTANT]: 7,
  [USER_ROLES.WAREHOUSE_STAFF]: 7,
  [USER_ROLES.TECHNICIAN]: 6,
  [USER_ROLES.READER]: 1, // Thấp nhất
};

// Permissions - Quyền hạn chi tiết
export const PERMISSIONS = {
  // Quản lý hệ thống
  SYSTEM_MANAGEMENT: "system_management",
  USER_MANAGEMENT: "user_management",
  ROLE_MANAGEMENT: "role_management",
  CONFIGURATION: "configuration",
  BACKUP_RESTORE: "backup_restore",

  // Quản lý thư viện
  BOOK_MANAGEMENT: "book_management",
  READER_MANAGEMENT: "reader_management",
  BORROW_RETURN: "borrow_return",
  RESERVATION_MANAGEMENT: "reservation_management",
  EXTENSION_MANAGEMENT: "extension_management",
  FINE_MANAGEMENT: "fine_management",

  // Quản lý tài chính
  FINANCIAL_MANAGEMENT: "financial_management",
  PURCHASE_PROPOSAL: "purchase_proposal",
  PURCHASE_ORDER: "purchase_order",
  SUPPLIER_MANAGEMENT: "supplier_management",
  FINANCIAL_REPORTS: "financial_reports",

  // Quản lý kho
  INVENTORY_MANAGEMENT: "inventory_management",
  STOCK_IN: "stock_in",
  STOCK_CHECK: "stock_check",
  WAREHOUSE_REPORTS: "warehouse_reports",

  // Báo cáo và giám sát
  REPORTS_VIEW: "reports_view",
  REPORTS_EXPORT: "reports_export",
  ACTIVITY_LOGS: "activity_logs",

  // Người dùng
  BOOK_SEARCH: "book_search",
  BOOK_BORROW: "book_borrow",
  BOOK_RESERVE: "book_reserve",
  PROFILE_MANAGEMENT: "profile_management",
};

// Role Permissions - Phân quyền theo vai trò
export const ROLE_PERMISSIONS = {
  [USER_ROLES.DIRECTOR]: [
    // Có tất cả quyền
    ...Object.values(PERMISSIONS),
  ],

  [USER_ROLES.ADMIN]: [
    PERMISSIONS.SYSTEM_MANAGEMENT,
    PERMISSIONS.USER_MANAGEMENT,
    PERMISSIONS.ROLE_MANAGEMENT,
    PERMISSIONS.CONFIGURATION,
    PERMISSIONS.BACKUP_RESTORE,
    PERMISSIONS.BOOK_MANAGEMENT,
    PERMISSIONS.READER_MANAGEMENT,
    PERMISSIONS.BORROW_RETURN,
    PERMISSIONS.RESERVATION_MANAGEMENT,
    PERMISSIONS.EXTENSION_MANAGEMENT,
    PERMISSIONS.FINE_MANAGEMENT,
    PERMISSIONS.FINANCIAL_MANAGEMENT,
    PERMISSIONS.INVENTORY_MANAGEMENT,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.ACTIVITY_LOGS,
  ],

  [USER_ROLES.LIBRARY_MANAGER]: [
    PERMISSIONS.BOOK_MANAGEMENT,
    PERMISSIONS.READER_MANAGEMENT,
    PERMISSIONS.BORROW_RETURN,
    PERMISSIONS.RESERVATION_MANAGEMENT,
    PERMISSIONS.EXTENSION_MANAGEMENT,
    PERMISSIONS.FINE_MANAGEMENT,
    PERMISSIONS.PURCHASE_PROPOSAL,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.ACTIVITY_LOGS,
  ],

  [USER_ROLES.LIBRARIAN]: [
    PERMISSIONS.READER_MANAGEMENT,
    PERMISSIONS.BORROW_RETURN,
    PERMISSIONS.RESERVATION_MANAGEMENT,
    PERMISSIONS.EXTENSION_MANAGEMENT,
    PERMISSIONS.FINE_MANAGEMENT,
    PERMISSIONS.PURCHASE_PROPOSAL,
    PERMISSIONS.REPORTS_VIEW,
  ],

  [USER_ROLES.ACCOUNTING_MANAGER]: [
    PERMISSIONS.FINANCIAL_MANAGEMENT,
    PERMISSIONS.PURCHASE_PROPOSAL,
    PERMISSIONS.PURCHASE_ORDER,
    PERMISSIONS.SUPPLIER_MANAGEMENT,
    PERMISSIONS.FINANCIAL_REPORTS,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.ACTIVITY_LOGS,
  ],

  [USER_ROLES.ACCOUNTANT]: [
    PERMISSIONS.FINANCIAL_MANAGEMENT,
    PERMISSIONS.PURCHASE_PROPOSAL,
    PERMISSIONS.PURCHASE_ORDER,
    PERMISSIONS.SUPPLIER_MANAGEMENT,
    PERMISSIONS.FINANCIAL_REPORTS,
    PERMISSIONS.REPORTS_VIEW,
  ],

  [USER_ROLES.WAREHOUSE_MANAGER]: [
    PERMISSIONS.INVENTORY_MANAGEMENT,
    PERMISSIONS.STOCK_IN,
    PERMISSIONS.STOCK_CHECK,
    PERMISSIONS.WAREHOUSE_REPORTS,
    PERMISSIONS.PURCHASE_PROPOSAL,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.ACTIVITY_LOGS,
  ],

  [USER_ROLES.WAREHOUSE_STAFF]: [
    PERMISSIONS.INVENTORY_MANAGEMENT,
    PERMISSIONS.STOCK_IN,
    PERMISSIONS.STOCK_CHECK,
    PERMISSIONS.WAREHOUSE_REPORTS,
    PERMISSIONS.PURCHASE_PROPOSAL,
    PERMISSIONS.REPORTS_VIEW,
  ],

  [USER_ROLES.TECHNICIAN]: [
    PERMISSIONS.CONFIGURATION,
    PERMISSIONS.BACKUP_RESTORE,
    PERMISSIONS.ACTIVITY_LOGS,
    // Có thể thực hiện chức năng của các vai trò khác
    PERMISSIONS.READER_MANAGEMENT,
    PERMISSIONS.BORROW_RETURN,
    PERMISSIONS.FINANCIAL_MANAGEMENT,
    PERMISSIONS.INVENTORY_MANAGEMENT,
  ],

  [USER_ROLES.READER]: [
    PERMISSIONS.BOOK_SEARCH,
    PERMISSIONS.BOOK_BORROW,
    PERMISSIONS.BOOK_RESERVE,
    PERMISSIONS.PROFILE_MANAGEMENT,
  ],
};

// System Configuration - Cấu hình hệ thống
export const SYSTEM_CONFIG = {
  // Giới hạn mượn sách
  MAX_BORROWED_BOOKS: 5,
  MAX_RESERVED_BOOKS: 3,

  // Thời gian mượn
  BORROW_DURATION_DAYS: 14,
  EXTENSION_DURATION_DAYS: 7,

  // Thời gian xử lý
  RESERVATION_PICKUP_HOURS: 24,
  ORDER_RESPONSE_HOURS: 48,

  // Phí phạt
  OVERDUE_FINE_PER_DAY: 5000, // VNĐ
  DAMAGE_FINE_MULTIPLIER: 2, // Nhân với giá sách
  LOST_FINE_MULTIPLIER: 3, // Nhân với giá sách

  // Tuổi tối thiểu đăng ký
  MIN_REGISTRATION_AGE: 16,
};

// Status Constants - Trạng thái hệ thống
export const STATUS = {
  // Trạng thái phiếu mượn
  BORROW_STATUS: {
    BORROWED: "borrowed",
    RETURNED: "returned",
    OVERDUE: "overdue",
  },

  // Trạng thái đặt trước
  RESERVATION_STATUS: {
    PENDING: "Đang chờ",
    PROCESSED: "Đã xử lý",
    EXPIRED: "Quá hạn",
    CANCELLED: "Đã hủy",
  },

  // Trạng thái đề xuất
  PROPOSAL_STATUS: {
    PENDING: "Chờ duyệt",
    APPROVED: "Đã duyệt",
    REJECTED: "Từ chối",
    PROCESSING: "Đang xử lý",
  },

  // Trạng thái đơn hàng
  ORDER_STATUS: {
    PENDING: "Chờ xử lý",
    SENT: "Đã gửi",
    CONFIRMED: "Đã xác nhận",
    RECEIVED: "Đã nhận",
    CANCELLED: "Đã hủy",
  },

  // Trạng thái sách
  BOOK_STATUS: {
    AVAILABLE: "available",
    BORROWED: "borrowed",
    RESERVED: "reserved",
    DAMAGED: "damaged",
    LOST: "lost",
  },
};

// Book Status
export const BOOK_STATUS = {
  AVAILABLE: "available",
  BORROWED: "borrowed",
  RESERVED: "reserved",
  MAINTENANCE: "maintenance",
  LOST: "lost",
  DAMAGED: "damaged",
};

// Borrow Status
export const BORROW_STATUS = {
  ACTIVE: "borrowed",
  RETURNED: "returned",
  OVERDUE: "overdue",
  RENEWED: "renewed",
};

// Reservation Status
export const RESERVATION_STATUS = {
  PENDING: "pending",
  NOTIFIED: "notified",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

// Fine Status
export const FINE_STATUS = {
  UNPAID: "unpaid",
  PAID: "paid",
  WAIVED: "waived",
};

// Fine Types
export const FINE_TYPES = {
  OVERDUE: "overdue",
  DAMAGED: "damaged",
  LOST: "lost",
};

// Fine Amounts (VND)
export const FINE_AMOUNTS = {
  OVERDUE_PER_DAY: 10000,
  DAMAGED_BOOK: 100000,
  LOST_BOOK: 200000,
};

// Member Status
export const MEMBER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  EXPIRED: "expired",
};

// Book Categories
export const BOOK_CATEGORIES = [
  "Khoa học tự nhiên",
  "Khoa học xã hội",
  "Văn học",
  "Lịch sử",
  "Địa lý",
  "Tâm lý học",
  "Triết học",
  "Tôn giáo",
  "Nghệ thuật",
  "Âm nhạc",
  "Thể thao",
  "Công nghệ thông tin",
  "Kinh tế",
  "Luật pháp",
  "Y học",
  "Giáo dục",
  "Ngôn ngữ",
  "Tiểu thuyết",
  "Truyện ngắn",
  "Thơ ca",
  "Sách thiếu nhi",
  "Sách tham khảo",
  "Từ điển",
  "Bách khoa toàn thư",
];

// Date Formats
export const DATE_FORMATS = {
  SHORT: "dd/MM/yyyy",
  LONG: "dd/MM/yyyy HH:mm",
  ISO: "yyyy-MM-dd",
  TIME_ONLY: "HH:mm",
  RELATIVE: "relative",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_BUTTONS: 7,
};

// Validation Limits
export const VALIDATION_LIMITS = {
  BOOK_TITLE_MAX: 200,
  AUTHOR_NAME_MAX: 100,
  PUBLISHER_MAX: 100,
  ISBN_LENGTH: [10, 13],
  MEMBER_NAME_MAX: 50,
  PHONE_LENGTH: [10, 11],
  EMAIL_MAX: 100,
  ADDRESS_MAX: 200,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  SEARCH_TERM_MAX: 100,
  BORROW_DAYS_DEFAULT: 14,
  BORROW_DAYS_MAX: 30,
  RENEWAL_LIMIT: 2,
  RESERVATION_LIMIT: 3,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_INFO: "user_info",
  THEME: "theme",
  LANGUAGE: "language",
  RECENT_SEARCHES: "recent_searches",
  TABLE_SETTINGS: "table_settings",
  SIDEBAR_COLLAPSED: "sidebar_collapsed",
};

// Theme Options
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  AUTO: "auto",
};

// Language Options
export const LANGUAGES = {
  VI: "vi",
  EN: "en",
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng thử lại.",
  SERVER_ERROR: "Lỗi server. Vui lòng liên hệ Admin.",
  UNAUTHORIZED: "Bạn không có quyền truy cập.",
  NOT_FOUND: "Không tìm thấy dữ liệu.",
  VALIDATION_ERROR: "Dữ liệu không hợp lệ.",
  GENERIC_ERROR: "Có lỗi xảy ra. Vui lòng thử lại.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: "Tạo mới thành công!",
  UPDATED: "Cập nhật thành công!",
  DELETED: "Xóa thành công!",
  SAVED: "Lưu thành công!",
  SENT: "Gửi thành công!",
  IMPORTED: "Import thành công!",
  EXPORTED: "Export thành công!",
};

// Animation Durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Breakpoints (px)
export const BREAKPOINTS = {
  XS: 480,
  SM: 768,
  MD: 1024,
  LG: 1280,
  XL: 1536,
};

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
};
