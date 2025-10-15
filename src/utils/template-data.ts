export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  downloads: number;
  tags: string[];
  preview: string;
  isPremium: boolean;
  isATSFriendly: boolean;
  atsScore: number;
  jobSuccessRate: number;
  interviewRate: number;
  popularIndustries: string[];
  features: string[];
}

export const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Chicago Professional',
    description: 'Clean, traditional template inspired by Resume Genius Chicago design with 96% ATS compatibility',
    category: 'Professional',
    difficulty: 'Beginner',
    rating: 4.9,
    downloads: 45200,
    tags: ['ATS-Friendly', 'Traditional', 'Corporate', 'Clean'],
    preview: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=400&fit=crop&crop=center',
    isPremium: false,
    isATSFriendly: true,
    atsScore: 96,
    jobSuccessRate: 89,
    interviewRate: 76,
    popularIndustries: ['Finance', 'Banking', 'Corporate', 'Government'],
    features: ['Traditional Layout', 'Standard Fonts', 'Clear Section Headers', 'ATS-Optimized']
  },
  {
    id: '2',
    name: 'Modern Executive',
    description: 'Contemporary design for senior professionals with sophisticated formatting and proven success rates',
    category: 'Executive',
    difficulty: 'Advanced',
    rating: 4.8,
    downloads: 28900,
    tags: ['Executive', 'Modern', 'Leadership', 'ATS-Friendly'],
    preview: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=400&fit=crop&crop=center',
    isPremium: true,
    isATSFriendly: true,
    atsScore: 94,
    jobSuccessRate: 85,
    interviewRate: 72,
    popularIndustries: ['C-Suite', 'Consulting', 'Finance', 'Technology'],
    features: ['Executive Summary Focus', 'Achievement Metrics', 'Leadership Emphasis', 'Premium Design']
  },
  {
    id: '3',
    name: 'Creative Portfolio Pro',
    description: 'Balanced creative template that maintains ATS compatibility while showcasing design skills',
    category: 'Creative',
    difficulty: 'Intermediate',
    rating: 4.7,
    downloads: 34600,
    tags: ['Creative', 'Portfolio', 'Design', 'ATS-Safe'],
    preview: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=400&fit=crop&crop=center',
    isPremium: false,
    isATSFriendly: true,
    atsScore: 87,
    jobSuccessRate: 79,
    interviewRate: 65,
    popularIndustries: ['Graphic Design', 'Marketing', 'Advertising', 'Digital Media'],
    features: ['Creative Elements', 'Portfolio Section', 'Visual Balance', 'ATS-Compatible']
  },
  {
    id: '4',
    name: 'Tech Specialist',
    description: 'Technical resume template optimized for software engineers and IT professionals with skills emphasis',
    category: 'Professional',
    difficulty: 'Intermediate',
    rating: 4.8,
    downloads: 39800,
    tags: ['Tech', 'Engineering', 'Skills-Focused', 'ATS-Friendly'],
    preview: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=300&h=400&fit=crop&crop=center',
    isPremium: false,
    isATSFriendly: true,
    atsScore: 95,
    jobSuccessRate: 87,
    interviewRate: 74,
    popularIndustries: ['Software Development', 'IT', 'Engineering', 'Startups'],
    features: ['Technical Skills Highlight', 'Project Showcase', 'Clean Code Layout', 'ATS-Optimized']
  },
  {
    id: '5',
    name: 'Fresh Graduate',
    description: 'Entry-level focused template for new graduates with education and internship emphasis',
    category: 'Academic',
    difficulty: 'Beginner',
    rating: 4.6,
    downloads: 52300,
    tags: ['Entry-Level', 'Graduate', 'Student', 'ATS-Friendly'],
    preview: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=400&fit=crop&crop=center',
    isPremium: false,
    isATSFriendly: true,
    atsScore: 97,
    jobSuccessRate: 82,
    interviewRate: 69,
    popularIndustries: ['All Industries', 'Entry-Level', 'Internships', 'Graduate Programs'],
    features: ['Education Focus', 'Skills Emphasis', 'Internship Highlight', 'Beginner-Friendly']
  }
];