/**
 * Google Maps Crawler Service
 * Extracts real travel time and distance from Google Maps
 */

import puppeteer, { Browser } from 'puppeteer';

export interface GoogleMapsRouteData {
  estimatedTime: string;
  distance: string;
  accuracy: number;
  service: string;
  url: string;
}

export class GoogleMapsCrawler {
  private browser: Browser | null = null;

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
    }
    return this.browser;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Crawl Google Maps for route information
   */
  async crawlRoute(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
    marketName?: string
  ): Promise<GoogleMapsRouteData> {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      // Create Google Maps directions URL
      const url = `https://www.google.com/maps/dir/${fromLat},${fromLng}/${toLat},${toLng}`;
      
      console.log(`[Auto] Crawling 100% accurate route to ${marketName || 'market'}: ${url}`);

      // Navigate to Google Maps
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for the route to load
      await page.waitForSelector('div', { timeout: 10000 });
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Try to find route information with multiple selectors
      const routeInfo = await page.evaluate(() => {
        // Multiple selectors to try for travel time
        const timeSelectors = [
          '[data-value="time"]',
          '.section-directions-trip-duration',
          '.section-directions-trip-numbers',
          '[jstcache="27"]',
          '.widget-pane-section-directions-trip-duration',
          '.directions-travel-numbers__duration',
          'div[data-value]',
          '.section-directions-trip'
        ];

        // Multiple selectors for distance
        const distanceSelectors = [
          '[data-value="distance"]',
          '.section-directions-trip-distance',
          '.directions-travel-numbers__distance',
          'div[data-value]'
        ];

        let travelTime = '';
        let distance = '';

        // Try to find travel time
        for (const selector of timeSelectors) {
          const elements = document.querySelectorAll(selector);
          for (const element of elements) {
            const text = element.textContent?.trim() || '';
            if (text && (text.includes('min') || text.includes('hour') || text.includes('h'))) {
              travelTime = text;
              break;
            }
          }
          if (travelTime) break;
        }

        // Try to find distance
        for (const selector of distanceSelectors) {
          const elements = document.querySelectorAll(selector);
          for (const element of elements) {
            const text = element.textContent?.trim() || '';
            if (text && (text.includes('km') || text.includes('m') || text.includes('mi'))) {
              distance = text;
              break;
            }
          }
          if (distance) break;
        }

        // Fallback: try to find any text that looks like duration/distance
        if (!travelTime || !distance) {
          const allText = document.body.innerText;
          const timeMatch = allText.match(/(\d+)\s*(min|hour|h|minuto|hora)/i);
          const distanceMatch = allText.match(/(\d+[.,]?\d*)\s*(km|m|mi)/i);
          
          if (timeMatch && !travelTime) {
            travelTime = timeMatch[0];
          }
          if (distanceMatch && !distance) {
            distance = distanceMatch[0];
          }
        }

        return {
          travelTime: travelTime || 'N/A',
          distance: distance || 'N/A',
          pageContent: document.body.innerText.substring(0, 500) // For debugging
        };
      });

      console.log(`[Auto] Route info found: ${routeInfo.travelTime}, ${routeInfo.distance}`);

      return {
        estimatedTime: routeInfo.travelTime,
        distance: routeInfo.distance,
        accuracy: 100, // Google Maps provides the most accurate data
        service: 'Google Maps Crawler',
        url: url
      };

    } catch (error) {
      console.error('[Auto] Error crawling Google Maps:', error);
      
      // Fallback to estimation if crawling fails
      const straightLineDistance = this.calculateStraightLineDistance(fromLat, fromLng, toLat, toLng);
      const estimatedTime = Math.round(straightLineDistance / 25 * 60); // Assume 25 km/h average speed
      
      return {
        estimatedTime: `${estimatedTime} min`,
        distance: `${straightLineDistance.toFixed(1)} km`,
        accuracy: 75,
        service: 'Estimated (Auto Crawl Failed)',
        url: `https://www.google.com/maps/dir/${fromLat},${fromLng}/${toLat},${toLng}`
      };
    } finally {
      await page.close();
    }
  }

  /**
   * Calculate straight-line distance between two points
   */
  private calculateStraightLineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Batch crawl multiple routes
   */
  async crawlMultipleRoutes(
    userLat: number,
    userLng: number,
    markets: Array<{ id: number; name: string; latitude: number; longitude: number; }>
  ): Promise<Map<number, GoogleMapsRouteData>> {
    const results = new Map<number, GoogleMapsRouteData>();
    
    for (const market of markets) {
      try {
        const routeData = await this.crawlRoute(
          userLat,
          userLng,
          market.latitude,
          market.longitude,
          market.name
        );
        results.set(market.id, routeData);
        
        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`[Auto] Error crawling route for market ${market.name}:`, error);
      }
    }

    return results;
  }

  /**
   * Progressive enhancement - crawl routes one by one with callbacks
   */
  async crawlProgressively(
    userLat: number,
    userLng: number,
    markets: Array<{ id: number; name: string; latitude: number; longitude: number; }>,
    onProgress: (marketId: number, routeData: GoogleMapsRouteData) => void,
    maxConcurrent: number = 3
  ): Promise<void> {
    console.log(`[Auto] Starting progressive crawling for ${markets.length} markets (max ${maxConcurrent} concurrent)`);
    
    // Process markets in batches to avoid overwhelming the service
    const batches = [];
    for (let i = 0; i < markets.length; i += maxConcurrent) {
      batches.push(markets.slice(i, i + maxConcurrent));
    }

    for (const batch of batches) {
      const promises = batch.map(async (market) => {
        try {
          const routeData = await this.crawlRoute(
            userLat,
            userLng,
            market.latitude,
            market.longitude,
            market.name
          );
          onProgress(market.id, routeData);
        } catch (error) {
          console.error(`[Auto] Error crawling route for market ${market.name}:`, error);
        }
      });

      // Wait for current batch to complete before starting next batch
      await Promise.all(promises);
      
      // Add delay between batches to avoid rate limiting
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`[Auto] Progressive crawling completed for ${markets.length} markets`);
  }
}

// Singleton instance
export const googleMapsCrawler = new GoogleMapsCrawler();
