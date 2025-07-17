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
        console.error('Error getting location:', error)
        setLocationError('Erro ao obter localização')
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
