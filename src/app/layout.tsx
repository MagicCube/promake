import "@/styles/globals.css";

import { Geist } from "next/font/google";

import { appMetadata } from "@/app-metadata";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} overscroll-none`}
      suppressHydrationWarning
    >
      <head>
        <title>{appMetadata.title}</title>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TRPCReactProvider>
            {children}
            <Toaster position="top-right" duration={1000} />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
