import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MapPin, Phone, Clock, Star, Link as LinkIcon } from "lucide-react"

interface AddMarketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMarketAdded: (market: any) => void
}

export function AddMarketDialog({ open, onOpenChange, onMarketAdded }: AddMarketDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    hours: "",
    googleMapsUrl: "",
    priceLevel: "",
    categories: "",
    rating: "4.0",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.address || !formData.phone || !formData.googleMapsUrl) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setIsSubmitting(true)

    try {
      // Call the API to save the market
      const response = await fetch('/api/market', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          hours: formData.hours || "07:00 - 22:00",
          googleMapsUrl: formData.googleMapsUrl,
          priceLevel: formData.priceLevel || "$$",
          categories: formData.categories,
          description: formData.description,
          rating: parseFloat(formData.rating),
          distance: 0,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar mercado')
      }

      const savedMarket = await response.json()

      // Transform the saved market to match the expected format
      const marketForUI = {
        ...savedMarket,
        categories: savedMarket.categories ? savedMarket.categories.split(",").map((c: string) => c.trim()).filter((c: string) => c) : [],
        reviews: 0,
        estimatedTime: "N/A",
        coordinates: { lat: 0, lng: 0 },
      }

      onMarketAdded(marketForUI)
      onOpenChange(false)
      
      // Reset form
      setFormData({
        name: "",
        address: "",
        phone: "",
        hours: "",
        googleMapsUrl: "",
        priceLevel: "",
        categories: "",
        rating: "4.0",
        description: "",
      })

      alert("Mercado adicionado com sucesso!")
    } catch (error) {
      console.error("Error adding market:", error)
      alert("Erro ao adicionar mercado. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Adicionar Novo Mercado
          </DialogTitle>
          <DialogDescription>
            Cadastre um novo mercado no sistema. Todos os campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Mercado *</Label>
              <Input
                id="name"
                placeholder="Ex: Supermercado São João"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceLevel">Nível de Preço *</Label>
              <Select value={formData.priceLevel} onValueChange={(value) => handleInputChange("priceLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível de preço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$">$ - Econômico</SelectItem>
                  <SelectItem value="$$">$$ - Moderado</SelectItem>
                  <SelectItem value="$$$">$$$ - Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo *</Label>
            <Input
              id="address"
              placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo - SP"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  placeholder="(11) 1234-5678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Horário de Funcionamento</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="hours"
                  placeholder="07:00 - 22:00"
                  value={formData.hours}
                  onChange={(e) => handleInputChange("hours", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleMapsUrl">Link do Google Maps *</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="googleMapsUrl"
                placeholder="https://maps.google.com/..."
                value={formData.googleMapsUrl}
                onChange={(e) => handleInputChange("googleMapsUrl", e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Cole o link completo do Google Maps para este mercado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Avaliação Inicial</Label>
              <div className="relative">
                <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Select value={formData.rating} onValueChange={(value) => handleInputChange("rating", value)}>
                  <SelectTrigger className="pl-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.0">1.0 ⭐</SelectItem>
                    <SelectItem value="2.0">2.0 ⭐⭐</SelectItem>
                    <SelectItem value="3.0">3.0 ⭐⭐⭐</SelectItem>
                    <SelectItem value="4.0">4.0 ⭐⭐⭐⭐</SelectItem>
                    <SelectItem value="5.0">5.0 ⭐⭐⭐⭐⭐</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categories">Categorias</Label>
              <Input
                id="categories"
                placeholder="Supermercado, Farmácia, Padaria"
                value={formData.categories}
                onChange={(e) => handleInputChange("categories", e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Separe as categorias por vírgula
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              placeholder="Informações adicionais sobre o mercado..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Salvando..." : "Adicionar Mercado"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
