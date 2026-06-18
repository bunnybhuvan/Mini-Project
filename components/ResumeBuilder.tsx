import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { ResumeData, ExperienceEntry, EducationEntry, CertificationEntry, ProjectEntry, ResumeTemplate } from '../types';
import { generateContentSuggestion } from '../services/geminiService';
import { exportToPdf } from '../services/exportService';
import ResumePreview from './ResumePreview';
import Button from './common/Button';
import Card from './common/Card';
import SuggestionModal from './SuggestionModal';
import SparklesIcon from './icons/SparklesIcon';
import TrashIcon from './icons/TrashIcon';
import FileTextIcon from './icons/FileTextIcon';
import ProjectIcon from './icons/ProjectIcon';
import SaveIcon from './icons/SaveIcon';
import DownloadIcon from './icons/DownloadIcon';

interface ResumeBuilderProps {
  onAnalyze: (data: ResumeData) => void;
  onBack: () => void;
  initialData?: ResumeData | null;
}

const initialResumeData: ResumeData = {
  heading: { name: '', email: '', phone: '', address: '', linkedin: '', portfolio: '' },
  summary: '',
  skills: [],
  experience: [],
  education: [],
  projects: [],
  languages: [],
  certifications: [],
  template: 'modern',
};

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ onAnalyze, onBack, initialData }) => {
    const [resumeData, setResumeData] = useState<ResumeData>(initialData || initialResumeData);
    const [skillsInput, setSkillsInput] = useState('');
    const [languagesInput, setLanguagesInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    
    // AI Suggestion State
    const [isSuggestionModalOpen, setSuggestionModalOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestionError, setSuggestionError] = useState<string | null>(null);
    const [suggestionTarget, setSuggestionTarget] = useState<{ field: keyof ResumeData; index?: number; subField?: string } | null>(null);
    
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialData) {
            setResumeData(initialData);
        }
    }, [initialData]);

    const handleSave = () => {
        setIsSaving(true);
        setIsSaved(false);
        try {
            localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
            setTimeout(() => {
                setIsSaving(false);
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
            }, 1000);
        } catch (error) {
            console.error("Failed to save resume data", error);
            setIsSaving(false);
        }
    };

    const handleExport = () => {
        if (previewRef.current) {
            const fileName = `${resumeData.heading.name.replace(' ', '_') || 'resume'}.pdf`;
            exportToPdf(previewRef.current, fileName);
        }
    };

    const handleGetSuggestions = useCallback(async (field: keyof ResumeData, context: string, index?: number, subField?: string) => {
        setSuggestionTarget({ field, index, subField });
        setSuggestionModalOpen(true);
        setIsSuggesting(true);
        setSuggestionError(null);
        setSuggestions([]);
        try {
            const result = await generateContentSuggestion(String(subField || field), context);
            setSuggestions(result);
        } catch (err: any) {
            setSuggestionError(err.message || 'Failed to get suggestions.');
        } finally {
            setIsSuggesting(false);
        }
    }, []);

    const handleApplySuggestion = (suggestion: string) => {
        if (!suggestionTarget) return;
        const { field, index, subField } = suggestionTarget;

        if (typeof index === 'number' && subField) {
            // Handle array items like experience or projects
            setResumeData(prev => {
                const newArray = [...(prev[field] as any[])];
                newArray[index] = { ...newArray[index], [subField]: suggestion };
                return { ...prev, [field]: newArray };
            });
        } else {
            // Handle top-level fields like summary
            setResumeData(prev => ({ ...prev, [field]: suggestion }));
        }
        setSuggestionModalOpen(false);
    };

    // Generic handler for simple input changes
    const handleChange = (section: keyof ResumeData, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setResumeData(prev => ({...prev, [section]: { ...(prev[section] as object), [name]: value }}));
    };

    const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setResumeData(prev => ({ ...prev, summary: e.target.value }));
    };

    // Skills handlers
    const handleSkillsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' || e.key === 'Enter') {
            e.preventDefault();
            const newSkill = skillsInput.trim();
            if (newSkill && !resumeData.skills.includes(newSkill)) {
                setResumeData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
            }
            setSkillsInput('');
        }
    };
    const removeSkill = (skillToRemove: string) => {
        setResumeData(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }));
    };
    
    // Languages handlers
    const handleLanguagesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' || e.key === 'Enter') {
            e.preventDefault();
            const newLang = languagesInput.trim();
            if (newLang && !resumeData.languages.includes(newLang)) {
                setResumeData(prev => ({ ...prev, languages: [...prev.languages, newLang] }));
            }
            setLanguagesInput('');
        }
    };
    const removeLanguage = (langToRemove: string) => {
        setResumeData(prev => ({ ...prev, languages: prev.languages.filter(lang => lang !== langToRemove) }));
    };

    // Generic handlers for dynamic array sections
    const handleDynamicChange = <T extends ExperienceEntry | EducationEntry | ProjectEntry>(
        section: 'experience' | 'education' | 'projects',
        id: string,
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setResumeData(prev => ({
            ...prev,
            [section]: (prev[section] as T[]).map(item => (item.id === id ? { ...item, [name]: value } : item)),
        }));
    };

    const addEntry = (section: 'experience' | 'education' | 'projects') => {
        const newEntry = { id: Date.now().toString() };
        if (section === 'experience') {
            setResumeData(prev => ({ ...prev, experience: [...prev.experience, { ...newEntry, role: '', company: '', location: '', startDate: '', endDate: '', description: '' }] }));
        } else if (section === 'education') {
            setResumeData(prev => ({ ...prev, education: [...prev.education, { ...newEntry, institution: '', degree: '', location: '', startDate: '', endDate: '' }] }));
        } else {
            setResumeData(prev => ({ ...prev, projects: [...prev.projects, { ...newEntry, name: '', description: '', link: '' }] }));
        }
    };

    const removeEntry = (section: 'experience' | 'education' | 'projects', id: string) => {
        setResumeData(prev => ({
            ...prev,
            [section]: (prev[section] as any[]).filter(item => item.id !== id),
        }));
    };

    const handleCertificationChange = (id: string, value: string) => {
        setResumeData(prev => ({
            ...prev,
            certifications: prev.certifications.map(cert => (cert.id === id ? { ...cert, name: value } : cert)),
        }));
    };

    const addCertification = () => {
        setResumeData(prev => ({ ...prev, certifications: [...prev.certifications, { id: Date.now().toString(), name: '' }] }));
    };

    const removeCertification = (id: string) => {
        setResumeData(prev => ({ ...prev, certifications: prev.certifications.filter(cert => cert.id !== id) }));
    };
    
    const inputClass = "w-full p-2 border border-gray-200/50 dark:border-white/10 rounded-md focus:ring-2 focus:ring-blue-500 bg-white/30 dark:bg-black/20 backdrop-blur-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    return (
        <div className="animate-fade-in">
             <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/40 dark:border-white/10 p-4 rounded-xl shadow-lg sticky top-24 z-10 mb-8">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <FileTextIcon className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100">Resume Builder</h2>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button onClick={onBack} variant="secondary" className="!bg-white/50 dark:!bg-white/10 backdrop-blur-md">Back to Upload</Button>
                        <Button onClick={handleSave} variant="secondary" isLoading={isSaving} className="!bg-white/50 dark:!bg-white/10 backdrop-blur-md">
                            <SaveIcon className="w-5 h-5 mr-2" />
                            {isSaved ? 'Saved!' : 'Save Progress'}
                        </Button>
                        <Button onClick={handleExport} variant="secondary" className="!bg-white/50 dark:!bg-white/10 backdrop-blur-md">
                            <DownloadIcon className="w-5 h-5 mr-2" />
                            Export PDF
                        </Button>
                        <Button onClick={() => onAnalyze(resumeData)}>
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Analyze Resume
                        </Button>
                    </div>
                </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="space-y-6">
                    <Card>
                        <h3 className="text-xl font-bold font-display mb-4 dark:text-gray-200">Template Style</h3>
                        <div className="flex gap-4">
                            {(['modern', 'ats-friendly'] as ResumeTemplate[]).map(template => (
                                <label key={template} className="cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="template" 
                                        value={template} 
                                        checked={resumeData.template === template}
                                        onChange={() => setResumeData(p => ({...p, template}))}
                                        className="sr-only"
                                    />
                                    <div className={`p-4 border-2 rounded-lg transition-colors ${resumeData.template === template ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'}`}>
                                        <span className="font-semibold capitalize text-gray-800 dark:text-gray-200">{template.replace('-', ' ')}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-xl font-bold font-display mb-4 dark:text-gray-200">Heading</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className={labelClass}>Full Name</label><input type="text" name="name" value={resumeData.heading.name} onChange={(e) => handleChange('heading', e)} className={inputClass} /></div>
                            <div><label className={labelClass}>Email</label><input type="email" name="email" value={resumeData.heading.email} onChange={(e) => handleChange('heading', e)} className={inputClass} /></div>
                            <div><label className={labelClass}>Phone</label><input type="tel" name="phone" value={resumeData.heading.phone} onChange={(e) => handleChange('heading', e)} className={inputClass} /></div>
                            <div><label className={labelClass}>Address</label><input type="text" name="address" value={resumeData.heading.address} onChange={(e) => handleChange('heading', e)} className={inputClass} /></div>
                            <div><label className={labelClass}>LinkedIn</label><input type="url" name="linkedin" value={resumeData.heading.linkedin} onChange={(e) => handleChange('heading', e)} className={inputClass} /></div>
                            <div><label className={labelClass}>Portfolio/Website</label><input type="url" name="portfolio" value={resumeData.heading.portfolio} onChange={(e) => handleChange('heading', e)} className={inputClass} /></div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold font-display dark:text-gray-200">Professional Summary</h3>
                             <Button onClick={() => handleGetSuggestions('summary', resumeData.heading.name, undefined, 'summary')} size="sm" variant="secondary" disabled={isSuggesting} className="!bg-white/50 dark:!bg-white/10 backdrop-blur-md">
                                <SparklesIcon className="w-4 h-4 mr-2" /> Suggest with AI
                            </Button>
                        </div>
                        <textarea value={resumeData.summary} onChange={handleSummaryChange} className={`${inputClass} h-24`} placeholder="A brief summary of your career highlights..."></textarea>
                    </Card>

                    <Card>
                        <h3 className="text-xl font-bold font-display mb-4 dark:text-gray-200">Skills</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {resumeData.skills.map(skill => (
                                <div key={skill} className="flex items-center gap-2 bg-blue-100/80 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-medium px-3 py-1 rounded-full">
                                    <span>{skill}</span>
                                    <button onClick={() => removeSkill(skill)} className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"><TrashIcon className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                        <input type="text" value={skillsInput} onChange={e => setSkillsInput(e.target.value)} onKeyDown={handleSkillsKeyDown} className={inputClass} placeholder="Add a skill and press Enter or comma" />
                    </Card>

                    <Card>
                        <h3 className="text-xl font-bold font-display mb-4 dark:text-gray-200">Work Experience</h3>
                        <div className="space-y-4">
                        {resumeData.experience.map((exp, index) => (
                            <div key={exp.id} className="p-4 border border-gray-200/50 dark:border-white/10 rounded-md relative bg-white/30 dark:bg-white/5">
                                <button onClick={() => removeEntry('experience', exp.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><TrashIcon /></button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className={labelClass}>Job Title</label><input type="text" name="role" value={exp.role} onChange={e => handleDynamicChange('experience', exp.id, e)} className={inputClass} /></div>
                                    <div><label className={labelClass}>Company</label><input type="text" name="company" value={exp.company} onChange={e => handleDynamicChange('experience', exp.id, e)} className={inputClass} /></div>
                                    <div><label className={labelClass}>Location</label><input type="text" name="location" value={exp.location} onChange={e => handleDynamicChange('experience', exp.id, e)} className={inputClass} /></div>
                                    <div><label className={labelClass}>Start Date</label><input type="text" name="startDate" value={exp.startDate} onChange={e => handleDynamicChange('experience', exp.id, e)} className={inputClass} placeholder="e.g., Jan 2020" /></div>
                                    <div><label className={labelClass}>End Date</label><input type="text" name="endDate" value={exp.endDate} onChange={e => handleDynamicChange('experience', exp.id, e)} className={inputClass} placeholder="e.g., Present" /></div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className={labelClass}>Description</label>
                                        <Button onClick={() => handleGetSuggestions('experience', exp.role, index, 'description')} size="sm" variant="secondary" disabled={isSuggesting || !exp.role} className="!bg-white/50 dark:!bg-white/10 backdrop-blur-md">
                                            <SparklesIcon className="w-4 h-4 mr-2" /> Suggest
                                        </Button>
                                    </div>
                                    <textarea name="description" value={exp.description} onChange={e => handleDynamicChange('experience', exp.id, e)} className={`${inputClass} h-24`} placeholder="Describe your responsibilities and achievements..."></textarea>
                                </div>
                            </div>
                        ))}
                        </div>
                        <Button onClick={() => addEntry('experience')} variant="secondary" className="mt-4 !bg-white/50 dark:!bg-white/10 backdrop-blur-md">Add Experience</Button>
                    </Card>

                    <Card>
                        <h3 className="text-xl font-bold font-display mb-4 dark:text-gray-200">Projects</h3>
                        <div className="space-y-4">
                        {resumeData.projects.map((proj, index) => (
                            <div key={proj.id} className="p-4 border border-gray-200/50 dark:border-white/10 rounded-md relative bg-white/30 dark:bg-white/5">
                                <button onClick={() => removeEntry('projects', proj.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><TrashIcon /></button>
                                <div><label className={labelClass}>Project Name</label><input type="text" name="name" value={proj.name} onChange={e => handleDynamicChange('projects', proj.id, e)} className={inputClass} /></div>
                                <div className="mt-4"><label className={labelClass}>Project Link</label><input type="url" name="link" value={proj.link} onChange={e => handleDynamicChange('projects', proj.id, e)} className={inputClass} /></div>
                                <div className="mt-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className={labelClass}>Description</label>
                                        <Button onClick={() => handleGetSuggestions('projects', proj.name, index, 'description')} size="sm" variant="secondary" disabled={isSuggesting || !proj.name} className="!bg-white/50 dark:!bg-white/10 backdrop-blur-md">
                                            <SparklesIcon className="w-4 h-4 mr-2" /> Suggest
                                        </Button>
                                    </div>
                                    <textarea name="description" value={proj.description} onChange={e => handleDynamicChange('projects', proj.id, e)} className={`${inputClass} h-24`} placeholder="Describe the project..."></textarea>
                                </div>
                            </div>
                        ))}
                        </div>
                        <Button onClick={() => addEntry('projects')} variant="secondary" className="mt-4 !bg-white/50 dark:!bg-white/10 backdrop-blur-md">Add Project</Button>
                    </Card>

                    <Card>
                        <h3 className="text-xl font-bold font-display mb-4 dark:text-gray-200">Education</h3>
                         <div className="space-y-4">
                        {resumeData.education.map(edu => (
                            <div key={edu.id} className="p-4 border border-gray-200/50 dark:border-white/10 rounded-md relative bg-white/30 dark:bg-white/5">
                                <button onClick={() => removeEntry('education', edu.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><TrashIcon /></button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className={labelClass}>Institution</label><input type="text" name="institution" value={edu.institution} onChange={e => handleDynamicChange('education', edu.id, e)} className={inputClass} /></div>
                                    <div><label className={labelClass}>Degree/Field of Study</label><input type="text" name="degree" value={edu.degree} onChange={e => handleDynamicChange('education', edu.id, e)} className={inputClass} /></div>
                                    <div><label className={labelClass}>Location</label><input type="text" name="location" value={edu.location} onChange={e => handleDynamicChange('education', edu.id, e)} className={inputClass} /></div>
                                    <div><label className={labelClass}>Start Date</label><input type="text" name="startDate" value={edu.startDate} onChange={e => handleDynamicChange('education', edu.id, e)} className={inputClass} /></div>
                                    <div><label className={labelClass}>End Date</label><input type="text" name="endDate" value={edu.endDate} onChange={e => handleDynamicChange('education', edu.id, e)} className={inputClass} /></div>
                                </div>
                            </div>
                        ))}
                        </div>
                        <Button onClick={() => addEntry('education')} variant="secondary" className="mt-4 !bg-white/50 dark:!bg-white/10 backdrop-blur-md">Add Education</Button>
                    </Card>
                    
                    <Card>
                        <h3 className="text-xl font-bold font-display mb-4 dark:text-gray-200">Languages</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {resumeData.languages.map(lang => (
                                <div key={lang} className="flex items-center gap-2 bg-blue-100/80 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-medium px-3 py-1 rounded-full">
                                    <span>{lang}</span>
                                    <button onClick={() => removeLanguage(lang)} className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"><TrashIcon className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                        <input type="text" value={languagesInput} onChange={e => setLanguagesInput(e.target.value)} onKeyDown={handleLanguagesKeyDown} className={inputClass} placeholder="Add a language and press Enter" />
                    </Card>

                     <Card>
                        <h3 className="text-xl font-bold font-display mb-4 dark:text-gray-200">Certifications</h3>
                        <div className="space-y-2">
                            {resumeData.certifications.map(cert => (
                                <div key={cert.id} className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={cert.name} 
                                        onChange={e => handleCertificationChange(cert.id, e.target.value)} 
                                        className={inputClass} 
                                        placeholder="e.g., Google Certified Professional Cloud Architect"
                                    />
                                    <button onClick={() => removeCertification(cert.id)} className="text-red-500 hover:text-red-700 p-2"><TrashIcon /></button>
                                </div>
                            ))}
                        </div>
                        <Button onClick={addCertification} variant="secondary" className="mt-4 !bg-white/50 dark:!bg-white/10 backdrop-blur-md">Add Certification</Button>
                    </Card>
                </div>
                
                {/* Preview Section */}
                <div className="sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto bg-white dark:bg-gray-700 shadow-xl rounded-lg border border-gray-200 dark:border-gray-600">
                    <ResumePreview ref={previewRef} data={resumeData} />
                </div>
            </div>
            <SuggestionModal 
                isOpen={isSuggestionModalOpen}
                onClose={() => setSuggestionModalOpen(false)}
                suggestions={suggestions}
                isLoading={isSuggesting}
                error={suggestionError}
                onSelect={handleApplySuggestion}
            />
        </div>
    );
};

export default ResumeBuilder;