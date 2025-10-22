import { NextRequest, NextResponse } from 'next/server';
import { ZeroGPTService } from '@/lib/zerogpt.service';
import { validateIPWhitelist, extractClientIP } from '@/lib/ip-whitelist';
import type { APIResponse, NormalizedDetectionResult } from '@/types/zerogpt.types';

// Simple in-memory cache (for MVP; replace with Redis in production)
const cache = new Map<string, { data: NormalizedDetectionResult; timestamp: number }>();
const CACHE_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '86400') * 1000; // 24 hours

// Simple rate limiting (for MVP; replace with Redis in production)
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT_DETECT || '10');
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimits.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (limit.count >= RATE_LIMIT) {
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 🔒 SECURITY: Validate IP whitelist first
    const ipError = validateIPWhitelist(request);
    if (ipError) {
      return NextResponse.json<APIResponse<never>>(
        {
          success: false,
          error: ipError,
        },
        { status: 403 } // Forbidden
      );
    }

    // Get client IP for rate limiting
    const ip = extractClientIP(request);

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json<APIResponse<never>>(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { text } = body;

    // Input validation
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json<APIResponse<never>>(
        {
          success: false,
          error: 'Text input is required',
        },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();
    const charCount = trimmedText.length;
    const wordCount = trimmedText.split(/\s+/).filter(Boolean).length;
    const maxChars = parseInt(process.env.MAX_TEXT_CHARS || '50000');

    // Character limit check
    if (charCount > maxChars) {
      return NextResponse.json<APIResponse<never>>(
        {
          success: false,
          error: `Text exceeds maximum length of ${maxChars.toLocaleString()} characters (${charCount} provided)`,
        },
        { status: 400 }
      );
    }

    // Initialize service
    const zerogpt = new ZeroGPTService();

    // Generate hash for caching
    const textHash = zerogpt.generateTextHash(trimmedText);

    // Check cache
    const cached = cache.get(textHash);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json<APIResponse<NormalizedDetectionResult>>(
        {
          success: true,
          source: 'cache',
          data: cached.data,
          metadata: {
            chars: charCount,
            words: wordCount,
          },
        },
        { status: 200 }
      );
    }

    // Call ZeroGPT API
    const result = await zerogpt.detectText(trimmedText);
    const latency = Date.now() - startTime;

    // Cache the result
    cache.set(textHash, { data: result, timestamp: Date.now() });

    // Clean old cache entries (simple cleanup)
    if (cache.size > 1000) {
      const now = Date.now();
      for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          cache.delete(key);
        }
      }
    }

    return NextResponse.json<APIResponse<NormalizedDetectionResult>>(
      {
        success: true,
        source: 'provider',
        data: result,
        metadata: {
          chars: charCount,
          words: wordCount,
          latency: `${latency}ms`,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Detection API error:', error);

    const message = error instanceof Error ? error.message : 'An error occurred during detection';

    return NextResponse.json<APIResponse<never>>(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
