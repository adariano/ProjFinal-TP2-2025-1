"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  ArrowLeft,
  CheckCircle,
  Package,
  Calendar,
  MapPin,
  TrendingUp,
  Edit,
  Trash2,
  Download,
  Navigation,
} from "lucide-react"
import Link from "next/link"
import { MarketRecommendationDialog } from "@/components/market-recommendation-dialog"

export default function ListaDetalhePage() {
  const [user, setUser] = useState<any>(null)
  const [lista, setLista] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showRecommendationDialog, setShowRecommendationDialog] = useState(false)
  const router = useRouter()
  const params = useParams()
  const listId = params.id

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    // Carregar lista específica
    const savedLists = JSON.parse(localStorage.getItem("savedLists") || "[]")
    const foundList = savedLists.find((list: any) => list.id.toString() === listId)

    if (foundList) {
      setLista(foundList)
    } else {
      // Lista não encontrada, redirecionar
      router.push("/dashboard")
    }
    setLoading(false)
  }, [listId, router])

  const handleDeleteList = () => {
    if (!confirm("Tem certeza que deseja excluir esta lista?")) return

    const savedLists = JSON.parse(localStorage.getItem("savedLists") || "[]")
    const updatedLists = savedLists.filter((list: any) => list.id.toString() !== listId)
    localStorage.setItem("savedLists", JSON.stringify(updatedLists))

    // Adicionar ao histórico
    const historyEntry = {
      id: Date.now(),
      listName: lista.name,
      action: "deleted",
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      details: `Lista "${lista.name}" foi excluída`,
      itemCount: lista.items,
    }

    const existingHistory = JSON.parse(localStorage.getItem("listHistory") || "[]")
    existingHistory.unshift(historyEntry)
    localStorage.setItem("listHistory", JSON.stringify(existingHistory))

    alert("Lista excluída com sucesso!")
    router.push("/dashboard")
  }

  const handleExportList = () => {
    if (!lista) return

    const exportData = {
      nome: lista.name,
      data: new Date(lista.date).toLocaleDateString("pt-BR"),
      itens:
        lista.listItems?.map((item: any) => ({
          produto: item.name,
          quantidade: item.quantity,
          precoEstimado: `R$ ${item.avgPrice.toFixed(2)}`,
          precoReal: item.actualPrice ? `R$ ${item.actualPrice.toFixed(2)}` : "Não coletado",
          coletado: item.collected ? "Sim" : "Não",
        })) || [],
      resumo: {
        totalItens: lista.items,
        itensColetados: lista.completed,
        valorEstimado: `R$ ${lista.estimatedTotal.toFixed(2)}`,
        valorReal: `R$ ${lista.actualTotal.toFixed(2)}`,
        economia: `R$ ${(lista.estimatedTotal - lista.actualTotal).toFixed(2)}`,
      },
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `lista-${lista.name.replace(/\s+/g, "-").toLowerCase()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleNavigateToMarket = (market: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(market.address)}`
    window.open(url, "_blank")
  }

  const handleShowRecommendations = () => {
    if (lista?.recommendedMarkets && lista.recommendedMarkets.length > 0) {
      setShowRecommendationDialog(true)
    } else {
      // Generate recommendations on-demand if not available
      alert("Gerando recomendações para esta lista...")

      // Mock generation of recommendations
      const mockMarkets = [
        {
          id: 1,
          name: "Atacadão",
          address: "Av. Marginal Tietê, 1500",
          coordinates: { lat: -23.5505, lng: -46.6333 },
          rating: 4.2,
          phone: "(11) 3456-7890",
          priceLevel: "Econômico",
          estimatedTotal: lista.estimatedTotal * 0.9,
          distance: 1.2,
        },
        {
          id: 2,
          name: "Extra Hipermercado",
          address: "Av. Paulista, 1000",
          coordinates: { lat: -23.5618, lng: -46.6565 },
          rating: 4.5,
          phone: "(11) 3456-7891",
          priceLevel: "Moderado",
          estimatedTotal: lista.estimatedTotal * 1.0,
          distance: 1.8,
        },
        {
          id: 3,
          name: "Carrefour",
          address: "Shopping Center Norte",
          coordinates: { lat: -23.5129, lng: -46.6194 },
          rating: 4.3,
          phone: "(11) 3456-7892",
          priceLevel: "Moderado",
          estimatedTotal: lista.estimatedTotal * 0.95,
          distance: 2.1,
        },
      ]

      // Update the list with generated recommendations
      const savedLists = JSON.parse(localStorage.getItem("savedLists") || "[]")
      const updatedLists = savedLists.map((list: any) =>
        list.id.toString() === listId ? { ...list, recommendedMarkets: mockMarkets } : list,
      )
      localStorage.setItem("savedLists", JSON.stringify(updatedLists))

      // Update local state
      setLista({ ...lista, recommendedMarkets: mockMarkets })
      setShowRecommendationDialog(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    )
  }

  if (!lista) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Lista não encontrada</h2>
          <Link href="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-green-600" />
                <h1 className="text-xl font-bold">{lista.name}</h1>
                {lista.status === "completed" && <Badge className="bg-green-100 text-green-800">Concluída</Badge>}
                {lista.status === "active" && <Badge className="bg-blue-100 text-blue-800">Ativa</Badge>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(lista.recommendedMarkets && lista.recommendedMarkets.length > 0) || lista.listItems?.length > 0 ? (
                <Button variant="outline" size="sm" onClick={handleShowRecommendations}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Ver Mercados
                </Button>
              ) : null}
              <Button variant="outline" size="sm" onClick={handleExportList}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeleteList}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações da Lista */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resumo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Resumo da Lista
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{lista.items}</p>
                    <p className="text-sm text-gray-600">Total de Itens</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{lista.completed}</p>
                    <p className="text-sm text-gray-600">Coletados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">R$ {lista.estimatedTotal.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Estimado</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">R$ {lista.actualTotal.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Gasto Real</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-800">Economia Total:</span>
                    <span className="text-xl font-bold text-green-600">
                      R$ {(lista.estimatedTotal - lista.actualTotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${lista.items > 0 ? (lista.completed / lista.items) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      {lista.items > 0 ? Math.round((lista.completed / lista.items) * 100) : 0}% dos itens coletados
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Itens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Itens da Lista
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lista.listItems?.map((item: any) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-lg border ${
                        item.collected ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {item.collected ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                          )}
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-600">
                              Quantidade: {item.quantity} • Categoria: {item.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              Estimado: R$ {(item.avgPrice * item.quantity).toFixed(2)}
                            </p>
                            {item.collected && item.actualPrice && (
                              <p className="font-medium text-green-600">
                                Pago: R$ {(item.actualPrice * item.quantity).toFixed(2)}
                              </p>
                            )}
                            {item.collected && item.actualPrice && (
                              <p className="text-xs text-green-600">
                                Economia: R$ {((item.avgPrice - item.actualPrice) * item.quantity).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {item.collectedAt && (
                        <div className="mt-2 text-xs text-gray-500">
                          Coletado em: {new Date(item.collectedAt).toLocaleString("pt-BR")}
                          {item.collectionMethod && ` • Método: ${item.collectionMethod}`}
                        </div>
                      )}
                    </div>
                  )) || <p className="text-center text-gray-500 py-8">Nenhum item encontrado nesta lista.</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações Gerais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Data de Criação</p>
                    <p className="text-sm text-gray-600">{new Date(lista.date).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                {lista.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Horário</p>
                      <p className="text-sm text-gray-600">{new Date(lista.createdAt).toLocaleTimeString("pt-BR")}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-gray-600">{lista.status === "completed" ? "Concluída" : "Ativa"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taxa de Coleta:</span>
                    <span className="text-sm font-medium">
                      {lista.items > 0 ? Math.round((lista.completed / lista.items) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Economia por Item:</span>
                    <span className="text-sm font-medium">
                      R${" "}
                      {lista.items > 0 ? ((lista.estimatedTotal - lista.actualTotal) / lista.items).toFixed(2) : "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">% de Economia:</span>
                    <span className="text-sm font-medium text-green-600">
                      {lista.estimatedTotal > 0
                        ? (((lista.estimatedTotal - lista.actualTotal) / lista.estimatedTotal) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={handleShowRecommendations}>
                  <Navigation className="h-4 w-4 mr-2" />
                  {lista.recommendedMarkets && lista.recommendedMarkets.length > 0
                    ? "Ver Recomendações de Mercados"
                    : "Gerar Recomendações de Mercados"}
                </Button>
                {lista.status === "completed" && (
                  <Link href="/dashboard/lista-finalizada">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Ver Mercados Recomendados
                    </Button>
                  </Link>
                )}
                <Button variant="outline" className="w-full justify-start" onClick={handleExportList}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Lista
                </Button>
                <Link href="/dashboard/nova-lista">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Criar Lista Similar
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Dica */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Dica</h4>
                    <p className="text-sm text-blue-700">
                      Use o botão "Ver Recomendações" para acessar novamente as sugestões de mercados para esta lista!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Market Recommendation Dialog */}
      <MarketRecommendationDialog
        open={showRecommendationDialog}
        onOpenChange={setShowRecommendationDialog}
        listName={lista.name}
        recommendedMarkets={lista.recommendedMarkets || []}
        totalEstimated={
          lista.priceEstimates
            ? Object.entries(lista.priceEstimates).reduce((sum, [itemId, est]: [string, any]) => {
                const item = lista.listItems?.find((i: any) => i.id === Number.parseInt(itemId))
                return sum + est.estimated * (item?.quantity || 1)
              }, 0)
            : lista.estimatedTotal
        }
        onNavigate={handleNavigateToMarket}
      />
    </div>
  )
}
