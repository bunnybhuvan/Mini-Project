
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, InterviewPrepResult, ChatMessage, JdAnalysisResult } from '../types';

// Initializing the AI client with the latest recommended model for speed
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
const DEFAULT_MODEL = 'gemini-3-flash-preview';

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        jobReadinessScore: {
            type: Type.INTEGER,
            description: "A score from 0-100. If a Job Description is provided, this represents the Match Score (Fit). If generic, it represents general readiness."
        },
        atsScore: {
            type: Type.INTEGER,
            description: "A score from 0-100 indicating how well the resume is optimized for ATS or matches keywords."
        },
        summary: {
            type: Type.STRING,
            description: "A brief, encouraging one-paragraph summary of the resume's strengths and key improvement areas (or fit gap analysis)."
        },
        suggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    area: {
                        type: Type.STRING,
                        description: "The area of the resume that needs improvement."
                    },
                    suggestion: {
                        type: Type.STRING,
                        description: "A specific, actionable suggestion."
                    }
                }
            }
        },
        jobRoles: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            description: "An array of 3-5 suitable job roles based on the resume."
        },
        missingKeywords: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            description: "An array of 5-10 high-impact keywords or skills that are missing from the resume (especially those present in the JD)."
        },
        suggestedTemplates: {
            type: Type.ARRAY,
            description: "A list of 2-3 resume templates or formats suitable for the candidate.",
            items: {
                type: Type.OBJECT,
                properties: {
                    templateName: {
                        type: Type.STRING,
                        description: "The name of a suitable resume template."
                    },
                    reasoning: {
                        type: Type.STRING,
                        description: "A brief explanation of why this template is recommended."
                    }
                }
            }
        }
    }
};

const interviewPrepSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: {
                type: Type.STRING,
                description: "A potential interview question."
            },
            shortAnswer: {
                type: Type.STRING,
                description: "A concise suggested answer."
            },
            type: {
                type: Type.STRING,
                description: "technical, hr, or project-based"
            }
        }
    }
};

const suggestionSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 3-5 concise suggestions."
        }
    }
};

const jdSchema = {
    type: Type.OBJECT,
    properties: {
        job_title: { type: Type.STRING },
        seniority: { type: Type.STRING },
        role_type: { type: Type.STRING },
        location_type: { type: Type.STRING },
        hard_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        soft_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        tools_technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
        domains_or_industries: { type: Type.ARRAY, items: { type: Type.STRING } },
        certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
        must_have_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        nice_to_have_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        all_keywords_flat: { type: Type.ARRAY, items: { type: Type.STRING } },
    }
};


export const extractJdKeywords = async (jdText: string): Promise<JdAnalysisResult> => {
    if (!process.env.API_KEY) throw new Error("API key is not configured.");
    if (!jdText.trim()) throw new Error("JD text cannot be empty.");

    try {
        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: `Extract structured data from this Job Description:\n\n${jdText}`,
            config: {
                systemInstruction: `You are an expert HR tech assistant. Your job is to read JD text and return clean JSON.
                Standardize skill names (e.g., "JavaScript" not "Strong JavaScript skills").
                Output MUST follow the schema exactly.`,
                responseMimeType: "application/json",
                responseSchema: jdSchema,
                temperature: 0.1, // Lower temperature for more consistent extraction
            },
        });

        const jsonText = response && response.text ? response.text.trim() : "";
        if (!jsonText) throw new Error("Empty response from AI model.");
        return JSON.parse(jsonText) as JdAnalysisResult;
    } catch (error) {
        console.error("Error extracting JD keywords:", error);
        throw new Error("Failed to analyze Job Description. Please try again or check your API key.");
    }
};

