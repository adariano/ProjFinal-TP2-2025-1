import { NextRequest, NextResponse } from 'next/server';
import { googleMapsCrawler } from '@/lib/google-maps-crawler';

export async function POST(request: NextRequest) {
  try {
    const { userLat, userLng, marketId, marketName, marketLat, marketLng } = await request.json();

    if (!userLat || !userLng || !marketLat || !marketLng) {
      return NextResponse.json(
        { error: 'Missing required coordinates' },
        { status: 400 }
      );
    }

    console.log(`[Auto] Crawling 100% accurate route for market: ${marketName}`);

    // Crawl the route using Google Maps
    const routeData = await googleMapsCrawler.crawlRoute(
      userLat,
      userLng,
      marketLat,
      marketLng,
      marketName
    );

    console.log(`[Auto] Route data retrieved: ${JSON.stringify(routeData)}`);

    return NextResponse.json({
      success: true,
      data: routeData
    });

  } catch (error) {
    console.error('[Auto] Error in crawl route API:', error);
    return NextResponse.json(
      { error: 'Failed to crawl route information' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userLat = parseFloat(searchParams.get('userLat') || '0');
  const userLng = parseFloat(searchParams.get('userLng') || '0');
  const marketLat = parseFloat(searchParams.get('marketLat') || '0');
  const marketLng = parseFloat(searchParams.get('marketLng') || '0');
  const marketName = searchParams.get('marketName') || '';

  if (!userLat || !userLng || !marketLat || !marketLng) {
    return NextResponse.json(
      { error: 'Missing required coordinates' },
      { status: 400 }
    );
  }

  try {
    console.log(`[Auto] Crawling 100% accurate route for market: ${marketName}`);

    // Crawl the route using Google Maps
    const routeData = await googleMapsCrawler.crawlRoute(
      userLat,
      userLng,
      marketLat,
      marketLng,
      marketName
    );

    console.log(`[Auto] Route data retrieved: ${JSON.stringify(routeData)}`);

    return NextResponse.json({
      success: true,
      data: routeData
    });

  } catch (error) {
    console.error('[Auto] Error in crawl route API:', error);
    return NextResponse.json(
      { error: 'Failed to crawl route information' },
      { status: 500 }
    );
  }
}
