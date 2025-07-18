#!/bin/bash

# Script to run the development server in the correct directory
# This avoids the common mistake of running npm run dev from the wrong directory

echo "Starting development server from supermercado-app directory..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the supermercado-app directory
cd "$SCRIPT_DIR/supermercado-app" || {
    echo "Error: Could not change to supermercado-app directory"
    exit 1
}

echo "Current directory: $(pwd)"
echo "Running npm run dev..."
exec npm run dev
