import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Plus, ShoppingCart, Package, DollarSign } from "lucide-react"

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
              <Plus className="h-6 w-6 text-green-600" />
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

        {/* List Creation Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* List Name Input */}
                <div>
                  <div className="h-4 bg-gray-200 rounded-lg w-24 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg w-full animate-pulse"></div>
                </div>

                {/* Market Selection */}
                <div>
                  <div className="h-4 bg-gray-200 rounded-lg w-32 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg w-full animate-pulse"></div>
                </div>

                {/* Product Search */}
                <div>
                  <div className="h-4 bg-gray-200 rounded-lg w-36 mb-2 animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg w-20 animate-pulse"></div>
                  </div>
                </div>

                {/* Products List */}
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded-lg w-32 mb-1 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-16 animate-pulse"></div>
                        <div className="h-8 bg-gradient-to-r from-red-200 to-red-300 rounded-lg w-8 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-gray-400" />
                  <div className="h-6 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <div className="h-4 bg-gray-200 rounded-lg w-16 animate-pulse"></div>
                  </div>
                  <div className="h-6 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full w-8 animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div className="h-4 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                  </div>
                  <div className="h-6 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-16 animate-pulse"></div>
                </div>
                <div className="pt-4 border-t">
                  <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Products */}
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded-lg w-20 mb-1 animate-pulse"></div>
                        <div className="h-2 bg-gray-200 rounded-lg w-16 animate-pulse"></div>
                      </div>
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
