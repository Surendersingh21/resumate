import { useState } from 'react';
import { Button } from './button';
import { Textarea } from './textarea';
import { Label } from './label';
import { Card, CardContent, CardHeader, CardTitle } from './card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Sparkles, Loader2, RefreshCw, Copy, Check } from 'lucide-react';
import { useCVContext } from '../../context/CVContext';
import ProfessionalSummaryGenerator, { type SummaryGenerationOptions } from '../../utils/professionalSummaryGenerator';

export function AIProfessionalSummary() {
  const { state, dispatch } = useCVContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  
  // Generation options
  const [tone, setTone] = useState<'professional' | 'creative' | 'academic' | 'executive'>('professional');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [targetRole, setTargetRole] = useState('');
  const [industry, setIndustry] = useState('');

  const summaryGenerator = ProfessionalSummaryGenerator.getInstance();

  const handleGenerateSummary = async () => {
    if (!state.personalInfo.firstName) {
      alert('Please fill in your basic information first');
      return;
    }

    setIsGenerating(true);
    try {
      const options: SummaryGenerationOptions = {
        tone,
        length,
        targetRole: targetRole || undefined,
        industry: industry || undefined,
        focusAreas: []
      };

      const result = await summaryGenerator.generateSummary(state, options);
      
      if (result.success) {
        setGeneratedSummary(result.summary);
        setSuggestions(result.suggestions || []);
      } else {
        console.error('AI Summary generation failed:', result.summary);
        alert(`Failed to generate AI summary: ${result.summary}`);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      alert(`Failed to generate AI summary. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSkillBased = async () => {
    if (state.skills.length === 0) {
      alert('Please add some skills first');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await summaryGenerator.generateSkillBasedSummary(
        state.skills, 
        targetRole || undefined
      );
      
      if (result.success) {
        setGeneratedSummary(result.summary);
      } else {
        alert(result.summary);
      }
    } catch (error) {
      console.error('Error generating skill-based summary:', error);
      alert('Failed to generate skill-based summary.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateExperienceBased = async () => {
    if (state.experience.length === 0) {
      alert('Please add some work experience first');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await summaryGenerator.generateExperienceSummary(state.experience);
      
      if (result.success) {
        setGeneratedSummary(result.summary);
      } else {
        alert(result.summary);
      }
    } catch (error) {
      console.error('Error generating experience-based summary:', error);
      alert('Failed to generate experience-based summary.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseSummary = () => {
    if (generatedSummary) {
      dispatch({
        type: 'UPDATE_PERSONAL_INFO',
        payload: { summary: generatedSummary }
      });
      setGeneratedSummary(''); // Clear after use
    }
  };

  const handleCopySummary = async () => {
    if (generatedSummary) {
      await navigator.clipboard.writeText(generatedSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Professional Summary Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Summary */}
        <div>
          <Label htmlFor="current-summary">Current Summary</Label>
          <Textarea
            id="current-summary"
            placeholder="Your current professional summary will appear here..."
            value={state.personalInfo.summary}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_PERSONAL_INFO',
                payload: { summary: e.target.value }
              })
            }
            rows={4}
            className="mt-2"
          />
        </div>

        {/* Generation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Tone</Label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="professional">Professional</option>
              <option value="creative">Creative</option>
              <option value="academic">Academic</option>
              <option value="executive">Executive</option>
            </select>
          </div>

          <div>
            <Label>Length</Label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="short">Short (50-80 words)</option>
              <option value="medium">Medium (80-120 words)</option>
              <option value="long">Long (120-150 words)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="target-role">Target Role (Optional)</Label>
            <input
              id="target-role"
              type="text"
              placeholder="e.g., Senior Software Engineer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <Label htmlFor="industry">Industry (Optional)</Label>
            <input
              id="industry"
              type="text"
              placeholder="e.g., Technology, Healthcare"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Generation Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate Summary
          </Button>

          <Button
            onClick={handleGenerateSkillBased}
            disabled={isGenerating || state.skills.length === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Skill-Based
          </Button>

          <Button
            onClick={handleGenerateExperienceBased}
            disabled={isGenerating || state.experience.length === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Experience-Based
          </Button>
        </div>

        {/* Generated Summary */}
        {generatedSummary && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-green-800 font-medium">✨ AI Generated Summary</Label>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopySummary}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button onClick={handleUseSummary} size="sm">
                  Use This Summary
                </Button>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{generatedSummary}</p>
            
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-green-200">
                <Label className="text-green-800 font-medium text-sm">💡 Improvement Suggestions:</Label>
                <ul className="mt-2 text-sm text-green-700 space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          <p>🚀 <strong>Powered by Gemini AI</strong> - Generates personalized professional summaries based on your experience, skills, and career goals.</p>
        </div>
      </CardContent>
    </Card>
  );
}