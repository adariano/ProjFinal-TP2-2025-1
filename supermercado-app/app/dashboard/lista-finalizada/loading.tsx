import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, ShoppingCart, DollarSign, Clock, Trophy, Star } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-200 to-green-300 rounded-full mx-auto mb-4 animate-pulse flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: ShoppingCart, color: "from-blue-200 to-blue-300" },
            { icon: DollarSign, color: "from-green-200 to-green-300" },
            { icon: Clock, color: "from-purple-200 to-purple-300" }
          ].map((item, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-full mx-auto mb-4 animate-pulse flex items-center justify-center`}>
                    <item.icon className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="h-8 bg-gray-200 rounded-lg w-16 mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-24 mx-auto animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Shopping Summary */}
        <Card className="mb-8">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-200 to-green-300 rounded-full animate-pulse flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded-lg w-32 mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-200 rounded-lg w-16 mb-1 animate-pulse"></div>
                    <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-20 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg w-full animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-full animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg w-full animate-pulse"></div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-gray-400" />
                <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full animate-pulse flex items-center justify-center">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-yellow-200 rounded-lg w-32 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
                    </div>
                    <div className="h-6 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full w-12 animate-pulse"></div>
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
