import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Content Detector | Detect AI-Generated Content & Plagiarism',
  description:
    'Detect AI-generated content and check for plagiarism with industry-leading accuracy. Analyze up to 50,000 characters instantly with detailed sentence-level insights.',
  keywords: [
    'AI detection',
    'AI content detector',
    'plagiarism checker',
    'ChatGPT detector',
    'AI text detector',
    'content authenticity',
    'ZeroGPT',
  ],
  authors: [{ name: 'AI Content Detector' }],
  openGraph: {
    title: 'AI Content Detector | Detect AI-Generated Content & Plagiarism',
    description: 'Detect AI-generated content and check for plagiarism with industry-leading accuracy.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Content Detector',
    description: 'Detect AI-generated content and check for plagiarism',
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
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">AI Content Detector</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/detector"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  AI Detection
                </Link>
                <Link
                  href="/plagiarism"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Plagiarism Check
                </Link>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Terms
                </Link>
              </nav>
              <nav className="md:hidden">
                <Link
                  href="/detector"
                  className="text-sm text-gray-700 hover:text-blue-600 font-medium mr-4"
                >
                  Detect
                </Link>
                <Link
                  href="/plagiarism"
                  className="text-sm text-gray-700 hover:text-purple-600 font-medium"
                >
                  Plagiarism
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">AI Content Detector</h3>
                <p className="text-gray-400 text-sm">
                  Detect AI-generated content and plagiarism with industry-leading accuracy.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Features</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="/detector" className="hover:text-white transition-colors">
                      AI Detection
                    </Link>
                  </li>
                  <li>
                    <Link href="/plagiarism" className="hover:text-white transition-colors">
                      Plagiarism Checker
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-400">
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
                <p className="text-sm text-gray-400">
                  <a
                    href="https://www.zerogpt.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    ZeroGPT Business API
                  </a>
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
                'Detect AI-generated content and check for plagiarism with industry-leading accuracy.',
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
