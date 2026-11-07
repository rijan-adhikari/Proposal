async function send(path, password) {
  const r = await fetch("/admin/" + path, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({password}) });
  const data = await r.json(); if (!r.ok) throw new Error(data.error || "Request failed"); return data;
}
(async () => {
  const setup = await fetch("/admin/setup-status").then(r=>r.json());
  const form = document.getElementById("login");
  const heading = document.querySelector("h1");
  const intro = document.querySelector(".muted");
  const label = document.querySelector("label");
  const button = form.querySelector("button");
  const error = document.getElementById("error");
  if (setup.setupRequired) {
    heading.textContent = "Create your admin password.";
    intro.textContent = "First visit only. Choose a strong password with at least 12 characters.";
    label.textContent = "New admin password";
    button.innerHTML = "Create secure admin login <span>→</span>";
  }
  form.addEventListener("submit", async e => {
    e.preventDefault(); error.textContent = "";
    try {
      const password = document.getElementById("password").value;
      await send(setup.setupRequired ? "setup" : "login", password);
      location.href = "/admin";
    } catch (err) { error.textContent = err.message; }
  });
})();