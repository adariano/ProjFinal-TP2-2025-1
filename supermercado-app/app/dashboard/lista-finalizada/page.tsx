"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Navigation, DollarSign, Clock, Star, Route } from "lucide-react"
import Link from "next/link"
import { useLocation } from "@/hooks/use-location"
import { sortMarketsByDistance } from "@/lib/location-utils"

// Mock data para mercados
const mockMarkets = [
  {
    id: 1,
    name: "Atacadão",
    address: "Av. Marginal Tietê, 1500",
    distance: 1.2,
    estimatedTime: 8,
    totalPrice: 89.5,
    rating: 4.2,
    phone: "(11) 3456-7890",
    coordinates: { lat: -23.5505, lng: -46.6333 },
  },
  {
    id: 2,
    name: "Extra Hipermercado",
    address: "Av. Paulista, 1000",
    distance: 2.1,
    estimatedTime: 12,
    totalPrice: 94.8,
    rating: 4.5,
    phone: "(11) 3456-7891",
    coordinates: { lat: -23.5618, lng: -46.6565 },
  },
  {
    id: 3,
    name: "Carrefour",
    address: "Shopping Center Norte",
    distance: 3.5,
    estimatedTime: 18,
    totalPrice: 92.3,
    rating: 4.3,
    phone: "(11) 3456-7892",
    coordinates: { lat: -23.5129, lng: -46.6194 },
  },
  {
    id: 4,
    name: "Pão de Açúcar",
    address: "Rua Augusta, 500",
    distance: 0.8,
    estimatedTime: 6,
    totalPrice: 105.2,
    rating: 4.7,
    phone: "(11) 3456-7893",
    coordinates: { lat: -23.5489, lng: -46.6388 },
  },
  {
    id: 5,
    name: "Walmart",
    address: "Av. das Nações Unidas, 2000",
    distance: 4.2,
    estimatedTime: 22,
    totalPrice: 87.9,
    rating: 4.1,
    phone: "(11) 3456-7894",
    coordinates: { lat: -23.5955, lng: -46.689 },
  },
]

// Mock lista de compras
const mockShoppingList = {
  id: 1,
  name: "Compras da Semana",
  items: [
    { name: "Arroz Branco 5kg", quantity: 1, avgPrice: 18.9 },
    { name: "Feijão Preto 1kg", quantity: 2, avgPrice: 7.5 },
    { name: "Leite Integral 1L", quantity: 3, avgPrice: 4.5 },
    { name: "Pão de Forma", quantity: 1, avgPrice: 5.2 },
    { name: "Frango Inteiro Kg", quantity: 1, avgPrice: 12.8 },
  ],
}

