// Utility functions for location calculations

// Logger for routing services - only works server-side
function logToFile(message: string) {
  // Only log server-side (when fs is available)
  if (typeof window === 'undefined') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    
    try {
      // Dynamic import to avoid bundling issues
      const fs = require('fs');
      const path = require('path');
      const LOG_FILE = path.join(process.cwd(), 'routing-services.log');
      
      fs.appendFileSync(LOG_FILE, logEntry + '\n');
    } catch (error) {
      // Silently fail if logging doesn't work
    }
  }
}

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
 * Calculate estimated time to reach destination by car with realistic urban factors
 * @param distance Distance in kilometers
 * @param isDrivingDistance Whether this is already adjusted driving distance
 * @returns Estimated time string
 */
export function calculateEstimatedTime(distance: number, isDrivingDistance: boolean = false): string {
  // If it's straight-line distance, convert to driving distance first
  const drivingDistance = isDrivingDistance ? distance : distance * 1.3;
  
  // More realistic speed calculations based on distance and urban factors
  let averageSpeed;
  
  if (drivingDistance <= 2) {
    // Very short distances: lots of stops, traffic lights, parking
    averageSpeed = 15; // km/h
  } else if (drivingDistance <= 5) {
    // Short distances: some city driving, a few traffic lights
    averageSpeed = 20; // km/h
  } else if (drivingDistance <= 10) {
    // Medium distances: mix of city and faster roads
    averageSpeed = 25; // km/h
  } else if (drivingDistance <= 20) {
    // Longer distances: highways and faster roads
    averageSpeed = 35; // km/h
  } else {
    // Very long distances: mostly highways
    averageSpeed = 45; // km/h
  }
  
  // Add buffer time for parking, walking, etc.
  const drivingTimeMinutes = (drivingDistance / averageSpeed) * 60;
  const bufferTime = Math.min(5, drivingDistance * 0.5); // 0.5 min per km, max 5 min
  const totalTimeMinutes = drivingTimeMinutes + bufferTime;
  
  if (totalTimeMinutes < 60) {
    return `${Math.round(totalTimeMinutes)} min`;
  } else {
    const hours = Math.floor(totalTimeMinutes / 60);
    const minutes = Math.round(totalTimeMinutes % 60);
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
        estimatedTime: calculateEstimatedTime(distance, false), // false = straight-line distance
        accuracy: 70, // Straight-line calculation accuracy
        service: "Straight-line Distance",
        isDrivingDistance: false
      };
    })
    .sort((a, b) => a.distance - b.distance);
}

// Routing service configuration with accuracy ranking
export interface RoutingService {
  name: string;
  accuracy: number; // 0-100 scale
  rateLimitPerMinute: number;
  timeout: number;
  getUrl: (lat1: number, lon1: number, lat2: number, lon2: number) => string;
  parseResponse: (data: any) => { distance: number; duration: number } | null;
  headers?: Record<string, string>;
}

