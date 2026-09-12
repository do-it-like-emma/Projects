import type { Metadata, Viewport } from "next";
import { profile } from "@/lib/profile";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CommandPalette } from "@/components/CommandPalette";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.positioning,
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description: profile.positioning,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0f" },
  ],
};

/**
 * Applies the stored theme before first paint so an explicit choice never
 * flashes the wrong palette. Storage can throw in a private window, so the
 * whole thing is wrapped — a failure just falls through to the system theme.
 */
const themeScript = `
(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <div className="min-h-screen flex flex-col">
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
        </div>
        <CommandPalette />
      </body>
    </html>
  );
}
