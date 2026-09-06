import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Clock, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Sparkles,
  Home,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export default function StudioSidebar({ 
  onNewSession, 
  onSelectSession, 
  currentSessionId,
  onBackToHome 
}) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'settings' | 'privacy'

  // Default Mock/Saved History List
  const [historyList, setHistoryList] = useState([
    { id: 'sess_1', topic: 'JWT Authentication', time: '2 hours ago', difficulty: 'Intermediate' },
    { id: 'sess_2', topic: 'React Custom Hooks & State', time: '1 day ago', difficulty: 'Advanced' },
    { id: 'sess_3', topic: 'Database Indexing & Normalization', time: '3 days ago', difficulty: 'Intermediate' },
    { id: 'sess_4', topic: 'Data Structures: Trees & Graphs', time: '5 days ago', difficulty: 'Beginner' },
  ]);

  const filteredHistory = historyList.filter(item =>
    item.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your study history?')) {
      setHistoryList([]);
    }
  };

  return (
    <>
      <aside 
        className={`bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 z-30 ${
          collapsed ? 'w-16' : 'w-72 md:w-80'
        } relative min-h-screen shadow-sm`}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-6 bg-white border border-gray-200 text-zinc-600 hover:text-zinc-900 rounded-full p-1 shadow-sm hover:shadow transition-all cursor-pointer z-40"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Top Section */}
        <div className="p-4 flex flex-col gap-4 overflow-y-auto">
          
          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-100 rounded-2xl">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-9 h-9 rounded-full border border-emerald-400 object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-zinc-900 truncate">{user?.name || 'Student'}</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full flex-shrink-0">PRO</span>
                </div>
                <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>

          {/* New Session Button */}
          <button
            onClick={onNewSession}
            className={`flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full font-semibold transition-all cursor-pointer shadow-sm hover:shadow ${
              collapsed ? 'w-10 h-10 p-0 mx-auto' : 'w-full py-2.5 px-4 text-xs'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            {!collapsed && <span>New Study Session</span>}
          </button>

          {/* History Search Bar */}
          {!collapsed && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400 transition-all"
              />
            </div>
          )}

          {/* History List */}
          {!collapsed && (
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  Recent Sessions
                </span>
                {historyList.length > 0 && (
                  <button 
                    onClick={handleClearHistory}
                    className="text-[10px] font-semibold text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Clear history"
                  >
                    Clear
                  </button>
                )}
              </div>

              {filteredHistory.length === 0 ? (
                <p className="text-xs text-zinc-400 italic px-2 py-3 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                  No sessions found
                </p>
              ) : (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectSession(item)}
                    className={`flex items-start justify-between p-2.5 rounded-2xl cursor-pointer border transition-all ${
                      currentSessionId === item.id 
                        ? 'bg-emerald-50/80 border-emerald-200 text-zinc-900 shadow-sm' 
                        : 'bg-white hover:bg-gray-50 border-gray-100 hover:border-gray-200 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <BookOpen className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${currentSessionId === item.id ? 'text-emerald-600' : 'text-zinc-400'}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate leading-tight">{item.topic}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Bottom Menu Actions */}
        <div className="p-4 border-t border-gray-100 flex flex-col gap-1.5 bg-gray-50/50">
          
          <button
            onClick={() => setActiveModal('settings')}
            className={`flex items-center gap-2.5 text-xs font-bold text-zinc-700 hover:text-zinc-900 hover:bg-gray-100 rounded-xl p-2 transition-all cursor-pointer ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <Settings className="w-4 h-4 text-zinc-500" />
            {!collapsed && <span>Settings & AI Model</span>}
          </button>

          <button
            onClick={() => setActiveModal('privacy')}
            className={`flex items-center gap-2.5 text-xs font-bold text-zinc-700 hover:text-zinc-900 hover:bg-gray-100 rounded-xl p-2 transition-all cursor-pointer ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {!collapsed && <span>Privacy & Security</span>}
          </button>

          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className={`flex items-center gap-2.5 text-xs font-bold text-zinc-700 hover:text-zinc-900 hover:bg-gray-100 rounded-xl p-2 transition-all cursor-pointer ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <Home className="w-4 h-4 text-zinc-500" />
              {!collapsed && <span>Back to Home</span>}
            </button>
          )}

          <button
            onClick={logout}
            className={`flex items-center gap-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl p-2 transition-all cursor-pointer mt-1 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-bold text-base text-zinc-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-zinc-700" />
                <span>Studio Settings</span>
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-zinc-400 hover:text-zinc-900 text-xs font-bold px-2 py-1 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">AI Provider Engine</label>
                <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-zinc-900 font-medium">
                  <option>Gemini 3.6 Flash (Fast & Accurate)</option>
                  <option>Gemini Pro 1.5 (Deep Reasoning)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Default Material Output</label>
                <div className="space-y-1.5 text-zinc-600">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded accent-zinc-900" />
                    <span>Include Interactive MCQs</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded accent-zinc-900" />
                    <span>Generate Flashcards</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded accent-zinc-900" />
                    <span>Include Viva Questions & Code Snippets</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-zinc-900 text-white rounded-full font-bold text-xs hover:bg-zinc-800 transition-all"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-bold text-base text-zinc-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Privacy & Security</span>
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-zinc-400 hover:text-zinc-900 text-xs font-bold px-2 py-1 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2.5 text-xs text-zinc-600">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">OAuth 2.0 Encrypted Session</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Your profile is authenticated via Google. Passwords are never stored on StudyGen AI servers.</p>
                </div>
              </div>
              <p>• Generated materials are stored securely in your private session context.</p>
              <p>• You can request complete history deletion at any time.</p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-zinc-900 text-white rounded-full font-bold text-xs hover:bg-zinc-800 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
