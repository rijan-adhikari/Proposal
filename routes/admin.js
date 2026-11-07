const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const router = express.Router();
const { readEvents, getStats } = require("../utils/logger");
const adminFile = path.join(__dirname, "..", "public", "admin");
const dataDir = path.join(__dirname, "..", "data");
const credentialFile = path.join(dataDir, "admin.json");

function getCredential() {
  try { return JSON.parse(fs.readFileSync(credentialFile, "utf8")); }
  catch { return null; }
}
function saveCredential(password) {
  fs.mkdirSync(dataDir, { recursive: true });
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  fs.writeFileSync(credentialFile, JSON.stringify({ salt, hash, createdAt: new Date().toISOString() }), { mode: 0o600 });
}
function validPassword(password, credential) {
  if (!credential || typeof password !== "string") return false;
  const actual = crypto.scryptSync(password, credential.salt, 64);
  const expected = Buffer.from(credential.hash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}
function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.status(401).json({ ok: false, error: "Not authenticated" });
}
router.get("/", (req, res) => res.sendFile(path.join(adminFile, req.session?.isAdmin ? "dashboard.html" : "login.html")));
router.get("/setup-status", (req, res) => res.json({ setupRequired: !getCredential() }));
router.post("/setup", (req, res) => {
  if (getCredential()) return res.status(409).json({ ok: false, error: "Admin account is already configured." });
  const password = req.body?.password;
  if (typeof password !== "string" || password.length < 12 || password.length > 200) {
    return res.status(400).json({ ok: false, error: "Choose a password of at least 12 characters." });
  }
  saveCredential(password);
  req.session.regenerate(err => {
    if (err) return res.status(500).json({ ok: false });
    req.session.isAdmin = true;
    res.json({ ok: true });
  });
});
router.post("/login", (req, res) => {
  const credential = getCredential();
  if (!credential) return res.status(409).json({ ok: false, error: "Set up your admin password first." });
  if (!validPassword(req.body?.password, credential)) return res.status(401).json({ ok: false, error: "Incorrect password." });
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