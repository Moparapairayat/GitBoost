"use client";

import Link from "next/link";
import { useState } from "react";
import { Zap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/utils/cn";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#stats",    label: "Stats" },
  { href: "#pricing",  label: "Pricing" },
  { href: "#faq",      label: "FAQ" },
];

export default function LandingNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5" id="landing-logo">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-brand)" }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold">{APP_NAME}</span>
          </Link>

          {/* Center links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} id={`landing-nav-${link.label.toLowerCase()}`}
                className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link href="/dashboard" id="landing-dashboard-btn"
                className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02]"
                style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}>
                Dashboard
              </Link>
            ) : (
              <Link href="/auth/signin" id="landing-signin-btn"
                className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02]"
                style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}>
                Sign in
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(o => !o)}
              id="landing-mobile-menu-btn"
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 glass-strong md:hidden overflow-hidden"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