export const analyzeResume = async (resumeText: string, jdText?: string): Promise<AnalysisResult> => {
    if (!process.env.API_KEY) throw new Error("API key is not configured.");
    if (!resumeText.trim()) throw new Error("Resume text cannot be empty.");

    const prompt = jdText 
        ? `JOB DESCRIPTION:\n${jdText}\n\nRESUME:\n${resumeText}\n\nPlease analyze the resume against the provided Job Description.`
        : `Please analyze the following resume text:\n\n${resumeText}`;

    const instruction = jdText
        ? `You are Resumetrix. Perform a Gap Analysis between Resume and JD.
           1. jobReadinessScore: Match Percentage (0-100).
           2. atsScore: Keyword optimization score.
           3. missingKeywords: Strictly list keywords from JD missing in resume.
           4. suggestions: Actionable tailoring advice.`
        : `You are Resumetrix. Analyze the resume for ATS compatibility and clarity. Return structured JSON.`;

    try {
        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: prompt,
            config: {
                systemInstruction: instruction,
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
                temperature: 0.2,
            },
        });

        const jsonText = response && response.text ? response.text.trim() : "";
        if (!jsonText) throw new Error("Empty response from AI model.");
        return JSON.parse(jsonText) as AnalysisResult;
    } catch (error) {
        console.error("Error analyzing resume:", error);
        throw new Error("Analysis failed. This usually happens due to high traffic on the AI model. Please try again in a few moments.");
    }
};

export const generateInterviewQuestions = async (
    resumeText: string,
    jdText?: string
): Promise<InterviewPrepResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }

    const prompt = jdText
        ? `
JD:
${jdText.substring(0, 2500)}

RESUME:
${resumeText.substring(0, 2500)}

Generate interview questions.
`
        : `
RESUME:
${resumeText.substring(0, 2500)}

Generate interview questions.
`;

    try {
        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: prompt,
            config: {
                systemInstruction: `
Generate EXACTLY 5 interview questions.

For each question return:
- question
- shortAnswer
- type

Rules:
- Keep answers concise.
- Maximum 2-3 sentences.
- Mix technical, HR, and project questions.
- Return JSON only.
`,
                responseMimeType: "application/json",
                responseSchema: interviewPrepSchema,
                temperature: 0.2,
            },
        });

        const jsonText = response && response.text ? response.text.trim() : "";
        if (!jsonText) throw new Error("Empty response from AI model.");
        return JSON.parse(jsonText) as InterviewPrepResult;
    } catch (error) {
        console.error("Error generating interview questions:", error);
        throw new Error("Failed to prepare interview. Please try again.");
    }
};

export const generateContentSuggestion = async (
    field: string, 
    context: string
): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: `The user is writing the '${field}' section. Context: "${context}". Generate 3 suggestions.`,
            config: {
                systemInstruction: "Provide professional resume suggestions using strong verbs.",
                responseMimeType: "application/json",
                responseSchema: suggestionSchema,
            },
        });
        
        const jsonText = response && response.text ? response.text.trim() : "";
        if (!jsonText) throw new Error("Empty response from AI model.");
        const result = JSON.parse(jsonText) as { suggestions: string[] };
        return result.suggestions;
    } catch (error) {
        console.error("Error generating suggestion:", error);
        return ["Focus on your measurable achievements.", "Quantify your impact using percentages or numbers.", "Include relevant industry keywords."];
    }
};

export const getRexaResponse = async (history: ChatMessage[], newMessage: string, context?: string): Promise<string> => {
    if (!process.env.API_KEY) throw new Error("API key is not configured.");

    const contents = history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
    }));
    
    const fullMessage = context ? `${context}\n\n---\n\nQuestion: ${newMessage}` : newMessage;
    contents.push({ role: 'user', parts: [{ text: fullMessage }] });

    try {
        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: contents as any,
            config: {
                systemInstruction: "You are Rexa, a professional AI career coach. Be helpful, concise, and professional.",
            },
        });
        return response && response.text ? response.text : "";
    } catch (error) {
        console.error("Error getting Rexa response:", error);
        return "I'm having trouble connecting to my brain right now. Please try asking again in a few seconds!";
    }
};
