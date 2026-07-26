"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Code2, Users, Star, AlertCircle, GitBranch } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { APP_NAME } from "@/lib/constants";

interface SignInClientProps {
  redirectTo?: string;
  error?: string;
}

const features = [
  { icon: Code2, text: "Discover quality open-source projects" },
  { icon: Star, text: "Receive genuine peer reviews" },
  { icon: Users, text: "Connect with the developer community" },
  { icon: Zap, text: "Grow your reputation organically" },
];

export default function SignInClient({ redirectTo, error }: SignInClientProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGitHubSignIn() {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const redirectURL =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback${redirectTo ? `?next=${redirectTo}` : ""}`
          : "/auth/callback";

      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: redirectURL,
          scopes: "read:user user:email",
        },
      });
    } catch (err) {
      console.error("Sign-in error:", err);
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[hsl(224_71%_4%)] items-center justify-center p-12">
        {/* Background gradient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "hsl(263 70% 65%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-15"
          style={{ background: "hsl(300 60% 65%)" }}
        />

        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">{APP_NAME}</span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Where great projects
              <br />
              <span className="text-gradient">get discovered.</span>
            </h1>
            <p className="text-[hsl(218_11%_65%)] text-lg mb-12 leading-relaxed">
              A developer community built on genuine feedback, authentic connections, and organic growth.
            </p>

            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsl(263 70% 65% / 0.15)", border: "1px solid hsl(263 70% 65% / 0.3)" }}
                  >
                    <feature.icon className="w-4 h-4" style={{ color: "hsl(263 70% 75%)" }} />
                  </div>
                  <span className="text-[hsl(213_31%_80%)] text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">{APP_NAME}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-muted-foreground text-sm">
              Sign in to discover, review, and grow with the developer community.
            </p>
          </div>

          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg mb-6 text-sm"
              style={{
                background: "hsl(0 84% 60% / 0.1)",
                border: "1px solid hsl(0 84% 60% / 0.3)",
                color: "hsl(0 84% 60%)",
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Authentication failed. Please try again.</span>
            </div>
          )}

          {/* GitHub OAuth Button */}
          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            id="github-signin-btn"
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: isLoading ? "hsl(var(--muted))" : "hsl(var(--foreground))",
              color: isLoading ? "hsl(var(--muted-foreground))" : "hsl(var(--background))",
            }}
          >
            {isLoading ? (
              <>
                <div
                  className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: "hsl(var(--muted-foreground))", borderTopColor: "transparent" }}
                />
                <span>Connecting to GitHub…</span>
              </>
            ) : (
              <>
                <GitBranch className="w-5 h-5" />
                <span>Continue with GitHub</span>
              </>
            )}
          </button>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              By signing in, you agree to our{" "}
              <a href="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className="mt-6 p-4 rounded-xl text-xs text-muted-foreground leading-relaxed"
            style={{ background: "hsl(var(--muted))" }}>
            <strong className="text-foreground">Privacy first.</strong> GitBoost only reads your public GitHub profile.
            We never automate GitHub actions — every interaction is always yours to control.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
