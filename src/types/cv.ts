export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  website?: string;
  github?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrentJob: boolean;
  location: string;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  isCurrentStudy: boolean;
  gpa?: string;
  location: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft' | 'Language' | 'Other';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
  url?: string;
  github?: string;
  achievements: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Conversational' | 'Basic';
}

export interface CVData {
  personalInfo: PersonalInfo;
  professionalSummary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  customSections?: CustomSection[];
}

export interface CustomSection {
  id: string;
  title: string;
  items: {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    date?: string;
  }[];
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Modern' | 'Classic' | 'Creative' | 'Minimalist' | 'Executive';
  preview: string;
  isPremium: boolean;
  colorSchemes: {
    id: string;
    name: string;
    primary: string;
    secondary: string;
    accent: string;
  }[];
}