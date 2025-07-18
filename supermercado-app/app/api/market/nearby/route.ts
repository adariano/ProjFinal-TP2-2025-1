import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sortMarketsByDistance, sortMarketsByDrivingDistance } from '@/lib/location-utils'
import { 
  updateMarketFromGoogleMaps, 
  shouldUpdateMarket, 
  getNearbyMarketsFromGoogleMaps 
} from '@/lib/google-maps'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const radius = parseFloat(searchParams.get('radius') || '10') // Default 10km
  const limit = parseInt(searchParams.get('limit') || '20') // Default 20 markets

  if (!lat || !lng) {
    return NextResponse.json({ 
      error: 'Latitude and longitude are required' 
    }, { status: 400 })
  }

  const userLat = parseFloat(lat)
  const userLng = parseFloat(lng)

  try {
    // Get all markets from database
    const markets = await prisma.market.findMany({
      include: {
        reviews: true,
        priceReports: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Filter out markets without coordinates and calculate distances
    const marketsWithCoords = markets.filter(market => 
      market.latitude && market.longitude
    )

    // Get query parameter for distance calculation method
    const useDrivingDistance = searchParams.get('driving') === 'true'
    
    // Sort by distance and filter by radius
    let sortedMarkets
    if (useDrivingDistance) {
      // Use actual driving distances for more accurate results
      sortedMarkets = await sortMarketsByDrivingDistance(
        marketsWithCoords, 
        userLat, 
        userLng
      )
    } else {
      // Use straight-line distances for faster response
      sortedMarkets = sortMarketsByDistance(
        marketsWithCoords, 
        userLat, 
        userLng
      )
    }
    
    // Filter by radius
    const nearbyMarkets = sortedMarkets.filter(market => market.distance <= radius)

    // Update markets that need refreshing (async, don't wait)
    const updatePromises = nearbyMarkets
      .filter(shouldUpdateMarket)
      .slice(0, 5) // Limit to 5 concurrent updates
      .map(async (market) => {
        try {
          const updateData = await updateMarketFromGoogleMaps(market)
          if (updateData) {
            await prisma.market.update({
              where: { id: market.id },
              data: updateData
            })
          }
        } catch (error) {
          console.error(`Error updating market ${market.id}:`, error)
        }
      })

    // Don't wait for updates, return current data
    Promise.all(updatePromises).catch(console.error)

    // Transform data to include calculated fields
    const transformedMarkets = nearbyMarkets.slice(0, limit).map(market => {
      const reviewCount = market.reviews?.length || 0
      const avgRating = reviewCount > 0 
        ? market.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviewCount
        : market.rating || 0

      return {
        ...market,
        rating: avgRating,
        reviews: reviewCount,
        categories: market.categories ? market.categories.split(',').map((c: string) => c.trim()) : ['Supermercado'],
        priceReports: market.priceReports?.length || 0,
        coordinates: {
          lat: market.latitude,
          lng: market.longitude
        }
      }
    })

    // If we have very few markets and radius is large, try to supplement with Google Maps
    if (transformedMarkets.length < 3 && radius > 5) {
      try {
        const googleMarkets = await getNearbyMarketsFromGoogleMaps(
          userLat, 
          userLng, 
          radius * 1000 // Convert km to meters
        )
        
        // Add Google Maps markets that aren't already in our database
        const existingNames = new Set(transformedMarkets.map(m => m.name.toLowerCase()))
        const newMarkets = googleMarkets
          .filter(gm => !existingNames.has(gm.name.toLowerCase()))
          .slice(0, 10 - transformedMarkets.length)
        
        transformedMarkets.push(...newMarkets)
      } catch (error) {
        console.error('Error fetching from Google Maps:', error)
      }
    }

    return NextResponse.json({
      markets: transformedMarkets,
      userLocation: { lat: userLat, lng: userLng },
      radius,
      total: transformedMarkets.length
    })

  } catch (error) {
    console.error('Error fetching nearby markets:', error)
    return NextResponse.json({ 
      error: 'Error fetching nearby markets' 
    }, { status: 500 })
  }
}
