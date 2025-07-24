"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Package, Plus, CheckCircle, Camera } from "lucide-react"
import Link from "next/link"

const categories = ["Grãos", "Laticínios", "Carnes", "Frutas", "Verduras", "Padaria", "Limpeza", "Bebidas", "Higiene"]

export default function SugerirProdutoPage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    barcode: "",
    estimatedPrice: "",
    reason: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.brand || !formData.category) {
      alert("Preencha os campos obrigatórios (Nome, Marca e Categoria)")
      return
    }

    setIsSubmitting(true)

    // Envia para a API
    const payload = {
      ...formData,
      estimatedPrice: formData.estimatedPrice ? Number(formData.estimatedPrice) : undefined,
      submittedBy: user?.name || "",
      submittedEmail: user?.email || "",
    }
    try {
      const res = await fetch("/api/productSuggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const error = await res.json()
        alert(error.error || "Erro ao enviar sugestão")
        setIsSubmitting(false)
        return
      }
      setIsSubmitting(false)
      setSubmitted(true)
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          brand: "",
          category: "",
          description: "",
          barcode: "",
          estimatedPrice: "",
          reason: "",
        })
        setImageFile(null)
        setSubmitted(false)
      }, 3000)
    } catch (err) {
      alert("Erro ao enviar sugestão")
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return <div>Carregando...</div>
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sugestão Enviada!</h2>
            <p className="text-gray-600 mb-4">
              Sua sugestão de produto foi enviada para análise do administrador. Você ganhou +15 pontos!
            </p>
            <Link href="/dashboard">
              <Button className="bg-green-600 hover:bg-green-700">Voltar ao Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Plus className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold">Sugerir Novo Produto</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Informações do Produto
              </CardTitle>
              <CardDescription>
                Ajude a comunidade sugerindo novos produtos. Sua sugestão será analisada pelo administrador e você
                ganhará +15 pontos se aprovada!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Arroz Branco 5kg"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca *</Label>
                  <Input
                    id="brand"
                    placeholder="Ex: Tio João"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedPrice">Preço Estimado (R$)</Label>
                  <Input
                    id="estimatedPrice"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.estimatedPrice}
                    onChange={(e) => handleInputChange("estimatedPrice", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Código de Barras</Label>
                <Input
                  id="barcode"
                  placeholder="Ex: 7891234567890"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange("barcode", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição do Produto</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o produto, suas características, tamanho, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Por que este produto deveria ser adicionado?</Label>
                <Textarea
                  id="reason"
                  placeholder="Explique por que este produto seria útil para a comunidade..."
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="productImage">Foto do Produto (opcional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-4">
                    Adicione uma foto do produto para ajudar na identificação
                  </p>
                  <Input
                    id="productImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Label htmlFor="productImage" className="cursor-pointer">
                    <Button type="button" variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Selecionar Foto
                    </Button>
                  </Label>
                  {imageFile && (
                    <div className="mt-4">
                      <p className="text-sm text-green-600">✓ Imagem selecionada: {imageFile.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Alert */}
              <Alert>
                <Package className="h-4 w-4" />
                <AlertDescription>
                  <strong>Dica:</strong> Quanto mais detalhes você fornecer, maior a chance de sua sugestão ser
                  aprovada. Produtos bem descritos ajudam outros usuários a encontrá-los facilmente.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700">
                {isSubmitting ? "Enviando..." : "Enviar Sugestão (+15 pontos)"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
