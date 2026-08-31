import React, { useState } from 'react';
import FormattedContent from './FormattedContent';
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  MessageSquare, 
  Code2, 
  CheckCircle2, 
  RotateCw,
  Copy,
  ChevronDown,
  ChevronUp,
  Zap,
  Play
} from 'lucide-react';

export default function DemoSection({ currentTopic = 'JWT Authentication' }) {
  const [topic, setTopic] = useState(currentTopic);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [goal, setGoal] = useState('Interview Preparation');
  const [activeTab, setActiveTab] = useState('notes');
  const [isGenerating, setIsGenerating] = useState(false);

  // Interactive state for MCQs
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // Interactive state for Flashcards
  const [flippedCards, setFlippedCards] = useState({});
  // Interactive state for Viva questions accordion
  const [expandedViva, setExpandedViva] = useState({ 0: true });

  // Sample data map for realistic live generation simulation
  const mockStudyData = {
    'JWT Authentication': {
      roadmap: [
        '1. JWT Fundamentals & Use Cases',
        '2. JWT Structure: Header, Payload, Signature',
        '3. Access Tokens vs Refresh Tokens',
        '4. Express.js Middleware Authentication Flow',
        '5. Security Best Practices (XSS & CSRF Mitigation)'
      ],
      notes: [
        {
          title: 'What is a JSON Web Token?',
          content: 'A JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. It is digitally signed using a secret key (HMAC algorithm) or a public/private key pair (RSA/ECDSA).'
        },
        {
          title: 'Structure of JWT',
          content: 'JWT consists of 3 Base64URL-encoded strings separated by dots: HEADER.PAYLOAD.SIGNATURE. Header contains algorithm type, Payload holds claims/user ID, Signature verifies token authenticity.'
        },
        {
          title: 'Access vs Refresh Tokens',
          content: 'Access tokens are short-lived (e.g. 15 mins) and sent in HTTP Authorization header. Refresh tokens are long-lived (e.g. 7 days), stored securely in HttpOnly cookies to request new access tokens.'
        }
      ],
      mcqs: [
        {
          question: 'Which part of a JWT contains the actual user metadata claims?',
          options: ['Header', 'Payload', 'Signature', 'Secret Key'],
          correct: 1,
          explanation: 'The Payload contains statements about an entity (typically user ID, roles, and expiration time).'
        },
        {
          question: 'Where is the safest place to store a refresh token on the web browser?',
          options: ['LocalStorage', 'SessionStorage', 'HttpOnly Cookie', 'Redux Store'],
          correct: 2,
          explanation: 'HttpOnly, Secure cookies prevent JavaScript access, protecting refresh tokens from XSS attacks.'
        }
      ],
      flashcards: [
        { front: 'What algorithm is commonly used for HMAC signing in JWT?', back: 'HS256 (HMAC with SHA-256)' },
        { front: 'What is the purpose of the "exp" claim in a JWT payload?', back: 'Expiration Time claim: defines when the token ceases to be valid.' },
        { front: 'Why should sensitive passwords never be placed in a JWT payload?', back: 'Payload is Base64 encoded, not encrypted. Anyone can decode and view claims.' }
      ],
      viva: [
        {
          q: 'Explain the end-to-end JWT Authentication flow in an Express.js application.',
          a: '1. User submits credentials to /api/login.\n2. Server verifies credentials and generates a signed JWT.\n3. Server returns JWT to client.\n4. Client stores token and sends it in "Authorization: Bearer <token>" header for protected requests.\n5. Middleware verifies signature with secret key before granting controller access.'
        },
        {
          q: 'How do you revoke a JWT before its natural expiration time?',
          a: 'JWTs are stateless, so revoking requires either maintaining a token blacklist in Redis, or bumping a user version identifier stored in the database.'
        }
      ],
      code: `// Express JWT Authentication Middleware
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied: No Token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or Expired Token' });
    req.user = decoded;
    next();
  });
};`
    },
    'DBMS': {
      roadmap: [
        '1. Relational Database Concepts & Schema',
        '2. SQL Queries & Joins (INNER, LEFT, RIGHT)',
        '3. Normalization (1NF, 2NF, 3NF, BCNF)',
        '4. ACID Properties & Transaction Management',
        '5. Indexing & B-Trees Optimization'
      ],
      notes: [
        {
          title: 'ACID Properties in Databases',
          content: 'Atomicity (All-or-Nothing), Consistency (Valid State), Isolation (Concurrent Execution Safety), Durability (Persisted Storage).'
        },
        {
          title: '3rd Normal Form (3NF)',
          content: 'A relation is in 3NF if it is in 2NF and no non-prime attribute is transitively dependent on the primary key.'
        }
      ],
      mcqs: [
        {
          question: 'Which component ensures database durability after a system crash?',
          options: ['Write-Ahead Logging (WAL)', 'Buffer Manager', 'Query Optimizer', 'Lock Manager'],
          correct: 0,
          explanation: 'Write-Ahead Logging (WAL) writes transactions to non-volatile disk logs before modifying data blocks.'
        }
      ],
      flashcards: [
        { front: 'What is a Primary Key?', back: 'A unique identifier for each record in a database table that cannot contain NULL values.' },
        { front: 'What is a Foreign Key?', back: 'A field in one table that references the Primary Key of another table to establish relationships.' }
      ],
      viva: [
        {
          q: 'Compare Clustered Index vs Non-Clustered Index.',
          a: 'Clustered index defines the physical order of data rows on disk (only 1 per table). Non-clustered index creates a separate logical pointer structure (multiple allowed per table).'
        }
      ],
      code: `-- SQL 3-Way Join Example
SELECT u.name, o.order_date, p.product_name
FROM Users u
INNER JOIN Orders o ON u.user_id = o.user_id
INNER JOIN Products p ON o.product_id = p.product_id
WHERE o.status = 'Completed';`
    }
  };

  const [liveMaterials, setLiveMaterials] = useState(null);
  const [liveSession, setLiveSession] = useState(null);

  const handleGenerate = async (customTopic) => {
    const targetTopic = customTopic || topic;
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:5000/api/study/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          difficulty: difficulty,
          learningGoal: goal,
        })
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setLiveSession(resData.data.session);
        setLiveMaterials(resData.data.materials);
      }
    } catch (error) {
      console.log('Live Backend API Notice (using demo fallback):', error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const deriveCurrentData = () => {
    if (liveMaterials && liveMaterials.length > 0) {
      const roadmapMat = liveMaterials.find(m => m.type === 'roadmap');
      const notesMats = liveMaterials.filter(m => m.type === 'notes');
      const mcqMats = liveMaterials.filter(m => m.type === 'mcq');
      const flashcardMats = liveMaterials.filter(m => m.type === 'flashcard');
      const vivaMats = liveMaterials.filter(m => m.type === 'viva');
      const codeMat = liveMaterials.find(m => m.type === 'code');

      return {
        roadmap: roadmapMat?.content?.steps || [
          `1. ${topic} Fundamentals & Core Principles`,
          `2. Key Architecture & Internal Mechanisms`,
          `3. Real-world Implementation Patterns`,
          `4. Advanced Optimization & Performance`,
          `5. Common Pitfalls & Security Best Practices`
        ],
        notes: notesMats.map(m => {
          if (Array.isArray(m.content?.sections)) {
            return m.content.sections.map(s => ({
              title: s.heading,
              content: s.explanation
            }));
          }
          return [{
            title: m.title || `Understanding ${topic}`,
            content: typeof m.content === 'string' ? m.content : (m.content?.explanation || JSON.stringify(m.content))
          }];
        }).flat(),
        mcqs: mcqMats.map(m => ({
          question: m.content?.question || m.title,
          options: m.content?.options || [],
          correctAnswer: m.content?.correctAnswer ?? m.content?.correct ?? 0,
          explanation: m.content?.explanation || ''
        })),
        flashcards: flashcardMats.map(m => ({
          front: m.content?.front || m.title,
          back: m.content?.back || ''
        })),
        viva: vivaMats.map(m => ({
          q: m.content?.question || m.content?.q || m.title,
          a: m.content?.answer || m.content?.a || ''
        })),
        code: typeof codeMat?.content === 'object' ? codeMat?.content?.code : (codeMat?.content || `// ${topic} Code Example\nconsole.log("Loaded ${topic}");`)
      };
    }
    return mockStudyData[topic] || mockStudyData['JWT Authentication'];
  };

  const currentData = deriveCurrentData();

  const toggleOption = (mcqIdx, optIdx) => {
    setSelectedAnswers(prev => ({ ...prev, [mcqIdx]: optIdx }));
  };

  const toggleCardFlip = (cardIdx) => {
    setFlippedCards(prev => ({ ...prev, [cardIdx]: !prev[cardIdx] }));
  };

  const toggleViva = (idx) => {
    setExpandedViva(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <section id="demo" className="py-20 bg-white border-t border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 inline-block mb-3">
            Interactive Product Demo
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mb-4">
            See StudyGen AI in Action
          </h2>
          <p className="text-base sm:text-lg text-zinc-600">
            Select a topic, set your difficulty, and interact with the AI-generated study output below.
          </p>
        </div>

        {/* Mock Application Container */}
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden">
          
          {/* Top Browser Bar Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <div className="ml-3 flex items-center gap-1.5 text-xs font-mono text-slate-400 hidden sm:inline-flex">
                <img src="/logo.svg" alt="Logo" className="w-3.5 h-3.5 object-contain" />
                <span>app.studygen.ai/workspace</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AI Engine Online</span>
            </div>
          </div>

          {/* Interactive Controls Bar */}
          <div className="p-5 bg-slate-900 border-b border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Input Topic */}
            <div className="md:col-span-4">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Topic
              </label>
              <select
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  handleGenerate();
                }}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-medium focus:outline-none focus:border-brand-500"
              >
                <option value="JWT Authentication">JWT Authentication</option>
                <option value="DBMS">DBMS & SQL</option>
                <option value="React Hooks">React Hooks</option>
                <option value="Operating Systems">Operating Systems</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-medium focus:outline-none focus:border-brand-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Learning Goal */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-medium focus:outline-none focus:border-brand-500"
              >
                <option value="Interview Preparation">Interview Preparation</option>
                <option value="Exam Revision">Exam Revision</option>
                <option value="Project Building">Project Building</option>
              </select>
            </div>

            {/* Generate Button */}
            <div className="md:col-span-2 flex items-end">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
              </button>
            </div>
          </div>

          {/* Main App Workspace */}
          <div className="p-6 bg-slate-950 min-h-[480px]">
            
            {/* Header Title Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-1">
                  <span>LEVEL: {difficulty.toUpperCase()}</span>
                  <span>•</span>
                  <span>GOAL: {goal.toUpperCase()}</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-white">
                  {topic}
                </h3>
              </div>

              {/* Navigation Module Tabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
                {[
                  { id: 'roadmap', label: 'Roadmap', icon: Zap },
                  { id: 'notes', label: 'Notes', icon: BookOpen },
                  { id: 'mcqs', label: 'MCQs', icon: HelpCircle },
                  { id: 'flashcards', label: 'Flashcards', icon: Layers },
                  { id: 'viva', label: 'Viva', icon: MessageSquare },
                  { id: 'code', label: 'Code', icon: Code2 },
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <TabIcon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB CONTENT: Roadmap */}
            {activeTab === 'roadmap' && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-300 mb-4">Structured Learning Roadmap</h4>
                {currentData.roadmap.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 text-sm font-medium flex items-center justify-between hover:border-brand-500/50 transition-colors">
                    <span>{item}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: Smart Notes */}
            {activeTab === 'notes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentData.notes.map((note, idx) => (
                  <div key={idx} className="p-5 bg-slate-900 rounded-xl border border-slate-800">
                    <h4 className="font-heading text-base font-bold text-brand-300 mb-2">{note.title}</h4>
                    <FormattedContent content={note.content} />
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: Interactive MCQs */}
            {activeTab === 'mcqs' && (
              <div className="space-y-6 max-w-3xl">
                {currentData.mcqs.map((mcq, idx) => (
                  <div key={idx} className="p-5 bg-slate-900 rounded-xl border border-slate-800">
                    <h4 className="text-sm font-bold text-white mb-4">
                      Q{idx + 1}. {mcq.question}
                    </h4>

                    <div className="space-y-2 mb-4">
                      {mcq.options.map((opt, oIdx) => {
                        const isSelected = selectedAnswers[idx] === oIdx;
                        const targetCorrect = mcq.correctAnswer !== undefined ? mcq.correctAnswer : mcq.correct;
                        const isCorrect = oIdx === targetCorrect;
                        let btnStyle = 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750';
                        
                        if (isSelected) {
                          btnStyle = isCorrect 
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500' 
                            : 'bg-rose-950/80 text-rose-300 border-rose-500';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => toggleOption(idx, oIdx)}
                            className={`w-full p-3 rounded-lg border text-xs sm:text-sm text-left font-medium flex items-center justify-between transition-all ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isSelected && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded">
                                {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedAnswers[idx] !== undefined && (
                      <div className="p-3 bg-slate-800/80 rounded-lg text-xs text-slate-300 border border-slate-700">
                        <strong className="text-brand-300 block mb-1">Explanation:</strong>
                        <FormattedContent content={mcq.explanation} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: Flashcards */}
            {activeTab === 'flashcards' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentData.flashcards.map((card, idx) => {
                  const isFlipped = flippedCards[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCardFlip(idx)}
                      className="cursor-pointer p-6 min-h-[180px] bg-slate-900 rounded-xl border border-slate-800 hover:border-brand-500/60 flex flex-col justify-between transition-all shadow-md group"
                    >
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500">
                        <span>{isFlipped ? 'Answer' : 'Question'}</span>
                        <span className="text-brand-400 group-hover:underline">Click to Flip 🔄</span>
                      </div>

                      <p className={`text-sm font-semibold leading-relaxed ${isFlipped ? 'text-emerald-300 font-normal text-xs' : 'text-white'}`}>
                        {isFlipped ? card.back : card.front}
                      </p>

                      <div className="text-[10px] text-slate-500 font-mono">
                        Card {idx + 1} of {currentData.flashcards.length}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT: Viva Questions */}
            {activeTab === 'viva' && (
              <div className="space-y-4 max-w-3xl">
                {currentData.viva.map((item, idx) => {
                  const isExpanded = expandedViva[idx];
                  return (
                    <div key={idx} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                      <button
                        onClick={() => toggleViva(idx)}
                        className="w-full p-4 text-left text-sm font-bold text-white flex items-center justify-between hover:bg-slate-850"
                      >
                        <span>Q{idx + 1}: {item.q}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-brand-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>

                      {isExpanded && (
                        <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs sm:text-sm text-slate-300">
                          <span className="font-bold text-emerald-400 block mb-2">Model Answer:</span>
                          <FormattedContent content={item.a} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT: Code Examples */}
            {activeTab === 'code' && (
              <FormattedContent content={`\`\`\`javascript\n${currentData.code}\n\`\`\``} />
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
