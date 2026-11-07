const fs = require("fs");
const path = require("path");
const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "visitors.json");

function readEvents() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch { return []; }
}
function writeEvents(events) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const temp = DATA_FILE + ".tmp";
  fs.writeFileSync(temp, JSON.stringify(events, null, 2), { mode: 0o600 });
  fs.renameSync(temp, DATA_FILE);
}
function logEvent(data) {
  const events = readEvents();
  const event = { id: require("crypto").randomUUID(), timestamp: new Date().toISOString(), ...data };
  events.push(event);
  writeEvents(events.slice(-5000));
  console.log(`[analytics] ${event.type} ${event.response || ""} ${event.timestamp}`);
  return event;
}
function getStats() {
  const events = readEvents();
  const visits = events.filter(e => e.type === "visit");
  const clicks = events.filter(e => e.type === "click");
  return {
    totalVisits: visits.length,
    uniqueVisitors: new Set(visits.map(e => e.visitorId).filter(Boolean)).size,
    totalYes: clicks.filter(e => e.response === "yes").length,
    totalNo: clicks.filter(e => e.response === "no").length,
    deviceBreakdown: visits.reduce((a,e) => ((a[e.deviceType || "Unknown"]=(a[e.deviceType || "Unknown"]||0)+1),a), {}),
    browserBreakdown: visits.reduce((a,e) => ((a[e.browser || "Unknown"]=(a[e.browser || "Unknown"]||0)+1),a), {}),
    lastEvent: events.length ? events[events.length - 1] : null
  };
}
module.exports = { logEvent, readEvents, getStats };