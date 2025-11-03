import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ai detector Free Detect ChatGPT gemini claude content',
  description:
    'Paste text to detect AI-generated content. Free AI detector with instant score, highlight view, and downloadable report.',
  keywords: [
    'AI detection',
    'AI content detector',
    'ChatGPT detector',
    'AI text detector',
    'content authenticity',
    'AI writing detector',
    'gemini detector',
    'claude detector',
    'free ai detector',
  ],
  authors: [{ name: 'AI Content Detector' }],
  metadataBase: new URL('https://aidetectorfree.app'),
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'NdAlkiqJaR20Y5G0u8ts_2dcEY5rqGdEC25Np8t1dTk',
  },
  openGraph: {
    title: 'Ai detector Free Detect ChatGPT gemini claude content',
    description: 'Paste text to detect AI-generated content. Free AI detector with instant score, highlight view, and downloadable report.',
    type: 'website',
    locale: 'en_US',
    url: 'https://aidetectorfree.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ai detector Free Detect ChatGPT gemini claude content',
    description: 'Paste text to detect AI-generated content. Free AI detector with instant score, highlight view, and downloadable report.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">AI Content Detector</h3>
                <p className="text-gray-400 text-sm">
                  Detect AI-generated content with industry-leading accuracy and detailed sentence-level analysis.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Navigation</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="/" className="hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">About</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Advanced AI detection technology powered by state-of-the-art language models and machine learning algorithms.
                </p>
                <p className="text-xs text-gray-500">
                  Helping maintain content authenticity and integrity
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} AI Content Detector. All rights reserved.</p>
              <p className="mt-2">
                We do not store your content. Your privacy is our priority.
              </p>
            </div>
          </div>
        </footer>

        {/* JSON-LD Structured Data - Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'AI Detector Free',
              url: 'https://aidetectorfree.app/',
              sameAs: [
                'https://x.com/majeeddev'
              ],
              contactPoint: [{
                '@type': 'ContactPoint',
                contactType: 'customer support',
                email: 'support@aidetectorfree.app',
                availableLanguage: ['en']
              }]
            }),
          }}
        />

        {/* JSON-LD Structured Data - Software Application Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'AI Detector Free',
              applicationCategory: 'BusinessApplication',
              description:
                'Paste text to detect AI-generated content. Free AI detector with instant score, highlight view, and downloadable report.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
