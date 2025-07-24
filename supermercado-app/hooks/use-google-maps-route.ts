import { useState, useCallback } from 'react';
import { GoogleMapsRouteData } from '@/lib/google-maps-crawler';

interface Market {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
  estimatedTime?: string;
  accuracy?: number;
  service?: string;
  googleMapsUrl?: string;
}

interface UseGoogleMapsRouteResult {
  crawlRoute: (userLat: number, userLng: number, market: Market) => Promise<GoogleMapsRouteData | null>;
  crawlMultipleRoutes: (userLat: number, userLng: number, markets: Market[]) => Promise<Map<number, GoogleMapsRouteData>>;
  isLoading: boolean;
  error: string | null;
}

export function useGoogleMapsRoute(): UseGoogleMapsRouteResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crawlRoute = useCallback(async (
    userLat: number,
    userLng: number,
    market: Market
  ): Promise<GoogleMapsRouteData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/route/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userLat,
          userLng,
          marketId: market.id,
          marketName: market.name,
          marketLat: market.latitude,
          marketLng: market.longitude,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to crawl route');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to get route data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error crawling route:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const crawlMultipleRoutes = useCallback(async (
    userLat: number,
    userLng: number,
    markets: Market[]
  ): Promise<Map<number, GoogleMapsRouteData>> => {
    setIsLoading(true);
    setError(null);

    const results = new Map<number, GoogleMapsRouteData>();

    try {
      // Process markets in batches to avoid overwhelming the server
      const batchSize = 3;
      for (let i = 0; i < markets.length; i += batchSize) {
        const batch = markets.slice(i, i + batchSize);
        
        const promises = batch.map(async (market) => {
          try {
            const routeData = await crawlRoute(userLat, userLng, market);
            if (routeData) {
              results.set(market.id, routeData);
            }
          } catch (err) {
            console.error(`Error crawling route for market ${market.name}:`, err);
          }
        });

        await Promise.all(promises);
        
        // Add delay between batches to avoid rate limiting
        if (i + batchSize < markets.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error crawling multiple routes:', err);
      return results;
    } finally {
      setIsLoading(false);
    }
  }, [crawlRoute]);

  return {
    crawlRoute,
    crawlMultipleRoutes,
    isLoading,
    error,
  };
}
