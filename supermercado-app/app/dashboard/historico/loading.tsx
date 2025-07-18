import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Calendar, ShoppingCart, TrendingUp, Clock, MapPin, DollarSign } from "lucide-react"

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
              <Calendar className="h-6 w-6 text-green-600" />
              <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 mb-1 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-96 animate-pulse"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: ShoppingCart, color: "from-green-200 to-green-300" },
            { icon: TrendingUp, color: "from-blue-200 to-blue-300" },
            { icon: Clock, color: "from-purple-200 to-purple-300" },
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

        {/* Shopping Lists History */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 animate-pulse"></div>
                      <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded-full w-20 animate-pulse"></div>
                    </div>

                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div className="h-4 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div className="h-4 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="h-4 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                      <div className="h-4 bg-blue-200 rounded-lg w-24 animate-pulse"></div>
                      <div className="h-4 bg-green-200 rounded-lg w-28 animate-pulse"></div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-5 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full w-16 animate-pulse"></div>
                      <div className="h-5 bg-gradient-to-r from-indigo-200 to-indigo-300 rounded-full w-20 animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <div className="h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg w-24 animate-pulse"></div>
                    <div className="h-8 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-24 animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State Placeholder */}
        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-48 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
