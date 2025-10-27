import type { Metadata } from "next";
import { Libre_Baskerville, DM_Sans } from "next/font/google";
import { NextChatSDKBootstrap } from "./sdk-bootstrap";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-libre-baskerville',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: "Codetopic - Your Intelligent Coding Partner",
  description: "Experience coding reimagined with XML-powered AI assistance for smarter development",
  applicationName: "Codetopic",
  keywords: ["AI coding", "XML system prompts", "code assistant", "developer tools", "AI agent"],
  authors: [{ name: "Codetopic Team" }],
  icons: {
    icon: [
      {
        url: '/CODETOPIC.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/CODETOPIC.png',
        sizes: '16x16',
        type: 'image/png',
      }
    ],
    apple: [
      {
        url: '/CODETOPIC.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
    shortcut: [
      {
        url: '/CODETOPIC.png',
        sizes: '196x196',
        type: 'image/png'
      }
    ]
  },
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';

  return (
    <html lang="en" suppressHydrationWarning className={`${libreBaskerville.variable} ${dmSans.variable}`}>
      <head>
        <NextChatSDKBootstrap baseUrl={baseURL} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}