// functions/src/index.ts
import {onRequest} from "firebase-functions/v2/https";
import {admin} from "./admin.js";

const APPID = process.env.WECHAT_APPID;
const SECRET = process.env.WECHAT_SECRET;
const APP_BASE = process.env.APP_BASE || "https://www.homefreshfoods.ai";

function readCookie(req, name) {
  const raw = req.headers?.cookie || "";
  const m = raw.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export const exchangeWeChatCode = onRequest(
  {
    region: "us-central1",
    secrets: ["WECHAT_APPID", "WECHAT_SECRET", "APP_BASE"],
  },
  async (req, res) => {
    if (req.method !== "GET") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const code = req.query.code;
    const state = req.query.state;
    const saved = readCookie(req, "wx_state"); // CSRF (optional but recommended)

    if (!code || !state || !saved || state !== saved) {
      res.redirect(`${APP_BASE}/login?err=state`);
      return;
    }

    // 1) Exchange code -> access_token, openid, unionid?
    const tokenURL = new URL(
      "https://api.weixin.qq.com/sns/oauth2/access_token"
    );
    tokenURL.search = new URLSearchParams({
      appid: APPID,
      secret: SECRET,
      code,
      grant_type: "authorization_code",
    }).toString();

    const tkRes = await fetch(tokenURL, {method: "GET"});
    const tk = await tkRes.json();

    if (!tkRes.ok || tk.errcode || !tk.access_token) {
      res.redirect(`${APP_BASE}/login?err=token_${tk.errcode ?? tkRes.status}`);
      return;
    }

    const {access_token, openid, scope, unionid} = tk;

    // 2) Optional: fetch profile if snsapi_userinfo
    let nickname = null;
    let avatar = null;
    if (scope.includes("snsapi_userinfo")) {
      const uiURL = new URL("https://api.weixin.qq.com/sns/userinfo");
      uiURL.search = new URLSearchParams({
        access_token,
        openid,
        lang: "zh_CN",
      }).toString();
      const uiRes = await fetch(uiURL);
      const ui = await uiRes.json();
      if (!ui.errcode) {
        nickname = ui.nickname ?? null;
        avatar = ui.headimgurl ?? null;
      }
    }

    // 3) Mint Firebase Custom Token (UID = unionid if present, else openid)
    const uid = unionid ?? `wx_${openid}`;
    const customToken = await admin.auth().createCustomToken(uid, {
      provider: "wechat",
      openid,
      unionid: unionid ?? null,
      nickname,
      avatar,
    });

    // 4) Set short-lived HttpOnly cookie with the token, then redirect to SPA
    res.setHeader(
      "Set-Cookie",
      `ft=${encodeURIComponent(
        customToken
      )}; HttpOnly; SameSite=Lax; Path=/; Max-Age=60${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );

    res.redirect(`${APP_BASE}/auth/finish`);
  }
);
