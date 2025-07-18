import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const recentPriceReports = await prisma.priceReport.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        product: {
          select: {
            name: true,
            brand: true,
          },
        },
        market: {
          select: {
            name: true,
          },
        },
      },
    });

    // Transform the data to match the expected frontend format
    const transformedReports = recentPriceReports.map(report => ({
      name: report.product.brand ? `${report.product.name} ${report.product.brand}` : report.product.name,
      price: report.price,
      market: report.market.name,
      date: formatDate(report.createdAt),
      createdAt: report.createdAt.toISOString(),
    }));

    return NextResponse.json(transformedReports);
  } catch (error) {
    console.error('Error fetching recent price reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'Hoje';
  } else if (diffDays === 2) {
    return 'Ontem';
  } else if (diffDays <= 7) {
    return `${diffDays - 1} dias`;
  } else {
    return date.toLocaleDateString('pt-BR');
  }
}
