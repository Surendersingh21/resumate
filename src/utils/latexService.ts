import type { CVData } from '../types/cv';

export interface LaTeXTemplate {
  name: string;
  template: string;
  description: string;
}

export interface LaTeXFormattingRequest {
  cvData: CVData;
  templateName: string;
  customizations?: {
    colorScheme?: string;
    fontSize?: string;
    spacing?: string;
    layout?: string;
  };
}

export class LaTeXService {
  private static instance: LaTeXService;

  public static getInstance(): LaTeXService {
    if (!LaTeXService.instance) {
      LaTeXService.instance = new LaTeXService();
    }
    return LaTeXService.instance;
  }

  // Professional LaTeX CV templates
  private templates: Record<string, LaTeXTemplate> = {
    modern: {
      name: 'Modern Professional',
      description: 'Clean, modern layout with accent colors',
      template: `
\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{banking}
\\moderncvcolor{blue}
\\usepackage[utf8]{inputenc}
\\usepackage[scale=0.75]{geometry}

\\name{{{NAME}}}{{}}
\\title{{{TITLE}}}
\\address{{{ADDRESS}}}
\\phone[mobile]{{{PHONE}}}
\\email{{{EMAIL}}}
\\social[linkedin]{{{LINKEDIN}}}
\\social[github]{{{GITHUB}}}

\\begin{document}
\\makecvtitle

% Professional Summary
\\section{Professional Summary}
{{SUMMARY}}

% Experience
\\section{Experience}
{{EXPERIENCE}}

% Education  
\\section{Education}
{{EDUCATION}}

% Skills
\\section{Skills}
{{SKILLS}}

% Languages
{{LANGUAGES}}

% Awards
{{AWARDS}}

\\end{document}`
    },
    academic: {
      name: 'Academic',
      description: 'Traditional academic CV format',
      template: `
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}

\\titleformat{\\section}{\\Large\\bfseries}{}{0em}{}[\\titlerule]
\\titleformat{\\subsection}{\\large\\bfseries}{}{0em}{}

\\begin{document}

\\begin{center}
{\\Huge\\textbf{{{NAME}}}}\\\\[0.3cm]
{\\large {{TITLE}}}\\\\[0.2cm]
{{ADDRESS}} $|$ {{PHONE}} $|$ {{EMAIL}}\\\\
{{LINKEDIN}} $|$ {{GITHUB}}
\\end{center}

\\section{Summary}
{{SUMMARY}}

\\section{Education}
{{EDUCATION}}

\\section{Experience}
{{EXPERIENCE}}

\\section{Skills}
{{SKILLS}}

\\section{Publications}
{{PUBLICATIONS}}

\\section{Awards \\& Honors}
{{AWARDS}}

\\end{document}`
    },
    creative: {
      name: 'Creative',
      description: 'Colorful, creative layout for design roles',
      template: `
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{xcolor}
\\usepackage{fontawesome}
\\usepackage{tikz}

\\definecolor{primary}{RGB}{41, 128, 185}
\\definecolor{secondary}{RGB}{52, 73, 94}

\\begin{document}

% Header with color background
\\begin{tikzpicture}[remember picture,overlay]
\\fill[primary] (current page.north west) rectangle ([yshift=-3cm]current page.north east);
\\end{tikzpicture}

\\vspace{1cm}
\\begin{center}
{\\Huge\\textcolor{white}{\\textbf{{{NAME}}}}}\\\\[0.3cm]
{\\Large\\textcolor{white}{{{TITLE}}}}
\\end{center}

\\vspace{2cm}

\\section*{\\textcolor{primary}{Contact}}
\\faPhone\\ {{PHONE}} $|$ \\faEnvelope\\ {{EMAIL}}\\\\
\\faLinkedin\\ {{LINKEDIN}} $|$ \\faGithub\\ {{GITHUB}}

\\section*{\\textcolor{primary}{About Me}}
{{SUMMARY}}

\\section*{\\textcolor{primary}{Experience}}
{{EXPERIENCE}}

\\section*{\\textcolor{primary}{Skills}}
{{SKILLS}}

\\section*{\\textcolor{primary}{Education}}
{{EDUCATION}}

\\end{document}`
    }
  };

