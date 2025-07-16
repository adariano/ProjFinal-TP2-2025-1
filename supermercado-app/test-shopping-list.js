const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testShoppingList() {
  console.log('🧪 Testando funcionalidade de lista de compras...')
  
  try {
    // 1. Verificar se há usuários
    const users = await prisma.user.findMany()
    console.log(`📋 Usuários encontrados: ${users.length}`)
    
    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado! Execute o seed primeiro.')
      return
    }
    
    // 2. Verificar se há produtos
    const products = await prisma.product.findMany()
    console.log(`📦 Produtos encontrados: ${products.length}`)
    
    if (products.length === 0) {
      console.log('❌ Nenhum produto encontrado! Execute o seed primeiro.')
      return
    }
    
    // 3. Criar uma nova lista de compras
    const testUser = users[0]
    console.log(`👤 Usando usuário: ${testUser.name} (${testUser.email})`)
    
    const shoppingList = await prisma.shoppingList.create({
      data: {
        name: 'Lista de Teste - API',
        userId: testUser.id,
        status: 'active'
      }
    })
    
    console.log(`✅ Lista criada com ID: ${shoppingList.id}`)
    
    // 4. Adicionar alguns itens à lista
    const testProducts = products.slice(0, 3) // Pegar os primeiros 3 produtos
    
    for (const product of testProducts) {
      const item = await prisma.shoppingListItem.create({
        data: {
          shoppingListId: shoppingList.id,
          productId: product.id,
          quantity: Math.floor(Math.random() * 5) + 1, // Quantidade aleatória entre 1 e 5
          collected: false
        }
      })
      
      console.log(`📝 Item adicionado: ${product.name} (Qtd: ${item.quantity})`)
    }
    
    // 5. Buscar a lista com todos os itens
    const fullList = await prisma.shoppingList.findUnique({
      where: { id: shoppingList.id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    console.log('\n📋 Lista completa:')
    console.log(`Nome: ${fullList.name}`)
    console.log(`Status: ${fullList.status}`)
    console.log(`Usuário: ${fullList.user.name}`)
    console.log(`Itens: ${fullList.items.length}`)
    
    fullList.items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.product.name} - Qtd: ${item.quantity} - R$ ${item.product.avgPrice}`)
    })
    
    // 6. Calcular total estimado
    const totalEstimated = fullList.items.reduce((total, item) => {
      return total + (item.product.avgPrice * item.quantity)
    }, 0)
    
    console.log(`💰 Total estimado: R$ ${totalEstimated.toFixed(2)}`)
    
    // 7. Testar busca por usuário
    const userLists = await prisma.shoppingList.findMany({
      where: { userId: testUser.id },
      include: {
        items: true
      }
    })
    
    console.log(`📊 Total de listas do usuário: ${userLists.length}`)
    
    console.log('\n✅ Teste concluído com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testShoppingList()
