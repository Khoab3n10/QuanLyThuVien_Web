/**
 * Test script để kiểm tra routing của thủ thư
 * Chạy trong browser console
 */

// Test librarian routing
function testLibrarianRouting() {
  console.log('=== Testing Librarian Routing ===');
  
  // Check current user role
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('Current user role:', user.role);
  
  // Check if user is librarian
  if (user.role === 'Librarian') {
    console.log('✅ User is Librarian');
    
    // Test navigation to /books
    console.log('Testing navigation to /books...');
    window.location.href = '/books';
    
  } else {
    console.log('❌ User is not Librarian');
    console.log('Please login as Librarian to test');
  }
}

// Test sidebar menu items
function testLibrarianMenuItems() {
  console.log('=== Testing Librarian Menu Items ===');
  
  // Check if sidebar exists
  const sidebar = document.querySelector('.sidebar, .modern-sidebar');
  if (sidebar) {
    console.log('✅ Sidebar found');
    
    // Check menu items
    const menuItems = sidebar.querySelectorAll('a, .nav-item');
    console.log('Menu items found:', menuItems.length);
    
    menuItems.forEach((item, index) => {
      const text = item.textContent?.trim();
      const href = item.getAttribute('href');
      console.log(`${index + 1}. ${text} -> ${href}`);
    });
    
  } else {
    console.log('❌ Sidebar not found');
  }
}

// Test page access
function testPageAccess() {
  console.log('=== Testing Page Access ===');
  
  const pages = [
    '/books',
    '/readers', 
    '/borrows',
    '/librarian/dashboard',
    '/librarian/reservations',
    '/librarian/book-status',
    '/librarian/fines',
    '/librarian/violations',
    '/librarian/reports'
  ];
  
  pages.forEach(page => {
    console.log(`Testing access to ${page}...`);
    // This would need to be tested manually by navigating to each page
  });
  
  console.log('Please manually test each page access');
}

// Test current page
function testCurrentPage() {
  console.log('=== Testing Current Page ===');
  
  const currentPath = window.location.pathname;
  console.log('Current path:', currentPath);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('Current user:', user);
  
  // Check if we're on the right page
  if (currentPath === '/books') {
    console.log('✅ Currently on Book Management page');
  } else if (currentPath.startsWith('/librarian/')) {
    console.log('⚠️ Currently on Librarian sub-page');
  } else {
    console.log('❌ Not on expected page');
  }
}

// Run all tests
function runLibrarianTests() {
  console.log('🚀 Starting Librarian Routing Tests...\n');
  
  testCurrentPage();
  console.log('');
  
  testLibrarianMenuItems();
  console.log('');
  
  testPageAccess();
  console.log('');
  
  console.log('🎉 All librarian routing tests completed!');
  console.log('Manual testing required for page access verification');
}

// Export for browser console
if (typeof window !== 'undefined') {
  window.testLibrarianRouting = {
    testLibrarianRouting,
    testLibrarianMenuItems,
    testPageAccess,
    testCurrentPage,
    runLibrarianTests
  };
  
  console.log('Librarian routing test functions available as window.testLibrarianRouting');
  console.log('Run: window.testLibrarianRouting.runLibrarianTests()');
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testLibrarianRouting,
    testLibrarianMenuItems,
    testPageAccess,
    testCurrentPage,
    runLibrarianTests
  };
} 