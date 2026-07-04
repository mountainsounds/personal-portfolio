import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans } from "next/font/google";

import "@/styles/main.scss";

const ibmPlexSans = IBM_Plex_Sans({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mtnsounds.com"),
  title: {
    default: "Zack Sawyer",
    template: "%s | Zack Sawyer",
  },
  description:
    "Portfolio of Zack Sawyer — software developer, climber, and outdoor enthusiast in Vermont.",
};

// The legacy site shipped `width=device-width` without initial-scale; keep it
// so mobile rendering is bit-for-bit identical.
export const viewport: Viewport = {
  width: "device-width",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={ibmPlexSans.variable}>{children}</body>
    </html>
  );
}
