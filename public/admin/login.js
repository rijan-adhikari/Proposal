document.getElementById("login").addEventListener("submit", async e => {
  e.preventDefault(); const error = document.getElementById("error"); error.textContent = "";
  try {
    const r = await fetch("/admin/login", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({password:document.getElementById("password").value}) });
    const data = await r.json(); if (!r.ok) throw new Error(data.error || "Sign-in failed");
    location.href = "/admin";
  } catch (err) { error.textContent = err.message; }
});