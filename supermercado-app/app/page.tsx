import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Users, TrendingDown, MapPin, Star, CheckCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">EconoMarket</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link href="/cadastro">
              <Button className="bg-green-600 hover:bg-green-700">Criar Conta</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Economize nas suas compras com <span className="text-green-600">colaboração inteligente</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Compare preços, encontre os melhores mercados e colabore com outros usuários para economizar tempo e
            dinheiro nas suas compras do dia a dia.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/cadastro">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                Começar Agora - Grátis
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Como funciona o EconoMarket</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Listas Inteligentes</CardTitle>
              <CardDescription>
                Crie e gerencie suas listas de compras com sugestões automáticas de preços
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingDown className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Comparação de Preços</CardTitle>
              <CardDescription>Compare preços em tempo real baseado em dados colaborativos de usuários</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Recomendações</CardTitle>
              <CardDescription>Encontre os melhores mercados baseado em preço, distância e qualidade</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Colaboração</CardTitle>
              <CardDescription>Contribua com preços e avaliações para ajudar outros usuários</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Sistema de Recompensas</CardTitle>
              <CardDescription>Ganhe pontos e reconhecimento por contribuir com a comunidade</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Compras Guiadas</CardTitle>
              <CardDescription>Navegue pelo mercado com informações de localização dos produtos</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para economizar nas suas compras?</h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de usuários que já estão economizando com o EconoMarket
          </p>
          <Link href="/cadastro">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShoppingCart className="h-6 w-6" />
            <span className="text-xl font-bold">EconoMarket</span>
          </div>
          <p className="text-gray-400">© 2025 EconoMarket. Economize inteligente, compre colaborativo.</p>
        </div>
      </footer>
    </div>
  )
}