// Ordered from best to worst accuracy - optimized for free and reliable services
const routingServices: RoutingService[] = [
  {
    name: 'Google Maps Directions',
    accuracy: 95,
    rateLimitPerMinute: 40, // With API key
    timeout: 5000,
    getUrl: (lat1, lon1, lat2, lon2) => 
      `https://maps.googleapis.com/maps/api/directions/json?origin=${lat1},${lon1}&destination=${lat2},${lon2}&key=${process.env.GOOGLE_MAPS_API_KEY}&units=metric`,
    parseResponse: (data) => {
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];
        return {
          distance: leg.distance.value / 1000, // Convert to km
          duration: leg.duration.value / 60 // Convert to minutes
        };
      }
      return null;
    },
    headers: { 'User-Agent': 'EconoMarket-App/1.0' }
  },
  {
    name: 'MapBox Directions',
    accuracy: 92,
    rateLimitPerMinute: 300, // Free: 50k requests/month
    timeout: 4000,
    getUrl: (lat1, lon1, lat2, lon2) => 
      `https://api.mapbox.com/directions/v5/mapbox/driving/${lon1},${lat1};${lon2},${lat2}?access_token=${process.env.MAPBOX_API_KEY}&geometries=geojson`,
    parseResponse: (data) => {
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          distance: route.distance / 1000, // Convert to km
          duration: route.duration / 60 // Convert to minutes
        };
      }
      return null;
    },
    headers: { 'User-Agent': 'EconoMarket-App/1.0' }
  },
  {
    name: 'HERE Maps',
    accuracy: 90,
    rateLimitPerMinute: 250, // Free: 250k requests/month
    timeout: 4000,
    getUrl: (lat1, lon1, lat2, lon2) => 
      `https://router.hereapi.com/v8/routes?transportMode=car&origin=${lat1},${lon1}&destination=${lat2},${lon2}&return=summary&apiKey=${process.env.HERE_API_KEY}`,
    parseResponse: (data) => {
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const summary = route.sections[0].summary;
        return {
          distance: summary.length / 1000, // Convert to km
          duration: summary.duration / 60 // Convert to minutes
        };
      }
      return null;
    },
    headers: { 'User-Agent': 'EconoMarket-App/1.0' }
  },
  {
    name: 'TomTom Routing',
    accuracy: 88,
    rateLimitPerMinute: 150, // Free: 2.5k requests/day
    timeout: 4000,
    getUrl: (lat1, lon1, lat2, lon2) => 
      `https://api.tomtom.com/routing/1/calculateRoute/${lat1},${lon1}:${lat2},${lon2}/json?key=${process.env.TOMTOM_API_KEY}&routeType=fastest&traffic=false`,
    parseResponse: (data) => {
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const summary = route.summary;
        return {
          distance: summary.lengthInMeters / 1000, // Convert to km
          duration: summary.travelTimeInSeconds / 60 // Convert to minutes
        };
      }
      return null;
    },
    headers: { 'User-Agent': 'EconoMarket-App/1.0' }
  },
  {
    name: 'OSRM Demo',
    accuracy: 85,
    rateLimitPerMinute: 20, // Conservative limit for free tier
    timeout: 4000,
    getUrl: (lat1, lon1, lat2, lon2) => 
      `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false&alternatives=false&steps=false`,
    parseResponse: (data) => {
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          distance: route.distance / 1000, // Convert to km
          duration: route.duration / 60 // Convert to minutes
        };
      }
      return null;
    },
    headers: { 'User-Agent': 'EconoMarket-App/1.0' }
  },
  {
    name: 'OSRM Germany',
    accuracy: 82,
    rateLimitPerMinute: 15, // Conservative limit for free tier
    timeout: 4000,
    getUrl: (lat1, lon1, lat2, lon2) => 
      `https://routing.openstreetmap.de/routed-car/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false&alternatives=false&steps=false`,
    parseResponse: (data) => {
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          distance: route.distance / 1000, // Convert to km
          duration: route.duration / 60 // Convert to minutes
        };
      }
      return null;
    },
    headers: { 'User-Agent': 'EconoMarket-App/1.0' }
  },
  {
    name: 'MapQuest Directions',
    accuracy: 78,
    rateLimitPerMinute: 100, // Free: 15k requests/month
    timeout: 4000,
    getUrl: (lat1, lon1, lat2, lon2) => 
      `https://www.mapquestapi.com/directions/v2/route?key=${process.env.MAPQUEST_API_KEY}&from=${lat1},${lon1}&to=${lat2},${lon2}&routeType=fastest&unit=k`,
    parseResponse: (data) => {
      if (data.route && data.route.legs && data.route.legs.length > 0) {
        const leg = data.route.legs[0];
        return {
          distance: leg.distance, // Already in km
          duration: leg.time / 60 // Convert to minutes
        };
      }
      return null;
    },
    headers: { 'User-Agent': 'EconoMarket-App/1.0' }
  },
  {
    name: 'GraphHopper',
    accuracy: 75,
    rateLimitPerMinute: 50, // Free tier with API key
    timeout: 4000,
    getUrl: (lat1, lon1, lat2, lon2) => 
      `https://graphhopper.com/api/1/route?point=${lat1},${lon1}&point=${lat2},${lon2}&vehicle=car&key=${process.env.GRAPHHOPPER_API_KEY}`,
    parseResponse: (data) => {
      if (data.paths && data.paths.length > 0) {
        const path = data.paths[0];
        return {
          distance: path.distance / 1000, // Convert to km
          duration: path.time / 60000 // Convert to minutes
        };
      }
      return null;
    },
    headers: { 'User-Agent': 'EconoMarket-App/1.0' }
  },
  {
    name: 'Enhanced Calculation',
    accuracy: 70,
    rateLimitPerMinute: Infinity, // No limits
    timeout: 0,
    getUrl: () => '', // Not used
    parseResponse: () => null, // Not used
  }
];

// Cache for service usage and rate limiting
const serviceCache = new Map<string, {
  lastUsed: number;
  requestCount: number;
  failureCount: number;
  lastFailure: number;
  isTemporarilyDisabled: boolean;
}>();

