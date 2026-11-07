# Proposal — Rijan × Pranisha

A standalone Node.js + Express proposal website and private analytics dashboard.

## Deploy on Render Free

1. Create a **New Web Service** and connect `rijan-adhikari/Proposal`.
2. Runtime: Node. Build command: `npm install`. Start command: `npm start`.
3. Select the **Free** instance and deploy. No environment variables are required.
4. Open `https://YOUR-SERVICE.onrender.com/admin`.
5. On first visit, create an admin password (12+ characters). Save it somewhere safe.

The session-signing secret is generated automatically when the service starts. Admin sessions expire when the service restarts, so sign in again if needed.

## Analytics and privacy

The page asks visitors to opt in before analytics are sent. If they opt in, the server records IP address, a keyed IP hash, browser/OS/device category, screen size, language, timezone, referrer, visits and YES/NO interactions. The browser ID is a random localStorage identifier, not a covert hardware fingerprint. Do not use these records to identify, pressure or contact someone; respect a visitor's choice not to participate.

## Free-tier storage warning

Render Free Web Services do not provide persistent disks. Visitor events and the admin password hash are stored on the service's ephemeral filesystem and can be lost when the instance restarts, spins down or is redeployed. If that happens, analytics history may be lost and you may need to create the admin password again. Export the JSON from the admin dashboard regularly.

## Personalize

- Add a photo you have permission to use at `public/assets/pranisha.jpg`.
- Add audio you have permission to use at `public/assets/romantic-bgm.mp3`.
- Update proposal wording in `public/index.html`.

No external database, storage provider, or third-party hosting is used.