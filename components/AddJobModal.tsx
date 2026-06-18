import React, { useState, FormEvent, useEffect } from 'react';
import type { JobApplication, JobApplicationStatus } from '../types';
import Button from './common/Button';
import Input from './common/Input';
import XIcon from './icons/XIcon';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: JobApplication) => void;
  jobToEdit?: JobApplication | null;
}

const initialJobState: Omit<JobApplication, 'id'> = {
  company: '',
  role: '',
  status: 'Saved',
  dateApplied: '',
  link: '',
  notes: '',
};

const AddJobModal: React.FC<AddJobModalProps> = ({
  isOpen,
  onClose,
  onAddJob,
  jobToEdit,
}) => {
  const [jobData, setJobData] = useState(initialJobState);

  useEffect(() => {
    if (jobToEdit) {
      setJobData(jobToEdit);
    } else {
      setJobData(initialJobState);
    }
  }, [jobToEdit, isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onAddJob({
      ...jobData,
      id: jobToEdit?.id || Date.now().toString(),
    });

    onClose();
  };

  const statuses: JobApplicationStatus[] = [
    'Saved',
    'Applied',
    'Assessment',
    'Interview',
    'Offer',
    'Rejected',
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <XIcon />
        </button>

        <h2 className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200 mb-6">
          {jobToEdit ? 'Edit Job Application' : 'Add New Job Application'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company
              </label>
              <Input
                name="company"
                value={jobData.company}
                onChange={handleChange}
                required
                placeholder="e.g., Google"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title
              </label>
              <Input
                name="role"
                value={jobData.role}
                onChange={handleChange}
                required
                placeholder="e.g., Frontend Engineer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={jobData.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Application Link
            </label>
            <Input
              type="url"
              name="link"
              value={jobData.link}
              onChange={handleChange}
              placeholder="https://careers.google.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Applied
            </label>
            <Input
              type="date"
              name="dateApplied"
              value={jobData.dateApplied}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={jobData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
              placeholder="Contact person, next steps, etc."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="secondary">
              Cancel
            </Button>

            <Button type="submit">
              {jobToEdit ? 'Save Changes' : 'Add Job'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;