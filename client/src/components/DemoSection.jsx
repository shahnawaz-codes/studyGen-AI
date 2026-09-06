import React, { useState } from 'react';
import FormattedContent from './FormattedContent';
import api from '../services/api';
import { defaultMockStudyData } from '../data/mockStudyData';
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
  Zap 
} from 'lucide-react';

export default function DemoSection({ currentTopic = 'JWT Authentication' }) {
  const [topic, setTopic] = useState(currentTopic);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [goal, setGoal] = useState('Interview Preparation');
  const [activeTab, setActiveTab] = useState('notes');
  const [isGenerating, setIsGenerating] = useState(false);

  const [liveMaterials, setLiveMaterials] = useState(null);

  const handleGenerate = async (customTopic) => {
    const targetTopic = customTopic || topic;
    setIsGenerating(true);
    try {
      const resData = await api.post('/study/sessions', {
        topic: targetTopic,
        difficulty: difficulty,
        learningGoal: goal,
      });

      if (resData.success && resData.data) {
        const sessionId = resData.data._id;
        const matRes = await api.post(`/study/sessions/${sessionId}/${activeTab}`);
        if (matRes.success && matRes.data) {
          setLiveMaterials(Array.isArray(matRes.data) ? matRes.data : [matRes.data]);
        }
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
        roadmap: roadmapMat?.content?.steps || [],
        notes: notesMats,
        mcqs: mcqMats,
        flashcards: flashcardMats,
        viva: vivaMats,
        code: codeMat
      };
    }

    const mock = defaultMockStudyData[topic] || defaultMockStudyData['JWT Authentication'];
    return {
      roadmap: mock.roadmap,
      notes: mock.notes.map((n, i) => ({ _id: i, heading: n.heading, explanation: n.content })),
      mcqs: mock.mcqs.map((m, i) => ({ _id: i, question: m.question, options: m.options, correctAnswer: m.correct, explanation: m.explanation })),
      flashcards: mock.flashcards.map((f, i) => ({ _id: i, front: f.front, back: f.back })),
      viva: mock.viva.map((v, i) => ({ _id: i, question: v.question, answer: v.answer })),
      code: mock.code
    };
  };

  const currentData = deriveCurrentData();

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
                  setLiveMaterials(null);
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
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

            {/* TAB CONTENTS USING REUSABLE MATERIAL COMPONENTS */}
            <div className="bg-white p-6 rounded-2xl">
              {activeTab === 'roadmap' && <RoadmapViewer steps={currentData.roadmap} />}
              {activeTab === 'notes' && <NotesViewer notes={currentData.notes} />}
              {activeTab === 'mcqs' && <McqList mcqs={currentData.mcqs} />}
              {activeTab === 'flashcards' && <FlashcardGrid flashcards={currentData.flashcards} />}
              {activeTab === 'viva' && <VivaAccordion vivaItems={currentData.viva} />}
              {activeTab === 'code' && <CodeBlockViewer codeData={currentData.code} />}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
