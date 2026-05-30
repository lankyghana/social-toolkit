import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, Link as LinkIcon, Loader2, AlertCircle, Play, CheckCircle2, Copy } from "lucide-react";
import axios from "axios";

interface TikTokResult {
  id: string;
  title: string;
  cover: string;
  origin_url: string;
  wm_url: string;
  author: {
    nickname: string;
    avatar: string;
  };
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

function AdSlot({ className, slot }: { className?: string; slot: string }) {
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ignore ad blocker or load errors.
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle${className ? ` ${className}` : ""}`}
      style={{ display: "block" }}
      data-ad-client="ca-pub-7048530393932855"
      data-ad-slot={slot}
      data-ad-format="autorelaxed"
    />
  );
}

export default function TikTokDownloader({ standalone = false }: { standalone?: boolean }) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TikTokResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post("/api/tiktok", { url });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong. Please check the URL and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  return (
    <div className="w-full space-y-8">
      {/* Search Section */}
      <motion.div 
        layout
        className="bg-brand-surface rounded-3xl border border-brand-border p-6 md:p-10 shadow-2xl"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            {standalone ? (
              <h1 className="text-2xl md:text-3xl font-bold">
                TikTok Video Downloader <span className="text-brand-primary">(No Watermark)</span>
              </h1>
            ) : (
              <h2 className="text-2xl md:text-3xl font-bold">
                TikTok Video Downloader <span className="text-brand-primary">(No Watermark)</span>
              </h2>
            )}
            <p className="text-gray-400 text-sm md:text-base">
              Download TikTok videos instantly in HD quality without watermark.
            </p>
          </div>

          {/* Ad Slot 1 (Near Input) */}
          <div className="h-20 bg-brand-dark/50 rounded-lg flex items-center justify-center border border-dashed border-gray-700">
            <AdSlot slot="5235133504" />
          </div>

          <form onSubmit={handleDownload} className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors">
              <LinkIcon size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Paste TikTok video link here..."
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              className="w-full h-14 bg-brand-dark border-2 border-brand-border rounded-xl pl-12 pr-32 outline-none focus:border-brand-primary transition-all text-white placeholder:text-gray-600"
            />
            <button 
              type="submit"
              disabled={isLoading || !url}
              className="absolute right-2 top-2 bottom-2 px-6 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:hover:bg-brand-primary text-brand-dark font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Download size={20} />
                  <span>Download</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm"
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Result Section */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-brand-surface rounded-3xl border border-brand-border p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative aspect-9/16 max-h-125 bg-brand-dark rounded-2xl overflow-hidden shadow-2xl mx-auto md:mx-0">
                <img src={result.cover} alt="Thumbnail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center text-brand-dark shadow-xl hover:scale-110 transition-transform cursor-pointer">
                    <Play size={32} fill="currentColor" />
                  </div>
                </div>
              </div>

              <div className="space-y-6 flex flex-col justify-center">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={result.author.avatar} alt={result.author.nickname} className="w-10 h-10 rounded-full border border-brand-border" />
                    <div>
                      <h4 className="font-bold text-white leading-none">{result.author.nickname}</h4>
                      <span className="text-gray-500 text-xs">TikTok Creator</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-200 line-clamp-3">{result.title}</h3>
                </div>

                <div className="flex flex-col gap-3">
                  <a 
                    href={result.origin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full h-14 bg-brand-primary hover:bg-brand-primary-hover text-brand-dark font-bold rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95"
                  >
                    <Download size={24} />
                    <span>Download (No Watermark)</span>
                  </a>
                  <a 
                    href={result.wm_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full h-14 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all"
                  >
                    <Download size={24} />
                    <span>Download (With Watermark)</span>
                  </a>
                </div>

                {/* Ad Slot 2 (After result) */}
                <div className="h-24 bg-brand-dark/50 rounded-lg flex items-center justify-center border border-dashed border-gray-700 mt-4">
                  <AdSlot slot="5235133504" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEO & Content Section (Only for standalone pages or when requested) */}
      <div className="space-y-12 pt-12 border-t border-brand-border">
        {/* How to use */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-center font-bold text-brand-primary">1</div>
            <h4 className="text-xl font-bold">Copy URL</h4>
            <p className="text-gray-400 text-sm">Open TikTok app or website and copy the link of the video you want to download.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-center font-bold text-brand-primary">2</div>
            <h4 className="text-xl font-bold">Paste URL</h4>
            <p className="text-gray-400 text-sm">Paste the video link into the search box at the top of this page.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-center font-bold text-brand-primary">3</div>
            <h4 className="text-xl font-bold">Download</h4>
            <p className="text-gray-400 text-sm">Click the "Download" button and wait for the file to be processed.</p>
          </div>
        </section>

        {/* Ad Slot 3 (Content Section) */}
        <div className="h-32 bg-brand-surface rounded-xl flex items-center justify-center border border-dashed border-gray-700">
          <AdSlot slot="5235133504" />
        </div>

        {/* SEO Content */}
        <article className="markdown-body">
          <h2>Why use LankyStocks TikTok Downloader?</h2>
          <p>
            LankyStocks Tools provides a seamless experience for creators who need to repurpose their content 
            across different platforms. Our TikTok downloader is designed to be fast, secure, and entirely free.
          </p>
          <ul>
            <li><strong>No Watermark:</strong> Get clean videos without the bouncing TikTok logo.</li>
            <li><strong>HD Quality:</strong> We fetch the highest possible resolution available for each video.</li>
            <li><strong>Unlimited Downloads:</strong> Use our tool as many times as you need, no hidden limits.</li>
            <li><strong>No Account Needed:</strong> We don't ask for your personal data or login details.</li>
          </ul>
          <p>
            Whether you're an influencer, a social media manager, or just someone who wants to save a cool video, 
            LankyStocks Tools is the ultimate utility platform for you.
          </p>
        </article>
      </div>
    </div>
  );
}
