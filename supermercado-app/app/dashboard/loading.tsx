import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ShoppingCart, TrendingUp, Target, Users, Star, Clock, Package, DollarSign } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">EconoMarket</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-200 to-blue-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 mb-1 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-96 animate-pulse"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: TrendingUp, color: "from-blue-200 to-blue-300" },
            { icon: Target, color: "from-green-200 to-green-300" },
            { icon: Users, color: "from-purple-200 to-purple-300" },
            { icon: DollarSign, color: "from-yellow-200 to-yellow-300" }
          ].map((item, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center animate-pulse`}>
                    <item.icon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="h-6 bg-gray-200 rounded-lg w-16 mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-gray-400" />
                <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-200 to-blue-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded-lg w-32 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-lg w-16 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-400" />
                <div className="h-6 bg-gray-200 rounded-lg w-36 animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded-lg w-40 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                    </div>
                    <div className="h-6 bg-gradient-to-r from-green-200 to-green-300 rounded-full w-16 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
