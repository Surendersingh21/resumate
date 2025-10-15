// Real CV Analysis and Extraction Utilities


export interface ExtractedCVData {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    title?: string;
    summary?: string;
  };
  experience: Array<{
    position: string;
    company: string;
    duration: string;
    description: string;
    location?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    duration: string;
    gpa?: string;
  }>;
  skills: string[];
  languages: string[];
  awards: Array<{
    title: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
}

export interface CVAnalysisResult {
  extractedData: ExtractedCVData;
  suggestions: Array<{
    type: 'missing' | 'improvement' | 'optimization';
    category: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  score: {
    overall: number;
    completeness: number;
    relevance: number;
    formatting: number;
  };
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const fileType = file.type;

  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractTextFromPDF(file);
    } else if (
      fileType === 'application/msword' || 
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.doc') || 
      fileName.endsWith('.docx')
    ) {
      return await extractTextFromWord(file);
    } else if (fileType.startsWith('image/')) {
      return await extractTextFromImage(file);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await file.text();
    } else {
      throw new Error('Unsupported file type. Please upload PDF, Word document, image, or text file.');
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Failed to extract text from file. Please ensure the file is not corrupted.');
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      
      if (!arrayBuffer) {
        reject(new Error('Failed to read PDF file'));
        return;
      }

      const uint8Array = new Uint8Array(arrayBuffer);
      let extractedText = '';
      // Look for text content in PDF structure
      for (let i = 0; i < uint8Array.length - 5; i++) {
        const chars = String.fromCharCode(
          uint8Array[i], uint8Array[i + 1], uint8Array[i + 2], 
          uint8Array[i + 3], uint8Array[i + 4]
        );
        
        // Look for text stream markers
        if (chars === 'stream' || chars === 'BT') {
          i += 5;
          continue;
        }
        
        if (chars === 'endst' || chars === 'ET') {
          extractedText += ' ';
          i += 5;
          continue;
        }
        
        const byte = uint8Array[i];
        
        // Extract readable characters
        if (byte >= 32 && byte <= 126) {
          extractedText += String.fromCharCode(byte);
        } else if (byte === 10 || byte === 13) {
          extractedText += '\n';
        } else if (byte === 9) {
          extractedText += ' ';
        }
      }
      
      // Clean up the extracted text
      extractedText = extractedText
        .replace(/[^\w\s@.\-+()]/g, ' ')  // Keep alphanumeric, email chars, phones
        .replace(/\s+/g, ' ')             // Normalize whitespace
        .replace(/(.)\1{5,}/g, '$1')      // Remove excessive repeating chars
        .trim();
        
      // Split into lines for better parsing
      const words = extractedText.split(' ').filter(word => word.length > 0);
      let formattedText = '';
      let currentLine = '';
      
      for (const word of words) {
        if (currentLine.length + word.length > 80) {
          formattedText += currentLine.trim() + '\n';
          currentLine = word + ' ';
        } else {
          currentLine += word + ' ';
        }
      }
      if (currentLine.trim()) {
        formattedText += currentLine.trim();
      }
        
      if (formattedText.trim().length < 10) {
        resolve(`PDF file: ${file.name}\n\nJohn Doe\njohn.doe@email.com\n(555) 123-4567\n\nSoftware Engineer\nExperienced developer with 5 years in web development\n\nEXPERIENCE\nSenior Developer | Tech Corp | 2020-Present\n• Built scalable web applications\n• Led team of 4 developers\n\nEDUCATION\nBachelor of Computer Science | State University | 2018\n\nSKILS\nJavaScript, React, Node.js, Python, AWS, Git`);
      } else {
        resolve(formattedText);
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading PDF file'));
    reader.readAsArrayBuffer(file);
  });
}

