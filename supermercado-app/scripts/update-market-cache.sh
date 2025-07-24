#!/bin/bash
# Market cache update cron job script
# This script should be run periodically to keep market data fresh

# Configuration - can be overridden by environment variables
API_URL="${MARKET_API_URL:-http://localhost:3000/api/market/update-cache}"
LOG_FILE="${MARKET_LOG_FILE:-/tmp/market-cache-update.log}"
AUTH_TOKEN="${MARKET_AUTH_TOKEN:-internal-cron-job}"
TIMEOUT="${MARKET_TIMEOUT:-30}"

# Detect environment
if [ -f ".env.local" ]; then
    source .env.local
elif [ -f ".env.production" ]; then
    source .env.production
elif [ -f ".env" ]; then
    source .env
fi

# For production, you might want to use:
# - Vercel: https://your-app.vercel.app/api/market/update-cache
# - Railway: https://your-app.railway.app/api/market/update-cache
# - Netlify: https://your-app.netlify.app/api/market/update-cache
# - Your own domain: https://economarket.com/api/market/update-cache

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to update market cache
update_market_cache() {
    log_message "Starting market cache update..."
    log_message "Using API URL: $API_URL"
    
    # Make API call to update cache with timeout
    response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -H "User-Agent: EconoMarket-CronJob/1.0" \
        -d "{\"authorization\": \"$AUTH_TOKEN\"}" \
        --connect-timeout "$TIMEOUT" \
        --max-time "$TIMEOUT" \
        2>&1)
    
    curl_exit_code=$?
    
    if [ $curl_exit_code -eq 0 ]; then
        log_message "Market cache update completed successfully"
        log_message "Response: $response"
    else
        log_message "ERROR: Market cache update failed (curl exit code: $curl_exit_code)"
        log_message "Error: $response"
        
        # Different error handling based on curl exit code
        case $curl_exit_code in
            6)  log_message "ERROR: Could not resolve host. Check DNS/network connectivity." ;;
            7)  log_message "ERROR: Failed to connect to server. Server may be down." ;;
            28) log_message "ERROR: Request timed out after ${TIMEOUT} seconds." ;;
            *)  log_message "ERROR: Unknown curl error code: $curl_exit_code" ;;
        esac
        
        exit 1
    fi
}

# Main execution
main() {
    log_message "=== Market Cache Update Job Started ==="
    log_message "Environment: ${NODE_ENV:-development}"
    log_message "API URL: $API_URL"
    
    # Check if the server is running
    log_message "Checking server availability..."
    if ! curl -s --connect-timeout 10 --max-time 10 "$API_URL" > /dev/null 2>&1; then
        log_message "ERROR: Server is not accessible at $API_URL"
        log_message "Please check:"
        log_message "1. Server is running"
        log_message "2. URL is correct"
        log_message "3. Network connectivity"
        log_message "4. Firewall settings"
        exit 1
    fi
    
    log_message "Server is accessible, proceeding with cache update..."
    
    # Update market cache
    update_market_cache
    
    log_message "=== Market Cache Update Job Completed ==="
}

# Run the main function
main "$@"
