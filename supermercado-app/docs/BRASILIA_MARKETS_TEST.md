# Brasília Markets - Testing Guide

## 📍 Your Location
- **Address**: SHCES 905 Bloco J - Cruzeiro Novo, Brasília - DF
- **Approximate Coordinates**: -15.8030, -47.8460
- **Google Maps**: https://maps.app.goo.gl/FJsWpB19VqwwkS237

## 🏪 Markets Near You (within 25km)

### Very Close (< 1km)
1. **Supermercado Comper** (0.1km) - SHCES Quadra 1304
2. **Mercadinho do Cruzeiro** (0.2km) - SHCES Quadra 1306
3. **Supermercado Vitória** (0.5km) - SCES Trecho 3 Conjunto 6

### Close (1-5km)
4. **Extra Hiper Cruzeiro** (0.9km) - SCES Trecho 2 Conjunto 31
5. **Carrefour Brasília Shopping** (3.2km) - SCN Quadra 5 Bloco A
6. **Atacadão Brasília** (4.5km) - SEPN Quadra 515 Bloco C
7. **Pão de Açúcar Sudoeste** (5.1km) - CLN 201 Bloco A

## 🧪 Test Commands

### Test API Directly
```bash
# Test with your coordinates
curl -s "http://localhost:3000/api/market/nearby?lat=-15.8030&lng=-47.8460&radius=25&limit=10" | jq '.total'

# Should return: 7
```

### Test Frontend
1. Go to: `http://localhost:3000/login`
2. Login with: `joao.silva@email.com` / `123456`
3. Go to: `http://localhost:3000/dashboard/mercados`
4. Click "Minha Localização" button
5. Allow location access
6. You should see 7 markets sorted by distance

### Test Address Search
1. In the search box, type: "SHCES 905 Bloco J, Brasília"
2. Click "Buscar"
3. Should show the same 7 markets

## 🔍 Debug Steps

### Check Browser Console
Open DevTools (F12) and look for:
```
Loading nearby markets for location: {lat: -15.8030, lng: -47.8460}
Nearby markets API response: {markets: [...], total: 7}
Setting nearbyMarkets: [7 markets]
```

### If Still No Markets
1. **Check your exact coordinates** in the console
2. **Try with a larger radius**:
   ```bash
   curl -s "http://localhost:3000/api/market/nearby?lat=YOUR_LAT&lng=YOUR_LNG&radius=50&limit=10"
   ```
3. **Use the address search** instead of GPS
4. **Login as admin** to see all markets

## 📊 Expected Results

When you visit the markets page, you should see:
- **Supermercado Comper** (100m away)
- **Mercadinho do Cruzeiro** (200m away)
- **Supermercado Vitória** (500m away)
- **Extra Hiper Cruzeiro** (900m away)
- And 3 more markets within 5km

All with proper distance calculation and estimated travel times!

## 🎯 Next Steps

1. **Test the frontend** with your location
2. **Check the browser console** for debug info
3. **Try the address search** feature
4. **Let me know** if you see the 7 Brasília markets!

The system should now work perfectly for your location in Brasília! 🏛️
