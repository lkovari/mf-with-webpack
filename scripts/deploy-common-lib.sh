#!/bin/bash

# Deployment script for Common Library
# This script builds and prepares the common library for deployment
# Usage: ./scripts/deploy-common-lib.sh [PUBLIC_PATH] [COMMON_LIB_URL]

set -e

PUBLIC_PATH=${1:-"/mf-with-webpack/lk-common-lib/"}
COMMON_LIB_URL=${2:-"https://cdn.example.com/common-lib"}

echo "🚀 Building Common Library for deployment..."
echo "   PUBLIC_PATH: $PUBLIC_PATH"
echo "   COMMON_LIB_URL: $COMMON_LIB_URL"

NODE_ENV=production \
PUBLIC_PATH="$PUBLIC_PATH" \
pnpm run build:lib:prod

echo "✅ Common Library built successfully!"
echo "📦 Output directory: dist/lk-common-lib/"
echo ""
echo "Next steps:"
echo "1. Deploy dist/lk-common-lib/ to your server/CDN"
echo "2. Ensure remoteEntry.js is accessible at: $COMMON_LIB_URL/remoteEntry.js"
echo "3. Update COMMON_LIB_URL in other apps to: $COMMON_LIB_URL"