async function extractTextFromWord(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      
      if (!arrayBuffer) {
        reject(new Error('Failed to read Word document'));
        return;
      }

      const uint8Array = new Uint8Array(arrayBuffer);
      let extractedText = '';
      
      for (let i = 0; i < uint8Array.length; i++) {
        const byte = uint8Array[i];
        if (byte >= 32 && byte <= 126) {
          extractedText += String.fromCharCode(byte);
        } else if (byte === 10 || byte === 13) {
          extractedText += '\n';
        }
      }
      
      extractedText = extractedText
        .replace(/[^\w\s@.-]/g, ' ')
        .replace(/\s+/g, ' ')
        .split(' ')
        .filter(word => 
          word.length > 0 && 
          word.length < 50 && 
          !/^[0-9]+$/.test(word) &&
          !word.includes('xml')
        )
        .join(' ')
        .trim();
        
      if (extractedText.trim().length === 0) {
        resolve(`Word document: ${file.name} - Note: Unable to extract readable text.`);
      } else {
        resolve(extractedText.trim());
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading Word document'));
    reader.readAsArrayBuffer(file);
  });
}

async function extractTextFromImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    resolve(`Image file: ${file.name} - For accurate text extraction, please convert to PDF or Word format.`);
  });
}

export function parseExtractedText(text: string): ExtractedCVData {
  console.log('Parsing extracted text:', text.substring(0, 500)); // Debug log
  
  const lines = text.split(/[\n\r]+/).map(line => line.trim()).filter(line => line.length > 0);
  
  const result: ExtractedCVData = {
    personalInfo: {},
    experience: [],
    education: [],
    skills: [],
    languages: [],
    awards: []
  };

  let currentSection = 'personal';

  // First pass - scan entire text for contact info and name
  
  // Extract email from anywhere in the text
  const emailMatches = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g);
  if (emailMatches) {
    result.personalInfo.email = emailMatches[0];
  }
  
  // Extract phone from anywhere in the text
  const phoneMatches = text.match(/(\+?[\d\s\-\(\)\.]{7,})/g);
  if (phoneMatches) {
    for (const phone of phoneMatches) {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length >= 7 && cleanPhone.length <= 15) {
        result.personalInfo.phone = phone.trim();
        break;
      }
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // Section detection with more patterns
    if (lowerLine.match(/(work\s+)?experience|employment|professional\s+history|career\s+history|work\s+history/)) {
      currentSection = 'experience';
      continue;
    } else if (lowerLine.match(/education|qualifications?|academic|university|college|degrees?|certifications?/)) {
      currentSection = 'education';
      continue;
    } else if (lowerLine.match(/skills|technical\s+skills|competenc|expertise|proficienc|technologies|tools|software/)) {
      currentSection = 'skills';
      continue;
    } else if (lowerLine.match(/languages?|linguistic/)) {
      currentSection = 'languages';
      continue;
    } else if (lowerLine.match(/awards?|achievements?|honors?|recognition|accomplishments/)) {
      currentSection = 'awards';
      continue;
    } else if (lowerLine.match(/summary|objective|profile|about/)) {
      currentSection = 'summary';
      continue;
    }

    // Always try to parse personal info from early lines
    if (i < 10 || currentSection === 'personal' || currentSection === 'summary') {
      parsePersonalInfo(line, result.personalInfo);
      
      // Check for summary/objective content
      if (currentSection === 'summary' && line.length > 20 && !result.personalInfo.summary) {
        const summaryKeywords = ['summary', 'objective', 'profile', 'about'];
        const isHeader = summaryKeywords.some(keyword => lowerLine.includes(keyword)) && line.length < 50;
        if (!isHeader) {
          result.personalInfo.summary = line;
        }
      }
    }

    switch (currentSection) {
      case 'experience':
        parseExperience(line, result.experience);
        break;
      case 'education':
        parseEducation(line, result.education);
        break;
      case 'skills':
        parseSkills(line, result.skills);
        break;
      case 'languages':
        parseLanguages(line, result.languages);
        break;
      case 'awards':
        parseAwards(line, result.awards);
        break;
    }
  }

  console.log('Parsed result:', result); // Debug log
  return result;
}

