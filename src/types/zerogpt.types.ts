// ============================================
// AI DETECTION TYPES
// ============================================

export interface ZeroGPTDetectTextRequest {
  input_text: string;
}

export interface ZeroGPTDetectTextResponse {
  code: number;
  success: boolean;
  message: string;
  data: ZeroGPTDetectionData;
}

export interface ZeroGPTDetectionData {
  input_text: string;              // Preprocessed/normalized input
  originalParagraph: string;       // Original input as-is
  textWords: string;               // Total word count (string format!)
  aiWords: string;                 // AI-generated word count (string format!)
  fakePercentage: string;          // AI probability 0-100 (string format!)
  sentences: string;               // JSON array of extracted sentences
  h: string;                       // JSON array of highlighted AI sentences
  collection_id: string;           // Batch collection ID (empty for single)
  fileName: string;                // File name (empty for text input)
  id: string;                      // Unique result ID for PDF export
  feedback: string;                // Human-readable verdict message
}

export interface ParsedSentence {
  text: string;
  isAIGenerated: boolean;
  index: number;
}

export interface NormalizedDetectionResult {
  // Core verdict
  verdict: 'AI' | 'Human' | 'Mixed';
  aiProbability: number;           // 0-100 (parsed from string)
  confidence: 'High' | 'Medium' | 'Low';
  feedback: string;                // ZeroGPT's human-readable message
  
  // Word analysis
  totalWords: number;              // Parsed from textWords
  aiWords: number;                 // Parsed from aiWords
  humanWords: number;              // Calculated: totalWords - aiWords
  
  // Sentence-level details
  sentences: ParsedSentence[];     // Parsed from sentences string
  highlightedSentences: string[];  // Parsed from h string (AI-likely sentences)
  
  // Metadata
  resultId: string;                // ZeroGPT's ID for PDF export
  checkedAt: Date;
  provider: 'zerogpt';
  
  // Raw data preservation (optional)
  raw?: {
    originalText: string;          // originalParagraph
    preprocessedText: string;      // input_text
  };
}


// ============================================
// ERROR RESPONSE TYPES
// ============================================

export interface ZeroGPTValidationError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

export interface ZeroGPTServerError {
  success: string;
  code: number;
  message: string;
}

// ============================================
// API RESPONSE TYPES (Our Backend)
// ============================================

export interface APISuccessResponse<T> {
  success: true;
  source: 'cache' | 'provider';
  data: T;
  metadata?: {
    chars: number;
    words: number;
    latency?: string;
  };
}

export interface APIErrorResponse {
  success: false;
  error: string;
  hint?: string;
}

export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;
