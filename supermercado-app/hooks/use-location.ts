import { useState, useEffect } from 'react'
import { sortMarketsByDistance } from '@/lib/location-utils'

interface UserLocation {
  lat: number
  lng: number
}

interface UseLocationReturn {
  userLocation: UserLocation | null
  isLoadingLocation: boolean
  locationError: string | null
  getCurrentLocation: () => void
  nearbyMarkets: any[]
  isLoadingMarkets: boolean
}

export function useLocation(): UseLocationReturn {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [nearbyMarkets, setNearbyMarkets] = useState<any[]>([])
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(false)

  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError('Geolocalização não é suportada neste navegador')
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
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
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    )
  }

  const loadNearbyMarkets = async (location: UserLocation) => {
    setIsLoadingMarkets(true)
    
    try {
      const response = await fetch('/api/market')
      if (response.ok) {
        const markets = await response.json()
        
        // Sort markets by distance from user location
        const sortedMarkets = sortMarketsByDistance(markets, location.lat, location.lng)
        
        // Get only nearby markets (within 10km)
        const nearby = sortedMarkets.filter(market => market.distance <= 10)
        
        setNearbyMarkets(nearby)
      }
    } catch (error) {
      console.error('Error loading markets:', error)
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
