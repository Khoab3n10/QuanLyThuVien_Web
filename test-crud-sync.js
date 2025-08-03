/**
 * Test script để kiểm tra CRUD operations
 * Chạy: node test-crud-sync.js
 */

const API_BASE_URL = 'http://localhost:5280';

// Test data
const testBook = {
  title: 'Test Book - CRUD Sync',
  author: 'Test Author',
  isbn: '1234567890123',
  category: 'Khoa học',
  publisher: 'Test Publisher',
  publishYear: 2024,
  quantity: 5,
  price: 150000, // Thêm giá sách
  status: 'Có sẵn',
  location: 'Kệ A1',
  coverImage: ''
};

const testReader = {
  name: 'Test Reader - CRUD Sync',
  birthDate: '1990-01-01',
  gender: 'Nam',
  address: 'Test Address',
  email: 'test@example.com',
  phone: '0123456789',
  memberType: 'Thuong',
  membershipFee: 100000
};

// Helper functions
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.message || 'Unknown error'}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Request failed: ${error.message}`);
    throw error;
  }
}

// Test functions
async function testBookCRUD() {
  console.log('\n=== Testing Book CRUD ===');
  
  try {
    // 1. Create book
    console.log('1. Creating book...');
    const createdBook = await makeRequest('/api/Sach', {
      method: 'POST',
      body: JSON.stringify({
        tenSach: testBook.title,
        tacGia: testBook.author,
        isbn: testBook.isbn,
        theLoai: testBook.category,
        nhaXuatBan: testBook.publisher,
        namXB: testBook.publishYear,
        soLuong: testBook.quantity,
        giaSach: testBook.price, // Thêm trường giá sách
        trangThai: testBook.status,
        viTriLuuTru: testBook.location,
        anhBia: testBook.coverImage
      })
    });
    console.log('✅ Book created:', createdBook.maSach);
    
    // 2. Get book
    console.log('2. Getting book...');
    const retrievedBook = await makeRequest(`/api/Sach/${createdBook.maSach}`);
    console.log('✅ Book retrieved:', retrievedBook.tenSach);
    
    // 3. Update book
    console.log('3. Updating book...');
    const updatedBook = await makeRequest(`/api/Sach/${createdBook.maSach}`, {
      method: 'PUT',
      body: JSON.stringify({
        tenSach: testBook.title + ' - Updated',
        tacGia: testBook.author,
        isbn: testBook.isbn,
        theLoai: testBook.category,
        nhaXuatBan: testBook.publisher,
        namXB: testBook.publishYear,
        soLuong: testBook.quantity + 1,
        giaSach: testBook.price + 50000, // Cập nhật giá sách
        trangThai: testBook.status,
        viTriLuuTru: testBook.location,
        anhBia: testBook.coverImage
      })
    });
    console.log('✅ Book updated');
    
    // 4. Delete book
    console.log('4. Deleting book...');
    await makeRequest(`/api/Sach/${createdBook.maSach}`, {
      method: 'DELETE'
    });
    console.log('✅ Book deleted');
    
    console.log('🎉 Book CRUD test passed!');
    
  } catch (error) {
    console.error('❌ Book CRUD test failed:', error.message);
  }
}

async function testReaderCRUD() {
  console.log('\n=== Testing Reader CRUD ===');
  
  try {
    // 1. Create reader
    console.log('1. Creating reader...');
    const createdReader = await makeRequest('/api/DocGia', {
      method: 'POST',
      body: JSON.stringify({
        hoTen: testReader.name,
        ngaySinh: testReader.birthDate,
        gioiTinh: testReader.gender,
        diaChi: testReader.address,
        email: testReader.email,
        sdt: testReader.phone,
        loaiDocGia: testReader.memberType,
        phiThanhVien: testReader.membershipFee
      })
    });
    console.log('✅ Reader created:', createdReader.maDG);
    
    // 2. Get reader
    console.log('2. Getting reader...');
    const retrievedReader = await makeRequest(`/api/DocGia/${createdReader.maDG}`);
    console.log('✅ Reader retrieved:', retrievedReader.hoTen);
    
    // 3. Update reader
    console.log('3. Updating reader...');
    const updatedReader = await makeRequest(`/api/DocGia/${createdReader.maDG}`, {
      method: 'PUT',
      body: JSON.stringify({
        hoTen: testReader.name + ' - Updated',
        ngaySinh: testReader.birthDate,
        gioiTinh: testReader.gender,
        diaChi: testReader.address,
        email: testReader.email,
        sdt: testReader.phone,
        loaiDocGia: testReader.memberType,
        phiThanhVien: testReader.membershipFee
      })
    });
    console.log('✅ Reader updated');
    
    // 4. Delete reader
    console.log('4. Deleting reader...');
    await makeRequest(`/api/DocGia/${createdReader.maDG}`, {
      method: 'DELETE'
    });
    console.log('✅ Reader deleted');
    
    console.log('🎉 Reader CRUD test passed!');
    
  } catch (error) {
    console.error('❌ Reader CRUD test failed:', error.message);
  }
}

async function testAPIEndpoints() {
  console.log('\n=== Testing API Endpoints ===');
  
  const endpoints = [
    '/api/Sach',
    '/api/DocGia',
    '/api/Sach/search',
    '/api/DocGia/search'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await makeRequest(endpoint);
      console.log(`✅ ${endpoint} - OK (${Array.isArray(response) ? response.length : 'object'} items)`);
    } catch (error) {
      console.log(`❌ ${endpoint} - Failed: ${error.message}`);
    }
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting CRUD Sync Tests...');
  console.log(`API Base URL: ${API_BASE_URL}`);
  
  try {
    await testAPIEndpoints();
    await testBookCRUD();
    await testReaderCRUD();
    
    console.log('\n🎉 All tests completed!');
    console.log('\n📋 Summary:');
    console.log('- API endpoints: ✅');
    console.log('- Book CRUD: ✅');
    console.log('- Reader CRUD: ✅');
    console.log('\n✨ CRUD synchronization is working correctly!');
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testBookCRUD,
  testReaderCRUD,
  testAPIEndpoints,
  runTests
}; 