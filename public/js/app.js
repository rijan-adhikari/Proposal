(() => {
  const $ = id => document.getElementById(id);
  const no = $("no"), yes = $("yes"), tease = $("tease");
  const lines = ["No? That's a plot twist 😭", "Are you sure? I made this page and everything 🥹", "The YES button looks lonely…", "Objection: too cute to reject? 😂", "I'll ask again with extra sparkle ✨", "That button has places to be, apparently 💨"];
  let noCount = 0;
  let visitorId = localStorage.getItem("proposalVisitorId");
  if (!visitorId) { visitorId = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()); localStorage.setItem("proposalVisitorId", visitorId); }
  const meta = () => ({
    visitorId, screenResolution: screen.width + "x" + screen.height,
    viewport: innerWidth + "x" + innerHeight, language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, referrer: document.referrer || "Direct"
  });
  async function log(path, extra = {}) {
    try { await fetch("/api/" + path, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...meta(),...extra})}); } catch {}
  }
  const consent = $("consent");
  const choice = localStorage.getItem("proposalAnalyticsConsent");
  if (!choice) consent.hidden = false;
  else if (choice === "yes") log("log-visit");
  $("accept").addEventListener("click", () => { localStorage.setItem("proposalAnalyticsConsent","yes"); consent.hidden = true; log("log-visit"); });
  $("decline").addEventListener("click", () => { localStorage.setItem("proposalAnalyticsConsent","no"); consent.hidden = true; });

  document.querySelectorAll(".photo-wrap img").forEach(img => {
    const show = () => img.classList.add("loaded");
    img.addEventListener("load", show);
    if (img.complete && img.naturalWidth > 0) show();
  });

  function moveNo() {
    noCount++;
    tease.textContent = lines[(noCount - 1) % lines.length];
    yes.style.transform = "scale(" + Math.min(1.22, 1 + noCount * .025) + ")";
    const area = no.parentElement.getBoundingClientRect();
    const maxX = Math.max(0, area.width - no.offsetWidth);
    const maxY = 54;
    no.classList.add("roaming");
    no.style.left = Math.round(Math.random() * maxX) + "px";
    no.style.top = Math.round((Math.random() - .5) * maxY) + "px";
    if (localStorage.getItem("proposalAnalyticsConsent") === "yes") log("log-click",{response:"no",noClickCount:noCount});
  }
  no.addEventListener("mouseenter", moveNo);
  no.addEventListener("click", moveNo);
  no.addEventListener("touchstart", e => { e.preventDefault(); moveNo(); }, {passive:false});
  yes.addEventListener("click", () => {
    if (localStorage.getItem("proposalAnalyticsConsent") === "yes") log("log-click",{response:"yes",noClickCount:noCount});
    $("ending").hidden = false;
    $("ending").scrollIntoView({behavior:"smooth"});
    document.querySelector(".question").style.display = "none";
    document.querySelector(".hero").style.display = "none";
    document.querySelector(".gallery-section").style.display = "none";
    document.querySelector(".letter-section").style.display = "none";
    for(let i=0;i<34;i++){const h=document.createElement("span");h.textContent="♥";h.className="heart";h.style.left=Math.random()*100+"%";h.style.animationDuration=(5+Math.random()*7)+"s";h.style.fontSize=(12+Math.random()*20)+"px";layer.append(h);}
  });
  const layer = document.querySelector(".hearts");
  for(let i=0;i<18;i++){const h=document.createElement("span");h.className="heart";h.textContent=["♡","♥","✦"][i%3];h.style.left=Math.random()*100+"%";h.style.animationDuration=(10+Math.random()*12)+"s";h.style.animationDelay=(-Math.random()*18)+"s";h.style.fontSize=(12+Math.random()*18)+"px";layer.append(h);}
  // Try audible autoplay on arrival. iOS Safari may block it until a real user gesture.
  const audio = $("audio");
  let audioStarted = false;
  async function startMusic() {
    if (audioStarted || !audio) return;
    try {
      await audio.play();
      audioStarted = true;
      document.removeEventListener("pointerdown", startMusic, true);
      document.removeEventListener("touchstart", startMusic, true);
      document.removeEventListener("scroll", startMusic, true);
      document.removeEventListener("keydown", startMusic, true);
    } catch {
      // Retry on the visitor's first interaction, as required by iOS autoplay policy.
    }
  }
  startMusic();
  ["pointerdown","touchstart","scroll","keydown"].forEach(type => {
    document.addEventListener(type, startMusic, {capture:true,passive:true});
  });
})();