import { useState, useEffect } from 'react'
import { sortMarketsByDistance, clearRoutingServiceCache } from '@/lib/location-utils'

interface UserLocation {
  lat: number
  lng: number
}

interface UseLocationReturn {
  userLocation: UserLocation | null
  isLoadingLocation: boolean
  locationError: string | null
  getCurrentLocation: (forceRefresh?: boolean) => void
  nearbyMarkets: any[]
  isLoadingMarkets: boolean
}

export function useLocation(): UseLocationReturn {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [nearbyMarkets, setNearbyMarkets] = useState<any[]>([])
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(false)

  const getCurrentLocation = (forceRefresh: boolean = false) => {
    setIsLoadingLocation(true)
    setLocationError(null)

    // If this is a cache refresh, clear the routing service cache and markets
    if (forceRefresh) {
      clearRoutingServiceCache()
      setNearbyMarkets([])
      console.log('Cache refresh requested - clearing routing cache and markets')
    }

    if (!navigator.geolocation) {
      setLocationError('Geolocalização não é suportada neste navegador')
      setIsLoadingLocation(false)
      return
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: forceRefresh ? 0 : 300000, // Force fresh location if refreshing
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        console.log('Got user location:', location)
        setUserLocation(location)
        setIsLoadingLocation(false)
        
        // Save to localStorage for persistence
        localStorage.setItem('userLocation', JSON.stringify(location))
      },
      (error) => {
        // Handle geolocation errors silently to avoid console noise
        let errorMessage = 'Erro ao obter localização'
        
        try {
          // Check if error has a valid structure
          if (error && typeof error === 'object' && error.code !== undefined) {
            switch (Number(error.code)) {
              case 1: // PERMISSION_DENIED
                errorMessage = 'PERMISSION_DENIED'
                // Clear saved location when permission is denied
                localStorage.removeItem('userLocation')
                setUserLocation(null)
                setNearbyMarkets([])
                break
              case 2: // POSITION_UNAVAILABLE
                errorMessage = 'Localização indisponível'
                break
              case 3: // TIMEOUT
                errorMessage = 'Tempo esgotado'
                break
              default:
                errorMessage = 'Erro desconhecido'
            }
          } else if (error && typeof error === 'object' && error.message) {
            // Try to parse the error message
            if (error.message.includes('denied') || error.message.includes('permission')) {
              errorMessage = 'PERMISSION_DENIED'
              // Clear saved location when permission is denied
              localStorage.removeItem('userLocation')
              setUserLocation(null)
              setNearbyMarkets([])
            } else if (error.message.includes('timeout')) {
              errorMessage = 'Tempo esgotado'
            } else if (error.message.includes('unavailable')) {
              errorMessage = 'Localização indisponível'
            } else {
              errorMessage = 'Erro ao acessar localização'
            }
          } else {
            // Fallback for empty, null, or unexpected error structure
            // This commonly happens when user denies location permission
            errorMessage = 'PERMISSION_DENIED'
            // Clear saved location when permission is denied
            localStorage.removeItem('userLocation')
            setUserLocation(null)
            setNearbyMarkets([])
          }
        } catch (parseError) {
          // Default to permission denied on parsing errors
          errorMessage = 'PERMISSION_DENIED'
          // Clear saved location when permission is denied
          localStorage.removeItem('userLocation')
          setUserLocation(null)
          setNearbyMarkets([])
        }
        
        setLocationError(errorMessage)
        setIsLoadingLocation(false)
      },
      geoOptions
    )
  }

  const loadNearbyMarkets = async (location: UserLocation) => {
    setIsLoadingMarkets(true)
    
    try {
      console.log('Loading nearby markets for location:', location)
      const response = await fetch(
        `/api/market/nearby?lat=${location.lat}&lng=${location.lng}&radius=25&limit=20&driving=true`
      )
      
      if (response.ok) {
        const data = await response.json()
        console.log('Nearby markets API response:', data)
        setNearbyMarkets(data.markets || [])
      } else {
        console.log('Nearby markets API failed, trying fallback:', response.status)
        // Fallback to regular market API if nearby fails
        const fallbackResponse = await fetch('/api/market')
        if (fallbackResponse.ok) {
          const markets = await fallbackResponse.json()
          console.log('Fallback markets loaded:', markets.length)
          
          // Sort markets by distance from user location
          const sortedMarkets = sortMarketsByDistance(markets, location.lat, location.lng)
          
          // Get only nearby markets (within 25km)
          const nearby = sortedMarkets.filter(market => market.distance <= 25)
          console.log('Nearby markets after filtering:', nearby.length)
          
          setNearbyMarkets(nearby)
        }
      }
    } catch (error) {
      console.error('Error loading nearby markets:', error)
      // Fallback to empty array instead of crash
      setNearbyMarkets([])
    } finally {
      setIsLoadingMarkets(false)
    }
  }

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation')
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation)
        setUserLocation(location)
      } catch (error) {
        console.error('Error parsing saved location:', error)
      }
    }
  }, [])

  // Load nearby markets when location changes
  useEffect(() => {
    if (userLocation) {
      loadNearbyMarkets(userLocation)
    }
  }, [userLocation])

  return {
    userLocation,
    isLoadingLocation,
    locationError,
    getCurrentLocation,
    nearbyMarkets,
    isLoadingMarkets,
  }
}
