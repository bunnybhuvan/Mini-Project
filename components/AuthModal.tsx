import React, { useState, useEffect, FormEvent } from 'react';
import Button from './common/Button';
import Input from './common/Input';
import GoogleIcon from './icons/GoogleIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import GitHubIcon from './icons/GitHubIcon';
import MailIcon from './icons/MailIcon';
import LockIcon from './icons/LockIcon';
import XIcon from './icons/XIcon';
import UserIcon from './icons/UserIcon';
import PhoneIcon from './icons/PhoneIcon';
import ExclamationCircleIcon from './icons/ExclamationCircleIcon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

type SignInMethod = 'email' | 'phone' | 'otp';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [signInMethod, setSignInMethod] = useState<SignInMethod>('email');
    
    // Form States
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            // Reset states on open
            setError(null);
            setIsSignUpMode(false);
            setSignInMethod('email');
        } else {
            const timer = setTimeout(() => setIsRendered(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const simulateApiCall = (shouldSucceed: boolean, successMessage: string, failureMessage: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldSucceed) {
                    resolve(successMessage);
                } else {
                    reject(new Error(failureMessage));
                }
            }, 1500);
        });
    };

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await simulateApiCall(true, "Login successful!", "Invalid credentials.");
            if (rememberMe) localStorage.setItem('isLoggedIn', 'true');
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await simulateApiCall(true, "Signup successful!", "Email already exists.");
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOtp = async (e: FormEvent) => {
        e.preventDefault();
        if (!/^\+?[1-9]\d{1,14}$/.test(phone)) {
            setError("Invalid phone number.");
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            await simulateApiCall(true, "OTP Sent", "Failed to send.");
            setSignInMethod('otp');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: FormEvent) => {
        e.preventDefault();
        if (otp !== '123456') {
             setError("Invalid OTP.");
             return;
        }
        setIsLoading(true);
        try {
            await simulateApiCall(true, "Success", "Failed");
             onLoginSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isRendered && !isOpen) return null;

    // --- RENDER HELPERS ---
    
    const SocialIcons = () => (
        <div className="flex justify-center gap-4 my-4">
            <button className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-white/50 dark:hover:bg-white/10 transition-colors"><GoogleIcon className="w-5 h-5" /></button>
            <button className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-white/50 dark:hover:bg-white/10 transition-colors"><LinkedInIcon className="w-5 h-5" /></button>
            <button className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-white/50 dark:hover:bg-white/10 transition-colors"><GitHubIcon className="w-5 h-5" /></button>
        </div>
    );

    const SignInForm = () => (
        <div className="w-full max-w-xs mx-auto flex flex-col justify-center h-full">
             <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center">Sign in</h1>
             <SocialIcons />
             <p className="text-sm text-gray-500 mb-6 text-center">or use your account</p>
             
             {signInMethod === 'email' && (
                 <form onSubmit={handleLogin} className="space-y-4">
                    <Input type="email" placeholder="Email" icon={<MailIcon className="text-gray-400 w-5 h-5"/>} required containerClassName="border-none" />
                    <Input type="password" placeholder="Password" icon={<LockIcon className="text-gray-400 w-5 h-5"/>} required containerClassName="border-none" />
                    <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
                            <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                        </label>
                        <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                    </div>
                    <Button type="submit" className="w-full rounded-full py-3 shadow-lg backdrop-blur-sm" isLoading={isLoading}>Sign In</Button>
                    <button type="button" onClick={() => setSignInMethod('phone')} className="w-full text-xs text-center text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 mt-2">Sign in with Phone</button>
                 </form>
             )}

             {signInMethod === 'phone' && (
                 <form onSubmit={handleSendOtp} className="space-y-4">
                     <Input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} icon={<PhoneIcon className="text-gray-400 w-5 h-5"/>} required />
                     <Button type="submit" className="w-full rounded-full py-3 shadow-lg" isLoading={isLoading}>Send OTP</Button>
                     <button type="button" onClick={() => setSignInMethod('email')} className="w-full text-xs text-center text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 mt-2">Back to Email Login</button>
                 </form>
             )}

             {signInMethod === 'otp' && (
                 <form onSubmit={handleVerifyOtp} className="space-y-4">
                     <p className="text-xs text-center text-gray-500">Enter code sent to {phone} (123456)</p>
                     <Input type="text" placeholder="OTP Code" value={otp} onChange={e => setOtp(e.target.value)} icon={<LockIcon className="text-gray-400 w-5 h-5"/>} required />
                     <Button type="submit" className="w-full rounded-full py-3 shadow-lg" isLoading={isLoading}>Verify</Button>
                      <button type="button" onClick={() => setSignInMethod('phone')} className="w-full text-xs text-center text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 mt-2">Change Phone Number</button>
                 </form>
             )}

             {error && (
                <div className="mt-4 p-2 bg-red-100/80 backdrop-blur-sm text-red-600 text-xs rounded text-center flex items-center justify-center gap-2 border border-red-200">
                    <ExclamationCircleIcon className="w-4 h-4" /> {error}
                </div>
             )}
        </div>
    );

    const SignUpForm = () => (
         <div className="w-full max-w-xs mx-auto flex flex-col justify-center h-full">
             <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center">Create Account</h1>
             <SocialIcons />
             <p className="text-sm text-gray-500 mb-6 text-center">or use your email for registration</p>
             <form onSubmit={handleSignup} className="space-y-4">
                <Input type="text" placeholder="Name" icon={<UserIcon className="text-gray-400 w-5 h-5"/>} required containerClassName="border-none" />
                <Input type="email" placeholder="Email" icon={<MailIcon className="text-gray-400 w-5 h-5"/>} required containerClassName="border-none" />
                <Input type="password" placeholder="Password" icon={<LockIcon className="text-gray-400 w-5 h-5"/>} required containerClassName="border-none" />
                <Button type="submit" className="w-full rounded-full py-3 shadow-lg" isLoading={isLoading}>Sign Up</Button>
             </form>
             {error && (
                <div className="mt-4 p-2 bg-red-100/80 backdrop-blur-sm text-red-600 text-xs rounded text-center flex items-center justify-center gap-2 border border-red-200">
                    <ExclamationCircleIcon className="w-4 h-4" /> {error}
                </div>
             )}
         </div>
    );

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
            
            <div className="relative z-10 w-full max-w-[850px]">
                {/* Close Button */}
                <button onClick={onClose} className="absolute -top-12 right-0 md:-right-12 text-white hover:text-gray-300 transition-colors" aria-label="Close modal">
                    <XIcon className="w-8 h-8" />
                </button>

                {/* Mobile View Card (< md) */}
                <div className="md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 min-h-[500px] relative overflow-hidden">
                    <div className={`transition-opacity duration-300 ${isSignUpMode ? 'opacity-0 pointer-events-none absolute inset-0 p-8' : 'opacity-100 relative'}`}>
                        <SignInForm />
                        <div className="mt-6 text-center">
                             <p className="text-sm text-gray-600 dark:text-gray-400">Don't have an account?</p>
                             <button onClick={() => setIsSignUpMode(true)} className="text-blue-600 font-bold hover:underline mt-1">Sign Up</button>
                        </div>
                    </div>
                    <div className={`transition-opacity duration-300 ${!isSignUpMode ? 'opacity-0 pointer-events-none absolute inset-0 p-8' : 'opacity-100 relative'}`}>
                        <SignUpForm />
                        <div className="mt-6 text-center">
                             <p className="text-sm text-gray-600 dark:text-gray-400">Already have an account?</p>
                             <button onClick={() => setIsSignUpMode(false)} className="text-blue-600 font-bold hover:underline mt-1">Sign In</button>
                        </div>
                    </div>
                </div>

                {/* Desktop Sliding View (>= md) */}
                <div className="hidden md:block bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-[30px] shadow-2xl overflow-hidden relative min-h-[550px]">
                    {/* Sign Up Container - Moves to Right */}
                     <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 ${isSignUpMode ? 'translate-x-full opacity-100 z-50' : 'opacity-0 z-10'}`}>
                         <div className="h-full w-full p-12">
                            <SignUpForm />
                         </div>
                     </div>

                    {/* Sign In Container - Moves to Right and fades out */}
                     <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 z-20 ${isSignUpMode ? 'translate-x-full opacity-0' : 'opacity-100'}`}>
                        <div className="h-full w-full p-12">
                             <SignInForm />
                        </div>
                     </div>

                    {/* Overlay Container - Moves to Left */}
                    <div 
                        className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-50 ${isSignUpMode ? '-translate-x-full rounded-r-[100px] rounded-l-none' : 'rounded-l-[100px] rounded-r-none'}`}
                    >
                         <div className={`relative -left-full h-full w-[200%] bg-gradient-to-br from-blue-500/80 to-purple-600/80 dark:from-blue-800/80 dark:to-purple-900/80 backdrop-blur-2xl transform transition-transform duration-700 ease-in-out ${isSignUpMode ? 'translate-x-1/2' : ''}`}>
                             
                             {/* Left Overlay Panel (Visible when Sign Up is active) */}
                             <div className={`absolute top-0 flex flex-col items-center justify-center w-1/2 h-full px-12 text-center text-white transform transition-transform duration-700 ease-in-out ${isSignUpMode ? 'translate-x-0' : '-translate-x-[20%]'}`}>
                                 <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                                 <p className="text-lg mb-8 text-blue-50">To keep connected with us please login with your personal info</p>
                                 <button onClick={() => setIsSignUpMode(false)} className="px-12 py-3 border-2 border-white rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-blue-700 transition-colors">Sign In</button>
                             </div>

                             {/* Right Overlay Panel (Visible when Sign In is active) */}
                             <div className={`absolute top-0 right-0 flex flex-col items-center justify-center w-1/2 h-full px-12 text-center text-white transform transition-transform duration-700 ease-in-out ${isSignUpMode ? 'translate-x-[20%]' : 'translate-x-0'}`}>
                                 <h1 className="text-4xl font-bold mb-4">Hello, Friend!</h1>
                                 <p className="text-lg mb-8 text-blue-50">Enter your personal details and start journey with us</p>
                                 <button onClick={() => setIsSignUpMode(true)} className="px-12 py-3 border-2 border-white rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-blue-700 transition-colors">Sign Up</button>
                             </div>
                         </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuthModal;