/**
 * Test script để kiểm tra chức năng upload ảnh
 * Chạy trong browser console
 */

// Test upload image functionality
async function testImageUpload() {
  console.log('=== Testing Image Upload ===');
  
  try {
    // Test 1: Check if upload endpoint is accessible
    console.log('1. Testing upload endpoint accessibility...');
    const response = await fetch('/api/Sach/upload-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.status === 400) {
      console.log('✅ Upload endpoint accessible (400 expected for missing file)');
    } else {
      console.log(`⚠️ Upload endpoint status: ${response.status}`);
    }
    
    // Test 2: Test with a mock file
    console.log('2. Testing with mock file...');
    const mockFile = new File(['mock image data'], 'test.jpg', { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', mockFile);
    
    const uploadResponse = await fetch('/api/Sach/upload-image', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (uploadResponse.ok) {
      const result = await uploadResponse.json();
      console.log('✅ Upload successful:', result);
    } else {
      const error = await uploadResponse.text();
      console.log('❌ Upload failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test BookCoverUpload component
function testBookCoverUploadComponent() {
  console.log('=== Testing BookCoverUpload Component ===');
  
  // Check if component exists
  if (typeof BookCoverUpload !== 'undefined') {
    console.log('✅ BookCoverUpload component found');
  } else {
    console.log('❌ BookCoverUpload component not found');
  }
  
  // Check if BookModal exists
  if (typeof BookModal !== 'undefined') {
    console.log('✅ BookModal component found');
  } else {
    console.log('❌ BookModal component not found');
  }
}

// Test static files serving
async function testStaticFiles() {
  console.log('=== Testing Static Files ===');
  
  try {
    // Test if wwwroot is accessible
    const response = await fetch('/uploads/test.txt');
    console.log(`Static files test: ${response.status}`);
    
    if (response.status === 404) {
      console.log('ℹ️ Static files directory exists but test file not found (expected)');
    } else {
      console.log(`⚠️ Static files status: ${response.status}`);
    }
    
  } catch (error) {
    console.log('❌ Static files test failed:', error.message);
  }
}

// Test complete flow
async function testCompleteImageUploadFlow() {
  console.log('=== Testing Complete Image Upload Flow ===');
  
  try {
    // Simulate file selection
    const mockFile = new File(['mock image data'], 'test-upload.jpg', { type: 'image/jpeg' });
    
    // Test upload
    const formData = new FormData();
    formData.append('file', mockFile);
    
    const response = await fetch('/api/Sach/upload-image', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload successful:', result);
      
      // Test if image is accessible
      if (result.imageUrl) {
        const imageResponse = await fetch(result.imageUrl);
        console.log(`Image accessibility: ${imageResponse.status}`);
        
        if (imageResponse.ok) {
          console.log('✅ Image is accessible');
        } else {
          console.log('❌ Image not accessible');
        }
      }
    } else {
      const error = await response.text();
      console.log('❌ Upload failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Complete flow test failed:', error);
  }
}

// Run all tests
async function runImageUploadTests() {
  console.log('🚀 Starting Image Upload Tests...\n');
  
  testBookCoverUploadComponent();
  console.log('');
  
  await testStaticFiles();
  console.log('');
  
  await testImageUpload();
  console.log('');
  
  await testCompleteImageUploadFlow();
  console.log('');
  
  console.log('🎉 All image upload tests completed!');
}

// Export for browser console
if (typeof window !== 'undefined') {
  window.testImageUpload = {
    testImageUpload,
    testBookCoverUploadComponent,
    testStaticFiles,
    testCompleteImageUploadFlow,
    runImageUploadTests
  };
  
  console.log('Image upload test functions available as window.testImageUpload');
  console.log('Run: window.testImageUpload.runImageUploadTests()');
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testImageUpload,
    testBookCoverUploadComponent,
    testStaticFiles,
    testCompleteImageUploadFlow,
    runImageUploadTests
  };
} 