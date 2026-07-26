import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "GitBoost is the developer community platform to discover quality open-source projects, receive genuine feedback, and grow organically.",
  keywords: [
    "open source",
    "developers",
    "github",
    "repositories",
    "code review",
    "developer community",
    "project discovery",
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://gitboost.dev"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description:
      "Discover quality open-source projects, connect with developers, and grow organically.",
    siteName: APP_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description:
      "Discover quality open-source projects, connect with developers, and grow organically.",
    creator: "@gitboostdev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "hsl(var(--card))",
                color: "hsl(var(--card-foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
