# WeChat Domain Verification & Callback Fix

## 🚨 **IMMEDIATE ACTION REQUIRED**

### Error Analysis

- **Error Code 10003**: "Authorized callback domain verification error"
- **Root Cause**: Domain `www.homefreshfoods.ai` is not verified in WeChat Developer Console
- **Current URL**: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4a71fe09bb125182&redirect_uri=https%3A%2F%2Fwww.homefreshfoods.ai%2Fwechat%2Fcallback&response_type=code&scope=snsapi_base&state=r0076&connect_redirect=1#wechat_redirect`

## 🔧 **STEP-BY-STEP FIX**

### Step 1: WeChat Developer Console Setup

1. **Login to WeChat Developer Console**
   - Go to: <https://developers.weixin.qq.com/>
   - Login with your WeChat Developer account

2. **Access Your Official Account**
   - Navigate to your app: `wx4a71fe09bb125182`
   - Go to: "Development" → "Interface Configuration"

3. **Add Authorized Domains**

   ```
   Domain 1: www.homefreshfoods.ai
   Domain 2: homefreshfoods.ai
   ```

4. **Download Verification File**
   - WeChat will provide a file like: `MP_verify_xxxxxxxx.txt`
   - This file needs to be accessible at: `https://www.homefreshfoods.ai/MP_verify_xxxxxxxx.txt`

### Step 2: Deploy Verification File

#### Option A: Add to Public Folder

1. Download the verification file from WeChat console
2. Place it in: `public/MP_verify_xxxxxxxx.txt`
3. Verify access: `https://www.homefreshfoods.ai/MP_verify_xxxxxxxx.txt`

#### Option B: Add Redirect Rule (Amplify)

Add to your `public/_redirects` file:

```
/MP_verify_* https://your-verification-file-url 200
```

### Step 3: Update WeChat Configuration

#### Current Issue in Config

Your redirect URI is dynamically generated, which can cause issues.

#### Fix: Use Static Callback URL

```javascript
// In src/config/wechat.js
export const WECHAT_CONFIG = {
  APP_ID: "wx4a71fe09bb125182",
  // Use static redirect URI instead of dynamic
  REDIRECT_URI: "https://www.homefreshfoods.ai/wechat/callback",
  // Alternative for development
  REDIRECT_URI_DEV: "http://localhost:5173/wechat/callback",
  SCOPE: "snsapi_base",
  WEB_AUTHORIZE_URL: "https://open.weixin.qq.com/connect/oauth2/authorize",
  ACCESS_TOKEN_URL: "https://api.weixin.qq.com/sns/oauth2/access_token",
  USER_INFO_URL: "https://api.weixin.qq.com/sns/userinfo",
};

// Determine redirect URI based on environment
export const getRedirectUri = () => {
  const isLocalhost = window.location.hostname === 'localhost';
  return isLocalhost ? WECHAT_CONFIG.REDIRECT_URI_DEV : WECHAT_CONFIG.REDIRECT_URI;
};
```

### Step 4: Test Domain Verification

#### Manual Verification

1. **Check File Access**:

   ```bash
   curl https://www.homefreshfoods.ai/MP_verify_xxxxxxxx.txt
   ```

2. **Test OAuth URL**:

   ```
   https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4a71fe09bb125182&redirect_uri=https%3A%2F%2Fwww.homefreshfoods.ai%2Fwechat%2Fcallback&response_type=code&scope=snsapi_base&state=test&connect_redirect=1#wechat_redirect
   ```

3. **WeChat Browser Test**:
   - Open above URL in WeChat browser
   - Should not show error 10003

## 🛠️ **ADDITIONAL FIXES NEEDED**

### 1. Handle www vs non-www

Both domains should be added to WeChat:

- `www.homefreshfoods.ai`
- `homefreshfoods.ai`

### 2. Update Amplify Redirects

Ensure both domains work:

```
# In public/_redirects
https://homefreshfoods.ai/* https://www.homefreshfoods.ai/:splat 301!
```

### 3. SSL Certificate

Ensure HTTPS is properly configured for both domains.

## 🧪 **TESTING CHECKLIST**

- [ ] Verification file accessible
- [ ] Domain added to WeChat console
- [ ] OAuth URL works in WeChat browser
- [ ] OAuth URL works in external browser
- [ ] Callback page handles codes properly
- [ ] Both www and non-www domains work

## 📱 **Mobile Testing Process**

### WeChat Browser (iPhone)

1. Open WeChat app
2. Navigate to your share URL in WeChat browser
3. Click "Add to Cart" → "Continue with WeChat"
4. Should redirect without error 10003

### External Browser (iPhone Safari/Chrome)

1. Open share URL in Safari/Chrome
2. Click "Add to Cart" → "Continue with WeChat"
3. Should show "Oops! Something went wrong" instead of error 10003
4. This is expected behavior for external browsers

## 🚀 **IMMEDIATE DEPLOYMENT STEPS**

1. **Get verification file from WeChat console**
2. **Add file to public folder**
3. **Deploy to production**
4. **Verify file is accessible**
5. **Test OAuth flow**

## 📞 **IF STILL FAILING**

If error persists after domain verification:

1. **Check WeChat App Settings**
   - Ensure "Mobile Website" is enabled
   - Verify callback URLs match exactly
   - Check scope permissions

2. **Contact WeChat Support**
   - App ID: `wx4a71fe09bb125182`
   - Error: Domain verification failure
   - Domain: `www.homefreshfoods.ai`

---

**Priority**: 🔴 **CRITICAL** - App cannot authenticate users without this fix
**ETA**: 2-4 hours (pending WeChat console access)
