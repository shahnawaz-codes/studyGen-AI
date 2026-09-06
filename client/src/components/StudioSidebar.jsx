import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
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
  Trash2,
  Menu,
  X,
  GripVertical,
  Loader2,
  Sparkle
} from 'lucide-react';

export default function StudioSidebar({ 
  onNewSession, 
  onSelectSession, 
  currentSessionId,
  onBackToHome,
  refreshKey 
}) {
  const { user, token, logout } = useAuth();
  
  // Resizable & Responsive States
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Real History API State
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'settings' | 'privacy'

  // Fetch real user history from backend API
  const fetchRealHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const data = await api.get('/study/sessions', { token });
      if (data.success && Array.isArray(data.data)) {
        setHistoryList(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user study history:', error);
    } finally {
      setLoadingHistory(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRealHistory();
  }, [fetchRealHistory, refreshKey]);

  // Delete a study session from database
  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this study session permanently?')) return;

    try {
      const data = await api.delete(`/study/sessions/${sessionId}`, { token });
      if (data.success) {
        setHistoryList(prev => prev.filter(s => s._id !== sessionId));
        if (currentSessionId === sessionId) {
          onNewSession();
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  // Drag-to-Resize Logic
  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 220 && newWidth <= 420) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  // Format relative time helper
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    if (diffSec < 60) return 'just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  };

  const filteredHistory = historyList.filter(item =>
    item.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Top Toggle Header Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 p-3 flex items-center justify-between sticky top-0 z-30">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 text-xs font-bold text-zinc-800 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full cursor-pointer transition-colors"
        >
          <Menu className="w-4 h-4" />
          <span>Study Sessions ({historyList.length})</span>
        </button>

        <button
          onClick={onNewSession}
          className="flex items-center gap-1.5 bg-zinc-900 text-white text-xs font-bold px-3 py-1.5 rounded-full"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>New Session</span>
        </button>
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-zinc-900/40 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        style={{ width: collapsed ? '68px' : `${sidebarWidth}px` }}
        className={`bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-150 z-40 ${
          mobileOpen 
            ? 'fixed inset-y-0 left-0 w-80 shadow-2xl flex' 
            : 'hidden md:flex relative min-h-screen'
        } shadow-xs select-none`}
      >
        {/* Resize Handle Bar (Desktop only) */}
        {!collapsed && (
          <div
            onMouseDown={startResizing}
            onDoubleClick={() => setSidebarWidth(280)}
            className="hidden md:flex absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-emerald-500/40 transition-colors z-50 group items-center justify-center"
            title="Drag to resize sidebar (Double click to reset)"
          >
            <div className="w-0.5 h-8 bg-gray-300 group-hover:bg-emerald-500 rounded-full transition-colors"></div>
          </div>
        )}

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3.5 top-6 bg-white border border-gray-200 text-zinc-600 hover:text-zinc-900 rounded-full p-1 shadow-sm hover:shadow transition-all cursor-pointer z-50"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Top Content Section */}
        <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none">
          
          {/* Mobile Close Button */}
          <div className="md:hidden flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="font-heading font-extrabold text-sm text-zinc-900 flex items-center gap-1.5">
              StudyGen <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Studio
            </span>
            <button 
              onClick={() => setMobileOpen(false)}
              className="p-1 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Authenticated User Profile Card */}
          <div className="flex items-center gap-3 p-2.5 bg-gray-50/80 border border-gray-200/80 rounded-2xl shadow-2xs">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-9 h-9 rounded-full border border-emerald-400 object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-xs">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-zinc-900 truncate">{user?.name || 'Scholar'}</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex-shrink-0 uppercase">Pro</span>
                </div>
                <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>

          {/* New Session Action Button */}
          <button
            onClick={() => {
              onNewSession();
              setMobileOpen(false);
            }}
            className={`flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full font-semibold transition-all cursor-pointer shadow-sm hover:shadow active:scale-95 border border-zinc-800 ${
              collapsed ? 'w-10 h-10 p-0 mx-auto' : 'w-full py-2.5 px-4 text-xs'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            {!collapsed && <span>+ New Study Session</span>}
          </button>

          {/* Real History Search Bar */}
          {!collapsed && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50/80 border border-gray-200 rounded-full text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400 transition-all shadow-2xs"
              />
            </div>
          )}

          {/* Real History Sessions List */}
          {!collapsed && (
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  Your Real Study History ({historyList.length})
                </span>
              </div>

              {loadingHistory ? (
                <div className="p-4 text-center space-y-2">
                  <Loader2 className="w-4 h-4 text-zinc-400 animate-spin mx-auto" />
                  <p className="text-[11px] text-zinc-400">Loading your history...</p>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="p-4 text-center bg-gray-50/60 rounded-2xl border border-dashed border-gray-200 space-y-1">
                  <Sparkle className="w-4 h-4 text-zinc-400 mx-auto" />
                  <p className="text-xs font-bold text-zinc-700">No study sessions found</p>
                  <p className="text-[11px] text-zinc-400">Create your first topic session above to build your study history!</p>
                </div>
              ) : (
                filteredHistory.map((item) => {
                  const isActive = currentSessionId === item._id;

                  return (
                    <div
                      key={item._id}
                      onClick={() => {
                        onSelectSession(item);
                        setMobileOpen(false);
                      }}
                      className={`group relative flex items-center justify-between p-2.5 rounded-2xl cursor-pointer border transition-all ${
                        isActive 
                          ? 'bg-emerald-50/90 border-emerald-300 text-zinc-900 shadow-2xs' 
                          : 'bg-white hover:bg-gray-50/80 border-gray-100 hover:border-gray-200 text-zinc-700'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1 pr-2">
                        <BookOpen className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isActive ? 'text-emerald-600' : 'text-zinc-400 group-hover:text-zinc-700'}`} />
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate leading-tight">{item.topic}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-zinc-400">{formatTimeAgo(item.createdAt)}</span>
                            {item.difficulty && (
                              <span className="text-[9px] font-extrabold text-zinc-500 bg-gray-100 px-1.5 py-0.2 rounded-full uppercase">
                                {item.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Delete Session Button */}
                      <button
                        onClick={(e) => handleDeleteSession(e, item._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer flex-shrink-0"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>

        {/* Bottom Menu Navigation */}
        <div className="p-3.5 border-t border-gray-100 flex flex-col gap-1 bg-gray-50/50">
          
          <button
            onClick={() => setActiveModal('settings')}
            className={`flex items-center gap-2.5 text-xs font-bold text-zinc-700 hover:text-zinc-900 hover:bg-gray-100/80 rounded-xl p-2 transition-all cursor-pointer ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <Settings className="w-4 h-4 text-zinc-500" />
            {!collapsed && <span>Settings & Preferences</span>}
          </button>

          <button
            onClick={() => setActiveModal('privacy')}
            className={`flex items-center gap-2.5 text-xs font-bold text-zinc-700 hover:text-zinc-900 hover:bg-gray-100/80 rounded-xl p-2 transition-all cursor-pointer ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {!collapsed && <span>Privacy & Security</span>}
          </button>

          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className={`flex items-center gap-2.5 text-xs font-bold text-zinc-700 hover:text-zinc-900 hover:bg-gray-100/80 rounded-xl p-2 transition-all cursor-pointer ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <Home className="w-4 h-4 text-zinc-500" />
              {!collapsed && <span>Back to Home</span>}
            </button>
          )}

          <button
            onClick={logout}
            className={`flex items-center gap-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl p-2 transition-all cursor-pointer mt-0.5 ${
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
                <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-zinc-900 font-medium focus:outline-none focus:bg-white">
                  <option>Gemini 3.6 Flash (Recommended)</option>
                  <option>Gemini Pro 1.5 (Deep Reasoning)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Default Material Preferences</label>
                <div className="space-y-1.5 text-zinc-600">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded accent-zinc-900" />
                    <span>Generate Notes & Key Concepts</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded accent-zinc-900" />
                    <span>Include Code Examples & Snippets</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded accent-zinc-900" />
                    <span>Generate Interactive MCQs & Flashcards</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-zinc-900 text-white rounded-full font-bold text-xs hover:bg-zinc-800 transition-all cursor-pointer"
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
                <span>Privacy & Data Security</span>
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
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">OAuth 2.0 Authenticated Session</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Your study history is associated with your Google account. Passwords are never handled or stored on StudyGen AI servers.</p>
                </div>
              </div>
              <p>• Your sessions are privately scoped to your user ID.</p>
              <p>• You can delete any session permanently from your history sidebar at any time.</p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-zinc-900 text-white rounded-full font-bold text-xs hover:bg-zinc-800 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
