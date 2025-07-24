# Google Maps Crawler - 100% Precision Routes

## Overview
The Google Maps Crawler provides 100% accurate route information by scraping real-time data directly from Google Maps. This feature is **automatically integrated** into the regular market loading process, ensuring users always get the most precise routes without any manual intervention.

## Features

### 🎯 100% Accuracy - Automatic
- **Automatically crawls** real Google Maps data when loading markets
- **First attempt** for route precision - no fallback needed
- **Seamless integration** - works transparently in the background
- Updates accuracy rating to 100% for successfully crawled routes

### 🚀 Smart Auto-Enhancement
- **Automatically enhances** the first 5 markets with 100% precise routes
- **Batch processing** to maintain performance
- **Graceful degradation** - falls back to estimates if crawling fails
- **No user interaction required** - works behind the scenes

### 🔧 Transparent Integration
- **No extra buttons** - integrated into existing location and search flows
- **Automatic enhancement** of nearby markets API
- **Works with both** current location and address search
- **Preserves existing functionality** while adding precision

## How It Works

### 1. Automatic Integration
- **Location-based loading**: When user gets location, automatically enhances first 5 markets
- **Address search**: When user searches by address, automatically enhances results
- **Background processing**: Crawling happens transparently during normal loading
- **Graceful fallback**: If crawling fails, shows estimated routes instead

### 2. Crawler Service (`lib/google-maps-crawler.ts`)
- Uses Puppeteer to open Google Maps in headless browser
- Navigates to directions page with user and market coordinates
- Extracts real travel time and distance information
- Handles multiple selector strategies for reliability

### 3. API Endpoint (`app/api/route/crawl/route.ts`)
- Accepts POST/GET requests with coordinates
- Calls the crawler service
- Returns structured route data

### 4. Location Hook Integration (`hooks/use-location.ts`)
- **Automatically calls** crawler during market loading
- **Enhances first 5 markets** with 100% accurate routes
- **Maintains performance** by limiting crawl scope
- **Preserves user experience** with transparent processing

### 5. UI Integration
- **Automatic "✓ Rota Precisa" badge** for crawled routes
- **Enhanced accuracy meter** showing 100% precision
- **No user action required** - works automatically

## Usage

### Automatic Usage (Recommended)
The crawler now works automatically! No user intervention needed:

1. **User gets location** → Automatically enhances first 5 markets with 100% accurate routes
2. **User searches by address** → Automatically enhances search results with precise routes
3. **Markets display** → Shows "✓ Rota Precisa" badge for enhanced routes
4. **Accuracy meter** → Shows 100% precision for crawled routes

### Manual API Usage (Advanced)
For custom integrations, you can still use the API directly:

```typescript
// Direct API call
const response = await fetch('/api/route/crawl', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userLat: -15.7942,
    userLng: -47.8822,
    marketId: 1,
    marketName: 'Supermercado Teste',
    marketLat: -15.7801,
    marketLng: -47.9292
  })
});
```

## API Reference

### POST/GET `/api/route/crawl`

**Request Body (POST):**
```json
{
  "userLat": -15.7942,
  "userLng": -47.8822,
  "marketId": 1,
  "marketName": "Supermercado Teste",
  "marketLat": -15.7801,
  "marketLng": -47.9292
}
```

**Query Parameters (GET):**
- `userLat`: User latitude
- `userLng`: User longitude
- `marketLat`: Market latitude
- `marketLng`: Market longitude
- `marketName`: Market name (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "estimatedTime": "12 min",
    "distance": "8.5 km",
    "accuracy": 100,
    "service": "Google Maps Directions",
    "url": "https://www.google.com/maps/dir/..."
  }
}
```

## Configuration

### Environment Variables
- None required currently
- Future versions may include rate limiting configs

### Crawler Settings
- Batch size: 3 markets per batch
- Delay between requests: 2 seconds
- Delay between batches: 1 second
- Timeout: 30 seconds per request

## Error Handling

### Automatic Fallback
If crawling fails, the system automatically provides:
- Estimated travel time based on distance
- Accuracy rating of 75%
- Service marked as "Estimated (Crawl Failed)"

### Error Types
- Network errors
- Page load timeouts
- Element not found errors
- Rate limiting responses

## Testing

### Automatic Testing
The crawler now works automatically when:
1. **Getting location**: Click "Minha Localização" → First 5 markets get enhanced
2. **Searching address**: Enter address and search → First 5 results get enhanced  
3. **Look for badges**: Markets with "✓ Rota Precisa" have 100% accurate routes

### Manual API Testing
Run the test script:
```bash
node test-crawler-simple.js
```

### Visual Testing
1. Start the development server: `npm run dev`
2. Open markets page and get your location
3. Look for "✓ Rota Precisa" badges on market cards
4. Hover over cards to see accuracy meters showing 100%

## Performance Considerations

### Rate Limiting
- Built-in delays to avoid Google Maps rate limits
- Batch processing to distribute load
- Automatic retry logic for failed requests

### Resource Usage
- Uses headless browser (Puppeteer)
- Memory usage scales with concurrent requests
- Automatic browser cleanup after use

## Future Enhancements

### Planned Features
- [ ] Caching of crawled routes
- [ ] Multiple route options (fastest, shortest, etc.)
- [ ] Real-time traffic information
- [ ] Public transit routes
- [ ] Route optimization for multiple destinations

### Potential Improvements
- [ ] Add support for other mapping services
- [ ] Implement route preferences
- [ ] Add route history tracking
- [ ] Enhanced error recovery

## Dependencies

- `puppeteer`: Web scraping and browser automation
- `@types/puppeteer`: TypeScript definitions (deprecated, using built-in types)

## Security Notes

### Data Privacy
- No user data is stored during crawling
- Routes are fetched in real-time
- No persistent cookies or tracking

### Rate Limiting
- Implements delays to respect Google's terms
- Uses standard browser user agent
- Avoids aggressive scraping patterns

## Troubleshooting

### Common Issues

1. **Crawling fails consistently**
   - Check internet connection
   - Verify coordinates are valid
   - Ensure Google Maps is accessible

2. **Slow performance**
   - Reduce batch size
   - Increase delays between requests
   - Check system resources

3. **Accuracy not showing 100%**
   - Verify crawling completed successfully
   - Check browser console for errors
   - Ensure market data is being updated

### Debug Mode
Add debug logging by setting:
```typescript
console.log('Crawling route:', url);
```

This will help track the crawling process and identify issues.
