"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  X,
  ShoppingCart,
  Search,
  Package,
  MapPin,
  Plus,
  Save,
  CheckCircle,
  Camera,
  Star,
  TrendingUp,
  Loader2
} from "lucide-react"
import Link from "next/link"
import CollectItemDialog from "@/components/collect-item-dialog"
import { ProductReviews } from "@/components/product-reviews"
import { MarketRecommendationDialog } from "@/components/market-recommendation-dialog"
import { useLocation } from "@/hooks/use-location"
import { calculateDistance } from "@/lib/location-utils"

// Mock products database
const mockProducts = [
  {
    id: 1,
    name: "Arroz Branco 5kg",
    category: "Grãos",
    avgPrice: 18.9,
    lastUpdate: "Hoje",
    bestPrice: 17.0,
    bestMarket: "Atacadão",
  },
  {
    id: 2,
    name: "Feijão Preto 1kg",
    category: "Grãos",
    avgPrice: 7.5,
    lastUpdate: "Ontem",
    bestPrice: 6.5,
    bestMarket: "Atacadão",
  },
  {
    id: 3,
    name: "Leite Integral 1L",
    category: "Laticínios",
    avgPrice: 4.5,
    lastUpdate: "Hoje",
    bestPrice: 4.0,
    bestMarket: "Atacadão",
  },
  {
    id: 4,
    name: "Pão de Forma",
    category: "Padaria",
    avgPrice: 5.2,
    lastUpdate: "Hoje",
    bestPrice: 4.8,
    bestMarket: "Atacadão",
  },
  {
    id: 5,
    name: "Frango Inteiro Kg",
    category: "Carnes",
    avgPrice: 12.8,
    lastUpdate: "2h",
    bestPrice: 11.5,
    bestMarket: "Atacadão",
  },
  {
    id: 6,
    name: "Banana Prata Kg",
    category: "Frutas",
    avgPrice: 6.9,
    lastUpdate: "Hoje",
    bestPrice: 6.0,
    bestMarket: "Atacadão",
  },
  {
    id: 7,
    name: "Tomate Kg",
    category: "Verduras",
    avgPrice: 8.5,
    lastUpdate: "1h",
    bestPrice: 7.5,
    bestMarket: "Atacadão",
  },
  {
    id: 8,
    name: "Detergente 500ml",
    category: "Limpeza",
    avgPrice: 2.8,
    lastUpdate: "Ontem",
    bestPrice: 2.5,
    bestMarket: "Atacadão",
  },
]

// Mock markets data
const mockMarkets = [
  {
    id: 1,
    name: "Atacadão",
    address: "Av. Marginal Tietê, 1500",
    coordinates: { lat: -23.5505, lng: -46.6333 },
    rating: 4.2,
    phone: "(11) 3456-7890",
    priceLevel: "Econômico",
  },
  {
    id: 2,
    name: "Extra Hipermercado",
    address: "Av. Paulista, 1000",
    coordinates: { lat: -23.5618, lng: -46.6565 },
    rating: 4.5,
    phone: "(11) 3456-7891",
    priceLevel: "Moderado",
  },
  {
    id: 3,
    name: "Carrefour",
    address: "Shopping Center Norte",
    coordinates: { lat: -23.5129, lng: -46.6194 },
    rating: 4.3,
    phone: "(11) 3456-7892",
    priceLevel: "Moderado",
  },
  {
    id: 4,
    name: "Pão de Açúcar",
    address: "Rua Augusta, 500",
    coordinates: { lat: -23.5489, lng: -46.6388 },
    rating: 4.7,
    phone: "(11) 3456-7893",
    priceLevel: "Premium",
  },
]

// Mock user history data
const mockUserHistory: { [key: number]: number[] } = {
  1: [18.5, 17.9, 19.2], // Arroz
  2: [7.2, 6.8, 7.5], // Feijão
  3: [4.2, 4.5, 4.1], // Leite
}

interface ShoppingListItem {
  id: number
  name: string
  quantity: number
  avgPrice: number
  collected?: boolean
  actualPrice?: number
}

