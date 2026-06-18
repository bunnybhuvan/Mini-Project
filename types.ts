
export type ViewMode = 'input' | 'builder' | 'tracker';

// ---- Analysis & Interview Prep ----

export interface AnalysisSuggestion {
  area: string;
  suggestion: string;
}

export interface SuggestedTemplate {
    templateName: string;
    reasoning: string;
}

export interface AnalysisResult {
  jobReadinessScore: number;
  atsScore: number;
  summary: string;
  suggestions: AnalysisSuggestion[];
  jobRoles: string[];
  missingKeywords: string[];
  suggestedTemplates: SuggestedTemplate[];
}

export interface JdAnalysisResult {
  job_title: string;
  seniority: string;
  role_type: string;
  location_type: string;
  hard_skills: string[];
  soft_skills: string[];
  tools_technologies: string[];
  domains_or_industries: string[];
  certifications: string[];
  must_have_keywords: string[];
  nice_to_have_keywords: string[];
  all_keywords_flat: string[];
}

export interface InterviewQuestion {
    question: string;
    shortAnswer: string;
    detailedAnswer: string;
    type: 'technical' | 'hr' | 'project-based';
}

export type InterviewPrepResult = InterviewQuestion[];


// ---- Resume Builder ----

export type ResumeTemplate = 'modern' | 'ats-friendly';

// FIX: Add BaseEntry to ensure all entry types have an 'id' property, resolving generic type errors in ResumeBuilder.
interface BaseEntry {
    id: string;
}

export interface HeadingData {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    portfolio: string;
}

export interface ExperienceEntry extends BaseEntry {
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface EducationEntry extends BaseEntry {
    institution: string;
    degree: string;
    location: string;
    startDate: string;
    endDate: string;
}

export interface ProjectEntry extends BaseEntry {
    name: string;
    description: string;
    link: string;
}

export interface CertificationEntry extends BaseEntry {
    name: string;
}

export interface ResumeData {
    heading: HeadingData;
    summary: string;
    skills: string[];
    experience: ExperienceEntry[];
    education: EducationEntry[];
    projects: ProjectEntry[];
    languages: string[];
    certifications: CertificationEntry[];
    template: ResumeTemplate;
}

// ---- Job Tracker ----
export type JobApplicationStatus = 'Saved' | 'Applied' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected';

export interface JobApplication {
    id: string;
    company: string;
    role: string;
    status: JobApplicationStatus;
    dateApplied: string;
    link: string;
    notes: string;
}

// ---- Rexa AI Assistant ----
export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

// ---- App Settings ----
export type ColorTheme = 'blue' | 'purple' | 'green';
export type FontTheme = 'inter' | 'poppins' | 'roboto' | 'montserrat';
export type JobAlertsFrequency = 'daily' | 'weekly' | 'off';
export type RexaPersonality = 'professional' | 'friendly' | 'faang-interviewer';
export type RexaKnowledgeSource = 'resume-only' | 'resume-jobs' | 'web-search';

export interface AppSettings {
  profile: {
    name: string;
    email: string;
    role: string;
    bio: string;
    avatarUrl: string;
  };
  security: {
    twoFactorEnabled: boolean;
  };
  appearance: {
    colorTheme: ColorTheme;
    fontTheme: FontTheme;
  };
  notifications: {
    jobAlerts: JobAlertsFrequency;
    interviewReminders: boolean;
    feedbackAlerts: boolean;
    pushNotifications: boolean;
  };
  rexa: {
    personality: RexaPersonality;
    knowledgeSource: RexaKnowledgeSource;
  };
  privacy: {
    allowResumeStorage: boolean;
    allowLogStorage: boolean;
  };
  integrations: {
    linkedIn: boolean;
    github: boolean;
    kaggle: boolean;
    googleDrive: boolean;
  };
  advanced: {
    language: string;
    enableBetaFeatures: boolean;
    participateABTesting: boolean;
  };
}
