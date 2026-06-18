import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';
import MarqueeSection from './MarqueeSection';
import Footer from './Footer';

interface LandingPageProps {
    onGetStarted: () => void;
    onBuildResume: () => void;
    onJobTracker: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onBuildResume, onJobTracker }) => {
    return (
        <>
            <Header 
                onGetStarted={onGetStarted} 
                onBuildResume={onBuildResume}
                onJobTracker={onJobTracker}
            />
            <main>
                <HeroSection 
                    onGetStarted={onGetStarted} 
                    onBuildResume={onBuildResume}
                    onJobTracker={onJobTracker}
                />
                <FeaturesSection />
                <TestimonialsSection />
                <MarqueeSection />
            </main>
            <Footer />
        </>
    );
};

export default LandingPage;