import type { CVState } from '@/context/CVContext';
import { geminiService, checkGeminiSetup } from './geminiService';


export interface AIGenerationOptions {
  section: 'summary' | 'experience' | 'education' | 'skills' | 'achievement';
  context?: {
    id?: string;
    industry?: string;
    role?: string;
    experience_level?: 'entry' | 'mid' | 'senior' | 'executive';
    existing_content?: string;
    skills?: string;
    achievements?: string;
    experience?: string;
    goals?: string;
  };
}

export interface AIValidationResult {
  isValid: boolean;
  score: number; // 0-100
  suggestions: string[];
  warnings: string[];
  improvements: string[];
}

// AI Content Generation Templates
const SUMMARY_TEMPLATES = {
  entry: [
    "Recent graduate with a strong foundation in {field} and passion for {industry}. Eager to apply theoretical knowledge in practical settings while contributing to innovative projects and continuous learning.",
    "Motivated {role} with hands-on experience through internships and academic projects. Demonstrates strong problem-solving abilities and enthusiasm for professional growth in {industry}.",
    "Emerging professional with solid educational background in {field} and demonstrated ability to quickly adapt to new technologies and methodologies."
  ],
  mid: [
    "Experienced {role} with {years} years of expertise in {industry}. Proven track record of delivering high-quality solutions while collaborating effectively with cross-functional teams.",
    "Results-driven professional specializing in {field} with demonstrated success in project management and technical implementation. Strong analytical skills and commitment to continuous improvement.",
    "Dedicated {role} with extensive experience in {industry}, known for innovative problem-solving and ability to mentor junior team members while driving project success."
  ],
  senior: [
    "Senior {role} with {years}+ years of comprehensive experience leading teams and driving strategic initiatives in {industry}. Proven ability to architect scalable solutions and mentor developing talent.",
    "Accomplished professional with deep expertise in {field} and track record of delivering complex projects on time and within budget. Strong leadership skills with focus on team development and organizational growth.",
    "Strategic-minded {role} combining technical excellence with business acumen. Experienced in leading cross-functional teams and implementing enterprise-level solutions."
  ],
  executive: [
    "Executive-level {role} with {years}+ years of experience driving organizational transformation and strategic growth in {industry}. Proven track record of building high-performing teams and delivering exceptional business results.",
    "Visionary leader with extensive background in {field}, specializing in digital transformation and innovation strategy. Known for building scalable organizations and fostering cultures of excellence.",
    "C-suite professional with demonstrated success in leading large-scale initiatives and driving revenue growth. Expert in strategic planning, stakeholder management, and organizational development."
  ]
};

const EXPERIENCE_TEMPLATES = {
  achievements: [
    "• Led implementation of {technology/process} resulting in {percentage}% improvement in {metric}",
    "• Collaborated with cross-functional team of {number} members to deliver {project} ahead of schedule",
    "• Developed and maintained {systems/features} serving {number}+ users/customers",
    "• Mentored {number} junior developers, improving team productivity and code quality standards",
    "• Reduced {metric} by {percentage}% through optimization of {processes/systems}",
    "• Designed and implemented {solution} that increased {metric} by {percentage}%",
    "• Managed {resource} budget of ${amount} while maintaining {quality standard}",
    "• Established best practices for {area} that were adopted organization-wide"
  ],
  responsibilities: [
    "• Designed, developed, and maintained {type} applications using {technologies}",
    "• Participated in code reviews and contributed to architectural decisions",
    "• Collaborated with product managers and designers to define technical requirements",
    "• Troubleshot and resolved complex technical issues in production environments",
    "• Implemented automated testing strategies to ensure code quality and reliability",
    "• Contributed to technical documentation and knowledge sharing initiatives",
    "• Participated in agile development processes including sprint planning and retrospectives"
  ]
};

const SKILLS_SUGGESTIONS = {
  'Technical': [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'SQL',
    'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'MongoDB', 'PostgreSQL'
  ],
  'Soft Skills': [
    'Leadership', 'Communication', 'Problem Solving', 'Team Collaboration',
    'Project Management', 'Time Management', 'Critical Thinking', 'Adaptability'
  ],
  'Tools': [
    'VS Code', 'IntelliJ IDEA', 'Jira', 'Confluence', 'Slack', 'Figma',
    'Postman', 'Jenkins', 'GitHub Actions', 'Terraform'
  ],
  'Frameworks': [
    'React', 'Angular', 'Vue.js', 'Express.js', 'Django', 'Spring Boot',
    'Next.js', 'Nuxt.js', 'Laravel', 'Ruby on Rails'
  ]
};

