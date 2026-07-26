import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";

import "@/styles/main.scss";

/* One type system, three voices: Sans for body, Serif for display
   titles, Mono for the small technical labels. */
const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
});

const ibmPlexSerif = IBM_Plex_Serif({
  weight: "600",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-serif",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mtnsounds.com"),
  title: {
    default: "Zack Sawyer",
    template: "%s | Zack Sawyer",
  },
  description:
    "Portfolio of Zack Sawyer — software developer, climber, and outdoor enthusiast in Vermont.",
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexSerif.variable} ${ibmPlexMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
