"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Search, MapPin, TrendingDown, Star, List, Calendar, Clock, Navigation } from "lucide-react"
import Link from "next/link"
import { UserMenu } from "@/components/user-menu"
import { useLocation } from "@/hooks/use-location"

interface BaseMockList {
  id: number;
  name: string;
  items: number;
  completed: number;
  createdAt: string;
  estimatedTotal: number;
  actualTotal?: number | null;
  status: "active" | "completed";
}

// Mock data
const mockLists: BaseMockList[] = [
  {
    id: 1,
    name: "Compras da Semana",
    items: 12,
    completed: 8,
    createdAt: "2025-01-20T10:00:00.000Z",
    estimatedTotal: 89.5,
    actualTotal: 85.3,
    status: "completed",
  },
  {
    id: 2,
    name: "Festa de Aniversário",
    items: 25,
    completed: 0,
    createdAt: "2025-01-25T10:00:00.000Z",
    estimatedTotal: 156.8,
    actualTotal: null,
    status: "active",
  },
  {
    id: 3,
    name: "Produtos de Limpeza",
    items: 8,
    completed: 8,
    createdAt: "2025-01-18T10:00:00.000Z",
    estimatedTotal: 45.2,
    actualTotal: 42.8,
    status: "completed",
  },
]

const mockRecentProducts = [
  { name: "Arroz Tio João 5kg", price: 18.9, market: "Extra", date: "Hoje" },
  { name: "Leite Integral 1L", price: 4.5, market: "Pão de Açúcar", date: "Ontem" },
  { name: "Frango Kg", price: 12.8, market: "Carrefour", date: "2 dias" },
]

interface ShoppingListItem {
  id: number
  quantity: number
  collected: boolean
  productId: number
  shoppingListId: number
}

interface ShoppingList {
  id: number
  name: string
  status: string
  items: ShoppingListItem[]
  completed: number
  estimatedTotal: number
  actualTotal?: number
  createdAt: string
  userId: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const [activeLists, setActiveLists] = useState<ShoppingList[]>([])
  const [historyLists, setHistoryLists] = useState<ShoppingList[]>([])
  const [stats, setStats] = useState<{ 
    activeLists: number; 
    monthSavings: number; 
    points: number;
    prices: number;
    reviews: number;
  }>({
    activeLists: 0,
    monthSavings: 0,
    points: 0,
    prices: 0,
    reviews: 0
  })
  const { 
    userLocation, 
    isLoadingLocation, 
    locationError, 
    getCurrentLocation, 
    nearbyMarkets, 
    isLoadingMarkets 
  } = useLocation()

