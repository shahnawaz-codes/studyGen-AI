import React from 'react';
import { BookOpen } from 'lucide-react';
import FormattedContent from '../FormattedContent';

export default function NotesViewer({ notes = [] }) {
  if (!notes || notes.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 text-sm">
        No notes generated yet. Click "Notes" above to generate study notes.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-heading text-lg font-bold text-zinc-900 border-b border-gray-100 pb-2 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-emerald-600" />
        Structured Study Notes
      </h3>
      {notes.map((note, idx) => {
        const heading = note.heading || note.title;
        const explanation = note.explanation || note.content;

        return (
          <div key={note._id || idx} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
            <h4 className="font-bold text-base text-zinc-900">{heading}</h4>
            <div className="text-xs text-zinc-700 leading-relaxed">
              <FormattedContent content={explanation} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
