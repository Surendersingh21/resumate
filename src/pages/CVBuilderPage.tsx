import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SortableList } from '@/components/ui/sortable-list';

import { EnhancedDatePicker } from '@/components/ui/date-picker';
import { SmartSkillsInput } from '@/components/ui/smart-skills-input';
import { PhoneInput } from '@/components/ui/phone-input';
import { CVUploader } from '@/components/ui/file-uploader';
import { CVAnalysisResults } from '@/components/ui/cv-analysis-results';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Languages, 
  Phone, 
  Mail, 
  MapPin, 
  Globe,
  Plus,
  Trash2,

  Eye,
  Sparkles,
  FileText,
  Loader2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  ChevronRight,
  Menu,
  X,
  Check,
  AlertCircle,
  MessageCircle,
  Send,
  Bot
} from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { exportToWord } from '@/utils/exportUtils';
import { LaTeXExportButton } from '@/components/ui/latex-export-button';
import { AIProfessionalSummary } from '@/components/ui/ai-professional-summary';
import { generateAIContent, validateCVContent } from '@/utils/aiUtils';
import type { AIValidationResult, AIGenerationOptions } from '@/utils/aiUtils';
import { GeminiStatusIndicator } from '@/components/GeminiStatusIndicator';

type Section = 'personal' | 'experience' | 'education' | 'skills' | 'languages' | 'awards' | 'insights';

const sections = [
  { id: 'personal' as Section, title: 'Personal Info', icon: User },
  { id: 'experience' as Section, title: 'Experience', icon: Briefcase },
  { id: 'education' as Section, title: 'Education', icon: GraduationCap },
  { id: 'skills' as Section, title: 'Skills', icon: Code },
  { id: 'languages' as Section, title: 'Languages', icon: Languages },
  { id: 'awards' as Section, title: 'Awards', icon: Award },
  { id: 'insights' as Section, title: 'AI Insights', icon: Sparkles },
];

