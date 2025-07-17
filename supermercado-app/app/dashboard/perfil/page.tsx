"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, Trophy, Target, TrendingUp, Award, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    
    // Fetch real profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/user/${parsedUser.id}/profile`)
        if (response.ok) {
          const profileData = await response.json()
          setProfile(profileData)
        } else {
          console.error('Error fetching profile:', response.statusText)
          // Set a basic profile structure if API fails
          setProfile({
            name: parsedUser.name || 'Usuário',
            email: parsedUser.email || '',
            joinDate: parsedUser.createdAt || new Date().toISOString(),
            level: "Iniciante",
            nextLevel: "Colaborador",
            totalPoints: 0,
            pointsToNextLevel: 50,
            stats: {
              pricesReported: 0,
              productsReviewed: 0,
              productsSuggested: 0,
              listsCreated: 0,
              totalSavings: 0,
            },
            achievements: [],
            recentActivity: [],
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        // Set a basic profile structure if API fails
        setProfile({
          name: parsedUser.name || 'Usuário',
          email: parsedUser.email || '',
          joinDate: parsedUser.createdAt || new Date().toISOString(),
          level: "Iniciante",
          nextLevel: "Colaborador",
          totalPoints: 0,
          pointsToNextLevel: 50,
          stats: {
            pricesReported: 0,
            productsReviewed: 0,
            productsSuggested: 0,
            listsCreated: 0,
            totalSavings: 0,
          },
          achievements: [],
          recentActivity: [],
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [router])

  if (!user || !profile || loading) {
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

        {/* Loading State */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info Loading */}
            <div className="lg:col-span-2 space-y-6">
              {/* User Info Skeleton */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded-lg w-36 animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-6 bg-purple-200 rounded-full w-24 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full w-full animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-gray-400" />
                    <div className="h-6 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="h-8 bg-gray-200 rounded-lg w-12 mx-auto mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-20 mx-auto animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded-lg w-48 mb-1 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded-lg w-12 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Loading */}
            <div className="space-y-6">
              {/* Achievements Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-gray-400" />
                    <div className="h-6 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                  </CardTitle>
                  <CardDescription>
                    <div className="h-4 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded-lg w-24 mb-1 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded-lg w-36 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Points Breakdown Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-gray-400" />
                    <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="h-4 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
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
                  {profile.recentActivity.map((activity: any, index: number) => (
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
                  {profile.achievements.map((achievement: any) => (
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
