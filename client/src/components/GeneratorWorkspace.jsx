import React, { useState } from 'react';
import StudioSidebar from './StudioSidebar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { createFallbackMaterialForTopic } from '../data/mockStudyData';
import RoadmapViewer from './materials/RoadmapViewer';
import NotesViewer from './materials/NotesViewer';
import McqList from './materials/McqList';
import FlashcardGrid from './materials/FlashcardGrid';
import VivaAccordion from './materials/VivaAccordion';
import CodeBlockViewer from './materials/CodeBlockViewer';
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
      const resData = await api.get(`/study/sessions/${item._id}`, { token });
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
    setMaterials(createFallbackMaterialForTopic(item.topic, 'notes', item._id));
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
      const resData = await api.post('/study/sessions', {
        topic: topicInput,
        difficulty: difficulty,
        learningGoal: goal,
      }, { token });

      if (resData.success && resData.data) {
        setSession(resData.data);
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
      const resData = await api.post(`/study/sessions/${session._id}/${type}`, {}, { token });
      if (resData.success && resData.data) {
        const newItems = Array.isArray(resData.data) ? resData.data : [resData.data];
        setMaterials(prev => [...prev.filter(m => m.type !== type), ...newItems]);
        setActiveTab(type === 'mcqs' ? 'mcqs' : type === 'flashcards' ? 'flashcards' : type);
      }
    } catch (error) {
      console.log(`Backend connection notice for ${type} (using client fallback):`, error.message);
      const mockMaterial = createFallbackMaterialForTopic(session.topic, type === 'mcqs' ? 'mcq' : type === 'flashcards' ? 'flashcard' : type, session._id);
      setMaterials(prev => [...prev.filter(m => m.type !== type), ...mockMaterial]);
      setActiveTab(type === 'mcqs' ? 'mcqs' : type === 'flashcards' ? 'flashcards' : type);
    } finally {
      setGeneratingTypes(prev => ({ ...prev, [type]: false }));
    }
  };

  // Helper checks for generated components
  const hasGeneratedType = (typeKey) => {
    const singleType = typeKey === 'mcqs' ? 'mcq' : typeKey === 'flashcards' ? 'flashcard' : typeKey;
    return materials.some(m => m.type === singleType);
  };

  // Filter materials for active tabs
  const activeRoadmapMat = materials.find(m => m.type === 'roadmap');
  const activeRoadmap = activeRoadmapMat?.content?.steps || [];
  
  const activeNotes = materials.filter(m => m.type === 'notes');
  const activeMCQs = materials.filter(m => m.type === 'mcq');
  const activeFlashcards = materials.filter(m => m.type === 'flashcard');
  const activeViva = materials.filter(m => m.type === 'viva');
  const activeCode = materials.find(m => m.type === 'code');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-body antialiased selection:bg-zinc-900 selection:text-white">
      
      {/* Sidebar Component */}
      <StudioSidebar 
        onNewSession={handleResetSession} 
        onSelectSession={handleSelectSession}
        currentSessionId={session?._id}
        onBackToHome={onBackToHome}
        refreshKey={refreshHistoryKey}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-gray-50/50">
        
        {/* Top Header Controls */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 text-zinc-600 hover:text-zinc-900 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
              title="Back to Landing Page"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-heading text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Study Workspace Studio
              </h1>
              <p className="text-xs text-zinc-500">Generate on-demand, interactive AI study materials</p>
            </div>
          </div>

          <button
            onClick={handleResetSession}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Session</span>
          </button>
        </div>

        {/* Workspace Body */}
        <div className="p-6 max-w-6xl mx-auto w-full space-y-8">

          {/* Session Setup Form */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">
            <form onSubmit={handleCreateSession} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                  Topic or Subject
                </label>
                <input 
                  type="text" 
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g. JWT Authentication, Relational Databases, Operating Systems..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                    Difficulty Level
                  </label>
                  <select 
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                    Learning Goal
                  </label>
                  <select 
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                  >
                    <option value="Interview Preparation">Interview Preparation</option>
                    <option value="Exam Revision">Exam Revision</option>
                    <option value="Deep Conceptual Understanding">Deep Conceptual Understanding</option>
                    <option value="Viva / Quiz Practice">Viva / Quiz Practice</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={creatingSession || !topicInput.trim()}
                className="w-full py-3 px-6 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                {activeTab === 'notes' && <NotesViewer notes={activeNotes} />}
                {activeTab === 'roadmap' && <RoadmapViewer steps={activeRoadmap} />}
                {activeTab === 'code' && <CodeBlockViewer codeData={activeCode} />}
                {activeTab === 'mcqs' && <McqList mcqs={activeMCQs} />}
                {activeTab === 'flashcards' && <FlashcardGrid flashcards={activeFlashcards} />}
                {activeTab === 'viva' && <VivaAccordion vivaItems={activeViva} />}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
