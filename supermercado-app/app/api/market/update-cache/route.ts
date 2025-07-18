import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateMarketFromGoogleMaps, shouldUpdateMarket } from '@/lib/google-maps'

export async function POST(request: Request) {
  try {
    const { authorization } = await request.json()
    
    // Production-ready authorization check
    const validTokens = [
      process.env.MARKET_AUTH_TOKEN,
      process.env.CRON_SECRET,
      'internal-cron-job' // Keep for development
    ].filter(Boolean)
    
    if (!authorization || !validTokens.includes(authorization)) {
      console.warn('Unauthorized cache update attempt:', {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date().toISOString()
      })
      
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting check (simple in-memory implementation)
    const now = Date.now()
    const lastUpdate = (globalThis as any).lastMarketUpdate || 0
    const minInterval = 5 * 60 * 1000 // 5 minutes minimum between updates
    
    if (now - lastUpdate < minInterval) {
      return NextResponse.json({ 
        error: 'Rate limited. Please wait before next update.',
        nextUpdateAllowed: new Date(lastUpdate + minInterval).toISOString()
      }, { status: 429 })
    }
    
    ;(globalThis as any).lastMarketUpdate = now

    // Get all markets that need updating
    const markets = await prisma.market.findMany({
      where: {
        OR: [
          { lastMapUpdate: null },
          { lastMapUpdate: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } // 24 hours ago
        ]
      },
      take: 20 // Limit to 20 markets per run to avoid timeout
    })

    const updateResults = []
    
    for (const market of markets) {
      if (shouldUpdateMarket(market)) {
        try {
          const updateData = await updateMarketFromGoogleMaps(market)
          if (updateData) {
            await prisma.market.update({
              where: { id: market.id },
              data: updateData
            })
            updateResults.push({
              id: market.id,
              name: market.name,
              status: 'updated',
              updatedFields: Object.keys(updateData)
            })
          } else {
            updateResults.push({
              id: market.id,
              name: market.name,
              status: 'no_update_needed'
            })
          }
        } catch (error) {
          console.error(`Error updating market ${market.id}:`, error)
          updateResults.push({
            id: market.id,
            name: market.name,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
    }

    return NextResponse.json({
      message: 'Market update job completed',
      processed: markets.length,
      results: updateResults,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in market update job:', error)
    return NextResponse.json({ 
      error: 'Error running market update job' 
    }, { status: 500 })
  }
}

// GET endpoint to check which markets need updating
export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      select: {
        id: true,
        name: true,
        lastMapUpdate: true,
        mapUpdateFreq: true,
      }
    })

    const needsUpdate = markets.filter(shouldUpdateMarket)
    
    return NextResponse.json({
      total: markets.length,
      needsUpdate: needsUpdate.length,
      markets: needsUpdate.map(market => ({
        id: market.id,
        name: market.name,
        lastUpdate: market.lastMapUpdate,
        updateFreq: market.mapUpdateFreq
      }))
    })

  } catch (error) {
    console.error('Error checking market update status:', error)
    return NextResponse.json({ 
      error: 'Error checking market update status' 
    }, { status: 500 })
  }
}