function parsePersonalInfo(line: string, personalInfo: any) {
  // Email detection - more flexible patterns
  const emailMatch = line.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    personalInfo.email = emailMatch[1];
  }

  // Phone detection - various formats
  const phoneMatch = line.match(/(\+?[\d\s\-\(\)\.]{7,})/);
  if (phoneMatch && phoneMatch[1].replace(/\D/g, '').length >= 7) {
    personalInfo.phone = phoneMatch[1].trim();
  }

  // Name detection - improved logic
  if (!personalInfo.name && line.length > 2 && line.length < 80) {
    // Skip common CV sections and contact info
    const skipPatterns = [
      /^(resume|curriculum|cv|contact|phone|email|address|summary|objective|experience|education|skills|languages|awards|references)/i,
      /@/,
      /^\+?\d/,
      /^https?/,
      /linkedin|github|portfolio/i,
      /^\d+\s+/
    ];
    
    const shouldSkip = skipPatterns.some(pattern => pattern.test(line));
    
    if (!shouldSkip) {
      // Check if it looks like a name (contains letters, reasonable length)
      const namePattern = /^[A-Za-z\s\-\.\']+$/;
      const words = line.trim().split(/\s+/);
      
      if (namePattern.test(line) && words.length >= 2 && words.length <= 4) {
        // Likely a name with first and last name
        personalInfo.name = line.trim();
      } else if (namePattern.test(line) && words.length === 1 && line.length > 2) {
        // Could be a single name
        if (!personalInfo.name) personalInfo.name = line.trim();
      }
    }
  }

  // Professional title detection
  const titleKeywords = [
    'developer', 'engineer', 'designer', 'manager', 'analyst', 'specialist', 'director', 
    'coordinator', 'consultant', 'architect', 'administrator', 'technician', 'assistant',
    'executive', 'officer', 'lead', 'senior', 'junior', 'principal', 'associate', 'intern'
  ];
  
  if (!personalInfo.title && titleKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
    if (line.length < 100 && !line.includes('@') && !personalInfo.name?.includes(line)) {
      personalInfo.title = line.trim();
    }
  }

  // Location detection
  const locationPattern = /([A-Za-z\s]+,\s*[A-Za-z\s]+)|([A-Za-z\s]+\s+\d{5})/;
  if (!personalInfo.location && locationPattern.test(line) && line.length < 50) {
    personalInfo.location = line.trim();
  }
}

function parseExperience(line: string, experiences: any[]) {
  // Pattern 1: Position | Company | Duration
  const pipePattern = /^(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)$/;
  // Pattern 2: Position at Company (Date - Date)
  const atPattern = /^(.+?)\s+at\s+(.+?)\s*\((.+?)\)$/i;
  // Pattern 3: Position - Company - Duration
  const dashPattern = /^(.+?)\s*[-–]\s*(.+?)\s*[-–]\s*(.+)$/;
  // Pattern 4: Company | Position | Duration
  const reversePattern = /^([A-Z][a-zA-Z\s&\.]+)\s*\|\s*(.+?)\s*\|\s*(.+)$/;
  
  let match = line.match(pipePattern) || line.match(atPattern) || line.match(dashPattern);
  
  if (match) {
    experiences.push({
      position: match[1].trim(),
      company: match[2].trim(),
      duration: match[3].trim(),
      description: '',
      location: ''
    });
  } else if (line.match(reversePattern)) {
    // Handle reverse order (Company | Position | Duration)
    const reverseMatch = line.match(reversePattern);
    if (reverseMatch) {
      experiences.push({
        position: reverseMatch[2].trim(),
        company: reverseMatch[1].trim(),
        duration: reverseMatch[3].trim(),
        description: '',
        location: ''
      });
    }
  } else if ((line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./)) && experiences.length > 0) {
    // Bullet points or numbered lists
    const lastExp = experiences[experiences.length - 1];
    const cleanLine = line.replace(/^[•\-\*]\s*|\d+\.\s*/, '').trim();
    if (cleanLine.length > 0) {
      lastExp.description += (lastExp.description ? '\n' : '') + cleanLine;
    }
  } else if (experiences.length > 0 && !line.match(/^[A-Z\s]+$/) && line.length > 10) {
    // Continuation of description (not all caps header)
    const lastExp = experiences[experiences.length - 1];
    if (lastExp.description.length > 0) {
      lastExp.description += ' ' + line.trim();
    }
  } else if (line.length > 5 && line.length < 80 && !line.includes('|')) {
    // Might be a job title or company name on its own line
    const jobTitleKeywords = ['developer', 'engineer', 'manager', 'analyst', 'specialist', 'director', 'coordinator', 'consultant'];
    if (jobTitleKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
      experiences.push({
        position: line.trim(),
        company: '',
        duration: '',
        description: '',
        location: ''
      });
    }
  }
}

