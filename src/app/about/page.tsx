import { Sparkles, Shield, Zap, Eye, Target, Users, Heart } from 'lucide-react';
import Header from '@/components/Header';

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">About Us</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about our mission to bring transparency and trust to content authenticity
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            In a world where AI-generated content is becoming increasingly prevalent, we believe in empowering individuals 
            and organizations with the tools they need to verify content authenticity. Our mission is to provide accessible, 
            accurate, and transparent AI detection services that help maintain trust in written communication.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            We understand that modern writing often blends human effort with machine assistance. Our goal isn't to discourage 
            the use of AI tools, but to promote transparency and informed decision-making about content origins.
          </p>
        </div>

        {/* What We Do */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900">What We Do</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            AI Content Detector provides advanced analysis tools that help you understand the nature of written content. 
            Using cutting-edge AI detection technology, we offer:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-3">📊 Detailed Analysis</h3>
              <p className="text-blue-800 leading-relaxed">
                Get comprehensive insights including AI probability scores, confidence levels, and sentence-by-sentence breakdowns.
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <h3 className="text-xl font-bold text-purple-900 mb-3">🎯 Visual Highlighting</h3>
              <p className="text-purple-800 leading-relaxed">
                See exactly which parts of text are flagged as AI-generated with our intuitive visual highlighting system.
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <h3 className="text-xl font-bold text-green-900 mb-3">⚡ Instant Results</h3>
              <p className="text-green-800 leading-relaxed">
                Analyze up to 50,000 characters in seconds with real-time processing and immediate feedback.
              </p>
            </div>
            <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-orange-900 mb-3">🔒 Privacy First</h3>
              <p className="text-orange-800 leading-relaxed">
                Your content is never stored in our database. We process text in memory only to protect your privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-green-100">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transparency</h3>
                <p className="text-gray-700 leading-relaxed">
                  We're honest about our limitations. AI detection isn't perfect, and we clearly communicate accuracy 
                  rates, potential false positives, and the probabilistic nature of our results.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your content is yours alone. We don't store submitted text, track users, or collect personal information. 
                  Privacy isn't just a feature—it's fundamental to how we operate.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Accessibility</h3>
                <p className="text-gray-700 leading-relaxed">
                  Quality AI detection shouldn't be locked behind expensive paywalls. We provide free access to powerful 
                  tools that help everyone verify content authenticity.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fairness</h3>
                <p className="text-gray-700 leading-relaxed">
                  We recognize that detection tools can have biases, particularly against non-native English writers. 
                  We advocate for responsible use and human judgment in all decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Who We Serve */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 mb-8 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Who We Serve</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Our tools are designed to help a diverse range of users maintain content integrity and make informed decisions:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Educators",
                emoji: "🎓",
                description: "Teachers and professors protecting academic integrity while fostering honest conversations about AI use."
              },
              {
                title: "Publishers",
                emoji: "📰",
                description: "Media organizations and content platforms maintaining authenticity and reader trust."
              },
              {
                title: "Businesses",
                emoji: "🏢",
                description: "Companies verifying content quality and protecting brand voice across communications."
              },
              {
                title: "Researchers",
                emoji: "🔬",
                description: "Academic researchers ensuring the integrity of scholarly work and publications."
              },
              {
                title: "Content Creators",
                emoji: "✍️",
                description: "Writers and creators who want to verify their own work or check sourced content."
              },
              {
                title: "Students",
                emoji: "📚",
                description: "Learners who want to ensure their work demonstrates genuine understanding and effort."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all">
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900">Our Technology</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            We leverage state-of-the-art AI detection technology and advanced machine learning algorithms. 
            Our system combines multiple detection methods to provide accurate and reliable results:
          </p>
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-5 border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-purple-900 mb-2">Statistical Analysis</h3>
              <p className="text-purple-800">
                Measures perplexity (word predictability) and burstiness (rhythm variation) to identify machine-like patterns.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Machine Learning Models</h3>
              <p className="text-blue-800">
                Trained on millions of human and AI-generated texts to recognize subtle linguistic fingerprints.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-green-900 mb-2">Sentence-Level Detection</h3>
              <p className="text-green-800">
                Analyzes text at granular levels to identify which specific sentences show AI characteristics.
              </p>
            </div>
          </div>
        </div>

        {/* Commitment to Responsible Use */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-8 border-2 border-yellow-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Commitment to Responsible Use</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>We believe AI detection should be used responsibly.</strong> Our tools provide probabilities, not proof. 
              We strongly advocate for:
            </p>
            <ul className="space-y-3 ml-6">
              <li className="flex items-start gap-3">
                <span className="text-yellow-600 font-bold text-xl flex-shrink-0">✓</span>
                <span><strong>Human oversight:</strong> Never make important decisions based solely on detection scores</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-600 font-bold text-xl flex-shrink-0">✓</span>
                <span><strong>Context consideration:</strong> Understand that formal writing styles may trigger false positives</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-600 font-bold text-xl flex-shrink-0">✓</span>
                <span><strong>Fair processes:</strong> Use detection as one input among many, especially in education and employment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-600 font-bold text-xl flex-shrink-0">✓</span>
                <span><strong>Transparency:</strong> Be open about tool limitations and potential biases</span>
              </li>
            </ul>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}