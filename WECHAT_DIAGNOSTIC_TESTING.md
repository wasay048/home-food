# WeChat Diagnostic Tools Testing Guide

## Overview

Comprehensive diagnostic tools have been implemented to help troubleshoot WeChat authentication domain verification issues (Error 10003). These tools provide automated testing, manual verification steps, and detailed reporting.

## Available Tools

### 1. Web-based Diagnostic Tool

**URL:** `https://homefreshfoods.ai/wechat-diagnosis.html`

**Features:**

- Automated domain accessibility testing
- Verification file detection
- WeChat authentication URL generation
- QR code generation for mobile testing
- Step-by-step configuration checklist
- Real-time test results with visual feedback

**How to use:**

1. Navigate to `https://homefreshfoods.ai/wechat-diagnosis.html`
2. Click "Run All Tests" button
3. Review test results and recommendations
4. Use QR code for mobile WeChat testing
5. Follow checklist items for WeChat Console verification

### 2. React Component Integration

**Route:** `/wechat/debug` in your app

**Features:**

- Interactive diagnostic panel
- Real-time test execution
- Console logging for detailed debugging
- Direct links to WeChat Developer Console
- Current configuration display
- Common issues and solutions guide

**How to use:**

1. Navigate to `https://homefreshfoods.ai/wechat/debug`
2. Click "Run Quick Test" or "Generate Full Report"
3. Open diagnostic panel for detailed view
4. Check browser console for detailed logs
5. Use external links for quick access to resources

### 3. Programmatic JavaScript Utilities

**File:** `src/utils/wechatDiagnostics.js`

**Features:**

- `runWeChatDiagnostics()` - Quick automated testing
- `checkWeChatDomain()` - Full report generation
- `WeChatDiagnostics` class for custom testing
- Console-based testing and reporting

**How to use:**

```javascript
// In browser console or React component
import { runWeChatDiagnostics, checkWeChatDomain } from './utils/wechatDiagnostics';

// Quick test
const results = await runWeChatDiagnostics();
console.log(results);

// Full report
const report = await checkWeChatDomain();
console.log(report);
```

## Testing Checklist

### Step 1: Basic Accessibility

- [ ] Visit `https://homefreshfoods.ai/wechat-diagnosis.html`
- [ ] Run automated tests
- [ ] Verify all tests pass (green checkmarks)
- [ ] Check that verification file is accessible

### Step 2: WeChat Console Verification

- [ ] Login to [WeChat Developer Console](https://developers.weixin.qq.com/)
- [ ] Navigate to Development Configuration (开发配置)
- [ ] Find Web Authorization Domain (网页授权域名) section
- [ ] Verify `homefreshfoods.ai` is listed and verified
- [ ] Check domain status shows "Verified" not "Pending"

### Step 3: Mobile Testing

- [ ] Use QR code from diagnostic tool
- [ ] Test on WeChat mobile app
- [ ] Verify authorization flow works
- [ ] Check for Error 10003 resolution

### Step 4: App Integration Testing

- [ ] Visit `/wechat/debug` in your app
- [ ] Run diagnostic tests
- [ ] Check browser console for detailed logs
- [ ] Verify all tests pass

## Expected Test Results

### ✅ Successful Configuration

```
Domain Access: ✅ Domain homefreshfoods.ai is accessible
Verification File: ✅ Found verification file: MP_verify_placeholder.txt
SSL Certificate: ✅ Valid HTTPS connection established
Redirect URI Access: ✅ Redirect URI is accessible (HTTP 404)
Auth URL Generation: ✅ WeChat OAuth URL generated successfully
```

### ❌ Common Issues

**Domain Not Accessible**

```
Domain Access: ❌ Connection failed: Failed to fetch
```

*Solution: Check DNS configuration and hosting setup*

**Verification File Missing**

```
Verification File: ❌ No verification file found
```

*Solution: Upload MP_verify_*.txt from WeChat Console to website root*

**SSL Issues**

```
SSL Certificate: ❌ SSL/HTTPS error: net::ERR_CERT_INVALID
```

*Solution: Fix SSL certificate configuration*

## Debugging Steps

### 1. Browser Console Testing

```javascript
// Run in browser console at homefreshfoods.ai
window.runWeChatDiagnostics().then(console.log);
```

### 2. Manual Verification File Check

- Visit: `https://homefreshfoods.ai/MP_verify_placeholder.txt`
- Should return verification code, not 404 error

### 3. WeChat Console Configuration

1. **App ID:** `wx4a71fe09bb125182`
2. **Domain:** `homefreshfoods.ai` (without www)
3. **Verification File:** Downloaded from console, uploaded to root
4. **Status:** Must show "Verified" in console

### 4. Network Tab Inspection

- Open browser DevTools > Network tab
- Run diagnostic tests
- Check for failed requests
- Verify all resources load correctly

## Common Error Solutions

### Error 10003: Redirect URI Domain Mismatch

**Root Cause:** Domain not properly configured in WeChat Console

**Solution Steps:**

1. Verify `homefreshfoods.ai` is added to Web Authorization Domain list
2. Ensure verification file is uploaded and accessible
3. Check domain status is "Verified" in WeChat Console
4. Confirm no typos in domain configuration
5. Wait for verification process to complete (can take minutes)

### Verification File Not Found

**Root Cause:** MP_verify_*.txt file not uploaded or inaccessible

**Solution Steps:**

1. Download verification file from WeChat Developer Console
2. Upload to website root directory (same level as index.html)
3. Ensure file is accessible via HTTPS
4. Check hosting provider file permissions
5. Test file accessibility: `https://homefreshfoods.ai/MP_verify_*.txt`

### Domain Status "Pending"

**Root Cause:** Verification process not completed

**Solution Steps:**

1. Upload correct verification file
2. Wait for WeChat verification (usually 5-15 minutes)
3. Try removing and re-adding domain in console
4. Ensure HTTPS is properly configured
5. Contact WeChat support if issue persists

## Next Steps

1. **Deploy Tools:** Ensure `wechat-diagnosis.html` is deployed to your website
2. **Run Tests:** Execute all diagnostic tools and document results
3. **Fix Issues:** Address any failing tests before proceeding
4. **Verify Console:** Confirm WeChat Developer Console configuration
5. **Test Mobile:** Use QR codes to test on actual WeChat mobile app
6. **Monitor:** Set up ongoing monitoring for domain verification status

## Support Resources

- **WeChat Developer Console:** <https://developers.weixin.qq.com/>
- **Diagnostic Tool:** <https://homefreshfoods.ai/wechat-diagnosis.html>
- **Debug Page:** <https://homefreshfoods.ai/wechat/debug>
- **Verification File:** <https://homefreshfoods.ai/MP_verify_placeholder.txt>

## Contact Information

If issues persist after following this guide:

1. Share diagnostic tool results
2. Provide screenshots from WeChat Developer Console
3. Include browser console logs
4. Document exact error messages and steps to reproduce
