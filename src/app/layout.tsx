import type { Metadata, Viewport } from "next";
import { Sora, DM_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "DexSprint – Name All 151 Pokémon!",
  description: "A speed-naming challenge for the original 151 Pokémon from Generation I.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", sora.variable, dmMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <div className="relative min-h-full bg-background overflow-hidden">
          {/* Subtle ambient gradient */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#e53935]/3 via-[#0f0f10]/95 to-transparent blur-3xl" />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