// Helper function to generate CV content using Gemini AI
const generateCVContentWithGemini = async (section: string, context: {
  role: string;
  industry?: string;
  experience?: string;
  skills?: string;
  achievements?: string;
  goals?: string;
}): Promise<string> => {
  const prompt = createCVPrompts(section, context);
  const response = await geminiService.generateText({
    prompt,
    temperature: 0.8,
    maxOutputTokens: 300
  });
  
  return response.success ? response.response : '';
};

// Create specialized prompts for different CV sections
const createCVPrompts = (section: string, context: any): string => {
  const { role, industry = 'technology', experience, skills, achievements, goals } = context;

  switch (section) {
    case 'summary':
      return `Write a professional CV summary for a ${role} in the ${industry} industry. 
Experience: ${experience || 'Not specified'}
Key Skills: ${skills || 'Not specified'}
Major Achievement: ${achievements || 'Not specified'}
Career Goals: ${goals || 'Not specified'}

Requirements:
- 2-3 sentences maximum
- Professional tone
- Highlight key strengths
- No generic phrases
- Include specific skills mentioned
- Make it compelling for recruiters

Professional Summary:`;

    case 'experience':
      return `Generate 3-4 professional bullet points for a ${role} job description. 
Industry: ${industry}
Key Skills: ${skills || 'Not specified'}
Major Achievement: ${achievements || 'Not specified'}

Requirements:
- Start each bullet with an action verb
- Include specific metrics where possible (use realistic percentages/numbers)
- Focus on achievements and impact
- Use technical terminology appropriately
- Keep each bullet under 20 words

Job Responsibilities:`;

    case 'education':
      return `Generate an education description for a ${role} focusing on relevant coursework.
Industry: ${industry}
Skills: ${skills || 'Not specified'}

Requirements:
- Focus on relevant coursework for the industry
- Include 2-3 key projects or achievements
- Mention relevant technologies or methodologies
- Keep it concise and professional

Education Details:`;

    case 'skills':
      return `Generate a skills section for a ${role} in ${industry}.
Current Skills: ${skills || 'Not specified'}
Experience Level: ${experience || 'Not specified'}

Requirements:
- Categorize skills (Technical, Leadership, Tools, etc.)
- Include both hard and soft skills
- Be specific with technology names
- Match industry standards
- Include 8-12 total skills

Skills:`;

    case 'achievement':
      return `Generate a professional achievement for a ${role} in ${industry}.
Background: ${achievements || experience || 'Not specified'}
Skills Used: ${skills || 'Not specified'}

Requirements:
- Include specific metrics or results
- Start with an action verb
- Show clear impact/benefit
- Keep under 25 words
- Make it quantifiable where possible

Achievement:`;

    default:
      return `Generate professional content for the ${section} section of a CV for a ${role} in ${industry}.

Requirements:
- Professional tone
- Industry-appropriate language
- Concise and impactful
- Include relevant details

Content:`;
  }
};

export const generateAIContent = async (options: AIGenerationOptions): Promise<string> => {
  const { section, context = {} } = options;
  const { 
    industry = 'technology', 
    role = 'software engineer', 
    experience_level = 'mid',
    skills = '',
    achievements = '',
    experience = '',
    goals = ''
  } = context;

  try {
    // Check if Gemini AI is available
    const geminiStatus = await checkGeminiSetup();
    
    if (geminiStatus.available) {
      // Use Gemini AI for content generation
      const content = await generateCVContentWithGemini(section, {
        role,
        industry,
        experience: experience || `${experience_level} level`,
        skills,
        achievements,
        goals
      });
      
      if (content && content.length > 10) {
        return content;
      }
    }
    
    // Fallback to template-based generation if Gemini AI is not available
    console.warn('Gemini AI not available, using template fallback:', geminiStatus.message);
    
  } catch (error) {
    console.warn('Gemini AI generation failed, using template fallback:', error);
  }

  // Template-based fallback
  switch (section) {
    case 'summary':
      return generateSummary(role, industry, experience_level, skills, achievements, experience);
    
    case 'experience':
      return generateExperienceDescription(role, industry, experience_level, achievements);
    
    case 'education':
      return generateEducationDescription(role, industry);
    
    case 'skills':
      return generateSkillSuggestions(role, industry).join(', ');
    
    case 'achievement':
      return generateAchievementDescription(role, industry, achievements);
    
    default:
      throw new Error(`Unsupported section: ${section}`);
  }
};

