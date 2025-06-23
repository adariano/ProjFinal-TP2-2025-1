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
} from "lucide-react"
import Link from "next/link"
import { UserMenu } from "@/components/user-menu"

// Mock data for markets
const mockMarkets = [
  {
    id: 1,
    name: "Extra Hiper",
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo",
    distance: 0.8,
    rating: 4.2,
    reviews: 1250,
    phone: "(11) 3456-7890",
    hours: "06:00 - 00:00",
    categories: ["Supermercado", "Farmácia", "Padaria"],
    priceLevel: "$$",
    estimatedTime: "5 min",
    coordinates: { lat: -23.5615, lng: -46.6562 },
  },
  {
    id: 2,
    name: "Pão de Açúcar",
    address: "R. Augusta, 500 - Consolação, São Paulo",
    distance: 1.2,
    rating: 4.5,
    reviews: 890,
    phone: "(11) 2345-6789",
    hours: "07:00 - 23:00",
    categories: ["Supermercado", "Delicatessen"],
    priceLevel: "$$$",
    estimatedTime: "8 min",
    coordinates: { lat: -23.5505, lng: -46.6333 },
  },
  {
    id: 3,
    name: "Carrefour Express",
    address: "R. da Consolação, 300 - Centro, São Paulo",
    distance: 1.5,
    rating: 3.8,
    reviews: 650,
    phone: "(11) 1234-5678",
    hours: "24 horas",
    categories: ["Supermercado", "Conveniência"],
    priceLevel: "$",
    estimatedTime: "10 min",
    coordinates: { lat: -23.5431, lng: -46.6291 },
  },
  {
    id: 4,
    name: "Atacadão",
    address: "Av. Cruzeiro do Sul, 1500 - Canindé, São Paulo",
    distance: 2.3,
    rating: 4.0,
    reviews: 2100,
    phone: "(11) 9876-5432",
    hours: "07:00 - 22:00",
    categories: ["Atacado", "Supermercado"],
    priceLevel: "$",
    estimatedTime: "15 min",
    coordinates: { lat: -23.5089, lng: -46.6228 },
  },
  {
    id: 5,
    name: "Mercado São Luiz",
    address: "R. Haddock Lobo, 200 - Cerqueira César, São Paulo",
    distance: 2.8,
    rating: 4.3,
    reviews: 420,
    phone: "(11) 8765-4321",
    hours: "06:30 - 22:30",
    categories: ["Supermercado", "Orgânicos"],
    priceLevel: "$$$",
    estimatedTime: "18 min",
    coordinates: { lat: -23.5629, lng: -46.6544 },
  },
]

export default function MercadosPage() {
  const [user, setUser] = useState<any>(null)
  const [searchAddress, setSearchAddress] = useState("")
  const [currentLocation, setCurrentLocation] = useState<string>("")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [markets, setMarkets] = useState(mockMarkets)
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "price">("distance")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const getCurrentLocation = () => {
    setIsLoadingLocation(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // Simulate reverse geocoding
          setCurrentLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`)
          setIsLoadingLocation(false)

          // In a real app, you would calculate actual distances here
          // For now, we'll just simulate updated distances
          const updatedMarkets = mockMarkets.map((market) => ({
            ...market,
            distance: Math.random() * 5 + 0.5, // Random distance between 0.5-5.5km
          }))
          setMarkets(updatedMarkets)
        },
        (error) => {
          console.error("Error getting location:", error)
          setCurrentLocation("Erro ao obter localização")
          setIsLoadingLocation(false)
        },
      )
    } else {
      setCurrentLocation("Geolocalização não suportada")
      setIsLoadingLocation(false)
    }
  }

  const searchByAddress = () => {
    if (!searchAddress.trim()) return

    // Simulate address search
    setCurrentLocation(searchAddress)
    const updatedMarkets = mockMarkets.map((market) => ({
      ...market,
      distance: Math.random() * 8 + 0.3, // Random distance for searched address
    }))
    setMarkets(updatedMarkets)
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
          const priceOrder = { $: 1, $$: 2, $$$: 3 }
          return (
            priceOrder[a.priceLevel as keyof typeof priceOrder] - priceOrder[b.priceLevel as keyof typeof priceOrder]
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
        return "Econômico"
      case "$$":
        return "Moderado"
      case "$$$":
        return "Premium"
      default:
        return "N/A"
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
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
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

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mercados Próximos</h1>
          <p className="text-gray-600">Encontre os melhores mercados na sua região</p>
        </div>

        {/* Location Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Localização
            </CardTitle>
            <CardDescription>Use sua localização atual ou busque por um endereço específico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
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
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                className="bg-green-600 hover:bg-green-700"
              >
                <Locate className="h-4 w-4 mr-2" />
                {isLoadingLocation ? "Localizando..." : "Minha Localização"}
              </Button>
            </div>
            {currentLocation && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Localização atual: {currentLocation}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
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
        <div className="space-y-4">
          {markets.map((market) => (
            <Card key={market.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{market.name}</h3>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {market.distance.toFixed(1)} km
                      </Badge>
                      <Badge variant="outline">{getPriceLevelText(market.priceLevel)}</Badge>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{market.rating}</span>
                        <span className="text-gray-600">({market.reviews} avaliações)</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{market.hours}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600">{market.address}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {market.categories.map((category, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{market.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Navigation className="h-4 w-4" />
                        <span>~{market.estimatedTime} de carro</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button onClick={() => openInMaps(market)} className="bg-blue-600 hover:bg-blue-700">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver Rota
                    </Button>
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Ligar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {markets.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum mercado encontrado</h3>
              <p className="text-gray-600">Tente buscar por um endereço diferente ou use sua localização atual.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
