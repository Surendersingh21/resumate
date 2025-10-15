// Skills suggestion system with intelligent recommendations

export interface SkillSuggestion {
  category: string;
  skills: string[];
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SkillValidation {
  isRelevant: boolean;
  suggestion?: string;
  reason?: string;
  alternatives?: string[];
  category?: string;
  relevanceScore?: number;
}

// Professional field patterns to detect user's industry
export const professionalFields = {
  technology: {
    titles: [
      "software engineer", "developer", "programmer", "web developer", "full stack",
      "frontend", "backend", "devops", "data scientist", "ml engineer", 
      "systems engineer", "technical lead", "architect", "qa engineer",
      "mobile developer", "game developer", "ui/ux designer", "product manager"
    ],
    relevantCategories: ["frontendFrameworks", "backendLanguages", "databases", "cloudPlatforms", "devopsTools", "testing", "aiMl", "mobileDevelopment"],
    requiredSkillTypes: ["technical", "programming", "tools", "frameworks"]
  },
  business: {
    titles: [
      "business analyst", "project manager", "product manager", "consultant",
      "account manager", "sales", "marketing", "operations", "strategy",
      "business development", "analyst", "coordinator", "administrator"
    ],
    relevantCategories: ["softSkills", "projectManagement", "designTools"],
    requiredSkillTypes: ["management", "communication", "analysis", "leadership"]
  },
  design: {
    titles: [
      "designer", "graphic designer", "ui designer", "ux designer", "creative",
      "art director", "brand designer", "web designer", "product designer",
      "visual designer", "interaction designer"
    ],
    relevantCategories: ["designTools", "frontendFrameworks", "softSkills"],
    requiredSkillTypes: ["design", "creative", "visual", "user experience"]
  },
  marketing: {
    titles: [
      "marketing", "digital marketing", "content", "social media", "seo",
      "sem", "brand", "communications", "pr", "copywriter", "content creator"
    ],
    relevantCategories: ["softSkills", "designTools", "projectManagement"],
    requiredSkillTypes: ["marketing", "communication", "analytics", "creative"]
  },
  finance: {
    titles: [
      "financial analyst", "accountant", "finance", "investment", "banking",
      "controller", "cfo", "treasurer", "risk analyst", "auditor"
    ],
    relevantCategories: ["softSkills", "projectManagement"],
    requiredSkillTypes: ["analytical", "financial", "compliance", "reporting"]
  }
};

export function detectProfessionalField(title: string): keyof typeof professionalFields | null {
  const lowerTitle = title.toLowerCase();
  
  for (const [field, data] of Object.entries(professionalFields)) {
    if (data.titles.some(keyword => lowerTitle.includes(keyword))) {
      return field as keyof typeof professionalFields;
    }
  }
  
  return null;
}

// Comprehensive skill categories with modern, trending skills
export const skillCategories: Record<string, SkillSuggestion> = {
  // Frontend Development
  frontendFrameworks: {
    category: "Frontend Frameworks",
    skills: [
      "React", "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js", 
      "Astro", "Solid.js", "Qwik", "Remix"
    ],
    description: "Modern frontend frameworks and libraries",
    priority: "high"
  },
  
  frontendTools: {
    category: "Frontend Tools & Build Systems",
    skills: [
      "Vite", "Webpack", "Rollup", "Parcel", "ESBuild", "Turborepo", 
      "Nx", "Lerna", "PostCSS", "Sass", "Styled Components", "Emotion"
    ],
    description: "Build tools and styling solutions",
    priority: "high"
  },

  // Backend Development
  backendLanguages: {
    category: "Backend Languages",
    skills: [
      "Node.js", "Python", "Go", "Rust", "Java", "C#", "PHP", 
      "Ruby", "Kotlin", "Scala", "Elixir", "Deno", "Bun"
    ],
    description: "Server-side programming languages",
    priority: "high"
  },

  backendFrameworks: {
    category: "Backend Frameworks",
    skills: [
      "Express.js", "Fastify", "Koa", "NestJS", "Django", "Flask", 
      "FastAPI", "Spring Boot", "ASP.NET Core", "Laravel", "Rails", 
      "Phoenix", "Fiber", "Actix", "Axum"
    ],
    description: "Backend frameworks and web servers",
    priority: "high"
  },

  // Databases
  databases: {
    category: "Databases",
    skills: [
      "PostgreSQL", "MongoDB", "Redis", "MySQL", "SQLite", "MariaDB",
      "CouchDB", "Cassandra", "DynamoDB", "Supabase", "PlanetScale",
      "Prisma", "Drizzle", "TypeORM", "Sequelize", "Mongoose"
    ],
    description: "Database systems and ORMs",
    priority: "high"
  },

  // Cloud & DevOps
  cloudPlatforms: {
    category: "Cloud Platforms",
    skills: [
      "AWS", "Google Cloud", "Azure", "Vercel", "Netlify", "Railway",
      "Render", "DigitalOcean", "Heroku", "Cloudflare", "Supabase",
      "Firebase", "Appwrite", "PlanetScale"
    ],
    description: "Cloud hosting and backend services",
    priority: "high"
  },

  devopsTools: {
    category: "DevOps & Infrastructure",
    skills: [
      "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins", 
      "GitHub Actions", "GitLab CI", "CircleCI", "Pulumi", "Helm",
      "Istio", "Prometheus", "Grafana", "ELK Stack"
    ],
    description: "Infrastructure and deployment tools",
    priority: "medium"
  },

  // Mobile Development
  mobileDevelopment: {
    category: "Mobile Development",
    skills: [
      "React Native", "Flutter", "Swift", "Kotlin", "Expo", 
      "Ionic", "Capacitor", "Xamarin", "NativeScript", "Tauri"
    ],
    description: "Mobile app development frameworks",
    priority: "medium"
  },

  // AI & Machine Learning
  aiMl: {
    category: "AI & Machine Learning",
    skills: [
      "TensorFlow", "PyTorch", "Scikit-learn", "OpenAI API", "Hugging Face",
      "LangChain", "Vector Databases", "Pinecone", "Weaviate", "Pandas",
      "NumPy", "Jupyter", "Google Gemini", "Anthropic Claude", "Stable Diffusion"
    ],
    description: "AI, ML, and data science tools",
    priority: "high"
  },

  // Testing
  testing: {
    category: "Testing & Quality Assurance",
    skills: [
      "Jest", "Vitest", "Cypress", "Playwright", "Testing Library", 
      "Storybook", "Chromatic", "Selenium", "Puppeteer", "Postman",
      "Insomnia", "Artillery", "K6"
    ],
    description: "Testing frameworks and tools",
    priority: "medium"
  },

  // Design & UI/UX
  designTools: {
    category: "Design & UI/UX",
    skills: [
      "Figma", "Adobe XD", "Sketch", "Framer", "Principle", 
      "InVision", "Zeplin", "Abstract", "Miro", "FigJam",
      "Tailwind CSS", "Chakra UI", "Material-UI", "Ant Design"
    ],
    description: "Design tools and UI libraries",
    priority: "medium"
  },

  // Soft Skills
  softSkills: {
    category: "Soft Skills",
    skills: [
      "Leadership", "Communication", "Problem Solving", "Critical Thinking",
      "Team Collaboration", "Project Management", "Agile Methodology",
      "Scrum", "Mentoring", "Public Speaking", "Time Management",
      "Adaptability", "Creativity", "Analytical Thinking"
    ],
    description: "Interpersonal and management skills",
    priority: "high"
  },

  // Project Management
  projectManagement: {
    category: "Project Management",
    skills: [
      "Jira", "Asana", "Trello", "Monday.com", "Notion", "Linear",
      "ClickUp", "Basecamp", "Slack", "Discord", "Microsoft Teams",
      "Zoom", "Confluence", "GitHub Projects"
    ],
    description: "Project management and collaboration tools",
    priority: "medium"
  },

  // Version Control
  versionControl: {
    category: "Version Control",
    skills: [
      "Git", "GitHub", "GitLab", "Bitbucket", "Subversion",
      "Mercurial", "Git Flow", "GitHub Flow", "Conventional Commits"
    ],
    description: "Version control systems and workflows",
    priority: "high"
  }
};

// Common irrelevant skills that should be flagged
const irrelevantSkills = [
  // Sports & Recreation
  "racing", "racing cars", "car racing", "auto racing", "formula 1", "f1",
  "horsing", "horse racing", "horseback riding", "equestrian",
  "football", "soccer", "basketball", "tennis", "golf", "swimming",
  "running", "jogging", "hiking", "camping", "fishing", "hunting",
  
  // Personal Activities
  "hosting", "party hosting", "event hosting", "dinner hosting",
  "gaming", "video gaming", "gaming tournaments", "esports gaming",
  "singing", "dancing", "music", "guitar", "piano", "drums",
  "cooking", "baking", "recipe creation", "food blogging",
  "traveling", "tourism", "sightseeing", "vacation planning",
  "reading novels", "fiction reading", "romance novels",
  "watching movies", "tv shows", "netflix", "entertainment",
  
  // Social Media (Personal)
  "social media scrolling", "instagram", "tiktok", "facebook personal",
  "snapchat", "personal blogging", "vlogging personal",
  
  // Daily Activities
  "sleeping", "napping", "resting", "lounging",
  "shopping", "retail therapy", "mall visits", "online shopping personal",
  "eating", "drinking", "partying", "clubbing",
  
  // Hobbies (Non-Professional)
  "collecting", "stamp collecting", "coin collecting",
  "gardening", "flower arranging", "lawn care",
  "crafting", "knitting", "sewing", "scrapbooking",
  "board games", "card games", "puzzles",
  "anime", "manga", "comics", "cartoons",
  
  // Personal Care
  "beauty", "makeup", "skincare", "fashion", "styling personal",
  "hair styling", "nail art", "personal grooming"
];

// Professional alternatives for common personal interests
const professionalAlternatives: Record<string, string[]> = {
  "racing": ["Performance Optimization", "High-Performance Computing", "Speed Testing", "Load Testing"],
  "horsing": ["Leadership", "Team Management", "Strategic Planning", "Risk Management"],
  "hosting": ["Web Hosting", "Cloud Hosting", "Server Administration", "Event Management"],
  "gaming": ["Game Development", "Unity", "Unreal Engine", "Interactive Media", "User Experience Design"],
  "music": ["Audio Processing", "Sound Design", "Digital Audio Workstations", "Multimedia Development"],
  "cooking": ["Process Optimization", "Resource Management", "Quality Control", "Team Coordination"],
  "traveling": ["Cross-cultural Communication", "Remote Work", "Global Project Management", "Cultural Awareness"],
  "reading": ["Research Skills", "Documentation", "Technical Writing", "Knowledge Management"],
  "movies": ["Video Production", "Multimedia Content Creation", "Storytelling", "Visual Design"],
  "social media": ["Digital Marketing", "Content Strategy", "Social Media Marketing", "Community Management"],
  "shopping": ["Vendor Management", "Procurement", "Cost Analysis", "Supply Chain Management"],
  "sports": ["Team Leadership", "Goal Setting", "Performance Analytics", "Competitive Analysis"],
  "gardening": ["Project Planning", "Resource Allocation", "Growth Strategy", "Sustainable Practices"],
  "crafting": ["Creative Problem Solving", "Attention to Detail", "Manual Dexterity", "Quality Assurance"],
  "beauty": ["Brand Management", "Customer Service", "Visual Merchandising", "Color Theory"]
};

export function validateSkill(skill: string, professionalTitle?: string): SkillValidation {
  const lowerSkill = skill.toLowerCase().trim();
  
  // Detect the user's professional field
  const userField = professionalTitle ? detectProfessionalField(professionalTitle) : null;
  
  // Check if it's clearly irrelevant (personal interests)
  const isIrrelevant = irrelevantSkills.some(irrelevant => 
    lowerSkill.includes(irrelevant.toLowerCase()) || 
    irrelevant.toLowerCase().includes(lowerSkill)
  );

  if (isIrrelevant) {
    // Find professional alternatives based on user's field
    const alternativeKey = Object.keys(professionalAlternatives).find(key => 
      lowerSkill.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerSkill)
    );
    
    let alternatives = alternativeKey ? professionalAlternatives[alternativeKey] : [];
    
    // Provide field-specific alternatives if we know the user's profession
    if (userField && professionalFields[userField]) {
      const fieldData = professionalFields[userField];
      const fieldSpecificSkills = fieldData.relevantCategories.flatMap(cat => 
        skillCategories[cat]?.skills.slice(0, 3) || []
      );
      alternatives = [...alternatives, ...fieldSpecificSkills].slice(0, 4);
    }

    return {
      isRelevant: false,
      reason: professionalTitle 
        ? `"${skill}" appears to be a personal interest, not relevant for ${professionalTitle} role`
        : `"${skill}" appears to be a personal interest rather than a professional skill`,
      suggestion: userField 
        ? `For ${professionalTitle}, focus on ${professionalFields[userField].requiredSkillTypes.join(', ')} skills`
        : "Consider replacing with professional skills that demonstrate your technical abilities or work-related competencies",
      alternatives,
      category: "Personal Interest (Not Professional)",
      relevanceScore: 0
    };
  }

