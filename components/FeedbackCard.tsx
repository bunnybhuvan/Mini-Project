

import React, { useState } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import ThumbUpIcon from './icons/ThumbUpIcon';
import ThumbDownIcon from './icons/ThumbDownIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

const FeedbackCard: React.FC = () => {
    const [rating, setRating] = useState<'good' | 'bad' | null>(null);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) return;

        setIsSubmitting(true);
        // Simulate an API call
        setTimeout(() => {
            console.log('Feedback Submitted:', { rating, comment });
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1000);
    };

    if (isSubmitted) {
        return (
            <Card>
                <div className="text-center p-6">
                    <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold font-display text-gray-800 dark:text-gray-200">Thank you!</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Your feedback helps us improve.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-bold font-display text-gray-800 dark:text-gray-200 mb-4">Was this analysis helpful?</h3>
                <div className="flex items-center space-x-4 mb-4">
                    <button
                        type="button"
                        onClick={() => setRating('good')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                            rating === 'good' ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-green-400 hover:text-green-600'
                        }`}
                        aria-pressed={rating === 'good'}
                    >
                        <ThumbUpIcon className="w-5 h-5" />
                        <span>Yes</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setRating('bad')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                            rating === 'bad' ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-red-400 hover:text-red-600'
                        }`}
                        aria-pressed={rating === 'bad'}
                    >
                        <ThumbDownIcon className="w-5 h-5" />
                        <span>No</span>
                    </button>
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Any additional comments? (optional)"
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 dark:border-gray-600"
                    disabled={isSubmitting}
                    aria-label="Feedback comments"
                />
                
                <div className="mt-4 text-right">
                    <Button
                        type="submit"
                        disabled={!rating || isSubmitting}
                        isLoading={isSubmitting}
                    >
                        Submit Feedback
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default FeedbackCard;