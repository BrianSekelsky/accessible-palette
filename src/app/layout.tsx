import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SkipNav } from "@/components/ui/SkipNav";
import { PaletteProvider } from "@/lib/palette/context";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SkipNav />
        <PaletteProvider>
          {children}
        </PaletteProvider>
      </body>
    </html>
  );
}
