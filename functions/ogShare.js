// ============================================================
// OG Share Functions — completely independent from exchangeWeChatCode
//
// 1. ogMetaProxy     — Serves dynamic Open Graph meta tags for crawlers
// 2. wechatJssdkSignature — Generates WeChat JS-SDK config signatures
// 3. ogFoodImage     — Serves food images (bypasses GFW block)
// ============================================================

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {defineSecret} from "firebase-functions/params";
import {initializeApp, getApps} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {createHash} from "crypto";

if (getApps().length === 0) {
  initializeApp();
}
const db = getFirestore();

const WECHAT_APPID = defineSecret("WECHAT_APPID");
const WECHAT_SECRET = defineSecret("WECHAT_SECRET");

const ALLOW_ORIGIN = "https://www.homefreshfoods.ai";
const APP_URL = "https://www.homefreshfoods.ai";
const FUNCTION_BASE = "https://us-central1-homefoods-16e56.cloudfunctions.net";

// ============================================================
// Shared helper: fetch food + kitchen data from Firestore
// ============================================================
async function getFoodData(kitchenId, foodId) {
  const result = {
    foodName: "Home Fresh",
    foodImage: null,
    kitchenName: "HomeFresh",
  };

  if (!foodId || !kitchenId) return result;

  try {
    let foodDoc = null;
    const foodRef = db.collection("kitchens").doc(kitchenId)
      .collection("foodItems").doc(foodId);
    foodDoc = await foodRef.get();

    if (!foodDoc.exists) {
      const topRef = db.collection("foods").doc(foodId);
      foodDoc = await topRef.get();
    }

    if (foodDoc && foodDoc.exists) {
      const fd = foodDoc.data();
      result.foodName = fd.name || fd.foodName || result.foodName;
      result.foodImage = fd.imageUrl || fd.imageURL ||
        (fd.imageUrls && fd.imageUrls[0]) ||
        (fd.imageURLs && fd.imageURLs[0]) ||
        null;
    }

    const kitchenDoc = await db.collection("kitchens").doc(kitchenId).get();
    if (kitchenDoc.exists) {
      const kd = kitchenDoc.data();
      result.kitchenName = kd.kitchenName || kd.name || result.kitchenName;
    }
  } catch (err) {
    logger.error("getFoodData error", {error: err?.message});
  }

  return result;
}

// ============================================================
// 1. ogMetaProxy — dynamic OG tags for crawlers
// ============================================================
const CRAWLER_UA_PATTERN = /micromessenger|facebookexternalhit|twitterbot|telegrambot|slackbot|linkedinbot|whatsapp|googlebot|bingbot|yandex|baiduspider|duckduckbot|discordbot/i;

