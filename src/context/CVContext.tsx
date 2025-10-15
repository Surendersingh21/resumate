import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  countryCode: string;
  location: string;
  website: string;
  summary: string;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  location: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft Skills' | 'Languages' | 'Tools' | 'Frameworks';
}

interface Language {
  id: string;
  name: string;
  proficiency: 'Beginner' | 'Elementary' | 'Intermediate' | 'Upper Intermediate' | 'Advanced' | 'Fluent' | 'Native';
}

interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

interface CVState {
  personalInfo: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  awards: Award[];
}

type CVAction =
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<PersonalInfo> }
  | { type: 'ADD_EXPERIENCE'; payload: WorkExperience }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; field: string; value: any } }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'REORDER_EXPERIENCE'; payload: WorkExperience[] }
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; field: string; value: any } }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  | { type: 'REORDER_EDUCATION'; payload: Education[] }
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'UPDATE_SKILL'; payload: { id: string; field: string; value: any } }
  | { type: 'REMOVE_SKILL'; payload: string }
  | { type: 'REORDER_SKILLS'; payload: Skill[] }
  | { type: 'ADD_LANGUAGE'; payload: Language }
  | { type: 'UPDATE_LANGUAGE'; payload: { id: string; field: string; value: any } }
  | { type: 'REMOVE_LANGUAGE'; payload: string }
  | { type: 'REORDER_LANGUAGES'; payload: Language[] }
  | { type: 'ADD_AWARD'; payload: Award }
  | { type: 'UPDATE_AWARD'; payload: { id: string; field: string; value: any } }
  | { type: 'REMOVE_AWARD'; payload: string }
  | { type: 'REORDER_AWARDS'; payload: Award[] };

const initialState: CVState = {
  personalInfo: {
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    countryCode: '+1',
    location: '',
    website: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  awards: [],
};

function cvReducer(state: CVState, action: CVAction): CVState {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload },
      };
    
    case 'ADD_EXPERIENCE':
      return {
        ...state,
        experience: [...state.experience, action.payload],
      };
    
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        experience: state.experience.map(exp =>
          exp.id === action.payload.id
            ? { ...exp, [action.payload.field]: action.payload.value }
            : exp
        ),
      };
    
    case 'REMOVE_EXPERIENCE':
      return {
        ...state,
        experience: state.experience.filter(exp => exp.id !== action.payload),
      };
    
    case 'REORDER_EXPERIENCE':
      return {
        ...state,
        experience: action.payload,
      };
    
    case 'ADD_EDUCATION':
      return {
        ...state,
        education: [...state.education, action.payload],
      };
    
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: state.education.map(edu =>
          edu.id === action.payload.id
            ? { ...edu, [action.payload.field]: action.payload.value }
            : edu
        ),
      };
    
    case 'REMOVE_EDUCATION':
      return {
        ...state,
        education: state.education.filter(edu => edu.id !== action.payload),
      };
    
    case 'REORDER_EDUCATION':
      return {
        ...state,
        education: action.payload,
      };
    
    case 'ADD_SKILL':
      return {
        ...state,
        skills: [...state.skills, action.payload],
      };
    
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map(skill =>
          skill.id === action.payload.id
            ? { ...skill, [action.payload.field]: action.payload.value }
            : skill
        ),
      };
    
    case 'REMOVE_SKILL':
      return {
        ...state,
        skills: state.skills.filter(skill => skill.id !== action.payload),
      };
    
    case 'REORDER_SKILLS':
      return {
        ...state,
        skills: action.payload,
      };
    
    case 'ADD_LANGUAGE':
      return {
        ...state,
        languages: [...state.languages, action.payload],
      };
    
    case 'UPDATE_LANGUAGE':
      return {
        ...state,
        languages: state.languages.map(lang =>
          lang.id === action.payload.id
            ? { ...lang, [action.payload.field]: action.payload.value }
            : lang
        ),
      };
    
    case 'REMOVE_LANGUAGE':
      return {
        ...state,
        languages: state.languages.filter(lang => lang.id !== action.payload),
      };
    
    case 'REORDER_LANGUAGES':
      return {
        ...state,
        languages: action.payload,
      };
    
    case 'ADD_AWARD':
      return {
        ...state,
        awards: [...state.awards, action.payload],
      };
    
    case 'UPDATE_AWARD':
      return {
        ...state,
        awards: state.awards.map(award =>
          award.id === action.payload.id
            ? { ...award, [action.payload.field]: action.payload.value }
            : award
        ),
      };
    
    case 'REMOVE_AWARD':
      return {
        ...state,
        awards: state.awards.filter(award => award.id !== action.payload),
      };
    
    case 'REORDER_AWARDS':
      return {
        ...state,
        awards: action.payload,
      };
    
    default:
      return state;
  }
}

interface CVContextType {
  state: CVState;
  dispatch: React.Dispatch<CVAction>;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cvReducer, initialState);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('resumate-cv-data', JSON.stringify(state));
    }, 1000);

    return () => clearTimeout(timer);
  }, [state]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumate-cv-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Merge with initial state to ensure all fields exist
        Object.keys(parsedData).forEach(key => {
          if (key === 'personalInfo') {
            dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: parsedData[key] });
          }
          // Add more loading logic as needed
        });
      } catch (error) {
        console.error('Failed to load saved CV data:', error);
      }
    }
  }, []);

  return (
    <CVContext.Provider value={{ state, dispatch }}>
      {children}
    </CVContext.Provider>
  );
}

export function useCVContext() {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCVContext must be used within a CVProvider');
  }
  return context;
}

export type { CVState };