  // Auto request location when page loads
  useEffect(() => {
    if (!userLocation && !isLoadingLocation) {
      getCurrentLocation()
    }
  }, [])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load lists and stats from API
    const fetchData = async () => {
      try {
        const [listsResponse, statsResponse] = await Promise.all([
          fetch(`/api/shopping_list?userId=${parsedUser.id}`),
          fetch(`/api/stats?userId=${parsedUser.id}`)
        ])

        if (listsResponse.ok) {
          const lists: ShoppingList[] = await listsResponse.json()
          // Separate active and history lists
          const active = lists.filter((list: ShoppingList) => list.status === "active")
          const history = lists.filter((list: ShoppingList) => list.status === "completed")
          
          setActiveLists(active)
          setHistoryLists(history)
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setActiveLists([])
        setHistoryLists([])
        setStats({ activeLists: 0, monthSavings: 0, points: 0, prices: 0, reviews: 0 })
      }
    }

    fetchData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/dashboard/buscar?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
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
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <ShoppingCart className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">EconoMarket</span>
              </Link>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pl-10 w-80"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <UserMenu user={user} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Olá, {user.name.split(" ")[0]}! 👋</h1>
          <p className="text-gray-600">Pronto para economizar nas suas compras hoje?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <List className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeLists}</p>
                  <p className="text-sm text-gray-600">Listas Ativas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R$ {stats.monthSavings.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Economia este mês</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.points}</p>
                  <p className="text-sm text-gray-600">Pontos Acumulados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  {isLoadingLocation ? (
                    <>
                      <p className="text-2xl font-bold">...</p>
                      <p className="text-sm text-gray-600">Obtendo localização...</p>
                    </>
                  ) : userLocation ? (
                    <>
                      <p className="text-2xl font-bold">{nearbyMarkets.length}</p>
                      <p className="text-sm text-gray-600">Mercados próximos</p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-gray-400">-</p>
                      <p className="text-sm text-red-600">
                        {locationError ? 
                          "Acesso negado" :
                          "GPS indisponível"}
                      </p>
                      <button
                        onClick={getCurrentLocation}
                        disabled={isLoadingLocation}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                      >
                        Tentar novamente
                      </button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-purple-600">{stats.points}</p>
                    <p className="text-xs text-purple-700">Pontos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-purple-600">{stats.prices}</p>
                    <p className="text-xs text-purple-700">Preços</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-purple-600">{stats.reviews}</p>
                    <p className="text-xs text-purple-700">Avaliações</p>
                  </div>
                </div>
                <Link href="/dashboard/perfil">
                  <Button variant="outline" size="sm" className="border-purple-300 text-purple-700">
                    Ver Perfil
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listas de Compras */}
          <div className="lg:col-span-2">
            {/* Active Lists */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Suas Listas</h2>
              <Link href="/dashboard/nova-lista">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Lista
                </Button>
              </Link>
            </div>

            <div>
              {activeLists.map((list) => (
                <Link key={list.id} href={`/dashboard/lista/${list.id}`} className="block mb-3">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{list.name}</h3>
                            {list.completed === list.items.length && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Concluída
                              </Badge>
                            )}
                            {list.actualTotal && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Salva
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>
                              {list.completed === list.items.length ? 
                                "Lista completa" : 
                                `${list.items.length - (list.completed || 0)} itens restantes`
                              }
                            </span>
                            {list.completed > 0 && (
                              <span className="text-green-600">
                                {((list.completed / list.items.length) * 100).toFixed(0)}% concluída
                              </span>
                            )}
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              Total: {list.items.length} itens • Criada em {list.createdAt ? new Date(list.createdAt).toLocaleDateString("pt-BR") : new Date().toLocaleDateString("pt-BR")}
                            </p>
                            {list.actualTotal && (
                              <p className="text-sm text-green-600 font-medium">
                                Economia: R$ {(list.estimatedTotal - list.actualTotal).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold text-green-600">
                            R$ {((list.actualTotal || list.estimatedTotal || 0)).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">{list.actualTotal ? "gasto real" : "estimado"}</p>
                          {list.completed === list.items.length && !list.actualTotal && (
                            <Link href="/dashboard/lista-finalizada">
                              <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                                Ver Mercados
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {activeLists.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Nenhuma lista ativa no momento.</p>
              )}
            </div>

            {/* History Lists */}
            <div className="flex items-center justify-between mb-6 mt-12">
              <h2 className="text-2xl font-bold text-gray-900">Histórico de Listas</h2>
              <Link href="/dashboard/historico">
                <Button variant="outline">Ver Histórico Completo</Button>
              </Link>
            </div>

            <div>
              {historyLists.slice(0, 3).map((list) => (
                <Card key={list.id} className="hover:shadow-md transition-shadow cursor-pointer mb-3">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{list.name}</h3>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                            {list.status === "completed" ? "Finalizada" : "Modificada"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            Total: {list.items.length} itens
                          </span>
                          <span>
                            {list.completed > 0 && `${((list.completed / list.items.length) * 100).toFixed(0)}% coletados`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold text-gray-600">
                          R$ {(list.actualTotal || list.estimatedTotal || 0).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">gasto real</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {historyLists.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Nenhuma atividade recente.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preços Recentes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preços Recentes</CardTitle>
                <CardDescription>Últimos preços coletados pela comunidade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRecentProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-600">
                        {product.market} • {product.date}
                      </p>
                    </div>
                    <p className="font-bold text-green-600">R$ {product.price}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard/sugerir-produto" className="block mb-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Sugerir Produto
                  </Button>
                </Link>
                <Link href="/dashboard/mercados" className="block mb-3">
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Encontrar Mercados
                  </Button>
                </Link>
                <Link href="/dashboard/buscar" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Buscar Produtos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Mercados Próximos */}
            {nearbyMarkets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mercados Próximos</CardTitle>
                  <CardDescription>Mercados encontrados na sua região</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {nearbyMarkets.slice(0, 5).map((market, index) => (
                    <div key={market.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{market.name}</p>
                        <p className="text-xs text-gray-600">
                          {market.distance}km • {market.estimatedTime}
                        </p>
                      </div>
                      <Link href={`/dashboard/mercados?id=${market.id}`}>
                        <Button variant="outline" size="sm">
                          <Navigation className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {nearbyMarkets.length > 5 && (
                    <Link href="/dashboard/mercados">
                      <Button variant="outline" className="w-full justify-center text-xs">
                        Ver todos os {nearbyMarkets.length} mercados
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Histórico de Listas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Histórico de Listas</CardTitle>
                <CardDescription>Suas últimas listas salvas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                                {mockLists
                  .filter((list): list is BaseMockList & { actualTotal: number } => 
                    list.actualTotal != null && typeof list.actualTotal === 'number'
                  )
                  .slice(0, 3)
                  .map((list) => (
                    <div key={list.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{list.name}</p>
                        <p className="text-xs text-gray-600">
                          {list.items} itens • {new Date(list.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 text-sm">R$ {list.actualTotal.toFixed(2)}</p>
                        <p className="text-xs text-gray-600">
                          -{(((list.estimatedTotal - list.actualTotal) / list.estimatedTotal) * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  ))}
                {mockLists.filter((list) => list.actualTotal != null).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">Nenhuma lista salva ainda</p>
                )}
              </CardContent>
            </Card>

            {/* Dica do Dia */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg text-green-800">💡 Dica do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700">
                  Compare preços antes de sair de casa! Use nossa busca para encontrar os melhores preços nos mercados
                  próximos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
