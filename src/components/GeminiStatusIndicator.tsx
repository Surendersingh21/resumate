import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { checkGeminiSetup } from '@/utils/geminiService';
import type { GeminiStatus } from '@/utils/geminiService';
import { CheckCircle, AlertCircle, ExternalLink, Key } from 'lucide-react';

export const GeminiStatusIndicator = () => {
  const [status, setStatus] = useState<GeminiStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await checkGeminiSetup();
        setStatus(result);
      } catch (error) {
        setStatus({
          available: false,
          message: 'Failed to check Gemini AI status'
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-2">
        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
        Checking Gemini AI...
      </Badge>
    );
  }

  if (!status) {
    return (
      <Badge variant="destructive" className="flex items-center gap-2">
        <AlertCircle className="h-3 w-3" />
        Status Unknown
      </Badge>
    );
  }

  if (status.available) {
    return (
      <div className="flex flex-col gap-2">
        <Badge variant="default" className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
          <CheckCircle className="h-3 w-3" />
          Gemini AI Ready ({status.model})
        </Badge>
        {status.message && (
          <p className="text-xs text-muted-foreground">{status.message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Badge variant="destructive" className="flex items-center gap-2">
        <AlertCircle className="h-3 w-3" />
        Gemini AI Not Available
      </Badge>
      
      <div className="text-sm space-y-2">
        <p className="text-muted-foreground">{status.message}</p>
        
        <div className="bg-muted p-3 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Key className="h-4 w-4" />
            Setup Instructions:
          </h4>
          <ol className="text-xs space-y-1 text-muted-foreground list-decimal list-inside">
            <li>
              Get your API key from{' '}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Google AI Studio <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>Add <code className="bg-muted-foreground/20 px-1 rounded">VITE_GEMINI_API_KEY=your_key_here</code> to your .env.local file</li>
            <li>Restart the development server</li>
            <li>Refresh this page to verify the connection</li>
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
          <h4 className="font-medium mb-1 text-blue-800">💡 Features with Gemini AI:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• AI-powered CV content generation</li>
            <li>• Smart skill suggestions</li>
            <li>• Professional summary writing</li>
            <li>• Job description optimization</li>
          </ul>
        </div>
      </div>
    </div>
  );
};