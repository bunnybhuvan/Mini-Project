import React, { forwardRef } from 'react';
import type { ResumeData, ResumeTemplate } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
}

const templateStyles: Record<ResumeTemplate, Record<string, string>> = {
    modern: {
        container: 'font-sans text-gray-800 dark:text-gray-300',
        header: 'text-center border-b-2 border-gray-200 dark:border-gray-600 pb-4',
        name: 'text-4xl font-bold font-display text-gray-900 dark:text-gray-100',
        contact: 'text-sm text-gray-600 dark:text-gray-400 mt-1',
        links: 'text-sm text-blue-600 dark:text-blue-400',
        sectionTitle: 'text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 border-b-2 border-blue-200 dark:border-blue-700 pb-1 mt-6 mb-3',
        entryTitle: 'font-bold text-gray-800 dark:text-gray-200',
        entrySubtitle: 'italic text-gray-700 dark:text-gray-300',
        entryDate: 'text-gray-600 dark:text-gray-400',
        entryDescription: 'text-gray-700 dark:text-gray-400 mt-1 whitespace-pre-wrap',
        skillsList: 'text-gray-700 dark:text-gray-300',
    },
    'ats-friendly': {
        container: 'font-serif text-black dark:text-gray-200',
        header: 'text-left pb-2',
        name: 'text-3xl font-bold text-black dark:text-white',
        contact: 'text-xs mt-1',
        links: 'text-xs text-blue-700 dark:text-blue-400 underline',
        sectionTitle: 'text-xs font-bold uppercase tracking-widest border-b border-black dark:border-gray-500 pb-1 mt-4 mb-2',
        entryTitle: 'font-bold',
        entrySubtitle: 'font-normal',
        entryDate: 'text-sm font-normal',
        entryDescription: 'text-sm mt-1 whitespace-pre-wrap list-item list-inside',
        skillsList: 'text-sm',
    }
};

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data }, ref) => {
    const { heading, summary, skills, experience, education, projects, languages, certifications, template } = data;
    const styles = templateStyles[template] || templateStyles.modern;

    const renderEntryDescription = (description: string) => {
        if (template === 'ats-friendly' && description) {
            return (
                <ul className="list-disc pl-5 mt-1 space-y-1">
                    {description.split('\n').map((line, i) => line.trim() ? <li key={i} className="text-sm">{line.trim().replace(/^- /, '')}</li> : null)}
                </ul>
            );
        }
        return <p className={styles.entryDescription}>{description}</p>;
    };

    return (
        <div ref={ref} className={`bg-white dark:bg-gray-800 p-8 h-full ${styles.container}`}>
            <div className={styles.header}>
                <h1 className={styles.name}>{heading.name || 'Your Name'}</h1>
                <p className={styles.contact}>
                    {[heading.email, heading.phone, heading.address].filter(Boolean).join(' | ')}
                </p>
                <p className={styles.links}>
                     {[heading.linkedin, heading.portfolio].filter(Boolean).join(' | ')}
                </p>
            </div>

            {summary && (
                <div className="mt-4">
                    <h2 className={styles.sectionTitle}>Summary</h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{summary}</p>
                </div>
            )}
            
            {skills.length > 0 && (
                <div className="mt-4">
                    <h2 className={styles.sectionTitle}>Skills</h2>
                    <p className={`text-sm ${styles.skillsList}`}>{skills.join(', ')}</p>
                </div>
            )}

            {experience.length > 0 && (
                <div className="mt-4">
                    <h2 className={styles.sectionTitle}>Experience</h2>
                    <div className="space-y-3">
                        {experience.map(exp => (
                            <div key={exp.id} className="text-sm">
                                <div className="flex justify-between">
                                    <h3 className={styles.entryTitle}>{exp.role || 'Job Title'}</h3>
                                    <p className={styles.entryDate}>{exp.startDate} - {exp.endDate}</p>
                                </div>
                                <p className={styles.entrySubtitle}>{exp.company || 'Company'}, {exp.location || 'Location'}</p>
                                {renderEntryDescription(exp.description)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {projects.length > 0 && (
                 <div className="mt-4">
                    <h2 className={styles.sectionTitle}>Projects</h2>
                    <div className="space-y-3">
                        {projects.map(proj => (
                            <div key={proj.id} className="text-sm">
                                <div className="flex justify-between items-center">
                                    <h3 className={styles.entryTitle}>{proj.name || 'Project Name'}</h3>
                                    {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className={styles.links}>Link</a>}
                                </div>
                                {renderEntryDescription(proj.description)}
                            </div>
                        ))}
                    </div>
                </div>
            )}

             {education.length > 0 && (
                <div className="mt-4">
                    <h2 className={styles.sectionTitle}>Education</h2>
                    <div className="space-y-3">
                        {education.map(edu => (
                            <div key={edu.id} className="text-sm">
                                <div className="flex justify-between">
                                    <h3 className={styles.entryTitle}>{edu.institution || 'Institution'}</h3>
                                     <p className={styles.entryDate}>{edu.startDate} - {edu.endDate}</p>
                                </div>
                                <p className={styles.entrySubtitle}>{edu.degree || 'Degree'}, {edu.location || 'Location'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {languages.length > 0 && (
                <div className="mt-4">
                    <h2 className={styles.sectionTitle}>Languages</h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{languages.join(', ')}</p>
                </div>
            )}

            {certifications.length > 0 && (
                <div className="mt-4">
                    <h2 className={styles.sectionTitle}>Certifications</h2>
                    <ul className="list-disc list-inside space-y-1">
                        {certifications.map(cert => (
                            <li key={cert.id} className="text-sm text-gray-700 dark:text-gray-300">{cert.name}</li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
});

export default ResumePreview;