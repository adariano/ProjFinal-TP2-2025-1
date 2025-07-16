import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Star, MessageSquare } from "lucide-react"

interface RateMarketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  market: any
  onRatingSubmitted: (marketId: number, rating: number, comment: string) => void
}

export function RateMarketDialog({ open, onOpenChange, market, onRatingSubmitted }: RateMarketDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      alert("Por favor, selecione uma avaliação de 1 a 5 estrelas")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onRatingSubmitted(market.id, rating, comment)
      onOpenChange(false)
      
      // Reset form
      setRating(0)
      setHoveredRating(0)
      setComment("")
      
      alert("Avaliação enviada com sucesso!")
    } catch (error) {
      console.error("Error submitting rating:", error)
      alert("Erro ao enviar avaliação. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  const getRatingText = (ratingValue: number) => {
    switch (ratingValue) {
      case 1: return "Muito Ruim"
      case 2: return "Ruim"
      case 3: return "Regular"
      case 4: return "Bom"
      case 5: return "Excelente"
      default: return ""
    }
  }

  if (!market) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Avaliar {market.name}
          </DialogTitle>
          <DialogDescription>
            Compartilhe sua experiência com outros usuários
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Como você avalia este mercado?</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {(hoveredRating || rating) > 0 && (
              <p className="text-sm text-gray-600 font-medium">
                {getRatingText(hoveredRating || rating)}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="comment">Comentário (opcional)</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="comment"
                placeholder="Conte sobre sua experiência neste mercado..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="pl-10 min-h-[100px]"
                maxLength={500}
              />
            </div>
            <p className="text-xs text-gray-500 text-right">
              {comment.length}/500 caracteres
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{market.name}</h4>
                <p className="text-sm text-gray-600">{market.address}</p>
              </div>
            </div>
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
              disabled={isSubmitting || rating === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
