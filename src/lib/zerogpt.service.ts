import axios, { AxiosError } from 'axios';
import crypto from 'crypto';
import type {
  ZeroGPTDetectTextRequest,
  ZeroGPTDetectTextResponse,
  NormalizedDetectionResult,
  ParsedSentence,
  ZeroGPTValidationError,
  ZeroGPTServerError,
} from '@/types/zerogpt.types';

export class ZeroGPTService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly maxChars: number;

  constructor() {
    this.baseUrl = process.env.ZEROGPT_BASE_URL || 'https://api.zerogpt.com';
    this.apiKey = process.env.ZEROGPT_API_KEY!;
    this.maxChars = parseInt(process.env.MAX_TEXT_CHARS || '50000');

    if (!this.apiKey) {
      throw new Error('ZEROGPT_API_KEY environment variable is required');
    }
  }

  private buildHeaders() {
    return {
      'ApiKey': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  // ============================================
  // AI DETECTION
  // ============================================

  async detectText(inputText: string): Promise<NormalizedDetectionResult> {
    // Validation
    if (!inputText || inputText.trim().length === 0) {
      throw new Error('Input text cannot be empty');
    }

    const charCount = inputText.length;
    if (charCount > this.maxChars) {
      throw new Error(`Text exceeds maximum length of ${this.maxChars.toLocaleString()} characters (got ${charCount})`);
    }

    try {
      const requestBody: ZeroGPTDetectTextRequest = {
        input_text: inputText.trim(),
      };

      const response = await axios.post<ZeroGPTDetectTextResponse>(
        `${this.baseUrl}/api/detect/detectText`,
        requestBody,
        {
          headers: this.buildHeaders(),
          timeout: 30000, // 30 seconds
          validateStatus: (status) => status < 600,
        }
      );

      // Check provider response status
      if (!response.data.success || response.data.code !== 200) {
        throw new Error(response.data.message || 'Detection failed');
      }

      return this.normalizeDetectionResponse(response.data);
    } catch (error) {
      throw this.handleProviderError(error);
    }
  }

  private normalizeDetectionResponse(raw: ZeroGPTDetectTextResponse): NormalizedDetectionResult {
    const data = raw.data;

    // Parse string numbers to integers
    const totalWords = parseInt(data.textWords) || 0;
    const aiWords = parseInt(data.aiWords) || 0;
    const aiProbability = parseFloat(data.fakePercentage) || 0;
    const humanWords = totalWords - aiWords;

    // Parse sentence arrays (they can be JSON strings or already parsed arrays!)
    let sentences: ParsedSentence[] = [];
    let highlightedSentences: string[] = [];

    try {
      // Handle both string (JSON) and already-parsed arrays
      let sentencesArray: string[];
      let highlightedArray: string[];
      
      if (Array.isArray(data.sentences)) {
        sentencesArray = data.sentences;
      } else if (typeof data.sentences === 'string') {
        sentencesArray = JSON.parse(data.sentences || '[]');
      } else {
        sentencesArray = [];
      }
      
      if (Array.isArray(data.h)) {
        highlightedArray = data.h;
      } else if (typeof data.h === 'string') {
        highlightedArray = JSON.parse(data.h || '[]');
      } else {
        highlightedArray = [];
      }

      // Map sentences and mark which ones are AI-generated
      sentences = sentencesArray.map((text: string, index: number) => ({
        text,
        isAIGenerated: highlightedArray.includes(text),
        index,
      }));

      highlightedSentences = highlightedArray;
    } catch (parseError) {
      // Continue without sentence-level details on parse error
      sentences = [];
      highlightedSentences = [];
    }

    // Determine verdict based on AI probability
    let verdict: 'AI' | 'Human' | 'Mixed';
    if (aiProbability >= 70) {
      verdict = 'AI';
    } else if (aiProbability <= 30) {
      verdict = 'Human';
    } else {
      verdict = 'Mixed';
    }

    // Determine confidence level
    let confidence: 'High' | 'Medium' | 'Low';
    if (aiProbability >= 80 || aiProbability <= 20) {
      confidence = 'High';
    } else if (aiProbability >= 60 || aiProbability <= 40) {
      confidence = 'Medium';
    } else {
      confidence = 'Low';
    }

    return {
      verdict,
      aiProbability: Math.round(aiProbability * 10) / 10, // Round to 1 decimal
      confidence,
      feedback: data.feedback || this.generateDetectionFeedback(verdict, aiProbability),
      totalWords,
      aiWords,
      humanWords,
      sentences,
      highlightedSentences,
      resultId: data.id,
      checkedAt: new Date(),
      provider: 'zerogpt',
      raw: {
        originalText: data.originalParagraph,
        preprocessedText: data.input_text,
      },
    };
  }

  private generateDetectionFeedback(verdict: string, probability: number): string {
    if (verdict === 'AI') {
      return `Your text is most likely written by AI (${probability.toFixed(1)}% AI probability).`;
    } else if (verdict === 'Human') {
      return `Your text appears to be human-written (${probability.toFixed(1)}% AI probability).`;
    } else {
      return `Your text contains a mix of AI and human-written content (${probability.toFixed(1)}% AI probability).`;
    }
  }

  // ============================================
  // ERROR HANDLING
  // ============================================

  private handleAPIError(status: number, data: any): Error {
    // Handle 422 Validation Errors
    if (status === 422) {
      const validationError = data as ZeroGPTValidationError;
      if (validationError.detail && validationError.detail.length > 0) {
        const firstError = validationError.detail[0];
        return new Error(`Validation error: ${firstError.msg} (${firstError.type})`);
      }
      return new Error('Invalid request format');
    }

    // Handle 500 Server Errors
    if (status === 500) {
      const serverError = data as ZeroGPTServerError;
      return new Error(serverError.message || 'Detection service error');
    }

    // Generic error
    return new Error(data.message || `API error: ${status}`);
  }

  private handleProviderError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;

      // Handle specific HTTP status codes
      if (axiosError.response) {
        const status = axiosError.response.status;
        const data = axiosError.response.data;

        switch (status) {
          case 401:
            return new Error('API authentication failed. Please check your API key.');
          case 403:
            return new Error('Access forbidden. Ensure your server IP is whitelisted.');
          case 413:
            return new Error('Content too large. Maximum 50,000 characters allowed.');
          case 422:
            return this.handleAPIError(422, data);
          case 429:
            return new Error('Rate limit exceeded. Please try again later.');
          case 500:
            return this.handleAPIError(500, data);
          case 502:
          case 503:
            return new Error('Detection service temporarily unavailable. Please try again.');
          default:
            return new Error(data?.message || `Provider error: ${status}`);
        }
      }

      // Network errors
      if (axiosError.code === 'ECONNABORTED') {
        return new Error('Request timeout. The detection took too long.');
      }

      if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'ECONNREFUSED') {
        return new Error('Cannot reach detection service. Please check your connection.');
      }
    }

    // Generic error
    return error instanceof Error ? error : new Error('An unexpected error occurred during detection.');
  }

  // ============================================
  // UTILITIES
  // ============================================

  generateTextHash(text: string): string {
    return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex');
  }
}
