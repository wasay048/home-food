#!/bin/bash

# WeChat Domain Verification Test Script
# Run this script to test your domain setup

echo "🔍 WeChat Domain Verification Test"
echo "=================================="

# Test domain accessibility
DOMAIN="www.homefreshfoods.ai"
echo "Testing domain: $DOMAIN"

# Test HTTPS connection
echo "1. Testing HTTPS connection..."
curl -I "https://$DOMAIN" 2>/dev/null | head -1

# Test if domain redirects properly
echo "2. Testing domain redirects..."
curl -I "https://homefreshfoods.ai" 2>/dev/null | grep -i location

# Test WeChat callback URL
echo "3. Testing WeChat callback URL..."
curl -I "https://$DOMAIN/wechat/callback" 2>/dev/null | head -1

# Test for verification file (this will 404 until you add the real file)
echo "4. Testing verification file access..."
curl -I "https://$DOMAIN/MP_verify_placeholder.txt" 2>/dev/null | head -1

# Generate test WeChat OAuth URL
APP_ID="wx4a71fe09bb125182"
REDIRECT_URI="https%3A%2F%2F$DOMAIN%2Fwechat%2Fcallback"
TEST_URL="https://open.weixin.qq.com/connect/oauth2/authorize?appid=$APP_ID&redirect_uri=$REDIRECT_URI&response_type=code&scope=snsapi_base&state=test#wechat_redirect"

echo "5. Generated WeChat OAuth URL:"
echo "$TEST_URL"

echo ""
echo "🔧 Next Steps:"
echo "1. Go to WeChat Developer Console: https://developers.weixin.qq.com/"
echo "2. Add domain '$DOMAIN' to authorized callback domains"
echo "3. Download and replace MP_verify_placeholder.txt with real verification file"
echo "4. Test the OAuth URL above in WeChat browser"
echo ""
echo "❌ Current Issue: Domain '$DOMAIN' not verified in WeChat console"
echo "✅ Fix: Add domain to WeChat Developer Console authorized domains"
