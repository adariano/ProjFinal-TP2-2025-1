# Markets Location Fix - Summary

## ✅ What I Fixed

### 1. **Increased Search Radius**
- Changed from 10km to 25km radius for finding nearby markets
- This gives much better coverage for users in different locations

### 2. **Added More Markets**
- **Before**: 10 markets (all in São Paulo)
- **After**: 16 markets across Brazil:
  - São Paulo: 10 markets
  - Rio de Janeiro: 1 market (Ipanema)
  - Belo Horizonte: 1 market
  - Campo Grande: 1 market
  - Imperatriz: 1 market
  - Recife: 1 market
  - Florianópolis: 1 market

### 3. **Added Debug Logging**
- Added console.log statements to help identify what's happening
- You can open browser DevTools (F12) to see the logs

## 🔍 How to Test

### Option 1: Check Browser Console
1. Open your browser and go to `http://localhost:3000/dashboard/mercados`
2. Press F12 to open DevTools
3. Go to Console tab
4. Look for messages like:
   - "Loading nearby markets for location: {lat: ..., lng: ...}"
   - "Nearby markets API response: {markets: [...], total: X}"
   - "Setting nearbyMarkets: [...]"

### Option 2: Test Different Locations
You can test the API directly with your coordinates:

```bash
# Replace YOUR_LAT and YOUR_LNG with your actual coordinates
curl -s "http://localhost:3000/api/market/nearby?lat=YOUR_LAT&lng=YOUR_LNG&radius=25&limit=10" | jq '.total'
```

### Option 3: Use Address Search
1. Go to the markets page
2. Type your address in the search box
3. Click "Buscar" - this should show markets near that address

## 🎯 Expected Results

With the increased radius (25km) and more markets, you should now see:
- **São Paulo area**: Up to 10 markets
- **Rio de Janeiro (Ipanema)**: 1 market
- **Other cities**: 1-2 markets each

## 🐛 If You Still See No Markets

### Check Your Location
1. Make sure you allowed location access in your browser
2. Check the browser console for your actual coordinates
3. Test with the API directly using your coordinates

### Try Different Approaches
1. **Use the address search** instead of GPS location
2. **Login as admin** to see all markets (admin@economarket.com / admin123)
3. **Test with specific coordinates**:
   ```bash
   # São Paulo center
   curl -s "http://localhost:3000/api/market/nearby?lat=-23.5505&lng=-46.6333&radius=25&limit=10"
   
   # Rio de Janeiro center  
   curl -s "http://localhost:3000/api/market/nearby?lat=-22.9068&lng=-43.1729&radius=25&limit=10"
   ```

## 📍 Available Market Locations

The seed now includes markets in these cities:
- **São Paulo, SP** (10 markets)
- **Rio de Janeiro, RJ** (1 market)  
- **Belo Horizonte, MG** (1 market)
- **Campo Grande, MS** (1 market)
- **Imperatriz, MA** (1 market)
- **Recife, PE** (1 market)
- **Florianópolis, SC** (1 market)

## 🔧 Next Steps

If you're still not seeing markets:
1. Check the browser console for error messages
2. Share your location coordinates so I can test with them
3. Try the address search feature
4. Test as an admin user to see all markets regardless of location

The system should now work much better with the increased radius and more diverse market locations! 🎉
