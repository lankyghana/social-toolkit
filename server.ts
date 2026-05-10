import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(express.json({ limit: "10kb" }));

  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Frame-Options", "DENY");
    next();
  });

  const rateLimitWindowMs = 60_000;
  const rateLimitMax = 30;
  const rateLimitStore = new Map<string, { count: number; windowStart: number }>();

  function isRateLimited(key: string) {
    const now = Date.now();
    const record = rateLimitStore.get(key);
    if (!record || now - record.windowStart > rateLimitWindowMs) {
      rateLimitStore.set(key, { count: 1, windowStart: now });
      return false;
    }
    record.count += 1;
    return record.count > rateLimitMax;
  }

  function isValidTikTokUrl(input: string) {
    try {
      const parsed = new URL(input);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        return false;
      }
      const host = parsed.hostname.toLowerCase();
      const allowedHosts = new Set([
        "tiktok.com",
        "www.tiktok.com",
        "m.tiktok.com",
        "vm.tiktok.com",
        "vt.tiktok.com",
      ]);
      return allowedHosts.has(host);
    } catch {
      return false;
    }
  }

  // API Route for TikTok
  app.post("/api/tiktok", async (req, res) => {
    const { url } = req.body;

    if (!url) {
       res.status(400).json({ error: "TikTok URL is required" });
       return;
    }

    if (typeof url !== "string" || url.length > 2048) {
      res.status(400).json({ error: "Invalid TikTok URL" });
      return;
    }

    const clientKey = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() || req.ip;
    if (isRateLimited(clientKey)) {
      res.status(429).json({ error: "Too many requests. Please try again later." });
      return;
    }

    // Basic TikTok URL validation
    if (!isValidTikTokUrl(url)) {
       res.status(400).json({ error: "Invalid TikTok URL" });
       return;
    }

    try {
      console.log(`Processing TikTok URL: ${url}`);
      
      // Using TikWM API as it's reliable for no-watermark downloads
      // Note: In production, consider a more robust/paid solution if traffic is high
      const response = await axios.post(
        "https://www.tikwm.com/api/",
        new URLSearchParams({
          url: url,
          hd: "1",
        }),
        { timeout: 10_000 }
      );

      const data = response.data;

      if (data.code === 0 && data.data) {
        const videoData = data.data;
        res.json({
          id: videoData.id,
          title: videoData.title,
          cover: videoData.cover,
          origin_url: videoData.play, // This is usually the no-watermark link
          wm_url: videoData.wmplay,
          music: videoData.music,
          author: videoData.author
        });
      } else {
        console.error("TikWM API Error:", data.msg);
        res.status(500).json({ error: data.msg || "Failed to extract video data" });
      }
    } catch (error: any) {
      console.error("Error fetching TikTok data:", error.message);
      res.status(500).json({ error: "Server error while processing request" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
