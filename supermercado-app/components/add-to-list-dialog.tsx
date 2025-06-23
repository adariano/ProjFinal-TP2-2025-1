"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Camera, MapPin, DollarSign } from "lucide-react"

interface AddToListDialogProps {
  product: {
    id: number
    name: string
    avgPrice: number
    bestPrice?: number
    bestMarket?: string
  }
  onAdd: (productData: any) => void
}

const mockMarkets = ["Atacadão", "Extra", "Carrefour", "Pão de Açúcar", "Walmart", "Big", "Outro"]

export function AddToListDialog({ product, onAdd }: AddToListDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPrice, setCurrentPrice] = useState("")
  const [selectedMarket, setSelectedMarket] = useState("")
  const [notes, setNotes] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [priceMethod, setPriceMethod] = useState<"text" | "image">("text")
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Simular reconhecimento de preço da imagem
      setTimeout(() => {
        const mockPrice = (Math.random() * 10 + 5).toFixed(2)
        setCurrentPrice(mockPrice)
        alert(`Preço detectado na imagem: R$ ${mockPrice}`)
      }, 2000)
    }
  }

  const handleSubmit = () => {
    if (!currentPrice && priceMethod === "text") {
      alert("Informe o preço atual do produto")
      return
    }
    if (!selectedMarket) {
      alert("Selecione o mercado")
      return
    }

    const productData = {
      ...product,
      quantity,
      currentPrice: Number.parseFloat(currentPrice) || product.avgPrice,
      market: selectedMarket,
      notes,
      priceMethod,
      imageFile,
    }

    onAdd(productData)

    // Reset form
    setCurrentPrice("")
    setSelectedMarket("")
    setNotes("")
    setQuantity(1)
    setPriceMethod("text")
    setImageFile(null)
    setIsOpen(false)

    // Award points for price reporting
    alert(`Produto adicionado à lista! +10 pontos por informar o preço atual.`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar à Lista
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar à Lista de Compras</DialogTitle>
          <DialogDescription>
            Informe o preço atual que você está vendo no mercado para ajudar a comunidade
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">Preço médio: R$ {product.avgPrice}</Badge>
                    {product.bestPrice && (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>
                          Melhor: R$ {product.bestPrice} ({product.bestMarket})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      -
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button size="sm" variant="outline" onClick={() => setQuantity(quantity + 1)}>
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Input Method */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Como você quer informar o preço atual?</Label>
            <div className="grid grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer transition-colors ${priceMethod === "text" ? "border-green-500 bg-green-50" : ""}`}
                onClick={() => setPriceMethod("text")}
              >
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-medium">Digitar Preço</p>
                  <p className="text-sm text-gray-600">Digite o valor manualmente</p>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer transition-colors ${priceMethod === "image" ? "border-green-500 bg-green-50" : ""}`}
                onClick={() => setPriceMethod("image")}
              >
                <CardContent className="p-4 text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-medium">Foto da Etiqueta</p>
                  <p className="text-sm text-gray-600">Reconhecimento automático</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Price Input */}
          {priceMethod === "text" ? (
            <div className="space-y-2">
              <Label htmlFor="currentPrice">Preço Atual (R$) *</Label>
              <Input
                id="currentPrice"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="priceImage">Foto da Etiqueta de Preço</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600 mb-4">
                  Tire uma foto da etiqueta de preço para reconhecimento automático
                </p>
                <Input
                  id="priceImage"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Label htmlFor="priceImage" className="cursor-pointer">
                  <Button type="button" variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Tirar Foto
                  </Button>
                </Label>
                {imageFile && (
                  <div className="mt-4">
                    <p className="text-sm text-green-600">✓ Imagem carregada: {imageFile.name}</p>
                    {currentPrice && (
                      <p className="text-sm font-medium text-green-600 mt-2">Preço detectado: R$ {currentPrice}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Market Selection */}
          <div className="space-y-2">
            <Label htmlFor="market">Mercado Atual *</Label>
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o mercado onde você está" />
              </SelectTrigger>
              <SelectContent>
                {mockMarkets.map((market) => (
                  <SelectItem key={market} value={market}>
                    {market}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Ex: Produto em promoção, validade próxima, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Price Comparison */}
          {currentPrice && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 mb-2">Comparação de Preços</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Preço médio:</span>
                    <span>R$ {product.avgPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Preço atual:</span>
                    <span className="font-medium">R$ {currentPrice}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Diferença:</span>
                    <span>
                      {Number.parseFloat(currentPrice) < product.avgPrice ? "↓" : "↑"} R${" "}
                      {Math.abs(Number.parseFloat(currentPrice) - product.avgPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 flex-1">
              Adicionar à Lista (+10 pontos)
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