  /**
   * Generate LaTeX code for a CV with Gemini AI formatting
   */
  async generateLaTeXWithGemini(request: LaTeXFormattingRequest): Promise<string> {
    try {
      const { cvData, templateName, customizations } = request;
      const template = this.templates[templateName] || this.templates.modern;
      
      // Try to use Gemini AI for enhanced formatting
      let latexCode = await this.generateEnhancedLaTeX(cvData, template);
      
      // Apply customizations
      if (customizations) {
        latexCode = this.applyCustomizations(latexCode, customizations);
      }

      return latexCode;
    } catch (error) {
      console.error('Error generating LaTeX:', error);
      return this.generateBasicLaTeX(request.cvData, this.templates[request.templateName]);
    }
  }

  /**
   * Generate enhanced LaTeX with Gemini AI assistance
   */
  private async generateEnhancedLaTeX(cvData: CVData, template: LaTeXTemplate): Promise<string> {
    try {
      // Check if Gemini is available
      const { geminiService } = await import('./geminiService');
      const status = await geminiService.checkStatus();
      
      if (status.available) {
        console.log('Using Gemini AI for LaTeX enhancement...');
        return await this.generateAIEnhancedLaTeX(cvData, template, geminiService);
      } else {
        console.log('Gemini AI not available, using basic formatting');
      }
    } catch (error) {
      console.log('Gemini AI enhancement failed, falling back to basic formatting:', error);
    }
    
    return this.generateBasicLaTeX(cvData, template);
  }