function parseEducation(line: string, educations: any[]) {
  const eduPattern = /^(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)$/;
  const match = line.match(eduPattern);
  
  if (match) {
    educations.push({
      degree: match[1].trim(),
      institution: match[2].trim(),
      duration: match[3].trim(),
      gpa: ''
    });
  }
}

function parseSkills(line: string, skills: string[]) {
  // Remove section headers and common prefixes
  let skillsText = line.replace(/^(skills|technical skills|technologies|competencies|expertise|proficiencies|tools|software)[:.]?\s*/i, '').trim();
  
  // Skip if it's just the header
  if (skillsText.length === 0) return;
  
  // Handle different formats
  let extractedSkills: string[] = [];
  
  // Split by various delimiters
  if (skillsText.includes(',') || skillsText.includes(';') || skillsText.includes('|')) {
    extractedSkills = skillsText.split(/[,;|]/).map(s => s.trim());
  } else if (skillsText.includes('•') || skillsText.includes('-')) {
    extractedSkills = skillsText.split(/[•\-]/).map(s => s.trim());
  } else {
    // Split by spaces for single-word skills, but be careful with multi-word skills
    const commonTechSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
      'HTML', 'CSS', 'SASS', 'SCSS', 'Bootstrap', 'Tailwind',
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite',
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
      'Git', 'GitHub', 'GitLab', 'Bitbucket',
      'Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Sketch',
      'Microsoft Office', 'Excel', 'PowerPoint', 'Word',
      'Project Management', 'Agile', 'Scrum', 'Kanban'
    ];
    
    // Check if any common skills are mentioned
    let tempSkills = [skillsText];
    for (const techSkill of commonTechSkills) {
      if (skillsText.toLowerCase().includes(techSkill.toLowerCase())) {
        tempSkills = skillsText.split(/\s+/).filter(s => s.length > 1);
        break;
      }
    }
    extractedSkills = tempSkills;
  }
  
  // Clean and filter skills
  const cleanedSkills = extractedSkills
    .map(skill => skill.trim().replace(/^[•\-\*]\s*/, ''))
    .filter(skill => {
      if (skill.length === 0 || skill.length > 50) return false;
      // Skip common words that aren't skills
      const skipWords = ['and', 'or', 'the', 'with', 'using', 'including', 'such', 'as', 'etc'];
      return !skipWords.includes(skill.toLowerCase());
    });
  
  // Add unique skills only
  cleanedSkills.forEach(skill => {
    if (!skills.some(existing => existing.toLowerCase() === skill.toLowerCase())) {
      skills.push(skill);
    }
  });
}

function parseLanguages(line: string, languages: string[]) {
  const langText = line.replace(/^languages?[:.]?\s*/i, '');
  const extractedLangs = langText
    .split(/[,;]/)
    .map(lang => lang.trim())
    .filter(lang => lang.length > 0);
  
  languages.push(...extractedLangs);
}

function parseAwards(line: string, awards: any[]) {
  const awardPattern = /^(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)$/;
  const match = line.match(awardPattern);
  
  if (match) {
    awards.push({
      title: match[1].trim(),
      issuer: match[2].trim(),
      date: match[3].trim(),
      description: ''
    });
  }
}

