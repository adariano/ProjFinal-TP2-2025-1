"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Camera,
  Upload,
  Users,
  Shield,
  Clock,
  DollarSign,
} from "lucide-react"

interface CollectItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: {
    id: number
    name: string
    quantity: number
    estimatedPrice?: number
    avgPrice?: number
    market?: string
    collected?: boolean
  } | null
  onItemCollected: (id: number, actualPrice: number, method: "manual" | "image") => void
}

// Mock historical data com mais detalhes
const mockHistoricalData = {
  userHistory: [
    { date: "2024-12-15", price: 18.5, market: "Extra", location: "Shopping Center Norte" },
    { date: "2024-11-20", price: 17.9, market: "Carrefour", location: "Av. Paulista" },
    { date: "2024-10-25", price: 19.2, market: "Pão de Açúcar", location: "Rua Augusta" },
    { date: "2024-09-18", price: 16.8, market: "Atacadão", location: "Marginal Tietê" },
  ],
  marketPrices: [
    {
      market: "Atacadão",
      price: 16.5,
      date: "2025-01-20",
      reliability: 95,
      reporter: "João S.",
      reporterScore: 4.8,
      confirmations: 12,
      location: "Marginal Tietê",
    },
    {
      market: "Extra",
      price: 17.8,
      date: "2025-01-20",
      reliability: 88,
      reporter: "Maria L.",
      reporterScore: 4.5,
      confirmations: 8,
      location: "Shopping Center Norte",
    },
    {
      market: "Carrefour",
      price: 18.2,
      date: "2025-01-19",
      reliability: 92,
      reporter: "Pedro C.",
      reporterScore: 4.7,
      confirmations: 15,
      location: "Av. Paulista",
    },
    {
      market: "Pão de Açúcar",
      price: 19.5,
      date: "2025-01-19",
      reliability: 85,
      reporter: "Ana R.",
      reporterScore: 4.2,
      confirmations: 6,
      location: "Rua Augusta",
    },
    {
      market: "Walmart",
      price: 17.2,
      date: "2025-01-18",
      reliability: 78,
      reporter: "Carlos M.",
      reporterScore: 3.9,
      confirmations: 4,
      location: "Av. das Nações Unidas",
    },
  ],
}

