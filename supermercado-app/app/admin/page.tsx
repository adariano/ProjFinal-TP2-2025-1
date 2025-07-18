"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserMenu } from "@/components/user-menu"
import { Users, Package, List, AlertCircle, Search } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    activeLists: 0,
    pendingRequests: 0,
    usersGrowth: 0,
    productsGrowth: 0,
    listsGrowth: 0,
    requestsGrowth: 0,
  })
  const [users, setUsers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [searchUser, setSearchUser] = useState("")
  const [searchProduct, setSearchProduct] = useState("")

  useEffect(() => {
    // Busca o usuário do localStorage para usar a mesma foto do dashboard comum
    const userData = localStorage.getItem("user")
    let parsedUser = null
    if (userData) {
      parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } else {
      setUser({ name: "João Silva", role: "admin", photoUrl: "/placeholder-user.jpg" }) // fallback
    }

    // Buscar dados das APIs
    const fetchData = async () => {
      try {
        // Usuários
        const usersRes = await fetch("/api/user")
        const usersData = usersRes.ok ? await usersRes.json() : []
        const totalLists = usersData.reduce((acc: number, u: any) => acc + (u.shoppingLists?.length || 0), 0)
        setUsers(usersData.map((u: any) => ({
          name: u.name,
          email: u.email,
          lists: u.shoppingLists?.length || 0,
          points: u.points || 0,
          status: "Ativo", // ajuste conforme necessário
        })))

        // Produtos
        const productsRes = await fetch("/api/product")
        const productsData = productsRes.ok ? await productsRes.json() : []
        setProducts(productsData.map((p: any) => ({
          name: p.name,
          category: p.category,
          price: p.avgPrice || 0,
          stock: p.stock || 0,
          status: "Ativo", // ajuste conforme necessário
        })))

        // Stats
        let statsRes = null
        if (parsedUser && parsedUser.id) {
          statsRes = await fetch(`/api/stats?userId=${parsedUser.id}`)
        }
        const statsData = statsRes && statsRes.ok ? await statsRes.json() : {}
        // Sugestões de produto dos usuários (requisições pendentes)
        const suggestionsRes = await fetch("/api/productSuggestion")
        const suggestionsData: any[] = suggestionsRes.ok ? await suggestionsRes.json() : []
        const pendingCount = suggestionsData.filter((s) => s.status === "pending").length
        setStats({
          activeLists: totalLists,
          prices: statsData.prices || 0,
          reviews: statsData.reviews || 0,
          totalUsers: usersData.length || 0,
          totalProducts: productsData.length || 0,
          pendingRequests: pendingCount,
          usersGrowth: 0,
          productsGrowth: 0,
          listsGrowth: 0,
          requestsGrowth: 0,
        })

        // Preços Recentes (usado como exemplo de atividade)
        const recentRes = await fetch("/api/price_reports/recent")
        const recentData = recentRes.ok ? await recentRes.json() : []
        setRecentActivity(recentData.map((r: any) => ({
          type: "product",
          text: `Preço informado: ${r.name} em ${r.market}`,
          time: r.date,
        })))

        setPendingRequests(suggestionsData.map((s: any) => ({
          id: s.id,
          name: s.name,
          user: s.submittedBy || "Usuário",
          price: s.estimatedPrice || 0,
          date: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "",
          priority: s.status === "pending" ? "Alta" : "Média",
        })))
      } catch (err) {
        // fallback em caso de erro
        setStats({
          totalUsers: 0,
          totalProducts: 0,
          activeLists: 0,
          pendingRequests: 0,
          usersGrowth: 0,
          productsGrowth: 0,
          listsGrowth: 0,
          requestsGrowth: 0,
        })
        setUsers([])
        setProducts([])
        setPendingRequests([])
        setRecentActivity([])
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/admin" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">EconoMarket</span>
              <span className="text-xs text-gray-500">Painel Administrativo</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user && <UserMenu user={{ ...user, hideProfile: true }} />}
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Olá, Administrador! 👋</h1>
        <p className="text-gray-600 mb-8">Aqui está um resumo completo das atividades da plataforma hoje.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total de Usuários</p>
                  <p className="text-xs text-green-600">{stats.usersGrowth > 0 ? `+${stats.usersGrowth}%` : `${stats.usersGrowth}%`} em relação ao mês passado</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Produtos Cadastrados</p>
                  <p className="text-xs text-green-600">{stats.productsGrowth > 0 ? `+${stats.productsGrowth}%` : `${stats.productsGrowth}%`} em relação ao mês passado</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <List className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeLists.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Listas Ativas</p>
                  <p className="text-xs text-green-600">{stats.listsGrowth > 0 ? `+${stats.listsGrowth}%` : `${stats.listsGrowth}%`} em relação ao mês passado</p>
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
                  <p className="text-2xl font-bold">{stats.pendingRequests.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Requisições Pendentes</p>
                  <p className="text-xs text-red-600">{stats.requestsGrowth > 0 ? `+${stats.requestsGrowth}%` : `${stats.requestsGrowth}%`} em relação ao mês passado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gerenciar Usuários</CardTitle>
              <CardDescription>Total de {users.length} usuários mostrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <Input placeholder="Buscar usuários por nome ou email..." value={searchUser} onChange={e => setSearchUser(e.target.value)} />
                <Button>+ Novo Usuário</Button>
              </div>
              <div className="space-y-2">
                {users.filter(u => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())).map((u, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{u.name}</p>
                      <p className="text-xs text-gray-600">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-600">{u.lists} listas</span>
                      <span className="text-xs text-gray-600">{u.points} pontos</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${u.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{u.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Atividade Recente</CardTitle>
              <CardDescription>Últimas ações na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentActivity.map((a, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2">
                    <span className="text-sm text-gray-800">{a.text}</span>
                    <span className="text-xs text-gray-500">{a.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gerenciar Produtos</CardTitle>
              <CardDescription>Total de {products.length} produtos mostrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <Input placeholder="Buscar produtos..." value={searchProduct} onChange={e => setSearchProduct(e.target.value)} />
                <Button>+ Novo Produto</Button>
              </div>
              <div className="space-y-2">
                {products.filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase())).map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-gray-600">{p.category} • R$ {p.price.toFixed(2)}</p>
                      <p className="text-xs text-green-600">Estoque: {p.stock}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${p.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requisições Pendentes</CardTitle>
              <CardDescription>{pendingRequests.length} aguardando aprovação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendingRequests.map((r, idx) => (
                  <div key={idx} className="p-3 rounded-lg border mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{r.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${r.priority === "Alta" ? "bg-red-100 text-red-800" : r.priority === "Média" ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-800"}`}>{r.priority}</span>
                    </div>
                    <p className="text-xs text-gray-600">Solicitado por: {r.user}</p>
                    <p className="text-xs text-gray-600">R$ {r.price.toFixed(2)} • {r.date}</p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={async () => {
                          await fetch("/api/productSuggestion", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: r.id, status: "approved" })
                          })
                          // Remove item da lista localmente sem esperar nova busca
                          setPendingRequests(prev => prev.filter(item => item.id !== r.id))
                          setStats(prev => ({ ...prev, pendingRequests: prev.pendingRequests - 1 }))
                          // Adiciona produto aprovado à lista de produtos
                          setProducts(prev => [
                            ...prev,
                            {
                              name: r.name,
                              category: "Sugestão", // ou ajuste conforme necessário
                              price: r.price,
                              stock: 0,
                              status: "Ativo"
                            }
                          ])
                          alert("Produto aprovado e adicionado ao catálogo!")
                        }}
                      >Aprovar</Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-700"
                        onClick={async () => {
                          await fetch("/api/productSuggestion", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: r.id, status: "rejected" })
                          })
                          setPendingRequests(prev => prev.filter(item => item.id !== r.id))
                          setStats(prev => ({ ...prev, pendingRequests: prev.pendingRequests - 1 }))
                          alert("Sugestão rejeitada.")
                        }}
                      >Rejeitar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
