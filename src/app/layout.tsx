import '../styles/mona-font.css';
import '../styles/global.css';

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';

const outfitFont = localFont({
  src: '../assets/outfit.woff2',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CSS Spring',
  description: 'Spring Animation for CSS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <script defer src="https://unpkg.com/react-scan/dist/auto.global.js" /> */}
      </head>
      <body className={`${outfitFont.className} antialiased dark`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
