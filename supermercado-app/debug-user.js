const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function debugUser() {
  try {
    // Get all users
    const users = await prisma.user.findMany()
    console.log('All users in database:')
    users.forEach(user => {
      console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`)
    })
    
    // Check if a specific user exists
    const testUserId = 25 // Using the ID from the user we just created
    const user = await prisma.user.findUnique({
      where: { id: testUserId }
    })
    
    console.log(`\nUser with ID ${testUserId}:`, user)
    
    // Test the profile API route logic
    if (user) {
      const profile = {
        id: user.id,
        name: user.name,
        email: user.email,
        joinDate: user.createdAt.toISOString(),
        level: "Iniciante",
        nextLevel: "Colaborador",
        totalPoints: user.points || 0,
        pointsToNextLevel: 50,
        stats: {
          pricesReported: 0,
          productsReviewed: 0,
          productsSuggested: 0,
          listsCreated: 0,
          totalSavings: 0,
        },
        achievements: [],
        recentActivity: [],
      }
      
      console.log('\nProfile data would be:', profile)
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugUser()