  /**
   * Generate LaTeX with AI-enhanced content
   */
  private async generateAIEnhancedLaTeX(cvData: CVData, template: LaTeXTemplate, geminiService: any): Promise<string> {
    let latexCode = template.template;
    
    // Basic info replacements
    latexCode = latexCode.replace(/\{\{NAME\}\}/g, this.escapeLatex(cvData.personalInfo.fullName));
    latexCode = latexCode.replace(/\{\{TITLE\}\}/g, ''); 
    latexCode = latexCode.replace(/\{\{EMAIL\}\}/g, this.escapeLatex(cvData.personalInfo.email));
    latexCode = latexCode.replace(/\{\{PHONE\}\}/g, this.escapeLatex(cvData.personalInfo.phone));
    latexCode = latexCode.replace(/\{\{ADDRESS\}\}/g, this.escapeLatex(cvData.personalInfo.location || ''));
    latexCode = latexCode.replace(/\{\{LINKEDIN\}\}/g, this.escapeLatex(cvData.personalInfo.linkedIn || ''));
    latexCode = latexCode.replace(/\{\{GITHUB\}\}/g, this.escapeLatex(cvData.personalInfo.github || ''));

    // AI-enhanced sections
    try {
      // Enhanced professional summary
      if (cvData.professionalSummary) {
        const summaryPrompt = `Rewrite this professional summary for a LaTeX CV to be more impactful and concise. Keep it under 3 sentences and make it compelling for recruiters: ${cvData.professionalSummary}`;
        const summaryResult = await geminiService.generateText({ prompt: summaryPrompt, temperature: 0.6 });
        if (summaryResult.success) {
          latexCode = latexCode.replace(/\{\{SUMMARY\}\}/g, this.escapeLatex(summaryResult.response));
        } else {
          latexCode = latexCode.replace(/\{\{SUMMARY\}\}/g, this.escapeLatex(cvData.professionalSummary));
        }
      } else {
        latexCode = latexCode.replace(/\{\{SUMMARY\}\}/g, '');
      }

      // Enhanced experience section
      if (cvData.workExperience.length > 0) {
        const experiencePrompt = `Format this work experience for a professional LaTeX CV. For each role, create a \\cventry with: dates, position, company, and 2-3 bullet points of key achievements. Use action verbs and quantify results where possible:\n\n${JSON.stringify(cvData.workExperience, null, 2)}`;
        const experienceResult = await geminiService.generateText({ prompt: experiencePrompt, temperature: 0.7 });
        if (experienceResult.success) {
          latexCode = latexCode.replace(/\{\{EXPERIENCE\}\}/g, experienceResult.response);
        } else {
          const basicExp = cvData.workExperience.map(exp => 
            `\\cventry{${exp.startDate} -- ${exp.endDate || 'Present'}}{${this.escapeLatex(exp.position)}}{${this.escapeLatex(exp.company)}}{}{}{${this.escapeLatex(exp.description)}}`
          ).join('\n');
          latexCode = latexCode.replace(/\{\{EXPERIENCE\}\}/g, basicExp);
        }
      } else {
        latexCode = latexCode.replace(/\{\{EXPERIENCE\}\}/g, '');
      }

      // Enhanced skills section
      if (cvData.skills.length > 0) {
        const skillsPrompt = `Organize these skills for a LaTeX CV. Group by category (Technical, Programming, Tools, etc.) and format as \\cvitem entries. Make it concise and professional: ${cvData.skills.map(s => s.name).join(', ')}`;
        const skillsResult = await geminiService.generateText({ prompt: skillsPrompt, temperature: 0.5 });
        if (skillsResult.success) {
          latexCode = latexCode.replace(/\{\{SKILLS\}\}/g, skillsResult.response);
        } else {
          latexCode = latexCode.replace(/\{\{SKILLS\}\}/g, `\\cvitem{Skills}{${cvData.skills.map(skill => this.escapeLatex(skill.name)).join(', ')}}`);
        }
      } else {
        latexCode = latexCode.replace(/\{\{SKILLS\}\}/g, '');
      }

      // Basic education section
      const educationText = cvData.education.map(edu => 
        `\\cventry{${edu.endDate || 'Present'}}{${this.escapeLatex(edu.degree)}}{${this.escapeLatex(edu.institution)}}{}{}{}`
      ).join('\n');
      latexCode = latexCode.replace(/\{\{EDUCATION\}\}/g, educationText);

      // Basic languages section
      if (cvData.languages.length > 0) {
        const languagesText = `\\section{Languages}\n${cvData.languages.map(lang => 
          `\\cvitem{${this.escapeLatex(lang.name)}}{${this.escapeLatex(lang.proficiency)}}`
        ).join('\n')}`;
        latexCode = latexCode.replace(/\{\{LANGUAGES\}\}/g, languagesText);
      } else {
        latexCode = latexCode.replace(/\{\{LANGUAGES\}\}/g, '');
      }

      latexCode = latexCode.replace(/\{\{AWARDS\}\}/g, ''); // Not in CVData type

    } catch (aiError) {
      console.warn('AI enhancement failed for some sections:', aiError);
      // Fallback to basic formatting for failed sections
      const basicSections = this.formatSectionsBasic(cvData);
      latexCode = latexCode.replace(/\{\{SUMMARY\}\}/g, basicSections.summary);
      latexCode = latexCode.replace(/\{\{EXPERIENCE\}\}/g, basicSections.experience);
      latexCode = latexCode.replace(/\{\{EDUCATION\}\}/g, basicSections.education);
      latexCode = latexCode.replace(/\{\{SKILLS\}\}/g, basicSections.skills);
      latexCode = latexCode.replace(/\{\{LANGUAGES\}\}/g, basicSections.languages);
      latexCode = latexCode.replace(/\{\{AWARDS\}\}/g, '');
    }

    return latexCode;
  }



  /**
   * Fallback basic formatting without AI
   */
  private formatSectionsBasic(cvData: CVData): any {
    return {
      summary: this.escapeLatex(cvData.professionalSummary || ''),
      experience: cvData.workExperience.map(exp => 
        `\\cventry{${exp.startDate} -- ${exp.endDate || 'Present'}}{${this.escapeLatex(exp.position)}}{${this.escapeLatex(exp.company)}}{}{}{${this.escapeLatex(exp.description)}}`
      ).join('\n'),
      education: cvData.education.map(edu => 
        `\\cventry{${edu.endDate || 'Present'}}{${this.escapeLatex(edu.degree)}}{${this.escapeLatex(edu.institution)}}{}{}{}`
      ).join('\n'),
      skills: `\\cvitem{Technical}{${cvData.skills.map(skill => this.escapeLatex(skill.name)).join(', ')}}`,
      languages: cvData.languages.length > 0 ? `\\section{Languages}\n${cvData.languages.map(lang => `\\cvitem{${this.escapeLatex(lang.name)}}{${this.escapeLatex(lang.proficiency)}}`).join('\n')}` : '',
      awards: '' // Awards not in CVData type, leave empty for now
    };
  }

