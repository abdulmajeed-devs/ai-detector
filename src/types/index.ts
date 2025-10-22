// This file defines TypeScript types and interfaces used throughout the application.

export interface AIDetectionRequest {
    text: string;
}

export interface AIDetectionResponse {
    isAI: boolean;
    score: number;
    explanation: string;
}