import React, { useState } from 'react';
import FormattedContent from './FormattedContent';
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  MessageSquare, 
  Code2, 
  Zap, 
  CheckCircle2, 
  Loader2, 
  PlusCircle, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  ArrowLeft
} from 'lucide-react';

export default function GeneratorWorkspace({ onBackToHome }) {
  const [topicInput, setTopicInput] = useState('JWT Authentication');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [goal, setGoal] = useState('Interview Preparation');
  
  // Session & generated materials state
  const [session, setSession] = useState(null);
  const [materials, setMaterials] = useState([]);
  
  // Loading states per content type
  const [creatingSession, setCreatingSession] = useState(false);
  const [generatingTypes, setGeneratingTypes] = useState({});

  // Active viewing tab
  const [activeTab, setActiveTab] = useState('notes');

  // Interactive component states
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flippedCards, setFlippedCards] = useState({});
  const [expandedViva, setExpandedViva] = useState({ 0: true });

  // 1. Create a new StudySession
  const handleCreateSession = async (e) => {
    if (e) e.preventDefault();
    if (!topicInput.trim()) return;

    setCreatingSession(true);
    setMaterials([]);
    setSession(null);

    try {
      const response = await fetch('http://localhost:5000/api/study/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicInput,
          difficulty: difficulty,
          learningGoal: goal,
        })
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setSession(resData.data);
      }
    } catch (error) {
      console.log('Backend connection notice (using local session fallback):', error.message);
      setSession({
        _id: 'mock_session_' + Date.now(),
        topic: topicInput,
        difficulty: difficulty.toLowerCase(),
        learningGoal: goal.toLowerCase(),
        status: 'completed'
      });
    } finally {
      setCreatingSession(false);
    }
  };

  // 2. On-demand material generation for a specific type
  const handleGenerateMaterial = async (type) => {
    if (!session) return;

    setGeneratingTypes(prev => ({ ...prev, [type]: true }));

    try {
      const response = await fetch(`http://localhost:5000/api/study/sessions/${session._id}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        const newItems = Array.isArray(resData.data) ? resData.data : [resData.data];
        setMaterials(prev => [...prev.filter(m => m.type !== type), ...newItems]);
        setActiveTab(type === 'mcqs' ? 'mcqs' : type);
      }
    } catch (error) {
      console.log(`Backend connection notice for ${type} (using client fallback):`, error.message);
      const mockMaterial = createMockMaterialForType(session.topic, type, session._id);
      setMaterials(prev => [...prev.filter(m => m.type !== type), ...mockMaterial]);
      setActiveTab(type === 'mcqs' ? 'mcqs' : type);
    } finally {
      setGeneratingTypes(prev => ({ ...prev, [type]: false }));
    }
  };

  // Offline mock generator helper
  const createMockMaterialForType = (topic, type, sessionId) => {
    if (type === 'roadmap') {
      return [{
        sessionId,
        type: 'roadmap',
        title: `${topic} Roadmap`,
        content: {
          steps: [
            `1. ${topic} Fundamentals & Core Principles`,
            `2. Request Lifecycle & Internal Architecture`,
            `3. Hands-on Code Patterns & Implementation`,
            `4. Security Best Practices & Audit Logs`,
            `5. Enterprise Optimization & Viva Questions`
          ]
        }
      }];
    }
    if (type === 'notes') {
      return [{
        sessionId,
        type: 'notes',
        title: `What is ${topic}?`,
        content: {
          sections: [
            {
              heading: `Introduction to ${topic}`,
              explanation: `${topic} is a core technical domain concept essential for modern software engineering and architecture.`
            },
            {
              heading: `Why use ${topic}?`,
              explanation: `Implementing ${topic} ensures separation of concerns, improves maintainability, and provides scalability.`
            }
          ]
        }
      }];
    }
    if (type === 'code') {
      return [{
        sessionId,
        type: 'code',
        title: `${topic} Implementation Example`,
        content: {
          language: 'javascript',
          code: `// ${topic} Production Snippet\nfunction execute${topic.replace(/[^a-zA-Z0-9]/g, '')}() {\n  console.log("Running ${topic} workflow...");\n  return { status: "active", timestamp: Date.now() };\n}`,
          explanation: `Demonstrates initialization and execution of ${topic} with standard error handling.`
        }
      }];
    }
    if (type === 'mcqs') {
      return [
        {
          sessionId,
          type: 'mcq',
          title: `${topic} MCQ #1`,
          content: {
            question: `What is the primary advantage of utilizing ${topic}?`,
            options: ['Improves scalability & maintainability', 'Increases code duplication', 'Disables memory management', 'Eliminates security protocols'],
            correctAnswer: 0,
            explanation: `${topic} promotes modular code design, making systems easier to scale and maintain.`
          }
        }
      ];
    }
    if (type === 'flashcards') {
      return [
        {
          sessionId,
          type: 'flashcard',
          title: `${topic} Flashcard`,
          content: {
            front: `What is ${topic}?`,
            back: `A foundational mechanism designed to solve complex system interactions cleanly.`
          }
        }
      ];
    }
    if (type === 'viva') {
      return [
        {
          sessionId,
          type: 'viva',
          title: `${topic} Viva Question`,
          content: {
            question: `How would you explain ${topic} in a senior tech interview?`,
            answer: `Start with a 1-sentence summary, explain the underlying mechanism, detail trade-offs, and cite a real-world scenario.`
          }
        }
      ];
    }
    return [];
  };

  const hasGeneratedType = (typeKey) => {
    if (typeKey === 'mcqs') return materials.some(m => m.type === 'mcq');
    if (typeKey === 'flashcards') return materials.some(m => m.type === 'flashcard');
    return materials.some(m => m.type === typeKey);
  };

  // Filtered material lists for viewer tabs
  const activeRoadmap = materials.find(m => m.type === 'roadmap')?.content?.steps || [];
  const activeNotes = materials.filter(m => m.type === 'notes');
  const activeCode = materials.find(m => m.type === 'code')?.content;
  const activeMCQs = materials.filter(m => m.type === 'mcq');
  const activeFlashcards = materials.filter(m => m.type === 'flashcard');
  const activeViva = materials.filter(m => m.type === 'viva');

  return (
    <div className="min-h-screen bg-gray-50/70 text-zinc-900 font-body pb-20">
      
      {/* Top Studio Header Workspace Navigation */}
      <div className="bg-white/90 border-b border-gray-200 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 rounded-full bg-gray-100 text-zinc-700 hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-1.5 text-xs font-bold border border-gray-200 cursor-pointer"
              title="Back to Landing Page"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="h-5 w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToHome}>
              <span className="font-heading text-lg sm:text-xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-1.5">
                StudyGen <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Studio
              </span>
            </div>
          </div>

          {session && (
            <button
              onClick={() => setSession(null)}
              className="px-4 py-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border border-zinc-800"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Session</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* STEP 1: CREATE STUDY SESSION FORM (Clean Soft Human UI) */}
        {!session && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Sidebar Panel: Quick Presets & Token Info */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Token & Credit Card */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Studio Credits</span>
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    UNLIMITED TIER
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-heading text-3xl font-extrabold text-zinc-900">⚡ 100</span>
                  <span className="text-xs text-zinc-500 font-medium">Tokens / Session</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Generate study materials individually on-demand without wasting token balance.
                </p>
              </div>

              {/* Quick Topic Preset Selector */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-zinc-900" />
                  <span>Popular Topic Presets</span>
                </h3>
                <div className="space-y-2">
                  {[
                    { title: 'JWT Authentication', tag: 'Web Security', level: 'Intermediate' },
                    { title: 'React Custom Hooks', tag: 'Frontend', level: 'Beginner' },
                    { title: 'Docker & Microservices', tag: 'DevOps', level: 'Advanced' },
                    { title: 'System Design Patterns', tag: 'Architecture', level: 'Advanced' },
                    { title: 'SQL vs NoSQL Databases', tag: 'Backend', level: 'Intermediate' },
                  ].map((preset) => (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() => {
                        setTopicInput(preset.title);
                        setDifficulty(preset.level);
                      }}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                        topicInput === preset.title
                          ? 'bg-zinc-900 border-zinc-900 text-white'
                          : 'bg-gray-50/80 border-gray-200/80 text-zinc-700 hover:border-zinc-400 hover:bg-gray-100'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold transition-colors">{preset.title}</div>
                        <div className={`text-[10px] ${topicInput === preset.title ? 'text-zinc-300' : 'text-zinc-400'}`}>
                          {preset.tag} • {preset.level}
                        </div>
                      </div>
                      {topicInput === preset.title && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Modules Included Card */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Supported Study Modules
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: 'Notes', icon: BookOpen, color: 'text-blue-600' },
                    { label: 'Code Snippets', icon: Code2, color: 'text-emerald-600' },
                    { label: 'MCQ Quiz', icon: HelpCircle, color: 'text-purple-600' },
                    { label: 'Flashcards', icon: Layers, color: 'text-amber-600' },
                    { label: 'Viva Q&A', icon: MessageSquare, color: 'text-cyan-600' },
                    { label: 'Roadmap', icon: Zap, color: 'text-zinc-900' },
                  ].map((mod) => {
                    const Icon = mod.icon;
                    return (
                      <div key={mod.label} className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200/70">
                        <Icon className={`w-3.5 h-3.5 ${mod.color}`} />
                        <span className="text-zinc-700 font-semibold text-[11px]">{mod.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Main Panel: Studio Session Creator Wizard */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs relative">
              
              {/* Header Title */}
              <div className="mb-8">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Interactive Studio Wizard</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Ready to Generate</span>
                  </div>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-zinc-900">
                  Create a New Study Session
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Configure your learning target below. Our AI engine generates custom notes, quizzes, code, and flashcards instantly.
                </p>
              </div>

              <form onSubmit={handleCreateSession} className="space-y-6">
                
                {/* Topic / Concept Input */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Topic / Concept Name</span>
                    <span className="text-[10px] text-zinc-400 normal-case font-normal">Required field</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      placeholder="e.g. JWT Authentication, React Hooks, Data Structures"
                      className="w-full px-5 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl text-zinc-900 placeholder:text-zinc-400 text-sm font-semibold focus:outline-none focus:bg-white focus:border-zinc-400 transition-all cursor-text"
                      required
                    />
                    {topicInput && (
                      <button
                        type="button"
                        onClick={() => setTopicInput('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700 px-2.5 py-1 rounded-full bg-gray-200/80 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Difficulty Level Segmented Pill Selector */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Select Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-100/80 border border-gray-200/80 rounded-full">
                    {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setDifficulty(lvl)}
                        className={`py-2.5 px-3 rounded-full text-xs font-bold transition-all text-center cursor-pointer ${
                          difficulty === lvl
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-gray-200/60'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Learning Goal Segmented Selector */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Primary Learning Goal
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'Interview Preparation', label: 'Interview Prep', desc: 'Focus on coding & viva' },
                      { id: 'Exam Revision', label: 'Exam Revision', desc: 'Key notes & MCQs' },
                      { id: 'Understanding', label: 'Deep Concept', desc: 'Step-by-step roadmap' },
                      { id: 'Viva Preparation', label: 'Viva Questions', desc: 'Oral Q&A & theory' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setGoal(item.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          goal === item.id
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                            : 'bg-gray-50/80 border-gray-200/80 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                        }`}
                      >
                        <div className="text-xs font-bold mb-0.5">{item.label}</div>
                        <div className={`text-[10px] leading-tight ${goal === item.id ? 'text-zinc-300' : 'text-zinc-400'}`}>{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={creatingSession}
                    className="w-full py-4 rounded-full text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer border border-zinc-800"
                  >
                    {creatingSession ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Creating Your AI Study Studio...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>Launch Study Session Workspace</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* STEP 2: ACTIVE SESSION DASHBOARD & ON-DEMAND GENERATION */}
        {session && (
          <div className="space-y-8">
            
            {/* Session Info Banner */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  <span>LEVEL: {session.difficulty}</span>
                  <span>•</span>
                  <span>GOAL: {session.learningGoal}</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-zinc-900">
                  {session.topic}
                </h2>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 self-start md:self-auto font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Session Active & Ready</span>
              </div>
            </div>

            {/* On-Demand Material Action Dashboard Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <span>Generate Study Materials On-Demand</span>
                </h3>
                <span className="text-xs text-zinc-500 hidden sm:inline">
                  ⚡ Only generate what you need
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                {[
                  { key: 'roadmap', label: 'Roadmap', icon: Zap, color: 'border-amber-200 bg-amber-50/60' },
                  { key: 'notes', label: 'Notes', icon: BookOpen, color: 'border-blue-200 bg-blue-50/60' },
                  { key: 'code', label: 'Code', icon: Code2, color: 'border-emerald-200 bg-emerald-50/60' },
                  { key: 'mcqs', label: 'MCQs', icon: HelpCircle, color: 'border-purple-200 bg-purple-50/60' },
                  { key: 'flashcards', label: 'Flashcards', icon: Layers, color: 'border-rose-200 bg-rose-50/60' },
                  { key: 'viva', label: 'Viva', icon: MessageSquare, color: 'border-cyan-200 bg-cyan-50/60' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isDone = hasGeneratedType(item.key);
                  const isLoading = generatingTypes[item.key];

                  return (
                    <div
                      key={item.key}
                      className={`p-4 rounded-2xl border ${item.color} flex flex-col justify-between transition-all shadow-xs`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-xl bg-white border border-gray-200 text-zinc-900">
                          <Icon className="w-4 h-4" />
                        </div>
                        {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-zinc-900 mb-0.5">{item.label}</h4>
                        <span className="text-[10px] text-zinc-500 font-medium">
                          {isDone ? 'Generated' : 'Not generated'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleGenerateMaterial(item.key)}
                        disabled={isLoading}
                        className={`w-full py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isDone
                            ? 'bg-gray-100 text-zinc-700 hover:bg-zinc-900 hover:text-white border border-gray-200'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs'
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{isDone ? 'Regenerate' : `Generate ${item.label}`}</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: WORKSPACE VIEWER TABS */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
              
              {/* Navigation Module Tabs */}
              <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex items-center gap-2 overflow-x-auto">
                {[
                  { id: 'notes', label: 'Notes', count: activeNotes.length },
                  { id: 'roadmap', label: 'Roadmap', count: activeRoadmap.length > 0 ? 1 : 0 },
                  { id: 'code', label: 'Code', count: activeCode ? 1 : 0 },
                  { id: 'mcqs', label: 'MCQs', count: activeMCQs.length },
                  { id: 'flashcards', label: 'Flashcards', count: activeFlashcards.length },
                  { id: 'viva', label: 'Viva', count: activeViva.length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-gray-200/60'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-zinc-900 font-bold border border-gray-200">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT PANEL */}
              <div className="p-6 bg-white min-h-[380px]">

                {/* TAB: Roadmap */}
                {activeTab === 'roadmap' && (
                  <div>
                    {activeRoadmap.length === 0 ? (
                      <div className="text-center py-12">
                        <Zap className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
                        <p className="text-sm text-zinc-500 mb-4">Roadmap has not been generated yet for this session.</p>
                        <button
                          onClick={() => handleGenerateMaterial('roadmap')}
                          disabled={generatingTypes.roadmap}
                          className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 inline-flex items-center gap-1.5 shadow-xs"
                        >
                          {generatingTypes.roadmap ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>Generate Roadmap Now</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 max-w-3xl">
                        <h4 className="text-sm font-bold text-zinc-900 mb-4">Structured Roadmap Steps</h4>
                        {activeRoadmap.map((step, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-zinc-800 text-sm font-semibold flex items-center justify-between">
                            <span>{step}</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: Notes */}
                {activeTab === 'notes' && (
                  <div>
                    {activeNotes.length === 0 ? (
                      <div className="text-center py-12">
                        <BookOpen className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
                        <p className="text-sm text-zinc-500 mb-4">Notes have not been generated yet for this session.</p>
                        <button
                          onClick={() => handleGenerateMaterial('notes')}
                          disabled={generatingTypes.notes}
                          className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 inline-flex items-center gap-1.5 shadow-xs"
                        >
                          {generatingTypes.notes ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>Generate Notes Now</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeNotes.map((mat, idx) => {
                          const sections = Array.isArray(mat.content?.sections) ? mat.content.sections : null;
                          if (sections) {
                            return sections.map((sec, sIdx) => (
                              <div key={`${idx}_${sIdx}`} className="p-5 bg-gray-50 rounded-2xl border border-gray-200/80">
                                <h4 className="font-heading text-base font-bold text-zinc-900 mb-2">{sec.heading}</h4>
                                <FormattedContent content={sec.explanation} />
                              </div>
                            ));
                          }
                          return (
                            <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-200/80">
                              <h4 className="font-heading text-base font-bold text-zinc-900 mb-2">{mat.title}</h4>
                              <FormattedContent content={typeof mat.content === 'string' ? mat.content : (mat.content?.explanation || JSON.stringify(mat.content))} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: Code */}
                {activeTab === 'code' && (
                  <div>
                    {!activeCode ? (
                      <div className="text-center py-12">
                        <Code2 className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
                        <p className="text-sm text-zinc-500 mb-4">Code example has not been generated yet for this session.</p>
                        <button
                          onClick={() => handleGenerateMaterial('code')}
                          disabled={generatingTypes.code}
                          className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 inline-flex items-center gap-1.5 shadow-xs"
                        >
                          {generatingTypes.code ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>Generate Code Now</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FormattedContent
                          content={`\`\`\`${activeCode?.language || 'javascript'}\n${activeCode?.code || activeCode}\n\`\`\``}
                        />
                        {activeCode?.explanation && (
                          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs sm:text-sm text-zinc-700">
                            <strong className="text-zinc-900 block mb-1">Explanation:</strong>
                            <FormattedContent content={activeCode.explanation} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: MCQs */}
                {activeTab === 'mcqs' && (
                  <div>
                    {activeMCQs.length === 0 ? (
                      <div className="text-center py-12">
                        <HelpCircle className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
                        <p className="text-sm text-zinc-500 mb-4">MCQs have not been generated yet for this session.</p>
                        <button
                          onClick={() => handleGenerateMaterial('mcqs')}
                          disabled={generatingTypes.mcqs}
                          className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 inline-flex items-center gap-1.5 shadow-xs"
                        >
                          {generatingTypes.mcqs ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>Generate MCQs Now</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6 max-w-3xl">
                        {activeMCQs.map((item, idx) => {
                          const qData = item.content || item;
                          const question = qData.question || item.title;
                          const options = qData.options || [];
                          const targetCorrect = qData.correctAnswer ?? qData.correct ?? 0;
                          const explanation = qData.explanation || '';

                          return (
                            <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
                              <h4 className="text-sm font-bold text-zinc-900 mb-4">
                                Q{idx + 1}. {question}
                              </h4>

                              <div className="space-y-2 mb-4">
                                {options.map((opt, oIdx) => {
                                  const isSelected = selectedAnswers[idx] === oIdx;
                                  const isCorrect = oIdx === targetCorrect;
                                  let btnStyle = 'bg-white text-zinc-700 border-gray-200 hover:bg-gray-100';

                                  if (isSelected) {
                                    btnStyle = isCorrect
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-500 font-bold'
                                      : 'bg-rose-50 text-rose-800 border-rose-500 font-bold';
                                  }

                                  return (
                                    <button
                                      key={oIdx}
                                      onClick={() => setSelectedAnswers(prev => ({ ...prev, [idx]: oIdx }))}
                                      className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm text-left font-semibold flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                                    >
                                      <span>{opt}</span>
                                      {isSelected && (
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white shadow-xs">
                                          {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              {selectedAnswers[idx] !== undefined && explanation && (
                                <div className="p-3 bg-white rounded-xl text-xs text-zinc-700 border border-gray-200">
                                  <strong className="text-zinc-900 block mb-1">Explanation:</strong>
                                  <FormattedContent content={explanation} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: Flashcards */}
                {activeTab === 'flashcards' && (
                  <div>
                    {activeFlashcards.length === 0 ? (
                      <div className="text-center py-12">
                        <Layers className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
                        <p className="text-sm text-zinc-500 mb-4">Flashcards have not been generated yet for this session.</p>
                        <button
                          onClick={() => handleGenerateMaterial('flashcards')}
                          disabled={generatingTypes.flashcards}
                          className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          {generatingTypes.flashcards ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>Generate Flashcards Now</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {activeFlashcards.map((item, idx) => {
                          const card = item.content || item;
                          const isFlipped = flippedCards[idx];
                          return (
                            <div
                              key={idx}
                              onClick={() => setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }))}
                              className="cursor-pointer p-6 min-h-[180px] bg-gray-50 rounded-2xl border border-gray-200/90 hover:border-zinc-400 flex flex-col justify-between transition-all shadow-xs group"
                            >
                              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-400">
                                <span>{isFlipped ? 'Answer' : 'Question'}</span>
                                <span className="text-zinc-900 group-hover:underline">Click to Flip 🔄</span>
                              </div>

                              <p className={`text-sm font-bold leading-relaxed ${isFlipped ? 'text-emerald-700 font-semibold text-xs' : 'text-zinc-900'}`}>
                                {isFlipped ? (card.back || card.answer) : (card.front || card.question || item.title)}
                              </p>

                              <div className="text-[10px] text-zinc-400 font-mono">
                                Card {idx + 1} of {activeFlashcards.length}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: Viva */}
                {activeTab === 'viva' && (
                  <div>
                    {activeViva.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
                        <p className="text-sm text-zinc-500 mb-4">Viva questions have not been generated yet for this session.</p>
                        <button
                          onClick={() => handleGenerateMaterial('viva')}
                          disabled={generatingTypes.viva}
                          className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          {generatingTypes.viva ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>Generate Viva Questions Now</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 max-w-3xl">
                        {activeViva.map((item, idx) => {
                          const viva = item.content || item;
                          const question = viva.question || viva.q || item.title;
                          const answer = viva.answer || viva.a || '';
                          const isExpanded = expandedViva[idx];

                          return (
                            <div key={idx} className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                              <button
                                onClick={() => setExpandedViva(prev => ({ ...prev, [idx]: !prev[idx] }))}
                                className="w-full p-4 text-left text-sm font-bold text-zinc-900 flex items-center justify-between hover:bg-gray-100 cursor-pointer"
                              >
                                <span>Q{idx + 1}: {question}</span>
                                {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-900" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                              </button>

                              {isExpanded && (
                                <div className="p-4 bg-white border-t border-gray-200 text-xs sm:text-sm text-zinc-700">
                                  <span className="font-bold text-emerald-700 block mb-2">Model Answer:</span>
                                  <FormattedContent content={answer} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