  /**
   * Generate basic LaTeX without AI formatting
   */
  private generateBasicLaTeX(cvData: CVData, template: LaTeXTemplate): string {
    const sections = this.formatSectionsBasic(cvData);
    let latexCode = template.template;
    
    // Replace all placeholders
    latexCode = latexCode.replace(/\{\{NAME\}\}/g, this.escapeLatex(cvData.personalInfo.fullName));
    latexCode = latexCode.replace(/\{\{TITLE\}\}/g, ''); // No job title in PersonalInfo type
    latexCode = latexCode.replace(/\{\{EMAIL\}\}/g, this.escapeLatex(cvData.personalInfo.email));
    latexCode = latexCode.replace(/\{\{PHONE\}\}/g, this.escapeLatex(cvData.personalInfo.phone));
    latexCode = latexCode.replace(/\{\{ADDRESS\}\}/g, this.escapeLatex(cvData.personalInfo.location || ''));
    latexCode = latexCode.replace(/\{\{LINKEDIN\}\}/g, this.escapeLatex(cvData.personalInfo.linkedIn || ''));
    latexCode = latexCode.replace(/\{\{GITHUB\}\}/g, this.escapeLatex(cvData.personalInfo.github || ''));
    latexCode = latexCode.replace(/\{\{SUMMARY\}\}/g, sections.summary);
    latexCode = latexCode.replace(/\{\{EXPERIENCE\}\}/g, sections.experience);
    latexCode = latexCode.replace(/\{\{EDUCATION\}\}/g, sections.education);
    latexCode = latexCode.replace(/\{\{SKILLS\}\}/g, sections.skills);
    latexCode = latexCode.replace(/\{\{LANGUAGES\}\}/g, sections.languages);
    latexCode = latexCode.replace(/\{\{AWARDS\}\}/g, sections.awards);

    return latexCode;
  }

  /**
   * Apply visual customizations to LaTeX code
   */
  private applyCustomizations(latexCode: string, customizations: any): string {
    let modified = latexCode;

    if (customizations.colorScheme) {
      const colorMap: Record<string, string> = {
        blue: '\\moderncvcolor{blue}',
        green: '\\moderncvcolor{green}',
        red: '\\moderncvcolor{red}',
        purple: '\\moderncvcolor{purple}',
        grey: '\\moderncvcolor{grey}'
      };
      
      if (colorMap[customizations.colorScheme]) {
        modified = modified.replace(/\\moderncvcolor\{[^}]*\}/, colorMap[customizations.colorScheme]);
      }
    }

    if (customizations.fontSize) {
      const sizeMap: Record<string, string> = {
        small: '10pt',
        normal: '11pt',
        large: '12pt'
      };
      
      if (sizeMap[customizations.fontSize]) {
        modified = modified.replace(/\\documentclass\[([^,]*),/, `\\documentclass[${sizeMap[customizations.fontSize]},`);
      }
    }

    return modified;
  }

