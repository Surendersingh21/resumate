import { geminiService } from './geminiService';
import type { CVState } from '../context/CVContext';

export interface SummaryGenerationOptions {
  tone?: 'professional' | 'creative' | 'academic' | 'executive';
  length?: 'short' | 'medium' | 'long';
  focusAreas?: string[];
  targetRole?: string;
  industry?: string;
}

export interface AIGeneratedSummary {
  summary: string;
  success: boolean;
  suggestions?: string[];
}

export class ProfessionalSummaryGenerator {
  private static instance: ProfessionalSummaryGenerator;

  public static getInstance(): ProfessionalSummaryGenerator {
    if (!ProfessionalSummaryGenerator.instance) {
      ProfessionalSummaryGenerator.instance = new ProfessionalSummaryGenerator();
    }
    return ProfessionalSummaryGenerator.instance;
  }

  /**
   * Generate a professional summary using Gemini AI
   */
  async generateSummary(cvData: CVState, options: SummaryGenerationOptions = {}): Promise<AIGeneratedSummary> {
    try {
      const {
        tone = 'professional',
        length = 'medium',
        focusAreas = [],
        targetRole,
        industry
      } = options;

      // Check if Gemini is available
      const status = await geminiService.checkStatus();
      if (!status.available) {
        return {
          summary: 'AI summary generation is not available. Please configure your Gemini API key.',
          success: false
        };
      }

      // Build context from CV data
      const context = this.buildContextString(cvData);
      
      // Create intelligent prompt
      const prompt = this.createSummaryPrompt(context, tone, length, focusAreas, targetRole, industry);

      // Generate summary with Gemini
      const response = await geminiService.generateText({
        prompt,
        temperature: 0.7,
        maxOutputTokens: 500
      });

      if (!response.success) {
        return {
          summary: 'Failed to generate AI summary. Please try again.',
          success: false
        };
      }

      // Clean and format the response
      const cleanSummary = this.cleanSummaryResponse(response.response);

      return {
        summary: cleanSummary,
        success: true,
        suggestions: this.generateImprovementSuggestions(cvData)
      };

    } catch (error) {
      console.error('Error generating professional summary:', error);
      return {
        summary: 'An error occurred while generating your professional summary. Please try again.',
        success: false
      };
    }
  }

  /**
   * Generate skill-based summary suggestions
   */
  async generateSkillBasedSummary(skills: any[], targetRole?: string): Promise<AIGeneratedSummary> {
    try {
      const status = await geminiService.checkStatus();
      if (!status.available) {
        return {
          summary: 'AI summary generation is not available.',
          success: false
        };
      }

      const skillsText = skills.map(skill => `${skill.name} (${skill.level || 'Proficient'})`).join(', ');
      
      const prompt = `Create a polished professional summary emphasizing these technical skills: ${skillsText}. ${targetRole ? `Target position: ${targetRole}.` : ''} 
      
REQUIREMENTS:
- Write in third person (e.g., "Skilled professional with expertise in...")
- 80-100 words maximum
- Professional tone with proper grammar
- Highlight technical proficiency and practical application
- Include value proposition for employers
- Use action-oriented language
- Make it recruitment-ready

Generate only the summary text without quotes or additional formatting.`;

      const response = await geminiService.generateText({
        prompt,
        temperature: 0.6,
        maxOutputTokens: 300
      });

      if (!response.success) {
        return {
          summary: 'Failed to generate skill-based summary.',
          success: false
        };
      }

      return {
        summary: this.cleanSummaryResponse(response.response),
        success: true
      };

    } catch (error) {
      console.error('Error generating skill-based summary:', error);
      return {
        summary: 'Error generating skill-based summary.',
        success: false
      };
    }
  }

  /**
   * Generate experience-focused summary
   */
  async generateExperienceSummary(experience: any[]): Promise<AIGeneratedSummary> {
    try {
      const status = await geminiService.checkStatus();
      if (!status.available) {
        return {
          summary: 'AI summary generation is not available.',
          success: false
        };
      }

      const experienceText = experience.map(exp => 
        `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}): ${exp.description}`
      ).join('. ');

      const totalYears = this.calculateTotalExperience(experience);

      const prompt = `Create a professional summary based on this career experience: ${experienceText}

REQUIREMENTS:
- Write in third person (e.g., "Experienced professional with...")
- Include "${totalYears} years of experience" if calculable
- 100-120 words maximum
- Professional tone with perfect grammar
- Highlight career progression and key achievements
- Emphasize leadership, impact, and quantifiable results
- Show value proposition for future employers
- Use dynamic action words
- Make it compelling and recruitment-ready

Generate only the polished summary text without quotes or formatting.`;

      const response = await geminiService.generateText({
        prompt,
        temperature: 0.7,
        maxOutputTokens: 400
      });

      if (!response.success) {
        return {
          summary: 'Failed to generate experience-based summary.',
          success: false
        };
      }

      return {
        summary: this.cleanSummaryResponse(response.response),
        success: true
      };

    } catch (error) {
      console.error('Error generating experience summary:', error);
      return {
        summary: 'Error generating experience summary.',
        success: false
      };
    }
  }

