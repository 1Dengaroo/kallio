import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/next';
import { ClerkProvider } from '@clerk/nextjs';

import { Sidebar } from '@/components/nav/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { VideoEditorProvider } from '@/context/video-editor-context';
import { SidePanelProvider } from '@/context/side-panel-context';

const inter = Inter({ subsets: ['latin'] });
const baseUrl = 'https://kallio.ai';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Kallio',
  description: 'The AI Video Editor',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>
          <VideoEditorProvider>
            <SidePanelProvider>
              <SidebarProvider defaultOpen={false}>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <Sidebar />
                  <main className="relative w-screen h-screen">{children}</main>
                </ThemeProvider>
              </SidebarProvider>
            </SidePanelProvider>
          </VideoEditorProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