function isCrawler(ua) {
  return CRAWLER_UA_PATTERN.test(ua || "");
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const ogMetaProxy = onRequest(
  {region: "us-central1"},
  async (req, res) => {
    const ua = req.headers["user-agent"] || "";
    const kitchenId = req.query.kitchenId;
    const foodId = req.query.foodId;
    const dateParam = req.query.date || "";
    const toggleParam = req.query.toggle || "";

    // Build the canonical SPA URL
    const spaParams = new URLSearchParams({
      kitchenId: kitchenId || "",
      foodId: foodId || "",
    });
    if (dateParam) spaParams.set("date", dateParam);
    if (toggleParam) spaParams.set("toggle", toggleParam);
    const spaUrl = `${APP_URL}/share?${spaParams.toString()}`;

    logger.info("ogMetaProxy hit", {
      ua: ua.substring(0, 120),
      isCrawler: isCrawler(ua),
      kitchenId,
      foodId,
    });

    // Non-crawlers get redirected to SPA
    if (!isCrawler(ua)) {
      res.redirect(302, spaUrl);
      return;
    }

    // Fetch food data
    const data = await getFoodData(kitchenId, foodId);

    const ogTitle = escapeHtml(data.foodName);
    const ogDesc = `Check out on HomeFresh from ${escapeHtml(data.kitchenName)}`;

    // Image URL points to the separate ogFoodImage function
    const ogImage = (kitchenId && foodId) ?
      `${FUNCTION_BASE}/ogFoodImage?kitchenId=${kitchenId}&foodId=${foodId}` :
      `${APP_URL}/favicon.svg`;

    // PRE-WARM: fire a request to ogFoodImage so it starts its cold start
    // NOW, while the crawler is still reading this HTML response.
    // By the time the crawler tries to fetch og:image, ogFoodImage is warm.
    if (kitchenId && foodId) {
      fetch(ogImage).catch(() => {});
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${ogTitle} | Home Fresh</title>
  <meta name="description" content="${ogDesc}" />
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${ogDesc}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta property="og:image:width" content="600" />
  <meta property="og:image:height" content="600" />
  <meta property="og:url" content="${escapeHtml(spaUrl)}" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="Home Fresh - 美味鲜到家" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${ogTitle}" />
  <meta name="twitter:description" content="${ogDesc}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
  <meta http-equiv="refresh" content="0;url=${escapeHtml(spaUrl)}" />
</head>
<body>
  <p>Redirecting to <a href="${escapeHtml(spaUrl)}">Home Fresh</a>...</p>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    res.status(200).send(html);
  }
);

// ============================================================
// 2. wechatJssdkSignature
// ============================================================
let tokenCache = {accessToken: null, expiresAt: 0};
let ticketCache = {ticket: null, expiresAt: 0};

async function getGlobalAccessToken(appid, secret) {
  const now = Date.now();
  if (tokenCache.accessToken && tokenCache.expiresAt > now) {
    return tokenCache.accessToken;
  }
  const url = "https://api.weixin.qq.com/cgi-bin/token" +
    `?grant_type=client_credential&appid=${appid}&secret=${secret}`;
  const resp = await fetch(url);
  const data = await resp.json();
  if (data.errcode) {
    logger.error("Failed to get WeChat access_token", data);
    throw new Error(`WeChat token error: ${data.errcode} ${data.errmsg}`);
  }
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + (data.expires_in - 300) * 1000,
  };
  return data.access_token;
}

async function getJsapiTicket(accessToken) {
  const now = Date.now();
  if (ticketCache.ticket && ticketCache.expiresAt > now) {
    return ticketCache.ticket;
  }
  const url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket" +
    `?access_token=${accessToken}&type=jsapi`;
  const resp = await fetch(url);
  const data = await resp.json();
  if (data.errcode !== 0) {
    logger.error("Failed to get jsapi_ticket", data);
    throw new Error(`jsapi_ticket error: ${data.errcode} ${data.errmsg}`);
  }
  ticketCache = {
    ticket: data.ticket,
    expiresAt: now + (data.expires_in - 300) * 1000,
  };
  return data.ticket;
}

function generateSignature(ticket, nonceStr, timestamp, url) {
  const str = `jsapi_ticket=${ticket}` +
    `&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
  return createHash("sha1").update(str).digest("hex");
}

export const wechatJssdkSignature = onRequest(
  {region: "us-central1", secrets: [WECHAT_APPID, WECHAT_SECRET]},
  async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
    res.setHeader("Vary", "Origin");
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Max-Age", "3600");
      res.status(204).end();
      return;
    }

    const url = req.query.url || req.body?.url;
    if (!url) {
      res.status(400).json({error: "url_required"});
      return;
    }

    const appid = WECHAT_APPID.value();
    const secret = WECHAT_SECRET.value();

    try {
      const accessToken = await getGlobalAccessToken(appid, secret);
      const ticket = await getJsapiTicket(accessToken);
      const nonceStr = Math.random().toString(36).substring(2, 15);
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = generateSignature(ticket, nonceStr, timestamp, url);

      res.status(200).json({appId: appid, timestamp, nonceStr, signature});
    } catch (err) {
      logger.error("JSSDK signature error", {error: err?.message});
      res.status(500).json({error: "signature_failed", message: err?.message});
    }
  }
);

// ============================================================
// 3. ogFoodImage — serves food images directly
//
// Firebase Storage URLs (firebasestorage.googleapis.com) are blocked
// in China. This function fetches the image server-side (Google Cloud
// internal network, no GFW) and serves the raw bytes through
// cloudfunctions.net which IS accessible from China.
// ============================================================
export const ogFoodImage = onRequest(
  {region: "us-central1"},
  async (req, res) => {
    const kitchenId = req.query.kitchenId;
    const foodId = req.query.foodId;

    if (!kitchenId || !foodId) {
      res.redirect(302, `${APP_URL}/favicon.svg`);
      return;
    }

    try {
      const data = await getFoodData(kitchenId, foodId);

      if (!data.foodImage) {
        logger.info("ogFoodImage: no image in Firestore");
        res.redirect(302, `${APP_URL}/favicon.svg`);
        return;
      }

      logger.info("ogFoodImage: fetching", {
        url: data.foodImage.substring(0, 100),
      });

      const imageRes = await fetch(data.foodImage);

      if (!imageRes.ok) {
        logger.error("ogFoodImage: storage fetch failed", {
          status: imageRes.status,
        });
        res.redirect(302, `${APP_URL}/favicon.svg`);
        return;
      }

      const buffer = Buffer.from(await imageRes.arrayBuffer());
      const contentType = imageRes.headers.get("content-type") ||
        "image/jpeg";

      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Length", buffer.length);
      res.setHeader("Cache-Control",
        "public, max-age=86400, s-maxage=604800");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).send(buffer);
    } catch (err) {
      logger.error("ogFoodImage error", {error: err?.message});
      res.redirect(302, `${APP_URL}/favicon.svg`);
    }
  }
);
