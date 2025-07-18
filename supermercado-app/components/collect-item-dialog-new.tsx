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
  shoppingListId: number
}

// Mock historical data
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
    // ... other market prices
  ],
}

export function CollectItemDialog({ open, onOpenChange, item, onItemCollected, shoppingListId }: CollectItemDialogProps) {
  const [actualPrice, setActualPrice] = useState("")
  const [inputMethod, setInputMethod] = useState<"manual" | "image">("manual")
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  if (!item) {
    return <Dialog open={open} onOpenChange={onOpenChange} />
  }

  const estimatedPriceRef = item.estimatedPrice ?? item.avgPrice ?? 0

  const handleCollect = async () => {
    if (!actualPrice) {
      alert("Informe o preço pago pelo produto")
      return
    }

    try {
      const response = await fetch('/api/shopping_list_item', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: item.id,
          action: 'collect'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update item')
      }

      onItemCollected(item.id, Number.parseFloat(actualPrice), inputMethod)
      setShowSuccess(true)

      setTimeout(() => {
        setActualPrice("")
        setInputMethod("manual")
        setImageFile(null)
        setShowSuccess(false)
        onOpenChange(false)
      }, 2000)
    } catch (error) {
      console.error("Error updating item:", error)
      alert("Erro ao atualizar item. Tente novamente.")
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      setIsProcessing(true)
      setInputMethod("image")

      // Simulate image recognition
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Coletar Item</DialogTitle>
          <DialogDescription>
            Informe o preço que você pagou por {item.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Preço estimado</p>
                    <p className="font-medium">R$ {estimatedPriceRef.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actualPrice">Preço Pago (R$)</Label>
                  <Input
                    id="actualPrice"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={actualPrice}
                    onChange={(e) => setActualPrice(e.target.value)}
                  />
                </div>

                {actualPrice && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Diferença:</span>
                      <div className="flex items-center gap-1">
                        {priceDifference > 0 ? (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        )}
                        <span className={priceDifference > 0 ? "text-red-600" : "text-green-600"}>
                          {priceDifference > 0 ? "+" : ""}R$ {Math.abs(priceDifference).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleCollect} disabled={!actualPrice || isProcessing}>
              {isProcessing ? "Processando..." : "Confirmar Coleta"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