  /**
   * Build context string from CV data
   */
  private buildContextString(cvData: CVState): string {
    let context = `Full Name: ${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}\n`;
    
    if (cvData.personalInfo.title) {
      context += `Professional Title: ${cvData.personalInfo.title}\n`;
    }

    // Add experience
    if (cvData.experience.length > 0) {
      context += `\nWork Experience:\n`;
      cvData.experience.forEach(exp => {
        context += `- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})\n`;
        context += `  ${exp.description}\n`;
      });
    }

    // Add education
    if (cvData.education.length > 0) {
      context += `\nEducation:\n`;
      cvData.education.forEach(edu => {
        context += `- ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.endDate})\n`;
      });
    }

    // Add skills
    if (cvData.skills.length > 0) {
      context += `\nSkills:\n`;
      const skillsByCategory = cvData.skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(`${skill.name} (${skill.level})`);
        return acc;
      }, {} as Record<string, string[]>);

      Object.entries(skillsByCategory).forEach(([category, skills]) => {
        context += `- ${category}: ${skills.join(', ')}\n`;
      });
    }

    return context;
  }

  /**
   * Create intelligent prompt for summary generation
   */
  private createSummaryPrompt(
    context: string, 
    tone: string, 
    length: string, 
    focusAreas: string[], 
    targetRole?: string, 
    industry?: string
  ): string {
    let prompt = `Create a polished, professional summary for a CV based on this information:\n\n${context}\n\n`;

    prompt += `REQUIREMENTS:\n`;
    prompt += `- Tone: ${tone} and engaging\n`;
    prompt += `- Length: ${length} (short=50-80 words, medium=80-120 words, long=120-150 words)\n`;
    
    if (targetRole) {
      prompt += `- Target Position: ${targetRole}\n`;
    }
    
    if (industry) {
      prompt += `- Industry Focus: ${industry}\n`;
    }

    if (focusAreas.length > 0) {
      prompt += `- Emphasize: ${focusAreas.join(', ')}\n`;
    }

    prompt += `\nWRITING GUIDELINES:\n`;
    prompt += `- Write in third person (e.g., "Results-driven professional" not "I am a results-driven professional")\n`;
    prompt += `- Start with a strong professional title/descriptor\n`;
    prompt += `- Include specific years of experience when mentioned\n`;
    prompt += `- Use precise language and proper grammar\n`;
    prompt += `- Highlight quantifiable achievements and key skills\n`;
    prompt += `- Show progression and expertise level\n`;
    prompt += `- End with value proposition for employers\n`;
    prompt += `- Use dynamic action words (e.g., "specializing", "demonstrated", "proven")\n`;
    prompt += `- Avoid redundant phrases and ensure smooth flow\n`;
    prompt += `- Make every word count - be concise yet comprehensive\n\n`;

    prompt += `EXAMPLE STRUCTURE:\n`;
    prompt += `"[Professional Title] with [X years] of experience in [field/industry]. Demonstrated expertise in [key skills/areas] with a proven track record of [specific achievements]. Known for [distinctive qualities] and [impact/results]. Seeking to leverage [expertise] to drive [value proposition] in [target role/industry]."\n\n`;

    prompt += `Generate ONLY the professional summary text. No quotes, bullets, or additional formatting. Make it recruitment-ready and compelling.`;

    return prompt;
  }

  /**
   * Clean and format the AI response
   */
  private cleanSummaryResponse(response: string): string {
    let cleaned = response
      .trim()
      .replace(/^["']|["']$/g, '') // Remove quotes
      .replace(/^\*\*Professional Summary\*\*:?\s*/i, '') // Remove title if added
      .replace(/^Summary:?\s*/i, '') // Remove "Summary:" prefix
      .replace(/^Professional Summary:?\s*/i, '') // Remove "Professional Summary:" prefix
      .replace(/\n+/g, ' ') // Replace line breaks with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\s+([,.;:])/g, '$1') // Fix spacing before punctuation
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Ensure proper sentence spacing
      .trim();

    // Ensure proper capitalization at start
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }

    // Ensure it ends with a period if it doesn't end with punctuation
    if (cleaned.length > 0 && !/[.!?]$/.test(cleaned)) {
      cleaned += '.';
    }

    return cleaned;
  }

  /**
   * Calculate total years of experience
   */
  private calculateTotalExperience(experience: any[]): string {
    if (!experience || experience.length === 0) return '';

    try {
      let totalMonths = 0;
      const currentYear = new Date().getFullYear();

      experience.forEach(exp => {
        const startYear = parseInt(exp.startDate?.split(' ')[1] || exp.startDate?.split('-')[0] || '0');
        const endYear = exp.current ? currentYear : parseInt(exp.endDate?.split(' ')[1] || exp.endDate?.split('-')[0] || '0');
        
        if (startYear && endYear && endYear >= startYear) {
          totalMonths += (endYear - startYear) * 12;
        }
      });

      const years = Math.floor(totalMonths / 12);
      return years > 0 ? `${years}+` : '';
    } catch (error) {
      console.error('Error calculating experience:', error);
      return '';
    }
  }

  /**
   * Generate improvement suggestions
   */
  private generateImprovementSuggestions(cvData: CVState): string[] {
    const suggestions: string[] = [];

    // Check for missing information
    if (!cvData.personalInfo.summary || cvData.personalInfo.summary.length < 50) {
      suggestions.push('Consider adding more detail to your professional summary');
    }

    if (cvData.experience.length === 0) {
      suggestions.push('Add work experience to strengthen your profile');
    }

    if (cvData.skills.length < 5) {
      suggestions.push('Add more relevant skills to showcase your expertise');
    }

    if (cvData.education.length === 0) {
      suggestions.push('Include your educational background');
    }

    // Check for quantifiable achievements
    const hasNumbers = cvData.experience.some(exp => 
      /\d+/.test(exp.description)
    );
    
    if (!hasNumbers) {
      suggestions.push('Include quantifiable achievements in your experience descriptions');
    }

    return suggestions;
  }
}

export default ProfessionalSummaryGenerator;