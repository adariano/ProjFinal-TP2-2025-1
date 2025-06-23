"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp, ThumbsDown, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"

interface ProductReviewsProps {
  productId: number
  productName: string
  compact?: boolean
}

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    user: "Maria Silva",
    rating: 5,
    comment: "Excelente qualidade! Grãos soltos e saborosos. Recomendo muito!",
    date: "2025-01-18",
    helpful: 12,
    notHelpful: 1,
    verified: true,
  },
  {
    id: 2,
    user: "João Santos",
    rating: 4,
    comment: "Bom custo-benefício. Produto de qualidade, mas já encontrei mais barato em outros lugares.",
    date: "2025-01-15",
    helpful: 8,
    notHelpful: 2,
    verified: true,
  },
  {
    id: 3,
    user: "Ana Costa",
    rating: 5,
    comment: "Sempre compro esta marca. Nunca me decepcionou. Grãos de ótima qualidade.",
    date: "2025-01-12",
    helpful: 15,
    notHelpful: 0,
    verified: false,
  },
]

export function ProductReviews({ productId, productName, compact = false }: ProductReviewsProps) {
  const [reviews] = useState(mockReviews)
  const [isExpanded, setIsExpanded] = useState(!compact)
  const [sortBy, setSortBy] = useState("recent")

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const displayReviews = compact ? reviews.slice(0, 2) : reviews

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Avaliações dos Usuários</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({reviews.length})</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Menos
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Ver mais
              </>
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
            {displayReviews.map((review) => (
              <div key={review.id} className="bg-white p-3 rounded border">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {review.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{review.user}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
            {!isExpanded && reviews.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="w-full text-blue-600 hover:text-blue-700"
              >
                Ver todas as {reviews.length} avaliações
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  // Versão completa (código existente mantido)
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage: (reviews.filter((review) => review.rating === rating).length / reviews.length) * 100,
  }))

  const filteredReviews = reviews.sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "helpful":
        return b.helpful - a.helpful
      case "rating-high":
        return b.rating - a.rating
      case "rating-low":
        return a.rating - b.rating
      default:
        return 0
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Avaliações dos Usuários
        </CardTitle>
        <CardDescription>O que outros usuários estão dizendo sobre {productName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${i < Math.round(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600">{reviews.length} avaliações</p>
          </div>

          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.rating} className="flex items-center gap-2">
                <span className="text-sm w-8">{item.rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {review.user.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.user}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          Compra Verificada
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-3">{review.comment}</p>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Útil ({review.helpful})
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Não útil ({review.notHelpful})
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
