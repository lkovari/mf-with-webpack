#!/bin/bash

# Deployment script for Host Application
# This script builds and prepares the host app for deployment
# Usage: ./scripts/deploy-host.sh [PUBLIC_PATH] [REMOTE_A_URL] [REMOTE_B_URL] [COMMON_LIB_URL]

set -e

PUBLIC_PATH=${1:-"/mf-with-webpack/host/"}
REMOTE_A_URL=${2:-"https://app-a.example.com"}
REMOTE_B_URL=${3:-"https://app-b.example.com"}
COMMON_LIB_URL=${4:-"https://cdn.example.com/common-lib"}

echo "🚀 Building Host Application for deployment..."
echo "   PUBLIC_PATH: $PUBLIC_PATH"
echo "   REMOTE_A_URL: $REMOTE_A_URL"
echo "   REMOTE_B_URL: $REMOTE_B_URL"
echo "   COMMON_LIB_URL: $COMMON_LIB_URL"

NODE_ENV=production \
REMOTE_A_URL="$REMOTE_A_URL" \
REMOTE_B_URL="$REMOTE_B_URL" \
COMMON_LIB_URL="$COMMON_LIB_URL" \
PUBLIC_PATH="$PUBLIC_PATH" \
pnpm run build:host:prod

echo "✅ Host Application built successfully!"
echo "📦 Output directory: dist/host/"
echo ""
echo "Next steps:"
echo "1. Deploy dist/host/ to your server"
echo "2. Ensure all remotes are accessible:"
echo "   - Remote-A: $REMOTE_A_URL/remoteEntry.js"
echo "   - Remote-B: $REMOTE_B_URL/remoteEntry.js"
echo "   - Common-Lib: $COMMON_LIB_URL/remoteEntry.js"
