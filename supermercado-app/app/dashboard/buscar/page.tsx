"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Package, MapPin, Star, Filter } from "lucide-react"
import Link from "next/link"
import { AddToListDialog } from "@/components/add-to-list-dialog"

// Mock products database expandido
const mockProducts = [
  {
    id: 1,
    name: "Arroz Branco 5kg",
    brand: "Tio João",
    category: "Grãos",
    avgPrice: 18.9,
    bestPrice: 16.5,
    bestMarket: "Atacadão",
    lastUpdate: "Hoje",
    rating: 4.5,
    reviews: 234,
  },
  {
    id: 2,
    name: "Feijão Preto 1kg",
    brand: "Camil",
    category: "Grãos",
    avgPrice: 7.5,
    bestPrice: 6.8,
    bestMarket: "Extra",
    lastUpdate: "Ontem",
    rating: 4.3,
    reviews: 156,
  },
  {
    id: 3,
    name: "Leite Integral 1L",
    brand: "Parmalat",
    category: "Laticínios",
    avgPrice: 4.5,
    bestPrice: 3.9,
    bestMarket: "Carrefour",
    lastUpdate: "Hoje",
    rating: 4.7,
    reviews: 89,
  },
  {
    id: 4,
    name: "Pão de Forma Integral",
    brand: "Wickbold",
    category: "Padaria",
    avgPrice: 5.2,
    bestPrice: 4.5,
    bestMarket: "Pão de Açúcar",
    lastUpdate: "2h",
    rating: 4.4,
    reviews: 67,
  },
  {
    id: 5,
    name: "Frango Inteiro Kg",
    brand: "Sadia",
    category: "Carnes",
    avgPrice: 12.8,
    bestPrice: 11.2,
    bestMarket: "Atacadão",
    lastUpdate: "1h",
    rating: 4.2,
    reviews: 198,
  },
  {
    id: 6,
    name: "Banana Prata Kg",
    brand: "Natural",
    category: "Frutas",
    avgPrice: 6.9,
    bestPrice: 5.5,
    bestMarket: "Hortifruti",
    lastUpdate: "3h",
    rating: 4.6,
    reviews: 45,
  },
  {
    id: 7,
    name: "Detergente 500ml",
    brand: "Ypê",
    category: "Limpeza",
    avgPrice: 2.8,
    bestPrice: 2.2,
    bestMarket: "Extra",
    lastUpdate: "Ontem",
    rating: 4.1,
    reviews: 123,
  },
  {
    id: 8,
    name: "Açúcar Cristal 1kg",
    brand: "União",
    category: "Grãos",
    avgPrice: 4.2,
    bestPrice: 3.8,
    bestMarket: "Carrefour",
    lastUpdate: "Hoje",
    rating: 4.5,
    reviews: 78,
  },
]

const categories = ["Todos", "Grãos", "Laticínios", "Carnes", "Frutas", "Verduras", "Padaria", "Limpeza"]

export default function BuscarProdutoPage() {
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [sortBy, setSortBy] = useState("relevance")
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const router = useRouter()

  const searchParams = useSearchParams()

  useEffect(() => {
    const urlSearch = searchParams.get("q")
    if (urlSearch) {
      setSearchTerm(urlSearch)
    }
  }, [searchParams])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    let filtered = mockProducts

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.bestPrice - b.bestPrice)
        break
      case "price-high":
        filtered.sort((a, b) => b.bestPrice - a.bestPrice)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // relevance - keep original order
        break
    }

    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, sortBy])

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
              <Search className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold">Buscar Produtos</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar produtos, marcas ou categorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-lg h-12"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Filtros:</span>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevância</SelectItem>
                    <SelectItem value="price-low">Menor Preço</SelectItem>
                    <SelectItem value="price-high">Maior Preço</SelectItem>
                    <SelectItem value="rating">Melhor Avaliação</SelectItem>
                    <SelectItem value="name">Nome A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""} encontrado
            {filteredProducts.length !== 1 ? "s" : ""}
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-600 mb-4">Tente buscar com outros termos ou ajustar os filtros</p>
              <Button onClick={() => setSearchTerm("")} variant="outline">
                Limpar busca
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6">
                    <Link href={`/dashboard/produto/${product.id}`} className="block">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>

                      <div className="space-y-3">
                        {/* Pricing */}
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-green-800">Melhor Preço</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600">{product.bestMarket}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-green-600">R$ {product.bestPrice}</span>
                            {product.avgPrice > product.bestPrice && (
                              <span className="text-sm text-gray-500 line-through">R$ {product.avgPrice}</span>
                            )}
                          </div>
                          {product.avgPrice > product.bestPrice && (
                            <p className="text-xs text-green-600 mt-1">
                              Economia de R$ {(product.avgPrice - product.bestPrice).toFixed(2)}
                            </p>
                          )}
                        </div>

                        {/* Rating and Reviews */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{product.rating}</span>
                            <span className="text-xs text-gray-500">({product.reviews})</span>
                          </div>
                          <span className="text-xs text-gray-500">Atualizado {product.lastUpdate}</span>
                        </div>
                      </div>
                    </Link>

                    <div className="mt-4 pt-3 border-t">
                      <AddToListDialog
                        product={product}
                        onAdd={(productData) => {
                          console.log("Product added to list:", productData)
                          alert(`${product.name} adicionado à lista!`)
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