export const validateCVContent = async (cvData: CVState): Promise<AIValidationResult> => {
  // Simulate AI validation processing
  await new Promise(resolve => setTimeout(resolve, 1000));

  const suggestions: string[] = [];
  const warnings: string[] = [];
  const improvements: string[] = [];
  let score = 100;

  // Personal Info Validation
  if (!cvData.personalInfo.firstName || !cvData.personalInfo.lastName) {
    warnings.push("Complete name is required for professional presentation");
    score -= 10;
  }

  if (!cvData.personalInfo.email || !cvData.personalInfo.phone) {
    warnings.push("Contact information (email and phone) is essential");
    score -= 15;
  }

  if (!cvData.personalInfo.summary || cvData.personalInfo.summary.length < 50) {
    suggestions.push("Add a compelling professional summary (at least 50 characters)");
    score -= 10;
  }

  // Experience Validation
  if (cvData.experience.length === 0) {
    warnings.push("Add at least one work experience entry");
    score -= 20;
  } else {
    cvData.experience.forEach((exp, index) => {
      if (!exp.description || exp.description.length < 100) {
        suggestions.push(`Experience #${index + 1}: Add detailed description with achievements`);
        score -= 5;
      }
      if (!exp.startDate || !exp.endDate) {
        suggestions.push(`Experience #${index + 1}: Add complete date information`);
        score -= 3;
      }
    });
  }

  // Education Validation
  if (cvData.education.length === 0) {
    suggestions.push("Consider adding your educational background");
    score -= 10;
  }

  // Skills Validation
  if (cvData.skills.length < 5) {
    suggestions.push("Add more skills to showcase your expertise (aim for 5-15 skills)");
    score -= 8;
  }

  if (cvData.skills.length > 20) {
    improvements.push("Consider focusing on your most relevant skills (remove less important ones)");
    score -= 5;
  }

  // Content Quality Analysis
  const totalWords = getTotalWordCount(cvData);
  if (totalWords < 100) {
    warnings.push("CV content is too brief - aim for more detailed descriptions");
    score -= 15;
  }

  if (totalWords > 800) {
    improvements.push("Consider making content more concise - aim for 400-600 words total");
    score -= 5;
  }

  // Generate overall improvements
  if (score >= 90) {
    improvements.push("Excellent CV! Consider adding quantifiable achievements for even more impact");
  } else if (score >= 80) {
    improvements.push("Good CV structure. Focus on adding more specific achievements and metrics");
  } else if (score >= 70) {
    improvements.push("Solid foundation. Add more detail to experience descriptions and consider additional sections");
  } else {
    improvements.push("CV needs significant improvement. Focus on completing all sections with detailed information");
  }

  return {
    isValid: score >= 70,
    score: Math.max(0, score),
    suggestions,
    warnings,
    improvements
  };
};

export const generateSkillSuggestions = (role?: string, _industry?: string): string[] => {
  // Generate role-specific skills
  let relevantSkills: string[] = [];
  
  if (role?.toLowerCase().includes('software') || role?.toLowerCase().includes('developer')) {
    relevantSkills = [...SKILLS_SUGGESTIONS.Technical.slice(0, 5), ...SKILLS_SUGGESTIONS.Frameworks.slice(0, 3), ...SKILLS_SUGGESTIONS['Soft Skills'].slice(0, 2)];
  } else if (role?.toLowerCase().includes('marketing')) {
    relevantSkills = ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Social Media Management', 'Analytics', 'Brand Management', ...SKILLS_SUGGESTIONS['Soft Skills'].slice(0, 3)];
  } else if (role?.toLowerCase().includes('design')) {
    relevantSkills = ['Figma', 'Adobe Creative Suite', 'Sketch', 'Prototyping', 'UI/UX Design', 'User Research', ...SKILLS_SUGGESTIONS['Soft Skills'].slice(0, 2)];
  } else {
    // Return role-appropriate mix
    const allSkills = Object.values(SKILLS_SUGGESTIONS).flat();
    relevantSkills = allSkills.sort(() => Math.random() - 0.5).slice(0, 8);
  }
  
  return relevantSkills.slice(0, 10);
};