// Initialize cache for all services
routingServices.forEach(service => {
  serviceCache.set(service.name, {
    lastUsed: 0,
    requestCount: 0,
    failureCount: 0,
    lastFailure: 0,
    isTemporarilyDisabled: false
  });
});

/**
 * Clear routing service cache to force fresh requests
 */
export function clearRoutingServiceCache() {
  serviceCache.forEach((cache, serviceName) => {
    cache.lastUsed = 0;
    cache.requestCount = 0;
    cache.failureCount = 0;
    cache.lastFailure = 0;
    cache.isTemporarilyDisabled = false;
  });
  logToFile('All routing service caches cleared');
}

/**
 * Clear the routing services log file
 */
export function clearRoutingLog() {
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const LOG_FILE = path.join(process.cwd(), 'routing-services.log');
      
      fs.writeFileSync(LOG_FILE, '');
      logToFile('Log file cleared');
    } catch (error) {
      // Silently fail if logging doesn't work
    }
  }
}

/**
 * Add delay for OSRM services to prevent overwhelming free tier
 */
function addOSRMDelay(serviceName: string): Promise<void> {
  if (serviceName.includes('OSRM')) {
    // Add small delay for OSRM services to prevent overwhelming
    return new Promise(resolve => setTimeout(resolve, 100));
  }
  return Promise.resolve();
}

/**
 * Check if a service is available and not rate-limited
 */
function isServiceAvailable(serviceName: string): boolean {
  const cache = serviceCache.get(serviceName);
  if (!cache) return false;
  
  const now = Date.now();
  const service = routingServices.find(s => s.name === serviceName);
  if (!service) return false;
  
  // Check if temporarily disabled due to failures
  if (cache.isTemporarilyDisabled && now - cache.lastFailure < 10 * 60 * 1000) {
    return false; // Disabled for 10 minutes after repeated failures
  }
  
  // Check rate limiting
  const timeSinceLastRequest = now - cache.lastUsed;
  const requestsPerMinute = service.rateLimitPerMinute;
  const minInterval = 60000 / requestsPerMinute; // Minimum interval between requests
  
  if (timeSinceLastRequest < minInterval) {
    return false; // Rate limited
  }
  
  // Reset failure count after successful period
  if (now - cache.lastFailure > 30 * 60 * 1000) { // 30 minutes
    cache.failureCount = 0;
    cache.isTemporarilyDisabled = false;
  }
  
  return true;
}

/**
 * Try to get route from a specific service
 */
