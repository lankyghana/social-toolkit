import { describe, it, expect } from "vitest";

describe("TikTok API", () => {
  it("should reject requests without URL", async () => {
    const response = await fetch("http://localhost:3000/api/tiktok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(response.status).toBe(400);
  });

  it("should reject invalid URLs", async () => {
    const response = await fetch("http://localhost:3000/api/tiktok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://example.com" }),
    });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  it("should reject URLs longer than 2048 characters", async () => {
    const longUrl = "https://www.tiktok.com/" + "a".repeat(2100);
    const response = await fetch("http://localhost:3000/api/tiktok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: longUrl }),
    });
    expect(response.status).toBe(400);
  });

  it("should accept valid TikTok URLs", async () => {
    const validUrls = [
      "https://www.tiktok.com/@user/video/123456",
      "https://m.tiktok.com/v/123456",
      "https://vm.tiktok.com/123456",
      "https://vt.tiktok.com/123456",
    ];

    for (const url of validUrls) {
      const response = await fetch("http://localhost:3000/api/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      expect([200, 502, 504]).toContain(response.status);
    }
  }, 30000);
});