// Helper functions
function generateSummary(role: string, industry: string, level: string, skills?: string, achievements?: string, experience?: string): string {
  const templates = SUMMARY_TEMPLATES[level as keyof typeof SUMMARY_TEMPLATES] || SUMMARY_TEMPLATES.mid;
  let template = templates[Math.floor(Math.random() * templates.length)];
  
  // If we have specific user input, create a more personalized summary
  if (skills || achievements) {
    template = `${level === 'entry' ? 'Motivated' : level === 'senior' ? 'Experienced' : level === 'executive' ? 'Strategic' : 'Results-driven'} ${role} ${experience ? 'with ' + experience + ' of experience' : ''} specializing in ${skills || 'relevant technologies'}. ${achievements ? 'Notable for ' + achievements + '.' : 'Proven track record of delivering high-quality solutions.'} ${level === 'entry' ? 'Eager to contribute to innovative projects and continuous learning.' : 'Strong focus on team collaboration and driving business impact.'}`;
  }
  
  return template
    .replace(/{role}/g, role)
    .replace(/{industry}/g, industry)
    .replace(/{field}/g, role.includes('engineer') ? 'engineering' : role.includes('design') ? 'design' : 'technology')
    .replace(/{years}/g, level === 'senior' ? '5-8' : level === 'executive' ? '10+' : '3-5');
}

function generateExperienceDescription(_role: string, _industry: string, _level?: string, userAchievements?: string): string {
  // Use user achievements if provided, otherwise generate role-specific ones
  if (userAchievements) {
    const roleSpecificTemplate = `• ${userAchievements}\n• Collaborated with cross-functional teams to deliver projects on time and within budget\n• Contributed to team knowledge sharing and mentoring initiatives`;
    return roleSpecificTemplate;
  }
  
  const achievementTemplates = EXPERIENCE_TEMPLATES.achievements
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  const responsibilities = EXPERIENCE_TEMPLATES.responsibilities
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);

  return [...achievementTemplates, ...responsibilities]
    .map(item => item
      .replace(/{technology\/process}/g, getRandomTech())
      .replace(/{percentage}/g, String(Math.floor(Math.random() * 30) + 20))
      .replace(/{metric}/g, getRandomMetric())
      .replace(/{number}/g, String(Math.floor(Math.random() * 8) + 3))
      .replace(/{project}/g, getRandomProject())
      .replace(/{systems\/features}/g, getRandomSystem())
      .replace(/{processes\/systems}/g, getRandomProcess())
      .replace(/{solution}/g, getRandomSolution())
      .replace(/{resource}/g, getRandomResource())
      .replace(/{amount}/g, String(Math.floor(Math.random() * 500) + 100) + 'K')
      .replace(/{quality standard}/g, getRandomQualityStandard())
      .replace(/{area}/g, getRandomArea())
      .replace(/{type}/g, getRandomAppType())
      .replace(/{technologies}/g, getRandomTechStack())
    )
    .join('\n');
}

function generateEducationDescription(role?: string, _industry?: string): string {
  // Role-specific coursework and activities
  let descriptions: string[];
  
  if (role?.toLowerCase().includes('software') || role?.toLowerCase().includes('developer')) {
    descriptions = [
      "• Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems",
      "• Completed capstone project involving full-stack web application development",
      "• Participated in programming competitions and hackathons",
      "• Maintained strong academic performance while contributing to tech student organizations"
    ];
  } else if (role?.toLowerCase().includes('marketing')) {
    descriptions = [
      "• Relevant coursework: Digital Marketing, Consumer Behavior, Brand Management, Analytics",
      "• Led marketing campaigns for student organizations with measurable results",
      "• Completed internships in digital marketing and social media management",
      "• Maintained strong academic performance while building professional network"
    ];
  } else if (role?.toLowerCase().includes('design')) {
    descriptions = [
      "• Relevant coursework: Design Thinking, User Experience, Visual Communication, Digital Media",
      "• Portfolio projects showcasing creative problem-solving and design process",
      "• Participated in design competitions and collaborative studio projects",
      "• Maintained strong academic performance while developing creative skills"
    ];
  } else {
    descriptions = [
      "• Relevant coursework aligned with career objectives and industry requirements",
      "• Completed projects demonstrating practical application of academic knowledge",
      "• Participated in extracurricular activities and professional development",
      "• Maintained strong academic performance while building leadership skills"
    ];
  }
  
  return descriptions.slice(0, 2 + Math.floor(Math.random() * 2)).join('\n');
}

