import { Shield, Lock, Database, Eye } from 'lucide-react';
import Header from '@/components/Header';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: October 20, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Overview */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Our Commitment to Privacy</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              At AI Content Detector, we are committed to protecting your privacy. This Privacy Policy explains how we
              handle your data when you use our AI detection and plagiarism checking services. We believe in transparency
              and have designed our service to minimize data collection and maximize your privacy.
            </p>
          </section>

          {/* No Text Storage */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">No Text Storage</h2>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <p className="text-green-800 font-medium">
                ✓ We do NOT store your submitted text in our database
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you submit text for AI detection, we process it in memory only. Your content
              is sent to our third-party analysis provider and is immediately discarded after analysis. We never
              write your actual text content to our database.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>What we store instead:</strong> We only keep anonymous metadata including SHA-256 hash of your text
              (for caching purposes), word count, character count, analysis verdict, timestamps, and response times. This
              metadata cannot be reversed to recover your original text.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Third-Party Service Providers</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use third-party AI detection technology to perform content analysis. When
              you submit text for analysis:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Your text is transmitted securely to our service providers via encrypted HTTPS connection</li>
              <li>Third-party providers process your text according to their own privacy policies</li>
              <li>We do not control how third-party providers handle your data</li>
              <li>Your content is processed in real-time and is not stored permanently by us</li>
            </ul>
          </section>

          {/* Data Collection */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">What Data We Collect</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">Analysis Metadata (Stored):</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>SHA-256 hash of submitted text (irreversible, for caching)</li>
                  <li>Word count and character count</li>
                  <li>Analysis verdict (AI/Human/Mixed or Plagiarized/Suspicious/Original)</li>
                  <li>Confidence scores and percentages</li>
                  <li>Timestamp of analysis</li>
                  <li>Response latency metrics</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Technical Data (Temporary):</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>IP address (for rate limiting only, not stored in database)</li>
                  <li>Request headers (processed in memory, not logged)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">NOT Collected:</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>❌ Your actual text content</li>
                  <li>❌ Email addresses or personal information</li>
                  <li>❌ Cookies or tracking pixels</li>
                  <li>❌ User accounts or profiles</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Measures</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span><strong>HTTPS Encryption:</strong> All data transmitted between your browser and our servers is encrypted using TLS/SSL</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span><strong>IP Whitelisting:</strong> Our API key is restricted to our server's IP address only</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span><strong>Rate Limiting:</strong> Protection against abuse and automated attacks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span><strong>No Server-Side Logging:</strong> We do not log raw text content in our application logs</span>
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              Analysis metadata (hashes, scores, timestamps) is retained for service improvement and caching purposes.
              Cached results expire after 24 hours. We may retain aggregated, anonymous statistics indefinitely for
              analytics. Since we don't store your actual text, there is no "right to deletion" request needed for
              content – it's never saved in the first place.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Since we do not collect personal information or store your text content, there is minimal personal data
              to manage. However, you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Stop using our service at any time</li>
              <li>Request information about what metadata we've stored (if any can be tied to you)</li>
              <li>Contact us with privacy concerns</li>
            </ul>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify users of any material changes by
              updating the "Last updated" date at the top of this page. Continued use of the service after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us.
            </p>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
