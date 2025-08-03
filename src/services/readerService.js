/**
 * Reader Service - API calls related to readers
 */
import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

class ReaderService {
  // Get all readers from DocGia table
  async getReaders(params = {}) {
    try {
      const data = await apiService.get(API_ENDPOINTS.DOCGIA.LIST, params);
      return this.mapReadersFromApi(data);
    } catch (error) {
      console.error('Error fetching readers from DocGia:', error);
      throw error;
    }
  }

  // Get reader by ID from DocGia table
  async getReaderById(id) {
    try {
      const data = await apiService.get(`${API_ENDPOINTS.DOCGIA.LIST}/${id}`);
      return this.mapReaderFromApi(data);
    } catch (error) {
      console.error('Error fetching reader from DocGia:', error);
      throw error;
    }
  }

  // Get reader by username through User table connection
  async getReaderByUsername(username) {
    try {
      // First, get user info to find docGiaId
      const userData = await apiService.get(`/api/Users/by-username/${username}`);
      if (userData && userData.docGiaId) {
        // Then get DocGia info using docGiaId
        const readerData = await apiService.get(`${API_ENDPOINTS.DOCGIA.LIST}/${userData.docGiaId}`);
        return this.mapReaderFromApi(readerData);
      }
      throw new Error('No DocGia linked to this user');
    } catch (error) {
      console.error('Error fetching reader by username:', error);
      throw error;
    }
  }

  // Create new reader in DocGia table
  async createReader(readerData) {
    try {
      const mappedData = this.mapReaderToApi(readerData);
      const data = await apiService.post(API_ENDPOINTS.DOCGIA.CREATE, mappedData);
      return this.mapReaderFromApi(data);
    } catch (error) {
      console.error('Error creating reader in DocGia:', error);
      throw error;
    }
  }

  // Update reader in DocGia table
  async updateReader(id, readerData) {
    try {
      const mappedData = this.mapReaderToApi(readerData);
      const data = await apiService.put(`${API_ENDPOINTS.DOCGIA.LIST}/${id}`, mappedData);
      return this.mapReaderFromApi(data);
    } catch (error) {
      console.error('Error updating reader in DocGia:', error);
      throw error;
    }
  }

  // Delete reader from DocGia table
  async deleteReader(id) {
    try {
      await apiService.delete(`${API_ENDPOINTS.DOCGIA.LIST}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting reader from DocGia:', error);
      throw error;
    }
  }

  // Search readers in DocGia table
  async searchReaders(query, filters = {}) {
    try {
      const params = {
        q: query,
        ...filters,
      };
      const data = await apiService.get(`${API_ENDPOINTS.DOCGIA.LIST}/search`, params);
      return this.mapReadersFromApi(data);
    } catch (error) {
      console.error('Error searching readers in DocGia:', error);
      throw error;
    }
  }

  // Map reader data from API format to frontend format
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
      lockDate: apiReader.ngayKhoa,
      lockDays: apiReader.soNgayKhoa,
      lockReason: apiReader.lyDoKhoa,
      maxBooks: apiReader.soSachToiDa,
      maxBorrowDays: apiReader.soNgayMuonToiDa,
      maxRenewals: apiReader.soLanGiaHanToiDa,
      renewalDays: apiReader.soNgayGiaHan,
      updatedAt: apiReader.ngayCapNhat,
    };
  }

  // Map multiple readers from API
  mapReadersFromApi(apiReaders) {
    if (!Array.isArray(apiReaders)) {
      return [];
    }
    return apiReaders.map(reader => this.mapReaderFromApi(reader));
  }

  // Map reader data from frontend format to API format (CreateDocGiaDto)
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
}

// Create singleton instance
const readerService = new ReaderService();

export default readerService; 