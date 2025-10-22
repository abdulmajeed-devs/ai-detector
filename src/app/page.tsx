'use client';

import { useState, useMemo } from 'react';
import { Loader2, AlertCircle, CheckCircle2, AlertTriangle, FileText, Sparkles, Eye, Shield, Zap, Lock } from 'lucide-react';
import Link from 'next/link';
import type { NormalizedDetectionResult } from '@/types/zerogpt.types';

export default function HomePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NormalizedDetectionResult | null>(null);
  const [error, setError] = useState('');
  const [showHighlighted, setShowHighlighted] = useState(true);

  const charCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charLimit = 50000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    if (charCount > charLimit) {
      setError(`Text exceeds ${charLimit.toLocaleString()} character limit`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Detection failed');
      }

      setResult(data.data);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'AI':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Human':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Mixed':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'AI':
        return <AlertCircle className="w-6 h-6" />;
      case 'Human':
        return <CheckCircle2 className="w-6 h-6" />;
      case 'Mixed':
        return <AlertTriangle className="w-6 h-6" />;
      default:
        return null;
    }
  };

  // Create highlighted text with AI sentences marked
  const highlightedText = useMemo(() => {
    if (!result || !text) return null;

    const aiSentences = result.highlightedSentences || [];
    if (aiSentences.length === 0) return null;

    const segments: Array<{ text: string; isAI: boolean }> = [];
    const sortedAISentences = [...aiSentences].sort((a, b) => b.length - a.length);
    const matches: Array<{ start: number; end: number; sentence: string }> = [];
    
    sortedAISentences.forEach(aiSentence => {
      const cleanedSentence = aiSentence.trim();
      let searchIndex = 0;
      
      while (searchIndex < text.length) {
        const foundIndex = text.indexOf(cleanedSentence, searchIndex);
        if (foundIndex === -1) break;
        
        const isOverlapping = matches.some(
          match => foundIndex < match.end && foundIndex + cleanedSentence.length > match.start
        );
        
        if (!isOverlapping) {
          matches.push({
            start: foundIndex,
            end: foundIndex + cleanedSentence.length,
            sentence: cleanedSentence
          });
        }
        
        searchIndex = foundIndex + cleanedSentence.length;
      }
    });

    matches.sort((a, b) => a.start - b.start);

    let lastEnd = 0;
    matches.forEach(match => {
      if (match.start > lastEnd) {
        segments.push({
          text: text.substring(lastEnd, match.start),
          isAI: false
        });
      }
      
      segments.push({
        text: text.substring(match.start, match.end),
        isAI: true
      });
      
      lastEnd = match.end;
    });

    if (lastEnd < text.length) {
      segments.push({
        text: text.substring(lastEnd),
        isAI: false
      });
    }

    return segments;
  }, [result, text]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">AI Content Detector</h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Detect AI-generated content with advanced analysis and sentence-level highlighting
          </p>
        </div>

        {/* Main Detection Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-8 border-2 border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="text-input" className="block text-lg font-semibold text-gray-800 mb-3">
                <Sparkles className="w-5 h-5 inline-block mr-2 text-blue-600" />
                Enter text to analyze
              </label>
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here to check if it was generated by AI..."
                rows={14}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all text-base"
                disabled={loading}
              />
              <div className="flex justify-between text-sm mt-3">
                <span className="text-gray-600 font-medium">{wordCount.toLocaleString()} words</span>
                <span className={charCount > charLimit ? 'text-red-600 font-bold' : 'text-gray-600 font-medium'}>
                  {charCount.toLocaleString()} / {charLimit.toLocaleString()} characters
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !text.trim() || charCount > charLimit}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing Your Content...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Detect AI Content
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-5 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 shadow-md">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-base text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div id="results-section" className="space-y-6">
            {/* Main Verdict Card */}
            <div className={`p-8 border-3 rounded-2xl shadow-xl ${getVerdictColor(result.verdict)}`}>
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0">
                  {getVerdictIcon(result.verdict)}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-3">
                    {result.verdict === 'AI' && '🤖 AI-Generated Content Detected'}
                    {result.verdict === 'Human' && '✅ Human-Written Content'}
                    {result.verdict === 'Mixed' && '⚠️ Mixed Content Detected'}
                  </h2>
                  <p className="text-lg opacity-90 mb-6">{result.feedback}</p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <div className="text-sm font-semibold opacity-70 mb-1">AI Probability</div>
                      <div className="text-4xl font-bold">{result.aiProbability}%</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold opacity-70 mb-1">Confidence</div>
                      <div className="text-4xl font-bold">{result.confidence}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold opacity-70 mb-1">AI Words</div>
                      <div className="text-4xl font-bold">{result.aiWords.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold opacity-70 mb-1">Human Words</div>
                      <div className="text-4xl font-bold">{result.humanWords.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Word Distribution Bar */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-7 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Content Distribution
              </h3>
              <div className="relative h-10 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-700 ease-out"
                  style={{ width: result.totalWords > 0 ? `${(result.aiWords / result.totalWords) * 100}%` : '0%' }}
                />
                <div
                  className="absolute right-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-700 ease-out"
                  style={{ width: result.totalWords > 0 ? `${(result.humanWords / result.totalWords) * 100}%` : '0%' }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-700 mt-3 font-medium">
                <span>
                  AI: {result.aiWords} words ({result.totalWords > 0 ? ((result.aiWords / result.totalWords) * 100).toFixed(1) : '0'}%)
                </span>
                <span>
                  Human: {result.humanWords} words ({result.totalWords > 0 ? ((result.humanWords / result.totalWords) * 100).toFixed(1) : '0'}%)
                </span>
              </div>
            </div>

            {/* Highlighted Text View */}
            {highlightedText && highlightedText.length > 0 && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-7 shadow-lg">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    Highlighted Text Analysis
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({result.highlightedSentences.length} AI sentence{result.highlightedSentences.length !== 1 ? 's' : ''} detected)
                    </span>
                  </h3>
                  <button
                    onClick={() => setShowHighlighted(!showHighlighted)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    {showHighlighted ? 'Hide' : 'Show'} Highlights
                  </button>
                </div>

                {showHighlighted && (
                  <>
                    <div className="bg-gray-50 rounded-xl p-5 mb-5 max-h-[500px] overflow-y-auto shadow-inner border border-gray-200">
                      <div className="text-base leading-relaxed whitespace-pre-wrap">
                        {highlightedText.map((segment, index) => (
                          <span
                            key={index}
                            className={
                              segment.isAI
                                ? 'bg-red-200 text-red-900 px-1.5 py-1 rounded font-semibold'
                                : 'text-gray-800'
                            }
                          >
                            {segment.text}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="bg-red-200 text-red-900 px-3 py-1.5 rounded font-semibold">
                          Highlighted
                        </span>
                        <span className="text-gray-600">= AI-generated content detected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-800 px-3 py-1.5 bg-white border-2 border-gray-300 rounded">
                          Normal
                        </span>
                        <span className="text-gray-600">= Human-written or uncertain</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Sentence-Level Analysis */}
            {result.sentences.length > 0 && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-7 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Sentence-by-Sentence Analysis
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({result.sentences.filter(s => s.isAIGenerated).length} AI-generated sentences)
                  </span>
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {result.sentences.map((sentence, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        sentence.isAIGenerated
                          ? 'bg-red-50 border-red-200 text-red-900'
                          : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                            sentence.isAIGenerated ? 'bg-red-200 text-red-900' : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {sentence.isAIGenerated ? '🤖 AI' : '👤 Human'}
                        </span>
                        <p className="flex-1 text-sm leading-relaxed">{sentence.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-5 italic">
                  💡 Red highlighted sentences show patterns commonly found in AI-generated text.
                </p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 shadow-md">
              <p className="font-bold text-blue-900 mb-3">⚠️ Important Disclaimer</p>
              <p className="text-blue-800 text-sm leading-relaxed">
                AI detection is probabilistic and not 100% accurate. This tool analyzes text patterns to estimate
                likelihood of AI generation. False positives can occur with formal, technical, or well-structured
                human writing. Always apply human judgment and consider context.
              </p>
            </div>

            {/* Footer Info */}
            <p className="text-sm text-gray-500 text-center">
              Analyzed at {new Date(result.checkedAt).toLocaleString()} • Powered by{' '}
              <a
                href="https://www.zerogpt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                ZeroGPT Business API
              </a>
            </p>
          </div>
        )}

        {/* Features Section (Only show if no results) */}
        {!result && (
          <>
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-12 mt-16">
              <div className="bg-white rounded-2xl shadow-lg p-7 border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Zap className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Instant Analysis</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Get results in seconds with our advanced AI detection engine. Supports up to 50,000 characters per analysis.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-7 border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Eye className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Visual Highlighting</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  See exactly which sentences were flagged as AI-generated with our visual highlighting feature.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-7 border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Shield className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">High Accuracy</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Industry-leading detection powered by ZeroGPT with detailed confidence scores and sentence analysis.
                </p>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-8 shadow-xl">
              <div className="flex items-start gap-5">
                <Lock className="w-10 h-10 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy is Protected</h3>
                  <p className="text-gray-700 mb-5 leading-relaxed">
                    We take your privacy seriously. Your content is processed securely and never stored in our database.
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <span>No text storage - Content processed in memory only</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <span>Encrypted API - All requests secured with HTTPS</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <span>No tracking - We don't collect personal information</span>
                    </li>
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-4">
                    <Link href="/privacy" className="text-green-700 font-semibold hover:text-green-900 underline">
                      Privacy Policy
                    </Link>
                    <span className="text-gray-400">•</span>
                    <Link href="/terms" className="text-green-700 font-semibold hover:text-green-900 underline">
                      Terms of Service
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
