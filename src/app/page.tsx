'use client';

import { useState, useMemo } from 'react';
import { Loader2, AlertCircle, CheckCircle2, AlertTriangle, FileText, Sparkles, Eye, Shield, Zap, Lock, User } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import type { NormalizedDetectionResult } from '@/types/zerogpt.types';

export default function HomePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NormalizedDetectionResult | null>(null);
  const [error, setError] = useState('');
  const [showHighlighted, setShowHighlighted] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);

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
    setShowSkeleton(true);

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
      setShowSkeleton(false);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setShowSkeleton(false);
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

  // Simplified highlighting algorithm - highlights AI sentences in the text
  const highlightedText = useMemo(() => {
    if (!result || !text) return null;

    const aiSentences = result.highlightedSentences || [];
    
    // Debug: Log what we received from API
    if (aiSentences.length === 0) {
      console.warn('No highlighted sentences received from API');
      // Fallback: use sentences marked as AI from sentence analysis
      const aiSentencesFromAnalysis = result.sentences
        ?.filter(s => s.isAIGenerated)
        .map(s => s.text) || [];
      
      if (aiSentencesFromAnalysis.length === 0) {
        return null;
      }
      // Use fallback sentences
      return buildHighlightedSegments(text, aiSentencesFromAnalysis);
    }

    return buildHighlightedSegments(text, aiSentences);
  }, [result, text]);

  // Helper function to build highlighted segments
  function buildHighlightedSegments(sourceText: string, aiSentencesList: string[]) {
    const segments: Array<{ text: string; isAI: boolean }> = [];
    let remainingText = sourceText;
    let currentIndex = 0;

    // Sort sentences by length (longest first) to handle overlapping matches
    const sortedSentences = [...aiSentencesList].sort((a, b) => b.length - a.length);
    const processedRanges: Array<{ start: number; end: number }> = [];

    // Find all AI sentence positions
    sortedSentences.forEach(sentence => {
      const cleanSentence = sentence.trim();
      if (!cleanSentence) return;

      let searchPos = 0;
      while (searchPos < sourceText.length) {
        const foundPos = sourceText.indexOf(cleanSentence, searchPos);
        if (foundPos === -1) break;

        // Check if this range overlaps with already processed ranges
        const endPos = foundPos + cleanSentence.length;
        const overlaps = processedRanges.some(
          range => foundPos < range.end && endPos > range.start
        );

        if (!overlaps) {
          processedRanges.push({ start: foundPos, end: endPos });
        }

        searchPos = endPos;
      }
    });

    // Sort ranges by start position
    processedRanges.sort((a, b) => a.start - b.start);

    // Build segments
    let lastEnd = 0;
    processedRanges.forEach(range => {
      // Add human text before AI sentence
      if (range.start > lastEnd) {
        segments.push({
          text: sourceText.substring(lastEnd, range.start),
          isAI: false
        });
      }
      // Add AI sentence
      segments.push({
        text: sourceText.substring(range.start, range.end),
        isAI: true
      });
      lastEnd = range.end;
    });

    // Add remaining human text
    if (lastEnd < sourceText.length) {
      segments.push({
        text: sourceText.substring(lastEnd),
        isAI: false
      });
    }

    return segments.length > 0 ? segments : null;
  }

  return (
    <>
      <Header />
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
                aria-label="Text input for AI content detection analysis"
                aria-describedby="char-count word-count"
              />
              <div className="flex justify-between text-sm mt-3">
                <span id="word-count" className="text-gray-600 font-medium">{wordCount.toLocaleString()} words</span>
                <span id="char-count" className={charCount > charLimit ? 'text-red-600 font-bold' : 'text-gray-600 font-medium'}>
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

        {/* Loading Skeleton */}
        {showSkeleton && (
          <div className="space-y-6 animate-pulse">
            {/* Main Verdict Skeleton */}
            <div className="p-8 bg-gray-100 border-2 border-gray-200 rounded-2xl">
              <div className="flex items-start gap-5">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i}>
                        <div className="h-3 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="h-10 bg-gray-300 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution Bar Skeleton */}
            <div className="bg-gray-100 border-2 border-gray-200 rounded-2xl p-7">
              <div className="h-5 bg-gray-300 rounded w-48 mb-4"></div>
              <div className="h-10 bg-gray-300 rounded-full mb-3"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
            </div>

            {/* Highlighted Text Skeleton */}
            <div className="bg-gray-100 border-2 border-gray-200 rounded-2xl p-7">
              <div className="h-5 bg-gray-300 rounded w-56 mb-5"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>

            {/* Analysis Text */}
            <div className="text-center">
              <p className="text-gray-600 font-medium">Analyzing your content...</p>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && !showSkeleton && (
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
                      ({(result.highlightedSentences?.length || 0) + (result.sentences?.filter(s => s.isAIGenerated).length || 0)} AI sentence{((result.highlightedSentences?.length || 0) + (result.sentences?.filter(s => s.isAIGenerated).length || 0)) !== 1 ? 's' : ''} detected)
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
              Analyzed at {new Date(result.checkedAt).toLocaleString()}
            </p>
          </div>
        )}

        {/* Article Section (Only show if no results) */}
        {!result && (
          <div className="mt-16 space-y-12">
            {/* Introduction */}
            <article className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  Modern writing blends human effort and machine help. Students brainstorm with prompts. Editors use tools to polish grammar. Brands automate outlines. In that world, the idea of an AI detector feels simple: paste text, get a score, and learn if a machine wrote it. Reality is not that simple. This guide explains what an AI detector can and cannot do, how it works, where it helps, where it fails, and how to use it fairly in school, business, and publishing.
                </p>
              </div>
            </article>

            {/* What Is an AI Detector */}
            <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-blue-600" />
                What Is an AI Detector?
              </h2>
              <div className="prose prose-lg max-w-none space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  An AI detector is a tool that looks at text and guesses whether a person or a machine wrote it. It studies patterns, word choices, and how sentences move. Then it gives a score like "likely human," "likely AI," or a percentage. Some tools are paid, some offer a free trial, and many are free with limits. The tools aim to help teachers, editors, and teams make better calls. But they are not lie detectors, and they are not proof on their own.
                </p>
                
                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">A Simple Definition</h3>
                <p className="text-gray-700 leading-relaxed">
                  The detector reads the text like a language model would. It asks, "Is this how a model would write?" If the answer seems yes, the score leans toward AI. If the answer seems no, it leans toward human. It is a best guess, not a verdict.
                </p>
                
                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why These Tools Exist</h3>
                <p className="text-gray-700 leading-relaxed">
                  People want clarity. Teachers want fair grading. Editors want trust in bylines. Brands want to protect their voice. A detector gives a first pass so that a human reviewer can decide what to do next.
                </p>
                
                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Who Uses Them</h3>
                <p className="text-gray-700 leading-relaxed">
                  Educators, publishers, media teams, businesses, researchers, policy makers, and HR teams all use some form of AI detector. In each case the goal is the same: raise quality, protect integrity, and manage risk.
                </p>
              </div>
            </section>

            {/* Do AI Detectors Really Work */}
            <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-purple-600" />
                Do AI Detectors Really Work?
              </h2>
              <div className="prose prose-lg max-w-none space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Short answer: sometimes.</strong> The tools can catch a lot of obvious machine text. They also miss a lot and sometimes flag real human work. On forums and Q&A sites, many people share mixed results. One person says their teacher claimed 99% accuracy, yet five different tools said a human paragraph had a 99% chance of being AI. Another person shared that work written 18 years ago came back as 37% AI. These are not rare stories.
                </p>
                
                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Lab Results vs Real Life</h3>
                <p className="text-gray-700 leading-relaxed">
                  You may see claims like "98% confidence" in a product page. Those are lab numbers, from controlled tests where the source of the text is known. Real life is not like that. In the classroom or newsroom the origin is unknown, so the margin of error is larger. A confidence score can be off by more than 10–15 points.
                </p>
                
                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Free vs Paid</h3>
                <p className="text-gray-700 leading-relaxed">
                  Discussion threads suggest that paid tools reach around 80% accuracy in tests, while many free tools sit near 60% or lower. That gap matters when the risk is high. Still, even at 80%, false positives and misses are real. The score is a signal to review, not a final call.
                </p>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 mt-6 rounded-lg">
                  <h3 className="text-xl font-bold text-yellow-900 mb-3">⚠️ False Positives and Bias</h3>
                  <p className="text-yellow-800 leading-relaxed">
                    False positives hurt. Non‑native English writers face this more. One study found that 61.22% of TOEFL essays by non‑native students were flagged as AI, while essays by U.S.‑born students were judged near perfect. Historic texts also get flagged. In a famous test, the Declaration of Independence scored 98.51% "AI‑generated." These cases show why a score alone should not decide outcomes.
                  </p>
                </div>
              </div>
            </section>

            {/* Common Myths */}
            <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-red-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                Common Myths and the Real Picture
              </h2>
              <div className="space-y-6">
                {[
                  {
                    myth: "Text is either human or AI",
                    reality: "Real life sits on a spectrum. Students draft with AI then revise by hand. Writers brainstorm with prompts but write their own arguments. Treating authorship like a yes/no switch hides this mix."
                  },
                  {
                    myth: "Published accuracy reflects the real world",
                    reality: "A product may list a sharp accuracy rate. In practice, performance drops outside the lab. The same score can swing by plus or minus many points."
                  },
                  {
                    myth: "More detectors mean more certainty",
                    reality: "Five detectors do not act like five lab tests. They share blind spots and training data. Running many tools at once can make you cherry‑pick the answer you wanted to see."
                  },
                  {
                    myth: "Detectors can be perfect",
                    reality: "Even advanced systems miss 35–60% of real AI text, especially when users prompt well or edit by hand."
                  },
                  {
                    myth: "AI content doesn't need fact‑checking",
                    reality: "AI is great at fluent language, not truth. It can sound right and still be wrong or out of date. Every claim needs checking."
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-red-50 rounded-xl p-5 border-2 border-red-200">
                    <h3 className="text-lg font-bold text-red-900 mb-2">❌ Myth: {item.myth}</h3>
                    <p className="text-red-800 leading-relaxed">✅ Reality: {item.reality}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Zap className="w-8 h-8 text-green-600" />
                How an AI Detector Works
              </h2>
              <div className="prose prose-lg max-w-none space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Detectors use math and pattern reading. Many mix several methods to reach a score. Here is a simple map of the main ideas.
                </p>
                
                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Statistical Signals</h3>
                
                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mt-4">
                  <h4 className="text-xl font-bold text-green-900 mb-3">Perplexity (How Predictable the Words Are)</h4>
                  <p className="text-green-800 leading-relaxed">
                    Perplexity is a measure of surprise. If a model would guess the next word with ease, unpredictability is low, and the text looks closer to machine style. Higher perplexity lines up with human writing. Lower perplexity lines up with machine writing.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mt-4">
                  <h4 className="text-xl font-bold text-green-900 mb-3">Burstiness (How Much the Rhythm Varies)</h4>
                  <p className="text-green-800 leading-relaxed">
                    Humans mix short lines with long ones. We shift tone, sentence length, and structure. Models tend to hold a steady rhythm. More natural variation tends to look human. Smooth, even pacing tends to look like a model.
                  </p>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Other Detection Methods</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Language pattern checks:</strong> Repeated phrasings, generic tone, and flat transitions</li>
                  <li><strong>Machine‑learning classifiers:</strong> Trained on examples of human and model text</li>
                  <li><strong>Feature‑based detection:</strong> Word frequency, repetition, and flow analysis</li>
                  <li><strong>Model‑based approaches:</strong> "AI to detect AI" - asks if the text matches typical model output</li>
                </ul>
              </div>
            </section>

            {/* Why People Use Detectors */}
            <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                Why People Use a Detector
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Education: Protect Academic Integrity",
                    icon: "🎓",
                    content: "Schools use detectors as part of their integrity process. Teachers want to know that papers show real student work and can spark honest talks about proper AI use."
                  },
                  {
                    title: "Publishers and Media: Keep Trust",
                    icon: "📰",
                    content: "Newsrooms want human judgment, context, and accountability. Editors check that submissions meet standards and are not auto‑generated."
                  },
                  {
                    title: "Businesses: Protect the Brand",
                    icon: "🏢",
                    content: "Companies care about voice and trust. Detectors help verify that copy is original and aligned with brand tone."
                  },
                  {
                    title: "Researchers: Protect the Record",
                    icon: "🔬",
                    content: "Labs and journals rely on accurate writing. Detectors serve as an early warning when papers look synthetic."
                  },
                  {
                    title: "Recruiters: Check Writing Ability",
                    icon: "💼",
                    content: "Hiring teams want to see how candidates write on their own. Detectors support screening of cover letters and statements."
                  },
                  {
                    title: "SEO Teams: Maintain Quality",
                    icon: "📈",
                    content: "Content teams scan drafts to see where writing looks flat and needs fresh human detail while maintaining search rankings."
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="text-xl font-bold text-blue-900 mb-3">{item.title}</h3>
                    <p className="text-blue-800 leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SEO Section */}
            <section className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-8 border-2 border-purple-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Detectors and SEO</h2>
              <div className="prose prose-lg max-w-none space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Google's Stance</h3>
                <p className="text-gray-700 leading-relaxed">
                  Search engines do not ban AI by itself. What matters is quality and intent. If you write mainly to trick rankings, that is spam. If the page helps people and shows real expertise and trust, it can rank. The key is to meet E‑E‑A‑T: Experience, Expertise, Authoritativeness, and Trustworthiness.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                    <h4 className="text-xl font-bold text-red-900 mb-3">⚠️ Risks of AI for SEO</h4>
                    <ul className="list-disc list-inside space-y-2 text-red-800">
                      <li>Quality and depth issues</li>
                      <li>Mass deindexing events</li>
                      <li>Penalty triggers</li>
                      <li>E‑E‑A‑T violations</li>
                      <li>Traffic and visibility losses</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                    <h4 className="text-xl font-bold text-green-900 mb-3">✅ Benefits When Done Right</h4>
                    <ul className="list-disc list-inside space-y-2 text-green-800">
                      <li>Fast content with human review</li>
                      <li>Better keyword research</li>
                      <li>Content optimization</li>
                      <li>Understand user intent</li>
                      <li>Cost and time efficiency</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Responsible Use */}
            <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                How to Use an AI Detector Responsibly
              </h2>
              <div className="space-y-6">
                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-4">For Educators: A Fair Workflow</h3>
                  <ul className="list-disc list-inside space-y-2 text-green-800">
                    <li>Use the tool as a triage, not a verdict</li>
                    <li>Ask for process evidence: notes, outlines, drafts, and sources</li>
                    <li>Offer a short oral check to let students explain choices</li>
                    <li>Avoid hard thresholds - don't treat "85% AI" as a guilty stamp</li>
                    <li>Document context and reasoning for decisions</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">For Students: Protect Yourself</h3>
                  <ul className="list-disc list-inside space-y-2 text-blue-800">
                    <li>Keep drafts and timestamps to show your process</li>
                    <li>Add your voice with examples and personal stories</li>
                    <li>Cite tools and sources if you used AI for ideas or edits</li>
                    <li>Review flagged parts and revise for clarity</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                  <h3 className="text-xl font-bold text-purple-900 mb-4">For Businesses: Ship Quality at Scale</h3>
                  <ul className="list-disc list-inside space-y-2 text-purple-800">
                    <li>Adopt a "human‑in‑the‑loop" model - draft with AI, edit with experts</li>
                    <li>Invest in fact‑checking with data and interviews</li>
                    <li>Avoid bulk publishing without review</li>
                    <li>Measure engagement - if metrics fall, revise or prune</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 border-2 border-blue-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "What is an AI detector?",
                    a: "It is a tool that looks at text and estimates if a person or a machine wrote it. It uses math, patterns, and training data to reach a score. Treat it as a clue, not a verdict."
                  },
                  {
                    q: "Does an AI detector work well?",
                    a: "It can catch a lot of obvious machine text, but it also misses many cases and can mark real human writing as AI. Accuracy in real life is lower than the neat numbers you see in ads."
                  },
                  {
                    q: "Is a free AI detector good enough?",
                    a: "A free tool can be useful for quick checks, but paid tools tend to perform better in tests. If the stakes are high, rely on human review as well."
                  },
                  {
                    q: "Can I trust multiple tools more than one?",
                    a: "Not always. Different tools can give opposite answers on the same text. Using many tools can make you cherry‑pick the result you already believed."
                  },
                  {
                    q: "Why do detectors flag non‑native writers?",
                    a: "Signals like perplexity and burstiness read writing style. Non‑native patterns can look 'machine‑like' to the math and trigger false flags, even when the work is honest."
                  },
                  {
                    q: "Can detectors spot mixed content?",
                    a: "It is hard. When a paper has both human and AI parts, the score may flip across sections. A single percentage can hide the mix."
                  },
                  {
                    q: "How can I avoid false flags?",
                    a: "Keep drafts, add personal examples, cite sources, and revise bland sections. If flagged, be ready to show your process and discuss your choices."
                  },
                  {
                    q: "Is AI content bad for SEO?",
                    a: "Not by itself. What matters is quality, intent, and expertise. Thin, repeated pages get punished. Expert‑edited, helpful pages can rank well."
                  },
                  {
                    q: "When should a school use an AI detector?",
                    a: "Use it to triage and start a conversation, not to make final decisions. Ask for drafts and hold short checks where students explain their work."
                  },
                  {
                    q: "Are there cases where a free AI detector is enough?",
                    a: "Yes. For low‑risk, early screening, a free check can help you spot drafts that need more human touch. For high‑risk calls, add expert review."
                  }
                ].map((faq, index) => (
                  <details key={index} className="bg-white rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all cursor-pointer group">
                    <summary className="text-lg font-bold text-gray-900 cursor-pointer list-none flex items-start gap-3">
                      <span className="text-blue-600 flex-shrink-0 text-2xl group-open:rotate-90 transition-transform">›</span>
                      <span className="flex-1">{faq.q}</span>
                    </summary>
                    <div className="mt-4 pl-9 text-gray-700 leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* Key Takeaways */}
            <section className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 border-2 border-yellow-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">🎯 Key Takeaways</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "An AI detector gives a probability, not proof",
                  "Results vary a lot between tools and contexts",
                  "False positives hit non‑native writers and even historic texts",
                  "Free tools are useful, but paid tools tend to perform better",
                  "In SEO, AI can help or hurt - quality and expert review decide",
                  "Use detectors as part of a fair process, never as the only judge"
                ].map((takeaway, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border-2 border-yellow-300 flex items-start gap-3">
                    <span className="text-yellow-600 font-bold text-xl flex-shrink-0">✓</span>
                    <p className="text-gray-800 font-medium">{takeaway}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Author Box */}
            <section className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Author Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src="/514053566_9859896344137239_4135912972890026608_n (1).jpg"
                      alt="Abdul Majeed - Developer & SEO Expert"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-blue-500 shadow-lg">
                      <User className="w-16 h-16 md:w-20 md:h-20 text-white" />
                    </div>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Abdul Majeed</h3>
                  <p className="text-lg text-gray-600 mb-4 font-medium">
                    Developer & SEO Expert | Using AI Tools and Automation to Drive Organic Growth
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    I use AI tools to automate SEO and drive organic growth in search engines. Building smart solutions 
                    that help websites rank better and reach more people naturally.
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <a
                      href="https://x.com/majeeddev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-semibold shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      Follow on X
                    </a>
                    
                    <a
                      href="https://www.facebook.com/abdulmajeeddevseo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                      Follow on Facebook
                    </a>
                  </div>

                  {/* Last Updated */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center md:text-left">
                      <span className="font-semibold text-gray-700">Last Updated:</span> November 1, 2025
                    </p>
                  </div>
                </div>
              </div>
            </section>
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
                  Industry-leading AI detection with detailed confidence scores and comprehensive sentence-level analysis.
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

    {/* JSON-LD Structured Data - WebSite Schema with SearchAction */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': 'https://aidetectorfree.app/#website',
          url: 'https://aidetectorfree.app/',
          name: 'AI Detector Free',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://aidetectorfree.app/?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }),
      }}
    />
    </>
  );
}
