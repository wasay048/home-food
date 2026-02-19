// ============================================================
// OG Share Functions — completely independent from exchangeWeChatCode
//
// This file exports two Firebase Cloud Functions:
//
// 1. ogMetaProxy     — Serves dynamic Open Graph meta tags for social
//                       media crawlers (WeChat, Facebook, Twitter, etc.)
//                       so shared links show rich previews.
//
// 2. wechatJssdkSignature — Generates WeChat JS-SDK config signatures
//                           so the frontend can call wx.updateAppMessageShareData()
//                           to customize the share card inside WeChat's in-app browser.
// ============================================================

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {defineSecret} from "firebase-functions/params";
import {initializeApp, getApps} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {createHash} from "crypto";

// Initialize Firebase Admin (safe to call multiple times — checks first)
if (getApps().length === 0) {
  initializeApp();
}
const db = getFirestore();

// Secrets (same names as index.js but resolved independently per function)
const WECHAT_APPID = defineSecret("WECHAT_APPID");
const WECHAT_SECRET = defineSecret("WECHAT_SECRET");

const ALLOW_ORIGIN = "https://www.homefreshfoods.ai";
const APP_URL = "https://www.homefreshfoods.ai";

// ============================================================
// 1. ogMetaProxy
// ============================================================
const CRAWLER_UA_PATTERN = /micromessenger|facebookexternalhit|twitterbot|telegrambot|slackbot|linkedinbot|whatsapp|googlebot|bingbot|yandex|baiduspider|duckduckbot|discordbot/i;

function isCrawler(userAgent) {
  return CRAWLER_UA_PATTERN.test(userAgent || "");
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
    const spaParams = new URLSearchParams({kitchenId: kitchenId || "", foodId: foodId || ""});
    if (dateParam) spaParams.set("date", dateParam);
    if (toggleParam) spaParams.set("toggle", toggleParam);
    const spaUrl = `${APP_URL}/share?${spaParams.toString()}`;

    logger.info("ogMetaProxy hit", {
      ua: ua.substring(0, 100),
      isCrawler: isCrawler(ua),
      kitchenId,
      foodId,
    });

    // For non-crawler requests, redirect to the SPA
    if (!isCrawler(ua)) {
      res.redirect(302, spaUrl);
      return;
    }

    // --- Crawler path: fetch data from Firestore and serve OG tags ---
    let foodName = "Home Fresh";
    let foodImage = `${APP_URL}/favicon.svg`;
    let kitchenName = "HomeFresh";

    try {
      if (foodId) {
        let foodDoc = null;

        if (kitchenId) {
          // First try: food as a subcollection document under the kitchen
          const foodRef = db.collection("kitchens").doc(kitchenId).collection("foodItems").doc(foodId);
          foodDoc = await foodRef.get();

          // If not found in subcollection, try top-level foods collection
          if (!foodDoc.exists) {
            const topLevelRef = db.collection("foods").doc(foodId);
            foodDoc = await topLevelRef.get();
          }

          // Also fetch kitchen data for the kitchen name
          const kitchenDoc = await db.collection("kitchens").doc(kitchenId).get();
          if (kitchenDoc.exists) {
            const kd = kitchenDoc.data();
            kitchenName = kd.kitchenName || kd.name || kitchenName;
          }
        }

        if (foodDoc && foodDoc.exists) {
          const fd = foodDoc.data();
          foodName = fd.name || fd.foodName || foodName;
          foodImage = fd.imageUrl || (fd.imageUrls && fd.imageUrls[0]) || foodImage;
        }
      }
    } catch (err) {
      logger.error("ogMetaProxy Firestore error", {error: err?.message});
      // Continue with defaults — better to show a generic preview than fail
    }

    // Title = food name, Description = "Check out on HomeFresh from {kitchen}"
    const ogTitle = escapeHtml(foodName);
    const ogDesc = `Check out on HomeFresh from ${escapeHtml(kitchenName)}`;

    // Serve minimal HTML with OG meta tags
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${ogTitle} | Home Fresh</title>
  <meta name="description" content="${ogDesc}" />
  <!-- Open Graph -->
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${ogDesc}" />
  <meta property="og:image" content="${escapeHtml(foodImage)}" />
  <meta property="og:url" content="${escapeHtml(spaUrl)}" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="Home Fresh - 美味鲜到家" />
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${ogTitle}" />
  <meta name="twitter:description" content="${ogDesc}" />
  <meta name="twitter:image" content="${escapeHtml(foodImage)}" />
  <!-- Redirect real visitors to the SPA -->
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

// In-memory cache for access_token and jsapi_ticket
let tokenCache = {accessToken: null, expiresAt: 0};
let ticketCache = {ticket: null, expiresAt: 0};

async function getGlobalAccessToken(appid, secret) {
  const now = Date.now();
  if (tokenCache.accessToken && tokenCache.expiresAt > now) {
    return tokenCache.accessToken;
  }

  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.errcode) {
    logger.error("Failed to get WeChat access_token", data);
    throw new Error(`WeChat token error: ${data.errcode} ${data.errmsg}`);
  }

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + (data.expires_in - 300) * 1000, // refresh 5min early
  };

  return data.access_token;
}

async function getJsapiTicket(accessToken) {
  const now = Date.now();
  if (ticketCache.ticket && ticketCache.expiresAt > now) {
    return ticketCache.ticket;
  }

  const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`;
  const res = await fetch(url);
  const data = await res.json();

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
  const str = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
  return createHash("sha1").update(str).digest("hex");
}

export const wechatJssdkSignature = onRequest(
  {region: "us-central1", secrets: [WECHAT_APPID, WECHAT_SECRET]},
  async (req, res) => {
    // CORS
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

      res.status(200).json({
        appId: appid,
        timestamp,
        nonceStr,
        signature,
      });
    } catch (err) {
      logger.error("JSSDK signature error", {error: err?.message});
      res.status(500).json({error: "signature_failed", message: err?.message});
    }
  }
);
