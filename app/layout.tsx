import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";

import { AppSidebar } from "@/components/nav/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });
const baseUrl = "https://kallio.ai";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Kallio",
  description: "The AI Video Editor",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>
          <SidebarProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AppSidebar />
              <main className="relative w-screen h-screen">
                <SidebarTrigger className="absolute top-4 left-4 z-50" />
                {children}
              </main>
            </ThemeProvider>
          </SidebarProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
