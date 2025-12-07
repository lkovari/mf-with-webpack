#!/bin/bash

# Deployment script for Remote-A
# This script builds and prepares Remote-A for independent deployment
# Usage: ./scripts/deploy-remote-a.sh [PUBLIC_PATH] [COMMON_LIB_URL] [REMOTE_A_URL]

set -e

PUBLIC_PATH=${1:-"/mf-with-webpack/remote-a/"}
COMMON_LIB_URL=${2:-"https://cdn.example.com/common-lib"}
REMOTE_A_URL=${3:-"https://app-a.example.com"}

echo "🚀 Building Remote-A for deployment..."
echo "   PUBLIC_PATH: $PUBLIC_PATH"
echo "   COMMON_LIB_URL: $COMMON_LIB_URL"
echo "   REMOTE_A_URL: $REMOTE_A_URL"

NODE_ENV=production \
COMMON_LIB_URL="$COMMON_LIB_URL" \
PUBLIC_PATH="$PUBLIC_PATH" \
pnpm run build:remote-a:prod

echo "✅ Remote-A built successfully!"
echo "📦 Output directory: dist/remote-a/"
echo ""
echo "Next steps:"
echo "1. Deploy dist/remote-a/ to your server"
echo "2. Ensure remoteEntry.js is accessible at: $REMOTE_A_URL/remoteEntry.js"
echo "3. Update REMOTE_A_URL in host app to: $REMOTE_A_URL"