  // Check if it matches any of our professional categories
  for (const categoryData of Object.values(skillCategories)) {
    const matchingSkill = categoryData.skills.find(s => 
      s.toLowerCase().includes(lowerSkill) || 
      lowerSkill.includes(s.toLowerCase())
    );
    
    if (matchingSkill) {
      // Calculate relevance score based on user's field
      let relevanceScore = 5; // Base score for any professional skill
      
      if (userField && professionalFields[userField]) {
        const fieldData = professionalFields[userField];
        // Find the category key for this skill
        const categoryKey = Object.keys(skillCategories).find(key => 
          skillCategories[key] === categoryData
        );
        
        if (categoryKey && fieldData.relevantCategories.includes(categoryKey)) {
          relevanceScore = 10; // Highly relevant to user's field
        } else if (categoryData.category.toLowerCase().includes('soft skills')) {
          relevanceScore = 8; // Soft skills are generally relevant
        } else {
          relevanceScore = 6; // Professional but not directly related
        }
      }
      
      const relevanceMessage = relevanceScore >= 9 
        ? `Excellent choice! "${skill}" is highly relevant for ${professionalTitle || 'your field'}`
        : relevanceScore >= 7
        ? `Good choice! "${skill}" is a valuable ${categoryData.category} skill`
        : `"${skill}" is a professional skill, but consider prioritizing more field-specific skills`;

      return {
        isRelevant: true,
        category: categoryData.category,
        suggestion: relevanceMessage,
        relevanceScore
      };
    }
  }

