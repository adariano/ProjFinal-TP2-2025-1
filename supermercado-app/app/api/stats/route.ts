import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const parsedUserId = parseInt(userId);

    // Get active lists count and user data
    const [activeListsCount, user] = await Promise.all([
      prisma.shoppingList.count({
        where: {
          userId: parsedUserId,
          status: 'active',
        },
      }),
      prisma.user.findUnique({
        where: { id: parsedUserId }
      }),
    ]);

    // Get lists completed this month for savings calculation
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const completedListsThisMonth = await prisma.shoppingList.findMany({
      where: {
        userId: parsedUserId,
        status: 'completed',
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
    });

    // Calculate total savings
    const monthSavings = completedListsThisMonth.reduce((total: number, list: any) => {
      if (list.estimatedTotal != null && list.actualTotal != null) {
        return total + (list.estimatedTotal - list.actualTotal);
      }
      return total;
    }, 0);

    // Get counts from related tables
    const [pricesCount, reviewsCount] = await Promise.all([
      prisma.priceReport.count({
        where: {
          userId: parsedUserId,
        },
      }),
      prisma.review.count({
        where: {
          userId: parsedUserId,
        },
      }),
    ]);

    return NextResponse.json({
      activeLists: activeListsCount,
      monthSavings,
      points: user?.points || 0,
      prices: pricesCount,
      reviews: reviewsCount,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
