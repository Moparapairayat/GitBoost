"use client";

import Link from "next/link";
import { Zap, GitBranch, X as XIcon } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const links = {
  platform: [
    { label: "Explore Trending", href: "/explore/trending" },
    { label: "Latest Projects", href: "/explore/latest" },
    { label: "Discover Developers", href: "/developers" },
    { label: "Submit Repository", href: "/repositories/submit" },
  ],
  company: [
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Changelog", href: "/changelog" },
    { label: "Status", href: "/status" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="border-t py-16 px-4 sm:px-6 lg:px-8" style={{ borderColor: "hsl(var(--border))" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4" id="footer-logo">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-brand)" }}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold">{APP_NAME}</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mb-5">
              The developer community platform for discovering quality open-source projects, building genuine reputation, and growing organically.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" id="footer-github"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                aria-label="GitHub">
              <GitBranch className="w-4 h-4" />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" id="footer-twitter"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                aria-label="Twitter">
              <XIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4">Platform</p>
            <ul className="space-y-2.5">
              {links.platform.map(l => (
                <li key={l.href}>
                  <Link href={l.href} id={`footer-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4">Company</p>
            <ul className="space-y-2.5">
              {links.company.map(l => (
                <li key={l.href}>
                  <Link href={l.href} id={`footer-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4">Legal</p>
            <ul className="space-y-2.5">
              {links.legal.map(l => (
                <li key={l.href}>
                  <Link href={l.href} id={`footer-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--border))" }}>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. Built for open-source developers.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            No fake stars. No bots. Just genuine growth.
            <Zap className="w-3 h-3" style={{ color: "hsl(var(--primary))" }} />
          </p>
        </div>
      </div>
    </footer>
  );
}
