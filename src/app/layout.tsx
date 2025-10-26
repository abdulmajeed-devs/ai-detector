import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Content Detector | Detect AI-Generated Content with Advanced Analysis',
  description:
    'Detect AI-generated content with industry-leading accuracy. Analyze up to 50,000 characters instantly with detailed sentence-level insights and visual highlighting.',
  keywords: [
    'AI detection',
    'AI content detector',
    'ChatGPT detector',
    'AI text detector',
    'content authenticity',
    'ZeroGPT',
    'AI writing detector',
  ],
  authors: [{ name: 'AI Content Detector' }],
  openGraph: {
    title: 'AI Content Detector | Detect AI-Generated Content',
    description: 'Detect AI-generated content with industry-leading accuracy and detailed analysis.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Content Detector',
    description: 'Detect AI-generated content with advanced analysis',
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
        <link rel="icon" href="/favicon.ico" />
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
                <h4 className="font-semibold mb-4">Powered By</h4>
                <p className="text-sm text-gray-400 mb-4">
                  <a
                    href="https://www.zerogpt.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    ZeroGPT Business API
                  </a>
                </p>
                <p className="text-xs text-gray-500">
                  Advanced AI detection powered by state-of-the-art language models
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

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'AI Content Detector',
              applicationCategory: 'BusinessApplication',
              description:
                'Detect AI-generated content with industry-leading accuracy and detailed analysis.',
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
