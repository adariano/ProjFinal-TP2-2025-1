"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, Users, Package, TrendingUp, AlertCircle, User, LogOut } from "lucide-react"
import Link from "next/link"

// Mock data
const mockStats = {
  totalUsers: 1247,
  totalLists: 3891,
  totalProducts: 15623,
  pendingSuggestions: 23,
}

const mockRecentActivity = [
  { id: 1, user: "João Silva", action: "criou uma lista", time: "2 min atrás" },
  { id: 2, user: "Maria Santos", action: "atualizou preço do Arroz 5kg", time: "5 min atrás" },
  { id: 3, user: "Pedro Costa", action: "sugeriu novo produto", time: "10 min atrás" },
  { id: 4, user: "Ana Oliveira", action: "completou uma compra", time: "15 min atrás" },
]

const mockUsers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    lists: 5,
    contributions: 23,
    joinDate: "2024-12-15",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    lists: 8,
    contributions: 45,
    joinDate: "2024-11-20",
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@email.com",
    lists: 3,
    contributions: 12,
    joinDate: "2025-01-10",
  },
]

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
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

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
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
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">EconoMarket</span>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Admin
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <Button variant={activeTab === "dashboard" ? "default" : "outline"} onClick={() => setActiveTab("dashboard")}>
            Dashboard
          </Button>
          <Button variant={activeTab === "users" ? "default" : "outline"} onClick={() => setActiveTab("users")}>
            Usuários
          </Button>
          <Link href="/admin/produtos">
            <Button variant="outline">Produtos</Button>
          </Link>
          <Link href="/admin/produtos-sugeridos">
            <Button variant="outline">
              Produtos Sugeridos
              <Badge variant="destructive" className="ml-2">
                {mockStats.pendingSuggestions}
              </Badge>
            </Button>
          </Link>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
              <p className="text-gray-600">Visão geral do sistema EconoMarket</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Usuários Totais</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <ShoppingCart className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{mockStats.totalLists.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Listas Criadas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{mockStats.totalProducts.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Produtos Cadastrados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <AlertCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{mockStats.pendingSuggestions}</p>
                      <p className="text-sm text-gray-600">Produtos Pendentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Últimas ações dos usuários no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-white rounded-full">
                        <TrendingUp className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/admin/produtos-sugeridos">
                    <Button className="w-full" variant="outline">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Ver Produtos Sugeridos ({mockStats.pendingSuggestions} pendentes)
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Gerenciamento de Usuários</h2>
              <p className="text-gray-600">Visualize e gerencie todos os usuários do sistema</p>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Listas</TableHead>
                      <TableHead>Contribuições</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.lists}</TableCell>
                        <TableCell>{user.contributions}</TableCell>
                        <TableCell>{new Date(user.joinDate).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Editar
                            </Button>
                            <Button size="sm" variant="destructive">
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
