# Production Deployment Guide

## Market Cache Update System

### Overview
The market cache update system keeps location data fresh by periodically updating market information from Google Maps API.

### Production Setup

#### 1. Environment Variables

Create a `.env.production` file or set these environment variables:

```bash
# API Configuration
MARKET_API_URL=https://your-domain.com/api/market/update-cache
MARKET_AUTH_TOKEN=your-secure-random-token-here
MARKET_TIMEOUT=60
MARKET_LOG_FILE=/var/log/market-cache-update.log

# Database
DATABASE_URL=your-production-database-url

# Google Maps API (optional, for enhanced features)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

#### 2. Authentication Setup

For production, replace the simple token auth with:
- API Keys with proper rotation
- JWT tokens
- OAuth2 service accounts
- Or integrate with your existing auth system

#### 3. Deployment Options

##### Option A: Vercel (Recommended for Next.js)

1. Deploy your app to Vercel
2. Set environment variables in Vercel dashboard
3. Use Vercel Cron Jobs:

```typescript
// pages/api/cron/update-markets.ts
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify this is a cron request
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Call your update API
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/market/update-cache`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      authorization: process.env.MARKET_AUTH_TOKEN
    })
  })

  const data = await response.json()
  res.status(200).json(data)
}
```

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/update-markets",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

##### Option B: Railway/Render/Heroku

1. Deploy your app
2. Set environment variables
3. Use their built-in cron job features or external services

##### Option C: VPS/Dedicated Server

1. Deploy your app using PM2 or similar
2. Set up the cron job:

```bash
# Edit crontab
crontab -e

# Add this line to run every 6 hours
0 */6 * * * /path/to/your/app/scripts/update-market-cache.sh

# Or use environment file
0 */6 * * * cd /path/to/your/app && MARKET_API_URL=https://your-domain.com/api/market/update-cache ./scripts/update-market-cache.sh
```

#### 4. Monitoring and Logging

##### Log Management
- Use proper log rotation
- Monitor log files for errors
- Set up alerts for failed updates

##### Health Checks
Create a health check endpoint:

```typescript
// pages/api/health/market-cache.ts
export default async function handler(req, res) {
  const response = await fetch('/api/market/update-cache')
  const data = await response.json()
  
  res.status(200).json({
    status: 'healthy',
    lastUpdate: new Date().toISOString(),
    marketsNeedingUpdate: data.needsUpdate
  })
}
```

##### Monitoring Tools
- Use services like Uptime Robot, StatusPage, or DataDog
- Set up alerts for API failures
- Monitor response times

#### 5. Security Considerations

- Use HTTPS in production
- Implement rate limiting
- Use secure tokens
- Validate all inputs
- Monitor for unusual activity

#### 6. Database Considerations

- Use connection pooling
- Implement proper indexing
- Consider read replicas for heavy loads
- Backup regularly

### Example Production Commands

```bash
# Test the script locally
MARKET_API_URL=https://your-domain.com/api/market/update-cache ./scripts/update-market-cache.sh

# Check logs
tail -f /var/log/market-cache-update.log

# Manual cache update
curl -X POST https://your-domain.com/api/market/update-cache \
  -H "Content-Type: application/json" \
  -d '{"authorization": "your-secure-token"}'
```

### Troubleshooting

1. **Server not accessible**: Check domain, SSL, and firewall
2. **Authentication failed**: Verify token matches
3. **Timeout errors**: Increase timeout or check server performance
4. **Rate limiting**: Implement backoff strategies
5. **Database errors**: Check connection string and permissions

### Scaling Considerations

For high-traffic applications:
- Use queue systems (Redis, RabbitMQ)
- Implement distributed caching
- Use CDN for static assets
- Consider microservices architecture
- Implement proper load balancing
