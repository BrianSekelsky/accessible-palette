import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SkipNav } from "@/components/ui/SkipNav";
import { PaletteProvider } from "@/lib/palette/context";
import { AnnouncementProvider } from "@/lib/announcements/context";
import { AnnouncementDisplay } from "@/components/ui/AnnouncementDisplay";
import { ColorBlindnessProvider } from "@/contexts/ColorBlindnessContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Accessible Color Palette Generator",
  description: "A professional-grade tool for building WCAG 2.2 compliant color systems. Generate accessible color palettes with contrast checking, auto-fix suggestions, and export to multiple formats.",
  keywords: ["accessibility", "WCAG", "color palette", "contrast checker", "design system", "a11y"],
  authors: [{ name: "Brian Sekelsky" }],
  openGraph: {
    title: "Accessible Color Palette Generator",
    description: "Build WCAG-compliant color systems with contrast checking and auto-fix suggestions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/iky6dlg.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SkipNav />
          <AnnouncementProvider>
            <AnnouncementDisplay />
            <ColorBlindnessProvider>
              <PaletteProvider>
                {children}
              </PaletteProvider>
            </ColorBlindnessProvider>
          </AnnouncementProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
