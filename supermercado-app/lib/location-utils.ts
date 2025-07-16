// Utility functions for location calculations

/**
 * Calculate the distance between two points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point  
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate estimated time to reach destination by car
 * @param distance Distance in kilometers
 * @returns Estimated time string
 */
export function calculateEstimatedTime(distance: number): string {
  // Assuming average city speed of 25 km/h
  const timeInHours = distance / 25;
  const timeInMinutes = timeInHours * 60;
  
  if (timeInMinutes < 60) {
    return `${Math.round(timeInMinutes)} min`;
  } else {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = Math.round(timeInMinutes % 60);
    return `${hours}h ${minutes}min`;
  }
}

/**
 * Get address from coordinates using reverse geocoding
 * @param lat Latitude
 * @param lng Longitude
 * @returns Formatted address string
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    // Using OpenStreetMap Nominatim API (free alternative to Google)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    
    if (data && data.display_name) {
      return data.display_name;
    }
    
    return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
  }
}

/**
 * Get coordinates from address using geocoding
 * @param address Address string
 * @returns Coordinates object with lat and lng
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // Using OpenStreetMap Nominatim API (free alternative to Google)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in geocoding:', error);
    return null;
  }
}

/**
 * Sort markets by distance from user location
 * @param markets Array of market objects
 * @param userLat User's latitude
 * @param userLng User's longitude
 * @returns Sorted array of markets with calculated distances
 */
export function sortMarketsByDistance(
  markets: any[],
  userLat: number,
  userLng: number
): any[] {
  return markets
    .map(market => {
      const distance = market.latitude && market.longitude
        ? calculateDistance(userLat, userLng, market.latitude, market.longitude)
        : 999; // High value for markets without coordinates
      
      return {
        ...market,
        distance: Number(distance.toFixed(1)),
        estimatedTime: calculateEstimatedTime(distance)
      };
    })
    .sort((a, b) => a.distance - b.distance);
}