export default function CVBuilderPage() {
  const cvContext = useCVContext();
  
  if (!cvContext) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Context Error</h1>
          <p className="text-gray-600">CV Context is not available. Please check the provider setup.</p>
        </div>
      </div>
    );
  }
  
  const { state, dispatch } = cvContext;
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [validationResult, setValidationResult] = useState<AIValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Live preview interaction states
  const [isPreviewHovered, setIsPreviewHovered] = useState(false);
  const [previewManualScroll, setPreviewManualScroll] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  // Chat messages container ref for auto-scroll
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Enhanced scroll management
  const scrollTimeoutRef = useRef<number | null>(null);
  
  const smoothScrollTo = (element: Element, options: ScrollIntoViewOptions = {}) => {
    // Clear any pending scroll operations
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    const defaultOptions: ScrollIntoViewOptions = {
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    };
    
    element.scrollIntoView({ ...defaultOptions, ...options });
  };

  // Auto-sync preview scrolling to current section (like form sections)
  const syncPreviewToSection = (section: Section) => {
    if (!previewRef.current || isPreviewHovered || previewManualScroll) {
      return; // Don't auto-scroll if user is interacting with preview
    }

    const sectionMap: Partial<Record<Section, string>> = {
      'personal': '.preview-personal',
      'experience': '.preview-experience', 
      'education': '.preview-education',
      'skills': '.preview-skills',
      'languages': '.preview-languages',
      'awards': '.preview-certifications'
    };

    const targetSelector = sectionMap[section];
    if (targetSelector) {
      const targetElement = previewRef.current.querySelector(targetSelector);
      if (targetElement) {
        const container = previewRef.current;
        const containerHeight = container.clientHeight;
        
        // Get the element's position relative to the container
        const elementOffsetTop = (targetElement as HTMLElement).offsetTop;
        
        // Calculate scroll position to center the section like form sections do
        const scrollPosition = Math.max(0, elementOffsetTop - (containerHeight / 4));
        
        // Smooth scroll to the target section
        container.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // Function to handle section navigation with improved smooth scrolling
  const navigateToSection = (section: Section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false); // Close mobile menu if open
    
    // Run validation for the new section with optimized timing
    setTimeout(() => {
      const validation = validateSectionByName(section);
      setValidationErrors(validation.errors);
    }, 100);
    
    // Sync preview to new section immediately (like form sections)
    setTimeout(() => {
      if (!previewManualScroll) {
        syncPreviewToSection(section);
      }
    }, 100);
    
    // Improved scroll behavior - scroll to section header for better UX
    scrollTimeoutRef.current = window.setTimeout(() => {
      const sectionElement = document.querySelector(`[data-section="${section}"]`) || 
                            document.querySelector('.main-content-area');
      
      if (sectionElement) {
        const rect = sectionElement.getBoundingClientRect();
        const headerHeight = 55; // Account for compact sticky header using Fibonacci spacing
        const shouldScroll = rect.top < headerHeight || rect.top > window.innerHeight - 200;
        
        if (shouldScroll) {
          smoothScrollTo(sectionElement, { 
            block: 'start',
            behavior: 'smooth'
          });
        }
      }
    }, 50); // Reduced delay for faster response
  };

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Enhanced scroll restoration and smooth page transitions
  useEffect(() => {
    // Set smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Cleanup on unmount
    return () => {
      document.documentElement.style.scrollBehavior = '';
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Auto-sync preview when section changes (if not manually controlled)
  useEffect(() => {
    if (activeSection && !previewManualScroll && !isPreviewHovered) {
      const timer = setTimeout(() => {
        syncPreviewToSection(activeSection);
      }, 150); // Quick response like form sections
      
      return () => clearTimeout(timer);
    }
  }, [activeSection, previewManualScroll, isPreviewHovered]);

  // Block any external scroll events from affecting the preview
  useEffect(() => {
    const handleGlobalScroll = (e: Event) => {
      if (previewRef.current && e.target !== previewRef.current) {
        // Prevent any global scroll from affecting preview
        e.stopPropagation();
      }
    };

    document.addEventListener('scroll', handleGlobalScroll, true);
    window.addEventListener('scroll', handleGlobalScroll, true);

    return () => {
      document.removeEventListener('scroll', handleGlobalScroll, true);
      window.removeEventListener('scroll', handleGlobalScroll, true);
    };
  }, []);

  // CV Analyzer state
  const [mode, setMode] = useState<'builder' | 'analyzer' | null>(null);
  const [modeSelected, setModeSelected] = useState(false);
  const [showBuilderForm, setShowBuilderForm] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);

  // Validation state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Popup dialog state for empty fields confirmation
  const [showEmptyFieldsDialog, setShowEmptyFieldsDialog] = useState(false);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);

  // Auto-scroll chat messages to bottom
  const scrollChatToBottom = () => {
    if (chatMessagesRef.current) {
      const container = chatMessagesRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  // Chatbot state
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [pendingGeneration, setPendingGeneration] = useState<{section: string, context?: any} | null>(null);

  // Auto-scroll when chat messages change
  useEffect(() => {
    if (chatMessages.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(scrollChatToBottom, 100);
    }
  }, [chatMessages]);

  // Auto-scroll when generating summary state changes
  useEffect(() => {
    if (isGeneratingSummary) {
      setTimeout(scrollChatToBottom, 100);
    }
  }, [isGeneratingSummary]);

  // Chatbot types and questions
  interface ChatMessage {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: Date;
  }

  const summaryQuestions = [
    {
      id: 'role',
      question: "What's your current or desired job title?",
      placeholder: "e.g., Senior Software Engineer, Marketing Manager"
    },
    {
      id: 'experience',
      question: "How many years of experience do you have in this field?",
      placeholder: "e.g., 5 years, 2+ years, Entry level"
    },
    {
      id: 'skills',
      question: "What are your top 3-5 key skills or areas of expertise?",
      placeholder: "e.g., JavaScript, Team Leadership, Digital Marketing"
    },
    {
      id: 'achievements',
      question: "What's your biggest professional achievement or accomplishment?",
      placeholder: "e.g., Led a team that increased sales by 30%"
    },
    {
      id: 'goals',
      question: "What type of role or company are you targeting?",
      placeholder: "e.g., Tech startup, Fortune 500 company, Remote work"
    }
  ];

  const handlePersonalInfoChange = (field: string, value: string) => {
    dispatch({
      type: 'UPDATE_PERSONAL_INFO',
      payload: { [field]: value }
    });
    
    // Run real-time validation for personal info
    setTimeout(() => {
      if (activeSection === 'personal') {
        const validation = validatePersonalInfo();
        setValidationErrors(validation.errors);
      }
    }, 100);
  };

  const addExperience = () => {
    const newId = Date.now().toString();
    dispatch({
      type: 'ADD_EXPERIENCE',
      payload: {
        id: newId,
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        location: ''
      }
    });
    
    // Enhanced auto-scroll to the new experience entry
    scrollTimeoutRef.current = window.setTimeout(() => {
      const newExperienceElement = document.querySelector(`[data-experience-id="${newId}"]`);
      if (newExperienceElement) {
        smoothScrollTo(newExperienceElement, { 
          block: 'center',
          behavior: 'smooth'
        });
      } else {
        // Fallback: scroll to the experience section
        const experienceSection = document.querySelector('[data-section="experience"]');
        if (experienceSection) {
          smoothScrollTo(experienceSection, { block: 'start' });
        }
      }
    }, 100); // Faster response
  };

  const updateExperience = (id: string, field: string, value: any) => {
    dispatch({
      type: 'UPDATE_EXPERIENCE',
      payload: { id, field, value }
    });
    
    // Run real-time validation for experience
    setTimeout(() => {
      if (activeSection === 'experience') {
        const validation = validateExperience();
        setValidationErrors(validation.errors);
      }
    }, 100);
  };

  const removeExperience = (id: string) => {
    dispatch({
      type: 'REMOVE_EXPERIENCE',
      payload: id
    });
  };

  const addEducation = () => {
    const newId = Date.now().toString();
    dispatch({
      type: 'ADD_EDUCATION',
      payload: {
        id: newId,
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false,
        gpa: '',
        description: ''
      }
    });
    
    // Enhanced auto-scroll to the new education entry
    scrollTimeoutRef.current = window.setTimeout(() => {
      const newEducationElement = document.querySelector(`[data-education-id="${newId}"]`);
      if (newEducationElement) {
        smoothScrollTo(newEducationElement, { 
          block: 'center',
          behavior: 'smooth'
        });
      } else {
        // Fallback: scroll to the education section
        const educationSection = document.querySelector('[data-section="education"]');
        if (educationSection) {
          smoothScrollTo(educationSection, { block: 'start' });
        }
      }
    }, 100); // Faster response
  };

  const updateEducation = (id: string, field: string, value: any) => {
    dispatch({
      type: 'UPDATE_EDUCATION',
      payload: { id, field, value }
    });
    
    // Run real-time validation for education
    setTimeout(() => {
      if (activeSection === 'education') {
        const validation = validateEducation();
        setValidationErrors(validation.errors);
      }
    }, 100);
  };

  const removeEducation = (id: string) => {
    dispatch({
      type: 'REMOVE_EDUCATION',
      payload: id
    });
  };

  const addSkill = (skillName: string = '') => {
    dispatch({
      type: 'ADD_SKILL',
      payload: {
        id: Date.now().toString(),
        name: skillName,
        level: 'Beginner',
        category: 'Technical'
      }
    });
  };

  const updateSkill = (id: string, field: string, value: any) => {
    dispatch({
      type: 'UPDATE_SKILL',
      payload: { id, field, value }
    });
  };

  const removeSkill = (id: string) => {
    dispatch({
      type: 'REMOVE_SKILL',
      payload: id
    });
  };

  const addLanguage = () => {
    dispatch({
      type: 'ADD_LANGUAGE',
      payload: {
        id: Date.now().toString(),
        name: '',
        proficiency: 'Beginner'
      }
    });
  };

  const updateLanguage = (id: string, field: string, value: any) => {
    dispatch({
      type: 'UPDATE_LANGUAGE',
      payload: { id, field, value }
    });
  };

  const removeLanguage = (id: string) => {
    dispatch({
      type: 'REMOVE_LANGUAGE',
      payload: id
    });
  };

  const addAward = () => {
    dispatch({
      type: 'ADD_AWARD',
      payload: {
        id: Date.now().toString(),
        title: '',
        issuer: '',
        date: '',
        description: ''
      }
    });
  };

  const updateAward = (id: string, field: string, value: any) => {
    dispatch({
      type: 'UPDATE_AWARD',
      payload: { id, field, value }
    });
  };

  const removeAward = (id: string) => {
    dispatch({
      type: 'REMOVE_AWARD',
      payload: id
    });
  };

  const generateAIContentForSection = async (section: string, context?: any) => {
    // Check if user has provided their position info
    if (!state.personalInfo.title) {
      // Open chatbot to ask for position first
      setIsChatbotOpen(true);
      setCurrentQuestionIndex(0);
      setUserResponses({});
      setChatMessages([{
        id: Date.now().toString(),
        text: `Hi! To generate relevant content for your ${section}, I need to know more about your professional background. Let's start with a few quick questions:`,
        isBot: true,
        timestamp: new Date()
      }, {
        id: (Date.now() + 1).toString(),
        text: summaryQuestions[0].question,
        isBot: true,
        timestamp: new Date()
      }]);
      // Store the section and context for later use
      setPendingGeneration({ section, context });
      return;
    }

    // If we have position info, generate content directly
    setIsGeneratingAI(true);
    try {
      const options: AIGenerationOptions = {
        section: section as 'summary' | 'experience' | 'education' | 'skills' | 'achievement',
        context: {
          role: state.personalInfo.title,
          industry: getIndustryFromRole(state.personalInfo.title),
          experience_level: getExperienceLevelFromYears(state.personalInfo.summary),
          ...context
        }
      };

      const content = await generateAIContent(options);
      
      switch (section) {
        case 'summary':
          handlePersonalInfoChange('summary', content);
          break;
        case 'experience':
          if (context?.id) {
            updateExperience(context.id, 'description', content);
          }
          break;
        case 'education':
          if (context?.id) {
            updateEducation(context.id, 'description', content);
          }
          break;
      }
    } catch (error) {
      console.error('AI generation error:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleValidateCV = async () => {
    setIsValidating(true);
    try {
      const result = await validateCVContent(state);
      setValidationResult(result);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };



  const handleExportToWord = async () => {
    setIsExporting(true);
    try {
      await exportToWord(state);

    } catch (error) {
      console.error('Word export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // CV Analyzer functions
  const handleAnalysisComplete = (data: any) => {
    // Safety check
    if (!data) {
      return;
    }
    
    setAnalysisData(data);
    setShowAnalysisResults(true);
  };

  const handleImproveCV = (extractedData: any) => {
    // Populate the CV builder with extracted data
    if (extractedData.personalInfo) {
      const personalInfo = extractedData.personalInfo;
      
      // Handle name parsing - split full name into first and last name if needed
      if (personalInfo.name && !personalInfo.firstName && !personalInfo.lastName) {
        const nameParts = personalInfo.name.trim().split(' ');
        if (nameParts.length >= 2) {
          handlePersonalInfoChange('firstName', nameParts[0]);
          handlePersonalInfoChange('lastName', nameParts.slice(1).join(' '));
        } else {
          handlePersonalInfoChange('firstName', nameParts[0] || '');
        }
      }
      
      // Map other personal info fields
      const fieldMapping: { [key: string]: string } = {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        phone: 'phone',
        location: 'location',
        website: 'website',
        title: 'title',
        summary: 'summary'
      };
      
      Object.entries(personalInfo).forEach(([key, value]) => {
        if (value && typeof value === 'string' && fieldMapping[key]) {
          handlePersonalInfoChange(fieldMapping[key], value);
        }
      });
    }

    // Add experience entries
    if (extractedData.experience && extractedData.experience.length > 0) {
      extractedData.experience.forEach((exp: any, index: number) => {
        // Parse duration if provided as a single field like "2020 - Present" or "2020 - 2023"
        let startDate = exp.startDate || '';
        let endDate = exp.endDate || '';
        let current = exp.current || false;
        
        if (exp.duration && !startDate && !endDate) {
          const durationParts = exp.duration.split(' - ');
          if (durationParts.length >= 2) {
            startDate = durationParts[0].trim();
            endDate = durationParts[1].trim();
            if (endDate.toLowerCase().includes('present') || endDate.toLowerCase().includes('current')) {
              current = true;
              endDate = '';
            }
          }
        }
        
        dispatch({
          type: 'ADD_EXPERIENCE',
          payload: {
            id: (Date.now() + index).toString(),
            company: exp.company || '',
            position: exp.position || exp.title || '',
            startDate: startDate,
            endDate: endDate,
            current: current,
            description: exp.description || '',
            location: exp.location || ''
          }
        });
      });
    }

    // Add education entries
    if (extractedData.education && extractedData.education.length > 0) {
      extractedData.education.forEach((edu: any, index: number) => {
        // Parse duration for education too
        let startDate = edu.startDate || '';
        let endDate = edu.endDate || '';
        
        if (edu.duration && !startDate && !endDate) {
          const durationParts = edu.duration.split(' - ');
          if (durationParts.length >= 2) {
            startDate = durationParts[0].trim();
            endDate = durationParts[1].trim();
          } else if (edu.year) {
            // Handle single year format
            endDate = edu.year;
          }
        }
        
        dispatch({
          type: 'ADD_EDUCATION',
          payload: {
            id: (Date.now() + index + 1000).toString(),
            institution: edu.institution || '',
            degree: edu.degree || '',
            field: edu.field || '',
            startDate: startDate,
            endDate: endDate,
            current: false,
            gpa: edu.gpa || '',
            description: edu.description || ''
          }
        });
      });
    }

    // Add skills
    if (extractedData.skills && extractedData.skills.length > 0) {
      extractedData.skills.forEach((skill: string) => {
        dispatch({
          type: 'ADD_SKILL',
          payload: {
            id: Date.now().toString() + Math.random(),
            name: skill,
            level: 'Intermediate',
            category: 'Technical'
          }
        });
      });
    }

    // Switch to builder mode and reset analyzer state
    setMode('builder');
    setModeSelected(true);
    setShowAnalysisResults(false);
    setAnalysisData(null);
    
    // Show success message

    
    // Show a success message or navigate to the first section
    navigateToSection('personal');
    
    // Add a temporary success indicator
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
    successMessage.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      CV successfully imported and enhanced!
    `;
    document.body.appendChild(successMessage);
    
    // Remove success message after 4 seconds
    setTimeout(() => {
      if (document.body.contains(successMessage)) {
        document.body.removeChild(successMessage);
      }
    }, 4000);
  };

  const handleModeSelection = (selectedMode: 'builder' | 'analyzer') => {
    setMode(selectedMode);
    setModeSelected(true);
    if (selectedMode === 'analyzer') {
      // For analyzer mode, keep existing behavior
      setShowBuilderForm(false);
    } else {
      // For builder mode, show form immediately and navigate to first section
      setShowBuilderForm(true);
      // Navigate to the personal section when "Build from Scratch" is selected
      navigateToSection('personal');
    }
    
    // Enhanced auto-scroll to the content after mode selection
    scrollTimeoutRef.current = window.setTimeout(() => {
      const conditionalContent = document.querySelector('.conditional-content-area');
      if (conditionalContent) {
        smoothScrollTo(conditionalContent, { 
          block: 'start',
          behavior: 'smooth'
        });
      }
    }, 150); // Slight delay for content to render
  };



  const handleUploadNew = () => {
    setShowAnalysisResults(false);
    setAnalysisData(null);
    setModeSelected(false);
    setShowBuilderForm(false);
    setMode('builder');
  };

  // Chatbot functions
  const startChatbot = () => {
    setIsChatbotOpen(true);
    setCurrentQuestionIndex(0);
    setUserResponses({});
    setChatMessages([
      {
        id: Date.now().toString(),
        text: "Hi! I'm here to help you create a compelling professional summary. I'll ask you a few questions to understand your background better. Ready to get started?",
        isBot: true,
        timestamp: new Date()
      },
      {
        id: (Date.now() + 1).toString(),
        text: summaryQuestions[0].question,
        isBot: true,
        timestamp: new Date()
      }
    ]);
    
    // Auto-scroll to show initial messages
    setTimeout(scrollChatToBottom, 200);
  };

  const restartChat = () => {
    setCurrentQuestionIndex(0);
    setUserResponses({});
    setChatMessages([
      {
        id: Date.now().toString(),
        text: "Let's start over! I'll help you create a new professional summary.",
        isBot: true,
        timestamp: new Date()
      },
      {
        id: (Date.now() + 1).toString(),
        text: summaryQuestions[0].question,
        isBot: true,
        timestamp: new Date()
      }
    ]);
    
    // Auto-scroll to show restarted messages
    setTimeout(scrollChatToBottom, 200);
  };

  const handleChatResponse = (response: string) => {
    if (!response.trim()) return;

    const currentQuestion = summaryQuestions[currentQuestionIndex];
    const newUserResponse = { ...userResponses, [currentQuestion.id]: response };
    setUserResponses(newUserResponse);

    // Update personal info if we're getting the role
    if (currentQuestion.id === 'role') {
      handlePersonalInfoChange('title', response);
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: response,
      isBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    
    // Auto-scroll after adding user message
    setTimeout(scrollChatToBottom, 100);

    // Move to next question or generate summary
    if (currentQuestionIndex < summaryQuestions.length - 1) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextQuestionIndex);
      
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: summaryQuestions[nextQuestionIndex].question,
          isBot: true,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, botMessage]);
        // Auto-scroll after adding bot message
        setTimeout(scrollChatToBottom, 150);
      }, 500);
    } else {
      // All questions answered - generate content
      if (pendingGeneration) {
        // Generate content for pending section
        generateContentFromResponses(newUserResponse, pendingGeneration.section, pendingGeneration.context);
        setPendingGeneration(null);
      } else {
        // Generate summary (original flow)
        generateSummaryFromResponses(newUserResponse);
      }
    }
  };

  const generateContentFromResponses = async (responses: Record<string, string>, section: string, context?: any) => {
    setIsGeneratingSummary(true);
    
    try {
      // Add "generating" message
      const generatingMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `Perfect! Let me generate relevant ${section} content based on your ${responses.role} background...`,
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, generatingMessage]);
      // Auto-scroll to show generating message
      setTimeout(scrollChatToBottom, 100);

      // Create context for AI generation
      const aiContext = {
        role: responses.role || '',
        experience: responses.experience || '',
        skills: responses.skills || '',
        achievements: responses.achievements || '',
        goals: responses.goals || '',
        industry: getIndustryFromRole(responses.role || ''),
        experience_level: responses.experience?.includes('Entry') || responses.experience?.includes('0') ? 'entry' :
                          responses.experience?.match(/\d+/) && parseInt(responses.experience.match(/\d+/)![0]) >= 5 ? 'senior' : 'mid',
        ...context
      };

      const content = await generateAIContent({
        section: section as 'summary' | 'experience' | 'education' | 'skills' | 'achievement',
        context: aiContext
      });

      // Apply the generated content
      switch (section) {
        case 'summary':
          handlePersonalInfoChange('summary', content);
          break;
        case 'experience':
          if (context?.id) {
            updateExperience(context.id, 'description', content);
          }
          break;
        case 'education':
          if (context?.id) {
            updateEducation(context.id, 'description', content);
          }
          break;
      }

      // Add success message
      const successMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `Great! I've generated ${section} content tailored for a ${responses.role} with ${responses.experience} of experience. You can review and edit it in the form above.`,
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, successMessage]);

    } catch (error) {
      console.error(`Failed to generate ${section}:`, error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `I'm sorry, there was an error generating your ${section} content. Please try again or write it manually.`,
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeneratingSummary(false);
      // Close chatbot after generation
      setTimeout(() => {
        setIsChatbotOpen(false);
      }, 3000);
    }
  };

  const generateSummaryFromResponses = async (responses: Record<string, string>) => {
    setIsGeneratingSummary(true);
    
    try {
      // Add "generating" message
      const generatingMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Perfect! Let me generate a professional summary based on your responses...",
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, generatingMessage]);
      // Auto-scroll to show generating message
      setTimeout(scrollChatToBottom, 100);

      // Create context for AI generation
      const summaryContext = {
        role: responses.role || '',
        experience: responses.experience || '',
        skills: responses.skills || '',
        achievements: responses.achievements || '',
        goals: responses.goals || '',
        industry: 'professional',
        tone: 'professional'
      };

      const summary = await generateAIContent({
        section: 'summary',
        context: summaryContext
      });

      // Update the professional summary in the form
      handlePersonalInfoChange('summary', summary);

      // Add success message
      const successMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `Great! I've generated your professional summary and added it to your CV. You can review and edit it in the form above. The summary highlights your ${responses.role} background with ${responses.experience} of experience.`,
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, successMessage]);

    } catch (error) {
      console.error('Failed to generate summary:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "I'm sorry, there was an error generating your summary. Please try again or write your summary manually.",
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // ChatInput component
  const ChatInput = ({ question, onSubmit }: { question: typeof summaryQuestions[0], onSubmit: (response: string) => void }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim()) {
        onSubmit(inputValue.trim());
        setInputValue('');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Your Answer:</Label>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={question.placeholder}
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full" disabled={!inputValue.trim()}>
          <Send className="h-4 w-4 mr-2" />
          Send Answer
        </Button>
      </form>
    );
  };

  const goToNextSection = () => {
    const currentIndex = sections.findIndex(section => section.id === activeSection);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < sections.length) {
      navigateToSection(sections[nextIndex].id);
    }
  };

  // Validation functions for different field types
  const validateEmail = (email: string): boolean => {
    // More strict email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email.trim());
  };

  const validatePhone = (phone: string): boolean => {
    // Remove all non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Check if it contains only digits and optionally starts with +
    const phoneRegex = /^(\+\d{1,3})?\d{10,15}$/;
    
    // Must have at least 10 digits total (excluding country code)
    const digitsOnly = cleanPhone.replace(/^\+\d{1,3}/, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 15 && phoneRegex.test(cleanPhone);
  };

  const validateName = (name: string): boolean => {
    // Only letters, spaces, hyphens, and apostrophes - no numbers or special characters
    const nameRegex = /^[a-zA-Z]+([\s\-']?[a-zA-Z]+)*$/;
    const trimmedName = name.trim();
    return trimmedName.length >= 2 && trimmedName.length <= 50 && nameRegex.test(trimmedName);
  };

  const validateWebsite = (url: string): boolean => {
    if (!url.trim()) return true; // Optional field
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  };

  const validateDate = (date: string): boolean => {
    if (!date.trim()) return false;
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate <= new Date();
  };

  const validateGPA = (gpa: string): boolean => {
    if (!gpa.trim()) return true; // Optional field
    const gpaNum = parseFloat(gpa);
    return !isNaN(gpaNum) && gpaNum >= 0 && gpaNum <= 4.0;
  };

  // Comprehensive validation for personal info
  // Helper functions for AI generation
  const getIndustryFromRole = (role: string): string => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('software') || roleLower.includes('developer') || roleLower.includes('engineer')) return 'technology';
    if (roleLower.includes('marketing') || roleLower.includes('brand')) return 'marketing';
    if (roleLower.includes('sales') || roleLower.includes('business development')) return 'sales';
    if (roleLower.includes('finance') || roleLower.includes('accounting')) return 'finance';
    if (roleLower.includes('design') || roleLower.includes('creative')) return 'design';
    if (roleLower.includes('healthcare') || roleLower.includes('medical') || roleLower.includes('nurse')) return 'healthcare';
    return 'professional';
  };

  const getExperienceLevelFromYears = (summary: string): 'entry' | 'mid' | 'senior' | 'executive' => {
    const summaryLower = summary.toLowerCase();
    if (summaryLower.includes('senior') || summaryLower.includes('lead') || summaryLower.includes('principal')) return 'senior';
    if (summaryLower.includes('executive') || summaryLower.includes('director') || summaryLower.includes('vp')) return 'executive';
    if (summaryLower.includes('junior') || summaryLower.includes('entry') || summaryLower.includes('graduate')) return 'entry';
    return 'mid';
  };

  const validatePersonalInfo = () => {
    const { firstName, lastName, title, email, phone, website } = state.personalInfo;
    const errors: string[] = [];

    if (!firstName.trim() || !validateName(firstName)) {
      errors.push('First name must contain only letters and be at least 2 characters');
    }
    if (!lastName.trim() || !validateName(lastName)) {
      errors.push('Last name must contain only letters and be at least 2 characters');
    }
    if (!title.trim() || title.trim().length < 2) {
      errors.push('Professional title must be at least 2 characters');
    }
    if (!email.trim() || !validateEmail(email)) {
      errors.push('Please enter a valid email address');
    }
    if (!phone.trim() || !validatePhone(phone)) {
      errors.push('Please enter a valid phone number (at least 10 digits)');
    }
    if (website.trim() && !validateWebsite(website)) {
      errors.push('Please enter a valid website URL');
    }

    return { isValid: errors.length === 0, errors };
  };

  // Validate experience entries
  const validateExperience = () => {
    const errors: string[] = [];
    
    state.experience.forEach((exp, index) => {
      if (!exp.company.trim() || exp.company.trim().length < 2) {
        errors.push(`Experience ${index + 1}: Company name must be at least 2 characters`);
      }
      if (!exp.position.trim() || exp.position.trim().length < 2) {
        errors.push(`Experience ${index + 1}: Position title must be at least 2 characters`);
      }
      if (!exp.startDate.trim() || !validateDate(exp.startDate)) {
        errors.push(`Experience ${index + 1}: Please enter a valid start date`);
      }
      if (!exp.current && (!exp.endDate.trim() || !validateDate(exp.endDate))) {
        errors.push(`Experience ${index + 1}: Please enter a valid end date or mark as current`);
      }
      if (exp.startDate && exp.endDate && new Date(exp.startDate) > new Date(exp.endDate)) {
        errors.push(`Experience ${index + 1}: Start date cannot be after end date`);
      }
    });

    return { isValid: errors.length === 0, errors };
  };

  // Validate education entries
  const validateEducation = () => {
    const errors: string[] = [];
    
    state.education.forEach((edu, index) => {
      if (!edu.institution.trim() || edu.institution.trim().length < 2) {
        errors.push(`Education ${index + 1}: Institution name must be at least 2 characters`);
      }
      if (!edu.degree.trim() || edu.degree.trim().length < 2) {
        errors.push(`Education ${index + 1}: Degree must be at least 2 characters`);
      }
      if (!edu.startDate.trim() || !validateDate(edu.startDate)) {
        errors.push(`Education ${index + 1}: Please enter a valid start date`);
      }
      if (!edu.current && (!edu.endDate.trim() || !validateDate(edu.endDate))) {
        errors.push(`Education ${index + 1}: Please enter a valid end date or mark as current`);
      }
      if (edu.gpa.trim() && !validateGPA(edu.gpa)) {
        errors.push(`Education ${index + 1}: GPA must be between 0.0 and 4.0`);
      }
    });

    return { isValid: errors.length === 0, errors };
  };

  // Main validation function for current section
  const validateCurrentSection = () => {
    switch (activeSection) {
      case 'personal':
        return validatePersonalInfo();
      case 'experience':
        return validateExperience();
      case 'education':
        return validateEducation();
      case 'skills':
        // Skills validation - ensure at least one skill
        const hasSkills = state.skills.length > 0;
        return { 
          isValid: hasSkills, 
          errors: hasSkills ? [] : ['Please add at least one skill'] 
        };
      case 'languages':
        // Languages validation - ensure valid proficiency levels
        const languageErrors: string[] = [];
        state.languages.forEach((lang, index) => {
          if (!lang.name.trim() || lang.name.trim().length < 2) {
            languageErrors.push(`Language ${index + 1}: Language name must be at least 2 characters`);
          }
          if (!lang.proficiency || !['Beginner', 'Intermediate', 'Advanced', 'Native'].includes(lang.proficiency)) {
            languageErrors.push(`Language ${index + 1}: Please select a valid proficiency level`);
          }
        });
        return { isValid: languageErrors.length === 0, errors: languageErrors };
      default:
        return { isValid: true, errors: [] };
    }
  };

  // Validate a specific section by name (for navigation)
  const validateSectionByName = (sectionName: Section) => {
    switch (sectionName) {
      case 'personal':
        return validatePersonalInfo();
      case 'experience':
        return validateExperience();
      case 'education':
        return validateEducation();
      case 'skills':
        const hasSkills = state.skills.length > 0;
        return { 
          isValid: hasSkills, 
          errors: hasSkills ? [] : ['Please add at least one skill'] 
        };
      case 'languages':
        const languageErrors: string[] = [];
        state.languages.forEach((lang, index) => {
          if (!lang.name.trim() || lang.name.trim().length < 2) {
            languageErrors.push(`Language ${index + 1}: Language name must be at least 2 characters`);
          }
          if (!lang.proficiency || !['Beginner', 'Intermediate', 'Advanced', 'Native'].includes(lang.proficiency)) {
            languageErrors.push(`Language ${index + 1}: Please select a valid proficiency level`);
          }
        });
        return { isValid: languageErrors.length === 0, errors: languageErrors };
      default:
        return { isValid: true, errors: [] };
    }
  };

  // Check if personal info is complete enough to proceed
  const isPersonalInfoComplete = () => {
    const validation = validatePersonalInfo();
    return validation.isValid;
  };

  // Get field-specific error messages - only show errors for invalid input, not empty fields
  const getFieldError = (fieldName: string, value?: string): string => {
    // Don't show errors for empty fields - only for invalid input
    if (!value?.trim()) return '';
    
    switch (fieldName) {
      case 'firstName':
        if (!validateName(value)) return 'First name must contain only letters (2-50 characters)';
        return '';
      case 'lastName':
        if (!validateName(value)) return 'Last name must contain only letters (2-50 characters)';
        return '';
      case 'title':
        if (value.trim().length < 2) return 'Professional title must be at least 2 characters';
        return '';
      case 'email':
        if (!validateEmail(value)) return 'Please enter a valid email address (e.g., user@domain.com)';
        return '';
      case 'phone':
        if (!validatePhone(value)) return 'Please enter a valid phone number (10-15 digits)';
        return '';
      case 'website':
        if (!validateWebsite(value)) return 'Please enter a valid website URL';
        return '';
      default:
        return '';
    }
  };

  const handleNextSection = () => {
    const validation = validateCurrentSection();
    
    if (!validation.isValid) {
      // Check if there are empty fields vs validation errors
      const emptyFieldsList = getEmptyFields();
      
      if (emptyFieldsList.length > 0) {
        // Show popup for empty fields
        setEmptyFields(emptyFieldsList);
        setShowEmptyFieldsDialog(true);
      } else {
        // Show regular validation errors
        setValidationErrors(validation.errors);
        scrollTimeoutRef.current = window.setTimeout(() => {
          const errorElement = document.querySelector('.validation-errors') || 
                             document.querySelector('.error-message');
          if (errorElement) {
            smoothScrollTo(errorElement, { 
              block: 'center',
              behavior: 'smooth'
            });
          }
        }, 50);
      }
      return;
    }

    // Clear errors if validation passes
    setValidationErrors([]);
    goToNextSection();
  };

  // Function to get empty required fields
  const getEmptyFields = (): string[] => {
    const empty: string[] = [];
    
    switch (activeSection) {
      case 'personal':
        if (!state.personalInfo.firstName.trim()) empty.push('First Name');
        if (!state.personalInfo.lastName.trim()) empty.push('Last Name');
        if (!state.personalInfo.title.trim()) empty.push('Professional Title');
        if (!state.personalInfo.email.trim()) empty.push('Email');
        if (!state.personalInfo.phone.trim()) empty.push('Phone');
        break;
      case 'experience':
        if (state.experience.length === 0) empty.push('Work Experience');
        break;
      case 'education':
        if (state.education.length === 0) empty.push('Education');
        break;
      case 'skills':
        if (state.skills.length === 0) empty.push('Skills');
        break;
    }
    
    return empty;
  };

  // Handle continue with empty fields
  const handleContinueWithEmpty = () => {
    setShowEmptyFieldsDialog(false);
    setEmptyFields([]);
    setValidationErrors([]);
    goToNextSection();
  };

  // Handle fill out empty fields
  const handleFillEmptyFields = () => {
    setShowEmptyFieldsDialog(false);
    
    // Scroll to the first empty field
    scrollTimeoutRef.current = window.setTimeout(() => {
      const firstEmptyField = getFirstEmptyFieldElement();
      if (firstEmptyField) {
        firstEmptyField.focus();
        smoothScrollTo(firstEmptyField, { 
          block: 'center',
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Get the DOM element of the first empty field
  const getFirstEmptyFieldElement = (): HTMLElement | null => {
    const emptyFieldsList = getEmptyFields();
    if (emptyFieldsList.length === 0) return null;
    
    const fieldMap: { [key: string]: string } = {
      'First Name': 'firstName',
      'Last Name': 'lastName', 
      'Professional Title': 'title',
      'Email': 'email',
      'Phone': 'phone'
    };
    
    const firstEmptyField = emptyFieldsList[0];
    const fieldId = fieldMap[firstEmptyField];
    
    if (fieldId) {
      return document.getElementById(fieldId);
    }
    
    return null;
  };

  const renderNextButton = () => {
    // Only show Next button if user has selected "Build from Scratch" mode
    if (mode !== 'builder') {
      return null;
    }

    const currentIndex = sections.findIndex(section => section.id === activeSection);
    const isLastSection = currentIndex === sections.length - 1;
    
    // Check if current section is valid
    const validation = validateCurrentSection();
    const isDisabled = !validation.isValid;
    
    // Button text changes based on section
    const buttonText = isLastSection ? 'Complete' : 'Next';
    const buttonIcon = isLastSection ? <Check className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />;
    
    return (
      <div className="flex justify-center sm:justify-end pt-8 border-t border-border/50">
        <Button 
          onClick={handleNextSection} 
          disabled={isDisabled}
          className={`flex items-center fib-gap-4 w-full sm:w-auto min-h-[48px] text-base font-semibold transition-all duration-300 ${
            isDisabled 
              ? 'opacity-50 cursor-not-allowed bg-gray-300 ' 
              : isLastSection
                ? 'bg-green-600 hover:bg-green-700 hover:shadow-glow hover:scale-105 text-white border-0'
                : 'gradient-primary hover:shadow-glow hover:scale-105 text-white border-0'
          }`}
          size="lg"
        >
          {buttonText}
          {buttonIcon}
        </Button>
      </div>
    );
  };



  // Field error display component
  const FieldError = ({ error }: { error: string }) => {
    if (!error) return null;
    
    return (
      <div className="flex items-start fib-gap-3 fib-m-3 fib-p-4 bg-red-50  rounded-lg border border-red-200 ">
        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
        <span className="text-sm text-red-700  font-medium">{error}</span>
      </div>
    );
  };

  const renderPersonalInfoSection = () => {
    return (
      <div className="space-y-6">
        {/* Mode Selector */}
        <Card className="gradient-card border-0 shadow-glow">
          
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl font-bold text-gradient">
              How would you like to create your CV?
            </CardTitle>
            <p className="text-base text-muted-foreground mt-3">
              Choose your preferred approach to building an outstanding CV
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 fib-gap-8">
              <button
                onClick={() => handleModeSelection('builder')}
                className={`group relative fib-p-9 rounded-2xl border-2 transition-all duration-500 text-left hover:scale-105 ${
                  mode === 'builder'
                    ? 'border-purple-400 gradient-card shadow-glow'
                    : 'border-border hover:border-purple-300 hover:shadow-lg bg-card hover:gradient-card'
                }`}
              >
                {/* Selection indicator */}
                {mode === 'builder' && (
                  <div className="absolute top-4 right-4 w-4 h-4 gradient-primary rounded-full shadow-glow"></div>
                )}
                
                <div>
                  <div className="flex items-center gap-5 mb-5">
                    <div className={`p-4 rounded-2xl transition-all duration-300 ${
                      mode === 'builder' 
                        ? 'gradient-primary text-white shadow-glow' 
                        : 'bg-secondary text-secondary-foreground group-hover:gradient-primary group-hover:text-white group-hover:shadow-glow'
                    }`}>
                      <FileText className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gradient group-hover:text-gradient transition-colors">
                        Build from Scratch
                      </h3>
                      <div className={`h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded transition-all duration-500 ${
                        mode === 'builder' ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></div>
                    </div>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Create a new CV step by step with our intuitive builder and AI assistance
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleModeSelection('analyzer')}
                className={`group relative fib-p-9 rounded-2xl border-2 transition-all duration-500 text-left hover:scale-105 ${
                  mode === 'analyzer'
                    ? 'border-emerald-400 gradient-card shadow-glow'
                    : 'border-border hover:border-emerald-300 hover:shadow-lg bg-card hover:gradient-card'
                }`}
              >
                {/* Selection indicator */}
                {mode === 'analyzer' && (
                  <div className="absolute top-4 right-4 w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-glow"></div>
                )}
                
                <div>
                  <div className="flex items-center fib-gap-6 fib-m-6">
                    <div className={`fib-p-6 rounded-2xl transition-all duration-300 ${
                      mode === 'analyzer' 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-glow' 
                        : 'bg-secondary text-secondary-foreground group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:text-white group-hover:shadow-glow'
                    }`}>
                      <Sparkles className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gradient group-hover:text-gradient transition-colors">
                        Improve Existing CV
                      </h3>
                      <div className={`h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded transition-all duration-500 ${
                        mode === 'analyzer' ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></div>
                    </div>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Upload your current CV and get AI-powered analysis and improvement suggestions
                  </p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Conditional Content */}
        {modeSelected && mode && (
          <div className="conditional-content-area">
            {mode === 'analyzer' ? (
              <>                
                {showAnalysisResults && analysisData ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-100 rounded-lg">
                      <p className="text-green-800">✅ Analysis completed! File: {analysisData.fileName}</p>
                    </div>
                    <CVAnalysisResults 
                      analysisData={analysisData}
                      onImproveCV={handleImproveCV}
                      onUploadNew={handleUploadNew}
                    />
                  </div>
                ) : showAnalysisResults && !analysisData ? (
                  <div className="p-8 bg-red-100 rounded-lg text-center">
                    <p className="text-red-800">Analysis completed but no data received</p>
                    <button 
                      onClick={handleUploadNew}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <CVUploader onFileAnalyzed={handleAnalysisComplete} />
                )}
              </>
            ) : (
              <div className="builder-form-area focus-scroll space-y-4">
        {/* Name Fields - Single Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-3">
            <Label htmlFor="firstName" className="w-24 text-sm font-medium">First Name</Label>
            <div className="flex-1">
              <Input
                id="firstName"
                value={state.personalInfo.firstName}
                onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                placeholder="John"
                className={getFieldError('firstName', state.personalInfo.firstName) ? 'border-red-500 focus:border-red-500' : ''}
              />
              <FieldError error={getFieldError('firstName', state.personalInfo.firstName)} />
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3">
            <Label htmlFor="lastName" className="w-24 text-sm font-medium">Last Name</Label>
            <div className="flex-1">
              <Input
                id="lastName"
                value={state.personalInfo.lastName}
                onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                placeholder="Doe"
                className={getFieldError('lastName', state.personalInfo.lastName) ? 'border-red-500 focus:border-red-500' : ''}
              />
              <FieldError error={getFieldError('lastName', state.personalInfo.lastName)} />
            </div>
          </div>
        </div>

        {/* Professional Title - Single Row */}
        <div className="flex items-center gap-3">
          <Label htmlFor="title" className="w-24 text-sm font-medium">Title</Label>
          <div className="flex-1">
            <Input
              id="title"
              value={state.personalInfo.title}
              onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
              placeholder="Senior Software Engineer"
              className={getFieldError('title', state.personalInfo.title) ? 'border-red-500 focus:border-red-500' : ''}
            />
            <FieldError error={getFieldError('title', state.personalInfo.title)} />
          </div>
        </div>

        {/* Email - Single Line */}
        <div className="flex items-center gap-3">
          <Label htmlFor="email" className="w-24 text-sm font-medium">Email</Label>
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="email"
              type="email"
              value={state.personalInfo.email}
              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              placeholder="john.doe@example.com"
              className={`pl-10 ${getFieldError('email', state.personalInfo.email) ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            <FieldError error={getFieldError('email', state.personalInfo.email)} />
          </div>
        </div>

        {/* Phone - Single Line */}
        <div className="flex items-center gap-3">
          <Label htmlFor="phone" className="w-24 text-sm font-medium">Phone</Label>
          <div className="flex-1">
            <PhoneInput
              value={state.personalInfo.phone}
              onChange={(value) => handlePersonalInfoChange('phone', value)}
              placeholder="123-456-7890"
              error={!!getFieldError('phone', state.personalInfo.phone)}
            />
            <FieldError error={getFieldError('phone', state.personalInfo.phone)} />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3">
          <Label htmlFor="location" className="w-24 text-sm font-medium">Location</Label>
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="location"
              value={state.personalInfo.location}
              onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
              placeholder="New York, NY"
              className="pl-10"
            />
          </div>
        </div>

        {/* Website */}
        <div className="flex items-center gap-3">
          <Label htmlFor="website" className="w-24 text-sm font-medium">Website</Label>
          <div className="flex-1 relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="website"
              type="url"
              value={state.personalInfo.website}
              onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
              placeholder="https://johndoe.dev"
              className={`pl-10 ${getFieldError('website', state.personalInfo.website) ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            <FieldError error={getFieldError('website', state.personalInfo.website)} />
          </div>
        </div>

        {/* AI-Powered Professional Summary Generator */}
        <AIProfessionalSummary />

      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={startChatbot}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Chat Assistant
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateAIContentForSection('summary')}
              disabled={isGeneratingAI}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGeneratingAI ? 'Generating...' : 'AI Generate'}
            </Button>
          </div>
        </div>
        {/* Chatbot Interface */}
        {isChatbotOpen && (
          <Card className="mt-4 border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  Summary Assistant
                </CardTitle>
                <div className="flex items-center gap-2">
                  {currentQuestionIndex >= summaryQuestions.length && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={restartChat}
                      className="text-xs"
                    >
                      Start Over
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsChatbotOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Gemini AI Status */}
              <div className="mt-4">
                <GeminiStatusIndicator />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Indicator */}
              {currentQuestionIndex < summaryQuestions.length && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Question {currentQuestionIndex + 1} of {summaryQuestions.length}</span>
                    <span>{Math.round(((currentQuestionIndex + 1) / summaryQuestions.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${((currentQuestionIndex + 1) / summaryQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div 
                ref={chatMessagesRef}
                className="max-h-64 overflow-y-auto space-y-3 bg-background/50 rounded-lg p-3 border scroll-smooth"
              >
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                        message.isBot
                          ? 'bg-primary text-primary-foreground rounded-bl-sm'
                          : 'bg-muted text-foreground rounded-br-sm'
                      }`}
                    >
                      {message.isBot && (
                        <div className="flex items-center gap-2 mb-1">
                          <Bot className="h-3 w-3" />
                          <span className="text-xs font-medium opacity-80">Assistant</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {isGeneratingSummary && (
                  <div className="flex justify-start">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-bl-sm shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="h-3 w-3" />
                        <span className="text-xs font-medium opacity-80">Assistant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Generating your summary...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input for current question */}
              {currentQuestionIndex < summaryQuestions.length && !isGeneratingSummary && (
                <ChatInput
                  question={summaryQuestions[currentQuestionIndex]}
                  onSubmit={handleChatResponse}
                />
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Professional Summary Textarea */}
        <Textarea
          id="summary"
          value={state.personalInfo.summary}
          onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
          placeholder="Write a compelling professional summary that highlights your key achievements and skills..."
          rows={4}
          className={isChatbotOpen ? 'mt-4' : ''}
        />
        
        {/* Progress indicator for personal info completion */}
        {activeSection === 'personal' && showBuilderForm && !isPersonalInfoComplete() && validationErrors.length === 0 && (
          <Card className="mt-6 border-red-200  bg-red-50 ">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-100  rounded-full flex items-center justify-center mt-0.5">
                  <AlertCircle className="w-4 h-4 text-red-600 " />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-800  mb-1">
                    Complete Required Fields
                  </h4>
                  <p className="text-sm text-red-700  mb-3">
                    Please fill out all required fields to continue to the next section:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center gap-2 ${state.personalInfo.firstName.trim() ? 'text-green-600 ' : 'text-red-700 '}`}>
                      {state.personalInfo.firstName.trim() ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      First Name
                    </div>
                    <div className={`flex items-center gap-2 ${state.personalInfo.lastName.trim() ? 'text-green-600 ' : 'text-red-700 '}`}>
                      {state.personalInfo.lastName.trim() ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Last Name
                    </div>
                    <div className={`flex items-center gap-2 ${state.personalInfo.title.trim() ? 'text-green-600 ' : 'text-red-700 '}`}>
                      {state.personalInfo.title.trim() ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Professional Title
                    </div>
                    <div className={`flex items-center gap-2 ${state.personalInfo.email.trim() ? 'text-green-600 ' : 'text-red-700 '}`}>
                      {state.personalInfo.email.trim() ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Email
                    </div>
                    <div className={`flex items-center gap-2 ${state.personalInfo.phone.trim() ? 'text-green-600 ' : 'text-red-700 '}`}>
                      {state.personalInfo.phone.trim() ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Phone
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        

                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderExperienceSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button onClick={addExperience} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {state.experience.length > 0 ? (
        <SortableList
          items={state.experience}
          onReorder={(reorderedItems) => {
            dispatch({ type: 'REORDER_EXPERIENCE', payload: reorderedItems });
          }}
          renderItem={(exp, index) => (
            <Card className="relative focus-scroll" data-experience-id={exp.id}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">Experience #{index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(exp.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Google"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      placeholder="Senior Software Engineer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <EnhancedDatePicker
                    label="Start Date"
                    value={exp.startDate}
                    onChange={(value) => updateExperience(exp.id, 'startDate', value)}
                    placeholder="Select start date"
                  />
                  <EnhancedDatePicker
                    label="End Date"
                    value={exp.endDate}
                    onChange={(value) => updateExperience(exp.id, 'endDate', value)}
                    placeholder="Select end date"
                    disabled={exp.current}
                  />
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    />
                    <Label htmlFor={`current-${exp.id}`}>Current Role</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Description</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateAIContentForSection('experience', { id: exp.id })}
                      disabled={isGeneratingAI}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {isGeneratingAI ? 'Generating...' : 'AI Generate'}
                    </Button>
                  </div>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    placeholder="• Describe your key responsibilities and achievements&#10;• Use bullet points for better readability&#10;• Include quantifiable results when possible"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-4" />
          <p>No work experience added yet. Click "Add Experience" above to get started.</p>
        </div>
      )}
      {renderNextButton()}
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button onClick={addEducation} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {state.education.length > 0 ? (
        <SortableList
          items={state.education}
          onReorder={(reorderedItems) => {
            dispatch({ type: 'REORDER_EDUCATION', payload: reorderedItems });
          }}
          renderItem={(edu, index) => (
            <Card className="relative focus-scroll" data-education-id={edu.id}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">Education #{index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(edu.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      placeholder="University of California"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="Bachelor of Science"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                    placeholder="Computer Science"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <EnhancedDatePicker
                    label="Start Date"
                    value={edu.startDate}
                    onChange={(value) => updateEducation(edu.id, 'startDate', value)}
                    placeholder="Select start date"
                  />
                  <EnhancedDatePicker
                    label="End Date"
                    value={edu.endDate}
                    onChange={(value) => updateEducation(edu.id, 'endDate', value)}
                    placeholder="Select end date"
                    disabled={edu.current}
                  />
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id={`current-edu-${edu.id}`}
                      checked={edu.current}
                      onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                    />
                    <Label htmlFor={`current-edu-${edu.id}`}>Currently Studying</Label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GPA (Optional)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="4.0"
                      step="0.1"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                      placeholder="3.8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Description (Optional)</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateAIContentForSection('education', { id: edu.id })}
                      disabled={isGeneratingAI}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {isGeneratingAI ? 'Generating...' : 'AI Generate'}
                    </Button>
                  </div>
                  <Textarea
                    value={edu.description}
                    onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                    placeholder="• Relevant coursework, honors, achievements&#10;• Thesis topic or special projects&#10;• Academic awards or scholarships"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <GraduationCap className="h-12 w-12 mx-auto mb-4" />
          <p>No education added yet. Click "Add Education" above to get started.</p>
        </div>
      )}
      {renderNextButton()}
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Skills</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 ">
          <Sparkles className="h-4 w-4" />
          AI-Powered Suggestions
        </div>
      </div>

      <SmartSkillsInput
        skills={state.skills}
        onAddSkill={addSkill}
        onRemoveSkill={removeSkill}
        onUpdateSkill={updateSkill}
        onReorderSkills={(reorderedSkills) => {
          dispatch({ type: 'REORDER_SKILLS', payload: reorderedSkills });
        }}
        professionalTitle={state.personalInfo.title}
      />

      {state.skills.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Code className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600  mb-2">No skills added yet</p>
            <p className="text-sm text-gray-500 ">
              Start typing a skill above to get intelligent suggestions and validate your entries
            </p>
          </CardContent>
        </Card>
      )}
      {renderNextButton()}
    </div>
  );

  const renderLanguagesSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Languages</h3>
        <Button onClick={addLanguage} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      </div>

      {state.languages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SortableList
            items={state.languages}
            onReorder={(reorderedItems) => {
              dispatch({ type: 'REORDER_LANGUAGES', payload: reorderedItems });
            }}
            renderItem={(language, index) => (
              <Card className="relative">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium">Language #{index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLanguage(language.id)}
                      className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Input
                      value={language.name}
                      onChange={(e) => updateLanguage(language.id, 'name', e.target.value)}
                      placeholder="Spanish"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Proficiency Level</Label>
                    <select
                      value={language.proficiency}
                      onChange={(e) => updateLanguage(language.id, 'proficiency', e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Elementary">Elementary</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Upper Intermediate">Upper Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Native">Native</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}
          />
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Languages className="h-12 w-12 mx-auto mb-4" />
          <p>No languages added yet. Click "Add Language" above to get started.</p>
        </div>
      )}
      {renderNextButton()}
    </div>
  );

  const renderAwardsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Awards & Achievements</h3>
        <Button onClick={addAward} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Award
        </Button>
      </div>

      {state.awards.length > 0 ? (
        <SortableList
          items={state.awards}
          onReorder={(reorderedItems) => {
            dispatch({ type: 'REORDER_AWARDS', payload: reorderedItems });
          }}
          renderItem={(award, index) => (
            <Card className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">Award #{index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAward(award.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Award Title</Label>
                    <Input
                      value={award.title}
                      onChange={(e) => updateAward(award.id, 'title', e.target.value)}
                      placeholder="Employee of the Year"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Organization</Label>
                    <Input
                      value={award.issuer}
                      onChange={(e) => updateAward(award.id, 'issuer', e.target.value)}
                      placeholder="Google Inc."
                    />
                  </div>
                </div>

                <EnhancedDatePicker
                  label="Date Received"
                  value={award.date}
                  onChange={(value) => updateAward(award.id, 'date', value)}
                  placeholder="Select date received"
                />

                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    value={award.description}
                    onChange={(e) => updateAward(award.id, 'description', e.target.value)}
                    placeholder="Describe the achievement, criteria, or significance of this award..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Award className="h-12 w-12 mx-auto mb-4" />
          <p>No awards added yet.</p>
          <Button onClick={addAward} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Award
          </Button>
        </div>
      )}
      {renderNextButton()}
    </div>
  );

  const renderInsightsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI-Powered CV Insights</h3>
        <Button 
          onClick={handleValidateCV} 
          disabled={isValidating}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isValidating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {isValidating ? 'Analyzing...' : 'Analyze My CV'}
        </Button>
      </div>

      {validationResult ? (
        <div className="space-y-4">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Overall CV Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-primary">
                  {validationResult.score}/100
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200  rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        validationResult.score >= 90 ? 'bg-green-500' :
                        validationResult.score >= 80 ? 'bg-blue-500' :
                        validationResult.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${validationResult.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {validationResult.score >= 90 ? 'Excellent' :
                     validationResult.score >= 80 ? 'Good' :
                     validationResult.score >= 70 ? 'Fair' : 'Needs Improvement'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          {validationResult.warnings.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2 text-red-700">
                      <span className="mt-1">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {validationResult.suggestions.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-700 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {validationResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-yellow-700">
                      <span className="mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Improvements */}
          {validationResult.improvements.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {validationResult.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2 text-blue-700">
                      <span className="mt-1">•</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Get AI-Powered Insights</h3>
            <p className="text-muted-foreground mb-4">
              Let our AI analyze your CV and provide personalized recommendations to improve your chances of landing your dream job.
            </p>
            <Button 
              onClick={handleValidateCV} 
              disabled={isValidating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isValidating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {isValidating ? 'Analyzing...' : 'Analyze My CV'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalInfoSection();
      case 'experience':
        return renderExperienceSection();
      case 'education':
        return renderEducationSection();
      case 'skills':
        return renderSkillsSection();
      case 'languages':
        return renderLanguagesSection();
      case 'awards':
        return renderAwardsSection();
      case 'insights':
        return renderInsightsSection();
      default:
        return (
          <div className="space-y-4 text-center py-12">
            <h3 className="text-lg font-semibold">Section Not Available</h3>
            <p className="text-muted-foreground">Please select a different section from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header with Export Buttons */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-3">CV Builder</h1>
              <p className="text-lg text-muted-foreground">Create your professional CV with modern design</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* LaTeX PDF Export */}
              <LaTeXExportButton className="w-full sm:w-auto" />
              
              <Button 
                onClick={handleExportToWord} 
                variant="outline"
                disabled={isExporting}
                className="w-full sm:w-auto gradient-card hover:gradient-primary hover:text-white border-purple-200 hover:border-transparent transition-all duration-300 group"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin group-hover:text-white" />
                ) : (
                  <FileText className="h-4 w-4 mr-2 group-hover:text-white" />
                )}
                Export Word
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-6">
          <Button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 gradient-card hover:gradient-primary hover:text-white border-purple-200 hover:border-transparent transition-all duration-300"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            {isMobileMenuOpen ? 'Close Menu' : 'Show Sections'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Side - Sidebar Navigation */}
          <div className={`lg:col-span-3 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'} animate-slide-in-left`}>
            <Card className="lg:sticky lg:top-24 gradient-card hover:shadow-glow transition-all duration-500 border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-gradient text-lg font-bold">Sections</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sections.map((section, index) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => navigateToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-300 hover:scale-105 hover:translate-x-1 rounded-lg ${
                          isActive
                            ? 'gradient-primary text-white shadow-glow border border-purple-300'
                            : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50   text-muted-foreground hover:text-foreground'
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'animate-bounce' : ''}`} />
                        <span className="font-medium">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Middle & Right - Form Content and Preview */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Form Content */}
              <div className="xl:col-span-7 animate-slide-in-up">
                <Card className="main-content-area gradient-card hover:shadow-glow transition-all duration-500 border-0 focus-scroll" data-section={activeSection}>
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 animate-fade-in-up text-xl font-bold">
                      {(() => {
                        const section = sections.find(s => s.id === activeSection);
                        const Icon = section?.icon || User;
                        return (
                          <>
                            <Icon className="h-5 w-5 animate-float" />
                            {section?.title}
                          </>
                        );
                      })()}
                    </CardTitle>
                    <Separator />
                  </CardHeader>
                  <CardContent className="animate-scale-in">
                    {renderActiveSection()}
                  </CardContent>
                </Card>
              </div>

              {/* Live Preview */}
              <div className="xl:col-span-5 animate-slide-in-right">
                <Card className="xl:sticky xl:top-24 gradient-card hover:shadow-glow transition-all duration-500 border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between text-gradient text-lg font-bold">
                      <div className="flex items-center gap-3">
                        <Eye className="h-6 w-6" />
                        Live Preview
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {previewManualScroll ? (
                          <span className="text-blue-500 flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Manual
                          </span>
                        ) : (
                          <span className="text-purple-500 flex items-center gap-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            {activeSection && `Auto-sync: ${activeSection}`}
                          </span>
                        )}
                      </div>
                    </CardTitle>
                    <Separator />
                  </CardHeader>
                  <CardContent className="p-2 sm:p-4">
                    <div 
                      ref={previewRef}
                      className="h-[400px] sm:h-[600px] xl:h-[800px] overflow-auto border border-gray-200  rounded-lg bg-white cv-preview-container"
                      onMouseEnter={(e) => {
                        setIsPreviewHovered(true);
                        e.stopPropagation();
                      }}
                      onMouseLeave={(e) => {
                        setIsPreviewHovered(false);
                        e.stopPropagation();
                        // Reset manual scroll flag after a delay when mouse leaves
                        setTimeout(() => setPreviewManualScroll(false), 3000);
                      }}
                      onWheel={(e) => {
                        // Completely isolate preview scrolling
                        e.stopPropagation();
                        e.preventDefault();
                        
                        // Only allow scrolling if directly hovering the preview
                        if (isPreviewHovered) {
                          const delta = e.deltaY;
                          const container = e.currentTarget;
                          container.scrollTop += delta;
                          setPreviewManualScroll(true);
                        }
                      }}
                      onScroll={(e) => {
                        // Prevent all scroll events from bubbling
                        e.stopPropagation();
                        e.preventDefault();
                        
                        // Only mark as manual if user is directly interacting
                        if (isPreviewHovered) {
                          setPreviewManualScroll(true);
                        }
                      }}
                      onTouchMove={(e) => {
                        // Prevent touch scroll from affecting parent on mobile
                        e.stopPropagation();
                        if (isPreviewHovered) {
                          setPreviewManualScroll(true);
                        }
                      }}
                      style={{
                        scrollBehavior: 'auto', // Override smooth scrolling for preview
                        scrollbarWidth: 'thin', // Better scrollbar appearance
                        scrollbarColor: 'rgba(0, 0, 0, 0.3) transparent',
                        isolation: 'isolate', // Create new stacking context
                        containIntrinsicSize: '1px 1000px', // Contain layout
                        contain: 'layout style paint' // Full CSS containment
                      }}
                    >
                      <div className="p-3 sm:p-4 xl:p-6 max-w-full mx-auto text-gray-900 text-xs sm:text-sm" style={{ fontSize: 'clamp(10px, 2vw, 12px)' }}>
                        {/* Header - Personal Info */}
                        <div className="preview-personal text-center mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 border-gray-800">
                          <h1 className="text-lg sm:text-xl font-bold mb-1">
                            {state.personalInfo.firstName || 'Your Name'} {state.personalInfo.lastName}
                          </h1>
                      {state.personalInfo.title && (
                        <p className="text-sm text-gray-600 mb-2">{state.personalInfo.title}</p>
                      )}
                      <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600">
                        {state.personalInfo.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {state.personalInfo.email}
                          </span>
                        )}
                        {state.personalInfo.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {state.personalInfo.countryCode} {state.personalInfo.phone}
                          </span>
                        )}
                        {state.personalInfo.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {state.personalInfo.location}
                          </span>
                        )}
                        {state.personalInfo.website && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {state.personalInfo.website}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Summary - Part of Personal Section */}
                    {state.personalInfo.summary && (
                      <div className="mb-8 pt-4">
                        <h2 className="text-sm font-bold mb-2 border-b border-gray-400 pb-1">
                          Professional Summary
                        </h2>
                        <p className="text-xs leading-relaxed">{state.personalInfo.summary}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {state.experience.length > 0 && (
                      <div className="preview-experience mb-8 pt-6 border-t border-gray-300">
                        <h2 className="text-sm font-bold mb-2 border-b border-gray-400 pb-1">
                          Work Experience
                        </h2>
                        <div className="space-y-3">
                          {state.experience.map((exp) => (
                            <div key={exp.id}>
                              <div className="flex justify-between items-start mb-1">
                                <div>
                                  <h3 className="text-xs font-semibold">{exp.position || 'Position'}</h3>
                                  <p className="text-xs">{exp.company || 'Company'}</p>
                                </div>
                                <div className="text-right text-xs text-gray-600">
                                  <p>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                                  {exp.location && <p>{exp.location}</p>}
                                </div>
                              </div>
                              {exp.description && (
                                <div className="text-xs whitespace-pre-line ml-3 text-gray-700">
                                  {exp.description}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {state.education.length > 0 && (
                      <div className="preview-education mb-8 pt-6 border-t border-gray-300">
                        <h2 className="text-sm font-bold mb-2 border-b border-gray-400 pb-1">
                          Education
                        </h2>
                        <div className="space-y-3">
                          {state.education.map((edu) => (
                            <div key={edu.id}>
                              <div className="flex justify-between items-start mb-1">
                                <div>
                                  <h3 className="text-xs font-semibold">{edu.degree} in {edu.field}</h3>
                                  <p className="text-xs">{edu.institution}</p>
                                  {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
                                </div>
                                <div className="text-right text-xs text-gray-600">
                                  <p>{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
                                </div>
                              </div>
                              {edu.description && (
                                <div className="text-xs whitespace-pre-line ml-3 text-gray-700">
                                  {edu.description}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {state.skills.length > 0 && (
                      <div className="preview-skills mb-8 pt-6 border-t border-gray-300">
                        <h2 className="text-sm font-bold mb-2 border-b border-gray-400 pb-1">
                          Skills
                        </h2>
                        <div className="space-y-2">
                          {['Technical', 'Soft Skills', 'Languages', 'Tools', 'Frameworks'].map(category => {
                            const categorySkills = state.skills.filter(skill => skill.category === category);
                            if (categorySkills.length === 0) return null;
                            
                            return (
                              <div key={category}>
                                <h3 className="text-xs font-medium mb-1">{category}:</h3>
                                <div className="flex flex-wrap gap-1 ml-3">
                                  {categorySkills.map((skill, index) => (
                                    <span key={skill.id} className="text-xs">
                                      {skill.name} ({skill.level}){index < categorySkills.length - 1 ? ',' : ''}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {state.languages.length > 0 && (
                      <div className="preview-languages mb-8 pt-6 border-t border-gray-300">
                        <h2 className="text-sm font-bold mb-2 border-b border-gray-400 pb-1">
                          Languages
                        </h2>
                        <div className="ml-3">
                          {state.languages.map((language, index) => (
                            <span key={language.id} className="text-xs">
                              {language.name} - {language.proficiency}{index < state.languages.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Awards */}
                    {state.awards.length > 0 && (
                      <div className="preview-certifications mb-8 pt-6 border-t border-gray-300">
                        <h2 className="text-sm font-bold mb-2 border-b border-gray-400 pb-1">
                          Awards & Achievements
                        </h2>
                        <div className="space-y-3">
                          {state.awards.map((award) => (
                            <div key={award.id}>
                              <div className="flex justify-between items-start mb-1">
                                <div>
                                  <h3 className="text-xs font-semibold">{award.title}</h3>
                                  <p className="text-xs">{award.issuer}</p>
                                </div>
                                <div className="text-right text-xs text-gray-600">
                                  <p>{award.date}</p>
                                </div>
                              </div>
                              {award.description && (
                                <div className="text-xs ml-3 text-gray-700">
                                  {award.description}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty state */}
                    {!state.personalInfo.firstName && state.experience.length === 0 && state.education.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">Start filling out your information to see the preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Empty Fields Confirmation Modal */}
      {showEmptyFieldsDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md mx-auto">
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Empty Fields Detected
                </h2>
                <p className="text-sm text-muted-foreground">
                  You have left the following field(s) empty:
                </p>
              </div>
              
              <div className="py-4">
                <div className="bg-amber-50  rounded-lg p-4 border border-amber-200 ">
                  <ul className="space-y-2">
                    {emptyFields.map((field, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="font-medium text-red-700 ">{field}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <p className="text-sm text-muted-foreground mt-4">
                  Do you want to continue to the next section as it is, or fill out the empty fields first?
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleFillEmptyFields}
                  className="flex items-center gap-2 flex-1"
                >
                  <AlertCircle className="h-4 w-4" />
                  Fill Out Empty Fields
                </Button>
                <Button
                  onClick={handleContinueWithEmpty}
                  className="bg-amber-600 hover:bg-amber-700 text-white flex-1"
                >
                  Continue As Is
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
