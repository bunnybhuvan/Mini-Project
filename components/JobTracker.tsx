import React, { useState, useEffect } from 'react';
import type { JobApplication, JobApplicationStatus } from '../types';
import Button from './common/Button';
import Card from './common/Card';
import AddJobModal from './AddJobModal';
import BriefcaseIcon from './icons/BriefcaseIcon';
import TrashIcon from './icons/TrashIcon';
import PlusCircleIcon from './icons/PlusCircleIcon';

const statusStyles: Record<JobApplicationStatus, string> = {
    'Saved': 'bg-gray-100/50 text-gray-800 dark:bg-gray-600/50 dark:text-gray-200',
    'Applied': 'bg-blue-100/50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    'Assessment': 'bg-purple-100/50 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    'Interview': 'bg-yellow-100/50 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    'Offer': 'bg-green-100/50 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    'Rejected': 'bg-red-100/50 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

const JobTracker: React.FC = () => {
    const [jobs, setJobs] = useState<JobApplication[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobToEdit, setJobToEdit] = useState<JobApplication | null>(null);

    useEffect(() => {
        try {
            const savedJobs = localStorage.getItem('jobTrackerData');
            if (savedJobs) {
                setJobs(JSON.parse(savedJobs));
            }
        } catch (error) {
            console.error("Failed to load jobs from local storage", error);
        }
    }, []);

    const saveJobs = (updatedJobs: JobApplication[]) => {
        try {
            setJobs(updatedJobs);
            localStorage.setItem('jobTrackerData', JSON.stringify(updatedJobs));
        } catch (error) {
             console.error("Failed to save jobs to local storage", error);
        }
    };

    const handleAddOrUpdateJob = (job: JobApplication) => {
        const existingJobIndex = jobs.findIndex(j => j.id === job.id);
        if (existingJobIndex > -1) {
            const updatedJobs = [...jobs];
            updatedJobs[existingJobIndex] = job;
            saveJobs(updatedJobs);
        } else {
            saveJobs([...jobs, job]);
        }
        setJobToEdit(null);
    };

    const handleDeleteJob = (id: string) => {
        if(window.confirm('Are you sure you want to delete this job application?')) {
            saveJobs(jobs.filter(job => job.id !== id));
        }
    };
    
    const handleOpenModal = (job?: JobApplication) => {
        setJobToEdit(job || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setJobToEdit(null);
        setIsModalOpen(false);
    };


    return (
        <div className="animate-fade-in">
             <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/40 dark:border-white/10 p-4 rounded-xl shadow-lg mb-8">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <BriefcaseIcon className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100">Job Application Tracker</h2>
                    </div>
                     <Button onClick={() => handleOpenModal()}>
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        Add Application
                    </Button>
                </div>
            </div>

            {jobs.length === 0 ? (
                <Card className="text-center py-12">
                    <h3 className="text-xl font-bold dark:text-gray-200">No applications yet.</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Click "Add Application" to start tracking your job search.</p>
                </Card>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow-xl border border-white/20 dark:border-white/10">
                    <table className="min-w-full bg-white/30 dark:bg-black/20 backdrop-blur-lg">
                        <thead className="bg-white/20 dark:bg-white/5 backdrop-blur-md">
                            <tr>
                                <th className="text-left font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider px-6 py-4">Company</th>
                                <th className="text-left font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider px-6 py-4">Role</th>
                                <th className="text-left font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider px-6 py-4">Date Applied</th>
                                <th className="text-left font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider px-6 py-4">Status</th>
                                <th className="text-right font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/30 dark:divide-white/10">
                        {jobs.map(job => (
                            <tr key={job.id} className="hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900 dark:text-gray-100">{job.company}</div>
                                    {job.link && <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View Job</a>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{job.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{job.dateApplied || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[job.status]} backdrop-blur-md border border-white/10`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleOpenModal(job)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">Edit</button>
                                    <button onClick={() => handleDeleteJob(job.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><TrashIcon className="w-5 h-5 inline" /></button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AddJobModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAddJob={handleAddOrUpdateJob}
                jobToEdit={jobToEdit}
            />
        </div>
    );
};

export default JobTracker;