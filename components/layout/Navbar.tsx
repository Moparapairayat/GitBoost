"use client";

import { useState } from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Search, Menu, X, ChevronDown,
  LayoutDashboard, Code2, TrendingUp,
  Settings, LogOut, User, Shield
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import type { Tables } from "@/types/database.types";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type ProfileSnippet = Pick<
  Tables<"profiles">,
  "id" | "username" | "display_name" | "avatar_url" | "role" | "xp" | "level"
>;

interface NavbarProps {
  profile?: ProfileSnippet | null;
}

const NAV_LINKS = [
  { href: "/explore/trending", label: "Trending", icon: TrendingUp },
  { href: "/explore/latest",   label: "Latest",   icon: Code2 },
  { href: "/developers",       label: "Developers", icon: User },
];

export function Navbar({ profile }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Supabase not configured
    }
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href={profile ? "/dashboard" : "/"} className="flex items-center gap-2.5 flex-shrink-0" id="nav-logo">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-brand)" }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold hidden sm:block">GitBoost</span>
          </Link>

          {/* Center nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                id={`nav-${link.label.toLowerCase()}`}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname.startsWith(link.href)
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              id="nav-search-btn"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Search className="w-4 h-4" />
            </button>

            <ThemeToggle />

            {profile ? (
              <>
                {/* Notifications */}
                <NotificationBell />

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(o => !o)}
                    id="nav-profile-btn"
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-all"
                  >
                    {profile.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatar_url}
                        alt={profile.display_name ?? profile.username}
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: "var(--gradient-brand)", color: "white" }}>
                        {(profile.display_name ?? profile.username).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform", profileOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 rounded-xl py-1 z-20 shadow-xl"
                          style={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }}
                        >
                          <div className="px-4 py-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                            <p className="text-sm font-semibold">{profile.display_name ?? profile.username}</p>
                            <p className="text-xs text-muted-foreground">@{profile.username} · Lv.{profile.level}</p>
                          </div>

                          {[
                            { href: `/developers/${profile.username}`, label: "Your Profile", icon: User },
                            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
                            { href: "/repositories/submit", label: "Submit Repo", icon: Code2 },
                            { href: "/dashboard/settings", label: "Settings", icon: Settings },
                            ...(profile.role === "admin" ? [{ href: "/admin", label: "Admin Panel", icon: Shield }] : []),
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              id={`nav-dropdown-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                              <item.icon className="w-4 h-4" />
                              {item.label}
                            </Link>
                          ))}

                          <div className="border-t mt-1 pt-1" style={{ borderColor: "hsl(var(--border))" }}>
                            <button
                              onClick={handleSignOut}
                              id="nav-signout-btn"
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link
                href="/auth/signin"
                id="nav-signin-btn"
                className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-semibold transition-all"
                style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
              >
                Sign in
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              id="nav-mobile-menu-btn"
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 glass-strong md:hidden overflow-hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    pathname.startsWith(link.href)
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal placeholder */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4"
            >
              <form
                action="/search"
                className="flex items-center gap-3 h-14 px-5 rounded-2xl shadow-2xl"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              >
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  autoFocus
                  name="q"
                  type="text"
                  placeholder="Search repositories, developers…"
                  id="search-input"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs rounded-md"
                  style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
                  Esc
                </kbd>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
