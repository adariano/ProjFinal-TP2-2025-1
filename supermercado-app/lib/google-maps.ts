// Google Maps API utilities
import { geocodeAddress } from './location-utils'

export interface GoogleMapsPlace {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  types: string[]
  business_status?: string
  opening_hours?: {
    open_now: boolean
    weekday_text: string[]
  }
  formatted_phone_number?: string
  website?: string
  price_level?: number
  rating?: number
  user_ratings_total?: number
  photos?: Array<{
    photo_reference: string
    width: number
    height: number
  }>
  vicinity?: string
}

export interface MarketUpdateData {
  latitude?: number
  longitude?: number
  placeId?: string
  photoUrl?: string
  website?: string
  businessStatus?: string
  types?: string
  vicinity?: string
  phone?: string
  hours?: string
  rating?: number
  lastMapUpdate: Date
}

/**
 * Get place details from Google Maps API
 * Note: This is a mock implementation since we don't have Google Maps API key
 * In production, you would use the Google Places API
 */
export async function getPlaceDetails(placeId: string): Promise<GoogleMapsPlace | null> {
  // TODO: Implement actual Google Maps API call
  // For now, return null to indicate no updates available
  return null
}

/**
 * Search for places near a location
 * Note: This is a mock implementation
 */
export async function searchNearbyPlaces(
  lat: number,
  lng: number,
  radius: number = 5000,
  type: string = 'supermarket'
): Promise<GoogleMapsPlace[]> {
  // TODO: Implement actual Google Maps API call
  // For now, return empty array
  return []
}

/**
 * Update market data with Google Maps information
 * This function should be called periodically to keep data fresh
 */
export async function updateMarketFromGoogleMaps(
  market: any
): Promise<MarketUpdateData | null> {
  try {
    // If we don't have coordinates, try to geocode the address
    if (!market.latitude || !market.longitude) {
      const coords = await geocodeAddress(market.address)
      if (coords) {
        const updateData: MarketUpdateData = {
          latitude: coords.lat,
          longitude: coords.lng,
          lastMapUpdate: new Date(),
        }
        
        // Try to get place details if we have a place ID
        if (market.placeId) {
          const placeDetails = await getPlaceDetails(market.placeId)
          if (placeDetails) {
            updateData.businessStatus = placeDetails.business_status
            updateData.types = JSON.stringify(placeDetails.types)
            updateData.vicinity = placeDetails.vicinity
            
            if (placeDetails.formatted_phone_number) {
              updateData.phone = placeDetails.formatted_phone_number
            }
            
            if (placeDetails.opening_hours?.weekday_text) {
              updateData.hours = placeDetails.opening_hours.weekday_text.join('; ')
            }
            
            if (placeDetails.rating) {
              updateData.rating = placeDetails.rating
            }
            
            if (placeDetails.website) {
              updateData.website = placeDetails.website
            }
            
            if (placeDetails.photos && placeDetails.photos.length > 0) {
              // TODO: Generate photo URL from photo reference
              updateData.photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${placeDetails.photos[0].photo_reference}&key=YOUR_API_KEY`
            }
          }
        }
        
        return updateData
      }
    }
    
    // If we have coordinates but no place ID, we could search for the place
    // and try to match it to get the place ID for future updates
    
    return null
  } catch (error) {
    console.error('Error updating market from Google Maps:', error)
    return null
  }
}

/**
 * Check if a market needs to be updated based on lastMapUpdate and updateFreq
 */
export function shouldUpdateMarket(market: any): boolean {
  if (!market.lastMapUpdate) {
    return true // Never updated
  }
  
  const now = new Date()
  const lastUpdate = new Date(market.lastMapUpdate)
  const updateFreq = market.mapUpdateFreq || 86400 // Default 24 hours
  
  const timeSinceUpdate = (now.getTime() - lastUpdate.getTime()) / 1000
  
  return timeSinceUpdate > updateFreq
}

/**
 * Get nearby markets using Google Maps API
 * This is a fallback when we don't have markets in our database
 */
export async function getNearbyMarketsFromGoogleMaps(
  lat: number,
  lng: number,
  radius: number = 5000
): Promise<any[]> {
  try {
    const places = await searchNearbyPlaces(lat, lng, radius, 'supermarket')
    
    return places.map(place => ({
      // Convert Google Maps place to our market format
      name: place.name,
      address: place.formatted_address,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      placeId: place.place_id,
      rating: place.rating || 0,
      phone: place.formatted_phone_number,
      hours: place.opening_hours?.weekday_text?.join('; '),
      website: place.website,
      businessStatus: place.business_status,
      types: JSON.stringify(place.types),
      vicinity: place.vicinity,
      // Calculate distance (will be done by sortMarketsByDistance)
      distance: 0,
      // Default values
      priceLevel: place.price_level ? '$'.repeat(place.price_level) : '$$',
      categories: place.types.filter(type => 
        ['supermarket', 'grocery_or_supermarket', 'convenience_store', 'store'].includes(type)
      ).join(', '),
      lastMapUpdate: new Date(),
    }))
  } catch (error) {
    console.error('Error fetching nearby markets from Google Maps:', error)
    return []
  }
}
