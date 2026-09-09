import React, { useState, useMemo } from 'react';
import { BookOpen, Copy, Check, Search, ChevronDown, ChevronUp } from 'lucide-react';
import FormattedContent from '../FormattedContent';

/**
 * Normalizes raw notes material input into flat structured sections array
 */
function normalizeNotes(notes) {
  if (!notes || !Array.isArray(notes)) return [];

  const sections = [];

  notes.forEach((noteItem, idx) => {
    let content = noteItem.content ?? noteItem;

    // Handle stringified JSON content
    if (typeof content === 'string') {
      try {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object') {
          content = parsed;
        }
      } catch (e) {
        // Keep original string if not valid JSON
      }
    }

    // Case 1: content object containing a sections array
    if (content && typeof content === 'object' && Array.isArray(content.sections)) {
      content.sections.forEach((sec, sIdx) => {
        sections.push({
          id: sec._id || `${noteItem._id || idx}-sec-${sIdx}`,
          heading: sec.heading || sec.title || `Topic #${sIdx + 1}`,
          explanation: sec.explanation || sec.content || sec.details || '',
        });
      });
    }
    // Case 2: noteItem is a section object with heading/title + explanation/content
    else if (noteItem.heading || noteItem.explanation || (typeof content === 'object' && (content.heading || content.explanation))) {
      const heading = noteItem.heading || (typeof content === 'object' ? content.heading : null) || noteItem.title || `Study Note #${idx + 1}`;
      const explanation = noteItem.explanation || (typeof content === 'object' ? content.explanation : null) || noteItem.content || '';
      sections.push({
        id: noteItem._id || idx,
        heading,
        explanation: typeof explanation === 'object' ? JSON.stringify(explanation, null, 2) : explanation,
      });
    }
    // Case 3: Simple string explanation
    else if (typeof content === 'string') {
      sections.push({
        id: noteItem._id || idx,
        heading: noteItem.title || noteItem.heading || `Study Note #${idx + 1}`,
        explanation: content,
      });
    }
  });

  return sections;
}

export default function NotesViewer({ notes = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedCardId, setCopiedCardId] = useState(null);
  const [collapsedCards, setCollapsedCards] = useState({});

  const sections = useMemo(() => normalizeNotes(notes), [notes]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter(
      sec =>
        sec.heading.toLowerCase().includes(query) ||
        (typeof sec.explanation === 'string' && sec.explanation.toLowerCase().includes(query))
    );
  }, [sections, searchQuery]);

  const toggleCardCollapse = (id) => {
    setCollapsedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopySection = (id, heading, explanation) => {
    const textToCopy = `### ${heading}\n\n${typeof explanation === 'string' ? explanation : JSON.stringify(explanation, null, 2)}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCardId(id);
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  const handleCopyAll = () => {
    if (sections.length === 0) return;
    const fullNotesText = sections
      .map((sec, i) => `## ${i + 1}. ${sec.heading}\n\n${typeof sec.explanation === 'string' ? sec.explanation : JSON.stringify(sec.explanation, null, 2)}`)
      .join('\n\n---\n\n');

    navigator.clipboard.writeText(fullNotesText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (!notes || notes.length === 0 || sections.length === 0) {
    return (
      <div className="p-12 text-center bg-gray-50/60 border border-dashed border-gray-200 rounded-3xl">
        <BookOpen className="w-10 h-10 text-zinc-400 mx-auto mb-3 stroke-[1.5]" />
        <h4 className="text-sm font-bold text-zinc-800 mb-1">No Study Notes Generated Yet</h4>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Click "Study Notes" in the generator tools above to create detailed, structured notes for this topic.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-lg font-extrabold text-zinc-900 tracking-tight">
                Structured Study Notes
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {sections.length} {sections.length === 1 ? 'Module' : 'Modules'}
              </span>
            </div>
            <p className="text-xs text-zinc-500">Comprehensive summary & core concepts</p>
          </div>
        </div>

        {/* Quick Toolbar Actions */}
        <div className="flex items-center gap-2">
          {/* Search Filter Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all w-36 sm:w-44"
            />
          </div>

          {/* Copy All Notes Button */}
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied All</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-300" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Warning if search has 0 results */}
      {filteredSections.length === 0 && (
        <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-2xl">
          <p className="text-xs text-zinc-600 font-medium">No notes match "{searchQuery}".</p>
        </div>
      )}

      {/* Rendered Notes Section Cards */}
      <div className="space-y-4">
        {filteredSections.map((sec, idx) => {
          const isCollapsed = collapsedCards[sec.id];
          const isCopied = copiedCardId === sec.id;
          const displayIndex = (idx + 1).toString().padStart(2, '0');

          return (
            <div
              key={sec.id}
              className="bg-white border border-gray-200/90 rounded-2xl shadow-2xs hover:shadow-xs transition-all duration-200 overflow-hidden group"
            >
              {/* Card Title Header Bar */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/40 border-b border-gray-100 flex items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                    {displayIndex}
                  </span>
                  <h4 className="font-heading text-sm sm:text-base font-bold text-zinc-950 truncate leading-snug">
                    {sec.heading}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Single Section Copy Button */}
                  <button
                    onClick={() => handleCopySection(sec.id, sec.heading, sec.explanation)}
                    title="Copy this section"
                    className="p-1.5 text-zinc-500 hover:text-zinc-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  {/* Collapse Toggle Button */}
                  <button
                    onClick={() => toggleCardCollapse(sec.id)}
                    title={isCollapsed ? 'Expand section' : 'Collapse section'}
                    className="p-1.5 text-zinc-500 hover:text-zinc-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all cursor-pointer"
                  >
                    {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Card Content Body */}
              {!isCollapsed && (
                <div className="p-5 sm:p-6 bg-white text-zinc-900">
                  <FormattedContent content={sec.explanation} />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
