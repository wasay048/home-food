import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {defineSecret} from "firebase-functions/params";
// import {admin} from "./admin"; // when you're ready to mint a Firebase custom token

const WECHAT_APPID = defineSecret("WECHAT_APPID");
const WECHAT_SECRET = defineSecret("WECHAT_SECRET");
const APP_BASE = defineSecret("APP_BASE");

const ALLOW_ORIGIN = "https://www.homefreshfoods.ai"; // your app origin

export const exchangeWeChatCode = onRequest(
  {region: "us-central1", secrets: [WECHAT_APPID, WECHAT_SECRET, APP_BASE]},
  async (req, res) => {
    // --- CORS ---
    res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
    res.setHeader("Vary", "Origin");
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      res.setHeader("Access-Control-Max-Age", "3600");
      res.status(204).end();
      return;
    }

    const appid = WECHAT_APPID.value();
    const secret = WECHAT_SECRET.value();

    // read code from POST body or GET query
    let code;
    if (req.method === "POST") {
      let body = req.body;
      if (!body || typeof body !== "object") {
        try {
          body = JSON.parse(Buffer.from(req.rawBody || "").toString() || "{}");
        } catch(e) {
          res.status(400).json({error: "bad_json"});
          return;
        }
      }
      code = body?.code;
    } else if (req.method === "GET") {
      const raw = req.query.code;
      code = Array.isArray(raw) ? raw[0] : raw;
    } else {
      res.status(405).send("Method Not Allowed");
      return;
    }

    logger.info("HIT exchangeWeChatCode", {
      method: req.method,
      hasCode: !!code,
    });

    if (!appid || !secret) {
      logger.error("Missing WeChat secrets", {
        hasAppId: !!appid,
        hasSecret: !!secret,
      });
      res.status(500).json({error: "server_config"});
      return;
    }
    if (!code) {
      res.status(400).json({error: "code_missing"});
      return;
    }

    try {
      // 1) exchange code
      const tokenURL = new URL(
        "https://api.weixin.qq.com/sns/oauth2/access_token"
      );
      tokenURL.search = new URLSearchParams({
        appid,
        secret,
        code,
        grant_type: "authorization_code",
      }).toString();
      const tkRes = await fetch(tokenURL.toString());
      const tk = await tkRes.json().catch(() => ({}));
      logger.info("WeChat token response", {status: tkRes.status, body: tk});

      if (!tkRes.ok || tk.errcode || !tk.access_token || !tk.openid) {
        res
          .status(400)
          .json({error: `token_${tk.errcode ?? tkRes.status}`, detail: tk});
        return;
      }

      const {access_token, openid} = tk;
      const scope = tk.scope ?? "";
      const unionid = tk.unionid;

      // 2) optional userinfo
      let userInfo = null;
      if (scope.includes("snsapi_userinfo")) {
        const uiURL = new URL("https://api.weixin.qq.com/sns/userinfo");
        uiURL.search = new URLSearchParams({
          access_token,
          openid,
          lang: "zh_CN",
        }).toString();
        const uiRes = await fetch(uiURL.toString());
        const ui = await uiRes.json().catch(() => ({}));
        logger.info("WeChat userinfo response", {
          status: uiRes.status,
          body: ui,
        });
        if (!ui.errcode) userInfo = ui;
      }

      const uid = unionid ?? `wx_${openid}`;

      // If you plan to sign in to Firebase from the client:
      // const customToken = await admin.auth().createCustomToken(uid, { provider:"wechat", openid, unionid: unionid ?? null });

      res.status(200).json({
        uid,
        openid,
        unionid: unionid ?? null,
        access_token,
        refresh_token: tk.refresh_token,
        expires_in: tk.expires_in, // usually 7200
        scope,
                // token: customToken, // uncomment if you mint a Firebase Custom Token
        user: userInfo,
      });
    } catch (e) {
      logger.error("Exchange failed", {error: e?.message});
      res.status(500).json({error: "server", message: e?.message});
    }
  }
);

// Re-export sharing functions from separate file (ogShare.js)
// These are completely independent — remove this line to disable them
export {ogMetaProxy, wechatJssdkSignature, ogFoodImage} from "./ogShare.js";

// Re-export order SMS notification (standalone, sends SMS on new order)
export {onNewOrderSendSms} from "./orderSmsNotification.js";
