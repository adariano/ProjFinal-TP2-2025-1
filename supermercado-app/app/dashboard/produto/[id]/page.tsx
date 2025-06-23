"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, ArrowLeft, Package, Star, MapPin, TrendingDown, MessageSquare, DollarSign } from "lucide-react"
import Link from "next/link"
import { AddToListDialog } from "@/components/add-to-list-dialog"

// Mock product data
const mockProductDetails = {
  1: {
    id: 1,
    name: "Arroz Branco 5kg",
    brand: "Tio João",
    category: "Grãos",
    description: "Arroz branco tipo 1, grãos longos e soltos. Ideal para o dia a dia da família.",
    avgPrice: 18.9,
    bestPrice: 16.5,
    bestMarket: "Atacadão",
    lastUpdate: "Hoje",
    rating: 4.5,
    reviews: 234,
    priceHistory: [
      { market: "Atacadão", price: 16.5, date: "2025-01-20", reliability: 95 },
      { market: "Extra", price: 17.8, date: "2025-01-20", reliability: 88 },
      { market: "Carrefour", price: 18.2, date: "2025-01-19", reliability: 92 },
      { market: "Pão de Açúcar", price: 19.5, date: "2025-01-19", reliability: 85 },
    ],
    locations: [
      { market: "Atacadão", aisle: "Corredor 3", shelf: "Prateleira A" },
      { market: "Extra", aisle: "Corredor 5", shelf: "Prateleira B" },
    ],
    userReviews: [
      {
        id: 1,
        user: "Maria S.",
        rating: 5,
        comment: "Ótima qualidade, grãos soltos e saborosos!",
        date: "2025-01-18",
      },
      {
        id: 2,
        user: "João P.",
        rating: 4,
        comment: "Bom custo-benefício, recomendo.",
        date: "2025-01-15",
      },
    ],
  },
}

const mockMarkets = ["Atacadão", "Extra", "Carrefour", "Pão de Açúcar", "Walmart", "Big", "Outro"]

export default function ProdutoPage() {
  const [user, setUser] = useState<any>(null)
  const [product, setProduct] = useState<any>(null)
  const [newPrice, setNewPrice] = useState("")
  const [selectedMarket, setSelectedMarket] = useState("")
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(5)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    // Load product data
    const productId = Number.parseInt(params.id as string)
    const productData = mockProductDetails[productId as keyof typeof mockProductDetails]
    if (productData) {
      setProduct(productData)
    } else {
      // Fallback for products not in detailed mock
      setProduct({
        id: productId,
        name: "Produto não encontrado",
        brand: "N/A",
        category: "N/A",
        description: "Produto não encontrado no banco de dados.",
        avgPrice: 0,
        bestPrice: 0,
        bestMarket: "N/A",
        rating: 0,
        reviews: 0,
        priceHistory: [],
        locations: [],
        userReviews: [],
      })
    }
  }, [router, params.id])

  const handleSubmitPrice = () => {
    if (!newPrice || !selectedMarket) {
      alert("Preencha o preço e selecione o mercado")
      return
    }
    alert(`Preço R$ ${newPrice} no ${selectedMarket} enviado! +10 pontos adicionados.`)
    setNewPrice("")
    setSelectedMarket("")
  }

  const handleSubmitReview = () => {
    if (!newReview.trim()) {
      alert("Escreva uma avaliação")
      return
    }
    alert(`Avaliação enviada! +5 pontos adicionados.`)
    setNewReview("")
    setNewRating(5)
  }

  const addToList = () => {
    alert(`${product?.name} adicionado à lista de compras!`)
  }

  if (!user || !product) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/buscar">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold">Detalhes do Produto</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                    <p className="text-lg text-gray-600 mb-2">{product.brand}</p>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{product.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-gray-500">({product.reviews} avaliações)</span>
                      </div>
                    </div>
                  </div>
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-gray-700">{product.description}</p>
              </CardContent>
            </Card>

            {/* Price Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Comparação de Preços
                </CardTitle>
                <CardDescription>Preços coletados pela comunidade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.priceHistory.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="font-medium">{entry.market}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(entry.date).toLocaleDateString("pt-BR")} • Confiabilidade: {entry.reliability}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">R$ {entry.price}</p>
                        {index === 0 && <Badge className="bg-green-600 text-white text-xs">Melhor Preço</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            {product.locations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Localização nos Mercados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {product.locations.map((location: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">{location.market}</span>
                        <span className="text-sm text-blue-600">
                          {location.aisle} - {location.shelf}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Avaliações dos Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.userReviews.map((review: any) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AddToListDialog
                  product={product}
                  onAdd={(productData) => {
                    console.log("Product added to list:", productData)
                    alert(`${product.name} adicionado à lista com preço R$ ${productData.currentPrice}!`)
                  }}
                />
                <Link href="/dashboard/nova-lista">
                  <Button variant="outline" className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Nova Lista
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Report Price */}
            <Card>
              <CardHeader>
                <CardTitle>Informar Preço</CardTitle>
                <CardDescription>Ajude a comunidade com informações atualizadas (+10 pontos)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="market">Mercado</Label>
                  <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o mercado" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMarkets.map((market) => (
                        <SelectItem key={market} value={market}>
                          {market}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSubmitPrice} className="w-full">
                  Enviar Preço
                </Button>
              </CardContent>
            </Card>

            {/* Add Review */}
            <Card>
              <CardHeader>
                <CardTitle>Avaliar Produto</CardTitle>
                <CardDescription>Compartilhe sua experiência (+5 pontos)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nota</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setNewRating(star)} className="p-1">
                        <Star
                          className={`h-6 w-6 ${star <= newRating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review">Comentário</Label>
                  <Textarea
                    id="review"
                    placeholder="Conte sobre sua experiência com este produto..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleSubmitReview} className="w-full">
                  Enviar Avaliação
                </Button>
              </CardContent>
            </Card>

            {/* Price Trend */}
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-8 w-8 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">Tendência de Preço</h4>
                    <p className="text-sm text-green-700">Preço médio caiu 8% nos últimos 30 dias</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
