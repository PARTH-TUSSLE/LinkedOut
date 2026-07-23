import type { Metadata } from "next";
import { Providers } from "./providers";
import "@/styles/globals.css";
import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "LinkedOut — Professional Networking, Redefined",
  description: "Connect with professionals without exaggeration. A modern, open-source professional networking platform built for meaningful connections.",
  keywords: ["professional networking", "career", "connections", "LinkedOut"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans antialiased", spaceGrotesk.variable)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
