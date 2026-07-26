import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans } from "next/font/google";

import "@/styles/main.scss";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600"],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={ibmPlexSans.variable}>{children}</body>
    </html>
  );
}
