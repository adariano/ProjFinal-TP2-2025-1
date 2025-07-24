import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ShoppingCart, MapPin, Star, Clock, Phone, Navigation, Filter, Search, Locate, ExternalLink } from "lucide-react"

export default function MercadosLoading() {
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
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-96 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-40 animate-pulse"></div>
          </div>
        </div>

        {/* Location Search */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div className="h-6 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded-lg w-80 animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg w-20 animate-pulse flex items-center justify-center">
                <Search className="h-4 w-4 text-blue-600" />
              </div>
              <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-36 animate-pulse flex items-center justify-center">
                <Locate className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Info Card */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-blue-400" />
              <div className="h-5 bg-blue-200 rounded-lg w-32 animate-pulse"></div>
            </div>
            <div className="space-y-1">
              <div className="h-4 bg-blue-200 rounded-lg w-full animate-pulse"></div>
              <div className="h-4 bg-blue-200 rounded-lg w-3/4 animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-5">
          <CardContent className="p-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <div className="h-4 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20 animate-pulse"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20 animate-pulse"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-16 animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Markets List */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Market Name and Badges */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 animate-pulse"></div>
                      <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded-full w-16 animate-pulse"></div>
                      <div className="h-5 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full w-20 animate-pulse"></div>
                    </div>

                    {/* Rating and Hours */}
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <div className="h-4 bg-yellow-200 rounded-lg w-8 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div className="h-4 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div className="h-4 bg-gray-200 rounded-lg w-80 animate-pulse"></div>
                    </div>

                    {/* Categories */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-5 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full w-20 animate-pulse"></div>
                      <div className="h-5 bg-gradient-to-r from-indigo-200 to-indigo-300 rounded-full w-16 animate-pulse"></div>
                      <div className="h-5 bg-gradient-to-r from-pink-200 to-pink-300 rounded-full w-18 animate-pulse"></div>
                    </div>

                    {/* Contact and Navigation */}
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <div className="h-4 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Navigation className="h-4 w-4 text-gray-400" />
                        <div className="h-4 bg-blue-200 rounded-lg w-24 animate-pulse"></div>
                      </div>
                    </div>
                    
                    {/* Accuracy Meter */}
                    <div className="mt-2">
                      <div className="h-4 bg-gradient-to-r from-green-200 to-blue-200 rounded-full w-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-4">
                    <div className="h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg w-24 animate-pulse flex items-center justify-center">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex gap-1">
                      <div className="h-8 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-lg w-20 animate-pulse flex items-center justify-center">
                        <Star className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20 animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24 animate-pulse flex items-center justify-center">
                      <Phone className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
