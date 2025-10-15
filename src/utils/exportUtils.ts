
import type { CVState } from '@/context/CVContext';
import LaTeXService from './latexService';
import type { LaTeXFormattingRequest } from './latexService';
import { saveAs } from 'file-saver';

export interface ExportOptions {
  fileName?: string;
  format?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  useLatex?: boolean;
  latexTemplate?: string;
  customizations?: {
    colorScheme?: string;
    fontSize?: string;
    spacing?: string;
    layout?: string;
  };
}

// LaTeX-powered PDF export 
export const exportToPDF = async (cvData: CVState, options: ExportOptions = {}) => {
  try {
    const {
      fileName = `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV`,
      latexTemplate = 'modern',
      customizations
    } = options;

    // Convert CVState to CVData format for LaTeX service
    const cvDataForLatex = {
      personalInfo: {
        fullName: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`,
        email: cvData.personalInfo.email,
        phone: cvData.personalInfo.phone,
        location: cvData.personalInfo.location,
        linkedIn: cvData.personalInfo.website,
        github: ''
      },
      professionalSummary: cvData.personalInfo.summary,
      workExperience: cvData.experience.map(exp => ({
        ...exp,
        isCurrentJob: exp.current,
        achievements: exp.description ? [exp.description] : []
      })),
      education: cvData.education.map(edu => ({
        ...edu,
        isCurrentStudy: edu.current,
        field: edu.field || edu.degree,
        location: '' // Add default location
      })),
      skills: cvData.skills.map(skill => ({
        ...skill,
        category: skill.category === 'Soft Skills' ? 'Soft' as const : 
                 skill.category === 'Languages' ? 'Language' as const :
                 skill.category === 'Tools' || skill.category === 'Frameworks' ? 'Other' as const :
                 'Technical' as const
      })),
      projects: [], // Empty array as fallback
      certifications: [], // Empty array as fallback
      languages: cvData.languages.map(lang => ({
        id: lang.id,
        name: lang.name,
        proficiency: (['Beginner', 'Elementary'].includes(lang.proficiency) ? 'Basic' :
                     ['Upper Intermediate', 'Intermediate'].includes(lang.proficiency) ? 'Conversational' :
                     ['Advanced'].includes(lang.proficiency) ? 'Fluent' :
                     'Native') as 'Native' | 'Fluent' | 'Conversational' | 'Basic'
      })),
      customSections: []
    };

    // Get LaTeX service instance
    const latexService = LaTeXService.getInstance();

    // Generate LaTeX code with Gemini AI formatting
    const latexRequest: LaTeXFormattingRequest = {
      cvData: cvDataForLatex,
      templateName: latexTemplate,
      customizations
    };

    console.log('Generating LaTeX with Gemini AI formatting...');
    const latexCode = await latexService.generateLaTeXWithGemini(latexRequest);

    // Compile LaTeX to PDF
    console.log('Compiling LaTeX to PDF...');
    const pdfBlob = await latexService.compileToPDF(latexCode);

    // Download the PDF
    saveAs(pdfBlob, `${fileName}.pdf`);
    
    return { success: true, latexCode };
  } catch (error) {
    console.error('LaTeX PDF export error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to export LaTeX PDF: ${errorMessage}`);
  }
};



export const exportToWord = async (cvData: CVState, options: ExportOptions = {}) => {
  try {
    const {
      fileName = `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV`
    } = options;

    // Generate HTML content
    const htmlContent = generateCVHTML(cvData);
    
    // Create a complete HTML document for Word
    const wordDocument = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${fileName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              color: #000;
              margin: 0;
              padding: 40px;
            }
            .cv-header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .cv-section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              border-bottom: 1px solid #666;
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .experience-item, .education-item, .award-item {
              margin-bottom: 15px;
            }
            .item-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .skills-category {
              margin-bottom: 10px;
            }
            .skills-list {
              margin-left: 20px;
            }
            .languages-list {
              display: flex;
              flex-wrap: wrap;
              gap: 15px;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    // Create a blob and download
    const blob = new Blob([wordDocument], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Word export error:', error);
    throw new Error('Failed to export Word document');
  }
};

const generateCVHTML = (cvData: CVState): string => {
  const { personalInfo, experience, education, skills, languages, awards } = cvData;
  
  return `
    <div class="cv-container">
      <!-- Header -->
      <div class="cv-header">
        <h1 style="font-size: 28px; margin: 0 0 10px 0; font-weight: bold;">
          ${personalInfo.firstName} ${personalInfo.lastName}
        </h1>
        ${personalInfo.title ? `<p style="font-size: 18px; margin: 0 0 15px 0; color: #666;">${personalInfo.title}</p>` : ''}
        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; font-size: 14px;">
          ${personalInfo.email ? `<span>📧 ${personalInfo.email}</span>` : ''}
          ${personalInfo.phone ? `<span>📞 ${personalInfo.phone}</span>` : ''}
          ${personalInfo.location ? `<span>📍 ${personalInfo.location}</span>` : ''}
          ${personalInfo.website ? `<span>🌐 ${personalInfo.website}</span>` : ''}
        </div>
      </div>

      <!-- Professional Summary -->
      ${personalInfo.summary ? `
        <div class="cv-section">
          <h2 class="section-title">Professional Summary</h2>
          <p style="text-align: justify;">${personalInfo.summary}</p>
        </div>
      ` : ''}

      <!-- Work Experience -->
      ${experience.length > 0 ? `
        <div class="cv-section">
          <h2 class="section-title">Work Experience</h2>
          ${experience.map(exp => `
            <div class="experience-item">
              <div class="item-header">
                <div>
                  <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${exp.position}</h3>
                  <p style="margin: 0; font-weight: 500;">${exp.company}</p>
                </div>
                <div style="text-align: right; font-size: 14px; color: #666;">
                  <p style="margin: 0;">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
                  ${exp.location ? `<p style="margin: 0;">${exp.location}</p>` : ''}
                </div>
              </div>
              ${exp.description ? `<div style="margin-left: 20px; white-space: pre-line; font-size: 14px;">${exp.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Education -->
      ${education.length > 0 ? `
        <div class="cv-section">
          <h2 class="section-title">Education</h2>
          ${education.map(edu => `
            <div class="education-item">
              <div class="item-header">
                <div>
                  <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${edu.degree} in ${edu.field}</h3>
                  <p style="margin: 0; font-weight: 500;">${edu.institution}</p>
                  ${edu.gpa ? `<p style="margin: 0; font-size: 14px; color: #666;">GPA: ${edu.gpa}</p>` : ''}
                </div>
                <div style="text-align: right; font-size: 14px; color: #666;">
                  <p style="margin: 0;">${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}</p>
                </div>
              </div>
              ${edu.description ? `<div style="margin-left: 20px; white-space: pre-line; font-size: 14px;">${edu.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Skills -->
      ${skills.length > 0 ? `
        <div class="cv-section">
          <h2 class="section-title">Skills</h2>
          ${['Technical', 'Soft Skills', 'Languages', 'Tools', 'Frameworks'].map(category => {
            const categorySkills = skills.filter(skill => skill.category === category);
            if (categorySkills.length === 0) return '';
            
            return `
              <div class="skills-category">
                <h3 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">${category}:</h3>
                <div class="skills-list">
                  ${categorySkills.map(skill => `${skill.name} (${skill.level})`).join(' • ')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- Languages -->
      ${languages.length > 0 ? `
        <div class="cv-section">
          <h2 class="section-title">Languages</h2>
          <div class="languages-list">
            ${languages.map(lang => `<span>${lang.name} - ${lang.proficiency}</span>`).join(' • ')}
          </div>
        </div>
      ` : ''}

      <!-- Awards -->
      ${awards.length > 0 ? `
        <div class="cv-section">
          <h2 class="section-title">Awards & Achievements</h2>
          ${awards.map(award => `
            <div class="award-item">
              <div class="item-header">
                <div>
                  <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${award.title}</h3>
                  <p style="margin: 0; font-weight: 500;">${award.issuer}</p>
                </div>
                <div style="text-align: right; font-size: 14px; color: #666;">
                  <p style="margin: 0;">${award.date}</p>
                </div>
              </div>
              ${award.description ? `<div style="margin-left: 20px; font-size: 14px;">${award.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
};

export const printCV = () => {
  window.print();
};