function generateAchievementDescription(role: string, _industry: string, userAchievements?: string): string {
  // Use user-provided achievement if available
  if (userAchievements) {
    return userAchievements;
  }
  
  // Role-specific achievements
  let achievements: string[];
  
  if (role.toLowerCase().includes('software') || role.toLowerCase().includes('developer')) {
    achievements = [
      "Led development of key features that improved application performance by 40%",
      "Successfully completed AWS/Azure certification in cloud technologies",
      "Contributed to open-source projects with significant community impact",
      "Mentored junior developers and improved team code quality standards",
      "Implemented automated testing that reduced deployment bugs by 60%"
    ];
  } else if (role.toLowerCase().includes('marketing')) {
    achievements = [
      "Increased brand engagement by 45% through strategic social media campaigns",
      "Successfully launched product campaign resulting in 25% sales increase",
      "Led cross-functional team to deliver marketing initiative under budget",
      "Achieved Google Analytics and HubSpot professional certifications",
      "Developed content strategy that doubled website organic traffic"
    ];
  } else if (role.toLowerCase().includes('design')) {
    achievements = [
      "Redesigned user interface resulting in 35% improvement in user engagement",
      "Led design thinking workshops that streamlined product development process",
      "Created design system adopted across multiple product teams",
      "Won internal design competition for innovative user experience solution",
      "Collaborated with engineering to deliver pixel-perfect implementations"
    ];
  } else {
    achievements = [
      "Employee of the Month recognition for outstanding performance and teamwork",
      "Successfully completed professional certification in relevant field",
      "Led team to exceed quarterly targets by 20%",
      "Received outstanding performance rating for consecutive quarters",
      "Implemented process improvement that increased team efficiency by 30%"
    ];
  }
  
  return achievements[Math.floor(Math.random() * achievements.length)];
}

function getTotalWordCount(cvData: CVState): number {
  let wordCount = 0;
  
  wordCount += (cvData.personalInfo.summary || '').split(' ').length;
  cvData.experience.forEach(exp => {
    wordCount += (exp.description || '').split(' ').length;
  });
  cvData.education.forEach(edu => {
    wordCount += (edu.description || '').split(' ').length;
  });
  cvData.awards.forEach(award => {
    wordCount += (award.description || '').split(' ').length;
  });
  
  return wordCount;
}

// Random content generators
function getRandomTech(): string {
  const techs = ['React framework', 'microservices architecture', 'automated testing', 'CI/CD pipeline', 'cloud infrastructure'];
  return techs[Math.floor(Math.random() * techs.length)];
}

function getRandomMetric(): string {
  const metrics = ['performance', 'user engagement', 'load times', 'error rates', 'conversion rates', 'productivity'];
  return metrics[Math.floor(Math.random() * metrics.length)];
}

function getRandomProject(): string {
  const projects = ['customer portal', 'mobile application', 'e-commerce platform', 'analytics dashboard', 'API integration'];
  return projects[Math.floor(Math.random() * projects.length)];
}

function getRandomSystem(): string {
  const systems = ['web applications', 'mobile interfaces', 'backend services', 'database systems', 'monitoring tools'];
  return systems[Math.floor(Math.random() * systems.length)];
}

function getRandomProcess(): string {
  const processes = ['deployment workflows', 'testing procedures', 'development processes', 'monitoring systems'];
  return processes[Math.floor(Math.random() * processes.length)];
}

function getRandomSolution(): string {
  const solutions = ['automated workflow', 'scalable architecture', 'optimization algorithm', 'integration system'];
  return solutions[Math.floor(Math.random() * solutions.length)];
}

function getRandomResource(): string {
  const resources = ['development', 'infrastructure', 'project', 'team'];
  return resources[Math.floor(Math.random() * resources.length)];
}

function getRandomQualityStandard(): string {
  const standards = ['high availability', 'zero downtime', 'industry standards', 'performance benchmarks'];
  return standards[Math.floor(Math.random() * standards.length)];
}

function getRandomArea(): string {
  const areas = ['code quality', 'testing', 'deployment', 'documentation', 'security'];
  return areas[Math.floor(Math.random() * areas.length)];
}

function getRandomAppType(): string {
  const types = ['web', 'mobile', 'desktop', 'enterprise'];
  return types[Math.floor(Math.random() * types.length)];
}

function getRandomTechStack(): string {
  const stacks = ['React/Node.js', 'Python/Django', 'Java/Spring', 'Angular/Express', 'Vue.js/Laravel'];
  return stacks[Math.floor(Math.random() * stacks.length)];
}