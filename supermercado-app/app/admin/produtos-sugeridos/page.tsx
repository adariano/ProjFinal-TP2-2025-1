"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, CheckCircle, X, Eye, Package, User } from "lucide-react"
import Link from "next/link"

// Mock data para produtos sugeridos
const mockSuggestedProducts = [
  {
    id: 1,
    name: "Açúcar Cristal União 1kg",
    brand: "União",
    category: "Grãos",
    description: "Açúcar cristal especial da marca União, embalagem de 1kg",
    estimatedPrice: 4.2,
    barcode: "7891234567890",
    reason: "Produto muito procurado pelos usuários, mas não está no catálogo",
    submittedBy: {
      name: "Carlos Lima",
      email: "carlos@email.com",
      reputation: 85,
    },
    submittedAt: "2025-01-20T10:30:00Z",
    status: "pending",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Sabão em Pó OMO 1kg",
    brand: "OMO",
    category: "Limpeza",
    description: "Sabão em pó concentrado OMO, embalagem de 1kg",
    estimatedPrice: 12.5,
    barcode: "7891234567891",
    reason: "Marca popular que falta no sistema",
    submittedBy: {
      name: "Roberto Silva",
      email: "roberto@email.com",
      reputation: 78,
    },
    submittedAt: "2025-01-19T16:45:00Z",
    status: "approved",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Iogurte Natural Danone 170g",
    brand: "Danone",
    category: "Laticínios",
    description: "Iogurte natural sem açúcar, embalagem de 170g",
    estimatedPrice: 3.8,
    barcode: "7891234567892",
    reason: "Produto saudável muito consumido",
    submittedBy: {
      name: "Ana Costa",
      email: "ana@email.com",
      reputation: 92,
    },
    submittedAt: "2025-01-18T14:20:00Z",
    status: "rejected",
    reviewComment: "Produto já existe no catálogo com nome similar",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function ProdutosSugeridosPage() {
  const [user, setUser] = useState<any>(null)
  const [suggestions, setSuggestions] = useState(mockSuggestedProducts)
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null)
  const [reviewComment, setReviewComment] = useState("")
  const [filter, setFilter] = useState("pending")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      router.push("/dashboard")
      return
    }
    setUser(parsedUser)
  }, [router])

  const handleApprove = (suggestionId: number) => {
    setSuggestions(
      suggestions.map((suggestion) =>
        suggestion.id === suggestionId
          ? {
              ...suggestion,
              status: "approved",
              reviewedAt: new Date().toISOString(),
              reviewComment,
            }
          : suggestion,
      ),
    )
    setReviewComment("")
    alert("Produto aprovado e adicionado ao catálogo!")
  }

  const handleReject = (suggestionId: number) => {
    if (!reviewComment.trim()) {
      alert("Por favor, adicione um comentário explicando a rejeição")
      return
    }
    setSuggestions(
      suggestions.map((suggestion) =>
        suggestion.id === suggestionId
          ? {
              ...suggestion,
              status: "rejected",
              reviewedAt: new Date().toISOString(),
              reviewComment,
            }
          : suggestion,
      ),
    )
    setReviewComment("")
    alert("Sugestão rejeitada.")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pendente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Aprovado
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Rejeitado
          </Badge>
        )
      default:
        return <Badge variant="secondary">Desconhecido</Badge>
    }
  }

  const filteredSuggestions = suggestions.filter((suggestion) => {
    if (filter === "all") return true
    return suggestion.status === filter
  })

  const pendingCount = suggestions.filter((s) => s.status === "pending").length

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Admin
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold">Produtos Sugeridos</h1>
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingCount} pendentes
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Package className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{suggestions.filter((s) => s.status === "pending").length}</p>
                  <p className="text-sm text-gray-600">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{suggestions.filter((s) => s.status === "approved").length}</p>
                  <p className="text-sm text-gray-600">Aprovados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{suggestions.filter((s) => s.status === "rejected").length}</p>
                  <p className="text-sm text-gray-600">Rejeitados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Button variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>
                Pendentes ({suggestions.filter((s) => s.status === "pending").length})
              </Button>
              <Button variant={filter === "approved" ? "default" : "outline"} onClick={() => setFilter("approved")}>
                Aprovados
              </Button>
              <Button variant={filter === "rejected" ? "default" : "outline"} onClick={() => setFilter("rejected")}>
                Rejeitados
              </Button>
              <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
                Todos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sugestões de Produtos ({filteredSuggestions.length})</CardTitle>
            <CardDescription>Analise e aprove/rejeite sugestões de novos produtos</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço Est.</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuggestions.map((suggestion) => (
                  <TableRow key={suggestion.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{suggestion.name}</p>
                        <p className="text-sm text-gray-600">{suggestion.brand}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{suggestion.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      R$ {suggestion.estimatedPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{suggestion.submittedBy.name}</p>
                        <p className="text-xs text-gray-500">Rep: {suggestion.submittedBy.reputation}%</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(suggestion.submittedAt).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{getStatusBadge(suggestion.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedSuggestion(suggestion)}>
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                {selectedSuggestion?.name}
                              </DialogTitle>
                              <DialogDescription>
                                Sugestão de produto • {selectedSuggestion?.submittedBy.name}
                              </DialogDescription>
                            </DialogHeader>

                            {selectedSuggestion && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium mb-2">Informações do Produto</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Nome:</span>
                                          <span className="font-medium">{selectedSuggestion.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Marca:</span>
                                          <span className="font-medium">{selectedSuggestion.brand}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Categoria:</span>
                                          <Badge variant="secondary">{selectedSuggestion.category}</Badge>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Preço Estimado:</span>
                                          <span className="font-medium text-green-600">
                                            R$ {selectedSuggestion.estimatedPrice.toFixed(2)}
                                          </span>
                                        </div>
                                        {selectedSuggestion.barcode && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Código de Barras:</span>
                                            <span className="font-mono text-sm">{selectedSuggestion.barcode}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-medium mb-2">Usuário</h4>
                                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <User className="h-8 w-8 text-gray-400" />
                                        <div>
                                          <p className="font-medium">{selectedSuggestion.submittedBy.name}</p>
                                          <p className="text-sm text-gray-600">
                                            {selectedSuggestion.submittedBy.email}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Reputação: {selectedSuggestion.submittedBy.reputation}%
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium mb-2">Imagem do Produto</h4>
                                      <div className="border rounded-lg p-4 bg-gray-50 text-center">
                                        <Package className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                                        <p className="text-sm text-gray-600">Imagem do produto</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Descrição</h4>
                                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                    {selectedSuggestion.description}
                                  </p>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Justificativa</h4>
                                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{selectedSuggestion.reason}</p>
                                </div>

                                {selectedSuggestion.status === "pending" && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="block text-sm font-medium mb-2">Comentário da Revisão</Label>
                                      <Textarea
                                        placeholder="Adicione um comentário sobre sua decisão..."
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        rows={3}
                                      />
                                    </div>

                                    <div className="flex gap-3">
                                      <Button
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleApprove(selectedSuggestion.id)}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Aprovar e Adicionar
                                      </Button>
                                      <Button variant="destructive" onClick={() => handleReject(selectedSuggestion.id)}>
                                        <X className="h-4 w-4 mr-2" />
                                        Rejeitar
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {selectedSuggestion.reviewComment && (
                                  <div>
                                    <h4 className="font-medium mb-2">Comentário da Revisão</h4>
                                    <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                      {selectedSuggestion.reviewComment}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {suggestion.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(suggestion.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(suggestion.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredSuggestions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma sugestão encontrada</p>
                <p className="text-sm">
                  {filter === "pending" ? "Não há sugestões pendentes no momento" : "Ajuste os filtros para ver mais"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
