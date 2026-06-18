import React, { useState, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import RexaFab from './components/RexaFab';
import RexaChatModal from './components/RexaChatModal';
import PremiumBackground from './components/AnimatedBackground'; 
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import type { ViewMode } from './types';

const App: React.FC = () => {
    const { login, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [initialDashboardView, setInitialDashboardView] = useState<ViewMode>('input');
    const [isRexaChatOpen, setIsRexaChatOpen] = useState(false);

    // Navigation Helpers
    const handleLoginSuccess = useCallback(() => {
        login();
        setIsAuthModalOpen(false);
        navigate('/dashboard');
    }, [login, navigate]);

    const handleLogout = useCallback(() => {
        logout();
        navigate('/');
        setInitialDashboardView('input');
    }, [logout, navigate]);

    // Modal Triggers for Landing Page
    const openAuthFor = (view: ViewMode) => {
        setInitialDashboardView(view);
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            setIsAuthModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300 relative overflow-x-hidden selection:bg-electric-500/30">
            <PremiumBackground />

            <Routes>
                <Route path="/" element={
                    <LandingPage 
                        onGetStarted={() => openAuthFor('input')} 
                        onBuildResume={() => openAuthFor('builder')}
                        onJobTracker={() => openAuthFor('tracker')} 
                    />
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard 
                            onNavigateHome={handleLogout} 
                            initialView={initialDashboardView} 
                        />
                    </ProtectedRoute>
                } />
                {/* Catch all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
                onLoginSuccess={handleLoginSuccess} 
            />
            
            <RexaFab onClick={() => setIsRexaChatOpen(true)} />
            <RexaChatModal isOpen={isRexaChatOpen} onClose={() => setIsRexaChatOpen(false)} />
        </div>
    );
};

export default App;