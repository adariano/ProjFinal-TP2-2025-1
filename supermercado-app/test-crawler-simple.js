/**
 * Test script for the Google Maps crawler
 * This can be run with: node test-crawler-simple.js
 */

const testCrawler = async () => {
  console.log('Testing Google Maps crawler...');
  
  try {
    const response = await fetch('http://localhost:3000/api/route/crawl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userLat: -15.7942,
        userLng: -47.8822,
        marketId: 1,
        marketName: 'Supermercado Teste',
        marketLat: -15.7801,
        marketLng: -47.9292
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Crawler result:', result);
    
    if (result.success && result.data) {
      console.log('✅ Crawler test successful!');
      console.log('Estimated time:', result.data.estimatedTime);
      console.log('Distance:', result.data.distance);
      console.log('Accuracy:', result.data.accuracy);
      console.log('Service:', result.data.service);
    } else {
      console.log('❌ Crawler test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing crawler:', error);
  }
};

// Export for use in other files
module.exports = { testCrawler };

// Run test if this file is executed directly
if (require.main === module) {
  testCrawler();
}
