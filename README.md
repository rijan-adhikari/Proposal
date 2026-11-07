# Proposal — Rijan × Pranisha

A standalone Node.js + Express proposal website and private analytics dashboard.

## Deploy on Render (Free Web Service)

1. Create a **New Web Service** in Render and connect `rijan-adhikari/Proposal`.
2. Runtime: Node. Build command: `npm install`. Start command: `npm start`.
3. Select the Free instance.
4. Add environment variables:
   - `ADMIN_PASSWORD`: a long, unique admin password.
   - `SESSION_SECRET`: a long random secret (32+ characters).
   - `ANALYTICS_SALT`: another random secret for IP hash calculation.
   - `NODE_ENV`: `production`.
5. Deploy. Open `https://YOUR-SERVICE.onrender.com/admin` to sign in.

## Analytics and privacy

The site asks visitors to opt in before analytics are sent. If they opt in, the server records IP address, a keyed IP hash, browser/OS/device category, screen size, language, timezone, referrer, visits and YES/NO interactions. The browser ID is a random localStorage identifier, not a covert hardware fingerprint. Do not use these records to identify, pressure or contact someone; respect a visitor's choice not to participate.

## Free-tier storage warning

Render Free Web Services do not provide persistent disks. The JSON event file is stored on the service's ephemeral filesystem and can be lost when the instance restarts, spins down or is redeployed. Export the JSON from the admin dashboard if you need a copy. This project deliberately has no external database or storage provider.

## Local development

```bash
npm install
cp .env.example .env
# Set ADMIN_PASSWORD and SESSION_SECRET in .env
npm run dev
```

Open `http://localhost:10000` and `http://localhost:10000/admin`.

## Personalize

- Add a photo you have permission to use at `public/assets/pranisha.jpg`.
- Add an audio file you have permission to use at `public/assets/romantic-bgm.mp3`.
- Replace the proposal wording in `public/index.html` if desired.

No personal or banking information belongs in this repository.