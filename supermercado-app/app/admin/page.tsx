"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { UserMenu } from "@/components/user-menu"
import { Users, Package, List, AlertCircle, Search } from "lucide-react"
import Link from "next/link"

const categories = [
  "Grãos",
  "Laticínios",
  "Carnes",
  "Frutas",
  "Verduras",
  "Padaria",
  "Limpeza",
  "Bebidas",
  "Higiene",
]

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
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: categories[0],
    brand: "",
    price: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
  })
  const [isUserSubmitting, setIsUserSubmitting] = useState(false)

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
          id: u.id,
          name: u.name,
          email: u.email,
          lists: u.shoppingLists?.length || 0,
          points: u.points || 0,
          status: u.status || "Ativo",
          role: u.role || "USER"
        })))

        // Produtos
        const productsRes = await fetch("/api/product")
        const productsData = productsRes.ok ? await productsRes.json() : []
        setProducts(productsData.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.avgPrice || 0,
          stock: p.stock || 0,
          status: p.status || "Ativo",
          lastUpdate: p.lastUpdate
        })))

        // Listas de compras
        const listsRes = await fetch("/api/shopping_list")
        const listsData = listsRes.ok ? await listsRes.json() : []

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

        // Atividades recentes: produtos, usuários e listas
        const recentProducts = productsData
          .sort((a: any, b: any) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
          .slice(0, 5)
          .map((p: any) => ({
            type: "product",
            text: `Produto adicionado: ${p.name}`,
            time: p.lastUpdate ? new Date(p.lastUpdate).toLocaleDateString() : ""
          }))

        const recentUsers = usersData
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .map((u: any) => ({
            type: "user",
            text: `Novo usuário: ${u.name}`,
            time: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""
          }))

        const recentLists = Array.isArray(listsData)
          ? listsData
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((l: any) => ({
              type: "list",
              text: `Lista criada: ${l.name}`,
              time: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ""
            }))
          : []

        setRecentActivity([...recentProducts, ...recentUsers, ...recentLists])

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
                <Button onClick={() => setShowAddUser(true)}>+ Novo Usuário</Button>
                {showAddUser && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                      <h2 className="text-xl font-bold mb-4">Adicionar Novo Usuário</h2>
                      <div className="space-y-3 mb-4">
                        <Input placeholder="Nome" value={newUser?.name || ""} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} />
                        <Input placeholder="Email" value={newUser?.email || ""} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} />
                        <Input placeholder="CPF" value={newUser?.cpf || ""} onChange={e => setNewUser(p => ({ ...p, cpf: e.target.value }))} />
                        <Input type="password" placeholder="Senha" value={newUser?.password || ""} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setShowAddUser(false)}>Cancelar</Button>
                        <Button
                          disabled={isUserSubmitting || !newUser?.name || !newUser?.email || !newUser?.cpf || !newUser?.password}
                          onClick={async () => {
                            setIsUserSubmitting(true)
                            const res = await fetch("/api/user", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                name: newUser.name,
                                email: newUser.email,
                                cpf: newUser.cpf,
                                password: newUser.password
                              })
                            })
                            if (res.ok) {
                              const user = await res.json()
                              setUsers(prev => [...prev, {
                                name: user.name,
                                email: user.email,
                                lists: 0,
                                points: 0,
                                status: "Ativo"
                              }])
                              setShowAddUser(false)
                              setNewUser({ name: "", email: "", cpf: "", password: "" })
                            } else {
                              alert("Erro ao adicionar usuário")
                            }
                            setIsUserSubmitting(false)
                          }}
                        >Salvar</Button>
                      </div>
                    </div>
                  </div>
                )}
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
                      {u.role !== "ADMIN" && (
                        u.status === "Ativo" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300 text-gray-700"
                            onClick={async () => {
                              await fetch("/api/user", {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id: u.id, status: "Inativo" })
                              })
                              setUsers(prev => prev.map(user => user.email === u.email ? { ...user, status: "Inativo" } : user))
                            }}
                          >Desativar</Button>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={async () => {
                              await fetch("/api/user", {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id: u.id, status: "Ativo" })
                              })
                              setUsers(prev => prev.map(user => user.email === u.email ? { ...user, status: "Ativo" } : user))
                            }}
                          >Ativar</Button>
                        )
                      )}
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
                <Button onClick={() => setShowAddProduct(true)}>+ Novo Produto</Button>
                {showAddProduct && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                      <h2 className="text-xl font-bold mb-4">Adicionar Novo Produto</h2>
                      <div className="space-y-3 mb-4">
                        <Input placeholder="Nome" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} />
                        <div>
                          <Select value={newProduct.category} onValueChange={val => setNewProduct(p => ({ ...p, category: val }))}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Input placeholder="Marca" value={newProduct.brand} onChange={e => setNewProduct(p => ({ ...p, brand: e.target.value }))} />
                        <Input type="number" min={0} step={0.01} placeholder="Preço médio" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setShowAddProduct(false)}>Cancelar</Button>
                        <Button
                          disabled={isSubmitting || !newProduct.name || !newProduct.category || !newProduct.brand || !newProduct.price}
                          onClick={async () => {
                            setIsSubmitting(true)
                            const res = await fetch("/api/product", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                name: newProduct.name,
                                category: newProduct.category,
                                brand: newProduct.brand,
                                avgPrice: Number(newProduct.price)
                              })
                            })
                            if (res.ok) {
                              const prod = await res.json()
                              setProducts(prev => [...prev, {
                                name: prod.name,
                                category: prod.category,
                                price: prod.avgPrice,
                                stock: 0,
                                status: "Ativo"
                              }])
                              setShowAddProduct(false)
                              setNewProduct({ name: "", category: categories[0], brand: "", price: "" })
                            } else {
                              alert("Erro ao adicionar produto")
                            }
                            setIsSubmitting(false)
                          }}
                        >Salvar</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {products.filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase())).map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-gray-600">{p.category} • R$ {p.price.toFixed(2)}</p>
                      <p className="text-xs text-green-600">Estoque: {p.stock}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${p.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{p.status}</span>
                      {p.status === "Ativo" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-300 text-gray-700"
                          onClick={async () => {
                            await fetch("/api/product", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ name: p.name, status: "Inativo" })
                            })
                            setProducts(prev => prev.map(prod => prod.name === p.name ? { ...prod, status: "Inativo" } : prod))
                          }}
                        >Desativar</Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={async () => {
                            await fetch("/api/product", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ name: p.name, status: "Ativo" })
                            })
                            setProducts(prev => prev.map(prod => prod.name === p.name ? { ...prod, status: "Ativo" } : prod))
                          }}
                        >Ativar</Button>
                      )}
                    </div>
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
