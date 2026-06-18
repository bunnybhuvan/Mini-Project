import type { AnalysisResult } from '../types';

/**
 * Simulates sending an email summary to the user.
 * In a real application, this would be an API call to a backend service.
 * @param email The user's email address.
 * @param result The analysis result.
 * @returns A promise that resolves when the email is "sent".
 */
export const sendEmailSummary = async (email: string, result: AnalysisResult): Promise<void> => {
    console.log(`Preparing to send email to: ${email}`);

    // Calculate Hire/Fire percentages based on the analysis result
    const hirePercent = result.jobReadinessScore;
    const firePercent = 100 - result.atsScore;

    const emailContent = {
        to: email,
        from: 'noreply@resumetrix.com',
        subject: 'Your Resumetrix Analysis Summary is Ready!',
        body: `
            Hello,

            Thank you for using Resumetrix! Here is a summary of your resume analysis:

            - Hire Chance: ${hirePercent}%
            - ATS Filter Chance (Fire %): ${firePercent}%

            To view your full detailed report, please return to the application.
            (In a real app, a unique link to the report would be included here.)

            Best regards,
            The Resumetrix Team
        `,
    };
    
    // Simulate network delay for an API call
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('--- SIMULATED EMAIL SENT ---');
            console.log('To:', emailContent.to);
            console.log('Subject:', emailContent.subject);
            console.log('Body:', emailContent.body);
            console.log('----------------------------');
            resolve();
        }, 1000);
    });
};
