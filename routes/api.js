const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { logEvent } = require("../utils/logger");
const { parseUserAgent } = require("../utils/deviceParser");

function clientIp(req) {
  // Render's proxy sets X-Forwarded-For. Express trust proxy is enabled in production.
  return req.ip || req.socket.remoteAddress || "Unknown";
}
function eventBase(req, body) {
  const parsed = parseUserAgent(req.get("user-agent") || "");
  const salt = process.env.ANALYTICS_SALT || process.env.SESSION_SECRET || "local-only";
  const rawIp = clientIp(req);
  const ipHash = crypto.createHmac("sha256", salt).update(rawIp).digest("hex").slice(0, 20);
  return {
    ip: rawIp,
    ipHash,
    ...parsed,
    visitorId: String(body.visitorId || "").slice(0, 80),
    screenResolution: String(body.screenResolution || "Unknown").slice(0, 40),
    viewport: String(body.viewport || "Unknown").slice(0, 40),
    language: String(body.language || req.get("accept-language") || "Unknown").slice(0, 80),
    timezone: String(body.timezone || "Unknown").slice(0, 80),
    referrer: String(body.referrer || "Direct").slice(0, 300)
  };
}
router.post("/log-visit", (req, res) => {
  const e = logEvent({ type: "visit", ...eventBase(req, req.body || {}) });
  res.status(201).json({ ok: true, id: e.id });
});
router.post("/log-click", (req, res) => {
  const { response, noClickCount } = req.body || {};
  if (!["yes", "no"].includes(response)) return res.status(400).json({ ok: false });
  const e = logEvent({
    type: "click", response,
    noClickCount: Math.max(0, Math.min(10000, Number(noClickCount) || 0)),
    ...eventBase(req, req.body || {})
  });
  res.status(201).json({ ok: true, id: e.id });
});
module.exports = router;