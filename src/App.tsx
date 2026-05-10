/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Download, Calculator, Instagram, MessageCircle, Home, Menu, X, ArrowRight, CheckCircle2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import TikTokDownloader from "./components/TikTokDownloader";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Layout Component
function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-brand-dark/80 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-bold text-brand-dark transition-transform group-hover:scale-110">
                LS
              </div>
              <span className="text-xl font-bold tracking-tight">
                LankyStocks <span className="text-brand-primary">Tools</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className={cn("text-sm font-medium transition-colors hover:text-brand-primary", location.pathname === "/" ? "text-brand-primary" : "text-gray-400")}>Home</Link>
              <Link to="/tiktok-downloader" className={cn("text-sm font-medium transition-colors hover:text-brand-primary", location.pathname === "/tiktok-downloader" ? "text-brand-primary" : "text-gray-400")}>TikTok Downloader</Link>
              <a href="https://lankystocks.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-400 hover:text-brand-primary">Visit Main Site</a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-brand-border bg-brand-dark px-4 py-4 space-y-3"
            >
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-medium text-gray-300 hover:text-brand-primary"
              >
                Home
              </Link>
              <Link 
                to="/tiktok-downloader" 
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-medium text-gray-300 hover:text-brand-primary"
              >
                TikTok Downloader
              </Link>
              <a 
                href="https://lankystocks.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-lg font-medium text-gray-300 hover:text-brand-primary"
              >
                Visit Site
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark border-t border-brand-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">LankyStocks Tools</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Free, fast, and secure utility tools for content creators and social media enthusiasts. 
                Helping you grow your presence with ease.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-brand-primary text-sm transition-colors">Home</Link></li>
                <li><Link to="/tiktok-downloader" className="text-gray-400 hover:text-brand-primary text-sm transition-colors">TikTok Downloader</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-brand-primary text-sm transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h4>
              <p className="text-gray-400 text-sm mb-4">Have questions? Reach out to us on our main platform.</p>
              <a href="https://lankystocks.com/contact" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand-primary font-medium hover:underline">
                Contact Us <ArrowRight size={16} />
              </a>
            </div>
          </div>
          <div className="pt-8 border-t border-brand-border text-center text-gray-500 text-xs">
            © {new Date().getFullYear()} LankyStocks Tools. All rights reserved. Not affiliated with TikTok or ByteDance.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Home Page
function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4"
        >
          Free Social Media <span className="text-brand-primary">Tools</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
        >
          Boost your social media productivity with our suite of free, no-login utility tools.
        </motion.p>
      </div>

      {/* Main Tool Section */}
      <section className="mb-20">
        <TikTokDownloader standalone={false} />
      </section>

      {/* Coming Soon Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-brand-surface rounded-2xl border border-brand-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4">
             <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Coming Soon</span>
          </div>
          <Instagram className="w-10 h-10 text-gray-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Instagram Reel Downloader</h3>
          <p className="text-gray-400 text-sm">Download your favorite Instagram Reels in high definition with a single click.</p>
        </div>

        <div className="p-8 bg-brand-surface rounded-2xl border border-brand-border relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4">
             <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Coming Soon</span>
          </div>
          <Calculator className="w-10 h-10 text-gray-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Engagement Rate Calculator</h3>
          <p className="text-gray-400 text-sm">Analyze your profile's performance and see how users interact with your content.</p>
        </div>
      </section>
    </div>
  );
}

// TikTok Downloader Page
function TikTokPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <TikTokDownloader standalone={true} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tiktok-downloader" element={<TikTokPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

