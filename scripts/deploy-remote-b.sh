#!/bin/bash

# Deployment script for Remote-B
# This script builds and prepares Remote-B for independent deployment
# Usage: ./scripts/deploy-remote-b.sh [PUBLIC_PATH] [COMMON_LIB_URL] [REMOTE_B_URL]

set -e

PUBLIC_PATH=${1:-"/mf-with-webpack/remote-b/"}
COMMON_LIB_URL=${2:-"https://cdn.example.com/common-lib"}
REMOTE_B_URL=${3:-"https://app-b.example.com"}

echo "🚀 Building Remote-B for deployment..."
echo "   PUBLIC_PATH: $PUBLIC_PATH"
echo "   COMMON_LIB_URL: $COMMON_LIB_URL"
echo "   REMOTE_B_URL: $REMOTE_B_URL"

NODE_ENV=production \
COMMON_LIB_URL="$COMMON_LIB_URL" \
PUBLIC_PATH="$PUBLIC_PATH" \
pnpm run build:remote-b:prod

echo "✅ Remote-B built successfully!"
echo "📦 Output directory: dist/remote-b/"
echo ""
echo "Next steps:"
echo "1. Deploy dist/remote-b/ to your server"
echo "2. Ensure remoteEntry.js is accessible at: $REMOTE_B_URL/remoteEntry.js"
echo "3. Update REMOTE_B_URL in host app to: $REMOTE_B_URL"
