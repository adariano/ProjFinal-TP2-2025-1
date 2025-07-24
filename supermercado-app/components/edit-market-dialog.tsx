import { useState, useEffect } from "react"
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
import { MapPin, Phone, Clock, Star, Link as LinkIcon, Edit } from "lucide-react"

interface EditMarketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  market: any
  onMarketUpdated: (updatedMarket: any) => void
}

export function EditMarketDialog({ open, onOpenChange, market, onMarketUpdated }: EditMarketDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    hours: "",
    googleMapsUrl: "",
    priceLevel: "",
    categories: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (market) {
      setFormData({
        name: market.name || "",
        address: market.address || "",
        phone: market.phone || "",
        hours: market.hours || "",
        googleMapsUrl: market.googleMapsUrl || "",
        priceLevel: market.priceLevel || "$$",
        categories: Array.isArray(market.categories) ? market.categories.join(", ") : market.categories || "",
        description: market.description || "",
      })
    }
  }, [market])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.address) {
      alert("Por favor, preencha pelo menos o nome e endereço do mercado")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedMarket = {
        ...market,
        ...formData,
        categories: formData.categories.split(",").map(c => c.trim()).filter(c => c),
        updatedAt: new Date().toISOString(),
      }
      
      onMarketUpdated(updatedMarket)
      onOpenChange(false)
      
      alert("Mercado atualizado com sucesso!")
    } catch (error) {
      console.error("Error updating market:", error)
      alert("Erro ao atualizar mercado. Tente novamente.")
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

  if (!market) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            Editar {market.name}
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do mercado
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Mercado *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceLevel">Nível de Preço</Label>
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
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Horário de Funcionamento</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="hours"
                  value={formData.hours}
                  onChange={(e) => handleInputChange("hours", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleMapsUrl">Link do Google Maps</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={(e) => handleInputChange("googleMapsUrl", e.target.value)}
                className="pl-10"
              />
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

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Atualizando..." : "Atualizar Mercado"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
