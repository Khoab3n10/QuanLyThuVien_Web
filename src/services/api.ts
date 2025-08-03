import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  Book, 
  Reader, 
  BorrowTicket, 
  ReturnTicket, 
  Reservation,
  RenewalTicket,
  Fine,
  BookSearchRequest,
  ReaderSearchRequest,
  PaginatedResponse
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL = 'https://localhost:7044/api';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: any): Promise<any> {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async changePassword(passwordData: any): Promise<any> {
    const response = await this.api.post('/auth/change-password', passwordData);
    return response.data;
  }

  // Book endpoints
  async getBooks(searchParams?: BookSearchRequest): Promise<PaginatedResponse<Book>> {
    const response = await this.api.get('/books', { params: searchParams });
    return response.data;
  }

  async getBook(id: number): Promise<Book> {
    const response = await this.api.get(`/books/${id}`);
    return response.data;
  }

  async createBook(bookData: Partial<Book>): Promise<Book> {
    const response = await this.api.post('/books', bookData);
    return response.data;
  }

  async updateBook(id: number, bookData: Partial<Book>): Promise<Book> {
    const response = await this.api.put(`/books/${id}`, bookData);
    return response.data;
  }

  async deleteBook(id: number): Promise<void> {
    await this.api.delete(`/books/${id}`);
  }

  // Reader endpoints
  async getReaders(searchParams?: ReaderSearchRequest): Promise<PaginatedResponse<Reader>> {
    const response = await this.api.get('/readers', { params: searchParams });
    return response.data;
  }

  async getReader(id: number): Promise<Reader> {
    const response = await this.api.get(`/readers/${id}`);
    return response.data;
  }

  async createReader(readerData: Partial<Reader>): Promise<Reader> {
    const response = await this.api.post('/readers', readerData);
    return response.data;
  }

  async updateReader(id: number, readerData: Partial<Reader>): Promise<Reader> {
    const response = await this.api.put(`/readers/${id}`, readerData);
    return response.data;
  }

  async deleteReader(id: number): Promise<void> {
    await this.api.delete(`/readers/${id}`);
  }

  // Borrow endpoints
  async borrowBook(readerId: number, bookId: number): Promise<BorrowTicket> {
    const response = await this.api.post('/borrow', { readerId, bookId });
    return response.data;
  }

  async returnBook(readerId: number, bookId: number, condition: string): Promise<ReturnTicket> {
    const response = await this.api.post('/return', { readerId, bookId, returnCondition: condition });
    return response.data;
  }

  async getBorrowTickets(readerId?: number): Promise<BorrowTicket[]> {
    const response = await this.api.get('/borrow', { params: { readerId } });
    return response.data;
  }

  // Reservation endpoints
  async createReservation(readerId: number, bookId: number): Promise<Reservation> {
    const response = await this.api.post('/reservations', { readerId, bookId });
    return response.data;
  }

  async getReservations(readerId?: number): Promise<Reservation[]> {
    const response = await this.api.get('/reservations', { params: { readerId } });
    return response.data;
  }

  async cancelReservation(id: number): Promise<void> {
    await this.api.delete(`/reservations/${id}`);
  }

  // Renewal endpoints
  async renewBook(readerId: number, bookId: number): Promise<RenewalTicket> {
    const response = await this.api.post('/renewals', { readerId, bookId });
    return response.data;
  }

  async getRenewalTickets(readerId?: number): Promise<RenewalTicket[]> {
    const response = await this.api.get('/renewals', { params: { readerId } });
    return response.data;
  }

  // Fine endpoints
  async getFines(readerId?: number): Promise<Fine[]> {
    const response = await this.api.get('/fines', { params: { readerId } });
    return response.data;
  }

  async createFine(fineData: Partial<Fine>): Promise<Fine> {
    const response = await this.api.post('/fines', fineData);
    return response.data;
  }

  async updateFine(id: number, fineData: Partial<Fine>): Promise<Fine> {
    const response = await this.api.put(`/fines/${id}`, fineData);
    return response.data;
  }

  async payFine(id: number): Promise<Fine> {
    const response = await this.api.post(`/fines/${id}/pay`);
    return response.data;
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<any> {
    const response = await this.api.get('/dashboard/stats');
    return response.data;
  }

  async getOverdueBooks(): Promise<BorrowTicket[]> {
    const response = await this.api.get('/dashboard/overdue');
    return response.data;
  }

  async getRecentActivity(): Promise<any[]> {
    const response = await this.api.get('/dashboard/activity');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService; 