  // Unknown skill - might be valid but need context
  return {
    isRelevant: true,
    category: "Other Professional Skill",
    suggestion: `"${skill}" has been added. ${userField ? `Ensure it's relevant for ${professionalTitle} roles` : 'Consider providing more context if it\'s a specialized skill'}`,
    relevanceScore: 5
  };
}

export function getSkillSuggestions(category?: string, limit: number = 10): string[] {
  if (category) {
    const categoryData = Object.values(skillCategories).find(
      cat => cat.category.toLowerCase() === category.toLowerCase()
    );
    return categoryData ? categoryData.skills.slice(0, limit) : [];
  }

  // Return trending/popular skills from high-priority categories
  const highPrioritySkills = Object.values(skillCategories)
    .filter(cat => cat.priority === 'high')
    .flatMap(cat => cat.skills)
    .slice(0, limit);

  return highPrioritySkills;
}

export function searchSkills(query: string, limit: number = 20): string[] {
  const lowerQuery = query.toLowerCase();
  const allSkills = Object.values(skillCategories).flatMap(cat => cat.skills);
  
  // First, find exact matches
  const exactMatches = allSkills.filter(skill => 
    skill.toLowerCase().includes(lowerQuery)
  );

  // Then, find partial matches
  const partialMatches = allSkills.filter(skill => 
    !exactMatches.includes(skill) && 
    skill.toLowerCase().split(' ').some(word => word.startsWith(lowerQuery))
  );

  return [...exactMatches, ...partialMatches].slice(0, limit);
}

export function getTrendingSkills(): string[] {
  return [
    // Latest frontend trends
    "Next.js 14", "Astro", "Solid.js", "Qwik", "Bun", "Tauri",
    
    // AI/ML trending
    "OpenAI API", "LangChain", "Vector Databases", "Google Gemini", "Anthropic Claude",
    
    // Backend trends
    "Deno", "Bun", "Drizzle ORM", "tRPC", "Prisma", "Supabase",
    
    // DevOps trends
    "Docker Compose", "Kubernetes", "Terraform", "GitHub Actions", "Vercel",
    
    // Database trends
    "PlanetScale", "Turso", "Neon", "Xata", "Edge Runtime",
    
    // Mobile trends
    "Expo Router", "React Native 0.73", "Flutter 3.16", "Capacitor"
  ];
}