async function tryRoutingService(
  service: RoutingService,
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): Promise<{ distance: number; duration: number; accuracy: number } | null> {
  const cache = serviceCache.get(service.name);
  if (!cache) return null;
  
  const now = Date.now();
  
  try {
    // Add delay for OSRM services to prevent overwhelming
    await addOSRMDelay(service.name);
    
    // Special case for Enhanced Calculation (no API call)
    if (service.name === 'Enhanced Calculation') {
      const result = await getEnhancedCalculation(lat1, lon1, lat2, lon2);
      cache.lastUsed = now;
      return {
        distance: result.distance,
        duration: result.duration,
        accuracy: service.accuracy
      };
    }
    
    // Make API request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), service.timeout);
    
    const response = await fetch(service.getUrl(lat1, lon1, lat2, lon2), {
      signal: controller.signal,
      headers: service.headers || {}
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const result = service.parseResponse(data);
    
    if (!result) {
      throw new Error('Invalid response format');
    }
    
    // Update cache on success
    cache.lastUsed = now;
    cache.requestCount++;
    cache.failureCount = 0;
    
    logToFile(`✅ ${service.name} - Distance: ${result.distance.toFixed(1)}km, Time: ${result.duration.toFixed(0)}min, Accuracy: ${service.accuracy}%`);
    
    return {
      distance: result.distance,
      duration: result.duration,
      accuracy: service.accuracy
    };
    
  } catch (error) {
    // Update cache on failure
    cache.lastFailure = now;
    cache.failureCount++;
    
    // Temporarily disable after 3 failures
    if (cache.failureCount >= 3) {
      cache.isTemporarilyDisabled = true;
    }
    
    logToFile(`❌ ${service.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

/**
 * Enhanced calculation fallback (same as before but extracted)
 */
async function getEnhancedCalculation(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): Promise<{ distance: number; duration: number }> {
  const straightLineDistance = calculateDistance(lat1, lon1, lat2, lon2);
  
  // Distance-based multipliers
  let drivingMultiplier;
  if (straightLineDistance <= 2) {
    drivingMultiplier = 1.2;
  } else if (straightLineDistance <= 5) {
    drivingMultiplier = 1.25;
  } else if (straightLineDistance <= 10) {
    drivingMultiplier = 1.3;
  } else if (straightLineDistance <= 20) {
    drivingMultiplier = 1.35;
  } else {
    drivingMultiplier = 1.4;
  }
  
  const drivingDistance = straightLineDistance * drivingMultiplier;
  
  // Speed-based calculations
  let averageSpeed;
  if (drivingDistance <= 2) {
    averageSpeed = 15;
  } else if (drivingDistance <= 5) {
    averageSpeed = 20;
  } else if (drivingDistance <= 10) {
    averageSpeed = 25;
  } else if (drivingDistance <= 20) {
    averageSpeed = 35;
  } else {
    averageSpeed = 45;
  }
  
  const drivingTimeMinutes = (drivingDistance / averageSpeed) * 60;
  const bufferTime = Math.min(5, drivingDistance * 0.5);
  const totalDurationMinutes = Math.ceil(drivingTimeMinutes + bufferTime);
  
  return {
    distance: drivingDistance,
    duration: totalDurationMinutes
  };
}

/**
 * Get actual driving distance using hierarchical routing services
 * @param lat1 User's latitude
 * @param lon1 User's longitude
 * @param lat2 Market's latitude
 * @param lon2 Market's longitude
 * @returns Promise with driving distance, duration, accuracy, and service used
 */
export async function getActualDrivingDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): Promise<{ distance: number; duration: number; accuracy: number; service: string } | null> {
  logToFile(`🚗 Getting route from (${lat1.toFixed(4)}, ${lon1.toFixed(4)}) to (${lat2.toFixed(4)}, ${lon2.toFixed(4)})`);
  
  // Try each service in order of accuracy
  for (const service of routingServices) {
    if (!isServiceAvailable(service.name)) {
      logToFile(`⏭️  Skipping ${service.name} (not available)`);
      continue;
    }
    
    logToFile(`🔄 Trying ${service.name} (${service.accuracy}% accuracy)...`);
    
    const result = await tryRoutingService(service, lat1, lon1, lat2, lon2);
    
    if (result) {
      return {
        distance: result.distance,
        duration: result.duration,
        accuracy: result.accuracy,
        service: service.name
      };
    }
  }
  
  logToFile('❌ All routing services failed');
  return null;
}
/**
 * Calculate estimated time from duration in minutes with better formatting
 * @param durationMinutes Duration in minutes
 * @returns Formatted time string
 */
export function formatDuration(durationMinutes: number): string {
  if (durationMinutes < 60) {
    return `${Math.round(durationMinutes)} min`;
  } else {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = Math.round(durationMinutes % 60);
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}min`;
  }
}

/**
 * Sort markets by actual driving distance with hierarchical routing services
 * @param markets Array of market objects
 * @param userLat User's latitude
 * @param userLng User's longitude
 * @returns Promise with sorted array of markets with actual driving distances and accuracy
 */
export async function sortMarketsByDrivingDistance(
  markets: any[],
  userLat: number,
  userLng: number
): Promise<any[]> {
  logToFile('🎯 Using hierarchical routing services for accurate distances');
  
  const results = await Promise.all(
    markets.map(async (market) => {
      if (!market.latitude || !market.longitude) {
        return {
          ...market,
          distance: 999,
          estimatedTime: "N/A",
          accuracy: 0,
          service: "None",
          isDrivingDistance: false
        };
      }

      const routingResult = await getActualDrivingDistance(
        userLat, 
        userLng, 
        market.latitude, 
        market.longitude
      );

      if (routingResult) {
        return {
          ...market,
          distance: Number(routingResult.distance.toFixed(1)),
          estimatedTime: formatDuration(routingResult.duration),
          accuracy: routingResult.accuracy,
          service: routingResult.service,
          isDrivingDistance: true
        };
      } else {
        // Final fallback to enhanced calculation
        const enhanced = await getEnhancedCalculation(
          userLat, 
          userLng, 
          market.latitude, 
          market.longitude
        );
        
        return {
          ...market,
          distance: Number(enhanced.distance.toFixed(1)),
          estimatedTime: formatDuration(enhanced.duration),
          accuracy: 70, // Enhanced calculation accuracy
          service: "Enhanced Calculation",
          isDrivingDistance: true
        };
      }
    })
  );

  // Sort by distance
  const sortedResults = results.sort((a, b) => a.distance - b.distance);
  
  // Log summary
  const serviceSummary = sortedResults.reduce((acc, market) => {
    acc[market.service] = (acc[market.service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  logToFile('📊 Service usage summary: ' + JSON.stringify(serviceSummary));
  
  return sortedResults;
}
