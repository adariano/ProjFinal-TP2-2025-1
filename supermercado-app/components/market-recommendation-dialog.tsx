"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Star, Phone, Navigation, TrendingUp, ShoppingCart, CheckCircle, Copy, Share2 } from "lucide-react"
import { useLocation } from "@/hooks/use-location"

interface MarketRecommendationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listName: string
  recommendedMarkets: any[]
  totalEstimated: number
  onNavigate?: (market: any) => void
}

export function MarketRecommendationDialog({
  open,
  onOpenChange,
  listName,
  recommendedMarkets,
  totalEstimated,
  onNavigate,
}: MarketRecommendationDialogProps) {
  const [selectedMarket, setSelectedMarket] = useState<any>(null)
  const { userLocation } = useLocation()

  if (!recommendedMarkets || recommendedMarkets.length === 0) {
    return null
  }

  const bestMarket = recommendedMarkets[0]
  const savings = totalEstimated - bestMarket.estimatedTotal

  const openRouteInOSM = (market: any) => {
    if (userLocation && market.latitude && market.longitude) {
      // Open the route in OpenStreetMap (the source of our distance calculation)
      const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation.lat}%2C${userLocation.lng}%3B${market.latitude}%2C${market.longitude}`
      window.open(url, "_blank")
    } else {
      // Fallback: just show the market location
      const url = `https://www.openstreetmap.org/?mlat=${market.latitude}&mlon=${market.longitude}&zoom=16`
      window.open(url, "_blank")
    }
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    alert("Endereço copiado!")
  }

  const handleShare = (market: any) => {
    const shareText = `🛒 Recomendação de mercado para "${listName}":
📍 ${market.name} - ${market.address}
💰 Total estimado: R$ ${market.estimatedTotal.toFixed(2)}
⭐ Avaliação: ${market.rating}/5
📞 ${market.phone}`

    if (navigator.share) {
      navigator.share({
        title: "Recomendação de Mercado",
        text: shareText,
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert("Informações copiadas!")
    }
  }

  const getPriceLevelColor = (level: string) => {
    switch (level) {
      case "Econômico":
        return "bg-green-100 text-green-800"
      case "Moderado":
        return "bg-yellow-100 text-yellow-800"
      case "Premium":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-6 w-6 text-green-600" />
            Recomendações para "{listName}"
          </DialogTitle>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Lista "{listName}" foi salva com sucesso!</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Confira abaixo as melhores opções de mercados para suas compras.
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Best Market Highlight */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-green-600 text-white">🏆 Melhor Opção</Badge>
                <Badge variant="outline" className={getPriceLevelColor(bestMarket.priceLevel)}>
                  {bestMarket.priceLevel}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">{bestMarket.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{bestMarket.address}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyAddress(bestMarket.address)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Navigation className="h-4 w-4 text-blue-600" />
                        <button
                          onClick={() => openRouteInOSM(bestMarket)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                          title="Ver rota no OpenStreetMap"
                        >
                          {bestMarket.distance.toFixed(1)} km
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{bestMarket.rating}/5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{bestMarket.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Total Estimado</p>
                      <p className="text-3xl font-bold text-green-600">R$ {bestMarket.estimatedTotal.toFixed(2)}</p>
                    </div>
                    {savings > 0 && (
                      <div className="bg-green-100 rounded-lg p-3">
                        <p className="text-sm text-green-700">Economia Estimada</p>
                        <p className="text-xl font-bold text-green-800">R$ {savings.toFixed(2)}</p>
                        <p className="text-xs text-green-600">
                          {((savings / totalEstimated) * 100).toFixed(1)}% de desconto
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={() => onNavigate?.(bestMarket)} className="bg-green-600 hover:bg-green-700" size="sm">
                  <Navigation className="h-4 w-4 mr-2" />
                  Como Chegar
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleShare(bestMarket)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Other Options */}
          {recommendedMarkets.length > 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Outras Opções Próximas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedMarkets.slice(1, 5).map((market, index) => (
                  <Card
                    key={market.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedMarket(selectedMarket === market.id ? null : market.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{market.name}</h4>
                          <Badge variant="outline" className={`${getPriceLevelColor(market.priceLevel)} text-xs`}>
                            {market.priceLevel}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">R$ {market.estimatedTotal.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">
                            +R$ {(market.estimatedTotal - bestMarket.estimatedTotal).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{market.address}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Navigation className="h-3 w-3" />
                              <button
                                onClick={() => openRouteInOSM(market)}
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                title="Ver rota no OpenStreetMap"
                              >
                                {market.distance.toFixed(1)} km
                              </button>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{market.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedMarket === market.id && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onNavigate?.(market)
                              }}
                              className="flex-1"
                            >
                              <Navigation className="h-3 w-3 mr-1" />
                              Navegar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleShare(market)
                              }}
                              className="flex-1"
                            >
                              <Share2 className="h-3 w-3 mr-1" />
                              Compartilhar
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Resumo da Análise
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Mercados Analisados</p>
                <p className="font-bold">{recommendedMarkets.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Melhor Preço</p>
                <p className="font-bold text-green-600">R$ {bestMarket.estimatedTotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Economia Máxima</p>
                <p className="font-bold text-green-600">R$ {savings.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Distância Mínima</p>
                <button
                  onClick={() => openRouteInOSM(bestMarket)}
                  className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  title="Ver rota no OpenStreetMap"
                >
                  {bestMarket.distance.toFixed(1)} km
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button onClick={() => onNavigate?.(bestMarket)} className="bg-green-600 hover:bg-green-700">
              <Navigation className="h-4 w-4 mr-2" />
              Ir para {bestMarket.name}
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">✅ Lista salva com sucesso!</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button onClick={() => onNavigate?.(bestMarket)} className="bg-green-600 hover:bg-green-700">
              <Navigation className="h-4 w-4 mr-2" />
              Ir para {bestMarket.name}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
