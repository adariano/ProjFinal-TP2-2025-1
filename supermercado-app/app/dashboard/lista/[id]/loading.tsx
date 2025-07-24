import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, ShoppingCart, MapPin, Package, DollarSign, CheckCircle, Circle } from "lucide-react"

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
              <ShoppingCart className="h-6 w-6 text-green-600" />
              <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* List Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg w-24 animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-28 animate-pulse"></div>
            </div>
          </div>

          {/* Market Info */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-200 to-blue-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded-lg w-32 mb-1 animate-pulse"></div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div className="h-4 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-8 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg w-20 animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { icon: Package, color: "from-blue-200 to-blue-300" },
            { icon: DollarSign, color: "from-green-200 to-green-300" },
            { icon: CheckCircle, color: "from-purple-200 to-purple-300" }
          ].map((item, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center animate-pulse`}>
                    <item.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="h-5 bg-gray-200 rounded-lg w-12 mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Shopping List Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
              <div className="h-8 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-24 animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse flex items-center justify-center">
                    <Circle className="h-4 w-4 text-gray-600" />
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
                  <div className="flex gap-2">
                    <div className="h-8 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg w-8 animate-pulse"></div>
                    <div className="h-8 bg-gradient-to-r from-red-200 to-red-300 rounded-lg w-8 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
