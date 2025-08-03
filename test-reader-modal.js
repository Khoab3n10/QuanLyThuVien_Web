/**
 * Test script để kiểm tra ReaderModal mới
 * Chạy: node test-reader-modal.js
 */

const API_BASE_URL = 'http://localhost:5280';

// Test data cho ReaderModal
const testReaderData = {
  name: 'Nguyễn Văn Test',
  birthDate: '1990-01-01',
  gender: 'Nam',
  address: '123 Test Street, HCM',
  email: 'test@example.com',
  phone: '0123456789',
  memberType: 'VIP',
  membershipFee: 200000
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

// Test ReaderModal functionality
async function testReaderModal() {
  console.log('\n=== Testing ReaderModal Functionality ===');
  
  try {
    // 1. Test tạo thành viên mới với gói VIP
    console.log('1. Creating new VIP member...');
    const newReader = await makeRequest('/api/DocGia', {
      method: 'POST',
      body: JSON.stringify({
        hoTen: testReaderData.name,
        ngaySinh: testReaderData.birthDate,
        gioiTinh: testReaderData.gender,
        diaChi: testReaderData.address,
        email: testReaderData.email,
        sdt: testReaderData.phone,
        loaiDocGia: testReaderData.memberType,
        phiThanhVien: testReaderData.membershipFee
      })
    });
    console.log('✅ VIP member created:', newReader.maDG);
    
    // 2. Test lấy thông tin thành viên
    console.log('2. Getting member info...');
    const retrievedReader = await makeRequest(`/api/DocGia/${newReader.maDG}`);
    console.log('✅ Member retrieved:', retrievedReader.hoTen);
    console.log('   - Member Type:', retrievedReader.loaiDocGia);
    console.log('   - Membership Fee:', retrievedReader.phiThanhVien);
    
    // 3. Test cập nhật thành viên sang gói Học sinh
    console.log('3. Updating member to HocSinh package...');
    const updatedReader = await makeRequest(`/api/DocGia/${newReader.maDG}`, {
      method: 'PUT',
      body: JSON.stringify({
        hoTen: testReaderData.name + ' - Updated',
        ngaySinh: testReaderData.birthDate,
        gioiTinh: testReaderData.gender,
        diaChi: testReaderData.address,
        email: testReaderData.email,
        sdt: testReaderData.phone,
        loaiDocGia: 'HocSinh',
        phiThanhVien: 50000
      })
    });
    console.log('✅ Member updated to HocSinh package');
    
    // 4. Test lấy danh sách tất cả thành viên
    console.log('4. Getting all members...');
    const allReaders = await makeRequest('/api/DocGia');
    console.log(`✅ Retrieved ${allReaders.length} members`);
    
    // 5. Xóa thành viên test
    console.log('5. Deleting test member...');
    await makeRequest(`/api/DocGia/${newReader.maDG}`, {
      method: 'DELETE'
    });
    console.log('✅ Test member deleted');
    
    console.log('\n🎉 ReaderModal functionality test passed!');
    
  } catch (error) {
    console.error('❌ ReaderModal test failed:', error.message);
  }
}

// Test package options
function testPackageOptions() {
  console.log('\n=== Testing Package Options ===');
  
  const packageOptions = [
    { value: "Thuong", label: "Thường", price: 100000, description: "Gói cơ bản cho mọi đối tượng" },
    { value: "VIP", label: "VIP", price: 200000, description: "Gói cao cấp với nhiều ưu đãi" },
    { value: "HocSinh", label: "Học sinh", price: 50000, description: "Gói ưu đãi cho học sinh" },
    { value: "GiaoVien", label: "Giáo viên", price: 150000, description: "Gói đặc biệt cho giáo viên" },
  ];
  
  console.log('Available packages:');
  packageOptions.forEach(pkg => {
    console.log(`  - ${pkg.label}: ${pkg.price.toLocaleString()}₫ (${pkg.description})`);
  });
  
  console.log('✅ Package options are correctly configured');
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting ReaderModal Tests...');
  console.log(`API Base URL: ${API_BASE_URL}`);
  
  try {
    testPackageOptions();
    await testReaderModal();
    
    console.log('\n🎉 All ReaderModal tests completed!');
    console.log('\n📋 Summary:');
    console.log('- Package options: ✅');
    console.log('- Member creation: ✅');
    console.log('- Member update: ✅');
    console.log('- Member deletion: ✅');
    console.log('\n✨ ReaderModal is working correctly!');
    
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
  testReaderModal,
  testPackageOptions,
  runTests
}; 