export default function ListaFinalizadaPage() {
  const [user, setUser] = useState<any>(null)
  const [markets, setMarkets] = useState(mockMarkets)
  const [sortBy, setSortBy] = useState("price")
  const [manualAddress, setManualAddress] = useState("")
  const [useGPS, setUseGPS] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Use the location hook
  const { 
    userLocation, 
    isLoadingLocation, 
    locationError, 
    getCurrentLocation, 
    nearbyMarkets, 
    isLoadingMarkets 
  } = useLocation()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    if (useGPS && !userLocation) {
      getCurrentLocation()
    }
  }, [useGPS, userLocation, getCurrentLocation])

  useEffect(() => {
    sortMarkets()
  }, [sortBy, userLocation])

  // Update markets when nearbyMarkets changes
  useEffect(() => {
    if (nearbyMarkets.length > 0) {
      // Add mock pricing data to nearby markets
      const marketsWithPricing = nearbyMarkets.map(market => ({
        ...market,
        totalPrice: 85 + Math.random() * 30, // Random price between 85-115
        estimatedTime: Math.ceil(market.distance * 5), // Estimate 5 min per km
      }))
      setMarkets(marketsWithPricing)
    }
  }, [nearbyMarkets])

  const calculateDistance = (market: any) => {
    if (!userLocation) return market.distance
    // Use the utility function for consistent distance calculation
    return market.distance // Distance already calculated by the hook
  }

  const sortMarkets = () => {
    const sorted = [...markets].sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.totalPrice - b.totalPrice
        case "distance":
          const distanceA = userLocation ? calculateDistance(a) : a.distance
          const distanceB = userLocation ? calculateDistance(b) : b.distance
          return distanceA - distanceB
        case "combined":
          // Algoritmo que combina preço e distância (peso 50/50)
          const scoreA = (a.totalPrice / 100) * 0.5 + (userLocation ? calculateDistance(a) : a.distance) * 0.5
          const scoreB = (b.totalPrice / 100) * 0.5 + (userLocation ? calculateDistance(b) : b.distance) * 0.5
          return scoreA - scoreB
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })
    setMarkets(sorted)
  }

  const handleManualLocation = async () => {
    if (!manualAddress.trim()) {
      alert("Digite um endereço válido")
      return
    }
    
    try {
      // Use geocoding to convert address to coordinates
      const { geocodeAddress } = await import("@/lib/location-utils")
      const coords = await geocodeAddress(manualAddress)
      
      if (coords) {
        // Get markets sorted by distance from manual address
        const response = await fetch('/api/market')
        if (response.ok) {
          const apiMarkets = await response.json()
          const { sortMarketsByDistance } = await import("@/lib/location-utils")
          const sortedMarkets = sortMarketsByDistance(apiMarkets, coords.lat, coords.lng)
          
          // Add mock pricing data
          const marketsWithPricing = sortedMarkets.slice(0, 10).map(market => ({
            ...market,
            totalPrice: 85 + Math.random() * 30,
            estimatedTime: Math.ceil(market.distance * 5),
          }))
          
          setMarkets(marketsWithPricing)
        }
      } else {
        alert("Endereço não encontrado")
      }
    } catch (error) {
      console.error("Error geocoding address:", error)
      alert("Erro ao buscar endereço")
    }
  }

  const openInMaps = (market: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(market.address)}`
    window.open(url, "_blank")
  }

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold">Mercados Recomendados</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filtros e Localização */}
          <div className="space-y-6">
            {/* Lista Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{mockShoppingList.name}</CardTitle>
                <CardDescription>{mockShoppingList.items.length} itens na lista</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockShoppingList.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-gray-600">R$ {(item.quantity * item.avgPrice).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Localização */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sua Localização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="gps"
                      checked={useGPS}
                      onChange={() => setUseGPS(true)}
                      className="text-green-600"
                    />
                    <Label htmlFor="gps">Usar GPS</Label>
                  </div>
                  {useGPS && (
                    <Button
                      onClick={() => getCurrentLocation(true)}
                      disabled={isLoadingLocation}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      {isLoadingLocation ? "Obtendo..." : "Obter Localização"}
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="manual"
                      checked={!useGPS}
                      onChange={() => setUseGPS(false)}
                      className="text-green-600"
                    />
                    <Label htmlFor="manual">Endereço Manual</Label>
                  </div>
                  {!useGPS && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Digite seu endereço..."
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                      />
                      <Button onClick={handleManualLocation} variant="outline" size="sm" className="w-full">
                        Definir Localização
                      </Button>
                    </div>
                  )}
                </div>

                {userLocation && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">✓ Localização definida</p>
                    <p className="text-xs text-green-600">
                      {useGPS ? `GPS: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : `Endereço: ${manualAddress}`}
                    </p>
                  </div>
                )}
                {locationError && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-800">{locationError}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ordenação */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ordenar Por</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Menor Preço Total</SelectItem>
                    <SelectItem value="distance">Menor Distância</SelectItem>
                    <SelectItem value="combined">Melhor Custo-Benefício</SelectItem>
                    <SelectItem value="rating">Melhor Avaliação</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Mercados */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mercados Disponíveis</h2>
              <p className="text-gray-600">
                {markets.length} mercados encontrados • Ordenados por{" "}
                {sortBy === "price"
                  ? "menor preço"
                  : sortBy === "distance"
                    ? "menor distância"
                    : sortBy === "combined"
                      ? "melhor custo-benefício"
                      : "melhor avaliação"}
              </p>
            </div>

            <div className="space-y-4">
              {markets.map((market, index) => (
                <Card key={market.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{market.name}</h3>
                          {index === 0 && (
                            <Badge className="bg-green-600 text-white">
                              {sortBy === "price"
                                ? "Mais Barato"
                                : sortBy === "distance"
                                  ? "Mais Próximo"
                                  : sortBy === "combined"
                                    ? "Melhor Opção"
                                    : "Melhor Avaliado"}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{market.address}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{market.rating}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-600" />
                            <p className="text-lg font-bold text-green-600">R$ {market.totalPrice.toFixed(2)}</p>
                            <p className="text-xs text-gray-600">Total estimado</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <MapPin className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                            <p className="text-lg font-bold text-blue-600">
                              {userLocation ? calculateDistance(market).toFixed(1) : market.distance} km
                            </p>
                            <p className="text-xs text-gray-600">Distância</p>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <Clock className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                            <p className="text-lg font-bold text-orange-600">{market.estimatedTime} min</p>
                            <p className="text-xs text-gray-600">Tempo estimado</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button onClick={() => openInMaps(market)} className="bg-green-600 hover:bg-green-700">
                            <Route className="h-4 w-4 mr-2" />
                            Ver Rota
                          </Button>
                          <Button variant="outline">
                            <MapPin className="h-4 w-4 mr-2" />
                            Detalhes
                          </Button>
                          <Button variant="outline">Ligar: {market.phone}</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
