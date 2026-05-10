# LankyStocks Tools

Fast, free social media utility tools for creators and users, starting with a TikTok video downloader.

## Run Locally

**Prerequisites:** Node.js 18+ (20.x recommended)

1. Install dependencies:
   `npm install`
2. Run the dev server (API + Vite middleware):
   `npm run dev`

## Production

1. Install dependencies:
   `npm install`
2. Build the client:
   `npm run build`
3. Start the server (serves the API and `dist/`):
   `npm run start`

## Deployment Notes (cPanel Node.js App)

- Set the startup file to `server.ts`.
- Run `npm install` and `npm run build` before restarting the app.
- Ensure the app root is the folder containing `package.json`.
"# social-toolkit" 
