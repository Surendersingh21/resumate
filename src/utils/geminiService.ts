import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini configuration
const DEFAULT_MODEL = 'gemini-1.5-flash'; // Updated model name

export interface GeminiRequest {
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GeminiResponse {
  response: string;
  success: boolean;
}

export interface GeminiStatus {
  available: boolean;
  model?: string;
  message?: string;
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('Gemini API Key loaded:', this.apiKey ? `Yes (${this.apiKey.substring(0, 10)}...)` : 'No');
    
    if (this.apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ 
          model: DEFAULT_MODEL,
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          }
        });
        console.log('Gemini AI initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Gemini AI:', error);
      }
    } else {
      console.error('VITE_GEMINI_API_KEY environment variable not found');
    }
  }

  /**
   * Check if Gemini AI is configured and available
   */
  async checkStatus(): Promise<GeminiStatus> {
    if (!this.apiKey) {
      return {
        available: false,
        message: 'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env.local file.'
      };
    }

    if (!this.genAI || !this.model) {
      return {
        available: false,
        message: 'Failed to initialize Gemini AI. Please check your API key.'
      };
    }

    // Don't make test API calls during status check to avoid errors
    // Just return that it's configured if we have API key and model
    return {
      available: true,
      model: DEFAULT_MODEL,
      message: 'Gemini AI is configured'
    };
  }

  /**
   * Generate text using Gemini AI
   */
  async generateText(request: GeminiRequest): Promise<GeminiResponse> {
    console.log('Gemini generateText called with:', { hasApiKey: !!this.apiKey, hasModel: !!this.model });
    
    if (!this.apiKey) {
      console.error('Gemini API key not found');
      return {
        response: 'Gemini AI is not configured. Please add your API key to .env.local',
        success: false
      };
    }

    if (!this.model) {
      console.error('Gemini model not initialized');
      return {
        response: 'Gemini AI model failed to initialize',
        success: false
      };
    }

    try {
      // Configure generation parameters
      if (request.temperature !== undefined || request.maxOutputTokens !== undefined) {
        this.model = this.genAI!.getGenerativeModel({ 
          model: DEFAULT_MODEL,
          generationConfig: {
            temperature: request.temperature || 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: request.maxOutputTokens || 2048,
          }
        });
      }

      console.log('Making Gemini API call with prompt length:', request.prompt.length);
      const result = await this.model.generateContent(request.prompt);
      const response = await result.response;
      const text = response.text();

      console.log('Gemini API call successful, response length:', text.length);
      return {
        response: text,
        success: true
      };
    } catch (error: any) {
      console.error('Gemini generation error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to generate content with Gemini AI';
      
      if (error.message?.includes('API key')) {
        errorMessage = 'Invalid Gemini API key. Please check your configuration.';
      } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
        errorMessage = 'Gemini API quota exceeded. Please try again later.';
      } else if (error.message?.includes('400')) {
        errorMessage = 'Invalid request to Gemini API. Please check your API key configuration.';
      }
      
      return {
        response: errorMessage,
        success: false
      };
    }
  }

  /**
   * Generate streaming response (for future use)
   */
  async *generateStream(request: GeminiRequest): AsyncGenerator<string, void, unknown> {
    if (!this.model) {
      yield 'Error: Gemini AI not initialized';
      return;
    }

    try {
      const result = await this.model.generateContentStream(request.prompt);
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          yield chunkText;
        }
      }
    } catch (error: any) {
      yield `Error: ${error.message || 'Unknown error'}`;
    }
  }

  /**
   * Get available models (for future expansion)
   */
  getAvailableModels(): string[] {
    return [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro'
    ];
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

// Export convenience function for status checking
export const checkGeminiSetup = async (): Promise<GeminiStatus> => {
  return await geminiService.checkStatus();
};