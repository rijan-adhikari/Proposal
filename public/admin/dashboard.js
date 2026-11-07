const $ = id => document.getElementById(id);
function esc(v) { return String(v ?? "—").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
async function load() {
  try {
    const r = await fetch("/admin/api/data"); if (r.status === 401) return location.href = "/admin";
    const d = await r.json(); $("visits").textContent = d.stats.totalVisits; $("unique").textContent = d.stats.uniqueVisitors;
    $("yes").textContent = d.stats.totalYes; $("no").textContent = d.stats.totalNo;
    $("updated").textContent = "Updated " + new Date().toLocaleTimeString();
    $("events").innerHTML = d.events.length ? d.events.map(e => `<tr><td>${esc(new Date(e.timestamp).toLocaleString())}</td><td>${esc(e.type)}</td><td>${esc(e.response || "—")}</td><td>${esc(e.ip)}</td><td>${esc(e.deviceType)}</td><td>${esc(e.browser)}</td><td>${esc(e.os)}</td><td>${esc(e.screenResolution)}</td><td>${esc(e.timezone)}</td></tr>`).join("") : '<tr><td colspan="9" class="empty">No visits yet.</td></tr>';
  } catch { $("updated").textContent = "Could not refresh"; }
}
$("logout").addEventListener("click", async () => { await fetch("/admin/logout",{method:"POST"}); location.href="/admin"; });
load(); setInterval(load, 15000);