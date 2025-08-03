/**
 * Reader Service - API calls related to readers
 */
import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

class ReaderService {
  // Get all readers
  async getReaders(params = {}) {
    try {
      const data = await apiService.get(API_ENDPOINTS.READERS, params);
      return this.mapReadersFromApi(data);
    } catch (error) {
      console.error('Error fetching readers:', error);
      throw error;
    }
  }

  // Get reader by ID
  async getReaderById(id) {
    try {
      const data = await apiService.get(`${API_ENDPOINTS.READERS}/${id}`);
      return this.mapReaderFromApi(data);
    } catch (error) {
      console.error('Error fetching reader:', error);
      throw error;
    }
  }

  // Create new reader
  async createReader(readerData) {
    try {
      const mappedData = this.mapReaderToApi(readerData);
      const data = await apiService.post(API_ENDPOINTS.READERS, mappedData);
      return this.mapReaderFromApi(data);
    } catch (error) {
      console.error('Error creating reader:', error);
      throw error;
    }
  }

  // Update reader
  async updateReader(id, readerData) {
    try {
      const mappedData = this.mapReaderToApi(readerData);
      const data = await apiService.put(`${API_ENDPOINTS.READERS}/${id}`, mappedData);
      return this.mapReaderFromApi(data);
    } catch (error) {
      console.error('Error updating reader:', error);
      throw error;
    }
  }

  // Delete reader
  async deleteReader(id) {
    try {
      await apiService.delete(`${API_ENDPOINTS.READERS}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting reader:', error);
      throw error;
    }
  }

  // Search readers
  async searchReaders(query, filters = {}) {
    try {
      const params = {
        q: query,
        ...filters,
      };
      const data = await apiService.get(`${API_ENDPOINTS.READERS}/search`, params);
      return this.mapReadersFromApi(data);
    } catch (error) {
      console.error('Error searching readers:', error);
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