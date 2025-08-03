// User types
export interface User {
  id: number;
  username: string;
  role: string;
  email?: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

// Reader types
export interface Reader {
  id: number;
  fullName: string;
  gender: string;
  address: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;
  registrationDate: string;
  expiryDate?: string;
  membershipType: string;
  status: string;
  membershipFee: number;
  maxBooksAllowed: number;
  maxBorrowDays: number;
  maxRenewals: number;
  suspensionDate?: string;
  suspensionDays: number;
  suspensionReason?: string;
  userId?: number;
}

// Book types
export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  publisher?: string;
  publicationYear?: number;
  isbn?: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
  location?: string;
  coverImagePath?: string;
  price?: number;
  dateAdded: string;
  lastUpdated?: string;
  status: string;
}

// Transaction types
export interface BorrowTicket {
  id: number;
  readerId: number;
  bookId: number;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;
  notes?: string;
  processedByUserId?: number;
  reader?: Reader;
  book?: Book;
}

export interface ReturnTicket {
  id: number;
  readerId: number;
  bookId: number;
  returnDate: string;
  originalDueDate: string;
  returnCondition: string;
  notes?: string;
  processedByUserId?: number;
  reader?: Reader;
  book?: Book;
}

export interface Reservation {
  id: number;
  readerId: number;
  bookId: number;
  reservationDate: string;
  expiryDate: string;
  status: string;
  queuePosition: number;
  notes?: string;
  reader?: Reader;
  book?: Book;
}

export interface RenewalTicket {
  id: number;
  readerId: number;
  bookId: number;
  renewalDate: string;
  oldDueDate: string;
  newDueDate: string;
  notes?: string;
  processedByUserId?: number;
  reader?: Reader;
  book?: Book;
}

export interface Fine {
  id: number;
  readerId: number;
  bookId?: number;
  type: string;
  amount: number;
  issueDate: string;
  dueDate?: string;
  paymentDate?: string;
  status: string;
  description?: string;
  issuedByUserId?: number;
  processedByUserId?: number;
  reader?: Reader;
  book?: Book;
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
  userId: number;
  readerId?: number;
  expiresAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Search types
export interface BookSearchRequest {
  title?: string;
  author?: string;
  category?: string;
  isbn?: string;
  status?: string;
  page: number;
  pageSize: number;
}

export interface ReaderSearchRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  membershipType?: string;
  status?: string;
  page: number;
  pageSize: number;
} 