export function CollectItemDialog({ open, onOpenChange, item, onItemCollected }: CollectItemDialogProps) {
  const [actualPrice, setActualPrice] = useState("")
  const [inputMethod, setInputMethod] = useState("manual")
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  if (!item) {
    return <Dialog open={open} onOpenChange={onOpenChange} />
  }

  // valor de referência para comparações
  const estimatedPriceRef = item.estimatedPrice ?? item.avgPrice ?? 0

  const handleCollect = () => {
    if (!actualPrice) {
      alert("Informe o preço pago pelo produto")
      return
    }
    onItemCollected(item.id, Number.parseFloat(actualPrice), inputMethod as "manual" | "image")

    setShowSuccess(true)

    // Reset after success
    setTimeout(() => {
      setActualPrice("")
      setImageFile(null)
      setShowSuccess(false)
      onOpenChange(false)
    }, 2000)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      setIsProcessing(true)

      // Simular reconhecimento de imagem
      setTimeout(() => {
        const simulatedPrice = (Math.random() * 5 + 15).toFixed(2)
        setActualPrice(simulatedPrice)
        setIsProcessing(false)
      }, 2000)
    }
  }

  const averageUserPrice =
    mockHistoricalData.userHistory.length > 0
      ? mockHistoricalData.userHistory.reduce((sum, entry) => sum + entry.price, 0) /
        mockHistoricalData.userHistory.length
      : 0

  const priceDifference = actualPrice ? Number.parseFloat(actualPrice) - estimatedPriceRef : 0
  const userPriceDifference = actualPrice && averageUserPrice ? Number.parseFloat(actualPrice) - averageUserPrice : 0

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 90) return "text-green-600 bg-green-100"
    if (reliability >= 75) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  const getReliabilityText = (reliability: number) => {
    if (reliability >= 90) return "Muito Confiável"
    if (reliability >= 75) return "Confiável"
    return "Pouco Confiável"
  }

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Coletado!</h2>
            <p className="text-gray-600">
              {item.name} foi marcado como coletado por R$ {actualPrice}
            </p>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">+5 pontos adicionados ao seu perfil!</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (item.collected) {
    return (
      <Button variant="outline" className="bg-green-50 border-green-200 text-green-700" disabled>
        <CheckCircle className="h-4 w-4 mr-2" />
        Já Coletado
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Marcar Item como Coletado
          </DialogTitle>
          <DialogDescription>
            Informe o preço que você pagou por {item.name} e veja comparações detalhadas
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Item Info & Price Input */}
          <div className="space-y-6">
            {/* Item Info */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Quantidade:</span>
                      <p className="font-medium">{item.quantity}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Preço estimado:</span>
                      <p className="font-medium">R$ {estimatedPriceRef.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Input Methods */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-4">Como você quer informar o preço?</h4>
                <Tabs value={inputMethod} onValueChange={setInputMethod}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual">Manual</TabsTrigger>
                    <TabsTrigger value="image">Foto do Preço</TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="actualPrice">Preço Pago (R$) *</Label>
                      <Input
                        id="actualPrice"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={actualPrice}
                        onChange={(e) => setActualPrice(e.target.value)}
                        className="text-lg"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4">
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {imageFile ? (
                          <div className="space-y-2">
                            <Camera className="h-8 w-8 mx-auto text-green-600" />
                            <p className="text-sm font-medium text-green-600">Imagem carregada!</p>
                            <p className="text-xs text-gray-600">{imageFile.name}</p>
                            {isProcessing && (
                              <div className="flex items-center justify-center gap-2 mt-4">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-sm text-blue-600">Reconhecendo preço...</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 mx-auto text-gray-400" />
                            <p className="text-sm text-gray-600">Tire uma foto do preço na etiqueta</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Label htmlFor="image-upload" className="cursor-pointer">
                          <Button variant="outline" className="mt-2" asChild>
                            <span>
                              <Camera className="h-4 w-4 mr-2" />
                              {imageFile ? "Trocar Foto" : "Tirar Foto"}
                            </span>
                          </Button>
                        </Label>
                      </div>

                      {actualPrice && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              Preço reconhecido: R$ {actualPrice}
                            </span>
                          </div>
                          <p className="text-xs text-green-600 mt-1">Você pode editar o valor se necessário</p>
                          <Input
                            type="number"
                            step="0.01"
                            value={actualPrice}
                            onChange={(e) => setActualPrice(e.target.value)}
                            className="mt-2 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Price Comparison */}
            {actualPrice && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Comparação Rápida
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Preço estimado:</span>
                      <span>R$ {estimatedPriceRef.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Preço pago:</span>
                      <span className="font-medium">R$ {actualPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Diferença:</span>
                      <div className="flex items-center gap-1">
                        {priceDifference > 0 ? (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        )}
                        <span className={priceDifference > 0 ? "text-red-600" : "text-green-600"}>
                          {priceDifference > 0 ? "+" : ""}R$ {priceDifference.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {averageUserPrice > 0 && (
                      <>
                        <div className="flex justify-between items-center">
                          <span>Sua média histórica:</span>
                          <span>R$ {averageUserPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Vs. sua média:</span>
                          <div className="flex items-center gap-1">
                            {userPriceDifference > 0 ? (
                              <TrendingUp className="h-4 w-4 text-red-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-green-500" />
                            )}
                            <span className={userPriceDifference > 0 ? "text-red-600" : "text-green-600"}>
                              {userPriceDifference > 0 ? "+" : ""}R$ {userPriceDifference.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={handleCollect}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!actualPrice || isProcessing}
            >
              {isProcessing ? "Processando..." : "Confirmar Coleta"}
            </Button>
          </div>

          {/* Middle Column - User History */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Seu Histórico de Compras
                </h4>
                {mockHistoricalData.userHistory.length > 0 ? (
                  <div className="space-y-3">
                    {mockHistoricalData.userHistory.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            <span className="text-sm font-medium">{entry.market}</span>
                          </div>
                          <p className="text-xs text-gray-600">{entry.location}</p>
                          <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString("pt-BR")}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-green-600">R$ {entry.price.toFixed(2)}</span>
                          {actualPrice && (
                            <div className="text-xs">
                              {entry.price < Number.parseFloat(actualPrice) ? (
                                <span className="text-red-500">
                                  +R$ {(Number.parseFloat(actualPrice) - entry.price).toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-green-500">
                                  -R$ {(entry.price - Number.parseFloat(actualPrice)).toFixed(2)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Média histórica:</span>
                        <span className="font-bold">R$ {averageUserPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma compra anterior registrada</p>
                    <p className="text-xs">Esta será sua primeira compra deste item!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Community Prices */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Preços da Comunidade
                </h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {mockHistoricalData.marketPrices.map((entry, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            <span className="text-sm font-medium">{entry.market}</span>
                          </div>
                          <p className="text-xs text-gray-600">{entry.location}</p>
                        </div>
                        <span className="font-bold text-green-600">R$ {entry.price.toFixed(2)}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {new Date(entry.date).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                          <Badge className={`text-xs ${getReliabilityColor(entry.reliability)}`}>
                            {getReliabilityText(entry.reliability)}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-blue-500" />
                            <span className="text-gray-600">por {entry.reporter}</span>
                            <span className="text-yellow-600">★{entry.reporterScore}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-green-500" />
                            <span className="text-gray-600">{entry.confirmations} confirmações</span>
                          </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-green-500 h-1 rounded-full"
                            style={{ width: `${entry.reliability}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Como calculamos a confiabilidade?</span>
                  </div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Reputação do usuário (0-5 estrelas)</li>
                    <li>• Número de confirmações de outros usuários</li>
                    <li>• Atualidade da informação</li>
                    <li>• Histórico de precisão do usuário</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