  /**
   * Escape special LaTeX characters
   */
  private escapeLatex(text: string): string {
    if (!text) return '';
    
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/\$/g, '\\$')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/#/g, '\\#')
      .replace(/\^/g, '\\textasciicircum{}')
      .replace(/_/g, '\\_')
      .replace(/~/g, '\\textasciitilde{}');
  }

  /**
   * Get available templates
   */
  getTemplates(): LaTeXTemplate[] {
    return Object.values(this.templates);
  }

  /**
   * Compile LaTeX to properly formatted PDF
   */
  async compileToPDF(latexCode: string): Promise<Blob> {
    try {
      const jsPDF = (await import('jspdf')).default;
      const pdf = new jsPDF();
      
      // Extract content from LaTeX code for proper formatting
      const cvContent = this.parseLatexContent(latexCode);
      
      // Professional CV formatting
      let yPos = 20;
      const leftMargin = 20;
      const pageWidth = 190;
      
      // Header - Name and Title
      if (cvContent.name) {
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        
        // Center the name
        const nameWidth = pdf.getTextWidth(cvContent.name);
        const centerX = (pdf.internal.pageSize.width - nameWidth) / 2;
        pdf.text(cvContent.name, centerX, yPos);
        yPos += 12;
        
        if (cvContent.title) {
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(60, 60, 60);
          
          const titleWidth = pdf.getTextWidth(cvContent.title);
          const titleCenterX = (pdf.internal.pageSize.width - titleWidth) / 2;
          pdf.text(cvContent.title, titleCenterX, yPos);
          yPos += 10;
        }
        
        // Add a line separator
        pdf.setLineWidth(0.5);
        pdf.setDrawColor(150, 150, 150);
        pdf.line(leftMargin, yPos, pdf.internal.pageSize.width - leftMargin, yPos);
        yPos += 8;
      }
      
      // Contact Information
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      let contactLine = '';
      if (cvContent.email) contactLine += cvContent.email;
      if (cvContent.phone) contactLine += (contactLine ? ' | ' : '') + cvContent.phone;
      if (cvContent.location) contactLine += (contactLine ? ' | ' : '') + cvContent.location;
      
      if (contactLine) {
        // Center the contact information
        const contactWidth = pdf.getTextWidth(contactLine);
        const contactCenterX = (pdf.internal.pageSize.width - contactWidth) / 2;
        pdf.text(contactLine, contactCenterX, yPos);
        yPos += 15;
      }
      
      // Professional Summary
      if (cvContent.summary && cvContent.summary.trim()) {
        yPos = this.addSection(pdf, 'PROFESSIONAL SUMMARY', cvContent.summary, yPos, leftMargin, pageWidth);
        yPos += 8;
      }
      
      // Experience
      if (cvContent.experience && cvContent.experience.length > 0) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('EXPERIENCE', leftMargin, yPos);
        
        // Add underline
        const titleWidth = pdf.getTextWidth('EXPERIENCE');
        pdf.setLineWidth(0.3);
        pdf.setDrawColor(0, 0, 0);
        pdf.line(leftMargin, yPos + 1, leftMargin + titleWidth, yPos + 1);
        yPos += 12;
        
        cvContent.experience.forEach((exp: any) => {
          if (yPos > 260) { // Add new page if needed
            pdf.addPage();
            yPos = 20;
          }
          
          // Job title and company
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(`${exp.position} | ${exp.company}`, leftMargin, yPos);
          yPos += 7;
          
          // Dates
          if (exp.dates) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(100, 100, 100);
            pdf.text(exp.dates, leftMargin, yPos);
            pdf.setTextColor(0, 0, 0);
            yPos += 6;
          }
          
          // Description with bullet points
          if (exp.description) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            
            // Split description into bullet points if it contains bullet indicators
            const descriptions = exp.description.split('•').filter((item: string) => item.trim());
            
            if (descriptions.length > 1) {
              descriptions.forEach((desc: string) => {
                if (desc.trim()) {
                  const bulletText = `• ${desc.trim()}`;
                  const lines = pdf.splitTextToSize(bulletText, pageWidth - leftMargin - 10);
                  pdf.text(lines, leftMargin + 5, yPos);
                  yPos += (lines.length * 4.5);
                }
              });
            } else {
              const lines = pdf.splitTextToSize(exp.description, pageWidth - leftMargin);
              pdf.text(lines, leftMargin, yPos);
              yPos += (lines.length * 4.5);
            }
            yPos += 3;
          }
          yPos += 2;
        });
        yPos += 6;
      }
      
      // Education
      if (cvContent.education && cvContent.education.length > 0) {
        if (yPos > 240) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('EDUCATION', leftMargin, yPos);
        
        // Add underline
        const titleWidth = pdf.getTextWidth('EDUCATION');
        pdf.setLineWidth(0.3);
        pdf.setDrawColor(0, 0, 0);
        pdf.line(leftMargin, yPos + 1, leftMargin + titleWidth, yPos + 1);
        yPos += 12;
        
        cvContent.education.forEach((edu: any) => {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(`${edu.degree} | ${edu.institution}`, leftMargin, yPos);
          yPos += 7;
          
          if (edu.year) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(100, 100, 100);
            pdf.text(edu.year, leftMargin, yPos);
            pdf.setTextColor(0, 0, 0);
            yPos += 6;
          }
          yPos += 3;
        });
        yPos += 4;
      }
      
      // Skills
      if (cvContent.skills) {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('SKILLS', leftMargin, yPos);
        
        // Add underline
        const titleWidth = pdf.getTextWidth('SKILLS');
        pdf.setLineWidth(0.3);
        pdf.setDrawColor(0, 0, 0);
        pdf.line(leftMargin, yPos + 1, leftMargin + titleWidth, yPos + 1);
        yPos += 12;
        
        // Format skills content
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        
        if (typeof cvContent.skills === 'string') {
          const lines = pdf.splitTextToSize(cvContent.skills, pageWidth - leftMargin);
          pdf.text(lines, leftMargin, yPos);
          yPos += (lines.length * 5) + 5;
        } else if (Array.isArray(cvContent.skills)) {
          const skillsText = cvContent.skills.join(' • ');
          const lines = pdf.splitTextToSize(skillsText, pageWidth - leftMargin);
          pdf.text(lines, leftMargin, yPos);
          yPos += (lines.length * 5) + 5;
        }
      }
      
      return new Blob([pdf.output('blob')], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error compiling LaTeX to PDF:', error);
      throw new Error('Failed to compile LaTeX to PDF');
    }
  }
  
  /**
   * Add a section to the PDF
   */
  private addSection(pdf: any, title: string, content: string, yPos: number, leftMargin: number, pageWidth: number): number {
    // Section title with underline
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(title, leftMargin, yPos);
    
    // Add underline
    const titleWidth = pdf.getTextWidth(title);
    pdf.setLineWidth(0.3);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(leftMargin, yPos + 1, leftMargin + titleWidth, yPos + 1);
    yPos += 10;
    
    // Section content
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    const lines = pdf.splitTextToSize(content, pageWidth - leftMargin);
    pdf.text(lines, leftMargin, yPos);
    yPos += (lines.length * 5);
    
    return yPos;
  }
  
  /**
   * Parse LaTeX content to extract structured data
   */
  private parseLatexContent(latexCode: string): any {
    const content: any = {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      experience: [],
      education: [],
      skills: ''
    };
    
    // Extract name
    const nameMatch = latexCode.match(/\{\\Huge\\textbf\{([^}]+)\}\}/);
    if (nameMatch) {
      content.name = nameMatch[1];
    }
    
    // Extract email
    const emailMatch = latexCode.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
      content.email = emailMatch[1];
    }
    
    // Extract phone
    const phoneMatch = latexCode.match(/(\+?[\d\s\-\(\)]{10,})/);
    if (phoneMatch) {
      content.phone = phoneMatch[1];
    }
    
    // Extract summary
    const summaryMatch = latexCode.match(/\\section\{(?:Professional )?Summary\}([^\\]+)/i);
    if (summaryMatch) {
      content.summary = summaryMatch[1].trim();
    }
    
    // Extract experience entries
    const experienceMatches = latexCode.matchAll(/\\cventry\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{[^}]*\}\{[^}]*\}\{([^}]*)\}/g);
    for (const match of experienceMatches) {
      content.experience.push({
        dates: match[1],
        position: match[2],
        company: match[3],
        description: match[4]
      });
    }
    
    // Extract education
    const educationMatches = latexCode.matchAll(/\\cventry\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}/g);
    for (const match of educationMatches) {
      if (!content.experience.some((exp: any) => exp.dates === match[1])) {
        content.education.push({
          year: match[1],
          degree: match[2],
          institution: match[3]
        });
      }
    }
    
    // Extract skills
    const skillsMatch = latexCode.match(/\\cvitem\{[^}]*\}\{([^}]+)\}/);
    if (skillsMatch) {
      content.skills = skillsMatch[1];
    }
    
    return content;
  }
}

export default LaTeXService;