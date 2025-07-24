"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  MapPin,
  Navigation,
  Star,
  Clock,
  Phone,
  ExternalLink,
  Search,
  Locate,
  Filter,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { UserMenu } from "@/components/user-menu"
import { AddMarketDialog } from "@/components/add-market-dialog"
import { RateMarketDialog } from "@/components/rate-market-dialog"
import { EditMarketDialog } from "@/components/edit-market-dialog"
import { AccuracyMeter } from "@/components/accuracy-meter"
import { useLocation } from "@/hooks/use-location"
import { 
  sortMarketsByDistance, 
  sortMarketsByDrivingDistance,
  reverseGeocode, 
  geocodeAddress 
} from "@/lib/location-utils"

export default function MercadosPage() {
  const [user, setUser] = useState<any>(null)
  const [searchAddress, setSearchAddress] = useState("")
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "price">("distance")
  const [showAddMarketDialog, setShowAddMarketDialog] = useState(false)
  const [showRateMarketDialog, setShowRateMarketDialog] = useState(false)
  const [showEditMarketDialog, setShowEditMarketDialog] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState<any>(null)
  const router = useRouter()

  // Use the location hook
  const { 
    userLocation, 
    isLoadingLocation, 
    locationError, 
    getCurrentLocation, 
    nearbyMarkets, 
    isLoadingMarkets 
  } = useLocation()

  // Use nearbyMarkets from the hook, fallback to API for admin
  const [markets, setMarkets] = useState<any[]>([])
  const [isLoadingAllMarkets, setIsLoadingAllMarkets] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  // Update markets based on user role and location
  useEffect(() => {
    if (!user) return

    console.log('Markets page: user role:', user.role)
    console.log('Markets page: nearbyMarkets length:', nearbyMarkets.length)

    if (user.role === 'ADMIN') {
      // Admin sees all markets from API
      const loadMarkets = async () => {
        setIsLoadingAllMarkets(true)
        try {
          const response = await fetch('/api/market')
          if (response.ok) {
            const apiMarkets = await response.json()
            console.log('Admin markets loaded:', apiMarkets.length)
            
            // Transform API data to match expected format
            const transformedMarkets = apiMarkets.map((market: any) => ({
              ...market,
              categories: market.categories ? market.categories.split(",").map((c: string) => c.trim()).filter((c: string) => c) : ['Supermercado'],
              reviews: market.reviews || 0,
              estimatedTime: market.estimatedTime || (market.distance ? `${Math.round(market.distance / 25 * 60)} min` : "5 min"),
              coordinates: market.coordinates || { lat: market.latitude || 0, lng: market.longitude || 0 },
            }))
            
            setMarkets(transformedMarkets)
          } else {
            console.error('Failed to load markets')
            setMarkets([])
          }
        } catch (error) {
          console.error('Error loading markets:', error)
          setMarkets([])
        } finally {
          setIsLoadingAllMarkets(false)
        }
      }
      loadMarkets()
    } else {
      // Regular users see nearby markets from location hook
      console.log('Setting nearbyMarkets:', nearbyMarkets)
      setMarkets(nearbyMarkets)
    }
  }, [user, nearbyMarkets])

  const searchByAddress = async () => {
    if (!searchAddress.trim()) return

    try {
      const coords = await geocodeAddress(searchAddress)
      if (coords) {
        if (user?.role === 'ADMIN') {
          // For admin users, load all markets and sort by actual driving distance
          const response = await fetch('/api/market')
          if (response.ok) {
            const apiMarkets = await response.json()
            const sortedMarkets = await sortMarketsByDrivingDistance(apiMarkets, coords.lat, coords.lng)
            setMarkets(sortedMarkets.slice(0, 20)) // Show top 20 nearest
          }
        } else {
          // For regular users, use the nearby API with driving distances
          const response = await fetch(
            `/api/market/nearby?lat=${coords.lat}&lng=${coords.lng}&radius=15&limit=20&driving=true`
          )
          if (response.ok) {
            const data = await response.json()
            let markets = data.markets || []
            
            // Try to get 100% accurate routes from Google Maps for searched address
            if (markets.length > 0) {
              console.log('Starting progressive route enhancement with Google Maps for searched address...')
              
              try {
                // Start progressive enhancement for all markets using the API
                const progressiveEnhancement = async () => {
                  for (const market of markets) {
                    try {
                      const routeResponse = await fetch('/api/route/crawl', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          userLat: coords.lat,
                          userLng: coords.lng,
                          marketId: market.id,
                          marketName: market.name,
                          marketLat: market.latitude,
                          marketLng: market.longitude,
                        }),
                      })
                      
                      if (routeResponse.ok) {
                        const routeResult = await routeResponse.json()
                        if (routeResult.success && routeResult.data) {
                          // Update the specific market with enhanced data
                          setMarkets(prevMarkets => 
                            prevMarkets.map(prevMarket => {
                              if (prevMarket.id === market.id) {
                                const updatedMarket = {
                                  ...prevMarket,
                                  estimatedTime: routeResult.data.estimatedTime,
                                  accuracy: routeResult.data.accuracy,
                                  service: routeResult.data.service,
                                  googleMapsUrl: routeResult.data.url,
                                  distance: routeResult.data.distance.includes('km') 
                                    ? parseFloat(routeResult.data.distance.replace('km', '').trim())
                                    : prevMarket.distance,
                                  isProgressivelyEnhanced: true // Flag to trigger fade effect
                                };
                                
                                // Clear the progressive enhancement flag after 3 seconds
                                setTimeout(() => {
                                  setMarkets(prevMarkets => 
                                    prevMarkets.map(m => 
                                      m.id === market.id ? { ...m, isProgressivelyEnhanced: false } : m
                                    )
                                  );
                                }, 3000);
                                
                                return updatedMarket;
                              }
                              return prevMarket;
                            })
                          );
                        }
                      }
                      
                      // Add delay between requests to avoid overwhelming the service
                      await new Promise(resolve => setTimeout(resolve, 2000));
                    } catch (error) {
                      console.error(`Error crawling route for market ${market.name}:`, error)
                    }
                  }
                };
                
                // Start progressive enhancement in background
                progressiveEnhancement();
                
                console.log('Progressive enhancement started in background')
              } catch (error) {
                console.error('Error starting progressive enhancement:', error)
              }
            }
            
            setMarkets(markets)
          }
        }
      }
    } catch (error) {
      console.error('Error searching by address:', error)
    }
  }

  const sortMarkets = (criteria: "distance" | "rating" | "price") => {
    setSortBy(criteria)
    const sorted = [...markets].sort((a, b) => {
      switch (criteria) {
        case "distance":
          return a.distance - b.distance
        case "rating":
          return b.rating - a.rating
        case "price":
          const priceOrder = { 
            $: 1, $$: 2, $$$: 3,
            BAIXO: 1, MEDIO: 2, ALTO: 3 
          }
          return (
            (priceOrder[a.priceLevel as keyof typeof priceOrder] || 2) - 
            (priceOrder[b.priceLevel as keyof typeof priceOrder] || 2)
          )
        default:
          return 0
      }
    })
    setMarkets(sorted)
  }

  const getPriceLevelText = (level: string) => {
    switch (level) {
      case "$":
      case "BAIXO":
        return "Econômico"
      case "$$":
      case "MEDIO":
        return "Moderado"
      case "$$$":
      case "ALTO":
        return "Premium"
      default:
        return "Moderado" // Default to Moderado instead of N/A
    }
  }

  const getPriceLevelColor = (level: string) => {
    switch (level) {
      case "$":
      case "BAIXO":
        return "bg-green-100 text-green-800"
      case "$$":
      case "MEDIO":
        return "bg-yellow-100 text-yellow-800"
      case "$$$":
      case "ALTO":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const openInMaps = (market: any) => {
    let url = market.googleMapsUrl

    // If we have user location, generate a directions URL
    if (userLocation) {
      // Create a directions URL from user location to market
      const destination = market.latitude && market.longitude 
        ? `${market.latitude},${market.longitude}`
        : encodeURIComponent(market.address)
      
      url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destination}`
    } else if (!url) {
      // Fallback: just open the market location
      const destination = market.latitude && market.longitude 
        ? `${market.latitude},${market.longitude}`
        : encodeURIComponent(market.address)
      
      url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`
    }

    window.open(url, "_blank")
  }

  const openRouteInOSM = (market: any) => {
    if (userLocation && market.latitude && market.longitude) {
      // Open the route in OpenStreetMap (the source of our distance calculation)
      const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation.lat}%2C${userLocation.lng}%3B${market.latitude}%2C${market.longitude}`
      window.open(url, "_blank")
    } else {
      // Fallback: just show the market location
      const url = `https://www.openstreetmap.org/?mlat=${market.latitude}&mlon=${market.longitude}&zoom=16`
      window.open(url, "_blank")
    }
  }

  const handleMarketAdded = (newMarket: any) => {
    setMarkets(prev => [newMarket, ...prev])
  }

  const handleMarketUpdated = (updatedMarket: any) => {
    setMarkets(prev => prev.map(market => 
      market.id === updatedMarket.id ? updatedMarket : market
    ))
  }

  const handleRatingSubmitted = (marketId: number, rating: number, comment: string) => {
    setMarkets(prev => prev.map(market => 
      market.id === marketId 
        ? { 
            ...market, 
            rating: ((market.rating * market.reviews) + rating) / (market.reviews + 1),
            reviews: market.reviews + 1,
            userRating: rating,
            userComment: comment
          }
        : market
    ))
  }

  const handleRateMarket = (market: any) => {
    setSelectedMarket(market)
    setShowRateMarketDialog(true)
  }

  const handleEditMarket = (market: any) => {
    setSelectedMarket(market)
    setShowEditMarketDialog(true)
  }

  const handleDeleteMarket = async (market: any) => {
    if (!window.confirm(`Tem certeza que deseja excluir o mercado "${market.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/market?id=${market.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir mercado')
      }

      // Remove the market from the local state
      setMarkets(prev => prev.filter(m => m.id !== market.id))
      alert('Mercado excluído com sucesso!')
    } catch (error) {
      console.error('Error deleting market:', error)
      alert('Erro ao excluir mercado. Tente novamente.')
    }
  }

  const isAdmin = user?.role === 'ADMIN'

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">EconoMarket</span>
            </Link>
            <div className="flex items-center gap-4">
              <UserMenu user={user} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Mercados Próximos</h1>
              <p className="text-gray-600">Encontre os melhores mercados na sua região</p>
            </div>
            {isAdmin && (
              <Button 
                onClick={() => setShowAddMarketDialog(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Mercado
              </Button>
            )}
          </div>
        </div>

        {/* Location Search */}
        {!isAdmin && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização
              </CardTitle>
              <CardDescription>Use sua localização atual ou busque por um endereço específico</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Digite um endereço..."
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchByAddress()}
                  />
                </div>
                <Button onClick={searchByAddress} variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button
                  onClick={() => getCurrentLocation(true)}
                  disabled={isLoadingLocation || isLoadingMarkets}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Locate className="h-4 w-4 mr-2" />
                  {isLoadingLocation ? "Localizando..." : isLoadingMarkets ? "Atualizando..." : "Minha Localização"}
                </Button>
              </div>
              {userLocation && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Localização atual: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
                </div>
              )}
              {locationError && (
                <div className="text-sm text-red-600">
                  {locationError}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Admin Info Card */}
        {isAdmin && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Modo Administrador</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Você está visualizando todos os mercados do sistema. Use o botão "Adicionar Mercado" para cadastrar novos estabelecimentos.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-5">
          <CardContent className="p-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Ordenar por:</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={sortBy === "distance" ? "default" : "outline"}
                  size="sm"
                  onClick={() => sortMarkets("distance")}
                >
                  Distância
                </Button>
                <Button
                  variant={sortBy === "rating" ? "default" : "outline"}
                  size="sm"
                  onClick={() => sortMarkets("rating")}
                >
                  Avaliação
                </Button>
                <Button
                  variant={sortBy === "price" ? "default" : "outline"}
                  size="sm"
                  onClick={() => sortMarkets("price")}
                >
                  Preço
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Markets List */}
        <div className="space-y-3">
          {/* Progressive Enhancement Status */}
          {markets.length > 0 && markets.some(m => !m.isProgressivelyEnhanced && m.accuracy !== 100) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Aprimorando rotas com precisão 100% em tempo real...</span>
              </div>
            </div>
          )}
          
          {(isLoadingMarkets || isLoadingAllMarkets) ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando mercados...</p>
              <p className="text-sm text-gray-500 mt-2">Obtendo rotas precisas do Google Maps...</p>
            </div>
          ) : (
            markets.map((market) => (
              <Card key={market.id} className="hover:shadow-md transition-all duration-300 group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{market.name}</h3>
                        {market.distance !== undefined && (
                          <Badge 
                            variant="secondary" 
                            className={`bg-green-100 text-green-800 transition-all duration-500 ${
                              market.isProgressivelyEnhanced ? 'animate-pulse' : ''
                            }`}
                          >
                            {market.distance.toFixed(1)} km
                          </Badge>
                        )}
                        <Badge variant="outline" className={getPriceLevelColor(market.priceLevel)}>
                          {getPriceLevelText(market.priceLevel)}
                        </Badge>
                        {market.accuracy === 100 && (
                          <Badge 
                            variant="secondary" 
                            className={`bg-blue-100 text-blue-800 transition-all duration-500 ${
                              market.isProgressivelyEnhanced ? 'animate-pulse' : ''
                            }`}
                          >
                            ✓ Rota Precisa
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{market.rating?.toFixed(1) || "N/A"}</span>
                          <span className="text-gray-600">({market.reviews || 0} avaliações)</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{market.hours || "Horário não informado"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-600">{market.address}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        {market.categories && market.categories.length > 0 ? (
                          market.categories.map((category: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Supermercado
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{market.phone || "Telefone não informado"}</span>
                        </div>
                        {market.distance !== undefined && (
                          <div className="flex items-center gap-1">
                            <Navigation className="h-4 w-4" />
                            <button
                              onClick={() => openRouteInOSM(market)}
                              className={`text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-all duration-500 ${
                                market.isProgressivelyEnhanced ? 'animate-pulse' : ''
                              }`}
                              title="Ver rota no OpenStreetMap"
                            >
                              ~{market.estimatedTime || (market.distance ? `${Math.round(market.distance / 25 * 60)} min` : "5 min")} de carro
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Accuracy Meter - Hidden by default, shown on hover */}
                      <div className="mt-4 pt-3 border-t border-gray-100 opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-20 transition-all duration-300 ease-in-out">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Precisão das informações:</span>
                          <AccuracyMeter 
                            accuracy={market.accuracy || 75} 
                            service={market.service || 'straight-line'} 
                            isProgressivelyEnhanced={market.isProgressivelyEnhanced}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button onClick={() => openInMaps(market)} className="bg-blue-600 hover:bg-blue-700">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver Rota
                      </Button>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRateMarket(market)}
                          className="flex-1"
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Avaliar
                        </Button>
                        {isAdmin && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditMarket(market)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        )}
                        {isAdmin && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteMarket(market)}
                            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Excluir
                          </Button>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Ligar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {!(isLoadingMarkets || isLoadingAllMarkets) && markets.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum mercado encontrado</h3>
              <p className="text-gray-600 mb-4">
                {isAdmin 
                  ? "Comece adicionando o primeiro mercado ao sistema." 
                  : "Tente buscar por um endereço diferente, usar sua localização atual ou aumentar o raio de busca."
                }
              </p>
              {!isAdmin && !userLocation && (
                <Button
                  onClick={() => getCurrentLocation(true)}
                  disabled={isLoadingLocation || isLoadingMarkets}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Locate className="h-4 w-4 mr-2" />
                  {isLoadingLocation ? "Localizando..." : isLoadingMarkets ? "Atualizando..." : "Usar Minha Localização"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Market Dialog */}
      <AddMarketDialog
        open={showAddMarketDialog}
        onOpenChange={setShowAddMarketDialog}
        onMarketAdded={handleMarketAdded}
      />

      {/* Rate Market Dialog */}
      <RateMarketDialog
        open={showRateMarketDialog}
        onOpenChange={setShowRateMarketDialog}
        market={selectedMarket}
        onRatingSubmitted={handleRatingSubmitted}
      />

      {/* Edit Market Dialog */}
      <EditMarketDialog
        open={showEditMarketDialog}
        onOpenChange={setShowEditMarketDialog}
        market={selectedMarket}
        onMarketUpdated={handleMarketUpdated}
      />
    </div>
  )
}
