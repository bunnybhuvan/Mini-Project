import React from 'react';
import Card from './common/Card';
import ScrollReveal from './common/ScrollReveal';

const testimonials = [
    {
        quote: "Resumetrix gave me the confidence I needed. The ATS score was a game-changer, and I started getting more interviews within a week!",
        name: "Sathish",    
        title: "AI/ML Student"
    },
    {
        quote: "The suggestions were so specific and easy to implement. It felt like I had a personal career coach reviewing my resume.",
        name: "Ganesh",
        title: "CSE Student"
    },
    {
        quote: "As a recent graduate, I had no idea where to start. This tool helped me shape my experience into a professional resume that got results.",
        name: "Bunny",
        title: "New Graduate"
    }
];

const TestimonialsSection: React.FC = () => {
    return (
        <section className="py-24 relative overflow-hidden">
             {/* Background decoration */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-blue-50/50 dark:to-blue-900/10 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100">Loved by Professionals</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Don't just take our word for it. Here's what our users say.</p>
                    </div>
                </ScrollReveal>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <ScrollReveal key={testimonial.name} delay={index * 150} direction="up" className="h-full">
                            <Card className="flex flex-col h-full hover:!translate-y-[-5px] transition-transform duration-300 !border-blue-100 dark:!border-blue-900/30">
                                <div className="flex-grow">
                                    <div className="text-4xl text-blue-300 dark:text-blue-700 font-serif leading-none mb-4">"</div>
                                    <p className="text-gray-600 dark:text-gray-300 italic relative z-10">{testimonial.quote}</p>
                                </div>
                                <div className="mt-8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                        {testimonial.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{testimonial.name}</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">{testimonial.title}</p>
                                    </div>
                                </div>
                            </Card>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;