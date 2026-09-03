import { GoogleGenAI } from '@google/genai';

/**
 * Helper to call Gemini LLM API with prompt and JSON parsing wrapper
 */
const callGeminiJson = async (prompt, fallbackFn) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log('ℹ️ GEMINI_API_KEY not found in .env — using fallback generator.');
    return fallbackFn();
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const responseText = response.text || '';
    const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('⚠️ Gemini API Call Error, triggering fallback:', error.message);
    return fallbackFn();
  }
};

/**
 * On-Demand LLM Generation: Roadmap
 */
export const generateRoadmapForTopic = async (topic, difficulty, learningGoal) => {
  const prompt = `You are an expert curriculum designer.
Generate a structured learning roadmap for: "${topic}".
Difficulty: ${difficulty}, Goal: ${learningGoal}.
Respond ONLY with valid JSON in this exact format without markdown wrappers:
{
  "steps": [
    "1. Fundamental Concepts & Principles",
    "2. Internal Architecture & Data Flow",
    "3. Practical Code Implementation Patterns",
    "4. Security Best Practices & Edge Cases",
    "5. Enterprise Optimization & Real-world Scenarios"
  ]
}`;

  return callGeminiJson(prompt, () => ({
    steps: [
      `1. ${topic} Core Principles & Setup`,
      `2. Architecture & Data Lifecycle`,
      `3. Hands-on Code Patterns & Middleware`,
      `4. Security Audit & Common Pitfalls`,
      `5. Performance Tuning & Interview Mastery`
    ]
  }));
};

/**
 * On-Demand LLM Generation: Notes
 */
export const generateNotesForTopic = async (topic, difficulty, learningGoal) => {
  const prompt = `You are a senior tech writer.
Generate comprehensive study notes for: "${topic}".
Difficulty: ${difficulty}, Goal: ${learningGoal}.
Respond ONLY with valid JSON in this exact format without markdown wrappers:
{
  "sections": [
    {
      "heading": "What is ${topic}?",
      "explanation": "Clear detailed explanation..."
    },
    {
      "heading": "Why use ${topic}?",
      "explanation": "Key architectural advantages and use cases..."
    },
    {
      "heading": "Core Mechanisms & Components",
      "explanation": "Breakdown of essential building blocks..."
    }
  ]
}`;

  return callGeminiJson(prompt, () => ({
    sections: [
      {
        heading: `What is ${topic}?`,
        explanation: `${topic} is a foundational technical domain concept essential for modern software engineering. It provides structure, predictability, and efficiency.`
      },
      {
        heading: `Why use ${topic}?`,
        explanation: `Implementing ${topic} ensures separation of concerns, improves system maintainability, and provides scalability for enterprise applications.`
      },
      {
        heading: `Core Components of ${topic}`,
        explanation: `Key components include configuration handles, execution flow controls, validation layers, and security error boundaries.`
      }
    ]
  }));
};

/**
 * On-Demand LLM Generation: MCQs
 */
export const generateMCQsForTopic = async (topic, difficulty, learningGoal) => {
  const prompt = `You are an expert computer science examiner.
Generate 3 high-quality multiple choice questions for: "${topic}".
Difficulty: ${difficulty}, Goal: ${learningGoal}.
Respond ONLY with valid JSON array in this exact format without markdown wrappers:
[
  {
    "question": "Clear question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation of correct option index..."
  },
  {
    "question": "Second question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 1,
    "explanation": "Detailed explanation..."
  }
]`;

  return callGeminiJson(prompt, () => [
    {
      question: `What is the primary advantage of utilizing ${topic}?`,
      options: [
        'Improves scalability and maintainability',
        'Increases code duplication across modules',
        'Completely disables memory management',
        'Eliminates security protocols'
      ],
      correctAnswer: 0,
      explanation: `${topic} enables structured workflows that significantly enhance code maintainability and system scalability.`
    },
    {
      question: `Which strategy is recommended when handling edge cases in ${topic}?`,
      options: [
        'Silently ignore runtime exceptions',
        'Implement explicit input validation and fallback handlers',
        'Hardcode credentials in client bundle',
        'Restart server on every incoming payload'
      ],
      correctAnswer: 1,
      explanation: `Explicit validation and structured error boundaries ensure high resilience and reliability.`
    }
  ]);
};

/**
 * On-Demand LLM Generation: Flashcards
 */
export const generateFlashcardsForTopic = async (topic, difficulty, learningGoal) => {
  const prompt = `You are a memory retention coach.
Generate 3 flashcards for: "${topic}".
Difficulty: ${difficulty}, Goal: ${learningGoal}.
Respond ONLY with valid JSON array in this exact format without markdown wrappers:
[
  {
    "front": "Concise Question / Concept?",
    "back": "Clear answer / definition."
  },
  {
    "front": "Second Concept?",
    "back": "Second Answer."
  }
]`;

  return callGeminiJson(prompt, () => [
    {
      front: `What is ${topic}?`,
      back: `A foundational mechanism designed to solve complex system interactions cleanly and efficiently.`
    },
    {
      front: `What key safety rule must be observed with ${topic}?`,
      back: `Never expose sensitive internal secrets or unvalidated user data to public callers.`
    },
    {
      front: `How does ${topic} improve architecture?`,
      back: `It decouples system modules, enforces contracts, and enhances testability.`
    }
  ]);
};

/**
 * On-Demand LLM Generation: Viva Questions
 */
export const generateVivaForTopic = async (topic, difficulty, learningGoal) => {
  const prompt = `You are a tech interview panel member.
Generate 2 technical interview / viva questions with model answers for: "${topic}".
Difficulty: ${difficulty}, Goal: ${learningGoal}.
Respond ONLY with valid JSON array in this exact format without markdown wrappers:
[
  {
    "question": "Senior level interview question?",
    "answer": "Comprehensive 3-part answer format..."
  }
]`;

  return callGeminiJson(prompt, () => [
    {
      question: `How would you explain ${topic} in a technical interview?`,
      answer: `Start with a 1-sentence high-level summary, explain the underlying mechanism, highlight key trade-offs, and cite a real-world scenario.`
    },
    {
      question: `How do you handle production failures related to ${topic}?`,
      answer: `Implement structured logging, monitor health metrics, enforce retry timeouts, and maintain a fallback cache strategy.`
    }
  ]);
};

/**
 * On-Demand LLM Generation: Code Example
 */
export const generateCodeForTopic = async (topic, difficulty, learningGoal) => {
  const prompt = `You are a principal software engineer.
Generate a code example for: "${topic}".
Difficulty: ${difficulty}, Goal: ${learningGoal}.
Respond ONLY with valid JSON in this exact format without markdown wrappers:
{
  "language": "javascript",
  "code": "// Code example here",
  "explanation": "Clear explanation of how the code works..."
}`;

  return callGeminiJson(prompt, () => ({
    language: 'javascript',
    code: `// ${topic} Production Pattern
function execute${topic.replace(/[^a-zA-Z0-9]/g, '')}() {
  console.log("Initializing ${topic} workflow...");
  return {
    status: "success",
    timestamp: Date.now(),
    config: { mode: "${difficulty}" }
  };
}`,
    explanation: `This code block demonstrates how to initialize and execute ${topic} with standard error management and configuration handling.`
  }));
};
