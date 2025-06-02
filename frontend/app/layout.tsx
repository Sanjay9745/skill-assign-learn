import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Skill Assign',
  description: 'Skill assignment and management platform',
  keywords: ['skill assignment', 'management', 'platform', 'skills', 'team'],
  authors: [{ name: 'Skill Assign Team' }],
  creator: 'Skill Assign',
  publisher: 'Skill Assign',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://skill-assign.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Skill Assign',
    description: 'Skill assignment and management platform',
    url: 'https://skill-assign.com',
    siteName: 'Skill Assign',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Skill Assign Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skill Assign',
    description: 'Skill assignment and management platform',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
