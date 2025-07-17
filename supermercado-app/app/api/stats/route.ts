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

    // Get active lists count
    const activeLists = await prisma.shoppingList.count({
      where: {
        userId: parseInt(userId),
        status: 'active',
      },
    });

    // Calculate total savings this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const completedListsThisMonth = await prisma.shoppingList.findMany({
      where: {
        userId: parseInt(userId),
        status: 'completed',
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
    });

    const monthSavings = completedListsThisMonth.reduce((total, list) => {
      if (list.estimatedTotal && list.actualTotal) {
        return total + (list.estimatedTotal - list.actualTotal);
      }
      return total;
    }, 0);

    // Get user points
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    return NextResponse.json({
      activeLists,
      monthSavings,
      points: user?.points || 0,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
