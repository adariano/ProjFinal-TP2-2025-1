import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Buscar estatísticas detalhadas do usuário
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        shoppingLists: true,
        priceReports: true,
        reviews: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const pricesReported = user.priceReports.length;
    const productsReviewed = user.reviews.length;
    const listsCreated = user.shoppingLists.length;
    const completedLists = user.shoppingLists.filter((list: any) => list.status === 'completed');
    
    // Calculate total savings
    const totalSavings = completedLists.reduce((total: number, list: any) => {
      if (list.estimatedTotal && list.actualTotal) {
        return total + (list.estimatedTotal - list.actualTotal);
      }
      return total;
    }, 0);

    // Calculate level based on points
    const points = user.points || 0;
    let level = "Iniciante";
    let nextLevel = "Colaborador";
    let pointsToNextLevel = 50;

    if (points >= 500) {
      level = "Expert";
      nextLevel = "Master";
      pointsToNextLevel = 1000 - points;
    } else if (points >= 200) {
      level = "Colaborador Ativo";
      nextLevel = "Expert";
      pointsToNextLevel = 500 - points;
    } else if (points >= 50) {
      level = "Colaborador";
      nextLevel = "Colaborador Ativo";
      pointsToNextLevel = 200 - points;
    }

    // Get recent activity (last 10 price reports and reviews)
    const recentPriceReports = await prisma.priceReport.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        product: true,
        market: true,
      },
    });

    const recentReviews = await prisma.review.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        market: true,
      },
    });

    // Format recent activity
    const recentActivity = [
      ...recentPriceReports.map((report: any) => ({
        action: `Informou preço do ${report.product.name}`,
        points: 10,
        date: report.createdAt.toISOString(),
      })),
      ...recentReviews.map((review: any) => ({
        action: `Avaliou ${review.market.name}`,
        points: 5,
        date: review.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);

    // Calculate achievements
    const achievements = [
      {
        id: 1,
        title: "Primeiro Preço",
        description: "Informou seu primeiro preço",
        icon: "🎯",
        earned: pricesReported >= 1,
        date: pricesReported >= 1 ? user.priceReports[0]?.createdAt.toISOString() : null,
      },
      {
        id: 2,
        title: "Colaborador",
        description: "Informou 10 preços",
        icon: "🤝",
        earned: pricesReported >= 10,
        date: pricesReported >= 10 ? user.priceReports[9]?.createdAt.toISOString() : null,
      },
      {
        id: 3,
        title: "Avaliador",
        description: "Fez 5 avaliações de produtos",
        icon: "⭐",
        earned: productsReviewed >= 5,
        date: productsReviewed >= 5 ? user.reviews[4]?.createdAt.toISOString() : null,
      },
      {
        id: 4,
        title: "Expert",
        description: "Informou 50 preços",
        icon: "🏆",
        earned: pricesReported >= 50,
        date: pricesReported >= 50 ? user.priceReports[49]?.createdAt.toISOString() : null,
      },
      {
        id: 5,
        title: "Economizador",
        description: "Economizou R$100",
        icon: "💰",
        earned: totalSavings >= 100,
        date: totalSavings >= 100 ? completedLists[0]?.createdAt.toISOString() : null,
      },
    ];

    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      joinDate: user.createdAt.toISOString(),
      level,
      nextLevel,
      totalPoints: points,
      pointsToNextLevel,
      stats: {
        pricesReported,
        productsReviewed,
        productsSuggested: 0, // This would need a separate table/feature
        listsCreated,
        totalSavings,
      },
      achievements,
      recentActivity,
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar perfil do usuário' },
      { status: 500 }
    );
  }
}
