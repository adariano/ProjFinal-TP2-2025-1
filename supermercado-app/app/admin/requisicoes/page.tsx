"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ShoppingCart, ArrowLeft, CheckCircle, X, Eye, AlertCircle, Package, DollarSign, User } from "lucide-react"
import Link from "next/link"

// Mock data para requisições
const mockRequests = [
  {
    id: 1,
    type: "product_suggestion",
    title: "Açúcar Cristal União 1kg",
    description: "Açúcar cristal especial da marca União, embalagem de 1kg",
    category: "Grãos",
    submittedBy: {
      name: "Carlos Lima",
      email: "carlos@email.com",
      reputation: 85,
    },
    submittedAt: "2025-01-20T10:30:00Z",
    status: "pending",
    details: {
      brand: "União",
      estimatedPrice: 4.2,
      barcode: "7891234567890",
    },
  },
  {
    id: 2,
    type: "price_report",
    title: "Preço do Arroz Tio João 5kg",
    description: "Preço encontrado no Extra - Av. Paulista",
    product: "Arroz Branco 5kg - Tio João",
    submittedBy: {
      name: "Fernanda Rocha",
      email: "fernanda@email.com",
      reputation: 92,
    },
    submittedAt: "2025-01-20T14:15:00Z",
    status: "pending",
    details: {
      reportedPrice: 17.8,
      market: "Extra",
      location: "Av. Paulista, 1000",
      photo: "/placeholder.svg?height=200&width=300",
    },
  },
  {
    id: 3,
    type: "product_suggestion",
    title: "Sabão em Pó OMO 1kg",
    description: "Sabão em pó concentrado OMO, embalagem de 1kg",
    category: "Limpeza",
    submittedBy: {
      name: "Roberto Silva",
      email: "roberto@email.com",
      reputation: 78,
    },
    submittedAt: "2025-01-19T16:45:00Z",
    status: "approved",
    details: {
      brand: "OMO",
      estimatedPrice: 12.5,
      barcode: "7891234567891",
    },
  },
  {
    id: 4,
    type: "market_suggestion",
    title: "Novo Mercado - SuperBom",
    description: "Sugestão de cadastro do mercado SuperBom",
    submittedBy: {
      name: "Ana Costa",
      email: "ana@email.com",
      reputation: 88,
    },
    submittedAt: "2025-01-19T09:20:00Z",
    status: "pending",
    details: {
      marketName: "SuperBom",
      address: "Rua das Flores, 123 - Centro",
      phone: "(11) 1234-5678",
      website: "www.superbom.com.br",
    },
  },
]

export default function RequisicoesPage() {
  const [user, setUser] = useState<any>(null)
  const [requests, setRequests] = useState(mockRequests)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [reviewComment, setReviewComment] = useState("")
  const [filter, setFilter] = useState("all")
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

  const handleApprove = (requestId: number) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? { ...req, status: "approved", reviewedAt: new Date().toISOString(), reviewComment }
          : req,
      ),
    )
    setReviewComment("")
    alert("Requisição aprovada com sucesso!")
  }

  const handleReject = (requestId: number) => {
    if (!reviewComment.trim()) {
      alert("Por favor, adicione um comentário explicando a rejeição")
      return
    }
    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? { ...req, status: "rejected", reviewedAt: new Date().toISOString(), reviewComment }
          : req,
      ),
    )
    setReviewComment("")
    alert("Requisição rejeitada.")
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
            Aprovada
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Rejeitada
          </Badge>
        )
      default:
        return <Badge variant="secondary">Desconhecido</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "product_suggestion":
        return <Package className="h-4 w-4" />
      case "price_report":
        return <DollarSign className="h-4 w-4" />
      case "market_suggestion":
        return <ShoppingCart className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "product_suggestion":
        return "Sugestão de Produto"
      case "price_report":
        return "Relatório de Preço"
      case "market_suggestion":
        return "Sugestão de Mercado"
      default:
        return "Outro"
    }
  }

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true
    return req.status === filter
  })

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
              <AlertCircle className="h-6 w-6 text-orange-600" />
              <h1 className="text-xl font-bold">Revisão de Requisições</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{requests.filter((r) => r.status === "pending").length}</p>
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
                  <p className="text-2xl font-bold">{requests.filter((r) => r.status === "approved").length}</p>
                  <p className="text-sm text-gray-600">Aprovadas</p>
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
                  <p className="text-2xl font-bold">{requests.filter((r) => r.status === "rejected").length}</p>
                  <p className="text-sm text-gray-600">Rejeitadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{requests.length}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
                Todas
              </Button>
              <Button variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>
                Pendentes
              </Button>
              <Button variant={filter === "approved" ? "default" : "outline"} onClick={() => setFilter("approved")}>
                Aprovadas
              </Button>
              <Button variant={filter === "rejected" ? "default" : "outline"} onClick={() => setFilter("rejected")}>
                Rejeitadas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Requisições ({filteredRequests.length})</CardTitle>
            <CardDescription>Gerencie todas as requisições dos usuários</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(request.type)}
                        <span className="text-sm">{getTypeLabel(request.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{request.title}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.submittedBy.name}</p>
                        <p className="text-xs text-gray-500">Rep: {request.submittedBy.reputation}%</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(request.submittedAt).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {getTypeIcon(selectedRequest?.type)}
                                {selectedRequest?.title}
                              </DialogTitle>
                              <DialogDescription>
                                {getTypeLabel(selectedRequest?.type)} • {selectedRequest?.submittedBy.name}
                              </DialogDescription>
                            </DialogHeader>

                            {selectedRequest && (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Descrição</h4>
                                  <p className="text-gray-700">{selectedRequest.description}</p>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Detalhes</h4>
                                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    {Object.entries(selectedRequest.details).map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="capitalize text-gray-600">
                                          {key.replace(/([A-Z])/g, " $1")}:
                                        </span>
                                        <span className="font-medium">{value as string}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {selectedRequest.status === "pending" && (
                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Comentário da Revisão</label>
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
                                        onClick={() => handleApprove(selectedRequest.id)}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Aprovar
                                      </Button>
                                      <Button variant="destructive" onClick={() => handleReject(selectedRequest.id)}>
                                        <X className="h-4 w-4 mr-2" />
                                        Rejeitar
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {request.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(request.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
