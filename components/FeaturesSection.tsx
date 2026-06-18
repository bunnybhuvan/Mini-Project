import React from 'react';
import Card from './common/Card';
import SparklesIcon from './icons/SparklesIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import LightBulbIcon from './icons/LightBulbIcon';
import ScrollReveal from './common/ScrollReveal';

const features = [
    {
        icon: <SparklesIcon className="w-8 h-8 text-blue-600 dark:text-blue-500" />,
        title: "AI-Powered Analysis",
        description: "Leverage cutting-edge AI to get a deep analysis of your resume's content, structure, and impact."
    },
    {
        icon: <CheckCircleIcon className="w-8 h-8 text-green-500" />,
        title: "ATS Optimization Score",
        description: "See how well your resume scores against Applicant Tracking Systems and get tips to beat the bots."
    },
    {
        icon: <LightBulbIcon className="w-8 h-8 text-yellow-500" />,
        title: "Actionable Suggestions",
        description: "Receive clear, targeted feedback on every section of your resume, from formatting to keyword usage."
    }
];

const FeaturesSection: React.FC = () => {
    return (
        <section id="features" className="py-24 scroll-mt-32">
            <div className="container mx-auto px-6">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100">Why Resumetrix?</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Everything you need to build a job-winning resume.</p>
                    </div>
                </ScrollReveal>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <ScrollReveal key={index} delay={index * 150} direction="up" className="h-full">
                            <Card className="text-center h-full hover:!translate-y-[-5px] transition-transform duration-300">
                                <div className="flex justify-center mb-6">
                                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl shadow-inner">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold font-display text-gray-800 dark:text-gray-200 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                            </Card>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;