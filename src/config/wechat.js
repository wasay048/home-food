// WeChat OAuth Configuration
export const WECHAT_CONFIG = {
  APP_ID: "wx4a71fe09bb125182",
  APP_SECRET: "e8a88b5e0271b89a1dc71261d9063fad", // Note: In production, this should be on the backend only
  // Use non-www domain to match WeChat Console configuration
  REDIRECT_URI: "https://homefreshfoods.ai/wechat/callback",
  REDIRECT_URI_DEV: "http://localhost:5173/wechat/callback",
  SCOPE: "snsapi_userinfo", // Get user info including avatar and nickname
  // WeChat OAuth URLs
  // Use different URLs based on device type
  WEB_AUTHORIZE_URL: "https://open.weixin.qq.com/connect/oauth2/authorize",
  MOBILE_AUTHORIZE_URL: "https://open.weixin.qq.com/connect/oauth2/authorize",
  QR_AUTHORIZE_URL: "https://open.weixin.qq.com/connect/qrconnect", // For QR code login
  ACCESS_TOKEN_URL: "https://api.weixin.qq.com/sns/oauth2/access_token",
  USER_INFO_URL: "https://api.weixin.qq.com/sns/userinfo",
};

// Determine redirect URI based on environment
export const getRedirectUri = () => {
  // const isLocalhost =
  //   window.location.hostname === "localhost" ||
  //   window.location.hostname === "127.0.0.1";
  // const isDev = process.env.NODE_ENV === "development";

  // if (isLocalhost || isDev) {
  //   console.log("🔧 Using development redirect URI");
  //   return WECHAT_CONFIG.REDIRECT_URI_DEV;
  // } else {
  //   console.log(
  //     "🚀 Using production redirect URI (non-www to match WeChat Console)"
  //   );
  // }
  console.log("� Redirect URI:", WECHAT_CONFIG.REDIRECT_URI);
  return WECHAT_CONFIG.REDIRECT_URI;
};

// Detect if user is on mobile device
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Detect if WeChat browser
export const isWeChatBrowser = () => {
  return /micromessenger/i.test(navigator.userAgent);
};

// Generate WeChat OAuth URL - Simplified and Reliable
export const generateWeChatAuthUrl = (state = null) => {
  const randomState = state || Math.random().toString(36).substring(7);

  console.log("🔗 Generating WeChat OAuth URL");

  const redirectUri = getRedirectUri();
  console.log("🔍 Using redirect URI:", redirectUri);

  const params = new URLSearchParams({
    appid: WECHAT_CONFIG.APP_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: WECHAT_CONFIG.SCOPE,
    state: randomState,
  });

  // Use the standard WeChat OAuth URL that works for both mobile and web
  const baseUrl = WECHAT_CONFIG.WEB_AUTHORIZE_URL;
  const authUrl = `${baseUrl}?${params.toString()}#wechat_redirect`;

  console.log("🔗 Final WeChat OAuth URL:", authUrl);
  console.log("📋 OAuth parameters:", Object.fromEntries(params));

  return authUrl;
}; // WeChat API endpoints
export const WECHAT_API = {
  // Get access token using authorization code
  getAccessToken: async (code) => {
    const params = new URLSearchParams({
      appid: WECHAT_CONFIG.APP_ID,
      secret: WECHAT_CONFIG.APP_SECRET,
      code: code,
      grant_type: "authorization_code",
    });

    const response = await fetch(
      `${WECHAT_CONFIG.ACCESS_TOKEN_URL}?${params.toString()}`
    );
    return await response.json();
  },

  // Get user info using access token
  getUserInfo: async (accessToken, openid) => {
    const params = new URLSearchParams({
      access_token: accessToken,
      openid: openid,
      lang: "en", // or "zh_CN" for Chinese
    });

    const response = await fetch(
      `${WECHAT_CONFIG.USER_INFO_URL}?${params.toString()}`
    );
    return await response.json();
  },
};
