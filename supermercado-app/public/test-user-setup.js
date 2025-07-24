// Simple function to set up test user in localStorage
function setupTestUser() {
  const testUser = {
    id: 25,
    name: 'João Silva',
    email: 'joao@test.com',
    role: 'USER',
    createdAt: '2025-07-18T05:30:33.423Z'
  }
  
  localStorage.setItem('user', JSON.stringify(testUser))
  console.log('Test user set in localStorage:', testUser)
  
  // Reload the page to see the changes
  window.location.reload()
}

// Call this function in the browser console to set up a test user
console.log('Run setupTestUser() in the console to set up a test user')
console.log('Available users in database:')
console.log('ID: 25, Name: João Silva, Email: joao@test.com')
console.log('ID: 26, Name: Admin User, Email: admin@test.com (ADMIN)')
console.log('ID: 23, Name: Administrador, Email: admin@economarket.com (ADMIN)')

// Export for use in console
window.setupTestUser = setupTestUser
