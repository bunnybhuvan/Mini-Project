import React, { useState, useRef, useEffect, FormEvent } from 'react';
import type { ChatMessage, ResumeData, JobApplication } from '../types';
import { getRexaResponse } from '../services/geminiService';
import XIcon from './icons/XIcon';
import SendIcon from './icons/SendIcon';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import Spinner from './common/Spinner';

interface RexaChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RexaChatModal: React.FC<RexaChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I\'m Rexa, your AI assistant. How can I help you with your resume or job search today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Build context from localStorage
    let context = '';
    try {
        const resumeJson = localStorage.getItem('resumeBuilderData');
        const jobsJson = localStorage.getItem('jobTrackerData');
        
        let contextParts = [];
        if (resumeJson) {
            const resumeData: ResumeData = JSON.parse(resumeJson);
            const name = resumeData.heading.name || 'the user';
            contextParts.push(`Current Resume Draft for ${name}.`);
            // Add more specific details if needed, e.g., skills, recent job title
        }
        if (jobsJson) {
            const jobsData: JobApplication[] = JSON.parse(jobsJson);
            if (jobsData.length > 0) {
                 const jobSummary = jobsData.map(j => `${j.role} at ${j.company} (Status: ${j.status})`).join('; ');
                 contextParts.push(`Tracked Jobs: ${jobSummary}.`);
            }
        }
        if (contextParts.length > 0) {
            context = `CONTEXT:\n- ${contextParts.join('\n- ')}`;
        }
    } catch (e) {
        console.error("Could not build context from localStorage", e);
        // Do not block the request if context fails
    }


    try {
      const responseText = await getRexaResponse(messages, input, context);
      const modelMessage: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col h-[60vh] border dark:border-gray-700">
        <header className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <BotIcon className="w-7 h-7 text-blue-600 dark:text-blue-500" />
            <h2 className="text-lg font-bold font-display text-gray-800 dark:text-gray-200">Rexa Assistant</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <BotIcon className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                </div>
                 {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-500 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-200" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <BotIcon className="w-5 h-5 text-white" />
                </div>
                <div className="max-w-xs px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-bl-none">
                  <Spinner size="sm" />
                </div>
              </div>
            )}
            {error && (
                <div className="text-center text-red-600 dark:text-red-400 text-sm bg-red-100 dark:bg-red-900/40 p-2 rounded-md">{error}</div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <footer className="p-4 border-t dark:border-gray-700">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Rexa anything..."
              className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full disabled:bg-gray-400 dark:disabled:bg-gray-500 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Send message"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default RexaChatModal;