
import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseResumeFile } from '../services/fileParser';
import { analyzeResume, generateInterviewQuestions, extractJdKeywords } from '../services/geminiService';
import type { AnalysisResult, InterviewPrepResult, ViewMode, ResumeData, JdAnalysisResult } from '../types';
import Button from './common/Button';
import Card from './common/Card';
import Spinner from './common/Spinner';
import UploadCloudIcon from './icons/UploadCloudIcon';
import AnalysisResultDisplay from './AnalysisResultDisplay';
import HireFireDisplay from './HireFireDisplay';
import InterviewPrepDisplay from './InterviewPrepDisplay';
import FeedbackCard from './FeedbackCard';
import LiveInterview from './LiveInterview';
import ResumeBuilder from './ResumeBuilder';
import JobTracker from './JobTracker';
import SettingsPage from './SettingsPage';
import JdAnalysisDisplay from './JdAnalysisDisplay';
import SparklesIcon from './icons/SparklesIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import ThemeToggle from './ThemeToggle';
import SettingsIcon from './icons/SettingsIcon';
import MenuIcon from './icons/MenuIcon';
import NavigationMenu from './NavigationMenu';
import ResumeScanLoader from './ResumeScanLoader';

interface DashboardProps {
  onNavigateHome: () => void;
  initialView?: ViewMode;
}

export type Module = 'analyzer' | 'builder' | 'tracker' | 'settings';
type AnalyzerScreen = 'input' | 'jd-processing' | 'jd-processed' | 'loading' | 'hire-fire' | 'result-details' | 'interview-prep' | 'live-interview';
type AnalyzerMode = 'general' | 'job-match';

const Dashboard: React.FC<DashboardProps> = ({ onNavigateHome, initialView = 'input' }) => {
    const [analyzerScreen, setAnalyzerScreen] = useState<AnalyzerScreen>('input');
    const [analyzerMode, setAnalyzerMode] = useState<AnalyzerMode>('general');
    const [activeModule, setActiveModule] = useState<Module>('analyzer');
    
    // Data States
    const [resumeText, setResumeText] = useState<string>('');
    const [jdText, setJdText] = useState<string>('');
    const [jdAnalysisResult, setJdAnalysisResult] = useState<JdAnalysisResult | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [interviewPrepResult, setInterviewPrepResult] = useState<InterviewPrepResult | null>(null);
    
    // UI States
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isPreparingInterview, setIsPreparingInterview] = useState<boolean>(false);
    const [resumeDataForBuilder, setResumeDataForBuilder] = useState<ResumeData | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Initializing AI...');


    useEffect(() => {
        const module: Module = initialView === 'input' ? 'analyzer' : (initialView as unknown as Module);
        setActiveModule(module);
    }, [initialView]);

    useEffect(() => {
        if (activeModule === 'builder') {
            const savedData = localStorage.getItem('resumeBuilderData');
            if (savedData) {
                setResumeDataForBuilder(JSON.parse(savedData));
            }
        }
    }, [activeModule]);

    const resetAnalyzerState = () => {
        setAnalyzerScreen('input');
        setResumeText('');
        setJdText('');
        setJdAnalysisResult(null);
        setAnalysisResult(null);
        setInterviewPrepResult(null);
        setError(null);
        setIsProcessing(false);
        setIsPreparingInterview(false);
        setFileName('');
        setAnalyzerMode('general');
    };

    // --- JD Extraction Handlers ---
    const handleAnalyzeJd = async () => {
        if (!jdText.trim()) {
            setError("Please enter a Job Description first.");
            return;
        }
        setIsProcessing(true);
        setError(null);
        setAnalyzerScreen('jd-processing');
        setLoadingMessage('Extracting key requirements from Job Description...');

        try {
            const result = await extractJdKeywords(jdText);
            setJdAnalysisResult(result);
            setAnalyzerScreen('jd-processed');
        } catch (err: any) {
            setError(err.message || "Failed to analyze Job Description.");
            setAnalyzerScreen('input');
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Resume Upload Handlers ---
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        setIsProcessing(true);
        setFileName(file.name);
        setAnalyzerScreen('loading');
        setLoadingMessage('Parsing your document...');

        try {
            const text = await parseResumeFile(file);
            setResumeText(text);
            
            setLoadingMessage('Scanning for keywords and ATS compatibility...');
            const result = await analyzeResume(text, analyzerMode === 'job-match' ? jdText : undefined);
            
            setLoadingMessage('Calculating match scores...');
            setAnalysisResult(result);
            setAnalyzerScreen('hire-fire');
        } catch (err: any) {
            setError(err.message || 'An error occurred during processing.');
            setAnalyzerScreen('input');
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handlePasteResume = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setResumeText(event.target.value);
    };

    const handleAnalyzePastedText = async () => {
        if (!resumeText.trim()) {
            setError("Please paste your resume text before analyzing.");
            return;
        }
        
        setError(null);
        setIsProcessing(true);
        setAnalyzerScreen('loading');
        setLoadingMessage('Starting AI Analysis...');

        try {
            const result = await analyzeResume(resumeText, analyzerMode === 'job-match' ? jdText : undefined);
            setAnalysisResult(result);
            setAnalyzerScreen('hire-fire');
        } catch (err: any) {
            setError(err.message || 'An error occurred during analysis.');
            setAnalyzerScreen('input');
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleAnalyzeFromBuilder = async (data: ResumeData) => {
        let sections = [];
        sections.push(`${data.heading.name}\n${[data.heading.email, data.heading.phone, data.heading.address].filter(Boolean).join(' | ')}`);
        if (data.summary) sections.push(`SUMMARY\n${data.summary}`);
        if (data.skills.length) sections.push(`SKILLS\n${data.skills.join(', ')}`);
        if (data.experience.length) {
            sections.push(`EXPERIENCE\n${data.experience.map(e => `${e.role} at ${e.company}\n${e.description}`).join('\n\n')}`);
        }
        
        const text = sections.join('\n\n');

        setError(null);
        setIsProcessing(true);
        setActiveModule('analyzer');
        setAnalyzerScreen('loading');
        setLoadingMessage('Analyzing your built resume...');

        try {
            const result = await analyzeResume(text, jdText || undefined);
            setAnalysisResult(result);
            setResumeText(text); 
            setAnalyzerScreen('hire-fire');
        } catch (err: any) {
            setError(err.message || 'An error occurred during analysis.');
            setActiveModule('builder');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePrepareInterview = async () => {
        if (!resumeText) return;
        setIsPreparingInterview(true);
        try {
            const questions = await generateInterviewQuestions(resumeText, jdText || undefined);
            setInterviewPrepResult(questions);
            setAnalyzerScreen('interview-prep');
        } catch (err: any) {
            setError(err.message || 'Failed to generate interview questions.');
        } finally {
            setIsPreparingInterview(false);
        }
    };

    const switchModule = (module: Module) => {
        if(activeModule !== module) {
            resetAnalyzerState();
            setActiveModule(module);
        }
    };

    // --- RENDER HELPERS ---

    const renderUploadSection = (title: string, subtitle: string) => (
         <div className="animate-fade-in">
             <div className="text-center mb-8">
                <UploadCloudIcon className="w-16 h-16 mx-auto text-blue-500" />
                <h2 className="mt-4 text-2xl font-display font-bold text-gray-900 dark:text-gray-100">{title}</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{subtitle}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <label htmlFor="resume-upload" className="w-full text-center px-6 py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors flex flex-col items-center justify-center group">
                    <DocumentTextIcon className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Upload Resume PDF/DOCX</span>
                </label>
                <input id="resume-upload" type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileChange} />
                
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300/50 dark:border-gray-600/50" />
                    <span className="px-4 text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase">Or Paste Text</span>
                    <hr className="flex-grow border-gray-300/50 dark:border-gray-600/50" />
                </div>
                
                <textarea
                    value={resumeText}
                    onChange={handlePasteResume}
                    placeholder="Paste your resume contents here..."
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-200"
                />
                <Button onClick={handleAnalyzePastedText} disabled={!resumeText.trim()} className="mt-4 w-full" size="lg">
                    {analyzerMode === 'job-match' ? "Calculate Match Score" : "Analyze Resume"}
                </Button>
            </div>
        </div>
    );

    const renderAnalyzerContent = () => {
        switch (analyzerScreen) {
            case 'loading':
            case 'jd-processing':
                return (
                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                        <Card className="w-full max-w-xl text-center py-16 px-8 relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl">
                             <div className="relative z-10 flex flex-col items-center">
                                <ResumeScanLoader />
                                <h2 className="text-3xl font-display font-bold mt-8 text-gray-900 dark:text-white">
                                    {loadingMessage}
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 animate-pulse">
                                    Please stay on this page. This usually takes 15-30 seconds...
                                </p>
                             </div>
                        </Card>
                    </div>
                );

            case 'jd-processed':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <Button onClick={() => setAnalyzerScreen('input')} variant="secondary" className="mb-4">
                             &larr; Back to Input
                        </Button>
                        {jdAnalysisResult && <JdAnalysisDisplay result={jdAnalysisResult} />}
                        {renderUploadSection(
                            "Now, Upload Your Resume", 
                            "Let's see how well you match this job."
                        )}
                         {error && <p className="mt-4 text-center text-red-600 bg-red-100/50 dark:bg-red-900/30 dark:text-red-400 p-3 rounded-md backdrop-blur-sm">{error}</p>}
                    </div>
                );

            case 'hire-fire':
                if (!analysisResult) return null;
                return (
                    <HireFireDisplay
                        result={analysisResult}
                        onShowDetails={() => setAnalyzerScreen('result-details')}
                        onPrepareInterview={handlePrepareInterview}
                        isPreparingInterview={isPreparingInterview}
                    />
                );

            case 'result-details':
                if (!analysisResult) return null;
                return (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <Button onClick={() => setAnalyzerScreen('hire-fire')} variant="secondary" className="!bg-white/30 dark:!bg-white/10 backdrop-blur-md">Back to Summary</Button>
                        </div>
                        <AnalysisResultDisplay result={analysisResult} />
                        <div className="mt-8">
                            <FeedbackCard />
                        </div>
                    </>
                );
            
            case 'interview-prep':
                if (!interviewPrepResult) return null;
                return (
                    <>
                        <Button onClick={() => setAnalyzerScreen('hire-fire')} variant="secondary" className="mb-6 !bg-white/30 dark:!bg-white/10 backdrop-blur-md">Back to Summary</Button>
                        <InterviewPrepDisplay result={interviewPrepResult} onStartLiveInterview={() => setAnalyzerScreen('live-interview')} />
                    </>
                );
            
            case 'live-interview':
                 if (!interviewPrepResult) return null;
                 return <LiveInterview questions={interviewPrepResult} onFinish={() => setAnalyzerScreen('interview-prep')} />;
                 
            case 'input':
            default:
                return (
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-center mb-8">
                            <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full inline-flex">
                                <button
                                    onClick={() => { setAnalyzerMode('general'); setError(null); }}
                                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${analyzerMode === 'general' ? 'bg-white dark:bg-navy-950 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                                >
                                    General Resume Review
                                </button>
                                <button
                                    onClick={() => { setAnalyzerMode('job-match'); setError(null); }}
                                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${analyzerMode === 'job-match' ? 'bg-white dark:bg-navy-950 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                                >
                                    Target Job Match
                                </button>
                            </div>
                        </div>

                        {analyzerMode === 'general' ? (
                            <Card className="animate-fade-in">
                                {renderUploadSection("Analyze Your Resume", "Get expert feedback, ATS score, and improvement tips.")}
                            </Card>
                        ) : (
                            <Card className="animate-fade-in">
                                <div className="text-center mb-8">
                                    <BriefcaseIcon className="w-16 h-16 mx-auto text-blue-500" />
                                    <h2 className="mt-4 text-2xl font-display font-bold text-gray-900 dark:text-gray-100">Step 1: Paste Job Description</h2>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">We'll extract keywords and requirements to check your fit.</p>
                                </div>
                                
                                <textarea
                                    value={jdText}
                                    onChange={(e) => setJdText(e.target.value)}
                                    placeholder="Paste the full job description here (Responsibilities, Requirements, etc.)..."
                                    className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-200"
                                />
                                <Button onClick={handleAnalyzeJd} disabled={!jdText.trim()} className="mt-6 w-full" size="lg">
                                    Extract Keywords & Continue &rarr;
                                </Button>
                            </Card>
                        )}

                        {error && <p className="mt-4 text-center text-red-600 bg-red-100/50 dark:bg-red-900/30 dark:text-red-400 p-3 rounded-md backdrop-blur-sm">{error}</p>}
                    </div>
                );
        }
    };
    
    
    const renderModule = () => {
        switch (activeModule) {
            case 'analyzer':
                return renderAnalyzerContent();
            case 'builder':
                return <ResumeBuilder onAnalyze={handleAnalyzeFromBuilder} onBack={() => switchModule('analyzer')} initialData={resumeDataForBuilder} />;
            case 'tracker':
                return <JobTracker />;
            default:
                return renderAnalyzerContent();
        }
    }

    if (activeModule === 'settings') {
        return <SettingsPage onBack={() => switchModule('analyzer')} onNavigate={switchModule} onLogout={onNavigateHome} />;
    }
    
    return (
        <div className="min-h-screen pb-20">
             <NavigationMenu 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                onNavigate={(module) => switchModule(module as Module)} 
                onLogout={onNavigateHome} 
                activeModule={activeModule}
            />

             <header className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg shadow-sm border-b border-white/20 dark:border-white/10 sticky top-0 z-20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2 group">
                       <SparklesIcon className="w-8 h-8 text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                       <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-gray-200">Resumetrix</h1>
                    </Link>
                    <div className="flex items-center gap-2">
                        <nav className="hidden md:flex items-center gap-2 flex-wrap">
                            <Button onClick={() => switchModule('analyzer')} variant={activeModule === 'analyzer' ? 'primary' : 'secondary'} className={activeModule !== 'analyzer' ? '!bg-white/30 dark:!bg-white/10 backdrop-blur-md hover:!bg-white/50 dark:hover:!bg-white/20 border-white/20' : ''}>Analyze</Button>
                            <Button onClick={() => switchModule('builder')} variant={activeModule === 'builder' ? 'primary' : 'secondary'} className={activeModule !== 'builder' ? '!bg-white/30 dark:!bg-white/10 backdrop-blur-md hover:!bg-white/50 dark:hover:!bg-white/20 border-white/20' : ''}>Build</Button>
                            <Button onClick={() => switchModule('tracker')} variant={activeModule === 'tracker' ? 'primary' : 'secondary'} className={activeModule !== 'tracker' ? '!bg-white/30 dark:!bg-white/10 backdrop-blur-md hover:!bg-white/50 dark:hover:!bg-white/20 border-white/20' : ''}>Track</Button>
                            <Button onClick={() => switchModule('settings')} variant={'secondary'} className="!bg-white/30 dark:!bg-white/10 backdrop-blur-md hover:!bg-white/50 dark:hover:!bg-white/20 border-white/20"><SettingsIcon className="w-5 h-5" /></Button>
                        </nav>
                         <div className="hidden md:block border-l border-gray-300 dark:border-gray-600 h-8 mx-2"></div>
                        <div className="hidden md:block">
                            <Button onClick={onNavigateHome} className="!bg-red-500/80 hover:!bg-red-600/90 backdrop-blur-sm">Logout</Button>
                        </div>
                        <ThemeToggle />
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-md hover:bg-white/20 dark:hover:bg-gray-700/50" aria-label="Open navigation menu">
                               <MenuIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {renderModule()}
            </main>
        </div>
    );
};

export default Dashboard;
