import React, { useState } from 'react';
import FormattedContent from './FormattedContent';
import StudioSidebar from './StudioSidebar';
import { useAuth } from '../context/AuthContext';
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
  const { token } = useAuth();
  const [topicInput, setTopicInput] = useState('JWT Authentication');

  const [difficulty, setDifficulty] = useState('Intermediate');
  const [goal, setGoal] = useState('Interview Preparation');
  
  // Session & generated materials state
  const [session, setSession] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [refreshHistoryKey, setRefreshHistoryKey] = useState(0);
  
  // Loading states per content type
  const [creatingSession, setCreatingSession] = useState(false);
  const [generatingTypes, setGeneratingTypes] = useState({});

  // Active viewing tab
  const [activeTab, setActiveTab] = useState('notes');

  // Interactive component states
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flippedCards, setFlippedCards] = useState({});
  const [expandedViva, setExpandedViva] = useState({ 0: true });

  // Reset workspace to create a fresh study session
  const handleResetSession = () => {
    setSession(null);
    setMaterials([]);
    setTopicInput('');
  };

  // Load a real session selected from sidebar history
  const handleSelectSession = async (item) => {
    setTopicInput(item.topic);
    if (item.difficulty) {
      setDifficulty(item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1));
    }

    try {
      // Fetch full session details & generated materials from database
      const response = await fetch(`http://localhost:5000/api/study/sessions/${item._id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setSession(resData.data.session);
        const loadedMaterials = resData.data.materials || [];
        setMaterials(loadedMaterials);
        if (loadedMaterials.length > 0) {
          const firstType = loadedMaterials[0].type;
          setActiveTab(firstType === 'mcq' ? 'mcqs' : firstType === 'flashcard' ? 'flashcards' : firstType);
        } else {
          setActiveTab('notes');
        }
        return;
      }
    } catch (error) {
      console.log('Fetching session notice (using local state fallback):', error.message);
    }

    // Fallback if network offline
    setSession(item);
    setMaterials(createMockMaterialForType(item.topic, 'notes', item._id));
    setActiveTab('notes');
  };

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
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          topic: topicInput,
          difficulty: difficulty,
          learningGoal: goal,
        })
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setSession(resData.data);
        // Refresh sidebar history in real time
        setRefreshHistoryKey(prev => prev + 1);
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
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        const newItems = Array.isArray(resData.data) ? resData.data : [resData.data];
        setMaterials(prev => [...prev.filter(m => m.type !== type), ...newItems]);
        setActiveTab(type === 'mcqs' ? 'mcqs' : type === 'flashcards' ? 'flashcards' : type);
      }
    } catch (error) {
      console.log(`Backend connection notice for ${type} (using client fallback):`, error.message);
      const mockMaterial = createMockMaterialForType(session.topic, type, session._id);
      setMaterials(prev => [...prev.filter(m => m.type !== type), ...mockMaterial]);
      setActiveTab(type === 'mcqs' ? 'mcqs' : type === 'flashcards' ? 'flashcards' : type);
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
          content: {
            question: `What is the primary purpose of ${topic}?`,
            options: [
              `To manage asynchronous requests efficiently`,
              `To ensure decoupled architecture and security`,
              `To format JSON strings in database queries`,
              `To compile client assets into bundle files`
            ],
            correctAnswer: 1,
            explanation: `${topic} focuses on secure, decoupled, and standard software execution.`
          }
        }
      ];
    }
    if (type === 'flashcards') {
      return [
        {
          sessionId,
          type: 'flashcard',
          content: {
            front: `Key Benefit of ${topic}`,
            back: `Provides structured learning, improved modularity, and reproducible code logic.`
          }
        }
      ];
    }
    if (type === 'viva') {
      return [
        {
          sessionId,
          type: 'viva',
          content: {
            question: `How would you explain ${topic} in a technical interview?`,
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
    <div className="flex min-h-screen bg-gray-50/70 text-zinc-900 font-body">
      
      {/* Studio Resizable & Responsive Left Sidebar */}
      <StudioSidebar 
        onNewSession={handleResetSession}
        onSelectSession={handleSelectSession}
        currentSessionId={session?._id}
        onBackToHome={onBackToHome}
        refreshKey={refreshHistoryKey}
      />

      {/* Main Studio Workspace Body */}
      <div className="flex-1 min-w-0 flex flex-col pb-20 overflow-y-auto">
        
        {/* Top Studio Header Navigation */}
        <div className="bg-white/90 border-b border-gray-200 sticky top-0 z-20 backdrop-blur-md">
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
              <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span className="text-xs font-bold text-emerald-900">Active Topic: {session.topic}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
          
          {/* Creator Configuration Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-extrabold text-zinc-900">AI Study Material Creator</h2>
                <p className="text-xs text-zinc-500">Configure your topic and target goals to generate notes, roadmaps, and quizzes.</p>
              </div>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-6">
              
              {/* Topic Input */}
              <div>
                <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                  Topic Title
                </label>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="Enter any topic (e.g. System Design, React Query, OS Scheduling)"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900 transition-all shadow-2xs"
                />
              </div>

              {/* Difficulty & Goal selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                    Difficulty Level
                  </label>
                  <div className="flex rounded-full bg-gray-100 p-1 border border-gray-200">
                    {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setDifficulty(lvl)}
                        className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                          difficulty === lvl
                            ? 'bg-zinc-900 text-white shadow-2xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                    Learning Goal
                  </label>
                  <div className="flex rounded-full bg-gray-100 p-1 border border-gray-200">
                    {['Interview Prep', 'Exam Revision', 'Deep Dive'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGoal(g)}
                        className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                          goal === g
                            ? 'bg-zinc-900 text-white shadow-2xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={creatingSession || !topicInput.trim()}
                className="w-full py-4 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 border border-zinc-800 active:scale-98"
              >
                {creatingSession ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                    <span>Initializing Study Session...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>{session ? 'Update Session & Topic' : 'Initialize Study Session'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Module Action Pills Generator */}
          {session && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs mb-8">
              <h3 className="font-heading text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                Generate Study Components
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { key: 'roadmap', label: 'Roadmap', icon: Layers },
                  { key: 'notes', label: 'Study Notes', icon: BookOpen },
                  { key: 'code', label: 'Code Snippet', icon: Code2 },
                  { key: 'mcqs', label: 'MCQs Quiz', icon: HelpCircle },
                  { key: 'flashcards', label: 'Flashcards', icon: Zap },
                  { key: 'viva', label: 'Viva Q&A', icon: MessageSquare }
                ].map(({ key, label, icon: Icon }) => {
                  const generated = hasGeneratedType(key);
                  const isGenerating = generatingTypes[key];

                  return (
                    <button
                      key={key}
                      onClick={() => handleGenerateMaterial(key)}
                      disabled={isGenerating}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all cursor-pointer text-center ${
                        generated 
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 font-bold shadow-2xs' 
                          : 'bg-white hover:bg-gray-50 border-gray-200 text-zinc-800 font-semibold'
                      }`}
                    >
                      {isGenerating ? (
                        <Loader2 className="w-5 h-5 animate-spin text-zinc-900 mb-1.5" />
                      ) : (
                        <Icon className={`w-5 h-5 mb-1.5 ${generated ? 'text-emerald-600' : 'text-zinc-600'}`} />
                      )}
                      <span className="text-xs">{label}</span>
                      {generated && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Generated Material Viewer Workspace */}
          {materials.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              
              {/* Workspace Viewer Navigation Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-100 pb-4 mb-6 scrollbar-none">
                {[
                  { key: 'notes', label: 'Study Notes', count: activeNotes.length },
                  { key: 'roadmap', label: 'Roadmap', count: activeRoadmap.length > 0 ? 1 : 0 },
                  { key: 'code', label: 'Code Snippets', count: activeCode ? 1 : 0 },
                  { key: 'mcqs', label: 'Interactive MCQs', count: activeMCQs.length },
                  { key: 'flashcards', label: 'Flashcards', count: activeFlashcards.length },
                  { key: 'viva', label: 'Viva Q&A', count: activeViva.length }
                ].filter(t => t.count > 0).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'bg-gray-100 text-zinc-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {/* Viewer Content Renderers */}
              <div className="space-y-6">
                
                {/* Notes Tab */}
                {activeTab === 'notes' && (
                  <div className="space-y-6">
                    {activeNotes.map((note, idx) => (
                      <div key={idx} className="space-y-3">
                        <h3 className="font-heading text-lg font-bold text-zinc-900 border-b border-gray-100 pb-2">
                          {note.title || 'Study Note'}
                        </h3>
                        <FormattedContent content={note.content} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Roadmap Tab */}
                {activeTab === 'roadmap' && (
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold text-zinc-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-emerald-600" />
                      Learning Roadmap & Path
                    </h3>
                    <div className="space-y-3">
                      {activeRoadmap.map((step, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-sm font-semibold text-zinc-800 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code Tab */}
                {activeTab === 'code' && activeCode && (
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold text-zinc-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-emerald-600" />
                      Code Snippet ({activeCode.language || 'code'})
                    </h3>
                    <pre className="bg-zinc-900 text-zinc-100 p-5 rounded-2xl overflow-x-auto text-xs font-mono leading-relaxed border border-zinc-800">
                      <code>{activeCode.code}</code>
                    </pre>
                    {activeCode.explanation && (
                      <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                        <p className="text-xs text-emerald-950 font-medium">{activeCode.explanation}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* MCQs Tab */}
                {activeTab === 'mcqs' && (
                  <div className="space-y-6">
                    <h3 className="font-heading text-lg font-bold text-zinc-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-emerald-600" />
                      Interactive Multiple Choice Questions
                    </h3>
                    {activeMCQs.map((mcq, idx) => (
                      <div key={idx} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
                        <p className="font-bold text-sm text-zinc-900">Q{idx + 1}. {mcq.content?.question}</p>
                        <div className="space-y-2">
                          {mcq.content?.options?.map((opt, optIdx) => {
                            const isSelected = selectedAnswers[idx] === optIdx;
                            const isCorrect = optIdx === mcq.content.correctAnswer;
                            const hasSubmitted = selectedAnswers[idx] !== undefined;

                            let btnStyle = 'bg-white border-gray-200 text-zinc-800 hover:bg-gray-100';
                            if (hasSubmitted) {
                              if (isCorrect) btnStyle = 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold';
                              else if (isSelected) btnStyle = 'bg-rose-100 border-rose-300 text-rose-900';
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => setSelectedAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                                className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {selectedAnswers[idx] !== undefined && (
                          <div className="p-3 bg-white border border-gray-200 rounded-xl text-xs text-zinc-700">
                            <span className="font-bold">Explanation:</span> {mcq.content?.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Flashcards Tab */}
                {activeTab === 'flashcards' && (
                  <div className="space-y-6">
                    <h3 className="font-heading text-lg font-bold text-zinc-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-emerald-600" />
                      Revision Flashcards
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeFlashcards.map((fc, idx) => {
                        const isFlipped = flippedCards[idx];
                        return (
                          <div
                            key={idx}
                            onClick={() => setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }))}
                            className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-3xl min-h-[160px] flex flex-col justify-between cursor-pointer shadow-md hover:shadow-lg transition-all"
                          >
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                              {isFlipped ? 'Answer / Back' : 'Question / Front (Click to flip)'}
                            </span>
                            <p className="text-sm font-bold leading-relaxed">
                              {isFlipped ? fc.content?.back : fc.content?.front}
                            </p>
                            <span className="text-[10px] text-zinc-400 text-right">Tap to flip 🔄</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Viva Q&A Tab */}
                {activeTab === 'viva' && (
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold text-zinc-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-emerald-600" />
                      Viva / Interview Questions
                    </h3>
                    {activeViva.map((viva, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
                        <button
                          onClick={() => setExpandedViva(prev => ({ ...prev, [idx]: !prev[idx] }))}
                          className="w-full p-4 text-left font-bold text-xs text-zinc-900 flex items-center justify-between bg-white hover:bg-gray-50 cursor-pointer"
                        >
                          <span>Q{idx + 1}. {viva.content?.question}</span>
                          {expandedViva[idx] ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                        </button>
                        {expandedViva[idx] && (
                          <div className="p-4 border-t border-gray-200 text-xs text-zinc-700 leading-relaxed bg-gray-50/50">
                            <span className="font-bold text-zinc-900 block mb-1">Model Answer:</span>
                            {viva.content?.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