export default function NovaListaPage() {
  const [user, setUser] = useState<any>(null)
  const [listName, setListName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState<ShoppingListItem[]>([])
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [collectDialogOpen, setCollectDialogOpen] = useState(false)
  const [selectedItemForCollection, setSelectedItemForCollection] = useState<ShoppingListItem | null>(null)
  const [showReviews, setShowReviews] = useState<number | null>(null)
  const [productsLoading, setProductsLoading] = useState(true)
  const [gpsLoading, setGpsLoading] = useState(false)

  // New states for advanced features
  const [priceEstimates, setPriceEstimates] = useState<{ [key: number]: any }>({})
  const [showEstimates, setShowEstimates] = useState(false)
  const [recommendedMarkets, setRecommendedMarkets] = useState<any[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [sortBy, setSortBy] = useState("price")
  const [showRecommendationDialog, setShowRecommendationDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [locationRequested, setLocationRequested] = useState(false)

  // Use location hook
  const { 
    userLocation: userLocationHook, 
    isLoadingLocation, 
    locationError, 
    nearbyMarkets, 
    isLoadingMarkets 
  } = useLocation()

  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  // Auto request location when page loads
  useEffect(() => {
    if (!locationRequested && !userLocationHook && !isLoadingLocation) {
      updateUserLocation()
    }
  }, [])

  // Update local state when hook location changes
  useEffect(() => {
    if (userLocationHook) {
      setUserLocation(userLocationHook)
    }
  }, [userLocationHook])

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      setProductsLoading(true)
      try {
        const response = await fetch('/api/product')
        if (response.ok) {
          const products = await response.json()
          // Transform API data to match the expected format
          const transformedProducts = products.map((product: any) => ({
            ...product,
            bestPrice: product.avgPrice * 0.9, // Simulate best price
            bestMarket: "Atacadão", // Default best market
          }))
          setFilteredProducts(transformedProducts)
        } else {
          console.error('Failed to load products')
          // Fallback to mock data
          setFilteredProducts(mockProducts)
        }
      } catch (error) {
        console.error('Error loading products:', error)
        // Fallback to mock data
        setFilteredProducts(mockProducts)
      } finally {
        setProductsLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(mockProducts)
    }
  }, [searchTerm])

  useEffect(() => {
    if (userLocation && selectedItems.length > 0) {
      getMarketRecommendations()
    }
  }, [userLocation, sortBy])

  // Helper functions for price estimation
  const getUserHistoryPrice = (productId: number) => {
    const history = mockUserHistory[productId]
    if (!history || history.length === 0) return null
    return history.reduce((sum: number, price: number) => sum + price, 0) / history.length
  }

  const getCommunityAveragePrice = (productId: number) => {
    const product = mockProducts.find((p) => p.id === productId)
    return product ? product.avgPrice : 0
  }

  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((point2.lat - point1.lat) * Math.PI) / 180
    const dLng = ((point2.lng - point1.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.lat * Math.PI) / 180) *
        Math.cos((point2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const calculateMarketTotal = (marketId: number) => {
    // Simulate market-specific pricing
    const priceMultipliers: { [key: number]: number } = { 1: 0.9, 2: 1.0, 3: 0.95, 4: 1.15 }
    const multiplier = priceMultipliers[marketId] || 1.0

    return selectedItems.reduce((total, item) => {
      const estimate = (priceEstimates as any)[item.id]?.estimated || item.avgPrice
      return total + estimate * item.quantity * multiplier
    }, 0)
  }

  const sortMarkets = (markets: any[], sortBy: string) => {
    return markets.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.estimatedTotal - b.estimatedTotal
        case "distance":
          return a.distance - b.distance
        case "combined":
          // Weighted score: 60% price, 40% distance
          const scoreA = (a.estimatedTotal / 100) * 0.6 + a.distance * 0.4
          const scoreB = (b.estimatedTotal / 100) * 0.6 + b.distance * 0.4
          return scoreA - scoreB
        default:
          return 0
      }
    })
  }

  const calculatePriceEstimates = () => {
    const estimates: { [key: number]: any } = {}
    selectedItems.forEach((item) => {
      const userHistoryPrice = getUserHistoryPrice(item.id)
      const communityAvgPrice = getCommunityAveragePrice(item.id)
      const estimatedPrice = userHistoryPrice ? userHistoryPrice * 0.7 + communityAvgPrice * 0.3 : communityAvgPrice

      estimates[item.id] = {
        estimated: estimatedPrice,
        userHistory: userHistoryPrice,
        communityAvg: communityAvgPrice,
        confidence: userHistoryPrice ? 85 : 65,
      }
    })
    setPriceEstimates(estimates)
    setShowEstimates(true)
  }

  const getMarketRecommendations = async () => {
    try {
      // Use nearby markets from the location hook if available
      let markets = nearbyMarkets.length > 0 ? nearbyMarkets : mockMarkets

      // If we have user location, calculate distances for mock markets
      if (userLocation && nearbyMarkets.length === 0) {
        markets = mockMarkets.map((market) => ({
          ...market,
          distance: calculateDistance(userLocation, market.coordinates),
        }))
      }

      // Calculate estimated totals for each market
      const marketsWithTotals = markets.map((market) => ({
        ...market,
        estimatedTotal: calculateMarketTotal(market.id),
        distance: market.distance || (userLocation ? calculateDistance(userLocation, market.coordinates) : Math.random() * 5 + 1),
      }))

      const sorted = sortMarkets(marketsWithTotals, sortBy)
      setRecommendedMarkets(sorted)
    } catch (error) {
      console.error('Error getting market recommendations:', error)
      // Fallback to mock markets
      const fallbackMarkets = mockMarkets.map((market) => ({
        ...market,
        estimatedTotal: calculateMarketTotal(market.id),
        distance: Math.random() * 5 + 1,
      }))
      setRecommendedMarkets(fallbackMarkets)
    }
  }

  const updateUserLocation = () => {
    if (!locationRequested) {
      setLocationRequested(true)
      setGpsLoading(true)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
            setGpsLoading(false)
          },
          (error) => {
            console.error("Erro ao obter localização:", error)
            setUserLocation(null)
            setGpsLoading(false)
          },
        )
      } else {
        setUserLocation(null)
        setGpsLoading(false)
      }
    }
  }

  const addItem = (product: any) => {
    if (!selectedItems.find((item) => item.id === product.id)) {
      setSelectedItems([
        ...selectedItems,
        {
          ...product,
          quantity: 1,
          collected: false,
          actualPrice: null,
          collectedAt: null,
        },
      ])
    }
  }

  const removeItem = (productId: number) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setSelectedItems(selectedItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const handleCollectItem = (item: any) => {
    setSelectedItemForCollection(item)
    setCollectDialogOpen(true)
  }

  const handleItemCollected = (itemId: number, actualPrice: number, method: string) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              collected: true,
              actualPrice,
              collectedAt: new Date().toISOString(),
              collectionMethod: method,
            }
          : item,
      ),
    )
    setCollectDialogOpen(false)
    setSelectedItemForCollection(null)
  }

  const getTotalEstimated = () => {
    return selectedItems.reduce((total, item) => total + item.avgPrice * item.quantity, 0)
  }

  const getTotalActual = () => {
    return selectedItems.reduce((total, item) => {
      if (item.collected && item.actualPrice) {
        return total + item.actualPrice * item.quantity
      }
      return total + item.avgPrice * item.quantity
    }, 0)
  }

  const getCollectedCount = () => {
    return selectedItems.filter((item) => item.collected).length
  }

  const handleCalculateEstimates = () => {
    if (selectedItems.length === 0) {
      alert("Adicione itens à lista primeiro")
      return
    }
    calculatePriceEstimates()
    getMarketRecommendations()
  }

  const showMarketRecommendations = (markets: any[]) => {
    if (markets.length === 0) return
    setShowRecommendationDialog(true)
  }

  const handleNavigateToMarket = (market: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(market.address)}`
    window.open(url, "_blank")
  }

  const handleSaveList = async () => {
    if (isSaving) return // Previne cliques múltiplos

    if (!listName.trim()) {
      alert("Digite um nome para a lista")
      return
    }
    if (selectedItems.length === 0) {
      alert("Adicione pelo menos um item à lista")
      return
    }

    setIsSaving(true)

    try {
      // First create the shopping list
      const createListResponse = await fetch('/api/shopping_list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: listName.trim(),
          userId: user.id,
          status: 'active'
        }),
      })

      if (!createListResponse.ok) {
        throw new Error('Failed to create shopping list')
      }

      const newList = await createListResponse.json()

      // Now add all items to the list
      for (const item of selectedItems) {
        await fetch('/api/shopping_list_item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shoppingListId: newList.id,
            productId: item.id,
            quantity: item.quantity
          }),
        })
      }

      // Get location and calculate market recommendations
      let location = userLocation

      if (!location) {
        // Try to get GPS location using the hook
        updateUserLocation()
        location = userLocation // Will be set by the hook
      }

      // Calculate market recommendations using nearby markets if available
      let markets = nearbyMarkets.length > 0 ? nearbyMarkets : mockMarkets

      if (location && nearbyMarkets.length === 0) {
        markets = mockMarkets.map((market) => ({
          ...market,
          distance: calculateDistance(location, market.coordinates),
        }))
      }

      // Calculate market recommendations
      // Calculate market recommendations
      const marketsWithTotals = markets.map((market) => ({
        ...market,
        estimatedTotal: selectedItems.reduce((total, item) => {
          const estimate = priceEstimates[item.id]?.estimated || item.avgPrice
          const priceMultipliers: { [key: number]: number } = { 1: 0.9, 2: 1.0, 3: 0.95, 4: 1.15 }
          const multiplier = priceMultipliers[market.id] || 1.0
          return total + estimate * item.quantity * multiplier
        }, 0),
        distance: market.distance || (location ? calculateDistance(location, market.coordinates) : Math.random() * 5 + 1),
      }))

      // Check if all items are collected
      const allCollected = selectedItems.every(item => item.collected)
      
      // Update list status if needed
      if (allCollected) {
        await fetch(`/api/shopping_list`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: newList.id,
            status: 'completed'
          }),
        })
      }

      const sortedMarkets = marketsWithTotals.sort((a, b) => {
        const scoreA = (a.estimatedTotal / 100) * 0.6 + a.distance * 0.4
        const scoreB = (b.estimatedTotal / 100) * 0.6 + b.distance * 0.4
        return scoreA - scoreB
      })

      setRecommendedMarkets(sortedMarkets)

      // Save to database using API
      const updateListResponse = await fetch('/api/shopping_list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: listName.trim(),
          userId: user.id,
        }),
      })

      if (!updateListResponse.ok) {
        throw new Error('Erro ao salvar lista no servidor')
      }

      const savedList = await updateListResponse.json()

      // Add items to the saved list
      for (const item of selectedItems) {
        const itemResponse = await fetch('/api/shopping_list_item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shoppingListId: savedList.id,
            productId: item.id,
            quantity: item.quantity,
          }),
        })

        if (!itemResponse.ok) {
          console.error('Erro ao adicionar item à lista:', item.name)
        }
      }

      // Show success message
      alert(`Lista "${listName}" salva com sucesso!`)
      
      // Show recommendation dialog
      setShowRecommendationDialog(true)
      
      // Reset form
      setListName("")
      setSelectedItems([])
      
    } catch (error) {
      console.error("Error saving list:", error)
      alert("Erro ao salvar a lista. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
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
              <ShoppingCart className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold">Nova Lista de Compras</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário e Busca */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nome da Lista */}
            <Card>
              <CardHeader>
                <CardTitle>Informações da Lista</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="listName">Nome da Lista</Label>
                    <Input
                      id="listName"
                      placeholder="Ex: Compras da Semana"
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2 mt-4 items-center">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Localização</p>
                      {isLoadingLocation ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Obtendo localização...</span>
                        </div>
                      ) : userLocationHook ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">
                            {nearbyMarkets.length} mercados próximos
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-red-600">
                            {locationError ? 
                              "Acesso à localização negado. Permita o acesso à localização para ver mercados próximos." :
                              "Não foi possível obter sua localização. Verifique se seu dispositivo tem suporte a GPS."}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={updateUserLocation}
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Tentar novamente
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Valor Parcial da Compra */}
            {selectedItems.length > 0 && (
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-green-800">Progresso da Compra</h3>
                    <Badge variant="secondary">
                      {getCollectedCount()} de {selectedItems.length} coletados
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Valor Estimado</p>
                      <p className="text-lg font-bold text-gray-800">R$ {getTotalEstimated().toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valor Atual</p>
                      <p className="text-lg font-bold text-green-600">R$ {getTotalActual().toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${selectedItems.length > 0 ? (getCollectedCount() / selectedItems.length) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Price Estimates */}
            {showEstimates && Object.keys(priceEstimates).length > 0 && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Estimativas de Preços Personalizadas
                  </CardTitle>
                  <CardDescription>Baseado no seu histórico e dados da comunidade</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Qtd: {item.quantity} • Confiança: {priceEstimates[item.id]?.confidence}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">
                            R$ {(priceEstimates[item.id]?.estimated * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Unit: R$ {priceEstimates[item.id]?.estimated.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total Estimado:</span>
                        <span className="text-blue-600">
                          R${" "}
                          {Object.entries(priceEstimates)
                            .reduce((sum, [itemId, est]) => {
                              const item = selectedItems.find((i) => i.id === Number.parseInt(itemId))
                              return sum + (est as any).estimated * (item?.quantity || 1)
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Economia estimada vs. preço médio: R${" "}
                        {(
                          getTotalEstimated() -
                          Object.entries(priceEstimates).reduce((sum, [itemId, est]) => {
                            const item = selectedItems.find((i) => i.id === Number.parseInt(itemId))
                            return sum + (est as any).estimated * (item?.quantity || 1)
                          }, 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Busca de Produtos */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="space-y-3">
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Package className="h-4 w-4 text-gray-400" />
                              <h3 className="font-medium text-sm">{product.name}</h3>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                {product.category}
                              </Badge>
                              <span className="text-xs text-gray-500">Atualizado {product.lastUpdate}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <MapPin className="h-3 w-3" />
                              <span>Melhor preço: {product.bestMarket || "Atacadão"}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowReviews(showReviews === product.id ? null : product.id)}
                              className="mt-1 p-0 h-auto text-xs text-blue-600 hover:text-blue-800"
                            >
                              <Star className="h-3 w-3 mr-1" />
                              Ver avaliações
                            </Button>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-bold text-green-600">
                              R$ {product.bestPrice || (product.avgPrice * 0.9).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 line-through">R$ {product.avgPrice}</p>
                            <p className="text-xs text-green-600">
                              Economia: R${" "}
                              {(product.avgPrice - (product.bestPrice || product.avgPrice * 0.9)).toFixed(2)}
                            </p>
                            <Button size="sm" className="mt-1" onClick={() => addItem(product)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Avaliações Compactas */}
                        {showReviews === product.id && (
                          <div className="ml-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-200">
                            <ProductReviews productId={product.id} productName={product.name} compact={true} />
                          </div>
                        )}
                      </div>
                    ))}

                    {!productsLoading && filteredProducts.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>
                          {searchTerm
                            ? `Nenhum produto encontrado para "${searchTerm}"`
                            : "Nenhum produto disponível no momento"}
                        </p>
                        <p className="text-sm">
                          {searchTerm ? "Tente buscar com outros termos" : "Verifique sua conexão ou tente novamente"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Itens Selecionados */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Itens Selecionados
                  <Badge variant="secondary">{selectedItems.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum item selecionado</p>
                    <p className="text-sm">Busque e adicione produtos à sua lista</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-64 overflow-y-auto space-y-3">
                      {selectedItems.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 rounded-lg border transition-all ${
                            item.collected ? "bg-green-50 border-green-200 opacity-75" : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {item.collected && <CheckCircle className="h-4 w-4 text-green-600" />}
                              <h4
                                className={`font-medium text-sm ${item.collected ? "line-through text-gray-500" : ""}`}
                              >
                                {item.name}
                              </h4>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.collected}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.collected}
                              >
                                +
                              </Button>
                            </div>

                            {!item.collected ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCollectItem(item)}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <Camera className="h-3 w-3 mr-1" />
                                Coletar
                              </Button>
                            ) : (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                ✓ Coletado
                              </Badge>
                            )}
                          </div>

                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className={`text-gray-600 ${item.collected ? "line-through" : ""}`}>Estimado:</span>
                              <span className={item.collected ? "line-through text-gray-400" : ""}>
                                R$ {(item.avgPrice * item.quantity).toFixed(2)}
                              </span>
                            </div>
                            {item.collected && item.actualPrice && (
                              <div className="flex justify-between font-medium text-green-600">
                                <span>✓ Pago:</span>
                                <span>R$ {(item.actualPrice * item.quantity).toFixed(2)}</span>
                              </div>
                            )}
                            {priceEstimates[item.id] && (
                              <div className="flex justify-between text-blue-600 font-medium">
                                <span>Estimativa IA:</span>
                                <span>R$ {(priceEstimates[item.id].estimated * item.quantity).toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total estimado:</span>
                          <span className="text-sm">R$ {getTotalEstimated().toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total atual:</span>
                          <span className="text-sm font-medium">R$ {getTotalActual().toFixed(2)}</span>
                        </div>
                        {Object.keys(priceEstimates).length > 0 && (
                          <div className="flex items-center justify-between text-blue-600">
                            <span className="text-sm font-medium">Estimativa IA:</span>
                            <span className="text-sm font-bold">
                              R${" "}
                              {Object.entries(priceEstimates)
                                .reduce((sum, [itemId, est]) => {
                                  const item = selectedItems.find((i) => i.id === Number.parseInt(itemId))
                                  return sum + (est as any).estimated * (item?.quantity || 1)
                                }, 0)
                                .toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-green-600">
                          <span className="text-sm font-medium">
                            {getTotalActual() <= getTotalEstimated() ? "Economia:" : "Gasto extra:"}
                          </span>
                          <span className="text-sm font-bold">
                            R$ {Math.abs(getTotalEstimated() - getTotalActual()).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={handleSaveList}
                        disabled={isSaving}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Salvando..." : "Salvar Lista"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dica */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Dica Inteligente</h4>
                    <p className="text-sm text-blue-700">
                      Ao salvar sua lista, você receberá automaticamente recomendações personalizadas dos melhores
                      mercados baseadas na sua localização e nos preços dos seus itens!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog de Coleta */}
      <CollectItemDialog
        open={collectDialogOpen}
        onOpenChange={setCollectDialogOpen}
        item={selectedItemForCollection}
        onItemCollected={handleItemCollected}
        shoppingListId={-1} // Use -1 to indicate this is a new list
      />

      {/* Market Recommendation Dialog */}
      <MarketRecommendationDialog
        open={showRecommendationDialog}
        onOpenChange={(open) => {
          setShowRecommendationDialog(open)
          if (!open) {
            // Redirect to dashboard after closing recommendations
            router.push("/dashboard")
          }
        }}
        listName={listName}
        recommendedMarkets={recommendedMarkets}
        totalEstimated={Object.entries(priceEstimates).reduce((sum, [itemId, est]) => {
          const item = selectedItems.find((i) => i.id === Number.parseInt(itemId))
          return sum + (est as any).estimated * (item?.quantity || 1)
        }, 0)}
        onNavigate={handleNavigateToMarket}
      />
    </div>
  )
}
