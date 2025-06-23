"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Calendar,
  ShoppingCart,
  Search,
  Filter,
  TrendingDown,
  Trash2,
  Plus,
  CheckCircle,
  Edit,
} from "lucide-react"
import Link from "next/link"

interface HistoryEntry {
  id: number
  listName: string
  action: "created" | "completed" | "modified" | "deleted"
  date: string
  timestamp: string
  details: string
  itemCount?: number
  totalSpent?: number
  totalSaved?: number
}

// Mock history data - in real app this would come from API/database
const mockHistory: HistoryEntry[] = [
  {
    id: 1,
    listName: "Compras da Semana",
    action: "completed",
    date: "2025-01-20",
    timestamp: "14:30",
    details: "Lista finalizada com 12 itens coletados",
    itemCount: 12,
    totalSpent: 89.5,
    totalSaved: 12.3,
  },
  {
    id: 2,
    listName: "Festa de Aniversário",
    action: "created",
    date: "2025-01-19",
    timestamp: "09:15",
    details: "Nova lista criada com 25 itens",
    itemCount: 25,
  },
  {
    id: 3,
    listName: "Produtos de Limpeza",
    action: "completed",
    date: "2025-01-18",
    timestamp: "16:45",
    details: "Lista finalizada com economia de R$ 8,20",
    itemCount: 8,
    totalSpent: 45.2,
    totalSaved: 8.2,
  },
  {
    id: 4,
    listName: "Compras do Mês",
    action: "modified",
    date: "2025-01-17",
    timestamp: "11:20",
    details: "3 itens adicionados à lista",
    itemCount: 18,
  },
  {
    id: 5,
    listName: "Lista Teste",
    action: "deleted",
    date: "2025-01-16",
    timestamp: "08:30",
    details: "Lista removida pelo usuário",
    itemCount: 5,
  },
]

export default function HistoricoPage() {
  const [user, setUser] = useState<any>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [filteredHistory, setFilteredHistory] = useState<HistoryEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState<string>("all")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    // Load history from localStorage and merge with mock data
    const savedHistory = JSON.parse(localStorage.getItem("listHistory") || "[]")
    const combinedHistory = [...mockHistory, ...savedHistory].sort(
      (a, b) => new Date(b.date + " " + b.timestamp).getTime() - new Date(a.date + " " + a.timestamp).getTime(),
    )
    setHistory(combinedHistory)
    setFilteredHistory(combinedHistory)
  }, [router])

  useEffect(() => {
    let filtered = history

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.listName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.details.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by action
    if (filterAction !== "all") {
      filtered = filtered.filter((entry) => entry.action === filterAction)
    }

    setFilteredHistory(filtered)
  }, [searchTerm, filterAction, history])

  const getActionIcon = (action: string) => {
    switch (action) {
      case "created":
        return <Plus className="h-4 w-4 text-green-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "modified":
        return <Edit className="h-4 w-4 text-yellow-600" />
      case "deleted":
        return <Trash2 className="h-4 w-4 text-red-600" />
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "created":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "modified":
        return "bg-yellow-100 text-yellow-800"
      case "deleted":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case "created":
        return "Criada"
      case "completed":
        return "Finalizada"
      case "modified":
        return "Modificada"
      case "deleted":
        return "Removida"
      default:
        return action
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
              <Calendar className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold">Histórico de Atividades</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar no histórico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white"
            >
              <option value="all">Todas as ações</option>
              <option value="created">Criadas</option>
              <option value="completed">Finalizadas</option>
              <option value="modified">Modificadas</option>
              <option value="deleted">Removidas</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-bold">{history.filter((h) => h.action === "created").length}</p>
                  <p className="text-sm text-gray-600">Listas Criadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-bold">{history.filter((h) => h.action === "completed").length}</p>
                  <p className="text-sm text-gray-600">Finalizadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg font-bold">
                    R$ {history.reduce((sum, h) => sum + (h.totalSaved || 0), 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Total Economizado</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-lg font-bold">{history.length}</p>
                  <p className="text-sm text-gray-600">Total de Ações</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Linha do Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma atividade encontrada</p>
                <p className="text-sm">Tente ajustar os filtros de busca</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((entry, index) => (
                  <div key={entry.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0 mt-1">{getActionIcon(entry.action)}</div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{entry.listName}</h3>
                        <Badge variant="secondary" className={getActionColor(entry.action)}>
                          {getActionText(entry.action)}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{entry.details}</p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(entry.date).toLocaleDateString("pt-BR")} às {entry.timestamp}
                        </span>
                        {entry.itemCount && <span>{entry.itemCount} itens</span>}
                        {entry.totalSpent && (
                          <span className="text-green-600">Gasto: R$ {entry.totalSpent.toFixed(2)}</span>
                        )}
                        {entry.totalSaved && (
                          <span className="text-blue-600">Economia: R$ {entry.totalSaved.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
