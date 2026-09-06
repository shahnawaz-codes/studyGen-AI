import React, { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';

export default function CodeBlockViewer({ codeData }) {
  const [copied, setCopied] = useState(false);

  if (!codeData) {
    return (
      <div className="p-8 text-center text-zinc-500 text-sm">
        No code snippet generated yet. Click "Code" above to generate a code example.
      </div>
    );
  }

  const content = codeData.content || codeData;
  const codeString = typeof content === 'string' ? content : (content.code || '');
  const language = content.language || 'javascript';
  const explanation = content.explanation;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h3 className="font-heading text-lg font-bold text-zinc-900 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-emerald-600" />
          Code Snippet ({language})
        </h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>

      <pre className="bg-zinc-900 text-zinc-100 p-5 rounded-2xl overflow-x-auto text-xs font-mono leading-relaxed border border-zinc-800">
        <code>{codeString}</code>
      </pre>

      {explanation && (
        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
          <p className="text-xs text-emerald-950 font-medium leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  );
}