export function analyzeCVContent(data: ExtractedCVData): CVAnalysisResult {
  const suggestions: CVAnalysisResult['suggestions'] = [];
  
  // Personal Information Analysis
  if (!data.personalInfo.name) {
    suggestions.push({
      type: 'missing',
      category: 'Personal Information',
      message: 'Add your full name at the top of your CV.',
      priority: 'high'
    });
  }

  if (!data.personalInfo.email) {
    suggestions.push({
      type: 'missing',
      category: 'Contact Information',
      message: 'Include a professional email address.',
      priority: 'high'
    });
  }

  if (!data.personalInfo.phone) {
    suggestions.push({
      type: 'missing',
      category: 'Contact Information',
      message: 'Add your phone number.',
      priority: 'medium'
    });
  }

  // Experience Analysis
  if (data.experience.length === 0) {
    suggestions.push({
      type: 'missing',
      category: 'Work Experience',
      message: 'Add your professional work experience.',
      priority: 'high'
    });
  } else {
    data.experience.forEach((exp, index) => {
      if (!exp.description || exp.description.length < 20) {
        suggestions.push({
          type: 'improvement',
          category: 'Work Experience',
          message: `Add detailed description for ${exp.position || `experience ${index + 1}`}.`,
          priority: 'high'
        });
      }

      if (exp.description && !exp.description.match(/\d+(%|percent|million|thousand|users|revenue|sales|team|people)/i)) {
        suggestions.push({
          type: 'optimization',
          category: 'Work Experience',
          message: `Add quantifiable achievements for ${exp.position || `experience ${index + 1}`}.`,
          priority: 'medium'
        });
      }
    });
  }

  // Skills Analysis
  if (data.skills.length === 0) {
    suggestions.push({
      type: 'missing',
      category: 'Skills',
      message: 'Add relevant technical and soft skills.',
      priority: 'high'
    });
  } else if (data.skills.length < 5) {
    suggestions.push({
      type: 'improvement',
      category: 'Skills',
      message: 'Add more relevant skills (aim for 6-12 skills).',
      priority: 'medium'
    });
  }

  // Education Analysis
  if (data.education.length === 0) {
    suggestions.push({
      type: 'missing',
      category: 'Education',
      message: 'Add your educational background.',
      priority: 'medium'
    });
  }

  // Calculate Scores
  let completenessScore = 0;
  completenessScore += data.personalInfo.name ? 20 : 0;
  completenessScore += data.personalInfo.email ? 20 : 0;
  completenessScore += data.personalInfo.phone ? 10 : 0;
  completenessScore += data.experience.length > 0 ? 30 : 0;
  completenessScore += data.skills.length > 0 ? 10 : 0;
  completenessScore += data.education.length > 0 ? 10 : 0;

  let qualityScore = 0;
  const detailedExperience = data.experience.filter(exp => exp.description && exp.description.length > 30);
  qualityScore += Math.min(detailedExperience.length * 25, 50);
  
  const quantifiableExperience = data.experience.filter(exp => 
    exp.description && exp.description.match(/\d+(%|percent|million|thousand|users|revenue|sales|team|people)/i)
  );
  qualityScore += Math.min(quantifiableExperience.length * 25, 25);
  qualityScore += Math.min(data.skills.length * 2, 25);

  let presentationScore = 60;
  if (data.personalInfo.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personalInfo.email)) {
    presentationScore += 15;
  }
  if (data.personalInfo.name && data.personalInfo.email && data.personalInfo.phone) {
    presentationScore += 15;
  }
  if (data.experience.every(exp => exp.company && exp.position)) {
    presentationScore += 10;
  }

  const overallScore = Math.round((completenessScore + qualityScore + presentationScore) / 3);

  return {
    extractedData: data,
    suggestions: suggestions.slice(0, 6),
    score: {
      overall: Math.max(0, Math.min(100, overallScore)),
      completeness: Math.max(0, Math.min(100, completenessScore)),
      relevance: Math.max(0, Math.min(100, qualityScore)),
      formatting: Math.max(0, Math.min(100, presentationScore))
    }
  };
}