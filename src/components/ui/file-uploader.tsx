import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Image, File, AlertCircle, Loader2, X } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { extractTextFromFile, parseExtractedText, analyzeCVContent } from '@/utils/cvAnalyzer';
import type { ExtractedCVData } from '@/utils/cvAnalyzer';

interface FileUploaderProps {
  onFileAnalyzed: (analysisResult: any) => void;
  className?: string;
}

export function FileUploader({ onFileAnalyzed, className }: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif'
    ];
    
    const fileName = file.name.toLowerCase();
    const isTextFile = file.type === 'text/plain' || fileName.endsWith('.txt');
    
    if (!allowedTypes.includes(file.type) && !isTextFile) {
      return 'Unsupported file type. Please use PDF, Word, TXT, or image files.';
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return 'File size must be less than 10MB.';
    }
    
    return null;
  };

  const enhanceWithAI = async (parsedData: ExtractedCVData): Promise<Partial<ExtractedCVData>> => {
    // AI enhancement disabled for now, return parsed data as-is
    return parsedData;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploadedFile(file);
    processFile(file);
  };

  const processFile = async (file: File) => {
    try {
      setIsAnalyzing(true);

      const extractedText = await extractTextFromFile(file);
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from this file.');
      }
      
      if (extractedText.trim().length < 50) {
        throw new Error('Extracted text seems too short. Please ensure your file contains meaningful CV content.');
      }

      const parsedData = parseExtractedText(extractedText);
      const analysisResult = analyzeCVContent(parsedData);

      let aiEnhancedData: Partial<ExtractedCVData> = {};
      try {
        aiEnhancedData = await enhanceWithAI(parsedData);
      } catch (aiError) {
        aiEnhancedData = parsedData;
      }

      const finalAnalysis = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        extractedText: extractedText,
        personalInfo: aiEnhancedData.personalInfo || parsedData.personalInfo,
        experience: aiEnhancedData.experience || parsedData.experience,
        education: aiEnhancedData.education || parsedData.education,
        skills: aiEnhancedData.skills || parsedData.skills,
        suggestions: analysisResult.suggestions,
        score: analysisResult.score
      };

      onFileAnalyzed(finalAnalysis);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetUploader = () => {
    setUploadedFile(null);
    setIsAnalyzing(false);
    setError(null);
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return <FileText className="h-5 w-5 text-destructive" />;
    if (file.type.includes('image')) return <Image className="h-5 w-5 text-primary" />;
    if (file.type.includes('word') || file.type.includes('document')) return <FileText className="h-5 w-5 text-primary" />;
    return <File className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardContent className="p-6">
        {!uploadedFile && !isAnalyzing ? (
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
              ${isDragOver 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50 hover:bg-muted'
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Upload Your Existing CV</h3>
            <p className="text-muted-foreground mb-6">
              Drag and drop your CV file here, or click to browse your files
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                PDF, Word
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                JPG, PNG
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                TXT
              </span>
            </div>
            
            <Button variant="outline" size="sm">
              Choose File to Upload
            </Button>
            
            <p className="text-xs text-muted-foreground mt-4">
              Maximum file size: 10MB
            </p>
          </div>
        ) : isAnalyzing ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Analyzing Your CV...</h3>
              <p className="text-muted-foreground text-sm">
                Extracting information and providing suggestions
              </p>
            </div>
          </div>
        ) : uploadedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                {getFileIcon(uploadedFile)}
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetUploader}
                className="text-destructive hover:text-destructive/80"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm text-destructive whitespace-pre-line">{error}</div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
        />
      </CardContent>
    </Card>
  );
}

export const CVUploader = FileUploader;
