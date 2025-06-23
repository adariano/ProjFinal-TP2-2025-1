"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, Trophy, Target, TrendingUp, Award, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"

// Mock user profile data
const mockUserProfile = {
  name: "João Silva",
  email: "joao@email.com",
  joinDate: "2024-12-15",
  level: "Colaborador Ativo",
  nextLevel: "Expert",
  totalPoints: 247,
  pointsToNextLevel: 53,
  stats: {
    pricesReported: 15,
    productsReviewed: 8,
    productsSuggested: 3,
    listsCreated: 12,
    totalSavings: 145.5,
  },
  achievements: [
    {
      id: 1,
      title: "Primeiro Preço",
      description: "Informou seu primeiro preço",
      icon: "🎯",
      earned: true,
      date: "2024-12-16",
    },
    {
      id: 2,
      title: "Colaborador",
      description: "Informou 10 preços",
      icon: "🤝",
      earned: true,
      date: "2024-12-20",
    },
    {
      id: 3,
      title: "Avaliador",
      description: "Fez 5 avaliações de produtos",
      icon: "⭐",
      earned: true,
      date: "2024-12-25",
    },
    {
      id: 4,
      title: "Expert",
      description: "Informou 50 preços",
      icon: "🏆",
      earned: false,
      date: null,
    },
    {
      id: 5,
      title: "Economizador",
      description: "Economizou R$ 100",
      icon: "💰",
      earned: true,
      date: "2025-01-10",
    },
  ],
  recentActivity: [
    { action: "Informou preço do Arroz Tio João", points: 10, date: "2025-01-20" },
    { action: "Avaliou Leite Parmalat", points: 5, date: "2025-01-19" },
    { action: "Criou lista 'Compras da Semana'", points: 2, date: "2025-01-18" },
    { action: "Sugeriu produto Açúcar Cristal", points: 15, date: "2025-01-17" },
  ],
}

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null)
  const [profile] = useState(mockUserProfile)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  if (!user) {
    return <div>Carregando...</div>
  }

  const progressPercentage = (profile.totalPoints / (profile.totalPoints + profile.pointsToNextLevel)) * 100

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
              <Star className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-bold">Meu Perfil</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                    <p className="text-gray-600">{profile.email}</p>
                    <p className="text-sm text-gray-500">
                      Membro desde {new Date(profile.joinDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-purple-600 text-white">{profile.level}</Badge>
                    <span className="text-sm text-gray-600">Próximo: {profile.nextLevel}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{profile.totalPoints} pontos</span>
                      <span>{profile.pointsToNextLevel} pontos para o próximo nível</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{profile.stats.pricesReported}</p>
                    <p className="text-sm text-gray-600">Preços Informados</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{profile.stats.productsReviewed}</p>
                    <p className="text-sm text-gray-600">Produtos Avaliados</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{profile.stats.productsSuggested}</p>
                    <p className="text-sm text-gray-600">Produtos Sugeridos</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{profile.stats.listsCreated}</p>
                    <p className="text-sm text-gray-600">Listas Criadas</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">R$ {profile.stats.totalSavings}</p>
                    <p className="text-sm text-gray-600">Economia Total</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{profile.totalPoints}</p>
                    <p className="text-sm text-gray-600">Pontos Totais</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-gray-600">{new Date(activity.date).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-bold">+{activity.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Conquistas
                </CardTitle>
                <CardDescription>Suas conquistas no EconoMarket</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        achievement.earned ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${achievement.earned ? "text-green-900" : "text-gray-600"}`}>
                          {achievement.title}
                        </p>
                        <p className={`text-xs ${achievement.earned ? "text-green-700" : "text-gray-500"}`}>
                          {achievement.description}
                        </p>
                        {achievement.earned && achievement.date && (
                          <p className="text-xs text-green-600 mt-1">
                            Conquistado em {new Date(achievement.date).toLocaleDateString("pt-BR")}
                          </p>
                        )}
                      </div>
                      {achievement.earned && <Award className="h-4 w-4 text-green-600" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Points Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Como Ganhar Pontos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Informar preço</span>
                    <Badge variant="secondary">+10 pts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Avaliar produto</span>
                    <Badge variant="secondary">+5 pts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sugerir produto</span>
                    <Badge variant="secondary">+15 pts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Criar lista</span>
                    <Badge variant="secondary">+2 pts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completar compra</span>
                    <Badge variant="secondary">+3 pts</Badge>
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
