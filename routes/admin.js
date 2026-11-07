const express = require("express");
const path = require("path");
const { timingSafeEqual } = require("crypto");
const { readEvents, getStats } = require("../utils/logger");
const router = express.Router();
const adminFile = path.join(__dirname, "..", "public", "admin");
function safeEqual(a, b) {
  const aa = Buffer.from(String(a)); const bb = Buffer.from(String(b));
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.status(401).json({ ok: false, error: "Not authenticated" });
}
router.get("/", (req, res) => res.sendFile(path.join(adminFile, req.session?.isAdmin ? "dashboard.html" : "login.html")));
router.post("/login", express.json(), (req, res) => {
  if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ ok: false, error: "Admin password is not configured." });
  if (!safeEqual(req.body?.password || "", process.env.ADMIN_PASSWORD)) return res.status(401).json({ ok: false, error: "Incorrect password." });
  req.session.regenerate(err => {
    if (err) return res.status(500).json({ ok: false });
    req.session.isAdmin = true;
    res.json({ ok: true });
  });
});
router.post("/logout", requireAuth, (req, res) => req.session.destroy(() => res.json({ ok: true })));
router.get("/api/data", requireAuth, (req, res) => res.json({ ok: true, stats: getStats(), events: readEvents().slice().reverse() }));
router.get("/api/export", requireAuth, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", "attachment; filename=proposal-analytics.json");
  res.send(JSON.stringify(readEvents(), null, 2));
});
module.exports = router;