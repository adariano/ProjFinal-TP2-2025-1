import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Search, Filter, Package, Star, MapPin, DollarSign } from "lucide-react"

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
              <Search className="h-6 w-6 text-blue-600" />
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

        {/* Search Form */}
        <Card className="mb-6">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Input */}
            <div className="flex gap-3">
              <div className="flex-1 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg w-20 animate-pulse flex items-center justify-center">
                <Search className="h-4 w-4 text-blue-600" />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <div className="h-4 bg-gray-200 rounded-lg w-16 animate-pulse"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20 animate-pulse"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24 animate-pulse"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-18 animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded-lg w-32 mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-24 mb-2 animate-pulse"></div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <div className="h-4 bg-yellow-200 rounded-lg w-8 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded-lg w-16 animate-pulse"></div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-1 mb-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-16 animate-pulse"></div>
                    </div>

                    {/* Market */}
                    <div className="flex items-center gap-1 mb-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div className="h-3 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <div className="flex-1 h-8 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg animate-pulse"></div>
                      <div className="h-8 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-8 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-4 animate-pulse flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-600" />
            </div>
            <div className="h-6 bg-gray-200 rounded-lg w-48 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
