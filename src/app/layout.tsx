import './styles/global.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';

// Font files can be colocated inside of `app`
const outfitFont = localFont({
  src: './assets/outfit-v4-latin-regular.woff2',
  display: 'swap',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfitFont.className} antialiased dark`}
      >
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
