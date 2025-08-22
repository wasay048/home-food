// WeChat OAuth Configuration
export const WECHAT_CONFIG = {
  APP_ID: "wx4a71fe09bb125182",
  APP_SECRET: "e8a88b5e0271b89a1dc71261d9063fad", // Note: In production, this should be on the backend only
  REDIRECT_URI: `${window.location.origin}/wechat/callback`,
  SCOPE: "snsapi_userinfo", // Get user info including avatar and nickname

  // WeChat OAuth URLs
  AUTHORIZE_URL: "https://open.weixin.qq.com/connect/oauth2/authorize",
  ACCESS_TOKEN_URL: "https://api.weixin.qq.com/sns/oauth2/access_token",
  USER_INFO_URL: "https://api.weixin.qq.com/sns/userinfo",
};

// Generate WeChat OAuth URL
export const generateWeChatAuthUrl = (state = null) => {
  const randomState = state || Math.random().toString(36).substring(7);

  const params = new URLSearchParams({
    appid: WECHAT_CONFIG.APP_ID,
    redirect_uri: WECHAT_CONFIG.REDIRECT_URI,
    response_type: "code",
    scope: WECHAT_CONFIG.SCOPE,
    state: randomState,
  });

  return `${WECHAT_CONFIG.AUTHORIZE_URL}?${params.toString()}#wechat_redirect`;
};

// WeChat API endpoints
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
